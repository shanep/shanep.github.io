# 0.02 Diagnostic Self-Check

**Week 1 · 0 points · ungraded · take it in Canvas**

## What this is

Ten questions to show you (and me) where the class is starting from. **It is not graded and it
does not affect your grade in any way.** Canvas will show it as 0 points.

Answer from what you already know. Do not look anything up, and do not use an AI tool: a wrong
answer here is genuinely more useful to both of us than a right one you did not produce yourself.
You will see the correct answers and explanations as soon as you submit.

Nobody is expected to know all of this in week 1. Several of these are things you will not learn
until week 12.

---

**Q1.** A hospital's patient records are still readable and still available, but someone changed a
dosage figure in one of them. Which security goal was violated?

- A. Confidentiality
- B. Integrity
- C. Availability
- D. None of these

*Answer:* **B**: Integrity is the property that data has not been altered by anyone unauthorised
to alter it. The records were still secret (confidentiality intact) and still reachable
(availability intact). Covered in week 1. (CyBOK §1.3.1)

---

**Q2.** What is the difference between a *vulnerability* and a *threat*?

- A. They are two words for the same thing
- B. A vulnerability is a weakness in a system; a threat is something or someone with the potential to exploit it
- C. A vulnerability is intentional; a threat is accidental
- D. A threat is a weakness in a system; a vulnerability is an attacker

*Answer:* **B**: A vulnerability is a property of your system. A threat is a potential cause of
harm that could act on it. Neither is an attack, which is a threat actually being carried out.
Covered in week 1. (CyBOK Glossary, printed page 951)

---

**Q3.** A website stores user passwords. Which is the best practice?

- A. Store them encrypted, so they can be decrypted if a user forgets one
- B. Store them as plain text but restrict database access
- C. Store a salted hash produced by a deliberately slow function
- D. Store the first four characters only

*Answer:* **C**: Passwords should be stored so that even the site operator cannot recover them.
A slow hash makes each guess expensive; a per-user salt stops one precomputed table covering
everybody. If a site can email you your existing password, it is doing this wrong. Covered in
week 5.

---

**Q4.** You visit a website and the browser shows a padlock. What does that tell you?

- A. The website is run by a legitimate, trustworthy business
- B. The traffic between you and that server is encrypted, and the server presented a certificate for that name that your browser accepted
- C. The website has been checked for malware
- D. Your data will not be sold

*Answer:* **B**: The padlock is a statement about the connection, not about the operator's
honesty. A criminal can obtain a valid certificate for a domain they control in a few minutes and
for free. Covered in week 10.

---

**Q5.** A program copies user input into a fixed-size buffer without checking the length. What kind
of vulnerability is this?

- A. SQL injection
- B. Cross-site scripting
- C. Buffer overflow
- D. Denial of service

*Answer:* **C**: This is the classic memory-safety bug. Covered in week 13.

---

**Q6.** Which of these best describes *least privilege*?

- A. Give everyone the same permissions to keep things simple
- B. Give each user and program only the access it needs to do its job, and no more
- C. Give administrators unlimited access and everybody else nothing
- D. Require a password for every action

*Answer:* **B**: One of the eight design principles from 1975 that this course keeps returning to.
Covered in week 2 and applied in week 6.

---

**Q7.** An attacker sends an email that looks like it comes from your bank and asks you to log in
at a link. What is this called?

- A. Phishing
- B. Spoofing
- C. Denial of service
- D. Privilege escalation

*Answer:* **A**: Phishing. Note that it also *involves* spoofing (pretending to be the bank), so B
is not wrong about the mechanism; A is the name of the attack. Covered in weeks 12 and 14.

---

**Q8.** True or false: if data is encrypted, an attacker who intercepts it cannot change it in a
way that produces a meaningful result.

- A. True
- B. False

*Answer:* **B, false**: Encryption provides secrecy. Integrity is a separate property that has to
be asked for separately, usually with an authentication tag. With some common modes an attacker who
knows what the plaintext says can flip specific bits to change it predictably, without ever knowing
the key. You will do this yourself in week 7.

---

**Q9.** A security tool is 99% accurate. It scans 1,000,000 events per day, of which about 100 are
genuinely malicious. Roughly how many alerts will it produce per day?

- A. About 100
- B. About 1,000
- C. About 10,000
- D. About 100,000

*Answer:* **C**: Roughly 10,099: 99 true positives plus about 1% of 999,900 benign events, which
is 9,999 false positives. Fewer than one alert in a hundred is real. This is the base-rate fallacy,
and it is why real security teams drown. Covered in week 15.

---

**Q10.** Which of these is the strongest reason to publish how a security mechanism works, rather
than keeping the design secret?

- A. It is required by law
- B. Secrets leak, and a mechanism whose security depends on its design staying secret fails permanently once it does
- C. Publishing makes the system faster
- D. There is no good reason; secrecy is safer

*Answer:* **B**: This is the *open design* principle. The security should rest on the key, which
can be changed, not on the design, which cannot. Covered in week 2.

---

## After you submit

Compare your answers to the explanations. If you got fewer than half right, that is completely
normal for week 1 and is not a signal about how you will do, every one of these topics is taught
from the beginning.

If you got most of them right, the course will still have plenty for you: the questions above ask
*what*, and the labs ask *why*, *how much*, and *what evidence would convince you*.
