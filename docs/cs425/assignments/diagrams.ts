// The P2 diagrams. `npm run diagrams:export` draws each one with the site's
// diagram renderer and writes it to the .svg file it is keyed by, which the
// assignment links and the Canvas push uploads. Coordinates are node centers.

import type { Diagram, Node, Edge } from '../../.vitepress/theme/components/workflow/render'

const setup: Diagram = {
  title: 'The P2 setup: sender, relay and receiver',
  caption: '',
  desc:
    'Three programs run on your machine. myapp send reads in.bin, cuts it into 1024 byte ' +
    'packets, and keeps a window of them in flight with one timer. It sends DATA and FIN to ' +
    'the relay on UDP port 4250, which forwards them to myapp recv and carries the ACKs back. ' +
    'The relay can hold each datagram 50 ms (--delay), drop it (-l loss), flip one bit (-c) or ' +
    'deliver it twice (-d), each way. myapp recv writes out.bin one packet at a time, strictly ' +
    'in order, and ACKs every packet it gets. To start: 1, the receiver says HELLO jdoe-1 recv. ' +
    '2, the sender says HELLO jdoe-1 send 0.1 0.05 0, with its damage rates. 3, the relay ' +
    'answers OK to each, then forwards the rest. Hellos and their OK replies are never ' +
    'damaged. Use one socket for the whole run: the relay knows you by address and port.',
  wide: {
    width: 880,
    height: 400,
    regions: [{ label: 'Your machine', place: 'mac', x: 8, y: 8, w: 864, h: 384 }],
    nodes: [
      {
        id: 'send',
        x: 130,
        y: 150,
        w: 210,
        h: 124,
        lines: ['myapp send', 'reads in.bin, cuts it', 'into 1024 byte packets,', 'keeps a window of them', 'in flight, one timer'],
      },
      {
        id: 'relay',
        x: 440,
        y: 150,
        w: 214,
        h: 160,
        lines: ['relay', 'UDP port 4250', 'each datagram, each way:', 'held 50 ms (--delay)', 'dropped (-l loss)', 'one bit flipped (-c)', 'delivered twice (-d)'],
      },
      {
        id: 'recv',
        x: 750,
        y: 150,
        w: 210,
        h: 124,
        lines: ['myapp recv', 'writes out.bin, one', 'packet at a time, strictly', 'in order, and ACKs', 'every packet it gets'],
      },
      { id: 'sDataOut', x: 235, y: 124, kind: 'point' },
      { id: 'rDataIn', x: 333, y: 124, kind: 'point' },
      { id: 'rDataOut', x: 547, y: 124, kind: 'point' },
      { id: 'vDataIn', x: 645, y: 124, kind: 'point' },
      { id: 'vAckOut', x: 645, y: 176, kind: 'point' },
      { id: 'rAckIn', x: 547, y: 176, kind: 'point' },
      { id: 'rAckOut', x: 333, y: 176, kind: 'point' },
      { id: 'sAckIn', x: 235, y: 176, kind: 'point' },
      { id: 'b1', x: 42, y: 282, kind: 'badge', lines: ['1'] },
      { id: 't1', x: 64, y: 278, kind: 'text', align: 'start', lines: ['receiver says'] },
      { id: 'm1', x: 64, y: 300, kind: 'text', align: 'start', mono: true, lines: ['HELLO jdoe-1 recv'] },
      { id: 'b2', x: 316, y: 282, kind: 'badge', lines: ['2'] },
      { id: 't2', x: 338, y: 278, kind: 'text', align: 'start', lines: ['sender says, with its damage rates'] },
      { id: 'm2', x: 338, y: 300, kind: 'text', align: 'start', mono: true, lines: ['HELLO jdoe-1 send 0.1 0.05 0'] },
      { id: 'b3', x: 640, y: 282, kind: 'badge', lines: ['3'] },
      { id: 't3', x: 662, y: 278, kind: 'text', align: 'start', lines: ['relay answers OK to each,', 'then forwards the rest'] },
      {
        id: 'footer',
        x: 440,
        y: 346,
        kind: 'note',
        lines: ['Hellos and their OK replies are never damaged.', 'Use one socket for the whole run: the relay knows you by address and port.'],
      },
    ],
    edges: [
      { from: 'sDataOut', to: 'rDataIn', label: 'DATA, FIN', labelAt: [284, 100] },
      { from: 'rDataOut', to: 'vDataIn', label: 'DATA, FIN', labelAt: [596, 100] },
      { from: 'vAckOut', to: 'rAckIn', label: 'ACK', labelAt: [596, 200] },
      { from: 'rAckOut', to: 'sAckIn', label: 'ACK', labelAt: [284, 200] },
    ],
  },
}

