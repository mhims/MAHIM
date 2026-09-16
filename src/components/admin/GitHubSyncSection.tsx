import React, { useState } from 'react';
import { 
  GitBranch, GitCommit, Copy, Download, Check, 
  ExternalLink, Key, ShieldCheck, RefreshCw, Terminal, AlertCircle, FileCode, CheckCircle2 
} from 'lucide-react';
import { 
  getStoredGitHubConfig, 
  saveStoredGitHubConfig, 
  pushFileToGitHub, 
  downloadFileAsText, 
  GitHubPushConfig 
} from '../../utils/githubSyncHelper';
import { generateCoursesTypeScriptCode, getLiveCourses } from '../../utils/courseManager';
import { generateTeachersTypeScriptCode, getLiveTeachers } from '../../utils/teacherManager';
import { getStoredTopSlides } from '../../data/topSlides';
import { getStoredPortfolioProjects } from '../../data/portfolioProjects';
import { getStoredThoughtPosts } from '../../utils/thoughtStorage';
import { DEFAULT_BLOG_POSTS } from '../../data/defaultData';
import { getClassroomBlogs } from '../../utils/classroomBlogStorage';

const getStoredMainBlogPosts = (): any[] => {
  if (typeof window !== 'undefined') {
    try {
      const raw = localStorage.getItem('mahims_posts');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
  }
  return DEFAULT_BLOG_POSTS;
};

interface Props {
  onNotify: (msg: string) => void;
}

export const GitHubSyncSection: React.FC<Props> = ({ onNotify }) => {
  const [config, setConfig] = useState<GitHubPushConfig>(() => getStoredGitHubConfig());
  const [activeTab, setActiveTab] = useState<'push' | 'manual'>('manual');
  const [selectedFile, setSelectedFile] = useState<string>('courses.ts');
  const [isPushing, setIsPushing] = useState(false);
  const [pushStatus, setPushStatus] = useState<{ success?: boolean; message?: string } | null>(null);
  const [copied, setCopied] = useState(false);

  // Generate file content for manual replacement / push
  const getFileContent = (key: string): { path: string; content: string; filename: string } => {
    if (key === 'courses.ts') {
      return {
        path: 'src/data/courses.ts',
        filename: 'courses.ts',
        content: generateCoursesTypeScriptCode(getLiveCourses()),
      };
    }
    if (key === 'teachers.ts') {
      return {
        path: 'src/data/teachers.ts',
        filename: 'teachers.ts',
        content: generateTeachersTypeScriptCode(getLiveTeachers()),
      };
    }
    if (key === 'topSlides.ts') {
      const slides = getStoredTopSlides();
      return {
        path: 'src/data/topSlides.ts',
        filename: 'topSlides.ts',
        content: `export interface HomeTopSlide {
  id: string;
  image: string;
  link: string;
  path: string;
  title: string;
}

export const INITIAL_TOP_SLIDES: HomeTopSlide[] = ${JSON.stringify(slides, null, 2)};
`,
      };
    }
    if (key === 'portfolioProjects.ts') {
      const projs = getStoredPortfolioProjects();
      return {
        path: 'src/data/portfolioProjects.ts',
        filename: 'portfolioProjects.ts',
        content: `import { PortfolioProject } from './portfolioProjects';

export const INITIAL_PORTFOLIO_PROJECTS: PortfolioProject[] = ${JSON.stringify(projs, null, 2)};
`,
      };
    }
    if (key === 'thoughtPosts.ts') {
      const thoughts = getStoredThoughtPosts();
      return {
        path: 'src/data/thoughtPosts.ts',
        filename: 'thoughtPosts.ts',
        content: `export interface ThoughtPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  readTime: string;
  tags: string[];
  isFeatured?: boolean;
}

export const THOUGHT_POSTS: ThoughtPost[] = ${JSON.stringify(thoughts, null, 2)};
`,
      };
    }
    if (key === 'userBlogPosts.ts') {
      const blogs = getStoredMainBlogPosts();
      return {
        path: 'src/data/userBlogPosts.ts',
        filename: 'userBlogPosts.ts',
        content: `import { BlogPost } from '../types';

export const USER_BLOG_POSTS: BlogPost[] = ${JSON.stringify(blogs, null, 2)};
`,
      };
    }

    // Default: full JSON backup
    const fullBackup = {
      courses: getLiveCourses(),
      teachers: getLiveTeachers(),
      topSlides: getStoredTopSlides(),
      portfolio: getStoredPortfolioProjects(),
      thoughts: getStoredThoughtPosts(),
      blogs: getStoredMainBlogPosts(),
      classroomBlogs: getClassroomBlogs(),
      exportedAt: new Date().toISOString(),
    };
    return {
      path: 'backup/mahims-full-backup.json',
      filename: 'mahims-full-backup.json',
      content: JSON.stringify(fullBackup, null, 2),
    };
  };

  const currentFileData = getFileContent(selectedFile);

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    saveStoredGitHubConfig(config);
    onNotify('গিটহাব কনফিগারেশন সংরক্ষিত হয়েছে!');
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(currentFileData.content);
    setCopied(true);
    onNotify(`${currentFileData.filename} এর কোড কপি করা হয়েছে!`);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadFile = () => {
    downloadFileAsText(currentFileData.filename, currentFileData.content, 'text/typescript');
    onNotify(`${currentFileData.filename} ডাউনলোড সম্পন্ন হয়েছে!`);
  };

  // Push single file via GitHub REST API
  const handlePushCurrentFile = async () => {
    if (!config.token.trim()) {
      alert('অনুগ্রহ করে আপনার গিটহাব পার্সোনাল অ্যাক্সেস টোকেন (PAT) প্রদান করুন।');
      return;
    }

    setIsPushing(true);
    setPushStatus(null);

    const res = await pushFileToGitHub(
      currentFileData.path,
      currentFileData.content,
      `Update ${currentFileData.filename} from Mahim's Admin Panel`,
      config
    );

    setIsPushing(false);
    setPushStatus(res);
    onNotify(res.message);
  };

  // Push all files sequentially
  const handlePushAllFiles = async () => {
    if (!config.token.trim()) {
      alert('অনুগ্রহ করে আপনার গিটহাব পার্সোনাল অ্যাক্সেস টোকেন (PAT) প্রদান করুন।');
      return;
    }

    if (!window.confirm('আপনি কি সব ডাটা ফাইল (Courses, Thoughts, Teachers, Slides, Portfolio) গিটহাবে পুশ করতে চান?')) {
      return;
    }

    setIsPushing(true);
    setPushStatus({ message: 'ফাইলগুলো ক্রমান্বয়ে গিটহাবে পুশ করা হচ্ছে...' });

    const filesToPush = ['courses.ts', 'thoughtPosts.ts', 'teachers.ts', 'topSlides.ts', 'portfolioProjects.ts'];
    let successCount = 0;

    for (const f of filesToPush) {
      const fileObj = getFileContent(f);
      const res = await pushFileToGitHub(
        fileObj.path,
        fileObj.content,
        `Sync ${fileObj.filename} from Mahim's Admin Panel`,
        config
      );
      if (res.success) successCount++;
    }

    setIsPushing(false);
    if (successCount === filesToPush.length) {
      setPushStatus({ success: true, message: `সকল ${successCount} টি ফাইল সফলভাবে গিটহাবে পুশ হয়েছে!` });
      onNotify('সকল ফাইল গিটহাবে সফলভাবে সিঙ্ক হয়েছে!');
    } else {
      setPushStatus({ success: false, message: `${filesToPush.length} টির মধ্যে ${successCount} টি পুশ হয়েছে। বাকিগুলোতে সমস্যা হয়েছে।` });
      onNotify('কিছু ফাইল পুশ করতে সমস্যা হয়েছে।');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="bg-zinc-900/80 p-5 rounded-2xl border border-zinc-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <GitBranch className="w-5 h-5 text-orange-500" />
              গিটহাব পাবলিশ ও ম্যানুয়াল কোড রিপ্লেসমেন্ট (GitHub Deployment)
            </h3>
            <p className="text-xs text-zinc-400 mt-1">
              এডমিন প্যানেলে করা পরিবর্তনগুলো মূল ওয়েবসাইটে লাইভ করার জন্য নিচে যেকোনো একটি সহজ পদ্ধতি ব্যবহার করুন।
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('manual')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'manual'
                  ? 'bg-orange-500 text-white shadow-xs'
                  : 'bg-zinc-800 text-zinc-400 hover:text-white'
              }`}
            >
              <FileCode className="w-3.5 h-3.5" />
              ম্যানুয়াল রিপ্লেসমেন্ট
            </button>

            <button
              onClick={() => setActiveTab('push')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'push'
                  ? 'bg-orange-500 text-white shadow-xs'
                  : 'bg-zinc-800 text-zinc-400 hover:text-white'
              }`}
            >
              <GitCommit className="w-3.5 h-3.5" />
              সরাসরি গিটহাব এপিআই পুশ
            </button>
          </div>
        </div>
      </div>

      {/* Mode 1: Manual Code Replacement & Download */}
      {activeTab === 'manual' && (
        <div className="space-y-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 sm:p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-2 flex-wrap">
                <label className="text-xs font-bold text-zinc-300">ফাইল নির্বাচন করুন:</label>
                <select
                  value={selectedFile}
                  onChange={(e) => setSelectedFile(e.target.value)}
                  className="px-3 py-1.5 bg-zinc-800 border border-zinc-700 rounded-xl text-xs text-white font-mono"
                >
                  <option value="courses.ts">src/data/courses.ts (সকল কোর্স)</option>
                  <option value="thoughtPosts.ts">src/data/thoughtPosts.ts (থিঙ্ক উইথ মাহিম)</option>
                  <option value="teachers.ts">src/data/teachers.ts (শিক্ষক প্রোফাইল)</option>
                  <option value="topSlides.ts">src/data/topSlides.ts (হোম ব্যানার স্লাইডার)</option>
                  <option value="portfolioProjects.ts">src/data/portfolioProjects.ts (পোর্টফোলিও)</option>
                  <option value="userBlogPosts.ts">src/data/userBlogPosts.ts (মূল ব্লগ)</option>
                  <option value="backup.json">mahims-full-backup.json (সম্পূর্ণ সাইট ব্যাকআপ)</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyCode}
                  className="px-3.5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'কপি হয়েছে!' : 'কোড কপি করুন'}
                </button>

                <button
                  onClick={handleDownloadFile}
                  className="px-3.5 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-orange-500/20 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  ফাইল ডাউনলোড (.ts)
                </button>
              </div>
            </div>

            {/* Step by Step Manual instructions */}
            <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-3.5 mb-4 text-xs text-orange-200/90 leading-relaxed">
              <p className="font-bold text-orange-400 mb-1 flex items-center gap-1">
                <Terminal className="w-3.5 h-3.5" /> ম্যানুয়ালি গিটহাবে কোড রিপ্লেস করার নিয়ম (৩টি সহজ ধাপ):
              </p>
              <ol className="list-decimal list-inside space-y-1">
                <li>উপরে <strong>"কোড কপি করুন"</strong> বাটনে ক্লিক করে কোড কপি করে নিন।</li>
                <li>
                  গিটহাবে গিয়ে{' '}
                  <a
                    href={`https://github.com/${config.owner}/${config.repo}/blob/${config.branch || 'main'}/${currentFileData.path}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-white underline font-mono inline-flex items-center gap-0.5 hover:text-orange-300"
                  >
                    {currentFileData.path} <ExternalLink className="w-3 h-3" />
                  </a>{' '}
                  ফাইলটি ওপেন করে উপরের ✏️ (Edit) বাটনে চাপ দিন।
                </li>
                <li>পুরোনো কোড মুছে ফেলে কপি করা কোড পেস্ট করে <strong>Commit changes</strong> বাটনে চাপ দিন!</li>
              </ol>
            </div>

            {/* Code Display Area */}
            <div className="relative rounded-xl border border-zinc-800 bg-black/60 overflow-hidden">
              <div className="flex items-center justify-between px-4 py-2 bg-zinc-800/80 border-b border-zinc-700/60 text-[11px] font-mono text-zinc-400">
                <span>{currentFileData.path}</span>
                <span>{currentFileData.content.split('\n').length} লাইন</span>
              </div>
              <pre className="p-4 text-xs font-mono text-zinc-300 overflow-x-auto max-h-96 leading-relaxed select-all">
                {currentFileData.content}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* Mode 2: Direct GitHub API Push */}
      {activeTab === 'push' && (
        <div className="space-y-4">
          <form onSubmit={handleSaveConfig} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-4">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Key className="w-4 h-4 text-orange-500" />
              গিটহাব এপিআই ক্রেডেনশিয়াল ও সেটিংস
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <label className="block text-zinc-400 font-medium mb-1">গিটহাব ইউজারনেম (Owner)</label>
                <input
                  type="text"
                  required
                  value={config.owner}
                  onChange={(e) => setConfig({ ...config, owner: e.target.value })}
                  placeholder="mahim2005"
                  className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-xl text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-zinc-400 font-medium mb-1">রিপোজিটরি নাম (Repo)</label>
                <input
                  type="text"
                  required
                  value={config.repo}
                  onChange={(e) => setConfig({ ...config, repo: e.target.value })}
                  placeholder="mahims"
                  className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-xl text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-zinc-400 font-medium mb-1">ব্রাঞ্চ (Branch)</label>
                <input
                  type="text"
                  required
                  value={config.branch}
                  onChange={(e) => setConfig({ ...config, branch: e.target.value })}
                  placeholder="main"
                  className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-xl text-white font-mono"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs text-zinc-400 font-medium">Personal Access Token (PAT)</label>
                <a
                  href="https://github.com/settings/tokens/new?scopes=repo&description=Mahims+Admin+Panel"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[11px] text-orange-400 hover:text-orange-300 flex items-center gap-1"
                >
                  <ExternalLink className="w-3 h-3" />
                  নতুন টোকেন তৈরি করুন (GitHub)
                </a>
              </div>
              <input
                type="password"
                value={config.token}
                onChange={(e) => setConfig({ ...config, token: e.target.value })}
                placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-xl text-white font-mono text-xs"
              />
              <p className="text-[11px] text-zinc-500 mt-1">
                টোকেনটি শুধুমাত্র আপনার ব্রাউজারের লোকাল স্টোরেজে সংরক্ষিত থাকে এবং নিরাপদ।
              </p>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                type="submit"
                className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl text-xs font-bold transition cursor-pointer"
              >
                সেটিংস সেভ করুন
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handlePushCurrentFile}
                  disabled={isPushing}
                  className="px-4 py-2 bg-zinc-700 hover:bg-zinc-600 text-white rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-1.5"
                >
                  {isPushing ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <GitCommit className="w-3.5 h-3.5" />}
                  বর্তমান ফাইল পুশ ({selectedFile})
                </button>

                <button
                  type="button"
                  onClick={handlePushAllFiles}
                  disabled={isPushing}
                  className="px-5 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-bold transition shadow-md shadow-orange-500/20 cursor-pointer flex items-center gap-1.5"
                >
                  {isPushing ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <GitBranch className="w-3.5 h-3.5" />}
                  সকল ফাইল একসাথে পুশ করুন
                </button>
              </div>
            </div>

            {pushStatus && (
              <div
                className={`p-3 rounded-xl border text-xs flex items-center gap-2 ${
                  pushStatus.success
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                    : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                }`}
              >
                {pushStatus.success ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
                <span>{pushStatus.message}</span>
              </div>
            )}
          </form>
        </div>
      )}
    </div>
  );
};
