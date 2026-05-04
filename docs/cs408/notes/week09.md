# Week 9: Sprint 4 Kickoff — Admin Dashboard

**Phase:** Sprint 4 — Admin Dashboard  
**Due by Friday:** Draft PR open

## Goal

Start building the admin control panel. By end of week you should have an issue claimed and your first changes committed.

## Monday

Read the [Sprint 4 doc](/cs408/notes/sprint4). The key design question for this sprint is **authorization**, not just authentication. Auth answers "who are you?" — authorization answers "what are you allowed to do?"

Study `app/dependencies.py` (which now has `CurrentUser` from Sprint 2). Sprint 4 adds a second dependency: `require_admin`. Before writing code, understand how FastAPI `Depends` chains work:

```python
# CurrentUser returns the user or raises 401
def get_current_user(request: Request) -> User: ...

# require_admin calls get_current_user, then raises 403 if not admin
def require_admin(user: Annotated[User, Depends(get_current_user)]) -> User:
    if not user.is_admin:
        raise HTTPException(status_code=403)
    return user
```

## Wednesday

**Backend:** Add `is_admin: bool = False` to the `User` model. This requires a database migration. The simplest approach:

```python
# In a new script: scripts/migrate_add_is_admin.py
from sqlmodel import text
from app.database import engine

with engine.connect() as conn:
    conn.execute(text("ALTER TABLE user ADD COLUMN is_admin INTEGER NOT NULL DEFAULT 0"))
    conn.commit()
```

Document this in `CONTRIBUTING.md` under a "Running migrations" section.

**Frontend:** Sketch the admin dashboard layout on paper or in a comment on your issue before writing HTML. What are the 4–5 most important stats an admin needs?

**QA:** Write authorization test stubs (function signatures with `pass` and a comment describing what each tests). Get them committed so the Tech Lead can review the test plan.

**DevOps:** Write `scripts/make_admin.py` — the instructor needs this to bootstrap the first admin user on the deployed site.

## Thursday–Friday

- Draft PR open by Friday
- **PM:** Update the Projects board — move all Sprint 3 issues to "Done"; make sure Sprint 4 issues are in "In Progress" or "Todo"
- **Tech Lead:** Review the `require_admin` dependency design before anyone implements it; a mistake here creates a security hole

## Week 9 checklist

- [ ] Sprint 4 issue assigned to you
- [ ] You understand the difference between authentication and authorization
- [ ] Database migration documented in `CONTRIBUTING.md`
- [ ] Draft PR open with at least a skeleton of your changes
- [ ] Weekly Reflection submitted in Canvas
