import { defineConfig, type DefaultTheme } from 'vitepress'
import footnote from 'markdown-it-footnote'
import container from 'markdown-it-container'
import { globSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

// Course files carry `draft: true` in their frontmatter while they are being
// written. `edutools` reads the same flag to keep them out of Canvas; here it
// keeps them off the website, so a draft is invisible in both places at once.
//
// Excluded pages are real dead links, and ignoreDeadLinks is false on purpose,
// so a draft that is still linked from an index page fails the build. That is
// the intended behaviour: it is the reminder to unlink it.
function draftPages(): string[] {
  const root = join(import.meta.dirname, '..')
  return globSync('**/*.md', { cwd: root })
    .filter((rel) => /^---\r?\n[\s\S]*?^draft[ \t]*:[ \t]*(true|yes|on)[ \t]*$/im
      .test(readFileSync(join(root, rel), 'utf-8')))
    .sort()
}

// VitePress skips its dead-link check for links ending in an extension it
// recognises as a downloadable file (pdf, png, csv and about seventy others)
// and treats everything else as a page route. CS331 hands out Python scripts,
// a C file and two log files from docs/public/cs331/data/, so without this
// every link to one of them is reported as a dead page. VITE_EXTRA_EXTENSIONS
// is the documented way to extend that list; it has to be set before the first
// link is resolved, which is why it sits here rather than in the config object.
//
// This exempts those links from the check rather than validating them, exactly
// as VitePress already does for the PDFs under docs/public/cs425/. A typo in a
// `.py` link will not fail the build.
//
// ignoreDeadLinks stays false: drafts must still break the build when linked.
process.env.VITE_EXTRA_EXTENSIONS = 'py,c,log'

const drafts = draftPages()
if (drafts.length > 0) {
  console.log(`vitepress: skipping ${drafts.length} draft page(s): ${drafts.join(', ')}`)
}

// A quiz bank is the question and its answer in one file: `edutools push` reads
// both and builds the Canvas quiz from them. The website gets the questions and
// never the answers, so a student can see what a quiz covers while the key stays
// in Canvas.
//
// An answer is a paragraph opening with `*Answer:*`, and its rationale wraps over
// as many lines as it needs, so the rule drops from that line to the blank line
// that ends the paragraph. The `## Canvas import notes` section, which says which
// items are multiple-answer, is already removed by INSTRUCTOR_MARKER below.
//
// Marking the files `draft: true` instead would also keep them out of Canvas,
// which is the one place they have to reach.
function stripQuizAnswers(src: string): string {
  if (!src.includes('*Answer:*')) return src
  const kept: string[] = []
  let inAnswer = false
  for (const line of src.split('\n')) {
    if (inAnswer) {
      if (line.trim() !== '') continue
      inAnswer = false
    } else if (line.startsWith('*Answer:*')) {
      inAnswer = true
      continue
    }
    kept.push(line)
  }
  return kept.join('\n')
}

// A course file can carry a section written for whoever is teaching it rather
// than for the class. `edutools` already drops those before pushing to Canvas;
// without the same rule here they stayed on the public website, which is the
// one place they must not be.
//
// Deliberately the same rule as edutools/publish.py strip_instructor_sections:
// split the file into `## ` sections and drop any whose body carries the marker
// line, so the heading can be called anything and one marker hides a section in
// both places. Keep the two in step if either changes.
const INSTRUCTOR_MARKER = 'Instructor note, not shown to students'

function stripInstructorSections(src: string): string {
  if (!src.includes(INSTRUCTOR_MARKER)) return src
  return src
    .split(/^(?=## )/m)
    .filter((block) => !block.includes(INSTRUCTOR_MARKER))
    .join('')
}

declare module 'vitepress' {
  namespace DefaultTheme {
    interface Config {
      officeHoursUrl?: string
    }
  }
}

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Shane K. Panter",
  description: "Shane's Personal Site",
  ignoreDeadLinks: false,
  // Instructor-only pages, shared by every course from shared/instructor-resources/
  // through a symlink in each course directory. They go to Canvas, never to the site.
  srcExclude: [...drafts, '**/instructor-resources/**'],
  markdown: {
    theme: { light: 'github-light', dark: 'github-dark' },
    config: (md) => {
        // Runs on the raw markdown, before anything is parsed, so the section
        // never reaches the page, the outline, or the search index.
        md.core.ruler.before('normalize', 'strip_instructor_sections', (state: any) => {
          state.src = stripQuizAnswers(stripInstructorSections(state.src))
        })
        // @ts-ignore
        md.use(footnote)
        md.use(container, 'cols', {
          render: (tokens: any[], idx: number) =>
            tokens[idx].nesting === 1 ? '<div class="cols">\n' : '</div>\n'
        })
        md.use(container, 'col', {
          render: (tokens: any[], idx: number) =>
            tokens[idx].nesting === 1 ? '<div class="col">\n' : '</div>\n'
        })
    }
  },
  cleanUrls: true,

  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
    ],
    lastUpdated: {
      text: 'Updated at',
      formatOptions: {
        dateStyle: 'full',
        timeStyle: 'medium'
      }
    },
    search: {
      provider: 'local'
    },

    officeHoursUrl: 'https://calendar.app.google/3NEb1xLYYwZRejY18',

    editLink: {
      pattern: 'https://github.com/shanep/shanep.github.io/edit/master/docs/:path'
    },

    sidebar: {
      '/cs117/': { base: '/cs117/', items: cs117() },
      '/cs155/': { base: '/cs155/', items: cs155() },
      '/cs208/': { base: '/cs208/', items: cs208() },
      '/cs331/': { base: '/cs331/', items: cs331() },
      '/cs333/': { base: '/cs333/', items: cs333() },
      '/cs408/': { base: '/cs408/', items: cs408() },
      '/cs425/': { base: '/cs425/', items: cs425() },
      '/cs452/': { base: '/cs452/', items: cs452() },
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/shanep' }
    ],
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2023-present Shane K. Panter'
    },
  }
});

