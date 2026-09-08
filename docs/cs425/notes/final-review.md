# Final Review

**Covers:** comprehensive, weighted toward chapters 4 through 8

## The narrative to rehearse

If you can narrate **a day in the life of a web request** end to end, without notes,
you can answer most of the final. Do it out loud:

1. The laptop joins the network. DHCP discover, offer, request, ACK, all broadcast,
   UDP inside IP inside Ethernet. The laptop now has an address, a gateway, and a
   DNS server.
2. It needs the DNS server's MAC address, so it ARPs.
3. It queries DNS for the web server's name. The local server resolves through the
   root, the TLD, and the authoritative server, then caches the result.
4. It opens a TCP connection: three-way handshake. The SYN crosses several ASes,
   forwarded by tables built by OSPF inside each AS and by BGP between them, each
   router doing a longest prefix match.
5. TLS handshake, if the site is HTTPS.
6. HTTP GET, response, render.

At every arrow, ask yourself: which header got added, which layer added it, and what
would break without it.

## Topics by chapter

- **Chapter 4:** router internals, longest prefix match, IPv4 header,
  fragmentation, CIDR and subnetting, DHCP, NAT, IPv6 and tunneling, generalized
  forwarding.
- **Chapter 5:** Dijkstra, Bellman-Ford, count-to-infinity, OSPF, BGP and route
  selection, SDN, ICMP and traceroute.
- **Chapter 6:** parity, checksums, CRC, ALOHA, CSMA/CD, binary exponential backoff,
  MAC addresses, ARP, Ethernet, switch self-learning, VLANs.
- **Chapter 7:** wireless link impairments, CSMA/CA, hidden terminals and RTS/CTS,
  802.11 association, cellular architecture, mobility and handoff, TCP over wireless.
- **Chapter 8:** symmetric and public key crypto, hashes, MACs, signatures,
  certificates, nonce-based authentication, TLS, IPsec, firewalls and IDS.
- **Chapters 1 to 3:** roughly a quarter of the exam. See the
  [midterm study guide](../assignments/midterm-exam-guide.md).

## Problems to work beforehand

- Subnet a `/20` into subnets of a given size and give the ranges.
- Fragment a datagram across a link with a smaller MTU and give each fragment's
  offset and flags.
- Run Dijkstra on a six-node graph and produce the forwarding table.
- Run distance vector on a three-node graph through a link cost increase.
- Compute a CRC by hand.
- Trace an end-to-end web request naming every protocol involved, in order.
- Explain what an eavesdropper learns from a TLS session.

## Format reminder

60 questions, 2 points each, 120 minutes, one attempt, taken in Canvas during the
scheduled finals period. Questions marked **select all that apply** are
all-or-nothing.

See the [final study guide](../assignments/final-exam-guide.md) for the full topic
list.
