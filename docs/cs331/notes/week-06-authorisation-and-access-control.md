# Week 6: Authorisation, Access Control, and Accountability

**February 15-21 · Presidents' Day is Monday, February 15 · Reading: 13 pages · Estimated total: 6.5 hours**

## Overview

Last week the system worked out who you are. This week it decides what you may do about it.

The core idea is old and simple: write down, for every subject and every object, what that subject
may do to that object. That is an access control matrix, and it is the most direct way to express
a policy. Almost no system stores it that way, and the reasons why produce the two shapes real
systems actually use (access control lists and capability lists), plus the shape most enterprises
have settled on, role-based access control.

The week ends with the part people skip: accountability. Knowing what somebody was allowed to do is
not the same as knowing what they did.

## Objectives this week

- **[2.4](../objectives.md#tlo-2--modeling-subjects-objects-permissions-trust-boundaries-and-threats)**: 
  Construct an access control matrix for a given set of subjects, objects, and permissions.
- **[2.5](../objectives.md#tlo-2--modeling-subjects-objects-permissions-trust-boundaries-and-threats)**: 
  Express a policy as an ACL, a capability list, and an RBAC assignment, and state the tradeoffs.
- **[5.3](../objectives.md#tlo-5--applying-authentication-authorization-and-secure-design-principles)**: 
  Apply least privilege and separation of privilege to reduce an over-broad permission assignment.

## Read

| Source | Sections | Printed pages | Length | Time |
| --- | --- | --- | --- | --- |
| [CyBOK v1.1.0](../docs/CyBOK_v1.1.0.pdf) | §14.1-14.2 Introduction and Content | 466-467 | 1 p | 5 min |
| [CyBOK v1.1.0](../docs/CyBOK_v1.1.0.pdf) | §14.3.1 Access Control: core concepts, policies, RBAC, ABAC | 467-472 | 5 pp | 40 min |
| [CyBOK v1.1.0](../docs/CyBOK_v1.1.0.pdf) | §14.3.2 Enforcing Access Control: delegation, revocation, reference monitors | 472-474 | 2 pp | 20 min |
| [CyBOK v1.1.0](../docs/CyBOK_v1.1.0.pdf) | §14.3.3 Theory: security models, enforceable policies | 474-475 | 1 p | 10 min |
| [CyBOK v1.1.0](../docs/CyBOK_v1.1.0.pdf) | §14.6 Accountability | 489-493 | 4 pp | 30 min |

## The three shapes

Start with a matrix: subjects down the side, objects across the top, rights in the cells.

|  | `report.pdf` | `payroll.db` | `/var/log/app.log` |
| --- | --- | --- | --- |
| **alice** | r w | r w d | r |
| **bob** | r | - | - |
| **backup-service** | r | r | r |

Nobody stores this. A real system has millions of objects and thousands of subjects, and the matrix
is overwhelmingly empty. So it gets sliced, one way or the other:

**An access control list slices by column.** Each object carries the list of subjects who may touch
it. `payroll.db` carries `alice: rwd, backup-service: r`. This is how file permissions work.

**A capability list slices by row.** Each subject carries the list of objects it may touch. Bob
holds `report.pdf: r`. This is how a bearer token, an API key, or a share link works, possession
of the capability *is* the authorisation.

Neither is better. They make different questions cheap:

| Question | ACL | Capability list |
| --- | --- | --- |
| "Who can read `payroll.db`?" | Easy: read the object's list | Hard: check every subject |
| "What can `backup-service` reach?" | Hard: check every object | Easy: read the subject's list |
| "Revoke bob's access to everything" | Hard: visit every object | Easy: take the capability away |
| "Revoke everyone's access to this object" | Easy: clear the list | Hard: find every copy of the capability |

That last row is the one that matters most in practice, and it explains something from
[SnapVault](../data/photoshare-system.md): **a share link is a capability**. It is a token that
grants access to whoever holds it. Revoking it means finding and invalidating every copy, and
SnapVault's tokens do not expire and there is no record of how many times a link has been opened.
Removing a friend from an album is an ACL edit and it is easy. Un-sharing a share link is a
capability revocation and it is hard.

**RBAC** adds a layer in between: subjects get roles, roles hold permissions. It scales
administration enormously (a new employee gets a role rather than four hundred individual
grants), and it loses precision. Any distinction your matrix could express that does not
correspond to a role has to become a new role, and organisations end up with thousands of them.

## Worked example

Take three subjects and three objects from SnapVault, using facts from the description:

|  | Private album | Photo storage bucket | Access log |
| --- | --- | --- | --- |
| **Registered user (own albums)** | r w d g | - *(no direct access; only through the API)* | - |
| **Support staff (shared admin login)** | r w d | ? | ? |
| **Thumbnail worker** | - | r w *(entire bucket)* | - |

Two observations, and they are the kind Lab 3 asks for.

**The `?` cells are a finding.** The description says support staff can "view any album including
private ones" and "delete accounts", but says nothing about whether they can reach the storage
bucket directly or read the access logs. An honest `?` is worth more than a confident guess,
because *an access control policy nobody wrote down is a policy nobody can check.*

**The thumbnail worker's row is the problem.** Its job is: take a newly uploaded photo, make a
thumbnail, write the thumbnail back. That job needs read on new uploads and write on thumbnails.
It has read *and write* on **every object in the bucket**, forever.

### Reducing it

**State the excess precisely.** The worker can read every photo any user has ever uploaded,
including private ones, and can overwrite or delete any of them. Its job requires reading one
photo at a time, recently uploaded, and writing one thumbnail.

**Write the reduced permission.** A credential scoped to read objects under the upload prefix and
write objects under the thumbnail prefix, issued per job and expiring in minutes rather than
living in a file forever.

**Name the principle, carefully.** This is **least privilege**: one subject, one credential, too
much scope. Now the second problem in the same sentence of the description: *"The same key is also
used by the API server."* One credential serving two components is a different failure. It defeats
attribution (no log can distinguish the worker's actions from the API's), which makes it an
**accountability** failure under §14.6, and giving two components one identity is arguably a
**separation of privilege** failure too, since compromising either yields both.

Students routinely name "least privilege" for all of it. The precision is the point:

- **Least privilege**: one subject, too much access. *How much.*
- **Separation of privilege**: one condition where there should be two. *How many.*
- **Accountability**: actions cannot be attributed to an actor. *Who did it.*

**Say what breaks.** Per-job scoped credentials mean the worker needs something to issue them, which
is new infrastructure the three-person company does not have. Short expiry means a job that stalls
past the window fails and needs retry logic. Both are real costs, and a recommendation that does
not name its cost cannot be evaluated by the person who has to approve it.

### The accountability half

SnapVault's three support staff share one admin login, and the admin console logs only that "admin"
did something.

Using §14.6, ask what the log can establish. It can establish that *an* administrator viewed a
particular album at a particular time. It **cannot** establish which of the three, which means it
cannot support a disciplinary process, cannot answer a customer asking who looked at their photos,
and cannot distinguish a staff member from an attacker who obtained the shared password.

One change fixes most of it: individual accounts with individual credentials, and logging the acting
account. That is not a technical difficulty: it is a decision nobody made.

## Do this week

| | Task | Points | Due |
| --- | --- | ---: | --- |
| 1 | [Lab 3: Access Control Matrix and Least Privilege](../assignments/lab-03-access-control-matrix.md) | 38 | Sunday |

No quiz and no discussion. Presidents' Day is Monday, so the working week is short.

## Key terms

| Term | Short form |
| --- | --- |
| **Subject** | An active entity requesting access, a user, service, or program. |
| **Object** | A passive entity being protected. |
| **Right** | What a subject may do to an object: read, write, delete, grant. |
| **Access control matrix** | Subjects × objects, rights in the cells. The direct form of a policy. |
| **Access control list (ACL)** | The matrix sliced by object. |
| **Capability** | The matrix sliced by subject; possession is authorisation. |
| **RBAC** | Subjects get roles; roles hold permissions. |
| **ABAC** | Decisions computed from attributes of subject, object, and context. |
| **Reference monitor** | The component that mediates every access. Must be tamper-proof, always invoked, and small enough to verify. |
| **Delegation / revocation** | Passing on a right; taking it back. Revocation is the hard one. |
| **Accountability** | Being able to attribute an action to the actor who took it. |

The reference monitor's three requirements are the *complete mediation* and *economy of mechanism*
principles from week 2, stated as engineering criteria.

## Time estimate

| Activity | Time |
| --- | --- |
| Reading (13 pages) | 1 hr 45 min |
| This module page and the worked example | 40 min |
| Lab 3 | 1 hr 30 min |
| Review and slack | 2 hrs 30 min |
| **Total** | **~6.5 hrs** |

## Looking ahead

Weeks 7 and 8 are cryptography. Week 7 is symmetric encryption, and Lab 4 will show you a picture
that is still recognisable after it has been encrypted.
