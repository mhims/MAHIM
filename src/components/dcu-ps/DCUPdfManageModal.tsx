import React, { useState, useEffect } from 'react';
import {
  X,
  Lock,
  Plus,
  Trash2,
  BookOpen,
  FileSpreadsheet,
  Check,
  AlertCircle,
  ExternalLink,
  Link as LinkIcon,
  Copy,
  RefreshCw,
  FileText,
  KeyRound,
  ShieldCheck,
  FolderOpen
} from 'lucide-react';
import { PSBookResource, PSCourse } from '../../data/dcuPoliticalScienceData';
import { fetchMaterialsFromSource, sendMaterialToGoogleSheet } from '../../utils/googleSheetsNotices';

interface DCUPdfManageModalProps {
  isOpen: boolean;
  onClose: () => void;
  isAuthenticated: boolean;
  onLogin: (u: string, p: string) => boolean;
  onLogout: () => void;
  books: PSBookResource[];
  setBooks: React.Dispatch<React.SetStateAction<PSBookResource[]>>;
  courses: PSCourse[];
  pdfSheetUrl: string;
  setPdfSheetUrl: (url: string) => void;
  onRefreshMaterials: () => Promise<void>;
}

// Standalone lightweight Google Apps Script code for ONLY PDF materials
export const GOOGLE_APPS_SCRIPT_PDF_ONLY_CODE = `/**
 * =========================================================================
 * ঢাকা সেন্ট্রাল ইউনিভার্সিটি - রাষ্ট্রবিজ্ঞান বিভাগ
 * শুধুমাত্র পিডিএফ নোট ও স্টাডি মেটেরিয়ালের জন্য গুগল অ্যাপস স্ক্রিপ্ট
 * Dedicated for: mahims.com/ps
 * =========================================================================
 */

function doGet(e) {
  autoSetupPdfSheet();
  var action = (e && e.parameter && e.parameter.action) ? e.parameter.action : '';

  // ১. নতুন মেটেরিয়াল সেভ করা
  if (action === 'addMaterial') {
    var p = e.parameter;
    var res = addMaterialRow(p);
    return ContentService
      .createTextOutput(JSON.stringify(res))
      .setMimeType(ContentService.MimeType.JSON);
  }

  // ২. মেটেরিয়াল তালিকা রিটার্ন করা
  var list = getPdfMaterialsList();
  return ContentService
    .createTextOutput(JSON.stringify(list))
    .setMimeType(ContentService.MimeType.JSON);
}

function autoSetupPdfSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('Materials') || ss.getSheets()[0];
  if (sheet.getLastRow() === 0) {
    sheet.appendRow([
      'Course Code',
      'Title',
      'Category',
      'Drive Link',
      'Author',
      'Size',
      'Timestamp'
    ]);
    sheet.getRange(1, 1, 1, 7).setBackground('#d97706').setFontColor('#ffffff').setFontWeight('bold');
  }
}

function getPdfMaterialsList() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('Materials') || ss.getSheets()[0];
  var data = sheet.getDataRange().getValues();
  if (data.length <= 1) return [];

  var list = [];
  for (var i = 1; i < data.length; i++) {
    var row = data[i];
    var code = (row[0] || '').toString().trim();
    var title = (row[1] || '').toString().trim();
    var cat = (row[2] || 'হ্যান্ডনোট').toString().trim();
    var link = (row[3] || '').toString().trim();
    var author = (row[4] || 'বিভাগীয় সংগ্রহ').toString().trim();
    var size = (row[5] || '').toString().trim();

    if (title || link) {
      list.push({
        id: 'pdf-' + i + '-' + new Date().getTime(),
        courseCode: code || 'PS-101',
        title: title || 'নোট',
        category: cat,
        driveUrl: link,
        author: author,
        fileSize: size
      });
    }
  }
  return list.reverse();
}

function addMaterialRow(p) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName('Materials') || ss.getSheets()[0];
    sheet.appendRow([
      p.courseCode || 'PS-101',
      p.title || 'নোট',
      p.category || 'হ্যান্ডনোট',
      p.driveUrl || '',
      p.author || 'সিআর / বিভাগীয় সংগ্রহ',
      p.fileSize || '',
      new Date().toISOString()
    ]);
    return { success: true, message: 'নোট যুক্ত হয়েছে' };
  } catch (err) {
    return { success: false, error: err.toString() };
  }
}`;

