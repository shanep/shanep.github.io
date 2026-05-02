---
next: false
prev: false
---

<script setup>
import schedule from './schedule.json'
</script>

# Schedule

Below is a tentative schedule for the semester that you can use to plan out your work. Hard due
dates are all posted in canvas. While every effort is made to maintain the schedule below minor
changes may be made to accommodate events that are outside of anyone control (snow days, global
pandemics, etc.)

<CourseSchedule :weeks="schedule.weeks" :start-date="schedule.startDate" />
