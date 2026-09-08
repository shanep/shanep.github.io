# Chapter 3 - The Transport Layer

**Reading:** Kurose & Ross, chapter 3

This is the longest chapter in the course and the one the midterm weights heaviest.
It is also the chapter [P2](../assignments/p2.md) makes you implement.

## 3.1 Transport layer services

The transport layer provides **process-to-process** communication. The network
layer provides **host-to-host** communication. The transport layer's whole job is
extending host-to-host delivery to process-to-process delivery, plus whatever
guarantees it chooses to add on top.

## 3.2 Multiplexing and demultiplexing

**Multiplexing** at the sender: gather data from multiple sockets, add headers,
hand down. **Demultiplexing** at the receiver: use the header to deliver each
segment to the right socket.

The difference that matters:

- A **UDP socket** is identified by a two-tuple: destination IP and destination
  port. Two segments from different sources land in the same socket.
- A **TCP socket** is identified by a four-tuple: source IP, source port,
  destination IP, destination port. Two connections from different sources land in
  different sockets, which is how a web server keeps clients apart.

## 3.3 Connectionless transport: UDP

UDP adds almost nothing to IP: multiplexing, demultiplexing, and an optional
checksum. Eight bytes of header.

Why would anyone choose it?

- No connection establishment, so no handshake delay.
- No connection state, so a server can support more clients.
- Small header.
- **No congestion control**, so it sends as fast as the application wants. That is a
  feature for real-time media and a hazard for the network.

The UDP checksum uses one's complement arithmetic. It detects errors; it does not
correct them, and UDP simply discards a corrupted segment.

## 3.4 Principles of reliable data transfer

This section builds a reliable protocol incrementally over an increasingly hostile
channel. Learn the progression, because the exam traces it.

| Protocol | Channel assumption | Mechanism added |
| -------- | ------------------ | --------------- |
| rdt1.0 | perfectly reliable | nothing |
| rdt2.0 | bit errors | checksum, ACK, NAK, retransmit |
| rdt2.1 | bit errors, corrupted ACKs | sequence numbers (0, 1) |
| rdt2.2 | same | NAK-free, ACK carries a sequence number |
| rdt3.0 | bit errors and loss | countdown timer, retransmit on timeout |

::: warning

The subtle point in rdt2.1 is that a corrupted ACK forces a retransmission, which
creates a **duplicate** at the receiver. Sequence numbers exist to let the receiver
detect and discard duplicates. If you understand why one bit of sequence number is
enough for stop-and-wait, you understand the section.

:::

**Pipelining.** rdt3.0 is correct but hopeless: stop-and-wait utilization is
`L/R / (RTT + L/R)`, which on a fast long link is a fraction of a percent. Sending
multiple unacknowledged packets fixes it, and creates the need for a window.

**Go-Back-N.** The sender has a window of `N` unacknowledged packets. ACKs are
cumulative. On timeout, retransmit *everything* in the window. The receiver keeps
no buffer and discards out-of-order packets.

**Selective Repeat.** The sender retransmits only the packet that timed out. The
receiver buffers out-of-order packets and ACKs them individually. More efficient,
more state, and it requires the sequence number space to be at least twice the
window size, for a reason worth working through carefully.

## 3.5 Connection-oriented transport: TCP

**Segment structure.** Source and destination ports, sequence number, acknowledgement
number, header length, flags, receive window, checksum, urgent pointer.

**Sequence numbers count bytes, not segments.** The sequence number of a segment is
the byte-stream number of its first byte. The acknowledgement number is the sequence
number of the next byte expected. TCP ACKs are **cumulative**.

**Timeout estimation.** `EstimatedRTT` is an exponentially weighted moving average of
`SampleRTT`; `DevRTT` estimates the variability; the timeout is
`EstimatedRTT + 4 × DevRTT`. The safety margin scales with how erratic the path is.

**Fast retransmit.** Three duplicate ACKs mean a segment was lost. Do not wait for
the timer; resend immediately.

**Flow control.** The receiver advertises a **receive window** so the sender does not
overflow the receiver's buffer. This is a receiver-protection mechanism.

**Connection management.** The three-way handshake: SYN, SYNACK, ACK. Teardown: FIN,
ACK, FIN, ACK, plus the TIME_WAIT state.

## 3.6 Congestion control principles

Congestion is a **network** problem, not a receiver problem. The costs:

- Large queuing delays as arrival rate nears link capacity.
- Retransmissions of packets dropped by full queues.
- Wasted upstream capacity when a packet is dropped after already crossing links.

::: tip

Flow control protects the **receiver**. Congestion control protects the **network**.
Different problems, different mechanisms, and the exam will ask you which is which.

:::

## 3.7 TCP congestion control

The sender maintains a **congestion window** (`cwnd`) and sends at roughly
`cwnd / RTT`. The whole algorithm is about how `cwnd` changes.

- **Slow start.** Begin at 1 MSS and double `cwnd` every RTT. Exponential, despite
  the name, and it ends at the slow start threshold `ssthresh`.
- **Congestion avoidance.** Increase `cwnd` by 1 MSS per RTT. Linear.
- **Fast recovery.** After three duplicate ACKs, halve `cwnd`, set `ssthresh` to the
  new value, and continue in congestion avoidance.
- **Timeout.** Set `ssthresh` to half of `cwnd`, drop `cwnd` to 1 MSS, and re-enter
  slow start. A timeout is treated as much worse news than duplicate ACKs, because
  it is.

This is **AIMD**: additive increase, multiplicative decrease. The sawtooth it
produces is the shape of TCP.

**Fairness.** AIMD converges to an equal share among connections with the same RTT
crossing the same bottleneck. Applications that want more just open more
connections, which is not so much a flaw in TCP as a fact about the incentives.

**Explicit congestion notification (ECN)** lets routers signal congestion by marking
packets instead of dropping them.
