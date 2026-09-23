# Week 10: Keys, Certificates, PKI, and TLS

**March 22-28 · Reading: 12 pages · Estimated total: 6.5 hours**

## Overview

Welcome back. Week 8 ended with an unanswered question: a signature verifies against a public key,
but what tells you whose key it is?

This week is the answer. A **certificate** is a signed statement binding a public key to a name.
Somebody you already trust signs it, and their key is vouched for by somebody else, up to a root
that your browser or operating system simply believes because it shipped with a list.

That last step is worth staring at. Four of the five checks a browser runs on a certificate are
arithmetic. The fifth is a decision somebody made on your behalf, before you ever opened the
browser.

## Objectives this week

- **[3.5](../objectives.md#tlo-3--comparing-cryptographic-mechanisms-and-their-limits)**: Interpret
  an X.509 certificate chain and identify the trust assumptions and failure modes of public key
  infrastructure.

## Read

| Source | Sections | Printed pages | Length | Time |
| --- | --- | --- | --- | --- |
| [CyBOK v1.1.0](../docs/CyBOK_v1.1.0.pdf) | §18.3.1 The Key Life-cycle | 625-627 | 2 pp | 15 min |
| [CyBOK v1.1.0](../docs/CyBOK_v1.1.0.pdf) | §18.3.2-18.3.7 Key derivation, generation, storage, transport, refreshing | 627-632 | 5 pp | 35 min |
| [CyBOK v1.1.0](../docs/CyBOK_v1.1.0.pdf) | §18.3.8 Managing Public Keys and PKI | 632-635 | 3 pp | 30 min |
| [CyBOK v1.1.0](../docs/CyBOK_v1.1.0.pdf) | §18.5.1 Transport Layer Security | 639-640 | 2 pp | 15 min |

**§18.3.8 is the core of the week.** It covers binding keys to identities via certificates, reliance
on naming and CA operations, and certificate status information, which is where revocation, the
hardest problem in PKI, lives.

## Worked example

Run [data/cert_inspect.py](../data/cert_inspect.py) alongside this section. It builds a root CA, an
intermediate CA, and three server certificates in memory, then runs the checks a browser runs.

```
python3 cert_inspect.py
```

### 1. What a certificate is

A certificate is a small structured document containing, at minimum:

- **Subject**: the name this certificate is about (`CN=www.example.edu`)
- **Subject Alternative Name**: the list of DNS names it actually covers; this is what browsers
  check, not the subject common name
- **Public key**: the key being bound to that name
- **Issuer**: who signed it
- **Validity period**: not before, not after
- **A signature** by the issuer over all of the above

That is it. A certificate is a **signed assertion**: "the organisation named in Issuer says that
this public key belongs to this name, until this date."

### 2. The five checks

Here is what the script prints for the good certificate:

```
  [PASS] validity period covers today
  [PASS] hostname appears in SAN
  [PASS] signed by the intermediate CA
  [PASS] intermediate signed by the root
  [PASS] root is in the trust store
  VERDICT: accept the connection
```

The expired certificate fails exactly one check, and the wrong-name certificate fails exactly one
check, and in both cases the browser refuses. There is no "mostly valid."

Now change `HOSTNAME_BEING_VISITED` to `"shop.example.edu"` and re-run. The picture inverts: the
`good` certificate now fails, because `shop.example.edu` is not in its SAN list, and the
`wrong-name` certificate (which was issued for exactly that name) passes everything. Nothing
about either certificate changed. **A certificate is not valid or invalid in itself; it is valid
for a particular name at a particular time.**

### 3. Why expiry, when the cryptography is fine

The expired certificate is still correctly signed by a CA the browser trusts. The signature verifies.
The mathematics is unchanged. So what is the date for?

§18.3.1 frames it as the key life-cycle. A certificate is a statement, and statements go stale:

- Keys get compromised, and the owner does not always find out.
- Organisations change hands, domains get sold, employees leave with copies.
- Algorithms and key sizes that were adequate in 2019 are not adequate forever.
- **Revocation does not work well.** If a key is compromised the CA can publish a revocation, but
  checking revocation is slow, often fails open, and is skipped by many clients. A short expiry is a
  crude but reliable substitute: everything self-revokes on a schedule whether or not anybody
  noticed the compromise.

That last point is why certificate lifetimes have gone from five years to about one year to, for
many issuers now, ninety days. Expiry is revocation you do not have to detect.

### 4. The check that is not arithmetic

Four of the five checks are computation on the certificate's contents. The fifth (*root is in the
trust store*) is not. Your operating system or browser ships with a list of a few hundred root
certificates it will believe, chosen by a vendor, updated without asking you.

