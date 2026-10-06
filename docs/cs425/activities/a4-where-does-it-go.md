---
next: false
prev: false
---

# A4 - Where Does This Datagram Go?

**Week 7 · 20 points · pass/fail · one page of handwritten notes each, turned in at the end of class Thursday**

## Why you are doing this

Chapter 4 boils down to one question a router answers for every packet it sees:
which way does this one go? Today you ask Onyx that question directly. Onyx is a
host, not a router, but it has a forwarding table and it does the same longest
prefix match a router does, so you can watch the data plane work from a prompt.

Along the way you find Onyx's subnet in binary, see why one datagram fits on the
wire and a datagram one byte bigger does not, and count the routers between Boise
and Salt Lake City using nothing but the TTL field.

This one is **instructor led**, like A2. I do each step on the projector, you run
the same command on Onyx, and we do not move on until the room has caught up. It
takes about 40 minutes.

You work on your own today, not in a group. The worksheet is a single page for
your own handwritten notes: what you expected, what you saw, and why. The point
is to leave with notes on chapter 4 written in your own hand, not to finish a set
of questions.

::: warning

Everyone turns in their own page of notes at the end of class on Thursday.
Graded pass/fail: notes in good faith for every round is a pass. A wrong
prediction costs you nothing, but write it down **before** we run the command.

:::

## Before you start

- **Grab a notes sheet** and put your name on it.
- **Everyone logs into Onyx with `ssh onyx`**, the shortcut you set up in
  [A2](./a2-stop-typing-your-password.md). If yours still asks for a password,
  follow along on a neighbor's screen, and finish A2 steps 1 to 3 after class.
- **Everything today runs on Onyx**, so it is the same for every laptop in the
  room.

## How every round works

Each round is the same three beats, and your notes for each round should cover
all three:

1. **Predict.** I ask the question. You write down your guess.
2. **Run.** We all run the command on Onyx.
3. **Check.** Was the prediction right? Which part of chapter 4 says why?

## Round 1 - Onyx's address

Log in and ask Onyx for its IPv4 addresses:

```bash
ssh onyx
ip -4 -br addr
```

You should see results similar to what is shown below.

```text
lo               UNKNOWN        127.0.0.1/8
eno12399np0      UP             132.178.227.11/25
```

**Predict:** how many addresses are in Onyx's subnet, and how many of them can be
given to hosts?

**Check:** work it out in binary in your notes. A `/25` means the first 25 bits
are the network and the last 7 identify the interface. Write the last octet of
`132.178.227.11` in binary, draw the line after the first bit, and find the
network address, the broadcast address, the usable range, and the host count.
Then answer two more: is `132.178.227.200` on Onyx's subnet, and is Onyx's
address a private (RFC 1918) address? (section 4.3)

## Round 2 - Longest prefix match

Now look at the forwarding table:

```bash
ip route
```

```text
default via 132.178.227.1 dev eno12399np0 proto static metric 100
132.178.227.0/25 dev eno12399np0 proto kernel scope link src 132.178.227.11 metric 100
```

Two lines. `default` is `0.0.0.0/0`, the prefix that matches everything, and it
sends packets to the gateway `132.178.227.1`. The second line is Onyx's own
subnet, delivered directly on the link with no gateway.

**Predict:** for each of these four destinations, which line matches, and does
the packet go straight to the destination or through the gateway?

| Destination | Matching line | Direct or gateway |
| ----------- | ------------- | ----------------- |
| `132.178.227.50` | | |
| `132.178.227.200` | | |
| `8.8.8.8` | | |
| `127.0.0.1` | | |

Then ask the kernel to do the lookup for each one:

```bash
ip route get 132.178.227.50
ip route get 132.178.227.200
ip route get 8.8.8.8
ip route get 127.0.0.1
```

```text
132.178.227.50 dev eno12399np0 src 132.178.227.11 uid 26544
132.178.227.200 via 132.178.227.1 dev eno12399np0 src 132.178.227.11 uid 26544
8.8.8.8 via 132.178.227.1 dev eno12399np0 src 132.178.227.11 uid 26544
local 127.0.0.1 dev lo src 127.0.0.1 uid 26544
```

`via` means the next hop is the gateway. No `via` means the destination is on the
link and gets the packet directly.

**Check:** `132.178.227.50` matches **both** lines, since everything matches the
default route. Why does it not go to the gateway? And `127.0.0.1` is not in the
table at all, so where did that answer come from? Try `ip route show table local`
to find out. This is exactly the lookup you will write in
[P3](../assignments/p3.md).

