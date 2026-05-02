# Security

<SlideView />

## Introduction

- Pretty much everything runs on top of an operating system
- The OS is the ultimate target
- Subvert the OS and nothing else matters!

## What Are We Protecting?

An attacker who compromises the OS can:

- examine or alter any process's memory
- read, write, delete or corrupt any file
- change the scheduling or even halt execution of any process
- send any message to anywhere
- enable or disable any peripheral device
- give any process access to any other process's resources
- arbitrarily take away any resource a process controls
- respond to any system call with a maximally harmful lie

## TPM

- Trusted Platform Module — provides assurance that you are booting
  the version of the operating system you intended to, protecting you
  from attacks that try to boot compromised versions of the system.
- Not perfect — it raises the degree of difficulty but is not a
  silver bullet.

## Goals of the OS

- **Confidentiality** — If some piece of information is supposed to be
  hidden from others, don't allow them to find it out.
- **Integrity** — If some piece of information or component of a system
  is supposed to be in a particular state, don't allow an adversary to
  change it.
- **Availability** — If some information or service is supposed to be
  available for your own or others' use, make sure an attacker cannot
  prevent its use (denial of service).

## C Is Working Against Us

C gives programmers direct control over memory, which is powerful but
dangerous. Many of the most serious OS and application vulnerabilities
come from C's lack of automatic bounds checking.

### Buffer Overflow (Stack Smashing)

The classic C vulnerability. Writing past the end of a stack buffer
overwrites the saved return address, letting an attacker redirect
execution to arbitrary code.

```c
void vulnerable(char *input) {
    char buf[64];
    strcpy(buf, input);   // no length check — overflows if input > 64 bytes
}
```

If `input` is 128 bytes, `strcpy` writes past `buf`, over the saved
frame pointer, and over the return address. An attacker who controls
`input` controls where the function returns.

**Fix**: Use `strncpy`, `strlcpy`, or `snprintf` with explicit size limits.
Better: prefer `fgets` for user input. With AddressSanitizer (`-fsanitize=address`)
the compiler instruments every access and catches overflows at runtime.

### Format String Vulnerabilities

Passing user input directly as a `printf` format string lets an attacker
read or write arbitrary memory.

```c
// Dangerous: attacker controls the format string
printf(user_input);

// Safe: user input is always an argument, never the format
printf("%s", user_input);
```

With `%x` or `%p` specifiers an attacker can dump stack contents. With
`%n` (writes the number of bytes printed so far) an attacker can write
to arbitrary addresses. The fix is trivially simple: **never use a
variable as the first argument to printf**.

### Use-After-Free

Accessing memory through a pointer after it has been `free()`d. The
freed block may be reallocated to hold different data (or attacker-controlled
data), turning a logic bug into a security vulnerability.

```c
char *buf = malloc(64);
free(buf);
// ... some time passes, buf may be reallocated ...
strcpy(buf, user_input);   // use-after-free: undefined behavior / exploitable
```

AddressSanitizer detects use-after-free bugs. In production,
memory-safe allocators like jemalloc can make exploitation harder.

### Heap Overflow

Writing past the end of a heap allocation overwrites the `malloc` header
of the next block (recall the malloc header diagram). This can corrupt
the heap free list and lead to arbitrary write primitives — exactly
the kind of corruption your buddy allocator must guard against.

## Mitigations

Modern systems layer multiple defenses so that a bug alone is not
sufficient for exploitation — an attacker must defeat several
independent protections.

### Stack Canaries

The compiler inserts a random value (the "canary") between local
variables and the saved return address. Before a function returns, the
runtime checks that the canary is unchanged. A stack overflow that
overwrites the return address must also overwrite the canary; if the
canary has changed, the program aborts.

Enable with: `gcc -fstack-protector-all`

### Address Space Layout Randomization (ASLR)

The OS randomizes the base addresses of the stack, heap, and shared
libraries on every execution. An attacker who cannot predict where code
lives cannot write a reliable exploit.

Enable in Linux: `echo 2 > /proc/sys/kernel/randomize_va_space`

ASLR is most effective when combined with **PIE** (Position Independent
Executable), which also randomizes the text segment.

### Non-Executable Memory (NX / DEP / W^X)

Hardware enforces that a memory page is either **writable** or
**executable**, never both at the same time (the W^X policy). An
attacker who injects shellcode onto the stack cannot execute it because
the stack is marked non-executable.

Injected code attacks are instead replaced by **return-oriented
programming (ROP)**, which chains together existing executable code
gadgets — which is why ASLR is still necessary even with NX.

Enable with: `gcc -z noexecstack`

### RELRO (Relocation Read-Only)

Marks the Global Offset Table (GOT) and other ELF sections as
read-only after dynamic linking completes, preventing attackers from
overwriting function pointers in the GOT.

Enable with: `gcc -Wl,-z,relro,-z,now`

## Defense in Depth

No single mitigation is sufficient. Real systems combine:

| Mitigation     | What it stops                                  |
|----------------|------------------------------------------------|
| Canaries       | Stack-based return address overwrites          |
| ASLR + PIE     | Hardcodes addresses in exploits                |
| NX/DEP         | Injected shellcode execution                   |
| RELRO          | GOT overwrite attacks                          |
| AddressSanitizer | Catches bugs in development before they ship |

The goal is not to make exploitation impossible, but to make it
expensive enough that attackers move on to easier targets.

## Secure Programming Resources

- [SDL (Security Development Lifecycle)](https://www.microsoft.com/en-us/securityengineering/sdl/practices) — Microsoft's process for building secure software
- [CVE Database](https://www.cve.org/) — catalog of known vulnerabilities
- [Zerodium](https://zerodium.com/program.html) — market for zero-day exploits (shows real-world vulnerability value)
- [OWASP](https://owasp.org/) — practical secure coding guidance
