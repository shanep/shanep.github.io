# Chapter 7 - Knowledge Check

**Week 14 · 20 points · about 20 minutes · taken in Canvas**

Ten questions on wireless and mobile networks. Three attempts, highest score kept.
Items 3 and 9 are multiple-answer.

---

**Q1.** Why does 802.11 use CSMA/CA rather than CSMA/CD? *(Objective 5.3)*

- A. Collision avoidance is faster than collision detection
- B. A wireless adapter cannot detect collisions while transmitting, because its own signal drowns out everything else
- C. CSMA/CD is patented
- D. Wireless links never experience collisions

*Answer:* **B** -- The transmitted signal at the antenna is vastly stronger than any incoming one, so a wireless node has no way to hear a collision in progress. Without detection, the only option is avoidance.

---

**Q2.** What is the hidden terminal problem? *(Objective 5.3)*

- A. A node whose MAC address is not in the switch table
- B. Two nodes that can both reach a third but cannot hear each other, so carrier sensing fails
- C. An access point that does not broadcast its SSID
- D. A node that has moved out of range

*Answer:* **B** -- A and C both reach B but are out of range of each other. Both sense an idle channel, both transmit, and the frames collide at B.

---

**Q3.** Select **all** impairments that make wireless links harder than wired ones. *(Objective 5.3)*

- A. Decreasing signal strength with distance and obstacles
- B. Interference from other sources sharing the band
- C. Multipath propagation
- D. Store-and-forward delay at the access point
- E. A bit error rate that varies over time

*Answer:* **A, B, C, E** -- Attenuation, interference, multipath, and a time-varying error rate are the wireless-specific problems. Store-and-forward delay applies equally to wired networks.

---

**Q4.** Why does 802.11 require link-layer acknowledgements when Ethernet does not? *(Objective 5.3)*

- A. Because 802.11 frames are larger
- B. Because bit errors are common on a wireless link, and without an ACK the sender has no way to know the frame arrived
- C. Because 802.11 does not use a CRC
- D. Because TCP requires it

*Answer:* **B** -- On a link where corruption is routine rather than rare, waiting for TCP to notice and recover would be far too slow, so 802.11 recovers locally.

---

**Q5.** What does the RTS/CTS exchange accomplish? *(Objective 5.3)*

- A. It compresses the data frame
- B. It reserves the channel, silencing nodes in range of the receiver including hidden terminals
- C. It authenticates the sender to the access point
- D. It selects the modulation rate

*Answer:* **B** -- The CTS is heard by everyone within range of the receiver, so hidden terminals learn to stay quiet. It costs two extra frames, so it pays only for large data frames.

---

**Q6.** How does a host discover available access points during **passive** scanning? *(Objective 5.3)*

- A. It sends probe requests on each channel
- B. It listens for beacon frames that APs broadcast periodically
- C. It queries a DHCP server
- D. It reads a list configured by the administrator

*Answer:* **B** -- Beacon frames carry the SSID and MAC address. Active scanning is the alternative, where the host sends probe requests instead of waiting.

---

**Q7.** Why does the 802.11 frame have four address fields when Ethernet has two? *(Objective 5.3)*

- A. To support IPv6 addressing
- B. Because a frame may involve the sender, the receiver, the access point, and a router across a link
- C. To provide redundancy against corruption
- D. To carry both source and destination port numbers

*Answer:* **B** -- The extra fields identify the access point and the endpoint on the far side of it, which a wired Ethernet frame between two directly attached hosts never needs.

---

**Q8.** In indirect routing to a mobile node, datagrams are: *(Objective 5.3)*

- A. Sent straight to the care-of address by the correspondent
- B. Sent to the home agent, which tunnels them to the care-of address
- C. Broadcast to every visited network
- D. Held until the mobile node returns home

*Answer:* **B** -- The home agent intercepts and tunnels. It is simple and transparent to the correspondent, at the cost of triangle routing inefficiency.

---

**Q9.** Select **all** reasons TCP performs poorly over a lossy wireless link. *(Objective 5.3)*

- A. TCP interprets loss as a congestion signal
- B. Most wireless loss is corruption, not congestion
- C. TCP reduces its congestion window when no congestion exists
- D. TCP cannot run over 802.11 at all
- E. Throughput collapses even though the bottleneck is not congested

*Answer:* **A, B, C, E** -- The mismatch between what TCP infers and what actually happened is the whole problem. TCP runs fine over 802.11; it just performs badly.

---

**Q10.** 5G millimeter wave bands offer: *(Objective 5.3)*

- A. Greater bandwidth but shorter range and worse penetration
- B. Greater bandwidth and longer range
- C. Less bandwidth but better penetration
- D. The same characteristics as 4G LTE

*Answer:* **A** -- Higher frequencies carry more data and attenuate faster. That tradeoff is why 5G deployments need far more, far smaller cells.
