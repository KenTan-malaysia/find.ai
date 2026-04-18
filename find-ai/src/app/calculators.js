'use client';

import { useState } from 'react';

// ===== SHARED =====
const CloseBtn = ({ onClick }) => (
  <button onClick={onClick} className="text-gray-400 hover:text-gray-600 p-1">
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
  </button>
);

const ToolHeader = ({ icon, gradient, title, desc, onClose }) => (
  <div className="flex items-center justify-between mb-6">
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-[12px] flex items-center justify-center" style={{ background: gradient }}>
        <span className="text-lg">{icon}</span>
      </div>
      <div>
        <h3 className="text-base font-bold text-gray-900">{title}</h3>
        <p className="text-[11px] text-gray-400">{desc}</p>
      </div>
    </div>
    <CloseBtn onClick={onClose} />
  </div>
);

const Modal = ({ children }) => (
  <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center" style={{ background: 'rgba(0,0,0,0.4)' }}>
    <div className="bg-white w-full max-w-lg rounded-t-[20px] sm:rounded-[20px] p-6 max-h-[90vh] overflow-y-auto fade-in">
      {children}
    </div>
  </div>
);

const RMInput = ({ value, onChange, placeholder, label }) => (
  <div>
    <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">{label}</label>
    <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-4 py-3">
      <span className="text-sm text-gray-400 font-medium">RM</span>
      <input type="number" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
        className="flex-1 bg-transparent text-lg font-semibold text-gray-900 focus:outline-none" />
    </div>
  </div>
);

