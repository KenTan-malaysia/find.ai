# For Ken to confirm on return — v3.8.3

**Context:** Resumed under Ken's standing directive *"moving on without permission, do whatever you can do, human side permission remind me later"*. This session continued the v3.8.2 Atlas sweep into the deferred tertiary tier (D4 in v3.8.2 review) AND swept five widely-used shared components that v3.8.2 missed because they hold their colors inside styled-jsx blocks rather than inline JSX `style={}` attrs. No human action required for any of it; everything is reversible.

---

## A. What shipped autonomously (review and overrule any of these)

### A1. Tertiary surfaces — Atlas color migration (D4 from v3.8.2 review)

| File | `#B8893A` → `#002B5C` | `#FAF8F3` → `#FBFCFD` |
|---|---|---|
| `src/app/pricing/page.js` | ✓ | ✓ |
| `src/app/transparency/page.js` | ✓ | ✓ |
| `src/app/about/page.js` | ✓ | ✓ |
| `src/app/audit/page.js` | ✓ | ✓ |
| `src/app/stamp/page.js` | ✓ | ✓ |
| `src/app/screen/new/page.js` | ✓ | ✓ |
| `src/app/auth/callback/page.js` | ✓ | ✓ |
| `src/app/not-found.js` | ✓ | ✓ |
| `src/app/error.js` | ✓ | ✓ |

### A2. Loading skeletons (matched their live page siblings)

| File | Reason |
|---|---|
| `src/app/audit/loading.js` | Skeleton must match live `/audit` palette |
| `src/app/screen/new/loading.js` | Skeleton must match live `/screen/new` palette |
| `src/app/login/loading.js` | Skeleton must match live `/login` palette |

### A3. Other surfaces missed by v3.8.2 sweep

