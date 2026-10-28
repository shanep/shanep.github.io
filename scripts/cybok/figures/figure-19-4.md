alt: Network diagram of IPsec transport mode: a home host reaches an enterprise gateway router over the public Internet, with packet layouts at each hop.
---
A network diagram with two dashed ovals joined by a cloud.

**Home Network** (lower left oval, label "Home Network"): a laptop labelled "IPSec Compliant Host" with a wireless symbol, connected by a dashed line (wireless) to a wireless router. A solid line runs from the router to the cloud labelled "Public Internet".

**Enterprise Network** (upper right oval, label "Enterprise Network"): a line from the cloud leads to a router labelled "IPSec compliant Gateway Router". A second router sits above it, connected to a tower server and two desktop computers.

Each hop carries a packet drawn as a row of fields:

| Where | Fields, left to right | Encrypted part |
|---|---|---|
| Between the home host and its router | "IP Header", "IPSec Header", "TCP/UDP Header", "Data Payload" | "TCP/UDP Header" and "Data Payload", marked "Encrypted" |
| On the Public Internet link | "IP Header", "IPSec Header", "TCP/UDP Header", "Data Payload" | "TCP/UDP Header" and "Data Payload", marked "Encrypted" |
| Inside the enterprise network, between the two routers | "IP Header", "TCP/UDP Header", "Data Payload" | none (the IPSec header has been removed by the gateway router) |

The IP header is not encrypted in any of them.
