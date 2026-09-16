import React, { useState, useEffect } from 'react';
import { 
  Lock, Key, ShieldCheck, ShieldAlert, BookOpen, Mail, 
  Briefcase, Image as ImageIcon, FolderGit2, GitBranch, 
  LogOut, ExternalLink, Sparkles, CheckCircle2, ChevronRight,
  Eye, EyeOff, RefreshCw, LayoutDashboard, UserCheck, Layers, Award
} from 'lucide-react';
import { MASTER_PASSWORD } from '../utils/masterPasswordHelper';
import { useSite } from '../context/SiteContext';
import { ClassroomAdminModal } from './ClassroomAdminModal';
import { ChithiAdminModal } from './ChithiAdminModal';
import { AdminModal } from './AdminModal';
import { CoursesAdminSection } from './admin/CoursesAdminSection';
import { SlidesAdminSection } from './admin/SlidesAdminSection';
import { TeachersAdminSection } from './admin/TeachersAdminSection';
import { PortfolioAdminSection } from './admin/PortfolioAdminSection';
import { GitHubSyncSection } from './admin/GitHubSyncSection';
import { navigateTo } from '../utils/navigation';

export const GlobalAdminPanel: React.FC = () => {
  const { openAdminModal } = useSite();

  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return sessionStorage.getItem('mahims_global_admin_auth') === 'true' ||
           localStorage.getItem('mahims_global_admin_auth') === 'true';
  });

  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  // Active Tab
  const [activeTab, setActiveTab] = useState<
    'hub' | 'courses' | 'slides' | 'teachers' | 'portfolio' | 'github'
  >('hub');

  // Sub-modal triggers
  const [isClassroomModalOpen, setIsClassroomModalOpen] = useState(false);
  const [isChithiModalOpen, setIsChithiModalOpen] = useState(false);

  // Toast Notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Strictly block search engine indexing as explicitly requested
  useEffect(() => {
    document.title = "Global Central Admin Panel | Mahim's World";
    
    // Inject or enforce noindex meta tags
    let metaRobots = document.querySelector('meta[name="robots"]') as HTMLMetaElement | null;
    if (!metaRobots) {
      metaRobots = document.createElement('meta');
      metaRobots.setAttribute('name', 'robots');
      document.head.appendChild(metaRobots);
    }
    metaRobots.setAttribute('content', 'noindex, nofollow, noarchive, nosnippet');

    return () => {
      // Restore normal indexing on unmount
      if (metaRobots) {
        metaRobots.setAttribute('content', 'index, follow');
      }
    };
  }, []);

  const notify = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 4000);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordInput.trim()) return;

    setIsVerifying(true);
    setAuthError(null);

    setTimeout(() => {
      if (passwordInput === MASTER_PASSWORD) {
        setIsAuthenticated(true);
        sessionStorage.setItem('mahims_global_admin_auth', 'true');
        setPasswordInput('');
        notify('মাস্টার পাসওয়ার্ড যাচাই সম্পন্ন! সেন্ট্রাল এডমিন প্যানেলে স্বাগতম।');
      } else {
        setAuthError('ভুল পাসওয়ার্ড! নির্ধারিত এডমিন পাসওয়ার্ড প্রদান করুন।');
      }
      setIsVerifying(false);
    }, 300);
  };

  const handleLogout = () => {
    if (window.confirm('আপনি কি সেন্ট্রাল এডমিন প্যানেল থেকে লগআউট করতে চান?')) {
      setIsAuthenticated(false);
      sessionStorage.removeItem('mahims_global_admin_auth');
      localStorage.removeItem('mahims_global_admin_auth');
      setPasswordInput('');
      notify('সফলভাবে লগআউট করা হয়েছে।');
    }
  };

  // 1. Password Protection Gate
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0d0e12] text-zinc-100 flex flex-col justify-center items-center px-4 py-12 selection:bg-orange-500 selection:text-white font-sans">
        <div className="w-full max-w-md bg-zinc-900/90 border border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl relative overflow-hidden">
          {/* Subtle glow accent */}
          <div className="absolute -top-24 -left-24 w-48 h-48 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="text-center mb-6">
            <div className="w-16 h-16 rounded-2xl bg-orange-500/10 border border-orange-500/20 text-orange-400 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-orange-500/5">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h1 className="text-xl font-bold text-white mb-1">সেন্ট্রাল এডমিন প্যানেল</h1>
            <p className="text-xs text-zinc-400 font-mono">mahims.com/adminpanel</p>
            <p className="text-xs text-zinc-500 mt-2">
              ওয়েবসাইটের সমস্ত কনটেন্ট ও অন্যান্য এডমিন প্যানেল পরিচালনার জন্য মাস্টার পাসওয়ার্ড দিন।
            </p>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoFocus
                  value={passwordInput}
                  onChange={(e) => {
                    setPasswordInput(e.target.value);
                    setAuthError(null);
                  }}
                  placeholder="এডমিন পাসওয়ার্ড লিখুন..."
                  className={`w-full px-4 py-3 bg-zinc-800/90 border rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-2 transition font-mono ${
                    authError
                      ? 'border-rose-500/80 focus:ring-rose-500/30'
                      : 'border-zinc-700 focus:border-orange-500 focus:ring-orange-500/20'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white p-1 transition"
                  title={showPassword ? 'পাসওয়ার্ড লুকান' : 'পাসওয়ার্ড দেখুন'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {authError && (
                <p className="text-xs text-rose-400 font-medium flex items-center gap-1.5 mt-2">
                  <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
                  <span>{authError}</span>
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isVerifying || !passwordInput.trim()}
              className="w-full py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold rounded-xl transition shadow-lg shadow-orange-500/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isVerifying ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>যাচাই করা হচ্ছে...</span>
                </>
              ) : (
                <>
                  <Key className="w-4 h-4" />
                  <span>প্যানেলে প্রবেশ করুন</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-zinc-800 text-center">
            <button
              onClick={(e) => navigateTo('/', e)}
              className="text-xs text-zinc-400 hover:text-orange-400 transition cursor-pointer flex items-center justify-center gap-1 mx-auto"
            >
              ← মূল ওয়েবসাইটে ফিরে যান
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 2. Authenticated Admin Dashboard
  return (
    <div className="min-h-screen bg-[#0d0e12] text-zinc-100 font-sans selection:bg-orange-500 selection:text-white pb-24">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-zinc-900/90 backdrop-blur-md border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-base font-bold text-white flex items-center gap-2">
                Mahim's Central Admin
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  Master
                </span>
              </h1>
              <p className="text-[11px] text-zinc-400">mahims.com/adminpanel (গুগলে ইনডেক্স নিষিদ্ধ)</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={(e) => navigateTo('/', e)}
              className="px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white text-xs font-medium transition cursor-pointer flex items-center gap-1.5"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">লাইভ ওয়েবসাইট</span>
            </button>

            <button
              onClick={handleLogout}
              className="px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 text-xs font-bold transition cursor-pointer flex items-center gap-1.5 border border-rose-500/20"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>লগআউট</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center space-x-1 sm:space-x-2 overflow-x-auto py-2 border-t border-zinc-800/60 no-scrollbar">
          <button
            onClick={() => setActiveTab('hub')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'hub'
                ? 'bg-orange-500 text-white shadow-xs'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800/70'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            এডমিন হাব ও প্যানেলসমূহ
          </button>

          <button
            onClick={() => setActiveTab('courses')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'courses'
                ? 'bg-orange-500 text-white shadow-xs'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800/70'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            কোর্সসমূহ (Courses)
          </button>

          <button
            onClick={() => setActiveTab('slides')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'slides'
                ? 'bg-orange-500 text-white shadow-xs'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800/70'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            হোম স্লাইডার ব্যানার
          </button>

          <button
            onClick={() => setActiveTab('teachers')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'teachers'
                ? 'bg-orange-500 text-white shadow-xs'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800/70'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            শিক্ষক ও মেন্টর
          </button>

          <button
            onClick={() => setActiveTab('portfolio')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'portfolio'
                ? 'bg-orange-500 text-white shadow-xs'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800/70'
            }`}
          >
            <FolderGit2 className="w-3.5 h-3.5" />
            পোর্টফোলিও প্রজেক্টস
          </button>

          <button
            onClick={() => setActiveTab('github')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'github'
                ? 'bg-orange-500 text-white shadow-xs'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800/70'
            }`}
          >
            <GitBranch className="w-3.5 h-3.5" />
            গিটহাব পুশ ও কোড
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {/* Tab 1: Hub & Sub-Admin Panels */}
        {activeTab === 'hub' && (
          <div className="space-y-6">
            {/* Welcome banner */}
            <div className="bg-gradient-to-r from-orange-950/40 via-zinc-900 to-zinc-900 border border-orange-900/30 rounded-3xl p-6 sm:p-8">
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-2 flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-orange-500" />
                সেন্ট্রাল এডমিন ড্যাশবোর্ড
              </h2>
              <p className="text-sm text-zinc-400 max-w-2xl leading-relaxed">
                আপনার ওয়েবসাইটের অন্যান্য সকল এডমিন প্যানেল নিচে সংযুক্ত করা হয়েছে। যেকোনোটিতে ক্লিক করলে পাসওয়ার্ড চাইবে।
                পাসওয়ার্ড ভুলে গেলে পর পর ৩ বার মাস্টার পাসওয়ার্ড দিলে স্বয়ংক্রিয়ভাবে আনলক হবে।
              </p>
            </div>

            {/* Sub-Panels Cards */}
            <div>
              <h3 className="text-base font-bold text-zinc-300 mb-3 flex items-center gap-2">
                <Layers className="w-4 h-4 text-orange-500" />
                ওয়েবসাইটের শাখা এডমিন প্যানেলসমূহ
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* 1. Classroom Admin */}
                <div 
                  onClick={() => setIsClassroomModalOpen(true)}
                  className="bg-zinc-900 border border-zinc-800 hover:border-orange-500/50 rounded-2xl p-5 cursor-pointer transition group shadow-md"
                >
                  <div className="w-12 h-12 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <h4 className="text-base font-bold text-white mb-1 group-hover:text-orange-400 transition">
                    মাহিম ক্লাসরুম এডমিন
                  </h4>
                  <p className="text-xs text-zinc-400 mb-4 line-clamp-2">
                    কোর্স রেজিস্ট্রেশন লিস্ট, গুগল শিট সিঙ্ক, স্টুডেন্ট এনরোলমেন্ট ও ক্লাসরুম ব্লগ পরিচালনা।
                  </p>
                  <div className="flex items-center justify-between text-xs text-orange-400 font-bold">
                    <span>প্যানেল ওপেন করুন</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>

                {/* 2. Chithi Admin */}
                <div 
                  onClick={() => setIsChithiModalOpen(true)}
                  className="bg-zinc-900 border border-zinc-800 hover:border-amber-500/50 rounded-2xl p-5 cursor-pointer transition group shadow-md"
                >
                  <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                    <Mail className="w-6 h-6" />
                  </div>
                  <h4 className="text-base font-bold text-white mb-1 group-hover:text-amber-400 transition">
                    চিঠির বাক্স এডমিন (Chithi)
                  </h4>
                  <p className="text-xs text-zinc-400 mb-4 line-clamp-2">
                    দর্শকদের পাঠানো বেনামী গোপন চিঠি পড়া, তারকা চিহ্নিত করা ও স্টোরি পোস্ট কার্ড তৈরি।
                  </p>
                  <div className="flex items-center justify-between text-xs text-amber-400 font-bold">
                    <span>ইনবক্স ওপেন করুন</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>

                {/* 3. Portfolio & Main Site Admin */}
                <div 
                  onClick={() => openAdminModal()}
                  className="bg-zinc-900 border border-zinc-800 hover:border-indigo-500/50 rounded-2xl p-5 cursor-pointer transition group shadow-md"
                >
                  <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                    <Briefcase className="w-6 h-6" />
                  </div>
                  <h4 className="text-base font-bold text-white mb-1 group-hover:text-indigo-400 transition">
                    পোর্টফোলিও ও মেইন সাইট এডমিন
                  </h4>
                  <p className="text-xs text-zinc-400 mb-4 line-clamp-2">
                    বায়ো, অভিজ্ঞতা, শিক্ষা, স্কিলস, মূল ব্লগ ও লাইভ ভিজিটর ট্র্যাকিং পরিচালনা।
                  </p>
                  <div className="flex items-center justify-between text-xs text-indigo-400 font-bold">
                    <span>প্যানেল ওপেন করুন</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Content Short-links */}
            <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-5">
              <h3 className="text-sm font-bold text-zinc-300 mb-3">দ্রুত কনটেন্ট এডিটর শর্টকাট</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <button
                  onClick={() => setActiveTab('courses')}
                  className="p-3 bg-zinc-800 hover:bg-zinc-700/80 rounded-xl text-left transition cursor-pointer"
                >
                  <BookOpen className="w-4 h-4 text-orange-400 mb-1" />
                  <p className="text-xs font-bold text-white">সকল কোর্স CRUD</p>
                  <p className="text-[10px] text-zinc-400">একাডেমিক ও এডমিশন</p>
                </button>

                <button
                  onClick={() => setActiveTab('slides')}
                  className="p-3 bg-zinc-800 hover:bg-zinc-700/80 rounded-xl text-left transition cursor-pointer"
                >
                  <ImageIcon className="w-4 h-4 text-orange-400 mb-1" />
                  <p className="text-xs font-bold text-white">হোম ব্যানার স্লাইডার</p>
                  <p className="text-[10px] text-zinc-400">ছবি ও লিঙ্ক পরিবর্তন</p>
                </button>

                <button
                  onClick={() => setActiveTab('teachers')}
                  className="p-3 bg-zinc-800 hover:bg-zinc-700/80 rounded-xl text-left transition cursor-pointer"
                >
                  <UserCheck className="w-4 h-4 text-orange-400 mb-1" />
                  <p className="text-xs font-bold text-white">শিক্ষক ও মেন্টর</p>
                  <p className="text-[10px] text-zinc-400">প্রোফাইল ও ছবি</p>
                </button>

                <button
                  onClick={() => setActiveTab('github')}
                  className="p-3 bg-zinc-800 hover:bg-zinc-700/80 rounded-xl text-left transition cursor-pointer"
                >
                  <GitBranch className="w-4 h-4 text-orange-400 mb-1" />
                  <p className="text-xs font-bold text-white">গিটহাব সিঙ্ক ও কোড</p>
                  <p className="text-[10px] text-zinc-400">১-ক্লিক রিপ্লেসমেন্ট</p>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Courses CRUD */}
        {activeTab === 'courses' && (
          <CoursesAdminSection onNotify={notify} />
        )}

        {/* Tab 3: Slides CRUD */}
        {activeTab === 'slides' && (
          <SlidesAdminSection onNotify={notify} />
        )}

        {/* Tab 4: Teachers CRUD */}
        {activeTab === 'teachers' && (
          <TeachersAdminSection onNotify={notify} />
        )}

        {/* Tab 5: Portfolio Projects CRUD */}
        {activeTab === 'portfolio' && (
          <PortfolioAdminSection onNotify={notify} />
        )}

        {/* Tab 6: GitHub & Code Sync */}
        {activeTab === 'github' && (
          <GitHubSyncSection onNotify={notify} />
        )}
      </main>

      {/* Embedded Sub-Admin Modals */}
      <ClassroomAdminModal
        isOpen={isClassroomModalOpen}
        onClose={() => setIsClassroomModalOpen(false)}
      />

      <ChithiAdminModal
        isOpen={isChithiModalOpen}
        onClose={() => setIsChithiModalOpen(false)}
      />

      <AdminModal />

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-zinc-900 border border-orange-500/40 text-zinc-100 text-xs px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2 animate-slide-up">
          <CheckCircle2 className="w-4 h-4 text-orange-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};
