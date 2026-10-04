---
next: false
prev: false
---

# A9 - Who Are You Really Talking To?

<SlideView />

## Three questions, every page load

Every time you open a page over HTTPS, your machine answers three questions
before it shows you anything:

- Was this message **changed** on the way?
- Is this server **who it claims to be**?
- Can anyone else **read** it?

The padlock in the address bar is a yes, yes and no. Chapter 8 is the machinery
behind that padlock, and today is about watching each piece of it work.

## Alice, Bob and Trudy

Alice and Bob want to talk. Trudy sits on the path between them and can
eavesdrop, insert messages, impersonate either side, hijack the connection, or
just knock it over.

| Property | Means | Provided by |
| -------- | ----- | ----------- |
| Confidentiality | only Alice and Bob understand it | encryption |
| Message integrity | nobody changed it on the way | hash, MAC |
| Authentication | each side is who it claims to be | signatures, certificates |
| Availability | the service is reachable | filtering, redundancy |

Encryption only covers the first row. That surprises a lot of people.

## Symmetric keys: fast, but who gets the key?

Alice and Bob share **one** key, and the same key encrypts and decrypts. AES is the one
you use every day, and modern CPUs have instructions built in just for it.

The catch is getting the key to Bob in the first place. If Alice could send it
to him secretly, she would not need encryption. That is the **key distribution
problem**, and most of chapter 8 is about getting around it.

## Public keys: two halves

Each party has a **public key** they hand to anyone and a **private key** they
never share. What one half does, only the other half can undo.

- **Encrypt** with Bob's public key, and only Bob's private key can read it.
- **Sign** with Alice's private key, and anyone with her public key can check it.

RSA's security rests on how hard it is to factor a very large number back into
its two primes.

## Real systems use both

Public key crypto is orders of magnitude slower than symmetric, far too slow to
encrypt a video stream.

So real protocols do it in two steps:

1. Use public key crypto once, to agree on a fresh **session key**.
2. Use that session key with fast symmetric encryption for everything else.

TLS, SSH, PGP and your VPN all work this way.

## A hash is a fingerprint

A cryptographic hash turns any input, a sentence or a 4 GB ISO, into a fixed size
fingerprint. SHA-256 always produces 256 bits, which is 64 hex digits.

Two properties make it cryptographic and not just a checksum:

- **One way.** Given the fingerprint, you can not work backwards to the input.
- **Collision resistant.** Nobody can find two different inputs with the same
  fingerprint.

On Linux, `sha256sum` prints it. You have seen these next to every download link
for years.

## Broken hashes are not hypothetical

- **2012.** The Flame malware used an MD5 collision to forge a certificate that
  chained up to Microsoft, then spread by posing as Windows Update.
- **2017.** Google and CWI Amsterdam published two different PDF files with the
  same SHA-1 hash. It took about 9 quintillion SHA-1 computations.

MD5 is broken, SHA-1 is broken, use SHA-256. When a hash falls, everything built
on "nobody can make two inputs match" falls with it.

## A MAC mixes in a secret

A plain hash uses no key. Same input, same output, for anyone who runs it.

A **message authentication code** hashes the message together with a secret that
only Alice and Bob share. HMAC (RFC 2104, 1997) is the standard way to build one,
and `openssl dgst -hmac` computes it.

Keep both of those definitions in your head for round 1, because the difference
between them is the whole question.

## A signature is a MAC anyone can check

A MAC has one weakness: Alice and Bob hold the **same** secret, so Bob can not
prove to anyone else that Alice wrote the message. He could have made it himself.

A **digital signature** fixes that. Alice hashes the message and signs the hash
with her **private** key. Anyone with her public key can verify it, and only she
could have produced it. That property is called non-repudiation.

## Whose key is this, anyway?

Public keys solve key distribution, except for one thing. Alice asks for Bob's
public key, and Trudy, sitting in the middle, hands Alice her own key instead.

Alice now encrypts everything to Trudy, and does it very securely. 🔒

The math is perfect and completely useless if you have the wrong key. So the real
question is how Alice knows a public key actually belongs to Bob.

## Certificates

A **certificate** binds a name to a public key, and a **certification authority**
(CA) signs it to vouch for that binding. The fields you will read today:

