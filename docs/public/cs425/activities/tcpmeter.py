#!/usr/bin/env python3
"""CS425 A5 TCP meter: pushes bytes through one TCP connection and reports what TCP did.

It opens a TCP connection to itself on 127.0.0.1, sends as fast as TCP allows for
a few seconds, and once a second prints the throughput the receiver saw beside
the sender's congestion window, its smoothed round trip time, and how many
segments it has retransmitted so far. Those last three come straight from the
kernel (the TCP_INFO socket option), so they are TCP's own numbers, not guesses.

Run it inside a network namespace whose loopback has been slowed down with tc
netem; the A5 page has the steps:

    python3 tcpmeter.py               # 10 seconds
    python3 tcpmeter.py --seconds 20

Linux only, standard library only, Python 3.9 or later.
"""

from __future__ import annotations

import argparse
import socket
import struct
import sys
import threading
import time
from typing import Final, NamedTuple

CHUNK: Final = 64 * 1024

# struct tcp_info from linux/tcp.h: eight one byte fields, then 32 bit fields
# starting with tcpi_rto. Only the first 104 bytes are read, which every kernel
# since 2.6 provides, so the indexes below are into the 24 unsigned ints.
TCP_INFO_FMT: Final = "<8B24I"
TCP_INFO_LEN: Final = struct.calcsize(TCP_INFO_FMT)
I_SND_MSS: Final = 8 + 2
I_RTT: Final = 8 + 15
I_SND_SSTHRESH: Final = 8 + 17
I_SND_CWND: Final = 8 + 18
I_TOTAL_RETRANS: Final = 8 + 23

# The kernel reports "no slow start threshold yet" as this sentinel.
INFINITE_SSTHRESH: Final = 0x7FFFFFFF


class TcpInfo(NamedTuple):
    mss: int
    rtt_ms: float
    ssthresh: int | None
    cwnd: int
    retrans: int


def tcp_info(sock: socket.socket) -> TcpInfo:
    raw = sock.getsockopt(socket.IPPROTO_TCP, socket.TCP_INFO, TCP_INFO_LEN)
    fields = struct.unpack(TCP_INFO_FMT, raw[:TCP_INFO_LEN])
    ssthresh = fields[I_SND_SSTHRESH]
    return TcpInfo(
        mss=fields[I_SND_MSS],
        rtt_ms=fields[I_RTT] / 1000.0,
        ssthresh=None if ssthresh >= INFINITE_SSTHRESH else ssthresh,
        cwnd=fields[I_SND_CWND],
        retrans=fields[I_TOTAL_RETRANS],
    )


class Receiver:
    """Reads and discards everything that arrives, counting the bytes."""

    def __init__(self, listener: socket.socket) -> None:
        self.listener = listener
        self.received = 0
        self.lock = threading.Lock()

    def run(self) -> None:
        conn, _ = self.listener.accept()
        with conn:
            while True:
                data = conn.recv(CHUNK)
                if not data:
                    return
                with self.lock:
                    self.received += len(data)

    def total(self) -> int:
        with self.lock:
            return self.received


def mbit(nbytes: int, seconds: float) -> float:
    return nbytes * 8 / seconds / 1e6


def main() -> int:
    parser = argparse.ArgumentParser(description="Report what TCP does on a slowed down loopback link.")
    parser.add_argument("--seconds", type=int, default=10, help="how long to send (default 10)")
    args = parser.parse_args()
    seconds: int = args.seconds

    listener = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    listener.bind(("127.0.0.1", 0))
    listener.listen(1)
    receiver = Receiver(listener)
    thread = threading.Thread(target=receiver.run, daemon=True)
    thread.start()

    sender = socket.create_connection(listener.getsockname())
    # A short timeout on send, so a stalled connection still gets its line
    # printed every second instead of blocking past the end of the run.
    sender.settimeout(0.1)
    payload = b"\0" * CHUNK

    print(f"{'sec':>4} {'Mbit/s':>8} {'cwnd':>6} {'ssthresh':>9} {'rtt ms':>8} {'retrans':>8}")
    start = time.monotonic()
    next_report = start + 1.0
    last_total = 0
    second = 0
    while second < seconds:
        try:
            sender.send(payload)
        except socket.timeout:
            pass
        now = time.monotonic()
        if now < next_report:
            continue
        second += 1
        total = receiver.total()
        info = tcp_info(sender)
        ssthresh = "-" if info.ssthresh is None else str(info.ssthresh)
        print(f"{second:>4} {mbit(total - last_total, 1.0):>8.2f} {info.cwnd:>6} "
              f"{ssthresh:>9} {info.rtt_ms:>8.1f} {info.retrans:>8}", flush=True)
        last_total = total
        next_report += 1.0

    elapsed = time.monotonic() - start
    info = tcp_info(sender)
    sender.close()
    print(f"\naverage {mbit(receiver.total(), elapsed):.2f} Mbit/s over {elapsed:.0f} s, "
          f"MSS {info.mss} bytes, {info.retrans} segments retransmitted")
    return 0


if __name__ == "__main__":
    sys.exit(main())
