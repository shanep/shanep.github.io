<!-- markdownlint-disable-next-line -->
## Minimum standards

Unless otherwise stated all code must compile and run on the department’s
computers in the Kount Computer Lab (CCP241). All code will be compiled and
tested on the command line using the scripts provided. Your instructor or
teaching assistant will **not** use an IDE to build and test your code. While
you are welcome to use any IDE you wish to develop your code it is strongly
recommended that you compile and test your code using the terminal to ensure you
have not introduced any IDE specific dependencies on accident.

Projects have been carefully crafted to ensure certain learning objectives are
satisfied. Thus, you are required to solve the problem as described in the
specification. For example, if the specification asks you to implement a linked
list and you implement a hash map your solution would not be correct even though
your code may pass all the instructor provided tests. Your final grade will be
reduced up to 50% if you do not follow the specification.

## Testing

For the testing criteria your code will be ran against the provided tests and
any additional tests that you author. The test suite may consist of both
automated tests and or manual testing in cases that automation is not feasible.

The question that is always asked is how many tests do I write? At a minimum
you should write at least one test for every **public** function or method. This
includes any untested functions that were provided for you. You should make sure
that you test bad inputs as well as good inputs. Your program should not crash
if a user inputs bad data!

::: warning
Students are expected to write tests beyond what is provided for them to ensure
their code operates as expected. Writing tests is part of the learning process
and **part of your grade** for this project.
:::

Some times it is not feasible to write tests for part of your program. For
example, if the project includes a User Interface (UI) component it is very
difficult to write automated tests without extensive mocking or complicated
tooling. In these cases you will be given a pass on the testing criteria for
that particular part and you will need to detail what manual tests you completed
in the RETROSPECTIVE.md.

You are not allowed to change the instructor provided tests in any way, if you
think there is a bug in the given tests please attend office hours to review
your findings. You must pass the tests as they are written.

Testing consists of but is not limited to:

- Validating user input
  - User input should not crash your program
- Validating function arguments
  - Malformed input to your functions should not cause a crash
  - What happens if you pass NULL or undefined to function arguments
  - Passing values that are out of range such as negative numbers
  - Checking the return values of your functions to ensure that the function is returning expected values