// The packet numbers 0 to 11 as cells, colored by what the sender knows of each.
const CELL = 64
const cellX = (i: number) => 60 + i * CELL
const STATES: { tone: 'green' | 'yellow' | 'blue' | 'gray'; upTo: number }[] = [
  { tone: 'green', upTo: 1 },
  { tone: 'yellow', upTo: 4 },
  { tone: 'blue', upTo: 7 },
  { tone: 'gray', upTo: 11 },
]
const cells: Node[] = Array.from({ length: 12 }, (_, i) => ({
  id: `c${i}`,
  x: cellX(i),
  y: 130,
  w: 56,
  h: 50,
  lines: [String(i)],
  tone: STATES.find((s) => i <= s.upTo)?.tone,
}))

const sendWindow: Diagram = {
  title: "The sender's window over the packet numbers",
  caption: '',
  desc:
    "The sender's view of packet numbers 0 to 11, with base = 2, next = 5 and N = 6. Packets 0 " +
    'and 1 are acknowledged: done and forgotten. Packets 2 to 4 are sent but not yet ' +
    'acknowledged, and kept for resending. Packets 5 to 7 may be sent now. Packets 8 and up ' +
    'are not yet sendable, because they are outside the window. The window covers packets 2 to ' +
    '7. base points at packet 2 and next points at packet 5.',
  wide: {
    width: 840,
    height: 316,
    nodes: [
      { id: 'title', x: 420, y: 34, kind: 'text', bold: true, lines: ["The sender's view of the packet numbers, with base = 2, next = 5, N = 6"] },
      ...cells,
      { id: 'more', x: cellX(11) + 46, y: 136, kind: 'text', lines: ['…'] },
      { id: 'winL', x: cellX(2) - 28, y: 98, kind: 'point' },
      { id: 'winR', x: cellX(7) + 28, y: 98, kind: 'point' },
      { id: 'baseFrom', x: cellX(2), y: 196, kind: 'point' },
      { id: 'baseTo', x: cellX(2), y: 158, kind: 'point' },
      { id: 'base', x: cellX(2), y: 216, kind: 'text', mono: true, bold: true, lines: ['base'] },
      { id: 'nextFrom', x: cellX(5), y: 196, kind: 'point' },
      { id: 'nextTo', x: cellX(5), y: 158, kind: 'point' },
      { id: 'next', x: cellX(5), y: 216, kind: 'text', mono: true, bold: true, lines: ['next'] },
      { id: 'k1', x: 40, y: 254, kind: 'key', tone: 'green', lines: ['acknowledged: done, forgotten'] },
      { id: 'k2', x: 400, y: 254, kind: 'key', tone: 'yellow', lines: ['sent, not yet acknowledged: kept for resending'] },
      { id: 'k3', x: 40, y: 290, kind: 'key', tone: 'blue', lines: ['may be sent now'] },
      { id: 'k4', x: 400, y: 290, kind: 'key', tone: 'gray', lines: ['not yet: outside the window'] },
    ],
    edges: [
      { from: 'winL', to: 'winR', via: [[cellX(2) - 28, 74], [cellX(7) + 28, 74]], arrow: false, label: 'window, N = 6', labelAt: [(cellX(2) + cellX(7)) / 2, 74] },
      { from: 'baseFrom', to: 'baseTo' },
      { from: 'nextFrom', to: 'nextTo' },
    ],
  },
}

// Go-Back-N. Rows are 22 units apart, and a message takes 2.5 rows to cross.
const S = 300
const R = 600
const row = (r: number) => 100 + r * 22
const timeline: { nodes: Node[]; edges: Edge[] } = { nodes: [], edges: [] }
let n = 0

function message(dir: 'send' | 'ack', at: number, tone: 'blue' | 'green' | 'gray' | 'orange', dashed = false): void {
  const a = { id: `m${n}a`, x: dir === 'send' ? S : R, y: row(at), kind: 'point' as const }
  const b = { id: `m${n}b`, x: dir === 'send' ? R - 2 : S + 2, y: row(at + 2.5), kind: 'point' as const }
  timeline.nodes.push(a, b)
  timeline.edges.push({ from: a.id, to: b.id, tone, dashed })
  n++
}

function say(side: 'send' | 'recv', at: number, line: string, tone?: 'orange' | 'purple', bold = false): void {
  timeline.nodes.push({ id: `t${n++}`, x: side === 'send' ? S - 20 : R + 14, y: row(at) + 5, kind: 'text', align: side === 'send' ? 'end' : 'start', tone, bold, lines: [line] })
}

function timer(from: number, to: number): void {
  timeline.nodes.push({ id: `b${n}a`, x: S - 9, y: row(from) + 3, kind: 'point' }, { id: `b${n}b`, x: S - 9, y: row(to) - 3, kind: 'point' })
  timeline.edges.push({ from: `b${n}a`, to: `b${n}b`, tone: 'purple', bar: true })
  n++
}

