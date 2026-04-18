'use client';

// ===== SHARED — Banking-app components =====
export const CloseBtn = ({ onClick }) => (
  <button onClick={onClick} className="w-10 h-10 flex items-center justify-center rounded-xl transition active:scale-90" style={{ background: '#f8fafc' }}>
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
  </button>
);

export const ToolHeader = ({ icon, title, desc, onClose }) => (
  <div className="flex items-center justify-between mb-6 pb-4" style={{ borderBottom: '1px solid #f1f5f9' }}>
    <div className="flex items-center gap-3">
      <span className="text-2xl">{icon}</span>
      <div>
        <h3 className="text-[16px] font-bold" style={{ color: '#0f172a', letterSpacing: '-0.01em' }}>{title}</h3>
        <p className="text-[11px] mt-0.5" style={{ color: '#94a3b8' }}>{desc}</p>
      </div>
    </div>
    <CloseBtn onClick={onClose} />
  </div>
);

export const Modal = ({ children }) => (
  <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center" style={{ background: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(4px)' }}>
    <div className="bg-white w-full max-w-lg rounded-t-[24px] sm:rounded-[20px] px-6 pt-5 pb-6 max-h-[92vh] overflow-y-auto fade-in" style={{ boxShadow: '0 -8px 40px rgba(15,23,42,0.12)' }}>
      {/* Drag handle */}
      <div className="flex justify-center mb-3 sm:hidden">
        <div className="w-10 h-1 rounded-full" style={{ background: '#e2e8f0' }} />
      </div>
      {children}
    </div>
  </div>
);

export const RMInput = ({ value, onChange, placeholder, label }) => (
  <div>
    <label className="text-[11px] font-bold uppercase tracking-widest mb-2 block" style={{ color: '#94a3b8' }}>{label}</label>
    <div className="flex items-center gap-2 rounded-xl px-4 py-3.5" style={{ background: '#f8fafc', border: '1px solid #edf0f4' }}>
      <span className="text-[13px] font-bold" style={{ color: '#94a3b8' }}>RM</span>
      <input type="number" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
        className="flex-1 bg-transparent text-[16px] font-semibold focus:outline-none" style={{ color: '#0f172a' }} />
    </div>
  </div>
);

export const ActionBtn = ({ onClick, disabled, label, color = '#0f172a' }) => (
  <button onClick={onClick} disabled={disabled}
    className="w-full py-4 rounded-xl text-[14px] font-bold text-white disabled:opacity-30 transition active:scale-[0.98]"
    style={{ background: color, boxShadow: `0 4px 16px ${color}40` }}>
    {label}
  </button>
);
