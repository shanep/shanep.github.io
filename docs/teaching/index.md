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

## Archive

These guides are out of date and kept for historical purposes only.

- [GitHub Classroom Setup](github-classroom-setup.md)
- [Guide for Adjunct Instructors](adjunct-instructor.md)
