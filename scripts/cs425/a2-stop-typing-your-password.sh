#!/usr/bin/env bash
#
# a2-stop-typing-your-password.sh - documents for CS425 activity A2.
#
# A2 is instructor led, runs against onyx.boisestate.edu and the students' own
# laptops, and needs no testbed, so this only renders the worksheet and the key.
# The renderer itself lives in a4-connectivity-triage.sh, which is where the two
# documents that do need a testbed are handled; pointing at it here keeps one
# implementation rather than five.
#
set -euo pipefail

HERE=$(cd "$(dirname "$0")" && pwd)
ROOT=$(cd "$HERE/../.." && pwd)

export HANDOUT_HTML="$HERE/a2-stop-typing-your-password.html"
export HANDOUT_PDF="$ROOT/docs/public/cs425/activities/a2-worksheet.pdf"
export HANDOUT_PAGES=1

# The key stays out of docs/public, which is copied verbatim onto the website.
export KEY_HTML="$HERE/a2-stop-typing-your-password-key.html"
export KEY_PDF="$HERE/a2-stop-typing-your-password-key.pdf"
export KEY_PAGES=3

case "${1:-}" in
    handout|key|-h|--help) exec "$HERE/a4-connectivity-triage.sh" "$@" ;;
    *) printf '%s: A2 needs no testbed; the commands are "handout" and "key"\n' \
           "$(basename "$0")" >&2; exit 1 ;;
esac
