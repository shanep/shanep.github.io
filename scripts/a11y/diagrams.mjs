// Checks every diagram drawn by docs/.vitepress/theme/components/workflow/render.ts:
// the workflow diagrams in diagrams.ts next to it, and every course diagram in
// a docs/<course>/**/diagrams.ts, whose `files` maps each .svg it writes to its
// spec.
//
// usage: npm run diagrams [-- --shots <dir>]
//        npm run diagrams:export
//
// --export writes each course diagram to its .svg file and stops. Without it,
// the check fails when an .svg is stale, then draws every layout in Chromium
// and looks for layout faults:
//   - text too wide for its box, or text overlapping text
//   - a box outside every region, near a region's edge, or under its label
//   - two boxes, two edge labels, or an edge label and a box too close
//   - an edge label on a region border
//   - a line through text or through a box, ending in a stub too short for
//     its arrow, or running along a region border
// --shots also saves a picture of each one at desktop and phone width, in
// light and dark mode (course .svg files are light only, like Canvas).
//
// Exits 1 on a stale file or any fault.
import { globSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { basename, join, relative, resolve } from 'node:path'
import { parseArgs } from 'node:util'

const { values: args } = parseArgs({ options: { export: { type: 'boolean' }, shots: { type: 'string' } } })
const root = resolve(import.meta.dirname, '../..')
const kit = join(root, 'docs/.vitepress/theme/components/workflow')
const { render } = await import(join(kit, 'render.ts'))
const { diagrams } = await import(join(kit, 'diagrams.ts'))
const css = readFileSync(join(kit, 'diagram.css'), 'utf8')

// A standalone file is shown as an image on a light page, so it keeps only the
// light rules.
const lightCss = css
  .replace(/\/\*[\s\S]*?\*\//g, '')
  .replace(/html\.dark[^{]*\{[^}]*\}/g, '')
  .replace(/\s+/g, ' ')
  .replace(/ ?([{};:,]) ?/g, '$1')
  .trim()

const files = []
for (const spec of globSync('docs/*/**/diagrams.ts', { cwd: root }).filter((p) => !p.includes('.vitepress'))) {
  const mod = await import(join(root, spec))
  for (const [out, d] of Object.entries(mod.files)) {
    const id = basename(out, '.svg')
    const svg = render(d, d.wide, { id, card: true, head: `<style>${lightCss}</style>`, name: `${id}/wide` }) + '\n'
    files.push({ out, svg })
  }
}

if (args.export) {
  for (const f of files) {
    writeFileSync(join(root, f.out), f.svg)
    console.log(`wrote ${f.out}`)
  }
  process.exit(0)
}

const faults = []
for (const f of files) {
  let now = ''
  try {
    now = readFileSync(join(root, f.out), 'utf8')
  } catch {}
  if (now !== f.svg) faults.push(`${f.out} is stale: run npm run diagrams:export`)
}

// Every layout on one page, at 1 unit to 1 px for the checks. Site diagrams get
// the site's own neutrals so dark mode matches.
const site = []
for (const [name, d] of Object.entries(diagrams)) {
  site.push({ name, view: 'wide', svg: render(d, d.wide, { id: `wf-${name}`, view: 'wide', name: `${name}/wide` }) })
  if (d.narrow) site.push({ name, view: 'narrow', svg: render(d, d.narrow, { id: `wf-${name}`, view: 'narrow', name: `${name}/narrow` }) })
}
const course = files.map((f) => ({ name: basename(f.out, '.svg'), view: 'wide', svg: f.svg, standalone: true }))
const all = [...site, ...course]
const html = `<!doctype html><html><head><style>
  :root { --vp-c-bg: #f7f9fc; --vp-c-text-1: #0f1a28; --vp-c-text-2: #313c4a; --vp-c-divider: #d8e0ea; }
  html.dark { --vp-c-bg: #0e1621; --vp-c-text-1: #dde6f0; --vp-c-text-2: #c3cedb; --vp-c-divider: #1f2c3c; }
  body { margin: 0; padding: 16px; background: var(--vp-c-bg); }
  .shot { margin-bottom: 24px; }
  .shot.standalone { --vp-c-bg: initial; --vp-c-text-1: initial; --vp-c-text-2: initial; --vp-c-divider: initial; background: #ffffff; }
  .shot svg { display: block; width: 100%; height: auto; }
  ${css}
</style></head><body>${all.map((d, i) => `<div class="shot${d.standalone ? ' standalone' : ''}" id="d${i}">${d.svg}</div>`).join('')}</body></html>`

const { chromium } = await import('playwright')
const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1280, height: 900 }, deviceScaleFactor: 2 })
await page.setContent(html)
faults.push(
  ...(await page.evaluate(() => {
    const faults = []
    const bb = (el) => {
      const b = el.getBBox()
      return { x: b.x, y: b.y, w: b.width, h: b.height }
    }
    const inter = (a, b, pad = 0) => a.x < b.x + b.w + pad && b.x < a.x + a.w + pad && a.y < b.y + b.h + pad && b.y < a.y + a.h + pad
    const shrink = (r, d) => ({ x: r.x + d, y: r.y + d, w: r.w - 2 * d, h: r.h - 2 * d })
    // A segment against a rectangle, by sampling every 2 units.
    const segHits = (p, q, r) => {
      const n = Math.ceil(Math.hypot(q[0] - p[0], q[1] - p[1]) / 2) + 1
      for (let i = 0; i <= n; i++) {
        const x = p[0] + ((q[0] - p[0]) * i) / n
        const y = p[1] + ((q[1] - p[1]) * i) / n
        if (x > r.x && x < r.x + r.w && y > r.y && y < r.y + r.h) return true
      }
      return false
    }
    for (const svg of document.querySelectorAll('svg[data-diagram]')) {
      const name = svg.dataset.diagram
      const f = (m) => faults.push(`${name}: ${m}`)
      const regions = [...svg.querySelectorAll('rect.wf-region')].map(bb)
      const boxes = [...svg.querySelectorAll('g')]
        .filter((g) => g.querySelector(':scope > rect.wf-box:not(.wf-swatch)'))
        .map((g) => ({ r: bb(g.querySelector(':scope > rect.wf-box')), texts: [...g.querySelectorAll(':scope > text')] }))
      const texts = [...svg.querySelectorAll('text')].map((t) => ({ t: t.textContent, r: bb(t), cls: t.getAttribute('class') }))
      const labels = [...svg.querySelectorAll('rect.wf-label-bg')].map((r) => ({ r: bb(r), t: r.nextElementSibling?.textContent }))
      const paths = [...svg.querySelectorAll('path.wf-edge')]
        .filter((p) => !p.closest('.wf-key'))
        .map((p) => ({
          bar: p.classList.contains('wf-bar'),
          arrow: p.hasAttribute('marker-end'),
          pts: p
            .getAttribute('d')
            .replace(/^M/, '')
            .split(' L')
            .map((s) => s.trim().split(/\s+/).map(Number)),
        }))
      const view = svg.viewBox.baseVal
      for (const t of texts) {
        if (t.r.x < 0 || t.r.y < 0 || t.r.x + t.r.w > view.width || t.r.y + t.r.h > view.height) f(`text "${t.t}" runs off the diagram`)
      }
      for (const b of boxes)
        for (const t of b.texts) {
          const r = bb(t)
          if (r.x < b.r.x + 6 || r.x + r.w > b.r.x + b.r.w - 6) f(`text "${t.textContent}" too wide for its box`)
        }
      for (const b of boxes) {
        const reg = regions.find((g) => inter(b.r, g))
        if (regions.length && !reg) f(`box "${b.texts[0]?.textContent}" outside every region`)
        if (reg) {
          const pad = Math.min(b.r.x - reg.x, reg.x + reg.w - b.r.x - b.r.w, reg.y + reg.h - b.r.y - b.r.h)
          if (pad < 14) f(`box "${b.texts[0]?.textContent}" ${pad.toFixed(0)}px from its region edge`)
          if (b.r.y - reg.y < 40) f(`box "${b.texts[0]?.textContent}" crowds the region label`)
        }
      }
      for (let i = 0; i < boxes.length; i++)
        for (let j = i + 1; j < boxes.length; j++)
          if (inter(boxes[i].r, boxes[j].r, 6)) f(`boxes "${boxes[i].texts[0]?.textContent}" and "${boxes[j].texts[0]?.textContent}" closer than 6px`)
      for (let i = 0; i < texts.length; i++)
        for (let j = i + 1; j < texts.length; j++) if (inter(texts[i].r, texts[j].r, -1)) f(`text "${texts[i].t}" overlaps "${texts[j].t}"`)
      for (const l of labels)
        for (const g of regions) {
          const inside = l.r.x >= g.x && l.r.x + l.r.w <= g.x + g.w && l.r.y >= g.y && l.r.y + l.r.h <= g.y + g.h
          if (inter(l.r, g) && !inside) f(`edge label "${l.t}" sits on a region border`)
        }
      for (const l of labels) for (const b of boxes) if (inter(l.r, b.r, 4)) f(`edge label "${l.t}" touches box "${b.texts[0]?.textContent}"`)
      for (let i = 0; i < labels.length; i++)
        for (let j = i + 1; j < labels.length; j++) if (inter(labels[i].r, labels[j].r, 4)) f(`edge labels "${labels[i].t}" and "${labels[j].t}" touch`)
      for (const { pts, bar, arrow } of paths) {
        for (let k = 0; k < pts.length - 1; k++) {
          const [p, q] = [pts[k], pts[k + 1]]
          for (const t of texts) if (t.cls !== 'wf-edge-label' && segHits(p, q, shrink(t.r, 1))) f(`a line crosses text "${t.t}"`)
          for (const b of boxes) if (segHits(p, q, shrink(b.r, 3))) f(`a line runs through box "${b.texts[0]?.textContent}"`)
          for (const g of regions) {
            if (p[0] === q[0] && (Math.abs(p[0] - g.x) < 8 || Math.abs(p[0] - g.x - g.w) < 8) && Math.abs(p[1] - q[1]) > 20) f(`a line hugs a region side at x=${p[0]}`)
            if (p[1] === q[1] && (Math.abs(p[1] - g.y) < 8 || Math.abs(p[1] - g.y - g.h) < 8) && Math.abs(p[0] - q[0]) > 20) f(`a line hugs a region edge at y=${p[1]}`)
          }
        }
        // The last segment of an arrow has to be long enough for the head to read.
        const [a, z] = [pts[pts.length - 2], pts[pts.length - 1]]
        const last = Math.hypot(z[0] - a[0], z[1] - a[1])
        if (arrow && !bar && last < 16) f(`a line ends with a ${last.toFixed(0)}px stub`)
      }
    }
    return faults
  })),
)

if (args.shots) {
  mkdirSync(args.shots, { recursive: true })
  // Desktop is the width of the site's content column, phone a 390 px screen.
  for (const [width, tag] of [[688, 'desktop'], [342, 'phone']]) {
    for (const scheme of ['light', 'dark']) {
      await page.evaluate(([w, dark]) => {
        document.documentElement.classList.toggle('dark', dark)
        document.body.style.width = `${w}px`
      }, [width, scheme === 'dark'])
      for (const [i, d] of all.entries()) {
        if (d.standalone && scheme === 'dark') continue
        if (!d.standalone && (d.view === 'narrow') !== (tag === 'phone') && site.some((s) => s.name === d.name && s.view === 'narrow')) continue
        await page.locator(`#d${i}`).screenshot({ path: join(args.shots, `${d.name}-${tag}-${scheme}.png`) })
      }
    }
  }
  console.log(`pictures in ${relative(process.cwd(), args.shots) || '.'}`)
}
await browser.close()

const unique = [...new Set(faults)]
console.log(unique.join('\n') || `${all.length} diagrams, no faults`)
process.exit(unique.length ? 1 : 0)
