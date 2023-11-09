---
next: false
---

# CS 452/552 Operating Systems

**CS 452/552 OPERATING SYSTEMS (3-0-3)(F,S)** Process management,
concurrency, inter-process communication, synchronization, scheduling,
memory management, file systems and security. Case studies of multiple
operating systems. PREREQ: CS 321 and ECE 330.

## Topics and Schedule

| Week | Day | Topic                                                 | Textbook Reading                                                                                    | What Due?     |
| ---- | --- | ----------------------------------------------------- | --------------------------------------------------------------------------------------------------- | ------------- |
| 1    | Tu  | [Course Introduction](1-course-introduction.md)       |                                                                                                     |               |
|      | Th  | [C Review](2-c-review.md)                             | xref:../articles/modern-debugging-acm.pdf[Modern Debugging]                                         |               |
| 2    | Tu  | Project 0 Introduction                                |                                                                                                     |               |
|      | Th  | [Testing](3-testing.md)                               | xref:../articles/coverity-acm.pdf[Coverity]                                                         |               |
| 3    | Tu  | [Libraries](4-libraries.md)                           |                                                                                                     |               |
|      | Th  | xref:projects/p1.adoc[Project 1 Introduction]         |                                                                                                     | Project 0 Due |
| 4    | Tu  | xref:intro.adoc[Operating Systems Introduction]       | http://pages.cs.wisc.edu/~remzi/OSTEP/intro.pdf[OSTEP ch2 - Introduction]                           |               |
|      | Th  | xref:cpu-intro.adoc[The Process]                      | http://pages.cs.wisc.edu/~remzi/OSTEP/cpu-intro.pdf[OSTEP ch4 - Abstraction the process]            |               |
| 5    | Tu  | xref:cpu-api.adoc[Process API]                        | http://pages.cs.wisc.edu/~remzi/OSTEP/cpu-api.pdf[OSTEP ch5 - Process API]                          |               |
|      | Th  | xref:projects/p2.adoc[Project 2 Introduction]         |                                                                                                     | Project 1 Due |
| 6    | Tu  | xref:cpu-mechanisms.adoc[Limited Direct Execution]    | http://pages.cs.wisc.edu/~remzi/OSTEP/cpu-mechanisms.pdf[OSTEP ch6 - Limited Direct Execution]      |               |
|      | Th  | xref:cpu-sched.adoc[Scheduling]                       | http://pages.cs.wisc.edu/~remzi/OSTEP/cpu-sched.pdf[ OSTEP ch7 - Scheduling Introduction]           |               |
| 7    | Tu  | xref:vm-intro.adoc[Address Spaces]                    | https://pages.cs.wisc.edu/~remzi/OSTEP/vm-intro.pdf[OSTEP ch13 - Address Spaces]                    |               |
|      | Th  | xref:projects/p3.adoc[Project 3 Introduction]         |                                                                                                     | Project 2 Due |
| 8    | Tu  | xref:vm-freespace.adoc[Free Space Management]         | https://pages.cs.wisc.edu/~remzi/OSTEP/vm-freespace.pdf[OSTEP ch17 - Free Space management]         |               |
|      | Th  | xref:vm-paging.adoc[Paging]                           | https://pages.cs.wisc.edu/~remzi/OSTEP/vm-paging.pdf[OSTEP ch18 - Paging: Introduction]             |               |
| 9    | Tu  | xref:threads-intro.adoc[Concurrency]                  | https://pages.cs.wisc.edu/~remzi/OSTEP/threads-intro.pdf[OSTEP ch26 - Concurrency and Threads]      |               |
|      | Th  | xref:projects/p4.adoc[Project 4 Introduction]         |                                                                                                     | Project 3 Due |
| 10   | Tu  | xref:threads-locks.adoc[Locks]                        | https://pages.cs.wisc.edu/~remzi/OSTEP/threads-locks.pdf[OSTEP ch28 - Locks]                        |               |
|      | Th  | xref:threads-locks-usage.adoc[Locked Data Structures] | https://pages.cs.wisc.edu/~remzi/OSTEP/threads-locks-usage.pdf[OSTEP ch29 - Locked Data Structures] |               |
| 11   | Tu  | xref:threads-cv.adoc[Condition Variables]             | https://pages.cs.wisc.edu/~remzi/OSTEP/threads-cv.pdf[OSTEP ch30 - Condition Variables]             |               |
|      | Th  | xref:projects/p5.adoc[Project 5 Introduction]         |                                                                                                     | Project 4 Due |
| 12   | Tu  | xref:threads-sema.adoc[Semaphores]                    | https://pages.cs.wisc.edu/~remzi/OSTEP/threads-sema.pdf[OSTEP ch31 - Semaphores]                    |               |
|      | Th  | xref:threads-bugs.adoc[ Concurrency Bugs]             | https://pages.cs.wisc.edu/~remzi/OSTEP/threads-bugs.pdf[OSTEP ch32 - Concurrency Bugs]              |               |
| 13   | Tu  | Event Based Concurrency                               | https://pages.cs.wisc.edu/~remzi/OSTEP/threads-events.pdf[OSTEP ch33 - Event Based Concurrency]     |               |
|      | Th  | xref:projects/p6.adoc[Project 6 Introduction]         |                                                                                                     | Project 5 Due |
| 14   | Tu  | Thanksgiving Break                                    |                                                                                                     |               |
|      | Th  | Thanksgiving Break                                    |                                                                                                     |               |
| 15   | Tu  | xref:file-devices.adoc[I/O Devices]                   | https://pages.cs.wisc.edu/~remzi/OSTEP/file-devices.pdf[OSTEP ch36 - I/O Devices]                   |               |
|      | Th  | xref:file-intro.adoc[Files and Directories]           | https://pages.cs.wisc.edu/~remzi/OSTEP/file-intro.pdf[OSTEP ch39 - Files and Directories]           | Project 6 Due |
| 16   | Tu  | xref:security-intro.adoc[Security]                    | https://pages.cs.wisc.edu/~remzi/OSTEP/security-intro.pdf[OSTEP ch53 - Security]                    |               |
|      | Th  | Bonus day                                             |                                                                                                     |               |
| 17   |     | Final Exam                                            |                                                                                                     |               |

