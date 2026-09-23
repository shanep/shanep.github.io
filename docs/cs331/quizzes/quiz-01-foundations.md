# 3.04 Quiz 1: Foundations

**Week 3 · 30 points · 15 questions × 2 points · 15 minutes · one attempt · taken in Canvas**

Covers weeks 1-3: security goals and terminology, the design principles, human factors, and the
legal, regulatory, and ethical setting.

## Objectives assessed

| Items | Objective |
| --- | --- |
| 1-4 | **1.1**: Define confidentiality, integrity, and availability, and identify which goal a described failure violates |
| 5-7 | **1.2**: Use the terms threat, vulnerability, attack, and risk correctly |
| 8-10 | **1.3**: Apply the Saltzer and Schroeder design principles to critique a familiar system |
| 11-12 | **1.4**: Explain how human error and usability failures contribute to security incidents |
| 13-15 | **1.5**: Describe the legal, regulatory, and ethical constraints on security work |

([TLO 1](../objectives.md#tlo-1--security-goals-terminology-principles-ethics-and-regulation))

---

**Q1.** A ransomware attack encrypts a company's files. The company has no backups. The attacker
does not read the files or alter their contents before encrypting them. Which security goal is
primarily violated? *(Objective 1.1)*

- A. Confidentiality
- B. Integrity
- C. Availability
- D. Non-repudiation

*Answer:* **C**: The data still exists and has not been altered, but the owner cannot reach it.
That is availability. Note that modern ransomware usually exfiltrates first, which adds a
confidentiality violation, but this question specifies that it did not. (CyBOK §1.3.1)

---

**Q2.** Select **all** that apply. A misconfigured cloud storage bucket allows anyone on the
internet to list and download a company's customer database. Which goals are violated?
*(Objective 1.1)*

- A. Confidentiality
- B. Integrity
- C. Availability
- D. None

*Answer:* **A only**: The data is disclosed to people not entitled to it. Nothing was altered and
the legitimate owners can still reach it. A common wrong answer adds integrity; read-only exposure
does not alter anything. (CyBOK §1.3.1)

---

**Q3.** Which of these is the best one-sentence definition of *integrity*? *(Objective 1.1)*

- A. Data is kept secret from unauthorised parties
- B. Data has not been altered except by parties authorised to alter it, and alterations are detectable
- C. Data is available when authorised parties need it
- D. Data is stored in an encrypted form

*Answer:* **B**: Integrity is about unauthorised *modification*, and about being able to tell.
D describes a mechanism, not a goal, and encryption on its own supplies confidentiality rather than
integrity. (CyBOK §1.3.1)

---

**Q4.** An attacker floods a university's registration site so that no student can reach it during
the registration window. No data is read, altered, or lost. Which goal is violated?
*(Objective 1.1)*

- A. Confidentiality
- B. Integrity
- C. Availability
- D. All three

*Answer:* **C**: Denial of service targets availability specifically. (CyBOK §1.3.1)

---

**Q5.** A web application does not check the length of a user-supplied field before copying it into
a fixed buffer. No one has exploited it. What is this? *(Objective 1.2)*

- A. A threat
- B. A vulnerability
- C. An attack
- D. A risk

*Answer:* **B**: A weakness in the system that could be exploited is a vulnerability. It becomes
an attack only when someone acts on it, and the *risk* is the combination of how likely that is
with how bad it would be. (CyBOK Glossary; §2.6.2)

---

**Q6.** Match the term to the description. Which pairing is correct? *(Objective 1.2)*

- A. Threat = a weakness in the system; Risk = someone who wants to exploit it
- B. Threat = a potential cause of an unwanted incident; Risk = the combination of likelihood and impact
- C. Threat = an incident that has occurred; Vulnerability = the resulting damage
- D. Risk = a weakness in the system; Attack = the possibility of harm

*Answer:* **B**: A threat is potential; a risk quantifies how much that potential matters by
combining how likely it is with how much harm it would do. (CyBOK §2.6.2)

---

**Q7.** Select **all** that are true about risk. *(Objective 1.2)*

- A. Risk can be reduced to zero by applying enough controls
- B. Risk assessment requires stating the scale being used for likelihood and impact
- C. A threat with high impact but negligible likelihood may be a lower priority than one with moderate impact and high likelihood
- D. Risk exists only where a vulnerability exists

*Answer:* **B and C**: A is false: residual risk always remains, and CyBOK is explicit that risk
is managed, not eliminated. D is false: threats such as natural events create risk without a
software vulnerability. B is the point CyBOK §2.6.2 insists on, ratings mean nothing without a
stated scale. (CyBOK §2.2, §2.6.2)

---

**Q8.** A building's door controller is configured so that if the network link to the access server
fails, all doors unlock. Which design principle does this violate? *(Objective 1.3)*

- A. Economy of mechanism
- B. Fail-safe defaults
- C. Open design
- D. Least common mechanism

*Answer:* **B**: Fail-safe defaults says the default should be denial. Note the genuine tension
here: fire codes may require doors to unlock so people can escape, which is a real conflict between
safety and security, but it is still a fail-safe-defaults decision, made deliberately. (CyBOK
§1.4.1)

---

**Q9.** A file-sharing service checks your permission when you first open a document and then lets
you keep working for the rest of the day without rechecking, even if your access is revoked in the
meantime. Which principle is violated? *(Objective 1.3)*

- A. Complete mediation
- B. Separation of privilege
- C. Psychological acceptability
- D. Economy of mechanism

*Answer:* **A**: Complete mediation requires that *every* access to *every* object be checked
*every* time. Caching an authorisation decision is exactly the failure this principle names.
(CyBOK §1.4.1)

---

**Q10.** Select **all** that are examples of *separation of privilege*. *(Objective 1.3)*

- A. Requiring two different administrators to approve a production database deletion
- B. Requiring both a password and a hardware token to log in
- C. Giving a backup service read-only access instead of full access
- D. Requiring a manager's countersignature on expense claims over $5,000

*Answer:* **A, B, and D**: Separation of privilege means more than one condition must be satisfied
before access is granted. C is *least privilege*: one condition, but a narrower grant. Students
routinely confuse these two, and the difference is exactly the number of conditions. (CyBOK §1.4.1)

---

**Q11.** Staff at a company routinely write their passwords on sticky notes under their keyboards.
The password policy requires 16 characters, forbids password managers, and forces a change every 30
days. Using CyBOK's treatment of human factors, what is the best analysis? *(Objective 1.4)*

- A. The staff are careless and need more security awareness training
- B. The policy imposes a task people cannot perform, so they route around it; the policy is the defect
- C. Sticky notes are an acceptable control in a physically secure office
- D. The policy should be made stricter to compensate

*Answer:* **B**: CyBOK §4.3 and the psychological acceptability principle both say the same thing:
when a control demands more than people can deliver, they will find a workaround, and the
predictable workaround is a property of the design, not a moral failing of the users. (CyBOK §4.3;
§1.4.1)

---

**Q12.** Select **all** that CyBOK's Human Factors chapter supports. *(Objective 1.4)*

- A. Security mechanisms should fit the task and the human, not the other way round
- B. Most security-relevant human error is deliberate misconduct
- C. Awareness training alone reliably changes behaviour
- D. If a secure path is slower than an insecure one, expect people to take the insecure one

*Answer:* **A and D**: B is false; the great majority of security-relevant human error is ordinary
people doing reasonable things under time pressure. C is false; CyBOK §4.4 is explicit that
awareness campaigns on their own have a poor record of changing behaviour. (CyBOK §4.2.1, §4.3,
§4.4)

---

**Q13.** A student discovers a serious vulnerability in a local company's public website while
browsing it normally. Which of these is the most defensible next step? *(Objective 1.5)*

- A. Test how far the vulnerability goes, to document the impact properly before reporting it
- B. Report it to the company through a published security contact or disclosure process, without further testing
- C. Post the details publicly so users can protect themselves
- D. Say nothing, because reporting it could get them in trouble

*Answer:* **B**: Further testing without authorisation is very likely unlawful regardless of your
intent, and "I was going to report it" is not a defence. Report through the published channel; if
there is not one, report to a general contact and document that you stopped. CyBOK §3.13.2 covers
disclosure and §3.5 covers the offences involved. (CyBOK §3.5, §3.13.1-3.13.2)

---

**Q14.** Select **all** that are true about the legal setting for security work, as CyBOK
describes it. *(Objective 1.5)*

- A. Whether an act is a crime can depend on which country's law applies, and more than one may
- B. Good intentions generally make unauthorised access to a computer system lawful
- C. Data protection obligations can apply to an organisation because of *whose* data it processes, not only because of where the organisation is
- D. "Hacking back" against an attacker is broadly permitted for private organisations

*Answer:* **A and C**: B is false; intent rarely converts unauthorised access into authorised
access. D is false; CyBOK §3.6.2 describes self-help of this kind as disfavoured and generally
unlawful for private parties. (CyBOK §3.2, §3.4, §3.5, §3.6.2)

---

**Q15.** A company collects location data from its app that it does not need for any current
feature, on the grounds that it might be useful later. Setting aside whether this is legal in any
particular jurisdiction, which privacy concept does it most directly conflict with?
*(Objective 1.5)*

- A. Privacy as confidentiality, keeping data secret from outsiders
- B. Privacy as control, the data subject deciding what is collected and for what purpose
- C. Privacy as transparency, telling people what happened to their data afterwards
- D. None; collecting data is never itself a privacy problem

*Answer:* **B**: CyBOK §5.2 frames privacy as control over collection and use, not only as secrecy
after the fact. Data collected without a purpose cannot be meaningfully consented to, and it becomes
a liability the moment the company is breached. (CyBOK §5.1-5.2)

---

## Canvas import notes

*Instructor note, not shown to students.* Items 2, 7, 10, 12, and 14 are multiple-answer; the rest
are single-answer multiple choice. All items are worth 2 points. Multiple-answer items should be
set to require all correct options and no incorrect ones for credit.
