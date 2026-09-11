import React, { useState, useEffect } from 'react';
import {
  Lock,
  X,
  Users,
  Search,
  Download,
  Copy,
  RefreshCw,
  Phone,
  MessageSquare,
  CheckCircle2,
  Trash2,
  Sliders,
  FileSpreadsheet,
  Key,
  ShieldCheck,
  AlertCircle,
  Clock,
  BookOpen,
  GraduationCap,
  ExternalLink,
  PhoneCall,
  Send,
  Sparkles,
} from 'lucide-react';
import { ClassroomRegistration, ClassroomSettings } from '../types/classroom';
import {
  getStoredClassroomRegistrations,
  updateRegistrationStatus,
  deleteClassroomRegistration,
  clearAllClassroomRegistrations,
  getClassroomSettings,
  saveClassroomSettings,
  verifyClassroomAdminPassword,
  changeClassroomAdminPassword,
  isClassroomAdminAuthenticated,
  setClassroomAdminAuthenticated,
  exportRegistrationsToCSV,
  GOOGLE_APPS_SCRIPT_CLASSROOM,
  fetchRegistrationsFromGoogleSheet,
  getEffectiveClassroomWebhookUrl,
  sendRegistrationToGoogleSheet,
} from '../utils/classroomStorage';

interface ClassroomAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ClassroomAdminModal({ isOpen, onClose }: ClassroomAdminModalProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  // Tabs and filters
  const [activeTab, setActiveTab] = useState<'students' | 'settings'>('students');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [registrations, setRegistrations] = useState<ClassroomRegistration[]>([]);

  // Sync state
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatusMsg, setSyncStatusMsg] = useState<string | null>(null);
  const [isPushingAll, setIsPushingAll] = useState(false);
  const [showScriptCode, setShowScriptCode] = useState(false);

  // Settings state
  const [settings, setSettings] = useState<ClassroomSettings>({});
  const [newPassword, setNewPassword] = useState('');
  const [passwordChangeSuccess, setPasswordChangeSuccess] = useState(false);
  const [passwordChangeError, setPasswordChangeError] = useState('');
  const [copiedPhones, setCopiedPhones] = useState(false);
  const [copiedScript, setCopiedScript] = useState(false);
  const [showScriptModal, setShowScriptModal] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const auth = isClassroomAdminAuthenticated();
      setIsAuthenticated(auth);
      if (auth) {
        loadData(true);
      }
    }
  }, [isOpen]);

  const loadData = async (syncWithSheet = true) => {
    const local = getStoredClassroomRegistrations();
    setRegistrations(local);
    const currentSettings = getClassroomSettings();
    setSettings(currentSettings);

    const effectiveUrl = currentSettings.googleSheetWebhookUrl?.trim() || getEffectiveClassroomWebhookUrl();
    if (syncWithSheet && effectiveUrl) {
      setIsSyncing(true);
      try {
        const fetched = await fetchRegistrationsFromGoogleSheet(effectiveUrl);
        if (fetched) {
          setRegistrations(fetched);
        }
      } catch (err) {
        console.warn('Google Sheet sync warning:', err);
      } finally {
        setIsSyncing(false);
      }
    }
  };

  const handleManualSync = async () => {
    const effectiveUrl = settings.googleSheetWebhookUrl?.trim() || getEffectiveClassroomWebhookUrl();
    if (!effectiveUrl) {
      alert('প্রথমে সেটিংস ট্যাবে গিয়ে আপনার Google Apps Script Webhook URL দিন এবং সংরক্ষণ করুন।');
      setActiveTab('settings');
      return;
    }
    setIsSyncing(true);
    setSyncStatusMsg(null);
    try {
      const fetched = await fetchRegistrationsFromGoogleSheet(effectiveUrl);
      setRegistrations(fetched);
      setSyncStatusMsg(`✓ গুগল শিট থেকে সফলভাবে ${fetched.length} জন শিক্ষার্থীর তালিকা লোড হয়েছে!`);
      setTimeout(() => setSyncStatusMsg(null), 5000);
    } catch {
      setSyncStatusMsg('⚠️ গুগল শিট থেকে ডাটা আনা যায়নি। Apps Script এর Web app পারমিশন (Who has access: Anyone) চেক করুন।');
    } finally {
      setIsSyncing(false);
    }
  };

  const handlePushAllToSheet = async () => {
    const effectiveUrl = settings.googleSheetWebhookUrl?.trim() || getEffectiveClassroomWebhookUrl();
    if (!effectiveUrl) {
      alert('প্রথমে নিচে আপনার Google Apps Script Webhook URL দিন এবং সংরক্ষণ করুন।');
      return;
    }
    if (!registrations.length) {
      alert('কোনো শিক্ষার্থী তালিকা নেই।');
      return;
    }
    setIsPushingAll(true);
    let successCount = 0;
    for (const reg of registrations) {
      const ok = await sendRegistrationToGoogleSheet(reg, effectiveUrl);
      if (ok) successCount++;
    }
    setIsPushingAll(false);
    alert(`মোট ${successCount} টি এন্ট্রি গুগল শিটে ব্যাকআপ পাঠানো হয়েছে!`);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);
    setPasswordError(false);

    const isValid = await verifyClassroomAdminPassword(passwordInput);
    setIsVerifying(false);

    if (isValid) {
      setIsAuthenticated(true);
      setClassroomAdminAuthenticated(true);
      setPasswordInput('');
      loadData(true);
    } else {
      setPasswordError(true);
    }
  };

  const handleLogout = () => {
    setClassroomAdminAuthenticated(false);
    setIsAuthenticated(false);
    setPasswordInput('');
  };

  const handleStatusChange = (id: string, newStatus: ClassroomRegistration['status']) => {
    updateRegistrationStatus(id, newStatus);
    loadData(false);
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`আপনি কি "${name}" এর প্রি-রেজিস্ট্রেশন রেকর্ড মুছে ফেলতে চান?`)) {
      deleteClassroomRegistration(id);
      loadData(false);
    }
  };

  const handleClearAll = () => {
    if (window.confirm('সতর্কতা: আপনি কি নিশ্চিত যে সমস্ত শিক্ষার্থীর তালিকা মুছে ফেলতে চান? এই কাজটি ফিরিয়ে আনা যাবে না!')) {
      clearAllClassroomRegistrations();
      loadData(false);
    }
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    saveClassroomSettings(settings);
    alert('গুগল শিট ওয়েবহুক সেটিংস সফলভাবে সংরক্ষিত হয়েছে!');
    if (settings.googleSheetWebhookUrl?.trim()) {
      handleManualSync();
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordChangeSuccess(false);
    setPasswordChangeError('');

    if (newPassword.trim().length < 4) {
      setPasswordChangeError('পাসওয়ার্ড ন্যূনতম ৪ অক্ষরের হতে হবে।');
      return;
    }

    const success = await changeClassroomAdminPassword(newPassword.trim());
    if (success) {
      setPasswordChangeSuccess(true);
      setNewPassword('');
    } else {
      setPasswordChangeError('পাসওয়ার্ড পরিবর্তন ব্যর্থ হয়েছে।');
    }
  };

  const handleCopyAllPhoneNumbers = () => {
    const phones = filteredRegistrations
      .map((r) => r.phone.replace(/[^0-9+]/g, ''))
      .filter(Boolean);
    if (!phones.length) return;

    navigator.clipboard.writeText(phones.join(', '));
    setCopiedPhones(true);
    setTimeout(() => setCopiedPhones(false), 2500);
  };

  // Filter registrations
  const filteredRegistrations = registrations.filter((r) => {
    const matchesSearch =
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.phone.includes(searchQuery) ||
      r.course.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.message && r.message.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory =
      categoryFilter === 'all' ||
      (categoryFilter === 'admission' && r.course.includes('এডমিশন')) ||
      (categoryFilter === 'hsc' && r.course.includes('এইচএসসি')) ||
      (categoryFilter === 'ssc' && r.course.includes('এসএসসি'));

    const matchesStatus = statusFilter === 'all' || r.status === statusFilter;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const totalCount = registrations.length;
  const newCount = registrations.filter((r) => !r.status || r.status === 'new').length;
  const contactedCount = registrations.filter((r) => r.status === 'contacted' || r.status === 'enrolled').length;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/65 backdrop-blur-md animate-fade-in font-sans">
      <div className="relative w-full max-w-4xl bg-white border border-orange-200 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500 p-5 sm:p-6 text-white flex items-center justify-between shadow-md shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center border border-white/20">
              <GraduationCap size={24} className="text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-bold font-['Hind_Siliguri',sans-serif]">
                  Mahim's Classroom
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/25 text-white border border-white/30">
                  এডমিন ড্যাশবোর্ড
                </span>
              </div>
              <p className="text-xs text-orange-100 font-['Hind_Siliguri',sans-serif]">
                প্রি-রেজিস্ট্রেশন শিক্ষার্থী তথ্য ও ব্যাচ এনরোলমেন্ট ডাটাবেস
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            title="বন্ধ করুন"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content Body */}
        {!isAuthenticated ? (
          /* ========================================================================= */
          /* Login View                                                                */
          /* ========================================================================= */
          <div className="p-8 sm:p-12 flex flex-col items-center justify-center my-auto">
            <div className="w-16 h-16 rounded-3xl bg-orange-100 text-orange-600 flex items-center justify-center mb-5 shadow-inner">
              <Lock size={28} />
            </div>

            <h3 className="text-xl font-bold text-zinc-900 font-['Hind_Siliguri',sans-serif] text-center mb-1">
              ক্লাসরুম এডমিন লগইন
            </h3>
            <p className="text-xs text-zinc-500 font-['Hind_Siliguri',sans-serif] text-center max-w-sm mb-6">
              শিক্ষার্থীদের সংবেদনশীল ফোন নম্বর ও আবেদন দেখতে ক্লাসরুম এডমিন পাসওয়ার্ড লিখুন।
            </p>

            <form onSubmit={handleLogin} className="w-full max-w-sm space-y-4">
              <div className="relative">
                <input
                  type="password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="এডমিন পাসওয়ার্ড দিন..."
                  autoFocus
                  required
                  className={`w-full px-4 py-3 rounded-xl bg-zinc-50 border ${
                    passwordError ? 'border-red-500 ring-2 ring-red-200' : 'border-zinc-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200'
                  } text-zinc-900 text-sm focus:outline-none transition-all font-mono`}
                />
              </div>

              {passwordError && (
                <div className="flex items-center gap-2 text-xs text-red-600 bg-red-50 p-2.5 rounded-xl border border-red-200 font-['Hind_Siliguri',sans-serif]">
                  <AlertCircle size={15} className="shrink-0" />
                  <span>ভুল পাসওয়ার্ড! সঠিক পাসওয়ার্ড দিয়ে পুনরায় চেষ্টা করুন।</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isVerifying}
                className="w-full py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm shadow-md shadow-orange-500/20 transition-all font-['Hind_Siliguri',sans-serif] cursor-pointer"
              >
                {isVerifying ? 'যাচাই করা হচ্ছে...' : 'প্রবেশ করুন ➔'}
              </button>

              <p className="text-[11px] text-zinc-400 text-center font-['Hind_Siliguri',sans-serif] flex items-center justify-center gap-1">
                <ShieldCheck size={12} className="text-orange-500" />
                <span>সুরক্ষিত ক্লাসরুম এডমিন এক্সেস</span>
              </p>
            </form>
          </div>
        ) : (
          /* ========================================================================= */
          /* Authenticated Dashboard View                                              */
          /* ========================================================================= */
          <div className="flex flex-col flex-1 overflow-hidden">
            {/* Top Navigation Bar inside Admin */}
            <div className="px-5 py-3 border-b border-zinc-200 bg-zinc-50/70 flex items-center justify-between gap-3 shrink-0 flex-wrap">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab('students')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer font-['Hind_Siliguri',sans-serif] flex items-center gap-1.5 ${
                    activeTab === 'students'
                      ? 'bg-orange-500 text-white shadow-xs'
                      : 'bg-white text-zinc-700 hover:bg-zinc-100 border border-zinc-200'
                  }`}
                >
                  <Users size={14} />
                  <span>শিক্ষার্থীদের তালিকা ({totalCount})</span>
                </button>

                <button
                  onClick={() => setActiveTab('settings')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer font-['Hind_Siliguri',sans-serif] flex items-center gap-1.5 ${
                    activeTab === 'settings'
                      ? 'bg-orange-500 text-white shadow-xs'
                      : 'bg-white text-zinc-700 hover:bg-zinc-100 border border-zinc-200'
                  }`}
                >
                  <Sliders size={14} />
                  <span>সেটিংস ও ব্যাকআপ</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleManualSync}
                  disabled={isSyncing}
                  title="গুগল শিট থেকে নতুন তথ্য রিফ্রেশ করুন"
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-colors cursor-pointer font-['Hind_Siliguri',sans-serif] flex items-center gap-1.5"
                >
                  <RefreshCw size={13} className={isSyncing ? 'animate-spin' : ''} />
                  <span>{isSyncing ? 'সিঙ্ক হচ্ছে...' : 'শিট রিফ্রেশ'}</span>
                </button>

                <button
                  onClick={handleLogout}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium text-zinc-600 hover:text-red-600 hover:bg-red-50 border border-zinc-200 transition-colors cursor-pointer font-['Hind_Siliguri',sans-serif]"
                >
                  লগআউট
                </button>
              </div>
            </div>

            {/* Sync Status Banner */}
            {syncStatusMsg && (
              <div className="mx-4 sm:mx-6 mt-3 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-semibold text-emerald-900 flex items-center justify-between font-['Hind_Siliguri',sans-serif] shadow-xs">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                  <span>{syncStatusMsg}</span>
                </div>
                <button
                  onClick={() => setSyncStatusMsg(null)}
                  className="p-1 rounded-md text-emerald-600 hover:bg-emerald-100 transition-colors cursor-pointer"
                >
                  <X size={14} />
                </button>
              </div>
            )}

            {/* Tab: Students List */}
            {activeTab === 'students' && (
              <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4">
                {/* Stats row */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-orange-50/80 border border-orange-200 rounded-2xl p-3 sm:p-4 text-left">
                    <p className="text-[11px] font-bold text-orange-600 font-['Hind_Siliguri',sans-serif]">
                      মোট প্রি-রেজিস্ট্রেশন
                    </p>
                    <p className="text-xl sm:text-2xl font-black text-zinc-900 font-mono mt-0.5">
                      {totalCount}
                    </p>
                  </div>

                  <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-3 sm:p-4 text-left">
                    <p className="text-[11px] font-bold text-amber-700 font-['Hind_Siliguri',sans-serif]">
                      নতুন আবেদন
                    </p>
                    <p className="text-xl sm:text-2xl font-black text-zinc-900 font-mono mt-0.5">
                      {newCount}
                    </p>
                  </div>

                  <div className="bg-emerald-50/80 border border-emerald-200 rounded-2xl p-3 sm:p-4 text-left">
                    <p className="text-[11px] font-bold text-emerald-700 font-['Hind_Siliguri',sans-serif]">
                      যোগাযোগ / ভর্তি
                    </p>
                    <p className="text-xl sm:text-2xl font-black text-zinc-900 font-mono mt-0.5">
                      {contactedCount}
                    </p>
                  </div>
                </div>

                {/* Toolbar: Search, Filter, Export */}
                <div className="bg-white border border-zinc-200 rounded-2xl p-3.5 space-y-3 shadow-xs">
                  <div className="flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center justify-between">
                    <div className="relative flex-1">
                      <Search size={16} className="absolute left-3.5 top-3 text-zinc-400" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="নাম, ফোন নম্বর বা কোর্স দিয়ে খুঁজুন..."
                        className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-zinc-50 border border-zinc-200 text-xs sm:text-sm text-zinc-800 placeholder-zinc-400 focus:outline-none focus:border-orange-500 font-['Hind_Siliguri',sans-serif]"
                      />
                    </div>

                    <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
                      <select
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        className="px-2.5 py-2 rounded-xl bg-zinc-50 border border-zinc-200 text-xs font-semibold text-zinc-700 focus:outline-none font-['Hind_Siliguri',sans-serif]"
                      >
                        <option value="all">সকল কোর্স</option>
                        <option value="admission">ভার্সিটি এডমিশন</option>
                        <option value="hsc">এইচএসসি</option>
                        <option value="ssc">এসএসসি</option>
                      </select>

                      <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-2.5 py-2 rounded-xl bg-zinc-50 border border-zinc-200 text-xs font-semibold text-zinc-700 focus:outline-none font-['Hind_Siliguri',sans-serif]"
                      >
                        <option value="all">সব স্ট্যাটাস</option>
                        <option value="new">নতুন (New)</option>
                        <option value="contacted">যোগাযোগ হয়েছে</option>
                        <option value="enrolled">ভর্তি নিশ্চিত</option>
                      </select>
                    </div>
                  </div>

                  {/* Actions: Download CSV, Copy Phone Numbers, Refresh */}
                  <div className="flex items-center justify-between gap-2 pt-2 border-t border-zinc-100 flex-wrap">
                    <span className="text-xs text-zinc-500 font-['Hind_Siliguri',sans-serif]">
                      ফিল্টার অনুযায়ী দেখানো হচ্ছে: <b className="text-zinc-800">{filteredRegistrations.length}</b> জন
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleCopyAllPhoneNumbers}
                        disabled={!filteredRegistrations.length}
                        className="px-3 py-1.5 rounded-lg text-xs font-bold bg-zinc-100 hover:bg-zinc-200 text-zinc-700 transition-colors flex items-center gap-1.5 font-['Hind_Siliguri',sans-serif] cursor-pointer disabled:opacity-50"
                        title="সব নম্বর কমা দিয়ে কপি করুন যাতে বাল্ক এসএমএস পাঠানো যায়"
                      >
                        <Copy size={13} />
                        <span>{copiedPhones ? 'নম্বরগুলো কপি হয়েছে!' : 'সব নম্বর কপি'}</span>
                      </button>

                      <button
                        onClick={() => exportRegistrationsToCSV(filteredRegistrations)}
                        disabled={!filteredRegistrations.length}
                        className="px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition-colors flex items-center gap-1.5 font-['Hind_Siliguri',sans-serif] cursor-pointer disabled:opacity-50 shadow-xs"
                      >
                        <Download size={13} />
                        <span>CSV / Excel এক্সপোর্ট</span>
                      </button>

                      <button
                        onClick={loadData}
                        className="p-1.5 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-600 transition-colors cursor-pointer"
                        title="রিফ্রেশ"
                      >
                        <RefreshCw size={14} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Registrations List */}
                {filteredRegistrations.length === 0 ? (
                  <div className="p-10 text-center bg-zinc-50 rounded-2xl border border-dashed border-zinc-300">
                    <BookOpen size={36} className="mx-auto text-zinc-400 mb-2" />
                    <p className="text-sm font-bold text-zinc-700 font-['Hind_Siliguri',sans-serif]">
                      কোনো প্রি-রেজিস্ট্রেশন পাওয়া যায়নি
                    </p>
                    <p className="text-xs text-zinc-500 mt-1 font-['Hind_Siliguri',sans-serif]">
                      শিক্ষার্থীরা যখন ফরম পূরণ করবে, তাদের তথ্য এই তালিকায় স্বয়ংক্রিয়ভাবে জমা হবে।
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredRegistrations.map((item) => {
                      const cleanPhone = item.phone.replace(/[^0-9]/g, '');
                      const whatsappUrl = `https://wa.me/88${cleanPhone.startsWith('88') ? cleanPhone : cleanPhone.startsWith('0') ? cleanPhone : '0' + cleanPhone}`;

                      return (
                        <div
                          key={item.id}
                          className="bg-white border border-zinc-200 hover:border-orange-300 rounded-2xl p-4 transition-all shadow-xs space-y-3"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-sm shrink-0">
                                {item.name.charAt(0)}
                              </div>
                              <div>
                                <h4 className="text-sm font-bold text-zinc-900 font-['Hind_Siliguri',sans-serif]">
                                  {item.name}
                                </h4>
                                <div className="flex items-center gap-2 mt-0.5 text-xs text-zinc-500">
                                  <span className="font-mono font-bold text-zinc-700">{item.phone}</span>
                                  <span>•</span>
                                  <span className="flex items-center gap-1 font-['Hind_Siliguri',sans-serif]">
                                    <Clock size={12} />
                                    {new Date(item.timestamp).toLocaleDateString('bn-BD', {
                                      day: 'numeric',
                                      month: 'short',
                                      year: 'numeric',
                                      hour: '2-digit',
                                      minute: '2-digit',
                                    })}
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Direct Communication Action Buttons */}
                            <div className="flex items-center gap-2 self-start sm:self-center">
                              <a
                                href={`tel:${item.phone}`}
                                className="px-2.5 py-1.5 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-semibold flex items-center gap-1 font-['Hind_Siliguri',sans-serif] transition-colors"
                              >
                                <PhoneCall size={13} className="text-emerald-600" />
                                <span>কল দিন</span>
                              </a>

                              <a
                                href={whatsappUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-2.5 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-semibold flex items-center gap-1 font-['Hind_Siliguri',sans-serif] transition-colors"
                              >
                                <MessageSquare size={13} className="text-emerald-600" />
                                <span>হোয়াটসঅ্যাপ</span>
                              </a>

                              {/* Status Dropdown */}
                              <select
                                value={item.status || 'new'}
                                onChange={(e) =>
                                  handleStatusChange(item.id, e.target.value as ClassroomRegistration['status'])
                                }
                                className={`px-2.5 py-1 rounded-lg text-xs font-bold border focus:outline-none font-['Hind_Siliguri',sans-serif] ${
                                  item.status === 'enrolled'
                                    ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                                    : item.status === 'contacted'
                                    ? 'bg-blue-100 text-blue-800 border-blue-300'
                                    : 'bg-amber-100 text-amber-800 border-amber-300'
                                }`}
                              >
                                <option value="new">নতুন (New)</option>
                                <option value="contacted">যোগাযোগ সম্পন্ন</option>
                                <option value="enrolled">ভর্তি নিশ্চিত</option>
                                <option value="cancelled">বাতিল</option>
                              </select>

                              {/* Delete button */}
                              <button
                                onClick={() => handleDelete(item.id, item.name)}
                                className="p-1.5 rounded-lg text-zinc-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                                title="রেকর্ড মুছে ফেলুন"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </div>

                          {/* Course badge & Message */}
                          <div className="bg-orange-50/50 border border-orange-100/80 rounded-xl p-2.5 text-xs text-zinc-700 flex flex-col gap-1.5">
                            <div className="flex items-center gap-1.5 text-orange-700 font-bold font-['Hind_Siliguri',sans-serif]">
                              <BookOpen size={13} />
                              <span>কাঙ্ক্ষিত ব্যাচ: {item.course}</span>
                            </div>
                            {item.message && (
                              <p className="text-zinc-600 italic bg-white p-2 rounded-lg border border-orange-100/60 font-['Hind_Siliguri',sans-serif]">
                                "{item.message}"
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* Tab: Settings & Google Sheets Sync */}
            {activeTab === 'settings' && (
              <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6 text-left">
                {/* 1. Google Sheets Live Integration */}
                <div className="bg-white border border-zinc-200 rounded-2xl p-5 sm:p-6 shadow-xs">
                  <div className="flex items-center justify-between gap-3 mb-3 flex-wrap">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-200 shrink-0">
                        <FileSpreadsheet size={20} />
                      </div>
                      <div>
                        <h4 className="text-base font-bold text-zinc-900 font-['Hind_Siliguri',sans-serif] leading-tight">
                          গুগল শিট লাইভ অটো-সিঙ্ক (Google Sheet Integration)
                        </h4>
                        <p className="text-[11px] text-zinc-500 font-['Hind_Siliguri',sans-serif]">
                          শিক্ষার্থীদের প্রি-রেজিস্ট্রেশন ডাটা সরাসরি আপনার গুগল স্প্রেডশিটে ব্যাকআপ হবে
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {settings.googleSheetWebhookUrl?.trim() || getEffectiveClassroomWebhookUrl() ? (
                        <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1 font-['Hind_Siliguri',sans-serif]">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                          <span>সংযুক্ত (Connected)</span>
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200 font-['Hind_Siliguri',sans-serif]">
                          সেটআপ প্রয়োজন
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Step by step guide box */}
                  <div className="bg-zinc-50 rounded-xl p-4 border border-zinc-200/80 mb-5 space-y-2 text-xs font-['Hind_Siliguri',sans-serif] text-zinc-700">
                    <p className="font-bold text-zinc-900 flex items-center gap-1.5">
                      <span>📌 যেভাবে গুগল শিট কানেক্ট করবেন (খুব সহজ ৪টি ধাপ):</span>
                    </p>
                    <ol className="list-decimal pl-4 space-y-1.5 leading-relaxed text-zinc-600">
                      <li>
                        আপনার গুগল ড্রাইভে গিয়ে একটি নতুন <b>Google Sheet</b> খুলুন (যেমন নাম দিতে পারেন: <span className="font-mono text-zinc-800 font-bold">Mahims Classroom Registrations</span>)।
                      </li>
                      <li>
                        উপরের মেনু বার থেকে <b>Extensions &gt; Apps Script</b> এ ক্লিক করুন।
                      </li>
                      <li>
                        এডিটরে যা কোড আছে সব মুছে দিয়ে নিচের <b>"Apps Script কোড কপি করুন"</b> বাটনে ক্লিক করে কপি করা কোডটি পেস্ট করুন এবং উপরে <b>Save (💾)</b> আইকনে ক্লিক করুন।
                      </li>
                      <li>
                        উপরের ডানপাশের নীল রঙের <b>Deploy &gt; New deployment</b> বাটনে ক্লিক করুন। গিয়ার আইকন থেকে <b>Web app</b> সিলেক্ট করুন। Description: <i>Classroom</i>, Execute as: <b>Me</b>, এবং Who has access: <b>Anyone</b> দিয়ে <b>Deploy</b> চাপুন।
                      </li>
                      <li>
                        এরপর <b>Web app URL</b> টি কপি করে এনে নিচের বক্সে পেস্ট করে <b>"ইউআরএল সংরক্ষণ করুন"</b> বাটনে ক্লিক করুন!
                      </li>
                    </ol>

                    <div className="pt-2 flex items-center gap-2 flex-wrap">
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(GOOGLE_APPS_SCRIPT_CLASSROOM);
                          setCopiedScript(true);
                          setTimeout(() => setCopiedScript(false), 2500);
                        }}
                        className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
                      >
                        <Copy size={13} />
                        <span>{copiedScript ? '✓ কোড কপি হয়েছে!' : 'Apps Script কোড কপি করুন'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setShowScriptCode((prev) => !prev)}
                        className="px-3 py-2 rounded-xl bg-white hover:bg-zinc-100 text-zinc-700 border border-zinc-300 font-bold text-xs transition-colors cursor-pointer"
                      >
                        {showScriptCode ? 'কোড লুকান ▲' : 'কোড প্রিভিউ দেখুন ▼'}
                      </button>
                    </div>

                    {showScriptCode && (
                      <div className="mt-3 relative">
                        <pre className="p-3.5 rounded-xl bg-zinc-900 text-zinc-100 text-[11px] font-mono overflow-x-auto max-h-56 leading-relaxed border border-zinc-800">
                          {GOOGLE_APPS_SCRIPT_CLASSROOM}
                        </pre>
                      </div>
                    )}
                  </div>

                  <form onSubmit={handleSaveSettings} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-zinc-800 mb-1.5 font-['Hind_Siliguri',sans-serif]">
                        Google Apps Script Webhook URL:
                      </label>
                      <input
                        type="url"
                        value={settings.googleSheetWebhookUrl || ''}
                        onChange={(e) => setSettings({ ...settings, googleSheetWebhookUrl: e.target.value })}
                        placeholder="https://script.google.com/macros/s/.../exec"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 focus:border-orange-500 focus:bg-white text-xs font-mono text-zinc-900 outline-none transition-all"
                      />
                      <p className="text-[11px] text-zinc-500 mt-1 font-['Hind_Siliguri',sans-serif]">
                        Deploy করার পর পাওয়া <code className="font-mono bg-zinc-100 px-1 py-0.5 rounded text-zinc-700">/exec</code> যুক্ত ইউআরএলটি এখানে দিন।
                      </p>
                    </div>

                    <div className="flex items-center gap-2.5 flex-wrap pt-1">
                      <button
                        type="submit"
                        className="px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs font-['Hind_Siliguri',sans-serif] shadow-xs cursor-pointer transition-all active:scale-98"
                      >
                        ইউআরএল সংরক্ষণ করুন
                      </button>

                      <button
                        type="button"
                        onClick={handleManualSync}
                        disabled={isSyncing}
                        className="px-4 py-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold text-xs font-['Hind_Siliguri',sans-serif] cursor-pointer transition-colors flex items-center gap-1.5"
                      >
                        <RefreshCw size={13} className={isSyncing ? 'animate-spin' : ''} />
                        <span>{isSyncing ? 'ডাটা সিঙ্ক হচ্ছে...' : 'শিট থেকে ডাটা আনুন'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={handlePushAllToSheet}
                        disabled={isPushingAll || !registrations.length}
                        className="px-4 py-2.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-800 border border-zinc-200 font-bold text-xs font-['Hind_Siliguri',sans-serif] cursor-pointer transition-colors flex items-center gap-1.5 disabled:opacity-50"
                      >
                        <Send size={13} />
                        <span>{isPushingAll ? 'পাঠানো হচ্ছে...' : 'বর্তমান তালিকা শিটে ব্যাকআপ পাঠান'}</span>
                      </button>
                    </div>
                  </form>
                </div>

                {/* 2. Change Admin Password */}
                <div className="bg-white border border-zinc-200 rounded-2xl p-5 shadow-xs">
                  <div className="flex items-center gap-2 mb-2">
                    <Key className="text-orange-600" size={20} />
                    <h4 className="text-base font-bold text-zinc-900 font-['Hind_Siliguri',sans-serif]">
                      ক্লাসরুম এডমিন পাসওয়ার্ড পরিবর্তন
                    </h4>
                  </div>
                  <p className="text-xs text-zinc-600 font-['Hind_Siliguri',sans-serif] mb-4">
                    শুধুমাত্র ক্লাসরুমের প্যানেল খোলার জন্য নতুন পাসওয়ার্ড সেট করুন।
                  </p>

                  <form onSubmit={handleChangePassword} className="space-y-3 max-w-sm">
                    <div>
                      <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="নতুন পাসওয়ার্ড লিখুন..."
                        required
                        className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 focus:border-orange-500 text-xs font-mono text-zinc-800"
                      />
                    </div>

                    {passwordChangeSuccess && (
                      <p className="text-xs text-emerald-600 font-bold font-['Hind_Siliguri',sans-serif]">
                        ✓ পাসওয়ার্ড সফলভাবে পরিবর্তিত হয়েছে!
                      </p>
                    )}

                    {passwordChangeError && (
                      <p className="text-xs text-red-600 font-bold font-['Hind_Siliguri',sans-serif]">
                        {passwordChangeError}
                      </p>
                    )}

                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-black text-white font-bold text-xs font-['Hind_Siliguri',sans-serif] cursor-pointer shadow-xs"
                    >
                      পাসওয়ার্ড আপডেট করুন
                    </button>
                  </form>
                </div>

                {/* 3. Danger Zone */}
                <div className="bg-red-50 border border-red-200 rounded-2xl p-5">
                  <h4 className="text-xs font-bold text-red-700 uppercase tracking-wider mb-2 font-mono flex items-center gap-1.5">
                    <AlertCircle size={15} />
                    <span>সতর্কতা অঞ্চল (Danger Zone)</span>
                  </h4>
                  <p className="text-xs text-red-600 font-['Hind_Siliguri',sans-serif] mb-3">
                    সমস্ত সংরক্ষিত প্রি-রেজিস্ট্রেশন ডাটা চিরতরে মুছে ফেলুন।
                  </p>
                  <button
                    onClick={handleClearAll}
                    disabled={!registrations.length}
                    className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs font-['Hind_Siliguri',sans-serif] cursor-pointer disabled:opacity-50"
                  >
                    সকল ডাটা মুছে ফেলুন
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Script Modal for Google Apps Script */}
      {showScriptModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full border border-orange-200 shadow-2xl text-left">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-bold text-sm text-zinc-900 font-['Hind_Siliguri',sans-serif]">
                গুগল শিট ইন্টিগ্রেশন স্ক্রিপ্ট
              </h4>
              <button
                onClick={() => setShowScriptModal(false)}
                className="p-1 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-600"
              >
                <X size={16} />
              </button>
            </div>

            <ol className="text-xs text-zinc-600 space-y-2 mb-4 font-['Hind_Siliguri',sans-serif] list-decimal pl-4">
              <li>একটি নতুন Google Sheet খুলুন।</li>
              <li>উপরে <b>Extensions &gt; Apps Script</b> এ ক্লিক করুন।</li>
              <li>নিচের কোডটি কপি করে পেস্ট করে Save করুন।</li>
              <li>এরপর <b>Deploy &gt; New deployment &gt; Web app</b> নির্বাচন করুন।</li>
              <li>Who has access এ <b>Anyone</b> দিয়ে Deploy করে প্রাপ্ত URL টি সেটিংস এ পেস্ট করুন।</li>
            </ol>

            <div className="relative">
              <pre className="p-3 rounded-xl bg-zinc-900 text-zinc-100 text-[11px] font-mono overflow-x-auto max-h-48">
                {GOOGLE_APPS_SCRIPT_CLASSROOM}
              </pre>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(GOOGLE_APPS_SCRIPT_CLASSROOM);
                  setCopiedScript(true);
                  setTimeout(() => setCopiedScript(false), 2000);
                }}
                className="absolute top-2 right-2 px-2.5 py-1 rounded-lg bg-orange-500 text-white text-[11px] font-bold"
              >
                {copiedScript ? 'কপি হয়েছে!' : 'কোড কপি করুন'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
