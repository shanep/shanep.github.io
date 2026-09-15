---
next: false
prev: false
---

# A2 - Stop Typing Your Password

**Week 4 · 20 points · pass/fail · one paper worksheet per group, turned in before you leave**

## Why you are doing this

Last week you typed your Onyx password a dozen times. Today you type it twice
more and then never again. Along the way you learn what SSH is actually doing
when it logs you in, why the second login is faster than the first, and how to
teach the shell a new word that is still there tomorrow.

Two of those words matter for the rest of the course. `ssh onyx` is how you will
reach the box for every project from here on. `probe` is a command you will type
dozens of times in A3 and A4; you do not need to understand what is inside it
yet, you just need it to exist.

This one is **instructor led**. I do each step on the projector, you do it on
your laptop, and we do not move on until the room has caught up. Nobody is racing
anybody.

::: warning

One paper worksheet per group, turned in before you leave. It is short: a row per
person, two timings, and three questions. Graded pass/fail; a serious attempt at
every step is a pass.

The same worksheet is at [a2-worksheet.pdf](./a2-worksheet.pdf).

:::

## Before you start

- **Sit with your group** from A1, so the person next to you can help when your
  laptop does something mine did not.
- You need the SSH client you used in A1. On Windows, use **Git Bash** today;
  it has every command below.
- The editor today is `vi`. It is on Onyx, on every Linux box you will ever
  ssh into, and on your Mac. You need five things, and they are on the board:
  `i` to start typing, `Esc` to stop, `:wq` to save and quit, `:q!` to bail out
  without saving, and `G` to jump to the end of the file.

## Step 0 - Prove you can get there at all

Before we change anything, every member confirms that plain password login
works. On your **laptop**:

```bash
ssh <username>@onyx.boisestate.edu
```

Three things can happen, and only one of them is good:

1. It asks **`Are you sure you want to continue connecting (yes/no)?`** the
   first time. Type `yes`. That is your laptop remembering Onyx's fingerprint.
2. It asks for your **password**, you type it, and you get a prompt on Onyx.
   Run `exit` to come back. Write "yes" in the step 0 column on the worksheet.
3. Anything else. Stop here and fix it, because nothing after this step will
   work until this does.

**Hands up when** everyone in your group has a prompt on Onyx and has typed
`exit`.

### If it did not work

The message `ssh` printed tells you where it stopped. Find yours:

| What you saw | What it means | What to do |
| ------------ | ------------- | ---------- |
| `ssh: command not found` or `'ssh' is not recognized` | Your laptop has no SSH client on its path | Windows: open **Git Bash** instead of PowerShell or cmd. |
| `Could not resolve hostname` | Your laptop could not turn the name into an address | Check the spelling: `onyx.boisestate.edu`. Then check you have a network at all: `curl -I https://www.boisestate.edu/`. If that fails too, it is the Wi-Fi, not SSH. |
| Hangs, then `Connection timed out` | Packets left your laptop and nothing came back | Try a different network (a phone hotspot is the quickest test). If it works there, something on the first network is blocking port 22. |
| `Connection refused` | You reached a machine and it is not running SSH | Almost always the hostname is wrong and you reached something else. Check it character by character. |
| `Permission denied (publickey,password)` after typing a password | You reached Onyx and it rejected the login | The username is your Boise State username, not your email address. Retype the password slowly; nothing is echoed. Three failures in a row and you may not have an Onyx account yet, which is fixed outside this room: tell me. |
| `WARNING: REMOTE HOST IDENTIFICATION HAS CHANGED!` | Your laptop has an old fingerprint for Onyx | `ssh-keygen -R onyx.boisestate.edu`, then try again and answer `yes`. |

When the table does not cover it, ask `ssh` to narrate what it is doing:

```bash
ssh -v <username>@onyx.boisestate.edu
```

Read the **last few lines before it stopped**. `Connecting to ...` with nothing
after it is the network. `Authentications that can continue` followed by a
failure is the account. Show the person next to you; two people reading `-v`
output solve it faster than one.

## Step 1 - Make a key

On your **laptop**:

```bash
ssh-keygen -t ed25519 -C "you@boisestate.edu"
```

Press Enter to accept the default file, and Enter twice more for no passphrase.
That makes two files in `~/.ssh`: `id_ed25519`, which is **private** and never
leaves this laptop, and `id_ed25519.pub`, which is **public** and is the half you
hand out.

```bash
ls -l ~/.ssh
cat ~/.ssh/id_ed25519.pub
```

**Hands up when** you can see one line starting with `ssh-ed25519` on your
screen.

## Step 2 - Put the public half on Onyx

Still on your laptop:

```bash
ssh-copy-id <username>@onyx.boisestate.edu
```

That is the first of your last two password prompts. It appends your public key
to `~/.ssh/authorized_keys` on Onyx.

