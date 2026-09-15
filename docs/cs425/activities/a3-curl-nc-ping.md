---
next: false
prev: false
---

# A3 - curl, nc, and ping

**Week 5 · 20 points · pass/fail · one paper worksheet per group, turned in before you leave**

## Why you are doing this

In A1 you learned to read one tool, `dig`. Today you learn three more, and by the
end of the period you will have every instrument you need for A4, where you point
them at machines that are deliberately broken and work out what is wrong.

The three are not equal, and the point of today is to feel the difference:

- `curl` speaks **HTTP**. It shows you both halves of a web conversation and,
  more usefully, tells you where the time went.
- `nc` speaks **nothing**. It opens a connection and moves bytes, so **you** have
  to be the protocol. That is exactly what P1 asked you to write, which is why it
  is the best debugging tool you will meet.
- `ping` does not speak an application protocol at all. It lives a layer down,
  and by the end of Round 3 you will be able to say exactly why that makes it the
  least trustworthy of the three.

Everyone works on **Onyx**, the same as A1. Log in with `ssh onyx`; if that still
asks for a password, A2 did not take and the person next to you can fix it in a
minute.

::: warning

This is a paper activity. Your group turns in **one filled out worksheet, on
paper, before you leave the room**. Copies are handed out in class, and the same
worksheet is at [a3-worksheet.pdf](./a3-worksheet.pdf).

It is graded pass/fail. Every round attempted in good faith is a pass, and being
wrong about what a switch did costs you nothing as long as you wrote down what
you actually saw.

:::

## Before you start

- **Groups of 3 or 4.** One scribe owns the worksheet and puts everyone's name on
  it.
- Every command below runs **on Onyx**, not on your laptop.
- Round 2 needs two members in two separate Onyx sessions at the same time.

## Round 1 - `curl`: HTTP, and where the time goes

HTTP is the application layer protocol you use most. `curl` speaks it, and `-v`
shows you both halves of the conversation:

```bash
curl -v http://example.com/
```

Lines starting with `>` are what your machine **sent**. Lines starting with `<`
are what the server **replied**. Find the request line, the `Host:` header, the
status line, and the `Content-Type`, and write them down.

### The switches that matter

| Command | What to notice |
| ------- | -------------- |
| `curl -I http://example.com/` | Headers only, no body |
| `curl -s http://example.com/` | Silent: no progress meter |
| `curl -sS http://example.com/` | Silent, but still show errors |
| `curl -o /dev/null http://example.com/` | Throw the body away |
| `curl -I http://www.boisestate.edu/` | Look at the status code |
| `curl -IL http://www.boisestate.edu/` | Follow the redirects, see each hop |
| `curl -H 'User-Agent: cs425' -v http://example.com/` | Send your own header |
| `curl --connect-timeout 3 -m 5 http://example.com/` | Bound the wait |
| `curl -4 http://example.com/` | Force IPv4 |

### Where the time actually goes

This is the single most useful thing `curl` does, and it is what is inside the
`probe` function you put in `~/.bashrc` in A2. `-w` prints a report after the
transfer, and the timing variables split one request into its layers:

```bash
curl -o /dev/null -s -w 'dns=%{time_namelookup} connect=%{time_connect} tls=%{time_appconnect} ttfb=%{time_starttransfer} total=%{time_total} code=%{http_code}\n' https://www.boisestate.edu/
```

On the worksheet, record all six numbers and then answer:

1. Which phase took the longest?
2. `dns` is name resolution and `connect` is the TCP handshake. What is happening
   between `connect` and `ttfb`?
3. Run it against `http://` instead of `https://`. Which number collapses to zero,
   and what does that tell you about what `tls` was measuring?

Those five timings are the layer model, printed by a program, on one line. Now
run `probe example.com 80` and `declare -f probe`, and say on the worksheet which
two of the five your function reports.

::: tip Checkpoint

