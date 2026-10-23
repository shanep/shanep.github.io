# shanep.github.io

## Workflow

- **Each session works in its own worktree and lands on `master`. No pull requests.**
  Commit on the session's branch, rebase onto `origin/master`, and push with
  `git push origin HEAD:master`. If another session landed first, fetch, rebase and push
  again.
- **The git hooks are the checks.** `.githooks/pre-commit` lints the staged Markdown and
  `.githooks/pre-push` runs `npm run lint:md` and `npm run docs:build`, the same checks CI
  runs before it deploys. `npm install` turns them on (the `prepare` script sets
  `core.hooksPath`), so do not run the build by hand just before pushing.
- **`.worktreeinclude` lists the ignored files a new worktree needs** (`.env`, the local
  Claude settings, the course textbook PDFs that `edutools push` uploads). Add to it when a
  new ignored file is needed to build or push a course.

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

- `shared/instructor-resources/` is the instructor-only Instructor Resources module. Its Instructor
  Guide and Course Suggestions pages are templates, because eCampus makes a Google Doc of each per
  course. A course gets a real `docs/<course>/instructor-resources/` directory holding its own
  copies of those two pages, linked to its docs, plus a symlink to the shared
  `learning-opportunities.md` (see `docs/cs331/instructor-resources/`). It adds
  `"instructor-resources/*.md"` to `[layout] pages` and declares the module with
  `never_publish = true`, which keeps it and its pages unpublished on every push, whatever the
  flags. The site excludes `**/instructor-resources/**`, so it never reaches the website.
- `shared/course-resources/` holds the student pages of Course Resources. A course links it
  the same way, adds `"course-resources/*.md"`, and declares the module with `publish = true`
  so every push publishes it, alongside its own Instructor Information page.

## Google Drive

`edutools drive` copies a course to the Boise State Google Drive as Google Docs, one folder per
Canvas module, for colleagues and eCampus. Unlike Canvas, the copy keeps the Instructor Notes
and the Instructor Resources module, so never share it with students. Sharing is done by hand
in Drive. The command never changes permissions.

```bash
edutools drive status docs/cs331             # which side changed since the last push
edutools drive push   docs/cs331 --dry-run   # what would change, writes nothing
edutools drive push   docs/cs331             # update the same Docs in place
edutools drive folder docs/cs331             # pick the folder the course folder goes in
```

The CS331 folder lives inside the eCampus folder "CS 331 - Shane Panter - 15w"
(`1cuNzFubeI4CIkYFN4pL3Dy8VVmk4rBFx`), so everyone that folder is shared with can read it. The
manifest's `parent` records it, and each push moves the course folder back there if it gets
moved. `drive folder` opens Google's folder picker, because edutools can only reach a folder
it made or one picked there.

The push also builds the "Objective Alignment Sheet" eCampus asks for, a Google Sheet at the
top of the course folder, from `docs/<course>/objectives.md`. It needs the page's TLO shape
(a `## TLO n` section with the quote, the facets line, the table and **Notes.**), so keep that
shape when editing objectives, and edit the page rather than the Sheet. The older blank eCampus
template sheet (`1pMqQWTXqwFJ9j5G6VucX9rWwpvneh75dUS5uFXWRz_k`) is no longer used.

`docs/<course>/.drive/manifest.json` records every Drive id. Commit it after each push, or the
next push from another checkout builds a second copy. A Doc someone edited in Drive shows as
`drive` in status and the push skips it. Copy the edit into the repo rather than reaching for
`--force`. CS331 is the only course in Drive so far. The OAuth client is the `edutools`
project in Google Cloud (`edutools-512519`), and `edutools drive login` signs in again.

## Accessibility

**All course content targets WCAG 2.2 AAA, or as close as it can get.** AA is the floor, not the
goal. Write new pages, notes, assignments and quizzes to AAA from the start: 7:1 contrast, 44 px
targets, abbreviations spelled out on first use on each page, decorative images with both `alt=""`
and `role="presentation"` (Canvas drops a bare empty alt), and no images of text. When a criterion
cannot be met, say why in the course's report. CS331 meets 25 of 31, and its report lists the rest.
Run `npm run a11y -- --course <id> --level aaa` after changing a course.

`npm run a11y` checks one course against WCAG 2.2 A and AA: axe-core on every page in light and dark mode, contrast axe cannot decide, link text, reflow at 320 px and
visible focus, plus every body in a Canvas snapshot with `--canvas`. `--level aaa` adds axe's AAA
rules, 7:1 contrast, 44 px targets at 1280 and 320 px, the focus ring and sticky-bar checks,
new-tab links, paragraph spacing and images of text. It exits 1 on any failure. The tools live in
`scripts/a11y/`, their own package, so the build and CI never install them.

```bash
edutools pull 52107 --out /tmp/cs331-canvas
npm run a11y -- --course cs331 --level aaa --canvas /tmp/cs331-canvas
npm run a11y:pdf -- reviews/cs331-accessibility-2026-10.md   # tagged PDF to email
```

The AAA theme work lives in `docs/.vitepress/theme/style.css` (palette, focus ring, scroll
padding, 44 px targets, paragraph spacing) and `config.mts` (code themes built to 7:1 at load
time, external links in the same tab). Keep new theme colors at 7:1 and new controls at 44 px.

The report for each course lives in `reviews/`, with its PDF committed next to it. Rerun the check
and update the report after a big change to a course or the theme.

`docs/.vitepress/theme/components/` overrides three VitePress components (the sidebar item, the
doc footer and the search button) to fix accessibility failures upstream. Check them against
VitePress when it updates, and drop them once upstream is fixed. It also holds the inline SVG
diagrams in `workflow/`, which are the site's own.

## Building the site

```bash
npm run docs:dev     # live reload on :3000
npm run docs:build   # must pass before pushing; dead links fail the build
```

`package.json` forces `vite` to `^6.4.3` through `overrides`, although VitePress 1.6.4 asks
for vite 5. The override came in on 2026-10-04 ("Update dependencies to clear the Dependabot
alerts") to clear the alerts on vite 5.
Drop it once VitePress 2 is stable and depends on a patched vite itself.
