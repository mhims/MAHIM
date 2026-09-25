import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import {
  Volume2, VolumeX, Copy, Check, Gift, Sparkles, Send,
  ArrowLeft, Lock, Download, Share2, AlertCircle, X, HelpCircle
} from 'lucide-react';
import { SalamiAdminModal } from './SalamiAdminModal';
import {
  addSalamiRecord, sendSalamiToGoogleSheet, getSalamiSettings
} from '../utils/salamiStorage';
import {
  generateSalamiCardCanvas, downloadSalamiCard, shareSalamiCard
} from '../utils/salamiCardGenerator';

interface WheelItem {
  label: string;
  sub: string;
  color: string;
  winner: boolean;
}

export function SalamiPage() {
  const [portalMode, setPortalMode] = useState<'main' | 'send' | 'receive'>('main');
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [showCopyToast, setShowCopyToast] = useState(false);
  const [showImagePopup, setShowImagePopup] = useState(false);

  // Audio refs
  const bgAudioRef = useRef<HTMLAudioElement | null>(null);

  // Spin Wheel State
  const [currentRotation, setCurrentRotation] = useState(0);
  const [spinCount, setSpinCount] = useState(0);
  const MAX_SPINS = 3;
  const [isSpinning, setIsSpinning] = useState(false);
  const [wonAmount, setWonAmount] = useState<string>('');
  const [hasWon, setHasWon] = useState(false);

  // Form States - Send Salami
  const [sendName, setSendName] = useState('');
  const [sendMessage, setSendMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  // Form States - Receive Salami
  const [receiveName, setReceiveName] = useState('');
  const [receivePhone, setReceivePhone] = useState('');
  const [receiveMessage, setReceiveMessage] = useState('');
  const [isClaiming, setIsClaiming] = useState(false);

  // Card modal after winning & claiming
  const [cardDataUrl, setCardDataUrl] = useState<string | null>(null);
  const [showSuccessCardModal, setShowSuccessCardModal] = useState(false);

  // Salami wheel segments (tempting big numbers are winner: false, funny small items are winner: true)
  const spinWheelData: WheelItem[] = [
    { label: '১০০০', sub: 'টাকা', color: '#f38181', winner: false },
    { label: '১.২', sub: 'টাকা', color: '#a8e6cf', winner: true },
    { label: '৫০০', sub: 'টাকা', color: '#4ecdc4', winner: false },
    { label: '১', sub: 'টাকা', color: '#ffe66d', winner: true },
    { label: '৩০০', sub: 'টাকা', color: '#ff6b6b', winner: false },
    { label: 'দোয়া রইল', sub: '🤲', color: '#fcbad3', winner: true },
    { label: '২০০', sub: 'টাকা', color: '#95e1d3', winner: false },
    { label: '১.৫', sub: 'টাকা', color: '#b5ead7', winner: true },
    { label: '১০০', sub: 'টাকা', color: '#aa96da', winner: false },
    { label: '১ কাপ চা', sub: '☕', color: '#ffeaa7', winner: true },
    { label: '৫০', sub: 'টাকা', color: '#c7ceea', winner: false },
    { label: '২', sub: 'টাকা', color: '#ffd3b6', winner: true },
    { label: '২০', sub: 'টাকা', color: '#f78fb3', winner: false },
    { label: '১.৯৯', sub: 'টাকা', color: '#e8f0fe', winner: true },
    { label: '১০', sub: 'টাকা', color: '#f8c291', winner: false },
    { label: '১.৮', sub: 'টাকা', color: '#dff9fb', winner: true },
  ];

  // Play realistic ticking click sound using Web Audio API
  const playTickSound = () => {
    if (isAudioMuted) return;
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(600, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(120, audioCtx.currentTime + 0.04);
      gain.gain.setValueAtTime(0.25, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.04);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.05);
    } catch {}
  };

  // Play fanfare win chime
  const playWinSound = () => {
    if (isAudioMuted) return;
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C, E, G, High C
      notes.forEach((freq, idx) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime + idx * 0.12);
        gain.gain.setValueAtTime(0.3, audioCtx.currentTime + idx * 0.12);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + idx * 0.12 + 0.35);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(audioCtx.currentTime + idx * 0.12);
        osc.stop(audioCtx.currentTime + idx * 0.12 + 0.38);
      });
    } catch {}
  };

  // Background Eid audio
  useEffect(() => {
    bgAudioRef.current = new Audio('https://res.cloudinary.com/drvyjj7td/video/upload/v1779167887/eids_uyrojb.mp3');
    bgAudioRef.current.loop = true;
    bgAudioRef.current.volume = 0.35;

    return () => {
      if (bgAudioRef.current) {
        bgAudioRef.current.pause();
        bgAudioRef.current = null;
      }
    };
  }, []);

  const toggleMusic = () => {
    if (!bgAudioRef.current) return;
    if (bgAudioRef.current.paused) {
      bgAudioRef.current.play().catch(() => {});
      setIsAudioMuted(false);
    } else {
      bgAudioRef.current.pause();
      setIsAudioMuted(true);
    }
  };

  // Confetti helper
  const triggerConfetti = () => {
    const end = Date.now() + 3500;
    const interval = setInterval(() => {
      if (Date.now() > end) {
        clearInterval(interval);
        return;
      }
      confetti({
        particleCount: 25,
        startVelocity: 30,
        spread: 360,
        origin: { x: Math.random(), y: Math.random() - 0.2 },
        colors: ['#c5a059', '#d12053', '#ffe66d', '#4ecdc4', '#a8e6cf'],
      });
    }, 250);
  };

  // Copy phone number
  const copyPhoneNumber = (num: string = '01560061992') => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(num);
    }
    setShowCopyToast(true);
    triggerConfetti();
    setTimeout(() => setShowCopyToast(false), 2600);
  };

  // Spin Wheel Execution
  const handleDoSpin = () => {
    if (isSpinning || spinCount >= MAX_SPINS) return;

    setIsSpinning(true);
    setSpinCount(prev => prev + 1);

    // Filter only winner items (the fun small amounts / funny prank items)
    const winnerIndices: number[] = [];
    spinWheelData.forEach((item, idx) => {
      if (item.winner) winnerIndices.push(idx);
    });

    // Random winner index from allowed funny winners
    const selectedWinnerIdx = winnerIndices[Math.floor(Math.random() * winnerIndices.length)];
    const totalSegments = spinWheelData.length;
    const segAngle = 360 / totalSegments;

    // Center of winner segment with tiny natural jitter
    const jitter = (Math.random() - 0.5) * (segAngle * 0.4);
    const targetCenterAngle = -(selectedWinnerIdx * segAngle + segAngle / 2) + jitter;
    const normalizedTarget = ((targetCenterAngle % 360) + 360) % 360;
    const currentNorm = ((currentRotation % 360) + 360) % 360;

    let delta = normalizedTarget - currentNorm;
    if (delta < 0) delta += 360;

    // 6 to 8 full spins for excitement
    const fullSpins = 360 * 7;
    const totalDelta = fullSpins + delta;
    const finalRot = currentRotation + totalDelta;

    const startTime = performance.now();
    const duration = 5200; // 5.2 seconds
    let lastTickAngle = currentRotation;

    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3.2);

    const animateSpin = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeOutCubic(progress);
      const angle = currentRotation + totalDelta * eased;

      // Play tick every ~segAngle
      if (Math.abs(angle - lastTickAngle) >= segAngle) {
        playTickSound();
        lastTickAngle = angle;
      }

      const wheelElem = document.getElementById('nativeSpinWheel');
      if (wheelElem) {
        wheelElem.style.transform = `rotate(${angle}deg)`;
      }

      if (progress < 1) {
        requestAnimationFrame(animateSpin);
      } else {
        if (wheelElem) {
          wheelElem.style.transform = `rotate(${finalRot}deg)`;
        }
        setCurrentRotation(finalRot);
        setIsSpinning(false);
        const wonText = `${spinWheelData[selectedWinnerIdx].label} ${spinWheelData[selectedWinnerIdx].sub}`;
        setWonAmount(wonText);
        setHasWon(true);
        playWinSound();
        triggerConfetti();
      }
    };

    requestAnimationFrame(animateSpin);
  };

  // Submit Send Salami Form
  const handleSubmitSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sendName.trim()) return;

    setIsSending(true);
    const payload = {
      type: 'পাঠানো' as const,
      name: sendName.trim(),
      phone: 'N/A',
      amount: 'সালামি পাঠানো',
      message: sendMessage.trim() || 'ঈদের শুভেচ্ছা!',
      status: 'pending' as const,
      timestamp: new Date().toLocaleString('bn-BD', { timeZone: 'Asia/Dhaka' }),
    };

    addSalamiRecord(payload);
    const settings = getSalamiSettings();
    await sendSalamiToGoogleSheet(settings.googleSheetWebhookUrl, payload);

    setIsSending(false);
    triggerConfetti();
    setShowImagePopup(true);
    setSendName('');
    setSendMessage('');
  };

  // Submit Receive Salami Form
  const handleSubmitReceive = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!receiveName.trim() || !receivePhone.trim()) return;

    setIsClaiming(true);
    const claimAmount = wonAmount || '১ টাকা';
    const payload = {
      type: 'নেওয়া' as const,
      name: receiveName.trim(),
      phone: receivePhone.trim(),
      amount: claimAmount,
      message: receiveMessage.trim() || 'সালামির আবেদন',
      status: 'pending' as const,
      timestamp: new Date().toLocaleString('bn-BD', { timeZone: 'Asia/Dhaka' }),
    };

    addSalamiRecord(payload);
    const settings = getSalamiSettings();
    await sendSalamiToGoogleSheet(settings.googleSheetWebhookUrl, payload);

    // Generate sharable card
    const cardUrl = await generateSalamiCardCanvas({
      name: receiveName.trim(),
      amount: claimAmount,
      wish: receiveMessage.trim(),
      dateStr: new Date().toLocaleDateString('bn-BD'),
    });
    setCardDataUrl(cardUrl);

    setIsClaiming(false);
    triggerConfetti();
    setShowSuccessCardModal(true);
  };

  // Render SVG segments for the wheel
  const renderWheelSegments = () => {
    const total = spinWheelData.length;
    const segAngle = 360 / total;
    const R = 200;

    return spinWheelData.map((item, i) => {
      const startDeg = i * segAngle - 90;
      const endDeg = (i + 1) * segAngle - 90;
      const x1 = R + R * Math.cos((startDeg * Math.PI) / 180);
      const y1 = R + R * Math.sin((startDeg * Math.PI) / 180);
      const x2 = R + R * Math.cos((endDeg * Math.PI) / 180);
      const y2 = R + R * Math.sin((endDeg * Math.PI) / 180);

      const pathData = `M ${R} ${R} L ${x1} ${y1} A ${R} ${R} 0 0 1 ${x2} ${y2} Z`;

      const midDeg = (startDeg + endDeg) / 2;
      const textR = 135;
      const tx = R + textR * Math.cos((midDeg * Math.PI) / 180);
      const ty = R + textR * Math.sin((midDeg * Math.PI) / 180);
      const rotateDeg = midDeg + 90;

      return (
        <g key={i}>
          <path d={pathData} fill={item.color} stroke="#ffffff" strokeWidth="2.5" />
          <text
            x={tx}
            y={ty - 8}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="#1e293b"
            fontSize="18"
            fontWeight="bold"
            fontFamily="'Hind Siliguri', sans-serif"
            transform={`rotate(${rotateDeg} ${tx} ${ty})`}
          >
            {item.label}
          </text>
          <text
            x={tx}
            y={ty + 12}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="#475569"
            fontSize="13"
            fontWeight="600"
            fontFamily="'Hind Siliguri', sans-serif"
            transform={`rotate(${rotateDeg} ${tx} ${ty})`}
          >
            {item.sub}
          </text>
        </g>
      );
    });
  };

  return (
    <div className="min-h-screen bg-[#fdfaf5] text-[#5d4037] font-['Hind_Siliguri',sans-serif] relative overflow-x-hidden selection:bg-[#c5a059]/20 selection:text-[#5d4037]">
      {/* Background Arabesque texture pattern */}
      <div
        className="fixed inset-0 pointer-events-none opacity-30 z-0"
        style={{
          backgroundImage: `url('https://www.transparenttextures.com/patterns/arabesque.png')`,
        }}
      />

      {/* Floating Copy Toast */}
      {showCopyToast && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[100001] px-5 py-2.5 rounded-full bg-[#5d4037] text-white text-sm font-semibold shadow-2xl flex items-center gap-2 animate-bounce">
          <Check className="w-4 h-4 text-[#c5a059]" />
          <span>✅ বিকাশ নম্বর কপি হয়েছে!</span>
        </div>
      )}

      {/* Swinging Lanterns */}
      <div className="fixed top-0 left-0 w-full pointer-events-none z-10 overflow-hidden h-36">
        <svg
          className="absolute w-12 sm:w-16 top-0 left-[8%] animate-[swing_4s_infinite_ease-in-out_alternate] origin-top opacity-60 drop-shadow-[0_0_12px_#c5a059]"
          viewBox="0 0 100 120"
        >
          <path d="M50 0v20M25 20h50l8 15-8 15H25l-8-15 8-15zM25 50h50v40l-25 20-25-20V50z" fill="#ffcc00" stroke="#d4af37" strokeWidth="2" />
          <circle cx="50" cy="70" r="12" fill="#fff" opacity="0.8">
            <animate attributeName="opacity" values="0.3;1;0.3" dur="2s" repeatCount="indefinite" />
          </circle>
        </svg>

        <svg
          className="absolute w-12 sm:w-16 top-0 right-[10%] animate-[swing_4s_infinite_ease-in-out_alternate] origin-top opacity-60 drop-shadow-[0_0_12px_#c5a059] delay-1000"
          viewBox="0 0 100 120"
        >
          <path d="M50 0v20M25 20h50l8 15-8 15H25l-8-15 8-15zM25 50h50v40l-25 20-25-20V50z" fill="#ffcc00" stroke="#d4af37" strokeWidth="2" />
          <circle cx="50" cy="70" r="12" fill="#fff" opacity="0.8">
            <animate attributeName="opacity" values="0.3;1;0.3" dur="2.2s" repeatCount="indefinite" />
          </circle>
        </svg>
      </div>

      {/* Top Floating Music & Admin Buttons */}
      <div className="fixed top-4 right-4 z-40 flex items-center gap-2">
        <button
          onClick={toggleMusic}
          className="p-2.5 rounded-full bg-white/90 backdrop-blur-md border border-[#c5a059]/40 text-[#5d4037] shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer"
          title={isAudioMuted ? 'গান চালু করুন' : 'গান বন্ধ করুন'}
        >
          {isAudioMuted ? <VolumeX className="w-4 h-4 text-red-500" /> : <Volume2 className="w-4 h-4 text-[#c5a059]" />}
        </button>

        <button
          onClick={() => setIsAdminOpen(true)}
          className="p-2.5 rounded-full bg-white/90 backdrop-blur-md border border-[#c5a059]/40 text-[#5d4037] shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer"
          title="সালামি এডমিন প্যানেল"
        >
          <Lock className="w-4 h-4 text-[#c5a059]" />
        </button>
      </div>

      {/* Royal Header */}
      <header className="relative pt-20 pb-36 text-center px-4 border-b-4 border-[#c5a059] shadow-md bg-gradient-to-b from-[#fdfaf5] to-[#f7f0e3]">
        <h1 className="text-6xl sm:text-7xl md:text-8xl font-bold text-[#5d4037] tracking-tight drop-shadow-sm font-['Hind_Siliguri']">
          ঈদ মোবারক
        </h1>
        <span className="block text-2xl sm:text-3xl font-extrabold text-[#c5a059] mt-1 tracking-wider">
          — মাহিম —
        </span>
        <p className="text-base sm:text-lg text-[#7a5e52] font-medium mt-4 max-w-lg mx-auto leading-relaxed">
          ঈদের আনন্দ ছড়িয়ে পড়ুক সবার মনে <br />
          আপনাকে জানাই পবিত্র ঈদ-উল-আযহার শুভেচ্ছা। ঈদ মোবারক!
        </p>

        {/* Hero Lamp SVG Illustration */}
        <div className="absolute -bottom-16 right-4 sm:right-16 w-24 sm:w-36 pointer-events-none drop-shadow-[0_0_25px_#c5a059]">
          <svg viewBox="0 0 100 150" className="w-full h-auto">
            <path d="M50 10 L85 45 L85 105 L50 140 L15 105 L15 45 Z" fill="#3e2723" stroke="#d4af37" strokeWidth="4" />
            <circle cx="50" cy="80" r="24" fill="#ffaa00">
              <animate attributeName="r" values="22;27;22" dur="2s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.5;1;0.5" dur="2s" repeatCount="indefinite" />
            </circle>
          </svg>
        </div>
      </header>

      {/* Main Wrapper */}
      <main className="relative -mt-20 z-20 max-w-xl mx-auto px-4 pb-24">
        <div className="bg-white rounded-[36px] border-4 border-[#c5a059] shadow-[0_30px_70px_rgba(93,64,55,0.15)] p-6 sm:p-10 text-center relative">
          <h2 className="text-xl sm:text-2xl font-bold text-[#5d4037] mb-6">
            ঈদ হোক সবার জন্য আনন্দময় 🌙
          </h2>

          {/* Dual Action Buttons */}
          {portalMode === 'main' && (
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fadeIn">
              <button
                onClick={() => {
                  setPortalMode('send');
                  copyPhoneNumber('01560061992');
                }}
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-[#5d4037] hover:bg-[#c5a059] text-white font-bold text-lg shadow-xl shadow-[#5d4037]/20 hover:-translate-y-1 transition-all cursor-pointer"
              >
                সালামি পাঠান 💸
              </button>
              <button
                onClick={() => setPortalMode('receive')}
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-[#d12053] hover:bg-[#b01842] text-white font-bold text-lg shadow-xl shadow-[#d12053]/20 hover:-translate-y-1 transition-all cursor-pointer"
              >
                সালামি নিন 🎁
              </button>
            </div>
          )}

          {/* ================= PORTAL 1: সালামি পাঠান ================= */}
          {portalMode === 'send' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="text-2xl sm:text-3xl font-extrabold text-[#5d4037] leading-snug">
                ঈদের চাঁদ আকাশে <br />
                <span className="text-[#d12053] text-3xl sm:text-4xl block mt-1">সালামি দিন বিকাশে 🌙</span>
              </div>

              {/* bKash Phone Box */}
              <div
                onClick={() => copyPhoneNumber('01560061992')}
                className="p-6 rounded-3xl bg-[#fff0f5] border-3 border-dashed border-[#d12053] hover:bg-[#ffe0eb] transition-all cursor-pointer group shadow-inner"
              >
                <span className="text-xs uppercase font-extrabold text-[#d12053] tracking-widest block mb-2">
                  পার্সোনাল নম্বর
                </span>
                <h3 className="text-3xl sm:text-4xl font-extrabold text-[#d12053] font-mono tracking-wider">
                  015 6006 1992
                </h3>
                <span className="text-xs font-semibold text-[#c4567a] mt-2 block group-hover:scale-105 transition-transform">
                  👆 ট্যাপ করুন — নম্বর কপি হয়ে যাবে
                </span>
                <span className="text-[11px] text-slate-500 mt-1 block">
                  💳 বিকাশ &nbsp;|&nbsp; নগদ &nbsp;|&nbsp; রকেট
                </span>
              </div>

              <form onSubmit={handleSubmitSend} className="space-y-4 text-left">
                <div>
                  <label className="block text-sm font-bold text-[#5d4037] mb-1.5 ml-1">আপনার নাম</label>
                  <input
                    type="text"
                    required
                    value={sendName}
                    onChange={e => setSendName(e.target.value)}
                    placeholder="আপনার নাম লিখুন..."
                    className="w-full px-4 py-3.5 rounded-2xl bg-[#fafafa] border-2 border-slate-200 text-slate-800 text-base focus:outline-none focus:border-[#c5a059] focus:bg-white transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-[#5d4037] mb-1.5 ml-1">মাহিমকে কিছু বলুন (মেসেজ)</label>
                  <textarea
                    required
                    rows={3}
                    value={sendMessage}
                    onChange={e => setSendMessage(e.target.value)}
                    placeholder="আপনার ঈদের শুভেচ্ছা বা বার্তা..."
                    className="w-full px-4 py-3 rounded-2xl bg-[#fafafa] border-2 border-slate-200 text-slate-800 text-base focus:outline-none focus:border-[#c5a059] focus:bg-white transition-all resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSending}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#5d4037] to-[#c5a059] hover:from-[#4a322b] hover:to-[#b38e4a] text-white font-bold text-lg shadow-xl shadow-[#5d4037]/25 hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
                >
                  <Send className="w-5 h-5" />
                  <span>{isSending ? 'পাঠানো হচ্ছে...' : 'তথ্য পাঠান ✅'}</span>
                </button>
              </form>

              <button
                type="button"
                onClick={() => setPortalMode('main')}
                className="mt-4 text-sm font-bold text-slate-500 hover:text-[#5d4037] flex items-center justify-center gap-1 mx-auto transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>পিছনে যান</span>
              </button>
            </div>
          )}

          {/* ================= PORTAL 2: সালামি নিন ================= */}
          {portalMode === 'receive' && (
            <div className="space-y-6 animate-fadeIn text-left">
              <div className="text-center">
                <h3 className="text-xl sm:text-2xl font-bold text-[#c5a059]">
                  🎁 সালামি গ্রহণ করুন
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  আগে স্পিন ঘুরিয়ে সালামি নির্ধারণ করুন, তারপর নম্বর দিয়ে রিকোয়েস্ট পাঠান!
                </p>
              </div>

              {/* Spin Box */}
              <div className="p-4 sm:p-6 rounded-3xl bg-gradient-to-br from-[#fff8f0] to-[#fff3e0] border-2 border-[#c5a059] text-center shadow-inner space-y-4">
                <div className="inline-block px-3 py-1 rounded-full bg-[#fff0f5] border border-[#d12053] text-[#d12053] text-xs font-bold">
                  {spinCount >= MAX_SPINS ? '🔒 স্পিন শেষ!' : `🎰 স্পিন বাকি: ${MAX_SPINS - spinCount}`}
                </div>

                {/* Spin Wheel Container */}
                <div className="relative w-64 h-64 sm:w-72 sm:h-72 mx-auto my-2">
                  {/* Wheel Pointer */}
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-30 w-0 h-0 border-l-[14px] border-l-transparent border-r-[14px] border-r-transparent border-t-[28px] border-t-[#d12053] drop-shadow-[0_4px_6px_rgba(209,32,83,0.4)]" />

                  {/* SVG Wheel */}
                  <svg
                    id="nativeSpinWheel"
                    className="w-full h-full rounded-full border-[6px] border-[#c5a059] shadow-xl origin-center will-change-transform"
                    viewBox="0 0 400 400"
                  >
                    {renderWheelSegments()}
                  </svg>

                  {/* Wheel Center Button / Knob */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-gradient-to-br from-[#e8c97a] to-[#c5a059] border-4 border-white shadow-lg z-20 flex items-center justify-center text-white font-bold text-xs">
                    ঈদ
                  </div>
                </div>

                {/* Spin Action Button */}
                <button
                  type="button"
                  disabled={isSpinning || spinCount >= MAX_SPINS}
                  onClick={handleDoSpin}
                  className="px-8 py-3 rounded-full bg-gradient-to-r from-[#d12053] to-[#ff6b8a] hover:from-[#b81844] hover:to-[#ff5577] text-white font-bold text-base shadow-lg shadow-[#d12053]/30 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100 cursor-pointer mx-auto block"
                >
                  {isSpinning ? '🎰 ঘুরছে...' : spinCount >= MAX_SPINS ? '🔒 স্পিন শেষ' : spinCount > 0 ? '🔄 আবার স্পিন করুন' : '🎰 স্পিন করুন!'}
                </button>

                {/* Won Result Badge */}
                {wonAmount && (
                  <div className="pt-2 animate-fadeIn">
                    <span className="text-xs font-bold text-[#5d4037] block mb-1">🎉 আপনার সালামি নির্ধারিত হয়েছে:</span>
                    <div className="text-2xl sm:text-3xl font-extrabold text-[#d12053] bg-[#fff0f5] border-2 border-[#d12053] py-2 px-4 rounded-2xl inline-block shadow-sm">
                      {wonAmount} 🎁
                    </div>
                  </div>
                )}
              </div>

              {/* Claim Salami Form */}
              <form onSubmit={handleSubmitReceive} className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-[#5d4037] mb-1.5 ml-1">আপনার নাম</label>
                  <input
                    type="text"
                    required
                    value={receiveName}
                    onChange={e => setReceiveName(e.target.value)}
                    placeholder="আপনার নাম লিখুন..."
                    className="w-full px-4 py-3.5 rounded-2xl bg-[#fafafa] border-2 border-slate-200 text-slate-800 text-base focus:outline-none focus:border-[#c5a059] focus:bg-white transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-[#5d4037] mb-1.5 ml-1">বিকাশ / নগদ নম্বর</label>
                  <input
                    type="tel"
                    required
                    value={receivePhone}
                    onChange={e => setReceivePhone(e.target.value)}
                    placeholder="০১৭XXXXXXXX"
                    className="w-full px-4 py-3.5 rounded-2xl bg-[#fafafa] border-2 border-slate-200 text-slate-800 text-base focus:outline-none focus:border-[#c5a059] focus:bg-white transition-all font-mono"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-[#5d4037] mb-1.5 ml-1">মাহিমকে কিছু বলুন (মেসেজ)</label>
                  <textarea
                    rows={2}
                    value={receiveMessage}
                    onChange={e => setReceiveMessage(e.target.value)}
                    placeholder="সালামি নেওয়ার সাথে ছোট্ট একটি বার্তা..."
                    className="w-full px-4 py-3 rounded-2xl bg-[#fafafa] border-2 border-slate-200 text-slate-800 text-base focus:outline-none focus:border-[#c5a059] focus:bg-white transition-all resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isClaiming || !hasWon}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#d12053] to-[#c5a059] hover:from-[#ba1946] hover:to-[#b38e4a] text-white font-bold text-lg shadow-xl shadow-[#d12053]/25 hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
                >
                  <Gift className="w-5 h-5" />
                  <span>{isClaiming ? 'পাঠানো হচ্ছে...' : 'সালামি রিকোয়েস্ট পাঠান ✅'}</span>
                </button>

                {!hasWon && (
                  <p className="text-center text-xs font-semibold text-[#c5a059]">
                    ⬆️ আগে স্পিন করুন, তারপর সাবমিট বাটন সচল হবে
                  </p>
                )}
              </form>

              <button
                type="button"
                onClick={() => setPortalMode('main')}
                className="mt-4 text-sm font-bold text-slate-500 hover:text-[#5d4037] flex items-center justify-center gap-1 mx-auto transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>পিছনে যান</span>
              </button>
            </div>
          )}
        </div>

        {/* Footer info */}
        <footer className="mt-8 text-center text-xs text-slate-500 tracking-wider">
          <p>Eid Mubarak 2026 | Created & Designed by Mahim</p>
        </footer>
      </main>

      {/* Floating WhatsApp Button */}
      <a
        href="https://wa.me/+8801560061992"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-5 z-40 flex flex-col items-center gap-1 group text-decoration-none"
      >
        <span className="bg-[#25D366] text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow-md group-hover:scale-105 transition-transform">
          মাহিমকে মেসেজ দিন
        </span>
        <div className="w-13 h-13 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-lg group-hover:scale-110 active:scale-95 transition-all">
          <svg className="w-7 h-7 fill-current" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
        </div>
      </a>

      {/* ================= MODAL 1: Celebration Image Popup (সালামি পাঠানোর পর) ================= */}
      {showImagePopup && (
        <div
          className="fixed inset-0 z-[100005] bg-black/85 flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setShowImagePopup(false)}
        >
          <div
            className="relative max-w-md w-full bg-slate-900 rounded-3xl overflow-hidden shadow-2xl animate-scaleUp"
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={() => setShowImagePopup(false)}
              className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-[#d12053] text-white flex items-center justify-center font-bold text-sm shadow-md hover:scale-110 transition-transform"
            >
              ✕
            </button>
            <img
              src="https://res.cloudinary.com/dcualfhwm/image/upload/v1779542480/eid6b_ux5bku.jpg"
              alt="ঈদ মোবারক"
              className="w-full h-auto max-h-[75vh] object-contain"
            />
            <div className="p-4 text-center bg-[#5d4037] text-white">
              <h4 className="text-lg font-bold">ধন্যবাদ! ঈদ মোবারক 🌙</h4>
              <p className="text-xs text-amber-200 mt-1">আপনার সালামির তথ্য সফলভাবে জমা হয়েছে!</p>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL 2: Sharable Digital Eid Salami Card (সালামি নেওয়ার পর) ================= */}
      {showSuccessCardModal && cardDataUrl && (
        <div
          className="fixed inset-0 z-[100005] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setShowSuccessCardModal(false)}
        >
          <div
            className="relative max-w-lg w-full bg-white rounded-3xl p-5 sm:p-6 shadow-2xl text-center space-y-4 animate-scaleUp max-h-[92vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={() => setShowSuccessCardModal(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <span className="text-3xl">🎉</span>
              <h3 className="text-xl sm:text-2xl font-bold text-[#5d4037]">সালামি কনফার্মড!</h3>
              <p className="text-xs sm:text-sm text-slate-600">
                স্পিনের ফলাফলের উপর ভিত্তি করে আপনার সালামির পরিমাণ <strong className="text-[#d12053] font-bold">{wonAmount}</strong> নির্ধারণ করা হয়েছে। খুব দ্রুত আপনার বিকাশ নম্বরে পৌঁছে যাবে।
              </p>
            </div>

            {/* Generated Card Image Preview */}
            <div className="rounded-2xl overflow-hidden border-2 border-[#c5a059]/40 shadow-lg">
              <img src={cardDataUrl} alt="Eid Salami Card" className="w-full h-auto" />
            </div>

            {/* Download & Share Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                onClick={() => downloadSalamiCard(cardDataUrl, receiveName)}
                className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-[#5d4037] hover:bg-[#4a322b] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>কার্ড ডাউনলোড করুন</span>
              </button>

              <button
                onClick={() => shareSalamiCard(cardDataUrl, receiveName, wonAmount)}
                className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-[#25D366] hover:bg-[#1ebe5d] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
              >
                <Share2 className="w-4 h-4" />
                <span>বন্ধুদের সাথে শেয়ার করুন</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Salami Admin Panel Modal */}
      <SalamiAdminModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
      />
    </div>
  );
}

export default SalamiPage;
