# My Claude Code Setup (as of 10/20/26)

I use [Claude Code](https://code.claude.com/docs) on a few different machines, and I want the
same Claude on every one of them: the same instructions, settings, skills and plugins. This page
covers how I keep them in sync, how I hand work off to a new session, and the habits I ask Claude
to follow. None of it is fancy. It is a git repo, some symlinks and two shell scripts.

## Same Claude everywhere

All of my Claude config lives in one git repo (my dotfiles), and a script called `link.sh`
symlinks it into `~/.claude`. Editing the live file edits the repo, so there is nothing to copy
back. These get linked:

- `CLAUDE.md`, my global instructions
- `settings.json`
- `keybindings.json`, if I have one
- every entry in `skills`, `agents`, `commands`, `output-styles` and `hooks`

The folders are linked one entry at a time instead of linking the whole folder. Claude Code and
claude.ai both write their own files into those folders, and linking the whole folder would drag
their files into my repo.

A few rules keep the links from losing anything:

- If a real file is already sitting where a link goes, it gets moved to
  `~/.dotfiles-backup/<timestamp>/` instead of deleted. The backup goes outside `~/.claude`
  because a copy left in `~/.claude/skills` would load as a second skill.
- If a skill, agent, command or output style shows up in `~/.claude` as a plain file (say, one
  Claude just wrote for me), `link.sh` adopts it. It moves the file into the repo and links it
  back, so it shows up in `git status` instead of living on one machine.
- If a link points at a file that is no longer in the repo, `link.sh` deletes it. Otherwise
  removing a skill on one machine would leave a dead link on all the others.

On a new machine `install.sh` runs `link.sh` and then installs the plugins. It reads
`settings.json`, adds any plugin marketplace listed under `extraKnownMarketplaces`, and installs
every plugin under `enabledPlugins`. For me that is `pyright-lsp`, `clangd-lsp` and `boisestate`
(from the [boisestate.ai marketplace](https://github.com/shanep/boisestate.ai)). The LSP plugins
do nothing without a language server on the `PATH`, so it also runs `npm install -g pyright`.
`clangd` comes with the Xcode command line tools on macOS and is a package install on Linux.

## Auto sync

I never commit or pull my Claude config by hand. Two hooks in `settings.json` run a script called
`dotfiles-sync.sh`:

```json
"hooks": {
  "SessionStart": [{ "hooks": [{ "type": "command", "timeout": 5,
    "command": "sh \"$HOME/.claude/hooks/dotfiles-sync.sh\" -b" }] }],
  "SessionEnd": [{ "hooks": [{ "type": "command", "timeout": 60,
    "command": "sh \"$HOME/.claude/hooks/dotfiles-sync.sh\"" }] }]
}
```

At session start the script runs in the background, so startup is not slowed down, and at most
once every 5 minutes, so opening a bunch of sessions at once does not mean a bunch of fetches. At
session end it pushes whatever the session changed. If there is nothing to push it skips the
network completely.

Each run does the same steps:

1. Commit anything changed under `claude/` as "Sync Claude config from &lt;host&gt;"
2. Rebase onto `origin`
3. Push
4. Rerun `link.sh`, so a skill added on another machine gets linked here

A sync that runs with nobody watching has to be careful, so the script:

- Takes a lock, and takes over a lock older than 10 minutes, since a killed sync leaves its lock
  behind
- Never waits on a password prompt (`ssh -o BatchMode=yes` and `GIT_TERMINAL_PROMPT=0`)
- Refuses to commit anything that looks like a secret: Anthropic, GitHub, AWS or Slack tokens,
  and private keys
- Only touches `claude/`, and only when the checkout is on the default branch

When something goes wrong (a rebase conflict, a secret, the checkout on the wrong branch, a
failed push) the script writes the reason to `~/.cache/dotfiles-sync/problem`. The next session
start prints that file, which puts it in front of Claude, and Claude tells me about it. So a
broken sync gets noticed the next time I open a session instead of a month later.

Everything is POSIX `sh` and `getopts`, so the same scripts run on macOS and Linux.

## Why not something else?

There is no official way to sync Claude Code settings across machines yet. claude.ai does sync
skills and plugins, but only one way, into `~/.claude/skills/synced` (which `link.sh` leaves
alone). There is an open feature request for account-level sync:
[anthropics/claude-code#22648](https://github.com/anthropics/claude-code/issues/22648).

Tools like [chezmoi](https://www.chezmoi.io/) or [Nix](https://nixos.org/) can do this and much
more. If my needs grow I will look at them, but for now symlinks and git are enough.

## Handing work to a new session with /handoff

Sometimes a session has done its part and the rest should happen somewhere else, or a side task
comes up that should not clutter the current conversation. For that I wrote `/handoff`, a small
skill built on Claude Code's built-in background sessions.

When I run `/handoff <what to do>`, Claude writes a brief for the new session. The new session
knows nothing about the old one, so the brief spells it out:

- the goal, in a sentence or two
- what is already done, with file paths and commits
- decisions made and dead ends tried, so it does not redo them
- what to do next, in order, and how to tell it is finished
- the files to read first

Then it starts the new session in its own worktree:

```bash
claude --bg -w <slug> -n <slug> "<brief>"
```

`--bg` runs it in the background, `-w` gives it a new git worktree, and `-n` names it. The
worktree lands at `<repo>/.claude/worktrees/<slug>` on a branch named `worktree-<slug>`.

These are the commands for keeping track of background sessions:

| Command | What it does |
| :--- | :--- |
| `claude agents` | List the background sessions |
| `claude attach <id>` | Open a session in this terminal |
| `claude logs <id>` | Print a session's recent output |
| `claude stop <id>` | Stop a session (the conversation is kept) |
| `claude rm <id>` | Delete a session **and** its worktree |

`attach` and `logs` take part of the session name too. `stop` and `rm` only take the short id
that `claude --bg` prints and `claude agents` lists.

::: warning GOTCHA
`-w` branches from origin's default branch, not from your current `HEAD`, and it does not carry
over uncommitted changes. So a new session will not see work that only exists in the old one. To
get around that, `/handoff` commits the work on the old session's branch first, and the brief
tells the new session to merge that branch before doing anything else. You can also set
`worktree.baseRef` to `"head"` in your settings to branch from `HEAD` instead.
:::

## Small over heavy

I used to run Overlord, a much heavier session manager I built: 15 hooks, telemetry and a set of
command shims. Once Claude Code got background sessions built in, most of it was doing work
Claude Code already does, so I retired it. Background sessions plus `/handoff` cover what I
actually used.

The one piece I kept was the session tuning, which I pulled out into its own plugin,
[claude-tune](https://github.com/shanep/claude-tune). It reads your local session transcripts
and suggests settings changes based on how you actually work. To install it:

```bash
claude plugin marketplace add shanep/claude-tune
claude plugin install tune@claude-tune
```

Then run `/tune` in any session.

## Writing your own slash command

A slash command is just a skill. Make a folder under `~/.claude/skills/` named after the command
and put a `SKILL.md` in it:

```text
~/.claude/skills/handoff/SKILL.md
```

The file is some frontmatter plus the instructions you want Claude to follow:

```markdown
---
name: handoff
description: Hand the current work, or a new task, to a fresh background Claude session in its own worktree.
argument-hint: "[what the new session should do]"
disable-model-invocation: true
---

Start a background Claude session that picks up work from here. $ARGUMENTS says
what it should do. If it is empty, hand off the work in progress in this session.

1. ...
```

Two parts are worth knowing about:

- `disable-model-invocation: true` means the skill only runs when you type `/handoff`. Without
  it, Claude can decide to load the skill on its own when the description matches what you are
  doing.
- `$ARGUMENTS` is replaced with whatever you typed after the command, so `/handoff fix the
  failing test` hands off "fix the failing test".

The whole `/handoff` skill is about 40 lines, so you do not need much to get something useful.

## Habits I ask Claude to follow

My global `CLAUDE.md` is mostly rules about how work gets done. The ones that matter most:

- Every session works in its own git worktree. Parallel sessions never share uncommitted
  changes, checkouts or build output, so they can not step on each other.
- Finished work lands straight on the default branch, with no pull requests. Claude rebases onto
  the latest `origin`, lets the checks run and pushes. I am the only developer on most of these
  repos, so a pull request would just be me approving my own work.
- Releases always need my go-ahead. Tagging a release is never automatic.
- The repo's git hooks and CI are the checks. If a pre-push hook already runs the build and the
  tests, Claude does not also run them by hand first.
- Code has to work on both macOS and Linux. That means `getopts` instead of GNU `getopt`, and
  watching for the BSD and GNU differences in tools like `sed` and `date`.
