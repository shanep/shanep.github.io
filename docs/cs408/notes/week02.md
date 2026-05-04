# Week 2: Your First Pull Request

**Phase:** Onboarding  
**Due by Friday:** Onboarding PR merged + 2 peer reviews given

## Goal

Ship your first PR. It is small on purpose — the goal is to prove you can navigate the full workflow: branch → commit → CI → peer review → merge.

## Monday

Read the codebase top to bottom. You do not need to understand every line, but you should be able to answer:

- What does `app/main.py` do?
- What are the two database models and what fields do they have?
- What routes does `app/routes/jobs.py` expose?
- What does a Jinja2 template look like (`templates/base.html`)?

Spend 30–45 minutes on this. You will write much better code if you understand what already exists.

## Wednesday

Find your onboarding issue on GitHub:

1. Go to the repo → **Issues** → filter by `Milestone: Onboarding`
2. Find the issue titled `[Onboarding] Add your name to CONTRIBUTORS.md` and assign it to yourself
3. Create a branch:

```bash
git checkout -b feat/issue-N-add-yourusername-to-contributors
```

4. Add your row to `CONTRIBUTORS.md`:

```markdown
| @yourgithubusername | Your Role | A fun fact about yourself |
```

5. Commit and push:

```bash
git add CONTRIBUTORS.md
git commit -m "Add @yourusername to CONTRIBUTORS.md"
git push origin feat/issue-N-add-yourusername-to-contributors
```

6. Open a pull request on GitHub. Fill out every section of the PR template. Write `Closes #N` in the summary.

CI will run automatically. Wait for it to go green before requesting reviews.

## Thursday–Friday

- **Request reviews** from two classmates (message them directly if needed)
- **Give two reviews** on your classmates' PRs — go to the repo → Pull Requests and find open onboarding PRs
- **Respond to any comments** on your own PR within 24 hours
- Once you have 2 approvals and CI is green, **merge your own PR**

## What makes a good review?

A review is not just clicking "Approve." Look for:

- Does the PR template have `Closes #N`? If not, ask them to add it.
- Does CI pass? If not, tell them what failed.
- Is the fun fact actually there? Is the table formatted correctly?
- Leave at least one comment — even a short "Looks good, left a formatting note" is better than a silent approve.

## Week 2 checklist

- [ ] Onboarding PR is merged into `main`
- [ ] PR was linked to an issue (`Closes #N` in description)
- [ ] CI passed before merge (all checks green)
- [ ] You gave substantive reviews on 2 classmates' PRs
- [ ] Syllabus Quiz submitted in Canvas
