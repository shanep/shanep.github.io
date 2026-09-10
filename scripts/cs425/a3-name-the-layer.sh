#!/usr/bin/env bash
#
# a3-name-the-layer.sh - documents for CS425 activity A3.
#
# A3 probes the same two hosts A2 introduces, so there is deliberately only one
# implementation of the testbed and one implementation of the PDF renderer, both
# in a2-connectivity-triage.sh. This script points `handout` and `key` at A3's
# own documents and forwards every other command there untouched, which is why
#
#     ./a3-name-the-layer.sh verify
#     ./a2-connectivity-triage.sh verify
#
# do exactly the same thing.
#
set -euo pipefail

HERE=$(cd "$(dirname "$0")" && pwd)
ROOT=$(cd "$HERE/../.." && pwd)

export HANDOUT_HTML="$HERE/a3-name-the-layer.html"
export HANDOUT_PDF="$ROOT/docs/public/cs425/a3-worksheet.pdf"
export HANDOUT_PAGES=4

# The key stays out of docs/public, which is copied verbatim onto the website.
export KEY_HTML="$HERE/a3-name-the-layer-key.html"
export KEY_PDF="$HERE/a3-name-the-layer-key.pdf"
export KEY_PAGES=3

exec "$HERE/a2-connectivity-triage.sh" "$@"
