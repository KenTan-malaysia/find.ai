'use client';

import { useState, useCallback } from 'react';
import { Modal, ToolHeader, ActionBtn } from './shared';
import { L } from './labels';

// ===== TRAFFIC LIGHT =====
const TrafficLight = ({ color, label }) => {
  const colors = {
    green: { active: '#16a34a', glow: 'rgba(22,163,74,0.3)', ring: '#bbf7d0' },
    yellow: { active: '#f59e0b', glow: 'rgba(245,158,11,0.3)', ring: '#fde68a' },
    red: { active: '#dc2626', glow: 'rgba(220,38,38,0.3)', ring: '#fecaca' },
  };
  const c = colors[color] || colors.green;
  return (
    <div className="flex flex-col items-center gap-3 py-4">
      <div className="flex gap-3 px-5 py-3 rounded-full" style={{ background: '#1e293b' }}>
        {['red', 'yellow', 'green'].map(light => (
          <div key={light} className="w-8 h-8 rounded-full transition-all duration-500" style={{
            background: color === light ? colors[light].active : '#334155',
            boxShadow: color === light ? `0 0 16px ${colors[light].glow}, 0 0 4px ${colors[light].glow}` : 'inset 0 2px 4px rgba(0,0,0,0.3)',
            border: color === light ? `2px solid ${colors[light].ring}` : '2px solid #475569',
          }} />
        ))}
      </div>
      <span className="text-[12px] font-bold tracking-wide" style={{ color: c.active }}>{label}</span>
    </div>
  );
};

const Spinner = ({ text }) => (
  <div className="flex items-center gap-2 py-3 px-4 rounded-xl" style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}>
    <div className="w-4 h-4 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: '#3b82f6', borderTopColor: 'transparent' }} />
    <span className="text-[12px] font-medium" style={{ color: '#64748b' }}>{text}</span>
  </div>
);

const StatusBadge = ({ type, text }) => {
  const styles = {
    success: { bg: '#f0fdf4', border: '#bbf7d0', color: '#16a34a', icon: '✓' },
    warning: { bg: '#fffbeb', border: '#fde68a', color: '#92400e', icon: '!' },
    error: { bg: '#fef2f2', border: '#fecaca', color: '#dc2626', icon: '✕' },
  };
  const s = styles[type] || styles.warning;
  return (
    <div className="flex items-center gap-2 py-2 px-3 rounded-lg" style={{ background: s.bg, border: `1px solid ${s.border}` }}>
      <span className="w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold text-white" style={{ background: s.color }}>{s.icon}</span>
      <span className="text-[11px] font-medium" style={{ color: s.color }}>{text}</span>
    </div>
  );
};

