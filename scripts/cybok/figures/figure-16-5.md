alt: Sequence diagram of Basic HTTP authentication: the client requests a page, gets a 401, resends with Base64 credentials, and gets 200 OK or 403.
---
A sequence diagram with two vertical dashed lifelines, "Client" on the left and "Server" on the right. Time runs from top to bottom. Each message is a horizontal arrow.

1. Client to Server: "GET / HTTP/1.1".
2. Server to Client: "HTTP/1.1 401 Unauthorized" and "WWW-Authenticated: Basic ...".
3. On the client side, a self-arrow (loops out and back to the Client lifeline) labelled "Input Credentials".
4. Client to Server: "GET / HTTP/1.1" and "Authorization Basic: Base64(Credentials)".
5. On the server side, a self-arrow labelled "Validate Credentials".
6. Server to Client: "HTTP/1.1 200 OK" **or** "HTTP/1.1 403 Forbidden" (the word "or" is in bold).
