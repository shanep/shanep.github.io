# Chapter 1 - Knowledge Check

**Week 3 · 20 points · about 20 minutes · taken in Canvas**

Ten questions on the Internet's architecture, delay, and layering. Three attempts,
highest score kept. Items 4 and 9 are multiple-answer.

---

**Q1.** A 2000 byte packet is sent over a 5 Mbps link. What is the transmission delay? *(Objective 1.2)*

- A. 0.4 ms
- B. 3.2 ms
- C. 400 ms
- D. It cannot be determined without the link length

*Answer:* **B** -- Transmission delay is `L/R`. The packet is 2000 bytes = 16000 bits, and 16000 / 5,000,000 = 3.2 ms. The link length affects propagation delay, not transmission delay.

---

**Q2.** Which delay component depends on the physical length of the link? *(Objective 1.2)*

- A. Processing delay
- B. Queuing delay
- C. Transmission delay
- D. Propagation delay

*Answer:* **D** -- Propagation delay is `d/s`, the distance divided by the propagation speed of the medium. Transmission delay depends on packet size and link rate, and neither depends on distance.

---

**Q3.** A path crosses four links with rates 100 Mbps, 10 Mbps, 50 Mbps, and 100 Mbps. What is the end-to-end throughput? *(Objective 1.2)*

- A. 260 Mbps
- B. 100 Mbps
- C. 65 Mbps
- D. 10 Mbps

*Answer:* **D** -- End-to-end throughput is limited by the bottleneck link, the one with the smallest rate on the path. Rates do not add along a path; they add only across parallel paths.

---

**Q4.** Select **all** that are true of packet switching compared to circuit switching. *(Objective 1.2)*

- A. It allows more users to share the network for bursty traffic
- B. It guarantees a constant end-to-end delay
- C. It can suffer queuing delay and packet loss
- D. It reserves resources end to end before data is sent
- E. It uses store-and-forward transmission at each switch

*Answer:* **A, C, E** -- Packet switching shares capacity statistically, which is why it supports more bursty users, and why it queues and drops. Constant delay and end-to-end reservation are properties of circuit switching.

---

**Q5.** What does traffic intensity `La/R` approaching 1 imply? *(Objective 1.2)*

- A. The link is being used efficiently with no downside
- B. Average queuing delay grows without bound
- C. Propagation delay increases
- D. The link rate is about to increase automatically

*Answer:* **B** -- As arrival rate approaches service rate, the queue grows without bound and so does average queuing delay. This is why links are engineered to run well below capacity.

---

**Q6.** In the five-layer Internet model, what is the unit of data at the network layer? *(Objective 1.1)*

- A. Frame
- B. Segment
- C. Datagram
- D. Message

*Answer:* **C** -- Message at the application layer, segment at the transport layer, datagram at the network layer, frame at the link layer, and bits at the physical layer.

---

**Q7.** A host sends an HTTP request. In what order are headers added on the way down the stack? *(Objective 1.1)*

- A. Link, network, transport, application
- B. Application, transport, network, link
- C. Transport, application, network, link
- D. Network, transport, link, application

*Answer:* **B** -- Each layer encapsulates the unit from the layer above by prepending its own header, so headers are added top down and stripped bottom up at the receiver.

---

**Q8.** Store-and-forward transmission means that a router: *(Objective 1.2)*

- A. Begins forwarding a packet as soon as the first bit arrives
- B. Must receive the entire packet before it can begin transmitting it
- C. Stores every packet permanently for auditing
- D. Forwards packets only after the destination acknowledges them

*Answer:* **B** -- The router must receive and buffer the whole packet before transmitting it onward, which is why each hop adds one full transmission delay to the end-to-end total.

---

**Q9.** Select **all** that describe a protocol. *(Objective 1.1)*

- A. It defines the format of messages exchanged
- B. It defines the order in which messages are exchanged
- C. It defines the actions taken on message transmission or receipt
- D. It guarantees that messages are never lost
- E. It is required for any communication between two entities in a network

*Answer:* **A, B, C, E** -- Format, order, and actions are the three parts of the standard definition, and communication requires an agreed protocol. Guaranteed delivery is a service some protocols provide, not part of what a protocol is.

---

**Q10.** Which of these is a property of the network **edge** rather than the network **core**? *(Objective 1.3)*

- A. Packet switching between routers
- B. End systems running applications
- C. Routing algorithms computing forwarding tables
- D. Store-and-forward transmission

*Answer:* **B** -- The edge is hosts and access networks. The core is the mesh of packet switches and links, where switching, forwarding, and routing happen.
