---
next: false
prev: false
---

# A7 - One Hop at a Time

<SlideView />

## Every trip is a series of hops

The book's analogy: a tourist going from Princeton to Lausanne takes a limo to
JFK, a plane to Geneva, and a train to Lausanne. One trip, three legs, and each
leg uses a completely different way of moving.

A datagram from Onyx to Salt Lake City is the same. About a dozen links, and each
one can be a different technology: Ethernet in the server room, fiber between
cities, Wi-Fi at the far end.

## Two jobs, two layers

- **The network layer** picks the next hop. That is the forwarding table you
  interrogated in A4.
- **The link layer** gets the datagram across that **one** link, to the box on
  the other end of the wire. That is chapter 6.

A4 answered "which way?". Today is "and then what actually happens on the wire?"

## Where the link layer lives

Mostly in hardware, in the **network adapter** (the NIC):

- It builds the frame around your datagram and puts the bits on the wire
- It computes the error check on the way out and verifies it on the way in
- It decides, in hardware, whether an arriving frame is addressed to this host

The driver and the kernel handle the rest. This is the layer where hardware and
software meet.

## An Ethernet frame

Ethernet dates back to a 1973 memo by Bob Metcalfe at Xerox PARC, and the frame
has barely changed since the DIX standard of 1980.

| Field | Bytes | What it is |
| ----- | ----- | ---------- |
| Preamble | 8 | a wake up pattern so the receiver can sync its clock |
| Destination MAC | 6 | who this frame is for |
| Source MAC | 6 | who sent it |
| Type | 2 | what is inside: `0x0800` IPv4, `0x0806` ARP, `0x86DD` IPv6 |
| Data | 46 to 1,500 | the datagram (there is the 1,500 byte MTU from A4) |
| CRC | 4 | the error check |

## Frames carry datagrams

```text
+----------------+-----------+------------+------+-----+
| Ethernet header| IP header | TCP header | data | CRC |
+----------------+-----------+------------+------+-----+
                 <------------ the datagram ------>
```

The frame wraps the datagram as its payload, the same way TCP's segment rode
inside IP. Each layer has its own header, and its own addresses.

## A second kind of address

Every network adapter has a **MAC address**: 48 bits, written as 6 bytes in hex,
like `00:1a:2b:3c:4d:5e`.

- An **IP address** is handed to you by the network you join, usually by DHCP.
  It is **hierarchical**: the prefix names a network, like Onyx's `/25` from A4.
- A **MAC address** is burned into the adapter at the factory. It is **flat**:
  nothing in it says what network you are on.

2^48 is about 281 trillion addresses. Plenty to give every adapter ever made its
own.

## Reading a MAC address

The first 3 bytes are the **OUI** (Organizationally Unique Identifier). A vendor
buys a block from the IEEE, and that gives it 2^24 = **16,777,216** addresses to
burn into its hardware. `00:00:0c` is Cisco, for example.

```text
  00:00:0c   :   12:34:56
<-- OUI -->     <- the vendor numbers these ->
```

Look up the first 3 bytes of any MAC and you know who built the card.

## The two bits that matter

Write the first byte in binary and look at its two lowest bits. Take
`da:a1:19:3e:07:42`:

```text
da = 1 1 0 1 1 0 1 0
                 | |
                 | +-- bit 0: 0 = unicast, 1 = multicast
                 +---- bit 1: 0 = globally unique, 1 = locally administered
```

So this one is unicast and **locally administered**: some piece of software
picked it, not a factory. The broadcast address, `ff:ff:ff:ff:ff:ff`, is all
ones.

## Not every address came from a factory

- Virtual machines get made up addresses. QEMU and KVM hand out ones that start
  with `52:54:00`. Write `52` in binary and check bit 1.
- Since iOS 14 and Android 10, phones can use a **different** MAC address for
  every Wi-Fi network they join, instead of the one in their hardware.

Why a phone would want that is a question for round 1.

## The gap between the layers

From A4, Onyx's forwarding table gives it the **IP address** of the next hop. But
the adapter can only send a frame to a **MAC address**.

Something has to translate. On IPv4 that something is **ARP**, the Address
Resolution Protocol, RFC 826, from 1982.

