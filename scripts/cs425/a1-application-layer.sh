#!/usr/bin/env bash
#
# a1-application-layer.sh - documents for CS425 activity A1.
#
# A1 runs against onyx.boisestate.edu and needs no testbed, so this only renders
# the worksheet, through the shared render-handout.sh.
#
set -euo pipefail

HERE=$(cd "$(dirname "$0")" && pwd)
ROOT=$(cd "$HERE/../.." && pwd)

export HANDOUT_HTML="$HERE/a1-application-layer.html"
export HANDOUT_PDF="$ROOT/docs/public/cs425/activities/a1-worksheet.pdf"
export HANDOUT_PAGES=2

# The key stays out of docs/public, which is copied verbatim onto the website.
export KEY_HTML="$HERE/a1-application-layer-key.html"
export KEY_PDF="$HERE/a1-application-layer-key.pdf"
export KEY_PAGES=2

case "${1:-}" in
    handout|key|-h|--help) exec "$HERE/render-handout.sh" "$@" ;;
    *) printf '%s: A1 needs no testbed; the commands are "handout" and "key"\n' \
           "$(basename "$0")" >&2; exit 1 ;;
esac
