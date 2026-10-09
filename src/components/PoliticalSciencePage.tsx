import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Calendar,
  Clock,
  BookOpen,
  Bell,
  MapPin,
  ChevronRight,
  Sun,
  Moon,
  ExternalLink,
  GraduationCap,
  Sparkles,
  Download,
  FileText,
  Image as ImageIcon,
  ArrowLeft,
  Share2,
  Check,
  Menu,
  X,
  User,
  Shield,
  PhoneCall
} from 'lucide-react';
import {
  INITIAL_PS_ROUTINE,
  INITIAL_PS_NOTICES,
  INITIAL_PS_BOOKS,
  INITIAL_PS_TEACHERS,
  INITIAL_PS_COURSES,
  INITIAL_PS_SUBSCRIBERS,
  DCU_LOGOS,
  PSClassSession,
  PSNotice,
  PSBookResource,
  PSSubscriber,
  PSCourse
} from '../data/dcuPoliticalScienceData';
import { DCUAdminModal } from './dcu-ps/DCUAdminModal';
import { DCUWhatsAppWidget } from './dcu-ps/DCUWhatsAppWidget';
import {
  TickerNotice,
  DEFAULT_TICKER_NOTICES,
  fetchNoticesFromGoogleSheet
} from '../utils/googleSheetsNotices';
import { downloadRoutineImage, downloadRoutinePDF } from '../utils/routineExport';
import { navigateTo } from '../utils/navigation';

export type PSTab = 'today' | 'routine' | 'courses' | 'notices' | 'materials';

const DAY_NAMES_BN = [
  'রবিবার',
  'সোমবার',
  'মঙ্গলবার',
  'বুধবার',
  'বৃহস্পতিবার',
  'শুক্রবার',
  'শনিবার'
];

function getClassSessionStatus(session: PSClassSession, currentDay: number, now: Date) {
  if (session.dayIndex !== currentDay) return 'other-day';
  
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const [startH, startM] = session.startTime.split(':').map(Number);
  const [endH, endM] = session.endTime.split(':').map(Number);
  
  const startMinutes = startH * 60 + startM;
  const endMinutes = endH * 60 + endM;

  if (currentMinutes >= startMinutes && currentMinutes <= endMinutes) {
    return 'live';
  } else if (currentMinutes < startMinutes) {
    return 'upcoming';
  } else {
    return 'completed';
  }
}

