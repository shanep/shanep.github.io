<!-- markdownlint-disable-next-line -->
## Instructor Contact

- **email:** shanepanter@boisestate.edu
- **office:** [CCP246](https://www.boisestate.edu/coen-cs/currentstudents/aboutccp/)

## Grading Policy

Grades will be posted in canvas and calculated with the percentages specified
below. **Final grades will not be rounded**. I offer plenty of Extra Credit
Opportunities that you can take advantage of to improve your final grade.

I, like most people, am far from perfect. Some semesters I have an overwhelming
number of students to track and things unintentionally fall through the
cracks. If I made a mistake with your grade don’t panic! Take a deep
breath and just send me an email with the details and I will take a
look. Remember everything will be OK, I am here to help you as best I
can 😃.

| Letter Grade | Percentage |
| ------------ | ---------- |
| A            | 94% < 100% |
| A-           | 90% < 94%  |
| B+           | 87% < 90%  |
| B            | 84% < 87%  |
| B-           | 80% < 84%  |
| C+           | 77% < 80%  |
| C            | 74% < 77%  |
| C-           | 70% < 74%  |
| D+           | 67% < 70%  |
| D            | 64% < 67%  |
| D-           | 60% < 64%  |
| F            | 0 < 60%    |

## Extra Credit Opportunities

Standing extra credit is always offered to allow students to bump their
grade up if they are on a grading boundary so please take advantage of
any extra credit offered. Any extra credit given over the semester can
not exceed 2.5% of the total points offered. For example, the maximum
number of extra credit points that you can earn if the total points
offered is 1000 would be 25.

- Typos and Bugs - If you find any typos or bugs in the course materials, you can click the "Edit
this page" link at the bottom of the page, make the corrections, and then issue a [pull
request](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/creating-a-pull-request). If
I merge your changes back into my repository then I will give you 5 bonus points. I have
strategically placed several spelling and grammar errors for you to find so there are plenty of
opportunities to get the maximum number of points offered. So make sure and read everything with an
eagle 🦅 eye so you can rack up those points!

::: tip

Creating a pull request is important and is the core learning objective in the extra credit
process. No points will be awarded for any other method of submission. Some pages may include other
markdown pages so when you click the edit button if you don't see the content that you want to
correct look for an `<!--@include: ../path/to/file.md -->` directive which will have the path to the
file that needs to be updated :)

:::

- Use of AI technologies - If you are able to solve 100% of any assignment with AI, I will give you
extra credit if you submit your chat logs as proof that it was in fact 100% AI generated.  See the
AI 🤖 section for more details.

## Homework Policy

