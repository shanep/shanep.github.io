# Chapter 4 - Knowledge Check

**Week 10 · 20 points · about 25 minutes · taken in Canvas**

Ten questions on the network layer data plane. Three attempts, highest score kept.
Items 7 and 10 are multiple-answer.

---

**Q1.** A forwarding table contains `192.168.0.0/16`, `192.168.16.0/20`, and `192.168.16.128/25`. Which entry matches `192.168.16.130`? *(Objective 4.1)*

- A. `192.168.0.0/16`
- B. `192.168.16.0/20`
- C. `192.168.16.128/25`
- D. None of them

*Answer:* **C** -- All three prefixes match, and longest prefix matching selects the most specific one, the `/25`.

---

**Q2.** How many usable host addresses are in a `/26` subnet? *(Objective 4.4)*

- A. 64
- B. 62
- C. 32
- D. 30

*Answer:* **B** -- A `/26` leaves 6 host bits, so 64 addresses. The network address and the broadcast address are not assignable, leaving 62.

---

**Q3.** Who reassembles a fragmented IP datagram? *(Objective 4.1)*

- A. The next router after the fragmentation occurred
- B. The last router before the destination
- C. The destination host
- D. Every router along the path

*Answer:* **C** -- Reassembly happens only at the destination host. Requiring routers to reassemble would force them to hold state and wait for every fragment, which would be far too expensive at line rate.

---

**Q4.** What does the TTL field prevent? *(Objective 4.1)*

- A. Packet corruption
- B. Datagrams circulating forever in a routing loop
- C. Fragmentation
- D. Congestion

*Answer:* **B** -- Each router decrements TTL and discards the datagram at zero, bounding the damage a routing loop can do. Traceroute exploits exactly this behavior.

---

**Q5.** What does NAT rewrite? *(Objective 4.1)*

- A. The destination IP address only
- B. The source IP address and source port on outgoing datagrams
- C. The TTL and header checksum only
- D. The entire payload

*Answer:* **B** -- The NAT router replaces the private source address and port with its own public address and a unique port, records the mapping, and reverses it on the return path.

---

**Q6.** Which best describes the difference between forwarding and routing? *(Objective 4.1)*

- A. They are two names for the same operation
- B. Forwarding is local and per-packet; routing is network-wide and determines paths
- C. Forwarding is done by hosts; routing is done by routers
- D. Forwarding applies to IPv4 and routing to IPv6

*Answer:* **B** -- Forwarding moves a packet from an input port to an output port in nanoseconds. Routing computes the tables that make forwarding possible, over seconds.

---

**Q7.** Select **all** that are components of a router. *(Objective 4.1)*

- A. Input ports
- B. Switching fabric
- C. Output ports
- D. Routing processor
- E. Congestion window

*Answer:* **A, B, C, D** -- A router has input ports, a switching fabric, output ports, and a routing processor running the control plane. The congestion window is TCP state held at end hosts.

---

**Q8.** What is the service model of the Internet's network layer? *(Objective 4.1)*

- A. Guaranteed delivery with bounded delay
- B. Guaranteed in-order delivery
- C. Best effort, with no guarantees
- D. Guaranteed minimum bandwidth

*Answer:* **C** -- Best effort means no guarantee of delivery, ordering, timing, or bandwidth. Every stronger guarantee in the Internet is built above this layer, which is what chapter 3 was about.

---

**Q9.** How are IPv6 datagrams carried across IPv4-only portions of the Internet? *(Objective 4.1)*

- A. They are translated field by field into IPv4
- B. They are tunneled inside IPv4 datagrams
- C. They are fragmented into IPv4-sized pieces
- D. They are dropped and retransmitted over IPv4

*Answer:* **B** -- Tunneling carries the whole IPv6 datagram as the payload of an IPv4 datagram between tunnel endpoints. A flag day was never possible, so coexistence had to be.

---

**Q10.** Select **all** that generalized forwarding can match on, which traditional destination-based forwarding cannot. *(Objective 4.1)*

- A. Source IP address
- B. Transport layer port numbers
- C. Link layer MAC addresses
- D. Destination IP address
- E. TCP flags

*Answer:* **A, B, C, E** -- Generalized forwarding matches on any combination of header fields across layers, which is how one abstraction expresses routers, switches, firewalls, and load balancers. Destination IP is what traditional forwarding already used.
