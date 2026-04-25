# pilot/responses/

CSV exports from Google Forms feedback responses.

## Naming convention

`responses-YYYY-MM-DD.csv` — one file per export date.

Example: `responses-2026-05-02.csv` (export taken on May 2, 2026).

## How to export from Google Forms

1. Open your Google Form
2. Click "Responses" tab
3. Click the green Sheets icon (top-right) to open responses in Sheets
4. In Sheets: **File → Download → Comma-separated values (.csv)**
5. Drop the file here, rename to match the convention above

## How Zeus reads these

- Reads the CSV directly via `Read` tool
- Aggregates: count responses per question, compute NPS, identify common open-text themes
- Cross-references with `tracking.xlsx` to map responses back to pilot personas

## Privacy note

These files contain pilot landlord personal data (email if they opted in, free-text feedback). Do NOT commit them to public git unless anonymized. The find.ai repo is currently private (`KenTan-malaysia/find.ai`) so this is OK, but be careful before any open-sourcing.
