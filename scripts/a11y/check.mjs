// Accessibility check for one course, against WCAG 2.2 A and AA (which
// includes 2.1 AA), or AAA with --level aaa. Run it through check.sh, which
// installs the tools and builds the site first.
//
// usage: node check.mjs --course cs331 [--level aa|aaa] [--canvas <snapshot dir>] [--out results.json]
//
// On every built page of the course, in light and in dark mode:
//   - axe-core with the wcag2a, wcag2aa, wcag21a, wcag21aa, wcag22aa and
//     best-practice rules
//   - every contrast node axe cannot decide (usually text over a layered
//     background), worked out by hand against the first opaque background
//   - link text that says nothing ("click here"), is a raw URL, or is the same
//     text pointing at two places (2.4.4)
// Once per page, in light mode:
//   - reflow at 320 CSS px, the width of 1280 px at 400% zoom (1.4.10)
//   - a visible focus indicator on every tab stop (2.4.7)
// With --canvas, axe and the link checks also run over every body in an
// `edutools pull` snapshot, framed the way Canvas shows it.
//
// --level aaa adds axe's wcag2aaa rules, raises the hand contrast check to
// 7:1 (4.5:1 for large text), and checks what axe does not:
//   - 2.4.12 and 2.4.13: the focused element is not under the sticky nav bar,
//     and its focus ring is at least 2 px with 3:1 contrast
//   - 2.5.5: every target outside a sentence is at least 44 by 44 px
//   - 3.2.5: a link that opens a new tab says so in its name
//   - 1.4.8: body text has line spacing of at least 1.5, paragraph spacing of
//     at least 1.5 line heights, and is not justified
//   - 1.4.9: no image whose alt text reads like a title (an image of text)
//     outside the site's own logo
// Some AAA criteria need a person (reading level, abbreviations, unusual
// words), so a clean AAA run is necessary but not enough.
//
// Prints a summary and exits 1 if anything fails.
import { chromium } from 'playwright'
import AxeBuilder from '@axe-core/playwright'
import { createServer } from 'node:http'
import { existsSync, globSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import { extname, join, resolve } from 'node:path'
import { parseArgs } from 'node:util'

const { values: args } = parseArgs({
  options: { course: { type: 'string' }, level: { type: 'string', default: 'aa' }, canvas: { type: 'string' }, out: { type: 'string' } },
})
const AAA = args.level === 'aaa'
if (!args.course) {
  console.error('usage: node check.mjs --course <id> [--canvas <snapshot dir>] [--out <file>]')
  process.exit(2)
}
const root = resolve(import.meta.dirname, '../..')
const dist = join(root, 'docs/.vitepress/dist')
const TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice']
if (AAA) TAGS.push('wcag2aaa')

// The site uses clean URLs, so /cs331/objectives is objectives.html on disk.
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.woff2': 'font/woff2', '.json': 'application/json' }
const server = createServer((req, res) => {
  const path = decodeURIComponent(new URL(req.url, 'http://x').pathname)
  const file = [path, path + '.html', join(path, 'index.html')]
    .map((p) => join(dist, p))
    .find((f) => f.startsWith(dist) && existsSync(f) && statSync(f).isFile())
  if (!file) { res.writeHead(404).end(); return }
  res.writeHead(200, { 'content-type': TYPES[extname(file)] ?? 'application/octet-stream' })
  res.end(readFileSync(file))
})
await new Promise((ok) => server.listen(0, '127.0.0.1', ok))
const base = `http://127.0.0.1:${server.address().port}`

const pages = globSync(`${args.course}/**/*.html`, { cwd: dist }).sort()
if (!pages.length) {
  console.error(`no built pages under ${dist}/${args.course}`)
  process.exit(2)
}

const found = { axe: [], review: [], contrast: [], links: [], reflow: [], focus: [], canvas: [], targets: [], text: [] }
const nodes = (v) => v.nodes.map((n) => ({ target: n.target.join(' '), html: n.html.slice(0, 200), summary: n.failureSummary }))

// Contrast of every text node inside each selector, against the first opaque
// background up the ancestor chain. Large text (24 px, or 18.66 px bold) needs
// 3:1, the rest 4.5:1. Glyphs hidden from assistive tech are icons and need 3:1.
function contrastOf([selectors, aaa]) {
  const parse = (c) => { const m = c.match(/[\d.]+/g).map(Number); return { r: m[0], g: m[1], b: m[2], a: m[3] ?? 1 } }
  const lum = ({ r, g, b }) => {
    const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4 }
    return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b)
  }
  const out = []
  for (const sel of selectors) {
    const e = document.querySelector(sel)
    if (!e) continue
    for (const t of [e, ...e.querySelectorAll('*')]) {
      if (![...t.childNodes].some((c) => c.nodeType === 3 && c.textContent.trim())) continue
      const s = getComputedStyle(t)
      let bg = { r: 255, g: 255, b: 255 }
      for (let a = t; a; a = a.parentElement) {
        const c = parse(getComputedStyle(a).backgroundColor)
        if (c.a >= 1) { bg = c; break }
      }
      const [hi, lo] = [lum(parse(s.color)), lum(bg)].sort((x, y) => y - x)
      const ratio = (hi + 0.05) / (lo + 0.05)
      const size = parseFloat(s.fontSize)
      const large = size >= 24 || (size >= 18.66 && Number(s.fontWeight) >= 700)
      const need = t.closest('[aria-hidden="true"]') ? 3 : aaa ? (large ? 4.5 : 7) : (large ? 3 : 4.5)
      if (ratio < need) out.push({ target: sel, text: t.textContent.trim().slice(0, 40), color: s.color, ratio: +ratio.toFixed(2), need })
    }
  }
  return out
}

