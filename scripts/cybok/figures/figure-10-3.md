alt: Block diagram of CTR mode encryption: each counter value is encrypted with key k, and the result is XORed with a plaintext block.
---
A block diagram with a row of encryption blocks, each labelled "Enc", read left to right. Each block takes the key $k$ from its left, and a plain arrow enters its top (the counter value, unlabelled in the figure). The output of each Enc block goes down to an XOR (exclusive-or, drawn as a circled plus) that also takes a plaintext block from the left.

- First column: plaintext $P_0$ is XORed with the Enc output, giving ciphertext $C_0$.
- Second column: $P_1$ gives $C_1$.
- Third column: $P_2$ gives $C_2$.
- Dots ($\cdots$) show that the pattern repeats.
- Last column: $P_n$ gives $C_n$.

The columns do not depend on each other.
