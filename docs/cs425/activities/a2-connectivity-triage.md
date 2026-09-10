---
next: false
prev: false
draft: true
---

# A2 - It Is Always DNS (Except When It Is Not)

**Week 4 · 20 points · 45 minutes · one paper worksheet per group, turned in before you leave**

## Overview

"The network is down" is not a diagnosis. It is what somebody says when they have
one symptom and no vocabulary. Today you are going to build the vocabulary.

Two machines are running in AWS. Between them they expose seven stations, and six
of them are broken. Each one is broken in a *different* way, and each way has a
distinct fingerprint you can see from your laptop with tools you already have. By
the end of the period you should be able to hear a symptom and name the layer.

The reason this matters right now is P1. The single most common thing that goes
wrong when you point a mail client at a server is that the connection **hangs**,
and the second most common is that it is **refused**. Those two words describe two
completely different failures with two completely different fixes, and today is
where you learn to tell them apart in under five seconds.

::: warning

This is a paper activity. Your group turns in **one filled out worksheet, on
paper, before you leave the room**. Nothing is submitted to Canvas and nothing is
accepted afterward, so pace yourselves and write as you go rather than at the end.

Copies are handed out in class. The same worksheet is at
[a2-worksheet.pdf](/cs425/a2-worksheet.pdf) if you need another one.

:::

## Before you start

- **Groups of 3 or 4.** Mix operating systems if you can.
- **One scribe** owns the paper worksheet and writes everyone's name at the top.
- **One timekeeper.** The rounds below add to 45 minutes with nothing to spare. If
  a round runs long, write down where you got stuck and move on. "We got as far as
  X and here is what we saw" earns most of the points. A blank box earns none.
- Everyone probes from their own laptop. Comparing your output to the person next
  to you is where half of the learning is.

The instructor will put two IP addresses on the board. Copy them into the target
card at the top of your worksheet before you touch anything else. Call them
**ALPHA** and **BRAVO** from here on.

## Your four probes

Every station in this activity is diagnosed with the same four commands. Learn
these four and you have covered most of a career's worth of "it doesn't work."

| Probe | macOS and Linux | Windows |
| ----- | --------------- | ------- |
| Resolve a name | `dig +short NAME @ALPHA` | `nslookup NAME ALPHA` |
| Is the host answering ICMP | `ping -c 3 ADDR` | `ping -n 3 ADDR` |
| Is the port open | `nc -vz -w 5 ADDR PORT` | `Test-NetConnection ADDR -Port PORT` |
| Does the service work | `curl -sS -o /dev/null -m 8 -w 'connect=%{time_connect} total=%{time_total} code=%{http_code}\n' http://ADDR:PORT/` | same, curl ships with Windows |

That `curl` line is the workhorse, so put it in a shell variable or a text file now
rather than retyping it eleven times:

```bash
probe() {
    curl -sS -o /dev/null -m 8 \
        -w 'connect=%{time_connect} total=%{time_total} code=%{http_code}\n' \
        "http://$1:$2/"
}
probe ALPHA 8080
```

**Read what curl prints on stderr when it fails.** The words are the answer. There
is a large difference between `Connection refused`, `Connection timed out after
8001 milliseconds`, and `Could not resolve host`, and telling them apart is
literally the point of the next 45 minutes.

## Round 1 - The healthy signature (5 minutes)

You cannot recognize broken until you have looked at working. Probe **ALPHA port
8080** with all four commands and fill in the first row of the station table.

Write down the actual numbers, not "it worked":

- What did `ping` report for minimum round trip time?
- What did `curl` report for `connect=`? How does that compare to the ping time,
  and why should it?
- What HTTP status code came back?

::: tip Checkpoint

Every member has a working baseline row on their own laptop, and your group can
say why `connect=` and the ping RTT are in the same neighborhood.

:::

## Round 2 - Four ways to fail (20 minutes)

Five minutes per station. Do them in order, because the order is the argument.

### Station 2 - ALPHA port 8081

Probe it. Time how long it takes to give up. Compare that number to the baseline
`connect=` from Round 1.

Before you write down a cause, answer this: **did anything come back at all?**

### Station 3 - ALPHA port 8082

Probe it. Time how long it takes to give up.

Same host as station 2. Same laptop. Same network. Completely different behavior.
Your worksheet needs the wording `curl` used and the number of seconds, because
those two facts are the whole diagnosis.

