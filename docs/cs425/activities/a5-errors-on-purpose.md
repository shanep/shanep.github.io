---
next: false
prev: false
---

# A5 - Errors on Purpose

**Week 9 · 20 points · pass/fail · one paper worksheet per group, turned in before you leave**

## Why you are doing this

In A4 you counted the routers between Onyx and Salt Lake City with `tracepath`, and
it worked by making routers throw your packets away on purpose. Every one of those
routers sent back a short note saying so, and that note is **ICMP**, the network
layer's error and diagnostic protocol (section 5.6).

Today you send ICMP's most famous message, find out that it does not get very far,
and then use ICMP's error messages to see what is really out there. Along the way
you see why "I can't ping it" and "it is down" are two very different statements,
and why a router can be slow to answer you but fast at forwarding your packets.

This one is **instructor led**, like A4. I do each step on the projector, you run
the same command on Onyx, and we do not move on until the room has caught up. It
takes about 40 minutes.

::: warning

One paper worksheet per group, turned in before you leave. Graded pass/fail, and
every round attempted in good faith is a pass. A wrong prediction costs you
nothing, but write it down **before** we run the command.

:::

## Before you start

- **Groups of 3 or 4.** One scribe owns the worksheet and puts everyone's name on
  it.
- **Everyone logs into Onyx with `ssh onyx`**, the shortcut you setup in
  [A2](./a2-stop-typing-your-password.md).
- **Everything today runs on Onyx**, so it is the same for every laptop in the
  room. Your home network will block different things than campus does, which is
  sort of the point of round 1.

## How every round works

Each round is the same three beats, and the worksheet has a box for each:

1. **Predict.** I ask the question. Your group writes an answer.
2. **Run.** We all run the command on Onyx.
3. **Check.** Was the prediction right? Which part of chapter 5 says why?

## Round 1 - Is anybody out there?

`ping` sends an ICMP **echo request** (type 8) and waits for an **echo reply**
(type 0). It is the first thing everyone reaches for when "the network is down".

**Predict:** will Onyx get replies from Google's DNS server at `8.8.8.8`?

```bash
ping -c 3 8.8.8.8
```

```text
PING 8.8.8.8 (8.8.8.8) 56(84) bytes of data.

--- 8.8.8.8 ping statistics ---
3 packets transmitted, 0 received, 100% packet loss, time 2053ms
```

Well that is not good! Is Google down? Is Onyx off the Internet? Ask two more
questions before you decide:

```bash
ping -c 3 132.178.227.1
curl -s -o /dev/null -w '%{http_code}\n' https://www.google.com
```

```text
PING 132.178.227.1 (132.178.227.1) 56(84) bytes of data.
64 bytes from 132.178.227.1: icmp_seq=1 ttl=254 time=0.603 ms
64 bytes from 132.178.227.1: icmp_seq=2 ttl=254 time=0.674 ms
64 bytes from 132.178.227.1: icmp_seq=3 ttl=254 time=0.544 ms

--- 132.178.227.1 ping statistics ---
3 packets transmitted, 3 received, 0% packet loss, time 2028ms
rtt min/avg/max/mdev = 0.544/0.607/0.674/0.053 ms
200
```

**Check:** the gateway answers pings and Google answers a web request with `200`.
So what is actually broken? What do you now know about how campus treats ICMP
echo, as opposed to TCP on port 443? (section 5.6, and the middleboxes in 4.5)

## Round 2 - Traceroute by hand

`ping -t` sets the TTL of the echo request. Every router decrements the TTL, and a
router that takes it to zero drops the datagram and sends an ICMP **time
exceeded** message (type 11) back to the sender.

**Predict:** what comes back from each of these three commands, and from whom?

```bash
ping -c 1 -t 1 8.8.8.8
ping -c 1 -t 2 8.8.8.8
ping -c 1 -t 3 8.8.8.8
```

```text
PING 8.8.8.8 (8.8.8.8) 56(84) bytes of data.
From 132.178.227.1 icmp_seq=1 Time to live exceeded

--- 8.8.8.8 ping statistics ---
1 packets transmitted, 0 received, +1 errors, 100% packet loss, time 0ms

PING 8.8.8.8 (8.8.8.8) 56(84) bytes of data.

--- 8.8.8.8 ping statistics ---
1 packets transmitted, 0 received, 100% packet loss, time 0ms

PING 8.8.8.8 (8.8.8.8) 56(84) bytes of data.

--- 8.8.8.8 ping statistics ---
1 packets transmitted, 0 received, 100% packet loss, time 0ms
```

