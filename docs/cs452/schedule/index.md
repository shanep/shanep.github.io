---
next: false
prev: false
---

<script setup>
import schedule from './schedule.json'
</script>

# Schedule - Fall 2025

<CourseSchedule :weeks="schedule.weeks" :start-date="schedule.startDate" :meeting-offsets="schedule.meetingOffsets" />
