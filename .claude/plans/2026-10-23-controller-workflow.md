# Controller workflow, the diagram renderer, and Overlord's leftovers

One live session per repo (the controller) plans, sends the work to background sessions, answers
them, reviews and lands. Overlord is being retired, so what it still provides moves into one
plugin. The workflow page gets written and approved before any plugin code.

| id | task                                       | model | effort | where | after  | status                    |
|----|--------------------------------------------|-------|--------|-------|--------|---------------------------|
| T0 | Fix the dot-files config sync              | opus  | medium | local | -      | landed 03fe77d (dot-files) |
| T1 | Workflow page and setup page hooks section | opus  | medium | local | T0     | landed f85ab0e            |
| T2 | One diagram renderer, `npm run diagrams`   | opus  | medium | local | T1     | landed 7d32d9e            |
| T3 | P2 diagrams in dark mode on the site       | opus  | medium | local | T2     | landed                    |
| T4 | Push the site                              | opus  | medium | local | T1-T3  | done                      |
| T5 | Push the P2 diagrams to Canvas 48194       | opus  | medium | local | T4     | blocked: "not now"        |
| T6 | Phase B: the workflow plugin               | -     | -      | -     | T4     | blocked: its own plan     |
| T7 | Docs drift agent on the workflow page      | opus  | medium | local | T3     | page landed, job next     |

T1 to T3 are on `origin/master` and the site is live. Commit with `git commit -- <paths>`, because other sessions
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

Landed. `docs/teaching/agentic-workflow.md` (it was `docs/ai/workflow/index.md`) reads as a living white paper, not a narrative:
"Live at head" is gone, the sections are renumbered (8 rules), section 4 is "One controller per
repo, every worker in its own worktree" with the where-it-runs table, the plan file format and
landing, and section 8 has the model and effort defaults. `docs/ai/claude/index.md` has the
Hooks section (Claude Code hooks, plugin and project hooks, git hooks per repo). The
"Small over heavy" install note waits until phase B lands.


## T2: the diagram renderer

Landed. Every diagram is a spec drawn by
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

Landed. I picked drawing them on the page. `p2.md` still links the `.svg` files, which Canvas
shows. On the site, the `course_diagrams` rule in `config.mts` swaps a paragraph holding only a
renderer-made `.svg` (it has `data-diagram`) for `<WorkflowDiagram file="...">`, which draws the
spec from the course's `diagrams.ts`, so it follows the toggle.

## T4: push the site

Done. T1 and T2 went out with the later page work.

## T5: Canvas

`edutools push docs/cs425 --course 48194 --dry-run` first, and ask before the real push.

## T6: phase B

Gets its own plan, written from the approved workflow page. The outline is in
`/Users/shane/.claude/plans/i-want-to-nail-crispy-valley.md`: a `workflow` plugin with a new
`dispatch` skill and `worker` agent, plus `handoff`, `waiting`, `land`, `quiet-run`,
`dev-server`, `scout`, `ci-watch` and a rewritten `onboard`. Then memory sync to dot-files, the
CLAUDE.md cleanups, and retiring `~/.overlord-config`. Check `claude --cloud --help` for
`--model` and `--effort` first.

## T7: the docs drift agent

A cloud agent that reads the docs agents act on (CLAUDE.md files, skills, plans, memory) against
the code and repo state, and finds what is stale or contradicts itself, since that is what makes
agents go wrong. This plan was an example: it still said T1 and T2 were unpushed and named the old
page path. It goes on the workflow page first, like every other rule. A cloud worker gets a fresh
clone and none of my Mac's files, so it cannot see `~/.claude/projects/*/memory/` until memory
sync to dot-files (T6) lands.

Decided: a weekly scheduled job on the shared agent action in GitHub Actions (Claude Code, not
Copilot), staggered from the Monday npm update. It reads each repo's own docs, the global config
in dot-files and, after T6, memory. It fixes and lands clear-cut drift, and opens an issue for
anything that needs a judgment call. The page text (rule 3, rule 7, Where this stands) has
landed. The job itself is next: a second schedule in `agent.yml` with its own task, plus read
access to the private dot-files repo for the global config.
