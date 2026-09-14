import React, { useState } from 'react';
import {
  BookOpen,
  Plus,
  Search,
  Edit,
  Trash2,
  ExternalLink,
  Copy,
  Check,
  Image as ImageIcon,
  Sparkles,
  Eye,
  FileText,
  Upload,
  Link as LinkIcon,
  Tag,
  ArrowLeft,
  Calendar,
  Clock,
  User,
  Heart,
  Globe,
  Code2,
  CheckCircle2,
  HelpCircle,
} from 'lucide-react';
import { ClassroomBlogPost, DEFAULT_CLASSROOM_BLOG_TOPICS } from '../data/classroomBlogs';
import {
  getClassroomBlogs,
  saveClassroomBlog,
  deleteClassroomBlog,
  clearAllClassroomBlogs,
  generateSlugFromTitle,
  getAllBlogTopics,
  generateClassroomBlogsGitHubCode,
} from '../utils/classroomBlogStorage';
import { navigateTo } from '../utils/navigation';

export const ClassroomAdminBlogTab: React.FC = () => {
  const [blogs, setBlogs] = useState<ClassroomBlogPost[]>(() => getClassroomBlogs(true));
  const [topics, setTopics] = useState<string[]>(() => getAllBlogTopics());
  const [mode, setMode] = useState<'list' | 'editor' | 'github_code'>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTopic, setFilterTopic] = useState('all');
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);
  const [copiedGitHubCode, setCopiedGitHubCode] = useState(false);

  // Form states for Editor
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [topic, setTopic] = useState('এডমিশন গাইডলাইন');
  const [isCustomTopic, setIsCustomTopic] = useState(false);
  const [customTopicInput, setCustomTopicInput] = useState('');
  const [author, setAuthor] = useState('মাহিম ইবনে খুদি');
  const [authorRole, setAuthorRole] = useState("ফাউন্ডার ও মেন্টর, মাহিম'স ক্লাসরুম");
  const [coverImage, setCoverImage] = useState('https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1200&auto=format&fit=crop');
  const [imageInputTab, setImageInputTab] = useState<'link' | 'upload'>('link');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [seoKeywords, setSeoKeywords] = useState('');
  const [status, setStatus] = useState<'published' | 'draft'>('published');
  const [featured, setFeatured] = useState(false);
  const [editorPreviewMode, setEditorPreviewMode] = useState<'edit' | 'preview'>('edit');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const refreshList = () => {
    setBlogs(getClassroomBlogs(true));
    setTopics(getAllBlogTopics());
  };

  const handleStartNew = () => {
    setEditingId(null);
    setTitle('');
    setSlug('');
    setTopic('এডমিশন গাইডলাইন');
    setIsCustomTopic(false);
    setCustomTopicInput('');
    setAuthor('মাহিম ইবনে খুদি');
    setAuthorRole("ফাউন্ডার ও মেন্টর, মাহিম'স ক্লাসরুম");
    setCoverImage('https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1200&auto=format&fit=crop');
    setExcerpt('');
    setContent(`## আর্টিকেল ভূমিকা\n\nএখানে আপনার পোস্টের মূল ভূমিকা লিখুন...\n\n### গুরুত্বপূর্ণ বিষয়সমূহ\n- পয়েন্ট ১\n- পয়েন্ট ২\n\n> **পরামর্শ:** শিক্ষার্থীদের জন্য গুরুত্বপূর্ণ টিপস বা দিকনির্দেশনা এখানে দিন।`);
    setTagsInput('এডমিশন, গাইডলাইন, মাহিম ক্লাসরুম');
    setSeoKeywords('');
    setStatus('published');
    setFeatured(false);
    setEditorPreviewMode('edit');
    setSaveSuccess(false);
    setMode('editor');
  };

  const handleStartEdit = (post: ClassroomBlogPost) => {
    setEditingId(post.id);
    setTitle(post.title);
    setSlug(post.slug);
    if (DEFAULT_CLASSROOM_BLOG_TOPICS.includes(post.topic)) {
      setTopic(post.topic);
      setIsCustomTopic(false);
      setCustomTopicInput('');
    } else {
      setTopic(post.topic);
      setIsCustomTopic(true);
      setCustomTopicInput(post.topic);
    }
    setAuthor(post.author || 'মাহিম ইবনে খুদি');
    setAuthorRole(post.authorRole || "ফাউন্ডার ও মেন্টর, মাহিম'স ক্লাসরুম");
    setCoverImage(post.coverImage || '');
    setExcerpt(post.excerpt || '');
    setContent(post.content || '');
    setTagsInput(post.tags ? post.tags.join(', ') : '');
    setSeoKeywords(post.seoKeywords || '');
    setStatus(post.status || 'published');
    setFeatured(!!post.featured);
    setEditorPreviewMode('edit');
    setSaveSuccess(false);
    setMode('editor');
  };

  const handleDeletePost = (id: string, postTitle: string) => {
    if (window.confirm(`আপনি কি "${postTitle}" আর্টিকেলটি মুছে ফেলতে চান?`)) {
      deleteClassroomBlog(id);
      refreshList();
    }
  };

  const handleAutoSlug = () => {
    if (!title) return;
    const generated = generateSlugFromTitle(title);
    setSlug(generated);
  };

  // Image upload handler (converts to base64 Data URL)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 3 * 1024 * 1024) {
      alert('ছবির সাইজ ৩ মেগাবাইটের বেশি হওয়া যাবে না।');
      return;
    }

    const reader = new FileReader();
    reader.onload = (loadEvt) => {
      const result = loadEvt.target?.result as string;
      if (result) {
        setCoverImage(result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSavePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('অনুগ্রহ করে আর্টিকেলের শিরোনাম দিন।');
      return;
    }

    const finalTopic = isCustomTopic ? (customTopicInput.trim() || 'এডমিশন গাইডলাইন') : topic;
    const finalSlug = slug.trim() ? slug.trim().toLowerCase().replace(/^\/+|\/+$/g, '') : generateSlugFromTitle(title);
    const tags = tagsInput.split(',').map((t) => t.trim()).filter(Boolean);

    saveClassroomBlog({
      id: editingId || undefined,
      title: title.trim(),
      slug: finalSlug,
      topic: finalTopic,
      category: finalTopic,
      author: author.trim() || 'মাহিম ইবনে খুদি',
      authorRole: authorRole.trim(),
      coverImage: coverImage.trim() || 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1200&auto=format&fit=crop',
      excerpt: excerpt.trim(),
      content: content.trim(),
      tags,
      seoKeywords: seoKeywords.trim(),
      status,
      featured,
    });

    setSaveSuccess(true);
    refreshList();
    setTimeout(() => {
      setSaveSuccess(false);
      setMode('list');
    }, 1200);
  };

  const handleCopySlugLink = (postSlug: string) => {
    const fullUrl = `${window.location.origin}/classroom/blog/${postSlug}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(fullUrl);
      setCopiedSlug(postSlug);
      setTimeout(() => setCopiedSlug(null), 2500);
    }
  };

  const handleCopyGitHubCode = () => {
    const code = generateClassroomBlogsGitHubCode();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(code);
      setCopiedGitHubCode(true);
      setTimeout(() => setCopiedGitHubCode(false), 3000);
    }
  };

  // Helper toolbar functions for content insertion
  const insertTextAtCursor = (prefix: string, suffix = '') => {
    const textarea = document.getElementById('blog-content-textarea') as HTMLTextAreaElement | null;
    if (!textarea) {
      setContent((prev) => `${prev}\n${prefix}${suffix}`);
      return;
    }

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const currentVal = textarea.value;
    const selectedText = currentVal.substring(start, end) || 'এখানে লিখুন';
    const replacement = `${prefix}${selectedText}${suffix}`;

    const nextVal = currentVal.substring(0, start) + replacement + currentVal.substring(end);
    setContent(nextVal);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, start + prefix.length + selectedText.length);
    }, 50);
  };

  const filteredBlogs = blogs.filter((b) => {
    const matchesTopic =
      filterTopic === 'all' ||
      b.topic?.toLowerCase().trim() === filterTopic.toLowerCase().trim();

    const q = searchQuery.toLowerCase().trim();
    if (!q) return matchesTopic;

    return (
      b.title.toLowerCase().includes(q) ||
      b.slug.toLowerCase().includes(q) ||
      b.excerpt.toLowerCase().includes(q)
    );
  });

  return (
    <div className="flex-1 flex flex-col overflow-hidden font-sans">
      {/* View: GitHub Code Export Modal / View */}
      {mode === 'github_code' && (
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 bg-zinc-50">
          <div className="max-w-4xl mx-auto bg-white border border-orange-200 rounded-3xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-zinc-200">
              <div className="flex items-center gap-2">
                <Code2 size={20} className="text-orange-600" />
                <h3 className="text-base sm:text-lg font-bold text-zinc-900 font-['Hind_Siliguri',sans-serif]">
                  গিটহাব পুশের জন্য ফাইল কোড (src/data/classroomBlogs.ts)
                </h3>
              </div>
              <button
                onClick={() => setMode('list')}
                className="px-3 py-1.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-xs font-bold font-['Hind_Siliguri',sans-serif]"
              >
                তালিকায় ফিরুন
              </button>
            </div>

            <p className="text-xs text-zinc-600 font-['Hind_Siliguri',sans-serif] leading-relaxed mb-4">
              আপনি যখন এখানে নতুন আর্টিকেল লিখবেন বা আপডেট করবেন, তখন এই কোডটি কপি করে আপনার প্রোজেক্টের{' '}
              <code className="bg-orange-50 text-orange-700 px-1.5 py-0.5 rounded font-mono font-bold">
                src/data/classroomBlogs.ts
              </code>{' '}
              ফাইলে পেস্ট করে গিটহাবে পুশ করলেই মেইন ওয়েবসাইটে স্থায়ীভাবে ডিপ্লয় হয়ে যাবে।
            </p>

            <div className="flex items-center gap-3 mb-3">
              <button
                onClick={handleCopyGitHubCode}
                className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold flex items-center gap-1.5 font-['Hind_Siliguri',sans-serif] shadow-sm transition-all"
              >
                {copiedGitHubCode ? <Check size={14} /> : <Copy size={14} />}
                <span>{copiedGitHubCode ? 'সম্পূর্ণ কোড কপি করা হয়েছে!' : '১-ক্লিকে কোড কপি করুন'}</span>
              </button>

              <span className="text-xs text-zinc-500 font-['Hind_Siliguri',sans-serif]">
                মোট আর্টিকেল: {blogs.length}টি
              </span>
            </div>

            <pre className="bg-zinc-900 text-zinc-100 text-xs p-4 rounded-2xl overflow-x-auto max-h-[50vh] font-mono leading-relaxed select-all">
              {generateClassroomBlogsGitHubCode()}
            </pre>
          </div>
        </div>
      )}

      {/* View: WordPress-like Post Editor */}
      {mode === 'editor' && (
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-zinc-50">
          <form onSubmit={handleSavePost} className="max-w-4xl mx-auto space-y-6">
            {/* Header / Top Action Bar */}
            <div className="flex items-center justify-between pb-3 border-b border-zinc-200">
              <button
                type="button"
                onClick={() => setMode('list')}
                className="inline-flex items-center gap-1 text-xs font-bold text-zinc-600 hover:text-orange-600 transition-colors font-['Hind_Siliguri',sans-serif]"
              >
                <ArrowLeft size={14} />
                <span>তালিকায় ফিরে যান</span>
              </button>

              <div className="flex items-center gap-2">
                <div className="flex items-center bg-zinc-200/80 p-0.5 rounded-xl text-xs font-bold font-['Hind_Siliguri',sans-serif]">
                  <button
                    type="button"
                    onClick={() => setEditorPreviewMode('edit')}
                    className={`px-3 py-1 rounded-lg transition-colors ${
                      editorPreviewMode === 'edit' ? 'bg-white text-orange-600 shadow-xs' : 'text-zinc-600'
                    }`}
                  >
                    লিখুন (Editor)
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditorPreviewMode('preview')}
                    className={`px-3 py-1 rounded-lg transition-colors ${
                      editorPreviewMode === 'preview' ? 'bg-white text-orange-600 shadow-xs' : 'text-zinc-600'
                    }`}
                  >
                    লাইভ প্রিভিউ
                  </button>
                </div>

                {editingId && (
                  <button
                    type="button"
                    onClick={() => {
                      handleDeletePost(editingId, title);
                      setMode('list');
                    }}
                    className="px-3 py-1.5 rounded-xl bg-red-50 hover:bg-red-600 hover:text-white text-red-600 border border-red-200 text-xs font-bold font-['Hind_Siliguri',sans-serif] flex items-center gap-1.5 transition-all cursor-pointer"
                    title="এই পোস্টটি মুছে ফেলুন"
                  >
                    <Trash2 size={13} />
                    <span>ডিলিট করুন</span>
                  </button>
                )}

                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold shadow-md shadow-orange-500/20 font-['Hind_Siliguri',sans-serif] flex items-center gap-1.5 transition-all"
                >
                  <CheckCircle2 size={14} />
                  <span>{editingId ? 'আপডেট করুন' : 'পাবলিশ করুন'}</span>
                </button>
              </div>
            </div>

            {saveSuccess && (
              <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 font-['Hind_Siliguri',sans-serif]">
                <Check size={16} />
                <span>আর্টিকেল সফলভাবে সংরক্ষিত হয়েছে! রিডাইরেক্ট করা হচ্ছে...</span>
              </div>
            )}

            {editorPreviewMode === 'preview' ? (
              /* Live Preview Mode */
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-orange-200 shadow-xs">
                <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-orange-100 text-orange-800 border border-orange-200 font-['Hind_Siliguri',sans-serif] mb-3">
                  {isCustomTopic ? customTopicInput || 'টপিক' : topic}
                </span>
                <h1 className="text-2xl sm:text-3xl font-black text-zinc-900 font-['Hind_Siliguri',sans-serif] mb-3">
                  {title || 'আপনার আর্টিকেলের শিরোনাম'}
                </h1>
                <p className="text-xs text-zinc-500 font-mono mb-4">
                  ইউআরএল: {window.location.origin}/classroom/blog/{slug || 'custom-slug'}
                </p>
                {coverImage && (
                  <div className="aspect-video rounded-2xl overflow-hidden mb-6 bg-zinc-100">
                    <img src={coverImage} alt="Cover Preview" className="w-full h-full object-cover" />
                  </div>
                )}
                {excerpt && (
                  <div className="p-4 rounded-2xl bg-orange-50 border border-orange-200 text-orange-900 text-sm mb-6 font-['Hind_Siliguri',sans-serif]">
                    <strong>সারসংক্ষেপ:</strong> {excerpt}
                  </div>
                )}
                <div className="text-sm text-zinc-800 font-['Hind_Siliguri',sans-serif] whitespace-pre-line leading-relaxed">
                  {content || 'কোনো কন্টেন্ট লেখা হয়নি...'}
                </div>
              </div>
            ) : (
              /* Edit Form Mode */
              <div className="space-y-5">
                {/* 1. Title & URL Slug */}
                <div className="bg-white rounded-3xl p-5 border border-zinc-200 shadow-xs space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-zinc-700 font-['Hind_Siliguri',sans-serif] mb-1.5">
                      পোস্টের শিরোনাম (Post Title) *
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="যেমন: ঢাকা বিশ্ববিদ্যালয় ও পাবলিক এডমিশন প্রস্তুতি: শুরু থেকে চান্স পাওয়ার পরীক্ষিত রোডম্যাপ"
                      className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-2xl text-sm sm:text-base font-bold text-zinc-900 focus:outline-none focus:border-orange-500 focus:bg-white font-['Hind_Siliguri',sans-serif]"
                      required
                    />
                  </div>

                  {/* Permalink / Slug with Generator */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-bold text-zinc-700 font-['Hind_Siliguri',sans-serif]">
                        কাস্টম পারমালিংক / লিংক (URL Slug) *
                      </label>
                      <button
                        type="button"
                        onClick={handleAutoSlug}
                        className="text-[11px] font-bold text-orange-600 hover:text-orange-700 font-['Hind_Siliguri',sans-serif]"
                      >
                        টাইটেল থেকে তৈরি করুন
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="flex-1 flex items-center bg-zinc-50 border border-zinc-200 rounded-2xl px-3 py-2 text-xs font-mono text-zinc-700 focus-within:border-orange-500 focus-within:bg-white">
                        <span className="text-zinc-400 select-none hidden sm:inline">
                          mahims.com/classroom/blog/
                        </span>
                        <input
                          type="text"
                          value={slug}
                          onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'))}
                          placeholder="du-admission-preparation-roadmap-2026"
                          className="flex-1 bg-transparent focus:outline-none font-mono text-orange-700 font-bold ml-1"
                          required
                        />
                      </div>
                    </div>
                    <p className="text-[11px] text-zinc-400 font-['Hind_Siliguri',sans-serif] mt-1">
                      এই লিংকে সরাসরি যে কেউ আর্টিকেলে প্রবেশ করতে পারবে।
                    </p>
                  </div>
                </div>

                {/* 2. Topic & Category Selection */}
                <div className="bg-white rounded-3xl p-5 border border-zinc-200 shadow-xs">
                  <label className="block text-xs font-bold text-zinc-700 font-['Hind_Siliguri',sans-serif] mb-2">
                    টপিক / ক্যাটাগরি (Topic)
                  </label>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <select
                        value={isCustomTopic ? 'custom' : topic}
                        onChange={(e) => {
                          if (e.target.value === 'custom') {
                            setIsCustomTopic(true);
                          } else {
                            setIsCustomTopic(false);
                            setTopic(e.target.value);
                          }
                        }}
                        className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-2xl text-xs font-bold text-zinc-800 focus:outline-none focus:border-orange-500 font-['Hind_Siliguri',sans-serif]"
                      >
                        {DEFAULT_CLASSROOM_BLOG_TOPICS.map((top) => (
                          <option key={top} value={top}>
                            {top}
                          </option>
                        ))}
                        <option value="custom">+ নতুন কাস্টম টপিক দিন...</option>
                      </select>
                    </div>

                    {isCustomTopic && (
                      <div>
                        <input
                          type="text"
                          value={customTopicInput}
                          onChange={(e) => setCustomTopicInput(e.target.value)}
                          placeholder="নতুন টপিকের নাম লিখুন (যেমন: মেডিকেল গাইডলাইন)"
                          className="w-full px-4 py-2.5 bg-zinc-50 border border-orange-300 rounded-2xl text-xs font-bold text-zinc-900 focus:outline-none focus:border-orange-500 font-['Hind_Siliguri',sans-serif]"
                          required
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* 3. Featured Cover Image (Upload or URL Link Preview) */}
                <div className="bg-white rounded-3xl p-5 border border-zinc-200 shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold text-zinc-700 font-['Hind_Siliguri',sans-serif]">
                      ফিচার্ড কভার ছবি (Cover Image)
                    </label>

                    <div className="flex items-center bg-zinc-100 p-0.5 rounded-xl text-[11px] font-bold font-['Hind_Siliguri',sans-serif]">
                      <button
                        type="button"
                        onClick={() => setImageInputTab('link')}
                        className={`px-3 py-1 rounded-lg transition-colors ${
                          imageInputTab === 'link' ? 'bg-white text-orange-600 shadow-xs' : 'text-zinc-600'
                        }`}
                      >
                        ইমেজ লিংক দিন
                      </button>
                      <button
                        type="button"
                        onClick={() => setImageInputTab('upload')}
                        className={`px-3 py-1 rounded-lg transition-colors ${
                          imageInputTab === 'upload' ? 'bg-white text-orange-600 shadow-xs' : 'text-zinc-600'
                        }`}
                      >
                        ডিভাইস থেকে আপলোড
                      </button>
                    </div>
                  </div>

                  {imageInputTab === 'link' ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="url"
                        value={coverImage}
                        onChange={(e) => setCoverImage(e.target.value)}
                        placeholder="https://images.unsplash.com/..."
                        className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-2xl text-xs text-zinc-800 focus:outline-none focus:border-orange-500 font-mono"
                      />
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-orange-200 rounded-2xl p-4 text-center bg-orange-50/50">
                      <Upload size={24} className="mx-auto text-orange-500 mb-2" />
                      <p className="text-xs font-bold text-zinc-800 font-['Hind_Siliguri',sans-serif] mb-1">
                        কম্পিউটার বা মোবাইল থেকে ছবি সিলেক্ট করুন
                      </p>
                      <p className="text-[10px] text-zinc-500 font-['Hind_Siliguri',sans-serif] mb-3">
                        JPG, PNG বা WEBP (সর্বোচ্চ ৩ এমবি)
                      </p>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="text-xs font-['Hind_Siliguri',sans-serif] file:mr-3 file:py-1.5 file:px-3.5 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-orange-600 file:text-white hover:file:bg-orange-700 cursor-pointer"
                      />
                    </div>
                  )}

                  {/* Image Live Preview */}
                  {coverImage && (
                    <div className="mt-3 relative rounded-2xl overflow-hidden border border-zinc-200 max-h-48 bg-zinc-100 flex items-center justify-center">
                      <img
                        src={coverImage}
                        alt="Preview"
                        className="max-h-48 w-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => setCoverImage('')}
                        className="absolute top-2 right-2 px-2.5 py-1 rounded-lg bg-black/60 hover:bg-black text-white text-[10px] font-bold"
                      >
                        ছবি সরান
                      </button>
                    </div>
                  )}
                </div>

                {/* 4. Excerpt / Summary */}
                <div className="bg-white rounded-3xl p-5 border border-zinc-200 shadow-xs">
                  <label className="block text-xs font-bold text-zinc-700 font-['Hind_Siliguri',sans-serif] mb-1.5">
                    সংক্ষিপ্ত সারসংক্ষেপ (Excerpt / Summary)
                  </label>
                  <textarea
                    rows={2}
                    value={excerpt}
                    onChange={(e) => setExcerpt(e.target.value)}
                    placeholder="পোস্টের মূল কথা ২-৩ লাইনে লিখুন। এটি গুগল সার্চ রেজাল্ট এবং সোশ্যাল মিডিয়া কার্ডে প্রিভিউ হিসেবে যাবে..."
                    className="w-full px-4 py-2.5 bg-zinc-50 border border-zinc-200 rounded-2xl text-xs sm:text-sm text-zinc-800 focus:outline-none focus:border-orange-500 font-['Hind_Siliguri',sans-serif] leading-relaxed"
                  />
                </div>

                {/* 5. Main Post Content with WordPress-style Formatting Toolbar */}
                <div className="bg-white rounded-3xl p-5 border border-zinc-200 shadow-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold text-zinc-700 font-['Hind_Siliguri',sans-serif]">
                      মূল আর্টিকেলের কন্টেন্ট (Post Content) *
                    </label>
                    <span className="text-[11px] text-zinc-400 font-mono">
                      {content.split(/\s+/).filter(Boolean).length} শব্দ
                    </span>
                  </div>

                  {/* WordPress-style Toolbar */}
                  <div className="flex flex-wrap items-center gap-1.5 p-2 bg-zinc-100 rounded-2xl border border-zinc-200">
                    <button
                      type="button"
                      onClick={() => insertTextAtCursor('## ', '\n')}
                      className="px-2.5 py-1 rounded-lg bg-white hover:bg-orange-50 hover:text-orange-600 text-xs font-bold font-['Hind_Siliguri',sans-serif] shadow-xs"
                      title="প্রধান শিরোনাম (H2)"
                    >
                      H2 শিরোনাম
                    </button>
                    <button
                      type="button"
                      onClick={() => insertTextAtCursor('### ', '\n')}
                      className="px-2.5 py-1 rounded-lg bg-white hover:bg-orange-50 hover:text-orange-600 text-xs font-bold font-['Hind_Siliguri',sans-serif] shadow-xs"
                      title="উপ-শিরোনাম (H3)"
                    >
                      H3 সাবহেডিং
                    </button>
                    <button
                      type="button"
                      onClick={() => insertTextAtCursor('**', '**')}
                      className="px-2.5 py-1 rounded-lg bg-white hover:bg-orange-50 hover:text-orange-600 text-xs font-bold font-serif shadow-xs"
                      title="বোল্ড টেক্সট"
                    >
                      B (বোল্ড)
                    </button>
                    <button
                      type="button"
                      onClick={() => insertTextAtCursor('> **পরামর্শ:** ', '\n')}
                      className="px-2.5 py-1 rounded-lg bg-white hover:bg-orange-50 hover:text-orange-600 text-xs font-bold font-['Hind_Siliguri',sans-serif] shadow-xs"
                      title="উক্তি বা পরামর্শ বক্স"
                    >
                      কোট / টিপস
                    </button>
                    <button
                      type="button"
                      onClick={() => insertTextAtCursor('- ', '\n- \n- ')}
                      className="px-2.5 py-1 rounded-lg bg-white hover:bg-orange-50 hover:text-orange-600 text-xs font-bold font-['Hind_Siliguri',sans-serif] shadow-xs"
                      title="বুলেট পয়েন্ট তালিকা"
                    >
                      • তালিকা
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        insertTextAtCursor(
                          '\n| বিশ্ববিদ্যালয় | আবেদন শুরুর তারিখ | পরীক্ষার তারিখ |\n| :--- | :--- | :--- |\n| ঢাকা বিশ্ববিদ্যালয় | অক্টোবর ২০২৬ | ডিসেম্বর ২০২৬ |\n| বুয়েট | নভেম্বর ২০২৬ | জানুয়ারি ২০২৭ |\n'
                        )
                      }
                      className="px-2.5 py-1 rounded-lg bg-white hover:bg-orange-50 hover:text-orange-600 text-xs font-bold font-['Hind_Siliguri',sans-serif] shadow-xs"
                      title="এডমিশন ডেট টেবিল সন্নিবেশ"
                    >
                      📅 ডেট টেবিল
                    </button>
                  </div>

                  <textarea
                    id="blog-content-textarea"
                    rows={12}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="এখানে আপনার পোস্ট লিখুন..."
                    className="w-full px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-2xl text-xs sm:text-sm text-zinc-900 focus:outline-none focus:border-orange-500 font-['Hind_Siliguri',sans-serif] leading-relaxed"
                    required
                  />
                </div>

                {/* 6. Author, Tags & SEO Info */}
                <div className="bg-white rounded-3xl p-5 border border-zinc-200 shadow-xs grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-zinc-700 font-['Hind_Siliguri',sans-serif] mb-1">
                      লেখক (Author Name)
                    </label>
                    <input
                      type="text"
                      value={author}
                      onChange={(e) => setAuthor(e.target.value)}
                      className="w-full px-4 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-['Hind_Siliguri',sans-serif]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-700 font-['Hind_Siliguri',sans-serif] mb-1">
                      ট্যাগসমূহ (কমা দিয়ে আলাদা করুন)
                    </label>
                    <input
                      type="text"
                      value={tagsInput}
                      onChange={(e) => setTagsInput(e.target.value)}
                      placeholder="এডমিশন, ঢাকা বিশ্ববিদ্যালয়, স্বপ্নজয়"
                      className="w-full px-4 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-['Hind_Siliguri',sans-serif]"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-zinc-700 font-['Hind_Siliguri',sans-serif] mb-1">
                      গুগল সার্চ ও এসইও কি-ওয়ার্ড (SEO Keywords)
                    </label>
                    <input
                      type="text"
                      value={seoKeywords}
                      onChange={(e) => setSeoKeywords(e.target.value)}
                      placeholder="ঢাকা বিশ্ববিদ্যালয় ভর্তি প্রস্তুতি ২০২৬, ঢাবি খ ইউনিট, স্বপ্নজয়ের গল্প"
                      className="w-full px-4 py-2 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-['Hind_Siliguri',sans-serif]"
                    />
                  </div>

                  <div className="sm:col-span-2 flex flex-wrap items-center gap-6 pt-2">
                    <label className="flex items-center gap-2 text-xs font-bold text-zinc-700 font-['Hind_Siliguri',sans-serif] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={featured}
                        onChange={(e) => setFeatured(e.target.checked)}
                        className="rounded text-orange-600 focus:ring-orange-500 w-4 h-4"
                      />
                      <span>ব্লগ পেজের শীর্ষে ফিচার্ড স্পটলাইট হিসেবে রাখুন</span>
                    </label>

                    <div className="flex items-center gap-3">
                      <label className="text-xs font-bold text-zinc-700 font-['Hind_Siliguri',sans-serif]">
                        স্ট্যাটাস:
                      </label>
                      <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value as 'published' | 'draft')}
                        className="px-3 py-1 bg-zinc-50 border border-zinc-200 rounded-lg text-xs font-bold font-['Hind_Siliguri',sans-serif]"
                      >
                        <option value="published">পাবলিশড (সরাসরি লাইভ)</option>
                        <option value="draft">ড্রাফট (খসড়া)</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Bottom Submit Actions */}
                <div className="flex items-center justify-between gap-3 pt-2">
                  {editingId ? (
                    <button
                      type="button"
                      onClick={() => {
                        handleDeletePost(editingId, title);
                        setMode('list');
                      }}
                      className="px-4 py-2.5 rounded-xl bg-red-50 hover:bg-red-600 hover:text-white text-red-600 border border-red-200 text-xs font-bold font-['Hind_Siliguri',sans-serif] flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Trash2 size={15} />
                      <span>এই পোস্টটি ডিলিট করুন</span>
                    </button>
                  ) : (
                    <div />
                  )}

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setMode('list')}
                      className="px-4 py-2.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-xs font-bold font-['Hind_Siliguri',sans-serif]"
                    >
                      বাতিল
                    </button>

                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold shadow-md shadow-orange-500/25 font-['Hind_Siliguri',sans-serif] flex items-center gap-2"
                    >
                      <CheckCircle2 size={16} />
                      <span>{editingId ? 'পোস্ট আপডেট করুন' : 'নতুন পোস্ট প্রকাশ করুন'}</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </form>
        </div>
      )}

      {/* View: Blog Posts Table / Management List */}
      {mode === 'list' && (
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Action Toolbar */}
          <div className="p-4 border-b border-zinc-200 bg-white flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shrink-0">
            <div className="flex items-center gap-2 flex-1 max-w-md">
              <div className="relative w-full">
                <Search size={15} className="absolute left-3 top-2.5 text-zinc-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="আর্টিকেল খুঁজুন..."
                  className="w-full pl-9 pr-3 py-1.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-900 focus:outline-none focus:border-orange-500 font-['Hind_Siliguri',sans-serif]"
                />
              </div>

              <select
                value={filterTopic}
                onChange={(e) => setFilterTopic(e.target.value)}
                className="px-3 py-1.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs font-bold text-zinc-700 focus:outline-none focus:border-orange-500 font-['Hind_Siliguri',sans-serif] shrink-0"
              >
                <option value="all">সব টপিক</option>
                {topics.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {blogs.length > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm(`আপনি কি সব (${blogs.length}টি) পোস্ট স্থায়ীভাবে মুছে ফেলতে চান?`)) {
                      clearAllClassroomBlogs();
                      refreshList();
                    }
                  }}
                  className="px-3 py-1.5 rounded-xl bg-red-50 hover:bg-red-600 hover:text-white text-red-600 border border-red-200 text-xs font-bold font-['Hind_Siliguri',sans-serif] flex items-center gap-1.5 transition-colors cursor-pointer"
                  title="সকল পোস্ট এক ক্লিকে মুছে ফেলুন"
                >
                  <Trash2 size={13} />
                  <span>সব মুছুন</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => setMode('github_code')}
                className="px-3 py-1.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-bold font-['Hind_Siliguri',sans-serif] flex items-center gap-1.5 transition-colors cursor-pointer"
                title="গিটহাবে পুশ করার কোড এক্সপোর্ট করুন"
              >
                <Code2 size={14} className="text-orange-600" />
                <span>গিটহাব কোড</span>
              </button>

              <button
                type="button"
                onClick={handleStartNew}
                className="px-4 py-1.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold font-['Hind_Siliguri',sans-serif] flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
              >
                <Plus size={14} />
                <span>নতুন আর্টিকেল লিখুন</span>
              </button>
            </div>
          </div>

          {/* Table of Articles */}
          <div className="flex-1 overflow-y-auto p-4 bg-zinc-50">
            {filteredBlogs.length > 0 ? (
              <div className="bg-white rounded-2xl border border-zinc-200 shadow-xs overflow-hidden">
                <table className="w-full text-left border-collapse text-xs">
                  <thead className="bg-zinc-50 text-zinc-500 font-bold border-b border-zinc-200">
                    <tr>
                      <th className="p-3">আর্টিকেল ও শিরোনাম</th>
                      <th className="p-3 hidden sm:table-cell">টপিক</th>
                      <th className="p-3 hidden md:table-cell">তারিখ ও লেখক</th>
                      <th className="p-3 hidden lg:table-cell">এনগেজমেন্ট</th>
                      <th className="p-3">স্ট্যাটাস</th>
                      <th className="p-3 text-right">অ্যাকশন</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100">
                    {filteredBlogs.map((post) => {
                      const postUrl = `${window.location.origin}/classroom/blog/${post.slug}`;
                      return (
                        <tr key={post.id} className="hover:bg-orange-50/20 transition-colors">
                          <td className="p-3">
                            <div className="flex items-center gap-3">
                              {post.coverImage && (
                                <img
                                  src={post.coverImage}
                                  alt={post.title}
                                  className="w-12 h-10 rounded-lg object-cover bg-zinc-100 shrink-0 border border-zinc-200"
                                />
                              )}
                              <div className="min-w-0 max-w-sm">
                                <h4 className="font-bold text-zinc-900 font-['Hind_Siliguri',sans-serif] line-clamp-1 leading-snug">
                                  {post.title}
                                </h4>
                                <div className="flex items-center gap-2 mt-0.5">
                                  <span className="text-[10px] text-orange-600 font-mono font-medium truncate">
                                    /classroom/blog/{post.slug}
                                  </span>
                                  <button
                                    onClick={() => handleCopySlugLink(post.slug)}
                                    className="text-[10px] text-zinc-400 hover:text-orange-600 font-bold"
                                    title="লিংক কপি করুন"
                                  >
                                    {copiedSlug === post.slug ? '✓ কপিড' : 'কপি'}
                                  </button>
                                </div>
                              </div>
                            </div>
                          </td>

                          <td className="p-3 hidden sm:table-cell">
                            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-orange-100 text-orange-800 font-['Hind_Siliguri',sans-serif]">
                              {post.topic}
                            </span>
                          </td>

                          <td className="p-3 hidden md:table-cell">
                            <p className="text-zinc-800 font-medium font-['Hind_Siliguri',sans-serif]">{post.author}</p>
                            <p className="text-[10px] text-zinc-400 font-['Hind_Siliguri',sans-serif]">{post.date}</p>
                          </td>

                          <td className="p-3 hidden lg:table-cell">
                            <div className="flex items-center gap-3 text-zinc-500 text-[11px]">
                              <span className="flex items-center gap-1">
                                <Eye size={12} className="text-zinc-400" />
                                {post.views || 0}
                              </span>
                              <span className="flex items-center gap-1">
                                <Heart size={12} className="text-rose-400" />
                                {post.likes || 0}
                              </span>
                            </div>
                          </td>

                          <td className="p-3">
                            <span
                              className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                                post.status === 'published'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : 'bg-zinc-100 text-zinc-600'
                              }`}
                            >
                              {post.status === 'published' ? 'পাবলিশড' : 'ড্রাফট'}
                            </span>
                          </td>

                          <td className="p-3 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => navigateTo(`/classroom/blog/${post.slug}`)}
                                className="p-1.5 text-zinc-500 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors cursor-pointer"
                                title="ওয়েবসাইটে দেখুন"
                              >
                                <ExternalLink size={14} />
                              </button>
                              <button
                                onClick={() => handleStartEdit(post)}
                                className="px-2.5 py-1 text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg text-xs font-bold font-['Hind_Siliguri',sans-serif] flex items-center gap-1 transition-colors cursor-pointer"
                                title="এডিট করুন"
                              >
                                <Edit size={12} />
                                <span>এডিট</span>
                              </button>
                              <button
                                onClick={() => handleDeletePost(post.id, post.title)}
                                className="px-2.5 py-1 text-red-600 bg-red-50 hover:bg-red-600 hover:text-white border border-red-200 rounded-lg text-xs font-bold font-['Hind_Siliguri',sans-serif] flex items-center gap-1 transition-colors cursor-pointer"
                                title="পোস্টটি মুছে ফেলুন"
                              >
                                <Trash2 size={12} />
                                <span>ডিলিট</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-2xl border border-zinc-200 p-6">
                <BookOpen size={36} className="mx-auto text-zinc-300 mb-2" />
                <h4 className="text-sm font-bold text-zinc-800 font-['Hind_Siliguri',sans-serif] mb-1">
                  কোনো আর্টিকেল পাওয়া যায়নি
                </h4>
                <p className="text-xs text-zinc-500 font-['Hind_Siliguri',sans-serif] mb-4">
                  আপনার ক্লাসরুমে কোনো শিক্ষা বিষয়ক আর্টিকেল পোস্ট করতে "নতুন আর্টিকেল লিখুন" বাটনে চাপুন।
                </p>
                <button
                  onClick={handleStartNew}
                  className="px-4 py-2 rounded-xl bg-orange-600 text-white text-xs font-bold font-['Hind_Siliguri',sans-serif]"
                >
                  প্রথম আর্টিকেলটি লিখুন
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
