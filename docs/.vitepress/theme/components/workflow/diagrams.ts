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
  // step, planned (built but not run for real yet, drawn dotted, and the
  // diagram has a legend that says so), note (text only), dot (a commit on
  // main), branch (a commit on a worktree branch), landed (a commit that landed
  // from a branch), point (an invisible end).
  kind?: 'step' | 'planned' | 'note' | 'dot' | 'branch' | 'landed' | 'point'
  labelAt?: 'above' | 'below' | 'left' | 'right'
  align?: 'start' | 'middle' | 'end'
}

export interface Edge {
  from: string
  to: string
  label?: string
  labelAt?: Point
  via?: Point[]
  heavy?: boolean
  arrow?: boolean
}

// A labeled area for the machine or service a step runs on. Boxes sit inside
// the region they run in, which is how the diagrams show where things happen.
export interface Region {
  label: string
  x: number
  y: number
  w: number
  h: number
}

export interface Layout {
  width: number
  height: number
  regions?: Region[]
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
  caption: 'The loop every change goes around, laid out by where each step runs.',
  desc:
    'Three areas show where each step runs. On my Mac, or on a GitHub Actions runner when a ' +
    'trigger started the agent: Claude edits the code and the tests, the pre-commit hook runs the ' +
    'tests, a second agent reviews the diff, and a failure or a finding goes back to the edit. ' +
    'Once both pass, the change lands: rebase, run the pre-push checks and push. On GitHub: CI ' +
    'runs on main on Ubuntu and macOS, a release happens only with my OK, and triggers (an issue, ' +
    'failing CI, a schedule) start an agent on a runner. On users\' machines: autoupdate pulls the ' +
    'new version on the next start, and a bug a user reports goes back to GitHub as an issue.',
  wide: {
    width: 700,
    height: 480,
    regions: [
      { label: 'Where the agent works: my Mac, or a GitHub Actions runner', x: 8, y: 8, w: 684, h: 160 },
      { label: 'GitHub', x: 8, y: 188, w: 684, h: 140 },
      { label: "Users' machines", x: 8, y: 348, w: 684, h: 124 },
    ],
    nodes: [
      { id: 'edit', x: 90, y: 112, w: 148, h: 76, lines: ['Edit', 'from my prompt', 'or a trigger'] },
      { id: 'test', x: 260, y: 112, w: 148, h: 76, lines: ['Test', 'pre-commit hook', 'runs the tests'] },
      { id: 'review', x: 430, y: 112, w: 148, h: 76, lines: ['Review', 'a second agent', 'reads the diff'] },
      { id: 'land', x: 600, y: 112, w: 148, h: 76, lines: ['Land', 'rebase, pre-push', 'checks, push'] },
      { id: 'triggers', x: 90, y: 268, w: 148, h: 76, lines: ['Triggers', 'an issue, failing', 'CI, a schedule'] },
      { id: 'release', x: 430, y: 268, w: 148, h: 64, lines: ['Release', 'only with my OK'] },
      { id: 'ci', x: 600, y: 268, w: 148, h: 64, lines: ['CI on main', 'Ubuntu and macOS'] },
      { id: 'users', x: 90, y: 420, w: 148, h: 76, lines: ['Users', 'students and', 'colleagues'] },
      { id: 'update', x: 600, y: 420, w: 148, h: 64, lines: ['Autoupdate', 'on the next start'] },
    ],
    edges: [
      { from: 'edit', to: 'test' },
      { from: 'test', to: 'review' },
      { from: 'review', to: 'land' },
      { from: 'review', to: 'edit', via: [[430, 50], [90, 50]], label: 'a failure or a finding goes back' },
      { from: 'land', to: 'ci', label: 'push', labelAt: [600, 178] },
      { from: 'ci', to: 'release' },
      { from: 'ci', to: 'update', label: 'pass', labelAt: [600, 338] },
      { from: 'update', to: 'users', label: 'new version' },
      { from: 'users', to: 'triggers', label: 'report a bug', labelAt: [90, 338] },
      { from: 'triggers', to: 'edit', label: 'start an agent', labelAt: [90, 178] },
    ],
  },
  narrow: {
    width: 340,
    height: 870,
    regions: [
      { label: 'My Mac, or an Actions runner', x: 6, y: 6, w: 328, h: 362 },
      { label: 'GitHub', x: 6, y: 388, w: 328, h: 266 },
      { label: "Users' machines", x: 6, y: 674, w: 328, h: 186 },
    ],
    nodes: [
      { id: 'edit', x: 170, y: 80, w: 190, h: 56, lines: ['Edit', 'Claude writes code'] },
      { id: 'test', x: 170, y: 160, w: 190, h: 56, lines: ['Test', 'pre-commit hook'] },
      { id: 'review', x: 170, y: 240, w: 190, h: 56, lines: ['Review', 'a second agent'] },
      { id: 'land', x: 170, y: 320, w: 190, h: 56, lines: ['Land', 'rebase, check, push'] },
      { id: 'ci', x: 170, y: 460, w: 190, h: 56, lines: ['CI on main', 'Ubuntu and macOS'] },
      { id: 'release', x: 170, y: 535, w: 190, h: 56, lines: ['Release', 'only with my OK'] },
      { id: 'triggers', x: 170, y: 610, w: 190, h: 56, lines: ['Triggers', 'issue, CI, schedule'] },
      { id: 'users', x: 170, y: 740, w: 190, h: 56, lines: ['Users', 'students, colleagues'] },
      { id: 'update', x: 170, y: 820, w: 190, h: 56, lines: ['Autoupdate', 'on the next start'] },
    ],
    edges: [
      { from: 'edit', to: 'test' },
      { from: 'test', to: 'review' },
      { from: 'review', to: 'land' },
      { from: 'review', to: 'edit', via: [[300, 240], [300, 80]], label: 'fail', labelAt: [300, 160] },
      { from: 'land', to: 'ci', label: 'push', labelAt: [170, 378] },
      { from: 'ci', to: 'release' },
      { from: 'ci', to: 'update', via: [[316, 460], [316, 820]] },
      { from: 'update', to: 'users' },
      { from: 'users', to: 'triggers', label: 'report a bug', labelAt: [170, 664] },
      { from: 'triggers', to: 'edit', via: [[12, 610], [12, 80]] },
    ],
  },
}