// ===== LABELS =====
const L = {
  en: {
    tools: 'Property Tools',
    stampTitle: 'Stamp Duty Calculator', stampDesc: 'Tenancy agreement stamp duty',
    yieldTitle: 'Rental Yield Calculator', yieldDesc: 'Is your property worth it?',
    screenTitle: 'Tenant Screening', screenDesc: 'Check tenant risk before signing',
    healthTitle: 'Agreement Health Check', healthDesc: 'Is your agreement protecting you?',
    monthlyRent: 'Monthly Rent (RM)', leaseDuration: 'Lease Duration',
    years: ['1 year', '2 years', '3 years', '5 years'],
    stampResult: 'Stamp Duty Payable (SDSAS 2026)', stampExempt: 'Exempt — no stamp duty required',
    stampNote: 'Unstamped agreements cannot be used as evidence in court.',
    stampWho: 'Usually paid by tenant, but negotiable.',
    stampDeadline: 'Must stamp within 30 days of signing. Late = penalty up to 100%.',
    stampPerUnit: 'per RM250 unit of annual rent',
    sdsasNote: 'Self-assessment system (SDSAS) effective Jan 2026. RM2,400 exemption removed. You calculate and pay via MyTax.',
    oldDuty: 'Old Rules (Pre-2026)', dutyIncrease: 'Increase',
    wasExempt: 'This rental was previously EXEMPT (under RM2,400/yr). Under 2026 rules, stamp duty now applies.',
    annualRent: 'Annual Rent', purchasePrice: 'Purchase Price (RM)',
    monthlyExpenses: 'Monthly Expenses (RM)', expensesHint: 'Maintenance, insurance, assessment, quit rent',
    grossYield: 'Gross Yield', netYield: 'Net Yield',
    annualProfit: 'Annual Net Profit', monthlyProfit: 'Monthly Net Profit',
    verdict: 'Verdict',
    verdictGood: 'Good investment — above market average',
    verdictOk: 'Average — consider if appreciation potential exists',
    verdictWeak: 'Below average — review your rental pricing or expenses',
    calculate: 'Calculate',
    // Screening
    tenantSalary: 'Tenant Monthly Salary (RM)', rentAmount: 'Your Monthly Rent (RM)',
    jobType: 'Employment Type', occupants: 'Number of Occupants', bedrooms: 'Bedrooms in Unit',
    moveReason: 'Reason for Moving', hasGuarantor: 'Has Guarantor?',
    jobs: { permanent: 'Permanent', contract: 'Contract', selfEmployed: 'Self-Employed', unemployed: 'Unemployed/Student' },
    reasons: { leaseEnd: 'Lease ended', work: 'Closer to work', family: 'Family reasons', evicted: 'Evicted / Asked to leave', firstTime: 'First time renting' },
    yes: 'Yes', no: 'No', checkTenant: 'Screen Tenant',
    riskLevel: 'Risk Level', riskLow: 'LOW RISK', riskMed: 'MEDIUM RISK', riskHigh: 'HIGH RISK',
    redFlags: 'Red Flags', greenFlags: 'Green Flags', recommendation: 'Recommendation',
    affordability: 'Affordability Ratio',
    // Health check
    checkAgreement: 'Check Agreement', score: 'Agreement Score', missing: 'Missing Clauses', present: 'Present',
    strong: 'STRONG — Well protected', moderate: 'MODERATE — Some gaps to fix', weak: 'WEAK — Major gaps, high risk',
    clauses: [
      { id: 'latePay', q: 'Late payment penalty clause?' },
      { id: 'deposit', q: 'Security deposit amount specified (2+1)?' },
      { id: 'maintenance', q: 'Maintenance responsibility defined?' },
      { id: 'sublet', q: 'Subletting prohibition included?' },
      { id: 'earlyTermination', q: 'Early termination clause with notice period?' },
      { id: 'inventory', q: 'Check-in/check-out inventory checklist?' },
      { id: 'utility', q: 'Utility transfer & final bill clause?' },
      { id: 'stampDuty', q: 'Stamp duty responsibility stated?' },
      { id: 'renewal', q: 'Renewal terms defined?' },
      { id: 'dispute', q: 'Dispute resolution method stated?' },
    ],
    clauseFix: {
      latePay: 'Add: "Late payment charge of 10% p.a. on outstanding sum after 14 days"',
      deposit: 'Add: "Security deposit of 2 months rent + 0.5 month utility deposit"',
      maintenance: 'Add: "Tenant responsible for wear & tear items. Landlord responsible for structural & major systems"',
      sublet: 'Add: "Tenant shall not sublet, assign or part with possession without written consent"',
      earlyTermination: 'Add: "Either party may terminate with 2 months written notice + forfeiture of deposit"',
      inventory: 'Add: "Detailed inventory with photos to be signed by both parties at check-in and check-out"',
      utility: 'Add: "Tenant to transfer utilities to own name within 14 days. Final bills to be settled before deposit refund"',
      stampDuty: 'Add: "Stamp duty on this agreement shall be borne by the Tenant"',
      renewal: 'Add: "Tenant has first right of renewal with 2 months notice before expiry at revised terms"',
      dispute: 'Add: "Disputes to be referred to mediation before court proceedings"',
    },
  },
  bm: {
    tools: 'Alat Hartanah',
    stampTitle: 'Kalkulator Duti Setem', stampDesc: 'Duti setem perjanjian sewa',
    yieldTitle: 'Kalkulator Pulangan Sewa', yieldDesc: 'Adakah hartanah anda berbaloi?',
    screenTitle: 'Saringan Penyewa', screenDesc: 'Semak risiko penyewa sebelum tandatangan',
    healthTitle: 'Semakan Perjanjian', healthDesc: 'Adakah perjanjian anda melindungi anda?',
    monthlyRent: 'Sewa Bulanan (RM)', leaseDuration: 'Tempoh Sewa',
    years: ['1 tahun', '2 tahun', '3 tahun', '5 tahun'],
    stampResult: 'Duti Setem Perlu Dibayar (SDSAS 2026)', stampExempt: 'Dikecualikan — tiada duti setem',
    stampNote: 'Perjanjian tanpa setem tidak boleh digunakan di mahkamah.',
    stampWho: 'Biasanya dibayar oleh penyewa, tetapi boleh dirunding.',
    stampDeadline: 'Mesti setem dalam 30 hari selepas tandatangan. Lewat = penalti sehingga 100%.',
    stampPerUnit: 'setiap unit RM250 sewa tahunan',
    sdsasNote: 'Sistem taksiran sendiri (SDSAS) berkuat kuasa Jan 2026. Pengecualian RM2,400 dimansuhkan. Anda kira dan bayar melalui MyTax.',
    oldDuty: 'Kadar Lama (Sebelum 2026)', dutyIncrease: 'Kenaikan',
    wasExempt: 'Sewa ini sebelum ini DIKECUALIKAN (bawah RM2,400/thn). Di bawah peraturan 2026, duti setem kini dikenakan.',
    annualRent: 'Sewa Tahunan', purchasePrice: 'Harga Belian (RM)',
    monthlyExpenses: 'Perbelanjaan Bulanan (RM)', expensesHint: 'Penyelenggaraan, insurans, cukai taksiran',
    grossYield: 'Pulangan Kasar', netYield: 'Pulangan Bersih',
    annualProfit: 'Untung Tahunan', monthlyProfit: 'Untung Bulanan',
    verdict: 'Keputusan',
    verdictGood: 'Pelaburan baik — melebihi purata pasaran',
    verdictOk: 'Sederhana — pertimbangkan potensi kenaikan nilai',
    verdictWeak: 'Di bawah purata — semak harga sewa atau perbelanjaan',
    calculate: 'Kira',
    tenantSalary: 'Gaji Bulanan Penyewa (RM)', rentAmount: 'Sewa Bulanan (RM)',
    jobType: 'Jenis Pekerjaan', occupants: 'Bilangan Penghuni', bedrooms: 'Bilik Tidur',
    moveReason: 'Sebab Pindah', hasGuarantor: 'Ada Penjamin?',
    jobs: { permanent: 'Tetap', contract: 'Kontrak', selfEmployed: 'Sendiri', unemployed: 'Menganggur/Pelajar' },
    reasons: { leaseEnd: 'Sewa tamat', work: 'Dekat tempat kerja', family: 'Sebab keluarga', evicted: 'Diusir', firstTime: 'Pertama kali sewa' },
    yes: 'Ya', no: 'Tidak', checkTenant: 'Saring Penyewa',
    riskLevel: 'Tahap Risiko', riskLow: 'RENDAH', riskMed: 'SEDERHANA', riskHigh: 'TINGGI',
    redFlags: 'Amaran', greenFlags: 'Positif', recommendation: 'Cadangan',
    affordability: 'Nisbah Kemampuan',
    checkAgreement: 'Semak Perjanjian', score: 'Skor Perjanjian', missing: 'Klausa Tiada', present: 'Ada',
    strong: 'KUAT — Dilindungi dengan baik', moderate: 'SEDERHANA — Ada jurang perlu diperbaiki', weak: 'LEMAH — Jurang besar, risiko tinggi',
    clauses: [
      { id: 'latePay', q: 'Klausa denda bayaran lewat?' },
      { id: 'deposit', q: 'Jumlah deposit dinyatakan (2+1)?' },
      { id: 'maintenance', q: 'Tanggungjawab penyelenggaraan dinyatakan?' },
      { id: 'sublet', q: 'Larangan sewa kecil?' },
      { id: 'earlyTermination', q: 'Klausa penamatan awal?' },
      { id: 'inventory', q: 'Senarai semak inventori masuk/keluar?' },
      { id: 'utility', q: 'Klausa pemindahan utiliti & bil akhir?' },
      { id: 'stampDuty', q: 'Tanggungjawab duti setem dinyatakan?' },
      { id: 'renewal', q: 'Terma pembaharuan dinyatakan?' },
      { id: 'dispute', q: 'Kaedah penyelesaian pertikaian?' },
    ],
    clauseFix: {
      latePay: 'Tambah: "Caj lewat 10% setahun atas baki tertunggak selepas 14 hari"',
      deposit: 'Tambah: "Deposit keselamatan 2 bulan sewa + 0.5 bulan deposit utiliti"',
      maintenance: 'Tambah: "Penyewa bertanggungjawab atas haus & lusuh. Tuan rumah bertanggungjawab atas struktur"',
      sublet: 'Tambah: "Penyewa tidak boleh menyewa kecil tanpa kebenaran bertulis"',
      earlyTermination: 'Tambah: "Mana-mana pihak boleh menamatkan dengan notis 2 bulan bertulis"',
      inventory: 'Tambah: "Inventori terperinci dengan gambar ditandatangani kedua-dua pihak"',
      utility: 'Tambah: "Penyewa perlu tukar nama utiliti dalam 14 hari"',
      stampDuty: 'Tambah: "Duti setem ditanggung oleh Penyewa"',
      renewal: 'Tambah: "Penyewa mempunyai hak pembaharuan pertama dengan notis 2 bulan"',
      dispute: 'Tambah: "Pertikaian dirujuk kepada mediasi sebelum mahkamah"',
    },
  },
  zh: {
    tools: '房产工具',
    stampTitle: '印花税计算器', stampDesc: '租约印花税',
    yieldTitle: '租金回报计算器', yieldDesc: '您的房产值得投资吗？',
    screenTitle: '租客筛查', screenDesc: '签约前检查租客风险',
    healthTitle: '协议健康检查', healthDesc: '您的协议是否保护您？',
    monthlyRent: '月租金 (RM)', leaseDuration: '租约期限',
    years: ['1年', '2年', '3年', '5年'],
    stampResult: '应付印花税 (SDSAS 2026)', stampExempt: '豁免 — 无需缴纳印花税',
    stampNote: '未盖章的协议不能在法庭上作为证据。',
    stampWho: '通常由租客支付，但可协商。',
    stampDeadline: '签约后30天内必须盖章。逾期 = 最高100%罚款。',
    stampPerUnit: '每RM250年租单位',
    sdsasNote: '自我评估系统（SDSAS）2026年1月生效。RM2,400豁免已取消。您需通过MyTax自行计算和缴付。',
    oldDuty: '旧规则（2026年前）', dutyIncrease: '涨幅',
    wasExempt: '此租金之前获豁免（低于RM2,400/年）。2026年新规下，现需缴纳印花税。',
    annualRent: '年租金', purchasePrice: '购买价格 (RM)',
    monthlyExpenses: '每月支出 (RM)', expensesHint: '管理费、保险、门牌税、地税',
    grossYield: '毛回报率', netYield: '净回报率',
    annualProfit: '年净利润', monthlyProfit: '月净利润',
    verdict: '评估',
    verdictGood: '好投资 — 高于市场平均',
    verdictOk: '一般 — 考虑升值潜力',
    verdictWeak: '低于平均 — 检查租金或支出',
    calculate: '计算',
    tenantSalary: '租客月薪 (RM)', rentAmount: '月租金 (RM)',
    jobType: '就业类型', occupants: '住户人数', bedrooms: '卧室数量',
    moveReason: '搬迁原因', hasGuarantor: '有担保人？',
    jobs: { permanent: '全职', contract: '合同', selfEmployed: '自雇', unemployed: '无业/学生' },
    reasons: { leaseEnd: '租约到期', work: '靠近工作', family: '家庭原因', evicted: '被驱逐', firstTime: '首次租房' },
    yes: '是', no: '否', checkTenant: '筛查租客',
    riskLevel: '风险等级', riskLow: '低风险', riskMed: '中等风险', riskHigh: '高风险',
    redFlags: '警告', greenFlags: '优点', recommendation: '建议',
    affordability: '负担能力比',
    checkAgreement: '检查协议', score: '协议评分', missing: '缺失条款', present: '已有',
    strong: '强 — 保护良好', moderate: '中等 — 需要修补', weak: '弱 — 重大漏洞，高风险',
    clauses: [
      { id: 'latePay', q: '逾期付款罚款条款？' },
      { id: 'deposit', q: '押金金额明确（2+1）？' },
      { id: 'maintenance', q: '维修责任明确？' },
      { id: 'sublet', q: '禁止转租条款？' },
      { id: 'earlyTermination', q: '提前终止条款？' },
      { id: 'inventory', q: '入住/退房清单？' },
      { id: 'utility', q: '水电转名及最终账单条款？' },
      { id: 'stampDuty', q: '印花税责任明确？' },
      { id: 'renewal', q: '续约条款？' },
      { id: 'dispute', q: '争议解决方式？' },
    ],
    clauseFix: {
      latePay: '添加："逾期14天后按年利率10%收取滞纳金"',
      deposit: '添加："押金为2个月租金 + 0.5个月水电押金"',
      maintenance: '添加："租客负责日常损耗，房东负责结构性维修"',
      sublet: '添加："未经书面同意，租客不得转租"',
      earlyTermination: '添加："任何一方可提前2个月书面通知终止"',
      inventory: '添加："双方签署附照片的详细清单"',
      utility: '添加："租客须在14天内将水电转至本人名下"',
      stampDuty: '添加："印花税由租客承担"',
      renewal: '添加："租客有优先续约权，需提前2个月通知"',
      dispute: '添加："争议先提交调解再诉诸法院"',
    },
  },
};

