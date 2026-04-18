'use client';

import { useState } from 'react';
import { Modal, ToolHeader, RMInput, ActionBtn } from './shared';
import { L } from './labels';

export default function TenantScreen({ lang, onClose }) {
  const t = L[lang];
  const [salary, setSalary] = useState('');
  const [rent, setRent] = useState('');
  const [job, setJob] = useState('');
  const [occupants, setOccupants] = useState('');
  const [bedrooms, setBedrooms] = useState('');
  const [reason, setReason] = useState('');
  const [guarantor, setGuarantor] = useState(null);
  const [result, setResult] = useState(null);

  const screen = () => {
    const s = parseFloat(salary), r = parseFloat(rent), occ = parseInt(occupants) || 1, bed = parseInt(bedrooms) || 1;
    if (!s || !r) return;

    const ratio = s / r;
    let score = 0, reds = [], greens = [];

    // Affordability (40 pts)
    if (ratio >= 4) { score += 40; greens.push(lang === 'en' ? `Salary is ${ratio.toFixed(1)}x rent — very comfortable` : lang === 'bm' ? `Gaji ${ratio.toFixed(1)}x sewa — sangat selesa` : `薪资是租金的${ratio.toFixed(1)}倍 — 非常宽裕`); }
    else if (ratio >= 3) { score += 25; greens.push(lang === 'en' ? `Salary is ${ratio.toFixed(1)}x rent — acceptable` : lang === 'bm' ? `Gaji ${ratio.toFixed(1)}x sewa — boleh diterima` : `薪资是租金的${ratio.toFixed(1)}倍 — 可接受`); }
    else if (ratio >= 2) { score += 10; reds.push(lang === 'en' ? `Salary only ${ratio.toFixed(1)}x rent — tight budget, high default risk` : lang === 'bm' ? `Gaji hanya ${ratio.toFixed(1)}x sewa — bajet ketat` : `薪资仅为租金的${ratio.toFixed(1)}倍 — 预算紧张`); }
    else { reds.push(lang === 'en' ? `Salary below 2x rent — very high default risk` : lang === 'bm' ? `Gaji bawah 2x sewa — risiko sangat tinggi` : `薪资低于租金2倍 — 违约风险极高`); }

    // Job (20 pts)
    if (job === 'permanent') { score += 20; greens.push(lang === 'en' ? 'Permanent employment — stable income' : lang === 'bm' ? 'Pekerjaan tetap — pendapatan stabil' : '全职工作 — 收入稳定'); }
    else if (job === 'contract') { score += 12; }
    else if (job === 'selfEmployed') { score += 8; reds.push(lang === 'en' ? 'Self-employed — income may fluctuate, request bank statements' : lang === 'bm' ? 'Bekerja sendiri — minta penyata bank' : '自雇 — 收入可能波动，要求银行对账单'); }
    else if (job === 'unemployed') { reds.push(lang === 'en' ? 'No employment — who pays the rent?' : lang === 'bm' ? 'Tiada pekerjaan — siapa bayar sewa?' : '无业 — 谁付租金？'); }

    // Occupants (15 pts)
    if (occ <= bed * 2) { score += 15; }
    else { reds.push(lang === 'en' ? `${occ} people in ${bed} bedrooms — potential overcrowding` : lang === 'bm' ? `${occ} orang dalam ${bed} bilik — mungkin sesak` : `${bed}间卧室住${occ}人 — 可能过于拥挤`); }

    // Reason (15 pts)
    if (reason === 'evicted') { reds.push(lang === 'en' ? 'Was evicted — ask why and verify with previous landlord' : lang === 'bm' ? 'Pernah diusir — tanya sebab dan sahkan dengan tuan rumah lama' : '曾被驱逐 — 询问原因并联系前房东核实'); }
    else if (reason === 'leaseEnd' || reason === 'work' || reason === 'family') { score += 15; }
    else if (reason === 'firstTime') { score += 10; }

    // Guarantor (10 pts)
    if (guarantor) { score += 10; greens.push(lang === 'en' ? 'Has guarantor — added security' : lang === 'bm' ? 'Ada penjamin — keselamatan tambahan' : '有担保人 — 额外保障'); }
    else if (ratio < 3) { reds.push(lang === 'en' ? 'No guarantor with tight budget — request one' : lang === 'bm' ? 'Tiada penjamin dengan bajet ketat — minta seorang' : '预算紧张且无担保人 — 应要求提供'); }

    const level = score >= 70 ? 'low' : score >= 40 ? 'med' : 'high';
    let rec;
    if (level === 'low') rec = lang === 'en' ? 'Safe to proceed. Standard agreement is sufficient.' : lang === 'bm' ? 'Selamat diteruskan. Perjanjian standard mencukupi.' : '可以签约。标准协议即可。';
    else if (level === 'med') rec = lang === 'en' ? 'Proceed with caution. Request guarantor and extra deposit if possible.' : lang === 'bm' ? 'Teruskan dengan berhati-hati. Minta penjamin dan deposit tambahan.' : '谨慎进行。尽可能要求担保人和额外押金。';
    else rec = lang === 'en' ? 'High risk — consider rejecting or require guarantor + 3 months deposit + post-dated cheques.' : lang === 'bm' ? 'Risiko tinggi — pertimbangkan menolak atau minta penjamin + 3 bulan deposit.' : '高风险 — 考虑拒绝，或要求担保人 + 3个月押金 + 预签支票。';

    setResult({ score, level, reds, greens, ratio, rec });
  };

  const levelStyle = { low: { text: t.riskLow, color: '#16a34a', bg: '#f0fdf4' }, med: { text: t.riskMed, color: '#d97706', bg: '#fffbeb' }, high: { text: t.riskHigh, color: '#dc2626', bg: '#fef2f2' } };

  return (
    <Modal>
      <ToolHeader icon="🔍" title={t.screenTitle} desc={t.screenDesc} onClose={onClose} />
      <div className="space-y-5">
        <RMInput value={salary} onChange={(v) => { setSalary(v); setResult(null); }} placeholder="5000" label={t.tenantSalary} />
        <RMInput value={rent} onChange={(v) => { setRent(v); setResult(null); }} placeholder="2500" label={t.rentAmount} />

        <div>
          <label className="text-[11px] font-bold uppercase tracking-widest mb-2 block" style={{ color: '#94a3b8' }}>{t.jobType}</label>
          <div className="grid grid-cols-2 gap-2">
            {['permanent', 'contract', 'selfEmployed', 'unemployed'].map(j => (
              <button key={j} onClick={() => { setJob(j); setResult(null); }}
                className="py-3 rounded-xl text-[12px] font-semibold transition active:scale-95"
                style={job === j
                  ? { background: '#0f172a', color: '#fff', boxShadow: '0 2px 8px rgba(15,23,42,0.2)' }
                  : { background: '#f8fafc', color: '#64748b', border: '1px solid #edf0f4' }
                }>
                {t.jobs[j]}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-[11px] font-bold uppercase tracking-widest mb-2 block" style={{ color: '#94a3b8' }}>{t.occupants}</label>
            <input type="number" value={occupants} onChange={(e) => { setOccupants(e.target.value); setResult(null); }} placeholder="2"
              className="w-full py-3 px-4 rounded-xl text-[14px] font-medium focus:outline-none"
              style={{ background: '#f8fafc', border: '1px solid #edf0f4', color: '#0f172a' }} />
          </div>
          <div>
            <label className="text-[11px] font-bold uppercase tracking-widest mb-2 block" style={{ color: '#94a3b8' }}>{t.bedrooms}</label>
            <input type="number" value={bedrooms} onChange={(e) => { setBedrooms(e.target.value); setResult(null); }} placeholder="3"
              className="w-full py-3 px-4 rounded-xl text-[14px] font-medium focus:outline-none"
              style={{ background: '#f8fafc', border: '1px solid #edf0f4', color: '#0f172a' }} />
          </div>
        </div>

        <div>
          <label className="text-[11px] font-bold uppercase tracking-widest mb-2 block" style={{ color: '#94a3b8' }}>{t.moveReason}</label>
          <div className="flex flex-wrap gap-2">
            {['leaseEnd', 'work', 'family', 'evicted', 'firstTime'].map(r => (
              <button key={r} onClick={() => { setReason(r); setResult(null); }}
                className="px-3.5 py-2 rounded-xl text-[11px] font-semibold transition active:scale-95"
                style={reason === r
                  ? { background: '#0f172a', color: '#fff' }
                  : { background: '#f8fafc', color: '#64748b', border: '1px solid #edf0f4' }
                }>
                {t.reasons[r]}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-[11px] font-bold uppercase tracking-widest mb-2 block" style={{ color: '#94a3b8' }}>{t.hasGuarantor}</label>
          <div className="flex gap-2">
            <button onClick={() => { setGuarantor(true); setResult(null); }}
              className="flex-1 py-3 rounded-xl text-[13px] font-semibold transition active:scale-95"
              style={guarantor === true
                ? { background: '#0f172a', color: '#fff' }
                : { background: '#f8fafc', color: '#64748b', border: '1px solid #edf0f4' }
              }>{t.yes}</button>
            <button onClick={() => { setGuarantor(false); setResult(null); }}
              className="flex-1 py-3 rounded-xl text-[13px] font-semibold transition active:scale-95"
              style={guarantor === false
                ? { background: '#0f172a', color: '#fff' }
                : { background: '#f8fafc', color: '#64748b', border: '1px solid #edf0f4' }
              }>{t.no}</button>
          </div>
        </div>

        <ActionBtn onClick={screen} disabled={!salary || !rent || !job} label={t.checkTenant} />
      </div>

      {result && (
        <div className="mt-6 space-y-3 fade-in">
          <div className="p-5 rounded-2xl text-center" style={{ background: '#0f172a' }}>
            <div className="text-[9px] font-bold uppercase tracking-widest mb-1" style={{ color: 'rgba(255,255,255,0.35)' }}>{t.riskLevel}</div>
            <div className="text-xl font-bold" style={{ color: levelStyle[result.level].color === '#16a34a' ? '#4ade80' : levelStyle[result.level].color === '#d97706' ? '#fbbf24' : '#f87171' }}>{levelStyle[result.level].text}</div>
            <div className="text-[12px] mt-1" style={{ color: 'rgba(255,255,255,0.5)' }}>{t.affordability}: {result.ratio.toFixed(1)}x</div>
            <div className="w-full rounded-full h-1.5 mt-3" style={{ background: 'rgba(255,255,255,0.1)' }}>
              <div className="h-1.5 rounded-full transition-all" style={{ width: `${result.score}%`, background: levelStyle[result.level].color === '#16a34a' ? '#4ade80' : levelStyle[result.level].color === '#d97706' ? '#fbbf24' : '#f87171' }} />
            </div>
            <div className="text-[11px] mt-1" style={{ color: 'rgba(255,255,255,0.3)' }}>{result.score}/100</div>
          </div>

          {result.reds.length > 0 && (
            <div className="p-3 rounded-[12px] bg-red-50">
              <div className="text-[11px] font-bold text-red-700 mb-2">{t.redFlags}</div>
              {result.reds.map((r, i) => <p key={i} className="text-[12px] text-red-800 mb-1">• {r}</p>)}
            </div>
          )}
          {result.greens.length > 0 && (
            <div className="p-3 rounded-[12px] bg-green-50">
              <div className="text-[11px] font-bold text-green-700 mb-2">{t.greenFlags}</div>
              {result.greens.map((g, i) => <p key={i} className="text-[12px] text-green-800 mb-1">• {g}</p>)}
            </div>
          )}

          <div className="p-3 rounded-[12px] border border-indigo-100 bg-indigo-50">
            <div className="text-[11px] font-bold text-indigo-700 mb-1">{t.recommendation}</div>
            <p className="text-[12px] text-indigo-900">{result.rec}</p>
          </div>
        </div>
      )}
    </Modal>
  );
}
