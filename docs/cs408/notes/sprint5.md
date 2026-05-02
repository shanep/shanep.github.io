# Sprint 5: Email Notifications (Weeks 11–12)

The platform works, but it is silent. Applicants submit an application and have no idea what
happens next. Sprint 5 closes that loop with transactional email.

## Sprint goal

> Applicants receive a confirmation email when they apply. When an admin updates their status,
> they receive a status change email.

## Design decision (Tech Lead + DevOps own this before sprint starts)

Open an issue and decide:

1. **SMTP provider**: use Mailgun, Resend, or a raw SMTP server?
   - Recommended: [Resend](https://resend.com) (free tier, simple API, Python SDK)
2. **Sending strategy**: synchronous (blocks the request) or async (background task)?
   - Recommended: FastAPI `BackgroundTasks` so the HTTP response is not delayed
3. **Testing strategy**: how do we test email in CI without sending real mail?
   - Recommended: dependency injection — swap the real sender for a no-op in tests

Close the issue with an `email-design.md` doc before engineers start work.

## What each role ships this sprint

### Backend
Add email sending as a background task:

```python
# app/email.py
from fastapi import BackgroundTasks

def send_confirmation(background_tasks: BackgroundTasks, to: str, job_title: str) -> None:
    background_tasks.add_task(_send, to, subject=f"Application received — {job_title}", ...)
```

- Hook into `POST /jobs/{id}/apply`
- Hook into `PATCH /applications/{id}/status`
- Read SMTP credentials from environment variables only — never hard-code

Add this package (or whichever provider is chosen):
```bash
uv add resend
```

### Frontend
- Add a visible confirmation message after applying: "A confirmation email has been sent to {email}"
- Update the application status dropdown to show a spinner (HTMX `htmx-indicator`) while the PATCH is in flight

### QA
Do not send real email in tests. Override the email dependency:

```python
@pytest.fixture
def client_no_email(client):
    sent = []
    app.dependency_overrides[send_email] = lambda *a, **kw: sent.append((a, kw))
    yield client, sent
    app.dependency_overrides.clear()
```

Write tests that assert the email task was queued (not that it was delivered).

### DevOps
- Add `RESEND_API_KEY` (or equivalent) to Render environment variables
- Add a dummy `RESEND_API_KEY=test` secret to the CI workflow so tests pass without real credentials
- Document the full list of required environment variables in `CONTRIBUTING.md`

### Tech Lead
- Write `docs/email-design.md` before sprint coding starts
- Review all email PRs for credential hygiene (no keys in code, no keys in logs)
- Ensure the email function is behind a dependency so it can be overridden in tests

### PM
- Write the email copy (subject line and body text) as a GitHub issue — the team will implement it
- Track: backend email must merge before QA can write integration tests

## Environment variables reference

| Variable | Example | Where it goes |
|----------|---------|---------------|
| `RESEND_API_KEY` | `re_abc123` | Render env, CI secret |
| `FROM_EMAIL` | `noreply@techhire.example.com` | Render env, CI secret |
| `APP_URL` | `https://cs408.onrender.com` | Render env |

## References

- [FastAPI Background Tasks](https://fastapi.tiangolo.com/tutorial/background-tasks/)
- [Resend Python SDK](https://resend.com/docs/send-with-python)
- [HTMX loading indicators](https://htmx.org/attributes/hx-indicator/)

## Sprint 5 checklist

- [ ] `docs/email-design.md` is merged before sprint coding starts
- [ ] Confirmation email is sent on application submit (verify on deployed site)
- [ ] Status-change email is sent when admin updates status
- [ ] No API keys appear anywhere in the codebase or CI logs
- [ ] Email tests pass without real credentials
- [ ] You have 2+ merged PRs
- [ ] You have given 2+ reviews
