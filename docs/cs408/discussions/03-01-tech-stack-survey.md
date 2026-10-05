# 03.01 Tech Stack Survey

**Week 3 · 100 points**

## Overview

We will conduct a broad survey of languages, backend frameworks, and front-end frameworks that you
may want to use. You will post your results to this discussion board so the entire class can learn
about as many tech stacks as possible. The only restriction is that it must run on EC2 with a
**Linux** image. You are not committing to one particular stack at this time. That will come later
when you write your project specification. In fact, if another student finds a cool web stack that
you didn't research, you are free to use that when developing your project.

## Task 1 - Research & Compare

Find 3 different full-stack stacks and, for each one, clearly define:

- Backend language
- Backend framework
- Templating system (or frontend rendering approach)
- UX/UI framework (Bootstrap, Tailwind, Bulma, Material UI, etc.)
- Testing approach (unit/integration/e2e + tool names)
- Debugging approach (how you’ll debug + tools)

Your stacks must be meaningfully different (don’t do “Flask vs Django vs FastAPI” as your only
differences).

## Task 2 - Implement "Hello World"

All major frameworks have plenty of documentation on how to set up a quick "hello world"; some even
provide project generators that will construct a new application for you. More obscure frameworks
(like using x86 assembly) will require more work to set up and configure. After comparing 3 stacks,
pick ONE and create a simple app that includes all of the following:

### “Hello World” App Requirements

Your app must demonstrate:

- Server runs locally (you can show a terminal screenshot)
- One route/page that renders “Hello World”
- Uses a templating system (or equivalent server-side rendering)
- Uses a UI framework (e.g., Bootstrap) to style the page
- Includes one automated test
- Demonstrates debugging
  - Example: breakpoint screenshot, debug log output, or short explanation of how you stepped
    through a request

### Tech Stack Options

Below are some ideas for where to get started:

- [Ruby on Rails](https://rubyonrails.org/)
- C# and [ASP.NET Core](https://dotnet.microsoft.com/en-us/apps/aspnet)
- Python and [Django](https://www.djangoproject.com/)
- Java and [Spring](https://spring.io/)
- [Go](https://go.dev/doc/articles/wiki/)
- [x86 Assembly](https://github.com/ancat/minserv) language. This option is for students who love
  pain and suffering!
- [HTMX](https://htmx.org/)
- PHP with [Laravel](https://laravel.com/)

### Complete Examples

Here are some examples to get you started. You don't have to pick one of the 5 below. They are just
there to help you if you don't know where to start.

- Stack Option 1: Python / Django
  - Backend: Python
  - Framework: Django
  - Templating: Django Templates
  - UI: Bootstrap or Tailwind
  - Testing: pytest or Django test runner
  - Debugging: Django debug toolbar, VS Code debugger
- Stack Option 2: Java / Spring Boot
  - Backend: Java
  - Framework: Spring Boot
  - Templating: Thymeleaf
  - UI: Bootstrap
  - Testing: JUnit + Spring Test
  - Debugging: IntelliJ/VS Code debugger, logs
- Stack Option 3: C# / ASP.NET Core
  - Backend: C#
  - Framework: ASP.NET Core MVC
  - Templating: Razor Views
  - UI: Bootstrap
  - Testing: xUnit or NUnit
  - Debugging: Visual Studio debugger, logging
- Stack Option 4: Ruby / Rails
  - Backend: Ruby
  - Framework: Ruby on Rails
  - Templating: ERB (or Haml/Slim)
  - UI: Bootstrap/Tailwind
  - Testing: RSpec or Minitest
  - Debugging: byebug, Rails logs
- Stack Option 5: PHP / Laravel
  - Backend: PHP
  - Framework: Laravel
  - Templating: Blade
  - UI: Bootstrap/Tailwind
  - Testing: PHPUnit + Laravel testing
  - Debugging: Xdebug, Laravel logs

## Task 3 - Post your findings

Use this structure in your discussion post:

- Stack 1:
  - Backend language:
  - Framework:
  - Templating/rendering:
  - UX/UI:
  - Testing:
  - Debugging:
  - Pros/cons (2-3 bullets):
- Stack 2:
  - (same fields)
- Stack 3:
  - (same fields)
- Chosen stack to do hello world:
  - I chose:
  - Reason (3-5 sentences):
  - Hello World evidence:
  - Route/controller:
  - Template/view:
  - UI framework proof:
  - Test + results:
  - Screenshots/Repo link:

## Submitting

- Create a new discussion post and use the structure above to post your findings.
- Read and respond to at least two other students' posts.

## Rubric

| n | description | points |
| --- | --- | --- |
| 1 | Task 1 - Research & Compare | 40 |
| 2 | Task 2 - Implement "Hello World" | 40 |
| 3 | Peer Review | 20 |
