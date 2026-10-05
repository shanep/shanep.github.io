---
submission: online_url
grading: pass_fail
---

# 04.01 - Mini-Lab Warmup

**Week 4 · 100 points · due Fri Sep 18, 11:59 PM**

## Overview

Using the same framework that you selected to write your "Hello world in the previous assignment",
you are going to write a small app that talks to the Canvas LMS REST API and solves a real problem
you face as a student. The goal is to give you hands-on experience with REST API consumption,
token-based authentication, and JSON parsing.  The only hard requirements are that it calls at least
two distinct Canvas API endpoints, and it displays the results using your framework. This is a
**mini-lab**, so you don't have to do anything super complex. You are free to use AI to help you in
any way; in fact, using AI to generate boilerplate code to access the REST API is recommended, so
you can spend more time on the creative and interesting parts :)

#### Learning Objectives

By completing this mini-lab, you will demonstrate your ability to:

- Authenticate with a third-party REST API using bearer tokens.
- Make HTTP requests from application code and handle paginated responses.
- Parse and transform JSON payloads into a user-friendly terminal output.
- Manage secrets safely (environment variables, .env files, .gitignore).
- Write clear developer documentation (README with setup instructions, usage examples, and a demo
  GIF).

Example:

- I have provided an example using the webstack that you learned in 208 for reference:
  <https://github.com/shanep/full-stack-rest>
- You can use **ANY framework** and language for this app. You don't have to use what is shown in
  the example.

### Task 1 - Creating Your Canvas API Token

1. Create a new public GitHub repo to host your app
2. Make sure you are logged in to Canvas with your student account. Some of you may have an
    employee email address (if you are a student employee or work for BSU).
3. **Open Account Settings.** Click your profile picture or avatar in the far-left global
    navigation sidebar, then click **Settings**.
4. **Scroll to Approved Integrations.** On the Settings page, scroll down to the **Approved
    Integrations section**.
5. **Generate a New Token.** Click the **+ New Access Token.** A dialog will appear with two
    fields.
6. **Fill in the dialog.** In the **Purpose** field, type a descriptive value, such as CS4XX
    Project. You should set an **Expiry Date** (e.g., the last day of the semester). Then click
    **Generate Token**.
7. **Copy the token immediately.** Canvas will display your token *only once*. Copy it and paste it
    somewhere safe. If you lose it, delete the old one in Canvas and generate a new one.
8. **Create an .env file.** In the root of your project, create a file named .env containing the
    line: CANVAS_API_TOKEN=your_token_here.
9. **CRITICAL**: Add .env to your .gitignore.

#### Security Warning
Your Canvas token grants full access to your account. Never commit it to a public (or private)
repository. If you accidentally push a token, revoke it immediately in Canvas Settings and generate
a new one.

### Task 2 - Functional Requirements

Your app must satisfy all of the following:

- **Calls at least two distinct Canvas API endpoints.** For example, listing courses and listing
  assignments for a chosen course. A single endpoint called twice with different parameters does not
  count.
- **Accepts user input.** The tool must accept at least one form of user input from a form
- **Produces formatted terminal output.** Raw JSON dumps do not count. Present data in a
  human-readable way, such as tables, colored text, indented lists, or similar using templates to
  produce HTML
- **Handles errors gracefully.** If the token is missing, the network is down, or Canvas returns an
  error status code, the app should display the error to the user
- **Handles pagination.** Canvas paginates most list endpoints. Your tool must follow the Link
  header to retrieve all pages, or document clearly why pagination is not applicable to your chosen
  endpoints.

#### Non-Functional Requirements

- **No secrets in the repo.** The .env file (or equivalent) must be git-ignored. A **.env.example**
  file with placeholder values should be included instead.
- **Clean code.** Reasonable variable names, modular functions, and brief comments where the logic
  is not obvious.
- **Works out of the box.**  Someone should be able to clone your repo, install dependencies, add
  their own .env, and run the tool by following your README alone.

Task 3 - README

Your README.md must include the following sections at a minimum:

- **Project Title and Description.** A one- or two-sentence summary of what the tool does and why it
  is useful.
- **Setup Instructions.** Step-by-step instructions for cloning the repo, installing dependencies,
  creating a .env file, and running the tool. Assume the reader has never used your language’s
  package manager before.
- **API Endpoints Used.** A brief table or list describing which Canvas API endpoints your tool
  calls and what data it retrieves from each.
-  Two to three paragraphs reflecting on what you learned, what was challenging, and what you would
  improve if you had more time.

### Ideas

You are free to build anything that meets the requirements above. If you need inspiration, here are
some ideas roughly ordered from simpler to more ambitious:

| **Tool Name** | **Description** |
|----|----|
| Assignment Tracker | List all upcoming assignments across all courses, sorted by due date, with color-coded urgency. |
| Grade Dashboard | Display your current grades for each course in a formatted table, with estimated GPA. |
| Course Search | Search for courses by keyword, view syllabi, and list enrolled students (where permitted). |
| Submission Bot | Upload a file submission to a specified assignment from the command line. |
| Announcement Feed | Aggregate recent announcements across all courses into a single chronological feed. |
| TODO Sync | Pull your Canvas TODO items, display or export them to a local Markdown/JSON file. |
| Module Progress | Show completion progress for each module in a selected course with progress bars. |
| Calendar Export | Fetch calendar events and assignment due dates, export them as an .ics file for import into Google Calendar or Outlook. |

*You are not limited to this list.* Creativity is encouraged. If your idea calls for a single
endpoint, consider which complementary endpoint would make the tool more useful.

### Canvas API Quick Reference

The full Canvas REST API documentation is available at:
 <https://boisestatecanvas.instructure.com/doc/api/live>

Here are some commonly used endpoints to get you started:

| **Method** | **Endpoint**                    | **Description**         |
|------------|---------------------------------|-------------------------|
| GET        | /api/v1/courses                 | List your courses       |
| GET        | /api/v1/courses/:id/assignments | Assignments in a course |
| GET        | /api/v1/courses/:id/enrollments | Your enrollment/grades  |
| GET        | /api/v1/users/self/todo         | Your TODO items         |
| GET        | /api/v1/announcements           | Course announcements    |
| GET        | /api/v1/calendar_events         | Calendar events         |
| GET        | /api/v1/courses/:id/modules     | Course modules          |
| POST       | /api/v1/.../submissions         | Submit an assignment    |

### Submitting

You will submit a single URL to a public GitHub repository. The repository must contain:

1. **Source code** for your App
2. **README.md** with the sections described below.
3. **.env.example** showing required environment variables with placeholder values.
4. **.gitignore** that excludes .env and any build artifacts or dependency directories
    (node_modules, \_\_pycache\_\_, etc.).

#### Submission Instructions

1. Push your final code to a **public GitHub repository**. Double-check that the repository is
    public
2. Run a final check: clone your own repo into a fresh directory, follow your own setup
    instructions, and confirm the tool works.
3. Submit the **URL to your GitHub repository** through the Canvas assignment submission page
    before the deadline. **BONUS POINTS if your tool can submit itself!**

### Grading

This assignment is a review of 208 material and is graded as pass/fail. You must complete at least
80% of the assignment to get a pass.
