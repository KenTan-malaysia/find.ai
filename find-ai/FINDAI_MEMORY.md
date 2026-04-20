# FIND.AI — COMPRESSED MEMORY
> Single-file project snapshot. Upload this to any new session for instant full context. Last updated: 2026-04-20 (Stage 1 strip).

---

## 1. IDENTITY

- **Name:** Find.ai (formerly Unbelievebe, rebranded v2.0)
- **What:** Malaysian PropTech compliance + advisory platform. **Stage 1 focus (current): chatbox only — landlords & tenants.** Enterprise verification modules deferred until chatbox is solid.
- **Not:** a chatbot / listing site / CRM. It's a compliance-first risk-mitigation tool.
- **Owner/decision-maker:** Ken (tankenyap95@gmail.com). "Zeus" = Claude's role name in Ken's workflow.
- **Live URL:** https://find-ai-lovat.vercel.app
- **Repo:** https://github.com/KenTan-malaysia/find.ai
- **Deploy flow:** Zeus edits code → Ken pushes → Vercel auto-deploys (free tier)
- **Domain TBD:** `find.ai`
- **Local path (Ken's machine):** `C:\Users\Tan Ken Yap\Documents\data collection\OneDrive\Desktop\Claude\find-ai`

---

## 2. TECH STACK

- Next.js 14 (App Router) | React 18 | Tailwind CSS 3.4 | `@anthropic-ai/sdk` ^0.39.0
- State: localStorage only (no DB)
- Languages: EN / BM / 中文 (3-way cycle)
- API key: `ANTHROPIC_API_KEY` in Vercel env vars and `.env.local`

---

## 3. FILE MAP (Stage 1 — chatbox only)

```
find-ai/
├── src/
│   ├── app/
│   │   ├── page.js              ~1625 lines — main chat UI + history sidebar + profile onboarding (verification code stripped)
│   │   ├── landing.js           ~237 lines — consumer landing (hero, stats, features, problems, CTA)
│   │   ├── calculators.js       STUB — hub removed in Stage 1
│   │   ├── layout.js            Root layout, PWA manifest, service worker registration
│   │   ├── globals.css          Global styles
│   │   └── api/
│   │       ├── chat/route.js            233 lines — MAIN chat endpoint (streaming, knowledge-injected) [ACTIVE]
│   │       ├── chat/route_new.js        179 lines — DEAD FILE. Older Haiku version. Safe to delete.
│   │       ├── company-check/route.js   STUB — returns 410 Gone
│   │       ├── trust-score/route.js     STUB — returns 410 Gone
│   │       └── knowledge.js             583 lines — Topic-based knowledge base for chat [ACTIVE]
│   └── components/
│       ├── ErrorBoundary.js     Catches tool render errors
│       └── tools/
│           ├── CNMYTrustLink.js        STUB — verification deprecated in Stage 1
│           ├── MYCompanyCheck.js       STUB — verification deprecated in Stage 1
│           ├── LegalBridge.js          59KB — "Can I Do This" checker (disabled, code intact for later)
│           ├── SituationNavigator.js   21KB — 3 dispute flows (disabled, code intact)
│           ├── EvidenceVault.js        13KB — Evidence Vault UI (disabled, code intact)
│           ├── StampDutyCalc.js        5KB  — SDSAS calculator (disabled, code intact)
│           ├── RentalYieldCalc.js      4KB  — Yield calc (disabled, code intact)
│           ├── TenantScreen.js         11KB — Tenant screening (disabled, code intact)
│           ├── AgreementHealth.js      4KB  — Agreement health check (disabled, code intact)
│           ├── labels.js               35KB — EN/BM/ZH strings (still referenced by the 7 disabled tools above)
│           └── shared.js               CloseBtn etc.
├── references/                  Legal reference docs
├── sdsas_2026_calculator.py     Python verification + BNDS prefill (orphan but intact)
├── trust-score-engine.py        STUB
├── trust-score-schema.json      STUB
├── legal-bridge-*.html          3 preview HTML files (standalone demos — orphan)
├── package.json, next.config.js, tailwind.config.js, postcss.config.js
├── public/                      icons, manifest, sw.js
├── CLAUDE.md                    Original project brief (13KB, drift vs Stage 1)
└── FINDAI_MEMORY.md             THIS FILE
```

**What was removed in this session (2026-04-20):**
- `page.js` imports of `CNMYTrustLink`, `MYCompanyCheck`, `L` from labels → gone
- `showCN`, `showMY` state → gone
- `tl = L[lang]` constant → gone
- Company Scoring Cards UI block (🇲🇾 + 🇨🇳 hero) → gone
- 🇲🇾 / 🇨🇳 quick buttons in input bar → gone
- Modal renders for showMY / showCN → gone
- `CNMYTrustLink.js`, `MYCompanyCheck.js`, `calculators.js` → replaced with 3-line stubs (sandbox can't hard-delete)
- `/api/company-check/route.js`, `/api/trust-score/route.js` → replaced with 410 Gone stubs
- `trust-score-engine.py`, `trust-score-schema.json` → replaced with stubs

---

## 4. MODULES — STATUS TABLE (post-strip)

| Module | Feature | Status | File(s) | Notes |
|---|---|---|---|---|
| A | SDSAS 2026 Stamp Duty | DORMANT | `StampDutyCalc.js`, `sdsas_2026_calculator.py` | Code intact. Not exposed in UI. Rate tiers RM1/3/5/7 per RM250 still need verification against Finance Act 2025 gazette before re-enable. |
| B | Digital Evidence Vault | DORMANT | `EvidenceVault.js` | UI component exists. Full SHA-256 + NTP + S.90A PDF flow unverified. |
| C | CN-MY Enterprise Trust Link | **REMOVED (Stage 1)** | stub | Was MVP. Pulled out to keep chatbox lean. Re-enable by replacing stub + re-adding page.js hooks. |
| D | Situation Navigator | DORMANT | `SituationNavigator.js` | 3 flows: rent default, deposit, eviction. Templates for LOD, deposit demand, notice to vacate. |
| E | "Can I Do This?" Compliance Checker | DORMANT | `LegalBridge.js` | 7 goals with license roadmaps, China Assumption Traps. |
| F | MY Company Check | **REMOVED (Stage 1)** | stub | Was SSM-based scoring. Pulled with Trust Link. |
| Q&A | Consumer Chatbox | **ACTIVE** | `page.js`, `api/chat/route.js`, `knowledge.js` | All Phase 1 shipped. See Section 5. This is the ONLY live surface in Stage 1. |

**Stage 1 rule:** Only the chatbox is exposed. All other tool code is dormant but preserved for later re-enable.

---

## 5. CHATBOX INTERNALS

### 5a. Frontend (`page.js`)

- **Flow states:** `!showChat && !showProfile` → `<Landing>` | `showProfile` → profile onboarding | `showChat` → chat
- **Key hooks (after strip):** messages, input, loading, listening, lang, showChat, showProfile, profile, hasSavedChat, ready, suggestions, copied, lastFailedMsg, feedbackMap, showFeedbackToast, installPrompt, showInstallBanner, chatHistory, activeChatId, showSidebar, historySearch. (showCN/showMY removed.)
- **Refs:** chatRef, inputRef, recRef (speech), streamRef, streamContentRef, userScrolledRef.
- **Persistence keys (localStorage):**
  - `fi_lang` — EN/BM/ZH
  - `fi_profile` — {role, state, type, rent}
  - `fi_feedback` — per-message thumbs
  - `fi_feedback_stats` — aggregate {up, down, topics}
  - `fi_chat_history` — array of chats [{id, title, messages, createdAt, updatedAt}]
  - `fi_messages` — current chat
  - `fi_topic_history` — topic frequency count
  - `fi_session_count` — returning-user counter
  - `fi_install_dismissed` — PWA prompt dismissed flag
- **Icon card rendering (`fmt()` ~line 266):** parses AI output and converts to styled HTML cards:
  - ⚖️ Law citation — blue card
  - ✅ Action steps (bold title + numbered) → interactive checklist with progress bar
  - 🚫 Warning — red pulsing card
  - 💰 Cost (bold title + "label: value" lines) → table; single-line → highlighted inline RM
  - 📋 Clause → copy-ready card with Copy button
  - 🔒 Verified source — green shield
  - ⚠️ General guidance — yellow
  - 🔴 Consult a lawyer — red
  - ⚡ Legal Bridge — red+blue gradient (China-law bridge)
- **Conversation memory:** if messages > 8, compress older (keep 6 recent), summarize as "User asked… → Answer: …" + extract ⚖️ law citations.
- **Smart context engine (`buildSmartContext`):** profile + time of day + top 5 topics + session count + feedback ratio → sent as `profileContext` to API.
- **Follow-ups:** AI wraps 3 suggestions in `[FOLLOWUPS]...[/FOLLOWUPS]`; stripped from display, rendered as chips.
- **Voice:** Web Speech API. lang-aware (ms-MY/zh-CN/en-MY).
- **Share:** WhatsApp `wa.me/?text=...`, strips markdown, caps at 2000 chars, appends URL.
- **Save:** exports full chat as standalone HTML file.

### 5b. Backend (`api/chat/route.js`)

- **Model:** `claude-sonnet-4-20250514` (!! conflicts with CLAUDE.md which says `claude-haiku-4-5-20251001`) — Ken to decide.
- **Max tokens:** 4000
- **Streaming:** SSE `data: {"text": "..."}\n\n` ending with `data: [DONE]`
- **System prompt structure (~150 lines):**
  1. Personality & tone
  2. Answer structure (icon rules)
  3. Answer rules (11 rules — lead with answer, one-Q-one-A, max 120 words simple / 200 complex, cite law, real numbers, stop when done, reply in user's language CONSISTENTLY, off-topic = one-line, prevention first, finish your answer, Chinese Law Bridge with ⚡, templates only when asked)
  4. Confidence tiers (🟢 GREEN → end with 🔒 Verified; 🟡 YELLOW → end with ⚠️ General guidance; 🔴 RED → end with 🔴 Consult lawyer + specific questions)
  5. `{{KNOWLEDGE}}` placeholder — injected from `knowledge.js`
  6. Follow-up format
  7. What you don't do
- **Knowledge injection:** `matchTopics()` keyword-scans last user msg + 3 prior → returns up to 3 topics → `buildKnowledge()` concatenates → prepended to system prompt. `ALWAYS_INCLUDE` (glossary + state rules) always appended.
- **Knowledge topics (16):** deposit, stamp_duty, eviction, rent_default, holdover, repair, rent_increase, subletting, tax, foreign, strata, subsale, developer, joint_ownership, renovation, noise, commercial, bankruptcy, general (fallback).
- **Profile + conversation memory:** appended to system prompt if present.
- **Error mapping:** 401 → invalid key | 429 → rate limit | 529/503 → overloaded | 408/ETIMEDOUT → timeout | ENOTFOUND/ECONNREFUSED → unreachable.

---

## 6. KNOWN BUGS / DRIFT (as of 2026-04-20, post-strip)

| # | Issue | Location | Severity |
|---|---|---|---|
| 1 | Model mismatch — code uses `claude-sonnet-4-20250514`, memory says `claude-haiku-4-5-20251001`. Landing shows "Powered by Claude Sonnet" badge. | `api/chat/route.js` | Medium — Ken to decide |
| 2 | Dead file: `api/chat/route_new.js` — older Haiku version, confusing. | `api/chat/route_new.js` | Low — delete |
| 3 | Mic button always renders even when browser lacks SpeechRecognition. `recRef.current !== undefined` is `true` for `null`. Button becomes dead click. | `page.js` (input bar) | Medium UX bug |
| 4 | Knowledge base still describes "First RM2,400: Exempt" in stamp duty example — contradicts 2026 rules (no exemption). | `api/chat/route.js` SYSTEM_PROMPT example | Medium — can mislead AI |
| 5 | SDSAS rate tiers (RM1/3/5/7 per RM250) unverified vs gazetted Finance Act 2025 — dormant for Stage 1 but re-check before re-enable. | dormant files | High-risk if wrong when re-enabled |
| 6 | 7 dormant tool components still in repo (LegalBridge, SituationNavigator, EvidenceVault, StampDuty, Yield, TenantScreen, AgreementHealth). Not loaded at runtime but count against future-session token reads. | `src/components/tools/` | Low — decide later whether to stub/keep |

---

## 7. DESIGN & UX RULES

- **Aesthetic:** "Mature Minimalism" — bank-level trust, NOT startup green. Deep navies (#0f172a, #1e293b), charcoal greys, crisp white space.
- **Thumb zone:** high-stakes buttons at bottom (one-handed pro use).
- **Security icons:** shield motifs throughout.
- **Answer format in chat:** icon-based, scannable, no essays, no follow-up questions at bottom of AI reply (except the wrapped [FOLLOWUPS] block).
- **Languages:** EN/BM/中文 parity for ALL new UI text.
- **PWA:** manifest + service worker for install.

---

## 8. STRATEGIC BLUEPRINT ("The Compliance Shield")

- **Core:** Risk Mitigation Engine, not a property app.
- **3-Phase Trojan Horse:**
  1. **Tool** — SDSAS solves tax headache → users enter ecosystem
  2. **Manager** — Evidence Vault stores photos/leases → switching cost lock-in
  3. **Giant** — marketplace pivot, auto-list on lease expiry
- **Stage 1 re-scoped (2026-04-20):** Before Phase 1 tools, prove chatbox value for landlords & tenants. Verification & compliance modules return in Phase 2 once chatbox is solid.
- **End game (end of 2026):** only platform where Shanghai tenant finds Pre-Verified Penang factory. Compliance Score for landlords, Trust Grade for tenants. Closed-loop high-trust marketplace = most valuable SEA real estate dataset.
- **Moat:** compliance tools (SDSAS, S.90A), CN-MY corridor.
- **Competition:** PropertyGuru head-on = no. Infiltrate with utility, expand to marketplace.

---

## 9. KEY LEGAL REFERENCES (used in knowledge base)

Stamp Act 1949 (First Schedule Item 32(a)), Finance Act 2025 (SDSAS), Contracts Act 1950, Distress Act 1951, Specific Relief Act 1950 (s.7, s.8), Evidence Act 1950 (s.90A), NLC 1965 (s.124, s.145, s.213, s.433B), Sabah Land Ordinance Cap.68, Sarawak Land Code Cap.81, STA 1985, SMA 2013 (s.33, s.93), HDA 1966 (Schedule G/H), PDPA 2010, China PIPL, Civil Law Act s.28(4), Penal Code s.441/s.427-430, Income Tax Act 1967 s.4(d)/s.91/s.113(2).

---

## 10. DEV RULES & KEN'S PREFERENCES

- **Token efficiency:** only load relevant files. Never load entire context unless needed.
- **One question = one file max** unless genuinely multi-file.
- **Ken decides everything.** Never assume approval.
- **"find.ai"** = work from this folder only.
- **Memory discipline:** when Ken says "save", regenerate THIS file with latest state. Ken reopens session → uploads this file → instant full context. No need to re-read codebase.
- **Language parity:** EN/BM/中文 for all new UI.
- **No follow-up questions** in AI chat replies (except bracketed block).
- **Ken's tone:** direct. Doesn't want verbose explanations.

---

## 11. VERSION HISTORY

- **v1.0** — Unbelievebe: landlord Q&A chatbot
- **v1.1** — calculators, voice, BM, 中文, profiles, session memory
- **v2.0** — Rebranded Find.ai, SDSAS 2026, multi-module restructure
- **v2.1 (2026-04-20)** — Stage 1 strip: verification modules (CN-MY Trust Link, MY Company Check) removed from active UI. Chatbox-only focus.

---

## 12. LAST SESSION STATE (2026-04-20)

- Ken: "lets only focus on chatbox and remove the verification link code, so everytime when you running thru save lot of token as well"
- Executed the strip:
  - `page.js` cleaned: imports, state, hub buttons, input-bar quick buttons, modal mounts all removed
  - `CNMYTrustLink.js`, `MYCompanyCheck.js`, `calculators.js` → 3-line stubs (sandbox rm denied)
  - `/api/company-check/route.js`, `/api/trust-score/route.js` → 410 Gone stubs
  - `trust-score-engine.py`, `trust-score-schema.json` → stubs
- Grep confirms no live references to deleted components/routes remain outside the stubs themselves.
- No commits/pushes made yet — Ken pushes manually.

**NEXT:**
1. Ken pushes to GitHub; confirm Vercel rebuild is green.
2. Ken decides whether to also stub the other 7 dormant tool components + dead `route_new.js` for further token savings.
3. Open bugs 1-4 in Section 6 still pending pick.

---

## 13. QUICK-START FOR NEXT SESSION

When Ken opens new session and uploads this file:
1. Read this file end-to-end.
2. Ask Ken: "Resuming Find.ai — Stage 1 chatbox-only. Pick up from pending bugs (Section 6) or new task?"
3. Only `request_cowork_directory` to the find-ai path if Ken asks to edit code.
4. Never re-scan the full codebase unless this file is clearly stale or Ken asks.
