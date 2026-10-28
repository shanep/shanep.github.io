alt: Tree diagram of data sources for security monitoring, split into network and host sources, with the formats (PCAP, Netflow, Syslog and others) they produce.
---
A tree diagram. Solid arrows run from parents to children. Dashed arrows run from a source to the data format it produces. Dash-dotted arrows lead into Syslog.

**Solid tree:**

- Data sources
  - Network
    - Network Packets
      - Headers
      - Payload
    - Network Aggregates
    - Network Infrastructure
      - Routing
      - Naming
  - Host
    - Applications
      - Web server logs
      - Files and documents
    - System and Kernel

**Dashed links to data formats** (shown as ovals):

- Headers and Payload both lead to PCAP.
- Network Aggregates leads to Netflow.
- Routing leads to BGP.
- Naming leads to DNS.
- Applications leads to Auth.log (a dashed link from the Applications branch).
- Web server logs leads to (E)CLF.
- System and Kernel leads to kernel.log and to "Ptrace and others".

**Syslog.** A solid arrow from Applications leads directly to a rounded box labelled "Syslog". Dash-dotted arrows lead into Syslog from BGP, DNS, Auth.log and kernel.log. A dashed arrow leads from Syslog to an oval labelled "/var/log/*".
