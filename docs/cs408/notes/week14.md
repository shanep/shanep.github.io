# Week 14: Sprint 6 Delivery — Analytics + Retrospective

**Phase:** Sprint 6 — Analytics  
**Due by Friday:** PR merged + 2 reviews given + Sprint Retrospective in Canvas

## Goal

Analytics are live. All three charts render with real data. The semester's final feature sprint is complete.

## Monday

Connect the charts to real data. Replace hardcoded values with `fetch()` calls:

```javascript
fetch('/admin/analytics/status-breakdown')
  .then(r => r.json())
  .then(data => {
    new Chart(document.getElementById('status-chart'), {
      type: 'doughnut',
      data: {
        labels: Object.keys(data),
        datasets: [{ data: Object.values(data) }]
      }
    });
  });
```

Verify with real database state — create a few applications with different statuses before checking the charts.

## Wednesday

**Performance check (Tech Lead leads this):**

Open the Render logs while loading `/admin/analytics`. How long does each query take? If any query takes more than 200ms, there is likely a missing index. Add an index on `Application.job_id` and `Application.status` if not already present.

**QA:** The analytics endpoints must have tests with three cases:
- Empty database (all zeros)
- One data point
- Multiple data points with known values (assert exact counts)

## Thursday

Write the **Sprint Retrospective** in Canvas. It should answer:

1. What went well across all 6 sprints?
2. What was the most frustrating part of the workflow?
3. What would you change if you could start over?
4. What is one thing a future CS408 student should know on day 1?

This is individual reflection — not a group submission.

## Friday

- Merge your Sprint 6 PR
- Give 2 reviews on remaining Sprint 6 PRs
- Submit Sprint Retrospective in Canvas

After this Friday, no new feature PRs. Week 15 is hardening only.

## Week 14 checklist

- [ ] All three charts render with real data from the database
- [ ] Analytics endpoints return 403 for non-admins
- [ ] Performance verified (queries under 200ms in Render logs)
- [ ] QA tests cover empty, single, and multi-record cases
- [ ] PR merged with 2 approvals and green CI
- [ ] 2 reviews given
- [ ] Sprint Retrospective submitted in Canvas
