---
next: false
prev: false
---

# A4 - Where Does This Datagram Go?

<SlideView />

## One question, every packet

A request from your laptop to a server in Salt Lake City crosses about a dozen
routers. Each one answers the same question for every packet, in nanoseconds:
**which way does this one go?**

When "the network is broken", the answer is very often one of those decisions
going wrong. Today is about learning to ask a machine what it would decide, and
why.

## Forwarding versus routing

- **Forwarding** is local. A packet arrives, the router looks up the destination
  in its table, and sends it out one port. Per packet, in hardware, nanoseconds.
- **Routing** is global. Routers talk to each other to work out the paths and
  fill in those tables. Seconds to minutes. That is chapter 5.

A rough analogy: forwarding is reading the sign at a highway interchange and
taking the exit. Routing is the transportation department deciding what the signs
say. Squint too hard and it falls apart, but it is the right split.

## Your laptop is a router too 💻

Every host has a forwarding table, and you have already been bitten by it:

- **Connect to a VPN** and some traffic suddenly goes through the tunnel. The VPN
  just added routes to your table.
- **Install Docker** and it claims `172.17.0.0/16` for its containers. If your
  apartment's network also uses `172.17.x.x`, those addresses now go to Docker
  instead of your router, and things mysteriously stop working.

Same table, same lookup, same rules as a core router.

## An address is just 32 bits

Dotted decimal is for humans. Each of the four numbers is one byte, 8 bits:

```text
     192       168        10        77
11000000  10101000  00001010  01001101
```

Routers never see `192.168.10.77`. They see those 32 bits, and every decision
in this chapter is made on bits.

## The prefix draws a line

`192.168.10.77/24` means: the first **24 bits** name the network, the rest name
one interface on it.

```text
11000000  10101000  00001010 | 01001101
<-------- network: 24 -------> <host: 8>
```

Every address that starts with those same 24 bits is on the same network, so
this network has 2^8 = **256** addresses: `192.168.10.0` through
`192.168.10.255`.

## The mask is the same line

A subnet mask is the prefix written out as an address: ones for network bits,
zeros for host bits.

```text
/24  11111111  11111111  11111111  00000000  = 255.255.255.0
/26  11111111  11111111  11111111  11000000  = 255.255.255.192
```

AND an address with its mask and the host bits fall away, leaving the network
address. That is how a host decides whether a destination is "local" or "through
the gateway".

## Two addresses are taken

In every block, two patterns of host bits are reserved:

- **All zeros** is the network itself: `192.168.10.0`
- **All ones** is broadcast, everyone on the link: `192.168.10.255`

So a `/24` has 256 addresses and **254** usable hosts, `.1` through `.254`. In
general, with `h` host bits: 2^h addresses, 2^h - 2 hosts.

## Moving the line splits the block

Make the prefix 2 bits longer, `/24` to `/26`, and those 2 bits pick one of 4
smaller blocks of 2^6 = 64:

| Next 2 bits | Block | Usable hosts |
| ----------- | ----- | ------------ |
| `00` | `192.168.10.0/26` | `.1` to `.62` |
| `01` | `192.168.10.64/26` | `.65` to `.126` |
| `10` | `192.168.10.128/26` | `.129` to `.190` |
| `11` | `192.168.10.192/26` | `.193` to `.254` |

`77` is `01|001101`, so `192.168.10.77/26` lives in the `.64` block. Every bit
you add to the prefix halves the block.

## Block sizes at a glance

| Prefix | Host bits | Addresses | Used for |
| ------ | --------- | --------- | -------- |
| `/8` | 24 | 16,777,216 | a huge organization (old class A) |
| `/16` | 16 | 65,536 | a campus (old class B) |
| `/24` | 8 | 256 | a typical LAN (old class C) |
| `/30` | 2 | 4 | a link between two routers |
| `/32` | 0 | 1 | exactly one host, in a forwarding table |

Anything in between works too. Work it out from the host bits rather than
memorizing the table.

## Why blocks instead of single addresses

