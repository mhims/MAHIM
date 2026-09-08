import React, { useState, useEffect } from 'react';
import { 
  Lock, X, Mail, Star, Trash2, Eye, EyeOff, Download, RefreshCw, 
  MapPin, Smartphone, Calendar, CheckCircle2, Copy, FileSpreadsheet,
  Settings, ShieldAlert, Sparkles, Send, PenTool, ShieldCheck
} from 'lucide-react';
import { ChithiLetter, ChithiSettings } from '../types/chithi';
import { 
  getStoredLetters, deleteLetter, toggleLetterRead, toggleLetterStar,
  getChithiSettings, saveChithiSettings, CHITHI_ADMIN_PASSWORD,
  isChithiAdminAuthenticated, setChithiAdminAuthenticated,
  sendLetterToGoogleSheet
} from '../utils/chithiStorage';
import { generateStoryImage, downloadBase64Image } from '../utils/chithiStoryGenerator';

interface ChithiAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ChithiAdminModal({ isOpen, onClose }: ChithiAdminModalProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const [letters, setLetters] = useState<ChithiLetter[]>([]);
  const [selectedLetter, setSelectedLetter] = useState<ChithiLetter | null>(null);
  const [activeTab, setActiveTab] = useState<'inbox' | 'settings'>('inbox');
  const [filter, setFilter] = useState<'all' | 'unread' | 'starred'>('all');
  const [generatingStory, setGeneratingStory] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [settings, setSettings] = useState<ChithiSettings>({});
  const [syncStatus, setSyncStatus] = useState<string | null>(null);

  // In-modal reply generator state (purely transient - never saved, wiped upon close or reset)
  const [replyInput, setReplyInput] = useState('');
  const [showReplyEditor, setShowReplyEditor] = useState(false);
  const [replyImagePreview, setReplyImagePreview] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      const auth = isChithiAdminAuthenticated();
      setIsAuthenticated(auth);
      if (auth) {
        loadLetters();
        setSettings(getChithiSettings());
      }
    }
  }, [isOpen]);

  const loadLetters = () => {
    const list = getStoredLetters();
    setLetters(list);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === CHITHI_ADMIN_PASSWORD) {
      setChithiAdminAuthenticated(true);
      setIsAuthenticated(true);
      setPasswordError(false);
      setPasswordInput('');
      loadLetters();
      setSettings(getChithiSettings());
    } else {
      setPasswordError(true);
    }
  };

  const handleLogout = () => {
    setChithiAdminAuthenticated(false);
    setIsAuthenticated(false);
    setPasswordInput('');
    setSelectedLetter(null);
    onClose();
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('আপনি কি নিশ্চিতভাবে এই চিঠিটি মুছে ফেলতে চান?')) {
      deleteLetter(id);
      loadLetters();
      if (selectedLetter?.id === id) {
        setSelectedLetter(null);
      }
    }
  };

  const handleToggleRead = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    toggleLetterRead(id);
    loadLetters();
    if (selectedLetter?.id === id) {
      setSelectedLetter((prev) => (prev ? { ...prev, isRead: !prev.isRead } : null));
    }
  };

  const handleToggleStar = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    toggleLetterStar(id);
    loadLetters();
    if (selectedLetter?.id === id) {
      setSelectedLetter((prev) => (prev ? { ...prev, isStarred: !prev.isStarred } : null));
    }
  };

  const handleOpenLetter = (letter: ChithiLetter) => {
    setSelectedLetter(letter);
    setReplyInput('');
    setShowReplyEditor(false);
    setReplyImagePreview(null);
    if (!letter.isRead) {
      toggleLetterRead(letter.id);
      loadLetters();
    }
  };

  const handleDownloadStory = async (letter: ChithiLetter) => {
    try {
      setGeneratingStory(true);
      const dataUrl = await generateStoryImage(letter);
      downloadBase64Image(dataUrl, `mahim-chithi-${letter.id}.png`);
    } catch (err) {
      console.error('Failed to generate story image:', err);
      alert('স্টোরি ইমেজ তৈরিতে সমস্যা হয়েছে। আবার চেষ্টা করুন।');
    } finally {
      setGeneratingStory(false);
    }
  };

  const handleGenerateReplyStory = async (letter: ChithiLetter) => {
    if (!replyInput.trim()) {
      alert('অনুগ্রহ করে চিঠির একটি উত্তর লিখুন!');
      return;
    }
    try {
      setGeneratingStory(true);
      const dataUrl = await generateStoryImage(letter, replyInput.trim());
      setReplyImagePreview(dataUrl);
    } catch (err) {
      console.error('Failed to generate reply story image:', err);
      alert('উত্তর সহ ছবি তৈরিতে সমস্যা হয়েছে।');
    } finally {
      setGeneratingStory(false);
    }
  };

  const handleCloseReplyEditor = () => {
    // Clear immediately without saving anywhere
    setReplyInput('');
    setReplyImagePreview(null);
    setShowReplyEditor(false);
  };

  const handleCopyLetter = (content: string) => {
    navigator.clipboard.writeText(content);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    saveChithiSettings(settings);
    setSyncStatus('সেটিংস সফলভাবে সংরক্ষিত হয়েছে!');
    setTimeout(() => setSyncStatus(null), 3000);
  };

  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(letters, null, 2));
    const dl = document.createElement('a');
    dl.setAttribute('href', dataStr);
    dl.setAttribute('download', `mahim-chithi-backup-${new Date().toISOString().slice(0, 10)}.json`);
    dl.click();
  };

  const handleExportCSV = () => {
    const headers = ['ID', 'Date', 'Location', 'Device', 'Content', 'Status'];
    const rows = letters.map((l) => [
      l.id,
      new Date(l.timestamp || l.createdAt).toLocaleString('bn-BD'),
      `"${(l.senderLocation || '').replace(/"/g, '""')}"`,
      `"${(l.deviceInfo || '').replace(/"/g, '""')}"`,
      `"${(l.content || '').replace(/"/g, '""')}"`,
      l.isRead ? 'Read' : 'Unread',
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const dl = document.createElement('a');
    dl.setAttribute('href', encodeURI(csvContent));
    dl.setAttribute('download', `mahim-chithi-export-${new Date().toISOString().slice(0, 10)}.csv`);
    dl.click();
  };

  const handleSyncAllToGoogleSheet = async () => {
    if (!settings.googleSheetWebhookUrl) {
      alert('আগে Google Sheets Webhook URL কনফিগার করুন।');
      return;
    }
    setSyncStatus('গুগল শিটে সিঙ্ক হচ্ছে...');
    let successCount = 0;
    for (const letter of letters) {
      const ok = await sendLetterToGoogleSheet(settings.googleSheetWebhookUrl, letter);
      if (ok) successCount++;
    }
    setSyncStatus(`সফলভাবে ${successCount} টি চিঠি গুগল শিটে পাঠানো হয়েছে!`);
    setTimeout(() => setSyncStatus(null), 4000);
  };

  if (!isOpen) return null;

  const filteredLetters = letters.filter((l) => {
    if (filter === 'unread') return !l.isRead;
    if (filter === 'starred') return l.isStarred;
    return true;
  });

  const unreadCount = letters.filter((l) => !l.isRead).length;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 backdrop-blur-md p-3 sm:p-6 overflow-y-auto">
      <div 
        className="relative w-full max-w-4xl bg-[#18181b] border border-amber-900/40 rounded-2xl shadow-2xl overflow-hidden text-zinc-100 flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800 bg-gradient-to-r from-amber-950/40 via-zinc-900 to-zinc-900">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                চিঠির বাক্স (Chithi Admin)
                <span className="text-xs font-mono font-normal bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full border border-amber-500/30">
                  Secret
                </span>
              </h2>
              <p className="text-xs text-zinc-400">mahims.com/chithi এর গোপন ইনবক্স ও ম্যানেজমেন্ট</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {isAuthenticated && (
              <button
                onClick={handleLogout}
                className="px-3 py-1.5 text-xs text-zinc-400 hover:text-white bg-zinc-800 hover:bg-zinc-700 rounded-lg transition"
              >
                লক করুন
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        {!isAuthenticated ? (
          /* Password Prompt Screen */
          <div className="p-8 sm:p-12 flex flex-col items-center justify-center text-center max-w-md mx-auto">
            <div className="w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-4 shadow-lg shadow-amber-500/5">
              <Lock className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-white mb-1">গোপন পাসওয়ার্ড লিখুন</h3>
            <p className="text-sm text-zinc-400 mb-6">
              চিঠি পড়ার জন্য শুধুমাত্র মাহিম এর নির্ধারিত পাসওয়ার্ড দিয়ে আনলক করুন
            </p>

            <form onSubmit={handleLogin} className="w-full space-y-4">
              <div className="relative">
                <input
                  type="password"
                  placeholder="পাসওয়ার্ড লিখুন..."
                  value={passwordInput}
                  onChange={(e) => {
                    setPasswordInput(e.target.value);
                    setPasswordError(false);
                  }}
                  autoFocus
                  className={`w-full px-4 py-3 bg-zinc-900 border rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:ring-2 transition ${
                    passwordError 
                      ? 'border-red-500/80 focus:ring-red-500/40 animate-shake' 
                      : 'border-zinc-700 focus:border-amber-500 focus:ring-amber-500/30'
                  }`}
                />
              </div>

              {passwordError && (
                <p className="text-xs text-red-400 font-medium flex items-center justify-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5" />
                  ভুল পাসওয়ার্ড! সঠিক পাসওয়ার্ড দিয়ে চেষ্টা করুন।
                </p>
              )}

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-black font-bold rounded-xl transition shadow-lg shadow-amber-600/20 flex items-center justify-center gap-2"
              >
                ইনবক্স আনলক করুন
              </button>
            </form>
          </div>
        ) : (
          /* Authenticated Admin Inbox View */
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Nav tabs & summary stats */}
            <div className="px-5 py-3 bg-zinc-900/60 border-b border-zinc-800 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => { setActiveTab('inbox'); setSelectedLetter(null); }}
                  className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition flex items-center gap-1.5 ${
                    activeTab === 'inbox'
                      ? 'bg-amber-500 text-black shadow'
                      : 'text-zinc-400 hover:text-white bg-zinc-800/60'
                  }`}
                >
                  <Mail className="w-3.5 h-3.5" />
                  চিঠিপত্র ({letters.length})
                  {unreadCount > 0 && (
                    <span className="ml-1 px-1.5 py-0.2 bg-red-600 text-white text-[10px] rounded-full font-bold">
                      {unreadCount}
                    </span>
                  )}
                </button>
                <button
                  onClick={() => { setActiveTab('settings'); setSelectedLetter(null); }}
                  className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition flex items-center gap-1.5 ${
                    activeTab === 'settings'
                      ? 'bg-amber-500 text-black shadow'
                      : 'text-zinc-400 hover:text-white bg-zinc-800/60'
                  }`}
                >
                  <Settings className="w-3.5 h-3.5" />
                  সেটিংস ও ব্যাকআপ
                </button>
              </div>

              {activeTab === 'inbox' && (
                <div className="flex items-center space-x-1.5 text-xs">
                  <button
                    onClick={() => setFilter('all')}
                    className={`px-2.5 py-1 rounded-md transition ${filter === 'all' ? 'bg-zinc-700 text-white' : 'text-zinc-400 hover:text-zinc-200'}`}
                  >
                    সব
                  </button>
                  <button
                    onClick={() => setFilter('unread')}
                    className={`px-2.5 py-1 rounded-md transition ${filter === 'unread' ? 'bg-zinc-700 text-white' : 'text-zinc-400 hover:text-zinc-200'}`}
                  >
                    অপঠিত ({unreadCount})
                  </button>
                  <button
                    onClick={() => setFilter('starred')}
                    className={`px-2.5 py-1 rounded-md transition ${filter === 'starred' ? 'bg-zinc-700 text-white' : 'text-zinc-400 hover:text-zinc-200'}`}
                  >
                    স্টার
                  </button>
                </div>
              )}
            </div>

            {/* View Details Area */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6">
              {activeTab === 'settings' ? (
                /* Settings & Backup View */
                <div className="max-w-2xl mx-auto space-y-6">
                  <div className="p-5 bg-zinc-900 border border-zinc-800 rounded-xl space-y-4">
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <FileSpreadsheet className="w-5 h-5 text-emerald-400" />
                      Google Sheets ব্যাকআপ সিঙ্ক
                    </h3>
                    <p className="text-xs text-zinc-400 leading-relaxed">
                      চিঠিগুলো স্বয়ংক্রিয়ভাবে আপনার গুগল শিটে রাখতে চাইলে আপনার Google Apps Script Webhook URL এখানে সংরক্ষণ করতে পারেন।
                    </p>

                    <form onSubmit={handleSaveSettings} className="space-y-3">
                      <div>
                        <label className="block text-xs font-semibold text-zinc-300 mb-1">
                          Google Apps Script Webhook URL
                        </label>
                        <input
                          type="url"
                          placeholder="https://script.google.com/macros/s/.../exec"
                          value={settings.googleSheetWebhookUrl || ''}
                          onChange={(e) => setSettings({ ...settings, googleSheetWebhookUrl: e.target.value })}
                          className="w-full px-3 py-2 bg-zinc-950 border border-zinc-700 rounded-lg text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500"
                        />
                      </div>

                      <div className="flex items-center gap-2 pt-1">
                        <button
                          type="submit"
                          className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold rounded-lg transition"
                        >
                          সেটিংস সংরক্ষণ করুন
                        </button>
                        <button
                          type="button"
                          onClick={handleSyncAllToGoogleSheet}
                          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg transition flex items-center gap-1.5"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                          সব চিঠি শিটে পাঠান
                        </button>
                      </div>

                      {syncStatus && (
                        <p className="text-xs text-emerald-400 font-medium pt-1">
                          {syncStatus}
                        </p>
                      )}
                    </form>
                  </div>

                  {/* Manual Data Backup / Export */}
                  <div className="p-5 bg-zinc-900 border border-zinc-800 rounded-xl space-y-3">
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <Download className="w-5 h-5 text-blue-400" />
                      ডাটা ডাউনলোড ও ব্যাকআপ
                    </h3>
                    <p className="text-xs text-zinc-400">
                      আপনার সমস্ত চিঠি অফলাইনে বা এক্সেলে সেভ করে রাখতে নিচের বাটন দিয়ে ডাউনলোড করতে পারেন:
                    </p>
                    <div className="flex flex-wrap gap-3 pt-2">
                      <button
                        onClick={handleExportCSV}
                        className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold rounded-lg transition flex items-center gap-1.5 border border-zinc-700"
                      >
                        <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                        CSV (Excel) ডাউনলোড
                      </button>
                      <button
                        onClick={handleExportJSON}
                        className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold rounded-lg transition flex items-center gap-1.5 border border-zinc-700"
                      >
                        <Download className="w-4 h-4 text-blue-400" />
                        JSON ব্যাকআপ ডাউনলোড
                      </button>
                    </div>
                  </div>
                </div>
              ) : selectedLetter ? (
                /* Selected Single Letter Detailed View */
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => setSelectedLetter(null)}
                      className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 transition"
                    >
                      ← চিঠিপত্রের তালিকায় ফিরুন
                    </button>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => {
                          setShowReplyEditor(!showReplyEditor);
                          if (!showReplyEditor) {
                            setReplyImagePreview(null);
                          }
                        }}
                        className="px-3.5 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-bold rounded-lg transition flex items-center gap-1.5 shadow-sm"
                      >
                        <PenTool className="w-3.5 h-3.5" />
                        {showReplyEditor ? 'উত্তর প্যানেল বন্ধ করুন' : 'উত্তর লিখে ছবি বানান'}
                      </button>
                      <button
                        onClick={() => handleDownloadStory(selectedLetter)}
                        disabled={generatingStory}
                        className="px-3.5 py-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black text-xs font-bold rounded-lg transition flex items-center gap-1.5 shadow-md disabled:opacity-50"
                      >
                        <Download className="w-3.5 h-3.5" />
                        {generatingStory ? 'ছবি তৈরি হচ্ছে...' : 'ব্ল্যাঙ্ক স্টোরি কার্ড'}
                      </button>
                      <button
                        onClick={() => handleCopyLetter(selectedLetter.content)}
                        className="p-1.5 text-zinc-400 hover:text-white bg-zinc-800 hover:bg-zinc-700 rounded-lg transition"
                        title="চিঠির লেখা কপি করুন"
                      >
                        {copySuccess ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={(e) => handleDelete(selectedLetter.id, e)}
                        className="p-1.5 text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 rounded-lg transition"
                        title="মুছে ফেলুন"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* 
                    REPLY WRITER & IMAGE GENERATOR CARD
                    Strict requirement:
                    "আর ওয়েবসাইটের মধ্যেই উত্তর লিখে ছবি বানানোর একটা অপশন রাখো। তবে সেই লেখা কোথাও সেভ হবে না। ছবি আকারে বানানোর পরপর আমি যখন কেটে দিবো ওখান থেকেই কেটে যাবে। ওটা শুধু ছবি বানানোর জন্য।"
                  */}
                  {showReplyEditor && (
                    <div className="p-5 bg-zinc-900 border-2 border-amber-500/40 rounded-2xl space-y-4 shadow-xl animate-in fade-in zoom-in-95 duration-200">
                      <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                        <div className="flex items-center gap-2">
                          <span className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400">
                            <Sparkles className="w-4 h-4" />
                          </span>
                          <div>
                            <h4 className="text-sm font-bold text-white">চিঠির উত্তর লিখে ছবি বানান</h4>
                            <p className="text-[11px] text-zinc-400">
                              🔒 এই লেখা কোথাও ডাটাবেসে সেভ হবে না। এটি শুধুই ছবি বানানোর জন্য, কেটে দিলে মুছে যাবে।
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={handleCloseReplyEditor}
                          className="p-1 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-md transition"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Reply Textarea */}
                      <div className="space-y-2">
                        <label className="block text-xs font-semibold text-zinc-300">
                          আপনার উত্তর (Mahim's Reply):
                        </label>
                        <textarea
                          rows={4}
                          value={replyInput}
                          onChange={(e) => setReplyInput(e.target.value)}
                          placeholder="এখানে চিঠির উত্তর লিখুন... যেমন: অনেক অনেক ভালোবাসা ও কৃতজ্ঞতা আপনার সুন্দর কথার জন্য!"
                          className="w-full p-3 bg-zinc-950 border border-zinc-700 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-amber-500 font-['Hind_Siliguri',sans-serif] leading-relaxed"
                          maxLength={350}
                        />
                        <div className="flex items-center justify-between text-[11px] text-zinc-500">
                          <span>ইনস্টাগ্রাম/ফেসবুক স্টোরি কার্ডে আপনার এই উত্তরটি যুক্ত হবে</span>
                          <span>{replyInput.length} / ৩৫০ অক্ষর</span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-wrap items-center gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => handleGenerateReplyStory(selectedLetter)}
                          disabled={generatingStory || !replyInput.trim()}
                          className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black text-xs font-bold rounded-xl transition flex items-center gap-2 shadow-md disabled:opacity-50 cursor-pointer"
                        >
                          {generatingStory ? (
                            <>
                              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                              <span>ছবি তৈরি হচ্ছে...</span>
                            </>
                          ) : (
                            <>
                              <Sparkles className="w-3.5 h-3.5" />
                              <span>উত্তর সহ ছবি তৈরি করুন (Generate Image)</span>
                            </>
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={handleCloseReplyEditor}
                          className="px-3.5 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-semibold rounded-xl transition"
                        >
                          বাতিল ও মুছে ফেলুন
                        </button>
                      </div>

                      {/* Image Preview & Download Area */}
                      {replyImagePreview && (
                        <div className="pt-4 border-t border-zinc-800 space-y-3 animate-in fade-in duration-150">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                              <CheckCircle2 className="w-4 h-4" />
                              ছবি তৈরি সম্পন্ন হয়েছে!
                            </span>
                            <button
                              type="button"
                              onClick={() => downloadBase64Image(replyImagePreview, `mahim-reply-story-${selectedLetter.id}.png`)}
                              className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg transition flex items-center gap-1.5 shadow-md"
                            >
                              <Download className="w-3.5 h-3.5" />
                              ছবি ডাউনলোড করুন (Download Story Image)
                            </button>
                          </div>

                          <div className="relative max-w-xs mx-auto rounded-xl overflow-hidden border-2 border-zinc-700 shadow-2xl bg-zinc-950 p-1">
                            <img
                              src={replyImagePreview}
                              alt="Generated Story Card"
                              className="w-full h-auto rounded-lg"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Letter Parchment Presentation */}
                  <div className="relative bg-[#fffdf9] text-zinc-900 rounded-2xl p-6 sm:p-10 shadow-2xl border-4 border-[#e6dcce] overflow-hidden">
                    {/* Airmail Border Accent */}
                    <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-red-500 via-blue-500 to-red-500" />

                    {/* Metadata Header */}
                    <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-[#e2d9c8]">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300/60">
                            <ShieldCheck className="w-3.5 h-3.5 text-amber-700" />
                            ১০০% বেনামী চিঠি
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-zinc-500 pt-1">
                          <span className="flex items-center gap-1">
                            <Smartphone className="w-3 h-3 text-zinc-400" />
                            {selectedLetter.deviceInfo || 'মোবাইল / কম্পিউটার'}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-zinc-400" />
                            {new Date(selectedLetter.timestamp || selectedLetter.createdAt).toLocaleString('bn-BD')}
                          </span>
                        </div>
                      </div>

                      {/* Vintage Postal Stamp Seal */}
                      <div className="w-16 h-20 border-2 border-dashed border-amber-800/60 bg-amber-50/80 rounded flex flex-col items-center justify-center p-1 text-center rotate-2 shadow-sm">
                        <span className="text-[9px] font-bold text-amber-900 uppercase">Dhaka GPO</span>
                        <span className="text-xl">🕊️</span>
                        <span className="text-[9px] font-mono font-bold text-amber-800">৳১.০০</span>
                      </div>
                    </div>

                    {/* Lined Handwriting Content Area */}
                    <div className="py-8 min-h-[220px]">
                      <p className="text-xl sm:text-2xl leading-relaxed font-['Galada','Kalam','Hind_Siliguri',cursive] text-[#1e3a8a] whitespace-pre-wrap">
                        {selectedLetter.content}
                      </p>
                    </div>

                    {/* Bottom watermark */}
                    <div className="pt-6 border-t border-[#e2d9c8] flex items-center justify-between text-xs text-zinc-500">
                      <span>Mahim Chithi</span>
                      <span className="font-mono">mahims.com/chithi</span>
                    </div>
                  </div>
                </div>
              ) : (
                /* Letters Grid / List */
                <div>
                  {filteredLetters.length === 0 ? (
                    <div className="text-center py-16 space-y-3">
                      <div className="w-12 h-12 rounded-full bg-zinc-800 text-zinc-500 mx-auto flex items-center justify-center">
                        <Mail className="w-6 h-6" />
                      </div>
                      <p className="text-sm text-zinc-400">চিঠির বাক্স বর্তমানে খালি রয়েছে</p>
                      <p className="text-xs text-zinc-500">
                        কেউ mahims.com/chithi থেকে চিঠি পাঠালে এখানে জমা হবে।
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {filteredLetters.map((letter) => (
                        <div
                          key={letter.id}
                          onClick={() => handleOpenLetter(letter)}
                          className={`relative p-4 rounded-xl border transition cursor-pointer flex flex-col justify-between group ${
                            !letter.isRead
                              ? 'bg-gradient-to-br from-amber-950/30 to-zinc-900 border-amber-500/50 shadow-md shadow-amber-950/20'
                              : 'bg-zinc-900/70 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900'
                          }`}
                        >
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className={`w-2 h-2 rounded-full ${!letter.isRead ? 'bg-amber-400 ring-4 ring-amber-400/20' : 'bg-transparent'}`} />
                                <span className="text-xs font-bold text-amber-300 flex items-center gap-1">
                                  <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                                  {!letter.isRead ? 'নতুন চিঠি' : 'বেনামী চিঠি'}
                                </span>
                              </div>
                              <div className="flex items-center space-x-1" onClick={(e) => e.stopPropagation()}>
                                <button
                                  onClick={(e) => handleToggleStar(letter.id, e)}
                                  className={`p-1 rounded transition ${letter.isStarred ? 'text-amber-400' : 'text-zinc-500 hover:text-zinc-300'}`}
                                >
                                  <Star className="w-3.5 h-3.5 fill-current" />
                                </button>
                                <button
                                  onClick={(e) => handleToggleRead(letter.id, e)}
                                  className="p-1 text-zinc-500 hover:text-zinc-300 rounded transition"
                                  title={letter.isRead ? 'অপঠিত হিসেবে মার্ক করুন' : 'পঠিত হিসেবে মার্ক করুন'}
                                >
                                  {letter.isRead ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                                </button>
                                <button
                                  onClick={(e) => handleDelete(letter.id, e)}
                                  className="p-1 text-zinc-500 hover:text-red-400 rounded transition"
                                  title="মুছে ফেলুন"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>

                            <p className="text-sm font-['Hind_Siliguri',sans-serif] text-zinc-200 line-clamp-3 leading-relaxed">
                              {letter.content}
                            </p>
                          </div>

                          <div className="pt-3 mt-3 border-t border-zinc-800/80 flex items-center justify-between text-[11px] text-zinc-500">
                            <span className="truncate max-w-[150px]">
                              {letter.deviceInfo || 'অজ্ঞাত ডিভাইস'}
                            </span>
                            <span>
                              {new Date(letter.timestamp || letter.createdAt).toLocaleDateString('bn-BD', {
                                day: 'numeric',
                                month: 'short',
                              })}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
