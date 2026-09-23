# Week 14: Web Security and Injection

**April 19-25 · Reading: 14 pages · Estimated total: 7 hours**

## Overview

Last week a program copied bytes into a buffer without knowing how big it was. This week a program
builds a *command* out of untrusted input without keeping the command and the data apart. It is the
same shape of mistake one layer up, and CyBOK groups them accordingly: §15.1.2 calls this class
**structured output generation vulnerabilities**.

Seeing the class rather than the individual bug is the point. SQL injection, cross-site scripting,
OS command injection, and path traversal are the same error against four different grammars, and
they have the same fix: never let untrusted input be parsed as part of the structure.

The week also covers phishing, which sits oddly in a technical chapter until you notice it is the
same idea again, a person parsing a message and being unable to tell the trustworthy part from the
attacker-supplied part.

## Objectives this week

- **[4.5](../objectives.md#tlo-4--analyzing-common-attacks-and-justifying-countermeasures)**: 
  Perform and then remediate a SQL injection, and explain why parameterization defeats it.
- **[5.5](../objectives.md#tlo-5--applying-authentication-authorization-and-secure-design-principles)**: 
  Recommend a prevention-first countermeasure for a class of vulnerability.

Quiz 5 also assesses **4.4**, **6.1**, and **6.4** from week 13.

## Read

| Source | Sections | Printed pages | Length | Time |
| --- | --- | --- | --- | --- |
| [CyBOK v1.1.0](../docs/CyBOK_v1.1.0.pdf) | §16.2.6-16.2.8 Web PKI and HTTPS, Authentication | 536-540 | 4 pp | 25 min |
| [CyBOK v1.1.0](../docs/CyBOK_v1.1.0.pdf) | §16.3.1 Phishing and Clickjacking | 543-545 | 3 pp | 20 min |
| [CyBOK v1.1.0](../docs/CyBOK_v1.1.0.pdf) | §16.4.1 Injection Vulnerabilities: SQLi, command injection, LFI, XSS, CSRF | 547-552 | 6 pp | 45 min |
| [CyBOK v1.1.0](../docs/CyBOK_v1.1.0.pdf) | §15.1.2 Structured Output Generation Vulnerabilities *(revisit from week 13)* | 501-503 | 2 pp | 15 min |
| OWASP Top 10 | A01 Broken Access Control, A03 Injection, A07 Identification and Authentication Failures |: | skim | 25 min |

OWASP Top 10: <https://owasp.org/www-project-top-ten/>. Read the three named entries; they are
short and each links real CWEs and example scenarios.

## Worked example

Run [data/sqli_demo.py](../data/sqli_demo.py) alongside this section. It needs nothing installed.

```
python3 sqli_demo.py
```

### 1. The bug, in one line

```python
return (
    "SELECT username, role FROM users "
    f"WHERE username = '{username}' AND password = '{password}'"
)
```

The user's input is pasted into the text of a command. Whatever they type becomes part of the
command, so a user who types SQL gets to run SQL. Nothing is broken in the database: it faithfully
executes what the application handed it.

### 2. The worked injection

Input `alice' -- ` as the username. The query becomes:

```sql
SELECT username, role FROM users WHERE username = 'alice' -- ' AND password = 'any-password-at-all'
```

Character by character:

- The `'` **closes** the string literal the application opened. Everything after it is no longer
  data; it is SQL.
- `--` begins a **comment**. Everything to the end of the line is ignored.
- Which means the entire `AND password = '...'` clause is gone.

The condition is now just `username = 'alice'`, which matches. You are logged in as alice, who is
an admin, without her password.

### 3. The famous payload that does not work

Now try `' OR '1'='1`, the injection everyone has heard of:

```sql
SELECT username, role FROM users WHERE username = '' OR '1'='1' AND password = 'any-password-at-all'
```

It returns nothing. Work out why before reading on.

SQL evaluates `AND` before `OR`, so the condition parses as:

```
username = ''   OR   ('1'='1' AND password = 'any-password-at-all')
```

The left side is false for every row. The right side requires the password to match, which it does
not. False for every row.

Adding a comment fixes it, `' OR '1'='1' -- ` truncates the password clause and leaves
`username = '' OR '1'='1'`, which is true for every row and returns the whole table. Lab 9 asks you
to find that yourself.

The reason this is in the lab: **the famous payload is a spell, and understanding why it fails here
is worth more than knowing it.** An attacker probing a real application does exactly this reasoning,
and so does a defender working out whether a report is real.

### 4. Why parameterization works, and what it is not

The fix:

```python
sql = "SELECT username, role FROM users WHERE username = ? AND password = ?"
connection.execute(sql, (username, password))
```

The `?` marks are **not** string substitution. Watch what the script prints:

```
SQL sent to the database: SELECT username, role FROM users WHERE username = ? AND password = ?
Values sent separately:   ("alice' -- ", 'any-password-at-all')
```

The query text and the values travel to the database **separately**. The database parses the
command once, with placeholders marking where values go, and then binds the values into the
already-parsed structure. The input is never part of the text being parsed, so **there is nothing
for it to escape out of**.

This is the distinction Lab 9 weights most heavily, so be precise about it:

- **Escaping** takes dangerous characters in the input and neuters them, so the input is still
  concatenated into the query text but hopefully cannot break out. It is an *approximation*, it
  depends on getting every character and every encoding right, and it is where injection bugs keep
  coming from.
- **Parameterization** removes the parsing step the attacker needs. There is no approximation to get
  wrong.

An answer that says "parameterization escapes the quotes for you" describes the weaker mechanism.

### 5. Why filtering is worse than it looks

A common instinct: strip `'`, `-`, and `;` from all input.

- **It breaks legitimate users.** O'Brien cannot create an account. Hyphenated street addresses fail.
  A control that produces wrong answers for real people is a defect, not a fix.
- **It is a denylist.** You are enumerating what is bad, which requires you to have thought of
  everything, every encoding, every Unicode homoglyph, every construct that does not need the
  characters you blocked.
- **It leaves the bug in place.** The query-building code is still there for the next developer to
  copy.

### 6. The class, not the bug

§15.1.2 groups these together, and the fix generalises:

| Vulnerability | The structure being built | The parameterized equivalent |
| --- | --- | --- |
| SQL injection | A SQL statement | Prepared statements with bound parameters |
| Cross-site scripting | An HTML document | Context-aware templating that escapes on output by default |
| OS command injection | A shell command line | Pass an argument array to the process, never a shell string |
| Path traversal | A filesystem path | Resolve and verify the path is inside the permitted directory |

In every row, the fix is the same idea: **keep the structure and the data separate, so the data
never gets parsed.**

And placing it on §15.2's ladder from week 13: parameterized queries are **API design**: the safe
interface exists and the unsafe one is available beside it. The level above would be a language or
library where a query cannot be built by concatenation at all, which some ORMs and query builders
approach. That is why "we have a coding standard about SQL" is weaker evidence than "the data
access layer makes concatenation impossible."

### 7. Phishing is the same problem, aimed at a person

§16.3.1 sits in the same chapter for a reason. A phishing email is untrusted input that a person
parses, and the attacker's goal is that the person cannot tell which parts are trustworthy. The
display name says the bank; the sending domain does not. The link text says one thing; the href says
another. `paypa1.example` and `paypal.example` differ by one glyph.

The defences run down the same ladder. Prevention: phishing-resistant authenticators from week 5, 
a FIDO2 key checks the origin itself, so the person's judgement is taken out of the loop.
Detection: mail filtering, and a reporting process people actually use. Mitigation: limiting what a
compromised account can reach, which is week 6's least privilege.

## Do this week

| | Task | Points | Due |
| --- | --- | ---: | --- |
| 1 | [Lab 9: SQL Injection](../assignments/lab-09-sql-injection.md) | 38 | Sunday |
| 2 | [Quiz 5: Software and Web Security](../quizzes/quiz-05-software-and-web.md), covers weeks 13-14 | 30 | Sunday |

**Everything in Lab 9 runs against a database inside one Python process on your own machine.**
Attacking a web application you do not have written permission to test is a crime and a violation of
the Student Code of Conduct. There is no exercise in this course that requires it.

## Key terms

| Term | Short form |
| --- | --- |
| **Injection** | Untrusted input becomes part of a command rather than staying data. |
| **Structured output generation vulnerability** | CyBOK's name for the class: SQLi, XSS, command injection, path traversal. |
| **Parameterized query** | Query text and values sent separately; values bound after parsing. |
| **Escaping** | Neutering dangerous characters in input that is still concatenated. Weaker. |
| **Cross-site scripting (XSS)** | Attacker-supplied content executed as script in another user's browser. |
| **Cross-site request forgery (CSRF)** | A user's browser induced to make an authenticated request they did not intend. |
| **Same-origin policy** | The browser's rule that content from one origin cannot read another's. |
| **Clickjacking** | Overlaying invisible UI so a click lands somewhere the user did not intend. |
| **Phishing** | Deceiving a person into giving up credentials or running something. |
| **Defence in depth** | Layered controls, so one failure is not total. |

## Time estimate

| Activity | Time |
| --- | --- |
| Reading (14 pages plus OWASP) | 2 hrs 10 min |
| This module page and running `sqli_demo.py` | 45 min |
| Lab 9 | 1 hr 30 min |
| Quiz 5 | 15 min |
| Review and slack | 2 hrs 15 min |
| **Total** | **~7 hrs** |

## Looking ahead

Week 15 is the last week of instruction, and it is about what happens after something has already
gone wrong: what your logs can and cannot tell you, how detection actually gets built, why
mathematically excellent detectors produce unusable alert queues, and how to write the memo.
