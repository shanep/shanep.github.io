# Free Space Management

- Managing free space can certainly be easy, as we will see when we
    discuss the concept of paging.
- Where free-space management becomes more difficult (and interesting)
    is when the free space you are managing consists of variable-sized
    units;

## Partition Strategies

- Fixed Partitions: Simple but inflexible. Can have internal fragmentation.
- Variable partitions: Flexible but more complex. Can lead to external fragmentation

## Fixed Partition

![Internal Frag](images/vm-internal-frag.png)

## Variable Partition

![External Frag](images/vm-external-frag.png)

## malloc

![malloc header](images/malloc-header.png)

## malloc Internals

- All calls to malloc will incur a small amount of overhead to accommodate a header.
- The pointer returned by malloc points at the free space not the header itself.
- When you write outside of your memory area you have the possibility
    of stomping another memory blocks header which will eventually cause
    a segfault.

## malloc Strategies

Now that we have some machinery under our belt, let’s go over some basic
strategies for managing free space.

### Best Fit

The best fit strategy is quite simple: first, search through the free
list and find chunks of free memory that are as big or bigger than the
requested size. Then, return the one that is the smallest in that group
of candidates; this is the so called best-fit chunk (it could be called
smallest fit too).

### Worst Fit

The worst fit approach is the opposite of best fit; find the largest
chunk and return the requested amount; keep the remaining (large) chunk
on the free list. Worst fit tries to thus leave big chunks free instead
of lots of small chunks that can arise from a best-fit approach

### First Fit

The first fit method simply finds the first block that is big enough and
returns the requested amount to the user. As before, the remaining free
space is kept free for subsequent requests.

### Next Fit

Instead of always beginning the first-fit search at the beginning of the
list, the next fit algorithm keeps an extra pointer to the location
within the list where one was looking last.

## Other approaches

- Segregated Lists (Memory pools)
- Buddy Allocation - YA!! This is one of our projects 😍
