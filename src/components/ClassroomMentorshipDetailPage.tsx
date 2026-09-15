import React, { useState, useEffect } from 'react';
import {
  GraduationCap,
  ArrowLeft,
  Sparkles,
  CheckCircle2,
  ExternalLink,
  BookOpen,
  User,
  ShieldCheck,
  Target,
  ShoppingCart,
  Phone,
  Share2,
  Copy,
  Check,
  X,
  Compass,
} from 'lucide-react';
import { navigateTo } from '../utils/navigation';
import {
  findMentorCourseBySlug,
  COMBO_MENTORSHIP_COURSE,
  type MentorCourseInfo,
} from '../data/mentorshipDetails';
import { saveClassroomRegistration } from '../utils/classroomStorage';

interface Props {
  slug: string;
}

export const ClassroomMentorshipDetailPage: React.FC<Props> = ({ slug }) => {
  const course: MentorCourseInfo | undefined =
    findMentorCourseBySlug(slug) || COMBO_MENTORSHIP_COURSE;

  const [copied, setCopied] = useState(false);
  const [isBuyModalOpen, setIsBuyModalOpen] = useState(false);
  const [studentName, setStudentName] = useState('');
  const [studentPhone, setStudentPhone] = useState('');
  const [studentMessage, setStudentMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);

  // SEO & Head Meta tags synchronization
  useEffect(() => {
    if (course) {
      document.title = course.metaTitle;
      window.scrollTo({ top: 0, behavior: 'instant' });

      // Update Meta Tags
      const metaTags: Record<string, string> = {
        description: course.metaDescription,
        'og:title': course.metaTitle,
        'og:description': course.metaDescription,
        'og:image': course.image,
        'og:url': course.externalCanonicalUrl,
        'twitter:title': course.metaTitle,
        'twitter:description': course.metaDescription,
        'twitter:image': course.image,
      };

      Object.entries(metaTags).forEach(([prop, val]) => {
        let el =
          document.querySelector(`meta[property="${prop}"]`) ||
          document.querySelector(`meta[name="${prop}"]`);
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

      // Update Canonical Link for SEO
      let canonicalLink = document.querySelector('link[rel="canonical"]');
      if (canonicalLink) {
        canonicalLink.setAttribute('href', course.externalCanonicalUrl);
      } else {
        canonicalLink = document.createElement('link');
        canonicalLink.setAttribute('rel', 'canonical');
        canonicalLink.setAttribute('href', course.externalCanonicalUrl);
        document.head.appendChild(canonicalLink);
      }
    }
  }, [course]);

  const handleShare = async () => {
    const shareUrl = course?.externalCanonicalUrl || window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: course?.metaTitle || 'Mentorship Course',
          text: course?.metaDescription,
          url: shareUrl,
        });
        return;
      } catch {
        // Fallback to clipboard
      }
    }

    if (navigator.clipboard) {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName.trim() || !studentPhone.trim()) return;

    setIsSubmitting(true);
    try {
      saveClassroomRegistration({
        name: studentName,
        phone: studentPhone,
        course: course ? `Mentorship: ${course.mentorName} (${course.slug})` : 'Mentorship Program',
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

  if (!course) {
    return (
      <div className="min-h-screen bg-[#fffbf7] flex items-center justify-center p-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-zinc-900 mb-2">কোর্সটি খুঁজে পাওয়া যায়নি</h2>
          <button
            onClick={() => navigateTo('/classroom/mentorship')}
            className="px-4 py-2 bg-orange-500 text-white rounded-xl font-bold"
          >
            মেন্টরশীপ পেইজে ফিরে যান
          </button>
        </div>
      </div>
    );
  }

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
            id="mentorship-detail-logo"
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
                SamNad Academy × Mahim’s Classroom
              </p>
            </div>
          </div>

          {/* Navigation Actions */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold text-zinc-700 hover:text-orange-600 bg-orange-50 hover:bg-orange-100 border border-orange-200 transition-colors font-['Hind_Siliguri',sans-serif] cursor-pointer"
              title="শেয়ার করুন"
            >
              {copied ? (
                <>
                  <Check size={14} className="text-emerald-600" />
                  <span className="text-emerald-700 font-bold">লিঙ্ক কপি হয়েছে</span>
                </>
              ) : (
                <>
                  <Share2 size={14} className="text-orange-600" />
                  <span className="hidden sm:inline">শেয়ার</span>
                </>
              )}
            </button>

            {/* Back to Mentorship Hub */}
            <button
              onClick={() => navigateTo('/classroom/mentorship')}
              id="back-to-mentorship-hub-btn"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold text-zinc-700 hover:text-orange-600 bg-orange-50 hover:bg-orange-100 border border-orange-200 transition-colors font-['Hind_Siliguri',sans-serif] cursor-pointer shrink-0"
            >
              <ArrowLeft size={15} className="text-orange-600 shrink-0" />
              <span>মেন্টরশীপ পেইজ</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-10">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs font-['Hind_Siliguri',sans-serif] text-zinc-500 mb-6 flex-wrap">
          <button
            onClick={() => navigateTo('/classroom')}
            className="hover:text-orange-600 transition-colors cursor-pointer"
          >
            ক্লাসরুম
          </button>
          <span>/</span>
          <button
            onClick={() => navigateTo('/classroom/mentorship')}
            className="hover:text-orange-600 transition-colors cursor-pointer"
          >
            মেন্টরশীপ হাব
          </button>
          <span>/</span>
          <span className="text-orange-600 font-bold">{course.mentorName}</span>
        </div>

        {/* Hero Card */}
        <div className="bg-white border-2 border-orange-200/90 rounded-3xl overflow-hidden shadow-xl mb-8">
          {/* Banner Image */}
          <div className="relative w-full aspect-[16/8] sm:aspect-[21/9] bg-zinc-950 overflow-hidden">
            <img
              src={course.image}
              alt={course.mentorName}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent pointer-events-none" />

            <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 right-4 sm:right-6 text-white">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/95 text-white text-xs font-bold uppercase tracking-wider mb-2 font-['Hind_Siliguri',sans-serif]">
                <Sparkles size={13} />
                <span>{course.badge}</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-black text-white font-['Hind_Siliguri',sans-serif] leading-tight drop-shadow-md">
                {course.mentorNameBn} — Mentorship Course
              </h1>
              <p className="text-xs sm:text-sm text-orange-200 font-['Hind_Siliguri',sans-serif] mt-1 drop-shadow-sm">
                {course.institutionBn} • {course.degreeBn}
              </p>
            </div>
          </div>

          {/* Quick Action bar & SEO Canonical Bar */}
          <div className="p-4 sm:p-6 bg-orange-50/50 border-b border-orange-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-zinc-600 font-['Hind_Siliguri',sans-serif] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
              <span>
                অফিসিয়াল কোর্স ইউআরএল (Canonical URL):{' '}
                <a
                  href={course.externalCanonicalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-orange-700 hover:underline font-semibold"
                >
                  {course.externalCanonicalUrl}
                </a>
              </span>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                onClick={() => setIsBuyModalOpen(true)}
                id="mentorship-detail-buy-btn"
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-xs sm:text-sm shadow-md shadow-orange-500/25 transition-all flex items-center justify-center gap-2 font-['Hind_Siliguri',sans-serif] cursor-pointer active:scale-95"
              >
                <ShoppingCart size={16} />
                <span>কোর্সটি কিনুন (Buy Course)</span>
              </button>
            </div>
          </div>

          {/* Main Description Body */}
          <div className="p-6 sm:p-8 space-y-8 font-['Hind_Siliguri',sans-serif] text-zinc-800">
            {/* Opening Quote Card */}
            <div className="bg-gradient-to-r from-orange-50 to-amber-50 border-l-4 border-orange-500 p-5 rounded-r-2xl text-xs sm:text-base leading-relaxed text-zinc-700 shadow-2xs">
              <p className="font-bold text-zinc-900 text-sm sm:text-lg mb-2">
                ভর্তি পরীক্ষা, একাডেমিক প্রস্তুতি কিংবা নিজের কাঙ্ক্ষিত বিশ্ববিদ্যালয়ে জায়গা করে নেওয়ার পথে শুধু পড়াশোনা করলেই যথেষ্ট নয়—প্রয়োজন সঠিক পরিকল্পনা, নিয়মিত গাইডলাইন এবং অভিজ্ঞ মেন্টরের দিকনির্দেশনা।
              </p>
              <p className="text-zinc-600">
                এই Mentorship Course এমন শিক্ষার্থীদের জন্য তৈরি, যারা নিজেদের প্রস্তুতিকে আরও গোছানো, কার্যকর এবং লক্ষ্যভিত্তিক করতে চায়। SamNad Academy ও Mahim’s Classroom-এর সমন্বয়ে এই কোর্সে শিক্ষার্থীরা তাদের প্রস্তুতির পুরো journey-তে প্রয়োজনীয় গাইডলাইন ও মেন্টরশীপ পাবে।
              </p>
            </div>

            {/* Features Breakdown */}
            <div>
              <h3 className="text-lg sm:text-2xl font-black text-zinc-900 flex items-center gap-2 mb-4">
                <CheckCircle2 className="text-orange-600" size={22} />
                <span>এই কোর্সে যা থাকছে</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white border border-orange-200 rounded-2xl p-5 shadow-xs hover:border-orange-400 transition-colors">
                  <h4 className="font-bold text-orange-700 text-sm sm:text-base mb-1.5 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-orange-100 text-orange-700 flex items-center justify-center text-xs font-mono">1</span>
                    <span>সঠিক প্রস্তুতির দিকনির্দেশনা</span>
                  </h4>
                  <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
                    কীভাবে শুরু করবেন, কোন বিষয়কে কতটা গুরুত্ব দেবেন এবং কীভাবে সময়কে কাজে লাগাবেন—এসব বিষয়ে পরিষ্কার গাইডলাইন।
                  </p>
                </div>

                <div className="bg-white border border-orange-200 rounded-2xl p-5 shadow-xs hover:border-orange-400 transition-colors">
                  <h4 className="font-bold text-orange-700 text-sm sm:text-base mb-1.5 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-orange-100 text-orange-700 flex items-center justify-center text-xs font-mono">2</span>
                    <span>Personalized Mentorship</span>
                  </h4>
                  <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
                    আপনার প্রস্তুতি, সমস্যা ও প্রয়োজন অনুযায়ী মেন্টরের কাছ থেকে প্রয়োজনীয় পরামর্শ ও দিকনির্দেশনা।
                  </p>
                </div>

                <div className="bg-white border border-orange-200 rounded-2xl p-5 shadow-xs hover:border-orange-400 transition-colors">
                  <h4 className="font-bold text-orange-700 text-sm sm:text-base mb-1.5 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-orange-100 text-orange-700 flex items-center justify-center text-xs font-mono">3</span>
                    <span>Study Plan & Strategy</span>
                  </h4>
                  <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
                    পরীক্ষার প্রস্তুতিকে আরও কার্যকর করতে বাস্তবসম্মত স্টাডি প্ল্যান, রুটিন ও প্রস্তুতির কৌশল।
                  </p>
                </div>

                <div className="bg-white border border-orange-200 rounded-2xl p-5 shadow-xs hover:border-orange-400 transition-colors">
                  <h4 className="font-bold text-orange-700 text-sm sm:text-base mb-1.5 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-orange-100 text-orange-700 flex items-center justify-center text-xs font-mono">4</span>
                    <span>Regular Guidance & Support</span>
                  </h4>
                  <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
                    প্রস্তুতির বিভিন্ন পর্যায়ে প্রয়োজনীয় পরামর্শ, সমস্যা সমাধান এবং সঠিক পথে থাকার জন্য নিয়মিত সাপোর্ট।
                  </p>
                </div>

                <div className="bg-white border border-orange-200 rounded-2xl p-5 shadow-xs hover:border-orange-400 transition-colors">
                  <h4 className="font-bold text-orange-700 text-sm sm:text-base mb-1.5 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-orange-100 text-orange-700 flex items-center justify-center text-xs font-mono">5</span>
                    <span>Question & Discussion Support</span>
                  </h4>
                  <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
                    পড়াশোনা ও প্রস্তুতি নিয়ে গুরুত্বপূর্ণ প্রশ্ন বা সমস্যাগুলো নিয়ে মেন্টরের সঙ্গে আলোচনা করার সুযোগ।
                  </p>
                </div>

                <div className="bg-white border border-orange-200 rounded-2xl p-5 shadow-xs hover:border-orange-400 transition-colors">
                  <h4 className="font-bold text-orange-700 text-sm sm:text-base mb-1.5 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-orange-100 text-orange-700 flex items-center justify-center text-xs font-mono">6</span>
                    <span>Exam & Admission Guidance</span>
                  </h4>
                  <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
                    ভর্তি পরীক্ষা ও একাডেমিক প্রস্তুতির ক্ষেত্রে কীভাবে স্মার্টভাবে এগোতে হবে, সে বিষয়ে প্রয়োজনীয় গাইডলাইন ও কৌশল।
                  </p>
                </div>
              </div>
            </div>

            {/* Target Audience */}
            <div className="bg-amber-50/70 border border-amber-200 rounded-3xl p-6 sm:p-7">
              <h3 className="text-base sm:text-xl font-bold text-zinc-900 flex items-center gap-2 mb-3">
                <Target size={20} className="text-amber-700" />
                <span>কার জন্য এই কোর্স?</span>
              </h3>
              <p className="text-xs sm:text-sm text-zinc-700 leading-relaxed mb-3">
                যেসব শিক্ষার্থী:
              </p>
              <ul className="space-y-2 text-zinc-700 list-disc list-inside text-xs sm:text-sm">
                <li>নিজের প্রস্তুতিকে আরও গোছাতে চায়,</li>
                <li>সময় ও পড়াশোনাকে সঠিকভাবে ম্যানেজ করতে চায়,</li>
                <li>বারবার একই ভুল না করে সঠিক গাইডলাইনে এগোতে চায়,</li>
                <li>এবং নিজের কাঙ্ক্ষিত লক্ষ্য অর্জনের জন্য একজন মেন্টরের সহযোগিতা চায়—এই কোর্সটি তাদের জন্য।</li>
              </ul>
            </div>

            {/* Mission Statement */}
            <div className="bg-white border border-orange-200 rounded-2xl p-6">
              <h4 className="font-bold text-zinc-900 text-base mb-2 flex items-center gap-2">
                <ShieldCheck size={18} className="text-orange-600" />
                <span>আমাদের উদ্দেশ্য</span>
              </h4>
              <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed">
                শুধু পড়ার পরামর্শ দেওয়া নয়; বরং একজন শিক্ষার্থীকে সঠিক পরিকল্পনা তৈরি করা, নিজের দুর্বলতা বুঝে কাজ করা এবং লক্ষ্য অনুযায়ী ধারাবাহিকভাবে এগিয়ে যেতে সাহায্য করা।
              </p>
              <div className="mt-4 pt-4 border-t border-orange-100 flex flex-col sm:flex-row items-center justify-between text-xs text-orange-800 font-semibold gap-2">
                <span>SamNad Academy × Mahim’s Classroom</span>
                <span className="text-[11px] text-zinc-500 font-normal">
                  Learn with Direction. Prepare with Confidence. Achieve Your Goal.
                </span>
              </div>
            </div>

            {/* Bottom Call to Action */}
            <div className="text-center pt-4">
              <button
                onClick={() => setIsBuyModalOpen(true)}
                className="w-full sm:w-auto min-w-[280px] py-4 px-8 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-sm sm:text-base shadow-lg shadow-orange-500/25 transition-all flex items-center justify-center gap-2 mx-auto cursor-pointer active:scale-98"
              >
                <ShoppingCart size={18} />
                <span>কোর্সটিতে এখনই ভর্তি হন</span>
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Course Purchase Modal */}
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
                    {course.mentorNameBn}
                  </h3>
                  <p className="text-xs text-orange-700 font-bold mt-1 font-['Hind_Siliguri',sans-serif]">
                    {course.badge}
                  </p>
                  <p className="text-xs text-zinc-500 mt-1 font-['Hind_Siliguri',sans-serif]">
                    আপনার নাম ও মোবাইল নম্বর দিয়ে বুকিং নিশ্চিত করুন।
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
                      মন্তব্য বা বিশেষ জিজ্ঞাসা (ঐচ্ছিক)
                    </label>
                    <textarea
                      value={studentMessage}
                      onChange={(e) => setStudentMessage(e.target.value)}
                      placeholder="আপনার কোনো লক্ষ্য বা প্রশ্ন থাকলে লিখুন..."
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
                        <span>বুকিং নিশ্চিত করুন</span>
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
                  ধন্যবাদ, <span className="font-bold text-zinc-900">{studentName}</span>! <span className="text-orange-600 font-semibold">{course.mentorNameBn}</span> এর মেন্টরশীপ কোর্সের জন্য আপনার অনুরোধ সংরক্ষিত হয়েছে। শীঘ্রই আমাদের টিম আপনার নম্বরে যোগাযোগ করবে।
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