- Defining [loop invariants](https://en.wikipedia.org/wiki/Loop_invariant) where appropriate.
- Implementing header files as defined
- Using the API calls that are explicitly called out in the specification.

## Code Coverage

Code coverage is a measure of how much of your code is executed by your tests.
You are expected to get as close to 100% code coverage as possible. Code that is
difficult to test without significant mocking, dependency injection, or
threading issues does not have to be tested and will be clearly called out in
the specification.

::: warning

Functions that you can exclude from the code coverage report will be clearly
denoted in the project specification. You can **NOT** exclude any functions that
are not explicitly called out in the specification in order to artificially
inflate your code coverage metric. Doing so, and getting caught, will result in
a 0% for this section of the rubric.

:::

## Retrospective

Each programming project contains a file name Retrospective.md. While I really
don’t like having hard word counts I have found that if I don’t specify a
minimum **some** students will take advantage of that and submit nothing of
substance. The Retrospective is important for me as it gives some insight into
your learning process and helps me understand where you may be struggling. Thus,
it is expected that the **Experience** section is at least 200 words long.
Points will be deducted based on how far below the required word count you are.
Additionally, up to 50% of your score for this section can be deducted if filler
sentences are used to artificially inflate the word count. 200 words is a pretty
low bar for a college level course.

Having trouble figuring out what to write? Here are some questions to get you
started.

- How did you test your project? Were you able to rely on automated tests or
  did you have to manually test your code?
- Were there any things that you struggled with?
- Were there any parts of this lab that were unclear or poorly specified?
- Were you able to get the entire project done?
- Detail one new thing you learned.
- Anything else you would like to share is awesome and encourage 😃.

If the assignments ask you to include any graphs, screenshots or other artifacts
as they must display correctly when viewed on github. You can reference the
[markdown](https://docs.github.com/en/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax#images)
help docs for how to include images.

For the **Known issues or Bugs** section you need to detail any issues or bugs
that you have in your code. For example maybe your code crashes randomly and you
couldn’t figure out why. If your code doesn’t have any issues you can simply
write NONE in this section.

For the **Sources used section** you must detail any sources you used outside of
the textbook or course website. If you write NONE in this section it is assumed
that you didn’t use google at all. Be safe CITE! Remember that using ChatGPT,
Google Bard, or any other AI generated text is considered a source and must be
listed here.

## General Coding Guidelines

For all projects the following guidelines are enforced. Your project will be
**spot checked** for these issues and if any are found you will lose _5 points_
per issue found. Not every issue will be caught by the spot checks so don't
assume that just because you didn't lose points on a project that you won't lose
points in a future project.

### Global Variables

All **public** global variables are 100% banned. Private, protected, or
stack local variables variables are OK. If you truly think that the only
way to solve the problem is to use a global variable then you must
**clearly** document why you are forced to use a global variable.

There are instances where it is necessary to use a public global
variable because you are dealing with a legacy API, writing a device
driver, or you are working with a poorly implemented SDK. These cases
will be clearly detailed in the project specification and you will be
allowed to use global variables in those cases.

Global variables make writing concurrent, async, multi-threaded code
very difficult. So even if you are not writing concurrent code (or don’t
even know what that means at this point) it is good to start training
yourself to use good habits so the code you write can easily be used in
a concurrent environment instead of having to refactor your code in the
future.

### Formatting

Except for languages like python, code formatting for the most part does
not impact functionality. Formatting can be very subjective so no
particular style is enforced, it is only important that you are
consistent within your own code.

There should be no reason for poorly formatted code when your editor
will [do it for you](https://stackoverflow.com/questions/29973357/how-do-you-format-code-in-visual-studio-code-vscode)!
What makes code more or less readable is often controversial and
opinionated. In this class we will not address the philosophical aspect
of putting braces on the end of the line or on a new line, or the
classic debate of tabs vs spaces, we will primarily focus on being
consistent.

English scholars have long known that [punctuation matters](https://www.vappingo.com/word-blog/the-importance-of-punctuation/).
To quote from [purdue’s writing lab](https://owl.purdue.edu/owl/general_writing/academic_writing/paragraphs_and_paragraphing/index.html)
“Good paragraphing also greatly assists your readers in following a
piece of writing”. The readability of source code is also greatly
improved by good formatting. Just because the compiler or interpreter
ignores whitespace doesn’t mean you should as well.

### Spelling and Grammar

I generally do not care about spelling or grammar mistakes, it is not an
area I excel in :). The only exception to this rule is if your writing is
so bad I literally can’t make heads or tails of what you are trying to
say. At a minimum you should spell check your documents and attempt to
write as clearly as possible. [Spell checkers](https://marketplace.visualstudio.com/items?itemName=streetsidesoftware.code-spell-checker)
are even available that work with camelCase code!

### Code Ownership

The starter code that is given to you may not be up to the guidelines
specified in the grading rubric. It is your responsibility to bring all
code up to the standards specified regardless of the original author. If
your instructor does not intend for you to fix any pre-existing issues
it will be clearly marked by a comment in the source. Don’t assume that
all code pushed out by your instructors is perfect, in fact some code
may be wrong on purpose. Learning how to read and fix other engineers
code is a very important skill to learn. You take responsibility for
100% of the code that you submit regardless of who originally wrote it.

Some of the starter code will have **intentional defects** that your
instructor intends for you to fix! Do NOT assume that all code given to
you is perfect.

### Documentation

For the purpose of grading there are two important things to note.

1. Each function (method) or class must have a header documentation string
   specifying what the function does, what each function parameter does, and
   what the return value is.
2. Documentation inside a function (method) is only necessary when you have
   exceptionally complex code or you need to detail **why** you are doing
   something non-obvious or against what has been taught in class or the
   textbook.

Your documentation string will be language dependent. For example in
Java you will use [JavaDoc](https://www.oracle.com/technical-resources/articles/java/javadoc-tool.html)
while Javascript will use [JSDoc](https://jsdoc.app/) and C/C++ will use
[Doxygen](https://www.doxygen.nl/). If you have any questions as to what
documentation tool you should be using you need to reach out to your
instructor or TA for guidance.

::: code-group

```java
/**
 * Validates a chess move.
 *
 * @param fromFile file from which a piece is being moved
 * @param fromRank rank from which a piece is being moved
 * @param toFile   file to which a piece is being moved
 * @param toRank   rank to which a piece is being moved
 * @return         true if the move is valid, otherwise false
 * @since          1.0
 */
boolean isValidMove(int fromFile, int fromRank, int toFile, int toRank) {
    // ...body
}
```

```javascript
/**
 * Updates the current position of the mouse given an x,y coordinate
 *
 * @param {double} x The x coordinate of the mouse
 * @param {double} y The y coordinate of the mouse
 */
function updateMouseLocation(x, y) {
    // ...body
}
```

```c++
/**
* @brief Create a new list with callbacks that know how to deal with the
* data that list is storing. The caller must pass the list to list_destroy
* when finished to free any memory that was allocated.
*
* @param destroy_data Function will free the memory for user supplied data
* @param compare_to Function that will compare two user data elements
* @return struct list* pointer to the newly allocated list.
*/
LAB_EXPORT list_t *list_init(void (*destroy_data)(void *),
                            int (*compare_to)(const void *, const void *));
```

:::

### Compiler Warnings

Warnings emitted by the compiler or static analysis tools need to be fixed.
Under no circumstances should you ignore compiler warnings. In the **very** rare
case that a warning cannot be fixed either because it is part of the assignment
or a result of some other external dependency your instructor will clearly call
this out and give you instructions on how to disable the warning. You are not
allowed to disable any warnings without explicit permission from your
instructor. If you submit code with warnings disabled you forfeit 100% of the
points from the appropriate section in the rubric.

::: tip

Warnings are something that is really easy to automatically check for.
Thus, unlike the other issues that may slip past the grader it is highly
unlikely that you will be given a pass on this criteria. :)

:::
