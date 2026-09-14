import React, { useState, useEffect } from 'react';
import {
  GraduationCap,
  ArrowLeft,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  ExternalLink,
  BookOpen,
  User,
  ShieldCheck,
  Flame,
  Award,
  Share2,
  Copy,
  Check,
} from 'lucide-react';
import { navigateTo } from '../utils/navigation';
import { ALL_COURSES, CourseItem } from '../data/courses';

interface ExternalCourseDetailPageProps {
  courseId: 'octal-1-hsc-ict' | 'bangla-boss-2-course';
}

export const ExternalCourseDetailPage: React.FC<ExternalCourseDetailPageProps> = ({ courseId }) => {
  const course: CourseItem | undefined = ALL_COURSES.find((c) => c.id === courseId);
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const fullUrl = `https://mahims.com${course?.actionUrl || `/classroom/courses/${courseId}`}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${course?.title || 'Octal 1.0'} — Mahims Classroom`,
          text: course?.description || 'মাহিম ক্লাসরুম কোর্স বিস্তারিত',
          url: fullUrl,
        });
        return;
      } catch {
        // Fallback to clipboard if cancelled or not allowed
      }
    }

    if (navigator.clipboard) {
      await navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  useEffect(() => {
    if (course) {
      document.title = `${course.title} | Mahim's Classroom`;
      window.scrollTo({ top: 0, behavior: 'instant' });

      // Dynamic OpenGraph & Meta
      const metaMap: Record<string, string> = {
        description: course.description,
        'og:title': `${course.title} | Mahim's Classroom`,
        'og:description': course.description,
        'og:image': course.imageUrl || 'https://mahims.com/assets/og-classroom.jpg',
        'twitter:title': `${course.title} | Mahim's Classroom`,
        'twitter:description': course.description,
        'twitter:image': course.imageUrl || 'https://mahims.com/assets/og-classroom.jpg',
      };

      Object.entries(metaMap).forEach(([prop, val]) => {
        let el = document.querySelector(`meta[property="${prop}"]`) || document.querySelector(`meta[name="${prop}"]`);
        if (el) {
          el.setAttribute('content', val);
        } else {
          el = document.createElement('meta');
          if (prop.startsWith('og:')) {
            el.setAttribute('property', prop);
          } else {
            el.setAttribute('name', prop);
          }
          el.setAttribute('content', val);
          document.head.appendChild(el);
        }
      });
    }
  }, [course]);

  if (!course) {
    return (
      <div className="min-h-screen bg-[#fffbf7] flex flex-col items-center justify-center p-4">
        <h2 className="text-xl font-bold text-zinc-900 mb-4 font-['Hind_Siliguri',sans-serif]">কোর্সটি পাওয়া যায়নি</h2>
        <button
          onClick={() => navigateTo('/classroom/courses')}
          className="px-6 py-2.5 rounded-xl bg-orange-500 text-white font-bold text-sm font-['Hind_Siliguri',sans-serif]"
        >
          সব কোর্সে ফিরে যান
        </button>
      </div>
    );
  }

  const buyUrl = course.externalBuyUrl || '#';

  return (
    <div className="min-h-screen bg-[#fffbf7] text-zinc-900 selection:bg-orange-500 selection:text-white font-sans relative overflow-x-hidden pb-24">
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
            id="course-detail-logo"
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
                {course.actionUrl?.replace(/^\//, 'mahims.com/')}
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
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-10">
        {/* Breadcrumb & Share Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-2 text-xs sm:text-sm text-zinc-500 font-['Hind_Siliguri',sans-serif] flex-wrap">
            <span onClick={() => navigateTo('/classroom')} className="hover:text-orange-600 cursor-pointer">
              ক্লাসরুম
            </span>
            <span>/</span>
            <span onClick={() => navigateTo('/classroom/courses')} className="hover:text-orange-600 cursor-pointer">
              কোর্সসমূহ
            </span>
            <span>/</span>
            <span className="text-zinc-900 font-bold truncate max-w-xs sm:max-w-md">{course.title}</span>
          </div>

          <button
            onClick={handleShare}
            id="share-course-btn"
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-white hover:bg-orange-50 text-zinc-700 hover:text-orange-600 border border-orange-200 shadow-xs transition-all cursor-pointer self-start sm:self-auto"
            title="লিংক কপি করুন বা শেয়ার করুন"
          >
            {copied ? (
              <>
                <Check size={14} className="text-emerald-600" />
                <span className="text-emerald-700">লিংক কপি হয়েছে!</span>
              </>
            ) : (
              <>
                <Share2 size={14} className="text-orange-600" />
                <span>লিংক শেয়ার করুন</span>
              </>
            )}
          </button>
        </div>

        {/* 2-Column Responsive Layout: Left Description & Highlights, Right Course Thumbnail & Buy Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 items-start">
          {/* Left Column (Content & Details - 7 cols) */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-8 font-['Hind_Siliguri',sans-serif]">
            {/* Title Card */}
            <div className="bg-white rounded-3xl border border-orange-200/90 p-6 sm:p-8 shadow-sm">
              <div className="flex items-center gap-2 flex-wrap mb-4">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-orange-100 text-orange-800 border border-orange-300">
                  {course.categoryLabel}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-zinc-100 text-zinc-700 border border-zinc-200">
                  {course.targetBadge}
                </span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-extrabold text-zinc-950 tracking-tight leading-snug mb-5">
                {course.title}
              </h1>

              {/* Instructors Panel */}
              {course.instructors && (
                <div className="p-4 rounded-2xl bg-orange-50/70 border border-orange-200/80 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div
                    onClick={() => navigateTo('/classroom/mahim')}
                    className="flex items-center gap-2.5 cursor-pointer group"
                    title="মাহিম-এর প্রোফাইল দেখুন"
                  >
                    <div className="w-9 h-9 rounded-xl bg-orange-500 text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-xs group-hover:scale-105 transition-transform">
                      <User size={18} />
                    </div>
                    <div>
                      <p className="text-[11px] text-zinc-500 font-semibold uppercase tracking-wider">
                        Instructor
                      </p>
                      <p className="text-sm font-bold text-zinc-900 group-hover:text-orange-600 transition-colors">
                        {course.instructors.main} &rarr;
                      </p>
                    </div>
                  </div>

                  <div className="hidden sm:block w-[1px] h-8 bg-orange-200" />

                  <div
                    onClick={() => navigateTo('/classroom/samiul')}
                    className="flex items-center gap-2.5 cursor-pointer group"
                    title="সামিউল সোহরাব-এর প্রোফাইল দেখুন"
                  >
                    <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-xs group-hover:scale-105 transition-transform">
                      <User size={18} />
                    </div>
                    <div>
                      <p className="text-[11px] text-zinc-500 font-semibold uppercase tracking-wider">
                        Co-Instructor
                      </p>
                      <p className="text-sm font-bold text-zinc-900 group-hover:text-orange-600 transition-colors">
                        {course.instructors.co} &rarr;
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Main Course Full Story / Text Description */}
              <div className="text-sm sm:text-base text-zinc-700 leading-relaxed space-y-4 whitespace-pre-line border-t border-orange-100 pt-5">
                {course.fullDescription || course.description}
              </div>
            </div>

            {/* What is in this course (🎯 কোর্সে যা থাকছে) */}
            {course.courseFeatures && (
              <div className="bg-white rounded-3xl border border-orange-200/90 p-6 sm:p-8 shadow-sm space-y-4">
                <h3 className="text-lg sm:text-xl font-black text-zinc-950 flex items-center gap-2">
                  <span className="text-xl">🎯</span>
                  <span>কোর্সে যা থাকছে:</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  {course.courseFeatures.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2.5 p-3 rounded-xl bg-orange-50/50 border border-orange-100 text-xs sm:text-sm text-zinc-800"
                    >
                      <CheckCircle2 size={16} className="text-orange-600 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Why This Course Section (🚀 কেন এই কোর্সটি করবেন?) */}
            {course.whyThisCourse && (
              <div className="bg-gradient-to-br from-orange-500/10 via-amber-50/50 to-white rounded-3xl border border-orange-300/80 p-6 sm:p-8 shadow-sm space-y-3">
                <h3 className="text-lg sm:text-xl font-black text-zinc-950 flex items-center gap-2">
                  <Flame size={20} className="text-orange-600" />
                  <span>{course.whyThisCourse.title}</span>
                </h3>
                <p className="text-sm sm:text-base text-zinc-700 leading-relaxed">
                  {course.whyThisCourse.text}
                </p>
                {course.whyThisCourse.tagline && (
                  <p className="text-sm sm:text-base font-bold text-orange-700 pt-2 border-t border-orange-200/60">
                    {course.whyThisCourse.tagline}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Right Column (Sticky Card with Image, Title, and Buy Button - 5 cols) */}
          <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-5 font-['Hind_Siliguri',sans-serif]">
            <div className="bg-white rounded-3xl border-2 border-orange-200/90 p-5 sm:p-6 shadow-xl shadow-orange-500/10">
              {/* Image with glow border */}
              <div className="relative w-full rounded-2xl overflow-hidden bg-zinc-950 border border-orange-200 shadow-md mb-5 aspect-[16/9] group">
                <img
                  src={course.imageUrl}
                  alt={course.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 block"
                />
              </div>

              {/* Course Title on right card */}
              <h2 className="text-xl sm:text-2xl font-black text-zinc-950 mb-2 leading-snug">
                {course.title}
              </h2>
              <p className="text-xs sm:text-sm text-zinc-500 mb-6 leading-relaxed">
                {course.description}
              </p>

              {/* Pricing or Platform Note */}
              <div className="bg-orange-50/80 rounded-2xl p-4 border border-orange-200/80 mb-6 space-y-2">
                <div className="flex items-center justify-between text-xs sm:text-sm font-semibold text-zinc-700">
                  <span>প্লাটফর্ম:</span>
                  <span className="font-bold text-zinc-900">Samnad Academy</span>
                </div>
                <div className="flex items-center justify-between text-xs sm:text-sm font-semibold text-zinc-700">
                  <span>ক্লাসরুম পার্টনারশীপ:</span>
                  <span className="font-bold text-orange-600">অফিশিয়াল কোলাবোরেশন</span>
                </div>
                <div className="flex items-center justify-between text-xs sm:text-sm font-semibold text-zinc-700 pt-2 border-t border-orange-200/60">
                  <span>এনরোলমেন্ট স্ট্যাটাস:</span>
                  <span className="font-bold text-emerald-600 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    ভর্তি চলমান
                  </span>
                </div>
              </div>

              {/* Primary Buy Button */}
              <a
                href={buyUrl}
                target="_blank"
                rel="noopener noreferrer"
                id="buy-course-external-btn"
                className="w-full py-3.5 sm:py-4 px-6 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-extrabold text-base sm:text-lg shadow-lg shadow-orange-500/30 flex items-center justify-center gap-2.5 transition-all transform active:scale-95 cursor-pointer text-center"
              >
                <span>কোর্সটি কিনুন</span>
                <ExternalLink size={18} />
              </a>

              <p className="text-[11px] text-center text-zinc-500 mt-3 font-medium">
                * কিনুন বাটনে ক্লিক করলে কোর্সটির অফিশিয়াল রেজিস্ট্রেশন পেজে নিয়ে যাবে।
              </p>
            </div>

            {/* Trust badge */}
            <div className="bg-white/80 rounded-2xl border border-orange-200/70 p-4 flex items-center gap-3 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
                <ShieldCheck size={22} />
              </div>
              <div>
                <h4 className="text-xs font-bold text-zinc-900">নিরাপদ ও নির্ভরযোগ্য ভর্তি</h4>
                <p className="text-[11px] text-zinc-500">মাহিম'স ক্লাসরুম ভেরিফায়েড পার্টনার একাডেমি কোর্স।</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
