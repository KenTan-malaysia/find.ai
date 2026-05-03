// Quick e2e smoke for shadow logger
import { buildEventsFromMockState } from "../src/lib/vtsShadowAdapter.js";
import { logShadowComparison } from "../src/lib/vtsShadowLogger.js";

const events = buildEventsFromMockState({
  tnbState: { done: true },
  waterState: { done: true },
  mobileState: { done: true },
  lhdnVerified: true,
});
console.log("Synthetic events:", events.length, "(expected 36 for 3 utilities × 12 mo)");
logShadowComparison({
  caseRef: "TEST-001",
  v0Score: 94,
  v0Confidence: 1.0,
  events,
  context: { lhdnVerified: true, billsCount: 3, demoMode: true },
});