const triggers: Diagram = {
  title: 'Who starts the work, and where it runs',
  caption: 'My prompts run on my Mac. Everything else starts an agent on a GitHub Actions runner.',
  desc:
    'Two areas. On my Mac, a prompt from me starts an agent session, either the live one or one ' +
    'in its own worktree. On GitHub, three triggers start an agent session on a fresh GitHub ' +
    'Actions runner: CI failing on main, an issue labeled for an agent, and a schedule. The ' +
    'labeled issue is built but has not had a real run yet, so it is drawn dotted. Both kinds of ' +
    'session test, review and land their change on main.',
  wide: {
    width: 700,
    height: 470,
    regions: [
      { label: 'My Mac', x: 8, y: 8, w: 684, h: 112 },
      { label: 'GitHub', x: 8, y: 140, w: 684, h: 290 },
    ],
    nodes: [
      { id: 'me', x: 125, y: 72, w: 180, h: 50, lines: ['A prompt from me'] },
      { id: 'local', x: 390, y: 72, w: 200, h: 56, lines: ['Agent session', 'live, or in a worktree'] },
      { id: 'ci', x: 125, y: 215, w: 180, h: 48, lines: ['CI fails on main'] },
      { id: 'issue', x: 125, y: 285, w: 180, h: 48, kind: 'planned', lines: ['A labeled issue'] },
      { id: 'cron', x: 125, y: 355, w: 180, h: 48, lines: ['A schedule'] },
      { id: 'runner', x: 390, y: 285, w: 200, h: 56, lines: ['Agent session', 'on a fresh runner'] },
      { id: 'main', x: 600, y: 285, w: 150, h: 56, lines: ['main', 'where work lands'] },
      { id: 'legend', x: 20, y: 455, kind: 'note', align: 'start', lines: ['dotted border: built, not run for real yet'] },
    ],
    edges: [
      { from: 'me', to: 'local' },
      { from: 'ci', to: 'runner' },
      { from: 'issue', to: 'runner' },
      { from: 'cron', to: 'runner' },
      { from: 'runner', to: 'main' },
      { from: 'local', to: 'main', via: [[600, 72]], label: 'push', labelAt: [600, 130] },
    ],
  },
  narrow: {
    width: 340,
    height: 610,
    regions: [
      { label: 'My Mac', x: 6, y: 6, w: 328, h: 150 },
      { label: 'GitHub', x: 6, y: 176, w: 328, h: 394 },
    ],
    nodes: [
      { id: 'me', x: 170, y: 62, w: 220, h: 40, lines: ['A prompt from me'] },
      { id: 'local', x: 170, y: 118, w: 220, h: 50, lines: ['Agent session', 'live, or in a worktree'] },
      { id: 'ci', x: 170, y: 236, w: 220, h: 40, lines: ['CI fails on main'] },
      { id: 'issue', x: 170, y: 288, w: 220, h: 40, kind: 'planned', lines: ['A labeled issue'] },
      { id: 'cron', x: 170, y: 340, w: 220, h: 40, lines: ['A schedule'] },
      { id: 'runner', x: 170, y: 425, w: 220, h: 50, lines: ['Agent session', 'on a fresh runner'] },
      { id: 'main', x: 170, y: 515, w: 220, h: 50, lines: ['main', 'where work lands'] },
      { id: 'legend', x: 170, y: 595, kind: 'note', lines: ['dotted border: built, not run for real yet'] },
    ],
    edges: [
      { from: 'me', to: 'local' },
      { from: 'ci', to: 'runner', via: [[305, 236], [305, 385], [170, 385]] },
      { from: 'issue', to: 'runner', via: [[305, 288], [305, 385], [170, 385]] },
      { from: 'cron', to: 'runner', via: [[305, 340], [305, 385], [170, 385]] },
      { from: 'runner', to: 'main' },
      { from: 'local', to: 'main', via: [[12, 118], [12, 515]] },
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
      { from: 'a2', to: 'l1', label: 'rebase, land' },
      { from: 'c2', to: 'b1', arrow: false },
      { from: 'b1', to: 'b2', arrow: false },
      { from: 'b2', to: 'b3', arrow: false },
      { from: 'b3', to: 'l2', label: 'rebase, land' },
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
      { from: 'a2', to: 'l1', label: 'land' },
      { from: 'c2', to: 'b1', arrow: false },
      { from: 'b1', to: 'b2', arrow: false },
      { from: 'b2', to: 'b3', arrow: false },
      { from: 'b3', to: 'l2', label: 'land' },
    ],
  },
}

