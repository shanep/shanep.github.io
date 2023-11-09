# Why This Class?

This class is important because your code will be running on some sort
of computing device and you will need to know how an operating system
works in order to write good code and solve hard problems.

In this course we will explore what an operating system is and its
purpose. In the simplest terms an operating system is just a program
that runs other programs. The operating system provides an abstraction
that allows programmers to think in a higher level and not have to worry
(as much) about how things actually get done. Instead of issuing
commands to the hard disk to position the read head you can just call
[fopen](https://www.cplusplus.com/reference/cstdio/fopen/) and start
reading bytes.

# Introductions 👋

-   Name

    -   Major - if something other than CS

-   Grad or Undergraduate

-   Share One cool thing about yourself

# Textbook 📔

-   [Operating Systems: Three Easy
    Pieces](https://pages.cs.wisc.edu/~remzi/OSTEP/)

-   [Code Examples](https://github.com/shanep/ostep-code)

# Virtualization

<figure>
<img src="images/matrix.webp" alt="matrix" />
</figure>

Everything you have been taught is a lie!

## Virtualizing the CPU

An operating system gives the illusion that you can run multiple
processes at once. In reality you can only run one process (per core) at
a time. The operating system and cpu switch so fast that we perceive
things happening all at once. This is similar to how a movie is really
just a bunch of pictures shown in rapid succession, our brains perceive
motion when there is none!

## Virtualizing Memory

Most modern machines use a flat memory model, which means the machine
represents memory as a big array. The operating system with assistance
from hardware such as a memory management unit (MMU) and the translation
lookaside buffer (TLB) creates a virtual memory address space to give
the illusion that each process has access to 100% of the machine memory.

The operating system is also responsible for protecting processes from
each other. You don’t want your errant program that has a segfault to
take down your entire machine!

# Concurrency

<figure>
<img src="images/concurrency.png" alt="production" />
</figure>

Concurrency is typically introduced in an Operating System class in a
traditional CS curriculum because the operating system is responsible
for scheduling processes to run on the CPU. Languages like golang extend
the threading concept by multiplexing multiple user space threads onto
one (or more) operating system threads.

Concurrency adds a whole bunch of new problems that you have to deal
with when writing high performance programs. We will look at how to use
mutexes, semaphores, and pthreads and the common problems that result
such as race conditions and deadlocks.

# Persistence

<figure>
<img src="images/ancient-greek-language.jpg" alt="stone" />
</figure>

At some point you are going to need to save data. An operating system
provides abstractions that allow you to persist data to non-volatile
storage without having to worry about the specific medium that a machine
may have. For example, saving data to a hard disk drive (hdd) is the
exact same operation as saving to a solid state drive (ssd). Under the
hood however the hardware is very different and requires different
drivers. The operating system allows you to treat to very different
pieces of hardware in exactly the same way!

# Beyond Linux, MacOS, Linux

A small collection of research, hobby, and production operating systems.
Some of these are in active development some have been abandoned years
ago.

## Monolithic POSIX/Unix Kernel

-   [Biscuit](https://www.usenix.org/system/files/osdi18-cutler.pdf) -
    an operating system written in the Go programming language.

-   [Arrakis](https://arrakis.cs.washington.edu/) - a nano-kernel
    operating system.

-   [Redox](https://www.redox-os.org/) - a Unix like kernel written in
    the [rust](https://www.rust-lang.org/) programming language.

-   [Barrelfish](http://www.barrelfish.org/) - a research operating
    system built from scratch

## Unikernel

-   [Mirage OS](https://mirage.io/) - A Unikernel operating system
    written in the [ocaml](https://ocaml.org/) programming language.

## NT (Win32)

-   [ReactOS](https://reactos.org/) - A kernel that aims for binary
    compatibility for NT (Windows) kernels

## Teaching OS

-   [xv6](https://pdos.csail.mit.edu/6.828/2014/xv6/book-rev8.pdf) - a
    clone of Unix v6

-   [minix3](https://www.minix3.org/) - A micro kernel written by
    Andrew S. Tanenbaum et al for teaching operating systems

## Written in D

-   [PowerNex](https://github.com/PowerNex/PowerNex)

-   [XOmB](https://github.com/xomboverlord/xomb/tree/unborn) - Exokernel

-   [Trinix](https://github.com/Rikarin/Trinix) - Micro kernel
    architecture

## Written in x86 ASM

-   [MenuetOS](http://menuetos.net/)

## Production Operating Systems

-   [WinWorld](https://winworldpc.com/library/operating-systems)

# Linux in the Browser

-   [JSLinux](https://bellard.org/jslinux/index.html)
