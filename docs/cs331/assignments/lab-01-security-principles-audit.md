# 2.02 Lab 1: Security Principles Audit

**Week 2 · 38 points · about 90 minutes · submit in Canvas**

## Goal

Take a system you use all the time, and hold it up against the eight design principles Saltzer and
Schroeder wrote down in 1975. Those principles are still the closest thing security has to a set of
rules of thumb, and this course will keep coming back to them.

No code. This is a reading-and-writing lab.

## Objectives assessed

- **1.3**: Apply the Saltzer and Schroeder design principles to critique a familiar system.
- **1.4**: Explain how human error and usability failures contribute to security incidents.
- **5.4**: Apply fail-safe defaults and complete mediation when critiquing a system design.

([TLO 1](../objectives.md#tlo-1--security-goals-terminology-principles-ethics-and-regulation) ·
[TLO 5](../objectives.md#tlo-5--applying-authentication-authorization-and-secure-design-principles))

## Time estimate

| Step | Time |
| --- | --- |
| Step 1: pick a system and describe it | 15 min |
| Step 2: work through the eight principles | 45 min |
| Step 3: pick two failures and go deeper | 25 min |
| **Total** | **85 min** |

## Before you start

Read, if you have not already:

- CyBOK §1.4 (printed pages 9-13), especially **§1.4.1 Saltzer and Schroeder Principles**.
- CyBOK §4.3 **Human Error** (printed pages 158-161).
- Saltzer and Schroeder, *The Protection of Information in Computer Systems* (1975), section I, 
  <https://web.mit.edu/Saltzer/www/publications/protection/>. You only need the numbered list of
  principles and the paragraph explaining each; skip the rest of the paper.

### The eight principles, for reference

| Principle | The short version |
| --- | --- |
| **Economy of mechanism** | Keep the protection mechanism small and simple enough to be checked. |
| **Fail-safe defaults** | Deny by default. Access should be granted by explicit permission, not withheld by explicit exclusion. |
| **Complete mediation** | Check every access to every object, every time, not just the first time. |
| **Open design** | Security must not depend on the design being secret. |
| **Separation of privilege** | Require more than one condition before granting access. |
| **Least privilege** | Every user and every program gets the minimum access needed to do its job. |
| **Least common mechanism** | Minimise what is shared between users, because shared things become channels. |
| **Psychological acceptability** | If the protection is painful to use, people will route around it. |

## Steps

### Step 1: Pick a system and describe it

Pick **one** system you personally use and understand from the outside. Good choices:

- Boise State's single sign-on and the Duo prompt attached to it
- The lock screen and app permissions on your phone
- A banking or payment app you use
- A smart doorbell, thermostat, or camera in your home
- The card reader on a building or parking garage you have access to
- A game platform account with two-factor authentication and a friends list

Do not pick something you have only read about. You need to be able to say what actually happens
when you use it.

Write a short description (roughly 200 words) covering:

1. **Who the subjects are**: the people and programs that ask for access.
2. **What the objects are**: the things being protected.
3. **Where the trust boundary is**: the line between the part of the system you control and the
   part somebody else controls. Say who is on each side.

You do not need internal details you cannot know. Say so when you are guessing.

### Step 2: Work through all eight principles

For **each** of the eight principles, write a short paragraph (3-5 sentences) answering:

- **Does this system follow the principle, violate it, or is it impossible to tell from outside?**
  All three are acceptable answers. "Impossible to tell from outside" is a real finding, and open
  design is exactly the principle that says it should not be.
- **What specific, observable behaviour makes you say that?** Point at something concrete: a
  default setting, a prompt you get or do not get, a permission you were granted without asking.

Two of the eight need extra care, because they are the ones this course grades hardest:

- **Fail-safe defaults.** What happens *by default*, before anybody changes a setting? If a new
  account, a new device, or a new file starts out visible or permitted, that is a fail-safe defaults
  problem, no matter how good the settings screen is.
- **Complete mediation.** Is your access re-checked, or checked once and remembered? A session that
  lasts ninety days is not complete mediation. Neither is a share link that keeps working after you
  are removed from a group.

### Step 3: Two failures, in depth

Choose the **two** principles where this system does worst. For each one, write about 150 words:

1. **What could go wrong because of it.** Describe a specific, plausible sequence of events, who
   does what, in what order, and what they end up with. Not "an attacker could get in", but the
   actual path.
2. **What it would cost to fix.** Fixing a principle violation is never free; it costs money,
   engineering time, or user convenience. Say which, and say who would object.
3. **For at least one of the two, connect it to human behaviour.** Using CyBOK §4.3, explain how a
   normal person doing a reasonable thing makes this failure more likely, or how the fix would run
   into psychological acceptability and get worked around.

## What to submit

One text entry or one attached document in Canvas containing Steps 1, 2, and 3, clearly labelled.
Roughly 1,000-1,400 words total. Cite CyBOK by section number wherever you use it.

## Rubric

| Row | What is assessed | Points |
| --- | --- | ---: |
| 1 | System description names subjects, objects, and a trust boundary, with the sides identified | 6 |
| 2 | All eight principles addressed, each with a verdict and specific observable evidence; fail-safe defaults and complete mediation addressed correctly | 16 |
| 3 | Two failures analysed in depth with a concrete attack path, an honest cost of fixing, and at least one connected to human error or psychological acceptability | 10 |
| 4 | Writing is clear and specific rather than generic; CyBOK cited by section number | 6 |
| | **Total** | **38** |

**What loses points in row 2:** answering only some of the eight, or writing something that would
be true of any system ("they should use encryption"). The evidence has to be about *this* system.

## AI disclosure

You may use AI tools on this assignment. If you do, add one or two sentences saying which tool and
what for, per the [AI policy](../index.md#ai-policy).

A caution specific to this lab: an AI tool does not know what happens when *you* log into *your*
bank. Generic principle-by-principle text is easy to spot and scores badly in row 4 regardless of
who or what wrote it.
