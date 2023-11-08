import { defineConfig } from 'vitepress'
import { generateSidebar } from 'vitepress-sidebar';

// https://vitepress.dev/reference/site-config
export default {
  title: "Shane K. Panter",
  description: "Shane's Personal Site",
  lastUpdated: true,
  markdown: {
    theme: {light: 'github-light', dark: 'github-dark' }
  },

  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
    ],

    //https://github.com/jooy2/vitepress-sidebar#options
    sidebar: generateSidebar([
      {
        rootGroupText: 'Syllabus',
        rootGroupLink: '/',
        documentRootPath: 'docs',
        scanStartPath: 'cs155',
        resolvePath: '/cs155/',
        useTitleFromFrontmatter: true,
        sortMenusByFrontmatterOrder: true,
      }
    ]),

    socialLinks: [
      { icon: 'github', link: 'https://github.com/shanep/shanep.github.io' }
    ]
  }
}