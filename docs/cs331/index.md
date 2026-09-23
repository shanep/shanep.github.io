# CS 331: Computer Security and Information Assurance

## Catalogue Description

Fundamentals of computer security and information assurance. Topics include security goals, access control, common software and network vulnerabilities, cryptography, security policies and procedures.

## Course Logistics

- **Email:** shanepanter (at) boisestate.edu
- **Office Hours:** Appointments are available by request
- **Classroom:** Online (Asynchronous)
- **Semester:** Spring 2027
- **Class Time:** N/A (Asynchronous)
- **Prerequisites:** Complete at least one of the following: CS 117, CS 121, ITM 225

## Who This Course Is For

This is the **first security course** most students take, and it is open across departments, 
computer science, information technology management, and others. The only assumption is that you
have completed one introductory programming course.

You will not be asked to write a program from scratch. Every lab that involves code gives you a
working, commented Python script; your job is to run it, change a value or two, read the output,
and explain what happened and why. There is no virtual machine to install, no Linux server to
configure, and no version control to learn. If you can open a terminal and a web browser, you have
everything you need.

## Course Materials

**No textbook purchase is required.** The required text is:

> The Cyber Security Body of Knowledge, version 1.1.0. Awais Rashid, Howard Chivers,
> Emil Lupu, Andrew Martin, and Steve Schneider (eds.), July 2021.
> © Crown Copyright, The National Cyber Security Centre 2021, licensed under the
> Open Government Licence v3.0: <http://www.nationalarchives.gov.uk/doc/open-government-licence/>

CyBOK is a free, openly licensed reference written by the people who work in each area. The
complete PDF is in this course at [docs/CyBOK_v1.1.0.pdf](docs/CyBOK_v1.1.0.pdf) and in Canvas
Files. You never have to go anywhere else to get a reading.

Two things to know about it:

1. **We use about a third of the book, deliberately.** CyBOK covers 21 knowledge areas including
   several (formal methods, hardware security, cyber-physical systems) that belong in later
   courses. The weeks below name the exact sections you are responsible for. You are not expected
   to read anything else.
2. **CyBOK is a reference, not a tutorial.** It is precise and compact rather than chatty. Each
   week's lecture notes page adds a worked example that shows the idea applied once, concretely, plus a
   plain-language supplement where one helps.

**Finding a reading:** CyBOK section numbers (for example, §10.4) are the reliable way to
navigate. Every page of the PDF prints its page number in the footer, which will not match your PDF
viewer's page counter, the book has 39 pages of front matter. Use your viewer's search box or the
bookmarks panel and go by section number.

A complete list of readings, supplements, and their licenses is in [Readings and Resources](resources.md).

## Required Tools

Everything below is free and works the same on macOS and Linux.

| Tool | Why | Notes |
| --- | --- | --- |
| A web browser | Readings, Canvas, and two labs that use browser tools | Any modern browser |
| Python 3.11 or newer | Six labs run a provided script | Pre-installed on macOS and most Linux systems |
| The `cryptography` package | Labs 4 and 6 only | One `pip install cryptography`, walked through step by step in [Lab 0](assignments/lab-00-course-setup.md) |

