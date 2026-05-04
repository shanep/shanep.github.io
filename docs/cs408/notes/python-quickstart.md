# Python Quickstart for Java Programmers

This page covers the Python you need to be productive in this codebase by Wednesday. It assumes
you can already read and write Java fluently. Every section shows Java on the left and the Python
equivalent on the right so you can map what you already know.

## Syntax basics

Python uses **indentation** instead of braces. Four spaces per level — no tabs, no curly brackets,
no semicolons.

```python
# Java                              # Python
# if (x > 0) {                      if x > 0:
#     System.out.println("pos");         print("pos")
# }
```

The colon (`:`) ends every `if`, `for`, `while`, `def`, and `class` header.

## Variables and type hints

Python variables are dynamically typed, but this codebase uses **type hints** everywhere because
we run `pyright` in CI. Write them — do not skip them.

```python
# untyped (don't do this in this repo)
name = "Alice"

# typed (do this)
name: str = "Alice"
count: int = 0
price: float = 9.99
active: bool = True
```

For optional values use `X | None` (Python 3.10+):

```python
from typing import Optional

nickname: str | None = None       # preferred style
nickname: Optional[str] = None    # equivalent — you'll see both
```

## Functions

```python
# Java: public int add(int a, int b) { return a + b; }

def add(a: int, b: int) -> int:
    return a + b
```

Default parameters and keyword arguments are common in FastAPI:

```python
def greet(name: str, greeting: str = "Hello") -> str:
    return f"{greeting}, {name}!"

greet("Alice")               # "Hello, Alice!"
greet("Alice", "Hi")         # "Hi, Alice!"
greet(name="Alice", greeting="Hey")  # keyword style
```

## f-strings

```python
name = "Alice"
score = 42
msg = f"Player {name} scored {score} points."   # Java: String.format(...)
```

Expressions work inside the braces: `f"{score * 2}"`, `f"{name.upper()}"`.

## Classes

```python
# Java equivalent of a simple POJO
class Job:
    def __init__(self, title: str, company: str) -> None:
        self.title = title
        self.company = company

    def __repr__(self) -> str:           # like toString()
        return f"Job({self.title!r}, {self.company!r})"
```

In this codebase most models are **SQLModel** classes, which use class-level annotations instead of
a constructor:

```python
from sqlmodel import SQLModel, Field

class Job(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    title: str
    company: str
```

Treat those annotations like Java record components — SQLModel generates the `__init__` for you.

## Collections

| Java | Python |
|------|--------|
| `ArrayList<String>` | `list[str]` |
| `HashMap<String, int>` | `dict[str, int]` |
| `HashSet<String>` | `set[str]` |
| `Optional<String>` | `str \| None` |

```python
jobs: list[str] = ["engineer", "designer"]
jobs.append("devops")          # add()
jobs[0]                        # get(0)
len(jobs)                      # size()

counts: dict[str, int] = {"a": 1, "b": 2}
counts["c"] = 3                # put()
counts.get("z", 0)             # getOrDefault()
```

## List comprehensions

A compact alternative to a `for` loop that builds a new list. You will see these throughout the
codebase.

```python
# Java: titles.stream().map(String::toUpperCase).collect(Collectors.toList())
titles = ["engineer", "designer"]
upper = [t.upper() for t in titles]

# with a filter
senior = [t for t in titles if "senior" in t]
```

## Decorators

Decorators (`@something`) are how FastAPI defines routes. They wrap a function without changing its
name or signature — think of them as a concise annotation that does real work.

```python
from fastapi import FastAPI

app = FastAPI()

@app.get("/jobs")              # registers this function as the GET /jobs handler
def list_jobs() -> list[Job]:
    ...
```

You do not need to write your own decorators — just read and use the ones FastAPI provides.

## `None` vs `null`

Python's `None` is Java's `null`. Check for it with `is None` / `is not None`, not `== None`.

```python
if result is None:
    raise ValueError("not found")
```

## Error handling

```python
# Java: try { ... } catch (ValueError e) { ... }
try:
    value = int(user_input)
except ValueError:
    print("not a number")
finally:
    cleanup()
```

FastAPI uses `HTTPException` for HTTP errors:

```python
from fastapi import HTTPException

raise HTTPException(status_code=404, detail="Job not found")
```

## `with` statements (context managers)

The `with` block is Python's try-with-resources. SQLModel sessions use it:

```python
# Java: try (Session session = ...) { ... }
with Session(engine) as session:
    jobs = session.exec(select(Job)).all()
```

## Imports

```python
# absolute import (preferred)
from app.models.job import Job

# import the module itself
import json

# multiple names from one module
from fastapi import FastAPI, HTTPException, Depends
```

There are no `package` declarations. The file path is the module path:
`app/models/job.py` → `from app.models.job import Job`.

## Running code

This project uses `uv`. The key commands are:

```bash
uv run uvicorn app.main:app --reload   # start the dev server
uv run pytest                          # run the test suite
uv run pyright                         # type-check (must pass before any PR)
uv run ruff check .                    # lint (must pass before any PR)
```

`uv run` is like `./gradlew run` — it ensures the right Python environment is active.

## Quick reference card

| Java | Python |
|------|--------|
| `System.out.println(x)` | `print(x)` |
| `x instanceof Foo` | `isinstance(x, Foo)` |
| `String.format(...)` | `f"..."` |
| `null` | `None` |
| `// comment` | `# comment` |
| `/* ... */` | no block comment — use multiple `#` lines |
| `public void foo()` | `def foo(self) -> None:` |
| `this` | `self` (first parameter of every method) |
| `import java.util.List` | `from typing import` or just use `list[...]` |

## What to do next

1. Skim `app/main.py` and `app/routes/jobs.py` — you can read every line with what you know above.
2. Run `uv run pytest` and make sure everything passes.
3. If you get a `pyright` error you don't understand, post it in `#help` — type errors are
   expected at first and easy to fix once you know the pattern.
