#!/usr/bin/env python3
"""Run every shell command printed in the CS425 activity documents.

The activity worksheets and answer keys are full of commands students type
verbatim. Nothing else in this repo ever executes them: `verify` exercises the
testbed, not the paper, which is how `dig +short ghost.cs425.lab` once shipped
on a worksheet even though it prints an empty line and tells a student nothing.

This closes that gap. It pulls every command out of the HTML, runs it against a
live testbed, and checks the result against a stated expectation. The important
half is the *stated* part: a command with no entry in EXPECTATIONS below is a
failure, not a skip, so changing a document forces whoever changed it to say
what the new command should do. Writing that sentence down is what catches a
command that runs fine and teaches nothing.

    check-commands.py --list                       # what would be run
    check-commands.py --alpha IP --bravo IP        # run and check

Exit status is 0 only when every command met its expectation.
"""

from __future__ import annotations

import argparse
import html
import re
import subprocess
import sys
from dataclasses import dataclass, field
from pathlib import Path

HERE = Path(__file__).resolve().parent

DOCS = [
    "a2-connectivity-triage.html",
    "a2-connectivity-triage-key.html",
    "a3-name-the-layer.html",
    "a3-name-the-layer-key.html",
]

# Commands that cannot run on the machine grading the check. They are reported
# as skipped-by-design rather than dropped, so a typo in one is still visible in
# the listing even though nothing can execute it here.
FOREIGN = {
    "nslookup": "Windows only",
    "Test-NetConnection": "Windows only",
    "Resolve-DnsName": "Windows only",
}

# A command block also holds sample output, platform labels and prose. Rather
# than trying to describe everything that is not a command, require that a line
# start like one: a known tool, a shell assignment, or a function definition.
RUNNABLE_HEAD = re.compile(
    r"^(dig|ping|nc|curl|probe|ssh|sudo|tcpdump|nslookup|Test-NetConnection"
    r"|Resolve-DnsName|\./scripts/|[A-Z][A-Z0-9_]*=|probe\(\))"
)

# "Linux  nc -vz ..." and "macOS  nc -vz ..." share a table cell.
PLATFORM_PREFIX = re.compile(r"^(Linux|macOS|Windows)\s+(?=\S)")

# Spacing inside a documented command is cosmetic alignment, not meaning, so
# both the extracted text and the expectation keys are collapsed before lookup.
def norm(cmd: str) -> str:
    return re.sub(r"\s+", " ", cmd).strip()


# --------------------------------------------------------------- expectations

@dataclass(frozen=True)
class Expect:
    """What a command must do to count as correct.

    `output` is the point of the whole exercise: a command the document presents
    as informative must actually print something. `empty` is its opposite, and
    has to be stated deliberately.
    """
    kind: str                       # output | empty | match | define
    pattern: str = ""               # regex, for kind == match
    exit_code: int | None = 0       # None means "any status is fine"
    why: str = ""


