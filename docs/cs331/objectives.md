# CS 331: Objective Alignment Sheet

Spring 2027 · Computer Security and Information Assurance

This page maps every learning objective in CS 331 to the exact assignment, quiz, or exam that
measures it. It is the markdown counterpart of
`docs/CS 331 Objective Alignment Sheet.xlsx` (sheet **Objectives**).

## Two facts that hold for every objective on this page

1. **Introduced in this course.** Nothing here is reviewed from, built on, or assumed covered in a
   previous course. CS 331 is the first security course students take, and it draws students from
   several departments; every objective is taught from the beginning.
2. **Required.** There are no optional objectives. Every objective below is attached to a
   mandatory, graded assignment.

Because these two columns from the spreadsheet are constant across all 34 supporting objectives,
they are stated once here rather than repeated in every row.

## How this page maps to the spreadsheet

| Spreadsheet column | Where it appears here |
| --- | --- |
| A: Obj. # | The `#` column; `TLO n` in each section heading |
| B: Objectives: The student will be able to… | The section heading (terminal) and the `The student will be able to…` column (supporting) |
| C: Introduced / Reviewed / Built On | Constant: **Introduced In This Course**, stated above |
| D: Required / Optional / Covered Previously | Constant: **Required**, stated above |
| E: Bloom Level | The `Bloom` column, and the italic line under each terminal objective |
| F: Knowledge Type | The `Knowledge type` column, and the italic line under each terminal objective |
| G: How it will be assessed | The `How it will be assessed` column, naming the specific rubric rows or quiz items |
| H: Location in course | The `Location in course` column, as a week number and a link to the assessment |
| I: NOTES | Notes appear beneath the table for the terminal objectives that need one |

**Bloom levels** use the spreadsheet's controlled vocabulary: Create · Evaluate · Apply ·
Understand · Remember. **Knowledge types** likewise: Principle · Process · Procedure · Concept ·
Fact.

**A note on links.** The `Location in course` links are repository-relative, so they resolve on
GitHub and in any local markdown viewer. Canvas does not resolve relative paths, when this page
is published to Canvas, rewrite each path to the corresponding Canvas page URL.

---

## TLO 1: Security goals, terminology, principles, ethics, and regulation

> **The student will be able to** explain core security goals, terminology, first principles,
> ethical obligations, and the role of privacy and regulation in security practice.

*Introduced in this course · Required · Bloom: Understand · Knowledge type: Concept*

| # | The student will be able to… | Bloom | Knowledge type | How it will be assessed | Location in course |
| --- | --- | --- | --- | --- | --- |
| 1.1 | Define confidentiality, integrity, and availability, and identify which goal a described failure violates. | Remember | Fact | Lab 0 rubric row 3; Quiz 1 items 1-4 | Week 1: [Lab 0: Course Setup and CyBOK Navigation](assignments/lab-00-course-setup.md) · Week 3: [Quiz 1: Foundations](quizzes/quiz-01-foundations.md) |
| 1.2 | Use the terms threat, vulnerability, attack, and risk correctly in writing about a security incident. | Understand | Concept | D1 rubric row 1; Quiz 1 items 5-7 | Week 1: [D1: Introductions and the Security Mindset](discussions/d01-introductions-and-security-mindset.md) · Week 3: [Quiz 1: Foundations](quizzes/quiz-01-foundations.md) |
| 1.3 | Apply the Saltzer and Schroeder design principles to critique a familiar system. | Apply | Principle | Lab 1 rubric rows 2-3; Quiz 1 items 8-10 | Week 2: [Lab 1: Security Principles Audit](assignments/lab-01-security-principles-audit.md) · Week 3: [Quiz 1: Foundations](quizzes/quiz-01-foundations.md) |
| 1.4 | Explain how human error and usability failures contribute to security incidents. | Understand | Concept | Lab 1 rubric row 3; Quiz 1 items 11-12 | Week 2: [Lab 1: Security Principles Audit](assignments/lab-01-security-principles-audit.md) · Week 3: [Quiz 1: Foundations](quizzes/quiz-01-foundations.md) |
| 1.5 | Describe the legal, regulatory, and ethical constraints on security work, including vulnerability disclosure and privacy obligations. | Understand | Principle | D2 rubric row 1; Quiz 1 items 13-15 | Week 3: [D2: Ethics and Privacy Case](discussions/d02-ethics-and-privacy-case.md) · Week 3: [Quiz 1: Foundations](quizzes/quiz-01-foundations.md) |

