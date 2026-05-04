# Week 7: Sprint 3 Kickoff — Search & Filtering

**Phase:** Sprint 3 — Search & Filtering  
**Due by Friday:** Draft PR open

## Goal

Add search and filtering to the job list so users can find relevant roles quickly. All filtering happens without a full page reload, using HTMX.

## Monday

Read the [Sprint 3 doc](/cs408/notes/sprint3). Then look at the existing search code:

- `app/routes/jobs.py` → `search_jobs()` function (currently only filters by `q`)
- `templates/jobs/list.html` → the `<input hx-get="/jobs/search" ...>` element
- `templates/jobs/_job_rows.html` → the partial that HTMX swaps in

Your job this sprint is to extend this existing pattern, not replace it.

## Wednesday

**Before writing code**, answer these questions by reading the code:

1. What does `hx-target="#job-list"` mean in the search input?
2. What template does `search_jobs()` return?
3. How does `hx-trigger="keyup changed delay:300ms"` prevent too many requests?

If you cannot answer these, spend time with the [HTMX docs](https://htmx.org/docs/) before starting.

**Backend:** Extend `search_jobs()` to accept `location`, `salary_min`, and `sort` query params. Run:

```bash
# Test your new params manually
curl "http://localhost:8000/jobs/search?location=remote&sort=salary"
```

**Frontend:** Add the filter controls to `templates/jobs/list.html`. Each control needs:
- `name="param_name"` (must match the query param name in the route)
- `hx-get="/jobs/search"`
- `hx-target="#job-list"`
- `hx-include` listing the other controls so all filters send together

**QA:** Write the test matrix described in Sprint 3 doc before writing any test code. Post it as a comment on your issue.

## Thursday–Friday

- Open a draft PR by Friday
- The PR description should explain what filters you added and how to test them manually
- Include a screenshot (frontend) or `curl` example (backend) in the description

## Week 7 checklist

- [ ] You understand the existing HTMX search pattern
- [ ] Sprint 3 issue is assigned to you
- [ ] Draft PR is open with a clear description
- [ ] Filters can be tested manually with instructions in the PR
- [ ] Weekly Reflection submitted in Canvas
