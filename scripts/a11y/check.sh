#!/bin/sh
# Check one course against WCAG 2.2 AA. See check.mjs for what it checks. Every
# run also checks the diagrams (see diagrams.mjs), and --diagrams checks only
# them.
#
# usage: npm run a11y -- --course cs331 [--canvas <snapshot dir>] [--out <file>]
#        npm run diagrams [-- --shots <dir>]
#
# The tools live in their own package here, so the site build and CI never
# install them. The first run downloads Playwright's Chromium (about 150 MB).
set -eu

here=$(cd "$(dirname "$0")" && pwd)
root=$(cd "$here/../.." && pwd)

(cd "$here" && npm ci --silent --no-audit --no-fund && npx --no playwright install chromium >/dev/null)

diagrams() {
	node --disable-warning=MODULE_TYPELESS_PACKAGE_JSON "$here/diagrams.mjs" "$@"
}

if [ "${1:-}" = "--diagrams" ]
then
	shift
	diagrams "$@"
	exit
fi

# Always rebuild, so the check never reads a stale dist.
(cd "$root" && npm run --silent docs:build >/dev/null)
status=0
diagrams || status=1
node "$here/check.mjs" "$@" || status=1
exit $status