Your group can name what each of the five timing numbers measures, and has
explained what changed when TLS went away.

:::

## Round 2 - `nc`: be the client yourself

`nc` does not know any application protocol. It opens a TCP connection and moves
bytes. That is what makes it the most useful debugging tool you will meet,
because **you** get to be the protocol.

First, the port check you will use constantly in A4:

```bash
nc -vz onyx.boisestate.edu 22     # something is listening
nc -vz onyx.boisestate.edu 9      # nothing is
```

Write down, word for word, what each one printed and roughly how long each took.
Those two messages are two completely different failures and telling them apart
is most of A4.

### Speak HTTP by hand

Now type the protocol yourself:

```bash
{ printf 'GET / HTTP/1.1\r\nHost: example.com\r\nConnection: close\r\n\r\n'; sleep 3; } \
    | nc example.com 80
```

You just sent an HTTP request without a browser or a client library.

**Why the `sleep 3`?** Onyx has `nmap-ncat`, and it closes the connection the
moment its standard input runs out. Without the sleep your request goes out and
`nc` hangs up before the reply arrives; run it that way once and read what `nc -v`
reports about bytes sent and bytes received. Holding stdin open for three seconds
gives the server time to answer.

On the worksheet:

1. What was the very first line the server sent back?
2. What happens if you drop the `Host:` header? Try it. HTTP/1.1 requires it.
3. Why `\r\n` and not `\n`? Change them to `\n` and see what the server does.

That last question is not academic. SMTP has the same rule, and `\n` for `\r\n`
was the single most common bug in P1. A terminal renders both identically, so
you cannot see the difference; you have to know it.

### Listen, and be listened to

You are all on the same machine, so one of you can be the server. Pick a port
above 10000 that nobody else is using:

```bash
PORT=$((10000 + $(id -u) % 20000)); echo "$PORT"
ss -ltn | grep ":$PORT" || echo "free"
nc -l 127.0.0.1 "$PORT"          # this blocks, waiting
```

A different member, in their own session on Onyx:

```bash
nc 127.0.0.1 <their PORT>
```

Type into one window; watch it appear in the other. Then `Ctrl-C`, and confirm
with `ss -ltn` that nothing of yours is still listening. Leaving processes on a
shared machine is how you end up in somebody's incident report.

::: tip Checkpoint

Your group has an HTTP response obtained without a browser, and can say what the
server did when the line endings were wrong.

:::

## Round 3 - `ping`: the one that is not an application tool

Everything above spoke an application protocol. `ping` does not. It sends an ICMP
echo request, which rides directly inside IP, and ICMP has no port numbers and no
concept of a service.

```bash
ping -c 5 onyx.boisestate.edu
```

That works, because Onyx is right there. Now try to ping the machine you fetched
a web page from twenty minutes ago in Round 1:

```bash
ping -c 3 example.com
```

**One hundred percent packet loss.** You have already had a `200 OK` out of that
host today. Write down both facts next to each other on the worksheet, because
together they are the entire point of this round, and of Round 3 in A4.

| Switch | What it does |
| ------ | ------------ |
| `-c 5` | Send five and stop, instead of forever |
| `-i 0.5` | Half a second between packets |
| `-s 1000` | Make the payload 1000 bytes |
| `-W 2` | Wait at most 2 seconds for each reply |
| `-w 5` | Give up entirely after 5 seconds |
| `-n` | Do not resolve names in the output |
| `-q` | Summary only |

Read the summary line: `min/avg/max/mdev`. Then answer, on the worksheet:

1. What layer does ICMP live at, and what does that mean about ports?
2. Onyx answers `ping`. Does that prove the SSH server on it is running?
3. `example.com` does **not** answer ping, and also served you a web page. So what
   exactly did the failed ping tell you? Name at least two different things that
   could produce that result.

Question 3 is the whole of A4's Round 3, and you now have the answer, from your
own terminal, a week early.

::: tip Checkpoint

