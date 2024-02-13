import { defineConfig, type DefaultTheme } from 'vitepress'
import footnote from 'markdown-it-footnote'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Shane K. Panter",
  description: "Shane's Personal Site",

  markdown: {
    theme: { light: 'github-light', dark: 'github-dark' },
    math: true,
    config: (md) => {
        md.use(footnote)
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
        { text: 'Syllabus', link: 'index'},
      ]
    },
    {
      text: 'Course materials',
      collapsed: false,
      items: [
      	{ text: 'Introduction', link: 'course-introduction'},
	{ text: 'HTML Review' , link: 'html-review'},
	{ text: 'CSS Reveiw' , link: 'css-review'},
	{ text: 'Javascript Review', link: 'javascript-review'},
	{ text: 'Frontend Review', link: 'frontend-review'},
	{ text: 'Backend Review', link: 'backend-review' },
	{ text: 'Accessibility' , link: 'accessibility'},
        { text: 'Project Brainstorm', link: 'project-brainstorm'},
        { text: 'Project Setup', link: 'project-setup'},
	{ text: 'Feature Developemnt', link: 'feature-dev'},
	{ text: 'Final Presentation', link: 'final-presentation'}
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
        { text: 'Projects', link: 'projects/index'},
	{ text: 'Homework', link: 'hw/index'}
      ]
    },
    {
      text: 'Course materials',
      collapsed: false,
      items: [
        { text: 'Course Introduction', link: 'course-introduction'},
        { text: 'C Review', link: 'c-review'},
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