## Textbook

- Textbook: [Operating Systems: Three Easy Pieces](https://pages.cs.wisc.edu/~remzi/OSTEP/)
  - Remzi H. Arpaci-Dusseau and Andrea C. Arpaci-Dusseau

## Assessments

Your final grade will be calculated with the following weights in
canvas.

- Projects - 70%
- Final Exam - 30%
  - The final exam will cover the textbook reading assignments assigned throughout the semester.
  - The final exam must be taken in the testing center.

### Projects

There are several individual projects this semester. All Projects will
be graded with the [project grading rubric](grading-rubric.md).

- [Project 0](https://github.com/shanep/cs452-p0-starter) - This is a project to introduce you to the default template
- [Project 1](https://github.com/shanep/cs452-p1-starter) - This is a warm up project to refresh your C programming skills.
- [Project 2](https://github.com/shanep/cs452-p2-starter) - In this project you will write a simple shell.
- [Project 3](https://github.com/shanep/cs452-p3-starter) - In this project you will implement the buddy memory algorithm as described by Dr. Donald Knuth.
- [Project 4](https://github.com/shanep/cs452-p4-starter) - This project will introduce using threads to speed up an existing application
- [Project 5](https://github.com/shanep/cs452-p5-starter) - This project we will implement a simple bounded queue that can be used in the classic producer and consumer problem.
- [Project 6](https://github.com/shanep/cs452-p6-starter) - This project you will analyze the results of a previous project and write a report on your findings.

# Course Learning Outcomes

By the end of this course the student should have achieved the following
course learning outcomes.

| TLO | SLO | Objective                                                                                                                                             | Bloom Level | Assessment Instrument |
| --- | --- | ----------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- | --------------------- |
| 1   |     | Describe the fundamental components of a modern operating system                                                                                      | Remember    | Exam                  |
|     | 1.1 | Articulate process creation and destruction                                                                                                           | Understand  | Exam                  |
|     | 1.2 | Use system library code                                                                                                                               | Apply       | Project 2             |
|     | 1.3 | Use system documentation                                                                                                                              | Apply       | Project 2             |
|     | 1.4 | Apply computer science theory and software development fundamentals to produce computing-based solutions. **(ABET Outcome 6)**                        | Apply       | Project 2             |
|     | 1.5 | Use simple shell scripts and system tools to analyze process behavior                                                                                 | Apply       | Project 5, Project 6  |
| 2   |     | Describe the fundamental (core) abstractions used to implement Operating Systems                                                                      | Understand  | Exam                  |
|     | 2.1 | Demonstrate how low level memory is managed in user space                                                                                             | Apply       | Project 3             |
|     | 2.2 | Explore the system call interface                                                                                                                     | Apply       | Project 2 , Project 3 |
|     | 2.3 | Show an understanding of the difference between user and kernel space                                                                                 | Understand  | Exam                  |
|     | 2.4 | Articulate common problems arising in Operating System design and implementation                                                                      | Understand  | Exam                  |
| 3   |     | Construct applications that utilize processes, threads, and synchronization primitives to solve problems requiring concurrent or parallel computation | Create      | Project 4             |
|     | 3.1 | Analyze a complex computing problem and apply principles of computing and other relevant disciplines to identify solutions. **(ABET Outcome 1)**      | Analyze     | Project 6             |
|     | 3.2 | Explore the effects of multiple threads operating on the same buffer                                                                                  | Apply       | Project 4             |
|     | 3.3 | Identify the sources of deadlocks, race conditions, memory stomps and data loss                                                                       | Apply       | Project 5             |
|     | 3.4 | Apply concurrent programming techniques such as threads, event loops, and inter-process communication                                                 | Apply       | Project 5             |
| 4   |     | Practice secure programming techniques                                                                                                                | Create      | All Projects          |
|     | 4.1 | Produce code that is free of all memory leaks                                                                                                         | Apply       | All Projects          |
|     | 4.2 | Produce code without any out of bounds read/write errors                                                                                              | Apply       | All Projects          |
|     | 4.3 | Identify common attack vectors with respect to the operating system                                                                                   | Understand  | Exam                  |
|     | 4.4 | Identify common programming constructs that cause security vulnerabilities                                                                            | Understand  | Exam                  |
| 5   |     | Use professional software engineering tools and techniques.                                                                                           | Apply       | All Projects          |
|     | 5.1 | Use a cross platform build system (win32, posix)                                                                                                      | Apply       | Project 6             |
|     | 5.2 | Use a professional unit test framework  (win32, posix)                                                                                                | Apply       | Project 6             |
|     | 5.3 | Use a professional version control system (git)                                                                                                       | Apply       | Project 6             |
|     | 5.4 | Explore compiling and running code on at least 2 different systems                                                                                    | Apply       | Project 0             |
|     | 5.5 | Explore how to setup a continuous integration and testing project                                                                                     | Apply       | Project 0             |

- [Blooms Taxonomy](https://cft.vanderbilt.edu/guides-sub-pages/blooms-taxonomy/)
- [Booms Taxonomy of Verbs](https://tips.uark.edu/blooms-taxonomy-verb-chart/)

<!--@include: ../../parts/syllabus-boiler.md-->
