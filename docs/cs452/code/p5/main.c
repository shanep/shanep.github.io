#include <stdio.h>
#include <stdlib.h>
#include "lab.h"

// The test build compiles this file too, so rename main to keep it from
// clashing with the main function in tests/lab-test.c
#ifdef TEST
#define main main_exclude
#endif

int main(int argc, char **argv)
{

  if (argc < 3)
    {
      printf("usage: %s <array_size> <num_threads>\n", argv[0]);
      return 1;
    }
  int size = atoi(argv[1]);
  int t = atoi(argv[2]);

  int *A_ = malloc(sizeof(int) * (size_t)size);
  srandom(1);
  for (int i = 0; i < size; i++)
    A_[i] = (int)(random() % 100000);

  double end = 0;
  double start = getMilliSeconds();
  mergesort_mt(A_, size, t);
  end = getMilliSeconds();
  printf("%f %d\n",end-start, t);

  free(A_);
  return 0;
}
