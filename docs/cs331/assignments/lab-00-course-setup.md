# Lab 0: Course Setup and CyBOK Navigation

**Week 1 · 20 points · about 45 minutes · submit in Canvas**

## Goal

Get the two tools this course uses working on whatever machine you plan to use, and learn to find
things in the textbook. Everything else in the semester assumes you finished this.

If something here does not work, that is exactly what this lab is for. Post in the course
discussion board or email me now, in week 1, rather than in week 7 when a lab is due.

## Objectives assessed

- **1.1**: Define confidentiality, integrity, and availability, and identify which goal a
  described failure violates. ([TLO 1](../objectives.md#tlo-1--security-goals-terminology-principles-ethics-and-regulation))

## Time estimate

| Step | Time |
| --- | --- |
| Steps 1-2: Python and `cryptography` | 15 min |
| Step 3: find three things in CyBOK | 20 min |
| Step 4: look up a CVE | 10 min |
| **Total** | **45 min** |

## Before you start

- A terminal. On macOS that is Terminal or iTerm; on Windows use PowerShell; on Linux use whatever
  you like. If you have never opened one, that is fine, every command you need is written out
  below.
- A web browser.
- Download [docs/CyBOK_v1.1.0.pdf](../docs/CyBOK_v1.1.0.pdf) from Canvas Files, or open it in the
  browser. It is a large file (about 21 MB); download it once and keep it.

If you cannot get your own machine working, every step here works on the lab machines in CCP 240,
241, and 242.

## Steps

### Step 1: Check that you have Python 3.11 or newer

In your terminal, run:

```
python3 --version
```

You should see something like `Python 3.12.4`. Any version 3.11 or newer is fine.

- **If you see `Python 3.10` or older**, install a newer version from
  <https://www.python.org/downloads/> and run the command again.
- **If you see "command not found"**, try `python --version` instead. On Windows PowerShell the
  command is usually `python`, not `python3`. Whichever one works, use it everywhere below.

Copy the exact output. You will paste it into your submission.

### Step 2: Install the `cryptography` package

Labs 4, 5, and 6 use one package that does not come with Python. Install it now:

```
pip install cryptography
```

Then check that it worked:

```
python3 -c "import cryptography; print(cryptography.__version__)"
```

You should see a version number such as `43.0.1`. Copy that output too.

- **If `pip` is not found**, try `python3 -m pip install cryptography`.
- **If you get a "externally managed environment" error**, your system Python is protected. Run
  these three commands instead, which build a private Python environment in your home directory:

  ```
  python3 -m venv ~/cs331-env
  ~/cs331-env/bin/pip install cryptography
  ~/cs331-env/bin/python -c "import cryptography; print(cryptography.__version__)"
  ```

  If you take this route, use `~/cs331-env/bin/python` instead of `python3` for the rest of the
  semester. Write that down.

### Step 3: Find three things in CyBOK

CyBOK is about a thousand pages, and you will never read it front to back. What you need is the
ability to find a section quickly.

Two things to know first:

- **Section numbers** such as §1.1 are the reliable way to navigate. Use your PDF viewer's search
  box, or open the bookmarks panel.
- **Page numbers in the footer of each page do not match your PDF viewer's page counter.** The book
  has 39 pages of front matter. Always go by section number.

Now find and answer:

1. **Open §1.1, "Cyber Security Definition"** (printed page 2). CyBOK gives a definition of cyber
   security in the first paragraph. Quote it, and give the printed page number you found it on.

2. **Open §1.3.1, "Means and objectives of cyber security"** (printed page 6). This is where CyBOK
   introduces confidentiality, integrity, and availability. In your own words (not quoted), write
   one sentence for each of the three explaining what it protects against.

3. **Open the Glossary** (printed page 951). Look up **threat** and **vulnerability**. Quote both
   definitions, then write one sentence explaining the difference in your own words.

### Step 4: Look up a real vulnerability

Go to <https://www.cve.org/> and search for **CVE-2021-44228**.

Read the description. Then answer:

1. What software does this vulnerability affect?
2. In one sentence, what does the vulnerability let an attacker do?
3. **Which of confidentiality, integrity, and availability does it put at risk?** Name all that
   apply and give a one-sentence reason for each. Use the definitions you wrote in Step 3.

There is no trick here. The point is to connect the vocabulary from Step 3 to something that
actually happened.

## What to submit

One text entry in Canvas containing:

1. The output of `python3 --version` (Step 1).
2. The output of the `cryptography` version check (Step 2), and a note saying whether you used
   `pip install` directly or the `venv` route.
3. Your three answers from Step 3.
4. Your three answers from Step 4.

Plain text is fine. No formatting required.

## Rubric

| Row | What is assessed | Points |
| --- | --- | ---: |
| 1 | Python 3.11+ is installed and the version output is shown | 5 |
| 2 | `cryptography` imports successfully and the version output is shown | 5 |
| 3 | All three CyBOK lookups are answered, with the CIA definitions correctly stated in the student's own words | 5 |
| 4 | CVE-2021-44228 is correctly described, and the CIA goals it threatens are named with reasons | 5 |
| | **Total** | **20** |

## AI disclosure

You may use AI tools on this assignment. If you do, add one or two sentences at the end of your
submission saying which tool you used and what you used it for, per the AI policy in the
[syllabus](../index.md#ai-policy).

Note that Step 1 and Step 2 ask for output from *your* machine. An AI tool cannot tell you what
version of Python you have installed.