// ===== STAMP DUTY (SDSAS 2026) =====
function StampDutyCalc({ lang, onClose }) {
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
      <ToolHeader icon="📄" gradient="linear-gradient(135deg, #f59e0b, #eab308)" title={t.stampTitle} desc={t.stampDesc} onClose={onClose} />
      <div className="space-y-4">
        <RMInput value={rent} onChange={(v) => { setRent(v); setResult(null); }} placeholder="2500" label={t.monthlyRent} />
        <div>
          <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">{t.leaseDuration}</label>
          <div className="flex gap-2">
            {yv.map((y, i) => (
              <button key={y} onClick={() => { setYears(y); setResult(null); }}
                className={`flex-1 py-2.5 rounded-xl text-[13px] font-medium transition border ${years === y ? 'bg-amber-50 border-amber-300 text-amber-700' : 'bg-white border-gray-200 text-gray-500'}`}>
                {t.years[i]}
              </button>
            ))}
          </div>
        </div>
        <button onClick={calc} disabled={!rent} className="w-full py-3 rounded-xl text-sm font-semibold text-white disabled:opacity-40" style={{ background: 'linear-gradient(135deg, #f59e0b, #eab308)' }}>{t.calculate}</button>
      </div>
      {result && (
        <div className="mt-5 space-y-3 fade-in">
          {/* Main duty result */}
          <div className="p-4 rounded-[14px] border" style={{ background: '#fffbeb', borderColor: '#fde68a' }}>
            <div className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-2">{t.stampResult}</div>
            <div className="text-2xl font-bold" style={{ color: '#92400e' }}>RM {result.duty.toFixed(2)}</div>
            <div className="text-[12px] text-gray-500 mt-2">{t.annualRent}: RM {result.annual.toLocaleString()}</div>
            <div className="text-[11px] text-gray-400 mt-1">{result.units} × RM{result.rate} {t.stampPerUnit}</div>
          </div>

          {/* SDSAS 2026 badge */}
          <div className="p-3 rounded-[12px] bg-blue-50 border border-blue-100">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 font-bold">SDSAS 2026</span>
            </div>
            <p className="text-[11px] text-blue-800">{t.sdsasNote}</p>
          </div>

          {/* Old vs New comparison */}
          {result.oldDuty > 0 && (
            <div className="p-3 rounded-[12px] bg-gray-50 border border-gray-100">
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-[10px] font-semibold text-gray-400 uppercase">{t.oldDuty}</div>
                  <div className="text-sm font-semibold text-gray-500 line-through">RM {result.oldDuty.toFixed(2)}</div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] font-semibold text-gray-400 uppercase">{t.dutyIncrease}</div>
                  <div className="text-sm font-bold text-red-600">+RM {result.increase.toFixed(2)}</div>
                </div>
              </div>
            </div>
          )}
          {result.oldDuty === 0 && (
            <div className="p-3 rounded-[12px] bg-red-50 border border-red-100">
              <p className="text-[11px] text-red-700 font-medium">{t.wasExempt}</p>
            </div>
          )}

          {/* Warnings */}
          <div className="pt-2 space-y-1.5">
            <p className="text-[11px] text-gray-500">⚠️ {t.stampNote}</p>
            <p className="text-[11px] text-gray-500">💡 {t.stampWho}</p>
            <p className="text-[11px] text-gray-500">📅 {t.stampDeadline}</p>
          </div>
        </div>
      )}
    </Modal>
  );
}

