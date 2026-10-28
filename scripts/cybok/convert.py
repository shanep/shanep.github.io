"""Convert chapters of the CyBOK v1.2.0 PDF into VitePress Markdown pages.

The PDF is typeset by LaTeX with a fixed set of fonts, so the font, size and
position of each span say what it is: Roboto is prose, Computer Modern is math,
RobotoMono is code, a bold 17 pt line is a section heading, and so on. This
script reads those spans with PyMuPDF and writes one Markdown page per chapter,
with real headings, lists, footnotes, math (as TeX for MathJax) and a reference
list holding only the entries the chapter cites.

Figures and tables are cut out of the flow and replaced with hand-written
files from figures/ and tables/ next to this script, because their alt text,
long descriptions and cells need a person to check them. A figure file starts
with an "alt:" line and a "---" line, and the rest is its long description; the
figure itself becomes a PNG in images/. A figure file with no alt line, and
every table file, holds the figure or table itself in Markdown. Citations in
them are written as in the PDF, [12, c3], and linked like those in the prose.

Run it with a Python that has PyMuPDF (pip install pymupdf):

    python scripts/cybok/convert.py docs/cs331/docs/CyBOK_v1.2.0.pdf docs/cs331/cybok
"""

from __future__ import annotations

import argparse
import re
import sys
from collections import Counter
from dataclasses import dataclass, field
from pathlib import Path
from typing import NamedTuple, TypedDict, cast

import pymupdf

# Chapters CS331 assigns readings from: (number, slug, first PDF page, last PDF page).
CHAPTERS: list[tuple[int, str, int, int]] = [
    (1, "introduction", 47, 61),
    (2, "risk-management-and-governance", 65, 94),
    (3, "law-and-regulation", 95, 190),
    (4, "human-factors", 191, 214),
    (5, "privacy-and-online-rights", 215, 242),
    (6, "malware-and-attack-technologies", 245, 266),
    (7, "adversarial-behaviours", 267, 294),
    (8, "security-operations-and-incident-management", 295, 332),
    (10, "cryptography", 365, 400),
    (14, "authentication-authorisation-and-accountability", 509, 538),
    (15, "software-security", 541, 568),
    (16, "web-and-mobile-security", 569, 602),
    (17, "secure-software-lifecycle", 603, 662),
    (18, "applied-cryptography", 665, 716),
    (19, "network-security", 717, 752),
]
BIBLIOGRAPHY = (843, 1010)
PAGE_OFFSET = 46  # PDF page number minus the printed page number in the body

ACRONYMS = (1011, 1034)  # the Acronyms appendix

# Spelled out the first time a chapter uses them, for WCAG 3.1.4, where the
# Acronyms appendix has no meaning or more than one. CHAPTER_ABBREVIATIONS holds a
# meaning right for one chapter only. Names (IBM, MITRE, QEMU), protocol keywords
# (GET, SYN) and abbreviations the chapter spells out itself are left off on purpose.
ABBREVIATIONS: dict[str, str] = {
    "ACM": "Association for Computing Machinery",
    "ASCII": "American Standard Code for Information Interchange",
    "B2B": "business to business",
    "B2C": "business to consumer",
    "BEEP": "Blocks Extensible Exchange Protocol",
    "BER": "Basic Encoding Rules",
    "BSD": "Berkeley Software Distribution",
    "BSON": "Binary JSON",
    "CCPA": "California Consumer Privacy Act",
    "CER": "Canonical Encoding Rules",
    "CNNIC": "China Internet Network Information Center",
    "CPDA": "Copyright, Designs and Patents Act",
    "CREST": "Council of Registered Ethical Security Testers",
    "DOD": "Department of Defense",
    "DSS": "Data Security Standard",
    "ECDLP": "Elliptic Curve Discrete Logarithm Problem",
    "ECDSA": "Elliptic Curve Digital Signature Algorithm",
    "EDI": "electronic data interchange",
    "EdDSA": "Edwards-curve Digital Signature Algorithm",
    "EU": "European Union",
    "EUR": "euros",
    "FBI": "Federal Bureau of Investigation",
    "FIPS": "Federal Information Processing Standards",
    "GBP": "pounds sterling",
    "HKDF": "HMAC-based Key Derivation Function",
    "HTML5": "HyperText Markup Language 5",
    "ICO": "Information Commissioner's Office",
    "ID": "identifier",
    "IEEE": "Institute of Electrical and Electronics Engineers",
    "IGE": "Infinite Garble Extension",
    "IMAP": "Internet Message Access Protocol",
    "IPFIX": "IP Flow Information Export",
    "IRT": "isochronous real-time",
    "IT": "information technology",
    "ITU": "International Telecommunication Union",
    "KDD": "Knowledge Discovery and Data Mining",
    "KVM": "Kernel-based Virtual Machine",
    "LDAP": "Lightweight Directory Access Protocol",
    "LI": "lawful interception",
    "LORA": "Long Range",
    "MD4": "Message Digest 4",
    "MD5": "Message Digest 5",
    "MISRA": "Motor Industry Software Reliability Association",
    "MR": "Master of the Rolls",
    "MiTM": "man-in-the-middle",
    "NIDES": "Next-generation Intrusion Detection Expert System",
    "NISTIR": "NIST Interagency Report",
    "NP": "nondeterministic polynomial time",
    "NoSQL": "not only SQL",
    "OEM": "original equipment manufacturer",
    "OT": "operational technology",
    "PBKDF2": "Password-Based Key Derivation Function 2",
    "PC": "personal computer",
    "PCAP": "packet capture",
    "PHP": "PHP: Hypertext Preprocessor",
    "PID": "process identifier",
    "PyPI": "Python Package Index",
    "RADIUS": "Remote Authentication Dial-In User Service",
    "RASP": "runtime application self-protection",
    "RC4": "Rivest Cipher 4",
    "RISCS": "Research Institute in Sociotechnical Cyber Security",
    "SDK": "software development kit",
    "SHA": "Secure Hash Algorithm",
    "SOCKS": "Socket Secure",
    "SPDX": "Software Package Data Exchange",
    "STIDE": "Sequence Time-Delay Embedding",
    "SVG": "Scalable Vector Graphics",
    "UID": "user identifier",
    "UK": "United Kingdom",
    "UN": "United Nations",
    "UPnP": "Universal Plug and Play",
    "US": "United States",
    "USA": "United States of America",
    "USD": "United States dollars",
    "WPA2": "Wi-Fi Protected Access 2",
    "WPA3": "Wi-Fi Protected Access 3",
    "WWII": "World War II",
    "XOR": "exclusive or",
    "YAML": "YAML Ain't Markup Language",
    "ZIP": "Zone Improvement Plan",
}

