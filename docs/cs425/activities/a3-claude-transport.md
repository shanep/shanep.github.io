---
next: false
prev: false
---

# A3 - Interrogating the Transport Layer with Claude Code

**Week 6 · 20 points · pass/fail · one paper worksheet per group, turned in before you leave**

## Why you are doing this

Chapter 3 makes a handful of claims about TCP and UDP that are easy to memorize
and easy to get wrong on an exam: a UDP socket is named by two things and a TCP
socket by four; somebody is left holding `TIME_WAIT` after a close; TCP moves a
stream of bytes and UDP moves messages. Today you **watch each one happen** on a
real machine instead of taking the book's word for it.

I drive, on the projector, with **Claude Code**: an AI agent that runs in a
terminal, writes code, and runs commands when you let it. It writes the small
programs we need in seconds, which leaves the period for the part that matters:
predicting what the network will do, running it, and checking whether the
agent's explanation matches what actually happened. It is often right. It is
sometimes confidently wrong, and catching that is half of today.

Then it is your turn. In the last round your group repeats a step on your own
laptop with whichever command line coding agent you use, and checks its
arithmetic against the chapter.

::: tip Any command line agent works

I use Claude Code, but for your group's turn **any AI coding agent that runs in a
terminal** is fine: Claude Code, GitHub Copilot CLI, OpenAI Codex CLI, Gemini CLI,
or similar. It has to be the command line tool, not a chat window in a browser,
because the point is an agent that writes files and runs commands on your machine
and asks you first. If yours is not Claude Code, **write down how your results
differ from mine**; that comparison is part of Round 4.

Do not pay for anything. Copilot CLI is free with the GitHub Education benefit,
and you do not need any agent installed to pass today.

:::

::: warning

This is a paper activity. Your group turns in **one filled out worksheet, on
paper, before you leave the room**. Copies are handed out in class.

It is graded pass/fail. Every round attempted in good faith is a pass, and a
wrong prediction costs you nothing. Write the prediction down **before** I run
anything; a prediction written afterwards is not a prediction.

:::

## Before you start

- **Groups of 3 or 4.** One scribe owns the worksheet and puts everyone's name on
  it.
- **Rounds 1 to 3 happen on the projector.** Keep your laptop closed until Round
  4; you are predicting and checking, not typing.
- **Round 4 needs one laptop per group with a command line coding agent
  working**, such as Claude Code or Copilot CLI. If nobody in your group has one
  yet, that is fine: do Round 4 by hand, and I will ask Claude the same
  questions on the projector at the end so you can compare.

## How every round works

Each of the first three rounds is the same four beats, and the worksheet has a box
for each:

1. **Predict.** I read the question. Your group writes an answer.
2. **Prompt.** I give Claude the prompt on this page, and you read each action
   it asks permission for before I approve it.
3. **Run.** I run the program and a socket listing tool, and you write down what
   you see.
4. **Check.** Was your prediction right? Was Claude's explanation right? Which
   section of chapter 3 says so?

## Round 0 - Meet the agent

I start Claude Code in an empty directory:

```bash
mkdir a3-demo
cd a3-demo
claude
```

Watch for two things, and note them on the worksheet:

- Claude asks whether you **trust the files in this folder**. Why is "yes" safe
  here and dangerous in your home directory?
- Every time it wants to create a file or run a command, it **asks first**. What is
  the difference between approving one action and telling it not to ask again?

## Round 1 - Demultiplexing: two tuples and four tuples

*Section 3.2.*

**Predict.** A program opens a TCP socket **and** a UDP socket, both on port 5425.
Will the second one fail with "address already in use"? Then two TCP clients and
two UDP clients connect. How many sockets will the server process hold?

**Prompt.**

> Write a Python 3 program `echo.py`, standard library only, that runs a TCP echo
> server and a UDP echo server at the same time, both on 127.0.0.1 at a port given
> on the command line. For every TCP connection and every UDP datagram, print the
> client's IP address and port.

**Run.** One terminal runs the server; two more are TCP clients, and two send one
UDP datagram each:

```bash
python3 echo.py 5425
nc 127.0.0.1 5425                   # in two separate terminals, leave them open
echo hi | nc -u -w1 127.0.0.1 5425  # twice
lsof -nP -i :5425
```

**Check.** Count the lines in the `lsof` output that belong to the Python process,
by protocol. Chapter 3 says a UDP socket is identified by a two-tuple and a TCP
socket by a four-tuple. Point at the exact lines on the screen that show it.

## Round 2 - Connection management: who is left holding TIME_WAIT

*Section 3.5.6.*

