# D5: A Current Security Failure

**Week 15 · 30 points · about 60 minutes · Canvas discussion board**

## Objectives assessed

- **7.5**: Recommend a defensible incident response structured according to NIST SP 800-61r3.
  ([TLO 7](../objectives.md#tlo-7--analyzing-detection-data-and-recommending-a-response))

## Time estimate

| | |
| --- | --- |
| Find and read a source | 15 min |
| Initial post | 30 min |
| Two replies | 15 min |
| **Total** | **60 min** |

## Before you start

- CyBOK §8.7 (printed pages 283-286), incident management: prepare, handle, follow up.
- NIST SP 800-61r3, the incident response life cycle:
  <https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-61r3.pdf>
- You will have written a memo in [Lab 10](../assignments/lab-10-log-analysis-and-incident-memo.md)
  this week. This discussion applies the same structure to a real organisation, and you may reuse
  what you learned there.

## Find an incident

Find **one** publicly reported security incident from the **last twelve months** where enough has
been disclosed to say something about how the organisation *responded*, not only about what
happened to them.

Signals that there is enough material: a published post-incident report, regulatory filings, a
CISA advisory, sworn testimony, or detailed reporting that includes a timeline.

**Check the board first and pick something nobody has taken.**

This is the last discussion of the semester, and it is deliberately the one that asks you to use the
whole course. Pick something you find genuinely interesting.

## Initial post

**Due: Thursday of week 15. About 450-550 words.**

Four labelled parts.

### 1. The timeline

Give a timeline with whatever dates are known: initial compromise, first detection, containment,
public disclosure, recovery. Link your source.

Then state the two numbers that matter most in incident response, or say that they are not known:

- **Dwell time**: how long between initial compromise and detection?
- **Time to containment**: how long between detection and the attacker losing access?

If reporting does not give them, say so and say what would establish them.

### 2. How it was found

**What detected it, and was that detection internal or external?**

A substantial fraction of breaches are discovered by somebody outside the organisation, a
customer, a researcher, a payment processor, a ransom note. If this one was found externally, say
what that tells you about the organisation's monitoring, using CyBOK §8.2 on data sources.

If it was found internally, say **which data source** did it, and whether the alert was acted on
promptly. If there was a missed earlier signal (as there was in the
[week 12 incident report](../data/incident-report.md)), identify it.

### 3. The response, judged against NIST SP 800-61r3

Take the response as reported and lay it against the life cycle. For **each** phase, say what the
organisation did, what it appears to have got right, and what it got wrong or you cannot tell:

- **Preparation**: what was in place beforehand? Backups, a plan, a retainer, logging?
- **Detection and analysis**: covered in part 2; add anything about how they scoped it.
- **Containment, eradication, and recovery**: what did they cut off, and when? How did they decide
  systems were clean?
- **Post-incident activity**: what did they change afterwards, and did they say so publicly?

Be fair. Incident response is done under time pressure with incomplete information by people who
have not slept. Criticise decisions, not the fact that decisions had to be made quickly.

### 4. Two changes

Name **two specific changes** that would have most improved the outcome, and for each:

- Which **phase** it belongs to.
- What it would have changed about the **timeline** in part 1, be concrete about which interval
  gets shorter.
- What it **costs**, and whether an organisation of this size would realistically have had it.

At least one of your two must be about **preparation**, because preparation is the phase that
decides how the other three go, and it is the phase organisations skip.

## Replies

**Due: Sunday of week 15. Two replies, about 150 words each.**

Reply to **two** classmates who chose different incidents. Do one of these:

- **Question a judgement.** If you think they were too harsh or too generous about a decision made
  under pressure, say so and make the case from what the responders knew at the time.
- **Test a recommendation against the timeline.** Would their change actually have shortened the
  interval they claim? Work it through.
- **Connect two incidents.** If their incident and yours share a root cause or a failure mode, name
  it and say what that suggests about the class of problem rather than the individual organisation.

## Rubric

| Row | What is assessed | Points |
| --- | --- | ---: |
| 1 | Initial post: timeline with dwell time and containment time or a stated evidence gap; how it was detected and what that implies about monitoring; all four NIST SP 800-61r3 phases assessed with what is known separated from what is not; two changes, at least one about preparation, each tied to a specific interval in the timeline and each with a stated cost | 18 |
| 2 | Two substantive replies to classmates with different incidents, each questioning a judgement, testing a recommendation against the timeline, or identifying a shared root cause | 12 |
| | **Total** | **30** |

**What loses points in row 1:** treating "they should have had better security" as a change,
recommendations that are not tied to an interval in the timeline, and hindsight criticism that does
not distinguish what responders knew at the time from what came out later.

## Ground rules

The [ground rules from D1](d01-introductions-and-security-mindset.md#ground-rules-for-every-discussion-in-this-course)
apply. In particular: analyse published reporting only, and do not name or blame individual
employees of the organisation, even where reporting does.

## AI disclosure

You may use AI tools. If you do, add a sentence saying which and what for, per the
[AI policy](../index.md#ai-policy).

The same caution as D4: AI tools invent timelines and invent details. Every factual claim in parts
1 and 2 must be supported by your linked source.
