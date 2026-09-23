# Module 11 Overview

**March 29 - April 4 · Reading: 15 pages · Estimated total: 7 hours**

The internet's core protocols were designed by people who were solving a different problem. They
were building something that would keep working when links failed and routers died, among
institutions that broadly trusted each other. Almost none of it authenticates anything.

That inheritance explains most of this week. ARP believes any reply. DNS believed any answer until
DNSSEC. BGP largely believes any route announcement. TCP's sequence numbers give you robustness
against faults, not against an adversary. Every one of those is a design that was correct for its
requirements and became a vulnerability when the requirements changed.

The second half of the week is what defenders do about it: firewalling, segmentation, monitoring,
and the observation that in a world where nearly all traffic is encrypted, a network sensor sees
metadata rather than content, and metadata turns out to be enough for a great deal.

## Learning Objectives

By the end of this week, the successful student will be able to:

- **[4.1](../objectives.md#tlo-4--analyzing-common-attacks-and-justifying-countermeasures)**: 
  Explain how common network attacks work at the protocol layer where they operate.
- **[4.2](../objectives.md#tlo-4--analyzing-common-attacks-and-justifying-countermeasures)**: 
  Recommend network defenses (firewalling, segmentation, and monitoring) for a described network.

## Assignments and Tasks

### Due by Thursday at 11:59 p.m. Mountain Time

- Read [11.01 Readings and Lecture Notes](week-11-network-security.md) and work through the worked example (2 hrs 40 min)
- [11.02 D4: Network Security in the News](../discussions/d04-network-security-in-the-news.md):
  initial post

### Due by Sunday at 11:59 p.m. Mountain Time

- [11.03 D4: Network Security in the News - Replies](../reminders/d04-replies.md):
  two replies (1 hr with the initial post, 30 points)
- [11.04 Quiz 4: Network Security](../quizzes/quiz-04-network-security.md) (15 min, 30 points)

D4 asks you to find an incident nobody else has claimed. **Check the board and post early.**

## Time Estimate

| Activity | Time |
| --- | --- |
| Reading (15 pages) | 2 hrs |
| The notes page and the worked example | 40 min |
| D4 post and two replies | 1 hr |
| Quiz 4 | 15 min |
| Review and slack | 2 hrs 30 min |
| **Total** | **~6.5-7 hrs** |

<!--@include: ../../../parts/cs331-questions-button.md-->
