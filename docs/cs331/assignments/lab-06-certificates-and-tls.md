# Lab 6: Certificates and TLS

**Week 10 · 38 points · about 90 minutes · submit in Canvas**

## Goal

Lab 5 ended with an unanswered question: a signature verifies against a public key, but what tells
you whose key it is? This lab is the answer, and its limits.

You inspect a real certificate chain in your browser, then run a script that builds a chain from
scratch and runs the checks a browser runs against three server certificates, one good, one
expired, one issued for the wrong name.

## Objectives assessed

- **3.5**: Interpret an X.509 certificate chain and identify the trust assumptions and failure
  modes of public key infrastructure.

([TLO 3](../objectives.md#tlo-3--comparing-cryptographic-mechanisms-and-their-limits))

## Time estimate

| Step | Time |
| --- | --- |
| Step 1: inspect a real chain | 25 min |
| Step 2: run the script | 10 min |
| Step 3: the three certificates | 30 min |
| Step 4: trust assumptions | 25 min |
| **Total** | **90 min** |

## Before you start

- CyBOK §18.3 (printed pages 625-635), key management, especially **§18.3.8, managing public keys
  and public key infrastructure** (printed pages 632-635).
- CyBOK §18.5.1 (printed pages 639-640), Transport Layer Security.
- Download [data/cert_inspect.py](../data/cert_inspect.py) from Canvas Files.
- Needs the `cryptography` package from [Lab 0](lab-00-course-setup.md).

## Steps

### Step 1: Inspect a real certificate chain

Visit <https://www.boisestate.edu> and open the certificate your browser received.

- **Chrome / Edge:** click the icon left of the address bar → *Connection is secure* → *Certificate
  is valid*.
- **Firefox:** click the padlock → *Connection secure* → *More information* → *View Certificate*.
- **Safari:** click the padlock → *Show Certificate*.

Find the **Details** or **certificate chain** view, which shows all the certificates from the
server's own certificate up to the root.

Record:

1. **How many certificates are in the chain**, and the subject name of each, from leaf to root.
2. For the **server's own (leaf) certificate**: the subject common name, the issuer, the "not
   before" and "not after" dates, and the **Subject Alternative Name** list.
3. The **signature algorithm** and the **public key algorithm and size**.
4. Take a screenshot of the chain view.

Then answer: **the leaf certificate's SAN list probably contains more than one name.** Why does one
certificate cover several names, and what would go wrong if you visited a name that is not in that
list?

### Step 2: Run the script

```
python3 cert_inspect.py
```

It takes a few seconds: it is generating RSA keys. It builds a root CA, an intermediate CA, and
three server certificates, then runs five checks against each. Save the full output.

### Step 3: The three certificates

1. **Quote the five checks and the verdict** for each of `good`, `expired`, and `wrong-name`.
2. For `expired` and `wrong-name`, **exactly one check failed each time.** Name the failing check
   and explain, in two or three sentences each, why a browser treats that single failure as fatal
   rather than as a warning it can proceed past.
3. The `expired` certificate is still **correctly signed by a CA the browser trusts**. Its
   cryptography is fine. **So what is the expiry date actually for?** Two or three sentences,
   citing CyBOK §18.3.1 (the key life-cycle) or §18.3.7.
4. Change `HOSTNAME_BEING_VISITED` to `"shop.example.edu"` and run it again. **Paste the three new
   verdicts.** Which certificate is acceptable now, which is not, and why did the picture flip?
5. Change it to `"www.exarnple.edu"`: that is an *r* and an *n*, not an *m*. **What does the script
   say, and what is the real-world version of this attack?**

### Step 4: What the chain actually rests on

The script prints five checks per certificate. Four of them are arithmetic on the certificate
contents. One of them is not.

1. **Which check is not arithmetic?** Quote it, and explain in your own words what it means and who
   made that decision on your behalf.
2. Your operating system or browser ships a trust store of root certificates. Find out how many are
   in yours and say how you found out. (Firefox: *Settings → Privacy & Security → View
   Certificates → Authorities*. macOS: Keychain Access → *System Roots*. Windows: run `certmgr.msc`
   → *Trusted Root Certification Authorities*. An approximate count is fine.)
3. **Every one of those organisations can issue a certificate for any name.** Describe what happens
   if one of them is compromised or coerced into issuing a certificate for
   `www.boisestate.edu`. Who would notice, and how?
4. **Name two mechanisms that exist because of the problem in question 3.** CyBOK §18.3.8 discusses
   certificate status information and other approaches to managing public keys; Certificate
   Transparency and certificate pinning are two more you can look up. For each, one or two
   sentences: what it does, and what it still cannot fix.
5. Pull the whole thread together in one paragraph: **PKI does not eliminate the need to trust
   somebody. What it does is change who you have to trust, and how many of them.** Argue for or
   against that statement using something specific from this lab.

## What to submit

One Canvas submission containing:

1. Your Step 1 records and the screenshot of the real chain.
2. Your full script output from the first run.
3. Numbered answers to Steps 1, 3, and 4, including the modified-run outputs.

## Rubric

| Row | What is assessed | Points |
| --- | --- | ---: |
| 1 | Step 1: real chain correctly recorded (chain length, subjects, dates, SAN list, algorithms) with a screenshot, and the multi-name SAN question answered | 8 |
| 2 | Step 3, questions 1-3: checks and verdicts quoted; the single failing check identified in each case and correctly explained; the purpose of expiry explained beyond "so it stops working" | 10 |
| 3 | Step 3, questions 4-5: both modified runs shown with correct verdicts, and the homograph/lookalike-domain attack identified | 12 |
| 4 | Step 4: the trust-store check identified as the non-arithmetic one, a root count found and sourced, the CA-compromise scenario reasoned through, two mechanisms named with their limits, and a defended position on the closing statement | 8 |
| | **Total** | **38** |

**A common wrong answer in row 3, question 5:** the script's hostname check is an exact string
comparison, so `www.exarnple.edu` fails, not because the script is clever about lookalikes, but
because it is not the same string. The real-world point is that a *human being* reading an address
bar is far less reliable than that string comparison, and an attacker who registers the lookalike
domain can get a perfectly valid certificate for it.

## AI disclosure

You may use AI tools on this assignment. If you do, add one or two sentences saying which tool and
what for, per the [AI policy](../index.md#ai-policy).

Step 1 and Step 4 question 2 require you to look at your own browser and your own machine.