CHAPTER_ABBREVIATIONS: dict[int, dict[str, str]] = {
    3: {"MAC": "Media Access Control"},
    4: {"CIA": "Central Intelligence Agency"},
    7: {"CIA": "Central Intelligence Agency"},
    8: {"MAC": "Media Access Control", "AS": "Autonomous System"},
    10: {"MAC": "Message Authentication Code", "MPC": "Multi-Party Computation"},
    14: {"MAC": "Mandatory Access Control", "CSP": "Content Security Policy", "AS": "Authorisation Server"},
    15: {"CSS": "Cascading Style Sheets"},
    16: {"CSS": "Cascading Style Sheets", "CSP": "Content Security Policy", "MAC": "Message Authentication Code"},
    17: {
        "CIA": "Confidentiality, Integrity and Availability",
        "CSP": "cloud service provider",
        "TTP": "tactics, techniques and procedures",
        "SAE": "Society for Automotive Engineering",
    },
    18: {
        "MAC": "Message Authentication Code",
        "MPC": "Multi-Party Computation",
        "CRT": "Chinese Remainder Theorem",
        "TTP": "Trusted Third Party",
        "TA": "Trusted Authority",
    },
    19: {
        "MAC": "Media Access Control",
        "AS": "Autonomous System",
        "CSS": "Cascading Style Sheets",
        "CIA": "Confidentiality, Integrity and Availability",
        "NS": "name server",
        "SAE": "Simultaneous Authentication of Equals",
    },
}

# Figure and table regions (top, bottom) where the drawing fools regions(), checked by eye.
BOXES: dict[str, tuple[float, float]] = {
    "2.3": (278, 580),
}

IMAGE_DPI = 192  # twice the 96 dpi CSS pixel, for high density screens
HEADER_BOTTOM = 55.0
FOOTER_TOP = 800.0
BODY_LEFT = 57.0
BODY_RIGHT = 539.0

MATH_FONTS = ("CMMI", "CMSY", "CMR", "CMEX", "CMSS", "EUFM", "MSBM", "MSAM", "LINE", "CMBX")
FIGURE_FONTS = ("HelveticaNeue", "Calibri", "GillSans", "Arial", "Type3")

TEX: dict[str, str] = {
    "−": "-", "·": r"\cdot ", "×": r"\times ", "←": r"\leftarrow ", "→": r"\rightarrow ",
    "−→": r"\longrightarrow ", "↦": r"\mapsto ", "∗": "*", "≤": r"\le ", "≥": r"\ge ",
    "≠": r"\neq ", "∈": r"\in ", "∉": r"\notin ", "⊕": r"\oplus ", "ϵ": r"\epsilon ",
    "∥": r"\parallel ", "‖": r"\| ", "{": r"\{", "}": r"\}", "⟨": r"\langle ", "⟩": r"\rangle ",
    "∀": r"\forall ", "∃": r"\exists ", "≈": r"\approx ", "∧": r"\land ", "∨": r"\lor ",
    "¬": r"\neg ", "⊆": r"\subseteq ", "⊂": r"\subset ", "∪": r"\cup ", "∩": r"\cap ",
    "∅": r"\emptyset ", "∞": r"\infty ", "∑": r"\sum ", "∏": r"\prod ", "√": r"\sqrt ",
    "⌈": r"\lceil ", "⌉": r"\rceil ", "⌊": r"\lfloor ", "⌋": r"\rfloor ", "$": r"\$",
    "%": r"\%", "#": r"\#", "_": r"\_", "&": r"\&", "~": r"\sim ", "∼": r"\sim ",
    "≡": r"\equiv ", "⇒": r"\Rightarrow ", "⇔": r"\Leftrightarrow ", "↔": r"\leftrightarrow ",
    "◦": r"\circ ", "∘": r"\circ ", "|": r"\vert ", "′": "'", "ℓ": r"\ell ",
}
LIGATURES = {"ﬁ": "fi", "ﬂ": "fl", "ﬀ": "ff", "ﬃ": "ffi", "ﬄ": "ffl", "’": "’"}


class RawSpan(TypedDict):
    """A span in PyMuPDF's get_text("dict") output."""

    text: str
    font: str
    size: float
    flags: int
    bbox: tuple[float, float, float, float]
    origin: tuple[float, float]


class RawLine(TypedDict):
    spans: list[RawSpan]


class RawBlock(TypedDict):
    type: int
    lines: list[RawLine]


class RawPage(TypedDict):
    blocks: list[RawBlock]


class Span(NamedTuple):
    text: str
    font: str
    size: float
    flags: int
    x0: float
    x1: float
    origin_y: float
    uri: str | None


@dataclass
class Row:
    """One printed line: every span on a page that shares a baseline."""

    page: int
    x0: float
    y0: float
    x1: float
    y1: float
    spans: list[Span]

    @property
    def text(self) -> str:
        return "".join(s.text for s in self.spans)

    @property
    def first(self) -> Span:
        return next((s for s in self.spans if s.text.strip()), self.spans[0])

    @property
    def baseline(self) -> float:
        return max(self.spans, key=lambda s: (s.size >= 9.5, len(s.text))).origin_y

    @property
    def body_size(self) -> float:
        sizes = Counter[float]()
        for s in self.spans:
            sizes[round(s.size)] += len(s.text)
        return sizes.most_common(1)[0][0]


@dataclass
class Block:
    kind: str  # heading, para, item, more (an item's next paragraph), quote, code, math
    rows: list[Row] = field(default_factory=list[Row])
    level: int = 0
    text: str = ""


class Region(NamedTuple):
    kind: str  # figure or table
    number: str
    caption: str
    top: float
    bottom: float
    lines: int = 1  # rows the caption takes


def clean(text: str) -> str:
    for a, b in LIGATURES.items():
        text = text.replace(a, b)
    return text


def is_math(font: str) -> bool:
    return font.startswith(MATH_FONTS)


def is_mono(font: str) -> bool:
    return "Mono" in font


