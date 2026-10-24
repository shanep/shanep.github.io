// Draws a diagram spec as an SVG string. WorkflowDiagram.vue puts it inline on
// the site, and scripts/a11y/diagrams.mjs writes it to standalone .svg files for
// Canvas, so every diagram on the site and in a course looks the same. The text
// is real text and every color comes from diagram.css, which keeps the 7:1
// contrast in light and dark mode.
//
// Color means one thing per diagram, and the diagram says what. Boxes inside a
// region take the hue of the place the region stands for, and the region's
// label is the legend. Anything colored by hand (a tone on a node, a text or an
// edge) needs a key node with the same tone and line style, or render() throws.
//
// Node runs this file directly with its type stripping, so it uses no enums,
// namespaces or parameter properties, and imports name their .ts extension.

export type Point = [number, number]

export type Place = 'mac' | 'github' | 'cloud' | 'users' | 'canvas'

export type Tone = 'blue' | 'purple' | 'orange' | 'green' | 'red' | 'yellow' | 'gray'

export interface Node {
  id: string
  x: number
  y: number
  w?: number
  h?: number
  // The first line of a box is its name, the rest are details.
  lines?: string[]
  // step: a box. planned: a box for something not built or not run for real
  // yet, drawn dotted, and the diagram has a legend that says so. note: italic
  // text. text: plain text. dot: a commit on main. branch: a commit on a
  // worktree branch. landed: a commit that landed from a branch. point: an
  // invisible end for a line. lost: an X where a message dies. badge: a
  // numbered circle. key: one legend entry, a swatch at (x, y) and its text.
  kind?: 'step' | 'planned' | 'note' | 'text' | 'dot' | 'branch' | 'landed' | 'point' | 'lost' | 'badge' | 'key'
  labelAt?: 'above' | 'below' | 'left' | 'right'
  align?: 'start' | 'middle' | 'end'
  // Overrides the region's hue for a box, colors a text, or sets a key's color.
  tone?: Tone
  // The line style a key stands for. A key without one shows a box swatch.
  swatch?: 'line' | 'dashed' | 'bar'
  bold?: boolean
  mono?: boolean
}

export interface Edge {
  from: string
  to: string
  label?: string
  labelAt?: Point
  via?: Point[]
  heavy?: boolean
  arrow?: boolean
  tone?: Tone
  dashed?: boolean
  // A thick bar with no arrow, like a timer running.
  bar?: boolean
}

// A labeled area for the machine or service a step runs on. Boxes sit inside
// the region they run in, which is how the diagrams show where things happen.
export interface Region {
  label: string
  // Sets the region's color, which every box inside it shares. The region's
  // label is the legend for it.
  place: Place
  x: number
  y: number
  w: number
  h: number
}

export interface Layout {
  width: number
  height: number
  regions?: Region[]
  nodes: Node[]
  edges: Edge[]
}

export interface Diagram {
  title: string
  caption: string
  desc: string
  wide: Layout
  // A layout for phones. Without one the wide layout scales down.
  narrow?: Layout
}

export const PLACE_TONE: Record<Place, Tone> = { mac: 'blue', github: 'purple', cloud: 'orange', users: 'green', canvas: 'red' }

const LABEL = 17
const SUB = 14
const EDGE = 14

// A 16 unit icon for each place, drawn in the region's tab next to its name.
const ICONS: Record<Place, string> = {
  mac: 'M2 3.5h12v8H2z M0 13.5h16',
  github: 'M4 2v12 M4 10c0-3 8-2 8-6 M12 2.5a1.5 1.5 0 1 0 0 .01 M4 14a1.5 1.5 0 1 0 0 .01',
  cloud: 'M4.5 13h7.5a3 3 0 0 0 .3-6 4.5 4.5 0 0 0-8.6 1.2A2.5 2.5 0 0 0 4.5 13z',
  users: 'M5.5 7a2.5 2.5 0 1 0 0-.01 M1 14c0-3 2-4.5 4.5-4.5S10 11 10 14 M11 4.5a2 2 0 1 1 0 4 M12 9.8c2 .4 3 1.8 3 4.2',
  canvas: 'M1 4l7-3 7 3-7 3z M4 5.5v5c0 1.5 8 1.5 8 0v-5 M15 4v5',
}

const TAB = 15

function isDot(n: Node): boolean {
  return n.kind === 'dot' || n.kind === 'branch' || n.kind === 'landed' || n.kind === 'point' || n.kind === 'lost' || n.kind === 'badge'
}

function isBox(n: Node): boolean {
  return !isDot(n) && n.kind !== 'note' && n.kind !== 'text' && n.kind !== 'key'
}

function radius(n: Node): number {
  if (n.kind === 'point') return 0
  if (n.kind === 'badge') return 12
  return 9
}

