#!/bin/bash
# Build: compile src/ → lib/ with the locally installed tsc.
# Type-only dependencies (typescript / cordis / @types/node) come from npm,
# so the build works on any machine — no dsh checkout required.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

if [ ! -x node_modules/.bin/tsc ]; then
  npm install --no-save
fi

node_modules/.bin/tsc -p tsconfig.json
echo "=== Build complete: lib/ ==="
