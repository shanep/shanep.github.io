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
/* The photo is cut out of its grey backdrop (macOS Vision's subject lift on
   shane_panter.jpeg), so the page background shows around it. The bottom
   fades out so the hoodie does not end in a hard line. */
.VPHero .image-src {
  -webkit-mask-image: linear-gradient(to bottom, #000 78%, transparent);
  mask-image: linear-gradient(to bottom, #000 78%, transparent);
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
