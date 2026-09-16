import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Plus,
  Search,
  Edit,
  Trash2,
  ExternalLink,
  Check,
  Image as ImageIcon,
  Upload,
  Calendar,
  Clock,
  User,
  Eye,
  Tag,
  ArrowLeft,
  CheckCircle2,
  BookOpen,
} from 'lucide-react';
import { ThoughtPost } from '../data/thoughtPosts';
import {
  getThoughtPosts,
  saveThoughtPost,
  deleteThoughtPost,
  generateThoughtSlug,
  getAllThoughtTopics,
} from '../utils/thoughtStorage';
import { navigateTo } from '../utils/navigation';

export const AdminThoughtsTab: React.FC = () => {
  const [posts, setPosts] = useState<ThoughtPost[]>(() => getThoughtPosts(true));
  const [topics, setTopics] = useState<string[]>(() => getAllThoughtTopics());
  const [mode, setMode] = useState<'list' | 'editor'>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilterTopic, setSelectedFilterTopic] = useState('all');

  // Form states
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [topic, setTopic] = useState('');
  const [isCustomTopic, setIsCustomTopic] = useState(true);
  const [customTopicInput, setCustomTopicInput] = useState('');
  const [author, setAuthor] = useState('মাহিম ইবনে খুদি');
  const [coverImage, setCoverImage] = useState('');
  const [imageInputTab, setImageInputTab] = useState<'link' | 'upload'>('link');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [readTime, setReadTime] = useState('৪ মিনিট পাঠ');
  const [status, setStatus] = useState<'published' | 'draft'>('published');
  const [tagsInput, setTagsInput] = useState('');
  const [featured, setFeatured] = useState(false);

  // Status feedback
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Reload posts whenever updated
  useEffect(() => {
    const handleUpdate = () => {
      setPosts(getThoughtPosts(true));
      setTopics(getAllThoughtTopics());
    };
    window.addEventListener('mahim:thoughts-updated', handleUpdate);
    window.addEventListener('mahim:thought-topics-updated', handleUpdate);
    return () => {
      window.removeEventListener('mahim:thoughts-updated', handleUpdate);
      window.removeEventListener('mahim:thought-topics-updated', handleUpdate);
    };
  }, []);

  const resetForm = () => {
    setEditingId(null);
    setTitle('');
    setSlug('');
    const curTopics = getAllThoughtTopics();
    if (curTopics.length > 0) {
      setTopic(curTopics[0]);
      setIsCustomTopic(false);
      setCustomTopicInput('');
    } else {
      setTopic('');
      setIsCustomTopic(true);
      setCustomTopicInput('');
    }
    setAuthor('মাহিম ইবনে খুদি');
    setCoverImage('');
    setExcerpt('');
    setContent('');
    setDate(new Date().toISOString().split('T')[0]);
    setReadTime('৪ মিনিট পাঠ');
    setStatus('published');
    setTagsInput('');
    setFeatured(false);
    setUploadError(null);
  };

  const startCreateNew = () => {
    resetForm();
    setMode('editor');
  };

  const startEdit = (post: ThoughtPost) => {
    setEditingId(post.id);
    setTitle(post.title);
    setSlug(post.slug);
    const curTopics = getAllThoughtTopics();
    if (curTopics.includes(post.topic)) {
      setTopic(post.topic);
      setIsCustomTopic(false);
      setCustomTopicInput('');
    } else {
      setIsCustomTopic(true);
      setCustomTopicInput(post.topic);
    }
    setAuthor(post.author || 'মাহিম ইবনে খুদি');
    setCoverImage(post.coverImage || '');
    setExcerpt(post.excerpt || '');
    setContent(post.content || '');
    setDate(post.date || new Date().toISOString().split('T')[0]);
    setReadTime(post.readTime || '৪ মিনিট পাঠ');
    setStatus(post.status || 'published');
    setTagsInput(post.tags ? post.tags.join(', ') : '');
    setFeatured(Boolean(post.featured));
    setMode('editor');
  };

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!editingId) {
      setSlug(generateThoughtSlug(val));
    }
  };

  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setUploadError('শুধুমাত্র ছবি ফাইল (JPG, PNG, WebP) নির্বাচন করুন।');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setUploadError('ছবির আকার সর্বোচ্চ ৫ মেগাবাইট হতে পারবে।');
      return;
    }

    setUploadError(null);
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setCoverImage(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      alert('অনুগ্রহ করে শিরোনাম এবং মূল লেখার অংশ পূরণ করুন।');
      return;
    }

    const finalTopic = isCustomTopic
      ? customTopicInput.trim()
      : topic.trim();

    if (!finalTopic) {
      alert('অনুগ্রহ করে টপিক বা ক্যাটাগরির নাম দিন।');
      return;
    }

    const finalSlug = slug.trim() || generateThoughtSlug(title);
    const parsedTags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const postData: ThoughtPost = {
      id: editingId || `thought-${Date.now()}`,
      slug: finalSlug,
      title: title.trim(),
      topic: finalTopic,
      coverImage: coverImage.trim() || undefined,
      excerpt: excerpt.trim() || title.trim().substring(0, 150) + '...',
      content: content.trim(),
      date,
      readTime: readTime.trim() || '৪ মিনিট পাঠ',
      author: author.trim() || 'মাহিম ইবনে খুদি',
      tags: parsedTags,
      status,
      featured,
      createdAt: editingId ? undefined! : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    saveThoughtPost(postData);
    setPosts(getThoughtPosts(true));
    setTopics(getAllThoughtTopics());

    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
    resetForm();
    setMode('list');
  };

  const handleDelete = (id: string, postTitle: string) => {
    if (confirm(`আপনি কি নিশ্চিত যে "${postTitle}" লেখাটি মুছে ফেলতে চান?`)) {
      deleteThoughtPost(id);
      setPosts(getThoughtPosts(true));
      setTopics(getAllThoughtTopics());
    }
  };

  // Filtered post list
  const filteredPosts = posts.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.topic.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesTopic =
      selectedFilterTopic === 'all' || p.topic === selectedFilterTopic;

    return matchesSearch && matchesTopic;
  });

  return (
    <div className="space-y-6 text-white font-['Hind_Siliguri',sans-serif]">
      {/* Top Banner Header */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-950/40 via-slate-900 to-zinc-900 border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-amber-400" />
            <h3 className="text-xl font-black text-white">Think With Mahim — পোস্ট ও চিন্তাভাবনা</h3>
          </div>
          <p className="text-xs text-slate-300 mt-1">
            দর্শন, ধর্মতত্ত্ব, বিশ্বাস ও জীবনের অনুসন্ধানের লেখালেখি পরিচালনা করুন। এখান থেকে সেভ করলে এআই স্টুডিওর গিটহাব পুশের সাথে স্বয়ংক্রিয়ভাবে লাইভ সাইটে চলে যাবে।
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => navigateTo('/thoughts')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all cursor-pointer border border-white/15"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>পেজ ভিজিট করুন</span>
          </button>

          {mode === 'list' ? (
            <button
              onClick={startCreateNew}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs sm:text-sm shadow-md shadow-amber-500/20 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>নতুন ভাবনা লিখুন</span>
            </button>
          ) : (
            <button
              onClick={() => {
                resetForm();
                setMode('list');
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs sm:text-sm transition-all cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>তালিকা দেখুন</span>
            </button>
          )}
        </div>
      </div>

      {saveSuccess && (
        <div className="p-4 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 text-sm font-bold flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-amber-400" />
          <span>লেখাটি সফলভাবে সেভ হয়েছে এবং ফাইল সিস্টেমে সিঙ্ক করা হয়েছে! গিটহাবে পুশ করলে সাইট আপডেট হয়ে যাবে।</span>
        </div>
      )}

      {/* VIEW 1: EDITOR FORM */}
      {mode === 'editor' && (
        <form onSubmit={handleSave} className="p-6 rounded-3xl bg-slate-950 border border-amber-500/30 space-y-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <h4 className="text-lg font-black text-amber-400 flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              <span>{editingId ? 'ভাবনা / লেখা সম্পাদনা করুন' : 'নতুন চিন্তাভাবনা ও প্রবন্ধ লিখুন'}</span>
            </h4>
            <span className="text-xs text-slate-400">
              {editingId ? 'আপডেট মোড' : 'নতুন পোস্ট মোড'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Title */}
            <div className="md:col-span-2 space-y-2">
              <label className="text-xs font-bold text-slate-300">
                লেখার শিরোনাম <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="যেমন: সত্যের অন্বেষণ: সমকালীন সংশয়বাদ ও বিশ্বাসের যুক্তি"
                className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-white/10 text-white placeholder:text-slate-500 text-sm focus:outline-none focus:border-amber-400"
              />
            </div>

            {/* Slug */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300">ইউআরএল স্লাগ (URL Slug)</label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="auto-generated-slug"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white placeholder:text-slate-500 text-xs font-mono focus:outline-none focus:border-amber-400"
              />
            </div>

            {/* Author */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300">লেখক</label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="মাহিম ইবনে খুদি"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:outline-none focus:border-amber-400"
              />
            </div>

            {/* Topic Selector / Custom Topic */}
            <div className="space-y-2 md:col-span-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-300">
                  টপিক ও বিষয়শ্রেণী <span className="text-red-400">*</span>
                </label>
                {topics.length > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      const next = !isCustomTopic;
                      setIsCustomTopic(next);
                      if (next) setCustomTopicInput('');
                    }}
                    className="text-xs text-amber-400 hover:underline cursor-pointer"
                  >
                    {isCustomTopic ? 'পূর্বের টপিক তালিকা থেকে বেছে নিন' : '+ নতুন টপিক লিখুন'}
                  </button>
                )}
              </div>

              {topics.length === 0 || isCustomTopic ? (
                <div className="space-y-1">
                  <input
                    type="text"
                    required
                    value={customTopicInput}
                    onChange={(e) => setCustomTopicInput(e.target.value)}
                    placeholder="টপিকের নাম লিখুন (যেমন: দর্শন ও যুক্তি, ধর্মতত্ত্ব, বিজ্ঞান... একবার লিখলে পরবর্তীতে সিলেক্ট করা যাবে)"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-amber-500/50 text-white placeholder:text-slate-500 text-xs focus:outline-none focus:border-amber-400"
                  />
                  <p className="text-[11px] text-slate-400">
                    💡 একবার কোনো টপিক দিয়ে পোস্ট করলে সেটি স্বয়ংক্রিয়ভাবে সেভ থাকবে এবং পরের বার ড্রপডাউনে পাওয়া যাবে।
                  </p>
                </div>
              ) : (
                <select
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:outline-none focus:border-amber-400"
                >
                  {topics.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              )}
            </div>

            {/* Published Date */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300">তারিখ</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:outline-none focus:border-amber-400"
              />
            </div>

            {/* Read Time */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300">পড়ার সময়</label>
              <input
                type="text"
                value={readTime}
                onChange={(e) => setReadTime(e.target.value)}
                placeholder="যেমন: ৪ মিনিট পাঠ"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:outline-none focus:border-amber-400"
              />
            </div>

            {/* Status & Featured */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300">প্রকাশের স্ট্যাটাস</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:outline-none focus:border-amber-400"
              >
                <option value="published">পাবলিশড (সবার জন্য দৃশ্যমান)</option>
                <option value="draft">ড্রাফট (খসড়া হিসেবে সংরক্ষিত)</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300">ট্যাগসমূহ (কমা দিয়ে আলাদা করুন)</label>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="দর্শন, যুক্তি, সংশয়বাদ, ধর্মতত্ত্ব"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          {/* Cover Image Upload & Link */}
          <div className="space-y-3 p-4 rounded-2xl bg-slate-900/80 border border-white/10">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-amber-400" />
                <span>পোস্টের ছবি (কভার ইমেজ) — অপশনাল</span>
              </label>
              <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-white/10">
                <button
                  type="button"
                  onClick={() => setImageInputTab('link')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    imageInputTab === 'link' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  লিংক দিয়ে
                </button>
                <button
                  type="button"
                  onClick={() => setImageInputTab('upload')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    imageInputTab === 'upload' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  আপলোড করে
                </button>
              </div>
            </div>

            {imageInputTab === 'link' ? (
              <input
                type="url"
                value={coverImage}
                onChange={(e) => setCoverImage(e.target.value)}
                placeholder="https://images.unsplash.com/... বা ক্লাউডিনারি লিংক দিন"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white placeholder:text-slate-500 text-xs focus:outline-none focus:border-amber-400"
              />
            ) : (
              <div className="flex items-center gap-4">
                <label className="flex-1 border-2 border-dashed border-white/20 hover:border-amber-500/50 rounded-xl p-4 text-center cursor-pointer transition-colors bg-slate-950">
                  <Upload className="w-6 h-6 text-slate-400 mx-auto mb-1" />
                  <span className="text-xs text-slate-300">ডিভাইস থেকে ছবি বেছে নিন</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageFileUpload}
                    className="hidden"
                  />
                </label>
              </div>
            )}

            {uploadError && <p className="text-xs text-red-400">{uploadError}</p>}

            {/* Image Preview */}
            {coverImage && (
              <div className="relative rounded-xl overflow-hidden border border-amber-500/30 max-h-52 bg-slate-950 flex items-center justify-center">
                <img
                  src={coverImage}
                  alt="Cover Preview"
                  className="max-h-52 w-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => setCoverImage('')}
                  className="absolute top-2 right-2 px-2.5 py-1 rounded-lg bg-red-600/80 hover:bg-red-600 text-white text-xs font-bold backdrop-blur-sm"
                >
                  মুছে ফেলুন
                </button>
              </div>
            )}
          </div>

          {/* Excerpt */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300">
              সংক্ষিপ্ত সারাংশ / মূল উপপাদ্য (কার্ডে প্রদর্শিত হবে)
            </label>
            <textarea
              rows={2}
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="লেখার মূল বার্তাটি এক বা দুই বাক্যে লিখুন..."
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white placeholder:text-slate-500 text-xs leading-relaxed focus:outline-none focus:border-amber-400"
            />
          </div>

          {/* Full Content */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-300">
                মূল চিন্তাভাবনা ও লেখার বিবরণ <span className="text-red-400">*</span>
              </label>
              <span className="text-xs text-slate-400">
                অনুচ্ছেদ আলাদা করতে এন্টার চাপুন
              </span>
            </div>
            <textarea
              rows={12}
              required
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={`আপনার ভাবনা ও দর্শন বিস্তারিতভাবে লিখুন...

উপশিরোনাম দিতে:
### ১. আধুনিক জীবনের দর্শন
প্যারাগ্রাফ লেখার পর কোটেশন দিতে পারেন:
> "জীবনের প্রকৃত সন্ধান শুরু হয় সংশয় ও আত্মজিজ্ঞাসা থেকে।"

বিশ্লেষণ ও মুক্ত চিন্তাভাবনা উপস্থাপন করুন...`}
              className="w-full px-4 py-3 rounded-2xl bg-slate-900 border border-white/10 text-white placeholder:text-slate-500 text-sm leading-relaxed focus:outline-none focus:border-amber-400 font-mono"
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => {
                resetForm();
                setMode('list');
              }}
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition-colors cursor-pointer"
            >
              বাতিল করুন
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs sm:text-sm shadow-lg shadow-amber-500/20 transition-all cursor-pointer flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              <span>{editingId ? 'আপডেট সংরক্ষণ করুন' : 'ভাবনা প্রকাশ করুন'}</span>
            </button>
          </div>
        </form>
      )}

      {/* VIEW 2: POSTS LIST */}
      {mode === 'list' && (
        <div className="space-y-4">
          {/* Filter & Search Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-2xl bg-slate-950 border border-white/10">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="শিরোনাম বা টপিক খুঁজুন..."
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-900 border border-white/10 text-white placeholder:text-slate-500 text-xs focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
              <button
                onClick={() => setSelectedFilterTopic('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  selectedFilterTopic === 'all'
                    ? 'bg-amber-500 text-slate-950'
                    : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
                }`}
              >
                সব ({posts.length})
              </button>
              {topics.map((t) => (
                <button
                  key={t}
                  onClick={() => setSelectedFilterTopic(t)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                    selectedFilterTopic === t
                      ? 'bg-amber-500 text-slate-950'
                      : 'bg-slate-900 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Posts Cards / Table */}
          {filteredPosts.length === 0 ? (
            <div className="p-12 rounded-3xl bg-slate-950 border border-white/10 text-center space-y-3">
              <Sparkles className="w-10 h-10 text-slate-500 mx-auto" />
              <h5 className="text-base font-bold text-white">বর্তমানে কোনো চিন্তাভাবনার লেখা নেই</h5>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                আপনি এখনো কোনো লেখা পোস্ট করেননি। উপরের "নতুন ভাবনা লিখুন" বাটনে ক্লিক করে প্রথম লেখাটি যুক্ত করতে পারেন।
              </p>
              <button
                onClick={startCreateNew}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>প্রথম লেখা পোস্ট করুন</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3">
              {filteredPosts.map((post) => (
                <div
                  key={post.id}
                  className="p-4 sm:p-5 rounded-2xl bg-slate-950 border border-white/10 hover:border-amber-500/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex items-start gap-4">
                    {post.coverImage ? (
                      <img
                        src={post.coverImage}
                        alt={post.title}
                        className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover shrink-0 border border-white/10"
                      />
                    ) : (
                      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-amber-950/40 border border-amber-500/20 flex items-center justify-center shrink-0">
                        <Sparkles className="w-8 h-8 text-amber-400" />
                      </div>
                    )}

                    <div className="space-y-1 text-left">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-950 border border-amber-500/40 text-amber-300">
                          {post.topic}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            post.status === 'published'
                              ? 'bg-green-950 text-green-400 border border-green-800'
                              : 'bg-amber-950 text-amber-400 border border-amber-800'
                          }`}
                        >
                          {post.status === 'published' ? 'পাবলিশড' : 'ড্রাফট'}
                        </span>
                        <span className="text-[11px] text-slate-400 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {post.date}
                        </span>
                        <span className="text-[11px] text-slate-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {post.readTime}
                        </span>
                      </div>

                      <h5 className="text-base font-bold text-white line-clamp-1">{post.title}</h5>
                      <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                        {post.excerpt}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                    <button
                      onClick={() => navigateTo(`/thoughts`)}
                      title="পেজে প্রিভিউ দেখুন"
                      className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => startEdit(post)}
                      title="এডিট করুন"
                      className="p-2 rounded-xl bg-slate-900 hover:bg-amber-950/60 text-slate-300 hover:text-amber-400 border border-white/5 hover:border-amber-500/40 transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(post.id, post.title)}
                      title="মুছে ফেলুন"
                      className="p-2 rounded-xl bg-slate-900 hover:bg-red-950/60 text-slate-300 hover:text-red-400 border border-white/5 hover:border-red-500/40 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
