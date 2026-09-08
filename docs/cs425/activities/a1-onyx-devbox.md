---
next: false
prev: false
draft: true
---

# A1 - Get on the Box

**Week 1 · 20 points · one class period · one submission per group, before you leave**

## Overview

Codespaces hands you a working machine. Somebody wrote a container definition, and
a build system you never saw provisioned a Linux box, installed a compiler, and
opened an editor onto it. Today your group does that job by hand, on
`onyx.boisestate.edu`, from your own laptops.

Every step of this is a network operation. Logging in is a TCP connection to port
22. Your shell dies when that connection dies. The build output scrolling past you
is arriving a packet at a time. You are going to measure all of it.

The reason this is group work and not homework is that there are three or four
different laptops at your table, on different operating systems, on different
networks, logging into the **same machine**. Almost every interesting thing you
will learn today comes from comparing your results to the person next to you.

::: warning

Onyx is a shared production machine owned by the department. Bind listeners to
`127.0.0.1`, never `0.0.0.0`. Kill everything you start. Do not scan the machine,
poke at other users' processes, or read files that are not yours. That is an
academic integrity violation and a violation of the university acceptable use
policy.

:::

## Before you start

- **Groups of 3 or 4.** Mix operating systems if you can. A table that is all
  macOS gets less out of Round 5.
- **Pick a scribe.** The scribe owns the worksheet at the bottom of this page and
  submits it to Canvas for the whole group at the end of class. Put everyone's
  name on it.
- **Pick a timekeeper.** The round times below are real. If a round runs long,
  write down where you got stuck and move on. An honest "we got as far as X" is
  worth more points than a blank section.
- Everyone works on their own laptop. This is not a driver and navigator activity,
  because the whole point is that your machines differ.

You need a terminal with an SSH client. macOS and Linux already have one. On
Windows use PowerShell (which ships with OpenSSH), WSL, or Git Bash. If your
machine will not cooperate, pair with someone and say so on the worksheet.

## Round 1 - Get on the box (10 minutes)

Every member, from your own laptop:

```bash
ssh <username>@onyx.boisestate.edu
```

Then, on Onyx:

```bash
uname -a          # what is this machine running?
nproc; free -h    # how big is it?
who | wc -l       # how many other people are logged in right now?
```

Help each other. The two failures you will hit are a Windows machine with no SSH
client on `PATH`, and a typo in the user name. Record on the worksheet who got in,
on what OS, with what client.

::: tip Checkpoint

Everyone who can log in has, and you have written down how many other users were
on the machine with you.

:::

## Round 2 - Four laptops, one destination (20 minutes)

This is the round that needs a group. Each member runs the same three commands
**from their own laptop**, and the scribe collects the answers into the comparison
table on the worksheet.

```bash
dig onyx.boisestate.edu          # Windows: nslookup onyx.boisestate.edu
ping -c 5 onyx.boisestate.edu    # Windows: ping -n 5 onyx.boisestate.edu
traceroute onyx.boisestate.edu   # Windows: tracert onyx.boisestate.edu
```

Also grab, from your own laptop:

```bash
ipconfig getifaddr en0    # macOS. Linux: ip addr | grep inet. Windows: ipconfig
curl -s ifconfig.me       # the address the rest of the Internet sees
```

Now answer these as a group. Argue about them, they are the point of the round.

1. Did everyone resolve `onyx.boisestate.edu` to the **same** IP address? Is that
   address public, or private per RFC 1918?
2. Compare the address your laptop assigned itself to the address `ifconfig.me`
   reported back. Are they the same? For whom are they different, and what box
   between you and the Internet is responsible? What does that imply about whether
   anyone can open a connection *to* your laptop?
3. How many hops did each member see? Who has the most, and what is different about
   their network? What is a hop, in terms of the layer we are talking about?
4. Compare minimum round trip times. Boise State sits roughly 25 km from downtown
   Boise, and light in fiber travels about 2 x 10^8 m/s. Compute the propagation
   delay floor for that distance and compare it to your measured minimum. Where is
   the rest of the time going?
5. Compare the **minimum** and **maximum** RTT in your own ping output. What causes
   the spread? Name the delay component.

Now try it in the other direction. From Onyx, traceroute back to one member's
laptop address from question 2. Report what happens and explain it using your
answer to question 2.

::: tip Checkpoint

The comparison table has a row for every member, and your group can explain why the
hop counts differ.

:::

