---
next: false
prev: false
---

# A2 - Stop Typing Your Password

<SlideView />

## You are going to live on Onyx

Every project from P1 on runs on Onyx, and so do A4 and X1. That is hundreds of
logins this semester, and right now every one of them starts with a password.

Typing it is slow, and it is also the weakest way to prove who you are. Today the
door learns to recognize you, and along the way you see what SSH is doing every
time you connect.

## Before SSH, the password was on the wire

`telnet` and `rlogin` sent everything in plain text, including your password.
Anyone with a packet sniffer anywhere on the path could read it.

In the spring of 1995, after a password sniffing attack on his university's
network, Tatu Ylönen at Helsinki University of Technology wrote a replacement:
**SSH**, the Secure Shell.

## Port 22 is not an accident

- Telnet was port **23** and FTP was port **21**, and SSH was meant to replace
  both. 22 sat between them, unassigned.
- Ylönen asked IANA for it in July 1995 and got it the next day.
- SSH 1.0.0 was released on **July 12, 1995**.

More than thirty years later, SSH still listens on port 22 by default.

## SSH is just an application

Same client-server model as chapter 2:

- **`sshd`** is the server. It is always on, listening on TCP port 22.
- **`ssh`** is the client you run on your laptop.
- Underneath it is plain TCP, so everything you learn about TCP applies.

The protocol is three layers, each its own RFC (2006): **transport** (RFC 4253)
encrypts and proves the server's identity, **user authentication** (RFC 4252)
proves yours, and **connection** (RFC 4254) carries your shell and commands.

## Two keys, two jobs 🔑

From chapter 8: public key crypto gives you a matched pair.

- The **private** key is yours alone. It never leaves your laptop.
- The **public** key can go to anyone. You can paste it in a chat window and
  nothing bad happens.
- What the private key **signs**, only the matching public key can verify.

That last line is the whole trick behind today.

## Proving it is you without sending a secret

- **Password login:** your password travels to the server (encrypted) and the
  server compares it. The server sees it, and so does anything that has broken
  into the server.
- **Key login:** the server already has your public key. Your laptop signs data
  that is unique to this one session, and the server checks the signature.

The private key never crosses the network, and a recording of the exchange is
useless next time, because the next session signs different data.

## Ed25519

The key type you make today is **Ed25519**, an elliptic curve signature scheme.

| Key | Public key line |
| --- | --------------- |
| Ed25519 | about 80 characters |
| RSA, 3072 bit | about 550 characters |

Same job, a fraction of the size. OpenSSH has supported it since 6.5 (January
2014), and since 9.5 (October 2023) it is what `ssh-keygen` makes by default.

## The server has a key too

Your key proves who **you** are. The server has its own **host key** that proves
it is really Onyx and not someone in the middle pretending to be.

- The first time you connect, `ssh` shows you the host key's fingerprint and
  asks whether to trust it.
- Say yes and it is saved in `~/.ssh/known_hosts`.
- Every later connection checks it against that file.

This is called **trust on first use**. The first connection is the one that
matters.

## When the host key changes

**March 24, 2023.** GitHub's RSA host private key was briefly exposed in a public
repository, so GitHub replaced it at about 05:00 UTC. Developers everywhere ran
`git pull` and got this:

```text
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@    WARNING: REMOTE HOST IDENTIFICATION HAS CHANGED!     @
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
```

If you know why it changed, remove the old entry and move on. If you do **not**
know why, stop. That warning is exactly what a man in the middle looks like.

## Unix permissions in 30 seconds

Every file has three sets of permission bits: **owner**, **group** and
**other**. Each set is read (4), write (2) and execute (1), added up.

```text
700  rwx------   only you can do anything (a directory you can enter)
600  rw-------   only you can read and write it
644  rw-r--r--   everyone can read it, only you can write
```

`ls -l` shows them on the left of every line.

## SSH is picky on purpose

- **`sshd` ignores `authorized_keys`** if anyone else could write to it or to
  `~/.ssh`. Anyone who can add a line to that file can log in as you.
- **`ssh` refuses a private key** that anyone else can read: `Permissions 0644
  for '...' are too open.`

The server side does not always tell you why it ignored your key. It just asks
for a password, which is the most confusing failure there is. Permissions are the
first thing to check.

## Every round trip costs time

The **round trip time** (RTT) is how long a packet takes to get there and back.
`ping` measures it.

A protocol that needs N back and forth exchanges before it does anything useful
pays N × RTT, no matter how fast your link is. Light in fiber covers about
200 km per millisecond, so more bandwidth does not help. Fewer round trips do.

## Setup is the expensive part

You have seen this already in chapter 2:

- **Non-persistent HTTP** pays a TCP handshake for every object: 2 RTTs each,
  one to connect and one to fetch.
- **Persistent HTTP** pays it once and reuses the connection.

An SSH login stacks up more setup than HTTP: a TCP handshake, a version exchange,
a key exchange, authentication, then your shell. How many round trips that adds
up to is one of today's questions.

## Reusing a connection

**Connection multiplexing** is SSH's version of persistent HTTP. The first
connection stays open after you log out, and later sessions ride inside it
instead of starting from scratch.

Same idea, same payoff: you skip the setup you already paid for. Today you
measure exactly how much that is worth on the campus network.

## Timing a login caught a backdoor

**March 29, 2024.** Andres Freund noticed that `ssh` logins on his Debian unstable machine
were taking **0.807 s** instead of **0.299 s**.

He dug in and found a backdoor hidden in `xz`, a compression library that `sshd`
loads on many Linux systems (CVE-2024-3094). Someone had spent years earning
commit access to plant it. It was caught before it reached the stable releases of
the big distributions, because one person timed a login and did not like the
number.

## A shell is a program that reads files

`bash` is just a program, and before it gives you a prompt it reads its
configuration files.

- On Red Hat systems like Onyx, a **login** shell reads `~/.bash_profile`, and
  the default one reads `~/.bashrc` in turn.
- `ssh onyx` gives you an **interactive** shell: a prompt, waiting for you.
- `ssh onyx uname -n` is **non-interactive**: no prompt, one command, then it
  exits.

Which files a non-interactive shell reads, and what can stop it, is part of
today.

## Dotfiles

Files whose names start with a `.` are hidden from `ls`. Use `ls -a` to see them.

- `~/.ssh/config` is your SSH client's settings
- `~/.bashrc` is your shell's settings

They are plain text, you own them, and they follow you from machine to machine.
A lot of developers keep theirs in a Git repository for exactly that reason.

## Teaching the shell a new word

Anything you define at the prompt lives exactly as long as that shell. Close the
terminal and it is gone.

Put the same definition in a file the shell reads at startup, and every new shell
gets it for free. Bash gives you two ways to define a new word, an **alias** and
a **function**. They are not interchangeable, and today you find out why.

## vi in five keys

`vi` is a **modal** editor: most of the time, the keys you press are commands, not
text.

| Key | What it does |
| --- | ------------ |
| `i` | start typing (insert mode) |
| `Esc` | stop typing |
| `:wq` | save and quit |
| `:q!` | quit without saving |
| `G` | jump to the end of the file |

Bill Joy wrote it at Berkeley in 1976, and it is on practically every Unix and
Linux box you will ever ssh into.

## Today

This one is instructor led. I do each step on the projector, you do it on your
laptop, and we wait for every hand before moving on.

Sit with your A1 group and grab a worksheet. The first step is proving that the
plain password login works:

```bash
ssh <username>@onyx.boisestate.edu
```
