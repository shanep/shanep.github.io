---
next: false
prev: false
draft: true
---

# A2 - It Is Always DNS (Except When It Is Not)

**Week 4 · 20 points · pass/fail · one paper worksheet per group, turned in before you leave**

## Overview

"The network is down" is not a diagnosis. It is what somebody says when they have
one symptom and no vocabulary. This activity builds the vocabulary.

Two machines are running in AWS. Between them they expose a set of stations, and
almost all of them are broken. Each one is broken in a *different* way, and each
way has a distinct fingerprint you can see from your laptop with tools you already
have. Today you collect the fingerprints. In [A3](./a3-name-the-layer.md) you turn
them into a decision procedure.

The reason this matters right now is P1. The single most common thing that goes
wrong when you point a mail client at a server is that the connection **hangs**,
and the second most common is that it is **refused**. Those two words describe two
completely different failures with two completely different fixes, and this is
where you learn to tell them apart in a few seconds.

::: warning

This is a paper activity. Your group turns in **one filled out worksheet, on
paper, before you leave the room**. Nothing is submitted to Canvas and nothing is
accepted afterward, so write as you go rather than at the end.

Copies are handed out in class. The same worksheet is at
[a2-worksheet.pdf](/cs425/a2-worksheet.pdf) if you need another one.

It is graded pass/fail. Every round attempted in good faith is a pass, and being
wrong about a station costs you nothing as long as you wrote down what you saw.

The data you collect today is what A3 is built on, so your worksheet comes back
to you at the start of it.

:::

## Before you start

- **Groups of 3 or 4.** Mix operating systems if you can.
- **One scribe** owns the paper worksheet and writes everyone's name at the top.
- If a round bogs down, write down where you got stuck and move on. "We got as far
  as X and here is what we saw" passes; a blank box does not.
- Everyone probes from their own laptop. Comparing your output to the person next
  to you is where half of the learning is.

The instructor will put two IP addresses on the board. Copy them into the target
card at the top of your worksheet before you touch anything else. Call them
**ALPHA** and **BRAVO** from here on.

## Your four probes

### Set up your terminal, once

All three steps below are **typed into your terminal**, not saved into a file.
They last only as long as that terminal window is open, so if you open a new tab,
or close and reopen the terminal, do all three again.

**Step 1. Store the two addresses.** Use the numbers from the board rather than
the ones printed here. Note there are no spaces around the `=`; bash is fussy
about that and will give you a confusing error if you add them.

```bash
ALPHA=203.0.113.10
BRAVO=203.0.113.42
```

On Windows PowerShell that is `$ALPHA = "203.0.113.10"` instead.

**Step 2. Make a shortcut for the long curl command.** You are going to run that
`curl` line more than a dozen times today, and retyping it is how typos get into
your results. Teach the shell a new word instead. Type this as **one line** and
press Enter:

```bash
probe() { curl -sS -o /dev/null -m 8 -w 'connect=%{time_connect} total=%{time_total} code=%{http_code}\n' "http://$1:$2/"; }
```

Nothing is printed back, and that is correct. You have defined a function, not run
one.

If you would rather read it than squint at it, this is the same thing typed over
several lines, which bash also accepts:

```bash
probe() {
    curl -sS -o /dev/null -m 8 \
        -w 'connect=%{time_connect} total=%{time_total} code=%{http_code}\n' \
        "http://$1:$2/"
}
```

**If your prompt turns into a bare `>`**, you have missed a quote or a brace and
the shell is patiently waiting for you to finish. Press **Ctrl-C** and type it
again. This is by far the most common way this step goes wrong.

**Step 3. Test it before you trust it.**

```bash
probe $ALPHA 8080
```

You should get back something like `connect=0.022526 total=0.065459 code=200`. If
you get `command not found`, step 2 did not take, so do it again.

