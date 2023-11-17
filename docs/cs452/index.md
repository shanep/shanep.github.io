---
next: false
---

# CS 452/552 Operating Systems

**CS 452/552 OPERATING SYSTEMS (3-0-3)(F,S)** Process management,
concurrency, inter-process communication, synchronization, scheduling,
memory management, file systems and security. Case studies of multiple
operating systems. PREREQ: CS 321 and ECE 330.

## Topics and Schedule

| Week | Topic                                            | Textbook Reading                                                                                      | What Due?     |
| ---- | ------------------------------------------------ | ----------------------------------------------------------------------------------------------------- | ------------- |
| 1    | [Course Introduction](course-introduction.md)    |                                                                                                       |               |
|      | [C Review](c-review.md)                          | [Modern Debugging](/articles/modern-debugging-acm.pdf)                                                |               |
| 2    | Project 0 Introduction                           |                                                                                                       |               |
|      | [Testing](testing.md)                            | [Coverity](/articles/coverity-acm.pdf)                                                                |               |
| 3    | [Libraries](libraries.md)                        |                                                                                                       |               |
|      | Project 1 Introduction                           |                                                                                                       | Project 0 Due |
| 4    | [Operating Systems Introduction](intro.md)       | [OSTEP ch2 - Introduction](http://pages.cs.wisc.edu/~remzi/OSTEP/intro.pdf)                           |               |
|      | [The Process](cpu-intro.md)                      | [OSTEP ch4 - Abstraction the process](http://pages.cs.wisc.edu/~remzi/OSTEP/cpu-intro.pdf)            |               |
| 5    | [Process API](cpu-api.md)                        | [OSTEP ch5 - Process API](http://pages.cs.wisc.edu/~remzi/OSTEP/cpu-api.pdf)                          |               |
|      | Project 2 Introduction                           |                                                                                                       | Project 1 Due |
| 6    | [Limited Direct Execution](cpu-mechanisms.md)    | [OSTEP ch6 - Limited Direct Execution](http://pages.cs.wisc.edu/~remzi/OSTEP/cpu-mechanisms.pdf)      |               |
|      | [Scheduling](cpu-sched.md)                       | [OSTEP ch7 - Scheduling Introduction](http://pages.cs.wisc.edu/~remzi/OSTEP/cpu-sched.pdf)            |               |
| 7    | [Address Spaces](vm-intro.md)                    | [OSTEP ch13 - Address Spaces](https://pages.cs.wisc.edu/~remzi/OSTEP/vm-intro.pdf)                    |               |
|      | Project 4 Introduction                           |                                                                                                       | Project 2 Due |
| 8    | [Free Space Management](vm-freespace.md)         | [OSTEP ch17 - Free Space management](https://pages.cs.wisc.edu/~remzi/OSTEP/vm-freespace.pdf)         |               |
|      | [Paging](vm-paging.md)                           | [OSTEP ch18 - Paging: Introduction](https://pages.cs.wisc.edu/~remzi/OSTEP/vm-paging.pdf)             |               |
| 9    | [Concurrency](threads-intro.md)                  | [OSTEP ch26 - Concurrency and Threads](https://pages.cs.wisc.edu/~remzi/OSTEP/threads-intro.pdf)      |               |
|      | Project 4 Introduction                           |                                                                                                       | Project 3 Due |
| 10   | [Locks](threads-locks.md)                        | [OSTEP ch28 - Locks](https://pages.cs.wisc.edu/~remzi/OSTEP/threads-locks.pdf)                        |               |
|      | [Locked Data Structures](threads-locks-usage.md) | [OSTEP ch29 - Locked Data Structures](https://pages.cs.wisc.edu/~remzi/OSTEP/threads-locks-usage.pdf) |               |
| 11   | [Condition Variables](threads-cv.md)             | [OSTEP ch30 - Condition Variables](https://pages.cs.wisc.edu/~remzi/OSTEP/threads-cv.pdf)             |               |
|      | Project 5 Introduction                           |                                                                                                       | Project 4 Due |
| 12   | [Semaphores](threads-sema.md)                    | [OSTEP ch31 - Semaphores](https://pages.cs.wisc.edu/~remzi/OSTEP/threads-sema.pdf)                    |               |
|      | [Concurrency Bugs](threads-bugs.md)              | [OSTEP ch32 - Concurrency Bugs](https://pages.cs.wisc.edu/~remzi/OSTEP/threads-bugs.pdf)              |               |
| 13   | [Event Based Concurrency](threads-events.md)     | [OSTEP ch33 - Event Based Concurrency](https://pages.cs.wisc.edu/~remzi/OSTEP/threads-events.pdf)     |               |
|      | Project 6 Introduction                           |                                                                                                       | Project 5 Due |
| 14   | Thanksgiving Break                               |                                                                                                       |               |
|      | Thanksgiving Break                               |                                                                                                       |               |
| 15   | [I/O Devices](file-devices.md)                   | [OSTEP ch36 - I/O Devices](https://pages.cs.wisc.edu/~remzi/OSTEP/file-devices.pdf)                   |               |
|      | [Files and Directories](file-intro.md)           | [OSTEP ch39 - Files and Directories](https://pages.cs.wisc.edu/~remzi/OSTEP/file-intro.pdf)           | Project 6 Due |
| 16   | [Security](security-intro.md)                    | [OSTEP ch53 - Security](https://pages.cs.wisc.edu/~remzi/OSTEP/security-intro.pdf)                    |               |
|      | Bonus day                                        |                                                                                                       |               |
| 17   | Final Exam                                       |                                                                                                       |               |

## Textbook

- Textbook: [Operating Systems: Three Easy Pieces](https://pages.cs.wisc.edu/~remzi/OSTEP/)
  - Remzi H. Arpaci-Dusseau and Andrea C. Arpaci-Dusseau

## Assessments

Your final grade will be calculated with the following weights in
canvas. All Projects will be graded with the
[project grading rubric](grading-rubric.md).

- Projects - 70%
- Exams - 30%
  - Several exams covering the textbook reading assignments and project learning objectives.
  - All exams will be on canvas and must be taken in the testing center.

## Course Learning Outcomes

By the end of this course the student should have achieved the following
course learning outcomes.

| TLO | SLO | Objective                                                                                                                                             | Bloom Level | Assessment Instrument |
| --- | --- | ----------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- | --------------------- |
| 1   |     | Describe the fundamental components of a modern operating system                                                                                      | Remember    | Exam                  |
|     | 1.1 | Articulate process creation and destruction                                                                                                           | Understand  | Exam                  |
|     | 1.2 | Use system library code                                                                                                                               | Apply       | Project 2             |
|     | 1.3 | Use system documentation                                                                                                                              | Apply       | Project 2             |
|     | 1.4 | Apply computer science theory and software development fundamentals to produce computing-based solutions. **(ABET Outcome 6)**                        | Apply       | Project 2             |
|     | 1.5 | Use simple shell scripts and system tools to analyze process behavior                                                                                 | Apply       | Project 5, Project 4  |
| 2   |     | Describe the fundamental (core) abstractions used to implement Operating Systems                                                                      | Understand  | Exam                  |
|     | 2.1 | Demonstrate how low level memory is managed in user space                                                                                             | Apply       | Project 3             |
|     | 2.2 | Explore the system call interface                                                                                                                     | Apply       | Project 2 , Project 6 |
|     | 2.3 | Show an understanding of the difference between user and kernel space                                                                                 | Understand  | Project 6             |
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
