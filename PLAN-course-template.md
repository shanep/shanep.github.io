# Plan: make the CS331 layout reusable by every course

Temporary working file. Delete it once the work is done.

## Order of work

1. **Sync CS408 first** (Canvas 48195, Fall 2026, online asynchronous). See Phase 0.
2. Promote the CS331 pieces into `shared/` (Phase 1).
3. Add `extends` to edutools (Phase 2).
4. Write the new-course script (Phase 3).
5. Switch CS331 to the shared pieces to test them (Phase 4).
6. Move the remaining courses (Phase 5), then update the docs (Phase 6).
7. Script the checks done by hand, and close the last verify gap (Phase 7). This can
   happen any time; nothing else depends on it.

## Where things stand

**Already shared:**

- The icon set, in `docs/public/icons/`.
- Instructor Resources and Course Resources, in `shared/`.
- The syllabus policies, in `parts/`.

**Only in CS331:**

- **`canvas.css`.** The CS331 and CS425 copies have drifted apart. CS331 has the shell's look
  (rules, pill buttons, icon spacing, the "Next" bar) and CS425 has the orange "lose points"
  styling.
- **The `[icons]` table and the two shared `[[module]]` blocks.** They are pasted into
  `canvas.toml` by hand, because edutools has no way to include one TOML file in another. It
  reads `canvas.toml` in three places: `dates.ts`, `course.ts` and `publisher.ts`.
- **The shell pages:** `home.md`, `getting-started.md`, `communicating.md`, `instructor.md`,
  the per-week `Module N Overview` page, the reminders, and the banner SVG.
- **`parts/cs331-questions-button.md`.** It hard-codes the URL of course 52107's discussion,
  and 30 pages include it. `home.md` and `index.md:321` also hard-code that URL.
- **The website sidebar.** `cs331()` in `docs/.vitepress/config.mts` is written by hand.

**CS408 today:**

- It is a website only: `index.md`, `notes/week01-17.md`, `notes/sprint1-6.md`, and the
  older `schedule/schedule.json` with the `CourseSchedule` component.
- It has no `canvas.toml`, no meta lines and no manifest. Canvas 48195 was built by hand.

## Phase 0: Sync CS408 with Canvas 48195

The goal is for `docs/cs408/` to be the single source for 48195, the way `docs/cs425/` is
for 48194. The course is live, so the sync adopts what is already in Canvas rather than
recreating it.

1. **Take a snapshot.** Run `edutools pull 48195 --out <scratch>` and `edutools modules 48195`.
   This shows what Canvas holds that the repo does not, and the reverse. The pull only reads.
2. **Write `canvas.toml`.**
   - Fill in `[term]` for Fall 2026. CS425 uses `first_monday = 2026-08-24`, but CS408's
     `schedule.json` says `startDate = 2026-08-25`. Check which is right.
   - Add the policies for each kind of graded work: sprints, onboarding, peer reviews,
     discussions.
   - Copy the `[[group]]` names exactly as `edutools groups 48195` prints them, character for
     character.
   - Write `[[module]]` tables that match the modules live in Canvas now.
3. **Prepare the graded files.** Add a bold meta line (`**Week N · P points · ...**`) to each
   one, and a `## Rubric` table where Canvas has a rubric.
4. **Adopt the existing Canvas objects by id in the manifest**, the way CS331 adopts the
   shell's Course Questions board. That way the first push updates the existing objects
   instead of creating duplicates beside them.
5. **Check before pushing.**
   - Run `edutools dates` and `edutools outline`, then `push --dry-run`.
   - Then run `audit 48195 --json`. Nothing should show up as `untracked` unless it is meant
     to stay hand-built.
6. **Push.** Do not add `--update-published` for anything students can already see unless
   you name that specific content.
7. **Update the website.** Regenerate `schedule/modules.json` with `edutools outline` and
   switch the schedule page from `CourseSchedule` to `CanvasModules`. Then `npm run docs:build`.

**Open question:** should CS408 move to the shell layout as part of this sync, or be synced
as it is now and switch to the shell at its next offering? The layout fits CS408 better than
CS425, since both CS408 and CS331 are online and asynchronous. But a mid-term switch renames
modules and retitles pages, which changes their Canvas URLs while students are using them.

### Phase 0 progress (2026-10-04)

- `docs/cs408/` was replaced with a markdown conversion of the 48195 pull (38 documents, 12
  images). The converter is a scratch script. It rewrites Canvas links to repo paths, moves the
  shell's callout boxes to `::: danger` and `::: tip`, drops heading icons, and writes
  `schedule/modules.json` straight from the Canvas modules.
- Still to do: `canvas.toml`, adopting the Canvas ids in the manifest, `push --dry-run`, `audit`.
- The heading icons the shell used, for the `[icons]` table: overview (reading), task headings
  (task), grading, submission and finish (finish-line), peer reviews and post directions
  (discussion), tips and project ideas (tip), instructions (list), rubric (list), banned ideas
  (attention).

## Phase 1: Move CS331's pieces into `shared/` (this repo)

