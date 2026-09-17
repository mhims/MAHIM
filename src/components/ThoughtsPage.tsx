import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  Search,
  BookOpen,
  Calendar,
  Clock,
  User,
  Heart,
  Share2,
  ArrowLeft,
  Sparkles,
  Check,
  X,
  Plus,
} from 'lucide-react';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { WhatsAppButton } from './WhatsAppButton';
import { MobileAppDock } from './MobileAppDock';
import { AdminModal } from './AdminModal';
import { AuthModal } from './AuthModal';
import { ThoughtPost } from '../data/thoughtPosts';
import {
  getThoughtPosts,
  getAllThoughtTopics,
  toggleThoughtLike,
  isThoughtLiked,
} from '../utils/thoughtStorage';
import { navigateTo } from '../utils/navigation';
import { useSite } from '../context/SiteContext';

const BANNER_IMAGE_URL =
  'https://res.cloudinary.com/drvyjj7td/image/upload/v1789574512/think-with-mahim_yku7br.jpg';

export const ThoughtsPage: React.FC = () => {
  const { isAdminAuthenticated, setIsAdminModalOpen } = useSite();
  const [posts, setPosts] = useState<ThoughtPost[]>(() => getThoughtPosts(false));
  const [topics, setTopics] = useState<string[]>(() => getAllThoughtTopics());
  const [selectedTopic, setSelectedTopic] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Reader Modal state
  const [activeReadingPost, setActiveReadingPost] = useState<ThoughtPost | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  // Likes tracking
  const [, setLikeTrigger] = useState(0);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });

    // Dynamic SEO for Thoughts page
    const originalTitle = document.title;
    document.title = "Think With Mahim (Thik With Mahim) — বিশ্বাস, যুক্তি ও অভিজ্ঞতার আলোয় জীবনের অনুসন্ধান | Mahim's World";

    let metaDesc = document.querySelector('meta[name="description"]');
    const originalDesc = metaDesc?.getAttribute('content') || '';
    if (metaDesc) {
      metaDesc.setAttribute(
        'content',
        'Think With Mahim (Thik With Mahim / থিঙ্ক উইথ মাহিম): মাহিম ইবনে খুদির ব্যক্তিগত চিন্তাভাবনা, দর্শন, ধর্মতত্ত্ব, বিশ্বাস ও যুক্তির আলোয় জীবনের অনুসন্ধানের মুক্ত বুদ্ধিবৃত্তিক অঙ্গন।'
      );
    }

    // Dynamic Meta Keywords for Search Engines
    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (!metaKeywords) {
      metaKeywords = document.createElement('meta');
      metaKeywords.setAttribute('name', 'keywords');
      document.head.appendChild(metaKeywords);
    }
    metaKeywords.setAttribute(
      'content',
      'Thik With Mahim, Think With Mahim, thik with mahim, think with mahim, thinkwithmahim, thikwithmahim, থিঙ্ক উইথ মাহিম, ঠিক উইথ মাহিম, মাহিম ইবনে খুদি চিন্তাভাবনা, mahims.com/thoughts, mahims.com/think-with-mahim, দর্শন ও ধর্মতত্ত্ব'
    );

    // JSON-LD structured data injection
    const scriptId = 'thoughts-jsonld';
    let scriptEl = document.getElementById(scriptId) as HTMLScriptElement | null;
    if (!scriptEl) {
      scriptEl = document.createElement('script');
      scriptEl.id = scriptId;
      scriptEl.type = 'application/ld+json';
      scriptEl.text = JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: 'Think With Mahim',
        alternateName: [
          'Thik With Mahim',
          'think with mahim',
          'thik with mahim',
          'thinkwithmahim',
          'thikwithmahim',
          'থিঙ্ক উইথ মাহিম',
          'ঠিক উইথ মাহিম',
        ],
        headline: 'Think With Mahim (Thik With Mahim) — বিশ্বাস, যুক্তি ও অভিজ্ঞতার আলোয় জীবনের অনুসন্ধান',
        description:
          'Think With Mahim (Thik With Mahim / থিঙ্ক উইথ মাহিম): মাহিম ইবনে খুদির ব্যক্তিগত চিন্তাভাবনা, দর্শন, ধর্মতত্ত্ব, বিশ্বাস ও যুক্তির আলোয় জীবনের অনুসন্ধান।',
        url: 'https://mahims.com/thoughts/',
        keywords:
          'Thik With Mahim, Think With Mahim, think with mahim, thik with mahim, thinkwithmahim, থিঙ্ক উইথ মাহিম, ঠিক উইথ মাহিম',
        author: {
          '@type': 'Person',
          name: 'Mahim Ibne Khudi',
          url: 'https://mahims.com/',
        },
        publisher: {
          '@type': 'Organization',
          name: "Mahim's World",
          logo: {
            '@type': 'ImageObject',
            url: 'https://res.cloudinary.com/drvyjj7td/image/upload/v1789236304/mahims.com-Logo_ezjh1b.png',
          },
        },
        image: BANNER_IMAGE_URL,
      });
      document.head.appendChild(scriptEl);
    }

    const handleUpdate = () => {
      setPosts(getThoughtPosts(false));
      setTopics(getAllThoughtTopics());
    };
    window.addEventListener('mahim:thoughts-updated', handleUpdate);
    window.addEventListener('mahim:thought-topics-updated', handleUpdate);

    return () => {
      document.title = originalTitle;
      if (metaDesc && originalDesc) metaDesc.setAttribute('content', originalDesc);
      if (scriptEl && scriptEl.parentNode) scriptEl.parentNode.removeChild(scriptEl);
      window.removeEventListener('mahim:thoughts-updated', handleUpdate);
      window.removeEventListener('mahim:thought-topics-updated', handleUpdate);
    };
  }, []);

  const handleLike = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    toggleThoughtLike(id);
    setPosts(getThoughtPosts(false));
    setLikeTrigger((prev) => prev + 1);
  };

  const handleShare = (post: ThoughtPost, e: React.MouseEvent) => {
    e.stopPropagation();
    const url = `${window.location.origin}/thoughts#${post.slug}`;
    if (navigator.share) {
      navigator
        .share({
          title: post.title,
          text: post.excerpt,
          url,
        })
        .catch(() => {});
    } else {
      navigator.clipboard.writeText(url);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  // Filter posts
  const filteredPosts = posts.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.topic.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesTopic = selectedTopic === 'all' || p.topic === selectedTopic;
    return matchesSearch && matchesTopic;
  });

  return (
    <div className="min-h-screen bg-[#fdfdfb] dark:bg-[#0c0a09] text-[#1a1a1a] dark:text-zinc-100 flex flex-col selection:bg-amber-500 selection:text-black font-sans transition-colors duration-200">
      {/* Ambient background glows & subtle dot grid matching MahimsWorldHome */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] sm:w-[1200px] h-[580px] rounded-full bg-gradient-to-b from-amber-200/40 dark:from-amber-500/10 via-orange-100/20 dark:via-orange-500/5 to-transparent blur-[130px]" />
        <div className="absolute top-[35%] -right-28 w-[460px] h-[460px] rounded-full bg-orange-100/35 dark:bg-orange-950/15 blur-[120px]" />
        <div className="absolute top-[65%] -left-28 w-[500px] h-[500px] rounded-full bg-amber-100/30 dark:bg-amber-950/15 blur-[130px]" />
        <div
          className="absolute inset-0 opacity-40 dark:opacity-20"
          style={{
            backgroundImage: `radial-gradient(#f97316 0.85px, transparent 0.85px)`,
            backgroundSize: '28px 28px',
          }}
        />
      </div>

      {/* Official Global Navbar with 3D Logo, theme toggle & navigation */}
      <Navbar />

      <main className="flex-grow pt-24 sm:pt-28 lg:pt-32 pb-24 lg:pb-16 relative z-10">
        {/* Quick Context & Back Navigation */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-4 sm:mb-6">
          <div className="flex items-center justify-between gap-3 text-xs">
            <button
              onClick={(e) => navigateTo('/', e)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:text-amber-600 dark:hover:text-amber-400 font-bold text-[11px] shadow-xs transition-all hover:scale-102 cursor-pointer active:scale-98 font-['Hind_Siliguri',sans-serif]"
            >
              <ArrowLeft size={12} />
              <span>মূল সাইটে ফিরুন (Home)</span>
            </button>

            <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400 text-[11px] font-['Hind_Siliguri',sans-serif]">
              <span>Think With Mahim</span>
              <span>•</span>
              <span className="text-amber-600 dark:text-amber-400 font-bold">চিন্তাভাবনা ও দর্শন</span>
            </div>
          </div>
        </div>

        {/* Top Launch Banner: Classroom & Portfolio style with light beam border */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 sm:mb-12"
        >
            <div
            id="top-think-with-mahim-banner"
            className="relative group p-[3px] rounded-2xl sm:rounded-3xl overflow-hidden orange-pulsing-glow shadow-xl shadow-amber-500/10 dark:shadow-orange-950/40"
            title="Think With Mahim (Thik With Mahim) — বিশ্বাস, যুক্তি ও অভিজ্ঞতার আলোয় জীবনের অনুসন্ধান"
          >
            {/* Traveling Orange/Amber Light Beam */}
            <div className="absolute inset-[-150%] animate-spin-slow bg-[conic-gradient(from_0deg,transparent_0_300deg,#ea580c_320deg,#f59e0b_340deg,#fbbf24_355deg,#fff7ed_360deg)] pointer-events-none" />

            {/* Inner Container keeping the banner image clean, sharp and uncropped */}
            <div className="relative w-full rounded-[13px] sm:rounded-[21px] overflow-hidden bg-white dark:bg-zinc-950 select-none">
              <img
                src={BANNER_IMAGE_URL}
                alt="Think With Mahim (Thik With Mahim) — বিশ্বাস, যুক্তি ও অভিজ্ঞতার আলোয় জীবনের অনুসন্ধান"
                className="w-full h-auto object-cover block"
                loading="eager"
              />
            </div>
          </div>
        </motion.div>

        {/* Hero Section */}
        <section className="text-center max-w-4xl mx-auto px-4 sm:px-6 mb-10 sm:mb-14">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="space-y-3 sm:space-y-4"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 sm:px-5 sm:py-2 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-800 dark:text-amber-300 text-xs sm:text-sm font-semibold font-['Hind_Siliguri',sans-serif] shadow-xs backdrop-blur-md cursor-default select-none">
              <Sparkles size={14} className="text-amber-600 dark:text-amber-400" />
              <span>দর্শন • ধর্মতত্ত্ব • বিশ্বাস ও যুক্তি</span>
            </div>

            <div>
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] font-['Outfit',sans-serif] select-none text-zinc-950 dark:text-white">
                Think With <span className="text-amber-500 dark:text-amber-400">Mahim</span>
              </h1>
              <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400 font-['Hind_Siliguri',sans-serif] font-medium tracking-wide">
                থিঙ্ক উইথ মাহিম • Thik With Mahim • Intellectual Sanctuary
              </p>
            </div>

            <p className="text-lg sm:text-2xl font-bold font-['Hind_Siliguri',sans-serif] text-amber-600 dark:text-amber-400">
              বিশ্বাস, যুক্তি ও অভিজ্ঞতার আলোয় জীবনের অনুসন্ধান
            </p>

            <p className="max-w-2xl mx-auto text-xs sm:text-base text-zinc-600 dark:text-zinc-400 font-['Hind_Siliguri',sans-serif] leading-relaxed pt-1">
              এখানে আমি বিভিন্ন বিষয়ে লেখালেখি করবো। নিজের চিন্তাভাবনা, দর্শন, ধর্মতত্ত্ব, বিশ্বাস ও যুক্তির আলোয় আধুনিক জীবনের বহুমুখী জিজ্ঞাসা ও ব্যক্তিগত ভাবনা।
            </p>
          </motion.div>
        </section>

        {/* Content Section: Dynamic Topics and Search */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {(topics.length > 0 || posts.length > 0) && (
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8 pb-6 border-b border-zinc-200/80 dark:border-zinc-800">
              {/* Topics bar - only shows if Mahim has created topics */}
              {topics.length > 0 ? (
                <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 scrollbar-none font-['Hind_Siliguri',sans-serif]">
                  <button
                    onClick={() => setSelectedTopic('all')}
                    className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
                      selectedTopic === 'all'
                        ? 'bg-amber-500 text-black shadow-xs'
                        : 'bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 hover:border-amber-500/50 border border-zinc-200 dark:border-zinc-800'
                    }`}
                  >
                    সকল ভাবনা
                  </button>
                  {topics.map((t) => (
                    <button
                      key={t}
                      onClick={() => setSelectedTopic(t)}
                      className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
                        selectedTopic === t
                          ? 'bg-amber-500 text-black shadow-xs'
                          : 'bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 hover:border-amber-500/50 border border-zinc-200 dark:border-zinc-800'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              ) : (
                <div />
              )}

              {/* Search bar */}
              {posts.length > 0 && (
                <div className="relative w-full md:w-72 shrink-0">
                  <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="লেখা বা টপিক খুঁজুন..."
                    className="w-full pl-9 pr-4 py-2 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 text-xs focus:outline-none focus:border-amber-500 transition-colors shadow-2xs font-['Hind_Siliguri',sans-serif]"
                  />
                </div>
              )}
            </div>
          )}

          {/* Posts Cards / Clean Empty State */}
          {filteredPosts.length === 0 ? (
            <div className="py-14 sm:py-20 px-6 rounded-3xl bg-white dark:bg-zinc-900/80 border border-zinc-200/80 dark:border-zinc-800 text-center max-w-xl mx-auto shadow-xs space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto">
                <BookOpen className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-zinc-900 dark:text-white font-['Hind_Siliguri',sans-serif]">
                বর্তমানে কোনো চিন্তাভাবনার লেখা প্রকাশিত হয়নি
              </h3>
              <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-md mx-auto font-['Hind_Siliguri',sans-serif]">
                মাহিম ইবনে খুদি খুব শীঘ্রই দর্শন, ধর্মতত্ত্ব, বিশ্বাস ও জীবনের অনুসন্ধানের নতুন চিন্তাভাবনা ও প্রবন্ধ এখানে প্রকাশ করবেন।
              </p>
              {isAdminAuthenticated && (
                <button
                  onClick={() => setIsAdminModalOpen(true)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-black font-bold text-xs transition-all shadow-md shadow-amber-500/20 cursor-pointer font-['Hind_Siliguri',sans-serif]"
                >
                  <Plus className="w-4 h-4" />
                  <span>অ্যাডমিন প্যানেল থেকে প্রথম ভাবনা পোস্ট করুন</span>
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {filteredPosts.map((post) => {
                const liked = isThoughtLiked(post.id);
                return (
                  <motion.article
                    key={post.id}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    onClick={() => setActiveReadingPost(post)}
                    className="group rounded-3xl bg-white dark:bg-zinc-900/90 border border-zinc-200/80 dark:border-zinc-800 hover:border-amber-500/60 p-5 flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:shadow-amber-500/10 cursor-pointer font-['Hind_Siliguri',sans-serif]"
                  >
                    <div className="space-y-4">
                      {/* Cover image if available */}
                      {post.coverImage && (
                        <div className="aspect-[16/9] rounded-2xl overflow-hidden bg-zinc-100 dark:bg-zinc-950 border border-zinc-200/50 dark:border-zinc-800">
                          <img
                            src={post.coverImage}
                            alt={post.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                      )}

                      {/* Topic badge & read time */}
                      <div className="flex items-center justify-between gap-2 text-xs">
                        <span className="px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-800 dark:text-amber-300 font-bold text-[11px]">
                          {post.topic}
                        </span>
                        <span className="text-zinc-500 dark:text-zinc-400 flex items-center gap-1 text-[11px]">
                          <Clock className="w-3 h-3 text-amber-500" />
                          <span>{post.readTime}</span>
                        </span>
                      </div>

                      {/* Title */}
                      <h2 className="text-lg sm:text-xl font-bold text-zinc-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors line-clamp-2 leading-snug">
                        {post.title}
                      </h2>

                      {/* Excerpt */}
                      <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 line-clamp-3 leading-relaxed">
                        {post.excerpt}
                      </p>
                    </div>

                    {/* Card Footer: Author, Date, Likes & Read Action */}
                    <div className="pt-4 mt-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between gap-2 text-xs text-zinc-500 dark:text-zinc-400">
                      <div className="flex items-center gap-2">
                        <span className="flex items-center gap-1 font-medium">
                          <User className="w-3 h-3 text-amber-500" />
                          <span>{post.author}</span>
                        </span>
                        <span>•</span>
                        <span>{post.date}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => handleLike(post.id, e)}
                          className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-colors cursor-pointer text-xs ${
                            liked
                              ? 'text-red-600 bg-red-50 dark:bg-red-950/40'
                              : 'hover:text-red-500 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                          }`}
                          title="পছন্দ করুন"
                        >
                          <Heart className={`w-3.5 h-3.5 ${liked ? 'fill-red-500 text-red-500' : ''}`} />
                          <span>{post.likes || 0}</span>
                        </button>

                        <button
                          onClick={(e) => handleShare(post, e)}
                          className="p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors cursor-pointer"
                          title="শেয়ার করুন"
                        >
                          <Share2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </motion.article>
                );
              })}
            </div>
          )}
        </section>
      </main>

      {/* READING MODAL / FULL THOUGHT VIEWER */}
      {activeReadingPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-md animate-fade-in font-['Hind_Siliguri',sans-serif]">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 w-full max-w-3xl rounded-3xl p-6 sm:p-8 max-h-[92vh] overflow-y-auto space-y-6 shadow-2xl relative text-left text-zinc-900 dark:text-zinc-100">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-4">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 border border-amber-500/30 text-amber-800 dark:text-amber-300">
                  {activeReadingPost.topic}
                </span>
                <span className="text-xs text-zinc-500 dark:text-zinc-400 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-amber-500" />
                  {activeReadingPost.readTime}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => handleShare(activeReadingPost, e)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-xs font-bold text-zinc-700 dark:text-zinc-200 transition-colors cursor-pointer border border-zinc-200 dark:border-zinc-700"
                >
                  {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Share2 className="w-3.5 h-3.5 text-amber-500" />}
                  <span>{copiedLink ? 'লিংক কপি হয়েছে!' : 'শেয়ার'}</span>
                </button>
                <button
                  onClick={() => setActiveReadingPost(null)}
                  className="p-2 rounded-xl text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Cover image if available */}
            {activeReadingPost.coverImage && (
              <div className="rounded-2xl overflow-hidden max-h-80 w-full bg-zinc-100 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800">
                <img
                  src={activeReadingPost.coverImage}
                  alt={activeReadingPost.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Title & Metadata */}
            <div className="space-y-3">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-zinc-950 dark:text-white leading-tight tracking-tight">
                {activeReadingPost.title}
              </h1>

              <div className="flex items-center gap-3 text-xs text-zinc-500 dark:text-zinc-400 flex-wrap">
                <span className="flex items-center gap-1.5 font-semibold text-zinc-700 dark:text-zinc-300">
                  <User className="w-3.5 h-3.5 text-amber-500" />
                  <span>{activeReadingPost.author}</span>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-amber-500" />
                  <span>{activeReadingPost.date}</span>
                </span>
              </div>
            </div>

            {/* Excerpt callout */}
            {activeReadingPost.excerpt && (
              <div className="p-4 rounded-2xl bg-amber-500/10 border-l-4 border-amber-500 text-zinc-800 dark:text-zinc-200 text-sm italic leading-relaxed">
                {activeReadingPost.excerpt}
              </div>
            )}

            {/* Full Content Body */}
            <div className="prose prose-zinc dark:prose-invert max-w-none text-sm sm:text-base leading-relaxed text-zinc-700 dark:text-zinc-300 space-y-4 whitespace-pre-line font-normal">
              {activeReadingPost.content}
            </div>

            {/* Modal Bottom Actions */}
            <div className="pt-6 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between gap-3">
              <button
                onClick={(e) => handleLike(activeReadingPost.id, e)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                  isThoughtLiked(activeReadingPost.id)
                    ? 'bg-red-50 dark:bg-red-950/40 text-red-600 border border-red-200 dark:border-red-900/50'
                    : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                }`}
              >
                <Heart
                  className={`w-4 h-4 ${
                    isThoughtLiked(activeReadingPost.id) ? 'fill-red-500 text-red-500' : ''
                  }`}
                />
                <span>পছন্দ করেছেন ({activeReadingPost.likes || 0})</span>
              </button>

              <button
                onClick={() => setActiveReadingPost(null)}
                className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-black font-bold text-xs transition-all cursor-pointer shadow-xs"
              >
                পড়া শেষ করুন
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Global Shared Components */}
      <Footer />
      <WhatsAppButton />
      <MobileAppDock />
      <AdminModal />
      <AuthModal />
    </div>
  );
};
