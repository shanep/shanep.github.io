import DefaultTheme from 'vitepress/theme'
import OfficeHoursLink from './OfficeHoursLink.vue'
import type { Theme } from 'vitepress'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('OfficeHoursLink', OfficeHoursLink)
  }
} satisfies Theme
