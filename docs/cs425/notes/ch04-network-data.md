# Chapter 4 - The Network Layer: Data Plane

**Reading:** Kurose & Ross, chapter 4

## The two planes

- **Data plane.** Per-router, per-packet. Given a packet on an input port, which
  output port does it leave by? This chapter.
- **Control plane.** Network-wide. How do the forwarding tables get computed in the
  first place? Chapter 5.

**Forwarding** is the local action: move a packet from input to output. **Routing**
is the global one: determine the path. Forwarding happens in nanoseconds, routing in
seconds.

## 4.1 Network layer service model

The Internet's network layer offers exactly one service: **best effort**. No
guarantee of delivery, ordering, timing, or bandwidth. Everything else is built on
top of that by the layers above, which is why chapter 3 was so long.

## 4.2 What is inside a router

Four components:

1. **Input ports.** Line termination, link layer processing, and lookup. The lookup
   is done in the input port itself so it can happen at line rate.
2. **Switching fabric.** Memory, bus, or crossbar. This is where packets move from
   input to output.
3. **Output ports.** Queuing, link layer processing, transmission.
4. **Routing processor.** Runs the control plane, computes the tables.

**Longest prefix matching.** The forwarding table maps address prefixes to output
links. When several prefixes match a destination, the **longest** one wins. This is
the lookup [P3](../assignments/p3.md) has you implement.

**Queuing and loss.** Buffers at input ports cause head-of-line blocking. Buffers at
output ports overflow, and that overflow is packet loss. How much buffering a router
should have is a genuinely contested question; the classic rule of thumb is
`RTT × C`, and it is probably too large.

**Scheduling:** FIFO, priority, round robin, weighted fair queuing.

## 4.3 The Internet Protocol

**IPv4 datagram format.** Version, header length, type of service, datagram length,
identifier, flags, fragmentation offset, TTL, upper layer protocol, header checksum,
source and destination addresses, options, data.

**Fragmentation.** A link's MTU may be smaller than the datagram. The router
fragments; the **destination host** reassembles, not the intermediate routers. The
identifier, flags, and offset fields exist for this.

**Addressing.** An IP address is attached to an **interface**, not a host. A router
with three interfaces has three addresses.

**CIDR.** `a.b.c.d/x` where `x` is the number of prefix bits. The prefix identifies
the network, the remaining bits identify the interface within it. Subnetting is
splitting a block by lengthening the prefix.

::: tip

Work subnetting in binary until it stops feeling like magic. `192.168.1.0/26` gives
four subnets of 64 addresses each, 62 of which are usable, and you should be able
to derive that rather than recall it. [P3](../assignments/p3.md) makes you write the
arithmetic.

:::

**DHCP.** How a host gets an address on joining a network: discover, offer, request,
ACK. Four messages, all broadcast at the start because the host has no address yet.

**NAT.** A router rewrites the source address and port of outgoing datagrams to its
own public address and a unique port, keeps a translation table, and reverses the
rewrite on the way back. It buys address conservation and breaks anything that
expects a host to be reachable from outside, which is why P2P applications need
hole punching.

**IPv6.** 128 bit addresses, fixed 40 byte header, no fragmentation at routers, no
header checksum. Transition happens by **tunneling** IPv6 datagrams inside IPv4
ones, because a flag day was never possible.

## 4.4 Generalized forwarding and SDN

Traditional forwarding matches on destination IP only. **Generalized forwarding**
matches on any set of header fields across layers and takes an action: forward,
drop, modify, send to controller.

**OpenFlow** flow tables are the canonical example: match on a header field
combination, act. This one abstraction expresses routers, switches, firewalls, load
balancers, and NAT boxes, which is the point.

## 4.5 Middleboxes

Firewalls, NAT boxes, load balancers, caches. They violate the end-to-end principle
that the original architecture assumed, and they are everywhere, and the tension
between those two facts is worth thinking about.
