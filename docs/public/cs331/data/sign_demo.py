#!/usr/bin/env python3
"""Hashing and digital signature demonstration for CS 331, Lab 5.

Four parts:

  Part 1 -- Hash functions.  What changing one character does to a digest.
  Part 2 -- A digital signature.  Sign a message, verify it, tamper with it,
            watch verification fail.
  Part 3 -- Whose key?  Verify the same signature against the wrong public key.
  Part 4 -- Shared-secret MAC vs public-key signature: what each one costs and
            what each one proves.

Requires the `cryptography` package (installed in Lab 0):

    pip install cryptography
    python3 sign_demo.py

CS 331 -- Computer Security and Information Assurance
"""

from __future__ import annotations

import hashlib
import hmac
import secrets
from typing import Final

from cryptography.exceptions import InvalidSignature
from cryptography.hazmat.primitives.asymmetric.ed25519 import (
    Ed25519PrivateKey,
    Ed25519PublicKey,
)

# ---------------------------------------------------------------------------
# CHANGE THESE and re-run.
# ---------------------------------------------------------------------------

# Part 1: two messages that differ by as little as you like.
HASH_INPUT_A: Final[str] = "Transfer $100 to Bob"
HASH_INPUT_B: Final[str] = "Transfer $900 to Bob"

# Part 2: the message that gets signed, and the tampered version an attacker
# substitutes.  Try making TAMPERED identical to SIGNED and see what happens.
SIGNED_MESSAGE: Final[bytes] = b"Grade for student 12345: A"
TAMPERED_MESSAGE: Final[bytes] = b"Grade for student 12345: F"

# ---------------------------------------------------------------------------


def bit_difference(left: bytes, right: bytes) -> int:
    """Count how many bits differ between two equal-length byte strings."""
    return sum(bin(a ^ b).count("1") for a, b in zip(left, right))


def part_one() -> None:
    print("\n" + "=" * 72)
    print("PART 1 -- What a hash function does")
    print("=" * 72)

    digest_a = hashlib.sha256(HASH_INPUT_A.encode()).digest()
    digest_b = hashlib.sha256(HASH_INPUT_B.encode()).digest()

    print(f"  Input A: {HASH_INPUT_A!r}")
    print(f"  Input B: {HASH_INPUT_B!r}")
    changed_chars = sum(
        1 for a, b in zip(HASH_INPUT_A, HASH_INPUT_B) if a != b
    ) + abs(len(HASH_INPUT_A) - len(HASH_INPUT_B))
    print(f"  Characters that differ: {changed_chars}")

    print(f"\n  SHA-256(A) = {digest_a.hex()}")
    print(f"  SHA-256(B) = {digest_b.hex()}")

    differing_bits = bit_difference(digest_a, digest_b)
    print(f"\n  Bits that differ in the two digests: {differing_bits} out of 256")
    print("  Changing a few characters changed about half the output bits.")
    print("  You cannot look at two digests and tell how similar the inputs")
    print("  were -- which is exactly the property you want.")

    print(f"\n  Same input, run again: {hashlib.sha256(HASH_INPUT_A.encode()).hexdigest()}")
    print("  A hash is deterministic. There is no key and no secret involved,")
    print("  so a hash by itself proves nothing about WHO produced a message.")


def part_two(private_key: Ed25519PrivateKey, public_key: Ed25519PublicKey) -> bytes:
    print("\n" + "=" * 72)
    print("PART 2 -- Signing, verifying, and tampering")
    print("=" * 72)

    signature = private_key.sign(SIGNED_MESSAGE)
    print(f"  Message:   {SIGNED_MESSAGE!r}")
    print(f"  Signature: {signature.hex()[:48]}... ({len(signature)} bytes)")

    print("\n  Verifying the ORIGINAL message against the signature:")
    try:
        public_key.verify(signature, SIGNED_MESSAGE)
        print("    VALID -- this message was signed by the holder of the private key.")
    except InvalidSignature:
        print("    INVALID -- this should not happen.")

    print(f"\n  An attacker substitutes: {TAMPERED_MESSAGE!r}")
    print("  Verifying the TAMPERED message against the same signature:")
    try:
        public_key.verify(signature, TAMPERED_MESSAGE)
        print("    VALID -- the tampering was not detected.")
    except InvalidSignature:
        print("    INVALID -- the signature does not match this message.")
        print("    The attacker cannot produce a new signature without the")
        print("    private key, and cannot reuse the old one on new text.")

    return signature


def part_three(signature: bytes) -> None:
    print("\n" + "=" * 72)
    print("PART 3 -- What a valid signature actually tells you")
    print("=" * 72)

    impostor_public_key = Ed25519PrivateKey.generate().public_key()
    print("  Verifying the SAME signature and the SAME message, but against a")
    print("  different person's public key:")
    try:
        impostor_public_key.verify(signature, SIGNED_MESSAGE)
        print("    VALID -- this should not happen.")
    except InvalidSignature:
        print("    INVALID.")

    print("\n  So a valid signature tells you two things:")
    print("    1. The message has not changed since it was signed.")
    print("    2. It was signed by whoever holds the matching private key.")
    print("\n  It does NOT tell you that the message is true, that the signer")
    print("  is who they claim to be, or that the key has not been stolen.")
    print("  Binding a key to a real-world identity is a separate problem --")
    print("  that is what certificates are for, in week 10.")


def part_four() -> None:
    print("\n" + "=" * 72)
    print("PART 4 -- Shared secret vs. key pair")
    print("=" * 72)

    message = b"quarterly numbers attached"

    # Symmetric: one secret, known to both sides.
    shared_secret = secrets.token_bytes(32)
    tag = hmac.new(shared_secret, message, hashlib.sha256).digest()
    print("  HMAC-SHA256 (symmetric, one shared secret):")
    print(f"    tag: {tag.hex()[:48]}... ({len(tag)} bytes)")
    print(f"    verifies: {hmac.compare_digest(tag, hmac.new(shared_secret, message, hashlib.sha256).digest())}")
    print("    Both sides hold the same secret. Either side could have made")
    print("    this tag, so it cannot settle a dispute between them.")

    # Asymmetric: private key signs, public key verifies.
    private_key = Ed25519PrivateKey.generate()
    signature = private_key.sign(message)
    print("\n  Ed25519 signature (public key, two different keys):")
    print(f"    signature: {signature.hex()[:48]}... ({len(signature)} bytes)")
    print("    Only the private key could have produced it, and anybody")
    print("    holding the public key can check it. That difference is what")
    print("    makes signatures useful between parties who do not trust")
    print("    each other, and what makes them slower and more complicated.")

    print("\n  Key distribution is the real trade-off:")
    print("    symmetric  -- n parties who all talk to each other need")
    print("                  n*(n-1)/2 shared secrets, each delivered securely.")
    print("    public key -- each party publishes one public key. The hard")
    print("                  part moves to proving whose key is whose.")


def main() -> int:
    print("=" * 72)
    print("HASHING AND DIGITAL SIGNATURES -- CS 331 Lab 5")
    print("=" * 72)

    private_key = Ed25519PrivateKey.generate()
    public_key = private_key.public_key()

    part_one()
    signature = part_two(private_key, public_key)
    part_three(signature)
    part_four()

    print("\n" + "=" * 72)
    print("Done.  Lab 5 asks you to paste the Part 1 and Part 2 output and")
    print("explain, in your own words, what a failed verification proves.")
    print("=" * 72)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
