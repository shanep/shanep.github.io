alt: Two sequence diagrams comparing the TLS 1.2 and TLS 1.3 handshakes between a client and a server, which then exchange application data.
---
A sequence diagram with three columns. In the middle is a "Server" (tower icon). On the left is a "Client" (laptop icon) under the heading "TLS 1.2", connected to the server through a cloud labelled "Internet". On the right is another "Client" under the heading "TLS 1.3", connected to the server through another cloud labelled "Internet". Time runs from top to bottom. A vertical line drops from each of the three devices.

Both sides start with a wide double-headed arrow between client and server labelled "TCP 3-way Handshake". A dashed horizontal line follows. The area below it, down to a second dashed line, is marked on the far left "TLS Handshake" (a vertical double-headed arrow). The area below the second dashed line is marked "Secure Channel".

**TLS 1.2** (left), messages in order:

1. Client to Server: "Client Hello"
2. Server to Client: "Server Hello, Certificate" and "Server Hello Done"
3. Client to Server: "ClientKeyExchange, ChangeCipherSpec, Fin."
4. Server to Client: "ChangeCipherSpec, Finished"

**TLS 1.3** (right), messages in order:

1. Client to Server: "Client Hello, Key Share"
2. Server to Client: "Server Hello, Certificate, Key Share, CertificateVerify, Finished"


Finally, on both sides, a wide double-headed arrow between client and server is labelled "Application Data".
