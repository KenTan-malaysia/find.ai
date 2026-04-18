#!/usr/bin/env python3
"""
Landlord Trust Score Engine for Find.ai

A standalone scoring system for evaluating Chinese business entities (USCC verification).
This engine calculates a trust score (0-100) and traffic light rating based on multiple
factors: operating status, financial stability, company longevity, legal risk, and tax compliance.

Designed as a reference/microservice that can be called from Next.js API routes or used
directly for batch processing of company verification.

Author: Find.ai
License: Proprietary
"""

import re
import json
from dataclasses import dataclass
from datetime import datetime
from typing import Dict, List, Tuple, Literal


# ==============================================================================
# MOCK API RESPONSE - Simulates QCC/Aiqicha API data for Chinese company
# ==============================================================================

MOCK_API_RESPONSE = {
    "code": 0,
    "message": "success",
    "data": {
        # Company Identification
        "uscc": "914403001234567890",  # Unified Social Credit Code
        "companyNameCN": "深圳市腾讯计算机系统有限公司",
        "companyNameEN": "Shenzhen Tencent Computer Systems Co., Ltd.",
        "legalRepresentative": "马化腾",

        # Registration Details
        "registeredCapital": {
            "amount": 330000000,
            "currency": "CNY"
        },
        "paidInCapital": {
            "amount": 330000000,
            "currency": "CNY"
        },
        "registrationDate": "2000-11-11",
        "operatingPeriodStart": "2000-11-11",
        "operatingPeriodEnd": "2050-11-10",
        "registrationAuthority": "深圳市市场监督管理局",

        # Operating Status
        "operatingStatus": "active",  # active, revoked, cancelled, liquidated
        "abnormalOperations": False,
        "abnormalDetails": [],

        # Legal & Compliance
        "dishonestDebtor": False,
        "activeLawsuits": 2,
        "administrativePenalties": 1,
        "courtRecords": [],

        # Tax Compliance
        "taxRating": "A",  # A, B, C, D
        "taxID": "91440300123456789X",

        # Business Information
        "businessScope": "计算机硬件及软件开发、经营、销售及相关技术服务",
        "industryCategory": "互联网和相关服务",
        "employeeCount": 15000,
        "branchCount": 45,

        # Verification Metadata
        "lastUpdated": "2026-04-15",
        "dataSource": "National Credit Information Public Disclosure Platform"
    }
}


# ==============================================================================
# DATA MODELS
# ==============================================================================

@dataclass
class TrustScoreBreakdown:
    """Detailed breakdown of trust score components."""
    operating_status_score: int
    financial_stability_score: int
    longevity_score: int
    legal_risk_score: int
    tax_compliance_score: int
    total_score: int


@dataclass
class TrustScoreResult:
    """Complete trust score result with recommendations."""
    uscc: str
    company_name_cn: str
    company_name_en: str
    trust_score: int
    trust_grade: Literal["A", "B", "C", "D"]
    traffic_light: Literal["green", "yellow", "red"]
    breakdown: TrustScoreBreakdown
    risk_factors: List[str]
    positive_factors: List[str]
    recommendation_en: str
    recommendation_zh: str
    recommendation_bm: str
    data_source: str
    calculation_timestamp: str


# ==============================================================================
# VALIDATION
# ==============================================================================

def validate_uscc(uscc: str) -> bool:
    """
    Validate 18-digit Unified Social Credit Code (USCC) format.

    USCC format: 18 alphanumeric characters [0-9A-HJ-NP-RT-UW-Y]
    Valid character set excludes: I, O, Z, S, V (to avoid confusion)

    Args:
        uscc: USCC string to validate

    Returns:
        True if valid USCC format, False otherwise
    """
    pattern = r'^[0-9A-HJ-NP-RT-UW-Y]{18}$'
    return bool(re.match(pattern, uscc.upper()))


# ==============================================================================
# SCORING ENGINE
# ==============================================================================

