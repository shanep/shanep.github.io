# D2: Ethics and Privacy Case

**Week 3 · 30 points · about 60 minutes · Canvas discussion board**

## Objectives assessed

- **1.5**: Describe the legal, regulatory, and ethical constraints on security work, including
  vulnerability disclosure and privacy obligations.
  ([TLO 1](../objectives.md#tlo-1--security-goals-terminology-principles-ethics-and-regulation))

## Time estimate

| | |
| --- | --- |
| Read the case and the CyBOK sections | 15 min |
| Initial post | 30 min |
| Two replies | 15 min |
| **Total** | **60 min** |

## The case

> Priya is a junior developer at a regional insurance company. While debugging an unrelated problem,
> she notices that the customer portal's password reset endpoint will accept any email address and
> return, in the error message, whether that address has an account and the first three characters
> of the account holder's surname. With a list of email addresses, anyone could confirm who holds a
> policy with the company.
>
> She reports it to her manager. Her manager says the company is two weeks from a major release,
> that this is "an information leak, not a breach", and that it will go on the backlog.
>
> Six weeks later it is still on the backlog. Priya mentions it again and is told the release
> schedule has not changed and to stop asking.
>
> She is now considering four options:
>
> 1. Drop it. It is not her decision.
> 2. Escalate internally, to her manager's manager, or to whoever handles compliance.
> 3. Report it to the state insurance regulator or a data protection authority.
> 4. Post the details publicly so that customers know, and so the company is forced to act.
>
> She has also realised something else: to demonstrate the problem convincingly to anyone, she
> would need to run it against real customer email addresses. She has access to the customer
> database as part of her job.

## Initial post

**Due: Thursday of week 3. About 400-500 words.**

Address all four of these, clearly labelled.

### 1. Is this a privacy problem, and of what kind?

The endpoint does not leak policy details, medical information, or payment data. It leaks *who is a
customer*. Using CyBOK §5.2 and §5.3, argue whether that is a meaningful privacy harm, and for
whom. Give at least one concrete example of a person for whom "this individual holds insurance with
this company" is sensitive information.

### 2. What are the legal and regulatory dimensions?

Using CyBOK §3.1 and §3.4, identify at least **two** distinct legal or regulatory questions this
raises. You are not expected to know the law of any particular jurisdiction, and I am not grading
you on statutory accuracy: you are being graded on identifying the *kinds* of legal question at
stake and who they run to.

### 3. What should Priya do, and why not the others?

Pick **one** of the four options. Then:

- Give the strongest argument for it.
- Give the strongest argument *against* it, the one a reasonable person who disagrees with you
  would make.
- Say what would change your mind.

Using CyBOK §3.13 on ethics and §3.13.2 on disclosure, explain how the professional norms around
disclosure apply to someone reporting a problem *inside* their own employer, where the usual
coordinated-disclosure timeline does not obviously fit.

### 4. The last paragraph of the case

Priya would need to run the technique against real customer addresses to demonstrate it. She has
authorised access to that data for her job.

Answer directly: **may she do it?** Consider whether authorised access for one purpose is
authorisation for this purpose, what CyBOK §3.5 says about unauthorised access, and what it would
mean for her position if she did. Then say what she should do instead to make the problem credible
to someone with authority.

## Replies

**Due: Sunday of week 3. Two replies, about 150 words each.**

Reply to **two** classmates, at least one of whom chose a **different option in part 3** than you
did.

Useful moves:

- Take their "argument against" and make it stronger than they did.
- Point at a consequence for a third party (the customers, Priya's colleagues, the regulator) that their analysis did not consider.
- Say what evidence or fact, if added to the case, would flip your own position.

Agreement is fine. Agreement with a reason that the original post did not give is a good reply;
agreement with no addition is not.

## Rubric

| Row | What is assessed | Points |
| --- | --- | ---: |
| 1 | Initial post: all four parts addressed; the privacy harm characterised with a concrete example; two distinct legal or regulatory questions identified; a position taken with its strongest counterargument and a stated condition for changing it; part 4 answered directly with the authorisation question addressed; CyBOK cited by section | 18 |
| 2 | Two substantive replies, at least one to a classmate who chose a different option, each adding an argument, a consequence, or a condition rather than restating agreement | 12 |
| | **Total** | **30** |

**What loses points in row 1:** picking an option without engaging with the counterargument, and
treating part 4 as rhetorical. It is not rhetorical, answer it.

## Ground rules

The [ground rules from D1](d01-introductions-and-security-mindset.md#ground-rules-for-every-discussion-in-this-course)
apply. In particular: if this case resembles something at a place you have worked, change the
details enough that it is not identifiable.

## AI disclosure

You may use AI tools. If you do, add a sentence saying which and what for, per the
[AI policy](../index.md#ai-policy). Part 3's "what would change your mind" is the hardest thing
in this assignment to outsource and the most valuable thing in it to do yourself.
