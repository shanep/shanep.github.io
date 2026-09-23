# Week 11: Network Security and Attacks

**March 29 - April 4 · Reading: 15 pages · Estimated total: 7 hours**

## Overview

The internet's core protocols were designed by people who were solving a different problem. They
were building something that would keep working when links failed and routers died, among
institutions that broadly trusted each other. Almost none of it authenticates anything.

That inheritance explains most of this week. ARP believes any reply. DNS believed any answer until
DNSSEC. BGP largely believes any route announcement. TCP's sequence numbers give you robustness
against faults, not against an adversary. Every one of those is a design that was correct for its
requirements and became a vulnerability when the requirements changed.

The second half of the week is what defenders do about it: firewalling, segmentation, monitoring,
and the observation that in a world where nearly all traffic is encrypted, a network sensor sees
metadata rather than content, and metadata turns out to be enough for a great deal.

## Objectives this week

- **[4.1](../objectives.md#tlo-4--analyzing-common-attacks-and-justifying-countermeasures)**: 
  Explain how common network attacks work at the protocol layer where they operate.
- **[4.2](../objectives.md#tlo-4--analyzing-common-attacks-and-justifying-countermeasures)**: 
  Recommend network defenses (firewalling, segmentation, and monitoring) for a described network.

## Read

| Source | Sections | Printed pages | Length | Time |
| --- | --- | --- | --- | --- |
| [CyBOK v1.1.0](../docs/CyBOK_v1.1.0.pdf) | §19.1 Security Goals and Attacker Models | 646-648 | 2 pp | 15 min |
| [CyBOK v1.1.0](../docs/CyBOK_v1.1.0.pdf) | §19.3.2 Security at the Transport Layer, TLS, PKI, TCP, UDP, QUIC | 656-660 | 4 pp | 30 min |
| [CyBOK v1.1.0](../docs/CyBOK_v1.1.0.pdf) | §19.3.3 Security at the Internet Layer, IPv4, IPv6, routing, ICMP | 660-665 | 5 pp | 35 min |
| [CyBOK v1.1.0](../docs/CyBOK_v1.1.0.pdf) | §19.4 Network Security Tools | 671-677 | 6 pp | 40 min |

§19.3.1 (application layer) and §19.3.4 (link layer) are not assigned, but §19.3.4.5 on network
segmentation is referenced by Quiz 4 and is one page, worth the detour.

## Attacks by layer

Attribute an attack to the layer whose protocol property it exploits. This is what Quiz 4 items 1-7
test.

| Layer | Attack | The property exploited |
| --- | --- | --- |
| **Link** | ARP spoofing | ARP has no authentication; any host on the segment can claim any address |
| **Internet** | IP source spoofing | The source address in a packet is not verified by default |
| **Internet** | BGP route hijacking | Route announcements are accepted largely on trust |
| **Internet** | Reflection and amplification DoS | UDP services reply to unverified source addresses, with replies larger than requests |
| **Transport** | TCP injection or reset | Sequence numbers provide ordering, not authentication |
| **Application** | DNS spoofing / cache poisoning | Classic DNS responses are unauthenticated UDP |
| **Application** | TLS downgrade / stripping | Negotiation can be manipulated if the client will accept a weaker option |

Two patterns run through the whole table:

1. **The protocol accepts assertions it cannot verify.** ARP, DNS, and BGP all do this.
2. **The protocol was designed against faults, not adversaries.** TCP sequence numbers are the
   clearest case.

## Worked example

Take the [NORTHWIND MEADOW incident](../data/incident-report.md) (the hospital ransomware case you
will analyse in Lab 7 next week) and ask a purely network question about it: **where could the
network have seen this, and where could it have stopped it?**

### Where the network could have seen it

Read the report for traffic, not for malware.

- **Day 0, minutes 20 onward.** One internal workstation begins connecting to
  `api-telemetry-sync[.]com` **every 47 seconds**, and keeps doing it for seven days. The content is
  TLS-encrypted and the certificate is valid, so a sensor cannot read a byte of it. It does not need
  to. A workstation making a regular, precisely periodic connection to one external host, around the
  clock, for a week, is not what a human being browsing the web looks like. **Beaconing detection is
  purely a metadata pattern** (who, to whom, how often), and this is exactly the case §19.4.3
  describes.

- **Day 0.** The domain `api-telemetry-sync[.]com` had never been seen before in this
  organisation's traffic. First-contact-with-a-new-domain is a weak signal on its own and a strong
  one in combination with periodicity.

- **Days 4-6.** Roughly 74 GB leaves in ~400 MB chunks, between 01:00 and 04:00, to that same host.
  This is the loudest thing in the entire incident. Nobody in a hospital's billing department
  uploads 74 GB at two in the morning. Again: no content needed, just direction and volume.

### Where the network could have stopped it

- **Segmentation.** Days 1-6 involved moving from a billing workstation to two other workstations
  and a file server. In a flat network, reachability is free. Segmenting clinical and file-server
  networks away from general workstation traffic would not have prevented the initial compromise
  (the phishing email still lands), but it would have made every subsequent step require crossing a
  boundary that could deny it or log it.

- **Egress filtering.** The organisation allowed arbitrary outbound HTTPS from a billing
  workstation to any host on the internet. Restricting outbound connections from workstation
  networks to a proxy, and alerting on volume, converts the exfiltration from invisible into an
  obvious event.

Notice that **neither of these is a detection product.** They are architecture decisions. §19.4 is
consistent about this: for most organisations, attack surface reduction and segmentation buy more
than an additional sensor.

### The honest limit

Now be honest about the cost, which is what Discussion 4 grades.

Segmentation is expensive. It means knowing which systems need to talk to which, which most
organisations do not, and it breaks things when you get it wrong. Egress filtering generates help
desk tickets from the day it is turned on. A beaconing detector needs somebody to read its output,
and the incident report already tells you what this organisation's alert queue looked like: 400
medium alerts a day, and a correct alert about this very compromise sitting unread in it since
09:26 on Day 0.

**A detection control with nobody to read it is not a control.** That is week 15's subject, and it
is why Discussion 4 requires you to say who would have seen your alert.

## Do this week

| | Task | Points | Due |
| --- | --- | ---: | --- |
| 1 | [D4: Network Security in the News](../discussions/d04-network-security-in-the-news.md), initial post Thursday, two replies Sunday | 30 | Thu / Sun |
| 2 | [Quiz 4: Network Security](../quizzes/quiz-04-network-security.md) | 30 | Sunday |

D4 asks you to find an incident nobody else has claimed. **Check the board and post early.**

## Key terms

| Term | Short form |
| --- | --- |
| **On-path attacker** | Positioned to read, modify, drop, or inject traffic between two parties. |
| **ARP spoofing** | Forged link-layer replies to redirect traffic on a local segment. |
| **DNS cache poisoning** | Forged answers accepted and cached by a resolver. |
| **DNSSEC** | Signs DNS records so forgery is detectable. |
| **BGP hijacking** | Announcing routes for address space you do not hold. |
| **Reflection / amplification** | Small spoofed requests producing large replies aimed at a victim. |
| **Stateful firewall** | Tracks connections so return traffic can be allowed without opening the whole range. |
| **Segmentation** | Dividing a network so a compromise in one zone does not reach all others. |
| **IDS / IPS** | Detection alerts; prevention sits in-path and blocks, and can cause outages. |
| **Network security monitoring** | Using traffic metadata (who, when, how much) rather than content. |
| **Zero trust** | Network location is not a credential; authorise every request on its merits. |
| **Egress filtering** | Controlling what may leave, not only what may enter. |

## Time estimate

| Activity | Time |
| --- | --- |
| Reading (15 pages) | 2 hrs |
| This module page and the worked example | 40 min |
| D4 post and two replies | 1 hr |
| Quiz 4 | 15 min |
| Review and slack | 2 hrs 30 min |
| **Total** | **~6.5-7 hrs** |

## Looking ahead

Week 12 stays with the same incident and asks a different question: what was the malware, and what
did the operators actually do? Lab 7 maps the whole operation to MITRE ATT&CK. You have already met
the report; read it again before Monday if you want a head start.
