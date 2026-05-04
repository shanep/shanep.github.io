# Week 8: Sprint 3 Delivery — Search & Filtering

**Phase:** Sprint 3 — Search & Filtering  
**Due by Friday:** PR merged + 2 reviews given

## Goal

Search and filtering are merged and working. Users can find jobs by keyword, location, and salary — without a page reload.

## Monday

Convert draft to ready for review. Before doing so, test every filter combination manually:

| Test | Expected result |
|------|----------------|
| No filters | All open jobs appear |
| `q=python` | Only jobs with "python" in title or company |
| `location=remote` | Only remote jobs |
| `salary_min=80000` | Only jobs paying ≥ $80k |
| `q=engineer&location=boise` | Combined filter works |
| Empty result | "No jobs found." message appears |

If any test fails, fix it before marking ready for review.

## Wednesday

**Frontend reviewers:** test the filter UI in a browser. Check that:
- All filters update the results without a full page reload
- The result count updates correctly
- Filters persist in the URL (`?q=python&location=remote`) so the page is shareable
- The page works with JavaScript disabled (degrades gracefully — filters submit as a normal form)

**Backend reviewers:** test the endpoint directly with curl or the browser dev tools network tab. Check that:
- All four params are respected independently and in combination
- The response is a valid HTML partial (not a full page)
- Large result sets do not time out

## Thursday–Friday

Merge your PR. Give 2 reviews.

If search and filtering are fully working, self-assign a Sprint 4 issue early — you have a head start on next sprint.

## Week 8 checklist

- [ ] All filter combinations tested manually before requesting review
- [ ] URL reflects filter state (`hx-push-url` working)
- [ ] Works without JavaScript (progressive enhancement)
- [ ] PR merged with 2 approvals and green CI
- [ ] 2 reviews given to teammates
- [ ] Weekly Reflection submitted in Canvas
