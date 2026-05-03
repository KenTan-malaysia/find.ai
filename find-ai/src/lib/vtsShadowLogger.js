// src/lib/vtsShadowLogger.js
// ─────────────────────────────────────────────────────────────────────────────
// Shadow-mode comparison logger: runs v1.3.2 alongside the v0 mock score and
// emits a side-by-side comparison record. Builds the dataset Veri needs for
// v1.4 calibration (and for the "did the new algorithm match the old?" audit).
//
// Default: console.info only — zero side effects. Safe in any environment.
// Opt-in: if NEXT_PUBLIC_VTS_SHADOW=1 AND Supabase is configured, also writes
// to the `vts_shadow_scores` table for analysis.
//
// Failure mode: NEVER throws. The shadow log is decorative; if it breaks,
// the user-facing flow (v0 mock score) MUST keep working.
//
// Public API:
//   logShadowComparison({ caseRef, v0Score, v0Confidence, events })
//     fire-and-forget; returns void
// ─────────────────────────────────────────────────────────────────────────────

import { score as vtsScore, PARAMS as VTS_PARAMS } from "./vts.js";

const SHADOW_ENABLED =
  typeof process !== "undefined" &&
  process.env &&
  process.env.NEXT_PUBLIC_VTS_SHADOW === "1";

let supabasePromise = null;
async function getSupabase() {
  if (!SHADOW_ENABLED) return null;
  if (supabasePromise) return supabasePromise;
  supabasePromise = (async () => {
    try {
      const mod = await import("./supabase");
      return mod?.supabase || null;
    } catch {
      return null;
    }
  })();
  return supabasePromise;
}

/**
 * Run v1.3.2 in parallel with the v0 mock score. Emit a comparison record.
 * Never throws.
 */
export function logShadowComparison({
  caseRef = null,
  v0Score = null,
  v0Confidence = null,
  events = [],
  context = {},
} = {}) {
  // Compute v1.3.2 score; never let it bubble
  let vts = null;
  try {
    vts = vtsScore({ events });
  } catch (err) {
    if (typeof console !== "undefined") console.warn("[vts-shadow] scoring failed:", err?.message || err);
    return;
  }

  const record = {
    case_ref: caseRef,
    computed_at: new Date().toISOString(),
    engine_version: VTS_PARAMS.ENGINE_VERSION,
    v0: { score: v0Score, confidence: v0Confidence },
    v1_3_2: vts.blocked
      ? { blocked: true, block_reason: vts.block_reason }
      : {
          score: vts.score,
          tier: vts.tier,
          badge: vts.badge,
          confidence: vts.confidence,
          floor_reason: vts.breakdown?.floor_reason || null,
          multi_account_warning: vts.multi_account_warning || null,
          display_message: vts.display_message || null,
        },
    delta: vts.blocked || v0Score == null ? null : vts.score - v0Score,
    events_count: events.length,
    context,
  };

  // Always emit to console (cheap; helps during pilot)
  try {
    if (typeof console !== "undefined") {
      console.info("[vts-shadow]", JSON.stringify(record));
    }
  } catch {}

  // Opt-in DB write
  if (!SHADOW_ENABLED) return;
  (async () => {
    try {
      const sb = await getSupabase();
      if (!sb) return;
      await sb.from("vts_shadow_scores").insert(record);
    } catch (err) {
      if (typeof console !== "undefined") console.warn("[vts-shadow] db write failed:", err?.message || err);
    }
  })();
}

/**
 * Optional: a thin "is this enabled" helper for UI debug overlays.
 */
export function isShadowEnabled() {
  return SHADOW_ENABLED;
}
