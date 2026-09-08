# Course Objectives

This course follows the top-down approach: we start at the application layer,
where you already have intuition, and work down to the wire. Each chapter below
names what you should be able to *do* once we are through it, not just what you
should have read.

## 1. Computer Networks and the Internet

- Describe the Internet as a layered system, and name the service each layer sells
  to the layer above it.
- Trace a message through encapsulation on the way down and de-encapsulation on
  the way up.
- Break end-to-end delay into transmission, propagation, queuing, and processing,
  and compute each one.
- Explain why packet switching beat circuit switching for data traffic.

## 2. The Application Layer

- Write a client that speaks a text-based protocol over a socket.
- Explain how HTTP, SMTP, and DNS are structured, and why each one made the design
  choices it did.
- Compare client-server and peer-to-peer architectures for a given workload.
- Explain what a DNS resolver actually does, step by step, on a cache miss.

## 3. The Transport Layer

- Build a reliable data transfer protocol on top of an unreliable channel.
- Explain the difference between TCP and UDP in terms of the service each provides.
- Trace TCP connection setup, teardown, flow control, and congestion control.
- Explain why congestion control is a network-wide problem and not a per-connection one.

## 4. The Network Layer: Data Plane

- Describe what a router does to a packet, in order.
- Read and write IPv4 addresses in CIDR notation, and subnet an address block.
- Explain NAT, what it buys, and what it breaks.
- Explain the split between the data plane and the control plane.

## 5. The Network Layer: Control Plane

- Trace link-state (Dijkstra) and distance-vector (Bellman-Ford) routing by hand.
- Explain why the Internet needs both intra-AS and inter-AS routing.
- Describe what BGP advertises and why routing policy is a business decision.
- Explain what SDN changes about the control plane.

## 6. The Link Layer and LANs

- Explain error detection and correction, and compute a checksum and a CRC.
- Compare the multiple access protocols: channel partitioning, random access, taking turns.
- Trace a request end to end through ARP, DHCP, a switch, and a router.
- Explain how a switch learns, and how that differs from routing.

## 7. Wireless and Mobile Networks

- Explain what makes a wireless link harder than a wired one.
- Describe 802.11 and why it uses CSMA/CA rather than CSMA/CD.
- Explain the hidden terminal problem and how RTS/CTS addresses it.
- Describe how mobility is handled by cellular networks.

## 8. Security in Computer Networks

- Define confidentiality, integrity, authentication, and availability, and name the
  mechanism that provides each.
- Explain symmetric and public key cryptography at the level of what each is *for*.
- Describe what TLS protects, and what it leaves exposed.
- Identify common attack vectors and the defenses that apply to each.
