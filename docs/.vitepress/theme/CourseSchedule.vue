<script setup lang="ts">
interface Reading {
  text: string
  url?: string
}

interface Day {
  topic: string
  topicUrl?: string
}

interface Assignment {
  name: string
  url?: string
  assignedSlot?: number
  assignedDate?: string  // YYYY-MM-DD, overrides assignedSlot
  assignedDay?: string   // day name e.g. "Friday", overrides assignedSlot
  dueSlot?: number
  dueDate?: string       // YYYY-MM-DD, overrides dueSlot
  dueDay?: string        // day name e.g. "Friday", overrides dueSlot
}

interface Week {
  week: number
  note?: string
  weekUrl?: string
  days?: Day[]
  assignments?: Assignment[]
  readings?: Reading[]
}

interface AssignmentEvent {
  type: 'assigned' | 'due'
  name: string
  url?: string
  date: Date
}

const props = withDefaults(
  defineProps<{ weeks: Week[], startDate: string, meetingOffsets?: number[] }>(),
  { meetingOffsets: () => [] }
)

function weekDate(weekNum: number, slotIndex: number): Date {
  const base = new Date(props.startDate + 'T12:00:00')
  const d = new Date(base)
  d.setDate(d.getDate() + (weekNum - 1) * 7 + (props.meetingOffsets[slotIndex] ?? 0))
  return d
}