export const DCUPdfManageModal: React.FC<DCUPdfManageModalProps> = ({
  isOpen,
  onClose,
  isAuthenticated,
  onLogin,
  onLogout,
  books,
  setBooks,
  courses,
  pdfSheetUrl,
  setPdfSheetUrl,
  onRefreshMaterials
}) => {
  // Login credentials state
  const [username, setUsername] = useState('dcudcps');
  const [password, setPassword] = useState('@@Dcudcps11223300@@');
  const [loginError, setLoginError] = useState('');
  const [showPasswordHint, setShowPasswordHint] = useState(false);

  // Tabs inside modal: 'add' (form) | 'sheet' (google sheet setup) | 'manage' (list & delete)
  const [activeTab, setActiveTab] = useState<'add' | 'sheet' | 'manage'>('add');

  // Form states for adding new PDF
  const [courseCode, setCourseCode] = useState('PS-101');
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [category, setCategory] = useState<PSBookResource['category']>('হ্যান্ডনোট');
  const [driveUrl, setDriveUrl] = useState('');
  const [fileSize, setFileSize] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);

  // Google Sheet Sync state
  const [tempSheetUrl, setTempSheetUrl] = useState(pdfSheetUrl);
  const [syncStatus, setSyncStatus] = useState<{ loading: boolean; message: string; error?: boolean } | null>(null);
  const [copiedScript, setCopiedScript] = useState(false);

  useEffect(() => {
    setTempSheetUrl(pdfSheetUrl);
  }, [pdfSheetUrl]);

  if (!isOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const ok = onLogin(username, password);
    if (!ok) {
      setLoginError('ইউজার নেম বা পাসওয়ার্ড সঠিক নয়!');
    } else {
      setLoginError('');
      setActiveTab('add');
    }
  };

  const handleQuickLoginFill = () => {
    setUsername('dcudcps');
    setPassword('@@Dcudcps11223300@@');
    const ok = onLogin('dcudcps', '@@Dcudcps11223300@@');
    if (ok) {
      setLoginError('');
      setActiveTab('add');
    }
  };

  const handleAddMaterialSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !driveUrl.trim()) {
      alert('দয়া করে নোটের শিরোনাম এবং গুগল ড্রাইভ/পিডিএফ লিংক দিন!');
      return;
    }

    setIsSubmitting(true);
    setSubmitSuccess(null);

    const matchedCourse = courses.find(c => c.code === courseCode);
    const newBook: PSBookResource = {
      id: `mat-${Date.now()}`,
      courseCode: courseCode,
      courseTitle: matchedCourse ? matchedCourse.titleBn : undefined,
      title: title.trim(),
      author: author.trim() || 'বিভাগীয় সংগ্রহ',
      category: category,
      driveUrl: driveUrl.trim(),
      fileSize: fileSize.trim() || undefined
    };

    // Update state & localStorage
    setBooks(prev => {
      const updated = [newBook, ...prev];
      localStorage.setItem('dcu_ps_custom_books', JSON.stringify(updated));
      return updated;
    });

    // If PDF Google Sheet is connected, post it
    if (pdfSheetUrl && pdfSheetUrl.includes('script.google.com')) {
      try {
        await sendMaterialToGoogleSheet(pdfSheetUrl, {
          id: newBook.id,
          courseCode: newBook.courseCode,
          courseTitle: newBook.courseTitle,
          title: newBook.title,
          author: newBook.author,
          category: newBook.category,
          driveUrl: newBook.driveUrl,
          fileSize: newBook.fileSize
        });
      } catch (err) {
        console.warn('Could not post to Google Sheet:', err);
      }
    }

    setIsSubmitting(false);
    setSubmitSuccess('নোট সফলভাবে সাইটে যুক্ত হয়েছে!');
    setTitle('');
    setAuthor('');
    setDriveUrl('');
    setFileSize('');

    setTimeout(() => {
      setSubmitSuccess(null);
    }, 4000);
  };

  const handleDeleteBook = (id: string) => {
    if (confirm('আপনি কি এই নোটটি মুছে ফেলতে চান?')) {
      setBooks(prev => {
        const updated = prev.filter(b => b.id !== id);
        localStorage.setItem('dcu_ps_custom_books', JSON.stringify(updated));
        return updated;
      });
    }
  };

  const handleSaveSheetUrl = async (e: React.FormEvent) => {
    e.preventDefault();
    setSyncStatus({ loading: true, message: 'পিডিএফ শিট যাচাই করা হচ্ছে...' });
    try {
      const trimmed = tempSheetUrl.trim();
      setPdfSheetUrl(trimmed);
      localStorage.setItem('dcu_ps_pdf_sheet_url', trimmed);

      if (trimmed) {
        const list = await fetchMaterialsFromSource(trimmed);
        setSyncStatus({
          loading: false,
          message: `কানেক্ট হয়েছে! মোট ${list.length}টি পিডিএফ নোট পাওয়া গেছে।`,
          error: false
        });
        await onRefreshMaterials();
      } else {
        setSyncStatus({
          loading: false,
          message: 'গুগল শিট লিংক সরানো হয়েছে (লোকাল নোটগুলো থাকবে)।',
          error: false
        });
      }
    } catch (err: any) {
      setSyncStatus({
        loading: false,
        message: err.message || 'শিট লোড করতে সমস্যা হয়েছে। শিটটির শেয়ারিং লিংক চেক করুন।',
        error: true
      });
    }
  };

  const handleCopyScript = () => {
    navigator.clipboard.writeText(GOOGLE_APPS_SCRIPT_PDF_ONLY_CODE).then(() => {
      setCopiedScript(true);
      setTimeout(() => setCopiedScript(false), 2500);
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-xs animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white dark:bg-[#111622] rounded-2xl shadow-2xl border-2 border-amber-500/40 my-4 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header - Amber Theme */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-gradient-to-r from-amber-600 via-amber-500 to-orange-500 text-black">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-black/15 flex items-center justify-center text-black">
              <BookOpen className="w-4 h-4 font-bold" />
            </div>
            <div>
              <h2 className="text-sm font-extrabold tracking-tight">
                পিডিএফ ও স্টাডি মেটেরিয়াল ব্যবস্থাপনা
              </h2>
              <p className="text-[11px] font-medium opacity-90">
                রাষ্ট্রবিজ্ঞান বিভাগ • সিআর ও এডমিন প্যানেল
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isAuthenticated && (
              <button
                type="button"
                onClick={onLogout}
                className="px-2.5 py-1 text-xs font-bold rounded-lg bg-black/20 hover:bg-black/30 text-black transition cursor-pointer"
              >
                লগআউট
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-black hover:bg-black/10 rounded-lg transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Not Authenticated State */}
        {!isAuthenticated ? (
          <div className="p-6 sm:p-8 max-w-md mx-auto w-full text-center my-auto">
            <div className="w-12 h-12 mx-auto mb-3 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-600 dark:text-amber-400">
              <Lock className="w-6 h-6" />
            </div>
            
            <h3 className="text-base font-extrabold text-zinc-900 dark:text-white mb-1">
              পিডিএফ ও নোট এডমিন লগইন
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-4">
              নতুন পিডিএফ নোট যুক্ত করতে বা এডিট করতে সিআর/এডমিন হিসেবে প্রবেশ করুন
            </p>

            {/* Clear Credentials Helper Box */}
            <div className="mb-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-left text-xs text-zinc-800 dark:text-zinc-200 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold flex items-center gap-1 text-amber-700 dark:text-amber-400">
                  <KeyRound className="w-3.5 h-3.5" /> এডমিন লগইন তথ্য:
                </span>
                <button
                  type="button"
                  onClick={handleQuickLoginFill}
                  className="px-2 py-0.5 rounded-md bg-amber-500 hover:bg-amber-600 text-black font-bold text-[11px] transition cursor-pointer"
                >
                  ⚡ এক ক্লিকে লগইন
                </button>
              </div>
              <p className="text-[11px] text-zinc-600 dark:text-zinc-400 font-mono">
                ইউজারনেম: <strong className="text-zinc-900 dark:text-white">dcudcps</strong>
              </p>
              <p className="text-[11px] text-zinc-600 dark:text-zinc-400 font-mono">
                পাসওয়ার্ড: <strong className="text-zinc-900 dark:text-white">@@Dcudcps11223300@@</strong>
              </p>
            </div>

            {loginError && (
              <div className="mb-4 p-2.5 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-xs flex items-center gap-2 text-left">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <form onSubmit={handleLoginSubmit} className="space-y-3 text-left">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  ইউজার নেম
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  placeholder="dcudcps"
                  required
                  className="w-full px-3 py-2 text-xs rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                  পাসওয়ার্ড
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="@@Dcudcps11223300@@"
                  required
                  className="w-full px-3 py-2 text-xs rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-black font-bold text-xs transition cursor-pointer shadow-xs active:scale-95"
              >
                লগইন করুন
              </button>
            </form>
          </div>
        ) : (
          /* Authenticated Dashboard */
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Tabs */}
            <div className="flex items-center gap-2 px-4 py-2 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 overflow-x-auto text-xs font-medium">
              <button
                type="button"
                onClick={() => setActiveTab('add')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition cursor-pointer font-bold ${
                  activeTab === 'add'
                    ? 'bg-amber-500 text-black shadow-xs'
                    : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800'
                }`}
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ নতুন পিডিএফ যোগ করুন</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('sheet')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition cursor-pointer font-bold ${
                  activeTab === 'sheet'
                    ? 'bg-amber-500 text-black shadow-xs'
                    : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800'
                }`}
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span>পিডিএফ গুগল শিট লিংক</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('manage')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition cursor-pointer font-bold ${
                  activeTab === 'manage'
                    ? 'bg-amber-500 text-black shadow-xs'
                    : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800'
                }`}
              >
                <FolderOpen className="w-3.5 h-3.5" />
                <span>মোট নোট ({books.length})</span>
              </button>
            </div>

            {/* Tab Contents */}
            <div className="p-4 sm:p-5 flex-1 overflow-y-auto">
              
              {/* TAB 1: ADD NEW PDF FORM */}
              {activeTab === 'add' && (
                <div className="space-y-4">
                  <div className="border-b border-zinc-100 dark:border-zinc-800 pb-2">
                    <h3 className="font-extrabold text-sm text-zinc-900 dark:text-white flex items-center gap-2">
                      <Plus className="w-4 h-4 text-amber-500" />
                      নতুন হ্যান্ডনোট বা বই আপলোড
                    </h3>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                      এখানে লিংক দিলে সাথে সাথে সাইটের পিডিএফ সেকশনে শো করবে এবং সংরক্ষিত থাকবে।
                    </p>
                  </div>

                  {submitSuccess && (
                    <div className="p-3 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-800 dark:text-amber-300 text-xs font-semibold flex items-center gap-2">
                      <Check className="w-4 h-4 shrink-0 text-amber-600" />
                      <span>{submitSuccess}</span>
                    </div>
                  )}

                  <form onSubmit={handleAddMaterialSubmit} className="space-y-3.5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                          কোর্স কোড নির্বাচন করুন *
                        </label>
                        <select
                          value={courseCode}
                          onChange={e => setCourseCode(e.target.value)}
                          className="w-full px-3 py-2 text-xs rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white focus:ring-2 focus:ring-amber-500 font-semibold"
                        >
                          {courses.map(c => (
                            <option key={c.code} value={c.code}>
                              {c.code} - {c.titleBn}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                          ক্যাটাগরি *
                        </label>
                        <select
                          value={category}
                          onChange={e => setCategory(e.target.value as any)}
                          className="w-full px-3 py-2 text-xs rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white focus:ring-2 focus:ring-amber-500 font-semibold"
                        >
                          <option value="হ্যান্ডনোট">হ্যান্ডনোট</option>
                          <option value="লেকচার শিট">লেকচার শিট</option>
                          <option value="মূল বই">মূল বই</option>
                          <option value="সিলেবাস ও প্রশ্ন">সিলেবাস ও প্রশ্ন</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                        নোট বা বইয়ের পুরো নাম / শিরোনাম *
                      </label>
                      <input
                        type="text"
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        placeholder="যেমন: প্লেটোর আদর্শ রাষ্ট্র ও ন্যায়বিচার তত্ত্ব সারসংক্ষেপ"
                        required
                        className="w-full px-3 py-2 text-xs rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white focus:ring-2 focus:ring-amber-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                        গুগল ড্রাইভ বা সরাসরি পিডিএফ লিংক *
                      </label>
                      <input
                        type="url"
                        value={driveUrl}
                        onChange={e => setDriveUrl(e.target.value)}
                        placeholder="https://drive.google.com/file/d/.../view?usp=sharing"
                        required
                        className="w-full px-3 py-2 text-xs rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white focus:ring-2 focus:ring-amber-500"
                      />
                      <p className="text-[10px] text-zinc-400 mt-1">
                        গুগল ড্রাইভ ফাইল শেয়ার করার সময় "Anyone with the link can view" সিলেক্ট করে লিংক কপি করবেন।
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                          সংগ্রাহক / লেখক / সিআর-এর নাম
                        </label>
                        <input
                          type="text"
                          value={author}
                          onChange={e => setAuthor(e.target.value)}
                          placeholder="যেমন: মাহিম / সিআর"
                          className="w-full px-3 py-2 text-xs rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white focus:ring-2 focus:ring-amber-500"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                          ফাইলের সাইজ (ঐচ্ছিক)
                        </label>
                        <input
                          type="text"
                          value={fileSize}
                          onChange={e => setFileSize(e.target.value)}
                          placeholder="যেমন: 2.4 MB"
                          className="w-full px-3 py-2 text-xs rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white focus:ring-2 focus:ring-amber-500"
                        />
                      </div>
                    </div>

                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-black font-extrabold text-xs transition cursor-pointer shadow-sm active:scale-95 disabled:opacity-50"
                      >
                        {isSubmitting ? 'সংরক্ষণ করা হচ্ছে...' : '✓ নোটটি ওয়েবসাইটে পাবলিশ করুন'}
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* TAB 2: SEPARATE PDF GOOGLE SHEET SYNC */}
              {activeTab === 'sheet' && (
                <div className="space-y-4">
                  <div className="border-b border-zinc-100 dark:border-zinc-800 pb-2">
                    <h3 className="font-extrabold text-sm text-zinc-900 dark:text-white flex items-center gap-2">
                      <FileSpreadsheet className="w-4 h-4 text-amber-500" />
                      শুধুমাত্র পিডিএফের জন্য আলাদা গুগল শিট লিংক
                    </h3>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                      নোটিশের শিট থেকে সম্পূর্ণ আলাদা। আপনি চাইলে শুধুই পিডিএফ নোটগুলোর জন্য এই শিটটি ব্যবহার করতে পারেন।
                    </p>
                  </div>

                  <form onSubmit={handleSaveSheetUrl} className="space-y-3">
                    <div>
                      <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1">
                        গুগল শিট বা ওয়েব অ্যাপ লিঙ্ক
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="url"
                          value={tempSheetUrl}
                          onChange={e => setTempSheetUrl(e.target.value)}
                          placeholder="https://docs.google.com/spreadsheets/d/... অথবা Apps Script URL"
                          className="flex-1 px-3 py-2 text-xs rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white focus:ring-2 focus:ring-amber-500"
                        />
                        <button
                          type="submit"
                          disabled={syncStatus?.loading}
                          className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-black font-bold text-xs transition cursor-pointer shrink-0 disabled:opacity-50"
                        >
                          {syncStatus?.loading ? 'সিঙ্ক...' : 'সেভ ও সিঙ্ক'}
                        </button>
                      </div>
                    </div>

                    {syncStatus && (
                      <div
                        className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                          syncStatus.error
                            ? 'bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400'
                            : 'bg-amber-500/10 border border-amber-500/30 text-amber-800 dark:text-amber-300'
                        }`}
                      >
                        {syncStatus.loading ? (
                          <RefreshCw className="w-3.5 h-3.5 animate-spin shrink-0" />
                        ) : syncStatus.error ? (
                          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                        ) : (
                          <Check className="w-3.5 h-3.5 shrink-0 text-amber-600" />
                        )}
                        <span>{syncStatus.message}</span>
                      </div>
                    )}
                  </form>

                  {/* Instructions on how to create the sheet */}
                  <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 space-y-2 text-xs">
                    <h4 className="font-bold text-zinc-800 dark:text-zinc-200">
                      📝 গুগল শিটের কলাম তৈরির সহজ নিয়ম (পদ্ধতি ১):
                    </h4>
                    <p className="text-[11px] text-zinc-500 leading-relaxed">
                      গুগল ড্রাইভে গিয়ে একটি নতুন স্প্রেডশিট খুলুন। প্রথম সারিতে (Row 1) নিচের মতো কলামের নাম লিখুন:
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-6 gap-1.5 font-mono text-[10px] text-center">
                      <span className="p-1 rounded-md bg-amber-500/15 border border-amber-500/30 font-bold">Course</span>
                      <span className="p-1 rounded-md bg-amber-500/15 border border-amber-500/30 font-bold">Title</span>
                      <span className="p-1 rounded-md bg-amber-500/15 border border-amber-500/30 font-bold">Category</span>
                      <span className="p-1 rounded-md bg-amber-500/15 border border-amber-500/30 font-bold">Drive Link</span>
                      <span className="p-1 rounded-md bg-amber-500/15 border border-amber-500/30 font-bold">Author</span>
                      <span className="p-1 rounded-md bg-amber-500/15 border border-amber-500/30 font-bold">Size</span>
                    </div>
                    <p className="text-[11px] text-zinc-500">
                      এরপর উপরের Share বাটনে গিয়ে "Anyone with the link can view" দিন এবং শিটের লিংকটি উপরে পেস্ট করুন।
                    </p>
                  </div>

                  {/* Apps Script Code for Automatic Web App */}
                  <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-zinc-800 dark:text-zinc-200">
                        ⚡ গুগল অ্যাপস স্ক্রিপ্ট কোড (পদ্ধতি ২ - অটো সিঙ্ক):
                      </h4>
                      <button
                        type="button"
                        onClick={handleCopyScript}
                        className="px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-600 text-black font-bold text-[11px] transition cursor-pointer flex items-center gap-1"
                      >
                        {copiedScript ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedScript ? 'কপি হয়েছে' : 'কোড কপি করুন'}</span>
                      </button>
                    </div>
                    <p className="text-[11px] text-zinc-500">
                      শিটের Extensions → Apps Script-এ গিয়ে নিচের কোড পেস্ট করে Deploy → New deployment → Web app ("Anyone") করে দিন।
                    </p>
                  </div>
                </div>
              )}

              {/* TAB 3: MANAGE / DELETE CURRENT BOOKS */}
              {activeTab === 'manage' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 pb-2">
                    <div>
                      <h3 className="font-extrabold text-sm text-zinc-900 dark:text-white">
                        বিদ্যমান নোট তালিকা ({books.length})
                      </h3>
                      <p className="text-xs text-zinc-500">
                        যেকোনো ভুল বা অপ্রয়োজনীয় নোট এখান থেকে সহজেই মুছে ফেলতে পারেন।
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveTab('add')}
                      className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-black font-bold text-xs transition cursor-pointer flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>নতুন যোগ করুন</span>
                    </button>
                  </div>

                  {books.length === 0 ? (
                    <div className="py-8 text-center text-zinc-500 text-xs">
                      আপাতত কোনো নোট নেই। "নতুন পিডিএফ যোগ করুন" ট্যাবে গিয়ে সহজে নোট যোগ করুন।
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
                      {books.map(b => (
                        <div
                          key={b.id}
                          className="p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex items-start justify-between gap-3 text-xs"
                        >
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5 mb-1">
                              <span className="px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-800 dark:text-amber-300 font-bold font-mono text-[10px]">
                                {b.courseCode}
                              </span>
                              <span className="text-zinc-500 text-[10px]">
                                • {b.category}
                              </span>
                            </div>
                            <h4 className="font-bold text-zinc-900 dark:text-white truncate">
                              {b.title}
                            </h4>
                            <p className="text-[10px] text-zinc-500 truncate mt-0.5">
                              সংগ্রাহক: {b.author || 'বিভাগীয়'} • সাইজ: {b.fileSize || 'N/A'}
                            </p>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <a
                              href={b.driveUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 text-zinc-400 hover:text-amber-500 transition"
                              title="ড্রাইভ লিংক দেখুন"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                            <button
                              type="button"
                              onClick={() => handleDeleteBook(b.id)}
                              className="p-1.5 text-zinc-400 hover:text-red-500 transition cursor-pointer"
                              title="মুছে ফেলুন"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
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
};