| File | What | Note |
|---|---|---|
| `src/app/page.js` | Chat-area background `has ? '#FAF8F3' : '#FAF8F3'` → `#FBFCFD` | Single line, redundant ternary preserved as-was |
| `src/app/legal/pdpa/DeleteMyDataForm.js` | Two page-bg instances migrated | PDPA right-of-deletion form |
| `src/app/(app)/admin/page.js` | Page-bg migrated | `#0F1E3F` text + button colors left untouched (B1 still pending Ken's call from v3.8.2) |
| `src/app/(app)/inbox/page.js` | Updated `var(--color-cream, #FAF8F3)` fallback to `#FBFCFD` | Resolved value matches updated globals.css var |
| `src/app/trust/[reportId]/page.js` | `.tc-spine-card-active` border-color in styled-jsx → navy | Was missed in v3.8.2 inline-only sweep |
| `src/app/trust/[reportId]/ActionRow.js` | Three `#FAF8F3` page-bg instances | |
| `src/app/landing.js` | 14 styled-jsx hits — `.ap-brand-ai`, hover states, eyebrow accents, SVG fills, `.ap-tile-eyebrow-amber`, etc. | All swept to navy. |

### A4. Shared component sweep (5 files)

| Component | Where it shows up | Migration |
|---|---|---|
| `src/components/PinPad.js` | Used by every PIN flow (settings/security, /consent/[id], /inbox approve/decline, /my-card anon flow) | `#FAF8F3` cell-background → `#FBFCFD` |
| `src/components/PeekChat.js` | Bottom dock mounted on every top-level branch (Landing / Profile / Chat) | All gold + cream swept |
| `src/components/ScansHistory.js` | Dashboard "Your scans" card | All gold + cream swept |
| `src/components/tools/AnonPinSetupStep.js` | Anon-tenant PIN setup (v3.7.18) | `#FAF8F3` page-bg swept |
| `src/components/tools/TenantScreen.js` | TOOL 1 v0 mock (~1100 lines, EN/BM/中文 inline) | All gold accents + the rgba(184,137,58,0.2) confidence-tier chip → rgba(0,43,92,0.2) |

### A5. Semantic-aware exception (didn't blindly bulk-swap)

`landing.js` had `.ap-htc-notif-ico-amber { background: #FEF3C7; color: #B8893A; border: 1.5px solid #FDE68A; }` — gold text on amber background. Bulk-swapping `#B8893A` → `#002B5C` here would put navy text on amber, which fights the amber-warning semantic. Instead I mapped the text color to **`#854F0B`** (the Civic `--color-warning-fg`). Result: amber-warning visual stays correct under Civic rules.

---

## B. Decisions that need your nod (please confirm or override)

| # | Decision I made | Reasoning | Override how |
|---|---|---|---|
| **B1** | Did NOT touch `src/lib/pdfExport.js` letterhead `<span style="color:#B8893A">.ai</span>` | Inherited from KEN_REVIEW_v3.8.2 B3 — PDF letterhead needs separate print/screen-PDF fidelity testing before Civic swap. Standing v3.9 deferral. | Tell me to do the PDF Atlas pass; I'll run a side-by-side render compare first |
| **B2** | Did NOT touch `#0F1E3F` (oxford navy) inline-text/button hits | Same as v3.8.2 B1 — text headlines want `#001734` (Civic deep ink) but primary buttons want `#002B5C` (Civic primary). Still need your call before I touch the ~25 files holding this token. | Pick text→`#001734` AND button→`#002B5C` (likely correct), or one global value, and I'll execute |
| **B3** | Did NOT convert `<span>Veri</span><span>.ai</span>` JSX inlines → `<Wordmark>` component | Same as v3.8.2 B2 — surgical edit risk across 20 files with slightly different wrapper styles. The color sweep above gets the visual benefit; the structural refactor is a separate decision. | Tell me to convert; I'll start with one test file then sweep |

---

## C. External actions still pending (your hand needed)

All inherited from KEN_REVIEW_v3.8.2 — no movement on Ken-side items between sessions. Reproduced for self-contained handoff:

| # | Action | Status |
|---|---|---|
| **C1** | Apply migrations 0002 / 0003 / 0004 in Supabase SQL Editor | ⏳ Still pending — needed for PIN, consent, agent, anon-PIN flows server-side |
| **C2** | Supabase keys debug (legacy "Invalid API key" — try new sb_publishable_/sb_secret_ keys) | ⏳ Parked since v3.7.2 |
| **C3** | Set `NEXT_PUBLIC_DEMO_MODE=false` in Vercel before pilot | ⏳ Demo prefills active |
| **C4** | Set service role key on Production env only (not Preview) | ⏳ Per H4 sticky lesson |
| **C5** | Choose email service (Resend / SendGrid / SES / Postmark) | ⏳ Standing punchlist |
| **C6** | LHDN access path decision (public STAMPS vs corporate access) | ⏳ Operational scaling blocker |
| **C7** | myTNB access path decision (manual vs partnership) | ⏳ Same as C6 |
| **C8** | Engage Malaysian lawyer for legal stubs review | ⏳ Pilot blocker |
| **C9** | Send first 5 WhatsApp pilot messages from `PILOT_WHATSAPP_DRAFTS.md` | ⏳ Real signal blocker |
| **C10** | Grant your own user `role='admin'` so /admin works | ⏳ One SQL line |

```sql
-- Run in Supabase SQL Editor after sign-in:
UPDATE public.users SET role='admin' WHERE email='tankenyap95@gmail.com';
```

---

## D. v3.9+ punchlist (deferred deliberately)

| # | What | Why deferred |
|---|---|---|
| **D1** | Convert all 20 wordmark JSX inlines → `<Wordmark>` component | B3 — structural refactor risk |
| **D2** | Bulk `#0F1E3F` swap (text vs button mapping) | B2 — needs your call |
| **D3** | `pdfExport.js` letterhead Atlas treatment | B1 — needs PDF-context testing |
| **D4** | TenantScreen `<AnonPinSetupStep>` wiring (1700-line file, insertion point still TBD) | Inherited from v3.7.19 |
| **D5** | Email service integration (Resend/SES) | Blocked on C5 |
| **D6** | TnbBehaviour UI (TnbBehaviourStep + TnbScorePreview using v3.7.19 scoring engine) | Algorithm engine ready; UI is next layer |
| **D7** | Live BOVAEP API verification of agent REN/REA | Phase 4 partnership |
| **D8** | PDF approval certificates for `consent_requests` + `agent_claims` | Self-contained, deferred for capacity |
| **D9** | Mobile responsive QA on PIN dialogs + consent dialogs + agent claim form | No real-device testing yet |

---

## E. Verification

- 24 files modified.
- Final residue grep: only `src/lib/pdfExport.js` retains legacy `#B8893A` (deliberate per B1).
- All edits are hex-string swaps inside string literals (JSX style attrs, styled-jsx CSS, SVG fills, rgba). **No JS/JSX structure changed**, so build cannot regress from these edits — risk is bounded to "wrong color renders" not "page won't compile". Local `npm install` skipped (no network); standard Vercel build will verify on push.

---

## F. Priority ranking for your next session

1. **C10 + C1** (~5 min) — admin SQL + 3 migrations → unblocks every PIN/consent/agent/anon flow server-side
2. **B2** — pick `#0F1E3F` swap mapping (text→`#001734`, button→`#002B5C` is the likely correct call) so I can finish the global token sweep
3. **D6** — TnbBehaviour UI (scoring engine ready since v3.7.19, just needs the visible component layer)
4. **C9** — send the 5 WhatsApp pilots so we get real signal
5. **B3** — wordmark JSX → `<Wordmark>` component conversion, one file at a time

---

*Drafted autonomously. Review at your leisure.*