## How ARP works

1. **Ask everyone.** A broadcast frame to `ff:ff:ff:ff:ff:ff`. Wireshark shows it
   as "Who has 10.0.0.1? Tell 10.0.0.42".
2. **The owner answers.** Only the host with that IP replies, directly to the
   asker, with its MAC address.
3. **Remember it.** The asker caches the answer so it does not have to ask again
   for every frame. Entries expire, so a stale answer does not live forever.

On Linux the cache is `ip neigh`. It is called the neighbor table because IPv6
does the same job with Neighbor Discovery, and both land there.

## ARP believes everyone

ARP has **no authentication**. Any host on the link can answer a query, or send a
reply nobody asked for, and the others will happily update their caches.

That is **ARP spoofing**: tell everyone on a coffee shop's Wi-Fi that you are the
gateway, and their traffic flows through you. Enterprise switches defend against
it with features like Dynamic ARP Inspection, which checks replies against the
DHCP leases the switch has seen.

## Bits flip on every link

- Electrical noise, a cheap cable, a microwave next to the access point
- The receiving adapter checks every frame. A frame that fails is **dropped
  without a word** to anyone, not even the sender
- Recovery, if it happens at all, is TCP's job, two layers up

Linux counts the drops. A rising `crc` number here means a bad cable or port:

```bash
ip -s -s link show
```

## Why not just a checksum?

In A3 you computed the Internet checksum: 16 bits, cheap to do in software, and
weak.

Real link errors tend to come in **bursts**, several bits in a row, and a
**CRC** (cyclic redundancy check) is built to catch exactly those. It is also
trivial to compute in hardware. Ethernet's 32 bit CRC catches every burst error
of 32 bits or fewer.

## Arithmetic with no carries

A CRC is long division, but **modulo 2**: addition and subtraction are both XOR,
and nothing ever carries or borrows.

```text
  1011        1101        1001
^ 1001      ^ 1011      ^ 1001
------      ------      ------
  0010        0110        0000
```

Each bit is on its own. That is why a CRC is a handful of gates in hardware
instead of an adder.

## The CRC idea

Sender and receiver agree on a **generator** `G` ahead of time. For Ethernet it is
fixed by the standard.

- The sender picks check bits `R` so that `D` followed by `R` divides **evenly**
  by `G`
- The receiver divides what arrived by `G`
- A remainder of zero means "looks good". Anything else means the frame was
  damaged, and it goes in the trash

## Hubs, then switches

- A **hub** is a repeater. Bits that come in one port go out every other port.
  Every host sees every frame, and two hosts sending at once collide.
- A **switch** reads each frame's destination MAC and sends it out only the port
  that leads there.

Both are invisible to the hosts. Nobody configures a MAC address to point at a
switch.

## A switch teaches itself

A new switch's table is empty. Nobody programs it. For every frame that arrives:

1. **Learn.** Record the frame's **source** MAC and the port it came in on.
2. **Look up** the destination MAC in the table.
3. **Forward** out the one port the table names, or drop it if that is the port
   it came in on.
4. **Flood** it out every other port if the destination is not in the table.

Entries age out, after 300 seconds by default on both Linux bridges and Cisco
switches, so a host that moves gets relearned.

## Switch versus router

| | Switch | Router |
| - | ------ | ------ |
| Layer | 2 | 3 |
| Forwards on | MAC address | IP address |
| Table built by | self-learning | a routing algorithm (chapter 5) |
| Hosts know it is there? | no | yes, it is their gateway |

## When the table fills up

A switch's table has a fixed size. Send it thousands of frames from made up
source addresses and the real entries get pushed out.

Now every real frame has an unknown destination, and you just read step 4: the
switch floods. Your switch is a hub again, and everyone on it can see everyone
else's traffic. That is **MAC flooding**, and port security limits on enterprise
switches exist to stop it.

## Today

Onyx's MAC address, its ARP cache and its gateway are all sitting there right
now. Rounds 1 and 2 run on Onyx, rounds 3 and 4 are pencil and paper.

```bash
ssh onyx
```

Grab a worksheet and a pencil. We predict first, then we look.
