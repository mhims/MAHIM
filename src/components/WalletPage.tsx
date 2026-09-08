import React, { useState, useEffect } from 'react';
import { Lock, Unlock, ShieldAlert, KeyRound, Eye, EyeOff, ExternalLink, RefreshCw, ArrowLeft } from 'lucide-react';

// Cryptographic hash of PIN + custom salt: sha256(PIN + "mahim_secure_salt_wallet_2026")
// Real PIN is NEVER stored in plaintext in the repository or bundle!
const HASH_TARGET = '417510745b8bc3e91468947b198cb33157b3682e706a9279410581113667f6eb';
const SALT = 'mahim_secure_salt_wallet_2026';

// XOR stream cipher encrypted URL payload using the secret PIN as dynamic decryption key
const ENCRYPTED_STREAM = [
  115, 105, 107, 109, 105, 33, 50, 48, 110, 121, 105, 116, 111, 105, 52, 124, 114, 112, 122, 118,
  126, 51, 124, 114, 119, 52, 112, 126, 126, 104, 116, 110, 48, 110, 53, 90, 86, 121, 100, 121,
  121, 106, 121, 72, 124, 74, 105, 86, 72, 40, 125, 66, 87, 77, 96, 81, 42, 119, 89, 83, 40, 75,
  113, 69, 117, 87, 40, 70, 48, 89, 126, 81, 50, 108, 80, 67, 84, 44, 48, 73, 111, 117, 115, 84,
  86, 76, 127, 121, 120, 92, 111, 66, 45, 85, 116, 109, 36, 72, 42, 67, 54, 116, 72, 43, 44, 87,
  86, 48, 120, 98, 126, 126
];

