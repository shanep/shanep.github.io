# Quiz 5: Software and Web Security

**Week 14 · 30 points · 15 questions × 2 points · 15 minutes · one attempt · taken in Canvas**

Covers weeks 13-14: memory-safety vulnerabilities and their mitigations, injection and web
vulnerabilities, prevention-first countermeasures, and assurance evidence.

## Objectives assessed

| Items | Objective |
| --- | --- |
| 1-4 | **4.4**: Trace a buffer overflow to the stack layout that makes it exploitable, and evaluate which mitigations would stop it |
| 5-8 | **4.5**: Perform and remediate a SQL injection, and explain why parameterization defeats it |
| 9-11 | **5.5**: Recommend a prevention-first countermeasure for a class of vulnerability |
| 12-13 | **6.1**: Distinguish prevention, detection, and mitigation as classes of assurance evidence |
| 14-15 | **6.4**: Describe how SAMM, BSIMM, or the Common Criteria supply organizational assurance evidence |

([TLO 4](../objectives.md#tlo-4--analyzing-common-attacks-and-justifying-countermeasures) ·
[TLO 5](../objectives.md#tlo-5--applying-authentication-authorization-and-secure-design-principles) ·
[TLO 6](../objectives.md#tlo-6--interpreting-assurance-arguments-and-evidence))

---

**Q1.** In `check_badge()` from [vuln.c](../data/vuln.c), `buffer` holds 32 bytes. What is the
longest badge ID the function handles correctly? *(Objective 4.4)*

- A. 32 characters
- B. 31 characters
- C. 33 characters
- D. 16 characters

*Answer:* **B**: `strcpy` copies the string *and* its terminating zero byte, so 31 characters plus
one terminator exactly fills 32 bytes. Off-by-one errors of exactly this kind are a large fraction
of real memory-safety bugs. (CyBOK §15.1.1)

---

**Q2.** In the compiled layout of `check_badge()`, `buffer` sits at `[rbp-48]` and `authorized`
sits at `[rbp-52]`. An attacker supplies an over-long badge ID. What happens? *(Objective 4.4)*

- A. `authorized` is overwritten with 1, so the door opens
- B. The overflow writes toward higher addresses, past the end of `buffer`, so it reaches the saved frame pointer and return address but never touches `authorized`
- C. Nothing; the compiler prevents it
- D. The program refuses the input

*Answer:* **B**: `authorized` is at a *lower* address than `buffer`, and a buffer overflow writes
upward. Local variable ordering is a compiler decision, not a source-code decision, which is why
Lab 8 makes you read the assembly rather than guess. (CyBOK §15.1.1)

---

**Q3.** Select **all** that are true about stack canaries. *(Objective 4.4)*

- A. They place a known value between the local buffers and the saved return address, and check it before returning
- B. They remove the buffer overflow from the program
- C. They convert many exploitable overflows into a controlled crash
- D. They stop an attacker from overwriting other local variables adjacent to the buffer

*Answer:* **A and C**: B is false and is the point: the bug is still there. D is false: a canary
sits below the saved return address, so it does nothing about a write into another local that sits
between the buffer and the canary. (CyBOK §15.4.1)

---

**Q4.** A function has a stack buffer overflow. The build enables stack canaries, ASLR, and a
non-executable stack. Which statement is accurate? *(Objective 4.4)*

- A. The vulnerability has been fixed
- B. The vulnerability is still present; exploitation is harder, and the likely outcome shifts from code execution toward a crash, which is still a denial of service
- C. The vulnerability is now only a performance problem
- D. Mitigations of this kind are not worth enabling

*Answer:* **B**: Mitigations raise the cost of exploitation. They are worth enabling and they are
not a fix, and describing them to a manager as though they were is the failure Lab 8 asks you to
avoid. (CyBOK §15.4)

---

**Q5.** Why does the input `alice' -- ` log an attacker in as alice without her password?
*(Objective 4.5)*

- A. It guesses a common password
- B. The `'` closes the username string literal and `--` starts a SQL comment, so the rest of the query (including the password check) is ignored
- C. It causes a buffer overflow in the database
- D. It exploits a bug in SQLite

*Answer:* **B**: Nothing is broken in the database. The application handed it a command it faithfully
executed. (CyBOK §16.4.1.1)

---

**Q6.** The input `' OR '1'='1` is famous, but it does **not** work against
`WHERE username = '...' AND password = '...'`. Why? *(Objective 4.5)*

- A. SQLite rejects it as a syntax error
- B. The resulting condition is `username = '' OR ('1'='1' AND password = '...')`, because AND binds tighter than OR, so the password check still has to pass
- C. The application filters it out
- D. It works; the demonstration is wrong

*Answer:* **B**: Operator precedence saves this particular query. Adding `-- ` to comment out the
rest of the condition is what makes it work, as you found in Lab 9 Step 3. (CyBOK §16.4.1.1)

---

**Q7.** Why does a parameterized query defeat injection? *(Objective 4.5)*

- A. It escapes dangerous characters in the input
- B. The query text and the values travel to the database separately; the command is parsed once with placeholders, and values are bound into the already-parsed structure, so input is never parsed as SQL
- C. It encrypts the input
- D. It validates that the input contains only letters and digits

*Answer:* **B**: This is the distinction Lab 9 turns on. Escaping (A) is a weaker, error-prone
approximation of the same goal; parameterization removes the parsing step the attacker needs.
(CyBOK §15.1.2, §16.4.1.1)

---

**Q8.** Select **all** that belong to the same class of vulnerability as SQL injection, where a
program builds a structured string out of untrusted input. *(Objective 4.5)*

- A. Cross-site scripting
- B. OS command injection
- C. Use-after-free
- D. Path traversal in a constructed file path

*Answer:* **A, B, and D**: CyBOK §15.1.2 calls these *structured output generation
vulnerabilities*. C is a memory-management vulnerability, a different category with different
countermeasures. Seeing the class rather than the individual bug is what makes the fix
generalisable. (CyBOK §15.1.2)

---

**Q9.** CyBOK §15.2 orders countermeasures from most to least fundamental. Which ordering is
correct? *(Objective 5.5)*

- A. Coding practices, then API design, then language and type system
- B. Language and type system, then API design, then coding practices
- C. Testing, then mitigation, then prevention
- D. There is no ordering; all countermeasures are equivalent

*Answer:* **B**: A language that makes a bug class impossible beats an API that makes it hard,
which beats a practice that asks developers to remember. Each level down relies more on human
consistency. (CyBOK §15.2)

---

**Q10.** Select **all** that are *prevention-first* countermeasures for memory-safety
vulnerabilities, in CyBOK's sense. *(Objective 5.5)*

- A. Writing the component in a memory-safe language
- B. Enabling ASLR
- C. Replacing unbounded copy functions with bounded ones throughout the codebase
- D. Running a fuzzer nightly

*Answer:* **A and C**: B is mitigation: the bug remains and exploitation gets harder. D is
detection: it might find bugs, and finding is not preventing. (CyBOK §15.2, §15.3, §15.4)

---

**Q11.** A team fixes a SQL injection by stripping `'`, `-`, and `;` from all input. Select **all**
the problems with this. *(Objective 5.5)*

- A. It breaks legitimate input, names like O'Brien and hyphenated addresses
- B. It enumerates what is bad rather than defining what is safe, so it fails against encodings and constructs nobody thought of
- C. It leaves the vulnerable query-building code in place for the next developer to reuse
- D. It is slower than a parameterized query

*Answer:* **A, B, and C**: D is not the objection; performance is irrelevant here. The real
problems are correctness for real users, the fragility of denylists, and leaving the actual defect
in the codebase. (CyBOK §15.1.2, §15.2.3)

---

**Q12.** Sort these into prevention, detection, and mitigation. Which mapping is correct?
*(Objective 6.1)*

- A. Fuzzing = prevention; memory-safe language = detection; ASLR = mitigation
- B. Memory-safe language = prevention; static analysis = detection; stack canaries = mitigation
- C. Static analysis = prevention; ASLR = detection; fuzzing = mitigation
- D. All three are the same category

*Answer:* **B**: Prevention stops the bug existing. Detection finds bugs that do exist. Mitigation
makes existing bugs harder to exploit without removing them. Each supplies a different kind of
assurance evidence and none substitutes for another. (CyBOK §15.2, §15.3, §15.4)

---

**Q13.** A static analyser reports zero findings on a file, and a 48-hour fuzzing run produces no
crash. What do these results establish? *(Objective 6.1)*

- A. The file contains no vulnerabilities
- B. The analyser's rules matched nothing in this file, and those particular fuzzing inputs did not crash it, neither establishes the absence of a vulnerability
- C. The file is formally verified
- D. Nothing at all; both techniques are worthless

*Answer:* **B**: Both are real evidence and neither is proof. D overcorrects: absence of findings
is weak evidence, not no evidence, and both techniques find real bugs routinely. (CyBOK §15.3)

---

**Q14.** What does a BSIMM or SAMM assessment tell you? *(Objective 6.4)*

- A. That a specific release of the product is free of vulnerabilities
- B. Something about the maturity of the organisation's software security *practices* (what activities it performs), not about the security of any particular release
- C. That the product has been formally verified
- D. That the organisation has been penetration tested

*Answer:* **B**: Maturity models describe process. A mature process makes good outcomes more
likely; it does not certify any individual artefact. Conflating the two is the single most common
mistake in reading assurance claims. (CyBOK §17.4.1-17.4.2)

---

**Q15.** Select **all** that are true about the Common Criteria. *(Objective 6.4)*

- A. It evaluates a specific product against a stated set of security claims, at a stated level of rigour
- B. A high evaluation level means the product is secure in every environment and use
- C. The claims being evaluated are defined for the evaluation, so a certificate is only as meaningful as what it covers
- D. It is an evaluation of a product, whereas BSIMM assesses an organisation's practices

*Answer:* **A, C, and D**: B is false, and C is why: a Common Criteria certificate says a specific
product met specific claims under specific assumptions. Reading which claims, and which assumptions,
is the entire skill. (CyBOK §17.4.3)

---

## Canvas import notes

*Instructor note, not shown to students.* Items 3, 8, 10, 11, and 15 are multiple-answer; the rest
are single-answer multiple choice. All items are worth 2 points.
