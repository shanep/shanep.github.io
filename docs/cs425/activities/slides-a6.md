---
next: false
prev: false
---

# A6 - Who Carries Your Packets?

<SlideView />

## Where did the table come from?

In A4 you asked Onyx which way a packet goes, and its forwarding table answered.
Chapter 4 never said who **wrote** that table.

A core router on the Internet holds about **1,050,000** IPv4 prefixes (end of
2025), and nobody typed them in. They were learned, one announcement at a time,
from other networks. Today is about who those networks are and how they talk.

## A network of networks

The Internet is not one network. It is more than **70,000 autonomous systems**
(ASes), each one a network run by a single organization with its own policies.

- An ISP, a cloud provider, a content company, a university
- Each one gets an **AS number**. Cloudflare is AS 13335.
- Boise State is one of them. Finding its number is round 1.

## AS numbers ran out too

AS numbers started out as **16 bits**, which is 65,536 of them, and there are now
more ASes than that.

So in 2007 (RFC 4893) BGP was extended to 32 bit AS numbers, about 4.3 billion of
them. It is the same story as IPv4 addresses in A4: a field that looked huge in
the 1980s, and then it was not.

## Two levels of routing

Routing is split in two, on purpose:

- **Intra-AS routing** happens inside one AS. One organization runs every router,
  so it can just pick the fastest path. OSPF is the common choice.
- **Inter-AS routing** happens between ASes. Nobody is in charge, and every AS has
  its own interests. That is BGP, and there is exactly one of it.

Two reasons for the split: **scale** (nobody can run Dijkstra over the whole
Internet) and **autonomy** (an AS runs its own network however it wants).

## Inside one AS: OSPF

OSPF is the link state algorithm from section 5.2, running for real:

- Every router floods the state of its links to every other router in the AS
- Every router then has the whole map, and runs Dijkstra on it
- Link weights are set by the network's operators, so "shortest" means whatever
  they decided it means

It is all about performance, because everyone inside the AS works for the same
boss.

## Between ASes: BGP

In January 1989, at an IETF meeting in Austin, three engineers sketched a new
routing protocol on two napkins over lunch. It became RFC 1105, the **Border
Gateway Protocol**, and it was meant to be a quick fix.

The current version, BGP-4 (RFC 4271), still holds the Internet together. Two
routers running BGP open a plain **TCP connection on port 179** and exchange
routes over it. Everything you learned in chapter 3 about TCP applies.

## eBGP and iBGP

- **eBGP** runs between routers in **different** ASes, at the border where two
  networks plug into each other.
- **iBGP** runs between routers in the **same** AS, and spreads what the border
  routers learned to everyone inside.

A router at the edge of an AS is a **gateway router**. Every time a packet crosses
from one AS into another, it is crossing a link with an eBGP session on it.

## A route is a prefix plus a story

A BGP announcement says "I can reach this prefix", plus some **attributes**. Two
matter most:

- **AS-PATH** lists the ASes the announcement has passed through
- **NEXT-HOP** is the address of the router to send to

Each AS that passes the route along adds its own number to the **front** of the
path. So read an AS-PATH from right to left to follow the announcement, and left
to right to follow your packets.

## Reading an AS-PATH

These are documentation AS numbers (RFC 5398), not real networks:

```text
prefix 203.0.113.0/24   AS-PATH 64500 64501 64502
```

- **64502** is on the right, so it is the **origin**: the AS that owns the
  prefix
- **64500** is on the left, the neighbor that told you
- Your packets go 64500, then 64501, then 64502

The path is also how BGP avoids loops. Keep that in mind for round 3.

## What leaves the building

An AS chooses what it announces. Inside, its routers know every little subnet,
and OSPF keeps them up to date. Outside, the rest of the Internet only needs to
know **which AS** to hand a packet to.

So an AS usually announces a few big blocks instead of every subnet inside. That
is the aggregation from A4, and it keeps every other router's table smaller.

## The table has a size limit

**August 12, 2014.** Verizon briefly announced about 15,000 extra, more specific
routes, and the global table went past **524,288** (2^19) entries.

That number was the default size of the forwarding table hardware in a lot of
older routers. They ran out of room, and networks around the world had outages,
including eBay and LastPass for some users. It is known as **512K Day**. Every
route an AS announces costs memory in every core router on the planet.

## Customers, providers and peers 💸

Every link between two ASes is also a business deal:

- **Customer and provider.** The customer pays the provider to reach the rest
  of the Internet. That service is called **transit**.
- **Peers.** Two networks swap traffic between their own customers, usually for
  free, because both save money.
- A **tier 1** network has no provider at all. It reaches everyone through peers.

## Transit costs money

Carrying traffic between two **other** networks is transit, and transit is a
product. A network carries traffic for strangers only when somebody is paying it
to.

BGP enforces this by what each AS chooses to **announce**. If you never tell a
neighbor about a route, that neighbor can never send you traffic for it.

## Policy beats distance

BGP is not a shortest path protocol. When an AS hears several routes to the same
prefix, it picks one with an ordered list of rules, and **its own preferences**
come into it long before the length of the path does.

Section 5.4 lists the rules. Read them in order, because the order is the point.
We come back to this at the end of today.

## Hot potato routing

When an AS has several ways out to a destination, a common choice is the
**closest exit**: hand the packet to the next network as soon as possible, and
let them carry it the rest of the way. Carrying traffic costs money, so nobody
carries it farther than they have to.

Both sides do this, so the path **out** and the path **back** often differ. That
is the `asymm` that `tracepath` printed in A4.

## Light is not instant

Light in fiber covers roughly **200 km per millisecond**, about two thirds of its
speed in a vacuum.

So 1,000 km of fiber costs at least 5 ms each way, 10 ms round trip, before any
router does anything. Flip it around and a round trip time puts a **ceiling** on
how far away the other end can be. Nothing answers from farther away than light
could get there and back.

## BGP believes what it is told

**June 24, 2019.** A small ISP in Pennsylvania ran a "BGP optimizer" that split
other networks' prefixes into more specific pieces, for its own internal use.
Those routes leaked to a customer, and from there to Verizon, which accepted them
and passed them on.

More than 20,000 prefixes, about 2% of the Internet, briefly pointed through a
small regional network. Cloudflare, Amazon and Facebook all saw outages. Longest
prefix match did exactly what it was built to do, again.

## When a network withdraws itself

**October 4, 2021.** A command run during maintenance on Facebook's backbone
disconnected all of its data centers. Its DNS servers noticed, and did what they
were designed to do: they **withdrew** their BGP routes.

Within minutes the rest of the Internet had no path to Facebook's DNS servers, so
`facebook.com` did not resolve anywhere. It took more than five hours, and
engineers in the data centers working on the routers in person, to bring it
back.

## You can watch BGP from the outside

You do not need a router to see BGP:

- **Route collectors** like RIPE's RIS, which you query through
  [RIPEstat](https://stat.ripe.net/), hold BGP sessions with hundreds of routers
  around the world and record every route they hear
- **Team Cymru** answers "which AS owns this address" over DNS
- **`mtr -z`** labels every hop of a trace with its AS number

A hop that never answers still forwarded your packet, the same lesson as A4.
`mtr` just cannot tell you whose router it was.

## Today

Today you find Boise State's AS, put company names on the routers between Boise
and Salt Lake City, and look at Boise State the way the rest of the Internet
sees it.

```bash
ssh onyx
```

Grab a worksheet. We predict first, then we look.
