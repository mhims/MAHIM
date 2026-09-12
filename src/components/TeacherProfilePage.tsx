import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  ArrowLeft, 
  Share2, 
  GraduationCap, 
  School, 
  Sparkles, 
  BookOpen, 
  Award, 
  Target, 
  BrainCircuit, 
  Calendar, 
  ExternalLink,
  Copy,
  Check,
  Users,
  ShieldCheck
} from 'lucide-react';
import { TEACHERS, type TeacherProfile } from '../data/teachers';
import { navigateTo } from '../utils/navigation';

interface TeacherProfilePageProps {
  slug: string;
}

export const TeacherProfilePage: React.FC<TeacherProfilePageProps> = ({ slug }) => {
  const teacher: TeacherProfile | undefined = TEACHERS[slug];
  const [copied, setCopied] = useState(false);

  // Dynamic meta tags for social share previews & page title
  useEffect(() => {
    if (!teacher) return;

    const originalTitle = document.title;
    const pageTitle = teacher.englishName
      ? `${teacher.name} (${teacher.englishName}) | শিক্ষক প্রোফাইল — মাহিম'স ক্লাসরুম`
      : `${teacher.name} | শিক্ষক প্রোফাইল — মাহিম'স ক্লাসরুম`;
    document.title = pageTitle;

    // Helper to update meta tag
    const updateMeta = (attr: string, key: string, content: string) => {
      let element = document.querySelector(`meta[${attr}="${key}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attr, key);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    updateMeta('name', 'description', teacher.metaDescription);
    updateMeta('property', 'og:title', pageTitle);
    updateMeta('property', 'og:description', teacher.metaDescription);
    updateMeta('property', 'og:image', teacher.photoUrl);
    updateMeta('property', 'og:url', `https://mahims.com/classroom/${teacher.slug}`);
    updateMeta('property', 'og:type', 'profile');
    updateMeta('name', 'twitter:title', pageTitle);
    updateMeta('name', 'twitter:description', teacher.metaDescription);
    updateMeta('name', 'twitter:image', teacher.photoUrl);
    updateMeta('name', 'twitter:card', 'summary_large_image');

    window.scrollTo({ top: 0, behavior: 'smooth' });

    return () => {
      document.title = originalTitle;
    };
  }, [teacher]);

  if (!teacher) {
    return (
      <div className="min-h-screen bg-[#fafaf9] flex flex-col items-center justify-center p-6 text-center font-['Hind_Siliguri',sans-serif]">
        <div className="w-16 h-16 rounded-3xl bg-orange-100 text-orange-600 flex items-center justify-center mb-4">
          <Users size={32} />
        </div>
        <h1 className="text-2xl font-bold text-zinc-900 mb-2">শিক্ষক প্রোফাইল পাওয়া যায়নি</h1>
        <p className="text-sm text-zinc-600 mb-6 max-w-md">
          অনুরোধকৃত শিক্ষক প্রোফাইলটি খুঁজে পাওয়া যায়নি অথবা লিংকটি পরিবর্তিত হয়েছে।
        </p>
        <button
          onClick={() => navigateTo('/classroom')}
          className="px-6 py-3 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm shadow-md transition-all cursor-pointer inline-flex items-center gap-2"
        >
          <ArrowLeft size={16} />
          <span>মাহিম’স ক্লাসরুমে ফিরে যান</span>
        </button>
      </div>
    );
  }

  const shareUrl = typeof window !== 'undefined' ? window.location.href : `https://mahims.com/classroom/${teacher.slug}`;

  const handleCopyLink = async () => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      }
    } catch {
      // Fallback
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${teacher.name} — মাহিম'স ক্লাসরুম`,
          text: teacher.metaDescription,
          url: shareUrl,
        });
      } catch {
        handleCopyLink();
      }
    } else {
      handleCopyLink();
    }
  };

  return (
    <div className="min-h-screen bg-[#fafaf9] text-zinc-900 font-sans selection:bg-orange-500 selection:text-white pb-24">
      {/* Top Sticky Bar */}
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-zinc-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <button
            onClick={() => navigateTo('/classroom')}
            className="inline-flex items-center gap-2 text-sm font-bold text-zinc-700 hover:text-orange-600 transition-colors font-['Hind_Siliguri',sans-serif] cursor-pointer"
          >
            <ArrowLeft size={18} />
            <span>মাহিম’স ক্লাসরুম</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyLink}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-zinc-200 hover:border-orange-300 text-xs font-semibold text-zinc-700 hover:text-orange-600 bg-white shadow-xs transition-colors cursor-pointer font-['Hind_Siliguri',sans-serif]"
              title="লিংক কপি করুন"
            >
              {copied ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
              <span>{copied ? 'কপি হয়েছে!' : 'লিংক কপি'}</span>
            </button>

            <button
              onClick={handleNativeShare}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold shadow-xs transition-all cursor-pointer font-['Hind_Siliguri',sans-serif]"
            >
              <Share2 size={14} />
              <span>শেয়ার করুন</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8 space-y-6">
        {/* Profile Hero Card */}
        <section className="bg-white border-2 border-orange-200/80 rounded-3xl p-6 sm:p-8 shadow-sm relative overflow-hidden">
          {/* Subtle Top Accent Banner */}
          <div className={`absolute top-0 left-0 right-0 h-3 bg-gradient-to-r ${teacher.bannerGradient}`} />

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 pt-2">
            {/* Photo */}
            <div className="relative shrink-0">
              <div className={`w-28 h-28 sm:w-36 sm:h-36 rounded-3xl p-1.5 bg-gradient-to-br ${teacher.bannerGradient} shadow-xl shadow-orange-500/10`}>
                <img
                  src={teacher.photoUrl}
                  alt={teacher.name}
                  className="w-full h-full object-cover rounded-[20px] bg-zinc-100"
                />
              </div>
              <span className="absolute -bottom-2 -right-1 bg-white border-2 border-orange-300 p-1.5 rounded-full text-orange-600 shadow-md">
                <CheckCircle2 size={18} />
              </span>
            </div>

            {/* Main Info */}
            <div className="text-center sm:text-left flex-1 space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-orange-50 text-orange-700 border border-orange-200/60 font-['Hind_Siliguri',sans-serif]">
                <ShieldCheck size={14} className="text-orange-600" />
                <span>অফিসিয়াল মেন্টর প্যানেল</span>
              </div>

              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-zinc-900 font-['Hind_Siliguri',sans-serif]">
                  {teacher.name}
                </h1>
                {teacher.englishName && (
                  <p className="text-xs sm:text-sm font-semibold text-zinc-500 font-mono tracking-wide mt-0.5">
                    {teacher.englishName}
                  </p>
                )}
              </div>

              <p className="text-sm sm:text-base font-bold text-orange-600 font-['Hind_Siliguri',sans-serif]">
                {teacher.role}
              </p>

              <p className="text-xs sm:text-sm font-semibold text-zinc-600 font-['Hind_Siliguri',sans-serif] flex items-center justify-center sm:justify-start gap-1.5">
                <School size={15} className="text-zinc-500 shrink-0" />
                <span>{teacher.institution}</span>
              </p>

              <p className="text-xs sm:text-sm text-zinc-600 font-['Hind_Siliguri',sans-serif] pt-2 leading-relaxed max-w-2xl">
                {teacher.shortBio}
              </p>
            </div>
          </div>

          {/* Highlights Row */}
          <div className="mt-8 pt-6 border-t border-zinc-100 grid grid-cols-1 sm:grid-cols-3 gap-3">
            {teacher.highlights.map((hl, i) => (
              <div key={i} className="p-4 rounded-2xl bg-[#fafaf9] border border-zinc-200/70 text-center sm:text-left">
                <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider font-mono">
                  {hl.label}
                </p>
                <p className="text-sm font-bold text-zinc-900 font-['Hind_Siliguri',sans-serif] mt-0.5">
                  {hl.value}
                </p>
                {hl.subtext && (
                  <p className="text-xs text-zinc-500 font-['Hind_Siliguri',sans-serif] mt-0.5">
                    {hl.subtext}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Two-column layout for details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Educational Background */}
            <section className="bg-white border border-zinc-200 rounded-3xl p-6 sm:p-7 shadow-xs">
              <div className="flex items-center gap-2 mb-4 text-orange-600">
                <GraduationCap size={20} />
                <h2 className="text-lg font-bold text-zinc-900 font-['Hind_Siliguri',sans-serif]">
                  শিক্ষাগত যোগ্যতা ও অধ্যয়ন
                </h2>
              </div>

              <div className="space-y-3">
                {teacher.education.map((edu, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-orange-50/50 border border-orange-100/80">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="text-sm font-bold text-zinc-900 font-['Hind_Siliguri',sans-serif]">
                          {edu.institution}
                        </h3>
                        <p className="text-xs text-orange-700 font-semibold font-['Hind_Siliguri',sans-serif] mt-0.5">
                          {edu.degree}
                        </p>
                        <p className="text-[11px] text-zinc-500 font-['Hind_Siliguri',sans-serif] mt-1">
                          {edu.status}
                        </p>
                      </div>
                      {edu.tag && (
                        <span className="shrink-0 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-white text-zinc-700 border border-zinc-200 font-mono">
                          {edu.tag}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Admission Success / Merit Rank (if applicable) */}
            {(teacher.meritRank || (teacher.admissionOffers && teacher.admissionOffers.length > 0)) && (
              <section className="bg-white border border-zinc-200 rounded-3xl p-6 sm:p-7 shadow-xs space-y-4">
                <div className="flex items-center gap-2 text-orange-600">
                  <Target size={20} />
                  <h2 className="text-lg font-bold text-zinc-900 font-['Hind_Siliguri',sans-serif]">
                    ভর্তি পরীক্ষার সাফল্য ও সুযোগপ্রাপ্ত বিষয়সমূহ
                  </h2>
                </div>

                {teacher.meritRank && (
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-orange-500/10 via-amber-500/10 to-orange-500/5 border border-orange-300">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-orange-800 font-['Hind_Siliguri',sans-serif]">
                        {teacher.meritRank.examName}
                      </span>
                      <span className="px-3 py-1 rounded-full bg-orange-500 text-white font-mono font-bold text-xs shadow-xs">
                        {teacher.meritRank.rank}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-600 mt-1 font-['Hind_Siliguri',sans-serif]">
                      সেশন: {teacher.meritRank.session}
                    </p>
                  </div>
                )}

                {teacher.admissionOffers && teacher.admissionOffers.length > 0 && (
                  <div className="space-y-2 pt-2">
                    <p className="text-xs font-bold text-zinc-600 font-['Hind_Siliguri',sans-serif]">
                      সুযোগপ্রাপ্ত অন্যান্য বিভাগসমূহ:
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {teacher.admissionOffers.map((offer, idx) => (
                        <div key={idx} className="p-3.5 rounded-2xl bg-[#fafaf9] border border-zinc-200/80">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-[10px] font-bold text-zinc-400 font-mono">
                              {offer.code}
                            </span>
                            {offer.session && (
                              <span className="text-[10px] text-zinc-500 font-['Hind_Siliguri',sans-serif]">
                                {offer.session}
                              </span>
                            )}
                          </div>
                          <p className="text-xs font-bold text-zinc-900 font-['Hind_Siliguri',sans-serif]">
                            {offer.subject}
                          </p>
                          <p className="text-[11px] text-zinc-600 font-['Hind_Siliguri',sans-serif] mt-0.5">
                            {offer.institution}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </section>
            )}

            {/* Academic Board Results (if applicable, e.g. SSC/HSC) */}
            {teacher.achievements && teacher.achievements.length > 0 && (
              <section className="bg-white border border-zinc-200 rounded-3xl p-6 sm:p-7 shadow-xs">
                <div className="flex items-center gap-2 mb-4 text-orange-600">
                  <Award size={20} />
                  <h2 className="text-lg font-bold text-zinc-900 font-['Hind_Siliguri',sans-serif]">
                    বোর্ড পরীক্ষার ফলাফল
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {teacher.achievements.map((ach, idx) => (
                    <div key={idx} className="p-4 rounded-2xl bg-emerald-50/40 border border-emerald-200">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-zinc-800 font-['Hind_Siliguri',sans-serif]">
                          {ach.exam} ({ach.year})
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-mono text-[11px] font-bold border border-emerald-300">
                          {ach.gpa}
                        </span>
                      </div>
                      <p className="text-xs text-zinc-600 font-['Hind_Siliguri',sans-serif]">
                        {ach.group} • {ach.board}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Philosophy */}
            <section className="bg-orange-50/60 border border-orange-200 rounded-3xl p-6 sm:p-7 shadow-xs">
              <div className="flex items-center gap-2 mb-2 text-orange-700">
                <Sparkles size={18} />
                <h2 className="text-sm font-bold uppercase tracking-wider font-['Hind_Siliguri',sans-serif]">
                  মেন্টরশিপ দর্শন ও বার্তা
                </h2>
              </div>
              <p className="text-sm text-zinc-800 leading-relaxed font-['Hind_Siliguri',sans-serif]">
                "{teacher.teachingPhilosophy}"
              </p>
            </section>
          </div>

          {/* Right Sidebar: Quick Actions & Upcoming Courses */}
          <div className="space-y-6">
            {/* Future Course / Portal Hub */}
            <div className="bg-white border-2 border-orange-200 rounded-3xl p-6 shadow-xs text-center space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center mx-auto">
                <BookOpen size={24} />
              </div>
              <div>
                <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-orange-100 text-orange-800 font-['Hind_Siliguri',sans-serif] mb-1">
                  আসন্ন ফিচার
                </span>
                <h3 className="text-base font-bold text-zinc-900 font-['Hind_Siliguri',sans-serif]">
                  শিক্ষকের বিশেষ কোর্স ও ব্যাচ
                </h3>
                <p className="text-xs text-zinc-500 font-['Hind_Siliguri',sans-serif] mt-1.5 leading-relaxed">
                  খুব শীঘ্রই {teacher.name}-এর স্পেশাল এক্সাম ব্যাচ, লাইভ ক্লাস ও কোর্স মেটেরিয়াল এই পেজে সরাসরি প্রকাশিত হবে।
                </p>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => navigateTo('/classroom')}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-xs shadow-md shadow-orange-500/20 transition-all font-['Hind_Siliguri',sans-serif] cursor-pointer"
                >
                  ক্লাসরুমে প্রি-রেজিস্ট্রেশন করুন
                </button>
              </div>
            </div>

            {/* Share Profile Card */}
            <div className="bg-zinc-900 text-white rounded-3xl p-6 shadow-sm space-y-3">
              <h3 className="text-sm font-bold text-orange-400 font-['Hind_Siliguri',sans-serif] flex items-center gap-2">
                <Share2 size={16} />
                <span>প্রোফাইল শেয়ার করুন</span>
              </h3>
              <p className="text-xs text-zinc-300 font-['Hind_Siliguri',sans-serif] leading-relaxed">
                শিক্ষার্থীর সাথে এই লিংকটি সরাসরি ফেসবুক, হোয়াটসঅ্যাপ কিংবা মেসেঞ্জারে শেয়ার করতে পারেন।
              </p>
              <div className="pt-1">
                <button
                  onClick={handleCopyLink}
                  className="w-full py-2.5 px-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700 text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-2 font-['Hind_Siliguri',sans-serif]"
                >
                  {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                  <span>{copied ? 'লিংক কপি হয়েছে' : 'লিংক কপি করুন'}</span>
                </button>
              </div>
            </div>

            {/* Return Link */}
            <div className="text-center pt-2">
              <button
                onClick={() => navigateTo('/classroom')}
                className="text-xs font-semibold text-zinc-500 hover:text-orange-600 transition-colors inline-flex items-center gap-1.5 font-['Hind_Siliguri',sans-serif] cursor-pointer"
              >
                <ArrowLeft size={14} />
                <span>মাহিম’স ক্লাসরুমের সকল মেন্টর দেখুন</span>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
