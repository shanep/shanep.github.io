| Vulnerability category | Prevention | Detection | Mitigation |
| --- | --- | --- | --- |
| Memory management vulnerabilities | memory-safe languages, fat/smart pointers, coding rules | many static and dynamic detection techniques | stack canaries, NX, CFI, ASLR, sandboxing |
| Structured output generation vulnerabilities | regular expression types, LINQ, Prepared Statements | taint analysis | runtime detection |
| Race condition vulnerabilities | ownership types, coding guidelines | static and dynamic detection | sandboxing |
| API vulnerabilities | contracts, usable APIs, defensive API implementations | runtime checking of pre- and post-conditions, static contract verification | compartimentalisation |
| Side channel vulnerabilities | coding guidelines | static detection | isolation |