`probe` takes two things after it: first an address, then a port. Inside the
function, `$1` is whatever you typed first and `$2` is whatever you typed second.
So `probe $ALPHA 8081` is station 2, and `probe $BRAVO 8080` asks the other
machine entirely.

### One piece of syntax worth knowing

`$ALPHA` means "the address I stored in step 1". In `dig`, the `@` is **not part
of the address**: it means "ask *this* server", so `@$ALPHA` reads as "put this
question to the ALPHA machine". You have to say that here because `cs425.lab` is
not a real internet name, so ALPHA is the only machine on earth that knows the
answer.

### The probes

Every station is diagnosed with these same four commands. Learn them and you have
covered most of a career's worth of "it doesn't work." They are shown here against
station 1; for the other stations you change the port number, or the name for
stations 4 and 5, and swap `$ALPHA` for `$BRAVO` where the station says so.

| Probe | macOS and Linux | Windows |
| ----- | --------------- | ------- |
| Resolve a name | `dig +short alpha.cs425.lab @$ALPHA -p 5353` | `nslookup -port=5353 alpha.cs425.lab 203.0.113.10` |
| Is the host answering ICMP | `ping -c 3 $ALPHA` | `ping -n 3 $ALPHA` |
| Is the port open | Linux `nc -vz -w 5 $ALPHA 8080`, macOS `nc -vz -G 5 $ALPHA 8080` | `Test-NetConnection $ALPHA -Port 8080` |
| Does the service work | `curl -sS -o /dev/null -m 8 -w 'connect=%{time_connect} total=%{time_total} code=%{http_code}\n' http://$ALPHA:8080/` | same, curl ships with Windows |

**The two forms of `dig` matter.** `+short` prints *only the answer records*.
A name with no answer therefore prints **nothing at all**, and still exits
successfully, which looks exactly like a broken command and is not one: the empty
line *is* the answer, because there was no address to print. Whenever you get
nothing back, run it again **without** `+short` and read the `status:` field,
which is where the real reply lives. Station 4 is precisely this case, so it is
written out below with the long form.

**Read what curl prints when it fails, and time how long it took.** A failure that
comes back in milliseconds and one that hangs for seconds are different failures.
Note that curl words the fast one differently depending on the platform,
`Connection refused` on Linux and `Couldn't connect to server` on macOS, so if
your table disagrees about the wording, run `nc -vz` instead. It names the
refusal outright on both.

**Mind the `nc` timeout flag.** macOS uses `-G` for the connect timeout and
treats `-w` as an idle timeout, so `nc -vz -w 5` against a port that is being
dropped sits there for about 75 seconds printing nothing. Linux uses `-w` for
both. Get this wrong and station 2 looks like a frozen terminal.

**Keep `-p 5353` on every `dig`.** The lab DNS answers on port 53 and on port
5353, and you are told to use 5353 because many networks quietly intercept
outbound port 53 and answer in place of the server you asked for. If you have time
at the end, drop the flag and compare the two answers.

## Round 1 - The healthy signature

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

## Round 2 - Four ways to fail

Do these in order, because the order is the argument.

### Station 2 - ALPHA port 8081

Run `probe $ALPHA 8081`. Time how long it takes to give up, and compare that
number to the baseline `connect=` from Round 1. Then `ping -c 3 $ALPHA` again.

Before you write down a cause, answer this: **did anything come back at all?**

### Station 3 - ALPHA port 8082

Probe it. Time how long it takes to give up.

Same host as station 2. Same laptop. Same network. Completely different behavior.
Your worksheet needs the wording your tools used and the number of seconds,
because those two facts are the whole diagnosis.

::: tip The one distinction that matters

Stations 2 and 3 are the two failures you will hit for the rest of your life, and
they are opposites.

One of them means a machine received your packet and answered "no." The other
means nobody answered anything at all. Work out which is which, and work out
**what the host sent back** in the case that failed fast. It is one TCP flag.

:::

### Station 4 - the name `ghost.cs425.lab`

