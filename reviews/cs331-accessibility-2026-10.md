---
title: CS331 Accessibility Report
subtitle: Computer Security and Information Assurance, Spring 2027
author: Shane K. Panter
date: October 29, 2026
---

## Summary

CS331 meets WCAG 2.2 Level AA, which includes every WCAG 2.1 AA criterion, on
the course website and in the Canvas master shell. It also meets 25 of the 31
Level AAA criteria. Of the other 6, 5 do not apply because the course has no
video or audio, and the 1 that is not met is listed under
[Level AAA](#level-aaa) with the reason.

The first pass found AA failures on every website page and on 4 Canvas pages,
and a second pass at AAA found more. All of them are fixed, and the same checks
now find none. I reran them on October 28, after the site's theme was
restyled, and they still find none. The textbook PDF (Portable Document Format)
was the biggest gap, so every chapter the course assigns is now a web page on the
course site that passes the same AAA checks (see
[CyBOK textbook](#cybok-textbook)). Three items are outside what I can fix in the
course itself. They are listed under [Known limitations](#known-limitations) with how a student
gets an accessible version.

| Check | Level | Before | After |
| --- | --- | --- | --- |
| Website pages with an axe-core failure (light or dark mode) | AA | 67 of 67 | 0 |
| Canvas bodies with an axe-core failure | AA | 4 of 77 | 0 |
| Contrast under 4.5:1, worked out by hand | AA | 1 (the schedule caret) | 0 |
| Link text that is unclear or points two places | AA | 1 | 0 |
| Pages that do not reflow at 320 px | AA | 0 | 0 |
| Tab stops with no visible focus | AA | 0 | 0 |
| Website pages with text under 7:1 contrast | AAA | 67 of 67 | 0 |
| Controls under 44 by 44 px | AAA | every page | 0 |
| External links that open a new tab without saying so | AAA | every external link | 0 |
| Paragraphs closer than 1.5 lines apart | AAA | 7 | 0 |
| Images of text | AAA | 1 (the home page banner) | 0 |
| Problems UDOIT reports in Canvas (errors and suggestions) | | 398 | 0, plus the long CyBOK chapters (see below) |
| Links that go nowhere (a missing page, anchor or a 404) | AA | 46 | 0 |
| Assigned CyBOK chapters readable without the untagged PDF | AAA | 0 of 15 | 15 of 15 |

## Scope

- **Website**: all 83 pages under <https://shanep.github.io/cs331/>. That is the
  syllabus and the other top-level pages, the schedule, 30 module overview and
  notes pages, 11 labs, 6 discussions, the Course Resources, reminder and
  data pages, and 16 CyBOK pages (the 15 assigned chapters and their index). The site theme fixes below apply to every course on the site,
  not only CS331.
- **Canvas**: all 77 bodies in the CS331 master shell (Canvas course 52107):
  pages, assignments, discussions, the survey, and the syllabus. Canvas's own
  interface (navigation, menus, buttons, the rich content editor) belongs to
  Instructure and is not part of this review.
- **Files**: the one document students download, the CyBOK v1.2.0 PDF.

## How I checked

Every check runs from one command in the course repository, so anyone can rerun
it and get the same numbers:

```bash
npm run a11y -- --course cs331 --level aaa --canvas <edutools pull snapshot>
```

It builds the site, then runs:

1. **axe-core 4.14.0** (Deque) in Chromium through Playwright 1.57.0, with the
   `wcag2a`, `wcag2aa`, `wcag21a`, `wcag21aa`, `wcag22aa`, `wcag2aaa` and
   `best-practice` rule sets, on every page in light mode and again in dark
   mode.
2. **Contrast by hand** for every element axe marks "needs review" because it
   cannot tell the background (text over a layered background, mostly). The
   script reads the text color and the first opaque background behind it and
   computes the ratio with the WCAG formula. At AAA that is 7:1 for text and
   4.5:1 for large text.
3. **Link text** (2.4.4, 2.4.9): no "click here" or "read more", no raw URLs as
   link text, no text that points to two different places on one page, and no
   link that opens a new tab without saying so in its name (3.2.5).
4. **Reflow** (1.4.10): every page at 320 CSS px wide, the width of a 1280 px
   screen at 400% zoom. A page fails if it scrolls sideways. Tables, code
   blocks and display math may scroll inside their own box, which WCAG allows.
5. **Focus** (2.4.7, 2.4.12, 2.4.13): tab through every page and flag any stop
   with no focus ring, a ring thinner than 2 px or under 3:1, or any part
   hidden under the sticky navigation bar.
6. **Target size** (2.5.5): every control at 1280 px and at 320 px, measured by
   where a click actually lands, must take a click across at least 44 by 44 px.
   Links inside a paragraph, list item or table cell are exempt, as the
   criterion allows for targets in a block of text. Footnote links count as
   part of their sentence.
7. **Text spacing and images of text** (1.4.8, 1.4.9): line spacing of at least
   1.5, paragraphs at least 1.5 lines apart, no justified text, and no image
   whose alt text is a title.
8. **Canvas**: the same axe rules and link checks on every body in a fresh
   `edutools pull` of course 52107, framed the way Canvas shows it (the item
   title as the page heading, Canvas's text color on white).
9. **UDOIT**: Boise State's UDOIT tool in Canvas, scanned on October 28 with
   its default filters off, so unpublished items count too. The check now runs
   the same rules on every website page and Canvas body, so a new problem fails
   the check before UDOIT ever sees it: a paragraph that is all bold, two links
   in a row to the same place, alt text over 150 characters, colored text with
   no font style of its own, and embedded frames.
10. **Links**: every link in a page body, on the website and in Canvas, has to
    land somewhere. A link inside the course has to reach a page that exists and
    an anchor on it, and an outside link fails on a 404 or a 410. An outside
    site that turns the check away, times out or does not resolve is listed to
    open by hand, since many sites refuse scripts and my network's DNS filter
    blocks a few live ones (petsymposium.org, suricata-ids.org, tsfdn.org).

The last run, on October 29, 2026, printed the lines below. It covers the
CyBOK pages on the website and in Canvas.

```text
cs331 (WCAG 2.2 AAA): 84 site pages in light and dark mode, 94 Canvas bodies
     0  axe violations (site)
     0  contrast under the minimum, worked out by hand
     0  link text problems (site)
     0  UDOIT problems (site)
     0  broken links (site)
     0  pages that do not reflow at 320 px
     0  tab stops with a focus problem
     0  targets under 44 by 44 px
     0  text spacing and images of text
     0  axe, UDOIT and link text problems (Canvas)
     0  broken links (Canvas)
   350  needs-review groups from axe (color-contrast-enhanced, color-contrast, identical-links-same-purpose, th-has-data-cells); contrast ones are checked above
    32  pages over 3000 words, which UDOIT suggests splitting
   294  of 1235 outside links turned the check away, timed out or did not resolve; open them by hand
```

The Canvas check reads each body without Canvas's own stylesheet, so I also
measured the text colors on live Canvas pages (the syllabus, the home page, a
notes page, the assignment list and a discussion). Course content is at 7:1 or
better everywhere except inline code, which Canvas draws red on gray at 5.21:1.
The course stylesheet now sets inline code to the page text color.

I also checked by hand what a script cannot judge:

- **Images**: the 215 module icons have empty alt text, because they repeat the
  heading next to them. The home page banner is now decoration only (see
  below), and the instructor photo has real alt text. Canvas drops an empty
  alt when it draws a page unless the image also has `role="presentation"`, so
  every decorative image carries both, and the check now flags one that does not.
- **Instructions** (1.3.3): no step depends on shape, color, or position alone.
- **Diagrams**: the course has no images of text and no ASCII diagrams. Lab 2
  asks students for a threat model diagram and accepts a plain-text one, so
  nobody has to draw.
- **Media**: the course has no video or audio, so captions and transcripts do
  not apply. The one embed, a Google Doc on the instructor-only page, has a
  title.
- **Headings and tables**: headings go in order with no skipped levels, and
  every data table has a header row.
- **Keyboard**: tabbing reaches every link and button with no keyboard trap,
  and every page has a "Skip to content" link.
- **Time limits**: the one quiz (the survey) has no time limit.
- **Motion**: the site turns off its transitions when the operating system asks
  for reduced motion.

## Level AAA

The W3C does not recommend requiring AAA for a whole site, because some of it
cannot be met for every kind of content. Here is where CS331 stands on each
criterion.

| Criterion | Status | How |
| --- | --- | --- |
| 1.2.6 Sign Language | Does not apply | No video or audio |
| 1.2.7 Extended Audio Description | Does not apply | No video |
| 1.2.8 Media Alternative | Does not apply | No video |
| 1.2.9 Audio-only (Live) | Does not apply | No live audio |
| 1.3.6 Identify Purpose | Met | Header, navigation, main and aside landmarks on every page, and every icon has a text label |
| 1.4.6 Contrast (Enhanced) | Met | Every color the course sets is at least 7:1, or 4.5:1 for large text |
| 1.4.7 Low or No Background Audio | Does not apply | No audio |
| 1.4.8 Visual Presentation | Met | Light and dark mode, line spacing 1.75, paragraphs at least 1.5 lines apart, no justified text, and the text reflows to any width |
| 1.4.9 Images of Text (No Exception) | Met | None left after the banner fix |
| 2.1.3 Keyboard (No Exception) | Met | Everything works from the keyboard |
| 2.2.3 No Timing | Met | No timed content or quiz |
| 2.2.4 Interruptions | Met | No pop-ups or automatic updates |
| 2.2.5 Re-authenticating | Met | The website has no sign-in, and Canvas sign-in belongs to Boise State |
| 2.2.6 Timeouts | Met | The website keeps no data that could time out |
| 2.3.2 Three Flashes | Met | Nothing flashes |
| 2.3.3 Animation from Interactions | Met | Transitions turn off with reduced motion |
| 2.4.8 Location | Met | The sidebar marks the current page and its module |
| 2.4.9 Link Purpose (Link Only) | Met | Every link names where it goes on its own |
| 2.4.10 Section Headings | Met | Every page is divided by headings |
| 2.4.12 Focus Not Obscured (Enhanced) | Met | The page scrolls a focused element clear of the sticky bars |
| 2.4.13 Focus Appearance | Met | A 2 px focus ring in the link color, 7:1 or better |
| 2.5.5 Target Size (Enhanced) | Met | Every control outside a block of text is at least 44 by 44 px |
| 2.5.6 Concurrent Input Mechanisms | Met | Nothing limits the input device |
| 3.1.3 Unusual Words | Met | Every notes page has a Key Terms section that defines the terms it uses |
| 3.1.4 Abbreviations | Met | Every abbreviation is spelled out on its first use on each page (see below) |
| 3.1.5 Reading Level | **Not met** | See below |
| 3.1.6 Pronunciation | Met | No word's meaning depends on how it is said |
| 3.2.5 Change on Request | Met | Links open in the same tab, and the two theme links that open a new tab say so |
| 3.3.5 Help | Met | The Course Questions forum, the Technology Support page and the Instructor Information page, all linked from the home page |
| 3.3.6 Error Prevention (All) | Met | The website takes no submissions, and submitting work happens in Canvas's own interface |
| 3.3.9 Accessible Authentication (Enhanced) | Met | The website has no sign-in |

**3.1.4 Abbreviations.** A security course is thick with abbreviations (TLS,
RBAC, HMAC, STRIDE and about 90 more). A scan found 98 real ones, used 311 times
across the course's pages, and most were never spelled out. Each Canvas page is
its own page, so each abbreviation is now spelled out the first time it appears
on every page that uses it, as in "TLS (Transport Layer Security)". That changed
54 pages. Words in capitals that are not abbreviations (SPRING BREAK, SHALL NOT),
course and room codes, and names like MITRE ATT&CK are left alone.

On the CyBOK pages the book's own wording is kept, so a meaning is added after an
abbreviation in brackets, as in "MAC \[Message Authentication Code\]". The
converter picks the meaning per chapter, because the book uses MAC, CSP, TTP and
a few others for different things in different chapters, and a note at the top of
each page says the bracketed meanings are mine, not the book's.

**3.1.5 Reading Level.** The criterion asks for text a lower secondary student
can read, or a simpler version next to it. CS331 is an upper-division course,
and its readings are the CyBOK knowledge areas. The notes and labs are written
plainly, but they do not reach that level, and writing a second version of every
page is not practical.

## What I fixed

### Website theme, Level AA (every course)

| Problem | WCAG | Where | Fix |
| --- | --- | --- | --- |
| The sidebar put a button inside a button on every collapsible section, which screen readers announce badly | 4.1.2 | 670 elements, every page | Override VitePress's sidebar item so a row is a button only when it has no link, and the caret is the button when it does |
| The search button was named "Search" but showed "Search Ctrl K" | 2.5.3 | every page | Override the search button so its name comes from its visible text, with the shortcut hidden from screen readers |
| Code highlighting colors under 4.5:1 (red keywords at 4.23:1 in light mode, gray comments at 3.75:1 in dark mode) | 1.4.3 | 3 pages with code | Switch both code themes to GitHub's high-contrast versions |
| The code block language label at 2.87:1 | 1.4.3 | every code block | Use the theme's secondary text color |
| The schedule showed each module title as plain text, and each item's type only as an icon | 1.3.1, 1.1.1 | schedule page | Make module titles headings, and give each item a hidden text label ("Assignment:", "Page:") |
| The schedule's decorative caret at 2.87:1 | 1.4.11 | schedule page | Hide it from screen readers and use the secondary text color |

### Website theme, Level AAA (every course)

| Problem | WCAG | Where | Fix |
| --- | --- | --- | --- |
| Secondary text at 5.2:1, the link color at 5.8:1, and the tip, warning and danger colors also under 7:1 | 1.4.6 | every page | Darken them in light mode and lighten them in dark mode, to 7:1 or better |
| Code comments at 4.66:1 even in the high-contrast themes | 1.4.6 | every code block | Build the code themes at load time, nudging each token color until it reaches 7:1 on the code background |
| External links opened in a new tab without warning | 3.2.5 | every external link | Open them in the same tab, and label the two theme links that still open a tab (the GitHub icon and "Edit this page") |
| The browser's thin focus outline on links | 2.4.13 | every page | A 2 px solid ring in the link color on everything that takes focus |
| A focused heading link could scroll under the sticky navigation bar | 2.4.12 | every page | Scroll padding that clears the bar, and the menu bar on narrow screens |
| Sidebar rows, outline links, the search button, the theme switch, the GitHub icon, copy buttons, heading anchors and schedule links under 44 px | 2.5.5 | every page | Make each one 44 px, or widen the area that takes a click where the look should stay the same |
| No space between paragraphs in a quote, and 8 px in a tip box | 1.4.8 | 5 pages | Space them at least 1.5 lines apart |
| The sidebar's "Home" went to the course home page, and the top bar's "Home" went to the site home page | 2.4.9 | every course page | Rename the sidebar entry "Course Home" |

### CS331 content (website and Canvas)

| Problem | WCAG | Where | Fix |
| --- | --- | --- | --- |
| Tables with an empty header cell | 1.3.1 | D1 to D6 time tables, 6.01, Module 9, 12.01, 13.01 | Name every column ("Activity", "Subject", "Defense") |
| Two links on the syllabus both read "academic calendar" but went to different pages | 2.4.4 | syllabus | Name the second one "Spring 2027 academic calendar" |
| Lab 6 told students to click "the icon" or "the padlock", which depends on seeing it | 1.3.3 | Lab 6 Step 1 | Name the control by its accessible name ("the *View site information* button at the left end of the address bar") |
| The home page banner drew the course title as a picture | 1.4.9 | home page | Take the title out of the banner, keep the circuit art as decoration, and let the heading below it carry the title |
| Canvas draws inline code red on gray at 5.21:1 | 1.4.6 | 34 Canvas bodies with code | Set inline code to the page text color in the course stylesheet |
| Abbreviations were never spelled out | 3.1.4 | 54 pages | Spell out each one on its first use on each page |
| Three links read "docs/CyBOK_v1.2.0.pdf", the file's path | 2.4.4 | syllabus, Readings and Resources, Lab 0 | Name them "CyBOK v1.2.0 (PDF)" |

### CyBOK textbook

The CyBOK v1.2.0 PDF is 1,115 pages with no tags, so a screen reader gets no
headings, tables or reading order. The course assigns parts of 15 of its 22
chapters, so those 15 chapters are now web pages under
<https://shanepanter.com/cs331/cybok/>, and the reading links in every week's
notes go straight to the section on them. The same pages are also Canvas pages,
in the CyBOK module, and they link to each other inside Canvas rather than back to
the website. The PDF is linked at cybok.org instead of kept as a copy in Canvas.

A script in the repository (`scripts/cybok/convert.py`) builds the pages from the
PDF, so they can be rebuilt when CyBOK puts out a new version.

| Problem in the PDF | WCAG | Fix on the web pages |
| --- | --- | --- |
| No tagged headings, lists or tables | 1.3.1 | Real headings for every section, real lists, and 351 footnotes that link both ways |
| Math drawn as glyphs a screen reader cannot read | 1.1.1, 1.3.1 | MathJax, which draws each formula and hands screen readers a MathML copy |
| 38 figures with no alt text | 1.1.1 | Alt text for each one, plus a "Text description" that lists everything the figure shows |
| Diagrams and tables drawn as pictures | 1.4.9 | Rebuilt as real tables where the content is a table |
| About 1,200 links whose text is a bare web address | 2.4.9 | Reference links carry the title of the work, and the other 138 addresses get a name from a list in the repository. Made-up addresses in the book's examples are shown as code, not links |
| Abbreviations never spelled out on most pages | 3.1.4 | A meaning in brackets on each one's first use on each page |

The theme also gained styles for what these pages added: 44 px tall "Text
description" toggles and display math, footnote return links of at least 24 px,
and inline math that shrinks to fit a phone instead of making the page scroll.

Earlier this month I also fixed the raw URLs Greg Snow flagged in his review of
the shell. Every one now sits behind descriptive link text.

## Known limitations

- **The CyBOK v1.2.0 PDF is still not tagged.** It is published by the CyBOK
  project, not by me, so I left the file as it is. Every chapter the course
  assigns is now an accessible web page (see [CyBOK textbook](#cybok-textbook)).
  The 7 chapters the course does not assign are only in the PDF, which has real,
  selectable text and a full bookmark outline. The figure descriptions on the web
  pages are my reading of each figure, and a few small labels in the book's
  figures are too small to read with certainty.
- **Two labs use visual tools.** Lab 6 has students open a certificate in their
  own browser, and Lab 8 has students read assembly in Compiler Explorer
  (godbolt.org). Both are third-party tools I did not build and did not audit.
  A student who cannot use either one gets an accommodation through the
  Educational Access Center.

## Remaining "needs review" items

axe leaves four kinds of item for a person to judge, and I judged all of them
fine:

- **Contrast it cannot compute** (332 groups), where text sits over a layered
  background like the sidebar or a code block. Since the theme was restyled,
  axe's AA and AAA contrast rules both flag the same 166 spots, which is why
  the count roughly doubled. The by-hand check above covers every one of them
  at the AAA thresholds.
- **Links with the same name** (10 groups), where a sidebar or outline link and
  a link in the page share a name and go to the same page.
- **Tables with no data** (4 groups) in Labs 2 and 7. These are blank templates
  students copy and fill in, so the empty cells are on purpose. Every column
  has a header.

UDOIT's scan on October 28 found 398 issues, nearly all of them on the new
CyBOK pages in Canvas. They are all fixed except the long chapters:

| UDOIT issue | Count | Fix |
| --- | --- | --- |
| Styles used instead of headings | 336 | The CyBOK chapters' fourth-level sections are real headings, bold labels run into their sentence, and the meta line at the top of each item and the title of each callout are no longer bold paragraphs |
| Adjacent links | 34 | A citation that repeats the one right before it is plain text |
| Content too long | 16 | Not fixed, see below |
| Alt text too long | 9 | Cut to 125 characters or fewer, with the full description still under "Text description" |
| Color alone | 2 | The "Select Next to continue" bar and the meta line set their own font style |
| External content | 1 | The Google Doc on the instructor-only Learning Opportunities page is a link now |

The 16 CyBOK chapters run from 7,000 to 37,000 words, and UDOIT suggests
splitting any page over 3,000. I kept each chapter whole, because each one is a
chapter of the book with its own headings and table of contents, and splitting it
would break its footnotes and cross references. The check lists every page over
3,000 words but does not fail on them.
