import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { 
  Send, Sparkles, ShieldCheck, 
  CheckCircle2, Copy, RefreshCw, PenTool, Loader2,
  X, Check, Download, Share2, Gift, Paperclip, ChevronDown
} from 'lucide-react';
import { ChithiAdminModal } from './ChithiAdminModal';
import { 
  detectUserDevice, 
  saveLetter, 
  recordDeletedChithiText, 
  recordDeletedChithiVersion,
  recordUnsentChithiDraft 
} from '../utils/chithiStorage';
import { VINTAGE_STAMPS } from '../data/vintageStamps';
import { CHITHI_TOKENS } from '../data/chithiTokens';
import { playPenWritingSound } from '../utils/chithiSoundEffects';
import { 
  PeacockFeatherSvg, 
  LotusSvg, 
  RunnerSvg, 
  GoldenPaperClipSvg,
  DriedRoseSvg,
  JasmineSvg 
} from './ChithiCustomIcons';
import { 
  generateChithiReceiptCard, 
  downloadChithiReceiptCard, 
  shareChithiReceiptCard 
} from '../utils/chithiReceiptGenerator';

// Extract Unicode words (supports Bengali, English, numbers)
const extractWords = (str: string): string[] => {
  const matches = str.match(/[\p{L}\p{N}\u0980-\u09FF]+/gu);
  return matches || [];
};

export type PaperStyle = 'vintage' | 'notebook' | 'kraft' | 'blush' | 'midnight';

