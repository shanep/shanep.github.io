# Chapter 7 - Wireless and Mobile Networks

**Reading:** Kurose & Ross, chapter 7

Two separate problems that get taught together: the **link** is wireless, and the
**host** may move. They are independent, and the chapter treats them separately.

## 7.1 What makes wireless different

Wired links are boring in a good way. Wireless links are not:

- **Decreasing signal strength.** Attenuation with distance, through walls.
- **Interference from other sources.** 2.4 GHz is shared with a great deal else.
- **Multipath propagation.** The signal takes several paths of different lengths and
  arrives blurred.

Consequences: bit errors are common rather than rare, and the error rate varies over
time. **SNR** and **BER** trade off against each other. A higher SNR gives a lower
BER; increasing transmit power raises SNR but also interferes with everyone else.

::: warning

The critical structural difference: on a wireless link, a node **cannot detect
collisions while transmitting**, because its own transmission drowns out everything
else at its antenna. That single fact is why 802.11 uses CSMA/CA rather than the
CSMA/CD that Ethernet uses.

:::

**Hidden terminals.** A and C can both reach B but cannot hear each other. Carrier
sensing therefore fails: both hear silence, both transmit, and they collide at B.
**Signal fading** produces the same effect for a different reason.

## 7.2 Wireless links and network characteristics

**CDMA** lets multiple senders share the same band by encoding with orthogonal
chipping sequences, and the receiver decodes with the same sequence.

## 7.3 WiFi: 802.11

**Architecture.** A **basic service set** is one access point plus its associated
hosts. Hosts must **associate** with an AP before sending anything.

**Association.** APs send periodic **beacon** frames with their SSID and MAC address.
A host scans channels (passive scanning), or sends probes (active scanning), picks
one, and associates. Then usually DHCP for an address.

**CSMA/CA.** Sense the channel. If idle for a DIFS interval, transmit the whole
frame, because there is no collision detection to abort on. If busy, back off, and
count down only while the channel is idle.

**ACKs are required**, unlike Ethernet, because the sender has no other way to know
whether the frame arrived intact on a link this error-prone.

**RTS/CTS.** An optional exchange of short control frames that reserves the channel.
The CTS is heard by every node in range of the receiver, including hidden terminals,
so they stay quiet. It costs two extra frames, so it pays only for large data frames.

**Frame format.** Four address fields, which is more than Ethernet's two, because a
frame may pass between a host, an AP, and a router, and all of those need naming.

**Rate adaptation.** The sender lowers the modulation rate as the channel degrades
and raises it as the channel improves.

## 7.4 Cellular networks

Architecture: base stations, the radio access network, and the core network. 4G LTE
separates the data plane from the control plane and is entirely packet switched,
with an all-IP core.

5G adds millimeter wave bands: far more bandwidth, far less range and penetration,
so cells get much smaller.

## 7.5 Mobility management

**Home network** and **home agent**. **Visited network** and **foreign agent**. A
**care-of address** in the visited network.

Two ways to route to a mobile node:

- **Indirect routing.** Everything goes to the home agent, which tunnels to the
  care-of address. Simple, but triangle routing is inefficient.
- **Direct routing.** The correspondent asks the home agent for the care-of address
  and sends directly. Efficient, but it breaks when the node moves again mid-session.

**Handoff.** Moving between base stations without dropping the connection.

## 7.6 Wireless and mobility: impact on higher layers

TCP interprets loss as congestion. On a wireless link, most loss is corruption, not
congestion. TCP therefore cuts its window for the wrong reason, and throughput
collapses on a link that is merely noisy. The fixes (local recovery, split
connections, explicit notification) all involve breaking a layer boundary somewhere,
which is why none of them is clean.

## Check yourself

- Why can 802.11 not use collision detection?
- Draw a topology with a hidden terminal and show how RTS/CTS resolves it.
- Why does TCP perform badly over a lossy wireless link even when there is no
  congestion?
