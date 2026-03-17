#!/usr/bin/env bash
# clean-link.sh
# Removes node_modules directories (and optional build artifacts) from the
# monorepo root and all workspace packages so a fresh install can be performed.

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"

# Parse optional flags passed through from the launcher
CLEAN_BUILD=false
while [[ $# -gt 0 ]]; do
  case "$1" in
    --build) CLEAN_BUILD=true; shift ;;
    *) echo "Unknown option: $1" >&2; exit 1 ;;
  esac
done

echo "Cleaning node_modules in $ROOT_DIR ..."
rm -rf "$ROOT_DIR/node_modules"

echo "Cleaning node_modules in $ROOT_DIR/docs ..."
rm -rf "$ROOT_DIR/docs/node_modules"

if [ "$CLEAN_BUILD" = true ]; then
  echo "Cleaning build artifacts in $ROOT_DIR ..."
  rm -rf "$ROOT_DIR/dist"
fi

echo "Done."
