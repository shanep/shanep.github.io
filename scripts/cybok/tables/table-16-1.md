| Segment | Optional | Description |
| --- | --- | --- |
| scheme: | No | Indicates the protocol a web client should use to retrieve a resource. Common protocols in the web are **http:** and **https:** |
| // | No | Indicates a hierarchical URL as required by [1469] |
| credentials@ | Yes | Can contain a username and password that might be needed to retrieve a resource from a remote server. |
| host | No | Specifies a case-insensitive DNS name *(e. g. cybok.org)*, a raw IPv4 *(e. g. 127.0.0.1)* or IPv6 address *(e. g. [0:0:0:0:0:0:0:1])* to indicate the location of the server hosting a resource. |
| :port | Yes | Describes a non-default network port number to connect to a remote server. Default ports are 80 for HTTP and 443 for HTTPS. |
| /resourcepath | No | Identifies the resource address on a remote server. The resource path format is built on top of Unix directory semantics. |
| ?query_parameters | Yes | Passes non-hierarchical parameters to a remote resource, such as server-side script input parameters. |
| #fragment | Yes | Provides instructions for the browser. In practice, it is used to address an HTML anchor element for in-document navigation. |
