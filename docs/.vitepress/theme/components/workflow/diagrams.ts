// The diagrams on /teaching/agentic-workflow, drawn by render.ts through WorkflowDiagram.vue.
// Each one has a wide layout (about 700 units across, so the text stays near
// full size on a desktop) and a narrow one for phones. Coordinates are node
// centers.

import type { Diagram } from './render'

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
    height: 560,
    regions: [
      { label: 'Where the agent works: my Mac, or a GitHub Actions runner', place: 'mac', x: 8, y: 8, w: 684, h: 182 },
      { label: 'GitHub', place: 'github', x: 8, y: 214, w: 684, h: 162 },
      { label: "Users' machines", place: 'users', x: 8, y: 400, w: 684, h: 152 },
    ],
    nodes: [
      { id: 'edit', x: 98, y: 96, w: 132, h: 80, lines: ['Edit', 'from my prompt', 'or a trigger'] },
      { id: 'test', x: 266, y: 96, w: 132, h: 80, lines: ['Test', 'pre-commit hook', 'runs the tests'] },
      { id: 'review', x: 434, y: 96, w: 132, h: 80, lines: ['Review', 'a second agent', 'reads the diff'] },
      { id: 'land', x: 602, y: 96, w: 132, h: 80, lines: ['Land', 'rebase, run the', 'checks, push'] },
      { id: 'triggers', x: 266, y: 298, w: 132, h: 80, lines: ['Triggers', 'an issue, failing', 'CI, a schedule'] },
      { id: 'release', x: 434, y: 298, w: 132, h: 64, lines: ['Release', 'only with my OK'] },
      { id: 'ci', x: 602, y: 298, w: 132, h: 64, lines: ['CI on main', 'Ubuntu, macOS'] },
      { id: 'users', x: 266, y: 482, w: 132, h: 80, lines: ['Users', 'students and', 'colleagues'] },
      { id: 'update', x: 602, y: 482, w: 132, h: 64, lines: ['Autoupdate', 'on the next start'] },
      { id: 'reviewOut', x: 434, y: 136, kind: 'point' },
      { id: 'editBack', x: 150, y: 136, kind: 'point' },
      { id: 'editStart', x: 124, y: 136, kind: 'point' },
    ],
    edges: [
      { from: 'edit', to: 'test' },
      { from: 'test', to: 'review' },
      { from: 'review', to: 'land' },
      { from: 'reviewOut', to: 'editBack', via: [[434, 166], [150, 166]], label: 'a failure or a finding goes back', labelAt: [287, 166] },
      { from: 'land', to: 'ci', label: 'push', labelAt: [630, 236] },
      { from: 'ci', to: 'release' },
      { from: 'ci', to: 'update', label: 'pass', labelAt: [630, 356] },
      { from: 'update', to: 'users', label: 'new version' },
      { from: 'users', to: 'triggers', label: 'report a bug', labelAt: [331, 356] },
      { from: 'triggers', to: 'editStart', via: [[124, 298]], label: 'start an agent', labelAt: [192, 236] },
    ],
  },
  narrow: {
    width: 340,
    height: 836,
    regions: [
      { label: 'My Mac, or an Actions runner', place: 'mac', x: 6, y: 6, w: 328, h: 350 },
      { label: 'GitHub', place: 'github', x: 6, y: 380, w: 328, h: 212 },
      { label: 'Users', place: 'users', x: 6, y: 616, w: 328, h: 212 },
    ],
    nodes: [
      { id: 'edit', x: 170, y: 80, w: 220, h: 56, lines: ['Edit', 'from a prompt or trigger'] },
      { id: 'test', x: 170, y: 156, w: 220, h: 56, lines: ['Test', 'pre-commit hook'] },
      { id: 'review', x: 170, y: 232, w: 220, h: 56, lines: ['Review', 'a second agent'] },
      { id: 'land', x: 170, y: 308, w: 220, h: 56, lines: ['Land', 'rebase, check, push'] },
      { id: 'ci', x: 170, y: 452, w: 200, h: 56, lines: ['CI on main', 'Ubuntu and macOS'] },
      { id: 'release', x: 95, y: 540, w: 110, h: 56, lines: ['Release', 'with my OK'] },
      { id: 'triggers', x: 245, y: 540, w: 110, h: 56, lines: ['Triggers', 'start agents'] },
      { id: 'update', x: 170, y: 688, w: 200, h: 56, lines: ['Autoupdate', 'on the next start'] },
      { id: 'users', x: 170, y: 776, w: 200, h: 56, lines: ['Users', 'students, colleagues'] },
      { id: 'ciLeft', x: 95, y: 480, kind: 'point' },
      { id: 'ciDown', x: 170, y: 480, kind: 'point' },
    ],
    edges: [
      { from: 'edit', to: 'test' },
      { from: 'test', to: 'review' },
      { from: 'review', to: 'land' },
      { from: 'review', to: 'edit', via: [[34, 232], [34, 80]], label: 'fail', labelAt: [34, 156] },
      { from: 'land', to: 'ci', label: 'push', labelAt: [205, 402] },
      { from: 'ciLeft', to: 'release' },
      { from: 'ciDown', to: 'update' },
      { from: 'update', to: 'users' },
      { from: 'users', to: 'triggers', via: [[320, 776], [320, 540]] },
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
    height: 452,
    regions: [
      { label: 'My Mac', place: 'mac', x: 8, y: 8, w: 684, h: 136 },
      { label: 'GitHub', place: 'github', x: 8, y: 168, w: 684, h: 248 },
    ],
    nodes: [
      { id: 'me', x: 130, y: 92, w: 180, h: 52, lines: ['A prompt from me'] },
      { id: 'local', x: 400, y: 92, w: 200, h: 60, lines: ['Agent session', 'live, or in a worktree'] },
      { id: 'ci', x: 130, y: 240, w: 180, h: 48, lines: ['CI fails on main'] },
      { id: 'issue', x: 130, y: 304, w: 180, h: 48, kind: 'planned', lines: ['A labeled issue'] },
      { id: 'cron', x: 130, y: 368, w: 180, h: 48, lines: ['A schedule'] },
      { id: 'runner', x: 400, y: 304, w: 200, h: 60, lines: ['Agent session', 'on a fresh runner'] },
      { id: 'main', x: 600, y: 304, w: 140, h: 60, lines: ['main', 'where work lands'] },
      { id: 'legend', x: 20, y: 440, kind: 'note', align: 'start', lines: ['dotted border: built, not run for real yet'] },
    ],
    edges: [
      { from: 'me', to: 'local' },
      { from: 'ci', to: 'runner' },
      { from: 'issue', to: 'runner' },
      { from: 'cron', to: 'runner' },
      { from: 'runner', to: 'main' },
      { from: 'local', to: 'main', via: [[600, 92]], label: 'push', labelAt: [628, 190] },
    ],
  },
  narrow: {
    width: 340,
    height: 664,
    regions: [
      { label: 'My Mac', place: 'mac', x: 6, y: 6, w: 328, h: 192 },
      { label: 'GitHub', place: 'github', x: 6, y: 222, w: 328, h: 400 },
    ],
    nodes: [
      { id: 'me', x: 160, y: 76, w: 200, h: 40, lines: ['A prompt from me'] },
      { id: 'local', x: 160, y: 148, w: 200, h: 52, lines: ['Agent session', 'live, or in a worktree'] },
      { id: 'ci', x: 160, y: 290, w: 200, h: 40, lines: ['CI fails on main'] },
      { id: 'issue', x: 160, y: 346, w: 200, h: 40, kind: 'planned', lines: ['A labeled issue'] },
      { id: 'cron', x: 160, y: 402, w: 200, h: 40, lines: ['A schedule'] },
      { id: 'runner', x: 160, y: 486, w: 200, h: 52, lines: ['Agent session', 'on a fresh runner'] },
      { id: 'main', x: 160, y: 572, w: 200, h: 52, lines: ['main', 'where work lands'] },
      { id: 'legend', x: 170, y: 650, kind: 'note', lines: ['dotted border: built, not run for real yet'] },
    ],
    edges: [
      { from: 'me', to: 'local' },
      { from: 'ci', to: 'runner', via: [[290, 290], [290, 486]] },
      { from: 'issue', to: 'runner', via: [[290, 346], [290, 486]] },
      { from: 'cron', to: 'runner', via: [[290, 402], [290, 486]] },
      { from: 'runner', to: 'main' },
      { from: 'local', to: 'main', via: [[316, 148], [316, 572]] },
    ],
  },
}

