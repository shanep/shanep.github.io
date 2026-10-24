---
layout: home

title: Teaching

hero:
  name: Teaching
  tagline: Courses and guides for my students at Boise State

features:
  - title: "CS331: Computer Security and Information Assurance"
    details: Security goals, access control, common software and network vulnerabilities, cryptography, and security policy.
    link: /cs331/
    icon: { src: /card-icons/security.svg, width: 48, height: 48, role: presentation }
    linkText: Course page
  - title: "CS408: Full Stack Web Development"
    details: Client-side and server-side web development with HTML, CSS, JavaScript and Node.js, from templating to serverless deployment.
    link: /cs408/
    icon: { src: /card-icons/web.svg, width: 48, height: 48, role: presentation }
    linkText: Course page
  - title: "CS425: Computer Networks"
    details: Networking from the physical layer up to the application layer, plus wireless networking and security basics.
    link: /cs425/
    icon: { src: /card-icons/network.svg, width: 48, height: 48, role: presentation }
    linkText: Course page
  - title: "CS452: Operating Systems"
    details: Processes, concurrency, synchronization, scheduling, memory management, file systems and security.
    link: /cs452/
    icon: { src: /card-icons/os.svg, width: 48, height: 48, role: presentation }
    linkText: Course page

guides:
  - title: GitHub Tips and Tricks
    details: The setup you need once, the habits that will save you the night a project is due, and features most students never find.
    link: /teaching/github-tips-and-tricks
    icon: { src: /card-icons/git.svg, width: 48, height: 48, role: presentation }
    linkText: Read the guide
  - title: GitHub Codespaces
    details: VS Code in the cloud. A full Linux machine with a terminal and an editor, and all you need is a web browser.
    link: /teaching/github-codespaces
    icon: { src: /card-icons/cloud.svg, width: 48, height: 48, role: presentation }
    linkText: Read the guide
  - title: VS Code Tips and Tricks
    details: Getting the editor we use in all of my classes set up, and the features that make you a lot faster.
    link: /teaching/vscode-tips-and-tricks
    icon: { src: /card-icons/tips.svg, width: 48, height: 48, role: presentation }
    linkText: Read the guide
  - title: VS Code Remote Development
    details: Connect VS Code on your computer to Onyx, the CS department's Linux server, without installing Linux yourself.
    link: /teaching/vscode-remote-dev
    icon: { src: /card-icons/remote.svg, width: 48, height: 48, role: presentation }
    linkText: Read the guide

instructors:
  - title: boisestate.ai Capabilities
    details: What the campus AI gateway can and cannot do for a class, from my load test of 45 requests at the same time.
    link: /teaching/boisestate-ai
    icon: { src: /card-icons/sparkle.svg, width: 48, height: 48, role: presentation }
    linkText: Read the review

ai:
  - title: An Agentic Software Workflow
    details: The workflow I am moving to after 3 months of building with Claude Code, where agents do the work and the tests decide when it is done.
    link: /teaching/agentic-workflow
    icon: { src: /card-icons/workflow.svg, width: 48, height: 48, role: presentation }
    linkText: Read the workflow
  - title: My Claude Code Setup
    details: How I keep the same Claude config on every machine, and how I hand work off to a new session.
    link: /teaching/claude-code-setup
    icon: { src: /card-icons/setup.svg, width: 48, height: 48, role: presentation }
    linkText: Read the setup
---

<script setup>
import { VPFeatures } from 'vitepress/theme'
</script>

## Student Guides

<div class="vp-raw">
<VPFeatures :features="$frontmatter.guides" />
</div>

## For Instructors

<div class="vp-raw">
<VPFeatures :features="$frontmatter.instructors" />
</div>

## AI

Notes on how I use AI tools, mostly Claude Code.

<div class="vp-raw">
<VPFeatures :features="$frontmatter.ai" />
</div>

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

## Archive

These guides are out of date and kept for historical purposes only.

- [GitHub Classroom Setup](github-classroom-setup.md)
- [Guide for Adjunct Instructors](adjunct-instructor.md)
