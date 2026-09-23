# Week 2: Security Principles and the Human Factor

**January 18-24 · MLK Day is Monday, January 18 · Reading: 14 pages · Estimated total: 7 hours**

## Overview

In 1975 Jerome Saltzer and Michael Schroeder wrote down eight design principles for protecting
information in computer systems. Fifty-two years later they are still the closest thing the field
has to rules of thumb, and every serious breach you will read about this semester violates at least
one of them.

This week you learn the eight, and then you learn why knowing them is not enough. The second half of
the reading is about human factors, and it makes an uncomfortable point: most security controls
that fail in practice fail because people route around them. When that happens, the usual response
is to blame the people. CyBOK's position (and this course's) is that a control people cannot
comply with is a defective control.

## Objectives this week

- **[1.3](../objectives.md#tlo-1--security-goals-terminology-principles-ethics-and-regulation)**: 
  Apply the Saltzer and Schroeder design principles to critique a familiar system.
- **[1.4](../objectives.md#tlo-1--security-goals-terminology-principles-ethics-and-regulation)**: 
  Explain how human error and usability failures contribute to security incidents.
- **[5.4](../objectives.md#tlo-5--applying-authentication-authorization-and-secure-design-principles)**: 
  Apply fail-safe defaults and complete mediation when critiquing a system design.

## Read

| Source | Sections | Printed pages | Length | Time |
| --- | --- | --- | --- | --- |
| [CyBOK v1.1.0](../docs/CyBOK_v1.1.0.pdf) | §1.4 Principles: especially §1.4.1 Saltzer and Schroeder | 9-13 | 5 pp | 35 min |
| [CyBOK v1.1.0](../docs/CyBOK_v1.1.0.pdf) | §1.5 Crosscutting Themes | 13-15 | 2 pp | 10 min |
| [CyBOK v1.1.0](../docs/CyBOK_v1.1.0.pdf) | §4.3 Human Error | 158-161 | 3 pp | 20 min |
| [CyBOK v1.1.0](../docs/CyBOK_v1.1.0.pdf) | §4.4 Cybersecurity awareness and education | 161-165 | 4 pp | 25 min |
| Saltzer & Schroeder (1975) | Section I: the numbered principles only |: | ~3 pp | 20 min |

Saltzer & Schroeder: <https://web.mit.edu/Saltzer/www/publications/protection/>. Read the list and
the paragraph explaining each principle; skip the rest of the paper. It is worth reading the
original once: it is unusually clear, and it was written before most of the technology it
describes existed.

## The eight principles

| Principle | The short version | The question it asks |
| --- | --- | --- |
| **Economy of mechanism** | Keep the protection mechanism small and simple. | Could somebody read all of it and be sure it is right? |
| **Fail-safe defaults** | Deny by default; grant by explicit permission. | What happens before anybody configures anything? |
| **Complete mediation** | Check every access to every object, every time. | Is the decision cached? For how long? |
| **Open design** | Do not depend on the design being secret. | If the source code leaked tomorrow, what would break? |
| **Separation of privilege** | Require more than one condition to grant access. | How many things must go wrong at once? |
| **Least privilege** | Give the minimum access needed to do the job. | What could this account do that its job never requires? |
| **Least common mechanism** | Minimise what is shared between users. | What do two users share that could become a channel? |
| **Psychological acceptability** | If it is painful, people will route around it. | What is the workaround, and how obvious is it? |

The two that this course grades hardest are **fail-safe defaults** and **complete mediation**,
because they are the two people most often think they have satisfied when they have not.

## Worked example

Take a system almost everyone reading this uses: a **campus building door with a card reader**.

**Fail-safe defaults.** What happens when a new employee's card is issued? If the card works on
every exterior door by default and access is removed later by exception, that is a fail-safe
defaults violation, regardless of how good the access request system is. The default is grant, and
the principle says the default must be deny.

Now the harder version. What happens when the network link to the access server fails? Many
installations unlock the doors, because fire codes require people to be able to get out. That is a
real conflict between safety and security, and the resolution (unlock) is defensible. But it is
still a fail-safe defaults decision, and it should be made deliberately, documented, and defended,
not stumbled into. **"Fail-safe" does not automatically mean "locked"; it means the failure mode is
chosen rather than accidental.**

**Complete mediation.** You tap your card and the door opens. Do you tap again when you go through
the next interior door? If the system checks once at the building entrance and then treats you as
trusted everywhere inside, that is caching an authorisation decision, the same failure as a session
token that stays valid for ninety days after your account is disabled.

Note what complete mediation does *not* say: it does not say check often, it says check *every
time*. A system that rechecks hourly is better than one that never rechecks, and it still is not
complete mediation.

**Psychological acceptability, and where the two meet.** Suppose the building implements complete
mediation properly: every interior door requires a tap. Staff carrying equipment now cannot get
through doors with their hands full. Within a week somebody props a door open with a fire
extinguisher.

The security team's instinct is to send an email about propped doors. Look at it through §4.3
instead: a person with a legitimate task was given a control that made the task impossible, and
they solved their problem. The propped door is not a discipline failure, it is a **design output**:
it is what this design produces when it meets a person carrying a box. The fix is a door that
opens on approach for badged staff, or a hands-free reader, or accepting that this door does not get
mediated.

That is the pattern to look for all semester: **a control, a legitimate task it obstructs, and the
predictable workaround.** When you find it, the workaround is evidence about the control.

## Do this week

| | Task | Points | Due |
| --- | --- | ---: | --- |
| 1 | [Lab 1: Security Principles Audit](../assignments/lab-01-security-principles-audit.md) | 38 | Sunday |

No quiz and no discussion this week. Lab 1 is the only graded item, and it is a writing assignment,
give it the full ninety minutes.

## Key terms

| Term | Short form |
| --- | --- |
| **Fail-safe defaults** | The default decision is denial; access is granted by explicit permission. |
| **Complete mediation** | Every access to every object is checked every time, with no cached decisions. |
| **Least privilege** | Minimum access required for the job. One condition, narrowly scoped. |
| **Separation of privilege** | More than one condition must be satisfied. Two or more conditions. |
| **Open design** | Security rests on the key, not on the secrecy of the design. |
| **Psychological acceptability** | A control people cannot comply with will be worked around. |
| **Human error** | Ordinary people doing reasonable things under constraints, not misconduct. |

**Least privilege and separation of privilege get confused constantly.** Least privilege is about
*how much* access; separation of privilege is about *how many conditions*. Read-only backup access
is least privilege. Two administrators to approve a deletion is separation of privilege.

## Time estimate

| Activity | Time |
| --- | --- |
| Reading (14 pages plus the Saltzer & Schroeder excerpt) | 1 hr 50 min |
| This module page and the worked example | 40 min |
| Lab 1 | 1 hr 25 min |
| Review and slack | 2 hrs 30 min |
| **Total** | **~6.5 hrs** |

MLK Day falls on Monday, so the working week is short. Lab 1 is not due until Sunday.

## Looking ahead

Week 3 moves from what you *should* do to what you are *allowed* to do: the legal, regulatory, and
ethical setting for security work. It ends with the question of what you do when you find a
vulnerability in somebody else's system. Quiz 1 covers weeks 1 through 3.
