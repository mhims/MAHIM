import React, { useState, useEffect, useRef } from 'react';
import {
  Lock,
  Unlock,
  ArrowRight,
  Printer,
  Upload,
  ShieldCheck,
  AlertCircle,
  ExternalLink,
  ArrowLeft,
  FileText,
  RotateCcw,
  Maximize2,
  Edit3
} from 'lucide-react';
import { navigateTo } from '../utils/navigation';

interface DriveGatewayProps {
  mode: 'allf' | 'allu' | 'alll';
}

const GATEWAY_CONFIG = {
  allf: {
    title: 'All Files',
    subtitle: 'প্রিন্ট করার ফাইল এক্সেস পোর্টাল',
    badge: 'প্রিন্ট ড্রাইভ',
    icon: Printer,
    color: 'emerald',
    driveUrl: 'https://drive.google.com/drive/folders/1oGcWYUmuVZJbfnAF7QqnvHd3HCnmai1z',
    password: '197200',
    embedPreview: false,
  },
  allu: {
    title: 'All Upload',
    subtitle: 'ফাইল আপলোড ও কালেকশন পোর্টাল',
    badge: 'আপলোড ড্রাইভ',
    icon: Upload,
    color: 'blue',
    driveUrl: 'https://drive.google.com/drive/folders/12p_mwStynD98DfgL5ruO37YD94ywz8ia?usp=sharing',
    password: '197200',
    embedPreview: false,
  },
  alll: {
    title: 'All Links & Docs',
    subtitle: 'জরুরি লেখা ও লিংক সংরক্ষণ ডকস পোর্টাল',
    badge: 'নোটস ও লিংক',
    icon: FileText,
    color: 'amber',
    driveUrl: 'https://docs.google.com/document/d/1gQEKNhJaVhAlTfrKYQMqMYijSu_2szjMHOhzmeuMeoA/edit?tab=t.0',
    password: '197200',
    embedPreview: true,
  },
};

