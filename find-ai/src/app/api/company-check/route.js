/**
 * Find.ai MY Company Check API Route
 *
 * POST /api/company-check
 *
 * Scores Malaysian companies using SSM registration number.
 * Mock database for MVP — production would integrate with SSM e-Info or CTOS.
 *
 * Request body:
 *   { ssm: string }
 *
 * Response:
 *   { company details, trust score, grade, traffic light, risk factors, recommendations }
 */

import { NextResponse } from 'next/server';

// ==============================================================================
// SCORING ENGINE
// ==============================================================================

function calculateScore(company) {
  let score = 0;
  const risks = [];
  const positives = [];

  // 1. Paid-up Capital (25 pts)
  const cap = company.paidUpCapital || 0;
  if (cap >= 1000000) {
    score += 25;
    positives.push(`Strong paid-up capital: RM${(cap / 1000000).toFixed(1)}M`);
  } else if (cap >= 500000) {
    score += 20;
    positives.push(`Solid paid-up capital: RM${(cap / 1000).toFixed(0)}K`);
  } else if (cap >= 100000) {
    score += 12;
    positives.push(`Adequate paid-up capital: RM${(cap / 1000).toFixed(0)}K`);
  } else if (cap >= 10000) {
    score += 5;
    risks.push(`Low paid-up capital: RM${cap.toLocaleString()} — may indicate limited financial backing`);
  } else {
    risks.push(`Very low paid-up capital: RM${cap.toLocaleString()} — high risk of default`);
  }

  // 2. Years in Operation (25 pts)
  const yrs = company.yearsOperating || 0;
  if (yrs >= 10) {
    score += 25;
    positives.push(`${yrs} years in operation — well-established business`);
  } else if (yrs >= 5) {
    score += 18;
    positives.push(`${yrs} years in operation — established track record`);
  } else if (yrs >= 3) {
    score += 12;
    positives.push(`${yrs} years in operation — growing business`);
  } else if (yrs >= 1) {
    score += 5;
    risks.push(`Only ${yrs} year(s) old — limited operating history`);
  } else {
    risks.push('Less than 1 year old — new company, higher risk');
  }

  // 3. Company Status (20 pts)
  if (company.status === 'active') {
    score += 20;
    positives.push('Active status with SSM');
  } else if (company.status === 'dormant') {
    score += 5;
    risks.push('Company is DORMANT — not actively operating');
  } else {
    risks.push('Company status is irregular — verify with SSM directly');
  }

  // 4. Company Type (15 pts)
  if (company.companyType === 'sdn-bhd') {
    score += 15;
    positives.push('Sdn Bhd (Private Limited) — structured entity with director accountability');
  } else if (company.companyType === 'bhd') {
    score += 15;
    positives.push('Berhad (Public Limited) — regulated, audited entity');
  } else if (company.companyType === 'llp') {
    score += 10;
    positives.push('LLP (Limited Liability Partnership)');
  } else if (company.companyType === 'partnership') {
    score += 5;
    risks.push('Partnership — no limited liability protection, personal asset risk');
  } else if (company.companyType === 'sole-prop') {
    score += 3;
    risks.push('Sole Proprietorship — single person entity, limited recourse if default');
  }

  // 5. Director Count & SSM Compliance (15 pts)
  const dirs = company.directorCount || 0;
  if (dirs >= 2 && company.ssmCompliant) {
    score += 15;
    positives.push(`${dirs} directors, SSM filings up to date`);
  } else if (dirs >= 2) {
    score += 10;
    positives.push(`${dirs} directors on record`);
  } else if (dirs === 1 && company.ssmCompliant) {
    score += 8;
  } else {
    score += 3;
    risks.push('Single director — limited corporate governance');
  }

  const grade = score >= 80 ? 'A' : score >= 60 ? 'B' : score >= 40 ? 'C' : 'D';
  const trafficLight = score >= 70 ? 'green' : score >= 45 ? 'yellow' : 'red';

  return { score, grade, trafficLight, risks, positives };
}

// ==============================================================================
// MOCK DATABASE — Sample Malaysian companies
// ==============================================================================

const MOCK_DATABASE = {
  // GREEN: Established Sdn Bhd
  '200301012345': {
    ssm: '200301012345',
    companyName: 'Syarikat Maju Jaya Sdn Bhd',
    companyNameEN: 'Maju Jaya Enterprise Sdn Bhd',
    companyType: 'sdn-bhd',
    status: 'active',
    incorporationDate: '2003-03-15',
    yearsOperating: 23,
    paidUpCapital: 2000000,
    natureOfBusiness: 'Trading & Distribution',
    registeredAddress: 'Lot 5, Jalan PJS 11/28, Bandar Sunway, 46150 Petaling Jaya, Selangor',
    directorCount: 3,
    directors: ['Ahmad bin Ismail', 'Lim Mei Ling', 'Rajesh Kumar'],
    ssmCompliant: true,
  },

  // YELLOW: Newer company, moderate capital
  '201901056789': {
    ssm: '201901056789',
    companyName: 'Pinnacle Synergy Trading',
    companyNameEN: 'Pinnacle Synergy Trading',
    companyType: 'llp',
    status: 'active',
    incorporationDate: '2019-06-20',
    yearsOperating: 7,
    paidUpCapital: 150000,
    natureOfBusiness: 'Import/Export, General Trading',
    registeredAddress: '15-2, Jalan Pudu, 55100 Kuala Lumpur',
    directorCount: 2,
    directors: ['Wong Kah Yee', 'Siti Aminah'],
    ssmCompliant: true,
  },

  // RED: Very new, minimal capital, sole prop
  '202401098765': {
    ssm: '202401098765',
    companyName: 'Ali Express Logistics',
    companyNameEN: 'Ali Express Logistics',
    companyType: 'sole-prop',
    status: 'active',
    incorporationDate: '2024-01-10',
    yearsOperating: 2,
    paidUpCapital: 5000,
    natureOfBusiness: 'Logistics & Delivery Services',
    registeredAddress: '88, Jalan Ampang, 50450 Kuala Lumpur',
    directorCount: 1,
    directors: ['Ali bin Abu'],
    ssmCompliant: false,
  },
};

