#!/bin/sh
# Build docs/public/panter-cv.pdf from the CV page, docs/cv/index.md.
#
# The GitHub Action runs this before building the site, using Tectonic (a
# single-binary LaTeX engine that fetches only the packages the CV needs). Run
# it locally to preview the PDF; it uses Tectonic when it is installed and
# falls back to pdflatex otherwise. The PDF is a build product, not committed.
set -eu

root=$(cd "$(dirname "$0")/../.." && pwd)
tmp=$(mktemp -d)
trap 'rm -rf "$tmp"' EXIT

pandoc "$root/docs/cv/index.md" \
  --from markdown+raw_html \
  --lua-filter "$root/scripts/cv/cv.lua" \
  --template "$root/scripts/cv/template.tex" \
  --wrap=preserve \
  --output "$tmp/cv.tex"

if command -v tectonic >/dev/null 2>&1; then
  # Tectonic reruns on its own until "Page N of M" resolves.
  tectonic --chatter minimal --outdir "$tmp" "$tmp/cv.tex"
else
  # Two passes so "Page N of M" resolves.
  (cd "$tmp" && pdflatex -interaction=nonstopmode -halt-on-error cv.tex >/dev/null \
             && pdflatex -interaction=nonstopmode -halt-on-error cv.tex >/dev/null) || {
    tail -n 30 "$tmp/cv.log" >&2
    exit 1
  }
fi

cp "$tmp/cv.pdf" "$root/docs/public/panter-cv.pdf"
echo "wrote docs/public/panter-cv.pdf"