const fanout: Diagram = {
  title: 'Autoupdate fan-out',
  caption: 'A push to main reaches every machine with autoupdate on.',
  desc:
    'Three areas. On my Mac or a runner, git push runs the pre-push hook, which runs check.sh and ' +
    'test-install.sh. On GitHub, CI runs the same checks on Ubuntu and macOS, and a failure stops ' +
    'it there. Once they pass, the claude-plugins marketplace serves the new version. On users\' ' +
    'machines (mine, student laptops and colleagues), each one with autoupdate on picks it up on ' +
    'its next start.',
  wide: {
    width: 700,
    height: 346,
    regions: [
      { label: 'Mac or runner', x: 8, y: 8, w: 170, h: 330 },
      { label: 'GitHub', x: 196, y: 8, w: 310, h: 330 },
      { label: "Users' machines", x: 524, y: 8, w: 168, h: 330 },
    ],
    nodes: [
      { id: 'push', x: 93, y: 173, w: 150, h: 100, lines: ['git push', 'pre-push runs', 'check.sh and', 'test-install.sh'] },
      { id: 'ci', x: 275, y: 173, w: 120, h: 82, lines: ['CI', 'Ubuntu and', 'macOS'] },
      { id: 'market', x: 430, y: 173, w: 130, h: 82, lines: ['Marketplace', 'claude-plugins', 'repo'] },
      { id: 'mine', x: 608, y: 90, w: 140, h: 50, lines: ['My machines'] },
      { id: 'students', x: 608, y: 173, w: 140, h: 50, lines: ['Students'] },
      { id: 'others', x: 608, y: 256, w: 140, h: 50, lines: ['Colleagues'] },
      { id: 'stop', x: 275, y: 245, kind: 'note', lines: ['a failure', 'stops it here'] },
      { id: 'start', x: 608, y: 305, kind: 'note', lines: ['each updates on', 'its next start'] },
    ],
    edges: [
      { from: 'push', to: 'ci' },
      { from: 'ci', to: 'market' },
      { from: 'market', to: 'mine' },
      { from: 'market', to: 'students' },
      { from: 'market', to: 'others' },
    ],
  },
  narrow: {
    width: 340,
    height: 534,
    regions: [
      { label: 'Mac or runner', x: 6, y: 6, w: 328, h: 130 },
      { label: 'GitHub', x: 6, y: 156, w: 328, h: 200 },
      { label: "Users' machines", x: 6, y: 376, w: 328, h: 150 },
    ],
    nodes: [
      { id: 'push', x: 170, y: 80, w: 200, h: 72, lines: ['git push', 'pre-push runs', 'check.sh, test-install.sh'] },
      { id: 'ci', x: 170, y: 222, w: 200, h: 56, lines: ['CI', 'Ubuntu and macOS'] },
      { id: 'market', x: 170, y: 310, w: 200, h: 56, lines: ['Marketplace', 'claude-plugins'] },
      { id: 'mine', x: 60, y: 457, w: 96, h: 50, lines: ['Me'] },
      { id: 'students', x: 170, y: 457, w: 100, h: 50, lines: ['Students'] },
      { id: 'others', x: 278, y: 457, w: 104, h: 50, lines: ['Colleagues'] },
      { id: 'start', x: 170, y: 507, kind: 'note', lines: ['each updates on its next start'] },
    ],
    edges: [
      { from: 'push', to: 'ci' },
      { from: 'ci', to: 'market', label: 'pass' },
      // The bus runs under the region label, not through it.
      { from: 'market', to: 'mine', via: [[170, 412], [60, 412]] },
      { from: 'market', to: 'students' },
      { from: 'market', to: 'others', via: [[170, 412], [278, 412]] },
    ],
  },
}

