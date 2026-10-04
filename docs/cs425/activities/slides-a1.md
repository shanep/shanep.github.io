---
next: false
prev: false
---

# A1 - Speaking the Application Layer

<SlideView />

## Every click starts with a question

Type `boisestate.edu` into a browser and before a single byte of the page moves,
your machine has to answer one question: **what address is that?**

A modern page pulls from many different hostnames, and every one of them needs
that answer first. The protocol that answers it is DNS, and it is the one you use
most and look at least. Today we look.

## What an application layer protocol is

A protocol is just an agreement about messages. Chapter 2 says it defines:

- The **types** of messages, a request and a response
- The **syntax**, which fields there are and where they sit
- The **semantics**, what each field means
- The **rules** for when to send what

HTTP, SMTP and DNS are all application layer protocols. They run on the hosts at
the edge of the network, never on the routers in the middle.

## Ports name the application

An IP address gets a message to the right machine. A **port** gets it to the right
program on that machine. Servers listen on well known ports:

| Port | Protocol |
| ---- | -------- |
| 22 | SSH, how you log into Onyx |
| 25 | SMTP, mail between servers |
| 53 | DNS |
| 80 | HTTP |
| 443 | HTTPS |

## Names for people, numbers for routers

- People remember `boisestate.edu`.
- Routers forward on a 32 bit IPv4 address, or a 128 bit IPv6 address.
- **DNS** maps one to the other. It is a distributed, hierarchical database, and a
  protocol for querying that database.

It also lets the number change without the name changing, which is how a site moves
to a new server without everyone updating their bookmarks.

## Why not one big phone book 📖

That is how it started. Before DNS, every host on the ARPANET downloaded one file,
`HOSTS.TXT`, from a single server at SRI and looked names up in it.

That does not scale, and chapter 2 lists why a single central server would not
either:

- One **point of failure** for the whole Internet
- All the **traffic** of every lookup on Earth
- **Distant** from almost everyone
- Every change to every name in **one** place

Paul Mockapetris designed DNS in 1983 to replace it.

## A tree of servers

DNS splits the job up by the dots in a name, read right to left:

```text
                       . (root)
          ┌────────────┼────────────┐
         com          edu          org
                       │
                  boisestate.edu
```

- **Root servers** know who runs each top level domain
- **TLD servers** (`.edu`, `.com`) know who runs each domain under them
- **Authoritative servers** hold the real records for one domain

Nobody holds the whole database, and nobody has to.

## 13 names, far more machines

There are 13 root server names, `a.root-servers.net` through `m.root-servers.net`,
run by 12 different organizations.

Each name is not one box. The same address is announced from hundreds of places at
once, so your query goes to whichever copy is nearest. Today there are well over a
thousand root server instances around the world.

## Who does the walking

Your laptop does not walk the tree itself. It asks a **local DNS server** (also
called a recursive resolver) and waits:

1. Your host asks the local server: what is `boisestate.edu`? (**recursive**)
2. The local server asks a root, then the `.edu` TLD, then the authoritative server
   (**iterative**: each one replies with who to ask next)
3. The local server hands the final answer back to you

On Linux, `/etc/resolv.conf` lists the local servers your machine asks.

## Caching makes it fast

Once a local server learns an answer, it **keeps** it and answers the next person
from memory.

- Most lookups never get past the local server
- That is why the root servers are not buried in traffic
- It is also why a change to a record does not show up everywhere at once

## TTL: how long an answer is good

Every record carries a **TTL**, time to live, in seconds. It is the authoritative
server saying "you may cache this for this long".

- A cache counts the TTL **down** while it holds the answer
- At zero the answer is thrown out and the next query goes back to the source
- Common values: 300 (5 minutes), 3600 (an hour), 86400 (a day)

Admins lower a TTL days **before** moving a server, so the old answer drains out of
caches quickly when the move happens.

## Record types

A name can have many records, of different types:

| Type | Holds |
| ---- | ----- |
| `A` | an IPv4 address |
| `AAAA` | an IPv6 address ("quad A", four times as many bits) |
| `MX` | the mail server for the domain, with a preference number (lowest wins) |
| `NS` | the authoritative name servers for the domain |
| `CNAME` | "this name is really an alias for that name" |
| `TXT` | free text, mostly email policy and proof you own the domain |

## Reverse lookups

DNS can go backwards too: address in, name out. That uses a separate record type,
`PTR`, in a separate part of the tree:

```text
192.0.2.10  ->  10.2.0.192.in-addr.arpa
```

The address is written backwards so the tree still reads right to left, most
specific part first. Whoever **owns the address block** controls those records.

## DNS rides on UDP, port 53

- A lookup is one request and one reply. No handshake, no connection, so a cached
  answer can come back in a millisecond or two.
- If a reply is lost, the client just asks again.
- When an answer is too big for one datagram, the server says so and the client
  retries over **TCP**, also on port 53. Classic DNS capped UDP replies at 512
  bytes, and the EDNS extension lets them be bigger.

## What comes back

`dig` prints the whole DNS message. Trimmed down, it looks like this (the address
is from a block reserved for documentation):

```text
;; ->>HEADER<<- opcode: QUERY, status: NOERROR, id: 4242

;; QUESTION SECTION:
;www.example.org.          IN   A

;; ANSWER SECTION:
www.example.org.   3600    IN   A    192.0.2.10

;; Query time: 2 msec
```

Name, TTL, class, type, value. Every answer line reads the same way.

## The status field

The header's `status:` is the server telling you how the query went:

| Status | Means |
| ------ | ----- |
| `NOERROR` | the query worked (the answer section may still be empty) |
| `NXDOMAIN` | that name does not exist |
| `SERVFAIL` | the server could not get an answer |
| `REFUSED` | the server will not answer you |

When something "cannot connect", read this field before you blame the network.

## When DNS breaks: Dyn, 2016

**October 21, 2016.** The Mirai botnet, made of hacked cameras and DVRs, flooded
Dyn, a company that ran the authoritative DNS for a lot of big sites.

Twitter, Reddit, Netflix and GitHub were up the whole time. Their servers were
fine. But for hours, many people in the US could not get their **addresses**, so
as far as they could tell those sites were gone.

## When DNS breaks: Facebook, 2021

**October 4, 2021.** A maintenance command took down Facebook's backbone. Its DNS
servers, unable to reach the data centers, did what they were designed to do and
withdrew the routes to themselves (more on routes in chapter 5).

Now nobody on Earth could look up `facebook.com`, and that included Facebook's own
engineers and tools. It was down for about six hours. There is a reason "it's
always DNS" is a joke among sysadmins.

## Why everyone uses Onyx

Your laptops differ: different operating systems, different resolvers, different
networks. Every result would turn into an argument about whose machine is weird.

On Onyx everyone gets the same box, the same resolvers and the same network. If
your answer differs from your neighbor's, one of you typed something wrong, and
that is a much more useful argument to have.

## Today

Log into Onyx from your own laptop. Your laptop is just the terminal.

```bash
ssh <username>@onyx.boisestate.edu
```

Then we send real DNS queries to real servers with `dig` and read what comes back.
Grab a worksheet. Write down what you actually see, not what you expected to see.
