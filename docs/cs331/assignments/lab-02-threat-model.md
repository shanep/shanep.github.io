# 4.02 Lab 2: Threat Model a Small System

**Week 4 · 38 points · about 90 minutes · submit in Canvas**

## Goal

Take a written description of a real-shaped system and turn it into a threat model: a diagram with
trust boundaries, a table of threats found systematically rather than by inspiration, and a
judgement about which of them matter most.

This is the single most transferable skill in the course. It is also the one that most rewards
being methodical rather than clever.

## Objectives assessed

- **2.1**: Draw a data flow diagram for a described system and mark its trust boundaries.
- **2.2**: Enumerate threats against a system using STRIDE and record them in a threat table.
- **2.3**: Assess the likelihood and impact of identified threats using a stated risk method.

([TLO 2](../objectives.md#tlo-2--modeling-subjects-objects-permissions-trust-boundaries-and-threats))

## Time estimate

| Step | Time |
| --- | --- |
| Read the system description | 15 min |
| Step 1: data flow diagram | 20 min |
| Step 2: STRIDE table | 35 min |
| Step 3: likelihood and impact | 15 min |
| **Total** | **85 min** |

## Before you start

- Read the [SnapVault system description](../data/photoshare-system.md) all the way through, once, before you start diagramming.
- CyBOK §2.2-2.4 (printed pages 20-26) for what risk is and why it is assessed.
- CyBOK §2.6.1-2.6.2 (printed pages 31-33) for components versus systems, and the elements of risk.

### STRIDE, for reference

STRIDE is a checklist. You walk it against each part of your diagram, so that you find threats by
being systematic instead of by happening to think of them.

| Letter | Threat | The property it breaks |
| --- | --- | --- |
| **S** | Spoofing: pretending to be someone or something else | Authentication |
| **T** | Tampering: modifying data in transit or at rest | Integrity |
| **R** | Repudiation: denying having done something, with no evidence to contradict | Non-repudiation |
| **I** | Information disclosure: exposing data to someone not entitled to it | Confidentiality |
| **D** | Denial of service: making the system unavailable | Availability |
| **E** | Elevation of privilege: gaining capabilities you were not granted | Authorisation |

## Steps

### Step 1: Draw the data flow diagram

Draw SnapVault as a data flow diagram. You need four kinds of thing:

- **External entities** (the people and outside systems): rectangles
- **Processes** (things that do work): circles or rounded boxes
- **Data stores** (things that hold data): two parallel lines, or a labelled cylinder
- **Data flows** (who sends what to whom): arrows, labelled with what flows

Then draw **trust boundaries** as dashed lines cutting across the flows. A trust boundary goes
wherever data crosses from something you control to something you do not, or from one level of
privilege to another. In SnapVault there are at least four; find them.

**How to draw it.** Any of these is fine and none scores higher than another:

- Draw it on paper, photograph it, attach the photo.
- Use any diagramming tool you like and export an image.
- Draw it in plain text or ASCII inside your submission.

Legibility is graded. Artistry is not.

### Step 2: Build the STRIDE table

Walk STRIDE against your diagram. For **each trust boundary crossing and each data store**, ask all
six STRIDE questions. Most combinations produce nothing; that is normal and you do not need to
write those down.

Produce a table with **at least twelve threats**, covering **all six STRIDE categories** (so at
least two of each). Columns:

| # | Component or flow | STRIDE | The threat, in one or two sentences | Which fact from the description makes it possible |

That last column is the one that matters most. Every threat you list must trace to something
actually stated in the [SnapVault system description](../data/photoshare-system.md). If you cannot point at the
sentence, you are guessing, and guesses are what threat modelling exists to replace.

Some places worth looking hard at, though this is not a complete list and you should find others:
the object storage bucket's read permissions, the 90-day session tokens, the shared admin login,
the access key that the thumbnail worker and the API both use, the share-link tokens, the photo
metadata, and the fourteen-month-old dependencies.

### Step 3: Likelihood and impact

Take the **six** threats you judge most serious. For each, assign:

- **Likelihood:** High / Medium / Low
- **Impact:** High / Medium / Low
- **Two sentences of justification** for each rating.

State the method you used before the table, one or two sentences on what "High likelihood" means
to you here (an attacker needs no special access? no special skill? it has already happened to
similar services?). CyBOK §2.6.2 is deliberately clear that these ratings are only meaningful if
the scale is stated, so state yours.

Then answer one question in a short paragraph: **which of these six would you fix first, and why?**
Highest risk is a defensible answer. So is "the cheapest one, because it is nearly free and buys
time to do the rest." What is not defensible is not saying why.

## What to submit

One Canvas submission containing:

1. Your data flow diagram (image, attachment, or text drawing).
2. Your STRIDE table, at least 12 threats, all six categories represented.
3. Your likelihood-and-impact table for six threats, your stated rating method, and your
   "fix first" paragraph.

## Rubric

| Row | What is assessed | Points |
| --- | --- | ---: |
| 1 | Data flow diagram is legible, uses the four element types correctly, and marks at least four trust boundaries in defensible places | 10 |
| 2 | At least 12 threats; all six STRIDE categories represented; each threat traced to a specific fact in the system description | 14 |
| 3 | Six threats rated for likelihood and impact, with a stated rating method and two-sentence justifications | 8 |
| 4 | "Fix first" argument is stated and reasoned, not just asserted | 6 |
| | **Total** | **38** |

**What loses points in row 2:** generic threats that could apply to any web application, and
threats with no traceable source in the description.

## AI disclosure

You may use AI tools on this assignment. If you do, add one or two sentences saying which tool and
what for, per the [AI policy](../index.md#ai-policy).

AI tools are genuinely good at generating STRIDE tables and genuinely bad at the last column, 
tracing each threat to a specific sentence in a specific document. That column is worth the most
points here.