export function ChithiPage() {
  const [content, setContent] = useState('');
  const [inkColor, setInkColor] = useState<'blue' | 'black' | 'maroon' | 'emerald'>('blue');
  const [paperTheme, setPaperTheme] = useState<PaperStyle>('vintage');
  const [selectedStampId, setSelectedStampId] = useState<string>('dove');
  const [showStampPicker, setShowStampPicker] = useState<boolean>(false);

  // Attached Keepsake Token - Defaults to null (nothing pre-selected)
  const [selectedTokenId, setSelectedTokenId] = useState<string | null>(null);
  const [showTokenPicker, setShowTokenPicker] = useState<boolean>(false);

  // Envelope Receipt Card states (Clean & Minimal mini envelope)
  const [receiptDataUrl, setReceiptDataUrl] = useState<string | null>(null);
  const [isGeneratingReceipt, setIsGeneratingReceipt] = useState<boolean>(false);
  const [receiptShared, setReceiptShared] = useState<boolean>(false);

  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);

  // Admin Modal state
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const letterAreaRef = useRef<HTMLTextAreaElement>(null);

  // Smart tracking refs for Drafts, Versions & Backspace Word Deletions
  const contentRef = useRef('');
  const peakDraftRef = useRef('');
  const preDeleteSnapshotRef = useRef('');
  const activeDeletionSessionRef = useRef<{ snapshot: string; startTime: number } | null>(null);
  const versionCountRef = useRef(0);
  const loggedVersionsRef = useRef<Set<string>>(new Set());
  const lastLoggedDeleteRef = useRef('');
  const lastLoggedDraftRef = useRef('');
  const isSentRef = useRef(false);
  const deleteTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Setup Dynamic SEO for Google Ranking
  useEffect(() => {
    document.title = "Mahim Chithi | মাহিম চিঠি — মনের না বলা কথা পাঠান গোপনে";
    
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

    const chithiImageUrl = 'https://res.cloudinary.com/drvyjj7td/image/upload/v1789445680/MAHIM_CHITHI_xxkl9p.png';
    const ogTags: Record<string, string> = {
      'og:title': 'Mahim Chithi | মাহিম চিঠি — মনের না বলা কথা পাঠান গোপনে',
      'og:description': 'মাহিমকে বেনামে চিঠি পাঠান। কোনো পরিচয় ছাড়াই আপনার মনের না বলা কথা, সিক্রেট অনুভূতি বা বার্তা পাঠান ১০০% নিরাপদে।',
      'og:url': 'https://mahims.com/chithi',
      'og:site_name': 'Mahim Chithi',
      'og:image': chithiImageUrl,
      'og:image:secure_url': chithiImageUrl,
      'og:image:type': 'image/png',
      'twitter:title': 'Mahim Chithi | মাহিম চিঠি — মনের না বলা কথা পাঠান গোপনে',
      'twitter:description': 'মাহিমকে বেনামে চিঠি পাঠান। কোনো পরিচয় ছাড়াই আপনার মনের না বলা কথা বা সিক্রেট বার্তা পাঠান ১০০% নিরাপদে।',
      'twitter:image': chithiImageUrl,
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

    ['twitter:card', 'twitter:title', 'twitter:description', 'twitter:image'].forEach((tName) => {
      let el = document.querySelector(`meta[name="${tName}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute('name', tName);
        document.head.appendChild(el);
      }
      el.setAttribute('content', ogTags[tName] || '');
    });

    let imageSrc = document.querySelector('link[rel="image_src"]');
    if (!imageSrc) {
      imageSrc = document.createElement('link');
      imageSrc.setAttribute('rel', 'image_src');
      document.head.appendChild(imageSrc);
    }
    imageSrc.setAttribute('href', chithiImageUrl);

    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', 'https://mahims.com/chithi');
  }, []);

  // Keyboard shortcut listener: Ctrl + Alt + Shift + C
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() !== 'c') return;
      if (e.ctrlKey && e.altKey && e.shiftKey) {
        e.preventDefault();
        setIsAdminOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Unsent draft auto-logger on page unload
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (isSentRef.current) return;
      const textToSave = peakDraftRef.current.trim() || contentRef.current.trim();
      if (textToSave.length >= 5 && lastLoggedDraftRef.current !== textToSave) {
        lastLoggedDraftRef.current = textToSave;
        recordUnsentChithiDraft(textToSave, detectUserDevice());
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  // Flush pending deletion version to Google Sheet / storage
  const flushPendingDeletionVersion = (remainingText?: string) => {
    if (isSentRef.current) return;
    if (!activeDeletionSessionRef.current) return;

    const snapshot = activeDeletionSessionRef.current.snapshot.trim();
    const current = (remainingText !== undefined ? remainingText : contentRef.current).trim();
    activeDeletionSessionRef.current = null;

    if (!snapshot || snapshot.length < 3) {
      preDeleteSnapshotRef.current = current;
      return;
    }

    const wordsBefore = extractWords(snapshot);
    const wordsAfter = extractWords(current);
    const wordsRemoved = wordsBefore.length - wordsAfter.length;

    // Log if words were deleted
    if (wordsRemoved >= 1 && snapshot !== current && !loggedVersionsRef.current.has(snapshot)) {
      versionCountRef.current += 1;
      loggedVersionsRef.current.add(snapshot);
      recordDeletedChithiVersion(
        snapshot,
        versionCountRef.current,
        current,
        detectUserDevice()
      );
    }

    preDeleteSnapshotRef.current = current;
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (isSentRef.current) return;

    // Play subtle realistic pen scratch sound
    if (e.key === 'Backspace' || e.key === 'Delete') {
      playPenWritingSound();
      if (!activeDeletionSessionRef.current) {
        activeDeletionSessionRef.current = {
          snapshot: preDeleteSnapshotRef.current || contentRef.current,
          startTime: Date.now()
        };
      }
    } else if (e.key.length === 1 || e.key === 'Enter') {
      playPenWritingSound();
    }
  };

  const handleContentChange = (val: string) => {
    const prevVal = contentRef.current;
    setContent(val);
    contentRef.current = val;

    // Ensure audio plays even on mobile touch keyboards / virtual input
    playPenWritingSound();

    if (isSentRef.current) return;

    const trimmed = val.trim();

    // If text length decreased (user is backspacing/deleting words or letters)
    if (val.length < prevVal.length) {
      if (!activeDeletionSessionRef.current) {
        activeDeletionSessionRef.current = {
          snapshot: preDeleteSnapshotRef.current || prevVal,
          startTime: Date.now()
        };
      }

      // Reset debounce timer - wait 750ms after user pauses or finishes hitting backspace
      if (deleteTimerRef.current) clearTimeout(deleteTimerRef.current);
      deleteTimerRef.current = setTimeout(() => {
        flushPendingDeletionVersion();
      }, 750);
    } else {
      if (activeDeletionSessionRef.current) {
        if (deleteTimerRef.current) clearTimeout(deleteTimerRef.current);
        flushPendingDeletionVersion(prevVal);
      }
      preDeleteSnapshotRef.current = val;
      if (trimmed.length > peakDraftRef.current.trim().length) {
        peakDraftRef.current = val;
      }
    }
  };

  const handleBlur = () => {
    if (isSentRef.current) return;
    if (deleteTimerRef.current) clearTimeout(deleteTimerRef.current);
    flushPendingDeletionVersion();

    const trimmed = contentRef.current.trim();
    const peakText = peakDraftRef.current.trim();

    if (!trimmed && peakText.length >= 3 && lastLoggedDeleteRef.current !== peakText && !loggedVersionsRef.current.has(peakText)) {
      lastLoggedDeleteRef.current = peakText;
      loggedVersionsRef.current.add(peakText);
      recordDeletedChithiText(peakText, detectUserDevice());
      peakDraftRef.current = '';
      preDeleteSnapshotRef.current = '';
    }
  };

  // Quick Inspiration Prompts
  const inspirationPrompts = [
    '💌 একটি না বলা কথা...',
    '✨ আপনার কাজের যে বিষয়টি আমার প্রিয়...',
    '🤫 একটা গোপন কথা বলি...',
    '☕ সেই পুরোনো দিনগুলোর স্মৃতি...',
    '💡 একটি বন্ধুত্বপূর্ণ পরামর্শ...'
  ];

  const handleApplyPrompt = (promptText: string) => {
    const updated = contentRef.current ? `${contentRef.current}\n${promptText} ` : `${promptText} `;
    handleContentChange(updated);
    letterAreaRef.current?.focus();
    playPenWritingSound();
  };

  // Select/Deselect token handler
  const handleToggleToken = (tokenId: string) => {
    if (selectedTokenId === tokenId) {
      setSelectedTokenId(null);
    } else {
      setSelectedTokenId(tokenId);
    }
    playPenWritingSound();
  };

  // Send letter directly
  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) {
      setErrorMessage('চিঠিতে কিছু মনের কথা লিখুন!');
      return;
    }

    if (deleteTimerRef.current) clearTimeout(deleteTimerRef.current);
    flushPendingDeletionVersion(content.trim());

    setErrorMessage('');
    setIsSending(true);

    try {
      isSentRef.current = true;
      const deviceInfo = detectUserDevice();
      const finalContent = content.trim();
      const peakText = peakDraftRef.current.trim();

      if (peakText.length >= 5 && peakText !== finalContent && (peakText.length - finalContent.length >= 3)) {
        if (!loggedVersionsRef.current.has(peakText)) {
          versionCountRef.current += 1;
          loggedVersionsRef.current.add(peakText);
          recordDeletedChithiVersion(
            peakText,
            versionCountRef.current,
            finalContent,
            deviceInfo
          );
        }
      }

      // Save letter with selected stamp, paper style, and attached keepsake token
      saveLetter({
        content: finalContent,
        deviceInfo: deviceInfo,
        inkColor: inkColor,
        paperTheme: paperTheme,
        stampId: selectedStampId,
        tokenId: selectedTokenId || undefined,
      });

      setIsSending(false);
      setIsSent(true);

      // Generate the mini envelope receipt card immediately
      setIsGeneratingReceipt(true);
      const currStamp = VINTAGE_STAMPS.find(s => s.id === selectedStampId) || VINTAGE_STAMPS[0];
      const currToken = CHITHI_TOKENS.find(t => t.id === selectedTokenId);

      const dateStr = new Date().toLocaleDateString('bn-BD', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });

      generateChithiReceiptCard({
        dateStr: `${dateStr} • ${new Date().toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' })}`,
        stampName: currStamp.name,
        stampValue: currStamp.value,
        stampIcon: currStamp.isPeacockFeather ? '🪶' : currStamp.isLotus ? '🪷' : currStamp.isRunner ? '🏃' : currStamp.icon,
        tokenName: currToken?.name,
        tokenShortName: currToken?.shortName,
        tokenIcon: currToken?.icon,
      }).then((url) => {
        setReceiptDataUrl(url);
        setIsGeneratingReceipt(false);
      }).catch((err) => {
        console.warn('Envelope receipt generation error:', err);
        setIsGeneratingReceipt(false);
      });

      // Confetti celebration
      try {
        confetti({
          particleCount: 85,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#c5a059', '#b91c1c', '#1e3a8a', '#10b981'],
        });
      } catch {}
    } catch (err) {
      console.error('Error sending letter:', err);
      setIsSending(false);
      setErrorMessage('চিঠি পাঠাতে সমস্যা হয়েছে, অনুগ্রহ করে আবার চেষ্টা করুন।');
    }
  };

  const handleDownloadReceipt = () => {
    if (!receiptDataUrl) return;
    downloadChithiReceiptCard(receiptDataUrl);
  };

  const handleShareReceipt = async () => {
    if (!receiptDataUrl) return;
    const shared = await shareChithiReceiptCard(receiptDataUrl);
    if (!shared) {
      const shareText = `মাহিমকে চিঠি ডট মি (mahims.com/chithi) তে একটি গোপন চিঠি পাঠিয়েছি! 📮`;
      navigator.clipboard.writeText(shareText);
      setReceiptShared(true);
      setTimeout(() => setReceiptShared(false), 3000);
    }
  };

  const handleReset = () => {
    if (deleteTimerRef.current) clearTimeout(deleteTimerRef.current);
    isSentRef.current = false;
    contentRef.current = '';
    peakDraftRef.current = '';
    preDeleteSnapshotRef.current = '';
    activeDeletionSessionRef.current = null;
    lastLoggedDeleteRef.current = '';
    lastLoggedDraftRef.current = '';
    versionCountRef.current = 0;
    loggedVersionsRef.current.clear();
    setContent('');
    setSelectedTokenId(null); // Reset gift selection to null
    setIsSent(false);
    setReceiptDataUrl(null);
    setErrorMessage('');
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText('https://mahims.com/chithi');
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  // Color classes for ink depending on paper theme
  const inkClasses = {
    blue: paperTheme === 'midnight' ? 'text-sky-300' : 'text-[#1e3a8a]',
    black: paperTheme === 'midnight' ? 'text-slate-100' : 'text-[#18181b]',
    maroon: paperTheme === 'midnight' ? 'text-rose-300' : 'text-[#881337]',
    emerald: paperTheme === 'midnight' ? 'text-emerald-300' : 'text-[#065f46]',
  };

  // Paper styling definitions
  const paperClasses: Record<PaperStyle, string> = {
    vintage: 'bg-[#fdf8ec] border-[#decbb0] shadow-[0_15px_40px_rgba(180,83,9,0.12)]',
    notebook: 'bg-white border-[#cbd5e1] shadow-[0_15px_35px_rgba(0,0,0,0.06)] border-l-[6px] border-l-rose-400/80',
    kraft: 'bg-[#f5ebd6] border-[#d4be98] shadow-[0_15px_40px_rgba(146,64,14,0.14)]',
    blush: 'bg-[#fff5f7] border-[#fbcfe8] shadow-[0_15px_35px_rgba(244,63,94,0.09)]',
    midnight: 'bg-[#161d2a] border-[#334155] shadow-[0_20px_50px_rgba(0,0,0,0.55)]',
  };

  // Paper line styles
  const paperLineStyles: Record<PaperStyle, React.CSSProperties> = {
    vintage: {
      backgroundImage: 'repeating-linear-gradient(transparent, transparent 38px, rgba(180, 83, 9, 0.12) 39px, rgba(180, 83, 9, 0.12) 40px)',
      lineHeight: '40px',
      paddingTop: '6px'
    },
    notebook: {
      backgroundImage: 'repeating-linear-gradient(transparent, transparent 38px, rgba(59, 130, 246, 0.22) 39px, rgba(59, 130, 246, 0.22) 40px)',
      lineHeight: '40px',
      paddingTop: '6px',
      paddingLeft: '12px'
    },
    kraft: {
      backgroundImage: 'repeating-linear-gradient(transparent, transparent 38px, rgba(146, 64, 14, 0.16) 39px, rgba(146, 64, 14, 0.16) 40px)',
      lineHeight: '40px',
      paddingTop: '6px'
    },
    blush: {
      backgroundImage: 'repeating-linear-gradient(transparent, transparent 38px, rgba(244, 63, 94, 0.16) 39px, rgba(244, 63, 94, 0.16) 40px)',
      lineHeight: '40px',
      paddingTop: '6px'
    },
    midnight: {
      backgroundImage: 'repeating-linear-gradient(transparent, transparent 38px, rgba(234, 179, 8, 0.2) 39px, rgba(234, 179, 8, 0.2) 40px)',
      lineHeight: '40px',
      paddingTop: '6px'
    }
  };

  const currentStamp = VINTAGE_STAMPS.find(s => s.id === selectedStampId) || VINTAGE_STAMPS[0];
  const activeToken = CHITHI_TOKENS.find(t => t.id === selectedTokenId);

  // Helper renderer for stamp icon
  const renderStampVisualIcon = (stamp: typeof currentStamp, sizeClass: string = "w-7 h-7 sm:w-8 sm:h-8") => {
    if (stamp.isPeacockFeather) {
      return <PeacockFeatherSvg className={sizeClass} />;
    }
    if (stamp.isLotus) {
      return <LotusSvg className={sizeClass} />;
    }
    if (stamp.isRunner) {
      return <RunnerSvg className={sizeClass} />;
    }
    return <span className="text-xl sm:text-2xl">{stamp.icon}</span>;
  };

  // Helper renderer for keepsake pinned token
  const renderTokenItemVisual = (token: typeof activeToken, className: string = "w-8 h-8") => {
    if (!token) return null;
    if (token.id === 'peacock_feather') {
      return <PeacockFeatherSvg className={className} />;
    }
    if (token.id === 'rose') {
      return <DriedRoseSvg className={className} />;
    }
    if (token.id === 'jasmine') {
      return <JasmineSvg className={className} />;
    }
    return <span className="text-2xl drop-shadow-xs select-none">{token.icon}</span>;
  };

  return (
    <div className={`min-h-screen flex flex-col justify-between font-sans selection:bg-amber-300 selection:text-black transition-colors duration-400 ${
      paperTheme === 'midnight' ? 'bg-[#0f141c] text-slate-100' : 'bg-[#f7f4ed] text-zinc-900'
    }`}>
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
            <h1 className={`text-2xl sm:text-3xl font-extrabold tracking-tight font-['Plus_Jakarta_Sans',sans-serif] ${
              paperTheme === 'midnight' ? 'text-white' : 'text-zinc-900'
            }`}>
              Mahim Chithi
            </h1>
            <p className="text-sm font-semibold text-amber-700 font-['Hind_Siliguri',sans-serif] mt-0.5">
              মাহিমকে বেনামে চিঠি পাঠান
            </p>
          </div>

          {/* Privacy Guarantee Pill */}
          <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border shadow-xs ${
            paperTheme === 'midnight'
              ? 'bg-slate-800 text-amber-300 border-amber-500/30'
              : 'bg-amber-100/80 text-amber-900 border-amber-300/60'
          }`}>
            <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
            <span>১০০% বেনামী — আপনার নাম বা পরিচয় কখনোই দেখা যাবে না</span>
          </div>
        </div>

        {/* Letter Desk Card */}
        <div className="w-full">
          {!isSent ? (
            /* Writing Desk State */
            <div className={`relative rounded-3xl border-2 p-5 sm:p-7 transition-all duration-300 overflow-hidden ${paperClasses[paperTheme]}`}>
              
              {/* REALISTIC PINNED TOKEN / FLOWER CLIPPED TO PAPER (Tilted on lower corner) */}
              {activeToken && (
                <div 
                  className="absolute bottom-22 right-4 sm:bottom-26 sm:right-6 z-20 pointer-events-auto transform rotate-[-9deg] hover:rotate-[-4deg] transition-transform duration-300 group select-none animate-scaleUp cursor-pointer"
                  onClick={() => setShowTokenPicker(true)}
                  title={`${activeToken.shortName} (কাগজের সাথে ক্লিপ দিয়ে আটকানো - পরিবর্তন করতে ট্যাপ করুন)`}
                >
                  <div className="relative">
                    {/* Realistic Golden Paper Clip Clamped Over the Edge */}
                    <div className="absolute -top-4.5 left-2.5 z-30 pointer-events-none drop-shadow-md">
                      <GoldenPaperClipSvg className="w-5 h-10 sm:w-6 sm:h-12" />
                    </div>

                    {/* Pressed Flower / Feather / Keepsake Item with organic drop shadow */}
                    <div className="p-2 sm:p-2.5 rounded-2xl bg-white/85 dark:bg-stone-900/85 backdrop-blur-xs border border-amber-300/80 dark:border-amber-700/60 shadow-[2px_6px_16px_rgba(69,26,3,0.22)] flex items-center gap-2">
                      <div className="shrink-0 flex items-center justify-center transform group-hover:scale-105 transition-transform">
                        {renderTokenItemVisual(activeToken, "w-8 h-8 sm:w-9 sm:h-9")}
                      </div>
                      <div className="pr-1 text-left hidden sm:block">
                        <span className="text-xs font-bold text-amber-900 dark:text-amber-200 block leading-tight">
                          {activeToken.shortName}
                        </span>
                      </div>

                      {/* Small Cross Button to Unpin */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedTokenId(null);
                        }}
                        className="p-1 rounded-full text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/60 transition cursor-pointer"
                        title="স্মারক খুলে ফেলুন"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Vintage Postage Stamp Display (Top Right) */}
              <div className="absolute top-4 right-4 sm:top-5 sm:right-5 z-10">
                <button
                  type="button"
                  onClick={() => setShowStampPicker(true)}
                  className="group relative cursor-pointer block transform hover:scale-105 active:scale-95 transition-transform"
                  title="ডাকটিকিট পরিবর্তন করতে ট্যাপ করুন"
                >
                  {/* Vintage Scalloped Postage Stamp */}
                  <div
                    className={`w-14 h-18 sm:w-16 sm:h-20 border-2 border-dashed rounded-md flex flex-col items-center justify-between p-1.5 text-center shadow-md bg-gradient-to-b ${currentStamp.bgGradient} rotate-3 transition-transform`}
                    style={{ borderColor: currentStamp.borderColor }}
                  >
                    <span className="text-[7.5px] font-bold uppercase tracking-wider" style={{ color: currentStamp.color }}>
                      {currentStamp.sub}
                    </span>
                    
                    {/* Visual Icon with Bespoke Lotus, Runner & Peacock Feather SVGs */}
                    <div className="my-auto drop-shadow-xs flex items-center justify-center">
                      {renderStampVisualIcon(currentStamp, "w-6 h-6 sm:w-7 sm:h-7")}
                    </div>

                    <div className="flex items-center justify-between w-full px-0.5">
                      <span className="text-[7.5px] font-mono font-bold" style={{ color: currentStamp.color }}>
                        {currentStamp.value}
                      </span>
                      <span className="text-[7px] text-zinc-500">ডাক</span>
                    </div>
                  </div>

                  {/* Postal Cancellation Ink Seal Mark overlay */}
                  <div className="absolute -bottom-2 -left-2.5 pointer-events-none opacity-75 transform -rotate-12">
                    <div className="w-8 h-8 rounded-full border border-zinc-600/70 flex flex-col items-center justify-center p-0.5 text-[5px] text-zinc-700 font-mono font-bold leading-none bg-transparent">
                      <span>POSTED</span>
                      <span className="text-[5.5px]">2026</span>
                      <span>GPO</span>
                    </div>
                  </div>

                  {/* Stamp Edit Tooltip Chip */}
                  <span className="absolute -bottom-5 right-0 text-[9px] font-bold text-amber-900 bg-amber-100/95 border border-amber-300/70 px-1.5 py-0.5 rounded-full whitespace-nowrap shadow-xs opacity-0 group-hover:opacity-100 transition-opacity">
                    ডাকটিকিট পরিবর্তন 👆
                  </span>
                </button>
              </div>

              {/* Controls Bar: Ink Color & Paper Style */}
              <div className="flex flex-wrap items-center justify-between gap-2.5 pb-3.5 border-b border-amber-900/10 pr-16 sm:pr-20">
                {/* Ink Color Picker */}
                <div className="flex items-center space-x-1.5">
                  <span className={`text-xs flex items-center gap-1 font-medium ${paperTheme === 'midnight' ? 'text-slate-400' : 'text-zinc-500'}`}>
                    <PenTool className="w-3.5 h-3.5 text-amber-600" />
                    কালি:
                  </span>
                  <button
                    type="button"
                    onClick={() => { setInkColor('blue'); playPenWritingSound(); }}
                    className={`w-5 h-5 sm:w-5.5 sm:h-5.5 rounded-full bg-blue-700 transition cursor-pointer ${
                      inkColor === 'blue' ? 'ring-2 ring-offset-2 ring-blue-700 scale-110' : 'opacity-70 hover:opacity-100'
                    }`}
                    title="নীল কালি"
                  />
                  <button
                    type="button"
                    onClick={() => { setInkColor('black'); playPenWritingSound(); }}
                    className={`w-5 h-5 sm:w-5.5 sm:h-5.5 rounded-full bg-zinc-900 transition cursor-pointer ${
                      inkColor === 'black' ? 'ring-2 ring-offset-2 ring-zinc-900 scale-110' : 'opacity-70 hover:opacity-100'
                    }`}
                    title="কালো কালি"
                  />
                  <button
                    type="button"
                    onClick={() => { setInkColor('maroon'); playPenWritingSound(); }}
                    className={`w-5 h-5 sm:w-5.5 sm:h-5.5 rounded-full bg-rose-900 transition cursor-pointer ${
                      inkColor === 'maroon' ? 'ring-2 ring-offset-2 ring-rose-900 scale-110' : 'opacity-70 hover:opacity-100'
                    }`}
                    title="মেরুন কালি"
                  />
                  <button
                    type="button"
                    onClick={() => { setInkColor('emerald'); playPenWritingSound(); }}
                    className={`w-5 h-5 sm:w-5.5 sm:h-5.5 rounded-full bg-emerald-800 transition cursor-pointer ${
                      inkColor === 'emerald' ? 'ring-2 ring-offset-2 ring-emerald-800 scale-110' : 'opacity-70 hover:opacity-100'
                    }`}
                    title="সবুজ কালি"
                  />
                </div>

                {/* Paper Theme / Style Switcher */}
                <div className="flex items-center space-x-1 text-xs">
                  <span className={`text-[11px] mr-0.5 ${paperTheme === 'midnight' ? 'text-slate-400' : 'text-zinc-500'}`}>
                    কাগজ:
                  </span>
                  <button
                    type="button"
                    onClick={() => { setPaperTheme('vintage'); playPenWritingSound(); }}
                    className={`px-2 py-0.5 rounded-lg transition cursor-pointer text-xs font-semibold ${
                      paperTheme === 'vintage'
                        ? 'bg-amber-800 text-white font-bold shadow-xs'
                        : paperTheme === 'midnight' ? 'text-slate-300 hover:text-white' : 'text-zinc-600 hover:text-zinc-950'
                    }`}
                  >
                    ভিন্টেজ
                  </button>
                  <button
                    type="button"
                    onClick={() => { setPaperTheme('notebook'); playPenWritingSound(); }}
                    className={`px-2 py-0.5 rounded-lg transition cursor-pointer text-xs font-semibold ${
                      paperTheme === 'notebook'
                        ? 'bg-amber-800 text-white font-bold shadow-xs'
                        : paperTheme === 'midnight' ? 'text-slate-300 hover:text-white' : 'text-zinc-600 hover:text-zinc-950'
                    }`}
                  >
                    খাতা
                  </button>
                  <button
                    type="button"
                    onClick={() => { setPaperTheme('kraft'); playPenWritingSound(); }}
                    className={`px-2 py-0.5 rounded-lg transition cursor-pointer text-xs font-semibold ${
                      paperTheme === 'kraft'
                        ? 'bg-amber-800 text-white font-bold shadow-xs'
                        : paperTheme === 'midnight' ? 'text-slate-300 hover:text-white' : 'text-zinc-600 hover:text-zinc-950'
                    }`}
                  >
                    ডায়েরি
                  </button>
                  <button
                    type="button"
                    onClick={() => { setPaperTheme('blush'); playPenWritingSound(); }}
                    className={`px-2 py-0.5 rounded-lg transition cursor-pointer text-xs font-semibold ${
                      paperTheme === 'blush'
                        ? 'bg-amber-800 text-white font-bold shadow-xs'
                        : paperTheme === 'midnight' ? 'text-slate-300 hover:text-white' : 'text-zinc-600 hover:text-zinc-950'
                    }`}
                  >
                    গোলাপি
                  </button>
                  <button
                    type="button"
                    onClick={() => { setPaperTheme('midnight'); playPenWritingSound(); }}
                    className={`px-2 py-0.5 rounded-lg transition cursor-pointer text-xs font-semibold ${
                      paperTheme === 'midnight'
                        ? 'bg-amber-600 text-white font-bold shadow-xs'
                        : 'text-zinc-600 hover:text-zinc-950'
                    }`}
                  >
                    রাত্রিশেষ
                  </button>
                </div>
              </div>

              {/* Sub-bar: Clean Inspiration Chips */}
              <div className="py-2 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                <span className={`text-xs shrink-0 ${paperTheme === 'midnight' ? 'text-slate-400' : 'text-zinc-400'}`}>আইডিয়া:</span>
                {inspirationPrompts.map((prompt, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleApplyPrompt(prompt)}
                    className={`text-xs px-2.5 py-0.5 rounded-full border transition whitespace-nowrap cursor-pointer shrink-0 ${
                      paperTheme === 'midnight'
                        ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
                        : 'bg-amber-100/70 hover:bg-amber-200/80 text-amber-900 border-amber-300/40'
                    }`}
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
                  onChange={(e) => handleContentChange(e.target.value)}
                  onKeyDown={handleKeyDown}
                  onBlur={handleBlur}
                  placeholder="প্রিয় মাহিম,&#10;এখানে আপনার না বলা কথা, সিক্রেট অনুভূতি, প্রশংসা বা মনের যে কোনো কথা লিখুন..."
                  rows={6}
                  maxLength={1000}
                  className={`w-full bg-transparent border-0 resize-none focus:outline-none focus:ring-0 text-xl sm:text-2xl leading-relaxed font-['Galada','Kalam','Hind_Siliguri',cursive] placeholder-zinc-400 ${inkClasses[inkColor]}`}
                  style={paperLineStyles[paperTheme]}
                />

                <div className={`flex items-center justify-between text-xs pt-2.5 border-t ${
                  paperTheme === 'midnight' ? 'border-slate-800/80 text-slate-400' : 'border-amber-900/10 text-zinc-500'
                }`}>
                  {/* Left: Clean, short Gift / Keepsake Attachment Action with dropdown indicator */}
                  <div>
                    {!selectedTokenId ? (
                      <button
                        type="button"
                        onClick={() => setShowTokenPicker(true)}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold text-amber-900 dark:text-amber-200 bg-amber-100/80 hover:bg-amber-200/90 border border-amber-300/80 dark:border-amber-700/50 transition cursor-pointer group shadow-2xs"
                        title="চিঠির সাথে উপহার বা শুকনো ফুল গুঁজে দিন"
                      >
                        <Paperclip className="w-3.5 h-3.5 text-amber-700 group-hover:rotate-12 transition-transform" />
                        <span>উপহার</span>
                        <ChevronDown className="w-3.5 h-3.5 text-amber-700 transition-transform group-hover:translate-y-0.5" />
                      </button>
                    ) : (
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold text-amber-900 dark:text-amber-200 bg-amber-200/90 border border-amber-400/80 shadow-2xs">
                        <Paperclip className="w-3.5 h-3.5 text-amber-800" />
                        <span>{activeToken?.shortName}</span>
                        <button
                          type="button"
                          onClick={() => setShowTokenPicker(true)}
                          className="p-0.5 text-amber-800 hover:text-amber-950 cursor-pointer"
                          title="উপহার পরিবর্তন করুন"
                        >
                          <ChevronDown className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setSelectedTokenId(null)}
                          className="p-0.5 text-zinc-500 hover:text-red-600 transition cursor-pointer ml-0.5"
                          title="স্মারক খুলে ফেলুন"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Right: Character count */}
                  <span className="text-[11px] font-mono text-zinc-400 dark:text-slate-400">
                    {content.length} / ১০০০ অক্ষর
                  </span>
                </div>
              </div>

              {/* Error Notice */}
              {errorMessage && (
                <p className="mt-3 text-xs text-red-600 font-bold text-center">
                  {errorMessage}
                </p>
              )}

              {/* Send Button */}
              <div className="mt-4">
                <button
                  type="button"
                  onClick={handleSend}
                  disabled={isSending}
                  className="w-full py-4 px-6 bg-gradient-to-r from-amber-700 via-amber-600 to-amber-700 hover:from-amber-600 hover:to-amber-500 text-white font-bold text-base rounded-2xl shadow-lg shadow-amber-800/25 transition-all transform active:scale-[0.99] flex items-center justify-center gap-2 disabled:opacity-75 cursor-pointer"
                >
                  {isSending ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>চিঠি পাঠানো হচ্ছে...</span>
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
            /* Success Sent State - Shows Mini Envelope Receipt Automatically */
            <div className="bg-[#fdfaf2] border-2 border-[#decbb0] rounded-3xl p-5 sm:p-7 text-center shadow-xl space-y-4 animate-scaleUp">
              <div className="w-13 h-13 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center border-3 border-emerald-200/60 shadow-inner">
                <CheckCircle2 className="w-7 h-7" />
              </div>

              <div className="space-y-0.5">
                <h3 className="text-xl sm:text-2xl font-bold text-zinc-900 font-['Hind_Siliguri',sans-serif]">
                  চিঠিটি সফলভাবে পৌঁছে গেছে! 🕊️
                </h3>
                <p className="text-xs text-zinc-600 max-w-sm mx-auto leading-relaxed">
                  আপনার চিঠিটি অত্যন্ত যত্নে মাহিমের গোপন ডাকবাক্সে জমা হয়েছে।
                </p>
              </div>

              {/* AUTOMATIC MINI ENVELOPE RECEIPT DISPLAY (No tracking code, horizontal letter envelope) */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-amber-900">
                  <span>✉️</span>
                  <span>আপনার প্রেরিত চিঠির স্মারক খাম (Envelope Keepsake):</span>
                </div>

                {receiptDataUrl ? (
                  <div className="relative rounded-2xl overflow-hidden border border-amber-300/80 shadow-md max-w-xs sm:max-w-sm mx-auto transform hover:scale-[1.01] transition-transform animate-fadeIn">
                    <img 
                      src={receiptDataUrl} 
                      alt="Mahim Chithi Postal Envelope" 
                      className="w-full h-auto object-cover"
                    />
                  </div>
                ) : isGeneratingReceipt ? (
                  <div className="py-8 bg-amber-50/60 rounded-2xl border border-amber-200 text-center text-xs text-amber-800 flex items-center justify-center gap-2 max-w-xs sm:max-w-sm mx-auto">
                    <Loader2 className="w-4 h-4 animate-spin text-amber-600" />
                    <span>স্মারক খাম প্রস্তুত করা হচ্ছে...</span>
                  </div>
                ) : null}

                {/* Envelope Download and Share Actions */}
                <div className="flex items-center gap-2 max-w-xs sm:max-w-sm mx-auto pt-0.5">
                  <button
                    type="button"
                    onClick={handleDownloadReceipt}
                    disabled={!receiptDataUrl}
                    className="flex-1 py-2.5 px-3 bg-amber-700 hover:bg-amber-600 disabled:opacity-60 text-white font-bold text-xs rounded-xl shadow-sm transition flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>খাম ডাউনলোড (HD)</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleShareReceipt}
                    disabled={!receiptDataUrl}
                    className="py-2.5 px-3.5 bg-white hover:bg-amber-50 border border-amber-300 text-amber-900 font-bold text-xs rounded-xl transition flex items-center justify-center gap-1 cursor-pointer shadow-2xs"
                    title="বন্ধুদের সাথে শেয়ার করুন"
                  >
                    <Share2 className="w-3.5 h-3.5 text-amber-700" />
                    <span>{receiptShared ? 'কপি হয়েছে!' : 'শেয়ার'}</span>
                  </button>
                </div>
              </div>

              {/* Social Share / Copy Link Box */}
              <div className="p-3 bg-white border border-amber-200/80 rounded-2xl space-y-1.5 max-w-sm mx-auto">
                <p className="text-[11px] font-semibold text-amber-900">
                  বন্ধুদেরও বেনামে চিঠি পাঠাতে লিংকটি শেয়ার করতে পারেন:
                </p>
                <div className="flex items-center gap-1.5">
                  <input
                    type="text"
                    readOnly
                    value="https://mahims.com/chithi"
                    className="flex-1 px-2.5 py-1.5 bg-zinc-50 border border-amber-200 rounded-lg text-[11px] font-mono text-zinc-700 select-all"
                  />
                  <button
                    type="button"
                    onClick={handleCopyLink}
                    className="px-3 py-1.5 bg-amber-700 hover:bg-amber-600 text-white text-[11px] font-bold rounded-lg transition flex items-center gap-1 shrink-0 cursor-pointer"
                  >
                    {copiedLink ? <CheckCircle2 className="w-3 h-3 text-emerald-300" /> : <Copy className="w-3 h-3" />}
                    {copiedLink ? 'কপি হয়েছে!' : 'কপি লিংক'}
                  </button>
                </div>
              </div>

              <div className="pt-0.5">
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-5 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold rounded-xl transition inline-flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  আরেকটি চিঠি লিখুন
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Postage Stamp Picker Modal */}
      {showStampPicker && (
        <div
          className="fixed inset-0 z-[100002] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setShowStampPicker(false)}
        >
          <div
            className="relative max-w-md w-full bg-[#fdfaf2] border-2 border-[#decbb0] rounded-3xl p-5 sm:p-6 shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-amber-900/10 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-xl">📮</span>
                <h4 className="text-base font-bold text-zinc-900 font-['Hind_Siliguri',sans-serif]">
                  খামের ডাকটিকিট পছন্দ করুন
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setShowStampPicker(false)}
                className="p-1 rounded-lg text-zinc-400 hover:text-zinc-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-zinc-600">
              চিঠির খামের ওপর লাগানোর জন্য আপনার পছন্দের ডাকটিকিটটি বেছে নিন:
            </p>

            <div className="grid grid-cols-1 gap-2.5 max-h-72 overflow-y-auto pr-1">
              {VINTAGE_STAMPS.map((stamp) => (
                <div
                  key={stamp.id}
                  onClick={() => {
                    setSelectedStampId(stamp.id);
                    setShowStampPicker(false);
                    playPenWritingSound();
                  }}
                  className={`p-3 rounded-2xl border-2 flex items-center gap-3 transition-all cursor-pointer ${
                    selectedStampId === stamp.id
                      ? 'bg-amber-100/90 border-amber-600 shadow-xs'
                      : 'bg-white hover:bg-amber-50/60 border-zinc-200'
                  }`}
                >
                  <div
                    className={`w-12 h-14 border-2 border-dashed rounded flex flex-col items-center justify-between p-1 bg-gradient-to-b ${stamp.bgGradient} shrink-0`}
                    style={{ borderColor: stamp.borderColor }}
                  >
                    <span className="text-[6px] font-bold" style={{ color: stamp.color }}>{stamp.sub}</span>
                    <div className="my-auto flex items-center justify-center">
                      {renderStampVisualIcon(stamp, "w-6 h-6")}
                    </div>
                    <span className="text-[6px] font-mono font-bold" style={{ color: stamp.color }}>{stamp.value}</span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h5 className="text-sm font-bold text-zinc-900 truncate">{stamp.name}</h5>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-200/60 text-amber-900">
                        {stamp.value}
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-500 truncate mt-0.5">{stamp.lore}</p>
                  </div>

                  {selectedStampId === stamp.id && (
                    <Check className="w-5 h-5 text-amber-600 shrink-0" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Keepsake Gift Picker Modal */}
      {showTokenPicker && (
        <div
          className="fixed inset-0 z-[100002] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setShowTokenPicker(false)}
        >
          <div
            className="relative max-w-md w-full bg-[#fdfaf2] border-2 border-[#decbb0] rounded-3xl p-5 sm:p-6 shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-amber-900/10 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-xl">🎁</span>
                <h4 className="text-base font-bold text-zinc-900 font-['Hind_Siliguri',sans-serif]">
                  চিঠির সাথে স্মারক উপহার গুঁজে দিন
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setShowTokenPicker(false)}
                className="p-1 rounded-lg text-zinc-400 hover:text-zinc-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-zinc-600 leading-relaxed">
              চিঠির কাগজের সাথে একটি শুকনো ফুল বা স্মৃতি পিন দিয়ে আটকে মাহিমের কাছে পৌঁছে দেওয়া হবে (ঐচ্ছিক):
            </p>

            {/* List of keepsakes */}
            <div className="grid grid-cols-1 gap-2.5 max-h-72 overflow-y-auto pr-1">
              {CHITHI_TOKENS.map((token) => {
                const isSelected = selectedTokenId === token.id;
                return (
                  <div
                    key={token.id}
                    onClick={() => {
                      setSelectedTokenId(token.id);
                      setShowTokenPicker(false);
                      playPenWritingSound();
                    }}
                    className={`p-3 rounded-2xl border-2 flex items-center gap-3 transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-amber-100/90 border-amber-600 shadow-xs'
                        : 'bg-white hover:bg-amber-50/60 border-zinc-200'
                    }`}
                  >
                    <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200/80 flex items-center justify-center shrink-0 shadow-2xs">
                      {renderTokenItemVisual(token, "w-8 h-8")}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h5 className="text-sm font-bold text-zinc-900 truncate">{token.name}</h5>
                        {isSelected && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-600 text-white">
                            পিন করা আছে
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-zinc-500 truncate mt-0.5">{token.meaning}</p>
                    </div>

                    {isSelected && (
                      <Check className="w-5 h-5 text-amber-600 shrink-0" />
                    )}
                  </div>
                );
              })}
            </div>

            {/* Remove / Cancel button if already selected */}
            {selectedTokenId && (
              <div className="pt-1 text-center">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedTokenId(null);
                    setShowTokenPicker(false);
                  }}
                  className="text-xs text-red-600 hover:text-red-700 font-semibold cursor-pointer underline"
                >
                  কোনো উপহার লাগবে না (মুছে দিন)
                </button>
              </div>
            )}
          </div>
        </div>
      )}

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
          <span>মনের না বলা কথা</span>
        </p>
      </footer>

      {/* Admin Panel Modal (Opens via Secret Dot or Ctrl+Alt+Shift+C) */}
      <ChithiAdminModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
      />
    </div>
  );
}

export default ChithiPage;
