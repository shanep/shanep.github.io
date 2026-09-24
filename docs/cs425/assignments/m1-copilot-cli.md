---
next: false
prev: false
submission: online_upload
grading: pass_fail
---

# M1 - Mini-Lab: GitHub Copilot CLI

**Week 6 · 20 points · pass/fail · take home · individual · about 1 hour · submit in Canvas**

## Why you are doing this

AI coding agents that run in your terminal are now a normal part of professional
software work. They read your files, propose changes, run commands, and explain
what they did. Used well they save time; used carelessly they write code you do
not understand and cannot debug. The only way to learn the difference is to
drive one yourself on something small enough that you can check every line.

In this mini-lab you install **GitHub Copilot CLI**, point it at an empty
directory, and have it help you build a tiny C program that does something you
already know how to do by hand: resolve a hostname, the way `dig` did in A1.
Then you ask it to change the program, ask it to explain part of it, and save
the whole conversation as proof.

This is a take home mini-lab: you do it on your own, outside of class, and
submit it individually. It is much smaller than a project and does not use the
project starter repository or the project grading rubric.

::: tip This costs you nothing

Every student in this course already has GitHub Copilot through the free
GitHub Education benefit. **You do not need to pay for anything to complete this
lab.** Never enter a credit card, never buy a subscription, and never buy extra
requests for this course.

If Copilot ever tells you that you are out of requests or asks you to upgrade,
**stop and email me**. That is a problem for me to solve, not you.

:::

## Before you start