If `ssh-copy-id` is missing, do it by hand. Copy the `ssh-ed25519` line from step
1, log into Onyx, and:

```bash
mkdir -p ~/.ssh
echo 'ssh-ed25519 AAAA... you@boisestate.edu' >> ~/.ssh/authorized_keys
chmod 700 ~/.ssh
chmod 600 ~/.ssh/authorized_keys
```

The two `chmod` lines matter. SSH silently ignores the file if anybody else on
the machine could read or write it, and "silently" is the important word.

Now the test, from your laptop:

```bash
ssh <username>@onyx.boisestate.edu uname -n
```

No password prompt, and it prints `onyx`. That is the first line on the
worksheet.

**Hands up when** that works with no password. If it asks for one anyway, the
permissions are almost always why; say so and we fix it together. Write "yes"
in the step 2 column on the worksheet.

## Step 3 - Make it one word

Create `~/.ssh/config` on your laptop with `vi ~/.ssh/config`. Press `i`, type
this in, press `Esc`, then `:wq`:

```
Host onyx
    HostName onyx.boisestate.edu
    User <username>
    IdentityFile ~/.ssh/id_ed25519
    ServerAliveInterval 60
    ControlMaster auto
    ControlPath ~/.ssh/cm-%r@%h:%p
    ControlPersist 10m
```

Then:

```bash
chmod 600 ~/.ssh/config
ssh onyx uname -n
```

From now on, `ssh onyx` is all you type. The first four lines are the shortcut.
The last three are the next step.

**Hands up when** `ssh onyx uname -n` prints `onyx`.

## Step 4 - Measure what the second login saves

Those last three lines turn on **connection multiplexing**: the first connection
stays open for ten minutes after you log out, and later ones reuse it instead of
paying for a new TCP handshake and a new key exchange.

Measure it. On your laptop:

```bash
ssh -O exit onyx 2>/dev/null   # tear down any existing master
time ssh onyx true             # cold: full setup
time ssh onyx true             # warm: reuses the open connection
```

Put both numbers in your row on the worksheet, and get one more number:

```bash
ping -c 3 onyx.boisestate.edu
```

That is the round trip time between your laptop and Onyx. Then answer, as a
group: the cold login cost some number of round trips. **Roughly how many**, and
what was it doing in them? You saw the TCP handshake in the reading; SSH adds a
version exchange, a key exchange, and authentication on top.

## Step 5 - Where bash reads its configuration

Now on **Onyx**. When you log in, bash reads a file before it gives you a prompt,
and anything you put in that file is there every time. On Red Hat, a login shell
reads `~/.bash_profile`, and the default one sources `~/.bashrc`. Look:

```bash
cat ~/.bash_profile
head -20 ~/.bashrc
```

Look near the top of `~/.bashrc` for a line like `[ -z "$PS1" ] && return`. On
Onyx there is **no** such line. On many other systems there is, and it makes the
file give up immediately for any shell that is not interactive. Write down whether
yours has one; step 7 depends on it.

## Step 6 - Teach the shell a new word

On Onyx, open `~/.bashrc` with `vi ~/.bashrc`. Press `G` to jump to the last
line, `o` to open a new line below it, and type this in. Then `Esc` and `:wq`.

```bash
# CS425: probe a host and port, report how long each phase took
probe() {
    curl -sS -o /dev/null -m 8 \
        -w 'connect=%{time_connect} total=%{time_total} code=%{http_code}\n' \
        "http://$1:$2/"
}
```

Save and exit. You do not need to understand the `curl` line today; A3 takes it
apart. What matters is the shape: `probe` is a **function**, `$1` is the first
thing you type after it and `$2` is the second.

Load it into the shell you are sitting in, then check it took:

```bash
source ~/.bashrc
type probe          # should say "probe is a function"
probe example.com 80
```

Write what `probe example.com 80` printed on the worksheet.

**Hands up when** `type probe` says it is a function. If it says `not found`, the
edit did not save; open the file again and look at the bottom.

## Step 7 - Prove it is permanent

This is the actual point. A function typed at the prompt dies with the terminal.
One in `~/.bashrc` does not. Prove it two ways:

1. Log out of Onyx completely (`exit`). Log back in with `ssh onyx`. Run
   `probe example.com 80` again **without sourcing anything**.
2. From your laptop, run:

   ```bash
   ssh onyx probe example.com 80
   ```

   That is a **non-interactive** shell: no prompt, no terminal, just one command.
   It still works, because bash reads `~/.bashrc` when a remote shell daemon
   starts it, and Onyx has no guard line stopping it.

On the worksheet, in one sentence: why would the second one **fail** on a machine
whose `~/.bashrc` began with `[ -z "$PS1" ] && return`?

## Step 8 - Why a function and not an alias

Try it the other way. On Onyx, at the prompt:

```bash
alias probe2='curl -sS -o /dev/null -m 8 -w "code=%{http_code}\n"'
probe2 http://example.com/
```

