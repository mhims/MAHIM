import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  GraduationCap,
  ArrowLeft,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Clock,
  AlertCircle,
  Copy,
  Check,
  RefreshCw,
  Lock,
  Unlock,
  CreditCard,
  Phone,
  User,
  ShieldCheck,
  ExternalLink,
  MessageSquare,
  ShoppingCart,
  Send,
} from 'lucide-react';
import { navigateTo } from '../utils/navigation';
import { getMentorshipCourseBySlug, MENTORSHIP_COURSES } from '../data/mentorshipCourses';
import {
  getCurrentStudent,
  StudentUser,
  getStudentCourseStatus,
  submitCourseEnrollment,
  syncStudentEnrollmentsFromGoogleSheet,
  CourseEnrollmentRecord,
} from '../utils/studentAuth';
import { StudentProfileModal, StudentHeaderMenu, ProfileModalTab } from './StudentProfileModal';

interface MentorshipCourseDetailPageProps {
  mentorSlug: string;
}

export const MentorshipCourseDetailPage: React.FC<MentorshipCourseDetailPageProps> = ({ mentorSlug }) => {
  const course = getMentorshipCourseBySlug(mentorSlug);

  const [currentStudent, setCurrentStudent] = useState<StudentUser | null>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [profileModalTab, setProfileModalTab] = useState<ProfileModalTab>('my_courses');

  // Enrollment Status: 'none' | 'pending' | 'ok' | 'fake'
  const [enrollmentStatus, setEnrollmentStatus] = useState<'none' | 'pending' | 'ok' | 'fake'>('none');
  const [enrollmentRecord, setEnrollmentRecord] = useState<CourseEnrollmentRecord | undefined>(undefined);

  // Form State
  const [paymentMethod, setPaymentMethod] = useState<'bKash' | 'Nagad'>('bKash');
  const [senderPhone, setSenderPhone] = useState('');
  const [trxId, setTrxId] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCheckingStatus, setIsCheckingStatus] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Copied helper
  const [copiedNumber, setCopiedNumber] = useState(false);

  // Official Payment Number strictly as requested: 01814946474 (Send Money via bKash / Nagad)
  const defaultPaymentNumber = '01814946474';

  // Load student & check course status
  const loadStatus = () => {
    const student = getCurrentStudent();
    setCurrentStudent(student);
    if (student && course) {
      const check = getStudentCourseStatus(student.phone, course.slug);
      setEnrollmentStatus(check.status);
      setEnrollmentRecord(check.record);
      if (student.whatsapp) {
        setWhatsapp(student.whatsapp);
      }
    } else {
      setEnrollmentStatus('none');
      setEnrollmentRecord(undefined);
    }
  };

  useEffect(() => {
    loadStatus();

    const handleAuthChange = (e: Event) => {
      const custom = e as CustomEvent<{ student: StudentUser | null }>;
      const student = custom.detail?.student || null;
      setCurrentStudent(student);
      if (student && course) {
        const check = getStudentCourseStatus(student.phone, course.slug);
        setEnrollmentStatus(check.status);
        setEnrollmentRecord(check.record);
      } else {
        setEnrollmentStatus('none');
        setEnrollmentRecord(undefined);
      }
    };

    const handleEnrollmentChange = () => {
      loadStatus();
    };

    window.addEventListener('student:auth_changed', handleAuthChange);
    window.addEventListener('student:enrollment_updated', handleEnrollmentChange);
    return () => {
      window.removeEventListener('student:auth_changed', handleAuthChange);
      window.removeEventListener('student:enrollment_updated', handleEnrollmentChange);
    };
  }, [mentorSlug, course]);

  // Handle "কোর্স কিনুন" button click
  const handleBuyCourseClick = () => {
    if (!currentStudent) {
      setProfileModalTab('my_courses');
      setIsProfileModalOpen(true);
      return;
    }
    const target = document.getElementById('payment-checkout-section');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'center' });
      target.classList.add('ring-4', 'ring-orange-400');
      setTimeout(() => target.classList.remove('ring-4', 'ring-orange-400'), 2500);
    }
  };

  // Sync with Google Sheet in realtime to check if admin marked 'OK' or 'FAKE'
  const handleRefreshStatus = async () => {
    if (!currentStudent) return;
    setIsCheckingStatus(true);
    setStatusMessage(null);
    try {
      await syncStudentEnrollmentsFromGoogleSheet(currentStudent.phone);
      loadStatus();
      setStatusMessage('গুগল শিট থেকে স্ট্যাটাস রিফ্রেশ সম্পন্ন হয়েছে।');
    } catch {
      setStatusMessage('স্ট্যাটাস রিফ্রেশ করতে সমস্যা হয়েছে, অনুগ্রহ করে আবার চেষ্টা করুন।');
    } finally {
      setIsCheckingStatus(false);
      setTimeout(() => setStatusMessage(null), 4000);
    }
  };

  // Submit payment details
  const handleSubmitEnrollment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentStudent) {
      setIsProfileModalOpen(true);
      return;
    }
    if (!course) return;

    const cleanSender = senderPhone.trim().replace(/[^0-9]/g, '');
    const cleanTrx = trxId.trim().toUpperCase();

    if (cleanSender.length < 11) {
      alert('অনুগ্রহ করে সঠিক ১১ ডিজিটের প্রেরক মোবাইল নম্বর প্রদান করুন (যেমন: 01XXXXXXXXX)');
      return;
    }

    if (!cleanTrx || cleanTrx.length < 4) {
      alert('সঠিক ট্রাঞ্জেকশন আইডি (TrxID) প্রদান করুন');
      return;
    }

    setIsSubmitting(true);
    try {
      const record = await submitCourseEnrollment({
        studentName: currentStudent.name,
        studentPhone: currentStudent.phone,
        whatsapp: whatsapp.trim() || currentStudent.whatsapp || currentStudent.phone,
        mentorSlug: course.slug,
        courseTitle: course.title,
        fee: course.priceFormatted,
        paymentMethod: `${paymentMethod} (Send Money)`,
        senderPhone: cleanSender,
        trxId: cleanTrx,
      });

      setEnrollmentRecord(record);
      setEnrollmentStatus('pending');
      window.scrollTo({ top: 300, behavior: 'smooth' });
    } catch (err) {
      console.error('Enrollment error:', err);
      alert('পেমেন্ট তথ্য সাবমিট করতে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।');
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedNumber(true);
    setTimeout(() => setCopiedNumber(false), 2000);
  };

  if (!course) {
    return (
      <div className="min-h-screen bg-[#fffbf7] flex items-center justify-center p-6 text-center font-['Hind_Siliguri',sans-serif]">
        <div className="bg-white p-8 rounded-3xl border border-orange-200 shadow-md max-w-md">
          <AlertCircle className="w-12 h-12 text-orange-600 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-zinc-900">কোর্সটি খুঁজে পাওয়া যায়নি</h2>
          <p className="text-sm text-zinc-600 mt-2 mb-6">
            আপনি যে মেন্টরশীপ কোর্সটি খুঁজছেন তা বর্তমানে সক্রিয় নেই বা লিংকটি সঠিক নয়।
          </p>
          <button
            onClick={() => navigateTo('/classroom/courses/mentorship')}
            className="px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl text-sm cursor-pointer"
          >
            সকল মেন্টরশীপ কোর্স দেখুন
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fffbf7] text-zinc-900 selection:bg-orange-500 selection:text-white font-sans relative overflow-x-hidden pb-24 md:pb-16">
      {/* Background Gradients */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[800px] h-[550px] rounded-full bg-gradient-to-b from-orange-200/50 via-amber-100/30 to-transparent blur-[120px]" />
        <div className="absolute top-[40%] -right-24 w-[420px] h-[420px] rounded-full bg-orange-100/60 blur-[120px]" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-orange-200/70 shadow-xs">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-2">
          {/* Logo */}
          <div
            onClick={() => navigateTo('/classroom/courses/mentorship')}
            className="flex items-center gap-2 sm:gap-3 cursor-pointer select-none min-w-0"
          >
            <div className="relative w-9 h-9 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-br from-orange-500 via-amber-500 to-orange-600 p-[2px] shadow-md shadow-orange-500/20 shrink-0">
              <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center">
                <GraduationCap className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600" />
              </div>
            </div>
            <div className="min-w-0">
              <span className="font-extrabold text-base sm:text-xl tracking-tight text-zinc-900 flex items-center">
                <span>Mahim's</span>
                <span className="text-orange-600 ml-1">Classroom</span>
              </span>
              <p className="text-[10px] sm:text-[11px] text-zinc-500 font-['Hind_Siliguri',sans-serif] font-medium leading-tight hidden xs:block truncate">
                মেন্টরশীপ কোর্স • mahims.com
              </p>
            </div>
          </div>

          {/* Navigation & User Menu */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            <button
              onClick={() => navigateTo('/classroom/courses/mentorship')}
              className="inline-flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl text-xs font-semibold text-zinc-700 hover:text-orange-600 bg-orange-50 hover:bg-orange-100 border border-orange-200/80 transition-colors font-['Hind_Siliguri',sans-serif] cursor-pointer shrink-0"
            >
              <ArrowLeft size={14} className="text-orange-600 shrink-0" />
              <span className="hidden sm:inline">সকল মেন্টরশীপ কোর্স</span>
              <span className="sm:hidden text-[11px]">সকল কোর্স</span>
            </button>

            {/* Student Header Menu with Dropdown (My Courses, Profile, Password, Transactions) */}
            <StudentHeaderMenu
              currentStudent={currentStudent}
              onOpenModal={(tab) => {
                setProfileModalTab(tab || 'my_courses');
                setIsProfileModalOpen(true);
              }}
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-8">
        {/* Clean Mentor Banner Image (No weird flying animations, no text covering mentor's face) */}
        <div className="relative w-full rounded-2xl sm:rounded-3xl overflow-hidden shadow-md border border-orange-200/90 bg-zinc-950 mb-6 sm:mb-8">
          <img
            src={course.bannerImage}
            alt={course.title}
            className="w-full h-auto object-cover block"
          />
        </div>

        {/* Dedicated Course Details & Enrollment Action Card */}
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-orange-200 p-5 sm:p-7 shadow-sm mb-8 font-['Hind_Siliguri',sans-serif]">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 pb-6 border-b border-zinc-100">
            <div className="space-y-3 flex-1 min-w-0">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 text-orange-800 border border-orange-200 text-xs font-bold uppercase tracking-wider">
                <Sparkles size={13} className="text-orange-600 shrink-0" />
                <span>{course.badge}</span>
              </div>

              <h1 className="text-xl sm:text-3xl font-black text-zinc-900 leading-snug">
                {course.title}
              </h1>

              <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
                {course.subtitle}
              </p>

              {/* Mentor Badges */}
              <div className="flex items-center gap-2 text-xs text-zinc-700 pt-1 flex-wrap">
                <span className="font-extrabold text-orange-600 bg-orange-50 px-3 py-1 rounded-lg border border-orange-200/80">
                  মেন্টর: {course.mentorName}
                </span>
                <span className="bg-zinc-100 px-3 py-1 rounded-lg text-zinc-600 font-medium">
                  {course.institution}
                </span>
                <span className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-lg border border-emerald-200 font-semibold">
                  আলাদা মেন্টরশীপ কোর্স
                </span>
              </div>
            </div>

            {/* Prominent Pricing & Course Buy Box */}
            {enrollmentStatus !== 'ok' && (
              <div className="bg-gradient-to-br from-orange-50 via-amber-50 to-orange-100/50 border-2 border-orange-300 rounded-2xl p-5 shrink-0 flex flex-col justify-between gap-4 md:w-80 shadow-sm">
                <div className="flex items-baseline justify-between">
                  <div>
                    <span className="text-[11px] text-zinc-500 font-semibold block">কোর্স ফি (এককালীন)</span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-black text-orange-600 font-sans">{course.priceFormatted}</span>
                      <span className="text-sm line-through text-zinc-400 font-sans">{course.originalPrice}</span>
                    </div>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-orange-600 text-white text-[10px] font-black uppercase shadow-xs">
                    ৮০% ছাড়
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleBuyCourseClick}
                  id="hero-buy-course-btn"
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-extrabold text-sm sm:text-base shadow-md shadow-orange-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                >
                  <ShoppingCart size={18} />
                  <span>কোর্স কিনুন (৯৯৳)</span>
                  <ArrowRight size={18} />
                </button>

                <p className="text-[11px] text-zinc-500 text-center leading-tight">
                  ⚡ বিকাশ বা নগদে সেন্ড মানি করে TrxID দিলেই এক্সেস
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Dynamic Enrollment & Course Access Section */}
        <div className="mt-8">
          {/* ========================================================================= */}
          {/* CASE 1: ACCESS GRANTED (Status = 'ok' in Google Sheet / Admin) */}
          {/* "আর এক্সেস পাওয়ার সাথে আপাতত খালি রাখো। আমি বলে দিবো একটু পরে ভিতরে কী কী থাকবে।" */}
          {/* ========================================================================= */}
          {enrollmentStatus === 'ok' && (
            <div
              id="course-access-granted-container"
              className="bg-white rounded-3xl border-2 border-emerald-400 p-6 sm:p-8 shadow-xl font-['Hind_Siliguri',sans-serif] space-y-6"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-100">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-7 h-7 text-emerald-600" />
                  </div>
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-1">
                      <Unlock size={12} />
                      <span>পেমেন্ট অনুমোদিত • অ্যাক্টিভ এক্সেস</span>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-black text-zinc-900">
                      অভিনন্দন, {currentStudent?.name}! কোর্সে স্বাগতম
                    </h2>
                    <p className="text-xs sm:text-sm text-zinc-600">
                      আপনার {course.mentorName}-এর মেন্টরশীপ কোর্সে এক্সেস সফলভাবে নিশ্চিত করা হয়েছে।
                    </p>
                  </div>
                </div>

                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl px-4 py-2.5 text-right sm:text-right shrink-0">
                  <span className="text-[11px] text-emerald-700 block font-semibold">ভেরিফাইড TrxID</span>
                  <span className="text-sm font-mono font-bold text-emerald-900">{enrollmentRecord?.trxId}</span>
                </div>
              </div>

              {/* Clean Empty Placeholder Area as explicitly instructed: */}
              {/* "আর এক্সেস পাওয়ার সাথে আপাতত খালি রাখো। আমি বলে দিবো একটু পরে ভিতরে কী কী থাকবে। আগে এটুকু করো" */}
              <div className="border-2 border-dashed border-emerald-300 rounded-3xl p-8 sm:p-12 text-center bg-emerald-50/30 space-y-3">
                <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-2xl flex items-center justify-center mx-auto shadow-xs">
                  <GraduationCap className="w-7 h-7" />
                </div>
                <h3 className="text-lg sm:text-xl font-black text-zinc-900">
                  কোর্স কনটেন্ট ড্যাশবোর্ড
                </h3>
                <p className="text-xs sm:text-sm text-zinc-600 max-w-lg mx-auto">
                  মেন্টরশীপের শিডিউল, লাইভ ক্লাসের লিংক, স্টাডি ম্যাটেরিয়ালস এবং শিক্ষার্থীদের প্রাইভেট হোয়াটসঅ্যাপ/টেলিগ্রাম গ্রুপ লিংক শীঘ্রই এখানে যুক্ত করা হবে।
                </p>
                <div className="pt-2">
                  <span className="inline-block px-4 py-1.5 rounded-full bg-white border border-emerald-200 text-emerald-800 text-xs font-bold shadow-xs">
                    🔔 নতুন কনটেন্ট যুক্ত হওয়া মাত্র এই ড্যাশবোর্ডে দেখতে পাবেন
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* CASE 2: PENDING REVIEW (Waiting for Admin to mark OK in Google Sheet) */}
          {/* ========================================================================= */}
          {enrollmentStatus === 'pending' && (
            <div
              id="course-access-pending-container"
              className="bg-amber-50/80 rounded-3xl border-2 border-amber-300 p-6 sm:p-8 shadow-lg font-['Hind_Siliguri',sans-serif] space-y-5"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start sm:items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                    <Clock className="w-7 h-7 text-amber-600 animate-pulse" />
                  </div>
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-200 text-amber-900 text-xs font-bold uppercase tracking-wider mb-1">
                      <Lock size={12} />
                      <span>পেমেন্ট ভেরিফিকেশন চলমান (Pending)</span>
                    </div>
                    <h2 className="text-lg sm:text-2xl font-black text-zinc-900">
                      আপনার পেমেন্ট রিকোয়েস্ট জমা হয়েছে
                    </h2>
                    <p className="text-xs sm:text-sm text-zinc-600">
                      অ্যাডমিন গুগল স্প্রেডশিট থেকে আপনার TrxID মিলিয়ে <strong>'OK'</strong> চিহ্নিত করলেই এই পেজে স্বয়ংক্রিয়ভাবে এক্সেস আনলক হবে।
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleRefreshStatus}
                  disabled={isCheckingStatus}
                  className="px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-amber-500 hover:bg-amber-600 text-white shadow-md shadow-amber-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0 disabled:opacity-50"
                >
                  <RefreshCw size={14} className={isCheckingStatus ? 'animate-spin' : ''} />
                  <span>{isCheckingStatus ? 'শিট চেক হচ্ছে...' : 'স্ট্যাটাস রিফ্রেশ করুন'}</span>
                </button>
              </div>

              {statusMessage && (
                <div className="p-3 bg-white border border-amber-200 rounded-xl text-xs text-amber-900 font-medium">
                  {statusMessage}
                </div>
              )}

              {/* Submitted Details Box */}
              <div className="bg-white rounded-2xl p-4 sm:p-5 border border-amber-200/90 shadow-xs grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                <div>
                  <span className="text-zinc-500 block">কোর্স</span>
                  <span className="font-bold text-zinc-900">{course.mentorName}</span>
                </div>
                <div>
                  <span className="text-zinc-500 block">পেমেন্ট মেথড</span>
                  <span className="font-bold text-zinc-900">{enrollmentRecord?.paymentMethod || 'bKash'}</span>
                </div>
                <div>
                  <span className="text-zinc-500 block">প্রেরক নম্বর</span>
                  <span className="font-bold font-mono text-zinc-900">{enrollmentRecord?.senderPhone}</span>
                </div>
                <div>
                  <span className="text-zinc-500 block">TrxID</span>
                  <span className="font-bold font-mono text-orange-600">{enrollmentRecord?.trxId}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs text-amber-800 bg-amber-100/60 p-3 rounded-xl">
                <Sparkles size={14} className="shrink-0 text-amber-700" />
                <span>
                  টিপস: অ্যাডমিন গুগল শিটে এই ট্রাঞ্জেকশনের পাশে <strong>OK</strong> লিখলেই এখানে রিফ্রেশ করলে সাথে সাথে আনলক হয়ে যাবে।
                </span>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* CASE 3: FAKE / INVALID (Marked 'FAKE' in Google Sheet / Admin) */}
          {/* ========================================================================= */}
          {enrollmentStatus === 'fake' && (
            <div
              id="course-access-fake-container"
              className="bg-red-50 rounded-3xl border-2 border-red-300 p-6 sm:p-8 shadow-lg font-['Hind_Siliguri',sans-serif] space-y-4"
            >
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                  <AlertCircle className="w-7 h-7 text-red-600" />
                </div>
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-red-200 text-red-900 text-xs font-bold uppercase tracking-wider mb-1">
                    <span>ভেরিফিকেশন ব্যর্থ • Fake TrxID</span>
                  </div>
                  <h2 className="text-lg sm:text-xl font-black text-red-900">
                    আপনার প্রদত্ত TrxID যাচাই করা সম্ভব হয়নি
                  </h2>
                  <p className="text-xs sm:text-sm text-red-700 mt-1">
                    অ্যাডমিন দ্বারা আপনার সাবমিট করা ট্রাঞ্জেকশন আইডিটি যাচাই করা যায়নি বা ভুল পরিলক্ষিত হয়েছে। অনুগ্রহ করে সঠিক পেমেন্ট তথ্য দিয়ে পুনরায় সাবমিট করুন।
                  </p>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => setEnrollmentStatus('none')}
                  className="px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-red-600 hover:bg-red-700 text-white shadow-md transition-all cursor-pointer"
                >
                  সঠিক TrxID দিয়ে পুনরায় সাবমিট করুন
                </button>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* CASE 4: NOT ENROLLED YET (Show Payment Instructions & Form) */}
          {/* ========================================================================= */}
          {enrollmentStatus === 'none' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 font-['Hind_Siliguri',sans-serif]">
              {/* Left Column: Course Highlights & Details */}
              <div className="lg:col-span-7 space-y-6">
                <div className="bg-white rounded-3xl border border-orange-200/90 p-6 sm:p-8 shadow-sm space-y-5">
                  <h3 className="text-lg sm:text-xl font-black text-zinc-900 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-orange-600" />
                    <span>মেন্টরশীপের বিশেষ সুবিধাসমূহ</span>
                  </h3>

                  <div className="space-y-3">
                    {course.highlights.map((hl, idx) => (
                      <div key={idx} className="flex items-start gap-3 text-sm text-zinc-700 bg-orange-50/50 p-3 rounded-2xl border border-orange-100">
                        <CheckCircle2 className="w-5 h-5 text-orange-600 shrink-0 mt-0.5" />
                        <span>{hl}</span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-4 border-t border-zinc-100">
                    <h4 className="font-bold text-sm text-zinc-900 mb-2">মেন্টর পরিচিতি:</h4>
                    <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
                      {course.bio}
                    </p>
                  </div>
                </div>

                {/* Curriculum / Topics Overview */}
                <div className="bg-white rounded-3xl border border-orange-200/90 p-6 sm:p-8 shadow-sm space-y-4">
                  <h3 className="text-lg font-black text-zinc-900">
                    কী কী থাকছে এই মেন্টরশীপে?
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {course.curriculumOverview.map((item, idx) => (
                      <div key={idx} className="p-3 bg-zinc-50 border border-zinc-200/80 rounded-2xl text-xs font-semibold text-zinc-800 flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-orange-100 text-orange-700 flex items-center justify-center text-[10px] font-black shrink-0">
                          {idx + 1}
                        </span>
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column: Enrollment & Payment Form */}
              <div className="lg:col-span-5 space-y-6" id="payment-checkout-section">
                {/* Payment Guide Box */}
                <div className="bg-gradient-to-br from-orange-500 via-amber-500 to-orange-600 text-white rounded-3xl p-6 sm:p-7 shadow-xl space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-orange-100 flex items-center gap-1.5">
                      <Send size={13} />
                      <span>সেন্ড মানি নির্দেশিকা</span>
                    </span>
                    <span className="px-3 py-0.5 rounded-full bg-white/20 text-white font-mono text-xs font-black">
                      ফি: {course.priceFormatted}
                    </span>
                  </div>

                  <h4 className="text-lg sm:text-xl font-black leading-snug">
                    বিকাশ বা নগদ-এ সেন্ড মানি করুন
                  </h4>

                  <p className="text-xs text-orange-50 leading-relaxed">
                    নিচের নম্বরে <strong>৯৯ টাকা সেন্ড মানি (Send Money)</strong> করুন। টাকা পাঠানোর পর প্রেরক নম্বর ও TrxID লিখে নিচের ফর্মটি পূরণ করুন।
                  </p>

                  <div className="bg-white/15 backdrop-blur-md rounded-2xl p-4 border border-white/25 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-orange-100 block uppercase font-mono tracking-wider">
                        বিকাশ / নগদ (Personal • Send Money)
                      </span>
                      <span className="font-mono text-xl font-black tracking-wider text-white select-all">
                        {defaultPaymentNumber}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => copyToClipboard(defaultPaymentNumber)}
                      className="px-3.5 py-2 rounded-xl bg-white text-orange-700 font-bold text-xs flex items-center gap-1.5 hover:bg-orange-50 transition-all cursor-pointer shadow-sm active:scale-95"
                    >
                      {copiedNumber ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
                      <span>{copiedNumber ? 'কপি হয়েছে' : 'কপি করুন'}</span>
                    </button>
                  </div>
                </div>

                {/* Submission Form Card */}
                <div className="bg-white rounded-3xl border border-orange-200/90 p-6 sm:p-7 shadow-lg">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-black text-lg text-zinc-900">
                      কোর্সে ভর্তির ফর্ম
                    </h4>
                    <span className="text-xs font-black text-orange-600 bg-orange-100 px-2.5 py-1 rounded-lg">
                      ফি: {course.priceFormatted}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-600 mb-5">
                    কার কোর্স কিনছেন: <strong className="text-orange-600">{course.mentorName}</strong>
                  </p>

                  {/* If not logged in -> Prompt Login */}
                  {!currentStudent ? (
                    <div className="text-center py-6 space-y-4 bg-orange-50/50 rounded-2xl border border-orange-200 p-5">
                      <div className="w-12 h-12 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center mx-auto">
                        <User className="w-6 h-6" />
                      </div>
                      <div>
                        <h5 className="font-bold text-sm text-zinc-900">
                          কোর্স কিনতে প্রথমে লগ ইন করুন
                        </h5>
                        <p className="text-xs text-zinc-600 mt-1">
                          আপনার নাম ও মোবাইল নম্বর দিয়ে সহজে লগ ইন করুন
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setProfileModalTab('my_courses');
                          setIsProfileModalOpen(true);
                        }}
                        id="form-login-trigger-btn"
                        className="w-full py-3 px-4 rounded-xl font-bold text-sm bg-orange-500 hover:bg-orange-600 text-white shadow-md shadow-orange-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                      >
                        <User size={16} />
                        <span>শিক্ষার্থী লগ ইন / সাইন আপ</span>
                      </button>
                    </div>
                  ) : (
                    /* Logged In -> Show Payment Submission Form */
                    <form onSubmit={handleSubmitEnrollment} className="space-y-4 text-xs">
                      {/* Logged in indicator */}
                      <div className="bg-orange-50/80 p-3 rounded-2xl border border-orange-200 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] text-zinc-500 block">শিক্ষার্থী</span>
                          <span className="font-bold text-zinc-900">{currentStudent.name}</span>
                          <span className="font-mono text-zinc-600 ml-1.5">({currentStudent.phone})</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setProfileModalTab('profile');
                            setIsProfileModalOpen(true);
                          }}
                          className="text-[11px] text-orange-600 font-bold hover:underline cursor-pointer"
                        >
                          প্রোফাইল
                        </button>
                      </div>

                      {/* Payment Method Selector (bKash & Nagad) */}
                      <div>
                        <label className="block font-bold text-zinc-700 mb-1.5">
                          পেমেন্ট মাধ্যম (সেন্ড মানি করেছেন যে মাধ্যমে) <span className="text-red-500">*</span>
                        </label>
                        <div className="grid grid-cols-2 gap-2.5">
                          {(['bKash', 'Nagad'] as const).map((method) => (
                            <button
                              key={method}
                              type="button"
                              onClick={() => setPaymentMethod(method)}
                              className={`py-2.5 px-3 rounded-xl font-bold border transition-all text-center cursor-pointer flex items-center justify-center gap-1.5 ${
                                paymentMethod === method
                                  ? 'bg-orange-500 text-white border-orange-500 shadow-md shadow-orange-500/25'
                                  : 'bg-zinc-50 hover:bg-zinc-100 text-zinc-700 border-zinc-200'
                              }`}
                            >
                              <Send size={13} />
                              <span>{method === 'bKash' ? 'বিকাশ সেন্ড মানি' : 'নগদ সেন্ড মানি'}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Sender Mobile Number */}
                      <div>
                        <label className="block font-bold text-zinc-700 mb-1.5">
                          প্রেরক মোবাইল নম্বর (যে নম্বর থেকে টাকা সেন্ড মানি করেছেন) <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                          <input
                            type="tel"
                            required
                            value={senderPhone}
                            onChange={(e) => setSenderPhone(e.target.value)}
                            placeholder="01XXXXXXXXX"
                            className="w-full pl-10 pr-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl font-mono text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white text-zinc-900"
                          />
                        </div>
                      </div>

                      {/* Transaction ID */}
                      <div>
                        <label className="block font-bold text-zinc-700 mb-1.5">
                          ট্রাঞ্জেকশন আইডি (TrxID) <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <CreditCard className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                          <input
                            type="text"
                            required
                            value={trxId}
                            onChange={(e) => setTrxId(e.target.value.toUpperCase())}
                            placeholder="যেমন: BLA789XY"
                            className="w-full pl-10 pr-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl font-mono text-sm uppercase focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white text-zinc-900"
                          />
                        </div>
                        <p className="text-[11px] text-zinc-500 mt-1">
                          টাকা সেন্ড মানি করার পর এসএমএস বা অ্যাপ থেকে প্রাপ্ত TrxID লিখুন।
                        </p>
                      </div>

                      {/* Submit Button */}
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-3.5 px-4 rounded-xl font-bold text-sm bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer mt-3 disabled:opacity-60 active:scale-95"
                      >
                        <Sparkles size={16} className="text-amber-200" />
                        <span>{isSubmitting ? 'তথ্য যাচাই করে জমা হচ্ছে...' : `পেমেন্ট তথ্য সাবমিট করুন (${course.priceFormatted})`}</span>
                      </button>

                      <p className="text-[11px] text-center text-zinc-500 pt-1">
                        🔒 আপনার পেমেন্ট তথ্য গুগল স্প্রেডশিটের মাধ্যমে সুরক্ষিতভাবে সংরক্ষিত ও যাচাই করা হবে।
                      </p>
                    </form>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Student Profile & Auth Modal */}
      <StudentProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        initialTab={profileModalTab}
        onSuccessLogin={(student) => {
          setCurrentStudent(student);
          loadStatus();
        }}
      />

      {/* Mobile Sticky Buy Action Bar (Always visible on mobile so button is never lost) */}
      {enrollmentStatus !== 'ok' && (
        <div className="fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-orange-200 px-4 py-2.5 sm:hidden shadow-2xl flex items-center justify-between gap-3 font-['Hind_Siliguri',sans-serif]">
          <div>
            <span className="text-[10px] text-zinc-500 block leading-none">কোর্স ফি</span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-xl font-black text-orange-600">{course.priceFormatted}</span>
              <span className="text-xs line-through text-zinc-400">{course.originalPrice}</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleBuyCourseClick}
            id="mobile-sticky-buy-btn"
            className="flex-1 max-w-[220px] py-2.5 px-4 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-black text-sm shadow-md shadow-orange-500/25 flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer"
          >
            <ShoppingCart size={16} />
            <span>কোর্স কিনুন (৯৯৳)</span>
            <ArrowRight size={14} />
          </button>
        </div>
      )}
    </div>
  );
};
