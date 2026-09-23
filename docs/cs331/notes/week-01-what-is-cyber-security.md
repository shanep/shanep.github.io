# Week 1: What Is Cyber Security?

**January 11-17 · Reading: 7 pages · Estimated total: 5.5 hours**

## Overview

The first week does two things. It gets your tools working, and it gives you the vocabulary the
rest of the semester runs on.

That vocabulary matters more than it sounds like it should. In ordinary speech, *threat*,
*vulnerability*, *attack*, and *risk* are near-synonyms. In this course they are four different
things, and confusing them produces sentences that cannot be acted on. "We have a threat in our
login system" tells an engineer nothing. "Our login system has a vulnerability that an
opportunistic attacker could exploit at low cost, and the impact would be total account takeover"
tells them what to do on Monday.

You are not expected to know any of this already. The diagnostic this week is ungraded and exists
so you can see where you are starting from.

## Objectives this week

- **[1.1](../objectives.md#tlo-1--security-goals-terminology-principles-ethics-and-regulation)**: 
  Define confidentiality, integrity, and availability, and identify which goal a described failure
  violates.
- **[1.2](../objectives.md#tlo-1--security-goals-terminology-principles-ethics-and-regulation)**: 
  Use the terms threat, vulnerability, attack, and risk correctly in writing about a security
  incident.

## Read

| Source | Sections | Printed pages | Length | Time |
| --- | --- | --- | --- | --- |
| [CyBOK v1.1.0](../docs/CyBOK_v1.1.0.pdf) | §1.1 Cyber Security Definition | 2-4 | 3 pp | 15 min |
| [CyBOK v1.1.0](../docs/CyBOK_v1.1.0.pdf) | §1.2 CyBOK Knowledge Areas | 4-6 | 2 pp | 10 min |
| [CyBOK v1.1.0](../docs/CyBOK_v1.1.0.pdf) | §1.3 Deploying CyBOK knowledge: especially §1.3.1-1.3.3 | 6-8 | 2 pp | 20 min |

**Navigating the PDF:** go by section number, not page number. The printed page numbers in the
footer do not match your PDF viewer's counter, the book has 39 pages of front matter. Use your
viewer's search box or the bookmarks panel. See [resources.md](../resources.md) for more.

§1.2 is a map of the whole book. Skim it. You will not read most of what it lists, and
[resources.md](../resources.md) tells you exactly which parts of it this course uses.

## Worked example

Here is the vocabulary applied to one incident, in the form D1 asks you to produce.

> **The incident.** In 2023 a file transfer product used by thousands of organisations was found to
> contain a SQL injection flaw. Attackers exploited it to steal data from hundreds of companies
> before most of them knew the product had a problem.

**The vulnerability.** A SQL injection flaw in the product's web interface: user-supplied input was
built into a database query as text, so input could become command. This is a property of the
software. It existed whether or not anybody ever found it, and it existed before anyone attacked
it.

**The threat.** A financially motivated criminal group with the capability to find and exploit
software flaws at scale, and a business model (extortion) that rewards stealing data from many
organisations at once. The threat is the *potential* cause of harm: the group, its capability, and
its motive.

**The attack.** The group scanned the internet for exposed instances of the product, exploited the
flaw against the ones it found, installed a web shell to keep access, and copied out the data
those instances held. This is what actually happened: a sequence of events in time.

**The risk.** Before this happened, what would a reasonable person have said? The product handled
bulk file transfers, so the impact of compromise was obviously high: that part was knowable in
advance. Likelihood is harder: internet-facing software from a vendor with a history of similar
flaws is a well-known risk category. So: high impact, moderate-to-high likelihood. A risk
assessment that reached that conclusion would have said *do not expose this to the internet*, and
some organisations had.

Notice four things about that example:

1. The vulnerability is a property of a **system**. It is never a person and never an event.
2. The threat exists even when nothing has happened yet.
3. The attack is a **sequence**, described in order.
4. The risk is a judgement made **beforehand**, combining how likely with how bad, and it competes
   with every other risk for the same budget.

### And the three goals

Which of confidentiality, integrity, and availability did that incident break?

**Confidentiality**, clearly: data went to people not entitled to it. **Integrity**? The reporting
does not say the attackers altered anything, so no, and resist the urge to add it. **Availability**?
The files were copied, not deleted; the victims still had them. So: confidentiality only.

Being able to say "no, that one was not violated, and here is why" is as much of the skill as
naming the one that was.

## Do this week

| | Task | Points | Due |
| --- | --- | ---: | --- |
| 1 | [Diagnostic self-check](../quizzes/quiz-00-diagnostic.md): ten questions, ungraded | 0 | Tuesday |
| 2 | [Lab 0: Course Setup and CyBOK Navigation](../assignments/lab-00-course-setup.md) | 20 | Sunday |
| 3 | [D1: Introductions and the Security Mindset](../discussions/d01-introductions-and-security-mindset.md), initial post Thursday, one reply Sunday | 15 | Thu / Sun |

**Do Lab 0 early.** It installs the Python package that weeks 7, 8, and 10 depend on. If something
does not work on your machine, week 1 is when to find out.

## Key terms

From the [CyBOK Glossary](../docs/CyBOK_v1.1.0.pdf) (printed page 951) and §1.3:

| Term | Short form |
| --- | --- |
| **Confidentiality** | Information is not disclosed to those not entitled to it. |
| **Integrity** | Information is not altered except by those entitled to alter it, and alteration is detectable. |
| **Availability** | Information and services are reachable by those entitled to them, when they need them. |
| **Vulnerability** | A weakness in a system that could be exploited. A property of the system. |
| **Threat** | A potential cause of an unwanted incident. |
| **Attack** | A threat carried out: an actual sequence of events. |
| **Risk** | The combination of how likely an unwanted incident is with how much harm it would do. |
| **Asset** | Something of value that is worth protecting. |

## Time estimate

| Activity | Time |
| --- | --- |
| Reading (7 pages) | 45 min |
| This module page and the worked example | 30 min |
| Diagnostic self-check | 20 min |
| Lab 0 | 45 min |
| D1 post and reply | 45 min |
| Review and slack | 2 hrs |
| **Total** | **~5.5 hrs** |

Week 1 is deliberately light. Later weeks run closer to seven hours.

## Looking ahead

Week 2 takes the eight design principles that security has been using since 1975 and asks you to
apply them to something you use every day. Read §1.4 before Monday if you want a head start.
