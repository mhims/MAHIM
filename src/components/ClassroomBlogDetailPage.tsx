import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  GraduationCap,
  BookOpen,
  ArrowLeft,
  Calendar,
  Clock,
  User,
  Tag,
  Eye,
  Heart,
  Share2,
  Check,
  ChevronRight,
  Sparkles,
  MessageCircle,
  Copy,
  ExternalLink,
  BookMarked,
  Newspaper,
  ThumbsUp,
  Bookmark,
  Trash2,
  Sun,
  Moon,
} from 'lucide-react';
import { navigateTo } from '../utils/navigation';
import { ClassroomBlogPost } from '../data/classroomBlogs';
import {
  getClassroomBlogBySlug,
  getClassroomBlogs,
  deleteClassroomBlog,
  incrementClassroomBlogView,
  toggleClassroomBlogLike,
  isClassroomBlogLiked,
} from '../utils/classroomBlogStorage';

export type ReadingTheme = 'light' | 'sepia' | 'dark';

interface ClassroomBlogDetailPageProps {
  slug: string;
}

export const ClassroomBlogDetailPage: React.FC<ClassroomBlogDetailPageProps> = ({ slug }) => {
  const [post, setPost] = useState<ClassroomBlogPost | null>(() => getClassroomBlogBySlug(slug));
  const [copied, setCopied] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [readingTheme, setReadingTheme] = useState<ReadingTheme>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('classroom_reading_theme') as ReadingTheme) || 'light';
    }
    return 'light';
  });

  const handleThemeChange = (newTheme: ReadingTheme) => {
    setReadingTheme(newTheme);
    try {
      localStorage.setItem('classroom_reading_theme', newTheme);
    } catch {}
  };

  useEffect(() => {
    const currentPost = getClassroomBlogBySlug(slug);
    setPost(currentPost);

    if (currentPost) {
      setIsLiked(isClassroomBlogLiked(currentPost.id));
      setLikesCount(currentPost.likes || 0);

      // Increment view counter once per load
      incrementClassroomBlogView(slug);

      // Page Title & SEO
      document.title = `${currentPost.title} | মাহিম'স ক্লাসরুম`;
      window.scrollTo({ top: 0, behavior: 'instant' });

      const metaTags: Record<string, string> = {
        description: currentPost.excerpt || currentPost.title,
        keywords: currentPost.seoKeywords || `${currentPost.topic}, মাহিম ক্লাসরুম, এডমিশন`,
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

      // JSON-LD Structured Data for Google Article Search Result
      const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: currentPost.title,
        description: currentPost.excerpt,
        image: currentPost.coverImage,
        datePublished: currentPost.createdAt,
        dateModified: currentPost.updatedAt || currentPost.createdAt,
        author: {
          '@type': 'Person',
          name: currentPost.author,
        },
        publisher: {
          '@type': 'Organization',
          name: "Mahim's Classroom",
          logo: {
            '@type': 'ImageObject',
            url: 'https://mahims.com/favicon.ico',
          },
        },
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': `https://mahims.com/classroom/blog/${currentPost.slug}`,
        },
      };

      const scriptId = 'classroom-blog-jsonld';
      let script = document.getElementById(scriptId) as HTMLScriptElement | null;
      if (!script) {
        script = document.createElement('script');
        script.id = scriptId;
        script.type = 'application/ld+json';
        document.head.appendChild(script);
      }
      script.text = JSON.stringify(jsonLd);

      return () => {
        const s = document.getElementById(scriptId);
        if (s) s.remove();
      };
    }
  }, [slug]);

  if (!post) {
    return (
      <div className="min-h-screen bg-[#fffbf7] text-zinc-900 flex flex-col items-center justify-center p-6 text-center font-['Hind_Siliguri',sans-serif]">
        <BookOpen size={48} className="text-orange-400 mb-4" />
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">আর্টিকেলটি খুঁজে পাওয়া যায়নি</h1>
        <p className="text-sm text-zinc-600 mb-6 max-w-md">
          সম্ভবত লিংকটি পরিবর্তিত হয়েছে অথবা আর্টিকেলটি ড্রাফট মোডে রয়েছে।
        </p>
        <button
          onClick={() => navigateTo('/classroom/blog')}
          className="px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-sm shadow-md shadow-orange-500/20"
        >
          সকল আর্টিকেল দেখুন
        </button>
      </div>
    );
  }

  const currentUrl = typeof window !== 'undefined' ? `${window.location.origin}/classroom/blog/${post.slug}` : `https://mahims.com/classroom/blog/${post.slug}`;

  const handleCopyLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(currentUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  const handleLike = () => {
    const res = toggleClassroomBlogLike(post.slug);
    setIsLiked(res.liked);
    setLikesCount(res.likes);
  };

  // Related posts
  const allPosts = getClassroomBlogs(false);
  const relatedPosts = allPosts
    .filter((p) => p.slug !== post.slug && (p.topic === post.topic || p.category === post.category))
    .slice(0, 3);

  const isSepia = readingTheme === 'sepia';
  const isDark = readingTheme === 'dark';

  // Render markdown content simply & cleanly
  const renderFormattedContent = (content: string) => {
    const lines = content.split('\n');
    const elements: React.ReactNode[] = [];
    let listBuffer: string[] = [];
    let tableBuffer: string[] = [];

    const flushList = (key: string) => {
      if (listBuffer.length > 0) {
        elements.push(
          <ul key={key} className="my-4 space-y-2 pl-2">
            {listBuffer.map((item, i) => (
              <li
                key={i}
                className={`flex items-start gap-2.5 text-sm sm:text-base leading-relaxed ${
                  isSepia ? 'text-[#3d2e1e]' : isDark ? 'text-zinc-300' : 'text-zinc-700'
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full mt-2.5 shrink-0 ${
                    isSepia ? 'bg-[#b6792a]' : isDark ? 'bg-orange-400' : 'bg-orange-500'
                  }`}
                />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        );
        listBuffer = [];
      }
    };

    const flushTable = (key: string) => {
      if (tableBuffer.length > 0) {
        const rows = tableBuffer.map((r) =>
          r
            .trim()
            .replace(/^\||\|$/g, '')
            .split('|')
            .map((c) => c.trim())
        );

        // Filter out markdown separator line (|---|---|)
        const validRows = rows.filter((r) => !r.every((c) => c.startsWith(':') || c.startsWith('-')));

        if (validRows.length > 0) {
          const header = validRows[0];
          const body = validRows.slice(1);

          elements.push(
            <div
              key={key}
              className={`my-6 overflow-x-auto rounded-2xl border shadow-xs transition-colors ${
                isSepia
                  ? 'border-[#decfa9] bg-[#fbf5e6]'
                  : isDark
                  ? 'border-zinc-800 bg-zinc-900'
                  : 'border-orange-200/90 bg-white'
              }`}
            >
              <table className="w-full text-left border-collapse text-xs sm:text-sm">
                <thead
                  className={`font-bold border-b transition-colors ${
                    isSepia
                      ? 'bg-[#f3e7ce] text-[#2c1d10] border-[#decfa9]'
                      : isDark
                      ? 'bg-zinc-800 text-zinc-100 border-zinc-700'
                      : 'bg-orange-50/80 text-orange-950 border-orange-200'
                  }`}
                >
                  <tr>
                    {header.map((col, idx) => (
                      <th key={idx} className="p-3.5 whitespace-nowrap">
                        {col.replace(/\*\*/g, '')}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody
                  className={`divide-y ${
                    isSepia ? 'divide-[#decfa9]/60' : isDark ? 'divide-zinc-800' : 'divide-orange-100'
                  }`}
                >
                  {body.map((row, rIdx) => (
                    <tr
                      key={rIdx}
                      className={`transition-colors ${
                        isSepia
                          ? 'hover:bg-[#f6ebd4]'
                          : isDark
                          ? 'hover:bg-zinc-800/50'
                          : 'hover:bg-orange-50/30'
                      }`}
                    >
                      {row.map((cell, cIdx) => (
                        <td
                          key={cIdx}
                          className={`p-3 font-medium ${
                            isSepia ? 'text-[#3d2e1e]' : isDark ? 'text-zinc-300' : 'text-zinc-700'
                          }`}
                        >
                          {cell.replace(/\*\*/g, '')}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        }
        tableBuffer = [];
      }
    };

    lines.forEach((line, index) => {
      const trimmed = line.trim();

      // Check if table row
      if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
        flushList(`flush_list_${index}`);
        tableBuffer.push(trimmed);
        return;
      } else {
        flushTable(`flush_table_${index}`);
      }

      // Check if list item
      if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        listBuffer.push(trimmed.replace(/^[-*]\s+/, ''));
        return;
      } else {
        flushList(`flush_list_${index}`);
      }

      // Empty line
      if (!trimmed) {
        return;
      }

      // Heading 2
      if (trimmed.startsWith('## ')) {
        elements.push(
          <h2
            key={index}
            className={`text-xl sm:text-2xl font-bold mt-8 mb-4 pt-4 border-t font-['Hind_Siliguri',sans-serif] tracking-tight flex items-center gap-2 ${
              isSepia
                ? 'border-[#decfa9]/70 text-[#291b0f]'
                : isDark
                ? 'border-zinc-800 text-white'
                : 'border-zinc-100 text-orange-950'
            }`}
          >
            <span
              className={`w-1.5 h-6 rounded-full inline-block shrink-0 ${
                isSepia ? 'bg-[#c48633]' : 'bg-orange-500'
              }`}
            />
            <span>{trimmed.replace('## ', '')}</span>
          </h2>
        );
        return;
      }

      // Heading 3
      if (trimmed.startsWith('### ')) {
        elements.push(
          <h3
            key={index}
            className={`text-lg sm:text-xl font-bold mt-6 mb-3 font-['Hind_Siliguri',sans-serif] ${
              isSepia ? 'text-[#3a2717]' : isDark ? 'text-zinc-100' : 'text-orange-900'
            }`}
          >
            {trimmed.replace('### ', '')}
          </h3>
        );
        return;
      }

      // Blockquote / Tip box
      if (trimmed.startsWith('> ')) {
        elements.push(
          <div
            key={index}
            className={`my-5 p-4 sm:p-5 rounded-2xl border-l-4 text-sm sm:text-base leading-relaxed font-['Hind_Siliguri',sans-serif] italic shadow-xs transition-colors ${
              isSepia
                ? 'bg-[#f4e6cb] border-[#b6792a] text-[#332313]'
                : isDark
                ? 'bg-zinc-800/80 border-orange-500 text-zinc-300'
                : 'bg-orange-50/80 border-orange-500 text-zinc-800'
            }`}
          >
            {trimmed.replace('> ', '').replace(/\*\*/g, '')}
          </div>
        );
        return;
      }

      // Regular Paragraph
      elements.push(
        <p
          key={index}
          className={`text-sm sm:text-base font-['Hind_Siliguri',sans-serif] leading-relaxed my-3 transition-colors ${
            isSepia ? 'text-[#3d2e1e]' : isDark ? 'text-zinc-300' : 'text-zinc-700'
          }`}
        >
          {trimmed}
        </p>
      );
    });

    flushList('flush_list_end');
    flushTable('flush_table_end');

    return elements;
  };

  return (
    <div
      className={`min-h-screen font-sans relative overflow-x-clip pb-28 sm:pb-20 transition-colors duration-300 ${
        isSepia
          ? 'bg-[#f7eed8] text-[#3d2e1e] selection:bg-[#c48633] selection:text-white'
          : isDark
          ? 'bg-[#141312] text-[#ded9d2] selection:bg-orange-500 selection:text-white'
          : 'bg-[#fffbf7] text-zinc-900 selection:bg-orange-500 selection:text-white'
      }`}
    >
      {/* Background Decorative Gradients */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div
          className={`absolute -top-32 left-1/2 -translate-x-1/2 w-[800px] h-[500px] rounded-full blur-[120px] transition-opacity duration-500 ${
            isSepia
              ? 'bg-gradient-to-b from-[#e8d8b6]/60 via-[#f0e2c2]/40 to-transparent opacity-80'
              : isDark
              ? 'bg-gradient-to-b from-orange-950/20 via-zinc-900/30 to-transparent opacity-40'
              : 'bg-gradient-to-b from-orange-200/40 via-amber-100/30 to-transparent'
          }`}
        />
      </div>

      {/* Sticky Header */}
      <header
        className={`sticky top-0 z-40 backdrop-blur-md border-b shadow-xs transition-colors duration-300 ${
          isSepia
            ? 'bg-[#fbf3e4]/95 border-[#e2d3b6]'
            : isDark
            ? 'bg-[#1b1917]/95 border-zinc-800'
            : 'bg-white/95 border-orange-200/70'
        }`}
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 sm:h-18 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigateTo('/classroom/blog')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold font-['Hind_Siliguri',sans-serif] transition-colors cursor-pointer ${
                isSepia
                  ? 'bg-[#f0e0c0] hover:bg-[#e7d3ad] text-[#55381a]'
                  : isDark
                  ? 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200'
                  : 'bg-orange-50 hover:bg-orange-100 text-orange-700'
              }`}
            >
              <ArrowLeft size={14} />
              <span>সকল আর্টিকেল</span>
            </button>

            <span
              className={`hidden sm:inline ${
                isSepia ? 'text-[#d6c4a0]' : isDark ? 'text-zinc-700' : 'text-zinc-300'
              }`}
            >
              |
            </span>

            <div
              className="hidden sm:flex items-center gap-2 cursor-pointer"
              onClick={() => navigateTo('/classroom')}
            >
              <GraduationCap
                className={`w-5 h-5 ${isSepia ? 'text-[#b6792a]' : 'text-orange-600'}`}
              />
              <span
                className={`font-extrabold text-sm ${
                  isSepia ? 'text-[#2b1c0f]' : isDark ? 'text-zinc-100' : 'text-zinc-900'
                }`}
              >
                Mahim's{' '}
                <span className={isSepia ? 'text-[#b6792a]' : 'text-orange-600'}>
                  Classroom
                </span>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Paper / Sepia Mode Switcher */}
            <div
              className={`flex items-center p-1 rounded-xl border text-xs font-semibold transition-colors ${
                isSepia
                  ? 'bg-[#ede0c5] border-[#d8c59f]'
                  : isDark
                  ? 'bg-zinc-900 border-zinc-800'
                  : 'bg-orange-50/80 border-orange-200/70'
              }`}
            >
              <button
                onClick={() => handleThemeChange('light')}
                className={`flex items-center gap-1 px-2 py-1 rounded-lg transition-all cursor-pointer ${
                  readingTheme === 'light'
                    ? 'bg-white text-zinc-900 shadow-xs font-bold'
                    : 'text-zinc-600 hover:text-zinc-900'
                }`}
                title="স্বাভাবিক মোড (Light)"
              >
                <Sun size={12} className="text-amber-500" />
                <span className="hidden md:inline">স্বাভাবিক</span>
              </button>

              <button
                onClick={() => handleThemeChange('sepia')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
                  readingTheme === 'sepia'
                    ? 'bg-[#fbf4e6] text-[#362310] shadow-xs font-bold border border-[#decfa9]'
                    : isSepia
                    ? 'text-[#5e4121] hover:text-[#2c1a0a]'
                    : isDark
                    ? 'text-zinc-400 hover:text-zinc-100'
                    : 'text-zinc-600 hover:text-amber-900'
                }`}
                title="বইয়ের পাতা / পেপার মোড (Paper / Sepia)"
              >
                <BookOpen
                  size={12}
                  className={isSepia ? 'text-[#b6792a]' : 'text-amber-600'}
                />
                <span>পেপার মোড</span>
              </button>

              <button
                onClick={() => handleThemeChange('dark')}
                className={`flex items-center gap-1 px-2 py-1 rounded-lg transition-all cursor-pointer ${
                  readingTheme === 'dark'
                    ? 'bg-zinc-800 text-zinc-100 shadow-xs font-bold border border-zinc-700'
                    : isSepia
                    ? 'text-[#6d5133] hover:text-[#2c1a0a]'
                    : isDark
                    ? 'text-zinc-400 hover:text-zinc-200'
                    : 'text-zinc-600 hover:text-zinc-900'
                }`}
                title="রাতের অন্ধকার মোড (Dark)"
              >
                <Moon size={12} className="text-blue-400" />
                <span className="hidden md:inline">রাত</span>
              </button>
            </div>

            <button
              onClick={handleLike}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                isLiked
                  ? 'bg-rose-500 text-white shadow-md shadow-rose-500/20'
                  : isSepia
                  ? 'bg-[#f0dfc0] hover:bg-[#e7d2ad] text-[#55381a]'
                  : isDark
                  ? 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200'
                  : 'bg-zinc-100 hover:bg-rose-50 text-zinc-700 hover:text-rose-600'
              }`}
            >
              <Heart size={14} className={isLiked ? 'fill-white' : ''} />
              <span>{likesCount}</span>
            </button>

            <button
              onClick={handleCopyLink}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold shadow-md transition-all font-['Hind_Siliguri',sans-serif] ${
                isSepia
                  ? 'bg-[#b6792a] hover:bg-[#a16820] text-white shadow-[#b6792a]/20'
                  : 'bg-orange-500 hover:bg-orange-600 text-white shadow-orange-500/20'
              }`}
              title="লিংক কপি করুন"
            >
              {copied ? <Check size={14} /> : <Share2 size={14} />}
              <span className="hidden sm:inline">{copied ? 'কপি হয়েছে!' : 'শেয়ার'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Reading Container */}
      <article className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 pt-6 sm:pt-10">
        {/* Breadcrumb Navigation & Admin Actions */}
        <div className="flex items-center justify-between gap-3 mb-6 flex-wrap">
          <div className="flex items-center gap-2 text-xs font-['Hind_Siliguri',sans-serif] text-zinc-500 flex-wrap">
            <button onClick={() => navigateTo('/')} className="hover:text-orange-600 transition-colors">
              হোম
            </button>
            <span>/</span>
            <button onClick={() => navigateTo('/classroom')} className="hover:text-orange-600 transition-colors">
              ক্লাসরুম
            </button>
            <span>/</span>
            <button onClick={() => navigateTo('/classroom/blog')} className="hover:text-orange-600 transition-colors">
              ব্লগ
            </button>
            <span>/</span>
            <span className="text-orange-600 font-bold">{post.topic}</span>
          </div>

          <button
            onClick={() => {
              if (window.confirm(`আপনি কি "${post.title}" আর্টিকেলটি স্থায়ীভাবে মুছে ফেলতে চান?`)) {
                deleteClassroomBlog(post.id);
                navigateTo('/classroom/blog');
              }
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-red-50 hover:bg-red-600 hover:text-white text-red-600 border border-red-200 text-xs font-bold font-['Hind_Siliguri',sans-serif] transition-all cursor-pointer shadow-xs"
            title="এই আর্টিকেলটি স্থায়ীভাবে মুছে ফেলুন"
          >
            <Trash2 size={13} />
            <span>পোস্টটি ডিলিট করুন</span>
          </button>
        </div>

        {/* Topic Badge & Title */}
        <div className="mb-6">
          <span
            className={`inline-block px-3 py-1 rounded-full text-xs font-bold font-['Hind_Siliguri',sans-serif] mb-3 border ${
              isSepia
                ? 'bg-[#f0dfc0] text-[#4a3116] border-[#decfa9]'
                : isDark
                ? 'bg-orange-950/60 text-orange-300 border-orange-900/50'
                : 'bg-orange-100 text-orange-800 border-orange-200'
            }`}
          >
            {post.topic}
          </span>
          <h1
            className={`text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight font-['Hind_Siliguri',sans-serif] mb-4 ${
              isSepia ? 'text-[#28190c]' : isDark ? 'text-zinc-50' : 'text-zinc-900'
            }`}
          >
            {post.title}
          </h1>

          {/* Author & Meta bar */}
          <div
            className={`flex flex-wrap items-center justify-between gap-4 py-4 border-y ${
              isSepia
                ? 'border-[#decfa9]'
                : isDark
                ? 'border-zinc-800'
                : 'border-orange-200/70'
            }`}
          >
            <div className="flex items-center gap-3">
              <img
                src={post.authorAvatar || 'https://res.cloudinary.com/drvyjj7td/image/upload/v1789388129/mahimmentor_lqt0tg.png'}
                alt={post.author}
                className={`w-10 h-10 rounded-full object-cover border-2 ${
                  isSepia
                    ? 'border-[#decfa9]'
                    : isDark
                    ? 'border-zinc-700'
                    : 'border-orange-300'
                }`}
              />
              <div>
                <p
                  className={`text-sm font-bold font-['Hind_Siliguri',sans-serif] leading-tight ${
                    isSepia ? 'text-[#28190c]' : isDark ? 'text-zinc-100' : 'text-zinc-900'
                  }`}
                >
                  {post.author}
                </p>
                <p
                  className={`text-xs font-['Hind_Siliguri',sans-serif] ${
                    isSepia ? 'text-[#6b4e2b]' : isDark ? 'text-zinc-400' : 'text-zinc-500'
                  }`}
                >
                  {post.authorRole || "ফাউন্ডার ও মেন্টর, মাহিম'স ক্লাসরুম"}
                </p>
              </div>
            </div>

            <div
              className={`flex items-center gap-4 text-xs font-['Hind_Siliguri',sans-serif] ${
                isSepia ? 'text-[#6b4e2b]' : isDark ? 'text-zinc-400' : 'text-zinc-500'
              }`}
            >
              <span className="flex items-center gap-1">
                <Calendar
                  size={13}
                  className={isSepia ? 'text-[#b6792a]' : isDark ? 'text-orange-400' : 'text-orange-500'}
                />
                {post.date}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock
                  size={13}
                  className={isSepia ? 'text-[#b6792a]' : isDark ? 'text-orange-400' : 'text-orange-500'}
                />
                {post.readTime}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Eye
                  size={13}
                  className={isSepia ? 'text-[#b6792a]' : isDark ? 'text-orange-400' : 'text-orange-500'}
                />
                {post.views || 1} ভিউ
              </span>
            </div>
          </div>
        </div>

        {/* Featured Cover Image */}
        {post.coverImage && (
          <div
            className={`mb-8 rounded-3xl overflow-hidden shadow-lg border aspect-video sm:aspect-[21/10] ${
              isSepia
                ? 'border-[#decfa9] bg-[#f0dfc0]'
                : isDark
                ? 'border-zinc-800 bg-zinc-900'
                : 'border-orange-200/80 bg-zinc-100'
            }`}
          >
            <img
              src={post.coverImage}
              alt={post.title}
              className="w-full h-full object-cover object-center"
            />
          </div>
        )}

        {/* Post Summary Callout */}
        {post.excerpt && (
          <div
            className={`p-5 sm:p-6 rounded-2xl font-['Hind_Siliguri',sans-serif] text-sm sm:text-base font-medium leading-relaxed mb-8 shadow-xs border transition-colors ${
              isSepia
                ? 'bg-[#f4e6cb] border-[#decfa9] text-[#332313]'
                : isDark
                ? 'bg-zinc-900 border-zinc-800 text-zinc-300'
                : 'bg-orange-100/70 border-orange-300/80 text-orange-950'
            }`}
          >
            <span
              className={`font-bold block mb-1 ${
                isSepia ? 'text-[#6b4216]' : isDark ? 'text-orange-400' : 'text-orange-800'
              }`}
            >
              সারসংক্ষেপ:
            </span>
            {post.excerpt}
          </div>
        )}

        {/* Article Body Content */}
        <div
          className={`rounded-3xl p-6 sm:p-10 border shadow-sm mb-10 transition-colors ${
            isSepia
              ? 'bg-[#fbf4e5] border-[#decfa9] text-[#3d2e1e]'
              : isDark
              ? 'bg-[#1b1917] border-zinc-800 text-zinc-200'
              : 'bg-white border-orange-200/80 text-zinc-900'
          }`}
        >
          <div className="prose prose-orange max-w-none">
            {renderFormattedContent(post.content)}
          </div>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div
              className={`mt-8 pt-6 border-t flex flex-wrap items-center gap-2 ${
                isSepia
                  ? 'border-[#decfa9]'
                  : isDark
                  ? 'border-zinc-800'
                  : 'border-zinc-100'
              }`}
            >
              <span
                className={`text-xs font-bold font-['Hind_Siliguri',sans-serif] flex items-center gap-1 mr-1 ${
                  isSepia ? 'text-[#6b4e2b]' : isDark ? 'text-zinc-400' : 'text-zinc-500'
                }`}
              >
                <Tag
                  size={13}
                  className={isSepia ? 'text-[#b6792a]' : isDark ? 'text-orange-400' : 'text-orange-500'}
                />
                ট্যাগসমূহ:
              </span>
              {post.tags.map((t, i) => (
                <span
                  key={i}
                  className={`px-2.5 py-1 rounded-lg text-xs font-['Hind_Siliguri',sans-serif] font-medium ${
                    isSepia
                      ? 'bg-[#f2e2c4] text-[#4d3318]'
                      : isDark
                      ? 'bg-zinc-800 text-zinc-300'
                      : 'bg-zinc-100 text-zinc-700'
                  }`}
                >
                  #{t}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Social Share & Permanent Link Box */}
        <div
          className={`p-6 rounded-3xl border mb-12 transition-colors ${
            isSepia
              ? 'bg-[#f4e6cb] border-[#decfa9]'
              : isDark
              ? 'bg-[#1b1917] border-zinc-800'
              : 'bg-orange-50 border-orange-200'
          }`}
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h4
                className={`text-sm font-bold font-['Hind_Siliguri',sans-serif] ${
                  isSepia ? 'text-[#28190c]' : isDark ? 'text-zinc-100' : 'text-zinc-900'
                }`}
              >
                পোস্টের স্থায়ী লিংক ও বন্ধুদের সাথে শেয়ার করুন
              </h4>
              <p
                className={`text-xs font-mono mt-0.5 break-all ${
                  isSepia ? 'text-[#6b4e2b]' : isDark ? 'text-zinc-400' : 'text-zinc-500'
                }`}
              >
                {currentUrl}
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handleCopyLink}
                className="px-3.5 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold flex items-center gap-1.5 font-['Hind_Siliguri',sans-serif] transition-all shadow-sm"
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
                <span>{copied ? 'কপি হয়েছে' : 'লিংক কপি'}</span>
              </button>

              <a
                href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`${post.title}\n\nপড়ুন বিস্তারিত:\n${currentUrl}`)}`}
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white transition-colors"
                title="হোয়াটসঅ্যাপে শেয়ার করুন"
              >
                <MessageCircle size={16} />
              </a>

              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`}
                target="_blank"
                rel="noreferrer"
                className="p-2 rounded-xl bg-[#1877F2] hover:bg-[#1565cf] text-white transition-colors"
                title="ফেসবুকে শেয়ার করুন"
              >
                <ExternalLink size={16} />
              </a>
            </div>
          </div>
        </div>

        {/* Author Bio Box */}
        <div
          className={`p-6 rounded-3xl border shadow-xs mb-12 flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left transition-colors ${
            isSepia
              ? 'bg-[#fbf4e5] border-[#decfa9]'
              : isDark
              ? 'bg-[#1b1917] border-zinc-800'
              : 'bg-white border-orange-200/80'
          }`}
        >
          <img
            src={post.authorAvatar || 'https://res.cloudinary.com/drvyjj7td/image/upload/v1789388129/mahimmentor_lqt0tg.png'}
            alt={post.author}
            className={`w-16 h-16 rounded-2xl object-cover border-2 shadow-sm shrink-0 ${
              isSepia ? 'border-[#decfa9]' : isDark ? 'border-zinc-700' : 'border-orange-300'
            }`}
          />
          <div>
            <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
              <h4
                className={`text-base font-bold font-['Hind_Siliguri',sans-serif] ${
                  isSepia ? 'text-[#28190c]' : isDark ? 'text-zinc-100' : 'text-zinc-900'
                }`}
              >
                {post.author}
              </h4>
              <span
                className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  isSepia
                    ? 'bg-[#f0dfc0] text-[#4d3318]'
                    : isDark
                    ? 'bg-zinc-800 text-zinc-300'
                    : 'bg-orange-100 text-orange-800'
                }`}
              >
                লেখক
              </span>
            </div>
            <p
              className={`text-xs font-['Hind_Siliguri',sans-serif] leading-relaxed ${
                isSepia ? 'text-[#6b4e2b]' : isDark ? 'text-zinc-400' : 'text-zinc-600'
              }`}
            >
              {post.authorRole || "মাহিম'স ক্লাসরুমের প্রতিষ্ঠাতা ও এডমিশন মেন্টর। শিক্ষার্থীদের সঠিক গাইডলাইন ও কনসেপ্টভিত্তিক শিক্ষার মাধ্যমে স্বপ্নজয়ের সারথী।"}
            </p>
          </div>
        </div>

        {/* Related Articles */}
        {relatedPosts.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center justify-between mb-4">
              <h3
                className={`text-lg font-bold font-['Hind_Siliguri',sans-serif] flex items-center gap-2 ${
                  isSepia ? 'text-[#28190c]' : isDark ? 'text-zinc-100' : 'text-zinc-900'
                }`}
              >
                <BookMarked
                  size={18}
                  className={isSepia ? 'text-[#b6792a]' : 'text-orange-600'}
                />
                <span>সম্পর্কিত আরও আর্টিকেল</span>
              </h3>
              <button
                onClick={() => navigateTo('/classroom/blog')}
                className={`text-xs font-bold font-['Hind_Siliguri',sans-serif] hover:underline ${
                  isSepia ? 'text-[#b6792a]' : 'text-orange-600'
                }`}
              >
                সকল ব্লগ দেখুন
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {relatedPosts.map((rel) => (
                <div
                  key={rel.slug}
                  onClick={() => navigateTo(`/classroom/blog/${rel.slug}`)}
                  className={`rounded-2xl p-4 border shadow-xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between ${
                    isSepia
                      ? 'bg-[#fbf4e5] border-[#decfa9] hover:border-[#b6792a]'
                      : isDark
                      ? 'bg-[#1b1917] border-zinc-800 hover:border-zinc-700'
                      : 'bg-white border-orange-200/90 hover:border-orange-400'
                  }`}
                >
                  <div>
                    <div className="aspect-video rounded-xl overflow-hidden mb-2.5 bg-zinc-100">
                      <img
                        src={rel.coverImage}
                        alt={rel.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                        isSepia
                          ? 'bg-[#f0dfc0] text-[#55381a]'
                          : isDark
                          ? 'bg-zinc-800 text-zinc-300'
                          : 'bg-orange-100 text-orange-700'
                      }`}
                    >
                      {rel.topic}
                    </span>
                    <h4
                      className={`text-xs sm:text-sm font-bold transition-colors font-['Hind_Siliguri',sans-serif] mt-1.5 line-clamp-2 leading-snug ${
                        isSepia
                          ? 'text-[#28190c] group-hover:text-[#b6792a]'
                          : isDark
                          ? 'text-zinc-100 group-hover:text-orange-400'
                          : 'text-zinc-900 group-hover:text-orange-600'
                      }`}
                    >
                      {rel.title}
                    </h4>
                  </div>
                  <div
                    className={`text-[11px] font-['Hind_Siliguri',sans-serif] mt-3 pt-2 border-t flex items-center justify-between ${
                      isSepia
                        ? 'text-[#876a4a] border-[#decfa9]/60'
                        : isDark
                        ? 'text-zinc-500 border-zinc-800'
                        : 'text-zinc-400 border-zinc-100'
                    }`}
                  >
                    <span>{rel.readTime}</span>
                    <ChevronRight
                      size={14}
                      className={
                        isSepia
                          ? 'text-[#b6792a] group-hover:translate-x-1 transition-transform'
                          : 'text-orange-600 group-hover:translate-x-1 transition-transform'
                      }
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </article>
    </div>
  );
};
