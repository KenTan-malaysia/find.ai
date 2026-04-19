'use client';

import { useState } from 'react';
import { CloseBtn } from '../components/tools/shared';
import { L } from '../components/tools/labels';
import CNMYTrustLink from '../components/tools/CNMYTrustLink';

// ===== STAGE 1: HIDDEN IMPORTS — re-enable when ready =====
// import StampDutyCalc from '../components/tools/StampDutyCalc';
// import RentalYieldCalc from '../components/tools/RentalYieldCalc';
// import TenantScreen from '../components/tools/TenantScreen';
// import AgreementHealth from '../components/tools/AgreementHealth';
// import EvidenceVault from '../components/tools/EvidenceVault';
// import SituationNavigator from '../components/tools/SituationNavigator';
// import LegalBridge from '../components/tools/LegalBridge';

// ===== TOOLS HUB — Stage 1: Trust Link only =====
export default function Calculators({ lang, onClose }) {
  const [active, setActive] = useState(null);
  const t = L[lang];

  // Stage 1: Only trust tool is active
  if (active === 'trust') return <CNMYTrustLink lang={lang} onClose={() => setActive(null)} />;

  // ===== STAGE 1: Single tool — skip hub, go straight to Trust Link =====
  // Since there's only 1 tool, open it directly
  const tools = [
    { id: 'trust', icon: '🇨🇳', title: t.trustTitle, desc: t.trustDesc },
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

        <div className="space-y-2">
          {tools.map(tool => (
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

        {/* Shield security strip */}
        <div className="flex items-center justify-center gap-1.5 mt-5 pt-3" style={{ borderTop: '1px solid #f1f5f9' }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          <span className="text-[9px] font-medium" style={{ color: '#cbd5e1' }}>
            {lang === 'en' ? 'All data encrypted & stored on your device' : lang === 'bm' ? 'Data disulitkan & disimpan di peranti anda' : '所有数据加密并存储在您的设备上'}
          </span>
        </div>
      </div>
    </div>
  );
}
