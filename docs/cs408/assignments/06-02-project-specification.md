---
submission: online_url
grading: letter_grade
---

# 06.02 - Project Specification (Final Draft)

**Week 7 · 40 points**

## Overview

You will fix ALL issues noted by your instructor and peer reviews in the original Google Doc. Feel
free to make any other adjustments you see fit and submit this assignment for final approval.

### Task 1 - Final Draft Summary

Add in a NEW section at the end of your document titled: "Summary of changes". Write a short
200-300-word paragraph summarizing all the updates you made.  If your original document was so good
that it caused me to shed a tear of joy while I reviewed it, and I didn't note any issues, you may
simply write "*Level 7 - Unicorn Engineer*. No changes necessary, mic drop" in the Summary of
changes section and then thank your past self for all the hard work!

### Submitting

1. Submit the URL to your Google doc
2. Your project is approved when this assignment meets both **Approval Requirements** below. Your
    points set only your letter grade. This assignment is required to receive a final grade on the
    project. A grade of 0 will be applied to any missed checkpoints until your project is approved,
    so please do not procrastinate :)
3. This assignment CAN NOT be turned in late under any circumstances. I will be reviewing your
    submissions the DAY after they are due, so you are not delayed. PLEASE look at the **due
    date** carefully. I know you are all top students, so you likely had very few issues to fix.
    This should be a very short assignment.

### Grading

This assignment is worth 40 points. Every item below is checked against your document as submitted,
and each one either earns its points or does not, except where partial points are spelled out.

#### Approval Requirements

Your project is approved only if both of these are true. If either is not, the project is not
approved and this assignment earns an F, whatever the points below add up to.

1. **The idea is allowed.** Anything my 05.01 comment said does not meet the project specification
    is resolved. The project is not a todo list app, not a minor extension of the Canvas mini-lab or
    another earlier assignment, and not in a banned category.
2. **The plan meets every minimum requirement:** a landing page with navigation to every page, a
    shared header and footer, at least 7 distinct pages, forms that create, update and delete data,
    a conditional search page, styling with a framework like Bootstrap, and bash scripts that set up
    EC2 and run the app on boot.

#### Revision (14 points)

| \# | Item | Earns the points when | Points |
|----|----|----|----|
| R1 | **Summary of changes** | The last section of the document is titled "Summary of changes" and is 200 to 300 words (or is the Level 7 Unicorn Engineer line, allowed only if my 05.01 comment named nothing to fix). | 4 |
| R2 | **Instructor feedback** | Every item named in my 05.01 comment is fixed in the document and listed in the Summary of changes. 6 points if all are fixed, 3 if exactly one is not, 0 if two or more are not. | 6 |
| R3 | **Peer feedback** | Every criterion either peer reviewer rated "Needs Work" is fixed, or the Summary of changes says why you did not change it. 4 points if all are handled, 2 if exactly one is not, 0 if two or more are not. If you did not receive any peer reviews, you get the full 4 points. | 4 |

#### Specification (26 points)

These are the same 12 criteria your peers used in 6.01.

