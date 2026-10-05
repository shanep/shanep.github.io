# shanep.github.io

[![Build and Deploy Pages](https://github.com/shanep/shanep.github.io/actions/workflows/static.yml/badge.svg)](https://github.com/shanep/shanep.github.io/actions/workflows/static.yml)

Source for [shanepanter.com](https://shanepanter.com). Built with [VitePress](https://vitepress.dev) and deployed to GitHub Pages on every push to `master`.

## Development

```bash
npm install
npm run docs:dev        # live-reload dev server at http://localhost:3000
```

## Scripts

| Command                | Description                                                      |
| ---------------------- | ---------------------------------------------------------------- |
| `npm run docs:dev`     | Start the dev server on port 3000                                |
| `npm run docs:build`   | Build the static site to `docs/.vitepress/dist/`                 |
| `npm run docs:preview` | Preview the production build locally                             |
| `npm run cv:pdf`       | Build the CV PDFs in `docs/public/` from `docs/cv/index.md`      |
| `npm run clean`        | Remove `node_modules`, the build output, and the VitePress cache |

`docs:build` also builds the CV PDFs, so it needs `pandoc` and a LaTeX engine, either Tectonic or `pdflatex`. The PDFs are build products and are not committed.

## Project Structure

```
docs/
├── index.md                  # Homepage
├── <course-id>/              # One folder per course (see below)
├── teaching/                 # Teaching portfolio
├── research/                 # Research portfolio
├── cv/                       # CV page, also the source of the CV PDFs
├── public/                   # Files copied verbatim onto the site
└── .vitepress/
    └── config.mts            # Site config and sidebar nav

parts/                        # Markdown snippets included by many pages (syllabus policies, rubrics)
shared/                       # Canvas modules shared by every course, linked in with symlinks
scripts/
├── cv/                       # Builds the CV PDFs
└── cs425/                    # Renders the CS425 worksheets and answer keys to PDF
```

## Courses

Each course lives in `docs/<course-id>/` and is the single source for both the website and Canvas:

```
docs/<course>/
  index.md          syllabus (also the Canvas syllabus)
  canvas.toml       term skeleton, date policies, Canvas module layout
  objectives.md     course learning outcomes
  resources.md      textbook, tools, links
  schedule/         modules.json (generated) and a page that renders it
  notes/            lecture notes
  assignments/      p0.md, p1.md, ...
  quizzes/          quiz-*.md
  discussions/      Canvas discussion topics
```

To add a course, create the folder, then register its sidebar in `docs/.vitepress/config.mts` with a `/<course-id>/` entry and a sidebar function.

Courses are pushed to Canvas with the `edutools` CLI, which lives in its own repo. All Canvas code goes there, not here. `CLAUDE.md` has the authoring rules the push depends on, the commands, and the safety notes.

## Deployment

Pushes to `master` build and deploy through GitHub Actions (`.github/workflows/static.yml`). The built site is uploaded to GitHub Pages from `docs/.vitepress/dist/`. CI uses Node 24. `npm run docs:build` must pass before pushing, and dead links fail it.

## Dependency Updates

```bash
ncu -u && npm install
```
