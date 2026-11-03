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
import { fetchNoticesFromGoogleSheet, sendMaterialToGoogleSheet, sendNoticeToGoogleSheet } from '../../utils/googleSheetsNotices';
import { GOOGLE_APPS_SCRIPT_CODE } from '../../utils/googleAppsScriptTemplate';
import { CalendarConfig, CalendarHolidayItem, CalendarDayStatus } from '../../types/dcuCalendar';
import { saveCachedCalendarConfig, saveCachedHolidays, sendHolidayToGoogleSheet, sendCalendarConfigToGoogleSheet } from '../../utils/dcuCalendarService';


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
  calendarConfig: CalendarConfig;
  setCalendarConfig: React.Dispatch<React.SetStateAction<CalendarConfig>>;
  holidays: CalendarHolidayItem[];
  setHolidays: React.Dispatch<React.SetStateAction<CalendarHolidayItem[]>>;
}

const MONTH_NAMES_BN = [
  'জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন',
  'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'
];

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
  onRefreshGoogleSheet,
  calendarConfig,
  setCalendarConfig,
  holidays,
  setHolidays
}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const [activeTab, setActiveTab] = useState<'ticker_sheet' | 'notices' | 'books' | 'calendar' | 'routine' | 'subscribers' | 'export'>('ticker_sheet');
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedEmails, setCopiedEmails] = useState(false);
  const [copiedScript, setCopiedScript] = useState(false);

  // Calendar Management State
  const [isAddingHoliday, setIsAddingHoliday] = useState(true);
  const [holidayStartDate, setHolidayStartDate] = useState('');
  const [holidayEndDate, setHolidayEndDate] = useState('');
  const [holidayStatus, setHolidayStatus] = useState<CalendarDayStatus>('holiday');
  const [holidayTitle, setHolidayTitle] = useState('');
  const [holidayCategory, setHolidayCategory] = useState<NonNullable<CalendarHolidayItem['category']>>('বিশ্ববিদ্যালয় ছুটি');
  const [holidaySuccessMsg, setHolidaySuccessMsg] = useState<string | null>(null);

  // Multi-Date Interactive Holiday Picker State
  const [multiPickYear, setMultiPickYear] = useState<number>(() => 2026);
  const [multiPickMonth, setMultiPickMonth] = useState<number>(() => 10); // 10 = November
  const [selectedMultiDates, setSelectedMultiDates] = useState<string[]>([]);
  const [multiHolidayTitle, setMultiHolidayTitle] = useState('');
  const [multiHolidayStatus, setMultiHolidayStatus] = useState<CalendarDayStatus>('holiday');
  const [multiHolidayCategory, setMultiHolidayCategory] = useState<NonNullable<CalendarHolidayItem['category']>>('বিশ্ববিদ্যালয় ছুটি');
  const [copiedSheetTsv, setCopiedSheetTsv] = useState(false);

  const toggleMultiDate = (dateStr: string) => {
    setSelectedMultiDates(prev =>
      prev.includes(dateStr) ? prev.filter(d => d !== dateStr) : [...prev, dateStr].sort()
    );
  };

  const handleAddMultiHolidays = () => {
    if (selectedMultiDates.length === 0) {
      alert('অনুগ্রহ করে ক্যালেন্ডার গ্রিড থেকে এক বা একাধিক তারিখ সিলেক্ট করুন!');
      return;
    }
    const fallbackTitle = multiHolidayTitle.trim() || (multiHolidayStatus === 'open' ? 'ক্লাস চালু' : multiHolidayStatus === 'exam' ? 'পরীক্ষা' : 'ছুটি');
    const newItems: CalendarHolidayItem[] = selectedMultiDates.map((dateStr, idx) => ({
      id: `hol-${Date.now()}-${idx}`,
      startDate: dateStr,
      status: multiHolidayStatus,
      title: fallbackTitle,
      category: multiHolidayCategory
    }));

    setHolidays(prev => {
      const selectedSet = new Set(selectedMultiDates);
      const filtered = prev.filter(h => !selectedSet.has(h.startDate));
      const updated = [...newItems, ...filtered];
      saveCachedHolidays(updated);
      return updated;
    });

    if (googleSheetUrl && googleSheetUrl.includes('script.google.com')) {
      newItems.forEach(item => {
        sendHolidayToGoogleSheet(googleSheetUrl, item);
      });
    }

    onRefreshGoogleSheet();
    setHolidaySuccessMsg(`✅ সফলভাবে ${selectedMultiDates.length}টি তারিখের ছুটি যুক্ত হয়েছে!`);
    setSelectedMultiDates([]);
    setTimeout(() => setHolidaySuccessMsg(null), 4000);
  };

  const handleCopySheetTsv = (onlySelected: boolean) => {
    const targetItems = onlySelected
      ? selectedMultiDates.map(d => ({
          startDate: d,
          endDate: d,
          status: multiHolidayStatus,
          title: multiHolidayTitle.trim() || 'ছুটি'
        }))
      : holidays;

    if (targetItems.length === 0) {
      alert('কপি করার জন্য কোনো ছুটির দিন নেই!');
      return;
    }

    const tsv = targetItems
      .map(item => `${item.startDate}\t${item.endDate || item.startDate}\t${item.status === 'open' ? 'খোলা' : item.status === 'exam' ? 'পরীক্ষা' : 'ছুটি'}\t${item.title}`)
      .join('\n');

    navigator.clipboard.writeText(tsv).then(() => {
      setCopiedSheetTsv(true);
      setTimeout(() => setCopiedSheetTsv(false), 2500);
    });
  };


  const handleCopyScript = () => {
    navigator.clipboard.writeText(GOOGLE_APPS_SCRIPT_CODE).then(() => {
      setCopiedScript(true);
      setTimeout(() => setCopiedScript(false), 2500);
    });
  };

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
  const [noticeSuccessMsg, setNoticeSuccessMsg] = useState<string | null>(null);
  const [globalApplyMsg, setGlobalApplyMsg] = useState<string | null>(null);
  const [isApplyingLive, setIsApplyingLive] = useState(false);

  // Form states for adding new book (default to open so user immediately sees the form)
  const [isAddingBook, setIsAddingBook] = useState(true);
  const [newBookCourseCode, setNewBookCourseCode] = useState('PS-101');
  const [newBookTitle, setNewBookTitle] = useState('');
  const [newBookAuthor, setNewBookAuthor] = useState('');
  const [newBookCategory, setNewBookCategory] = useState<PSBookResource['category']>('হ্যান্ডনোট');
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
    if (!newNoticeTitle.trim()) return;

    const notice: PSNotice = {
      id: `notice-${Date.now()}`,
      title: newNoticeTitle.trim(),
      date: new Date().toLocaleDateString('bn-BD', { day: 'numeric', month: 'long', year: 'numeric' }),
      category: newNoticeCategory,
      content: newNoticeContent.trim() || newNoticeTitle.trim(),
      fileUrl: newNoticeFileUrl || undefined,
      pinned: newNoticePinned
    };

    setNotices(prev => {
      const updated = [notice, ...prev];
      localStorage.setItem('dcu_ps_notices_v5', JSON.stringify(updated));
      return updated;
    });

    if (googleSheetUrl && googleSheetUrl.includes('script.google.com')) {
      sendNoticeToGoogleSheet(googleSheetUrl, notice);
    }

    onRefreshGoogleSheet();
    setNoticeSuccessMsg('✅ নোটিশ সফলভাবে মূল সাইটে লাইভ যুক্ত হয়েছে!');
    setTimeout(() => setNoticeSuccessMsg(null), 3500);

    setIsAddingNotice(false);
    setNewNoticeTitle('');
    setNewNoticeContent('');
    setNewNoticeFileUrl('');
    setNewNoticePinned(false);
  };

  const handleDeleteNotice = (id: string) => {
    if (window.confirm('আপনি কি এই নোটিশটি মুছে ফেলতে চান?')) {
      setNotices(prev => {
        const updated = prev.filter(n => n.id !== id);
        localStorage.setItem('dcu_ps_notices_v5', JSON.stringify(updated));
        return updated;
      });
      onRefreshGoogleSheet();
    }
  };

  const handleTogglePinNotice = (id: string) => {
    setNotices(prev => {
      const updated = prev.map(n => (n.id === id ? { ...n, pinned: !n.pinned } : n));
      localStorage.setItem('dcu_ps_notices_v5', JSON.stringify(updated));
      return updated;
    });
    onRefreshGoogleSheet();
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

    setBooks(prev => {
      const updated = [book, ...prev];
      localStorage.setItem('dcu_ps_books_v5', JSON.stringify(updated));
      return updated;
    });

    // Google Apps Script Web App সিঙ্ক
    if (googleSheetUrl && googleSheetUrl.includes('script.google.com')) {
      sendMaterialToGoogleSheet(googleSheetUrl, {
        id: book.id,
        courseCode: book.courseCode,
        courseTitle: book.courseTitle,
        title: book.title,
        author: book.author,
        category: book.category,
        driveUrl: book.driveUrl,
        fileSize: book.fileSize
      });
    }

    onRefreshGoogleSheet();
    setIsAddingBook(false);
    setNewBookTitle('');
    setNewBookAuthor('');
    setNewBookDriveUrl('');
    setNewBookSize('');
  };

  const handleDeleteBook = (id: string) => {
    if (window.confirm('আপনি কি এই বই/রিসোর্সটি মুছে ফেলতে চান?')) {
      setBooks(prev => {
        const updated = prev.filter(b => b.id !== id);
        localStorage.setItem('dcu_ps_books_v5', JSON.stringify(updated));
        return updated;
      });
      onRefreshGoogleSheet();
    }
  };

  const handleDeleteSubscriber = (id: string) => {
    setSubscribers(prev => {
      const updated = prev.filter(s => s.id !== id);
      localStorage.setItem('dcu_ps_subscribers', JSON.stringify(updated));
      return updated;
    });
  };

  const copyAllEmails = () => {
    const emailList = subscribers.map(s => s.email).filter(Boolean).join(', ');
    navigator.clipboard.writeText(emailList);
    setCopiedEmails(true);
    setTimeout(() => setCopiedEmails(false), 2500);
  };

  // Calendar Admin Actions
  const handleToggleOffDay = (dayIndex: number) => {
    setCalendarConfig(prev => {
      const exists = prev.defaultOffDays.includes(dayIndex);
      const updatedDays = exists
        ? prev.defaultOffDays.filter(d => d !== dayIndex)
        : [...prev.defaultOffDays, dayIndex].sort();
      const updated: CalendarConfig = { ...prev, defaultOffDays: updatedDays };
      saveCachedCalendarConfig(updated);
      if (googleSheetUrl && googleSheetUrl.includes('script.google.com')) {
        sendCalendarConfigToGoogleSheet(googleSheetUrl, updated);
      }
      onRefreshGoogleSheet();
      return updated;
    });
  };

  const handleToggleFutureMonths = () => {
    setCalendarConfig(prev => {
      const updated: CalendarConfig = { ...prev, allowFutureMonths: !prev.allowFutureMonths };
      saveCachedCalendarConfig(updated);
      if (googleSheetUrl && googleSheetUrl.includes('script.google.com')) {
        sendCalendarConfigToGoogleSheet(googleSheetUrl, updated);
      }
      onRefreshGoogleSheet();
      return updated;
    });
  };

  const handleAddHoliday = (e: React.FormEvent) => {
    e.preventDefault();
    if (!holidayStartDate) {
      alert('অনুগ্রহ করে ছুটির তারিখ নির্বাচন করুন!');
      return;
    }

    const fallbackTitle = holidayTitle.trim() || (holidayStatus === 'open' ? 'ক্লাস চালু' : holidayStatus === 'exam' ? 'পরীক্ষা' : 'ছুটি');

    const newHoliday: CalendarHolidayItem = {
      id: `hol-${Date.now()}`,
      startDate: holidayStartDate,
      endDate: holidayEndDate ? holidayEndDate : undefined,
      status: holidayStatus,
      title: fallbackTitle,
      category: holidayCategory
    };

    setHolidays(prev => {
      const updated = [newHoliday, ...prev];
      saveCachedHolidays(updated);
      return updated;
    });

    if (googleSheetUrl && googleSheetUrl.includes('script.google.com')) {
      sendHolidayToGoogleSheet(googleSheetUrl, newHoliday);
    }

    onRefreshGoogleSheet();
    setHolidaySuccessMsg('✅ ছুটি সফলভাবে যুক্ত হয়েছে এবং মূল সাইটে লাইভ কার্যকর হয়েছে!');
    setHolidayTitle('');
    setHolidayEndDate('');
    setTimeout(() => setHolidaySuccessMsg(null), 3500);
  };

  const handleDeleteHoliday = (id: string) => {
    if (window.confirm('আপনি কি এই ছুটির এন্ট্রিটি মুছে ফেলতে চান?')) {
      setHolidays(prev => {
        const updated = prev.filter(h => h.id !== id);
        saveCachedHolidays(updated);
        return updated;
      });
      onRefreshGoogleSheet();
    }
  };

  // Global One-Click Apply & Sync to Live Site
  const handleApplyAllChangesLive = async () => {
    setIsApplyingLive(true);
    try {
      saveCachedCalendarConfig(calendarConfig);
      saveCachedHolidays(holidays);
      localStorage.setItem('dcu_ps_notices_v5', JSON.stringify(notices));
      localStorage.setItem('dcu_ps_books_v5', JSON.stringify(books));
      localStorage.setItem('dcu_ps_routine', JSON.stringify(routine));
      localStorage.setItem('dcu_ps_subscribers', JSON.stringify(subscribers));

      if (googleSheetUrl && googleSheetUrl.includes('script.google.com')) {
        sendCalendarConfigToGoogleSheet(googleSheetUrl, calendarConfig);
      }

      await onRefreshGoogleSheet();
      setGlobalApplyMsg('✅ সমস্ত আপডেট মূল ওয়েবসাইটে অবিলম্বে কার্যকর ও সিঙ্ক হয়েছে!');
      setTimeout(() => setGlobalApplyMsg(null), 3500);
    } finally {
      setIsApplyingLive(false);
    }
  };


  const getFullExportJson = () => {
    return JSON.stringify(
      {
        notices,
        books,
        routine,
        subscribers,
        calendarConfig,
        holidays,
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
              <>
                <button
                  type="button"
                  onClick={handleApplyAllChangesLive}
                  disabled={isApplyingLive}
                  className="flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-lg bg-emerald-500 hover:bg-emerald-600 text-white transition cursor-pointer shadow-xs active:scale-95"
                  title="সমস্ত আপডেট সরাসরি মূল ওয়েবসাইটে কার্যকর করুন"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isApplyingLive ? 'animate-spin' : ''}`} />
                  <span>{isApplyingLive ? 'আপডেট হচ্ছে...' : '⚡ সাইটে লাইভ আপডেট'}</span>
                </button>
                <button
                  type="button"
                  onClick={onLogout}
                  className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors cursor-pointer"
                >
                  <LogOut className="w-3 h-3 text-red-400" />
                  লগআউট
                </button>
              </>
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

        {globalApplyMsg && (
          <div className="px-5 py-2.5 bg-emerald-500 text-white text-xs font-bold flex items-center justify-between animate-fade-in shadow-sm">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 shrink-0" />
              <span>{globalApplyMsg}</span>
            </div>
            <button type="button" onClick={() => setGlobalApplyMsg(null)} className="opacity-80 hover:opacity-100">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}


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
                  autoComplete="username"
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
                  autoComplete="current-password"
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
                📢 নোটিশ গুগল শিট
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
                📢 নোটিশ তালিকা ({notices.length})
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
                📚 পিডিএফ ও নোট যোগ ({books.length})
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('calendar')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors shrink-0 cursor-pointer ${
                  activeTab === 'calendar'
                    ? 'bg-amber-500 text-black font-semibold shadow-xs'
                    : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800'
                }`}
              >
                <Calendar className="w-3.5 h-3.5 text-red-500" />
                🗓️ ক্যালেন্ডার ও ছুটি ({holidays.length})
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
              
              {/* GOOGLE SHEETS & WEB APP TAB */}
              {activeTab === 'ticker_sheet' && (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/60">
                    <div className="flex items-center gap-2 mb-2">
                      <FileSpreadsheet className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      <h3 className="font-bold text-zinc-900 dark:text-white text-sm">
                        গুগল শিট ও Apps Script ওয়েব অ্যাপ নোটিশ পোর্টাল
                      </h3>
                    </div>
                    <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                      সিআর বা এডমিন সরাসরি ব্রাউজার দিয়ে একটি ওয়েব অ্যাপ ওপেন করে যেকোনো সময় নোটিশ লিখে সেভ করলেই তা স্বয়ংক্রিয়ভাবে শিক্ষার্থীদের কাছে ব্র্যান্ডেড ইমেইল পৌঁছে দেবে, ওয়েবসাইট লাইভ আপডেট হবে এবং সেখান থেকেই অপ্রয়োজনীয় নোটিশ মুছে ফেলা যাবে।
                    </p>
                  </div>

                  {/* 1-Click Code Copy Box */}
                  <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-500/5 dark:bg-amber-950/20 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xs font-bold text-zinc-900 dark:text-white block">
                          📜 গুগল অ্যাপস স্ক্রিপ্ট (Web App Script)
                        </span>
                        <span className="text-[11px] text-zinc-500">
                          ফাঁকা গুগল শিটে এই কোডটি দিলেই নোটিশ ড্যাশবোর্ড, অটো-ফরম্যাট ও ইমেইল প্রস্তুত হয়ে যাবে
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={handleCopyScript}
                        className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-black font-bold text-xs flex items-center gap-1.5 transition cursor-pointer shrink-0"
                      >
                        {copiedScript ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>কপি হয়েছে!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Apps Script কোড কপি</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  <form onSubmit={handleSaveSheetUrl} className="space-y-3">
                    <div>
                      <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                        গুগল ওয়েব অ্যাপ লিংক (বা গুগল শিট URL)
                      </label>
                      <div className="relative">
                        <input
                          type="url"
                          value={tempSheetUrl}
                          onChange={e => setTempSheetUrl(e.target.value)}
                          placeholder="https://script.google.com/macros/s/AKfycb.../exec"
                          className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white font-mono"
                        />
                        <LinkIcon className="w-4 h-4 text-zinc-400 absolute left-3 top-2.5" />
                      </div>
                      <p className="text-[11px] text-zinc-500 mt-1">
                        Apps Script থেকে পাওয়া <strong>Web app URL</strong> অথবা সাধারণ গুগল শিটের ভিউ লিংক এখানে বসিয়ে সেভ করুন।
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

                  <div className="p-4 rounded-xl bg-zinc-100/70 dark:bg-zinc-800/40 text-xs text-zinc-600 dark:text-zinc-400 space-y-2.5">
                    <p className="font-semibold text-zinc-800 dark:text-zinc-200">
                      🚀 ওয়েব অ্যাপ সেটআপ করার ৩টি সহজ ধাপ:
                    </p>
                    <p>১. আপনার যেকোনো ফাঁকা গুগল শিট ওপেন করে উপরের মেনু থেকে <strong>Extensions ➜ Apps Script</strong> এ ক্লিক করুন।</p>
                    <p>২. পূর্বের সব লেখা মুছে উপরের <strong>Apps Script কোড কপি</strong> বাটনে ক্লিক করে পুরো কোডটি পেস্ট করুন এবং 💾 Save আইকনে চাপ দিন।</p>
                    <p>৩. এরপর উপরে ডানদিকে <strong>Deploy ➜ New deployment</strong> ➜ গিয়ার আইকন থেকে <strong>Web app</strong> সিলেক্ট করে <em>Execute as: Me</em> এবং <em>Who has access: Anyone</em> দিয়ে Deploy করুন। এরপর পাওয়া লিংকটি এখানে বসিয়ে সেভ করুন।</p>

                    <div className="mt-3 p-3 rounded-lg border border-amber-500/30 bg-amber-50/50 dark:bg-amber-950/20 text-amber-900 dark:text-amber-200 space-y-1">
                      <p className="font-bold flex items-center gap-1.5 text-xs text-amber-800 dark:text-amber-300">
                        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        <span>⚠️ জরুরি: শিটে ডাটা জমা না হলে বা অন্য ব্রাউজারে আপডেট না দেখালে:</span>
                      </p>
                      <p className="text-[11px] leading-relaxed">
                        গুগল অ্যাপস্ক্রিপ্ট এ কোড আপডেট করার পর শুধু Save করলে লাইভ লিংকে নতুন কোড কার্যকর হয় না। নতুন কোড কার্যকর করতে উপরে <strong>Deploy ➜ Manage deployments ➜ Edit (পেন্সিল আইকন) ➜ Version ড্রপডাউনে 'New version' সিলেক্ট করুন ➜ Deploy</strong> বাটনে ক্লিক করুন। তাহলেই সব আপডেট তাৎক্ষণিক শিটে সেভ হবে এবং সবার ফোনে চলে যাবে!
                      </p>
                    </div>
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

                  {noticeSuccessMsg && (
                    <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-semibold flex items-center gap-2">
                      <Check className="w-4 h-4 shrink-0" />
                      <span>{noticeSuccessMsg}</span>
                    </div>
                  )}

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
                            কোর্স *
                          </label>
                          <select
                            value={newBookCourseCode}
                            onChange={e => setNewBookCourseCode(e.target.value)}
                            className="w-full px-3 py-1.5 text-xs rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white"
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
                            নোট বা ফাইলের নাম *
                          </label>
                          <input
                            type="text"
                            value={newBookTitle}
                            onChange={e => setNewBookTitle(e.target.value)}
                            placeholder="যেমন: প্লেটোর আদর্শ রাষ্ট্র হ্যান্ডনোট"
                            required
                            className="w-full px-3 py-1.5 text-xs rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                            ক্যাটাগরি
                          </label>
                          <select
                            value={newBookCategory}
                            onChange={e => setNewBookCategory(e.target.value as any)}
                            className="w-full px-3 py-1.5 text-xs rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white"
                          >
                            <option value="হ্যান্ডনোট">হ্যান্ডনোট</option>
                            <option value="লেকচার শিট">লেকচার শিট</option>
                            <option value="মূল বই">মূল বই</option>
                            <option value="সিলেবাস ও প্রশ্ন">সিলেবাস ও প্রশ্ন</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                            সংগ্রাহক / লেখক
                          </label>
                          <input
                            type="text"
                            value={newBookAuthor}
                            onChange={e => setNewBookAuthor(e.target.value)}
                            placeholder="যেমন: হিমেল (CR)"
                            className="w-full px-3 py-1.5 text-xs rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                            ফাইল সাইজ (ঐচ্ছিক)
                          </label>
                          <input
                            type="text"
                            value={newBookSize}
                            onChange={e => setNewBookSize(e.target.value)}
                            placeholder="যেমন: 3.5 MB"
                            className="w-full px-3 py-1.5 text-xs rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white"
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
                          placeholder="https://drive.google.com/file/d/..."
                          required
                          className="w-full px-3 py-1.5 text-xs rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white"
                        />
                      </div>

                      <div className="flex items-center gap-2 pt-1">
                        <button
                          type="submit"
                          className="px-4 py-2 text-xs font-semibold rounded-xl bg-amber-500 hover:bg-amber-600 text-black cursor-pointer shadow-xs"
                        >
                          সংরক্ষণ করুন
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsAddingBook(false)}
                          className="px-3 py-2 text-xs font-semibold rounded-xl bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-300 cursor-pointer"
                        >
                          বাতিল
                        </button>
                      </div>
                    </form>
                  )}

                  {books.length === 0 ? (
                    <div className="p-6 text-center rounded-xl border border-dashed border-zinc-300 dark:border-zinc-800 text-zinc-500 text-xs">
                      আপাতত কোনো বই বা শিট যুক্ত করা নেই। উপরে '+ বই বা শিট যোগ' বাটনে ক্লিক করে নতুন লিংক যুক্ত করুন।
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {books.map(book => (
                        <div
                          key={book.id}
                          className="p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex items-center justify-between text-xs"
                        >
                          <div className="flex-1 min-w-0 pr-2">
                            <div className="flex items-center gap-2 mb-0.5">
                              <span className="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400">
                                {book.courseCode}
                              </span>
                              <span className="text-[10px] text-zinc-400">
                                {book.category}
                              </span>
                              {book.fileSize && (
                                <span className="text-[10px] text-zinc-400 font-mono">
                                  {book.fileSize}
                                </span>
                              )}
                            </div>
                            <h4 className="font-semibold text-zinc-900 dark:text-white truncate">
                              {book.title}
                            </h4>
                            <p className="text-[11px] text-zinc-500 truncate mt-0.5">
                              সংগ্রাহক: {book.author || 'বিভাগীয় সংগ্রহ'}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleDeleteBook(book.id)}
                            className="p-1.5 text-zinc-400 hover:text-red-500 transition cursor-pointer shrink-0"
                            title="মুছে ফেলুন"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* CALENDAR MANAGEMENT TAB */}
              {activeTab === 'calendar' && (
                <div className="space-y-5">
                  {/* Tab Title Banner */}
                  <div className="p-4 rounded-xl border border-red-500/20 bg-red-50/40 dark:bg-red-950/20">
                    <div className="flex items-center gap-2 mb-1.5">
                      <Calendar className="w-4 h-4 text-red-600 dark:text-red-400" />
                      <h3 className="font-bold text-zinc-900 dark:text-white text-sm">
                        একাডেমিক ক্যালেন্ডার ও ছুটির দিন ব্যবস্থাপনা
                      </h3>
                    </div>
                    <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                      এখানে সাপ্তাহিক বন্ধের দিন (যেমন: শুক্র, শনি ও বুধ), দীর্ঘমেয়াদী ছুটির রেঞ্জ (বাল্ক ডেট রেঞ্জ যেমন: ২০ নভেম্বর থেকে ২৮ নভেম্বর), এবং পরীক্ষার তারিখ নিয়ন্ত্রণ করা যায়।
                    </p>
                  </div>

                  {/* 1. WEEKLY DEFAULT OFF-DAYS */}
                  <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-bold text-xs text-zinc-900 dark:text-white flex items-center gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block" />
                          সাপ্তাহিক ডিফল্ট বন্ধের বারসমূহ (অটোমেটিক লাল দাগ)
                        </h4>
                        <p className="text-[11px] text-zinc-500 mt-0.5">
                          পরের সেমিস্টারে বুধ বা শনিবারে ক্লাস হলে এখান থেকে টিক তুলে দিলেই তা নিয়মিত ক্লাসের দিন হয়ে যাবে।
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2 pt-1">
                      {[
                        { index: 0, label: 'রবিবার' },
                        { index: 1, label: 'সোমবার' },
                        { index: 2, label: 'মঙ্গলবার' },
                        { index: 3, label: 'বুধবার' },
                        { index: 4, label: 'বৃহস্পতিবার' },
                        { index: 5, label: 'শুক্রবার' },
                        { index: 6, label: 'শনিবার' }
                      ].map(day => {
                        const isOff = calendarConfig.defaultOffDays.includes(day.index);
                        return (
                          <button
                            key={day.index}
                            type="button"
                            onClick={() => handleToggleOffDay(day.index)}
                            className={`p-2.5 rounded-xl border text-center transition cursor-pointer flex flex-col items-center justify-center gap-1 ${
                              isOff
                                ? 'border-red-500/50 bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 font-bold'
                                : 'border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/60 text-zinc-600 dark:text-zinc-400 font-medium hover:border-zinc-300'
                            }`}
                          >
                            <span className="text-xs">{day.label}</span>
                            <span className={`text-[10px] px-1.5 py-0.5 rounded-md ${
                              isOff ? 'bg-red-500 text-white font-bold' : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold'
                            }`}>
                              {isOff ? 'সাপ্তাহিক ছুটি' : 'ক্লাস চালু'}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* 2. FUTURE MONTHS TOGGLE */}
                  <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex items-center justify-between gap-3">
                    <div>
                      <h4 className="font-bold text-xs text-zinc-900 dark:text-white">
                        ভবিষ্যতের মাসসমূহে যাওয়ার অনুমতি
                      </h4>
                      <p className="text-[11px] text-zinc-500 mt-0.5">
                        যদি শুধু চলতি মাসের ছুটির তথ্য আপডেট করা থাকে, তাহলে এটি বন্ধ রাখুন যাতে শিক্ষার্থীরা অনির্ধারিত ভবিষ্যত মাসে যেতে না পারে।
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleToggleFutureMonths}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold transition shrink-0 cursor-pointer ${
                        calendarConfig.allowFutureMonths
                          ? 'bg-emerald-500 hover:bg-emerald-600 text-white'
                          : 'bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 text-zinc-700 dark:text-zinc-300'
                      }`}
                    >
                      {calendarConfig.allowFutureMonths ? 'অনুমোদিত (Allowed)' : 'লক করা (Locked)'}
                    </button>
                  </div>

                  {/* 3. INTERACTIVE MULTI-DATE MINI-CALENDAR GRID */}
                  <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-100 dark:border-zinc-800 pb-3">
                      <div>
                        <h4 className="font-bold text-xs text-zinc-900 dark:text-white flex items-center gap-1.5">
                          <Calendar className="w-4 h-4 text-red-500" />
                          ক্যালেন্ডার গ্রিড থেকে এলোমেলো একাধিক দিন সিলেক্ট করে এক ক্লিকে ছুটি দিন
                        </h4>
                        <p className="text-[11px] text-zinc-500 mt-0.5">
                          যেমন: ৩, ৯, ১০, ১২, ২৬ তারিখে ক্লিক করে একসাথেই সিলেক্ট করুন এবং নিচের বাটনে চাপ দিন।
                        </p>
                      </div>

                      {/* Month & Year Controls */}
                      <div className="flex items-center gap-1.5 shrink-0">
                        <select
                          value={multiPickMonth}
                          onChange={e => setMultiPickMonth(Number(e.target.value))}
                          className="px-2 py-1 text-xs rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white font-medium"
                        >
                          {MONTH_NAMES_BN.map((name, idx) => (
                            <option key={idx} value={idx}>{name}</option>
                          ))}
                        </select>

                        <select
                          value={multiPickYear}
                          onChange={e => setMultiPickYear(Number(e.target.value))}
                          className="px-2 py-1 text-xs rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-white font-medium"
                        >
                          <option value={2025}>২০২৫</option>
                          <option value={2026}>২০২৬</option>
                          <option value={2027}>২০২৭</option>
                        </select>
                      </div>
                    </div>

                    {holidaySuccessMsg && (
                      <div className="p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-semibold flex items-center gap-2">
                        <Check className="w-4 h-4 shrink-0" />
                        <span>{holidaySuccessMsg}</span>
                      </div>
                    )}

                    {/* Weekday Headers */}
                    <div className="grid grid-cols-7 gap-1 text-center font-bold text-[11px] text-zinc-500 dark:text-zinc-400">
                      {['রবি', 'সোম', 'মঙ্গল', 'বুধ', 'বৃহঃ', 'শুক্র', 'শনি'].map((d, i) => (
                        <div
                          key={d}
                          className={`py-1 rounded ${
                            calendarConfig.defaultOffDays.includes(i) ? 'text-red-500 font-bold bg-red-50/50 dark:bg-red-950/20' : ''
                          }`}
                        >
                          {d}
                        </div>
                      ))}
                    </div>

                    {/* Days Grid */}
                    {(() => {
                      const daysInMonth = new Date(multiPickYear, multiPickMonth + 1, 0).getDate();
                      const firstDay = new Date(multiPickYear, multiPickMonth, 1).getDay();
                      const emptyCells = Array.from({ length: firstDay });
                      const dayCells = Array.from({ length: daysInMonth }, (_, i) => i + 1);

                      return (
                        <div className="grid grid-cols-7 gap-1.5">
                          {emptyCells.map((_, i) => (
                            <div key={`empty-${i}`} className="h-11 rounded-lg bg-zinc-50/40 dark:bg-zinc-800/20 opacity-30" />
                          ))}

                          {dayCells.map(dayNum => {
                            const dateStr = `${multiPickYear}-${String(multiPickMonth + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
                            const isSelected = selectedMultiDates.includes(dateStr);
                            const dayOfWeek = (firstDay + dayNum - 1) % 7;
                            const isDefaultOff = calendarConfig.defaultOffDays.includes(dayOfWeek);
                            const alreadyHoliday = holidays.find(h => {
                              const s = h.startDate.trim();
                              const e = h.endDate ? h.endDate.trim() : s;
                              return dateStr >= s && dateStr <= e;
                            });

                            return (
                              <button
                                key={dateStr}
                                type="button"
                                onClick={() => toggleMultiDate(dateStr)}
                                className={`h-11 rounded-xl p-1 flex flex-col items-center justify-between transition-all cursor-pointer border text-xs relative ${
                                  isSelected
                                    ? 'bg-red-600 text-white font-bold border-red-500 shadow-md ring-2 ring-red-400 scale-[1.03]'
                                    : alreadyHoliday
                                    ? 'bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 border-red-300 dark:border-red-800 font-semibold'
                                    : isDefaultOff
                                    ? 'bg-rose-50/60 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 border-rose-200/50 dark:border-rose-900/30 font-medium'
                                    : 'bg-zinc-50 dark:bg-zinc-800/60 text-zinc-800 dark:text-zinc-200 border-zinc-200 dark:border-zinc-700 hover:border-red-400'
                                }`}
                              >
                                <div className="w-full flex items-center justify-between text-[11px] leading-none px-0.5">
                                  <span className="font-bold">{dayNum}</span>
                                  {isSelected && <span className="text-[10px]">✓</span>}
                                </div>
                                <span className={`text-[9px] truncate max-w-full px-1 rounded-sm leading-tight ${
                                  isSelected
                                    ? 'bg-white/20 text-white'
                                    : alreadyHoliday
                                    ? 'text-red-600 dark:text-red-400 font-bold'
                                    : isDefaultOff
                                    ? 'text-rose-500/80 text-[8px]'
                                    : 'text-zinc-400 text-[8px]'
                                }`}>
                                  {isSelected
                                    ? 'সিলেক্টেড'
                                    : alreadyHoliday
                                    ? (alreadyHoliday.status === 'exam' ? 'পরীক্ষা' : 'ছুটি')
                                    : isDefaultOff
                                    ? 'অফ ডে'
                                    : 'ক্লাস'}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      );
                    })()}

                    {/* Bulk Selection Action Bar */}
                    <div className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="text-xs">
                          {selectedMultiDates.length > 0 ? (
                            <span className="font-semibold text-zinc-900 dark:text-white">
                              📌 নির্বাচিত {selectedMultiDates.length}টি তারিখ:{' '}
                              <span className="text-red-600 dark:text-red-400 font-bold">
                                {selectedMultiDates.map(d => d.split('-')[2].replace(/^0/, '')).join(', ')} {MONTH_NAMES_BN[multiPickMonth]}
                              </span>
                            </span>
                          ) : (
                            <span className="text-zinc-500 text-[11px]">
                              👉 উপরের ক্যালেন্ডার থেকে যেকোনো এলোমেলো দিনগুলোতে (যেমন: ৩, ৯, ১০, ১২, ২৬) ক্লিক করুন।
                            </span>
                          )}
                        </div>

                        {selectedMultiDates.length > 0 && (
                          <button
                            type="button"
                            onClick={() => setSelectedMultiDates([])}
                            className="text-[11px] text-zinc-500 hover:text-red-500 underline cursor-pointer shrink-0"
                          >
                            সিলেকশন মুছুন
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
                        <div className="sm:col-span-2">
                          <label className="block text-[11px] font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                            ছুটি বা দিবসের নাম (ঐচ্ছিক — খালি রাখলে ডিফল্ট 'ছুটি' প্রদর্শিত হবে)
                          </label>
                          <input
                            type="text"
                            value={multiHolidayTitle}
                            onChange={e => setMultiHolidayTitle(e.target.value)}
                            placeholder="যেমন: শীতকালীন ছুটি, বিশেষ দিবস (না লিখলে শুধু 'ছুটি')"
                            className="w-full px-3 py-1.5 text-xs rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                            স্ট্যাটাস
                          </label>
                          <select
                            value={multiHolidayStatus}
                            onChange={e => setMultiHolidayStatus(e.target.value as CalendarDayStatus)}
                            className="w-full px-3 py-1.5 text-xs rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white"
                          >
                            <option value="holiday">ছুটি (লাল দাগ)</option>
                            <option value="exam">পরীক্ষা (সোনালী দাগ)</option>
                            <option value="open">বিশেষ ক্লাস খোলা (সবুজ)</option>
                          </select>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 pt-1">
                        <button
                          type="button"
                          onClick={handleAddMultiHolidays}
                          disabled={selectedMultiDates.length === 0}
                          className={`px-4 py-2 text-xs font-bold rounded-xl transition shadow-xs cursor-pointer flex items-center gap-1.5 ${
                            selectedMultiDates.length > 0
                              ? 'bg-red-600 hover:bg-red-700 text-white'
                              : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-400 cursor-not-allowed'
                          }`}
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>নির্বাচিত {selectedMultiDates.length}টি তারিখ ক্যালেন্ডারে কার্যকর করুন</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleCopySheetTsv(true)}
                          disabled={selectedMultiDates.length === 0}
                          className="px-3 py-2 text-xs font-semibold rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition cursor-pointer flex items-center gap-1.5"
                        >
                          {copiedSheetTsv ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-500" />
                              <span>কপি হয়েছে!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5 text-zinc-500" />
                              <span>গুগল শিটে পেস্ট করতে কপি (TSV)</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Continuous Date Range Option (Collapsible) */}
                    <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200 flex items-center gap-1.5">
                          <span>📅 একটানা দীর্ঘ ছুটির রেঞ্জ যোগ করুন (যেমন: ২০ থেকে ২৮ নভেম্বর)</span>
                        </span>
                        <button
                          type="button"
                          onClick={() => setIsAddingHoliday(!isAddingHoliday)}
                          className="text-xs font-semibold text-amber-600 dark:text-amber-400 hover:underline cursor-pointer"
                        >
                          {isAddingHoliday ? 'লুকান' : '+ রেঞ্জ ফর্ম খুলুন'}
                        </button>
                      </div>

                      {isAddingHoliday && (
                        <form onSubmit={handleAddHoliday} className="space-y-3 pt-3">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                                ছুটির শুরু তারিখ *
                              </label>
                              <input
                                type="date"
                                required
                                value={holidayStartDate}
                                onChange={e => setHolidayStartDate(e.target.value)}
                                className="w-full px-3 py-1.5 text-xs rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                                ছুটির শেষ তারিখ (একটানা রেঞ্জের জন্য)
                              </label>
                              <input
                                type="date"
                                value={holidayEndDate}
                                min={holidayStartDate}
                                onChange={e => setHolidayEndDate(e.target.value)}
                                placeholder="১ দিনের হলে খালি রাখুন"
                                className="w-full px-3 py-1.5 text-xs rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                                ছুটির কারণ / বিবরণ (ঐচ্ছিক — খালি রাখলে 'ছুটি')
                              </label>
                              <input
                                type="text"
                                value={holidayTitle}
                                onChange={e => setHolidayTitle(e.target.value)}
                                placeholder="যেমন: শীতকালীন অবকাশ (খালি রাখলে 'ছুটি')"
                                className="w-full px-3 py-1.5 text-xs rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white"
                              />
                            </div>

                            <div>
                              <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                                স্ট্যাটাস
                              </label>
                              <select
                                value={holidayStatus}
                                onChange={e => setHolidayStatus(e.target.value as CalendarDayStatus)}
                                className="w-full px-3 py-1.5 text-xs rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white"
                              >
                                <option value="holiday">ছুটি (লাল দাগ)</option>
                                <option value="exam">পরীক্ষা (সোনালী দাগ)</option>
                                <option value="open">বিশেষ ক্লাস (সবুজ)</option>
                              </select>
                            </div>
                          </div>

                          <div className="pt-1">
                            <button
                              type="submit"
                              className="px-4 py-2 text-xs font-bold rounded-xl bg-red-600 hover:bg-red-700 text-white cursor-pointer shadow-xs transition"
                            >
                              + রেঞ্জের ছুটি ক্যালেন্ডারে যুক্ত করুন
                            </button>
                          </div>
                        </form>
                      )}
                    </div>

                    {/* Direct Google Sheet Paste Callout */}
                    <div className="p-3.5 rounded-xl border border-emerald-500/20 bg-emerald-50/40 dark:bg-emerald-950/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                      <div>
                        <span className="font-bold text-emerald-800 dark:text-emerald-300 block mb-0.5">
                          💡 সরাসরি গুগল শিটের 'Calendar' ট্যাবে এক ক্লিকে পেস্ট করতে চান?
                        </span>
                        <p className="text-[11px] text-zinc-600 dark:text-zinc-400">
                          নিচের বাটনে ক্লিক করে কপি করুন এবং আপনার গুগল শিটের 'Calendar' ট্যাবে গিয়ে <strong>Cell A2</strong> তে মাউস রেখে Ctrl+V (বা Paste) দিন। মুহূর্তেই সবার জন্য লাইভ হয়ে যাবে!
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleCopySheetTsv(false)}
                        className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer shrink-0"
                      >
                        {copiedSheetTsv ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>কপি সম্পন্ন!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>সব ছুটির ডাটা শিটের জন্য কপি</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* 4. EXISTING HOLIDAYS LIST */}
                  <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-xs text-zinc-900 dark:text-white flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                        নির্ধারিত ছুটির এন্ট্রি তালিকা ({holidays.length}টি)
                      </h4>
                      <span className="text-[10px] text-zinc-500">
                        সরাসরি ক্যালেন্ডারে প্রদর্শিত হচ্ছে
                      </span>
                    </div>

                    {holidays.length === 0 ? (
                      <p className="text-xs text-zinc-500 py-3 text-center">
                        আপাতত কোনো বিশেষ ছুটির দিন বা রেঞ্জ যুক্ত করা নেই।
                      </p>
                    ) : (
                      <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                        {holidays.map(item => (
                          <div
                            key={item.id}
                            className="p-2.5 rounded-xl border border-zinc-100 dark:border-zinc-800/80 bg-zinc-50 dark:bg-zinc-800/40 flex items-center justify-between gap-3 text-xs"
                          >
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                                <span className={`px-2 py-0.5 rounded-md font-bold text-[10px] ${
                                  item.status === 'holiday'
                                    ? 'bg-red-500/15 text-red-700 dark:text-red-300 border border-red-500/20'
                                    : item.status === 'exam'
                                    ? 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border border-amber-500/20'
                                    : 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300'
                                }`}>
                                  {item.status === 'holiday' ? 'ছুটি' : item.status === 'exam' ? 'পরীক্ষা' : 'খোলা'}
                                </span>
                                <span className="font-mono text-zinc-500 text-[11px]">
                                  {item.startDate} {item.endDate ? `থেকে ${item.endDate}` : ''}
                                </span>
                                {item.category && (
                                  <span className="text-[10px] text-zinc-400">
                                    • {item.category}
                                  </span>
                                )}
                              </div>
                              <p className="font-semibold text-zinc-900 dark:text-zinc-100 truncate">
                                {item.title}
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleDeleteHoliday(item.id)}
                              className="p-1.5 text-zinc-400 hover:text-red-500 transition cursor-pointer shrink-0"
                              title="ছুটি মুছে ফেলুন"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* 5. BLANK GOOGLE SHEET AUTO-SETUP BANNER */}
                  <div className="p-4 rounded-xl border border-amber-500/20 bg-amber-50/30 dark:bg-amber-950/20 flex items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5">
                        <FileSpreadsheet className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                        <h4 className="font-bold text-xs text-zinc-900 dark:text-white">
                          ব্লাঙ্ক গুগল শিট অটোমেটিক সেটআপ
                        </h4>
                      </div>
                      <p className="text-[11px] text-zinc-600 dark:text-zinc-400 leading-relaxed">
                        আপনার গুগল শিট সম্পূর্ণ ফাঁকা থাকলেও কোড স্বয়ংক্রিয়ভাবে <code className="px-1 py-0.5 bg-black/10 dark:bg-white/10 rounded font-mono text-[10px]">Calendar</code> শিট ও প্রয়োজনীয় কলাম তৈরি করে নিবে। কোনো ম্যানুয়াল সেটিংস লাগবে না।
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleCopyScript}
                      className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-black font-bold text-xs shrink-0 cursor-pointer transition flex items-center gap-1"
                    >
                      {copiedScript ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedScript ? 'কপি হয়েছে' : 'Apps Script কোড'}</span>
                    </button>
                  </div>
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
