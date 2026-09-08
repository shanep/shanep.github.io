# Chapter 8 - Knowledge Check

**Week 15 · 20 points · about 20 minutes · taken in Canvas**

Ten questions on network security. Three attempts, highest score kept. Items 6 and
10 are multiple-answer.

---

**Q1.** Which property does encryption provide? *(Objective 6.1)*

- A. Confidentiality
- B. Message integrity
- C. Availability
- D. Non-repudiation

*Answer:* **A** -- Encryption keeps the contents unreadable to anyone without the key. Integrity comes from hashes and MACs, and non-repudiation from digital signatures.

---

**Q2.** Why does TLS use public key cryptography for the handshake and symmetric cryptography for the data? *(Objective 6.2)*

- A. Public key cryptography cannot encrypt large messages at all
- B. Public key cryptography is orders of magnitude slower, so it is used only to establish a session key
- C. Symmetric cryptography is more secure
- D. Symmetric cryptography does not require any key

*Answer:* **B** -- The hybrid gets public key crypto's key distribution properties with symmetric crypto's speed. Bulk data is encrypted with the negotiated session key.

---

**Q3.** What does a MAC provide that a plain cryptographic hash does not? *(Objective 6.1)*

- A. Confidentiality
- B. Authentication, because computing it requires a shared secret
- C. Compression
- D. Non-repudiation

*Answer:* **B** -- Anyone can compute a plain hash, so an attacker who alters the message can recompute it. A MAC folds in a shared secret, so only a holder of that secret can produce a valid one.

---

**Q4.** What does a digital signature provide that a MAC does not? *(Objective 6.1)*

- A. Faster verification
- B. Non-repudiation, because only the signer holds the private key
- C. Confidentiality of the message
- D. Protection against replay

*Answer:* **B** -- With a MAC both parties share the same secret, so either could have produced it. A signature is made with a private key only one party holds.

---

**Q5.** What is the purpose of a nonce in an authentication protocol? *(Objective 6.1)*

- A. To encrypt the password
- B. To ensure the response is fresh, defeating a replay attack
- C. To compress the handshake
- D. To identify the certificate authority

*Answer:* **B** -- A nonce is used once. Since it never repeats, a recorded response from an earlier session is worthless to an attacker replaying it.

---

**Q6.** Select **all** that a certification authority does. *(Objective 6.2)*

- A. Verify the identity of an entity requesting a certificate
- B. Bind an identity to a public key by signing the certificate
- C. Store every entity's private key
- D. Allow anyone with the CA's public key to validate a certificate
- E. Encrypt all traffic to the certified entity

*Answer:* **A, B, D** -- A CA verifies identity and vouches for the binding by signing it. It never sees private keys, and it does not participate in the traffic itself.

---

**Q7.** Which does TLS **not** protect? *(Objective 6.2)*

- A. The contents of the messages exchanged
- B. The integrity of the messages exchanged
- C. Which server the client connected to, and how much data was sent
- D. The ordering of records within the connection

*Answer:* **C** -- TLS encrypts and authenticates the contents, and its record sequence numbers prevent reordering. It does not hide the existence, endpoints, timing, or volume of the connection, so traffic analysis still works.

---

**Q8.** In IPsec, what is the difference between transport mode and tunnel mode? *(Objective 6.3)*

- A. Transport mode uses TCP; tunnel mode uses UDP
- B. Transport mode protects the payload; tunnel mode protects the entire original datagram inside a new one
- C. Transport mode is for IPv4; tunnel mode is for IPv6
- D. There is no difference, only a naming convention

*Answer:* **B** -- Tunnel mode wraps the whole original datagram, hiding the inner addresses. VPNs use tunnel mode for exactly that reason.

---

**Q9.** A **stateful** packet filter differs from a stateless one because it: *(Objective 6.3)*

- A. Inspects the application layer payload
- B. Tracks connections and rejects packets inconsistent with the connection state
- C. Encrypts packets as they pass through
- D. Requires a certificate for each connection

*Answer:* **B** -- A stateless filter decides on each packet's headers in isolation. A stateful filter remembers the connection, so it can reject an ACK that belongs to no established connection.

---

**Q10.** Select **all** that were weaknesses of WEP. *(Objective 6.3)*

- A. The initialization vector was too short and was reused
- B. It had no meaningful key management
- C. Its integrity check could be defeated
- D. It used AES, which was too slow for the hardware of the time
- E. Keys were shared statically across all users of a network

*Answer:* **A, B, C, E** -- WEP failed on IV reuse, key management, and integrity. It used RC4, not AES, and its problems were design errors rather than performance ones.