export default function MYCompanyCheck({ lang, onClose }) {
  const t = L[lang];
  const [ssm, setSsm] = useState('');
  const [ssmValid, setSsmValid] = useState(null);
  const [lookupState, setLookupState] = useState('idle');
  const [result, setResult] = useState(null);
  const [companyData, setCompanyData] = useState(null);

  // Manual mode fields
  const [mode, setMode] = useState('auto');
  const [manual, setManual] = useState({ name: '', type: 'sdn-bhd', capital: '', years: '', status: 'active', directors: '2', compliant: null });

  const validateSSM = (code) => {
    const clean = code.replace(/\s/g, '');
    setSsm(clean);
    if (clean.length === 0) { setSsmValid(null); setLookupState('idle'); return; }
    const valid = /^\d{12}$/.test(clean);
    setSsmValid(clean.length === 12 ? valid : null);
    setResult(null);
    if (clean.length === 12 && valid && mode === 'auto') {
      lookupSSM(clean);
    }
  };

  const lookupSSM = useCallback(async (code) => {
    setLookupState('loading');
    setResult(null);
    setCompanyData(null);
    try {
      const res = await fetch('/api/company-check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ssm: code }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setLookupState('found');
        setCompanyData(data.data.company);
        setResult({
          score: data.data.trustScore.score,
          grade: data.data.trustScore.grade,
          trafficLight: data.data.trustScore.trafficLight,
          risks: data.data.assessment.riskFactors || [],
          positives: data.data.assessment.positiveFactors || [],
          recommendation: data.data.assessment.recommendation || '',
          fromApi: true,
        });
      } else if (res.status === 404) {
        setLookupState('notfound');
      } else {
        setLookupState('error');
      }
    } catch {
      setLookupState('error');
    }
  }, []);

  const generateManual = () => {
    let score = 0;
    const risks = [];
    const positives = [];
    const cap = parseFloat(manual.capital) || 0;

    // Paid-up capital (25 pts)
    if (cap >= 1000000) { score += 25; positives.push(lang === 'en' ? `Strong capital: RM${(cap/1000000).toFixed(1)}M` : lang === 'bm' ? `Modal kukuh: RM${(cap/1000000).toFixed(1)}M` : `资本雄厚：RM${(cap/1000000).toFixed(1)}M`); }
    else if (cap >= 500000) { score += 20; positives.push(lang === 'en' ? `Solid capital: RM${(cap/1000).toFixed(0)}K` : lang === 'bm' ? `Modal mantap: RM${(cap/1000).toFixed(0)}K` : `资本稳健：RM${(cap/1000).toFixed(0)}K`); }
    else if (cap >= 100000) { score += 12; }
    else if (cap >= 10000) { score += 5; risks.push(lang === 'en' ? `Low capital: RM${cap.toLocaleString()}` : lang === 'bm' ? `Modal rendah: RM${cap.toLocaleString()}` : `资本较低：RM${cap.toLocaleString()}`); }
    else { risks.push(lang === 'en' ? 'Very low capital — high default risk' : lang === 'bm' ? 'Modal sangat rendah — risiko tinggi' : '资本极低 — 违约风险高'); }

    // Years (25 pts)
    const yrs = parseInt(manual.years) || 0;
    if (yrs >= 10) { score += 25; positives.push(lang === 'en' ? `${yrs} years — well-established` : lang === 'bm' ? `${yrs} tahun — mantap` : `运营${yrs}年 — 信誉良好`); }
    else if (yrs >= 5) { score += 18; positives.push(lang === 'en' ? `${yrs} years operating` : lang === 'bm' ? `${yrs} tahun beroperasi` : `运营${yrs}年`); }
    else if (yrs >= 3) { score += 12; }
    else if (yrs >= 1) { score += 5; risks.push(lang === 'en' ? `Only ${yrs} year(s) — limited history` : lang === 'bm' ? `Hanya ${yrs} tahun` : `仅${yrs}年 — 历史有限`); }
    else { risks.push(lang === 'en' ? 'New company — higher risk' : lang === 'bm' ? 'Syarikat baru — risiko tinggi' : '新公司 — 风险较高'); }

    // Status (20 pts)
    if (manual.status === 'active') { score += 20; positives.push(lang === 'en' ? 'Active with SSM' : lang === 'bm' ? 'Aktif di SSM' : 'SSM状态活跃'); }
    else if (manual.status === 'dormant') { score += 5; risks.push(lang === 'en' ? 'DORMANT — not actively operating' : lang === 'bm' ? 'DORMAN — tidak beroperasi' : '休眠状态 — 未活跃运营'); }
    else { risks.push(lang === 'en' ? 'Irregular status — verify with SSM' : lang === 'bm' ? 'Status tidak normal' : '状态异常 — 需向SSM核实'); }

    // Company type (15 pts)
    if (manual.type === 'sdn-bhd' || manual.type === 'bhd') { score += 15; positives.push(lang === 'en' ? `${t.myTypes[manual.type]} — structured entity` : lang === 'bm' ? `${t.myTypes[manual.type]} — entiti berstruktur` : `${t.myTypes[manual.type]} — 结构化实体`); }
    else if (manual.type === 'llp') { score += 10; }
    else if (manual.type === 'partnership') { score += 5; risks.push(lang === 'en' ? 'Partnership — limited liability protection' : lang === 'bm' ? 'Perkongsian — perlindungan terhad' : '合伙企业 — 责任保护有限'); }
    else { score += 3; risks.push(lang === 'en' ? 'Sole proprietorship — single person entity' : lang === 'bm' ? 'Milikan tunggal — entiti seorang' : '独资企业 — 个人实体'); }

    // Directors + compliance (15 pts)
    const dirs = parseInt(manual.directors) || 1;
    if (dirs >= 2 && manual.compliant === true) { score += 15; positives.push(lang === 'en' ? `${dirs} directors, filings up to date` : lang === 'bm' ? `${dirs} pengarah, pemfailan terkini` : `${dirs}名董事，备案最新`); }
    else if (dirs >= 2) { score += 10; }
    else { score += 3; risks.push(lang === 'en' ? 'Single director — limited governance' : lang === 'bm' ? 'Seorang pengarah — tadbir urus terhad' : '单一董事 — 治理有限'); }

    const grade = score >= 80 ? 'A' : score >= 60 ? 'B' : score >= 40 ? 'C' : 'D';
    const trafficLight = score >= 70 ? 'green' : score >= 45 ? 'yellow' : 'red';
    setResult({ score, grade, trafficLight, risks, positives, fromApi: false });
  };

  const downloadReport = () => {
    if (!result) return;
    const gradeColors = { A: '#16a34a', B: '#3b82f6', C: '#f59e0b', D: '#dc2626' };
    const name = companyData?.name || manual.name || 'Unknown';
    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>MY Company Report - ${ssm}</title>
<style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:Georgia,serif;padding:40px;max-width:800px;margin:0 auto;color:#1a1a1a;line-height:1.6}
.header{text-align:center;border-bottom:3px double #333;padding-bottom:20px;margin-bottom:30px}
.header h1{font-size:22px;letter-spacing:1px;margin-bottom:5px}.header h2{font-size:14px;color:#555;font-weight:normal}
.traffic{display:flex;justify-content:center;gap:12px;padding:16px;background:#1e293b;border-radius:40px;width:fit-content;margin:20px auto}
.light{width:36px;height:36px;border-radius:50%;border:2px solid #475569;background:#334155}
.light.on-green{background:#16a34a;border-color:#bbf7d0;box-shadow:0 0 16px rgba(22,163,74,0.4)}
.light.on-yellow{background:#f59e0b;border-color:#fde68a;box-shadow:0 0 16px rgba(245,158,11,0.4)}
.light.on-red{background:#dc2626;border-color:#fecaca;box-shadow:0 0 16px rgba(220,38,38,0.4)}
.grade-box{text-align:center;padding:20px;margin:20px 0;border:2px solid ${gradeColors[result.grade]};border-radius:8px}
.grade-letter{font-size:48px;font-weight:bold;color:${gradeColors[result.grade]}}
.section{margin-bottom:25px}.section h3{font-size:14px;text-transform:uppercase;letter-spacing:1px;color:#555;border-bottom:1px solid #ddd;padding-bottom:5px;margin-bottom:10px}
.field{display:flex;justify-content:space-between;padding:4px 0;font-size:13px}.field .label{color:#777}.field .value{font-weight:bold}
.risk{background:#fef2f2;border:1px solid #fecaca;border-radius:6px;padding:12px;margin-bottom:8px;font-size:12px;color:#991b1b}
.pos{background:#f0fdf4;border:1px solid #bbf7d0;border-radius:6px;padding:12px;margin-bottom:8px;font-size:12px;color:#166534}
.footer{text-align:center;margin-top:40px;padding-top:20px;border-top:1px solid #ddd;font-size:11px;color:#999}</style></head>
<body>
<div class="header"><h1>MY COMPANY VERIFICATION REPORT</h1><h2>Malaysian Business Entity Check</h2></div>
<div class="traffic"><div class="light ${result.trafficLight === 'red' ? 'on-red' : ''}"></div><div class="light ${result.trafficLight === 'yellow' ? 'on-yellow' : ''}"></div><div class="light ${result.trafficLight === 'green' ? 'on-green' : ''}"></div></div>
<div class="grade-box"><div class="grade-letter">GRADE ${result.grade}</div><div style="font-size:14px;color:#555;margin-top:5px">Score: ${result.score}/100</div></div>
<div class="section"><h3>Company Details</h3>
<div class="field"><span class="label">SSM Number</span><span class="value">${ssm}</span></div>
<div class="field"><span class="label">Company Name</span><span class="value">${name}</span></div>
${companyData ? `
<div class="field"><span class="label">Type</span><span class="value">${companyData.type}</span></div>
<div class="field"><span class="label">Status</span><span class="value">${companyData.status}</span></div>
<div class="field"><span class="label">Paid-up Capital</span><span class="value">RM${companyData.paidUpCapital?.toLocaleString()}</span></div>
<div class="field"><span class="label">Years Operating</span><span class="value">${companyData.yearsOperating}</span></div>
<div class="field"><span class="label">Nature of Business</span><span class="value">${companyData.natureOfBusiness}</span></div>
<div class="field"><span class="label">Directors</span><span class="value">${companyData.directors?.join(', ')}</span></div>
<div class="field"><span class="label">Registered Address</span><span class="value">${companyData.registeredAddress}</span></div>
` : ''}
</div>
${result.risks.length ? `<div class="section"><h3>Risk Factors</h3>${result.risks.map(r=>`<div class="risk">⚠️ ${r}</div>`).join('')}</div>` : ''}
${result.positives.length ? `<div class="section"><h3>Positive Factors</h3>${result.positives.map(p=>`<div class="pos">✅ ${p}</div>`).join('')}</div>` : ''}
${result.recommendation ? `<div class="section"><h3>Recommendation</h3><p style="font-size:13px;padding:12px;background:#f8fafc;border-radius:6px;border:1px solid #e2e8f0">${result.recommendation}</p></div>` : ''}
<div class="section" style="background:#fffbeb;border:1px solid #fde68a;border-radius:6px;padding:16px;font-size:12px"><h3 style="color:#92400e;border:none;padding:0;margin-bottom:8px">Disclaimer</h3><p>${t.myDisclaimer}</p></div>
<div class="footer"><p>Generated by Find.ai — MY Company Check</p><p>${new Date().toLocaleString('en-MY')}</p></div>
</body></html>`;
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([html], { type: 'text/html' }));
    a.download = `MY-Company-Report-${ssm}-${new Date().toISOString().slice(0,10)}.html`;
    a.click();
  };

  const gradeStyle = {
    A: { color: '#16a34a', bg: '#f0fdf4', border: '#bbf7d0' },
    B: { color: '#3b82f6', bg: '#eff6ff', border: '#bfdbfe' },
    C: { color: '#f59e0b', bg: '#fffbeb', border: '#fde68a' },
    D: { color: '#dc2626', bg: '#fef2f2', border: '#fecaca' },
  };

  const trafficLabel = result?.trafficLight === 'green' ? t.trafficGreen : result?.trafficLight === 'yellow' ? t.trafficYellow : t.trafficRed;

  return (
    <Modal>
      <ToolHeader icon="🇲🇾" title={t.myCheckTitle} desc={t.myCheckDesc} onClose={onClose} />

      {/* Mode Toggle */}
      <div className="flex gap-1 p-1 rounded-xl mb-4" style={{ background: '#f1f5f9' }}>
        <button onClick={() => { setMode('auto'); setResult(null); setLookupState('idle'); }}
          className="flex-1 py-2 rounded-lg text-[12px] font-semibold transition"
          style={mode === 'auto' ? { background: '#fff', color: '#0f172a', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' } : { color: '#94a3b8' }}>
          {t.trustAuto}
        </button>
        <button onClick={() => { setMode('manual'); setResult(null); setLookupState('idle'); }}
          className="flex-1 py-2 rounded-lg text-[12px] font-semibold transition"
          style={mode === 'manual' ? { background: '#fff', color: '#0f172a', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' } : { color: '#94a3b8' }}>
          {t.trustManual}
        </button>
      </div>

      <div className="space-y-3 mb-4">
        {/* SSM Input */}
        <div>
          <label className="text-[11px] font-semibold uppercase tracking-wider mb-1.5 block" style={{ color: '#64748b' }}>{t.ssmLabel}</label>
          <input type="text" value={ssm} onChange={(e) => validateSSM(e.target.value)} maxLength={12}
            placeholder="200301012345" className="w-full py-2.5 px-3 rounded-xl text-sm font-mono tracking-wider focus:outline-none"
            style={{ border: `1.5px solid ${ssmValid === false ? '#fecaca' : ssmValid === true ? '#bbf7d0' : '#e2e8f0'}`, background: '#f8fafc', color: '#0f172a' }} />
          <p className="text-[10px] mt-1 pl-1" style={{ color: ssmValid === false ? '#dc2626' : '#94a3b8' }}>
            {ssmValid === false ? t.ssmInvalid : t.ssmHint}
          </p>
          {ssmValid && <div className="flex items-center gap-1 mt-1"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg><span className="text-[10px] font-medium" style={{ color: '#16a34a' }}>Valid SSM format</span></div>}
        </div>

        {/* Lookup status */}
        {mode === 'auto' && lookupState === 'loading' && <Spinner text={t.trustLookup} />}
        {mode === 'auto' && lookupState === 'found' && <StatusBadge type="success" text={t.trustFound} />}
        {mode === 'auto' && lookupState === 'notfound' && (
          <div>
            <StatusBadge type="warning" text={t.trustNotFound} />
            <button onClick={() => { setMode('manual'); setLookupState('idle'); }}
              className="mt-2 text-[11px] font-semibold px-3 py-1.5 rounded-lg transition"
              style={{ color: '#3b82f6', background: '#eff6ff' }}>
              {t.trustManual} →
            </button>
          </div>
        )}
        {mode === 'auto' && lookupState === 'error' && (
          <div>
            <StatusBadge type="error" text={t.trustOffline} />
            <div className="flex gap-2 mt-2">
              <button onClick={() => lookupSSM(ssm)} className="text-[11px] font-semibold px-3 py-1.5 rounded-lg" style={{ color: '#3b82f6', background: '#eff6ff' }}>{t.trustRetry}</button>
              <button onClick={() => { setMode('manual'); setLookupState('idle'); }} className="text-[11px] font-semibold px-3 py-1.5 rounded-lg" style={{ color: '#64748b', background: '#f1f5f9' }}>{t.trustManual} →</button>
            </div>
          </div>
        )}

        {/* Manual fields */}
        {mode === 'manual' && (
          <>
            <div>
              <label className="text-[11px] font-semibold uppercase tracking-wider mb-1.5 block" style={{ color: '#64748b' }}>{t.myCompanyName}</label>
              <input type="text" value={manual.name} onChange={(e) => { setManual(m => ({ ...m, name: e.target.value })); setResult(null); }}
                placeholder="Syarikat ABC Sdn Bhd" className="w-full py-2.5 px-3 rounded-xl text-sm focus:outline-none" style={{ border: '1px solid #e2e8f0', background: '#f8fafc', color: '#0f172a' }} />
            </div>

            <div>
              <label className="text-[11px] font-semibold uppercase tracking-wider mb-1.5 block" style={{ color: '#64748b' }}>{t.myCompanyType}</label>
              <div className="flex flex-wrap gap-1.5">
                {['sdn-bhd', 'bhd', 'llp', 'partnership', 'sole-prop'].map(tp => (
                  <button key={tp} onClick={() => { setManual(m => ({ ...m, type: tp })); setResult(null); }}
                    className="px-3 py-1.5 rounded-full text-[11px] font-medium transition"
                    style={manual.type === tp
                      ? { background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.3)', color: '#1d4ed8' }
                      : { background: 'white', border: '1px solid #e2e8f0', color: '#64748b' }
                    }>{t.myTypes[tp]}</button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-[11px] font-semibold uppercase tracking-wider mb-1.5 block" style={{ color: '#64748b' }}>{t.myPaidUpCapital}</label>
              <div className="flex items-center gap-2 rounded-xl px-4 py-3" style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                <span className="text-sm font-medium" style={{ color: '#94a3b8' }}>RM</span>
                <input type="number" value={manual.capital} onChange={(e) => { setManual(m => ({ ...m, capital: e.target.value })); setResult(null); }}
                  placeholder="500000" className="flex-1 bg-transparent text-lg font-semibold focus:outline-none" style={{ color: '#0f172a' }} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-semibold uppercase tracking-wider mb-1.5 block" style={{ color: '#64748b' }}>{t.myYearsOp}</label>
                <input type="number" value={manual.years} onChange={(e) => { setManual(m => ({ ...m, years: e.target.value })); setResult(null); }}
                  placeholder="5" className="w-full py-2.5 px-3 rounded-xl text-sm focus:outline-none" style={{ border: '1px solid #e2e8f0', background: '#f8fafc', color: '#0f172a' }} />
              </div>
              <div>
                <label className="text-[11px] font-semibold uppercase tracking-wider mb-1.5 block" style={{ color: '#64748b' }}>{t.myDirectors}</label>
                <input type="number" value={manual.directors} onChange={(e) => { setManual(m => ({ ...m, directors: e.target.value })); setResult(null); }}
                  placeholder="2" className="w-full py-2.5 px-3 rounded-xl text-sm focus:outline-none" style={{ border: '1px solid #e2e8f0', background: '#f8fafc', color: '#0f172a' }} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-semibold uppercase tracking-wider mb-1.5 block" style={{ color: '#64748b' }}>{t.myStatus}</label>
                <div className="flex gap-1.5">
                  {['active', 'dormant'].map(s => (
                    <button key={s} onClick={() => { setManual(m => ({ ...m, status: s })); setResult(null); }}
                      className="flex-1 py-2 rounded-lg text-[11px] font-semibold transition"
                      style={manual.status === s
                        ? s === 'active' ? { background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#16a34a' } : { background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626' }
                        : { background: 'white', border: '1px solid #e2e8f0', color: '#94a3b8' }
                      }>{t.myStatuses[s]}</button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-[11px] font-semibold uppercase tracking-wider mb-1.5 block" style={{ color: '#64748b' }}>{t.myCompliant}</label>
                <div className="flex gap-1.5">
                  <button onClick={() => { setManual(m => ({ ...m, compliant: true })); setResult(null); }}
                    className="flex-1 py-2 rounded-lg text-[11px] font-semibold transition"
                    style={manual.compliant === true ? { background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#16a34a' } : { background: 'white', border: '1px solid #e2e8f0', color: '#94a3b8' }}>{t.yes}</button>
                  <button onClick={() => { setManual(m => ({ ...m, compliant: false })); setResult(null); }}
                    className="flex-1 py-2 rounded-lg text-[11px] font-semibold transition"
                    style={manual.compliant === false ? { background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626' } : { background: 'white', border: '1px solid #e2e8f0', color: '#94a3b8' }}>{t.no}</button>
                </div>
              </div>
            </div>

            <ActionBtn onClick={generateManual} disabled={!ssmValid || !manual.capital} label={t.myGenerateReport} />
          </>
        )}
      </div>

      {/* ===== RESULT ===== */}
      {result && (
        <div className="mt-4 space-y-3 fade-in">
          <div className="rounded-[16px] overflow-hidden" style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}>
            <TrafficLight color={result.trafficLight} label={trafficLabel} />
          </div>

          <div className="p-5 rounded-[14px] text-center" style={{ background: gradeStyle[result.grade].bg, border: `1.5px solid ${gradeStyle[result.grade].border}` }}>
            {result.fromApi && (
              <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full mb-3" style={{ background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.2)' }}>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                <span className="text-[9px] font-semibold" style={{ color: '#3b82f6' }}>{t.trustAutoFill}</span>
              </div>
            )}
            <div className="text-[10px] font-semibold uppercase tracking-wider mb-1" style={{ color: '#64748b' }}>{t.trustGrade}</div>
            <div className="text-4xl font-black mb-1" style={{ color: gradeStyle[result.grade].color }}>{result.grade}</div>
            <div className="text-[12px] font-medium mb-2" style={{ color: gradeStyle[result.grade].color }}>{t[`trust${result.grade}`]}</div>
            <div className="w-full rounded-full h-2 mt-3" style={{ background: '#e2e8f0' }}>
              <div className="h-2 rounded-full transition-all" style={{ width: `${result.score}%`, background: gradeStyle[result.grade].color }} />
            </div>
            <div className="text-[11px] mt-1" style={{ color: '#94a3b8' }}>{t.trustScore}: {result.score}/100</div>
          </div>

          {/* Company details from API */}
          {companyData && (
            <div className="p-3 rounded-[12px] space-y-1" style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}>
              <div className="text-[11px] font-bold mb-2" style={{ color: '#64748b' }}>{t.myCompanyName}</div>
              <div className="flex justify-between text-[12px]"><span style={{ color: '#94a3b8' }}>{t.myCompanyName}</span><span className="font-medium" style={{ color: '#0f172a' }}>{companyData.name}</span></div>
              <div className="flex justify-between text-[12px]"><span style={{ color: '#94a3b8' }}>{t.myCompanyType}</span><span className="font-medium" style={{ color: '#0f172a' }}>{t.myTypes[companyData.type] || companyData.type}</span></div>
              <div className="flex justify-between text-[12px]"><span style={{ color: '#94a3b8' }}>{t.myPaidUpCapital}</span><span className="font-medium" style={{ color: '#0f172a' }}>RM{companyData.paidUpCapital?.toLocaleString()}</span></div>
              <div className="flex justify-between text-[12px]"><span style={{ color: '#94a3b8' }}>{t.myYearsOp}</span><span className="font-medium" style={{ color: '#0f172a' }}>{companyData.yearsOperating} {lang === 'en' ? 'years' : lang === 'bm' ? 'tahun' : '年'}</span></div>
              <div className="flex justify-between text-[12px]"><span style={{ color: '#94a3b8' }}>{t.myNature}</span><span className="font-medium" style={{ color: '#0f172a' }}>{companyData.natureOfBusiness}</span></div>
              <div className="flex justify-between text-[12px]"><span style={{ color: '#94a3b8' }}>{t.myDirectors}</span><span className="font-medium text-right" style={{ color: '#0f172a', maxWidth: '60%' }}>{companyData.directors?.join(', ')}</span></div>
            </div>
          )}

          {result.recommendation && (
            <div className="p-3 rounded-[12px]" style={{ background: '#eff6ff', border: '1px solid #bfdbfe' }}>
              <div className="text-[11px] font-bold mb-1" style={{ color: '#1d4ed8' }}>{lang === 'en' ? 'Recommendation' : lang === 'bm' ? 'Cadangan' : '建议'}</div>
              <p className="text-[12px]" style={{ color: '#1e40af' }}>{result.recommendation}</p>
            </div>
          )}

          {result.risks.length > 0 && (
            <div className="p-3 rounded-[12px]" style={{ background: '#fef2f2' }}>
              <div className="text-[11px] font-bold mb-2" style={{ color: '#dc2626' }}>⚠️ {t.riskFactors}</div>
              {result.risks.map((r, i) => <p key={i} className="text-[12px] mb-1" style={{ color: '#991b1b' }}>• {r}</p>)}
            </div>
          )}
          {result.positives.length > 0 && (
            <div className="p-3 rounded-[12px]" style={{ background: '#f0fdf4' }}>
              <div className="text-[11px] font-bold mb-2" style={{ color: '#16a34a' }}>✅ {t.positiveFactors}</div>
              {result.positives.map((p, i) => <p key={i} className="text-[12px] mb-1" style={{ color: '#166534' }}>• {p}</p>)}
            </div>
          )}

          <button onClick={downloadReport}
            className="w-full py-3 rounded-xl text-sm font-semibold transition flex items-center justify-center gap-2"
            style={{ background: '#f8fafc', border: '1px solid #e2e8f0', color: '#1e293b' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            {t.myDownloadReport}
          </button>

          <div className="p-3 rounded-[12px]" style={{ background: '#fffbeb', border: '1px solid #fde68a' }}>
            <p className="text-[11px]" style={{ color: '#92400e' }}>{t.myDisclaimer}</p>
          </div>
        </div>
      )}
    </Modal>
  );
}
