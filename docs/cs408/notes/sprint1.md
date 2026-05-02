# Sprint 1: Core CRUD (Weeks 3–4)

![team work](images/team.gif)

The scaffolding is in place. Sprint 1 is about extending it: making the job board more polished,
better tested, and deployed somewhere real. By the end of week 4 the app should be running on
Render (or Railway) and every route should have test coverage.

## Sprint goal

> A production-deployed job board where users can browse, post, search, and close job listings,
> with full CI passing on every commit.

## What each role ships this sprint

### Frontend
Pick issues from the Sprint 1 milestone that match your skills. Typical work:

- Style improvements to `static/style.css` (mobile responsiveness, hover states, typography)
- Salary range badge on the job card
- Pagination controls on the job list page
- "Posted N days ago" relative timestamp on the detail page

All UI changes require a before/after screenshot in the PR description.

### Backend
- Add `?page=` and `?size=` query parameters to `GET /jobs`
- Add a `GET /jobs/{id}/edit` + `POST /jobs/{id}/edit` update flow
- Return proper 422 validation errors for bad form inputs
- Add an index on `Job.company` for faster search

### QA
- Write pytest tests for every route that currently has none
- Each test file must include at least one happy-path test and one error-path test
- Add a `conftest.py` fixture that seeds the database with 5 sample jobs

### DevOps
- Create `.github/workflows/deploy.yml` that deploys `main` to Render on push
- Document the required secrets (`RENDER_API_KEY`, etc.) in `CONTRIBUTING.md`
- Add a CI status badge to `README.md`

### Tech Lead
- Review at least 6 PRs this sprint (not just approvals — leave substantive comments)
- Open an architecture discussion issue: "Should we move to PostgreSQL before Sprint 2?"
- Ensure the `main` branch stays green — coordinate with QA when CI breaks

### PM
- Keep the Sprint 1 milestone up to date on the GitHub Projects board
- Assign unowned issues to volunteers
- Write a mid-sprint check-in comment on the milestone

## PR expectations this sprint

Each merged PR should be **small and focused** — one feature or one bug fix. A PR that touches
templates, routes, models, and tests all at once will be asked to be split up.

Aim for **2 merged PRs** by end of week 4.

## Technical concepts introduced

| Concept | Where it appears |
|---------|-----------------|
| SQL pagination (`LIMIT` / `OFFSET`) | `GET /jobs?page=` |
| Query parameters in FastAPI | `search_jobs`, `list_jobs` route signatures |
| HTMX `hx-get` + `hx-trigger` | Live search input in `templates/jobs/list.html` |
| GitHub Actions deploy workflow | `.github/workflows/deploy.yml` |

## References

- [FastAPI query parameters](https://fastapi.tiangolo.com/tutorial/query-params/)
- [SQLModel select + where](https://sqlmodel.tiangolo.com/tutorial/select/)
- [HTMX documentation](https://htmx.org/docs/)
- [Render deploy docs](https://render.com/docs/deploy-fastapi)

## Sprint 1 checklist

- [ ] App is deployed and accessible via a public URL
- [ ] All existing tests still pass (`uv run pytest`)
- [ ] New features have tests
- [ ] CI badge is visible in `README.md`
- [ ] You have 2+ merged PRs
- [ ] You have given 2+ reviews
