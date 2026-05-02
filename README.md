# shanep.github.io

[![Build and Deploy Pages](https://github.com/shanep/shanep.github.io/actions/workflows/static.yml/badge.svg)](https://github.com/shanep/shanep.github.io/actions/workflows/static.yml)

Source for [shanepanter.com](https://shanepanter.com). Built with [VitePress](https://vitepress.dev) and deployed to GitHub Pages on every push to `master`.

## Development

```bash
npm install
npm run docs:dev        # live-reload dev server at http://localhost:3000
```

## Scripts

| Command                               | Description                                        |
| ------------------------------------- | -------------------------------------------------- |
| `npm run docs:dev`                    | Start dev server on port 3000                      |
| `npm run docs:build`                  | Build static site to `docs/.vitepress/dist/`       |
| `npm run docs:preview`                | Preview the production build locally               |
| `npm run canvas:setup -- <course-id>` | Create a Canvas LMS course from config             |
| `npm run clean`                       | Remove `node_modules`, `dist`, and VitePress cache |

## Project Structure

```
docs/
├── index.md                  # Homepage
├── cs452/                    # Course: Operating Systems
│   ├── index.md              # Syllabus
│   ├── *.md                  # Lecture slides
│   ├── hw/                   # Homework assignments
│   └── projects/             # Project specs
├── teaching/                 # Teaching portfolio
├── research/                 # Research portfolio
└── .vitepress/
    └── config.mts            # Site config and sidebar nav

scripts/
├── create-canvas-course.mjs  # Generic Canvas course setup tool
└── courses/
    └── cs452.json            # Canvas config for CS452
```

## Adding or Updating Course Content

Each course lives in its own folder under `docs/`. Lecture notes are Markdown files served directly as pages. To add a new course:

1. Create `docs/<course-id>/index.md` (syllabus) and any lecture `.md` files.
2. Register the sidebar in `docs/.vitepress/config.mts` — add a `/<course-id>/` entry and a sidebar function.
3. Optionally add a Canvas config at `scripts/courses/<course-id>.json` (see below).

## Canvas LMS Integration

The `canvas:setup` script creates a Canvas course with assignment groups and grade entries that link back to this site. Canvas is used **only for grade management** — all course content stays on the website.

**Setup:**
```bash
export CANVAS_TOKEN=<token>        # Canvas > Account > Settings > New Access Token
export CANVAS_URL=https://canvas.boisestate.edu
export CANVAS_ACCOUNT_ID=<id>      # find yours with --list-accounts
```

**Commands:**
```bash
npm run canvas:setup -- --list-accounts   # find your Canvas account ID
npm run canvas:setup -- --list-courses    # see available course configs
npm run canvas:setup -- cs452            # create the CS452 course
```

**Adding a new course to Canvas:**

Create `scripts/courses/<course-id>.json`:

```json
{
  "name": "CS101 Introduction to CS",
  "code": "CS101",
  "siteBase": "https://shanepanter.com/cs101",
  "totalPoints": 1000,
  "groups": [
    {
      "name": "Projects",
      "assignments": [
        { "name": "Project 1: Hello World", "points": 100, "path": "/projects/p1" }
      ]
    },
    {
      "name": "Exams",
      "assignments": [
        { "name": "Midterm Exam", "points": 150 },
        { "name": "Final Exam",   "points": 150 }
      ]
    }
  ]
}
```

Omit `path` for assignments with no dedicated page (e.g. exams). Set `"extraCredit": true` to flag a group as extra credit in Canvas.

## Checking for Dead Links

```bash
find docs/<course-id> -name "*.md" | xargs npx markdown-link-check --quiet
```

## Deployment

Pushes to `master` automatically build and deploy via GitHub Actions (`.github/workflows/static.yml`). The built site is uploaded to GitHub Pages from `docs/.vitepress/dist/`. Node 22 is used in CI.

## Dependency Updates

```bash
ncu -u && npm install
```
