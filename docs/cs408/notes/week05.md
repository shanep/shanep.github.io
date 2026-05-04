# Week 5: Sprint 2 Kickoff — Authentication

**Phase:** Sprint 2 — Authentication  
**Due by Wednesday:** `auth-design.md` PR merged (Tech Lead owns this)  
**Due by Friday:** Sprint 2 issue assigned + branch started

## Goal

Before anyone writes auth code, the Tech Lead publishes a design document that every engineer agrees on. This prevents four people implementing auth four different ways.

## Monday

Read the [Sprint 2 doc](/cs408/notes/sprint2) end to end — every role has a specific responsibility.

**Tech Lead:** open a GitHub issue titled "Auth Design" and start drafting `docs/auth-design.md`. The doc must answer:

1. What library hashes passwords? (`passlib[bcrypt]`)
2. What does the `CurrentUser` dependency return? (type + location)
3. How is the session stored? (signed cookie via `itsdangerous`)
4. What URL does an unauthenticated user get redirected to?

Everyone else: leave comments on the Auth Design issue with any questions before Wednesday.

## Wednesday

**Tech Lead:** The `auth-design.md` PR must be merged by end of day. If it is not merged by Wednesday, backend engineers should not start coding — they need the design first.

**Backend:** Once `auth-design.md` is merged, install the new dependencies and start the `User` model:

```bash
uv add passlib[bcrypt] itsdangerous
```

Create `app/models/user.py` — keep it small. Get the model and migration working before touching routes.

**Everyone else:** Review and approve the `auth-design.md` PR. Leave a comment confirming you read it.

## Thursday–Friday

- **Backend:** `User` model PR should be open by Friday
- **Frontend:** Study `templates/base.html` — plan where Login/Register links will go in the navbar
- **QA:** Write the test cases you plan to implement (as a GitHub comment on the QA auth issue, not code yet)
- **DevOps:** Identify which secrets the auth system needs; open an issue documenting them
- **PM:** Confirm every Sprint 2 issue has an assignee; note any blockers on the Projects board

## Why the design-first rule?

Auth touches every part of the app. If backend merges a `CurrentUser` dependency that returns `User | None`, and frontend templates assume it always returns a `User`, you get runtime crashes in production. A 30-minute design doc prevents a week of debugging.

## Week 5 checklist

- [ ] `auth-design.md` is merged into `main` (Tech Lead responsible)
- [ ] You have read and commented on `auth-design.md`
- [ ] Your Sprint 2 issue is assigned to you
- [ ] Branch created; first commit pushed
- [ ] Weekly Reflection submitted in Canvas
