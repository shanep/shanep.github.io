# CS 331: Readings and Resources

Every reading in this course is free and openly licensed. There is nothing to buy.

## Required text

> **The Cyber Security Body of Knowledge, version 1.1.0.**
> Awais Rashid, Howard Chivers, Emil Lupu, Andrew Martin, and Steve Schneider (eds.), July 2021.
> © Crown Copyright, The National Cyber Security Centre 2021. Licensed under the
> Open Government Licence v3.0.
> <http://www.nationalarchives.gov.uk/doc/open-government-licence/>
> Project home: <https://www.cybok.org/>

The complete PDF is in this course at [docs/CyBOK_v1.1.0.pdf](docs/CyBOK_v1.1.0.pdf) and in Canvas
Files. The Open Government Licence permits redistribution with attribution, which is why the book
can live inside the course instead of behind a link.

### Finding a page in the PDF

Two page numbering systems are in play, and they do not agree:

- **Printed page numbers** appear in the footer of every CyBOK page. All readings in this course
  are cited by printed page number.
- **Your PDF viewer's page counter** is roughly 39 higher, because the book opens with a cover
  block and thirty pages of front matter numbered in Roman numerals. The offset is not exactly
  constant, 42 pages in the body (full-page figures and part dividers) carry no footer.

**Navigate by section number, not page number.** Section numbers such as §10.4 are stable and
appear in the PDF's bookmarks panel and in your viewer's search box. Page numbers are given in the
schedule so you can estimate how long a reading is, not as the primary way to find it.

## What we read, and what we skip

CyBOK has 21 knowledge areas across 22 chapters. This course is the first security course most
students take and is capped at eight hours of work per week, so **we use about a third of the
book, deliberately**. The table below is the whole book, so you can see both what is assigned and
what is not.

| Ch | Knowledge Area | Printed p. | Used in CS 331 |
| ---: | --- | ---: | --- |
| 1 | Introduction | 1 | **Weeks 1-2**: §1.1-1.5 |
| 2 | Risk Management and Governance | 19 | **Week 4**: §2.2-2.4, §2.6.1-2.6.2, §2.6.6 |
| 3 | Law & Regulation | 49 | **Week 3**: §3.1, §3.13 |
| 4 | Human Factors | 145 | **Week 2**: §4.3-4.4 |
| 5 | Privacy & Online Rights | 171 | **Week 3**: §5.2-5.3 |
| 6 | Malware & Attack Technologies | 201 | **Week 12**: §6.1-6.2, §6.4 |
| 7 | Adversarial Behaviours | 223 | **Week 12**: §7.2 |
| 8 | Security Operations & Incident Management | 251 | **Week 15**: §8.1, §8.3.1-8.3.3, §8.7 |
| 9 | Forensics | 289 | Not assigned |
| 10 | Cryptography | 321 | **Weeks 7-8**: §10.3-10.8 |
| 11 | Operating Systems and Virtualisation | 357 | Not assigned |
| 12 | Distributed Systems Security | 393 | Not assigned |
| 13 | Formal Methods for Security | 425 | Not assigned |
| 14 | Authentication, Authorisation & Accountability | 465 | **Weeks 5-6**: §14.1-14.3, §14.5, §14.6 |
| 15 | Software Security | 497 | **Week 13**: §15.1.1, §15.2, §15.4 |
| 16 | Web & Mobile Security | 523 | **Week 14**: §16.2.6-16.2.8, §16.3.1, §16.4.1 |
| 17 | Secure Software Lifecycle | 557 | **Week 13**: §17.4 only |
| 18 | Applied Cryptography | 593 | **Week 10**: §18.3, §18.5.1 |
| 19 | Network Security | 645 | **Week 11**: §19.1, §19.3.2-19.3.3, §19.4 |
| 20 | Hardware Security | 681 | Not assigned |
| 21 | Cyber-Physical Systems Security | 707 | Not assigned |
| 22 | Physical Layer & Telecommunications Security | 741 | Not assigned |

Reference sections: Bibliography p. 773 · Acronyms p. 929 · **Glossary p. 951** · Index p. 963.
The glossary is the source for the *Key terms* list on every module page: it is worth
bookmarking.

### Why those chapters are not assigned

This is a design decision, not an oversight. A future instructor should know the reasoning:

