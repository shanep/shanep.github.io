# 7.01 Readings and Lecture Notes

**February 22-28 · Reading: 9 pages · About 2 hrs 25 min with the worked example**

What to do this week, and when it is due, is on the [Module 7 Overview](week-07-overview.md).

## Readings

| Source | Sections | Printed pages | Length | Time |
| --- | --- | --- | --- | --- |
| [CyBOK v1.1.0](../docs/CyBOK_v1.1.0.pdf) | §10.3 Information-theoretically Secure Constructions: one-time pad, secret sharing | 329-331 | 2 pp | 15 min |
| [CyBOK v1.1.0](../docs/CyBOK_v1.1.0.pdf) | §10.4 Symmetric Primitives: block ciphers, stream ciphers, hash functions | 331-334 | 3 pp | 25 min |
| [CyBOK v1.1.0](../docs/CyBOK_v1.1.0.pdf) | §10.5 Symmetric Encryption and Authentication, modes, MACs, KDFs | 334-338 | 4 pp | 35 min |
| Nakov, *Practical Cryptography for Developers* | AES and cipher block modes |: | skim | 25 min |

Nakov: <https://cryptobook.nakov.com/symmetric-key-ciphers>. It is written for developers and has
worked examples where CyBOK has definitions. Use it when CyBOK's treatment is too compressed.

## Worked example

Run [data/crypto_demo.py](../data/crypto_demo.py) alongside this section. It needs the
`cryptography` package from Lab 0.

```
python3 crypto_demo.py
```

### 1. A block cipher is not an encryption scheme

AES-128 takes a 16-byte block and a key, and produces a 16-byte block. Reversibly. That is all it
does. It has nothing to say about your seventeenth byte, and nothing to say about what happens when
you encrypt the same block twice.

A **mode of operation** is the scheme wrapped around the cipher that turns "I can transform one
block" into "I can encrypt a message." Choosing the mode is where the decisions are.

**ECB** is the naive mode: chop the message into blocks and encrypt each one independently. Here is
what the script reports for a 256×256 picture:

```
Distinct 16-byte blocks in the plaintext: 34
Distinct 16-byte blocks after ECB:        34
Distinct 16-byte blocks after CTR:        12,288
```

12,288 blocks in the image; only 34 of them are distinct, because the picture is mostly large areas
of one colour. After ECB there are still exactly 34 distinct blocks, **identical input blocks
produced identical output blocks**, so every repeated patch of colour is still a repeated patch of
colour, just a different colour. Open `cs331_ecb.bmp` and you can still see the picture.

Open `cs331_ctr.bmp` and you cannot. CTR generates a keystream that never repeats within a message
and XORs it in, so identical plaintext blocks land on different keystream and produce different
ciphertext. 12,288 distinct blocks out of 12,288.

**AES is not broken here.** It did exactly what a block cipher does. ECB is broken, because it
preserves a property of the plaintext (which blocks are equal to which) that the plaintext should
not be leaking.

### 2. Encryption is not integrity

This is the most consequential idea in the week.

Part 2 of the script flips one bit of a ciphertext in transit:

```
AES-CTR, one bit of the ciphertext flipped in transit:
  decrypts to: b'Balance: %100.00'
  No error.

AES-GCM, one bit of the ciphertext flipped in transit:
  decryption REFUSED: InvalidTag
```

CTR decrypted the tampered message and handed it over without complaint. The receiver has no way to
know.

Now the part that upgrades this from untidy to dangerous. CTR mode encrypts by XORing the plaintext
with a keystream. So:

```
ciphertext = plaintext XOR keystream
```

An attacker who does not have the key, but who **knows or guesses what the plaintext says at a
given position**, can compute exactly which bits to flip:

```
'1' XOR '9' = 0x08     # the difference between the two characters
```

XOR `0x08` into that byte of the ciphertext and the receiver decrypts `Balance: $900.00`. The
attacker never learned the key and never needed to. Confidentiality held perfectly. Integrity was
never on offer.

**GCM** carries an authentication tag computed over the ciphertext with the key. Change one bit and
the tag no longer matches, and decryption refuses. This is why the modern default is an
*authenticated* mode (AES-GCM or ChaCha20-Poly1305) rather than a bare confidentiality mode.

Keep the properties separate:

| Primitive | Confidentiality | Integrity | Authenticity |
| --- | :---: | :---: | :---: |
| AES-CTR, AES-CBC | yes | no | no |
| SHA-256 alone | no | no* | no |
| HMAC-SHA256 | no | yes | yes |
| AES-GCM | yes | yes | yes |

\* A hash detects *accidental* corruption, and detects tampering only if you obtained the digest
through a channel the attacker cannot alter. On the same web page as the file, it detects nothing, 
the attacker changes both.

### 3. Never reuse a nonce

Part 3 encrypts two messages under the same key **and the same counter start**:

```
C1 XOR C2 = 000000000000000000000c00000000000000000000000000000905050101050509
```

Mostly zeros. Here is why. If

```
C1 = P1 XOR K        and        C2 = P2 XOR K
```

then

```
C1 XOR C2 = (P1 XOR K) XOR (P2 XOR K) = P1 XOR P2
```

The keystream cancels. **No key was used to compute that line.** The zero bytes are the positions
where the two plaintexts are identical, which is why you can see at a glance that both messages
start with the same twelve characters.

And an attacker who knows one plaintext gets the other for free:

```
(P1 XOR P2) XOR P1 = P2
```

The script does exactly that and recovers `TRANSFER $900 TO ACCOUNT 87654321`.

A nonce does not have to be secret: it is usually sent in the clear next to the ciphertext. It has
to be **unique**. In real code this breaks when someone stores a key and a nonce together in a
config file, or reuses an object across messages, or restarts a service that generates nonces from
a counter it did not persist.

## Key terms

| Term | Short form |
| --- | --- |
| **Block cipher** | Reversibly transforms one fixed-size block under a key. AES. |
| **Stream cipher** | Generates a keystream to XOR with the data. ChaCha20. |
| **Mode of operation** | The scheme that turns a block cipher into a message encryption scheme. |
| **ECB** | Each block encrypted independently. Leaks which blocks are equal. Do not use. |
| **CTR** | Encrypts a counter to make a keystream, XORs it in. Confidentiality only. |
| **Nonce / IV** | A value that must be unique per encryption under a key. Need not be secret. |
| **MAC** | Message authentication code. Integrity and authenticity, no confidentiality. HMAC. |
| **AEAD** | Authenticated encryption with associated data. Confidentiality *and* integrity. AES-GCM. |
| **KDF** | Derives keys from a password or another key. PBKDF2, HKDF, Argon2. |
| **One-time pad** | Information-theoretically secure, and impractical: the key is as long as the message and must never be reused. Nonce reuse in CTR is this failure in miniature. |

## Looking ahead

Week 8 is the other half of cryptography: key pairs, hashing, and signatures, and the question
symmetric cryptography cannot answer, which is how two people who have never met agree on a key.
Quiz 3 covers both weeks.

<!--@include: ../../../parts/cs331-questions-button.md-->
