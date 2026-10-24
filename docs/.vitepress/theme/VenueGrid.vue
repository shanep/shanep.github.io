<script setup lang="ts">
// The conference and journal cards on the Research page. A conference shows
// its short name on a gradient tile and its CORE rank on a seal, and a journal
// shows its impact factor as a big number. The data lives in the page's
// frontmatter.

export interface Conference {
  short: string
  name: string
  rank: string
  link: string
}

export interface Journal {
  name: string
  impact: string
  year: string
  track?: string
  link: string
}

defineProps<{ conferences?: Conference[]; journals?: Journal[] }>()
</script>

<template>
  <div class="venue-grid">
    <a v-for="c in conferences" :key="c.short" class="venue" :href="c.link">
      <div class="venue-top">
        <span class="monogram">{{ c.short }}</span>
        <span class="seal" :class="{ top: c.rank === 'A*', unranked: c.rank === 'Unranked' }">
          <span class="seal-label">CORE</span>
          <span class="seal-rank">{{ c.rank === 'Unranked' ? 'none' : c.rank }}</span>
        </span>
      </div>
      <p class="venue-name">{{ c.name }}</p>
      <span class="venue-link">Website <span aria-hidden="true">&rarr;</span></span>
    </a>
    <a v-for="j in journals" :key="j.name" class="venue" :href="j.link">
      <p class="venue-name journal">{{ j.name }}</p>
      <p class="impact">
        <span class="impact-number">{{ j.impact }}</span>
        <span class="impact-label">impact factor, {{ j.year }}</span>
      </p>
      <span class="card-tags"><span v-if="j.track">{{ j.track }} journal-first</span></span>
      <span class="venue-link">Website <span aria-hidden="true">&rarr;</span></span>
    </a>
  </div>
</template>

<style scoped>
.venue-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 16px;
  margin-top: 16px;
}

.venue {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 24px;
  border: 1px solid var(--vp-c-bg-soft);
  border-radius: 12px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-text-1);
  text-decoration: none;
  overflow: hidden;
}

/* A thin gradient rule along the top of every card. */
.venue::before {
  content: '';
  position: absolute;
  inset: 0 0 auto;
  height: 4px;
  background: var(--vp-home-hero-name-background);
}

.venue:focus-visible {
  border-color: var(--vp-c-brand-1);
}

@media (prefers-reduced-motion: no-preference) {
  .venue {
    transition: border-color 0.25s, transform 0.25s, box-shadow 0.25s;
  }

  .venue:hover,
  .venue:focus-visible {
    transform: translateY(-3px);
    box-shadow: var(--vp-shadow-3);
  }
}

.venue-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.monogram {
  display: inline-flex;
  align-items: center;
  height: 48px;
  padding: 0 14px;
  border-radius: 12px;
  background: linear-gradient(135deg, #0a4f8a, #0b5a4a);
  color: #fff;
  font-family: var(--vp-font-family-mono);
  font-size: 20px;
  font-weight: 700;
}

.seal {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  flex: none;
  border: 2px solid var(--vp-c-brand-1);
  border-radius: 50%;
  color: var(--vp-c-brand-1);
  line-height: 1;
}

.seal.top {
  border-color: transparent;
  background: linear-gradient(135deg, #0a4f8a, #0b5a4a);
  color: #fff;
}

.seal.unranked {
  border-style: dashed;
  border-color: var(--vp-c-text-2);
  color: var(--vp-c-text-2);
}

.seal-label {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.08em;
}

.seal-rank {
  margin-top: 2px;
  font-size: 18px;
  font-weight: 700;
}

.seal.unranked .seal-rank {
  font-size: 13px;
}

.venue-name {
  margin: 0;
  flex: 1;
  font-size: 14px;
  line-height: 22px;
  color: var(--vp-c-text-2);
}

.venue-name.journal {
  font-size: 16px;
  font-weight: 600;
  line-height: 24px;
  color: var(--vp-c-text-1);
}

.impact {
  display: flex;
  align-items: baseline;
  gap: 10px;
  margin: 0;
}

.impact-number {
  font-family: var(--vp-font-family-mono);
  font-size: 44px;
  font-weight: 700;
  line-height: 1;
  background: var(--vp-home-hero-name-background);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.impact-label {
  font-size: 13px;
  color: var(--vp-c-text-2);
}

.venue .card-tags {
  margin: 0;
  min-height: 24px;
}

.venue-link {
  font-size: 14px;
  font-weight: 500;
  color: var(--vp-c-brand-1);
}
</style>
