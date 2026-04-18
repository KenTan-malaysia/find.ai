'use client';

import { useState } from 'react';
import { Modal, ToolHeader, ActionBtn } from './shared';
import { L } from './labels';

export default function AgreementHealth({ lang, onClose }) {
  const t = L[lang];
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);

  const toggle = (id) => {
    setAnswers(prev => ({ ...prev, [id]: !prev[id] }));
    setResult(null);
  };

  const check = () => {
    const total = t.clauses.length;
    const present = t.clauses.filter(c => answers[c.id]).length;
    const missingClauses = t.clauses.filter(c => !answers[c.id]);
    const pct = Math.round((present / total) * 100);
    const level = pct >= 80 ? 'strong' : pct >= 50 ? 'moderate' : 'weak';
    setResult({ present, total, pct, level, missingClauses });
  };

  const levelStyle = { strong: { color: '#16a34a', bg: '#f0fdf4' }, moderate: { color: '#d97706', bg: '#fffbeb' }, weak: { color: '#dc2626', bg: '#fef2f2' } };

  return (
    <Modal>
      <ToolHeader icon="📋" title={t.healthTitle} desc={t.healthDesc} onClose={onClose} />

      <div className="space-y-2 mb-5">
        {t.clauses.map(c => (
          <button key={c.id} onClick={() => toggle(c.id)}
            className="w-full flex items-center gap-3 text-left px-4 py-3.5 rounded-xl transition active:scale-[0.98]"
            style={answers[c.id]
              ? { background: '#f0fdf4', border: '1px solid #bbf7d0' }
              : { background: '#f8fafc', border: '1px solid #edf0f4' }
            }>
            <div className="w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0"
              style={answers[c.id] ? { background: '#0f172a' } : { background: '#e2e8f0' }}>
              {answers[c.id] && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>}
            </div>
            <span className="text-[13px] font-medium" style={{ color: answers[c.id] ? '#0f172a' : '#64748b' }}>{c.q}</span>
          </button>
        ))}
      </div>

      <ActionBtn onClick={check} label={t.checkAgreement} />

      {result && (
        <div className="mt-6 space-y-3 fade-in">
          <div className="p-5 rounded-2xl text-center" style={{ background: '#0f172a' }}>
            <div className="text-[9px] font-bold uppercase tracking-widest mb-1" style={{ color: 'rgba(255,255,255,0.35)' }}>{t.score}</div>
            <div className="text-3xl font-bold text-white">{result.pct}%</div>
            <div className="text-[12px] font-medium mt-1" style={{ color: levelStyle[result.level].color === '#16a34a' ? '#4ade80' : levelStyle[result.level].color === '#d97706' ? '#fbbf24' : '#f87171' }}>{t[result.level]}</div>
            <div className="text-[11px] text-gray-400 mt-1">{result.present}/{result.total} {t.present}</div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
              <div className="h-2 rounded-full transition-all" style={{ width: `${result.pct}%`, background: levelStyle[result.level].color }} />
            </div>
          </div>

          {result.missingClauses.length > 0 && (
            <div className="p-3 rounded-[12px] bg-red-50">
              <div className="text-[11px] font-bold text-red-700 mb-2">{t.missing}</div>
              {result.missingClauses.map(c => (
                <div key={c.id} className="mb-2 last:mb-0">
                  <p className="text-[12px] text-red-800 font-medium">• {c.q}</p>
                  <p className="text-[11px] text-red-600 pl-3 mt-0.5">{t.clauseFix[c.id]}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </Modal>
  );
}