1. **Confirm your Copilot access.** Sign in to GitHub and open
   [github.com/settings/copilot](https://github.com/settings/copilot). It should
   show that you have Copilot through GitHub Education. If it does not, email me
   before the due date and I will help you sort it out.
2. **Pick a machine.** Your own laptop is the easiest place to do this. You need
   a terminal and a C compiler (`cc` or `gcc`) with `make`, the same toolchain you
   set up for P0.
3. **Budget about an hour.** Most of it is reading what Copilot produces.

## Part 1 - Install and log in

Install Copilot CLI with **one** of the following. Pick whichever matches your
machine.

| Platform | Command |
| -------- | ------- |
| macOS or Linux (Homebrew) | `brew install --cask copilot-cli` |
| macOS or Linux (no Homebrew) | `curl -fsSL https://gh.io/copilot-install \| bash` |
| Windows | `winget install GitHub.Copilot` |
| Any platform with Node.js 22 or later | `npm install -g @github/copilot` |

On Windows you need PowerShell 6 or later; WSL also works, using the Linux
instructions.

Then check that it runs and log in:

```bash
copilot --version
copilot
```

The first time it starts, it asks you to log in. Type `/login` at its prompt and
follow the instructions, which open a browser to GitHub. Use the same GitHub
account that has your Education benefit. When you are logged in, type `/exit`.

The official instructions are at
[Installing GitHub Copilot CLI](https://docs.github.com/en/copilot/how-tos/set-up/install-copilot-cli)
if anything above does not work on your machine.

### Stay on the default model

Copilot CLI lets you switch models with `/model`. Leave it on the default. Some
models use up your monthly allowance much faster than others, and this lab does
not need a fancy one.

## Part 2 - Build `lookup` with Copilot

Make an empty directory for the lab and start Copilot inside it:

```bash
mkdir cs425-m1
cd cs425-m1
copilot
```

Copilot asks whether you trust the files in this folder. Say yes: it is your
own, empty directory. **Never** say yes in a folder you do not own, such as your
home directory.

### Prompt 1: write the program

Give Copilot this prompt, word for word or in your own words:

> Write a small C program called `lookup.c` that takes one hostname on the
> command line, resolves it with `getaddrinfo`, and prints every address it
> gets back, one per line, labeled IPv4 or IPv6. Print a useful error and exit
> with a nonzero status if the lookup fails. Also write a `Makefile` that builds
> it with `-Wall -Wextra` and has a `clean` target.

Copilot will propose creating files and running commands, and it asks
permission for each one. **Read each request before you approve it.** Approve
each action individually rather than choosing the option that allows everything
for the rest of the session. You are responsible for every command it runs on
your machine.

When it is done, build and run the program yourself, in a second terminal or
after `/exit`:

```bash
make
./lookup example.com
./lookup www.boisestate.edu
./lookup no-such-host.invalid
```

Compare the addresses with what `dig example.com A` and `dig example.com AAAA`
report. They should agree.

### Prompt 2: change the program

Ask Copilot to add a feature:

> Add `-4` and `-6` options to `lookup` so it prints only IPv4 or only IPv6
> addresses. With no option, print both.

Rebuild and run `./lookup -4 example.com` and `./lookup -6 example.com`. If
something does not compile or does the wrong thing, tell Copilot what happened
and let it fix it. That back and forth is part of the lab, so leave it in the
log.

### Prompt 3: make it explain

Ask Copilot at least one question about the code it wrote. Some ideas:

- Why does `getaddrinfo` sometimes return the same address more than once?
- What does `hints.ai_socktype` do, and what happens if you leave it at zero?
- Why does the program need `freeaddrinfo`?

Check its answer against `man getaddrinfo`. Copilot is often right and sometimes
confidently wrong; that is exactly why you check.

## Part 3 - Save the conversation

While you are still in the Copilot session, export it to a Markdown file:

```text
/share file ./copilot-session.md
```

Open `copilot-session.md` and make sure it contains your prompts and Copilot's
answers. If you closed Copilot before exporting, run `copilot --resume` in the
same directory, pick the session, and export it then.

## Part 4 - Reflect

Write a short `reflection.md` (a few sentences each is plenty):

1. One thing Copilot got right that would have taken you longer by hand.
2. One thing you had to check, correct, or did not trust. If everything worked
   the first time, say what you checked and how.
3. Would you use a tool like this on a course project? What would you want to
   understand yourself before you did?

## What to submit

Upload these four files to the Canvas assignment:

| File | What it shows |
| ---- | ------------- |
| `copilot-session.md` | The exported conversation, with all three prompts |
| `lookup.c` | The program Copilot helped you write |
| `Makefile` | The build file |
| `reflection.md` | Your answers to Part 4 |

Do not zip them; upload the four files directly.

## Grading

This is pass/fail. You pass if:

- the session log shows you actually used Copilot CLI for all three prompts,
- `lookup.c` and the `Makefile` match what is in the log and build with `make`, and
- `reflection.md` answers all three questions in your own words.

Code that has a bug still passes, as long as the log and the reflection show you
worked with it honestly.

## What about Claude or other tools?

You may use **Claude Code** instead of Copilot CLI if you already have access to
it. The steps are the same: install it, run it in an empty directory, give it
the three prompts, and export the conversation with its `/export` command.

**Claude Code is not free**, and there is no advantage to using it for this lab.
Do not pay for Claude, or for any other AI tool, to complete this assignment.
Copilot CLI through your GitHub Education benefit is all you need, and it is
what I will help you troubleshoot.

## Instructor Notes

Instructor note, not shown to students.

**Why this exists.** Students are going to use coding agents on the projects
whether or not we talk about it. This gets every one of them through the install
and login on something trivial, and makes them read the approval prompts and
check an answer against a man page once, before it matters.

**Access.** Everyone in the class should already have Copilot through GitHub
Education. The usual failure is a student logged into a personal GitHub account
that does not carry the Education benefit; `/login` with the right account fixes
it. A student who genuinely cannot get access by the due date gets an extension,
not a request to pay.

**Grading.** Pass/fail, full 20 or nothing, no rubric in Canvas. Open the session
log, confirm it has the three prompts and looks like a real session, skim that
`lookup.c` resembles what the log produced, and check that the reflection is
there and is not boilerplate. Five minutes of reading per student at most. A log
from Claude Code's `/export` is fine.

**Things students hit.**

- `brew install copilot-cli` without `--cask` fails; the table has it right.
- On Windows PowerShell 5 (the one that ships with Windows) the CLI refuses to
  run. They need PowerShell 7 or WSL.
- `-6` on a network without IPv6 still prints AAAA results, because
  `getaddrinfo` without `AI_ADDRCONFIG` does not care whether you can reach them.
  Good discussion point if anyone asks.
