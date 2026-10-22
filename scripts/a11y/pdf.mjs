// Render a Markdown report to a tagged PDF next to it, for email.
//
// usage: npm run a11y:pdf -- reviews/cs331-accessibility-2026-10.md
//
// pandoc turns the Markdown into one HTML page and Chromium prints it. The PDF
// is tagged (headings, lists and tables reach a screen reader) and its outline
// follows the headings, so the report passes the checks it describes.
import { chromium } from 'playwright'
import { execFileSync } from 'node:child_process'
import { resolve } from 'node:path'

const [input] = process.argv.slice(2)
if (!input) {
  console.error('usage: node pdf.mjs <report.md>')
  process.exit(2)
}
const md = resolve(input)
const pdf = md.replace(/\.md$/, '.pdf')

const css = `
body { font: 11pt/1.45 -apple-system, 'Helvetica Neue', Arial, sans-serif; color: #1f2328; max-width: none; margin: 0; padding: 0; }
header { margin-bottom: 2em; }
h1.title { font-size: 20pt; margin: 0; }
p.subtitle { font-size: 13pt; margin: 0.2em 0; }
p.author, p.date { margin: 0; color: #424a53; }
h2 { font-size: 14pt; border-bottom: 1px solid #d1d9e0; padding-bottom: 0.2em; margin-top: 1.6em; }
h3 { font-size: 12pt; }
table { border-collapse: collapse; width: 100%; table-layout: auto; margin: 0.8em 0; font-size: 9.5pt; display: table; }
th, td { border: 1px solid #d1d9e0; padding: 0.3em 0.5em; text-align: left; vertical-align: top; }
th { background: #f6f8fa; }
tr { break-inside: avoid; }
code { font: 9.5pt ui-monospace, Menlo, monospace; }
pre { background: #f6f8fa; padding: 0.6em; overflow-wrap: anywhere; white-space: pre-wrap; }
a { color: #0349b4; }
`
const html = execFileSync('pandoc', [md, '--from', 'markdown', '--to', 'html5', '--standalone',
  '--metadata', 'lang=en', '--variable', `header-includes=<style>${css}</style>`], { encoding: 'utf-8' })

const browser = await chromium.launch()
const page = await browser.newPage()
await page.setContent(html, { waitUntil: 'load' })
await page.pdf({
  path: pdf, format: 'Letter', tagged: true, outline: true, printBackground: true,
  margin: { top: '0.8in', bottom: '0.8in', left: '0.8in', right: '0.8in' },
})
await browser.close()
console.log(`wrote ${pdf}`)
