---
next: false
prev: false
---

# A5 - Errors on Purpose

<SlideView />

## "I can't ping it"

Something stops working, and the first thing almost everyone types is `ping`. No
reply comes back, and the verdict is in: **it is down**.

Sometimes that is right. A lot of the time it is not. Today is about what `ping`
actually asks, who answers, and what it means when nobody does.

## IP needs a way to complain

IP is best effort. A router that cannot deliver a datagram throws it away, and
without some kind of feedback the sender would never find out why.

**ICMP**, the Internet Control Message Protocol, is that feedback. It has been
around since **RFC 792 in 1981**, and it is how routers and hosts tell each other
"that did not work, and here is why" (section 5.6).

## ICMP rides inside IP

An ICMP message is carried in an ordinary IP datagram, with protocol number **1**
in the IP header (TCP is 6, UDP is 17).

So it sits just above IP, the way TCP and UDP do, but it is part of the network
layer. Applications do not normally send ICMP themselves. The network itself
uses it to talk about your traffic.

## Every message is a type and a code

| Type | Code | Meaning |
| ---- | ---- | ------- |
| 8 | 0 | echo request |
| 0 | 0 | echo reply |
| 3 | 0 | destination network unreachable |
| 3 | 1 | destination host unreachable |
| 3 | 3 | destination port unreachable |
| 3 | 4 | fragmentation needed, but don't fragment is set |
| 11 | 0 | TTL expired in transit |

That last row is the one `tracepath` lived on in A4.

## Questions and errors

ICMP messages come in two flavors:

- **Queries.** You ask, someone answers. Echo request and echo reply are the
  famous pair.
- **Errors.** Nobody asked. A router or host sends one back because something
  went wrong with a datagram **you** sent.

A query tells you someone is willing to answer. An error tells you what happened
to a specific packet, and who it happened at.

## An error carries evidence

Every ICMP error includes the **IP header plus the first 8 bytes** of the datagram
that caused it.

```text
| IP header | ICMP type, code | original IP header | first 8 bytes |
```

Those 8 bytes are the entire UDP header, or TCP's ports and sequence number. That
is enough for the sender's operating system to match the error to the exact
conversation it belongs to, by protocol and port.

## Rules for complaining

If every error could cause another error, one bad packet could start a storm. So
ICMP has rules:

- **Never** send an ICMP error about an ICMP error
- No errors about datagrams sent to a broadcast or multicast address
- For a fragmented datagram, only the first fragment can earn an error

The network will tell you about your mistakes, but it will not argue about them.

## Ping, named after sonar 🔊

Mike Muuss wrote `ping` in **December 1983**, and named it after the sound a sonar
pulse makes. It sends an echo request (type 8), waits for an echo reply (type 0),
and times the round trip.

```text
64 bytes from 132.178.227.1: icmp_seq=1 ttl=254 time=0.603 ms
```

One reply tells you three things: the host is up, the path works for ICMP echo,
and it took 0.6 ms to get there and back.

## Why so many networks drop ping

Echo was abused early and often:

- **Ping of death (1996).** A ping bigger than the 65,535 byte IP maximum, sent in
  fragments, crashed many operating systems when the pieces were reassembled.
- **Smurf attacks (late 1990s).** Send pings to a broadcast address with a
  victim's address forged as the source, and every host on that network replies to
  the victim at once.

So a lot of firewalls and network admins decided the safe amount of echo to let
through was **none**.

## You can't drop all of it

Blocking every ICMP message breaks things you need:

- **Fragmentation needed** (type 3, code 4) is how path MTU discovery works. Block
  it and you get the MTU black hole from A4.
- **Time exceeded** (type 11) is how you find where a path goes wrong.
- **IPv6** cannot work at all without ICMPv6: it uses it to find its neighbors on
  the local network.

So firewalls pick and choose, and echo is usually the first thing to go.

## Silence is not an answer

No echo reply can mean:

- The host is down
- A firewall somewhere dropped the request, or the reply
- The host is up but configured not to answer
- A router along the way is rate limiting ICMP

A ping test only ever tests ping. If what you care about is a web server, the
honest test is the thing a browser does: open a TCP connection to port 443.

## TTL, once more

Every router decrements the TTL. The router that takes it to **zero** drops the
datagram and sends a time exceeded message back to the source address.

That message comes **from** the router where the datagram died, so its source
address tells you who that router is. Set TTL to 1, then 2, then 3, and you get
one router at a time.

## Any packet can be a probe

The TTL is in the IP header, so routers apply it to everything, whatever is
inside:

| Probe | Who uses it |
| ----- | ----------- |
| ICMP echo request | Windows `tracert` |
| UDP to an unused high port, starting at 33434 | classic Unix `traceroute` |
| TCP SYN to a real port, such as 443 | `traceroute -T`, `mtr -T` |

Routers decrement all three the same way. Firewalls are another story: they make
their decisions on protocol and port.

## How do you know you arrived?

At the destination the TTL does not run out, so no time exceeded comes back.
Something else has to tell you the probe reached the end:

- An **echo request** gets an echo reply
- A **UDP datagram to a port with no socket** gets port unreachable (type 3,
  code 3), because the host has nobody to hand it to
- A **TCP SYN** gets a SYN ACK, or a reset if nothing is listening

Different probe, different "you made it" message.

## Private addresses

RFC 1918 (1996) set aside three blocks that anyone can use **inside** their own
network:

| Block | Size |
| ----- | ---- |
| `10.0.0.0/8` | 16,777,216 addresses |
| `172.16.0.0/12` | 1,048,576 addresses |
| `192.168.0.0/16` | 65,536 addresses |

Routers on the public Internet will not route them. If you see one in a trace, you
are still inside somebody's network, whatever box that turns out to be.

## Forwarding is fast, complaining is slow

Recall the router from chapter 4:

- **Forwarding** happens on the line cards, in hardware, at line rate. Your
  packets go through in nanoseconds.
- **Making an ICMP message** is not forwarding. It goes up to the routing
  processor, a regular CPU that is also busy running the routing protocols.

So routers protect that CPU. RFC 1812 (1995) tells routers to **rate limit** the
ICMP errors they generate, and many limit or filter them further. Keep this slide
in mind when a trace looks strange.

## Today

Everything today runs on Onyx, so every laptop in the room sees the same network.

```bash
ssh onyx
```

Grab a worksheet. We are going to cause errors on purpose and read the notes that
come back. Predict first, then we look.
