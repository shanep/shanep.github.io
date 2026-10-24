# Controller workflow, the diagram renderer, and Overlord's leftovers

One live session per repo (the controller) plans, sends the work to background sessions, answers
them, reviews and lands. Overlord is being retired, so what it still provides moves into one
plugin. The workflow page gets written and approved before any plugin code.

| id | task                                       | model | effort | where | after  | status                    |
|----|--------------------------------------------|-------|--------|-------|--------|---------------------------|
| T0 | Fix the dot-files config sync              | opus  | medium | local | -      | landed 03fe77d (dot-files) |
| T1 | Workflow page and setup page hooks section | opus  | medium | local | T0     | review f85ab0e (unpushed) |
| T2 | One diagram renderer, `npm run diagrams`   | opus  | medium | local | T1     | review 7d32d9e (unpushed) |
| T3 | P2 diagrams in dark mode on the site       | opus  | medium | local | T2     | blocked: needs a decision |
| T4 | Push the site                              | opus  | medium | local | T1-T3  | blocked: my go-ahead      |
| T5 | Push the P2 diagrams to Canvas 48194       | opus  | medium | local | T4     | blocked: "not now"        |
| T6 | Phase B: the workflow plugin               | -     | -      | -     | T4     | blocked: its own plan     |

Both commits sit on local `master`, ahead of origin. Don't push them until I say the pages are
done, since the site is public. Commit with `git commit -- <paths>`, because other sessions
stage files in this checkout.

## Decisions so far

- A plan lives in the repo at `.claude/plans/<date>-<slug>.md` while it is active, and the last
  landing commit deletes it. This file goes the same way.
- The controller lands all work. Workers never land.
- Cloud workers are opt-in per task. Anything that runs `edutools` stays local.
- Overlord's leftovers go into one plugin, in its own repo, listed in `claude-plugins`.
- Auto-memory sync moves to dot-files, keyed by the git remote
  (`dot-files/claude/memory/<host>/<owner>/<repo>/`).
- Opus 5.5 stays at medium effort for the live session. `Bash(gh pr merge:*)` stays allowed.

## T1: the workflow and setup pages

Done and committed. `docs/ai/workflow/index.md` reads as a living white paper, not a narrative:
"Live at head" is gone, the sections are renumbered (8 rules), section 4 is "One controller per
repo, every worker in its own worktree" with the where-it-runs table, the plan file format and
landing, and section 8 has the model and effort defaults. `docs/ai/claude/index.md` has the
Hooks section (Claude Code hooks, plugin and project hooks, git hooks per repo). The
"Small over heavy" install note waits until phase B lands.

Done when I read both pages on the dev server (`npm run docs:dev`) and say they are good.

## T2: the diagram renderer

Done and committed. Every diagram is a spec drawn by
`docs/.vitepress/theme/components/workflow/render.ts`, styled by `diagram.css` (light and dark,
7:1 text). Region tones: mac blue, github purple, cloud orange, users green, canvas red. Any
other color needs a `key` node, or the renderer throws. Course diagrams live in a course's
`diagrams.ts` (`docs/cs425/assignments/diagrams.ts` has the three P2 ones) and
`npm run diagrams:export` writes them to `docs/public/cs425/assignments/p2-*.svg`, light only.
`npm run diagrams` checks for stale files and layout faults, and `-- --shots <dir>` saves
pictures. The `## Diagrams` section of CLAUDE.md is the rule.

Last run: 17 diagrams, no faults. `npm run a11y -- --course cs425 --level aaa` fails only on
older problems that have nothing to do with P2 or the diagrams.

## T3: P2 diagrams in dark mode

On the dark site the P2 diagrams show as white cards, because the page loads them as `.svg`
images, which can't see the site's toggle. Two ways to fix it:

- Draw them on the page with the component the workflow diagrams use, so they follow the toggle,
  and keep the light `.svg` files for Canvas. This is my pick.
- Put a `prefers-color-scheme` dark theme inside the `.svg`. It follows the computer's setting,
  not the site's toggle, and Canvas would get it too.

I was asking a question about this when we stopped. Start there.

## T4: push the site

`git pull --rebase`, then `git push origin HEAD:master`. The pre-push hook runs `lint:md` and
the build, and CI runs Lighthouse. Watch CI with the `ci-watch` agent.

## T5: Canvas

`edutools push docs/cs425 --course 48194 --dry-run` first, and ask before the real push.

## T6: phase B

Gets its own plan, written from the approved workflow page. The outline is in
`/Users/shane/.claude/plans/i-want-to-nail-crispy-valley.md`: a `workflow` plugin with a new
`dispatch` skill and `worker` agent, plus `handoff`, `waiting`, `land`, `quiet-run`,
`dev-server`, `scout`, `ci-watch` and a rewritten `onboard`. Then memory sync to dot-files, the
CLAUDE.md cleanups, and retiring `~/.overlord-config`. Check `claude --cloud --help` for
`--model` and `--effort` first.