That works, because the thing you type lands at the **end**, where a URL happens
to go. Now try to make `probe2 example.com 80` build `http://example.com:80/`
out of two separate words. You cannot: an alias is text pasted in front of what
you typed, and there is no way to say "put the second word here". A function
has `$1` and `$2`. That is the entire reason `probe` is a function.

Answer the last question on the worksheet.

## Step 9 - Same function, your laptop

A4 runs from your laptop, not from Onyx, so put `probe` there too. Open your
shell's configuration file:

| Laptop | File |
| ------ | ---- |
| macOS | `~/.zshrc` |
| Linux | `~/.bashrc` |
| Windows, Git Bash | `~/.bashrc` |

Paste the same function at the bottom, open a **new** terminal window, and run
`probe example.com 80`. If it prints a `code=200` line, you are done.

::: tip Checkpoint

Every member logs into Onyx with no password using `ssh onyx`, the group has cold
and warm timings for everyone, and `probe` survives a logout on Onyx and works
on at least one laptop.

:::

## Worksheet

The printed worksheet is one page: a row per member (laptop OS, password login
works, key login works, cold and warm timings), the round trip estimate, whether your
`~/.bashrc` has a guard line, what `probe` printed, and the two written
questions.

## Instructor Notes

Instructor note, not shown to students.

**Print the worksheet.**

```bash
./scripts/cs425/a2-stop-typing-your-password.sh handout
```

No testbed; this runs against Onyx and the students' laptops.

**This is a follow along, not a group activity.** The first version of this
material was rounds 3 and 7 of a seven round A1 that nobody got past round 2 of.
Run it as a demo with pauses: do each step on the projector, say "hands up when",
and wait. The worksheet is deliberately small so it does not compete with the
screen. Budget: step 0 is ten minutes and can be the whole period for one
student, steps 1 through 4 are twenty five minutes, steps 5 through 8 another
twenty, step 9 is whatever is left.

**Say this at the start.**

> Last week you typed your password a dozen times. By the end of today you will
> never type it again, and you will have a command called `probe` that you will
> use for the next two activities. Follow along; I will wait at every step.

**Measured on Onyx while this was written.** The key has the full transcript:
cold login about 1.1 s, warm about 250 ms, round trip about 31 ms;
`~/.bash_profile` sources `~/.bashrc`; no `PS1` guard;
`ssh onyx probe example.com 80` works non-interactively.

**Where it goes wrong.**

- **Step 0 is where the period is lost or saved.** Run it before you touch
  keys. A student who cannot log in with a password has one of three problems,
  in order of likelihood: wrong username (email address instead of username),
  no SSH client on the path (Windows, cmd or PowerShell without OpenSSH), or no
  Onyx account. The first two are fixed in a minute with the table in the page.
  The third is not fixable in class; note the name and move on so the rest of
  the room is not waiting. Have `ssh -v` on the board as the universal answer to
  "it just doesn't work".
- **`ssh-copy-id` does not ship on Windows.** Have the manual `authorized_keys`
  procedure on the board before step 2 starts; it is in the page.
- **Loose permissions.** Any student whose key "does not work" almost certainly
  has a `~/.ssh` or `authorized_keys` that is group readable. `chmod 700 ~/.ssh;
  chmod 600 ~/.ssh/authorized_keys` on Onyx fixes it. If the laptop side is the
  problem, it is `chmod 600 ~/.ssh/config` or `~/.ssh/id_ed25519`.
- **Windows and `ControlMaster`.** Multiplexing is unreliable on Windows
  builds of OpenSSH. Expect some Git Bash students to get a warning, or two
  cold timings. That is a fine data point: write both numbers down and note the
  OS.
- **`vi`.** Some students have never used it, and it is deliberate: they will
  meet it on every box they ssh into for the rest of their careers. Put the five
  keys on the board before step 3 and leave them there: `i`, `Esc`, `:wq`, `:q!`,
  `G`. The two ways it goes wrong are typing before `i` (letters vanish or do odd
  things; `Esc` then `:q!` and start over) and pasting in insert mode with
  auto-indent (harmless here, the function still works). Nobody needs `nano`.
- **A student who breaks their `~/.bashrc`** can lock themselves out of a usable
  shell. `ssh onyx -t 'bash --norc'` gets them back in to fix it.
- **The `-C` comment.** Some will type a literal `you@boisestate.edu`. It is a
  comment and harmless; do not stop the room for it.

**Grading.** Pass/fail, graded by flipping through the stack. A pass is a row
per member with two timings, and something written under each of the three
questions. Canvas has no rubric attached, so award the full 20 or nothing.

**What this sets up.** `ssh onyx` is used in every project from P1 on. `probe`
is what A3 takes apart and what A4 is built around; students arriving at A4 with
it already in their laptop's shell config skip the step that most often goes
wrong there.