```bash
dig ghost.cs425.lab @$ALPHA -p 5353
```

Note there is no `+short` here, on purpose: with it, this command prints an empty
line and tells you nothing. The long form shows the `status:` field, which is the
entire point of this station.

Do not `curl` anything yet. Look at the `status:` field in the answer first, then
decide whether it is even possible for this to be a connectivity problem. Count
how many packets you sent to the target.

### Station 5 - the name `mirage.cs425.lab`

```bash
dig +short mirage.cs425.lab @$ALPHA -p 5353
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

## Round 3 - The probe that lies

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

## If you finish early

Drop the `-p 5353` from one of your `dig` commands and run it again. If the answer
changes, your network is intercepting DNS and answering in place of the server you
asked for. Write down both answers. That is a middlebox lying to you, and it is
the same class of bug as station 5.

Then hand the worksheet in. Names on it, all of them. You get it back at the
start of A3, which is built on your station table.

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

Columns: what dig returned | what ping did | what curl printed | seconds to fail
         | the cause in your own words | layer

The drop versus refusal box, the station 4 box and the station 5 box.
Round 3: the four ping questions.
```

Paste nothing, screenshot nothing. Write it by hand. If you run out of room, use
the back.

## Instructor Notes

Instructor note, not shown to students.

Everything this activity needs is one script, named after it:
`scripts/cs425/a2-connectivity-triage.sh`. A3 shares the same testbed.

**Print the worksheet, and print the key.**

```bash
./scripts/cs425/a2-connectivity-triage.sh handout   # student worksheet
./scripts/cs425/a2-connectivity-triage.sh key       # key and demo script
```

Both need no AWS and take a few seconds, and both find Chrome, Chromium or Edge on
macOS or Linux (set `CHROME` to override). Each prints its page count and
complains if the layout spilled, which is the failure mode when you add a question
and do not take one away. Re-rendering rewrites the timestamp inside the PDF even
when nothing else changed, so expect git to show the file as modified.

The worksheet renders to `docs/public/cs425/a2-worksheet.pdf` so students can
reach it from the site. **The key does not go there**, and neither does its
source: both stay in `scripts/cs425/` beside the script, because everything under
`docs/public` is copied verbatim onto the public website.

The key is worth having in front of you rather than filed away. Its demo pages
carry every command with its real captured output and a line under each saying
what to point at. It is built to be run at the podium.

The target card at the top of page 1 is deliberately blank, because the two
addresses change every time the testbed is launched. Put them on the board from
`card` below and the worksheet stays good for every term.

**Stand the testbed up before class.** About four minutes end to end.

```bash
./scripts/cs425/a2-connectivity-triage.sh create --region us-west-2 --cidr 132.178.0.0/16
./scripts/cs425/a2-connectivity-triage.sh verify   # asserts every signature
./scripts/cs425/a2-connectivity-triage.sh card     # the two IPs, for the board
```

`verify` is the one that matters. It probes every station from your machine and
prints PASS or FAIL per station, so you find out that the security group drifted
before thirty students do. Run it once the night before and once from the podium.
A clean run is **9 passed, 0 failed**; it checks the ICMP contrast between the two
hosts and the lab zone's control record on top of the seven stations.

**Check the paper too.** `verify` exercises the testbed, not the worksheets, and
those are separate artifacts with separate bugs: `dig +short ghost.cs425.lab`
once shipped on a worksheet even though it prints an empty line and teaches
nothing, because everything that ran was checking the server rather than the
handout.

```bash
./scripts/cs425/a2-connectivity-triage.sh verify --check-commands
```

That pulls every command out of all four documents, runs it against the live
testbed, and compares the result to a stated expectation in
`scripts/cs425/check-commands.py`. The useful part is the word *stated*: a
command with no expectation is a **failure**, not a skip, so editing a document
forces you to write down what a student should see. That sentence is the actual
check; the code just enforces that you wrote one.

