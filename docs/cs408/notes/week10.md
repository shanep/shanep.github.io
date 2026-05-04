# Week 10: Sprint 4 Delivery — Admin Dashboard

**Phase:** Sprint 4 — Admin Dashboard  
**Due by Friday:** PR merged + 2 reviews given

## Goal

The admin dashboard is live, protected, and accurate. A non-admin user hitting `/admin` gets a 403.

## Monday

Before requesting reviews, do a security self-review of your own PR:

- [ ] Does `/admin` return 403 for a logged-in non-admin user?
- [ ] Does `/admin` return 302 to `/login` for an unauthenticated user?
- [ ] Is the "Admin" navbar link hidden in the rendered HTML for non-admins — not just visually hidden with CSS?
- [ ] Can a user promote themselves to admin by submitting a form?

Test each of these manually. Add the results to your PR description.

## Wednesday

**Stats accuracy check:** The dashboard shows totals. Verify them:

1. Create 3 jobs, apply to 2 of them with 2 different accounts
2. Go to `/admin`
3. Confirm: Total Jobs = 3, Total Applications = 2, Open Jobs = 3

If the numbers are wrong, the SQL query is wrong — fix it before requesting review.

## Thursday

**`scripts/make_admin.py` must be tested on the deployed site.** DevOps: SSH into the Render instance or run the script via the Render shell and confirm it works. Document the exact commands in `CONTRIBUTING.md`.

**Tech Lead:** Run through every merged auth and admin PR and look for privilege escalation. Can a regular user access any admin-only data by guessing a URL? Fix any gaps before end of week.

## Friday

- Merge your PR
- Give 2 reviews on remaining Sprint 4 PRs
- Post Weekly Reflection in Canvas

## Week 10 checklist

- [ ] `/admin` returns 403 for regular users (tested manually)
- [ ] Stats on dashboard are accurate (verified with known test data)
- [ ] `scripts/make_admin.py` works on the deployed instance
- [ ] Admin navbar link absent from non-admin HTML source
- [ ] PR merged with 2 approvals and green CI
- [ ] 2 reviews given
- [ ] Weekly Reflection submitted in Canvas
