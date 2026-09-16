import React, { useState } from 'react';
import { 
  Plus, Edit3, Trash2, Save, X, Eye, CheckCircle2, 
  ExternalLink, Sparkles, BookOpen, AlertCircle, RefreshCw
} from 'lucide-react';
import { CourseItem } from '../../data/courses';
import { 
  getLiveCourses, 
  addLiveCourse, 
  updateLiveCourse, 
  deleteLiveCourse, 
  resetLiveCoursesToDefault 
} from '../../utils/courseManager';

interface Props {
  onNotify: (msg: string) => void;
  onDataChanged?: () => void;
}

export const CoursesAdminSection: React.FC<Props> = ({ onNotify, onDataChanged }) => {
  const [courses, setCourses] = useState<CourseItem[]>(() => getLiveCourses());
  const [search, setSearch] = useState('');
  const [editingCourse, setEditingCourse] = useState<CourseItem | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Form State
  const emptyForm: CourseItem = {
    id: '',
    title: '',
    category: 'hsc',
    categoryLabel: 'এইচএসসি (HSC)',
    targetBadge: 'বিজ্ঞান বিভাগ',
    description: '',
    fullDescription: '',
    highlights: [''],
    courseFeatures: [''],
    status: 'active',
    isFeatured: false,
    showOnMainPage: true,
    actionText: 'বিস্তারিত ও ভর্তি',
    actionUrl: '',
    externalBuyUrl: '',
    imageUrl: '',
    price: '৳ ৯৯৯',
    originalPrice: '৳ ১,৫০০',
  };

  const [formData, setFormData] = useState<CourseItem>(emptyForm);

  const reloadCourses = () => {
    const list = getLiveCourses();
    setCourses(list);
    if (onDataChanged) onDataChanged();
  };

  const handleStartCreate = () => {
    setEditingCourse(null);
    setFormData({
      ...emptyForm,
      id: `course-${Date.now().toString(36)}`,
    });
    setIsCreating(true);
  };

  const handleStartEdit = (course: CourseItem) => {
    setEditingCourse(course);
    setFormData({
      ...course,
      highlights: course.highlights?.length ? course.highlights : [''],
      courseFeatures: course.courseFeatures?.length ? course.courseFeatures : [''],
    });
    setIsCreating(true);
  };

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`আপনি কি নিশ্চিতভাবে "${title}" কোর্সটি মুছে ফেলতে চান?`)) return;
    setIsSaving(true);
    const ok = await deleteLiveCourse(id);
    setIsSaving(false);
    if (ok) {
      onNotify('কোর্সটি সফলভাবে মুছে ফেলা হয়েছে!');
      reloadCourses();
    } else {
      onNotify('কোর্সটি লোকাল থেকে মোছা হয়েছে কিন্তু ডিস্কে সিঙ্ক হয়নি।');
      reloadCourses();
    }
  };

  const handleResetDefaults = async () => {
    if (!window.confirm('আপনি কি সকল কোর্স ফ্যাক্টরি ডিফল্ট ডাটাতে রিসেট করতে চান?')) return;
    setIsSaving(true);
    await resetLiveCoursesToDefault();
    setIsSaving(false);
    onNotify('সকল কোর্স ডিফল্টে রিসেট করা হয়েছে!');
    reloadCourses();
  };

  const handleSaveSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.id.trim() || !formData.title.trim()) {
      alert('কোর্স আইডি এবং টাইটেল আবশ্যক!');
      return;
    }

    setIsSaving(true);
    const cleanHighlights = (formData.highlights || []).filter((h) => h.trim().length > 0);
    const cleanFeatures = (formData.courseFeatures || []).filter((f) => f.trim().length > 0);

    const payload: CourseItem = {
      ...formData,
      highlights: cleanHighlights.length > 0 ? cleanHighlights : ['স্পেশাল কনসেপ্ট ক্লাস', 'রেগুলার অনলাইন এক্সাম'],
      courseFeatures: cleanFeatures,
    };

    let ok = false;
    if (editingCourse) {
      ok = await updateLiveCourse(payload);
      onNotify(ok ? 'কোর্স সফলভাবে আপডেট ও ডিস্কে সংরক্ষিত হয়েছে!' : 'কোর্স আপডেট হয়েছে!');
    } else {
      ok = await addLiveCourse(payload);
      onNotify(ok ? 'নতুন কোর্স সফলভাবে যুক্ত ও ডিস্কে সংরক্ষিত হয়েছে!' : 'নতুন কোর্স যুক্ত হয়েছে!');
    }

    setIsSaving(false);
    setIsCreating(false);
    setEditingCourse(null);
    reloadCourses();
  };

  // Highlights handlers
  const handleHighlightChange = (idx: number, val: string) => {
    const list = [...(formData.highlights || [])];
    list[idx] = val;
    setFormData({ ...formData, highlights: list });
  };

  const addHighlightField = () => {
    setFormData({ ...formData, highlights: [...(formData.highlights || []), ''] });
  };

  const removeHighlightField = (idx: number) => {
    const list = (formData.highlights || []).filter((_, i) => i !== idx);
    setFormData({ ...formData, highlights: list });
  };

  const filtered = courses.filter(
    (c) =>
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.categoryLabel.toLowerCase().includes(search.toLowerCase()) ||
      c.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-zinc-900/80 p-4 rounded-2xl border border-zinc-800">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-orange-500" />
            ক্লাসরুম কোর্স ম্যানেজমেন্ট (Classroom Courses CRUD)
          </h3>
          <p className="text-xs text-zinc-400 mt-0.5">
            ওয়েবসাইটের সকল একাডেমিক ও এডমিশন কোর্স এডিট, নতুন তৈরি বা ডিলেট করুন (মোট: {courses.length} টি)
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleResetDefaults}
            disabled={isSaving}
            className="px-3 py-2 rounded-xl text-xs font-medium text-zinc-400 hover:text-white bg-zinc-800 hover:bg-zinc-700 transition cursor-pointer flex items-center gap-1.5"
            title="মূল ডিফল্ট কোর্সে ফিরে যান"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            ডিফল্ট রিসেট
          </button>

          <button
            onClick={handleStartCreate}
            className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-orange-500 hover:bg-orange-600 transition shadow-md shadow-orange-500/20 cursor-pointer flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            নতুন কোর্স যুক্ত করুন
          </button>
        </div>
      </div>

      {/* Search Filter */}
      <div className="relative">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="কোর্সের নাম, আইডি বা ক্যাটাগরি দিয়ে খুঁজুন..."
          className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-orange-500 transition"
        />
      </div>

      {/* Course List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((course) => (
          <div
            key={course.id}
            className="bg-zinc-900 border border-zinc-800/80 rounded-2xl p-4 flex flex-col justify-between hover:border-zinc-700 transition"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-md bg-orange-500/10 text-orange-400 border border-orange-500/20 mr-2">
                    {course.categoryLabel}
                  </span>
                  {course.showOnMainPage && (
                    <span className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      হোমপেজ ভিউ
                    </span>
                  )}
                  {course.isFeatured && (
                    <span className="text-[10px] ml-1.5 px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/20">
                      ফিচার্ড
                    </span>
                  )}
                </div>

                <span className="text-xs font-mono font-bold text-zinc-300">
                  {course.price || 'ফ্রি/নির্ধারিত'}
                </span>
              </div>

              <h4 className="text-base font-bold text-white mb-1.5 line-clamp-1">{course.title}</h4>
              <p className="text-xs text-zinc-400 line-clamp-2 mb-3">{course.description}</p>

              {course.highlights && course.highlights.length > 0 && (
                <div className="space-y-1 mb-3 bg-black/30 p-2.5 rounded-xl border border-zinc-800/50">
                  <p className="text-[11px] font-bold text-zinc-400">কোর্সের প্রধান ফোকাস:</p>
                  <ul className="text-xs text-zinc-300 list-disc list-inside space-y-0.5">
                    {course.highlights.slice(0, 2).map((h, i) => (
                      <li key={i} className="line-clamp-1 text-[11px]">{h}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-zinc-800 text-xs text-zinc-400">
              <span className="font-mono text-[11px] text-zinc-500">ID: {course.id}</span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleStartEdit(course)}
                  className="px-2.5 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 hover:text-white transition cursor-pointer flex items-center gap-1"
                >
                  <Edit3 className="w-3.5 h-3.5 text-orange-400" />
                  এডিট
                </button>
                <button
                  onClick={() => handleDelete(course.id, course.title)}
                  className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 transition cursor-pointer"
                  title="কোর্স মুছুন"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit / Create Course Modal */}
      {isCreating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-zinc-900 border border-zinc-700 rounded-2xl shadow-2xl p-5 sm:p-6 text-zinc-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-800 mb-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-orange-500" />
                {editingCourse ? 'কোর্স তথ্য এডিট করুন' : 'নতুন কোর্স তৈরি করুন'}
              </h3>
              <button
                onClick={() => setIsCreating(false)}
                className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-300 font-medium mb-1">কোর্স আইডি (ইউনিক স্ল্যাগ)*</label>
                  <input
                    type="text"
                    required
                    value={formData.id}
                    onChange={(e) => setFormData({ ...formData, id: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                    placeholder="যেমন: hsc-ict-full"
                    disabled={!!editingCourse}
                    className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-xl text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-zinc-300 font-medium mb-1">কোর্স ক্যাটাগরি*</label>
                  <select
                    value={formData.category}
                    onChange={(e) => {
                      const cat = e.target.value;
                      let label = 'এইচএসসি';
                      if (cat === 'admission') label = 'ভার্সিটি এডমিশন';
                      if (cat === 'ssc') label = 'এসএসসি (৯–১০)';
                      if (cat === 'junior') label = 'ক্লাস ৬–৮';
                      if (cat === 'mentorship') label = 'মেন্টরশীপ';
                      if (cat === 'skills') label = 'স্কিল ডেভেলপমেন্ট';
                      setFormData({ ...formData, category: cat, categoryLabel: label });
                    }}
                    className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-xl text-white"
                  >
                    <option value="hsc">এইচএসসি (HSC)</option>
                    <option value="admission">ভার্সিটি এডমিশন (Admission)</option>
                    <option value="ssc">এসএসসি (SSC)</option>
                    <option value="junior">জুনিয়র (Junior 6-8)</option>
                    <option value="mentorship">মেন্টরশীপ (Mentorship)</option>
                    <option value="skills">স্কিলস (Skills & AI)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-zinc-300 font-medium mb-1">কোর্স টাইটেল (শিরোনাম)*</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="যেমন: অক্টাল ১.০ - এইচএসসি আইসিটি সম্পূর্ণ কোর্স"
                  className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-xl text-white text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-zinc-300 font-medium mb-1">ক্যাটাগরি লেবেল</label>
                  <input
                    type="text"
                    value={formData.categoryLabel}
                    onChange={(e) => setFormData({ ...formData, categoryLabel: e.target.value })}
                    className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-xl text-white"
                  />
                </div>
                <div>
                  <label className="block text-zinc-300 font-medium mb-1">কোর্স ফি (বর্তমান দাম)</label>
                  <input
                    type="text"
                    value={formData.price || ''}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="যেমন: ৳ ৯৯৯"
                    className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-xl text-white"
                  />
                </div>
                <div>
                  <label className="block text-zinc-300 font-medium mb-1">আগের দাম (অরিজিনাল)</label>
                  <input
                    type="text"
                    value={formData.originalPrice || ''}
                    onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                    placeholder="যেমন: ৳ ১,৫০০"
                    className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-xl text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-zinc-300 font-medium mb-1">সংক্ষিপ্ত বিবরণ (Short Description)*</label>
                <textarea
                  rows={2}
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="কোর্সের মূল উদ্দেশ্য ও সারসংক্ষেপ..."
                  className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-xl text-white"
                />
              </div>

              {/* Highlights */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-zinc-300 font-medium">কোর্সের প্রধান বৈশিষ্ট্য ও হাইলাইটস</label>
                  <button
                    type="button"
                    onClick={addHighlightField}
                    className="text-xs text-orange-400 hover:text-orange-300 font-bold flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> পয়েন্ট যোগ করুন
                  </button>
                </div>
                <div className="space-y-2">
                  {(formData.highlights || []).map((h, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={h}
                        onChange={(e) => handleHighlightChange(i, e.target.value)}
                        placeholder={`পয়েন্ট ${i + 1}`}
                        className="flex-1 px-3 py-1.5 bg-zinc-800 border border-zinc-700 rounded-xl text-white"
                      />
                      {(formData.highlights || []).length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeHighlightField(i)}
                          className="p-1.5 text-zinc-500 hover:text-rose-400"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Status and Visibility Checkboxes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-zinc-800/60 rounded-xl border border-zinc-700/60">
                <label className="flex items-center gap-2 text-zinc-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.showOnMainPage ?? true}
                    onChange={(e) => setFormData({ ...formData, showOnMainPage: e.target.checked })}
                    className="rounded text-orange-500 focus:ring-0"
                  />
                  <span>মূল ক্লাসরুম পেজে দেখান (Show on /classroom)</span>
                </label>

                <label className="flex items-center gap-2 text-zinc-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isFeatured ?? false}
                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                    className="rounded text-orange-500 focus:ring-0"
                  />
                  <span>হাইলাইট / ফিচার্ড ব্যাজ সক্রিয় করুন</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition cursor-pointer"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold transition shadow-md shadow-orange-500/20 cursor-pointer flex items-center gap-2"
                >
                  {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  সংরক্ষণ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
