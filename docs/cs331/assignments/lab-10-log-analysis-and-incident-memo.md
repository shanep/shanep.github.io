# 15.04 Lab 10: Log Analysis and Incident Memo

**Week 15 · 38 points · about 90 minutes · submit in Canvas**

## Goal

Two log files from one server on one night. Find what happened, decide what kind of detection would
have caught it, do the arithmetic that explains why nobody did catch it, and write the memo.

This is the closest thing in the course to what a first job in security operations looks like on
an ordinary day.

## Objectives assessed

- **7.1**: Identify the data sources a detection capability draws on and state what each can and
  cannot show.
- **7.2**: Distinguish misuse detection from anomaly detection and choose one for a stated
  scenario.
- **7.3**: Analyze authentication and web server logs to identify brute-force and scanning
  activity.
- **7.4**: Explain the base-rate fallacy and its effect on alert volume in a detection system.
- **7.5**: Recommend a defensible incident response structured according to NIST SP 800-61r3.

([TLO 7](../objectives.md#tlo-7--analyzing-detection-data-and-recommending-a-response))

## Time estimate

| Step | Time |
| --- | --- |
| Step 1: what the logs are | 10 min |
| Step 2: the authentication log | 25 min |
| Step 3: the web log | 20 min |
| Step 4: detection model and base rate | 20 min |
| Step 5: the memo | 20 min |
| **Total** | **95 min** |

## Before you start

- CyBOK §8.1 (printed pages 253-256), fundamental concepts, workflows and vocabulary.
- CyBOK §8.2 (printed pages 256-263), **monitor: data sources**. Skim; you will come back to it in
  Step 1.
- CyBOK §8.3.1-8.3.3 (printed pages 264-268), misuse detection, anomaly detection, and blended
  detection.
- CyBOK §8.3.6 (printed page 270), **the base-rate fallacy**. Short and important.
- CyBOK §8.7 (printed pages 283-286), incident management: prepare, handle, follow up.
- NIST SP 800-61r3, skim the incident response life cycle:
  <https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-61r3.pdf>
- Download [data/auth.log](../data/auth.log) and [data/web_access.log](../data/web_access.log) from
  Canvas Files.

### Tools

You need one of these, and no more:

- **`grep`, `sort`, `uniq`, `wc`** in a terminal. Examples are given below; you can copy them.
- **Python**, if you would rather. Reading a file and counting things is four lines.
- **A text editor with search and a line count**, if you would rather. It is slower but it works.

Nothing here requires a tool you do not already have. If a command below does not work on your
machine, say so in your submission and use another method, the finding is what is graded, not the
technique.

## Steps

### Step 1: What these logs are, and what they are not

Open both files and look at a few lines of each.

1. **Name the data source category** each file belongs to, using CyBOK §8.2's list. Give the
   section number.
2. For **each** file, list **three specific fields** it records, and for each field, one question it
   can answer.
3. For **each** file, name **two questions it cannot answer**, and say what data source you would
   need instead. Be specific, "we would need more logs" is not an answer.
4. Both files come from one host. **Name one thing that makes single-host logs an unreliable record
   after an intrusion**, using something from the week 12 incident report.

### Step 2: The authentication log

`auth.log` covers one 24-hour period on a server called `vault-api-01`.

Useful starting commands:

```
wc -l auth.log
grep -oE 'from [0-9.]+' auth.log | sort | uniq -c | sort -rn | head
grep -c "Failed password" auth.log
grep "Accepted password" auth.log
```

Answer:

1. **How many lines are in the file**, and **how many distinct source IP addresses** appear?
2. **One source address dominates.** Name it, give the number of failed authentication attempts
   from it, and give the time window over which they occurred.
3. **What usernames was it trying?** List them. What does that list tell you about whether the
   attacker knew anything about this organisation?
4. **The critical finding.** Something in this log is much worse than a failed brute-force. Find it,
   quote the exact line, and state in one sentence why it changes the severity of the whole
   incident.
5. **Quote every line belonging to the intruder's session after the finding in question 4.** There
   are four. Two of them are administrative commands and those are the ones that matter, for each,
   say what it tells you about their intent. Then use the first and last timestamps to state how
   long the intruder had interactive access.
6. Every **successful** staff login in this file uses a different authentication method than the
   intruder did. **Name both methods**, quote one example of each, and say what single server
   configuration change would have made the intruder's success impossible. Then answer: there are a
   handful of *failed* password attempts from internal addresses too: what is the innocent
   explanation, and how would you tell it apart from the attacker's failures?

### Step 3: The web access log

`web_access.log` covers the same period. It is in Apache combined format:

```
IP - - [timestamp] "METHOD path HTTP/1.1" status size "referrer" "user-agent"
```

Useful starting commands:

```
awk '{print $1}' web_access.log | sort | uniq -c | sort -rn | head
grep -oE '" [0-9]{3} ' web_access.log | sort | uniq -c | sort -rn
```

Answer:

1. **One source address behaves differently from all the others.** Name it. Give the number of
   requests, the time window, and the distribution of HTTP status codes it received.
2. **What is it doing?** Name the activity, and give **four specific request paths** that make it
   obvious. Say what the attacker was hoping to find with each.
3. **The user-agent string is a giveaway.** Quote it. Then answer: would a competent attacker leave
   it set that way, and what does that imply about whether user-agent is a sound thing to detect on?
4. **The critical finding.** Almost every request from this address returned 404. **Three returned
   200.** Find all three and quote them. Two are unremarkable and you should say why. The third is
   the incident. Say what happened, and say what the **response size** on that line tells you that
   the status code alone does not.
5. **Is this the same actor as in Step 2?** The two source addresses are different. Argue a
   position using the evidence available: the timing, the target, the technique. Say explicitly
   what would settle the question and whether these logs contain it.
6. **Map both findings to MITRE ATT&CK.** Give the tactic and technique ID for the Step 2 activity
   and for the Step 3 activity. (You did this in Lab 7; use <https://attack.mitre.org/>.)

### Step 4: Detection model and the base-rate problem

1. **Write a misuse detection rule** for the Step 2 activity: the data source it reads, the
   condition it fires on with specific numbers, and the response. Then say what it would miss, give
   one attacker behaviour that defeats it.
2. **Write an anomaly detection approach** for the same activity: what "normal" would have to be
   measured first, over what period, and what deviation would fire. Then say what it would produce
   that the misuse rule would not, in both directions, useful findings and false alarms.
3. **Which would you deploy on this server, and why?** CyBOK §8.3.3 describes blending them; if
   your answer is "both", say specifically how they divide the work.
4. **The arithmetic.** Your rule watches authentication events on this server. Assume:
   - 50,000 authentication events per day.
   - Genuine intrusion attempts on 1 day in 100, so about 500 malicious events per 100 days, out
     of 5,000,000 total. That is a base rate of **0.01%**.
   - Your detector catches 99% of malicious events (true positive rate).
   - Your detector fires on 1% of benign events (false positive rate).

   Compute, showing your work:
   - a. Over 100 days, how many **true positives**?
   - b. Over 100 days, how many **false positives**?
   - c. **When an alert fires, what is the probability it is a real intrusion?**
   - d. How many alerts per day does the analyst see?

5. **Interpret it.** Your detector is 99% accurate by the usual measure. In two or three sentences,
   explain what part (c) means for the analyst reviewing the queue, and connect it to what happened
   to the correct-but-ignored alert in the [week 12 incident report](../data/incident-report.md).
6. **Fix it.** Name **two changes** that would make the alert queue workable. At least one must
   change something other than the detector's accuracy. For each, say what it costs.

### Step 5: The incident memo

Write a **one-page incident memo** (400 to 600 words) addressed to the IT director of the
organisation running `vault-api-01`. Structure it around the NIST SP 800-61r3 life cycle, with
these headings:

1. **What happened.** A factual summary, with times. No speculation in this section.
2. **What we know and what we do not.** Separate the two explicitly. Say what evidence would close
   each gap.
3. **Containment.** What to do in the next hour. Be specific about which accounts, which hosts, and
   which network paths.
4. **Eradication and recovery.** What to do in the next week, and how you will decide the host is
   clean. Say what you would *not* trust and why.
5. **Post-incident.** Two changes that would have prevented this, and one that would have detected
   it sooner. Tie each to a specific finding above.

Write it for a competent reader who is not a security specialist. No jargon you do not define. If
you recommend something disruptive (and containment usually is), say what it disrupts.

## What to submit

One Canvas submission containing your numbered answers to Steps 1-4, including the commands or
code you used and the arithmetic in Step 4 question 4, followed by the memo from Step 5.

## Rubric

| Row | What is assessed | Points |
| --- | --- | ---: |
| 1 | Step 1: both data sources correctly categorised with CyBOK §8.2 section numbers; three fields and a question each; two specific unanswerable questions per file with the data source that would answer them; the single-host reliability point | 5 |
| 2 | Step 2: the attacking address, failure count, and window correct; the username list interpreted; **the successful authentication found and quoted**; the four session lines quoted, the two administrative commands interpreted, and the duration of access stated; both authentication methods named with the preventive configuration change and the benign-failures question answered | 8 |
| 3 | Step 3: the scanning address, request count, window, and status distribution correct; the activity named with four paths interpreted; the user-agent question answered on both sides; **all three 200 responses found, the two harmless ones dismissed with a reason, and the third identified as data exfiltration using the response size**; a defended position on same-actor-or-not; both ATT&CK mappings correct | 8 |
| 4 | Step 4 questions 1-3: a misuse rule with a data source, numeric condition, response, and a stated evasion; an anomaly approach with its baseline defined; a defended choice between them | 6 |
| 5 | Step 4 questions 4-6: all four calculations correct with work shown; the interpretation connects to the week 12 alert queue; two fixes with costs, at least one not about detector accuracy | 4 |
| 6 | Step 5: memo has all five sections, separates fact from inference, gives specific and actionable containment, states what it would not trust during recovery, and ties each post-incident recommendation to a finding | 7 |
| | **Total** | **38** |

**The numbers row 5 needs**, over 100 days and 5,000,000 events: 500 malicious, 4,999,500 benign.
True positives = 0.99 × 500 = **495**. False positives = 0.01 × 4,999,500 ≈ **49,995**. Probability
an alert is real = 495 ÷ (495 + 49,995) ≈ **0.98%**. Alerts per day ≈ 50,490 ÷ 100 ≈ **505**. Fewer
than one alert in a hundred is a real intrusion, and the analyst gets about five hundred a day.

## AI disclosure

You may use AI tools on this assignment. If you do, add one or two sentences saying which tool and
what for, per the [AI policy](../index.md#ai-policy).

The findings in Steps 2 and 3 have to come out of the actual files. An AI tool that has not read
them will invent plausible IP addresses and timestamps, and rows 2 and 3 are graded against what is
really in the logs.
