# Workload Assumptions

1.  Each job runs for the same amount of time.

2.  All jobs arrive at the same time.

3.  Once started, each job runs to completion.

4.  All jobs only use the CPU (i.e., they perform no I/O)

5.  The run-time of each job is known.

# Scheduling Metrics

-   *T*<sub>*t**u**r**n**a**r**o**u**n**d*</sub> = *T*<sub>*c**o**m**p**l**e**t**i**o**n*</sub> − *T*<sub>*a**r**r**i**v**a**l*</sub>

-   Assume *T*<sub>*a**r**r**i**v**a**l*</sub> = 0

-   Thus
    *T*<sub>*t**u**r**n**a**r**o**u**n**d*</sub> = *T*<sub>*c**o**m**p**l**e**t**i**o**n*</sub>

# First In, First Out (FIFO)

-   Most basic algorithm

-   Also know as First Come, First Served (FCFS)

-   Simple to implement

-   Not a great performer

## Perfect

<figure>
<img src="images/fcfs-perfect.png" alt="FCFS" />
</figure>

$T\_{turnaround} = \frac{10+10+10}3 = 10$

## Bad Performance

<figure>
<img src="images/fcfs-worst.png" alt="Bag" />
</figure>

$T\_{turnaround} = \frac{100+110+120}3 = 110$

# Shortest Job First (SJF)

<figure>
<img src="images/sjf.png" alt="sjf" />
</figure>

$T\_{turnaround} = \frac{10+20+120}3 = 50$

# A New Metric: Response Time

-   *T*<sub>*r**e**s**p**o**n**s**e*</sub> = *T*<sub>*f**i**r**s**t**r**u**n*</sub> − *T*<sub>*a**r**r**i**v**a**l*</sub>

## Details

<figure>
<img src="images/response-time.png" alt="response time" />
</figure>

# Round Robin

The basic idea is simple: instead of running jobs to completion, RR runs
a job for a time slice (sometimes called a scheduling quantum) and then
switches to the next job in the run queue

# Advanced Algorithms

All the algorithms discussed are fairly simple and modern operating
systems use more advanced data structures such as a multi-level feedback
queue to further improve performance!

# Questions
