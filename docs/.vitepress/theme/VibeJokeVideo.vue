<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useData } from 'vitepress'

// Plays the AI page joke as a video once the page has loaded. The still
// images stay in the page for the first paint, and anyone who asks for reduced
// motion keeps them. The video has controls, because it runs longer than the
// 5 seconds WCAG 2.2.2 allows without a way to pause it.
const { isDark } = useData()
const play = ref(false)
const label = ref('')

onMounted(() => {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return
  // The still image's alt text describes the video too, so it lives in one place.
  label.value = document.querySelector<HTMLImageElement>('.vibe-joke img')?.alt ?? ''
  play.value = true
})
</script>

<template>
  <video
    v-if="play"
    :key="isDark ? 'dark' : 'light'"
    :src="`/images/vibe-coding-joke-${isDark ? 'dark' : 'light'}.mp4`"
    :poster="`/images/vibe-coding-joke-${isDark ? 'dark' : 'light'}-1400.webp`"
    :aria-label="label"
    width="1400"
    height="900"
    autoplay
    muted
    loop
    playsinline
    controls
  />
</template>