const controller: Diagram = {
  title: 'One controller per repo',
  caption: 'I talk to the controller. It briefs the workers, answers them and lands their work.',
  desc:
    'Three areas show where each session runs. On my Mac: I talk to the controller, the live ' +
    'session in the main checkout on main. It plans, answers and lands. It sends a brief to each ' +
    'local worker, a background session in its own worktree, and the workers report back with ' +
    'SendMessage. In Anthropic\'s cloud: the controller can send a brief to a cloud worker, which ' +
    'gets a fresh clone and none of my Mac\'s files, and cannot message back yet. Cloud workers ' +
    'are planned, so that box is drawn dotted. On GitHub: the cloud worker pushes a branch to ' +
    'origin, and the controller pushes main there, which runs CI.',
  wide: {
    width: 700,
    height: 418,
    regions: [
      { label: 'My Mac', place: 'mac', x: 8, y: 8, w: 684, h: 192 },
      { label: 'Anthropic cloud', place: 'cloud', x: 8, y: 224, w: 352, h: 158 },
      { label: 'GitHub', place: 'github', x: 384, y: 224, w: 308, h: 158 },
    ],
    nodes: [
      { id: 'me', x: 90, y: 120, w: 100, h: 52, lines: ['Me'] },
      { id: 'controller', x: 280, y: 120, w: 190, h: 96, lines: ['Controller', 'main checkout', 'plans, answers, lands'] },
      { id: 'workers', x: 598, y: 120, w: 160, h: 96, lines: ['Local workers', 'one worktree each'] },
      { id: 'cloud', x: 196, y: 316, w: 236, h: 84, kind: 'planned', lines: ['Cloud worker', 'fresh clone, no Mac files', "can't message back yet"] },
      { id: 'origin', x: 560, y: 316, w: 200, h: 84, lines: ['origin', 'main, worker branches', 'and CI'] },
      // Ends on the box sides, so the two lines between a pair of boxes do not
      // sit on top of each other.
      { id: 'briefOut', x: 375, y: 98, kind: 'point' },
      { id: 'briefIn', x: 518, y: 98, kind: 'point' },
      { id: 'replyOut', x: 518, y: 142, kind: 'point' },
      { id: 'replyIn', x: 375, y: 142, kind: 'point' },
      { id: 'cloudOut', x: 260, y: 168, kind: 'point' },
      { id: 'cloudIn', x: 260, y: 274, kind: 'point' },
      { id: 'pushOut', x: 350, y: 168, kind: 'point' },
      { id: 'legend', x: 20, y: 406, kind: 'note', align: 'start', lines: ['dotted border: planned, not built yet'] },
    ],
    edges: [
      { from: 'me', to: 'controller' },
      { from: 'briefOut', to: 'briefIn', label: 'brief' },
      { from: 'replyOut', to: 'replyIn', label: 'SendMessage' },
      { from: 'cloudOut', to: 'cloudIn', label: 'brief', labelAt: [295, 184] },
      { from: 'pushOut', to: 'origin', via: [[350, 212], [560, 212]], label: 'push main', labelAt: [612, 246] },
      { from: 'cloud', to: 'origin', label: 'branch', labelAt: [422, 316] },
    ],
  },
  narrow: {
    width: 340,
    height: 720,
    regions: [
      { label: 'My Mac', place: 'mac', x: 6, y: 6, w: 328, h: 350 },
      { label: 'Anthropic cloud', place: 'cloud', x: 6, y: 380, w: 328, h: 141 },
      { label: 'GitHub', place: 'github', x: 6, y: 545, w: 328, h: 135 },
    ],
    nodes: [
      { id: 'me', x: 170, y: 74, w: 200, h: 40, lines: ['Me'] },
      { id: 'controller', x: 170, y: 160, w: 240, h: 80, lines: ['Controller', 'main checkout on main', 'plans, answers, lands'] },
      { id: 'workers', x: 170, y: 300, w: 240, h: 64, lines: ['Local workers', 'one worktree each'] },
      { id: 'cloud', x: 170, y: 462, w: 240, h: 70, kind: 'planned', lines: ['Cloud worker', 'fresh clone, no Mac files'] },
      { id: 'origin', x: 170, y: 624, w: 240, h: 64, lines: ['origin', 'main, branches and CI'] },
      { id: 'briefOut', x: 110, y: 200, kind: 'point' },
      { id: 'briefIn', x: 110, y: 268, kind: 'point' },
      { id: 'replyOut', x: 230, y: 268, kind: 'point' },
      { id: 'replyIn', x: 230, y: 200, kind: 'point' },
      { id: 'pushOut', x: 290, y: 136, kind: 'point' },
      { id: 'cloudOut', x: 290, y: 176, kind: 'point' },
      { id: 'legend', x: 170, y: 706, kind: 'note', lines: ['dotted border: planned, not built yet'] },
    ],
    edges: [
      { from: 'me', to: 'controller' },
      { from: 'briefOut', to: 'briefIn', label: 'brief' },
      { from: 'replyOut', to: 'replyIn', label: 'SendMessage' },
      { from: 'cloudOut', to: 'cloud', via: [[306, 176], [306, 462]] },
      { from: 'cloud', to: 'origin', label: 'branch', labelAt: [210, 567] },
      { from: 'pushOut', to: 'origin', via: [[320, 136], [320, 624]] },
    ],
  },
}

