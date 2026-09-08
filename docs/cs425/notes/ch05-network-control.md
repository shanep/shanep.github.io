# Chapter 5 - The Network Layer: Control Plane

**Reading:** Kurose & Ross, chapter 5

Chapter 4 asked how a router forwards a packet given a table. This chapter asks
where the table came from.

## 5.1 Two approaches

- **Per-router control.** Each router runs a routing algorithm and talks to its
  neighbors. Traditional.
- **Logically centralized control.** A remote controller computes tables and
  installs them. SDN.

## 5.2 Routing algorithms

Model the network as a graph: routers are nodes, links are edges, and edge weights
represent cost.

### Link state (Dijkstra)

Every router knows the **entire** topology, because every router floods its link
state to everyone. Each then runs Dijkstra locally to compute shortest paths.

- Converges quickly and predictably.
- `O(n²)` naively, `O(n log n)` with a heap.
- Can oscillate when link costs depend on the traffic those costs then attract.

Be able to fill in the Dijkstra table by hand for a six-node graph. It is a
guaranteed exam question.

### Distance vector (Bellman-Ford)

No router knows the whole topology. Each knows the cost to its direct neighbors and
whatever its neighbors have told it. It iterates:

```
Dx(y) = min over v of { c(x,v) + Dv(y) }
```

Each node sends its distance vector to its neighbors, recomputes when it receives
one, and sends again if anything changed. It converges without any node ever seeing
the whole graph.

- **Good news travels fast.** A cost decrease propagates in one round.
- **Bad news travels slowly.** A cost increase can trigger **count-to-infinity**,
  where two routers keep pointing at each other while their estimates climb.
- **Poisoned reverse** fixes the two-node case, but not every case.

## 5.3 Intra-AS routing: OSPF

The Internet is too large for one routing algorithm, and different organizations
want different policies. So it is divided into **autonomous systems**, each running
its own intra-AS protocol.

**OSPF** is link state: floods link state advertisements, runs Dijkstra, supports
hierarchy through areas, and authenticates its messages.

## 5.4 Inter-AS routing: BGP

BGP is how autonomous systems learn routes to each other. It is the protocol that
holds the Internet together.

- **eBGP** learns prefix reachability from neighboring ASes. **iBGP** propagates
  that inside the AS.
- BGP advertises **paths**, not just distances. The `AS-PATH` attribute lists the
  ASes a route traverses, which also prevents loops.
- `NEXT-HOP` says which router to send to.

**Route selection** goes by local preference first, then shortest AS-PATH, then
closest NEXT-HOP (hot potato routing), then tiebreakers.

::: warning

Local preference comes **first**, before path length. BGP routing is driven by
business relationships, not by distance. A provider will route traffic the long way
round if the short way costs it money. This is the single most important thing to
understand about BGP.

:::

## 5.5 The SDN control plane

Separate the control plane out of the routers entirely:

- A **communication layer** (OpenFlow) between controller and switches.
- A **network-wide state management layer** holding the topology and flow tables.
- **Applications** above the controller implementing routing, access control, load
  balancing.

The win is that network behavior becomes a program running on a general purpose
machine rather than a distributed algorithm you cannot debug.

## 5.6 ICMP

Error reporting and diagnostics: destination unreachable, TTL expired, echo request
and reply.

**Traceroute** exploits the TTL-expired message: send datagrams with TTL 1, 2, 3,
and so on, and collect the ICMP error from each router in turn. It works by
deliberately causing errors, which is a nice trick.

## 5.7 Network management and SNMP

MIBs, SNMP, and NETCONF/YANG. Read for awareness.
