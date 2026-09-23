# 5.01 Readings and Lecture Notes

**February 8-14 · Reading: 10 pages plus NIST §3 · About 2 hrs 35 min with the worked example**

What to do this week, and when it is due, is on the [Module 5 Overview](week-05-overview.md).

## Readings

| Source | Sections | Printed pages | Length | Time |
| --- | --- | --- | --- | --- |
| [CyBOK v1.1.0](../docs/CyBOK_v1.1.0.pdf) | §14.5.1 Identity Management | 479-480 | 1 p | 10 min |
| [CyBOK v1.1.0](../docs/CyBOK_v1.1.0.pdf) | §14.5.2 User Authentication: passwords, biometrics, tokens, behavioural, 2FA | 480-484 | 4 pp | 35 min |
| [CyBOK v1.1.0](../docs/CyBOK_v1.1.0.pdf) | §14.5.3 Authentication in Distributed Systems, Kerberos, SAML, OAuth2/OIDC | 484-487 | 3 pp | 25 min |
| [CyBOK v1.1.0](../docs/CyBOK_v1.1.0.pdf) | §14.5.4 Facets of Authentication | 487-489 | 2 pp | 15 min |
| NIST SP 800-63B-4 | §3, Authentication and Authenticator Management |: | skim | 30 min |

NIST SP 800-63B-4 (July 2025):
<https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-63B-4.pdf>. It is long. Read §3
and skim the rest; you are looking for what it *requires*, what it *recommends against*, and (most
usefully) what it has stopped recommending since the versions most policies were written against.

## The three factor types

| Type | What it is | Examples | Main weakness |
| --- | --- | --- | --- |
| **Knowledge** | Something you know | Password, PIN, security question | Can be phished, guessed, reused, or shared |
| **Possession** | Something you have | Security key, authenticator app, SMS code, smart card | Can be lost, stolen, or (for codes) relayed |
| **Inherence** | Something you are | Fingerprint, face, voice | Cannot be revoked and reissued; not secret |

"Multi-factor" means factors of **different types**. A password plus a security question is one
factor twice.

**Not all second factors are equal against phishing.** A code (from SMS or an authenticator
app) can be relayed: the phishing site asks for it and replays it to the real site within the thirty
seconds it is valid. A FIDO2 security key or passkey cannot be relayed, because the authenticator
checks the site's origin itself and will not respond to the lookalike domain. This distinction is on
Quiz 2 and it is the single most useful practical fact in this week.

## Worked example

Run [data/password_demo.py](../data/password_demo.py) before you go further: this section walks
through what it prints. It needs nothing installed.

```
python3 password_demo.py
```

### What the numbers say

On a typical laptop you will see something close to:

```
STORED WITH A FAST HASH (one pass of SHA-256):
  guesses per second: 1,704,773
  accounts cracked:   2 of 3

STORED WITH A SLOW HASH (PBKDF2, 600,000 iterations):
  guesses per second: 15
  accounts cracked:   2 of 3
```

**The same two accounts fell either way.** That is the most important line in the output, and it is
the one people miss. A slow hash does not make a bad password good. `hunter2` was in the wordlist
and `hunter2` was found, at a million guesses a second and at fifteen.

What changed is the **rate**, by a factor of about a hundred thousand. Against a twenty-word list
that is the difference between instant and four seconds, irrelevant. Against a ten-million-word
list it is the difference between six seconds and eight days per account. That is the entire value
proposition of slow hashing, and it is a large one, but it is a statement about the attacker's
budget, not about the password.

**`carol` was never cracked by either run.** Her password was not in the wordlist. Length and
unpredictability are what decide whether a password is guessable; storage decides what an attacker
can afford after the database leaks. They are two different controls solving two different
problems, and neither substitutes for the other.

### What the salt does, and does not

The last section of the output shows two accounts with the same password producing different
stored hashes.

The salt buys two things: an attacker cannot tell from the database that two accounts share a
password, and one precomputed table no longer covers the whole database, the work becomes per
account.

The salt buys **nothing** against guessing an individual password. Guessing `letmein` still cracks
both accounts. It costs the attacker two runs instead of one.

Salts are not secret and do not need to be. They are stored in plain text alongside the hash. Their
job is to make the attacker's work scale with the number of accounts rather than being amortised
across all of them.

### Reading a policy against NIST

Here is a policy of the kind [D3](../discussions/d03-authentication-policy-critique.md) asks you to
find, scored against SP 800-63B-4 §3:

| Rule | Verdict |
| --- | --- |
| Minimum 8 characters | **Acceptable as a floor.** Longer is better; 8 is the documented minimum. |
| Must contain upper case, digit, and symbol | **Advised against.** Composition rules produce `Password1!` and add little real entropy. |
| Must be changed every 60 days | **Advised against.** Scheduled rotation produces `Spring2027!` → `Summer2027!`. Force a change on evidence of compromise. |
| Cannot be pasted into the field | **Advised against.** It breaks password managers, which are among the few things that reliably improve real password quality. |
| Cannot reuse the last 5 passwords | Not objectionable. |
| Screened against breached-password lists | **Recommended: and this policy does not do it.** |
| Maximum length 16 characters | **Advised against.** Support at least 64. A low maximum often hints the password is being stored in a fixed-size field, which raises a worse question. |

Three rules advised against, one recommended practice missing, and one rule that is a clue about
something else. That is what a policy critique looks like: rule by rule, with a citation, ending in
a count.

## Key terms

| Term | Short form |
| --- | --- |
| **Identification** | Claiming an identity. |
| **Authentication** | Providing evidence for the claim. |
| **Authorisation** | Deciding what the authenticated identity may do. Week 6. |
| **Authentication factor** | Knowledge, possession, or inherence. |
| **Multi-factor authentication** | Two or more factors of *different* types. |
| **Phishing-resistant authenticator** | One that binds to the site's origin, so it cannot be relayed. FIDO2, passkeys. |
| **Salt** | Per-user random value stored with the hash; defeats precomputation and cross-account correlation. |
| **Key derivation function** | A deliberately slow hash: PBKDF2, bcrypt, scrypt, Argon2. |
| **Credential stuffing** | Replaying username/password pairs from other breaches. |
| **Federated identity** | A separate identity provider authenticates on the application's behalf. SAML, OIDC. |

## Looking ahead

Week 6 is the other half: once the system knows who you are, what may you do? Lab 3 asks you to
write an access control policy down precisely enough to argue about, and then cut it to least
privilege.

<!--@include: ../../../parts/cs331-questions-button.md-->
