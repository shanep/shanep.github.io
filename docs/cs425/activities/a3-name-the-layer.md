---
next: false
prev: false
draft: true
---

# A3 - Name the Layer

**Week 5 · 20 points · pass/fail · one paper worksheet per group, turned in before you leave**

## Overview

In [A2](./a2-connectivity-triage.md) you collected fingerprints. Six stations, six
different failures, and a table full of what each one actually printed. That table
is raw data. Today you turn it into something you can use at three in the morning
when something is broken and you are the one holding the pager.

By the end you will have a **decision procedure**: a short sequence of questions
that takes any "it doesn't work" and lands on a layer, a cause, and a name of who
can fix it. You will also meet the one failure A2 deliberately held back, because
it breaks the procedure that most people carry around in their head.

::: warning

**Your A2 worksheet comes back to you at the start of this period.** Round 1 is
built directly on the station table in it. If your group is missing one, say so at
the start and the instructor will get you a filled in copy; do not spend the
period re-probing stations 1 through 6.

One paper worksheet per group, turned in before you leave, graded pass/fail.
Copies are handed out in class, and the same worksheet is at
[a3-worksheet.pdf](/cs425/a3-worksheet.pdf).

:::

## Before you start

- **Same groups as A2** if you can manage it, since the data came from those
  laptops.
- **One scribe** owns the worksheet and writes everyone's name at the top.
- The two addresses go on the board again. They will be **different** from the
  ones you used in A2, because the machines get rebuilt. Copy the new ones into
  the target card before you probe anything.

The glossary on the back of your worksheet has every term used here. If somebody
at your table is nodding along without knowing what a RST is, that is the moment
to use it.

## Round 1 - Build the decision tree

This is the part you keep. Fill in the flowchart on the worksheet so that it takes
any symptom to a cause.

The tree starts with the question that has to come first, because if the answer is
bad you never sent a single packet to the target at all. Work out which question
that is. Then work out what the next question has to be, and the one after that.

Two rules for the leaves:

- Every leaf names **which layer** the fault is at.
- Every leaf names **who can fix it**: you, the person running the server, or the
  network in between. This is the part people skip, and it is the part that
  decides who you wake up.

Then fill in the summary table, one row per station from A2, so the tree and your
observations agree with each other. If a row does not fit any leaf of your tree,
your tree is missing a branch. That is a finding, not a mistake.

::: tip Checkpoint

Every leaf of your tree has a layer and an owner written in it, and all six A2
stations land somewhere.

:::

## Round 2 - The failure your tree probably misses

**Station 7 is ALPHA port 8084.**

Probe it the way you probed everything in A2:

```bash
ALPHA=203.0.113.10     # replace with YOUR alpha address from the board

nc -vz -w 5 $ALPHA 8084     # macOS: -G 5 instead of -w 5
curl -sS -o /dev/null -m 8 -w 'connect=%{time_connect} total=%{time_total}\n' http://$ALPHA:8084/
```

`nc` is delighted. `curl` sits there and then gives up.

Now compare the exact curl message to the one station 2 gave you in A2, and
compare the two `connect=` values. They are not the same, and the difference is
the whole answer.

On the worksheet:

1. Which layer completed successfully, and which one never did?
2. What is `connect=` here, and what was it for station 2? What does that
   difference tell you?
3. A load balancer decides whether a server is healthy by opening a TCP connection
   to its port. What does that health check say about this server? Why is that
   **worse** than having no health check at all?
4. Where does this land on the tree you built in Round 1? If it does not land
   anywhere, add the branch.

::: tip Checkpoint

Your tree has a branch for "the connection opened and nothing ever came back," and
your group can say why a port check is not a health check.

:::

## Round 3 - Predict, then watch

For station 2 in A2, your packets vanished. Here is the question you could not
answer from your laptop: **did they vanish before they reached the host, or
after?**

Think about it as a group and commit to an answer in writing **before** the
instructor runs anything. A prediction you got wrong is worth full credit; a blank
box is not.

1. Write down whether you expect the packets to have reached ALPHA or not, and
   why.
