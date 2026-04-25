# Privacy Policy — Find.ai

> **⚠️ STATUS: SKELETON DRAFT FOR LAWYER REVIEW.** Not legally binding in current form. Sections marked `[Lawyer to fill]` need Malaysian-licensed legal language compliant with PDPA 2010 and (if applicable to cross-border tenants) China PIPL and EU GDPR.
>
> Last updated: 2026-04-25 (v3.4.5 skeleton)
> Effective date: TBD (post-lawyer-review)
> Operator: Find.ai Sdn. Bhd. (Malaysia) [TBD]
> Personal Data Protection Act 2010 (Malaysia) compliant.

---

## 1. Who we are

Find.ai is a Malaysian property compliance toolkit operated by Find.ai Sdn. Bhd. (the "Operator", "we", "us"). We are subject to the Personal Data Protection Act 2010 (PDPA 2010) of Malaysia.

**Data Protection Officer (DPO):** dpo@find.ai
**Operator address:** [TBD]
**Operator registered number:** [TBD]

---

## 2. What personal data we collect

### 2.1 Identity data
- Full name (per MyKad / passport)
- IC number (or passport number for foreign tenants)
- Date of birth
- Verified address (from MyDigital ID or IC photo)
- Selfie photo for liveness check (silver tier verification)
- Phone number
- Email address

### 2.2 Tenancy data
- LHDN stamp certificate number (for cross-verification with LHDN STAMPS portal)
- Previous tenancy details extracted from LHDN cert: address, period, landlord name
- Property address (current screening case)

### 2.3 Utility evidence
- Utility bill PDFs / images (TNB, water, mobile postpaid)
- Account numbers (for guest enquiry deep-link only)
- Extracted bill data: payment dates, amounts, due dates, outstanding balances, late charges, disconnection notices

### 2.4 Service usage data
- Login timestamps + IP addresses
- Tools used (Screen / Audit / Stamp / Chat)
- Case files created
- Chat messages with the chatbot

**[Lawyer to fill — full enumeration of data categories per PDPA Section 2 definitions, sensitive personal data flagging (biometric / financial)]**

---

## 3. How we collect data

