# Sprint 6: Analytics (Weeks 13–14)

Admins can manage the platform. Sprint 6 gives them insight into it. Data visualization turns
raw database counts into charts that reveal hiring trends, application velocity, and job
performance.

## Sprint goal

> The admin dashboard includes interactive charts showing: applications per job, application
> status breakdown, and new applications over time.

## What each role ships this sprint

### Backend
Add a JSON API for the analytics data (separate from the HTML routes):

```
GET /admin/analytics/applications-per-job
    → [{"job_title": "Backend Engineer", "count": 14}, ...]

GET /admin/analytics/status-breakdown
    → {"pending": 34, "reviewing": 12, "accepted": 5, "rejected": 21}

GET /admin/analytics/applications-over-time
    → [{"date": "2026-09-01", "count": 3}, ...]
```

These endpoints must be protected by `require_admin` and return JSON (not HTML).

### Frontend
- Add a "Analytics" tab to the admin dashboard
- Fetch data from the three endpoints above using `fetch()` or HTMX `hx-get` with `hx-swap="none"` + a JS callback
- Render three charts using [Chart.js](https://www.chartjs.org/) (CDN link, no npm needed):
  - Bar chart: applications per job
  - Doughnut chart: status breakdown
  - Line chart: applications over time

### QA
- Test each analytics endpoint with: no data, one data point, many data points
- Test that non-admins receive 403 from all analytics endpoints
- Do not test the chart rendering itself (that requires a browser) — test the data endpoints only

### DevOps
- Add a database backup script `scripts/backup_db.sh` that copies `jobboard.db` to a dated file
- Document the backup strategy in `CONTRIBUTING.md`

### Tech Lead
- Decide the date aggregation granularity for "applications over time" (daily? weekly?)
- Review all analytics PRs to ensure the SQL queries use indexes and will not slow down on large datasets
- Open a "performance" issue: what happens if we have 10,000 applications?

### PM
- Write a "what would you want to see?" issue and gather input from the team before backend starts work
- Write the sprint retrospective: what went well, what was hard, what would you change?

## Chart.js quickstart

```html
<!-- In templates/admin/analytics.html -->
<canvas id="applications-per-job"></canvas>

<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
<script>
  fetch('/admin/analytics/applications-per-job')
    .then(r => r.json())
    .then(data => {
      new Chart(document.getElementById('applications-per-job'), {
        type: 'bar',
        data: {
          labels: data.map(d => d.job_title),
          datasets: [{ label: 'Applications', data: data.map(d => d.count) }]
        }
      });
    });
</script>
```

## References

- [Chart.js getting started](https://www.chartjs.org/docs/latest/getting-started/)
- [SQLModel group by](https://sqlmodel.tiangolo.com/tutorial/select/)
- [FastAPI JSON responses](https://fastapi.tiangolo.com/tutorial/response-model/)

## Sprint 6 checklist

- [ ] All three analytics endpoints return correct data
- [ ] All three charts render on the admin dashboard
- [ ] Analytics endpoints return 403 for non-admins
- [ ] Tests cover empty-state, single, and many-record cases
- [ ] Sprint retrospective is posted in Canvas
- [ ] You have 2+ merged PRs
- [ ] You have given 2+ reviews
