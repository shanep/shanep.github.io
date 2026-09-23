# Quiz 2: Authentication

**Week 5 · 30 points · 15 questions × 2 points · 15 minutes · one attempt · taken in Canvas**

Covers week 5: identity management, user authentication, authentication factors, credential
storage, and NIST SP 800-63B-4.

## Objectives assessed

| Items | Objective |
| --- | --- |
| 1-4, 9-12 | **5.1**: Select authentication factors appropriate to a stated threat model and justify the choice |
| 5-8, 13-15 | **5.2**: Evaluate a real password and MFA policy against NIST SP 800-63B-4 |

([TLO 5](../objectives.md#tlo-5--applying-authentication-authorization-and-secure-design-principles))

---

**Q1.** Which of these is an authentication factor of the *inherence* kind, something you are?
*(Objective 5.1)*

- A. A one-time code from an authenticator app
- B. A fingerprint
- C. A hardware security key
- D. A security question about your first pet

*Answer:* **B**: Inherence is a biometric property. A and C are possession factors; D is a
knowledge factor, and a weak one, because the answer is often discoverable. (CyBOK §14.5.2)

---

**Q2.** Select **all** that are true of biometric authentication as CyBOK describes it.
*(Objective 5.1)*

- A. A biometric cannot be revoked and reissued if it is compromised
- B. Biometric matching is a threshold decision, so it has both false accept and false reject rates
- C. A fingerprint is secret in the way a password is secret
- D. Biometrics are well suited to identifying a person locally on a device they possess

*Answer:* **A, B, and D**: C is false, and it is the most important thing to understand about
biometrics: you leave fingerprints on everything you touch and your face is public. A biometric
establishes *which person is present*, not *who knows a secret*. (CyBOK §14.5.2.2)

---

**Q3.** A service is worried about attackers who phish credentials by putting up a convincing
lookalike login page. Which second factor gives the strongest protection against that specific
threat? *(Objective 5.1)*

- A. A six-digit code sent by SMS
- B. A six-digit code from a time-based authenticator app
- C. A FIDO2 security key or passkey
- D. A security question

*Answer:* **C**: FIDO2 authenticators bind the credential to the site's origin, so the
authenticator simply will not produce a response for the lookalike domain. A and B can both be
relayed in real time by a phishing site that asks the victim for the code and immediately replays
it. This is the difference between "second factor" and "phishing-resistant second factor."
(CyBOK §14.5.2.3, §14.5.2.5; NIST SP 800-63B-4 §3)

---

**Q4.** Why is SMS considered the weakest of the commonly deployed second factors?
*(Objective 5.1)*

- A. The codes are too short
- B. Delivery depends on the mobile network, which is vulnerable to SIM swapping and interception, and the code can be relayed by a phishing site
- C. It requires the user to own a phone
- D. It is not a possession factor at all

*Answer:* **B**: An attacker who persuades a carrier to move the victim's number to their own SIM
receives the codes. SMS is still a genuine possession factor and still far better than no second
factor: it is just the weakest of them. (CyBOK §14.5.2.5)

---

**Q5.** According to NIST SP 800-63B-4, which of these password rules should an organisation
**stop** enforcing? *(Objective 5.2)*

- A. A minimum length of 8 characters
- B. Mandatory periodic password expiry in the absence of any evidence of compromise
- C. Checking new passwords against a list of known-breached passwords
- D. Allowing all printable characters, including spaces

*Answer:* **B**: Forced rotation on a schedule produces predictable derivative passwords
(`Spring2027!` becoming `Summer2027!`) and buys very little. NIST recommends forcing a change when
there is evidence of compromise, not on a calendar. (NIST SP 800-63B-4 §3)

---

**Q6.** Select **all** that NIST SP 800-63B-4 recommends. *(Objective 5.2)*

- A. Requiring a mixture of upper case, lower case, digits, and symbols
- B. Screening chosen passwords against known-breached lists
- C. Blocking paste into the password field to discourage password managers
- D. Supporting passwords of at least 64 characters

*Answer:* **B and D**: A is explicitly discouraged: composition rules push users toward predictable
patterns without adding much real entropy. C is explicitly discouraged because it breaks password
managers, which are one of the few things that reliably improve real-world password quality.
(NIST SP 800-63B-4 §3)

---

**Q7.** A site stores passwords as a single unsalted SHA-256 hash. An attacker steals the database.
What have they gained, beyond the ability to guess each password individually? *(Objective 5.2)*

- A. Nothing more; each password must still be guessed one at a time
- B. They can immediately reverse SHA-256 to recover the passwords
- C. They can see which accounts share a password, and one precomputed table can be tested against every account at once
- D. They can log in without guessing anything

*Answer:* **C**: This is what the salt is for. Without one, identical passwords produce identical
hashes, and a single precomputed lookup table works against the whole database. B is wrong: SHA-256
is not reversible; the attack is guessing, done very fast. (CyBOK §14.5.2.1)

---

**Q8.** A site switches from SHA-256 to a deliberately slow function such as PBKDF2, bcrypt, or
Argon2 for password storage. What does this change, and what does it not? *(Objective 5.2)*

- A. It makes weak passwords strong
- B. It makes each guess more expensive, which matters enormously across billions of guesses, but a password in the attacker's wordlist is still found
- C. It prevents the database from being stolen
- D. It makes the passwords unrecoverable under any circumstances

*Answer:* **B**: This is precisely what
[password_demo.py](../data/password_demo.py) shows: the same two accounts are cracked either way,
but at roughly fifteen guesses per second instead of a million. Slow hashing changes the economics,
not the outcome for a guessable password. (CyBOK §14.5.2.1; NIST SP 800-63B-4 §3)

---

**Q9.** *Identification*, *authentication*, and *authorisation* are three different things. Which
sequence is correct? *(Objective 5.1)*

- A. Authorisation, then identification, then authentication
- B. Identification (who you claim to be), then authentication (evidence for the claim), then authorisation (what that identity may do)
- C. Authentication, then authorisation, then identification
- D. They are three names for the same step

*Answer:* **B**: Typing a username is identification. Proving it is authentication. Deciding what
that account may then do is authorisation, which is week 6. (CyBOK §14.5.1, §14.3)

---

**Q10.** A company issues session tokens that are valid for 90 days, are not bound to a device or
IP address, and cannot be listed or revoked by the user. Which is the most accurate assessment?
*(Objective 5.1)*

- A. This is fine, because the initial authentication was strong
- B. A strong initial authentication does not help once the token is stolen; the token is now the credential, and it is a long-lived one that cannot be withdrawn
- C. The risk is limited because tokens are random
- D. This only matters if the company handles payment data

*Answer:* **B**: Whatever effort went into authenticating the user at login, the session token is
what proves identity for the next ninety days. Randomness stops guessing but does nothing about
theft. This is also a complete mediation failure, see Quiz 1, question 9. (CyBOK §14.5.4;
§1.4.1)

---

**Q11.** Select **all** that are reasonable reasons to choose a *knowledge* factor over a
*possession* factor for a particular system. *(Objective 5.1)*

- A. The user population cannot be relied on to carry a specific device
- B. There is no budget to issue and replace hardware tokens
- C. Knowledge factors are more resistant to phishing
- D. The account being protected has low value and the login volume is very high

*Answer:* **A, B, and D**: C is false; knowledge factors are the *most* phishable, because a
person can be talked into typing them into anything. A, B, and D are genuine engineering
constraints, and naming the constraint honestly is what choosing a factor for a threat model means.
(CyBOK §14.5.2)

---

**Q12.** An organisation authenticates users through a single sign-on provider using OpenID
Connect. What is the main security consequence of that design choice? *(Objective 5.1)*

- A. Nothing changes; it is only a convenience
- B. Authentication strength and availability now depend on the identity provider, which becomes a concentrated target and a single point of failure
- C. It removes the need for multi-factor authentication
- D. It makes each individual application more secure against its own vulnerabilities

*Answer:* **B**: Federated identity genuinely improves a lot of things (one place to enforce MFA,
one place to revoke access) but it concentrates the consequences of compromise. That is a
trade-off to make deliberately. (CyBOK §14.5.3.4)

---

**Q13.** A university's password policy reads: *minimum 8 characters, must include one upper case
letter, one digit, and one symbol; must be changed every 60 days; may not be pasted into the field;
may not reuse the last 5 passwords.* How many of these five rules does NIST SP 800-63B-4 advise
against? *(Objective 5.2)*

- A. None
- B. One
- C. Two
- D. Three

*Answer:* **D**: Three: the composition requirement, the 60-day expiry, and the paste block. The
8-character minimum is acceptable as a floor (though a longer one is better), and blocking reuse of
recent passwords is not objectionable. (NIST SP 800-63B-4 §3)

---

**Q14.** Select **all** that would improve the policy in question 13, according to
NIST SP 800-63B-4. *(Objective 5.2)*

- A. Raise the minimum length and drop the composition rules
- B. Screen new passwords against a breached-password list
- C. Allow paste, and recommend a password manager
- D. Shorten the expiry period from 60 days to 30

*Answer:* **A, B, and C**: D moves in the wrong direction: shorter forced rotation produces more
predictable derivative passwords, not fewer. (NIST SP 800-63B-4 §3)

---

**Q15.** An administrator argues: "Our password policy does not matter much, because we require MFA
for everything." What is the strongest response? *(Objective 5.2)*

- A. They are right; MFA makes password quality irrelevant
- B. MFA reduces the consequence of a guessed password but does not eliminate it: factors can be phished, relayed, or fatigued, and some access paths often bypass MFA entirely
- C. They are wrong, because MFA is not a real security control
- D. They are right, provided the MFA uses SMS

*Answer:* **B**: MFA is the single highest-value control in this area, and the administrator is
mostly right. But push-fatigue attacks, real-time relay phishing, and legacy or service-account
paths that skip MFA are all common, and a guessable password makes every one of them easier.
(CyBOK §14.5.2.5; NIST SP 800-63B-4 §3)

---

## Canvas import notes

*Instructor note, not shown to students.* Items 2, 6, 11, and 14 are multiple-answer; the rest are
single-answer multiple choice. All items are worth 2 points.
