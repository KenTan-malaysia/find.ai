// src/lib/vtsShadowAdapter.js
// ─────────────────────────────────────────────────────────────────────────────
// Bridge from TenantScreen.js state → VTS event array.
//
// Today (v0 mock era): generates synthetic events from whatever the user
// clicked through. Useful for shadow-logging the comparison v0_score vs
// v1.3.2_score so we can see how often they agree/disagree.
//
// Tomorrow (after real OCR): replace the synthetic generation with real
// extracted bill data. The downstream code (vtsShadowLogger + the call site
// in TenantScreen) doesn't change — same shape in, same shape out.
//
// Public API:
//   buildEventsFromMockState({ tnbState, waterState, mobileState, lhdnVerified })
//     → events: VTS event array
//   buildEventsFromRealBills(scoredPairs)  // when real OCR ships
//     → events: VTS event array (delegates to vts.adaptFromBillCycle)
// ─────────────────────────────────────────────────────────────────────────────

import { adaptFromBillCycle } from "./vts.js";

const FALLBACK_MONTHS = 12;            // how many synthetic months to fabricate per active utility
const FALLBACK_TIER = "OnTime";        // assume neutral-positive in mock mode

/**
 * Mock-mode adapter — fabricates events when we don't have real bills yet.
 * Called when user clicks through TenantScreen v0 without real OCR.
 *
 * Each "done" utility gets FALLBACK_MONTHS events of FALLBACK_TIER.
 * The shadow logger therefore sees a HIGH-quality fake history. The whole
 * point is to wire up the plumbing so it auto-becomes real once OCR ships.
 */
export function buildEventsFromMockState({
  tnbState = {},
  waterState = {},
  mobileState = {},
  lhdnVerified = false,
} = {}) {
  const events = [];
  const utilityFlags = [
    { name: "TNB",    done: !!tnbState.done },
    { name: "Water",  done: !!waterState.done },
    { name: "Mobile", done: !!mobileState.done },
  ];
  for (const u of utilityFlags) {
    if (!u.done) continue;
    for (let m = 0; m < FALLBACK_MONTHS; m++) {
      events.push({ utility: u.name, tier: FALLBACK_TIER, months_ago: m });
    }
  }
  return events;
}

/**
 * Real-mode adapter — when scoringEngine v0 has produced (bill, receipt) pairs.
 * Delegates to the canonical bridge in vts.js.
 */
export function buildEventsFromRealBills(scoredPairs, anchorDate = new Date()) {
  return adaptFromBillCycle(scoredPairs, anchorDate);
}
