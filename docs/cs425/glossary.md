---
next: false
prev: false
---

# Glossary

Every term used in the in class activities, in the order you meet them rather than
alphabetically, because the definitions lean on each other. If you are looking for
one term, use your browser's find.

The short version of the whole page: a **layer** is a job, and every failure
belongs to exactly one of them. Naming the layer is most of naming the fix.

## The four layers

We use the five layer model from the textbook. These four are the ones that come
up when something is broken.

| Layer | Job | Lives in | Examples |
| ----- | --- | -------- | -------- |
| Application | Do the useful thing | Your program | HTTP, SMTP, DNS |
| Transport | Get bytes to the right *program*, reliably or not | The OS kernel | TCP, UDP |
| Network | Get a packet to the right *host*, anywhere | The OS and every router in between | IP, ICMP |
| Link | Get a frame to the next hop on this wire | The network card | Ethernet, Wi-Fi |

A useful habit: when you can name the layer a failure lives at, you have narrowed
the list of people who can fix it to about one.

## Names

**DNS**, the Domain Name System. The application layer protocol that turns a name
like `onyx.boisestate.edu` into an IP address. It is a protocol, not a magic
lookup: your machine sends a real query to a real server and waits for a real
answer, and all of that can fail.

**Resolver.** The server your machine asks. Usually handed to you by DHCP when you
join a network, which means *the network you are sitting on chooses who answers
your questions*. You can override it: `dig @1.1.1.1 example.com` asks that server
instead.

**Zone.** A slice of the name space that one set of servers is responsible for,
like `cs425.lab` or `boisestate.edu`.

**Authoritative.** A server is authoritative for a zone when it holds the real
records rather than a cached copy. An authoritative server saying a name does not
exist is a fact; a cache saying so is a guess with a shelf life.

**A record.** The record type that maps a name to an IPv4 address. `AAAA` is the
same thing for IPv6.

**NXDOMAIN.** The DNS response code meaning **that name does not exist**. It is an
answer, not an error: the server was reachable, understood the question, and told
you there is nothing there. Crucially, when you get NXDOMAIN you have sent **zero**
packets to the thing you were trying to reach, so whatever is wrong, it is not
connectivity.

**SERVFAIL** and **REFUSED.** The other two you will see. SERVFAIL means the server
tried and could not answer; REFUSED means it declined to. Both are different from
NXDOMAIN, which is a definite "no".

**TTL.** How many seconds a DNS answer may be cached before it must be asked again.
This is why a DNS change does not take effect everywhere at once.

## Addresses

**IP address.** The network layer identifier for an interface on a host. Note
*interface*, not machine and not user: a laptop on Wi-Fi and Ethernet has two.

**Public address.** One that is routable across the internet, so packets sent to it
from anywhere can arrive.

**Private address**, defined by **RFC 1918**. Three ranges reserved for use inside
private networks: `10.0.0.0/8`, `172.16.0.0/12`, and `192.168.0.0/16`. These are
**not routable on the public internet**. If a name resolves to one of these and you
are not on the network it belongs to, your packets go to your own gateway and die
there. Everything looks like a network outage and the actual bug is a DNS record.

**Loopback**, `127.0.0.1`, also called `localhost`. An address that always means
"this host". Traffic to it never leaves the machine.

**NAT**, Network Address Translation. The box that lets many machines behind one
private network share a single public address, by rewriting addresses and ports on
the way through. It is why your laptop thinks its address is `192.168.x.x` while
the rest of the internet sees something else, and why nobody can open a connection
*to* your laptop without help.

**CIDR notation**, like `132.178.0.0/16`. An address plus how many leading bits are
fixed. The `/16` means the first 16 bits identify the network and the remaining 16
identify hosts inside it, so that block covers `132.178.0.0` through
`132.178.255.255`.

## Getting there

**Packet.** The unit the network layer moves. Also called a datagram.

**Hop.** One router along the path. A packet from your laptop to a server crosses
somewhere between a handful and thirty of them.

**Router.** A device that forwards packets toward their destination based on the
destination address.

**RTT**, round trip time. How long a packet takes to get there and a reply to get
back. This is the number that bounds everything else: no request can complete
faster than one RTT, and most take several.

**ICMP.** The network layer protocol for control and error messages: "no route to
that host", "time exceeded", "packet too big", and the echo request and reply that
`ping` uses. It rides directly in IP, **alongside** TCP and UDP rather than on top
of them, which is why ICMP has no port numbers.

**ping.** Sends an ICMP echo request and waits for the reply. A successful ping
proves the host is reachable. **A failed ping proves almost nothing**, because
filtering ICMP while allowing TCP is an extremely common configuration. "It doesn't
ping" is not evidence that a service is down.

**traceroute** (`tracert` on Windows). Shows the routers along the path by sending
packets with deliberately small TTLs and collecting the "time exceeded" messages
that come back. Stars mean no reply, which usually means a router that declines to
answer rather than a broken path.

## Connections