export const DriveGatewayPage: React.FC<DriveGatewayProps> = ({ mode }) => {
  const config = GATEWAY_CONFIG[mode];
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [activeDocUrl, setActiveDocUrl] = useState(() => {
    if (typeof window !== 'undefined' && mode === 'alll') {
      return localStorage.getItem('mahim_alll_docs_url') || config.driveUrl;
    }
    return config.driveUrl;
  });
  const [isEditingUrl, setIsEditingUrl] = useState(false);
  const [customUrlInput, setCustomUrlInput] = useState(activeDocUrl);

  const inputRef = useRef<HTMLInputElement>(null);

  // Enforce No-Index in meta tags
  useEffect(() => {
    document.title = `${config.title} | Protected Gateway - Mahim`;
    let metaRobots = document.querySelector('meta[name="robots"]') as HTMLMetaElement | null;
    if (!metaRobots) {
      metaRobots = document.createElement('meta');
      metaRobots.setAttribute('name', 'robots');
      document.head.appendChild(metaRobots);
    }
    const originalRobots = metaRobots.content;
    metaRobots.content = 'noindex, nofollow, noarchive, nosnippet';

    // Auto focus on password input
    inputRef.current?.focus();

    return () => {
      if (metaRobots) {
        metaRobots.content = originalRobots || 'index, follow';
      }
    };
  }, [config.title]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanPass = password.trim();

    if (cleanPass === config.password) {
      setError(false);
      setIsUnlocked(true);

      // If mode has embedPreview disabled (allf or allu), redirect immediately
      if (!config.embedPreview) {
        setTimeout(() => {
          window.location.replace(config.driveUrl);
        }, 500);
      }
    } else {
      setError(true);
      setPassword('');
      inputRef.current?.focus();
    }
  };

  const handleSaveCustomUrl = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = customUrlInput.trim();
    if (clean) {
      setActiveDocUrl(clean);
      if (typeof window !== 'undefined') {
        localStorage.setItem('mahim_alll_docs_url', clean);
      }
      setIsEditingUrl(false);
    }
  };

  // Convert Google Docs URL to embed previewable URL if needed
  const getEmbeddableUrl = (url: string) => {
    if (!url) return '';
    try {
      if (url.includes('docs.google.com/document/d/')) {
        // Replace /edit with /preview or ?embedded=true
        if (url.includes('/edit')) {
          return url.replace(/\/edit.*$/, '/preview');
        }
        if (!url.includes('/preview')) {
          return url.replace(/\/+$/, '') + '/preview';
        }
      }
      return url;
    } catch {
      return url;
    }
  };

  const IconComponent = config.icon;

  // Render Full Embedded Preview for 'alll' once unlocked
  if (isUnlocked && config.embedPreview) {
    const embedUrl = getEmbeddableUrl(activeDocUrl);
    const isPlaceholder = activeDocUrl.includes('1_SET_YOUR_DOC_LINK_HERE');

    return (
      <div className="min-h-screen bg-[#0d0f12] text-zinc-100 flex flex-col">
        {/* Top Control Bar */}
        <header className="h-14 border-b border-zinc-800 bg-[#161a20]/90 backdrop-blur px-4 flex items-center justify-between shrink-0 sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigateTo('/')}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
              title="মূল ওয়েবসাইটে ফিরুন"
            >
              <ArrowLeft size={18} />
            </button>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <span className="font-semibold text-sm text-white">All Links & Docs</span>
              <span className="text-xs px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 font-mono">
                /{mode}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => setIsEditingUrl(!isEditingUrl)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors font-['Hind_Siliguri',sans-serif]"
              title="লিংক পরিবর্তন করুন"
            >
              <Edit3 size={14} />
              <span className="hidden sm:inline">লিংক পরিবর্তন</span>
            </button>

            <a
              href={activeDocUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-amber-500 hover:bg-amber-400 text-black transition-colors font-['Hind_Siliguri',sans-serif]"
            >
              <span>নতুন ট্যাবে ওপেন</span>
              <ExternalLink size={14} />
            </a>

            <button
              onClick={() => {
                setIsUnlocked(false);
                setPassword('');
              }}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-red-400 hover:bg-zinc-800 transition-colors"
              title="লক করুন"
            >
              <Lock size={16} />
            </button>
          </div>
        </header>

        {/* Change URL Drawer / Panel if toggled */}
        {isEditingUrl && (
          <div className="p-4 bg-zinc-900 border-b border-zinc-800 text-sm">
            <form onSubmit={handleSaveCustomUrl} className="max-w-2xl mx-auto flex flex-col sm:flex-row gap-2">
              <input
                type="url"
                value={customUrlInput}
                onChange={(e) => setCustomUrlInput(e.target.value)}
                placeholder="আপনার গুগল ডকস লিংক পেস্ট করুন..."
                className="flex-grow px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white text-xs font-mono focus:outline-none focus:border-amber-500"
              />
              <div className="flex gap-2 shrink-0">
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-black text-xs font-medium rounded-lg font-['Hind_Siliguri',sans-serif]"
                >
                  সংরক্ষণ করুন
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditingUrl(false)}
                  className="px-3 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 text-xs rounded-lg font-['Hind_Siliguri',sans-serif]"
                >
                  বাতিল
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Main Content Area */}
        <main className="flex-1 p-2 sm:p-4 flex flex-col items-center justify-center">
          {isPlaceholder ? (
            <div className="max-w-md w-full text-center p-8 bg-[#161a20] border border-zinc-800 rounded-2xl">
              <FileText size={42} className="mx-auto text-amber-400 mb-4" />
              <h2 className="text-xl font-bold text-white mb-2 font-['Hind_Siliguri',sans-serif]">
                গুগল ডকস লিংক সেট করুন
              </h2>
              <p className="text-xs text-zinc-400 mb-6 font-['Hind_Siliguri',sans-serif]">
                আপনার গুগল ডকসের লিংকটি এখনো যুক্ত করা হয়নি। উপরের "লিংক পরিবর্তন" বাটনে ক্লিক করে অথবা নিচে লিংক পেস্ট করে সেভ করুন।
              </p>
              <form onSubmit={handleSaveCustomUrl} className="space-y-3">
                <input
                  type="url"
                  value={customUrlInput}
                  onChange={(e) => setCustomUrlInput(e.target.value)}
                  placeholder="https://docs.google.com/document/d/..."
                  className="w-full px-3 py-2.5 bg-zinc-900 border border-zinc-700 rounded-xl text-white text-xs font-mono focus:outline-none focus:border-amber-500"
                />
                <button
                  type="submit"
                  className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-black font-semibold text-xs rounded-xl transition-all font-['Hind_Siliguri',sans-serif]"
                >
                  লিংক সেভ করুন ➔
                </button>
              </form>
            </div>
          ) : (
            <div className="w-full h-full flex-1 flex flex-col relative rounded-xl overflow-hidden border border-zinc-800/80 bg-zinc-900 shadow-2xl">
              <iframe
                src={embedUrl}
                title="Google Docs Preview"
                className="w-full h-[calc(100vh-4.5rem)] border-0 rounded-xl bg-white"
                allow="autoplay"
              />
              
              {/* Floating Helper for browsers where Google blocks iframe */}
              <div className="absolute bottom-4 right-4 z-20 bg-zinc-900/90 backdrop-blur border border-zinc-700 px-3 py-2 rounded-xl text-xs flex items-center gap-2 shadow-lg">
                <span className="text-zinc-400 font-['Hind_Siliguri',sans-serif]">প্রিভিউ লোড না হলে:</span>
                <a
                  href={activeDocUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-amber-400 hover:underline inline-flex items-center gap-1"
                >
                  <span>সরাসরি ডকসে যান</span>
                  <ExternalLink size={12} />
                </a>
              </div>
            </div>
          )}
        </main>
      </div>
    );
  }

  // Password Lock Screen
  return (
    <div className="min-h-screen bg-[#0d0f12] text-zinc-100 flex flex-col items-center justify-center p-4 selection:bg-zinc-700">
      {/* Background ambient gradient */}
      <div className="fixed inset-0 pointer-events-none">
        <div
          className={`absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full blur-[120px] opacity-25 ${
            mode === 'allf'
              ? 'bg-emerald-500'
              : mode === 'allu'
              ? 'bg-blue-500'
              : 'bg-amber-500'
          }`}
        />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Top Header Card */}
        <div className="bg-[#161a20] border border-zinc-800/80 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-sm">
          {/* Badge & Icon */}
          <div className="flex items-center justify-between mb-6">
            <div
              className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border ${
                mode === 'allf'
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                  : mode === 'allu'
                  ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                  : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
              }`}
            >
              <IconComponent size={14} />
              <span>{config.badge}</span>
            </div>

            <span className="flex items-center gap-1.5 text-xs text-zinc-400 font-mono">
              <ShieldCheck size={14} className="text-zinc-500" />
              <span>প্রাইভেট পোর্টাল</span>
            </span>
          </div>

          <h1 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
            <span>{config.title}</span>
            <span className="text-xs px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 font-mono font-normal">
              /{mode}
            </span>
          </h1>
          <p className="text-sm text-zinc-400 mb-6 font-['Hind_Siliguri',sans-serif]">
            {config.subtitle}। প্রবেশের জন্য পাসওয়ার্ড দিন।
          </p>

          {/* Form */}
          {!isUnlocked ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-2 font-['Hind_Siliguri',sans-serif]">
                  পাসওয়ার্ড লিখুন:
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
                    <Lock size={18} />
                  </div>
                  <input
                    ref={inputRef}
                    type="password"
                    inputMode="numeric"
                    autoComplete="off"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (error) setError(false);
                    }}
                    placeholder="পাসওয়ার্ড লিখুন..."
                    className={`w-full pl-10 pr-4 py-3 bg-zinc-900/90 border rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-2 transition-all font-mono tracking-widest text-lg ${
                      error
                        ? 'border-red-500/80 focus:ring-red-500/40'
                        : 'border-zinc-700 focus:border-zinc-500 focus:ring-zinc-600/30'
                    }`}
                  />
                </div>

                {error && (
                  <div className="mt-2.5 flex items-center gap-1.5 text-xs text-red-400 font-['Hind_Siliguri',sans-serif]">
                    <AlertCircle size={14} className="shrink-0" />
                    <span>ভুল পাসওয়ার্ড! সঠিক পাসওয়ার্ড দিয়ে আবার চেষ্টা করুন।</span>
                  </div>
                )}
              </div>

              <button
                type="submit"
                className={`w-full py-3 px-4 rounded-xl font-medium text-sm transition-all flex items-center justify-center gap-2 shadow-lg ${
                  mode === 'allf'
                    ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-900/30'
                    : mode === 'allu'
                    ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-900/30'
                    : 'bg-amber-500 hover:bg-amber-400 text-black shadow-amber-900/30'
                }`}
              >
                <span>প্রবেশ করুন</span>
                <ArrowRight size={16} />
              </button>
            </form>
          ) : (
            <div className="text-center py-4 space-y-4">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-1">
                <Unlock size={28} />
              </div>
              <h3 className="text-lg font-semibold text-white font-['Hind_Siliguri',sans-serif]">
                পাসওয়ার্ড সঠিক হয়েছে!
              </h3>
              <p className="text-xs text-zinc-400 font-['Hind_Siliguri',sans-serif]">
                রিডাইরেক্ট করা হচ্ছে...
              </p>

              <div className="pt-2">
                <a
                  href={config.driveUrl}
                  className="inline-flex items-center gap-2 text-xs font-medium text-emerald-400 hover:text-emerald-300 underline underline-offset-4"
                >
                  <span>অটোমেটিক না গেলে এখানে সরাসরি ক্লিক করুন</span>
                  <ExternalLink size={14} />
                </a>
              </div>
            </div>
          )}

          {/* Quick Notice */}
          <div className="mt-6 pt-5 border-t border-zinc-800/80 flex items-center justify-between text-xs text-zinc-400">
            <span className="font-['Hind_Siliguri',sans-serif]">গুগল সার্চ ও পাবলিক ইনডেক্স থেকে গোপন</span>
            <span className="font-mono text-zinc-400">100% Private</span>
          </div>
        </div>

        {/* Back link */}
        <div className="mt-4 text-center">
          <button
            onClick={() => navigateTo('/')}
            className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-zinc-200 transition-colors font-['Hind_Siliguri',sans-serif]"
          >
            <ArrowLeft size={14} />
            <span>মূল ওয়েবসাইটে ফিরে যান</span>
          </button>
        </div>
      </div>
    </div>
  );
};