## Round 3 - How big can a datagram be?

Every link has a largest datagram it will carry, its MTU:

```bash
ip link show eno12399np0
```

Look for `mtu 1500` in the first line of the output.

**Predict:** `ping -s` sets the size of the ping's payload. What is the biggest
payload that still fits in one 1,500 byte IPv4 datagram?

Then try one size on each side of your guess. `-M do` sets the don't fragment
flag, so nothing gets quietly split into pieces:

```bash
ping -c 1 -M do -s 1472 132.178.227.1
ping -c 1 -M do -s 1473 132.178.227.1
```

```text
PING 132.178.227.1 (132.178.227.1) 1472(1500) bytes of data.
1480 bytes from 132.178.227.1: icmp_seq=1 ttl=254 time=0.654 ms

PING 132.178.227.1 (132.178.227.1) 1473(1501) bytes of data.
ping: local error: message too long, mtu=1500
```

**Check:** where do the other 28 bytes go? (Two headers, one from each of two
layers.) Did the `message too long` error come from the network or from Onyx
itself? Without `-M do`, who would split the datagram, and who would put it back
together? (section 4.3, fragmentation)

## Round 4 - Counting routers with TTL

Every IPv4 datagram carries a TTL that each router decrements by one, and a
router that decrements it to zero drops the datagram and sends back an ICMP
message saying so. `tracepath` uses that to find the routers on the path.

**Predict:** how many routers are between Onyx and a server in Salt Lake City,
about 475 km away?

```bash
tracepath -n mirrors.xmission.com
```

```text
 1?: [LOCALHOST]                      pmtu 1500
 1:  132.178.227.1                                         0.651ms asymm  2
 1:  132.178.227.1                                         0.357ms asymm  2
 2:  no reply
 3:  132.178.1.147                                         1.238ms
 4:  132.178.1.98                                          1.301ms
 5:  209.249.232.13                                        1.911ms
 6:  no reply
 7:  no reply
 8:  no reply
 9:  no reply
10:  4.69.220.109                                         28.173ms asymm  9
11:  4.35.168.186                                         50.639ms asymm 16
12:  166.70.1.2                                           50.208ms asymm 18
13:  198.60.22.13                                         50.360ms reached
     Resume: pmtu 1500 hops 13 back 19
```

**Check:** explain in two sentences how `tracepath` learned the address of hop 3.
Several hops say `no reply`, and yet the trace still reached the end. What does
that tell you about those routers? And where have you seen `pmtu 1500` before?

## Exit question

A traditional router forwards on the destination address and nothing else. Name
one other header field that a middlebox somewhere on that path to Salt Lake City
could match on, and what it might do with a match. (sections 4.4 and 4.5)

## Worksheet

**Download: [a4-worksheet.pdf](./a4-worksheet.pdf)**

The printed worksheet is one page of ruled boxes, one per round plus the exit
question. Each box names the command and gives a one line cue for what is worth
writing down. There are no questions to answer on it; the questions on this page
are what we talk through as a room.

## Instructor Notes

Instructor note, not shown to students.

**Print the worksheet, and the key for yourself.** The worksheet is a one page
notes sheet, one per student. The key still answers every check question on this
page, so it is the reference for the discussion, not for grading.

```bash
./scripts/cs425/a4-where-does-it-go.sh handout
./scripts/cs425/a4-where-does-it-go.sh key
```

The key stays in `scripts/cs425/` and never goes in `docs/public/`.

**Rehearsed on Onyx on October 4, 2026.** Every transcript on this page is real
output from that run. No testbed is needed, only Onyx and `ssh onyx`.

**Budget.** About 10 minutes each for rounds 1 and 2, 8 each for rounds 3 and 4,
and 4 for the exit question. Round 1 is the one to slow down on: half the room
will try to recall the subnet answer instead of deriving it.

**Things to watch for.**

- The gateway answers ICMP from Onyx. If it ever stops, the 1,473 byte ping
  still fails with the local error, which is the point of round 3 anyway.
- `ttl=254` in the gateway's reply is a good question for a fast group: the
  gateway is on Onyx's own link, so why not 255? I have not confirmed the answer
  (a virtual gateway address answered by a router behind it is my guess), so it
  stays off the worksheet.
- Onyx has no global IPv6 address (only `::1`), so IPv6 stays a lecture topic.
- `traceroute` is not installed on Onyx. `tracepath` is, and it needs no root.
