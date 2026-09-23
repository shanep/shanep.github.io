# Module 8 Overview

**March 1-7 · Reading: 9 pages · Estimated total: 7 hours**

Symmetric cryptography works beautifully once two parties share a key. Getting them to share one is
the problem it cannot solve. Two people who have never met, on a network run by strangers, cannot
agree on a secret by exchanging messages that everyone can read, not with symmetric tools.

Public-key cryptography solves that, by making one half of a key pair publishable. This week covers
what that buys: encryption to someone you have never met, and signatures that prove a message came
from a particular key and has not changed.

It also sets up the gap that week 10 exists to fill. A signature verifies against a *key*. Nothing
this week tells you the key belongs to the person you think it does.

## Learning Objectives

By the end of this week, the successful student will be able to:

- **[3.3](../objectives.md#tlo-3--comparing-cryptographic-mechanisms-and-their-limits)**: Compare
  symmetric and public-key cryptography by key distribution, performance, and typical use.
- **[3.4](../objectives.md#tlo-3--comparing-cryptographic-mechanisms-and-their-limits)**: Verify a
  digital signature and explain what a verification failure does and does not prove.

Quiz 3 also assesses **3.1** and **3.2** from week 7.

## Assignments and Tasks

### Due by Sunday at 11:59 p.m. Mountain Time

- Read [8.01 Readings and Lecture Notes](week-08-public-key-cryptography.md) and run `sign_demo.py` (2 hrs 30 min)
- [8.02 Lab 5: Hashing and Signatures](../assignments/lab-05-hashing-and-signatures.md) (1 hr 30 min, 38 points)
- [8.03 Quiz 3: Cryptography](../quizzes/quiz-03-cryptography.md): covers weeks 7-8 (15 min, 30 points)

Next week is the midterm and there is no new material, so this is the last week of new content
before the break.

## Time Estimate

| Activity | Time |
| --- | --- |
| Reading (9 pages plus Nakov) | 1 hr 45 min |
| The notes page and running `sign_demo.py` | 45 min |
| Lab 5 | 1 hr 30 min |
| Quiz 3 | 15 min |
| Review and slack | 2 hrs 30 min |
| **Total** | **~7 hrs** |

<!--@include: ../../../parts/cs331-questions-button.md-->
