import React, { useState } from 'react';
import { 
  Plus, Edit3, Trash2, Save, X, ExternalLink, 
  Sparkles, RefreshCw, FolderGit2 
} from 'lucide-react';
import { 
  PortfolioProject, 
  INITIAL_PORTFOLIO_PROJECTS, 
  getStoredPortfolioProjects, 
  saveStoredPortfolioProjects 
} from '../../data/portfolioProjects';

interface Props {
  onNotify: (msg: string) => void;
  onDataChanged?: () => void;
}

export const PortfolioAdminSection: React.FC<Props> = ({ onNotify, onDataChanged }) => {
  const [projects, setProjects] = useState<PortfolioProject[]>(() => getStoredPortfolioProjects());
  const [editingProj, setEditingProj] = useState<PortfolioProject | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const emptyProject: PortfolioProject = {
    id: `proj-${Date.now().toString(36)}`,
    title: '',
    category: 'web',
    categoryLabel: 'ফুল-স্ট্যাক ওয়েব',
    description: '',
    image: '',
    tags: ['React', 'TypeScript'],
    liveUrl: '',
    githubUrl: '',
    featured: true,
  };

  const [formData, setFormData] = useState<PortfolioProject>(emptyProject);
  const [tagsInput, setTagsInput] = useState('');

  const reloadProjects = () => {
    const list = getStoredPortfolioProjects();
    setProjects(list);
    if (onDataChanged) onDataChanged();
  };

  const handleStartCreate = () => {
    setEditingProj(null);
    setFormData({
      ...emptyProject,
      id: `proj-${Date.now().toString(36)}`,
    });
    setTagsInput('React, TypeScript, Tailwind');
    setIsCreating(true);
  };

  const handleStartEdit = (proj: PortfolioProject) => {
    setEditingProj(proj);
    setFormData(proj);
    setTagsInput((proj.tags || []).join(', '));
    setIsCreating(true);
  };

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`আপনি কি "${title}" প্রজেক্টটি মুছে ফেলতে চান?`)) return;
    setIsSaving(true);
    const updated = projects.filter((p) => p.id !== id);
    await saveStoredPortfolioProjects(updated);
    setIsSaving(false);
    onNotify('প্রজেক্টটি মুছে ফেলা হয়েছে!');
    reloadProjects();
  };

  const handleResetDefaults = async () => {
    if (!window.confirm('আপনি কি ডিফল্ট প্রজেক্টগুলোতে রিসেট করতে চান?')) return;
    setIsSaving(true);
    await saveStoredPortfolioProjects(INITIAL_PORTFOLIO_PROJECTS);
    setIsSaving(false);
    onNotify('পোর্টফোলিও প্রজেক্ট ডিফল্টে রিসেট করা হয়েছে!');
    reloadProjects();
  };

  const handleSaveSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.description.trim()) {
      alert('প্রজেক্ট শিরোনাম ও বিবরণ দিন!');
      return;
    }

    setIsSaving(true);
    const parsedTags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const payload: PortfolioProject = {
      ...formData,
      tags: parsedTags.length > 0 ? parsedTags : ['Web Development'],
    };

    let updated: PortfolioProject[];
    if (editingProj) {
      updated = projects.map((p) => (p.id === payload.id ? payload : p));
    } else {
      updated = [payload, ...projects];
    }

    await saveStoredPortfolioProjects(updated);
    setIsSaving(false);
    setIsCreating(false);
    setEditingProj(null);
    onNotify('পোর্টফোলিও প্রজেক্ট সফলভাবে সংরক্ষিত হয়েছে!');
    reloadProjects();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-zinc-900/80 p-4 rounded-2xl border border-zinc-800">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <FolderGit2 className="w-5 h-5 text-orange-500" />
            পোর্টফোলিও ও প্রজেক্ট ম্যানেজমেন্ট (Projects CRUD)
          </h3>
          <p className="text-xs text-zinc-400 mt-0.5">
            ওয়েবসাইটে প্রদর্শিত সকল সৃষ্টিশীল প্রজেক্ট, কেস স্টাডি ও ডিজাইন পোর্টফোলিও পরিচালনা করুন (মোট: {projects.length} টি)
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
            নতুন প্রজেক্ট যুক্ত করুন
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map((proj) => (
          <div
            key={proj.id}
            className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden flex flex-col justify-between hover:border-zinc-700 transition"
          >
            {proj.image && (
              <div className="aspect-[16/9] w-full bg-black/40 overflow-hidden border-b border-zinc-800">
                <img
                  src={proj.image}
                  alt={proj.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            )}

            <div className="p-4 flex-1 flex flex-col justify-between">
              <div>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-md bg-orange-500/10 text-orange-400 border border-orange-500/20">
                  {proj.categoryLabel}
                </span>

                <h4 className="text-sm font-bold text-white mt-2 mb-1 line-clamp-1">{proj.title}</h4>
                <p className="text-xs text-zinc-400 line-clamp-2 mb-3">{proj.description}</p>

                <div className="flex flex-wrap gap-1 mb-3">
                  {(proj.tags || []).map((tag, i) => (
                    <span key={i} className="text-[10px] px-2 py-0.5 bg-zinc-800 text-zinc-300 rounded-md">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-zinc-800 text-xs">
                {proj.liveUrl ? (
                  <a
                    href={proj.liveUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-zinc-400 hover:text-white flex items-center gap-1"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    লাইভ লিংক
                  </a>
                ) : (
                  <span className="text-zinc-600">কোন লিংক নেই</span>
                )}

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleStartEdit(proj)}
                    className="px-2.5 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 hover:text-white transition cursor-pointer flex items-center gap-1"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-orange-400" />
                    এডিট
                  </button>
                  <button
                    onClick={() => handleDelete(proj.id, proj.title)}
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

      {isCreating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-lg bg-zinc-900 border border-zinc-700 rounded-2xl shadow-2xl p-5 sm:p-6 text-zinc-100">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800 mb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-orange-500" />
                {editingProj ? 'প্রজেক্ট এডিট করুন' : 'নতুন প্রজেক্ট তৈরি করুন'}
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
                <label className="block text-zinc-300 font-medium mb-1">প্রজেক্ট নাম / শিরোনাম*</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="যেমন: Mahim's World Platform"
                  className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-xl text-white text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-300 font-medium mb-1">ক্যাটাগরি টাইপ</label>
                  <select
                    value={formData.category}
                    onChange={(e) => {
                      const cat = e.target.value as PortfolioProject['category'];
                      let label = 'ফুল-স্ট্যাক ওয়েব';
                      if (cat === 'automation') label = 'অটোমেশন ও এপিআই';
                      if (cat === 'graphics') label = 'গ্রাফিক ডিজাইন';
                      if (cat === 'branding') label = 'ব্র্যান্ডিং';
                      if (cat === 'other') label = 'অন্যান্য প্রজেক্ট';
                      setFormData({ ...formData, category: cat, categoryLabel: label });
                    }}
                    className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-xl text-white"
                  >
                    <option value="web">ওয়েব অ্যাপ্লিকেশন (Web)</option>
                    <option value="automation">অটোমেশন (Automation)</option>
                    <option value="graphics">গ্রাফিক্স (Graphics)</option>
                    <option value="branding">ব্র্যান্ডিং (Branding)</option>
                    <option value="other">অন্যান্য (Other)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-zinc-300 font-medium mb-1">ক্যাটাগরি প্রদর্শন নাম</label>
                  <input
                    type="text"
                    value={formData.categoryLabel}
                    onChange={(e) => setFormData({ ...formData, categoryLabel: e.target.value })}
                    className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-xl text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-zinc-300 font-medium mb-1">ছবির লিঙ্ক (Image URL)</label>
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="https://res.cloudinary.com/..."
                  className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-xl text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-zinc-300 font-medium mb-1">বিবরণ (Description)*</label>
                <textarea
                  rows={2}
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="প্রজেক্টে কী কী ফিচার রয়েছে..."
                  className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-xl text-white"
                />
              </div>

              <div>
                <label className="block text-zinc-300 font-medium mb-1">ব্যবহৃত টেকনোলজি ও ট্যাগস (কমা দিয়ে লিখুন)</label>
                <input
                  type="text"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  placeholder="React, TypeScript, Tailwind, Figma"
                  className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-xl text-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-300 font-medium mb-1">লাইভ ইউআরএল (Live URL)</label>
                  <input
                    type="url"
                    value={formData.liveUrl || ''}
                    onChange={(e) => setFormData({ ...formData, liveUrl: e.target.value })}
                    placeholder="https://..."
                    className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-xl text-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-zinc-300 font-medium mb-1">গিটহাব লিঙ্ক (ঐচ্ছিক)</label>
                  <input
                    type="url"
                    value={formData.githubUrl || ''}
                    onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                    placeholder="https://github.com/..."
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
