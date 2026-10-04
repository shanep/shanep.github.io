---
next: false
prev: false
submission: online_upload
---

# X1 - Midterm Alternative: Anatomy of a Page Load

**Week 8 · 160 points · take home · individual · about 10 hours · submit in Canvas**

## Overview

This assignment is an alternative to the midterm exam. It covers the same material,
chapters 1 through 4, but instead of answering questions about delay, DNS, TCP and
NAT from memory you are going to measure every one of them on real networks and
explain what you see.

You will use a command line AI agent to build a small C program called `pageload`
that fetches a URL over plain HTTP and times each step along the way: the DNS
lookup, the TCP handshake, the wait for the first byte, and the transfer. Then you
run it from three different networks against servers in Utah, California, New
York, Germany and Japan, predict what the numbers should be before you look, and
explain the difference between your predictions and reality using the textbook.

The agent writes the code. You do the networking. Almost all of the points are in
the analysis, because that is the part an exam would test.

## How this counts

X1 and the Midterm Exam are both in the **Midterm** assignment group (25% of your
final grade), and that group drops the lowest score. So you have three options:

- Take the midterm exam only
- Do X1 only
- Do both, and the better of the two scores counts

X1 is due at the same time the midterm closes, **Friday of week 8 at 11:59pm**,
and there is **no grace period**. It replaces an exam, so the 2 day grace period
for homework in the syllabus does not apply. Work submitted 1 second late is
treated the same as work submitted 1 day late.

::: danger This is individual work

X1 replaces an exam, so it is individual. Do not share code, measurements, or
any part of your report with anyone else in the class. You can talk about the
textbook with classmates, but your numbers and your explanations must be your own.
Two reports with the same measurements are both a zero.

:::

## Learning Outcomes

- 1.2 Compare circuit switching and packet switching, and account for delay, loss, and throughput in a packet-switched network
- 2.3 Describe how DNS resolves a name, and why it is structured as a distributed hierarchical database
- 3.2 Analyze TCP connection management, flow control, and congestion control
- 4.1 Describe the data plane: forwarding, the IP datagram, addressing, and NAT
- 4.4 Subnet an address block with CIDR and compute the resulting ranges
- 7.3 Compile and run code on at least two different systems

## AI First

This assignment is **AI first**. That means you start every task by asking your
agent, not by opening a blank file. The course AI policy has no restrictions, and
this assignment leans into that on purpose: the skill being tested is whether you
can drive an agent to a correct result and then tell whether what it gave you is
actually correct.

- **Use a command line agent.** GitHub Copilot CLI (free with GitHub Education,
  see [M1](m1-copilot-cli.md)), Claude Code, OpenAI Codex CLI, Gemini CLI, or
  similar. It has to be a tool that runs in your terminal, edits files, and runs
  commands, not a chat window in a browser.
- **Save every session.** Export each session to Markdown before you close it
  (`/share file ./session-1.md` in Copilot CLI, `/export` in Claude Code). If you
  forget, `copilot --resume` lets you reopen it. You will submit all of them.
- **You can use the agent for the analysis too.** But every answer must be built
  on **your own measurements**, and you are responsible for every claim in your
  report. An answer that does not use your numbers earns no points for that
  question, no matter how well written it is.
- **Do not pay for anything.** Copilot CLI through GitHub Education is all you
  need. If it says you are out of requests, stop and email me.

## Task 1 - Setup

You need three **vantage points**, three different networks to measure from:

1. **Your laptop**, on the network you normally use (home, apartment, campus
   Wi-Fi, whatever it is). A Mac is fine as it is, and on Windows use WSL.
2. **Onyx**, which is on campus in Boise.
3. **A GitHub Codespace**, which runs in a Microsoft data center somewhere.

Do the agent work on your laptop. Make a directory for the assignment, make it a
**private** GitHub repository, and start your agent inside it:

```bash
mkdir cs425-x1
cd cs425-x1
git init
copilot
```

Once `pageload` builds, push the repository to GitHub and open a Codespace on
it. Onyx you reach with `ssh onyx`, the key and the one word shortcut you setup in
[A2](../activities/a2-stop-typing-your-password.md). The agent does not need to
run on Onyx or in the Codespace, only your program does.

::: tip This is what A2 was for

An agent can not type your password. Because `ssh onyx` logs in with your key and
no prompt, your agent can copy your code to Onyx, build it, run your measurements
and copy the results back, all from your laptop, while you watch and approve each
command:

