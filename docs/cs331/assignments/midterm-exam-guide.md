# 9.02 Midterm Exam Guide

**Week 9 · 150 points · 90 minutes · taken in Canvas**

This page tells you what is on the midterm, how it is structured, and how to prepare. The exam
itself opens in Canvas during week 9 (March 8-14).

## Format

| | |
| --- | --- |
| **Where** | Canvas, from wherever you are. No testing centre appointment required. |
| **When** | Open for the whole of week 9. Once you start, you have 90 minutes. |
| **Attempts** | One. |
| **Materials** | Open book, open notes, open CyBOK. You may use anything you like, including AI tools, per the [AI policy](../index.md#ai-policy). |
| **Points** | 150, which is 15% of the course. |

The exam is open book because the questions are not about recall. Looking up a definition will not
answer part B or part C, and it will cost you time you need.

Week 9 has **no new reading and no other graded work**. The week is for reviewing and taking this.

## What it covers

Weeks 1 through 8. Nothing from week 10 onward appears.

| Objective | Where you learned it | Weight on the exam |
| --- | --- | --- |
| **1.1** CIA triad, identifying which goal a failure violates | Week 1 | Part A |
| **1.2** Threat, vulnerability, attack, risk used correctly | Week 1 | Part A |
| **1.3** Saltzer and Schroeder principles applied to a system | Week 2, Lab 1 | Parts A and C |
| **1.4** Human error and usability in security failures | Week 2 | Part A |
| **1.5** Legal, regulatory, and ethical constraints; disclosure | Week 3 | Part A |
| **2.1** Data flow diagram with trust boundaries | Week 4, Lab 2 | Part C |
| **2.2** STRIDE threat enumeration | Week 4, Lab 2 | Part C |
| **2.3** Likelihood and impact assessment | Week 4, Lab 2 | Part C |
| **2.4** Access control matrix construction | Week 6, Lab 3 | Part C |
| **2.5** ACL, capability list, RBAC, and their tradeoffs | Week 6, Lab 3 | Parts B and C |
| **3.1** Block ciphers, modes, and why ECB fails | Week 7, Lab 4 | Part B |
| **3.2** Confidentiality vs. integrity vs. authenticity | Week 7, Lab 4 | Part B |
| **3.3** Symmetric vs. public-key: distribution, cost, use | Week 8, Lab 5 | Part B |
| **3.4** Signature verification and what it proves | Week 8, Lab 5 | Part B |
| **5.1** Selecting authentication factors for a threat model | Week 5, D3 | Part B |
| **5.2** Evaluating a policy against NIST SP 800-63B-4 | Week 5, D3 | Part B |
| **5.3** Least privilege and separation of privilege | Week 6, Lab 3 | Part C |
| **5.4** Fail-safe defaults and complete mediation | Week 2, Lab 1 | Parts A and C |

## Structure

### Part A: Vocabulary and concepts (40 points, about 20 minutes)

Twenty multiple-choice and multiple-answer questions, auto-graded, drawn from the same pool as
Quizzes 1 and 2. If you did well on those quizzes, this part will feel familiar.

Covers objectives 1.1-1.5 and 5.4.

### Part B: Short answer (50 points, about 30 minutes)

Five questions, three to five sentences each. These ask you to explain a mechanism or make a
comparison, not to recall a definition.

The kinds of thing they ask:

- Given a described failure, name which security property broke and which primitive would have
  supplied it.
- Given two designs, say which trades what for what, and under which threat model you would
  choose each.
- Given a claim about a system, say what evidence would support it and what would not.

Covers objectives 2.5, 3.1-3.4, 5.1, 5.2.

### Part C: Applied scenario (60 points, about 40 minutes)

One system description of about 400 words, a system you have not seen before, in the same style as
[SnapVault](../data/photoshare-system.md) but smaller. You will be asked to:

1. Identify the trust boundaries and the subjects, objects, and rights.
2. Enumerate threats against a named part of it using STRIDE.
3. Build a small access control matrix and reduce it to least privilege.
4. Critique one design decision using the Saltzer and Schroeder principles.

Covers objectives 1.3, 2.1-2.5, 5.3, 5.4.

This part is worth the most and takes the longest. Budget your time so you reach it.

## How to prepare

**The highest-value preparation is re-reading your own graded work.** Labs 1, 2, 3, 4, and 5 and
Discussion 3 map directly onto parts B and C. Read my comments on them.

Then, in order of usefulness:

1. **Redo Lab 2's STRIDE table from memory**, on a different system, your bank's app, your phone.
   Twenty minutes. Part C is this exercise under time pressure.
2. **Redo Lab 3's matrix** for a system with three subjects and three objects, then write out the
   ACL and capability list versions. Ten minutes.
3. **Re-read the eight principles** in [Lab 1](lab-01-security-principles-audit.md) until you can
   list them without looking, and can give one example of a violation of each.
4. **Re-run [crypto_demo.py](../data/crypto_demo.py) and [sign_demo.py](../data/sign_demo.py)**
   and make sure you can explain each section's output to somebody else.
5. **Re-take Quizzes 1 and 2.** Canvas will let you review them.
6. **Skim, do not re-read, the CyBOK sections.** Know where things are rather than memorising them.

## Practice questions

Work these without notes first, then check.

**A-style.** A company's file server is misconfigured so that any employee can read any other
employee's files. No files are altered and the server stays up. Which security goal has been
violated, and which two have not?

**A-style.** A hospital's password reset process lets anyone who knows an employee's birthday and
employee ID reset that employee's password. Is this a vulnerability, a threat, or an attack? Define
all three in your answer.

**B-style.** A developer encrypts customer records with AES in ECB mode and says "the data is
encrypted, so it is safe." Give two distinct reasons this is wrong. One must be about ECB
specifically and one must be about what encryption does not provide.

**B-style.** An organisation with 400 employees wants every employee to be able to send an
authenticated message to any other. Compare the number of keys needed under a shared-secret scheme
and a public-key scheme, and say what problem the public-key scheme creates that the shared-secret
scheme does not.

**B-style.** A password policy requires 8 characters with an upper case letter, a digit, and a
symbol, forces a change every 60 days, and blocks password managers from pasting into the field.
Name three things NIST SP 800-63B-4 says are wrong with it, and say what it should require instead.

**C-style.** A campus print service lets any student send a job from any machine, releases it when
they tap their ID card at the printer, and stores every job as a PDF on a shared server for 72
hours. Staff in IT can browse that server. Draw the trust boundaries. Give one threat in each STRIDE
category. Then name the two principles this design violates most seriously and say what you would
change.

## If something goes wrong

If Canvas crashes, your internet drops, or the timer runs out because of a technical problem, email
me immediately (before you do anything else), and I will look at the Canvas logs. See the
[Exam and Quiz Policy](../index.md#exam-and-quiz-policy).
