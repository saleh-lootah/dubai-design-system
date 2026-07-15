#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"

(cd harness && npm ci)

for s in js react vue; do
  echo "=== $s ==="
  (cd "$s" && npm ci && npm run build)
  node harness/verify.mjs "$s/dist"
done

echo "=== angular ==="
(cd angular && npm ci && npm run build)
node harness/verify.mjs angular/dist/dda-angular-sample/browser

echo "ALL SAMPLES PASS"