def page_rows(page: pymupdf.Page) -> list[Row]:
    """The page's text as rows, top to bottom, without the running header and footer."""
    uris: list[tuple[pymupdf.Rect, str]] = [
        (pymupdf.Rect(link["from"]), str(link["uri"])) for link in page.get_links() if link.get("uri")
    ]
    spans: list[tuple[float, float, Span]] = []
    # The stubs type get_text() as a union over every output mode; "dict" gives this shape.
    data = cast(RawPage, page.get_text("dict", flags=pymupdf.TEXT_PRESERVE_WHITESPACE))
    number = (page.number or 0) + 1
    for block in data["blocks"]:
        if block["type"] != 0:
            continue
        for line in block["lines"]:
            for s in line["spans"]:
                box = pymupdf.Rect(s["bbox"])
                if box.y1 < HEADER_BOTTOM or box.y0 > FOOTER_TOP or not s["text"]:
                    continue
                mid = pymupdf.Point((box.x0 + box.x1) / 2, (box.y0 + box.y1) / 2)
                uri = next((u for r, u in uris if r.contains(mid)), None)
                span = Span(clean(s["text"]), s["font"].split("+")[-1], s["size"], s["flags"],
                            box.x0, box.x1, s["origin"][1], uri)
                spans.append((box.y0, box.y1, span))
    # A row is spans whose vertical extents overlap a body-size span's baseline band.
    # Full-size spans that share a baseline make a row; small ones (superscripts,
    # subscripts, footnote markers) then join the row whose text band holds them.
    spans.sort(key=lambda t: (t[2].origin_y, t[2].x0))
    rows: list[Row] = []
    # Spaces join a row like small spans, or a space beside a footnote marker,
    # which sits higher, starts a row of its own.
    small = [t for t in spans if t[2].size < 9.5 or not t[2].text.strip()]
    for y0, y1, span in (t for t in spans if t[2].size >= 9.5 and t[2].text.strip()):
        row = next((r for r in rows[-3:] if abs(span.origin_y - r.baseline) < 2.5), None)
        if row is None:
            rows.append(Row(number, span.x0, y0, span.x1, y1, [span]))
        else:
            row.spans.append(span)
            row.x0, row.x1 = min(row.x0, span.x0), max(row.x1, span.x1)
            row.y0, row.y1 = min(row.y0, y0), max(row.y1, y1)
    for y0, y1, span in small:
        mid = (y0 + y1) / 2
        row = next((r for r in rows if r.body_size >= 9.5 and r.baseline - r.body_size * 1.05 <= mid <= r.baseline + r.body_size * 0.45), None)
        if row is None:
            row = next((r for r in rows if abs(span.origin_y - r.baseline) < 2), None)
        if row is None:
            if span.text.strip():
                rows.append(Row(number, span.x0, y0, span.x1, y1, [span]))
        else:
            row.spans.append(span)
            row.x0, row.x1 = min(row.x0, span.x0), max(row.x1, span.x1)
            row.y0, row.y1 = min(row.y0, y0), max(row.y1, y1)
    rows.sort(key=lambda r: r.y0)
    for row in rows:
        row.spans.sort(key=lambda s: s.x0)
        for n in range(1, len(row.spans)):
            a, b = row.spans[n - 1], row.spans[n]
            if b.x0 - a.x1 > 2.5 and not a.text[-1:].isspace() and not b.text[:1].isspace():
                row.spans[n] = b._replace(text=" " + b.text)
    rows.sort(key=lambda r: (round(r.y0), r.x0))
    return rows


def footnote_rule(page: pymupdf.Page) -> float | None:
    """The y of the short rule LaTeX draws above the footnotes, if the page has one."""
    for d in page.get_drawings():
        r = d["rect"]
        if r.height < 1 and BODY_LEFT - 2 < r.x0 < BODY_LEFT + 2 and 100 < r.width < 250 and r.y0 > 300:
            return r.y0
    return None


CAPTION = re.compile(r"^(Figure|Table) (\d+\.\d+): ?(.*)")


def is_prose(r: Row) -> bool:
    return r.first.font.startswith("Roboto") and 11.3 < r.body_size < 12.6 and r.x0 < BODY_LEFT + 3


def is_heading(r: Row) -> bool:
    return r.first.font in ("Roboto-Bold", "RobotoCondensed-Bold") and r.first.size > 13.5


def regions(page: pymupdf.Page, rows: list[Row]) -> list[Region]:
    """Figures and tables on the page, found from their captions, which sit below them.

    A region grows up from its caption over the lines, images and label text
    between it and the nearest line of prose or heading above, or the caption of
    the figure above. BOXES overrides the few the PDF fools.
    """
    found: list[Region] = []
    art = [pymupdf.Rect(d["rect"]) for d in page.get_drawings()]
    art = [a for a in art if HEADER_BOTTOM < a.y0 < FOOTER_TOP - 2 and not (a.height < 1 and a.width < 250 and a.y0 > 600)]
    art += [pymupdf.Rect(i["bbox"]) for i in page.get_image_info() if i["bbox"][1] > HEADER_BOTTOM]
    rules = sorted((a for a in art if a.height < 1 and a.width > 300), key=lambda a: a.y0)
    ceiling = HEADER_BOTTOM
    for i, row in enumerate(rows):
        m = CAPTION.match(row.text.strip())
        if not m:
            continue
        caption = m.group(3)
        j = i + 1
        # The caption runs on over rows set close under it, at its own indent or past the margin.
        while (j < len(rows) and rows[j].baseline - rows[j - 1].baseline < 1.42 * rows[j].body_size
               and (rows[j].x0 > BODY_LEFT + 20 or row.x0 < BODY_LEFT + 3)):
            caption += " " + rows[j].text.strip()
            j += 1
        bottom = rows[j - 1].y1
        barrier = max([ceiling] + [r.y1 for r in rows[:i] if is_heading(r) or is_text_line(r)])
        inside = [a.y0 for a in art if a.y0 >= barrier - 1 and a.y1 <= row.y0 + 2]
        inside += [r.y0 for r in rows[:i] if r.y0 >= barrier and is_label(r)]
        top = min(inside + [row.y0])
        if m.group(1) == "Table" and not any(top - 1 <= r.y0 <= row.y0 for r in rules):
            # A few tables put the caption above their rules.
            below = [r for r in rules if row.y1 <= r.y0 < row.y1 + 30]
            if below:
                bottom = max(r.y1 for r in rules if r.y0 >= below[0].y0)
        top, bottom = BOXES.get(m.group(2), (top - 2, bottom + 2))
        found.append(Region(m.group(1).lower(), m.group(2), clean(caption.strip()), top, bottom, j - i))
        ceiling = bottom
    # Rules outside every captioned region belong to a table with no caption: a
    # cross-reference table or the rest of a table from the page before.
    loose = [r for r in rules if not any(g.top <= r.y0 <= g.bottom for g in found)]
    if loose:
        found.append(Region("table", "", "", min(r.y0 for r in loose) - 2, max(r.y1 for r in loose) + 2))
    return found


def is_text_line(r: Row) -> bool:
    """A full line of body text, indented or not: what a figure never holds."""
    return 11.3 < r.body_size < 12.6 and r.x0 < 90 and r.x1 - r.x0 > 300 and not CAPTION.match(r.text.strip())


def is_label(r: Row) -> bool:
    """Text set inside a figure: small, or too short to be a line of prose."""
    return not is_prose(r) and not is_heading(r) and (r.body_size < 11.3 or r.x1 - r.x0 < 240)


# --- inline rendering ---------------------------------------------------------------


def math_tex(spans: list[Span], base: float) -> str:
    """TeX for a run of math spans; base is the baseline of the surrounding text."""
    out: list[str] = []
    level = 0  # +1 superscript, -1 subscript
    big = max(s.size for s in spans)
    for s in spans:
        text = s.text
        if not text.strip():
            out.append(" ")
            continue
        new = 0
        if s.size < big * 0.85 or s.size < 9.5:
            new = 1 if s.origin_y < base - 1 else -1
        if new != level:
            if level:
                out.append("}")
            if new:
                out.append("^{" if new > 0 else "_{")
            level = new
        tex = TEX.get(text.strip())
        if tex is None:
            tex = "".join(TEX.get(c, c) for c in text)
        if s.font.startswith("EUFM"):
            tex = rf"\mathfrak{{{tex.strip()}}}"
        elif s.font.startswith("MSBM"):
            tex = rf"\mathbb{{{tex.strip()}}}"
        elif s.font.startswith("CMSS"):
            tex = rf"\mathsf{{{tex.strip()}}}"
        elif s.font.startswith(("CMR", "CMBX")) and re.fullmatch(r"\s*[A-Za-z]{2,}\s*", text):
            tex = rf"\mathrm{{{tex.strip()}}}"
        out.append(tex)
    if level:
        out.append("}")
    return re.sub(r"\s+", " ", "".join(out)).strip()


