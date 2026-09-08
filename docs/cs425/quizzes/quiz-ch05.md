# Chapter 5 - Knowledge Check

**Week 11 · 20 points · about 20 minutes · taken in Canvas**

Ten questions on the network layer control plane. Three attempts, highest score
kept. Items 4 and 9 are multiple-answer.

---

**Q1.** In a link-state routing algorithm, what does each router know? *(Objective 4.2)*

- A. Only the cost to its immediate neighbors
- B. The complete network topology
- C. Only the next hop toward each destination
- D. The full path every packet has taken

*Answer:* **B** -- Every router floods its link state to every other router, so all routers converge on the same topology and each independently runs Dijkstra over it.

---

**Q2.** What is the count-to-infinity problem? *(Objective 4.2)*

- A. A link-state flood that never terminates
- B. Two distance-vector routers incrementing their estimates toward each other after a cost increase
- C. A forwarding table growing without bound
- D. A TTL that never reaches zero

*Answer:* **B** -- After a link cost rises, each router's best route may point through the other, so their estimates climb one step at a time. Good news travels fast in distance vector; bad news travels slowly.

---

**Q3.** Poisoned reverse: *(Objective 4.2)*

- A. Solves count-to-infinity in every topology
- B. Solves the two-node count-to-infinity case but not all cases
- C. Is a link-state technique
- D. Prevents routing loops in BGP

*Answer:* **B** -- If Z routes to X through Y, Z tells Y its distance to X is infinite. That handles two-node loops; loops involving three or more nodes can still count to infinity.

---

**Q4.** Select **all** reasons the Internet separates intra-AS from inter-AS routing. *(Objective 4.3)*

- A. Scale: a single routing algorithm over the whole Internet would not converge
- B. Administrative autonomy: each organization wants to run its own protocol
- C. Policy: an AS wants control over which traffic it carries
- D. Because IPv4 and IPv6 require different algorithms
- E. To hide internal topology from other organizations

*Answer:* **A, B, C, E** -- Scale, autonomy, policy, and topology hiding all drive the split. The IP version has nothing to do with it.

---

**Q5.** Which attribute does BGP use to prevent routing loops? *(Objective 4.3)*

- A. TTL
- B. AS-PATH
- C. NEXT-HOP
- D. LOCAL-PREF

*Answer:* **B** -- A router rejects any advertisement whose AS-PATH already contains its own AS number, which cannot happen unless a loop exists.

---

**Q6.** In BGP route selection, which is considered **first**? *(Objective 4.3)*

- A. Shortest AS-PATH
- B. Local preference
- C. Closest NEXT-HOP
- D. Lowest router ID

*Answer:* **B** -- Local preference comes first, before path length. BGP routing is driven by business relationships, so an AS will route the long way round when policy says to.

---

**Q7.** Hot potato routing means an AS: *(Objective 4.3)*

- A. Prefers the route with the shortest AS-PATH
- B. Hands traffic off to a neighboring AS as quickly as possible
- C. Carries traffic as far as it can before handing it off
- D. Drops traffic during congestion

*Answer:* **B** -- Choosing the closest NEXT-HOP minimizes the distance the traffic travels inside your own network, which minimizes your cost. It is an economic strategy expressed as a routing rule.

---

**Q8.** How does traceroute discover the routers along a path? *(Objective 4.3)*

- A. It queries BGP for the AS-PATH
- B. It sends datagrams with increasing TTL values and collects the resulting ICMP errors
- C. It reads the record-route IP option
- D. It asks the destination host for the reverse path

*Answer:* **B** -- Sending with TTL 1, 2, 3, and so on causes each router in turn to discard the datagram and return an ICMP time-exceeded message identifying itself. It works by causing errors deliberately.

---

**Q9.** Select **all** that are true of the SDN control plane. *(Objective 4.3)*

- A. The control plane is separated from the packet switches
- B. A logically centralized controller computes and installs flow tables
- C. OpenFlow is one protocol used between controller and switch
- D. Each switch independently runs Dijkstra
- E. Network control becomes a program running on a general purpose machine

*Answer:* **A, B, C, E** -- SDN removes the control plane from the switches entirely. Switches running their own routing algorithm is precisely the traditional model SDN replaces.

---

**Q10.** OSPF is: *(Objective 4.2)*

- A. An inter-AS distance-vector protocol
- B. An intra-AS link-state protocol
- C. The protocol BGP uses internally
- D. A data plane forwarding mechanism

*Answer:* **B** -- OSPF floods link state advertisements within an autonomous system and runs Dijkstra. BGP handles routing between autonomous systems.