function cs117(): DefaultTheme.SidebarItem[] {
  return [
    {
      text: 'CS117',
      items: [
        { text: 'Syllabus', link: 'index'},
        { text: 'Grading Rubric', link: 'grading-rubric' },
      ]
    }
  ]
}
function cs155(): DefaultTheme.SidebarItem[] {
  return [
    {
      text: 'CS155',
      items: [
        { text: 'Syllabus', link: 'index'}
      ]
    },
    {
      text: 'Homework',
      items: [
      { text: 'Configure GitHub', link: 'hw/hw1'},
      { text: 'Submit a Patch', link: 'hw/hw2'},
      { text: 'Create a GitHub Page', link: 'hw/hw3'}
      ]
    },
    {
      text: 'Course materials',
      items: [
        { text: 'Course Introduction', link: 'course-introduction' },
        { text: 'Git Introduction', link: 'git-introduction' },
        { text: 'Git Basics', link: 'git-basics' },
        { text: 'Git Branching and Merging', link: 'git-branching-and-merging' },
     	{ text: 'Github', link: 'github' },
      ]
    }
  ]
}
function cs208(): DefaultTheme.SidebarItem[] {
  return [
    {
      text: 'CS208',
      items: [
        { text: 'Syllabus', link: 'index'},
        { text: 'Grading Rubric', link: 'grading-rubric' },
      ]
    },
    {
      text: 'Course materials',
      collapsed: false,
      items: [
        { text: 'Course Introduction', link: 'course-introduction' },
        { text: 'HTML and CSS Introduction', link: 'html-css-introduction' },
        { text: 'JavaScript Introduction', link: 'javascript-introduction' },
        { text: 'Full Stack Introduction', link: 'fullstack-introduction' },
        { text: 'Relational Databases and SQL', link: 'relational-databases-and-sql' },
        { text: 'Agile Development', link: 'agile-development' },
      ]
    }
  ]
}
function cs331(): DefaultTheme.SidebarItem[] {
  return [
    {
      text: 'CS331',
      items: [
        { text: 'Home',                   link: 'home' },
        { text: 'Syllabus',               link: 'index' },
        { text: 'Schedule',               link: 'schedule/index' },
        { text: 'Instructor Information', link: 'instructor' },
        { text: 'Objectives',             link: 'objectives' },
        { text: 'Resources',              link: 'resources' },
        { text: 'Data Files',             link: 'data/index' },
      ]
    },
    {
      text: 'Getting Started',
      collapsed: false,
      items: [
        { text: 'Getting Started Overview',    link: 'getting-started' },
        { text: '0.01 Communicating Online',   link: 'communicating' },
      ]
    },
    {
      text: 'Course Resources',
      collapsed: true,
      items: [
        { text: 'Canvas Resources',           link: 'course-resources/canvas-resources' },
        { text: 'Online Success Resources',   link: 'course-resources/online-success-resources' },
        { text: 'Technology Support',         link: 'course-resources/technology-support' },
        { text: 'Course Questions',           link: 'course-resources/course-questions' },
      ]
    },
    {
      text: 'Weekly Modules',
      collapsed: false,
      items: [
        { text: '1. What is Cyber Security?', link: 'notes/week-01-overview', collapsed: true, items: [{ text: '1.01 Readings and Notes', link: 'notes/week-01-what-is-cyber-security' }] },
        { text: '2. Principles and Human Factors', link: 'notes/week-02-overview', collapsed: true, items: [{ text: '2.01 Readings and Notes', link: 'notes/week-02-security-principles-and-human-factors' }] },
        { text: '3. Law, Ethics, and Privacy', link: 'notes/week-03-overview', collapsed: true, items: [{ text: '3.01 Readings and Notes', link: 'notes/week-03-law-ethics-and-privacy' }] },
        { text: '4. Risk and Threat Modeling', link: 'notes/week-04-overview', collapsed: true, items: [{ text: '4.01 Readings and Notes', link: 'notes/week-04-risk-and-threat-modeling' }] },
        { text: '5. Authentication and Credentials', link: 'notes/week-05-overview', collapsed: true, items: [{ text: '5.01 Readings and Notes', link: 'notes/week-05-authentication-and-credentials' }] },
        { text: '6. Authorisation and Access', link: 'notes/week-06-overview', collapsed: true, items: [{ text: '6.01 Readings and Notes', link: 'notes/week-06-authorisation-and-access-control' }] },
        { text: '7. Symmetric Cryptography', link: 'notes/week-07-overview', collapsed: true, items: [{ text: '7.01 Readings and Notes', link: 'notes/week-07-symmetric-cryptography' }] },
        { text: '8. Public-Key Cryptography', link: 'notes/week-08-overview', collapsed: true, items: [{ text: '8.01 Readings and Notes', link: 'notes/week-08-public-key-cryptography' }] },
        { text: '9. Review and Midterm', link: 'notes/week-09-overview', collapsed: true, items: [{ text: '9.01 Readings and Notes', link: 'notes/week-09-review-and-midterm' }] },
        { text: '10. Keys, Certificates, and PKI', link: 'notes/week-10-overview', collapsed: true, items: [{ text: '10.01 Readings and Notes', link: 'notes/week-10-keys-certificates-and-pki' }] },
        { text: '11. Network Security', link: 'notes/week-11-overview', collapsed: true, items: [{ text: '11.01 Readings and Notes', link: 'notes/week-11-network-security' }] },
        { text: '12. Malware and Adversaries', link: 'notes/week-12-overview', collapsed: true, items: [{ text: '12.01 Readings and Notes', link: 'notes/week-12-malware-and-adversarial-behaviours' }] },
        { text: '13. Software Security', link: 'notes/week-13-overview', collapsed: true, items: [{ text: '13.01 Readings and Notes', link: 'notes/week-13-software-security-and-assurance' }] },
        { text: '14. Web Security and Injection', link: 'notes/week-14-overview', collapsed: true, items: [{ text: '14.01 Readings and Notes', link: 'notes/week-14-web-security-and-injection' }] },
        { text: '15. Security Operations', link: 'notes/week-15-overview', collapsed: true, items: [{ text: '15.01 Readings and Notes', link: 'notes/week-15-security-operations-and-incident-response' }] },
      ]
    },
    {
      text: 'Labs',
      collapsed: false,
      items: [
        { text: 'Lab 0 - Course Setup',              link: 'assignments/lab-00-course-setup' },
        { text: 'Lab 1 - Principles Audit',          link: 'assignments/lab-01-security-principles-audit' },
        { text: 'Lab 2 - Threat Model',              link: 'assignments/lab-02-threat-model' },
        { text: 'Lab 3 - Access Control Matrix',     link: 'assignments/lab-03-access-control-matrix' },
        { text: 'Lab 4 - Symmetric Encryption',      link: 'assignments/lab-04-symmetric-encryption' },
        { text: 'Lab 5 - Hashing and Signatures',    link: 'assignments/lab-05-hashing-and-signatures' },
        { text: 'Lab 6 - Certificates and TLS',      link: 'assignments/lab-06-certificates-and-tls' },
        { text: 'Lab 7 - Malware Triage',            link: 'assignments/lab-07-malware-triage' },
        { text: 'Lab 8 - Memory Safety',             link: 'assignments/lab-08-memory-safety-and-assurance' },
        { text: 'Lab 9 - SQL Injection',             link: 'assignments/lab-09-sql-injection' },
        { text: 'Lab 10 - Log Analysis',             link: 'assignments/lab-10-log-analysis-and-incident-memo' },
      ]
    },
    {
      text: 'Exams',
      collapsed: false,
      items: [
        { text: 'Midterm Exam Guide', link: 'assignments/midterm-exam-guide' },
        { text: 'Final Exam Guide',   link: 'assignments/final-exam-guide' },
      ]
    },
    {
      // The answers are stripped from these pages by stripQuizAnswers; the quiz
      // itself is taken in Canvas.
      text: 'Quizzes',
      collapsed: true,
      items: [
        { text: 'Diagnostic (ungraded)',     link: 'quizzes/quiz-00-diagnostic' },
        { text: 'Quiz 1 - Foundations',      link: 'quizzes/quiz-01-foundations' },
        { text: 'Quiz 2 - Authentication',   link: 'quizzes/quiz-02-authentication' },
        { text: 'Quiz 3 - Cryptography',     link: 'quizzes/quiz-03-cryptography' },
        { text: 'Quiz 4 - Network Security', link: 'quizzes/quiz-04-network-security' },
        { text: 'Quiz 5 - Software and Web', link: 'quizzes/quiz-05-software-and-web' },
      ]
    },
    {
      text: 'Discussions',
      collapsed: true,
      items: [
        { text: 'D1 - Introductions',        link: 'discussions/d01-introductions-and-security-mindset' },
        { text: 'D2 - Ethics and Privacy',   link: 'discussions/d02-ethics-and-privacy-case' },
        { text: 'D3 - Authentication Policy', link: 'discussions/d03-authentication-policy-critique' },
        { text: 'D4 - Security in the News', link: 'discussions/d04-network-security-in-the-news' },
        { text: 'D5 - A Current Failure',    link: 'discussions/d05-current-security-failure' },
        { text: 'D6 - Final Reflection',     link: 'discussions/d06-final-reflection' },
      ]
    }
  ]
}
function cs333(): DefaultTheme.SidebarItem[] {
  return [
    {
      text: 'CS333',
      items: [
        { text: 'Syllabus', link: 'index'},
      ]
    },
    {
      text: 'Course materials',
      collapsed: false,
      items: [
        { text: 'Research Paper', link: 'research-paper'},
        { text: 'Presentation', link: 'presentation'},
      ]
    }
  ]
}

