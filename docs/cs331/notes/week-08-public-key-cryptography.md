# 8.01 Readings and Lecture Notes

**March 1-7 · Reading: 9 pages · About 2 hrs 30 min with the worked example**

What to do this week, and when it is due, is on the [Module 8 Overview](week-08-overview.md).

## Readings

| Source | Sections | Printed pages | Length | Time |
| --- | --- | --- | --- | --- |
| [CyBOK v1.1.0](../docs/CyBOK_v1.1.0.pdf) | §10.6 Public Key Encryption: KEM/DEM, RSA, elliptic curves | 338-341 | 3 pp | 25 min |
| [CyBOK v1.1.0](../docs/CyBOK_v1.1.0.pdf) | §10.7 Public Key Signatures: RSA-PSS, DSA, EC-DSA, Schnorr | 341-343 | 2 pp | 20 min |
| [CyBOK v1.1.0](../docs/CyBOK_v1.1.0.pdf) | §10.8 Standard Protocols: authentication and key agreement | 343-347 | 4 pp | 30 min |
| Nakov, *Practical Cryptography for Developers* | Hash functions; RSA; ECC; digital signatures |: | skim | 30 min |

Nakov: <https://cryptobook.nakov.com/cryptographic-hash-functions> and the digital signatures
pages. You are **not** assigned §10.9 through §10.11, special-property signatures, homomorphic
encryption, and implementation aspects. Skip them.

## Worked example

Run [data/sign_demo.py](../data/sign_demo.py) alongside this section.

```
python3 sign_demo.py
```

### 1. What a hash is, and what it is not

A hash function takes any input and produces a fixed-size digest. Change one character of the input
and about half the output bits change:

```
Input A: 'Transfer $100 to Bob'
Input B: 'Transfer $900 to Bob'
Bits that differ in the two digests: 145 out of 256
```

That is the desired behaviour, not a flaw. If similar inputs produced similar digests you could
work backward toward the input by hill-climbing. You cannot look at two digests and learn anything
about how similar the inputs were.

A hash takes **no key**. Anyone can compute it. So a hash by itself proves nothing about who
produced a message, anybody who changes the message can recompute the digest and it will be
perfectly valid.

This is the trap in the "download the file, check the SHA-256 on the page" ritual. If the attacker
can change the file on that page, they can change the digest too. The digest catches accidental
corruption and catches an attacker who can alter the file but not the page. Against an attacker who
controls both, it does nothing.

### 2. What a signature adds

A signature is computed with a **private key** and checked with the matching **public key**. The
script signs a message, then an attacker substitutes a different one:

```
Message:   b'Grade for student 12345: A'
  Verifying the ORIGINAL:  VALID
An attacker substitutes: b'Grade for student 12345: F'
  Verifying the TAMPERED:  INVALID
```

The attacker can see the message and the signature and can change the message. What they cannot do
is produce a signature for the new message, because that requires the private key. And they cannot
reuse the old signature, because it is bound to the exact bytes that were signed.

### 3. What a valid signature actually proves

This is the part worth slowing down for, and Lab 5 weights it most heavily.

Part 3 of the script takes the **correct** signature over the **correct** message and verifies it
against a *different person's* public key. It fails.

So a valid signature establishes exactly two things:

1. **The message has not changed** since it was signed.
2. **It was produced by whoever holds the matching private key.**

And here is what it does **not** establish:

- **That the message is true.** A signed statement is still a statement. Signing "the sky is green"
  produces a perfectly valid signature over a false claim.
- **That the signer is who they claim to be.** The signature ties the message to a *key*. Whether
  that key belongs to Boise State, or to somebody who registered a lookalike domain last Tuesday,
  is not a question mathematics answers.
- **That the key has not been stolen.** A private key on a compromised laptop signs exactly as well
  for the intruder as for the owner.

The second one is a gap you can attack. An attacker who can get you to accept *their* public key as
belonging to your bank can sign anything they like, and every verification will succeed. Week 10 is
about the machinery built to close that gap (certificates) and about the fact that it does not
close it completely, it moves it.

### 4. Shared secret or key pair

Part 4 produces an HMAC tag and an Ed25519 signature over the same message. Both establish integrity
and authenticity. They differ in one structural way.

**With an HMAC, both parties hold the same key.** So if Alice sends Bob a message with a valid tag
and Bob later claims Alice authorised a payment she says she did not authorise, the tag settles
nothing, Bob could have produced it himself. There is no way for a third party to tell them apart.

**With a signature, only Alice holds the private key.** A judge holding Alice's public key can
verify the signature and know that Alice's key produced it. That property is **non-repudiation**,
and it is the thing a shared-secret MAC structurally cannot provide.

Then there is key distribution, which is the reason public-key cryptography was invented:

| Parties who all need to communicate securely | Shared secrets needed | Key pairs needed |
| ---: | ---: | ---: |
| 2 | 1 | 2 |
| 10 | 45 | 10 |
| 400 | 79,800 | 400 |
| 1,000 | 499,500 | 1,000 |

*n*(*n*−1)/2 against *n*. Every one of those shared secrets has to be delivered over some channel
that is already secure, which is the problem you were trying to solve.

**So why does anything still use symmetric cryptography?** Because public-key operations are orders
of magnitude slower. Real protocols use both: public-key cryptography to agree a symmetric key,
then a symmetric authenticated mode for the actual data. That is what TLS does, and it is why week
10's material sits on top of this week's.

## Key terms

| Term | Short form |
| --- | --- |
| **Hash function** | Fixed-size digest of any input. No key. Deterministic. |
| **Collision resistance** | Infeasible to find two inputs with the same digest. |
| **Public / private key pair** | Mathematically related; one half can be published. |
| **Digital signature** | Produced with the private key, verified with the public key. Gives integrity, authenticity, and non-repudiation. |
| **Non-repudiation** | The signer cannot credibly deny having signed. A MAC cannot provide it. |
| **KEM/DEM** | Use public-key cryptography to transport a symmetric key, then symmetric cryptography for the data. |
| **Diffie-Hellman key agreement** | Two parties derive a shared secret over a public channel. |
| **Forward secrecy** | Compromising a long-term key later does not expose past sessions. |
| **Hybrid encryption** | Public-key for key establishment, symmetric for bulk data. What everything real does. |

## Looking ahead

Week 9 is review and the midterm. No new reading, no lab, no discussion. The
[midterm exam guide](../assignments/midterm-exam-guide.md) tells you exactly what is on it, read
it this weekend rather than next.

<!--@include: ../../../parts/cs331-questions-button.md-->
