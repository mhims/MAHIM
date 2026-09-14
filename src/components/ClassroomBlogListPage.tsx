import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  GraduationCap,
  BookOpen,
  Search,
  Sparkles,
  ChevronRight,
  ArrowLeft,
  Calendar,
  Clock,
  User,
  Tag,
  Eye,
  Heart,
  Share2,
  ExternalLink,
  Flame,
  Newspaper,
  Trophy,
  Filter,
  Check,
  PlusCircle,
} from 'lucide-react';
import { navigateTo } from '../utils/navigation';
import { ClassroomBlogPost } from '../data/classroomBlogs';
import {
  getClassroomBlogs,
  getAllBlogTopics,
  toggleClassroomBlogLike,
  isClassroomBlogLiked,
} from '../utils/classroomBlogStorage';
import { ClassroomAdminModal } from './ClassroomAdminModal';
import { isClassroomAdminAuthenticated } from '../utils/classroomStorage';

export const ClassroomBlogListPage: React.FC = () => {
  const [blogs, setBlogs] = useState<ClassroomBlogPost[]>(() => getClassroomBlogs(false));
  const [topics, setTopics] = useState<string[]>(() => getAllBlogTopics());
  const [selectedTopic, setSelectedTopic] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [shareToast, setShareToast] = useState<string | null>(null);

  useEffect(() => {
    document.title = "শিক্ষা ও এডমিশন ব্লগ | মাহিম'স ক্লাসরুম (Mahim's Classroom)";
    window.scrollTo({ top: 0, behavior: 'instant' });

    // SEO Meta Tags
    const metaTags: Record<string, string> = {
      description: "মাহিম'স ক্লাসরুমের অফিসিয়াল শিক্ষা ব্লগ। বিশ্ববিদ্যালয় ভর্তি প্রস্তুতি, স্বপ্নজয়ের গল্প, এডমিশনের সকল তারিখ ও নিউজ, এইচএসসি আইসিটি টিপস এবং ক্যারিয়ার গাইডলাইন।",
      keywords: "মাহিম ক্লাসরুম ব্লগ, এডমিশন গাইডলাইন, স্বপ্নজয়ের গল্প, এডমিশন নিউজ ও ডেট ২০২৬, এইচএসসি প্রস্তুতি, বিশ্ববিদ্যালয় ভর্তি প্রস্তুতি, Mahim's Classroom Blog",
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

    setIsAdmin(isClassroomAdminAuthenticated());

    const handleBlogUpdate = () => {
      setBlogs(getClassroomBlogs(false));
      setTopics(getAllBlogTopics());
    };

    window.addEventListener('classroom:blog_updated', handleBlogUpdate);
    return () => {
      window.removeEventListener('classroom:blog_updated', handleBlogUpdate);
    };
  }, []);

  // Filter blogs
  const filteredBlogs = blogs.filter((post) => {
    const matchesTopic =
      selectedTopic === 'all' ||
      post.topic?.toLowerCase().trim() === selectedTopic.toLowerCase().trim() ||
      post.category?.toLowerCase().trim() === selectedTopic.toLowerCase().trim();

    const q = searchQuery.toLowerCase().trim();
    if (!q) return matchesTopic;

    const matchesSearch =
      post.title?.toLowerCase().includes(q) ||
      post.excerpt?.toLowerCase().includes(q) ||
      post.topic?.toLowerCase().includes(q) ||
      post.author?.toLowerCase().includes(q) ||
      post.tags?.some((t) => t.toLowerCase().includes(q)) ||
      post.content?.toLowerCase().includes(q);

    return matchesTopic && matchesSearch;
  });

  const featuredPost = blogs.find((p) => p.featured) || blogs[0];

  const handleCopyShareLink = (slug: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const url = `${window.location.origin}/classroom/blog/${slug}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      setShareToast('লিংক কপি করা হয়েছে!');
      setTimeout(() => setShareToast(null), 3000);
    }
  };

  const handleLike = (slug: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const res = toggleClassroomBlogLike(slug);
    setBlogs(getClassroomBlogs(false));
  };

  const getTopicBadgeStyle = (topic: string) => {
    if (topic.includes('স্বপ্নজয়')) return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    if (topic.includes('নিউজ') || topic.includes('ডেট')) return 'bg-blue-100 text-blue-800 border-blue-200';
    if (topic.includes('এইচএসসি')) return 'bg-purple-100 text-purple-800 border-purple-200';
    if (topic.includes('টেকনিক')) return 'bg-amber-100 text-amber-800 border-amber-200';
    return 'bg-orange-100 text-orange-800 border-orange-200';
  };

  return (
    <div className="min-h-screen bg-[#fffbf7] text-zinc-900 selection:bg-orange-500 selection:text-white font-sans relative overflow-x-clip pb-28 sm:pb-20">
      {/* Background Decorative Gradients */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[800px] h-[500px] rounded-full bg-gradient-to-b from-orange-200/40 via-amber-100/30 to-transparent blur-[120px]" />
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `radial-gradient(#f97316 0.75px, transparent 0.75px)`,
            backgroundSize: '28px 28px',
          }}
        />
      </div>

      {/* Navigation Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-orange-200/70 shadow-xs transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
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
                শিক্ষা, এডমিশন ও স্বপ্নজয়ের ব্লগ
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
              <span className="hidden sm:inline">মূল ক্লাসরুম</span>
              <span className="sm:hidden">ক্লাসরুম</span>
            </button>

            <button
              onClick={() => navigateTo('/classroom/courses')}
              className="hidden md:inline-flex text-xs font-semibold text-zinc-700 hover:text-orange-600 transition-colors px-3 py-2 font-['Hind_Siliguri',sans-serif] cursor-pointer"
            >
              <BookOpen size={14} className="mr-1 text-orange-600" />
              <span>কোর্সসমূহ</span>
            </button>

            <button
              onClick={() => setIsAdminModalOpen(true)}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold bg-orange-500 hover:bg-orange-600 text-white shadow-md shadow-orange-500/20 transition-all font-['Hind_Siliguri',sans-serif] cursor-pointer"
              title="পোস্ট করুন ও ম্যানেজ করুন (ক্লাসরুম এডমিন প্যানেল)"
            >
              <PlusCircle size={14} />
              <span>পোস্ট করুন</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-10 pb-16">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-xs font-['Hind_Siliguri',sans-serif] text-zinc-500 mb-6">
          <button
            onClick={() => navigateTo('/')}
            className="hover:text-orange-600 transition-colors cursor-pointer"
          >
            হোম
          </button>
          <span>/</span>
          <button
            onClick={() => navigateTo('/classroom')}
            className="hover:text-orange-600 transition-colors cursor-pointer"
          >
            ক্লাসরুম
          </button>
          <span>/</span>
          <span className="text-orange-600 font-bold">ব্লগ ও আর্টিকেল (Blog)</span>
        </div>

        {/* Page Hero Header */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-100 text-orange-800 text-xs font-bold font-['Hind_Siliguri',sans-serif] mb-3 border border-orange-200">
            <Sparkles size={14} className="text-orange-600" />
            <span>মাহিম'স ক্লাসরুম • স্টাডি ও এডমিশন পোর্টাল</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-zinc-900 tracking-tight leading-tight font-['Hind_Siliguri',sans-serif] mb-4">
            শিক্ষা বিষয়ক ব্লগ ও স্বপ্নজয়ের গল্প
          </h1>
          <p className="text-xs sm:text-base text-zinc-600 font-['Hind_Siliguri',sans-serif] leading-relaxed">
            বিশ্ববিদ্যালয় ভর্তি পরীক্ষার গাইডলাইন, অনুপ্রেরণাদায়ী স্বপ্নজয়ের উপাখ্যান, সর্বশেষ এডমিশন ডেট ও সার্কুলার এবং বোর্ড পরীক্ষার সেরা টিপস।
          </p>
        </div>

        {/* Search & Topic Selector Box */}
        <div className="bg-white border border-orange-200/90 rounded-3xl p-4 sm:p-6 shadow-sm mb-10 max-w-5xl mx-auto">
          {/* Search Box */}
          <div className="relative mb-4">
            <Search size={18} className="absolute left-4 top-3.5 text-zinc-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="আর্টিকেলের শিরোনাম, টপিক বা কি-ওয়ার্ড দিয়ে খুঁজুন..."
              className="w-full pl-11 pr-4 py-3 bg-zinc-50 border border-zinc-200 rounded-2xl text-xs sm:text-sm font-['Hind_Siliguri',sans-serif] text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-orange-500 focus:bg-white transition-all shadow-inner"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-3.5 text-xs text-zinc-400 hover:text-zinc-700 font-bold"
              >
                ক্লিয়ার
              </button>
            )}
          </div>

          {/* Topic Pills */}
          <div>
            <div className="flex items-center gap-2 mb-2 text-xs font-bold text-zinc-700 font-['Hind_Siliguri',sans-serif]">
              <Filter size={14} className="text-orange-600" />
              <span>টপিক অনুযায়ী ফিল্টার করুন:</span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setSelectedTopic('all')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold font-['Hind_Siliguri',sans-serif] transition-all cursor-pointer ${
                  selectedTopic === 'all'
                    ? 'bg-orange-600 text-white shadow-md shadow-orange-500/20'
                    : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
                }`}
              >
                সব টপিক ({blogs.length})
              </button>
              {topics.map((top) => {
                const count = blogs.filter(
                  (b) => b.topic?.trim() === top.trim() || b.category?.trim() === top.trim()
                ).length;
                const isSelected = selectedTopic.toLowerCase().trim() === top.toLowerCase().trim();
                return (
                  <button
                    key={top}
                    onClick={() => setSelectedTopic(top)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold font-['Hind_Siliguri',sans-serif] transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-orange-600 text-white shadow-md shadow-orange-500/20'
                        : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
                    }`}
                  >
                    {top} {count > 0 ? `(${count})` : ''}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Toast Notification */}
        {shareToast && (
          <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 bg-zinc-900 text-white px-4 py-2 rounded-2xl shadow-xl flex items-center gap-2 text-xs font-medium border border-white/20 animate-fade-in">
            <Check size={14} className="text-emerald-400" />
            <span>{shareToast}</span>
          </div>
        )}

        {/* Featured Hero Article Spotlight (if not filtered by specific search) */}
        {!searchQuery && selectedTopic === 'all' && featuredPost && (
          <div className="mb-12">
            <div className="flex items-center gap-2 mb-4 text-xs font-extrabold text-orange-600 uppercase tracking-wider font-['Hind_Siliguri',sans-serif]">
              <Flame size={16} className="text-orange-600 animate-pulse" />
              <span>ফিচার্ড স্পটলাইট আর্টিকেল</span>
            </div>
            <div
              onClick={() => navigateTo(`/classroom/blog/${featuredPost.slug}`)}
              className="group bg-white border border-orange-200/90 hover:border-orange-400 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer grid grid-cols-1 lg:grid-cols-12"
            >
              <div className="lg:col-span-6 relative overflow-hidden bg-zinc-100 aspect-video lg:aspect-auto">
                <img
                  src={featuredPost.coverImage}
                  alt={featuredPost.title}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute top-4 left-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold border font-['Hind_Siliguri',sans-serif] shadow-xs ${getTopicBadgeStyle(featuredPost.topic)}`}>
                    {featuredPost.topic}
                  </span>
                </div>
              </div>

              <div className="lg:col-span-6 p-6 sm:p-8 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-3 text-xs text-zinc-500 font-['Hind_Siliguri',sans-serif] mb-3">
                    <span className="flex items-center gap-1">
                      <Calendar size={13} className="text-orange-500" />
                      {featuredPost.date}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock size={13} className="text-orange-500" />
                      {featuredPost.readTime}
                    </span>
                  </div>

                  <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-zinc-900 group-hover:text-orange-600 transition-colors font-['Hind_Siliguri',sans-serif] mb-4 leading-snug">
                    {featuredPost.title}
                  </h2>

                  <p className="text-xs sm:text-sm text-zinc-600 font-['Hind_Siliguri',sans-serif] leading-relaxed line-clamp-3 mb-6">
                    {featuredPost.excerpt}
                  </p>
                </div>

                <div className="pt-4 border-t border-zinc-100 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={featuredPost.authorAvatar || 'https://res.cloudinary.com/drvyjj7td/image/upload/v1789388129/mahimmentor_lqt0tg.png'}
                      alt={featuredPost.author}
                      className="w-8 h-8 rounded-full object-cover border border-orange-200"
                    />
                    <div>
                      <p className="text-xs font-bold text-zinc-900 font-['Hind_Siliguri',sans-serif] leading-tight">
                        {featuredPost.author}
                      </p>
                      <p className="text-[10px] text-zinc-500 font-['Hind_Siliguri',sans-serif]">
                        {featuredPost.authorRole || "মাহিম'স ক্লাসরুম"}
                      </p>
                    </div>
                  </div>

                  <div className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-orange-600 group-hover:bg-orange-700 text-white text-xs font-bold font-['Hind_Siliguri',sans-serif] transition-colors shadow-sm">
                    <span>সম্পূর্ণ পড়ুন</span>
                    <ChevronRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* All Articles Grid Header */}
        <div className="flex items-center justify-between mb-6 pb-2 border-b border-orange-200/60">
          <div className="flex items-center gap-2">
            <Newspaper size={18} className="text-orange-600" />
            <h3 className="text-lg sm:text-xl font-bold text-zinc-900 font-['Hind_Siliguri',sans-serif]">
              {selectedTopic === 'all' ? 'সকল প্রকাশিত আর্টিকেল' : `${selectedTopic} বিষয়ক আর্টিকেল`}
            </h3>
            <span className="px-2 py-0.5 rounded-full bg-orange-100 text-orange-800 text-xs font-bold font-mono">
              {filteredBlogs.length}
            </span>
          </div>

          <p className="text-xs text-zinc-500 font-['Hind_Siliguri',sans-serif]">
            টপিকভিত্তিক গাইডলাইন ও রুটিন
          </p>
        </div>

        {/* Articles Cards Grid */}
        {filteredBlogs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredBlogs.map((post, idx) => (
              <motion.article
                key={post.id || post.slug}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: idx * 0.05 }}
                onClick={() => navigateTo(`/classroom/blog/${post.slug}`)}
                className="bg-white border border-orange-200/90 hover:border-orange-400 rounded-3xl overflow-hidden flex flex-col justify-between shadow-xs hover:shadow-xl hover:shadow-orange-500/10 transition-all duration-300 group cursor-pointer"
              >
                <div>
                  {/* Card Cover Image */}
                  <div className="relative aspect-[16/10] overflow-hidden bg-zinc-100">
                    <img
                      src={post.coverImage}
                      alt={post.title}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute top-3 left-3">
                      <span className={`px-2.5 py-0.5 rounded-md text-[11px] font-bold border font-['Hind_Siliguri',sans-serif] shadow-xs ${getTopicBadgeStyle(post.topic)}`}>
                        {post.topic}
                      </span>
                    </div>

                    <div className="absolute top-3 right-3 flex items-center gap-1.5">
                      <button
                        onClick={(e) => handleCopyShareLink(post.slug, e)}
                        className="p-1.5 rounded-full bg-white/80 hover:bg-white text-zinc-700 hover:text-orange-600 transition-colors shadow-xs"
                        title="লিংক কপি করুন"
                      >
                        <Share2 size={13} />
                      </button>
                      <button
                        onClick={(e) => handleLike(post.slug, e)}
                        className={`p-1.5 rounded-full backdrop-blur-md transition-colors shadow-xs ${
                          isClassroomBlogLiked(post.id)
                            ? 'bg-rose-500 text-white'
                            : 'bg-white/80 hover:bg-white text-zinc-700 hover:text-rose-600'
                        }`}
                        title="লাইক করুন"
                      >
                        <Heart size={13} className={isClassroomBlogLiked(post.id) ? 'fill-white' : ''} />
                      </button>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-5 sm:p-6">
                    <div className="flex items-center justify-between text-[11px] text-zinc-500 font-['Hind_Siliguri',sans-serif] mb-2.5">
                      <span className="flex items-center gap-1">
                        <Calendar size={12} className="text-orange-500" />
                        {post.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={12} className="text-orange-500" />
                        {post.readTime}
                      </span>
                    </div>

                    <h3 className="text-base sm:text-lg font-bold text-zinc-900 group-hover:text-orange-600 transition-colors font-['Hind_Siliguri',sans-serif] mb-3 leading-snug line-clamp-2">
                      {post.title}
                    </h3>

                    <p className="text-xs text-zinc-600 font-['Hind_Siliguri',sans-serif] leading-relaxed line-clamp-3 mb-4">
                      {post.excerpt}
                    </p>

                    {/* URL preview */}
                    <div className="text-[10px] text-zinc-400 font-mono truncate mb-2">
                      mahims.com/classroom/blog/{post.slug}
                    </div>
                  </div>
                </div>

                {/* Card Footer */}
                <div className="px-5 sm:px-6 pb-5 pt-3 border-t border-zinc-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <img
                      src={post.authorAvatar || 'https://res.cloudinary.com/drvyjj7td/image/upload/v1789388129/mahimmentor_lqt0tg.png'}
                      alt={post.author}
                      className="w-6 h-6 rounded-full object-cover border border-orange-200"
                    />
                    <span className="text-xs font-semibold text-zinc-700 font-['Hind_Siliguri',sans-serif]">
                      {post.author}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 text-xs font-bold text-orange-600 font-['Hind_Siliguri',sans-serif] group-hover:translate-x-0.5 transition-transform">
                    <span>পড়ুন</span>
                    <ChevronRight size={14} />
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 px-4 bg-white rounded-3xl border border-orange-200/80 max-w-lg mx-auto">
            <BookOpen size={36} className="mx-auto text-orange-400 mb-3" />
            <h4 className="text-base font-bold text-zinc-900 font-['Hind_Siliguri',sans-serif] mb-1">
              কোনো আর্টিকেল পাওয়া যায়নি
            </h4>
            <p className="text-xs text-zinc-500 font-['Hind_Siliguri',sans-serif] mb-4">
              আপনার ফিল্টার বা সার্চ কি-ওয়ার্ড পরিবর্তন করে আবার চেষ্টা করুন।
            </p>
            <button
              onClick={() => {
                setSelectedTopic('all');
                setSearchQuery('');
              }}
              className="px-4 py-2 rounded-xl bg-orange-600 text-white text-xs font-bold font-['Hind_Siliguri',sans-serif]"
            >
              সকল আর্টিকেল দেখুন
            </button>
          </div>
        )}
      </main>

      {/* Classroom Admin Modal for Writing / Managing Blog Posts */}
      <ClassroomAdminModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
      />
    </div>
  );
};
