---
next: false
prev: false
---

# Final Study Guide

**Finals week · 120 points · 120 minutes · taken in Canvas**

The final is comprehensive but weighted toward chapters 5 through 8. Expect roughly
a quarter of the questions to come from the material the midterm covered.

## Format

- 60 questions, 2 points each.
- Multiple choice and multiple answer. Questions marked **select all that apply**
  are graded as a whole.
- One attempt, 120 minutes, closed book, taken in Canvas during the scheduled
  finals period.

## What to review

### Chapters 1 through 4 (review)

Everything the midterm covered, with emphasis on
delay computation, reliable data transfer, TCP congestion control, and longest
prefix matching. Chapter 4 is in scope because the midterm covers it, and the
control plane in chapter 5 will not make sense without it.

### Chapter 5 - The Network Layer: Control Plane

- Link-state routing (Dijkstra) traced by hand on a small graph.
- Distance-vector routing (Bellman-Ford), count-to-infinity, and poisoned reverse.
- Why the Internet splits intra-AS from inter-AS routing.
- OSPF, and what hierarchy buys.
- BGP: path attributes, route advertisement, and why policy dominates path length.
- SDN: the separation of the control plane from the data plane, and what a
  controller is responsible for.
- ICMP and what traceroute actually does.

### Chapter 6 - The Link Layer and LANs

- Error detection: parity, checksums, and CRC. Be able to compute a CRC.
- Multiple access: channel partitioning, random access, taking turns.
- ALOHA and CSMA/CD, including the efficiency arguments.
- MAC addresses versus IP addresses, and what ARP bridges between them.
- Ethernet frame structure.
- How a switch learns and forwards, and how that differs from a router.
- VLANs.
- A day in the life of a web request: DHCP, DNS, ARP, TCP, HTTP, in order.

### Chapter 7 - Wireless and Mobile Networks

- What makes wireless links different: attenuation, interference, multipath.
- SNR and BER, and the tradeoff between them.
- 802.11 architecture, association, and the frame format.
- CSMA/CA, and why collision detection is not available on a wireless link.
- The hidden terminal problem, and RTS/CTS.
- Cellular architecture and mobility management: home versus visited networks,
  indirect versus direct routing, handoff.

### Chapter 8 - Security in Computer Networks

- Confidentiality, integrity, authentication, availability, and the mechanism that
  provides each.
- Symmetric versus public key cryptography, and what each is used for in practice.
- Message integrity: cryptographic hashes, MACs, and digital signatures.
- Certificates and what a CA actually attests to.
- Authentication protocols and the replay attacks that motivated each fix.
- TLS: what the handshake accomplishes, and what TLS does not hide.
- IPsec and VPNs.
- 802.11 security.
- Firewalls and intrusion detection systems.

## How to prepare

Rework every knowledge check. The final draws from the same pool of concepts, and
the knowledge checks are the closest thing to a practice exam you will get.