**Notes.** Objectives 1.1-1.2 are also carried forward into the midterm, which assumes fluent use
of this vocabulary throughout. Reading support: CyBOK §1.1-1.5, §3.1, §3.13, §4.3-4.4, §5.2-5.3.

---

## TLO 2: Modeling subjects, objects, permissions, trust boundaries, and threats

> **The student will be able to** model subjects, objects, permissions, trust boundaries, and
> threats using access control matrices, policy descriptions, and basic threat models.

*Introduced in this course · Required · Bloom: Apply · Knowledge type: Process*

| # | The student will be able to… | Bloom | Knowledge type | How it will be assessed | Location in course |
| --- | --- | --- | --- | --- | --- |
| 2.1 | Draw a data flow diagram for a described system and mark its trust boundaries. | Apply | Procedure | Lab 2 rubric row 1 | Week 4: [Lab 2: Threat Model a Small System](assignments/lab-02-threat-model.md) |
| 2.2 | Enumerate threats against a system using STRIDE and record them in a threat table. | Apply | Procedure | Lab 2 rubric row 2 | Week 4: [Lab 2: Threat Model a Small System](assignments/lab-02-threat-model.md) |
| 2.3 | Assess the likelihood and impact of identified threats using a stated risk method. | Apply | Process | Lab 2 rubric row 3 | Week 4: [Lab 2: Threat Model a Small System](assignments/lab-02-threat-model.md) |
| 2.4 | Construct an access control matrix for a given set of subjects, objects, and permissions. | Apply | Procedure | Lab 3 rubric row 1 | Week 6: [Lab 3: Access Control Matrix and Least Privilege](assignments/lab-03-access-control-matrix.md) |
| 2.5 | Express an access control policy as an ACL, a capability list, and an RBAC assignment, and state the tradeoffs among them. | Apply | Concept | Lab 3 rubric rows 2-3; Midterm part C | Week 6: [Lab 3: Access Control Matrix and Least Privilege](assignments/lab-03-access-control-matrix.md) · Week 9: [Midterm Exam](assignments/midterm-exam-guide.md) |

**Notes.** Objective 2.4 requires students to *construct* a matrix, which needs a rubric rather
than a multiple-choice item: this is why week 6 carries a lab rather than a discussion. Reading
support: CyBOK §2.2-2.6, §14.1-14.3, §14.6.

---

## TLO 3: Comparing cryptographic mechanisms and their limits

> **The student will be able to** compare symmetric encryption, public-key cryptography, hashing,
> digital signatures, key management, and secure communication protocols, including their
> assumptions and limitations.

*Introduced in this course · Required · Bloom: Understand · Knowledge type: Concept*

| # | The student will be able to… | Bloom | Knowledge type | How it will be assessed | Location in course |
| --- | --- | --- | --- | --- | --- |
| 3.1 | Explain what a block cipher and a mode of operation each provide, and demonstrate why ECB mode leaks structure. | Understand | Process | Lab 4 rubric row 2; Quiz 3 items 1-5 | Week 7: [Lab 4: Symmetric Encryption in Practice](assignments/lab-04-symmetric-encryption.md) · Week 8: [Quiz 3: Cryptography](quizzes/quiz-03-cryptography.md) |
| 3.2 | Distinguish confidentiality from integrity and authenticity, and name the primitive that supplies each. | Understand | Concept | Lab 4 rubric rows 3-4; Quiz 3 items 6-9 | Week 7: [Lab 4: Symmetric Encryption in Practice](assignments/lab-04-symmetric-encryption.md) · Week 8: [Quiz 3: Cryptography](quizzes/quiz-03-cryptography.md) |
| 3.3 | Compare symmetric and public-key cryptography by key distribution, performance, and typical use. | Understand | Concept | Lab 5 rubric row 4; Quiz 3 items 10-15 | Week 8: [Lab 5: Hashing and Signatures](assignments/lab-05-hashing-and-signatures.md) · Week 8: [Quiz 3: Cryptography](quizzes/quiz-03-cryptography.md) |
| 3.4 | Verify a digital signature and explain what a verification failure does and does not prove. | Apply | Procedure | Lab 5 rubric rows 2-3 | Week 8: [Lab 5: Hashing and Signatures](assignments/lab-05-hashing-and-signatures.md) |
| 3.5 | Interpret an X.509 certificate chain and identify the trust assumptions and failure modes of public key infrastructure. | Analyze | Process | Lab 6 rubric rows 1-4 | Week 10: [Lab 6: Certificates and TLS](assignments/lab-06-certificates-and-tls.md) |