- **Subject** - who the certificate was issued to
- **Issuer** - the CA that signed it
- **Validity** - `notBefore` and `notAfter`
- **Subject Alternative Name** - the host names it is actually good for

Browsers check the host name against the SAN list. Chrome stopped looking at the
subject's name for this in 2017.

## A chain of signatures

A CA does not sign your certificate with its most precious key. The chain looks
like this:

```text
root CA          signs itself, its private key is kept offline
  intermediate   signed by the root, signs certificates every day
    leaf         signed by the intermediate, the one the server uses
```

The server sends the leaf and the intermediates. Your machine checks each
signature with the key of the one above it, all the way up.

## Somebody has to be trusted

The root at the top signs its own certificate, so its signature proves nothing.
Your machine trusts it because the root was **already on your machine**: your OS
or browser ships with a list of root certificates, the **root store**.

Certificates do not get rid of the trust problem. They move it to the CAs, and to
whoever decides which CAs make the list.

## When a CA gets it wrong

**Summer 2011.** Attackers broke into DigiNotar, a Dutch CA, and issued 531
fraudulent certificates, including one for `*.google.com`.

That certificate was used to read Gmail traffic from roughly 300,000 IP addresses,
nearly all of them in Iran. Every browser that trusted DigiNotar's root accepted
it without a warning, because it was signed correctly.

Browsers pulled DigiNotar from their root stores, and the company was bankrupt
within weeks. One bad CA undermines every site on the Internet, not just its own
customers.

## Three checks before you trust a certificate

Every TLS client, from Firefox to `curl` to Python's `requests`, checks at least
three things:

1. **The chain.** Every signature verifies, up to a root in the local root store.
2. **The dates.** Right now is between `notBefore` and `notAfter`.
3. **The name.** The host you asked for is in the SAN list.

Any one of these failing is enough to refuse the connection.

## Certificates expire on purpose

A stolen private key is good to an attacker until the certificate expires, so the
industry keeps making lifetimes shorter:

| Starting | Longest a public certificate can last |
| -------- | ------------------------------------- |
| September 2020 | 398 days |
| March 15, 2026 | 200 days |
| March 15, 2027 | 100 days |
| March 15, 2029 | 47 days |

At 47 days, renewing by hand is no longer realistic. Renewal has to be automated.

## Turning the checks off

Every TLS library lets you skip verification: `curl -k`, `verify=False` in
Python. It is usually added to make an error go away, and then it ships.

In 2012, a paper titled "The Most Dangerous Code in the World" found certificate
validation broken or switched off in banking apps, cloud SDKs and payment
libraries.

A connection with the checks off is still encrypted. Ask yourself: encrypted to
**whom**?

## TLS in one slide

TLS sits between the application and TCP, which is why HTTPS is just HTTP inside
it.

1. Client and server agree on a cipher suite.
2. The server sends its certificate chain, and the client runs the three checks.
3. They agree on a shared secret and derive the session keys from it.
4. Every record after that is encrypted and MACed, with a sequence number so it
   can not be replayed or reordered.

TLS 1.3 (RFC 8446, 2018) does this in one round trip. TLS 1.0 and 1.1 were
formally retired in 2021.

## What encryption covers

TLS encrypts the **records**, the application's data. It runs on top of TCP, so it
has no say over the TCP and IP headers underneath it, and some of the handshake
has to happen before there are any keys at all.

Think back to the packets you took apart in P4. Which fields were in front of the
application data? Keep that list in mind for round 4.

## Trust has to start somewhere

Every system that uses public keys needs a first key that you accept without
proof. For the web, that is the root store.

You have met another answer to this problem. The first time you ran `ssh onyx`, it
asked:

```text
The authenticity of host 'onyx.boisestate.edu' can't be established.
ED25519 key fingerprint is SHA256:...
Are you sure you want to continue connecting (yes/no/[fingerprint])?
```

You typed `yes`. Today we work out what that `yes` meant.

## Today

Every piece of this is visible from Onyx: a hash, a MAC, Boise State's certificate
chain, and four broken certificates on a test site built to fail.

```bash
ssh onyx
```

Grab a worksheet. We predict first, then we look.