# Keyed by the command with $ALPHA/$BRAVO left symbolic, exactly as it appears
# in the documents. Every extracted command must appear here.
EXPECTATIONS: dict[str, Expect] = {
    # ---- setup, worksheet page 1 -------------------------------------------
    "ALPHA=203.0.113.10": Expect("define", why="assignment, prints nothing"),
    "BRAVO=203.0.113.42": Expect("define", why="assignment, prints nothing"),
    "ALPHA=203.0.113.10     # replace with YOUR alpha address":
        Expect("define", why="assignment, prints nothing"),
    "BRAVO=203.0.113.42     # replace with YOUR bravo address":
        Expect("define", why="assignment, prints nothing"),
    "ALPHA=203.0.113.10          # replace with YOUR alpha address from the card above":
        Expect("define", why="A3 assignment, prints nothing"),
    "probe() { curl -sS -o /dev/null -m 8 -w 'connect=%{time_connect} total=%{time_total} code=%{http_code}\\n' \"http://$1:$2/\"; }":
        Expect("define", why="function definition, prints nothing on success"),

    # ---- the four probes, shown against station 1 ---------------------------
    "dig +short alpha.cs425.lab @$ALPHA -p 5353":
        Expect("match", r"^\d+\.\d+\.\d+\.\d+$",
               why="the table promises an address; +short on a name with no "
                   "answer prints nothing, which is the bug this file exists for"),
    "dig alpha.cs425.lab @$ALPHA -p 5353":
        Expect("match", r"status: NOERROR", why="long form shows the status field"),
    "ping -c 3 $ALPHA":
        Expect("match", r"3 packets received", why="ALPHA answers ICMP"),
    "nc -vz -w 5 $ALPHA 8080":
        Expect("match", r"succeeded", why="baseline port is open (GNU nc flag)"),
    "nc -vz -G 5 $ALPHA 8080":
        Expect("match", r"succeeded", why="baseline port is open (BSD nc flag)"),
    "curl -sS -o /dev/null -m 8 -w 'connect=%{time_connect} total=%{time_total} code=%{http_code}\\n' http://$ALPHA:8080/":
        Expect("match", r"code=200", why="baseline serves a page"),
    "probe $ALPHA 8080":
        Expect("match", r"code=200", why="step 3 tells students to expect exactly this"),

    # ---- station 4 and 5, where the two dig forms matter --------------------
    "dig ghost.cs425.lab @$ALPHA -p 5353     # no +short, you need the status line":
        Expect("match", r"status: NXDOMAIN",
               why="station 4 is diagnosed from the status field, which +short hides"),
    "dig +short mirage.cs425.lab @$ALPHA -p 5353    # this one does answer":
        Expect("match", r"^10\.42\.13\.37$", why="station 5 resolves into RFC 1918"),

    # ---- A3 round 2 ---------------------------------------------------------
    "nc -vz -w 5 $ALPHA 8084     # macOS: -G 5 instead of -w 5":
        Expect("match", r"succeeded", why="station 7 completes the handshake"),
    "curl -sS -o /dev/null -m 8 -w 'connect=%{time_connect} total=%{time_total}\\n' http://$ALPHA:8084/":
        Expect("match", r"connect=0\.0[0-9]+", exit_code=28,
               why="station 7 connects, then the application never writes"),

    # ---- key transcripts ----------------------------------------------------
    "ALPHA=35.90.160.84        # yours will differ, every launch":
        Expect("define", why="key transcript header"),
    "BRAVO=18.236.210.3": Expect("define", why="key transcript header"),
    "ALPHA=35.90.160.84": Expect("define", why="key transcript header"),
    "curl -sS -o /dev/null -m 8 -w 'connect=%{time_connect} total=%{time_total} code=%{http_code}\\n' http://$ALPHA:8080/":
        Expect("match", r"code=200", why="key demo, station 1"),
    "ping -c 3 $ALPHA": Expect("match", r"3 packets received", why="key demo, station 1"),
    "curl -sS -o /dev/null -m 6 -w 'connect=%{time_connect} total=%{time_total}\\n' http://$ALPHA:8081/":
        Expect("match", r"connect=0\.000000", exit_code=28,
               why="key demo, station 2: the handshake never happened"),
    "nc -vz -G 6 $ALPHA 8081":
        Expect("match", r"Operation timed out", exit_code=None,
               why="key demo, station 2, and the -G flag is the point"),
    "ping -c 2 $ALPHA": Expect("match", r"2 packets received", why="key demo: the host is up"),
    "curl -sS -o /dev/null -m 6 http://$ALPHA:8082/":
        Expect("empty", exit_code=7, why="key demo, station 3: refused, no stdout"),
    "nc -vz -G 6 $ALPHA 8082":
        Expect("match", r"Connection refused", exit_code=None,
               why="key demo, station 3: nc names the reset outright"),
    "dig ghost.cs425.lab @$ALPHA -p 5353":
        Expect("match", r"status: NXDOMAIN", why="key demo, station 4"),
    "dig +short mirage.cs425.lab @$ALPHA -p 5353":
        Expect("match", r"^10\.42\.13\.37$", why="key demo, station 5"),
    "curl -sS -o /dev/null -m 6 http://10.42.13.37:8080/":
        Expect("empty", exit_code=28, why="key demo, station 5: RFC 1918 goes nowhere"),
    "dig +short alpha.cs425.lab @$ALPHA -p 5353   # control: the zone works":
        Expect("match", r"^\d+\.\d+\.\d+\.\d+$", why="key demo: the control query"),
    "ping -c 3 $BRAVO":
        Expect("match", r"0 packets received", exit_code=None,
               why="key demo, station 6: BRAVO drops ICMP"),
    "curl -sS -o /dev/null -m 8 -w 'connect=%{time_connect} code=%{http_code}\\n' http://$BRAVO:8080/":
        Expect("match", r"code=200", why="key demo, station 6: the service is fine"),
    "nc -vz -G 5 $ALPHA 8084":
        Expect("match", r"succeeded", why="key demo, station 7"),
    "curl -sS -o /dev/null -m 6 -w 'connect=%{time_connect}\\n' http://$ALPHA:8084/":
        Expect("match", r"connect=0\.0[0-9]+", exit_code=28, why="key demo, station 7"),
    "probe $ALPHA 8080\nconnect=0.022526 total=0.065459 code=200":
        Expect("match", r"code=200", why="worksheet step 3, with its sample output"),
}