def style_of(s: Span) -> str:
    if is_mono(s.font):
        return "code"
    bold = "Bold" in s.font or "Medium" in s.font
    italic = "Italic" in s.font
    return "bi" if bold and italic else "b" if bold else "i" if italic else ""


MARK = {"b": "**", "i": "*", "bi": "***", "": ""}


def escape(text: str) -> str:
    text = text.replace("\\", "\\\\").replace("*", "\\*").replace("_", "\\_")
    text = text.replace("<", "&lt;").replace("$", "\\$").replace("`", "\\`")
    return re.sub(r"^(\s*)([#>+-]|\d+\.)(\s)", lambda m: m.group(1) + "\\" + m.group(2) + m.group(3), text)


def styled(text: str, style: str) -> str:
    if style == "code":
        core = text.strip()
        if not core:
            return text
        tick = "``" if "`" in core else "`"
        pad = " " if core.startswith("`") or core.endswith("`") else ""
        lead, trail = text[: len(text) - len(text.lstrip())], text[len(text.rstrip()):]
        return f"{lead}{tick}{pad}{core}{pad}{tick}{trail}"
    mark = MARK[style]
    core = text.strip()
    if not mark or not core:
        return escape(text)
    lead, trail = text[: len(text) - len(text.lstrip())], text[len(text.rstrip()):]
    return f"{lead}{mark}{escape(core)}{mark}{trail}"


@dataclass
class Inline:
    chapter: int
    footnotes: dict[str, str]

    def render(self, rows: list[Row], in_footnote: bool = False) -> str:
        """Markdown for rows that form one paragraph: joined, dehyphenated and styled."""
        pieces: list[tuple[str, str, str | None]] = []  # (kind, text, uri); kind is a style, math or fn
        for n, row in enumerate(rows):
            spans = row.spans
            base = max((s for s in spans if not is_math(s.font)), key=lambda s: s.size, default=spans[0]).origin_y
            body = max(s.size for s in spans)
            i = 0
            if n:
                if pieces and pieces[-1][0] not in ("math", "fn"):
                    k, t, u = pieces[-1]
                    pieces[-1] = (k, t + "\n", u)
                else:
                    pieces.append(("", "\n", None))
            while i < len(spans):
                s = spans[i]
                if is_math(s.font) or (
                    s.text.strip() == "" and 0 < i < len(spans) - 1
                    and is_math(spans[i - 1].font) and is_math(spans[i + 1].font)
                ):
                    j = i
                    while j < len(spans) and (is_math(spans[j].font) or (
                        spans[j].text.strip() == "" and j + 1 < len(spans) and is_math(spans[j + 1].font))):
                        j += 1
                    run = spans[i:j]
                    if all(re.fullmatch(r"[\s.,;:()]*", r.text) for r in run):
                        pieces += [(style_of(spans[i - 1]) if i else "", r.text, r.uri or (spans[i - 1].uri if i else None)) for r in run]
                        i = j
                        continue
                    lead = " " if run[0].text[:1].isspace() else ""
                    trail = " " if run[-1].text[-1:].isspace() else ""
                    pieces.append(("math", lead + math_tex(run, base) + trail, None))
                    i = j
                    continue
                marker = (
                    not in_footnote and s.size < body * 0.75 and s.origin_y < base - 2
                    and re.fullmatch(r"\d+|[a-z]", s.text.strip()) is not None
                )
                if marker:
                    pieces.append(("fn", f"{self.chapter}-{s.text.strip()}", None))
                else:
                    pieces.append((style_of(s), s.text, s.uri))
                i += 1
        return self.join(pieces)

    def join(self, pieces: list[tuple[str, str, str | None]]) -> str:
        # Merge neighbours with the same style and link, then dehyphenate across line breaks.
        merged: list[list[str | None]] = []
        for kind, text, uri in pieces:
            if merged and kind not in ("math", "fn") and merged[-1][0] == kind and merged[-1][2] == uri:
                merged[-1][1] = str(merged[-1][1]) + text
            else:
                merged.append([kind, text, uri])
        out: list[str] = []
        for kind, text, uri in merged:
            assert kind is not None and text is not None
            if kind == "math":
                core = text.strip()
                lead, trail = text[: len(text) - len(text.lstrip())], text[len(text.rstrip()):]
                out.append(f"{lead}${core}${trail}" if core else text)
            elif kind == "fn":
                out.append(f"[^{text}]")
            else:
                rendered = styled(text, kind)
                label = text.strip().replace("\n", "")
                if uri and re.search(r"\w", label):
                    rendered = link(label, uri)
                    if text[:1].isspace():
                        rendered = " " + rendered
                    if text[-1:].isspace():
                        rendered += " "
                out.append(rendered)
        md = "".join(out)
        md = re.sub(r"([\w-]+)-\n(\w+)", lambda m: dehyphen(m.group(1), m.group(2)), md)
        md = re.sub(r"\s*\n\s*", " ", md)
        md = re.sub(r" {2,}", " ", md)
        return link_citations(md).strip()


def link(label: str, uri: str) -> str:
    """A link, named from links.tsv when the book prints the bare URL as its text."""
    urls = re.split(r",\s*<?", label)
    if len(urls) > 1 and all(u.startswith("http") for u in urls):
        # One link annotation over a list of URLs: link each to itself.
        return ", ".join(link(u.rstrip(">"), u.rstrip(">")) for u in urls)
    if re.match(r"https?://", label):
        name = LINK_NAMES.get(uri) or LINK_NAMES.get(label)
        if name:
            return f"[{escape(name)}]({uri})"
    return f"[{escape(label)}]({uri})"


# A citation: numbers and ranges of reference numbers, with locators such as
# "c4-7" (chapters 4 to 7) or "p. 12", separated by commas.
CITE_NUMBER = r"\d+(?:\s?[–-]\s?\d+)?"
CITATION = re.compile(rf"(?<![\\!])\[({CITE_NUMBER}(?:,\s?(?:{CITE_NUMBER}|[A-Za-z][^,\]\[]{{0,24}}))*)\](?!\()")
CITED = re.compile(r'aria-label="References? (\d+)(?:–(\d+))?"')


def cite(m: re.Match[str]) -> str:
    """A citation with each reference number a link to its entry in the reference list."""
    parts: list[str] = []
    for item in re.split(r",\s?", m.group(1)):
        r = re.fullmatch(r"(\d+)\s?[–-]\s?(\d+)", item)
        if r:
            parts.append(f'<a href="#ref-{r.group(1)}" aria-label="References {r.group(1)}–{r.group(2)}">{r.group(1)}–{r.group(2)}</a>')
        elif item.isdigit():
            parts.append(f'<a href="#ref-{item}" aria-label="Reference {item}">{item}</a>')
        else:
            parts.append(escape(item))
    return "\\[" + ", ".join(parts) + "\\]"


