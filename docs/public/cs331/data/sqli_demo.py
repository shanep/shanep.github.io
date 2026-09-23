#!/usr/bin/env python3
"""SQL injection demonstration for CS 331, Lab 9.

Builds a small in-memory SQLite database of user accounts, then offers two
login functions that ask exactly the same question of the database:

    login_vulnerable()  -- builds the SQL by pasting strings together
    login_safe()        -- builds the SQL with placeholders (parameterized)

Run it, try the sample inputs, then try your own.  Nothing here touches the
network or a real server: the whole database lives in this process's memory
and disappears when the program exits.

    python3 sqli_demo.py                     # run the built-in demonstration
    python3 sqli_demo.py "alice" "hunter2"   # try one username / password pair

CS 331 -- Computer Security and Information Assurance
"""

from __future__ import annotations

import sqlite3
import sys
from typing import Final, NamedTuple

# ---------------------------------------------------------------------------
# CHANGE THESE.  These are the inputs Lab 9 asks you to experiment with.
# ---------------------------------------------------------------------------

# Step 3 of the lab: replace this with an input that logs you in as alice
# without knowing her password.
INJECTION_ATTEMPT: Final[str] = "alice' -- "

# Step 4 of the lab: this is the payload everybody tries first, and it does NOT
# work against this query.  Work out why (hint: in SQL, AND binds tighter than
# OR), then replace it with one that returns every account in the table.
INJECTION_RETURN_ALL: Final[str] = "' OR '1'='1"

# ---------------------------------------------------------------------------
# The "application" below this line is what you are attacking.  Read it, but
# you only need to change the two strings above.
# ---------------------------------------------------------------------------

SEED_ACCOUNTS: Final[tuple[tuple[str, str, str], ...]] = (
    ("alice", "correct-horse-battery-staple", "admin"),
    ("bob", "p@ssw0rd", "user"),
    ("carol", "letmein2027", "user"),
)


class Account(NamedTuple):
    """One row of the users table."""

    username: str
    role: str


def build_database() -> sqlite3.Connection:
    """Create a fresh in-memory database with three user accounts."""
    connection = sqlite3.connect(":memory:")
    connection.execute(
        "CREATE TABLE users ("
        "  username TEXT PRIMARY KEY,"
        "  password TEXT NOT NULL,"
        "  role     TEXT NOT NULL"
        ")"
    )
    connection.executemany(
        "INSERT INTO users (username, password, role) VALUES (?, ?, ?)",
        SEED_ACCOUNTS,
    )
    connection.commit()
    return connection


def vulnerable_query(username: str, password: str) -> str:
    """Build the login SQL by pasting the user's input straight into the text.

    This is the bug.  Whatever the user types becomes part of the SQL command,
    so a user who types SQL gets to run SQL.
    """
    return (
        "SELECT username, role FROM users "
        f"WHERE username = '{username}' AND password = '{password}'"
    )


def login_vulnerable(
    connection: sqlite3.Connection, username: str, password: str
) -> list[Account]:
    """Log in using string concatenation.  Vulnerable to SQL injection."""
    sql = vulnerable_query(username, password)
    print(f"    SQL sent to the database: {sql}")
    rows = connection.execute(sql).fetchall()
    return [Account(str(row[0]), str(row[1])) for row in rows]


def login_safe(
    connection: sqlite3.Connection, username: str, password: str
) -> list[Account]:
    """Log in using placeholders.  The input can never become SQL.

    The '?' marks are not string substitution.  The database receives the
    query and the values separately, so the values are only ever compared
    against column contents -- never parsed as commands.
    """
    sql = "SELECT username, role FROM users WHERE username = ? AND password = ?"
    print(f"    SQL sent to the database: {sql}")
    print(f"    Values sent separately:   {(username, password)!r}")
    rows = connection.execute(sql, (username, password)).fetchall()
    return [Account(str(row[0]), str(row[1])) for row in rows]


def describe(result: list[Account]) -> str:
    """Turn a query result into a one-line verdict."""
    if not result:
        return "LOGIN FAILED (no rows returned)"
    who = ", ".join(f"{account.username}/{account.role}" for account in result)
    return f"LOGIN SUCCEEDED as {who}  [{len(result)} row(s)]"


def attempt(
    connection: sqlite3.Connection, label: str, username: str, password: str
) -> None:
    """Run one username/password pair through both login functions."""
    print(f"\n{label}")
    print(f"  username: {username!r}")
    print(f"  password: {password!r}")

    print("  -- vulnerable version (string concatenation) --")
    try:
        print(f"    {describe(login_vulnerable(connection, username, password))}")
    except sqlite3.Error as error:
        print(f"    DATABASE ERROR: {error}")

    print("  -- safe version (parameterized query) --")
    try:
        print(f"    {describe(login_safe(connection, username, password))}")
    except sqlite3.Error as error:
        print(f"    DATABASE ERROR: {error}")


def main(argv: list[str]) -> int:
    connection = build_database()

    if len(argv) == 3:
        attempt(connection, "YOUR INPUT", argv[1], argv[2])
        connection.close()
        return 0

    if len(argv) != 1:
        print(__doc__)
        connection.close()
        return 2

    print("=" * 72)
    print("SQL INJECTION DEMONSTRATION -- CS 331 Lab 9")
    print("=" * 72)
    print("\nThe database holds three accounts: alice (admin), bob, carol.")

    attempt(
        connection,
        "1. An honest login with the correct password.",
        "alice",
        "correct-horse-battery-staple",
    )
    attempt(
        connection,
        "2. An honest login with the WRONG password.",
        "alice",
        "guess",
    )
    attempt(
        connection,
        "3. INJECTION_ATTEMPT: log in as alice without her password."
        "  (This one works -- it is the worked example.)",
        INJECTION_ATTEMPT,
        "any-password-at-all",
    )
    attempt(
        connection,
        "4. INJECTION_RETURN_ALL: try to return every account in the table."
        "  (This one FAILS as shipped.  Lab 9 asks you to fix it.)",
        INJECTION_RETURN_ALL,
        "any-password-at-all",
    )

    print("\n" + "=" * 72)
    print("Compare the two 'SQL sent to the database' lines in cases 3 and 4.")
    print("Case 4 fails because SQL evaluates AND before OR, so the password")
    print("check is still part of the condition.  Read case 4's SQL closely.")
    print("In the vulnerable version your input CHANGED THE COMMAND.")
    print("In the safe version the command never changed -- only the values did.")
    print("=" * 72)

    connection.close()
    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv))
