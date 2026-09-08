# Chapter 2 - The Application Layer

**Reading:** Kurose & Ross, chapter 2

## 2.1 Principles of network applications

**Architectures:**

- **Client-server.** An always-on server with a permanent address; clients talk to
  the server, never to each other. Scaling means adding servers, which is why data
  centers exist.
- **Peer-to-peer.** Peers talk directly. Self-scaling, because each new peer brings
  capacity as well as demand, but harder to manage and secure.

**Processes and sockets.** A process is a program running on a host. A **socket** is
the door between the application and the transport layer. The application controls
everything above the door; the OS controls everything below it, except for the
transport protocol choice and a few parameters.

**Addressing a process** requires two things: the host's IP address, and a port
number identifying the process on that host.

**What a transport protocol can offer an application:**

| Service | TCP | UDP |
| ------- | --- | --- |
| Reliable data transfer | yes | no |
| Throughput guarantee | no | no |
| Timing guarantee | no | no |
| Security | no (TLS adds it) | no |
| Congestion control | yes | no |

Neither offers timing or throughput guarantees. The Internet does not do quality of
service by default, and applications compensate.

## 2.2 The Web and HTTP

HTTP is stateless: the server keeps nothing about previous requests.

**Non-persistent HTTP** opens a new TCP connection per object. Cost per object: two
RTTs plus transmission time, one RTT for the handshake and one for the request and
response.

**Persistent HTTP** reuses the connection, so subsequent objects cost one RTT.
This is the default in HTTP/1.1.

**Message format.** Request line, header lines, blank line, body. Learn the shape
well enough to write one by hand, because you will in P1's sibling protocols.

**Cookies** restore state to a stateless protocol: a response header sets an ID, the
browser stores it, and later requests carry it back.

**Web caching** puts a proxy between the client and origin. **Conditional GET**
(`If-Modified-Since`) lets the cache verify freshness without transferring the
object again.

**HTTP/2** adds framing and multiplexing to fix head-of-line blocking within a
connection.

## 2.3 Electronic mail

Three components: user agents, mail servers, and SMTP.

SMTP is a **push** protocol: the sender's server pushes to the recipient's server.
Contrast HTTP, which is a **pull** protocol. That asymmetry explains most of the
structural differences between them.

SMTP uses persistent connections, requires the message to be 7-bit ASCII, and
terminates the body with a lone period on its own line.

Mail **access** is a separate problem, solved by IMAP or HTTP, because the recipient
is not always online to receive a push.

::: tip

[P1](../assignments/p1.md) is an SMTP client. Read [RFC 5321](https://www.rfc-editor.org/rfc/rfc5321)
alongside this section, and read section 2.3 before you start writing code.

:::

## 2.4 DNS

DNS translates hostnames into IP addresses. It is a distributed, hierarchical
database, and it is a protocol for querying that database.

**The hierarchy:** root servers, top-level domain servers, authoritative servers.
Plus **local DNS servers**, which are not strictly in the hierarchy but do most of
the work in practice.

**Iterative** queries: the contacted server replies with the name of the next server
to ask. **Recursive** queries: the contacted server does the work and returns the
answer. In practice the host-to-local-server query is recursive and the rest are
iterative.

**Caching** is what makes DNS fast. Once a local server learns a mapping, it caches
it, which is why the root servers are not overwhelmed. TTLs bound the staleness.

**Resource records:** A, NS, CNAME, MX.

## 2.5 P2P file distribution

The key insight: with client-server, distribution time grows linearly with the
number of clients, because the server's uplink is the bottleneck. With P2P it grows
far more slowly, because every peer contributes upload capacity.

**BitTorrent:** chunks, the tracker, the swarm, rarest-first requesting, and the
tit-for-tat unchoking that provides the incentive not to freeload.

## 2.6 Video streaming and CDNs

**DASH**: the video is encoded at multiple rates, chopped into chunks, and the
client picks the rate per chunk based on the bandwidth it is currently measuring.
The intelligence sits in the client.

**CDNs** push content to the network edge, and use DNS redirection to steer each
client to a nearby replica.

## 2.7 Socket programming

The call sequence for TCP:

- Server: `socket`, `bind`, `listen`, `accept`, then `read`/`write` on the returned
  socket.
- Client: `socket`, `connect`, then `read`/`write`.

For UDP there is no connection: `socket`, `bind` on the server, then `sendto` and
`recvfrom` on both sides.

## Check yourself

- Why is SMTP a push protocol and HTTP a pull protocol?
- How many RTTs does a page with one HTML file and three images take over
  non-persistent HTTP? Over persistent HTTP?
- Trace a DNS lookup for a name that is not in any cache.