function cs408(): DefaultTheme.SidebarItem[] {
  return [
    {
      text: 'CS408',
      items: [
        { text: 'Syllabus',        link: 'index' },
        { text: 'Schedule',        link: 'schedule/index' },
        { text: 'Instructor Guide', link: 'notes/instructor-guide' },
      ]
    },
    {
      text: 'Week by Week',
      collapsed: false,
      items: [
        { text: 'Week 1 — Get Set Up',           link: 'notes/week01' },
        { text: 'Week 2 — First Pull Request',   link: 'notes/week02' },
        { text: 'Week 3 — Sprint 1 Kickoff',     link: 'notes/week03' },
        { text: 'Week 4 — Sprint 1 Delivery',    link: 'notes/week04' },
        { text: 'Week 5 — Sprint 2 Kickoff',     link: 'notes/week05' },
        { text: 'Week 6 — Sprint 2 Delivery',    link: 'notes/week06' },
        { text: 'Week 7 — Sprint 3 Kickoff',     link: 'notes/week07' },
        { text: 'Week 8 — Sprint 3 Delivery',    link: 'notes/week08' },
        { text: 'Week 9 — Sprint 4 Kickoff',     link: 'notes/week09' },
        { text: 'Week 10 — Sprint 4 Delivery',   link: 'notes/week10' },
        { text: 'Week 11 — Sprint 5 Kickoff',    link: 'notes/week11' },
        { text: 'Week 12 — Sprint 5 Delivery',   link: 'notes/week12' },
        { text: 'Week 13 — Sprint 6 Kickoff',    link: 'notes/week13' },
        { text: 'Week 14 — Sprint 6 Delivery',   link: 'notes/week14' },
        { text: 'Week 15 — Hardening',           link: 'notes/week15' },
        { text: 'Week 16 — Demo Review',         link: 'notes/week16' },
      ]
    },
    {
      text: 'Sprint Reference',
      collapsed: true,
      items: [
        { text: 'Onboarding',          link: 'notes/onboarding' },
        { text: 'Sprint 1: Core CRUD', link: 'notes/sprint1' },
        { text: 'Sprint 2: Auth',      link: 'notes/sprint2' },
        { text: 'Sprint 3: Search',    link: 'notes/sprint3' },
        { text: 'Sprint 4: Admin',     link: 'notes/sprint4' },
        { text: 'Sprint 5: Email',     link: 'notes/sprint5' },
        { text: 'Sprint 6: Analytics', link: 'notes/sprint6' },
        { text: 'Hardening',           link: 'notes/hardening' },
      ]
    }
  ]
}
function cs425(): DefaultTheme.SidebarItem[] {
  return [
    {
      text: 'CS425',
      items: [
        { text: 'Syllabus',     link: 'index' },
        { text: 'Schedule',     link: 'schedule/index' },
        { text: 'Objectives',   link: 'objectives' },
        { text: 'Resources',    link: 'resources' },
        { text: 'Glossary',     link: 'glossary' },
        { text: 'Projects',     link: 'assignments/index' },
        { text: 'Activities',   link: 'activities/index' },
      ]
    },
    {
      text: 'Lecture Notes',
      collapsed: false,
      items: [
        { text: 'Course Introduction',              link: 'notes/course-introduction' },
        { text: '1. Networks and the Internet',     link: 'notes/ch01-internet' },
        { text: '2. The Application Layer',         link: 'notes/ch02-application' },
        { text: '3. The Transport Layer',           link: 'notes/ch03-transport' },
        { text: '4. Network Layer: Data Plane',     link: 'notes/ch04-network-data' },
        { text: '5. Network Layer: Control Plane',  link: 'notes/ch05-network-control' },
        { text: '6. The Link Layer and LANs',       link: 'notes/ch06-link' },
        { text: '7. Wireless and Mobile Networks',  link: 'notes/ch07-wireless' },
        { text: '8. Network Security',              link: 'notes/ch08-security' },
      ]
    },
    {
      text: 'In Class Activities',
      collapsed: false,
      items: [
        { text: 'A1 - Speaking the App Layer',      link: 'activities/a1-application-layer' },
        { text: 'A2 - Stop Typing Your Password',   link: 'activities/a2-stop-typing-your-password' },
        { text: 'A3 - curl, nc, and ping',          link: 'activities/a3-curl-nc-ping' },
        { text: 'A4 - Connectivity Triage',         link: 'activities/a4-connectivity-triage' },
        { text: 'A5 - Name the Layer',              link: 'activities/a5-name-the-layer' },
      ]
    },
    {
      text: 'Projects',
      collapsed: false,
      items: [
        { text: 'Grading Rubric',                   link: 'assignments/grading-rubric' },
        { text: 'P0 - Compile, Test, Debug',        link: 'assignments/p0' },
        { text: 'P1 - Simple Mail Client',          link: 'assignments/p1' },
        { text: 'P2 - Reliable Data Transfer',      link: 'assignments/p2' },
        { text: 'P3 - Subnetting and Forwarding',   link: 'assignments/p3' },
        { text: 'P4 - Packet Capture and Analysis', link: 'assignments/p4' },
      ]
    },
    {
      text: 'Extra Credit',
      collapsed: true,
      items: [
        { text: 'Course Evaluation',      link: 'extra-credit/ec-evaluation' },
        { text: 'Typos and Bugs',         link: 'extra-credit/ec-typos' },
        { text: 'General Extra Credit',   link: 'extra-credit/ec-general' },
      ]
    }
  ]
}
function cs452(): DefaultTheme.SidebarItem[] {
  return [
    {
      text: 'CS452',
      items: [
        { text: 'Syllabus',     link: 'index' },
        { text: 'Schedule',     link: 'schedule/index' },
        { text: 'Assignments',  link: 'assignments/index' },
      ]
    },
    {
      text: 'Lecture Notes',
      collapsed: false,
      items: [
        { text: 'Course Introduction',    link: 'notes/course-introduction' },
        { text: 'C Review',               link: 'notes/c-review' },
        { text: 'OS Introduction',        link: 'notes/intro' },
        { text: 'The Process',            link: 'notes/cpu-intro' },
        { text: 'Process API',            link: 'notes/cpu-api' },
        { text: 'Limited Direct Execution', link: 'notes/cpu-mechanisms' },
        { text: 'Scheduling',             link: 'notes/cpu-sched' },
        { text: 'Address Spaces',         link: 'notes/vm-intro' },
        { text: 'Free Space Management',  link: 'notes/vm-freespace' },
        { text: 'Paging',                 link: 'notes/vm-paging' },
        { text: 'Concurrency',            link: 'notes/threads-intro' },
        { text: 'Locks',                  link: 'notes/threads-locks' },
        { text: 'Locked Data Structures', link: 'notes/threads-locks-usage' },
        { text: 'Condition Variables',    link: 'notes/threads-cv' },
        { text: 'Semaphores',             link: 'notes/threads-sema' },
        { text: 'Concurrency Bugs',       link: 'notes/threads-bugs' },
        { text: 'Event Based Concurrency', link: 'notes/threads-events' },
        { text: 'I/O Devices',            link: 'notes/file-devices' },
        { text: 'Files and Directories',  link: 'notes/file-intro' },
        { text: 'Security',               link: 'notes/security-intro' },
      ]
    }
  ]
}