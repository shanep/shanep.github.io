# 6.02 Lab 3: Access Control Matrix and Least Privilege

**Week 6 · 38 points · about 90 minutes · submit in Canvas**

## Goal

Write down who can do what to which thing, in a form precise enough to argue about. Then convert
that same policy into the three shapes real systems actually store it in, and then cut it down to
least privilege.

No code. This is a modelling lab, and the modelling is the point.

## Objectives assessed

- **2.4**: Construct an access control matrix for a given set of subjects, objects, and
  permissions.
- **2.5**: Express an access control policy as an ACL, a capability list, and an RBAC assignment,
  and state the tradeoffs among them.
- **5.3**: Apply least privilege and separation of privilege to reduce an over-broad permission
  assignment.

([TLO 2](../objectives.md#tlo-2--modeling-subjects-objects-permissions-trust-boundaries-and-threats) ·
[TLO 5](../objectives.md#tlo-5--applying-authentication-authorization-and-secure-design-principles))

## Time estimate

| Step | Time |
| --- | --- |
| Step 1: build the matrix | 25 min |
| Step 2: ACL and capability list | 20 min |
| Step 3: RBAC | 20 min |
| Step 4: cut to least privilege | 25 min |
| **Total** | **90 min** |

## Before you start

- CyBOK §14.3.1 (printed pages 467-472), core concepts, security policies, role-based and
  attribute-based access control.
- CyBOK §14.3.2 (printed pages 472-474), enforcing access control, reference monitors.
- CyBOK §14.6 (printed pages 489-493), accountability.
- The [SnapVault system description](../data/photoshare-system.md), the same system you
  threat-modelled in Lab 2. You will use its actors and its data.

### Vocabulary you need

- **Subject**: an active thing that requests access. A user, a service, a running program.
- **Object**: a passive thing being protected. A file, a record, an album, an API endpoint.
- **Right**: what a subject may do to an object: read, write, delete, grant, and so on.
- **Access control matrix**: a table with one row per subject and one column per object; the cell
  holds the rights that subject has over that object. It is the most direct way to write a policy
  down, and almost nobody stores it that way, for reasons you will find in Step 2.

## Steps

### Step 1: Build the access control matrix

Build a matrix for SnapVault with **these six subjects** as rows:

1. Anonymous visitor
2. Registered user (acting on their own albums)
3. Registered user (acting on someone else's albums)
4. Friend of a user
5. Support staff (the shared admin login)
6. Thumbnail worker

and **these seven objects** as columns:

1. A private album
2. A public album
3. An album shared with named friends
4. A share-link token
5. An account record, including the password hash
6. The photo storage bucket
7. The access log

Fill every one of the 42 cells. Use these rights, or say what you mean if you need another:

`r` read · `w` write / modify · `d` delete · `g` grant access to others · `-` no access

Two rules for filling it in:

- **Write down what the system does today**, not what it should do. That is what makes Step 4
  interesting. Where the
  [SnapVault system description](../data/photoshare-system.md) tells you the answer, use it.
- **Where the description does not say, mark the cell `?` and note it below the table.** An honest
  `?` scores better than a confident guess, and finding the `?`s is a real result, an access
  control policy nobody wrote down is a policy nobody can check.

Below the matrix, write a short paragraph identifying the **two cells that most surprised you** and
saying why.

### Step 2: The same policy as an ACL and as a capability list

The matrix is a table. Real systems store it sliced one way or the other.

- An **access control list** slices it **by column**: each object carries the list of subjects who
  may touch it, and how. This is how file permissions work.
- A **capability list** slices it **by row**: each subject carries a list of the objects it may
  touch, and how. This is how a bearer token or a share link works.

Do both, for **three objects and three subjects** of your choice:

1. Write the **ACL** for "a private album", "the photo storage bucket", and "the access log".
2. Write the **capability list** for "registered user (own albums)", "support staff", and
   "thumbnail worker".

Then answer, in a paragraph each:

- **Which question is easy to answer with an ACL and hard with a capability list?** Give the
  question.
- **Which is easy with a capability list and hard with an ACL?** Give the question.
- SnapVault's **share links are capabilities**. Using what you just wrote, explain why revoking one
  is harder than revoking a friend's access to an album.

### Step 3: The same policy as RBAC

Now express the policy as roles.

1. Define **three to five roles**. Give each a name and one sentence saying what it is for.
2. For each role, list the permissions it holds. A permission is an (object, right) pair.
3. Assign each of the six subjects from Step 1 to one or more roles.

Then answer:

- **What did RBAC make easier?** Point at something specific in your assignment.
- **What did RBAC lose?** Roles are a coarser instrument than a matrix. Find at least one
  distinction your matrix could express that your roles cannot, and say what it is.

### Step 4: Cut it to least privilege

Three of SnapVault's arrangements grant more access than the job requires. From the system
description:

- **The thumbnail worker** authenticates with a key that has read and write access to the entire
  storage bucket, and the API server uses that same key.
- **All three support staff share one admin login** that can read any album and reset any password.
- **The storage bucket allows public reads of any object**, with privacy enforced only by which
  URLs the API hands out.

For **each** of the three:

1. **State the excess precisely.** What can this subject do that its job does not require? Answer
   in terms of specific cells in your Step 1 matrix.
2. **Write the reduced permission.** What exactly should it have instead? Be concrete enough that
   somebody could implement it.
3. **Name the principle.** Is this least privilege, separation of privilege, or both? CyBOK §1.4.1
   and §14.3 give you the definitions; use them precisely, because the two are often confused.
4. **Say what breaks.** Every reduction costs something. Name a specific thing that gets harder or
   slower for a real person once you make the change.

Finally, one paragraph: **the shared admin login also defeats accountability.** Using CyBOK §14.6,
explain what the access log can and cannot establish about staff actions today, and what one change
would fix it.

## What to submit

One Canvas submission containing:

1. The 6 × 7 matrix, your `?` notes, and the two-surprises paragraph.
2. The three ACLs, the three capability lists, and your three answers.
3. The RBAC roles, permissions, assignments, and your two answers.
4. The three least-privilege analyses and the accountability paragraph.

Tables can be markdown, a spreadsheet screenshot, or plain text alignment. Legibility is graded.

## Rubric

| Row | What is assessed | Points |
| --- | --- | ---: |
| 1 | All 42 cells filled with defensible rights; unknowns honestly marked and explained; two surprises identified | 10 |
| 2 | ACLs and capability lists correctly derived from the matrix; the three tradeoff questions answered, including why share links are hard to revoke | 8 |
| 3 | Roles defined with permissions and assignments; both what RBAC gained and what it lost identified with a specific example | 8 |
| 4 | All three excess grants precisely stated and reduced; the correct principle named for each; a real cost named for each; accountability paragraph uses §14.6 correctly | 12 |
| | **Total** | **38** |

**What loses points in row 4:** naming "least privilege" for all three without noticing that the
shared admin login is primarily a separation-of-privilege and accountability failure, and
recommending fixes with no stated cost.

## AI disclosure

You may use AI tools on this assignment. If you do, add one or two sentences saying which tool and
what for, per the [AI policy](../index.md#ai-policy).