def link_citations(md: str) -> str:
    """The Markdown with every citation outside math linked to the reference list."""
    return "".join(part if part.startswith("$") else CITATION.sub(cite, part) for part in re.split(r"(\$[^$]+\$)", md))


def cited_numbers(md: str) -> list[str]:
    """Every reference number the Markdown cites, with ranges filled in."""
    out: list[str] = []
    for a, b in CITED.findall(md):
        out += [str(n) for n in range(int(a), int(b or a) + 1)] if not b or int(b) - int(a) < 200 else [a, b]
    return out


WORDS: Counter[str] = Counter()


SUFFIXES = {"fully", "sion", "tion", "ity", "ities", "ate", "ment", "ness", "ly", "sheets"}


def dehyphen(left: str, right: str) -> str:
    """Join a word LaTeX split at a line end, keeping the hyphen of a real compound."""
    head = re.split(r"\W", left)[-1]
    joined, hyphened = (head + right).lower(), f"{head}-{right}".lower()
    if head[:1].isupper() and right[:1].isupper():
        keep = True
    elif WORDS[joined] or WORDS[hyphened]:
        keep = WORDS[hyphened] > WORDS[joined]
    else:
        # Neither spelling appears elsewhere: keep the hyphen between two real words.
        keep = WORDS[head.lower()] > 0 and WORDS[right.lower()] > 0 and len(head) > 1 and right.lower() not in SUFFIXES
    return f"{left}-{right}" if keep else f"{left}{right}"


# --- block structure ----------------------------------------------------------------


def classify(rows: list[Row], captions: dict[int, bool]) -> list[Block]:
    """Group a chapter's rows into blocks of one kind each.

    captions holds the rows of figure and table captions, True for the first row
    of each; a caption is a block of its own that nothing else joins.
    """
    blocks: list[Block] = []
    prev: Row | None = None
    for row in rows:
        first = row.first
        text = row.text.strip()
        if id(row) in captions:
            if captions[id(row)] or not blocks or blocks[-1].kind != "caption":
                blocks.append(Block("caption", [row]))
            else:
                blocks[-1].rows.append(row)
            prev = row
            continue
        if blocks and blocks[-1].kind == "caption" and prev is not None and not is_heading(row):
            # Text that runs on past a figure joins the paragraph the figure interrupted.
            before = next((b for b in reversed(blocks) if b.kind != "caption"), None)
            if (before is not None and before.kind in ("para", "item", "more", "quote")
                    and before.rows[-1].x1 > BODY_RIGHT - 25
                    and not re.search(r"[.:?!”’)]$", before.rows[-1].text.strip())
                    and (row.x0 > before.rows[0].x0 + 3 if before.kind == "item"
                         else (row.x0 - BODY_LEFT > 20) == (before.rows[-1].x0 - BODY_LEFT > 20))
                    and not text[:1] in "•–◦"):
                before.rows.append(row)
                prev = row
                continue
        heading = first.font in ("Roboto-Bold", "RobotoCondensed-Bold") and first.size > 13.5
        if heading:
            if blocks and blocks[-1].kind == "heading" and prev is not None and row.y0 - prev.y1 < 8 and row.page == prev.page:
                blocks[-1].rows.append(row)
            else:
                blocks.append(Block("heading", [row], 3 if first.size < 16 else 2))
            prev = row
            continue
        mono = all(is_mono(s.font) or not s.text.strip() for s in row.spans)
        display = all(is_math(s.font) or not s.text.strip() or s.text.strip() in ",.;" for s in row.spans) and len(text) > 1
        bullet = text[:1] in "•–◦" and first.text.strip() in ("•", "–", "◦")
        numbered = re.match(r"^\(?\d+[.)]\s|^\([a-z]\)\s", text) is not None and row.x0 > BODY_LEFT + 5
        indent = row.x0 - BODY_LEFT
        if bullet or numbered:
            blocks.append(Block("item", [row], level=0 if indent < 30 else 1))
        elif mono:
            if blocks and blocks[-1].kind == "code" and prev is not None and row.y0 - prev.y1 < 6:
                blocks[-1].rows.append(row)
            else:
                blocks.append(Block("code", [row]))
        elif display and row.x0 > BODY_LEFT + 30:
            blocks.append(Block("math", [row]))
        else:
            last = blocks[-1] if blocks else None
            continues = False
            if last is not None and last.kind in ("para", "item", "more", "quote") and prev is not None:
                if prev.page != row.page:
                    # First row on a new page: it continues unless the last row ended short.
                    continues = prev.x1 > BODY_RIGHT - 25
                else:
                    pitch = row.baseline - prev.baseline
                    continues = pitch < row.body_size * 1.42 and abs(row.body_size - prev.body_size) < 1.5
                head = last.rows[0]
                if last.kind == "item":
                    # An item's wrapped rows hang to the right of its bullet.
                    continues = continues and row.x0 > head.x0 + 3
                elif last.kind == "para" and len(last.rows) == 1 and "Bold" in head.first.font:
                    # A bold term whose description hangs under it.
                    pass
                elif (indent > 20) != ((last.rows[1] if len(last.rows) > 1 and "Bold" in head.first.font else head).x0 - BODY_LEFT > 20):
                    continues = False
            if continues and last is not None:
                last.rows.append(row)
            else:
                # The sources for a section sit indented under its heading.
                sources = re.fullmatch(r"(\[[^\]]+\]\s*)+", text) is not None
                # A short indented line with math in it is a displayed formula.
                formula = any(is_math(s.font) for s in row.spans) and row.x1 - row.x0 < 350
                kind = "quote" if indent > 20 and not sources and not formula else "para"
                item: Block | None = None
                for b in reversed(blocks):
                    if b.kind not in ("item", "more"):
                        break
                    if b.kind == "item" and hangs(b, row):
                        item = b
                        break
                if kind == "quote" and item is not None:
                    kind = "more"
                blocks.append(Block(kind, [row], level=item.level if kind == "more" and item else 0))
        prev = row
    return blocks


def hangs(item: Block, row: Row) -> bool:
    """Whether the row lines up with the text of the item, past its bullet or number."""
    head = item.rows[0]
    text_x0 = item.rows[1].x0 if len(item.rows) > 1 else head.spans[1].x0 if len(head.spans) > 1 else head.x0 + 10
    return abs(row.x0 - text_x0) < 3


def heading_text(block: Block, toc: dict[str, str]) -> tuple[int, str]:
    """The heading's level and text, cased as the PDF outline has it where it can be."""
    text = " ".join(r.text.strip() for r in block.rows)
    text = re.sub(r"\s+", " ", text)
    m = re.match(r"^(\d+(?:\.\d+)*)\s+(.*)$", text)
    if not m:
        return block.level, smart_title(text) if text.isupper() else text
    number, title = m.group(1), m.group(2)
    if number in toc:
        title = toc[number]
    elif title.isupper():
        title = smart_title(title)
    return min(number.count(".") + 1, 5), f"{number} {title}"


