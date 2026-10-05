---
next: false
prev: false
---

# A3 - Interrogating the Transport Layer with Claude Code

<SlideView />

## One address, dozens of conversations

Right now your laptop has one IP address and dozens of open connections: a
browser with a pile of tabs, Discord, Spotify, a cloud sync client, an update
check. Every segment that arrives is addressed to the same IP.

So who decides which program gets it? That is the first job of the transport
layer, and today you watch it happen.

## Host to host versus process to process

- **The network layer** gets a datagram from one host to another host. It knows
  nothing about programs.
- **The transport layer** gets data from one process to another process, using
  what the network layer gives it.

The book's analogy: the postal service delivers to the house, and someone in the
house hands each letter to the right kid. It is rough, but it is the right split.

## Ports pick the process

A port is just a 16 bit number, so 0 to 65,535.

| Range | Who uses it | Examples |
| ----- | ----------- | -------- |
| 0 to 1023 | well known services | 22 SSH, 25 SMTP, 53 DNS, 443 HTTPS |
| 1024 to 49151 | registered services | 3306 MySQL, 5432 PostgreSQL |
| 49152 to 65535 | ephemeral, handed to clients | your browser's side of a connection |

Linux hands out ephemeral ports from **32768 to 60999** by default, so a client
port is usually a big number you never chose.

## Demultiplexing

Every segment carries a source port and a destination port. When one arrives,
the operating system reads the header and hands the data to the socket that
matches.

The interesting question is **what** it matches on. Chapter 3 gives two
different answers, one for UDP and one for TCP, and they lead to very different
servers.

## A UDP socket is named by two things

A UDP socket is identified by a **two-tuple**: destination IP and destination
port.

- Every datagram sent to `10.0.0.5:53` lands on the same socket, no matter who
  sent it.
- The server finds out who sent each one by asking for the source address when
  it reads it (`recvfrom`).

That is how one DNS server process answers thousands of clients without opening
anything new per client.

## A TCP socket is named by four things

A TCP socket is identified by a **four-tuple**: source IP, source port,
destination IP, destination port.

- A web server listening on port 443 with 10,000 clients has 10,000 connected
  sockets, all on port 443.
- Each one differs in the client's IP or port, which is enough to tell them
  apart.

The listening socket only takes new connections. Each accepted connection gets
its own socket.

## UDP: just add ports

UDP adds almost nothing to IP. Its header is **8 bytes**: source port,
destination port, length and checksum.

- No handshake, so the first datagram carries data
- No retransmission, no ordering, no flow or congestion control
- Each `send` becomes one datagram, and the receiver gets it whole or not at all

DNS runs over it, and so does QUIC, the transport under HTTP/3. Google decided
it was easier to build reliability on top of UDP than to change TCP.

## The Internet checksum

UDP and TCP both carry a 16 bit checksum: the **one's complement** of the one's
complement sum of the data.

With 8 bit words to keep it short:

```text
   11001100
 + 10101010
 ----------
 1 01110110     a carry out of the top bit
 + 1            wraps around and is added back
 ----------
   01110111     the sum
   10001000     flip every bit: the checksum
```

The receiver adds everything, checksum included, and expects all ones.

## The checksum is weak on purpose

- It is cheap to compute, which mattered on 1980s hardware.
- It misses some errors. Swap two 16 bit words and the sum does not change.
- So the link layer adds a much stronger CRC on every hop, and TLS adds its own
  integrity check on top.

The checksum is the last line of defense end to end, not the only one.

## Why reliable transfer is hard

IP loses, duplicates, reorders and corrupts packets, and it does not tell anyone.
TCP has to hide all of that with four tools:

- **Checksums** to notice corruption
- **Sequence numbers** to notice gaps and duplicates
- **Acknowledgments** so the sender knows what arrived
- **Timers** so the sender eventually retransmits what did not

You build these yourself in P2, so today we leave the code alone and look at the
arithmetic.

## Stop-and-wait wastes the pipe

Send one packet, then wait a full round trip for its ACK. With `L` bits per
packet, link rate `R`, and round trip time `RTT`:

```text
U = (L / R) / (RTT + L / R)
```

A 100 Mbps link, a 50 ms round trip, 1,500 byte packets: `L/R` is 0.12 ms, so
`U = 0.12 / 50.12`, about **0.24%**. The link sits idle more than 99% of the
time.

## Pipelining fills the pipe

The fix is to have many packets **in flight** before the first ACK comes back.
Go-Back-N and selective repeat are two ways to keep track of them.

