alt: Diagram showing how events in traces become alerts through IDS sensors, and how a SIEM combines alerts into an incident.
---
A flow diagram in two parts.

**Top strip.** Three boxes in a row, joined by arrows left to right: Event, then Alert, then Incident.

**Main diagram**, read left to right:

- A tall box reads "System or network activity (packets, program execution, ...)". Two brackets lead from it to two traces.
- Box "Trace" holds Event m, Event n, Event o and Event x. Box "Trace2" holds Event i, Event j, Event k and Event l.
- A box "IDS Sensor: Acquisition Analysis" reads from Trace. A box "IDS Sensor2: Acquisition Analysis" reads from Trace2.
- Event m leads to Alert 1. Event n and Event o both lead to Alert 2. A further box reads "Alert ..." with no arrows. Event i and Event k both lead to Alert 3. (Events x, j and l have no arrows.)
- A tall box "SIEM: Acquisition Analysis" combines the alerts. Alert 1 and Alert 3 each have an arrow to a box labelled "Incident" at the far right. Alert 2 has no arrow to the Incident.
