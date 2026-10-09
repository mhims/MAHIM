import React, { useState, useEffect } from 'react';
import {
  X,
  Lock,
  Plus,
  Trash2,
  Bell,
  BookOpen,
  Calendar,
  Users,
  Code,
  Copy,
  Check,
  Download,
  AlertCircle,
  ExternalLink,
  LogOut,
  RefreshCw,
  FileSpreadsheet,
  Link as LinkIcon
} from 'lucide-react';
import {
  PSClassSession,
  PSNotice,
  PSBookResource,
  PSSubscriber,
  PSTeacher,
  PSCourse
} from '../../data/dcuPoliticalScienceData';
import { fetchNoticesFromGoogleSheet } from '../../utils/googleSheetsNotices';

interface DCUAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  isAuthenticated: boolean;
  onLogin: (u: string, p: string) => boolean;
  onLogout: () => void;
  notices: PSNotice[];
  setNotices: React.Dispatch<React.SetStateAction<PSNotice[]>>;
  books: PSBookResource[];
  setBooks: React.Dispatch<React.SetStateAction<PSBookResource[]>>;
  routine: PSClassSession[];
  setRoutine: React.Dispatch<React.SetStateAction<PSClassSession[]>>;
  subscribers: PSSubscriber[];
  setSubscribers: React.Dispatch<React.SetStateAction<PSSubscriber[]>>;
  teachers: PSTeacher[];
  courses: PSCourse[];
  googleSheetUrl: string;
  setGoogleSheetUrl: (url: string) => void;
  onRefreshGoogleSheet: () => Promise<void>;
}

