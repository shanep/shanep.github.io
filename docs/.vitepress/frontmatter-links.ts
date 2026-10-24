import { existsSync } from 'node:fs'
import { join } from 'node:path'

// Checks the links in each page's frontmatter, which VitePress's dead link
// check never sees: the hero buttons and the cards on the landing pages, and
// any href in a card's text. A link to a page that does not exist fails the
// build, the same as a dead link in the page body.
//
// collectFrontmatterLinks runs from transformPageData while the pages build,
// and checkFrontmatterLinks runs from buildEnd, once every page is on disk.

// Keyed by page, so the dev server, which runs the hook on every request,
// keeps one entry per page instead of piling them up.
const links = new Map<string, string[]>()

export function collectFrontmatterLinks(page: string, frontmatter: Record<string, unknown>): void {
  const hrefs: string[] = []
  const walk = (value: unknown, key: string): void => {
    if (typeof value === 'string') {
      if (key === 'link') hrefs.push(value)
      for (const match of value.matchAll(/href="([^"]+)"/g)) hrefs.push(match[1])
    } else if (Array.isArray(value)) {
      for (const item of value) walk(item, key)
    } else if (value && typeof value === 'object') {
      for (const [k, v] of Object.entries(value)) walk(v, k)
    }
  }
  walk(frontmatter, '')
  links.set(page, hrefs)
}

export function checkFrontmatterLinks(outDir: string): void {
  const all = [...links].flatMap(([page, hrefs]) => hrefs.map((href) => ({ page, href })))
  const dead = all.filter(({ href }) => {
    // Only links into this site can be checked here.
    if (!href.startsWith('/') || href.startsWith('//')) return false
    const path = decodeURI(href.replace(/[?#].*$/, ''))
    const candidates = path.endsWith('/')
      ? [join(outDir, path, 'index.html')]
      : [join(outDir, path), join(outDir, `${path}.html`)]
    return !candidates.some((file) => existsSync(file))
  })
  if (dead.length) {
    const list = dead.map(({ page, href }) => `  ${page}: ${href}`).join('\n')
    throw new Error(`Dead links in frontmatter:\n${list}`)
  }
}