2. Write down the command you would run **on the server** to find out. You are
   looking for a tool that shows you packets arriving on an interface.

Your instructor will then run that capture on ALPHA and put it on the projector
while a volunteer probes station 2 and then station 3.

3. Record what actually appeared for **port 8081**, and what appeared for **port
   8082**.
4. Explain the difference. One of these ports shows you a conversation. The other
   shows you nothing at all, and "nothing at all" is the evidence.

## Round 4 - Say it out loud

Two questions. The second one is the one that matters.

1. Give the two symptom words that a hang and a refusal produce, and say what a
   server sends in each case. One of them sends nothing.
2. You are on call. Somebody reports "our API is down." You get one command before
   you have to say something useful. **Which single command do you run, and what
   are the three different things its output can tell you?** Defend the choice.

Then hand the worksheet in. Names on it, all of them.

## If you finish early

Take the tree you built and write the version you would actually put in a team
runbook: five lines, no diagram, each line a symptom and the first thing to check.
Being able to compress it is the test of whether you understand it.

## Worksheet

The printed worksheet handed out in class is what you fill in and turn in. It has,
in this order:

```
Target card:  ALPHA = ______________   BRAVO = ______________

Round 1: the decision tree, filled in, plus the summary table
         (one row per A2 station: what you saw, what it means,
          layer, who fixes it)
Round 2: station 7 row plus the four questions
Round 3: your prediction and command, then what the capture showed
         for port 8081 and for port 8082
Round 4: the two synthesis questions
Back page: glossary
```

## Instructor Notes

Instructor note, not shown to students.

**A3 shares A2's testbed.** There is one script and it is named after A2, because
that is where the testbed is introduced:

```bash
./scripts/cs425/a2-connectivity-triage.sh create --region us-west-2 --cidr 132.178.0.0/16
./scripts/cs425/a2-connectivity-triage.sh verify
./scripts/cs425/a2-connectivity-triage.sh card
```

A3's own script renders A3's documents and forwards everything else to A2's, so
either of these works and there is only one implementation of the testbed:

```bash
./scripts/cs425/a3-name-the-layer.sh handout   # student worksheet
./scripts/cs425/a3-name-the-layer.sh key       # key and demo script
./scripts/cs425/a3-name-the-layer.sh verify    # forwarded to the A2 script
```

A3 needs stations 1, 2, 3 and 7 live, so if you tore the testbed down after A2,
relaunch it and **put the new addresses on the board**. They will not match the
ones from A2, which is worth one sentence out loud: the names are stable and the
addresses are not, and that is the entire reason the worksheet is written in terms
of ALPHA and BRAVO.

**Round 3 is the round that needs you.** Students have no shell on the testbed, by
design, so the capture is a demo. Have this ready before class and do not run it
until every group has written a prediction:

```bash
./scripts/cs425/a2-connectivity-triage.sh ssh -- \
    sudo tcpdump -nni any 'tcp port 8081 or tcp port 8082'
```

Port 8081 produces **no packets at all**, because an AWS security group is
enforced at the virtual network interface before delivery, so the host genuinely
never sees the SYN. Port 8082 shows the SYN arriving and the RST leaving 26
microseconds later. Use `-nn`, not `-n`, or tcpdump renames 8082 to a service name
and the output stops being readable. The captured transcript is in the key.

Most groups predict the packets arrived and were then rejected by something on the
host. That is the useful wrong answer: it is what you would expect from a host
firewall like `iptables`, and the point is that the client cannot tell the two
apart, which is exactly why you go look at the server.

**If a group lost their A2 worksheet**, hand them a completed station table rather
than letting them burn the period re-probing. The key's mechanism table is the
fastest thing to photocopy for that.

**Timing note without times on it:** Round 1 is the deliverable and Round 3 needs
you at the projector, so if the period is running short, compress Round 2 to
questions 1 and 3 and keep the rest.

**What this sets up.** Round 2 is the difference between transport and application
liveness, which is chapter 3 and again in chapter 8 when we talk about what a
health check actually proves. Round 3 is the first time the class sees that the
client's view is partial, which is the whole motivation for looking at both ends
of a connection in P2 and P4.
