// v9.6 T6 — Notify-me capture endpoint
//
// Backs the Audit teaser "Notify me" form on landing.js (and any future
// teaser tiles that follow the same shape — `tool` is a free-form string).
//
// Phase 1 persistence: Vercel serverless function logs. Every successful
// capture is written to stdout with a `[NOTIFY]` prefix so Ken can grep
// the Vercel log stream and export the list when AgreementHealth ships.
//
// Graduation path (when volume justifies it):
//   • Resend audiences: POST to https://api.resend.com/audiences/{id}/contacts
//     using process.env.RESEND_API_KEY. 2-line swap.
//   • Google Sheets: use an Apps Script webhook. Same swap.
//   • Supabase: once there's a real DB, persist per-email history.
// Until then, `[NOTIFY]` lines are the source of truth.

export const runtime = 'nodejs';

const ALLOWED_TOOLS = new Set(['audit', 'screen', 'stamp', 'general']);
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_EMAIL_LEN = 254; // RFC 5321

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch (e) {
    return jsonRes({ ok: false, error: 'invalid_json' }, 400);
  }

  const email = typeof body?.email === 'string' ? body.email.trim().toLowerCase() : '';
  const tool  = typeof body?.tool  === 'string' ? body.tool.trim().toLowerCase()  : 'general';
  const lang  = typeof body?.lang  === 'string' ? body.lang.trim().toLowerCase()  : 'en';

  // --- validation ---
  if (!email || email.length > MAX_EMAIL_LEN || !EMAIL_RE.test(email)) {
    return jsonRes({ ok: false, error: 'invalid_email' }, 400);
  }
  if (!ALLOWED_TOOLS.has(tool)) {
    return jsonRes({ ok: false, error: 'invalid_tool' }, 400);
  }
  if (!['en', 'bm', 'zh'].includes(lang)) {
    return jsonRes({ ok: false, error: 'invalid_lang' }, 400);
  }

  // --- capture ---
  // Structured single-line JSON → easy to grep / tail / parse in Vercel logs.
  const record = {
    at: new Date().toISOString(),
    email,
    tool,
    lang,
    // Lightweight provenance (no IP — we never want to hold PII more than we
    // have to). Useful for debugging if a particular UA keeps failing.
    ua: request.headers.get('user-agent') || null,
    ref: request.headers.get('referer') || null,
  };
  // eslint-disable-next-line no-console
  console.log('[NOTIFY]', JSON.stringify(record));

  return jsonRes({ ok: true });
}

// Guard against accidental GETs (e.g. someone opening /api/notify-me in a
// browser). Returning 405 keeps the log stream clean.
export async function GET() {
  return jsonRes({ ok: false, error: 'method_not_allowed' }, 405);
}

function jsonRes(obj, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  });
}
