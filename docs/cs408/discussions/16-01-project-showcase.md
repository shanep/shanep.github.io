# 16.01 Project Showcase (4 -6 hrs)

**Week 15 · 200 points**

## Overview

The day has finally arrived for you to show off what you have been working on all semester! Every
part of the showcase is graded against a fixed checklist, so follow the steps below exactly.

## Demo Your Project

1. Tag the commit you are submitting as **final** and push the tag:\
    `git tag -a final -m "Final project"`\
    `git push origin final`
2. Deploy that code to your EC2 server and leave it running. Your tag, your live site and your
    video must all show the same code.
3. Create a new post in this discussion. Copy the lines in the dashed box to the top of it and fill
    them in.
4. Within the post, record your video using Panopto. For instructions, see [Using Panopto in Video
    Discussions](https://talk-boisestate.atlassian.net/wiki/spaces/LTS/pages/2184740902).

::: tip
**Repo:** https://github.com/\<user\>/\<repo\>\
**Tag:** https://github.com/\<user\>/\<repo\>/tree/final\
**Live:** http://\<your EC2 address\>/\
**Spec:** \<link to your approved final specification (06.02) Google Doc\>
:::

::: danger
**If any of the Repo, Tag, Live or Spec links is missing, or your repository is not public, the
showcase earns no credit.** Check your repository in a private or incognito browser window, where
you are not logged in to GitHub.
:::

## The video

Your video must be **15 minutes or less** and show all six of these, in any order:

1. Your features, demonstrated on your Live URL with the browser's address bar visible.
2. A walk-through of your back-end code.
3. A walk-through of your front-end code.
4. How you set up your EC2 server and your database.
5. Your automated tests, run on camera.
6. How your finished app compares with your approved specification: what you delivered, and what
    you changed or dropped.

## Review Your Peers' Projects

Review **two** classmates' showcase posts by the due date. Post each review as a **reply to their
post**.

- Choose a student whose post does not already have two reviews, so every project gets reviewed.
- Your two reviews must be of two different students.

Each review must use these six headings:

1. **📋 Requirements & Functionality:** Did it meet its specification, and does it work? Name at
    least one feature you tried on their live site.
2. **🎨 Visual Design:** Is it visually appealing, with good use of color, layout and typography?
3. **💻 Code Quality:** Is the code clean and well organized? Cite at least one file from their
    repository.
4. **📱 Responsive Design:** How does it look and work on a phone-sized screen and on a desktop?
5. **♿ Usability & Accessibility:** Is it easy to navigate and usable by everyone?
6. **✨ Creativity & Originality:** What stands out about it?

## Finish

You are finished once your post has the four links and your video, and both of your reviews are
posted.

## Grading

Each item is checked against your post, your repository at the `final` tag, and your live site:

| Item | Earns the points when | Points |
|----|----|----|
| **Video** | Six checks, each earning its points or none: your features demonstrated on your Live URL with the address bar visible (10), a walk-through of your back-end code (8), a walk-through of your front-end code (6), how you set up EC2 and your database (6), your automated tests run on camera (6), and how your finished app compares with your approved specification (4). The video must be 15 minutes or less. | 40 |
| **Minimum requirements** | 5 points each, checked on your live site: a landing page with navigation to every page, a shared header and footer, at least 7 distinct pages, a form that creates data, a form that updates data, a form that deletes data, a conditional search page, and styling with a framework like Bootstrap. | 40 |
| **Specification delivered** | The share of the core features in your approved specification (06.02) that work on your live site: all of them 20, at least 75% 15, at least 50% 10, fewer 0. | 20 |
| **start.sh** | A fresh clone of your repository at the `final` tag installs everything and starts with `./start.sh` and no other steps. | 10 |
| **Live matches the repository** | Your Live URL is running the code at the `final` tag. | 10 |
| **Responsive** | At 375 pixels and at 1280 pixels wide, no page scrolls sideways and the navigation works. | 10 |
| **Accessibility** | The Chrome Lighthouse Accessibility score, taking the lower of your landing page and one other page: 90 or higher 20, 80 to 89 15, 70 to 79 10, below 70 0. | 20 |
| **Tests and README** | Your automated tests run with one command written in your README and pass, and your README explains how to set up and run the app. | 10 |
| **Peer review \#1 and \#2** | Each review, 20 points: a reply to a classmate's post that did not already have two reviews, posted by the due date, with all six headings, a feature you tried named under the first and a file cited under the third. 10 if it is posted but a heading, feature or file is missing. 0 if it is not posted by the due date. | 20 each |
|  | **Total** | **200** |

## Rubric

| n | description | points |
| --- | --- | --- |
| 1 | Video: features on the Live URL: The video demonstrates the features on the Live URL with the address bar visible. The video is 15 minutes or less. | 10 |
| 2 | Video: back-end walk-through: The video walks through the back-end code. | 8 |
| 3 | Video: front-end walk-through: The video walks through the front-end code. | 6 |
| 4 | Video: EC2 and database setup: The video explains how the EC2 server and the database are set up. | 6 |
| 5 | Video: tests run on camera: The automated tests are run on camera. | 6 |
| 6 | Video: compared with the spec: The video compares the finished app with the approved specification: what was delivered, changed or dropped. | 4 |
| 7 | Req: landing page: A landing page with navigation to every page. Checked on the live site. | 5 |
| 8 | Req: shared header and footer: Every page has the same header and footer. Checked on the live site. | 5 |
| 9 | Req: 7 or more pages: At least 7 distinct pages. Checked on the live site. | 5 |
| 10 | Req: create form: A form that creates data. Checked on the live site. | 5 |
| 11 | Req: update form: A form that updates data. Checked on the live site. | 5 |
| 12 | Req: delete form: A form that deletes data. Checked on the live site. | 5 |
| 13 | Req: search page: A conditional search page (not a dump of the whole database). Checked on the live site. | 5 |
| 14 | Req: styling framework: Styled with a framework like Bootstrap. Checked on the live site. | 5 |
| 15 | Specification delivered: Share of the core features in the approved specification (06.02) that work on the live site. | 20 |
| 16 | start.sh: A fresh clone at the final tag installs everything and starts with ./start.sh and no other steps. | 10 |
| 17 | Live matches the repository: The Live URL is running the code at the final tag. | 10 |
| 18 | Responsive: At 375 and at 1280 pixels wide, no page scrolls sideways and the navigation works. | 10 |
| 19 | Accessibility (Lighthouse): Chrome Lighthouse Accessibility score, the lower of the landing page and one other page. | 20 |
| 20 | Tests and README: Tests run with one command written in the README and pass, and the README explains how to set up and run the app. | 10 |
| 21 | Peer review #1: A reply to a classmate's post that did not already have two reviews, posted by the due date, with all six headings, a feature tried on their live site named under the first and a file cited under the third. The two reviews must be of two different students. | 20 |
| 22 | Peer review #2: A reply to a classmate's post that did not already have two reviews, posted by the due date, with all six headings, a feature tried on their live site named under the first and a file cited under the third. The two reviews must be of two different students. | 20 |
