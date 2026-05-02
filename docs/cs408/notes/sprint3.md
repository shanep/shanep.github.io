# Sprint 3: Search & Filtering (Weeks 7–8)

The job board now has auth. Sprint 3 makes it usable at scale: a job seeker should be able to
find relevant roles quickly without scrolling through hundreds of listings.

## Sprint goal

> Users can search jobs by keyword, filter by location and salary range, and sort results — all
> without a full page reload, using HTMX.

## What each role ships this sprint

### Backend
Extend `GET /jobs/search` to accept multiple query parameters:

| Parameter | Type | Behavior |
|-----------|------|----------|
| `q` | string | Filter by title or company (already exists) |
| `location` | string | Exact or partial match on `Job.location` |
| `salary_min` | int | Show only jobs with `salary_max >= salary_min` |
| `sort` | `"newest"` \| `"salary"` | Default: `"newest"` |

The endpoint must return the `jobs/_job_rows.html` partial (already used by the live search
input) so the frontend can swap results in with HTMX.

### Frontend
- Add a filter sidebar to `templates/jobs/list.html`
- All filter controls use `hx-get="/jobs/search"` and `hx-include` to send the full filter state
- Results update without a page reload
- Show a result count: "Showing 12 of 47 jobs"
- Preserve filter state in the URL (`?q=python&location=remote`) using `hx-push-url`

### QA
Write a test matrix covering all combinations that matter:

```python
# examples
def test_search_by_title(client): ...
def test_search_by_company(client): ...
def test_filter_by_location(client): ...
def test_filter_salary_min(client): ...
def test_combined_filters(client): ...
def test_empty_results(client): ...
def test_sort_by_newest(client): ...
def test_sort_by_salary(client): ...
```

### DevOps
- Add a database migration step for the new index on `Job.location`
- Document the migration process in `CONTRIBUTING.md` (how to run it locally, how it runs in CI)

### Tech Lead
- Decide: do we use SQLite FTS5 for full-text search, or just `LIKE` queries?
  - Open an issue with pros/cons and close it with a decision before backend starts work
- Review frontend PRs for HTMX correctness: `hx-include` scope, `hx-push-url` format

### PM
- Create a "Search UX" issue for discussion: what filters matter most to job seekers?
- Gather input from the team and close the issue with a summary before sprint work starts

## HTMX reference for this sprint

The live search input already uses this pattern:

```html
<input
  hx-get="/jobs/search"
  hx-trigger="keyup changed delay:300ms"
  hx-target="#job-list"
>
```

Extending it to include filters uses `hx-include`:

```html
<select name="location"
  hx-get="/jobs/search"
  hx-trigger="change"
  hx-target="#job-list"
  hx-include="[name='q'],[name='salary_min']"
>
```

## References

- [HTMX `hx-include`](https://htmx.org/attributes/hx-include/)
- [HTMX `hx-push-url`](https://htmx.org/attributes/hx-push-url/)
- [SQLModel filtering](https://sqlmodel.tiangolo.com/tutorial/where/)

## Sprint 3 checklist

- [ ] All four filter parameters work independently and in combination
- [ ] Results update without page reload
- [ ] URL reflects current filter state
- [ ] Test matrix covers at least 8 scenarios
- [ ] You have 2+ merged PRs
- [ ] You have given 2+ reviews
