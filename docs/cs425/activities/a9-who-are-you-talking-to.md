---
next: false
prev: false
---

# A9 - Who Are You Really Talking To?

**Week 14 · 20 points · pass/fail · one paper worksheet per group, turned in before you leave**

## Why you are doing this

Every time you load a page over HTTPS, your machine quietly answers three
questions: was this message changed on the way, is this server who it claims to
be, and can anyone else read it? Chapter 8 is the machinery behind those answers.
Today you watch each piece work, and break, on a real connection.

You change one character of a message and watch its hash change completely, read
the certificate `www.boisestate.edu` hands you and follow the chain of who vouches
for whom, make `curl` refuse four broken certificates, and find out what TLS
leaves in plain sight. Then you come back to the `yes` you typed the first time
you connected to Onyx in A2, and work out what you were actually trusting.

This one is **instructor led**, like A4 and A5. I do each step on the projector,
you run the same command on Onyx, and we do not move on until the room has caught
up. It takes about 40 minutes.

::: warning

One paper worksheet per group, turned in before you leave. Graded pass/fail, and
every round attempted in good faith is a pass. A wrong prediction costs you
nothing, but write it down **before** we run the command.

:::

## Before you start

- **Groups of 3 or 4.** One scribe owns the worksheet and puts everyone's name on
  it.
- **Everyone logs into Onyx with `ssh onyx`**, the same as A4 and A5.
- **One laptop per group runs the exit question**, which compares something on
  your laptop with something on Onyx.

## How every round works

Each round is the same three beats, and the worksheet has a box for each:

1. **Predict.** I ask the question. Your group writes an answer.
2. **Run.** We all run the command on Onyx.
3. **Check.** Was the prediction right? Which part of chapter 8 says why?

## Round 1 - Did anyone change this?

A cryptographic hash turns any message into a fixed size fingerprint. Hash a
message, then change one character and hash it again.

**Predict:** `$10` becomes `$90`. How many of the 64 hex digits in the hash
change?

```bash
printf 'pay Bob $10' | sha256sum
printf 'pay Bob $90' | sha256sum
```

```text
51f03ce57e0fd0078b481a668c361fdce4edb7a976d107f297f5e3d3e2e6bcb6  -
04475cefd57cc3e00a47cde385a124f6706381701dabcd72bfd30cc5f1a05096  -
```

Now mix in a secret that only Alice and Bob know. That is a MAC:

```bash
printf 'pay Bob $10' | openssl dgst -sha256 -hmac cs425
```

```text
SHA2-256(stdin)= da4f9b2c2f8002ea83506e462fb9c85a5e1516ca9c5ff126375eae65ca91e23a
```

**Check:** Trudy intercepts `pay Bob $10` and its plain hash, changes it to `$90`,
and sends it on with a fresh hash. Can Bob tell? Now she tries the same trick on
the MAC version. Why does that one fail? (section 8.3)

## Round 2 - Who vouches for whom?

Ask `www.boisestate.edu` for its certificate:

```bash
openssl s_client -connect www.boisestate.edu:443 -servername www.boisestate.edu </dev/null 2>/dev/null \
    | openssl x509 -noout -subject -issuer -dates -ext subjectAltName
```

**Predict** first: who issued Boise State's certificate, and how long is it good
for?

```text
subject=CN=boise-state.implem-fe4.ps-pantheon.com
issuer=C=US, O=Let's Encrypt, CN=YR1
notBefore=Aug 25 08:11:11 2026 GMT
notAfter=Nov 23 08:11:10 2026 GMT
X509v3 Subject Alternative Name:
    DNS:boise-state.implem-fe4.ps-pantheon.com, DNS:boisestate.edu, DNS:pan-live.boisestate.edu, DNS:www.boisestate.edu
```

The subject is not even Boise State. It is the hosting company that serves the
site. The names a certificate is actually good for are in the **Subject
Alternative Name** list, and `www.boisestate.edu` is in it.

Now follow the chain. Every certificate is signed by the one above it:

```bash
openssl s_client -showcerts -connect www.boisestate.edu:443 -servername www.boisestate.edu </dev/null 2>/dev/null \
    | grep -E '^ *[0-9]+ s:|^ +i:'
```

```text
 0 s:CN=boise-state.implem-fe4.ps-pantheon.com
   i:C=US, O=Let's Encrypt, CN=YR1
 1 s:C=US, O=Let's Encrypt, CN=YR1
   i:C=US, O=ISRG, CN=Root YR
 2 s:C=US, O=ISRG, CN=Root YR
   i:C=US, O=Internet Security Research Group, CN=ISRG Root X1
```

`s:` is who the certificate is for and `i:` is who signed it. The chain stops at
`ISRG Root X1`, which the server never sent. Onyx already had it:

```bash
grep -c 'BEGIN CERTIFICATE' /etc/pki/tls/certs/ca-bundle.crt
```

```text
147
```

