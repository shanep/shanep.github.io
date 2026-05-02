<script setup lang="ts">
import { ref, nextTick, onMounted, onUnmounted } from 'vue'
import 'reveal.js/reveal.css'
import 'reveal.js/theme/simple.css'

const active = ref(false)
const deckEl = ref<HTMLElement | null>(null)
const slides = ref<string[]>([])
let reveal: { destroy(): void } | null = null

function clean(html: string): string {
  const div = document.createElement('div')
  div.innerHTML = html
  div.querySelectorAll('.header-anchor').forEach(el => el.remove())
  return div.innerHTML
}

function gatherSlides(): string[] {
  const doc = document.querySelector('.vp-doc')
  if (!doc) return []

  const result: string[] = []

  const h1 = doc.querySelector('h1')
  if (h1) result.push(`<h1>${clean(h1.innerHTML)}</h1>`)

  const h2s = Array.from(doc.querySelectorAll('h2'))
  for (let i = 0; i < h2s.length; i++) {
    const h2 = h2s[i]
    const nextH2 = h2s[i + 1] ?? null
    let html = `<h2>${clean(h2.innerHTML)}</h2>`
    let node = h2.nextElementSibling
    while (node && node !== nextH2) {
      html += node.outerHTML
      node = node.nextElementSibling
    }
    result.push(html)
  }

  return result
}

async function open() {
  slides.value = gatherSlides()
  if (!slides.value.length) return
  active.value = true
  await nextTick()
  if (!deckEl.value) return

  const { default: Reveal } = await import('reveal.js')

  reveal = new Reveal(deckEl.value, {
    plugins: [],
    hash: false,
    controls: true,
    progress: true,
    slideNumber: 'c/t',
    transition: 'slide',
    backgroundTransition: 'fade',
    width: '100%',
    height: '100%',
    margin: 0.08,
  })
  await (reveal as any).initialize()
}

function close() {
  reveal?.destroy()
  reveal = null
  active.value = false
  slides.value = []
}

function onKey(e: KeyboardEvent) {
  if (e.key === 'Escape' && active.value) close()
}

onMounted(() => window.addEventListener('keydown', onKey))
onUnmounted(() => {
  window.removeEventListener('keydown', onKey)
  close()
})
</script>

<template>
  <button class="slide-trigger" :class="{ hidden: active }" @click="open" title="View as slides">
    ▶ Slides
  </button>

  <Teleport to="body">
    <div v-if="active" class="slide-overlay">
      <div ref="deckEl" class="reveal">
        <div class="slides">
          <section
            v-for="(slide, i) in slides"
            :key="i"
            v-html="slide"
          />
        </div>
      </div>
      <button class="slide-close" @click="close" title="Close slides (Esc)">✕</button>
    </div>
  </Teleport>
</template>

<style scoped>
.slide-trigger {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  margin: 1rem 0 1.5rem;
  padding: 0.4rem 1rem;
  border-radius: 6px;
  border: 1px solid var(--vp-c-brand-1);
  background: transparent;
  color: var(--vp-c-brand-1);
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
}

.slide-trigger:hover {
  background: var(--vp-c-brand-1);
  color: #fff;
}

.slide-trigger.hidden {
  visibility: hidden;
}
</style>

<style>
/* Unscoped — lives in Teleport outside component DOM */
.slide-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: #fff;
}

.slide-overlay .reveal {
  width: 100%;
  height: 100%;
}

.slide-close {
  position: fixed;
  top: 1rem;
  right: 1rem;
  z-index: 10000;
  width: 2.2rem;
  height: 2.2rem;
  border-radius: 50%;
  border: none;
  background: rgba(0, 0, 0, 0.08);
  color: #333;
  font-size: 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.15s;
}

.slide-close:hover {
  background: rgba(0, 0, 0, 0.18);
}

.slide-overlay .reveal .slides img {
  display: block;
  margin: 0.5rem auto;
  max-height: 55vh;
  object-fit: contain;
}

.slide-overlay .reveal .slides [class*="language-"] {
  width: 90%;
  margin: 0.5rem auto;
}

.slide-overlay .reveal .slides pre {
  width: 100%;
  margin: 0;
  box-shadow: none;
}

.slide-overlay .reveal .slides pre code {
  max-height: 55vh;
  font-size: 0.85em;
  line-height: 1.5;
}

.slide-overlay .reveal .slides .lang,
.slide-overlay .reveal .slides .copy {
  display: none;
}

.slide-overlay .reveal .slides .cols {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  align-items: start;
}

.slide-overlay .reveal .slides .cols .col > :first-child { margin-top: 0; }
.slide-overlay .reveal .slides .cols .col > :last-child  { margin-bottom: 0; }
</style>
