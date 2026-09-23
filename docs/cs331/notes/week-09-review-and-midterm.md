# Week 9: Review and Midterm

**March 8-14 · No new reading · Estimated total: 5 hours**

## Overview

No new material this week. One graded item: the midterm.

The week is deliberately light and deliberately placed here, immediately before spring break. Weeks
1 through 8 introduced most of the vocabulary and all of the modelling techniques the second half
of the course builds on, and this is the checkpoint.

## Objectives this week

The midterm assesses everything from weeks 1-8:

| | Objectives |
| --- | --- |
| **[TLO 1](../objectives.md#tlo-1--security-goals-terminology-principles-ethics-and-regulation)** | 1.1, 1.2, 1.3, 1.4, 1.5 |
| **[TLO 2](../objectives.md#tlo-2--modeling-subjects-objects-permissions-trust-boundaries-and-threats)** | 2.1, 2.2, 2.3, 2.4, 2.5 |
| **[TLO 3](../objectives.md#tlo-3--comparing-cryptographic-mechanisms-and-their-limits)** | 3.1, 3.2, 3.3, 3.4 |
| **[TLO 5](../objectives.md#tlo-5--applying-authentication-authorization-and-secure-design-principles)** | 5.1, 5.2, 5.3, 5.4 |

## Read

Nothing new. **Read the [midterm exam guide](../assignments/midterm-exam-guide.md) first**: it
lists the exact format, the objective-by-objective coverage, and six practice questions in the
style of each part.

If you want to re-read anything from CyBOK, the highest-value sections are §1.4 (the eight
principles) and §14.3.1 (access control core concepts). Everything else is better revised through
your own graded work.

## How to spend the week

The single most valuable thing you can do is **re-read your own labs and my comments on them.**
Labs 1 through 5 and Discussion 3 map directly onto Parts B and C of the exam. You already produced
the kind of work the exam asks for; the exam asks for it again, faster, on a system you have not
seen.

In rough order of value:

1. **Redo a threat model from scratch, on something else**: your bank's app, the campus print
   service, a smart speaker. Twenty minutes, timed. Part C is this under time pressure, and the
   only way to get fast at it is to have done it more than once.
2. **Redo an access control matrix** for three subjects and three objects, then write the ACL and
   capability list versions. Ten minutes.
3. **Recite the eight principles** until you can list them without looking, with one example of a
   violation of each.
4. **Re-run [`crypto_demo.py`](../data/crypto_demo.py) and [`sign_demo.py`](../data/sign_demo.py)**
   and explain each section's output out loud to somebody, or to yourself. If you cannot explain the
   nonce-reuse algebra without looking, that is the thing to work on.
5. **Re-take Quizzes 1 and 2.** Canvas will let you review them with the rationales.
6. **Skim, do not re-read, the CyBOK sections.** Know where things are.

### What not to do

Do not re-read all 80 pages of assigned CyBOK. The exam is open book, and the questions that could
be answered by looking something up are worth 40 of the 150 points. The other 110 are things you
either can do or cannot, and looking them up during the exam costs you time you need for Part C.

## The exam

| | |
| --- | --- |
| **Where** | Canvas. No testing centre appointment. |
| **When** | Open all week. 90 minutes once you start. |
| **Attempts** | One. |
| **Materials** | Open book, open notes, open CyBOK, AI tools permitted per the [AI policy](../index.md#ai-policy). |
| **Structure** | Part A: 20 auto-graded items (40 pts) · Part B: 5 short answers (50 pts) · Part C: one applied scenario (60 pts) |

**Budget your time so you reach Part C.** It is worth 60 of the 150 points and it takes the longest.
Students who spend forty minutes perfecting Part B lose more than they gain.

## Do this week

| | Task | Points | Due |
| --- | --- | ---: | --- |
| 1 | [Midterm Exam](../assignments/midterm-exam-guide.md) | 150 | Sunday |

Nothing else is due. No lab, no quiz, no discussion.

## After the exam

**Spring break is March 15-19. Nothing is due and nothing opens.** Week 10 materials become
available on Monday, March 22.

The second half of the course changes character. The first half was mostly about how things are
supposed to work; the second half is mostly about how they fail (network attacks, malware, memory
safety, injection) and ends with what you do once something has already gone wrong.

## Time estimate

| Activity | Time |
| --- | --- |
| Reading the exam guide | 20 min |
| Re-reading your graded labs and my comments | 1 hr |
| Practice: threat model, access control matrix, principles | 1 hr |
| Re-running the crypto demos and re-taking quizzes | 45 min |
| The exam itself | 1 hr 30 min |
| **Total** | **~4.5-5 hrs** |
