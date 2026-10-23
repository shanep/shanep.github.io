// The diagrams on /ai/workflow/, drawn by WorkflowDiagram.vue. Each one has a
// wide layout (about 700 units across, so the text stays near full size on a
// desktop) and a narrow one for phones. Coordinates are node centers.

export type Point = [number, number]

export interface Node {
  id: string
  x: number
  y: number
  w?: number
  h?: number
  // The first line of a box is its name, the rest are details.
  lines?: string[]
  // step, check (a test or review), human (needs my OK), user, planned (being
  // built, drawn dotted), note (text only), dot (a commit on main), branch (a commit on a worktree branch),
  // landed (a commit that landed from a branch), point (an invisible end).
  kind?: 'step' | 'check' | 'human' | 'user' | 'planned' | 'note' | 'dot' | 'branch' | 'landed' | 'point'
  labelAt?: 'above' | 'below' | 'left' | 'right'
  align?: 'start' | 'middle' | 'end'
}

export interface Edge {
  from: string
  to: string
  label?: string
  labelAt?: Point
  via?: Point[]
  dashed?: boolean
  heavy?: boolean
  arrow?: boolean
}

export interface Layout {
  width: number
  height: number
  nodes: Node[]
  edges: Edge[]
}

export interface Diagram {
  title: string
  caption: string
  desc: string
  wide: Layout
  narrow: Layout
}

const loop: Diagram = {
  title: 'The loop',
  caption: 'The loop every change goes around.',
  desc:
    'A change starts from a prompt, an issue, a CI failure or a schedule. Claude edits the code and the tests. The pre-commit hook runs the tests, and a second agent ' +
    'reviews the diff. A failure or a review finding goes back to the edit. Once both pass, the ' +
    'change lands: rebase, run the pre-push checks and push to main. CI runs on Ubuntu and macOS, ' +
    'autoupdate gets the new version to every install. What users hit next comes back as the start ' +
    'of the next change. Tagging a release is off to the side and only happens with my OK.',
  wide: {
    width: 700,
    height: 390,
    nodes: [
      { id: 'edit', x: 110, y: 90, w: 170, h: 82, lines: ['Edit', 'Claude writes code', 'and the tests'] },
      { id: 'test', x: 350, y: 90, w: 170, h: 82, kind: 'check', lines: ['Test', 'the pre-commit hook', 'runs the tests'] },
      { id: 'review', x: 590, y: 90, w: 170, h: 82, kind: 'check', lines: ['Review', 'a second agent', 'reads the diff'] },
      { id: 'land', x: 590, y: 215, w: 170, h: 82, lines: ['Land', 'rebase, pre-push', 'checks, push main'] },
      { id: 'release', x: 350, y: 215, w: 150, h: 64, kind: 'human', lines: ['Release', 'only with my OK'] },
      { id: 'ci', x: 590, y: 340, w: 170, h: 70, kind: 'check', lines: ['CI', 'Ubuntu and macOS'] },
      { id: 'update', x: 350, y: 340, w: 170, h: 82, lines: ['Autoupdate', 'every install pulls', 'the new version'] },
      { id: 'users', x: 110, y: 340, w: 170, h: 82, kind: 'user', lines: ['Users', 'students, faculty', 'and me'] },
      { id: 'start', x: 110, y: 215, w: 170, h: 64, lines: ['Start', 'prompt, issue, CI'] },
    ],
    edges: [
      { from: 'edit', to: 'test' },
      { from: 'test', to: 'review', label: 'pass' },
      { from: 'review', to: 'land', label: 'no findings' },
      { from: 'review', to: 'edit', dashed: true, via: [[590, 18], [110, 18]], label: 'a failure or a finding goes back' },
      { from: 'land', to: 'release', dashed: true },
      { from: 'land', to: 'ci', label: 'on push' },
      { from: 'ci', to: 'update', label: 'pass' },
      { from: 'update', to: 'users' },
      { from: 'users', to: 'start' },
      { from: 'start', to: 'edit' },
    ],
  },
  narrow: {
    width: 340,
    height: 890,
    nodes: [
      { id: 'start', x: 135, y: 60, w: 170, h: 76, lines: ['Start', 'prompt, issue, CI'] },
      { id: 'edit', x: 135, y: 170, w: 170, h: 76, lines: ['Edit', 'Claude writes code', 'and the tests'] },
      { id: 'test', x: 135, y: 280, w: 170, h: 76, kind: 'check', lines: ['Test', 'pre-commit hook'] },
      { id: 'review', x: 135, y: 390, w: 170, h: 76, kind: 'check', lines: ['Review', 'a second agent'] },
      { id: 'land', x: 135, y: 500, w: 170, h: 76, lines: ['Land', 'rebase, checks,', 'push main'] },
      { id: 'release', x: 290, y: 500, w: 90, h: 64, kind: 'human', lines: ['Release', 'my OK'] },
      { id: 'ci', x: 135, y: 610, w: 170, h: 76, kind: 'check', lines: ['CI', 'Ubuntu and macOS'] },
      { id: 'update', x: 135, y: 720, w: 170, h: 76, lines: ['Autoupdate', 'every install'] },
      { id: 'users', x: 135, y: 830, w: 170, h: 76, kind: 'user', lines: ['Users'] },
    ],
    edges: [
      { from: 'edit', to: 'test' },
      { from: 'test', to: 'review', label: 'pass' },
      { from: 'review', to: 'land', label: 'pass' },
      { from: 'land', to: 'release', dashed: true },
      { from: 'land', to: 'ci' },
      { from: 'ci', to: 'update', label: 'pass' },
      { from: 'update', to: 'users' },
      { from: 'start', to: 'edit' },
      { from: 'users', to: 'start', via: [[22, 830], [22, 60]] },
    ],
  },
}