::: tip The one distinction that matters

Stations 2 and 3 are the two failures you will hit for the rest of your life, and
they are opposites.

One of them means a machine received your packet and answered "no." The other
means nobody answered anything at all. Work out which is which, and work out
**what the host sent back** in the case that failed fast. It is one TCP flag.

:::

### Station 4 - the name `ghost.cs425.lab`

```bash
dig +short ghost.cs425.lab @ALPHA
dig ghost.cs425.lab @ALPHA | grep -i status
```

Do not `curl` anything yet. Look at the status field in the answer first, then
decide whether it is even possible for this to be a connectivity problem.

### Station 5 - the name `mirage.cs425.lab`

```bash
dig +short mirage.cs425.lab @ALPHA
```

You get an address back this time, so DNS worked. Now `curl` that address on port
8080 and watch what happens.

Compare the symptom to station 2. They look identical from where you are sitting,
and they are not the same failure at all. On the worksheet, name the **one probe**
that separates them, and say what is special about the address `dig` handed you.

::: tip Checkpoint

You have four station rows filled in, and your group has argued about station 5
for at least a minute.

:::

## Round 3 - The probe that lies (8 minutes)

`ping` the **BRAVO** address. Then `curl` BRAVO port 8080.

One of those fails and one of those succeeds, and the one that fails is the one
most people would have used to decide the host was down.

On the worksheet:

1. Which probe reported the machine unreachable, and which proved it was not?
2. What protocol does `ping` use, and at what layer does it live?
3. ALPHA answers `ping` and BRAVO does not, yet both serve the same page on 8080.
   What is different between the two hosts, and where does that difference live:
   on the host, or somewhere in front of it?
4. Write one sentence you could say to a coworker who has just told you "the
   server is down, it doesn't ping."

## Round 4 - Build the decision tree (7 minutes)

This is the part you will actually keep. Fill in the flowchart on the worksheet so
that it takes any symptom to a cause, and complete the summary table.

The tree starts with the question that has to come first, because if the answer is
bad you never sent a single packet to the target at all. Figure out which question
that is.

Every leaf of your tree must name **which layer** the fault is at and **who can fix
it**: you, the person running the server, or the network between you.

## Round 5 - Say it out loud (5 minutes)

Two questions, and the second one is the one worth points.

1. Give the two symptom words that a hang and a refusal produce, and say what a
   server sends in each case. One of them sends nothing.
2. You are on call. Somebody reports "our API is down." You get one command before
   you have to say something useful. **Which single command do you run, and what
   are the three different things its output can tell you?** Defend the choice.

Then hand the worksheet in. Names on it, all of them.

## If you finish early

**Station 7 - ALPHA port 8084.** Probe it. The connection succeeds and then
nothing ever comes back. `nc -vz` is delighted, `curl` sits there until it gives
up.

Which layer completed successfully, and which one never did? Why is a health check
that only tests whether the port opens worse than useless against this failure?

**The other side.** For station 2, your packets vanished. Did they vanish before
they reached the host, or after? You cannot tell from your laptop, which is the
honest and uncomfortable answer, and it is why the next thing anyone does is go
look at the server. Write down the command you would run **on the server** to find
out whether your SYN ever arrived.

## Worksheet

The printed worksheet handed out in class is what you fill in and turn in. It has,
in this order:

```
Target card:  ALPHA = ______________   BRAVO = ______________

Station table, one row each for:
  1  ALPHA 8080   (baseline)
  2  ALPHA 8081
  3  ALPHA 8082
  4  ghost.cs425.lab
  5  mirage.cs425.lab
  6  BRAVO 8080
  7  ALPHA 8084   (stretch)

Columns: what dig returned | what ping did | what curl printed | seconds to fail
         | the cause in your own words | layer

Round 3: the four ping questions.
Round 4: the decision tree, filled in, plus the summary table.
Round 5: the two synthesis questions.
```

Paste nothing, screenshot nothing. Write it by hand. If you run out of room, use
the back.

## Rubric

