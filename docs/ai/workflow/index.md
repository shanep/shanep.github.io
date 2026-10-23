# An Agentic Software Workflow (as of 10/23/26)

I have been building most of my software with [Claude Code](https://code.claude.com/docs) for
about 3 months now, and I am moving to a workflow where agents do the work and I set the
direction. Writing code used to be the slow part, so the old workflow (feature branches, pull
requests, release trains) was built around people typing slowly and reviewing each other's
work. Now an agent writes the code in minutes. The slow parts are knowing the code is right,
getting it to the people who use it, and me, when every change has to wait for me to start it.

This page is that workflow: 9 rules, and the first 3 matter the most. I am about halfway there.
Agents already write, test, review and land the code. The newest part is agents starting work on
their own, which section 4 covers. For how my Claude setup works
(syncing config across machines, handing work to a new session), see
[My Claude Code Setup](/ai/claude/).

<WorkflowDiagram name="loop" />

Every change goes around the same loop. Something starts it: a prompt from me, an issue, a
failing build. An agent edits the code and the tests, a git hook runs the tests, and a second
agent reviews the diff. A failure or a finding goes back to the edit. Once both pass, the change
lands on main, continuous integration (CI) runs on Ubuntu and macOS, and autoupdate gets it to
every install. Whatever users hit next comes back around as the start of the next change.

## What I do and what the agents do

The agents do the work: writing code and tests, running the checks, reviewing, landing and
shipping. I keep 3 jobs:

1. Decide what to build, and say it clearly enough that an agent can do it without me.
2. Own the tests. They are the spec, and they decide what "done" means.
3. Approve releases. Tagging a release always needs my go-ahead, and so does anything
   destructive.

Everything else in this page is about making that split safe. An agent that works while I am
not watching needs checks that do not depend on me watching.

## 1. Testing is the most important part

Tests are what let me step out of the loop. An agent can write more code in an afternoon than I
can read in a week, so I do not try to read all of it. I read the tests. They say what the code
is supposed to do, and if a behavior matters it gets a test, because a test is the only thing
that keeps checking it after I stop looking.

The checks run on their own. Every repo has git hooks: pre-commit runs the fast checks and
pre-push runs the full suite, and CI runs the same things again on a clean machine. Done means
the hooks and CI pass, not that an agent says it is done.

The tests have to check the thing users actually do. My plugin marketplace,
[claude-plugins](https://github.com/shanep/claude-plugins), has two scripts:

- `scripts/check.sh` validates the marketplace and fails if any plugin is not an `https` URL.
  The pre-commit hook runs it.
- `scripts/test-install.sh` adds the checkout as a marketplace and installs every plugin into a
  throwaway config with ssh turned off. The pre-push hook runs both.

The ssh part is there for a reason. A plugin listed as a `github` source clones over ssh, and
that fails on any machine without a GitHub key, which is most student laptops. It worked fine
on my machine, so only a test that installs the plugin the way a student would catches it. CI
runs both scripts on Ubuntu and macOS on every push, and once a week, since the plugins live in
other repos and can break without a change in this one.

## 2. Live at head

All work happens on main. There are no feature branches that live longer than a session and no
pull requests. I am the only developer on most of these repos, so a pull request would just be
me approving my own work, and an agent should not have to wait on that.

When I am in a session, the agent works in the main checkout on the default branch. It pulls
before the first edit, commits small changes, and pushes them as soon as the checks pass. In
the repos that have it, `npm run land` does the landing. It reviews the change, takes a lock so
only one session lands at a time, fetches, rebases, pushes (the pre-push hook runs the checks
once) and confirms the commit made it to main. If another session landed first, it fetches,
rebases and tries again.

## 3. Autoupdate from day 1

Anything that gets installed on someone else's machine (a plugin, a command line tool, a
desktop app) has to update itself, and that has to be in the first version. Living at head does
not do much good if people are still running the version from last month. And autoupdate is
the one feature you cannot add later: every copy installed before it exists is stuck on that
version until someone updates it by hand.

<WorkflowDiagram name="fanout" />

For my plugins, autoupdate means one setting. Claude Code only updates a third-party
marketplace on its own when you ask it to, so the install instructions add this to
`~/.claude/settings.json`:

```json
"extraKnownMarketplaces": {
  "shanep": {
    "source": { "source": "github", "repo": "shanep/claude-plugins" },
    "autoUpdate": true
  }
}
```

Now a push to main goes live on every machine with autoupdate on the next time Claude Code
starts, including student machines. That is exactly why rules 1 and 2 have to hold. Nobody
reviews a release before it goes out, so the checks are the review.

Autoupdate brings a few other things with it on day 1:

- A version number in every build, so I can tell what someone is running when they report a
  bug.
- Migrations for saved state. If the tool keeps files on the user's machine, the new version has
  to read whatever the old version left behind.
- A way to roll back. Rolling back is a revert pushed to main, and it reaches everyone the same
  way the bad change did.

## 4. Agents start the work, not just me

Until now every change started with me typing a prompt, which made me the slowest step in the
loop. A failing build waited until I noticed it, and a bug report waited until I read it. So now
the common triggers start an agent on their own.

<WorkflowDiagram name="triggers" />

There are 3 triggers, each a GitHub Actions workflow in the repo:

- When CI fails on main, an agent reads the failing log, fixes the cause and lands the fix
  through the same checks as any other change.
- When a user reports a bug and I label the issue `agent`, a session starts with the issue as
  its brief, lands the fix the same way and closes the issue.
- Recurring jobs run on a schedule. This site updates its npm packages every Monday.

All three use one
[shared agent action](https://github.com/shanep/claude-plugins/tree/main/agent), which lives in
my plugin marketplace repo, so my repos run the same code. One Claude session makes the change and commits it. A second session reviews the
commits, and then the repo's checks run. Neither session gets a GitHub token, so neither one can
push. The script pushes after the review and the checks pass, and then it runs CI and waits for
the result.

The rules for these agents are the same as for one I start by hand, plus a few more since nobody
is watching. They never tag a release. They get 2 tries, and then the agent stops and leaves a
note on the issue (or opens an issue) instead of trying forever. An agent never tries to fix its
own commit when it breaks CI, since that is how you get a loop. That one gets an issue for me.

The first real run fixed a shellcheck warning that only showed up on Linux, in the script that
links my Claude config. The new CI job in my dotfiles repo failed, an agent fixed the line, the
reviewer passed it, and the fix landed and passed CI in about a minute. I found out from the
commit.

## 5. Every agent gets its own worktree

The live session I am talking to works on main. Every other agent I start gets its own git
worktree on a `worktree-<name>` branch, so parallel sessions never share uncommitted changes,
checkouts or build output, and cannot step on each other. An agent a trigger starts gets a fresh
CI runner instead, which keeps it apart the same way.

<WorkflowDiagram name="trunk" />

A background session lands the same way a live one does: rebase onto main, run the checks,
push. Then it removes its worktree and deletes the branch with `git branch -d`, not `-D`, so git
refuses to delete work that never landed. The branches only live for an hour or two, so "living
at head" still holds. Today I start these with `/handoff`, which is covered on the
[setup page](/ai/claude/#handing-work-to-a-new-session-with-handoff).

## 6. A second agent reviews before anything lands

The agent that wrote the code is not the one that reviews it. `npm run land` runs a review of
the change before it pushes, and a blocking finding stops the landing. Then there are two
choices: fix the finding and land again, or decide the finding is wrong and land with
`-- --accept-review`. Either way it is a decision someone made, not something that slipped
through.

## 7. Automate every step

If a feature needs data or a step, the code fetches it or runs it. I do not export a file, click
through a web page or paste something in by hand. A manual step is the last resort, and when
one is unavoidable the code or the docs say why. This matters even more for agents: a step that
needs a person is a step an agent has to stop and wait on.

The best example is my courses. Each one lives in this website's repo as a folder of markdown,
and my Canvas tool, [edutools](https://github.com/shanep/edutools), turns it into the Canvas
course.

<WorkflowDiagram name="source" />

One folder builds both places students see the course. VitePress builds the website, and
`edutools push` builds the Canvas pages, assignments, quizzes and modules. Nothing gets typed
into Canvas by hand:

- Due dates come from a bold line at the top of each assignment (`**Week 7 · 38 points**`) and
  the term dates in `canvas.toml`.
- A `## Rubric` table becomes a Canvas rubric.
- An `## Instructor Notes` section gets stripped before anything is published.
- `edutools push --dry-run` renders the whole course and writes nothing, so I can check it
  first.

The same rule goes for the agents themselves. An agent runs the steps instead of handing me a
list of commands to paste. The only things it asks about first are releases, anything
destructive, and anything that could look like an attack on a network I do not own.

## 8. Agent config is code

My `CLAUDE.md`, skills and hooks live in a git repo and get committed, synced and pushed like
any other code. That config is how I tell an agent what to do when I am not there to tell it, so
it gets the same care as the code. A rule that only exists in one session's context is gone when
the session ends, and a rule in a file on one machine is not on the others. The
[setup page](/ai/claude/) covers how the syncing works.

The same goes for the repos themselves: every file is either committed or listed in
`.gitignore`. A file git does not know about is one `git clean` away from being lost.

## 9. Tune the model and effort from data

Which model to run, and at what effort level, should come from what the sessions actually did,
not from a guess. Right now my `settings.json` sets the effort to high, and I picked that by
hand.

<WorkflowDiagram name="tune" />

[claude-tune](https://github.com/shanep/claude-tune) is my plugin for this. It reads the
session transcripts in `~/.claude/projects`, shows where the tokens and the dollars went, and
offers fixes. A fix can set a key in `settings.json`, like the model or the effort level, and it
asks before applying anything. Each fix it applies gets tracked, so the next run compares the
sessions before and after. It is a prototype right now. The goal is for it to be the source of
truth for these settings, run on a schedule like the other triggers in section 4, so I stop
picking them by feel.

To try it:

```bash
claude plugin marketplace add shanep/claude-plugins
claude plugin install tune@shanep
```

Then run `/tune` in any session.

## Where this stands

| Piece | Status |
| :--- | :--- |
| Tests in git hooks and CI | In place |
| Living at head, landing one session at a time | In place |
| Autoupdate for my plugins | In place |
| Background agents in their own worktrees | In place, started by hand |
| A second agent reviewing before landing | In place |
| Agents started by a CI failure | In place, in 3 repos |
| Agents started by a labeled issue or a schedule | Built, no real run yet |
| claude-tune as the source of truth for model and effort | Prototype |

None of these rules works alone. Autoupdate means a push reaches everyone, so the tests have to
catch problems before the push. The tests are what make it safe to live at head without pull
requests, and to let an agent land a change while I am not watching. Worktrees and the review
are what make it safe to run several agents at once. The triggers are the last step, and with
them the loop in the first figure runs without waiting on me.