# Commands the check deliberately does not run, with the reason shown.
UNRUNNABLE_RAW = {
    "./scripts/cs425/a2-connectivity-triage.sh verify   # expect 9 passed, 0 failed":
        "would recurse into the caller",
    "./scripts/cs425/a2-connectivity-triage.sh card     # the two IPs, for the board":
        "prints addresses, nothing to assert",
    "./scripts/cs425/a2-connectivity-triage.sh ssh -- sudo tcpdump -nni any 'tcp port 8081 or tcp port 8082'":
        "interactive capture on the instance",
}

# Both tables are keyed by the normalized form, so alignment spacing in a
# document never has to be mirrored byte for byte in this file.
EXPECTATIONS = {norm(k): v for k, v in EXPECTATIONS.items()}
UNRUNNABLE = {norm(k): v for k, v in UNRUNNABLE_RAW.items()}


# ------------------------------------------------------------------ extraction

TAG = re.compile(r"<[^>]+>")


def _text(fragment: str) -> str:
    fragment = fragment.replace("<br>", "\n").replace("<br/>", "\n")
    return html.unescape(TAG.sub("", fragment)).replace(" ", " ")


@dataclass
class Command:
    raw: str
    source: str
    lineno: int
    foreign: str | None = None


def extract(path: Path) -> list[Command]:
    src = path.read_text()
    found: list[Command] = []

    def add(chunk: str, offset: int, foreign: str | None = None) -> None:
        text = _text(chunk)
        # A key transcript prefixes each command with "$ " and may continue
        # across lines with a trailing backslash.
        text = re.sub(r"\\\n\s+", " ", text)
        for line in text.splitlines():
            line = line.strip()
            if line.startswith("$ "):
                line = line[2:].strip()
            line = PLATFORM_PREFIX.sub("", line)
            if not RUNNABLE_HEAD.match(line):
                continue
            lineno = src.count("\n", 0, offset) + 1
            found.append(Command(raw=norm(line), source=path.name,
                                 lineno=lineno, foreign=foreign))

    for m in re.finditer(r'<pre class="setup">(.*?)</pre>', src, re.S):
        add(m.group(1), m.start())
    # Only the probe table's cells are commands. The keys have a mechanism table
    # using the same monospace class whose cells are targets, not commands.
    for tbl in re.finditer(r'<table class="probes">(.*?)</table>', src, re.S):
        for m in re.finditer(r'<td class="mono([^"]*)"[^>]*>(.*?)</td>', tbl.group(1), re.S):
            add(m.group(2), tbl.start() + m.start(),
                foreign="Windows only" if "win" in m.group(1) else None)
    for m in re.finditer(r'<span class="cmd">(.*?)</span>', src, re.S):
        add(m.group(1), m.start())
    return found


def is_foreign(c: Command) -> str | None:
    if c.foreign:
        return c.foreign
    head = c.raw.split()[0] if c.raw.split() else ""
    for name, why in FOREIGN.items():
        if head == name:
            return why
    return None


# --------------------------------------------------------------------- running

