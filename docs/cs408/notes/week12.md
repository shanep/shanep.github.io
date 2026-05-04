# Week 12: Sprint 5 Delivery — Email Notifications

**Phase:** Sprint 5 — Email Notifications  
**Due by Friday:** PR merged + 2 reviews given

## Goal

Email notifications are live. Applicants receive a confirmation email. Admins can trigger status-change emails. No API keys are in the codebase.

## Monday

Verify the full email flow on the **deployed** site (not localhost):

1. Apply to a job using your real email address
2. Check your inbox — confirmation email should arrive within 30 seconds
3. Log in as admin, update the application status to "reviewing"
4. Check your inbox again — status change email should arrive

If email is not arriving: check the Render logs for errors, check the `RESEND_API_KEY` secret, check the Resend dashboard for failed sends.

## Wednesday

**Security audit for email PRs.** Reviewers must check:

- [ ] `RESEND_API_KEY` is not in the codebase — search the diff for it explicitly
- [ ] `FROM_EMAIL` and other config is read from environment variables
- [ ] Applicant email address is validated before sending (FastAPI form validation handles this, but verify)
- [ ] Email content does not expose internal IDs or admin-only information

**QA:** Confirm tests pass without real credentials. The CI workflow uses `RESEND_API_KEY=test`. The test suite must mock the sender — if tests try to send real email in CI, they will fail.

## Thursday

**HTMX loading indicator for the status select.** When an admin changes application status, the PATCH request takes a moment. Add a spinner so the admin knows something is happening:

```html
<select
  hx-patch="/applications/{{ application.id }}/status"
  hx-indicator="#status-spinner-{{ application.id }}"
  ...>
```

This is a small frontend polish item — a good candidate for a quick extra PR if you finish early.

## Friday

- Merge your PR
- Give 2 reviews
- Post Weekly Reflection in Canvas

## Week 12 checklist

- [ ] Confirmation email arrives on the deployed site
- [ ] Status-change email arrives on the deployed site
- [ ] No API key in the codebase (grep the diff yourself)
- [ ] Tests pass in CI without real credentials
- [ ] PR merged with 2 approvals and green CI
- [ ] 2 reviews given
- [ ] Weekly Reflection submitted in Canvas
