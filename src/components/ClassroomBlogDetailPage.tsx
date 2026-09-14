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
} from 'lucide-react';
import { navigateTo } from '../utils/navigation';
import { ClassroomBlogPost } from '../data/classroomBlogs';
import {
  getClassroomBlogBySlug,
  getClassroomBlogs,
  incrementClassroomBlogView,
  toggleClassroomBlogLike,
  isClassroomBlogLiked,
} from '../utils/classroomBlogStorage';

interface ClassroomBlogDetailPageProps {
  slug: string;
}

export const ClassroomBlogDetailPage: React.FC<ClassroomBlogDetailPageProps> = ({ slug }) => {
  const [post, setPost] = useState<ClassroomBlogPost | null>(() => getClassroomBlogBySlug(slug));
  const [copied, setCopied] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);

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
              <li key={i} className="flex items-start gap-2.5 text-zinc-700 text-sm sm:text-base leading-relaxed">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-500 mt-2.5 shrink-0" />
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
            <div key={key} className="my-6 overflow-x-auto rounded-2xl border border-orange-200/90 shadow-xs bg-white">
              <table className="w-full text-left border-collapse text-xs sm:text-sm">
                <thead className="bg-orange-50/80 text-orange-950 font-bold border-b border-orange-200">
                  <tr>
                    {header.map((col, idx) => (
                      <th key={idx} className="p-3.5 whitespace-nowrap">
                        {col.replace(/\*\*/g, '')}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-orange-100">
                  {body.map((row, rIdx) => (
                    <tr key={rIdx} className="hover:bg-orange-50/30 transition-colors">
                      {row.map((cell, cIdx) => (
                        <td key={cIdx} className="p-3 text-zinc-700 font-medium">
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
            className="text-xl sm:text-2xl font-bold text-zinc-900 mt-8 mb-4 pt-4 border-t border-zinc-100 font-['Hind_Siliguri',sans-serif] tracking-tight text-orange-950 flex items-center gap-2"
          >
            <span className="w-1.5 h-6 rounded-full bg-orange-500 inline-block shrink-0" />
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
            className="text-lg sm:text-xl font-bold text-zinc-900 mt-6 mb-3 font-['Hind_Siliguri',sans-serif] text-orange-900"
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
            className="my-5 p-4 sm:p-5 rounded-2xl bg-orange-50/80 border-l-4 border-orange-500 text-zinc-800 text-sm sm:text-base leading-relaxed font-['Hind_Siliguri',sans-serif] italic shadow-xs"
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
          className="text-sm sm:text-base text-zinc-700 font-['Hind_Siliguri',sans-serif] leading-relaxed my-3"
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
    <div className="min-h-screen bg-[#fffbf7] text-zinc-900 selection:bg-orange-500 selection:text-white font-sans relative overflow-x-clip pb-28 sm:pb-20">
      {/* Background Decorative Gradients */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[800px] h-[500px] rounded-full bg-gradient-to-b from-orange-200/40 via-amber-100/30 to-transparent blur-[120px]" />
      </div>

      {/* Sticky Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-orange-200/70 shadow-xs transition-all">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 sm:h-18 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigateTo('/classroom/blog')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-50 hover:bg-orange-100 text-orange-700 text-xs font-bold font-['Hind_Siliguri',sans-serif] transition-colors cursor-pointer"
            >
              <ArrowLeft size={14} />
              <span>সকল আর্টিকেল</span>
            </button>

            <span className="hidden sm:inline text-zinc-300">|</span>

            <div
              className="hidden sm:flex items-center gap-2 cursor-pointer"
              onClick={() => navigateTo('/classroom')}
            >
              <GraduationCap className="w-5 h-5 text-orange-600" />
              <span className="font-extrabold text-sm text-zinc-900">
                Mahim's <span className="text-orange-600">Classroom</span>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleLike}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                isLiked
                  ? 'bg-rose-500 text-white shadow-md shadow-rose-500/20'
                  : 'bg-zinc-100 hover:bg-rose-50 text-zinc-700 hover:text-rose-600'
              }`}
            >
              <Heart size={14} className={isLiked ? 'fill-white' : ''} />
              <span>{likesCount}</span>
            </button>

            <button
              onClick={handleCopyLink}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold shadow-md shadow-orange-500/20 transition-all font-['Hind_Siliguri',sans-serif]"
              title="লিংক কপি করুন"
            >
              {copied ? <Check size={14} /> : <Share2 size={14} />}
              <span>{copied ? 'কপি হয়েছে!' : 'শেয়ার'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Reading Container */}
      <article className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 pt-6 sm:pt-10">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs font-['Hind_Siliguri',sans-serif] text-zinc-500 mb-6 flex-wrap">
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

        {/* Topic Badge & Title */}
        <div className="mb-6">
          <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-orange-100 text-orange-800 border border-orange-200 font-['Hind_Siliguri',sans-serif] mb-3">
            {post.topic}
          </span>
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-zinc-900 tracking-tight leading-tight font-['Hind_Siliguri',sans-serif] mb-4">
            {post.title}
          </h1>

          {/* Author & Meta bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-y border-orange-200/70">
            <div className="flex items-center gap-3">
              <img
                src={post.authorAvatar || 'https://res.cloudinary.com/drvyjj7td/image/upload/v1789388129/mahimmentor_lqt0tg.png'}
                alt={post.author}
                className="w-10 h-10 rounded-full object-cover border-2 border-orange-300"
              />
              <div>
                <p className="text-sm font-bold text-zinc-900 font-['Hind_Siliguri',sans-serif] leading-tight">
                  {post.author}
                </p>
                <p className="text-xs text-zinc-500 font-['Hind_Siliguri',sans-serif]">
                  {post.authorRole || "ফাউন্ডার ও মেন্টর, মাহিম'স ক্লাসরুম"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs text-zinc-500 font-['Hind_Siliguri',sans-serif]">
              <span className="flex items-center gap-1">
                <Calendar size={13} className="text-orange-500" />
                {post.date}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock size={13} className="text-orange-500" />
                {post.readTime}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Eye size={13} className="text-orange-500" />
                {post.views || 1} ভিউ
              </span>
            </div>
          </div>
        </div>

        {/* Featured Cover Image */}
        {post.coverImage && (
          <div className="mb-8 rounded-3xl overflow-hidden shadow-lg border border-orange-200/80 bg-zinc-100 aspect-video sm:aspect-[21/10]">
            <img
              src={post.coverImage}
              alt={post.title}
              className="w-full h-full object-cover object-center"
            />
          </div>
        )}

        {/* Post Summary Callout */}
        {post.excerpt && (
          <div className="p-5 sm:p-6 rounded-2xl bg-orange-100/70 border border-orange-300/80 text-orange-950 font-['Hind_Siliguri',sans-serif] text-sm sm:text-base font-medium leading-relaxed mb-8 shadow-xs">
            <span className="font-bold text-orange-800 block mb-1">সারসংক্ষেপ:</span>
            {post.excerpt}
          </div>
        )}

        {/* Article Body Content */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-orange-200/80 shadow-sm mb-10">
          <div className="prose prose-orange max-w-none">
            {renderFormattedContent(post.content)}
          </div>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="mt-8 pt-6 border-t border-zinc-100 flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-zinc-500 font-['Hind_Siliguri',sans-serif] flex items-center gap-1 mr-1">
                <Tag size={13} className="text-orange-500" />
                ট্যাগসমূহ:
              </span>
              {post.tags.map((t, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 rounded-lg bg-zinc-100 text-zinc-700 text-xs font-['Hind_Siliguri',sans-serif] font-medium"
                >
                  #{t}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Social Share & Permanent Link Box */}
        <div className="p-6 rounded-3xl bg-orange-50 border border-orange-200 mb-12">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h4 className="text-sm font-bold text-zinc-900 font-['Hind_Siliguri',sans-serif]">
                পোস্টের স্থায়ী লিংক ও বন্ধুদের সাথে শেয়ার করুন
              </h4>
              <p className="text-xs text-zinc-500 font-mono mt-0.5 break-all">
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
        <div className="p-6 rounded-3xl bg-white border border-orange-200/80 shadow-xs mb-12 flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
          <img
            src={post.authorAvatar || 'https://res.cloudinary.com/drvyjj7td/image/upload/v1789388129/mahimmentor_lqt0tg.png'}
            alt={post.author}
            className="w-16 h-16 rounded-2xl object-cover border-2 border-orange-300 shadow-sm shrink-0"
          />
          <div>
            <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
              <h4 className="text-base font-bold text-zinc-900 font-['Hind_Siliguri',sans-serif]">
                {post.author}
              </h4>
              <span className="px-2 py-0.5 rounded-full bg-orange-100 text-orange-800 text-[10px] font-bold">
                লেখক
              </span>
            </div>
            <p className="text-xs text-zinc-600 font-['Hind_Siliguri',sans-serif] leading-relaxed">
              {post.authorRole || "মাহিম'স ক্লাসরুমের প্রতিষ্ঠাতা ও এডমিশন মেন্টর। শিক্ষার্থীদের সঠিক গাইডলাইন ও কনসেপ্টভিত্তিক শিক্ষার মাধ্যমে স্বপ্নজয়ের সারথী।"}
            </p>
          </div>
        </div>

        {/* Related Articles */}
        {relatedPosts.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-zinc-900 font-['Hind_Siliguri',sans-serif] flex items-center gap-2">
                <BookMarked size={18} className="text-orange-600" />
                <span>সম্পর্কিত আরও আর্টিকেল</span>
              </h3>
              <button
                onClick={() => navigateTo('/classroom/blog')}
                className="text-xs font-bold text-orange-600 font-['Hind_Siliguri',sans-serif] hover:underline"
              >
                সকল ব্লগ দেখুন
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {relatedPosts.map((rel) => (
                <div
                  key={rel.slug}
                  onClick={() => navigateTo(`/classroom/blog/${rel.slug}`)}
                  className="bg-white border border-orange-200/90 hover:border-orange-400 rounded-2xl p-4 shadow-xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
                >
                  <div>
                    <div className="aspect-video rounded-xl overflow-hidden mb-2.5 bg-zinc-100">
                      <img
                        src={rel.coverImage}
                        alt={rel.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <span className="text-[10px] font-bold text-orange-700 bg-orange-100 px-2 py-0.5 rounded-md">
                      {rel.topic}
                    </span>
                    <h4 className="text-xs sm:text-sm font-bold text-zinc-900 group-hover:text-orange-600 transition-colors font-['Hind_Siliguri',sans-serif] mt-1.5 line-clamp-2 leading-snug">
                      {rel.title}
                    </h4>
                  </div>
                  <div className="text-[11px] text-zinc-400 font-['Hind_Siliguri',sans-serif] mt-3 pt-2 border-t border-zinc-100 flex items-center justify-between">
                    <span>{rel.readTime}</span>
                    <ChevronRight size={14} className="text-orange-600 group-hover:translate-x-1 transition-transform" />
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
