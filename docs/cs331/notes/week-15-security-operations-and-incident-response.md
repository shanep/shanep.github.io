# Week 15: Security Operations, Detection, and Incident Response

**April 26-30 · Reading: 11 pages · Estimated total: 7 hours**

## Overview

Last week of instruction, and the one that ties the semester together.

Everything so far has been about making things go right. This week is about what you do once
something has already gone wrong: what your logs can and cannot tell you, how detection gets built
and why it fails, and how to write the memo that somebody has to act on at two in the morning.

There is one piece of arithmetic in this week, and it is the most important number in the course.
It explains the thing you have now seen twice, a correct alert about a real intrusion, sitting
unread in a queue, seven days before the ransomware.

## Objectives this week

- **[7.1](../objectives.md#tlo-7--analyzing-detection-data-and-recommending-a-response)**: Identify
  the data sources a detection capability draws on and what each can and cannot show.
- **[7.2](../objectives.md#tlo-7--analyzing-detection-data-and-recommending-a-response)**: 
  Distinguish misuse detection from anomaly detection and choose one for a stated scenario.
- **[7.3](../objectives.md#tlo-7--analyzing-detection-data-and-recommending-a-response)**: Analyze
  authentication and web server logs to identify brute-force and scanning activity.
- **[7.4](../objectives.md#tlo-7--analyzing-detection-data-and-recommending-a-response)**: Explain
  the base-rate fallacy and its effect on alert volume.
- **[7.5](../objectives.md#tlo-7--analyzing-detection-data-and-recommending-a-response)**: 
  Recommend a defensible incident response structured according to NIST SP 800-61r3.

## Read

| Source | Sections | Printed pages | Length | Time |
| --- | --- | --- | --- | --- |
| [CyBOK v1.1.0](../docs/CyBOK_v1.1.0.pdf) | §8.1 Fundamental concepts: workflows and vocabulary | 253-256 | 3 pp | 20 min |
| [CyBOK v1.1.0](../docs/CyBOK_v1.1.0.pdf) | §8.2 Monitor: data sources *(skim)* | 256-263 | 7 pp | 20 min |
| [CyBOK v1.1.0](../docs/CyBOK_v1.1.0.pdf) | §8.3.1-8.3.3 Misuse detection, anomaly detection, blended | 264-268 | 4 pp | 30 min |
| [CyBOK v1.1.0](../docs/CyBOK_v1.1.0.pdf) | §8.3.6 The base-rate fallacy | 270 | 1 p | 15 min |
| [CyBOK v1.1.0](../docs/CyBOK_v1.1.0.pdf) | §8.7 Human factors: Incident management | 283-286 | 3 pp | 25 min |
| NIST SP 800-61r3 | The incident response life cycle *(skim)* |: | skim | 20 min |

NIST SP 800-61r3 (April 2025):
<https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-61r3.pdf>

**§8.3.6 is one page and it is the most important page of the week.**

## Worked example

Open [data/auth.log](../data/auth.log) and [data/web_access.log](../data/web_access.log). This
section walks the method; Lab 10 asks you to do it properly.

### 1. Start by counting, not reading

569 lines of authentication log is too many to read and trivial to count. Almost every log
investigation starts by grouping and counting:

```
grep -oE 'from [0-9.]+' auth.log | sort | uniq -c | sort -rn | head
```

```
 349 from 203.0.113.47
  28 from 10.12.4.44
  24 from 10.12.9.8
  24 from 10.12.4.31
```

Three internal addresses with a couple of dozen events each, and one external address with 349.
You have found the interesting thing in about fifteen seconds without reading a line.

Now look at what that address was doing:

```
grep -c "Failed password.*203.0.113.47" auth.log      # 184
grep "Accepted password" auth.log
```

184 failed authentications over about ten minutes, cycling through `root`, `admin`, `oracle`,
`test`, `postgres`, `ubuntu`, `git`, `jenkins`, `deploy`. That username list tells you something:
it is a generic list, not an organisation-specific one. Nobody researched this target.

**And then the line that changes everything:**

```
Apr 21 03:27:27 vault-api-01 sshd[6485]: Accepted password for deploy from 203.0.113.47 port 51884 ssh2
```

One of the guesses worked. This is no longer a failed brute-force in a log full of internet
background noise; it is an intrusion. Everything after that timestamp is the intruder, and the
three lines that follow (`sudo cat /etc/shadow`, a service status check, and a session lasting
twenty minutes) are what they did with it.

**Method to take away: count first, then read only what the counting pointed at, then read
everything after the moment it succeeded.**

### 2. What the logs cannot tell you

Objective 7.1 is as much about limits as about findings.

`auth.log` can tell you which account authenticated, from which address, by which method, and when.
It **cannot** tell you what the intruder did once they had a shell: that needs process auditing or
command logging, neither of which is here. It cannot tell you whether the credential was guessed or
already known. And it cannot be fully trusted at all, because the intruder used `sudo` and could
have edited it, which is why §8.2.6 emphasises shipping logs off the host as they are written.

`web_access.log` can tell you which paths were requested, from where, with what result and response
size. It **cannot** tell you what was in a POST body, what the response contained, or whether an
authenticated user was doing something they should not: that needs application logging.

### 3. The two detection models

§8.3 divides detection into two approaches, and the division is the practical one.

**Misuse detection** encodes what bad looks like. *More than 20 failed authentications from one
source address in 5 minutes → alert.* Precise, explainable, cheap, and it catches this brute-force
immediately. It also catches only what you thought to write down: an attacker who tries three
passwords an hour from a different address each time sails past it.

**Anomaly detection** encodes what normal looks like and flags deviation. You would first measure a
baseline (this server sees authentication from three internal addresses, business hours, publickey
only) and then flag departures from it. It would have caught the slow attacker the misuse rule
misses. It would also have flagged the new contractor, the changed backup schedule, and the day
somebody worked from a hotel.

In practice you blend them (§8.3.3): misuse rules for the known and cheap, anomaly detection to
surface the unknown, and the two feeding one queue.

Notice, incidentally, that the intruder's success is visible to a **third** kind of rule that is
neither: *any successful password authentication on a host configured for publickey only.* Legitimate
staff in this log all use `Accepted publickey`. That single rule would have fired on line 371 with a
near-zero false positive rate. **The best detections usually come from knowing your own environment,
not from a better algorithm.**

### 4. The arithmetic

Here is the number that explains the whole course's recurring failure.

Your detector watches authentication on this server. Assume:

- **50,000** authentication events per day
- Genuine intrusion attempts on **1 day in 100**: about **500** malicious events per 100 days
- True positive rate **99%**: it catches almost everything malicious
- False positive rate **1%**: it fires on 1 in 100 benign events

Over 100 days: 5,000,000 events, of which 500 are malicious and 4,999,500 are benign.

```
True positives  = 0.99  ×     500 =     495
False positives = 0.01  × 4,999,500 =  49,995
Total alerts                        =  50,490

Probability an alert is real = 495 / 50,490 = 0.98%
Alerts per day               = 50,490 / 100 ≈ 505
```

**A 99% accurate detector produces a queue in which fewer than one alert in a hundred is real, and
it produces five hundred of them a day.**

Nothing is wrong with the detector. The arithmetic is driven by the **base rate**: malicious events
are 0.01% of the total, so even a very small false positive rate applied to an enormous benign
population swamps the true positives. This is the base-rate fallacy, and §8.3.6 is one page on it
because it takes one page to state and a career to internalise.

Now go back to the [NORTHWIND MEADOW report](../data/incident-report.md): *"The endpoint agent
flagged the PowerShell execution as suspicious and raised a medium alert at 09:26. The alert entered
a queue that averaged 400 medium alerts per day. It was not reviewed."*

The alert was correct. The sensor worked. The analyst did not read it, because reading five hundred
alerts a day to find five real ones is not a thing a person can do. **The failure was not in
detection. It was in the arithmetic of the queue.**

### 5. So what do you actually change?

Improving the detector's accuracy is the obvious answer and the weakest one. Going from 99% to
99.9% true positive rate barely moves the ratio; the false positive rate is what dominates, and
driving it from 1% to 0.1% still leaves about 5,000 false positives to 495 true ones.

The moves that work change something other than accuracy:

- **Raise the base rate.** Do not run the detector against everything. Run it against the population
  where malicious events are concentrated, administrative accounts, servers, off-hours activity.
  Same detector, much better ratio.
- **Require corroboration.** Alert on failed authentications *followed by a success from the same
  source*, rather than on failures alone. Combining two weak signals into one strong one is the
  cheapest large improvement available.
- **Automate the response for the cheap cases.** If the action on a brute-force is to block the
  source address, do that automatically and let a human see the summary.
- **Tier the queue.** Give analysts fifty things that are 20% likely rather than five hundred that
  are 1% likely.

### 6. Writing it up

§8.7 and NIST SP 800-61r3 give the same four-phase shape:

| Phase | The question |
| --- | --- |
| **Preparation** | What was in place before? Logging, backups, a plan, somebody to call. |
| **Detection and analysis** | What happened, how do we know, and how far does it go? |
| **Containment, eradication, and recovery** | Stop it, remove it, come back, and how do we decide the host is clean? |
| **Post-incident activity** | What changes, so this is less likely or gets caught sooner? |

Three things that separate a usable memo from a bad one:

- **Separate what you know from what you infer.** "The account authenticated from 203.0.113.47 at
  03:27" is a fact. "The attacker obtained the credential from a previous breach" is a hypothesis.
  Label it.
- **Say what you would not trust.** Once an intruder has had root, the host's own logs and its
  package manifest are no longer evidence. Recovery from a known-good image beats cleaning.
- **Say what your recommendation costs.** Containment is disruptive by definition. Say what it
  disrupts, so the person approving it knows what they are approving.

## Do this week

| | Task | Points | Due |
| --- | --- | ---: | --- |
| 1 | [Lab 10: Log Analysis and Incident Memo](../assignments/lab-10-log-analysis-and-incident-memo.md) | 38 | Friday, April 30 |
| 2 | [D5: A Current Security Failure](../discussions/d05-current-security-failure.md), initial post Thursday, two replies Friday | 30 | Thu / Fri |

**April 30 is the last day of instruction.** No lab, discussion, or extra credit from the
instructional weeks is accepted after it, see the
[Late Work Policy](../index.md#late-work-policy). The usual two-day grace period cannot extend
past the end of the semester, so week 15 has no grace period at all. The
[final exam](../assignments/final-exam-guide.md) and
[D6, the final reflection](../discussions/d06-final-reflection.md) are the only things due after
April 30, and they are governed by the Exam and Quiz and Class Interaction policies rather than by
the homework late policy.

## Key terms

| Term | Short form |
| --- | --- |
| **Security operations** | The ongoing work of monitoring, detecting, and responding. |
| **Data source** | What detection draws on: network traffic, flow records, application logs, system and kernel logs, syslog. |
| **Misuse detection** | Encodes what bad looks like. Precise; catches only what was written down. |
| **Anomaly detection** | Encodes what normal looks like and flags deviation. Catches the unknown; noisier. |
| **True / false positive rate** | Fraction of malicious events detected / benign events flagged. |
| **Base-rate fallacy** | Ignoring how rare the thing is, and so overestimating what an alert means. |
| **SIEM** | Collects, correlates, and presents events from many sources. |
| **Alert fatigue** | What a queue of 500 alerts a day produces in the people who have to read it. |
| **Dwell time** | Time between compromise and detection. |
| **Containment / eradication / recovery** | Stop the bleeding; remove the attacker; restore service. |
| **Indicator of compromise** | An observable artefact of an intrusion. |

## Time estimate

| Activity | Time |
| --- | --- |
| Reading (11 pages plus NIST skim) | 1 hr 50 min |
| This module page and the worked example | 50 min |
| Lab 10 | 1 hr 35 min |
| D5 post and two replies | 1 hr |
| Review and slack | 1 hr 45 min |
| **Total** | **~7 hrs** |

## Looking ahead

Finals week, May 3-7: the [final exam](../assignments/final-exam-guide.md) and
[D6, a short reflection](../discussions/d06-final-reflection.md). Read the exam guide this weekend, 
Part B is the assurance material from week 13, which is the part students most often under-prepare.

Thank you for the semester.
