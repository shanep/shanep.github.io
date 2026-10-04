---
next: false
prev: false
draft: true
---

# A5 - One Hop at a Time

**Week 11 · 20 points · pass/fail · one paper worksheet per group, turned in before you leave**

## Why you are doing this

In A4 you watched Onyx decide which way a datagram goes. That decision only picks
the next hop. Getting the datagram across that one link, from Onyx to the gateway
on its subnet, is the link layer's job, and that is chapter 6.

Today you find Onyx's other address, watch ARP connect the two, check a frame for
errors the way the network card does, and play the part of a switch. By the end
you should be able to say which addresses in a frame change at every hop and
which ones never do.

This one is **instructor led**, like A4. I do each step on the projector, you run
the same command on Onyx, and we do not move on until the room has caught up.
Rounds 3 and 4 are pencil and paper. It takes about 40 minutes.

::: warning

One paper worksheet per group, turned in before you leave. Graded pass/fail, and
every round attempted in good faith is a pass. A wrong prediction costs you
nothing, but write it down **before** we run the command.

:::

## Before you start

- **Groups of 3 or 4.** One scribe owns the worksheet and puts everyone's name on
  it.
- **Everyone logs into Onyx with `ssh onyx`**, the same as A4.
- **Bring a pencil.** Round 3 is long division, and you will make a mistake.

## How every round works

Each round is the same three beats, and the worksheet has a box for each:

1. **Predict.** I ask the question. Your group writes an answer.
2. **Run.** We all run the command on Onyx, or work it on paper.
3. **Check.** Was the prediction right? Which part of chapter 6 says why?

## Round 1 - Onyx's other address

In A4 you found Onyx's IP address. Its network card has a second address, burned
in at the factory:

```bash
ssh onyx
ip -br link
```

<!-- TODO: replace with real output from Onyx before this page loses draft: true -->

```text
lo               UNKNOWN        00:00:00:00:00:00 <LOOPBACK,UP,LOWER_UP>
eno12399np0      UP             xx:xx:xx:xx:xx:xx <BROADCAST,MULTICAST,UP,LOWER_UP>
```

**Predict:** if Onyx were unplugged and moved to a different building on campus,
on a different subnet, which of its two addresses would change?

**Check:** a MAC address is 48 bits, written as 6 bytes in hex. The first 3 bytes
are the **OUI**, the block of addresses a vendor bought from the IEEE. Write the
first byte of Onyx's MAC in binary. The lowest bit says unicast (0) or multicast
(1), and the bit next to it says globally unique (0) or **locally administered**
(1). Which is Onyx's?

Now look at your phone. Most phones show a "private" or "randomized" Wi-Fi
address in the Wi-Fi settings for each network. Write its first byte in binary
too. What does the second bit say, and why would a phone want an address that is
not the one burned into its hardware? (section 6.4.1)

## Round 2 - ARP

Onyx knows the gateway's IP address from its routing table. It cannot send a
frame to an IP address, though. It needs the gateway's MAC address, and ARP is
how it gets one. Look at Onyx's ARP cache:

```bash
ip neigh show dev eno12399np0
```

**Predict:** Onyx is about to ping `8.8.8.8`. Afterwards, will `8.8.8.8` be in
this table? If not, whose MAC address does Onyx put in the frame?

```bash
ping -c 1 8.8.8.8
ip neigh show 8.8.8.8
ip neigh show 132.178.227.1
```

<!-- TODO: replace with real output from Onyx before this page loses draft: true -->

```text
132.178.227.1 lladdr xx:xx:xx:xx:xx:xx REACHABLE
```

**Check:** the first command prints nothing at all. Why does Onyx never ARP for
`8.8.8.8`? Then fill in the four addresses on the frame that leaves Onyx carrying
that ping:

| Field | Address |
| ----- | ------- |
| Source MAC | |
| Destination MAC | |
| Source IP | |
| Destination IP | |

When the gateway forwards the datagram to the next router, which two of those
four change, and which two stay the same? (sections 6.4.1 and 6.7)

## Round 3 - CRC by hand

Every Ethernet frame ends with a 32 bit CRC. The sender's network card computes
it, the receiver's card checks it, and a frame that fails the check is dropped
without a word to anyone. Today you do the card's job with a smaller generator.

- Data `D = 11010011`
- Generator `G = 1011`, so `r = 3`

**Predict:** how many bits long is the CRC `R`?

**Run:** append `r` zeros to `D` and divide by `G` using modulo 2 arithmetic,
where subtraction is XOR and nothing ever borrows. The remainder is `R`. Then
check your work the way the receiver does: divide `D` followed by `R` by `G`. What
should the remainder be?

**Check:** flip the third bit of the 11 bits you sent and divide again. Did the
receiver catch the error? (section 6.2.3)

## Round 4 - Be the switch

A switch starts with an empty table and learns from every frame it sees. Hosts
A, B, C and D are plugged into ports 1, 2, 3 and 4. For each frame, in order,
write the ports it goes out and the switch table after the switch is done with
it.

| # | Frame | Out which ports? | Table after |
| - | ----- | ---------------- | ----------- |
| 1 | A to D | | |
| 2 | D to A | | |
| 3 | B to D | | |
| 4 | C to `ff:ff:ff:ff:ff:ff` | | |
| 5 | A to C | | |

**Predict:** before you start, how many of the five frames get flooded out every
other port?

**Check:** how many did? B is running Wireshark the whole time. Which frames does
B see? What would B have seen if a hub had been sitting there instead of a
switch? (section 6.4.3)

## Exit question

You open your laptop in this room and load `boisestate.edu`. DHCP, ARP, DNS, TCP
and HTTP all run, in that order. Which one of the five never crosses a router,
and why can it not? (section 6.7)

## Worksheet

**Download: [a5-worksheet.pdf](./a5-worksheet.pdf)**

The printed worksheet is two pages: a box per round for the prediction, the
result, and the check questions, plus the exit question.

## Instructor Notes

Instructor note, not shown to students.

**Print the worksheet, and the key for yourself.**

```bash
./scripts/cs425/a5-one-hop-at-a-time.sh handout
./scripts/cs425/a5-one-hop-at-a-time.sh key
```

The key stays in `scripts/cs425/` and never goes in `docs/public/`.

**Not yet rehearsed on Onyx.** The transcripts in rounds 1 and 2 are
placeholders. Run the commands on Onyx, paste the real output here and into the
key, then drop `draft: true` and add `activities/a5-worksheet.pdf` to `files` in
`canvas.toml`. Rounds 3 and 4 are paper only and need no rehearsal.

**Budget.** About 8 minutes for round 1, 10 each for rounds 2 to 4, and 2 for the
exit question. Round 2's address table is the one to slow down on: it is the
idea that ties chapters 4 and 6 together, and P4 has them pulling exactly those
four fields out of real frames.

**Things to watch for.**

- Some groups will not have a phone with a randomized address, or will not find
  the setting. Any phone in the group is fine, and one on the projector is fine
  too.
- Round 3: the usual mistake is subtracting with borrows instead of XOR. Walk
  the first two steps on the board before letting them go.
- Round 4: frame 4 is an ARP request, so it ties back to round 2. The switch
  floods a broadcast even when its table is full.
