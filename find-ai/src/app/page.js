'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Landing from './landing';
import Calculators from './calculators';

const STATES = [
  'Johor', 'Kedah', 'Kelantan', 'Melaka', 'Negeri Sembilan',
  'Pahang', 'Perak', 'Perlis', 'Penang', 'Sabah',
  'Sarawak', 'Selangor', 'Terengganu', 'KL', 'Putrajaya', 'Labuan',
];

const UI = {
  en: {
    title: 'Unbelievebe',
    subtitle: 'Ready to help',
    subtitleActive: 'Online',
    welcomeTitle: "Hi, I'm your property advisor.",
    welcomeDesc: "Tell me your situation in your own words — I'll give you the law, what to do, and a clause for your agreement.",
    welcomeReturning: "Welcome back! I remember your property details.",
    placeholder: 'Describe your situation...',
    placeholderActive: 'Ask a follow-up question...',
    placeholderListening: 'Listening...',
    send: 'Send',
    disclaimer: 'AI advice — not a substitute for professional legal counsel',
    privacy: 'Your conversations stay on your device',
    langToggle: 'BM',
    analyzing: 'Analyzing your situation...',
    commonSituations: 'Common situations',
    voiceHint: 'Tap the mic to speak your question in English or BM',
    profileTitle: 'Quick setup (optional)',
    profileDesc: 'Help me give you better answers',
    profileRole: 'I am a...',
    profileState: 'Property state',
    profileType: 'Property type',
    profileRent: 'Monthly rent (RM)',
    profileSkip: 'Skip',
    profileSave: 'Save & Start',
    profileEdit: 'Edit profile',
    roles: { landlord: 'Landlord', tenant: 'Tenant', buyer: 'Buyer' },
    types: { condo: 'Condo / Apartment', landed: 'Landed House', shop: 'Shophouse / Commercial' },
    previousChat: 'You have a previous conversation',
    continueChat: 'Continue',
    newChat: 'New Chat',
    questions: [
      { icon: '💸', title: "Tenant didn't pay rent", sub: 'Late payment, arrears, demand letter', text: "My tenant hasn't paid rent. What can I do?" },
      { icon: '🔒', title: 'Deposit not returned', sub: 'Deductions, evidence, refund rights', text: "Can my landlord keep my deposit?" },
      { icon: '🔧', title: 'Who pays for repairs?', sub: 'Aircon, plumbing, structural damage', text: "Who is responsible for repairs — landlord or tenant?" },
      { icon: '🚪', title: 'How to evict tenant legally', sub: 'Proper process, avoid illegal eviction', text: "How do I legally evict my tenant?" },
    ],
  },
  bm: {
    title: 'Unbelievebe',
    subtitle: 'Sedia membantu',
    subtitleActive: 'Dalam talian',
    welcomeTitle: 'Hai, saya penasihat hartanah anda.',
    welcomeDesc: 'Ceritakan situasi anda — saya akan beri undang-undang, langkah tindakan, dan klausa untuk perjanjian anda.',
    welcomeReturning: 'Selamat kembali! Saya ingat butiran hartanah anda.',
    placeholder: 'Ceritakan situasi hartanah anda...',
    placeholderActive: 'Tanya soalan susulan...',
    placeholderListening: 'Sedang mendengar...',
    send: 'Hantar',
    disclaimer: 'Nasihat AI — bukan pengganti nasihat guaman profesional',
    privacy: 'Perbualan anda kekal dalam peranti anda',
    langToggle: '中文',
    analyzing: 'Menganalisis situasi anda...',
    commonSituations: 'Situasi biasa',
    voiceHint: 'Ketik mikrofon untuk bercakap dalam BM atau English',
    profileTitle: 'Persediaan pantas (pilihan)',
    profileDesc: 'Bantu saya beri jawapan lebih baik',
    profileRole: 'Saya adalah...',
    profileState: 'Negeri hartanah',
    profileType: 'Jenis hartanah',
    profileRent: 'Sewa bulanan (RM)',
    profileSkip: 'Langkau',
    profileSave: 'Simpan & Mula',
    profileEdit: 'Edit profil',
    roles: { landlord: 'Tuan Rumah', tenant: 'Penyewa', buyer: 'Pembeli' },
    types: { condo: 'Kondo / Apartment', landed: 'Rumah Teres / Banglo', shop: 'Kedai / Komersial' },
    previousChat: 'Anda mempunyai perbualan sebelum ini',
    continueChat: 'Teruskan',
    newChat: 'Chat Baru',
    questions: [
      { icon: '💸', title: 'Penyewa tak bayar sewa', sub: 'Bayaran lewat, tunggakan, surat tuntutan', text: 'Penyewa tak bayar sewa, apa boleh buat?' },
      { icon: '🔒', title: 'Deposit tak dipulangkan', sub: 'Potongan, bukti, hak bayaran balik', text: 'Tuan rumah simpan deposit saya, boleh ke?' },
      { icon: '🔧', title: 'Siapa bayar pembaikan?', sub: 'Aircond, paip, kerosakan struktur', text: 'Siapa yang bertanggungjawab untuk pembaikan?' },
      { icon: '🚪', title: 'Cara usir penyewa secara sah', sub: 'Proses betul, elak pengusiran haram', text: 'Macam mana nak usir penyewa secara sah?' },
    ],
  },
  zh: {
    title: 'Unbelievebe',
    subtitle: '随时为您服务',
    subtitleActive: '在线',
    welcomeTitle: '您好，我是您的房产顾问。',
    welcomeDesc: '用您自己的话描述情况 — 我会为您提供相关法律、应对步骤，以及租约协议条款。',
    welcomeReturning: '欢迎回来！我记得您的房产信息。',
    placeholder: '描述您的房产情况...',
    placeholderActive: '继续提问...',
    placeholderListening: '正在聆听...',
    send: '发送',
    disclaimer: 'AI建议 — 不能替代专业法律意见',
    privacy: '您的对话保留在您的设备上',
    langToggle: 'EN',
    analyzing: '正在分析您的情况...',
    commonSituations: '常见情况',
    voiceHint: '点击麦克风用中文、英文或马来文提问',
    profileTitle: '快速设置（可选）',
    profileDesc: '帮助我给您更好的建议',
    profileRole: '我是...',
    profileState: '房产所在州',
    profileType: '房产类型',
    profileRent: '月租金 (RM)',
    profileSkip: '跳过',
    profileSave: '保存并开始',
    profileEdit: '编辑资料',
    roles: { landlord: '房东', tenant: '租客', buyer: '买家' },
    types: { condo: '公寓', landed: '排屋 / 独立式', shop: '店铺 / 商业' },
    previousChat: '您有之前的对话记录',
    continueChat: '继续',
    newChat: '新对话',
    questions: [
      { icon: '💸', title: '租客拖欠租金', sub: '逾期付款、欠款追讨、催款信', text: '我的租客已经好几个月没付租金了，我该怎么办？' },
      { icon: '🔒', title: '押金不退还', sub: '扣款依据、证据要求、退还权利', text: '房东扣住我的押金不退，这合法吗？' },
      { icon: '🔧', title: '维修费谁出？', sub: '冷气、水管、结构性损坏', text: '维修费用应该由房东还是租客承担？' },
      { icon: '🚪', title: '如何合法驱逐租客', sub: '正确程序、避免非法驱逐', text: '我要怎样合法地驱逐租客？' },
    ],
  },
};

