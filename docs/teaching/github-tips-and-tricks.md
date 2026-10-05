# GitHub Tips and Tricks

GitHub is where you will keep the code for almost every class you take, and it is also where
future employers will go to look at your work. This page covers the setup you need once, the
habits that will save you at 11:45pm the night a project is due, and some cool features that most
students never find.

## GitHub Education

Verified students get a bunch of paid GitHub features for free, including GitHub Copilot and the
same Codespaces quota as a GitHub Pro account. You will need to sign up with your Boise State
email address so GitHub can verify that you are a student.

- [Sign up for GitHub Education](https://education.github.com/pack)
- [GitHub Codespaces guide](github-codespaces.md)

You **never** have to pay for GitHub. All assignments can be completed with the free tier, and if
you run out of free Codespaces hours you can use the CS department lab machines to finish your
projects.

::: danger
Some professors in the CS department view using A.I. tools such as Copilot as cheating, and the
rules are different in every class. Read the syllabus in **each** of your classes and look for
the policy on A.I. tools before you use them.
:::

## Use one account for everything

Use one personal GitHub account for all of your classes. Do not create a new account each
semester or a throwaway account for a single class. Your account will follow you after you
graduate, so in a few years it becomes a portfolio of everything you have built.

Add your Boise State email to your account under **Settings > Emails**, even if your personal
email is your primary one. Then make sure git on every machine you use knows who you are.

```bash
git config --global user.name "Your Name"
git config --global user.email "you@u.boisestate.edu"
```

The email in `git config` **must** match one of the emails on your GitHub account. If it does
not, your commits will not be linked to your account, and your instructor cannot easily tell
that they are yours.

## Keep your coursework private

Unless your instructor tells you otherwise, every repository with your homework or projects in it
should be **private**. A public repository with your solution in it lets anyone copy your work,
and if another student turns in your code you can both end up in an academic integrity meeting.
This applies after the class is over too, since most instructors reuse their projects.

The one exception is a forked repository. GitHub does not let you make a fork of a public
repository private, so do not use the **Fork** button to start an assignment. Use the template
approach below instead.

## Starting from starter code

Most starter code is published as a template repository. A template gives you a brand new
repository of your own with a copy of the code, and you get to pick whether it is public or
private.

1. Open the starter code repository your instructor gave you.
2. Click **Use this template** and then **Create a new repository**.
3. Pick a name, select **Private**, and click **Create repository**.

You can do the same thing from the command line with the [gh](https://cli.github.com/) tool
(setup is at the bottom of this page).

```bash
gh repo create my-project --private --clone --template OWNER/STARTER-REPO
```

## Sharing a repository with your instructor

Since your repository is private, your instructor cannot see it until you give them access. If
your class asks you to submit a link to your repository, go to **Settings > Collaborators**, click
**Add people**, and add your instructor's GitHub username. Do this **before** the due date. A link
your instructor cannot open is the same as not submitting anything.

## Commit early and often

Commit every time you get something working, and push at the end of every session. Your commit
history is a backup, an undo button, and a record that shows how you built your project over
time. A project that shows up in one giant commit the night it is due is a lot harder to defend
if anyone ever has questions about where the code came from.

Write commit messages that say what you did: "Add input validation to parse_args", not "stuff" or
"asdf". Future you will thank you.

## Do not commit secrets or junk

Some things should never end up in your repository:

- Passwords, API keys, and tokens
- Build output (`*.o`, executables, `build/`, `dist/`)
- Dependencies you can download again (`node_modules/`, `venv/`)
- Editor and OS files (`.DS_Store`, `.idea/`)

List these in a [.gitignore](https://docs.github.com/en/get-started/git-basics/ignoring-files) file
in the root of your repository so git ignores them. GitHub keeps a [collection of .gitignore
templates](https://github.com/github/gitignore) for most languages, so you can start from one of
those.

::: warning
If you push a password or API key by mistake, deleting the file in a new commit is **not**
enough. It is still in your history. Revoke the key and generate a new one right away.
:::

## Check the green check mark

Some classes use [GitHub Actions](https://docs.github.com/en/actions) to build and test your code
every time you push. Look for the icon next to your latest commit on github.com. A green check
means everything passed, a red X means something failed, and you can click it to see the output.
Check this before you submit, not after.

## Working on a team project

When you work with other students in the same repository, do not all push to `main`. Each person
should work on their own branch and merge it with a pull request.

```bash
git switch -c add-login-page
# do some work and commit it
git push -u origin add-login-page
gh pr create --fill
```

A pull request gives your teammates a chance to review your code before it is merged, and GitHub
keeps a record of who did what. This is how almost every software team works in industry, so it
is a good habit to build now.

## Quick edits in the browser

Press the `.` key while you are looking at any repository on github.com and it opens in a
lightweight version of VS Code right in your browser. It is great for fixing a typo or editing a
README, and it does not use any of your Codespaces hours. It does not have a terminal though, so
you cannot build or run anything.

## Fixing common mistakes

::: details I forgot to add a file to my last commit
As long as you have not pushed yet, add the file and amend the commit.

```bash
git add missing-file.c
git commit --amend --no-edit
```
:::

::: details I want to throw away my changes to a file
This puts the file back the way it was at your last commit. Your changes are gone for good, so
make sure that is what you want.

```bash
git restore src/lab.c
```
:::

::: details My push was rejected
This usually means there are commits on GitHub that you do not have yet (you pushed from another
machine, or a teammate pushed). Pull them in first and then push again.

```bash
git pull --rebase
git push
```
:::

::: details I pushed a commit that broke everything
Create a new commit that undoes it. Use `git log --oneline` to find the commit id.

```bash
git revert a1b2c3d
git push
```
:::

::: details My repository is a mess and I do not know how to fix it
Do not delete anything yet. Clone a fresh copy of your repository into a new folder, copy the
files you changed over to it, and commit them there. If you are still stuck, come to office hours
and bring the URL of your repository.
:::

<!--@include: ../../parts/setup-gh-cli.md -->
