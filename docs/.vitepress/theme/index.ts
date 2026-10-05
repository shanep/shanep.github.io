import DefaultTheme from 'vitepress/theme'
// Newer TypeScript checks side-effect imports by default and nothing here
// declares a type for a .css file (Vite handles the import at build time), so
// the editor flags this line without the ignore.
// @ts-ignore
import './style.css'
import OfficeHoursLink from './OfficeHoursLink.vue'
import CourseSchedule from './CourseSchedule.vue'
import CanvasModules from './CanvasModules.vue'
import SlideView from './SlideView.vue'
import type { Theme } from 'vitepress'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('OfficeHoursLink', OfficeHoursLink)
    app.component('CourseSchedule', CourseSchedule)
    app.component('CanvasModules', CanvasModules)
    app.component('SlideView', SlideView)
  }
} satisfies Theme
