#!/bin/bash
set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
STATE_FILE="$SCRIPT_DIR/../.e2e-state.json"

rm -f "$STATE_FILE"

node "$SCRIPT_DIR/init-db.mjs" &
MONGO_PID=$!

for i in $(seq 1 30); do
  if [ -f "$STATE_FILE" ]; then
    break
  fi
  sleep 1
done

if [ ! -f "$STATE_FILE" ]; then
  echo "MongoDB init failed"
  kill $MONGO_PID 2>/dev/null
  exit 1
fi

cd "$SCRIPT_DIR/../../../"

URI=$(node -e "console.log(JSON.parse(require('fs').readFileSync('$STATE_FILE','utf8')).uri)")

echo "Starting Next.js with MongoDB: $URI"

MONGODB_URI="$URI" \
AUTH_SECRET="e2e-test-secret-flops-2024" \
NEXTAUTH_URL="http://localhost:3000" \
npx next dev -p 3000

kill $MONGO_PID 2>/dev/null
rm -f "$STATE_FILE" 2>/dev/null
