# Onboarding (Weeks 1–2)

![setup](images/setup.gif)

Welcome to CS408. This is not a traditional course — you are a new hire at **TechHire**, a
fictional web development company. Your team of 35 engineers will spend the semester building a
real job board application on a shared GitHub repository. Your grade comes entirely from the work
you ship via pull requests.

## Your first tasks

### 1. Set up your development environment

```bash
# Clone the class repo (link posted in Canvas)
git clone https://github.com/YOUR_ORG/cs408-fall26
cd cs408-fall26

# Install uv (Python package manager)
curl -LsSf https://astral.sh/uv/install.sh | sh

# Install all dependencies
uv sync --all-groups

# Start the dev server
uv run uvicorn app.main:app --reload
# Open http://localhost:8000
```

Make sure you can see the job board home page before moving on.

### 2. Run the test suite

```bash
uv run pytest --tb=short -q
```

All tests should pass on a fresh clone. If they don't, post in the #help channel with the error output.

### 3. Understand the codebase

Spend time reading through these files before writing a single line of code:

| File | What it does |
|------|-------------|
| `app/main.py` | FastAPI app entry point |
| `app/models/job.py` | Job database model |
| `app/models/application.py` | Application model and status enum |
| `app/routes/jobs.py` | CRUD routes for jobs |
| `app/routes/applications.py` | Routes for submitting and managing applications |
| `templates/base.html` | Shared HTML layout |
| `CONTRIBUTING.md` | **Read this carefully — it explains the PR workflow and grading** |

### 4. Learn your role

Your role is assigned in Canvas. Each role has specific responsibilities:

| Role | Focus |
|------|-------|
| **Frontend** | Jinja2 templates, CSS, HTMX interactions |
| **Backend** | FastAPI routes, SQLModel models, business logic |
| **QA** | pytest tests, reviewing PRs for test coverage |
| **DevOps** | GitHub Actions, deployment, environment configuration |
| **Tech Lead** | Architecture decisions, code reviews, unblocking teammates |
| **PM** | Issue triage, sprint tracking, retrospective notes |

### 5. Make your first PR

Your first deliverable is a pull request that adds your name to `CONTRIBUTORS.md`:

```markdown
| @your-github-username | Your Role | A fun fact about yourself |
```

Follow the branch naming convention from `CONTRIBUTING.md`:

```bash
git checkout -b feat/issue-1-add-yourname-to-contributors
# edit CONTRIBUTORS.md
git add CONTRIBUTORS.md
git commit -m "Add @yourname to CONTRIBUTORS.md"
git push origin feat/issue-1-add-yourname-to-contributors
# Open a pull request on GitHub
```

Your PR must:
- Pass all CI checks (ruff, pyright, pytest)
- Be linked to the onboarding issue in the PR description (`Closes #N`)
- Receive 2 peer approvals before it can merge

## How grading works

Every merged PR earns credit. Reviews you give to others also count. At the end of the semester
your instructor runs a script that queries GitHub and produces a grade based on:

| Grade | Merged PRs | Reviews Given |
|-------|-----------|---------------|
| A | ≥ 12 | ≥ 10 |
| B | ≥ 8  | ≥ 6  |
| C | ≥ 5  | ≥ 0  |

Reviewing other people's PRs is part of your grade — do not ignore review requests.

## Week 2 checklist

- [ ] Dev environment is running (`uv run uvicorn app.main:app --reload`)
- [ ] All tests pass locally (`uv run pytest`)
- [ ] You have read `CONTRIBUTING.md` end to end
- [ ] Your onboarding PR is merged into `main`
- [ ] You have approved at least 2 of your classmates' onboarding PRs
