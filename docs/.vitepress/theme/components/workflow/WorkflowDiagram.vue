<script setup lang="ts">
// Puts one of the diagrams in diagrams.ts on the page, drawn by render.ts.
// Each diagram has a wide layout and a narrow one, and a container query shows
// the one that fits, since a wide diagram scaled down to a phone makes its text
// too small to read.
//
// `name` picks a site diagram. `file` picks a course diagram by the .svg it is
// exported to, as its course's diagrams.ts keys it; config.mts swaps a course
// diagram's image for this, so the site's copy follows the dark mode toggle.
import { computed } from 'vue'
import { diagrams } from './diagrams'
import { render, type Diagram } from './render'
import './diagram.css'

const courseFiles: Record<string, Diagram> = Object.assign(
  {},
  ...Object.values(import.meta.glob<Record<string, Diagram>>('../../../../*/**/diagrams.ts', { eager: true, import: 'files' })),
)

const props = defineProps<{ name?: string; file?: string }>()

const key = computed(() => props.name ?? props.file?.replace(/^.*\//, '').replace(/\.svg$/, '') ?? '')

const spec = computed(() => {
  const found = props.name ? diagrams[props.name] : props.file ? courseFiles[props.file] : undefined
  if (!found) throw new Error(`no diagram named ${props.name ?? props.file}`)
  return found
})

const svg = computed(() => {
  const d = spec.value
  const id = `wf-${key.value}`
  const wide = render(d, d.wide, { id, view: 'wide', name: `${key.value}/wide` })
  return d.narrow ? wide + render(d, d.narrow, { id, view: 'narrow', name: `${key.value}/narrow` }) : wide
})
</script>

<template>
  <figure class="wf" :class="{ 'wf-has-narrow': spec.narrow }">
    <div v-html="svg" />
    <figcaption v-if="spec.caption">{{ spec.caption }}</figcaption>
  </figure>
</template>

<style scoped>
.wf {
  container-type: inline-size;
  margin: 24px 0;
}

.wf :deep(svg) {
  display: block;
  width: 100%;
  height: auto;
}

.wf :deep(.wf-narrow) {
  display: none;
}

@container (max-width: 520px) {
  .wf-has-narrow :deep(.wf-wide) {
    display: none;
  }
  .wf-has-narrow :deep(.wf-narrow) {
    display: block;
  }
}

figcaption {
  margin-top: 8px;
  color: var(--vp-c-text-2);
  font-size: 14px;
  text-align: center;
}
</style>
