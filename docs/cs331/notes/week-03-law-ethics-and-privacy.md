# 3.01 Readings and Lecture Notes

**January 25-31 · Reading: 15 pages, plus 14 to skim · About 2 hrs 55 min with the worked example**

## Key terms

| Term | Short form |
| --- | --- |
| **Jurisdiction** | Whose law applies, and who can enforce it. More than one state's law can apply at once. |
| **Criminal vs. civil liability** | One act can produce both, in different courts, with different standards of proof. |
| **Personal data** | Data relating to an identifiable person. Obligations can follow the data subject, not the organization's location. |
| **Coordinated disclosure** | Report to the vendor, allow a window to fix, then publish. |
| **Full disclosure** | Publish immediately. |
| **Privacy as confidentiality** | The data is not disclosed. |
| **Privacy as control** | The subject decides what is collected and why. |
| **Privacy as transparency** | The subject can find out what happened to their data. |

## Readings

### CyBOK

| Source | Sections | Printed pages | Length | Approx. time |
| --- | --- | --- | --- | --- |
| [CyBOK §3.1](../cybok/03-law-and-regulation.md#_3-1-introductory-principles-of-law-and-legal-research) | §3.1 Introductory principles of law and legal research | 52-58 | 6 pp | 40 min |
| [CyBOK §3.4](../cybok/03-law-and-regulation.md#_3-4-data-protection) | §3.4 Data protection *(skim, for D2)* | 72-81 | 9 pp | 25 min |
| [CyBOK §3.5](../cybok/03-law-and-regulation.md#_3-5-computer-crime) | §3.5 Computer crime *(skim, for D2)* | 81-86 | 5 pp | 15 min |
| [CyBOK §3.13](../cybok/03-law-and-regulation-part-2.md#_3-13-ethics) | §3.13 Ethics: all of it, especially §3.13.3 on vulnerability testing and disclosure | 122-127 | 5 pp | 35 min |
| [CyBOK §5.2](../cybok/05-privacy-and-online-rights.md#_5-2-privacy-as-control) | §5.2 Privacy as Control | 185-187 | 2 pp | 15 min |
| [CyBOK §5.3](../cybok/05-privacy-and-online-rights.md#_5-3-privacy-as-transparency) | §5.3 Privacy as Transparency | 187-189 | 2 pp | 15 min |

**§3.4** and **§3.5** are skims because D2 asks you to use them. §3.4 is where obligations about
personal data live, and §3.5 is where the offenses against information systems are set out. Read
them for the structure, not the detail.

## Worked example

### Three ways to look at the same act

You find that a company's website returns different error messages for "no such account" and
"wrong password", which lets anyone confirm whether an email address has an account there.

**Technically**, this is a user enumeration weakness: it lets an outsider enumerate (list, one
guess at a time) which email addresses have accounts. It is real, it is common, and it is usually
rated low severity.

**Legally**, the question is not "is this a vulnerability" but "what did you do to find it, and
were you authorized?" Noticing it while using the site normally is one thing. Writing a script that
submits ten thousand email addresses is a different thing, and in many jurisdictions it is on the
wrong side of a line about unauthorized access or exceeding authorized access. CyBOK §3.5 sets out
the offense categories; §3.1.3 explains why the same act can produce both criminal and civil
liability, in different courts, under different standards of proof.

**Ethically**, the question is what you owe to three different parties who want different things:
the company, which would rather this stayed quiet; the users, who might want to know; and everybody
else who runs similar software.

Those three analyses can point in different directions, and the answer to "is this okay" depends on
which one you are asking.

### Privacy is not only secrecy

Most people's working definition of privacy is confidentiality: keeping data secret from people
who should not see it. CyBOK's Privacy chapter separates three ideas, and the distinction is what
D2 turns on.

- **Privacy as confidentiality (§5.1).** Data is not disclosed. This is the familiar one.
- **Privacy as control (§5.2).** The person the data is about decides what is collected and for
  what purpose. A company can hold your data perfectly securely and still violate this, by
  collecting what it does not need, or using it for something you did not agree to.
- **Privacy as transparency (§5.3).** You can find out what happened to your data. It comes in
  two forms: feedback (you are told at the time) and audit (you can check afterward).

The user enumeration example above is a **confidentiality** problem about a fact, who is a
customer. A company retaining location data it has no current use for is a **control** problem, and
no amount of encryption fixes it. A company that cannot tell you which of its employees looked at
your record is a **transparency** problem.

### The disclosure question

Suppose you decide to report it. CyBOK §3.13.3 describes the norms:

- **Coordinated disclosure** (CyBOK calls it responsible disclosure): tell the vendor, give them a
  reasonable window, then publish.
- **Full disclosure**: publish immediately, on the argument that users deserve to know and vendors
  only move under pressure.
- **No disclosure**: tell nobody, not even the vendor. CyBOK notes this is hard to square with the
  ACM (Association for Computing Machinery) Code's duty to report risks.

Coordinated disclosure is the mainstream position, and the argument for it is that it balances the
users' interest in a fix against their interest in not being attacked while one is being written.
The arguments against it are real: vendors sometimes use the window to do nothing, and sometimes to
threaten the reporter.

Now change one thing. **You found it inside your own employer.** The coordinated-disclosure
framework assumes an external researcher and a vendor who can be given a deadline. What is the
deadline when you work there? Who is the vendor? What is your leverage, and what does using it cost
you? That is the situation in [D2](../discussions/d02-ethics-and-privacy-case.md), and it does not
have a clean answer.

## Looking ahead

Week 4 is the first modeling week. You will take a written description of a system and turn it
into a threat model, which is the skill from this course you are most likely to use on the job. Lab
2 is also the first assignment that asks for a diagram and a table rather than paragraphs.

<!--@include: ../../../parts/cs331-questions-button.md-->