// ===== RENTAL YIELD =====
function RentalYieldCalc({ lang, onClose }) {
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
      <ToolHeader icon="📊" gradient="linear-gradient(135deg, #16a34a, #22c55e)" title={t.yieldTitle} desc={t.yieldDesc} onClose={onClose} />
      <div className="space-y-4">
        <RMInput value={price} onChange={(val) => { setPrice(val); setResult(null); }} placeholder="500000" label={t.purchasePrice} />
        <RMInput value={rent} onChange={(val) => { setRent(val); setResult(null); }} placeholder="2500" label={t.monthlyRent} />
        <div>
          <RMInput value={expenses} onChange={(val) => { setExpenses(val); setResult(null); }} placeholder="350" label={t.monthlyExpenses} />
          <p className="text-[10px] text-gray-400 mt-1 pl-1">{t.expensesHint}</p>
        </div>
        <button onClick={calc} disabled={!price || !rent} className="w-full py-3 rounded-xl text-sm font-semibold text-white disabled:opacity-40" style={{ background: 'linear-gradient(135deg, #16a34a, #22c55e)' }}>{t.calculate}</button>
      </div>
      {result && (
        <div className="mt-5 space-y-3 fade-in">
          <div className="grid grid-cols-2 gap-2.5">
            <div className="p-3.5 rounded-[12px] bg-gray-50 text-center">
              <div className="text-[10px] font-semibold text-gray-400 uppercase mb-1">{t.grossYield}</div>
              <div className="text-xl font-bold text-gray-900">{result.gross.toFixed(2)}%</div>
            </div>
            <div className="p-3.5 rounded-[12px] text-center" style={{ background: v(result.net).bg }}>
              <div className="text-[10px] font-semibold text-gray-400 uppercase mb-1">{t.netYield}</div>
              <div className="text-xl font-bold" style={{ color: v(result.net).color }}>{result.net.toFixed(2)}%</div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2.5">
            <div className="p-3 rounded-[12px] bg-gray-50">
              <div className="text-[10px] font-semibold text-gray-400 uppercase mb-0.5">{t.annualProfit}</div>
              <div className="text-base font-bold">RM {result.annualProfit.toLocaleString()}</div>
            </div>
            <div className="p-3 rounded-[12px] bg-gray-50">
              <div className="text-[10px] font-semibold text-gray-400 uppercase mb-0.5">{t.monthlyProfit}</div>
              <div className="text-base font-bold">RM {result.monthlyProfit.toLocaleString()}</div>
            </div>
          </div>
          <div className="p-3.5 rounded-[12px] border" style={{ background: v(result.net).bg, borderColor: v(result.net).color + '30' }}>
            <div className="text-[10px] font-semibold text-gray-400 uppercase mb-1">{t.verdict}</div>
            <div className="text-[13px] font-semibold" style={{ color: v(result.net).color }}>{v(result.net).text}</div>
          </div>
        </div>
      )}
    </Modal>
  );
}

