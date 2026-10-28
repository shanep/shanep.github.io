# 11.01 Readings and Lecture Notes

**March 29 - April 4 · Reading: 17 pages · About 2 hrs 40 min with the worked example**

## Key terms

| Term | Short form |
| --- | --- |
| **On-path attacker** | Positioned to read, modify, drop, or inject traffic between two parties. |
| **ARP (Address Resolution Protocol) spoofing** | Forged link-layer replies to redirect traffic on a local segment. |
| **DNS (Domain Name System) cache poisoning** | Forged answers accepted and cached by a resolver. |
| **DNSSEC (Domain Name System Security Extensions)** | Signs DNS records so forgery is detectable. |
| **BGP (Border Gateway Protocol) hijacking** | Announcing routes for address space you do not hold. |
| **Reflection / amplification** | Small spoofed requests producing large replies aimed at a victim. |
| **Stateful firewall** | Tracks connections so return traffic can be allowed without opening the whole range. |
| **Segmentation** | Dividing a network so a compromise in one zone does not reach all others. |
| **IDS (intrusion detection system) / IPS (intrusion prevention system)** | Detection alerts; prevention sits in-path and blocks, and can cause outages. |
| **Network security monitoring** | Using traffic metadata (who, when, how much) rather than content. |
| **Zero trust** | Network location is not a credential; authorize every request on its merits. |
| **Egress filtering** | Controlling what may leave, not only what may enter. |

## Readings

### CyBOK

| Source | Sections | Printed pages | Length | Approx. time |
| --- | --- | --- | --- | --- |
| [CyBOK §19.1](https://shanepanter.com/cs331/cybok/19-network-security#_19-1-security-goals-and-attacker-models) | §19.1 Security Goals and Attacker Models | 672-674 | 2 pp | 15 min |
| [CyBOK §19.3.2](https://shanepanter.com/cs331/cybok/19-network-security#_19-3-2-security-at-the-transport-layer) | §19.3.2 Security at the Transport Layer: TLS (Transport Layer Security), PKI (public key infrastructure), TCP (Transmission Control Protocol), UDP (User Datagram Protocol), QUIC | 682-686 | 4 pp | 30 min |
| [CyBOK §19.3.3](https://shanepanter.com/cs331/cybok/19-network-security#_19-3-3-security-at-the-internet-layer) | §19.3.3 Security at the Internet Layer: IPv4, IPv6, routing, ICMP (Internet Control Message Protocol) | 686-691 | 5 pp | 35 min |
| [CyBOK §19.4](https://shanepanter.com/cs331/cybok/19-network-security#_19-4-network-security-tools) | §19.4 Network Security Tools | 697-703 | 6 pp | 40 min |

§19.3.1 (application layer) and §19.3.4 (link layer) are not assigned, but §19.3.4.5 on network
segmentation is one page and worth the detour.

## Attacks by layer

For each attack, name the network layer whose protocol has the weakness the attacker relies on. Part 1
of D4 asks you to do the same for a real incident.

| Layer | Attack | The property exploited |
| --- | --- | --- |
| **Link** | ARP spoofing | ARP has no authentication; any host on the segment can claim any address |
| **Internet** | IP (Internet Protocol) source spoofing | The source address in a packet is not verified by default |
| **Internet** | BGP route hijacking | Route announcements are accepted largely on trust |
| **Internet** | Reflection and amplification DoS (denial of service) | UDP services reply to unverified source addresses, with replies larger than requests |
| **Transport** | TCP injection or reset | Sequence numbers provide ordering, not authentication |
| **Application** | DNS spoofing / cache poisoning | Classic DNS responses are unauthenticated UDP |
| **Application** | TLS downgrade / stripping | Negotiation can be manipulated if the client will accept a weaker option |

Two patterns run through the whole table:

1. **The protocol accepts assertions it cannot verify.** ARP, DNS, and BGP all do this.
2. **The protocol was designed against faults, not adversaries.** TCP sequence numbers are the
   clearest case.

## Worked example

Read the [NORTHWIND MEADOW incident report](../data/incident-report.md) before you go further. It is
the hospital ransomware case you will analyze in Lab 7 next week, so the time carries over. Then ask a
purely network question about it: **where could the
network have seen this, and where could it have stopped it?**

### Where the network could have seen it

Read the report for traffic, not for malware.

- **Day 0, from the first hour onward.** One internal workstation begins connecting to
  `api-telemetry-sync[.]com` **every 47 seconds**, and keeps doing it for seven days. The content is
  TLS-encrypted and the certificate is valid, so a sensor cannot read a byte of it. It does not need
  to. A workstation making a regular, precisely periodic connection to one external host, around the
  clock, for a week, is not what a human being browsing the web looks like. **Beaconing detection is
  purely a metadata pattern** (who, to whom, how often), and it is exactly the kind of flow data
  §19.4.3 describes.

- **Day 0.** Nothing in the report suggests the organization had ever talked to
  `api-telemetry-sync[.]com` before. First-contact-with-a-new-domain is a weak signal on its own
  and a strong one in combination with periodicity.

- **Days 4-6.** Roughly 74 GB (gigabytes) leaves in ~400 MB (megabytes) chunks, between 01:00 and 04:00, to that same host.
  This is the loudest thing in the entire incident. Nobody in a hospital's billing department
  uploads 74 GB at two in the morning. Again: no content needed, just direction and volume.

### Where the network could have stopped it

- **Segmentation.** Days 1-6 involved moving from a billing workstation to two other workstations
  and a file server. In a flat network, reachability is free. Segmenting clinical and file-server
  networks away from general workstation traffic would not have prevented the initial compromise
  (the phishing email still lands), but it would have made every subsequent step require crossing a
  boundary that could deny it or log it.

- **Egress filtering.** The organization allowed arbitrary outbound HTTPS (Hypertext Transfer Protocol Secure) from a billing
  workstation to any host on the internet. Restricting outbound connections from workstation
  networks to a proxy, and alerting on volume, converts the exfiltration from invisible into an
  obvious event.

Notice that **neither of these is a detection product.** They are architecture decisions. For most
organizations, attack surface reduction and segmentation buy more than an additional sensor.

### The honest limit

Now be honest about the cost, which is what Discussion 4 grades.

Segmentation is expensive. It means knowing which systems need to talk to which, which most
organizations do not, and it breaks things when you get it wrong. Egress filtering generates help
desk tickets from the day it is turned on. A beaconing detector needs somebody to read its output,
and the incident report already tells you what this organization's alert queue looked like: 400
medium alerts a day, and a correct alert about this very compromise sitting unread in it since
09:26 on Day 0.

**A detection control with nobody to read it is not a control.** That is week 15's subject, and it
is why Discussion 4 requires you to say who would have seen your alert.

## Looking ahead

Week 12 stays with the same incident and asks a different question: what was the malware, and what
did the operators actually do? Lab 7 maps the whole operation to MITRE ATT&CK. You have already met
the report; read it again before Monday if you want a head start.

<!--@include: ../../../parts/cs331-questions-button.md-->
