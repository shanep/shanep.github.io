# Week 4: Sprint 1 Delivery

**Phase:** Sprint 1 — Core CRUD  
**Due by Friday:** PR merged + 2 reviews given

## Goal

Get your Sprint 1 PR across the finish line and give two meaningful reviews to teammates.

## Monday

Convert your draft PR to **Ready for Review**:

1. On GitHub, open your PR → click **Ready for review**
2. Verify all CI checks are green — fix any failures before requesting reviews
3. Re-read your own diff: would a stranger understand what changed and why?
4. Request reviews from two specific teammates (tag them in a comment)

## Wednesday

- **If you are waiting on reviews:** Review someone else's PR. Do not sit idle.
- **If you have review comments:** Address every comment — either fix the code or explain in a reply why you disagree. Never leave a comment unanswered.
- **If your PR is approved and green:** Merge it yourself. Do not wait for the instructor.

After merging:
```bash
git checkout main
git pull origin main
```

Then self-assign a second Sprint 1 issue if capacity allows.

## Thursday–Friday

Give **2 reviews** on open Sprint 1 PRs. A sprint ends when the whole team ships, not just you.

Good review checklist:
- [ ] Does the code do what the issue asked?
- [ ] Do the tests cover the happy path and at least one edge case?
- [ ] Does `ruff check` and `pyright` pass (CI shows this)?
- [ ] Is the PR template filled out with `Closes #N`?
- [ ] Is anything obviously broken in the browser (for frontend PRs)?

## What if my PR is blocked?

| Problem | Action |
|---------|--------|
| No one is reviewing my PR | Post in Discord `#reviews-needed` with the PR link |
| Reviewer is asking for a large rewrite | Loop in the Tech Lead to mediate |
| CI is failing and I do not know why | Post the failing log in `#help` |
| I merged but broke `main` | Notify the Tech Lead immediately; revert if needed |

## Week 4 checklist

- [ ] Sprint 1 PR is merged into `main`
- [ ] All CI checks passed before merge
- [ ] You reviewed 2 teammates' PRs with substantive comments
- [ ] You resolved all review comments on your own PR
- [ ] Weekly Reflection submitted in Canvas
