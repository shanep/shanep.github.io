alt: Message flow diagram of the Kerberos protocol between a client, a key authentication server (KAS) and a server, in four numbered steps.
---
A message flow diagram with a user above and three boxes below. A figure labelled "user" has an arrow down to the box "client", which sits in the middle. The box "KAS" is on the left and the box "server" is on the right. The abbreviation KAS is as printed in the figure.

Messages, in order:

1. From client to KAS: "1. UID, SID, nonce"
2. From KAS to client: "2. $eK_{\mathsf{UID}}(K_{\mathsf{ses}})$, ticket"
3. From client to server: "3. ticket"
4. From server to client: "4. authenticator"