```bash
ssh onyx mkdir -p cs425-x1
scp pageload.c Makefile measure.sh onyx:cs425-x1/
ssh onyx 'cd cs425-x1 && make && ./measure.sh onyx'
scp onyx:cs425-x1/measurements-onyx.txt .
```

The connection multiplexing from A2 step 4 means only the first of those pays for
a full login, the rest reuse the open connection. If `ssh onyx` still asks for a
password, go back and finish A2 steps 1 through 3 before you start anything else.
It takes about 15 minutes and you will save that many times over this week.

:::

## Task 2 - Build `pageload` with your agent

Give your agent the specification below. You can paste it in, break it into
smaller prompts, or describe it in your own words. Read each command the agent
asks to run before you approve it, the same way you did in M1.

```text
pageload [-4 | -6] [-n trials] [-o file] http://host[:port][/path]
```

- Accept only `http://` URLs. Reject `https://` and anything malformed with a
  useful error and a nonzero exit status. The port defaults to 80 and the path
  to `/`.
- `-4` uses only IPv4 and `-6` only IPv6. With neither, use whatever
  `getaddrinfo` returns first.
- `-n` repeats the whole fetch that many times (default 1), including the DNS
  lookup. `-o` writes the response body of the last trial to a file.
- For each trial, do the following with the sockets API (no `curl`, no libcurl,
  no HTTP library):
  1. Resolve the host with `getaddrinfo`, and time it.
  2. Open a TCP socket and `connect`, and time only the `connect` call.
  3. Send an HTTP/1.1 `GET` with a `Host` header and `Connection: close`.
  4. Time from sending the request to the first byte of the response.
  5. Read until the server closes the connection, and time that.
- For each trial, print: the DNS time and the address it resolved to, the connect
  time and the full 4-tuple (local address and port, remote address and port,
  using `getsockname`), the first byte time, the transfer time with the number of
  body bytes and the throughput in Mbit/s, and the HTTP status line.
- After the last trial, print the minimum and median connect time.
- Time everything with `clock_gettime(CLOCK_MONOTONIC, ...)`.
- A `Makefile` builds it with `-Wall -Wextra`, with **no warnings** on both
  Codespaces and Onyx, and has a `clean` target.

The exact layout of the output is up to you. Here is what mine looks like, run
from my laptop on a home network:

```text
$ ./pageload -4 -n 3 http://ftp.jaist.ac.jp/debian/README
trial 1  http://ftp.jaist.ac.jp/debian/README
  dns            15.7 ms  ftp.jaist.ac.jp -> 150.65.7.130:80 (IPv4)
  connect       260.1 ms  192.168.4.42:51549 -> 150.65.7.130:80
  first byte    286.4 ms
  transfer        0.7 ms  1198 bytes, 13.93 Mbit/s
  status     HTTP/1.1 200 OK
trial 2  http://ftp.jaist.ac.jp/debian/README
  dns             1.1 ms  ftp.jaist.ac.jp -> 150.65.7.130:80 (IPv4)
  connect       247.2 ms  192.168.4.42:51552 -> 150.65.7.130:80
  first byte    280.2 ms
  transfer        0.0 ms  1198 bytes, 273.83 Mbit/s
  status     HTTP/1.1 200 OK
trial 3  http://ftp.jaist.ac.jp/debian/README
  dns             3.6 ms  ftp.jaist.ac.jp -> 150.65.7.130:80 (IPv4)
  connect       253.3 ms  192.168.4.42:51556 -> 150.65.7.130:80
  first byte    313.5 ms
  transfer        0.0 ms  1198 bytes, 199.67 Mbit/s
  status     HTTP/1.1 200 OK
connect over 3 trials: min 247.2 ms, median 253.3 ms
```

And a bigger download, where the transfer time finally matters:

```text
$ ./pageload -4 http://mirrors.xmission.com/debian/dists/trixie/main/binary-amd64/Packages.gz
trial 1  http://mirrors.xmission.com/debian/dists/trixie/main/binary-amd64/Packages.gz
  dns             7.9 ms  mirrors.xmission.com -> 198.60.22.13:80 (IPv4)
  connect        31.1 ms  192.168.4.42:51561 -> 198.60.22.13:80
  first byte     34.0 ms
  transfer      545.8 ms  13332733 bytes, 195.42 Mbit/s
  status     HTTP/1.1 200 OK
connect over 1 trials: min 31.1 ms, median 31.1 ms
```

Test it before you trust it. Compare the address it prints with `dig`, and the
body it saves with `-o` against the same URL in a browser. On Onyx you also still
have the `probe` function from A2, which times the same connect with `curl`, so
`ssh onyx probe mirrors.xmission.com 80` and `pageload` on Onyx should report
connect times in the same ballpark. If something is wrong,
tell the agent what happened and let it fix it, and leave that back and forth in
the log.