| # | Criterion | Points |
| - | --------- | ------ |
| 1 | Baseline row is filled in with real numbers, and the group can relate `connect=` to the ping RTT | 2 |
| 2 | Stations 2 and 3 are distinguished correctly: one is a silent drop, one is a refusal, and the group names the TCP flag that produced the fast failure | 5 |
| 3 | Station 4 is identified as a name resolution failure and not a connectivity failure, with the status field as evidence | 3 |
| 4 | Station 5 is separated from station 2, and the group explains why the returned address cannot be routed | 3 |
| 5 | Round 3 answers are correct, including what layer ICMP lives at and why a failed ping is not evidence of a dead host | 3 |
| 6 | The decision tree is complete, every leaf names a layer and an owner, and the summary table matches the stations | 3 |
| 7 | Round 5 question 2 picks a defensible single command and gives three distinct outcomes it can produce | 1 |

## Instructor Notes

Instructor note, not shown to students.

**Print the worksheet.** `docs/public/cs425/a2-worksheet.pdf`, four pages, meant
to go out double sided as two sheets per group. It is generated from
`docs/public/cs425/a2-worksheet.html`; edit the HTML and re-render with

```bash
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless \
    --no-pdf-header-footer \
    --print-to-pdf=docs/public/cs425/a2-worksheet.pdf \
    "file://$PWD/docs/public/cs425/a2-worksheet.html"
```

The target card at the top of page 1 is deliberately blank, because the two
addresses change every time the testbed is launched. Put them on the board from
`card` below and the worksheet stays good for every term.

**Stand the testbed up before class.** It lives in this repo at
`scripts/cs425-triage-testbed.sh` and takes about four minutes end to end.

```bash
./scripts/cs425-triage-testbed.sh create --region us-west-2 --cidr 132.178.0.0/16
./scripts/cs425-triage-testbed.sh verify     # asserts all seven signatures
./scripts/cs425-triage-testbed.sh card       # the two IPs, for the board
```

`verify` is the one that matters. It probes every station from your machine and
prints PASS or FAIL per station, so you find out that the security group drifted
before thirty students do. Run it once the night before and once from the podium.

Narrow `--cidr` to campus if the whole section is on campus or on the VPN. Port
8080 on an open address gets scanned within the hour; the scans are harmless but
they clutter the logs you might want during the stretch round.

**Tear it down when class ends.** Two `t3.micro` instances, a few cents an hour,
and nothing expires on its own.

```bash
./scripts/cs425-triage-testbed.sh destroy --purge-key
```

**How the stations are broken**, so you can answer questions without reading the
script:

| Station | Mechanism |
| ------- | --------- |
| 1 ALPHA 8080 | works, security group allows it |
| 2 ALPHA 8081 | server is listening, the security group does **not** allow the port, so the SYN is dropped with no reply |
| 3 ALPHA 8082 | security group allows the port, nothing is listening, kernel answers RST |
| 4 ghost | dnsmasq is authoritative for `cs425.lab` and has no such record, so NXDOMAIN |
| 5 mirage | an A record pointing at `10.42.13.37`, which is RFC 1918 and goes nowhere from a laptop |
| 6 BRAVO 8080 | second instance, second security group, TCP 8080 allowed and ICMP not allowed at all |
| 7 ALPHA 8084 | accepts the connection, never writes a byte, never closes |

**Timing.** The rounds add to exactly 45 minutes, which means they add to more than
45 minutes. If the period is short, cut Round 3 to two of its four questions rather
than cutting Round 4. Round 4 is the deliverable that students keep.

**Where it goes wrong.**

- **A campus resolver that intercepts port 53.** Some networks hijack outbound DNS,
  which makes stations 4 and 5 return whatever the campus resolver felt like. The
  testbed also answers on **port 5353** for exactly this reason: have them run
  `dig -p 5353 ghost.cs425.lab @ALPHA`. If a table's port 53 answers disagree with
  their neighbor's, that is a genuine finding and worth two minutes at the board.
- **Windows `nslookup` and nonstandard ports.** It can be done but it is not worth
  the class time. Pair a Windows student with someone who has `dig`, or have them
  use `Resolve-DnsName -Server ALPHA -Name ghost.cs425.lab`.
- **`nc` is missing** on a stock Windows box and on some minimal Linux images. This
  is why every station is specified in terms of `curl`, which is everywhere.
- **Students conclude station 3 means "the server is down."** It is the opposite:
  a RST proves a live host with a live IP stack. Push on that one, it is the single
  most valuable correction in the period.

**What this sets up.** Station 3 and the RST is chapter 3. Station 5 and RFC 1918
is chapter 4 and the NAT discussion. Station 2 versus station 6, drop versus
reject, is the firewall material in chapter 8. And all of it is P1 support load
you do not have to answer over email.
