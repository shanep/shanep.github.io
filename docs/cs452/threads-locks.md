# Locks

    balance = balance + 1;

    1 lock_t mutex; // some globally-allocated lock ’mutex’
    2 ...
    3 lock(&mutex);
    4 balance = balance + 1;
    5 unlock(&mutex);

## Pthread Locks

The name that the POSIX library uses for a lock is a mutex, as it is
used to provide mutual exclusion between threads, i.e., if one thread is
in the critical section, it excludes the others from entering until it
has completed the section.

## Example

    1 pthread_mutex_t lock = PTHREAD_MUTEX_INITIALIZER;
    2
    3 Pthread_mutex_lock(&lock); // wrapper; exits on failure
    4 balance = balance + 1;
    5 Pthread_mutex_unlock(&lock);

## Building A Lock

- To build a working lock, we will need some help from our old friend, the hardware
- Must provide mutual exclusion
- Must be fair (thread starvation)
- Must be performant (can’t add too much overhead)

## Hardware support

Each platform architecture may provide different support to help build
locks. The core idea in all these instructions is they are atomic.
Meaning that they are guaranteed to complete once started.

- Interrupts
- test-and-set
- compare-and-swap (SPARC)
- compare-and-exchange (x86)
- load-linked and store-conditional (MIPS)
- Fetch-and-add

## Building a Lock

Lets look at just a few examples of building a lock! 🔒

### Controlling Interrupts

    1 void lock() {
    2       DisableInterrupts();
    3 }
    4 void unlock() {
    5       EnableInterrupts();
    6 }

- The main positive of this approach is its simplicity
- The negatives, unfortunately, are many
  - Any calling thread to perform a privileged operation
  - Thread can die before unlocking making the system unusable.
- Does not work on multiprocessors

## Test-And-Set

We define what the test-and-set instruction does via the following C
code snippet.

    1 int TestAndSet(int *old_ptr, int new) {
    2       int old = *old_ptr; // fetch old value at old_ptr
    3       *old_ptr = new; // store new into old_ptr
    4       return old; // return the old value
    5 }

The example above is just for illustration purposes. A real TestAndSet
function would need to use inline ASM to be correct. See the code
examples!

## Test-And-Set details

- Hardware instruction to test and set a variable atomicity
- It returns the old value pointed to by the old\_ptr, and simultaneously updates said value to new
- Other instructions are compare\_and\_swap or compare-and-exchange
- Typically implemented in assembly language.

## Dekker’s and Peterson’s Algorithms

Dekker’s algorithm and Peterson’s algorithm attempted to solve the
mutual exclusion problem using only load and store instructions —
no special hardware atomics required. They work correctly under the
sequential consistency memory model (the model assumed when reasoning
about code on paper).

**Why they fail on modern hardware:** CPUs and compilers are allowed to
reorder memory operations for performance as long as the result looks
correct *from a single thread’s perspective*. This is called a
**relaxed memory model**. Under a relaxed model, a store by thread A
may not be visible to thread B in program order — it can be buffered in
a store queue, reordered by the compiler, or delayed by cache coherence
protocols. Both algorithms rely on the assumption that a store is
immediately visible to all other threads, which modern hardware does
**not** guarantee.

To enforce ordering on real hardware, you need explicit **memory
barriers** (also called fences): instructions that flush store buffers
and prevent the CPU from reordering across the fence. The hardware
atomic primitives (test-and-set, compare-and-swap, etc.) implicitly
include the necessary barriers, which is why they work correctly where
Peterson’s algorithm does not.

## Spin Locks

- It is the simplest type of lock to build, and simply spins, using CPU cycles, until the lock becomes available.
- To work correctly on a single processor, it requires a preemptive
    scheduler (i.e., one that will interrupt a thread via a timer, in
    order to run a different thread, from time to time).
