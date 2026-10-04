#!/usr/bin/env bash
#
# a9-who-are-you-talking-to.sh - documents for CS425 activity A9.
#
# A9 is instructor led and runs on onyx.boisestate.edu, so it needs no testbed and
# this only renders the worksheet and the key, through the shared
# render-handout.sh.
#
set -euo pipefail

HERE=$(cd "$(dirname "$0")" && pwd)
ROOT=$(cd "$HERE/../.." && pwd)

export HANDOUT_HTML="$HERE/a9-who-are-you-talking-to.html"
export HANDOUT_PDF="$ROOT/docs/public/cs425/activities/a9-worksheet.pdf"
export HANDOUT_PAGES=2

# The key stays out of docs/public, which is copied verbatim onto the website.
export KEY_HTML="$HERE/a9-who-are-you-talking-to-key.html"
export KEY_PDF="$HERE/a9-who-are-you-talking-to-key.pdf"
export KEY_PAGES=2

case "${1:-}" in
    handout|key|-h|--help) exec "$HERE/render-handout.sh" "$@" ;;
    *) printf '%s: A9 needs no testbed; the commands are "handout" and "key"\n' \
           "$(basename "$0")" >&2; exit 1 ;;
esac
