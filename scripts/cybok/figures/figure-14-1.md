alt: Diagram of access control: a principal's request passes a reference monitor that checks an ACL before reaching an object.
---
A flow diagram read left to right. A drawing of a person labelled "principal" has an arrow to a dashed box "request". An arrow leads from "request" to a box "reference monitor", and another arrow leads from "reference monitor" to a box "object". A small box "ACL" (access control list) sits on top of "object", with an arrow from "ACL" to "reference monitor".

Two labelled feedback lines run above the flow:

- "authentication" (italic): a line from the principal to the request, with arrowheads at both ends of the path (one at the principal and one at the request).
- "authorisation" (italic): a line from the principal to the "ACL", with arrowheads at the principal and at the ACL.