`python3 scripts/cs425/check-commands.py --list` shows what it would run without
needing AWS, which is enough to catch an unstated command after an edit.

Narrow `--cidr` to campus if the whole section is on campus or on the VPN. Port
8080 on an open address gets scanned within the hour; the scans are harmless but
they clutter the logs. Note that a security group *drops* rather than rejects, so
a student who is off campus, tethered, or on a split tunnel VPN sees **every**
station time out, and all of them then look like station 2. That failure looks
exactly like the lesson, which is what makes it dangerous. Same applies to you:
running `verify` from home against a campus-only CIDR fails everything.

**Leave it up between A2 and A3, or relaunch.** A3 uses stations 1, 2, 3 and 7 on
the same two hosts. Two `t3.micro` is a few cents an hour and nothing expires on
its own.

```bash
./scripts/cs425/a2-connectivity-triage.sh destroy --purge-key
```

**How the stations are broken.** Measured against a live testbed from off campus,
so the numbers are the shape to expect rather than exact values:

| Station | Mechanism | Measured |
| ------- | --------- | -------- |
| 1 ALPHA 8080 | works, security group allows it | `code=200`, `connect=0.0225` against a 21 ms ping RTT |
| 2 ALPHA 8081 | server is listening, the security group does **not** allow the port, so the SYN is dropped with no reply | curl exit 28, `connect=0.000000`, full timeout |
| 3 ALPHA 8082 | security group allows the port, nothing is listening, kernel answers RST | curl exit 7 in **25 ms**, `nc` prints `Connection refused` |
| 4 ghost | dnsmasq is authoritative for `cs425.lab` and has no such record, so NXDOMAIN | `status: NXDOMAIN`, `ANSWER: 0` |
| 5 mirage | an A record pointing at `10.42.13.37`, which is RFC 1918 and goes nowhere from a laptop | resolves, then curl exit 28 |
| 6 BRAVO 8080 | second instance, second security group, TCP 8080 allowed and ICMP not allowed at all | ping 100% loss, `code=200` |
| 7 ALPHA 8084 | accepts the connection, never writes a byte, never closes | held back for A3 |

**Where it goes wrong.**

- **A resolver that intercepts port 53. This is not hypothetical; it happened on
  the machine this activity was built on.** A network that hijacks outbound DNS
  answers in place of the server you asked, and it answers `NXDOMAIN` for a zone
  it has never heard of. That is the same string station 4 is supposed to produce,
  so the interception makes **station 4 look correct while station 5 fails**,
  which is the most confusing possible way for this to break.

  The worksheet and the target card therefore tell students to use **`-p 5353`**
  for every `dig`, and the testbed answers on both ports. `verify` sends a control
  query for `alpha.cs425.lab` before it trusts anything, picks whichever port
  actually reaches the server, and warns you loudly if 53 did not. If you see that
  warning, say so at the board: the class is sitting on a live example of a
  middlebox lying to them.

- **Windows `nslookup` and nonstandard ports.** `nslookup -port=5353 NAME ALPHA`
  works, but pairing a Windows student with someone who has `dig` is faster than
  debugging it. `Resolve-DnsName -Server ALPHA -Name ghost.cs425.lab` is the
  PowerShell equivalent and cannot set a port, so it is only useful if port 53 is
  reaching the server.

- **`nc` is missing** on a stock Windows box and on some minimal Linux images.
  This is why every station is specified in terms of `curl`, which is everywhere.

- **Students conclude station 3 means "the server is down."** It is the opposite:
  a RST proves a live host with a live IP stack. Push on that one, it is the
  single most valuable correction in the period.

**What this sets up.** Station 3 and the RST is chapter 3. Station 5 and RFC 1918
is chapter 4 and the NAT discussion. Station 2 versus station 6, drop versus
reject, is the firewall material in chapter 8. And all of it is P1 support load
you do not have to answer over email.
