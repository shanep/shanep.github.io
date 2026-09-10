---
next: false
prev: false
draft: true
---

# A1 - Speaking the Application Layer

**Week 3 · 20 points · pass/fail · one paper worksheet per group, turned in before you leave**

## Overview

Four commands will carry you through this entire course, and through most of the
debugging you will ever do: `dig`, `curl`, `nc` and `ping`. Today you learn them
properly, including the switches nobody reads about until the night something is
broken.

Three of the four speak **application layer protocols**. `dig` speaks DNS.
`curl` speaks HTTP. `nc` speaks whatever you type into it, which is the point of
it and is how you will debug your mail client in P1. The fourth, `ping`, does not
speak an application protocol at all, and by the end of the period you should be
able to say exactly why that makes it the least trustworthy of the four.

Everyone works on **one machine**, `onyx.boisestate.edu`, which runs Red Hat
Linux. That is deliberate. Your laptops differ in ways that would make every
result in this activity an argument about macOS versus Windows instead of an
argument about protocols. On Onyx, if your answer differs from your neighbor's,
one of you typed something wrong.

This activity exists to prepare you for [A2](./a2-connectivity-triage.md) and
[A3](./a3-name-the-layer.md), where you use these four commands against machines
that are deliberately broken. Learn the instruments now, while nothing is on
fire.

::: warning

This is a paper activity. Your group turns in **one filled out worksheet, on
paper, before you leave the room**. Copies are handed out in class, and the same
worksheet is at [a1-worksheet.pdf](/cs425/a1-worksheet.pdf).

It is graded pass/fail. Every round attempted in good faith is a pass, and being
wrong about what a switch did costs you nothing as long as you wrote down what
you actually saw.

:::

## Before you start

- **Groups of 3 or 4.** One scribe owns the worksheet and puts everyone's name on
  it.
- Everyone logs into Onyx from their own laptop. The laptop is only a terminal;
  every command in Rounds 2 and 4 through 7 runs **on Onyx**.
- You need an SSH client. macOS and Linux already have one. On Windows use
  PowerShell, WSL, or Git Bash.

## Round 1 - Get on the box, and find your instruments

Every member, from your own laptop:

```bash
ssh <username>@onyx.boisestate.edu
```

Then, on Onyx, find out what you are standing on:

```bash
cat /etc/redhat-release      # which Red Hat, which version
uname -srm                   # kernel and architecture
who | wc -l                  # how many of us are logged in right now
```

Now confirm the four instruments are here and find out **which** version of each
you have, because that decides which switches work:

```bash
dig -v          # or: which dig
curl --version  # note the version and the protocols it lists
nc --version    # or: nc -h   (there are several different nc programs)
ping -V         # iputils on Red Hat
```

Write down what `nc --version` says. There are at least three unrelated programs
called `nc` in the world and they take different flags; knowing which one is in
front of you is the difference between a five second answer and a lost afternoon
in A2.

::: tip Checkpoint

Everyone is logged in, and your group has written down the Red Hat version, the
number of people on the box, and which `nc` this is.

:::

## Round 2 - `dig`: the Domain Name System

DNS is an **application layer protocol**. Your machine sends a real query to a
real server over UDP port 53 and waits for a real answer, and everything about
that can be inspected. `dig` is how you inspect it.

Start with the full output and learn to read it:

```bash
dig boisestate.edu
```

Find these four things in what comes back and write them on the worksheet:

1. The `status:` field in the header.
2. The `QUESTION` section: what did you actually ask?
3. The `ANSWER` section: the record type, the **TTL**, and the address.
4. The `Query time:` at the bottom.

Now run it four more times in a row and watch the TTL. It does not move.

Then do the same thing for a name outside the university:

```bash
dig +noall +answer example.com
sleep 3
dig +noall +answer example.com
```

That TTL *does* move, and not always downward. Explain the difference. Two facts
you need: a TTL counts down while an answer sits in a cache, and
`/etc/resolv.conf` on Onyx lists **two** resolvers.

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
that idea again in A2, where a network that intercepts DNS produces an answer that
is worse than a failure: a *wrong* one.

Then the one that matters most for A2:

```bash
dig nosuchthing.boisestate.edu
dig +short nosuchthing.boisestate.edu
```

The first tells you exactly what happened. The second prints **nothing at all**
and exits successfully. On the worksheet, say what the `status:` field was, and
say in one sentence why `+short` is dangerous when you are debugging rather than
scripting.

::: tip Checkpoint

