alt: Diagram of the four-layer Internet protocol stack on a client and a server, with two network devices between them and the logical and physical data paths.
---
A layered diagram. A laptop labelled "Client" is at top left and a tower server labelled "Server" is at top right, joined by a line through a cloud labelled "Communication Network".

Four stacked boxes sit under the client and four under the server, labelled from top to bottom: "Application", "Transport", "Internet", "Link". Between them, in the middle, are two more stacks with only "Internet" and "Link" boxes. These two stacks represent the network devices, and a router icon below them is labelled "Network Devices".

Logical paths (dotted double-headed arrows):

- "Application Layer": between the client's and the server's Application boxes.
- "Transport Layer": between the client's and the server's Transport boxes.
- "Inet Layer": between the client's Internet box and the first network device's Internet box; and again between the second network device's Internet box and the server's Internet box.
- "Link Layer": between the client's Link box and the first network device's Link box; and again between the second device's Link box and the server's Link box.

Physical path (solid green line): it goes down through the client's stack, along the bottom to the first network device's stack, up through its Link and Internet boxes, across to the second network device, down through it, along the bottom, and up through the server's stack.

Legend, bottom left:

- Green solid line: "Physical path traversed by data"
- Dotted double-headed arrow: "Logical path traversed by data"
