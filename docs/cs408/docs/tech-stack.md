# Overview 



For the remainder of the semester you are going to be building your own full stack application using the technologies and topic of your choice. This will give you an opportunity to take a deep 

## What Is a Tech Stack?

A tech stack is the complete set of technologies that work together to build and run a software
application. It includes everything from the language your backend is written in, to the database
that stores your data, to the web server that delivers pages to a browser. When someone asks "what's
your stack?" they are asking about all of these layers at once.

Every web application involves multiple technologies cooperating across multiple boundaries.
Understanding those boundaries and the role each technology plays is a core skill of a full-stack
developer. This reading walks through the concept layer by layer and then maps each layer onto the
stack used in the CS408 starter repository.

## The mental model: client, server, and layers

Web applications follow a **client-server** model. The **client** is usually a web browser running
on a user's device. The **server** is a process (or set of processes) running on a remote machine
that listens for requests and sends back responses. Every interaction between them follows the
HTTP request/response cycle: the client sends a request, the server does some work, and the server
sends a response.

Inside the server side of that relationship there are usually several distinct responsibilities:

- **Presentation**: generating the HTML, CSS, and JavaScript that the browser will render.
- **Application logic**: handling routes, validating input, enforcing business rules, and
  coordinating between the presentation and data layers.
- **Data**: reading from and writing to a persistent store such as a database.

This separation is called **n-tier architecture**. A small app might run all three tiers in a single
process on a single machine. A large app might split them across many services. The concept is the
same either way: each tier has a focused responsibility and communicates with its neighbors through
defined interfaces.

A tech stack is the list of specific technologies you have chosen to fill each of those tiers, plus
the infrastructure that deploys and runs them.

## The frontend layer

The frontend is everything that executes in or is rendered by the browser. At the lowest level that
means three technologies:

- **HTML** defines the structure and semantic content of the page.
- **CSS** controls layout, color, typography, and responsive behavior.
- **JavaScript** adds interactivity: responding to clicks, fetching data, and updating the DOM.

### SSR vs. SPA

A major architectural decision on the frontend is how pages get built:

- **Server-side rendering (SSR)** means the server generates complete HTML for each request. The
  browser receives a finished page and displays it. Navigation triggers a full round-trip to the
  server for new HTML.
- **Single-page application (SPA)** means the server sends a minimal HTML shell and a large
  JavaScript bundle. The JavaScript takes over the browser, rendering all UI client-side and
  fetching data from the server via API calls (usually JSON over REST or GraphQL). Navigation
  happens without full page reloads.

Each approach has tradeoffs. SSR is simpler to reason about, produces faster initial page loads, and
is easier to make accessible. SPAs can deliver a more fluid interactive experience at the cost of
complexity: you maintain a full application framework in the browser and duplicate some logic
between client and server.

| Approach | Common choices |
|----------|---------------|
| SPA | React, Vue, Angular, Svelte |
| SSR with templates | EJS, Pug, Handlebars, Jinja2, Thymeleaf, ERB |
| Hybrid / islands | Next.js, Nuxt, Astro, HTMX |

### In the CS408 starter

The starter repository uses **server-side rendering**. Templates are written in **EJS** (Embedded
JavaScript), a templating language that lets you embed JavaScript expressions directly inside HTML.
The `express-ejs-layouts` package adds layout inheritance so you can define a shared page shell in
`views/layout.ejs` and inject page-specific content into it.

Styling comes from **Bootstrap**, a CSS framework that provides a responsive grid system, pre-built
components (navbars, cards, buttons, forms), and utility classes. Static assets like CSS files,
client-side JavaScript, and images are served from the `public/` directory.

```text
app/src/views/layout.ejs    ← shared page shell (head, nav, footer)
app/src/views/index.ejs     ← home page content injected into the layout
app/src/views/error.ejs     ← error page
app/src/public/stylesheets/ ← CSS files (including Bootstrap)
app/src/public/javascripts/  ← client-side JS
app/src/static/             ← plain HTML files served as-is
```