// In-browser SHA256 helper
async function sha256(message: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

// Decrypt stream using input PIN
function decryptUrl(pin: string): string {
  const shift = 42;
  let res = '';
  for (let i = 0; i < ENCRYPTED_STREAM.length; i++) {
    const k = pin.charCodeAt(i % pin.length);
    res += String.fromCharCode(ENCRYPTED_STREAM[i] ^ k ^ shift);
  }
  return res;
}

export const WalletPage: React.FC = () => {
  const [pin, setPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [decryptedAppUrl, setDecryptedAppUrl] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [iframeKey, setIframeKey] = useState(0);

  // Strictly enforce No-Index, No-Follow, No-Archive on this page
  useEffect(() => {
    let robotsMeta = document.querySelector('meta[name="robots"]') as HTMLMetaElement | null;
    let created = false;
    if (!robotsMeta) {
      robotsMeta = document.createElement('meta');
      robotsMeta.name = 'robots';
      document.head.appendChild(robotsMeta);
      created = true;
    }
    const previousContent = robotsMeta.content;
    robotsMeta.content = 'noindex, nofollow, noarchive, nosnippet';

    const prevTitle = document.title;
    document.title = 'Personal Vault | Mahim';

    // Check if authenticated in current session
    const sessionToken = sessionStorage.getItem('mahim_wallet_token');
    if (sessionToken) {
      try {
        const decoded = atob(sessionToken);
        sha256(decoded + SALT).then((hash) => {
          if (hash === HASH_TARGET) {
            setDecryptedAppUrl(decryptUrl(decoded));
            setIsAuthenticated(true);
          }
        });
      } catch {
        sessionStorage.removeItem('mahim_wallet_token');
      }
    }

    return () => {
      document.title = prevTitle;
      if (robotsMeta) {
        if (created) {
          document.head.removeChild(robotsMeta);
        } else {
          robotsMeta.content = previousContent || 'index, follow';
        }
      }
    };
  }, []);

  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pin.trim()) return;

    setIsLoading(true);
    setErrorMsg('');

    try {
      const computedHash = await sha256(pin.trim() + SALT);
      if (computedHash === HASH_TARGET) {
        const secretUrl = decryptUrl(pin.trim());
        setDecryptedAppUrl(secretUrl);
        setIsAuthenticated(true);
        sessionStorage.setItem('mahim_wallet_token', btoa(pin.trim()));
      } else {
        setErrorMsg('ভুল পাসওয়ার্ড! অনুগ্রহ করে সঠিক পাসওয়ার্ড দিন।');
      }
    } catch {
      setErrorMsg('যাচাই করার সময় সমস্যা হয়েছে। আবার চেষ্টা করুন।');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLock = () => {
    sessionStorage.removeItem('mahim_wallet_token');
    setIsAuthenticated(false);
    setDecryptedAppUrl(null);
    setPin('');
  };

  const navigateHome = () => {
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans selection:bg-amber-500 selection:text-black">
      {/* Top Bar */}
      <header className="border-b border-neutral-800/80 bg-neutral-900/70 backdrop-blur-md px-4 py-3 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <button
            onClick={navigateHome}
            id="wallet-back-btn"
            className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors flex items-center gap-2 text-sm"
            title="Return to Main Website"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">মূল ওয়েবসাইটে ফেরত যান</span>
          </button>
          <div className="h-4 w-px bg-neutral-800 hidden sm:block" />
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500">
              <Lock className="w-3.5 h-3.5" />
            </div>
            <h1 className="font-semibold text-sm tracking-tight text-neutral-200">
              Personal Vault & Cash Management
            </h1>
            <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-red-950/60 text-red-400 border border-red-800/40 tracking-wider">
              Private / No-Index
            </span>
          </div>
        </div>

        {isAuthenticated && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIframeKey((prev) => prev + 1)}
              id="wallet-refresh-btn"
              className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors text-xs flex items-center gap-1.5"
              title="রিলোড করুন"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span className="hidden md:inline">রিলোড</span>
            </button>
            {decryptedAppUrl && (
              <a
                href={decryptedAppUrl}
                target="_blank"
                rel="noreferrer"
                id="wallet-direct-open-btn"
                className="p-2 text-neutral-400 hover:text-amber-400 hover:bg-neutral-800 rounded-lg transition-colors text-xs flex items-center gap-1.5"
                title="নতুন ট্যাবে ওপেন করুন"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span className="hidden md:inline">সরাসরি খুলুন</span>
              </a>
            )}
            <button
              onClick={handleLock}
              id="wallet-lock-btn"
              className="px-3 py-1.5 bg-neutral-800 hover:bg-red-950/50 hover:text-red-400 text-neutral-300 text-xs font-medium rounded-lg border border-neutral-700 hover:border-red-800/50 transition-all flex items-center gap-1.5"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>লক করুন</span>
            </button>
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col">
        {!isAuthenticated ? (
          <div className="flex-1 flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-neutral-900/90 border border-neutral-800 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl relative overflow-hidden">
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

              <div className="text-center mb-6">
                <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 shadow-inner">
                  <KeyRound className="w-7 h-7" />
                </div>
                <h2 className="text-xl font-bold text-white tracking-tight">প্রাইভেট ওয়ালেট আনলক</h2>
                <p className="text-neutral-400 text-xs mt-1.5 leading-relaxed">
                  এই পেজটি সম্পূর্ণ এনক্রিপ্টেড ও প্রাইভেট। ভেতরে প্রবেশ করতে আপনার সিক্রেট পাসওয়ার্ডটি প্রদান করুন।
                </p>
              </div>

              <form onSubmit={handleUnlock} className="space-y-4">
                <div>
                  <label htmlFor="wallet-pin-input" className="block text-xs font-medium text-neutral-300 mb-1.5">
                    সিক্রেট পিন / পাসওয়ার্ড
                  </label>
                  <div className="relative">
                    <input
                      id="wallet-pin-input"
                      type={showPin ? 'text' : 'password'}
                      value={pin}
                      onChange={(e) => setPin(e.target.value)}
                      placeholder="পাসওয়ার্ড লিখুন..."
                      autoFocus
                      required
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-4 py-3 text-white placeholder-neutral-600 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all font-mono tracking-wider text-base"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPin(!showPin)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-300 p-1"
                      aria-label="Toggle password visibility"
                    >
                      {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {errorMsg && (
                  <div className="p-3 bg-red-950/40 border border-red-800/40 rounded-xl text-red-300 text-xs flex items-center gap-2 animate-shake">
                    <ShieldAlert className="w-4 h-4 shrink-0 text-red-400" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <button
                  type="submit"
                  id="wallet-unlock-submit"
                  disabled={isLoading || !pin.trim()}
                  className="w-full bg-amber-500 hover:bg-amber-400 text-neutral-950 font-semibold py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-amber-500/10 cursor-pointer"
                >
                  {isLoading ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <Unlock className="w-4 h-4" />
                      <span>ওয়ালেট আনলক করুন</span>
                    </>
                  )}
                </button>
              </form>

              <div className="mt-6 pt-4 border-t border-neutral-800/60 text-center">
                <span className="text-[11px] text-neutral-500 flex items-center justify-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                  ক্লায়েন্ট সাইড সল্টেড হ্যাশ ও স্ট্রীম সাইফার এনক্রিপশন সক্রিয়
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 w-full h-[calc(100vh-53px)] bg-neutral-950 relative">
            {decryptedAppUrl && (
              <iframe
                key={iframeKey}
                src={decryptedAppUrl}
                title="Mahim Personal Wallet & Cash Management"
                className="w-full h-full border-0"
                allow="clipboard-write; clipboard-read"
                sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals allow-downloads"
              />
            )}
          </div>
        )}
      </main>
    </div>
  );
};
