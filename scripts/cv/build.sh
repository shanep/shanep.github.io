#!/bin/sh
# Build the CV PDFs in docs/public from the CV page, docs/cv/index.md.
#
# The Vite plugin in docs/.vitepress/cv-pdf.ts runs this as part of docs:build,
# so the GitHub Action gets the PDFs through the site build. CI uses Tectonic (a
# single-binary LaTeX engine that fetches only the packages the CV needs). Run
# it locally to preview the PDF; it uses Tectonic when it is installed and
# falls back to pdflatex otherwise. The PDFs are build products, not committed.
set -eu

root=$(cd "$(dirname "$0")/../.." && pwd)
tmp=$(mktemp -d)
trap 'rm -rf "$tmp"' EXIT

# build <output name> [pandoc options]: render the CV page to a PDF in
# docs/public. The standard CV and the one with section summaries come from the
# same page; the summaries version passes -M summaries=true.
build() {
  out=$1
  shift
  pandoc "$root/docs/cv/index.md" \
    --from markdown+raw_html \
    --lua-filter "$root/scripts/cv/cv.lua" \
    --template "$root/scripts/cv/template.tex" \
    --wrap=preserve \
    "$@" \
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

  cp "$tmp/cv.pdf" "$root/docs/public/$out"
  echo "wrote docs/public/$out"
}

build panter-cv.pdf
build panter-cv-summaries.pdf -M summaries=true
