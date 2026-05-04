# Week 11: Sprint 5 Kickoff — Email Notifications

**Phase:** Sprint 5 — Email Notifications  
**Due by Wednesday:** `email-design.md` PR merged (Tech Lead owns this)  
**Due by Friday:** Sprint 5 issue assigned + branch started

## Goal

Before a single line of email code is written, the team agrees on how email works. This sprint repeats the design-first pattern from Sprint 2.

## Monday

Read the [Sprint 5 doc](/cs408/notes/sprint5). The two key decisions this week:

**1. Which email provider?**
Resend is recommended — free tier, simple Python SDK, no SMTP configuration needed.
Sign up at [resend.com](https://resend.com) and get an API key. Do NOT commit it.

**2. Synchronous or async sending?**
Use FastAPI `BackgroundTasks` — the HTTP response returns immediately while the email sends in the background. This matters because sending email can take 1–2 seconds.

**Tech Lead:** Open the "Email Design" issue and start `docs/email-design.md` today.

**Everyone else:** Comment on the Email Design issue with your concerns or questions before Wednesday.

## Wednesday

**Tech Lead:** `email-design.md` PR must be merged by end of day. It must specify:

- Which provider (and why)
- The `send_email()` function signature
- How tests override the sender (dependency injection pattern)
- Required environment variables

**Backend:** Once the design doc is merged:

```bash
uv add resend
```

Create `app/email.py` with the `send_email()` function. Do NOT connect it to any route yet — get the function working in isolation first, with a simple test script.

**DevOps:** Set up the `RESEND_API_KEY` secret in Render. Add a dummy value to the CI workflow so tests pass without a real key.

## Thursday–Friday

- **Backend:** Hook `send_email()` into `POST /jobs/{id}/apply`
- **QA:** Write the email test fixture that overrides `send_email` with a no-op
- **Frontend:** Add the "confirmation email sent" message to the apply flow

## Week 11 checklist

- [ ] `email-design.md` is merged (Tech Lead responsible)
- [ ] You have read and commented on `email-design.md`
- [ ] `RESEND_API_KEY` is in Render environment (DevOps)
- [ ] Sprint 5 issue assigned to you
- [ ] Branch created, first commit pushed
- [ ] Weekly Reflection submitted in Canvas
