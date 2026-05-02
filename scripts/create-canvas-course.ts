#!/usr/bin/env tsx
/**
 * Creates a Canvas LMS course from a course config file.
 * Canvas is used only for grade management — no file submission in Canvas.
 *
 * Course configs live in scripts/courses/<course-id>.json
 *
 * Setup:
 *   export CANVAS_TOKEN=<token>        # Canvas > Account > Settings > New Access Token
 *   export CANVAS_URL=https://canvas.boisestate.edu
 *   export CANVAS_ACCOUNT_ID=<id>      # optional; run --list-accounts to find yours
 *
 * Usage:
 *   npm run canvas:setup -- <course-id>
 *   npm run canvas:setup -- cs452
 *   npm run canvas:setup -- --list-accounts
 *   npm run canvas:setup -- --list-courses
 */

import { readFileSync, readdirSync } from "node:fs";
import { resolve, dirname, basename } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const COURSES_DIR = resolve(__dirname, "courses");

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface Assignment {
  name: string;
  points: number;
  path?: string;
  extraCredit?: boolean;
}

interface AssignmentGroup {
  name: string;
  assignments: Assignment[];
}

interface CourseConfig {
  name: string;
  code: string;
  siteBase: string;
  totalPoints: number;
  groups: AssignmentGroup[];
}

interface CanvasAccount {
  id: number;
  name: string;
}

interface CanvasCreated {
  id: number;
}

// ---------------------------------------------------------------------------
// Config loading
// ---------------------------------------------------------------------------

function listCourseIds(): string[] {
  return readdirSync(COURSES_DIR)
    .filter((f) => f.endsWith(".json"))
    .map((f) => basename(f, ".json"))
    .sort();
}

function loadCourse(courseId: string): CourseConfig {
  const file = resolve(COURSES_DIR, `${courseId}.json`);
  let raw: unknown;
  try {
    raw = JSON.parse(readFileSync(file, "utf8"));
  } catch {
    const ids = listCourseIds();
    console.error(
      `Unknown course: "${courseId}"\n\n` +
      `Available courses: ${ids.length ? ids.join(", ") : "(none found)"}\n\n` +
      `Add a new course by creating scripts/courses/${courseId}.json`
    );
    process.exit(1);
  }
  for (const key of ["name", "code", "siteBase", "totalPoints", "groups"] as const) {
    if (!(key in (raw as object))) {
      console.error(`Invalid course config: missing required field "${key}" in ${file}`);
      process.exit(1);
    }
  }
  return raw as CourseConfig;
}

// ---------------------------------------------------------------------------
// HTML generation
// ---------------------------------------------------------------------------

function assignmentHtml(a: Assignment, siteBase: string): string {
  const url = a.path ? `${siteBase}${a.path}` : siteBase;
  const link = `<a href="${url}">course website</a>`;
  let html = `<p>See the ${link} for full instructions and submission details.</p>`;
  if (a.extraCredit) {
    html +=
      "<p><strong>Extra Credit:</strong> This assignment does not count against " +
      "the total points denominator but adds bonus points to your grade.</p>";
  }
  return html;
}

function syllabusHtml(course: CourseConfig): string {
  const rows = course.groups
    .flatMap((g) => g.assignments)
    .map((a) => {
      const label = a.extraCredit ? `${a.name} <em>(extra credit)</em>` : a.name;
      return `  <li>${label}: ${a.points} pts</li>`;
    })
    .join("\n");

  return `
<h2>${course.name}</h2>
<p>
  All course materials, lectures, project specifications, and homework
  assignments are hosted at
  <a href="${course.siteBase}">${course.siteBase}</a>.
</p>
<p>
  Canvas is used <strong>only for grade tracking</strong>. Submit your work
  according to the instructions on the course website.
</p>
<h3>Grade Breakdown</h3>
<ul>
${rows}
</ul>
<p><strong>Total: ${course.totalPoints} pts</strong> &nbsp;|&nbsp; Final grade = earned points / ${course.totalPoints}</p>
`;
}

// ---------------------------------------------------------------------------
// Canvas API client
// ---------------------------------------------------------------------------

class CanvasClient {
  private readonly base: string;
  private readonly token: string;

  constructor(baseUrl: string, token: string) {
    this.base = baseUrl.replace(/\/$/, "");
    this.token = token;
  }

  private url(path: string): string {
    return `${this.base}/api/v1/${path.replace(/^\//, "")}`;
  }

