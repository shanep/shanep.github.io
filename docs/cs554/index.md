---
next: false
---

# CS 554 Advanced Operating Systems

**CS 554 ADVANCED OPERATING SYSTEMS (3-0-3)(S)** Operating system kernels:
process management, memory management, file systems, security and protection.
Advanced concurrent programming techniques. Operating system design and
construction techniques. Modifying operating system code to observe behavior,
add new functionality and run experiments. Support for soft and hard real-time
systems, big data, cybersecurity, virtual machines and other domains. PREREQ: CS
552

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
- Introductions
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

- Discuss the research/project ideas
- Discuss class meeting locations off campus
- Discuss Zoom meetings for remote students (if needed)
- Come to class with a small write up detailing your idea/direction, you will be given 10 minutes of class time to present.
  - If you can't think of anything that's OK!! Come to class with nothing and I will help you figure out an awesome project to work on.

::: tip Week 1 - Deliverable

Your initial research/project idea is due by the start of class on Monday 08/26.
We will discuss these ideas in class and you will have the opportunity to revise
your idea based on feedback.

:::

### Week 2: Project Intros

#### Monday 8/26

- Present deliverables

#### Wed

- Present deliverables (cont)
- Review Boise State proxy's for accessing research papers
- Review ACM DL and IEEE Xplore for accessing research papers
- Rust for Linux

### Week 3: Projects

#### Mon 09/02

- Labor Day - No Class
- Work on your project

#### Wed 09/04

- Present deliverables
- Rust for Linux

### Week 4

#### Mon 09/09

- Class will be over Zoom. We will discuss the following:
  - ACM DL Updates
  - Project updates
  - Paper presentations

#### Wed 9/11

- Updates on project

### Week 5

#### Mon 09/16

- Each student will present a research paper that they found on their topic.
  This will be a 5-minute presentation followed by a 5-minute discussion. See
  the Paper Presentations section below for more details.

#### Wed 9/18

- Updates on projects

### Week 6

#### Mon 09/23

- Each student will present a research paper that they found on their topic.
  This will be a 5-minute presentation followed by a 5-minute discussion. See
  the Paper Presentations section below for more details.

#### Wed 9/25

- Updates on projects

### Week 7

#### Mon 09/30

- Each student will present a research paper that they found on their topic.
  This will be a 5-minute presentation followed by a 5-minute discussion. See
  the Paper Presentations section below for more details.

#### Wed 10/02

- Updates on projects

### Week 8

#### Mon 10/07

- Mid Term Presentations - 20 minutes each

You will present your progress on your project formally. You will need to have a
slide deck that includes the following sections:

- Project Title
  - Description of the project
- Research or Project Goal
  - What problem are you trying to solve?
  - Why is this problem important? What is the impact of solving this problem?
  - What is the current state of the art? You should have a good idea of what
    the current state of the art is in your area from the research papers you
    have read and shared with the class.
- Approach
  - What is your approach to solving the problem?
- What is the current state of your project?
  - What are the next steps?
- Conclusion

#### Wed 10/09

- Midterm Presentations continued.

### Week 9

#### Wed 10/14

- Midterm Presentations continued.

#### Wed 10/16

- I have created an overleaf project for each of you and shared it with your student account
- All students will need to submit a 5 page write up with 1 page for references.
- Review the latex template in class
- Sections
  - Abstract
  - Introduction
  - Related work - Use the papers that you have been presenting
  - Methodology/Architecture
  - Evaluation/Results Section
  - Discussion
  - Conclusion

### Week 10

- No class this week. Use class time to prepare for your individual meetings starting next
  week. Please prepare the following to review.
- Identify at least one conference or journal that you may be able to publish in.
  - Look into previous work
  - What template do you need
  - What tracks are there? (short paper, research, poster, etc.)
- A Related Work section that incorporates the papers you have presented
- A Methodology or Architecture diagram
- At least one research question

### Week 11

#### Mon 10/28

- Each student will have 10-20 minutes review their work from the previous week.
- You will need to show the following:
  - Related Work section
  - Methodology or Architecture diagram
  - At least one research question
  - What conference or journal you are targeting

#### Wed 10/30

- Continue presenting work.
- Set goals for following week and update progress notes

### Week 12

#### Mon 11/04

- Present Research Paper
  - Sean - [A low-latency optimization of a rust-based secure operating system for embedded devices](https://drive.google.com/file/d/1-2QfBrzwhgwK5gffJFqaoMaSzQjPiMqA/view?usp=drive_link)
  - Matt - [CHERIoT: Complete Memory Safety for Embedded Devices](https://drive.google.com/file/d/1XSKbrxhlt4RJPiigFzEPG905HttSeDZc/view?usp=drive_link)

#### Wed 11/06

- Present Research Paper
  - Claude [Emulation of Intel's 8086 Microprocessor using Rust and Web Assembly](https://drive.google.com/file/d/1IwPY7_2h7jnyzJefkShPZIZsv79X7QOa/view?usp=drive_link)
  - Alex [RedLeaf: Towards an operating system for safe and verified firmware](https://drive.google.com/file/d/1eY_TUqN8OO_sAQulgIjP_yR-sfGYtP2Q/view?usp=drive_link)

### Week 13

#### Mon 11/11

- Present Research Paper
  - Sharif [An Empirical Study of Rust-for-Linux: The Success, Dissatisfaction, and Compromise](https://drive.google.com/file/d/1tq2idSyoTmX1VLgGtZE-0ANGDAnn_BAG/view?usp=drive_link)
  - Luke [rOOM: a Rust-Based linux out of memory kernel component](https://drive.google.com/file/d/1UFC9t7-N59c0161EK4E9UoUj1oHUtcOu/view?usp=drive_link)

#### Wed 11/13

- Set presentation schedule for final presentations
- Final off campus meeting (location TBD)

### Week 14

- Thanksgiving Break

### Week 15

- Final Presentations - 20 minutes each

### Week 16

- Final Presentations - 20 minutes each
- Final write up due on canvas

## Paper Presentations

Each presentation will last 20 minutes and should include the sections listed
below. We will not create a slide deck for this presentation. Instead, you will
need to have a **hard** copy of the paper with handwritten annotations that you will
use to guide your presentation. You will turn in your annotated paper at the end
of your presentation (**this is your participation grade**).

After the presentation, you will lead a 5-10 minute discussion about the paper.
You should prepare questions in advance for the discussion, e.g., things in
which you disagree with the authors or on which you would like to hear others'
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
- 80% Research Paper or Artifact
  - Midterm Presentation
  - Final Presentation and Final Paper or Artifact

<!--@include: ../../parts/syllabus-boiler.md-->
