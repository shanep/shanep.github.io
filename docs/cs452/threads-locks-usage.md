# Locked Data Structures

A data structure that can be safely and correctly accessed by multiple
threads at once.

## Simple Counter

Not Thread Safe!

    1 typedef struct __counter_t {
    2       int value;
    3 } counter_t;
    4
    5 void init(counter_t *c) {
    6       c->value = 0;
    7 }
    8
    9 void increment(counter_t *c) {
    10      c->value++;
    11 }
    12
    13 void decrement(counter_t *c) {
    14      c->value--;
    15 }
    16
    17 int get(counter_t *c) {
    18      return c->value;
    19 }

## Concurrent Counter

Thread Safe!

    1 typedef struct __counter_t {
    2       int value;
    3       pthread_mutex_t lock;
    4 } counter_t;
    5
    6 void init(counter_t *c) {
    7       c->value = 0;
    8       Pthread_mutex_init(&c->lock, NULL);
    9 }
    10
    11 void increment(counter_t *c) {
    12      Pthread_mutex_lock(&c->lock);
    13      c->value++;
    14      Pthread_mutex_unlock(&c->lock);
    15 }

## Concurrent Linked Lists

    1 void List_Init(list_t *L) {
    2       L->head = NULL;
    3       pthread_mutex_init(&L->lock, NULL);
    4 }
    5
    6 void List_Insert(list_t *L, int key) {
    7       // synchronization not needed
    8       node_t *new = malloc(sizeof(node_t));
    9       if (new == NULL) {
    10          perror("malloc");
    11          return;
    12      }
    13      new->key = key;
    14
    15      // just lock critical section
    16      pthread_mutex_lock(&L->lock);
    17      new->next = L->head;
    18      L->head = new;
    19      pthread_mutex_unlock(&L->lock);
    20 }

## In the Kernel

Many operating systems utilized a single lock when first transitioning
to multiprocessors, including Sun OS and Linux. In the latter, this lock
even had a name, the big kernel lock (BKL)

## BKL

As more and more cores were added the BKL became a bottleneck and was
eventually replaced with more fine grained locking in recent kernels.
