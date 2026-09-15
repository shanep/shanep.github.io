---
next: false
prev: false
---

# A1 - Speaking the Application Layer

**Week 3 · 20 points · pass/fail · one paper worksheet per group, turned in before you leave**

## Why you are doing this

Everything in this course rides on a handful of protocols, and the one you use
most and understand least is **DNS**: the thing that turns `boisestate.edu` into an
address. Today you watch it happen. You send a real DNS query to a real server,
read the real answer that comes back, and learn what the answer is made of.

There is one tool for that, `dig`, and by the end of the period you will be able
to read its output the way you read a stack trace. You will use it in every
activity that follows and in most of the debugging you ever do, so this is the
one to learn while nothing is on fire.

Everyone works on **one machine**, `onyx.boisestate.edu`. Your laptops differ in
ways that would turn every result into an argument about macOS versus Windows.
On Onyx, if your answer differs from your neighbor's, one of you typed something
wrong, and that is a much more useful argument to have.

::: warning

This is a paper activity. Your group turns in **one filled out worksheet, on
paper, before you leave the room**. Copies are handed out in class.

It is graded pass/fail. Both rounds attempted in good faith is a pass. Being
wrong about what a switch did costs you nothing as long as you wrote down what
you actually saw.

:::

## Before you start

- **Groups of 3 or 4.** One scribe owns the worksheet and puts everyone's name on
  it.
- Everyone logs into Onyx from their own laptop. The laptop is only a terminal;
  every command in Round 2 runs **on Onyx**.
- You need an SSH client. macOS and Linux already have one. On Windows use
  PowerShell, WSL, or Git Bash.

## Round 1 - Get on the box

Every member, from your own laptop:

```bash
ssh <username>@onyx.boisestate.edu
```

Then, on Onyx, find out what you are standing on. Every box in the worksheet
has one command next to it; run the command, write down what it printed.

```bash
cat /etc/redhat-release      # which Red Hat, which version
uname -srm                   # kernel and architecture
who | wc -l                  # how many of us are logged in right now
```

Now confirm the tool you need is here, and **which version** of it you have,
because that decides which switches work:

```bash
dig -v
```

While you are at it, check three more you will meet in A3. Just write down the
version line; you do not need to know what they do yet.

```bash
curl --version | head -1
nc --version
ping -V
```

::: tip Checkpoint

Everyone is logged in, and your group has written down the Red Hat version, the
number of people on the box, and the four version lines.

:::

## Round 2 - `dig`: read a DNS answer

DNS is an **application layer protocol**. Your machine sends a real query to a
real server over UDP port 53 and waits for a real answer, and everything about
that can be inspected. `dig` is how you inspect it.

### Read one answer, carefully

```bash
dig boisestate.edu
```

Find these four things in what comes back and write them on the worksheet:

1. The `status:` field in the header.
2. The `QUESTION` section: what did you actually ask?
3. The `ANSWER` section: the record type, the **TTL**, and the address.
4. The `Query time:` at the bottom.

### Watch the TTL

Run it four more times in a row and watch the TTL. It does not move.

Then do the same thing for a name outside the university:

```bash
dig +noall +answer example.com
sleep 3
dig +noall +answer example.com
```

That TTL *does* move, and not always downward. Explain the difference on the
worksheet. Two facts you need: a TTL counts down while an answer sits in a
cache, and `/etc/resolv.conf` on Onyx lists **two** resolvers.

### The switches that matter

Work through these as a group. For each one, write down in a sentence what it
changed.

| Command | What to notice |
| ------- | -------------- |
| `dig +short boisestate.edu` | Just the answer, nothing else |
| `dig +noall +answer boisestate.edu` | The answer section, still labeled |
| `dig boisestate.edu MX` | Where does mail for the university go? |
| `dig boisestate.edu NS` | Who is authoritative for this zone? |
| `dig boisestate.edu TXT` | Text records, usually policy and verification |
| `dig boisestate.edu AAAA` | The IPv6 answer, if there is one |
| `dig @1.1.1.1 boisestate.edu` | Ask a public resolver instead of the campus one. **This one fails.** |
| `dig +trace boisestate.edu` | Walk the delegation chain from the root. **This one fails too.** |
| `dig +tcp boisestate.edu` | The same query over TCP instead of UDP |
| `dig +stats boisestate.edu` | Timing, server used, message size |

### The two that fail, and why that is the interesting part

`@1.1.1.1` times out with `no servers could be reached`, and `+trace` stops after
the first step instead of walking down to the answer. Neither is broken software.
Both need to send DNS queries **directly to a server out on the internet**, and
this network does not allow that: `/etc/resolv.conf` names two campus resolvers,
and outbound port 53 to anything else is blocked.

