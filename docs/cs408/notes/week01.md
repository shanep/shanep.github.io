# Week 1: Get Set Up

**Phase:** Onboarding  
**Due by Friday:** Class Introductions post in Canvas

## Goal

By Friday you should have the app running on your machine and know what your role is.

## Monday

- Read the [syllabus](/cs408/) from top to bottom — pay close attention to how grading works
- Watch the course introduction video posted in Canvas
- Accept the GitHub repository invitation (link posted in Canvas)

## Wednesday

Set up your development environment:

```bash
# 1. Clone the repo
git clone https://github.com/YOUR_ORG/cs408-fall26
cd cs408-fall26

# 2. Install uv  (skip if you already have it)
curl -LsSf https://astral.sh/uv/install.sh | sh

# 3. Install all dependencies
uv sync --all-groups

# 4. Start the dev server
uv run uvicorn app.main:app --reload
```

Open [http://localhost:8000](http://localhost:8000) in your browser. You should see the TechHire home page.

Then run the test suite to make sure everything passes:

```bash
uv run pytest --tb=short -q
```

If anything fails, post the exact error output in the `#help` channel on Discord before asking a question.

## Thursday

Read **[CONTRIBUTING.md](https://github.com/YOUR_ORG/cs408-fall26/blob/main/CONTRIBUTING.md)** end to end. This is the most important document in the repo. It explains:

- How to name branches
- How to open a PR
- What CI checks must pass
- How your grade is calculated

## Friday

Post your Class Introduction in Canvas. Include:

- Your name and GitHub username
- Your assigned role (posted by the instructor in Canvas)
- One question you have about the project or the tech stack

## Week 1 checklist

- [ ] App runs at `http://localhost:8000`
- [ ] `uv run pytest` passes with no failures
- [ ] You know your role (check Canvas announcement)
- [ ] Class Introduction posted in Canvas
