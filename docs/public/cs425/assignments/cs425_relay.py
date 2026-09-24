#!/usr/bin/env python3
"""CS425 P2 relay: pairs a sender with a receiver and damages what passes between them.

The protocol is specified on the P2 assignment page. In short, each side
registers with one plain text datagram and waits for the reply:

    receiver:  HELLO <session> recv
    sender:    HELLO <session> send <loss> <corrupt> <dup>

and the relay answers ``OK`` or ``ERR <reason>``. From then on every datagram
from one member of the session is forwarded to the other, and each one, in each
direction, is independently dropped with probability ``loss``, otherwise has one
random bit flipped with probability ``corrupt``, otherwise is delivered twice
with probability ``dup``. Hellos and their replies are never damaged.

Members are known by the address and port they said hello from. A session is
forgotten after it has been idle for ``--idle`` seconds.

``--delay`` holds every forwarded datagram for that many milliseconds, so a relay
on the same machine as the sender and receiver still gives them a realistic round
trip time: ``--delay 50`` is 50 ms each way, a 100 ms round trip.

Students run it on their own machine, beside their sender and receiver:

    python3 cs425_relay.py --delay 50

It binds 127.0.0.1 by default, so on a shared machine like Onyx nobody else can
reach it. Standard library only, Python 3.9 or later.
"""

from __future__ import annotations

import argparse
import heapq
import itertools
import logging
import random
import re
import selectors
import socket
import time
from dataclasses import dataclass, field
from typing import Final

Addr = tuple[str, int]

MAX_DATAGRAM: Final = 2048
MAX_RATE: Final = 0.5
SESSION_RE: Final = re.compile(r"[a-z0-9-]{1,32}")
RATE_RE: Final = re.compile(r"[0-9]*\.?[0-9]+")

log = logging.getLogger("cs425-relay")


@dataclass
class Rates:
    loss: float = 0.0
    corrupt: float = 0.0
    dup: float = 0.0


@dataclass
class Counters:
    """What happened to the datagrams travelling in one direction."""

    received: int = 0
    dropped: int = 0
    corrupted: int = 0
    duplicated: int = 0
    throttled: int = 0

    def summary(self) -> str:
        return (
            f"{self.received} in, {self.dropped} dropped, {self.corrupted} corrupted, "
            f"{self.duplicated} duplicated, {self.throttled} throttled"
        )


@dataclass
class Session:
    name: str
    receiver: Addr
    sender: Addr | None = None
    rates: Rates = field(default_factory=Rates)
    last_seen: float = 0.0
    created: float = 0.0
    to_receiver: Counters = field(default_factory=Counters)
    to_sender: Counters = field(default_factory=Counters)
    # Token bucket that caps the forwarding rate, so the relay cannot be
    # turned into a traffic cannon aimed at an address someone spoofed.
    tokens: float = 0.0
    refilled: float = 0.0

    def members(self) -> list[Addr]:
        return [self.receiver] if self.sender is None else [self.receiver, self.sender]


@dataclass(frozen=True)
class Hello:
    session: str
    role: str
    rates: Rates


class BadHello(Exception):
    pass


def parse_rate(text: str) -> float:
    try:
        value = float(text)
    except ValueError:
        raise BadHello(f"bad rate {text!r}") from None
    # float() also accepts nan, inf and exponents, none of which belong here.
    if not RATE_RE.fullmatch(text) or not 0.0 <= value <= MAX_RATE:
        raise BadHello(f"rate {text!r} is not between 0 and {MAX_RATE}")
    return value


def parse_hello(data: bytes) -> Hello:
    try:
        text = data.decode("ascii")
    except UnicodeDecodeError:
        raise BadHello("hello is not ASCII") from None
    words = text.split(" ")
    if len(words) < 3 or words[0] != "HELLO":
        raise BadHello("expected HELLO <session> recv|send")
    session, role = words[1], words[2]
    if not SESSION_RE.fullmatch(session):
        raise BadHello("session must be 1 to 32 of a-z, 0-9 and -")
    if role == "recv":
        if len(words) != 3:
            raise BadHello("expected HELLO <session> recv")
        return Hello(session, role, Rates())
    if role == "send":
        if len(words) != 6:
            raise BadHello("expected HELLO <session> send <loss> <corrupt> <dup>")
        return Hello(session, role, Rates(*(parse_rate(w) for w in words[3:6])))
    raise BadHello(f"role must be recv or send, not {role!r}")


