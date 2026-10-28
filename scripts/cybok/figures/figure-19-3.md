alt: Two packet layout diagrams comparing IPsec transport mode and tunnel mode, showing which parts of the original packet are protected.
---
Two diagrams of packet layouts, each showing an original packet above and the packet as sent in IPsec below. Gray-shaded fields are the parts of the original packet that the mode protects.

**Transport Mode**

- Original: two fields, "IP header" and "IP data".
- in IPsec: three fields, "IP header", "IPsec hdr" and "IP data". The "IP data" field is shaded gray.
- Arrows: the original "IP header" points to the "IP header" in the IPsec packet, and the original "IP data" points to the "IP data" in the IPsec packet.

**Tunnel Mode**

- Original: two fields, "IP header" and "IP payload".
- in IPsec: four fields, "new IP hdr", "IPsec hdr", "IP header" and "IP payload". The "IP header" and "IP payload" fields are both shaded gray.
- Arrows: the original "IP header" points to the "IP header" in the IPsec packet, and the original "IP payload" points to the "IP payload" in the IPsec packet.

In transport mode only the data is protected; in tunnel mode the whole original packet, header included, is protected.
