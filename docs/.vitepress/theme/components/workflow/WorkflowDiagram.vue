<script setup lang="ts">
// Draws one of the diagrams in diagrams.ts as inline SVG. The text is real
// text and every color is a theme variable, so the diagrams keep the site's
// 7:1 contrast in light and dark mode. Each diagram has a wide layout and a
// narrow one, and a container query shows the one that fits, since a wide
// diagram scaled down to a phone makes its text too small to read.
import { computed } from 'vue'
import { diagrams, type Layout, type Node, type Edge, type Point } from './diagrams'

const props = defineProps<{ name: string }>()

const spec = computed(() => {
  const found = diagrams[props.name]
  if (!found) throw new Error(`no workflow diagram named ${props.name}`)
  return found
})

const LABEL = 16
const SUB = 13
const EDGE = 13

function isDot(n: Node): boolean {
  return n.kind === 'dot' || n.kind === 'branch' || n.kind === 'landed' || n.kind === 'point'
}

function radius(n: Node): number {
  return n.kind === 'point' ? 0 : 9
}

// The point on a node's border facing `to`. Boxes leave from the middle of a
// side, so a line between two aligned boxes, or toward an aligned bend, is
// straight.
function anchor(n: Node, to: Point): Point {
  const dx = to[0] - n.x
  const dy = to[1] - n.y
  if (isDot(n)) {
    const len = Math.hypot(dx, dy) || 1
    const r = radius(n) + (n.kind === 'point' ? 0 : 3)
    return [n.x + (dx / len) * r, n.y + (dy / len) * r]
  }
  const w = (n.w ?? 0) / 2
  const h = (n.h ?? 0) / 2
  if (Math.abs(dx) * h > Math.abs(dy) * w) return [n.x + Math.sign(dx) * w, n.y]
  return [n.x, n.y + Math.sign(dy) * h]
}

function route(layout: Layout, e: Edge): Point[] {
  const from = layout.nodes.find((n) => n.id === e.from)
  const to = layout.nodes.find((n) => n.id === e.to)
  if (!from || !to) throw new Error(`edge ${e.from} -> ${e.to} names a missing node`)
  const via = e.via ?? []
  if (via.length > 0 || isDot(from) || isDot(to)) {
    const start = anchor(from, via[0] ?? [to.x, to.y])
    const end = anchor(to, via[via.length - 1] ?? [from.x, from.y])
    return [start, ...via, end]
  }
  // Between two boxes the line leaves and enters on the sides that face each
  // other across the wider gap, so a fan of lines all come in the same way.
  const gapX = Math.abs(to.x - from.x) - ((from.w ?? 0) + (to.w ?? 0)) / 2
  const gapY = Math.abs(to.y - from.y) - ((from.h ?? 0) + (to.h ?? 0)) / 2
  const sideways = gapX > gapY
  const sx = Math.sign(to.x - from.x)
  const sy = Math.sign(to.y - from.y)
  const start: Point = sideways ? [from.x + (sx * (from.w ?? 0)) / 2, from.y] : [from.x, from.y + (sy * (from.h ?? 0)) / 2]
  const end: Point = sideways ? [to.x - (sx * (to.w ?? 0)) / 2, to.y] : [to.x, to.y - (sy * (to.h ?? 0)) / 2]
  // Two boxes that do not line up get a bend halfway between them.
  if (start[0] === end[0] || start[1] === end[1]) return [start, end]
  if (sideways) {
    const mid = (start[0] + end[0]) / 2
    return [start, [mid, start[1]], [mid, end[1]], end]
  }
  const mid = (start[1] + end[1]) / 2
  return [start, [start[0], mid], [end[0], mid], end]
}

function labelPoint(points: Point[], e: Edge): Point {
  if (e.labelAt) return e.labelAt
  // The middle of the longest segment has the most room.
  let best = 0
  let bestLen = -1
  for (let i = 0; i < points.length - 1; i++) {
    const len = Math.hypot(points[i + 1][0] - points[i][0], points[i + 1][1] - points[i][1])
    if (len > bestLen) {
      best = i
      bestLen = len
    }
  }
  const [a, b] = [points[best], points[best + 1]]
  return [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]
}

// A rough text width, for the background behind an edge label.
function textWidth(text: string, size: number): number {
  return text.length * size * 0.56
}

function draw(layout: Layout) {
  const edges = layout.edges.map((e) => {
    const points = route(layout, e)
    const label = e.label ? { text: e.label, at: labelPoint(points, e) } : null
    return { ...e, d: 'M' + points.map((p) => p.join(' ')).join(' L'), label }
  })
  const nodes = layout.nodes.map((n) => {
    const lines = n.lines ?? []
    if (isDot(n)) {
      const side = n.labelAt ?? 'below'
      const off = radius(n) + 8
      const pos: Record<string, [number, number, string]> = {
        above: [n.x, n.y - off - 4, 'middle'],
        below: [n.x, n.y + off + SUB, 'middle'],
        left: [n.x - off, n.y + 5, 'end'],
        right: [n.x + off, n.y + 5, 'start'],
      }
      const [x, y, align] = pos[side]
      return { ...n, text: lines.map((t, i) => ({ t, x, y: y + i * (SUB + 3), cls: 'wf-sub', align })) }
    }
    if (n.kind === 'note') {
      return { ...n, text: lines.map((t, i) => ({ t, x: n.x, y: n.y + i * (SUB + 4), cls: 'wf-note', align: n.align ?? 'middle' })) }
    }
    // A bold name on the first line, smaller detail lines under it, the whole
    // block centered in the box.
    const height = LABEL + (lines.length - 1) * (SUB + 4)
    const top = n.y - height / 2 + LABEL - 3
    const text = lines.map((t, i) => ({
      t,
      x: n.x,
      y: i === 0 ? top : top + 4 + i * (SUB + 4),
      cls: i === 0 ? 'wf-label' : 'wf-sub',
      align: 'middle',
    }))
    return { ...n, text }
  })
  return { width: layout.width, height: layout.height, edges, nodes }
}

