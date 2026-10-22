# 7.02 Lab 4: Symmetric Encryption in Practice

**Week 7 · 38 points · about 90 minutes · submit in Canvas**

## Goal

You will run one script and look hard at what it prints. By the end you will have seen, rather than been
told, three things: that a cipher alone is not enough, that encryption is not integrity, and that
reusing a nonce hands the plaintext back.

You will not write any code. You will run a provided program, change two values in it, and explain
what happened.

## Objectives assessed

- **3.1**: Explain what a block cipher and a mode of operation each provide, and demonstrate why
  ECB (electronic codebook) mode leaks structure.
- **3.2**: Distinguish confidentiality from integrity and authenticity, and name the primitive
  that supplies each.

Terminal learning objective (TLO): [TLO 3](../objectives.md#tlo-3-comparing-cryptographic-mechanisms-and-their-limits)

## Time estimate

| Step | Time |
| --- | --- |
| Step 1: Run it, look at the images | 20 min |
| Step 2: Compare the modes of operation | 25 min |
| Step 3: Test integrity | 20 min |
| Step 4: Reuse a nonce | 25 min |
| **Total** | **90 min** |

## Before you start

- Make sure you have done the [week 7 readings](../notes/week-07-symmetric-cryptography.md).
- Download [data/crypto_demo.py](../data/crypto_demo.py) from Canvas Files.
- Check that you have the `cryptography` package from [Lab 0](lab-00-course-setup.md) by running
  `python3 -c "import cryptography; print('ok')"`.

## Steps

Write your answers in one document, numbered to match the questions (2.3 is Step 2 question 3).
You submit it at the end along with your images and terminal output.

### Step 1: Run it

From the directory where you saved the file:

```
python3 crypto_demo.py
```

It prints three sections and writes three image files (`cs331_original.bmp`, `cs331_ecb.bmp`, and
`cs331_ctr.bmp`) into whatever directory you ran it from. Open all three in any image viewer.

**Save the whole terminal output.** You will quote parts of it below.

### Step 2: Compare the modes of operation

The script encrypted the same picture twice with the **same cipher (AES) and the same key**. The
only difference was the mode of operation.

Answer these in your document:

1. **Which of the two encrypted images still shows you the picture?** Name the file.
2. **Quote the three "Distinct 16-byte blocks" numbers** the script printed. Explain what those
   three numbers mean and why two of them are identical.
3. **Explain the mechanism**, in your own words, in about 150 words. Why does encrypting each
   16-byte block independently leave the picture visible? Use the words *block*, *deterministic*,
   and *identical plaintext blocks*.
4. AES is not broken here: it is doing exactly what a block cipher does. **So what is the mode of
   operation actually responsible for?** One paragraph, citing CyBOK (Cyber Security Body of Knowledge) §10.5.
5. Set `IMAGE_SIZE` to `128` and run it again. **What happens to the three block counts, and why?**

### Step 3: Show that encryption is not integrity

Part 2 of the output encrypted the same message two ways, flipped a single bit of each ciphertext,
and tried to decrypt it.

Answer these in your document:

1. **Quote what AES-CTR (AES in counter mode) decrypted to** after the bit flip. The original message was
   `Balance: $100.00`. What did the receiver get, and did anything warn them?
2. **Quote what AES-GCM (AES in Galois/Counter Mode) did** with the same tampering.
3. **Explain the difference.** What does GCM carry that CTR does not, and what does it let the
   receiver check? About 100 words, citing CyBOK §10.5.2.
4. In the CTR case, the attacker flipped one bit and changed exactly one character. **Suppose the
   attacker knows the message is `Balance: $100.00` and wants it to read `Balance: $900.00`.** Can
   they do it without the key? Explain why or why not: this is the single most important idea in
   this lab.
5. **Name the property** each of these supplies, using the vocabulary from CyBOK §10.5:
   confidentiality, integrity, authenticity, or some combination.
   - AES-CTR
   - AES-GCM
   - SHA-256 (Secure Hash Algorithm, 256-bit) by itself
   - HMAC-SHA256 (hash-based message authentication code with Secure Hash Algorithm, 256-bit)

### Step 4: Reuse a nonce

Part 3 encrypted two different messages under the **same key and the same counter start**.

Answer these in your document:

1. **Quote the `C1 XOR C2` line** (XOR is exclusive or). Most of it is zero bytes. Explain what the zero bytes tell you
   about the two plaintexts, without decrypting anything.
2. **Explain, in about 150 words, why XORing the two ciphertexts cancels the keystream out.** Write
   out the algebra: if `C1 = P1 XOR K` and `C2 = P2 XOR K`, where `K` is the keystream, what is
   `C1 XOR C2`?
3. The script recovered message 2 given message 1. **What did the attacker need to know, and what
   did they not need to know?**
4. Change `MESSAGE_TWO` to a message of your own (the same length as `MESSAGE_ONE`) and run it
   again. Paste the new "Recovered message 2" line and confirm it worked.
5. A nonce is not a key and does not have to be secret. **So why does reusing one break everything?**
   One paragraph. Then: name one thing a developer could do in real code that would cause this by
   accident.

## What to submit

One Canvas submission containing:

1. The three `.bmp` files, or one image showing all three side by side.
2. Your complete terminal output from the first run.
3. Your document with your answers to Steps 2, 3, and 4, numbered to match.

## Rubric

| Row | What is assessed | Points |
| --- | --- | ---: |
| 1 | The script was run, images are attached, and the terminal output is included | 6 |
| 2 | Step 2: ECB identified, block counts correctly interpreted, the mechanism explained in the student's own words, and the mode's responsibility separated from the cipher's | 12 |
| 3 | Step 3: both outputs quoted, the GCM tag explained, the `$100` to `$900` question answered correctly, and all four primitives correctly labeled | 12 |
| 4 | Step 4: the XOR algebra written out correctly, the attacker's knowledge stated precisely, the modified run shown, and a realistic cause of accidental nonce reuse named | 8 |
| | **Total** | **38** |

## AI disclosure

You may use AI (artificial intelligence) tools on this assignment. If you do, add one or two sentences saying which tool and
what for, per the [AI policy](../index.md#ai-policy).

The output you quote must come from running the script on your own machine.

## Instructor Notes

Instructor note, not shown to students.

**The question row 3 turns on:** yes, the attacker can change `$100.00` to `$900.00` under CTR
without the key, because CTR encryption is XOR with a keystream and the attacker knows both the
original and desired plaintext at that position. An answer that says "no, they do not have the key"
misses the whole point of the lab.
