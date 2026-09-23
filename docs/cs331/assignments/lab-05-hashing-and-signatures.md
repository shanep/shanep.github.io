# Lab 5: Hashing and Signatures

**Week 8 · 38 points · about 90 minutes · submit in Canvas**

## Goal

Work out what a hash proves, what a signature proves, and (the part people get wrong) what
neither of them proves. Then compare a shared-secret MAC with a public-key signature and say when
you would reach for each.

You run a provided script and change two values in it. No code to write.

## Objectives assessed

- **3.3**: Compare symmetric and public-key cryptography by key distribution, performance, and
  typical use.
- **3.4**: Verify a digital signature and explain what a verification failure does and does not
  prove.

([TLO 3](../objectives.md#tlo-3--comparing-cryptographic-mechanisms-and-their-limits))

## Time estimate

| Step | Time |
| --- | --- |
| Step 1: run it | 10 min |
| Step 2: hashing | 25 min |
| Step 3: signing and tampering | 30 min |
| Step 4: MAC vs. signature | 25 min |
| **Total** | **90 min** |

## Before you start

- CyBOK §10.4.3 (printed pages 332-334), hash functions.
- CyBOK §10.6 (printed pages 338-341), public key encryption.
- CyBOK §10.7 (printed pages 341-343), public key signatures.
- Nakov, *Practical Cryptography for Developers*, the **hash functions** and **digital
  signatures** pages: <https://cryptobook.nakov.com/cryptographic-hash-functions>
- Download [data/sign_demo.py](../data/sign_demo.py) from Canvas Files.
- Needs the `cryptography` package from [Lab 0](lab-00-course-setup.md).

## Steps

### Step 1: Run it

```
python3 sign_demo.py
```

Save the full output. The key pair is generated fresh each run, so your hex values will differ from
your classmates': that is expected, and it is itself worth noticing.

### Step 2: What a hash does

Part 1 hashed two messages that differ by one character.

1. **Quote both digests** and the "Bits that differ" line.
2. The two inputs differ by one character out of twenty. The digests differ in roughly half their
   bits. **Why is that the desired behaviour and not a flaw?** About 100 words.
3. The script hashed the same input twice and got the same answer. **A hash takes no key.** Given
   that, explain in two or three sentences why a hash by itself cannot tell you who wrote a
   message.
4. Change `HASH_INPUT_B` so it differs from `HASH_INPUT_A` by **one character**, run again, and
   paste the new "Bits that differ" number. Then change it to something completely different and
   paste that number too. **What do you notice?**
5. Suppose a download page publishes a file and its SHA-256 digest next to it. **What attack does
   that digest stop, and what attack does it not stop?** Two or three sentences each. This is the
   question the rest of the lab answers properly.

### Step 3: Signing, tampering, and what verification proves

Part 2 signed a message, verified it, then verified the same signature against a tampered message.
Part 3 verified a valid signature against the wrong public key.

1. **Quote the Part 2 output**: both the valid and the invalid result.
2. The attacker in Part 2 could see the message and the signature, and could change the message.
   **Why can they not just produce a new signature to match?** Two or three sentences.
3. Set `TAMPERED_MESSAGE` equal to `SIGNED_MESSAGE` and run it again. **What does Part 2 print now,
   and why?** Then set it back.
4. Part 3 verified the correct signature over the correct message against a *different* person's
   public key, and it failed. **State precisely what a successful verification does establish.**
   Two things, both of them narrow. Then state **three things it does not establish**: the script
   names them, but write them in your own words with an example for each.
5. **The gap this leaves.** A signature verifies against a public key. Nothing so far tells you
   that the public key belongs to the person you think it does. **Describe one concrete way an
   attacker exploits exactly that gap.** Name what the attacker has to control to make it work.
   (Week 10 is about the machinery built to close this gap. You are describing the problem it
   solves.)

### Step 4: Shared secret or key pair

Part 4 produced an HMAC tag and an Ed25519 signature over the same message.

1. **Quote both**, and note the size of each in bytes.
2. Alice and Bob share an HMAC key. Alice sends Bob a message with a valid tag. Bob later claims
   Alice authorised a payment; Alice says she did not. **Can the tag settle the argument?** Explain
   why or why not, then say what would change if Alice had signed with a private key instead.
3. **Key distribution.** Fill in this table and explain each number in one sentence:

   | Parties, all of whom must talk securely to each other | Shared secrets needed | Key pairs needed |
   | ---: | ---: | ---: |
   | 2 | | |
   | 10 | | |
   | 1,000 | | |

4. Public-key operations are far more expensive than symmetric ones. **Given the table above, why
   does nearly every real protocol use both?** Two or three sentences, citing CyBOK §10.6 or §10.8.
5. **Pick the right tool** for each of these and give one sentence of justification:
   - A phone app checking that a firmware update really came from the manufacturer.
   - Two servers inside one company verifying messages on a private link between them.
   - A university proving to a student that a transcript it issued has not been altered.
   - A web session cookie that a server issues and later checks itself.

## What to submit

One Canvas submission containing your full first-run output and your numbered answers to Steps 2,
3, and 4, including the modified-run outputs the steps ask for.

## Rubric

| Row | What is assessed | Points |
| --- | --- | ---: |
| 1 | Step 2: digests quoted, avalanche behaviour correctly explained, both modified runs shown, and the download-digest question answered on both sides | 10 |
| 2 | Step 3, questions 1-3: outputs quoted, and why the attacker cannot forge a new signature explained correctly | 10 |
| 3 | Step 3, questions 4-5: exactly what verification does and does not establish, with examples, and a concrete attack on the key-identity gap | 12 |
| 4 | Step 4: repudiation question answered correctly, key-distribution table correct, hybrid rationale given, and all four tools chosen with justification | 6 |
| | **Total** | **38** |

**The numbers row 4 needs:** *n* parties needing pairwise shared secrets require *n*(*n*−1)/2 of
them (1, 45, and 499,500) against *n* key pairs: 2, 10, and 1,000.

## AI disclosure

You may use AI tools on this assignment. If you do, add one or two sentences saying which tool and
what for, per the [AI policy](../index.md#ai-policy).

The hex values you quote must come from your own run.