- **Fewer table entries.** An ISP holding a `/20` can give 16 customers a `/24`
  each, and the rest of the Internet needs **one** entry to reach all of them.
- **Less waste.** Before CIDR (1993) the line could only sit at 8, 16 or 24 bits.
  An organization that needed 2,000 addresses got a whole `/16` with 65,534
  hosts, and the rest sat unused. That waste is a big part of why IANA handed out
  its last free IPv4 blocks in **2011**.
- **Reach.** Your block decides who you can reach directly. Everyone else is
  through the gateway.

## Longest prefix match

A destination can match several entries. The **most specific** one wins:

| Prefix | Goes to |
| ------ | ------- |
| `0.0.0.0/0` | the ISP (the default route) |
| `10.0.0.0/8` | the company VPN |
| `10.1.2.0/24` | the lab down the hall |

"Matches" means the first N bits are identical. `10.1.2.7` matches all three,
on its first 0, 8 and 24 bits, and goes to the lab. A longer prefix means
someone knows more precisely where that address lives.

## When longest prefix match goes wrong

**February 24, 2008.** Pakistan Telecom tried to block YouTube inside Pakistan by
announcing a route for `208.65.153.0/24`. YouTube's own announcement was the
broader `208.65.152.0/22`.

The announcement leaked to the rest of the Internet, and routers everywhere did
exactly what they are built to do: the `/24` was more specific, so it won.
YouTube was unreachable worldwide for about two hours. Nothing malfunctioned.
The rule worked perfectly.

## Every link has a size limit

- The **MTU** is the biggest datagram a link will carry. For Ethernet it has been
  **1,500 bytes** since the 1980s. Data centers often use 9,000 byte "jumbo"
  frames.
- Tunnels eat into it. A VPN wraps every packet in extra headers (WireGuard adds
  about 60 bytes), so a full size packet no longer fits.

## The MTU black hole

A classic support ticket: "SSH logs in fine, but `ls` in a big directory hangs."

1. Small packets (the login) fit, so everything looks healthy.
2. A big packet does not fit, and has don't fragment set.
3. A router drops it and sends an ICMP "fragmentation needed" message back.
4. A firewall along the way blocks ICMP, so that message never arrives.
5. The sender keeps retransmitting a packet that can never get through.

The fix is understanding the MTU, not rebooting the router.

## Why not just fragment?

- Lose **one** fragment and the whole datagram is lost.
- Only the **destination** reassembles, which costs it memory and time.
- So modern stacks avoid fragmenting at all and discover the path MTU instead.
- IPv6 went further: routers **never** fragment, only the sender can.

## Why TTL exists

- While routes are changing, two routers can briefly point at each other: a
  **routing loop**.
- Without a limit, a packet caught in a loop would circle forever, and so would
  every packet behind it.
- **TTL** is the safety valve. Every router subtracts one, and at zero the packet
  is dropped and an ICMP message goes back to the sender. Linux starts at 64,
  Windows at 128.

## A safety valve turned into a tool

In 1987 Van Jacobson turned that safety feature into **traceroute**: send a packet
with TTL 1, then 2, then 3, and each router along the way identifies itself as it
drops one. On Onyx the tool is `tracepath`, which does the same thing and needs
no root.

Some routers never answer. Forwarding your packet is their job, replying with
ICMP is not, and many rate limit or filter it. So **no reply does not mean
broken**: the same lesson as a host that will not answer ping.

## Matching on more than the destination

A traditional router looks at one field, the destination address. A lot of the
boxes in between look at more:

- A **firewall** matches the destination port and drops it
- **NAT** matches the source address and port and rewrites them
- A **load balancer** matches port 443 and picks one of many servers

Your home router is all of these in one box. **Generalized forwarding**
(sections 4.4 and 4.5) is the idea that they are all the same thing: match some
fields, take an action.

## Today

Every one of these ideas is sitting on Onyx right now: its subnet, its
forwarding table, its MTU, and the path to Salt Lake City.

```bash
ssh onyx
```

Grab a notes sheet: it is yours, not your group's. We predict first, then we look.
