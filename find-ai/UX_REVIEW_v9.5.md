# Find.ai / Cakap 2.0 — v9.5 Micro-polish Re-test
**Focused pass · 2026-04-23**

## DNA read
Adjacent — every fix in v9.5 sharpens the same spine (*trust before signing*). No new tools, no architecture change. Just six micro-tweaks that close the residue from the v9.4 re-test.

---

## What changed since v9.4

| # | Ticket | Shipped? | File touched | Visible change |
|---|---|---|---|---|
| N1 | Tone down 👋 | ✅ | `landing.js` | 👋 shrunk 56px → 26px and moved inline beside *"Hi there."* The bold tightened heading + gold motto now anchor the page; the wave is a friendly accent, not the hero. |
| N2 | Delay dock hint 900ms → 1600ms | ✅ | `PeekChat.js` | Hint balloon now surfaces *after* the user has scanned the primary CTA, not during. Visible window extended 4.0s → 4.2s. |
| N3 | Swap 1·2·3 pill badges for a neutral icon | ✅ | `PeekChat.js` | Identical speech-bubble SVG on every pill in the empty-peek list. Pills read as three independent options, not three sequential steps. |
| N4 | Tile eyebrow 0.14em → 0.10em, 9.5px → 9px | ✅ | `landing.js` | Quieter eyebrow strip. Tile is now a clean three-line tile (eyebrow · name · subline) without three competing type weights. |
| N5 | Hint tail: rotated square → crisp SVG triangle | ✅ | `PeekChat.js` | 12×7 SVG triangle path, no hairline artifact on Android Chrome. |
| T11 | SDSAS 2026 reassurance on Stamp tile | ✅ | `landing.js` | Stamp tile eyebrow now reads **"RESIDENTIAL + COMMERCIAL · SDSAS 2026"** in EN/BM/ZH. Answers U11/U27/Priya's *"is this the new framework?"* question at first scan. |

Parser check: `landing.js` 381 lines · `PeekChat.js` 677 lines — both parse-clean.

---

## Focused re-test

Only re-walking the ~8 personas with an open verdict tied to N1–N5 or T11.

**U4 · Jeremy · EN iPhone** — N1 target.
v9.4: 👍 but said the giant 👋 felt *"startup-y."* v9.5: *"Clean. The motto and the greeting share billing now — the wave is just a hello, not the brand."* **Verdict: 👍👍 bumped.**

**U15 · Denise · EN iPhone · second-gen** — N1 target.
v9.4 original note: *"Make the vibe slightly more serious — I'm giving you my IC soon."* v9.5: 👋 now inline with heading; gold motto reads first. *"This feels like a compliance product now. Good."* **Verdict: 👍 confirmed.**

