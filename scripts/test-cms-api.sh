#!/usr/bin/env bash
# Tests HTTP rapides contre l'API CMS public (Next ou autre sur le port 3000 par défaut).
# Usage: CMS_BASE_URL=http://localhost:3000 ./scripts/test-cms-api.sh

set -e
BASE="${CMS_BASE_URL:-http://localhost:3000}"
BASE="${BASE%/}"
API_BASE="$BASE"
if [[ "$API_BASE" != */api/cms ]]; then
  API_BASE="$API_BASE/api/cms"
fi

echo "CMS_BASE_URL=$BASE"
echo "CMS_API_BASE=$API_BASE"
echo ""

fail() {
  echo "FAIL: $1 (HTTP $2)"
  exit 1
}

check_200() {
  local name="$1"
  local url="$2"
  local code
  code=$(curl -sS -o /tmp/slipstream_cms_test.json -w "%{http_code}" "$url") || fail "$name" "curl error"
  if [ "$code" != "200" ]; then fail "$name" "$code"; fi
  echo "OK   $name (HTTP $code)"
}

check_200 "GET group championship" "$API_BASE/groups/championship/content?status=published"
check_200 "GET calendrier-elms" "$API_BASE/calendrier-elms"
check_200 "GET calendrier-lmc" "$API_BASE/calendrier-lmc"
check_200 "GET calendrier-gt-world-eu" "$API_BASE/calendrier-gt-world-eu"
check_200 "GET article collection" "$API_BASE/article"

echo ""
node -e "
const fs = require('fs');
const j = JSON.parse(fs.readFileSync('/tmp/slipstream_cms_test.json', 'utf8'));
const blocks = j.data || [];
console.log('Dernier JSON (article): meta.total =', j.meta?.total, ', data.length =', blocks.length);
" 2>/dev/null || true

echo ""
echo "Groupe championship (structure attendue par l’app Slipstream):"
curl -sS "$API_BASE/groups/championship/content?status=published" | node -e "
const fs = require('fs');
let d = '';
process.stdin.on('data', c => d += c);
process.stdin.on('end', () => {
  const j = JSON.parse(d);
  const blocks = j.data || [];
  const m = j.meta || {};
  console.log('  group slug:', m.group?.slug);
  console.log('  availableLinkFields:', m.availableLinkFields);
  console.log('  availableLinkValuesByField.championship:', m.availableLinkValuesByField?.championship);
  console.log('  collections:', blocks.length);
  blocks.forEach((b, i) => console.log('   ', i, b.collection?.slug, '→', (b.data||[]).length, 'entrées'));
});
"

echo ""
echo "Tous les tests HTTP 200 sont passés."
