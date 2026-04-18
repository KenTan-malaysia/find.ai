'use client';

import { useState } from 'react';
import { Modal, ToolHeader, RMInput, ActionBtn } from './shared';
import { L } from './labels';

export default function RentalYieldCalc({ lang, onClose }) {
  const t = L[lang];
  const [price, setPrice] = useState('');
  const [rent, setRent] = useState('');
  const [expenses, setExpenses] = useState('');
  const [result, setResult] = useState(null);

  const calc = () => {
    const p = parseFloat(price), r = parseFloat(rent), e = parseFloat(expenses) || 0;
    if (!p || !r) return;
    const ar = r * 12, ae = e * 12;
    setResult({ gross: (ar / p) * 100, net: ((ar - ae) / p) * 100, annualProfit: ar - ae, monthlyProfit: r - e });
  };

  const v = (n) => n >= 5 ? { text: t.verdictGood, color: '#16a34a', bg: '#f0fdf4' } : n >= 3 ? { text: t.verdictOk, color: '#d97706', bg: '#fffbeb' } : { text: t.verdictWeak, color: '#dc2626', bg: '#fef2f2' };

  return (
    <Modal>
      <ToolHeader icon="📊" title={t.yieldTitle} desc={t.yieldDesc} onClose={onClose} />
      <div className="space-y-5">
        <RMInput value={price} onChange={(val) => { setPrice(val); setResult(null); }} placeholder="500000" label={t.purchasePrice} />
        <RMInput value={rent} onChange={(val) => { setRent(val); setResult(null); }} placeholder="2500" label={t.monthlyRent} />
        <div>
          <RMInput value={expenses} onChange={(val) => { setExpenses(val); setResult(null); }} placeholder="350" label={t.monthlyExpenses} />
          <p className="text-[10px] mt-1.5 pl-1" style={{ color: '#cbd5e1' }}>{t.expensesHint}</p>
        </div>
        <ActionBtn onClick={calc} disabled={!price || !rent} label={t.calculate} />
      </div>
      {result && (
        <div className="mt-6 space-y-3 fade-in">
          {/* Hero result — net yield */}
          <div className="p-5 rounded-2xl" style={{ background: '#0f172a' }}>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-[9px] font-bold uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.35)' }}>{t.grossYield}</div>
                <div className="text-2xl font-bold text-white mt-1">{result.gross.toFixed(2)}%</div>
              </div>
              <div>
                <div className="text-[9px] font-bold uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.35)' }}>{t.netYield}</div>
                <div className="text-2xl font-bold mt-1" style={{ color: v(result.net).color === '#16a34a' ? '#4ade80' : v(result.net).color === '#d97706' ? '#fbbf24' : '#f87171' }}>{result.net.toFixed(2)}%</div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2.5">
            <div className="p-3.5 rounded-xl" style={{ background: '#f8fafc', border: '1px solid #edf0f4' }}>
              <div className="text-[9px] font-bold uppercase tracking-widest" style={{ color: '#94a3b8' }}>{t.annualProfit}</div>
              <div className="text-[16px] font-bold mt-1" style={{ color: '#0f172a' }}>RM {result.annualProfit.toLocaleString()}</div>
            </div>
            <div className="p-3.5 rounded-xl" style={{ background: '#f8fafc', border: '1px solid #edf0f4' }}>
              <div className="text-[9px] font-bold uppercase tracking-widest" style={{ color: '#94a3b8' }}>{t.monthlyProfit}</div>
              <div className="text-[16px] font-bold mt-1" style={{ color: '#0f172a' }}>RM {result.monthlyProfit.toLocaleString()}</div>
            </div>
          </div>
          <div className="p-3.5 rounded-xl" style={{ background: v(result.net).bg, border: `1px solid ${v(result.net).color}25` }}>
            <div className="text-[9px] font-bold uppercase tracking-widest mb-1" style={{ color: '#94a3b8' }}>{t.verdict}</div>
            <div className="text-[13px] font-semibold" style={{ color: v(result.net).color }}>{v(result.net).text}</div>
          </div>
        </div>
      )}
    </Modal>
  );
}
