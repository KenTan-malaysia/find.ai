'use client';

import { useState } from 'react';
import { CloseBtn } from '../components/tools/shared';
import { L } from '../components/tools/labels';
import StampDutyCalc from '../components/tools/StampDutyCalc';
import RentalYieldCalc from '../components/tools/RentalYieldCalc';
import TenantScreen from '../components/tools/TenantScreen';
import AgreementHealth from '../components/tools/AgreementHealth';
import EvidenceVault from '../components/tools/EvidenceVault';
import CNMYTrustLink from '../components/tools/CNMYTrustLink';
import SituationNavigator from '../components/tools/SituationNavigator';
import LegalBridge from '../components/tools/LegalBridge';

// ===== TOOLS HUB =====
export default function Calculators({ lang, onClose }) {
  const [active, setActive] = useState(null);
  const t = L[lang];

  if (active === 'stamp') return <StampDutyCalc lang={lang} onClose={() => setActive(null)} />;
  if (active === 'yield') return <RentalYieldCalc lang={lang} onClose={() => setActive(null)} />;
  if (active === 'screen') return <TenantScreen lang={lang} onClose={() => setActive(null)} />;
  if (active === 'health') return <AgreementHealth lang={lang} onClose={() => setActive(null)} />;
  if (active === 'vault') return <EvidenceVault lang={lang} onClose={() => setActive(null)} />;
  if (active === 'trust') return <CNMYTrustLink lang={lang} onClose={() => setActive(null)} />;
  if (active === 'navigator') return <SituationNavigator lang={lang} onClose={() => setActive(null)} />;
  if (active === 'bridge') return <LegalBridge lang={lang} onClose={() => setActive(null)} />;

  const categories = [
    {
      label: lang === 'en' ? 'Calculators' : lang === 'bm' ? 'Kalkulator' : '计算器',
      tools: [
        { id: 'stamp', icon: '📄', title: t.stampTitle, desc: t.stampDesc },
        { id: 'yield', icon: '📊', title: t.yieldTitle, desc: t.yieldDesc },
      ],
    },
    {
      label: lang === 'en' ? 'Risk & Compliance' : lang === 'bm' ? 'Risiko & Pematuhan' : '风险与合规',
      tools: [
        { id: 'screen', icon: '🔍', title: t.screenTitle, desc: t.screenDesc },
        { id: 'health', icon: '📋', title: t.healthTitle, desc: t.healthDesc },
        { id: 'trust', icon: '🇨🇳', title: t.trustTitle, desc: t.trustDesc },
      ],
    },
    {
      label: lang === 'en' ? 'Protection & Legal' : lang === 'bm' ? 'Perlindungan & Undang-undang' : '保护与法律',
      tools: [
        { id: 'vault', icon: '🔒', title: t.vaultTitle, desc: t.vaultDesc },
        { id: 'navigator', icon: '🧭', title: t.navTitle, desc: t.navDesc },
        { id: 'bridge', icon: '⚖️', title: t.bridgeTitle, desc: t.bridgeDesc },
      ],
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center" style={{ background: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(4px)' }}>
      <div className="bg-white w-full max-w-lg rounded-t-[24px] sm:rounded-[20px] px-6 pt-5 pb-6 max-h-[88vh] overflow-y-auto fade-in" style={{ boxShadow: '0 -8px 40px rgba(15,23,42,0.12)' }}>
        {/* Drag handle */}
        <div className="flex justify-center mb-3 sm:hidden">
          <div className="w-10 h-1 rounded-full" style={{ background: '#e2e8f0' }} />
        </div>
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-[18px] font-bold" style={{ color: '#0f172a', letterSpacing: '-0.02em' }}>{t.tools}</h3>
          <CloseBtn onClick={onClose} />
        </div>

        {categories.map((cat, ci) => (
          <div key={ci} className={ci > 0 ? 'mt-5' : ''}>
            <div className="text-[10px] font-bold uppercase tracking-widest mb-2.5 pl-1" style={{ color: '#cbd5e1' }}>{cat.label}</div>
            <div className="space-y-2">
              {cat.tools.map(tool => (
                <button key={tool.id} onClick={() => setActive(tool.id)}
                  className="w-full flex items-center gap-3.5 text-left px-4 py-3.5 rounded-2xl transition active:scale-[0.98]"
                  style={{ background: '#f8fafc', border: '1px solid #edf0f4' }}>
                  <span className="text-2xl w-10 h-10 flex items-center justify-center rounded-xl flex-shrink-0" style={{ background: '#fff', border: '1px solid #edf0f4' }}>{tool.icon}</span>
                  <div className="min-w-0 flex-1">
                    <div className="text-[13px] font-semibold" style={{ color: '#0f172a' }}>{tool.title}</div>
                    <div className="text-[11px] mt-0.5" style={{ color: '#94a3b8' }}>{tool.desc}</div>
                  </div>
                  <svg className="flex-shrink-0" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="2" strokeLinecap="round"><path d="m9 18 6-6-6-6"/></svg>
                </button>
              ))}
            </div>
          </div>
        ))}

        {/* Shield security strip */}
        <div className="flex items-center justify-center gap-1.5 mt-5 pt-3" style={{ borderTop: '1px solid #f1f5f9' }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          <span className="text-[9px] font-medium" style={{ color: '#cbd5e1' }}>All data encrypted & stored on your device</span>
        </div>
      </div>
    </div>
  );
}
