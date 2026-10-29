The **OW-PASS** definition:

$$\mathsf{Adv}^{\mathsf{OW-PASS}}(A,t) = \Pr\left[\begin{array}{l} \mathfrak{k} \leftarrow \mathsf{KeyGen}(),\ m^* \leftarrow \mathcal{M},\ r \leftarrow \mathcal{R}, \\ c^* \leftarrow \mathsf{Enc}(m, \mathfrak{k}; r),\ m \leftarrow A(c^*) :\ m = m^* \end{array}\right] - \frac{1}{|\mathcal{M}|}.$$

One reads the probability statement as the being the probability that $m = m^*$, given that $m$ and $m^*$ are produced by first sampling $\mathfrak{k}$ from algorithm $\mathsf{KeyGen}()$, then sampling $m^*$ and $r$ from the spaces $\mathcal{M}$ and $\mathcal{R}$ at random, then determining $c^*$ by calling $\mathsf{Enc}(m, \mathfrak{k}; r)$ and finally passing $c^*$ to the Adversary $A$, and getting $m$ in return.

The **IND-PASS** symmetric key encryption definition:

$$\mathsf{Adv}^{\mathsf{IND-PASS}}(A,t) = \Pr\left[\begin{array}{l} \mathfrak{k} \leftarrow \mathsf{KeyGen}(),\ b \leftarrow \{0,1\},\ m_0,\ m_1,\ \mathsf{state} \leftarrow A_1(), \\ r \leftarrow \mathcal{R},\ c^* \leftarrow \mathsf{Enc}(m_b, \mathfrak{k}; r),\ b' \leftarrow A_2(c^*, \mathsf{state}) :\ b = b' \end{array}\right] - \frac{1}{2}.$$

The **IND-CCA** public key encryption definition:

$$\mathsf{Adv}^{\mathsf{IND-CCA}}(A,t) = \Pr\left[\begin{array}{l} (\mathfrak{pk}, \mathfrak{sk}) \leftarrow \mathsf{KeyGen}(),\ b \leftarrow \{0,1\},\ m_0,\ m_1, \mathsf{state} \leftarrow A_1^{\mathsf{Dec}(\cdot,\mathfrak{sk})}(\mathfrak{pk}), \\ r \leftarrow \mathcal{R},\ c^* \leftarrow \mathsf{Enc}(m_b, \mathfrak{pk}; r),\ b' \leftarrow A_2^{\mathsf{Dec}(\cdot,\mathfrak{sk})}(c^*, \mathsf{state}) :\ b = b' \end{array}\right] - \frac{1}{2}.$$

The **UF-CMA** signature security definition:

$$\mathsf{Adv}^{\mathsf{UF-CMA}}(A,t) = \Pr\left[(\mathfrak{pk}, \mathfrak{sk}) \leftarrow \mathsf{KeyGen}(),\ (m, \sigma) \leftarrow A^{\mathsf{Sign}(\cdot,\mathfrak{sk})}(\mathfrak{pk}) :\ \mathsf{Verify}(m, \sigma, \mathfrak{pk}) = \mathsf{true}\right].$$

**IND-CCA KEM Security Definition:**

$$\mathsf{Adv}^{\mathsf{IND-CCA}}(A,t) = \Pr\left[\begin{array}{l} (\mathfrak{pk}, \mathfrak{sk}) \leftarrow \mathsf{KEMKeyGen}(),\ b \leftarrow \{0,1\},\ \mathfrak{k}_0 \leftarrow \mathcal{K},\ r \leftarrow \mathcal{R}, \\ \mathfrak{k}_1, c^* \leftarrow \mathsf{KEMEnc}(\mathfrak{pk}; r),\ b' \leftarrow A_2^{\mathsf{KEMDec}(\cdot,\mathfrak{sk})}(c^*, \mathfrak{k}_b) :\ b = b' \end{array}\right] - \frac{1}{2}.$$