## The backend layer

The backend is the code that runs on the server. It receives HTTP requests, applies business logic,
talks to the database, and returns responses. Its responsibilities typically include:

- **Routing**: mapping a URL and HTTP method (GET, POST, etc.) to a handler function.
- **Middleware**: cross-cutting concerns like parsing request bodies, attaching database
  connections, logging, authentication, and error handling.
- **Business logic**: the domain-specific rules your application enforces.
- **Response generation**: rendering a template, returning JSON, or redirecting.

The backend is built on top of a **runtime** (the engine that executes your code) and a
**framework** (a library that provides the routing, middleware, and request/response abstractions
so you do not have to write them from scratch).

| Runtime | Framework(s) |
|---------|-------------|
| Node.js | Express, Fastify, Koa, Hapi |
| Python | Django, Flask, FastAPI |
| Java | Spring Boot, Jakarta EE |
| Ruby | Rails, Sinatra |
| C# | ASP.NET Core |
| Go | net/http (stdlib), Gin, Echo |

### In the CS408 starter

The starter uses **Node.js** as the runtime and **Express 5** as the framework. The main
application file is `app/src/app.js`. It configures the view engine, registers middleware, and
mounts route modules.

```javascript
// app/src/app.js (simplified)
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const index = require('./routes/index');

const app = express();

app.set('view engine', 'ejs');
app.use(expressLayouts);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// Attach the database manager to every request
app.use((request, response, next) => {
  request.db = databaseManager.dbHelpers;
  next();
});

app.use('/', index);
```

Route handlers live in `app/src/routes/`. Each route file exports an Express `Router` that
defines handlers for specific paths and methods:

```javascript
// app/src/routes/index.js (simplified)
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.render('index', { title: 'Home' });
});

module.exports = router;
```

## The data layer

Almost every web application needs to persist state somewhere: user accounts, content, settings,
transactions. That somewhere is usually a **database**.

### SQL vs. NoSQL

**Relational (SQL) databases** store data in tables with defined schemas. You query them with SQL.
They enforce constraints like foreign keys and unique indexes, which helps maintain data integrity.
Examples: PostgreSQL, MySQL, SQLite.

**NoSQL databases** trade the rigid relational model for flexibility. Document stores (MongoDB),
key-value stores (Redis), and wide-column stores (Cassandra) each optimize for different access
patterns. They can be easier to scale horizontally but shift more responsibility for data
consistency onto the application.

### Embedded vs. server databases

Most databases run as a separate process (or cluster of processes) that your application connects to
over a network socket. **SQLite** works differently. It is an embedded database: the engine runs
inside your application process and reads and writes directly to a single file on disk. There is no
separate server to install, configure, or maintain.

That design fits development, applications with moderate write loads, and deployments where
operational simplicity matters. SQLite is not the right choice for every production workload. High
write concurrency across many simultaneous connections is where a client-server database like
PostgreSQL performs better. For many real applications, though, SQLite is enough.

### Drivers and ORMs

Your application code talks to the database through a **driver**, a library that speaks the
database's wire protocol (or, in SQLite's case, calls its C API). On top of a raw driver you can
optionally layer an **ORM** (Object-Relational Mapper) that lets you work with database rows as
objects in your programming language instead of writing SQL strings.

| Approach | Examples |
|----------|---------|
| Raw driver / query builder | `better-sqlite3`, `pg`, `mysql2` |
| ORM | Prisma, Sequelize, Drizzle, Knex (query builder), SQLAlchemy, Django ORM |

ORMs reduce boilerplate and can protect against SQL injection by default, but they add abstraction
that can obscure what queries actually run. Many teams use a middle ground: a query builder or a
thin data-access layer rather than a full ORM.

### In the CS408 starter

The starter uses **SQLite** through the **`better-sqlite3`** driver. A small module at
`app/src/bin/db.js` creates a database manager that exposes helper functions for common queries.
The database file lives in a `data/` directory.

