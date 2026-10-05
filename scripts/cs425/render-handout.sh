#!/usr/bin/env bash
#
# render-handout.sh - render a CS425 activity worksheet or answer key to PDF.
#
# Every activity has a small wrapper (a1-application-layer.sh, ...) that sets the
# variables below and execs this with `handout` or `key`, so there is one
# renderer rather than one per activity.
#
#   HANDOUT_HTML  HANDOUT_PDF  HANDOUT_PAGES   the student worksheet
#   KEY_HTML      KEY_PDF      KEY_PAGES       the answer key
#   CHROME                                     optional: the browser binary to use
#
# The worksheet PDF goes under docs/public, which VitePress copies verbatim onto
# the website. The answer key never goes there; it stays beside the wrapper.
#
# Requires Chrome, Chromium or Edge, and python3 for the file URL and the page
# count.
#
set -euo pipefail

PROG=$(basename "$0")
ROOT=$(cd "$(dirname "$0")/../.." && pwd)

die()  { printf '%s: %s\n' "$PROG" "$*" >&2; exit 1; }
info() { printf '==> %s\n' "$*" >&2; }
warn() { printf '%s: warning: %s\n' "$PROG" "$*" >&2; }

COMMAND=${1:-}

# The worksheet is authored as HTML with a print stylesheet, because it needs
# fill in rules, fixed page breaks and tables that survive a photocopier, and
# none of that comes out of markdown. Headless Chrome is the renderer, so what
# a browser previews is what comes off the printer.
#
# macOS keeps the binary inside the app bundle and Linux puts it on PATH under
# one of several names, so both shapes are searched rather than assuming either.
find_chrome() {
    if [ -n "${CHROME:-}" ]; then
        [ -x "$CHROME" ] || die "CHROME is set to $CHROME, which is not executable"
        printf '%s\n' "$CHROME"
        return 0
    fi

    local candidate
    for candidate in \
        "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
        "/Applications/Chromium.app/Contents/MacOS/Chromium" \
        "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge"
    do
        [ -x "$candidate" ] && { printf '%s\n' "$candidate"; return 0; }
    done

    for candidate in google-chrome google-chrome-stable chromium chromium-browser microsoft-edge; do
        command -v "$candidate" >/dev/null 2>&1 && { command -v "$candidate"; return 0; }
    done

    die "no Chrome, Chromium or Edge found; install one or set CHROME"
}

# stat's flags are one of the sharper BSD versus GNU splits, so ask wc instead.
# The redirect is the shell's, not wc's, so a missing file has to be caught here
# rather than swallowed with 2>/dev/null.
file_size() {
    [ -f "$1" ] || { printf '0\n'; return 0; }
    wc -c < "$1" 2>/dev/null | tr -d '[:space:]'
}

# A worksheet that quietly grew a fifth page is the failure worth catching, and
# counting the page objects is cheap enough to do on every render.
pdf_pages() {
    python3 -c 'import re,sys; print(len(re.findall(rb"/Type\s*/Page[^s]", open(sys.argv[1],"rb").read())))' \
        "$1" 2>/dev/null || printf '?\n'
}

# render_pdf <source html> <target pdf> <expected page count>
render_pdf() {
    local html=$1 pdf=$2 want=$3
    local chrome url profile pid size last=x i=0 count
    [ -f "$html" ] || die "no source at $html"
    chrome=$(find_chrome)

    # The path has to be percent-encoded before it is a file URL. Chrome reads
    # a # in the checkout path as the start of a fragment and renders nothing.
    url=$(python3 -c 'import sys, urllib.parse; print("file://" + urllib.parse.quote(sys.argv[1]))' "$html")
    info "rendering $(basename "$html") with $(basename "$chrome")"

    rm -f "$pdf"
    profile=$(mktemp -d "${TMPDIR:-/tmp}/render-handout.XXXXXX")

    # The throwaway profile is what stops this being a silent no-op when the
    # person running it already has Chrome open. The cost of it is that Chrome
    # then writes the PDF and sits there instead of exiting, so rather than
    # waiting on a process that is never going to return, wait for the file to
    # stop growing and kill it.
    "$chrome" \
        --headless \
        --disable-gpu \
        --no-pdf-header-footer \
        --user-data-dir="$profile" \
        --print-to-pdf="$pdf" \
        "$url" >/dev/null 2>&1 &
    pid=$!

    while [ $i -lt 60 ]; do
        sleep 1
        i=$((i + 1))
        size=$(file_size "$pdf") || size=""
        if [ -n "$size" ] && [ "$size" != 0 ] && [ "$size" = "$last" ]; then
            break
        fi
        last=$size
        kill -0 "$pid" 2>/dev/null || break
    done

    kill -9 "$pid" >/dev/null 2>&1 || true
    wait "$pid" 2>/dev/null || true
    rm -rf "$profile"

    [ -s "$pdf" ] || die "chrome wrote no output; try CHROME=/path/to/chrome $PROG $COMMAND"

    count=$(pdf_pages "$pdf")
    info "wrote ${pdf#"$ROOT"/} ($count pages, $(file_size "$pdf") bytes)"
    if [ "$count" != "$want" ]; then
        warn "expected $want pages; the layout has overflowed, open the HTML and tighten it"
    fi
}

cmd_handout() { render_pdf "$HANDOUT_HTML" "$HANDOUT_PDF" "$HANDOUT_PAGES"; }

cmd_key() {
    render_pdf "$KEY_HTML" "$KEY_PDF" "$KEY_PAGES"
    warn "that is an answer key: it does not go in docs/public and does not go on the website"
}

usage() {
    printf 'usage: %s handout|key\n' "$PROG" >&2
    printf 'normally run through an activity wrapper, such as a1-application-layer.sh\n' >&2
}

case "$COMMAND" in
    handout)
        [ -n "${HANDOUT_HTML:-}" ] || die "HANDOUT_HTML is not set; run this through an activity wrapper"
        cmd_handout ;;
    key)
        [ -n "${KEY_HTML:-}" ] || die "KEY_HTML is not set; run this through an activity wrapper"
        cmd_key ;;
    -h|--help) usage ;;
    *) usage; exit 1 ;;
esac
