# Pilot — Tenant Trust Score (v0 mock)

> Working folder for pilot recruitment + execution.
> See `../PILOT_RECRUITMENT_PLAN.md` for the full strategy.

## Folder structure

```
pilot/
├── README.md                  ← this file
├── tracking.xlsx              ← Ken's pilot tracking spreadsheet (you drop this in)
├── responses/                 ← Google Forms CSV exports + analysis
│   └── README.md
└── notes/                     ← Free-form notes per pilot (calls, follow-ups)
    └── README.md
```

## How Zeus reads from this folder

Drop your tracking spreadsheet anywhere in `pilot/` (recommend the root) and Zeus can:

- **Read the whole sheet:** `Read tool on tracking.xlsx` via the xlsx skill, or `python pandas` in bash
- **Filter by status:** "show me pilots in Confirmed but not Demo Done state"
- **Analyze responses:** when Google Forms CSV exports land in `pilot/responses/`, Zeus can aggregate
- **Generate weekly status reports:** "summary of where each pilot is, what's blocked"
- **Cross-reference with notes:** "for pilots who completed feedback, surface the call notes from `pilot/notes/`"

## Recommended `tracking.xlsx` columns

(Match the template inside `PILOT_RECRUITMENT_PLAN.md` — copy these as your column headers.)

| # | Column | Type | Example |
|---|---|---|---|
| 1 | ID | number | 1, 2, 3... |
| 2 | Name | text | Ahmad Ibrahim |
| 3 | Role | text | Landlord (3 units) |
| 4 | State | text | KL |
| 5 | Lang | text | EN / BM / ZH |
| 6 | Channel | text | Warm / FB / Telegram / LinkedIn / MIEA |
| 7 | Phone or Email | text | +60... or @... |
| 8 | Reached out (date) | date | 2026-04-26 |
| 9 | Reply received (date) | date | 2026-04-27 |
| 10 | Confirmed | yes/no | yes |
| 11 | Onboarding sent (date) | date | 2026-04-27 |
| 12 | Demo done | yes/no | yes |
| 13 | Demo channel | text | Self-serve / Guided call |
| 14 | Feedback received | yes/no | yes |
| 15 | NPS (0-10) | number | 9 |
| 16 | Use intent | text | Yes / Probably / Maybe / No |
| 17 | Price tolerance | text | RM10-30 / Free / etc. |
| 18 | Top liked | text | "Trust Card looks like a real ID" |
| 19 | Top friction | text | "Didn't get LHDN cert concept at first" |
| 20 | Notes link | text | notes/01-ahmad.md |
| 21 | Status | text | Pending / Reached / Confirmed / Demo / Done / Dropped |

## When Ken says "check the spreadsheet" or "where are we on pilots"

Zeus will:
1. Read `tracking.xlsx` (xlsx skill)
2. Aggregate by Status column → show counts (e.g. "12 reached, 8 confirmed, 5 demos done, 3 feedback received")
3. Surface bottlenecks (e.g. "5 confirmed but not yet demoed for 5+ days")
4. Cross-reference with response files in `pilot/responses/` if any

## When pilots submit Google Form

Two ways to feed responses to Zeus:

**Option A (manual):** Periodically export Google Form responses as CSV → drop into `pilot/responses/responses-YYYY-MM-DD.csv` → Zeus reads + analyzes.

**Option B (link):** Connect Google Sheets to Find.ai workspace folder (Sheets → File → Download as CSV → save to `pilot/responses/`) — same as A but slightly more frequent.

## Document version

- v1.0 — 2026-04-25 (v3.4.6) — Initial folder setup.
