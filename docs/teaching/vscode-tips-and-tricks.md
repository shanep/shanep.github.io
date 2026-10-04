# VS Code Tips and Tricks

[VS Code](https://code.visualstudio.com/) is the editor we use in all of my classes. This page
walks you through getting it setup and then covers some cool features that will make you a lot
faster once you learn them.

## Pick where your code runs

All of the work in my classes is done on Linux. VS Code itself runs anywhere, so the real choice
is where the Linux part lives. Pick one of these:

- **GitHub Codespaces** - VS Code and a Linux machine in your browser, nothing to install. This is
  the easiest option. See the [GitHub Codespaces guide](github-codespaces.md).
- **Onyx** - VS Code on your computer connected to the CS department's Linux server over SSH. See
  [VS Code Remote Development](vscode-remote-dev.md).
- **Your own computer** - If you already run Linux you are all set. If you are on Windows, use
  [WSL](https://learn.microsoft.com/en-us/windows/wsl/install) to run Linux right inside Windows.

If you are on a Mac, VS Code works great, just use Codespaces or Onyx for your coursework.

## Install VS Code

You can skip this section if you are using Codespaces.

1. [Install VS Code](https://code.visualstudio.com/download)
2. **Windows only:** open PowerShell as an administrator, run `wsl --install`, and reboot. Then
   install the [WSL extension](https://code.visualstudio.com/docs/remote/wsl) in VS Code. From
   now on open your projects by typing `code .` in your Ubuntu terminal, so VS Code is running
   against Linux and not Windows.
3. Read through the [user interface tutorial](https://code.visualstudio.com/docs/editing/getting-started/userinterface)
4. Read [Terminal Basics](https://code.visualstudio.com/docs/terminal/basics)

::: tip
Git Bash is fine for running `ssh` to get to Onyx, but do not build or run your coursework in Git
Bash or PowerShell. The scripts and tools we use expect a real Linux shell, and they will break in
strange ways on anything else.
:::

## Configure git

Open the terminal (**View > Terminal**) and tell git who you are. Make sure and use an email that
is on your GitHub account, see [GitHub Tips and Tricks](github-tips-and-tricks.md#use-one-account-for-everything)
for why.

```bash
git config --global user.name "Your Name"
git config --global user.email "you@u.boisestate.edu"
```

Then set a few defaults that make git easier to live with.

```bash
git config --global init.defaultBranch main
git config --global pull.rebase true
git config --global push.autoSetupRemote true
git config --global fetch.prune true
git config --global diff.colorMoved zebra
```

Here is what each one does:

- `init.defaultBranch main` - New repositories start on `main` to match GitHub.
- `pull.rebase true` - `git pull` replays your commits on top of the new ones instead of creating
  a merge commit. When you are first learning git this means fewer conflicts to deal with.
- `push.autoSetupRemote true` - The first `git push` on a new branch just works, no more
  `--set-upstream` error.
- `fetch.prune true` - Branches deleted on GitHub get cleaned up locally.
- `diff.colorMoved zebra` - Lines you moved show up in a different color than lines you changed.

You need to do this once on **each** machine you use (your laptop, Onyx, and WSL all count as
separate machines).

## Shortcuts worth learning

If you only learn one shortcut, learn the Command Palette. Every command in VS Code is in there,
so you never have to remember which menu something lives in.

| Shortcut         | What it does                                         |
| :--------------- | :--------------------------------------------------- |
| `Ctrl+Shift+P`   | Command Palette, search every command                |
| `Ctrl+P`         | Open a file by typing part of its name               |
| `` Ctrl+` ``     | Show or hide the terminal                            |
| `Ctrl+Shift+F`   | Search across every file in the project              |
| `F12`            | Go to the definition of the function under the cursor |
| `F2`             | Rename a variable or function everywhere it is used  |
| `Ctrl+D`         | Select the next match of the current word            |
| `Alt+Click`      | Add another cursor                                   |
| `Ctrl+/`         | Comment or uncomment the selected lines              |

On a Mac, use `Cmd` in place of `Ctrl` and `Option` in place of `Alt`. The full list is in
**Help > Keyboard Shortcuts Reference**.

## Use the debugger

Stop debugging with `printf` and use the real debugger. Click in the margin to the left of a line
number to set a breakpoint, then press `F5` to start your program. When it stops at the
breakpoint you can step through one line at a time and look at the value of every variable.

The first time you press `F5`, VS Code may ask you to pick a debugger or create a `launch.json`
file. See [Debugging in VS Code](https://code.visualstudio.com/docs/debugtest/debugging) for the
details. Make sure you can use the debugger **now** instead of at 11:45pm the night a project is
due.

## Use the Source Control view

The Source Control view (`Ctrl+Shift+G`) shows every file you changed. Click a file to see a
side by side diff, which is a great way to review your work before you commit. You can stage,
commit, and push from there too.

That said, learn the git commands in the terminal as well. Some classes require them, and the
terminal is what you will have when you ssh into a server at work.

## Extensions

Install extensions from the Extensions view (`Ctrl+Shift+X`). A few that are useful in my
classes:

- [C/C++](https://marketplace.visualstudio.com/items?itemName=ms-vscode.cpptools) - Code
  completion and debugging for C
- [Python](https://marketplace.visualstudio.com/items?itemName=ms-python.python) - Code
  completion, linting, and debugging for Python
- [Live Preview](https://marketplace.visualstudio.com/items?itemName=ms-vscode.live-server) -
  View a website as you edit it
- [Remote Development](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.vscode-remote-extensionpack) -
  Connect to Onyx and WSL

If a starter repository includes a `.vscode/extensions.json` file, VS Code will pop up a message
asking if you want to install the recommended extensions. Say yes.

## Settings Sync

Turn on [Settings Sync](https://code.visualstudio.com/docs/configure/settings-sync) and sign in
with your GitHub account. Your settings, keyboard shortcuts, and extensions will follow you to
every machine you use, including Codespaces.

## A.I. tools

VS Code has GitHub Copilot built in, and verified students get it for free through [GitHub
Education](github-tips-and-tricks.md#github-education).

::: danger
The rules for A.I. tools are different in every class. Read the syllabus in **each** of your
classes and look for the policy on A.I. tools before you use them.
:::
