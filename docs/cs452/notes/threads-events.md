# Event Based Concurrency

<SlideView />

## Introduction

Threads are one way to handle concurrent work, but they come with real
costs: synchronization bugs, deadlocks, and the overhead of context
switching. **Event-based concurrency** is an alternative model used by
high-performance servers (nginx, Redis, Node.js) that achieves
concurrency with a single thread.

## The Core Idea: The Event Loop

Instead of blocking on I/O and letting the OS schedule another thread,
an event-driven program uses a loop that asks the kernel: "which of my
file descriptors are ready right now?" It then handles only the ones
that have data — no blocking, no wasted waits.

```c
while (1) {
    events = wait_for_events(fds, n_fds);   // block until something is ready
    for each ready fd in events:
        handle_event(fd);                   // process without blocking
}
```

Because only one handler runs at a time, there are **no race
conditions** and **no locks needed** — the single-threaded model gives
you concurrency without shared-state bugs.

## select() and poll()

The oldest interfaces for waiting on multiple file descriptors.

```c
#include <sys/select.h>

fd_set read_fds;
FD_ZERO(&read_fds);
FD_SET(sockfd, &read_fds);

struct timeval timeout = {5, 0};   // 5 second timeout
int ready = select(sockfd + 1, &read_fds, NULL, NULL, &timeout);
if (ready > 0 && FD_ISSET(sockfd, &read_fds)) {
    // sockfd has data ready — read() will not block
    read(sockfd, buf, sizeof(buf));
}
```

`poll()` is similar but uses an array of `struct pollfd` instead of bit
sets, avoiding `select()`'s limit of 1024 file descriptors.

**Problem with both**: the kernel scans *all* registered descriptors on
every call — O(n) work even if only one descriptor is ready. This
becomes a bottleneck with thousands of connections.

## epoll (Linux)

`epoll` solves the scaling problem. Rather than scanning every
descriptor each time, the kernel maintains an internal table and notifies
you only about descriptors that changed state — O(1) per event
regardless of how many descriptors are registered.

```c
#include <sys/epoll.h>

// Create an epoll instance
int epfd = epoll_create1(0);

// Register a file descriptor to watch for reads
struct epoll_event ev = { .events = EPOLLIN, .data.fd = sockfd };
epoll_ctl(epfd, EPOLL_CTL_ADD, sockfd, &ev);

// Wait for events (up to 64 at a time)
struct epoll_event events[64];
int n = epoll_wait(epfd, events, 64, -1);   // -1 = block forever
for (int i = 0; i < n; i++) {
    handle_event(events[i].data.fd);
}
```

`epoll` is why nginx can handle tens of thousands of simultaneous
connections on a single thread with modest CPU usage.

## Non-Blocking I/O

For an event loop to work, every I/O call must be **non-blocking** —
it must return immediately whether or not data is available, never
causing the thread to sleep. Set this with `fcntl()`:

```c
int flags = fcntl(fd, F_GETFL, 0);
fcntl(fd, F_SETFL, flags | O_NONBLOCK);
```

With `O_NONBLOCK` set, a `read()` that would normally block instead
returns `-1` with `errno == EAGAIN`, telling you to wait until
`epoll_wait()` signals the descriptor is ready.

## Comparison: Threads vs. Events

| Concern              | Threads                          | Events                                 |
|----------------------|----------------------------------|----------------------------------------|
| Concurrency model    | Implicit (preemptive)            | Explicit (cooperative)                 |
| CPU parallelism      | Yes (one thread per core)        | No (single thread by default)          |
| Shared state bugs    | Yes (races, deadlocks)           | No (single-threaded execution)         |
| Blocking I/O         | OK (OS switches threads)         | Fatal (blocks the whole event loop)    |
| Scalability          | Limited by thread stack overhead | Handles 100k+ connections easily       |
| Code complexity      | Simpler (sequential logic)       | Higher (callbacks, state machines)     |

## The Blocking Problem

The biggest pitfall in event-based systems: **any blocking call stalls
the entire loop**. `read()` on a slow disk, `getaddrinfo()` for DNS,
or a long computation will freeze all other clients until it returns.

Solutions:
- Offload blocking work to a **thread pool** and post results back to
  the event loop when done (the hybrid model used by Node.js and libuv).
- Use **asynchronous I/O** (`io_uring` on Linux) which lets the kernel
  queue I/O operations and notify the application on completion without
  any thread blocking at all.

## Real-World Usage

- **nginx**: event-driven web server; one worker process per CPU,
  each running its own event loop.
- **Redis**: single-threaded event loop handles all client commands;
  no locking needed because only one command executes at a time.
- **Node.js**: JavaScript runs in one thread on the V8 engine; I/O is
  dispatched to a libuv thread pool and results are posted back as events.