def run(cmd: str, alpha: str, bravo: str) -> tuple[int, str]:
    """Run one documented command in a shell that has ALPHA, BRAVO and probe."""
    preamble = (
        f"ALPHA={alpha}\n"
        f"BRAVO={bravo}\n"
        "probe() { curl -sS -o /dev/null -m 8 "
        "-w 'connect=%{time_connect} total=%{time_total} code=%{http_code}\\n' "
        '"http://$1:$2/"; }\n'
    )
    # A worksheet snippet may carry its own sample output on the next line.
    cmd = cmd.split("\n")[0]
    proc = subprocess.run(
        ["bash", "-c", preamble + cmd],
        capture_output=True, text=True, timeout=120,
    )
    return proc.returncode, (proc.stdout + proc.stderr).strip()


def judge(exp: Expect, code: int, out: str) -> str | None:
    if exp.exit_code is not None and code != exp.exit_code:
        return f"exit {code}, wanted {exp.exit_code}"
    if exp.kind == "define":
        return None if not out else f"expected no output, got {out[:60]!r}"
    if exp.kind == "empty":
        return None if not out else f"expected no stdout, got {out[:60]!r}"
    if exp.kind == "output":
        return None if out else "printed nothing, but the document promises output"
    if exp.kind == "match":
        if not out:
            return "printed nothing, but the document promises output"
        if not re.search(exp.pattern, out, re.M):
            return f"output does not match /{exp.pattern}/: {out[:80]!r}"
        return None
    return f"unknown expectation kind {exp.kind!r}"


# ------------------------------------------------------------------------ main

def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--alpha")
    ap.add_argument("--bravo")
    ap.add_argument("--list", action="store_true",
                    help="print the commands found and their expectations, run nothing")
    args = ap.parse_args()

    commands: list[Command] = []
    for name in DOCS:
        path = HERE / name
        if not path.exists():
            print(f"  MISSING  {name}")
            return 1
        commands.extend(extract(path))

    # Deduplicate, keeping the first place each command appears.
    seen: dict[str, Command] = {}
    for c in commands:
        seen.setdefault(c.raw, c)
    ordered = list(seen.values())

    if args.list:
        for c in ordered:
            state = ("foreign" if is_foreign(c)
                     else "unrunnable" if c.raw in UNRUNNABLE
                     else "expected" if c.raw in EXPECTATIONS
                     else "NO EXPECTATION")
            print(f"  [{state:>14}]  {c.source}:{c.lineno}  {c.raw[:96]}")
        print(f"\n  {len(ordered)} distinct commands")
        missing = [c for c in ordered if not is_foreign(c)
                   and c.raw not in UNRUNNABLE and c.raw not in EXPECTATIONS]
        return 1 if missing else 0

    if not args.alpha or not args.bravo:
        ap.error("--alpha and --bravo are required unless --list is given")

    passed = failed = skipped = 0
    for c in ordered:
        why = is_foreign(c)
        if why:
            print(f"  SKIP  {c.raw[:70]}  ({why})")
            skipped += 1
            continue
        if c.raw in UNRUNNABLE:
            print(f"  SKIP  {c.raw[:70]}  ({UNRUNNABLE[c.raw]})")
            skipped += 1
            continue
        exp = EXPECTATIONS.get(c.raw)
        if exp is None:
            print(f"  FAIL  {c.source}:{c.lineno}  no expectation is stated for:")
            print(f"        {c.raw}")
            print( "        Add it to EXPECTATIONS in check-commands.py and say")
            print( "        what a student should see. That sentence is the check.")
            failed += 1
            continue
        code, out = run(c.raw.replace("$ALPHA", args.alpha).replace("$BRAVO", args.bravo),
                        args.alpha, args.bravo)
        problem = judge(exp, code, out)
        if problem:
            print(f"  FAIL  {c.source}:{c.lineno}  {c.raw[:70]}")
            print(f"        {problem}")
            print(f"        expected because: {exp.why}")
            failed += 1
        else:
            print(f"  PASS  {c.raw[:76]}")
            passed += 1

    print(f"\n  {passed} passed, {failed} failed, {skipped} skipped")
    return 1 if failed else 0


if __name__ == "__main__":
    sys.exit(main())