**Notes.** Objectives 3.1-3.4 fall before the midterm and are assessed there; 3.5 falls after
spring break and is assessed on the final. CyBOK's cryptography chapter opens with two heavily
mathematical sections (§10.1 Mathematics, §10.2 Cryptographic Security Models) that are **not
assigned**: this course starts at §10.3. Reading support: CyBOK §10.3-10.8, §18.3, §18.5.1.

---

## TLO 4: Analyzing common attacks and justifying countermeasures

> **The student will be able to** analyze common attacks and vulnerabilities, including phishing,
> network attacks, SQL injection, and buffer overflows, and justify appropriate countermeasures.

*Introduced in this course · Required · Bloom: Analyze · Knowledge type: Process*

| # | The student will be able to… | Bloom | Knowledge type | How it will be assessed | Location in course |
| --- | --- | --- | --- | --- | --- |
| 4.1 | Explain how common network attacks work at the protocol layer where they operate. | Understand | Process | D4 rubric row 1; Quiz 4 items 1-7 | Week 11: [D4: Network Security in the News](discussions/d04-network-security-in-the-news.md) · Week 11: [Quiz 4: Network Security](quizzes/quiz-04-network-security.md) |
| 4.2 | Recommend network defenses (firewalling, segmentation, and monitoring) for a described network. | Apply | Principle | D4 rubric row 2; Quiz 4 items 8-15 | Week 11: [D4: Network Security in the News](discussions/d04-network-security-in-the-news.md) · Week 11: [Quiz 4: Network Security](quizzes/quiz-04-network-security.md) |
| 4.3 | Classify malware by the CyBOK taxonomy and map an incident's observed behavior, including phishing used for initial access, to MITRE ATT&CK techniques. | Analyze | Concept | Lab 7 rubric rows 1-3 | Week 12: [Lab 7: Malware Triage Without Malware](assignments/lab-07-malware-triage.md) |
| 4.4 | Trace a buffer overflow in C source to the stack layout that makes it exploitable, and evaluate which mitigations would stop it. | Analyze | Process | Lab 8 rubric rows 1-3; Quiz 5 items 1-4 | Week 13: [Lab 8: Memory Safety and Assurance Evidence](assignments/lab-08-memory-safety-and-assurance.md) · Week 14: [Quiz 5: Software and Web Security](quizzes/quiz-05-software-and-web.md) |
| 4.5 | Perform and then remediate a SQL injection, and explain why parameterization defeats it. | Analyze | Procedure | Lab 9 rubric rows 1-3; Quiz 5 items 5-8 | Week 14: [Lab 9: SQL Injection](assignments/lab-09-sql-injection.md) · Week 14: [Quiz 5: Software and Web Security](quizzes/quiz-05-software-and-web.md) |

**Notes.** Phishing is assessed inside objective 4.3 as an initial-access technique, which is how
it appears in real incident reporting and in MITRE ATT&CK (T1566). No lab in this course requires
running malware, exploiting a live system, or attacking a machine you do not own; Lab 8 analyzes
source code and compiler output, and Lab 9 attacks a local SQLite database that ships with the
course. Reading support: CyBOK §6.1-6.4, §7.2, §15.1-15.4, §16.2-16.4, §19.1-19.4.

---

## TLO 5: Applying authentication, authorization, and secure design principles

> **The student will be able to** apply authentication, authorization, least privilege, separation
> of privilege, fail-safe defaults, and other secure design principles to a system design.

*Introduced in this course · Required · Bloom: Apply · Knowledge type: Principle*