Unless explicitly instructed otherwise students are expected to work on their
own. All group work will be **clearly** marked so there should be no confusion.
The [Kount Computer Learning
Center](https://www.boisestate.edu/coen-cs/currentstudents/success-tutoring)
(CCP 241) is accessible 24/7 by proxy card to all students enrolled in CS
courses. Machines in the Kount Computer Tutoring Center have all the software
you will need this semester.

All of your programming assignments will be submitted using GitHub or with emailed
patches. Submissions via any other method such engraving your source code onto a stone tablet, or
wizard scroll 📜 will not be accepted under any circumstances. You are encouraged to make consistent
commits to your Git repository over the course of working on your project.

::: warning

Former students will post their projects for employers to see and you can find
them with a simple Google search. ChatGPT can give at least a partial solution
if not full solution to some of the projects in this class. Stackoverflow.com
has solutions to most common problems that students will encounter.  It is not
feasible for me to create brand new projects every semester nor is it feasible
to police the internet for solutions to my projects. Therefore in this class I
will trust that you are here to learn and will not seek out solutions to the
projects.  I expect all students to adhere to the Universities Academic
Integrity policy. If you get stuck on a project please attend office hours for
help instead of searching for a solution online.

:::

## AI Policy

Developer tools such as an IDE or AI should be used to **enhance** your
skills not replace them! AI in the hands of an experienced developer
makes that developer even more productive! AI in the hands of a student
robs them of the opportunity to learn 📚!

I feel that we are experiencing a new paradigm shift that last happened
in 1998 when Google Search was released. Google Search fundamentally
changed how students approached finding information. Then in 2004
[Google Scholar](https://en.wikipedia.org/wiki/Google_Scholar) was
released and you no longer had to spend hours in the library combing
through indexes or paper journals, you could just type your query into a
little box and get millions of results instantly. It’s hard to overstate
how dramatic the shift was to people who didn’t live through it. Google
was nothing short of mind-blowing compared to what existed before.

Banning tools that are broadly available only results in creating a low
trust environment in the classroom. Thus, in my class you are free to
use [AI or Machine Learning
technologies](https://en.wikipedia.org/wiki/Skynet_(Terminator)) to
complete your assigned work. However, I strongly encourage anyone who is
learning to code to **NOT** use AI or even an IDE. When you are learning
something new it is OK to struggle and get things wrong that is part of
the learning process 😃. Think back to your 2nd or 3rd grade class when
you were learning to spell, did your teacher let you use spell check on
your spelling tests? What would be the point of taking a spelling test
if you could? As you have moved up in education, using a spell checker
is a great way to **enhance** your underlying skills. However, even the
best spell checkers in the world can’t help someone who doesn’t
understand the basics of grammar or syntax (look at all the spelling and
grammar errors that I make).

If you do choose to use AI you **must cite** your usage and you will now
be graded on the code that it writes. If you truly believe that ChatGPT
can **always** give the best solution to any problem then you may want
to switch majors because why would a company hire you if they can just
use ChatGPT to write all their code?

Take for example the two possible solutions for a `size()` method in a typical
linked list. Can you spot the problem? While both solutions do work and produce
correct results, the AI generated solution is O(N) while the **better** solution
is O(1). If you don’t know why one is better than the other then I would
strongly suggest you not use AI tools until you get more experience.

::: code-group

```java
//ChatGPT generated - O(N) performance
public int size() {
    int size = 0;
    Node current = head;
    while (current != null) {
        size++;
        current = current.next;
    }
    return size;
}
```

```java
//Hand coded - O(1) performance
public int size() {
    return size;
}
```

:::

::: danger

It is still plagiarism to claim work that was generated by
[ChatGPT](https://openai.com/blog/chatgpt) or other AI tools as your own
and you will be written up for Academic dishonesty if you do not cite
your usage of any AI tools.

:::

When you are learning new material early assignments are intentionally
easier to help you build up your skills. Leaning too heavily on AI early
on will hurt you when you get to more complex assignments. You may not
even feel the pain until you get to your 300 or 400 level courses. Trust
me when I say AI can not solve most of the programming assignments in
your 400 level courses. I test my assignments against modern AI tools
and sometimes see hilariously wrong results, so if you are not able to
recognize correct vs incorrect results you should not be using AI in the
first place. So the bottom line is if you know enough about the given
subject to be able to recognize correct vs incorrect results then you
should be free to use said tools to enhance your productivity and
education.

## Attendance Policy

I follow the official [attendance
policy](https://www.boisestate.edu/registrar/registration/attendance-policy/) as
defined by the university. Please see the Late Work section for details on how
to make up any missed work. Students are responsible for all verbal
announcements or updates given during class.

## Late Work Policy

All homework assignments can be submitted up to **2 days late with no penalty**.
Once grades have been posted to canvas no further submissions will be accepted
unless prior arrangements have been made. No work or extra credit will be
accepted after the **last day of course instruction**, the semester has to end
at some point so plan accordingly. Work submitted 1 second late is treated the
same as work submitted 1 day late. You can find the last day of course
instruction at the
[registrar](https://www.boisestate.edu/registrar/boise-state-academic-calendars/).

::: info

For classes taught in the first 5wk or 7wk session of the semester, the last day
of course instruction is **NOT** the same as a regular semester. Please consult
the
[registrar](https://www.boisestate.edu/registrar/boise-state-academic-calendars/)
for the last day of course instruction for your specific class.

:::

## Exam and Quiz Policy

All exams and quizzes must be taken within the time frame specified on
canvas unless prior arrangements have been made. Clearly we can’t have
some students taking an exam AFTER the questions (and possibly answers)
have been released as it would give that student an unfair advantage.
Extensions will be granted on a case by case basis for situations that
were outside of the students control. Some exams or quizzes may require
you to go to the testing center. It is the student's responsibility to
schedule their own appointment in a timely fashion.

## Class Interaction Policy

All class interaction assignments must be completed within the time frame
specified on canvas or **during the lecture** unless prior arrangements have
been made. Assignments that are intended to be interactive are only valuable
when everyone is participating at the same time. It is not fair for a student to
expect their fellow classmates to respond or watch your submission that is late
when everyone else submitted on time. The secret code for the syllabus quiz is
"green".

This applies (but is not limited to) to the following assignment types:

- Discussion posts
- Reflections (both written and video)
- Group meetings - both virtual and in person
- Status updates
- Any in class activities
- Any quizzes or exams that are done on paper

## Communication Policy

During the semester communication outside of the classroom will be through
email, canvas, and office hours as detailed below. Other methods such as
[carrier pigeon](https://www.iwm.org.uk/history/the-incredible-carrier-pigeons-of-the-first-world-war)
🐦 are not supported at this time.

I get a lot of email and sometimes I miss messages, so if you don’t receive a
response from me after 48hrs please check to make sure you are sending the email
from BroncoMail and send a follow-up email. You can also send an email directly
in canvas if your emails are not going through. To help facilitate quick
communication please include the following information in all emails to myself
or the class TA/GA.

- First and Last name
- Student ID - I need this so I can look you up in the system. You would be
  surprised how many students have the same name or have changed their default
  name in the system to something other than their legal name so it is difficult
  to locate them in a timely manner.
- The class and section number that you are in for example CS123 - section 1

BroncoMail is the official communication channel through which all
university business is conducted. It is expected that you access and
read university communications two or three times per week. For more
information see the University Policy on Student Email Communications
(Policy 2280). Your instructor will not respond to any emails sent from
personal accounts such as Gmail or Yahoo.

Your instructor will make every effort to return emails within 48hrs
Monday thru Friday between the hours of 9:00am and 5:00pm (MST). Emails
sent on Saturday, Sunday, or outside of the defined hours will be
returned within 48hrs on the following business day. Emails should be
reserved for questions that are not appropriate for a public forum such
as grades or other personal issues.

## Office Hours Policy

For classes taught in the online or remote format office hours will be
accessible on canvas by appointment. For classes that are taught in the face to
face format office hours will only be available in person with times posted in
Canvas. If you can not find the office hours appointment link in canvas please
email me ASAP as I sometimes forget to post them at the start of the semester.

## IT support Policy

Your instructor and teaching assistant can not provide IT support for your personal machine. If you
can not get your personal machine configured correctly you will need to come into the lab to
complete all assignments. All machines in the CS labs are supported by the departments IT staff and
are guaranteed to work.


## Time Commitment

According to Boise State University [policy 4080](https://www.boisestate.edu/policy/academic-affairs-faculty-administration/policy-title-credit-hours/),
a 1 credit course spread over 15 weeks should require roughly 3 hours of
work per week divided over both in-class interactions and homework.
Classes that are held in compressed time frames such as summer or winter
breaks still need to complete the same number of credit hours in order
for the class to count toward your degree. Thus, if you are taking this
class in a compressed semester please consult the table below to make
sure you have time to complete all the assigned course work. For
example, as noted in the table below, taking two 3 credit courses in a 7
week semester is equivalent to working a full time job.

For a compressed course it is **critical** that you don’t fall behind!
Compressed courses move fast and missing 1 week of class is very hard if
not impossible to recover from.

| Credits | Number of weeks | Total Hours | Hours of work per week |
| ------- | --------------- | ----------- | ---------------------- |
| 1       | 3               | 45 hrs      | 15 hrs                 |
| 1       | 5               | 45 hrs      | 9 hrs                  |
| 3       | 7               | 135 hrs     | 19 hrs                 |
| 3       | 15              | 135 hrs     | 9 hrs                  |

## University Policies

All students are required to be familiar with the policies posted below. Please
review all linked policies below. Violations of university policies can result
in the student receiving a failing grade (F) in the course.

- [Student Code of Conduct](https://www.boisestate.edu/policy/student-affairs/code-of-conduct/)
- [Academic Integrity](https://www.boisestate.edu/registrar/general-information-and-policies/academic-integrity/)
- [Privacy policy](https://www.boisestate.edu/privacy/)
- [Incomplete Policy](https://www.boisestate.edu/registrar/degree-requirements/grades/)

## Student support

- [Educational access center](https://www.boisestate.edu/eac/)
- [Support resources](https://www.boisestate.edu/online/support-resources/)
- [Academic support services](https://www.boisestate.edu/aasc/academicsupportservices/)
- [Online student services](https://www.boisestate.edu/online/student-services/)