SMALL = {"a", "an", "and", "as", "at", "by", "for", "from", "in", "of", "on", "or", "the", "to", "vs", "via", "with"}
KEEP = {"CYBOK": "CyBOK", "KA": "KA", "KAS": "KAs", "PKI": "PKI", "TLS": "TLS", "API": "API", "IT": "IT", "AI": "AI"}


def smart_title(title: str) -> str:
    """Sentence case for headings the PDF sets in capitals, as the TOC does not."""
    words = title.split()
    out: list[str] = []
    for n, w in enumerate(words):
        core = re.sub(r"[^\w&]", "", w)
        if core.upper() in KEEP:
            out.append(w.replace(core, KEEP[core.upper()]))
        elif n == 0:
            out.append(w.capitalize())
        else:
            out.append(w.lower() if core.lower() in SMALL else "-".join(p.capitalize() for p in w.split("-")))
    return " ".join(out)


# --- bibliography -------------------------------------------------------------------


def bibliography(doc: pymupdf.Document, inline: Inline) -> dict[str, str]:
    entries: dict[str, list[Row]] = {}
    current: str | None = None
    for pno in range(BIBLIOGRAPHY[0] - 1, BIBLIOGRAPHY[1]):
        for row in page_rows(doc[pno]):
            m = re.match(r"^\[(\d+)\]\s", row.text.strip())
            if m and row.x0 < 80:
                current = str(m.group(1))
                entries[current] = [row]
            elif current and row.x0 > 90:
                entries[current].append(row)
    out: dict[str, str] = {}
    for num, rows in entries.items():
        md = inline.render(rows, in_footnote=True)
        md = re.sub(r"^\\\[<a [^>]*>" + num + r"</a>\\\]\s*|^\\?\[" + num + r"\\?\]\s*", "", md)
        out[num] = name_link(linkify(md), num)
    return out


# A URL as printed, which may hold balanced parentheses (a DOI like S1389-1286(99)00112-7)
# but does not end in punctuation.
URL = r"https?://(?:[^\s()<>*`”]|\([^\s()]*\))*(?:[^\s().,;:<>*`”\"]|\([^\s()]*\))"
URL_LINK = re.compile(rf"\[(https?://[^\]]*)\]\(({URL})\)|<({URL})>")
TITLE = re.compile(r"“([^”]+?)([,.]?)”|\*([^*]+)\*")


def name_link(md: str, num: str) -> str:
    """Put a reference's URL on its title, since a bare URL is no name for a link (WCAG 2.4.9).

    "[Online]. Available: URL" goes away and the title becomes the link. An entry with
    no title in quotes or italics keeps the URL where it is, named for the entry.
    """
    m = URL_LINK.search(md)
    if not m:
        return md
    url = m.group(2) or m.group(3)
    title = TITLE.search(md)
    available = re.search(r"\s*\[Online\]\.?\s*Available:?\s*$", md[: m.start()])
    if title and available and title.end() <= available.start():
        md = md[: available.start()] + md[m.end():]
        if title.group(1):
            linked = f"“[{title.group(1)}]({url}){title.group(2)}”"
        else:
            linked = f"*[{title.group(3)}]({url})*"
        return md[: title.start()] + linked + md[title.end():]
    return md[: m.start()] + f"[online copy of reference {num}]({url})" + md[m.end():]


# A link whose text is its URL, an autolink, or a bare URL that markdown-it would link,
# with code spans and fences matched first so the URLs in them are left alone.
BARE_URL = re.compile(
    rf"(?P<code>```.*?```|`[^`\n]*`)|\[(https?://[^\]]*)\]\(({URL})\)|<({URL})>|(?<![(\w/<`])(?<!=\")({URL})",
    re.S,
)


def name_urls(body: str, number: int) -> str:
    """Name each link the book prints as a bare URL, from links.tsv (WCAG 2.4.9).

    A name of "-" marks a made-up address in an example, which becomes code
    rather than a link.
    """
    def named(m: re.Match[str]) -> str:
        if m.group("code"):
            return m.group(0)
        url = (m.group(3) or m.group(4) or m.group(5)).replace("\\", "")
        name = LINK_NAMES.get(url)
        if name == "-":
            return f"`{url}`"
        if name:
            return f"[{escape(name)}]({url})"
        print(f"chapter {number}: no name in links.tsv for {url}", file=sys.stderr)
        return m.group(0)
    return BARE_URL.sub(named, body)


def linkify(md: str) -> str:
    """Turn bare URLs (the reference list prints them as text) into links."""
    return re.sub(rf"(?<![(<\[])({URL})", r"<\1>", md)


# --- chapter assembly ---------------------------------------------------------------