With `-t 1` you just did by hand what `tracepath` did in A4, one hop at a time.
Keep going and you have built traceroute.

**Check:** who sent the `Time to live exceeded`, and how do you know from the
output alone? At `-t 2` and `-t 3` nothing came back at all. Does that mean there
is no router at hop 2 or hop 3? Hold that thought until round 4.

## Round 3 - How do you know you arrived?

A TTL that runs out tells you about a router in the middle. To know you reached
the **end**, `tracepath` sends UDP to a port nobody is listening on, and waits for
the destination to complain with ICMP **port unreachable** (type 3, code 3).

Let's send one UDP datagram to the XMission server from A4, on port 33434, where
classic `traceroute` starts its probes, and wait for an answer. Paste this whole
block into Onyx:

```bash
python3 - <<EOF
import socket
s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
s.connect(("198.60.22.13", 33434))
s.send(b"hello")
s.settimeout(3)
print(s.recv(100))
EOF
```

**Predict:** UDP is connectionless, there is no handshake and no reply is
promised. So what does Python print: a reply, a timeout after 3 seconds, or
something else?

```text
Traceback (most recent call last):
  File "<stdin>", line 6, in <module>
ConnectionRefusedError: [Errno 111] Connection refused
```

**Check:** UDP has no connection, so what exactly was refused, and who said so?
Which layer received the ICMP message, and how did it end up as an error in a
Python program? Change the address to `127.0.0.1` and run it again. Same answer?

## Round 4 - Same path, three ways

`mtr` is `tracepath` that keeps going: it sends round after round of probes with
increasing TTLs and keeps statistics for each hop. You can pick what the probes
are, so let's trace the same path to Salt Lake City three ways: ICMP echo (the
default), UDP (`-u`) like `tracepath`, and TCP to port 443 (`-T -P 443`) like a
web browser.

**Predict:** will all three traces see the same routers?

```bash
mtr -n -r -c 5 mirrors.xmission.com
mtr -n -u -r -c 5 mirrors.xmission.com
mtr -n -T -P 443 -r -c 5 mirrors.xmission.com
```

```text
HOST: onyx.boisestate.edu         Loss%   Snt   Last   Avg  Best  Wrst StDev
  1.|-- 132.178.227.1              0.0%     5    0.6   0.6   0.6   0.7   0.1
  2.|-- 10.1.2.53                 60.0%     5    0.5   0.5   0.5   0.5   0.0
  3.|-- ???                       100.0     5    0.0   0.0   0.0   0.0   0.0

HOST: onyx.boisestate.edu         Loss%   Snt   Last   Avg  Best  Wrst StDev
  1.|-- 132.178.227.1              0.0%     5    0.7   0.6   0.5   0.7   0.1
  2.|-- ???                       100.0     5    0.0   0.0   0.0   0.0   0.0
  3.|-- 132.178.1.147              0.0%     5    0.8   0.8   0.8   0.9   0.1
  4.|-- 132.178.1.98               0.0%     5    1.6   1.6   1.4   1.7   0.1
  5.|-- 209.249.232.13             0.0%     5    1.6   1.5   1.2   1.7   0.2
  6.|-- ???                       100.0     5    0.0   0.0   0.0   0.0   0.0
  7.|-- ???                       100.0     5    0.0   0.0   0.0   0.0   0.0
  8.|-- ???                       100.0     5    0.0   0.0   0.0   0.0   0.0
  9.|-- ???                       100.0     5    0.0   0.0   0.0   0.0   0.0
 10.|-- 4.69.220.109               0.0%     5   27.9  27.8  27.3  28.1   0.3
 11.|-- 4.35.168.186               0.0%     5   52.2  52.2  52.1  52.3   0.1
 12.|-- 166.70.1.2                 0.0%     5   52.3  52.2  52.1  52.4   0.1
 13.|-- 198.60.22.13               0.0%     5   52.2  52.1  52.1  52.2   0.0

HOST: onyx.boisestate.edu         Loss%   Snt   Last   Avg  Best  Wrst StDev
  1.|-- 132.178.227.1              0.0%     5    0.6   0.7   0.6   0.8   0.1
  2.|-- ???                       100.0     5    0.0   0.0   0.0   0.0   0.0
  3.|-- 132.178.1.147              0.0%     5    0.7   0.7   0.6   0.7   0.1
  4.|-- 132.178.1.98               0.0%     5    1.3   1.4   1.3   1.6   0.1
  5.|-- 209.249.232.13             0.0%     5    4.4   2.0   1.0   4.4   1.4
  6.|-- ???                       100.0     5    0.0   0.0   0.0   0.0   0.0
  7.|-- ???                       100.0     5    0.0   0.0   0.0   0.0   0.0
  8.|-- ???                       100.0     5    0.0   0.0   0.0   0.0   0.0
  9.|-- ???                       100.0     5    0.0   0.0   0.0   0.0   0.0
 10.|-- 4.69.220.109               0.0%     5   28.3  27.6  27.2  28.3   0.4
 11.|-- 4.35.168.186               0.0%     5   52.5  52.2  52.0  52.5   0.2
 12.|-- 166.70.1.2                 0.0%     5   52.2  52.2  51.7  52.5   0.3
 13.|-- 198.60.22.13               0.0%     5   51.9  51.9  51.8  52.0   0.1
```