## Round 3 - Stop typing your password (15 minutes)

Each member, on your own laptop:

```bash
ssh-keygen -t ed25519 -C "you@boisestate.edu"
ssh-copy-id <username>@onyx.boisestate.edu
```

If `ssh-copy-id` is missing, append `~/.ssh/id_ed25519.pub` to `~/.ssh/authorized_keys`
on Onyx by hand. SSH ignores the file if the permissions are loose, so on Onyx:

```bash
chmod 700 ~/.ssh
chmod 600 ~/.ssh/authorized_keys
```

Then create `~/.ssh/config` on your laptop, so `ssh onyx` is all you ever type again:

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

`chmod 600 ~/.ssh/config`, then confirm `ssh onyx uname -n` works with no password.

The last three lines turn on connection multiplexing: the first connection stays
open and later ones reuse it instead of paying for a new TCP handshake and a new
key exchange. Measure it, on every laptop:

```bash
ssh -O exit onyx 2>/dev/null   # tear down any existing master
time ssh onyx true             # cold: full setup
time ssh onyx true             # warm: reuses the open connection
```

Put both numbers in the comparison table next to that member's RTT from Round 2.
Then answer as a group: **whose speedup was largest, and why?** Your minimum RTT is
sitting in the same row. Setup costs a handful of round trips, so estimate how many
round trips the cold connection spent, given the RTT you measured.

::: tip Checkpoint

Every member logs in with no password, and your group can explain the cold and warm
timings in units of round trips rather than in seconds.

:::

## Round 4 - It is a shared machine (10 minutes)

**Collision.** Two members, at the same time, on Onyx:

```bash
python3 -m http.server 8080 --bind 127.0.0.1
```

One of you gets `OSError: [Errno 98] Address already in use`. Write down which
member won and what the loser saw. This is the bug you would otherwise hit alone,
at midnight, in P1.

**A port of your own.** Each member picks a port derived from their user id, so no
two of you collide:

```bash
PORT=$((10000 + $(id -u) % 20000))
echo "$PORT"
ss -ltn | grep ":$PORT" || echo "free"
```

**Loopback is not private.** One member starts a server on their own port, bound to
loopback:

```bash
mkdir -p ~/loopback-demo && cd ~/loopback-demo && echo "hello from <name>" > hello.txt
python3 -m http.server "$PORT" --bind 127.0.0.1
```

A **different** member, logged into Onyx in their own session, runs:

```bash
curl http://127.0.0.1:<their PORT>/hello.txt
```

It works. Explain on the worksheet why `127.0.0.1` did not protect that server from
another user, and what it *did* protect it from.

**Bring it home.** That second member now forwards the port to their own laptop:

```bash
ssh -N -L 9000:127.0.0.1:<their PORT> onyx
```

Open `http://localhost:9000/` in a browser and screenshot it. Describe which process
opens which connection, and where the traffic is encrypted.

Then kill the server and confirm with `ss -ltn` that nothing of yours is left
listening. Leaving a process running on a shared machine is how you end up in
somebody's incident report.

## Round 5 - Build the devbox script (15 minutes)

You now want to edit code on your laptop and build it on Onyx without a pile of
`scp` commands. Everyone copy this into `devbox.sh` in a scratch directory, then
fill in the three TODOs as a group. One person can drive the editing while the
others read the man pages, but **every member runs the finished script from their
own laptop**, because Round 5 is also a portability test.

```bash
#!/usr/bin/env bash
set -eu

HOST="${ONYX_HOST:-onyx}"
PROJECT="$(basename "$PWD")"
REMOTE="cs425/$PROJECT"

usage() {
    cat <<EOF
usage: devbox.sh <command>
  sync          copy this directory to $HOST:$REMOTE
  run "<cmd>"   run <cmd> in the remote project directory
  check         sync, then build and test on $HOST
  shell         interactive shell in the remote project directory
EOF
}

case "${1:-}" in
sync)
    ssh "$HOST" "mkdir -p '$REMOTE'"
    # TODO 1: rsync this directory to $HOST:$REMOTE, excluding build/ and .git/.
    # Watch the trailing slash on the source path, it changes what gets nested.
    ;;
run)
    [ $# -eq 2 ] || { usage; exit 2; }
    # TODO 2: run "$2" in $REMOTE on $HOST, and make this script exit with the
    # status the remote command exited with. A wrapper that always exits 0 is
    # worse than no wrapper, because you will trust it.
    ;;
check)
    # TODO 3: sync, then run the build and the tests remotely, so that a failing
    # test on Onyx is a failing exit status here.
    ;;
shell)
    ssh -t "$HOST" "cd '$REMOTE' && exec \$SHELL -l"
    ;;
*)
    usage
    exit 2
    ;;
esac
```

