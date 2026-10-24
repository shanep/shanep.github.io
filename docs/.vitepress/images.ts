import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, extname, join, resolve } from 'node:path'
import { imageSize } from 'image-size'
import type MarkdownIt from 'markdown-it'
import sharp from 'sharp'

// Keeps course screenshots from making pages slow. Most of them come straight
// off a Retina screen at 2000 to 3000 px wide and over 1 MB, while the doc
// column is 688 px, so Lighthouse scored those pages in the 70s.
//
// The source files stay as they are, because edutools pushes the same images
// to Canvas. Only the built copies in the site's output change.

// The widest an image is ever shown, with room for a 2x screen.
const MAX_WIDTH = 1600

const docs = resolve(import.meta.dirname, '..')

// The image file a markdown src points to, or null for a remote or missing one.
function localFile(src: string, page: string): string | null {
  if (/^([a-z]+:|\/\/)/i.test(src)) return null
  const path = decodeURI(src.split(/[?#]/)[0])
  const file = path.startsWith('/') ? join(docs, 'public', path) : resolve(dirname(page), path)
  return existsSync(file) ? file : null
}

// Gives every local markdown image its width and height, so the browser saves
// the space before the image loads and the page does not jump. The size is
// the one optimizeImages leaves it at.
export function imageDimensions(md: MarkdownIt): void {
  const render = md.renderer.rules.image!
  md.renderer.rules.image = (tokens, idx, options, env, self) => {
    const token = tokens[idx]
    const file = localFile(token.attrGet('src') ?? '', env.path)
    if (file && !token.attrGet('width')) {
      try {
        const { width, height } = imageSize(readFileSync(file))
        const shown = Math.min(width, MAX_WIDTH)
        token.attrSet('width', String(shown))
        token.attrSet('height', String(Math.round((height * shown) / width)))
      } catch {
        // Not a format image-size reads. The image still shows, it just
        // has no reserved space.
      }
    }
    return render(tokens, idx, options, env, self)
  }
}

// Shrinks every PNG and JPEG in the built site to MAX_WIDTH and compresses it.
// A file is replaced only when the new one is smaller.
export async function optimizeImages(outDir: string): Promise<void> {
  const start = Date.now()
  let before = 0
  let after = 0
  const files = (readdirSync(outDir, { recursive: true }) as string[])
    .filter((rel) => ['.png', '.jpg', '.jpeg'].includes(extname(rel).toLowerCase()))
  for (const rel of files) {
    const file = join(outDir, rel)
    const input = readFileSync(file)
    const image = sharp(input).resize({ width: MAX_WIDTH, withoutEnlargement: true })
    const output = extname(rel).toLowerCase() === '.png'
      ? await image.png({ palette: true, quality: 80, effort: 8, compressionLevel: 9 }).toBuffer()
      : await image.jpeg({ mozjpeg: true, quality: 78 }).toBuffer()
    before += input.length
    if (output.length < input.length) {
      writeFileSync(file, output)
      after += output.length
    } else {
      after += input.length
    }
  }
  const mb = (bytes: number): string => (bytes / 1024 / 1024).toFixed(1)
  console.log(`images: ${files.length} images, ${mb(before)} MB to ${mb(after)} MB in ${Date.now() - start} ms`)
}