export const DCUAdminModal: React.FC<DCUAdminModalProps> = ({
  isOpen,
  onClose,
  isAuthenticated,
  onLogin,
  onLogout,
  notices,
  setNotices,
  books,
  setBooks,
  routine,
  setRoutine,
  subscribers,
  setSubscribers,
  teachers,
  courses,
  googleSheetUrl,
  setGoogleSheetUrl,
  onRefreshGoogleSheet
}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const [activeTab, setActiveTab] = useState<'ticker_sheet' | 'notices' | 'books' | 'routine' | 'subscribers' | 'export'>('ticker_sheet');
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedEmails, setCopiedEmails] = useState(false);

  // Google Sheet Sync test state
  const [tempSheetUrl, setTempSheetUrl] = useState(googleSheetUrl);
  const [sheetSyncStatus, setSheetSyncStatus] = useState<{ loading: boolean; message: string; error?: boolean } | null>(null);

  // Form states for adding new notice
  const [isAddingNotice, setIsAddingNotice] = useState(false);
  const [newNoticeTitle, setNewNoticeTitle] = useState('');
  const [newNoticeCategory, setNewNoticeCategory] = useState<PSNotice['category']>('সাধারণ');
  const [newNoticeContent, setNewNoticeContent] = useState('');
  const [newNoticeFileUrl, setNewNoticeFileUrl] = useState('');
  const [newNoticePinned, setNewNoticePinned] = useState(false);

  // Form states for adding new book
  const [isAddingBook, setIsAddingBook] = useState(false);
  const [newBookCourseCode, setNewBookCourseCode] = useState('PS-101');
  const [newBookTitle, setNewBookTitle] = useState('');
  const [newBookAuthor, setNewBookAuthor] = useState('');
  const [newBookCategory, setNewBookCategory] = useState<PSBookResource['category']>('মূল বই');
  const [newBookDriveUrl, setNewBookDriveUrl] = useState('');
  const [newBookSize, setNewBookSize] = useState('');

  useEffect(() => {
    setTempSheetUrl(googleSheetUrl);
  }, [googleSheetUrl]);

  if (!isOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = onLogin(username, password);
    if (!success) {
      setLoginError('ইউজার নেম অথবা পাসওয়ার্ড সঠিক নয়!');
    } else {
      setLoginError('');
      setUsername('');
      setPassword('');
    }
  };

  const handleSaveSheetUrl = async (e: React.FormEvent) => {
    e.preventDefault();
    setSheetSyncStatus({ loading: true, message: 'গুগল শিট যাচাই ও সিঙ্ক করা হচ্ছে...' });
    try {
      const trimmed = tempSheetUrl.trim();
      setGoogleSheetUrl(trimmed);
      localStorage.setItem('dcu_ps_sheets_url', trimmed);

      if (trimmed) {
        const fetched = await fetchNoticesFromGoogleSheet(trimmed);
        setSheetSyncStatus({
          loading: false,
          message: `সফলভাবে কানেক্ট হয়েছে! মোট ${fetched.length}টি নোটিশ পাওয়া গেছে।`,
          error: false
        });
      } else {
        setSheetSyncStatus({
          loading: false,
          message: 'গুগল শিট লিংক সরানো হয়েছে (ডিফল্ট নোটিশ চালু থাকবে)।',
          error: false
        });
      }
      await onRefreshGoogleSheet();
    } catch (err: any) {
      setSheetSyncStatus({
        loading: false,
        message: err.message || 'গুগল শিট লোড করতে সমস্যা হয়েছে। দয়া করে লিংকটি চেক করুন।',
        error: true
      });
    }
  };

  const handleAddNotice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoticeTitle || !newNoticeContent) return;

    const notice: PSNotice = {
      id: `notice-${Date.now()}`,
      title: newNoticeTitle,
      date: new Date().toLocaleDateString('bn-BD', { day: 'numeric', month: 'long', year: 'numeric' }),
      category: newNoticeCategory,
      content: newNoticeContent,
      fileUrl: newNoticeFileUrl || undefined,
      pinned: newNoticePinned
    };

    setNotices(prev => [notice, ...prev]);
    setIsAddingNotice(false);
    setNewNoticeTitle('');
    setNewNoticeContent('');
    setNewNoticeFileUrl('');
    setNewNoticePinned(false);
  };

  const handleDeleteNotice = (id: string) => {
    if (window.confirm('আপনি কি এই নোটিশটি মুছে ফেলতে চান?')) {
      setNotices(prev => prev.filter(n => n.id !== id));
    }
  };

  const handleTogglePinNotice = (id: string) => {
    setNotices(prev =>
      prev.map(n => (n.id === id ? { ...n, pinned: !n.pinned } : n))
    );
  };

  const handleAddBook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBookTitle || !newBookDriveUrl) return;

    const course = courses.find(c => c.code === newBookCourseCode);

    const book: PSBookResource = {
      id: `book-${Date.now()}`,
      courseCode: newBookCourseCode,
      courseTitle: course ? course.titleBn : newBookCourseCode,
      title: newBookTitle,
      author: newBookAuthor || 'অনুল্লিখিত',
      category: newBookCategory,
      driveUrl: newBookDriveUrl,
      fileSize: newBookSize || undefined
    };

    setBooks(prev => [book, ...prev]);
    setIsAddingBook(false);
    setNewBookTitle('');
    setNewBookAuthor('');
    setNewBookDriveUrl('');
    setNewBookSize('');
  };

  const handleDeleteBook = (id: string) => {
    if (window.confirm('আপনি কি এই বই/রিসোর্সটি মুছে ফেলতে চান?')) {
      setBooks(prev => prev.filter(b => b.id !== id));
    }
  };

  const handleDeleteSubscriber = (id: string) => {
    setSubscribers(prev => prev.filter(s => s.id !== id));
  };

  const copyAllEmails = () => {
    const emailList = subscribers.map(s => s.email).filter(Boolean).join(', ');
    navigator.clipboard.writeText(emailList);
    setCopiedEmails(true);
    setTimeout(() => setCopiedEmails(false), 2500);
  };

  const getFullExportJson = () => {
    return JSON.stringify(
      {
        notices,
        books,
        routine,
        subscribers,
        googleSheetUrl
      },
      null,
      2
    );
  };

  const handleCopyExportJson = () => {
    navigator.clipboard.writeText(getFullExportJson());
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  const handleDownloadJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(getFullExportJson());
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', 'dcu-political-science-data.json');
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-xs animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white dark:bg-[#111622] rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 my-4 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-zinc-900 text-white border-b border-zinc-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold tracking-tight">ডিপার্টমেন্ট এডমিন কন্ট্রোল</h2>
              <p className="text-[11px] text-zinc-400">
                রাষ্ট্রবিজ্ঞান বিভাগ • ঢাকা সেন্ট্রাল ইউনিভার্সিটি
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isAuthenticated && (
              <button
                type="button"
                onClick={onLogout}
                className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors cursor-pointer"
              >
                <LogOut className="w-3 h-3 text-red-400" />
                লগআউট
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content */}
        {!isAuthenticated ? (
          /* Login Form */
          <div className="p-8 max-w-sm mx-auto w-full my-auto text-center">
            <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20 text-amber-500">
              <Lock className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-zinc-900 dark:text-white mb-1">
              এডমিন লগইন
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-5">
              নোটিশ, গুগল শিট ও রুটিন সম্পাদনা করতে লগইন করুন
            </p>

            {loginError && (
              <div className="mb-4 p-2.5 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-xs flex items-center gap-2 text-left">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <form onSubmit={handleLoginSubmit} className="space-y-3.5 text-left">
              <div>
                <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                  ইউজার নেম
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  placeholder="ইউজার নেম লিখুন"
                  required
                  className="w-full px-3 py-2 text-xs rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                  পাসওয়ার্ড
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="পাসওয়ার্ড লিখুন"
                  required
                  className="w-full px-3 py-2 text-xs rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-black font-semibold text-xs transition-colors shadow-sm cursor-pointer"
              >
                লগইন করুন
              </button>
            </form>
          </div>
        ) : (
          /* Authenticated Dashboard */
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Tabs */}
            <div className="flex items-center gap-1.5 px-4 py-2 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 overflow-x-auto text-xs font-medium">
              <button
                type="button"
                onClick={() => setActiveTab('ticker_sheet')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors shrink-0 cursor-pointer ${
                  activeTab === 'ticker_sheet'
                    ? 'bg-amber-500 text-black font-semibold shadow-xs'
                    : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800'
                }`}
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                গুগল শিট নোটিশ স্ক্রল
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('notices')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors shrink-0 cursor-pointer ${
                  activeTab === 'notices'
                    ? 'bg-amber-500 text-black font-semibold shadow-xs'
                    : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800'
                }`}
              >
                <Bell className="w-3.5 h-3.5" />
                ম্যানুয়াল নোটিশ ({notices.length})
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('books')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors shrink-0 cursor-pointer ${
                  activeTab === 'books'
                    ? 'bg-amber-500 text-black font-semibold shadow-xs'
                    : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                বই ও লেকচার শিট ({books.length})
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('routine')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors shrink-0 cursor-pointer ${
                  activeTab === 'routine'
                    ? 'bg-amber-500 text-black font-semibold shadow-xs'
                    : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800'
                }`}
              >
                <Calendar className="w-3.5 h-3.5" />
                রুটিন ({routine.length})
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('subscribers')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors shrink-0 cursor-pointer ${
                  activeTab === 'subscribers'
                    ? 'bg-amber-500 text-black font-semibold shadow-xs'
                    : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800'
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                ইমেইল তালিকা ({subscribers.length})
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('export')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors shrink-0 cursor-pointer ${
                  activeTab === 'export'
                    ? 'bg-amber-500 text-black font-semibold shadow-xs'
                    : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800'
                }`}
              >
                <Code className="w-3.5 h-3.5" />
                গিটহাব ব্যাকআপ
              </button>
            </div>

            {/* Tab Panels */}
            <div className="flex-1 overflow-y-auto p-5 space-y-5">
              
              {/* GOOGLE SHEETS TICKER TAB */}
              {activeTab === 'ticker_sheet' && (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/60">
                    <div className="flex items-center gap-2 mb-2">
                      <FileSpreadsheet className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      <h3 className="font-bold text-zinc-900 dark:text-white text-sm">
                        গুগল শিট থেকে অটোমেটিক স্ক্রলিং নোটিশ (Live Ticker)
                      </h3>
                    </div>
                    <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                      আপনি একটি সাধারণ গুগল শিট বানিয়ে সেখানে যা নোটিশ লিখবেন, তা ওয়েবসাইটের উপরে নিউজের মতো স্ক্রল হতে থাকবে। কোনো কোড চেঞ্জ ছাড়াই তাৎক্ষণিক আপডেট হবে।
                    </p>
                  </div>

                  <form onSubmit={handleSaveSheetUrl} className="space-y-3">
                    <div>
                      <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                        গুগল শিটের লিংক (বা Publish to Web CSV URL)
                      </label>
                      <div className="relative">
                        <input
                          type="url"
                          value={tempSheetUrl}
                          onChange={e => setTempSheetUrl(e.target.value)}
                          placeholder="https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID/edit..."
                          className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white font-mono"
                        />
                        <LinkIcon className="w-4 h-4 text-zinc-400 absolute left-3 top-2.5" />
                      </div>
                      <p className="text-[11px] text-zinc-500 mt-1">
                        টিপস: গুগল শিটটি <strong>Share ➜ Anyone with the link can view</strong> করুন অথবা <strong>File ➜ Share ➜ Publish to web ➜ CSV</strong> লিংক কপি করে দিন।
                      </p>
                    </div>

                    {sheetSyncStatus && (
                      <div
                        className={`p-3 rounded-xl border text-xs flex items-center gap-2 ${
                          sheetSyncStatus.error
                            ? 'bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-800 text-red-600 dark:text-red-400'
                            : 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300'
                        }`}
                      >
                        {sheetSyncStatus.loading ? (
                          <RefreshCw className="w-4 h-4 animate-spin shrink-0" />
                        ) : sheetSyncStatus.error ? (
                          <AlertCircle className="w-4 h-4 shrink-0" />
                        ) : (
                          <Check className="w-4 h-4 shrink-0" />
                        )}
                        <span>{sheetSyncStatus.message}</span>
                      </div>
                    )}

                    <div className="flex items-center gap-2">
                      <button
                        type="submit"
                        disabled={sheetSyncStatus?.loading}
                        className="px-4 py-2 text-xs font-semibold rounded-xl bg-amber-500 hover:bg-amber-600 text-black transition-colors cursor-pointer flex items-center gap-1.5"
                      >
                        <RefreshCw className={`w-3.5 h-3.5 ${sheetSyncStatus?.loading ? 'animate-spin' : ''}`} />
                        লিংক সেভ ও সিঙ্ক টেস্ট করুন
                      </button>

                      {tempSheetUrl && (
                        <button
                          type="button"
                          onClick={() => {
                            setTempSheetUrl('');
                            localStorage.removeItem('dcu_ps_sheets_url');
                            setGoogleSheetUrl('');
                            setSheetSyncStatus({ loading: false, message: 'লিংক ক্লিয়ার করা হয়েছে।', error: false });
                          }}
                          className="px-3 py-2 text-xs font-medium rounded-xl border border-zinc-300 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition cursor-pointer"
                        >
                          রিসেট / ক্লিয়ার
                        </button>
                      )}
                    </div>
                  </form>

                  <div className="p-4 rounded-xl bg-zinc-100/70 dark:bg-zinc-800/40 text-xs text-zinc-600 dark:text-zinc-400 space-y-1.5">
                    <p className="font-semibold text-zinc-800 dark:text-zinc-200">
                      📋 গুগল শিট সাজানোর সহজ নিয়ম:
                    </p>
                    <p>• ১ম কলাম (A কলাম): যে নোটিশটি স্ক্রল করতে চান সেই লেখাটি লিখবেন।</p>
                    <p>• ২য় কলাম (B কলাম): ঐচ্ছিক তারিখ (যেমন: ৯ অক্টোবর ২০২৬)।</p>
                    <p>• প্রতি লাইনে একটি করে নোটিশ লিখলে সেগুলো পর পর স্ক্রল হয়ে যাবে।</p>
                  </div>
                </div>
              )}

              {/* NOTICES TAB */}
              {activeTab === 'notices' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-zinc-800 dark:text-zinc-100 text-sm">
                        ম্যানুয়াল নোটিশ বোর্ড
                      </h3>
                      <p className="text-xs text-zinc-500">
                        গুগল শিট ছাড়া সরাসরি সাইটে নোটিশ দেখাতে চাইলে এখানে যোগ করুন
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsAddingNotice(!isAddingNotice)}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-amber-500 hover:bg-amber-600 text-black transition-colors cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      {isAddingNotice ? 'বাতিল' : 'নতুন নোটিশ'}
                    </button>
                  </div>

                  {isAddingNotice && (
                    <form
                      onSubmit={handleAddNotice}
                      className="p-4 rounded-xl border border-amber-300/40 bg-amber-50/30 dark:bg-amber-950/20 space-y-3"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                            শিরোনাম *
                          </label>
                          <input
                            type="text"
                            value={newNoticeTitle}
                            onChange={e => setNewNoticeTitle(e.target.value)}
                            placeholder="নোটিশের শিরোনাম"
                            required
                            className="w-full px-3 py-1.5 text-xs rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                            ক্যাটাগরি
                          </label>
                          <select
                            value={newNoticeCategory}
                            onChange={e => setNewNoticeCategory(e.target.value as any)}
                            className="w-full px-3 py-1.5 text-xs rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900"
                          >
                            <option value="সাধারণ">সাধারণ</option>
                            <option value="জরুরি">জরুরি</option>
                            <option value="ক্লাস রুটিন">ক্লাস রুটিন</option>
                            <option value="পরীক্ষা">পরীক্ষা</option>
                          </select>
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                          বিস্তারিত বিবরণ *
                        </label>
                        <textarea
                          value={newNoticeContent}
                          onChange={e => setNewNoticeContent(e.target.value)}
                          placeholder="নোটিশের বিস্তারিত বার্তা লিখুন..."
                          rows={3}
                          required
                          className="w-full px-3 py-1.5 text-xs rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900"
                        />
                      </div>
                      <button
                        type="submit"
                        className="px-4 py-2 text-xs font-semibold rounded-xl bg-amber-500 hover:bg-amber-600 text-black cursor-pointer"
                      >
                        নোটিশ প্রকাশ করুন
                      </button>
                    </form>
                  )}

                  <div className="space-y-2">
                    {notices.map(notice => (
                      <div
                        key={notice.id}
                        className="p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex items-start justify-between gap-3 text-xs"
                      >
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-zinc-900 dark:text-white truncate">
                            {notice.title}
                          </h4>
                          <p className="text-zinc-500 line-clamp-1 mt-0.5">{notice.content}</p>
                          <span className="text-[10px] text-zinc-400 mt-1 inline-block">{notice.date}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleDeleteNotice(notice.id)}
                          className="p-1 text-zinc-400 hover:text-red-500 transition cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* BOOKS TAB */}
              {activeTab === 'books' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-zinc-800 dark:text-zinc-100 text-sm">
                        বই ও শিট ব্যবস্থাপনা
                      </h3>
                      <p className="text-xs text-zinc-500">
                        ভবিষ্যতে যখন আসল বই বা ড্রাইভ লিংক যুক্ত করবেন, তখন এখানে অ্যাড করবেন
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsAddingBook(!isAddingBook)}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl bg-amber-500 hover:bg-amber-600 text-black transition cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      {isAddingBook ? 'বাতিল' : 'বই বা শিট যোগ'}
                    </button>
                  </div>

                  {isAddingBook && (
                    <form
                      onSubmit={handleAddBook}
                      className="p-4 rounded-xl border border-amber-300/40 bg-amber-50/30 dark:bg-amber-950/20 space-y-3"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                            কোর্স
                          </label>
                          <select
                            value={newBookCourseCode}
                            onChange={e => setNewBookCourseCode(e.target.value)}
                            className="w-full px-3 py-1.5 text-xs rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900"
                          >
                            {courses.map(c => (
                              <option key={c.code} value={c.code}>
                                {c.code} - {c.titleBn}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                            বই/ফাইলের নাম *
                          </label>
                          <input
                            type="text"
                            value={newBookTitle}
                            onChange={e => setNewBookTitle(e.target.value)}
                            placeholder="বই বা হ্যান্ডনোটের নাম"
                            required
                            className="w-full px-3 py-1.5 text-xs rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                          গুগল ড্রাইভ / ডাউনলোড লিংক *
                        </label>
                        <input
                          type="url"
                          value={newBookDriveUrl}
                          onChange={e => setNewBookDriveUrl(e.target.value)}
                          placeholder="https://drive.google.com/..."
                          required
                          className="w-full px-3 py-1.5 text-xs rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900"
                        />
                      </div>
                      <button
                        type="submit"
                        className="px-4 py-2 text-xs font-semibold rounded-xl bg-amber-500 hover:bg-amber-600 text-black cursor-pointer"
                      >
                        সংরক্ষণ করুন
                      </button>
                    </form>
                  )}

                  {books.length === 0 ? (
                    <div className="p-6 text-center rounded-xl border border-dashed border-zinc-300 dark:border-zinc-800 text-zinc-500 text-xs">
                      এখনো কোনো বই বা শিট যুক্ত করা হয়নি। প্রয়োজন অনুযায়ী পরে ড্রাইভ লিংক যুক্ত করতে পারবেন।
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {books.map(book => (
                        <div
                          key={book.id}
                          className="p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex items-center justify-between text-xs"
                        >
                          <div>
                            <span className="font-semibold text-zinc-900 dark:text-white">{book.title}</span>
                            <span className="text-zinc-500 ml-2">({book.courseCode})</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleDeleteBook(book.id)}
                            className="p-1 text-zinc-400 hover:text-red-500"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* ROUTINE TAB */}
              {activeTab === 'routine' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-zinc-800 dark:text-zinc-100 text-sm">
                        বর্তমান ক্লাস রুটিন (সেশন {routine.length}টি)
                      </h3>
                      <p className="text-xs text-zinc-500">
                        রবিবারের ৩টি ক্লাস (১০:৪৫ প্রথম ক্লাস, লাস্ট ক্লাস ইতিহাস), সোম, মঙ্গল, বৃহস্পতি।
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2 max-h-80 overflow-y-auto">
                    {routine.map(session => (
                      <div
                        key={session.id}
                        className="p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex items-center justify-between text-xs"
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-semibold px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400">
                            {session.dayNameBn}
                          </span>
                          <span className="font-medium text-zinc-800 dark:text-zinc-200">
                            {session.timeFormatted}
                          </span>
                          <span className="text-zinc-500 truncate max-w-xs">
                            {session.courseTitleBn} ({session.teacherCode})
                          </span>
                        </div>
                        <span className="text-[11px] font-mono text-zinc-400">{session.room}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* SUBSCRIBERS TAB */}
              {activeTab === 'subscribers' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-zinc-800 dark:text-zinc-100 text-sm">
                        নিবন্ধিত ইমেইল তালিকা ({subscribers.length})
                      </h3>
                      <p className="text-xs text-zinc-500">
                        যেসব শিক্ষার্থী আপডেট পাওয়ার জন্য ইমেইল দিয়েছেন
                      </p>
                    </div>
                    {subscribers.length > 0 && (
                      <button
                        type="button"
                        onClick={copyAllEmails}
                        className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white flex items-center gap-1.5 cursor-pointer"
                      >
                        {copiedEmails ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        {copiedEmails ? 'কপি হয়েছে' : 'সব ইমেইল কপি'}
                      </button>
                    )}
                  </div>

                  <div className="space-y-2">
                    {subscribers.map(sub => (
                      <div
                        key={sub.id}
                        className="p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex items-center justify-between text-xs"
                      >
                        <div>
                          <span className="font-semibold text-zinc-800 dark:text-zinc-200">{sub.name}</span>
                          <span className="text-zinc-500 ml-2 font-mono">{sub.email}</span>
                          {sub.studentId && <span className="text-zinc-400 ml-2">ID: {sub.studentId}</span>}
                        </div>
                        <button
                          type="button"
                          onClick={() => handleDeleteSubscriber(sub.id)}
                          className="p-1 text-zinc-400 hover:text-red-500"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* EXPORT TAB */}
              {activeTab === 'export' && (
                <div className="space-y-3">
                  <div>
                    <h3 className="font-bold text-zinc-800 dark:text-zinc-100 text-sm">
                      গিটহাব ব্যাকআপ ও ডাটা এক্সপোর্ট
                    </h3>
                    <p className="text-xs text-zinc-500">
                      আপনার যেকোনো পরিবর্তন স্থায়ীভাবে গিটহাবে পুশ করার জন্য ডাটা কপি বা ডাউনলোড করুন
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={handleCopyExportJson}
                      className="px-4 py-2 text-xs font-semibold rounded-xl bg-amber-500 hover:bg-amber-600 text-black flex items-center gap-1.5 cursor-pointer"
                    >
                      {copiedCode ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      {copiedCode ? 'JSON কপি হয়েছে' : 'সব ডাটা কপি করুন'}
                    </button>
                    <button
                      type="button"
                      onClick={handleDownloadJson}
                      className="px-4 py-2 text-xs font-medium rounded-xl border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5 cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      JSON ডাউনলোড
                    </button>
                  </div>
                </div>
              )}

            </div>
          </div>
        )}

      </div>
    </div>
  );
};
