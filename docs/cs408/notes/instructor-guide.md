# Instructor Guide

This guide covers everything you need to run CS408 as a PR-based collaborative project. Student-facing docs are written for the students. This doc is written for you.

## Pre-semester checklist (1–2 weeks before classes start)

- [ ] Create the semester repo from the template (click **Use this template** on [CS408-fullstack-template](https://github.com/shanep/CS408-fullstack-template))
- [ ] Name it consistently: `cs408-fall26`, `cs408-spring27`, etc.
- [ ] Set the repo to **Public** (students need to see each other's PRs)
- [ ] Run the seed script to create labels, milestones, and starter issues:
  ```bash
  cd /tmp/cs408-template   # or wherever you cloned the template
  uv run scripts/seed_issues.py --repo YOUR_ORG/cs408-fall26 --token $GITHUB_TOKEN
  ```
- [ ] Enable **Branch protection** on `main`:
  - Require 2 pull request approvals before merging
  - Require status checks: `CI / lint-and-test`
  - Do not allow bypassing (including admins — you should not be merging PRs)
- [ ] Create a Render (or Railway) account and deploy the initial scaffold so students have a live URL from day 1
- [ ] Post the repo URL and role assignments in Canvas before Week 1

## Assigning roles

With 35 students, the recommended allocation:

| Role | Count | Responsibilities |
|------|-------|-----------------|
| Frontend | 12 | Jinja2 templates, CSS, HTMX |
| Backend | 8 | FastAPI routes, SQLModel models |
| QA | 6 | pytest tests, PR quality reviews |
| DevOps | 4 | CI/CD, deployment, environment config |
| Tech Lead | 3 | Architecture, cross-cutting reviews |
| PM | 2 | Issue triage, sprint board, retrospectives |

**How to collect preferences:** Post a Canvas quiz in Week 1 with one question: "Rank these roles from most to least preferred (1 = most)." Assign greedily from the top preference, breaking ties by GPA or alphabetically.

**Announce assignments** by the end of Week 1 as a Canvas Announcement. Include:
- Each student's GitHub username → role
- A link to the repo
- A link to `CONTRIBUTING.md`

**Do roles rotate?** Recommended: no. Role rotation teaches breadth but doubles the coordination overhead. If a student strongly wants to switch after Sprint 1, allow it as a one-time exception.

## How issues get assigned to students

The seed script creates starter issues for each sprint, but students self-assign. The flow:

1. **Instructor** runs `seed_issues.py` once pre-semester (creates all 25+ starter issues with labels and milestones)
2. **PMs** are responsible for ensuring every issue has a clear description before the sprint starts. They open additional issues as needed.
3. **Students** self-assign from the backlog by picking an issue matching their role label
4. **Tech Leads** resolve conflicts when two students want the same issue (rare)
5. **Instructor** does not assign individual issues — this is by design

The backlog is intentionally sized at ~2× team capacity per sprint so there is always work available. Students who finish early self-assign a second issue.

## Weekly instructor workload

The goal is under 30 minutes per week. Here is what actually requires your attention:

| Day | Task | Time |
|-----|------|------|
| Monday | Scan GitHub Projects board — any sprint with 0 "In Progress" issues is a red flag | 5 min |
| Wednesday | Check CI status on `main` — if it is red, ping Tech Leads | 5 min |
| Thursday | Respond to any escalations in your email/Canvas inbox | varies |
| Friday | Glance at merged PR count — any student at 0 after week 4 needs a check-in | 5 min |

You do not review PRs. You do not merge PRs. You do not write issues. This is intentional — the course teaches students to self-organize.

## Intervention triggers

Contact a student directly (Canvas message) when:

| Signal | Week threshold | Action |
|--------|---------------|--------|
| 0 merged PRs | After week 4 | "I noticed you have not merged a PR yet. What is blocking you?" |
| 0 reviews given | After week 6 | "Reviews count toward your grade. Please start reviewing PRs." |
| PR stuck open for 5+ days | Any week | Ping the team in Discord: "#reviews-needed — PR #N has been waiting 5 days" |
| `main` broken for 24+ hours | Any week | Step in: ask Tech Lead to revert the offending PR |

Contact a student's **team** (not individually) when:

- A sprint milestone has < 50% of issues closed by the delivery week Wednesday
- No Tech Lead is reviewing PRs (check the PR review history)

## Managing Tech Leads

Tech Leads are the most important role for keeping instructor workload low. Set expectations clearly in Week 1:

- They own design docs (`auth-design.md`, `email-design.md`) — these are due on specific Wednesdays
- They resolve merge conflicts between teammates before escalating to you
- They are responsible for keeping `main` green
- They should review 6+ PRs per sprint (not just approve — substantive comments)

Check in with Tech Leads at the start of each sprint kickoff week with a single Canvas message: "Sprint N is starting. Design doc due Wednesday if applicable. Any blockers I should know about?"

## End-of-semester grading

Run the grading script during Week 16:

```bash
uv run scripts/grade.py \
  --repo YOUR_ORG/cs408-fall26 \
  --token $GITHUB_TOKEN \
  --since 2026-08-25 \
  --until 2026-12-05 \
  --output grades.csv
```

The script outputs a CSV with `github_login`, `merged_prs`, `reviews_given`.

**Cross-reference with:**
1. Canvas: did the student submit weekly reflections? (10% of grade)
2. Canvas: did the student submit a demo video? (10% of grade)
3. Canvas: did the student complete peer demo reviews? (affects participation)

**Grade calculation (example with the rubric from the syllabus):**

```
Base grade from merged PRs + reviews (80%):
  A ≥12 PRs + ≥10 reviews
  B ≥8 PRs  + ≥6 reviews
  C ≥5 PRs
  D/F < 5 PRs

Canvas work (20%):
  Weekly reflections: 10%
  Demo video + peer reviews: 10%
```

**Handling disputes:** A student claiming the script missed their PRs should provide PR numbers. The script filters by `merged_at` date and `linked issue`. If their PRs were merged after the deadline or had no linked issue, they do not count — this is stated in `CONTRIBUTING.md`.

## Making yourself an admin on the deployed site

After deployment, run:

```bash
uv run scripts/make_admin.py --email shanepanter@boisestate.edu
```

(Or use the Render shell to run the script directly.)

## Reusing the repo next semester

1. Click **Use this template** on the same template repo (do not fork the student repo)
2. Re-run `seed_issues.py` on the new repo
3. Update the Render deployment to point to the new repo
4. Update Canvas links

The previous semester's repo remains archived and visible — students can reference prior cohorts' work, which is intentional.
