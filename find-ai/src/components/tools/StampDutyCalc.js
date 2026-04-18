'use client';

import { useState } from 'react';
import { Modal, ToolHeader, RMInput, ActionBtn } from './shared';
import { L } from './labels';

export default function StampDutyCalc({ lang, onClose }) {
  const t = L[lang];
  const [rent, setRent] = useState('');
  const [years, setYears] = useState(1);
  const [result, setResult] = useState(null);
  const yv = [1, 2, 3, 5];

  const calc = () => {
    const r = parseFloat(rent);
    if (!r || r <= 0) return;
    const annual = r * 12;

    // === SDSAS 2026 — No RM2,400 exemption, new rates ===
    const units = Math.ceil(annual / 250);
    const rate = years <= 1 ? 1 : years <= 3 ? 3 : years <= 5 ? 5 : 7;
    const grossDuty = units * rate;
    const duty = Math.max(grossDuty, grossDuty > 0 ? 10 : 0); // RM10 minimum

    // === Old rules (pre-2026) for comparison ===
    const oldExcess = Math.max(0, annual - 2400);
    const oldUnits = oldExcess > 0 ? Math.ceil(oldExcess / 250) : 0;
    const oldRate = years <= 1 ? 1 : years <= 3 ? 2 : 4;
    const oldDuty = oldUnits > 0 ? Math.max(oldUnits * oldRate, 10) : 0;

    setResult({ duty, annual, units, rate, oldDuty, increase: duty - oldDuty });
  };

  return (
    <Modal>
      <ToolHeader icon="📄" title={t.stampTitle} desc={t.stampDesc} onClose={onClose} />
      <div className="space-y-5">
        <RMInput value={rent} onChange={(v) => { setRent(v); setResult(null); }} placeholder="2500" label={t.monthlyRent} />
        <div>
          <label className="text-[11px] font-bold uppercase tracking-widest mb-2 block" style={{ color: '#94a3b8' }}>{t.leaseDuration}</label>
          <div className="flex gap-2">
            {yv.map((y, i) => (
              <button key={y} onClick={() => { setYears(y); setResult(null); }}
                className="flex-1 py-3 rounded-xl text-[13px] font-semibold transition active:scale-95"
                style={years === y
                  ? { background: '#0f172a', color: '#fff', boxShadow: '0 2px 8px rgba(15,23,42,0.2)' }
                  : { background: '#f8fafc', color: '#64748b', border: '1px solid #edf0f4' }
                }>
                {t.years[i]}
              </button>
            ))}
          </div>
        </div>
        <ActionBtn onClick={calc} disabled={!rent} label={t.calculate} />
      </div>
      {result && (
        <div className="mt-6 space-y-3 fade-in">
          {/* Main duty result */}
          <div className="p-5 rounded-2xl" style={{ background: '#0f172a' }}>
            <div className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: 'rgba(255,255,255,0.4)' }}>{t.stampResult}</div>
            <div className="text-3xl font-bold text-white">RM {result.duty.toFixed(2)}</div>
            <div className="flex items-center gap-3 mt-3 pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}>
              <span className="text-[11px]" style={{ color: 'rgba(255,255,255,0.5)' }}>{t.annualRent}: RM {result.annual.toLocaleString()}</span>
              <span className="text-[11px]" style={{ color: 'rgba(255,255,255,0.3)' }}>•</span>
              <span className="text-[11px]" style={{ color: 'rgba(255,255,255,0.5)' }}>{result.units} × RM{result.rate}</span>
            </div>
          </div>

          {/* SDSAS 2026 badge */}
          <div className="p-3.5 rounded-xl flex items-start gap-3" style={{ background: '#f8fafc', border: '1px solid #edf0f4' }}>
            <span className="text-[9px] px-2 py-1 rounded-md font-bold flex-shrink-0" style={{ background: '#0f172a', color: '#fff' }}>SDSAS 2026</span>
            <p className="text-[11px] leading-relaxed" style={{ color: '#64748b' }}>{t.sdsasNote}</p>
          </div>

          {/* Old vs New comparison */}
          {result.oldDuty > 0 && (
            <div className="p-3.5 rounded-xl flex justify-between items-center" style={{ background: '#f8fafc', border: '1px solid #edf0f4' }}>
              <div>
                <div className="text-[9px] font-bold uppercase tracking-widest" style={{ color: '#94a3b8' }}>{t.oldDuty}</div>
                <div className="text-[14px] font-semibold line-through" style={{ color: '#94a3b8' }}>RM {result.oldDuty.toFixed(2)}</div>
              </div>
              <div className="text-right">
                <div className="text-[9px] font-bold uppercase tracking-widest" style={{ color: '#94a3b8' }}>{t.dutyIncrease}</div>
                <div className="text-[14px] font-bold" style={{ color: '#dc2626' }}>+RM {result.increase.toFixed(2)}</div>
              </div>
            </div>
          )}
          {result.oldDuty === 0 && (
            <div className="p-3.5 rounded-xl" style={{ background: '#fef2f2', border: '1px solid #fecaca' }}>
              <p className="text-[11px] font-medium" style={{ color: '#991b1b' }}>{t.wasExempt}</p>
            </div>
          )}

          {/* Warnings */}
          <div className="pt-1 space-y-2">
            <p className="text-[11px]" style={{ color: '#94a3b8' }}>⚠️ {t.stampNote}</p>
            <p className="text-[11px]" style={{ color: '#94a3b8' }}>💡 {t.stampWho}</p>
            <p className="text-[11px]" style={{ color: '#94a3b8' }}>📅 {t.stampDeadline}</p>
          </div>
        </div>
      )}
    </Modal>
  );
}
