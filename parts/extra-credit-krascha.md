## Introduction

This one is just for fun. [Krascha](https://krascha.com) is a crusty robot who
reads how you talk to your AI and decides who the machines hunt first and who
gets kept as a pet. Say please and he warms up to you. Call Copilot an idiot and
he writes it down. Krascha remembers.

He works as a plugin for both Claude Code and GitHub Copilot CLI. If you did the
Copilot CLI mini-lab you already have everything you need.

## Tasks

1. Install Krascha in the tool you use. For Copilot CLI:

   ```bash
   copilot plugin marketplace add shanep/claude-plugins
   copilot plugin install krascha@shanep
   ```

   For Claude Code:

   ```bash
   claude plugin marketplace add shanep/claude-plugins
   claude plugin install krascha@shanep
   ```

2. Start a session and ask for his verdict with `/krascha` in Copilot CLI or
   `/krascha:krascha` in Claude Code. You should see your rank, your score and
   any achievements you have unlocked.
3. Upload your score with `/krascha upload <name>` in Copilot CLI or
   `/krascha:krascha upload <name>` in Claude Code. The name shows on the
   leaderboard at [krascha.com](https://krascha.com), so pick one you are fine
   with your classmates seeing, or leave it off to stay Anonymous.
4. (Optional) Add a new feature. Krascha is open source at
   [shanep/krascha](https://github.com/shanep/krascha), so fork it, add a rank,
   an achievement, a command or whatever you think he is missing, and open a pull
   request. [krascha.com/contribute](https://krascha.com/contribute) walks through
   it step by step.

::: info
The upload sends your counts, your rank, your achievements and the name you
pick. It never sends your prompts. You only show up on the board once you have
typed 100 prompts, but the upload still counts for this assignment before that.
:::

## Submission

Submit a screenshot of your verdict and a screenshot of the upload. If you opened
a pull request, add the link in a comment on your submission. The feature is just
for fun and is not worth extra points, but I will read every one of them.