const triggers: Diagram = {
  title: 'Who starts the work',
  caption: 'Four things can start an agent. Dotted ones are being built now.',
  desc:
    'Four triggers start a background Claude session: a prompt from me, CI failing on main, an ' +
    'issue labeled for an agent, and a schedule. Only the prompt works today. The other three are ' +
    'being built. Each session runs in its own git worktree and branch, then goes around the same ' +
    'loop as everything else: test, review and land.',
  wide: {
    width: 700,
    height: 340,
    nodes: [
      { id: 'me', x: 110, y: 45, w: 180, h: 52, kind: 'user', lines: ['A prompt from me'] },
      { id: 'ci', x: 110, y: 120, w: 180, h: 52, kind: 'planned', lines: ['CI fails on main'] },
      { id: 'issue', x: 110, y: 195, w: 180, h: 52, kind: 'planned', lines: ['A labeled issue'] },
      { id: 'cron', x: 110, y: 270, w: 180, h: 52, kind: 'planned', lines: ['A schedule'] },
      { id: 'session', x: 390, y: 157, w: 180, h: 82, lines: ['Agent session', 'its own worktree', 'and branch'] },
      { id: 'loop', x: 605, y: 157, w: 150, h: 70, kind: 'check', lines: ['The loop', 'test, review, land'] },
      { id: 'legend', x: 20, y: 328, kind: 'note', align: 'start', lines: ['dotted border: being built now'] },
    ],
    edges: [
      { from: 'me', to: 'session' },
      { from: 'ci', to: 'session' },
      { from: 'issue', to: 'session' },
      { from: 'cron', to: 'session' },
      { from: 'session', to: 'loop' },
    ],
  },
  narrow: {
    width: 340,
    height: 470,
    nodes: [
      { id: 'me', x: 150, y: 30, w: 220, h: 44, kind: 'user', lines: ['A prompt from me'] },
      { id: 'ci', x: 150, y: 85, w: 220, h: 44, kind: 'planned', lines: ['CI fails on main'] },
      { id: 'issue', x: 150, y: 140, w: 220, h: 44, kind: 'planned', lines: ['A labeled issue'] },
      { id: 'cron', x: 150, y: 195, w: 220, h: 44, kind: 'planned', lines: ['A schedule'] },
      { id: 'session', x: 150, y: 305, w: 220, h: 64, lines: ['Agent session', 'its own worktree'] },
      { id: 'loop', x: 150, y: 400, w: 220, h: 64, kind: 'check', lines: ['The loop', 'test, review, land'] },
      { id: 'legend', x: 150, y: 458, kind: 'note', lines: ['dotted border: being built now'] },
    ],
    edges: [
      { from: 'me', to: 'session', via: [[300, 30], [300, 250], [150, 250]] },
      { from: 'ci', to: 'session', via: [[300, 85], [300, 250], [150, 250]] },
      { from: 'issue', to: 'session', via: [[300, 140], [300, 250], [150, 250]] },
      { from: 'cron', to: 'session', via: [[300, 195], [300, 250], [150, 250]] },
      { from: 'session', to: 'loop' },
    ],
  },
}