  private async request<T>(method: string, path: string, body?: unknown): Promise<T> {
    const res = await fetch(this.url(path), {
      method,
      headers: {
        Authorization: `Bearer ${this.token}`,
        "Content-Type": "application/json",
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`${method} ${path} → ${res.status} ${res.statusText}\n${text}`);
    }
    return res.json() as Promise<T>;
  }

  get<T>(path: string): Promise<T> {
    return this.request<T>("GET", path);
  }

  post<T>(path: string, body: unknown): Promise<T> {
    return this.request<T>("POST", path, body);
  }
}

// ---------------------------------------------------------------------------
// Canvas operations
// ---------------------------------------------------------------------------

async function printAccounts(client: CanvasClient): Promise<void> {
  const accounts = await client.get<CanvasAccount[]>("accounts");
  console.log("Available Canvas accounts:\n");
  for (const a of accounts) {
    console.log(`  id=${String(a.id).padStart(6)}  ${a.name}`);
  }
  console.log("\nSet CANVAS_ACCOUNT_ID to your department/sub-account id.");
}

async function createCourse(
  client: CanvasClient,
  accountId: number,
  course: CourseConfig,
): Promise<number> {
  console.log(`Creating course: ${course.name}`);
  const data = await client.post<CanvasCreated>(`accounts/${accountId}/courses`, {
    course: {
      name: course.name,
      course_code: course.code,
      syllabus_body: syllabusHtml(course),
      is_public_to_auth_users: false,
    },
  });
  return data.id;
}

async function createAssignmentGroup(
  client: CanvasClient,
  courseId: number,
  group: AssignmentGroup,
  position: number,
): Promise<number> {
  console.log(`  Group: ${group.name}`);
  const data = await client.post<CanvasCreated>(`courses/${courseId}/assignment_groups`, {
    assignment_group: {
      name: group.name,
      position,
      group_weight: 0, // points-based grading, not percentage-weighted
    },
  });
  return data.id;
}

async function createAssignment(
  client: CanvasClient,
  courseId: number,
  groupId: number,
  assignment: Assignment,
  siteBase: string,
  position: number,
): Promise<void> {
  const extra = assignment.extraCredit ? " [extra credit]" : "";
  console.log(`    ${assignment.name}  (${assignment.points} pts${extra})`);
  await client.post<CanvasCreated>(`courses/${courseId}/assignments`, {
    assignment: {
      name: assignment.name,
      points_possible: assignment.points,
      grading_type: "points",
      submission_types: ["none"], // grade-only; no submission in Canvas
      description: assignmentHtml(assignment, siteBase),
      assignment_group_id: groupId,
      position,
      published: false,           // review before publishing
      omit_from_final_grade: false,
    },
  });
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

interface Env {
  client: CanvasClient;
  accountId: number;
  canvasUrl: string;
}

function loadEnv(): Env {
  const token = process.env.CANVAS_TOKEN;
  const canvasUrl = process.env.CANVAS_URL;
  const accountId = parseInt(process.env.CANVAS_ACCOUNT_ID ?? "1", 10);

  if (!token || !canvasUrl) {
    console.error(
      "Error: required environment variables are not set.\n\n" +
      "  export CANVAS_TOKEN=<token>        # Canvas > Account > Settings > New Access Token\n" +
      "  export CANVAS_URL=https://canvas.boisestate.edu\n\n" +
      "Optionally:\n" +
      "  export CANVAS_ACCOUNT_ID=<id>      # use --list-accounts to find yours"
    );
    process.exit(1);
  }

  return { client: new CanvasClient(canvasUrl, token), accountId, canvasUrl };
}

async function main(): Promise<void> {
  const args = process.argv.slice(2);

  if (args.includes("--list-courses")) {
    const ids = listCourseIds();
    console.log("Available courses:\n");
    for (const id of ids) {
      const c = loadCourse(id);
      console.log(`  ${id.padEnd(12)}  ${c.name}`);
    }
    return;
  }

  if (args.includes("--list-accounts")) {
    const { client } = loadEnv();
    await printAccounts(client);
    return;
  }

  const courseId = args.find((a) => !a.startsWith("--"));
  if (!courseId) {
    const ids = listCourseIds();
    console.error(
      "Usage: npm run canvas:setup -- <course-id>\n\n" +
      `Available courses: ${ids.length ? ids.join(", ") : "(none — add one to scripts/courses/)"}`
    );
    process.exit(1);
  }

  const course = loadCourse(courseId);
  const { client, accountId, canvasUrl } = loadEnv();

  const canvasCourseId = await createCourse(client, accountId, course);
  console.log(`  → id=${canvasCourseId}  ${canvasUrl}/courses/${canvasCourseId}\n`);

  for (let gi = 0; gi < course.groups.length; gi++) {
    const group = course.groups[gi];
    const groupId = await createAssignmentGroup(client, canvasCourseId, group, gi + 1);
    for (let ai = 0; ai < group.assignments.length; ai++) {
      await createAssignment(
        client, canvasCourseId, groupId,
        group.assignments[ai], course.siteBase, ai + 1,
      );
    }
  }

  console.log(
    `\nDone.\n` +
    `  Course URL : ${canvasUrl}/courses/${canvasCourseId}\n` +
    `  Gradebook  : ${canvasUrl}/courses/${canvasCourseId}/gradebook\n\n` +
    "All assignments are unpublished. Review in Canvas, then publish when ready."
  );
}

main().catch((err: unknown) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
