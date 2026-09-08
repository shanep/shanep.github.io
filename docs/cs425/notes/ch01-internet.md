# Chapter 1 - Computer Networks and the Internet

**Reading:** Kurose & Ross, chapter 1

## Where we are going

This chapter is the map for the whole course. Everything in it gets revisited in
depth later, so the goal here is not mastery, it is vocabulary and a mental model
you can hang the next fourteen weeks on.

## 1.1 What is the Internet?

Two answers, and you need both.

**The nuts-and-bolts view.** Hosts (end systems) run applications. They connect to
the network through access networks, which connect to ISPs, which connect to each
other. Packet switches (routers and link-layer switches) forward packets. Links
carry them.

**The service view.** The Internet is infrastructure that provides services to
applications. It offers an API to applications, and the whole layered design exists
to make that API simple enough to program against.

A **protocol** defines the format and order of messages exchanged between two or
more communicating entities, plus the actions taken on transmission or receipt.

## 1.2 The network edge

- **Access networks:** DSL, cable, FTTH, ethernet, WiFi, cellular.
- Cable is **shared** among homes; DSL is **dedicated**. That difference shows up
  in the throughput you actually get at 8pm.
- **Physical media:** guided (twisted pair, coax, fiber) versus unguided (radio).

## 1.3 The network core

**Packet switching.** Hosts break messages into packets. Each packet travels
through the network independently. Routers use **store-and-forward** transmission:
the entire packet must arrive before the router begins forwarding it.

**Circuit switching.** Resources are reserved end to end for the duration of the
call. No queuing delay, but the reservation is wasted whenever the caller is silent.

Packet switching won for data because data traffic is bursty. Circuit switching
allocates for the peak; packet switching allocates for the average and queues the
difference.

## 1.4 Delay, loss, and throughput

Four sources of delay at each node:

| Delay | Cause | Formula |
| ----- | ----- | ------- |
| Processing | Check header, decide output link | typically microseconds |
| Queuing | Waiting for the output link to free up | depends on congestion |
| Transmission | Pushing bits onto the link | `L / R` |
| Propagation | Bits traveling down the link | `d / s` |

::: warning

Transmission delay and propagation delay are the pair students confuse most.
Transmission delay depends on the packet length and the link *rate*. Propagation
delay depends on the link *length* and the speed of the medium. They are unrelated,
and a link can have huge propagation delay with negligible transmission delay, or
the reverse.

:::

**Traffic intensity** is `La/R`, where `L` is packet length, `a` is average arrival
rate, and `R` is the link rate. As it approaches 1, queuing delay grows without
bound. Design so it stays comfortably below 1.

**Throughput** on an end-to-end path is set by the **bottleneck link**, the one
with the smallest rate on the path.

## 1.5 Protocol layers and service models

The five-layer Internet model:

| Layer | Unit | Responsibility |
| ----- | ---- | -------------- |
| Application | message | HTTP, SMTP, DNS: what the applications say to each other |
| Transport | segment | TCP, UDP: process-to-process delivery |
| Network | datagram | IP, routing: host-to-host delivery |
| Link | frame | Ethernet, WiFi: hop-to-hop delivery |
| Physical | bits | getting bits onto the medium |

**Encapsulation.** Each layer takes the unit from above and adds its own header.
A message becomes a segment becomes a datagram becomes a frame. On the way up, each
layer strips its own header and hands the payload upward. Every diagram in this
course is ultimately a picture of this process.

## 1.6 Networks under attack

- **Malware:** viruses (require user action), worms (do not).
- **Denial of service:** vulnerability attacks, bandwidth flooding, connection
  flooding.
- **Packet sniffing:** on a broadcast medium, anyone can read everything.
- **IP spoofing:** nothing in IP itself verifies the source address.

The Internet was designed among trusted parties. Chapter 8 is about what we bolted
on afterward.

## 1.7 History

Worth reading for context. Not worth memorizing dates.

## Check yourself

- A 1500 byte packet crosses a 10 Mbps link that is 3000 km long. Which dominates,
  transmission delay or propagation delay?
- Why does adding a second parallel link between two routers not necessarily double
  end-to-end throughput?
- List, in order, every header that gets added to an HTTP GET on its way down the
  stack.
