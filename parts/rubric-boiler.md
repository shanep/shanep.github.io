<!-- markdownlint-disable-next-line -->
## Minimum Standards

All code must compile and run on the department computers in the Kount Computer Lab (CCP 241).
Code is compiled and tested on the command line using the provided scripts — your instructor will
**not** use an IDE to build or test your submission. You are welcome to develop in any IDE, but
always verify your code compiles and runs cleanly from the terminal before submitting to avoid
accidentally introducing IDE-specific dependencies.

Projects are designed to satisfy specific learning objectives, so you are required to solve the
problem as described in the specification. For example, if the spec asks for a linked list but you
implement a hash map, your solution is incorrect even if it passes every test.

::: danger

Solving the problem in a way that contradicts the specification can reduce your grade by up to
**50%**, even if your code passes all provided tests.

:::

## Testing

Your code will be run against the provided tests and any additional tests you author. The test suite
may include both automated and manual tests where automation is not feasible.

**How many tests should you write?** At a minimum, write at least one test per **public** function
or method — including any untested functions provided to you in the starter code. Always test both
valid and invalid inputs. Your program must not crash on bad data.

::: warning

Writing tests beyond what is provided is **required** and is part of your grade. Students who only
verify the provided tests pass will lose points.

:::

For UI components or other areas where automated testing is not practical, you will be given a pass
on automated testing — but you must document your manual test cases in comments in the source code.

You are **not** allowed to modify the instructor-provided tests. If you believe a provided test
contains a bug, bring it to office hours. You must pass the tests as written.

Testing includes but is not limited to:

- **User input validation** — bad input must not crash the program
- **Function argument validation** — handle `NULL`, undefined, negative, or out-of-range values
- **Return value checking** — verify functions return the expected values
- **Loop invariants** — define [loop invariants](https://en.wikipedia.org/wiki/Loop_invariant) where appropriate
- **Header file conformance** — implement headers exactly as defined
- **API compliance** — use the specific API calls listed in the specification

### Code Coverage

Code coverage measures how much of your code is exercised by your tests. You are expected to get
as close to **100% coverage** as possible. Areas that are genuinely difficult to test (complex
mocking, threading, external dependencies) will be explicitly called out in the spec and excluded.

::: warning

Functions excluded from the coverage report will be **clearly listed** in the project spec. You
may **not** exclude functions that are not on that list to inflate your coverage metric. Doing so
will result in a **0%** for the testing section of the rubric.

:::

## General Coding Guidelines

The following guidelines apply to all projects. Your submission will be **spot checked**, and you
will lose **5 points per violation** found. Not every issue will be caught in every project — but
do not assume a clean score on one project means these rules will be overlooked on future ones.

### Global Variables

Public global variables are **banned**. Private, protected, or stack-local variables are fine. If
you genuinely believe a global variable is the only solution, you must document clearly why in a
comment.

Exceptions exist when dealing with legacy APIs, device drivers, or poorly designed SDKs — these
cases will be explicitly called out in the project spec.

Global state makes concurrent and asynchronous code much harder to write correctly. Even if your
current project is single-threaded, avoiding globals builds habits that will matter when you start
writing multithreaded code.

### Formatting

Consistent formatting is required. No specific style is enforced, but your code must be internally
consistent. There is no excuse for poorly formatted code when your editor
[can do it for you](https://stackoverflow.com/questions/29973357/how-do-you-format-code-in-visual-studio-code-vscode).

As [Purdue's Writing Lab](https://owl.purdue.edu/owl/general_writing/academic_writing/paragraphs_and_paragraphing/index.html)
notes, good structure greatly aids comprehension. The same applies to source code — just because
the compiler ignores whitespace doesn't mean your reader does.

### Spelling and Grammar

Code comments and documentation should be readable. Spell-check your work — a
[spell checker extension](https://marketplace.visualstudio.com/items?itemName=streetsidesoftware.code-spell-checker)
for VS Code even handles camelCase identifiers. The bar is clarity: if a reader cannot understand
what you are trying to say, points will be deducted.

### Code Ownership

Starter code provided to you may not meet the guidelines in this rubric. It is your responsibility
to bring **all** code up to standard, regardless of who wrote it. If your instructor does not
intend for you to fix a pre-existing issue, it will be marked with a comment.

Some starter code contains **intentional defects** you are expected to find and fix. Do not assume
that code provided to you is correct. You take full responsibility for 100% of what you submit.

### Documentation

Two things are required for documentation credit:

1. Every public function, method, or class must have a doc-comment describing what it does, what
   each parameter means, and what it returns.
2. Inline comments inside a function are only needed for non-obvious logic — explain **why**, not
   what the code does.

Use the appropriate tool for the language:

::: code-group

```c [C / C++]
/**
 * @brief Initializes a new list with caller-supplied callbacks.
 * The caller must pass the list to list_destroy when finished
 * to free any allocated memory.
 *
 * @param destroy_data Function to free memory for user-supplied data
 * @param compare_to   Function to compare two user data elements
 * @return Pointer to the newly allocated list, or NULL on failure
 */
list_t *list_init(void (*destroy_data)(void *),
                  int  (*compare_to)(const void *, const void *));
```

```java [Java]
/**
 * Validates a chess move.
 *
 * @param fromFile file from which a piece is being moved
 * @param fromRank rank from which a piece is being moved
 * @param toFile   file to which a piece is being moved
 * @param toRank   rank to which a piece is being moved
 * @return         true if the move is valid, otherwise false
 */
boolean isValidMove(int fromFile, int fromRank, int toFile, int toRank) {
    // ...body
}
```

```javascript [JavaScript]
/**
 * Updates the current mouse position.
 *
 * @param {number} x The x coordinate of the mouse
 * @param {number} y The y coordinate of the mouse
 */
function updateMouseLocation(x, y) {
    // ...body
}
```

:::

### Compiler Warnings

All warnings from the compiler, interpreter, or static analysis tools must be fixed. Warnings are
never acceptable in submitted code.

In the rare case that a warning truly cannot be resolved — due to assignment constraints or an
external dependency — your instructor will explicitly call this out and provide instructions for
suppressing it. You may **not** disable warnings without that explicit permission.

::: warning

Compiler warnings are trivial to check automatically, so unlike other style issues they will
**always** be caught. Submitting code with unauthorized warnings disabled forfeits 100% of the
points for the affected rubric section.

:::