| # | The student will be able to… | Bloom | Knowledge type | How it will be assessed | Location in course |
| --- | --- | --- | --- | --- | --- |
| 5.1 | Select authentication factors appropriate to a stated threat model and justify the choice. | Apply | Principle | D3 rubric row 1; Quiz 2 items 1-4 and 9-12 | Week 5: [D3: Authentication Policy Critique](discussions/d03-authentication-policy-critique.md) · Week 5: [Quiz 2: Authentication](quizzes/quiz-02-authentication.md) |
| 5.2 | Evaluate a real password and multi-factor authentication policy against NIST SP 800-63B-4. | Evaluate | Principle | D3 rubric rows 1-2; Quiz 2 items 5-8 and 13-15 | Week 5: [D3: Authentication Policy Critique](discussions/d03-authentication-policy-critique.md) · Week 5: [Quiz 2: Authentication](quizzes/quiz-02-authentication.md) |
| 5.3 | Apply least privilege and separation of privilege to reduce an over-broad permission assignment. | Apply | Principle | Lab 3 rubric row 4 | Week 6: [Lab 3: Access Control Matrix and Least Privilege](assignments/lab-03-access-control-matrix.md) |
| 5.4 | Apply fail-safe defaults and complete mediation when critiquing a system design. | Apply | Principle | Lab 1 rubric row 2 | Week 2: [Lab 1: Security Principles Audit](assignments/lab-01-security-principles-audit.md) |
| 5.5 | Recommend a prevention-first countermeasure (a language, API, or coding practice) for a class of vulnerability. | Apply | Principle | Lab 8 rubric row 4; Lab 9 rubric row 4; Quiz 5 items 9-11 | Week 13: [Lab 8: Memory Safety and Assurance Evidence](assignments/lab-08-memory-safety-and-assurance.md) · Week 14: [Lab 9: SQL Injection](assignments/lab-09-sql-injection.md) · Week 14: [Quiz 5: Software and Web Security](quizzes/quiz-05-software-and-web.md) |

**Notes.** This objective is spread deliberately: principles are introduced in week 2 (5.4),
applied to authentication in week 5 (5.1, 5.2), to authorization in week 6 (5.3), and to code in
weeks 13-14 (5.5). Reading support: CyBOK §1.4, §14.1-14.5, §15.2; NIST SP 800-63B-4 §3.

---

## TLO 6: Interpreting assurance arguments and evidence

> **The student will be able to** interpret assurance arguments and evidence, and evaluate whether
> a system's security claims are supported by its design, implementation, and testing.

*Introduced in this course · Required · Bloom: Evaluate · Knowledge type: Principle*

| # | The student will be able to… | Bloom | Knowledge type | How it will be assessed | Location in course |
| --- | --- | --- | --- | --- | --- |
| 6.1 | Distinguish prevention, detection, and mitigation of vulnerabilities as distinct classes of assurance evidence. | Understand | Concept | Lab 8 rubric row 5; Quiz 5 items 12-13 | Week 13: [Lab 8: Memory Safety and Assurance Evidence](assignments/lab-08-memory-safety-and-assurance.md) · Week 14: [Quiz 5: Software and Web Security](quizzes/quiz-05-software-and-web.md) |
| 6.2 | Identify what a static or dynamic analysis result does and does not establish about a program. | Analyze | Concept | Lab 8 rubric row 5 | Week 13: [Lab 8: Memory Safety and Assurance Evidence](assignments/lab-08-memory-safety-and-assurance.md) |
| 6.3 | Evaluate whether stated security claims about a system are supported by the design and testing evidence offered. | Evaluate | Principle | Lab 8 rubric row 5; Final exam part B | Week 13: [Lab 8: Memory Safety and Assurance Evidence](assignments/lab-08-memory-safety-and-assurance.md) · Finals: [Final Exam](assignments/final-exam-guide.md) |
| 6.4 | Describe how a maturity model or evaluation scheme (SAMM, BSIMM, or the Common Criteria) supplies organizational assurance evidence. | Understand | Process | Quiz 5 items 14-15; Final exam part B | Week 14: [Quiz 5: Software and Web Security](quizzes/quiz-05-software-and-web.md) · Finals: [Final Exam](assignments/final-exam-guide.md) |

**Notes.** This terminal objective has four supporting objectives rather than five. It is the
narrowest outcome in the course: assurance is taught in one week (13) through CyBOK §15.2, §15.4,
and §17.4, and assessed through Lab 8's closing section, Quiz 5, and the final exam. If assurance
needs more weight in a future offering, the natural place to add it is Lab 8's evidence section
rather than an additional week, the 8-hour weekly budget has no room for a sixteenth topic.

---

## TLO 7: Analyzing detection data and recommending a response

> **The student will be able to** analyze basic intrusion-detection data and recommend a
> defensible response using an appropriate detection model.

*Introduced in this course · Required · Bloom: Analyze · Knowledge type: Process*

