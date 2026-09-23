# Final Exam Guide

**Finals week · 150 points · 90 minutes · taken in Canvas**

This page tells you what is on the final, how it is structured, and how to prepare. The exam opens
in Canvas during finals week (May 3-7).

## Format

| | |
| --- | --- |
| **Where** | Canvas, from wherever you are. No testing centre appointment required. |
| **When** | Open for the whole of finals week. Once you start, you have 90 minutes. |
| **Attempts** | One. |
| **Materials** | Open book, open notes, open CyBOK. You may use anything you like, including AI tools, per the [AI policy](../index.md#ai-policy). |
| **Points** | 150, which is 15% of the course. |

## What it covers

**Emphasis on weeks 10 through 15**, which the midterm did not cover. Vocabulary and principles
from the first half are assumed (you will need them to answer questions about the second half), but there are no questions purely about weeks 1 to 8.

| Objective | Where you learned it | Weight on the exam |
| --- | --- | --- |
| **3.5** X.509 chains, PKI trust assumptions and failure modes | Week 10, Lab 6 | Parts A and B |
| **4.1** Network attacks at the protocol layer | Week 11, D4, Quiz 4 | Part A |
| **4.2** Network defenses for a described network | Week 11, D4, Quiz 4 | Part C |
| **4.3** Malware classification and ATT&CK mapping | Week 12, Lab 7 | Parts A and C |
| **4.4** Buffer overflows, stack layout, and mitigations | Week 13, Lab 8 | Parts A and B |
| **4.5** SQL injection and why parameterization defeats it | Week 14, Lab 9 | Parts A and B |
| **6.1** Prevention, detection, and mitigation as evidence classes | Week 13, Lab 8, Quiz 5 | Part B |
| **6.2** What static and dynamic analysis do and do not establish | Week 13, Lab 8 | Part B |
| **6.3** Evaluating whether evidence supports a security claim | Week 13, Lab 8 | Part B |
| **6.4** SAMM, BSIMM, Common Criteria as organizational evidence | Week 14, Quiz 5 | Part B |
| **7.1** Detection data sources and their limits | Week 15, Lab 10 | Part C |
| **7.2** Misuse vs. anomaly detection | Week 15, Lab 10 | Part C |
| **7.3** Finding brute-force and scanning activity in logs | Week 15, Lab 10 | Part C |
| **7.4** The base-rate fallacy and alert volume | Week 15, Lab 10 | Part C |
| **7.5** Incident response structured per NIST SP 800-61r3 | Week 15, Lab 10, D5 | Part C |

## Structure

### Part A: Concepts and mechanisms (40 points, about 20 minutes)

Twenty multiple-choice and multiple-answer questions, auto-graded, drawn from the same pool as
Quizzes 4 and 5 plus certificate material from week 10.

Covers objectives 3.5, 4.1, 4.3, 4.4, 4.5.

### Part B: Evidence and argument (50 points, about 30 minutes)

Five short-answer questions, three to five sentences each. This part is the assurance half of the
course, and it is the part students most often under-prepare.

The kinds of thing they ask:

- Given a security claim and the evidence offered for it, say what the evidence supports, what it
  does not, and what you would ask for instead.
- Given a testing result, state precisely what it establishes.
- Given a vulnerability, place a proposed countermeasure in the prevention / detection / mitigation
  categories and say what each category can and cannot deliver.
- Given a certificate or chain problem, say what failed and what the consequence is.

Covers objectives 3.5, 4.4, 4.5, 6.1-6.4.

### Part C: Applied scenario (60 points, about 40 minutes)

One scenario you have not seen: a described network and organisation, plus a short extract of log
data, about twenty lines. You will be asked to:

1. Identify what the log extract shows and name the activity.
2. Choose a detection model for it and justify the choice.
3. Do a short base-rate calculation and interpret the result.
4. Recommend containment, eradication, and recovery steps in the NIST SP 800-61r3 shape.
5. Recommend two network-level defenses and say what each would have limited.

Covers objectives 4.2, 4.3, 7.1-7.5.

This part is worth the most and takes the longest. Budget your time so you reach it. You will need
a calculator for question 3; Canvas will not stop you using one.

## How to prepare

**Re-read your own graded work first.** Labs 6, 7, 8, 9, and 10 and Discussions 4 and 5 map
directly onto all three parts. Read my comments.

Then:

1. **Redo Lab 10's base-rate calculation with different numbers.** Change the base rate to 0.1% and
   the false positive rate to 0.1% and see what happens to the answer. Fifteen minutes. Part C
   question 3 is this.
2. **Re-read your Lab 8 vendor-claim answer.** Part B is five questions in that shape.
3. **Re-run [cert_inspect.py](../data/cert_inspect.py)** with two or three different hostnames until
   you can predict the verdict before you press enter.
4. **Practise reading log lines.** Open [auth.log](../data/auth.log) and
   [web_access.log](../data/web_access.log) and find three things in each without using your Lab 10
   answers.
5. **Re-take Quizzes 4 and 5.**
6. **Make a one-page sheet** with: the six STRIDE categories, the ATT&CK tactics in order, the five
   certificate checks, the three countermeasure levels from CyBOK §15.2, and the base-rate formula.
   You may use it during the exam. Making it is the useful part.

## Practice questions

**A-style.** A browser refuses a connection and reports that the certificate is not trusted, though
the certificate is in date and the hostname matches. Give two distinct causes, and say how you would
tell them apart.

**A-style.** A function copies an attacker-controlled string into a fixed-size stack buffer with no
length check. Stack canaries, ASLR, and NX are all enabled. Is the vulnerability still present? Is
it still exploitable? Answer both separately.

**B-style.** A vendor says: "We ran a commercial static analyser over our codebase and it reported
zero high-severity findings, so the product is free of injection vulnerabilities." Evaluate that
claim. Say what the result establishes, what it does not, and name two pieces of evidence that would
support the claim better.

**B-style.** A team fixes a SQL injection by escaping single quotes in user input. Place that fix
in the prevention / detection / mitigation categories, then say what a fix one level more
fundamental would look like and why it is better.

**B-style.** An organisation achieves a BSIMM assessment showing high maturity in its software
security programme. What does that tell you about any particular release of its product, and what
does it not?

**C-style.** You are handed twenty lines of web server log showing 340 requests from one address in
four minutes, 336 of which returned 404 and four of which returned 200. Name the activity and its
ATT&CK technique. Say which detection model you would use and why. With 200,000 requests per day, a
0.02% base rate, a 98% true positive rate, and a 0.5% false positive rate, compute the probability
that an alert is real, and say what you would change. Then give containment steps for the next
hour.

## If something goes wrong

If Canvas crashes, your internet drops, or the timer runs out because of a technical problem, email
me immediately, before you do anything else. See the
[Exam and Quiz Policy](../index.md#exam-and-quiz-policy).

## After the exam

Nothing is due after the final except [D6, the final reflection](../discussions/d06-final-reflection.md),
which is worth 15 points and asks you to look back at the seven course objectives. It is short.