const views = computed(() => [
  { key: 'wide', ...draw(spec.value.wide) },
  { key: 'narrow', ...draw(spec.value.narrow) },
])

const id = computed(() => `wf-${props.name}`)
</script>

<template>
  <figure class="wf">
    <svg
      v-for="v in views"
      :key="v.key"
      :class="`wf-${v.key}`"
      :viewBox="`0 0 ${v.width} ${v.height}`"
      role="img"
      :aria-labelledby="`${id}-${v.key}-title ${id}-${v.key}-desc`"
    >
      <title :id="`${id}-${v.key}-title`">{{ spec.title }}</title>
      <desc :id="`${id}-${v.key}-desc`">{{ spec.desc }}</desc>
      <defs>
        <marker
          :id="`${id}-${v.key}-arrow`"
          viewBox="0 0 10 10"
          refX="9"
          refY="5"
          markerWidth="7"
          markerHeight="7"
          orient="auto-start-reverse"
        >
          <path d="M0 0 L10 5 L0 10 z" class="wf-head" />
        </marker>
      </defs>
      <path
        v-for="(e, i) in v.edges"
        :key="`e${i}`"
        :d="e.d"
        :class="['wf-edge', { 'wf-dashed': e.dashed, 'wf-heavy': e.heavy }]"
        :marker-end="e.arrow === false ? undefined : `url(#${id}-${v.key}-arrow)`"
      />
      <g v-for="n in v.nodes" :key="n.id" :class="`wf-${n.kind ?? 'step'}`">
        <rect
          v-if="!isDot(n) && n.kind !== 'note'"
          :x="n.x - (n.w ?? 0) / 2"
          :y="n.y - (n.h ?? 0) / 2"
          :width="n.w"
          :height="n.h"
          rx="10"
          class="wf-box"
        />
        <circle v-if="isDot(n) && n.kind !== 'point'" :cx="n.x" :cy="n.y" :r="radius(n)" class="wf-dot" />
        <text
          v-for="(t, i) in n.text"
          :key="i"
          :x="t.x"
          :y="t.y"
          :class="t.cls"
          :text-anchor="t.align"
        >{{ t.t }}</text>
      </g>
      <g v-for="(e, i) in v.edges" :key="`l${i}`">
        <template v-if="e.label">
          <rect
            :x="e.label.at[0] - textWidth(e.label.text, EDGE) / 2 - 4"
            :y="e.label.at[1] - EDGE / 2 - 4"
            :width="textWidth(e.label.text, EDGE) + 8"
            :height="EDGE + 8"
            rx="4"
            class="wf-label-bg"
          />
          <text :x="e.label.at[0]" :y="e.label.at[1] + EDGE / 2 - 2" text-anchor="middle" class="wf-edge-label">{{
            e.label.text
          }}</text>
        </template>
      </g>
    </svg>
    <figcaption>{{ spec.caption }}</figcaption>
  </figure>
</template>

<style scoped>
.wf {
  container-type: inline-size;
  margin: 24px 0;
}

.wf svg {
  display: block;
  width: 100%;
  height: auto;
  font-family: var(--vp-font-family-base);
}

.wf-narrow {
  display: none !important;
}

@container (max-width: 520px) {
  .wf-wide {
    display: none !important;
  }
  .wf-narrow {
    display: block !important;
  }
}

figcaption {
  margin-top: 8px;
  color: var(--vp-c-text-2);
  font-size: 14px;
  text-align: center;
}

.wf-box {
  fill: var(--vp-c-bg-soft);
  stroke: var(--vp-c-text-2);
  stroke-width: 1.5;
}

/* Each kind of stage has its own border, and its name says what it is, so
   the color is never the only cue. */
.wf-check .wf-box {
  stroke: var(--vp-c-green-1);
  stroke-width: 2.5;
}

.wf-human .wf-box {
  stroke: var(--vp-c-yellow-1);
  stroke-width: 2.5;
  stroke-dasharray: 7 5;
}

/* Dotted, not just a different color, so it reads in any color scheme. */
.wf-planned .wf-box {
  stroke: var(--vp-c-text-2);
  stroke-width: 2.5;
  stroke-dasharray: 1 5;
  stroke-linecap: round;
}

.wf-user .wf-box {
  stroke: var(--vp-c-indigo-1);
  stroke-width: 2.5;
}

.wf-label {
  fill: var(--vp-c-text-1);
  font-size: 16px;
  font-weight: 600;
}

.wf-sub,
.wf-note {
  fill: var(--vp-c-text-2);
  font-size: 13px;
}

.wf-note {
  font-style: italic;
}

.wf-edge {
  fill: none;
  stroke: var(--vp-c-text-2);
  stroke-width: 1.75;
}

.wf-dashed {
  stroke-dasharray: 6 5;
}

.wf-heavy {
  stroke: var(--vp-c-text-1);
  stroke-width: 4;
}

.wf-head {
  fill: var(--vp-c-text-2);
}

.wf-label-bg {
  fill: var(--vp-c-bg);
}

.wf-edge-label {
  fill: var(--vp-c-text-1);
  font-size: 13px;
}

.wf-dot .wf-dot {
  fill: var(--vp-c-indigo-1);
}

.wf-branch .wf-dot {
  fill: var(--vp-c-purple-1);
}

.wf-landed .wf-dot {
  fill: var(--vp-c-bg);
  stroke: var(--vp-c-green-1);
  stroke-width: 4;
}
</style>
