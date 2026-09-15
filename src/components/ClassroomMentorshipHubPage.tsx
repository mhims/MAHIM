import React, { useState } from 'react';
import {
  GraduationCap,
  ArrowLeft,
  Sparkles,
  BookOpen,
  Phone,
  User,
  X,
  CheckCircle2,
} from 'lucide-react';
import { navigateTo } from '../utils/navigation';
import { ClassroomMentorshipCoursesSection } from './ClassroomMentorshipCoursesSection';
import { saveClassroomRegistration } from '../utils/classroomStorage';
import type { MentorCourseInfo } from '../data/mentorshipDetails';

export const ClassroomMentorshipHubPage: React.FC = () => {
  // Buy / Pre-registration modal state
  const [isBuyModalOpen, setIsBuyModalOpen] = useState(false);
  const [buyCourseTitle, setBuyCourseTitle] = useState('');
  const [studentName, setStudentName] = useState('');
  const [studentPhone, setStudentPhone] = useState('');
  const [studentMessage, setStudentMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleBuyCourse = (course: MentorCourseInfo) => {
    const title = course.isCombo
      ? 'কম্বো মেন্টরশীপ কোর্স (All Mentors Combo)'
      : `মেন্টরশীপ কোর্স - ${course.mentorNameBn} (${course.institution})`;
    setBuyCourseTitle(title);
    setFormSubmitted(false);
    setIsBuyModalOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName.trim() || !studentPhone.trim()) return;

    setIsSubmitting(true);
    try {
      saveClassroomRegistration({
        name: studentName,
        phone: studentPhone,
        course: buyCourseTitle,
        message: studentMessage,
      });
      await new Promise((resolve) => setTimeout(resolve, 400));
    } catch {
      // ignore
    } finally {
      setIsSubmitting(false);
      setFormSubmitted(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#fffbf7] text-zinc-900 selection:bg-orange-500 selection:text-white font-sans relative overflow-x-clip pb-28 sm:pb-20">
      {/* Background Decorative Warm Gradients */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] sm:w-[1000px] h-[550px] rounded-full bg-gradient-to-b from-orange-200/50 via-amber-100/30 to-transparent blur-[120px]" />
        <div className="absolute top-[35%] -right-24 w-[420px] h-[420px] rounded-full bg-orange-100/60 blur-[120px]" />
        <div
          className="absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage: `radial-gradient(#f97316 0.75px, transparent 0.75px)`,
            backgroundSize: '28px 28px',
          }}
        />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-orange-200/70 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-2">
          {/* Logo */}
          <div
            onClick={() => navigateTo('/classroom')}
            className="flex items-center gap-2.5 sm:gap-3 cursor-pointer select-none min-w-0"
            id="mentorship-hub-logo"
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
                mahims.com/classroom/courses/mentorship
              </p>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => navigateTo('/classroom/courses')}
              className="hidden sm:inline-flex text-xs font-semibold text-zinc-700 hover:text-orange-600 transition-colors px-3 py-2 font-['Hind_Siliguri',sans-serif] cursor-pointer"
            >
              সকল কোর্স
            </button>

            {/* Back to Classroom */}
            <button
              onClick={() => navigateTo('/classroom')}
              id="back-to-classroom-btn"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold text-zinc-700 hover:text-orange-600 bg-orange-50 hover:bg-orange-100 border border-orange-200 transition-colors font-['Hind_Siliguri',sans-serif] cursor-pointer shrink-0"
            >
              <ArrowLeft size={15} className="text-orange-600 shrink-0" />
              <span>ক্লাসরুম মূল পাতা</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-8">
        {/* Top Launch Banner - Pure Image with Animated Traveling Orange Light Beam Border */}
        <div className="relative mb-6 sm:mb-10 w-full p-[3px] rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl orange-pulsing-glow">
          {/* Traveling Orange Light Beam traveling continuously around the border */}
          <div className="absolute inset-[-150%] animate-spin-slow bg-[conic-gradient(from_0deg,transparent_0_300deg,#ea580c_320deg,#f97316_340deg,#fbbf24_355deg,#fff7ed_360deg)] pointer-events-none" />

          {/* Inner image container */}
          <div className="relative w-full h-full rounded-[13px] sm:rounded-[21px] overflow-hidden bg-zinc-950">
            <img
              src="https://res.cloudinary.com/drvyjj7td/image/upload/v1789306292/mentorship_qt39pi.jpg"
              alt="Mentorship Course - Mahim's Classroom"
              className="w-full h-auto object-cover block"
            />
          </div>
        </div>

        {/* Mentorship Courses: 1 Combo Course + 4 Individual Courses */}
        <ClassroomMentorshipCoursesSection
          onBuyCourse={handleBuyCourse}
        />
      </main>

      {/* Course Purchase / Pre-registration Modal */}
      {isBuyModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
          onClick={() => setIsBuyModalOpen(false)}
        >
          <div
            className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-orange-200 p-6 sm:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsBuyModalOpen(false)}
              aria-label="Close"
              className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-700 w-8 h-8 rounded-full flex items-center justify-center hover:bg-orange-50 cursor-pointer transition-colors"
            >
              <X size={18} />
            </button>

            {!formSubmitted ? (
              <>
                <div className="text-center mb-6">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 text-orange-800 text-xs font-bold mb-2">
                    <Sparkles size={14} className="text-orange-600" />
                    <span>কোর্স এনরোলমেন্ট / বুকিং</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-zinc-900 font-['Hind_Siliguri',sans-serif]">
                    মেন্টরশীপ কোর্স বুকিং
                  </h3>
                  <p className="text-xs text-orange-700 font-bold mt-1 font-['Hind_Siliguri',sans-serif]">
                    {buyCourseTitle}
                  </p>
                  <p className="text-xs text-zinc-500 mt-1 font-['Hind_Siliguri',sans-serif]">
                    আপনার নাম ও ফোন নম্বর দিয়ে প্রি-বুক করে রাখুন। পেমেন্ট গেটওয়ে ও বিস্তারিত সরাসরি আপনার নম্বরে জানিয়ে দেওয়া হবে।
                  </p>
                </div>

                <form onSubmit={handleFormSubmit} className="space-y-4 font-['Hind_Siliguri',sans-serif]">
                  <div>
                    <label className="block text-xs font-bold text-zinc-700 mb-1">
                      শিক্ষার্থীর নাম *
                    </label>
                    <div className="relative">
                      <User size={16} className="absolute left-3.5 top-3.5 text-zinc-400" />
                      <input
                        type="text"
                        required
                        value={studentName}
                        onChange={(e) => setStudentName(e.target.value)}
                        placeholder="আপনার পূর্ণ নাম লিখুন"
                        className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-orange-200 text-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 bg-orange-50/30"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-700 mb-1">
                      মোবাইল নম্বর (WhatsApp) *
                    </label>
                    <div className="relative">
                      <Phone size={16} className="absolute left-3.5 top-3.5 text-zinc-400" />
                      <input
                        type="tel"
                        required
                        value={studentPhone}
                        onChange={(e) => setStudentPhone(e.target.value)}
                        placeholder="01XXXXXXXXX"
                        className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-orange-200 text-sm focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 bg-orange-50/30 font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-700 mb-1">
                      মন্তব্য বা কোনো প্রশ্ন (ঐচ্ছিক)
                    </label>
                    <textarea
                      value={studentMessage}
                      onChange={(e) => setStudentMessage(e.target.value)}
                      placeholder="আপনার লক্ষ্য বা কোনো বিশেষ জিজ্ঞাসা থাকলে লিখুন..."
                      rows={2}
                      className="w-full p-3 rounded-xl border border-orange-200 text-xs focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 bg-orange-50/30"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-lg shadow-orange-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <span>সংরক্ষণ হচ্ছে...</span>
                    ) : (
                      <>
                        <span>বুকিং সম্পন্ন করুন</span>
                        <Sparkles size={16} />
                      </>
                    )}
                  </button>
                </form>
              </>
            ) : (
              <div className="text-center py-4 font-['Hind_Siliguri',sans-serif]">
                <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4 border border-emerald-200 shadow-sm">
                  <CheckCircle2 size={30} />
                </div>
                <h4 className="text-xl font-bold text-zinc-900 mb-1">
                  বুকিং সফল হয়েছে!
                </h4>
                <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed mb-6">
                  ধন্যবাদ, <span className="font-bold text-zinc-900">{studentName}</span>! <span className="text-orange-600 font-semibold">{buyCourseTitle}</span> এর জন্য আপনার অনুরোধ গৃহীত হয়েছে। শীঘ্রই আমাদের টিম আপনার নম্বরে যোগাযোগ করবে।
                </p>
                <button
                  onClick={() => setIsBuyModalOpen(false)}
                  className="w-full py-3 rounded-xl font-bold text-sm bg-orange-500 hover:bg-orange-600 text-white transition-all shadow-md"
                >
                  ঠিক আছে
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
