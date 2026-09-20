#!/usr/bin/env bash
#
# Runs the checks from .github/workflows/ci.yml.
#
#   ./test_ci.sh            # the test job under act
#   ./test_ci.sh --no-act   # every check on the host, no containers
#   ./test_ci.sh --fix      # format the code, throw away node_modules and the browsers, then run
#

set -uo pipefail

cd "$(dirname "${BASH_SOURCE[0]}")" || exit 1

USE_ACT=1
FIX=0
EXTRA=()

while (($#)); do
  case "$1" in
    --no-act) USE_ACT=0 ;;
    --fix) FIX=1 ;;
    -h | --help)
      awk 'NR>1 && !/^#/ {exit} NR>1 {sub(/^# ?/, ""); print}' "${BASH_SOURCE[0]}"
      exit 0
      ;;
    *) EXTRA+=("$1") ;;
  esac
  shift
done

# mirror all output to a log
LOG=.test_ci.log
exec > >(tee "$LOG") 2>&1

bold() { printf '\n\033[1m== %s\033[0m\n' "$*"; }
warn() { printf '\033[33m!! %s\033[0m\n' "$*" >&2; }

FAILED=()

# runs one CI step and records the failure without stopping
step() {
  local name="$1"
  shift
  bold "$name"
  if "$@"; then
    return 0
  fi
  warn "$name failed"
  FAILED+=("$name")
  return 1
}

report() {
  if ((${#FAILED[@]})); then
    printf '\n\033[31m%s check(s) failed:\033[0m\n' "${#FAILED[@]}"
    printf '  - %s\n' "${FAILED[@]}"
    printf 'full log: %s\n' "$LOG"
    exit 1
  fi
  printf '\n\033[32mall checks passed\033[0m\n'
  exit 0
}

# the ci.yml test job, every step runs in docs/

docs_checks() {
  step "npm install" npm --prefix docs install

  # the workflow installs the system libraries too, which needs sudo on a host
  step "playwright browser" npx --prefix docs playwright install chromium

  step "npm run build" npm --prefix docs run build
  step "npm test" npm --prefix docs test
}

if ((FIX)); then
  # format first, so a stray indent never shows up as a check failure
  step "npm install (root)" npm install
  step "prettier" npm run format

  bold "fix: clean docs/node_modules and docs/test-results"
  rm -rf docs/node_modules docs/test-results
  # no --force: the browsers live in ~/.cache/ms-playwright, not node_modules,
  # so this is a no-op unless package.json moved to a build that is not cached
  step "playwright browser" npx --prefix docs playwright install chromium
fi

if ((USE_ACT)); then
  # look act up by path, since a shell alias is not visible here
  ACT="$(command -v act || true)"
  [[ -x $ACT ]] || ACT="$HOME/.local/bin/act"
  if [[ ! -x $ACT ]]; then
    warn "act is not installed - use --no-act to run the checks directly"
    exit 127
  fi

  # .actrc supplies --reuse and the runner images
  step "act: test job" "$ACT" push -W .github/workflows/ci.yml -j test "${EXTRA[@]}"
else
  ((${#EXTRA[@]} == 0)) || warn "ignoring act-only arguments: ${EXTRA[*]}"
  docs_checks
fi

report
