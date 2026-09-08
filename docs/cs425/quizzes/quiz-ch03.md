# Chapter 3 - Knowledge Check

**Week 7 · 20 points · about 25 minutes · taken in Canvas**

Ten questions on the transport layer. Three attempts, highest score kept. Items 6
and 10 are multiple-answer.

---

**Q1.** A TCP socket is identified by how many values? *(Objective 3.2)*

- A. Two: destination IP and destination port
- B. Three: source IP, destination IP, destination port
- C. Four: source IP, source port, destination IP, destination port
- D. One: the port number

*Answer:* **C** -- TCP demultiplexes on the full four-tuple, which is why two clients connecting to the same server port land in different sockets. A UDP socket uses only the destination two-tuple.

---

**Q2.** Why do reliable data transfer protocols need sequence numbers? *(Objective 3.1)*

- A. To reorder packets that arrive out of order only
- B. To let the receiver detect duplicates caused by retransmission
- C. To measure round trip time
- D. To compute the checksum

*Answer:* **B** -- A corrupted or lost ACK causes the sender to retransmit, which delivers a duplicate. Sequence numbers let the receiver recognize and discard it. Reordering matters too, but duplicate detection is the reason they first appear, in rdt2.1.

---

**Q3.** In Go-Back-N, what happens when the timer for the oldest unacknowledged packet expires? *(Objective 3.1)*

- A. Only that packet is retransmitted
- B. Every unacknowledged packet in the window is retransmitted
- C. The window size is reduced to 1
- D. The connection is closed

*Answer:* **B** -- Go-Back-N retransmits the whole window, which is why the receiver can get away with buffering nothing. Selective Repeat retransmits only the missing packet but must buffer out-of-order arrivals.

---

**Q4.** A TCP receiver has received bytes 0 through 999 and 2000 through 2999. What acknowledgement number does it send? *(Objective 3.2)*

- A. 2999
- B. 3000
- C. 1000
- D. 999

*Answer:* **C** -- TCP acknowledgements are cumulative and name the next byte **expected**. Bytes 1000 through 1999 are missing, so the ACK number stays at 1000 regardless of what arrived later.

---

**Q5.** What triggers TCP fast retransmit? *(Objective 3.2)*

- A. A single timeout
- B. Three duplicate ACKs
- C. The receive window reaching zero
- D. A checksum failure

*Answer:* **B** -- Three duplicate ACKs strongly suggest one segment was lost while later ones arrived. The sender resends immediately rather than waiting for the timer to expire.

---

**Q6.** Select **all** that are true about flow control and congestion control. *(Objective 3.2)*

- A. Flow control protects the receiver's buffer from overflow
- B. Congestion control protects the network from overload
- C. Flow control is signaled by the advertised receive window
- D. Congestion control is signaled by the advertised receive window
- E. Both are implemented in TCP but not in UDP

*Answer:* **A, B, C, E** -- Flow control uses the receive window the receiver advertises; congestion control infers network state from loss and delay. They solve different problems, and UDP implements neither.

---

**Q7.** After a **timeout**, TCP Reno sets the congestion window to: *(Objective 3.2)*

- A. Half its previous value
- B. 1 MSS, and re-enters slow start
- C. Its previous value, unchanged
- D. The receive window size

*Answer:* **B** -- A timeout is treated as severe congestion: `cwnd` drops to 1 MSS and slow start resumes, with `ssthresh` set to half the old window. Three duplicate ACKs are treated as milder news, halving `cwnd` and continuing in congestion avoidance.

---

**Q8.** During slow start, the congestion window grows: *(Objective 3.2)*

- A. Linearly, by 1 MSS per RTT
- B. Exponentially, doubling every RTT
- C. Not at all until the first loss
- D. To match the bottleneck link rate immediately

*Answer:* **B** -- Despite the name, slow start is exponential: `cwnd` doubles each RTT. It is "slow" only compared to starting at the full window, which is what preceded it.

---

**Q9.** Why might an application choose UDP over TCP? *(Objective 3.3)*

- A. It needs guaranteed in-order delivery
- B. It needs fine-grained control over when data is sent, with no connection setup delay
- C. It needs congestion control
- D. It needs a byte-stream abstraction

*Answer:* **B** -- UDP has no handshake, no connection state, and no congestion control holding it back. Applications that would rather lose a packet than wait for a retransmission choose it.

---

**Q10.** Select **all** costs of network congestion described in chapter 3. *(Objective 3.2)*

- A. Large queuing delays as arrival rate nears link capacity
- B. Retransmission of packets dropped by full router queues
- C. Wasted upstream capacity when a packet is dropped after crossing several links
- D. Corruption of packet payloads by router buffers
- E. Unneeded retransmissions caused by premature timeouts

*Answer:* **A, B, C, E** -- All are consequences of congestion. Routers do not corrupt payloads; they drop packets when buffers fill.