const trunk: Diagram = {
  title: 'Living at head with parallel sessions',
  caption: 'One trunk, with background sessions landing onto it one at a time.',
  desc:
    'A timeline of the main branch running left to right. The live session commits straight to ' +
    'main. Worktree B, a background session, branches off main and makes three commits. Worktree ' +
    'A branches off a little later, makes two commits, then rebases and lands them on main. B ' +
    'rebases and lands after A. Landing takes a lock, so only one session lands at a time.',
  wide: {
    width: 700,
    height: 260,
    nodes: [
      { id: 'm0', x: 20, y: 80, kind: 'point' },
      { id: 'm9', x: 685, y: 80, kind: 'point' },
      { id: 'c1', x: 70, y: 80, kind: 'dot' },
      { id: 'c2', x: 150, y: 80, kind: 'dot' },
      { id: 'c3', x: 250, y: 80, kind: 'dot' },
      { id: 'l1', x: 420, y: 80, kind: 'landed', lines: ['A lands'], labelAt: 'above' },
      { id: 'c4', x: 510, y: 80, kind: 'dot' },
      { id: 'l2', x: 620, y: 80, kind: 'landed', lines: ['B lands'], labelAt: 'above' },
      { id: 'a1', x: 290, y: 150, kind: 'branch' },
      { id: 'a2', x: 360, y: 150, kind: 'branch' },
      { id: 'b1', x: 200, y: 215, kind: 'branch' },
      { id: 'b2', x: 340, y: 215, kind: 'branch' },
      { id: 'b3', x: 480, y: 215, kind: 'branch' },
      { id: 'mainNote', x: 20, y: 40, kind: 'note', align: 'start', lines: ['main: the live session commits here'] },
      { id: 'aNote', x: 275, y: 180, kind: 'note', align: 'start', lines: ['worktree A'] },
      { id: 'bNote', x: 185, y: 245, kind: 'note', align: 'start', lines: ['worktree B, another background session'] },
    ],
    edges: [
      { from: 'm0', to: 'm9', heavy: true },
      { from: 'c3', to: 'a1', arrow: false },
      { from: 'a1', to: 'a2', arrow: false },
      { from: 'a2', to: 'l1', dashed: true, label: 'rebase, land' },
      { from: 'c2', to: 'b1', arrow: false },
      { from: 'b1', to: 'b2', arrow: false },
      { from: 'b2', to: 'b3', arrow: false },
      { from: 'b3', to: 'l2', dashed: true, label: 'rebase, land' },
    ],
  },
  narrow: {
    width: 340,
    height: 600,
    nodes: [
      { id: 'm0', x: 90, y: 45, kind: 'point' },
      { id: 'm9', x: 90, y: 590, kind: 'point' },
      { id: 'c1', x: 90, y: 80, kind: 'dot' },
      { id: 'c2', x: 90, y: 140, kind: 'dot' },
      { id: 'c3', x: 90, y: 200, kind: 'dot' },
      { id: 'l1', x: 90, y: 330, kind: 'landed', lines: ['A lands'], labelAt: 'left' },
      { id: 'c4', x: 90, y: 400, kind: 'dot' },
      { id: 'l2', x: 90, y: 530, kind: 'landed', lines: ['B lands'], labelAt: 'left' },
      { id: 'a1', x: 165, y: 250, kind: 'branch', lines: ['worktree A'], labelAt: 'right' },
      { id: 'a2', x: 165, y: 300, kind: 'branch' },
      { id: 'b1', x: 280, y: 200, kind: 'branch', lines: ['worktree B'], labelAt: 'above' },
      { id: 'b2', x: 280, y: 310, kind: 'branch' },
      { id: 'b3', x: 280, y: 420, kind: 'branch' },
      { id: 'mainNote', x: 90, y: 25, kind: 'note', lines: ['main'] },
    ],
    edges: [
      { from: 'm0', to: 'm9', heavy: true },
      { from: 'c3', to: 'a1', arrow: false },
      { from: 'a1', to: 'a2', arrow: false },
      { from: 'a2', to: 'l1', dashed: true, label: 'land' },
      { from: 'c2', to: 'b1', arrow: false },
      { from: 'b1', to: 'b2', arrow: false },
      { from: 'b2', to: 'b3', arrow: false },
      { from: 'b3', to: 'l2', dashed: true, label: 'land' },
    ],
  },
}

