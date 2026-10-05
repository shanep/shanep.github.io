---
next: false
prev: false
---

# A8 - TCP on a Noisy Link

**Week 13 · 20 points · pass/fail · one paper worksheet per group, turned in before you leave**

## Why you are doing this

Section 7.6 makes a claim that is easy to nod along to: TCP treats every lost
segment as a sign of congestion, so on a wireless link, where most loss is just
noise, TCP slows down for the wrong reason. Today you measure how much it slows
down.

Onyx does not have a radio, so we build a bad link out of software. Linux can put
you in a private copy of the network stack where you are allowed to slow the
loopback interface down, add delay, and throw packets away at random. Nobody else
on Onyx sees any of it. Then you push data through one TCP connection and watch
TCP's own numbers: its throughput, its congestion window, and how many segments
it had to send twice.

This one is **instructor led**, like A4. I do each step on the projector, you run
the same command on Onyx, and we do not move on until the room has caught up. It
takes about 45 minutes.

::: warning

One paper worksheet per group, turned in before you leave. Graded pass/fail, and
every round attempted in good faith is a pass. A wrong prediction costs you
nothing, but write it down **before** we run the command.

:::

## Before you start

- **Groups of 3 or 4.** One scribe owns the worksheet and puts everyone's name on
  it.
- **Everyone logs into Onyx with `ssh onyx`**, the shortcut you set up in
  [A2](./a2-stop-typing-your-password.md).
- **Bring a calculator**, or use the one on your laptop. Rounds 1 to 4 each have
  some short arithmetic.

Download the meter, **[tcpmeter.py](./tcpmeter.py)**, straight onto Onyx. It
opens one TCP connection to itself, sends as fast as TCP allows for 10 seconds,
and prints what the kernel says TCP is doing once a second.

```bash
ssh onyx
wget -q https://shanepanter.com/cs425/activities/tcpmeter.py
```

## How every round works

Each round is the same three beats, and the worksheet has a box for each:

1. **Predict.** I ask the question. Your group writes an answer.
2. **Run.** We all run the command on Onyx.
3. **Check.** Was the prediction right? Which part of the book says why?

## Round 1 - Build a slow link

`unshare -rn` starts a shell in a new **network namespace**: a private network
stack with nothing in it but a loopback interface, which starts out down. The
`-r` makes you root inside it, and only inside it, which is what lets you change
the interface. Bring it up with the same MTU as a real Ethernet link and ping
yourself:

```bash
unshare -rn bash
ip link set lo up mtu 1500
ping -c 3 127.0.0.1
```

```text
64 bytes from 127.0.0.1: icmp_seq=1 ttl=64 time=0.050 ms
64 bytes from 127.0.0.1: icmp_seq=2 ttl=64 time=0.069 ms
64 bytes from 127.0.0.1: icmp_seq=3 ttl=64 time=0.050 ms
```

Now make it a bad link. `tc` attaches a queueing discipline to an interface, and
`netem` is the one that emulates a network: here it holds every packet for 25 ms
and sends no faster than 20 Mbit/s, about what a crowded Wi-Fi network gives you.

```bash
tc qdisc add dev lo root netem delay 25ms rate 20mbit
tc qdisc show dev lo
```

**Predict:** what round trip time will `ping` report now?

```bash
ping -c 3 127.0.0.1
```

```text
64 bytes from 127.0.0.1: icmp_seq=1 ttl=64 time=50.2 ms
64 bytes from 127.0.0.1: icmp_seq=2 ttl=64 time=50.2 ms
64 bytes from 127.0.0.1: icmp_seq=3 ttl=64 time=50.2 ms
```

**Check:** why 50 and not 25? Count how many times each ping crosses `lo`. Then
one more from chapter 1: how long does it take to push one 1,500 byte frame onto
a 20 Mbit/s link? (section 1.4, transmission delay)

::: tip Stay in the namespace

Every command from here on runs in the shell `unshare` started. If `tc` says
`Operation not permitted`, you have dropped back out to your normal Onyx shell.
Run `unshare -rn bash` again and repeat round 1.

:::

## Round 2 - A clean link

**Predict:** this link carries 20 Mbit/s and has a 50 ms round trip. How many
bytes does TCP need in flight to keep it full, and how many 1,448 byte segments
is that? That is the congestion window TCP needs. (the bandwidth-delay product,
section 3.4, pipelined protocols)

```bash
python3 tcpmeter.py
```

```text
 sec   Mbit/s   cwnd  ssthresh   rtt ms  retrans
   1    12.37    128        80     95.3        0
   2    16.02    191        80    127.5        0
   3    17.67    269        80    164.7        0
   4    19.24    344        80    209.4        0
   5    18.22    427        80    256.2        0
   6    19.15    505        80    304.4        0
   7    19.03    585        80    351.9        0
   8    18.62    674        80    401.1        0
   9    18.24    746        80    446.7        0
  10    19.85    823        80    493.8        0

average 17.72 Mbit/s over 10 s, MSS 1448 bytes, 0 segments retransmitted
```

`cwnd` and `ssthresh` are in segments, `rtt` is TCP's smoothed estimate, and
`retrans` is the running total of segments sent twice.

**Check:** TCP filled the link and lost nothing. But the window kept growing long
after it passed your answer. Where are the extra segments? Look at the `rtt`
column and work out how long it takes the link to drain the extra ones. (section
1.4, queuing delay)

## Round 3 - Add noise

Same link, but now `netem` throws away 2% of packets at random. Nothing is full,
nothing is congested. The link is just noisy.

```bash
tc qdisc change dev lo root netem delay 25ms rate 20mbit loss 2%
```

