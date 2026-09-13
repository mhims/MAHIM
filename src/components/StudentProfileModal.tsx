import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  User,
  Phone,
  School,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  Clock,
  AlertCircle,
  LogOut,
  Sparkles,
  BookOpen,
  Receipt,
  RefreshCw,
  ChevronDown,
  ArrowRight,
  ShieldCheck,
  Calendar,
} from 'lucide-react';
import {
  StudentUser,
  getCurrentStudent,
  saveStudentSession,
  logoutStudent,
  updateStudentProfile,
  updateStudentPassword,
  getStudentEnrollments,
  syncStudentEnrollmentsFromGoogleSheet,
  CourseEnrollmentRecord,
} from '../utils/studentAuth';
import { MENTORSHIP_COURSES } from '../data/mentorshipCourses';
import { navigateTo } from '../utils/navigation';

export type ProfileModalTab = 'my_courses' | 'profile' | 'password' | 'transactions';

interface StudentProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: ProfileModalTab;
  onSuccessLogin?: (student: StudentUser) => void;
}

export const StudentProfileModal: React.FC<StudentProfileModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'my_courses',
  onSuccessLogin,
}) => {
  const [currentStudent, setCurrentStudent] = useState<StudentUser | null>(null);
  const [activeTab, setActiveTab] = useState<ProfileModalTab>(initialTab);

  // Login Form States (when logged out)
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [authName, setAuthName] = useState('');
  const [authPhone, setAuthPhone] = useState('');
  const [authWhatsapp, setAuthWhatsapp] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authInstitution, setAuthInstitution] = useState('');
  const [authError, setAuthError] = useState('');
  const [showAuthPassword, setShowAuthPassword] = useState(false);

  // Profile Update Form States
  const [profileName, setProfileName] = useState('');
  const [profileWhatsapp, setProfileWhatsapp] = useState('');
  const [profileInstitution, setProfileInstitution] = useState('');
  const [profileBatch, setProfileBatch] = useState('');
  const [profileSuccessMsg, setProfileSuccessMsg] = useState('');

  // Password Update Form States
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccessMsg, setPasswordSuccessMsg] = useState('');

  // Transactions & Enrollments
  const [studentEnrollments, setStudentEnrollments] = useState<CourseEnrollmentRecord[]>([]);
  const [isSyncingTransactions, setIsSyncingTransactions] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const student = getCurrentStudent();
      setCurrentStudent(student);
      setActiveTab(initialTab);
      setAuthError('');
      setProfileSuccessMsg('');
      setPasswordSuccessMsg('');
      setPasswordError('');

      if (student) {
        setProfileName(student.name);
        setProfileWhatsapp(student.whatsapp || student.phone);
        setProfileInstitution(student.institution || '');
        setProfileBatch(student.batchOrClass || '');
        loadEnrollments(student.phone);
      }
    }
  }, [isOpen, initialTab]);

  const loadEnrollments = (phone: string) => {
    const list = getStudentEnrollments(phone);
    setStudentEnrollments(list);
  };

  const handleSyncTransactions = async () => {
    if (!currentStudent) return;
    setIsSyncingTransactions(true);
    try {
      await syncStudentEnrollmentsFromGoogleSheet(currentStudent.phone);
      loadEnrollments(currentStudent.phone);
    } catch (err) {
      console.error('Failed to sync transactions:', err);
    } finally {
      setIsSyncingTransactions(false);
    }
  };

  // Login handler
  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');

    const cleanPhone = authPhone.trim().replace(/[^0-9]/g, '');
    const cleanName = authName.trim();

    if (cleanPhone.length < 11) {
      setAuthError('অনুগ্রহ করে সঠিক ১১ ডিজিটের মোবাইল নম্বর দিন (যেমন: 018XXXXXXXX)');
      return;
    }

    if (!cleanName) {
      setAuthError('আপনার পুরো নাম প্রদান করুন');
      return;
    }

    const student: StudentUser = {
      id: `student_${cleanPhone}`,
      name: cleanName,
      phone: cleanPhone,
      whatsapp: authWhatsapp.trim() || cleanPhone,
      institution: authInstitution.trim(),
      password: authPassword.trim() || undefined,
      createdAt: new Date().toISOString(),
    };

    saveStudentSession(student);
    setCurrentStudent(student);
    setProfileName(student.name);
    setProfileWhatsapp(student.whatsapp);
    setProfileInstitution(student.institution || '');
    loadEnrollments(cleanPhone);

    onSuccessLogin?.(student);
  };

  // Profile update handler
  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSuccessMsg('');
    if (!profileName.trim()) return;

    const updated = updateStudentProfile({
      name: profileName.trim(),
      whatsapp: profileWhatsapp.trim(),
      institution: profileInstitution.trim(),
      batchOrClass: profileBatch.trim(),
    });

    if (updated) {
      setCurrentStudent(updated);
      setProfileSuccessMsg('প্রোফাইল সফলভাবে আপডেট হয়েছে!');
      setTimeout(() => setProfileSuccessMsg(''), 3000);
    }
  };

  // Password update handler
  const handlePasswordUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccessMsg('');

    if (newPassword.length < 4) {
      setPasswordError('পাসওয়ার্ড ন্যূনতম ৪ অক্ষরের হতে হবে');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('উভয় পাসওয়ার্ড মিলছে না');
      return;
    }

    const ok = updateStudentPassword(newPassword.trim());
    if (ok) {
      setPasswordSuccessMsg('পাসওয়ার্ড সফলভাবে পরিবর্তিত হয়েছে!');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setPasswordSuccessMsg(''), 3000);
    }
  };

  // Logout handler
  const handleLogout = () => {
    logoutStudent();
    setCurrentStudent(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/65 backdrop-blur-sm animate-fade-in font-sans">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-orange-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 px-5 sm:px-6 py-4 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center font-black text-white text-base shadow-xs">
              {currentStudent ? currentStudent.name.charAt(0) : <User className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="font-extrabold text-base sm:text-lg tracking-tight font-['Hind_Siliguri',sans-serif]">
                {currentStudent ? currentStudent.name : 'শিক্ষার্থী একাউন্ট'}
              </h3>
              <p className="text-xs text-orange-100 font-['Hind_Siliguri',sans-serif]">
                {currentStudent ? `📱 ${currentStudent.phone}` : 'লগ ইন অথবা নতুন শিক্ষার্থী নিবন্ধন'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/15 hover:bg-white/25 text-white transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Tab Navigation for Logged-In User */}
        {currentStudent ? (
          <div className="bg-orange-50/70 border-b border-orange-200 px-3 sm:px-6 py-2 flex items-center gap-1 sm:gap-2 overflow-x-auto no-scrollbar font-['Hind_Siliguri',sans-serif] shrink-0">
            <button
              onClick={() => setActiveTab('my_courses')}
              className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'my_courses'
                  ? 'bg-orange-500 text-white shadow-sm shadow-orange-500/30'
                  : 'text-zinc-700 hover:text-orange-600 hover:bg-orange-100/60'
              }`}
            >
              <BookOpen size={14} />
              <span>মাই কোর্স</span>
            </button>

            <button
              onClick={() => setActiveTab('profile')}
              className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'profile'
                  ? 'bg-orange-500 text-white shadow-sm shadow-orange-500/30'
                  : 'text-zinc-700 hover:text-orange-600 hover:bg-orange-100/60'
              }`}
            >
              <User size={14} />
              <span>প্রোফাইল আপডেট</span>
            </button>

            <button
              onClick={() => setActiveTab('password')}
              className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'password'
                  ? 'bg-orange-500 text-white shadow-sm shadow-orange-500/30'
                  : 'text-zinc-700 hover:text-orange-600 hover:bg-orange-100/60'
              }`}
            >
              <Lock size={14} />
              <span>পাসওয়ার্ড আপডেট</span>
            </button>

            <button
              onClick={() => setActiveTab('transactions')}
              className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all whitespace-nowrap cursor-pointer ${
                activeTab === 'transactions'
                  ? 'bg-orange-500 text-white shadow-sm shadow-orange-500/30'
                  : 'text-zinc-700 hover:text-orange-600 hover:bg-orange-100/60'
              }`}
            >
              <Receipt size={14} />
              <span>ট্রানজেকশন হিস্টোরি</span>
              {studentEnrollments.length > 0 && (
                <span className="w-4 h-4 rounded-full bg-white text-orange-600 text-[10px] font-black flex items-center justify-center">
                  {studentEnrollments.length}
                </span>
              )}
            </button>
          </div>
        ) : null}

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 font-['Hind_Siliguri',sans-serif]">
          {/* ========================================================================= */}
          {/* LOGGED OUT VIEW: Login / Registration Form */}
          {/* ========================================================================= */}
          {!currentStudent ? (
            <div className="max-w-md mx-auto space-y-5">
              <div className="text-center space-y-1">
                <div className="w-12 h-12 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center mx-auto mb-2">
                  <User className="w-6 h-6" />
                </div>
                <h4 className="text-lg sm:text-xl font-black text-zinc-900">
                  {authMode === 'login' ? 'শিক্ষার্থী লগ ইন' : 'নতুন শিক্ষার্থী নিবন্ধন'}
                </h4>
                <p className="text-xs text-zinc-600">
                  কোর্স কিনতে, পেমেন্ট ট্র্যাকিং এবং কোর্স অ্যাক্সেস পেতে লগ ইন করুন
                </p>
              </div>

              {authError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs flex items-center gap-2">
                  <AlertCircle size={14} className="shrink-0" />
                  <span>{authError}</span>
                </div>
              )}

              <form onSubmit={handleAuthSubmit} className="space-y-3.5 text-xs">
                <div>
                  <label className="block font-bold text-zinc-700 mb-1">
                    আপনার পুরো নাম <span className="text-orange-600">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      placeholder="যেমন: সাকিব হাসান"
                      value={authName}
                      onChange={(e) => setAuthName(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-zinc-300 focus:outline-none focus:border-orange-500 bg-white"
                    />
                    <User size={15} className="absolute left-3 top-3 text-zinc-400" />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-zinc-700 mb-1">
                    মোবাইল নম্বর (লগইন আইডি) <span className="text-orange-600">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      required
                      placeholder="018XXXXXXXX বা 017XXXXXXXX"
                      value={authPhone}
                      onChange={(e) => setAuthPhone(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-zinc-300 focus:outline-none focus:border-orange-500 font-mono bg-white"
                    />
                    <Phone size={15} className="absolute left-3 top-3 text-zinc-400" />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-zinc-700 mb-1">
                    পাসওয়ার্ড (ঐচ্ছিক)
                  </label>
                  <div className="relative">
                    <input
                      type={showAuthPassword ? 'text' : 'password'}
                      placeholder="পাসওয়ার্ড লিখুন..."
                      value={authPassword}
                      onChange={(e) => setAuthPassword(e.target.value)}
                      className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-zinc-300 focus:outline-none focus:border-orange-500 bg-white"
                    />
                    <Lock size={15} className="absolute left-3 top-3 text-zinc-400" />
                    <button
                      type="button"
                      onClick={() => setShowAuthPassword(!showAuthPassword)}
                      className="absolute right-3 top-3 text-zinc-400 hover:text-zinc-600"
                    >
                      {showAuthPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-zinc-700 mb-1">
                    কলেজ / প্রতিষ্ঠান (ঐচ্ছিক)
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="যেমন: ঢাকা কলেজ / আদমজী"
                      value={authInstitution}
                      onChange={(e) => setAuthInstitution(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-zinc-300 focus:outline-none focus:border-orange-500 bg-white"
                    />
                    <School size={15} className="absolute left-3 top-3 text-zinc-400" />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 px-4 rounded-xl font-bold text-sm bg-orange-500 hover:bg-orange-600 text-white shadow-md shadow-orange-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
                >
                  <Sparkles size={16} className="text-amber-200" />
                  <span>লগ ইন করে এগিয়ে যান</span>
                </button>
              </form>
            </div>
          ) : (
            /* ========================================================================= */
            /* LOGGED IN VIEWS (Tabs 1-4) */
            /* ========================================================================= */
            <div>
              {/* TAB 1: মাই কোর্স (My Courses) */}
              {activeTab === 'my_courses' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-black text-base text-zinc-900">আপনার মেন্টরশীপ কোর্সসমূহ</h4>
                      <p className="text-xs text-zinc-600">
                        নিচে ৫ জন মেন্টরের কোর্সের স্ট্যাটাস ও সরাসরি এক্সেস লিংক
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {MENTORSHIP_COURSES.map((course) => {
                      const studentRecord = studentEnrollments.find(
                        (e) => e.mentorSlug.toLowerCase() === course.slug.toLowerCase()
                      );
                      const status = studentRecord ? studentRecord.status : 'none';

                      return (
                        <div
                          key={course.id}
                          className="bg-zinc-50 border border-orange-200/90 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-white hover:border-orange-300 transition-all shadow-xs"
                        >
                          <div className="flex items-center gap-3">
                            <img
                              src={course.avatarUrl}
                              alt={course.mentorName}
                              className="w-12 h-12 rounded-xl object-cover border border-orange-200 shrink-0"
                            />
                            <div>
                              <div className="flex items-center gap-2">
                                <h5 className="font-extrabold text-sm text-zinc-900">
                                  {course.mentorName}
                                </h5>
                                <span className="text-[10px] px-2 py-0.5 rounded-md bg-orange-100 text-orange-800 font-bold">
                                  {course.priceFormatted}
                                </span>
                              </div>
                              <p className="text-xs text-zinc-600 line-clamp-1">{course.title}</p>
                              <p className="text-[11px] text-zinc-400">{course.institution}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 justify-between sm:justify-end border-t sm:border-t-0 pt-2 sm:pt-0 border-zinc-200">
                            {status === 'ok' && (
                              <div className="flex items-center gap-2">
                                <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800">
                                  <CheckCircle2 size={12} />
                                  <span>অনুমোদিত</span>
                                </span>
                                <button
                                  onClick={() => {
                                    onClose();
                                    navigateTo(`/classroom/courses/mentorship/${course.slug}`);
                                  }}
                                  className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs cursor-pointer flex items-center gap-1"
                                >
                                  <span>কোর্সে যান</span>
                                  <ArrowRight size={13} />
                                </button>
                              </div>
                            )}

                            {status === 'pending' && (
                              <div className="flex items-center gap-2">
                                <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-lg bg-amber-100 text-amber-800">
                                  <Clock size={12} className="animate-pulse" />
                                  <span>যাচাই অপেক্ষমান</span>
                                </span>
                                <button
                                  onClick={() => {
                                    onClose();
                                    navigateTo(`/classroom/courses/mentorship/${course.slug}`);
                                  }}
                                  className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs cursor-pointer"
                                >
                                  স্ট্যাটাস দেখুন
                                </button>
                              </div>
                            )}

                            {status === 'fake' && (
                              <div className="flex items-center gap-2">
                                <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-lg bg-red-100 text-red-800">
                                  <AlertCircle size={12} />
                                  <span>বাতিল</span>
                                </span>
                                <button
                                  onClick={() => {
                                    onClose();
                                    navigateTo(`/classroom/courses/mentorship/${course.slug}`);
                                  }}
                                  className="px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs cursor-pointer"
                                >
                                  পুনরায় দিন
                                </button>
                              </div>
                            )}

                            {status === 'none' && (
                              <button
                                onClick={() => {
                                  onClose();
                                  navigateTo(`/classroom/courses/mentorship/${course.slug}`);
                                }}
                                className="px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs shadow-xs cursor-pointer flex items-center gap-1 transition-all"
                              >
                                <span>কোর্স কিনুন (৯৯৳)</span>
                                <ArrowRight size={13} />
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* TAB 2: প্রোফাইল আপডেট (Profile Update) */}
              {activeTab === 'profile' && (
                <div className="max-w-lg mx-auto space-y-4">
                  <div>
                    <h4 className="font-black text-base text-zinc-900">শিক্ষার্থী প্রোফাইল আপডেট</h4>
                    <p className="text-xs text-zinc-600">
                      আপনার নাম ও যোগাযোগের তথ্য পরিবর্তন করতে নিচের ফর্ম পূরণ করুন
                    </p>
                  </div>

                  {profileSuccessMsg && (
                    <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-2">
                      <CheckCircle2 size={14} className="text-emerald-600" />
                      <span>{profileSuccessMsg}</span>
                    </div>
                  )}

                  <form onSubmit={handleProfileUpdate} className="space-y-3.5 text-xs">
                    <div>
                      <label className="block font-bold text-zinc-700 mb-1">পুরো নাম</label>
                      <input
                        type="text"
                        required
                        value={profileName}
                        onChange={(e) => setProfileName(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl border border-zinc-300 focus:outline-none focus:border-orange-500 bg-white"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-zinc-700 mb-1">লগইন ফোন নম্বর (স্থির)</label>
                      <input
                        type="text"
                        disabled
                        value={currentStudent.phone}
                        className="w-full px-3 py-2.5 rounded-xl border border-zinc-200 bg-zinc-100 text-zinc-500 font-mono cursor-not-allowed"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-zinc-700 mb-1">
                        হোয়াটসঅ্যাপ নম্বর (কোর্স আপডেট ও নোটিশ পাওয়ার জন্য)
                      </label>
                      <input
                        type="tel"
                        value={profileWhatsapp}
                        onChange={(e) => setProfileWhatsapp(e.target.value)}
                        placeholder="01XXXXXXXXX"
                        className="w-full px-3 py-2.5 rounded-xl border border-zinc-300 focus:outline-none focus:border-orange-500 font-mono bg-white"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-zinc-700 mb-1">কলেজ / শিক্ষাপ্রতিষ্ঠান</label>
                      <input
                        type="text"
                        value={profileInstitution}
                        onChange={(e) => setProfileInstitution(e.target.value)}
                        placeholder="যেমন: ঢাকা কলেজ / নটর ডেম কলেজ"
                        className="w-full px-3 py-2.5 rounded-xl border border-zinc-300 focus:outline-none focus:border-orange-500 bg-white"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-zinc-700 mb-1">ব্যাচ / টার্গেট এক্সাম</label>
                      <input
                        type="text"
                        value={profileBatch}
                        onChange={(e) => setProfileBatch(e.target.value)}
                        placeholder="যেমন: HSC 2025 / HSC 2026 / ভার্সিটি এডমিশন"
                        className="w-full px-3 py-2.5 rounded-xl border border-zinc-300 focus:outline-none focus:border-orange-500 bg-white"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 px-4 rounded-xl font-bold text-sm bg-orange-500 hover:bg-orange-600 text-white shadow-md shadow-orange-500/25 transition-all cursor-pointer"
                    >
                      প্রোফাইল সংরক্ষণ করুন
                    </button>
                  </form>
                </div>
              )}

              {/* TAB 3: পাসওয়ার্ড আপডেট (Password Update) */}
              {activeTab === 'password' && (
                <div className="max-w-md mx-auto space-y-4">
                  <div>
                    <h4 className="font-black text-base text-zinc-900">পাসওয়ার্ড পরিবর্তন</h4>
                    <p className="text-xs text-zinc-600">
                      আপনার শিক্ষার্থী একাউন্ট সুরক্ষিত রাখতে নতুন পাসওয়ার্ড সেট করুন
                    </p>
                  </div>

                  {passwordSuccessMsg && (
                    <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-2">
                      <CheckCircle2 size={14} className="text-emerald-600" />
                      <span>{passwordSuccessMsg}</span>
                    </div>
                  )}

                  {passwordError && (
                    <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs flex items-center gap-2">
                      <AlertCircle size={14} className="shrink-0" />
                      <span>{passwordError}</span>
                    </div>
                  )}

                  <form onSubmit={handlePasswordUpdate} className="space-y-3.5 text-xs">
                    <div>
                      <label className="block font-bold text-zinc-700 mb-1">নতুন পাসওয়ার্ড</label>
                      <div className="relative">
                        <input
                          type={showNewPassword ? 'text' : 'password'}
                          required
                          placeholder="নতুন পাসওয়ার্ড দিন..."
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="w-full pl-3 pr-10 py-2.5 rounded-xl border border-zinc-300 focus:outline-none focus:border-orange-500 bg-white"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-3 top-3 text-zinc-400 hover:text-zinc-600"
                        >
                          {showNewPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block font-bold text-zinc-700 mb-1">পাসওয়ার্ড নিশ্চিত করুন</label>
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        required
                        placeholder="একই পাসওয়ার্ড পুনরায় লিখুন..."
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl border border-zinc-300 focus:outline-none focus:border-orange-500 bg-white"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 px-4 rounded-xl font-bold text-sm bg-orange-500 hover:bg-orange-600 text-white shadow-md shadow-orange-500/25 transition-all cursor-pointer"
                    >
                      পাসওয়ার্ড আপডেট করুন
                    </button>
                  </form>
                </div>
              )}

              {/* TAB 4: ট্রানজেকশন হিস্টোরি (Transaction History) */}
              {activeTab === 'transactions' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-black text-base text-zinc-900">ট্রানজেকশন হিস্টোরি ও স্ট্যাটাস</h4>
                      <p className="text-xs text-zinc-600">
                        আপনার প্রেরিত পেমেন্ট ও গুগল শিটের ভেরিফিকেশন অবস্থা
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleSyncTransactions}
                      disabled={isSyncingTransactions}
                      className="px-3 py-1.5 rounded-xl bg-orange-100 hover:bg-orange-200 text-orange-800 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
                    >
                      <RefreshCw size={13} className={isSyncingTransactions ? 'animate-spin' : ''} />
                      <span>{isSyncingTransactions ? 'যাচাই হচ্ছে...' : 'শিট রিফ্রেশ'}</span>
                    </button>
                  </div>

                  {studentEnrollments.length === 0 ? (
                    <div className="text-center py-10 bg-orange-50/50 rounded-2xl border border-orange-200/80 p-6 space-y-3">
                      <Receipt className="w-10 h-10 text-orange-400 mx-auto" />
                      <h5 className="font-bold text-zinc-800 text-sm">কোনো ট্রানজেকশন পাওয়া যায়নি</h5>
                      <p className="text-xs text-zinc-500 max-w-sm mx-auto">
                        আপনি এখনও কোনো মেন্টরশীপ কোর্সের জন্য পেমেন্ট জমা দেননি। কোর্স পেজ থেকে বিকাশ/নগদে সেন্ড মানি করে TrxID সাবমিট করুন।
                      </p>
                      <button
                        onClick={() => {
                          onClose();
                          navigateTo('/classroom/courses/mentorship');
                        }}
                        className="px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs transition-colors cursor-pointer"
                      >
                        মেন্টরশীপ কোর্স দেখুন
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {studentEnrollments.map((tx) => (
                        <div
                          key={tx.id}
                          className="bg-white border border-zinc-200 rounded-2xl p-4 shadow-xs space-y-2.5"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-100 pb-2">
                            <div>
                              <span className="text-[11px] text-zinc-500 block">কোর্স নাম</span>
                              <span className="font-bold text-sm text-zinc-900">{tx.courseTitle}</span>
                            </div>

                            {/* Status Badge */}
                            <div>
                              {tx.status === 'ok' && (
                                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
                                  <CheckCircle2 size={13} />
                                  <span>অনুমোদিত (OK)</span>
                                </span>
                              )}
                              {tx.status === 'pending' && (
                                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-bold">
                                  <Clock size={13} className="animate-pulse" />
                                  <span>যাচাই অপেক্ষমান (Pending)</span>
                                </span>
                              )}
                              {tx.status === 'fake' && (
                                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-red-100 text-red-800 text-xs font-bold">
                                  <AlertCircle size={13} />
                                  <span>বাতিল (Fake TrxID)</span>
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                            <div>
                              <span className="text-zinc-500 block">ফি</span>
                              <span className="font-bold text-orange-600 font-mono">{tx.fee}</span>
                            </div>
                            <div>
                              <span className="text-zinc-500 block">মেথড</span>
                              <span className="font-bold text-zinc-800">{tx.paymentMethod}</span>
                            </div>
                            <div>
                              <span className="text-zinc-500 block">প্রেরক নম্বর</span>
                              <span className="font-mono text-zinc-800">{tx.senderPhone}</span>
                            </div>
                            <div>
                              <span className="text-zinc-500 block">TrxID</span>
                              <span className="font-mono font-bold text-zinc-900 bg-zinc-100 px-1.5 py-0.5 rounded">
                                {tx.trxId}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between pt-2 border-t border-zinc-100 text-[11px] text-zinc-500">
                            <span className="flex items-center gap-1">
                              <Calendar size={12} />
                              <span>{new Date(tx.timestamp).toLocaleString('bn-BD')}</span>
                            </span>
                            <button
                              onClick={() => {
                                onClose();
                                navigateTo(`/classroom/courses/mentorship/${tx.mentorSlug}`);
                              }}
                              className="text-orange-600 font-bold hover:underline cursor-pointer"
                            >
                              কোর্স ভিউ ➔
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        {currentStudent && (
          <div className="bg-zinc-50 border-t border-zinc-200 px-5 sm:px-6 py-3 flex items-center justify-between font-['Hind_Siliguri',sans-serif] shrink-0">
            <button
              onClick={handleLogout}
              className="text-xs text-red-600 hover:text-red-700 font-bold flex items-center gap-1.5 hover:bg-red-50 px-3 py-1.5 rounded-xl transition-colors cursor-pointer"
            >
              <LogOut size={14} />
              <span>লগ আউট</span>
            </button>

            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-zinc-200 hover:bg-zinc-300 text-zinc-800 font-bold text-xs transition-colors cursor-pointer"
            >
              বন্ধ করুন
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// ============================================================================
// Header User Profile Menu Component (Dropdown when clicked on user's name)
// ============================================================================
interface StudentHeaderMenuProps {
  currentStudent: StudentUser | null;
  onOpenModal: (tab?: ProfileModalTab) => void;
  className?: string;
}

export const StudentHeaderMenu: React.FC<StudentHeaderMenuProps> = ({
  currentStudent,
  onOpenModal,
  className = '',
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!currentStudent) {
    return (
      <button
        onClick={() => onOpenModal('my_courses')}
        id="header-student-login-btn"
        className={`inline-flex items-center gap-1.5 px-2.5 sm:px-4 py-1.5 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-orange-500 hover:bg-orange-600 text-white shadow-md shadow-orange-500/25 transition-all font-['Hind_Siliguri',sans-serif] active:scale-95 cursor-pointer shrink-0 ${className}`}
      >
        <User size={14} className="shrink-0" />
        <span>লগ ইন</span>
      </button>
    );
  }

  return (
    <div className={`relative shrink-0 ${className}`} ref={menuRef}>
      <button
        onClick={() => setDropdownOpen(!dropdownOpen)}
        id="header-student-user-menu-btn"
        className="inline-flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3.5 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-bold bg-orange-100 hover:bg-orange-200 text-orange-950 border border-orange-300 transition-all font-['Hind_Siliguri',sans-serif] cursor-pointer select-none shrink-0"
        title="শিক্ষার্থী মেনু"
      >
        <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-orange-600 text-white flex items-center justify-center text-xs font-black shadow-xs shrink-0">
          {currentStudent.name.charAt(0)}
        </div>
        <span className="font-extrabold max-w-[70px] sm:max-w-[140px] truncate hidden xs:inline sm:inline">
          {currentStudent.name}
        </span>
        <ChevronDown
          size={13}
          className={`text-orange-700 transition-transform duration-200 shrink-0 ${dropdownOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Dropdown Menu */}
      {dropdownOpen && (
        <div className="absolute right-0 mt-2 w-60 sm:w-64 max-w-[calc(100vw-24px)] bg-white rounded-2xl shadow-2xl border border-orange-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150 font-['Hind_Siliguri',sans-serif]">
          {/* User Info Header */}
          <div className="px-4 py-2.5 border-b border-orange-100 bg-orange-50/50">
            <p className="text-xs font-extrabold text-zinc-900 truncate">{currentStudent.name}</p>
            <p className="text-[11px] font-mono text-zinc-500">{currentStudent.phone}</p>
          </div>

          {/* Menu Items */}
          <div className="p-1 space-y-0.5 text-xs">
            <button
              onClick={() => {
                setDropdownOpen(false);
                onOpenModal('my_courses');
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-orange-50 text-zinc-800 hover:text-orange-600 transition-colors text-left font-bold cursor-pointer"
            >
              <BookOpen size={15} className="text-orange-500" />
              <span>মাই কোর্স (My Courses)</span>
            </button>

            <button
              onClick={() => {
                setDropdownOpen(false);
                onOpenModal('profile');
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-orange-50 text-zinc-800 hover:text-orange-600 transition-colors text-left font-bold cursor-pointer"
            >
              <User size={15} className="text-orange-500" />
              <span>প্রোফাইল আপডেট</span>
            </button>

            <button
              onClick={() => {
                setDropdownOpen(false);
                onOpenModal('password');
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-orange-50 text-zinc-800 hover:text-orange-600 transition-colors text-left font-bold cursor-pointer"
            >
              <Lock size={15} className="text-orange-500" />
              <span>পাসওয়ার্ড আপডেট</span>
            </button>

            <button
              onClick={() => {
                setDropdownOpen(false);
                onOpenModal('transactions');
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-orange-50 text-zinc-800 hover:text-orange-600 transition-colors text-left font-bold cursor-pointer"
            >
              <Receipt size={15} className="text-orange-500" />
              <span>ট্রানজেকশন হিস্টোরি</span>
            </button>
          </div>

          {/* Logout */}
          <div className="border-t border-zinc-100 p-1 mt-1">
            <button
              onClick={() => {
                setDropdownOpen(false);
                logoutStudent();
              }}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-red-50 text-red-600 transition-colors text-left font-bold cursor-pointer text-xs"
            >
              <LogOut size={14} />
              <span>লগ আউট</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