Express middleware attaches the database helpers to every incoming request so route handlers can
access them via `request.db`:

```javascript
app.use((request, response, next) => {
  request.db = databaseManager.dbHelpers;
  next();
});
```

This is a thin, explicit approach with no ORM in between. You write the SQL, the driver executes it,
and you get plain JavaScript objects back.

## The infrastructure and deployment layer

Writing application code is only part of the story. That code has to run somewhere that users can
reach it. The infrastructure layer covers how your application is packaged, served, and made
available on the internet.

### Reverse proxy

In production, a web application is rarely exposed directly to the internet. Instead, a **reverse
proxy** sits in front of it. The reverse proxy accepts incoming connections from clients and
forwards them to the application server. This provides several benefits:

- **TLS termination**: the proxy handles HTTPS so the application does not have to.
- **Static file serving**: the proxy can serve images, CSS, and JS files directly from disk
  without involving the application process.
- **Load balancing**: the proxy can distribute requests across multiple application instances.
- **Buffering and security**: the proxy can absorb slow clients and malicious traffic before it
  reaches the application.

**nginx** is a common reverse proxy. Apache (`httpd`) and Caddy are alternatives.

### Containers

A **container** packages your application and all of its dependencies into an isolated, reproducible
unit that runs the same way on any machine. **Docker** is the most common container runtime.

A `Dockerfile` describes how to build an image (install dependencies, copy source code, set the
start command). A `docker-compose` file describes how to run multiple containers together, for
example one container for the application and another for the reverse proxy.

Containers solve the "works on my machine" problem and make deployment predictable. In production
you might run containers on a single VM, or orchestrate them with tools like Kubernetes or
AWS ECS.

### Hosting

Your containers (or bare application processes) need a machine to run on. Options span a wide
spectrum:

| Model | Examples |
|-------|---------|
| Virtual machines (IaaS) | AWS EC2, DigitalOcean Droplets, Azure VMs |
| Platform as a service (PaaS) | Heroku, Render, Railway, Fly.io |
| Container orchestration | Kubernetes, AWS ECS, Google Cloud Run |
| Serverless functions | AWS Lambda, Vercel Functions, Cloudflare Workers |

Each moves the line between what you manage and what the provider manages. A raw VM gives you full
control, but you handle OS patching, process management, and networking yourself. A PaaS abstracts
most of that away at the cost of flexibility.

### In the CS408 starter

The starter repository is built around **Docker** and **nginx**. The repository contains two
Dockerfiles:

- `app/Dockerfile` builds the Node.js application image.
- `nginx/Dockerfile` builds the nginx reverse proxy image using a custom `nginx.conf`.

A `docker-compose-template.yml` wires them together: nginx listens on the public port and proxies
requests to the Express app running in a separate container.

For hosting, the starter targets **AWS EC2**. GitHub Actions workflows handle building the Docker
images, pushing them to a registry, and deploying to an EC2 instance. A manual (non-Docker)
deployment path is also documented for students who want hands-on experience with server
administration.

## Development tooling, testing, and CI/CD

Beyond the runtime stack, every project relies on tooling that helps developers write, test, and
ship code. This is not usually counted as a "layer" in the same way the frontend or backend is, but
it is part of any tech stack.

In the CS408 starter the key pieces are:

| Tool | Role |
|------|------|
| npm | Package manager; installs dependencies and runs scripts |
| nodemon | Development server with automatic reload on file changes |
| Playwright | End-to-end testing framework; tests run in a real browser |
| GitHub Actions | CI/CD; runs linting, tests, Docker builds, and deployment on every push or PR |
| cross-env | Sets environment variables consistently across operating systems |

The `package.json` in the `app/` directory defines scripts for the common workflows:

```bash
npm start          # start the dev server with nodemon
npm test           # run Playwright end-to-end tests
npm run start:prod # start in production mode without nodemon
```

CI runs automatically on pull requests through GitHub Actions. If the tests or build fail, the PR
cannot be merged. This keeps the `main` branch in a deployable state.

