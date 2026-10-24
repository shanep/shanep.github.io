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
  - short: ESEM
    name: Empirical Software Engineering and Measurement
    rank: "A"
    link: https://conf.researchr.org/series/esem
  - short: ICSE
    name: International Conference on Software Engineering
    rank: "A*"
    link: https://www.icse-conferences.org/
  - short: FSE
    name: Foundations of Software Engineering
    rank: "A*"
    link: https://www.esec-fse.org/index
  - short: ASE
    name: Automated Software Engineering
    rank: "A*"
    link: https://ase-conferences.org/
  - short: ISSTA
    name: International Symposium on Software Testing and Analysis
    rank: "A"
    link: https://www.issta.org/
  - short: ICPC
    name: International Conference on Program Comprehension
    rank: "A"
    link: https://conf.researchr.org/series/icpc
  - short: MSR
    name: Mining Software Repositories
    rank: "A"
    link: https://conf.researchr.org/series/msr
  - short: EASE
    name: Evaluation and Assessment in Software Engineering
    rank: "A"
    link: https://conf.researchr.org/series/ease
  - short: TechDebt
    name: International Conference on Technical Debt
    rank: "B"
    link: https://conf.researchr.org/series/TechDebt
  - short: ICCIT
    name: International Conference on Computer and Information Technology
    rank: "Unranked"
    link: https://iccit.org.bd/

journals:
  - name: IEEE Transactions on Software Engineering (TSE)
    impact: "6.5"
    year: "2023"
    track: ICSE
    link: https://www.computer.org/csdl/journal/ts
  - name: ACM Transactions on Software Engineering and Methodology (TOSEM)
    impact: "6.6"
    year: "2023"
    track: ESEM
    link: https://dl.acm.org/journal/tosem
  - name: Journal of Systems and Software (JSS)
    impact: "3.7"
    year: "2023"
    track: ESEM
    link: https://www.sciencedirect.com/journal/journal-of-systems-and-software
  - name: Information and Software Technology
    impact: "3.8"
    year: "2023"
    track: ESEM
    link: https://www.sciencedirect.com/journal/information-and-software-technology
  - name: Empirical Software Engineering
    impact: "3.5"
    year: "2023"
    track: ESEM
    link: https://www.springer.com/journal/10664
  - name: IEEE Software
    impact: "3.3"
    year: "2023"
    track: ESEM
    link: https://ieeexplore.ieee.org/xpl/RecentIssue.jsp?punumber=52
  - name: IEEE Access
    impact: "3.6"
    year: "2024"
    link: https://ieeeaccess.ieee.org
---

## Conferences

A list of conferences in the field of software engineering. Conferences are
ranked by the [CORE ranking](https://portal.core.edu.au/conf-ranks/) and are
either A*, A, B, or C. Every conference has a different focus, so it is
important to read the call for papers to see if your research fits the
conference. Delft University of Technology has developed and maintains a website
called [conf.researchr.org](https://conf.researchr.org/) that a lot of conferences
use to manage their conferences.

<div class="vp-raw">
<VenueGrid :conferences="$frontmatter.conferences" />
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
<VenueGrid :journals="$frontmatter.journals" />
</div>
