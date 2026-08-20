#!/usr/bin/env bash
# Shared ratchet-comparison helper for the CI quality gates added in Task 9i.
#
# A "ratchet" gate fails only when a fault count goes UP past a committed
# baseline (see .github/quality-baseline.env) — it does not require the count
# to be zero. This lets CI catch new regressions immediately without being
# red for pre-existing, catalogued faults nobody touching this PR caused.
#
# Usage: source this file, then for each metric:
#   ratchet "<label>" <current-count> <baseline-count>
# Check its return status ($?) — 0 means "gate passed" (at or below baseline,
# including when the count improved), 1 means "gate failed" (regression).
# The function never exits the shell itself; the caller decides what to do
# with a non-zero result (so one step can check several metrics and report
# all of them before deciding whether to fail).

ratchet() {
  local label="$1"
  local current="$2"
  local baseline="$3"

  if ! [[ "$current" =~ ^[0-9]+$ ]]; then
    echo "RATCHET ERROR: '$label' got a non-numeric current count ('$current')."
    echo "This means the count could not be parsed from the tool's output — treat this as an infrastructure failure, not a fault-count result."
    return 1
  fi

  echo "-- $label: $current (baseline $baseline)"

  if [ "$current" -gt "$baseline" ]; then
    echo "   FAIL: $label went UP — $current exceeds the committed baseline of $baseline."
    echo "   This is a regression. Fix the new fault(s); do not raise the baseline to make this pass."
    echo "   Baseline lives in .github/quality-baseline.env."
    return 1
  elif [ "$current" -lt "$baseline" ]; then
    echo "   IMPROVED: $label went DOWN — $current is below the committed baseline of $baseline."
    echo "   Lower this baseline in .github/quality-baseline.env, in the same PR as the fix, so the ratchet tightens instead of carrying slack forever."
    return 0
  else
    echo "   OK: $label is unchanged, at baseline ($baseline)."
    return 0
  fi
}