A real example of the limit: TCP's original window field was 16 bits, so at most
65,535 bytes in flight. Across a 150 ms trans-Pacific round trip that caps one
connection at about **3.5 Mbps**, no matter how fast the link is. RFC 1323 (1992)
added window scaling to get past it.

## TCP is a byte stream

TCP does not move messages. It moves an ordered stream of **bytes**, and it keeps
no record of where one `send` ended and the next began.

- Three quick `send` calls can arrive in one `recv`.
- One big `send` can arrive split across several.
- UDP keeps every datagram whole, because each one is its own unit.

This is why your P1 SMTP client had to look for `\r\n`. The protocol on top has to
mark where its messages end.

## Opening a connection

Before any data moves, TCP does a three way handshake:

1. Client to server: `SYN`, "I want to talk, my bytes start at x"
2. Server to client: `SYN ACK`, "OK, mine start at y, and I got yours"
3. Client to server: `ACK`, and now data can flow

That costs one round trip before the first byte of data, every time. Shaving it
off is one of the reasons QUIC exists.

## Closing a connection

Each side closes its own direction with a `FIN`, and the other side ACKs it. Four
segments in all, and the two halves can close at different times.

Then one side does not just go away. It sits in **TIME_WAIT** for twice the
**maximum segment lifetime** (MSL). RFC 793 suggested an MSL of 2 minutes, and real
systems use much less.

## Why TIME_WAIT exists

- **The last ACK can get lost.** If it does, the other side resends its `FIN`, and
  someone has to still be there to answer it.
- **Old segments wander.** A delayed segment from a dead connection could land in a
  brand new connection that reuses the same four-tuple. Waiting lets them die out.

It shows up in real life. A proxy that opens a new connection per request to one
backend leaves a port in TIME_WAIT for every request. Linux only has **28,232**
ephemeral ports to hand out, so a busy enough proxy runs out and cannot connect
at all.

## "Address already in use"

Every network programmer meets this one. You stop a server, start it again
immediately, and `bind` fails.

The port is not really in use: a socket from the old run is still winding down.
The socket option **`SO_REUSEADDR`** tells the operating system to let a new
server bind anyway. Keep that name in mind for Round 2.

## When the timer goes off

TCP cannot use a fixed timeout. A round trip is well under 1 ms in the same rack
and 200 ms across an ocean, and it changes from second to second on Wi-Fi.

```text
EstimatedRTT    = (1 - α) · EstimatedRTT + α · SampleRTT        α = 0.125
DevRTT          = (1 - β) · DevRTT + β · |SampleRTT - EstimatedRTT|   β = 0.25
TimeoutInterval = EstimatedRTT + 4 · DevRTT
```

`EstimatedRTT` 80 ms and a new sample of 60 ms gives `0.875 · 80 + 0.125 · 60 =`
**77.5 ms**. Look closely at `DevRTT`: which `EstimatedRTT` goes in, the one
before this update or after? Keep that question for Round 4.

## Too short or too long

- **Too short** and TCP retransmits segments that were only slow, which wastes the
  link and makes congestion worse.
- **Too long** and a lost segment stalls the whole connection while the timer runs.
- RFC 6298 starts the timer at **1 second** before any RTT has been measured. Linux
  never lets it drop below 200 ms.

## Your instruments

Everything today is visible from a shell:

| Tool | What it shows |
| ---- | ------------- |
| `nc` | netcat, a TCP or UDP client or server from the command line |
| `lsof -nP -i :5425` | every socket on port 5425, and which process owns it |
| `ss -tan` | every TCP socket and its state: `LISTEN`, `ESTAB`, `TIME-WAIT` |

`-n` and `-P` tell `lsof` to print numbers instead of looking up names, which is
faster and shows you what is really in the header.

## An agent that runs commands

Claude Code is not a chat window. It runs in a terminal, writes files, and runs
commands on the machine it is started on, and it asks first.

- It writes the small programs we need in seconds.
- It explains things fluently whether or not it is right.
- So the program is the vehicle, and **checking it** is the lesson.

Watch what it asks permission for. Approving one action is very different from
telling it not to ask again.

## Today

Laptops closed for Rounds 1 to 3. I drive Claude Code on the projector, you
predict, we run it, and you check both your prediction and Claude's explanation
against chapter 3.

In Round 4 your group drives, with whichever command line agent you use, or by
hand.

Grab a worksheet. We predict first, then we look.
