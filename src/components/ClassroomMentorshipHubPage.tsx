import React from 'react';
import {
  GraduationCap,
  ArrowLeft,
  Sparkles,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import { navigateTo } from '../utils/navigation';

export const ClassroomMentorshipHubPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#fffbf7] text-zinc-900 selection:bg-orange-500 selection:text-white font-sans relative overflow-x-hidden pb-20">
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
      <main className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-8">
        {/* Top Launch Banner - Pure Image with Animated Traveling Orange Light Beam Border */}
        <div className="relative mb-8 sm:mb-12 w-full p-[3px] rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl orange-pulsing-glow">
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

        {/* Coming Soon Section in English as requested */}
        <div className="bg-white rounded-3xl border border-orange-200/90 p-8 sm:p-12 shadow-sm text-center max-w-3xl mx-auto font-sans">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-100 text-orange-800 border border-orange-300 text-xs sm:text-sm font-bold uppercase tracking-wider mb-5 shadow-xs">
            <Sparkles size={16} className="text-orange-600" />
            <span>Official Program Announcement</span>
          </div>

          {/* Heading strictly in English */}
          <h1 className="text-3xl sm:text-5xl font-black text-zinc-900 tracking-tight leading-tight">
            Mentorship Course
          </h1>
          <p className="text-xl sm:text-2xl font-black text-orange-600 tracking-wide mt-2 uppercase">
            Coming Soon
          </p>

          {/* Status Note */}
          <p className="text-sm sm:text-base text-zinc-600 mt-4 leading-relaxed max-w-xl mx-auto font-['Hind_Siliguri',sans-serif]">
            আমাদের এক্সক্লুসিভ মেন্টরশীপ প্রোগ্রামের পূর্ণাঙ্গ গাইডলাইন, মেন্টরদের সেশন প্ল্যান ও ভর্তি প্রক্রিয়া খুব শীঘ্রই প্রকাশিত হতে যাচ্ছে। সাথেই থাকুন!
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => navigateTo('/classroom')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm shadow-md shadow-orange-500/25 transition-all font-['Hind_Siliguri',sans-serif] active:scale-95 cursor-pointer"
            >
              <ArrowLeft size={16} />
              <span>ক্লাসরুম মূল পাতায় ফিরে যান</span>
            </button>
            <button
              onClick={() => navigateTo('/classroom/courses')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-orange-50 hover:bg-orange-100 text-orange-800 border border-orange-200 font-bold text-sm transition-all font-['Hind_Siliguri',sans-serif] cursor-pointer"
            >
              <span>অন্যান্য কোর্স দেখুন</span>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};
