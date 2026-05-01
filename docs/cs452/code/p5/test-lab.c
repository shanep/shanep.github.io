#include "harness/unity.h"
#include "../src/lab.h"
#include <stdlib.h>


static int defaultRange = 10;
static int defaultSize = 103;
static int defaultSeed = 1;
static int *expected = NULL;
static int *actual = NULL;

void setUp(void) {
  actual = malloc(sizeof(int) *defaultSize);
  expected = malloc(sizeof(int) *defaultSize);
  srandom(defaultSeed);
  for (int i = 0; i < defaultSize; i++){
    int value = random() % defaultRange;
    actual[i]= value;
    expected[i] =value;
  }
}

void tearDown(void) {
  free(actual);
  free(expected);
}

int compare_ints(const void* a, const void* b)
{
    int arg1 = *(const int*)a;
    int arg2 = *(const int*)b;

    if (arg1 < arg2) return -1;
    if (arg1 > arg2) return 1;
    return 0;
 }

void test_mergesort_mt_small_one_thread(void)
{
  //Run our sort and the C library qsort to compare to
  mergesort_mt(actual, defaultSize, 1);
  qsort(expected, defaultSize, sizeof(int), compare_ints);
  TEST_ASSERT_EQUAL_INT32_ARRAY(expected, actual, defaultSize);
}

void test_mergesort_mt_small_two_threads(void)
{
  mergesort_mt(actual, defaultSize, 2);
  qsort(expected, defaultSize, sizeof(int), compare_ints);
  TEST_ASSERT_EQUAL_INT32_ARRAY(expected, actual, defaultSize);
}

void test_mergesort_mt_small_three_threads(void)
{
  mergesort_mt(actual, defaultSize, 3);
  qsort(expected, defaultSize, sizeof(int), compare_ints);
  TEST_ASSERT_EQUAL_INT32_ARRAY(expected, actual, defaultSize);
}


int main(void) {
  UNITY_BEGIN();
  RUN_TEST(test_mergesort_mt_small_one_thread);
  RUN_TEST(test_mergesort_mt_small_two_threads);
  RUN_TEST(test_mergesort_mt_small_three_threads);
  return UNITY_END();
}
