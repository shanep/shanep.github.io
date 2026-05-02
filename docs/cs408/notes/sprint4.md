# Sprint 4: Admin Dashboard (Weeks 9–10)

Regular users can browse and apply for jobs. Admins need a control panel: a single place to
see what is happening across the whole platform. Sprint 4 builds that.

## Sprint goal

> Admin users can view platform-wide stats, manage all job listings, and review all applications
> from a protected `/admin` dashboard.

## What each role ships this sprint

### Backend
- Add `is_admin: bool = False` to the `User` model (with a database migration)
- Create a `require_admin` dependency in `app/dependencies.py` that raises `403` for non-admins
- Add `GET /admin` route returning aggregate stats:
  - Total jobs (open / closed)
  - Total applications (by status)
  - Most recent 5 applications
- Add `GET /admin/users` listing all registered users with their application count

### Frontend
- Create `templates/admin/dashboard.html` using HTMX stat cards that each load independently
- Add an "Admin" link to the navbar that is only visible when `current_user.is_admin` is true
- Create `templates/admin/users.html` with a sortable user table

### QA
Write authorization tests for every admin route:

```python
def test_admin_dashboard_requires_admin(): ...
def test_admin_dashboard_blocks_regular_user(): ...
def test_admin_dashboard_blocks_unauthenticated(): ...
def test_admin_users_list(): ...
```

### DevOps
- Write a one-off management script `scripts/make_admin.py` that promotes a user by email:
  ```bash
  uv run scripts/make_admin.py --email admin@example.com
  ```
- Document how to seed the first admin user on a fresh Render deployment

### Tech Lead
- Review all PRs that touch `require_admin` for privilege escalation bugs
- Ensure the admin routes are not discoverable via the navbar for non-admins (check templates)
- Open a discussion: "Should admins be able to impersonate regular users?" — close it with a decision

### PM
- Create a "Admin UX" issue listing the 5 most important things an admin needs to see
- Track the dependency graph: backend admin routes must merge before frontend can connect to them

## Security focus this sprint

Every admin PR review should check:

- [ ] Admin routes return `403` (not `404`) for authenticated non-admin users
- [ ] Admin routes return `302` to `/login` for unauthenticated users
- [ ] Admin UI controls are not rendered in HTML for non-admins (not just hidden with CSS)
- [ ] There is no way to self-promote to admin via a form

## References

- [FastAPI dependencies with yield](https://fastapi.tiangolo.com/tutorial/dependencies/dependencies-with-yield/)
- [HTTP 403 vs 401](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/403)
- [HTMX lazy loading with `hx-trigger="load"`](https://htmx.org/attributes/hx-trigger/)

## Sprint 4 checklist

- [ ] `/admin` returns 403 for regular users and 302 for unauthenticated users
- [ ] Stats on the dashboard are accurate (verify manually with known test data)
- [ ] Admin nav link is hidden from non-admins in the rendered HTML
- [ ] `scripts/make_admin.py` works on the deployed instance
- [ ] You have 2+ merged PRs
- [ ] You have given 2+ reviews
