import React, { useState, useEffect, useRef } from 'react';
import { 
  Send, Sparkles, ShieldCheck, Heart, 
  CheckCircle2, Copy, RefreshCw, PenTool, Lock, ArrowRight
} from 'lucide-react';
import { ChithiAdminModal } from './ChithiAdminModal';
import { detectUserDevice, saveLetter } from '../utils/chithiStorage';

export function ChithiPage() {
  const [content, setContent] = useState('');
  const [inkColor, setInkColor] = useState<'blue' | 'black' | 'maroon' | 'emerald'>('blue');
  const [paperTheme, setPaperTheme] = useState<'vintage' | 'parchment' | 'notebook' | 'blush'>('vintage');
  
  // Sending & Animation states
  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);

  // Admin Modal state
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const letterAreaRef = useRef<HTMLTextAreaElement>(null);

  // Setup Dynamic SEO for Google Ranking
  useEffect(() => {
    document.title = "Mahim Chithi | মাহিম চিঠি — মনের না বলা কথা পাঠান গোপনে";
    
    // Update or create name meta tags
    const metaTags: Record<string, string> = {
      'title': 'Mahim Chithi | মাহিম চিঠি - চিঠি ডট মি (Mahims Chithi)',
      'description': 'Mahim Chithi (মাহিম চিঠি) - Mahim Ibne Khudi কে বেনামে চিঠি পাঠান। মনের না বলা কথা, সিক্রেট অনুভূতি বা বার্তা পাঠান সম্পূর্ণ গোপনে ও নিরাপদে।',
      'keywords': 'Mahim Chithi, মাহিম চিঠি, Mahims Chithi, মাহিমস চিঠি, Mahim Chithi me, মাহিম চিঠি মি, mahim anonymous letter, চিঠি ডট মি মাহিম, chithi mahims, Mahim Ibne Khudi chithi',
      'robots': 'index, follow, max-image-preview:large',
    };

    Object.entries(metaTags).forEach(([name, val]) => {
      let el = document.querySelector(`meta[name="${name}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute('name', name);
        document.head.appendChild(el);
      }
      el.setAttribute('content', val);
    });

    // Update Open Graph and Twitter tags
    const ogTags: Record<string, string> = {
      'og:title': 'Mahim Chithi | মাহিম চিঠি — মনের না বলা কথা পাঠান গোপনে',
      'og:description': 'মাহিমকে বেনামে চিঠি পাঠান। কোনো পরিচয় ছাড়াই আপনার মনের না বলা কথা, সিক্রেট অনুভূতি বা বার্তা পাঠান ১০০% নিরাপদে।',
      'og:url': 'https://mahims.com/chithi',
      'og:site_name': 'Mahim Chithi',
      'og:image': 'https://mahims.com/assets/og-chithi.jpg',
      'og:image:secure_url': 'https://mahims.com/assets/og-chithi.jpg',
      'twitter:title': 'Mahim Chithi | মাহিম চিঠি — মনের না বলা কথা পাঠান গোপনে',
      'twitter:description': 'মাহিমকে বেনামে চিঠি পাঠান। কোনো পরিচয় ছাড়াই আপনার মনের না বলা কথা বা সিক্রেট বার্তা পাঠান ১০০% নিরাপদে।',
      'twitter:image': 'https://mahims.com/assets/og-chithi.jpg',
      'twitter:card': 'summary_large_image',
    };

    Object.entries(ogTags).forEach(([prop, val]) => {
      let el = document.querySelector(`meta[property="${prop}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute('property', prop);
        document.head.appendChild(el);
      }
      el.setAttribute('content', val);
    });

    // Update canonical link
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', 'https://mahims.com/chithi');
  }, []);

  // Keyboard shortcut listener: Ctrl + Alt + Windows + Shift + C
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check for C key
      if (e.key.toLowerCase() !== 'c') return;

      // Check for modifier keys: Ctrl + Alt + Shift (Windows key is metaKey)
      // We accept both Ctrl+Alt+Shift+Meta+C and Ctrl+Alt+Shift+C (in case OS traps Win key)
      if (e.ctrlKey && e.altKey && e.shiftKey) {
        e.preventDefault();
        setIsAdminOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Quick Inspiration Prompts
  const inspirationPrompts = [
    '💌 একটি না বলা কথা...',
    '✨ আপনার কাজের যে বিষয়টি আমার প্রিয়...',
    '🤫 একটা গোপন কথা বলি...',
    '☕ সেই পুরোনো দিনগুলোর স্মৃতি...',
    '💡 একটি বন্ধুত্বপূর্ণ পরামর্শ...'
  ];

  const handleApplyPrompt = (promptText: string) => {
    setContent((prev) => (prev ? `${prev}\n${promptText} ` : `${promptText} `));
    letterAreaRef.current?.focus();
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) {
      setErrorMessage('চিঠিতে কিছু মনের কথা লিখুন!');
      return;
    }

    setErrorMessage('');
    setIsSending(true);

    const deviceInfo = detectUserDevice();

    // Trigger sending envelope animation
    setTimeout(() => {
      saveLetter({
        content: content.trim(),
        deviceInfo: deviceInfo,
        inkColor: inkColor,
        paperTheme: paperTheme,
      });

      setIsSending(false);
      setIsSent(true);
    }, 1200);
  };

  const handleReset = () => {
    setContent('');
    setIsSent(false);
    setErrorMessage('');
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText('https://mahims.com/chithi');
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  // Color classes for ink
  const inkClasses = {
    blue: 'text-[#1e3a8a]',
    black: 'text-[#18181b]',
    maroon: 'text-[#881337]',
    emerald: 'text-[#065f46]',
  };

  // Paper background classes
  const paperClasses = {
    vintage: 'bg-[#fdfaf2] border-[#e8ddc9]',
    parchment: 'bg-[#faf4e6] border-[#decbb0]',
    notebook: 'bg-[#ffffff] border-[#e2e8f0]',
    blush: 'bg-[#fff7f7] border-[#fbcfe8]',
  };

  return (
    <div className="min-h-screen bg-[#f7f4ed] text-zinc-900 flex flex-col justify-between font-sans selection:bg-amber-300 selection:text-black">
      {/* Top Ambient Bar */}
      <div className="h-1.5 bg-gradient-to-r from-red-600 via-amber-500 to-blue-600 w-full" />

      {/* Main Container */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-8 sm:py-12 max-w-xl mx-auto w-full">
        {/* Profile Card / Header */}
        <div className="text-center space-y-3 mb-6 sm:mb-8">
          <div className="relative inline-block">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-4 border-amber-600/30 shadow-xl mx-auto bg-amber-100/50 p-1">
              <img
                src="https://res.cloudinary.com/drvyjj7td/image/upload/v1788708908/behance_pp_spfumh.jpg"
                alt="Mahim Ibne Khudi"
                className="w-full h-full object-cover rounded-full"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>
            {/* Postal Seal Badge */}
            <div className="absolute -bottom-2 -right-1 bg-amber-600 text-white p-1.5 rounded-full shadow-md border-2 border-white">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>

          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 tracking-tight font-['Plus_Jakarta_Sans',sans-serif]">
              Mahim Chithi
            </h1>
            <p className="text-sm font-semibold text-amber-800 font-['Hind_Siliguri',sans-serif] mt-0.5">
              মাহিমকে বেনামে চিঠি পাঠান
            </p>
          </div>

          {/* Privacy Guarantee Pill */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-amber-100/80 text-amber-900 border border-amber-300/60 shadow-sm">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
            <span>১০০% বেনামী — আপনার নাম বা পরিচয় কখনোই দেখা যাবে না</span>
          </div>
        </div>

        {/* Letter Desk Card */}
        <div className="w-full">
          {!isSent ? (
            /* Writing Desk State */
            <div className={`relative rounded-2xl shadow-xl border-2 p-5 sm:p-7 transition-all duration-300 ${paperClasses[paperTheme]}`}>
              {/* Postage Stamp on Top Right */}
              <div className="absolute top-4 right-4 sm:top-5 sm:right-5 pointer-events-none">
                <div className="w-14 h-18 sm:w-16 sm:h-20 border-2 border-dashed border-amber-800/60 bg-amber-50 rounded flex flex-col items-center justify-center p-1 text-center rotate-3 shadow-sm">
                  <span className="text-[8px] font-bold text-amber-900 uppercase">Dhaka GPO</span>
                  <span className="text-xl">🕊️</span>
                  <span className="text-[8px] font-mono font-bold text-amber-800">৳১.০০</span>
                </div>
              </div>

              {/* Ink & Theme Selector Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-amber-900/10 pr-16 sm:pr-20">
                {/* Ink Color Picker */}
                <div className="flex items-center space-x-1.5">
                  <span className="text-xs text-zinc-500 flex items-center gap-1">
                    <PenTool className="w-3 h-3 text-zinc-400" />
                    কালি:
                  </span>
                  <button
                    type="button"
                    onClick={() => setInkColor('blue')}
                    className={`w-6 h-6 rounded-full bg-blue-700 transition ${inkColor === 'blue' ? 'ring-2 ring-offset-2 ring-blue-700 scale-110' : 'opacity-70 hover:opacity-100'}`}
                    title="রয়েল ব্লু কালি"
                  />
                  <button
                    type="button"
                    onClick={() => setInkColor('black')}
                    className={`w-6 h-6 rounded-full bg-zinc-900 transition ${inkColor === 'black' ? 'ring-2 ring-offset-2 ring-zinc-900 scale-110' : 'opacity-70 hover:opacity-100'}`}
                    title="কালো কালি"
                  />
                  <button
                    type="button"
                    onClick={() => setInkColor('maroon')}
                    className={`w-6 h-6 rounded-full bg-rose-900 transition ${inkColor === 'maroon' ? 'ring-2 ring-offset-2 ring-rose-900 scale-110' : 'opacity-70 hover:opacity-100'}`}
                    title="মেরুন কালি"
                  />
                  <button
                    type="button"
                    onClick={() => setInkColor('emerald')}
                    className={`w-6 h-6 rounded-full bg-emerald-800 transition ${inkColor === 'emerald' ? 'ring-2 ring-offset-2 ring-emerald-800 scale-110' : 'opacity-70 hover:opacity-100'}`}
                    title="সবুজ কালি"
                  />
                </div>

                {/* Paper Theme Picker */}
                <div className="flex items-center space-x-1 text-xs">
                  <button
                    type="button"
                    onClick={() => setPaperTheme('vintage')}
                    className={`px-2 py-0.5 rounded transition ${paperTheme === 'vintage' ? 'bg-amber-800 text-white font-bold' : 'text-zinc-600 hover:text-zinc-900'}`}
                  >
                    ভিন্টেজ
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaperTheme('notebook')}
                    className={`px-2 py-0.5 rounded transition ${paperTheme === 'notebook' ? 'bg-amber-800 text-white font-bold' : 'text-zinc-600 hover:text-zinc-900'}`}
                  >
                    খাতা
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaperTheme('blush')}
                    className={`px-2 py-0.5 rounded transition ${paperTheme === 'blush' ? 'bg-amber-800 text-white font-bold' : 'text-zinc-600 hover:text-zinc-900'}`}
                  >
                    গোলাপি
                  </button>
                </div>
              </div>

              {/* Quick Inspiration Chips */}
              <div className="py-3 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                <span className="text-xs text-zinc-400 shrink-0">আইডিয়া:</span>
                {inspirationPrompts.map((prompt, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleApplyPrompt(prompt)}
                    className="shrink-0 text-xs px-2.5 py-1 rounded-full bg-amber-100/70 hover:bg-amber-200/80 text-amber-900 border border-amber-300/40 transition whitespace-nowrap"
                  >
                    {prompt}
                  </button>
                ))}
              </div>

              {/* Handwriting Textarea */}
              <div className="relative my-2">
                <textarea
                  ref={letterAreaRef}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="প্রিয় মাহিম,&#10;এখানে আপনার না বলা কথা, সিক্রেট অনুভূতি, প্রশংসা বা মনের যে কোনো কথা লিখুন..."
                  rows={6}
                  maxLength={1000}
                  className={`w-full bg-transparent border-0 resize-none focus:outline-none focus:ring-0 text-xl sm:text-2xl leading-relaxed font-['Galada','Kalam','Hind_Siliguri',cursive] placeholder-zinc-400 ${inkClasses[inkColor]}`}
                  style={{
                    backgroundImage: 'repeating-linear-gradient(transparent, transparent 38px, rgba(180, 83, 9, 0.12) 39px, rgba(180, 83, 9, 0.12) 40px)',
                    lineHeight: '40px',
                    paddingTop: '6px'
                  }}
                />

                <div className="flex items-center justify-between text-[11px] text-zinc-400 pt-2 border-t border-amber-900/10">
                  <span>হাতে লেখা স্টাইল (Handwriting Font)</span>
                  <span>{content.length} / ১০০০ অক্ষর</span>
                </div>
              </div>

              {/* Error Notice */}
              {errorMessage && (
                <p className="mt-3 text-xs text-red-600 font-bold text-center">
                  {errorMessage}
                </p>
              )}

              {/* Send Button */}
              <div className="mt-6">
                <button
                  type="button"
                  onClick={handleSend}
                  disabled={isSending}
                  className="w-full py-3.5 px-6 bg-gradient-to-r from-amber-700 via-amber-600 to-amber-700 hover:from-amber-600 hover:to-amber-500 text-white font-bold text-base rounded-xl shadow-lg shadow-amber-800/25 transition-all transform active:scale-[0.99] flex items-center justify-center gap-2 disabled:opacity-75 cursor-pointer"
                >
                  {isSending ? (
                    <>
                      <RefreshCw className="w-5 h-5 animate-spin" />
                      <span>চিঠি ভাঁজ হচ্ছে ও ডাকবাক্সে পাঠানো হচ্ছে...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      <span>চিঠি পাঠিয়ে দিন 📮</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : (
            /* Success Sent State */
            <div className="bg-[#fdfaf2] border-2 border-[#decbb0] rounded-2xl p-8 sm:p-12 text-center shadow-2xl space-y-6">
              <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center border-4 border-emerald-200/60 shadow-inner">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-zinc-900 font-['Hind_Siliguri',sans-serif]">
                  চিঠিটি সফলভাবে পৌঁছে গেছে! 🕊️
                </h3>
                <p className="text-sm text-zinc-600 max-w-md mx-auto leading-relaxed">
                  আপনার চিঠিটি মাহিমের গোপন ডাকবাক্সে জমা হয়েছে। মাহিম যখন তার চিঠির বাক্স খুলবে, অত্যন্ত যত্নে আপনার অনুভূতি পড়বে।
                </p>
              </div>

              {/* Social Share / Copy Link Box */}
              <div className="p-4 bg-amber-50/70 border border-amber-200/80 rounded-xl space-y-2">
                <p className="text-xs font-semibold text-amber-900">
                  বন্ধুদের সাথে এই লিংক শেয়ার করতে চান?
                </p>
                <div className="flex items-center gap-2 max-w-sm mx-auto">
                  <input
                    type="text"
                    readOnly
                    value="https://mahims.com/chithi"
                    className="flex-1 px-3 py-2 bg-white border border-amber-200 rounded-lg text-xs font-mono text-zinc-700 select-all"
                  />
                  <button
                    type="button"
                    onClick={handleCopyLink}
                    className="px-3 py-2 bg-amber-700 hover:bg-amber-600 text-white text-xs font-bold rounded-lg transition flex items-center gap-1 shrink-0"
                  >
                    {copiedLink ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedLink ? 'কপি হয়েছে!' : 'কপি লিংক'}
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-6 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold rounded-xl transition inline-flex items-center gap-2"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  আরেকটি চিঠি লিখুন
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Discreet Footer with Secret Admin Dot Button */}
      <footer className="py-6 px-4 text-center text-xs text-zinc-500">
        <p className="flex items-center justify-center gap-1 text-zinc-500 select-none">
          <span>Mahim Chithi</span>
          <button
            id="chithi-secret-admin-dot"
            type="button"
            onClick={() => setIsAdminOpen(true)}
            aria-label="Secret Dot"
            className="w-6 h-6 inline-flex items-center justify-center text-zinc-400 hover:text-zinc-600 active:scale-90 transition cursor-pointer select-none -mx-0.5"
          >
            •
          </button>
          <span>{new Date().getFullYear()}</span>
        </p>
      </footer>

      {/* Secret Admin Modal */}
      <ChithiAdminModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
      />
    </div>
  );
}

export default ChithiPage;
