# Module 7 Overview

**February 22-28 · Reading: 9 pages · Estimated total: 6.5 hours**

Cryptography is the part of this course students most expect to be mathematics, and the part where
the mathematics matters least to you. You are not going to design a cipher. You are going to use
one, and nearly every real-world cryptographic failure is a misuse of a sound primitive rather than
a break of one.

So this week asks three questions:

1. What does a cipher actually give you?
2. What does it not give you, that you might assume it does?
3. What is the mode of operation for, and what happens when you get it wrong?

CyBOK's cryptography chapter opens with two heavily mathematical sections, §10.1 Mathematics and
§10.2 Cryptographic Security Models. **Neither is assigned.** We start at §10.3.

## Learning Objectives

By the end of this week, the successful student will be able to:

- **[3.1](../objectives.md#tlo-3--comparing-cryptographic-mechanisms-and-their-limits)**: Explain
  what a block cipher and a mode of operation each provide, and demonstrate why ECB mode leaks
  structure.
- **[3.2](../objectives.md#tlo-3--comparing-cryptographic-mechanisms-and-their-limits)**: 
  Distinguish confidentiality from integrity and authenticity, and name the primitive that supplies
  each.

## Assignments and Tasks

### Due by Sunday at 11:59 p.m. Mountain Time

- Read [7.01 Readings and Lecture Notes](week-07-symmetric-cryptography.md) and run `crypto_demo.py` (2 hrs 25 min)
- [7.02 Lab 4: Symmetric Encryption in Practice](../assignments/lab-04-symmetric-encryption.md) (1 hr 30 min, 38 points)

Check that `cryptography` still imports before you start: `python3 -c "import cryptography; print('ok')"`.

## Time Estimate

| Activity | Time |
| --- | --- |
| Reading (9 pages plus Nakov) | 1 hr 40 min |
| The notes page and running `crypto_demo.py` | 45 min |
| Lab 4 | 1 hr 30 min |
| Review and slack | 2 hrs 30 min |
| **Total** | **~6.5 hrs** |

<!--@include: ../../../parts/cs331-questions-button.md-->