## Putting it together: the starter stack end to end

Here is what happens when a user visits the CS408 application in their browser, traced through
every layer of the stack:

1. The browser sends an HTTP GET request to the server's public address.
2. **nginx** receives the request. If it is for a static asset (an image, a CSS file, a JavaScript
   file), nginx serves it directly from disk and the request is done. Otherwise, nginx forwards
   the request to the Node.js application container.
3. **Express** receives the forwarded request and runs it through its middleware chain: the body
   is parsed, the database manager is attached to `request.db`, and any other registered
   middleware executes in order.
4. The **route handler** matched by the request's URL and method runs. It may call
   `request.db` functions that execute SQL queries against the **SQLite** database via
   **`better-sqlite3`**.
5. The route handler calls `res.render()`, passing a template name and a data object. **EJS**
   compiles the template, injects the data, and wraps the result in the shared layout from
   `layout.ejs`. **Bootstrap** classes in the HTML provide responsive styling.
6. Express sends the finished HTML back through nginx to the browser.
7. The browser parses the HTML, fetches any linked CSS and JavaScript assets (served by nginx),
   and renders the page.

This is a **monolithic** architecture: all of the application logic runs in a single Express
process. For a project of this scale, a monolith is the simplest and most productive choice. The
alternative, **microservices**, splits the application into many small, independently deployable
services that communicate over the network. Microservices add operational complexity (service
discovery, distributed tracing, network latency between services) that is only justified once a team
or codebase grows large enough that independent deployment and scaling of individual components is
worth that cost.

The CS408 starter is a monolith, which suits its size.

## Summary

| Layer | What it does | Common choices | CS408 starter |
|-------|-------------|----------------|---------------|
| Frontend | Structure, style, and interactivity in the browser | React, Vue, Angular, EJS, Pug, HTMX | EJS + express-ejs-layouts, Bootstrap, static assets from `public/` |
| Backend | Routing, middleware, business logic, response generation | Express, Django, Flask, Spring, Rails | Node.js + Express 5 |
| Data | Persistent storage and querying | PostgreSQL, MySQL, MongoDB, SQLite | SQLite via better-sqlite3 |
| Infrastructure | Reverse proxy, containers, hosting, deployment | nginx, Apache, Docker, Kubernetes, AWS, Heroku | nginx reverse proxy, Docker + docker-compose, AWS EC2 |
| Tooling / CI | Dev servers, testing, linting, CI/CD pipelines | nodemon, Jest, Playwright, GitHub Actions, Jenkins | nodemon, Playwright, npm scripts, GitHub Actions |

## Glossary

**Tech stack**: The complete set of programming languages, frameworks, libraries, databases,
servers, and tools used to build and run an application.

**Frontend**: The part of a web application that runs in (or is rendered by) the user's browser.
Covers HTML, CSS, JavaScript, and any client-side frameworks.

**Backend**: The part of a web application that runs on the server. Handles routing, business
logic, data access, and response generation.

**Client/server**: An architectural model where a client (typically a browser) sends requests to a
server, which processes them and returns responses. The web is built on this model.

**N-tier architecture**: A design pattern that separates an application into distinct layers
(tiers), each with a focused responsibility. A classic three-tier layout is presentation,
application logic, and data.

**Monolith**: A deployment model where the entire application runs as a single process or unit.
Simple to develop, test, and deploy. Most applications start as monoliths.

**Microservices**: A deployment model where the application is split into many small, independently
deployable services that communicate over the network. Adds operational complexity but enables
independent scaling and deployment of individual components.

**Server-side rendering (SSR)**: A technique where the server generates complete HTML for each
request. The browser receives a finished page and displays it.

**Single-page application (SPA)**: A technique where the server sends a minimal HTML shell and a
JavaScript bundle. The JavaScript renders all UI in the browser and fetches data via API calls.

**Full-stack**: Working across all layers of a web application, from the frontend through the
backend to the database and infrastructure. A full-stack developer can contribute to any layer.
