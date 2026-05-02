# Hardening (Week 15)

![planning](images/planning.gif)

No new features. Week 15 is about making what you have reliable, documented, and demonstrable.
The goal is to hand off a codebase that a new engineer could clone and run in under ten minutes.

## What this week is for

- Fixing bugs that accumulated in the backlog
- Closing open issues that are marked `hardening`
- Writing the end-to-end test that exercises the full user journey
- Making the README accurate and complete
- Preparing the final demo

## End-to-end test (QA leads this)

Write one test in `tests/test_e2e.py` that walks through the entire application flow:

```python
def test_full_apply_flow(client):
    # 1. Register a user
    # 2. Log in
    # 3. Post a job
    # 4. Log out
    # 5. Apply to the job (as an unauthenticated user)
    # 6. Log in as admin
    # 7. Verify the application appears in /applications
    # 8. Update the application status to "accepted"
    # 9. Verify the status change is reflected
```

This test must pass before the final demo.

## README update (PM leads this)

The `README.md` must include:

- [ ] Project description (one paragraph)
- [ ] Tech stack list
- [ ] Local setup instructions (copy-pasteable, tested on a fresh machine)
- [ ] All required environment variables with descriptions
- [ ] How to run tests
- [ ] How to deploy to Render
- [ ] A link to the live deployment
- [ ] The CI status badge

## Bug triage

Go through every open issue. For each one:

- If it can be fixed in < 2 hours: fix it and open a PR
- If it cannot be fixed this week: close it with a comment explaining why and label it `wont-fix`
- Do not leave issues open with no comment

## Final demo preparation

The final demo (recorded video, posted to Canvas) should show:

1. A job seeker browsing jobs and filtering by location
2. A job seeker applying for a role
3. An admin logging in and seeing the dashboard stats
4. An admin updating the application status
5. The analytics charts

Keep the demo under 5 minutes. Use the deployed Render URL — not localhost.

## Hardening checklist

- [ ] `uv run pytest` passes with no warnings
- [ ] `uv run ruff check .` passes with no errors
- [ ] `uv run pyright` passes with no errors
- [ ] End-to-end test is merged and passing
- [ ] `README.md` is complete and accurate
- [ ] Live deployment URL is in the README
- [ ] All open issues are either fixed or closed with `wont-fix`
- [ ] Final demo video is posted to Canvas