**Predict:** what average throughput will TCP get now? Then work it out with the
formula from section 3.7 for TCP's throughput when it loses a fraction *L* of its
segments:

```text
throughput = 1.22 × MSS / (RTT × √L)
```

Use bits for the MSS and seconds for the RTT, and the answer is in bits per
second.

```bash
python3 tcpmeter.py
```

```text
 sec   Mbit/s   cwnd  ssthresh   rtt ms  retrans
   1     7.46     21        19     51.5       13
   2     3.39     10         9     54.2       21
   3     1.71     11         5     53.3       25
   4     1.92      7         7     54.6       30
   5     2.07     10         8     53.3       32
   6     2.18     14         7     56.8       34
   7     2.99     10        10     52.0       37
   8     2.15      9         7     52.2       41
   9     1.73     10         7     54.6       45
  10     1.59      4         3     62.3       53

average 2.70 Mbit/s over 10 s, MSS 1448 bytes, 53 segments retransmitted
```

**Check:** the link still carries 20 Mbit/s. How much of it did TCP use, and how
close was the formula? Compare the `cwnd` column to round 2 and to your answer
from round 2. TCP lost 2% of its segments and gave up most of the link. Why?
(section 3.7, and section 7.6)

## Round 4 - What 802.11 does about it

Real Wi-Fi is a lot noisier than 2%. Say 20% of frames are lost on the first try.
802.11 does not hand that loss to TCP: the receiver ACKs every frame, and the
sender retransmits a frame that is not ACKed. Suppose the access point gives each
frame up to 7 tries before it gives up. (section 7.3)

**Predict, on paper first:**

1. With 7 tries, what fraction of frames are still lost after the last try? That
   is the loss TCP sees.
2. On average, how many tries does a frame take? Every try after the first is
   airtime spent on a retry, so how many of the 20 Mbit/s are left for new data?
3. What throughput do you expect from TCP if the link does **not** retry, and TCP
   sees all 20%? And if it does?

Now run both. First the link with no retries:

```bash
tc qdisc change dev lo root netem delay 25ms rate 20mbit loss 20%
python3 tcpmeter.py
```

```text
average 0.36 Mbit/s over 10 s, MSS 1448 bytes, 62 segments retransmitted
```

Then the same radio with 802.11's retries done for TCP: the leftover loss from
question 1, on the bandwidth left over from question 2.

```bash
tc qdisc change dev lo root netem delay 25ms rate 16mbit loss 0.0013%
python3 tcpmeter.py
```

```text
average 14.31 Mbit/s over 10 s, MSS 1448 bytes, 0 segments retransmitted
```

**Check:** same radio, same 20% of frames lost, and one is about 40 times faster
than the other. Which layer recovered the loss in each run? The book lists local
recovery as one fix for TCP on wireless links (section 7.6). Which one of those
two runs was it?

When you are done, `exit` leaves the namespace, and the slow link disappears with
it.

## Exit question

Your laptop and a friend's are on opposite sides of the room, both talking to the
same access point, and they cannot hear each other. Why can 802.11 not detect a
collision while sending, the way Ethernet does, and what does it do instead?
(sections 7.1 and 7.3)

## Worksheet

**Download: [a8-worksheet.pdf](./a8-worksheet.pdf)**

The printed worksheet is two pages: a box per round for the prediction, the
result, and the check questions, plus the exit question.

## Instructor Notes

Instructor note, not shown to students.

**Print the worksheet, and the key for yourself.**

```bash
./scripts/cs425/a8-noisy-link.sh handout
./scripts/cs425/a8-noisy-link.sh key
```

The key stays in `scripts/cs425/` and never goes in `docs/public/`.

**Rehearsed on Onyx on October 4, 2026.** Every transcript on this page is real
output from that run, on RHEL 9.8 with kernel 5.14 and CUBIC. No testbed and no
root are needed: unprivileged user namespaces are on (`user.max_user_namespaces`
is 254157) and `netem` loads inside one. Rerun the whole thing the week before,
since an Onyx update could turn either off.

**Budget.** About 10 minutes for round 1 (most of it explaining `unshare`), 10 each
for rounds 2 and 3, 11 for round 4, and 4 for the exit question.

**The numbers move.** The loss is random, so every run is different. Over a few
rehearsal runs the 2% case averaged 2.7 to 3.1 Mbit/s and the 20% case 0.17 to 0.36.
The shape never changed.

**Things to watch for.**

- `lo` is one interface, so delay, rate and loss all apply in both directions: the
  data and the ACKs share the one 20 Mbit/s queue, and ACKs get dropped too. That
  is why the RTT is 50 ms. Cumulative ACKs make the lost ACKs mostly harmless.
- `ssthresh` reads 80 in round 2 with no loss at all. That is HyStart, CUBIC's slow
  start exit, which sets `ssthresh` when it sees the RTT start to climb. Save it
  for a fast group.
- Round 2's queue is bufferbloat. `netem` holds up to 1,000 packets, and
  (823 - 86) segments at 20 Mbit/s is about 0.43 s, which plus the 50 ms base is
  about 480 ms, close to the 494 ms TCP measured. A longer run eventually fills it
  and drops, which is congestion loss and the contrast to round 3.
- The formula models Reno with no timeouts. CUBIC and SACK beat it at 2% (2.7
  measured against 2.0 predicted), and at 20% timeouts dominate, so TCP does
  worse than its 0.63 prediction.
- Round 4's emulation ignores the time the retries take, beyond the lost
  bandwidth. Real link-layer retries also add delay and jitter, which is the
  other cost section 7.6 mentions.
- Everything a student does is gone when they `exit` or their ssh drops. Nothing
  needs cleaning up on Onyx.
