# Week 15: Hardening

**Phase:** Hardening  
**Due by Friday:** End-to-end test PR merged + README update PR merged + demo video recorded

## Goal

No new features. Make what you have reliable, documented, and demonstrable. Leave the codebase in a state where a new engineer could clone it and be productive in under 10 minutes.

## Monday

Triage every open issue:

- **Can be fixed this week (< 2 hours):** Assign yourself, open a PR
- **Cannot be fixed this week:** Close it with a comment explaining why, label it `wont-fix`
- **Belongs in a future version:** Close it with a comment, label it `future`

Do not leave issues open with no comment. A well-maintained issue tracker is part of the final grade.

## Tuesday–Wednesday

**QA — end-to-end test (`tests/test_e2e.py`):**

Write one test that exercises the complete user journey:

```python
def test_full_apply_flow(client):
    # 1. Register a new user
    # 2. Log in
    # 3. Post a job
    # 4. Log out
    # 5. Apply to the job (unauthenticated user)
    # 6. Log back in as admin
    # 7. Verify application appears in /applications
    # 8. Update status to "accepted"
    # 9. Verify status change reflected in database
```

This test must be merged and passing before the demo.

**PM — README update:**

The `README.md` must have all of the following:

- [ ] One-paragraph project description
- [ ] Complete tech stack list
- [ ] Copy-pasteable local setup instructions (test on a fresh machine or Codespace)
- [ ] All required environment variables with descriptions
- [ ] How to run tests
- [ ] How to deploy to Render
- [ ] Link to the live deployment
- [ ] CI status badge

## Thursday

Record the demo video. It must be under 5 minutes and show:

1. Job seeker browses jobs, applies a filter, clicks a listing
2. Job seeker applies for the role
3. Admin logs in, sees dashboard stats
4. Admin updates the application status
5. Analytics charts with real data

Use the **deployed Render URL** — not localhost. Record with screen recording software (Loom, QuickTime, OBS). Post the link in Canvas.

## Friday

- Submit demo video in Canvas
- Final PR count and review count are locked at 11:59pm tonight
- The grading script runs over the weekend

## Week 15 checklist

- [ ] All open issues are closed or labeled `wont-fix` / `future`
- [ ] End-to-end test is merged and passing in CI
- [ ] `README.md` is complete and accurate
- [ ] Live deployment URL is in the README
- [ ] Demo video is under 5 minutes and uses the deployed URL
- [ ] Demo video submitted in Canvas
- [ ] `uv run pytest`, `ruff check`, and `pyright` all pass with no errors