| Not assigned | Why |
| --- | --- |
| 9 Forensics | Legal-process heavy (the Daubert standard, chain of custody); belongs in a dedicated digital forensics course. |
| 11 Operating Systems and Virtualisation | Assumes an operating systems course; our prerequisite floor is one programming course. |
| 12 Distributed Systems Security | Assumes distributed systems background. |
| 13 Formal Methods for Security | Requires logic and proof techniques well past this audience. |
| 17 Secure Software Lifecycle (except §17.4) | Assumes professional software engineering experience; §17.4 is kept because it is the course's only source on organizational assurance evidence. |
| 20 Hardware Security | Requires digital design and computer architecture. |
| 21 Cyber-Physical Systems Security | Domain-specific; better as a follow-on elective. |
| 22 Physical Layer & Telecommunications Security | Requires signals and communications theory. |
| 10.1 Mathematics, 10.2 Cryptographic Security Models | The two most mathematical sections of the cryptography chapter; the course starts at §10.3 and teaches cryptography by what it provides rather than by its proofs. |

## Weekly supplements

CyBOK is a reference, not a tutorial. One accessible supplement is paired with it in the weeks
where a worked treatment helps most. All are free.

| Week | Supplement | License | Link |
| ---: | --- | --- | --- |
| 2 | Saltzer and Schroeder, *The Protection of Information in Computer Systems* (1975), the eight design principles in §I only | Free to read | <https://web.mit.edu/Saltzer/www/publications/protection/> |
| 5 | NIST SP 800-63B-4, *Digital Identity Guidelines: Authentication and Authenticator Management* (July 2025), §3 | Public domain (U.S. Government) | <https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-63B-4.pdf> |
| 7-8 | Nakov, *Practical Cryptography for Developers*, the AES, cipher modes, hashing, RSA, and ECC pages | MIT | <https://cryptobook.nakov.com/> |
| 12 | MITRE ATT&CK: Enterprise matrix and selected technique pages | Free to use, MITRE terms | <https://attack.mitre.org/> |
| 13 | Aleph One, *Smashing the Stack for Fun and Profit*, Phrack 49, first third only | Free to read | <http://phrack.org/issues/49/14.html> |
| 14 | OWASP Top 10: A01 Broken Access Control, A03 Injection, A07 Identification and Authentication Failures | CC BY-SA | <https://owasp.org/www-project-top-ten/> |
| 15 | NIST SP 800-61r3, *Incident Response Recommendations and Considerations for Cybersecurity Risk Management* (April 2025) | Public domain (U.S. Government) | <https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-61r3.pdf> |

Two more references are used inside labs rather than as assigned reading:

| Used in | Resource | Link |
| --- | --- | --- |
| Lab 0 | CVE Program: look up one published vulnerability | <https://www.cve.org/> |
| Lab 8 | Compiler Explorer: inspect the assembly a C function compiles to, in the browser | <https://godbolt.org/> |

## Course data files

Labs use small data files that ship with the course in [data/](data/), a system description, a
vulnerable C program, five commented Python scripts, and two log files. See
[data/index.md](data/index.md) for what each one is and which lab uses it. Nothing there
requires a virtual machine, a server, or an internet connection.

## Software

| Tool | Needed for | Notes |
| --- | --- | --- |
| Python 3.11+ | Labs 4, 5, 6, 9, 10 and the week 5 worked example | Pre-installed on macOS and most Linux distributions |
| `cryptography` package | Labs 4 and 6 only | `pip install cryptography`; installed step by step in Lab 0 |
| A web browser | Labs 0, 6, 7, 8 | Any modern browser |

No virtual machine, no Docker, no Linux server, no git, no GitHub account.

## A note on links

Links in this repository are relative, so they resolve on GitHub and in any local markdown viewer.
**Canvas does not resolve relative paths.** When publishing these pages to Canvas, rewrite each
relative path to the corresponding Canvas page URL, or upload the files and link to them in Canvas
Files.

## Attribution and reuse

CyBOK material reproduced or paraphrased in course pages is used under the Open Government Licence
v3.0 and is attributed as: *"Adapted from The Cyber Security Body of Knowledge v1.1.0,
© Crown Copyright, The National Cyber Security Centre 2021, licensed under the Open Government
Licence v3.0."*

Course materials in this repository are released under the MIT License, like the rest of the
[site repository](https://github.com/shanep/shanep.github.io).
