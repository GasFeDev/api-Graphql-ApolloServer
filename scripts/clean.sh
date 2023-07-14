#!/bin/bash
set -euo pipefail

git clean -e "**/node_modules/**" -dfx \
  "*.ts" \
  "./assets" \
  "./build" \
  "./coverage" \
  "./generated" \
  "**/build/**" \
  "**/dist/**" \
  "**/generated/**" \
  "**/cachedSchema/*.gql" \
  "**/generated.*"

if [ "${NUKE_NODE_MODULES:-false}" = "true" ]; then
  git clean -dfX "node_modules" "**/node_modules/**"
fi

echo "So fresh and so clean, clean!"
