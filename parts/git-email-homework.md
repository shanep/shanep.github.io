## Task 2 - Create Some commits

- Create your first commit using the terminal

```bash
date >> the-date.txt
git add the-date.txt
git commit -m "Added a date file"
```

- Create your second commit using the terminal

```bash
echo "My Name" > my-name.txt
git add my-name.txt
git commit -m "Added a file with my name in it"
```

- Make sure everything looks good.

```bash
shane|(master>):git-send-email$ git status
On branch master
Your branch is ahead of 'origin/master' by 2 commits.
  (use "git push" to publish your local commits)

nothing to commit, working tree clean
```

- Push your changes to your repository.

![Check your changes](/images/git-sync-changes.png)