const source: Diagram = {
  title: 'One source, two outputs',
  caption: 'A course is one folder of markdown, and code builds both places students see it.',
  desc:
    'Three areas. On my Mac, the docs/cs425 folder holds the course as markdown pages, a ' +
    'canvas.toml file and rubric tables, and edutools push turns them into the Canvas course. A ' +
    'git push sends the same folder to GitHub, where GitHub Actions builds it with VitePress and ' +
    'GitHub Pages serves the course website. In Canvas, at Boise State, the push creates the ' +
    'pages, assignments, quizzes, modules, rubrics and due dates.',
  wide: {
    width: 700,
    height: 400,
    regions: [
      { label: 'GitHub', x: 8, y: 8, w: 684, h: 112 },
      { label: 'My Mac', x: 8, y: 140, w: 684, h: 122 },
      { label: 'Canvas, at Boise State', x: 8, y: 282, w: 684, h: 110 },
    ],
    nodes: [
      { id: 'vite', x: 380, y: 64, w: 180, h: 64, lines: ['VitePress build', 'on every push'] },
      { id: 'site', x: 600, y: 64, w: 170, h: 64, lines: ['Course website', 'GitHub Pages'] },
      { id: 'src', x: 125, y: 206, w: 190, h: 64, lines: ['docs/cs425/', 'markdown, canvas.toml'] },
      { id: 'edu', x: 380, y: 206, w: 180, h: 64, lines: ['edutools push', 'due dates, rubrics'] },
      { id: 'canvas', x: 590, y: 342, w: 190, h: 64, lines: ['Canvas course', 'pages, quizzes, modules'] },
    ],
    edges: [
      { from: 'src', to: 'vite', via: [[125, 64]], label: 'git push', labelAt: [125, 130] },
      { from: 'src', to: 'edu' },
      { from: 'vite', to: 'site' },
      { from: 'edu', to: 'canvas', via: [[590, 206]], label: 'Canvas API', labelAt: [590, 272] },
    ],
  },
  narrow: {
    width: 340,
    height: 378,
    regions: [
      { label: 'GitHub', x: 6, y: 6, w: 328, h: 110 },
      { label: 'My Mac', x: 6, y: 136, w: 328, h: 110 },
      { label: 'Canvas', x: 6, y: 266, w: 328, h: 104 },
    ],
    nodes: [
      { id: 'vite', x: 85, y: 70, w: 140, h: 56, lines: ['VitePress', 'every push'] },
      { id: 'site', x: 255, y: 70, w: 140, h: 56, lines: ['Website', 'GitHub Pages'] },
      { id: 'src', x: 85, y: 200, w: 140, h: 56, lines: ['docs/cs425/', 'markdown'] },
      { id: 'edu', x: 255, y: 200, w: 140, h: 56, lines: ['edutools push', 'due dates'] },
      { id: 'canvas', x: 255, y: 330, w: 140, h: 56, lines: ['Canvas course', 'pages, quizzes'] },
    ],
    edges: [
      { from: 'src', to: 'vite', label: 'git push', labelAt: [85, 126] },
      { from: 'src', to: 'edu' },
      { from: 'vite', to: 'site' },
      { from: 'edu', to: 'canvas' },
    ],
  },
}

