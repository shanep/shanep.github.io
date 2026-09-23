# Module 10 Overview

**March 22-28 · Reading: 12 pages · Estimated total: 6.5 hours**

Welcome back. Week 8 ended with an unanswered question: a signature verifies against a public key,
but what tells you whose key it is?

This week is the answer. A **certificate** is a signed statement binding a public key to a name.
Somebody you already trust signs it, and their key is vouched for by somebody else, up to a root
that your browser or operating system simply believes because it shipped with a list.

That last step is worth staring at. Four of the five checks a browser runs on a certificate are
arithmetic. The fifth is a decision somebody made on your behalf, before you ever opened the
browser.

## Learning Objectives

By the end of this week, the successful student will be able to:

- **[3.5](../objectives.md#tlo-3--comparing-cryptographic-mechanisms-and-their-limits)**: Interpret
  an X.509 certificate chain and identify the trust assumptions and failure modes of public key
  infrastructure.

## Assignments and Tasks

### Due by Sunday at 11:59 p.m. Mountain Time

- Read [10.01 Readings and Lecture Notes](week-10-keys-certificates-and-pki.md) and run `cert_inspect.py` (2 hrs 15 min)
- [10.02 Lab 6: Certificates and TLS](../assignments/lab-06-certificates-and-tls.md) (1 hr 30 min, 38 points)

Lab 6 asks you to inspect a real certificate chain in your browser as well as run the script. Do
the browser part first; it takes ten minutes and makes the script output make sense.

## Time Estimate

| Activity | Time |
| --- | --- |
| Reading (12 pages) | 1 hr 35 min |
| The notes page and running `cert_inspect.py` | 40 min |
| Lab 6 | 1 hr 30 min |
| Review and slack | 2 hrs 30 min |
| **Total** | **~6.5 hrs** |

<!--@include: ../../../parts/cs331-questions-button.md-->
