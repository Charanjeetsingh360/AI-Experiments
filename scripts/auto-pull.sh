#!/usr/bin/env bash
# ============================================================
# auto-pull.sh — Watch GitHub for new commits on main branch
# and automatically run `git pull` on the local repo.
#
# Usage:
#   chmod +x scripts/auto-pull.sh
#   ./scripts/auto-pull.sh
#
# Stop with Ctrl+C
# ============================================================

REPO_DIR="$(git rev-parse --show-toplevel 2>/dev/null || echo /Users/netsmartz/Documents/PROJECTS/AI-Experiments)"
INTERVAL=${PULL_INTERVAL:-30}   # seconds between checks (default 30s)

echo "[auto-pull] Watching repo: $REPO_DIR"
echo "[auto-pull] Polling every ${INTERVAL}s. Press Ctrl+C to stop."
echo ""

cd "$REPO_DIR" || { echo "[auto-pull] ERROR: Cannot cd to $REPO_DIR"; exit 1; }

while true; do
  BEFORE=$(git rev-parse HEAD 2>/dev/null)

  # Fetch silently; pull if behind origin/main
  git fetch origin main --quiet 2>/dev/null
  AFTER=$(git rev-parse origin/main 2>/dev/null)

  if [ "$BEFORE" != "$AFTER" ]; then
    echo "[auto-pull] $(date '+%H:%M:%S')  New commit detected — pulling..."
    git pull origin main --ff-only --quiet && echo "[auto-pull] Pull complete."
  else
    echo "[auto-pull] $(date '+%H:%M:%S')  Up to date."
  fi

  sleep "$INTERVAL"
done
