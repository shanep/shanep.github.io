import { execFile } from 'node:child_process'
import { join, resolve } from 'node:path'
import { promisify } from 'node:util'
import type { Plugin } from 'vite'

const run = promisify(execFile)

// Builds the CV PDFs (scripts/cv/build.sh) as part of the site, so
// `docs:build` ships fresh PDFs and `docs:dev` rebuilds them whenever the CV
// page, the LaTeX template, or the pandoc filter changes.
//
// The PDFs need pandoc and LaTeX (Tectonic or pdflatex). If they cannot be
// built, `docs:build` fails, locally and in CI, so the site never ships stale
// or missing PDFs. The dev server prints the error and keeps running, so the
// next save can fix it.
export function cvPdf(): Plugin {
  const root = resolve(import.meta.dirname, '../..')
  const script = join(root, 'scripts/cv/build.sh')
  const sources = [join(root, 'docs/cv/index.md'), join(root, 'scripts/cv')]
  let built = false

  async function build(): Promise<void> {
    const start = Date.now()
    try {
      await run(script, { cwd: root })
    } catch (err) {
      const e = err as { stderr?: string; message: string }
      throw new Error(`cv-pdf: the CV PDFs did not build\n${e.stderr?.trim() || e.message}`)
    }
    console.log(`cv-pdf: built CV PDFs in ${Date.now() - start} ms`)
  }

  // The dev server keeps running when a build fails; the error is printed
  // and the next save tries again.
  function rebuild(): void {
    build().catch((err: Error) => console.error(err.message))
  }

  return {
    name: 'cv-pdf',

    // VitePress runs a client and a server build in the same process, and
    // each calls buildStart; the PDFs only need building once.
    async buildStart() {
      if (this.meta.watchMode || built) return
      built = true
      await build()
    },

    configureServer(server) {
      rebuild()
      server.watcher.add(sources)
      server.watcher.on('change', (file) => {
        if (sources.some((s) => file === s || file.startsWith(s + '/'))) {
          rebuild()
        }
      })
    },
  }
}
