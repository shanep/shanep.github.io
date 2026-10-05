## Task 1 - Setup

Follow the steps below to get your repository all set up and ready to use. The steps below show you
how to use and set up GitHub Codespaces. You are not required to use Codespaces. All the steps below
can be completed on Onyx (the CS lab machines) or on your personal machine if you prefer.

### Create your repository from the template

The starter repository is a GitHub template, so you make your own copy of it instead of forking it.

1. Open the starter repository: **{{$frontmatter.repo}}**
2. Click the green **Use this template** button and choose **Create a new repository**.
3. Pick your personal GitHub account as the owner and name the repository
   **{{$frontmatter.project}}**.
4. Click **Create repository**.

Your new repository is not a fork, so it has no `upstream` remote. That is on purpose: everything
you need is already in your copy.

### Start a new Codespace

We will use GitHub Codespaces to do most of our coding. Codespaces is just VS Code in the cloud. This
makes it really easy to set up a developer environment and code from any computer that has a browser
and internet connection! From your new repository click **Code**, then the **Codespaces** tab, then
**Create codespace on master**.

![Start Codespace](/images/start-codespace.png)

If you are asked to install recommended extensions, click "install". You may not be asked to install
extensions if you are already syncing your account.

![Codespace extensions](/images/codespace-extensions.png)

::: info

If you work on Onyx or your own machine instead, clone your repository with `git clone` and make sure
you have `gcc` (or `clang`), `make`, and [gcovr](https://gcovr.com/) installed. The Codespace comes
with all of these. The file `docs/onyx.md` in your repository has notes on using Onyx.

:::

### Get to know the starter

Here is what you get in the starter repository.

- `src/main.c` - the `main` function for the executable
- `src/lab.h` and `src/lab.c` - the library code that both the executable and the tests use
- `tests/lab-test.c` - your unit tests, written with the
  [Unity](https://github.com/ThrowTheSwitch/Unity) test framework
- `tests/harness/` - the Unity framework itself, don't edit these files
- `README.md` - you will fill this out before you submit
- `scripts/create-submission-report.sh` and `.github/workflows/` - continuous integration and the
  submission report

The `Makefile` builds every C file in `src/` and `tests/`. The test build defines `TEST`, and
`src/main.c` uses that to rename its `main` function so it does not clash with the `main` in
`tests/lab-test.c`. Keep these lines at the top of `src/main.c` in every project.

```c
#ifdef TEST
#define main main_exclude
#endif
```

These are the `make` targets you will use the most. Run `make help` to see them all.

| Command          | What it does                                                         |
| ---------------- | -------------------------------------------------------------------- |
| `make all`       | Builds all four versions of the project listed below                 |
| `make check`     | Runs the unit tests in `build/tests/myapp_t`                          |
| `make leak`      | Runs the debug executable with Address Sanitizer leak checking on     |
| `make leak-test` | Runs the unit tests with Address Sanitizer leak checking on           |
| `make report`    | Runs the unit tests and creates a code coverage report in `build/report` |
| `make clean`     | Deletes the `build` directory                                         |

`make all` creates four programs.

- `build/release/myapp` - the optimized executable, compiled with all the warning flags
- `build/debug/myapp_d` - the executable compiled with [Address
  Sanitizer](https://clang.llvm.org/docs/AddressSanitizer.html)
- `build/tests/myapp_t` - the unit tests compiled for code coverage
- `build/debug-test/myapp_td` - the unit tests compiled with Address Sanitizer

If there is no `src/main.c` then `make all` skips the executable and only builds the tests. That is
how the projects that are 100% unit tests work.

::: warning

`make check`, `make leak`, `make leak-test`, and `make report` run whatever is already in `build/`.
They do **not** recompile your code. Run `make all` after every change or you will be testing old
code. Also, `make all` prints "Builds completed" even when one of the builds failed, so scroll up
and read the output.

:::