// ===== TENANT SCREENING =====
function TenantScreen({ lang, onClose }) {
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
      <ToolHeader icon="🔍" gradient="linear-gradient(135deg, #6366f1, #8b5cf6)" title={t.screenTitle} desc={t.screenDesc} onClose={onClose} />
      <div className="space-y-4">
        <RMInput value={salary} onChange={(v) => { setSalary(v); setResult(null); }} placeholder="5000" label={t.tenantSalary} />
        <RMInput value={rent} onChange={(v) => { setRent(v); setResult(null); }} placeholder="2500" label={t.rentAmount} />

        <div>
          <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">{t.jobType}</label>
          <div className="grid grid-cols-2 gap-2">
            {['permanent', 'contract', 'selfEmployed', 'unemployed'].map(j => (
              <button key={j} onClick={() => { setJob(j); setResult(null); }}
                className={`py-2 rounded-xl text-[12px] font-medium border transition ${job === j ? 'bg-indigo-50 border-indigo-300 text-indigo-700' : 'bg-white border-gray-200 text-gray-500'}`}>
                {t.jobs[j]}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">{t.occupants}</label>
            <input type="number" value={occupants} onChange={(e) => { setOccupants(e.target.value); setResult(null); }} placeholder="2"
              className="w-full py-2.5 px-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-indigo-400" />
          </div>
          <div>
            <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">{t.bedrooms}</label>
            <input type="number" value={bedrooms} onChange={(e) => { setBedrooms(e.target.value); setResult(null); }} placeholder="3"
              className="w-full py-2.5 px-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-indigo-400" />
          </div>
        </div>

        <div>
          <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">{t.moveReason}</label>
          <div className="flex flex-wrap gap-1.5">
            {['leaseEnd', 'work', 'family', 'evicted', 'firstTime'].map(r => (
              <button key={r} onClick={() => { setReason(r); setResult(null); }}
                className={`px-3 py-1.5 rounded-full text-[11px] font-medium border transition ${reason === r ? 'bg-indigo-50 border-indigo-300 text-indigo-700' : 'bg-white border-gray-200 text-gray-500'}`}>
                {t.reasons[r]}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block">{t.hasGuarantor}</label>
          <div className="flex gap-2">
            <button onClick={() => { setGuarantor(true); setResult(null); }} className={`flex-1 py-2 rounded-xl text-[13px] font-medium border transition ${guarantor === true ? 'bg-green-50 border-green-300 text-green-700' : 'bg-white border-gray-200 text-gray-500'}`}>{t.yes}</button>
            <button onClick={() => { setGuarantor(false); setResult(null); }} className={`flex-1 py-2 rounded-xl text-[13px] font-medium border transition ${guarantor === false ? 'bg-red-50 border-red-300 text-red-700' : 'bg-white border-gray-200 text-gray-500'}`}>{t.no}</button>
          </div>
        </div>

        <button onClick={screen} disabled={!salary || !rent || !job} className="w-full py-3 rounded-xl text-sm font-semibold text-white disabled:opacity-40" style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>{t.checkTenant}</button>
      </div>

      {result && (
        <div className="mt-5 space-y-3 fade-in">
          <div className="p-4 rounded-[14px] text-center" style={{ background: levelStyle[result.level].bg }}>
            <div className="text-[10px] font-semibold text-gray-400 uppercase mb-1">{t.riskLevel}</div>
            <div className="text-xl font-bold" style={{ color: levelStyle[result.level].color }}>{levelStyle[result.level].text}</div>
            <div className="text-[12px] text-gray-500 mt-1">{t.affordability}: {result.ratio.toFixed(1)}x</div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
              <div className="h-2 rounded-full transition-all" style={{ width: `${result.score}%`, background: levelStyle[result.level].color }} />
            </div>
            <div className="text-[11px] text-gray-400 mt-1">{result.score}/100</div>
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

// ===== AGREEMENT HEALTH CHECK =====
function AgreementHealth({ lang, onClose }) {
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
      <ToolHeader icon="📋" gradient="linear-gradient(135deg, #ec4899, #f43f5e)" title={t.healthTitle} desc={t.healthDesc} onClose={onClose} />

      <div className="space-y-2 mb-4">
        {t.clauses.map(c => (
          <button key={c.id} onClick={() => toggle(c.id)}
            className={`w-full flex items-center gap-3 text-left px-3.5 py-3 rounded-xl border transition ${answers[c.id] ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200'}`}>
            <div className={`w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 ${answers[c.id] ? 'bg-green-500' : 'bg-gray-200'}`}>
              {answers[c.id] && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>}
            </div>
            <span className="text-[13px] text-gray-700">{c.q}</span>
          </button>
        ))}
      </div>

      <button onClick={check} className="w-full py-3 rounded-xl text-sm font-semibold text-white" style={{ background: 'linear-gradient(135deg, #ec4899, #f43f5e)' }}>{t.checkAgreement}</button>

      {result && (
        <div className="mt-5 space-y-3 fade-in">
          <div className="p-4 rounded-[14px] text-center" style={{ background: levelStyle[result.level].bg }}>
            <div className="text-[10px] font-semibold text-gray-400 uppercase mb-1">{t.score}</div>
            <div className="text-2xl font-bold" style={{ color: levelStyle[result.level].color }}>{result.pct}%</div>
            <div className="text-[12px] font-medium mt-1" style={{ color: levelStyle[result.level].color }}>{t[result.level]}</div>
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

// ===== MAIN EXPORT =====
export default function Calculators({ lang, onClose }) {
  const [active, setActive] = useState(null);
  const t = L[lang];

  if (active === 'stamp') return <StampDutyCalc lang={lang} onClose={() => setActive(null)} />;
  if (active === 'yield') return <RentalYieldCalc lang={lang} onClose={() => setActive(null)} />;
  if (active === 'screen') return <TenantScreen lang={lang} onClose={() => setActive(null)} />;
  if (active === 'health') return <AgreementHealth lang={lang} onClose={() => setActive(null)} />;

  const tools = [
    { id: 'stamp', icon: '📄', gradient: 'linear-gradient(135deg, #f59e0b, #eab308)', title: t.stampTitle, desc: t.stampDesc },
    { id: 'yield', icon: '📊', gradient: 'linear-gradient(135deg, #16a34a, #22c55e)', title: t.yieldTitle, desc: t.yieldDesc },
    { id: 'screen', icon: '🔍', gradient: 'linear-gradient(135deg, #6366f1, #8b5cf6)', title: t.screenTitle, desc: t.screenDesc },
    { id: 'health', icon: '📋', gradient: 'linear-gradient(135deg, #ec4899, #f43f5e)', title: t.healthTitle, desc: t.healthDesc },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center" style={{ background: 'rgba(0,0,0,0.4)' }}>
      <div className="bg-white w-full max-w-lg rounded-t-[20px] sm:rounded-[20px] p-6 fade-in">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-base font-bold text-gray-900">{t.tools}</h3>
          <CloseBtn onClick={onClose} />
        </div>
        <div className="space-y-2.5">
          {tools.map(tool => (
            <button key={tool.id} onClick={() => setActive(tool.id)}
              className="w-full flex items-center gap-3 text-left px-4 py-4 rounded-[14px] border border-gray-100 bg-white card-hover"
              style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}>
              <div className="w-10 h-10 rounded-[12px] flex items-center justify-center" style={{ background: tool.gradient }}>
                <span className="text-lg">{tool.icon}</span>
              </div>
              <div>
                <div className="text-[14px] font-semibold text-gray-800">{tool.title}</div>
                <div className="text-[11px] text-gray-400 mt-0.5">{tool.desc}</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
