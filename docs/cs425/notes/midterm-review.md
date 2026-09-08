# Midterm Review

**Covers:** chapters 1 through 3

This session is a working review, not a lecture. Come with questions.

## The three things that decide most grades

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

## Format reminder

60 questions, 2 points each, 75 minutes, one attempt, taken in Canvas. Questions
marked **select all that apply** are all-or-nothing.

See the [midterm study guide](../assignments/midterm-exam-guide.md) for the full
topic list.
