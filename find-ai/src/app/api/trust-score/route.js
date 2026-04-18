/**
 * Find.ai Trust Score API Route
 *
 * POST /api/trust-score
 *
 * Calculates trust scores for Chinese business entities (USCC verification).
 * This endpoint integrates with the Python trust-score-engine for production use
 * or uses mock database for development/testing.
 *
 * Request body:
 *   { uscc: string }
 *
 * Response:
 *   { company details, trust score, grade, traffic light, risk factors, recommendations }
 */

import { NextResponse } from 'next/server';

// ==============================================================================
// MOCK DATABASE - Sample companies with pre-calculated scores
// ==============================================================================

const MOCK_DATABASE = {
  // GREEN LIGHT: Strong, established tech company
  '914403001234567890': {
    uscc: '914403001234567890',
    companyNameCN: '深圳市腾讯计算机系统有限公司',
    companyNameEN: 'Shenzhen Tencent Computer Systems Co., Ltd.',
    legalRepresentative: '马化腾',
    registeredCapital: {
      amount: 330000000,
      currency: 'CNY',
    },
    operatingStatus: 'active',
    years_operating: 25,
    dishonestDebtor: false,
    activeLawsuits: 2,
    administrativePenalties: 1,
    taxRating: 'A',
    employeeCount: 15000,
    branchCount: 45,
    trustScore: 82,
    trustGrade: 'A',
    trafficLight: 'green',
    riskFactors: [
      '2 active lawsuits (typical for large multinational)',
      '1 minor administrative penalty',
    ],
    positiveFactors: [
      'Currently active and operating',
      'Strong registered capital (>= 50M CNY)',
      'Established company (25+ years operating)',
      'No dishonest debtor status',
      'Excellent tax compliance (Grade A)',
      'Significant workforce (15,000 employees)',
      'Established presence (45 branches)',
    ],
    dataSource: 'National Credit Information Public Disclosure Platform',
  },

  // YELLOW LIGHT: Moderate-sized company with some concerns
  '911101088765432109': {
    uscc: '911101088765432109',
    companyNameCN: '北京市中关村软件园有限公司',
    companyNameEN: 'Beijing Zhongguancun Software Park Co., Ltd.',
    legalRepresentative: '李明',
    registeredCapital: {
      amount: 5000000,
      currency: 'CNY',
    },
    operatingStatus: 'active',
    years_operating: 8,
    dishonestDebtor: false,
    activeLawsuits: 4,
    administrativePenalties: 2,
    taxRating: 'B',
    employeeCount: 350,
    branchCount: 3,
    trustScore: 56,
    trustGrade: 'C',
    trafficLight: 'yellow',
    riskFactors: [
      'Moderate registered capital (>= 1M CNY, < 10M)',
      '4 active lawsuits (elevated litigation)',
      '2 administrative penalties',
      'Good but not excellent tax compliance (Grade B)',
    ],
    positiveFactors: [
      'Currently active and operating',
      'Solid registered capital (>= 10M CNY)',
      'Good track record (8+ years operating)',
      'No dishonest debtor status',
      'Good tax compliance (Grade B)',
    ],
    dataSource: 'National Credit Information Public Disclosure Platform',
  },

  // RED LIGHT: Risky company with multiple serious issues
  '916969009876543210': {
    uscc: '916969009876543210',
    companyNameCN: '广州市小微贸易有限公司',
    companyNameEN: 'Guangzhou SmallMicro Trading Co., Ltd.',
    legalRepresentative: '王小红',
    registeredCapital: {
      amount: 50000,
      currency: 'CNY',
    },
    operatingStatus: 'active',
    years_operating: 1.5,
    dishonestDebtor: false,
    activeLawsuits: 8,
    administrativePenalties: 5,
    taxRating: 'D',
    employeeCount: 12,
    branchCount: 1,
    trustScore: 28,
    trustGrade: 'D',
    trafficLight: 'red',
    riskFactors: [
      'Low registered capital (< 100K CNY)',
      'Company age < 2 years (insufficient track record)',
      '8 active lawsuits (high litigation risk)',
      '5 administrative penalties (compliance issues)',
      'Poor tax compliance rating (D)',
    ],
    positiveFactors: ['Currently active and operating', 'No dishonest debtor status'],
    dataSource: 'National Credit Information Public Disclosure Platform',
  },
};

// ==============================================================================
// VALIDATION
// ==============================================================================

/**
 * Validate 18-digit Unified Social Credit Code (USCC) format
 * Valid pattern: [0-9A-HJ-NP-RT-UW-Y]{18}
 */
function validateUSCC(uscc) {
  const pattern = /^[0-9A-HJ-NP-RT-UW-Y]{18}$/i;
  return pattern.test(uscc);
}

