# Midterm Review

**Covers:** chapters 1 through 4

This session is a working review, not a lecture. Come with questions.

## The four things that decide most grades

**1. Transmission delay versus propagation delay.** Transmission delay is `L/R`:
how long to push the bits out. Propagation delay is `d/s`: how long for a bit to
travel the wire. They are independent. A satellite link has enormous propagation
delay and possibly trivial transmission delay; a slow link to a machine in the next
room is the reverse.

**2. Flow control versus congestion control.** Flow control keeps the sender from
overrunning the **receiver's buffer**, and it is signaled by the advertised receive
window. Congestion control keeps senders from overrunning the **network**, and it is
signaled by loss and delay. Same-shaped mechanism, entirely different problem.

**3. Cumulative acknowledgements.** A TCP ACK number is the next byte **expected**,
not the last byte received. Go-Back-N is cumulative; Selective Repeat is individual.
Half the tracing questions turn on this.

**4. Longest prefix matching.** A forwarding table is searched for the **longest**
matching prefix, not the first one that matches. Entries overlap on purpose, so the
order they are written in tells you nothing. Work the table top to bottom, keep
every match, then take the most specific.

## Worked problems to bring

Do these before the review session and bring what you got stuck on:

- Compute end-to-end delay for a packet crossing three links with different rates
  and lengths.
- Compute the throughput of a path where the bottleneck is the second of four links.
- Count RTTs for a page load with `n` objects, under non-persistent and persistent
  HTTP.
- Trace a full DNS resolution with an empty cache.
- Trace Go-Back-N with window 4 when packet 2 is lost.
- Trace Selective Repeat on the same loss and compare what got retransmitted.
- Trace `cwnd` for 20 RTTs through one triple-duplicate-ACK event and one timeout.
- Given a forwarding table with overlapping prefixes, say which interface each of
  several destination addresses leaves on.
- Split a /24 into subnets that fit a given set of host counts, and give the CIDR
  block of each.
- Walk a packet through a NAT: what the translation table holds, and what the
  addresses and ports look like on each side.

## Format reminder

60 questions, 2 points each, 75 minutes, one attempt, taken in Canvas. Questions
marked **select all that apply** are all-or-nothing.

See the [midterm study guide](../assignments/midterm-exam-guide.md) for the full
topic list.
