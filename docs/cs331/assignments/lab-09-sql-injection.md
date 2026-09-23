# Lab 9: SQL Injection

**Week 14 · 38 points · about 90 minutes · submit in Canvas**

## Goal

Break a login form, then fix it, then explain why the fix works. The whole thing runs on a database
that lives inside one Python process on your own machine and disappears when the program exits.

**Nothing in this lab touches a system you do not own.** Attacking a web application you do not have
written permission to test is a crime under both federal and Idaho law, and it is a violation of
the [Student Code of Conduct](https://www.boisestate.edu/policy/student-affairs/code-of-conduct/).
Everything you need is in the provided script.

## Objectives assessed

- **4.5**: Perform and then remediate a SQL injection, and explain why parameterization defeats it.
- **5.5**: Recommend a prevention-first countermeasure for a class of vulnerability.

([TLO 4](../objectives.md#tlo-4--analyzing-common-attacks-and-justifying-countermeasures) ·
[TLO 5](../objectives.md#tlo-5--applying-authentication-authorization-and-secure-design-principles))

## Time estimate

| Step | Time |
| --- | --- |
| Step 1: run it, read the code | 20 min |
| Step 2: the worked injection | 20 min |
| Step 3: your own injection | 25 min |
| Step 4: the fix, and why it works | 25 min |
| **Total** | **90 min** |

## Before you start

- CyBOK §16.4.1 (printed pages 547-552), injection vulnerabilities, especially **§16.4.1.1
  SQL-Injection**.
- CyBOK §15.1.2 (printed pages 501-503), structured output generation vulnerabilities. This is the
  general category SQL injection belongs to, and reading it will change how you see the fix.
- OWASP Top 10 **A03: Injection**: <https://owasp.org/Top10/A03_2021-Injection/>
- Download [data/sqli_demo.py](../data/sqli_demo.py) from Canvas Files. It uses only the Python
  standard library, no `pip install` needed.

## Steps

### Step 1: Run it and read it

```
python3 sqli_demo.py
```

It runs four cases and prints, for each, the exact SQL sent to the database. Save the full output.

Then read the source. You only need two functions:

- `vulnerable_query()`, builds the SQL by pasting the user's input into the query text.
- `login_safe()`, passes the query and the values to the database separately.

Answer:

1. **Quote the line in `vulnerable_query()` that creates the vulnerability.**
2. In case 1 (an honest login), **the two versions sent different things to the database.** Quote
   both and describe the difference in one sentence.
3. Both versions returned the same answer for cases 1 and 2. **So what is the safe version buying,
   if the answers are the same?**

### Step 2: The worked injection

Case 3 used the input `alice' -- ` as a username and logged in as alice without her password.

1. **Quote the SQL that was sent** in case 3's vulnerable run.
2. **Explain how it works**, character by character. What does the `'` do? What does `--` do? What
   happened to the password check?
3. **Why did the safe version reject it?** Quote what it sent and explain in two or three sentences
   what the database did with the string `alice' -- ` instead of executing it.
4. Alice is flagged `admin` in this database. **Name what an attacker gains** beyond access to one
   account, and connect it to a STRIDE category from Lab 2.

### Step 3: Your own injection

Case 4 uses the input `' OR '1'='1`, which is the payload everyone has heard of. **It does not
work here.** That is the exercise.

1. **Quote the SQL that case 4 produced** and explain, precisely, why it returns nothing. The hint
   in the script is that SQL evaluates `AND` before `OR`, work through the resulting condition and
   show your reasoning.
2. **Fix it.** Edit `INJECTION_RETURN_ALL` at the top of the script so that case 4 returns **all
   three accounts**. Run it again.
   - Paste your working input.
   - Paste the SQL it produced.
   - Paste the result line showing three rows.
3. **Explain your payload** in two or three sentences: what does it do to the condition, and why
   does it now match every row?
4. Try **two more inputs of your own** against the vulnerable version and record what each did, 
   including ones that fail. A syntax error is a result; paste it and say what it tells an attacker
   who is probing blind. (Note what the vulnerable version does with an unmatched quote, and what
   an error message like that would reveal on a real site.)
5. Confirm that **every input you tried in this step fails against the safe version**, and paste one
   example.

### Step 4: The fix, and why it works

1. **State the mechanism.** In about 150 words, explain why parameterization defeats injection.
   Your answer must distinguish between *escaping the input* and *never letting the input be
   parsed as SQL in the first place*. They are not the same thing and only one of them is the
   actual mechanism here.
2. **Filtering is not the fix.** Suppose a developer instead strips the characters `'`, `-`, and
   `;` from every input. Give **two separate reasons** this is worse than parameterization. At
   least one should be about correctness for legitimate users.
3. **Generalise it.** CyBOK §15.1.2 calls this class *structured output generation
   vulnerabilities*. Name **two other vulnerabilities in the same class** (where a program
   builds a structured string out of untrusted input), and for each, name the equivalent of a
   parameterized query.
4. **Defence in depth.** Parameterization fixes this bug. Name **three other controls** that would
   limit the damage if a different injection bug slipped through somewhere else in the application,
   and say what each one limits. At least one should be an access control decision from Lab 3.
5. **Where the fix belongs.** Using CyBOK §15.2's ordering (language and type system, then API
   design, then coding practices), say which level parameterized queries sit at, and describe what
   a fix one level *more* fundamental would look like. Which would you rather have on a new project,
   and why?

## What to submit

One Canvas submission containing:

1. Your full first-run output.
2. Numbered answers to Steps 1-4.
3. Your working `INJECTION_RETURN_ALL` value, the SQL it produced, and the three-row result.
4. Your two additional inputs and what each did.

## Rubric

| Row | What is assessed | Points |
| --- | --- | ---: |
| 1 | Step 2: the case 3 SQL quoted and explained character by character; why the safe version rejected it; the admin-account consequence tied to a STRIDE category | 10 |
| 2 | Step 3, question 1: the operator-precedence explanation is correct and worked through, not asserted | 8 |
| 3 | Step 3, questions 2-5: a working payload that returns all three rows, with its SQL and result pasted; the payload explained; two further inputs recorded including what an error message leaks; the safe version confirmed to reject them | 12 |
| 4 | Step 4: the escaping-versus-parsing distinction made correctly; two reasons filtering is worse; two other structured-output vulnerabilities with their parameterized equivalents; three defence-in-depth controls including an access control one; the §15.2 level identified with a more fundamental alternative | 8 |
| | **Total** | **38** |

**What row 4 question 1 turns on:** parameterization works because the query text and the data
travel to the database *separately*. The database parses the command once, with placeholders where
the values go, and then binds the values into the already-parsed structure. The input is never part
of the text being parsed, so there is nothing for it to escape out of. An answer that says
"parameterization escapes the quotes for you" describes a different, weaker mechanism and does not
earn this row.

## AI disclosure

You may use AI tools on this assignment. If you do, add one or two sentences saying which tool and
what for, per the [AI policy](../index.md#ai-policy).

An AI tool will hand you a working payload for Step 3 question 2 in about a second. It will not do
Step 3 question 1 (explaining why the *famous* payload fails against this particular query), and
that is deliberately worth more points.
