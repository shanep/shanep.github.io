#!/usr/bin/env bash
#
# a3-claude-transport.sh - documents for CS425 activity A3.
#
# A3 runs on the projector and on laptops and needs no testbed, so this only renders
# the worksheet and the key, through the shared render-handout.sh.
#
set -euo pipefail

HERE=$(cd "$(dirname "$0")" && pwd)
ROOT=$(cd "$HERE/../.." && pwd)

export HANDOUT_HTML="$HERE/a3-claude-transport.html"
export HANDOUT_PDF="$ROOT/docs/public/cs425/activities/a3-worksheet.pdf"
export HANDOUT_PAGES=3

# The key stays out of docs/public, which is copied verbatim onto the website.
export KEY_HTML="$HERE/a3-claude-transport-key.html"
export KEY_PDF="$HERE/a3-claude-transport-key.pdf"
export KEY_PAGES=2

case "${1:-}" in
    handout|key|-h|--help) exec "$HERE/render-handout.sh" "$@" ;;
    *) printf '%s: A3 needs no testbed; the commands are "handout" and "key"\n' \
           "$(basename "$0")" >&2; exit 1 ;;
esac