class LandlordTrustScoreEngine:
    """
    Landlord Trust Score calculation engine for Chinese business entities.

    Scoring weights:
    - Operating Status (15%): Binary gate, active required for loan consideration
    - Financial Stability (25%): Based on registered capital tiers
    - Longevity (20%): Company age indicates stability
    - Legal Risk (25%): Dishonest debtor, lawsuits, penalties
    - Tax Compliance (15%): Tax authority rating
    """

    # Weight distribution (must sum to 100)
    WEIGHTS = {
        "operating_status": 15,
        "financial_stability": 25,
        "longevity": 20,
        "legal_risk": 25,
        "tax_compliance": 15,
    }

    def __init__(self, api_response: Dict):
        """
        Initialize engine with API response data.

        Args:
            api_response: Dict containing company verification data from QCC/Aiqicha
        """
        self.data = api_response.get("data", {})
        self.uscc = self.data.get("uscc", "")
        self.company_name_cn = self.data.get("companyNameCN", "")
        self.company_name_en = self.data.get("companyNameEN", "")

    def calculate(self) -> TrustScoreResult:
        """
        Calculate complete trust score and generate result.

        Returns:
            TrustScoreResult object with scores, grades, and recommendations
        """
        # Calculate component scores
        operating_status = self._score_operating_status()
        financial_stability = self._score_financial_stability()
        longevity = self._score_longevity()
        legal_risk = self._score_legal_risk()
        tax_compliance = self._score_tax_compliance()

        # Create breakdown
        breakdown = TrustScoreBreakdown(
            operating_status_score=operating_status,
            financial_stability_score=financial_stability,
            longevity_score=longevity,
            legal_risk_score=legal_risk,
            tax_compliance_score=tax_compliance,
            total_score=0  # Set below after calculation
        )

        # Weighted total calculation
        total_score = (
            (operating_status * self.WEIGHTS["operating_status"] / 15) +
            (financial_stability * self.WEIGHTS["financial_stability"] / 25) +
            (longevity * self.WEIGHTS["longevity"] / 20) +
            (legal_risk * self.WEIGHTS["legal_risk"] / 25) +
            (tax_compliance * self.WEIGHTS["tax_compliance"] / 15)
        )
        breakdown.total_score = int(round(total_score))

        # Determine grade and traffic light
        trust_grade = self._determine_grade(breakdown.total_score)
        traffic_light = self._determine_traffic_light(breakdown.total_score)

        # Extract risk and positive factors
        risk_factors = self._extract_risk_factors()
        positive_factors = self._extract_positive_factors()

        # Generate recommendations
        rec_en, rec_zh, rec_bm = self._generate_recommendations(
            breakdown.total_score, traffic_light, risk_factors
        )

        return TrustScoreResult(
            uscc=self.uscc,
            company_name_cn=self.company_name_cn,
            company_name_en=self.company_name_en,
            trust_score=breakdown.total_score,
            trust_grade=trust_grade,
            traffic_light=traffic_light,
            breakdown=breakdown,
            risk_factors=risk_factors,
            positive_factors=positive_factors,
            recommendation_en=rec_en,
            recommendation_zh=rec_zh,
            recommendation_bm=rec_bm,
            data_source=self.data.get("dataSource", "Unknown"),
            calculation_timestamp=datetime.now().isoformat()
        )

    def _score_operating_status(self) -> int:
        """
        Score operating status (15 points max).

        Operating Status Scoring:
        - Active: 15 pts (full credit)
        - Revoked/Liquidated/Cancelled: 0 pts (binary gate - disqualifies)

        Returns:
            Operating status score (0-15)
        """
        status = self.data.get("operatingStatus", "").lower()

        if status == "active":
            return 15
        else:
            # Revoked, cancelled, liquidated = disqualifying
            return 0

    def _score_financial_stability(self) -> int:
        """
        Score financial stability based on registered capital tiers (25 points max).

        Registered Capital Tiers (CNY):
        - >= 50M: 25 pts (very strong)
        - >= 10M: 20 pts (strong)
        - >= 1M: 15 pts (moderate)
        - >= 100K: 8 pts (weak)
        - < 100K: 0 pts (insufficient)

        Returns:
            Financial stability score (0-25)
        """
        reg_capital_data = self.data.get("registeredCapital", {})
        amount = reg_capital_data.get("amount", 0)

        # Convert to CNY (assuming already in CNY)
        capital_cny = amount

        if capital_cny >= 50_000_000:
            return 25
        elif capital_cny >= 10_000_000:
            return 20
        elif capital_cny >= 1_000_000:
            return 15
        elif capital_cny >= 100_000:
            return 8
        else:
            return 0

    def _score_longevity(self) -> int:
        """
        Score company longevity based on operating age (20 points max).

        Longevity Scoring:
        - < 2 years: 4 pts (very new, higher risk)
        - 2-5 years: 10 pts (early stage)
        - 5-10 years: 16 pts (established)
        - > 10 years: 20 pts (mature, stable)

        Returns:
            Longevity score (0-20)
        """
        reg_date_str = self.data.get("registrationDate", "")

        try:
            reg_date = datetime.strptime(reg_date_str, "%Y-%m-%d")
            today = datetime.now()
            years_operating = (today - reg_date).days / 365.25
        except (ValueError, TypeError):
            # Invalid date format
            return 8  # Default middle score

        if years_operating < 2:
            return 4
        elif years_operating < 5:
            return 10
        elif years_operating < 10:
            return 16
        else:
            return 20

    def _score_legal_risk(self) -> int:
        """
        Score legal risk factors (25 points max).

        Starts at 25 points, penalties subtracted for:
        - 失信被执行人 (Dishonest debtor status): -25 pts (disqualifying)
        - Active lawsuits: -5 pts each (max -15 pts)
        - Administrative penalties: -3 pts each (max -10 pts)

        Returns:
            Legal risk score (0-25)
        """
        score = 25

        # Dishonest debtor check (disqualifying)
        if self.data.get("dishonestDebtor", False):
            return 0  # Automatic disqualification

        # Lawsuit penalties
        lawsuits = self.data.get("activeLawsuits", 0)
        lawsuit_penalty = min(lawsuits * 5, 15)  # Max 15 points
        score -= lawsuit_penalty

        # Administrative penalty penalties
        penalties = self.data.get("administrativePenalties", 0)
        penalty_penalty = min(penalties * 3, 10)  # Max 10 points
        score -= penalty_penalty

        return max(0, score)

    def _score_tax_compliance(self) -> int:
        """
        Score tax compliance based on tax authority rating (15 points max).

        Tax Rating Scoring:
        - A: 15 pts (excellent)
        - B: 11 pts (good)
        - C: 6 pts (fair)
        - D: 0 pts (poor)

        Returns:
            Tax compliance score (0-15)
        """
        tax_rating = self.data.get("taxRating", "D").upper()

        rating_map = {
            "A": 15,
            "B": 11,
            "C": 6,
            "D": 0,
        }

        return rating_map.get(tax_rating, 0)

    def _determine_grade(self, score: int) -> Literal["A", "B", "C", "D"]:
        """
        Determine letter grade based on trust score.

        Grading:
        - 80-100: A (excellent)
        - 60-79: B (good)
        - 40-59: C (fair)
        - 0-39: D (poor)

        Returns:
            Grade letter (A, B, C, or D)
        """
        if score >= 80:
            return "A"
        elif score >= 60:
            return "B"
        elif score >= 40:
            return "C"
        else:
            return "D"

    def _determine_traffic_light(self, score: int) -> Literal["green", "yellow", "red"]:
        """
        Determine traffic light status based on trust score.

        Traffic Light:
        - Green (>=70): Proceed with caution, favorable
        - Yellow (40-69): Proceed with caution, mixed signals
        - Red (<40): High risk, recommend manual verification

        Returns:
            Traffic light color (green, yellow, or red)
        """
        if score >= 70:
            return "green"
        elif score >= 40:
            return "yellow"
        else:
            return "red"

    def _extract_risk_factors(self) -> List[str]:
        """
        Extract risk factors present in the company profile.

        Returns:
            List of identified risk factors
        """
        factors = []

        # Operating status risk
        status = self.data.get("operatingStatus", "").lower()
        if status != "active":
            factors.append(f"Operating status is {status}")

        # Financial stability risk
        reg_capital = self.data.get("registeredCapital", {}).get("amount", 0)
        if reg_capital < 100_000:
            factors.append("Low registered capital (< 100K CNY)")
        elif reg_capital < 1_000_000:
            factors.append("Moderate registered capital (< 1M CNY)")

        # Age risk
        reg_date = self.data.get("registrationDate", "")
        try:
            reg_date_obj = datetime.strptime(reg_date, "%Y-%m-%d")
            years = (datetime.now() - reg_date_obj).days / 365.25
            if years < 2:
                factors.append("Company age < 2 years (insufficient track record)")
        except (ValueError, TypeError):
            pass

        # Legal risks
        if self.data.get("dishonestDebtor", False):
            factors.append("Dishonest debtor status (失信被执行人)")

        lawsuits = self.data.get("activeLawsuits", 0)
        if lawsuits > 0:
            factors.append(f"{lawsuits} active lawsuit(s)")

        penalties = self.data.get("administrativePenalties", 0)
        if penalties > 0:
            factors.append(f"{penalties} administrative penalty(ies)")

        # Tax compliance risk
        tax_rating = self.data.get("taxRating", "D").upper()
        if tax_rating in ["C", "D"]:
            factors.append(f"Poor tax compliance rating ({tax_rating})")

        # Abnormal operations
        if self.data.get("abnormalOperations", False):
            factors.append("Abnormal operations flagged")

        return factors

    def _extract_positive_factors(self) -> List[str]:
        """
        Extract positive factors present in the company profile.

        Returns:
            List of identified positive factors
        """
        factors = []

        # Operating status positive
        if self.data.get("operatingStatus", "").lower() == "active":
            factors.append("Currently active and operating")

        # Financial stability positive
        reg_capital = self.data.get("registeredCapital", {}).get("amount", 0)
        if reg_capital >= 50_000_000:
            factors.append("Strong registered capital (>= 50M CNY)")
        elif reg_capital >= 10_000_000:
            factors.append("Solid registered capital (>= 10M CNY)")

        # Longevity positive
        reg_date = self.data.get("registrationDate", "")
        try:
            reg_date_obj = datetime.strptime(reg_date, "%Y-%m-%d")
            years = (datetime.now() - reg_date_obj).days / 365.25
            if years >= 10:
                factors.append(f"Established company ({years:.0f}+ years operating)")
            elif years >= 5:
                factors.append(f"Good track record ({years:.0f}+ years operating)")
        except (ValueError, TypeError):
            pass

        # Legal positive
        if not self.data.get("dishonestDebtor", False):
            factors.append("No dishonest debtor status")

        if self.data.get("activeLawsuits", 0) == 0:
            factors.append("No active lawsuits")

        if self.data.get("administrativePenalties", 0) == 0:
            factors.append("No administrative penalties")

        # Tax positive
        tax_rating = self.data.get("taxRating", "D").upper()
        if tax_rating == "A":
            factors.append("Excellent tax compliance (Grade A)")
        elif tax_rating == "B":
            factors.append("Good tax compliance (Grade B)")

        # Scale and employee count
        employees = self.data.get("employeeCount", 0)
        if employees >= 1000:
            factors.append(f"Significant workforce ({employees:,} employees)")

        branches = self.data.get("branchCount", 0)
        if branches > 5:
            factors.append(f"Established presence ({branches} branches)")

        return factors

    def _generate_recommendations(
        self,
        score: int,
        traffic_light: str,
        risk_factors: List[str]
    ) -> Tuple[str, str, str]:
        """
        Generate tailored recommendations for Malaysian landlords based on trust profile.

        Args:
            score: Trust score (0-100)
            traffic_light: Traffic light status
            risk_factors: List of identified risk factors

        Returns:
            Tuple of (English recommendation, Chinese recommendation, Malay recommendation)
        """

        if traffic_light == "green":
            rec_en = (
                f"Green light: This company shows strong financial stability and legal compliance. "
                f"The trust score of {score}/100 indicates low risk for lease agreements. "
                f"Proceed with standard tenant verification procedures."
            )
            rec_zh = (
                f"绿灯: 该公司显示出强劲的财务稳定性和法律合规性。"
                f"信任评分 {score}/100 表示租赁协议的风险较低。"
                f"按照标准租户验证程序进行。"
            )
            rec_bm = (
                f"Lampu hijau: Syarikat ini menunjukkan kestabilan kewangan yang kuat dan pematuhan undang-undang. "
                f"Skor kepercayaan {score}/100 menunjukkan risiko rendah untuk perjanjian sewaan. "
                f"Sila teruskan dengan prosedur pengesahan penyewa standard."
            )

        elif traffic_light == "yellow":
            rec_en = (
                f"Yellow light: This company has mixed signals with a trust score of {score}/100. "
                f"Key concerns: {', '.join(risk_factors[:2]) if risk_factors else 'mixed factors'}. "
                f"Recommend enhanced due diligence and direct contact with management before finalizing lease terms."
            )
            rec_zh = (
                f"黄灯: 该公司信号混合，信任评分为 {score}/100。"
                f"主要关注: {', '.join(risk_factors[:2]) if risk_factors else '多项因素'}。"
                f"建议在最终确定租赁条款前进行强化尽职调查和与管理层的直接联系。"
            )
            rec_bm = (
                f"Lampu kuning: Syarikat ini mempunyai isyarat bercampur dengan skor kepercayaan {score}/100. "
                f"Kebimbangan utama: {', '.join(risk_factors[:2]) if risk_factors else 'pelbagai faktor'}. "
                f"Disyorkan penyelidikan bersih yang ditingkatkan dan hubungan terus dengan pengurusan sebelum memuktamadkan syarat sewaan."
            )

        else:  # red
            rec_en = (
                f"Red light: This company presents elevated risks with a trust score of only {score}/100. "
                f"Critical issues: {', '.join(risk_factors[:3]) if risk_factors else 'multiple serious factors'}. "
                f"STRONGLY recommend: manual verification, legal review, and potentially alternative tenants. "
                f"Contact the local authority or hire a professional verification service."
            )
            rec_zh = (
                f"红灯: 该公司存在提升的风险，信任评分仅为 {score}/100。"
                f"严重问题: {', '.join(risk_factors[:3]) if risk_factors else '多项严重因素'}。"
                f"强烈建议: 人工验证、法律审查以及可能的替代租户。"
                f"联系当地部门或聘请专业验证服务。"
            )
            rec_bm = (
                f"Lampu merah: Syarikat ini menunjukkan risiko yang tinggi dengan skor kepercayaan hanya {score}/100. "
                f"Isu-isu kritikal: {', '.join(risk_factors[:3]) if risk_factors else 'pelbagai faktor serius'}. "
                f"SANGAT DISYORKAN: pengesahan manual, semakan undang-undang, dan berpotensi penyewa alternatif. "
                f"Hubungi pihak berkuasa tempatan atau upah perkhidmatan pengesahan profesional."
            )

        return rec_en, rec_zh, rec_bm


