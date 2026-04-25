# Tenant Consent Form — Find.ai Trust Score

> **⚠️ STATUS: SKELETON DRAFT FOR LAWYER REVIEW.** Designed for in-app display before any tenant data is uploaded. Sections marked `[Lawyer to fill]` need PDPA-compliant legal language.
>
> Last updated: 2026-04-25 (v3.4.5 skeleton)

---

## In-app consent screen (proposed flow)

When a landlord initiates a Tenant Credit Score, before the tenant provides any data (LHDN cert, bills, IC), the tenant sees this screen on their device:

---

### [SCREEN START]

**Find.ai Tenant Verification — your consent**

Your prospective landlord [Landlord Name] is asking Find.ai to verify your previous tenancy and paying behaviour for the property at [Property Address].

**Find.ai will ask you for:**
1. Your IC (or passport) for identity verification
2. Your previous LHDN tenancy stamp certificate (optional — you can skip)
3. Up to 3 utility bills (TNB, water, mobile postpaid) — at least 1 required
4. A live selfie for biometric verification (silver tier identity)

**Find.ai will:**
- Cross-check your LHDN cert against the official LHDN STAMPS portal
- Extract payment timing data from your utility bills
- Compute a Trust Score and generate a Trust Card
- Share the result with [Landlord Name] only

**Find.ai will NOT:**
- Access your bank account
- Pull from CCRIS, CTOS, or other credit bureaus
- Share your data with anyone other than [Landlord Name] and our security-cleared staff
- Sell or commercialize your personal data

**Your data is:**
- Encrypted in transit (TLS) and at rest (AES-256)
- Retained for 12 months after the tenancy ends, then auto-deleted
- Yours to access, correct, or delete at any time (PDPA 2010 rights)

**You can:**
- Skip any step — Find.ai is a support tool, you control what's shared
- Withdraw consent at any time by emailing dpo@find.ai
- Use Find.ai for future tenancies — your verified profile is portable

By tapping "I consent" below, you confirm:
1. You are 18 or older
2. You have read and understood the above
3. You consent to Find.ai processing your personal data for the specific purpose of this rental application
4. You consent to Find.ai sharing the Trust Score result with [Landlord Name]
5. You acknowledge that the Trust Score is a support tool and the rental decision rests with the landlord

[ I consent — proceed ]      [ Cancel — exit Find.ai ]

📋 **Read full Privacy Policy:** [link]
📋 **Read full Terms of Use:** [link]

### [SCREEN END]

---

## Audit trail

When tenant taps "I consent", Find.ai records:
- Tenant IC last 4 (cross-referenced with verified IC)
- Timestamp + IP address
- Consent version (e.g. "v1.0 — 2026-04-25")
- Landlord case reference

This consent record is retained for 7 years (legal recordkeeping standard) even if the tenant data itself is deleted earlier.

---

## Withdrawal of consent

A tenant can withdraw consent at any time by:
1. Tapping "Withdraw consent" in the Find.ai tenant settings, OR
2. Emailing dpo@find.ai with subject "Withdraw Consent — [Case Ref]"

Within 21 days of withdrawal:
- All tenant evidence files are deleted
- The associated Trust Score / Trust Card record is anonymized in the screening landlord's history
- The screening landlord is notified that the tenant has withdrawn (without details)
- Audit trail of consent + withdrawal is retained for legal recordkeeping

**[Lawyer to fill — exact PDPA Section 38 withdrawal mechanics, retention exceptions, notification obligations]**

---

## Multi-language requirement

The consent screen must be available in:
- English (default)
- Bahasa Malaysia
- Mandarin Chinese (中文)

The tenant taps the language toggle at the top of the screen. Consent is captured in the language the tenant selected at the moment of tapping "I consent."

**[Lawyer to fill — equivalent legal weight across language versions, conflict resolution clause]**

---

## Tier-specific consent variations

### Silver tier (IC photo + selfie liveness)

Additional consent required for biometric data:
- "I consent to Find.ai using my live selfie for biometric face match against my IC photo. The biometric template is hashed and stored only for re-verification purposes."

### Gold tier (MyDigital ID OAuth)

Additional consent required for government data sharing:
- "I authorize JPN to share my verified identity (name, IC, DOB, address) with Find.ai via MyDigital ID OAuth, for the limited purpose of this tenancy verification."

**[Lawyer to fill — biometric data special category compliance, JPN consent requirements, MyDigital ID terms alignment]**

---

## Special cases

### Foreign tenant (passport instead of IC)

Modified consent line: "Your passport is verified by [verification method]. Find.ai retains the passport image for 12 months post-tenancy."

### First-time renter (no LHDN cert)

Modified consent line: "You are skipping LHDN verification. Find.ai will note this in the Trust Card so the landlord knows the verification limitation."

### Co-applicants (joint tenancy)

Each co-applicant provides separate consent. Trust Score is computed per-applicant; landlord sees both.

---

## Consent text — short form (for SMS/WhatsApp invite link)

When the landlord sends the screening invite via SMS/WhatsApp, the message includes:

> "You're being asked to verify with Find.ai for [Property Address] by [Landlord Name]. Your data stays private to this rental application. Tap to read full consent: [link]. Reply STOP to decline."

**[Lawyer to fill — consent capture via short-form acceptance, opt-out mechanism, link to full consent screen]**

---

## Document version

- v1.0 — 2026-04-25 — SKELETON DRAFT (NOT LEGALLY BINDING). Awaits Malaysian lawyer review.

## Lawyer review priorities

1. Consent specificity per PDPA Section 6
2. Withdrawal of consent mechanics per PDPA Section 38
3. Biometric data special-category handling
4. Multi-language equivalent legal weight
5. JPN MyDigital ID consent integration
6. Audit trail retention (consent vs data)
7. Short-form SMS/WhatsApp consent validity