## Task 3 - Predict

Before you run a single measurement, write your predictions down in `report.md`.
Then **paste them into your agent session** and ask it to comment on them. That
puts your predictions in the session log, timestamped, before any of the
measurements. A prediction written after you have seen the numbers is not a
prediction.

Predict the following. A wrong prediction costs you nothing, a missing one does.

1. The minimum connect time from your laptop to each of the five mirrors in the
   table below, computed from distance alone: the great circle distance there and
   back at the speed of light in fiber, 2 x 10^8 m/s (200 km per millisecond).
2. Which mirror will have the longest connect time from the Codespace, and why.
3. Whether the DNS time changes between trial 1 and trial 2, and why.
4. Which of your three vantage points are behind a NAT.
5. Whether downloading the same 13 MB file from Utah and from Japan will take
   about the same time, and why.

## Task 4 - Measure

Run every target below from **all three** vantage points, with `-4` and `-n 5`:

| Target | URL | Location |
| ------ | --- | -------- |
| CDN | `http://example.com/` | served by a content delivery network |
| Utah | `http://mirrors.xmission.com/debian/README` | Salt Lake City, UT |
| California | `http://mirrors.ocf.berkeley.edu/debian/README` | Berkeley, CA |
| New York | `http://mirrors.rit.edu/debian/README` | Rochester, NY |
| Germany | `http://ftp.fau.de/debian/README` | Erlangen, Germany |
| Japan | `http://ftp.jaist.ac.jp/debian/README` | Nomi, Japan |

Then, from all three vantage points, download the same file from Utah and from
Japan with `-4 -n 3`:

```text
/debian/dists/trixie/main/binary-amd64/Packages.gz
```

It is about 13 MB, and from far away it can take 30 seconds or more per trial, so
be patient. Finally, from each vantage point, ask a server what your public
address is:

```bash
./pageload -4 -o public-ip.txt http://checkip.amazonaws.com/
cat public-ip.txt
```

You are not going to type all of that three times. Have your agent write a script
called `measure.sh` that does it for you, to the specification below.

### What `measure.sh` must do

- **Take the vantage point as its only argument.** `./measure.sh laptop`,
  `./measure.sh onyx` or `./measure.sh codespace`. Anything else, or no argument,
  prints a usage message and exits with status 1.
- **Build first.** Run `make` before anything else and stop if the build fails, so
  a run never measures with a stale binary.
- **Keep every target in one list** at the top of the script, so you (and I) can
  see what it measures without reading the whole thing.
- **Write a header** before the first measurement: the vantage point name, the date
  and time in UTC (`date -u`), `hostname`, `uname -a`, the short git commit of the
  code being run (`git rev-parse --short HEAD`), and the output of `ip -4 addr`.
  You need that last one for question 15. If your laptop does not have `ip`, have
  your agent find the command that shows the same thing.
- **Run these sections, in this order,** each one starting with a marker line such
  as `=== latency utah ===` and the time it started:
  1. **Public address.** Fetch `http://checkip.amazonaws.com/` with `-o` and print
     the address it returned (question 13).
  2. **Latency.** Every target in the table above, with `-4 -n 5`.
  3. **Downloads.** `Packages.gz` from Utah and from Japan, with `-4 -n 3`.
  4. **Two at once.** Two copies of `pageload` against the Utah mirror at the same
     time, each writing to its own temporary file, then both files printed one after
     the other so the output does not interleave (question 11).
  5. **DNS trace.** `dig +trace ftp.jaist.ac.jp` (question 7). It fails on Onyx,
     which blocks DNS to every server but the campus one (you saw that in A1), and
     if `dig` is not installed it cannot run at all. Either way, print a note
     saying so and keep going.
- **Keep going when a target fails.** A mirror that is down or slow should not end
  the run. Print the exit status of the failed `pageload` and move on to the next
  target.
- **Save everything.** Both stdout and stderr go to the screen and to
  `measurements-<vantage>.txt` (use `tee`), replacing the file from any earlier run.
- **Finish with a summary line:** how long the whole run took (bash keeps a count in
  `$SECONDS`) and how many targets failed.
- **Nothing else.** No `sudo`, no installing packages, and no editing of the
  results. It is a plain `bash` script that starts with `#!/usr/bin/env bash`.

The finished file has a shape like this (the `...` is where the `pageload` output
goes):

