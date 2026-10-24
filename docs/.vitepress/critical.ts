import { readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import Beasties from 'beasties'

// Puts the CSS each page needs to draw its first screen inline in the page.
// VitePress links one 120 KB stylesheet in the head, and a phone on a slow
// connection shows nothing until it arrives, which cost every page about 0.7
// seconds of First Contentful Paint in Lighthouse.
//
// Beasties keeps the rules that match the page's HTML and moves the full
// stylesheet to the end of the body, where it no longer holds up the first
// paint. The full sheet still loads before the theme's scripts run, so
// anything the scripts change after that is styled.

export async function inlineCriticalCss(outDir: string): Promise<void> {
  const start = Date.now()
  const beasties = new Beasties({
    path: outDir,
    publicPath: '/',
    logLevel: 'warn',
    // An inline script adds the dark class before the first paint, and dark
    // is the default, so the dark rules are kept even though the built HTML
    // has no element with that class. Beasties also misses the icons'
    // [class^=vpi-] selectors, which would leave every icon blank.
    allowRules: [/\.dark\b/, /vpi-/],
    // Leaves the head's own styles alone, so the Inter fallback face in
    // config.mts is not dropped as unused.
    reduceInlineStyles: false,
  })
  const pages = (readdirSync(outDir, { recursive: true }) as string[]).filter((rel) => rel.endsWith('.html'))
  let inlined = 0
  for (const rel of pages) {
    const file = join(outDir, rel)
    // VitePress links its sheets as rel="preload stylesheet", which Beasties
    // does not treat as a stylesheet.
    const html = readFileSync(file, 'utf8').replace(/rel="preload stylesheet"([^>]*) as="style"/g, 'rel="stylesheet"$1')
    const out = await beasties.process(html)
    writeFileSync(file, out)
    inlined += out.length - html.length
  }
  console.log(`critical css: ${pages.length} pages, ${(inlined / 1024 / pages.length).toFixed(1)} KB inlined per page in ${Date.now() - start} ms`)
}
