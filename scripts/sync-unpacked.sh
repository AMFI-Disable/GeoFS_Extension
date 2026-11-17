#!/usr/bin/env bash
set -euo pipefail

cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.."

if ! git diff --quiet || ! git diff --cached --quiet; then
  echo 'Commit or stash tracked changes before syncing the unpacked extension.' >&2
  exit 1
fi

git pull --ff-only
npm ci
npm run build:unpacked

echo 'Reload GeoFS Extension in chrome://extensions, then refresh your GeoFS tabs.'
