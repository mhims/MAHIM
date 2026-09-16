import React, { useState, useEffect } from 'react';
import {
  GraduationCap,
  ArrowLeft,
  CheckCircle2,
  ExternalLink,
  User,
  ShieldCheck,
  Target,
  ShoppingCart,
  Phone,
  Share2,
  Check,
  X,
  Sparkles,
  Flame,
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
      document.title = `${course.mentorNameBn} — Mentorship Course | Mahim's Classroom`;
      window.scrollTo({ top: 0, behavior: 'instant' });

      const canonicalUrl = `https://mahims.com/classroom/courses/mentorship/${course.slug}`;

      // Update Meta Tags
      const metaTags: Record<string, string> = {
        description: course.metaDescription,
        'og:title': `${course.mentorNameBn} — Mentorship Course | Mahim's Classroom`,
        'og:description': course.metaDescription,
        'og:image': course.image,
        'og:url': canonicalUrl,
        'twitter:title': `${course.mentorNameBn} — Mentorship Course | Mahim's Classroom`,
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
        canonicalLink.setAttribute('href', canonicalUrl);
      } else {
        canonicalLink = document.createElement('link');
        canonicalLink.setAttribute('rel', 'canonical');
        canonicalLink.setAttribute('href', canonicalUrl);
        document.head.appendChild(canonicalLink);
      }
    }
  }, [course]);

  const handleShare = async () => {
    const fullUrl = `https://mahims.com/classroom/courses/mentorship/${course?.slug || slug}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${course?.mentorName || 'Mentorship Course'} — Mahim's Classroom`,
          text: course?.metaDescription,
          url: fullUrl,
        });
        return;
      } catch {
        // Fallback to clipboard
      }
    }

    if (navigator.clipboard) {
      await navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleBuyClick = () => {
    // If user provides external buy URL in future, redirect
    if (course?.externalBuyUrl) {
      window.open(course.externalBuyUrl, '_blank', 'noopener,noreferrer');
      return;
    }
    // Otherwise open the immediate registration modal
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
        course: course
          ? `Mentorship: ${course.mentorName} (${course.slug})`
          : 'Mentorship Program',
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
      <div className="min-h-screen bg-[#fffbf7] flex flex-col items-center justify-center p-4">
        <h2 className="text-xl font-bold text-zinc-900 mb-4 font-['Hind_Siliguri',sans-serif]">
          কোর্সটি পাওয়া যায়নি
        </h2>
        <button
          onClick={() => navigateTo('/classroom/courses')}
          className="px-6 py-2.5 rounded-xl bg-orange-500 text-white font-bold text-sm font-['Hind_Siliguri',sans-serif]"
        >
          সব কোর্সে ফিরে যান
        </button>
      </div>
    );
  }

  const courseDisplayName = course.isCombo
    ? 'Mentorship Program Combo'
    : `${course.mentorName} | Mentorship Course`;

  return (
    <div className="min-h-screen bg-[#fffbf7] text-zinc-900 selection:bg-orange-500 selection:text-white font-sans relative overflow-x-clip pb-28 sm:pb-24">
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
                mahims.com/classroom/courses/mentorship/{course.slug}
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
            <span
              onClick={() => navigateTo('/classroom')}
              className="hover:text-orange-600 cursor-pointer"
            >
              ক্লাসরুম
            </span>
            <span>/</span>
            <span
              onClick={() => navigateTo('/classroom/courses')}
              className="hover:text-orange-600 cursor-pointer"
            >
              কোর্সসমূহ
            </span>
            <span>/</span>
            <span className="text-zinc-900 font-bold truncate max-w-xs sm:max-w-md">
              {courseDisplayName}
            </span>
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

        {/* 2-Column Responsive Layout:
            - Mobile (<lg): Order-1 shows the buying box (image, title, info, buy button) first; Order-2 shows details & story below it.
            - Desktop (lg): Natural 2-column layout (7 cols left for details, 5 cols right for buying box) with smooth synchronized scrolling.
        */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 items-start">
          {/* Left Column (Content & Details - 7 cols on Desktop, Below Buy Card on Mobile) */}
          <div className="order-2 lg:order-1 lg:col-span-7 space-y-6 sm:space-y-8 font-['Hind_Siliguri',sans-serif]">
            {/* Title Card */}
            <div className="bg-white rounded-3xl border border-orange-200/90 p-6 sm:p-8 shadow-sm">
              <div className="flex items-center gap-2 flex-wrap mb-4">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-orange-100 text-orange-800 border border-orange-300">
                  {course.isCombo ? 'কম্বো মেন্টরশীপ কোর্স' : 'মেন্টরশীপ প্রোগ্রাম'}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-zinc-100 text-zinc-700 border border-zinc-200">
                  {course.badge}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-800 border border-amber-200">
                  Samnad Academy কোলাবোরেশন
                </span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-extrabold text-zinc-950 tracking-tight leading-snug mb-5">
                {courseDisplayName}
              </h1>

              {/* Instructors Panel */}
              {!course.isCombo ? (
                <div className="p-4 rounded-2xl bg-orange-50/70 border border-orange-200/80 mb-6 flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl overflow-hidden bg-orange-500 text-white flex items-center justify-center shrink-0 shadow-xs">
                    <img
                      src={course.image}
                      alt={course.mentorName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="text-[11px] text-zinc-500 font-semibold uppercase tracking-wider">
                      MENTOR
                    </p>
                    <p className="text-base font-bold text-zinc-900">
                      {course.mentorNameBn}{' '}
                      <span className="text-xs text-zinc-500 font-normal">
                        ({course.mentorName})
                      </span>
                    </p>
                    <p className="text-xs text-zinc-600 mt-0.5">
                      {course.institutionBn} • {course.degreeBn}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-orange-50/70 border border-orange-200/80 mb-6">
                  <p className="text-[11px] text-zinc-500 font-semibold uppercase tracking-wider mb-2">
                    MENTORSHIP PANEL
                  </p>
                  <p className="text-sm font-bold text-zinc-900">
                    অভিজ্ঞ মেন্টর প্যানেল:{' '}
                    <span className="text-orange-700 font-medium">
                      আবু সালেহ সুজা (MBSTU), সামিউল সোহরাব (DIU), মিশকাত শরীফ মিথেন (BRUR), মাহিম ইবনে খুদি (DCU)
                    </span>
                  </p>
                </div>
              )}

              {/* Main Course Full Story / Text Description */}
              <div className="text-sm sm:text-base text-zinc-700 leading-relaxed space-y-4 border-t border-orange-100 pt-5">
                <p>
                  ভর্তি পরীক্ষা, একাডেমিক প্রস্তুতি কিংবা নিজের কাঙ্ক্ষিত বিশ্ববিদ্যালয়ে জায়গা করে নেওয়ার পথে শুধু পড়াশোনা করলেই যথেষ্ট নয়—প্রয়োজন সঠিক পরিকল্পনা, নিয়মিত গাইডলাইন এবং অভিজ্ঞ মেন্টরের দিকনির্দেশনা।
                </p>
                <p>
                  এই Mentorship Course এমন শিক্ষার্থীদের জন্য তৈরি, যারা নিজেদের প্রস্তুতিকে আরও গোছানো, কার্যকর এবং লক্ষ্যভিত্তিক করতে চায়। SamNad Academy ও Mahim’s Classroom-এর সমন্বয়ে এই কোর্সে শিক্ষার্থীরা তাদের প্রস্তুতির পুরো journey-তে প্রয়োজনীয় গাইডলাইন ও মেন্টরশীপ পাবে।
                </p>
              </div>
            </div>

            {/* What is in this course (🎯 কোর্সে যা থাকছে:) */}
            <div className="bg-white rounded-3xl border border-orange-200/90 p-6 sm:p-8 shadow-sm space-y-4">
              <h3 className="text-lg sm:text-xl font-black text-zinc-950 flex items-center gap-2">
                <span className="text-xl">🎯</span>
                <span>কোর্সে যা থাকছে:</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="flex items-start gap-2.5 p-3 rounded-xl bg-orange-50/50 border border-orange-100 text-xs sm:text-sm text-zinc-800">
                  <CheckCircle2 size={16} className="text-orange-600 shrink-0 mt-0.5" />
                  <div>
                    <b className="block text-zinc-900 font-bold mb-0.5">১. সঠিক প্রস্তুতির দিকনির্দেশনা</b>
                    <span className="text-zinc-600">কীভাবে শুরু করবেন, কোন বিষয়কে গুরুত্ব দেবেন এবং সময় ব্যবস্থাপনা।</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 p-3 rounded-xl bg-orange-50/50 border border-orange-100 text-xs sm:text-sm text-zinc-800">
                  <CheckCircle2 size={16} className="text-orange-600 shrink-0 mt-0.5" />
                  <div>
                    <b className="block text-zinc-900 font-bold mb-0.5">২. Personalized Mentorship</b>
                    <span className="text-zinc-600">আপনার প্রস্তুতি ও সমস্যা অনুযায়ী সরাসরি মেন্টরের পরামর্শ।</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 p-3 rounded-xl bg-orange-50/50 border border-orange-100 text-xs sm:text-sm text-zinc-800">
                  <CheckCircle2 size={16} className="text-orange-600 shrink-0 mt-0.5" />
                  <div>
                    <b className="block text-zinc-900 font-bold mb-0.5">৩. Study Plan & Strategy</b>
                    <span className="text-zinc-600">বাস্তবসম্মত স্টাডি প্ল্যান, রুটিন ও পরীক্ষার পূর্ণাঙ্গ কৌশল।</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 p-3 rounded-xl bg-orange-50/50 border border-orange-100 text-xs sm:text-sm text-zinc-800">
                  <CheckCircle2 size={16} className="text-orange-600 shrink-0 mt-0.5" />
                  <div>
                    <b className="block text-zinc-900 font-bold mb-0.5">৪. Regular Guidance & Support</b>
                    <span className="text-zinc-600">প্রস্তুতির বিভিন্ন ধাপে নিয়মিত সাপোর্ট এবং সঠিক পথে থাকা।</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 p-3 rounded-xl bg-orange-50/50 border border-orange-100 text-xs sm:text-sm text-zinc-800">
                  <CheckCircle2 size={16} className="text-orange-600 shrink-0 mt-0.5" />
                  <div>
                    <b className="block text-zinc-900 font-bold mb-0.5">৫. Question & Discussion Support</b>
                    <span className="text-zinc-600">পড়াশোনার যাবতীয় সমস্যা ও দ্বিধা নিয়ে মেন্টরের সাথে আলোচনা।</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 p-3 rounded-xl bg-orange-50/50 border border-orange-100 text-xs sm:text-sm text-zinc-800">
                  <CheckCircle2 size={16} className="text-orange-600 shrink-0 mt-0.5" />
                  <div>
                    <b className="block text-zinc-900 font-bold mb-0.5">৬. Exam & Admission Guidance</b>
                    <span className="text-zinc-600">ভর্তি পরীক্ষা ও বোর্ড পরীক্ষায় স্মার্টভাবে এগিয়ে থাকার কৌশল।</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Target Audience (🎯 কার জন্য এই কোর্স?) */}
            <div className="bg-white rounded-3xl border border-orange-200/90 p-6 sm:p-8 shadow-sm space-y-3">
              <h3 className="text-lg sm:text-xl font-black text-zinc-950 flex items-center gap-2">
                <Target size={20} className="text-orange-600" />
                <span>কার জন্য এই কোর্স?</span>
              </h3>
              <p className="text-xs sm:text-sm text-zinc-600">
                যেসব শিক্ষার্থী:
              </p>
              <div className="space-y-2 pt-1">
                <div className="flex items-center gap-2 text-xs sm:text-sm text-zinc-700">
                  <CheckCircle2 size={15} className="text-emerald-600 shrink-0" />
                  <span>নিজের একাডেমিক ও এডমিশন প্রস্তুতিকে আরও গোছাতে চায়,</span>
                </div>
                <div className="flex items-center gap-2 text-xs sm:text-sm text-zinc-700">
                  <CheckCircle2 size={15} className="text-emerald-600 shrink-0" />
                  <span>সময় ও পড়াশোনাকে সঠিকভাবে ম্যানেজ করতে চায়,</span>
                </div>
                <div className="flex items-center gap-2 text-xs sm:text-sm text-zinc-700">
                  <CheckCircle2 size={15} className="text-emerald-600 shrink-0" />
                  <span>বারবার একই ভুল না করে সঠিক গাইডলাইনে এগোতে চায়,</span>
                </div>
                <div className="flex items-center gap-2 text-xs sm:text-sm text-zinc-700">
                  <CheckCircle2 size={15} className="text-emerald-600 shrink-0" />
                  <span>এবং নিজের কাঙ্ক্ষিত লক্ষ্য অর্জনের জন্য একজন অভিজ্ঞ মেন্টরের সহযোগিতা চায়।</span>
                </div>
              </div>
            </div>

            {/* Mission Section (আমাদের উদ্দেশ্য) */}
            <div className="bg-gradient-to-br from-orange-500/10 via-amber-50/50 to-white rounded-3xl border border-orange-300/80 p-6 sm:p-8 shadow-sm space-y-3">
              <h3 className="text-lg sm:text-xl font-black text-zinc-950 flex items-center gap-2">
                <Flame size={20} className="text-orange-600" />
                <span>আমাদের উদ্দেশ্য</span>
              </h3>
              <p className="text-sm sm:text-base text-zinc-700 leading-relaxed">
                শুধু পড়ার পরামর্শ দেওয়া নয়; বরং একজন শিক্ষার্থীকে সঠিক পরিকল্পনা তৈরি করা, নিজের দুর্বলতা বুঝে কাজ করা এবং লক্ষ্য অনুযায়ী ধারাবাহিকভাবে এগিয়ে যেতে সাহায্য করা।
              </p>
              <p className="text-sm sm:text-base font-bold text-orange-700 pt-2 border-t border-orange-200/60">
                SamNad Academy × Mahim’s Classroom — Learn with Direction. Prepare with Confidence. Achieve Your Goal.
              </p>
            </div>
          </div>

          {/* Right Column (Course Image, Title, and Buy Card - 5 cols on Desktop, First on Mobile) */}
          <div className="order-1 lg:order-2 lg:col-span-5 space-y-5 font-['Hind_Siliguri',sans-serif]">
            <div className="bg-white rounded-3xl border-2 border-orange-200/90 p-5 sm:p-6 shadow-xl shadow-orange-500/10">
              {/* Image with glow border */}
              <div className="relative w-full rounded-2xl overflow-hidden bg-zinc-950 border border-orange-200 shadow-md mb-5 aspect-[16/9] group">
                <img
                  src={course.image}
                  alt={course.mentorName}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 block"
                />
              </div>

              {/* Course Title on right card */}
              <h2 className="text-xl sm:text-2xl font-black text-zinc-950 mb-2 leading-snug">
                {courseDisplayName}
              </h2>
              <p className="text-xs sm:text-sm text-zinc-500 mb-6 leading-relaxed">
                {course.metaDescription}
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
              {course?.externalBuyUrl ? (
                <a
                  href={course.externalBuyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  id="buy-mentorship-course-btn"
                  className="w-full py-3.5 sm:py-4 px-6 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-extrabold text-base sm:text-lg shadow-lg shadow-orange-500/30 flex items-center justify-center gap-2.5 transition-all transform active:scale-95 cursor-pointer text-center no-underline"
                >
                  <span>কোর্সটি কিনুন</span>
                  <ExternalLink size={18} />
                </a>
              ) : (
                <button
                  onClick={handleBuyClick}
                  id="buy-mentorship-course-btn"
                  className="w-full py-3.5 sm:py-4 px-6 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-extrabold text-base sm:text-lg shadow-lg shadow-orange-500/30 flex items-center justify-center gap-2.5 transition-all transform active:scale-95 cursor-pointer text-center"
                >
                  <span>কোর্সটি কিনুন</span>
                  <ExternalLink size={18} />
                </button>
              )}

              <p className="text-[11px] text-center text-zinc-500 mt-3 font-medium">
                * কিনুন বাটনে ক্লিক করে কোর্সটির এনরোলমেন্ট বা প্রি-রেজিস্ট্রেশন সম্পন্ন করুন।
              </p>
            </div>

            {/* Trust badge */}
            <div className="bg-white/80 rounded-2xl border border-orange-200/70 p-4 flex items-center gap-3 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
                <ShieldCheck size={22} />
              </div>
              <div>
                <h4 className="text-xs font-bold text-zinc-900">নিরাপদ ও নির্ভরযোগ্য ভর্তি</h4>
                <p className="text-[11px] text-zinc-500">
                  মাহিম'স ক্লাসরুম ভেরিফায়েড পার্টনার একাডেমি কোর্স।
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Course Enrollment / Booking Modal */}
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
                    {courseDisplayName}
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
                  ধন্যবাদ, <span className="font-bold text-zinc-900">{studentName}</span>!{' '}
                  <span className="text-orange-600 font-semibold">{courseDisplayName}</span>-এর জন্য আপনার অনুরোধ সংরক্ষিত হয়েছে। শীঘ্রই আমাদের টিম আপনার নম্বরে যোগাযোগ করবে।
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
