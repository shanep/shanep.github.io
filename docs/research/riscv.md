# RISC-V

## Registers

In conventional RISC-V software, the stack grows downward with the stack pointer always being 16-byte aligned.

- 5-bit Encoding (rx)
- 3-bit Compressed Encoding (rx')
- [status registers](https://docs.openhwgroup.org/projects/cv32e40s-user-manual/en/latest/control_status_registers.html)

  | rx  | rx' | Register | ABI Name | Description                          | Saved by Calle- |
  | --- | --- | -------- | -------- | ------------------------------------ | --------------- |
  | 0   | -   | x0       | zero     | hardwired zero                       | -               |
  | 1   | -   | x1       | ra       | return address                       | -R              |
  | 2   | -   | x2       | sp       | stack pointer                        | -E              |
  | 3   | -   | x3       | gp       | global pointer                       | -               |
  | 4   | -   | x4       | tp       | thread pointer                       | -               |
  | 5   | -   | x5       | t0       | temporary register 0                 | -R              |
  | 6   | -   | x6       | t1       | temporary register 1                 | -R              |
  | 7   | -   | x7       | t2       | temporary register 2                 | -R              |
  | 8   | 0   | x8       | s0 / fp  | saved register 0 / frame pointer     | -E              |
  | 9   | 1   | x9       | s1       | saved register 1                     | -E              |
  | 10  | 2   | x10      | a0       | function argument 0 / return value 0 | -R              |
  | 11  | 3   | x11      | a1       | function argument 1 / return value 1 | -R              |
  | 12  | 4   | x12      | a2       | function argument 2                  | -R              |
  | 13  | 5   | x13      | a3       | function argument 3                  | -R              |
  | 14  | 6   | x14      | a4       | function argument 4                  | -R              |
  | 15  | 7   | x15      | a5       | function argument 5                  | -R              |
  | 16  | -   | x16      | a6       | function argument 6                  | -R              |
  | 17  | -   | x17      | a7       | function argument 7                  | -R              |
  | 18  | -   | x18      | s2       | saved register 2                     | -E              |
  | 19  | -   | x19      | s3       | saved register 3                     | -E              |
  | 20  | -   | x20      | s4       | saved register 4                     | -E              |
  | 21  | -   | x21      | s5       | saved register 5                     | -E              |
  | 22  | -   | x22      | s6       | saved register 6                     | -E              |
  | 23  | -   | x23      | s7       | saved register 7                     | -E              |
  | 24  | -   | x24      | s8       | saved register 8                     | -E              |
  | 25  | -   | x25      | s9       | saved register 9                     | -E              |
  | 26  | -   | x26      | s10      | saved register 10                    | -E              |
  | 27  | -   | x27      | s11      | saved register 11                    | -E              |
  | 28  | -   | x28      | t3       | temporary register 3                 | -R              |
  | 29  | -   | x29      | t4       | temporary register 4                 | -R              |
  | 30  | -   | x30      | t5       | temporary register 5                 | -R              |
  | 31  | -   | x31      | t6       | temporary register 6                 | -R              |

## Instructions

- [Instructions](https://msyksphinz-self.github.io/riscv-isadoc/html/index.html)
