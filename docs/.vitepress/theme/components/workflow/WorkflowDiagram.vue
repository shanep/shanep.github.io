<script setup lang="ts">
// Draws one of the diagrams in diagrams.ts as inline SVG. The text is real
// text and every color is a theme variable, so the diagrams keep the site's
// 7:1 contrast in light and dark mode. Each diagram has a wide layout and a
// narrow one, and a container query shows the one that fits, since a wide
// diagram scaled down to a phone makes its text too small to read. Labeled
// regions show where each step runs. Color means only that: each place has
// one hue, every box takes the hue of the region it sits in, and the region's
// label is the legend.
import { computed } from 'vue'
import { diagrams, type Layout, type Node, type Edge, type Point, type Place, type Region } from './diagrams'

const props = defineProps<{ name: string }>()

const spec = computed(() => {
  const found = diagrams[props.name]
  if (!found) throw new Error(`no workflow diagram named ${props.name}`)
  return found
})

const LABEL = 17
const SUB = 14
const EDGE = 14

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

// A 16 unit icon for each place, drawn in the region's tab next to its name.
const ICONS: Record<Place, string> = {
  mac: 'M2 3.5h12v8H2z M0 13.5h16',
  github: 'M4 2v12 M4 10c0-3 8-2 8-6 M12 2.5a1.5 1.5 0 1 0 0 .01 M4 14a1.5 1.5 0 1 0 0 .01',
  cloud: 'M4.5 13h7.5a3 3 0 0 0 .3-6 4.5 4.5 0 0 0-8.6 1.2A2.5 2.5 0 0 0 4.5 13z',
  users: 'M5.5 7a2.5 2.5 0 1 0 0-.01 M1 14c0-3 2-4.5 4.5-4.5S10 11 10 14 M11 4.5a2 2 0 1 1 0 4 M12 9.8c2 .4 3 1.8 3 4.2',
  canvas: 'M1 4l7-3 7 3-7 3z M4 5.5v5c0 1.5 8 1.5 8 0v-5 M15 4v5',
}

const TAB = 15

function tab(r: Region) {
  const width = 38 + r.label.length * TAB * 0.6
  return { x: r.x + 8, y: r.y + 8, w: Math.min(width, r.w - 16), h: 28, icon: ICONS[r.place] }
}

function placeOf(regions: Region[], n: Node): Place | undefined {
  return regions.find((r) => n.x >= r.x && n.x <= r.x + r.w && n.y >= r.y && n.y <= r.y + r.h)?.place
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
      return { ...n, place: undefined, text: lines.map((t, i) => ({ t, x, y: y + i * (SUB + 3), cls: 'wf-sub', align })) }
    }
    if (n.kind === 'note') {
      return { ...n, place: undefined, text: lines.map((t, i) => ({ t, x: n.x, y: n.y + i * (SUB + 4), cls: 'wf-note', align: n.align ?? 'middle' })) }
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
    return { ...n, place: placeOf(layout.regions ?? [], n), text }
  })
  const regions = (layout.regions ?? []).map((r) => ({ ...r, tab: tab(r) }))
  return { width: layout.width, height: layout.height, regions, edges, nodes }
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
        <filter :id="`${id}-${v.key}-shadow`" x="-10%" y="-10%" width="120%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="2.5" class="wf-shadow" />
        </filter>
      </defs>
      <g v-for="(r, i) in v.regions" :key="`r${i}`" :class="`wf-place-${r.place}`">
        <rect :x="r.x" :y="r.y" :width="r.w" :height="r.h" rx="14" class="wf-region" />
        <rect :x="r.tab.x" :y="r.tab.y" :width="r.tab.w" :height="r.tab.h" rx="14" class="wf-tab" />
        <path :d="r.tab.icon" :transform="`translate(${r.tab.x + 12} ${r.tab.y + 6})`" class="wf-icon" />
        <text :x="r.tab.x + 34" :y="r.y + 27" class="wf-region-label">{{ r.label }}</text>
      </g>
      <path
        v-for="(e, i) in v.edges"
        :key="`e${i}`"
        :d="e.d"
        :class="['wf-edge', { 'wf-heavy': e.heavy }]"
        :marker-end="e.arrow === false ? undefined : `url(#${id}-${v.key}-arrow)`"
      />
      <g v-for="n in v.nodes" :key="n.id" :class="[`wf-${n.kind ?? 'step'}`, n.place && `wf-place-${n.place}`]">
        <rect
          v-if="!isDot(n) && n.kind !== 'note'"
          :x="n.x - (n.w ?? 0) / 2"
          :y="n.y - (n.h ?? 0) / 2"
          :width="n.w"
          :height="n.h"
          rx="10"
          class="wf-box"
          :filter="`url(#${id}-${v.key}-shadow)`"
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
            :rx="(EDGE + 8) / 2"
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