**Check:** why does Onyx believe this certificate really belongs to Boise State?
Who is Onyx really trusting at the end of the chain, and where did that trust come from? (section
8.3, certificates and CAs)

## Round 3 - Four ways to fail

[badssl.com](https://badssl.com/) is a public site that serves deliberately broken
certificates, so you can see what failure looks like without being attacked.

**Predict:** which of these will `curl` refuse, and what is wrong with each one?

```bash
curl -sS -o /dev/null https://expired.badssl.com/
curl -sS -o /dev/null https://wrong.host.badssl.com/
curl -sS -o /dev/null https://self-signed.badssl.com/
curl -sS -o /dev/null https://untrusted-root.badssl.com/
```

Each one stops with a line like these (plus a paragraph of advice from `curl`):

```text
curl: (60) SSL certificate problem: certificate has expired
curl: (60) SSL: no alternative certificate subject name matches target host name 'wrong.host.badssl.com'
curl: (60) SSL certificate problem: self-signed certificate
curl: (60) SSL certificate problem: self-signed certificate in certificate chain
```

Now tell `curl` to stop checking:

```bash
curl -sS -k -o /dev/null -w '%{http_code}\n' https://expired.badssl.com/
```

```text
200
```

**Check:** for each failure, which link in round 2's chain is broken? With `-k`
the connection is still encrypted. So what exactly did `-k` give up, and which
property from section 8.1 is that?

## Round 4 - What TLS does not hide

Watch a normal HTTPS connection get set up:

```bash
curl -sv -o /dev/null https://example.com/ 2>&1 | grep -E 'Trying|Connected to|SSL connection'
```

```text
*   Trying 172.66.147.243:443...
* Connected to example.com (172.66.147.243) port 443 (#0)
* SSL connection using TLSv1.3 / TLS_AES_256_GCM_SHA384
```

By the third line the handshake is done and everything you send is encrypted. The
handshake itself is only partly hidden. TLS 1.3 encrypts everything after the
server's first reply, the ServerHello, but the very first TLS message, the
ClientHello, goes in the clear, and it names the site you want so that one server
can host many sites:

```bash
openssl s_client -trace -connect example.com:443 -servername example.com </dev/null 2>/dev/null \
    | grep -A3 'extension_type=server_name'
```

```text
        extension_type=server_name(0), length=16
          0000 - 00 0e 00 00 0b 65 78 61-6d 70 6c 65 2e 63 6f   .....example.co
          000f - 6d                                             m
```

That is `example.com`, readable by anyone on the path.

**Check:** you are on coffee shop Wi-Fi and every site you visit uses HTTPS. List
what the person running the Wi-Fi still learns about you. (section 8.6, and the
warning box in the chapter 8 notes)

## Exit question - The yes you typed in A2

On one laptop, compare the fingerprint of Onyx's SSH host key, read on Onyx, with
the fingerprint your laptop saved the first time you connected:

```bash
ssh onyx ssh-keygen -lf /etc/ssh/ssh_host_ed25519_key.pub
ssh-keygen -F onyx.boisestate.edu -l
```

```text
256 SHA256:VX7Yg613MmiIsSzSzRJ3hoyMiAN0thmzQ+RvutdxPyA no comment (ED25519)
# Host onyx.boisestate.edu found: line 46
onyx.boisestate.edu ED25519 SHA256:VX7Yg613MmiIsSzSzRJ3hoyMiAN0thmzQ+RvutdxPyA
```

They match. In A2 you typed `yes` when SSH asked about that fingerprint. What were
you trusting when you did, and how is that different from the way Onyx decided
to trust `www.boisestate.edu` in round 2?

## Worksheet

**Download: [a9-worksheet.pdf](./a9-worksheet.pdf)**

The printed worksheet is one sheet, front and back: a box per round for the
prediction, the result, and the check questions, plus the exit question.

## Instructor Notes

Instructor note, not shown to students.

**Print the worksheet, and the key for yourself.**

```bash
./scripts/cs425/a9-who-are-you-talking-to.sh handout
./scripts/cs425/a9-who-are-you-talking-to.sh key
```

The key stays in `scripts/cs425/` and never goes in `docs/public/`.

**Rehearsed on Onyx on October 4, 2026.** Every transcript on this page is real
output from that run, except the laptop half of the exit question, which came from
my laptop.

**Budget.** About 8 minutes for round 1, 12 for round 2, 8 for round 3, 8 for
round 4, and 4 for the exit question. Round 2 is the one to slow down on.

**Things to watch for.**

- Boise State's certificate is from Let's Encrypt, which issues 90 day
  certificates. The one on this page expires November 23, so the dates (and maybe
  the intermediate) will be different by the time this runs. Re-run round 2 the
  morning of class and use what it prints.
- badssl.com is a third party site. Check it is up before class. If it is down,
  round 3 still works as a prediction exercise from the four error lines above.
- The exit question needs the laptop's `known_hosts` entry from A2. A student who
  did A2 on a different laptop gets no output from `ssh-keygen -F`, which is a
  good moment to talk about trust on first use.