Two consequences follow, and Lab 6 asks you about both.

**Every CA in that store can issue a certificate for any name.** There is no partitioning by which
CA is entitled to which domains. A CA that is compromised, coerced, or simply careless can issue a
certificate for `www.boisestate.edu`, and every browser on earth would accept it.

That has happened. The usual answer is not "trust fewer CAs": it is to make misissuance
*detectable*:

- **Certificate Transparency** requires CAs to log every certificate they issue to public,
  append-only logs, so a domain owner can watch for certificates they did not ask for. It does not
  prevent misissuance; it makes it visible afterwards.
- **Certificate pinning** has a client insist on a specific key or CA for a specific site. It works,
  and it breaks the site hard when the pinned key legitimately changes, which is why it has largely
  retreated to mobile apps.

Neither eliminates the trust assumption. They change it from *"trust several hundred organisations
to never make a mistake"* to *"trust several hundred organisations, but expect to find out when one
does."* That is a real improvement and it is not the same as not having to trust anybody.

### 5. What the padlock does not mean

TLS gives you a confidential, integrity-protected channel to *the entity that presented a
certificate your browser accepted for the name you typed*.

It does not tell you the operator is honest. Anybody who controls a domain can get a valid
certificate for it, free, in minutes. `paypa1-security.example` can have a perfect padlock.

It also does not protect data once it arrives. Everything from week 4 onward about how the server
stores what you send is untouched by TLS.

## Do this week

| | Task | Points | Due |
| --- | --- | ---: | --- |
| 1 | [Lab 6: Certificates and TLS](../assignments/lab-06-certificates-and-tls.md) | 38 | Sunday |

Lab 6 asks you to inspect a real certificate chain in your browser as well as run the script. Do
the browser part first; it takes ten minutes and makes the script output make sense.

## Key terms

| Term | Short form |
| --- | --- |
| **X.509 certificate** | A signed binding of a public key to a name, with a validity period. |
| **Subject Alternative Name (SAN)** | The DNS names a certificate actually covers. What browsers check. |
| **Certificate authority (CA)** | An organisation that signs certificates. |
| **Root of trust** | A self-signed CA certificate that is trusted because it is in the trust store. |
| **Intermediate CA** | Signed by the root, signs end-entity certificates. Keeps the root key offline. |
| **Chain of trust** | Leaf → intermediate → root, each signed by the next. |
| **Trust store** | The list of roots your OS or browser believes. Chosen by a vendor. |
| **Revocation** | Declaring a certificate invalid before it expires. CRLs, OCSP. Works poorly in practice. |
| **Certificate Transparency** | Public append-only logs of issued certificates. Detection, not prevention. |
| **Pinning** | A client requiring a specific key or CA for a specific site. |
| **Forward secrecy** | Session keys not recoverable from the long-term key later. |

## Time estimate

| Activity | Time |
| --- | --- |
| Reading (12 pages) | 1 hr 35 min |
| This module page and running `cert_inspect.py` | 40 min |
| Lab 6 | 1 hr 30 min |
| Review and slack | 2 hrs 30 min |
| **Total** | **~6.5 hrs** |

## Looking ahead

Week 11 moves down the stack to the network itself: what an attacker on the path can do, at which
layer, and what firewalling, segmentation, and monitoring each actually buy. Quiz 4 covers it.