**TCP.** The transport protocol that gives you a reliable, ordered byte stream. It
sets up a connection before any data moves, retransmits what gets lost, and tells
both ends when things go wrong.

**UDP.** The transport protocol that does not. No connection, no retransmission, no
ordering. Useful when you would rather handle loss yourself, as DNS does.

**Port.** A 16 bit number identifying *which program* on a host should get the
data. The address gets you to the machine; the port gets you to the process.

**Socket.** One end of a connection, identified by the pair of address and port on
each side.

**Listening socket.** A socket a server has opened and is waiting on. If nothing is
listening on a port, the host has no one to hand an arriving connection to.

**SYN, SYN-ACK, ACK.** The three messages of the TCP **three way handshake**. The
client sends SYN, the server answers SYN-ACK, the client replies ACK. Your
`connect()` call returns once the SYN-ACK comes back, which is why establishing a
connection costs **one round trip** before a single byte of your data moves.

**RST**, reset. A TCP flag meaning "there is nothing here, stop". A host sends one
when a connection arrives for a port with no listener. Getting a RST is
**informative**: it proves the address is routable, the host is up, and its network
stack is running. The problem is narrowed to one port on one machine.

**Connection refused.** What a client reports when it got a RST. It happens in
about one round trip, so it is effectively instant.

**Connection timeout.** What a client reports when it got **nothing at all**. The
client sends a SYN, hears silence, retransmits with **exponential backoff**
(waiting one second, then two, then four), and eventually gives up on its own
clock. This is why a drop takes seconds while a refusal takes milliseconds. A
timeout is the absence of information: the packet could have died anywhere.

**Retransmission.** Sending something again because no acknowledgement came back.

## Filtering

**Firewall**, or **packet filter**. Anything that inspects packets and decides
whether they may pass, usually on addresses and port numbers.

**DROP versus REJECT.** The two things a filter can do with a packet it does not
like, and the distinction matters enormously.

- **DROP** discards it silently. The sender gets nothing and waits out its own
  timeout. Slower to diagnose, and deliberately so: it gives a scanner no
  information.
- **REJECT** sends back an error, usually a TCP RST or an ICMP unreachable. The
  sender finds out immediately.

A dropped packet and a host that does not exist look identical from the client.
That is the point of dropping.

**Security group.** AWS's packet filter, attached to a virtual network interface
rather than running on the host. It defaults to DROP for anything not explicitly
allowed, and because it sits **in front of** the instance, a blocked packet never
reaches the operating system at all. A capture on the host shows nothing.

**Middlebox.** Any device on the path that does more than forward packets:
firewalls, NAT boxes, proxies, DNS interceptors. They are the reason a protocol
can behave differently on two networks that both claim to be "the internet".

## HTTP

**HTTP status code.** The three digit result at the top of a response. `200` is
success; `4xx` means the request was wrong; `5xx` means the server broke. Note that
a status code of any kind means the whole stack worked well enough to produce a
reply, which is more than most failures manage.

## Tools

| Tool | Answers | Notes |
| ---- | ------- | ----- |
| `dig` | Does this name resolve, and to what? | `dig +short NAME @SERVER -p PORT`. **`+short` prints only the answer records**, so a name that does not exist prints nothing at all and still exits 0. Drop `+short` and read the `status:` field to see what actually came back. |
| `ping` | Does this host answer ICMP? | Proves reachability when it works, proves nothing when it fails. |
| `nc -vz` | Is this TCP port open? | Names the failure clearly: `Connection refused` versus `Operation timed out`. The connect timeout is `-w` on Linux and **`-G` on macOS**, where `-w` means idle timeout instead; using the wrong one against a dropped port waits about 75 seconds with no output. |
| `curl -v` | Does the service actually respond? | Walks DNS, TCP and HTTP in one command and tells you where it stopped. |
| `ss -ltn` | What is listening on this machine? | Run on the server. `netstat -an` on older systems. |
| `tcpdump` | What packets are actually arriving? | Run on the server: `sudo tcpdump -nni any tcp port 8080`. Use `-nn` so it does not rename ports. |

### curl exit codes worth knowing

`curl` sets an exit status you can test in a script, and four of them cover almost
everything:

| Code | Meaning | Which layer failed |
| ---- | ------- | ------------------ |
| `0` | It worked | none |
| `6` | Could not resolve host | application (DNS) |
| `7` | Failed to connect | transport, or a filter in front of it |
| `28` | Timed out | depends: see `connect=` below |

Exit `7` and exit `28` are the pair that matters. `7` means something answered and
said no. `28` means nothing answered.

To tell a connection timeout apart from a server that connected and then went
quiet, ask curl for the handshake time:

```bash
curl -o /dev/null -m 8 -w 'connect=%{time_connect} total=%{time_total}\n' http://host:port/
```

`connect=0.000000` means the handshake never completed, so the problem is at or
below the transport layer. A real `connect=` value with a timeout afterward means
TCP succeeded and the **application** never answered.
