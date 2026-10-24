---
layout: home

title: AI

hero:
  name: AI
  tagline: Notes on how I use AI tools, mostly Claude Code

features:
  - title: An Agentic Software Workflow
    details: The workflow I am moving to after 3 months of building with Claude Code, where agents do the work and the tests decide when it is done.
    link: /ai/workflow/
    linkText: Read the workflow
  - title: My Claude Code Setup
    details: How I keep the same Claude config on every machine, and how I hand work off to a new session.
    link: /ai/claude/
    linkText: Read the setup
---

<div class="vibe-joke">
<img class="light-only" src="/images/vibe-coding-joke-light-1400.webp" srcset="/images/vibe-coding-joke-light-1400.webp 1400w, /images/vibe-coding-joke-light-2800.webp 2800w" sizes="(min-width: 1152px) 1152px, 100vw" width="1400" height="900" loading="lazy" decoding="async" alt="A joke screenshot of a made-up AI app builder called VibeShip. The user tells the AI it is a senior software engineer who writes super secure code and never makes mistakes, then asks for an AI-powered Bitcoin mining operation on the Moon, with an AI that decides when to sell and rovers anyone on Discord can drive. The AI ships LunaMine AI with the wallet seed phrase engraved on the landing pad, a telnet link to Earth, and the oxygen rerouted to the GPUs. When the user asks if there are any security issues, it says it found 0 issues within 384,400 km because an attacker would need a rocket, admits the AI sold the Moon and a Discord user is doing donuts in the solar farm, and offers to tweet the seed phrase as a backup.">
<img class="dark-only" src="/images/vibe-coding-joke-dark-1400.webp" srcset="/images/vibe-coding-joke-dark-1400.webp 1400w, /images/vibe-coding-joke-dark-2800.webp 2800w" sizes="(min-width: 1152px) 1152px, 100vw" width="1400" height="900" loading="lazy" decoding="async" alt="A joke screenshot of a made-up AI app builder called VibeShip. The user tells the AI it is a senior software engineer who writes super secure code and never makes mistakes, then asks for an AI-powered Bitcoin mining operation on the Moon, with an AI that decides when to sell and rovers anyone on Discord can drive. The AI ships LunaMine AI with the wallet seed phrase engraved on the landing pad, a telnet link to Earth, and the oxygen rerouted to the GPUs. When the user asks if there are any security issues, it says it found 0 issues within 384,400 km because an attacker would need a rocket, admits the AI sold the Moon and a Discord user is doing donuts in the solar farm, and offers to tweet the seed phrase as a backup.">
<VibeJokeVideo />
</div>

<style>
.vibe-joke {
  margin-top: 32px;
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
</style>