// ==============================================================================
// VALIDATION
// ==============================================================================

function validateSSM(ssm) {
  // SSM company numbers: 12 digits for new format, or older formats like 12345-A
  const newFormat = /^\d{12}$/;
  const oldFormat = /^\d{4,6}-[A-Z]$/;
  return newFormat.test(ssm) || oldFormat.test(ssm);
}

function validateRequest(body) {
  if (!body || typeof body !== 'object') {
    return { valid: false, error: 'Invalid request body' };
  }

  const { ssm } = body;

  if (!ssm || typeof ssm !== 'string') {
    return {
      valid: false,
      error: 'Missing or invalid ssm field. Expected: { "ssm": "200301012345" }',
    };
  }

  const clean = ssm.replace(/\s/g, '').toUpperCase();
  if (!validateSSM(clean)) {
    return {
      valid: false,
      error: `Invalid SSM format: ${ssm}. Expected 12-digit number (e.g. 200301012345) or old format (e.g. 12345-A)`,
    };
  }

  return { valid: true };
}

// ==============================================================================
// RESPONSE BUILDERS
// ==============================================================================

function buildSuccessResponse(company, scoring) {
  return {
    success: true,
    timestamp: new Date().toISOString(),
    data: {
      company: {
        ssm: company.ssm,
        name: company.companyName,
        nameEN: company.companyNameEN,
        type: company.companyType,
        status: company.status,
        incorporationDate: company.incorporationDate,
        yearsOperating: company.yearsOperating,
        paidUpCapital: company.paidUpCapital,
        natureOfBusiness: company.natureOfBusiness,
        registeredAddress: company.registeredAddress,
        directorCount: company.directorCount,
        directors: company.directors,
        ssmCompliant: company.ssmCompliant,
      },
      trustScore: {
        score: scoring.score,
        grade: scoring.grade,
        trafficLight: scoring.trafficLight,
      },
      assessment: {
        riskFactors: scoring.risks,
        positiveFactors: scoring.positives,
        recommendation: buildRecommendation(scoring),
      },
      metadata: {
        dataSource: 'SSM (Suruhanjaya Syarikat Malaysia)',
        scope: 'Malaysian business entity verification for property rental',
      },
    },
  };
}

function buildRecommendation(scoring) {
  if (scoring.trafficLight === 'green') {
    return `Green light: Score ${scoring.score}/100 indicates a reliable tenant. Proceed with standard lease terms.`;
  } else if (scoring.trafficLight === 'yellow') {
    return `Yellow light: Score ${scoring.score}/100 shows mixed signals. Recommend requesting additional deposit (3+1), guarantor letter, or 3-month advance.`;
  } else {
    return `Red light: Score ${scoring.score}/100 indicates elevated risk. Strongly recommend bank guarantee, personal guarantor, or full prepayment before signing lease.`;
  }
}

function buildNotFoundResponse(ssm) {
  return {
    success: false,
    timestamp: new Date().toISOString(),
    error: {
      code: 'SSM_NOT_FOUND',
      message: `No company found for SSM: ${ssm}`,
      suggestion: [
        'The company may not be in our database yet',
        'Verify the SSM number is correct (12 digits)',
        'Check SSM e-Info portal: https://www.ssm-einfo.my',
        'Request a company profile extract from SSM (RM10-50)',
      ],
    },
  };
}

// ==============================================================================
// API ENDPOINT
// ==============================================================================

export async function POST(request) {
  try {
    let body;
    try {
      body = await request.json();
    } catch (e) {
      return NextResponse.json(
        { success: false, error: { code: 'INVALID_JSON', message: 'Request body must be valid JSON' } },
        { status: 400 }
      );
    }

    const validation = validateRequest(body);
    if (!validation.valid) {
      return NextResponse.json(
        { success: false, error: { code: 'VALIDATION_ERROR', message: validation.error } },
        { status: 400 }
      );
    }

    const ssm = body.ssm.replace(/\s/g, '').toUpperCase();
    const company = MOCK_DATABASE[ssm];

    if (!company) {
      return NextResponse.json(buildNotFoundResponse(ssm), { status: 404 });
    }

    const scoring = calculateScore(company);
    return NextResponse.json(buildSuccessResponse(company, scoring), { status: 200 });
  } catch (error) {
    console.error('Company check API error:', error);
    return NextResponse.json(
      { success: false, error: { code: 'INTERNAL_ERROR', message: 'An unexpected error occurred' } },
      { status: 500 }
    );
  }
}

export async function OPTIONS(request) {
  return NextResponse.json({ message: 'OK' }, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