| # | The student will be able to… | Bloom | Knowledge type | How it will be assessed | Location in course |
| --- | --- | --- | --- | --- | --- |
| 7.1 | Identify the data sources a detection capability draws on and state what each can and cannot show. | Understand | Concept | Lab 10 rubric row 1 | Week 15: [Lab 10: Log Analysis and Incident Memo](assignments/lab-10-log-analysis-and-incident-memo.md) |
| 7.2 | Distinguish misuse detection from anomaly detection and choose one for a stated scenario. | Evaluate | Concept | Lab 10 rubric row 4; Final exam part C | Week 15: [Lab 10: Log Analysis and Incident Memo](assignments/lab-10-log-analysis-and-incident-memo.md) · Finals: [Final Exam](assignments/final-exam-guide.md) |
| 7.3 | Analyze authentication and web server logs to identify brute-force and scanning activity. | Analyze | Procedure | Lab 10 rubric rows 2-3 | Week 15: [Lab 10: Log Analysis and Incident Memo](assignments/lab-10-log-analysis-and-incident-memo.md) |
| 7.4 | Explain the base-rate fallacy and its effect on alert volume in a detection system. | Understand | Principle | Lab 10 rubric row 5; Final exam part C | Week 15: [Lab 10: Log Analysis and Incident Memo](assignments/lab-10-log-analysis-and-incident-memo.md) · Finals: [Final Exam](assignments/final-exam-guide.md) |
| 7.5 | Recommend a defensible incident response structured according to NIST SP 800-61r3. | Evaluate | Process | Lab 10 rubric row 6; D5 rubric row 1 | Week 15: [Lab 10: Log Analysis and Incident Memo](assignments/lab-10-log-analysis-and-incident-memo.md) · Week 15: [D5: A Current Security Failure](discussions/d05-current-security-failure.md) |

**Notes.** Objective 7.4 (the base-rate fallacy) is the one piece of quantitative reasoning in the
course; it is taught with worked arithmetic on the week 15 module page so that students without a
statistics background can complete it. Reading support: CyBOK §8.1, §8.3.1-8.3.6, §8.7;
NIST SP 800-61r3.

---

## Reverse index: what each assessment measures

The table an assessment reviewer usually wants: one row per graded item, listing the supporting
objectives it measures and its point value.

| Week | Assessment | Points | Objectives measured |
| --- | --- | ---: | --- |
| 1 | [Lab 0: Course Setup and CyBOK Navigation](assignments/lab-00-course-setup.md) | 20 | 1.1 |
| 1 | [D1: Introductions and the Security Mindset](discussions/d01-introductions-and-security-mindset.md) | 15 | 1.2 |
| 1 | [Diagnostic self-check](quizzes/quiz-00-diagnostic.md) | 0 | Ungraded; no objective measured |
| 2 | [Lab 1: Security Principles Audit](assignments/lab-01-security-principles-audit.md) | 38 | 1.3, 1.4, 5.4 |
| 3 | [D2: Ethics and Privacy Case](discussions/d02-ethics-and-privacy-case.md) | 30 | 1.5 |
| 3 | [Quiz 1: Foundations](quizzes/quiz-01-foundations.md) | 30 | 1.1, 1.2, 1.3, 1.4, 1.5 |
| 4 | [Lab 2: Threat Model a Small System](assignments/lab-02-threat-model.md) | 38 | 2.1, 2.2, 2.3 |
| 5 | [D3: Authentication Policy Critique](discussions/d03-authentication-policy-critique.md) | 30 | 5.1, 5.2 |
| 5 | [Quiz 2: Authentication](quizzes/quiz-02-authentication.md) | 30 | 5.1, 5.2 |
| 6 | [Lab 3: Access Control Matrix and Least Privilege](assignments/lab-03-access-control-matrix.md) | 38 | 2.4, 2.5, 5.3 |
| 7 | [Lab 4: Symmetric Encryption in Practice](assignments/lab-04-symmetric-encryption.md) | 38 | 3.1, 3.2 |
| 8 | [Lab 5: Hashing and Signatures](assignments/lab-05-hashing-and-signatures.md) | 38 | 3.3, 3.4 |
| 8 | [Quiz 3: Cryptography](quizzes/quiz-03-cryptography.md) | 30 | 3.1, 3.2, 3.3 |
| 9 | [Midterm Exam](assignments/midterm-exam-guide.md) | 150 | 1.1-1.5, 2.1-2.5, 3.1-3.4, 5.1-5.4 |
| 10 | [Lab 6: Certificates and TLS](assignments/lab-06-certificates-and-tls.md) | 38 | 3.5 |
| 11 | [D4: Network Security in the News](discussions/d04-network-security-in-the-news.md) | 30 | 4.1, 4.2 |
| 11 | [Quiz 4: Network Security](quizzes/quiz-04-network-security.md) | 30 | 4.1, 4.2 |
| 12 | [Lab 7: Malware Triage Without Malware](assignments/lab-07-malware-triage.md) | 38 | 4.3 |
| 13 | [Lab 8: Memory Safety and Assurance Evidence](assignments/lab-08-memory-safety-and-assurance.md) | 38 | 4.4, 5.5, 6.1, 6.2, 6.3 |
| 14 | [Lab 9: SQL Injection](assignments/lab-09-sql-injection.md) | 38 | 4.5, 5.5 |
| 14 | [Quiz 5: Software and Web Security](quizzes/quiz-05-software-and-web.md) | 30 | 4.4, 4.5, 5.5, 6.1, 6.4 |
| 15 | [Lab 10: Log Analysis and Incident Memo](assignments/lab-10-log-analysis-and-incident-memo.md) | 38 | 7.1, 7.2, 7.3, 7.4, 7.5 |
| 15 | [D5: A Current Security Failure](discussions/d05-current-security-failure.md) | 30 | 7.5 |
| Finals | [Final Exam](assignments/final-exam-guide.md) | 150 | 3.5, 4.1-4.5, 6.1-6.4, 7.1-7.5 |
| Finals | [D6: Final Reflection](discussions/d06-final-reflection.md) | 15 | Self-assessment against TLO 1-7; no single objective scored |
| | **Total** | **1000** | |