// Link text problems inside one container. With aaa, links anywhere on the
// page must also say when they open a new tab.
function linkProblems([scope, aaa]) {
  const out = []
  if (aaa) for (const a of document.querySelectorAll('a[target="_blank"]')) {
    const text = (a.innerText || a.getAttribute('aria-label') || '').trim().replace(/\s+/g, ' ')
    if (!/new (tab|window)/i.test(text)) out.push({ problem: 'opens a new tab without saying so', text, href: a.getAttribute('href') })
  }
  const GENERIC = /^(click here|here|this|link|more|read more|this link|this page|page|website|download)$/i
  const targets = new Map()
  for (const a of document.querySelectorAll(`${scope} a[href]`)) {
    if (a.classList.contains('header-anchor')) continue
    const text = (a.innerText || a.getAttribute('aria-label') || [...a.querySelectorAll('img')].map((i) => i.alt).join(' ')).trim().replace(/\s+/g, ' ')
    const href = a.getAttribute('href')
    // Compare where links go, not how they are written: ./../ and /cs331/index are the same page.
    const dest = a.href.replace(/[?#].*/, '').replace(/(\/index)?(\.html)?$/, '').replace(/\/$/, '')
    if (GENERIC.test(text)) out.push({ problem: 'says nothing', text, href })
    if (/^(https?:\/\/|www\.)/.test(text)) out.push({ problem: 'raw URL', text, href })
    if (text && !href.startsWith('#')) {
      const key = text.toLowerCase()
      const set = targets.get(key) ?? new Set()
      set.add(dest)
      targets.set(key, set)
    }
  }
  for (const [text, set] of targets) if (set.size > 1) out.push({ problem: 'same text, different targets', text, href: [...set].join(' ') })
  return out
}

// 2.5.5: targets under 44 by 44 px. The criterion exempts a target "in a
// sentence or block of text", which here means an inline link in a paragraph,
// list item or table cell of the page body. The size is what takes a click,
// so a small element passes when the clickable area through its center is
// 44 px each way (a pseudo-element can widen it without changing the look). An
// element hidden until focused, like the skip link, is measured focused.
function smallTargets() {
  const out = []
  // Walk out from the center in each direction until a point no longer
  // lands on the element, and measure the clickable width and height.
  const hits = (e) => {
    const r = e.getBoundingClientRect()
    const [x, y] = [r.left + r.width / 2, r.top + r.height / 2]
    const on = (px, py) => { const h = document.elementFromPoint(px, py); return h && (h === e || e.contains(h)) }
    const reach = (dx, dy) => { let d = 0; while (d < 60 && on(x + dx * (d + 1), y + dy * (d + 1))) d++; return d }
    return reach(-1, 0) + reach(1, 0) + 1 >= 44 && reach(0, -1) + reach(0, 1) + 1 >= 44
  }
  for (const e of document.querySelectorAll('a[href], button, [role="button"], input, select, summary, [tabindex="0"]')) {
    const s = getComputedStyle(e)
    if (s.visibility === 'hidden' || e.closest('[aria-hidden="true"], [inert]')) continue
    const hidden = s.clip !== 'auto' || s.clipPath !== 'none'
    if (hidden) e.focus()
    let r = e.getBoundingClientRect()
    if (!r.width || !r.height) { if (hidden) e.blur(); continue }
    if (s.display === 'inline' && e.closest('.vp-doc p, .vp-doc li, .vp-doc td, .vp-doc th, .vp-doc dd, .vp-doc blockquote')) continue
    let ok = r.width >= 44 && r.height >= 44
    if (!ok) {
      e.scrollIntoView({ block: 'center', inline: 'center', behavior: 'instant' })
      r = e.getBoundingClientRect()
      ok = hits(e)
    }
    if (hidden) e.blur()
    if (ok) continue
    const text = (e.innerText || e.getAttribute('aria-label') || '').trim().slice(0, 40)
    out.push({ element: `${e.tagName.toLowerCase()}.${(typeof e.className === 'string' ? e.className : '').trim().split(/\s+/)[0]}`, text, size: `${Math.round(r.width)}x${Math.round(r.height)}` })
  }
  return out
}

// 1.4.8 and 1.4.9: spacing and alignment of body text, and images of text.
function textSpacing() {
  const out = []
  for (const p of document.querySelectorAll('.vp-doc p')) {
    if (!p.textContent.trim()) continue
    const s = getComputedStyle(p)
    const size = parseFloat(s.fontSize)
    const line = s.lineHeight === 'normal' ? size * 1.2 : parseFloat(s.lineHeight)
    if (line / size < 1.5) out.push({ problem: 'line spacing under 1.5', text: p.textContent.trim().slice(0, 40), value: +(line / size).toFixed(2) })
    if (s.textAlign === 'justify') out.push({ problem: 'justified text', text: p.textContent.trim().slice(0, 40) })
    const next = p.nextElementSibling
    if (next?.tagName === 'P') {
      const gap = next.getBoundingClientRect().top - p.getBoundingClientRect().bottom
      if (line + gap < 1.5 * line - 0.5) out.push({ problem: 'paragraph spacing under 1.5 lines', text: p.textContent.trim().slice(0, 40), value: +((line + gap) / line).toFixed(2) })
    }
  }
  for (const img of document.querySelectorAll('.vp-doc img[alt]')) {
    if (img.alt && /^[A-Z0-9 :&-]{12,}$|^CS ?\d+:/.test(img.alt)) out.push({ problem: 'image of text', text: img.alt })
  }
  return out
}

const browser = await chromium.launch()

for (const scheme of ['light', 'dark']) {
  const ctx = await browser.newContext({ colorScheme: scheme })
  // VitePress reads the theme from localStorage before the media query.
  await ctx.addInitScript((s) => localStorage.setItem('vitepress-theme-appearance', s), scheme)
  const page = await ctx.newPage()
  for (const rel of pages) {
    await page.goto(`${base}/${rel}`, { waitUntil: 'networkidle' })
    const r = await new AxeBuilder({ page }).withTags(TAGS).analyze()
    for (const v of r.violations) found.axe.push({ page: rel, scheme, id: v.id, help: v.help, nodes: nodes(v) })
    for (const v of r.incomplete) {
      found.review.push({ page: rel, scheme, id: v.id, help: v.help, nodes: nodes(v) })
      if (v.id !== 'color-contrast' && v.id !== 'color-contrast-enhanced') continue
      for (const c of await page.evaluate(contrastOf, [v.nodes.map((n) => n.target.join(' ')), AAA])) found.contrast.push({ page: rel, scheme, ...c })
    }
    if (scheme === 'light') {
      for (const l of await page.evaluate(linkProblems, ['.vp-doc', AAA])) found.links.push({ page: rel, ...l })
      if (AAA) {
        for (const t of await page.evaluate(smallTargets)) found.targets.push({ page: rel, ...t })
        for (const t of await page.evaluate(textSpacing)) found.text.push({ page: rel, ...t })
      }
    }
  }
  await ctx.close()
}

// Tables and code blocks may scroll inside their own box (WCAG exempts content
// that needs two dimensions), so only a page that scrolls sideways fails.
const narrow = await (await browser.newContext({ viewport: { width: 320, height: 800 } })).newPage()
for (const rel of pages) {
  await narrow.goto(`${base}/${rel}`, { waitUntil: 'networkidle' })
  const r = await narrow.evaluate(() => {
    const w = document.documentElement.clientWidth
    const wide = [...document.querySelectorAll('.vp-doc *')]
      .filter((e) => e.getBoundingClientRect().right > w + 1 && !e.closest('pre, table, div[class*="language-"]'))
      .slice(0, 3).map((e) => `${e.tagName.toLowerCase()} ${(e.textContent || '').trim().slice(0, 60)}`)
    return { scrollWidth: document.documentElement.scrollWidth, width: w, wide }
  })
  if (r.scrollWidth > r.width + 1 || r.wide.length) found.reflow.push({ page: rel, ...r })
  // Narrow screens swap in their own controls (the menu buttons), so measure targets here too.
  if (AAA) for (const t of await narrow.evaluate(smallTargets)) found.targets.push({ page: rel, width: 320, ...t })
}

// Tab through each page until focus comes back around, and flag any stop with
// no outline and no box-shadow.
const wide = await (await browser.newContext({ viewport: { width: 1280, height: 900 } })).newPage()
for (const rel of pages) {
  await wide.goto(`${base}/${rel}`, { waitUntil: 'networkidle' })
  const seen = new Set()
  for (let i = 0; i < 400; i++) {
    await wide.keyboard.press('Tab')
    const f = await wide.evaluate(() => {
      const e = document.activeElement
      if (!e || e === document.body) return null
      const s = getComputedStyle(e)
      const path = []
      for (let n = e; n && n !== document.body; n = n.parentElement) path.unshift(n.tagName.toLowerCase() + (typeof n.className === 'string' && n.className.trim() ? '.' + n.className.trim().split(/\s+/)[0] : ''))
      // 2.4.13: a ring at least 2 px wide, at 3:1 against the page.
      const parse = (c) => { const m = c.match(/[\d.]+/g).map(Number); return [m[0], m[1], m[2]] }
      const lum = (c) => { const [r, g, b] = c.map((v) => (v /= 255) <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4); return 0.2126 * r + 0.7152 * g + 0.0722 * b }
      const [hi, lo] = [lum(parse(s.outlineColor)), lum(parse(getComputedStyle(document.body).backgroundColor))].sort((x, y) => y - x)
      const ring = s.outlineStyle !== 'none' && parseFloat(s.outlineWidth) >= 2 && (hi + 0.05) / (lo + 0.05) >= 3
      // 2.4.12: no part of it under a fixed or sticky bar it is not inside.
      // Something drawn above the bar, like the skip link, is not covered,
      // so this asks what is on top at the element's corners and center.
      const r = e.getBoundingClientRect()
      const bars = [...document.querySelectorAll('.VPNav, .VPLocalNav')].filter((bar) => !bar.contains(e))
      // The corner points sit 8 px in, past a rounded corner.
      const covered = r.width > 0 && [[r.left + 8, r.top + 8], [r.right - 8, r.top + 8], [r.left + r.width / 2, r.top + r.height / 2]]
        .filter(([, y]) => y >= 0 && y < innerHeight)
        .some(([x, y]) => { const h = document.elementFromPoint(x, y); return h && !e.contains(h) && bars.some((bar) => bar.contains(h)) })
      return {
        key: path.join('>'),
        text: (e.textContent || e.getAttribute('aria-label') || '').trim().slice(0, 50),
        shown: (s.outlineStyle !== 'none' && parseFloat(s.outlineWidth) > 0) || s.boxShadow !== 'none',
        ring, covered,
      }
    })
    if (!f || seen.has(f.key + f.text)) break
    seen.add(f.key + f.text)
    if (!f.shown) found.focus.push({ page: rel, problem: 'no visible focus', element: f.key, text: f.text })
    else if (AAA && !f.ring) found.focus.push({ page: rel, problem: 'focus ring under 2 px or 3:1', element: f.key, text: f.text })
    if (AAA && f.covered) found.focus.push({ page: rel, problem: 'focused element under the nav bar', element: f.key, text: f.text })
  }
}

let bodies = []
if (args.canvas) {
  const snap = resolve(args.canvas)
  bodies = globSync('{pages,assignments,discussions,quizzes}/*.html', { cwd: snap }).sort()
  if (existsSync(join(snap, 'syllabus.html'))) bodies.push('syllabus.html')
  const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;')
  const page = await (await browser.newContext()).newPage()
  // Canvas file URLs need a session. axe reads alt text whether or not the image loads.
  await page.route(/^https?:\/\//, (route) => route.abort())
  for (const rel of bodies) {
    const metaFile = join(snap, rel.replace(/\.html$/, '.json'))
    const meta = existsSync(metaFile) ? JSON.parse(readFileSync(metaFile, 'utf-8')) : {}
    const title = meta.title ?? meta.name ?? 'Syllabus'
    // Canvas shows the item title as the h1 and its own text color on white.
    await page.setContent(`<!doctype html><html lang="en"><head><meta charset="utf-8"><title>${esc(title)}</title></head>
<body style="font-family: Lato, 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #2d3b45; background: #fff; font-size: 16px">
<main><h1>${esc(title)}</h1><div class="user_content">${readFileSync(join(snap, rel), 'utf-8')}</div></main></body></html>`, { waitUntil: 'load' })
    const r = await new AxeBuilder({ page }).withTags(TAGS).analyze()
    for (const v of r.violations) found.canvas.push({ page: rel, title, id: v.id, help: v.help, nodes: nodes(v) })
    for (const l of await page.evaluate(linkProblems, ['.user_content', AAA])) found.canvas.push({ page: rel, title, id: 'link-text', help: l.problem, nodes: [{ target: l.href, html: l.text }] })
  }
}

await browser.close()
server.close()

const failures = {
  'axe violations (site)': found.axe.length,
  'contrast under the minimum, worked out by hand': found.contrast.length,
  'link text problems (site)': found.links.length,
  'pages that do not reflow at 320 px': found.reflow.length,
  [AAA ? 'tab stops with a focus problem' : 'tab stops with no visible focus']: found.focus.length,
  ...(AAA ? { 'targets under 44 by 44 px': found.targets.length, 'text spacing and images of text': found.text.length } : {}),
  ...(args.canvas ? { 'axe violations and link text problems (Canvas)': found.canvas.length } : {}),
}
console.log(`${args.course} (WCAG 2.2 ${AAA ? 'AAA' : 'AA'}): ${pages.length} site pages in light and dark mode${args.canvas ? `, ${bodies.length} Canvas bodies` : ''}`)
for (const [what, n] of Object.entries(failures)) console.log(`  ${String(n).padStart(4)}  ${what}`)
const reviewIds = [...new Set(found.review.map((r) => r.id))].join(', ')
console.log(`  ${String(found.review.length).padStart(4)}  needs-review groups from axe (${reviewIds || 'none'}); contrast ones are checked above`)
for (const list of [found.axe, found.contrast, found.links, found.reflow, found.focus, found.canvas, found.targets, found.text]) {
  for (const f of list.slice(0, 20)) console.log('  -', JSON.stringify(f).slice(0, 240))
}
if (args.out) writeFileSync(args.out, JSON.stringify({ course: args.course, level: args.level, pages: pages.length, canvasBodies: bodies.length, ...found }, null, 1) + '\n')
process.exit(Object.values(failures).some((n) => n > 0) ? 1 : 0)
