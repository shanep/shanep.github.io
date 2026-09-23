# Week 13: Software Security, Memory Safety, and Assurance

**April 12-18 · Reading: 15 pages · Estimated total: 7 hours**

## Overview

This week has two halves that belong together.

The first is a single C function with a bug in it that has been producing security advisories since
1988. You will read it, look at the assembly a compiler produces from it, and work out precisely why
an over-long input reaches somewhere it should not.

The second half is the question that matters more. Suppose somebody tells you the bug is fixed, 
what would convince you? That is **assurance**, and it is the only terminal objective in this course
without a week of its own. It gets the second half of this one, and it is worth as much on the final
exam as the buffer overflow is.

**You will not run this program and you will not attack anything.** You read source and you read
assembly, in a browser.

## Objectives this week

- **[4.4](../objectives.md#tlo-4--analyzing-common-attacks-and-justifying-countermeasures)**: Trace
  a buffer overflow to the stack layout that makes it exploitable, and evaluate which mitigations
  would stop it.
- **[5.5](../objectives.md#tlo-5--applying-authentication-authorization-and-secure-design-principles)**: 
  Recommend a prevention-first countermeasure for a class of vulnerability.
- **[6.1](../objectives.md#tlo-6--interpreting-assurance-arguments-and-evidence)**: Distinguish
  prevention, detection, and mitigation as classes of assurance evidence.
- **[6.2](../objectives.md#tlo-6--interpreting-assurance-arguments-and-evidence)**: Identify what a
  static or dynamic analysis result does and does not establish.
- **[6.3](../objectives.md#tlo-6--interpreting-assurance-arguments-and-evidence)**: Evaluate
  whether stated security claims are supported by the evidence offered.

## Read

| Source | Sections | Printed pages | Length | Time |
| --- | --- | --- | --- | --- |
| [CyBOK v1.1.0](../docs/CyBOK_v1.1.0.pdf) | §15.1.1 Memory Management Vulnerabilities | 500-501 | 2 pp | 15 min |
| [CyBOK v1.1.0](../docs/CyBOK_v1.1.0.pdf) | §15.2 Prevention of Vulnerabilities: language design, API design, coding practices | 507-512 | 5 pp | 40 min |
| [CyBOK v1.1.0](../docs/CyBOK_v1.1.0.pdf) | §15.4 Mitigating Exploitation of Vulnerabilities | 516-520 | 5 pp | 35 min |
| [CyBOK v1.1.0](../docs/CyBOK_v1.1.0.pdf) | §17.4 Assessing the Secure Software Lifecycle, SAMM, BSIMM, Common Criteria | 582-585 | 3 pp | 25 min |
| Aleph One, *Smashing the Stack for Fun and Profit* | Start through the stack frame layout |: | ~4 pp | 25 min |

Aleph One (Phrack 49, 1996): <http://phrack.org/issues/49/14.html>. Read until it starts
constructing shellcode, then stop. It is thirty years old and still the clearest explanation of
what the stack looks like during a function call. Also worth noticing: the bug it describes is
still, three decades later, one of the most common classes in the CVE database.

§15.3 (detection of vulnerabilities, static and dynamic analysis) is not assigned as reading, but
Lab 8 asks about it and you should look at pages 512-516 when you get to that question.

## Worked example

Open [data/vuln.c](../data/vuln.c).

```c
int check_badge(const char *badge_id)
{
    char buffer[BADGE_BUFFER_SIZE];      /* 32 bytes */
    int authorized = 0;

    strcpy(buffer, badge_id);            /* <-- the bug */

    if (strcmp(buffer, ADMIN_BADGE) == 0) {
        authorized = 1;
    }

    return authorized;
}
```

### 1. What is actually wrong

`strcpy` is not a broken function. It does exactly what it documents: copy bytes from the source
until it finds a zero, including that zero.

What it is **never told** is how big the destination is. There is no parameter for it and no way to
find out. So the safety of any `strcpy` call depends entirely on the caller having already
established that the source fits, and here, `badge_id` comes from outside and nobody checked.

Note the off-by-one: `buffer` holds 32 bytes, and `strcpy` writes the terminating zero as well, so
the longest badge ID handled correctly is **31 characters**.

### 2. What the compiler actually did

This is why Lab 8 sends you to Compiler Explorer rather than asking you to imagine it. Compiled at
`-O0 -fno-stack-protector` for x86-64, the function begins:

```
push    rbp
mov     rbp, rsp
sub     rsp, 64
mov     dword ptr [rbp - 52], 0        ; authorized = 0
lea     rdi, [rbp - 48]                ; &buffer  -> first argument to strcpy
call    strcpy
```

So the frame looks like this, from lower addresses to higher:

| Offset from `rbp` | Contents | Size |
| --- | --- | ---: |
| `rbp - 52` | `authorized` | 4 |
| `rbp - 48` | `buffer[0..31]` | 32 |
| `rbp - 16` | padding / spilled argument | 16 |
| `rbp + 0` | saved frame pointer | 8 |
| `rbp + 8` | **saved return address** | 8 |

From the start of `buffer` at `rbp-48` to the return address at `rbp+8` is **56 bytes**. Write 57
bytes into a 32-byte buffer and you have begun overwriting the address the function will jump to
when it finishes.

### 3. The part that catches people out

Look at the table again. `authorized` sits at `rbp-52`, **below** `buffer`.

A buffer overflow writes *upward*, toward higher addresses. So it runs off the end of `buffer`
into the padding, then the saved frame pointer, then the return address. **It never touches
`authorized`.**

If you had reasoned from the C source alone, you would very likely have guessed the opposite:
`authorized` is declared after `buffer`, so surely it sits after it in memory and a long badge ID
flips the flag to 1 and opens the door. It is a natural guess and it is wrong here.

The lesson generalises: **local variable ordering is a compiler decision, not a source-code
decision.** Compilers reorder locals for alignment, for register allocation, and (when stack
protection is on) deliberately, to put arrays above scalars precisely so an overflow hits the
canary before it hits anything useful. You have to look.

### 4. Mitigations do not fix bugs

§15.4 covers three things commonly cited as making memory-safety bugs a solved problem:

| | What it does | Stops this exploit? | Removes the bug? |
| --- | --- | --- | --- |
| **Stack canary** | Puts a known value between the locals and the return address; checks it before returning | Usually: it turns the exploit into a controlled crash | **No** |
| **ASLR** | Randomises where things are loaded, so the attacker cannot predict addresses | Makes it much harder, not impossible, leaks and brute force exist | **No** |
| **NX / DEP** | Marks the stack non-executable, so injected shellcode cannot run | Stops classic shellcode injection; return-oriented programming works around it | **No** |

Enable all three and `check_badge` still has a buffer overflow. What changes is the likely outcome:
instead of the attacker running code of their choosing, the program crashes. That is a large
improvement and it is a denial of service.

So when a manager asks whether the software is secure, "we compile with stack protection and ASLR"
is a true statement that answers a different question. Mitigations raise the cost of exploitation.
They are worth enabling. They are not a fix, and describing them as one is the failure Lab 8 asks
you to avoid.

### 5. Prevention, detection, mitigation

§15.2 orders countermeasures by how fundamental they are, and the ordering is the useful part:

1. **Language and type system.** A language where this bug cannot be expressed. Rust, Go, Java,
   Python. Most fundamental, and the most expensive to adopt for existing code.
2. **API design.** Provide interfaces that require the destination size, so the unsafe call is not
   available. Replace `strcpy` with a bounded copy throughout.
3. **Coding practices.** Ask developers to check lengths and review for it. Cheapest, and relies
   entirely on human consistency forever.

Each step down relies more on people never making a mistake. That is why "we have a coding standard"
is weaker evidence than "the module is written in a memory-safe language," even though both are
real.

Three categories, and keeping them apart is objective 6.1:

- **Prevention**: the bug cannot exist. Memory-safe language; bounded APIs.
- **Detection**: the bug exists and you find it. Static analysis; fuzzing; code review.
- **Mitigation**: the bug exists, you have not found it, and exploitation is harder. Canaries,
  ASLR, NX, privilege reduction.

None substitutes for another, and every real programme uses all three.

### 6. What evidence would convince you

Now the assurance half. Two results:

- A static analyser reports **no memory-safety findings** in this file.
- A fuzzer runs for **48 hours** and finds no crash.

What does each establish?

The static analysis result establishes that **the analyser's rules did not match anything in this
file**. That is all. It depends on which rules it has, whether it can follow the data flow from
`badge_id` into `strcpy`, and whether it was even configured to look. Analysers routinely miss this
exact pattern across function boundaries.

The fuzzing result establishes that **those particular inputs, generated by that fuzzer, in 48
hours, did not crash it**. Fuzzers find shallow bugs quickly and deep ones slowly or never, and how
they perform depends enormously on how the target was instrumented and seeded.

**Neither establishes the absence of the vulnerability.** Both are real evidence (they find real
bugs constantly and are well worth doing), and neither is proof. That distinction is the whole of
objective 6.2, and it is the difference between reading a security claim and believing one.

And when a vendor combines several such claims (*"stack protection, ASLR, zero critical findings,
no reported incidents"*), the job is to take each piece separately and ask what it supports. "No
reported incidents" is the weakest of all: it is equally consistent with being secure and with
having no ability to detect anything.

§17.4 covers what organisation-level evidence looks like, SAMM and BSIMM assess *practices*, the
Common Criteria evaluates *a specific product against stated claims*. Neither certifies that a
given release is free of bugs, and conflating process maturity with product security is the most
common mistake in reading assurance claims.

## Do this week

| | Task | Points | Due |
| --- | --- | ---: | --- |
| 1 | [Lab 8: Memory Safety and Assurance Evidence](../assignments/lab-08-memory-safety-and-assurance.md) | 38 | Sunday |

Lab 8's Step 2 asks you to paste assembly from your own Compiler Explorer session. If your compiler
version lays the frame out differently from the numbers above, use what you actually see and say
so: that is the correct answer, not a problem.

## Key terms

| Term | Short form |
| --- | --- |
| **Buffer overflow** | Writing past the end of an allocated region. |
| **Stack frame** | The region a function uses for locals, saved registers, and the return address. |
| **Saved return address** | Where the function jumps when it returns. The classic overwrite target. |
| **Memory safety** | The property that a program cannot access memory outside what it legitimately owns. |
| **Stack canary** | A known value checked before return; turns many exploits into crashes. |
| **ASLR** | Randomised load addresses. |
| **NX / DEP** | Non-executable data pages. |
| **Return-oriented programming** | Chaining existing code fragments to work around NX. |
| **Static analysis** | Examining code without running it. |
| **Dynamic analysis / fuzzing** | Running the code on many inputs and watching for failures. |
| **Assurance** | Grounds for confidence that a system meets its security claims. |
| **SAMM / BSIMM** | Maturity models assessing an organisation's software security *practices*. |
| **Common Criteria** | Evaluation of a *specific product* against stated claims, at a stated rigour. |

## Time estimate

| Activity | Time |
| --- | --- |
| Reading (15 pages plus Aleph One) | 2 hrs 5 min |
| This module page and the worked example | 45 min |
| Lab 8 | 1 hr 30 min |
| Review and slack | 2 hrs 30 min |
| **Total** | **~7 hrs** |

## Looking ahead

Week 14 is the same story one layer up: instead of a program building a string in memory without
checking its size, a program building a *command* out of untrusted input without keeping the two
apart. Lab 9 lets you break a login form and then fix it. Quiz 5 covers weeks 13 and 14.
