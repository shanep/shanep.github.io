# Module 13 Overview

**April 12-18 · Reading: 15 pages · Estimated total: 7 hours**

This week has two halves that belong together.

The first is a single C function with a bug in it that has been producing security advisories since
1988. You will read it, look at the assembly a compiler produces from it, and work out precisely why
an over-long input reaches somewhere it should not.

The second half is the question that matters more. Suppose somebody tells you the bug is fixed, 
what would convince you? That is **assurance**, and it is the only terminal objective in this course
without a week of its own. It gets the second half of this one, and it is worth as much on the final
exam as the buffer overflow is.

**You will not run this program and you will not attack anything.** You read source and you read
assembly, in a browser.

## Learning Objectives

By the end of this week, the successful student will be able to:

- **[4.4](../objectives.md#tlo-4--analyzing-common-attacks-and-justifying-countermeasures)**: Trace
  a buffer overflow to the stack layout that makes it exploitable, and evaluate which mitigations
  would stop it.
- **[5.5](../objectives.md#tlo-5--applying-authentication-authorization-and-secure-design-principles)**: 
  Recommend a prevention-first countermeasure for a class of vulnerability.
- **[6.1](../objectives.md#tlo-6--interpreting-assurance-arguments-and-evidence)**: Distinguish
  prevention, detection, and mitigation as classes of assurance evidence.
- **[6.2](../objectives.md#tlo-6--interpreting-assurance-arguments-and-evidence)**: Identify what a
  static or dynamic analysis result does and does not establish.
- **[6.3](../objectives.md#tlo-6--interpreting-assurance-arguments-and-evidence)**: Evaluate
  whether stated security claims are supported by the evidence offered.

## Assignments and Tasks

### Due by Sunday at 11:59 p.m. Mountain Time

- Read [13.01 Readings and Lecture Notes](week-13-software-security-and-assurance.md) and work through the worked example (2 hrs 50 min)
- [13.02 Lab 8: Memory Safety and Assurance Evidence](../assignments/lab-08-memory-safety-and-assurance.md)
  (1 hr 30 min, 38 points)

Lab 8's Step 2 asks you to paste assembly from your own Compiler Explorer session. If your compiler
version lays the frame out differently from the numbers in the notes page's worked example, use what you actually see and say
so: that is the correct answer, not a problem.

## Time Estimate

| Activity | Time |
| --- | --- |
| Reading (15 pages plus Aleph One) | 2 hrs 5 min |
| The notes page and the worked example | 45 min |
| Lab 8 | 1 hr 30 min |
| Review and slack | 2 hrs 30 min |
| **Total** | **~7 hrs** |

<!--@include: ../../../parts/cs331-questions-button.md-->