class Relay:
    def __init__(
        self,
        sock: socket.socket,
        *,
        idle: float = 30.0,
        max_sessions: int = 500,
        max_pps: float = 5000.0,
        delay: float = 0.0,
        rng: random.Random | None = None,
    ) -> None:
        self.sock = sock
        self.idle = idle
        self.max_sessions = max_sessions
        self.max_pps = max_pps
        self.rng = rng if rng is not None else random.Random()
        self.sessions: dict[str, Session] = {}
        self.members: dict[Addr, Session] = {}
        # Forwarded datagrams waiting out --delay: (due, tiebreak, data, dest).
        # The delay is the same for every datagram, so this never reorders.
        self.delay = delay
        self.pending: list[tuple[float, int, bytes, Addr]] = []
        self._order = itertools.count()

    # ------------------------------------------------------------ sessions

    def _drop_session(self, s: Session, why: str) -> None:
        for addr in s.members():
            if self.members.get(addr) is s:
                del self.members[addr]
        if self.sessions.get(s.name) is s:
            del self.sessions[s.name]
        log.info(
            "session %s ended (%s) after %.1fs; to receiver: %s; to sender: %s",
            s.name, why, s.last_seen - s.created,
            s.to_receiver.summary(), s.to_sender.summary(),
        )

    def expire(self, now: float) -> None:
        for s in [s for s in self.sessions.values() if now - s.last_seen > self.idle]:
            self._drop_session(s, "idle")

    def _leave_other_sessions(self, addr: Addr, keep: Session | None) -> None:
        old = self.members.get(addr)
        if old is not None and old is not keep:
            self._drop_session(old, f"{addr[0]}:{addr[1]} joined another session")

    # --------------------------------------------------------------- hello

    def hello(self, data: bytes, addr: Addr, now: float) -> str:
        try:
            h = parse_hello(data)
        except BadHello as e:
            return f"ERR {e}"

        s = self.sessions.get(h.session)
        if h.role == "recv":
            if s is not None and s.receiver == addr:
                s.last_seen = now
                return "OK"  # a retry after our first OK was lost
            if s is not None:
                # A rerun from the machine that holds the session replaces it,
                # so a crashed run does not lock its owner out for --idle seconds.
                if any(m[0] != addr[0] for m in s.members()):
                    return "ERR session in use"
                self._drop_session(s, "replaced by a new receiver")
            if len(self.sessions) >= self.max_sessions:
                return "ERR relay is full, try again shortly"
            self._leave_other_sessions(addr, None)
            s = Session(h.session, addr, last_seen=now, created=now,
                        tokens=self.max_pps, refilled=now)
            self.sessions[h.session] = s
            self.members[addr] = s
            log.info("session %s: receiver %s:%d", s.name, *addr)
            return "OK"

        if s is None:
            return "ERR no receiver"
        if s.sender == addr:
            s.last_seen = now
            return "OK"
        if s.receiver == addr:
            return "ERR this address is the receiver"
        if s.sender is not None:
            if s.sender[0] != addr[0]:
                return "ERR session in use"
            del self.members[s.sender]
        self._leave_other_sessions(addr, s)
        s.sender = addr
        s.rates = h.rates
        s.last_seen = now
        self.members[addr] = s
        log.info(
            "session %s: sender %s:%d, loss %g corrupt %g dup %g",
            s.name, addr[0], addr[1], h.rates.loss, h.rates.corrupt, h.rates.dup,
        )
        return "OK"

    # ------------------------------------------------------------ forwarding

    def _take_token(self, s: Session, now: float) -> bool:
        s.tokens = min(self.max_pps, s.tokens + (now - s.refilled) * self.max_pps)
        s.refilled = now
        if s.tokens < 1.0:
            return False
        s.tokens -= 1.0
        return True

    def forward(self, data: bytes, addr: Addr, now: float) -> list[tuple[bytes, Addr]]:
        """What to send, and where, for one datagram from a session member."""
        s = self.members.get(addr)
        if s is None or s.sender is None:
            return []  # a stranger, or a receiver whose sender has not arrived
        to_receiver = addr == s.sender
        dest = s.receiver if to_receiver else s.sender
        count = s.to_receiver if to_receiver else s.to_sender
        s.last_seen = now
        count.received += 1

        if not self._take_token(s, now):
            count.throttled += 1
            return []
        r = s.rates
        if self.rng.random() < r.loss:
            count.dropped += 1
            return []
        if data and self.rng.random() < r.corrupt:
            bit = self.rng.randrange(len(data) * 8)
            flipped = bytearray(data)
            flipped[bit // 8] ^= 1 << (bit % 8)
            count.corrupted += 1
            return [(bytes(flipped), dest)]
        if self.rng.random() < r.dup:
            count.duplicated += 1
            return [(data, dest), (data, dest)]
        return [(data, dest)]

    # ------------------------------------------------------------------ loop

    def handle(self, data: bytes, addr: Addr, now: float) -> list[tuple[bytes, Addr]]:
        if data.startswith(b"HELLO"):
            return [(self.hello(data, addr, now).encode("ascii"), addr)]
        if len(data) > MAX_DATAGRAM:
            return []
        return self.forward(data, addr, now)

    def serve_forever(self) -> None:
        sel = selectors.DefaultSelector()
        sel.register(self.sock, selectors.EVENT_READ)
        next_sweep = time.monotonic() + 1.0
        while True:
            timeout = 1.0
            if self.pending:
                timeout = min(timeout, max(0.0, self.pending[0][0] - time.monotonic()))
            for _ in sel.select(timeout=timeout):
                self.drain()
            now = time.monotonic()
            self.release(now)
            if now >= next_sweep:
                self.expire(now)
                next_sweep = now + 1.0

    def drain(self) -> None:
        """Handle every datagram already queued on the socket."""
        while True:
            try:
                data, raw = self.sock.recvfrom(MAX_DATAGRAM + 1)
            except BlockingIOError:
                return
            except OSError as e:
                # An ICMP port unreachable from a member that has gone away
                # surfaces here on Linux; it is about an old datagram, not this one.
                log.debug("recvfrom: %s", e)
                continue
            addr: Addr = (raw[0], raw[1])
            now = time.monotonic()
            out = self.handle(data, addr, now)
            # Hello replies go straight back; only forwarded traffic is delayed.
            if self.delay <= 0 or data.startswith(b"HELLO"):
                for d, dest in out:
                    self.send(d, dest)
            else:
                for d, dest in out:
                    heapq.heappush(self.pending, (now + self.delay, next(self._order), d, dest))

    def release(self, now: float) -> None:
        """Send every delayed datagram whose time has come."""
        while self.pending and self.pending[0][0] <= now:
            _, _, data, dest = heapq.heappop(self.pending)
            self.send(data, dest)

    def send(self, data: bytes, dest: Addr) -> None:
        try:
            self.sock.sendto(data, dest)
        except OSError as e:
            log.debug("sendto %s:%d: %s", dest[0], dest[1], e)


def main() -> None:
    ap = argparse.ArgumentParser(description="CS425 P2 relay")
    ap.add_argument("--host", default="127.0.0.1",
                    help="address to bind (default: 127.0.0.1, this machine only)")
    ap.add_argument("--port", type=int, default=4250, help="UDP port (default: 4250)")
    ap.add_argument("--idle", type=float, default=30.0,
                    help="seconds before an idle session is forgotten (default: 30)")
    ap.add_argument("--max-sessions", type=int, default=500)
    ap.add_argument("--max-pps", type=float, default=5000.0,
                    help="datagrams per second forwarded per session (default: 5000)")
    ap.add_argument("--delay", type=float, default=0.0, metavar="MS",
                    help="hold each forwarded datagram this many milliseconds (default: 0)")
    ap.add_argument("--seed", type=int, help="seed the damage, for reproducible runs")
    ap.add_argument("-v", "--verbose", action="store_true")
    args = ap.parse_args()
    if args.delay < 0:
        ap.error("--delay cannot be negative")

    logging.basicConfig(
        level=logging.DEBUG if args.verbose else logging.INFO,
        format="%(asctime)s %(message)s",
    )
    sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    sock.setsockopt(socket.SOL_SOCKET, socket.SO_RCVBUF, 4 << 20)
    try:
        sock.bind((args.host, args.port))
    except OSError as e:
        ap.exit(1, f"cs425_relay.py: cannot use udp {args.host}:{args.port}: {e.strerror}; "
                   "pick another --port\n")
    sock.setblocking(False)
    rng = random.Random(args.seed) if args.seed is not None else None
    log.info("listening on udp %s:%d, delay %g ms", args.host, args.port, args.delay)
    Relay(sock, idle=args.idle, max_sessions=args.max_sessions, max_pps=args.max_pps,
          delay=args.delay / 1000.0, rng=rng).serve_forever()


if __name__ == "__main__":
    main()
