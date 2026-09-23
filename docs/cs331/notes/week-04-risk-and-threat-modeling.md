# Week 4: Risk Management and Threat Modeling

**February 1-7 · Reading: 11 pages · Estimated total: 6.5 hours**

## Overview

There is always more that could go wrong than you have money to fix. Risk management is the
discipline of deciding what to fix first, and defending that decision to somebody who wants the
money for something else.

This week has two halves. The first is CyBOK's treatment of risk: what it is, why ratings are
meaningless without a stated scale, and why "eliminate the risk" is not a thing that happens. The
second is threat modelling, the systematic method for finding what could go wrong, so that you
find threats by working through a checklist rather than by happening to think of them at the right
moment.

Lab 2 is the first assignment where you produce a structured artefact instead of prose. It is also
the model for Part C of the midterm.

## Objectives this week

- **[2.1](../objectives.md#tlo-2--modeling-subjects-objects-permissions-trust-boundaries-and-threats)**: 
  Draw a data flow diagram for a described system and mark its trust boundaries.
- **[2.2](../objectives.md#tlo-2--modeling-subjects-objects-permissions-trust-boundaries-and-threats)**: 
  Enumerate threats using STRIDE and record them in a threat table.
- **[2.3](../objectives.md#tlo-2--modeling-subjects-objects-permissions-trust-boundaries-and-threats)**: 
  Assess the likelihood and impact of identified threats using a stated risk method.

## Read

| Source | Sections | Printed pages | Length | Time |
| --- | --- | --- | --- | --- |
| [CyBOK v1.1.0](../docs/CyBOK_v1.1.0.pdf) | §2.2 What is risk? | 20-21 | 1 p | 10 min |
| [CyBOK v1.1.0](../docs/CyBOK_v1.1.0.pdf) | §2.3 Why is risk assessment and management important? | 21-25 | 4 pp | 25 min |
| [CyBOK v1.1.0](../docs/CyBOK_v1.1.0.pdf) | §2.4 What is cyber risk assessment and management? | 25-26 | 1 p | 10 min |
| [CyBOK v1.1.0](../docs/CyBOK_v1.1.0.pdf) | §2.6.1 Component vs. Systems Perspectives | 31-32 | 1 p | 10 min |
| [CyBOK v1.1.0](../docs/CyBOK_v1.1.0.pdf) | §2.6.2 Elements of Risk | 32-33 | 1 p | 15 min |
| [CyBOK v1.1.0](../docs/CyBOK_v1.1.0.pdf) | §2.6.6 Security Metrics | 43-45 | 3 pp | 20 min |

**§2.6.2 is the one to read carefully.** It is the section that says a likelihood or impact rating
means nothing unless you state the scale you are using, and Lab 2 grades you on stating yours.

You are **not** assigned §2.6.3, which surveys a dozen named risk assessment methodologies. Skip it.

## STRIDE

STRIDE is a checklist of six threat categories, one for each security property a system can lose.
You walk it against each part of your diagram.

| Letter | Threat | Property it breaks | The question |
| --- | --- | --- | --- |
| **S** | Spoofing | Authentication | Can something pretend to be something else here? |
| **T** | Tampering | Integrity | Can data be modified in transit or at rest here? |
| **R** | Repudiation | Non-repudiation | Can somebody deny doing this, with no evidence to contradict them? |
| **I** | Information disclosure | Confidentiality | Can data reach somebody not entitled to it? |
| **D** | Denial of service | Availability | Can this be made unavailable? |
| **E** | Elevation of privilege | Authorisation | Can somebody gain capabilities they were not granted? |

The value of a checklist is that it finds the threats you would not have thought of. Most of the 36
combinations of six categories against six components produce nothing, and working through the
empty ones is what makes you confident about the ones that are not empty.

## Worked example

Take one component out of [SnapVault](../data/photoshare-system.md) (the photo storage bucket) and walk STRIDE against it.

The relevant facts from the description: *"The CDN serves image files directly out of the object
storage bucket. The bucket is configured to allow public reads of any object... Privacy is enforced
by the API deciding which URLs to put in a response, the file itself is reachable by anyone who
knows or guesses its URL."*

| STRIDE | Threat | Traced to |
| --- | --- | --- |
| **S** | The thumbnail worker and the API share one access key, so nothing distinguishes them; a compromise of either is indistinguishable from the other in any log. | *"The same key is also used by the API server, because it was copied over during setup."* |
| **T** | That key has **write** access to the whole bucket, so an attacker holding it can replace any user's photo with any content. | *"That key has read and write access to the entire bucket."* |
| **R** | Because the key is shared, no action taken with it can be attributed to a particular component. | Same sentence. |
| **I** | Any object is readable by anyone who has or guesses the URL, so a private photo is protected only by the secrecy of its filename. | *"The bucket is configured to allow public reads of any object."* |
| **D** | Write access to the whole bucket means an attacker can delete every photo the service holds. | *"read and write access to the entire bucket"* |
| **E** | The key is stored in a file on the worker's VM; anyone who reaches that VM gains the API's own storage privileges. | *"a long-lived access key stored in a file on its VM"* |

Six categories, six threats, every one traced to a sentence. That last column is what separates
threat modelling from guessing, and it is what Lab 2 weights most heavily.

Notice what the walk revealed: **the single most serious problem here is not the public bucket, it
is the shared key.** The public read setting was the thing the description drew attention to, but
walking the checklist surfaced that one credential produces threats in all six categories. That is
the checklist earning its keep.

### Rating them

Now take the **I** row and rate it. Before rating anything, state the scale:

> **Likelihood.** High = an attacker needs no special access and no unusual skill. Medium = needs
> one of the two. Low = needs both, or needs something they are unlikely to get.
>
> **Impact.** High = affects all users or the data cannot be recovered. Medium = affects many users
> or is expensive to recover from. Low = affects few users and is recoverable.

**Information disclosure via guessable object URLs: likelihood Medium, impact High.**

Likelihood is Medium rather than High because the file names are random, so an attacker cannot
simply enumerate them, but URLs leak constantly through referrer headers, browser history, shared
links, and CDN logs, and there is no re-check when they do. Impact is High because it affects every
private photo in the service and the exposure is not something you can undo after the fact.

That paragraph is what a justification looks like. It names what makes the rating what it is, and
somebody who disagrees can point at the sentence they disagree with.

## Do this week

| | Task | Points | Due |
| --- | --- | ---: | --- |
| 1 | [Lab 2: Threat Model a Small System](../assignments/lab-02-threat-model.md) | 38 | Sunday |

No quiz and no discussion. Read [photoshare-system.md](../data/photoshare-system.md) end to end
before you start diagramming, the whole lab depends on facts scattered through it.

## Key terms

| Term | Short form |
| --- | --- |
| **Asset** | Something of value worth protecting. |
| **Trust boundary** | Where data crosses between things controlled by different parties, or between levels of privilege. |
| **Data flow diagram** | External entities, processes, data stores, and the flows between them. |
| **STRIDE** | Spoofing, Tampering, Repudiation, Information disclosure, Denial of service, Elevation of privilege. |
| **Likelihood** | How probable an unwanted incident is. Meaningless without a stated scale. |
| **Impact** | How much harm it would do. Same caveat. |
| **Residual risk** | What is left after controls are applied. Never zero. |
| **Component vs. systems perspective** | Assessing parts in isolation vs. assessing what emerges when they are connected. |

## Time estimate

| Activity | Time |
| --- | --- |
| Reading (11 pages) | 1 hr 30 min |
| This module page and the worked example | 35 min |
| Reading the SnapVault description | 15 min |
| Lab 2 | 1 hr 25 min |
| Review and slack | 2 hrs 30 min |
| **Total** | **~6.5 hrs** |

## Looking ahead

Weeks 5 and 6 are the two halves of access control. Week 5 is authentication, proving who you are.
Week 6 is authorisation, deciding what you may then do. They are different problems and systems
routinely confuse them.
