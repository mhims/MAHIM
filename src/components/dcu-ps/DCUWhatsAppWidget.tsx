import React, { useState, useEffect } from 'react';
import { MessageCircle, X, Send, Smile, CheckCheck, BadgeCheck, User } from 'lucide-react';

interface DCUWhatsAppWidgetProps {
  mahimWhatsappLink?: string;
  crWhatsappLink?: string;
  crName?: string;
}

export const DCUWhatsAppWidget: React.FC<DCUWhatsAppWidgetProps> = ({
  mahimWhatsappLink = 'https://wa.me/@mahim.wp',
  crWhatsappLink = '',
  crName = 'ক্লাস প্রতিনিধি (সিআর)'
}) => {
  const [activePopup, setActivePopup] = useState<'mahim' | 'cr' | null>(null);
  const [customMsg, setCustomMsg] = useState('');
  const [currentTime, setCurrentTime] = useState('');
  const [timeGreeting, setTimeGreeting] = useState('দিন');

  useEffect(() => {
    const now = new Date();
    let hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    setCurrentTime(`${hours}:${minutes} ${ampm}`);

    const currentHour = now.getHours();
    if (currentHour >= 5 && currentHour < 12) {
      setTimeGreeting('সকাল');
    } else if (currentHour >= 12 && currentHour < 15) {
      setTimeGreeting('দুপুর');
    } else if (currentHour >= 15 && currentHour < 18) {
      setTimeGreeting('বিকাল');
    } else if (currentHour >= 18 && currentHour < 20) {
      setTimeGreeting('সন্ধ্যা');
    } else {
      setTimeGreeting('রাত্রি');
    }
  }, [activePopup]);

  const handleSendMahim = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const msgToSend = customMsg.trim() || 'আসসালামু আলাইকুম মাহিম, রাষ্ট্রবিজ্ঞান ডিপার্টমেন্ট পেজ থেকে যোগাযোগ করছি।';
    const separator = mahimWhatsappLink.includes('?') ? '&' : '?';
    const url = `${mahimWhatsappLink}${separator}text=${encodeURIComponent(msgToSend)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
    setActivePopup(null);
    setCustomMsg('');
  };

  const handleSendCR = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!crWhatsappLink) {
      alert('সিআর-এর হোয়াটসঅ্যাপ নম্বর শীঘ্রই অ্যাডমিন প্যানেল থেকে যুক্ত করা হবে।');
      return;
    }
    const msgToSend = customMsg.trim() || 'আসসালামু আলাইকুম সিআর, ক্লাস ও নোটিশ সংক্রান্ত বিষয়ে জানতে চাচ্ছি।';
    const separator = crWhatsappLink.includes('?') ? '&' : '?';
    const url = `${crWhatsappLink}${separator}text=${encodeURIComponent(msgToSend)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
    setActivePopup(null);
    setCustomMsg('');
  };

  return (
    <div
      id="dcu-floating-whatsapp-group"
      className="fixed bottom-20 right-3.5 z-40 flex flex-col items-end gap-2 font-sans select-none pointer-events-auto"
    >
      {/* ========================================================================= */}
      {/* 1. MAHIM WHATSAPP POPUP                                                   */}
      {/* ========================================================================= */}
      {activePopup === 'mahim' && (
        <div className="mb-2 w-[285px] sm:w-[315px] rounded-2xl overflow-hidden shadow-[0_16px_45px_rgba(0,0,0,0.32)] border border-zinc-300 dark:border-zinc-700 text-left animate-in zoom-in-95 fade-in duration-200 bg-[#efeae2]">
          {/* Header */}
          <div className="bg-[#008069] text-white px-3 py-2.5 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-2 min-w-0">
              <div className="relative shrink-0">
                <img
                  src="https://res.cloudinary.com/drvyjj7td/image/upload/v1788708908/behance_pp_spfumh.jpg"
                  alt="@mahim.wp"
                  className="w-9 h-9 rounded-full object-cover border border-white/30"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://res.cloudinary.com/drvyjj7td/image/upload/v1791540199/logo_df1onj.png';
                  }}
                />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[#25D366] border-2 border-[#008069]" />
              </div>
              <div className="min-w-0">
                <h4 className="text-xs font-bold text-white truncate flex items-center gap-1 font-mono">
                  <span>@mahim.wp</span>
                  <BadgeCheck className="w-3.5 h-3.5 fill-[#1d9bf0] text-white shrink-0" />
                </h4>
                <p className="text-[10px] text-emerald-100 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse" />
                  <span>অনলাইন (মাহিম)</span>
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setActivePopup(null)}
              className="p-1 rounded-full text-white/80 hover:text-white hover:bg-black/10 transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Chat canvas */}
          <div
            className="p-3 bg-[#efeae2] text-zinc-800 min-h-[140px] flex flex-col justify-between relative"
            style={{
              backgroundImage: `radial-gradient(#d4ccc3 0.85px, transparent 0.85px)`,
              backgroundSize: '15px 15px',
            }}
          >
            <div className="flex justify-center mb-1.5">
              <span className="bg-white/90 text-[10px] text-zinc-500 px-2.5 py-0.5 rounded-md font-medium shadow-2xs">
                আজ
              </span>
            </div>

            <div className="relative max-w-[92%] self-start bg-white text-zinc-900 p-2.5 pl-3 rounded-lg rounded-tl-none shadow-[0_1px_1px_rgba(11,20,26,0.12)] border border-black/5 space-y-1">
              <p className="text-xs leading-relaxed text-zinc-900">
                আসসালামু আলাইকুম। শুভ {timeGreeting}। ডিপার্টমেন্ট বা রুটিন সংক্রান্ত কোনো তথ্যে সমস্যা হলে জানাতে পারেন।
              </p>
              <div className="flex items-center justify-end gap-1 text-[9px] text-zinc-400 select-none pt-0.5">
                <span>{currentTime || 'এখন'}</span>
                <CheckCheck className="w-3 h-3 text-[#53bdeb]" />
              </div>
            </div>

            <div className="pt-2 text-center">
              <span className="text-[9px] text-zinc-500 bg-amber-100/70 border border-amber-200/60 px-2 py-0.5 rounded-md inline-flex items-center gap-1">
                🔒 এন্ড-টু-এন্ড এনক্রিপ্টেড চ্যাট
              </span>
            </div>
          </div>

          {/* Input Form */}
          <form onSubmit={handleSendMahim} className="bg-[#f0f2f5] px-2 py-2 flex items-center gap-1.5 border-t border-zinc-200">
            <Smile className="w-4 h-4 text-zinc-400 pl-0.5 shrink-0" />
            <input
              type="text"
              value={customMsg}
              onChange={(e) => setCustomMsg(e.target.value)}
              placeholder="মাহিমকে মেসেজ লিখুন..."
              className="flex-1 px-3 py-1 rounded-full bg-white text-zinc-900 text-xs placeholder-zinc-400 focus:outline-none border border-zinc-200 focus:border-emerald-500"
            />
            <button
              type="submit"
              className="w-7 h-7 rounded-full bg-[#00a884] hover:bg-[#02906f] text-white flex items-center justify-center transition active:scale-90 shadow-xs cursor-pointer shrink-0"
              title="পাঠান"
            >
              <Send className="w-3 h-3 translate-x-px" />
            </button>
          </form>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. CR WHATSAPP POPUP                                                      */}
      {/* ========================================================================= */}
      {activePopup === 'cr' && (
        <div className="mb-2 w-[285px] sm:w-[315px] rounded-2xl overflow-hidden shadow-[0_16px_45px_rgba(0,0,0,0.32)] border border-zinc-300 dark:border-zinc-700 text-left animate-in zoom-in-95 fade-in duration-200 bg-[#efeae2]">
          {/* Header */}
          <div className="bg-[#008069] text-white px-3 py-2.5 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-2 min-w-0">
              <div className="relative shrink-0 w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-white border border-white/30 font-bold text-xs">
                <span>সিআর</span>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[#25D366] border-2 border-[#008069]" />
              </div>
              <div className="min-w-0">
                <h4 className="text-xs font-bold text-white truncate flex items-center gap-1">
                  <span>{crName}</span>
                </h4>
                <p className="text-[10px] text-emerald-100 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse" />
                  <span>ক্লাস প্রতিনিধি হেল্পলাইন</span>
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setActivePopup(null)}
              className="p-1 rounded-full text-white/80 hover:text-white hover:bg-black/10 transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Chat canvas */}
          <div
            className="p-3 bg-[#efeae2] text-zinc-800 min-h-[140px] flex flex-col justify-between relative"
            style={{
              backgroundImage: `radial-gradient(#d4ccc3 0.85px, transparent 0.85px)`,
              backgroundSize: '15px 15px',
            }}
          >
            <div className="flex justify-center mb-1.5">
              <span className="bg-white/90 text-[10px] text-zinc-500 px-2.5 py-0.5 rounded-md font-medium shadow-2xs">
                আজ
              </span>
            </div>

            <div className="relative max-w-[92%] self-start bg-white text-zinc-900 p-2.5 pl-3 rounded-lg rounded-tl-none shadow-[0_1px_1px_rgba(11,20,26,0.12)] border border-black/5 space-y-1">
              <p className="text-xs leading-relaxed text-zinc-900">
                {crWhatsappLink
                  ? 'আসসালামু আলাইকুম। ক্লাস প্রতিনিধি (CR)-এর সাথে যোগাযোগ করতে নিচে মেসেজ টাইপ করুন।'
                  : 'আসসালামু আলাইকুম। সিআর-এর নির্ধারিত হোয়াটসঅ্যাপ লিংক শীঘ্রই আপডেট করা হচ্ছে।'}
              </p>
              <div className="flex items-center justify-end gap-1 text-[9px] text-zinc-400 select-none pt-0.5">
                <span>{currentTime || 'এখন'}</span>
                <CheckCheck className="w-3 h-3 text-[#53bdeb]" />
              </div>
            </div>

            <div className="pt-2 text-center">
              <span className="text-[9px] text-zinc-500 bg-amber-100/70 border border-amber-200/60 px-2 py-0.5 rounded-md inline-flex items-center gap-1">
                🔒 ক্লাস প্রতিনিধি অফিসিয়াল চ্যাট
              </span>
            </div>
          </div>

          {/* Input Form */}
          <form onSubmit={handleSendCR} className="bg-[#f0f2f5] px-2 py-2 flex items-center gap-1.5 border-t border-zinc-200">
            <Smile className="w-4 h-4 text-zinc-400 pl-0.5 shrink-0" />
            <input
              type="text"
              value={customMsg}
              onChange={(e) => setCustomMsg(e.target.value)}
              placeholder="সিআর-কে মেসেজ লিখুন..."
              className="flex-1 px-3 py-1 rounded-full bg-white text-zinc-900 text-xs placeholder-zinc-400 focus:outline-none border border-zinc-200 focus:border-emerald-500"
            />
            <button
              type="submit"
              className="w-7 h-7 rounded-full bg-[#00a884] hover:bg-[#02906f] text-white flex items-center justify-center transition active:scale-90 shadow-xs cursor-pointer shrink-0"
              title="পাঠান"
            >
              <Send className="w-3 h-3 translate-x-px" />
            </button>
          </form>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. TWO COMPACT FLOATING ACTION BUTTONS                                    */}
      {/* ========================================================================= */}
      <div className="flex flex-col gap-2 items-end">
        {/* CR Button with "সিআর" Badge */}
        <button
          type="button"
          onClick={() => setActivePopup(activePopup === 'cr' ? null : 'cr')}
          title="ক্লাস প্রতিনিধি (সিআর) WhatsApp"
          className="relative flex items-center justify-center w-10 h-10 rounded-full bg-[#1e293b] hover:bg-[#0f172a] text-white border-2 border-amber-400/80 shadow-[0_4px_14px_rgba(0,0,0,0.35)] hover:scale-105 active:scale-95 transition-all cursor-pointer group"
        >
          <span className="text-[11px] font-bold tracking-tight text-amber-300 font-sans">
            সিআর
          </span>
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-[#25D366] rounded-full border border-white flex items-center justify-center" />
        </button>

        {/* Mahim's Personal WhatsApp Button (Small, Authentic) */}
        <button
          type="button"
          onClick={() => setActivePopup(activePopup === 'mahim' ? null : 'mahim')}
          title="মাহিম (WhatsApp)"
          className="relative flex items-center justify-center w-10 h-10 rounded-full bg-[#25D366] hover:bg-[#20ba5a] text-white border-2 border-white/80 shadow-[0_4px_14px_rgba(37,211,102,0.45)] hover:scale-105 active:scale-95 transition-all cursor-pointer"
        >
          {activePopup === 'mahim' ? (
            <X className="w-4 h-4 text-white" />
          ) : (
            <MessageCircle className="w-5 h-5 text-white fill-white/20" />
          )}
          <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full border border-white animate-pulse" />
        </button>
      </div>
    </div>
  );
};