| \# | Item | Earns the points when | Points |
|----|----|----|----|
| 1 | **Overview & Theme** | Names the app and states its theme. If it clones an existing site, links to that site. | 2 |
| 2 | **Target Audience** | Names a specific audience and describes at least one concrete use case for it. | 2 |
| 3 | **Functionality** | Lists the features, including at least one form that creates, one that updates and one that deletes data, and a conditional search or filter page. | 2 |
| 4 | **Database Schema** | Lists every table with its fields and types, and every feature that stores data has a table to store it in. | 2 |
| 5 | **Tech Stack Details** | Names the backend language, backend framework, database, frontend templates and frontend styling framework. | 2 |
| 6 | **Media Plan** | Lists the media the app needs and where each comes from. | 2 |
| 7 | **Wireframes** | There is a wireframe image for every planned page (at least 7), showing layout and navigation. | 2 |
| 8 | **Schedule / Checkpoints** | Exactly 7 checkpoints, and each one names at least one deliverable that can be demonstrated: a specific page, form, feature, script or test. A label alone ("Styling", "Testing", "Polish", "Backend work") is not a deliverable. 4 points if all 7 qualify, 2 if exactly one does not, 0 if two or more do not. | 4 |
| 9 | **Testing Strategy** | Names the automated testing tool and what will be tested. | 2 |
| 10 | **Install & Run Instructions** | Describes the three required scripts, `start.sh` (installs every dependency and starts the app on a fresh clone), `deploy/setup-ec2.sh` (one-time server setup) and `deploy/deploy.sh` (deploys from your laptop), and gives step by step instructions that end with the app starting on boot. See 07.02 for what each script does. | 2 |
| 11 | **Writing Quality** | At least 900 words, not counting the Summary of changes, with no placeholder text (such as "TBD") or text left over from the example. | 2 |
| 12 | **Feasibility & Scope** | Every feature beyond the minimum requirements is labeled core or stretch, and every core feature appears in a checkpoint. | 2 |

#### Letter Grade

The points convert to a letter using the course grading scheme:

| Points      | Grade |
|-------------|-------|
| 38 to 40    | A     |
| 36 to 37    | A-    |
| 35          | B+    |
| 34          | B     |
| 32 to 33    | B-    |
| 31          | C+    |
| 30          | C     |
| 28 to 29    | C-    |
| 27          | D+    |
| 26          | D     |
| 24 to 25    | D-    |
| 23 or fewer | F     |

## Rubric

| n | description | points |
| --- | --- | --- |
| 1 | R1 Summary of changes: The last section of the document is titled "Summary of changes" and is 200 to 300 words (or is the Level 7 Unicorn Engineer line, allowed only if the 05.01 comment named nothing to fix). | 4 |
| 2 | R2 Instructor feedback: Every item named in the 05.01 instructor comment is fixed in the document and listed in the Summary of changes. | 6 |
| 3 | R3 Peer feedback: Every criterion either peer reviewer rated "Needs Work" is fixed, or the Summary of changes says why it was not changed. If the student did not receive any peer reviews, they get the full 4 points. | 4 |
| 4 | 1 Overview & Theme: Names the app and states its theme. If it clones an existing site, links to that site. | 2 |
| 5 | 2 Target Audience: Names a specific audience and describes at least one concrete use case for it. | 2 |
| 6 | 3 Functionality: Lists the features, including at least one form that creates, one that updates and one that deletes data, and a conditional search or filter page. | 2 |
| 7 | 4 Database Schema: Lists every table with its fields and types, and every feature that stores data has a table to store it in. | 2 |
| 8 | 5 Tech Stack Details: Names the backend language, backend framework, database, frontend templates and frontend styling framework. | 2 |
| 9 | 6 Media Plan: Lists the media the app needs and where each comes from. | 2 |
| 10 | 7 Wireframes: There is a wireframe image for every planned page (at least 7), showing layout and navigation. | 2 |
| 11 | 8 Schedule / Checkpoints: Exactly 7 checkpoints, and each one names at least one deliverable that can be demonstrated: a specific page, form, feature, script or test. A label alone ("Styling", "Testing", "Polish", "Backend work") is not a deliverable. | 4 |
| 12 | 9 Testing Strategy: Names the automated testing tool and what will be tested. | 2 |
| 13 | 10 Install & Run Instructions: Describes the three required scripts, start.sh (installs every dependency and starts the app on a fresh clone), deploy/setup-ec2.sh (one-time server setup) and deploy/deploy.sh (deploys from your laptop), and gives step by step instructions that end with the app starting on boot. | 2 |
| 14 | 11 Writing Quality: At least 900 words, not counting the Summary of changes, with no placeholder text (such as "TBD") or text left over from the example. | 2 |
| 15 | 12 Feasibility & Scope: Every feature beyond the minimum requirements is labeled core or stretch, and every core feature appears in a checkpoint. | 2 |
