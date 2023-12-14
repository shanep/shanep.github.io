#ifndef LAB_H
#define LAB_H
#include <pthread.h>

#ifdef __cplusplus
extern "C"
{
#endif

  // The threshold that we will use to switch to insertion sort, make sure that
  // you use test arrays bigger than 5 so you are testing the merge sort
#define INSERTION_SORT_THRESHOLD 2
#define MAX_THREADS 32
  /**
   * @brief Sorts an array of ints into ascending order using the constant
   * INSERTION_SORT_THRESHOLD internally
   *
   * @param A A pointer to the start of the array
   * @param p The starting index
   * @param r The ending index
   */
  void mergesort_s(int *A, int p, int r);

  /**
   * @brief Merge two sorted sequences A[p..q] and A[q+1..r] and place merged
   *              output back in array A. Uses extra space proportional to
   *              A[p..r].
   *
   * @param A The array to merge into
   * @param p The starting index of the first half
   * @param q The middle
   * @param r The ending index of the second half
   */
  void merge_s(int A[], int p, int q, int r);

  /**
   * @brief Sorts an array of ints into ascending order using multiple
   * threads
   *
   * @param A A pointer to the start of the array
   * @param n The size of the array
   * @param num_threads The number of threads to use.
   */
  void mergesort_mt(int *A, int n, int num_thread);

  /**
   * @brief retuns the current time as milliseconds
   * @return the number of milliseconds
   */
  double getMilliSeconds();

  /**
   * @brief Represents a chunk of the array to be sorted by a thread
   *
   */
  struct parallel_args
  {
    int *A;
    int start;
    int end;
    pthread_t tid;
  };

  /**
   * @brief The function that is called by each thread to sort their chunk
   *
   * @param args see struct parallel_args
   * @return void* always NULL
   */
  void *parallel_mergesort(void *args);

  /**
   * @brief Entry point for the main function
   *
   * @param argc The argument count
   * @param argv The argument array
   * @return The exit code
   */
  int myMain(int argc, char **argv);

#ifdef __cplusplus
} // extern "C"
#endif

#endif
