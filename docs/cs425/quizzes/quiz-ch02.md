# Chapter 2 - Knowledge Check

**Week 4 · 20 points · about 20 minutes · taken in Canvas**

Ten questions on the application layer. Three attempts, highest score kept. Items 5
and 10 are multiple-answer.

---

**Q1.** A web page consists of one HTML file and three small images. Using **non-persistent** HTTP with serial connections, how many RTTs pass before the last object has arrived, ignoring transmission time? *(Objective 2.2)*

- A. 4
- B. 5
- C. 8
- D. 2

*Answer:* **C** -- Each object costs two RTTs, one for the TCP handshake and one for the request and response. Four objects at two RTTs each is eight.

---

**Q2.** Which is the fundamental structural difference between SMTP and HTTP? *(Objective 2.2)*

- A. SMTP runs over UDP and HTTP runs over TCP
- B. SMTP is a push protocol and HTTP is a pull protocol
- C. SMTP is stateful and HTTP is stateless
- D. SMTP requires encryption and HTTP does not

*Answer:* **B** -- The sending mail server pushes a message to the receiving server, while an HTTP client pulls objects from a server. Both run over TCP, and this push versus pull asymmetry drives most of their other differences.

---

**Q3.** What is a socket? *(Objective 2.1)*

- A. A physical connector on a network card
- B. The interface between the application layer and the transport layer on a host
- C. A router's forwarding table entry
- D. Another name for a port number

*Answer:* **B** -- A socket is the door between a process and the network. The application controls the application side of it; the operating system controls the transport side.

---

**Q4.** In DNS, a query where the contacted server returns the name of the next server to ask, rather than doing the work itself, is called: *(Objective 2.3)*

- A. Recursive
- B. Iterative
- C. Authoritative
- D. Cached

*Answer:* **B** -- In an iterative query the burden stays with the requester. In practice the host-to-local-server query is recursive and the rest of the chain is iterative.

---

**Q5.** Select **all** services that TCP provides to an application but UDP does not. *(Objective 2.1)*

- A. Reliable data transfer
- B. Congestion control
- C. A minimum throughput guarantee
- D. Connection setup
- E. A maximum delay guarantee

*Answer:* **A, B, D** -- TCP adds reliability, congestion control, and connection establishment. Neither protocol offers throughput or timing guarantees, because the Internet's network layer is best effort.

---

**Q6.** What problem do cookies solve? *(Objective 2.2)*

- A. They compress HTTP responses
- B. They let a stateless protocol support stateful applications
- C. They encrypt HTTP traffic
- D. They reduce DNS lookups

*Answer:* **B** -- HTTP keeps no state across requests. A cookie is an identifier the server sets and the browser returns on later requests, letting the server associate requests with a session.

---

**Q7.** A conditional GET is used to: *(Objective 2.2)*

- A. Request only part of an object
- B. Let a cache verify an object is still fresh without re-transferring it
- C. Request an object over an encrypted connection
- D. Ask the server to choose between several representations

*Answer:* **B** -- The cache sends `If-Modified-Since`. If the object is unchanged the server replies `304 Not Modified` with no body, saving the transfer.

---

**Q8.** Why does P2P file distribution scale better than client-server? *(Objective 2.2)*

- A. Peers have faster links than servers
- B. Each new peer adds upload capacity as well as demand
- C. P2P avoids using TCP
- D. Peers do not need to download the whole file

*Answer:* **B** -- With client-server, distribution time grows linearly with the number of clients because the server's uplink is fixed. In P2P, capacity grows with the swarm, so the curve is far flatter.

---

**Q9.** In DASH video streaming, which side decides what quality to request? *(Objective 2.2)*

- A. The server, based on its own load
- B. The client, based on the bandwidth it is measuring
- C. The CDN, based on geography
- D. The network, based on congestion signals

*Answer:* **B** -- The video is encoded at several rates and chopped into chunks. The client measures its available bandwidth and picks the rate for each chunk, so the intelligence sits at the client.

---

**Q10.** Select **all** that are true of DNS caching. *(Objective 2.3)*

- A. It reduces load on the root name servers
- B. It can return stale results until the TTL expires
- C. It is performed by local DNS servers
- D. It eliminates the need for authoritative name servers
- E. It reduces the delay of a typical name lookup

*Answer:* **A, B, C, E** -- Caching is what keeps DNS fast and keeps the root servers from being overwhelmed, at the cost of bounded staleness. Authoritative servers remain the source of truth.
