alt: Network diagram of a simplified SOIM deployment: private network, demilitarized zone and public network above a security monitoring network.
---
A deployment diagram with four labelled zones. Three zones sit side by side on top, separated by dashed vertical lines, and a fourth wide zone lies below them, separated by a dashed horizontal line. The abbreviation SOIM (security operations and incident management) is from the caption. Two firewalls and several network buses connect the top zones.

**Private network** (left zone): a server with a DNS SERVER badge and a document icon, a tall pillar-shaped device, a second server, and a network bus. An IDS/IPS (intrusion detection/prevention system) sensor with two log file icons sits on the boundary with the security monitoring network, below the bus.

**Demilitarized zone (exchange network)** (middle zone): two servers (one with a DNS SERVER badge and a document icon), a web server icon with log file icons, a network bus, and an IDS/IPS sensor on the boundary with the security monitoring network. A firewall joins the private network's bus to the demilitarized zone's bus.

**Public network** (right zone): a picture of a wide area network cloud with routers and links. A second firewall joins the demilitarized zone's bus to the public network.

**Between the zones and the monitoring network** (right side): a red cylinder labelled "CTI" (cyber-threat intelligence) receives a thick red arrow from the public network and passes a thick red arrow down into the security monitoring network. A green cylinder labelled "CERT ISAC" has a two-way green arrow to the security monitoring network.

**Security monitoring network** (bottom zone, labelled "Security monitoring network"): a network bus connects the two IDS/IPS sensors above to a "Security Operating Center (SOC)", drawn as a person at two workstations, and to a server labelled "SIEM" (security information and event management) with two database cylinders.

**Legend** (bottom right): the small sensor icon is "Intrusion Detection/ Prevention System" and the small document icon is "Log File".
