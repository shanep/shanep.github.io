#include "harness/unity.h"
#include "../src/lab.h"


void setUp(void) {
    // set stuff up here
}

void tearDown(void) {
    // clean stuff up here
}

void test_leak(void) {
  char *version = getVersion();
  TEST_ASSERT_EQUAL_STRING("1.0", version);
}

void test_segfault(void) {
  segfault();
}

void test_bounds(void){
  outOfBounds();
}

int main(void) {
    UNITY_BEGIN();
    RUN_TEST(test_leak);
    RUN_TEST(test_segfault);
    RUN_TEST(test_bounds);
    return UNITY_END();
}
