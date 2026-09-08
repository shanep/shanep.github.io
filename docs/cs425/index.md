---
next: false
---

# CS 425/525 Computer Networks

## Catalogue Description

**CS 425/525 COMPUTER NETWORKS (3-0-3)(F)** Concepts and implementation of
networking: physical, link, network, transport, and application layer protocols.
Wireless networking and security basics. Cross-listed with ECE 434/534, may be
taken once for credit.

## Course Logistics

- **Email:** shanepanter (at) boisestate.edu
- **Office Hours:** <OfficeHoursLink />
- **Semester:** Fall 2026
- **Canvas:** [CS425/525, ECE434/534](https://boisestatecanvas.instructure.com/courses/48194)
- **Textbook:** *Computer Networking: A Top-Down Approach*, 9th edition, by James
  Kurose and Keith Ross. Provided as a digital textbook under Course Materials.

## Assessments

| Group                                | Weight |
| ------------------------------------ | ------ |
| Exams                                | 50%    |
| In Class Activities & Knowledge Checks | 40%  |
| [Projects](assignments/)             | 10%    |
| Extra Credit                         | 2.5%   |

All programming projects are written in C and must compile and run on **both**
GitHub Codespaces and Onyx. Portable code is a learning objective of this course,
so a project that builds on only one of the two receives no credit.

## Course Learning Outcomes

By the end of this course the student should have achieved the following course
learning outcomes.

| TLO | SLO | Objective                                                                                                                          | Assessment Instrument |
| --- | --- | ---------------------------------------------------------------------------------------------------------------------------------- | --------------------- |
| 1   |     | Describe the layered architecture of the Internet and the service each layer provides                                              | Exam                  |
|     | 1.1 | Explain encapsulation and how a message is transformed as it moves down and up the protocol stack                                   | Exam                  |
|     | 1.2 | Compare circuit switching and packet switching, and account for delay, loss, and throughput in a packet-switched network            | Exam                  |
|     | 1.3 | Distinguish the service models offered by the network core and the network edge                                                    | Exam                  |
| 2   |     | Implement network applications against a standard application layer protocol                                                       | Project 1             |
|     | 2.1 | Write a client that speaks a text-based protocol (SMTP, HTTP) over a socket                                                        | Project 1             |
|     | 2.2 | Explain the client-server and peer-to-peer application architectures                                                               | Exam                  |
|     | 2.3 | Describe how DNS resolves a name, and why it is structured as a distributed hierarchical database                                   | Exam                  |
| 3   |     | Construct applications that use the transport layer to deliver data reliably                                                       | Project 2             |
|     | 3.1 | Implement a reliable data transfer protocol over an unreliable channel                                                             | Project 2             |
|     | 3.2 | Analyze TCP connection management, flow control, and congestion control                                                            | Exam                  |
|     | 3.3 | Choose between TCP and UDP for a given application and defend the choice                                                           | Project 2             |
|     | 3.4 | Analyze a complex computing problem and apply principles of computing to identify solutions. **(ABET Outcome 1)**                    | Project 2             |
| 4   |     | Explain how packets are forwarded and how forwarding tables are computed                                                           | Exam                  |
|     | 4.1 | Describe the data plane: forwarding, the IP datagram, addressing, and NAT                                                          | Project 3             |
|     | 4.2 | Trace the operation of link-state and distance-vector routing algorithms                                                           | Exam                  |
|     | 4.3 | Explain the role of intra-AS and inter-AS routing, and what BGP is for                                                             | Exam                  |
|     | 4.4 | Subnet an address block with CIDR and compute the resulting ranges                                                                 | Project 3             |
| 5   |     | Describe link layer services and the operation of a local area network                                                             | Project 4             |
|     | 5.1 | Explain error detection and correction, and multiple access protocols                                                              | Exam                  |
|     | 5.2 | Trace an end-to-end request through ARP, DHCP, switching, and routing                                                              | Project 4             |
|     | 5.3 | Describe how 802.11 wireless differs from wired Ethernet at the link layer                                                         | Exam                  |
| 6   |     | Apply security principles to network communication                                                                                 | Exam                  |
|     | 6.1 | Explain confidentiality, integrity, authentication, and how they are achieved                                                      | Exam                  |
|     | 6.2 | Describe TLS, and what it does and does not protect                                                                                | Exam                  |
|     | 6.3 | Identify common network attack vectors and the defenses against them                                                               | Exam                  |
| 7   |     | Use professional software engineering tools and techniques                                                                         | All Projects          |
|     | 7.1 | Build code with a build system and run it under a unit test framework                                                              | All Projects          |
|     | 7.2 | Produce code free of memory leaks and out-of-bounds accesses                                                                       | All Projects          |
|     | 7.3 | Compile and run code on at least two different systems                                                                             | All Projects          |
|     | 7.4 | Use continuous integration to test every change                                                                                    | All Projects          |
|     | 7.5 | Use a professional version control system (git)                                                                                    | All Projects          |

## Course Policies

Unless explicitly instructed otherwise, students are expected to work
independently. All group work will be marked, so there should be no confusion.
The [Kount Computer Learning Center](https://www.boisestate.edu/coen-cs/currentstudents/success-tutoring)
(CCP 241) is accessible 24/7 to all students enrolled in CS courses via a proxy
card, and has all the software you will need this semester.

### AI Policy

You are free, and strongly encouraged, to use AI in any form and for any task in
this course.

### Attendance Policy

I follow the university's official
[attendance policy](https://www.boisestate.edu/registrar/registration/attendance-policy).
You are expected to attend all lectures. Exceptions are handled case by case.

### Late Work Policy

- All assignments have due dates set in Canvas and lock automatically once the
  2 day grace period expires.
- Assignments, quizzes, and Canvas discussion boards get a 2 day automatic grace
  period after the due date with no penalty.
- Work done in class must be turned in at the end of class and cannot be made up.
- **No work** or extra credit is accepted after the last date of course
  instruction as defined on the
  [registrar's website](https://www.boisestate.edu/registrar/boise-state-academic-calendars/).
- Work that was completed but not submitted will not be accepted. Git commits can
  be [backdated](https://stackoverflow.com/a/74884865) and
  [filesystem dates](https://superuser.com/a/1633154) can be altered.
- Once grades have been posted for any assigned work, no further submissions are
  accepted under any circumstances.

### IT Support Policy

Your instructor and teaching assistant cannot provide IT support for your
machine. If you cannot get your machine configured correctly you will need to
come into the lab to complete all assignments. All machines in the CS labs are
supported by the department's IT staff and are guaranteed to work.

### University Policies

All students are required to be familiar with the policies below. Violations can
result in a failing grade (F) in the course.

- [Student Code of Conduct](https://www.boisestate.edu/policy/student-affairs/code-of-conduct/)
- [Academic Integrity](https://www.boisestate.edu/registrar/general-information-and-policies/academic-integrity/)
- [Privacy Policy](https://www.boisestate.edu/privacy/)
- [Incomplete Policy](https://www.boisestate.edu/registrar/degree-requirements/grades/)

## Accessing University Support Services

Boise State cares about you. Technical, academic, financial, and life support, as
well as learning accommodations and data privacy agreements, are collected in the
[Accessing University Support Services](https://docs.google.com/document/d/14ZMRsHAgo356h0nHtJuStDKGwvg6LY-XOA7PxacwECw/edit#heading=h.oohv0l26wvu1)
document.

<!--@include: ../../parts/syllabus-boiler.md-->