def chapter(doc: pymupdf.Document, number: int, slug: str, first: int, last: int,
            refs: dict[str, str], out: Path, crops: Path | None) -> None:
    inline = Inline(number, {})
    flow: list[Row] = []
    notes: list[Row] = []
    includes: list[tuple[Row, Region]] = []
    authors: list[str] = []
    xref_heading = False
    captions: dict[int, bool] = {}
    for pno in range(first - 1, last):
        page = doc[pno]
        rows = page_rows(page)
        if pno == first - 1:
            # The chapter's title page holds only the title and the authors.
            for r in rows:
                if r.first.size < 20:
                    names = [s.text.strip() for s in r.spans if s.text.strip()]
                    authors.append(f"{names[0]} ({' '.join(names[1:])})" if len(names) > 1 else names[0])
            continue
        rule = footnote_rule(page)
        regs = regions(page, rows)
        more = 0  # caption rows still to come
        for row in rows:
            # A box can carry its own footnotes in mid page, so only small text under the rule is a note.
            if rule is not None and row.y0 > rule and row.body_size < 11:
                notes.append(row)
                continue
            reg = next((g for g in regs if g.top <= (row.y0 + row.y1) / 2 <= g.bottom), None)
            if more:
                more -= 1
                captions[id(row)] = False
                flow.append(row)
                continue
            if reg is not None:
                if CAPTION.match(row.text.strip()):
                    includes.append((row, reg))
                    captions[id(row)] = True
                    more = reg.lines - 1
                    flow.append(row)
                elif not reg.number and xref_heading and not any(g.kind == "xref" for _, g in includes):
                    # The cross-reference table near the end of the chapter.
                    includes.append((row, reg._replace(kind="xref", number=str(number))))
                    captions[id(row)] = True
                    flow.append(row)
                continue
            if any(s.font.startswith(FIGURE_FONTS) for s in row.spans):
                continue
            xref_heading = xref_heading or (is_heading(row) and "CROSS" in row.text)
            flow.append(row)
    blocks = classify(flow, captions)
    lines: list[str] = []
    toc = {m.group(1): m.group(2) for t in doc.get_toc() if (m := re.match(r"^(\d+(?:\.\d+)*) (.*)$", str(t[1])))}
    toc_title = toc[str(number)]
    title = f"Chapter {number}: {toc_title}"
    include_rows = {id(r): g for r, g in includes}
    numbers = {g.number for _, g in includes}
    cited: list[str] = []
    hang: dict[int, str] = {}
    for block in blocks:
        first_row = block.rows[0]
        if id(first_row) in include_rows:
            g = include_rows[id(first_row)]
            caption = "" if g.kind == "xref" else inline.render(block.rows)
            lines.append(insert(doc, first_row, g, caption, out))
            cited += cited_numbers(lines[-1])
            continue
        if block.kind == "heading":
            level, text = heading_text(block, toc)
            lines.append(f"{'#' * level} {escape(text)}")
        elif block.kind == "code":
            code = "\n".join(r.text.rstrip() for r in block.rows)
            lines.append(f"```text\n{code}\n```")
        elif block.kind == "math":
            base = max(block.rows[0].spans, key=lambda s: s.size).origin_y
            lines.append("$$\n" + math_tex(block.rows[0].spans, base) + "\n$$")
        else:
            md = inline.render(block.rows)
            if block.kind == "item":
                md = re.sub(r"^\\?[•–◦]\s*", "", md)
                md = re.sub(r"^\\?(\d+)\\?\.\s", r"\1. ", md)
                # A nested item lines up with its parent's text, past the "1. " or "- ".
                lead = hang.get(block.level - 1, "  ") if block.level else ""
                lines.append(lead + (md if re.match(r"^\d+\. ", md) else f"- {md}"))
                marker = re.match(r" *(\d+\. |- )", lines[-1])
                hang[block.level] = " " * (len(lead) + len(marker.group(1) if marker else "- "))
            elif block.kind == "more":
                lines.append(hang.get(block.level, "  ") + md)
            elif block.kind == "quote":
                lines.append("> " + md)
            else:
                lines.append(md)
            lines[-1] = re.sub(r"\b(Figure|Table) (\d+)\.(\d+)\b(?![^\[]*\])",
                               lambda m: f"[{m.group(0)}](#{m.group(1).lower()}-{m.group(2)}-{m.group(3)})"
                               if f"{m.group(2)}.{m.group(3)}" in numbers else m.group(0), lines[-1])
        cited += cited_numbers(lines[-1])
    body = "\n\n".join(lines)
    # Consecutive list items and quote lines belong to one list or quote.
    while (joined := re.sub(r"(^(?: *- | *\d+\. ).*)\n\n(?=(?: *- | *\d+\. ))", r"\1\n", body, flags=re.M)) != body:
        body = joined
    while (joined := re.sub(r"(^> .*)\n\n(?=> )", r"\1\n>\n", body, flags=re.M)) != body:
        body = joined
    # Chapter 3 sets its notes as endnotes under a NOTES heading rather than at
    # the foot of each page. Make them footnotes like everyone else's.
    body = re.sub(r"^## Notes\n\n(.*?)(?=^## |\Z)", lambda m: endnotes(m.group(1), number), body, flags=re.M | re.S)
    # Footnotes.
    fn: dict[str, list[Row]] = {}
    cur: str | None = None
    for row in notes:
        m = re.match(r"^(\d+|[a-z])", row.text.strip())
        if m and row.first.size < 8.5 and row.x0 < 80:
            cur = str(m.group(1))
            if cur.isalpha():
                # A box numbers its notes a, b, ... afresh, so count each letter's uses.
                cur += str(sum(k.rstrip("0123456789") == cur for k in fn) + 1)
            fn[cur] = [row]
        elif cur:
            fn[cur].append(row)
    # Two markers set side by side, like 14 and 15, read as one number. Split it
    # where both halves are notes.
    def split_marker(m: re.Match[str]) -> str:
        n = m.group(1)
        if n in fn:
            return m.group(0)
        cut = next((i for i in range(1, len(n)) if n[:i] in fn and n[i:] in fn), None)
        return m.group(0) if cut is None else f"[^{number}-{n[:cut]}][^{number}-{n[cut:]}]"

    if fn:
        body = re.sub(rf"\[\^{number}-(\d+)\](?!:)", split_marker, body)
    # The k-th box note marked "a" in the text goes with the k-th "a" note.
    uses: dict[str, int] = {}

    def box_marker(m: re.Match[str]) -> str:
        uses[m.group(1)] = uses.get(m.group(1), 0) + 1
        return f"[^{number}-{m.group(1)}{uses[m.group(1)]}]"

    body = re.sub(rf"\[\^{number}-([a-z])\]", box_marker, body)
    fn_lines: list[str] = []
    for n, rows in fn.items():
        md = inline.render(rows, in_footnote=True)
        # A box note's letter comes out in italics ("*a*"), a page note's number does not.
        lead = rf"\*?{n.rstrip('0123456789')}\*?" if n[0].isalpha() else n
        md = re.sub(rf"^{lead}\s*", "", md)
        fn_lines.append(f"[^{number}-{n}]: {linkify(md)}")
        cited += cited_numbers(md)
    seen: list[str] = []
    for c in cited:
        if c not in seen:
            seen.append(c)
    ref_lines = [f'- <span id="ref-{c}">\\[{c}\\]</span> {refs.get(c, "(missing from the bibliography)")}'
                 for c in sorted(seen, key=int)]
    body = spell_out(body + ("\n\n" + "\n\n".join(fn_lines) if fn_lines else ""), number, ABBREVIATIONS_FOUND)
    body = name_urls(body, number)
    page = f"""---
title: "{title}"
outline: [2, 3]
---

# {title}

**Authors:** {", ".join(authors)}

{NOTICE}

{body}
"""
    if ref_lines:
        page += "\n## References\n\n" + "\n".join(ref_lines) + "\n"
    (out / f"{number:02d}-{slug}.md").write_text(re.sub(r"\n{3,}", "\n\n", page))
    for row, g in includes:
        if crops is not None and g.kind != "xref":
            clip = pymupdf.Rect(BODY_LEFT - 6, g.top, BODY_RIGHT + 6, g.bottom)
            doc[row.page - 1].get_pixmap(clip=clip, dpi=216).save(crops / f"{g.kind}-{g.number.replace('.', '-')}.png")
        print(f"{g.kind} {g.number} p{row.page} y{g.top:.0f}-{g.bottom:.0f}: {g.caption[:60]}", file=sys.stderr)


PARTS = Path(__file__).parent
LINK_NAMES: dict[str, str] = dict(
    line.split("\t", 1) for line in (PARTS / "links.tsv").read_text().splitlines()
    if line and not line.startswith("#")
)
NOTICE = """::: info About this page
This chapter is from [CyBOK Version 1.2.0](https://www.cybok.org/), © Crown Copyright, The National
Cyber Security Centre 2026, licensed under the
[Open Government Licence](https://www.nationalarchives.gov.uk/doc/open-government-licence/).
It was converted from the [PDF](https://www.cybok.org/wp-content/uploads/CyBOK_v1.2.0.pdf) into
a web page so that it works with screen readers and other assistive technology. Each
abbreviation is spelled out in square brackets the first time it appears, and those meanings are
ours, not the book's. So are the names of links the book prints as a bare web address. The PDF
(Portable Document Format) is the original, so if the two disagree, the PDF wins.
:::"""
MISSING: list[str] = []
ABBREVIATIONS_FOUND: dict[str, set[str]] = {}  # the Acronyms appendix, read once


