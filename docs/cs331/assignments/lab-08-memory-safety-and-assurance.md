# Lab 8: Memory Safety and Assurance Evidence

**Week 13 · 38 points · about 90 minutes · submit in Canvas**

## Goal

Read a small C program with a textbook bug in it, work out what that bug does to the stack, and
decide which of the standard mitigations would actually stop it. Then answer the question that
matters more: what evidence would let you claim the program is now fixed?

**You will not run this program and you will not attack anything.** You read source code and you
read the assembly a compiler produces from it, in a browser. That is all.

## Objectives assessed

- **4.4**: Trace a buffer overflow in C source to the stack layout that makes it exploitable, and
  evaluate which mitigations would stop it.
- **5.5**: Recommend a prevention-first countermeasure for a class of vulnerability.
- **6.1**: Distinguish prevention, detection, and mitigation of vulnerabilities as distinct
  classes of assurance evidence.
- **6.2**: Identify what a static or dynamic analysis result does and does not establish.
- **6.3**: Evaluate whether stated security claims are supported by the design and testing
  evidence offered.

([TLO 4](../objectives.md#tlo-4--analyzing-common-attacks-and-justifying-countermeasures) ·
[TLO 5](../objectives.md#tlo-5--applying-authentication-authorization-and-secure-design-principles) ·
[TLO 6](../objectives.md#tlo-6--interpreting-assurance-arguments-and-evidence))

## Time estimate

| Step | Time |
| --- | --- |
| Step 1: read the code | 15 min |
| Step 2: the stack, in Compiler Explorer | 30 min |
| Step 3: mitigations | 20 min |
| Step 4: prevention and evidence | 25 min |
| **Total** | **90 min** |

## Before you start

- CyBOK §15.1.1 (printed pages 500-501), memory management vulnerabilities.
- CyBOK §15.2 (printed pages 507-512), prevention of vulnerabilities: language design, API design,
  coding practices.
- CyBOK §15.4 (printed pages 516-520), mitigating exploitation of vulnerabilities.
- CyBOK §17.4 (printed pages 582-585), SAMM, BSIMM, and the Common Criteria.
- Aleph One, *Smashing the Stack for Fun and Profit*, Phrack 49, read from the start through the
  section that lays out the stack frame; stop when it starts writing shellcode.
  <http://phrack.org/issues/49/14.html>
- Open [data/vuln.c](../data/vuln.c). You need it in front of you for the whole lab.

## Steps

### Step 1: Read the code

Read `check_badge()` in [vuln.c](../data/vuln.c).

1. **Name the bug** in one sentence, and quote the line it is on.
2. `strcpy` is not a broken function: it does exactly what it documents. **State precisely what
   information `strcpy` is never given**, and why that makes this call unsafe here but would not
   make every call to it unsafe.
3. `buffer` holds 32 bytes. **What is the longest badge ID this function handles correctly**, and
   why is it not 32?
4. Using CyBOK §15.1.1, **name the category** this vulnerability belongs to, and name one other
   vulnerability in the same category.

### Step 2: Look at the stack

Open <https://godbolt.org/>. Paste in **only** the `check_badge` function plus the two declarations
it needs, like this:

```c
char *strcpy(char *, const char *);
int strcmp(const char *, const char *);
static const char *ADMIN_BADGE = "ADMIN-0001";

int check_badge(const char *badge_id)
{
    char buffer[32];
    int authorized = 0;
    strcpy(buffer, badge_id);
    if (strcmp(buffer, ADMIN_BADGE) == 0) { authorized = 1; }
    return authorized;
}
```

Set the compiler to **x86-64 gcc** or **x86-64 clang** (any recent version) and the compiler options
box to:

```
-O0 -fno-stack-protector
```

Now read the assembly.

1. **Quote the function prologue**: the `push`, `mov`, and `sub` instructions at the top.
2. **Find where `buffer` lives.** Look for the `lea` instruction that computes the address passed
   to `strcpy`. It will read something like `lea rdi, [rbp - 48]`. **Quote it and give the offset.**
3. **Find where `authorized` lives.** It is the local the function writes `0` into at the start and
   reads at the end. **Quote that instruction and give its offset.**
4. **Draw the stack frame**, as a table or a labelled sketch, from lower addresses to higher. It
   should contain, in order: `authorized`, `buffer`, any padding, the saved frame pointer, and the
   saved return address. Give the offset from `rbp` for each.
5. **How many bytes must a badge ID be** before it overwrites the saved return address? Show the
   arithmetic. *(With the reference setup above you should find `buffer` at `[rbp-48]`, the saved
   frame pointer at `[rbp]`, and the return address at `[rbp+8]`, so 56 bytes. If your compiler
   version lays it out differently, use the numbers you actually see and say so.)*
6. **Here is the interesting part.** Given where `authorized` sits relative to `buffer`, **can an
   overflow of `buffer` change `authorized` to 1?** Answer from your diagram, not from intuition,
   and explain why. Then say what this tells you about reasoning about stack layout in general.

### Step 3: Which mitigations stop it

CyBOK §15.4 describes mitigations that do not remove a vulnerability but make it harder to exploit.
For **each** of the three below, answer three questions: *what does it do?*, *would it stop the
attacker overwriting the return address in this function?*, and *would it stop the bug from
existing?*

1. **Stack canaries** (`-fstack-protector`, which we turned off)
2. **Address space layout randomisation** (ASLR)
3. **Non-executable stack** (NX / DEP / W^X)

Then, in a short paragraph: **all three can be enabled and the bug is still there.** Using CyBOK
§15.4, say what that means for how you should describe these to a manager who asks whether the
software is secure.

Optional and worth doing if you have time: remove `-fno-stack-protector` in Compiler Explorer and
compare the prologue. Quote what appears.

### Step 4: Prevention, and what would count as evidence

1. **Fix it properly.** `check_badge_fixed()` in [vuln.c](../data/vuln.c) is one attempt. Read it,
   then answer: what does it do differently, and what does it do when the input is too long?
   Referring to Lab 1's principles, **which principle is it applying** by rejecting rather than
   truncating?
2. **Go up a level.** CyBOK §15.2 orders countermeasures by how fundamental they are: language and
   type system, then API design, then coding practices. For this bug, **give one countermeasure at
   each of those three levels**, and say what each one costs. Then say which you would choose for a
   fifteen-year-old C codebase of two million lines, and why.
3. **Prevention, detection, mitigation.** Sort these five into those three categories and give one
   sentence of justification for each:
   - Rewriting the module in a memory-safe language
   - Enabling stack canaries
   - Running a static analyser over the codebase every night
   - Replacing `strcpy` with a bounded copy throughout
   - Fuzzing the badge-parsing code for 48 hours
4. **What analysis establishes.** A static analyser reports no memory-safety findings in this file.
   A fuzzer runs for 48 hours and finds no crash.
   - **What does each result actually establish?** Be precise.
   - **What does neither result establish?**
   - Which of the two would you trust more here, and why? (CyBOK §15.3 is the section to cite.)
5. **Judge a claim.** A vendor tells you:

   > *"Our badge reader firmware is secure against buffer overflows. We compile with stack
   > protection and ASLR enabled, our code passes a commercial static analyser with zero critical
   > findings, and we have never had a reported incident."*

   Write about 200 words evaluating this claim. Address each of the three pieces of evidence
   separately: what does it support, and what does it not? Then say **what you would ask for
   instead**: name two specific pieces of evidence that would actually support the claim, and say
   what makes them better. CyBOK §17.4 on maturity models and evaluation schemes is relevant to
   your answer.

## What to submit

One Canvas submission containing your answers to all four steps, numbered to match, including:

- Your quoted assembly from Step 2 (prologue, both `lea`/`mov` offsets).
- Your stack frame diagram.
- Your arithmetic for the 56-byte answer.
- The 200-word vendor-claim evaluation.

## Rubric

| Row | What is assessed | Points |
| --- | --- | ---: |
| 1 | Step 1: bug named and located; what `strcpy` is not told stated precisely; the 31-byte answer with the reason; correct CyBOK §15.1.1 category | 6 |
| 2 | Step 2: assembly quoted, both offsets correct, stack frame diagram accurate and ordered correctly, distance-to-return-address arithmetic shown, and question 6 answered from the diagram | 10 |
| 3 | Step 3: all three mitigations correctly described, with both "stops this exploit?" and "removes the bug?" answered separately for each, plus the closing paragraph | 10 |
| 4 | Step 4: the fixed function analysed and the right principle named; three levels of countermeasure with costs and a defended choice; the five items correctly sorted; what static analysis and fuzzing each do and do not establish; the vendor claim evaluated with two better pieces of evidence proposed | 12 |
| | **Total** | **38** |

**The answer row 2 question 6 is looking for:** no. `authorized` sits at a *lower* address than
`buffer` in this layout, and an overflow writes *upward* toward higher addresses, so it runs past
the end of `buffer` into the saved frame pointer and return address without ever touching
`authorized`. The general lesson is that local variable ordering is a compiler decision, not a
source-code decision: you have to look, not assume.

**The answer row 4 question 4 is looking for:** a clean static-analysis run establishes that the
analyser's rules did not match anything, and nothing more; a 48-hour fuzzing run with no crash
establishes that those particular inputs did not crash it, and nothing more. Neither establishes
the absence of the vulnerability. Both are evidence; neither is proof.

## AI disclosure

You may use AI tools on this assignment. If you do, add one or two sentences saying which tool and
what for, per the [AI policy](../index.md#ai-policy).

The assembly you quote must come from your own Compiler Explorer session, and an AI tool will
routinely produce a plausible stack layout that does not match what your compiler actually did.
Row 2 is graded against the assembly you paste.
