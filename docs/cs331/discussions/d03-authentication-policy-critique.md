# D3: Authentication Policy Critique

**Week 5 · 30 points · about 60 minutes · Canvas discussion board**

## Objectives assessed

- **5.1**: Select authentication factors appropriate to a stated threat model and justify the
  choice.
- **5.2**: Evaluate a real password and multi-factor authentication policy against
  NIST SP 800-63B-4.

([TLO 5](../objectives.md#tlo-5--applying-authentication-authorization-and-secure-design-principles))

## Time estimate

| | |
| --- | --- |
| Find a policy and read NIST §3 | 15 min |
| Run `password_demo.py` | 10 min |
| Initial post | 25 min |
| Two replies | 15 min |
| **Total** | **65 min** |

## Before you start

- CyBOK §14.5 (printed pages 479-489), authentication.
- NIST SP 800-63B-4 §3, *Authentication and Authenticator Management*:
  <https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-63B-4.pdf>
  It is a long document. Read §3 and skim the rest.
- Run [data/password_demo.py](../data/password_demo.py) (the week 5 worked example) before you
  post. You will cite its output.

## Find a real policy

Find the **actual, published password and authentication policy** of a real organisation. Options,
easiest first:

- **Boise State's own**: the password requirements shown when you change your BroncoID password,
  plus what Duo does and does not cover.
- **Your bank, your employer, or a service you use.** Most publish requirements on the
  password-change screen even when there is no formal policy document.
- **A policy you can see by trying to create an account**: sign up for something and record what
  it demanded and what it allowed.

Record the actual rules: minimum and maximum length, composition requirements, expiry, reuse rules,
whether paste is allowed, what second factors are offered, and whether the second factor is required
or optional. **Quote or screenshot the rules.** If you cannot find a documented policy, say so and
record what the interface enforced: that absence is itself a finding.

**Do not post credentials, and do not post anything that identifies your own account.**

## Initial post

**Due: Thursday of week 5. About 400-500 words.**

Four labelled parts.

### 1. The policy, as it is

State the organisation (or "a regional bank" if you would rather not name it) and list its rules.
A table is fine.

### 2. Against NIST SP 800-63B-4

Go rule by rule. For each, say whether SP 800-63B-4 **supports it, advises against it, or is
silent**, and cite the part of §3 you are relying on.

Pay particular attention to the four things NIST changed the industry's mind about:

- **Composition rules** (must contain an upper case letter, a digit, a symbol)
- **Scheduled expiry** in the absence of evidence of compromise
- **Blocking paste**, which breaks password managers
- **Screening against breached-password lists**, which most policies still do not do

Then state a verdict: **how many of this policy's rules would NIST advise against?**

### 3. What the demonstration showed

Run [password_demo.py](../data/password_demo.py) and quote **two numbers** from your own run:
the guesses-per-second under the fast hash and under PBKDF2.

Then answer: the same two accounts were cracked either way, and `carol` was cracked by neither.
**Given that, what does the storage choice actually buy, and what does it not?** Three or four
sentences. Be precise: this is the distinction the rubric is looking for.

### 4. Factors for a threat model

Pick **one** specific threat this organisation plausibly faces. Name it concretely: credential
stuffing with passwords from other breaches; targeted phishing of a finance employee; a stolen
unlocked phone; an insider who already has network access.

Then recommend **which authentication factors** this organisation should require, and justify it
*against that threat*, not in general. Say explicitly:

- Which factor types (knowledge, possession, inherence) and which specific mechanism.
- **What it costs**: money, support burden, or what it stops legitimate users doing. Every
  recommendation in this course names its cost.
- **What your recommendation does not solve.** There is always something.

If your chosen threat is phishing, you should be able to say why not all second factors are equal
against it.

## Replies

**Due: Sunday of week 5. Two replies, about 150 words each.**

Reply to **two** classmates who evaluated a **different organisation** than you. Do one of these:

- **Challenge a NIST reading.** If you think they scored a rule wrong, say which and cite §3.
- **Attack the recommendation.** Take their part 4 and describe a realistic attack that gets
  through it anyway. Then say whether that makes the recommendation wrong or just incomplete.
- **Price it.** If their recommendation would cost the organisation more than they said, say what
  they left out, help desk calls for lost tokens, users locked out, staff without smartphones.

## Rubric

| Row | What is assessed | Points |
| --- | --- | ---: |
| 1 | Initial post: a real policy quoted with its actual rules; every rule evaluated against SP 800-63B-4 §3 with a citation and a verdict count; the two demo numbers quoted from the student's own run and correctly interpreted; a specific threat named with factors recommended against it, a stated cost, and a stated limitation | 18 |
| 2 | Two substantive replies to classmates who evaluated different organisations, each challenging a reading, attacking a recommendation, or pricing it | 12 |
| | **Total** | **30** |

**What row 1 is looking for in part 3:** slow hashing does not make a weak password strong and does
not stop a correct guess from being correct. It changes the attacker's rate (roughly a million
guesses a second down to about fifteen), which is decisive across a large wordlist and irrelevant
for a password that is in the first twenty entries.

## Ground rules

The [ground rules from D1](d01-introductions-and-security-mindset.md#ground-rules-for-every-discussion-in-this-course)
apply. Additionally: do not post your own credentials, do not post screenshots containing your
username or account details, and do not test any authentication system beyond creating an account
you are entitled to create.

## AI disclosure

You may use AI tools. If you do, add a sentence saying which and what for, per the
[AI policy](../index.md#ai-policy). Parts 1 and 3 require a policy you actually looked at and
numbers from a script you actually ran.