**Predict.** One TCP client presses `Ctrl-C`. After the connection closes, which
side is left in `TIME_WAIT`, the client or the server? For roughly how long?

**Prompt.** This time I ask Claude to predict too, before anything runs:

> I am about to close one of the TCP clients connected to echo.py. Which side of
> that connection will end up in TIME_WAIT, for how long, and why does TCP need
> that state at all?

**Run.**

```bash
netstat -an -p tcp | grep 5425      # macOS
ss -tan | grep 5425                 # Linux
```

Then I do it the other way round: stop the **server** first, while a client is
still connected, and start it again immediately.

**Check.** Did the restart work? Ask Claude why, and then read `echo.py` for
`SO_REUSEADDR`. Did Claude set it without being asked, and did its explanation of
what it does match what you just saw?

## Round 3 - A byte stream is not a message

*Sections 3.3 and 3.5.2.*

**Predict.** A client calls `send` three times in a row, with `one`, `two` and
`three`, and the server calls `recv` in a loop. How many `recv` calls return data
over TCP? Over UDP?

**Prompt.**

> Change the TCP side of echo.py to wait one second after accepting a connection
> before its first recv. For both TCP and UDP, print every recv on its own line
> with its length and the bytes received.
> Then write `burst.py`, which sends "one", "two" and "three" as three separate
> sends with no delay, first over TCP and then as three UDP datagrams to the same
> port.

**Run.**

```bash
python3 echo.py 5425
python3 burst.py 5425
```

**Check.** Chapter 3 says TCP delivers a **byte stream**. Explain what the server
printed using that phrase. Then connect it to P1: why did your SMTP client have to
look for `\r\n` instead of trusting that one `recv` is one reply?

## Round 4 - Your turn

Now your group drives. One laptop running your command line agent, whichever one
you use, and everyone else checking. Start it in a new, empty directory, exactly
as in Round 0, and write down which agent it is.

**Part A: repeat a step.** Pick one of Rounds 1 to 3 and give your agent the
prompt **in your own words**. Run it on your laptop. Is its code the same as what
was on the projector? Does it behave the same? If you are not using Claude Code,
note how your agent differed from mine: the code it wrote, what it asked
permission for, and how it explained itself. On Windows, use `netstat -an`
instead of `lsof`; WSL works too.

**Part B: check its arithmetic.** Ask your agent each question below, then work it out
by hand from the chapter. Write both answers on the worksheet. Where they disagree,
find out who is wrong. If your agent is not Claude Code, I will put Claude's
answers on the projector at the end: note where the two agents disagreed.

1. **UDP checksum.** Three 8-bit words: `01010011`, `01100110`, `01110100`. What
   is their one's complement sum, and what is the checksum?
2. **Stop-and-wait.** A 1 Gbps link, a 30 ms round trip, 1000 byte packets. What
   is the sender's utilization? How many packets would have to be in flight to
   reach 90%?
3. **Timeout.** `EstimatedRTT` is 100 ms, `DevRTT` is 5 ms, and the next
   `SampleRTT` is 120 ms, with α = 0.125 and β = 0.25. What is the new
   `TimeoutInterval`? Ask the agent which `EstimatedRTT` it used when it updated
   `DevRTT`, the old one or the new one.

::: tip Checkpoint

Every round has a prediction, an observation, and a verdict on the agent. Round 4
has both answers to all three questions, whether or not they agree.

:::

## If you finish early

Ask your agent to explain the difference between the `TIME_WAIT` duration on macOS
and on Linux, then check it with `sysctl net.inet.tcp.msl` on a Mac. What does MSL
stand for, and why is `TIME_WAIT` twice as long?

## Worksheet

**Download: [a3-worksheet.pdf](./a3-worksheet.pdf)**

The printed worksheet handed out in class is what you fill in and turn in. It has a
predict, observe and check box for Rounds 1 to 3, and both answers for each Round 4
question.

## Instructor Notes

Instructor note, not shown to students.

**Print the worksheet.**

```bash
./scripts/cs425/a3-claude-transport.sh handout
./scripts/cs425/a3-claude-transport.sh key
```

**Set up before class.** Run the demo on the Mac in Claude Code, logged in. Font size up; three or four terminal tabs. Rehearse it once the
night before and **keep that rehearsal's `echo.py` and `burst.py`** in a spare
directory: if the wifi or Claude fails in the room, switch to them and keep going,
because the networking is the lesson and the agent is the vehicle.

**Why it is shaped like this.** Claude writes the scaffolding and the class spends
its time on the predictions. It deliberately never touches reliable data transfer:
rdt, Go-Back-N and stop-and-wait code are P2, due Oct 9, and a projector full of a
working sender would be the answer key. Round 4's utilization question is
arithmetic about stop-and-wait, not code.

