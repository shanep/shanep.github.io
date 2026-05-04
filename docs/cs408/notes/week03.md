# Week 3: Sprint 1 Kickoff

**Phase:** Sprint 1 — Core CRUD  
**Due by Friday:** Draft PR open on GitHub (does not need to be ready to merge)

## Goal

Claim a Sprint 1 issue, understand what it asks for, start work, and have a draft PR open by Friday.

## Monday

Read the [Sprint 1 doc](/cs408/notes/sprint1) and find the section for your role. Identify 1–2 issues in the `Sprint 1` milestone on GitHub that match your role label (`frontend`, `backend`, `qa`, etc.).

Self-assign one issue:

1. Go to **Issues** → filter by `Milestone: Sprint 1` and your role label
2. Open the issue, read it fully
3. Click **Assignees** → assign yourself
4. Leave a comment: "Taking this one. Starting Wednesday."

Do not assign yourself to more than one issue until your first one is merged.

## Wednesday

Start work on your issue. Create a branch from `main`:

```bash
git checkout main
git pull origin main
git checkout -b feat/issue-N-short-description
```

Write code. Run checks locally as you go:

```bash
uv run pytest --tb=short -q        # tests pass
uv run ruff check .                # no lint errors
uv run ruff format .               # code is formatted
uv run pyright                     # no type errors
```

Do not open a PR until all four commands pass.

## Friday

Open a **draft** pull request even if the work is not finished. A draft PR lets your teammates see what you are working on and give early feedback.

```bash
git push origin feat/issue-N-short-description
```

On GitHub: New Pull Request → mark as **Draft** → fill out the template with what you have so far → create.

Leave a comment on the issue linking to your draft PR: "Draft PR: #42"

## Role-specific focus this week

| Role | What to start this week |
|------|------------------------|
| **Frontend** | Pick a CSS/template issue; get familiar with Jinja2 template inheritance |
| **Backend** | Pick a route extension issue; read how FastAPI `Depends` works |
| **QA** | Read `tests/conftest.py`; write one new test for an existing route |
| **DevOps** | Study `.github/workflows/ci.yml`; plan the deploy workflow |
| **Tech Lead** | Read every open Sprint 1 issue; leave clarifying comments on any that are ambiguous |
| **PM** | Ensure every Sprint 1 issue has a clear assignee by Friday; update the Projects board |

## Week 3 checklist

- [ ] Sprint 1 issue is assigned to you
- [ ] Branch created from a fresh `git pull origin main`
- [ ] Draft PR is open on GitHub
- [ ] Draft PR is linked to the issue
- [ ] You have commented on at least one teammate's draft PR
