# 9.01 Readings and Lecture Notes

**March 8-14 · No new reading**

What to do this week, and when it is due, is on the [Module 9 Overview](week-09-overview.md).

## Readings

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

## After the exam

**Spring break is March 15-19. Nothing is due and nothing opens.** Week 10 materials become
available on Monday, March 22.

The second half of the course changes character. The first half was mostly about how things are
supposed to work; the second half is mostly about how they fail (network attacks, malware, memory
safety, injection) and ends with what you do once something has already gone wrong.

<!--@include: ../../../parts/cs331-questions-button.md-->
