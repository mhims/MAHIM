import React, { useState, useEffect } from 'react';
import {
  GraduationCap,
  Sparkles,
  School,
  CheckCircle2,
  ChevronRight,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  BookMarked,
  X,
  Users,
  Award,
  ExternalLink
} from 'lucide-react';
import { navigateTo } from '../utils/navigation';
import { TEACHERS, type TeacherProfile } from '../data/teachers';

export const ClassroomInstructorPage: React.FC = () => {
  // Modal states for Quick Views
  const [selectedQuickViewSlug, setSelectedQuickViewSlug] = useState<string | null>(null);

  useEffect(() => {
    document.title = "শিক্ষক ও মেন্টর প্যানেল | Mahim's Classroom (মাহিম ক্লাসরুম)";
    window.scrollTo({ top: 0, behavior: 'instant' });

    const metaTags: Record<string, string> = {
      description: "মাহিম'স ক্লাসরুমের শিক্ষক ও মেন্টর প্যানেল। ঢাকা সেন্ট্রাল ইউনিভার্সিটি, ড্যাফোডিল, এমবিএসটিইউ, বেরোবি ও ইউআইইউ-এর অভিজ্ঞ ইন্সট্রাক্টরদের পরিচিতি ও শিক্ষাগত প্রোফাইল।",
      keywords: "Mahim's Classroom Instructors, শিক্ষক প্যানেল, মাহিম ইবনে খুদি, সামিউল ইসলাম সোহরাব, আবু সালেহ সুজা, মিশকাত শরীফ মিথেন, স্বচ্ছল কুমার কর্মকার",
    };

    Object.entries(metaTags).forEach(([name, val]) => {
      let el = document.querySelector(`meta[name="${name}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute('name', name);
        document.head.appendChild(el);
      }
      el.setAttribute('content', val);
    });
  }, []);

  const activeModalTeacher: TeacherProfile | undefined = selectedQuickViewSlug
    ? TEACHERS[selectedQuickViewSlug]
    : undefined;

  return (
    <div className="min-h-screen bg-[#fffbf7] text-zinc-900 selection:bg-orange-500 selection:text-white font-sans relative overflow-x-hidden pb-20">
      {/* Background Decorative Gradients */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[800px] h-[500px] rounded-full bg-gradient-to-b from-orange-200/50 via-amber-100/30 to-transparent blur-[120px]" />
        <div className="absolute top-[40%] -left-24 w-[400px] h-[400px] rounded-full bg-orange-100/50 blur-[120px]" />
        <div
          className="absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage: `radial-gradient(#f97316 0.75px, transparent 0.75px)`,
            backgroundSize: '28px 28px',
          }}
        />
      </div>

      {/* Navigation Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-orange-200/70 shadow-xs transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div
            className="flex items-center gap-3 cursor-pointer select-none"
            onClick={() => navigateTo('/classroom')}
          >
            <div className="relative w-11 h-11 rounded-2xl bg-gradient-to-br from-orange-500 via-amber-500 to-orange-600 p-[2px] shadow-md shadow-orange-500/20 shrink-0 group">
              <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center relative overflow-hidden transition-all group-hover:bg-orange-50">
                <GraduationCap className="w-6 h-6 text-orange-600 relative z-10 transform group-hover:scale-110 transition-transform" />
                <span className="absolute bottom-1 right-1 w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
              </div>
            </div>

            <div>
              <div className="flex items-center">
                <span className="font-extrabold text-lg sm:text-xl tracking-tight text-zinc-900 flex items-center">
                  <span>Mahim's</span>
                  <span className="text-orange-600 ml-1">Classroom</span>
                </span>
              </div>
              <p className="text-[11px] text-zinc-500 font-['Hind_Siliguri',sans-serif] font-medium leading-tight">
                শিক্ষক ও মেন্টর প্যানেল (Instructor Panel)
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center gap-1.5 sm:gap-3">
            <button
              onClick={() => navigateTo('/classroom')}
              className="text-xs font-semibold text-zinc-700 hover:text-orange-600 transition-colors px-3 py-2 font-['Hind_Siliguri',sans-serif] flex items-center gap-1 cursor-pointer"
            >
              <ArrowLeft size={14} className="text-orange-600" />
              <span>মূল ক্লাসরুম</span>
            </button>

            <button
              onClick={() => navigateTo('/classroom/courses')}
              className="text-xs font-semibold text-zinc-700 hover:text-orange-600 transition-colors px-3 py-2 font-['Hind_Siliguri',sans-serif] flex items-center gap-1 cursor-pointer"
            >
              <BookOpen size={14} className="text-orange-600" />
              <span>কোর্সসমূহ</span>
            </button>

            <button
              onClick={() => navigateTo('/')}
              className="hidden sm:inline-flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-medium text-zinc-600 hover:text-zinc-900 bg-orange-50 hover:bg-orange-100 border border-orange-200/80 transition-colors font-['Hind_Siliguri',sans-serif] cursor-pointer"
            >
              <span>পোর্টফোলিও</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 pb-16">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-['Hind_Siliguri',sans-serif] text-zinc-500 mb-6">
          <button
            onClick={() => navigateTo('/classroom')}
            className="hover:text-orange-600 transition-colors cursor-pointer"
          >
            ক্লাসরুম
          </button>
          <span>/</span>
          <span className="text-orange-600 font-bold">শিক্ষক প্যানেল (Instructors)</span>
        </div>

        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-100 text-orange-800 text-xs font-bold font-['Hind_Siliguri',sans-serif] mb-3 border border-orange-200">
            <Users size={14} className="text-orange-600" />
            <span>Mahim's Classroom • ফ্যাকাল্টি ও মেন্টর প্যানেল</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-zinc-900 tracking-tight leading-tight font-['Hind_Siliguri',sans-serif] mb-4">
            আমাদের অভিজ্ঞ শিক্ষক ও মেন্টরবৃন্দ
          </h1>
          <p className="text-xs sm:text-base text-zinc-600 font-['Hind_Siliguri',sans-serif] leading-relaxed">
            মুখস্থবিদ্যার বদলে কনসেপ্ট ক্ল্যারিটি এবং স্মার্ট এক্সাম স্ট্র্যাটেজিতে শিক্ষার্থীদের পথ প্রদর্শনে নিবেদিত আমাদের শিক্ষক টিম। প্রতিটি বিষয়ের জন্য রয়েছেন দক্ষ বিষয়ভিত্তিক মেন্টর।
          </p>
        </div>

        {/* Instructors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {/* 1. Mahim's Card */}
          <div
            id="instructor-card-mahim"
            className="group relative bg-white border-2 border-orange-300 hover:border-orange-500 rounded-3xl p-6 sm:p-7 shadow-md hover:shadow-xl hover:shadow-orange-500/10 transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
                {/* Photo */}
                <div className="relative shrink-0">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl p-1 bg-gradient-to-br from-orange-400 via-amber-400 to-orange-500 shadow-md shadow-orange-500/20">
                    <img
                      src="https://res.cloudinary.com/drvyjj7td/image/upload/v1788708908/behance_pp_spfumh.jpg"
                      alt="Mahim - Lead Mentor"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/mahim.jpg';
                      }}
                      className="w-full h-full object-cover rounded-[14px]"
                    />
                  </div>
                  <span className="absolute -bottom-2 -right-1 bg-white border border-orange-300 p-1 rounded-full text-orange-600 shadow-xs">
                    <CheckCircle2 size={15} />
                  </span>
                </div>

                {/* Identity */}
                <div className="text-center sm:text-left flex-1">
                  <h2 className="text-xl font-black text-zinc-900 group-hover:text-orange-600 transition-colors font-['Hind_Siliguri',sans-serif]">
                    মাহিম <span className="text-xs font-mono text-zinc-500 font-normal">(Mahim)</span>
                  </h2>

                  <p className="mt-1.5 text-xs sm:text-sm font-bold text-zinc-800 font-['Hind_Siliguri',sans-serif] flex items-center justify-center sm:justify-start gap-1.5">
                    <School size={15} className="text-orange-600 shrink-0" />
                    <span>ঢাকা সেন্ট্রাল ইউনিভার্সিটি</span>
                  </p>

                  <p className="mt-1 text-xs font-semibold text-orange-700 font-['Hind_Siliguri',sans-serif]">
                    ফাউন্ডার, মাহিম'স ক্লাসরুম
                  </p>
                </div>
              </div>

              {/* Badges / Highlights */}
              <div className="mt-4 pt-4 border-t border-orange-100 space-y-1.5">
                <div className="text-xs text-zinc-600 font-['Hind_Siliguri',sans-serif] flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-500 shrink-0" />
                  <span>রাষ্ট্রবিজ্ঞান বিভাগ, ঢাকা কলেজ ক্যাম্পাস</span>
                </div>
                <div className="text-xs text-zinc-600 font-['Hind_Siliguri',sans-serif] flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-500 shrink-0" />
                  <span>এইচএসসি ২০২৪: GPA 5.00 (বিজ্ঞান বিভাগ)</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 pt-4 border-t border-orange-100 flex items-center justify-between gap-2">
              <button
                onClick={() => navigateTo('/classroom/mahim')}
                id="mahim-page-btn"
                className="flex-1 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold bg-orange-500 hover:bg-orange-600 text-white shadow-md shadow-orange-500/20 transition-all flex items-center justify-center gap-1 font-['Hind_Siliguri',sans-serif] cursor-pointer active:scale-98"
              >
                <span>বিস্তারিত প্রোফাইল</span>
                <ChevronRight size={16} />
              </button>
              <button
                onClick={() => setSelectedQuickViewSlug('mahim')}
                title="কুইক ভিউ"
                className="p-2.5 rounded-xl border border-orange-200 hover:bg-orange-50 text-orange-600 transition-colors cursor-pointer"
              >
                <Sparkles size={16} />
              </button>
            </div>
          </div>

          {/* 2. Samiul Islam Sohrab's Card */}
          <div
            id="instructor-card-samiul"
            className="group relative bg-white border-2 border-orange-300 hover:border-orange-500 rounded-3xl p-6 sm:p-7 shadow-md hover:shadow-xl hover:shadow-orange-500/10 transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
                <div className="relative shrink-0">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl p-1 bg-gradient-to-br from-amber-400 via-orange-400 to-amber-500 shadow-md shadow-orange-500/20">
                    <img
                      src="https://res.cloudinary.com/drvyjj7td/image/upload/v1789228263/763122727_1365661164992767_5907311244126216229_n_y5bajt.jpg"
                      alt="সামিউল ইসলাম সোহরাব"
                      className="w-full h-full object-cover rounded-[14px]"
                    />
                  </div>
                  <span className="absolute -bottom-2 -right-1 bg-white border border-orange-300 p-1 rounded-full text-orange-600 shadow-xs">
                    <CheckCircle2 size={15} />
                  </span>
                </div>

                <div className="text-center sm:text-left flex-1">
                  <h2 className="text-xl font-black text-zinc-900 group-hover:text-orange-600 transition-colors font-['Hind_Siliguri',sans-serif]">
                    সামিউল ইসলাম সোহরাব
                  </h2>

                  <p className="mt-1.5 text-xs sm:text-sm font-bold text-orange-700 font-['Hind_Siliguri',sans-serif] flex items-center justify-center sm:justify-start gap-1.5">
                    <Sparkles size={14} className="text-orange-600 shrink-0" />
                    <span>ফাউন্ডার, সামনাদ একাডেমি</span>
                  </p>

                  <p className="mt-1 text-xs font-medium text-zinc-600 font-['Hind_Siliguri',sans-serif]">
                    ড্যাফোডিল ইন্টারন্যাশনাল ইউনিভার্সিটি
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-orange-100 space-y-1.5">
                <div className="text-xs text-zinc-600 font-['Hind_Siliguri',sans-serif] flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-500 shrink-0" />
                  <span>টপ ইনোভেশন মেন্টর ও একাডেমি পরিচালক</span>
                </div>
                <div className="text-xs text-zinc-600 font-['Hind_Siliguri',sans-serif] flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-500 shrink-0" />
                  <span>এইচএসসি ও বিশ্ববিদ্যালয় ভর্তি মেন্টরিং</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-orange-100 flex items-center justify-between gap-2">
              <button
                onClick={() => navigateTo('/classroom/samiul')}
                id="samiul-page-btn"
                className="flex-1 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold bg-orange-500 hover:bg-orange-600 text-white shadow-md shadow-orange-500/20 transition-all flex items-center justify-center gap-1 font-['Hind_Siliguri',sans-serif] cursor-pointer active:scale-98"
              >
                <span>বিস্তারিত প্রোফাইল</span>
                <ChevronRight size={16} />
              </button>
              <button
                onClick={() => setSelectedQuickViewSlug('samiul')}
                title="কুইক ভিউ"
                className="p-2.5 rounded-xl border border-orange-200 hover:bg-orange-50 text-orange-600 transition-colors cursor-pointer"
              >
                <Sparkles size={16} />
              </button>
            </div>
          </div>

          {/* 3. Abu Saleh Suja's Card */}
          <div
            id="instructor-card-suja"
            className="group relative bg-white border-2 border-orange-300 hover:border-orange-500 rounded-3xl p-6 sm:p-7 shadow-md hover:shadow-xl hover:shadow-orange-500/10 transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
                <div className="relative shrink-0">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl p-1 bg-gradient-to-br from-emerald-400 via-teal-400 to-orange-500 shadow-md shadow-orange-500/20">
                    <img
                      src="https://res.cloudinary.com/drvyjj7td/image/upload/v1789229348/518363223_1616327812659453_3831296542395096165_n_1_fak2cg.jpg"
                      alt="আবু সালেহ সুজা"
                      className="w-full h-full object-cover rounded-[14px]"
                    />
                  </div>
                  <span className="absolute -bottom-2 -right-1 bg-white border border-orange-300 p-1 rounded-full text-orange-600 shadow-xs">
                    <CheckCircle2 size={15} />
                  </span>
                </div>

                <div className="text-center sm:text-left flex-1">
                  <h2 className="text-xl font-black text-zinc-900 group-hover:text-orange-600 transition-colors font-['Hind_Siliguri',sans-serif]">
                    আবু সালেহ সুজা
                  </h2>

                  <p className="mt-1.5 text-xs sm:text-sm font-bold text-emerald-700 font-['Hind_Siliguri',sans-serif] flex items-center justify-center sm:justify-start gap-1.5">
                    <Sparkles size={14} className="text-emerald-600 shrink-0" />
                    <span>ফার্মেসি বিভাগ</span>
                  </p>

                  <p className="mt-1 text-xs font-medium text-zinc-700 font-['Hind_Siliguri',sans-serif] leading-tight">
                    মওলানা ভাসানী বিজ্ঞান ও প্রযুক্তি বিশ্ববিদ্যালয় (MBSTU)
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-orange-100 space-y-1.5">
                <div className="text-xs text-zinc-600 font-['Hind_Siliguri',sans-serif] flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                  <span>GST মেরিট স্কোরে শীর্ষ সাফল্য ও বিজ্ঞান স্পেশালিস্ট</span>
                </div>
                <div className="text-xs text-zinc-600 font-['Hind_Siliguri',sans-serif] flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                  <span>রসায়ন ও জীববিজ্ঞানের জটিল টপিক সহজ করার মেন্টর</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-orange-100 flex items-center justify-between gap-2">
              <button
                onClick={() => navigateTo('/classroom/suza')}
                id="suza-page-btn"
                className="flex-1 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold bg-orange-500 hover:bg-orange-600 text-white shadow-md shadow-orange-500/20 transition-all flex items-center justify-center gap-1 font-['Hind_Siliguri',sans-serif] cursor-pointer active:scale-98"
              >
                <span>বিস্তারিত প্রোফাইল</span>
                <ChevronRight size={16} />
              </button>
              <button
                onClick={() => setSelectedQuickViewSlug('suza')}
                title="কুইক ভিউ"
                className="p-2.5 rounded-xl border border-orange-200 hover:bg-orange-50 text-orange-600 transition-colors cursor-pointer"
              >
                <Sparkles size={16} />
              </button>
            </div>
          </div>

          {/* 4. Mishkat Sharif Mithen's Card */}
          <div
            id="instructor-card-mithen"
            className="group relative bg-white border-2 border-orange-300 hover:border-orange-500 rounded-3xl p-6 sm:p-7 shadow-md hover:shadow-xl hover:shadow-orange-500/10 transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
                <div className="relative shrink-0">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl p-1 bg-gradient-to-br from-blue-400 via-indigo-400 to-orange-500 shadow-md shadow-orange-500/20">
                    <img
                      src="https://res.cloudinary.com/drvyjj7td/image/upload/v1789229549/mithen10_nrizvj.png"
                      alt="মিশকাত শরীফ মিথেন"
                      className="w-full h-full object-cover rounded-[14px]"
                    />
                  </div>
                  <span className="absolute -bottom-2 -right-1 bg-white border border-orange-300 p-1 rounded-full text-orange-600 shadow-xs">
                    <CheckCircle2 size={15} />
                  </span>
                </div>

                <div className="text-center sm:text-left flex-1">
                  <h2 className="text-xl font-black text-zinc-900 group-hover:text-orange-600 transition-colors font-['Hind_Siliguri',sans-serif]">
                    মিশকাত শরীফ মিথেন
                  </h2>

                  <p className="mt-1.5 text-xs sm:text-sm font-bold text-zinc-800 font-['Hind_Siliguri',sans-serif] flex items-center justify-center sm:justify-start gap-1.5">
                    <School size={15} className="text-orange-600 shrink-0" />
                    <span>বেগম রোকেয়া বিশ্ববিদ্যালয় (BRUR)</span>
                  </p>

                  <p className="mt-1 text-xs font-semibold text-blue-700 font-['Hind_Siliguri',sans-serif]">
                    এডমিশন ও অ্যাকাডেমিক মেন্টর
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-orange-100 space-y-1.5">
                <div className="text-xs text-zinc-600 font-['Hind_Siliguri',sans-serif] flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                  <span>পাবলিক বিশ্ববিদ্যালয় ভর্তি পরীক্ষার অভিজ্ঞ মেন্টর</span>
                </div>
                <div className="text-xs text-zinc-600 font-['Hind_Siliguri',sans-serif] flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                  <span>প্রশ্ন প্যাটার্ন ও পরীক্ষার হলের সঠিক কৌশল</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-orange-100 flex items-center justify-between gap-2">
              <button
                onClick={() => navigateTo('/classroom/mithen')}
                id="mithen-page-btn"
                className="flex-1 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold bg-orange-500 hover:bg-orange-600 text-white shadow-md shadow-orange-500/20 transition-all flex items-center justify-center gap-1 font-['Hind_Siliguri',sans-serif] cursor-pointer active:scale-98"
              >
                <span>বিস্তারিত প্রোফাইল</span>
                <ChevronRight size={16} />
              </button>
              <button
                onClick={() => setSelectedQuickViewSlug('mithen')}
                title="কুইক ভিউ"
                className="p-2.5 rounded-xl border border-orange-200 hover:bg-orange-50 text-orange-600 transition-colors cursor-pointer"
              >
                <Sparkles size={16} />
              </button>
            </div>
          </div>

          {/* 5. Swocchol Kumar Karmakar's Card */}
          <div
            id="instructor-card-swocchol"
            className="group relative bg-white border-2 border-orange-300 hover:border-orange-500 rounded-3xl p-6 sm:p-7 shadow-md hover:shadow-xl hover:shadow-orange-500/10 transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
                <div className="relative shrink-0">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl p-1 bg-gradient-to-br from-violet-500 via-purple-500 to-orange-500 shadow-md shadow-orange-500/20">
                    <img
                      src="https://res.cloudinary.com/drvyjj7td/image/upload/v1789230531/517652750_1656096531980838_4437299103525287164_n_1_tqf8h0.jpg"
                      alt="স্বচ্ছল কুমার কর্মকার"
                      className="w-full h-full object-cover rounded-[14px]"
                    />
                  </div>
                  <span className="absolute -bottom-2 -right-1 bg-white border border-orange-300 p-1 rounded-full text-orange-600 shadow-xs">
                    <CheckCircle2 size={15} />
                  </span>
                </div>

                <div className="text-center sm:text-left flex-1">
                  <h2 className="text-xl font-black text-zinc-900 group-hover:text-orange-600 transition-colors font-['Hind_Siliguri',sans-serif]">
                    স্বচ্ছল কুমার কর্মকার
                  </h2>

                  <p className="mt-1 text-xs sm:text-sm font-bold text-orange-600 font-['Hind_Siliguri',sans-serif]">
                    কম্পিউটার সাইন্স এন্ড ইঞ্জিনিয়ারিং (CSE)
                  </p>

                  <p className="mt-1 text-xs sm:text-sm font-semibold text-zinc-800 font-['Hind_Siliguri',sans-serif] flex items-center justify-center sm:justify-start gap-1.5">
                    <School size={15} className="text-orange-600 shrink-0" />
                    <span>ইউনাইটেড ইন্টারন্যাশনাল ইউনিভার্সিটি</span>
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-orange-100 space-y-1.5">
                <div className="text-xs text-zinc-600 font-['Hind_Siliguri',sans-serif] flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-500 shrink-0" />
                  <span>সিএসই টেক ও অ্যালগরিদম স্পেশালিস্ট</span>
                </div>
                <div className="text-xs text-zinc-600 font-['Hind_Siliguri',sans-serif] flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-500 shrink-0" />
                  <span>আইসিটি ও প্রোগ্রামিং সমস্যা সহজে সমাধানের পথপ্রদর্শক</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-orange-100 flex items-center justify-between gap-2">
              <button
                onClick={() => navigateTo('/classroom/swocchol')}
                id="swocchol-page-btn"
                className="flex-1 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold bg-orange-500 hover:bg-orange-600 text-white shadow-md shadow-orange-500/20 transition-all flex items-center justify-center gap-1 font-['Hind_Siliguri',sans-serif] cursor-pointer active:scale-98"
              >
                <span>বিস্তারিত প্রোফাইল</span>
                <ChevronRight size={16} />
              </button>
              <button
                onClick={() => setSelectedQuickViewSlug('swocchol')}
                title="কুইক ভিউ"
                className="p-2.5 rounded-xl border border-orange-200 hover:bg-orange-50 text-orange-600 transition-colors cursor-pointer"
              >
                <Sparkles size={16} />
              </button>
            </div>
          </div>

          {/* 6. Upcoming Expansion Card */}
          <div className="bg-white/80 border-2 border-dashed border-orange-300 hover:border-orange-400 rounded-3xl p-6 flex flex-col items-center justify-center text-center transition-all shadow-xs">
            <div className="w-12 h-12 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center mb-3">
              <Users size={24} />
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-orange-100 text-orange-800 mb-2 font-['Hind_Siliguri',sans-serif]">
              <Sparkles size={13} className="text-orange-600" />
              <span>শীঘ্রই আরও যুক্ত হচ্ছে</span>
            </div>
            <h3 className="text-lg font-bold text-zinc-900 font-['Hind_Siliguri',sans-serif] mb-1.5">
              পাবলিক ও প্রযুক্তি বিশ্ববিদ্যালয় প্যানেল
            </h3>
            <p className="text-xs text-zinc-600 max-w-xs font-['Hind_Siliguri',sans-serif] leading-relaxed">
              শীর্ষস্থানীয় পাবলিক বিশ্ববিদ্যালয় এবং প্রযুক্তি বিশ্ববিদ্যালয়ের অভিজ্ঞ মেন্টরদের নিয়ে মাহিম’স ক্লাসরুমের প্যানেল প্রতিনিয়ত সমৃদ্ধ হচ্ছে।
            </p>
          </div>
        </div>

        {/* CTA to Courses Page */}
        <div className="mt-16 bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 rounded-3xl p-6 sm:p-10 text-white shadow-xl shadow-orange-500/20 flex flex-col sm:flex-row items-center justify-between gap-6 max-w-6xl mx-auto">
          <div className="text-center sm:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-xs text-xs font-bold mb-2">
              <BookOpen size={14} />
              <span>Mahim's Classroom Courses</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black font-['Hind_Siliguri',sans-serif]">
              আমাদের কোর্স ও স্পেশাল ব্যাচসমূহ
            </h3>
            <p className="text-xs sm:text-sm text-orange-100 mt-1 max-w-xl font-['Hind_Siliguri',sans-serif]">
              এইচএসসি আইসিটি, ভার্সিটি এডমিশন স্মার্ট এক্সাম ব্যাচ এবং এসএসসি একাডেমিক কোর্সের পূর্ণাঙ্গ তালিকা দেখুন।
            </p>
          </div>

          <button
            onClick={() => navigateTo('/classroom/courses')}
            className="shrink-0 px-6 py-3.5 rounded-xl bg-white text-orange-700 font-bold text-xs sm:text-sm shadow-md hover:bg-orange-50 transition-all font-['Hind_Siliguri',sans-serif] flex items-center gap-2 cursor-pointer active:scale-95"
          >
            <span>সকল কোর্স দেখুন</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </main>

      {/* Quick View Modal */}
      {activeModalTeacher && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-lg bg-white border-2 border-orange-400 rounded-3xl p-6 sm:p-8 shadow-2xl text-left overflow-hidden max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedQuickViewSlug(null)}
              className="absolute top-4 right-4 p-2 rounded-xl bg-orange-50 text-zinc-500 hover:text-zinc-900 hover:bg-orange-100 transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-2xl p-1 bg-gradient-to-br from-orange-400 to-amber-500 shrink-0 shadow-md">
                <img
                  src={activeModalTeacher.photoUrl}
                  alt={activeModalTeacher.name}
                  className="w-full h-full object-cover rounded-[12px]"
                />
              </div>

              <div>
                <span className="px-2.5 py-0.5 rounded-md bg-orange-100 text-orange-700 text-[11px] font-bold font-['Hind_Siliguri',sans-serif]">
                  শিক্ষক ও মেন্টর পরিচিতি
                </span>
                <h3 className="text-xl font-black text-zinc-900 font-['Hind_Siliguri',sans-serif] mt-0.5">
                  {activeModalTeacher.name}
                </h3>
                <p className="text-xs font-semibold text-orange-600 font-['Hind_Siliguri',sans-serif]">
                  {activeModalTeacher.role}
                </p>
                <p className="text-[12px] text-zinc-700 font-bold mt-0.5">
                  {activeModalTeacher.institution}
                </p>
              </div>
            </div>

            {/* Complete Academic Details */}
            <div className="space-y-3 mb-6">
              <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-wider font-mono flex items-center gap-1.5">
                <GraduationCap size={16} className="text-orange-600" />
                <span>বিস্তারিত শিক্ষাগত তথ্য:</span>
              </h4>

              {activeModalTeacher.education.map((edu, idx) => (
                <div key={idx} className="bg-orange-50/80 border border-orange-200 rounded-2xl p-4">
                  <div className="flex items-center justify-between text-xs font-bold text-orange-700 font-['Hind_Siliguri',sans-serif]">
                    <span className="flex items-center gap-1">
                      <School size={14} className="text-orange-600" />
                      {edu.status}
                    </span>
                    {edu.session && (
                      <span className="font-mono bg-white px-2 py-0.5 rounded border border-orange-200 text-zinc-700">
                        সেশন: {edu.session}
                      </span>
                    )}
                  </div>
                  <p className="text-sm font-bold text-zinc-900 mt-2 font-['Hind_Siliguri',sans-serif]">
                    {edu.institution}
                  </p>
                  <p className="text-xs text-orange-800 font-medium mt-1 font-['Hind_Siliguri',sans-serif]">
                    {edu.degree}
                  </p>
                </div>
              ))}

              {activeModalTeacher.highlights && activeModalTeacher.highlights.length > 0 && (
                <div className="bg-white border border-orange-200 rounded-2xl p-3.5 shadow-xs space-y-2">
                  {activeModalTeacher.highlights.map((h, i) => (
                    <div key={i} className="flex items-center justify-between text-xs font-bold text-zinc-800 font-['Hind_Siliguri',sans-serif]">
                      <span>{h.label}</span>
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-mono font-bold text-[11px] border border-emerald-300">
                        {h.value}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Philosophy */}
            <div className="bg-orange-100/70 border border-orange-200 rounded-2xl p-4 mb-6">
              <p className="text-xs text-zinc-800 font-['Hind_Siliguri',sans-serif] leading-relaxed">
                💡 <span className="font-bold text-orange-900">শিক্ষাদানের দর্শন:</span> {activeModalTeacher.teachingPhilosophy}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  setSelectedQuickViewSlug(null);
                  navigateTo(`/classroom/${activeModalTeacher.slug}`);
                }}
                className="flex-1 py-3 rounded-xl font-bold text-xs sm:text-sm bg-orange-500 hover:bg-orange-600 text-white text-center transition-all shadow-md font-['Hind_Siliguri',sans-serif] cursor-pointer"
              >
                পূর্ণাঙ্গ প্রোফাইল পেজে যান ➔
              </button>
              <button
                onClick={() => setSelectedQuickViewSlug(null)}
                className="px-5 py-3 rounded-xl text-xs font-semibold bg-zinc-100 hover:bg-zinc-200 text-zinc-700 transition-colors font-['Hind_Siliguri',sans-serif] cursor-pointer"
              >
                বন্ধ করুন
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
