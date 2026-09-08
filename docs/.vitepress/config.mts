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

const drafts = draftPages()
if (drafts.length > 0) {
  console.log(`vitepress: skipping ${drafts.length} draft page(s): ${drafts.join(', ')}`)
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
  srcExclude: drafts,
  markdown: {
    theme: { light: 'github-light', dark: 'github-dark' },
    config: (md) => {
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
        { text: 'Midterm Review',                   link: 'notes/midterm-review' },
        { text: '4. Network Layer: Data Plane',     link: 'notes/ch04-network-data' },
        { text: '5. Network Layer: Control Plane',  link: 'notes/ch05-network-control' },
        { text: '6. The Link Layer and LANs',       link: 'notes/ch06-link' },
        { text: '7. Wireless and Mobile Networks',  link: 'notes/ch07-wireless' },
        { text: '8. Network Security',              link: 'notes/ch08-security' },
        { text: 'Final Review',                     link: 'notes/final-review' },
      ]
    },
    {
      text: 'In Class Activities',
      collapsed: false,
      items: [
        { text: 'A1 - Get on the Box',              link: 'activities/a1-onyx-devbox' },
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
      text: 'Exams',
      collapsed: true,
      items: [
        { text: 'Midterm Study Guide', link: 'assignments/midterm-exam-guide' },
        { text: 'Final Study Guide',   link: 'assignments/final-exam-guide' },
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