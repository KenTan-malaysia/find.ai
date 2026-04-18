---
name: blast
description: >
  WhatsApp blast workflow for Ken Tan | Gather Properties | REN 31548.
  Use this skill whenever Ken uploads a landlord master list, says "blast",
  "morning blast", "evening blast", "run blast", "prepare blast", "send to landlords",
  "landlord outreach", "blast list", or "follow-up blast".
  This skill handles the complete end-to-end blast session:
  filter contacts from master list → detect property type and language →
  generate personalised WhatsApp messages → produce Blast Ready Report →
  wait for Ken's approval → update Excel tracker → capture landlord replies →
  score leads (Hot / Warm / Cold) → deliver End of Day Report.
  Always use this skill for any blast-related task. Never skip the approval gate.
---

# Blast Skill — Gather Properties

Ken runs two WhatsApp blasts per day (morning 9AM, evening 7PM) to generate landlord leads.
This skill runs the complete blast session from start to finish.

Read `references/templates.md` for all message templates before generating any messages.

---

## TWO OPERATING MODES

This skill operates in two modes depending on what is connected.

**Mode 1 — Manual (current):**
Ken pastes landlord replies directly into the chat. I extract the data, log it into Lead Capture Excel, score the lead, and alert Ken immediately if it is Hot. Ken exports data from Seampify dashboard if needed and passes it to me.

**Mode 2 — API (once Seampify WhatsApp API is connected):**
Replies come in automatically via Gmail notifications from Seampify. I detect each reply as it arrives, extract the data, log it into Lead Capture Excel, and send Ken an immediate WhatsApp alert for Hot leads — without Ken needing to do anything. Daily EOD report is generated and sent automatically after the evening blast.

The workflow steps below apply to both modes. The only difference is how replies arrive — paste vs automatic.

---

---

## THE BLAST FLOW

```
Ken uploads master list
        ↓
Filter contacts (Step 1)
        ↓
Detect property type + language per contact (Step 2)
        ↓
Generate personalised messages (Step 3)
        ↓
Show Blast Ready Report — wait for Ken's approval (Step 4)
        ↓
Ken approves → update Excel tracker (Step 5)
        ↓
Monitor replies → capture leads → score Hot/Warm/Cold (Step 6)
        ↓
End of Day Report (Step 7)
```

---

## STEP 1 — FILTER CONTACTS

Read the master list and apply these rules before touching anything else.

### What to include
| Status / Tag | Action |
|---|---|
| Blank / untagged | Include — ready to blast |
| rent | Include — landlord has indicated rental interest |
| sale | Include — landlord has indicated sale interest |

### What to exclude
| Status / Tag | Action |
|---|---|
| own stay | Exclude — owner occupying the unit |
| rented | Exclude — unit already tenanted |
| no | Exclude — landlord not interested |
| send | Exclude — already blasted previously |
| Sent | Exclude — already blasted this cycle |
| Replied | Exclude — already a lead, handle separately |
| Duplicate | Exclude — never blast duplicates |
| Do Not Contact | Exclude — permanent exclusion |

### How to extract contact details
- **Name**: From the Name column directly
- **Unit number**: Extract from the START of the Address column — e.g. "T1-01-01, Lakefront Residence..." → Unit = T1-01-01
- **Contact**: Use Tel1 first. If Tel1 is empty, use Tel2. If both are populated, include both.

---

## STEP 2 — DETECT PROPERTY TYPE AND LANGUAGE

Do this for every contact in the filtered list. Read the Address column.

### Property type detection
| Address clue | Property type | Template to use |
|---|---|---|
| Unit starts with T, N, Level, Floor, #, Suite, Residence, Condominium | Condo / Apartment | Template A |
| Address contains Jalan, Lorong, Taman + house number | Landed | Template B |
| Address contains Lot, Industrial, Factory, Warehouse, Perindustrian | Industrial | Template C |
| Address contains Kedai, Shoplot, Ground Floor (commercial) | Commercial | Template D |
| Unclear or does not match above | Flag to Ken — do not guess | — |

### Language detection (from landlord name)
| Name pattern | Language | Template |
|---|---|---|
| Malay names — Ahmad, Muhammad, Siti, Nur, Abdul, Mohd, Farah, Haziq, etc. | Malay | Template E (replaces A/B/C/D) |
| Chinese names — Tan, Lim, Lee, Wong, Chong, Ng, Khor, Chan, etc. | English | Template A/B/C/D |
| Indian names — Kumar, Raj, Muthu, Siva, Priya, Anbu, etc. | English | Template A/B/C/D |
| Unclear | English (default) | Template A/B/C/D |

Note: Template E covers all property types for Malay landlords. Use E whenever the name is Malay regardless of property type.

---

## STEP 3 — GENERATE PERSONALISED MESSAGES

Read `references/templates.md` for the exact wording of each template.

Every message must be personalised — never send a generic blast.
- Always include the landlord's name
- Always include the unit number
- Never use repeated identical emojis
- Never mention "broadcast list", "WhatsApp list", or "add you to my list"
- No markdown — no asterisks, hashtags, or dashes
- Maximum 5 lines per message — readable on mobile
- Always end with: Ken Tan | Gather Properties | REN 31548 | 016-713 5601

---

## STEP 4 — BLAST READY REPORT + APPROVAL GATE

Before sending a single message, show Ken this report and wait for his explicit approval.
Never send without "approved", "ok", "yes", or equivalent confirmation from Ken.

