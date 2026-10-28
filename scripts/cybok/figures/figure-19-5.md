alt: Diagram of the Extensible Authentication Protocol: a protocol stack above a network of a RADIUS server, an authenticator, a wired LAN and a wireless supplicant.
---
A diagram in two parts.

**Top: a protocol stack.** A box of stacked layers. From top to bottom:

- "EAP TLS" (full width)
- "EAP" (full width)
- Below, two separate columns. The left column has "RADIUS/LDAP/.." above "UDP/IP". The right column has "EAP over LAN (EAPOL)" above "IEEE 802.11".

**Bottom: the network.** Left to right:

- "RADIUS Server" (tower icon), joined by a line through a router to the "Authenticator (Switch/AP)" (an access point icon). The left column of the stack (RADIUS/LDAP/.., UDP/IP) is the link between server and authenticator.
- From the authenticator, a solid line goes to a "Hub", which feeds a bus line connecting three computers labelled "Wired LAN".
- From the authenticator, a dash-dot line (wireless link) goes to a laptop labelled "Wireless Device Supplicant". The right column of the stack (EAPOL, IEEE 802.11) is the link between supplicant and authenticator.