**Pacing,** for about 70 minutes: Round 0 five, Round 1 fifteen, Round 2 fifteen,
Round 3 ten, Round 4 twenty, five to collect. If time runs short, cut Round 4 Part
A, not Part B. Leave two minutes at the end to put Claude's Part B answers on the
projector, for the groups by hand and the groups on another agent.

**Driving Claude Code.**

- **Approve one action at a time**, and read each request aloud. Do not pick
  "don't ask again" and do not start it with `--dangerously-skip-permissions`;
  the room will copy what you do.
- **Say the prediction out loud before approving the run.** Otherwise groups fill
  in "Predict" after the fact.
- **If Claude's code does something unexpected**, do not fix it silently; that
  is the best material of the day. Ask the room what went wrong first.

**What the room should see.** Rehearsed on this Mac on Sep 27, with the prompts on
this page given to Claude Code word for word and its own `echo.py` and `burst.py`
run with the commands on this page.

**Use port 5425, not 5000.** macOS's AirPlay Receiver (ControlCenter) listens on
`*:5000`. The demo still binds, since `127.0.0.1` is more specific, but its two
sockets clutter Round 1's `lsof` listing. Claude suggests 5000 on its own when it
finishes `echo.py`; ignore that, or turn the collision into a question about
which socket a segment to `127.0.0.1:5000` is delivered to.

- **Round 1.** Both binds succeed; TCP and UDP ports are separate namespaces.
  `lsof` shows the Python process holding one `TCP (LISTEN)`, one `TCP` line per
  client with its own `127.0.0.1:5425->127.0.0.1:<port>` four-tuple, and exactly
  **one** `UDP 127.0.0.1:5425` no matter how many UDP clients sent. The server
  prints a different source port for each UDP datagram, all arriving on that one
  socket.
- **Round 2.** The side that closes first is left in `TIME_WAIT`, so after the
  client's `Ctrl-C` it is the **client's** ephemeral port. macOS holds it for about
  30 seconds (`net.inet.tcp.msl` is 15000 ms, and TIME_WAIT is 2 MSL; it measured
  32 s with timer slack); Linux holds it for 60. With the server stopped first, the **server** side holds it, and a
  restart without `SO_REUSEADDR` fails with `[Errno 48] Address already in use`.
  Claude set `allow_reuse_address = True` on its `socketserver` class unasked
  in rehearsal, in which case the restart works;
  ask it why the line is there. If it did not add it, the failure is the lesson.
- **Round 3.** TCP: one `recv` of 11 bytes, `onetwothree`. UDP: three
  datagrams, 3, 3 and 5 bytes. One rehearsal's code also printed a `recv` of 0
  bytes, which is the client's FIN arriving; if it shows up, ask the room what it
  is. Before the prompt said "for both TCP and UDP", Claude logged only the
  client address for each datagram, not its length. Without the one second sleep
  the TCP result varies from run to run on loopback, which is why the prompt asks
  for it.

**Round 4 answers.**

1. `01010011 + 01100110 = 10111001`; `+ 01110100 = 1 00101101`, wrap the carry
   to get `00101110`. The checksum is its complement, **`11010001`**.
2. `L/R` is 8 µs, so `U = 0.008 / 30.008 ≈ 0.00027`, about 0.027%. 90% needs
   `0.9 × 30.008 / 0.008 ≈ 3376` packets in flight; 3375 if the `L/R` term is
   dropped from the denominator, which is also fine.
3. `EstimatedRTT = 0.875 × 100 + 0.125 × 120 = 102.5 ms`. With the **new**
   estimate, `DevRTT = 0.75 × 5 + 0.25 × |120 − 102.5| = 8.125` and the timeout is
   **135 ms**. With the **old** estimate (RFC 6298's order), `DevRTT = 8.75` and
   the timeout is **137.5 ms**. The book's equations do not settle the order, so
   both are right if the group can say which order they used. The point is whether
   the agent says which one it picked. In rehearsal Claude used the old estimate,
   137.5 ms, cited RFC 6298, and gave 135 ms as the alternative unprompted; all
   three of its answers matched this key.

**Grading.** Pass/fail, full 20 or nothing, no rubric in Canvas. A pass is every
round with a prediction and an observation written in, and Round 4 attempted,
by hand or with any command line agent. Differences from Claude Code are
something to write down, never something that costs a group the pass.

**What this sets up.** Round 3's UDP half is the datagram service P2 is built on,
and Round 4 Part B is exam-style arithmetic from sections 3.3, 3.4 and 3.5.
