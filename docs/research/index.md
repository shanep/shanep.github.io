---
layout: home

title: Research

hero:
  name: Research
  tagline: Empirical software engineering and software supply chain security
  actions:
    - theme: brand
      text: Publications
      link: /cv/#publications
    - theme: alt
      text: Google Scholar
      link: https://scholar.google.com/citations?user=0B7MuswAAAAJ&hl=en
    - theme: alt
      text: ORCID
      link: https://orcid.org/0009-0009-1852-3655

conferences:
  - title: ESEM
    details: <span class="card-tags"><span>CORE A</span></span> Empirical Software Engineering and Measurement
    link: https://conf.researchr.org/series/esem
    linkText: Website
  - title: ICSE
    details: <span class="card-tags"><span>CORE A*</span></span> International Conference on Software Engineering
    link: https://www.icse-conferences.org/
    linkText: Website
  - title: FSE
    details: <span class="card-tags"><span>CORE A*</span></span> Foundations of Software Engineering
    link: https://www.esec-fse.org/index
    linkText: Website
  - title: ASE
    details: <span class="card-tags"><span>CORE A*</span></span> Automated Software Engineering
    link: https://ase-conferences.org/
    linkText: Website
  - title: ISSTA
    details: <span class="card-tags"><span>CORE A</span></span> International Symposium on Software Testing and Analysis
    link: https://www.issta.org/
    linkText: Website
  - title: ICPC
    details: <span class="card-tags"><span>CORE A</span></span> International Conference on Program Comprehension
    link: https://conf.researchr.org/series/icpc
    linkText: Website
  - title: MSR
    details: <span class="card-tags"><span>CORE A</span></span> Mining Software Repositories
    link: https://conf.researchr.org/series/msr
    linkText: Website
  - title: EASE
    details: <span class="card-tags"><span>CORE A</span></span> Evaluation and Assessment in Software Engineering
    link: https://conf.researchr.org/series/ease
    linkText: Website
  - title: TechDebt
    details: <span class="card-tags"><span>CORE B</span></span> International Conference on Technical Debt
    link: https://conf.researchr.org/series/TechDebt
    linkText: Website
  - title: ICCIT
    details: <span class="card-tags"><span>Unranked</span></span> International Conference on Computer and Information Technology
    link: https://iccit.org.bd/
    linkText: Website

journals:
  - title: IEEE Transactions on Software Engineering (TSE)
    details: <span class="card-tags"><span>Impact factor 6.5 (2023)</span><span>ICSE journal-first</span></span>
    link: https://www.computer.org/csdl/journal/ts
    linkText: Website
  - title: ACM Transactions on Software Engineering and Methodology (TOSEM)
    details: <span class="card-tags"><span>Impact factor 6.6 (2023)</span><span>ESEM journal-first</span></span>
    link: https://dl.acm.org/journal/tosem
    linkText: Website
  - title: Journal of Systems and Software (JSS)
    details: <span class="card-tags"><span>Impact factor 3.7 (2023)</span><span>ESEM journal-first</span></span>
    link: https://www.sciencedirect.com/journal/journal-of-systems-and-software
    linkText: Website
  - title: Information and Software Technology
    details: <span class="card-tags"><span>Impact factor 3.8 (2023)</span><span>ESEM journal-first</span></span>
    link: https://www.sciencedirect.com/journal/information-and-software-technology
    linkText: Website
  - title: Empirical Software Engineering
    details: <span class="card-tags"><span>Impact factor 3.5 (2023)</span><span>ESEM journal-first</span></span>
    link: https://www.springer.com/journal/10664
    linkText: Website
  - title: IEEE Software
    details: <span class="card-tags"><span>Impact factor 3.3 (2023)</span><span>ESEM journal-first</span></span>
    link: https://ieeexplore.ieee.org/xpl/RecentIssue.jsp?punumber=52
    linkText: Website
  - title: IEEE Access
    details: <span class="card-tags"><span>Impact factor 3.6 (2024)</span></span>
    link: https://ieeeaccess.ieee.org
    linkText: Website
---

<script setup>
import { VPFeatures } from 'vitepress/theme'
</script>

## Conferences

A list of conferences in the field of software engineering. Conferences are
ranked by the [CORE ranking](https://portal.core.edu.au/conf-ranks/) and are
either A*, A, B, or C. Every conference has a different focus, so it is
important to read the call for papers to see if your research fits the
conference. Delft University of Technology has developed and maintains a website
called [conf.researchr.org](https://conf.researchr.org/) that a lot of conferences
use to manage their conferences.

<div class="vp-raw">
<VPFeatures :features="$frontmatter.conferences" />
</div>

## Journals

Journal impact factors vary significantly by discipline, making cross-field
comparisons inappropriate. Citation behaviors and perceptions of what
constitutes "high-impact" research differ markedly across academic fields. For
instance, life sciences journals typically exhibit higher impact factors owing
to larger researcher populations and more frequent citation practices.
Conversely, disciplines within the humanities and social sciences often report
lower impact factors but place greater emphasis on the enduring relevance and
longevity of published research.

A journal-first tag means the journal is partnered with that conference's journal-first track.

<div class="vp-raw">
<VPFeatures :features="$frontmatter.journals" />
</div>