/* One hue per place. --wf-ink is text on --wf-tab and on --wf-fill, at 7:1 or
   better; --wf-line is the border of the region and of each box in it. */
.wf-place-mac {
  --wf-fill: #eef4ff;
  --wf-tab: #d6e4ff;
  --wf-line: #2f62d6;
  --wf-ink: #1b3a86;
}

.wf-place-github {
  --wf-fill: #f5f1ff;
  --wf-tab: #e6dcff;
  --wf-line: #7444d8;
  --wf-ink: #47208f;
}

.wf-place-cloud {
  --wf-fill: #fff3ea;
  --wf-tab: #ffe0c9;
  --wf-line: #c4520f;
  --wf-ink: #77290c;
}

.wf-place-users {
  --wf-fill: #edf9f1;
  --wf-tab: #d2f0dc;
  --wf-line: #1d8146;
  --wf-ink: #0f3d22;
}

.wf-place-canvas {
  --wf-fill: #fff0f0;
  --wf-tab: #ffdada;
  --wf-line: #c02626;
  --wf-ink: #761818;
}

html.dark .wf-place-mac {
  --wf-fill: #111c33;
  --wf-tab: #1d3160;
  --wf-line: #6b9af5;
  --wf-ink: #cfe0ff;
}

html.dark .wf-place-github {
  --wf-fill: #1a1430;
  --wf-tab: #30245a;
  --wf-line: #a283f4;
  --wf-ink: #e4d9ff;
}

html.dark .wf-place-cloud {
  --wf-fill: #26170d;
  --wf-tab: #4a2a12;
  --wf-line: #f0904f;
  --wf-ink: #ffdcc4;
}

html.dark .wf-place-users {
  --wf-fill: #0e2317;
  --wf-tab: #17402a;
  --wf-line: #4cc47a;
  --wf-ink: #c8f5d8;
}

html.dark .wf-place-canvas {
  --wf-fill: #2a1111;
  --wf-tab: #4f1c1c;
  --wf-line: #f27474;
  --wf-ink: #ffd6d6;
}

.wf-region {
  fill: var(--wf-fill, var(--vp-c-bg-soft));
  stroke: var(--wf-line, var(--vp-c-text-2));
  stroke-width: 1.5;
}

.wf-tab {
  fill: var(--wf-tab);
}

.wf-icon {
  fill: none;
  stroke: var(--wf-ink);
  stroke-width: 1.6;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.wf-region-label {
  fill: var(--wf-ink, var(--vp-c-text-1));
  font-size: 15px;
  font-weight: 700;
}

.wf-shadow {
  flood-color: #0b1530;
  flood-opacity: 0.16;
}

html.dark .wf-shadow {
  flood-color: #000;
  flood-opacity: 0.55;
}

.wf-box {
  fill: var(--vp-c-bg);
  stroke: var(--wf-line, var(--vp-c-text-2));
  stroke-width: 2;
}

/* Built but not run for real yet. A diagram that uses it has a legend. */
.wf-planned .wf-box {
  stroke-width: 2.5;
  stroke-dasharray: 1 5;
  stroke-linecap: round;
}

.wf-label {
  fill: var(--vp-c-text-1);
  font-size: 17px;
  font-weight: 600;
}

.wf-sub,
.wf-note {
  fill: var(--vp-c-text-2);
  font-size: 14px;
}

.wf-note {
  font-style: italic;
}

.wf-edge {
  fill: none;
  stroke: var(--vp-c-text-2);
  stroke-width: 1.75;
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
  stroke: var(--vp-c-divider);
  stroke-width: 1;
}

.wf-edge-label {
  fill: var(--vp-c-text-1);
  font-size: 14px;
}

.wf-dot .wf-dot,
.wf-branch .wf-dot {
  fill: var(--vp-c-text-2);
}

/* A hollow ring, labeled, where a branch landed. */
.wf-landed .wf-dot {
  fill: var(--vp-c-bg);
  stroke: var(--vp-c-text-1);
  stroke-width: 4;
}
</style>