message('send', 0, 'blue')
say('send', 0, 'send DATA 0')
message('send', 1, 'blue')
say('send', 1, 'send DATA 1')
say('send', 2, 'send DATA 2 (lost on the way)', undefined, true)
timeline.nodes.push({ id: 'lostFrom', x: S, y: row(2), kind: 'point' }, { id: 'lost', x: 475, y: row(2) + (175 / 300) * (row(2.5) - row(0)), kind: 'lost' })
timeline.edges.push({ from: 'lostFrom', to: 'lost', tone: 'blue', arrow: false })
message('send', 3, 'blue')
say('send', 3, 'send DATA 3 (window of 4 full)')
say('recv', 2.5, 'DATA 0 is expected: write, ACK 1')
message('ack', 2.5, 'green')
say('recv', 3.5, 'DATA 1 is expected: write, ACK 2')
message('ack', 3.5, 'green')
say('send', 5, 'ACK 1: base 1, send DATA 4')
message('send', 5, 'blue')
say('send', 6, 'ACK 2: base 2, send DATA 5')
message('send', 6, 'blue')
say('recv', 5.5, 'DATA 3, expected 2: discard, ACK 2')
message('ack', 5.5, 'gray', true)
say('send', 8, 'ACK 2 again: duplicate, ignore')
say('recv', 7.5, 'DATA 4, expected 2: discard, ACK 2')
message('ack', 7.5, 'gray', true)
say('recv', 8.5, 'DATA 5, expected 2: discard, ACK 2')
message('ack', 8.5, 'gray', true)
say('send', 10, 'ACK 2 again: duplicate, ignore')
say('send', 11, 'ACK 2 again: duplicate, ignore')
say('send', 12.5, 'timer for DATA 2 runs out', 'purple')
say('send', 13.5, 'TIMEOUT: go back, resend 2 to 5', 'orange', true)
for (let i = 0; i < 4; i++) {
  message('send', 13.5 + i, 'orange')
  say('recv', 16 + i, `DATA ${2 + i} is expected: write, ACK ${3 + i}`)
  message('ack', 16 + i, 'green')
}
say('send', 18.5, 'ACK 3: base 3')
say('send', 19.5, 'ACK 4: base 4')
say('send', 20.5, 'ACK 5: base 5')
say('send', 21.5, 'ACK 6: all DATA acknowledged')
// The timer starts with DATA 0, restarts on each ACK that moves base and on the
// timeout, and stops when the last ACK arrives.
timer(0, 5)
timer(5, 6)
timer(6, 13.5)
timer(13.5, 18.5)
timer(18.5, 19.5)
timer(19.5, 20.5)
timer(20.5, 21.5)

const legend: Node[] = [
  { id: 'kData', x: 40, y: 650, kind: 'key', swatch: 'line', tone: 'blue', lines: ['DATA'] },
  { id: 'kAck', x: 148, y: 650, kind: 'key', swatch: 'line', tone: 'green', lines: ['ACK'] },
  { id: 'kDup', x: 248, y: 650, kind: 'key', swatch: 'dashed', tone: 'gray', lines: ['duplicate ACK'] },
  { id: 'kRe', x: 424, y: 650, kind: 'key', swatch: 'line', tone: 'orange', lines: ['retransmitted DATA, and the TIMEOUT that sends it'] },
  { id: 'kTimer', x: 40, y: 684, kind: 'key', swatch: 'bar', tone: 'purple', lines: ['timer, and when it runs out (each gap is a restart)'] },
]

const gbn: Diagram = {
  title: 'Go-Back-N timeline with DATA 2 lost',
  caption: '',
  desc:
    'Go-Back-N with a window of 4 and six DATA packets, where DATA 2 is lost. Time runs down ' +
    'the page. The sender sends DATA 0 to 3; DATA 2 is lost on the way. The receiver writes ' +
    'DATA 0 and 1 and sends ACK 1 and ACK 2. ACK 1 moves base to 1 and the sender sends DATA ' +
    '4; ACK 2 moves base to 2 and it sends DATA 5. DATA 3, 4 and 5 arrive while the receiver ' +
    'expects 2, so it discards each and repeats ACK 2, and the sender ignores the duplicates. ' +
    'The timer for DATA 2 runs out, so the sender goes back and resends 2 to 5. The receiver ' +
    'writes each in order and sends ACK 3 to 6, which move base until all DATA is ' +
    'acknowledged. The timer restarts on each ACK that moves base and on the timeout.',
  wide: {
    width: 920,
    height: 712,
    nodes: [
      { id: 'title', x: 460, y: 30, kind: 'text', bold: true, lines: ['Go-Back-N, window 4, six DATA packets, DATA 2 lost (time runs down the page)'] },
      { id: 'sender', x: S, y: 64, w: 120, h: 36, lines: ['sender'] },
      { id: 'receiver', x: R, y: 64, w: 120, h: 36, lines: ['receiver'] },
      { id: 'sEnd', x: S, y: row(23), kind: 'point' },
      { id: 'rEnd', x: R, y: row(23), kind: 'point' },
      ...timeline.nodes,
      ...legend,
    ],
    edges: [{ from: 'sender', to: 'sEnd', arrow: false }, { from: 'receiver', to: 'rEnd', arrow: false }, ...timeline.edges],
  },
}

export const files: Record<string, Diagram> = {
  'docs/public/cs425/assignments/p2-setup.svg': setup,
  'docs/public/cs425/assignments/p2-window.svg': sendWindow,
  'docs/public/cs425/assignments/p2-gbn-timeline.svg': gbn,
}
