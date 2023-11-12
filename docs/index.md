---
layout: home

title: Shane K. Panter
titleTemplate: Personal Website

hero:
  name: Shane K. Panter
  text: "BOOM!"
  tagline: Super fancy Website
  actions:
    - theme: brand
      text: CV
      link: /cv/index
    - theme: alt
      text: teaching
      link: /teaching/index
  image:
    src: images/me.jpg
    alt: Shane K. Panter
features:
  - icon:
      src: images/Git-Icon-1788C.svg
    title: CS155 Introduction to Version Control
    details: >
      Introduction to the central ideas, practices, and day to day usage of
      software version control using Git.
    link: /cs155/index
  - icon:
      src: images/Node.js_logo.svg
    title: CS208 Introduction to Full Stack Web Development
    details: >
        An introduction to web development using client-side (HTML/CSS/JavaScript) and
        server-side (Node.js) technologies.
    link: /cs208/index
  - icon:
      src: images/os-icon.svg
    title: CS452/552 Operating Systems
    details: >
      Process management, concurrency, inter-process communication,
      synchronization, scheduling, memory management, file systems and security.
    link: /cs452/index

---

<style>
:root {
  --vp-home-hero-name-color: transparent;
  --vp-home-hero-name-background: -webkit-linear-gradient(120deg, #bd34fe 30%, #41d1ff);

  --vp-home-hero-image-background-image: linear-gradient(-45deg, #bd34fe 50%, #47caff 50%);
  --vp-home-hero-image-filter: blur(44px);
}

@media (min-width: 640px) {
  :root {
    --vp-home-hero-image-filter: blur(56px);
  }
}

@media (min-width: 960px) {
  :root {
    --vp-home-hero-image-filter: blur(68px);
  }
}
</style>