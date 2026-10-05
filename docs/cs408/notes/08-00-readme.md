# 08.00 README

## Overview

For the rest of the semester you build the application you described in your approved specification
(06.02). The work is split into **seven weekly checkpoints**, and each one delivers exactly what
your specification's schedule promised for that week. Checkpoints are how I see your progress and
how your classmates learn from each other's projects, so steady weekly work matters more than a big
push at the end.

::: danger
**Three rules apply to every checkpoint:**

1. **Two days of grace, then no late submissions.** A checkpoint may be posted up to two days after
    its due date with no penalty. After that it cannot be made up.
2. **Your GitHub repository must be public.** If I cannot clone it, your own work on that
    checkpoint earns a 0, with no redo. Your peer reviews still earn their points.
3. **Your specification must be approved.** Until 06.02 is approved, every checkpoint you miss
    earns a 0.
:::

## Before Checkpoint 1

- Your repository is on GitHub and **public**. Test it by opening it in a private or incognito
  browser window, where you are not logged in.
- Your repository has a working `start.sh` at its root (07.02). I grade every checkpoint by cloning
  your repository at its tag and running `./start.sh`, so it must install every dependency and start
  the app on a fresh clone. If it does not, that checkpoint's Progress score drops one level.
- Your app is running on your EC2 server, even if it is only the landing page. Deploying early means
  deployment problems show up now, not in the last week.
- You know the deliverables your approved specification lists for each checkpoint. Those are what
  you report on and are graded against.

## What every checkpoint needs

1. **A tag.** Tag the commit you are submitting `cp1` for Checkpoint 1, `cp2` for Checkpoint 2, and
    so on, and push it.
2. **A live app.** That code is deployed on EC2 and still running the morning after the due date.
    **The tag, the deployed app, and what your post and video show MUST all match.** A deliverable
    that is not both in the repository at the tag and working on your live site does not count as
    Done.
3. **A post that follows the template.** Each checkpoint has a box to copy with your Tag, Live,
    Spec and Diff lines and a Deliverables table. Every deliverable marked Done needs evidence: a
    commit link, a file path or a live URL.
4. **A demo video** of 5 minutes or less, recorded in Panopto, showing your live site and each
    deliverable you marked Done.
5. **Two peer reviews**, posted as replies to two classmates' posts that do not already have two
    reviews.

The [example post](./final-project-checkpoint-example-post.md) shows a complete post and a complete
peer review.

## Peer reviews

After you post, review **two** classmates. Reviews are due by the checkpoint's due date. Post each
review as a reply to their checkpoint post, and choose students whose posts do not already have two
reviews, so every post gets reviewed. Each review uses four headings: Commits match the claims, On
track, Spec assessment, and Good things. The checkpoint instructions spell out what each heading
needs.

## Schedule

Each checkpoint's due date is on the checkpoint itself. Your post and both peer reviews are due by
that date.

| Checkpoint                                                         | Tag   |
|--------------------------------------------------------------------|-------|
| [Checkpoint 1](../discussions/08-01-final-project-checkpoint-1.md) | `cp1` |
| [Checkpoint 2](../discussions/09-01-final-project-checkpoint-2.md) | `cp2` |
| [Checkpoint 3](../discussions/10-01-final-project-checkpoint-3.md) | `cp3` |
| [Checkpoint 4](../discussions/11-01-final-project-checkpoint-4.md) | `cp4` |
| [Checkpoint 5](../discussions/12-01-final-project-checkpoint-5.md) | `cp5` |
| [Checkpoint 6](../discussions/13-01-final-project-checkpoint-6.md) | `cp6` |
| [Checkpoint 7](../discussions/14-01-final-project-checkpoint-7.md) | `cp7` |

## Grading

Every checkpoint is worth 50 points and is graded against the same checklist, which is in each
checkpoint's instructions and rubric: Tag (5), Live on EC2 (5), Progress against your specification
(10), Demo video (10), and each peer review (10). There is no judgment call about how good the work
looks; each item either meets its rule or it does not.

## Tips

- Commit small and often with messages that say what changed. Your reviewers check that your commits
  match your claims.
- If a deliverable is only partly done, mark it Partial. Honest status is fine; claiming Done
  without evidence counts as Not started.
- If your plan needs to change, ask me early. Checkpoints are graded against your approved
  specification.
