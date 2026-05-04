import { defineConfig, type DefaultTheme } from 'vitepress'
import footnote from 'markdown-it-footnote'
import container from 'markdown-it-container'

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