def acronyms(doc: pymupdf.Document) -> dict[str, set[str]]:
    """Every meaning the Acronyms appendix gives each abbreviation.

    An entry is the abbreviation in bold, then its meaning, which may run onto
    the next line.
    """
    found: dict[str, set[str]] = {}
    key, meaning = "", ""

    def keep() -> None:
        if key:
            found.setdefault(key, set()).add(re.sub(r"\.$", "", meaning.strip()))

    for pno in range(ACRONYMS[0] - 1, ACRONYMS[1]):
        for row in page_rows(doc[pno]):
            spans = [s for s in row.spans if s.text.strip()]
            if spans[0].size > 13:
                continue  # the appendix heading
            if "Bold" in spans[0].font:
                keep()
                key = "".join(s.text for s in spans if "Bold" in s.font).strip()
                meaning = "".join(s.text for s in spans if "Bold" not in s.font)
            else:
                meaning += " " + row.text.strip()
    keep()
    return found


# Text in a chapter that is not prose: math, code, images, link targets, HTML
# tags, URLs, footnote markers and headings. Spelling out stays out of all of it.
NOT_PROSE = re.compile(r"\$\$.*?\$\$|\$[^$\n]+\$|```.*?```|`[^`\n]*`|!\[[^\]]*\]|\]\([^)\s]*\)|<[^>]+>"
                       r"|https?://[^\s)\]|]+|\[\^[\d-]+\]|^#[^\n]*$", re.S | re.M)
ABBREVIATION = re.compile(r"(?<![\w/.@&-])([A-Z][A-Za-z0-9&]*[A-Z0-9])(s?)(?![\w/@&-])")


def spell_out(text: str, number: int, appendix: dict[str, set[str]]) -> str:
    """The text with each abbreviation spelled out in brackets the first time it is used.

    The brackets mark the meaning as ours, not the book's. An abbreviation the
    chapter spells out itself at or before its first use is left alone, and so is
    one the appendix gives two meanings for and the tables above do not settle.
    """
    meanings = {k: next(iter(v)) for k, v in appendix.items() if len(v) == 1}
    meanings.update(ABBREVIATIONS)
    meanings.update(CHAPTER_ABBREVIATIONS.get(number, {}))
    skip = [(m.start(), m.end()) for m in NOT_PROSE.finditer(text)]
    seen: set[str] = set()
    out: list[str] = []
    last = 0
    for m in ABBREVIATION.finditer(text):
        word, at = m.group(1), m.start()
        if any(a <= at < b for a, b in skip) or word in seen:
            continue
        if word not in meanings:
            if word in appendix:
                seen.add(word)
                print(f"chapter {number}: {word} has more than one meaning: {sorted(appendix[word])}", file=sys.stderr)
            continue
        seen.add(word)
        meaning = meanings[word]
        # Spelled out by the book already: "Transport Layer Security (TLS)" or "TLS (Transport ...".
        own = re.search(rf"\(\s*{re.escape(word)}s?\s*[),/]|(?<![\w-]){re.escape(word)}s?\s+\(", text[: m.end() + 3])
        if own or meaning.lower() in text[max(0, at - 150): m.end() + 150].lower():
            continue
        out.append(text[last: m.end()] + f" \\[{meaning}\\]")
        last = m.end()
    return "".join(out) + text[last:]


def endnotes(section: str, number: int) -> str:
    """Footnote definitions for a chapter's endnotes, one paragraph each.

    A note starts with its marker, or with its bare number where the PDF's
    superscript was missed. Any other paragraph continues the note above it.
    """
    out: list[str] = []
    # A note the PDF set close under the one above runs on into it.
    section = re.sub(rf" (\[\^{number}-\d+\])(?=\w)", r"\n\n\1", section)
    for para in section.strip().split("\n\n"):
        m = re.match(rf"^(?:\[\^{number}-(\d+)\]|(\d+) )", para)
        if m:
            out.append(f"[^{number}-{m.group(1) or m.group(2)}]: {para[m.end():].strip()}")
        elif out:
            out[-1] += "\n\n    " + para
    return "\n\n".join(out) + "\n\n"


def insert(doc: pymupdf.Document, caption_row: Row, g: Region, caption: str, out: Path) -> str:
    """The Markdown for a figure or table: its hand-written file, wrapped in a figure."""
    name = f"{g.kind}-{g.number.replace('.', '-')}"
    path = PARTS / f"{'tables' if g.kind == 'xref' else g.kind + 's'}/{name}.md"
    if not path.exists():
        MISSING.append(str(path))
        return f"::: warning Missing\n{name} has no {path.name} yet.\n:::"
    text = path.read_text().strip() + "\n"
    head, _, body = text.partition("\n---\n") if text.startswith("alt:") else ("", "", text)
    body = link_citations(body)
    if g.kind == "xref":
        return body
    if g.kind == "table" or not head:
        return f'<figure id="{name}">\n\n<figcaption>\n\n{caption}\n\n</figcaption>\n\n{body}\n\n</figure>'
    alt = head.removeprefix("alt:").strip()
    clip = pymupdf.Rect(BODY_LEFT - 6, g.top, BODY_RIGHT + 6, caption_row.y0 - 3)
    pix = doc[caption_row.page - 1].get_pixmap(clip=clip, dpi=IMAGE_DPI)
    (out / "images").mkdir(exist_ok=True)
    pix.save(out / "images" / f"{name}.png")
    size = f"{{width={round(clip.width * 96 / 72)} height={round(clip.height * 96 / 72)}}}"
    md = f'<figure id="{name}">\n\n![{alt}](./images/{name}.png){size}\n\n<figcaption>\n\n{caption}\n\n</figcaption>\n</figure>'
    if body:
        md += f"\n\n::: details Text description of {g.kind.capitalize()} {g.number}\n\n{body.strip()}\n\n:::"
    return md


def main() -> None:
    parser = argparse.ArgumentParser(description=(__doc__ or "").split("\n\n")[0])
    parser.add_argument("pdf", type=Path)
    parser.add_argument("out", type=Path)
    parser.add_argument("--crops", type=Path, help="write a PNG of each figure and table here")
    parser.add_argument("--only", type=int, action="append", help="convert only these chapter numbers")
    args = parser.parse_args()
    doc = pymupdf.open(args.pdf)
    for pno in range(len(doc)):
        # Words split across lines would count their halves as words, so leave them out.
        # Plain text mode; the stubs type get_text() as the union of every mode.
        text = re.sub(r"[\w-]*\w-\n\w+", " ", clean(cast(str, doc[pno].get_text())))
        WORDS.update(w.lower() for w in re.findall(r"\w+(?:-\w+)*", text))
    args.out.mkdir(parents=True, exist_ok=True)
    refs = bibliography(doc, Inline(0, {}))
    ABBREVIATIONS_FOUND.update(acronyms(doc))
    for number, slug, first, last in CHAPTERS:
        if args.only and number not in args.only:
            continue
        chapter(doc, number, slug, first, last, refs, args.out, args.crops)
    if MISSING:
        print(f"{len(MISSING)} figure and table files are missing:", *MISSING, sep="\n  ", file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()
