---
title: CS331 Accessibility Report
subtitle: Computer Security and Information Assurance, Spring 2027
author: Shane K. Panter
date: October 21, 2026
---

## Summary

CS331 meets WCAG 2.1 Level AA, on the course website and in the Canvas master
shell. I checked it against WCAG 2.2 A and AA, which includes every 2.1 AA
criterion. The first pass found failures on every website page and on 4
Canvas pages. All of them are fixed, and the same checks now find none. Three items
are outside what I can fix in the course itself, and they are listed under
[Known limitations](#known-limitations) with how a student gets an accessible
version.

| Check | Before | After |
| --- | --- | --- |
| Website pages with an axe-core failure (light or dark mode) | 67 of 67 | 0 |
| Canvas bodies with an axe-core failure | 4 of 77 | 0 |
| Contrast under the minimum, worked out by hand | 1 (the schedule caret) | 0 |
| Link text that is unclear or points two places | 1 | 0 |
| Pages that do not reflow at 320 px | 0 | 0 |
| Tab stops with no visible focus | 0 | 0 |

## Scope

- **Website**: all 67 pages under <https://shanep.github.io/cs331/>. That is the
  syllabus and the other top-level pages, the schedule, 30 module overview and
  notes pages, 11 labs, 6 discussions, and the Course Resources, reminder and
  data pages. The site
  theme fixes below apply to every course on the site, not only CS331.
- **Canvas**: all 77 bodies in the CS331 master shell (Canvas course 52107):
  pages, assignments, discussions, the survey, and the syllabus. Canvas's own
  interface (navigation, menus, the rich content editor) belongs to Instructure
  and is not part of this review.
- **Files**: the one document students download, the CyBOK v1.2.0 PDF.

## How I checked

Every check runs from one command in the course repository, so anyone can rerun
it and get the same numbers:

```bash
npm run a11y -- --course cs331 --canvas <edutools pull snapshot>
```

It builds the site, then runs:

1. **axe-core 4.14.0** (Deque) in Chromium through Playwright 1.57.0, with the
   `wcag2a`, `wcag2aa`, `wcag21a`, `wcag21aa`, `wcag22aa` and `best-practice`
   rule sets, on every page in light mode and again in dark mode.
2. **Contrast by hand** for every element axe marks "needs review" because it
   cannot tell the background (text over a layered background, mostly). The
   script reads the text color and the first opaque background behind it and
   computes the ratio with the WCAG formula: 4.5:1 for text, 3:1 for large text
   and icons.
3. **Link text** (2.4.4): no "click here" or "read more", no raw URLs as link
   text, and no text that points to two different places on one page.
4. **Reflow** (1.4.10): every page at 320 CSS px wide, the width of a 1280 px
   screen at 400% zoom. A page fails if it scrolls sideways. Tables and code
   blocks may scroll inside their own box, which WCAG allows.
5. **Focus visible** (2.4.7): tab through every page and flag any stop that
   shows no outline or focus ring.
6. **Canvas**: the same axe rules and link checks on every body in a fresh
   `edutools pull` of course 52107, framed the way Canvas shows it (the item
   title as the page heading, Canvas's text color on white).

The last run, on October 21, 2026, after the fixes reached the website and
Canvas, printed:

```text
cs331: 67 site pages in light and dark mode, 77 Canvas bodies
     0  axe violations (site)
     0  contrast under the minimum, worked out by hand
     0  link text problems (site)
     0  pages that do not reflow at 320 px
     0  tab stops with no visible focus
     0  axe violations and link text problems (Canvas)
   130  needs-review groups from axe (color-contrast, th-has-data-cells); contrast ones are checked above
```

I also checked by hand what a script cannot judge:

- **Images**: the 215 module icons have empty alt text, because they repeat the
  heading next to them. The banner and the instructor photo have real alt text.
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

## What I fixed

### Website theme (every course)

| Problem | WCAG | Where | Fix |
| --- | --- | --- | --- |
| The sidebar put a button inside a button on every collapsible section, which screen readers announce badly | 4.1.2 | 670 elements, every page | Override VitePress's sidebar item so a row is a button only when it has no link, and the caret is the button when it does |
| The search button was named "Search" but showed "Search Ctrl K" | 2.5.3 | every page | Override the search button so its name comes from its visible text, with the shortcut hidden from screen readers |
| Code highlighting colors under 4.5:1 (red keywords at 4.23:1 in light mode, gray comments at 3.75:1 in dark mode) | 1.4.3 | 3 pages with code | Switch both code themes to GitHub's high-contrast versions |
| The code block language label at 2.87:1 | 1.4.3 | every code block | Use the theme's secondary text color, 5.21:1 in light mode |
| The schedule showed each module title as plain text, and each item's type only as an icon | 1.3.1, 1.1.1 | schedule page | Make module titles headings, and give each item a hidden text label ("Assignment:", "Page:") |
| The schedule's decorative caret at 2.87:1 | 1.4.11 | schedule page | Hide it from screen readers and raise it to 5.21:1 |

### CS331 content (website and Canvas)

| Problem | WCAG | Where | Fix |
| --- | --- | --- | --- |
| Tables with an empty header cell | 1.3.1 | D1 to D6 time tables, 6.01, Module 9, 12.01, 13.01 | Name every column ("Activity", "Subject", "Defense") |
| Two links on the syllabus both read "academic calendar" but went to different pages | 2.4.4 | syllabus | Name the second one "Spring 2027 academic calendar" |
| Lab 6 told students to click "the icon" or "the padlock", which depends on seeing it | 1.3.3 | Lab 6 Step 1 | Name the control by its accessible name ("the *View site information* button at the left end of the address bar") |

Earlier this month I also fixed the raw URLs Greg Snow flagged in his review of
the shell. Every one now sits behind descriptive link text.

## Known limitations

- **The CyBOK v1.2.0 PDF is not tagged.** It is the course textbook,
  published by the CyBOK project, not by me. It has real, selectable text and a
  full bookmark outline, so a screen reader can read it and jump between
  chapters, but it has no tag structure for headings and tables. A student who
  needs a tagged or alternate format can get one through the Educational Access
  Center, and I will help with any section they need sooner.
- **Two labs use visual tools.** Lab 6 has students open a certificate in their
  own browser, and Lab 8 has students read assembly in Compiler Explorer
  (godbolt.org). Both are third-party tools I did not build and did not audit.
  A student who cannot use either one gets an accommodation through the
  Educational Access Center.
- **The old CyBOK v1.1.0 PDF is still in Canvas files.** No page links to it
  any more. I left it in place because deleting a Canvas file cannot be undone.

## Advisory, not a failure

- External links on the website open in a new tab, which is the VitePress
  default. WCAG lists warning before a new window under 3.2.5, a Level AAA
  criterion, so it is not part of AA. Links in Canvas open in the same tab.

## Remaining "needs review" items

axe leaves two kinds of item for a person to judge, and I judged both fine:

- **Contrast it cannot compute** (126 groups), where text sits over a layered
  background like the sidebar or a code block. The by-hand check above covers
  every one of them, and the lowest ratio is 4.66:1.
- **Tables with no data** (4 groups) in Labs 2 and 7. These are blank templates
  students copy and fill in, so the empty cells are on purpose. Every column
  has a header.
