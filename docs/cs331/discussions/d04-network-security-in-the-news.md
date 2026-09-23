# 11.02 D4: Network Security in the News

**Week 11 · 30 points · about 60 minutes · Canvas discussion board**

## Objectives assessed

- **4.1**: Explain how common network attacks work at the protocol layer where they operate.
- **4.2**: Recommend network defenses (firewalling, segmentation, and monitoring) for a described
  network.

([TLO 4](../objectives.md#tlo-4--analyzing-common-attacks-and-justifying-countermeasures))

## Time estimate

| | |
| --- | --- |
| Find and read a source | 15 min |
| Initial post | 30 min |
| Two replies | 15 min |
| **Total** | **60 min** |

## Before you start

- CyBOK §19.1 (printed pages 646-648), security goals and attacker models.
- CyBOK §19.3.2-19.3.3 (printed pages 656-665), transport and internet layer security.
- CyBOK §19.4 (printed pages 671-677), network security tools.

## Find an incident

Find **one** publicly reported security incident, from the last three years, in which the **network
played a substantive role**. That means the reporting says something about how the attacker moved,
what protocol or network weakness they used, or how traffic was or was not observed.

Good sources: CISA advisories (<https://www.cisa.gov/news-events/cybersecurity-advisories>), vendor
incident reports, the organisation's own post-incident disclosure, reputable technical press.

Two rules:

- **You must be able to link a source with technical detail.** A three-sentence news item that says
  "hackers breached the company" gives you nothing to analyse.
- **Check the board before you post and pick something nobody has taken.** First come, first served.
  Post early if you want a well-documented one.

## Initial Post Directions

**Due: Thursday of week 11. About 400-500 words.**

Three labelled parts.

### 1. What happened, at which layer

Summarise the incident in about 100 words, and link your source.

Then, for the network-relevant part: **name the protocol layer and the mechanism.** Use CyBOK
§19.3's structure (application, transport, internet, or link) and say what property of that
protocol the attacker relied on.

Be specific about the mechanism. "They got in through the network" is not an answer. Examples of
answers that are: *unauthenticated ARP replies let the attacker place themselves in the path*;
*a VPN appliance's management interface was reachable from the internet*; *lateral movement over
SMB was possible because the internal network was unsegmented*; *exfiltration was invisible because
egress traffic was neither filtered nor logged*.

If the reporting does not say, **say what is missing** and what you would need to know. Being clear
about the boundary of the evidence is a real finding.

### 2. What would have stopped it, or slowed it

Recommend **two** network-level controls that would have prevented this or materially limited the
damage. Draw from CyBOK §19.4: firewalling, segmentation, network security monitoring, network
access control, zero trust, denial-of-service countermeasures.

For **each** of the two:

- **What it does**, in your own words.
- **Where in this incident's timeline it would have acted**, and what specifically it would have
  stopped or revealed.
- **What it costs.** Money, latency, operational burden, or something legitimate users can no
  longer do. Every recommendation in this course names its cost.
- **What it would not have stopped**, in this same incident.

At least one of your two must be a **detection** control rather than a prevention control, and for
that one you must say who would have seen the alert and what they would have had to do.

### 3. The honest limit

One short paragraph: **would your two controls have been in place at a realistic organisation of
this size and budget?** If not, say what they would have displaced. Security recommendations that
assume unlimited resources are the easiest kind to write and the least useful.

## Reply Post Directions

**Due: Sunday of week 11. Two replies, about 150 words each.**

Reply to **two** classmates who chose different incidents. Do one of these:

- **Defeat a control.** Describe a realistic way the attacker gets what they wanted anyway, despite
  the recommended control. Then say whether that makes the control useless or just insufficient
  alone.
- **Correct the layer.** If you think they attributed the mechanism to the wrong layer, say which
  and why, citing §19.3.
- **Raise the cost.** Name an operational cost of their recommendation they did not account for.

## Rubric

| Row | What is assessed | Points |
| --- | --- | ---: |
| 1 | Initial post part 1: incident summarised with a linked technical source; the correct protocol layer identified; the specific protocol property the attacker relied on named, or the evidence gap stated precisely | 10 |
| 2 | Initial post parts 2-3: two controls, at least one detection-based, each with what it does, where it would have acted, its cost, and what it would not have stopped; the realism paragraph engages with budget and displacement | 8 |
| 3 | Two substantive replies to classmates with different incidents, each defeating a control, correcting a layer attribution, or raising an unaccounted cost | 12 |
| | **Total** | **30** |

**What loses points in row 2:** controls with no stated cost, and detection controls with no answer
to "who reads the alert." Week 15 will show you what happens to alerts nobody reads.

## Discussion Guidelines

The [discussion guidelines from D1](d01-introductions-and-security-mindset.md#discussion-guidelines)
apply. Analyse published reporting only, do not probe, scan, or test any organisation's network.

## AI disclosure

You may use AI tools. If you do, add a sentence saying which and what for, per the
[AI policy](../index.md#ai-policy).

One caution: AI tools invent incidents and invent details of real ones. **Every factual claim in
part 1 must be supported by your linked source**, and I check. A confident description of an
incident that did not happen the way you describe scores zero for row 1.