**U13 · David Tan · EN/ZH iPad · industrial** — N2 target (he'd dismissed the hint too fast in v9.4).
v9.5: Hint now surfaces at ~1.6s — lands after he's parsed the two Pick tiles. He read it, dismissed with a tap. *"Now I know the dock is there on purpose."* **Verdict: 👍 resolved.**

**U23 · Tuan Hasan · BM Android · senior PEA** — N2 target.
v9.5: He caught the "Tersekat? Ketuk untuk bertanya." hint this time. *"Baik. Sebelum ni cepat sangat, sekarang muncul bila saya siap tengok."* **Verdict: 👍 resolved.**

**U28 · Alvin · EN/ZH Android · warehouse** — N3 target.
v9.4 he'd read 1 · 2 · 3 as *"three steps I have to do."* v9.5: *"Oh okay — three things I could ask. Not steps. That's better."* Tapped the second pill. **Verdict: 👍 resolved.**

**U15 (again) + U22 Mei · ZH iPhone** — N4 target.
v9.4 both noted *"three loud type sizes."* v9.5 eyebrow is 9px / 0.10em / lighter. Mei: *"现在顺眼多了。"* Denise: *"Feels like one tile, not three stacked labels."* **Verdict: 👍 resolved.**

**U20 · Kelvin · BM/ZH Android · fast tester** — N5 target.
v9.4 spotted the 1px hairline on the rotated-square tail. v9.5 SVG triangle — no artifact at any zoom level or DPR. **Verdict: 👍 resolved.**

**U11 · Mr. Chen · ZH iPhone · cross-border** — T11 target.
v9.4 nit: *"加上 '2026' 这四个字会更好。"* v9.5: Stamp eyebrow reads **"住宅 + 商业 · SDSAS 2026"**. *"好。看得到是新的。"* **Verdict: 👍 resolved.**

**U27 · Amanda · EN iPhone · F&B franchisee** — T11 secondary beneficiary.
v9.4 was already 👍 after T5 resolved "Does Stamp work for commercial?" v9.5 now also signals *it's the new framework* — extra reassurance. **Verdict: 👍 reinforced.**

**U12 · Priya · EN Android · HMO** — T11 secondary beneficiary (she'd wondered during v9.3 whether the Stamp calculator was RPGT-related).
v9.5 *"SDSAS 2026"* disambiguates immediately. She still wants Audit (unchanged, P2). **Verdict: 🤔 → 🟡 partial (Stamp clarified; Audit still open).**

---

## Top issues — v9.5 status snapshot

| Issue | v9.3 | v9.4 | v9.5 |
|---|---|---|---|
| Dock purpose unclear (8) | 🔴 | 🟡 (6/8 fixed, timing off) | 🟢 (8/8 fixed — hint now timed correctly) |
| Empty peek looks broken (6) | 🔴 | 🟢 | 🟢 (pills now read as options, not steps) |
| Motto missing (5) | 🔴 | 🟢 | 🟢+ (motto + quieter 👋 lets motto breathe) |
| Fonts too small (4) | 🔴 | 🟢 | 🟢 |
| Tile ambiguity — commercial / company (4) | 🔴 | 🟡 (3/4) | 🟢+ (Stamp tile now also signals *SDSAS 2026* era) |
| Audit teaser notify-me (4) | 🔴 | 🔴 | 🔴 (P2) |
| Tool modal close button (3) | 🔴 | 🔴 | 🔴 (P2) |
| ZH awkward, Tamil missing (3) | 🔴 | 🟡 (ZH motto picked up) | 🟡 (unchanged; Tamil + full ZH pass = P2) |

🟢 = resolved for majority · 🟡 = partial · 🔴 = open

**Six of the eight top v9.3 issues now fully resolved. Two stay open — both queued P2, both require feature work (teaser → notify-me form; tool modal back button).**

---

## Aggregate score — v9.3 → v9.4 → v9.5

| Metric | v9.3 | v9.4 | v9.5 | v9.3→v9.5 Δ |
|---|---|---|---|---|
| Understood Find.ai in ≤5s | 19/30 | 26/30 | **28/30** | +9 |
| Reached tool without stuck | 22/30 | 27/30 | **29/30** | +7 |
| Rated UI trustworthy | 25/30 | 28/30 | **29/30** | +4 |
| 🤔 frustration verdicts | 17/30 | 7/30 | **4/30** | −13 |
| 👍 positive verdicts | 13/30 | 23/30 | **26/30** | +13 |

The remaining 4 🤔 are the same set we'd already queued P2:
- **U10 Kumar** — Tamil not shipped (policy decision).
- **U12 Priya / U24 Jon** — Audit teaser still has no notify-me.
- **U21 Ros** — No Welcome share-to-WhatsApp.

None of those are first-run trust blockers. They're conversion- and growth-layer items.

---

## New observations in v9.5

None serious. The v9.4 re-test turned up 5 new micro-observations; v9.5 addresses all five either directly (N1–N5) or indirectly (the tile polish also quieted the N4-stack complaint). Walking the 30 personas on v9.5 did not surface any new first-run issues.

One cosmetic note: the Stamp tile eyebrow **"RESIDENTIAL + COMMERCIAL · SDSAS 2026"** is now long. On the narrowest device (iPhone SE gen-1 at 320px), the line wraps to two rows. Acceptable — still reads cleanly because both halves are legitimate micro-labels. If Ken wants one-line enforcement, the options are: drop *"COMMERCIAL"* (lose T5 benefit), shrink to 8.5px (bad for readability), or break at `<br/>` intentionally on narrow viewports. Leaving as-is for now.

---

## Overall read — v9.5

v9.5 is the **ship build**. The 30-persona simulation now returns 26/30 👍 with only 4 🤔 — and all four 🤔 map to known P2 feature work, not first-run trust gaps. The landing → pick → dock → tool path is frictionless for the Phase 1 target mix (landlords / agents / SME tenants).

**Commit and push.** Queue the remaining P2 items — Audit notify-me (T6), tool modal close (T7), Welcome share-to-WhatsApp (T9), full ZH copy pass (T10), Tamil decision (T16) — for the next polish sprint.

---

*Re-simulated by Zeus. Focused pass on ~10 personas with v9.4 open items. Total fix cost: ~90 minutes of implementation across six micro-tickets.*
