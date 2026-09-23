# Quiz 3: Cryptography

**Week 8 · 30 points · 15 questions × 2 points · 15 minutes · one attempt · taken in Canvas**

Covers weeks 7-8: symmetric primitives, modes of operation, hash functions, public-key encryption,
and digital signatures.

## Objectives assessed

| Items | Objective |
| --- | --- |
| 1-5 | **3.1**: Explain what a block cipher and a mode of operation each provide, and demonstrate why ECB mode leaks structure |
| 6-9 | **3.2**: Distinguish confidentiality from integrity and authenticity, and name the primitive that supplies each |
| 10-15 | **3.3**: Compare symmetric and public-key cryptography by key distribution, performance, and typical use |

([TLO 3](../objectives.md#tlo-3--comparing-cryptographic-mechanisms-and-their-limits))

---

**Q1.** What does a block cipher such as AES do, by itself? *(Objective 3.1)*

- A. Encrypts a message of any length securely
- B. Transforms one fixed-size block of bits into another, reversibly, under a key
- C. Produces a fixed-size digest of a message
- D. Establishes a shared key between two parties

*Answer:* **B**: AES-128 maps a 16-byte block to a 16-byte block. It says nothing about what to do
with the seventeenth byte, and that gap is exactly what a mode of operation fills. (CyBOK §10.4.1)

---

**Q2.** Why does ECB mode leave the outline of an image visible after encryption?
*(Objective 3.1)*

- A. AES is broken
- B. The image header is left unencrypted
- C. ECB encrypts each block independently and deterministically, so identical plaintext blocks become identical ciphertext blocks, preserving repetition
- D. The key is too short

*Answer:* **C**: In [crypto_demo.py](../data/crypto_demo.py) the plaintext image had 34 distinct
16-byte blocks and the ECB ciphertext had exactly 34 as well. The cipher is fine; the mode leaks
structure. (CyBOK §10.5.1)

---

**Q3.** What is the purpose of an initialisation vector or nonce in a mode of operation?
*(Objective 3.1)*

- A. To act as a second secret key
- B. To make encrypting the same plaintext twice under the same key produce different ciphertext
- C. To authenticate the message
- D. To pad the message to a block boundary

*Answer:* **B**: It has to be unique, not secret. That is why it can be sent in the clear alongside
the ciphertext. (CyBOK §10.5.1)

---

**Q4.** Select **all** that are true if the same key and nonce are used to encrypt two different
messages in a counter-based mode. *(Objective 3.1)*

- A. XORing the two ciphertexts yields the XOR of the two plaintexts
- B. An attacker who knows one plaintext can recover the other
- C. The key can be recovered directly from the two ciphertexts
- D. Nothing is compromised as long as the key stays secret

*Answer:* **A and B**: Both are demonstrated in Lab 4, Part 3. C is false: the key itself is not
exposed, which is precisely why this failure is easy to miss. D is the belief that causes the bug.
(CyBOK §10.5.1)

---

**Q5.** A developer needs to encrypt a 100 MB file. Which is the best choice? *(Objective 3.1)*

- A. RSA with a 4096-bit key
- B. AES in an authenticated mode such as GCM, with a fresh nonce
- C. AES in ECB mode, for speed
- D. SHA-256

*Answer:* **B**: Public-key encryption is far too slow for bulk data and is not used that way; ECB
leaks structure; SHA-256 is not encryption and has no inverse. Real systems use public-key
cryptography to establish a symmetric key and then use a symmetric authenticated mode for the data.
(CyBOK §10.5, §10.6)

---

**Q6.** Which primitive provides **integrity and authenticity**, but not confidentiality?
*(Objective 3.2)*

- A. AES-CTR
- B. SHA-256
- C. HMAC-SHA256
- D. AES-ECB

*Answer:* **C**: A MAC proves the message came from someone holding the key and has not changed,
while leaving the message readable. SHA-256 alone provides neither, because anyone who alters the
message can recompute the digest. (CyBOK §10.5.2)

---

**Q7.** An attacker intercepts an AES-CTR ciphertext of the known message `Balance: $100.00` and
wants the receiver to see `Balance: $900.00`. They do not have the key. Can they do it?
*(Objective 3.2)*

- A. No, because they do not have the key
- B. No, because the ciphertext is random-looking
- C. Yes, CTR encrypts by XOR with a keystream, so flipping the right ciphertext bits flips exactly the corresponding plaintext bits
- D. Only if the message is shorter than one block

*Answer:* **C**: This is the central point of Lab 4, Part 2. Confidentiality without integrity
lets an attacker make predictable, targeted changes to a message they cannot read but can guess.
(CyBOK §10.5.1-10.5.2)

---

**Q8.** Select **all** that AES-GCM provides that AES-CTR does not. *(Objective 3.2)*

- A. Confidentiality
- B. Detection of tampering with the ciphertext
- C. Assurance that the message came from someone holding the key
- D. Protection against nonce reuse

*Answer:* **B and C**: Both modes provide confidentiality (A is common to both). D is false and
important: GCM is *more* fragile under nonce reuse than plain CTR, because repeating a nonce can
expose the authentication key as well as the plaintext. (CyBOK §10.5.1-10.5.2; §18.1.6.2)

---

**Q9.** A download page lists a file and its SHA-256 digest on the same page. An attacker who can
modify the page serves a malicious file. What does the published digest accomplish?
*(Objective 3.2)*

- A. It detects the substitution, because the digest will not match
- B. Nothing against this attacker: they replace the digest as well; it only detects accidental corruption and tampering by someone who cannot alter the page
- C. It authenticates the publisher
- D. It encrypts the file

*Answer:* **B**: A hash establishes integrity only relative to a digest you obtained through a
channel the attacker does not control. Signing the file with a key whose public half you already
trust is what fixes this. (CyBOK §10.4.3, §10.7)

---

**Q10.** What is the fundamental difference between symmetric and public-key cryptography?
*(Objective 3.3)*

- A. Public-key cryptography is unbreakable
- B. Symmetric uses one key shared by both parties; public-key uses a mathematically related pair, where one key can be published
- C. Symmetric is only for encryption and public-key is only for signatures
- D. Public-key cryptography does not need a key

*Answer:* **B**: Being able to publish half the pair is what solves key distribution, and it is
the whole reason public-key cryptography exists. (CyBOK §10.6)

---

**Q11.** Four hundred people need to be able to send authenticated messages to each other. How many
keys are needed under each scheme? *(Objective 3.3)*

- A. 400 shared secrets; 400 key pairs
- B. 79,800 shared secrets; 400 key pairs
- C. 400 shared secrets; 79,800 key pairs
- D. 160,000 shared secrets; 800 key pairs

*Answer:* **B**: Pairwise shared secrets require *n*(*n*−1)/2 = 400 × 399 / 2 = 79,800, each of
which must be delivered securely. Public keys require one key pair each. (CyBOK §10.6)

---

**Q12.** Select **all** that are true about digital signatures. *(Objective 3.3)*

- A. A valid signature establishes that the message has not changed since it was signed
- B. A valid signature establishes that the signer's claimed real-world identity is genuine
- C. A valid signature establishes that the holder of the corresponding private key produced it
- D. A valid signature establishes that the contents of the message are true

*Answer:* **A and C**: B is the gap that certificates exist to close, and closing it is a separate
problem from the mathematics. D is never true of any cryptographic mechanism. (CyBOK §10.7)

---

**Q13.** Why does nearly every real protocol combine public-key and symmetric cryptography rather
than using one alone? *(Objective 3.3)*

- A. Because neither is secure by itself
- B. Because public-key operations are orders of magnitude slower, so they are used to establish a symmetric key which then protects the bulk data
- C. Because symmetric cryptography cannot provide confidentiality
- D. Because standards bodies require it

*Answer:* **B**: Public-key cryptography solves key distribution; symmetric cryptography does the
work. TLS is exactly this arrangement. (CyBOK §10.6, §10.8.2)

---

**Q14.** Alice and Bob share an HMAC key. Alice sends Bob a message with a valid tag. Bob later
claims Alice authorised a payment; Alice denies it. Can the tag settle the dispute?
*(Objective 3.3)*

- A. Yes, because only Alice could have produced a valid tag
- B. No, Bob holds the same key and could have produced the tag himself, so it proves nothing to a third party
- C. Yes, if the tag is at least 256 bits
- D. No, because HMAC does not provide integrity

*Answer:* **B**: This is non-repudiation, and it is the one thing a shared-secret MAC structurally
cannot provide. A signature made with a private key only Alice holds can. (CyBOK §10.5.2, §10.7)

---

**Q15.** Select **all** for which a *digital signature* is the right tool rather than a MAC.
*(Objective 3.3)*

- A. A manufacturer proving to every customer's device that a firmware update is genuine
- B. Two servers inside one company authenticating messages on a private link between them
- C. A university issuing a transcript that a third party must be able to verify
- D. A server issuing a session cookie that only it will ever check

*Answer:* **A and C**: Both involve a verifier who must not be able to forge what they verify. B
and D have a single trust domain and one party doing both operations, where a MAC is faster,
simpler, and sufficient. (CyBOK §10.7)

---

## Canvas import notes

*Instructor note, not shown to students.* Items 4, 8, 12, and 15 are multiple-answer; the rest are
single-answer multiple choice. All items are worth 2 points.
