---
next: false
prev: false
---

# A8 - TCP on a Noisy Link

<SlideView />

## A segment went missing

You are on campus Wi-Fi and one TCP segment never arrives. Maybe a router queue
somewhere overflowed. Maybe a microwave in the break room drowned out one frame.

TCP has no way to tell those two apart, and it reacts to both the same way.
Today is about what that costs you.

## Wired links are boring in a good way

- 10 Gigabit Ethernet is specified at fewer than **1 bit error in 10^12** bits.
  Corruption on a cable or a fiber is rare.
- So on a wired path, a lost packet almost always means a **queue filled up**
  and a router dropped it. Loss really does mean congestion.
- TCP's congestion control was designed in the late 1980s for exactly those
  networks.

## Wireless links are not 📡

Section 7.1 lists three reasons a frame gets corrupted in the air:

- **Decreasing signal strength.** The signal fades with distance and through
  every wall.
- **Interference.** 2.4 GHz is shared with Bluetooth, other networks, and
  microwave ovens, which run at 2.45 GHz.
- **Multipath.** The signal bounces off things and arrives several times,
  slightly out of step with itself.

None of these have anything to do with how busy the network is.

## SNR and BER

- **SNR** is how strong the signal is compared to the noise. **BER** is the
  fraction of bits that arrive wrong.
- Higher SNR, lower BER. Walk away from the access point and the SNR drops, so
  the BER climbs.
- 802.11 fights back with **rate adaptation**: when the channel gets worse, it
  drops to a slower, sturdier modulation. Slower, but fewer errors.

## TCP only sees what is missing

The sender finds out about a loss one of two ways:

- **Three duplicate ACKs.** Later segments arrived, one did not.
- **A timeout.** Nothing came back at all.

There is no field in the ACK that says *why* a segment was lost. Queue
overflow and radio noise look exactly the same from the sender.

## TCP's answer is always the same

Every loss is treated as congestion, so TCP slows down:

- **Reno** halves its congestion window.
- **CUBIC**, the Linux default since 2006, cuts it to 70%.
- Then it grows back slowly, one segment per round trip for Reno. That is
  **AIMD**, and it is why a TCP connection's window looks like a sawtooth.

On a congested link that is the polite thing to do. On a noisy one it gives up
bandwidth that nobody else wanted.

## The congestion window

`cwnd` caps how much unacknowledged data the sender may have in flight. One
window goes out per round trip, so roughly:

```text
throughput ≈ cwnd × MSS / RTT
```

For example, 10 segments of 1,448 bytes every 100 ms is about **1.16 Mbit/s**,
no matter how fast the link is. A small window means a slow connection.

## Slow start and ssthresh

- A Linux connection starts with a window of **10 segments** (RFC 6928).
- In **slow start** the window doubles every round trip. Exponential, despite
  the name.
- **`ssthresh`** is where slow start ends and the slow, linear growth takes
  over. After a loss, `ssthresh` drops too, so the next climb starts lower.

## Where the round trip time comes from

From section 1.4, every packet pays for:

- **Transmission delay**, `L / R`: pushing the bits onto the wire. A 1,500 byte
  frame at 100 Mbit/s takes 12,000 / 100,000,000 s = **0.12 ms**.
- **Propagation delay**: the signal crossing the distance.
- **Queuing delay**: waiting behind other packets in a buffer.
- **Processing delay**: the router reading the header and picking the output
  link. Usually microseconds.

The RTT is all of that, out and back. It is not a fixed property of the link.

## Keeping the pipe full

To use the whole link, TCP needs one round trip's worth of data in flight: the
**bandwidth-delay product** (section 3.4).

A 100 Mbit/s link with a 20 ms round trip:

```text
100,000,000 bit/s × 0.020 s = 2,000,000 bits = 250,000 bytes
250,000 / 1,448 ≈ 173 segments
```

A window smaller than that leaves the link idle part of every round trip.

## A formula for TCP with loss

Mathis and others worked out in 1997 what a Reno style TCP gets when a fraction
*L* of its segments are lost (section 3.7):

```text
throughput = 1.22 × MSS / (RTT × √L)
```

Try 1% loss, a 100 ms RTT, and a 1,448 byte MSS (11,584 bits):

```text
1.22 × 11,584 / (0.1 × √0.01) = 1.22 × 11,584 / 0.01 ≈ 1.41 Mbit/s
```

## Notice what is missing

**The link speed is not in the formula.** Loss and round trip time alone set the
ceiling.

The book runs it the other way: for one TCP connection to fill a 10 Gbps path
with a 100 ms RTT and 1,500 byte segments, the loss rate has to be about
**2 × 10^-10**. That is one lost segment in five billion, which takes a bit
error rate near 10^-14, about 60 times better than the 10^-12 the Ethernet spec
promises. A clean fiber often runs that well. A radio cannot.

## 802.11 does not trust the air

Ethernet sends a frame and hopes. 802.11 cannot afford to:

- The receiver **ACKs every unicast frame** (section 7.3).
- No ACK, and the sender transmits the frame again, up to a retry limit. The
  standard's default is 7 attempts for a short frame.
- Only after the last try fails does the frame count as lost, and only then does
  TCP ever find out.

This is reliable data transfer from chapter 3, one hop at a time.

## Tries multiply

If each try fails independently, the chance that **every** try fails is the
per try loss multiplied together.

Say 10% of tries fail and the link gives each frame 3 tries:

```text
0.1 × 0.1 × 0.1 = 0.001 = 0.1%
```

A link that loses one frame in ten hands TCP a loss rate of one in a thousand.

## Retries are not free

- Every retry uses **airtime**, so the more often a frame has to be sent, the
  less of the link is left for new data.
- Every retry adds **delay**, and a varying amount of it, so the RTT TCP measures
  jumps around.

The link layer trades some bandwidth and some delay for a much lower loss rate.
Whether that is a good trade is today's question.

## Three ways to fix TCP on wireless

Section 7.6 lists the options:

- **Local recovery.** Fix the loss on the wireless hop before TCP sees it.
- **Make the sender wireless aware.** Teach TCP to tell corruption from
  congestion.
- **Split the connection.** One TCP connection to the access point, another
  across the wired Internet.

Every one of them breaks a layer boundary somewhere, which is why none of them
is clean.

## Building a bad link in software

Onyx has no radio, so we fake one:

- **`unshare -rn`** puts you in a private **network namespace**: your own copy
  of the network stack, invisible to everyone else on the machine.
- **`tc`** attaches a queueing discipline to an interface, and **`netem`** is
  the one that emulates a network. It can add delay, cap the rate, and drop a
  percentage of packets at random.

It is the same tool people use to test software against a bad network before
their users find out the hard way.

## Reading TCP's own numbers

The meter asks the kernel what TCP is doing (the `TCP_INFO` socket option) once
a second:

- **`cwnd`** and **`ssthresh`**, in segments
- **`rtt`**, TCP's smoothed estimate from section 3.5
- **`retrans`**, how many segments it has sent twice so far

The MSS is **1,448 bytes**: a 1,500 byte MTU minus 20 bytes of IP header, 20 of
TCP header, and 12 for the timestamp option.

## Today

Get on Onyx, and grab the meter:

```bash
ssh onyx
wget -q https://shanepanter.com/cs425/activities/tcpmeter.py
```

Grab a worksheet and a calculator. We build the bad link together, one step at a
time. Predict first, then we look.