## Coverage check

Every one of the 34 supporting objectives is measured by **at least two independent graded
items**, counting the midterm and final. The table below is the count per objective.

| TLO | Supporting objective | Measured by | Count |
| --- | --- | --- | ---: |
| 1 | 1.1 | Lab 0, Quiz 1, Midterm | 3 |
| 1 | 1.2 | D1, Quiz 1, Midterm | 3 |
| 1 | 1.3 | Lab 1, Quiz 1, Midterm | 3 |
| 1 | 1.4 | Lab 1, Quiz 1, Midterm | 3 |
| 1 | 1.5 | D2, Quiz 1, Midterm | 3 |
| 2 | 2.1 | Lab 2, Midterm | 2 |
| 2 | 2.2 | Lab 2, Midterm | 2 |
| 2 | 2.3 | Lab 2, Midterm | 2 |
| 2 | 2.4 | Lab 3, Midterm | 2 |
| 2 | 2.5 | Lab 3, Midterm | 2 |
| 3 | 3.1 | Lab 4, Quiz 3, Midterm | 3 |
| 3 | 3.2 | Lab 4, Quiz 3, Midterm | 3 |
| 3 | 3.3 | Lab 5, Quiz 3, Midterm | 3 |
| 3 | 3.4 | Lab 5, Midterm | 2 |
| 3 | 3.5 | Lab 6, Final | 2 |
| 4 | 4.1 | D4, Quiz 4, Final | 3 |
| 4 | 4.2 | D4, Quiz 4, Final | 3 |
| 4 | 4.3 | Lab 7, Final | 2 |
| 4 | 4.4 | Lab 8, Quiz 5, Final | 3 |
| 4 | 4.5 | Lab 9, Quiz 5, Final | 3 |
| 5 | 5.1 | D3, Quiz 2, Midterm | 3 |
| 5 | 5.2 | D3, Quiz 2, Midterm | 3 |
| 5 | 5.3 | Lab 3, Midterm | 2 |
| 5 | 5.4 | Lab 1, Midterm | 2 |
| 5 | 5.5 | Lab 8, Lab 9, Quiz 5 | 3 |
| 6 | 6.1 | Lab 8, Quiz 5, Final | 3 |
| 6 | 6.2 | Lab 8, Final | 2 |
| 6 | 6.3 | Lab 8, Final | 2 |
| 6 | 6.4 | Quiz 5, Final | 2 |
| 7 | 7.1 | Lab 10, Final | 2 |
| 7 | 7.2 | Lab 10, Final | 2 |
| 7 | 7.3 | Lab 10, Final | 2 |
| 7 | 7.4 | Lab 10, Final | 2 |
| 7 | 7.5 | Lab 10, D5, Final | 3 |

Objectives whose only performance measure is a single lab (2.1-2.3, 2.4, 3.4, 3.5, 4.3, 5.3, 5.4,
6.2, 7.1, 7.3) are all assessed by lab rubric rows, which carry the largest per-item point values
in the course; the exam item that also samples them is a recognition-level check rather than a
second performance measure. That is the honest limit of what a course with no multi-week project
can claim.
