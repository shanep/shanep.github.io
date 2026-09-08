# Chapter 6 - The Link Layer and LANs

**Reading:** Kurose & Ross, chapter 6

## 6.1 Link layer services

The link layer moves a datagram over a **single link**, from one node to the
adjacent one. Services it may provide:

- Framing.
- Link access, which matters when the medium is shared.
- Reliable delivery, usually only on error-prone links like wireless. Doing it on
  fiber would be wasted effort.
- Error detection and correction, in hardware, in the network adapter.

The link layer is implemented mostly in the **network adapter** (NIC), which is why
it is the layer where hardware and software meet.

## 6.2 Error detection and correction

| Scheme | Detects | Cost |
| ------ | ------- | ---- |
| Parity (single bit) | odd numbers of bit errors | 1 bit |
| Two-dimensional parity | detects 2-bit errors, corrects 1-bit | a row and column |
| Checksum | most errors, weakly | 16 bits, cheap in software |
| CRC | all burst errors up to `r` bits | `r` bits, cheap in hardware |

**CRC** treats the bit string as a polynomial and computes the remainder after
division by a generator polynomial, modulo 2. Modulo 2 arithmetic means addition and
subtraction are both XOR, with no carries, which is what makes it trivial in
hardware. Be able to do a CRC division by hand.

## 6.3 Multiple access protocols

When several nodes share one broadcast channel, something has to arbitrate. Three
families:

**Channel partitioning.** TDMA gives each node a time slot; FDMA gives each a
frequency band. Fair and collision-free, but a node with nothing to send wastes its
share.

**Random access.** Nodes transmit whenever they have data and recover from
collisions.

- **Slotted ALOHA:** transmit at slot boundaries, retransmit with probability `p` on
  collision. Max efficiency 37%.
- **Pure ALOHA:** no synchronization. Max efficiency 18%.
- **CSMA:** listen before transmitting. Collisions still occur because of
  propagation delay: two nodes can both hear silence and both start.
- **CSMA/CD:** listen *while* transmitting and abort on collision. This is Ethernet.
  It uses **binary exponential backoff**: after `n` collisions, pick a delay
  uniformly from `{0, 1, ..., 2ⁿ - 1}` slot times.

**Taking turns.** Polling and token passing. Efficient, but the master or the token
is a single point of failure.

## 6.4 Switched LANs

**MAC addresses.** 48 bits, flat (not hierarchical), burned into the adapter, and
administered so they are globally unique. An IP address is like a postal address, a
MAC address is like a social security number: the first tells you where you are, the
second is yours wherever you go.

**ARP.** Translates an IP address into a MAC address on the **same subnet**. Broadcast
a query, the owner replies, cache the result. There is no ARP for addresses off the
subnet: for those you ARP for the **router's** address instead.

**Ethernet.** Frame format: preamble, destination MAC, source MAC, type, data, CRC.
Connectionless and unreliable, meaning a receiving adapter that fails the CRC just
drops the frame and says nothing. Recovery, if it happens at all, happens in TCP.

**Switches.** A switch is **self-learning**: it records the source MAC and incoming
interface of every frame it sees, builds a table, and forwards on the table when it
can and floods when it cannot. Switches are transparent, meaning hosts have no idea
they are there.

Switch versus router:

| | Switch | Router |
| - | ------ | ------ |
| Layer | 2 | 3 |
| Address | MAC | IP |
| Table built by | self-learning | routing algorithm |
| Topology restriction | spanning tree | any |

**VLANs.** Partition one physical switch into multiple logical LANs, so broadcast
traffic stays contained and the segmentation does not require separate hardware.

## 6.5 Link virtualization: MPLS

Fixed-length labels, forwarded on the label rather than the IP address. Effectively
a virtual circuit layer between the link layer and the network layer, and it exists
mostly to enable traffic engineering that IP forwarding cannot express.

## 6.6 Data center networking

Hierarchical topologies, load balancers, and the enormous amount of east-west
traffic that changes the design assumptions inherited from wide-area networking.

## 6.7 A day in the life of a web request

This is the payoff for the whole course. Work through it slowly:

1. Laptop connects. **DHCP** discover, offer, request, ACK. Encapsulated in UDP, in
   IP, in Ethernet, broadcast. The laptop now has an IP address, a default gateway,
   and a DNS server.
2. The laptop needs the DNS server's MAC address. **ARP** query, ARP reply.
3. **DNS** query for the web server's name, sent to the local DNS server, which
   resolves it through the hierarchy.
4. **TCP** three-way handshake with the web server, which requires routing across
   several ASes, using tables built by **OSPF** and **BGP**.
5. **HTTP** GET, response, and the page renders.

Every chapter of the book appears in that sequence. If you can narrate it without
notes, you are ready for the final.
