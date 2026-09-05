import React, { useState } from 'react';
import { useSite } from '../context/SiteContext';
import { BlogPost, PostVisibility } from '../types';
import { 
  BookOpen, 
  Lock, 
  Sparkles, 
  ShieldCheck, 
  Globe, 
  Calendar, 
  Clock, 
  User, 
  Eye, 
  ArrowRight, 
  X,
  Share2,
  AlertCircle
} from 'lucide-react';

export const BlogSection: React.FC = () => {
  const { posts, currentUser, isAdminAuthenticated, openAuthModal, selectedPostForView, viewPost } = useSite();
  const [filter, setFilter] = useState<'all' | 'public' | 'members' | 'vip'>('all');
  const [copiedLink, setCopiedLink] = useState(false);

  // Check if visitor has permission to see the post in the list
  const canAccessPost = (post: BlogPost) => {
    if (isAdminAuthenticated) return true;
    if (post.visibility === 'public') return true;
    if (post.visibility === 'members') {
      return !!currentUser;
    }
    if (post.visibility === 'vip') {
      return !!currentUser && currentUser.role === 'vip' && currentUser.status === 'approved';
    }
    return false;
  };

  // ONLY posts that the visitor has explicit permission to view are rendered!
  // Private/Restricted posts are strictly NOT shown at all (no title, no card).
  const accessiblePosts = posts.filter(canAccessPost);

  const filteredPosts = accessiblePosts.filter(post => {
    if (filter === 'all') return true;
    return post.visibility === filter;
  });

  // Dynamic filter tabs based on what the current user can access
  const availableFilters: { key: 'all' | 'public' | 'members' | 'vip'; label: string }[] = [
    { key: 'all', label: 'সকল পোস্ট' },
    { key: 'public', label: 'পাবলিক পোস্ট' },
  ];

  if (accessiblePosts.some(p => p.visibility === 'members')) {
    availableFilters.push({ key: 'members', label: 'মেম্বার পোস্ট' });
  }
  if (accessiblePosts.some(p => p.visibility === 'vip')) {
    availableFilters.push({ key: 'vip', label: 'সংরক্ষিত পোস্ট' });
  }

  const handlePostClick = (post: BlogPost) => {
    viewPost(post);
  };

  const getVisibilityBadge = (vis: PostVisibility) => {
    switch (vis) {
      case 'public':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-300">
            <Globe className="w-3 h-3 text-emerald-700" />
            <span>পাবলিক</span>
          </span>
        );
      case 'members':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-zinc-100 text-zinc-800 border border-black/15">
            <ShieldCheck className="w-3 h-3 text-black" />
            <span>নিবন্ধিত রিডার</span>
          </span>
        );
      case 'vip':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-zinc-100 text-zinc-800 border border-black/15">
            <Lock className="w-3 h-3 text-zinc-700" />
            <span>সংরক্ষিত</span>
          </span>
        );
    }
  };

  return (
    <section id="blog" className="py-24 relative bg-[#fdfdfb]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-zinc-100 border border-black/10 text-zinc-800 text-xs font-bold uppercase tracking-wider">
            <BookOpen className="w-3.5 h-3.5 text-black" />
            <span>আর্টিকেল ও ব্লগ</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#1a1a1a] tracking-tight">
            ডিজাইন চিন্তাভাবনা, টিউটোরিয়াল ও রিসোর্স
          </h2>
          <p className="text-zinc-600 text-sm sm:text-base leading-relaxed font-normal">
            গ্রাফিক ডিজাইন, ব্র্যান্ডিং ইনসাইটস ও প্রফেশনাল ডিজাইনিং গাইডলাইন এবং আর্টিকেলসমূহ
          </p>
        </div>

        {/* Filter & Access Status Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10 pb-6 border-b border-black/10">
          
          {/* Filter tabs */}
          <div className="flex items-center gap-2 flex-wrap">
            {availableFilters.map(t => (
              <button
                key={t.key}
                onClick={() => setFilter(t.key)}
                className={`px-4 py-1.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                  filter === t.key
                    ? 'bg-black text-white shadow-sm'
                    : 'bg-white text-zinc-700 hover:text-black border border-black/10'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* User Reader Status notice */}
          <div className="text-xs text-zinc-600 flex items-center gap-2 font-medium">
            {currentUser ? (
              <span className="flex items-center gap-1.5 text-black font-bold">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>লগইন আছেন: <strong className="text-black">{currentUser.name}</strong> ({currentUser.role === 'vip' ? 'অনুমোদিত অ্যাক্সেস' : 'সাধারণ পাঠক'})</span>
              </span>
            ) : (
              <button
                onClick={openAuthModal}
                className="text-black font-bold hover:underline underline-offset-4 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 border border-black/10 transition-colors cursor-pointer"
              >
                <Lock className="w-3.5 h-3.5 text-black" />
                <span>সংরক্ষিত পোস্ট পড়তে লগইন করুন</span>
              </button>
            )}
          </div>

        </div>

        {/* Blog Posts Grid */}
        {filteredPosts.length === 0 ? (
          <div className="text-center py-16 px-4 rounded-3xl bg-zinc-50 border border-black/10 max-w-md mx-auto space-y-3">
            <BookOpen className="w-8 h-8 text-zinc-400 mx-auto" />
            <p className="text-sm font-bold text-zinc-700">বর্তমানে কোনো পোস্ট প্রদর্শিত নেই।</p>
            <button
              onClick={() => setFilter('all')}
              className="text-xs font-bold text-black underline underline-offset-4 cursor-pointer"
            >
              সকল পোস্ট দেখুন
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map(post => {
              return (
                <article
                  key={post.id}
                  onClick={() => handlePostClick(post)}
                  className="bg-white border border-black/10 hover:border-black/30 hover:shadow-lg rounded-2xl overflow-hidden flex flex-col justify-between group cursor-pointer relative shadow-sm transition-all"
                >
                  {/* Cover Image */}
                  <div className="relative aspect-video w-full overflow-hidden bg-zinc-100 border-b border-black/10">
                    <img
                      src={post.coverImage}
                      alt={post.altText || post.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    
                    {/* Visibility Tag overlay */}
                    <div className="absolute top-3 left-3">
                      {getVisibilityBadge(post.visibility)}
                    </div>

                    {/* Category overlay */}
                    <div className="absolute bottom-3 left-3">
                      <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-md bg-white/95 backdrop-blur-md text-zinc-900 border border-black/10 shadow-xs">
                        {post.category}
                      </span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      {/* Meta */}
                      <div className="flex items-center gap-4 text-xs text-zinc-500 mb-2.5 font-mono font-medium">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-black" />
                          {post.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-black" />
                          {post.readTime}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="text-lg font-black text-[#1a1a1a] group-hover:text-black transition-colors line-clamp-2 leading-snug">
                        {post.title}
                      </h3>

                      {/* Excerpt */}
                      <p className="text-xs sm:text-sm text-zinc-600 mt-2 line-clamp-3 leading-relaxed font-normal">
                        {post.excerpt}
                      </p>
                    </div>

                    {/* Footer read CTA */}
                    <div className="pt-4 border-t border-black/10 flex items-center justify-between text-xs font-bold">
                      <span className="text-black group-hover:underline flex items-center gap-1">
                        <span>সম্পূর্ণ পড়ুন</span>
                        <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                      </span>
                      <span className="text-zinc-500 text-[11px] font-mono font-medium">
                        লেখক: {post.author}
                      </span>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}

      </div>

      {/* Reader Modal for viewing full blog post */}
      {selectedPostForView && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/70 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-3xl my-8 bg-white border-2 border-black rounded-3xl shadow-2xl overflow-hidden text-left">
            
            {/* Modal Header bar */}
            <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 bg-white/95 backdrop-blur-md border-b border-black/10">
              <div className="flex items-center gap-2">
                {getVisibilityBadge(selectedPostForView.visibility)}
                <span className="text-xs text-zinc-600 font-mono font-bold">
                  {selectedPostForView.category}
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    setCopiedLink(true);
                    setTimeout(() => setCopiedLink(false), 2000);
                  }}
                  className="p-2 rounded-xl text-zinc-600 hover:text-black bg-zinc-100 hover:bg-zinc-200 transition-colors"
                  title="লিংক কপি করুন"
                >
                  <Share2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => viewPost(null)}
                  className="p-2 rounded-xl text-zinc-600 hover:text-black bg-zinc-100 hover:bg-zinc-200 transition-colors"
                  title="বন্ধ করুন"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Scrollable Body */}
            <div className="p-6 sm:p-10 max-h-[75vh] overflow-y-auto space-y-6">
              
              {/* Post Title */}
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#1a1a1a] leading-tight">
                {selectedPostForView.title}
              </h1>

              {/* Meta details */}
              <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-600 pb-4 border-b border-black/10">
                <span className="flex items-center gap-1.5 text-black font-bold">
                  <User className="w-4 h-4" />
                  {selectedPostForView.author}
                </span>
                <span className="flex items-center gap-1.5 font-mono">
                  <Calendar className="w-4 h-4 text-zinc-400" />
                  {selectedPostForView.date}
                </span>
                <span className="flex items-center gap-1.5 font-mono">
                  <Clock className="w-4 h-4 text-zinc-400" />
                  {selectedPostForView.readTime}
                </span>
                {copiedLink && (
                  <span className="text-emerald-700 font-bold text-xs ml-auto">
                    ✓ লিংক কপি হয়েছে!
                  </span>
                )}
              </div>

              {/* Cover Image */}
              {selectedPostForView.coverImage && (
                <div className="rounded-2xl overflow-hidden border border-black/10 shadow-sm">
                  <img
                    src={selectedPostForView.coverImage}
                    alt={selectedPostForView.altText || selectedPostForView.title}
                    className="w-full max-h-[400px] object-cover"
                  />
                </div>
              )}

              {/* Excerpt Lead */}
              <p className="text-base sm:text-lg text-zinc-800 font-medium leading-relaxed bg-zinc-100 p-4 rounded-xl border-l-4 border-black">
                {selectedPostForView.excerpt}
              </p>

              {/* Content Render */}
              <div className="prose max-w-none text-zinc-800 text-sm sm:text-base leading-relaxed space-y-4 whitespace-pre-line font-normal">
                {selectedPostForView.content}
              </div>

              {/* Author footer card */}
              <div className="mt-8 p-5 rounded-2xl bg-zinc-100 border border-black/10 flex items-center justify-between flex-wrap gap-4">
                <div>
                  <h4 className="text-sm font-black text-black">মাহিম ইবনে খুদি</h4>
                  <p className="text-xs text-zinc-600 font-medium">গ্রাফিক ডিজাইনার ও কনটেন্ট ক্রিয়েটর (mahims.com)</p>
                </div>
                <a
                  href="#contact"
                  onClick={() => viewPost(null)}
                  className="px-4 py-2 rounded-xl bg-black text-white font-bold text-xs hover:bg-zinc-800 transition-colors shadow-sm"
                >
                  মাহিমের সাথে যোগাযোগ
                </a>
              </div>

            </div>

          </div>
        </div>
      )}

    </section>
  );
};
