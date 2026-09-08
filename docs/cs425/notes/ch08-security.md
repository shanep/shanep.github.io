# Chapter 8 - Security in Computer Networks

**Reading:** Kurose & Ross, chapter 8

## 8.1 What is network security?

Four properties, and you should be able to name the mechanism that provides each:

| Property | Means | Provided by |
| -------- | ----- | ----------- |
| Confidentiality | only sender and receiver understand the message | encryption |
| Message integrity | the message was not altered in transit | cryptographic hash, MAC |
| Authentication | each party is who it claims to be | signatures, certificates, nonces |
| Availability | the service is reachable | rate limiting, filtering, redundancy |

The cast: Alice, Bob, and Trudy. Trudy can eavesdrop, insert, impersonate, hijack,
and deny service.

## 8.2 Principles of cryptography

**Symmetric key.** Alice and Bob share one key. Fast. The problem is distributing
the key in the first place.

- Block ciphers: DES, 3DES, AES.
- Cipher block chaining, so that two identical plaintext blocks do not encrypt to
  identical ciphertext blocks.

**Public key.** Each party has a public key and a private key. Encrypt with the
public key, decrypt with the private one. RSA's security rests on the difficulty of
factoring large numbers.

Public key crypto is orders of magnitude slower than symmetric. So in practice it is
used to establish a **session key**, and the session key does the bulk encryption.
That hybrid is what TLS does, and understanding why is more useful than memorizing
RSA's arithmetic.

## 8.3 Message integrity and digital signatures

**Cryptographic hash.** Easy to compute, computationally infeasible to invert or to
find two inputs with the same output. MD5 is broken; SHA-1 is broken; use SHA-256.

**MAC.** Hash the message concatenated with a shared secret. Provides integrity and
authentication, but not non-repudiation, because both parties hold the same secret.

**Digital signature.** Sign the hash with your **private** key. Anyone with the
public key can verify. Provides non-repudiation, because only you hold the private
key.

**Certificates and CAs.** A certificate binds an identity to a public key, signed by
a certification authority. This solves key distribution by moving the trust problem
to the CA, and does not eliminate it, which is worth being clear-eyed about.

## 8.4 End-point authentication

The chapter builds an authentication protocol through a series of failures, and the
failures are the lesson:

- `ap1.0`: "I am Alice." Trudy says the same thing.
- `ap2.0`: authenticate by IP address. Trudy spoofs it.
- `ap3.0`: send a password. Trudy replays it.
- `ap3.1`: send an encrypted password. Trudy replays the ciphertext.
- `ap4.0`: a **nonce**. Bob sends a one-time number, Alice encrypts it. A replay
  fails because the nonce never repeats.

## 8.5 Securing email

PGP: encrypt the message with a one-time symmetric key, encrypt that key with the
recipient's public key, and sign the hash with your private key. Confidentiality,
integrity, and authentication in one construction, built entirely from the pieces
above.

## 8.6 TLS

TLS sits between the application and TCP. The handshake:

1. Client and server negotiate the cipher suite.
2. The server presents its certificate and the client validates it.
3. They establish a shared master secret, from which four keys are derived: an
   encryption key and a MAC key in each direction.
4. Records are encrypted and MACed, with sequence numbers included in the MAC to
   prevent reordering and replay.

::: warning

TLS protects the **contents** of the connection. It does not hide that you connected,
who you connected to, how much data you sent, or when. Traffic analysis works fine
against TLS, and this distinction matters more than most people assume.

:::

## 8.7 Network layer security: IPsec and VPNs

**AH** provides authentication only. **ESP** provides authentication and
confidentiality, and is what everyone actually uses.

**Transport mode** protects the payload; **tunnel mode** protects the entire original
datagram by wrapping it in a new one. VPNs use tunnel mode.

## 8.8 Securing wireless LANs

WEP was broken badly: too short an initialization vector, reused, with no key
management. WPA2 and WPA3 replaced it. The general lesson is that rolling your own
cryptographic protocol goes poorly even when professionals do it.

## 8.9 Operational security: firewalls and IDS

- **Stateless packet filters** decide per packet on header fields.
- **Stateful filters** track connections and reject packets that make no sense for
  the connection state.
- **Application gateways** inspect at the application layer.
- **IDS/IPS** perform deep packet inspection against signatures, detecting or
  blocking.
