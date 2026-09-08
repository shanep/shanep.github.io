# Course Introduction

## What this course is about

By the end of the semester you should be able to answer, in detail, what happens
when you type a URL into a browser and press enter. That question sounds like an
interview cliché, and it is, but answering it completely requires every layer of
the stack: DNS, DHCP, ARP, Ethernet, IP, routing, TCP, TLS, and HTTP. We spend
fifteen weeks building up to it, and chapter 6 ends with exactly that walkthrough.

## Top-down

We work top-down, following Kurose and Ross. We start at the application layer,
where you already have intuition, because you have written programs that make HTTP
requests. Then we go down a layer and ask how those requests got delivered, and
down again to ask how the delivery was made reliable, and so on until we reach the
wire.

The alternative, bottom-up, means spending five weeks on signal encoding before you
see anything you recognize. Top-down means every layer answers a question the
previous layer left open.

## What you will build

Five projects, all in C:

| Project | Topic | Layer |
| ------- | ----- | ----- |
| P0 | Compile, test, debug | none, it is a toolchain check |
| P1 | Simple mail client | application |
| P2 | Reliable data transfer | transport |
| P3 | Subnetting and forwarding | network |
| P4 | Packet capture and analysis | link and up |

The projects deliberately track the chapters, so each one lands the week after the
material it depends on.

## Why C

Because the interfaces you are learning about are C interfaces. The socket API is
a C API, packet headers are C structs, and every RFC you read assumes you are
thinking in bytes. A higher level language would hide exactly the details this
course is about.

## Ground rules

- **Your code must build on both Codespaces and Onyx.** Not one or the other. This
  is the rule students lose the most points to, and it is not negotiable, because
  portability is a learning objective.
- **Use AI freely.** You are encouraged to. It will not save you on the exams,
  which are where half your grade lives, so use it to move faster on the projects
  and spend the time you save on understanding the material.
- **Ask early.** Office hours exist and are usually empty.

## Course logistics

Read the [syllabus](../) and the [schedule](../schedule/). The grade breakdown,
the late work policy, and the university policies are all there, and you are
responsible for them.
