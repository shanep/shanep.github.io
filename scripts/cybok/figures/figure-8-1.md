alt: Diagram of the MAPE-K autonomic loop (Monitor, Analyze, Plan, Execute, Knowledge) applied to security operations, with the tools and bodies around it.
---
A layout diagram. Five loop stages sit in the middle, three curved bands arch over them, and boxes and arrows below connect the loop to the system, the Internet and information sharing organisations.

**Loop stages.** Monitor, Analyze, Plan and Execute are arranged as a loop in that order (Monitor at lower left, Analyze at upper left, Plan at upper right, Execute at lower right). Below them, a central box labelled Knowledge sits between Monitor and Execute and lists:

- Assets
- Configurations
- Signatures (IoC)
- Cyber-threat intel (CTI)

**Curved bands over the loop**, from inner to outer:

- "Intrusion Detection Systems / sensors" and "Intrusion Prevention Systems" (a short band covering Monitor and part of Analyze).
- "Security Information and Event Management" (a wider band covering Analyze and Plan).
- "Security Orchestration, Automation and Response" (the outermost band, covering Plan and Execute and reaching down the right side).

**Flows below the loop.** A wide box reads "Information and Communication Infrastructure / System".

- An upward arrow labelled "Events" goes from the Information and Communication Infrastructure / System box to Monitor.
- An upward arrow labelled "Configs Assets" goes from that box to Knowledge.
- A downward arrow labelled "Feedback" goes from Execute to that box.
- Two-way thin arrows connect that box to a box labelled "Internet" (in italics). The arrow labelled "Attacks" points from the Internet to the system, and the one labelled "Services" points from the system to the Internet.
- A dashed arrow labelled "Observations (Attacks, backscatter, etc.)" goes from the Internet down to the bottom box.
- The bottom box reads, in italics, "National, trans-national or industry fora (CERT, ISACs), regulators, technology suppliers and other information sharing organizations".
- An upward arrow labelled "IoC CTI" goes from that bottom box to Knowledge, passing behind the system box.
- A large downward arrow labelled "Information Sharing" goes from the Security Orchestration, Automation and Response band to the bottom box.
