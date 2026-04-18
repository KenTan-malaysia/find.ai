"""
SDSAS 2026 Stamp Duty Calculator — Malaysian Tenancy Agreements
================================================================
Based on Finance Act 2025 amendments to Stamp Act 1949 (First Schedule, Item 32(a))

KEY 2026 CHANGES:
1. Self-Assessment System (SDSAS) — landlord/tenant calculates own duty via MyTax
2. RM2,400 annual rent exemption REMOVED — full annual rent is taxable
3. Revised rates per RM250 (or part thereof) of annual rent:
   - Lease ≤ 1 year:       RM1 per RM250
   - Lease > 1 to ≤ 3 yr:  RM3 per RM250
   - Lease > 3 to ≤ 5 yr:  RM5 per RM250
   - Lease > 5 years:       RM7 per RM250

FORMULA:
   units = ceil(annual_rent / 250)
   stamp_duty = units × rate

NOTE: The rate tiers (RM1/3/5/7) are from the project brief.
      Ken must verify against the gazetted Finance Act 2025 schedule.
      If rates differ, update RATE_TABLE below — all logic stays the same.

PENALTY:
   Self-assessment errors carry up to 100% penalty (Section 36A Stamp Act 1949).
   2026 transition year: IRB announced penalty concession (no penalties for errors in 2026).

STAMPING DEADLINE: 30 days from execution of instrument.
"""

import math
from dataclasses import dataclass
from typing import Optional


# ===== CONFIGURABLE RATES =====
# Update this table if gazetted rates differ from brief
RATE_TABLE = {
    # (min_years, max_years): rate_per_250
    (0, 1): 1,      # ≤ 1 year
    (1, 3): 3,      # > 1 year to ≤ 3 years
    (3, 5): 5,      # > 3 years to ≤ 5 years
    (5, 99): 7,     # > 5 years
}

# OLD rates (pre-2026) for comparison
OLD_RATE_TABLE = {
    (0, 1): 1,
    (1, 3): 2,
    (3, 99): 4,
}

OLD_EXEMPTION = 2400  # RM2,400 — removed in 2026
NEW_EXEMPTION = 0     # No exemption under SDSAS 2026

MINIMUM_DUTY = 10     # RM10 minimum if duty falls below (per Stamp Act)


@dataclass
class StampDutyResult:
    monthly_rent: float
    annual_rent: float
    lease_years: float
    units: int              # number of RM250 units (rounded up)
    rate_per_unit: int      # RM per unit
    gross_duty: float       # units × rate
    duty_payable: float     # after minimum duty rule
    exemption_applied: float  # RM0 for 2026
    taxable_rent: float     # annual_rent - exemption
    old_duty: float         # what it would have been under old rules (for comparison)
    savings_or_increase: float  # positive = costs more under 2026


def get_rate(lease_years: float, rate_table: dict = RATE_TABLE) -> int:
    """Get the stamp duty rate per RM250 for a given lease duration."""
    for (min_y, max_y), rate in rate_table.items():
        if min_y < lease_years <= max_y:
            return rate
    # Edge case: exactly 0 or negative
    if lease_years <= 0:
        raise ValueError("Lease duration must be positive")
    # Lease at exactly 0 years edge — treat as ≤ 1 year
    if lease_years <= 1:
        return rate_table.get((0, 1), 1)
    # Fallback for very long leases
    return 7


def calculate_sdsas_2026(
    monthly_rent: float,
    lease_years: float,
) -> StampDutyResult:
    """
    Calculate stamp duty under SDSAS 2026 rules.

    Args:
        monthly_rent: Monthly rental amount in RM
        lease_years: Lease duration in years (e.g., 1, 2, 3, 5)

    Returns:
        StampDutyResult with full breakdown
    """
    if monthly_rent <= 0:
        raise ValueError("Monthly rent must be positive")
    if lease_years <= 0:
        raise ValueError("Lease duration must be positive")

    annual_rent = monthly_rent * 12

    # === 2026 SDSAS calculation ===
    # No exemption — full annual rent is taxable
    taxable_rent = annual_rent  # No RM2,400 deduction
    units = math.ceil(taxable_rent / 250)
    rate = get_rate(lease_years, RATE_TABLE)
    gross_duty = units * rate
    duty_payable = max(gross_duty, MINIMUM_DUTY) if gross_duty > 0 else 0

    # === Old calculation (for comparison) ===
    old_taxable = max(0, annual_rent - OLD_EXEMPTION)
    old_units = math.ceil(old_taxable / 250) if old_taxable > 0 else 0
    old_rate = get_rate(lease_years, OLD_RATE_TABLE)
    old_duty = old_units * old_rate
    if old_duty > 0:
        old_duty = max(old_duty, MINIMUM_DUTY)

    return StampDutyResult(
        monthly_rent=monthly_rent,
        annual_rent=annual_rent,
        lease_years=lease_years,
        units=units,
        rate_per_unit=rate,
        gross_duty=gross_duty,
        duty_payable=duty_payable,
        exemption_applied=NEW_EXEMPTION,
        taxable_rent=taxable_rent,
        old_duty=old_duty,
        savings_or_increase=duty_payable - old_duty,
    )


