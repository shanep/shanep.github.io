# Course data files

Everything the labs need, in one place. Nothing here requires a virtual machine, a server, or an
internet connection. Download the file the lab names, run it or read it, and go.

| File | Used by | What it is |
| --- | --- | --- |
| [SnapVault system description](photoshare-system.md) | [Lab 2](../assignments/lab-02-threat-model.md) | A written description of "SnapVault", a small photo-sharing service. You threat-model it. |
| [NORTHWIND MEADOW incident report](incident-report.md) | [Lab 7](../assignments/lab-07-malware-triage.md) | The NORTHWIND MEADOW post-incident write-up. You classify the malware and map it to MITRE ATT&CK. |
| [password_demo.py](password_demo.py) | [Week 5 module](../notes/week-05-authentication-and-credentials.md), [D3](../discussions/d03-authentication-policy-critique.md) | Fast hashing vs. slow hashing vs. salting, with timings you can measure. |
| [crypto_demo.py](crypto_demo.py) | [Lab 4](../assignments/lab-04-symmetric-encryption.md) | ECB vs. CTR on a picture, integrity with and without GCM, and nonce reuse. |
| [sign_demo.py](sign_demo.py) | [Lab 5](../assignments/lab-05-hashing-and-signatures.md) | Hash avalanche, Ed25519 signing and verification, MAC vs. signature. |
| [cert_inspect.py](cert_inspect.py) | [Lab 6](../assignments/lab-06-certificates-and-tls.md) | Builds a certificate chain and runs the checks a browser runs on three server certificates. |
| [vuln.c](vuln.c) | [Lab 8](../assignments/lab-08-memory-safety-and-assurance.md) | A badge reader with a stack buffer overflow. You read it; you never run it. |
| [sqli_demo.py](sqli_demo.py) | [Lab 9](../assignments/lab-09-sql-injection.md) | A login form built two ways: string concatenation and parameterized queries. |
| [auth.log](auth.log) | [Lab 10](../assignments/lab-10-log-analysis-and-incident-memo.md) | 569 lines of SSH authentication log from a server called `vault-api-01`. |
| [web_access.log](web_access.log) | [Lab 10](../assignments/lab-10-log-analysis-and-incident-memo.md) | 318 lines of web server access log in Apache combined format. |

## Running the Python scripts

Five of the files are Python programs. Three of them use only the standard library and will run on
any Python 3.11 or newer:

```
python3 password_demo.py
python3 sqli_demo.py
```

Two of them need the `cryptography` package, which you install once in
[Lab 0](../assignments/lab-00-course-setup.md):

```
pip install cryptography
python3 crypto_demo.py
python3 sign_demo.py
python3 cert_inspect.py
```

Every script has a block near the top marked **CHANGE THESE**. Those are the values the lab asks
you to experiment with. You never need to modify anything below that block, and you never need to
write a program from scratch in this course.

`crypto_demo.py` writes three `.bmp` image files into whatever directory you run it from. Every
other script only prints to the screen.

## Provenance

These files were written for CS 331. They are not real data:

- **SnapVault** is a fictional company. Its architecture is assembled from patterns that are common
  in small production services, including the mistakes.
- **NORTHWIND MEADOW** is a fictional incident at a fictional hospital network. Its shape (phishing
  to macro to fileless loader, a week of living-off-the-land lateral movement, exfiltration, then
  ransomware) follows patterns from published incident reporting, but no real organisation, person,
  or campaign is described. The domains in it are written with `[.]` so they cannot be clicked, and
  none of them is registered.
- **`auth.log` and `web_access.log`** are synthetic, generated to contain specific patterns that
  Lab 10 asks you to find. The IP addresses are all from ranges reserved for documentation
  (RFC 5737: `192.0.2.0/24`, `198.51.100.0/24`, `203.0.113.0/24`) plus private addresses, so none
  of them belongs to a real host anywhere.
- **`vuln.c`** is written to be read, not run. The bug in it is the textbook one.
- The **certificates** in `cert_inspect.py` are generated fresh every time you run it and are
  signed by a root that exists only inside that one process. They are not trusted by anything.

Nothing in this directory attacks a system you do not own, and nothing here needs a network.
