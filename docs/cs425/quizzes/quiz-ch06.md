# Chapter 6 - Knowledge Check

**Week 13 · 20 points · about 20 minutes · taken in Canvas**

Ten questions on the link layer and LANs. Three attempts, highest score kept. Items
5 and 10 are multiple-answer.

---

**Q1.** Where is the link layer primarily implemented? *(Objective 5.1)*

- A. In the application
- B. In the operating system kernel's TCP stack
- C. In the network adapter, in hardware
- D. In the router's routing processor

*Answer:* **C** -- Framing, error detection, and medium access are implemented in the NIC. The link layer is where hardware and software meet.

---

**Q2.** Why does CSMA still suffer collisions even though every node listens before transmitting? *(Objective 5.1)*

- A. Because nodes ignore the carrier sense result
- B. Because of propagation delay: two nodes can both sense idle and both transmit
- C. Because the checksum sometimes fails
- D. Because switches flood frames

*Answer:* **B** -- A node's transmission takes time to reach the others. During that window another node can sense an idle channel that is no longer actually idle, and start transmitting.

---

**Q3.** After the third consecutive collision, Ethernet's binary exponential backoff picks a delay uniformly from how many slot times? *(Objective 5.1)*

- A. `{0, 1, 2}`
- B. `{0, 1, ..., 7}`
- C. `{0, 1, ..., 3}`
- D. `{0, 1, ..., 15}`

*Answer:* **B** -- After `n` collisions the adapter picks uniformly from `{0, 1, ..., 2ⁿ - 1}`. With `n = 3` that is `{0, ..., 7}`.

---

**Q4.** ARP resolves: *(Objective 5.2)*

- A. A hostname to an IP address
- B. An IP address to a MAC address on the same subnet
- C. A MAC address to a port number
- D. An IP address to a MAC address anywhere on the Internet

*Answer:* **B** -- ARP works only within a subnet. To reach a host on another subnet, a sender ARPs for its default gateway's MAC address instead.

---

**Q5.** Select **all** differences between a link-layer switch and a router. *(Objective 5.2)*

- A. A switch forwards on MAC addresses, a router on IP addresses
- B. A switch builds its table by self-learning, a router by running a routing algorithm
- C. A switch operates at layer 2, a router at layer 3
- D. A switch requires a loop-free topology, a router does not
- E. A switch decrements the TTL field, a router does not

*Answer:* **A, B, C, D** -- Switches are transparent layer 2 devices with self-learned tables and a spanning tree restriction. TTL is an IP field, decremented by routers, and a switch does not touch it.

---

**Q6.** A host sends a datagram to an IP address on a **different** subnet. What MAC address goes in the frame's destination field? *(Objective 5.2)*

- A. The destination host's MAC address
- B. The broadcast MAC address
- C. The default gateway router's MAC address
- D. The sending host's own MAC address

*Answer:* **C** -- The frame only has to reach the next hop. The router then strips the frame, looks up the destination IP, and builds a new frame for the next link.

---

**Q7.** How does a switch build its forwarding table? *(Objective 5.2)*

- A. An administrator configures it manually
- B. It records the source MAC address and arrival interface of every frame it sees
- C. It runs a distance-vector algorithm with neighboring switches
- D. It queries a central controller

*Answer:* **B** -- This is self-learning. If the destination is not yet in the table the switch floods the frame out every other interface, and learns the reply.

---

**Q8.** Ethernet provides: *(Objective 5.1)*

- A. Reliable, connection-oriented delivery
- B. Unreliable, connectionless delivery
- C. Reliable, connectionless delivery
- D. Congestion control

*Answer:* **B** -- A receiving adapter that fails the CRC simply discards the frame and sends nothing back. Any recovery happens in TCP, several layers up.

---

**Q9.** In CRC, what arithmetic is used for the division? *(Objective 5.1)*

- A. Ordinary integer arithmetic
- B. Modulo 2 arithmetic, where addition and subtraction are both XOR
- C. Floating point arithmetic
- D. One's complement arithmetic

*Answer:* **B** -- Modulo 2 means no carries and no borrows, so both operations reduce to XOR. That is exactly why CRC is trivial to implement in hardware.

---

**Q10.** Select **all** steps that occur, in a typical network, between plugging in a laptop and receiving a web page. *(Objective 5.2)*

- A. DHCP discover, offer, request, and ACK
- B. An ARP query for the DNS server or default gateway
- C. A DNS query resolving the web server's name
- D. A TCP three-way handshake with the web server
- E. A BGP session opened by the laptop with its ISP

*Answer:* **A, B, C, D** -- That is the day-in-the-life sequence. BGP runs between autonomous system routers; an end host never speaks it.
