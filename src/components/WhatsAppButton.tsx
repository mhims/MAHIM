import React, { useState } from 'react';
import { useSite } from '../context/SiteContext';
import { MessageCircle, X, Send, Sparkles, Check, PhoneCall } from 'lucide-react';

export const WhatsAppButton: React.FC = () => {
  const { settings } = useSite();
  const [isOpen, setIsOpen] = useState(false);
  const [customMsg, setCustomMsg] = useState('');

  const quickChips = [
    'সোশ্যাল মিডিয়া ব্যানার ডিজাইন',
    'লোগো ও ব্র্যান্ড আইডেন্টিটি',
    'ডিজাইনের চার্জ ও সময় কত লাগবে?',
    'জরুরি প্রজেক্ট নিয়ে কথা বলতে চাই'
  ];

  const handleSendQuickMsg = (e?: React.FormEvent, msgText?: string) => {
    if (e) e.preventDefault();
    const finalMsg = msgText || customMsg || settings.whatsappMessage || 'হ্যালো মাহিম! mahims.com দেখে নক করছি।';
    const encoded = encodeURIComponent(finalMsg);
    
    // Use official wa.me link directly as requested
    const baseLink = settings.whatsappLink || 'https://wa.me/@mahim.wp';
    const separator = baseLink.includes('?') ? '&' : '?';
    const url = `${baseLink}${separator}text=${encoded}`;
    window.open(url, '_blank', 'noopener,noreferrer');
    setIsOpen(false);
  };

  return (
    <div 
      id="floating-whatsapp-container"
      className="fixed bottom-20 right-4 sm:bottom-6 sm:right-6 z-50 flex flex-col items-end"
    >
      {/* 3D Animated Pop-up Chat Card */}
      {isOpen && (
        <div className="mb-3 w-80 sm:w-96 rounded-3xl bg-zinc-950/95 backdrop-blur-2xl border-2 border-emerald-500/40 shadow-[0_20px_50px_rgba(0,0,0,0.7)] overflow-hidden text-left animate-in zoom-in-95 fade-in duration-300">
          
          {/* 3D Gloss Header */}
          <div className="p-4 bg-gradient-to-r from-emerald-700 via-emerald-600 to-teal-700 text-white flex items-center justify-between border-b border-emerald-400/30 relative">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-11 h-11 rounded-2xl bg-zinc-900 border-2 border-white/40 overflow-hidden shadow-md">
                  <img
                    src={settings.heroImage}
                    alt={settings.siteName}
                    className="w-full h-full object-cover object-top"
                  />
                </div>
                {/* 3D Online Indicator badge */}
                <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-emerald-800 shadow-[0_0_8px_#34d399] animate-pulse"></span>
              </div>
              <div>
                <h4 className="text-sm font-black tracking-tight leading-tight flex items-center gap-1.5">
                  <span>মাহিম ইবনে খুদি</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-300"></span>
                </h4>
                <p className="text-[11px] text-emerald-100 font-medium flex items-center gap-1">
                  <span>অনলাইন • ৫ মিনিটে রিপ্লাই দেন</span>
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-xl text-emerald-100 hover:text-white hover:bg-white/20 transition-colors cursor-pointer"
              aria-label="Close WhatsApp chat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Chat Body */}
          <div className="p-4 space-y-3.5 bg-zinc-900/90 text-white">
            
            {/* Incoming Message Bubble */}
            <div className="bg-zinc-800/90 border border-white/10 p-3.5 rounded-2xl rounded-tl-none shadow-sm space-y-1">
              <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-400">
                <Sparkles className="w-3 h-3" />
                <span>মাহিম'স ক্রিয়েটিভ স্টুডিও</span>
              </div>
              <p className="text-xs text-zinc-200 leading-relaxed font-normal">
                👋 আসসালামু আলাইকুম! আমি <strong>মাহিম</strong>। আপনার ব্র্যান্ডিং, সোশ্যাল মিডিয়া ব্যানার বা যেকোনো ডিজাইন প্রজেক্টের ব্যাপারে এখনই কথা বলুন।
              </p>
              <span className="block text-[10px] text-zinc-400 text-right font-mono">এখনই একটিভ</span>
            </div>

            {/* Quick Topic Chips */}
            <div className="space-y-1.5">
              <p className="text-[11px] text-zinc-400 font-semibold">ক্লিক করে দ্রুত মেসেজ পাঠান:</p>
              <div className="flex flex-wrap gap-1.5">
                {quickChips.map((chip, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSendQuickMsg(undefined, chip)}
                    className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-zinc-800 hover:bg-emerald-600/30 text-zinc-200 hover:text-emerald-300 border border-white/10 hover:border-emerald-500/40 transition-all text-left cursor-pointer"
                  >
                    💬 {chip}
                  </button>
                ))}
              </div>
            </div>

            {/* Message Input Box */}
            <form onSubmit={handleSendQuickMsg} className="pt-1 flex gap-2">
              <input
                type="text"
                value={customMsg}
                onChange={e => setCustomMsg(e.target.value)}
                placeholder="আপনার বার্তাটি এখানে লিখুন..."
                className="flex-1 px-3.5 py-2.5 rounded-2xl bg-zinc-950 border border-white/15 text-white text-xs placeholder-zinc-500 focus:outline-none focus:border-emerald-400 transition-colors"
              />
              <button
                type="submit"
                className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-zinc-950 font-black text-xs flex items-center justify-center gap-1 transition-transform active:scale-95 shadow-md shadow-emerald-500/20 cursor-pointer"
                title="হোয়াটসঅ্যাপে পাঠান"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>

            {/* Direct Official Link */}
            <div className="pt-1 flex items-center justify-between text-[11px] text-zinc-400 border-t border-white/10">
              <a
                href={settings.whatsappLink || 'https://wa.me/@mahim.wp'}
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-400 font-bold hover:underline flex items-center gap-1 font-mono"
              >
                <span>wa.me/@mahim.wp</span>
                <span>→</span>
              </a>
              <span className="text-zinc-500">End-to-end encrypted</span>
            </div>

          </div>
        </div>
      )}

      {/* Floating 3D WhatsApp Button with Radar Pulse */}
      <div className="relative group">
        
        {/* Tooltip on hover (desktop only) */}
        {!isOpen && (
          <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 px-3.5 py-1.5 rounded-2xl bg-zinc-950 border border-emerald-500/30 text-white text-xs font-bold whitespace-nowrap shadow-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none hidden sm:flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span>মাহিমের সাথে হোয়াটসঅ্যাপে কথা বলুন 💬</span>
          </div>
        )}

        {/* Animated radar wave rings */}
        <span className="absolute -inset-2 rounded-full bg-emerald-500 opacity-40 animate-ping pointer-events-none" style={{ animationDuration: '2.5s' }} />
        <span className="absolute -inset-1 rounded-full bg-teal-400 opacity-30 animate-pulse pointer-events-none" />

        {/* The 3D Push Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-label="WhatsApp Contact Button"
          className="relative flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-tr from-emerald-600 via-emerald-500 to-teal-400 text-white shadow-[0_8px_25px_rgba(16,185,129,0.5)] border-2 border-white/40 hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer"
        >
          {/* Gloss overlay */}
          <div className="absolute top-0 left-0 right-0 h-1/2 rounded-t-full bg-gradient-to-b from-white/35 to-transparent pointer-events-none" />

          {isOpen ? (
            <X className="w-7 h-7 transition-transform duration-200" />
          ) : (
            <MessageCircle className="w-8 h-8 transition-transform duration-200 group-hover:scale-110 drop-shadow-md" />
          )}

          {/* Small online badge on button */}
          {!isOpen && (
            <span className="absolute top-0 right-0 w-4 h-4 bg-white rounded-full p-0.5 shadow-sm">
              <span className="block w-full h-full bg-emerald-500 rounded-full animate-pulse" />
            </span>
          )}
        </button>
      </div>
    </div>
  );
};
