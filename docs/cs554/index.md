---
next: false
---

# CS 554 Operating Systems

**CS 554 ADVANCED OPERATING SYSTEMS (3-0-3)(S)** Operating system kernels: process management,
memory management, file systems, security and protection. Advanced concurrent programming
techniques. Operating system design and construction techniques. Modifying operating system code to
observe behavior, add new functionality and run experiments. Support for soft and hard real-time
systems, big data, cybersecurity, virtual machines and other domains. PREREQ: CS 552

## Description

This is a pure Grad Class! A significant number of classes at BSU are cross
listed, meaning you can take them as either an undergrad or grad student.
Because of this, the classes are taught at a level that is accessible to both
undergrads and grads. Pure graduate classes are typically more research focused
and require more work. You will be expected to read and understand research
papers, and you will be expected to be able to write a research paper. This
class will not teach any programming languages or tools unless that is what the
research paper is about. If you are not comfortable programming in C, Rust, etc.
I strongly recommend you take CS452/522 first.

The topic of operating systems is vast and has many open research problems. The
current state-of-the-art in operating systems is not perfect, and there are many
opportunities for improvement. One of the hottest topics in operating systems is
making them more secure, reliable, efficient, and scalable. This includes
concepts such as virtualization, containerization, microservices, cloud
computing, edge computing, IoT, etc. Don't limit yourself to what you know such
as Linux, Windows, or MacOS. There are many other operating systems out there
that are used in embedded systems, real-time systems, mobile devices, etc. that
you may not have heard of. For example look at all the small list from [CS
452](../cs452/course-introduction#beyond-linux-macos-linux).

::: info

This course is not about reinventing the wheel. There are hundreds of tutorials
on the web that show you how to write a simple operating system from scratch.
For example [OsDev](https://wiki.osdev.org/Main_Page) is a great resource.

:::

## Schedule

### Week 1: Syllabus Week

#### Mon 08/19

- Review the syllabus
- Discuss the course structure
- Discuss the course project
- Start brainstorming research ideas (you can work on your own or in groups)
  - You can work on a project that is related to your current research or your job
  - You can do an SLR (Systematic Literature Review) on a topic
  - You can replicate an existing research paper
  - You can extend an existing research paper
  - You can come up with your own idea
  - You can write your own OS to be used for teaching purposes, this is how
    [Minix](https://en.wikipedia.org/wiki/Minix) was created
- If the class is small enough we can work on a single project together!
- Why do we need to read research papers?
  - To learn about the state of the art
  - To learn about the open problems
  - To learn about the existing solutions
  - To learn about the evaluation techniques
  - To learn about the future work
  - [Make millions](https://en.wikipedia.org/wiki/Binary_space_partitioning)

#### Wed 08/21

- Using ACM Digital Library or IEEE Xplore to find research papers
  - [IEEE Proxy](https://guides.boisestate.edu/az/databases?q=ieee)
  - [ACM Proxy](https://guides.boisestate.edu/az/az-database-76256756)
- Suggested keywords to use: operating systems, real-time systems, virtualization, cloud
  computing, edge computing, IoT, etc.
- In class: Each student needs to find 2 research paper in either ACM or IEEE
  that they find interesting and be prepared to discuss them next week.
- Start to think about your project proposal and be prepared to discuss it next
  week. We will need to define our key words, research questions, and approach.

::: tip Week 1 - Deliverable

If you did not find a research paper in class you will need to email me by Friday
with the research papers that you will present next week. If you completed this
in class you are done for the week!

:::

### Week 2: Literature Review

What to research is a hard question. For most of your academic career, you have
been given a problem to solve, you solve it, get a grade, and move on. In this
class, you will need to come up with your own problem to solve. This is a hard!

Last week you found 2 research papers that you found interesting. This week you
will present them to the class. This will help you to see where the state of the
art is and what problems are still open. Don't worry if you didn't find anything
we will work on this together.

- [How to do a literature review](https://www.youtube.com/watch?v=2IUZWZX4OGI)
- Forward and backward snowballing

#### Mon 08/26

- Present Research Paper Presentations
  - TBD
  - TBD
  - TBD
  - TBD
  - TBD

#### Wed 08/28

- Present Research Paper Presentations
  - TBD
  - TBD
  - TBD
  - TBD
  - TBD

::: tip Week 2 - Deliverable
Each student will need to turn in a hard copy of the research paper with their
annotations at the end of their presentation. This is your participation grade.
:::

### Week 3: Literature Review

#### Mon 09/02

- Present Research Paper Presentations
  - TBD
  - TBD
  - TBD
  - TBD
  - TBD

#### Wed 09/04

- Present Research Paper Presentations
  - TBD
  - TBD
  - TBD
  - TBD
  - TBD

::: tip Week 3 - Deliverable
Each student will need to turn in a hard copy of the research paper with their
annotations at the end of their presentation. This is your participation grade.
:::

### Week 4: RQ's

### Mon 09/09

- Defining your Research Project (in class)
  - Key words
  - Research Questions
  - Approach
- Overleaf and LaTeX
  - [Overleaf](https://www.overleaf.com/)
  - [LaTeX](https://www.latex-project.org/)

#### Wed 09/11

- Artifacts and Reproducibility - [ACM Artifact Review and
  Badging](https://www.acm.org/publications/policies/artifact-review-and-badging-current)
- Create your research proposal skelton

::: tip Week 4 - Deliverable

You will need to create your project proposal (preferably in overleaf) and share
it with your instructor by the end of the week. You will need to have 3 RQ's
defined, don't worry if they are not perfect, we will work on them together and
you can change them later.

:::

### Week 5: Proposals

- Project proposal report
  - Your project proposal should be at least 2 pages (IEEE Conference
    Proceedings Format), and it should include:
  - Introduction: Describe the problem, why the problem is important, your
    proposed solution, and how you expect your solution to improve the state of
    the art.
  - Related work: Describe other published research related to the project that
    you are proposing. Other research can be related because it motivates the
    need for your project, it tries to solve the same problem in a different
    way, it uses your proposed technique for other problems, etc.

::: tip Week 5 - Deliverable

You will need to have your project proposal completed by Wednesday. You will
present it to the class and turn in a hard copy at the end of your presentation.

:::

### Week 6 - 8: Work on Research Paper

- We will be working on our research papers for the next 3 weeks. You will need
  to have a draft of your paper completed by the end of week 8. This will be a
  rough draft and will need to be refined over the next 8 weeks.
- We will be discussing the following sections of your paper:
  - Introduction
  - Related Work
  - Approach
  - Implementation
  - Evaluation
  - Conclusion

::: tip Week 6-8 - Deliverable

Each student will need to turn in a hard copy of the research paper with their
annotations at the end of each week presentation. This is your participation grade.

:::

### Week 9

- Mid-semester project presentation
  - Your project progress presentation should include:
  - Problem description (updated from your project proposal)
  - Research Questions
  - Solution description (updated and extended from your project proposal)
  - Progress made so far (since your project proposal)
  - Planning for the remaining weeks
  - Potential roadblocks that you may encounter in the remaining weeks and how
    you expect to overcome them

::: tip Week 9 - Deliverable

You will present your proposal to the class and turn in a hard copy at the end
of your presentation.

:::

### Week 10 - 13: Methodology and Implementations

- Discuss methodology section of your paper
- Discuss the implementation of your project (if any code is required)
- Present your implementation progress
- Finer grained scheduling will be posted once we have a better idea of what
  everyone is working on!

::: tip Week 10 - 13 - Deliverable

There are no deliverables for these weeks, but you should be making progress on
your project and be prepared to discuss it in class.

:::

### Week 14

- Thanksgiving Break!

### Week 15: Results Section

- Discuss the results of your project and how they answer your research questions.

::: tip Week 15 - Deliverable

You will be required to turn in a hard copy draft of your paper in class.

:::

### Week 16

- Your final project report should be a minimum of 10 pages (including
  references) and a maximum of 10 pages (plus references). The report should
  include:
  - Introduction: Describe the problem, why the problem is important, your
    proposed solution, and how you expect your solution to improve the state of
    the art.
  - Related work: Describe other published research related to the project that
    you are proposing. Other research can be related because: it motivates the
    need for your project, it tries to solve the same problem in a different
    way, it uses your proposed technique for other problems, etc.
  - Approach: conceptual description of your solution
  - Implementation: technical description of the solution that you implemented
  - Evaluation: description of the experiments that you performed and
    interpretation of your results.
  - Conclusion: Did you solve the problem? To what extent? For which cases?
  - References: Citations of all the research papers relevant to your project

::: tip Week 16 - Deliverable

Turn in a final hard copy of your paper in class and present your project to the
class.

:::

### Week 17

- Publish your paper?

## Paper Presentations

Each presentation will last 5 minutes and should include the sections listed
below. We will not create a slide deck for this presentation. Instead, you will
need to have a **hard** copy of the paper with handwritten annotations that you will
use to guide your presentation. You will turn in your annotated paper at the end
of your presentation (**this is your participation grade**).

After the presentation, you will lead a 5-minute discussion about the paper.
You should prepare questions in advance for the discussion, e.g., things in
which you disagree with the authors or on which you would like to hear others’
opinions.

Sections to include in your presentation:

Explain each section in detail so we can discuss it.

- Problem Statement. What problem is the paper addressing?
- Problem Importance. Why is the problem important?
- Related Work. What are the existing solutions to this problem?
- Approach. What is the proposed solution in this paper?
- Approach Insight. Why is the proposed solution different or more promising than the existing solutions?
- Evaluation. How did they evaluate that the proposed solution improves the state of the art?
- Conclusion: To what extent does the proposed solution improve the state of the art? What did we learn in this paper?
- Discussion points. What are the points that you would like to discuss?

## Assessments

Final Grade formula: **Grade = [Earned points] / [Total Points Offered]**.

- 20% In class participation and discussion
- 80% Research Paper / Artifact

<!--@include: ../../parts/syllabus-boiler.md-->
