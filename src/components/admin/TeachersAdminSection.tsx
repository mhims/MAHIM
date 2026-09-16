import React, { useState } from 'react';
import { 
  Plus, Edit3, Trash2, Save, X, User, 
  Sparkles, RefreshCw 
} from 'lucide-react';
import { 
  TeacherProfile, 
  getLiveTeachersArray, 
  updateLiveTeacher, 
  addLiveTeacher, 
  deleteLiveTeacher, 
  resetLiveTeachersToDefault 
} from '../../utils/teacherManager';

interface Props {
  onNotify: (msg: string) => void;
  onDataChanged?: () => void;
}

export const TeachersAdminSection: React.FC<Props> = ({ onNotify, onDataChanged }) => {
  const [teachers, setTeachers] = useState<TeacherProfile[]>(() => getLiveTeachersArray());
  const [editingTeacher, setEditingTeacher] = useState<TeacherProfile | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const emptyTeacher: TeacherProfile = {
    id: '',
    slug: '',
    name: '',
    englishName: '',
    role: 'ইন্সট্রাক্টর',
    institution: '',
    photoUrl: '',
    bannerGradient: 'from-orange-500 to-amber-600',
    tagline: '',
    shortBio: '',
    metaTitle: '',
    metaDescription: '',
    highlights: [],
    education: [],
    teachingPhilosophy: '',
  };

  const [formData, setFormData] = useState<TeacherProfile>(emptyTeacher);

  const reloadTeachers = () => {
    const list = getLiveTeachersArray();
    setTeachers(list);
    if (onDataChanged) onDataChanged();
  };

  const handleStartCreate = () => {
    setEditingTeacher(null);
    const slug = `instructor-${Date.now().toString(36)}`;
    setFormData({
      ...emptyTeacher,
      id: slug,
      slug: slug,
    });
    setIsCreating(true);
  };

  const handleStartEdit = (t: TeacherProfile) => {
    setEditingTeacher(t);
    setFormData(t);
    setIsCreating(true);
  };

  const handleDelete = async (slug: string, name: string) => {
    if (!window.confirm(`আপনি কি "${name}" এর শিক্ষক প্রোফাইল মুছে ফেলতে চান?`)) return;
    setIsSaving(true);
    await deleteLiveTeacher(slug);
    setIsSaving(false);
    onNotify('শিক্ষক প্রোফাইল মুছে ফেলা হয়েছে!');
    reloadTeachers();
  };

  const handleResetDefaults = async () => {
    if (!window.confirm('আপনি কি সকল শিক্ষক প্রোফাইল ডিফল্ট অবস্থায় রিসেট করতে চান?')) return;
    setIsSaving(true);
    await resetLiveTeachersToDefault();
    setIsSaving(false);
    onNotify('শিক্ষক প্রোফাইল ডিফল্টে রিসেট করা হয়েছে!');
    reloadTeachers();
  };

  const handleSaveSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.slug.trim() || !formData.name.trim()) {
      alert('স্ল্যাগ ও নাম আবশ্যক!');
      return;
    }

    setIsSaving(true);
    const payload: TeacherProfile = {
      ...formData,
      id: formData.id || formData.slug,
      metaTitle: formData.metaTitle || `${formData.name} | Mahim's Classroom`,
      metaDescription: formData.metaDescription || formData.tagline || formData.shortBio,
    };

    if (editingTeacher) {
      await updateLiveTeacher(payload);
      onNotify('শিক্ষক প্রোফাইল সফলভাবে আপডেট করা হয়েছে!');
    } else {
      await addLiveTeacher(payload);
      onNotify('নতুন শিক্ষক প্রোফাইল যুক্ত হয়েছে!');
    }

    setIsSaving(false);
    setIsCreating(false);
    setEditingTeacher(null);
    reloadTeachers();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-zinc-900/80 p-4 rounded-2xl border border-zinc-800">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <User className="w-5 h-5 text-orange-500" />
            শিক্ষক ও ইন্সট্রাক্টর প্রোফাইল (Teachers & Mentors CRUD)
          </h3>
          <p className="text-xs text-zinc-400 mt-0.5">
            ক্লাসরুমের শিক্ষক ও মেন্টরদের পরিচিতি, ছবি ও পদবী পরিচালনা করুন (মোট: {teachers.length} জন)
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
            নতুন শিক্ষক যোগ করুন
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {teachers.map((t) => (
          <div
            key={t.slug}
            className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 flex flex-col justify-between hover:border-zinc-700 transition"
          >
            <div className="flex items-start gap-3 mb-3">
              <div className="w-14 h-14 rounded-full overflow-hidden bg-zinc-800 shrink-0 border border-orange-500/30">
                {t.photoUrl ? (
                  <img src={t.photoUrl} alt={t.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-zinc-500">
                    <User className="w-6 h-6" />
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-bold text-white truncate">{t.name}</h4>
                <p className="text-xs text-orange-400 truncate">{t.role}</p>
                <p className="text-[11px] text-zinc-400 truncate">{t.institution}</p>
                <span className="text-[10px] font-mono text-zinc-500 mt-1 block">/classroom/{t.slug}</span>
              </div>
            </div>

            <p className="text-xs text-zinc-400 line-clamp-2 mb-3">{t.tagline || t.shortBio}</p>

            <div className="flex items-center justify-end pt-3 border-t border-zinc-800 text-xs">
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleStartEdit(t)}
                  className="px-2.5 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 hover:text-white transition cursor-pointer flex items-center gap-1"
                >
                  <Edit3 className="w-3.5 h-3.5 text-orange-400" />
                  এডিট
                </button>
                <button
                  onClick={() => handleDelete(t.slug, t.name)}
                  className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition cursor-pointer"
                  title="মুছুন"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isCreating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-lg bg-zinc-900 border border-zinc-700 rounded-2xl shadow-2xl p-5 sm:p-6 text-zinc-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800 mb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-orange-500" />
                {editingTeacher ? 'শিক্ষক প্রোফাইল এডিট' : 'নতুন শিক্ষক প্রোফাইল'}
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
                  <label className="block text-zinc-300 font-medium mb-1">ইউনিক স্ল্যাগ*</label>
                  <input
                    type="text"
                    required
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                    placeholder="যেমন: mahim"
                    disabled={!!editingTeacher}
                    className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-xl text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-zinc-300 font-medium mb-1">শিক্ষকের নাম*</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="যেমন: মাহিম ইবনে খুদি"
                    className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-xl text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-300 font-medium mb-1">পদবী / রোল*</label>
                  <input
                    type="text"
                    required
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    placeholder="যেমন: লিড ইন্সট্রাক্টর"
                    className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-xl text-white"
                  />
                </div>

                <div>
                  <label className="block text-zinc-300 font-medium mb-1">প্রতিষ্ঠান (Institution)</label>
                  <input
                    type="text"
                    value={formData.institution || ''}
                    onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                    placeholder="যেমন: রাজশাহী বিশ্ববিদ্যালয়"
                    className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-xl text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-zinc-300 font-medium mb-1">প্রোফাইল ছবির লিংক (Photo URL)</label>
                <input
                  type="url"
                  value={formData.photoUrl || ''}
                  onChange={(e) => setFormData({ ...formData, photoUrl: e.target.value })}
                  placeholder="https://res.cloudinary.com/..."
                  className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-xl text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-zinc-300 font-medium mb-1">ট্যাগলাইন / এক লাইনে পরিচয়</label>
                <input
                  type="text"
                  value={formData.tagline || ''}
                  onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                  placeholder="আইসিটি ও গণিত বিষয়ক অভিজ্ঞ শিক্ষক"
                  className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-xl text-white"
                />
              </div>

              <div>
                <label className="block text-zinc-300 font-medium mb-1">সংক্ষিপ্ত বায়োগ্রাফি (Short Bio)</label>
                <textarea
                  rows={3}
                  value={formData.shortBio || ''}
                  onChange={(e) => setFormData({ ...formData, shortBio: e.target.value })}
                  placeholder="শিক্ষকের অভিজ্ঞতা ও পাঠদান পদ্ধতি..."
                  className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-xl text-white"
                />
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
