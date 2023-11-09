# Testing

There are LOTS of different types of testing methods out there. For this
class we will focus on the following:

- Unit testing - small units of code
  - functions or classes in isolation
- System testing
  - Test the entire application

## Differences

- Unit testing
  - Makes it easy to track down and fix problems
  - Can’t test how units interact with each other
- System testing
  - Can make it difficult to track down the bug
  - Ensures that all your code units actually work together

## Test Driven Development (TDD)

Test-driven development reverses traditional development and testing.

## TDD 30K View ✈

- Write your tests first
- Then write your code until the test passes
- Entire books have been written on this topic so you are not expected to know everything.

## This Class

- Can be difficult to do **pure** TDD especially when you are dealing with a lot of third party libraries and frameworks.
- Try to do at least one project using the TDD method

## Unit Testing Frameworks

- Hundreds of options
- In this class we will use Google Test
- [Google Test Primer](http://google.github.io/googletest/primer.html)

## Google Test

- Written in C++
  - Don’t worry you don’t need to know C++
- Well supported
- Integrates nicely with CMake
- [C and GoogleTest](https://ros-developer.com/2019/08/28/example-of-test-driven-development-with-c-and-google-test/)

## Basic Concepts

When using GoogleTest, you start by writing assertions, which are
statements that check whether a condition is true. An assertion’s result
can be success, nonfatal failure, or fatal failure. If a fatal failure
occurs, it aborts the current function; otherwise the program continues
normally.

## Assertions

Your Main tool!

```cpp
ASSERT_EQ(x.size(), y.size()) << "Vectors unequal";
for (int i = 0; i < x.size(); ++i) {
  EXPECT_EQ(x[i], y[i]) << "Vectors differ at" << i;
}



TEST(TestSuiteName, TestName) {
  ... test body ...
}



int Factorial(int n);  // Returns the factorial of n

// Tests factorial of 0.
TEST(FactorialTest, HandlesZeroInput) {
  EXPECT_EQ(Factorial(0), 1);
}

// Tests factorial of positive numbers.
TEST(FactorialTest, HandlesPositiveInput) {
  EXPECT_EQ(Factorial(1), 1);
  EXPECT_EQ(Factorial(2), 2);
  EXPECT_EQ(Factorial(3), 6);
  EXPECT_EQ(Factorial(8), 40320);
}
```

## Test Fixtures

If you find yourself writing two or more tests that operate on similar
data, you can use a test fixture. This allows you to reuse the same
configuration of objects for several different tests.

## Test Fixtures cont

- This is a more advanced technique
- An example in the project is given to you
- In this class you can get by with just using Simple tests

## Invoking the Tests

Most users should not need to write their own main function and instead
link with gtest\_main

- Projects are setup with CMake to run all your tests
- Run all your tests with `make test`

`make test`

## Test Logs

- Segfaults and other issues will be placed in the logs
- The output from testing will be in the `Testing/Temporary/LastTest.log`

## Code Coverage

Use the code coverage tools to see if your tests are hitting
all the necessary places!