// Bot avatar component
const BotAvatar = ({ size = 28 }) => (
  <div
    className="flex items-center justify-center flex-shrink-0"
    style={{
      width: size,
      height: size,
      minWidth: size,
      background: 'linear-gradient(135deg, #16a34a, #22c55e)',
      borderRadius: size > 30 ? 12 : 10,
    }}
  >
    <span className="text-white font-bold" style={{ fontSize: size > 30 ? 14 : 9 }}>U</span>
  </div>
);

// SVG Icons
const MicIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
    <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
    <line x1="12" x2="12" y1="19" y2="22" />
  </svg>
);

const SendIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

const SaveIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
    <polyline points="17 21 17 13 7 13 7 21" />
  </svg>
);

const TrashIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 6h18" />
    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
  </svg>
);

const WhatsAppIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

const LockIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

// Helper: load from localStorage safely
const loadStorage = (key, fallback) => {
  if (typeof window === 'undefined') return fallback;
  try {
    const val = localStorage.getItem(key);
    return val ? JSON.parse(val) : fallback;
  } catch { return fallback; }
};

const saveStorage = (key, value) => {
  if (typeof window === 'undefined') return;
  try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
};

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const [lang, setLang] = useState('en');
  const [showChat, setShowChat] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showCalc, setShowCalc] = useState(false);
  const [profile, setProfile] = useState({ role: '', state: '', type: '', rent: '' });
  const [hasSavedChat, setHasSavedChat] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const chatEndRef = useRef(null);
  const inputRef = useRef(null);
  const recognitionRef = useRef(null);

  // Load saved data on mount
  useEffect(() => {
    const savedLang = loadStorage('ub_lang', 'en');
    const savedProfile = loadStorage('ub_profile', { role: '', state: '', type: '', rent: '' });
    const savedMessages = loadStorage('ub_messages', []);
    setLang(savedLang);
    setProfile(savedProfile);
    if (savedMessages.length > 0) {
      setHasSavedChat(true);
    }
    setInitialized(true);
  }, []);

  // Save language when it changes
  useEffect(() => {
    if (initialized) saveStorage('ub_lang', lang);
  }, [lang, initialized]);

  // Save messages when they change (only real messages, not loading placeholders)
  useEffect(() => {
    if (initialized && messages.length > 0) {
      const realMessages = messages.filter(m => m.content !== '');
      if (realMessages.length > 0) saveStorage('ub_messages', realMessages);
    }
  }, [messages, initialized]);

  // Save profile when it changes
  useEffect(() => {
    if (initialized) saveStorage('ub_profile', profile);
  }, [profile, initialized]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = lang === 'bm' ? 'ms-MY' : lang === 'zh' ? 'zh-CN' : 'en-MY';
        recognition.onresult = (event) => {
          let transcript = '';
          for (let i = 0; i < event.results.length; i++) {
            transcript += event.results[i][0].transcript;
          }
          setInput(transcript);
        };
        recognition.onend = () => setListening(false);
        recognition.onerror = () => setListening(false);
        recognitionRef.current = recognition;
      }
    }
  }, [lang]);

  const toggleVoice = () => {
    if (!recognitionRef.current) return;
    if (listening) {
      recognitionRef.current.stop();
      setListening(false);
    } else {
      setInput('');
      recognitionRef.current.start();
      setListening(true);
    }
  };

  const buildProfileContext = () => {
    const p = profile;
    if (!p.role && !p.state && !p.type && !p.rent) return '';
    let ctx = 'USER PROFILE: ';
    if (p.role) ctx += `Role: ${p.role}. `;
    if (p.state) ctx += `Property in ${p.state}. `;
    if (p.type) ctx += `Type: ${p.type}. `;
    if (p.rent) ctx += `Monthly rent: RM${p.rent}. `;
    return ctx.trim();
  };

  const sendMessage = useCallback(async (text) => {
    if (!text.trim() || loading) return;

    const userMessage = { role: 'user', content: text.trim() };
    const newMessages = [...messages, userMessage];

    setMessages([...newMessages, { role: 'assistant', content: '' }]);
    setInput('');
    setLoading(true);

    try {
      const profileContext = buildProfileContext();
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages, profileContext }),
      });

      if (!res.ok) {
        const err = await res.json();
        setMessages([...newMessages, { role: 'assistant', content: `Error: ${err.error}` }]);
        setLoading(false);
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let fullText = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');
        for (const line of lines) {
          if (line.startsWith('data: ') && line !== 'data: [DONE]') {
            try {
              const data = JSON.parse(line.slice(6));
              fullText += data.text;
              setMessages([...newMessages, { role: 'assistant', content: fullText }]);
            } catch (e) {}
          }
        }
      }
    } catch (err) {
      setMessages([...newMessages, { role: 'assistant', content: 'Connection error. Please try again.' }]);
    }

    setLoading(false);
    inputRef.current?.focus();
  }, [messages, loading, profile]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const handleSave = () => {
    const content = messages
      .map((m) => {
        const role = m.role === 'user' ? 'You' : 'Unbelievebe';
        return `<div style="margin-bottom:20px;"><strong>${role}:</strong><div style="margin-top:6px;white-space:pre-wrap;">${m.content}</div></div>`;
      })
      .join('<hr style="border:none;border-top:1px solid #eee;margin:16px 0;">');

    const html = `<html><head><title>Unbelievebe - Chat ${new Date().toISOString().slice(0, 10)}</title>
      <style>body{font-family:Arial,sans-serif;max-width:700px;margin:40px auto;padding:0 20px;color:#333;font-size:14px;line-height:1.6;}
      h1{font-size:18px;color:#111;}p.sub{color:#888;font-size:12px;}</style></head>
      <body><h1>Unbelievebe — Malaysian Property Advisor</h1><p class="sub">${new Date().toLocaleDateString('en-MY', { dateStyle: 'full' })}</p><hr>${content}
      <p class="sub" style="margin-top:30px;">AI advice — not a substitute for professional legal counsel</p></body></html>`;

    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `unbelievebe-chat-${new Date().toISOString().slice(0, 10)}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const clearChat = () => {
    setMessages([]);
    saveStorage('ub_messages', []);
    setHasSavedChat(false);
  };

  const loadSavedChat = () => {
    const saved = loadStorage('ub_messages', []);
    setMessages(saved);
    setHasSavedChat(false);
    setShowChat(true);
  };

  const shareWhatsApp = (text) => {
    const clean = text.replace(/\*\*/g, '*').replace(/<[^>]*>/g, '').substring(0, 2000);
    const msg = `From Unbelievebe (Malaysian Property Advisor):\n\n${clean}\n\nhttps://unbelievebe.vercel.app`;
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const handleStartChat = () => {
    const savedProfile = loadStorage('ub_profile', { role: '', state: '', type: '', rent: '' });
    if (savedProfile.role) {
      // Has profile, go straight to chat
      setShowChat(true);
    } else {
      // No profile, show setup
      setShowProfile(true);
    }
  };

  const handleSaveProfile = () => {
    saveStorage('ub_profile', profile);
    setShowProfile(false);
    setShowChat(true);
  };

  const handleSkipProfile = () => {
    setShowProfile(false);
    setShowChat(true);
  };

  const formatMessage = (text) => {
    let formatted = text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n/g, '<br/>');

    // Style clause blocks with copy button
    formatted = formatted.replace(
      /📋.*?<strong>(.+?)<\/strong>.*?<br\/>(&gt;.*?)(?=<br\/><br\/>|$)/gs,
      (match, title, clause) => {
        const cleanClause = clause.replace(/&gt;\s?/g, '').replace(/<br\/>/g, '\n').replace(/<\/?strong>/g, '').trim();
        return `<div style="margin:14px 0;padding:16px;background:linear-gradient(135deg,#f0fdf4,#ecfdf5);border:1px solid #bbf7d0;border-radius:14px;">` +
          `<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px;">` +
          `<div style="display:flex;align-items:center;gap:6px;">` +
          `<span style="width:22px;height:22px;background:#dcfce7;border-radius:6px;display:flex;align-items:center;justify-content:center;font-size:11px;">📋</span>` +
          `<span style="font-size:12px;font-weight:700;color:#166534;">${title}</span>` +
          `</div>` +
          `<button onclick="navigator.clipboard.writeText(\`${cleanClause.replace(/`/g, '\\`')}\`);this.textContent='Copied!';this.style.background='#16a34a';this.style.color='white';setTimeout(()=>{this.textContent='Copy';this.style.background='white';this.style.color='#16a34a'},2000)" ` +
          `style="font-size:11px;padding:5px 14px;border-radius:8px;background:white;color:#16a34a;border:1px solid #bbf7d0;cursor:pointer;font-weight:600;">Copy</button>` +
          `</div>` +
          `<div style="font-size:12px;color:#374151;font-style:italic;line-height:1.7;padding:10px 12px;background:rgba(255,255,255,0.6);border-radius:8px;">${clause.replace(/&gt;\s?/g, '')}</div>` +
          `</div>`;
      }
    );

    return formatted;
  };

  if (!initialized) return null;

  // Landing page
  if (!showChat && !showProfile) {
    return <Landing onStart={handleStartChat} lang={lang} setLang={setLang} hasSavedChat={hasSavedChat} onContinueChat={loadSavedChat} />;
  }

  // Profile setup
  if (showProfile) {
    const t = UI[lang];
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white px-6">
        <BotAvatar size={48} />
        <h2 className="text-lg font-bold text-gray-900 mt-4 mb-1">{t.profileTitle}</h2>
        <p className="text-[13px] text-gray-400 mb-6">{t.profileDesc}</p>

        <div className="w-full max-w-sm space-y-3">
          {/* Role */}
          <div>
            <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1 block">{t.profileRole}</label>
            <div className="flex gap-2">
              {['landlord', 'tenant', 'buyer'].map(r => (
                <button
                  key={r}
                  onClick={() => setProfile({ ...profile, role: r })}
                  className={`flex-1 py-2.5 rounded-xl text-[13px] font-medium transition border ${
                    profile.role === r
                      ? 'bg-green-50 border-green-300 text-green-700'
                      : 'bg-white border-gray-200 text-gray-500 hover:border-gray-300'
                  }`}
                >
                  {t.roles[r]}
                </button>
              ))}
            </div>
          </div>

          {/* State */}
          <div>
            <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1 block">{t.profileState}</label>
            <select
              value={profile.state}
              onChange={(e) => setProfile({ ...profile, state: e.target.value })}
              className="w-full py-2.5 px-3 rounded-xl border border-gray-200 text-sm text-gray-700 focus:outline-none focus:border-green-400"
            >
              <option value="">—</option>
              {STATES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          {/* Type */}
          <div>
            <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1 block">{t.profileType}</label>
            <div className="flex gap-2">
              {['condo', 'landed', 'shop'].map(tp => (
                <button
                  key={tp}
                  onClick={() => setProfile({ ...profile, type: tp })}
                  className={`flex-1 py-2.5 rounded-xl text-[12px] font-medium transition border ${
                    profile.type === tp
                      ? 'bg-green-50 border-green-300 text-green-700'
                      : 'bg-white border-gray-200 text-gray-500 hover:border-gray-300'
                  }`}
                >
                  {t.types[tp]}
                </button>
              ))}
            </div>
          </div>

          {/* Rent */}
          <div>
            <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-1 block">{t.profileRent}</label>
            <input
              type="number"
              value={profile.rent}
              onChange={(e) => setProfile({ ...profile, rent: e.target.value })}
              placeholder="e.g. 2500"
              className="w-full py-2.5 px-3 rounded-xl border border-gray-200 text-sm text-gray-700 focus:outline-none focus:border-green-400"
            />
          </div>
        </div>

        <div className="flex gap-3 mt-8 w-full max-w-sm">
          <button
            onClick={handleSkipProfile}
            className="flex-1 py-3 rounded-xl text-sm font-medium text-gray-500 bg-gray-100 hover:bg-gray-200 transition"
          >
            {t.profileSkip}
          </button>
          <button
            onClick={handleSaveProfile}
            className="flex-1 py-3 rounded-xl text-sm font-semibold text-white transition"
            style={{ background: 'linear-gradient(135deg, #16a34a, #22c55e)' }}
          >
            {t.profileSave}
          </button>
        </div>
      </div>
    );
  }

  // Chat view
  const t = UI[lang];
  const hasMessages = messages.length > 0;
  const hasProfile = profile.role || profile.state;

  return (
    <div className="flex flex-col h-screen max-w-lg mx-auto" style={{ background: hasMessages ? '#f8f9fa' : 'white' }}>
      {/* Header */}
      <header className="no-print flex items-center justify-between px-5 py-3.5 bg-white" style={{ borderBottom: '1px solid #f0f0f0' }}>
        <div className="flex items-center gap-2.5">
          <BotAvatar size={36} />
          <div>
            <h1 className="text-[15px] font-bold text-gray-900">{t.title}</h1>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
              <span className="text-[11px] text-green-600 font-medium">
                {hasMessages ? t.subtitleActive : t.subtitle}
              </span>
            </div>
          </div>
        </div>
        <div className="flex gap-1.5">
          <button
            onClick={() => setLang(lang === 'en' ? 'bm' : lang === 'bm' ? 'zh' : 'en')}
            className="text-[11px] px-3.5 py-1.5 rounded-full bg-green-50 hover:bg-green-100 text-green-600 font-semibold border border-green-100 transition"
          >
            {t.langToggle}
          </button>
          {hasProfile && (
            <button
              onClick={() => setShowProfile(true)}
              className="text-[11px] px-2.5 py-1.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 transition"
              title={t.profileEdit}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </button>
          )}
          {hasMessages && (
            <>
              <button onClick={handleSave} className="p-1.5 px-3 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 transition">
                <SaveIcon />
              </button>
              <button onClick={clearChat} className="p-1.5 px-3 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 transition">
                <TrashIcon />
              </button>
            </>
          )}
        </div>
      </header>

      {/* Chat Area */}
      <div className="chat-container flex-1 overflow-y-auto px-4 py-5">
        {!hasMessages ? (
          /* ===== CHAT EMPTY STATE ===== */
          <div className="flex flex-col h-full">
            {/* Welcome bubble */}
            <div className="flex gap-2.5 mb-6">
              <BotAvatar size={30} />
              <div>
                <div className="rounded-[0_16px_16px_16px] px-4 py-3.5 mb-2" style={{ background: '#f8faf8', border: '1px solid #e8efe8' }}>
                  <div className="text-[15px] font-semibold text-gray-900 mb-1">{t.welcomeTitle}</div>
                  <div className="text-[13px] text-gray-500 leading-relaxed">
                    {hasProfile ? t.welcomeReturning : t.welcomeDesc}
                  </div>
                  {hasProfile && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {profile.role && <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-50 text-green-700 border border-green-100">{t.roles[profile.role]}</span>}
                      {profile.state && <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-50 text-green-700 border border-green-100">{profile.state}</span>}
                      {profile.type && <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-50 text-green-700 border border-green-100">{t.types[profile.type]}</span>}
                      {profile.rent && <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-50 text-green-700 border border-green-100">RM{profile.rent}/mo</span>}
                    </div>
                  )}
                </div>
                <div className="text-[10px] text-gray-300 pl-1">Just now</div>
              </div>
            </div>

            {/* Quick actions label */}
            <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2.5 pl-1">{t.commonSituations}</div>

            {/* Starter cards */}
            <div className="flex flex-col gap-2">
              {t.questions.map((q, i) => (
                <button
                  key={i}
                  onClick={() => sendMessage(q.text)}
                  className="flex items-center gap-3 text-left px-4 py-3.5 rounded-[14px] border border-gray-100 bg-white card-hover"
                  style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.03)' }}
                >
                  <span className="text-lg min-w-[24px]">{q.icon}</span>
                  <div>
                    <div className="text-[13px] font-semibold text-gray-800">{q.title}</div>
                    <div className="text-[11px] text-gray-400 mt-0.5">{q.sub}</div>
                  </div>
                </button>
              ))}
            </div>

            {/* Tools button */}
            <button
              onClick={() => setShowCalc(true)}
              className="flex items-center justify-center gap-2 mt-4 py-3 px-4 rounded-[14px] border border-dashed border-gray-200 bg-white hover:bg-gray-50 transition w-full"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/>
              </svg>
              <span className="text-[13px] font-medium text-gray-600">
                {lang === 'zh' ? '房产工具 — 印花税 & 回报率计算器' : lang === 'bm' ? 'Alat Hartanah — Kalkulator Duti Setem & Pulangan' : 'Property Tools — Stamp Duty & Yield Calculator'}
              </span>
            </button>

            {/* Voice hint */}
            <div className="flex items-center justify-center gap-1.5 mt-3 py-2.5 px-4 bg-gray-50 rounded-[10px]">
              <span className="text-gray-400"><MicIcon /></span>
              <span className="text-[11px] text-gray-400">{t.voiceHint}</span>
            </div>
          </div>
        ) : (
          /* ===== CHAT ACTIVE STATE ===== */
          <div className="space-y-4">
            {messages.map((msg, i) => (
              <div key={i}>
                <div className={`flex ${msg.role === 'user' ? 'justify-end' : 'gap-2.5'} fade-in`}>
                  {msg.role === 'assistant' && <BotAvatar size={28} />}
                  <div className={msg.role === 'assistant' ? 'max-w-[calc(100%-42px)]' : 'max-w-[78%]'}>
                    <div
                      className={`text-sm leading-relaxed ${
                        msg.role === 'user'
                          ? 'px-4 py-3.5 text-white rounded-[20px_20px_6px_20px]'
                          : 'bg-white px-4 py-4 rounded-[0_20px_20px_20px] text-gray-800'
                      }`}
                      style={
                        msg.role === 'user'
                          ? { background: 'linear-gradient(135deg, #16a34a, #1ea34e)', boxShadow: '0 2px 8px rgba(22,163,74,0.2)' }
                          : { boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }
                      }
                      dangerouslySetInnerHTML={{ __html: formatMessage(msg.content) }}
                    />
                    {/* WhatsApp share for bot messages */}
                    {msg.role === 'assistant' && msg.content && (
                      <div className="flex items-center gap-2 mt-1.5 pl-1">
                        <button
                          onClick={() => shareWhatsApp(msg.content)}
                          className="flex items-center gap-1 text-[10px] text-gray-400 hover:text-green-600 transition"
                        >
                          <WhatsAppIcon /> Share
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {/* Loading dots */}
            {loading && messages[messages.length - 1]?.content === '' && (
              <div className="flex gap-2.5">
                <BotAvatar size={28} />
                <div className="bg-white px-4 py-3.5 rounded-[0_20px_20px_20px]" style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
                  <div className="flex items-center gap-2">
                    <div className="flex space-x-1">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                    <span className="text-xs text-gray-400">{t.analyzing}</span>
                  </div>
                </div>
              </div>
            )}

            <div ref={chatEndRef} />
          </div>
        )}
      </div>

      {/* Input Bar */}
      <div className="no-print bg-white px-4 py-3" style={{ borderTop: '1px solid #f5f5f5' }}>
        <div
          className="flex items-center gap-2 rounded-[14px] pl-4 pr-1 py-1"
          style={{ background: '#f5f5f5' }}
        >
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={listening ? t.placeholderListening : (hasMessages ? t.placeholderActive : t.placeholder)}
            rows={1}
            className="flex-1 resize-none bg-transparent text-sm focus:outline-none text-gray-800 placeholder-gray-400 py-2.5"
            style={{ maxHeight: '120px' }}
            onInput={(e) => {
              e.target.style.height = 'auto';
              e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
            }}
          />
          {recognitionRef.current !== undefined && (
            <button
              onClick={toggleVoice}
              disabled={loading}
              className={`w-[38px] h-[38px] rounded-xl flex items-center justify-center transition ${
                listening
                  ? 'bg-red-500 text-white animate-pulse'
                  : 'bg-white text-green-600'
              } disabled:opacity-40`}
              style={!listening ? { boxShadow: '0 1px 3px rgba(0,0,0,0.06)' } : {}}
            >
              <MicIcon />
            </button>
          )}
          <button
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || loading}
            className="w-[38px] h-[38px] rounded-xl flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed transition"
            style={{ background: 'linear-gradient(135deg, #16a34a, #22c55e)', boxShadow: '0 2px 6px rgba(22,163,74,0.3)' }}
          >
            <SendIcon />
          </button>
        </div>
        {/* Privacy badge + disclaimer */}
        <div className="flex items-center justify-center gap-1 mt-2">
          <LockIcon />
          <p className="text-[10px] text-gray-300">{t.privacy}</p>
        </div>
      </div>

      {/* Calculator overlay */}
      {showCalc && <Calculators lang={lang} onClose={() => setShowCalc(false)} />}
    </div>
  );
}
