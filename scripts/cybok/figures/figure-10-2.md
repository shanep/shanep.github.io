alt: Block diagram of CBC mode encryption: each plaintext block is XORed with the previous ciphertext block, then encrypted with key k.
---
A block diagram with a row of encryption blocks, each labelled "Enc", read left to right. Each block takes the key $k$ from its left. A plain arrow enters each XOR (exclusive-or, drawn as a circled plus) from the top; this is the plaintext block. The caption's note about TikZ is only a credit for how the figures were drawn.

- First block: the initial value $IV$ enters the XOR from the left. The XOR output feeds Enc. The output of Enc is the ciphertext $C_0$.
- Second block: the XOR takes the plaintext from above and the previous block's ciphertext $C_0$ (a line from below the first Enc, up and across to this XOR). The XOR output feeds Enc, which outputs $C_1$.
- Third block: in the same way, $C_1$ is XORed with the plaintext and fed into Enc, which outputs $C_2$.
- Dots ($\cdots$) show that the pattern repeats.
- Last block: a line carrying the previous ciphertext enters the XOR, the XOR feeds Enc, and the output is $C_n$.