**Check:** the ICMP trace stops at hop 3, but the UDP and TCP traces sail right
through hop 3 to Salt Lake City. So which hop do you think is throwing away your
pings, and what is your evidence? Look at the address of hop 2 in the first trace.
What kind of address is it? (A4, round 1)

Then look at the `Loss%` column. Hops 6 through 9 lose 100% of the probes and yet
hop 13 loses none. How can a router drop every probe and still forward all of
your traffic? (section 4.1, forwarding versus the control plane)

## Exit question

A friend runs `ping 8.8.8.8` on Onyx, sees 100% packet loss, and announces that
Onyx is off the Internet. Give them two pieces of evidence from today that say
otherwise.

## Worksheet

**Download: [a5-worksheet.pdf](./a5-worksheet.pdf)**

The printed worksheet is two pages: a box per round for the prediction, the
result, and the check questions, plus the exit question.

## Instructor Notes

Instructor note, not shown to students.

**Print the worksheet, and the key for yourself.**

```bash
./scripts/cs425/a5-errors-on-purpose.sh handout
./scripts/cs425/a5-errors-on-purpose.sh key
```

The key stays in `scripts/cs425/` and never goes in `docs/public/`.

**Rehearsed on Onyx on October 4, 2026.** Every transcript on this page is real
output from that run. No testbed is needed, only Onyx and `ssh onyx`. `mtr` works
without root because `mtr-packet` has `cap_net_raw`.

**Budget.** About 8 minutes for round 1, 8 for round 2, 8 for round 3, 12 for
round 4, and 4 for the exit question. Round 4 is the one to slow down on.

**Things to watch for.**

- Hop 2 is not consistent. In some runs it answers ICMP probes as `10.1.2.53`
  (2 of 5 in the transcript above) and in others it shows `???`. It also answered
  a TCP probe once in rehearsal. Either way, the ICMP trace never gets past hop 3,
  while hop 3 answers UDP and TCP probes every time, which is the evidence that
  echo requests leaving campus are dropped at or right after hop 2. I have not
  confirmed with OIT what that box is, so say "probably the campus firewall"
  rather than "the firewall".
- Pings to the campus routers at hop 3 (`132.178.1.147`) get replies, so the
  filter is on ICMP echo leaving campus, not on ICMP in general.
- `ping -t 2` gets nothing back, even though hop 2 sometimes answers `mtr`. A box
  that rate limits its own ICMP messages explains both. Good question for a fast
  group.
- In one rehearsal the gateway took 1,032 ms to answer a single TCP probe, while
  hop 3 behind it answered in under 1 ms. If it happens live, point at it: making
  an ICMP message is slow path work for the router's CPU, forwarding is not.
- `curl https://dns.google` is reset by campus (DNS over HTTPS is blocked), so use
  `www.google.com` for round 1, not `dns.google`.
- `nc -u` will not show the port unreachable for a remote host (it exits quietly),
  which is why round 3 uses Python.
