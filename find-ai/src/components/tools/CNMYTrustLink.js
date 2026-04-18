'use client';

import { useState } from 'react';
import { Modal, ToolHeader, RMInput, ActionBtn, CloseBtn } from './shared';
import { L } from './labels';

export default function CNMYTrustLink({ lang, onClose }) {
  const t = L[lang];
  const [uscc, setUscc] = useState('');
  const [usccValid, setUsccValid] = useState(null);
  const [company, setCompany] = useState({ name: '', nameEn: '', capital: '', taxRating: '', years: '', scope: '', abnormal: null, court: null });
  const [result, setResult] = useState(null);

  const validateUSCC = (code) => {
    const clean = code.replace(/\s/g, '').toUpperCase();
    setUscc(clean);
    if (clean.length === 0) { setUsccValid(null); return; }
    // USCC: 18 chars, alphanumeric (0-9, A-H, J-N, P-R, T-U, W-Y)
    const valid = /^[0-9A-HJ-NP-RT-UW-Y]{18}$/.test(clean);
    setUsccValid(clean.length === 18 ? valid : null);
    setResult(null);
  };

  const generateTrust = () => {
    const cap = parseFloat(company.capital) || 0;
    let score = 0;
    const risks = [];
    const positives = [];

    // Paid-in capital (30 pts)
    if (cap >= 10000000) { score += 30; positives.push(lang === 'en' ? `Strong capital: RMB ${(cap/10000).toLocaleString()}万 (${(cap/1000000).toFixed(1)}M)` : lang === 'bm' ? `Modal kukuh: RMB ${(cap/10000).toLocaleString()}万` : `实缴资本雄厚：RMB ${(cap/10000).toLocaleString()}万`); }
    else if (cap >= 1000000) { score += 20; positives.push(lang === 'en' ? `Adequate capital: RMB ${(cap/10000).toLocaleString()}万` : lang === 'bm' ? `Modal memadai: RMB ${(cap/10000).toLocaleString()}万` : `资本充足：RMB ${(cap/10000).toLocaleString()}万`); }
    else if (cap >= 100000) { score += 10; risks.push(lang === 'en' ? `Low capital: RMB ${(cap/10000).toFixed(1)}万 — may lack financial stability` : lang === 'bm' ? `Modal rendah — mungkin kurang stabil` : `资本较低 — 可能财务不稳定`); }
    else { risks.push(lang === 'en' ? 'Very low capital — high flight risk' : lang === 'bm' ? 'Modal sangat rendah — risiko tinggi' : '资本极低 — 跑路风险高'); }

    // Tax rating (25 pts)
    if (company.taxRating === 'A') { score += 25; positives.push(lang === 'en' ? 'Grade A taxpayer — excellent compliance' : lang === 'bm' ? 'Pembayar cukai Gred A' : 'A级纳税人 — 合规优秀'); }
    else if (company.taxRating === 'B') { score += 18; positives.push(lang === 'en' ? 'Grade B taxpayer — good compliance' : lang === 'bm' ? 'Pembayar cukai Gred B' : 'B级纳税人 — 合规良好'); }
    else if (company.taxRating === 'C') { score += 8; risks.push(lang === 'en' ? 'Grade C taxpayer — fair compliance, monitor closely' : lang === 'bm' ? 'Pembayar cukai Gred C — pantau rapat' : 'C级纳税人 — 需密切关注'); }
    else if (company.taxRating === 'D') { risks.push(lang === 'en' ? 'Grade D taxpayer — poor compliance, serious concern' : lang === 'bm' ? 'Pembayar cukai Gred D — kebimbangan serius' : 'D级纳税人 — 严重关注'); }

    // Years in operation (20 pts)
    const yrs = parseInt(company.years) || 0;
    if (yrs >= 10) { score += 20; positives.push(lang === 'en' ? `${yrs} years operating — well-established` : lang === 'bm' ? `${yrs} tahun beroperasi — mantap` : `运营${yrs}年 — 经验丰富`); }
    else if (yrs >= 5) { score += 15; positives.push(lang === 'en' ? `${yrs} years operating — established` : lang === 'bm' ? `${yrs} tahun beroperasi` : `运营${yrs}年 — 已站稳`); }
    else if (yrs >= 2) { score += 8; }
    else { risks.push(lang === 'en' ? `Only ${yrs} year(s) — new company, higher risk` : lang === 'bm' ? `Hanya ${yrs} tahun — syarikat baru` : `仅运营${yrs}年 — 新公司，风险较高`); }

    // Abnormal operations (15 pts)
    if (company.abnormal === false) { score += 15; positives.push(lang === 'en' ? 'Not on abnormal operations list' : lang === 'bm' ? 'Tiada dalam senarai tidak normal' : '未列入经营异常名录'); }
    else if (company.abnormal === true) { risks.push(lang === 'en' ? 'ON Abnormal Operations List — critical red flag' : lang === 'bm' ? 'DALAM senarai tidak normal — amaran kritikal' : '已列入经营异常名录 — 严重警告'); }

    // Court records (10 pts)
    if (company.court === false) { score += 10; positives.push(lang === 'en' ? 'No known court disputes' : lang === 'bm' ? 'Tiada pertikaian mahkamah' : '无已知法律纠纷'); }
    else if (company.court === true) { risks.push(lang === 'en' ? 'Has court/legal dispute records — investigate details' : lang === 'bm' ? 'Ada rekod pertikaian — siasat butiran' : '有法律纠纷记录 — 需调查详情'); }

    const grade = score >= 80 ? 'A' : score >= 60 ? 'B' : score >= 35 ? 'C' : 'D';
    setResult({ score, grade, risks, positives });
  };

  const downloadReport = () => {
    if (!result) return;
    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>CN-MY Trust Report - ${uscc}</title>
<style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:Georgia,serif;padding:40px;max-width:800px;margin:0 auto;color:#1a1a1a;line-height:1.6}
.header{text-align:center;border-bottom:3px double #333;padding-bottom:20px;margin-bottom:30px}
.header h1{font-size:22px;letter-spacing:1px;margin-bottom:5px}.header h2{font-size:14px;color:#555;font-weight:normal}
.grade-box{text-align:center;padding:20px;margin:20px 0;border:2px solid ${result.grade==='A'?'#16a34a':result.grade==='B'?'#3b82f6':result.grade==='C'?'#f59e0b':'#dc2626'};border-radius:8px}
.grade-letter{font-size:48px;font-weight:bold;color:${result.grade==='A'?'#16a34a':result.grade==='B'?'#3b82f6':result.grade==='C'?'#f59e0b':'#dc2626'}}
.section{margin-bottom:25px}.section h3{font-size:14px;text-transform:uppercase;letter-spacing:1px;color:#555;border-bottom:1px solid #ddd;padding-bottom:5px;margin-bottom:10px}
.field{display:flex;justify-content:space-between;padding:4px 0;font-size:13px}.field .label{color:#777}.field .value{font-weight:bold}
.risk{background:#fef2f2;border:1px solid #fecaca;border-radius:6px;padding:12px;margin-bottom:8px;font-size:12px;color:#991b1b}
.pos{background:#f0fdf4;border:1px solid #bbf7d0;border-radius:6px;padding:12px;margin-bottom:8px;font-size:12px;color:#166534}
.footer{text-align:center;margin-top:40px;padding-top:20px;border-top:1px solid #ddd;font-size:11px;color:#999}</style></head>
<body>
<div class="header"><h1>CN-MY ENTERPRISE TRUST REPORT</h1><h2>Cross-Border Tenant Verification</h2></div>
<div class="grade-box"><div class="grade-letter">GRADE ${result.grade}</div><div style="font-size:14px;color:#555;margin-top:5px">Trust Score: ${result.score}/100</div></div>
<div class="section"><h3>Company Details</h3>
<div class="field"><span class="label">USCC</span><span class="value">${uscc}</span></div>
${company.name ? `<div class="field"><span class="label">Company (CN)</span><span class="value">${company.name}</span></div>` : ''}
${company.nameEn ? `<div class="field"><span class="label">Company (EN)</span><span class="value">${company.nameEn}</span></div>` : ''}
<div class="field"><span class="label">Paid-in Capital</span><span class="value">RMB ${parseFloat(company.capital||0).toLocaleString()}</span></div>
<div class="field"><span class="label">Tax Rating</span><span class="value">Grade ${company.taxRating || 'N/A'}</span></div>
<div class="field"><span class="label">Years in Operation</span><span class="value">${company.years || 'N/A'}</span></div>
<div class="field"><span class="label">Business Scope</span><span class="value">${company.scope || 'N/A'}</span></div>
<div class="field"><span class="label">Abnormal Operations</span><span class="value">${company.abnormal ? 'YES ⚠️' : 'No'}</span></div>
<div class="field"><span class="label">Court Records</span><span class="value">${company.court ? 'YES ⚠️' : 'No'}</span></div></div>
${result.risks.length ? `<div class="section"><h3>Risk Factors</h3>${result.risks.map(r=>`<div class="risk">⚠️ ${r}</div>`).join('')}</div>` : ''}
${result.positives.length ? `<div class="section"><h3>Positive Factors</h3>${result.positives.map(p=>`<div class="pos">✅ ${p}</div>`).join('')}</div>` : ''}
<div class="section" style="background:#fffbeb;border:1px solid #fde68a;border-radius:6px;padding:16px;font-size:12px"><h3 style="color:#92400e;border:none;padding:0;margin-bottom:8px">Disclaimer</h3><p>${t.trustDisclaimer}</p></div>
<div class="footer"><p>Generated by Find.ai — CN-MY Enterprise Trust Link</p><p>${new Date().toLocaleString('en-MY')}</p></div>
</body></html>`;
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([html], { type: 'text/html' }));
    a.download = `Trust-Report-${uscc}-${new Date().toISOString().slice(0,10)}.html`;
    a.click();
  };

  const gradeStyle = { A: { color: '#16a34a', bg: '#f0fdf4', border: '#bbf7d0' }, B: { color: '#3b82f6', bg: '#eff6ff', border: '#bfdbfe' }, C: { color: '#f59e0b', bg: '#fffbeb', border: '#fde68a' }, D: { color: '#dc2626', bg: '#fef2f2', border: '#fecaca' } };

  return (
    <Modal>
      <ToolHeader icon="🇨🇳" title={t.trustTitle} desc={t.trustDesc} onClose={onClose} />

      {/* USCC Input */}
      <div className="space-y-3 mb-4">
        <div>
          <label className="text-[11px] font-semibold uppercase tracking-wider mb-1.5 block" style={{ color: '#64748b' }}>{t.usccLabel}</label>
          <input type="text" value={uscc} onChange={(e) => validateUSCC(e.target.value)} maxLength={18}
            placeholder="91310000MA1FL8XQ30" className="w-full py-2.5 px-3 rounded-xl text-sm font-mono tracking-wider focus:outline-none"
            style={{ border: `1.5px solid ${usccValid === false ? '#fecaca' : usccValid === true ? '#bbf7d0' : '#e2e8f0'}`, background: '#f8fafc', color: '#0f172a' }} />
          <p className="text-[10px] mt-1 pl-1" style={{ color: usccValid === false ? '#dc2626' : '#94a3b8' }}>
            {usccValid === false ? t.usccInvalid : t.usccHint}
          </p>
          {usccValid && <div className="flex items-center gap-1 mt-1"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg><span className="text-[10px] font-medium" style={{ color: '#16a34a' }}>Valid USCC format</span></div>}
        </div>

        {/* Company Details */}
        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2">
            <label className="text-[11px] font-semibold uppercase tracking-wider mb-1.5 block" style={{ color: '#64748b' }}>{t.companyName}</label>
            <input type="text" value={company.name} onChange={(e) => { setCompany(c => ({ ...c, name: e.target.value })); setResult(null); }}
              placeholder="深圳市某某科技有限公司" className="w-full py-2.5 px-3 rounded-xl text-sm focus:outline-none" style={{ border: '1px solid #e2e8f0', background: '#f8fafc', color: '#0f172a' }} />
          </div>
          <div className="col-span-2">
            <label className="text-[11px] font-semibold uppercase tracking-wider mb-1.5 block" style={{ color: '#64748b' }}>{t.companyNameEn}</label>
            <input type="text" value={company.nameEn} onChange={(e) => { setCompany(c => ({ ...c, nameEn: e.target.value })); setResult(null); }}
              placeholder="Shenzhen XYZ Technology Co., Ltd." className="w-full py-2.5 px-3 rounded-xl text-sm focus:outline-none" style={{ border: '1px solid #e2e8f0', background: '#f8fafc', color: '#0f172a' }} />
          </div>
        </div>

        <div>
          <label className="text-[11px] font-semibold uppercase tracking-wider mb-1.5 block" style={{ color: '#64748b' }}>{t.paidInCapital}</label>
          <div className="flex items-center gap-2 rounded-xl px-4 py-3" style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}>
            <span className="text-sm font-medium" style={{ color: '#94a3b8' }}>¥</span>
            <input type="number" value={company.capital} onChange={(e) => { setCompany(c => ({ ...c, capital: e.target.value })); setResult(null); }}
              placeholder="5000000" className="flex-1 bg-transparent text-lg font-semibold focus:outline-none" style={{ color: '#0f172a' }} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-[11px] font-semibold uppercase tracking-wider mb-1.5 block" style={{ color: '#64748b' }}>{t.taxRating}</label>
            <div className="grid grid-cols-4 gap-1.5">
              {['A','B','C','D'].map(r => (
                <button key={r} onClick={() => { setCompany(c => ({ ...c, taxRating: r })); setResult(null); }}
                  className="py-2 rounded-lg text-[13px] font-bold transition"
                  style={company.taxRating === r
                    ? { background: gradeStyle[r].bg, border: `1.5px solid ${gradeStyle[r].border}`, color: gradeStyle[r].color }
                    : { background: 'white', border: '1px solid #e2e8f0', color: '#94a3b8' }
                  }>{r}</button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-[11px] font-semibold uppercase tracking-wider mb-1.5 block" style={{ color: '#64748b' }}>{t.yearsOp}</label>
            <input type="number" value={company.years} onChange={(e) => { setCompany(c => ({ ...c, years: e.target.value })); setResult(null); }}
              placeholder="5" className="w-full py-2.5 px-3 rounded-xl text-sm focus:outline-none" style={{ border: '1px solid #e2e8f0', background: '#f8fafc', color: '#0f172a' }} />
          </div>
        </div>

        <div>
          <label className="text-[11px] font-semibold uppercase tracking-wider mb-1.5 block" style={{ color: '#64748b' }}>{t.bizScope}</label>
          <div className="flex flex-wrap gap-1.5">
            {['manufacturing','trading','logistics','tech','other'].map(s => (
              <button key={s} onClick={() => { setCompany(c => ({ ...c, scope: s })); setResult(null); }}
                className="px-3 py-1.5 rounded-full text-[11px] font-medium transition"
                style={company.scope === s
                  ? { background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.3)', color: '#1d4ed8' }
                  : { background: 'white', border: '1px solid #e2e8f0', color: '#64748b' }
                }>{t.bizScopes[s]}</button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-[11px] font-semibold uppercase tracking-wider mb-1.5 block" style={{ color: '#64748b' }}>{t.abnormalOps}</label>
            <div className="flex gap-2">
              <button onClick={() => { setCompany(c => ({ ...c, abnormal: false })); setResult(null); }}
                className="flex-1 py-2 rounded-xl text-[12px] font-medium transition"
                style={company.abnormal === false ? { background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#16a34a' } : { background: 'white', border: '1px solid #e2e8f0', color: '#64748b' }}>{t.no}</button>
              <button onClick={() => { setCompany(c => ({ ...c, abnormal: true })); setResult(null); }}
                className="flex-1 py-2 rounded-xl text-[12px] font-medium transition"
                style={company.abnormal === true ? { background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626' } : { background: 'white', border: '1px solid #e2e8f0', color: '#64748b' }}>{t.yes}</button>
            </div>
          </div>
          <div>
            <label className="text-[11px] font-semibold uppercase tracking-wider mb-1.5 block" style={{ color: '#64748b' }}>{t.courtRecords}</label>
            <div className="flex gap-2">
              <button onClick={() => { setCompany(c => ({ ...c, court: false })); setResult(null); }}
                className="flex-1 py-2 rounded-xl text-[12px] font-medium transition"
                style={company.court === false ? { background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#16a34a' } : { background: 'white', border: '1px solid #e2e8f0', color: '#64748b' }}>{t.no}</button>
              <button onClick={() => { setCompany(c => ({ ...c, court: true })); setResult(null); }}
                className="flex-1 py-2 rounded-xl text-[12px] font-medium transition"
                style={company.court === true ? { background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626' } : { background: 'white', border: '1px solid #e2e8f0', color: '#64748b' }}>{t.yes}</button>
            </div>
          </div>
        </div>

        <ActionBtn onClick={generateTrust} disabled={!usccValid || !company.taxRating || !company.capital} label={t.generateReport} />
      </div>

      {/* Result */}
      {result && (
        <div className="mt-4 space-y-3 fade-in">
          <div className="p-5 rounded-[14px] text-center" style={{ background: gradeStyle[result.grade].bg, border: `1.5px solid ${gradeStyle[result.grade].border}` }}>
            <div className="text-[10px] font-semibold uppercase tracking-wider mb-1" style={{ color: '#64748b' }}>{t.trustGrade}</div>
            <div className="text-4xl font-black mb-1" style={{ color: gradeStyle[result.grade].color }}>{result.grade}</div>
            <div className="text-[12px] font-medium mb-2" style={{ color: gradeStyle[result.grade].color }}>{t[`trust${result.grade}`]}</div>
            <div className="w-full rounded-full h-2 mt-3" style={{ background: '#e2e8f0' }}>
              <div className="h-2 rounded-full transition-all" style={{ width: `${result.score}%`, background: gradeStyle[result.grade].color }} />
            </div>
            <div className="text-[11px] mt-1" style={{ color: '#94a3b8' }}>{t.trustScore}: {result.score}/100</div>
          </div>

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
            {t.downloadReport}
          </button>

          <div className="p-3 rounded-[12px]" style={{ background: '#fffbeb', border: '1px solid #fde68a' }}>
            <p className="text-[11px]" style={{ color: '#92400e' }}>{t.trustDisclaimer}</p>
          </div>
        </div>
      )}
    </Modal>
  );
}
