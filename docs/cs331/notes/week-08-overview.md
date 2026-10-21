# Module 8 Overview

**March 1-7 · Reading: 9 pages · Due: Lab 5 · Estimated total: 6.5 hours**

Symmetric cryptography would work beautifully if every pair of people already shared a secret key.
They usually do not, and symmetric cryptography cannot help them get one. Two people who have never
met, talking over a network run by strangers, have no safe way to agree on a key with symmetric
tools alone, because anything they send to set one up can be read along the way.

Public-key cryptography solves that, by making one half of a key pair publishable. This week covers
what that buys: encryption to someone you have never met, and signatures that prove a message came
from a particular key and has not changed.

It also sets up the gap that week 10 exists to fill. A signature verifies against a *key*. Nothing
this week tells you the key belongs to the person you think it does.

## Learning Objectives

By the end of this week, the successful student will be able to:

- **[3.3](../objectives.md#tlo-3-comparing-cryptographic-mechanisms-and-their-limits)**: Compare
  symmetric and public-key cryptography by key distribution, performance, and typical use.
- **[3.4](../objectives.md#tlo-3-comparing-cryptographic-mechanisms-and-their-limits)**: Verify a
  digital signature.
- **[3.5](../objectives.md#tlo-3-comparing-cryptographic-mechanisms-and-their-limits)**: Explain
  what a failed signature verification does and does not prove.

## Assignments and Tasks

### Due by Sunday at 11:59 p.m. Mountain Time

- Read [8.01 Readings and Lecture Notes](week-08-public-key-cryptography.md) and work through the worked example (2 hrs 30 min)
- Complete [8.02 Lab 5: Hashing and Signatures](../assignments/lab-05-hashing-and-signatures.md) (1 hr 30 min, 38 points)

Next week is review and catch-up with no new material, so this is the last week of new content
before the break.

## Time Estimate

| Activity | Time |
| --- | --- |
| Reading (9 pages plus Nakov) | 1 hr 45 min |
| The notes page and running `sign_demo.py` | 45 min |
| Lab 5 | 1 hr 30 min |
| Review and slack | 2 hrs 30 min |
| **Total** | **~6.5 hrs** |

<!--@include: ../../../parts/cs331-questions-button.md-->