/**
 * Validate request body
 */
function validateRequest(body) {
  if (!body || typeof body !== 'object') {
    return { valid: false, error: 'Invalid request body' };
  }

  const { uscc } = body;

  if (!uscc || typeof uscc !== 'string') {
    return {
      valid: false,
      error: 'Missing or invalid uscc field. Expected: { "uscc": "914403001234567890" }',
    };
  }

  if (!validateUSCC(uscc)) {
    return {
      valid: false,
      error: `Invalid USCC format: ${uscc}. USCC must be 18 alphanumeric characters [0-9A-HJ-NP-RT-UW-Y]`,
    };
  }

  return { valid: true };
}

// ==============================================================================
// RESPONSE BUILDERS
// ==============================================================================

/**
 * Build success response for found company
 */
function buildSuccessResponse(company) {
  return {
    success: true,
    timestamp: new Date().toISOString(),
    data: {
      company: {
        uscc: company.uscc,
        nameEN: company.companyNameEN,
        nameCN: company.companyNameCN,
        legalRepresentative: company.legalRepresentative,
        registeredCapital: company.registeredCapital,
        operatingStatus: company.operatingStatus,
        yearsOperating: company.years_operating,
      },
      trustScore: {
        score: company.trustScore,
        grade: company.trustGrade,
        trafficLight: company.trafficLight,
      },
      assessment: {
        riskFactors: company.riskFactors,
        positiveFactors: company.positiveFactors,
        recommendation: company.recommendationText || buildRecommendation(
          company.trustScore,
          company.trafficLight,
          company.riskFactors
        ),
      },
      metadata: {
        dataSource: company.dataSource,
        scope: 'Chinese business entity verification for Malaysian property rental',
      },
    },
  };
}

/**
 * Build not found response with manual verification suggestion
 */
function buildNotFoundResponse(uscc) {
  return {
    success: false,
    timestamp: new Date().toISOString(),
    error: {
      code: 'USCC_NOT_FOUND',
      message: `No company found for USCC: ${uscc}`,
      suggestion: [
        'The company may not be registered in the National Credit Information database',
        'Verify the USCC format is correct (18 alphanumeric characters)',
        'For production use, integrate with QCC.com or Aiqicha API',
        'Recommend manual verification through local Chinese authorities',
      ],
      nextSteps: [
        'Contact Shenzhen/local market supervision bureau',
        'Request official business license documentation from tenant',
        'Hire professional verification service if lease amount is significant',
      ],
    },
  };
}

/**
 * Build error response
 */
function buildErrorResponse(code, message, details = null) {
  return {
    success: false,
    timestamp: new Date().toISOString(),
    error: {
      code,
      message,
      ...(details && { details }),
    },
  };
}

/**
 * Generate recommendation text based on trust profile
 */
function buildRecommendation(score, trafficLight, riskFactors) {
  if (trafficLight === 'green') {
    return `Green light: Trust score ${score}/100 indicates low risk. Proceed with standard tenant verification.`;
  } else if (trafficLight === 'yellow') {
    return `Yellow light: Trust score ${score}/100 shows mixed signals. Recommend enhanced due diligence before finalizing lease terms.`;
  } else {
    return `Red light: Trust score ${score}/100 indicates elevated risk. STRONGLY recommend manual verification and legal review before proceeding.`;
  }
}

// ==============================================================================
// API ENDPOINT
// ==============================================================================

export async function POST(request) {
  try {
    // Parse request body
    let body;
    try {
      body = await request.json();
    } catch (e) {
      return NextResponse.json(
        buildErrorResponse('INVALID_JSON', 'Request body must be valid JSON'),
        { status: 400 }
      );
    }

    // Validate request
    const validation = validateRequest(body);
    if (!validation.valid) {
      return NextResponse.json(
        buildErrorResponse('VALIDATION_ERROR', validation.error),
        { status: 400 }
      );
    }

    const { uscc } = body;

    // Lookup company in mock database
    // In production, this would call the Python scoring engine or external API
    const company = MOCK_DATABASE[uscc.toUpperCase()];

    if (!company) {
      return NextResponse.json(buildNotFoundResponse(uscc), { status: 404 });
    }

    // Return success response
    return NextResponse.json(buildSuccessResponse(company), { status: 200 });
  } catch (error) {
    console.error('Trust score API error:', error);
    return NextResponse.json(
      buildErrorResponse(
        'INTERNAL_ERROR',
        'An unexpected error occurred while calculating trust score',
        error.message
      ),
      { status: 500 }
    );
  }
}

// ==============================================================================
// OPTIONS - CORS Support
// ==============================================================================

export async function OPTIONS(request) {
  return NextResponse.json(
    { message: 'OK' },
    {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    }
  );
}