| Source | Data |
|---|---|
| Direct from user | Name, IC, phone, email, uploaded documents |
| MyDigital ID OAuth (with consent) | Government-verified identity |
| LHDN STAMPS portal (with cert # + tenant consent) | Tenancy verification data |
| OCR processing of uploaded bills | Extracted bill fields |
| User browser / device | IP address, browser type, session data |

We do NOT collect data from:
- Bank accounts (we are not a payment app)
- CCRIS or CTOS (we don't pull credit bureau data)
- Utility company databases (no automated scraping)
- Social media profiles
- Third-party data brokers

---

## 4. Why we collect it (purposes)

### 4.1 Tenant screening (with tenant consent)
- Verify tenant identity
- Compute Trust Score for prospective landlord
- Generate Trust Card

### 4.2 Stamp duty calculation
- Compute SDSAS 2026 stamp duty
- Generate Tax Accuracy Certificate

### 4.3 Service operation
- Account authentication
- Customer support
- Fraud detection
- Service improvement (aggregated, anonymized)

### 4.4 Legal compliance
- PDPA 2010 record-keeping
- LHDN audit trail (for stamp duty cases)
- Anti-money-laundering checks (where applicable)

**[Lawyer to fill — explicit purpose limitation per PDPA Section 6, prohibition on incompatible purposes, data minimization principle]**

---

## 5. Tenant consent

Tenant data is processed only with **explicit, informed consent** captured at the screening session. The consent form (`legal/TENANT_CONSENT.md`) clearly states:

- What data is being collected
- Who will see it (the screening landlord, Find.ai security-cleared staff)
- How long it's retained (12 months post-tenancy by default)
- Tenant's right to withdraw consent or request deletion at any time

**[Lawyer to fill — PDPA Section 6 consent requirements, withdrawal of consent process, consequences of withdrawal]**

---

## 6. Who we share data with

We share personal data only with:

### 6.1 The screening landlord (with tenant consent)
- Trust Score, Behaviour Score, Confidence tier
- Per-utility summary (e.g. "TNB: 12 of 14 bills upfront")
- Verified identity (name, masked IC, MyDigital ID badge)
- Trust Card

### 6.2 Authorized processors
- OCR vendor (for bill data extraction) — under DPA
- Cloud hosting provider (Vercel, currently US-based — see cross-border transfer below)
- Payment processor (TBD if we add paid plans)

### 6.3 Government entities
- LHDN (when tenant initiates stamp cert verification — read-only)
- Law enforcement under valid court order or PDPA Section 39 lawful disclosure

### 6.4 Never shared
- Marketing partners
- Data brokers
- Third-party advertising
- Aggregated tenant profiles for sale

**[Lawyer to fill — cross-border data transfer compliance (Vercel US hosting requires PDPA Section 129 safeguards), processor / sub-processor list, DPA template]**

---

## 7. Cross-border data transfer

Find.ai uses Vercel (US-based) for hosting and Anthropic Claude API (US-based) for AI processing. Personal data may be transferred outside Malaysia for these purposes.

We ensure adequate safeguards through:
- Standard Contractual Clauses (SCCs) with Vercel + Anthropic
- Encryption in transit (TLS) and at rest (AES-256)
- Data minimization — only essential data sent to API providers

**[Lawyer to fill — full PDPA Section 129 compliance, alternatives to consent for transfer, country-specific safeguards]**

---

## 8. Data retention

| Data type | Retention period |
|---|---|
| Tenant evidence (bills, certs, IC) | 12 months after tenancy ends, OR earlier on tenant request |
| Trust Card / Trust Score record | 24 months for landlord audit trail, then aggregated/anonymized |
| Stamp duty case records | 7 years (LHDN audit requirement under Stamp Act 1949) |
| Chatbot conversations | 30 days for service improvement, then deleted |
| Account credentials | Until account deletion + 30 days |
| Aggregated/anonymized analytics | Indefinitely (no personal data) |

After retention period expires, data is securely deleted (cryptographic erasure for encrypted data).

**[Lawyer to fill — PDPA Section 10 retention principle, secure deletion methodology, data subject deletion rights]**

---

## 9. Your rights under PDPA 2010

You have the following rights regarding your personal data:

| Right | How to exercise |
|---|---|
| Access — request a copy of your data | Email dpo@find.ai with "Access Request" subject |
| Correction — fix inaccurate data | In-app settings OR email dpo@find.ai |
| Deletion — request data removal | In-app settings OR email dpo@find.ai (subject to legal retention requirements) |
| Withdraw consent | In-app settings OR email dpo@find.ai |
| Data portability — export your data | Email dpo@find.ai with "Portability Request" subject |
| Lodge complaint | Personal Data Protection Commissioner Malaysia: https://www.pdp.gov.my |

We respond to requests within 21 days as required by PDPA Section 30.

**[Lawyer to fill — full PDPA-compliant rights enumeration, fee schedule for excessive requests, refusal grounds, complaint escalation]**

---

## 10. Data security

We implement reasonable technical and organizational measures to protect personal data:

- **Encryption in transit:** TLS 1.3 for all client-server communication
- **Encryption at rest:** AES-256 for stored data
- **Access control:** Role-based access; only screening landlord + authorized Find.ai staff can view tenant evidence
- **Authentication:** MyDigital ID OAuth for gold tier; IC + biometric liveness for silver tier
- **Audit logging:** All data access logged for 24 months
- **Incident response:** Data breach notification within 72 hours per PDPA best practice
- **Staff training:** Annual PDPA + security training for all staff
- **Penetration testing:** Annual third-party security audit

**[Lawyer to fill — PDPA Section 9 security principle, breach notification obligations, ISO 27001 alignment if pursued]**

---

## 11. Cookies and tracking

Find.ai uses minimal cookies:

| Cookie type | Purpose | Duration |
|---|---|---|
| Strictly necessary | Authentication, session | Session only |
| Functional | Language preference, theme | 12 months |
| Analytics | Anonymized usage stats (no IP-tied tracking) | 30 days |

We do NOT use:
- Third-party advertising cookies
- Cross-site tracking
- Behavioral profiling for advertising

**[Lawyer to fill — full cookie consent banner language, opt-out mechanism, alignment with EU ePrivacy if EU users]**

---

## 12. Children's data

Find.ai is intended for users 18+. We do not knowingly collect data from minors. If we discover that we have collected data from a person under 18, we will delete it promptly.

---

## 13. Changes to this Privacy Policy

We may update this Privacy Policy. Material changes will be notified by email at least 14 days before they take effect.

---

## 14. Contact

- Data Protection Officer: dpo@find.ai
- General support: support@find.ai
- Operator: Find.ai Sdn. Bhd. [TBD address]

---

## Document version

- v1.0 — 2026-04-25 — SKELETON DRAFT (NOT LEGALLY BINDING). Awaits Malaysian lawyer review.

## Sections requiring lawyer attention (priority order)

1. Section 5 — Tenant consent + withdrawal mechanics (PDPA Section 6)
2. Section 7 — Cross-border data transfer (PDPA Section 129) — Vercel US hosting needs proper SCCs
3. Section 8 — Data retention policy (PDPA Section 10)
4. Section 9 — Data subject rights enumeration + response timing (PDPA Section 30)
5. Section 10 — Data security measures + breach notification
6. Section 6 — Processor list + DPA templates
7. Section 11 — Cookie consent (Malaysia + EU if relevant)

Recommend lawyer with PDPA + GDPR + cross-border data transfer experience. Estimated cost: RM2,500-4,000 for full review.