```
Blast Ready Report — [Date] [Morning / Evening]

Total in master list: [X]
Filtered out (sent / own stay / rented / no / duplicate): [X]
Ready to blast today: [X]

Breakdown by property type:
- Condo / Apartment: [X] contacts
- Landed: [X] contacts
- Industrial: [X] contacts
- Commercial: [X] contacts
- Malay template: [X] contacts
- Unclassified (needs review): [X] contacts

Sample messages for review:

CONDO — [X] contacts:
Hi [Name], I am Ken from Gather Properties...

LANDED — [X] contacts:
Hi [Name], I am Ken from Gather Properties...

[Show one sample per template type used]

Reply APPROVED to send, or tell me what to change.
```

If Ken edits a template — update and show the revised version before sending.

---

## STEP 5 — AFTER APPROVAL: UPDATE EXCEL TRACKER

After Ken approves, update the Blast Tracker Excel (two sheets):

**Sheet 1 — Blast Tracker:**
| Column | Update |
|---|---|
| No. | Sequential number |
| Landlord Name | From master list |
| Unit | Extracted unit number |
| Contact | Tel1 / Tel2 as per extraction rule |
| Blast Status | Pending → Sent |
| Blast Date | Today's date |
| Template Used | A / B / C / D / E |
| Reminder | Leave blank — filled when follow-up needed |

**Sheet 2 — Lead Capture:**
Leave blank — filled automatically when replies come in.

Also log the session in `blast_performance_log.xlsx`:
- Date, session (morning / evening), project name, template used, total contacts blasted.

---

## STEP 6 — REPLY CAPTURE AND LEAD SCORING

When a landlord replies, act immediately — do not wait for end of day.

### Keyword detection — scan every reply for these

| Keyword | Maps to |
|---|---|
| rent, rental, per month, RM, monthly | Rental Price |
| sell, sale, selling, asking | Selling Price |
| available, vacant, ready, from, move in | Available Date |
| furnished, partial, unfurnished, bare, aircond | Furnished |
| room, bedroom, br, bilik | Rooms |
| condo, apartment, terrace, semi-d, bungalow, factory, warehouse | Property Type |
| project name, located at, unit at | Project / Condo Name |
| not available, owner stay, already rented | Dead Lead |
| wrong number, not me, who is this | Do Not Contact |

### Lead quality scoring — act on this immediately

| Score | Criteria | Action |
|---|---|---|
| Hot | Replies with price + available date + furnishing info | Alert Ken immediately — do not wait for EOD |
| Warm | Replies with some details but incomplete | Log and include in EOD report |
| Cold | Replies "not available", "owner stay", "already rented" | Update status to Dead Lead |
| Wrong number | Indicates wrong person | Update status to Do Not Contact |

### Hot lead alert — send to Ken immediately
```
HOT LEAD — [Time]

Landlord: [Name] | [Contact]
Unit: [Unit] | [Project]
Rent: RM[X] | Sale: RM[X]
Furnished: [Condition]
Available: [Date]
Remark: [Any extra detail]

Reply came in [X] minutes after blast.
```

### Log all replies into Lead Capture Excel (Sheet 2)
Columns: Landlord Name | Contact | Project | Area | Rooms | Furnished | Available Date | Rental Price | Selling Price | Remark | Status

Update Blast Tracker Sheet 1: Status → Replied.
Data protection rule: Add new rows freely. Never edit or delete existing rows without Ken's explicit approval.

---

## STEP 7 — END OF DAY REPORT

Send after the evening blast and all replies are captured.
Deliver two things: WhatsApp summary (copy-paste ready) + confirm Excel is updated.

```
End of Day Report | [Date]

Morning Blast: [X] sent | [X] replied | [X] leads captured
Evening Blast: [X] sent | [X] replied | [X] leads captured
Total Today: [X] blasted | [X] replied | Reply rate: [X]%

HOT LEADS ([X]):
1. [Name] | [Unit] | [Project] | RM[X] | [Furnished] | Avail: [Date]
2. [Name] | [Unit] | [Project] | RM[X] | [Furnished] | Avail: [Date]

WARM LEADS ([X]):
1. [Name] | [Unit] | [Project] | Incomplete details — follow up needed

DEAD LEADS ([X]):
[X] contacts marked as not available / owner stay / wrong number

Lead Capture Excel updated. blast_performance_log.xlsx updated.
```

---

## FOLLOW-UP BLAST

Follow-up blasts are NEVER automatic. Only when Ken explicitly asks.

When Ken triggers a follow-up:
1. Ken specifies which contacts or how far back
2. Draft a fresh message — warmer and softer than the original, never a copy
3. Show Ken the draft and wait for approval
4. Send after approval — log follow-up date in Blast Tracker

See `references/templates.md` for follow-up templates (English and Malay).

---

## RULES — NEVER BREAK THESE

1. Never blast without Ken's approval — no exceptions
2. Never send duplicate contacts — check master list before every session
3. Never repeat the same message to the same contact within 30 days
4. Never mention "broadcast list", "WhatsApp list", or "add to list"
5. Never use repeated identical emojis
6. Always personalise with name and unit — never generic
7. Always update Blast Tracker after every session
8. Always log every session in blast_performance_log.xlsx
9. Hot leads flagged to Ken immediately — not at end of day
10. Add to Excel only — never edit or delete existing data without Ken's approval

---

## SESSION CHECKLIST

Before every blast session:
- [ ] Filter master list — identify contacts ready to blast
- [ ] Detect property type for each contact
- [ ] Detect language from name
- [ ] Generate personalised messages per template
- [ ] Prepare and show Blast Ready Report
- [ ] Wait for Ken's approval

After blast:
- [ ] Update Blast Tracker: Pending → Sent + blast date + template used
- [ ] Log session in blast_performance_log.xlsx
- [ ] Monitor for replies — flag hot leads immediately

After evening blast + replies captured:
- [ ] Log all replies into Lead Capture Excel
- [ ] Update Blast Tracker status for all replies
- [ ] Generate and send End of Day Report to Ken