def format_bnds_prefill(result: StampDutyResult) -> dict:
    """
    Generate data for pre-filling the digital BNDS (Borang Nyata Duti Setem) form.
    This is the 'Tax Accuracy Certificate' output from Module A.
    """
    return {
        "instrument_type": "Tenancy Agreement / Perjanjian Sewa",
        "stamp_act_reference": "First Schedule, Item 32(a)",
        "annual_rental_rm": result.annual_rent,
        "lease_duration_years": result.lease_years,
        "exemption_rm": result.exemption_applied,
        "taxable_amount_rm": result.taxable_rent,
        "units_of_250": result.units,
        "rate_per_unit_rm": result.rate_per_unit,
        "stamp_duty_payable_rm": result.duty_payable,
        "assessment_method": "Self-Assessment (SDSAS)",
        "deadline_days": 30,
        "penalty_risk": "Up to 100% of unpaid duty (Section 36A Stamp Act 1949)",
        "note": "2026 transition year — IRB penalty concession applies",
    }


# ===== TEST SUITE =====
def run_tests():
    """Verify calculator against expected results."""
    print("=" * 70)
    print("SDSAS 2026 STAMP DUTY CALCULATOR — TEST SUITE")
    print("=" * 70)

    test_cases = [
        # (monthly_rent, lease_years, description)
        (500, 1, "Low rent, 1yr — was exempt under old rules"),
        (1000, 1, "RM1k/mo, 1yr"),
        (1500, 1, "RM1.5k/mo, 1yr — right at old exemption boundary"),
        (2000, 1, "RM2k/mo, 1yr"),
        (2500, 1, "RM2.5k/mo, 1yr — common KL rent"),
        (3000, 2, "RM3k/mo, 2yr"),
        (3500, 3, "RM3.5k/mo, 3yr"),
        (5000, 2, "RM5k/mo, 2yr — mid-range condo"),
        (8000, 3, "RM8k/mo, 3yr — premium unit"),
        (2000, 5, "RM2k/mo, 5yr — long lease industrial"),
        (10000, 5, "RM10k/mo, 5yr — factory/warehouse"),
        (15000, 3, "RM15k/mo, 3yr — commercial space"),
        (200, 1, "RM200/mo, 1yr — room rental (minimum duty test)"),
    ]

    print(f"\n{'Description':<45} {'Rent/mo':>8} {'Yr':>3} {'2026 Duty':>10} {'Old Duty':>10} {'Change':>10}")
    print("-" * 90)

    for rent, years, desc in test_cases:
        r = calculate_sdsas_2026(rent, years)
        change_str = f"+RM{r.savings_or_increase:.0f}" if r.savings_or_increase > 0 else f"RM{r.savings_or_increase:.0f}"
        print(f"{desc:<45} RM{rent:>6,} {years:>3}  RM{r.duty_payable:>8,.2f} RM{r.old_duty:>8,.2f} {change_str:>10}")

    # Detailed breakdown for common case
    print("\n" + "=" * 70)
    print("DETAILED BREAKDOWN — RM2,500/month, 2-year lease")
    print("=" * 70)
    r = calculate_sdsas_2026(2500, 2)
    print(f"  Monthly rent:     RM {r.monthly_rent:,.2f}")
    print(f"  Annual rent:      RM {r.annual_rent:,.2f}")
    print(f"  Exemption (2026): RM {r.exemption_applied:,.2f} (REMOVED)")
    print(f"  Taxable amount:   RM {r.taxable_rent:,.2f}")
    print(f"  Units (÷250↑):   {r.units}")
    print(f"  Rate per unit:    RM {r.rate_per_unit}")
    print(f"  Lease duration:   {r.lease_years} years")
    print(f"  ─────────────────────────────")
    print(f"  DUTY PAYABLE:     RM {r.duty_payable:,.2f}")
    print(f"  Old duty was:     RM {r.old_duty:,.2f}")
    print(f"  Increase:         RM {r.savings_or_increase:,.2f} ({'+' if r.savings_or_increase > 0 else ''}{(r.savings_or_increase / r.old_duty * 100) if r.old_duty > 0 else 0:.0f}%)")

    # BNDS prefill output
    print("\n" + "=" * 70)
    print("BNDS FORM PRE-FILL DATA (Tax Accuracy Certificate)")
    print("=" * 70)
    bnds = format_bnds_prefill(r)
    for k, v in bnds.items():
        print(f"  {k}: {v}")

    # Edge case: verify rounding
    print("\n" + "=" * 70)
    print("ROUNDING VERIFICATION")
    print("=" * 70)
    edge_cases = [
        (250 / 12, 1, "Annual = RM250 exactly — should be 1 unit"),
        (251 / 12, 1, "Annual = RM251 — should round up to 2 units"),
        (500 / 12, 1, "Annual = RM500 — should be 2 units"),
        (501 / 12, 1, "Annual = RM501 — should round up to 3 units"),
    ]
    for rent, years, desc in edge_cases:
        r = calculate_sdsas_2026(rent, years)
        print(f"  {desc}")
        print(f"    Annual: RM{r.annual_rent:.2f} → {r.units} units → RM{r.duty_payable:.2f}")


if __name__ == "__main__":
    run_tests()
