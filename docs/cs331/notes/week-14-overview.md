# Module 14 Overview

**April 19-25 · Reading: 14 pages · Estimated total: 7 hours**

Last week a program copied bytes into a buffer without knowing how big it was. This week a program
builds a *command* out of untrusted input without keeping the command and the data apart. It is the
same shape of mistake one layer up, and CyBOK groups them accordingly: §15.1.2 calls this class
**structured output generation vulnerabilities**.

Seeing the class rather than the individual bug is the point. SQL injection, cross-site scripting,
OS command injection, and path traversal are the same error against four different grammars, and
they have the same fix: never let untrusted input be parsed as part of the structure.

The week also covers phishing, which sits oddly in a technical chapter until you notice it is the
same idea again, a person parsing a message and being unable to tell the trustworthy part from the
attacker-supplied part.

## Learning Objectives

By the end of this week, the successful student will be able to:

- **[4.5](../objectives.md#tlo-4--analyzing-common-attacks-and-justifying-countermeasures)**: 
  Perform and then remediate a SQL injection, and explain why parameterization defeats it.
- **[5.5](../objectives.md#tlo-5--applying-authentication-authorization-and-secure-design-principles)**: 
  Recommend a prevention-first countermeasure for a class of vulnerability.

Quiz 5 also assesses **4.4**, **6.1**, and **6.4** from week 13.

## Assignments and Tasks

### Due by Sunday at 11:59 p.m. Mountain Time

- Read [14.01 Readings and Lecture Notes](week-14-web-security-and-injection.md) and run `sqli_demo.py` (2 hrs 55 min)
- [14.02 Lab 9: SQL Injection](../assignments/lab-09-sql-injection.md) (1 hr 30 min, 38 points)
- [14.03 Quiz 5: Software and Web Security](../quizzes/quiz-05-software-and-web.md), covers weeks 13-14
  (15 min, 30 points)

**Everything in Lab 9 runs against a database inside one Python process on your own machine.**
Attacking a web application you do not have written permission to test is a crime and a violation of
the Student Code of Conduct. There is no exercise in this course that requires it.

## Time Estimate

| Activity | Time |
| --- | --- |
| Reading (14 pages plus OWASP) | 2 hrs 10 min |
| The notes page and running `sqli_demo.py` | 45 min |
| Lab 9 | 1 hr 30 min |
| Quiz 5 | 15 min |
| Review and slack | 2 hrs 15 min |
| **Total** | **~7 hrs** |

<!--@include: ../../../parts/cs331-questions-button.md-->
