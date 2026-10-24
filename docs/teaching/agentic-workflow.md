# An Agentic Software Workflow

This is a workflow for building software with [Claude Code](https://code.claude.com/docs),
where agents do the work and a person sets the direction. Feature branches, pull requests and
release trains were built around people typing slowly and reviewing each other's work. An agent
writes the code in minutes, so the slow parts are knowing the code is right, getting it to the
people who use it, and any change that has to wait for a person to start it.

The workflow is 8 rules, and the first 2 matter the most. It is a living document, and
[Where this stands](#where-this-stands) lists which parts are in place and which are planned.
For the Claude setup underneath it (syncing config across machines, hooks, handing work to a new
session), see [My Claude Code Setup](/teaching/claude-code-setup).

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

Everything else on this page is about making that split safe. An agent that works while I am
not watching needs checks that do not depend on me watching.

## 1. Testing is the most important part

Tests are what let me step out of the loop. An agent can write more code in an afternoon than I
can read in a week, so I do not try to read all of it. I read the tests. They say what the code
is supposed to do, and if a behavior matters it gets a test, because a test is the only thing
that keeps checking it after I stop looking.

The checks run on their own. Every repo has git hooks: pre-commit runs the fast checks and
pre-push runs the full suite, and CI runs the same things again on a clean machine. The
[setup page](/teaching/claude-code-setup#hooks) lists every hook, where it comes from and how it gets turned on. Done means
the hooks and CI pass, not that an agent says it is done.

The tests have to check the thing users actually do. My plugin marketplace,
[claude-plugins](https://github.com/shanep/claude-plugins), has two scripts:

- `scripts/check.sh` validates the marketplace and fails if any plugin is not an `https` URL.
  The pre-commit hook runs it.
- `scripts/test-install.sh` adds the checkout as a marketplace and installs every plugin into a
  throwaway config with ssh turned off. The pre-push hook runs both.

Turning ssh off matters. A plugin listed as a `github` source clones over ssh, and that fails
on any machine without a GitHub key, which is most student laptops. Only a test that installs
the plugin the way a student would catches it. CI
runs both scripts on Ubuntu and macOS on every push, and once a week, since the plugins live in
other repos and can break without a change in this one.

## 2. Autoupdate from day 1

Anything that gets installed on someone else's machine (a plugin, a command line tool, a
desktop app) has to update itself, and that has to be in the first version. Pushing a fix to main
does not do much good if people are still running the version from last month. And autoupdate is
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

A push to main goes live on every machine with autoupdate on the next time Claude Code
starts, including student machines. That is exactly why rule 1 has to hold. Nobody
reviews a release before it goes out, so the checks are the review.

Autoupdate brings a few other things with it on day 1:

- A version number in every build, so I can tell what someone is running when they report a
  bug.
- Migrations for saved state. If the tool keeps files on the user's machine, the new version has
  to read whatever the old version left behind.
- A way to roll back. Rolling back is a revert pushed to main, and it reaches everyone the same
  way the bad change did.

## 3. Agents start the work, not just me

A change that waits for a person to type a prompt waits on the slowest step in the loop. A
failing build waits until someone notices it, and a bug report waits until someone reads it. So
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

None of this runs on my own machines. Each agent is a GitHub Actions job on a fresh Ubuntu
virtual machine that GitHub starts for the job and throws away when it ends. The job checks out
the repo, installs Claude Code, runs both sessions and the checks, and pushes. My laptop can be
asleep the whole time. I find out from the commit, or from an issue if the agent gave up, and
the run's log and summary are in the repo's Actions tab.

The sessions log in with a token from `claude setup-token`, saved as a secret in each repo, so
they count against my Claude subscription the same as a session I start by hand. The runner
minutes are free on a public repo. A private repo uses the minutes that come with the GitHub
plan, which is why my dotfiles repo runs its CI once a day instead of on every push.

The rules for these agents are the same as for one I start by hand, plus a few more since nobody
is watching. They never tag a release. They get 2 tries, and then the agent stops and leaves a
note on the issue (or opens an issue) instead of trying forever. An agent never tries to fix its
own commit when it breaks CI, since that is how you get a loop. That one gets an issue for me.

## 4. One controller per repo, every worker in its own worktree

Each repo gets one live session, the one I am talking to, called the controller. It runs
in the main checkout on main and edits only small fixes itself. Its job is to turn what I want
into a plan, start a worker for each piece, answer the workers' questions, review what they did
and land it. Every worker is a background session in its own git worktree on a
`worktree-<name>` branch, so parallel sessions never share uncommitted changes, checkouts or
build output, and cannot step on each other. An agent a trigger starts gets a fresh CI runner
instead, which keeps it apart the same way.
Only the controller ever touches the main checkout.

<WorkflowDiagram name="controller" />

### Two sizes of work

Not every change needs a plan and a worker. Writing a brief, starting a worker and landing its
branch takes longer than fixing a typo, so there are two workflows, and the controller picks one
before it starts.

<WorkflowDiagram name="sizes" />

| | Small fix | Feature or large change |
| :--- | :--- | :--- |
| Examples | A bug with a known cause, a typo, a dead link, a setting, a one-file change | A new feature, a redesign, a change across many files, anything with a decision to make |
| Who does it | The controller, in the main checkout | Workers, each in its own worktree |
| Plan file | None | One, committed in the repo |
| Landing | The controller commits on main and lands it | The controller lands each branch in plan order |

A small fix is one I can describe in one sentence and check with the tests that already exist,
plus at most one new test. The controller does it itself:

1. If it is a bug, write a test that fails first. The fix then has something to prove, and the
   bug cannot quietly come back.
2. Make the fix and commit it on main.
3. Land it. The pre-push checks run, and the review in section 5 runs on any change of 30 lines
   or more.

A fix stops being small when it touches more than a few files, needs a decision from me, or fails
its checks twice. Then the controller stops, writes a plan and switches to the feature workflow.
Starting small and switching is cheaper than planning every change.

The trigger agents in section 3 run the small-fix workflow, on a CI runner instead of the main
checkout. A failing build or a labeled issue is almost always a small fix. When one turns out not
to be, the agent stops after its 2 tries and leaves a note on the issue, and I turn it into a plan.

### Where each one runs

| Who | Runs on | Started by | Reports back by |
| :--- | :--- | :--- | :--- |
| Controller | My Mac, in the main checkout | Me, with `claude` | I am talking to it |
| Local worker | My Mac, in its own worktree | The controller, with `claude --bg -w` | `SendMessage` to the controller |
| Cloud worker | Anthropic's cloud, in a fresh clone | The controller, with `claude --cloud` | A branch on GitHub, plus its transcript |
| Subagent | Inside the controller | The controller, for a search or to watch CI | Its answer, inside the controller |
| Trigger agent | A GitHub Actions runner | Failing CI, a labeled issue or a schedule (section 3) | A commit, or an issue if it gave up |

Workers run on my Mac unless I mark a task for the cloud. A cloud worker gets a fresh clone and
nothing else, so it only fits a task that needs no local secrets or files (`.env`, my Canvas and
Google Drive logins, the textbook PDFs), no work network and no Mac-only tool. Anything that runs
`edutools` stays local. A cloud session cannot message another session yet, so the controller
checks on it instead of waiting to hear back.

### The plan file

The controller writes the plan into the repo as `.claude/plans/<date>-<slug>.md` and commits it,
so every worker can read it. The top of the plan is one table, with a row per task:

```markdown
| id | task                    | model  | effort | where | after | status         |
|----|-------------------------|--------|--------|-------|-------|----------------|
| T1 | Add the hooks section   | sonnet | medium | local | -     | landed 3f2a91c |
| T2 | Draw the new diagram    | opus   | high   | local | -     | running        |
| T3 | Regenerate modules.json | haiku  | low    | cloud | T1    | todo           |
```

Below the table, each task gets its own section: the goal, the files to read first, the
decisions already made and how to tell it is done. That section becomes the worker's brief. The
controller keeps the status column up to date (todo, running, review, landed or blocked) and
commits it each time.

Changing the plan is meant to be quick. I edit a cell, or tell the controller "move T3 to opus,
high, local", and `/dispatch T3` starts that row again. A blank model or effort cell takes the
default from section 8.

The plan does not stay in the repo. The last landing commit deletes it, so the tree stays clean,
and git history still has every version. Anything worth keeping, like a decision a later session
needs, goes into `CLAUDE.md` or a commit message first. An old plan sitting in the repo would
only mislead the next session that reads it.

### Landing

There are no pull requests. I am the only developer on most of these repos, so a pull request
would just be me approving my own work, and an agent should not have to wait on that. Workers
commit on their branch and never land. The controller lands them one at a time, in plan order:
it rebases the branch onto main, fast-forwards main to it and pushes, which runs the pre-push
checks once. Then it removes the worktree and deletes the branch with `git branch -d`, not
`-D`, so git refuses to delete work that never landed. In the repos that have it,
`npm run land` does these steps and takes a lock, so two sessions never land at the same time.

<WorkflowDiagram name="trunk" />

The branches only live for an hour or two, so main is never far behind the work. `/dispatch`
starts a worker for each ready row in the plan. `/handoff`, on the
[setup page](/teaching/claude-code-setup#handing-work-to-a-new-session-with-handoff), starts a single worker
without a plan.

## 5. A second agent reviews before anything lands

The agent that wrote the code is not the one that reviews it. The controller reviews each
worker's branch before it lands it. In the repos that have it, `npm run land` runs a review of
the change before it pushes, and a blocking finding stops the landing. Then there are two
choices: fix the finding and land again, or decide the finding is wrong and land with
`-- --accept-review`. Either way it is a decision someone made, not something that slipped
through. A change under 30 lines skips the review and relies on the checks.

## 6. Automate every step

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

## 7. Agent config is code

My `CLAUDE.md`, skills and hooks live in a git repo and get committed, synced and pushed like
any other code. That config is how I tell an agent what to do when I am not there to tell it, so
it gets the same care as the code. A rule that only exists in one session's context is gone when
the session ends, and a rule in a file on one machine is not on the others. The
[setup page](/teaching/claude-code-setup) covers how the syncing works.

The same goes for the repos themselves: every file is either committed or listed in
`.gitignore`. A file git does not know about is one `git clean` away from being lost.

## 8. Tune the model and effort from data

Which model to run, and at what effort level, should come from what the sessions actually did,
not from a guess.

<WorkflowDiagram name="tune" />

[claude-tune](https://github.com/shanep/claude-tune) is my plugin for this. It reads the
session transcripts in `~/.claude/projects`, shows where the tokens and the dollars went, and
offers fixes. A fix can set a key in `settings.json`, like the model or the effort level, and it
asks before applying anything. Each fix it applies gets tracked, so the next run compares the
sessions before and after. It is meant to be the source of truth for these settings, run on a
schedule like the other triggers in section 3.

Until it has the data, these are the starting guesses for each kind of session. They live in one
place, the `/dispatch` skill, and a row in a plan can override them.

| Session | Model | Effort |
| :--- | :--- | :--- |
| Controller | Opus 5.5 | medium |
| Worker on a hard task: design, debugging, a change across many files | Opus 5.5 | high |
| Worker on a routine task: following a pattern, course content, a small feature | Sonnet 5.5 | medium |
| Worker on a mechanical task the hooks would catch: regenerating a file, bumping dependencies | Haiku 5.5 | low |
| Worker writing in my voice | Opus 5.5 | medium |
| Subagents that search or watch CI | Haiku 5.5 | - |
| Review before landing (`/code-review high`, in the controller) | Opus 5.5 | high |

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
| Autoupdate for my plugins | In place |
| Small fixes by the controller, without a plan | In place |
| Background agents in their own worktrees | In place, started by hand |
| Controller dispatching from a plan file | Plan files in use, written by hand. `/dispatch` is planned |
| Cloud workers | Planned |
| Workflow skills and agents packaged as one plugin | Planned |
| A second agent reviewing before landing | In place |
| Agents started by a CI failure | Built, run once by hand. CI has not failed on main since |
| Agents started by a schedule | Built, first run on Monday, October 26 |
| Agents started by a labeled issue | Built, no real run yet |
| claude-tune as the source of truth for model and effort | Prototype |

None of these rules works alone. Autoupdate means a push reaches everyone, so the tests have to
catch problems before the push. The tests are what make it safe to push straight to main without
pull requests, and to let an agent land a change while I am not watching. Worktrees, the review
and one controller doing all the landing are what make it safe to run several agents at once.
The triggers close the loop in the first figure, so it runs without waiting on me.
