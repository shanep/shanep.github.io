# 12.01 Final Project Checkpoint 5

**Week 12 · 50 points**

## Overview

This is Checkpoint 5 of 7 for your final project. See the [example
post](../notes/final-project-checkpoint-example-post.md) for what a complete post looks like. Every
part of this checkpoint is graded against a fixed checklist, so follow the post template exactly.

## Task 1 - Tag and deploy

::: danger
**Your GitHub repository must be public.** I clone every repository to grade it. **If I cannot clone
your repository, your own work on this checkpoint (Tag, Live, Progress and Demo video, 30 points)
earns a 0, and there are no redos.** Your peer reviews still earn their points. Check it before you
post: open your Tag link in a private or incognito browser window, where you are not logged in to
GitHub.
:::

- Your repository must have a working `start.sh` at its root (see 07.02). **I grade by cloning your
  repository at cp5 and running `./start.sh`**, so make sure it installs everything and starts the
  app on a fresh clone. If `./start.sh` does not install everything and start the app on a fresh
  clone of cp5, **Progress drops one level** (10 becomes 5, 5 becomes 0).
- Tag the commit you are submitting as **cp5** and push the tag. Use exactly this name; each
  checkpoint has its own tag.

`git tag -a cp5 -m "Checkpoint 5"`

`git push origin cp5`

- Deploy that code to your EC2 server and leave it running. I check the Live link the morning after
  the due date.

::: danger
**Your checkpoint MUST match in three places:** the code in your repository at the **cp5** tag, the
app deployed on EC2, and what your post and video show. Do not deploy code that is not in the tag,
and do not tag code that is not deployed. A deliverable that is not both in the repository at cp5
and working on your live site does not count as Done.
:::

## Task 2 - Detail your progress

- Run `git diff --shortstat cp4 cp5` and paste its output on the Diff line of the template.
- Copy every deliverable your **approved final specification (06.02)** lists for Checkpoint 5 into
  the Deliverables table. For each one, give its status (Done, Partial or Not started) and its
  evidence: a commit link, a file path in your repo, or a URL on your live site. A deliverable
  marked Done with no evidence, or one that is not both in the repository at cp5 and working on your
  live site, counts as Not started.

## Task 3 - Demo video

1. Within the post, record a video using Panopto.
    - For instructions on how to do this, please refer to the following article: [Using Panopto in
      Video Discussions](https://talk-boisestate.atlassian.net/wiki/spaces/LTS/pages/2184740902).
2. The video must be **5 minutes or less**, open your Live link on EC2 with the browser's address
    bar visible, and show every deliverable you marked Done.

## Post template

Copy everything inside the dashed box, paste it at the top of your reply, and replace the text in
angle brackets. The table keeps its formatting when pasted; add a row for each deliverable. See the
[example post](../notes/final-project-checkpoint-example-post.md) for a filled-in version.

::: tip
**Tag:** https://github.com/\<user\>/\<repo\>/tree/cp5\
**Live:** http://\<your EC2 address\>/\
**Spec:** \<link to your Google Doc\>\
**Diff:** \<output of git diff --shortstat cp4 cp5\>

| Deliverable (Checkpoint 5 in my spec) | Status | Evidence |
|----|----|----|
| \<deliverable\> | \<Done, Partial or Not started\> | \<commit link, file path or live URL\> |
| \<deliverable\> | \<Done, Partial or Not started\> | \<commit link, file path or live URL\> |
| \<deliverable\> | \<Done, Partial or Not started\> | \<commit link, file path or live URL\> |
:::

Then record your Panopto video in the same reply (Task 3).

## Task 4 - Peer reviews

Review **two** classmates' checkpoint posts by **this checkpoint's due date**. Post each review as a
**reply to their post** in this discussion.

- Choose a student whose post does not already have two reviews. Count the review replies under a
  post before you start, so every post gets reviewed and nobody gets five.
- Your two reviews must be of two different students, and not of yourself.

Each review must use these four headings:

1. **Commits match the claims:** Yes or No, citing at least one of their commits (a hash or a
    link).
2. **On track:** Yes or No, naming at least one deliverable from their table.
3. **Spec assessment:** how their progress compares with their specification's schedule.
4. **Good things:** at least two specific things they did well.

## Finish

- You are finished when your post follows the template and both of your peer reviews are posted.
- If you did not complete any work, you can still earn the peer review points by reviewing two
  classmates.

## Grading

**If your repository is not public and I cannot clone it, Tag, Live on EC2, Progress and Demo video
all earn 0, with no redo. Peer reviews are graded as usual.**

| Item | Earns the points when | Points |
|----|----|----|
| **Tag** | A tag named cp5 is on GitHub and its commit is dated before the due date. | 5 |
| **Live on EC2** | The Live link loads your app when checked the morning after the due date, and the deployed app matches the code at cp5. | 5 |
| **Progress** | The Diff line and a Deliverables table listing every Checkpoint 5 deliverable from your approved spec are present. 10 points if every deliverable is Done with evidence, 5 if at least half are, 0 if fewer than half are or the Diff line or table is missing. If `./start.sh` does not install everything and start the app on a fresh clone of cp5, **Progress drops one level** (10 becomes 5, 5 becomes 0). | 10 |
| **Demo video** | 5 minutes or less, shows your Live link in the address bar, and shows every deliverable marked Done. | 10 |
| **Peer review \#1 and \#2** | Each review: 10 points if it is posted by this checkpoint's due date and has all four headings, with a commit cited under the first and a deliverable named under the second; 5 if it is complete but a heading, citation or deliverable is missing; 0 if it is not posted by then. | 10 each |

## Rubric

| n | description | points |
| --- | --- | --- |
| 1 | Tag: A tag named for this checkpoint (cp1 for Checkpoint 1 through cp7 for Checkpoint 7) is on GitHub, and its commit is dated before the due date. The repository must be public: if it cannot be cloned, Tag, Live on EC2, Progress and Demo video all earn 0, with no redo. Peer reviews are still graded. | 5 |
| 2 | Live on EC2: The Live link loads the app when checked the morning after the due date, and the deployed app matches the code at this checkpoint's tag. | 5 |
| 3 | Progress: The Diff line and a Deliverables table listing every deliverable the approved final specification (06.02) gives for this checkpoint are present. A deliverable marked Done with no evidence (commit, file path or live URL) counts as Not started. A deliverable counts as Done only if it is both in the repository at this checkpoint's tag and working on the live site. If ./start.sh does not install everything and start the app on a fresh clone of this checkpoint's tag, Progress drops one level (10 becomes 5, 5 becomes 0). | 10 |
| 4 | Demo video: 5 minutes or less, shows the Live link in the address bar, and shows every deliverable marked Done. | 10 |
| 5 | Peer review #1: Posted as a reply to a classmate's checkpoint post by the checkpoint's due date, on a post that did not already have two reviews, and has all four headings (Commits match the claims, On track, Spec assessment, Good things), with at least one commit cited under the first and a deliverable named under the second. The two reviews must be of two different students. | 10 |
| 6 | Peer review #2: Posted as a reply to a classmate's checkpoint post by the checkpoint's due date, on a post that did not already have two reviews, and has all four headings (Commits match the claims, On track, Spec assessment, Good things), with at least one commit cited under the first and a deliverable named under the second. The two reviews must be of two different students. | 10 |