# ==============================================================================
# OUTPUT FORMATTING
# ==============================================================================

def result_to_dict(result: TrustScoreResult) -> Dict:
    """
    Convert TrustScoreResult to serializable dictionary.

    Args:
        result: TrustScoreResult object

    Returns:
        Dictionary representation suitable for JSON serialization
    """
    return {
        "uscc": result.uscc,
        "company_name_cn": result.company_name_cn,
        "company_name_en": result.company_name_en,
        "trust_score": result.trust_score,
        "trust_grade": result.trust_grade,
        "traffic_light": result.traffic_light,
        "breakdown": {
            "operating_status_score": result.breakdown.operating_status_score,
            "financial_stability_score": result.breakdown.financial_stability_score,
            "longevity_score": result.breakdown.longevity_score,
            "legal_risk_score": result.breakdown.legal_risk_score,
            "tax_compliance_score": result.breakdown.tax_compliance_score,
            "total_score": result.breakdown.total_score,
        },
        "risk_factors": result.risk_factors,
        "positive_factors": result.positive_factors,
        "recommendations": {
            "en": result.recommendation_en,
            "zh": result.recommendation_zh,
            "bm": result.recommendation_bm,
        },
        "data_source": result.data_source,
        "calculation_timestamp": result.calculation_timestamp,
    }


