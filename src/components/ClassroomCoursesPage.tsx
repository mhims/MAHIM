import React, { useState, useEffect } from 'react';
import {
  GraduationCap,
  Sparkles,
  BookOpen,
  Search,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Users,
  Phone,
  User,
  X,
  Calendar,
  Layers
} from 'lucide-react';
import { ALL_COURSES, type CourseItem } from '../data/courses';
import { navigateTo } from '../utils/navigation';
import { saveClassroomRegistration } from '../utils/classroomStorage';

export const ClassroomCoursesPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [selectedCourseTitle, setSelectedCourseTitle] = useState<string>('ভার্সিটি এডমিশন স্মার্ট এক্সাম ব্যাচ');

  // Form states
  const [studentName, setStudentName] = useState('');
  const [studentPhone, setStudentPhone] = useState('');
  const [studentMessage, setStudentMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);

  // SEO & Page Title
  useEffect(() => {
    document.title = "সকল কোর্স ও ব্যাচসমূহ | Mahim's Classroom (মাহিম ক্লাসরুম)";
    window.scrollTo({ top: 0, behavior: 'instant' });

    const metaTags: Record<string, string> = {
      description: "মাহিম'স ক্লাসরুমের সকল একাডেমিক ও এডমিশন কোর্স। এইচএসসি, বিশ্ববিদ্যালয় ভর্তি প্রস্তুতি, এসএসসি এবং জুনিয়র ফাউন্ডেশন ব্যাচের সম্পূর্ণ তালিকা ও বিস্তারিত।",
      keywords: "Mahim's Classroom Courses, মাহিম ক্লাসরুম কোর্স, এইচএসসি কোর্স, এডমিশন কোর্স, এসএসসি ব্যাচ, আইসিটি কোর্স, মাহিম ইবনে খুদি",
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

  const handleOpenRegister = (courseTitle?: string) => {
    if (courseTitle) {
      setSelectedCourseTitle(courseTitle);
    }
    setFormSubmitted(false);
    setIsRegisterModalOpen(true);
  };

  const submitRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName.trim() || !studentPhone.trim()) return;

    setIsSubmitting(true);
    try {
      saveClassroomRegistration({
        name: studentName,
        phone: studentPhone,
        course: selectedCourseTitle,
        message: studentMessage,
      });
      await new Promise((resolve) => setTimeout(resolve, 500));
    } catch {
      // ignore
    } finally {
      setIsSubmitting(false);
      setFormSubmitted(true);
    }
  };

  // Filter courses based on search & category
  const filteredCourses = ALL_COURSES.filter((course) => {
    const matchesCategory = activeCategory === 'all' || course.category === activeCategory;
    const matchesSearch =
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#fffbf7] text-zinc-900 selection:bg-orange-500 selection:text-white font-sans relative overflow-x-hidden pb-20">
      {/* Background Decorative Gradients */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[800px] h-[500px] rounded-full bg-gradient-to-b from-orange-200/50 via-amber-100/30 to-transparent blur-[120px]" />
        <div className="absolute top-[40%] -right-24 w-[400px] h-[400px] rounded-full bg-orange-100/50 blur-[120px]" />
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
                সকল কোর্স ও ব্যাচসমূহ ডিরেক্টরি
              </p>
            </div>
          </div>

          {/* Nav Links */}
          <div className="flex items-center gap-1.5 sm:gap-3">
            <button
              onClick={() => navigateTo('/classroom')}
              className="text-xs font-semibold text-zinc-700 hover:text-orange-600 transition-colors px-3 py-2 font-['Hind_Siliguri',sans-serif] flex items-center gap-1 cursor-pointer"
            >
              <ArrowLeft size={14} className="text-orange-600" />
              <span>মূল ক্লাসরুম</span>
            </button>

            <button
              onClick={() => navigateTo('/classroom/instructor')}
              className="hidden md:inline-flex text-xs font-semibold text-zinc-700 hover:text-orange-600 transition-colors px-3 py-2 font-['Hind_Siliguri',sans-serif] cursor-pointer"
            >
              <Users size={14} className="mr-1 text-orange-600" />
              <span>শিক্ষক প্যানেল</span>
            </button>

            <button
              onClick={() => handleOpenRegister()}
              className="inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-orange-500 hover:bg-orange-600 text-white shadow-md shadow-orange-500/25 transition-all font-['Hind_Siliguri',sans-serif] active:scale-95 cursor-pointer"
            >
              <Sparkles size={14} className="text-amber-200" />
              <span>প্রি-রেজিস্ট্রেশন</span>
            </button>
          </div>
        </div>
      </header>

      {/* Page Content */}
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
          <span className="text-orange-600 font-bold">কোর্সসমূহ (Courses)</span>
        </div>

        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-100 text-orange-800 text-xs font-bold font-['Hind_Siliguri',sans-serif] mb-3 border border-orange-200">
            <BookOpen size={14} className="text-orange-600" />
            <span>Mahim's Classroom • অল কোর্স ক্যাটালগ</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-zinc-900 tracking-tight leading-tight font-['Hind_Siliguri',sans-serif] mb-4">
            আমাদের সকল কোর্স ও ব্যাচসমূহ
          </h1>
          <p className="text-xs sm:text-base text-zinc-600 font-['Hind_Siliguri',sans-serif] leading-relaxed">
            এইচএসসি, বিশ্ববিদ্যালয় ভর্তি প্রস্তুতি ও এসএসসি শিক্ষার্থীদের জন্য কনসেপ্ট ফার্স্ট লার্নিং এবং স্মার্ট এক্সাম সিস্টেম। প্রতিটি কোর্সে রয়েছে অভিজ্ঞ মেন্টরদের নিবিড় তত্ত্বাবধান।
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-white border border-orange-200/90 rounded-3xl p-4 sm:p-6 shadow-sm mb-10 max-w-4xl mx-auto">
          {/* Search Box */}
          <div className="relative mb-5">
            <Search size={18} className="absolute left-4 top-3.5 text-zinc-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="কোর্সের নাম, বিষয় বা লেভেল দিয়ে খুঁজুন (যেমন: এডমিশন, আইসিটি, এসএসসি)..."
              className="w-full pl-11 pr-4 py-3 rounded-2xl bg-orange-50/50 border border-orange-200 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 focus:outline-none text-zinc-900 text-xs sm:text-sm font-['Hind_Siliguri',sans-serif]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-3.5 text-zinc-400 hover:text-zinc-600 p-0.5 rounded-full"
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Category Tabs */}
          <div className="flex items-center justify-center gap-2 flex-wrap font-['Hind_Siliguri',sans-serif]">
            {[
              { id: 'all', label: 'সব কোর্স' },
              { id: 'mentorship', label: '⭐ মেন্টরশীপ (Mentorship)' },
              { id: 'admission', label: '🎓 এডমিশন (Admission)' },
              { id: 'hsc', label: '📘 এইচএসসি (HSC)' },
              { id: 'ssc', label: '📗 এসএসসি (SSC)' },
              { id: 'junior', label: 'ক্লাস ৬–৮' },
              { id: 'skills', label: 'স্কিলস' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveCategory(tab.id)}
                className={`px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  activeCategory === tab.id
                    ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20 scale-105'
                    : 'bg-zinc-50 hover:bg-orange-50 text-zinc-700 border border-zinc-200 hover:border-orange-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Courses Count */}
        <div className="flex items-center justify-between mb-6 text-xs text-zinc-500 font-['Hind_Siliguri',sans-serif] px-1">
          <span>মোট কোর্স পাওয়া গেছে: <b className="text-orange-600 font-bold">{filteredCourses.length} টি</b></span>
          <button
            onClick={() => navigateTo('/classroom/instructor')}
            className="text-orange-700 hover:text-orange-800 font-bold flex items-center gap-1 cursor-pointer"
          >
            <span>শিক্ষকদের বিস্তারিত দেখতে ক্লিক করুন</span>
            <ArrowRight size={13} />
          </button>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <div
              key={course.id}
              id={`course-card-${course.id}`}
              className="bg-white border border-orange-200/90 hover:border-orange-400 rounded-3xl p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 shadow-sm hover:shadow-xl hover:shadow-orange-500/10 group relative overflow-hidden"
            >
              {course.isFeatured && (
                <div className="absolute -top-6 -right-6 w-16 h-16 bg-orange-500/10 rounded-full blur-xl pointer-events-none" />
              )}

              {/* Course Thumbnail Image (if provided) */}
              {course.imageUrl && (
                <div 
                  onClick={() => course.actionUrl && navigateTo(course.actionUrl)}
                  className={`-mx-6 -mt-6 sm:-mx-7 sm:-mt-7 mb-5 overflow-hidden rounded-t-[22px] border-b border-orange-100 bg-zinc-950 aspect-[16/9] ${course.actionUrl ? 'cursor-pointer' : ''}`}
                >
                  <img
                    src={course.imageUrl}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 block"
                  />
                </div>
              )}

              <div>
                {/* Badge & Status */}
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-orange-100 text-orange-700 border border-orange-200 font-['Hind_Siliguri',sans-serif]">
                    {course.categoryLabel}
                  </span>
                  <span className={`inline-flex items-center gap-1.5 text-[11px] font-mono px-2.5 py-1 rounded-lg border ${
                    course.status === 'active'
                      ? 'text-emerald-700 bg-emerald-50 border-emerald-200 font-bold'
                      : 'text-zinc-600 bg-orange-50 border-orange-200'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${
                      course.status === 'active' ? 'bg-emerald-500' : 'bg-orange-500'
                    }`} />
                    <span>{course.status === 'active' ? 'ভর্তি চলছে' : course.status === 'launching_soon' ? 'Launching Soon' : 'Upcoming'}</span>
                  </span>
                </div>

                {/* Course Title */}
                <h3 className="text-xl sm:text-2xl font-bold text-zinc-900 group-hover:text-orange-600 transition-colors font-['Hind_Siliguri',sans-serif] mb-2">
                  {course.title}
                </h3>

                {course.targetBadge && (
                  <p className="text-xs text-orange-700 font-semibold mb-3 font-['Hind_Siliguri',sans-serif]">
                    {course.targetBadge}
                  </p>
                )}

                <p className="text-xs sm:text-sm text-zinc-600 font-['Hind_Siliguri',sans-serif] leading-relaxed mb-6">
                  {course.description}
                </p>

                {/* Highlights */}
                <div className="space-y-2 mb-6 pt-4 border-t border-orange-100">
                  {course.highlights.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-zinc-700 font-['Hind_Siliguri',sans-serif]">
                      <CheckCircle2 size={14} className="text-orange-600 shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => {
                  if (course.actionUrl) {
                    navigateTo(course.actionUrl);
                  } else {
                    handleOpenRegister(course.title);
                  }
                }}
                className="w-full py-3 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 font-['Hind_Siliguri',sans-serif] cursor-pointer active:scale-98 bg-orange-50 hover:bg-orange-500 text-orange-700 hover:text-white border border-orange-300 hover:border-transparent"
              >
                <span>{course.actionText || 'আগ্রহ প্রকাশ করুন (Pre-Register)'}</span>
                <ArrowRight size={14} />
              </button>
            </div>
          ))}
        </div>

        {/* Bottom Banner to Teachers */}
        <div className="mt-16 bg-gradient-to-r from-orange-500 to-amber-600 rounded-3xl p-6 sm:p-10 text-white shadow-xl shadow-orange-500/20 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="text-center sm:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-xs text-xs font-bold mb-2">
              <Users size={14} />
              <span>অভিজ্ঞ শিক্ষক ও মেন্টর প্যানেল</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black font-['Hind_Siliguri',sans-serif]">
              কোর্স পরিচালনায় কারা থাকছেন?
            </h3>
            <p className="text-xs sm:text-sm text-orange-100 mt-1 max-w-xl font-['Hind_Siliguri',sans-serif]">
              শীর্ষস্থানীয় পাবলিক বিশ্ববিদ্যালয় ও বিভিন্ন প্রতিষ্ঠানের মেধাবী মেন্টরদের বিস্তারিত প্রোফাইল ও শিক্ষাগত যোগ্যতা দেখুন।
            </p>
          </div>

          <button
            onClick={() => navigateTo('/classroom/instructor')}
            className="shrink-0 px-6 py-3.5 rounded-xl bg-white text-orange-700 font-bold text-xs sm:text-sm shadow-md hover:bg-orange-50 transition-all font-['Hind_Siliguri',sans-serif] flex items-center gap-2 cursor-pointer active:scale-95"
          >
            <span>শিক্ষক প্যানেল দেখুন</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </main>

      {/* Pre-Registration Modal */}
      {isRegisterModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-md bg-white border-2 border-orange-400 rounded-3xl p-6 sm:p-8 shadow-2xl text-left overflow-hidden">
            <button
              onClick={() => setIsRegisterModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-xl bg-orange-50 text-zinc-500 hover:text-zinc-900 hover:bg-orange-100 transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>

            {!formSubmitted ? (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
                    <Sparkles size={20} />
                  </div>
                  <div>
                    <span className="px-2.5 py-0.5 rounded-md bg-orange-100 text-orange-700 text-[11px] font-bold font-['Hind_Siliguri',sans-serif]">
                      কোর্স প্রি-রেজিস্ট্রেশন
                    </span>
                    <h3 className="text-xl font-black text-zinc-900 font-['Hind_Siliguri',sans-serif] mt-0.5">
                      অগ্রিম নাম তালিকাভুক্ত করুন
                    </h3>
                  </div>
                </div>

                <p className="text-xs text-zinc-600 mt-1 mb-5 font-['Hind_Siliguri',sans-serif]">
                  কোনো ফি ছাড়াই আপনার পছন্দের কোর্সে আসন অগ্রাধিকার নিশ্চিত করুন।
                </p>

                <form onSubmit={submitRegistration} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 mb-1.5 font-['Hind_Siliguri',sans-serif]">
                      আপনার পূর্ণ নাম: <span className="text-orange-600">*</span>
                    </label>
                    <div className="relative">
                      <User size={15} className="absolute left-3.5 top-3 text-zinc-400" />
                      <input
                        type="text"
                        required
                        value={studentName}
                        onChange={(e) => setStudentName(e.target.value)}
                        placeholder="যেমন: সাকিব আহমেদ"
                        className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-white border border-zinc-300 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 focus:outline-none text-zinc-900 text-sm font-['Hind_Siliguri',sans-serif]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 mb-1.5 font-['Hind_Siliguri',sans-serif]">
                      মোবাইল নম্বর: <span className="text-orange-600">*</span>
                    </label>
                    <div className="relative">
                      <Phone size={15} className="absolute left-3.5 top-3 text-zinc-400" />
                      <input
                        type="tel"
                        required
                        value={studentPhone}
                        onChange={(e) => setStudentPhone(e.target.value)}
                        placeholder="01XXXXXXXXX"
                        className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-white border border-zinc-300 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 focus:outline-none text-zinc-900 text-sm font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 mb-1.5 font-['Hind_Siliguri',sans-serif]">
                      পছন্দের কোর্স বা ব্যাচ:
                    </label>
                    <select
                      value={selectedCourseTitle}
                      onChange={(e) => setSelectedCourseTitle(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-zinc-300 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 focus:outline-none text-zinc-900 text-xs sm:text-sm font-['Hind_Siliguri',sans-serif]"
                    >
                      {ALL_COURSES.map((c) => (
                        <option key={c.id} value={c.title}>
                          {c.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 mb-1.5 font-['Hind_Siliguri',sans-serif]">
                      কোনো প্রশ্ন বা পরামর্শ থাকলে লিখুন (ঐচ্ছিক):
                    </label>
                    <textarea
                      rows={2}
                      value={studentMessage}
                      onChange={(e) => setStudentMessage(e.target.value)}
                      placeholder="আপনার কোনো জিজ্ঞাসা থাকলে লিখতে পারেন..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-zinc-300 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 focus:outline-none text-zinc-900 text-xs sm:text-sm font-['Hind_Siliguri',sans-serif] resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 rounded-xl font-extrabold text-sm sm:text-base bg-orange-500 hover:bg-orange-600 disabled:opacity-75 text-white shadow-lg shadow-orange-500/25 transition-all font-['Hind_Siliguri',sans-serif] cursor-pointer active:scale-98 flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>তথ্য সংরক্ষণ হচ্ছে...</span>
                      </>
                    ) : (
                      <span>নাম জমা দিন (Pre-Register) ➔</span>
                    )}
                  </button>
                </form>
              </div>
            ) : (
              <div className="text-center py-4 space-y-4">
                <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 border border-emerald-300 flex items-center justify-center mx-auto">
                  <CheckCircle2 size={32} />
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-zinc-900 font-['Hind_Siliguri',sans-serif]">
                    রেজিস্ট্রেশন সফলভাবে সম্পন্ন হয়েছে!
                  </h3>
                  <p className="text-xs sm:text-sm text-zinc-600 font-['Hind_Siliguri',sans-serif] mt-2 leading-relaxed">
                    ধন্যবাদ, <span className="font-bold text-zinc-900">{studentName}</span>! আপনার পছন্দের কোর্স <span className="font-semibold text-orange-600">({selectedCourseTitle})</span> এর জন্য আবেদন সংরক্ষিত হয়েছে।
                  </p>
                </div>

                <button
                  onClick={() => setIsRegisterModalOpen(false)}
                  className="w-full py-3 rounded-xl font-bold text-xs sm:text-sm bg-orange-500 hover:bg-orange-600 text-white transition-all shadow-md font-['Hind_Siliguri',sans-serif] cursor-pointer"
                >
                  ঠিক আছে (সম্পন্ন)
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
