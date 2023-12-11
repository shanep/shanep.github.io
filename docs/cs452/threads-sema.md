# Semaphore

A semaphore is an object with an integer value that we can manipulate
with two routines; in the POSIX standard, these routines are sem\_wait()
and sem\_post()

## Some code

    1 int sem_wait(sem_t *s) {
    2 decrement the value of semaphore s by one
    3 wait if value of semaphore s is negative
    4 }
    5
    6 int sem_post(sem_t *s) {
    7 increment the value of semaphore s by one
    8 if there are one or more threads waiting, wake one
    9 }

## Binary Semaphores (Locks)

Because locks only have two states (held and not held), we sometimes
call a semaphore used as a lock a binary semaphore.

## Semaphores For Ordering

- Semaphores are also useful to order events in a concurrent program.
- One thread waits for something to happen (blocks on a semaphore)
- Another thread making that something happen and then signaling that it has happened

## Reader-Writer Locks

- Multiple concurrent readers at a time
- Only one writer at a time

## The Dining Philosophers 🍽

![dining philosophers](images/dining-philosophers.png)

## Thread Throttling

Use a semaphore to limit the number of threads concurrently executing
the piece of code in question

    1 typedef struct __Zem_t {
    2   int value;
    3   pthread_cond_t cond;
    4   pthread_mutex_t lock;
    5 } Zem_t;
    6
    7 // only one thread can call this
    8 void Zem_init(Zem_t *s, int value) {
    9   s->value = value;
    10  Cond_init(&s->cond);
    11  Mutex_init(&s->lock);
    12 }
    13
    14 void Zem_wait(Zem_t *s) {
    15  Mutex_lock(&s->lock);
    16  while (s->value <= 0)
    17      Cond_wait(&s->cond, &s->lock);
    18  s->value--;
    19  Mutex_unlock(&s->lock);
    20 }
    21
    22 void Zem_post(Zem_t *s) {
    23  Mutex_lock(&s->lock);
    24  s->value++;
    25  Cond_signal(&s->cond);
    26  Mutex_unlock(&s->lock);
    27 }

## Summary

Semaphores are a powerful and flexible primitive for writing concurrent
programs. Some programmers use them exclusively, shunning locks and
condition variables, due to their simplicity and utility.