Your group can point at the `status:` field, explain why the TTL dropped on the
second query, and say how many servers `+trace` talked to.

:::

## Round 3 - Stop typing your password

Each member, on your own laptop:

```bash
ssh-keygen -t ed25519 -C "you@boisestate.edu"
ssh-copy-id <username>@onyx.boisestate.edu
```

If `ssh-copy-id` is missing, append `~/.ssh/id_ed25519.pub` to `~/.ssh/authorized_keys`
on Onyx by hand. SSH ignores the file if the permissions are loose, so on Onyx:

```bash
chmod 700 ~/.ssh
chmod 600 ~/.ssh/authorized_keys
```

Then create `~/.ssh/config` on your laptop, so `ssh onyx` is all you ever type again:

```
Host onyx
    HostName onyx.boisestate.edu
    User <username>
    IdentityFile ~/.ssh/id_ed25519
    ServerAliveInterval 60
    ControlMaster auto
    ControlPath ~/.ssh/cm-%r@%h:%p
    ControlPersist 10m
```

`chmod 600 ~/.ssh/config`, then confirm `ssh onyx uname -n` works with no password.

The last three lines turn on connection multiplexing: the first connection stays
open and later ones reuse it instead of paying for a new TCP handshake and a new
key exchange. Measure it, on every laptop:

```bash
ssh -O exit onyx 2>/dev/null   # tear down any existing master
time ssh onyx true             # cold: full setup
time ssh onyx true             # warm: reuses the open connection
```

Put both numbers on the worksheet. Then answer as a group: **whose speedup was
largest, and why?** Setup costs a handful of round trips, so estimate how many
round trips the cold connection spent.

::: tip Checkpoint

Every member logs in with no password, and your group can explain the cold and
warm timings in units of round trips rather than in seconds.

:::

## Round 4 - `curl`: HTTP, and where the time goes

HTTP is the other application layer protocol you already use constantly. `curl`
speaks it, and `-v` shows you both halves of the conversation:

```bash
curl -v http://example.com/
```

Lines starting with `>` are what your machine **sent**. Lines starting with `<`
are what the server **replied**. Find the request line, the `Host:` header, the
status line, and the `Content-Type`, and write them down.

### The switches that matter

| Command | What to notice |
| ------- | -------------- |
| `curl -I http://example.com/` | Headers only, no body |
| `curl -s http://example.com/` | Silent: no progress meter |
| `curl -sS http://example.com/` | Silent, but still show errors |
| `curl -o /dev/null http://example.com/` | Throw the body away |
| `curl -I http://www.boisestate.edu/` | Look at the status code |
| `curl -IL http://www.boisestate.edu/` | Follow the redirects, see each hop |
| `curl -H 'User-Agent: cs425' -v http://example.com/` | Send your own header |
| `curl --connect-timeout 3 -m 5 http://example.com/` | Bound the wait |
| `curl -4 http://example.com/` | Force IPv4 |

### Where the time actually goes

This is the single most useful thing `curl` does, and you will use it in A2 and
A3. `-w` prints a report after the transfer, and the timing variables split one
request into its layers:

```bash
curl -o /dev/null -s -w 'dns=%{time_namelookup} connect=%{time_connect} tls=%{time_appconnect} ttfb=%{time_starttransfer} total=%{time_total} code=%{http_code}\n' https://www.boisestate.edu/
```

On the worksheet, record all six numbers and then answer:

1. Which phase took the longest?
2. `dns` is name resolution and `connect` is the TCP handshake. What is happening
   between `connect` and `ttfb`?
3. Run it against `http://` instead of `https://`. Which number collapses to zero,
   and what does that tell you about what `tls` was measuring?

Those five timings are the layer model, printed by a program, on one line.

::: tip Checkpoint

Your group can name what each of the five timing numbers measures, and has
explained what changed when TLS went away.

:::

## Round 5 - `nc`: be the client yourself

`nc` does not know any application protocol. It opens a TCP connection and moves
bytes. That is what makes it the most useful debugging tool you will meet,
because **you** get to be the protocol.

First, the port check you will use constantly in A2:

```bash
nc -vz onyx.boisestate.edu 22     # something is listening
nc -vz onyx.boisestate.edu 9      # nothing is
```

Write down, word for word, what each one printed and roughly how long each took.
Those two messages are two completely different failures and telling them apart
is most of A2.

### Speak HTTP by hand

Now type the protocol yourself:

```bash
{ printf 'GET / HTTP/1.1\r\nHost: example.com\r\nConnection: close\r\n\r\n'; sleep 3; } \
    | nc example.com 80
```