const fanout: Diagram = {
  title: 'Autoupdate fan-out',
  caption: 'A push to main reaches every machine with autoupdate on.',
  desc:
    'A git push to main in the claude-plugins repo runs the checks: check.sh, test-install.sh and ' +
    'CI on Ubuntu and macOS. A failure stops it there. Once they pass, the marketplace serves the ' +
    'new version, and every machine with autoupdate on picks it up on its next start: my ' +
    'machines, student laptops and colleagues.',
  wide: {
    width: 700,
    height: 330,
    nodes: [
      { id: 'push', x: 55, y: 165, w: 100, h: 64, lines: ['git push', 'to main'] },
      { id: 'checks', x: 200, y: 165, w: 140, h: 100, kind: 'check', lines: ['Checks', 'check.sh', 'test-install.sh', 'CI on 2 OSes'] },
      { id: 'market', x: 400, y: 165, w: 140, h: 82, lines: ['Marketplace', 'shanep/', 'claude-plugins'] },
      { id: 'mine', x: 610, y: 60, w: 150, h: 56, kind: 'user', lines: ['My machines'] },
      { id: 'students', x: 610, y: 165, w: 150, h: 56, kind: 'user', lines: ['Student laptops'] },
      { id: 'others', x: 610, y: 270, w: 150, h: 56, kind: 'user', lines: ['Colleagues'] },
      { id: 'stop', x: 200, y: 245, kind: 'note', lines: ['a failure stops it here'] },
      { id: 'start', x: 685, y: 320, kind: 'note', align: 'end', lines: ['each one updates on its next start'] },
    ],
    edges: [
      { from: 'push', to: 'checks' },
      { from: 'checks', to: 'market', label: 'pass' },
      { from: 'market', to: 'mine' },
      { from: 'market', to: 'students' },
      { from: 'market', to: 'others' },
    ],
  },
  narrow: {
    width: 340,
    height: 480,
    nodes: [
      { id: 'push', x: 170, y: 40, w: 150, h: 56, lines: ['git push', 'to main'] },
      { id: 'checks', x: 170, y: 155, w: 170, h: 100, kind: 'check', lines: ['Checks', 'check.sh', 'test-install.sh', 'CI on 2 OSes'] },
      { id: 'market', x: 170, y: 285, w: 170, h: 70, lines: ['Marketplace', 'claude-plugins'] },
      { id: 'mine', x: 60, y: 415, w: 105, h: 56, kind: 'user', lines: ['Me'] },
      { id: 'students', x: 170, y: 415, w: 105, h: 56, kind: 'user', lines: ['Students'] },
      { id: 'others', x: 280, y: 415, w: 105, h: 56, kind: 'user', lines: ['Colleagues'] },
      { id: 'start', x: 170, y: 470, kind: 'note', lines: ['on their next start'] },
    ],
    edges: [
      { from: 'push', to: 'checks' },
      { from: 'checks', to: 'market', label: 'pass' },
      { from: 'market', to: 'mine' },
      { from: 'market', to: 'students' },
      { from: 'market', to: 'others' },
    ],
  },
}