export function PoliticalSciencePage() {
  // Theme state synced with root
  const [isDark, setIsDark] = useState<boolean>(() => {
    return document.documentElement.classList.contains('dark') || 
      window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const toggleTheme = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);
    if (nextDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  // Mobile App Menu Drawer state
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Active section tracked via scroll / buttons
  const [activeSection, setActiveSection] = useState<PSTab>('today');

  // State loaded from localStorage with initial fallbacks
  const [routine, setRoutine] = useState<PSClassSession[]>(() => {
    const saved = localStorage.getItem('dcu_ps_routine');
    return saved ? JSON.parse(saved) : INITIAL_PS_ROUTINE;
  });

  const [notices, setNotices] = useState<PSNotice[]>(() => {
    const saved = localStorage.getItem('dcu_ps_notices');
    return saved ? JSON.parse(saved) : INITIAL_PS_NOTICES;
  });

  const [books, setBooks] = useState<PSBookResource[]>(() => {
    const saved = localStorage.getItem('dcu_ps_books');
    return saved ? JSON.parse(saved) : INITIAL_PS_BOOKS;
  });

  const [subscribers, setSubscribers] = useState<PSSubscriber[]>(() => {
    const saved = localStorage.getItem('dcu_ps_subscribers');
    return saved ? JSON.parse(saved) : INITIAL_PS_SUBSCRIBERS;
  });

  // Google Sheet Ticker URL state
  const [googleSheetUrl, setGoogleSheetUrl] = useState<string>(() => {
    return localStorage.getItem('dcu_ps_sheets_url') || '';
  });

  const [tickerNotices, setTickerNotices] = useState<TickerNotice[]>(DEFAULT_TICKER_NOTICES);

  // Secret Admin Modal state (triggered via bottom dot or 5 logo clicks or Ctrl+Alt+Shift+A)
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('dcu_admin_auth') === 'true';
  });

  // Logo secret clicks tracker
  const logoClicksRef = useRef(0);
  const logoClickTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Time & Day Tracker
  const [now, setNow] = useState<Date>(new Date());
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(timer);
  }, []);

  const currentDayIndex = now.getDay(); // 0: Sunday, 1: Monday, 2: Tuesday, 3: Wednesday, 4: Thursday, 5: Friday, 6: Saturday

  // Active selected day for the day-wise preview (defaults to today if class day, else Sunday)
  const initialActiveDay = useMemo(() => {
    if ([0, 1, 2, 4].includes(currentDayIndex)) {
      return currentDayIndex;
    }
    return 0; // default to Sunday
  }, [currentDayIndex]);

  const [selectedDay, setSelectedDay] = useState<number>(initialActiveDay);

  // Sync data to localStorage
  useEffect(() => {
    localStorage.setItem('dcu_ps_routine', JSON.stringify(routine));
  }, [routine]);

  useEffect(() => {
    localStorage.setItem('dcu_ps_notices', JSON.stringify(notices));
  }, [notices]);

  useEffect(() => {
    localStorage.setItem('dcu_ps_books', JSON.stringify(books));
  }, [books]);

  useEffect(() => {
    localStorage.setItem('dcu_ps_subscribers', JSON.stringify(subscribers));
  }, [subscribers]);

  // Load Ticker Notices from Google Sheet or fallback
  const loadTickerNotices = async () => {
    if (googleSheetUrl && googleSheetUrl.trim()) {
      try {
        const fetched = await fetchNoticesFromGoogleSheet(googleSheetUrl);
        if (fetched.length > 0) {
          setTickerNotices(fetched);
          return;
        }
      } catch (err) {
        console.warn('Google Sheet fetch error:', err);
      }
    }

    const fromManual: TickerNotice[] = notices.map(n => ({
      id: n.id,
      text: `${n.title}: ${n.content.slice(0, 120)}...`,
      date: n.date
    }));

    if (fromManual.length > 0) {
      setTickerNotices(fromManual);
    } else {
      setTickerNotices(DEFAULT_TICKER_NOTICES);
    }
  };

  useEffect(() => {
    loadTickerNotices();
  }, [googleSheetUrl, notices]);

  // Keyboard shortcut Ctrl+Alt+Shift+A for secret admin
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.altKey && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        setIsAdminOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Secret 5 taps on the logo
  const handleLogoClick = () => {
    logoClicksRef.current += 1;
    if (logoClickTimeoutRef.current) {
      clearTimeout(logoClickTimeoutRef.current);
    }
    if (logoClicksRef.current >= 5) {
      logoClicksRef.current = 0;
      setIsAdminOpen(true);
    } else {
      logoClickTimeoutRef.current = setTimeout(() => {
        logoClicksRef.current = 0;
      }, 2000);
    }
  };

  const handleAdminLogin = (u: string, p: string): boolean => {
    if (u === 'dcudcps' && p === '@@Dcudcps11223300@@') {
      setIsAuthenticated(true);
      localStorage.setItem('dcu_admin_auth', 'true');
      return true;
    }
    return false;
  };

  const handleAdminLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('dcu_admin_auth');
  };

  // Scroll smoothly to a section on the same page
  const scrollToSection = (sectionId: PSTab) => {
    setActiveSection(sectionId);
    setIsMenuOpen(false);

    // Update URL cleanly without page reload
    const isDcups = window.location.pathname.startsWith('/dcups');
    const prefix = isDcups ? '/dcups' : '/ps';
    const newPath = sectionId === 'today' ? prefix : `${prefix}/${sectionId}`;
    if (window.location.pathname !== newPath) {
      window.history.pushState(null, '', newPath);
    }

    const element = document.getElementById(`section-${sectionId}`);
    if (element) {
      const topOffset = 64; // header bar height
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      window.scrollTo({
        top: elementPosition - topOffset,
        behavior: 'smooth'
      });
    }
  };

  // Handle URL change on initial load or popstate
  useEffect(() => {
    const checkHashOrPath = () => {
      const path = window.location.pathname;
      let target: PSTab = 'today';
      if (path.includes('/routine')) target = 'routine';
      else if (path.includes('/courses')) target = 'courses';
      else if (path.includes('/notices')) target = 'notices';
      else if (path.includes('/materials') || path.includes('/books')) target = 'materials';
      
      if (target !== 'today') {
        setTimeout(() => {
          const el = document.getElementById(`section-${target}`);
          if (el) {
            const topOffset = 64;
            const elementPosition = el.getBoundingClientRect().top + window.pageYOffset;
            window.scrollTo({ top: elementPosition - topOffset, behavior: 'smooth' });
          }
        }, 150);
      }
      setActiveSection(target);
    };

    checkHashOrPath();
    window.addEventListener('popstate', checkHashOrPath);
    return () => window.removeEventListener('popstate', checkHashOrPath);
  }, []);

  // Track active section as user scrolls
  useEffect(() => {
    const handleScroll = () => {
      const sections: PSTab[] = ['today', 'routine', 'courses', 'notices', 'materials'];
      const scrollPos = window.scrollY + 120;

      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(`section-${sections[i]}`);
        if (el && el.offsetTop <= scrollPos) {
          setActiveSection(sections[i]);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Class sessions for today
  const todaySessions = useMemo(() => {
    return routine
      .filter(s => s.dayIndex === currentDayIndex)
      .sort((a, b) => a.startTime.localeCompare(b.startTime));
  }, [routine, currentDayIndex]);

  // Selected day sessions
  const displayedSessions = useMemo(() => {
    return routine
      .filter(s => s.dayIndex === selectedDay)
      .sort((a, b) => a.startTime.localeCompare(b.startTime));
  }, [routine, selectedDay]);

  // Next class calculation
  const nextClassInfo = useMemo(() => {
    const validDays = [0, 1, 2, 4];
    
    // Check next upcoming today
    if (todaySessions.length > 0) {
      const currentMinutes = now.getHours() * 60 + now.getMinutes();
      const upcomingToday = todaySessions.find(s => {
        const [h, m] = s.startTime.split(':').map(Number);
        return h * 60 + m > currentMinutes;
      });
      if (upcomingToday) {
        return {
          session: upcomingToday,
          isToday: true,
          dayName: DAY_NAMES_BN[currentDayIndex],
          message: `আজকের পরবর্তী ক্লাস: ${upcomingToday.startTime} এ (${upcomingToday.courseCode})`
        };
      }
    }

    // Look for next day with classes
    let daysAhead = 1;
    while (daysAhead <= 7) {
      const checkDay = (currentDayIndex + daysAhead) % 7;
      if (validDays.includes(checkDay)) {
        const dayClasses = routine
          .filter(s => s.dayIndex === checkDay)
          .sort((a, b) => a.startTime.localeCompare(b.startTime));
        if (dayClasses.length > 0) {
          const first = dayClasses[0];
          return {
            session: first,
            isToday: false,
            dayName: DAY_NAMES_BN[checkDay],
            message: `পরবর্তী ক্লাস: ${DAY_NAMES_BN[checkDay]} সকাল ${first.startTime} এ (${first.courseCode})`
          };
        }
      }
      daysAhead++;
    }

    return null;
  }, [todaySessions, routine, currentDayIndex, now]);

  const isTodayClassDay = [0, 1, 2, 4].includes(currentDayIndex);

  return (
    <div className="min-h-screen bg-[#fafaf9] dark:bg-[#090d16] text-zinc-900 dark:text-zinc-100 flex flex-col font-sans transition-colors duration-200 selection:bg-amber-500 selection:text-black relative overflow-x-hidden pb-20">
      
      {/* Background Subtle Dot Pattern */}
      <div
        className="fixed inset-0 pointer-events-none z-0 opacity-40 dark:opacity-20"
        style={{
          backgroundImage: `radial-gradient(#f97316 0.75px, transparent 0.75px)`,
          backgroundSize: '24px 24px',
        }}
      />

      {/* ========================================================================= */}
      {/* APP-LIKE TOP APP BAR (Compact Logo on Left, Menu Button on Right)         */}
      {/* ========================================================================= */}
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-[#0d121f]/95 backdrop-blur-md border-b border-zinc-200/90 dark:border-zinc-800/90 shadow-xs">
        <div className="w-full max-w-lg mx-auto px-3.5 h-12 flex items-center justify-between">
          
          {/* Left: Tiny University Logo + App Title */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleLogoClick}
              title="ঢাকা সেন্ট্রাল ইউনিভার্সিটি (ট্যাপ করুন)"
              className="relative transition-transform active:scale-95 cursor-pointer shrink-0"
            >
              <img
                src={DCU_LOGOS.university}
                alt="University Logo"
                className="w-7 h-7 object-contain select-none"
              />
            </button>
            <div className="leading-tight text-left">
              <h1 className="text-xs font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
                <span>রাষ্ট্রবিজ্ঞান বিভাগ</span>
                <span className="text-[10px] font-medium px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-700 dark:text-amber-400">
                  ১ম সেমিস্টার
                </span>
              </h1>
              <p className="text-[10px] text-zinc-500 dark:text-zinc-400 truncate">
                ঢাকা সেন্ট্রাল ইউনিভার্সিটি
              </p>
            </div>
          </div>

          {/* Right: Theme Toggle & Menu Drawer Button */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="p-1.5 rounded-lg text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition cursor-pointer"
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-zinc-600" />}
            </button>

            <button
              type="button"
              onClick={() => setIsMenuOpen(true)}
              aria-label="Open Menu"
              className="p-1.5 rounded-lg text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition cursor-pointer flex items-center gap-1"
            >
              <Menu className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            </button>
          </div>

        </div>
      </header>

      {/* ========================================================================= */}
      {/* MOBILE APP MENU DRAWER (Slide-out Sheet)                                 */}
      {/* ========================================================================= */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
            onClick={() => setIsMenuOpen(false)}
          />

          {/* Drawer Panel */}
          <div className="relative w-72 max-w-[80vw] h-full bg-white dark:bg-[#121826] border-l border-zinc-200 dark:border-zinc-800 p-4 flex flex-col justify-between shadow-2xl z-10 animate-in slide-in-from-right duration-200">
            <div>
              {/* Drawer Header */}
              <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
                <div className="flex items-center gap-2">
                  <img
                    src={DCU_LOGOS.university}
                    alt="Logo"
                    className="w-6 h-6 object-contain"
                  />
                  <div>
                    <h3 className="text-xs font-bold text-zinc-900 dark:text-white">মেনু</h3>
                    <p className="text-[10px] text-zinc-500">রাষ্ট্রবিজ্ঞান বিভাগ</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsMenuOpen(false)}
                  className="p-1 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation Items */}
              <nav className="mt-4 space-y-1">
                {[
                  { id: 'today', label: 'আজকের ক্লাস', icon: Clock },
                  { id: 'routine', label: 'সাপ্তাহিক রুটিন', icon: Calendar },
                  { id: 'courses', label: 'কোর্স তালিকা', icon: GraduationCap },
                  { id: 'notices', label: 'নোটিশ বোর্ড', icon: Bell },
                  { id: 'materials', label: 'বই ও স্টাডি মেটেরিয়াল', icon: BookOpen },
                ].map(item => {
                  const Icon = item.icon;
                  const isActive = activeSection === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => scrollToSection(item.id as PSTab)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer text-left ${
                        isActive
                          ? 'bg-amber-500 text-black font-bold shadow-xs'
                          : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800/60'
                      }`}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </nav>

              {/* Download Quick Actions */}
              <div className="mt-6 pt-4 border-t border-zinc-100 dark:border-zinc-800">
                <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-2">
                  রুটিন ডাউনলোড
                </p>
                <div className="space-y-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      setIsMenuOpen(false);
                      downloadRoutineImage(routine);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-400 text-xs font-medium cursor-pointer"
                  >
                    <ImageIcon className="w-3.5 h-3.5" />
                    <span>ছবি (PNG) ডাউনলোড</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setIsMenuOpen(false);
                      downloadRoutinePDF(routine);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs font-medium cursor-pointer"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>পিডিএফ (PDF) ডাউনলোড</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Bottom Footer inside Menu */}
            <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 text-center">
              <button
                type="button"
                onClick={() => {
                  setIsMenuOpen(false);
                  navigateTo('home');
                }}
                className="w-full py-2 px-3 rounded-xl bg-zinc-100 dark:bg-zinc-800/80 text-zinc-700 dark:text-zinc-300 text-xs font-medium flex items-center justify-center gap-1.5 hover:bg-zinc-200 transition"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>মূল সাইটে যান (mahims.com)</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* Running News Ticker (Marquee from Google Sheet / Notices - Slower Pace)   */}
      {/* ========================================================================= */}
      <div className="relative z-10 w-full max-w-lg mx-auto px-3 mt-2.5 mb-2.5">
        <div className="flex items-center bg-white dark:bg-[#121826] border border-zinc-200/90 dark:border-zinc-800/90 rounded-xl overflow-hidden shadow-2xs h-8 text-xs">
          <div className="px-2.5 h-full bg-amber-500 text-black font-bold flex items-center gap-1 shrink-0 text-[11px] select-none">
            <span className="animate-pulse">📢</span>
            <span>নোটিশ</span>
          </div>

          <div className="flex-1 overflow-hidden relative h-full flex items-center">
            <div className="animate-marquee whitespace-nowrap flex items-center gap-10 text-[11px] text-zinc-700 dark:text-zinc-300 font-medium hover:[animation-play-state:paused] cursor-pointer pl-4">
              {tickerNotices.map((t, idx) => (
                <span
                  key={`${t.id}-${idx}`}
                  onClick={() => scrollToSection('notices')}
                  className="inline-flex items-center gap-2 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
                >
                  <span className="text-amber-500">•</span>
                  <span>{t.text}</span>
                  {t.date && <span className="text-[10px] text-zinc-400">({t.date})</span>}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SINGLE COMPREHENSIVE PAGE - ALL SECTIONS ORGANIZED ON ONE PAGE           */}
      {/* ========================================================================= */}
      <main className="relative z-10 flex-1 w-full max-w-lg mx-auto px-3 pb-6 flex flex-col gap-4">
        
        {/* ======================================================================= */}
        {/* SECTION 1: TODAY'S CLASS STATUS (#section-today)                        */}
        {/* ======================================================================= */}
        <section id="section-today" className="space-y-2.5 scroll-mt-16">
          
          {/* TODAY STATUS SUMMARY CARD */}
          <div className="bg-white dark:bg-[#121826] border border-zinc-200/90 dark:border-zinc-800/90 rounded-2xl p-3.5 shadow-2xs">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                <h2 className="text-xs font-bold text-zinc-900 dark:text-white uppercase tracking-wider">
                  {isTodayClassDay ? `আজকের ক্লাস (${DAY_NAMES_BN[currentDayIndex]})` : `আজ ছুটি (${DAY_NAMES_BN[currentDayIndex]})`}
                </h2>
              </div>
              <span className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400">
                {isTodayClassDay ? `${todaySessions.length}টি ক্লাস` : 'ক্লাস নেই'}
              </span>
            </div>

            {/* If today has classes, show today's schedule directly */}
            {isTodayClassDay && todaySessions.length > 0 ? (
              <div className="space-y-1.5">
                {todaySessions.map((session, idx) => {
                  const status = getClassSessionStatus(session, currentDayIndex, now);
                  const isLive = status === 'live';
                  return (
                    <div
                      key={session.id}
                      className={`p-2.5 rounded-xl border transition-all flex items-center justify-between text-xs ${
                        isLive
                          ? 'bg-amber-500/10 border-amber-500/40 text-zinc-900 dark:text-white ring-1 ring-amber-500/30'
                          : 'bg-zinc-50/60 dark:bg-zinc-900/40 border-zinc-200/70 dark:border-zinc-800/70 text-zinc-800 dark:text-zinc-200'
                      }`}
                    >
                      <div className="flex-1 min-w-0 pr-2">
                        <div className="flex items-center gap-1.5 mb-0.5">
                          <span className="font-bold text-[11px] text-amber-600 dark:text-amber-400 font-mono">
                            {session.timeFormatted}
                          </span>
                          {isLive && (
                            <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-emerald-500 text-white animate-pulse">
                              চলমান
                            </span>
                          )}
                          {idx === 0 && session.dayIndex === 0 && (
                            <span className="text-[9px] font-medium px-1.5 py-0.2 rounded bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                              ১ম ক্লাস
                            </span>
                          )}
                        </div>
                        <h4 className="font-semibold text-xs truncate text-zinc-900 dark:text-zinc-100">
                          {session.courseTitleBn}
                        </h4>
                        <p className="text-[11px] text-zinc-500 dark:text-zinc-400 truncate">
                          {session.teacherName} • {session.courseCode}
                        </p>
                      </div>

                      <div className="shrink-0 text-right">
                        <span className="text-[11px] font-semibold font-mono px-2 py-0.5 rounded-lg bg-zinc-200/70 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                          {session.room}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* Off-day Card with Next Class info directly displayed */
              <div className="p-3 rounded-xl bg-zinc-50/80 dark:bg-zinc-900/40 border border-zinc-200/70 dark:border-zinc-800/70 text-center space-y-2">
                <p className="text-xs text-zinc-600 dark:text-zinc-400 font-medium">
                  {currentDayIndex === 3 ? 'আজ বুধবার — সাপ্তাহিক অফ-ডে' : 'আজ কোনো ক্লাস নেই'}
                </p>
                {nextClassInfo && (
                  <div className="pt-2 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between text-left text-xs">
                    <div>
                      <span className="text-[10px] text-amber-600 dark:text-amber-400 font-bold block">
                        পরবর্তী ক্লাসের দিন
                      </span>
                      <span className="font-bold text-zinc-900 dark:text-white">
                        {nextClassInfo.dayName} ({nextClassInfo.session.startTime} এ ১ম ক্লাস)
                      </span>
                      <p className="text-[11px] text-zinc-500 truncate max-w-[200px]">
                        {nextClassInfo.session.courseTitleBn}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedDay(nextClassInfo.session.dayIndex);
                        scrollToSection('routine');
                      }}
                      className="px-2.5 py-1 text-[11px] font-semibold rounded-lg bg-amber-500 hover:bg-amber-600 text-black transition cursor-pointer shrink-0"
                    >
                      রুটিন দেখুন
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* DAY SELECTOR & PREVIEW CARD */}
          <div className="bg-white dark:bg-[#121826] border border-zinc-200/90 dark:border-zinc-800/90 rounded-2xl p-3.5 shadow-2xs space-y-2.5">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-zinc-900 dark:text-white flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-amber-500" />
                <span>দিনভিত্তিক বাছাই</span>
              </h3>
              <span className="text-[11px] text-zinc-500 font-medium">
                {selectedDay === 0 ? 'রবিবার (৩টি ক্লাস)' : selectedDay === 1 ? 'সোমবার (২টি ক্লাস)' : selectedDay === 2 ? 'মঙ্গলবার (২টি ক্লাস)' : 'বৃহস্পতিবার (২টি ক্লাস)'}
              </span>
            </div>

            {/* 4 Day Tabs */}
            <div className="grid grid-cols-4 gap-1.5">
              {[
                { day: 0, label: 'রবিবার' },
                { day: 1, label: 'সোমবার' },
                { day: 2, label: 'মঙ্গলবার' },
                { day: 4, label: 'বৃহস্পতিবার' }
              ].map(tab => {
                const isSelected = selectedDay === tab.day;
                const isToday = currentDayIndex === tab.day;
                return (
                  <button
                    key={tab.day}
                    type="button"
                    onClick={() => setSelectedDay(tab.day)}
                    className={`py-2 px-1 rounded-xl text-xs font-semibold text-center transition-all cursor-pointer relative ${
                      isSelected
                        ? 'bg-amber-500 text-black shadow-xs font-bold'
                        : 'bg-zinc-100 dark:bg-zinc-800/70 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                    }`}
                  >
                    <span>{tab.label}</span>
                    {isToday && (
                      <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-500" title="আজ" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Selected Day Class List */}
            <div className="space-y-1.5 pt-1">
              {displayedSessions.map((session, idx) => (
                <div
                  key={session.id}
                  className="p-2.5 rounded-xl border border-zinc-200/70 dark:border-zinc-800/70 bg-zinc-50/50 dark:bg-zinc-900/30 flex items-center justify-between text-xs"
                >
                  <div className="flex-1 min-w-0 pr-2">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span className="font-bold text-[11px] text-amber-600 dark:text-amber-400 font-mono">
                        {session.timeFormatted}
                      </span>
                      {idx === 0 && session.dayIndex === 0 && (
                        <span className="text-[9px] font-medium px-1.5 py-0.2 rounded bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300">
                          ১০:৪৫ শুরু
                        </span>
                      )}
                    </div>
                    <h4 className="font-semibold text-xs text-zinc-900 dark:text-white truncate">
                      {session.courseTitleBn}
                    </h4>
                    <p className="text-[11px] text-zinc-500 truncate">
                      {session.teacherName} • {session.courseCode}
                    </p>
                  </div>

                  <div className="shrink-0 text-right">
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded-lg bg-zinc-200/70 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                      {session.room}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ======================================================================= */}
        {/* SECTION 2: FULL ROUTINE WITH LIGHT MODE PNG & PDF (#section-routine)    */}
        {/* ======================================================================= */}
        <section id="section-routine" className="space-y-3 scroll-mt-16 pt-2">
          
          {/* Header Card with Clean Download Buttons */}
          <div className="bg-white dark:bg-[#121826] border border-zinc-200/90 dark:border-zinc-800/90 rounded-2xl p-4 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-zinc-900 dark:text-white flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-amber-500" />
                  <span>পূর্ণাঙ্গ সাপ্তাহিক ক্লাস রুটিন</span>
                </h2>
                <p className="text-[11px] text-zinc-500">১ম বর্ষ ১ম সেমিস্টার (ঢাকা কলেজ ক্যাম্পাস)</p>
              </div>
            </div>

            {/* 2 Big Download Buttons: PNG Image (Light Mode) and PDF */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                onClick={() => downloadRoutineImage(routine)}
                className="py-2.5 px-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-black font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition active:scale-95 cursor-pointer"
              >
                <ImageIcon className="w-4 h-4" />
                <span>ছবি ডাউনলোড (PNG)</span>
              </button>

              <button
                type="button"
                onClick={() => downloadRoutinePDF(routine)}
                className="py-2.5 px-3 rounded-xl bg-zinc-900 hover:bg-black text-white dark:bg-zinc-800 dark:hover:bg-zinc-700 font-bold text-xs flex items-center justify-center gap-2 border border-zinc-700 shadow-xs transition active:scale-95 cursor-pointer"
              >
                <FileText className="w-4 h-4 text-amber-400" />
                <span>পিডিএফ ডাউনলোড (PDF)</span>
              </button>
            </div>
          </div>

          {/* Weekly Routine Day by Day Cards (Clean, no unnecessary warnings) */}
          <div className="space-y-2.5">
            {[0, 1, 2, 4].map(dayIndex => {
              const daySessions = routine
                .filter(s => s.dayIndex === dayIndex)
                .sort((a, b) => a.startTime.localeCompare(b.startTime));
              return (
                <div
                  key={dayIndex}
                  className="bg-white dark:bg-[#121826] border border-zinc-200/90 dark:border-zinc-800/90 rounded-2xl p-3.5 shadow-2xs space-y-2"
                >
                  <div className="flex items-center justify-between pb-1 border-b border-zinc-100 dark:border-zinc-800/80">
                    <span className="font-bold text-xs text-amber-600 dark:text-amber-400">
                      🗓️ {DAY_NAMES_BN[dayIndex]}
                    </span>
                    <span className="text-[11px] text-zinc-500 font-medium">
                      {daySessions.length}টি ক্লাস
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    {daySessions.map(session => (
                      <div
                        key={session.id}
                        className="p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200/60 dark:border-zinc-800/60 flex items-center justify-between text-xs"
                      >
                        <div className="min-w-0 flex-1 pr-2">
                          <span className="font-bold text-amber-600 dark:text-amber-400 font-mono text-[11px]">
                            {session.timeFormatted}
                          </span>
                          <h4 className="font-semibold text-zinc-900 dark:text-white truncate">
                            {session.courseTitleBn}
                          </h4>
                          <p className="text-[11px] text-zinc-500 truncate">
                            {session.teacherName} • {session.courseCode}
                          </p>
                        </div>
                        <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-zinc-200/80 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-bold shrink-0">
                          {session.room}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

        </section>

        {/* ======================================================================= */}
        {/* SECTION 3: COURSES LIST (#section-courses)                              */}
        {/* ======================================================================= */}
        <section id="section-courses" className="space-y-3 scroll-mt-16 pt-2">
          <div className="bg-white dark:bg-[#121826] border border-zinc-200/90 dark:border-zinc-800/90 rounded-2xl p-3.5 shadow-2xs">
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-sm font-bold text-zinc-900 dark:text-white flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4 text-amber-500" />
                <span>কোর্স তালিকা (১ম বর্ষ ১ম সেমিস্টার)</span>
              </h2>
              <span className="text-[11px] font-bold text-amber-600 dark:text-amber-400">
                ৮টি কোর্স
              </span>
            </div>
            <p className="text-[11px] text-zinc-500">
              রাষ্ট্রবিজ্ঞান বিভাগ • ঢাকা সেন্ট্রাল ইউনিভার্সিটি
            </p>
          </div>

          <div className="space-y-2">
            {INITIAL_PS_COURSES.map(course => (
              <div
                key={course.code}
                className="bg-white dark:bg-[#121826] border border-zinc-200/90 dark:border-zinc-800/90 rounded-2xl p-3 shadow-2xs space-y-1 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-xs text-amber-600 dark:text-amber-400">
                    {course.code}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 font-medium">
                    {course.courseType} ({course.credits} ক্রেডিট)
                  </span>
                </div>
                <h4 className="font-bold text-zinc-900 dark:text-white text-xs">
                  {course.titleBn}
                </h4>
                <p className="text-[11px] text-zinc-500">
                  {course.titleEn}
                </p>
                {course.description && (
                  <p className="text-[11px] text-zinc-400 pt-1 border-t border-zinc-100 dark:border-zinc-800/60 leading-relaxed">
                    {course.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* ======================================================================= */}
        {/* SECTION 4: NOTICES BOARD (#section-notices)                             */}
        {/* ======================================================================= */}
        <section id="section-notices" className="space-y-3 scroll-mt-16 pt-2">
          <div className="bg-white dark:bg-[#121826] border border-zinc-200/90 dark:border-zinc-800/90 rounded-2xl p-3.5 shadow-2xs">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-zinc-900 dark:text-white flex items-center gap-1.5">
                <Bell className="w-4 h-4 text-amber-500" />
                <span>ডিপার্টমেন্ট নোটিশ বোর্ড</span>
              </h2>
              <span className="text-[11px] text-zinc-500">{notices.length}টি নোটিশ</span>
            </div>
          </div>

          <div className="space-y-2">
            {notices.map(notice => (
              <div
                key={notice.id}
                className="bg-white dark:bg-[#121826] border border-zinc-200/90 dark:border-zinc-800/90 rounded-2xl p-3.5 shadow-2xs space-y-1.5 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-700 dark:text-amber-400 font-bold text-[10px]">
                    {notice.category}
                  </span>
                  <span className="text-[10px] text-zinc-400">{notice.date}</span>
                </div>
                <h4 className="font-bold text-zinc-900 dark:text-white text-xs leading-snug">
                  {notice.title}
                </h4>
                <p className="text-zinc-600 dark:text-zinc-300 text-[11px] leading-relaxed">
                  {notice.content}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ======================================================================= */}
        {/* SECTION 5: STUDY MATERIALS & BOOKS (#section-materials)                 */}
        {/* ======================================================================= */}
        <section id="section-materials" className="space-y-3 scroll-mt-16 pt-2">
          <div className="bg-white dark:bg-[#121826] border border-zinc-200/90 dark:border-zinc-800/90 rounded-2xl p-3.5 shadow-2xs">
            <h2 className="text-sm font-bold text-zinc-900 dark:text-white flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-amber-500" />
              <span>বই ও স্টাডি মেটেরিয়াল</span>
            </h2>
            <p className="text-[11px] text-zinc-500">
              রাষ্ট্রবিজ্ঞান বিভাগ • ১ম বর্ষ ১ম সেমিস্টার
            </p>
          </div>

          {books.length === 0 ? (
            <div className="bg-white dark:bg-[#121826] border border-zinc-200/90 dark:border-zinc-800/90 rounded-2xl p-8 text-center space-y-3 shadow-2xs">
              <div className="w-12 h-12 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="text-xs font-bold text-zinc-900 dark:text-white">
                কোনো বই বা শিট এখনো যুক্ত করা হয়নি
              </h3>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400 max-w-xs mx-auto leading-relaxed">
                সব ডামি ডাটা মুছে ফেলা হয়েছে। প্রয়োজনীয় বই, লেকচার শিট ও হ্যান্ডনোটের ড্রাইভ লিংক অ্যাডমিন প্যানেল থেকে পরবর্তীতে যুক্ত করা হবে।
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {books.map(b => (
                <div
                  key={b.id}
                  className="bg-white dark:bg-[#121826] border border-zinc-200/90 dark:border-zinc-800/90 rounded-2xl p-3 text-xs flex items-center justify-between"
                >
                  <div>
                    <p className="font-semibold text-zinc-900 dark:text-white">{b.title}</p>
                    <span className="text-[11px] text-zinc-400">{b.courseCode} • {b.author}</span>
                  </div>
                  <a
                    href={b.driveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2.5 py-1 rounded-lg bg-amber-500 text-black text-[11px] font-bold shrink-0 ml-2"
                  >
                    ডাউনলোড
                  </a>
                </div>
              ))}
            </div>
          )}
        </section>

      </main>

      {/* ========================================================================= */}
      {/* Discreet Footer with Secret Admin Dot and Main Site Link                  */}
      {/* ========================================================================= */}
      <footer className="relative z-10 py-6 px-4 text-center text-xs text-zinc-400 dark:text-zinc-600 select-none space-y-2">
        {/* Main Site Return Button (in footer as requested) */}
        <div>
          <button
            type="button"
            onClick={() => navigateTo('home')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-200/60 dark:bg-zinc-800/60 hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs font-medium transition cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>মূল সাইটে ফিরুন (mahims.com)</span>
          </button>
        </div>

        <p className="flex items-center justify-center gap-1 text-[11px]">
          <span>রাষ্ট্রবিজ্ঞান</span>
          <button
            id="ps-secret-admin-dot"
            type="button"
            onClick={() => setIsAdminOpen(true)}
            aria-label="Secret Admin"
            title="•"
            className="w-5 h-5 inline-flex items-center justify-center text-zinc-400 dark:text-zinc-600 hover:text-amber-500 active:scale-90 transition cursor-pointer select-none -mx-0.5"
          >
            •
          </button>
          <span>ঢাকা সেন্ট্রাল ইউনিভার্সিটি</span>
        </p>
      </footer>

      {/* ========================================================================= */}
      {/* 2 WHATSAPP FLOATING BUTTONS (Mahim + CR, Compact with Popup)             */}
      {/* ========================================================================= */}
      <DCUWhatsAppWidget
        mahimWhatsappLink="https://wa.me/@mahim.wp"
        crWhatsappLink=""
        crName="সিআর (ক্লাস প্রতিনিধি)"
      />

      {/* ========================================================================= */}
      {/* BOTTOM NAVIGATION DOCK (5 Clean Buttons - Smoothly Scroll To Section)    */}
      {/* ========================================================================= */}
      <nav
        id="dcu-bottom-dock"
        className="fixed bottom-0 inset-x-0 z-30 bg-white/95 dark:bg-[#0d121f]/95 backdrop-blur-md border-t border-zinc-200/90 dark:border-zinc-800/90 shadow-[0_-4px_20px_rgba(0,0,0,0.06)]"
      >
        <div className="max-w-lg mx-auto grid grid-cols-5 h-14 px-1 items-center">
          
          {/* 1. আজকের ক্লাস */}
          <button
            type="button"
            onClick={() => scrollToSection('today')}
            className={`flex flex-col items-center justify-center h-full transition-all cursor-pointer select-none ${
              activeSection === 'today'
                ? 'text-amber-600 dark:text-amber-400 font-bold'
                : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200'
            }`}
          >
            <Clock className={`w-4 h-4 mb-0.5 transition-transform ${activeSection === 'today' ? 'scale-110 text-amber-500' : ''}`} />
            <span className="text-[10px] tracking-tight">আজকের ক্লাস</span>
          </button>

          {/* 2. রুটিন */}
          <button
            type="button"
            onClick={() => scrollToSection('routine')}
            className={`flex flex-col items-center justify-center h-full transition-all cursor-pointer select-none ${
              activeSection === 'routine'
                ? 'text-amber-600 dark:text-amber-400 font-bold'
                : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200'
            }`}
          >
            <Calendar className={`w-4 h-4 mb-0.5 transition-transform ${activeSection === 'routine' ? 'scale-110 text-amber-500' : ''}`} />
            <span className="text-[10px] tracking-tight">রুটিন</span>
          </button>

          {/* 3. কোর্সসমূহ */}
          <button
            type="button"
            onClick={() => scrollToSection('courses')}
            className={`flex flex-col items-center justify-center h-full transition-all cursor-pointer select-none ${
              activeSection === 'courses'
                ? 'text-amber-600 dark:text-amber-400 font-bold'
                : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200'
            }`}
          >
            <GraduationCap className={`w-4 h-4 mb-0.5 transition-transform ${activeSection === 'courses' ? 'scale-110 text-amber-500' : ''}`} />
            <span className="text-[10px] tracking-tight">কোর্সসমূহ</span>
          </button>

          {/* 4. নোটিশ */}
          <button
            type="button"
            onClick={() => scrollToSection('notices')}
            className={`flex flex-col items-center justify-center h-full transition-all cursor-pointer select-none ${
              activeSection === 'notices'
                ? 'text-amber-600 dark:text-amber-400 font-bold'
                : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200'
            }`}
          >
            <Bell className={`w-4 h-4 mb-0.5 transition-transform ${activeSection === 'notices' ? 'scale-110 text-amber-500' : ''}`} />
            <span className="text-[10px] tracking-tight">নোটিশ</span>
          </button>

          {/* 5. বই ও শিট */}
          <button
            type="button"
            onClick={() => scrollToSection('materials')}
            className={`flex flex-col items-center justify-center h-full transition-all cursor-pointer select-none ${
              activeSection === 'materials'
                ? 'text-amber-600 dark:text-amber-400 font-bold'
                : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200'
            }`}
          >
            <BookOpen className={`w-4 h-4 mb-0.5 transition-transform ${activeSection === 'materials' ? 'scale-110 text-amber-500' : ''}`} />
            <span className="text-[10px] tracking-tight">বই ও শিট</span>
          </button>

        </div>
      </nav>

      {/* ========================================================================= */}
      {/* SECRET ADMIN PANEL MODAL (Triggered via Bottom Dot or 5 Logo Clicks)       */}
      {/* ========================================================================= */}
      <DCUAdminModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        isAuthenticated={isAuthenticated}
        onLogin={handleAdminLogin}
        onLogout={handleAdminLogout}
        notices={notices}
        setNotices={setNotices}
        books={books}
        setBooks={setBooks}
        routine={routine}
        setRoutine={setRoutine}
        subscribers={subscribers}
        setSubscribers={setSubscribers}
        teachers={INITIAL_PS_TEACHERS}
        courses={INITIAL_PS_COURSES}
        googleSheetUrl={googleSheetUrl}
        setGoogleSheetUrl={setGoogleSheetUrl}
        onRefreshGoogleSheet={loadTickerNotices}
      />

    </div>
  );
}

export default PoliticalSciencePage;
