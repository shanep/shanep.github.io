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
  schedule/         modules.json (generated) + a page that renders it
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

The website's schedule page mirrors the Canvas modules. It renders
`schedule/modules.json`, which is generated from `canvas.toml` and the item meta
lines, so regenerate it after changing either and commit the result:

```bash
edutools outline docs/cs425 --out docs/cs425/schedule/modules.json
```

## Canvas

**Load the `canvas` skill at the start of any session in this repo**, before touching course
content or running `edutools`. It documents the CLI's commands, required flags and safety
rules, which the notes below assume.

All Canvas code lives in the `edutools` app (`../edutools`), not in this repo. Do not add
Canvas API calls here; extend the `edutools` CLI instead.

```bash
edutools dates docs/cs425 --show                    # check computed due dates
edutools push  docs/cs425 --course 48194 --dry-run  # render, write nothing
edutools push  docs/cs425 --course 48194            # publish (unpublished objects)
edutools push  docs/cs425 --course 48194 --publish  # publish and make visible
```

CS425 is Canvas course **48194**. CS331 is Canvas course **52107**, the Boise State Online
master shell; `docs/cs331/` follows its layout (Course Resources, Getting Started, then a
"Module N Overview" and an "N.01 Readings and Lecture Notes" page per week), and `canvas.css`
plus the `[icons]` table in `canvas.toml` reproduce its look.

The Boise State Online icon set lives once, in `docs/public/icons/`, for every course. A course
uses it by linking its own directory to it (`ln -s ../public/icons docs/<course>/icons`) and
naming the icons it wants in its `[icons]` table; the push uploads only those.

Two modules from the shell are shared the same way, from `shared/` at the repo root:

- `shared/instructor-resources/` is the instructor-only Instructor Resources module. A course
  links it (`ln -s ../../shared/instructor-resources docs/<course>/instructor-resources`), adds
  `"instructor-resources/*.md"` to `[layout] pages`, and declares the module with
  `never_publish = true`, which keeps it and its pages unpublished on every push, whatever the
  flags. The site excludes `**/instructor-resources/**`, so it never reaches the website.
- `shared/course-resources/` holds the student pages of Course Resources. A course links it
  the same way, adds `"course-resources/*.md"`, and declares the module with `publish = true`
  so every push publishes it, alongside its own Instructor Information page.

## Building the site

```bash
npm run docs:dev     # live reload on :3000
npm run docs:build   # must pass before pushing; dead links fail the build
```