1. **`shared/canvas.css`:** CS331's shell CSS with CS425's orange rules merged in. Each course
   links to it with a `canvas.css` symlink. The publisher reads it with `readFileSync`, which
   follows symlinks.
2. **A generic Course Questions button** that links to the course's own
   `course-resources/course-questions.md`. The push already turns that link into each course's
   own discussion URL.
   - **Catch:** an include is pasted into the page that uses it, so a relative link resolves
     from that page. Pages in `notes/` sit one level deeper than `home.md`.
   - **Fix:** either keep two copies of the part (one per depth), or have edutools resolve
     links in an include relative to the included file. Check the real behaviour with
     `push --dry-run --preview` before choosing.
3. **`shared/course-template/`:** copies of the shell pages with placeholders (`{{COURSE}}`,
   `{{TITLE}}`, `{{TERM}}`). It also gets a week overview and notes page, a reminder,
   `schedule/index.md` and a banner SVG to copy.
   - The general guidelines in `communicating.md` become a part.
   - CS331's three security-specific discussion rules stay in CS331.

## Phase 2: Share the `canvas.toml` boilerplate (an edutools change)

1. Add `extends = "../../shared/canvas-shell.toml"`, with one loader replacing the three
   separate parsers.
2. Merge rules:
   - Tables merge, and the course's own value wins.
   - The base file's `[[module]]` blocks come first.
   - `[layout] pages` lists are joined together.
3. `shared/canvas-shell.toml` holds `[icons]`, the Instructor Resources and Course Resources
   modules, and their page globs.
4. Add tests, and update the README and `skills/canvas/SKILL.md` in the same commit.

The alternative is to skip this and have the new-course script paste the block in. Then every
icon change has to be made in every course by hand.

## Phase 3: A new-course script

`scripts/new-course.mjs <id> "<title>"`, written in Node so it runs on both macOS and Linux:

1. Copies the template and fills in the placeholders.
2. Creates the `icons`, `instructor-resources`, `course-resources` and `canvas.css` symlinks.
3. Writes a `canvas.toml` with `extends` and empty `[term]` dates.

For the website, one helper in `config.mts` builds a shell-layout course's sidebar from its
`schedule/modules.json`. That replaces the hand-written sidebar function for each course.

## Phase 4: Switch CS331 over first, to test the template

1. Save `push --dry-run --preview` output for 52107 before the change.
2. Move CS331 onto the shared CSS, the shared TOML and the parts.
3. Preview again and compare the HTML. The only differences should be the button links.
4. Then run `npm run docs:build` and `edutools outline`.

## Phase 5: Move the other courses

- **CS408:** if Phase 0 kept the current layout, switch it to the shell layout before its next
  offering.
- **CS425 (48194)** is in the middle of its term, and finals end Dec 18. Convert it after
  Dec 18, for the next offering. It meets in person twice a week, and each module covers a
  chapter that can span two weeks.
- **CS452** has no `canvas.toml` and still uses the old schedule format. It needs a full
  conversion into a Canvas course repo, best done when the course is next taught.

## Phase 6: Documentation

Update `CLAUDE.md`:

- Describe the template, `extends`, and the new-course script.
- Rewrite the paragraph that treats CS331 as the special case, so it describes the shared
  layout every course uses.

## Phase 7: Script the manual checks

1. **One check command per course.** `scripts/check-course.mjs <course> <canvas-id>`, in
   Node so it runs on macOS and Linux. It runs `edutools dates`, regenerates
   `schedule/modules.json` with `edutools outline`, runs `push --dry-run`, then
   `npm run docs:build`. It stops at the first failure, and at the end it says if the
   outline or the manifest changed and needs committing. Today these are separate commands
   run in order by hand, and forgetting the outline leaves the website schedule behind
   Canvas.
2. **CI check that `modules.json` is current.** Add a step to `.github/workflows/static.yml`
   that runs `edutools outline` for each course with a `canvas.toml` and fails if the
   output differs from the committed `schedule/modules.json`. `outline` needs no token.
   - **Catch:** the edutools CLI is private (not on npm), so CI has to check out
     `shanep/edutools` and build it first. Check whether the repo is public, or the
     workflow needs a token to read it.
3. **Verify an unlock date the repo leaves empty (an edutools change).** When a policy has
   no unlock, the push sends an empty `unlock_at`, but `verify` skips the comparison, so an
   unlock date added in the Canvas UI goes unnoticed. Have `metadataIntent` in
   `packages/core/src/course.ts` say "expect none" in that case, and `checkMetadata` in
   `verify.ts` fail when Canvas has a date. Add tests, and update the README and
   `skills/canvas/SKILL.md` in the same commit.

## Open decisions

1. CS408: sync it as it is now, or switch it to the shell layout during the sync (Phase 0)?
2. CS425 timing: after Dec 18 (recommended), or now?
3. In-person courses: should they keep chapter-based modules with the shell's look, or switch
   to one module per week?
4. CS452: bring it into Canvas, or leave it as a website only for now?
5. edutools: add `extends`, or paste the boilerplate into each course?