Prove it works. In the scratch directory, `make` something trivial or just use
`false`:

```bash
./devbox.sh run "true";  echo "exit: $?"    # expect 0
./devbox.sh run "false"; echo "exit: $?"    # expect non-zero
```

Then, as a group, run the same script from each member's laptop and record on the
worksheet whether it behaved identically. If one operating system broke it, write
down the exact error and what was different. That difference is the same reason
your projects have to build on both Codespaces and Onyx.

## If you finish early

Your remote shell is a child of the SSH connection, so when the connection drops
your build dies with it. Start a `tmux` session on Onyx, run something long, close
your laptop's terminal window outright, reconnect, and reattach:

```bash
tmux new -s cs425
# Ctrl-b d detaches. Then, after reconnecting:
tmux attach -t cs425
```

Write down what tmux changes about the process tree such that the work survives a
dead TCP connection.

## Worksheet

Copy this into a document, fill it in as you go, and submit it before you leave.
Paste command output as text, not as screenshots of text. The one screenshot you do
need is the forwarded port in a browser from Round 4.

```
Group members:
Round 1 - who got in, on what OS and client. Users logged in at the time:

Round 2 - comparison table
| Member | OS | Network (wifi/ethernet/hotspot/VPN) | Local IP | Public IP | Onyx IP | Hops | RTT min/avg/max | Cold ssh | Warm ssh |
|--------|----|-------------------------------------|----------|-----------|---------|------|-----------------|----------|----------|

Round 2 answers, questions 1 through 5, plus what happened tracerouting from Onyx
back to a laptop, and why:

Round 3 - who saw the largest cold-to-warm speedup, and roughly how many round
trips the cold connection spent, given that member's RTT:

Round 4 - who won the port collision and what the loser saw. Why 127.0.0.1 did not
keep another Onyx user out, and what it did keep out. Screenshot of the forwarded
port:

Round 5 - your three TODOs, the exit statuses of the true and false runs, and any
operating system where the script behaved differently:

Stretch - what tmux changes about the process tree:
```

## Rubric

| # | Criterion | Points |
| - | --------- | ------ |
| 1 | Every member logged into Onyx, or the failure and the workaround are documented | 3 |
| 2 | The comparison table is filled in for every member of the group | 5 |
| 3 | Round 2 answers are correct: shared name resolution, NAT and the private address, hops, and the propagation delay floor computed from the distance | 4 |
| 4 | Key based login works for every member, and the cold and warm timings are explained in round trips | 3 |
| 5 | Port collision reproduced, and the group explains why loopback on a shared machine kept out the Internet but not each other | 3 |
| 6 | `devbox.sh` TODOs completed, exit status propagates, and the script was run from more than one operating system | 2 |

## Instructor Notes

Instructor note, not shown to students.

**Setup.** Confirm before class that every enrolled student has an Onyx account,
and have two or three spare accounts ready. A student with no account is dead in
the water for Rounds 1, 3 and 4, and the only fix in the moment is to pair them.

**Timing.** The rounds add to 70 minutes, which leaves nothing. If the period is
50 minutes, run Rounds 1 through 3 on the first day and Rounds 4 and 5 on the
second, and split the worksheet at the same seam.

**Where it goes wrong.**

- Windows without OpenSSH on `PATH`. Fastest fix is Git Bash. Do not spend class
  time on WSL installs.
- `ssh-copy-id` does not ship on Windows. Have the manual `authorized_keys`
  procedure on the board before Round 3 starts.
- If the campus network hands every laptop the same NAT gateway, Round 2 gets less
  interesting. Ask one student to tether to a phone so the table has one genuinely
  different vantage point.
- `traceroute` from Onyx back to a laptop hangs rather than failing cleanly. Tell
  them to `Ctrl-c` after a few stars rather than waiting it out. The stars are the
  answer.

**The three answers worth harvesting at the end.** Round 2 question 2 sets up NAT
in chapter 4. Round 3 sets up the handshake round trip count in chapter 3. Round 4
loopback sharing sets up the whole idea that an address is a property of an
interface on a host, not a property of a user.