const trunk: Diagram = {
  title: 'Parallel workers landing on main',
  caption: 'One trunk, with the controller landing each worker\'s branch one at a time.',
  desc:
    'A timeline of the main branch running left to right. Worktree B, a worker, branches off ' +
    'main and makes three commits. Worktree A branches off a little later and makes two. The ' +
    'controller rebases A and lands it on main, then rebases B and lands it after A. Only the ' +
    'controller lands, so two branches never land at the same time.',
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
      { id: 'mainNote', x: 20, y: 40, kind: 'note', align: 'start', lines: ['main: only the controller lands here'] },
      { id: 'aNote', x: 275, y: 180, kind: 'note', align: 'start', lines: ['worktree A'] },
      { id: 'bNote', x: 185, y: 245, kind: 'note', align: 'start', lines: ['worktree B, another worker'] },
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
    height: 312,
    regions: [
      { label: 'Mac or runner', place: 'mac', x: 8, y: 8, w: 180, h: 296 },
      { label: 'GitHub', place: 'github', x: 212, y: 8, w: 292, h: 296 },
      { label: 'Users', place: 'users', x: 528, y: 8, w: 164, h: 296 },
    ],
    nodes: [
      { id: 'push', x: 98, y: 160, w: 148, h: 100, lines: ['git push', 'pre-push runs', 'check.sh and', 'test-install.sh'] },
      { id: 'ci', x: 290, y: 160, w: 124, h: 84, lines: ['CI', 'Ubuntu and', 'macOS'] },
      { id: 'market', x: 430, y: 160, w: 120, h: 84, lines: ['Marketplace', 'claude-plugins', 'repo'] },
      { id: 'mine', x: 610, y: 100, w: 132, h: 44, lines: ['My machines'] },
      { id: 'students', x: 610, y: 160, w: 132, h: 44, lines: ['Students'] },
      { id: 'others', x: 610, y: 220, w: 132, h: 44, lines: ['Colleagues'] },
      { id: 'stop', x: 290, y: 228, kind: 'note', lines: ['a failure', 'stops it here'] },
      { id: 'start', x: 610, y: 270, kind: 'note', lines: ['each updates on', 'its next start'] },
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
    height: 666,
    regions: [
      { label: 'Mac or runner', place: 'mac', x: 6, y: 6, w: 328, h: 144 },
      { label: 'GitHub', place: 'github', x: 6, y: 174, w: 328, h: 220 },
      { label: "Users' machines", place: 'users', x: 6, y: 418, w: 328, h: 240 },
    ],
    nodes: [
      { id: 'push', x: 170, y: 92, w: 220, h: 72, lines: ['git push', 'pre-push runs', 'check.sh, test-install.sh'] },
      { id: 'ci', x: 170, y: 246, w: 220, h: 56, lines: ['CI', 'Ubuntu and macOS'] },
      { id: 'market', x: 170, y: 342, w: 220, h: 56, lines: ['Marketplace', 'claude-plugins'] },
      { id: 'mine', x: 170, y: 482, w: 200, h: 40, lines: ['My machines'] },
      { id: 'students', x: 170, y: 538, w: 200, h: 40, lines: ['Students'] },
      { id: 'others', x: 170, y: 594, w: 200, h: 40, lines: ['Colleagues'] },
      { id: 'start', x: 170, y: 640, kind: 'note', lines: ['each updates on its next start'] },
    ],
    edges: [
      { from: 'push', to: 'ci' },
      { from: 'ci', to: 'market', label: 'pass' },
      { from: 'market', to: 'mine', via: [[304, 342], [304, 482]] },
      { from: 'market', to: 'students', via: [[304, 342], [304, 538]] },
      { from: 'market', to: 'others', via: [[304, 342], [304, 594]] },
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
    height: 432,
    regions: [
      { label: 'GitHub', place: 'github', x: 8, y: 8, w: 684, h: 120 },
      { label: 'My Mac', place: 'mac', x: 8, y: 152, w: 684, h: 120 },
      { label: 'Canvas, at Boise State', place: 'canvas', x: 8, y: 296, w: 684, h: 128 },
    ],
    nodes: [
      { id: 'vite', x: 380, y: 84, w: 180, h: 56, lines: ['VitePress build', 'on every push'] },
      { id: 'site', x: 590, y: 84, w: 170, h: 56, lines: ['Course website', 'GitHub Pages'] },
      { id: 'src', x: 140, y: 228, w: 200, h: 56, lines: ['docs/cs425/', 'markdown, canvas.toml'] },
      { id: 'edu', x: 380, y: 228, w: 180, h: 56, lines: ['edutools push', 'due dates, rubrics'] },
      { id: 'canvas', x: 590, y: 372, w: 170, h: 70, lines: ['Canvas course', 'pages, quizzes', 'and modules'] },
    ],
    edges: [
      { from: 'src', to: 'vite', via: [[140, 84]], label: 'git push', labelAt: [183, 174] },
      { from: 'src', to: 'edu' },
      { from: 'vite', to: 'site' },
      { from: 'edu', to: 'canvas', via: [[590, 228]], label: 'Canvas API', labelAt: [643, 318] },
    ],
  },
  narrow: {
    width: 340,
    height: 422,
    regions: [
      { label: 'GitHub', place: 'github', x: 6, y: 6, w: 328, h: 120 },
      { label: 'My Mac', place: 'mac', x: 6, y: 150, w: 328, h: 120 },
      { label: 'Canvas', place: 'canvas', x: 6, y: 294, w: 328, h: 120 },
    ],
    nodes: [
      { id: 'vite', x: 90, y: 84, w: 136, h: 56, lines: ['VitePress', 'every push'] },
      { id: 'site', x: 250, y: 84, w: 136, h: 56, lines: ['Website', 'GitHub Pages'] },
      { id: 'src', x: 90, y: 228, w: 136, h: 56, lines: ['docs/cs425/', 'markdown'] },
      { id: 'edu', x: 250, y: 228, w: 136, h: 56, lines: ['edutools', 'push, due dates'] },
      { id: 'canvas', x: 250, y: 372, w: 136, h: 56, lines: ['Canvas', 'pages, quizzes'] },
      { id: 'srcUp', x: 140, y: 200, kind: 'point' },
      { id: 'viteDown', x: 140, y: 112, kind: 'point' },
    ],
    edges: [
      { from: 'srcUp', to: 'viteDown', label: 'git push', labelAt: [192, 172] },
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
    regions: [{ label: 'My Mac', place: 'mac', x: 8, y: 8, w: 684, h: 314 }],
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
    regions: [{ label: 'My Mac', place: 'mac', x: 6, y: 6, w: 328, h: 606 }],
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

export const diagrams: Record<string, Diagram> = { loop, triggers, controller, trunk, fanout, source, tune }
