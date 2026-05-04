# Week 13: Sprint 6 Kickoff — Analytics

**Phase:** Sprint 6 — Analytics  
**Due by Friday:** Draft PR open

## Goal

Build the analytics layer. By end of week you should have the JSON API endpoints drafted (backend) or the chart scaffolding in place (frontend).

## Monday

Read the [Sprint 6 doc](/cs408/notes/sprint6).

This sprint introduces a new pattern: **JSON API endpoints** that serve data to JavaScript charts. Until now, every route returned HTML. The analytics endpoints return JSON:

```python
@router.get("/admin/analytics/status-breakdown")
def status_breakdown(session: SessionDep, _: AdminDep) -> dict[str, int]:
    ...
```

**Backend:** Understand SQLModel group-by before starting. Here is the pattern:

```python
from sqlmodel import func

results = session.exec(
    select(Application.status, func.count(Application.id))
    .group_by(Application.status)
).all()
```

**Frontend:** Read the [Chart.js getting started guide](https://www.chartjs.org/docs/latest/getting-started/). The library is included via CDN — no install needed. Plan which chart type fits each dataset (bar, doughnut, line).

**PM:** Write a "what analytics matter most?" issue and collect input from the team before backend starts work. Close it with a prioritized list.

## Wednesday

**Backend:** The three analytics endpoints should be drafted and manually testable:

```bash
# All should return JSON, not HTML
curl http://localhost:8000/admin/analytics/applications-per-job
curl http://localhost:8000/admin/analytics/status-breakdown
curl http://localhost:8000/admin/analytics/applications-over-time
```

Verify each returns the right shape. The frontend depends on this contract — agree on the exact JSON format and document it in a comment on the issue.

**Frontend:** Scaffold the chart containers in `templates/admin/analytics.html` and confirm Chart.js loads:

```html
<canvas id="status-chart"></canvas>
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
<script>
  // Hardcode fake data first, connect to API next week
  new Chart(document.getElementById('status-chart'), {
    type: 'doughnut',
    data: { labels: ['Pending', 'Reviewing'], datasets: [{ data: [10, 5] }] }
  });
</script>
```

## Thursday–Friday

- Draft PR open
- PR description must include a screenshot of the chart (even with fake data)

## Week 13 checklist

- [ ] Sprint 6 issue assigned to you
- [ ] JSON contract agreed between backend and frontend (documented in issue comment)
- [ ] Draft PR open with screenshot or `curl` output
- [ ] Weekly Reflection submitted in Canvas