You do **not** need a virtual machine, a Linux server, Docker, git, or a GitHub account. If your
own machine gives you trouble, every lab runs on the lab machines described under
[IT Support Policy](#it-support-policy).

## Course Workflow

Every week follows the same rhythm, and **nothing in this course spans more than one week**:

1. **Read** the assigned CyBOK sections (never more than 15 pages) and the week's supplement.
2. **Work through the module** in Canvas. Its **Overview** page lists the objectives and what is
   due when; its **Readings and Lecture Notes** page includes a worked example.
3. **Complete one graded activity**: either a lab or a discussion, never both in the same week.
4. **Take a quiz** in five of the fifteen weeks.

There is no semester-long project and no assignment that carries over from one week to the next.
If you fall behind, you can catch up in a single week.

**Everything is submitted in Canvas.** Labs are a single text entry or one attached file.
Quizzes and exams are taken in Canvas. Discussions happen in the Canvas discussion boards.

## Weekly Time Budget

This course is designed to take **8 hours per week or less, including everything**: reading,
lecture notes, labs, discussions, quizzes, and study time. A typical week:

| Activity | Time |
| --- | --- |
| CyBOK reading (7-15 pages) and note-taking | 1.5-2.0 hrs |
| Lecture notes and worked example | 0.5-1.0 hrs |
| One lab (weeks with a lab) | 1.5-2.0 hrs |
| *or* one discussion: initial post and replies (weeks with a discussion) | 1.0 hrs |
| Quiz (five weeks only) | 0.5 hrs |
| Review, questions, and slack | 2.0-2.5 hrs |
| **Typical total** | **6.5-8.0 hrs** |

Every lab is scoped to be finished **in one sitting of about 90 minutes**. If a lab is taking you
much longer than that, stop and email me: that is a problem with the lab, not with you.

## Learning Outcomes

This course has seven terminal learning objectives. **Every objective is introduced in this
course, and every objective is required**: there are no optional objectives and nothing here
assumes you covered it somewhere else.

Each terminal objective breaks down into supporting objectives that name the exact assignment,
quiz, or exam that measures them. The complete alignment is on the
[Objective Alignment Sheet](objectives.md).

| # | The student will be able to… | Bloom level |
| --- | --- | --- |
| [TLO 1](objectives.md#tlo-1--security-goals-terminology-principles-ethics-and-regulation) | Explain core security goals, terminology, first principles, ethical obligations, and the role of privacy and regulation in security practice. | Understand |
| [TLO 2](objectives.md#tlo-2--modeling-subjects-objects-permissions-trust-boundaries-and-threats) | Model subjects, objects, permissions, trust boundaries, and threats using access control matrices, policy descriptions, and basic threat models. | Apply |
| [TLO 3](objectives.md#tlo-3--comparing-cryptographic-mechanisms-and-their-limits) | Compare symmetric encryption, public-key cryptography, hashing, digital signatures, key management, and secure communication protocols, including their assumptions and limitations. | Understand |
| [TLO 4](objectives.md#tlo-4--analyzing-common-attacks-and-justifying-countermeasures) | Analyze common attacks and vulnerabilities, including phishing, network attacks, SQL injection, and buffer overflows, and justify appropriate countermeasures. | Analyze |
| [TLO 5](objectives.md#tlo-5--applying-authentication-authorization-and-secure-design-principles) | Apply authentication, authorization, least privilege, separation of privilege, fail-safe defaults, and other secure design principles to a system design. | Apply |
| [TLO 6](objectives.md#tlo-6--interpreting-assurance-arguments-and-evidence) | Interpret assurance arguments and evidence, and evaluate whether a system's security claims are supported by its design, implementation, and testing. | Evaluate |
| [TLO 7](objectives.md#tlo-7--analyzing-detection-data-and-recommending-a-response) | Analyze basic intrusion-detection data and recommend a defensible response using an appropriate detection model. | Analyze |

## Schedule

The schedule may be adjusted due to factors such as instructor availability, student progress, and
current events. Weeks run Monday through Sunday. Because the course is asynchronous, dates are
release and due anchors rather than meeting times. Exact due dates are posted in Canvas.

All readings marked § refer to [CyBOK v1.1.0](docs/CyBOK_v1.1.0.pdf); page numbers are the
printed page numbers shown in the PDF's footers.

| Week | Dates | Topic | Reading | Graded this week |
| ---- | ----- | ----- | ------- | ---------------- |
| 1 | Jan 11-17 | [What is cyber security? Goals, terms, and failures](notes/week-01-what-is-cyber-security.md) | §1.1-1.3 (pp. 2-8) | [Lab 0](assignments/lab-00-course-setup.md); [D1](discussions/d01-introductions-and-security-mindset.md); [diagnostic](quizzes/quiz-00-diagnostic.md) (ungraded) |
| 2 | Jan 18-24 | [Security principles and the human factor](notes/week-02-security-principles-and-human-factors.md) | §1.4-1.5 (pp. 9-15); §4.3-4.4 (pp. 158-165) | [Lab 1](assignments/lab-01-security-principles-audit.md) |
| 3 | Jan 25-31 | [Law, regulation, ethics, and privacy](notes/week-03-law-ethics-and-privacy.md) | §3.1 (pp. 52-58); §3.13 (pp. 122-127); §5.2-5.3 (pp. 187-191) | [D2](discussions/d02-ethics-and-privacy-case.md); [Quiz 1](quizzes/quiz-01-foundations.md) |
| 4 | Feb 1-7 | [Risk management and threat modeling](notes/week-04-risk-and-threat-modeling.md) | §2.2-2.4 (pp. 20-26); §2.6.1-2.6.2 (pp. 31-33); §2.6.6 (pp. 43-45) | [Lab 2](assignments/lab-02-threat-model.md) |
| 5 | Feb 8-14 | [Authentication and credentials](notes/week-05-authentication-and-credentials.md) | §14.5 (pp. 479-489) | [D3](discussions/d03-authentication-policy-critique.md); [Quiz 2](quizzes/quiz-02-authentication.md) |
| 6 | Feb 15-21 | [Authorisation, access control, and accountability](notes/week-06-authorisation-and-access-control.md) | §14.1-14.3 (pp. 466-475); §14.6 (pp. 489-493) | [Lab 3](assignments/lab-03-access-control-matrix.md) |
| 7 | Feb 22-28 | [Symmetric cryptography](notes/week-07-symmetric-cryptography.md) | §10.3-10.5 (pp. 329-338) | [Lab 4](assignments/lab-04-symmetric-encryption.md) |
| 8 | Mar 1-7 | [Public-key cryptography, hashing, and signatures](notes/week-08-public-key-cryptography.md) | §10.6-10.8 (pp. 338-347) | [Lab 5](assignments/lab-05-hashing-and-signatures.md); [Quiz 3](quizzes/quiz-03-cryptography.md) |
| 9 | Mar 8-14 | [Review and midterm](notes/week-09-review-and-midterm.md) | No new reading | **[Midterm exam](assignments/midterm-exam-guide.md)** |
|: | **Mar 15-19** | **SPRING BREAK: no class meetings, nothing due** |: |: |
| 10 | Mar 22-28 | [Keys, certificates, PKI, and TLS](notes/week-10-keys-certificates-and-pki.md) | §18.3 (pp. 625-635); §18.5.1 (pp. 639-640) | [Lab 6](assignments/lab-06-certificates-and-tls.md) |
| 11 | Mar 29-Apr 4 | [Network security and attacks](notes/week-11-network-security.md) | §19.1 (pp. 646-648); §19.3.2-19.3.3 (pp. 656-665); §19.4 (pp. 671-677) | [D4](discussions/d04-network-security-in-the-news.md); [Quiz 4](quizzes/quiz-04-network-security.md) |
| 12 | Apr 5-11 | [Malware and adversarial behaviours](notes/week-12-malware-and-adversarial-behaviours.md) | §6.1-6.2 (pp. 202-207); §6.4 (pp. 214-219); §7.2 (pp. 236-242) | [Lab 7](assignments/lab-07-malware-triage.md) |
| 13 | Apr 12-18 | [Software security, memory safety, and assurance](notes/week-13-software-security-and-assurance.md) | §15.1.1 (pp. 500-501); §15.2 (pp. 507-512); §15.4 (pp. 516-520); §17.4 (pp. 582-585) | [Lab 8](assignments/lab-08-memory-safety-and-assurance.md) |
| 14 | Apr 19-25 | [Web security and injection](notes/week-14-web-security-and-injection.md) | §16.2.6-16.2.8 (pp. 536-540); §16.3.1 (pp. 543-545); §16.4.1 (pp. 547-552) | [Lab 9](assignments/lab-09-sql-injection.md); [Quiz 5](quizzes/quiz-05-software-and-web.md) |
| 15 | Apr 26-30 | [Security operations, detection, and incident response](notes/week-15-security-operations-and-incident-response.md) | §8.1 (pp. 253-256); §8.3.1-8.3.3 (pp. 264-268); §8.7 (pp. 283-286) | [Lab 10](assignments/lab-10-log-analysis-and-incident-memo.md); [D5](discussions/d05-current-security-failure.md) |
| Finals | May 3-7 | Wrap-up | No new reading | **[Final exam](assignments/final-exam-guide.md)**; [D6 reflection](discussions/d06-final-reflection.md) |

Spring break, the last day of instruction (April 30), and finals week (May 3-7) follow the
[registrar's academic calendar](https://www.boisestate.edu/registrar/boise-state-academic-calendars/spring-2027-academic-calendar/).

## Assessments

The course is worth **1000 points**. Every graded item is completed within a single week.

| Assessment | Weight | Points | Description |
| ---------- | -----: | -----: | ----------- |
| Labs | 40% | 400 | Eleven single-sitting labs: Lab 0 (20 pts) plus Labs 1-10 (38 pts each) |
| Quizzes | 15% | 150 | Five concept checks in Canvas (30 pts each), plus an ungraded diagnostic in week 1 |
| Discussions and reflections | 15% | 150 | Six Canvas discussions: D1 (15 pts), D2-D5 (30 pts each), D6 reflection (15 pts) |
| Midterm exam | 15% | 150 | Individual assessment covering weeks 1-8 |
| Final exam | 15% | 150 | Individual assessment, emphasis on weeks 10-15 |
| **Total** | **100%** | **1000** | |

Labs, quizzes, discussions, and exams assess different objectives; a missed discussion cannot be
replaced by extra lab work. Exact point values and due dates are posted in Canvas. Which objective
each item measures is listed in the [Objective Alignment Sheet](objectives.md).

## Grading Policy

Grades will be posted in Canvas and calculated using the percentages below. **Final grades will not
be rounded.** Extra Credit opportunities are available throughout the semester to help improve your
final grade.

| Letter Grade | Percentage   |
| ------------ | ------------ |
| A            | 94% - 100%   |
| A-           | 90% - 93.99% |
| B+           | 87% - 89.99% |
| B            | 84% - 86.99% |
| B-           | 80% - 83.99% |
| C+           | 77% - 79.99% |
| C            | 74% - 76.99% |
| C-           | 70% - 73.99% |
| D+           | 67% - 69.99% |
| D            | 64% - 66.99% |
| D-           | 60% - 63.99% |
| F            | Below 60%    |

## Extra Credit Opportunities

Standing extra credit is always available to help students on a grading boundary. Extra credit
earned over the semester cannot exceed **2.5% of total points offered**. This course offers 1000
points, so the extra credit maximum is **25 points**.

## Homework Policy

Unless explicitly stated otherwise, all work is individual. Group assignments will be **clearly**
marked. The [Kount Computer Learning Center](https://www.boisestate.edu/coen-cs/currentstudents/success-tutoring)
(CCP 241) is accessible 24/7 by proxy card to all students enrolled in CS courses and has all the
software you will need.

## AI Policy

There is no restriction of AI use in this course. You may use AI tools to help
you with your work, but you are responsible for ensuring that your work is
accurate and meets the requirements of the assignment. You are strongly
encouraged to explore the use of AI tools as part of your learning process, but
you should not rely on them exclusively. If you use AI tools, you should
disclose this in your work and provide a brief explanation of how you used them.

## Attendance Policy

This course is asynchronous. I follow the official [attendance policy](https://www.boisestate.edu/registrar/registration/attendance-policy/)
as defined by the university. Students are responsible for completing the weekly
materials and assessments by the posted deadlines. Students who need an approved
accommodation or make-up arrangement should contact me as soon as possible.

## Late Work Policy

Homework assignments may be submitted up to **2 days late with no penalty.** After the grace period,
no submissions will be accepted unless prior arrangements were made before the original due date. No
work or extra credit will be accepted after the **last day of course instruction**: the semester
must end at some point, so plan accordingly. Work submitted 1 second late is treated the same as
work submitted 1 day late. You can find the last day of course instruction on the
[registrar's academic calendar](https://www.boisestate.edu/registrar/boise-state-academic-calendars/).

## Exam and Quiz Policy

All exams and quizzes must be completed within the time frame specified in Canvas unless prior
arrangements have been made. Extensions are granted on a case-by-case basis for circumstances
outside the student's control. Some assessments may require the testing center: it is the
student's responsibility to schedule their own appointment in a timely manner.

## Class Interaction Policy

Class interaction assignments must be completed within the time frame specified in
Canvas. Discussion and peer-review activities are most useful when completed during
the assigned week, so late participation may receive reduced or no credit when it
would disadvantage classmates who participated on time.

This applies to (but is not limited to):

- Discussion posts
- Reflections (written and video)
- Group meetings (virtual or in person)
- Status updates
- Asynchronous activities
- Online quizzes and exams

## Communication Policy

Outside the classroom, communication will be through email, Canvas, and office hours.
If you do not receive a reply within 48 hours, verify you are emailing from BroncoMail and send a
follow-up. You can also message through Canvas if email is not going through. Please include the
following in all emails:

- First and last name
- Student ID
- Course and section number (e.g., CS123-01)

BroncoMail is the official university communication channel. Check it two to three times per week.
Your instructor will not respond to emails from personal accounts (Gmail, Yahoo, etc.). See
University Policy 2280 for details.

Emails are answered within 24 hours, Monday-Friday, 9:00 am-5:00 pm (MST). Emails sent on
weekends or outside those hours will receive a reply on the next business day. Reserve email for
private matters such as grades, general course questions belong in the class discussion forum.

## IT Support Policy

Your instructor and teaching assistant cannot provide IT support for personal machines. If you
cannot get your personal machine configured correctly, use a lab machine to complete your work.

### Labs and Other Building Spaces

The CCP building (downtown Boise) has three labs secured by proxy card access. All lab machines are
supported by department IT staff and are guaranteed to work.

- **Kount Learning Center (CCP 241)**: Accessible 24/7 by proxy card to all CS students. See the
  [Success & Tutoring page](https://www.boisestate.edu/coen-cs/currentstudents/success-tutoring/)
  for details.
- **CS 121 Classroom Lab (CCP 242)**: Accessible 24/7 by proxy card, but not available during
  scheduled courses and labs (see the schedule posted outside the lab).
- **Metageek Lab (CCP 240)**: Accessible 24/7 by proxy card, but not available during scheduled
  CS courses and labs (see the schedule posted outside the lab).

## University Policies

Violations of university policies may result in a failing grade (F) for the course. All students
are required to review the following:

- [Student Code of Conduct](https://www.boisestate.edu/policy/student-affairs/code-of-conduct/)
- [Academic Integrity](https://www.boisestate.edu/registrar/general-information-and-policies/academic-integrity/)
- [Privacy Policy](https://www.boisestate.edu/privacy/)
- [Incomplete Grade Policy](https://www.boisestate.edu/registrar/degree-requirements/grades/)

## Student Support

Boise State cares about your success. Help is available for technical, academic, financial, and
personal needs, as well as learning accommodations. Nearly all services are available to online
students as well.

- [Educational Access Center](https://www.boisestate.edu/eac/)
- [Support Resources](https://www.boisestate.edu/online/support-resources/)
- [Academic Support Services](https://www.boisestate.edu/aasc/academicsupportservices/)
- [Accessing University Support Services](https://docs.google.com/document/d/14ZMRsHAgo356h0nHtJuStDKGwvg6LY-XOA7PxacwECw/edit#heading=h.oohv0l26wvu1) (full resource guide)

---

<div class="cs-buttons">

[Instructor Information](instructor.md)
[Course Resources](resources.md)
[Course Questions](https://boisestatecanvas.instructure.com/courses/52107/discussion_topics/1174722)

</div>