Both ping results are on the worksheet side by side, and your group has named
more than one thing that could explain the failed one.

:::

## If you finish early

Write a second function, `probes`, in `~/.bashrc` on Onyx, that prints the full
five phase timing breakdown from Round 1 instead of the two numbers `probe`
reports. Then find out what `probe` says about a port that nothing is listening
on:

```bash
probe onyx.boisestate.edu 9
```

Compare that to what `nc -vz` said about the same port in Round 2.

## Worksheet

The printed worksheet handed out in class is what you fill in and turn in. It
covers, in order: the `curl` reading and phase breakdown; the two `nc` port
checks and the hand typed HTTP request; and the `ping` questions.

## Instructor Notes

Instructor note, not shown to students.

**Print the worksheet.**

```bash
./scripts/cs425/a3-curl-nc-ping.sh handout
```

No AWS involved; A3 needs no testbed, just Onyx.

**Say this before you hand out the sheet.** This is rounds 4, 5 and 6 of the
original seven round A1, which the room never reached. Assume nobody has read the
page. One minute at the board:

> Three weeks ago you learned to read `dig`. Today, three more tools, and then
> you have everything A4 needs. `curl` talks HTTP. `nc` talks nothing, so you have
> to. `ping` is the odd one out and you will see why. Three rounds, one sheet,
> write down what you see.

**What is actually on Onyx.** Measured while this was written:

| | |
| - | - |
| `curl` | 7.76.1, with OpenSSL 3.5.5 and nghttp2 |
| `nc` | **nmap-ncat 7.92**, at `/usr/bin/ncat` |
| `ping` | iputils 20210202 |
| outbound 80 / 443 | open |
| outbound ICMP | **blocked** |

Three consequences worth knowing before the room finds them:

- **`nc` is nmap-ncat, not the BSD one.** `-w` is the connect timeout, which is
  what you want, and `nc -l 127.0.0.1 PORT` works with no `-p`. It also **closes
  the connection as soon as stdin hits EOF**, so a bare
  `printf ... | nc host 80` sends the request and hangs up before the answer
  arrives, reporting `0 bytes received`. Round 2 wraps the printf in a brace group
  with a `sleep 3` for that reason, and asks students to explain it.
- **Outbound ICMP is blocked from Onyx**, so every host on the internet shows
  100% loss, including one that served a page in Round 1. That contradiction, on
  their own screen, twenty minutes apart, is the best thing in the activity and
  it costs ninety seconds. Do not cut it.
- **`probe` is missing for some students.** Anyone who was absent for A2 or
  whose `~/.bashrc` edit did not save gets `command not found` in Round 1. The
  function is in the A2 page; have them paste it at the prompt for today and fix
  the file later.

**Where it goes wrong.**

- **Round 2's listener.** Bind to `127.0.0.1`, never `0.0.0.0`, and make them
  kill it. It is a shared department machine.
- **The `\r\n` question.** Some servers tolerate bare `\n`, so a group may see
  "nothing changed". That is still a pass; the lesson is that they cannot tell
  from the terminal, and the key has the wording.
- **Groups skipping the switch tables.** Fine. The phase breakdown, the two `nc`
  messages, and the ping contradiction are the parts A4 depends on; the tables
  are reference.

**Grading.** Pass/fail, meant to be graded by flipping through the stack rather
than read closely. A pass is every round attempted with something real written in
it. Wrong answers about what a switch did still pass: the worksheet is a record of
what they observed. Canvas has no rubric attached, so award the full 20 or
nothing.

**Pacing.** Round 1 is twenty minutes, Round 2 is twenty five, Round 3 is ten.
If time is short, cut Round 3's switch table but **keep the `ping example.com`
demonstration**.

**What this sets up.** Round 1's timing breakdown is how A4 and A5 tell a
connection failure from an application stall. Round 2's refused versus timed out
is A4 stations 2 and 3. Round 3's question 3 is A4's Round 3, exactly.