You just sent an HTTP request without a browser or a client library.

**Why the `sleep 3`?** Onyx has `nmap-ncat`, and it closes the connection the
moment its standard input runs out. Without the sleep your request goes out and
`nc` hangs up before the reply arrives; run it that way once and read what `nc -v`
reports about bytes sent and bytes received. Holding stdin open for three seconds
gives the server time to answer.

On the worksheet:

1. What was the very first line the server sent back?
2. What happens if you drop the `Host:` header? Try it. HTTP/1.1 requires it.
3. Why `\r\n` and not `\n`? Change them to `\n` and see what the server does.

That last question is not academic. **P1 is a mail client**, SMTP has the same
rule, and `\n` for `\r\n` is the single most common bug in that project. A
terminal renders both identically, so you cannot see the difference; you have to
know it.

### Listen, and be listened to

You are all on the same machine, so one of you can be the server. Pick a port
above 10000 that nobody else is using:

```bash
PORT=$((10000 + $(id -u) % 20000)); echo "$PORT"
ss -ltn | grep ":$PORT" || echo "free"
nc -l 127.0.0.1 "$PORT"          # this blocks, waiting
```

A different member, in their own session on Onyx:

```bash
nc 127.0.0.1 <their PORT>
```

Type into one window; watch it appear in the other. Then `Ctrl-C`, and confirm
with `ss -ltn` that nothing of yours is still listening. Leaving processes on a
shared machine is how you end up in somebody's incident report.

::: tip Checkpoint

Your group has an HTTP response obtained without a browser, and can say what the
server did when the line endings were wrong.

:::

## Round 6 - `ping`: the one that is not an application tool

Everything above spoke an application protocol. `ping` does not. It sends an ICMP
echo request, which rides directly inside IP, and ICMP has no port numbers and no
concept of a service.

```bash
ping -c 5 onyx.boisestate.edu
```

That works, because Onyx is right there. Now try to ping the machine you fetched
a web page from twenty minutes ago in Round 4:

```bash
ping -c 3 example.com
```

**One hundred percent packet loss.** You have already had a `200 OK` out of that
host today. Write down both facts next to each other on the worksheet, because
together they are the entire point of this round, and of Round 3 in A2.

| Switch | What it does |
| ------ | ------------ |
| `-c 5` | Send five and stop, instead of forever |
| `-i 0.5` | Half a second between packets |
| `-s 1000` | Make the payload 1000 bytes |
| `-W 2` | Wait at most 2 seconds for each reply |
| `-w 5` | Give up entirely after 5 seconds |
| `-n` | Do not resolve names in the output |
| `-q` | Summary only |

Read the summary line: `min/avg/max/mdev`. Then answer, on the worksheet:

1. What layer does ICMP live at, and what does that mean about ports?
2. Onyx answers `ping`. Does that prove the SSH server on it is running?
3. `example.com` does **not** answer ping, and also served you a web page. So what
   exactly did the failed ping tell you? Name at least two different things that
   could produce that result.

Question 3 is the whole of A2's Round 3, and you now have the answer, from your
own terminal, a week early.

## Round 7 - Make it stick

You will type one `curl` command in A2 more than a dozen times. Retyping it is
how typos get into results, so teach the shell a new word and make it survive a
logout.

First, find out where bash reads its configuration. On Red Hat, a login shell
reads `~/.bash_profile`, and the default `~/.bash_profile` sources `~/.bashrc`.
Confirm it on your account:

```bash
cat ~/.bash_profile
head -20 ~/.bashrc
```

Look near the top of `~/.bashrc` for a line like `[ -z "$PS1" ] && return`. On
Onyx there is **no** such line, and that is why step 4b below is going to work.
Plenty of other systems do have one, and on those it makes the file give up
immediately for any shell that is not interactive. Write down whether yours has
it, because it is the difference between a function that works over `ssh` and one
that mysteriously does not.

Now add the function. Open `~/.bashrc` in an editor and put this at the bottom:

```bash
# CS425: probe a host and port, report how long each phase took
probe() {
    curl -sS -o /dev/null -m 8 \
        -w 'connect=%{time_connect} total=%{time_total} code=%{http_code}\n' \
        "http://$1:$2/"
}
```

Load it into the shell you are sitting in, then check it took:

```bash
source ~/.bashrc
type probe          # should say "probe is a function"
declare -f probe    # prints the definition back
probe example.com 80
```

Then prove it is permanent, which is the actual point:

1. Log out of Onyx completely. Log back in. Run `probe example.com 80` again
   without sourcing anything.
2. From your laptop, run `ssh onyx probe example.com 80`. That is a
   **non-interactive** shell: no prompt, no terminal, just one command. It should
   still work, because bash reads `~/.bashrc` when it is started by a remote shell
   daemon and Onyx has no guard line stopping it. Explain, in one sentence, why
   that same command would fail on a machine whose `~/.bashrc` began with
   `[ -z "$PS1" ] && return`.

On the worksheet, answer: **why a function and not an alias?** Try
`alias probe='curl ...'` and see what happens when you need `$1` and `$2` in the
middle of the command rather than at the end.

::: tip Checkpoint

`probe` survives a logout, and your group can explain the difference between a
login shell and a non-interactive one.

:::

## If you finish early

Put the same function in your **laptop's** shell configuration, so it is there
whichever machine you end up working from in A2. On macOS that is `~/.zshrc`; on
most Linux laptops `~/.bashrc`; in Git Bash on Windows, `~/.bashrc`.

Then extend it. Make a second function `probes` that prints the full five phase
timing breakdown from Round 4 instead of just two numbers, and put that in
`~/.bashrc` too.

## Worksheet

The printed worksheet handed out in class is what you fill in and turn in. It
covers, in order: the box and your instrument versions; the `dig` reading and the
switch table; the SSH cold and warm timings; the `curl` phase breakdown; the
hand typed HTTP request and what came back; the `ping` questions; and the
`.bashrc` function surviving a logout.

## Instructor Notes

Instructor note, not shown to students.

**Print the worksheet.**

```bash
./scripts/cs425/a1-application-layer.sh handout
```

No AWS involved; A1 is the only one of the three activities that needs no
testbed, just Onyx.

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
| outbound 80 / 443 | open |
| outbound 53 to anything else | **blocked** |
| `~/.bashrc` | no `PS1` guard; `~/.bash_profile` sources it |

Three consequences worth knowing before the room finds them:

- **`nc` is nmap-ncat, not the BSD one.** `-w` is the connect timeout, which is
  what you want, and `nc -l 127.0.0.1 PORT` works with no `-p`. It also **closes
  the connection as soon as stdin hits EOF**, so a bare
  `printf ... | nc host 80` sends the request and hangs up before the answer
  arrives, reporting `0 bytes received`. Round 5 wraps the printf in a brace group
  with a `sleep 3` for that reason, and asks students to explain it.
- **`dig @1.1.1.1` and `dig +trace` both fail**, because outbound 53 is blocked.
  This is written into Round 2 as a deliberate finding rather than a broken step,
  and it is a good ninety seconds at the board: both commands need to talk to a
  DNS server that is not the campus one, and something in the middle will not let
  them. It sets up A2 directly.
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
- **`ssh-copy-id` does not ship on Windows.** Have the manual `authorized_keys`
  procedure on the board before Round 3 starts.
- **Editing `~/.bashrc` over SSH.** Some students have never used a terminal
  editor. `nano` is the least painful option and is usually installed; have the
  save keystroke on the board.
- **A student who breaks their `~/.bashrc`** can lock themselves out of a usable
  shell. `ssh onyx -t 'bash --norc'` gets them back in to fix it. Worth knowing
  before it happens rather than during.
- **Round 5's listener.** Bind to `127.0.0.1`, never `0.0.0.0`, and make them
  kill it. It is a shared department machine.

**Grading.** Pass/fail, meant to be graded by flipping through the stack rather
than read closely. A pass is every round attempted with something real written in
it. Wrong answers about what a switch did still pass: the worksheet is a record of
what they observed, and half the value of the period is being wrong out loud about
why the TTL did not move. Canvas has no rubric attached, so award the full 20 or
nothing.

**Pacing.** Rounds 1 through 3 make a coherent first day and 4 through 7 a second.
If you have only one period, cut Round 6's switch table but **keep the
`ping example.com` demonstration**: outbound ICMP is blocked from Onyx, so a host
they successfully fetched a page from in Round 4 shows 100% packet loss in Round 6.
That contradiction, on their own screen, twenty minutes apart, is the best thing in
the activity and it costs ninety seconds.

**What this sets up.** Round 2's `+short` trap is A2 station 4, exactly. Round
4's timing breakdown is how A2 and A3 tell a connection failure from an
application stall. Round 5's refused versus timed out is A2 stations 2 and 3, and
the CRLF question is P1. Round 7 puts `probe` on the machine before A2 needs it.
