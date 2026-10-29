"""Draw the CS331 home page banner: a network around a shield and padlock.

The banner is decoration only, so it has no text in it (WCAG 1.4.9). The seed is
fixed, so running this again writes the same file.

    python3 scripts/cs331/banner.py > docs/cs331/images/cs331-banner.svg
"""

import math
import random
import sys
from typing import NamedTuple

WIDTH, HEIGHT = 1046, 160
CX, CY = WIDTH / 2, HEIGHT / 2
BLUE, DEEP, ORANGE, LIGHT = "#0033a0", "#001f66", "#d64309", "#7fa3ff"


class Node(NamedTuple):
    x: float
    y: float


def place_nodes(rng: random.Random, count: int) -> list[Node]:
    """Scatter nodes at least 34 px apart, keeping the middle clear for the shield."""
    nodes: list[Node] = []
    while len(nodes) < count:
        n = Node(rng.uniform(8, WIDTH - 8), rng.uniform(8, HEIGHT - 8))
        if abs(n.x - CX) < 90 and abs(n.y - CY) < 75:
            continue
        if all(math.dist(n, m) > 34 for m in nodes):
            nodes.append(n)
    return nodes


def shield(inset: float) -> str:
    """The path of the shield outline, shrunk by inset on every side."""
    top, side, bottom = 62 - inset, 46 - inset * 0.9, 64 - inset
    return (
        f"M{CX} {CY - top} L{CX + side} {CY - top + 17} V{CY - 2} "
        f"C{CX + side} {CY + 30} {CX + 22} {CY + bottom - 12} {CX} {CY + bottom} "
        f"C{CX - 22} {CY + bottom - 12} {CX - side} {CY + 30} {CX - side} {CY - 2} "
        f"V{CY - top + 17} Z"
    )


def banner() -> str:
    rng = random.Random(331)
    nodes = place_nodes(rng, 70)
    out = [
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {WIDTH} {HEIGHT}" aria-hidden="true">',
        "<defs>",
        f'<radialGradient id="bg" cx="50%" cy="50%" r="65%"><stop offset="0" stop-color="{BLUE}"/>'
        f'<stop offset="1" stop-color="{DEEP}"/></radialGradient>',
        '<pattern id="hex" width="24" height="41.57" patternUnits="userSpaceOnUse">'
        '<path d="M6 0h12l6 10.39-6 10.39H6L0 10.39zM0 31.18l6-10.39M24 31.18l-6-10.39'
        'M6 41.57l-6-10.39M18 41.57l6-10.39" fill="none" stroke="#fff" stroke-opacity=".05"/></pattern>',
        f'<radialGradient id="glow"><stop offset="0" stop-color="{ORANGE}" stop-opacity=".35"/>'
        f'<stop offset="1" stop-color="{ORANGE}" stop-opacity="0"/></radialGradient>',
        "</defs>",
        f'<rect width="{WIDTH}" height="{HEIGHT}" fill="url(#bg)"/>',
        f'<rect width="{WIDTH}" height="{HEIGHT}" fill="url(#hex)"/>',
    ]

    # Link each node to its 2 nearest neighbours.
    edges: set[tuple[int, int]] = set()
    for i, a in enumerate(nodes):
        for j in sorted(range(len(nodes)), key=lambda k: math.dist(a, nodes[k]))[1:3]:
            edges.add((min(i, j), max(i, j)))
    for i, j in sorted(edges):
        a, b = nodes[i], nodes[j]
        out.append(
            f'<line x1="{a.x:.1f}" y1="{a.y:.1f}" x2="{b.x:.1f}" y2="{b.y:.1f}" '
            f'stroke="{LIGHT}" stroke-opacity=".35"/>'
        )

    # The 6 nodes nearest the shield send it traffic.
    hubs = sorted(nodes, key=lambda n: math.dist(n, (CX, CY)))[:6]
    for n in hubs:
        out.append(
            f'<line x1="{n.x:.1f}" y1="{n.y:.1f}" x2="{CX}" y2="{CY}" stroke="{ORANGE}" '
            'stroke-width="1.5" stroke-dasharray="4 4" stroke-opacity=".8"/>'
        )
    for k, n in enumerate(nodes):
        if n in hubs or k % 9 == 0:
            out.append(f'<circle cx="{n.x:.1f}" cy="{n.y:.1f}" r="4" fill="{ORANGE}"/>')
        else:
            out.append(
                f'<circle cx="{n.x:.1f}" cy="{n.y:.1f}" r="2.6" fill="{BLUE}" '
                f'stroke="{LIGHT}" stroke-width="1.2"/>'
            )

    out += [
        f'<circle cx="{CX}" cy="{CY}" r="95" fill="url(#glow)"/>',
        f'<path d="{shield(0)}" fill="{DEEP}" stroke="{ORANGE}" stroke-width="4" stroke-linejoin="round"/>',
        f'<path d="{shield(10)}" fill="none" stroke="{LIGHT}" stroke-opacity=".5" stroke-width="1.5"/>',
        f'<path d="M{CX - 13} {CY - 4} V{CY - 16} A13 13 0 0 1 {CX + 13} {CY - 16} V{CY - 4}" '
        'fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round"/>',
        f'<rect x="{CX - 20}" y="{CY - 5}" width="40" height="32" rx="5" fill="#fff"/>',
        f'<circle cx="{CX}" cy="{CY + 7}" r="5" fill="{DEEP}"/>',
        f'<rect x="{CX - 2}" y="{CY + 8}" width="4" height="11" rx="2" fill="{DEEP}"/>',
        "</svg>",
    ]
    return "\n".join(out) + "\n"


if __name__ == "__main__":
    sys.stdout.write(banner())
