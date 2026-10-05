# Final Project Checkpoint Example Post

This is what a complete checkpoint post looks like, using a made-up project called **Trail Journal**
(a hiking log) at Checkpoint 3. Your post follows the same order: the four lines, the Deliverables
table, then your Panopto video.

## The post

**Tag:** https://github.com/example-student/trail-journal/tree/cp3\
**Live:** http://ec2-203-0-113-25.us-west-2.compute.amazonaws.com/\
**Spec:** https://docs.google.com/document/d/EXAMPLE/edit\
**Diff:** 27 files changed, 1843 insertions(+), 212 deletions(-)

| Deliverable (Checkpoint 3 in my spec) | Status | Evidence |
|----|----|----|
| Trail search page filters trails by difficulty and distance | Done | https://github.com/example-student/trail-journal/commit/3f9c2e1 |
| Add, edit and delete forms for hike log entries | Done | app/routes/hikes.js and http://ec2-203-0-113-25.us-west-2.compute.amazonaws.com/hikes |
| Photo upload on a hike entry | Partial | https://github.com/example-student/trail-journal/commit/a71d04b (upload works, no thumbnails yet) |
| Unit tests for the hike log routes | Not started |  |

*\[Panopto video recorded in the post, 4 minutes 12 seconds: opens the Live link with the address
bar showing, then demonstrates trail search and the add, edit and delete hike forms.\]*

**How this post would be graded:** Tag 5 and Live 5 if the cp3 tag exists and the site loads.
Progress earns 5, not 10: two of the four deliverables are Done with evidence, which is at least
half but not all. Partial and Not started are honest and fine. They just do not count as Done. The
video earns 10 because it shows both Done deliverables on the live site.

## An example peer review

A review is a reply to the classmate's checkpoint post, on a post that does not already have two
reviews, using these four headings.

**Commits match the claims:** Yes. Commit 3f9c2e1 adds the difficulty and distance filters to the
trail search, which matches the first row of the table.

**On track:** Yes. The hike log forms are finished, and photo upload is close. The unit tests for
the hike log routes have not started, so that is the deliverable to watch for Checkpoint 4.

**Spec assessment:** The spec planned search and the hike forms for this checkpoint and both are
done, so progress matches the schedule except for testing, which slipped.

**Good things:** The search keeps its filters in the URL, so a filtered list can be bookmarked. The
delete form asks for confirmation before removing a hike.
