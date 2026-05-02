import DefaultTheme from 'vitepress/theme'
// @ts-ignore
import './style.css'
import OfficeHoursLink from './OfficeHoursLink.vue'
import CourseSchedule from './CourseSchedule.vue'
import SlideView from './SlideView.vue'
import type { Theme } from 'vitepress'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('OfficeHoursLink', OfficeHoursLink)
    app.component('CourseSchedule', CourseSchedule)
    app.component('SlideView', SlideView)
  }
} satisfies Theme
