# Week 6: Sprint 2 Delivery — Authentication

**Phase:** Sprint 2 — Authentication  
**Due by Friday:** Auth PR merged + 2 reviews given

## Goal

Auth is fully working end-to-end on the deployed site. Users can register, log in, and log out. Protected routes redirect unauthenticated users.

## Monday

Auth PRs land in a specific order — getting this wrong means teammates are blocked. The correct merge order is:

1. `app/models/user.py` (User model + migration)
2. `app/routes/auth.py` (register, login, logout routes)
3. `app/dependencies.py` (CurrentUser dependency)
4. `app/routes/jobs.py` updated (protect POST /jobs)
5. Templates (login, register pages, navbar)
6. Tests

If you are waiting on an upstream PR to merge before you can start yours, leave a comment on your own issue: "Blocked on #N." The Tech Lead should see this and prioritize reviewing the blocker.

## Wednesday

**Security review checklist** — every auth PR reviewer must verify:

- [ ] Passwords stored as bcrypt hashes (search the PR for `password` — it should never appear in plain text)
- [ ] Session cookie created with `HttpOnly=True` and `SameSite="lax"`
- [ ] Failed login says "Invalid email or password" — not "No account found" (prevents email enumeration)
- [ ] `SECRET_KEY` loaded from `os.environ` — not hard-coded anywhere

If any of these fail, request changes. Do not approve.

## Thursday

Verify the full flow works on the **deployed Render site** (not just localhost):

1. Register a new account
2. Log in
3. Post a job (should work)
4. Log out
5. Try to post a job (should redirect to `/login`)
6. Try the URL `/jobs/new` directly while logged out (should redirect)

If anything fails on the deployed site but works locally, open a bug issue immediately.

## Friday

- All Sprint 2 PRs should be merged
- Give 2 reviews on any remaining open Sprint 2 PRs
- Post Weekly Reflection in Canvas

## What if auth is not done by Friday?

Partial auth (model + routes exist, but templates are unfinished) still earns PR credit. Do not hold up a merged backend PR waiting for the frontend to be perfect. Merge what is complete; continue the rest in Sprint 3 backlog issues.

## Week 6 checklist

- [ ] Your Sprint 2 PR is merged
- [ ] End-to-end auth flow verified on the deployed site
- [ ] Security checklist was used during your reviews
- [ ] You reviewed 2 PRs with substantive comments
- [ ] Weekly Reflection submitted in Canvas