function fmt(date: Date): string {
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function dayAbbr(date: Date): string {
  return date.toLocaleDateString('en-US', { weekday: 'short' })
}

function fmtWithDay(date: Date): string {
  return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
}

function weekRange(w: Week): string {
  if (w.days && w.days.length > 0) {
    const first = fmt(weekDate(w.week, 0))
    const last  = fmt(weekDate(w.week, w.days.length - 1))
    return first === last ? first : `${first} – ${last}`
  }
  const base = new Date(props.startDate + 'T12:00:00')
  const weekStart = new Date(base)
  weekStart.setDate(base.getDate() + (w.week - 1) * 7)
  return `Week of ${fmt(weekStart)}`
}

function weekVariant(w: Week): 'break' | 'exam' | 'normal' {
  if (w.note) return w.note.toLowerCase().includes('break') ? 'break' : 'exam'
  const topics = w.days?.map(d => d.topic.toLowerCase()) ?? []
  if (topics.some(t => t.includes('break'))) return 'break'
  if (topics.some(t => t.includes('exam'))) return 'exam'
  return 'normal'
}

const DAY_OF_WEEK: Record<string, number> = {
  sunday: 0, monday: 1, tuesday: 2, wednesday: 3, thursday: 4, friday: 5, saturday: 6,
  sun: 0, mon: 1, tue: 2, wed: 3, thu: 4, fri: 5, sat: 6,
}

function parseDate(s: string): Date {
  return new Date(s + 'T12:00:00')
}

function weekDayDate(weekNum: number, dayName: string): Date {
  const base = new Date(props.startDate + 'T12:00:00')
  const target = DAY_OF_WEEK[dayName.toLowerCase()] ?? 0
  const offset = (target - base.getDay() + 7) % 7
  const d = new Date(base)
  d.setDate(d.getDate() + (weekNum - 1) * 7 + offset)
  return d
}

function resolveDate(weekNum: number, slot?: number, date?: string, day?: string): Date | undefined {
  if (date !== undefined) return parseDate(date)
  if (day  !== undefined) return weekDayDate(weekNum, day)
  if (slot !== undefined) return weekDate(weekNum, slot)
  return undefined
}

function assignmentEvents(w: Week): AssignmentEvent[] {
  const events: AssignmentEvent[] = []
  for (const a of (w.assignments ?? [])) {
    const assigned = resolveDate(w.week, a.assignedSlot, a.assignedDate, a.assignedDay)
    const due      = resolveDate(w.week, a.dueSlot,      a.dueDate,      a.dueDay)
    if (assigned) events.push({ type: 'assigned', name: a.name, url: a.url, date: assigned })
    if (due)      events.push({ type: 'due',      name: a.name, url: a.url, date: due })
  }
  const dueNames = new Set(events.filter(e => e.type === 'due').map(e => e.name))
  return events
    .filter(e => !(e.type === 'assigned' && dueNames.has(e.name)))
    .sort((a, b) => a.date.getTime() - b.date.getTime())
}
</script>

<template>
  <div class="schedule">
    <div
      v-for="w in weeks"
      :key="w.week"
      class="week-card"
      :class="`week-card--${weekVariant(w)}`"
    >
      <div class="week-header">
        <a v-if="w.weekUrl" :href="w.weekUrl" class="week-badge week-badge--link">{{ String(w.week).padStart(2, '0') }}</a>
        <span v-else class="week-badge">{{ String(w.week).padStart(2, '0') }}</span>
        <div class="week-header-text">
          <a v-if="w.weekUrl" :href="w.weekUrl" class="week-label week-label--link">Week {{ w.week }}</a>
          <span v-else class="week-label">Week {{ w.week }}</span>
          <span class="week-range">{{ weekRange(w) }}</span>
        </div>
      </div>

      <p v-if="w.note" class="week-note">
        {{ w.note }}
        <span class="week-note-date">{{ weekRange(w) }}</span>
      </p>

      <template v-else>
        <!-- Topics -->
        <div v-if="w.days?.length" class="day-list">
          <div v-for="(d, di) in w.days" :key="di" class="day-row">
            <div class="day-label">
              <span class="day-pill" :class="di === 0 ? 'day-pill--first' : 'day-pill--second'">{{ dayAbbr(weekDate(w.week, di)) }}</span>
              <span class="day-date">{{ fmt(weekDate(w.week, di)) }}</span>
            </div>
            <span class="day-topic">
              <a v-if="d.topicUrl" :href="d.topicUrl" class="topic-link">{{ d.topic }}</a>
              <span v-else>{{ d.topic }}</span>
            </span>
          </div>
        </div>

        <!-- Assignments -->
        <div v-if="assignmentEvents(w).length" class="section assignments">
          <div class="section-label">📋 Assignments</div>
          <div v-for="(ev, i) in assignmentEvents(w)" :key="i" class="assignment-row">
            <span class="assignment-tag" :class="`assignment-tag--${ev.type}`">
              {{ ev.type === 'assigned' ? 'Assigned' : 'Due' }}
            </span>
            <span class="assignment-name">
              <a v-if="ev.url" :href="ev.url">{{ ev.name }}</a>
              <span v-else>{{ ev.name }}</span>
            </span>
            <span class="assignment-date">{{ fmtWithDay(ev.date) }}</span>
          </div>
        </div>

        <!-- Readings -->
        <div v-if="w.readings?.length" class="section readings">
          <div class="section-label">📖 Readings</div>
          <ul class="readings-list">
            <li v-for="(r, i) in w.readings" :key="i">
              <a v-if="r.url" :href="r.url" target="_blank" rel="noopener noreferrer">{{ r.text }}</a>
              <span v-else>{{ r.text }}</span>
            </li>
          </ul>
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped>
.schedule {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
  gap: 1rem;
  margin-top: 1.5rem;
}

/* Card */
.week-card {
  border: 1px solid var(--vp-c-divider);
  border-radius: 10px;
  background: var(--vp-c-bg-soft);
  padding: 1rem 1.2rem;
  transition: box-shadow 0.2s, transform 0.2s;
  border-left: 4px solid var(--vp-c-brand-1);
}

.week-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.week-card--break {
  border-left-color: var(--vp-c-text-3);
  opacity: 0.65;
}

.week-card--exam {
  border-left-color: var(--vp-c-warning-1);
}

/* Header */
.week-header {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  margin-bottom: 0.8rem;
}

.week-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.1rem;
  height: 2.1rem;
  border-radius: 50%;
  background: var(--vp-c-brand-1);
  color: #fff;
  font-size: 0.7rem;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  flex-shrink: 0;
}

.week-card--break .week-badge { background: var(--vp-c-text-3); }
.week-card--exam  .week-badge { background: var(--vp-c-warning-1); }