def print_result_formatted(result: TrustScoreResult):
    """
    Pretty-print trust score result in bilingual format.

    Args:
        result: TrustScoreResult object
    """
    print("\n" + "=" * 80)
    print("LANDLORD TRUST SCORE - FIND.AI")
    print("=" * 80)

    print(f"\nCompany (中文): {result.company_name_cn}")
    print(f"Company (EN): {result.company_name_en}")
    print(f"USCC: {result.uscc}")

    print(f"\n{'TRUST SCORE':<30} {result.trust_score}/100")
    print(f"{'GRADE':<30} {result.trust_grade}")
    print(f"{'TRAFFIC LIGHT':<30} {result.traffic_light.upper()}")

    print(f"\n--- SCORE BREAKDOWN ---")
    print(f"Operating Status (15%):    {result.breakdown.operating_status_score:>2}/15")
    print(f"Financial Stability (25%): {result.breakdown.financial_stability_score:>2}/25")
    print(f"Longevity (20%):           {result.breakdown.longevity_score:>2}/20")
    print(f"Legal Risk (25%):          {result.breakdown.legal_risk_score:>2}/25")
    print(f"Tax Compliance (15%):      {result.breakdown.tax_compliance_score:>2}/15")

    if result.risk_factors:
        print(f"\n--- RISK FACTORS ---")
        for factor in result.risk_factors:
            print(f"  ⚠ {factor}")

    if result.positive_factors:
        print(f"\n--- POSITIVE FACTORS ---")
        for factor in result.positive_factors:
            print(f"  ✓ {factor}")

    print(f"\n--- RECOMMENDATION (ENGLISH) ---")
    print(result.recommendation_en)

    print(f"\n--- 建议 (中文) ---")
    print(result.recommendation_zh)

    print(f"\n--- CADANGAN (BAHASA MELAYU) ---")
    print(result.recommendation_bm)

    print(f"\nData Source: {result.data_source}")
    print(f"Calculated: {result.calculation_timestamp}")
    print("=" * 80 + "\n")


# ==============================================================================
# MAIN - Demo Mode
# ==============================================================================

if __name__ == "__main__":
    """
    Demo mode: Run trust score calculation on mock API response.

    This demonstrates the full scoring pipeline with realistic Chinese company data
    (Tencent Computer Systems, a real and financially strong company).
    """

    print("\n[DEMO MODE] Landlord Trust Score Engine")
    print("Processing mock API response...\n")

    # Validate USCC
    test_uscc = MOCK_API_RESPONSE["data"]["uscc"]
    is_valid = validate_uscc(test_uscc)
    print(f"USCC Validation: {test_uscc}")
    print(f"Valid format: {is_valid}\n")

    # Calculate trust score
    engine = LandlordTrustScoreEngine(MOCK_API_RESPONSE)
    result = engine.calculate()

    # Display formatted output
    print_result_formatted(result)

    # JSON output for API integration
    print("\n[JSON OUTPUT - For API Integration]")
    print(json.dumps(result_to_dict(result), indent=2, ensure_ascii=False))
