#!/usr/bin/env python3
"""Password storage and guessing demonstration for CS 331, week 5.

This is the worked example for the Authentication module.  It shows three
things you can then argue about in Discussion 3:

  1. What a "fast" hash (one pass of SHA-256) costs an attacker per guess.
  2. What a "slow" hash (PBKDF2 with many iterations) costs per guess.
  3. What a per-user salt changes, and what it does not change.

Nothing here is a real attack.  The "stolen database" is three accounts made
up for this example, and the "wordlist" is twenty common passwords.

    python3 password_demo.py

Standard library only -- nothing to install.

CS 331 -- Computer Security and Information Assurance
"""

from __future__ import annotations

import hashlib
import secrets
import time
from typing import Final, NamedTuple

# ---------------------------------------------------------------------------
# CHANGE THESE and re-run to see how the numbers move.
# ---------------------------------------------------------------------------

# How much work PBKDF2 does per guess.  Raise it and watch the attack slow
# down.  NIST SP 800-63B-4 calls for a deliberately expensive derivation here.
PBKDF2_ITERATIONS: Final[int] = 600_000

# Add your own guesses to the wordlist and see whether they crack an account.
EXTRA_GUESSES: Final[tuple[str, ...]] = ()

# ---------------------------------------------------------------------------

WORDLIST: Final[tuple[str, ...]] = (
    "123456", "password", "12345678", "qwerty", "123456789",
    "12345", "1234", "111111", "1234567", "dragon",
    "letmein", "monkey", "abc123", "football", "iloveyou",
    "admin", "welcome", "login", "princess", "hunter2",
)

# The three accounts in our imaginary stolen database.  Two of these passwords
# are in the wordlist above; one is not.
ACCOUNTS: Final[tuple[tuple[str, str], ...]] = (
    ("alice", "hunter2"),
    ("bob", "letmein"),
    ("carol", "correct-horse-battery-staple"),
)


class CrackResult(NamedTuple):
    """What a guessing run found, and what it cost."""

    cracked: dict[str, str]
    guesses: int
    seconds: float

    @property
    def guesses_per_second(self) -> float:
        return self.guesses / self.seconds if self.seconds > 0 else float("inf")


def fast_hash(password: str, salt: bytes) -> bytes:
    """One pass of SHA-256.  This is what NOT to do for password storage."""
    return hashlib.sha256(salt + password.encode("utf-8")).digest()


def slow_hash(password: str, salt: bytes) -> bytes:
    """PBKDF2-HMAC-SHA256.  Deliberately expensive, by design."""
    return hashlib.pbkdf2_hmac(
        "sha256", password.encode("utf-8"), salt, PBKDF2_ITERATIONS
    )


def crack(
    stored: dict[str, tuple[bytes, bytes]],
    wordlist: tuple[str, ...],
    use_slow_hash: bool,
) -> CrackResult:
    """Try every word in the wordlist against every stored account.

    `stored` maps a username to (salt, hash).  Because each account has its own
    salt, the attacker cannot test one guess against all accounts at once --
    the work is per account, per guess.
    """
    hash_function = slow_hash if use_slow_hash else fast_hash
    cracked: dict[str, str] = {}
    guesses = 0
    start = time.perf_counter()

    for username, (salt, expected) in stored.items():
        for candidate in wordlist:
            guesses += 1
            if hash_function(candidate, salt) == expected:
                cracked[username] = candidate
                break

    return CrackResult(cracked, guesses, time.perf_counter() - start)


def store_accounts(use_slow_hash: bool) -> dict[str, tuple[bytes, bytes]]:
    """Hash each account's password with a fresh random 16-byte salt."""
    hash_function = slow_hash if use_slow_hash else fast_hash
    stored: dict[str, tuple[bytes, bytes]] = {}
    for username, password in ACCOUNTS:
        salt = secrets.token_bytes(16)
        stored[username] = (salt, hash_function(password, salt))
    return stored


def report(label: str, result: CrackResult, total_accounts: int) -> None:
    print(f"\n{label}")
    print(f"  guesses tried:      {result.guesses}")
    print(f"  wall-clock time:    {result.seconds:.3f} s")
    print(f"  guesses per second: {result.guesses_per_second:,.0f}")
    print(f"  accounts cracked:   {len(result.cracked)} of {total_accounts}")
    for username, password in sorted(result.cracked.items()):
        print(f"    {username}: {password!r}")
    if not result.cracked:
        print("    (none)")


def show_salt_effect() -> None:
    """Two users with the SAME password get different stored hashes."""
    print("\n" + "-" * 72)
    print("What the salt changes")
    print("-" * 72)
    shared_password = "letmein"
    salt_one = secrets.token_bytes(16)
    salt_two = secrets.token_bytes(16)
    print(f"  Two accounts both chose the password {shared_password!r}.")
    print(f"  Stored hash for account 1: {fast_hash(shared_password, salt_one).hex()[:32]}...")
    print(f"  Stored hash for account 2: {fast_hash(shared_password, salt_two).hex()[:32]}...")
    print("\n  The stored values differ, so an attacker who steals the database")
    print("  cannot tell that the two accounts share a password, and cannot")
    print("  build one precomputed table that covers both.")
    print("  The salt does NOT make either password harder to guess. Guessing")
    print("  'letmein' still cracks both -- it just costs two runs, not one.")


def main() -> int:
    wordlist = WORDLIST + EXTRA_GUESSES

    print("=" * 72)
    print("PASSWORD STORAGE AND GUESSING -- CS 331 week 5")
    print("=" * 72)
    print(f"\nStolen database: {len(ACCOUNTS)} accounts")
    print(f"Attacker's wordlist: {len(wordlist)} common passwords")
    print(f"PBKDF2 iterations: {PBKDF2_ITERATIONS:,}")

    fast_stored = store_accounts(use_slow_hash=False)
    report(
        "STORED WITH A FAST HASH (one pass of SHA-256):",
        crack(fast_stored, wordlist, use_slow_hash=False),
        len(ACCOUNTS),
    )

    slow_stored = store_accounts(use_slow_hash=True)
    report(
        f"STORED WITH A SLOW HASH (PBKDF2, {PBKDF2_ITERATIONS:,} iterations):",
        crack(slow_stored, wordlist, use_slow_hash=True),
        len(ACCOUNTS),
    )

    print("\n  Both runs cracked the SAME accounts.  A slow hash does not stop")
    print("  a guess from being correct -- it changes how many guesses per")
    print("  second an attacker can afford.  Scale both numbers up to a")
    print("  wordlist of ten million and the difference is the whole story.")

    show_salt_effect()

    print("\n" + "=" * 72)
    print("carol was never cracked by either run.  Her password is not in the")
    print("wordlist.  Length and unpredictability beat storage tricks; storage")
    print("choices decide what happens after the database leaks.")
    print("=" * 72)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