.week-header-text {
  display: flex;
  flex-direction: column;
  gap: 0.05rem;
}

.week-label {
  font-weight: 600;
  font-size: 0.88rem;
  color: var(--vp-c-text-1);
  line-height: 1.2;
}

.week-badge--link {
  text-decoration: none;
  cursor: pointer;
}

.week-badge--link:hover {
  background: var(--vp-c-brand-2);
}

.week-label--link {
  text-decoration: none;
  color: var(--vp-c-text-1);
}

.week-label--link:hover {
  color: var(--vp-c-brand-1);
  text-decoration: underline;
}

.week-range {
  font-size: 0.75rem;
  color: var(--vp-c-text-3);
  font-variant-numeric: tabular-nums;
}

/* Note weeks (Final Exam etc) */
.week-note {
  margin: 0;
  font-weight: 600;
  font-size: 0.95rem;
  color: var(--vp-c-warning-1);
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.week-note-date {
  font-weight: 400;
  font-size: 0.78rem;
  color: var(--vp-c-text-3);
}

/* Day rows */
.day-list {
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
  margin-bottom: 0.8rem;
}

.day-row {
  display: flex;
  align-items: center;
  gap: 0.55rem;
  font-size: 0.875rem;
}

.day-label {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  flex-shrink: 0;
  width: 6.5rem;
}

.day-pill {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.1rem;
  padding: 0.15rem 0;
  border-radius: 4px;
  font-size: 0.68rem;
  font-weight: 700;
  letter-spacing: 0.03em;
  flex-shrink: 0;
}

.day-pill--first {
  background: color-mix(in srgb, var(--vp-c-brand-1) 15%, transparent);
  color: var(--vp-c-brand-1);
}

.day-pill--second {
  background: color-mix(in srgb, var(--vp-c-tip-1) 15%, transparent);
  color: var(--vp-c-tip-1);
}

.day-date {
  font-size: 0.75rem;
  color: var(--vp-c-text-3);
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
}

.day-topic {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: var(--vp-c-text-1);
}

.topic-link {
  color: var(--vp-c-text-1);
  text-decoration: none;
}

.topic-link:hover {
  color: var(--vp-c-brand-1);
  text-decoration: underline;
}

/* Shared section chrome */
.section {
  padding-top: 0.65rem;
}

.day-list + .section,
.section + .section {
  border-top: 1px solid var(--vp-c-divider);
  margin-top: 0.2rem;
}

.section-label {
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--vp-c-text-3);
  margin-bottom: 0.4rem;
}

/* Assignments */
.assignment-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8rem;
  padding: 0.18rem 0;
}

.assignment-tag {
  flex-shrink: 0;
  font-size: 0.65rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  padding: 0.1rem 0.45rem;
  border-radius: 999px;
  width: 4.5rem;
  text-align: center;
}

.assignment-tag--assigned {
  background: color-mix(in srgb, var(--vp-c-brand-1) 15%, transparent);
  color: var(--vp-c-brand-1);
}

.assignment-tag--due {
  background: color-mix(in srgb, var(--vp-c-warning-1) 15%, transparent);
  color: var(--vp-c-warning-1);
}

.assignment-name {
  flex: 1;
  font-weight: 500;
  color: var(--vp-c-text-1);
}

.assignment-name a {
  color: inherit;
  text-decoration: none;
}

.assignment-name a:hover {
  color: var(--vp-c-brand-1);
  text-decoration: underline;
}

.assignment-date {
  flex-shrink: 0;
  font-size: 0.75rem;
  color: var(--vp-c-text-3);
  font-variant-numeric: tabular-nums;
}

/* Readings */
.readings-list {
  margin: 0;
  padding-left: 1.1rem;
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.readings-list li {
  font-size: 0.8rem;
  color: var(--vp-c-text-2);
  line-height: 1.4;
}

.readings-list a {
  color: var(--vp-c-text-2);
  text-decoration: none;
}

.readings-list a:hover {
  color: var(--vp-c-brand-1);
  text-decoration: underline;
}
</style>