On the worksheet, say what those two failures have in common, and name the thing
sitting between Onyx and the rest of the internet that causes both. You will meet
that idea again in A4, where a network that intercepts DNS produces an answer that
is worse than a failure: a *wrong* one.

### The trap

```bash
dig nosuchthing.boisestate.edu
dig +short nosuchthing.boisestate.edu
```

The first tells you exactly what happened. The second prints **nothing at all**
and exits successfully. On the worksheet, say what the `status:` field was, and
say in one sentence why `+short` is dangerous when you are debugging rather than
scripting.

::: tip Checkpoint

Your group can point at the `status:` field, explain why the TTL moved for one
name and not the other, and say what the two failing switches have in common.

:::

## If you finish early

`dig -x` does the query backwards: address in, name out.

```bash
dig +short boisestate.edu
dig -x <the address that printed>
```

Write down what came back. Is the name it gave you the one you started with? If
not, that is a good thing to ask about.

## Worksheet

**Download: [a1-worksheet.pdf](./a1-worksheet.pdf)**

The printed worksheet handed out in class is what you fill in and turn in. It
covers, in order: the box and your tool versions; reading one `dig` answer; the
TTL; the switch table; the two that fail; and the `+short` trap.

## Instructor Notes

Instructor note, not shown to students.

**Print the worksheet.**

```bash
./scripts/cs425/a1-application-layer.sh handout
```

No AWS involved; A1 needs no testbed, just Onyx.

**Say this before you hand out the sheet.** The first run of this activity had
seven rounds, and the feedback was that students did not know why they were doing
it. Assume nobody has read the page. Two minutes at the board, before the paper
goes out:

> Every URL you have ever typed started with a DNS lookup. Today you send one by
> hand and read the answer. That is the whole activity. Two rounds: get on Onyx,
> then run `dig` and write down what it tells you. The worksheet is what you turn
> in, and the only way to fail is a blank box.

Then put `dig boisestate.edu` on the projector, run it, and point at the four
things the sheet asks for. Do not explain them; just show where they are. The
group's job is to find them again.

**What is actually on Onyx.** Every command in this activity was run there while
it was written, and these are the measured values rather than assumptions:

| | |
| - | - |
| OS | Red Hat Enterprise Linux 9.8 (Plow), kernel 5.14 |
| `dig` | DiG 9.16.23-RH, present |
| `curl` | 7.76.1, with OpenSSL 3.5.5 and nghttp2 |
| `nc` | **nmap-ncat 7.92**, at `/usr/bin/ncat` |
| `ping` | iputils 20210202 |
| resolvers | `10.50.18.111` and `10.50.18.112` |
| outbound 53 to anything else | **blocked** |

Two consequences worth knowing before the room finds them:

- **`dig @1.1.1.1` and `dig +trace` both fail**, because outbound 53 is blocked.
  This is written into Round 2 as a deliberate finding rather than a broken step,
  and it is a good ninety seconds at the board: both commands need to talk to a
  DNS server that is not the campus one, and something in the middle will not let
  them. It sets up A4 directly.
- **The TTL does not count down for `boisestate.edu`.** It sits at 300 every
  time, because the campus resolver is authoritative for that zone rather than
  caching it. Use `example.com` for the caching lesson, where the TTL moves, and
  note it sometimes moves *up*: there are two resolvers in `resolv.conf` and their
  caches are different ages. That surprise is worth more than the original
  exercise was.

Re-run the pre-flight yourself if the box gets rebuilt:

```bash
ssh onyx.boisestate.edu 'dig -v; curl --version | head -1; nc --version 2>&1 | head -1; ping -V'
```

**Where it goes wrong.**

- **Windows without OpenSSH on `PATH`.** Fastest fix is Git Bash. Do not spend
  class time on WSL installs.
- **Password login.** Nobody has keys yet; that is A2. Expect the first ten
  minutes to be typing passwords and, for a few, resetting them.
- **Groups that copy the table without running the commands.** The `@1.1.1.1`
  row is the tell: a group that wrote "asks Cloudflare" instead of "timed out"
  did not run it.

**Grading.** Pass/fail, meant to be graded by flipping through the stack rather
than read closely. A pass is both rounds attempted with something real written in
them. Wrong answers about what a switch did still pass: the worksheet is a record
of what they observed, and half the value of the period is being wrong out loud
about why the TTL did not move. Canvas has no rubric attached, so award the full
20 or nothing.

**Pacing.** Round 1 is fifteen minutes, most of it logging in. Round 2 is the
rest of the period. If time is short, cut the `+tcp` and `+stats` rows and keep
the two that fail and the `+short` trap; those are the parts A4 depends on.

**What this sets up.** A2 (week 4, instructor led) puts SSH keys and a `probe`
function on the box. A3 (week 5) does for `curl`, `nc` and `ping` what today did
for `dig`. Round 2's `+short` trap is A4 station 4, exactly.
