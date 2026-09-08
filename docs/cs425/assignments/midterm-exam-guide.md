---
next: false
prev: false
---

# Midterm Study Guide

**Week 8 · 120 points · 75 minutes · taken in Canvas**

The midterm covers chapters 1 through 3: the Internet's architecture, the
application layer, and the transport layer. It is taken in Canvas during class.

## Format

- 60 questions, 2 points each.
- Multiple choice and multiple answer. Questions marked **select all that apply**
  are graded as a whole; partial credit is not given on those.
- One attempt, 75 minutes, closed book.

## What to review

### Chapter 1 - Computer Networks and the Internet

- The layered model: what service each layer provides to the one above it.
- Encapsulation: what gets added at each layer on the way down.
- The four sources of delay, and how to compute each: processing, queuing,
  transmission, propagation. Know the difference between transmission delay
  (`L/R`) and propagation delay (`d/s`) cold, because that distinction carries a
  disproportionate number of points.
- Throughput on a path with a bottleneck link.
- Packet switching versus circuit switching, and why the Internet chose the former.
- Traffic intensity and what happens as `La/R` approaches 1.

### Chapter 2 - The Application Layer

- Client-server versus peer-to-peer architectures.
- HTTP: request and response structure, persistent versus non-persistent
  connections, and how many RTTs a page load costs under each.
- Cookies, web caching, and conditional GET.
- SMTP, and how it differs from HTTP in who pushes and who pulls.
- DNS: the hierarchy, iterative versus recursive queries, and what caching changes.
- The socket API: what each call does and in what order.

### Chapter 3 - The Transport Layer

- Multiplexing and demultiplexing, and how UDP and TCP sockets are identified
  differently.
- UDP: what it provides and why an application would choose it.
- Reliable data transfer, rdt1.0 through rdt3.0. Be able to trace a protocol
  through a lost packet and a lost ACK.
- Go-Back-N versus Selective Repeat: window behavior, what gets retransmitted, and
  the sequence number space each requires.
- TCP segment structure, sequence and acknowledgement numbers.
- Connection establishment and teardown.
- Flow control versus congestion control. These are different problems solving for
  different things, and the exam will check that you know which is which.
- TCP congestion control: slow start, congestion avoidance, fast recovery, and how
  the window evolves after a triple duplicate ACK versus a timeout.

## How to prepare

Work the end-of-chapter problems in Kurose and Ross. The exam questions are drawn
from the same material as the knowledge checks, so if a chapter's knowledge check
gave you trouble, start there.
