import React, { useState, useEffect } from 'react';
import { useSite } from '../context/SiteContext';
import { MessageCircle, X, Send, Smile, CheckCheck, BadgeCheck } from 'lucide-react';

export const WhatsAppButton: React.FC = () => {
  const { settings } = useSite();
  const [isOpen, setIsOpen] = useState(false);
  const [customMsg, setCustomMsg] = useState('');
  const [currentTime, setCurrentTime] = useState('');
  const [timeGreeting, setTimeGreeting] = useState('দিন');

  const avatarUrl = settings.whatsappAvatarUrl || 'https://res.cloudinary.com/drvyjj7td/image/upload/v1788708908/behance_pp_spfumh.jpg';
  const whatsappTarget = settings.whatsappLink || 'https://wa.me/@mahim.wp';

  useEffect(() => {
    // Format current time like WhatsApp (e.g. 03:45 PM) and calculate time greeting
    const now = new Date();
    let hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    setCurrentTime(`${hours}:${minutes} ${ampm}`);

    // Time-based greeting:
    // 5 AM to 11:59 AM -> সকাল
    // 12 PM to 3:59 PM -> দুপুর
    // 4 PM to 7:59 PM -> বিকাল
    // 8 PM to 4:59 AM -> রাত্রি
    const currentHour = now.getHours();
    if (currentHour >= 5 && currentHour < 12) {
      setTimeGreeting('সকাল');
    } else if (currentHour >= 12 && currentHour < 16) {
      setTimeGreeting('দুপুর');
    } else if (currentHour >= 16 && currentHour < 20) {
      setTimeGreeting('বিকাল');
    } else {
      setTimeGreeting('রাত্রি');
    }
  }, [isOpen]);

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const msgToSend = customMsg.trim() || `আসসালামু আলাইকুম মাহিম, mahims.com থেকে মেসেজ করছি।`;
    const separator = whatsappTarget.includes('?') ? '&' : '?';
    const url = `${whatsappTarget}${separator}text=${encodeURIComponent(msgToSend)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
    setIsOpen(false);
    setCustomMsg('');
  };

  return (
    <div
      id="floating-whatsapp-container"
      className="fixed bottom-20 right-4 sm:bottom-6 sm:right-6 z-50 flex flex-col items-end font-sans select-none"
    >
      {/* Real WhatsApp Chat Popup (Strict Light Theme) */}
      {isOpen && (
        <div 
          id="whatsapp-chat-popup"
          className="mb-3 w-[295px] sm:w-[325px] rounded-2xl overflow-hidden shadow-[0_16px_45px_rgba(0,0,0,0.28)] border border-zinc-200 text-left animate-in zoom-in-95 fade-in duration-200 bg-[#efeae2]"
        >
          {/* Classic Real WhatsApp Green Header */}
          <div className="bg-[#008069] text-white px-3.5 py-3 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-2.5 min-w-0">
              {/* WhatsApp Profile Avatar */}
              <div className="relative shrink-0">
                <img
                  src={avatarUrl}
                  alt="@mahim.wp"
                  className="w-10 h-10 rounded-full object-cover border border-white/25 shadow-xs"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://res.cloudinary.com/drvyjj7td/image/upload/v1788708908/behance_pp_spfumh.jpg';
                  }}
                />
                {/* Active Online Green Dot */}
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[#25D366] border-2 border-[#008069]"></span>
              </div>

              {/* Username Only (@mahim.wp) with Verified Blue Badge & Online Status */}
              <div className="min-w-0">
                <h4 className="text-sm font-bold tracking-tight text-white truncate flex items-center gap-1.5 font-mono">
                  <span>@mahim.wp</span>
                  <span className="inline-flex items-center" title="Verified Account">
                    <BadgeCheck className="w-4 h-4 fill-[#1d9bf0] text-white shrink-0 drop-shadow-xs" />
                  </span>
                </h4>
                <p className="text-[11px] text-emerald-100 font-medium flex items-center gap-1 leading-tight">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse"></span>
                  <span>অনলাইন</span>
                </p>
              </div>
            </div>

            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-full text-white/80 hover:text-white hover:bg-black/10 transition-colors cursor-pointer shrink-0"
              aria-label="হোয়াটসঅ্যাপ চ্যাট বন্ধ করুন"
            >
              <X className="w-4.5 h-4.5" />
            </button>
          </div>

          {/* WhatsApp Authentic Light Chat Canvas with Background Pattern */}
          <div 
            className="p-3.5 bg-[#efeae2] text-zinc-800 min-h-[160px] flex flex-col justify-between relative"
            style={{
              backgroundImage: `radial-gradient(#d4ccc3 0.85px, transparent 0.85px)`,
              backgroundSize: '15px 15px',
            }}
          >
            {/* WhatsApp Date Stamp Pill */}
            <div className="flex justify-center mb-2">
              <span className="bg-white/90 text-[10.5px] text-zinc-500 px-3 py-0.5 rounded-md font-medium shadow-xs uppercase tracking-wider backdrop-blur-xs border border-zinc-200/60">
                আজ
              </span>
            </div>

            {/* Authentic WhatsApp Incoming Message Bubble (White on Cream background) */}
            <div className="relative max-w-[92%] self-start bg-white text-zinc-900 p-2.5 pl-3 rounded-lg rounded-tl-none shadow-[0_1px_1px_rgba(11,20,26,0.12)] border border-black/5 space-y-1">
              {/* WhatsApp speech bubble corner tail */}
              <div className="absolute top-0 -left-1.5 w-2 h-2.5 overflow-hidden">
                <div className="w-3 h-3 bg-white rotate-45 transform origin-top-right border-l border-t border-black/5"></div>
              </div>

              {/* Exact Requested Message Content with Time-of-day Greeting */}
              <p className="text-[13px] leading-relaxed select-text font-normal text-zinc-900">
                আসসালামু আলাইকুম। শুভ {timeGreeting}। কোন প্রয়োজন হলে মেসেজ করুন।
              </p>

              {/* WhatsApp Time & Blue Double Checkmark */}
              <div className="flex items-center justify-end gap-1 text-[10px] text-zinc-400 select-none pt-0.5">
                <span>{currentTime || 'এখন'}</span>
                <CheckCheck className="w-3.5 h-3.5 text-[#53bdeb]" />
              </div>
            </div>

            {/* End-to-End Encryption Badge */}
            <div className="pt-2 text-center">
              <span className="text-[10px] text-zinc-500 bg-amber-100/70 border border-amber-200/60 px-2.5 py-0.5 rounded-md inline-flex items-center gap-1 shadow-2xs">
                🔒 এন্ড-টু-এন্ড এনক্রিপ্টেড চ্যাট
              </span>
            </div>
          </div>

          {/* Real WhatsApp Light Message Input Bar */}
          <form 
            onSubmit={handleSend}
            className="bg-[#f0f2f5] px-2.5 py-2 flex items-center gap-2 border-t border-zinc-200"
          >
            {/* Smile / Emoji Icon */}
            <div className="text-zinc-500 pl-1">
              <Smile className="w-5 h-5 opacity-70" />
            </div>

            {/* Input Field */}
            <input
              type="text"
              value={customMsg}
              onChange={(e) => setCustomMsg(e.target.value)}
              placeholder="একটি মেসেজ লিখুন..."
              className="flex-1 px-3.5 py-1.5 rounded-full bg-white text-zinc-900 text-xs placeholder-zinc-400 focus:outline-none shadow-2xs border border-zinc-200 focus:border-emerald-500/50"
            />

            {/* Real WhatsApp Circular Green Send Button */}
            <button
              type="submit"
              className="w-8 h-8 rounded-full bg-[#00a884] hover:bg-[#02906f] text-white flex items-center justify-center transition-transform active:scale-90 shadow-sm shrink-0 cursor-pointer"
              title="হোয়াটসঅ্যাপে পাঠান"
              aria-label="বার্তা পাঠান"
            >
              <Send className="w-3.5 h-3.5 translate-x-px" />
            </button>
          </form>
        </div>
      )}

      {/* Floating WhatsApp Floating Circular Button */}
      <div className="relative group">
        {/* Tooltip on hover (desktop only) */}
        {!isOpen && (
          <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-xl bg-zinc-950 border border-emerald-500/40 text-white text-xs font-medium whitespace-nowrap shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none hidden sm:flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span>হোয়াটসঅ্যাপে কথা বলুন</span>
          </div>
        )}

        {/* Pulse wave behind button */}
        <span className="absolute -inset-1 rounded-full bg-emerald-500 opacity-40 animate-ping pointer-events-none" style={{ animationDuration: '3s' }} />

        {/* The WhatsApp Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-label="WhatsApp Contact Button"
          className="relative flex items-center justify-center w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-[#25D366] hover:bg-[#20ba5a] text-white shadow-[0_6px_20px_rgba(37,211,102,0.45)] border-2 border-white/80 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
        >
          {isOpen ? (
            <X className="w-6 h-6 transition-transform duration-150" />
          ) : (
            <MessageCircle className="w-7 h-7 transition-transform duration-150 drop-shadow-xs fill-white/20" />
          )}

          {/* Small online badge */}
          {!isOpen && (
            <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-white rounded-full p-0.5 shadow-xs">
              <span className="block w-full h-full bg-[#25D366] rounded-full" />
            </span>
          )}
        </button>
      </div>
    </div>
  );
};