// The point on a node's border facing `to`. Boxes leave from the middle of a
// side, so a line between two aligned boxes, or toward an aligned bend, is
// straight.
function anchor(n: Node, to: Point): Point {
  const dx = to[0] - n.x
  const dy = to[1] - n.y
  if (isDot(n)) {
    const len = Math.hypot(dx, dy) || 1
    const r = radius(n) + (n.kind === 'point' || n.kind === 'lost' ? 0 : 3)
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

function tab(r: Region) {
  const width = 38 + r.label.length * TAB * 0.6
  return { x: r.x + 8, y: r.y + 8, w: Math.min(width, r.w - 16), h: 28 }
}

function placeOf(regions: Region[], n: Node): Place | undefined {
  return regions.find((r) => n.x >= r.x && n.x <= r.x + r.w && n.y >= r.y && n.y <= r.y + r.h)?.place
}

function esc(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

function attrs(a: Record<string, string | number | undefined | false>): string {
  return Object.entries(a)
    .filter(([, v]) => v !== undefined && v !== false)
    .map(([k, v]) => ` ${k}="${esc(String(v))}"`)
    .join('')
}

function text(x: number, y: number, s: string, cls: string, align = 'middle'): string {
  return `<text${attrs({ x, y, class: cls, 'text-anchor': align === 'start' ? undefined : align })}>${esc(s)}</text>`
}

// The tone and line style of everything colored by hand must have a key.
function checkLegend(name: string, layout: Layout): void {
  const keys = layout.nodes.filter((n) => n.kind === 'key')
  const has = (tone: Tone, swatch?: Node['swatch']) => keys.some((k) => k.tone === tone && (swatch === undefined || k.swatch === swatch))
  for (const n of layout.nodes) {
    if (n.kind !== 'key' && n.tone && !has(n.tone)) throw new Error(`${name}: node ${n.id} is ${n.tone}, and no key says what that means`)
  }
  for (const e of layout.edges) {
    if (!e.tone) continue
    const swatch = e.bar ? 'bar' : e.dashed ? 'dashed' : 'line'
    if (!has(e.tone, swatch)) throw new Error(`${name}: edge ${e.from} -> ${e.to} is a ${e.tone} ${swatch}, and no key says what that means`)
  }
}

export interface RenderOptions {
  // A unique prefix for the ids of the markers, filters and title.
  id: string
  // Shown when the page is narrow (site) or always (a standalone file).
  view?: 'wide' | 'narrow'
  // Puts a rounded card behind the diagram, for a file shown on its own.
  card?: boolean
  // Extra markup at the top of the svg, like a <style> for a standalone file.
  head?: string
  // Marks the svg for the checker in scripts/a11y/diagrams.mjs.
  name?: string
}

export function render(d: Diagram, layout: Layout, o: RenderOptions): string {
  const id = `${o.id}-${o.view ?? 'wide'}`
  checkLegend(o.name ?? o.id, layout)
  const regions = layout.regions ?? []
  const out: string[] = []
  const arrowTones = new Set<string>()
  const arrow = (tone?: Tone) => {
    arrowTones.add(tone ?? '')
    return `url(#${id}-arrow${tone ? '-' + tone : ''})`
  }

  if (o.card) out.push(`<rect x="1" y="1" width="${layout.width - 2}" height="${layout.height - 2}" rx="12" class="wf-card"/>`)

  for (const r of regions) {
    const t = tab(r)
    out.push(
      `<g class="wf-tone-${PLACE_TONE[r.place]}">` +
        `<rect${attrs({ x: r.x, y: r.y, width: r.w, height: r.h, rx: 14, class: 'wf-region' })}/>` +
        `<rect${attrs({ x: t.x, y: t.y, width: t.w, height: t.h, rx: 14, class: 'wf-tab' })}/>` +
        `<path d="${ICONS[r.place]}" transform="translate(${t.x + 12} ${t.y + 6})" class="wf-icon"/>` +
        text(t.x + 34, r.y + 27, r.label, 'wf-region-label', 'start') +
        `</g>`,
    )
  }

  const labels: string[] = []
  for (const e of layout.edges) {
    const points = route(layout, e)
    const cls = ['wf-edge', e.heavy && 'wf-heavy', e.dashed && 'wf-dashed', e.bar && 'wf-bar', e.tone && `wf-tone-${e.tone}`].filter(Boolean).join(' ')
    const marker = e.arrow === false || e.bar ? undefined : arrow(e.tone)
    out.push(`<path${attrs({ d: 'M' + points.map((p) => p.join(' ')).join(' L'), class: cls, 'marker-end': marker })}/>`)
    if (e.label) {
      const [x, y] = labelPoint(points, e)
      const w = textWidth(e.label, EDGE)
      labels.push(
        `<rect${attrs({ x: x - w / 2 - 4, y: y - EDGE / 2 - 4, width: w + 8, height: EDGE + 8, rx: (EDGE + 8) / 2, class: 'wf-label-bg' })}/>` +
          text(x, y + EDGE / 2 - 2, e.label, 'wf-edge-label'),
      )
    }
  }

  for (const n of layout.nodes) {
    const lines = n.lines ?? []
    const font = [n.bold && 'wf-bold', n.mono && 'wf-mono'].filter(Boolean).join(' ')
    const place = placeOf(regions, n)
    const tone = n.tone ?? (place && isBox(n) ? PLACE_TONE[place] : undefined)
    const cls = [`wf-${n.kind ?? 'step'}`, tone && `wf-tone-${tone}`, n.tone && isBox(n) && 'wf-filled'].filter(Boolean).join(' ')
    const body: string[] = []
    if (n.kind === 'point') continue
    if (n.kind === 'key') {
      // A swatch 34 wide, then the text.
      if (n.swatch === 'bar') body.push(`<path d="M${n.x + 17} ${n.y - 9} L${n.x + 17} ${n.y + 9}" class="wf-edge wf-bar"/>`)
      else if (n.swatch) {
        body.push(`<path${attrs({ d: `M${n.x} ${n.y} L${n.x + 34} ${n.y}`, class: `wf-edge${n.swatch === 'dashed' ? ' wf-dashed' : ''}`, 'marker-end': arrow(n.tone) })}/>`)
      } else body.push(`<rect${attrs({ x: n.x + 6, y: n.y - 11, width: 22, height: 22, rx: 5, class: 'wf-box wf-swatch' })}/>`)
      body.push(text(n.x + 44, n.y + 5, lines[0] ?? '', 'wf-key', 'start'))
    } else if (n.kind === 'lost') {
      body.push(`<path d="M${n.x - 7} ${n.y - 7} L${n.x + 7} ${n.y + 7} M${n.x + 7} ${n.y - 7} L${n.x - 7} ${n.y + 7}" class="wf-x"/>`)
    } else if (n.kind === 'badge') {
      body.push(`<circle cx="${n.x}" cy="${n.y}" r="${radius(n)}" class="wf-badge-dot"/>`)
      body.push(text(n.x, n.y + 5, lines[0] ?? '', 'wf-badge-num'))
    } else if (isDot(n)) {
      body.push(`<circle cx="${n.x}" cy="${n.y}" r="${radius(n)}" class="wf-dot"/>`)
      const off = radius(n) + 8
      const pos: Record<string, [number, number, string]> = {
        above: [n.x, n.y - off - 4, 'middle'],
        below: [n.x, n.y + off + SUB, 'middle'],
        left: [n.x - off, n.y + 5, 'end'],
        right: [n.x + off, n.y + 5, 'start'],
      }
      const [x, y, align] = pos[n.labelAt ?? 'below']
      lines.forEach((t, i) => body.push(text(x, y + i * (SUB + 3), t, 'wf-sub', align)))
    } else if (n.kind === 'note' || n.kind === 'text') {
      const cls = [n.kind === 'note' ? 'wf-note' : 'wf-text', font].filter(Boolean).join(' ')
      lines.forEach((t, i) => body.push(text(n.x, n.y + i * (SUB + 4), t, cls, n.align ?? 'middle')))
    } else {
      body.push(
        `<rect${attrs({ x: n.x - (n.w ?? 0) / 2, y: n.y - (n.h ?? 0) / 2, width: n.w, height: n.h, rx: 10, class: 'wf-box', filter: `url(#${id}-shadow)` })}/>`,
      )
      // A bold name on the first line, smaller detail lines under it, the whole
      // block centered in the box.
      const height = LABEL + (lines.length - 1) * (SUB + 4)
      const top = n.y - height / 2 + LABEL - 3
      lines.forEach((t, i) => body.push(text(n.x, i === 0 ? top : top + 4 + i * (SUB + 4), t, i === 0 ? 'wf-label' : 'wf-sub')))
    }
    out.push(`<g class="${cls}">${body.join('')}</g>`)
  }
  out.push(...labels)

  const markers = [...arrowTones]
    .map(
      (tone) =>
        `<marker id="${id}-arrow${tone ? '-' + tone : ''}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"${tone ? ` class="wf-tone-${tone}"` : ''}>` +
        `<path d="M0 0 L10 5 L0 10 z" class="wf-head"/></marker>`,
    )
    .join('')
  const filter =
    `<filter id="${id}-shadow" x="-10%" y="-10%" width="120%" height="140%">` +
    `<feDropShadow dx="0" dy="2" stdDeviation="2.5" class="wf-shadow"/></filter>`

  return (
    `<svg xmlns="http://www.w3.org/2000/svg"${attrs({
      class: `wf-svg wf-${o.view ?? 'wide'}`,
      viewBox: `0 0 ${layout.width} ${layout.height}`,
      role: 'img',
      'aria-labelledby': `${id}-title ${id}-desc`,
      'data-diagram': o.name,
    })}>` +
    `<title id="${id}-title">${esc(d.title)}</title><desc id="${id}-desc">${esc(d.desc)}</desc>` +
    (o.head ?? '') +
    `<defs>${markers}${filter}</defs>` +
    out.join('') +
    `</svg>`
  )
}
