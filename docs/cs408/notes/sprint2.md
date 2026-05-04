# Sprint 2: Authentication (Weeks 5–6)

Right now anyone can post or delete a job. Sprint 2 adds user accounts so that only registered,
logged-in users can post jobs, and only admins can delete them. This is the sprint that introduces
the most cross-cutting change to the codebase — coordinate with your teammates before you start.

## Sprint goal

> Users can register, log in, and log out. Job creation is protected behind a login wall.
> Passwords are hashed. Sessions are stored in signed cookies.

## Design decisions (Tech Lead owns these)

Before backend engineers write a line of auth code, the Tech Lead must open an issue that
answers:

1. What library handles password hashing? (`passlib[bcrypt]`)
2. What does the `CurrentUser` dependency look like? (type, file location)
3. Where does the session token live? (signed cookie via `itsdangerous`)
4. What happens when an unauthenticated user hits a protected route? (redirect to `/login`)

Engineers should not start auth work until this issue is closed and merged into a
`docs/auth-design.md` file.

## What each role ships this sprint

### Backend
- Add `User` model to `app/models/user.py` (id, email, hashed_password, is_admin)
- Add `POST /register` and `POST /login` routes in `app/routes/auth.py`
- Add `POST /logout` route
- Create a `CurrentUser` FastAPI dependency in `app/dependencies.py`
- Protect `POST /jobs` and `DELETE /jobs/{id}` with the `CurrentUser` dependency

Add these packages:
```bash
uv add passlib[bcrypt] itsdangerous
```

### Frontend
- Create `templates/auth/login.html` and `templates/auth/register.html`
- Update `templates/base.html` navbar to show Login/Register or username + Logout
- Show an error message on failed login (`Invalid email or password`)
- Redirect to `/jobs` after successful login

### QA
Write tests for every auth path:
```
POST /register — success
POST /register — duplicate email
POST /login    — success, session cookie set
POST /login    — wrong password
POST /logout   — clears session
POST /jobs     — authenticated user can post
POST /jobs     — unauthenticated user gets 302 to /login
```

### DevOps
- Add `SECRET_KEY` environment variable to the Render deployment
- Document how to rotate the secret key without invalidating all sessions
- Add `SECRET_KEY` to `.github/workflows/ci.yml` as a test secret (use a dummy value)

### Tech Lead
- Write `docs/auth-design.md` before sprint work begins (see above)
- Review all auth PRs for security issues: no plaintext passwords, no SQL injection, cookies are `HttpOnly`
- Ensure the `CurrentUser` dependency is used consistently — reject PRs that inline auth logic

### PM
- Break the sprint goal into granular issues (User model, routes, templates, tests are separate issues)
- Track blockers: backend auth must merge before frontend can wire up the navbar

## Security notes for reviewers

When reviewing auth PRs, check for:

- [ ] Passwords stored as bcrypt hashes, never plaintext
- [ ] Session cookie has `HttpOnly=True` and `SameSite="lax"`
- [ ] Login form does not reveal whether the email exists ("Invalid email or password", not "No account with that email")
- [ ] `SECRET_KEY` is read from an environment variable, never hard-coded

## References

- [passlib bcrypt docs](https://passlib.readthedocs.io/en/stable/lib/passlib.hash.bcrypt.html)
- [FastAPI security tutorial](https://fastapi.tiangolo.com/tutorial/security/)
- [itsdangerous signed cookies](https://itsdangerous.palletsprojects.com/en/stable/)
- [OWASP authentication cheat sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)

## Sprint 2 checklist

- [ ] `docs/auth-design.md` is merged before sprint coding starts
- [ ] Register and login work end-to-end on the deployed site
- [ ] All auth routes have tests
- [ ] Passwords are bcrypt-hashed (verify with a reviewer)
- [ ] `SECRET_KEY` is in an env var, not in code
- [ ] You have 2+ merged PRs
- [ ] You have given 2+ reviews
