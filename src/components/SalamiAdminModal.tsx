import React, { useState, useEffect } from 'react';
import {
  Lock, X, Trash2, Download, RefreshCw, Smartphone, CheckCircle2,
  Copy, FileSpreadsheet, Settings, Key, Clock, Search, Gift, Heart,
  Sparkles, Check, AlertCircle, Eye, EyeOff
} from 'lucide-react';
import { SalamiRecord, SalamiSettings } from '../types/salami';
import {
  getStoredSalamiRecords, updateSalamiStatus, deleteSalamiRecord,
  clearAllSalamiRecords, getSalamiSettings, saveSalamiSettings,
  isSalamiAdminAuthenticated, setSalamiAdminAuthenticated,
  verifySalamiAdminPassword, changeSalamiAdminPassword,
  fetchSalamiFromGoogleSheet, exportSalamiToCSV,
  SALAMI_APPS_SCRIPT_TEMPLATE
} from '../utils/salamiStorage';
import { verifySubPanelPasswordWithMasterOverride } from '../utils/masterPasswordHelper';

interface SalamiAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SalamiAdminModal({ isOpen, onClose }: SalamiAdminModalProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [showPasswordText, setShowPasswordText] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const [records, setRecords] = useState<SalamiRecord[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'receive' | 'send' | 'settings'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [settings, setSettings] = useState<SalamiSettings>({});
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState<string | null>(null);
  const [copiedScript, setCopiedScript] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  // Password change state
  const [newPassword, setNewPassword] = useState('');
  const [pwChangeStatus, setPwChangeStatus] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      const auth = isSalamiAdminAuthenticated();
      setIsAuthenticated(auth);
      if (auth) {
        refreshRecords();
        setSettings(getSalamiSettings());
      }
    }
  }, [isOpen]);

  const refreshRecords = () => {
    setRecords(getStoredSalamiRecords());
  };

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordInput.trim()) return;
    setIsVerifying(true);
    setPasswordError(null);
    try {
      const result = await verifySubPanelPasswordWithMasterOverride(
        'salami_admin',
        passwordInput,
        verifySalamiAdminPassword
      );
      if (result.isSuccess) {
        setSalamiAdminAuthenticated(true);
        setIsAuthenticated(true);
        setPasswordError(null);
        setPasswordInput('');
        refreshRecords();
        setSettings(getSalamiSettings());
      } else {
        setPasswordError(result.message);
      }
    } catch {
      setPasswordError('ভুল পাসওয়ার্ড! আবার চেষ্টা করুন।');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleSyncFromSheet = async () => {
    setIsSyncing(true);
    setSyncMessage('গুগল শিট থেকে ডাটা সিঙ্ক হচ্ছে...');
    try {
      const res = await fetchSalamiFromGoogleSheet(settings.googleSheetWebhookUrl);
      setRecords(res.records);
      setSyncMessage(res.message);
      showToast(res.message);
    } catch (err) {
      const msg = 'সিঙ্ক ব্যর্থ হয়েছে: ' + String(err);
      setSyncMessage(msg);
      showToast(msg);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleStatusToggle = (id: string, currentStatus: 'pending' | 'paid') => {
    const next = currentStatus === 'pending' ? 'paid' : 'pending';
    updateSalamiStatus(id, next);
    refreshRecords();
    showToast(next === 'paid' ? 'সালামি পরিশোধিত হিসেবে মার্ক করা হয়েছে ✅' : 'স্ট্যাটাস পেন্ডিং করা হয়েছে');
  };

  const handleDelete = (id: string) => {
    if (window.confirm('আপনি কি এই রেকর্ডটি মুছে ফেলতে চান?')) {
      deleteSalamiRecord(id);
      refreshRecords();
      showToast('রেকর্ডটি মুছে ফেলা হয়েছে');
    }
  };

  const handleClearAll = () => {
    if (window.confirm('সতর্কতা: আপনি কি সমস্ত সালামি ডাটা লোকাল মেমোরি থেকে মুছে ফেলতে চান?')) {
      clearAllSalamiRecords();
      refreshRecords();
      showToast('সকল ডাটা মুছে ফেলা হয়েছে');
    }
  };

  const handleCopyPhone = (phone: string) => {
    navigator.clipboard.writeText(phone);
    showToast(`নম্বর কপি হয়েছে: ${phone}`);
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.trim().length < 6) {
      setPwChangeStatus('পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে!');
      return;
    }
    const ok = await changeSalamiAdminPassword(newPassword.trim());
    if (ok) {
      setPwChangeStatus('পাসওয়ার্ড সফলভাবে পরিবর্তন করা হয়েছে!');
      setNewPassword('');
    } else {
      setPwChangeStatus('পাসওয়ার্ড পরিবর্তন ব্যর্থ হয়েছে!');
    }
  };

  if (!isOpen) return null;

  // Filter records
  const filtered = records.filter(r => {
    if (activeTab === 'receive' && r.type !== 'নেওয়া') return false;
    if (activeTab === 'send' && r.type !== 'পাঠানো') return false;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      return (
        r.name.toLowerCase().includes(q) ||
        r.phone.toLowerCase().includes(q) ||
        r.amount.toLowerCase().includes(q) ||
        r.message.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const totalReceivedClaims = records.filter(r => r.type === 'নেওয়া').length;
  const totalSentGifts = records.filter(r => r.type === 'পাঠানো').length;
  const totalPaid = records.filter(r => r.status === 'paid').length;

  return (
    <div className="fixed inset-0 z-[100000] flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[100002] px-4 py-2 rounded-2xl bg-slate-900 border border-amber-500/40 text-amber-300 text-xs font-semibold shadow-2xl flex items-center gap-2 animate-bounce">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>{notification}</span>
        </div>
      )}

      <div className="relative w-full max-w-4xl max-h-[92vh] flex flex-col bg-slate-900 border border-amber-500/30 rounded-3xl shadow-2xl overflow-hidden text-slate-100">
        {/* Top Header */}
        <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Gift className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-white">মাহিম সালামি এডমিন প্যানেল</h3>
                <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-mono font-bold">
                  ঈদ ২০২৬
                </span>
              </div>
              <p className="text-xs text-slate-400">সালামি গ্রহণ ও পাঠানোর সকল আবেদন ম্যানেজ করুন</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        {!isAuthenticated ? (
          /* Password Screen */
          <div className="p-6 sm:p-10 flex flex-col items-center justify-center text-center space-y-6 max-w-md mx-auto my-auto">
            <div className="w-16 h-16 rounded-3xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-inner">
              <Lock className="w-8 h-8" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-white">এডমিন পাসওয়ার্ড দিন</h4>
              <p className="text-xs text-slate-400 mt-1">
                সালামি ম্যানেজমেন্ট ড্যাশবোর্ডে প্রবেশ করতে আপনার সুরক্ষিত এডমিন পাসওয়ার্ড লিখুন।
              </p>
            </div>

            <form onSubmit={handleLogin} className="w-full space-y-3">
              <div className="relative">
                <input
                  type={showPasswordText ? 'text' : 'password'}
                  value={passwordInput}
                  onChange={e => setPasswordInput(e.target.value)}
                  placeholder="পাসওয়ার্ড লিখুন..."
                  className="w-full px-4 py-3 rounded-2xl bg-slate-950 border border-white/10 text-white text-sm focus:outline-none focus:border-amber-400 transition-colors pr-11 font-mono"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPasswordText(!showPasswordText)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1"
                >
                  {showPasswordText ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {passwordError && (
                <div className="p-2.5 rounded-xl bg-red-950/60 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                  <span>{passwordError}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isVerifying || !passwordInput.trim()}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/20 transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Key className="w-4 h-4" />
                <span>{isVerifying ? 'যাচাই হচ্ছে...' : 'লগইন করুন'}</span>
              </button>
            </form>
          </div>
        ) : (
          /* Authenticated Dashboard */
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Stats Bar */}
            <div className="p-3 sm:p-4 bg-slate-950/40 border-b border-white/5 grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div className="p-3 rounded-2xl bg-slate-800/40 border border-white/5 text-center">
                <p className="text-[11px] text-slate-400">মোট সালামি রেকর্ড</p>
                <p className="text-lg font-bold text-white font-mono mt-0.5">{records.length}</p>
              </div>
              <div className="p-3 rounded-2xl bg-slate-800/40 border border-white/5 text-center">
                <p className="text-[11px] text-slate-400">সালামি নিতে চেয়েছে</p>
                <p className="text-lg font-bold text-amber-400 font-mono mt-0.5">{totalReceivedClaims}</p>
              </div>
              <div className="p-3 rounded-2xl bg-slate-800/40 border border-white/5 text-center">
                <p className="text-[11px] text-slate-400">সালামি পাঠিয়েছে</p>
                <p className="text-lg font-bold text-emerald-400 font-mono mt-0.5">{totalSentGifts}</p>
              </div>
              <div className="p-3 rounded-2xl bg-slate-800/40 border border-white/5 text-center">
                <p className="text-[11px] text-slate-400">পরিশোধিত (Paid)</p>
                <p className="text-lg font-bold text-sky-400 font-mono mt-0.5">{totalPaid}</p>
              </div>
            </div>

            {/* Navigation Tabs & Actions */}
            <div className="p-3 sm:p-4 border-b border-white/5 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-900/90">
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                <button
                  onClick={() => setActiveTab('all')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                    activeTab === 'all'
                      ? 'bg-amber-500 text-slate-950 font-bold'
                      : 'bg-slate-800 text-slate-300 hover:text-white'
                  }`}
                >
                  সকল রেকর্ড ({records.length})
                </button>
                <button
                  onClick={() => setActiveTab('receive')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                    activeTab === 'receive'
                      ? 'bg-amber-500 text-slate-950 font-bold'
                      : 'bg-slate-800 text-slate-300 hover:text-white'
                  }`}
                >
                  সালামি নেওয়ার আবেদন ({totalReceivedClaims})
                </button>
                <button
                  onClick={() => setActiveTab('send')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                    activeTab === 'send'
                      ? 'bg-amber-500 text-slate-950 font-bold'
                      : 'bg-slate-800 text-slate-300 hover:text-white'
                  }`}
                >
                  সালামি পাঠিয়েছে ({totalSentGifts})
                </button>
                <button
                  onClick={() => setActiveTab('settings')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                    activeTab === 'settings'
                      ? 'bg-amber-500 text-slate-950 font-bold'
                      : 'bg-slate-800 text-slate-300 hover:text-white'
                  }`}
                >
                  <Settings className="w-3.5 h-3.5" />
                  <span>শিট ও সেটিংস</span>
                </button>
              </div>

              {activeTab !== 'settings' && (
                <div className="flex items-center gap-2">
                  <div className="relative flex-1 sm:w-48">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={e => setSearchTerm(e.target.value)}
                      placeholder="নাম/নম্বর খুঁজুন..."
                      className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-950 border border-white/10 text-white text-xs focus:outline-none focus:border-amber-400"
                    />
                  </div>
                  <button
                    onClick={handleSyncFromSheet}
                    disabled={isSyncing}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/20 text-xs transition-colors shrink-0 disabled:opacity-50"
                    title="গুগল শিট থেকে সিঙ্ক করুন"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                  </button>
                  <button
                    onClick={() => exportSalamiToCSV(records)}
                    disabled={records.length === 0}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs transition-colors shrink-0 disabled:opacity-50"
                    title="CSV এক্সপোর্ট"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>
                  {records.length > 0 && (
                    <button
                      onClick={handleClearAll}
                      className="p-2 rounded-xl bg-red-950/40 hover:bg-red-900/60 text-red-400 border border-red-800/40 text-xs transition-colors shrink-0"
                      title="লোকাল ডাটা মুছুন"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Sync banner */}
            {syncMessage && (
              <div className="px-4 py-2 bg-emerald-950/40 border-b border-emerald-500/20 text-xs text-emerald-300 flex items-center justify-between">
                <span>{syncMessage}</span>
                <button onClick={() => setSyncMessage(null)} className="text-emerald-400 hover:text-white">✕</button>
              </div>
            )}

            {/* Main Tab Area */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-5">
              {activeTab === 'settings' ? (
                /* Settings & Apps Script Configuration Tab */
                <div className="space-y-6 max-w-2xl mx-auto">
                  {/* Webhook URL setup */}
                  <div className="p-5 rounded-3xl bg-slate-950 border border-amber-500/20 space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                        <FileSpreadsheet className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white">গুগল শিট Webhook URL</h4>
                        <p className="text-xs text-slate-400">সালামির গুগল শিটের সাথে কানেক্টেড Apps Script Web App URL</p>
                      </div>
                    </div>

                    <input
                      type="url"
                      value={settings.googleSheetWebhookUrl || ''}
                      onChange={e => setSettings({ ...settings, googleSheetWebhookUrl: e.target.value })}
                      placeholder="https://script.google.com/macros/s/.../exec"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-amber-400"
                    />

                    <div className="flex items-center justify-between pt-1">
                      <button
                        onClick={handleSyncFromSheet}
                        disabled={isSyncing}
                        className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                        <span>{isSyncing ? 'সিঙ্ক হচ্ছে...' : 'এখনই শিট থেকে সিঙ্ক করুন'}</span>
                      </button>

                      <button
                        onClick={() => {
                          saveSalamiSettings(settings);
                          showToast('গুগল শিট সেটিংস সেভ হয়েছে!');
                        }}
                        className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs"
                      >
                        সংরক্ষণ করুন
                      </button>
                    </div>
                  </div>

                  {/* Complete Apps Script code box */}
                  <div className="p-5 rounded-3xl bg-slate-950 border border-white/10 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-bold text-white">Google Apps Script কোড</h4>
                        <p className="text-xs text-slate-400">আপনার সালামি গুগল শিটে এই কোডটি পেস্ট করে Deploy করলেই সব ডাটা অটোমেটিক আসবে।</p>
                      </div>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(SALAMI_APPS_SCRIPT_TEMPLATE);
                          setCopiedScript(true);
                          setTimeout(() => setCopiedScript(false), 2500);
                          showToast('কোড কপি হয়েছে!');
                        }}
                        className="px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 text-xs font-semibold flex items-center gap-1.5"
                      >
                        {copiedScript ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedScript ? 'কপি হয়েছে' : 'কোড কপি করুন'}</span>
                      </button>
                    </div>
                    <pre className="p-3 rounded-2xl bg-slate-900 border border-white/5 font-mono text-[11px] text-slate-300 overflow-x-auto max-h-48 scrollbar-thin">
                      {SALAMI_APPS_SCRIPT_TEMPLATE}
                    </pre>
                  </div>

                  {/* Change Password */}
                  <div className="p-5 rounded-3xl bg-slate-950 border border-white/10 space-y-3">
                    <h4 className="text-sm font-bold text-white">এডমিন পাসওয়ার্ড পরিবর্তন</h4>
                    <form onSubmit={handleChangePassword} className="space-y-3">
                      <input
                        type="password"
                        value={newPassword}
                        onChange={e => setNewPassword(e.target.value)}
                        placeholder="নতুন পাসওয়ার্ড দিন (কমপক্ষে ৬ অক্ষর)"
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-amber-400"
                      />
                      {pwChangeStatus && (
                        <p className="text-xs text-amber-400 font-medium">{pwChangeStatus}</p>
                      )}
                      <button
                        type="submit"
                        className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold"
                      >
                        পাসওয়ার্ড আপডেট করুন
                      </button>
                    </form>
                  </div>
                </div>
              ) : (
                /* Salami Records Table / Card List */
                <div className="space-y-3">
                  {filtered.length === 0 ? (
                    <div className="text-center py-16 space-y-2">
                      <Gift className="w-10 h-10 text-slate-600 mx-auto" />
                      <p className="text-sm text-slate-400">কোনো সালামি রেকর্ড পাওয়া যায়নি</p>
                      <p className="text-xs text-slate-500">কেউ ওয়েবসাইটে সালামি দিলে বা নিলে তা এখানে তাৎক্ষণিক প্রদর্শিত হবে।</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto rounded-2xl border border-white/5 bg-slate-950/60">
                      <table className="w-full text-left text-xs text-slate-300">
                        <thead className="bg-slate-900/80 text-[11px] uppercase tracking-wider text-slate-400 border-b border-white/10">
                          <tr>
                            <th className="py-3 px-4">তারিখ ও সময়</th>
                            <th className="py-3 px-4">ধরণ</th>
                            <th className="py-3 px-4">নাম</th>
                            <th className="py-3 px-4">বিকাশ / নগদ নম্বর</th>
                            <th className="py-3 px-4">সালামির পরিমাণ</th>
                            <th className="py-3 px-4">মেসেজ / চিরকুট</th>
                            <th className="py-3 px-4">স্ট্যাটাস</th>
                            <th className="py-3 px-4 text-right">অ্যাকশন</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 font-sans">
                          {filtered.map(item => (
                            <tr key={item.id} className="hover:bg-white/[0.02] transition-colors">
                              <td className="py-3 px-4 whitespace-nowrap text-slate-400 font-mono text-[11px]">
                                <div className="flex items-center gap-1.5">
                                  <Clock className="w-3 h-3 text-amber-400/80 shrink-0" />
                                  <span>{item.timestamp}</span>
                                </div>
                              </td>

                              <td className="py-3 px-4 whitespace-nowrap">
                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                  item.type === 'নেওয়া'
                                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                    : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                }`}>
                                  {item.type}
                                </span>
                              </td>

                              <td className="py-3 px-4 font-semibold text-white whitespace-nowrap">
                                {item.name}
                              </td>

                              <td className="py-3 px-4 whitespace-nowrap font-mono text-emerald-400">
                                {item.phone && item.phone !== 'N/A' ? (
                                  <div className="flex items-center gap-2">
                                    <span>{item.phone}</span>
                                    <button
                                      onClick={() => handleCopyPhone(item.phone)}
                                      className="p-1 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                                      title="নম্বর কপি করুন"
                                    >
                                      <Copy className="w-3 h-3" />
                                    </button>
                                  </div>
                                ) : (
                                  <span className="text-slate-500">প্রযোজ্য নয়</span>
                                )}
                              </td>

                              <td className="py-3 px-4 whitespace-nowrap font-bold text-amber-400 text-sm">
                                {item.amount}
                              </td>

                              <td className="py-3 px-4 max-w-xs truncate text-slate-300" title={item.message}>
                                {item.message && item.message !== 'N/A' ? item.message : <span className="text-slate-600">-</span>}
                              </td>

                              <td className="py-3 px-4 whitespace-nowrap">
                                <button
                                  onClick={() => handleStatusToggle(item.id, item.status)}
                                  className={`px-2.5 py-1 rounded-xl text-[10px] font-bold flex items-center gap-1 transition-all cursor-pointer ${
                                    item.status === 'paid'
                                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30'
                                      : 'bg-amber-500/10 text-amber-400 border border-amber-500/30 hover:bg-amber-500/20'
                                  }`}
                                  title="স্ট্যাটাস পরিবর্তন করতে চাপুন"
                                >
                                  {item.status === 'paid' ? (
                                    <>
                                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                                      <span>পরিশোধিত</span>
                                    </>
                                  ) : (
                                    <>
                                      <Clock className="w-3 h-3 text-amber-400" />
                                      <span>বাকি (Pending)</span>
                                    </>
                                  )}
                                </button>
                              </td>

                              <td className="py-3 px-4 whitespace-nowrap text-right">
                                <button
                                  onClick={() => handleDelete(item.id)}
                                  className="p-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/60 text-red-400 transition-colors"
                                  title="মুছে ফেলুন"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
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
