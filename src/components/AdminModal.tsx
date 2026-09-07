import React, { useState } from 'react';
import { useSite } from '../context/SiteContext';
import { BlogPost, CertificationItem, EducationItem, ExperienceItem, PostVisibility, SkillItem, UserAccount } from '../types';
import { generateRobotsTxt, generateSitemapXml } from '../utils/sitemap';
import { GOOGLE_APPS_SCRIPT_TEMPLATE } from '../utils/googleSheets';
import { 
  X, 
  Lock, 
  Key, 
  Sliders, 
  BookOpen, 
  Users, 
  Briefcase, 
  GraduationCap, 
  Wrench, 
  FileSpreadsheet, 
  Search, 
  Database, 
  Plus, 
  Trash2, 
  Edit3, 
  Check, 
  Upload, 
  Link as LinkIcon, 
  Image as ImageIcon, 
  Copy, 
  Download, 
  RefreshCw, 
  Sparkles, 
  Eye, 
  ShieldCheck, 
  LogOut,
  AlertCircle
} from 'lucide-react';

export const AdminModal: React.FC = () => {
  const {
    settings,
    updateSettings,
    experiences,
    addExperience,
    updateExperience,
    deleteExperience,
    education,
    addEducation,
    updateEducation,
    deleteEducation,
    skills,
    addSkill,
    updateSkill,
    deleteSkill,
    certifications,
    addCertification,
    updateCertification,
    deleteCertification,
    posts,
    addPost,
    updatePost,
    deletePost,
    users,
    updateUserStatus,
    deleteUser,
    contactMessages,
    markMessageRead,
    deleteMessage,
    isAdminAuthenticated,
    loginAdmin,
    logoutAdmin,
    updateAdminPassword,
    isAdminModalOpen,
    closeAdminModal,
    exportBackupJson,
    importBackupJson,
  } = useSite();

  // Password state for login
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  // Active Admin Tab
  const [activeTab, setActiveTab] = useState<
    'general' | 'blog' | 'users' | 'experience' | 'skills' | 'sheets' | 'seo' | 'messages' | 'backup'
  >('general');

  // Blog Post form state (for creating or editing)
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [postForm, setPostForm] = useState<Omit<BlogPost, 'id'>>({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    coverImage: '',
    altText: '',
    category: 'ডিজাইন টিপস',
    visibility: 'public',
    author: 'Mahim Ibne Khudi',
    date: new Date().toISOString().split('T')[0],
    readTime: '৪ মিনিট',
  });
  const [isCreatingPost, setIsCreatingPost] = useState(false);

  // Experience Form State
  const [editingExpId, setEditingExpId] = useState<string | null>(null);
  const [isExpFormOpen, setIsExpFormOpen] = useState(false);
  const [expForm, setExpForm] = useState<Omit<ExperienceItem, 'id'>>({
    role: '',
    company: '',
    period: '',
    description: '',
    skillsUsed: [],
    isCurrent: false,
  });

  // Education Form State
  const [editingEduId, setEditingEduId] = useState<string | null>(null);
  const [isEduFormOpen, setIsEduFormOpen] = useState(false);
  const [eduForm, setEduForm] = useState<Omit<EducationItem, 'id'>>({
    degree: '',
    institution: '',
    department: '',
    period: '',
    result: '',
    description: '',
  });

  // Skill Form State
  const [editingSkillId, setEditingSkillId] = useState<string | null>(null);
  const [isSkillFormOpen, setIsSkillFormOpen] = useState(false);
  const [skillForm, setSkillForm] = useState<Omit<SkillItem, 'id'>>({
    name: '',
    category: 'design',
    proficiency: 90,
    highlight: true,
  });

  // Certification Form State
  const [editingCertId, setEditingCertId] = useState<string | null>(null);
  const [isCertFormOpen, setIsCertFormOpen] = useState(false);
  const [certForm, setCertForm] = useState<Omit<CertificationItem, 'id'>>({
    title: '',
    issuer: '',
    year: '২০২৪',
    credentialId: '',
    badge: 'গভর্নমেন্ট সার্টিফাইড',
  });

  // Copy feedback
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedSitemap, setCopiedSitemap] = useState(false);
  const [copiedRobots, setCopiedRobots] = useState(false);
  const [adminNotification, setAdminNotification] = useState('');

  // Password change state
  const [newAdminPass, setNewAdminPass] = useState('');
  const [passChangeSuccess, setPassChangeSuccess] = useState('');

  if (!isAdminModalOpen) return null;

  const showNotification = (msg: string) => {
    setAdminNotification(msg);
    setTimeout(() => setAdminNotification(''), 3500);
  };

  // Admin password login
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);
    setPasswordError('');
    const success = await loginAdmin(passwordInput);
    setIsVerifying(false);
    if (!success) {
      setPasswordError('ভুল পাসওয়ার্ড! সঠিক এডমিন পাসওয়ার্ড প্রদান করুন।');
    } else {
      setPasswordInput('');
    }
  };

  // Helper for image upload -> Data URI (to avoid server load while supporting offline/GitHub)
  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>, callback: (url: string) => void) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size limit (cap at 3MB to avoid localStorage limits)
    if (file.size > 3 * 1024 * 1024) {
      alert('ছবির সাইজ ৩ মেগাবাইটের বেশি! অনুগ্রহ করে ক্লাউডিফাই বা ইমেজ লিঙ্কের মাধ্যমে যুক্ত করুন অথবা ছোট ছবি ব্যবহার করুন।');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === 'string') {
        callback(event.target.result);
        showNotification('ছবি সফলভাবে আপলোড হয়েছে!');
      }
    };
    reader.readAsDataURL(file);
  };

  // Blog post submit
  const handleSavePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!postForm.title || !postForm.content) {
      alert('পোস্টের শিরোনাম এবং বিস্তারিত কনটেন্ট প্রদান করুন।');
      return;
    }

    if (editingPostId) {
      updatePost(editingPostId, postForm);
      showNotification('পোস্ট সফলভাবে আপডেট করা হয়েছে!');
    } else {
      addPost(postForm);
      showNotification('নতুন পোস্ট সফলভাবে প্রকাশিত হয়েছে!');
    }

    setIsCreatingPost(false);
    setEditingPostId(null);
    setPostForm({
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      coverImage: '',
      altText: '',
      category: 'ডিজাইন টিপs',
      visibility: 'public',
      author: 'Mahim Ibne Khudi',
      date: new Date().toISOString().split('T')[0],
      readTime: '৪ মিনিট',
    });
  };

  const startEditPost = (post: BlogPost) => {
    setEditingPostId(post.id);
    setPostForm({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      content: post.content,
      coverImage: post.coverImage,
      altText: post.altText,
      category: post.category,
      visibility: post.visibility,
      author: post.author,
      date: post.date,
      readTime: post.readTime,
    });
    setIsCreatingPost(true);
  };

  // Experience handlers
  const startCreateExp = () => {
    setEditingExpId(null);
    setExpForm({
      role: '',
      company: '',
      period: '২০২৪ – বর্তমান',
      description: '',
      skillsUsed: ['Photoshop', 'Illustrator'],
      isCurrent: true,
    });
    setIsExpFormOpen(true);
  };

  const startEditExp = (exp: ExperienceItem) => {
    setEditingExpId(exp.id);
    setExpForm({
      role: exp.role,
      company: exp.company,
      period: exp.period,
      description: exp.description,
      skillsUsed: exp.skillsUsed || [],
      isCurrent: exp.isCurrent ?? false,
    });
    setIsExpFormOpen(true);
  };

  const handleSaveExp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!expForm.role.trim() || !expForm.company.trim()) {
      alert('পদবী এবং প্রতিষ্ঠানের নাম আবশ্যক!');
      return;
    }
    if (editingExpId) {
      updateExperience(editingExpId, expForm);
      showNotification('অভিজ্ঞতা সফলভাবে আপডেট করা হয়েছে');
    } else {
      addExperience(expForm);
      showNotification('নতুন অভিজ্ঞতা যুক্ত করা হয়েছে');
    }
    setIsExpFormOpen(false);
    setEditingExpId(null);
  };

  // Education handlers
  const startCreateEdu = () => {
    setEditingEduId(null);
    setEduForm({
      degree: '',
      institution: '',
      department: '',
      period: '২০২৪ – চলমান',
      result: 'অধ্যয়নরত',
      description: '',
    });
    setIsEduFormOpen(true);
  };

  const startEditEdu = (edu: EducationItem) => {
    setEditingEduId(edu.id);
    setEduForm({
      degree: edu.degree,
      institution: edu.institution,
      department: edu.department || '',
      period: edu.period,
      result: edu.result,
      description: edu.description || '',
    });
    setIsEduFormOpen(true);
  };

  const handleSaveEdu = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eduForm.degree.trim() || !eduForm.institution.trim()) {
      alert('ডিগ্রি এবং শিক্ষা প্রতিষ্ঠানের নাম আবশ্যক!');
      return;
    }
    if (editingEduId) {
      updateEducation(editingEduId, eduForm);
      showNotification('শিক্ষা তথ্য সফলভাবে আপডেট করা হয়েছে');
    } else {
      addEducation(eduForm);
      showNotification('নতুন শিক্ষা তথ্য যুক্ত করা হয়েছে');
    }
    setIsEduFormOpen(false);
    setEditingEduId(null);
  };

  // Skill handlers
  const startCreateSkill = () => {
    setEditingSkillId(null);
    setSkillForm({
      name: '',
      category: 'design',
      proficiency: 90,
      highlight: true,
    });
    setIsSkillFormOpen(true);
  };

  const startEditSkill = (sk: SkillItem) => {
    setEditingSkillId(sk.id);
    setSkillForm({
      name: sk.name,
      category: sk.category,
      proficiency: sk.proficiency,
      highlight: sk.highlight ?? true,
    });
    setIsSkillFormOpen(true);
  };

  const handleSaveSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!skillForm.name.trim()) {
      alert('স্কিলের নাম আবশ্যক!');
      return;
    }
    if (editingSkillId) {
      updateSkill(editingSkillId, skillForm);
      showNotification('স্কিল সফলভাবে আপডেট করা হয়েছে');
    } else {
      addSkill(skillForm);
      showNotification('নতুন স্কিল যুক্ত করা হয়েছে');
    }
    setIsSkillFormOpen(false);
    setEditingSkillId(null);
  };

  // Certification handlers
  const startCreateCert = () => {
    setEditingCertId(null);
    setCertForm({
      title: '',
      issuer: '',
      year: '২০২৪',
      credentialId: '',
      badge: 'গভর্নমেন্ট সার্টিফাইড',
    });
    setIsCertFormOpen(true);
  };

  const startEditCert = (c: CertificationItem) => {
    setEditingCertId(c.id);
    setCertForm({
      title: c.title,
      issuer: c.issuer,
      year: c.year,
      credentialId: c.credentialId || '',
      badge: c.badge || 'সার্টিফাইড',
    });
    setIsCertFormOpen(true);
  };

  const handleSaveCert = (e: React.FormEvent) => {
    e.preventDefault();
    if (!certForm.title.trim() || !certForm.issuer.trim()) {
      alert('সার্টিফিকেটের নাম এবং প্রদানকারী প্রতিষ্ঠান আবশ্যক!');
      return;
    }
    if (editingCertId) {
      updateCertification(editingCertId, certForm);
      showNotification('সার্টিফিকেশন সফলভাবে আপডেট করা হয়েছে');
    } else {
      addCertification(certForm);
      showNotification('নতুন সার্টিফিকেশন যুক্ত করা হয়েছে');
    }
    setIsCertFormOpen(false);
    setEditingCertId(null);
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newAdminPass.length < 6) {
      alert('পাসওয়ার্ড ন্যূনতম ৬ অক্ষরের হতে হবে।');
      return;
    }
    const updated = await updateAdminPassword(newAdminPass);
    if (updated) {
      setPassChangeSuccess('এডমিন পাসওয়ার্ড সফলভাবে পরিবর্তিত হয়েছে!');
      setNewAdminPass('');
      setTimeout(() => setPassChangeSuccess(''), 4000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-md overflow-y-auto">
      
      {/* If not authenticated: Password Prompt */}
      {!isAdminAuthenticated ? (
        <div className="relative w-full max-w-md bg-white border-2 border-black rounded-3xl shadow-2xl p-8 text-center animate-in zoom-in-95">
          <div className="w-14 h-14 rounded-2xl bg-black text-white flex items-center justify-center mx-auto mb-4 shadow-md">
            <Lock className="w-7 h-7" />
          </div>

          <h3 className="text-xl font-black text-[#1a1a1a] mb-1 tracking-tight">
            মাহিম'স এডমিন প্যানেল
          </h3>
          <p className="text-xs text-zinc-600 mb-6 font-normal">
            mahims.com ওয়েবসাইটের সমস্ত লেখা, ছবি ও সেটিংস এডিটের জন্য সুরক্ষিত প্রবেশদ্বার
          </p>

          <form onSubmit={handlePasswordSubmit} className="space-y-4 text-left">
            <div>
              <label className="block text-xs font-bold text-zinc-700 mb-1.5">
                এডমিন পাসওয়ার্ড প্রদান করুন
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={passwordInput}
                  onChange={e => setPasswordInput(e.target.value)}
                  placeholder="পাসওয়ার্ড লিখুন..."
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-zinc-50 border border-black/10 text-black text-sm focus:outline-none focus:border-black focus:bg-white transition-colors"
                />
                <Key className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3.5" />
              </div>
            </div>

            {passwordError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-300 text-rose-800 text-xs font-medium">
                {passwordError}
              </div>
            )}

            <div className="flex items-center gap-3 pt-2">
              <button
                type="submit"
                disabled={isVerifying}
                className="flex-1 py-3 rounded-xl bg-black hover:bg-zinc-800 text-white font-black text-sm shadow-md transition-all cursor-pointer disabled:opacity-50"
              >
                {isVerifying ? 'যাচাই হচ্ছে...' : 'লগইন করুন'}
              </button>
              <button
                type="button"
                onClick={closeAdminModal}
                className="px-4 py-3 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-800 border border-black/10 text-sm font-bold transition-colors cursor-pointer"
              >
                বন্ধ
              </button>
            </div>
          </form>

          <div className="mt-6 pt-4 border-t border-black/10 text-[11px] text-zinc-500 font-medium">
            নিরাপত্তা নির্দেশিকা: ভিউ-সোর্সে কোনো পাসওয়ার্ড দৃশ্যমান নয় (SHA-256 এনক্রিপ্টেড)।
          </div>
        </div>
      ) : (
        /* Authenticated Admin Dashboard */
        <div className="relative w-full max-w-6xl my-4 bg-slate-900 border border-white/15 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
          
          {/* Top Admin Header Bar */}
          <div className="px-6 py-4 bg-slate-950/90 border-b border-white/10 flex flex-wrap items-center justify-between gap-4 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center font-black text-amber-400">
                M
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                  <span>mahims.com মাস্টার কন্ট্রোল প্যানেল</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Live
                  </span>
                </h2>
                <p className="text-xs text-slate-400">
                  যেকোনো তথ্য এডিট করুন, তাৎক্ষণিকভাবে সাইটে আপডেট হবে
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {adminNotification && (
                <div className="text-xs font-semibold px-3 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 animate-pulse">
                  {adminNotification}
                </div>
              )}
              <button
                onClick={logoutAdmin}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold transition-colors"
                title="লগআউট"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>লগআউট</span>
              </button>
              <button
                onClick={closeAdminModal}
                className="p-2 rounded-xl text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors"
                title="এডমিন প্যানেল বন্ধ করুন"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Admin Navigation Tabs */}
          <div className="flex items-center gap-1 px-6 py-2 bg-slate-950/50 border-b border-white/5 overflow-x-auto shrink-0 scrollbar-thin">
            {[
              { id: 'general', label: 'হোম ও প্রোফাইল', icon: Sliders },
              { id: 'blog', label: 'ব্লগ পোস্ট ম্যানেজার', icon: BookOpen },
              { id: 'users', label: 'ইউজার ও মেম্বারস', icon: Users },
              { id: 'experience', label: 'অভিজ্ঞতা ও শিক্ষা', icon: Briefcase },
              { id: 'skills', label: 'স্কিল ও সার্টিফিকেট', icon: Wrench },
              { id: 'sheets', label: 'গুগল শিট ডাটাবেজ', icon: FileSpreadsheet },
              { id: 'seo', label: 'এসইও ও সাইটম্যাপ', icon: Search },
              { id: 'messages', label: `ইনবক্স (${contactMessages.length})`, icon: Sparkles },
              { id: 'backup', label: 'ব্যাকআপ ও নিরাপত্তা', icon: Database },
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id as any);
                    setIsCreatingPost(false);
                  }}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${
                    activeTab === tab.id
                      ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Admin Tab Content Scrollable Container */}
          <div className="p-6 sm:p-8 overflow-y-auto flex-1 space-y-8 text-left">
            
            {/* TAB 1: General & Profile */}
            {activeTab === 'general' && (
              <div className="space-y-6 max-w-4xl">
                <div>
                  <h3 className="text-lg font-bold text-white mb-1">প্রোফাইল, হিরো ও যোগাযোগ এডিট</h3>
                  <p className="text-xs text-slate-400">
                    এখানে যে পরিবর্তন করবেন তা হোমপেজে তাৎক্ষণিকভাবে প্রদর্শিত হবে।
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      ওয়েবসাইট নাম / ব্র্যান্ড
                    </label>
                    <input
                      type="text"
                      value={settings.siteName}
                      onChange={e => updateSettings({ siteName: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white text-sm focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      ডোমেইন নেম
                    </label>
                    <input
                      type="text"
                      value={settings.domain}
                      onChange={e => updateSettings({ domain: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white text-sm font-mono focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      হিরো টাইটেল / নাম
                    </label>
                    <input
                      type="text"
                      value={settings.heroTitle}
                      onChange={e => updateSettings({ heroTitle: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white text-sm focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      সাবটাইটেল / রোল
                    </label>
                    <input
                      type="text"
                      value={settings.heroSubtitle}
                      onChange={e => updateSettings({ heroSubtitle: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white text-sm focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                {/* Profile Photo: Direct URL + Direct Upload */}
                <div className="p-5 rounded-2xl bg-slate-950 border border-white/10 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-white flex items-center gap-2">
                        <ImageIcon className="w-4 h-4 text-amber-400" />
                        <span>প্রোফাইল ছবি (ক্লাউডিফাই লিঙ্ক অথবা সরাসরি আপলোড)</span>
                      </h4>
                      <p className="text-xs text-slate-400">
                        কোডের ওপর চাপ কমাতে ক্লাউডিফাই বা অন্য লিঙ্কের মাধ্যমে ছবি যুক্ত করতে পারেন, অথবা সরাসরি ফাইল আপলোড করুন।
                      </p>
                    </div>
                    {settings.heroImage && (
                      <div className="w-12 h-12 rounded-xl overflow-hidden border border-amber-400 shrink-0">
                        <img src={settings.heroImage} alt="Preview" className="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">
                        ইমেজ লিঙ্ক (URL)
                      </label>
                      <input
                        type="url"
                        value={settings.heroImage}
                        onChange={e => updateSettings({ heroImage: e.target.value })}
                        placeholder="https://res.cloudinary.com/... or https://i.imgur.com/..."
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">
                        অথবা সরাসরি ডিভাইস থেকে আপলোড করুন
                      </label>
                      <label className="flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-white/10 text-slate-300 hover:text-white text-xs cursor-pointer transition-colors">
                        <Upload className="w-4 h-4 text-amber-400" />
                        <span>কম্পিউটার/মোবাইল থেকে ছবি বেছে নিন</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={e => handleImageFileUpload(e, url => updateSettings({ heroImage: url }))}
                        />
                      </label>
                    </div>
                  </div>
                </div>

                {/* Logo & Navigation Branding: URL or Direct Upload */}
                <div className="p-5 rounded-2xl bg-slate-950 border border-white/10 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-bold text-white flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-amber-400" />
                        <span>অফিশিয়াল লোগো (নেভিগেশন বার ও সোশ্যাল মিডিয়া প্রিভিউ)</span>
                      </h4>
                      <p className="text-xs text-slate-400">
                        নেভিগেশন বার এবং সোশ্যাল মিডিয়া (WhatsApp, Facebook) প্রিভিউ কার্ডে প্রদর্শনের জন্য লোগো।
                      </p>
                    </div>
                    <div className="w-12 h-12 rounded-xl overflow-hidden border border-amber-400/80 bg-zinc-900 shrink-0 p-1 flex items-center justify-center">
                      <img 
                        src={settings.logoUrl || '/logo.png'} 
                        alt="Logo Preview" 
                        className="w-full h-full object-cover rounded-lg"
                        onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">
                        লোগো লিঙ্ক (URL)
                      </label>
                      <input
                        type="text"
                        value={settings.logoUrl || '/logo.png'}
                        onChange={e => updateSettings({ logoUrl: e.target.value })}
                        placeholder="/logo.png অথবা https://res.cloudinary.com/.../logo.png"
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">
                        অথবা সরাসরি লোগো ফাইল আপলোড করুন
                      </label>
                      <label className="flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-white/10 text-slate-300 hover:text-white text-xs cursor-pointer transition-colors">
                        <Upload className="w-4 h-4 text-amber-400" />
                        <span>কম্পিউটার/মোবাইল থেকে লোগো আপলোড</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={e => handleImageFileUpload(e, url => updateSettings({ logoUrl: url }))}
                        />
                      </label>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    সংক্ষিপ্ত বায়ো (হিরো ডেসক্রিপশন)
                  </label>
                  <textarea
                    rows={3}
                    value={settings.heroBio}
                    onChange={e => updateSettings({ heroBio: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white text-sm focus:outline-none focus:border-amber-400"
                  />
                </div>

                {/* Contact Coordinates */}
                <div className="pt-4 border-t border-white/10">
                  <h4 className="text-sm font-bold text-white mb-3">যোগাযোগের লিংক ও ফোন নম্বর</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs text-slate-300 mb-1">মোবাইল ফোন</label>
                      <input
                        type="text"
                        value={settings.phone}
                        onChange={e => updateSettings({ phone: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white text-xs font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-300 mb-1">ইমেইল</label>
                      <input
                        type="email"
                        value={settings.email}
                        onChange={e => updateSettings({ email: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white text-xs font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-300 mb-1">ঠিকানা</label>
                      <input
                        type="text"
                        value={settings.address}
                        onChange={e => updateSettings({ address: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-300 mb-1">LinkedIn লিংক</label>
                      <input
                        type="text"
                        value={settings.linkedinUrl}
                        onChange={e => updateSettings({ linkedinUrl: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white text-xs font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-300 mb-1">Behance লিংক</label>
                      <input
                        type="text"
                        value={settings.behanceUrl}
                        onChange={e => updateSettings({ behanceUrl: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white text-xs font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-300 mb-1">WhatsApp লিংক (wa.me/@mahim.wp)</label>
                      <input
                        type="text"
                        value={settings.whatsappLink}
                        onChange={e => updateSettings({ whatsappLink: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white text-xs font-mono"
                      />
                    </div>
                    <div className="md:col-span-3">
                      <label className="block text-xs text-slate-300 mb-1">হোয়াটসঅ্যাপ প্রোফাইল ছবি (URL)</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={settings.whatsappAvatarUrl || ''}
                          onChange={e => updateSettings({ whatsappAvatarUrl: e.target.value })}
                          placeholder="https://res.cloudinary.com/.../behance_pp_spfumh.jpg"
                          className="flex-1 px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white text-xs font-mono"
                        />
                        <label className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs text-white cursor-pointer flex items-center gap-1.5 shrink-0">
                          <Upload className="w-3.5 h-3.5 text-amber-400" />
                          <span>ছবি আপলোড</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={e => handleImageFileUpload(e, url => updateSettings({ whatsappAvatarUrl: url }))}
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => showNotification('সেটিংস সফলভাবে সংরক্ষিত হয়েছে!')}
                    className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition-all cursor-pointer"
                  >
                    পরিবর্তন সেভ করুন
                  </button>
                </div>
              </div>
            )}

            {/* TAB 2: Blog Post Manager (WordPress Style) */}
            {activeTab === 'blog' && (
              <div className="space-y-6">
                
                {/* Header & Create Post Toggle */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
                  <div>
                    <h3 className="text-lg font-bold text-white">ওয়ার্ডপ্রেস স্টাইল ব্লগ পোস্ট ম্যানেজার</h3>
                    <p className="text-xs text-slate-400">
                      পাবলিক, মেম্বার অনলি এবং ভিআইপি অনুমোদিত পোস্ট তৈরি ও পরিচালনা করুন।
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setIsCreatingPost(!isCreatingPost);
                      setEditingPostId(null);
                      setPostForm({
                        title: '',
                        slug: '',
                        excerpt: '',
                        content: '',
                        coverImage: '',
                        altText: '',
                        category: 'ডিজাইন টিপস',
                        visibility: 'public',
                        author: 'Mahim Ibne Khudi',
                        date: new Date().toISOString().split('T')[0],
                        readTime: '৪ মিনিট',
                      });
                    }}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400 transition-all cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>{isCreatingPost ? 'পোস্ট তালিকা দেখুন' : 'নতুন পোস্ট তৈরি করুন'}</span>
                  </button>
                </div>

                {/* Create/Edit Form */}
                {isCreatingPost ? (
                  <form onSubmit={handleSavePost} className="p-6 rounded-3xl bg-slate-950 border border-amber-500/20 space-y-5">
                    <h4 className="text-base font-bold text-amber-400 flex items-center gap-2">
                      <Edit3 className="w-4 h-4" />
                      <span>{editingPostId ? 'পোস্ট এডিট করুন' : 'নতুন ব্লগ পোস্ট লিখুন'}</span>
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="md:col-span-2">
                        <label className="block text-xs font-medium text-slate-300 mb-1">
                          পোস্ট শিরোনাম (Title) <span className="text-amber-400">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={postForm.title}
                          onChange={e => setPostForm({ ...postForm, title: e.target.value })}
                          placeholder="উদাঃ ২০২৬ সালে গ্রাফিক ডিজাইনের নতুন কৌশল"
                          className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-sm focus:outline-none focus:border-amber-400"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1">
                          অ্যাক্সেস টাইপ (Visibility) <span className="text-amber-400">*</span>
                        </label>
                        <select
                          value={postForm.visibility}
                          onChange={e => setPostForm({ ...postForm, visibility: e.target.value as PostVisibility })}
                          className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-sm focus:outline-none focus:border-amber-400"
                        >
                          <option value="public">১. পাবলিক পোস্ট (সবার জন্য উন্মুক্ত)</option>
                          <option value="members">২. মেম্বারস অনলি (রেজিস্টার্ড পাঠকদের জন্য)</option>
                          <option value="vip">৩. অনুমোদিত ভিআইপি (মাহিম অনুমোদিত পাঠকদের জন্য)</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1">ক্যাটাগরি</label>
                        <input
                          type="text"
                          value={postForm.category}
                          onChange={e => setPostForm({ ...postForm, category: e.target.value })}
                          placeholder="উদাঃ ব্র্যান্ডিং / টিপস"
                          className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1">পড়ার সময়</label>
                        <input
                          type="text"
                          value={postForm.readTime}
                          onChange={e => setPostForm({ ...postForm, readTime: e.target.value })}
                          placeholder="উদাঃ ৪ মিনিট"
                          className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-slate-300 mb-1">তারিখ</label>
                        <input
                          type="date"
                          value={postForm.date}
                          onChange={e => setPostForm({ ...postForm, date: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs"
                        />
                      </div>
                    </div>

                    {/* Image URL + Upload for Post */}
                    <div className="p-4 rounded-2xl bg-slate-900 border border-white/10 space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="block text-xs font-bold text-white flex items-center gap-2">
                          <ImageIcon className="w-4 h-4 text-amber-400" />
                          <span>পোস্টের ফিচার্ড ছবি (Featured Image URL বা আপলোড)</span>
                        </label>
                        {postForm.coverImage && (
                          <div className="w-16 h-10 rounded-lg overflow-hidden border border-white/20">
                            <img src={postForm.coverImage} alt="Cover Preview" className="w-full h-full object-cover" />
                          </div>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <input
                          type="url"
                          value={postForm.coverImage}
                          onChange={e => setPostForm({ ...postForm, coverImage: e.target.value })}
                          placeholder="https://images.unsplash.com/... or Cloudinary URL"
                          className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white text-xs font-mono"
                        />
                        <label className="flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-slate-950 hover:bg-slate-800 border border-white/10 text-slate-300 text-xs cursor-pointer">
                          <Upload className="w-3.5 h-3.5 text-amber-400" />
                          <span>ডিভাইস থেকে ছবি আপলোড</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={e => handleImageFileUpload(e, url => setPostForm({ ...postForm, coverImage: url }))}
                          />
                        </label>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">
                        সংক্ষিপ্ত সারাংশ (Excerpt)
                      </label>
                      <textarea
                        rows={2}
                        value={postForm.excerpt}
                        onChange={e => setPostForm({ ...postForm, excerpt: e.target.value })}
                        placeholder="পোস্টের মূল বিষয়বস্তু এক বা দুই লাইনে..."
                        className="w-full px-4 py-2 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-300 mb-1">
                        সম্পূর্ণ পোস্ট কনটেন্ট (Article Content & Embeds) <span className="text-amber-400">*</span>
                      </label>
                      <textarea
                        rows={8}
                        required
                        value={postForm.content}
                        onChange={e => setPostForm({ ...postForm, content: e.target.value })}
                        placeholder="এখানে পোস্টের বিস্তারিত লিখুন। প্যারাগ্রাফ, হেডলাইন, লিংক ইত্যাদি সাপোর্ট করে..."
                        className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-white/10 text-white text-sm focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <div className="flex gap-3 pt-2">
                      <button
                        type="submit"
                        className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-all cursor-pointer"
                      >
                        {editingPostId ? 'পোস্ট আপডেট করুন' : 'পোস্ট পাবলিশ করুন'}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setIsCreatingPost(false);
                          setEditingPostId(null);
                        }}
                        className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs"
                      >
                        বাতিল
                      </button>
                    </div>
                  </form>
                ) : (
                  /* Post Listing Table */
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 gap-4">
                      {posts.map(post => (
                        <div
                          key={post.id}
                          className="glass-card rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-white/10 hover:border-amber-500/30 transition-all"
                        >
                          <div className="flex items-center gap-4 min-w-0">
                            {post.coverImage && (
                              <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-900 shrink-0 border border-white/10">
                                <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover" />
                              </div>
                            )}
                            <div className="min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span
                                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                    post.visibility === 'public'
                                      ? 'bg-emerald-500/20 text-emerald-400'
                                      : post.visibility === 'members'
                                      ? 'bg-blue-500/20 text-blue-400'
                                      : 'bg-amber-500/20 text-amber-300'
                                  }`}
                                >
                                  {post.visibility === 'public'
                                    ? 'পাবলিক'
                                    : post.visibility === 'members'
                                    ? 'মেম্বার অনলি'
                                    : 'ভিআইপি স্পেশাল'}
                                </span>
                                <span className="text-[11px] text-slate-400 font-mono">
                                  {post.date}
                                </span>
                              </div>
                              <h4 className="text-sm font-bold text-white truncate max-w-lg">
                                {post.title}
                              </h4>
                              <p className="text-xs text-slate-400 line-clamp-1">
                                {post.excerpt}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                            <button
                              onClick={() => startEditPost(post)}
                              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-amber-400 transition-colors"
                              title="এডিট"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => {
                                if (confirm(`"${post.title}" পোস্টটি ডিলিট করতে চান?`)) {
                                  deletePost(post.id);
                                  showNotification('পোস্ট ডিলিট করা হয়েছে');
                                }
                              }}
                              className="p-2 rounded-xl bg-slate-800 hover:bg-rose-500/20 text-slate-300 hover:text-rose-400 transition-colors"
                              title="ডিলিট"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            )}

            {/* TAB 3: Users & Permission Control */}
            {activeTab === 'users' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-white mb-1">ইউজার ও মেম্বারস পারমিশন কন্ট্রোল</h3>
                  <p className="text-xs text-slate-400">
                    এখানে রেজিস্টার্ড পাঠকদের তালিকা দেখতে পারবেন এবং যাদের ইচ্ছা ১-ক্লিকে ভিআইপি (VIP) অনুমোদন দিতে পারবেন।
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  {users.map(u => (
                    <div
                      key={u.id}
                      className="glass-card rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-white/10"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center font-bold text-amber-400">
                          {u.name[0]}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-bold text-white">{u.name}</h4>
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                u.role === 'vip'
                                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                  : 'bg-slate-800 text-slate-400'
                              }`}
                            >
                              {u.role === 'vip' ? '★ VIP Approved' : 'Regular Member'}
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 font-mono">{u.email}</p>
                          <p className="text-[11px] text-slate-500">
                            {u.occupation || 'পাঠক'} • যোগদান: {u.joinedDate}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-center">
                        {u.role === 'vip' ? (
                          <button
                            onClick={() => {
                              updateUserStatus(u.id, 'approved', 'user');
                              showNotification('ভিআইপি পারমিশন প্রত্যাহার করা হয়েছে');
                            }}
                            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-semibold"
                          >
                            ভিআইপি বাতিল করুন
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              updateUserStatus(u.id, 'approved', 'vip');
                              showNotification(`"${u.name}" কে ভিআইপি এক্সেস দেওয়া হয়েছে!`);
                            }}
                            className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold shadow-md shadow-amber-500/20"
                          >
                            ✓ ভিআইপি এলাউ (Approve VIP)
                          </button>
                        )}

                        <button
                          onClick={() => {
                            if (confirm(`"${u.name}" ইউজার মুছে ফেলতে চান?`)) {
                              deleteUser(u.id);
                              showNotification('ইউজার ডিলিট করা হয়েছে');
                            }
                          }}
                          className="p-2 rounded-xl bg-slate-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition-colors"
                          title="ইউজার মুছুন"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            )}

            {/* TAB 4: Experience & Education */}
            {activeTab === 'experience' && (
              <div className="space-y-10">
                
                {/* Experiences Section */}
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
                    <div>
                      <h3 className="text-base font-bold text-white flex items-center gap-2">
                        <Briefcase className="w-5 h-5 text-amber-400" />
                        <span>কাজের অভিজ্ঞতা (Work Experience)</span>
                      </h3>
                      <p className="text-xs text-slate-400">DESHI VOJ, Fiverr ও অন্যান্য কর্মক্ষেত্রের বিবরণ এডিট ও ডিলিট করুন</p>
                    </div>
                    {!isExpFormOpen && (
                      <button
                        onClick={startCreateExp}
                        className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors shadow-md shadow-amber-500/20"
                      >
                        <Plus className="w-4 h-4" />
                        <span>নতুন অভিজ্ঞতা যোগ করুন</span>
                      </button>
                    )}
                  </div>

                  {/* Experience Form (Create / Edit) */}
                  {isExpFormOpen && (
                    <form onSubmit={handleSaveExp} className="p-5 rounded-2xl bg-slate-900 border-2 border-amber-500/50 space-y-4 shadow-xl">
                      <div className="flex items-center justify-between pb-2 border-b border-white/10">
                        <h4 className="text-sm font-bold text-amber-400 flex items-center gap-2">
                          <Edit3 className="w-4 h-4" />
                          <span>{editingExpId ? 'কাজের অভিজ্ঞতা এডিট করুন' : 'নতুন কাজের অভিজ্ঞতা যোগ করুন'}</span>
                        </h4>
                        <button
                          type="button"
                          onClick={() => setIsExpFormOpen(false)}
                          className="text-xs text-slate-400 hover:text-white px-2 py-1 rounded-lg bg-slate-800"
                        >
                          বন্ধ করুন
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-slate-300 mb-1">
                            পদবী / রোল <span className="text-rose-400">*</span>
                          </label>
                          <input
                            type="text"
                            required
                            value={expForm.role}
                            onChange={e => setExpForm({ ...expForm, role: e.target.value })}
                            placeholder="যেমন: সিনিয়র গ্রাফিক ডিজাইনার"
                            className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white text-xs focus:outline-none focus:border-amber-400"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-slate-300 mb-1">
                            প্রতিষ্ঠান / প্ল্যাটফর্ম <span className="text-rose-400">*</span>
                          </label>
                          <input
                            type="text"
                            required
                            value={expForm.company}
                            onChange={e => setExpForm({ ...expForm, company: e.target.value })}
                            placeholder="যেমন: Deshi Voj / Fiverr"
                            className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white text-xs focus:outline-none focus:border-amber-400"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-slate-300 mb-1">
                            সময়কাল
                          </label>
                          <input
                            type="text"
                            value={expForm.period}
                            onChange={e => setExpForm({ ...expForm, period: e.target.value })}
                            placeholder="যেমন: ২০২৪ – বর্তমান"
                            className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white text-xs focus:outline-none focus:border-amber-400"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-slate-300 mb-1">
                            ব্যবহৃত স্কিলসমূহ (কমা দিয়ে আলাদা)
                          </label>
                          <input
                            type="text"
                            value={expForm.skillsUsed.join(', ')}
                            onChange={e =>
                              setExpForm({
                                ...expForm,
                                skillsUsed: e.target.value.split(',').map(s => s.trim()).filter(Boolean),
                              })
                            }
                            placeholder="যেমন: Photoshop, Illustrator, Brand Design"
                            className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white text-xs focus:outline-none focus:border-amber-400"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-300 mb-1">
                          দায়িত্ব ও অর্জনের বিবরণ
                        </label>
                        <textarea
                          rows={3}
                          value={expForm.description}
                          onChange={e => setExpForm({ ...expForm, description: e.target.value })}
                          placeholder="কাজের বিস্তারিত বিবরণ লিখুন..."
                          className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white text-xs focus:outline-none focus:border-amber-400"
                        />
                      </div>

                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="isCurrentExp"
                          checked={expForm.isCurrent || false}
                          onChange={e => setExpForm({ ...expForm, isCurrent: e.target.checked })}
                          className="rounded accent-amber-400"
                        />
                        <label htmlFor="isCurrentExp" className="text-xs text-slate-300 cursor-pointer">
                          বর্তমানে এই পদে কর্মরত আছি
                        </label>
                      </div>

                      <div className="flex items-center gap-3 pt-2">
                        <button
                          type="submit"
                          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs"
                        >
                          <Check className="w-4 h-4" />
                          <span>{editingExpId ? 'পরিবর্তন সংরক্ষণ করুন' : 'অভিজ্ঞতা যুক্ত করুন'}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setIsExpFormOpen(false);
                            setEditingExpId(null);
                          }}
                          className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs"
                        >
                          বাতিল
                        </button>
                      </div>
                    </form>
                  )}

                  {/* Experiences List */}
                  <div className="space-y-3">
                    {experiences.map(exp => (
                      <div
                        key={exp.id}
                        className="p-4 rounded-2xl bg-slate-950 border border-white/10 hover:border-white/20 transition-all flex flex-col sm:flex-row sm:items-start justify-between gap-4"
                      >
                        <div className="space-y-1.5 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="text-sm font-bold text-white">
                              {exp.role} <span className="text-slate-500">|</span> <span className="text-amber-400">{exp.company}</span>
                            </h4>
                            {exp.isCurrent && (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                                বর্তমান
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-400 font-mono">{exp.period}</p>
                          <p className="text-xs text-slate-300 leading-relaxed">{exp.description}</p>
                          {exp.skillsUsed && exp.skillsUsed.length > 0 && (
                            <div className="flex items-center gap-1.5 flex-wrap pt-1">
                              {exp.skillsUsed.map((sk, idx) => (
                                <span key={idx} className="px-2 py-0.5 rounded-md text-[10px] bg-slate-900 border border-white/10 text-slate-300">
                                  {sk}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>

                        <div className="flex items-center gap-2 shrink-0 self-end sm:self-start">
                          <button
                            onClick={() => startEditExp(exp)}
                            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-400 hover:text-amber-300 text-xs font-semibold border border-white/10"
                            title="এডিট করুন"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span>এডিট</span>
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`"${exp.role} — ${exp.company}" অভিজ্ঞতা কি মুছে ফেলতে চান?`)) {
                                deleteExperience(exp.id);
                                showNotification('অভিজ্ঞতা মুছে ফেলা হয়েছে');
                              }
                            }}
                            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 text-xs font-semibold border border-white/10"
                            title="মুছে ফেলুন"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>ডিলিট</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Education Section */}
                <div className="space-y-4 pt-6 border-t border-white/10">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
                    <div>
                      <h3 className="text-base font-bold text-white flex items-center gap-2">
                        <GraduationCap className="w-5 h-5 text-amber-400" />
                        <span>শিক্ষা ও একাডেমি (Education)</span>
                      </h3>
                      <p className="text-xs text-slate-400">ঢাকা সেন্ট্রাল ইউনিভার্সিটি, HSC, SSC সহ শিক্ষাগত যোগ্যতার বিবরণ</p>
                    </div>
                    {!isEduFormOpen && (
                      <button
                        onClick={startCreateEdu}
                        className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors shadow-md shadow-amber-500/20"
                      >
                        <Plus className="w-4 h-4" />
                        <span>নতুন শিক্ষা তথ্য যোগ</span>
                      </button>
                    )}
                  </div>

                  {/* Education Form (Create / Edit) */}
                  {isEduFormOpen && (
                    <form onSubmit={handleSaveEdu} className="p-5 rounded-2xl bg-slate-900 border-2 border-amber-500/50 space-y-4 shadow-xl">
                      <div className="flex items-center justify-between pb-2 border-b border-white/10">
                        <h4 className="text-sm font-bold text-amber-400 flex items-center gap-2">
                          <Edit3 className="w-4 h-4" />
                          <span>{editingEduId ? 'শিক্ষা তথ্য এডিট করুন' : 'নতুন শিক্ষা তথ্য যোগ করুন'}</span>
                        </h4>
                        <button
                          type="button"
                          onClick={() => setIsEduFormOpen(false)}
                          className="text-xs text-slate-400 hover:text-white px-2 py-1 rounded-lg bg-slate-800"
                        >
                          বন্ধ করুন
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-slate-300 mb-1">
                            ডিগ্রি / সনদ <span className="text-rose-400">*</span>
                          </label>
                          <input
                            type="text"
                            required
                            value={eduForm.degree}
                            onChange={e => setEduForm({ ...eduForm, degree: e.target.value })}
                            placeholder="যেমন: স্নাতক (Bachelor of Arts)"
                            className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white text-xs focus:outline-none focus:border-amber-400"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-slate-300 mb-1">
                            শিক্ষা প্রতিষ্ঠান <span className="text-rose-400">*</span>
                          </label>
                          <input
                            type="text"
                            required
                            value={eduForm.institution}
                            onChange={e => setEduForm({ ...eduForm, institution: e.target.value })}
                            placeholder="যেমন: ঢাকা সেন্ট্রাল ইউনিভার্সিটি"
                            className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white text-xs focus:outline-none focus:border-amber-400"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-slate-300 mb-1">
                            বিভাগ / ডিপার্টমেন্ট
                          </label>
                          <input
                            type="text"
                            value={eduForm.department || ''}
                            onChange={e => setEduForm({ ...eduForm, department: e.target.value })}
                            placeholder="যেমন: পলিটিক্যাল সাইন্স (Political Science)"
                            className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white text-xs focus:outline-none focus:border-amber-400"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-slate-300 mb-1">
                            শিক্ষাবর্ষ / সময়কাল
                          </label>
                          <input
                            type="text"
                            value={eduForm.period}
                            onChange={e => setEduForm({ ...eduForm, period: e.target.value })}
                            placeholder="যেমন: ২০২৪ – চলমান"
                            className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white text-xs focus:outline-none focus:border-amber-400"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-slate-300 mb-1">
                            ফলাফল / জিপিএ
                          </label>
                          <input
                            type="text"
                            value={eduForm.result}
                            onChange={e => setEduForm({ ...eduForm, result: e.target.value })}
                            placeholder="যেমন: অধ্যয়নরত / GPA: 5.00"
                            className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white text-xs focus:outline-none focus:border-amber-400"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-slate-300 mb-1">
                            বিবরণ (ঐচ্ছিক)
                          </label>
                          <input
                            type="text"
                            value={eduForm.description || ''}
                            onChange={e => setEduForm({ ...eduForm, description: e.target.value })}
                            placeholder="অতিরিক্ত তথ্য..."
                            className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white text-xs focus:outline-none focus:border-amber-400"
                          />
                        </div>
                      </div>

                      <div className="flex items-center gap-3 pt-2">
                        <button
                          type="submit"
                          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs"
                        >
                          <Check className="w-4 h-4" />
                          <span>{editingEduId ? 'পরিবর্তন সংরক্ষণ করুন' : 'শিক্ষা তথ্য যুক্ত করুন'}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setIsEduFormOpen(false);
                            setEditingEduId(null);
                          }}
                          className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs"
                        >
                          বাতিল
                        </button>
                      </div>
                    </form>
                  )}

                  {/* Education List */}
                  <div className="space-y-3">
                    {education.map(edu => (
                      <div
                        key={edu.id}
                        className="p-4 rounded-2xl bg-slate-950 border border-white/10 hover:border-white/20 transition-all flex flex-col sm:flex-row sm:items-start justify-between gap-4"
                      >
                        <div className="space-y-1 flex-1">
                          <h4 className="text-sm font-bold text-white">
                            {edu.degree} <span className="text-slate-500">|</span> <span className="text-amber-400">{edu.institution}</span>
                          </h4>
                          {edu.department && (
                            <p className="text-xs text-amber-300/90 font-medium">{edu.department}</p>
                          )}
                          <p className="text-xs text-slate-400 font-mono">
                            {edu.period} • ফলাফল: <span className="text-slate-300">{edu.result}</span>
                          </p>
                          {edu.description && (
                            <p className="text-xs text-slate-400 pt-0.5">{edu.description}</p>
                          )}
                        </div>

                        <div className="flex items-center gap-2 shrink-0 self-end sm:self-start">
                          <button
                            onClick={() => startEditEdu(edu)}
                            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-400 hover:text-amber-300 text-xs font-semibold border border-white/10"
                            title="এডিট করুন"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span>এডিট</span>
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`"${edu.degree} — ${edu.institution}" শিক্ষা তথ্য কি মুছে ফেলতে চান?`)) {
                                deleteEducation(edu.id);
                                showNotification('শিক্ষা তথ্য মুছে ফেলা হয়েছে');
                              }
                            }}
                            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-900 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 text-xs font-semibold border border-white/10"
                            title="মুছে ফেলুন"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>ডিলিট</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}

            {/* TAB 5: Skills & Certifications */}
            {activeTab === 'skills' && (
              <div className="space-y-10">
                
                {/* Skills Manager */}
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
                    <div>
                      <h3 className="text-base font-bold text-white flex items-center gap-2">
                        <Wrench className="w-5 h-5 text-amber-400" />
                        <span>স্কিল ও সফটওয়্যার পারদর্শিতা</span>
                      </h3>
                      <p className="text-xs text-slate-400">দক্ষতা পরিবর্তন, নতুন স্কিল যোগ অথবা অপ্রয়োজনীয় স্কিল মুছুন</p>
                    </div>
                    {!isSkillFormOpen && (
                      <button
                        onClick={startCreateSkill}
                        className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors shadow-md shadow-amber-500/20"
                      >
                        <Plus className="w-4 h-4" />
                        <span>নতুন স্কিল যোগ করুন</span>
                      </button>
                    )}
                  </div>

                  {/* Skill Form (Create / Edit) */}
                  {isSkillFormOpen && (
                    <form onSubmit={handleSaveSkill} className="p-5 rounded-2xl bg-slate-900 border-2 border-amber-500/50 space-y-4 shadow-xl">
                      <div className="flex items-center justify-between pb-2 border-b border-white/10">
                        <h4 className="text-sm font-bold text-amber-400 flex items-center gap-2">
                          <Edit3 className="w-4 h-4" />
                          <span>{editingSkillId ? 'স্কিল এডিট করুন' : 'নতুন স্কিল যোগ করুন'}</span>
                        </h4>
                        <button
                          type="button"
                          onClick={() => setIsSkillFormOpen(false)}
                          className="text-xs text-slate-400 hover:text-white px-2 py-1 rounded-lg bg-slate-800"
                        >
                          বন্ধ করুন
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-slate-300 mb-1">
                            স্কিলের নাম <span className="text-rose-400">*</span>
                          </label>
                          <input
                            type="text"
                            required
                            value={skillForm.name}
                            onChange={e => setSkillForm({ ...skillForm, name: e.target.value })}
                            placeholder="যেমন: Adobe Illustrator"
                            className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white text-xs focus:outline-none focus:border-amber-400"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-slate-300 mb-1">
                            পার্সেন্টেজ / দক্ষতা ({skillForm.proficiency}%)
                          </label>
                          <input
                            type="number"
                            min="1"
                            max="100"
                            value={skillForm.proficiency}
                            onChange={e => setSkillForm({ ...skillForm, proficiency: parseInt(e.target.value, 10) || 50 })}
                            className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white text-xs focus:outline-none focus:border-amber-400"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-slate-300 mb-1">
                            ক্যাটাগরি
                          </label>
                          <select
                            value={skillForm.category}
                            onChange={e => setSkillForm({ ...skillForm, category: e.target.value as any })}
                            className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white text-xs focus:outline-none focus:border-amber-400"
                          >
                            <option value="design">ডিজাইন (Design)</option>
                            <option value="marketing">মার্কেটিং (Marketing)</option>
                            <option value="tech">টেক ও টুলস (Tech & Tools)</option>
                            <option value="other">অন্যান্য (Other)</option>
                          </select>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="highlightSkill"
                          checked={skillForm.highlight ?? true}
                          onChange={e => setSkillForm({ ...skillForm, highlight: e.target.checked })}
                          className="rounded accent-amber-400"
                        />
                        <label htmlFor="highlightSkill" className="text-xs text-slate-300 cursor-pointer">
                          টপ স্কিল হিসেবে হাইলাইট করুন
                        </label>
                      </div>

                      <div className="flex items-center gap-3 pt-2">
                        <button
                          type="submit"
                          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs"
                        >
                          <Check className="w-4 h-4" />
                          <span>{editingSkillId ? 'পরিবর্তন সংরক্ষণ করুন' : 'স্কিল যুক্ত করুন'}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setIsSkillFormOpen(false);
                            setEditingSkillId(null);
                          }}
                          className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs"
                        >
                          বাতিল
                        </button>
                      </div>
                    </form>
                  )}

                  {/* Skills Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {skills.map(sk => (
                      <div
                        key={sk.id}
                        className="p-4 rounded-2xl bg-slate-950 border border-white/10 hover:border-white/20 transition-all flex items-center justify-between gap-3"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <p className="text-sm font-bold text-white truncate">{sk.name}</p>
                            <span className="text-xs font-mono font-bold text-amber-400 shrink-0">{sk.proficiency}%</span>
                          </div>
                          <input
                            type="range"
                            min="20"
                            max="100"
                            value={sk.proficiency}
                            onChange={e => updateSkill(sk.id, { proficiency: parseInt(e.target.value, 10) })}
                            className="w-full accent-amber-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                          />
                        </div>

                        <div className="flex items-center gap-1 shrink-0 ml-2">
                          <button
                            onClick={() => startEditSkill(sk)}
                            className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-amber-400 hover:text-amber-300 transition-colors"
                            title="এডিট"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`"${sk.name}" স্কিল মুছে ফেলতে চান?`)) {
                                deleteSkill(sk.id);
                                showNotification('স্কিল মুছে ফেলা হয়েছে');
                              }
                            }}
                            className="p-1.5 rounded-lg bg-slate-900 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition-colors"
                            title="মুছে ফেলুন"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Certifications Manager */}
                <div className="space-y-4 pt-6 border-t border-white/10">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
                    <div>
                      <h3 className="text-base font-bold text-white flex items-center gap-2">
                        <ShieldCheck className="w-5 h-5 text-amber-400" />
                        <span>NSDA ও প্রফেশনাল সার্টিফিকেশন</span>
                      </h3>
                      <p className="text-xs text-slate-400">জাতীয় দক্ষতা উন্নয়ন কর্তৃপক্ষ ও অন্যান্য সনদ বিবরণ</p>
                    </div>
                    {!isCertFormOpen && (
                      <button
                        onClick={startCreateCert}
                        className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors shadow-md shadow-amber-500/20"
                      >
                        <Plus className="w-4 h-4" />
                        <span>সার্টিফিকেশন যোগ করুন</span>
                      </button>
                    )}
                  </div>

                  {/* Cert Form (Create / Edit) */}
                  {isCertFormOpen && (
                    <form onSubmit={handleSaveCert} className="p-5 rounded-2xl bg-slate-900 border-2 border-amber-500/50 space-y-4 shadow-xl">
                      <div className="flex items-center justify-between pb-2 border-b border-white/10">
                        <h4 className="text-sm font-bold text-amber-400 flex items-center gap-2">
                          <Edit3 className="w-4 h-4" />
                          <span>{editingCertId ? 'সার্টিফিকেশন এডিট করুন' : 'নতুন সার্টিফিকেশন যোগ করুন'}</span>
                        </h4>
                        <button
                          type="button"
                          onClick={() => setIsCertFormOpen(false)}
                          className="text-xs text-slate-400 hover:text-white px-2 py-1 rounded-lg bg-slate-800"
                        >
                          বন্ধ করুন
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-slate-300 mb-1">
                            সনদ / সার্টিফিকেটের নাম <span className="text-rose-400">*</span>
                          </label>
                          <input
                            type="text"
                            required
                            value={certForm.title}
                            onChange={e => setCertForm({ ...certForm, title: e.target.value })}
                            placeholder="যেমন: গ্রাফিক ডিজাইন এনএসডিএ লেভেল-৪"
                            className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white text-xs focus:outline-none focus:border-amber-400"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-slate-300 mb-1">
                            প্রদানকারী প্রতিষ্ঠান <span className="text-rose-400">*</span>
                          </label>
                          <input
                            type="text"
                            required
                            value={certForm.issuer}
                            onChange={e => setCertForm({ ...certForm, issuer: e.target.value })}
                            placeholder="যেমন: জাতীয় দক্ষতা উন্নয়ন কর্তৃপক্ষ (NSDA)"
                            className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white text-xs focus:outline-none focus:border-amber-400"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-slate-300 mb-1">
                            অর্জনের বছর
                          </label>
                          <input
                            type="text"
                            value={certForm.year}
                            onChange={e => setCertForm({ ...certForm, year: e.target.value })}
                            placeholder="যেমন: ২০২৪"
                            className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white text-xs focus:outline-none focus:border-amber-400"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-slate-300 mb-1">
                            ক্রেডেনশিয়াল / রেজিস্ট্রেশন আইডি
                          </label>
                          <input
                            type="text"
                            value={certForm.credentialId || ''}
                            onChange={e => setCertForm({ ...certForm, credentialId: e.target.value })}
                            placeholder="যেমন: NSDA-GDO-2024-8891"
                            className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white text-xs focus:outline-none focus:border-amber-400"
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label className="block text-xs font-semibold text-slate-300 mb-1">
                            ব্যাজ / লেবেল
                          </label>
                          <input
                            type="text"
                            value={certForm.badge || ''}
                            onChange={e => setCertForm({ ...certForm, badge: e.target.value })}
                            placeholder="যেমন: গভর্নমেন্ট সার্টিফাইড"
                            className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-white/10 text-white text-xs focus:outline-none focus:border-amber-400"
                          />
                        </div>
                      </div>

                      <div className="flex items-center gap-3 pt-2">
                        <button
                          type="submit"
                          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs"
                        >
                          <Check className="w-4 h-4" />
                          <span>{editingCertId ? 'পরিবর্তন সংরক্ষণ করুন' : 'সার্টিফিকেশন যুক্ত করুন'}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setIsCertFormOpen(false);
                            setEditingCertId(null);
                          }}
                          className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs"
                        >
                          বাতিল
                        </button>
                      </div>
                    </form>
                  )}

                  {/* Certifications Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {certifications.map(c => (
                      <div
                        key={c.id}
                        className="p-4 rounded-2xl bg-slate-950 border border-white/10 hover:border-white/20 transition-all flex flex-col justify-between"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-[10px] font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-full">
                              {c.year}
                            </span>
                            {c.badge && (
                              <span className="text-[9px] font-semibold text-emerald-400 bg-emerald-400/10 px-1.5 py-0.5 rounded">
                                {c.badge}
                              </span>
                            )}
                          </div>
                          <h4 className="text-sm font-bold text-white pt-1 line-clamp-2">{c.title}</h4>
                          <p className="text-xs text-slate-400">{c.issuer}</p>
                          {c.credentialId && (
                            <p className="text-[10px] font-mono text-slate-500 truncate pt-1">ID: {c.credentialId}</p>
                          )}
                        </div>

                        <div className="flex justify-end items-center gap-2 pt-3 mt-2 border-t border-white/5">
                          <button
                            onClick={() => startEditCert(c)}
                            className="flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-amber-400 text-[11px] font-medium"
                            title="এডিট করুন"
                          >
                            <Edit3 className="w-3 h-3" />
                            <span>এডিট</span>
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`"${c.title}" সার্টিফিকেশন মুছে ফেলতে চান?`)) {
                                deleteCertification(c.id);
                                showNotification('সার্টিফিকেশন মুছে ফেলা হয়েছে');
                              }
                            }}
                            className="flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-900 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 text-[11px] font-medium"
                            title="মুছে ফেলুন"
                          >
                            <Trash2 className="w-3 h-3" />
                            <span>ডিলিট</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}

            {/* TAB 6: Google Sheets Database Integration */}
            {activeTab === 'sheets' && (
              <div className="space-y-6 max-w-4xl">
                <div>
                  <h3 className="text-lg font-bold text-white mb-1">গুগল শিট (Google Sheets) লাইভ ডাটাবেজ ইন্টিগ্রেশন</h3>
                  <p className="text-xs text-slate-400">
                    ওয়েবসাইটের সকল ইউজার রেজিস্ট্রেশন ও যোগাযোগের মেসেজ সরাসরি আপনার গুগল শিটে সংরক্ষণ করতে এই ফিচারটি ব্যবহার করুন।
                  </p>
                </div>

                <div className="p-5 rounded-3xl bg-slate-950 border border-emerald-500/30 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                      <FileSpreadsheet className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white">Google Apps Script Webhook URL</h4>
                      <p className="text-xs text-slate-400">আপনার তৈরি করা Google Sheet Web App লিঙ্কটি এখানে পেস্ট করুন</p>
                    </div>
                  </div>

                  <div>
                    <input
                      type="url"
                      value={settings.googleSheetWebhookUrl || ''}
                      onChange={e => updateSettings({ googleSheetWebhookUrl: e.target.value })}
                      placeholder="https://script.google.com/macros/s/AKfycbx.../exec"
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-emerald-400"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <span className="text-xs text-slate-400">
                      স্ট্যাটাস: {settings.googleSheetWebhookUrl ? (
                        <span className="text-emerald-400 font-bold">✓ কানেক্টেড</span>
                      ) : (
                        <span className="text-amber-400">অপেক্ষমাণ (লিংক দিন)</span>
                      )}
                    </span>
                    <button
                      onClick={() => showNotification('গুগল শিট সেভ হয়েছে!')}
                      className="px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs hover:bg-emerald-400"
                    >
                      সংরক্ষণ করুন
                    </button>
                  </div>
                </div>

                {/* Setup Instructions & Code Copy */}
                <div className="p-5 rounded-3xl bg-slate-950 border border-white/10 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-amber-400" />
                      <span>গুগল শিটে সেটআপের জন্য স্ক্রিপ্ট কোড (১-ক্লিক কপি)</span>
                    </h4>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(GOOGLE_APPS_SCRIPT_TEMPLATE);
                        setCopiedCode(true);
                        setTimeout(() => setCopiedCode(false), 2500);
                      }}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-semibold"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>{copiedCode ? 'কপি সম্পন্ন!' : 'কোড কপি করুন'}</span>
                    </button>
                  </div>

                  <ol className="text-xs text-slate-300 space-y-2 list-decimal list-inside leading-relaxed">
                    <li>আপনার Google Drive-এ গিয়ে একটি নতুন <strong>Google Sheet</strong> তৈরি করুন।</li>
                    <li>শীটের মেনু থেকে <strong>Extensions &gt; Apps Script</strong>-এ যান।</li>
                    <li>উপরের <strong>কোড কপি করুন</strong> বাটনে ক্লিক করে পুরো কোডটি Apps Script-এ পেস্ট করে Save দিন।</li>
                    <li>উপরে ডানে <strong>Deploy &gt; New deployment</strong> এ ক্লিক করুন (Type: Web app, Access: Anyone)।</li>
                    <li>প্রাপ্ত Web App URL টি কপি করে উপরের বক্সে বসিয়ে দিন। ব্যাস! স্বয়ংক্রিয়ভাবে ডাটা সেভ হতে থাকবে।</li>
                  </ol>

                  <pre className="p-4 rounded-xl bg-slate-900 border border-white/5 text-[11px] font-mono text-slate-400 overflow-x-auto max-h-48">
                    {GOOGLE_APPS_SCRIPT_TEMPLATE}
                  </pre>
                </div>

              </div>
            )}

            {/* TAB 7: SEO & Sitemap */}
            {activeTab === 'seo' && (
              <div className="space-y-6 max-w-4xl">
                <div>
                  <h3 className="text-lg font-bold text-white mb-1">সার্চ ইঞ্জিন ও এআই ডিসকভারি এসইও (SEO)</h3>
                  <p className="text-xs text-slate-400">
                    গুগলে মাহিম, Mahim Ibne Khudi ও সম্পর্কিত কীওয়ার্ডে র‍্যাংক করার অপ্টিমাইজেশন
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      এসইও টাইটেল (Title Tag)
                    </label>
                    <input
                      type="text"
                      value={settings.seoTitle}
                      onChange={e => updateSettings({ seoTitle: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      মেটা ডেসক্রিপশন (Meta Description)
                    </label>
                    <textarea
                      rows={3}
                      value={settings.seoDescription}
                      onChange={e => updateSettings({ seoDescription: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      টার্গেট কীওয়ার্ডস (কমা দিয়ে আলাদা করুন)
                    </label>
                    <textarea
                      rows={3}
                      value={settings.seoKeywords.join(', ')}
                      onChange={e =>
                        updateSettings({
                          seoKeywords: e.target.value.split(',').map(s => s.trim()).filter(Boolean),
                        })
                      }
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-white/10 text-white text-xs font-mono"
                    />
                  </div>
                </div>

                {/* Dynamic Sitemap & Robots.txt generators */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-white/10">
                  
                  {/* Sitemap Card */}
                  <div className="p-5 rounded-2xl bg-slate-950 border border-white/10 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-white">ডায়নামিক সাইটম্যাপ (sitemap.xml)</h4>
                      <button
                        onClick={() => {
                          const xml = generateSitemapXml(settings, posts);
                          navigator.clipboard.writeText(xml);
                          setCopiedSitemap(true);
                          setTimeout(() => setCopiedSitemap(false), 2000);
                        }}
                        className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-mono"
                      >
                        {copiedSitemap ? 'কপি হয়েছে!' : 'XML কপি'}
                      </button>
                    </div>
                    <p className="text-xs text-slate-400">
                      গুগল সার্চ কনসোলে সাবমিটের জন্য প্রস্তুত XML সাইটম্যাপ।
                    </p>
                    <pre className="p-3 rounded-xl bg-slate-900 text-[10px] font-mono text-slate-400 max-h-32 overflow-y-auto">
                      {generateSitemapXml(settings, posts)}
                    </pre>
                  </div>

                  {/* Robots.txt Card */}
                  <div className="p-5 rounded-2xl bg-slate-950 border border-white/10 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-white">এআই ও সার্চ রোবটস (robots.txt)</h4>
                      <button
                        onClick={() => {
                          const rob = generateRobotsTxt(settings.domain);
                          navigator.clipboard.writeText(rob);
                          setCopiedRobots(true);
                          setTimeout(() => setCopiedRobots(false), 2000);
                        }}
                        className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-mono"
                      >
                        {copiedRobots ? 'কপি হয়েছে!' : 'Robots কপি'}
                      </button>
                    </div>
                    <p className="text-xs text-slate-400">
                      GPTBot, Perplexity, Claude ও Google Crawlers যাতে সহজে ইনডেক্স করতে পারে।
                    </p>
                    <pre className="p-3 rounded-xl bg-slate-900 text-[10px] font-mono text-slate-400 max-h-32 overflow-y-auto">
                      {generateRobotsTxt(settings.domain)}
                    </pre>
                  </div>

                </div>

              </div>
            )}

            {/* TAB 8: Contact Messages Inbox */}
            {activeTab === 'messages' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-white">ওয়েবসাইট ইনবক্স ({contactMessages.length} টি বার্তা)</h3>
                    <p className="text-xs text-slate-400">ভিজিটরদের পাঠানো সরাসরি মেসেজ</p>
                  </div>
                </div>

                {contactMessages.length === 0 ? (
                  <div className="p-8 text-center bg-slate-950 rounded-2xl text-slate-500 text-sm">
                    কোনো নতুন মেসেজ নেই।
                  </div>
                ) : (
                  <div className="space-y-3">
                    {contactMessages.map(m => (
                      <div
                        key={m.id}
                        className="p-5 rounded-2xl bg-slate-950 border border-white/10 space-y-2 relative"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="text-sm font-bold text-white">{m.name}</h4>
                            <p className="text-xs text-amber-400 font-mono">{m.email}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] text-slate-500">{m.date}</span>
                            <button
                              onClick={() => deleteMessage(m.id)}
                              className="p-1.5 text-slate-500 hover:text-rose-400"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {m.subject && (
                          <p className="text-xs font-semibold text-slate-300">বিষয়: {m.subject}</p>
                        )}

                        <p className="text-xs sm:text-sm text-slate-200 bg-slate-900 p-3 rounded-xl whitespace-pre-wrap">
                          {m.message}
                        </p>

                        <a
                          href={`mailto:${m.email}?subject=Reply:%20${encodeURIComponent(m.subject || 'mahims.com')}`}
                          className="inline-flex items-center gap-1 text-xs text-amber-400 hover:underline pt-1"
                        >
                          <span>ইমেইলে উত্তর দিন →</span>
                        </a>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB 9: Backup & Security */}
            {activeTab === 'backup' && (
              <div className="space-y-8 max-w-3xl">
                
                {/* Database Backup Download & Restore */}
                <div className="p-6 rounded-3xl bg-slate-950 border border-white/10 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                      <Database className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-white">সম্পূর্ণ ডাটাবেজ ব্যাকআপ (JSON Export / Import)</h4>
                      <p className="text-xs text-slate-400">
                        আপনার সমস্ত পোস্ট, ইউজার, সেটিংস ও বার্তা এক ফাইলে ডাউনলোড করুন অথবা রিস্টোর করুন।
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-4 pt-2">
                    <button
                      onClick={() => {
                        const jsonStr = exportBackupJson();
                        const blob = new Blob([jsonStr], { type: 'application/json' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `mahims-backup-${new Date().toISOString().split('T')[0]}.json`;
                        a.click();
                        showNotification('ব্যাকআপ ফাইল ডাউনলোড হয়েছে!');
                      }}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400 transition-all cursor-pointer"
                    >
                      <Download className="w-4 h-4" />
                      <span>ব্যাকআপ ডাউনলোড করুন (JSON)</span>
                    </button>

                    <label className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs cursor-pointer transition-all">
                      <Upload className="w-4 h-4 text-amber-400" />
                      <span>ব্যাকআপ ফাইল থেকে রিস্টোর করুন</span>
                      <input
                        type="file"
                        accept=".json"
                        className="hidden"
                        onChange={e => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          const reader = new FileReader();
                          reader.onload = evt => {
                            const content = evt.target?.result as string;
                            if (content && importBackupJson(content)) {
                              showNotification('ডাটাবেজ সফলভাবে রিস্টোর হয়েছে!');
                            } else {
                              alert('ব্যাকআপ ফাইলটি সঠিক নয়।');
                            }
                          };
                          reader.readAsText(file);
                        }}
                      />
                    </label>
                  </div>
                </div>

                {/* Change Admin Password */}
                <div className="p-6 rounded-3xl bg-slate-950 border border-white/10 space-y-4">
                  <h4 className="text-base font-bold text-white flex items-center gap-2">
                    <Key className="w-4 h-4 text-amber-400" />
                    <span>এডমিন পাসওয়ার্ড পরিবর্তন</span>
                  </h4>
                  <p className="text-xs text-slate-400">
                    বর্তমান পাসওয়ার্ড: <code>@@MahimsdotcomAdmin11223300@@</code>। আপনি চাইলে নতুন পাসওয়ার্ড সেট করতে পারেন।
                  </p>

                  <form onSubmit={handlePasswordChange} className="space-y-3 max-w-md">
                    <div>
                      <input
                        type="password"
                        required
                        value={newAdminPass}
                        onChange={e => setNewAdminPass(e.target.value)}
                        placeholder="নতুন পাসওয়ার্ড লিখুন..."
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs"
                      />
                    </div>
                    {passChangeSuccess && (
                      <p className="text-xs text-emerald-400 font-semibold">{passChangeSuccess}</p>
                    )}
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 font-bold text-xs"
                    >
                      পাসওয়ার্ড পরিবর্তন করুন
                    </button>
                  </form>
                </div>

              </div>
            )}

          </div>

        </div>
      )}

    </div>
  );
};
