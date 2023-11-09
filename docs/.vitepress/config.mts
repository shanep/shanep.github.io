import { generateSidebar } from 'vitepress-sidebar';

// https://vitepress.dev/reference/site-config
export default {
  title: "Shane K. Panter",
  description: "Shane's Personal Site",

  markdown: {
    theme: { light: 'github-light', dark: 'github-dark' }
  },

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


    //https://github.com/jooy2/vitepress-sidebar#options
    sidebar: generateSidebar([
      {
        rootGroupText: 'Syllabus',
        rootGroupLink: '/',
        documentRootPath: 'docs',
        scanStartPath: 'cs117',
        resolvePath: '/cs117/',
        useTitleFromFileHeading: true,
        sortMenusByFrontmatterOrder: true,
      },
      {
        rootGroupText: 'Syllabus',
        rootGroupLink: '/',
        documentRootPath: 'docs',
        scanStartPath: 'cs155',
        resolvePath: '/cs155/',
        useTitleFromFileHeading: true,
        sortMenusByFrontmatterOrder: true,
      },
      {
        rootGroupText: 'Syllabus',
        rootGroupLink: '/',
        documentRootPath: 'docs',
        scanStartPath: 'cs208',
        resolvePath: '/cs208/',
        useTitleFromFileHeading: true,
        sortMenusByFrontmatterOrder: true,
      },
      {
        rootGroupText: 'Syllabus',
        rootGroupLink: '/',
        documentRootPath: 'docs',
        scanStartPath: 'cs333',
        resolvePath: '/cs333/',
        useTitleFromFileHeading: true,
        sortMenusByFrontmatterOrder: true,
      },
      {
        rootGroupText: 'Syllabus',
        rootGroupLink: '/',
        documentRootPath: 'docs',
        scanStartPath: 'cs452',
        resolvePath: '/cs452/',
        useTitleFromFileHeading: true,
        sortMenusByFrontmatterOrder: true,
      },
      {
        documentRootPath: 'docs',
        scanStartPath: 'teaching',
        resolvePath: '/teaching/',
        useTitleFromFileHeading: true,
      }
    ]),

    socialLinks: [
      { icon: 'github', link: 'https://github.com/shanep' }
    ]
  }
}