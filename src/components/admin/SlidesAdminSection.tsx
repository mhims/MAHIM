import React, { useState } from 'react';
import { 
  Plus, Edit3, Trash2, Save, X, Image as ImageIcon, 
  ExternalLink, Sparkles, RefreshCw 
} from 'lucide-react';
import { 
  HomeTopSlide, 
  INITIAL_TOP_SLIDES, 
  getStoredTopSlides, 
  saveStoredTopSlides 
} from '../../data/topSlides';

interface Props {
  onNotify: (msg: string) => void;
  onDataChanged?: () => void;
}

export const SlidesAdminSection: React.FC<Props> = ({ onNotify, onDataChanged }) => {
  const [slides, setSlides] = useState<HomeTopSlide[]>(() => getStoredTopSlides());
  const [editingSlide, setEditingSlide] = useState<HomeTopSlide | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const emptySlide: HomeTopSlide = {
    id: `slide-${Date.now().toString(36)}`,
    title: '',
    image: '',
    path: '/',
    link: 'https://mahims.com/',
  };

  const [formData, setFormData] = useState<HomeTopSlide>(emptySlide);

  const reloadSlides = () => {
    const list = getStoredTopSlides();
    setSlides(list);
    if (onDataChanged) onDataChanged();
  };

  const handleStartCreate = () => {
    setEditingSlide(null);
    setFormData({
      ...emptySlide,
      id: `slide-${Date.now().toString(36)}`,
    });
    setIsCreating(true);
  };

  const handleStartEdit = (slide: HomeTopSlide) => {
    setEditingSlide(slide);
    setFormData(slide);
    setIsCreating(true);
  };

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`আপনি কি "${title || id}" স্লাইডটি মুছে ফেলতে চান?`)) return;
    setIsSaving(true);
    const updated = slides.filter((s) => s.id !== id);
    await saveStoredTopSlides(updated);
    setIsSaving(false);
    onNotify('স্লাইডটি মুছে ফেলা হয়েছে!');
    reloadSlides();
  };

  const handleResetDefaults = async () => {
    if (!window.confirm('আপনি কি ডিফল্ট ৪টি হোম স্লাইডারে রিসেট করতে চান?')) return;
    setIsSaving(true);
    await saveStoredTopSlides(INITIAL_TOP_SLIDES);
    setIsSaving(false);
    onNotify('হোম ব্যানার স্লাইডার ডিফল্টে রিসেট করা হয়েছে!');
    reloadSlides();
  };

  const handleSaveSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.image.trim() || !formData.path.trim()) {
      alert('ছবির লিঙ্ক এবং পাথ আবশ্যক!');
      return;
    }

    setIsSaving(true);
    let updated: HomeTopSlide[];
    if (editingSlide) {
      updated = slides.map((s) => (s.id === formData.id ? formData : s));
    } else {
      updated = [...slides, formData];
    }

    await saveStoredTopSlides(updated);
    setIsSaving(false);
    setIsCreating(false);
    setEditingSlide(null);
    onNotify('হোম ব্যানার স্লাইডার সফলভাবে সংরক্ষিত হয়েছে!');
    reloadSlides();
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-zinc-900/80 p-4 rounded-2xl border border-zinc-800">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-orange-500" />
            হোমপেজ টপ ব্যানার স্লাইডার (Home Banner Slides)
          </h3>
          <p className="text-xs text-zinc-400 mt-0.5">
            হোমপেজের উপরে স্বয়ংক্রিয়ভাবে স্লাইড হওয়া ইমেজ ও লিংকগুলো পরিচালনা করুন (মোট: {slides.length} টি)
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleResetDefaults}
            disabled={isSaving}
            className="px-3 py-2 rounded-xl text-xs font-medium text-zinc-400 hover:text-white bg-zinc-800 hover:bg-zinc-700 transition cursor-pointer flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            ডিফল্ট রিসেট
          </button>

          <button
            onClick={handleStartCreate}
            className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-orange-500 hover:bg-orange-600 transition shadow-md shadow-orange-500/20 cursor-pointer flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            নতুন ব্যানার স্লাইড যোগ করুন
          </button>
        </div>
      </div>

      {/* Grid of Slides */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {slides.map((slide, idx) => (
          <div
            key={slide.id}
            className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden flex flex-col justify-between group hover:border-zinc-700 transition"
          >
            <div className="relative aspect-[16/9] w-full bg-black/50 overflow-hidden">
              <img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                referrerPolicy="no-referrer"
              />
              <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-sm text-[10px] font-mono text-zinc-300">
                #{idx + 1}
              </span>
            </div>

            <div className="p-4 flex-1 flex flex-col justify-between">
              <div>
                <h4 className="text-sm font-bold text-white line-clamp-1 mb-1">{slide.title}</h4>
                <p className="text-xs text-orange-400 font-mono line-clamp-1 mb-2">পাথ: {slide.path}</p>
                <p className="text-[11px] text-zinc-500 font-mono truncate">{slide.image}</p>
              </div>

              <div className="flex items-center justify-between pt-3 mt-3 border-t border-zinc-800">
                <a
                  href={slide.path}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-zinc-400 hover:text-white flex items-center gap-1"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  ভিজিট
                </a>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleStartEdit(slide)}
                    className="px-2.5 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 hover:text-white text-xs transition cursor-pointer flex items-center gap-1"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-orange-400" />
                    এডিট
                  </button>
                  <button
                    onClick={() => handleDelete(slide.id, slide.title)}
                    className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition cursor-pointer"
                    title="মুছুন"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit / Create Modal */}
      {isCreating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-lg bg-zinc-900 border border-zinc-700 rounded-2xl shadow-2xl p-5 sm:p-6 text-zinc-100">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800 mb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-orange-500" />
                {editingSlide ? 'ব্যানার স্লাইড এডিট' : 'নতুন ব্যানার স্লাইড'}
              </h3>
              <button
                onClick={() => setIsCreating(false)}
                className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-zinc-300 font-medium mb-1">স্লাইড টাইটেল / নাম*</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="যেমন: Mahim's Classroom (মাহিম'স ক্লাসরুম)"
                  className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-xl text-white text-sm"
                />
              </div>

              <div>
                <label className="block text-zinc-300 font-medium mb-1">ছবির লিঙ্ক (Image URL)*</label>
                <input
                  type="url"
                  required
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="https://res.cloudinary.com/... বা যেকোনো ইমেজ লিংক"
                  className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-xl text-white font-mono"
                />
                {formData.image && (
                  <div className="mt-2 aspect-[16/9] w-full rounded-xl overflow-hidden border border-zinc-700 bg-black/40">
                    <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-300 font-medium mb-1">ওয়েবসাইটের ইন্টারনাল পাথ*</label>
                  <input
                    type="text"
                    required
                    value={formData.path}
                    onChange={(e) => setFormData({ ...formData, path: e.target.value })}
                    placeholder="/classroom বা /portfolio"
                    className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-xl text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-zinc-300 font-medium mb-1">সম্পূর্ণ ওয়েব লিংক (ঐচ্ছিক)</label>
                  <input
                    type="text"
                    value={formData.link}
                    onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                    placeholder="https://mahims.com/classroom"
                    className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-xl text-white font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold transition shadow-md shadow-orange-500/20 flex items-center gap-2"
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