```text
=== x1 measure.sh  vantage=onyx ===
date      2026-10-14T18:02:11Z
hostname  onyx
uname     Linux onyx 5.14.0 ... x86_64 GNU/Linux
commit    3f9c2a1
...output of ip -4 addr...

=== public address  18:02:12 ===
...
=== latency cdn  18:02:13 ===
...
=== latency utah  18:02:15 ===
...
=== download japan  18:04:40 ===
...
=== two at once  18:06:02 ===
...
=== dns trace  18:06:04 ===
...
=== done in 241 s, 0 failed ===
```

A full run takes about 5 to 10 minutes, most of it the Japan downloads. Run the
whole thing at least once per vantage point and submit the raw output. Do not edit
it, the commit and the timestamps in the header are how I match it to your code
and your session log.

You also need to know roughly **where** each vantage point is to work out the
distances. For your laptop and Onyx that is easy. For the Codespace, your region
setting at [github.com/settings/codespaces](https://github.com/settings/codespaces)
is a good start. Say how you decided.

## Task 5 - Analyze

Answer each question in `report.md`, under a heading with its number. Show your
work for every calculation, cite the textbook section that backs up each
explanation, and use **your** measurements. A few sentences and a table is the
right size for most questions.

### Chapter 1 - Delay and throughput

1. **Distance versus delay.** Make a table with a row for every mirror and
   vantage point: the great circle distance, the propagation round trip time at
   2 x 10^8 m/s, your minimum connect time, and the ratio of the two.
2. **Where the extra time goes.** Every ratio is above 1. Explain why using the
   four components of nodal delay from section 1.4, plus the fact that packets do
   not travel in a straight line. Which component dominates for Japan, and which
   for Utah?
3. **Minimum, not mean.** Why does question 1 use the minimum connect time
   instead of the mean? Use the spread of your own 5 trials to back it up.
4. **Transmission delay.** A SYN segment is about 64 bytes on the wire. Compute
   its transmission delay on a 10 Mbit/s link and on a 1 Gbit/s link, and compare
   both to your propagation delay to Utah. What does that tell you about which
   delay matters for small messages?
5. **Throughput.** For the `Packages.gz` downloads, compare the throughput from
   Utah and from Japan at each vantage point. Is your access link the bottleneck
   in both cases? How do you know?

### Chapter 2 - The application layer

6. **DNS caching.** Compare the DNS time of trial 1 with trials 2 through 5 for
   one mirror at each vantage point. Explain the difference in terms of the local
   DNS server and caching.
7. **The DNS hierarchy.** Using the DNS trace from a vantage point where it
   worked, list, in order, the servers that were asked and what each one
   answered (a referral or the address). Map each one to its place in the
   hierarchy from section 2.4.
8. **The CDN.** Did DNS give `example.com` the same address at all three vantage
   points? How does its connect time compare with the mirrors? Use section 2.6 to
   explain how the CDN got a server close to you, and say which technique your
   evidence points to.
9. **Counting round trips.** The first byte time is roughly one RTT plus the time
   the server spends answering. Estimate the server time for two mirrors. Then
   count the round trips `pageload` spends from the start of the DNS lookup to the
   last byte of the README, and compare that with the non-persistent HTTP
   estimate in section 2.2. You did the same thing for a cold SSH login in A2
   step 4, so use that as your model.

### Chapter 3 - The transport layer

10. **The handshake.** Your connect time is about one RTT, not one and a half.
    Which segments have been sent and received when `connect` returns? Why does
    the client not have to wait for the third one?
11. **Demultiplexing.** Use the "two at once" section of one of your
    measurement files, where two copies of `pageload` ran against the same mirror
    at the same time. Write down both 4-tuples. What is different between them, who picked it, and how
    does the server tell the two connections apart when both arrive at port 80?
    (section 3.2)
12. **Slow start.** For `Packages.gz`, assume an MSS of 1,460 bytes, an initial
    congestion window of 10 segments, no loss, and a window that doubles every
    RTT. How many RTTs does it take to send the whole file? Using your minimum
    connect time as the RTT, what is the shortest possible transfer time from
    Utah and from Japan? Compare with what you measured. Which path comes closer
    to the estimate, and what is holding the other one back? (sections 3.5 and
    3.7)

### Chapter 4 - The network layer

13. **Private and public addresses.** For each vantage point, give the local
    address from the 4-tuple and the public address from `checkip`. Which local
    addresses are private (RFC 1918)? Which vantage points are behind a NAT, and
    what is your evidence?
14. **The NAT table.** For one vantage point that is behind a NAT, write the NAT
    translation table entry for one of your connections, both the WAN side and
    the LAN side, the way section 4.3 draws it. Fill in everything you can
    observe, and for anything you cannot, say why you cannot see it from where you
    are.
15. **Subnetting.** For each vantage point, find the interface address and
    prefix length in the header of its measurement file. Compute the network
    address, the broadcast address, the usable host range, and the number of
    usable hosts. Show the binary for one of them.

## Task 6 - Catch the agent

Find one place where your agent was wrong, incomplete, or made a suggestion you
did not take. Quote it from the session log, say how you checked it (a man page,
the textbook, a measurement), and give the correct answer.

If the agent never got anything wrong, pick the most important claim it made
about your measurements, verify it independently, and say how. "It was always
right" with nothing behind it earns no points.

## What to submit

Upload these files directly to the Canvas assignment. Do not zip them.

| File | What it shows |
| ---- | ------------- |
| `pageload.c` and `Makefile` | The program your agent helped you build |
| `measure.sh` | The script that ran your measurements |
| `measurements-laptop.txt`, `measurements-onyx.txt`, `measurements-codespace.txt` | The raw output, unedited |
| `session-*.md` | Every exported agent session |
| `report.md` | Your predictions, your answers to Task 5, and Task 6 |

## Rubric

| # | Criterion | Points |
| - | --------- | ------ |
| 1 | `pageload` meets the specification and builds with no warnings on Codespaces and Onyx | 20 |
| 2 | Session logs show the agent built the tool and the predictions were logged before measuring | 10 |
| 3 | Measurements are complete: three vantage points, every target, every download, raw output | 15 |
| 4 | Chapter 1: distance table, delay components, minimum versus mean, transmission delay | 25 |
| 5 | Chapters 1 and 3: throughput, the bottleneck, and the slow start estimate | 20 |
| 6 | Chapter 2: DNS caching, the DNS hierarchy, the CDN, and counting round trips | 25 |
| 7 | Chapter 3: the handshake and demultiplexing | 15 |
| 8 | Chapter 4: private and public addresses, the NAT table, and subnetting | 20 |
| 9 | Catch the agent | 10 |

## Instructor Notes

Instructor note, not shown to students.

**Why this exists.** The midterm group drops the lowest score, so X1 is an
alternative and insurance at the same time. The agent removes the C as a barrier,
so the grade rests on the analysis, and the analysis is tied to measurements
nobody else has. A report built on generic numbers, or numbers that do not match
the measurement files and the session log, is the thing to look for.

**Reference run.** From my laptop on a home network, behind a NAT with local
address `192.168.4.42`:

| Target | Distance from Boise | Propagation RTT | Min connect | Ratio |
| ------ | ------------------- | --------------- | ----------- | ----- |
| Utah | 476 km | 4.8 ms | 31.1 ms | 6.5 |
| Japan | 8,480 km | 84.8 ms | 247.2 ms | 2.9 |

`Packages.gz` (13,332,733 bytes): Utah 546 ms at 195 Mbit/s, Japan 28.2 s at
3.8 Mbit/s. The slow start estimate for question 12 is 9,132 segments, so 10 RTTs
(10 x (2^10 - 1) = 10,230 segments). From Japan that is about 2.5 s at a 247 ms
RTT, and the measured 28 s is an order of magnitude worse, which is loss and the
receive window, not the access link (Utah over the same link ran at 195 Mbit/s).
A quick reference `pageload` is about 150 lines of C.

**Grading.** Spot check that the numbers in `report.md` appear in the measurement
files, that the measurement files look like the tool's output, and that the
predictions show up in a session log before the measurements. Then read the
answers. Rows are full or no marks in the Canvas rubric, so adjust by hand for a
row that is mostly right.

**Things to check before publishing, and things students hit.**

- The mirror URLs and the `Packages.gz` path. Debian rewrites `Packages.gz` at
  every trixie point release, so its size drifts, which is fine because the tool
  reports the bytes.
- Outbound port 80 from Onyx.
- Anyone who skipped A2 or never finished it hits a password prompt on Onyx,
  and the agent stalls on it. A2 steps 1 to 3 fix that in about 15 minutes.
- `ping` and `traceroute` often do not work from a Codespace (ICMP out of
  Azure is filtered). That is why the assignment times `connect` instead.
- `dig` may not be installed in a Codespace (`sudo apt-get install dnsutils`).
- `example.com` is on Cloudflare (`*.ns.cloudflare.com`, `104.20.23.154`), which
  is anycast, so the same address everywhere is the expected answer to question 8.
- The WAN side port of a NAT entry is not visible from the client. Saying so, and
  why, is the right answer to that part of question 14.