const source: Diagram = {
  title: 'One source, two outputs',
  caption: 'A course is one folder of markdown, and code builds both places students see it.',
  desc:
    'The docs/cs425 folder holds the course as markdown pages, a canvas.toml file and rubric ' +
    'tables. VitePress builds it into the course website on shanep.github.io. edutools push ' +
    'turns the same files into the Canvas course: pages, assignments, quizzes, modules, rubrics ' +
    'and due dates.',
  wide: {
    width: 700,
    height: 280,
    nodes: [
      { id: 'src', x: 110, y: 140, w: 190, h: 100, lines: ['docs/cs425/', 'markdown pages,', 'canvas.toml, rubrics'] },
      { id: 'vite', x: 370, y: 65, w: 170, h: 70, lines: ['VitePress', 'npm run docs:build'] },
      { id: 'edu', x: 370, y: 215, w: 170, h: 70, lines: ['edutools push', 'due dates, rubrics'] },
      { id: 'site', x: 600, y: 65, w: 170, h: 70, kind: 'user', lines: ['Course website', 'shanep.github.io'] },
      { id: 'canvas', x: 600, y: 215, w: 170, h: 82, kind: 'user', lines: ['Canvas course', 'pages, assignments,', 'quizzes, modules'] },
    ],
    edges: [
      { from: 'src', to: 'vite' },
      { from: 'src', to: 'edu' },
      { from: 'vite', to: 'site' },
      { from: 'edu', to: 'canvas' },
    ],
  },
  narrow: {
    width: 340,
    height: 370,
    nodes: [
      { id: 'src', x: 170, y: 50, w: 220, h: 90, lines: ['docs/cs425/', 'markdown pages,', 'canvas.toml, rubrics'] },
      { id: 'vite', x: 85, y: 190, w: 155, h: 64, lines: ['VitePress', 'docs:build'] },
      { id: 'edu', x: 255, y: 190, w: 155, h: 64, lines: ['edutools push', 'due dates'] },
      { id: 'site', x: 85, y: 320, w: 155, h: 64, kind: 'user', lines: ['Website', 'shanep.github.io'] },
      { id: 'canvas', x: 255, y: 320, w: 155, h: 64, kind: 'user', lines: ['Canvas', 'pages, quizzes'] },
    ],
    edges: [
      { from: 'src', to: 'vite' },
      { from: 'src', to: 'edu' },
      { from: 'vite', to: 'site' },
      { from: 'edu', to: 'canvas' },
    ],
  },
}

const tune: Diagram = {
  title: 'The tuning loop',
  caption: 'Settings come from what the sessions actually did.',
  desc:
    'Every Claude Code session writes a transcript to ~/.claude/projects. claude-tune reads the ' +
    'transcripts and shows where the tokens and dollars went. It suggests fixes, asks before ' +
    'applying any of them, and writes the ones I approve to settings.json: the model, the effort ' +
    'level and other knobs. Those settings shape the next sessions, and the loop repeats.',
  wide: {
    width: 700,
    height: 290,
    nodes: [
      { id: 'sessions', x: 110, y: 60, w: 170, h: 70, lines: ['Sessions', 'Claude Code at work'] },
      { id: 'transcripts', x: 590, y: 60, w: 170, h: 70, lines: ['Transcripts', '~/.claude/projects'] },
      { id: 'tune', x: 590, y: 230, w: 170, h: 82, kind: 'check', lines: ['claude-tune', 'where the tokens', 'and dollars went'] },
      { id: 'ok', x: 350, y: 230, w: 150, h: 64, kind: 'human', lines: ['My OK', 'it asks first'] },
      { id: 'settings', x: 110, y: 230, w: 170, h: 82, lines: ['settings.json', 'model, effort and', 'other knobs'] },
    ],
    edges: [
      { from: 'sessions', to: 'transcripts', label: 'each session writes one' },
      { from: 'transcripts', to: 'tune', label: '/tune reads them' },
      { from: 'tune', to: 'ok', label: 'fixes' },
      { from: 'ok', to: 'settings', label: 'applied' },
      { from: 'settings', to: 'sessions', label: 'shape the next ones' },
    ],
  },
  narrow: {
    width: 340,
    height: 590,
    nodes: [
      { id: 'sessions', x: 160, y: 50, w: 190, h: 64, lines: ['Sessions'] },
      { id: 'transcripts', x: 160, y: 165, w: 190, h: 70, lines: ['Transcripts', '~/.claude/projects'] },
      { id: 'tune', x: 160, y: 290, w: 190, h: 76, kind: 'check', lines: ['claude-tune', 'where tokens went'] },
      { id: 'ok', x: 160, y: 410, w: 190, h: 64, kind: 'human', lines: ['My OK'] },
      { id: 'settings', x: 160, y: 530, w: 190, h: 76, lines: ['settings.json', 'model and effort'] },
    ],
    edges: [
      { from: 'sessions', to: 'transcripts' },
      { from: 'transcripts', to: 'tune', label: '/tune' },
      { from: 'tune', to: 'ok', label: 'fixes' },
      { from: 'ok', to: 'settings' },
      { from: 'settings', to: 'sessions', via: [[30, 530], [30, 50]] },
    ],
  },
}

export const diagrams: Record<string, Diagram> = { loop, triggers, trunk, fanout, source, tune }
