# Quiz 4: Network Security

**Week 11 · 30 points · 15 questions × 2 points · 15 minutes · one attempt · taken in Canvas**

Covers week 11: security goals and attacker models for networks, protocol security at the
application, transport, internet, and link layers, and network security tools.

## Objectives assessed

| Items | Objective |
| --- | --- |
| 1-7 | **4.1**: Explain how common network attacks work at the protocol layer where they operate |
| 8-15 | **4.2**: Recommend network defenses (firewalling, segmentation, and monitoring) for a described network |

([TLO 4](../objectives.md#tlo-4--analyzing-common-attacks-and-justifying-countermeasures))

---

**Q1.** An attacker on the same wireless network as a victim sends forged replies claiming to be
the network's gateway, so the victim's traffic is routed through the attacker's machine first. At
which layer does this attack operate, and what is it called? *(Objective 4.1)*

- A. Application layer; phishing
- B. Link layer; ARP spoofing
- C. Transport layer; TCP hijacking
- D. Internet layer; IP fragmentation

*Answer:* **B**: ARP has no authentication at all, so any host on the segment can claim any
address. This is why link-layer attacks are largely a question of who else is on your segment.
(CyBOK §19.3.4)

---

**Q2.** An attacker returns forged answers to a victim's name lookups so that `bank.example`
resolves to an address the attacker controls. What is this, and what protects against it?
*(Objective 4.1)*

- A. DNS spoofing or cache poisoning; DNSSEC provides origin authentication for DNS records
- B. A denial of service attack; rate limiting protects against it
- C. An ARP attack; switch port security protects against it
- D. A TLS downgrade; certificate pinning protects against it

*Answer:* **A**: Classic DNS uses unauthenticated UDP responses. DNSSEC signs records so a
resolver can detect forgery. Note that TLS gives a second line of defence here: the attacker's
server still has to present a valid certificate for `bank.example`. (CyBOK §19.3.1.3)

---

**Q3.** Select **all** that are true about TLS. *(Objective 4.1)*

- A. It provides confidentiality and integrity for data in transit
- B. It authenticates the server to the client, and optionally the client to the server
- C. It protects data once it has arrived and been stored on the server
- D. It hides which site you are connecting to from a network observer

*Answer:* **A and B**: C is false: TLS protects data in transit only. D is largely false: the
destination IP address is visible, and unless encrypted client hello is in use, the server name is
visible in the handshake too. (CyBOK §19.3.2.1)

---

**Q4.** Why is the original TCP three-way handshake vulnerable to attackers who can guess or
observe sequence numbers? *(Objective 4.1)*

- A. Sequence numbers are encrypted, so guessing them breaks the encryption
- B. TCP's sequence numbers provide ordering and basic robustness, not authentication, so an attacker who can predict them can inject or reset a connection
- C. TCP has no sequence numbers
- D. The handshake requires a shared secret that is often reused

*Answer:* **B**: TCP was designed for reliability against faults, not against an adversary.
Randomised initial sequence numbers make prediction hard, but an attacker who can *observe* traffic
does not need to predict. (CyBOK §19.3.2.3)

---

**Q5.** An attacker sends a small request to many open servers, each of which sends a much larger
reply to a spoofed source address, the victim's. What is this called, and what makes it possible?
*(Objective 4.1)*

- A. A reflection and amplification attack; UDP-based protocols do not verify the source address
- B. A buffer overflow; the reply is larger than the request buffer
- C. A man-in-the-middle attack; the attacker sits between the parties
- D. A replay attack; the same request is sent repeatedly

*Answer:* **A**: Amplification depends on two things together: a protocol whose reply is much
larger than its request, and no verification of who asked. Source address validation at the network
edge is the structural fix. (CyBOK §19.3.3.1, §19.4.7)

---

**Q6.** Select **all** that an attacker positioned between two parties on the network path can do
if the connection uses plain HTTP rather than HTTPS. *(Objective 4.1)*

- A. Read every request and response, including submitted credentials
- B. Modify page content before it reaches the browser
- C. Recover the server's private key
- D. Inject additional requests that appear to come from the client

*Answer:* **A, B, and D**: C is false: with plain HTTP there is no private key in use for that
connection at all, so there is nothing to recover. Everything else is available to a network
attacker, which is the whole argument for HTTPS everywhere. (CyBOK §19.1.2, §19.3.1.2)

---

**Q7.** BGP is the protocol that decides how traffic gets routed between networks on the internet.
Why is route hijacking possible? *(Objective 4.1)*

- A. BGP is encrypted but the key is widely known
- B. BGP historically accepts route announcements largely on trust, with no strong cryptographic proof that an announcer is entitled to a prefix
- C. BGP runs over UDP and cannot be authenticated
- D. It is not possible; BGP hijacks are a myth

*Answer:* **B**: Routing security is a trust problem, and it is being addressed by RPKI and route
origin validation, which are still incompletely deployed. (CyBOK §19.3.3.3)

---

**Q8.** What does a stateful packet-filtering firewall do that a stateless one does not?
*(Objective 4.2)*

- A. Inspect application-layer content
- B. Track existing connections, so it can allow return traffic belonging to a connection it already permitted
- C. Decrypt TLS
- D. Authenticate users

*Answer:* **B**: Connection tracking is what lets a firewall express "allow outbound, allow the
replies, deny new inbound" without opening the whole return range. (CyBOK §19.4.1)

---

**Q9.** A company has one flat internal network: web servers, the finance database, staff laptops,
and building HVAC controllers can all reach each other. Which control most directly addresses this?
*(Objective 4.2)*

- A. A stronger perimeter firewall
- B. Network segmentation, so a compromise in one zone does not grant reachability to all others
- C. Longer passwords
- D. Full-disk encryption on the laptops

*Answer:* **B**: A perimeter firewall does nothing about lateral movement once someone is inside.
Segmentation is the control that limits blast radius, and it is what would have slowed the
[NORTHWIND MEADOW](../data/incident-report.md) operators between Days 1 and 6. (CyBOK §19.3.4.5)

---

**Q10.** Select **all** that are true about intrusion detection and prevention systems.
*(Objective 4.2)*

- A. An IDS observes and alerts; an IPS sits in the traffic path and can block
- B. An IPS that blocks incorrectly causes an outage, so its rules are usually tuned more conservatively than an IDS's
- C. Network IDS can inspect the contents of TLS-encrypted traffic without additional measures
- D. Both need somewhere to send alerts and someone to read them

*Answer:* **A, B, and D**: C is false, and it is the main practical limitation of network-based
detection today: with most traffic encrypted, a network sensor sees metadata (who talked to whom,
when, how much) rather than content, unless the organisation terminates TLS itself. (CyBOK
§19.4.2, §19.4.3)

---

**Q11.** With most traffic encrypted, what can network security monitoring still tell a defender?
*(Objective 4.2)*

- A. Nothing useful
- B. Metadata: which hosts talked to which, when, how often, how much data moved, and in which direction
- C. The full contents of every session
- D. Only the number of packets

*Answer:* **B**: This is exactly how the 74 GB exfiltration in the week 12 incident report would
have been visible: 400 MB chunks leaving between 01:00 and 04:00 to one external host is an obvious
pattern without reading a single byte. (CyBOK §19.4.3; §8.2.2)

---

**Q12.** What is the core idea of *zero trust networking*? *(Objective 4.2)*

- A. Trust nobody, so no access is granted to anyone
- B. Being on the internal network is not itself evidence of authorisation; every request is authenticated and authorised on its own merits
- C. Encrypt everything and skip access control
- D. Remove the firewall entirely

*Answer:* **B**: It is the network-layer expression of the *complete mediation* principle from
week 2: stop treating network location as a credential. (CyBOK §19.4.6; §1.4.1)

---

**Q13.** A small organisation can afford exactly one of these. Which gives the most risk reduction
for a typical internet-facing service? *(Objective 4.2)*

- A. A next-generation firewall with deep packet inspection
- B. Keeping internet-facing software patched and reducing the number of services exposed
- C. A honeypot
- D. An expensive threat intelligence feed

*Answer:* **B**: Attack surface reduction and patching consistently outperform additional detection
products, and cost less. This is not an argument against the other three, only about order.
(CyBOK §19.4; §2.6.4)

---

**Q14.** Select **all** that would have limited the damage in the
[NORTHWIND MEADOW incident](../data/incident-report.md) at the *network* level. *(Objective 4.2)*

- A. Segmenting the file servers away from general workstation traffic
- B. Egress filtering and alerting on large outbound transfers to previously unseen destinations
- C. Blocking all outbound HTTPS
- D. Alerting on a single internal host making regular periodic connections to one external host

*Answer:* **A, B, and D**: C is not a real option for an organisation that needs to work; a
recommendation nobody can implement is not a recommendation. The 47-second polling interval in D is
the kind of pattern that beaconing detection exists to find. (CyBOK §19.4.1, §19.4.3)

---

**Q15.** A network defense recommendation should always include one thing that students commonly
omit. What is it? *(Objective 4.2)*

- A. The vendor's product name
- B. What the control costs, in money, in performance, or in what it stops legitimate users doing
- C. The exact configuration syntax
- D. A reference to a compliance standard

*Answer:* **B**: Every control has a cost, and a recommendation that does not state it cannot be
evaluated by the person who has to approve it. This is graded in Lab 3, Lab 10, and Discussion 4.
(CyBOK §2.6.3)

---

## Canvas import notes

*Instructor note, not shown to students.* Items 3, 6, 10, and 14 are multiple-answer; the rest are
single-answer multiple choice. All items are worth 2 points.
