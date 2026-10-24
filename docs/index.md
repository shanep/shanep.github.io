---
layout: home

title: Shane K. Panter
titleTemplate: Personal Website

hero:
  name: Shane K. Panter
  text: Assistant Clinical Professor
  tagline: Boise State University
  actions:
    - theme: brand
      text: CV
      link: /cv/
    - theme: alt
      text: Research
      link: /research/
    - theme: alt
      text: Teaching
      link: /teaching/
    - theme: alt
      text: AI
      link: /ai/
  image:
    src: /images/shane_panter_cutout.webp
    alt: Shane K. Panter
---

<style>
:root {
  --vp-home-hero-name-color: transparent;
  --vp-home-hero-name-background: -webkit-linear-gradient(120deg, #0a4f8a 30%, #0b5a4a);
}

.dark {
  --vp-home-hero-name-background: -webkit-linear-gradient(120deg, #9ad2ff 30%, #5ee0c0);
}

/* The photo is cut out of its grey backdrop (macOS Vision's subject lift on
   shane_panter.jpeg), so the page background shows around it. The bottom
   fades out so the hoodie does not end in a hard line. */
.VPHero .image-src {
  -webkit-mask-image: linear-gradient(to bottom, #000 78%, transparent);
  mask-image: linear-gradient(to bottom, #000 78%, transparent);
}

.vibe-joke img,
.vibe-joke video {
  display: block;
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  border: 1px solid var(--vp-c-divider);
}

.vibe-joke .dark-only,
.dark .vibe-joke .light-only {
  display: none;
}

.dark .vibe-joke .dark-only {
  display: block;
}

/* VibeJokeVideo takes the stills' place once it plays. */
.vibe-joke:has(video) img,
.dark .vibe-joke:has(video) .dark-only {
  display: none;
}

.VPHero .text {
  font-size: 1.5rem !important;
  line-height: 1.4 !important;
}

@media (min-width: 640px) {
  .VPHero .text {
    font-size: 1.75rem !important;
  }
}
</style>

<div class="vibe-joke">
<img class="light-only" src="/images/vibe-coding-joke-light-1400.webp" srcset="/images/vibe-coding-joke-light-1400.webp 1400w, /images/vibe-coding-joke-light-2800.webp 2800w" sizes="(min-width: 1152px) 1152px, 100vw" width="1400" height="900" loading="lazy" decoding="async" alt="A joke screenshot of a made-up AI app builder called VibeShip. The user tells the AI it is a senior software engineer who writes super secure code and never makes mistakes, then asks for an AI-powered Bitcoin mining operation on the Moon, with an AI that decides when to sell and rovers anyone on Discord can drive. The AI ships LunaMine AI with the wallet seed phrase engraved on the landing pad, a telnet link to Earth, and the oxygen rerouted to the GPUs. When the user asks if there are any security issues, it says it found 0 issues within 384,400 km because an attacker would need a rocket, admits the AI sold the Moon and a Discord user is doing donuts in the solar farm, and offers to tweet the seed phrase as a backup.">
<img class="dark-only" src="/images/vibe-coding-joke-dark-1400.webp" srcset="/images/vibe-coding-joke-dark-1400.webp 1400w, /images/vibe-coding-joke-dark-2800.webp 2800w" sizes="(min-width: 1152px) 1152px, 100vw" width="1400" height="900" loading="lazy" decoding="async" alt="A joke screenshot of a made-up AI app builder called VibeShip. The user tells the AI it is a senior software engineer who writes super secure code and never makes mistakes, then asks for an AI-powered Bitcoin mining operation on the Moon, with an AI that decides when to sell and rovers anyone on Discord can drive. The AI ships LunaMine AI with the wallet seed phrase engraved on the landing pad, a telnet link to Earth, and the oxygen rerouted to the GPUs. When the user asks if there are any security issues, it says it found 0 issues within 384,400 km because an attacker would need a rocket, admits the AI sold the Moon and a Discord user is doing donuts in the solar farm, and offers to tweet the seed phrase as a backup.">
<VibeJokeVideo />
</div>

## Bio

Shane Panter is an Assistant Clinical Professor of Computer Science at Boise
State University, where he has taught since 2013. He teaches Operating Systems,
Computer Networks, Computer Security, and Full Stack Web Development, and he
holds a Ph.D. in Computing and an M.S. in Computer Science. Before joining
academia, he spent a decade in industry working in IT and networking,
enterprise software development, and embedded firmware. His research is in
empirical software engineering and software security, with a focus on the
software supply chain. His recent work looks at what happens to software when
the open source packages it depends on fall behind or are abandoned. He is also
Co-PI on two NSA-funded cybersecurity education grants.

## Links

- LinkedIn: [Shane Panter](https://www.linkedin.com/in/shanepanter)
- ORCID ID: [0009-0009-1852-3655](https://orcid.org/0009-0009-1852-3655)
- Google Scholar: [Shane Panter](https://scholar.google.com/citations?user=0B7MuswAAAAJ&hl=en)
