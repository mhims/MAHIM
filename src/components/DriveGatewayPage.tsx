import React, { useState, useEffect, useRef } from 'react';
import { Lock, Unlock, ArrowRight, Printer, Upload, ShieldCheck, AlertCircle, ExternalLink, ArrowLeft } from 'lucide-react';
import { navigateTo } from '../utils/navigation';

interface DriveGatewayProps {
  mode: 'allf' | 'allu';
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
  },
  allu: {
    title: 'All Upload',
    subtitle: 'ফাইল আপলোড ও কালেকশন পোর্টাল',
    badge: 'আপলোড ড্রাইভ',
    icon: Upload,
    color: 'blue',
    driveUrl: 'https://drive.google.com/drive/folders/12p_mwStynD98DfgL5ruO37YD94ywz8ia?usp=sharing',
    password: '197200',
  },
};

export const DriveGatewayPage: React.FC<DriveGatewayProps> = ({ mode }) => {
  const config = GATEWAY_CONFIG[mode];
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
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

    // Auto focus on input
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
      setIsRedirecting(true);

      // Instant redirect to Google Drive
      setTimeout(() => {
        window.location.replace(config.driveUrl);
      }, 500);
    } else {
      setError(true);
      setPassword('');
      inputRef.current?.focus();
    }
  };

  const IconComponent = config.icon;

  return (
    <div className="min-h-screen bg-[#0d0f12] text-zinc-100 flex flex-col items-center justify-center p-4 selection:bg-zinc-700">
      {/* Background ambient gradient */}
      <div className="fixed inset-0 pointer-events-none">
        <div className={`absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full blur-[120px] opacity-25 ${
          mode === 'allf' ? 'bg-emerald-500' : 'bg-blue-500'
        }`} />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Top Header Card */}
        <div className="bg-[#161a20] border border-zinc-800/80 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-sm">
          {/* Badge & Icon */}
          <div className="flex items-center justify-between mb-6">
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium border ${
              mode === 'allf'
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
            }`}>
              <IconComponent size={14} />
              <span>{config.badge}</span>
            </div>

            <span className="flex items-center gap-1.5 text-xs text-zinc-400 font-mono">
              <ShieldCheck size={14} className="text-zinc-500" />
              <span>প্রাইভেট ড্রাইভ</span>
            </span>
          </div>

          <h1 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
            <span>{config.title}</span>
            <span className="text-xs px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 font-mono font-normal">
              /{mode}
            </span>
          </h1>
          <p className="text-sm text-zinc-400 mb-6 font-['Hind_Siliguri',sans-serif]">
            {config.subtitle}। ড্রাইভে প্রবেশের জন্য পাসওয়ার্ড দিন।
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
                    : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-900/30'
                }`}
              >
                <span>ড্রাইভে প্রবেশ করুন</span>
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
                গুগল ড্রাইভে রিডাইরেক্ট করা হচ্ছে...
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
