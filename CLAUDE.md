# shanep.github.io

## Workflow

- **Work directly on `main`/`master`. No worktrees, no pull requests.** This repo is a
  single-author site; commit straight to the checked-out branch and push. This overrides
  the global "every session works in its own git worktree" and "open a pull request" rules.

## Course content

Each course lives in `docs/<course-id>/` and is the single source for both the website
(VitePress) and Canvas (pushed with `edutools`). See `docs/cs425/` for the current shape:

```
docs/<course>/
  index.md          syllabus; also becomes the Canvas syllabus
  canvas.toml       term skeleton, date policies, Canvas module layout
  objectives.md     course learning outcomes (Canvas page)
  resources.md      textbook, tools, links (Canvas page)
  schedule/         schedule.json + a page that renders it
  notes/            lecture notes (Canvas pages)
  assignments/      p0.md, p1.md, ... (Canvas assignments)
  quizzes/          quiz-*.md (Canvas quizzes; see the quiz format below)
  discussions/      Canvas discussion topics
```

Authoring rules that the Canvas push depends on:

- Every gradable file starts with a bold meta line, `**Week 7 · 38 points · ...**`.
  `edutools` reads the week and the points from it to compute due dates.
- A `## Rubric` table (`| n | description | points |`) becomes a Canvas rubric.
- A `## Instructor Notes` section marked instructor-only is stripped before publishing.

## Canvas

All Canvas code lives in the `edutools` app (`../edutools`), not in this repo. Do not add
Canvas API calls here; extend the `edutools` CLI instead.

```bash
edutools dates docs/cs425 --show                    # check computed due dates
edutools push  docs/cs425 --course 48194 --dry-run  # render, write nothing
edutools push  docs/cs425 --course 48194            # publish (unpublished objects)
edutools push  docs/cs425 --course 48194 --publish  # publish and make visible
```

CS425 is Canvas course **48194**.

## Building the site

```bash
npm run docs:dev     # live reload on :3000
npm run docs:build   # must pass before pushing; dead links fail the build
```
