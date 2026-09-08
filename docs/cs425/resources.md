# Resources

## Textbook

*Computer Networking: A Top-Down Approach*, 9th edition, by James Kurose and Keith
Ross. A digital copy is provided under Course Materials in Canvas, so you do not
need to buy anything.

The authors keep a companion site with interactive problems and Wireshark labs,
which is worth your time even though none of it is graded here.

## Where your code has to run

Every project must compile and run on **both** of the following. If it builds on
only one, it receives no credit.

- **GitHub Codespaces** — VS Code in the browser, configured by the starter repo.
- **Onyx** — the department's login server, `onyx.boisestate.edu`, reachable over
  SSH with your Boise State credentials.

Writing code that is portable across two toolchains is a learning objective, not
an inconvenience. The two machines have different compilers and different library
versions on purpose.

## Starter repository

All projects fork from [makefile-project-starter](https://github.com/shanep/makefile-project-starter).
Use the **Use this template** button rather than the fork button so your copy is
not tied to the upstream history.

The starter gives you a Makefile with the targets every project depends on:

| Target            | What it does                                     |
| ----------------- | ------------------------------------------------ |
| `make all`        | Build the debug and release binaries             |
| `make check`      | Run the Unity test suite                         |
| `make report`     | Generate the gcovr coverage report               |
| `make leak`       | Build the leak-checking binary                   |
| `make leak-test`  | Run the tests under the leak checker             |
| `make clean`      | Remove everything under `build/`                 |

## Tools

- [Unity](https://github.com/ThrowTheSwitch/Unity) — the C test harness the starter uses.
- [Wireshark](https://www.wireshark.org/) — packet capture and analysis. Install it
  locally; you will want it for the link layer material.
- [gcovr](https://gcovr.com/) — the coverage tool behind `make report`.
- [Valgrind](https://valgrind.org/) — the leak checker behind `make leak-test`.

## Reference

- [RFC Editor](https://www.rfc-editor.org/) — the protocol specifications themselves.
  RFC 791 (IP), 793 (TCP), 768 (UDP), 5321 (SMTP), and 9110 (HTTP) all come up.
- [Beej's Guide to Network Programming](https://beej.us/guide/bgnet/) — the friendliest
  socket programming reference there is.
- [Submission report README example](https://gist.github.com/shanep/4fc7962a3ac80349094d50e0fa57cf6e)
  — the format every project README must follow.
