import { defineConfig, type DefaultTheme } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Shane K. Panter",
  description: "Shane's Personal Site",

  markdown: {
    theme: { light: 'github-light', dark: 'github-dark' }
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

    editLink: {
      pattern: 'https://github.com/shanep/shanep.github.io/edit/master/docs/:path'
    },

    sidebar: {
      '/cs117/': { base: '/cs117/', items: cs117() },
      '/cs155/': { base: '/cs155/', items: cs155() },
      '/cs208/': { base: '/cs208/', items: cs208() },
      '/cs333/': { base: '/cs333/', items: cs333() },
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
        { text: 'Syllabus', link: 'index'},
      ]
    },
    {
      text: 'Course materials',
      items: [
        { text: 'Course Introduction', link: 'course-introduction' },
        { text: 'Git Introduction', link: 'git-introduction' },
        { text: 'Git Basics', link: 'git-basics' },
        { text: 'Git Branching and Merging', link: 'git-branching-and-merging' },
        { text: 'Configure Github', link: 'configure-github' },
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
function cs452(): DefaultTheme.SidebarItem[] {
  return [
    {
      text: 'CS452',
      items: [
        { text: 'Syllabus', link: 'index'},
        { text: 'Grading Rubric', link: 'grading-rubric' },
      ]
    },
    {
      text: 'Projects',
      items: [
        { text: 'Project 0', link: 'p0'},
        { text: 'Project 1', link: 'p1'},
        { text: 'Project 2', link: 'p2'},
        { text: 'Project 3', link: 'p3'},
        { text: 'Project 4', link: 'p4'},
        { text: 'Project 5', link: 'p5'},
        { text: 'Project 6', link: 'p6'},
      ]
    },
    {
      text: 'Course materials',
      collapsed: false,
      items: [
        { text: 'Course Introduction', link: 'course-introduction'},
        { text: 'C Review', link: 'c-review'},
        { text: 'Testing', link: 'testing'},
        { text: 'Libraries', link: 'libraries'},
        { text: 'OS Introduction', link: 'intro'},
        { text: 'The Process', link: 'cpu-intro'},
        { text: 'Process API', link: 'cpu-api'},
        { text: 'Limited Direct Execution', link: 'cpu-mechanisms'},
        { text: 'Scheduling', link: 'cpu-sched'},
        { text: 'Address Spaces', link: 'vm-intro'},
        { text: 'Free Space Management', link: 'vm-freespace'},
        { text: 'Paging', link: 'vm-paging'},
        { text: 'Concurrency', link: 'threads-intro'},
        { text: 'Locks', link: 'threads-locks'},
        { text: 'Locked Data Structures', link: 'threads-locks-usage'},
        { text: 'Condition Variables', link: 'threads-cv'},
        { text: 'Semaphores', link: 'threads-sema'},
        { text: 'Concurrency Bugs', link: 'threads-bugs'},
        { text: 'Event Based Concurrency', link: 'threads-events'},
        { text: 'I/O Devices', link: 'file-devices'},
        { text: 'Files and Directories', link: 'file-intro'},
        { text: 'Security', link: 'security-intro'},
      ]
    }
  ]
}