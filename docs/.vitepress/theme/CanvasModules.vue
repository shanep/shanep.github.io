<script setup lang="ts">
// Renders docs/<course>/schedule/modules.json, which `edutools outline` writes
// from canvas.toml, so this page shows the same modules, items, order, due
// dates and points that Canvas shows under Modules after a push.

interface Item {
  kind: 'page' | 'assignment' | 'discussion' | 'quiz' | 'file'
  title: string
  path?: string        // repo path without .md; empty for a Canvas-native item
  due_at?: string | null
  points?: number | null
  canvas_id?: string
}

interface Module {
  title: string
  items: Item[]
}

const props = defineProps<{ modules: Module[], base: string }>()

const ICONS: Record<Item['kind'], string> = {
  page: '📄',
  assignment: '📝',
  discussion: '💬',
  quiz: '🚀',
  file: '📎',
}

const LABELS: Record<Item['kind'], string> = {
  page: 'Page',
  assignment: 'Assignment',
  discussion: 'Discussion',
  quiz: 'Quiz',
  file: 'File',
}

function href(item: Item): string | undefined {
  if (!item.path) return undefined
  const base = props.base.endsWith('/') ? props.base : props.base + '/'
  return base + item.path
}

function due(item: Item): string {
  if (!item.due_at) return ''
  const d = new Date(item.due_at)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    + ' at ' + d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }).toLowerCase()
}

function points(item: Item): string {
  if (item.points === null || item.points === undefined) return ''
  return `${item.points} pts`
}
</script>

<template>
  <div class="modules">
    <section v-for="m in modules" :key="m.title" class="module">
      <header class="module-header">
        <span class="module-caret">▾</span>
        <span class="module-title">{{ m.title }}</span>
      </header>
      <ul class="module-items">
        <li v-for="(item, i) in m.items" :key="i" class="module-item">
          <span class="item-icon" :title="LABELS[item.kind]" aria-hidden="true">{{ ICONS[item.kind] }}</span>
          <span class="item-body">
            <a v-if="href(item)" :href="href(item)" class="item-title">{{ item.title }}</a>
            <span v-else class="item-title item-title--native">{{ item.title }}</span>
            <span v-if="due(item) || points(item)" class="item-meta">
              <span v-if="due(item)">Due {{ due(item) }}</span>
              <span v-if="due(item) && points(item)" class="item-sep">|</span>
              <span v-if="points(item)">{{ points(item) }}</span>
            </span>
          </span>
        </li>
        <li v-if="!m.items.length" class="module-item module-item--empty">No items</li>
      </ul>
    </section>
  </div>
</template>

<style scoped>
.modules {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1.5rem;
}

.module {
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  background: var(--vp-c-bg);
  overflow: hidden;
}

.module-header {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.7rem 1rem;
  background: var(--vp-c-bg-soft);
  border-bottom: 1px solid var(--vp-c-divider);
}

.module-caret {
  color: var(--vp-c-text-3);
  font-size: 0.85rem;
}

.module-title {
  font-weight: 700;
  font-size: 0.95rem;
  color: var(--vp-c-text-1);
}

.module-items {
  list-style: none;
  margin: 0;
  padding: 0;
}

.module-item {
  display: flex;
  align-items: flex-start;
  gap: 0.8rem;
  padding: 0.6rem 1rem 0.6rem 2rem;
  border-bottom: 1px solid var(--vp-c-divider);
  font-size: 0.9rem;
}

.module-item:last-child {
  border-bottom: none;
}

.module-item--empty {
  color: var(--vp-c-text-3);
  font-style: italic;
}

.item-icon {
  flex-shrink: 0;
  width: 1.4rem;
  text-align: center;
  line-height: 1.5;
}

.item-body {
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
  min-width: 0;
}

.item-title {
  color: var(--vp-c-brand-1);
  text-decoration: none;
  font-weight: 500;
}

.item-title:hover {
  text-decoration: underline;
}

.item-title--native {
  color: var(--vp-c-text-1);
}

.item-meta {
  font-size: 0.78rem;
  color: var(--vp-c-text-2);
  display: flex;
  gap: 0.4rem;
}

.item-sep {
  color: var(--vp-c-text-3);
}
</style>
