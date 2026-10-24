<script setup lang="ts">
// Puts one of the diagrams in diagrams.ts on the page, drawn by render.ts.
// Each diagram has a wide layout and a narrow one, and a container query shows
// the one that fits, since a wide diagram scaled down to a phone makes its text
// too small to read.
import { computed } from 'vue'
import { diagrams } from './diagrams'
import { render } from './render'
import './diagram.css'

const props = defineProps<{ name: string }>()

const spec = computed(() => {
  const found = diagrams[props.name]
  if (!found) throw new Error(`no workflow diagram named ${props.name}`)
  return found
})

const svg = computed(() => {
  const d = spec.value
  const id = `wf-${props.name}`
  const wide = render(d, d.wide, { id, view: 'wide', name: `${props.name}/wide` })
  return d.narrow ? wide + render(d, d.narrow, { id, view: 'narrow', name: `${props.name}/narrow` }) : wide
})
</script>

<template>
  <figure class="wf" :class="{ 'wf-has-narrow': spec.narrow }">
    <div v-html="svg" />
    <figcaption>{{ spec.caption }}</figcaption>
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
