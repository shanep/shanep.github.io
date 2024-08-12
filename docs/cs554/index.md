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
For example [OsDev](https://wiki.osdev.org/Main_Page) is a great resource. This
course is about reading and understanding the current state of the art in the
field of operating systems and then extending it in some way. This could be
writing a new scheduler, a new file system, a new memory management system, etc.

:::

## Schedule

### Week 1: Syllabus Week

#### Mon 08/19

- Review the syllabus
- Discuss the course structure
- Discuss the final deliverable (research paper or artifact)
- Start brainstorming research/project ideas (you can work on your own or in groups)
  - You can work on a project that is related to your current research or your job
  - You can do an SLR (Systematic Literature Review) on a topic
  - You can replicate an existing research paper
  - You can extend an existing research paper
  - You can come up with your own idea
  - You can write your own OS to be used for teaching purposes, this is how
    [Minix](https://en.wikipedia.org/wiki/Minix) was created
- If the class is small enough we can work on a single project together!

#### Wed 08/21

- Why do we need to read research papers?
  - To learn about the state of the art
  - To learn about the open problems
  - To learn about the existing solutions
  - To learn about the evaluation techniques
  - To learn about the future work
  - [Make millions](https://en.wikipedia.org/wiki/Binary_space_partitioning)
- Using ACM Digital Library or IEEE Xplore to find research papers
  - [IEEE Proxy](https://guides.boisestate.edu/az/databases?q=ieee)
  - [ACM Proxy](https://guides.boisestate.edu/az/az-database-76256756)
- Suggested keywords to use: operating systems, real-time systems, virtualization, cloud
  computing, edge computing, IoT, etc.
- Start to think about your project proposal and be prepared to discuss it next
  week. We will need to define our key words, research questions, and approach.

::: tip Week 1 - Deliverable

You will need to write out a 1 page project proposal detailing your research or
project idea. You will need to turn in a hard copy at the beginning of class
next week. You will be able to change or evolve your idea as the semester progresses,
this is just a starting point.

:::

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
