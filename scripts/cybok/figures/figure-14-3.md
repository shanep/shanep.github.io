alt: Message flow diagram of the SAML POST profile between a client, an identity provider (IdP) and a service provider (SP), in numbered steps from -1 to 3.
---
A message flow diagram with a user above and three boxes below. A figure labelled "user" has an arrow down to the box "client", which sits in the middle. The box "IdP" is on the left and the box "SP" is on the right. The abbreviations IdP (identity provider) and SP (service provider) are as printed in the figure.

Messages, in order:

- "-1. connection request": from client to SP.
- "0. request to authenticate": from SP to client.
- "1. UID, SID, login credential": from client to IdP.
- "2. assertion": from IdP to client.
- "3. assertion": from client to SP.