const tune: Diagram = {
  title: 'The tuning loop',
  caption: 'Settings come from what the sessions actually did. All of it runs on my Mac.',
  desc:
    'Everything here runs on my Mac. Every Claude Code session writes a transcript to ' +
    '~/.claude/projects. claude-tune reads the transcripts and shows where the tokens and dollars ' +
    'went. It suggests fixes, asks before applying any of them, and writes the ones I approve to ' +
    'settings.json: the model, the effort level and other knobs. Those settings shape the next ' +
    'sessions, and the loop repeats.',
  wide: {
    width: 700,
    height: 330,
    regions: [{ label: 'My Mac', x: 8, y: 8, w: 684, h: 314 }],
    nodes: [
      { id: 'sessions', x: 110, y: 95, w: 170, h: 70, lines: ['Sessions', 'Claude Code at work'] },
      { id: 'transcripts', x: 590, y: 95, w: 170, h: 70, lines: ['Transcripts', '~/.claude/projects'] },
      { id: 'tune', x: 590, y: 260, w: 170, h: 82, lines: ['claude-tune', 'where the tokens', 'and dollars went'] },
      { id: 'ok', x: 350, y: 260, w: 150, h: 64, lines: ['My OK', 'it asks first'] },
      { id: 'settings', x: 110, y: 260, w: 170, h: 82, lines: ['settings.json', 'model, effort and', 'other knobs'] },
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
    height: 620,
    regions: [{ label: 'My Mac', x: 6, y: 6, w: 328, h: 606 }],
    nodes: [
      { id: 'sessions', x: 175, y: 80, w: 190, h: 64, lines: ['Sessions'] },
      { id: 'transcripts', x: 175, y: 195, w: 190, h: 70, lines: ['Transcripts', '~/.claude/projects'] },
      { id: 'tune', x: 175, y: 320, w: 190, h: 76, lines: ['claude-tune', 'where tokens went'] },
      { id: 'ok', x: 175, y: 440, w: 190, h: 64, lines: ['My OK'] },
      { id: 'settings', x: 175, y: 560, w: 190, h: 76, lines: ['settings.json', 'model and effort'] },
    ],
    edges: [
      { from: 'sessions', to: 'transcripts' },
      { from: 'transcripts', to: 'tune', label: '/tune' },
      { from: 'tune', to: 'ok', label: 'fixes' },
      { from: 'ok', to: 'settings' },
      { from: 'settings', to: 'sessions', via: [[40, 560], [40, 80]] },
    ],
  },
}

export const diagrams: Record<string, Diagram> = { loop, triggers, trunk, fanout, source, tune }
