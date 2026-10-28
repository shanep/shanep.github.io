alt: Block diagram of GCM mode encryption: counter blocks drive encryption of plaintext, and ciphertext and authentication data combine through multiplications to an authentication tag.
---
A block diagram, read top to bottom, with three columns. The abbreviation GCM is Galois/Counter Mode. XOR (exclusive-or) is drawn as a circled plus. Boxes with a plain outline are operations; shaded boxes are data. "mult" boxes multiply by $H$.

**Top row (counters).** $\text{Counter}_0$, then an arrow through a box "incr" to $\text{Counter}_1$, then an arrow through a second "incr" to $\text{Counter}_2$.

**Encryption.** Each counter goes down into a box $\text{Enc}_k$.

- $\text{Counter}_1$ goes to $\text{Enc}_k$. Its output is XORed with $\text{Plaintext}_1$. The result is $\text{Ciphertext}_1$.
- $\text{Counter}_2$ goes to $\text{Enc}_k$. Its output is XORed with $\text{Plaintext}_2$. The result is $\text{Ciphertext}_2$.
- The output of the $\text{Enc}_k$ box under $\text{Counter}_0$ goes down the left side to the last XOR.

**Authentication chain.**

1. $\text{Auth Data}_1$ goes into $\text{mult}_H$. Its output is XORed with $\text{Ciphertext}_1$.
2. That result goes into a second $\text{mult}_H$ and is XORed with $\text{Ciphertext}_2$.
3. That result goes down into a third $\text{mult}_H$ and is XORed with $\text{len}(A) || \text{len}(C)$.
4. That result goes into a fourth $\text{mult}_H$.
5. That result is XORed with the output of $\text{Enc}_k$ under $\text{Counter}_0$.
6. The output is $\text{Auth Tag}$.
