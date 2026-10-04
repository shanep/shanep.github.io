---
next: false
prev: false
---

# A6 - Who Carries Your Packets?

**Week 10 · 20 points · pass/fail · one paper worksheet per group, turned in before you leave**

## Why you are doing this

The Internet is not one network. It is more than 70,000 **autonomous systems** (ASes),
each one a network run by a single organization, and BGP is the protocol they use
to tell each other which addresses they can reach (sections 5.3 and 5.4). Boise
State is one of them.

Today you find Boise State's AS, map the 13 routers from A4 onto the companies
that own them, and look at Boise State from the outside, through the eyes of
about 300 BGP routers around the world. Along the way you see why the path a
packet takes has more to do with business deals than with kilometers.

This one is **instructor led**, like A4 and A5. I do each step on the projector,
you run the same command on Onyx, and we do not move on until the room has caught
up. It takes about 40 minutes.

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
- **Everything today runs on Onyx.** Rounds 1 and 2 ask Team Cymru's DNS service
  which AS owns an address, and round 3 asks
  [RIPEstat](https://stat.ripe.net/), a public database of what BGP routers around
  the world are saying.

## How every round works

Each round is the same three beats, and the worksheet has a box for each:

1. **Predict.** I ask the question. Your group writes an answer.
2. **Run.** We all run the command on Onyx.
3. **Check.** Was the prediction right? Which part of chapter 5 says why?

## Round 1 - Who owns Onyx's address?

In A4 you found that Onyx lives in `132.178.227.0/25`. That is what Onyx's own
forwarding table says. The rest of the Internet sees something different.

**Predict:** what prefix length does Boise State announce to the rest of the
Internet for Onyx's address: `/25`, something longer, or something shorter?

Team Cymru answers "who owns this address" over DNS. Like a reverse lookup, the
address goes in backwards, so `132.178.227.11` becomes `11.227.178.132`:

```bash
dig +short TXT 11.227.178.132.origin.asn.cymru.com
dig +short TXT AS46662.asn.cymru.com
```

```text
"46662 | 132.178.0.0/16 | US | arin | 1988-12-05"
"46662 | US | arin | 2008-11-07 | BSU-AS - Boise State University, US"
```

The first line is the AS that **originates** the route, the prefix it announces,
and when the addresses were assigned. The second line puts a name on the AS.

**Check:** how many addresses are in that prefix? Why would Boise State announce
one big prefix instead of all of its little subnets? So who knows about the
`/25`, and which kind of routing protocol tells them? (sections 5.3 and 5.4)

## Round 2 - Map the trace onto the ASes

Now the trace from A4 again, this time with `-z`, which asks for the AS of every
hop:

**Predict:** there are 13 routers between Onyx and Salt Lake City. How many
different ASes do they belong to?

```bash
mtr -n -z -T -P 443 -r -c 3 mirrors.xmission.com
```

```text
HOST: onyx.boisestate.edu         Loss%   Snt   Last   Avg  Best  Wrst StDev
  1. AS46662  132.178.227.1        0.0%     3    0.7   0.6   0.6   0.7   0.0
  2. AS???    ???                 100.0     3    0.0   0.0   0.0   0.0   0.0
  3. AS46662  132.178.1.147        0.0%     3    0.6   0.7   0.6   0.9   0.1
  4. AS46662  132.178.1.98         0.0%     3    1.3   1.4   1.3   1.5   0.1
  5. AS6461   209.249.232.13       0.0%     3    1.3   1.7   1.2   2.6   0.8
  6. AS???    ???                 100.0     3    0.0   0.0   0.0   0.0   0.0
  7. AS???    ???                 100.0     3    0.0   0.0   0.0   0.0   0.0
  8. AS???    ???                 100.0     3    0.0   0.0   0.0   0.0   0.0
  9. AS???    ???                 100.0     3    0.0   0.0   0.0   0.0   0.0
 10. AS3356   4.69.220.109         0.0%     3   27.8  27.8  27.2  28.4   0.6
 11. AS3356   4.35.168.186         0.0%     3   51.7  52.2  51.7  52.5   0.4
 12. AS6315   166.70.1.2           0.0%     3   52.2  52.0  51.8  52.2   0.2
 13. AS6315   198.60.22.13         0.0%     3   51.8  51.9  51.8  52.0   0.1
```

Put names on the numbers:

```bash
for as in 6461 3356 6315; do dig +short TXT AS$as.asn.cymru.com; done
```

```text
"6461 | US | arin | 1996-04-22 | ZAYO-6461 - Zayo Bandwidth, US"
"3356 | US | arin | 2000-03-10 | LEVEL3 - Level 3 Parent, LLC, US"
"6315 | US | arin | 1996-03-04 | XMISSION - XMission, L.C., US"
```

**Check:** write the **AS path** from Onyx to XMission, the way BGP would write
it. Between which pairs of hops does the packet cross from one AS into another?
Those crossings are where eBGP sessions live. Which hops are inside one AS, where
an intra-AS protocol like OSPF decides the path?

## Round 3 - Boise State from the outside

Two more questions for RIPEstat, which collects the BGP routes that about 300
routers around the world are using right now.

First, who does Boise State connect to?

**Predict:** how many other ASes does Boise State exchange routes with?

```bash
curl -s "https://stat.ripe.net/data/asn-neighbours/data.json?resource=AS46662" | jq -c '.data.neighbours[]'
dig +short TXT AS46435.asn.cymru.com
```

```text
{"asn":46435,"type":"left","power":33,"v4_peers":43,"v6_peers":0}
{"asn":6461,"type":"left","power":223,"v4_peers":292,"v6_peers":0}
"46435 | US | arin | 2008-09-17 | IRON - IRON, US"
```

`left` means the neighbor sits to the left of Boise State in the AS paths that
reach it, that is, it carries traffic **to** Boise State. Two neighbors: Zayo,
and IRON, the Idaho Regional Optical Network.

Second, every route those routers hold for Boise State's prefix has an
`AS-PATH`. Save them to a file and look at the most common ones:

```bash
curl -s "https://stat.ripe.net/data/looking-glass/data.json?resource=132.178.0.0/16" > lg.json
jq -r '.data.rrcs[].peers[].as_path' lg.json | sort | uniq -c | sort -rn | head
```

```text
     10 24482 6461 46662
      6 8218 6461 46662
      4 9002 6461 46662
      4 6461 46662
      4 14840 3356 46435 46662
      3 48185 6461 46662
      3 47147 6461 46662
      3 3491 6461 46662
      3 25091 6461 46662
      3 13030 6461 46662
```

**Predict:** the paths end with Boise State's AS, and the AS just before it is
the provider the route came through. Of the 298 paths, how many come through
Zayo and how many through IRON?

```bash
jq -r '.data.rrcs[].peers[].as_path' lg.json | awk '{print $(NF-1)}' | sort | uniq -c
```

```text
     40 46435
    258 6461
```

**Check:** why would a university pay for two providers instead of one? Both
neighbors are `left`, and no AS shows up on the `right`, a network that reaches the
rest of the Internet through Boise State. What does that tell you about whether
Boise State carries traffic **between** other networks? And if AS 6461 received
a route whose AS-PATH already contained `6461`, what would it do with it, and
why? (section 5.4)

## Round 4 - Near is not fast

**Predict:** XMission is in Salt Lake City, about 475 km from Boise. Google's DNS
server `8.8.8.8` is somewhere. Which one answers faster, and how many ASes are on
the way to Google?

```bash
mtr -n -z -T -P 443 -r -c 3 8.8.8.8
```

```text
HOST: onyx.boisestate.edu         Loss%   Snt   Last   Avg  Best  Wrst StDev
  1. AS46662  132.178.227.1        0.0%     3    0.7   0.6   0.6   0.7   0.0
  2. AS???    ???                 100.0     3    0.0   0.0   0.0   0.0   0.0
  3. AS46662  132.178.1.147        0.0%     3    0.7   0.7   0.6   0.8   0.1
  4. AS46662  132.178.1.98         0.0%     3    1.2   1.3   1.2   1.6   0.2
  5. AS6461   209.249.232.13       0.0%     3    1.2   1.3   1.2   1.4   0.1
  6. AS???    ???                 100.0     3    0.0   0.0   0.0   0.0   0.0
  7. AS???    ???                 100.0     3    0.0   0.0   0.0   0.0   0.0
  8. AS???    ???                 100.0     3    0.0   0.0   0.0   0.0   0.0
  9. AS15169  142.250.169.166      0.0%     3   11.3  11.4  11.3  11.5   0.1
 10. AS15169  192.178.105.141      0.0%     3   11.4  12.5  11.4  14.5   1.8
        192.178.105.41
     AS15169  192.178.105.41
 11. AS15169  142.251.229.77       0.0%     3   11.6  11.6  11.5  11.8   0.1
        142.250.225.217
     AS15169  142.250.225.217
        142.251.50.245
     AS15169  142.251.50.245
 12. AS15169  8.8.8.8              0.0%     3   11.5  15.5  11.5  18.6   3.6
```

**Check:** about 11 ms to Google and about 52 ms to Salt Lake City. Light in fiber
covers roughly 200 km per millisecond, so how far away could the `8.8.8.8` that
answered possibly be? Google announces `8.8.8.8` from many places at once
(anycast), so which copy do you reach, and who decides? On the XMission path the
first Lumen router (AS 3356) is already 27 ms away. What does that suggest about
where Zayo handed your packet to Lumen?

## Exit question

Boise State has two providers. Suppose its network team wants all of its
outbound traffic to go through IRON whenever IRON can reach the destination,
even when the path through Zayo is shorter. Which BGP route selection rule lets
them do that, and why does a shorter AS-PATH not win? (section 5.4)

## Worksheet

**Download: [a6-worksheet.pdf](./a6-worksheet.pdf)**

The printed worksheet is two pages: a box per round for the prediction, the
result, and the check questions, plus the exit question.

## Instructor Notes

Instructor note, not shown to students.

**Print the worksheet, and the key for yourself.**

```bash
./scripts/cs425/a6-who-carries-your-packets.sh handout
./scripts/cs425/a6-who-carries-your-packets.sh key
```

The key stays in `scripts/cs425/` and never goes in `docs/public/`.

**Rehearsed on Onyx on October 4, 2026.** Every transcript on this page is real
output from that run. No testbed is needed, only Onyx and `ssh onyx`. The RIPEstat
numbers move a little day to day (298 paths, 258 and 40 in rehearsal), so expect
small differences.

**Budget.** About 8 minutes for round 1, 10 for round 2, 12 for round 3, 6 for
round 4, and 4 for the exit question.

**Things to watch for.**

- Round 2 and round 4 use TCP probes on purpose. UDP works for XMission (that is
  A5's round 4) but stalls at hop 10 on the way to Google, and ICMP stops at
  hop 2 or 3 for everyone.
- Hops 6 to 9 never answer, so `mtr` cannot say which AS they are in. They sit
  between a Zayo router and a Lumen router, so they are probably inside Zayo,
  but nobody can prove it from this trace.
- The trace only shows the path **out** of Boise State, which is Zayo for both
  destinations in rehearsal. The looking glass in round 3 shows the paths **in**,
  and 40 of those come through IRON. The two directions do not have to match,
  which is the `asymm` that `tracepath` printed in A4.
- `lg.json` is left in each student's home directory. It is harmless, but tell
  them they can `rm lg.json` at the end.
- jq and the RIPEstat API both worked from Onyx in rehearsal. If RIPEstat is
  down, show the numbers from this page instead and keep going.
