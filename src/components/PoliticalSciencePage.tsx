import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Calendar,
  Clock,
  BookOpen,
  Bell,
  Sun,
  Moon,
  GraduationCap,
  Download,
  FileText,
  Image as ImageIcon,
  ArrowLeft,
  ArrowRight,
  Menu,
  X,
  ChevronDown,
  Building,
  CheckCircle2,
  Sparkles,
  Users,
  Mail,
  Send,
  Check,
  Share2,
  Copy,
  MessageCircle,
  Link,
  Loader2
} from 'lucide-react';
import {
  DCU_LOGOS,
  INITIAL_PS_ROUTINE,
  INITIAL_PS_NOTICES,
  INITIAL_PS_BOOKS,
  INITIAL_PS_SUBSCRIBERS,
  INITIAL_PS_TEACHERS,
  INITIAL_PS_COURSES,
  INITIAL_PS_CRS,
  PSClassSession,
  PSNotice,
  PSBookResource,
  PSSubscriber,
} from '../data/dcuPoliticalScienceData';
import { DCUAdminModal } from './dcu-ps/DCUAdminModal';
import { DCUWhatsAppWidget } from './dcu-ps/DCUWhatsAppWidget';
import {
  TickerNotice,
  DEFAULT_TICKER_NOTICES,
  fetchNoticesFromGoogleSheet,
  fetchFullNoticesFromSource,
  sendSubscriberToGoogleSheet,
  formatNoticeDateShort,
  getNoticeDateSlugBase,
  getNoticeSlugMap,
  getNoticeShareUrl
} from '../utils/googleSheetsNotices';
import { downloadRoutineImage, downloadRoutinePDF } from '../utils/routineExport';
import { navigateTo } from '../utils/navigation';

export type PSTab = 'today' | 'routine' | 'courses' | 'notices' | 'materials' | 'email' | 'teachers';

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

  // Desktop routine download dropdown state
  const [isDownloadOpen, setIsDownloadOpen] = useState(false);
  const downloadRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (downloadRef.current && !downloadRef.current.contains(e.target as Node)) {
        setIsDownloadOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Active section tracked via scroll / buttons
  const [activeSection, setActiveSection] = useState<PSTab>('today');

  // State loaded from localStorage with initial fallbacks
  const [routine, setRoutine] = useState<PSClassSession[]>(() => {
    const saved = localStorage.getItem('dcu_ps_routine');
    return saved ? JSON.parse(saved) : INITIAL_PS_ROUTINE;
  });

  const [notices, setNotices] = useState<PSNotice[]>(() => {
    try {
      localStorage.removeItem('dcu_ps_notices');
      localStorage.removeItem('dcu_ps_notices_v4');
      const saved = localStorage.getItem('dcu_ps_notices_v5');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // ignore
    }
    return [];
  });

  const [books, setBooks] = useState<PSBookResource[]>(() => {
    try {
      localStorage.removeItem('dcu_ps_books');
      localStorage.removeItem('dcu_ps_books_v4');
      const saved = localStorage.getItem('dcu_ps_books_v5');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // ignore
    }
    return [];
  });

  const [subscribers, setSubscribers] = useState<PSSubscriber[]>(() => {
    const saved = localStorage.getItem('dcu_ps_subscribers');
    return saved ? JSON.parse(saved) : INITIAL_PS_SUBSCRIBERS;
  });

  // Email Notification & Update Form State
  const [subName, setSubName] = useState('');
  const [subEmail, setSubEmail] = useState('');
  const [subStudentId, setSubStudentId] = useState('');
  const [subStatus, setSubStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [isCopiedShareLink, setIsCopiedShareLink] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = subName.trim();
    const cleanEmail = subEmail.trim();

    if (!cleanName || !cleanEmail) {
      setSubStatus({ type: 'error', message: 'অনুগ্রহ করে আপনার নাম ও ইমেইল এড্রেস প্রদান করুন।' });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      setSubStatus({ type: 'error', message: 'অনুগ্রহ করে একটি সঠিক ইমেইল এড্রেস লিখুন (যেমন: name@gmail.com)।' });
      return;
    }

    const alreadyExists = subscribers.some(s => s.email.toLowerCase() === cleanEmail.toLowerCase());
    if (alreadyExists) {
      setSubStatus({ type: 'error', message: 'এই ইমেইলটি ইতিমধ্যে নিবন্ধিত রয়েছে।' });
      return;
    }

    const newSubscriber: PSSubscriber = {
      id: `sub-${Date.now()}`,
      name: cleanName,
      email: cleanEmail,
      studentId: subStudentId.trim() || undefined,
      subscribedAt: new Date().toISOString().split('T')[0]
    };

    setSubscribers(prev => [newSubscriber, ...prev]);
    
    // If Google Apps Script Web App is connected, sync subscriber directly to Google Sheet
    if (googleSheetUrl && googleSheetUrl.includes('script.google.com')) {
      sendSubscriberToGoogleSheet(googleSheetUrl, cleanName, cleanEmail, subStudentId.trim() || undefined);
    }

    setSubStatus({
      type: 'success',
      message: '✅ সফলভাবে নিবন্ধিত হয়েছে! যেকোনো জরুরি নোটিশ বা ক্লাস আপডেট এই ইমেইলে জানিয়ে দেওয়া হবে।'
    });
    setSubName('');
    setSubEmail('');
    setSubStudentId('');
  };

  const handleCopyFormLink = () => {
    const link = `${window.location.origin}/ps#section-email`;
    navigator.clipboard.writeText(link).then(() => {
      setIsCopiedShareLink(true);
      setTimeout(() => setIsCopiedShareLink(false), 2500);
    });
  };

  // Google Apps Script Web App / Sheet URL state (defaulted to user's live Web App)
  const DEFAULT_WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbxCTkqiq--KwNzefsunGPZayldyo5Eo6cSx7wcG0hFGPBr93tCdbzJB7F5xK2ygBrFI/exec';

  const [googleSheetUrl, setGoogleSheetUrl] = useState<string>(() => {
    return localStorage.getItem('dcu_ps_sheets_url') || DEFAULT_WEB_APP_URL;
  });

  const [tickerNotices, setTickerNotices] = useState<TickerNotice[]>(DEFAULT_TICKER_NOTICES);

  // Notice Slug Mapping & Modal View
  const noticeSlugMap = useMemo(() => {
    return getNoticeSlugMap(notices);
  }, [notices]);

  // Extract notice slug from URL path (/ps/notices/:slug) or query (?notice=:slug)
  const extractTargetNoticeSlug = (): string => {
    if (typeof window === 'undefined') return '';
    const pathname = window.location.pathname;
    const search = window.location.search;

    const match = pathname.match(/\/(?:ps|dcups|political-science|dcu-ps)\/notices\/([^/?#]+)/i);
    if (match && match[1]) {
      return decodeURIComponent(match[1]).trim();
    }
    const params = new URLSearchParams(search);
    const queryNotice = params.get('notice');
    if (queryNotice) {
      return decodeURIComponent(queryNotice).trim();
    }
    return '';
  };

  // Find notice by slug or ID with flexible date normalization
  const findNoticeBySlugOrId = (items: PSNotice[], targetSlug: string): PSNotice | null => {
    if (!targetSlug || items.length === 0) return null;
    const cleanTarget = targetSlug.toLowerCase().trim();
    const slugMap = getNoticeSlugMap(items);

    // 1. Exact slug or ID match
    let found = items.find(n => {
      const slug = slugMap.get(n.id);
      return (
        slug?.toLowerCase() === cleanTarget ||
        n.id.toLowerCase() === cleanTarget
      );
    });
    if (found) return found;

    // 2. Normalized date slug match (e.g. 9-10-2026 vs 09-10-2026)
    const normalizedTarget = cleanTarget.replace(/\b0(\d)/g, '$1');
    found = items.find(n => {
      const slug = slugMap.get(n.id) || '';
      const normalizedSlug = slug.toLowerCase().replace(/\b0(\d)/g, '$1');
      return normalizedSlug === normalizedTarget;
    });
    if (found) return found;

    // 3. Match base date
    found = items.find(n => {
      const baseDate = getNoticeDateSlugBase(n.date).toLowerCase();
      return baseDate === cleanTarget || baseDate.replace(/\b0(\d)/g, '$1') === normalizedTarget;
    });

    return found || null;
  };

  const [selectedNoticeModal, setSelectedNoticeModal] = useState<PSNotice | 'not_found' | null>(null);
  const [isNoticeLoading, setIsNoticeLoading] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return Boolean(extractTargetNoticeSlug());
  });
  const [copiedNoticeId, setCopiedNoticeId] = useState<string | null>(null);

  // Check URL on load and URL change for /ps/notices/:slug or ?notice=:slug
  const checkUrlForNotice = (items = notices) => {
    const targetSlug = extractTargetNoticeSlug();
    if (!targetSlug) {
      setIsNoticeLoading(false);
      return;
    }

    if (items.length > 0) {
      const found = findNoticeBySlugOrId(items, targetSlug);
      if (found) {
        setSelectedNoticeModal(found);
      } else {
        setSelectedNoticeModal('not_found');
      }
      setIsNoticeLoading(false);
    }
  };

  useEffect(() => {
    checkUrlForNotice(notices);
    const handlePopState = () => {
      checkUrlForNotice(notices);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [notices, noticeSlugMap]);

  // Handle dynamic page title, OG image (University Logo) & meta robots
  useEffect(() => {
    const originalTitle = document.title;
    const ogTitle = document.querySelector('meta[property="og:title"]');
    const ogDesc = document.querySelector('meta[property="og:description"]');
    const ogImg = document.querySelector('meta[property="og:image"]');
    const twImg = document.querySelector('meta[name="twitter:image"]');

    const prevOgTitle = ogTitle?.getAttribute('content') || '';
    const prevOgDesc = ogDesc?.getAttribute('content') || '';
    const prevOgImg = ogImg?.getAttribute('content') || '';
    const prevTwImg = twImg?.getAttribute('content') || '';

    // Update with University Logo and Prestigious Department branding (no semester info)
    document.title = 'ঢাকা সেন্ট্রাল ইউনিভার্সিটি | রাষ্ট্রবিজ্ঞান বিভাগ — অফিসিয়াল পোর্টাল';
    if (ogTitle) ogTitle.setAttribute('content', 'ঢাকা সেন্ট্রাল ইউনিভার্সিটি | রাষ্ট্রবিজ্ঞান বিভাগ');
    if (ogDesc) ogDesc.setAttribute('content', 'ঢাকা সেন্ট্রাল ইউনিভার্সিটি রাষ্ট্রবিজ্ঞান বিভাগ অফিসিয়াল ডিজিটাল পোর্টাল — ক্লাস রুটিন ও নোটিশ বোর্ড।');
    if (ogImg) ogImg.setAttribute('content', DCU_LOGOS.university);
    if (twImg) twImg.setAttribute('content', DCU_LOGOS.university);

    return () => {
      document.title = originalTitle;
      if (ogTitle && prevOgTitle) ogTitle.setAttribute('content', prevOgTitle);
      if (ogDesc && prevOgDesc) ogDesc.setAttribute('content', prevOgDesc);
      if (ogImg && prevOgImg) ogImg.setAttribute('content', prevOgImg);
      if (twImg && prevTwImg) twImg.setAttribute('content', prevTwImg);
    };
  }, []);

  // Handle meta robots noindex tag dynamically when viewing a specific notice
  useEffect(() => {
    let metaRobots = document.querySelector('meta[name="robots"]') as HTMLMetaElement | null;
    const isNoticeRoute =
      window.location.pathname.includes('/notices/') ||
      Boolean(selectedNoticeModal);

    if (isNoticeRoute) {
      if (!metaRobots) {
        metaRobots = document.createElement('meta');
        metaRobots.name = 'robots';
        document.head.appendChild(metaRobots);
      }
      metaRobots.content = 'noindex, nofollow';
    } else if (metaRobots && metaRobots.content === 'noindex, nofollow') {
      metaRobots.content = 'index, follow';
    }
  }, [selectedNoticeModal]);

  const handleOpenNotice = (notice: PSNotice) => {
    setSelectedNoticeModal(notice);
    const slug = noticeSlugMap.get(notice.id) || notice.id;
    if (window.history.pushState) {
      window.history.pushState(null, '', `/ps/notices/${slug}`);
    }
  };

  const handleCloseNoticeModal = () => {
    setSelectedNoticeModal(null);
    if (window.history.pushState) {
      window.history.pushState(null, '', '/ps');
    }
  };

  const handleCopyNoticeLink = (notice: PSNotice) => {
    const slug = noticeSlugMap.get(notice.id) || notice.id;
    const url = getNoticeShareUrl(slug);
    navigator.clipboard.writeText(url).then(() => {
      setCopiedNoticeId(notice.id);
      setTimeout(() => setCopiedNoticeId(null), 2500);
    });
  };

  const handleShareNotice = (notice: PSNotice) => {
    const slug = noticeSlugMap.get(notice.id) || notice.id;
    const url = getNoticeShareUrl(slug);
    if (navigator.share) {
      navigator.share({
        title: `${notice.title} — রাষ্ট্রবিজ্ঞান বিভাগ`,
        text: `📢 ${notice.title}\n🗓️ ${formatNoticeDateShort(notice.date)}\n\nবিস্তারিত দেখুন:`,
        url: url
      }).catch(() => {});
    } else {
      handleCopyNoticeLink(notice);
    }
  };

  const getWhatsAppNoticeShareUrl = (notice: PSNotice) => {
    const slug = noticeSlugMap.get(notice.id) || notice.id;
    const url = getNoticeShareUrl(slug);
    const text = `📢 [${notice.category}] ${notice.title}\n🗓️ তারিখ: ${formatNoticeDateShort(notice.date)}\n\nবিবরণ:\n${notice.content.slice(0, 120)}...\n\n👉 নোটিশটি ওয়েবসাইটে দেখুন:\n${url}`;
    return `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
  };

  // Secret Admin Modal state (triggered via bottom dot or 5 logo clicks)
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
    localStorage.setItem('dcu_ps_notices_v5', JSON.stringify(notices));
  }, [notices]);

  useEffect(() => {
    localStorage.setItem('dcu_ps_books_v5', JSON.stringify(books));
  }, [books]);

  useEffect(() => {
    localStorage.setItem('dcu_ps_subscribers', JSON.stringify(subscribers));
  }, [subscribers]);

  useEffect(() => {
    if (googleSheetUrl) {
      localStorage.setItem('dcu_ps_sheets_url', googleSheetUrl);
    }
  }, [googleSheetUrl]);

  // Load Ticker & Main Notices from Google Sheet or fallback
  const loadTickerNotices = async (sheetUrl?: string) => {
    const targetUrl = sheetUrl !== undefined ? sheetUrl : googleSheetUrl;
    let loadedNotices = notices;

    if (targetUrl.trim()) {
      try {
        const result = await fetchFullNoticesFromSource(targetUrl);
        if (result.ticker.length > 0) {
          setTickerNotices(result.ticker);
        }
        if (result.fullNotices.length > 0) {
          loadedNotices = result.fullNotices;
          setNotices(result.fullNotices);
        }
      } catch (err) {
        console.error('Failed to load Google Sheet notices:', err);
      }
    }
    
    // Fallback: use pinned notices from loaded notices
    const pinned = loadedNotices.filter(n => n.pinned).map(n => ({
      id: n.id,
      text: n.title,
      date: n.date
    }));
    if (pinned.length > 0) {
      setTickerNotices(pinned);
    } else if (loadedNotices.length > 0) {
      setTickerNotices(loadedNotices.map(n => ({ id: n.id, text: n.title, date: n.date })));
    } else {
      setTickerNotices([]);
    }

    // Resolve any requested notice slug with newly loaded notices
    const targetSlug = extractTargetNoticeSlug();
    if (targetSlug) {
      const found = findNoticeBySlugOrId(loadedNotices, targetSlug);
      if (found) {
        setSelectedNoticeModal(found);
      } else {
        setSelectedNoticeModal('not_found');
      }
      setIsNoticeLoading(false);
    } else {
      setIsNoticeLoading(false);
    }
  };

  useEffect(() => {
    loadTickerNotices();
  }, [googleSheetUrl]);

  // Secret 5-tap trigger on the university logo to open Admin
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

  // Keyboard shortcut: Ctrl + Alt + Shift + A
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

  // Admin authentication
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

  // In-page smooth scroll with clean URLs (NO '#' hash: /ps, /ps/routine, /ps/courses, etc.)
  const scrollToSection = (tab: PSTab, updateUrl = true) => {
    setActiveSection(tab);
    setIsMenuOpen(false);

    const el = document.getElementById(`section-${tab}`);
    if (el) {
      const topOffset = 70;
      const elementPosition = el.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - topOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      if (updateUrl) {
        const cleanPath = tab === 'today' ? '/ps' : `/ps/${tab}`;
        window.history.replaceState(null, '', cleanPath);
      }
    }
  };

  // Read initial path on mount (support direct paths /ps/routine and preserve notice URLs)
  useEffect(() => {
    const handleInitialPath = () => {
      const pathname = window.location.pathname.replace(/\/+$/, '');
      const search = window.location.search;

      // If URL is for a specific notice (/ps/notices/:slug or ?notice=), DO NOT rewrite URL or erase slug!
      if (
        pathname.match(/\/(?:ps|dcups|political-science|dcu-ps)\/notices\/[^/?#]+/i) ||
        search.includes('notice=')
      ) {
        setActiveSection('notices');
        return;
      }

      const segments = pathname.split('/').filter(Boolean);
      
      let targetTab: PSTab | null = null;
      if (segments.length >= 2 && ['today', 'routine', 'courses', 'notices', 'materials', 'email', 'teachers'].includes(segments[1])) {
        targetTab = segments[1] as PSTab;
      } else if (window.location.hash) {
        const hash = window.location.hash.replace(/^#\/?/, '');
        if (['today', 'routine', 'courses', 'notices', 'materials', 'email', 'teachers'].includes(hash)) {
          targetTab = hash as PSTab;
        }
      }

      if (targetTab) {
        const cleanPath = targetTab === 'today' ? '/ps' : `/ps/${targetTab}`;
        window.history.replaceState(null, '', cleanPath);
        setTimeout(() => {
          scrollToSection(targetTab!, false);
        }, 150);
      }
    };

    handleInitialPath();
    window.addEventListener('popstate', handleInitialPath);
    return () => window.removeEventListener('popstate', handleInitialPath);
  }, []);

  // Track active section as user scrolls and update clean URL without '#'
  useEffect(() => {
    const handleScroll = () => {
      // Do not overwrite URL when viewing a specific notice or modal is open
      if (
        selectedNoticeModal ||
        isNoticeLoading ||
        window.location.pathname.match(/\/(?:ps|dcups|political-science|dcu-ps)\/notices\/[^/?#]+/i) ||
        window.location.search.includes('notice=')
      ) {
        return;
      }

      const sections: PSTab[] = ['today', 'routine', 'courses', 'notices', 'materials', 'email', 'teachers'];
      const scrollPos = window.scrollY + 140;

      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(`section-${sections[i]}`);
        if (el && el.offsetTop <= scrollPos) {
          const tab = sections[i];
          setActiveSection(tab);
          const targetPath = tab === 'today' ? '/ps' : `/ps/${tab}`;
          if (window.location.pathname !== targetPath && !window.location.hash) {
            window.history.replaceState(null, '', targetPath);
          }
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [selectedNoticeModal, isNoticeLoading]);

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

  const navMenuItems = [
    { id: 'routine' as PSTab, label: 'রুটিন', icon: Calendar },
    { id: 'notices' as PSTab, label: 'নোটিশ', icon: Bell },
    { id: 'materials' as PSTab, label: 'বই-শিট', icon: BookOpen },
    { id: 'courses' as PSTab, label: 'কোর্স', icon: GraduationCap },
    { id: 'teachers' as PSTab, label: 'শিক্ষক', icon: Users },
    { id: 'email' as PSTab, label: 'ইমেইল', icon: Mail },
  ];

  return (
    <div className="min-h-screen bg-[#fafaf9] dark:bg-[#090d16] text-zinc-900 dark:text-zinc-100 flex flex-col font-sans transition-colors duration-200 selection:bg-amber-500 selection:text-black relative overflow-x-hidden pb-20 md:pb-10">
      
      {/* Background Subtle Dot Pattern */}
      <div
        className="fixed inset-0 pointer-events-none z-0 opacity-40 dark:opacity-20"
        style={{
          backgroundImage: `radial-gradient(#f97316 0.75px, transparent 0.75px)`,
          backgroundSize: '24px 24px',
        }}
      />

      {/* ========================================================================= */}
      {/* TOP APP BAR (Compact Logo on Left, Desktop Nav, Single Download Button)   */}
      {/* ========================================================================= */}
      {/* TOP APP BAR: PINNED APP-LIKE HEADER ON MOBILE ONLY                        */}
      {/* (PINNED ON MOBILE, NORMAL/RELATIVE ON DESKTOP)                            */}
      {/* ========================================================================= */}
      <header className="fixed top-0 inset-x-0 z-40 md:relative md:top-auto md:inset-auto bg-white/95 dark:bg-[#0d121f]/95 backdrop-blur-md border-b border-zinc-200/90 dark:border-zinc-800/90 shadow-xs">
        <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-2">
          
          {/* Left: University Logo + Title (University Name ON TOP, Department ON BOTTOM) */}
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={handleLogoClick}
              title="ঢাকা সেন্ট্রাল ইউনিভার্সিটি (ট্যাপ করুন)"
              className="relative transition-transform active:scale-95 cursor-pointer shrink-0"
            >
              <img
                src={DCU_LOGOS.university}
                alt="University Logo"
                className="w-9 h-9 object-contain select-none drop-shadow-xs"
              />
            </button>
            <div className="leading-tight text-left">
              <h1 className="text-xs sm:text-sm font-black text-zinc-900 dark:text-zinc-100 tracking-tight">
                ঢাকা সেন্ট্রাল ইউনিভার্সিটি
              </h1>
              <p className="text-[11px] font-bold text-amber-600 dark:text-amber-400 mt-0.5">
                রাষ্ট্রবিজ্ঞান বিভাগ
              </p>
            </div>
          </div>

          {/* Center: Desktop Navigation Bar (Only visible on md/lg screens) */}
          <nav className="hidden md:flex items-center gap-1 bg-zinc-100/80 dark:bg-zinc-800/60 p-1 rounded-xl border border-zinc-200/60 dark:border-zinc-700/60">
            {navMenuItems.map(item => {
              const Icon = item.icon;
              const isActive = item.id === 'routine'
                ? (activeSection === 'routine' || activeSection === 'today')
                : activeSection === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => scrollToSection(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-white dark:bg-zinc-900 text-amber-600 dark:text-amber-400 shadow-xs font-bold'
                      : 'text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-zinc-700/50'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-amber-500' : 'text-zinc-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right: Clean Single Routine Download Dropdown + Theme Toggle + Mobile Menu */}
          <div className="flex items-center gap-2">
            
            {/* Desktop Routine Download: Single clean button with dropdown */}
            <div className="relative hidden md:block" ref={downloadRef}>
              <button
                type="button"
                onClick={() => setIsDownloadOpen(!isDownloadOpen)}
                className="px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-400 text-xs font-bold flex items-center gap-1.5 transition cursor-pointer border border-amber-500/20"
                title="রুটিন ডাউনলোড অপশন"
              >
                <Download className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                <span>ডাউনলোড</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isDownloadOpen ? 'rotate-180' : ''}`} />
              </button>

              {isDownloadOpen && (
                <div className="absolute right-0 mt-1.5 w-44 bg-white dark:bg-[#121826] border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-xl py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <button
                    type="button"
                    onClick={() => {
                      setIsDownloadOpen(false);
                      downloadRoutineImage(routine);
                    }}
                    className="w-full px-3 py-2 text-left text-xs font-semibold text-zinc-700 dark:text-zinc-200 hover:bg-amber-500/10 hover:text-amber-600 dark:hover:text-amber-400 flex items-center gap-2 cursor-pointer transition"
                  >
                    <ImageIcon className="w-4 h-4 text-amber-500" />
                    <span>ছবি (PNG) ডাউনলোড</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsDownloadOpen(false);
                      downloadRoutinePDF(routine);
                    }}
                    className="w-full px-3 py-2 text-left text-xs font-semibold text-zinc-700 dark:text-zinc-200 hover:bg-amber-500/10 hover:text-amber-600 dark:hover:text-amber-400 flex items-center gap-2 cursor-pointer transition border-t border-zinc-100 dark:border-zinc-800/80"
                  >
                    <FileText className="w-4 h-4 text-amber-500" />
                    <span>পিডিএফ (PDF) ডাউনলোড</span>
                  </button>
                </div>
              )}
            </div>

            {/* Theme Toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="p-1.5 rounded-lg text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition cursor-pointer"
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-zinc-600" />}
            </button>

            {/* Mobile Menu Drawer Button (Only mobile) */}
            <button
              type="button"
              onClick={() => setIsMenuOpen(true)}
              aria-label="Open Menu"
              className="md:hidden p-1.5 rounded-lg text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition cursor-pointer flex items-center gap-1"
            >
              <Menu className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            </button>
          </div>

        </div>
      </header>

      {/* Mobile Top Spacer (only on mobile because top header is fixed pinned on mobile) */}
      <div className="h-14 md:hidden" />

      {/* ========================================================================= */}
      {/* MOBILE APP MENU DRAWER (Slide-out Sheet)                                 */}
      {/* ========================================================================= */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 flex justify-end md:hidden">
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
                    className="w-7 h-7 object-contain"
                  />
                  <div>
                    <h3 className="text-xs font-bold text-zinc-900 dark:text-white">মেনু</h3>
                    <p className="text-[10px] text-zinc-500">রাষ্ট্রবিজ্ঞান বিভাগ</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsMenuOpen(false)}
                  className="p-1 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-white cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation Items */}
              <nav className="mt-4 space-y-1">
                {navMenuItems.map(item => {
                  const Icon = item.icon;
                  const isActive = item.id === 'routine'
                    ? (activeSection === 'routine' || activeSection === 'today')
                    : activeSection === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => scrollToSection(item.id)}
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
                className="w-full py-2 px-3 rounded-xl bg-zinc-100 dark:bg-zinc-800/80 text-zinc-700 dark:text-zinc-300 text-xs font-medium flex items-center justify-center gap-1.5 hover:bg-zinc-200 transition cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>মূল সাইটে যান (mahims.com)</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* HERO SECTION: CENTERED LOGO + NAMES & PC TOP-RIGHT NOTICE                */}
      {/* ========================================================================= */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-3">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          
          {/* Desktop Left Spacer (Hidden on mobile) so Center Branding stays dead-center */}
          <div className="hidden md:block md:col-span-3 lg:col-span-3" />

          {/* Center Branding: University Logo, University Name & Department Name */}
          <div className="md:col-span-6 lg:col-span-6 text-center flex flex-col items-center justify-center">
            <button
              type="button"
              onClick={handleLogoClick}
              title="ঢাকা সেন্ট্রাল ইউনিভার্সিটি (ট্যাপ করুন)"
              className="inline-block transition-transform active:scale-95 cursor-pointer focus:outline-hidden"
            >
              <img
                src={DCU_LOGOS.university}
                alt="ঢাকা সেন্ট্রাল ইউনিভার্সিটি"
                className="w-16 h-16 sm:w-20 sm:h-20 object-contain mx-auto select-none drop-shadow-md hover:opacity-95 transition-opacity"
              />
            </button>
            <div className="mt-2 text-center">
              <h1 className="text-base sm:text-lg md:text-xl font-black text-zinc-900 dark:text-white tracking-tight">
                ঢাকা সেন্ট্রাল ইউনিভার্সিটি
              </h1>
              <p className="text-xs sm:text-sm font-bold text-amber-600 dark:text-amber-400 mt-0.5">
                রাষ্ট্রবিজ্ঞান বিভাগ
              </p>
            </div>
          </div>

          {/* Top Right on PC (or below logo on Mobile): Notice Widget */}
          <div className="md:col-span-3 lg:col-span-3 w-full">
            <div className="bg-amber-500/10 dark:bg-amber-950/30 border-2 border-amber-500/70 dark:border-amber-500/50 rounded-2xl p-3 shadow-xs flex flex-col justify-between">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-amber-500/20">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                    জরুরি নোটিশ
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => scrollToSection('notices')}
                  className="text-[11px] font-bold text-amber-700 dark:text-amber-400 hover:underline cursor-pointer flex items-center gap-0.5"
                >
                  <span>সব নোটিশ</span>
                  <ArrowLeft className="w-3 h-3 rotate-270" />
                </button>
              </div>

              {/* Notice Content / Single Urgent Notice with Smooth Horizontal Text Scroll */}
              <div className="text-xs overflow-hidden">
                {tickerNotices.length > 0 ? (
                  (() => {
                    const t = tickerNotices[0];
                    const fullNotice = notices.find(n => n.id === t.id || n.title === t.text);
                    const displayText = fullNotice?.content
                      ? `${t.text} — ${fullNotice.content}`
                      : t.text;
                    const dateFormatted = t.date ? ` (${formatNoticeDateShort(t.date)})` : '';
                    const fullTickerString = `📢 ${displayText}${dateFormatted}   •   `;

                    return (
                      <div className="flex items-center justify-between gap-2.5 py-1 min-h-[38px]">
                        {/* Smooth Horizontally Scrolling Text Container */}
                        <div
                          onClick={() => fullNotice ? handleOpenNotice(fullNotice) : scrollToSection('notices')}
                          className="flex-1 min-w-0 overflow-hidden cursor-pointer relative py-0.5"
                          title="সম্পূর্ণ নোটিশ পড়তে ক্লিক করুন"
                        >
                          <div className="w-full overflow-hidden whitespace-nowrap">
                            <div className="animate-ticker-scroll inline-block text-zinc-900 dark:text-zinc-100 font-medium hover:text-amber-600 dark:hover:text-amber-400 transition-colors">
                              <span className="font-bold text-amber-700 dark:text-amber-400 mr-2">
                                📢 {t.text}
                              </span>
                              {fullNotice?.content && (
                                <span className="text-zinc-700 dark:text-zinc-300 mr-3">
                                  — {fullNotice.content}
                                </span>
                              )}
                              {t.date && (
                                <span className="text-[10px] text-amber-600 dark:text-amber-400 font-bold mr-6">
                                  [{formatNoticeDateShort(t.date)}]
                                </span>
                              )}
                              {/* Repeated for seamless loop */}
                              <span className="font-bold text-amber-700 dark:text-amber-400 mr-2">
                                📢 {t.text}
                              </span>
                              {fullNotice?.content && (
                                <span className="text-zinc-700 dark:text-zinc-300 mr-3">
                                  — {fullNotice.content}
                                </span>
                              )}
                              {t.date && (
                                <span className="text-[10px] text-amber-600 dark:text-amber-400 font-bold mr-6">
                                  [{formatNoticeDateShort(t.date)}]
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Direct Detailed View Action Button */}
                        <button
                          type="button"
                          onClick={() => fullNotice ? handleOpenNotice(fullNotice) : scrollToSection('notices')}
                          className="text-[11px] font-bold text-amber-800 dark:text-amber-300 hover:text-amber-950 dark:hover:text-white shrink-0 flex items-center gap-1 cursor-pointer bg-amber-500/20 hover:bg-amber-500/30 px-2.5 py-1 rounded-lg border border-amber-500/30 transition active:scale-95 shadow-2xs"
                        >
                          <span>বিস্তারিত</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    );
                  })()
                ) : (
                  <div className="py-2 text-zinc-500 dark:text-zinc-400 text-center text-xs">
                    আপাতত কোনো জরুরি নোটিশ নেই
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ========================================================================= */}
      {/* MAIN CONTENT AREA - FULLY BALANCED & OPTIMIZED FOR PC & MOBILE             */}
      {/* ========================================================================= */}
      <main className="relative z-10 flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* ======================================================================= */}
        {/* TOP ROW: TODAY'S CLASS STATUS (LEFT) & DAY PICKER (RIGHT) - BALANCED PC */}
        {/* ======================================================================= */}
        <section id="section-today" className="grid grid-cols-1 md:grid-cols-2 gap-4 scroll-mt-20">
          
          {/* Card 1: Today's Class Status */}
          <div className="bg-white dark:bg-[#121826] border border-zinc-200/90 dark:border-zinc-800/90 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3 pb-2.5 border-b border-zinc-100 dark:border-zinc-800/80">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping" />
                  <h2 className="text-xs sm:text-sm font-bold text-zinc-900 dark:text-white uppercase tracking-wider">
                    {isTodayClassDay ? `আজকের ক্লাস (${DAY_NAMES_BN[currentDayIndex]})` : `আজ ছুটি (${DAY_NAMES_BN[currentDayIndex]})`}
                  </h2>
                </div>
                <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300">
                  {isTodayClassDay ? `${todaySessions.length}টি ক্লাস` : 'ক্লাস বিরতি'}
                </span>
              </div>

              {/* Today's Schedule Cards */}
              {isTodayClassDay && todaySessions.length > 0 ? (
                <div className="space-y-2">
                  {todaySessions.map((session, idx) => {
                    const status = getClassSessionStatus(session, currentDayIndex, now);
                    const isLive = status === 'live';
                    return (
                      <div
                        key={session.id}
                        className={`p-3 rounded-xl border transition-all flex items-center justify-between text-xs ${
                          isLive
                            ? 'bg-amber-500/10 border-amber-500/40 text-zinc-900 dark:text-white ring-1 ring-amber-500/30'
                            : 'bg-zinc-50/70 dark:bg-zinc-900/50 border-zinc-200/70 dark:border-zinc-800/70 text-zinc-800 dark:text-zinc-200'
                        }`}
                      >
                        <div className="flex-1 min-w-0 pr-2">
                          <div className="flex items-center gap-1.5 mb-1">
                            <span className="font-bold text-xs text-amber-600 dark:text-amber-400 font-mono">
                              {session.timeFormatted}
                            </span>
                            {isLive && (
                              <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-emerald-500 text-white animate-pulse">
                                চলমান ক্লাস
                              </span>
                            )}
                            {idx === 0 && session.dayIndex === 0 && (
                              <span className="text-[9px] font-medium px-1.5 py-0.2 rounded bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300">
                                ১০:৪৫ ১ম ক্লাস
                              </span>
                            )}
                          </div>
                          <h4 className="font-semibold text-xs sm:text-sm truncate text-zinc-900 dark:text-zinc-100">
                            {session.courseTitleBn}
                          </h4>
                          <p className="text-[11px] text-zinc-500 dark:text-zinc-400 truncate">
                            {session.teacherName} • {session.courseCode}
                          </p>
                        </div>

                        <div className="shrink-0 text-right">
                          <span className="text-xs font-bold font-mono px-2.5 py-1 rounded-lg bg-zinc-200/80 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200">
                            {session.room}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                /* Off-day Card with Next Class info directly displayed */
                <div className="p-4 rounded-xl bg-zinc-50/80 dark:bg-zinc-900/40 border border-zinc-200/70 dark:border-zinc-800/70 text-center space-y-3 my-auto">
                  <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 font-medium">
                    {currentDayIndex === 3 ? 'আজ বুধবার — সাপ্তাহিক ক্লাস বিরতি' : 'আজ কোনো ক্লাস নেই'}
                  </p>
                  {nextClassInfo && (
                    <div className="pt-3 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between text-left text-xs">
                      <div>
                        <span className="text-[10px] text-amber-600 dark:text-amber-400 font-bold block">
                          পরবর্তী ক্লাসের দিন
                        </span>
                        <span className="font-bold text-zinc-900 dark:text-white">
                          {nextClassInfo.dayName} ({nextClassInfo.session.startTime} এ ১ম ক্লাস)
                        </span>
                        <p className="text-[11px] text-zinc-500 truncate max-w-[200px] sm:max-w-xs">
                          {nextClassInfo.session.courseTitleBn}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedDay(nextClassInfo.session.dayIndex);
                          scrollToSection('routine');
                        }}
                        className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-amber-500 hover:bg-amber-600 text-black transition cursor-pointer shrink-0 shadow-xs"
                      >
                        রুটিন দেখুন
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Card 2: Day-Wise Quick Class Filter */}
          <div className="bg-white dark:bg-[#121826] border border-zinc-200/90 dark:border-zinc-800/90 rounded-2xl p-4 sm:p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs sm:text-sm font-bold text-zinc-900 dark:text-white flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-amber-500" />
                <span>দিনভিত্তিক ক্লাস বাছাই</span>
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
            <div className="space-y-2 pt-1">
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
        {/* SECTION 2: NOTICES BOARD (#section-notices) - HIGH VISIBILITY FULL WIDTH */}
        {/* ======================================================================= */}
        <section id="section-notices" className="space-y-3 scroll-mt-20">
          <div className="bg-gradient-to-r from-amber-500/15 via-white to-amber-500/10 dark:from-amber-950/40 dark:via-[#121826] dark:to-transparent border-2 border-amber-500/40 dark:border-amber-500/30 rounded-2xl p-4 sm:p-5 shadow-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-500 text-black flex items-center justify-center font-bold">
                  <Bell className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-sm sm:text-base font-extrabold text-zinc-900 dark:text-white flex items-center gap-2">
                    <span>ডিপার্টমেন্ট নোটিশ বোর্ড</span>
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping" />
                  </h2>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    সর্বশেষ অফিশিয়াল নির্দেশনা ও ঘোষণা
                  </p>
                </div>
              </div>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-500/20 text-amber-800 dark:text-amber-300">
                {notices.length}টি নোটিশ
              </span>
            </div>
          </div>

          {/* Responsive Notice Cards: 2 Columns on desktop, 1 on mobile */}
          {notices.length === 0 ? (
            <div className="bg-white dark:bg-[#121826] border border-zinc-200/90 dark:border-zinc-800/90 rounded-2xl p-8 text-center space-y-2.5 shadow-xs">
              <div className="w-12 h-12 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto">
                <Bell className="w-6 h-6" />
              </div>
              <h3 className="text-xs sm:text-sm font-bold text-zinc-900 dark:text-white">
                কোনো নতুন নোটিশ নেই
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-md mx-auto leading-relaxed">
                সব ডামি নোটিশ মুছে ফেলা হয়েছে। আপনি পরবর্তীতে এডমিন প্যানেল বা গুগল শিট থেকে যে নোটিশ যুক্ত করবেন কেবল সেগুলোই এখানে দেখা যাবে।
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {notices.map(notice => {
                const isCopied = copiedNoticeId === notice.id;
                return (
                  <div
                    key={notice.id}
                    className="bg-white dark:bg-[#121826] border border-zinc-200/90 dark:border-zinc-800/90 rounded-2xl p-4 sm:p-5 shadow-xs space-y-3 text-xs transition hover:border-amber-500/40 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="px-2.5 py-0.5 rounded-md bg-amber-500/15 text-amber-800 dark:text-amber-300 font-bold text-[11px] border border-amber-500/20">
                          {notice.category}
                        </span>
                        <span className="text-[11px] text-zinc-500 dark:text-zinc-400 font-semibold">
                          🗓️ {formatNoticeDateShort(notice.date)}
                        </span>
                      </div>
                      <h3
                        onClick={() => handleOpenNotice(notice)}
                        className="font-bold text-zinc-900 dark:text-white text-xs sm:text-sm leading-snug cursor-pointer hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
                      >
                        {notice.title}
                      </h3>
                      <p className="text-zinc-600 dark:text-zinc-300 text-xs leading-relaxed pt-1.5 line-clamp-3">
                        {notice.content}
                      </p>
                    </div>

                    {/* Notice Card Action Row */}
                    <div className="pt-2.5 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={() => handleOpenNotice(notice)}
                        className="px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-800 dark:text-amber-300 font-bold text-xs flex items-center gap-1.5 transition active:scale-95 cursor-pointer"
                      >
                        <span>সম্পূর্ণ পড়ুন</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>

                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleCopyNoticeLink(notice)}
                          className="px-2.5 py-1.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 font-semibold text-xs flex items-center gap-1 transition active:scale-95 cursor-pointer"
                          title="লিঙ্ক কপি করুন"
                        >
                          {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{isCopied ? 'কপি হয়েছে' : 'লিঙ্ক'}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleShareNotice(notice)}
                          className="p-1.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 transition active:scale-95 cursor-pointer"
                          title="শেয়ার করুন"
                        >
                          <Share2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* ======================================================================= */}
        {/* SECTION 3: FULL WEEKLY ROUTINE (#section-routine) - 4 COLS ON DESKTOP   */}
        {/* ======================================================================= */}
        <section id="section-routine" className="space-y-3.5 scroll-mt-20">
          <div className="bg-white dark:bg-[#121826] border border-zinc-200/90 dark:border-zinc-800/90 rounded-2xl p-4 sm:p-5 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-sm sm:text-base font-bold text-zinc-900 dark:text-white flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-amber-500" />
                  <span>পূর্ণাঙ্গ সাপ্তাহিক ক্লাস রুটিন</span>
                </h2>
                <p className="text-xs text-zinc-500">
                  রুম ৩০২ • রাষ্ট্রবিজ্ঞান বিভাগ
                </p>
              </div>

              {/* Routine Export Buttons */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => downloadRoutineImage(routine)}
                  className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-black font-bold text-xs flex items-center gap-1.5 shadow-xs transition active:scale-95 cursor-pointer"
                >
                  <ImageIcon className="w-3.5 h-3.5" />
                  <span>ছবি ডাউনলোড (PNG)</span>
                </button>
                <button
                  type="button"
                  onClick={() => downloadRoutinePDF(routine)}
                  className="px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-black text-white dark:bg-zinc-800 dark:hover:bg-zinc-700 font-bold text-xs flex items-center gap-1.5 border border-zinc-700 shadow-xs transition active:scale-95 cursor-pointer"
                >
                  <FileText className="w-3.5 h-3.5 text-amber-400" />
                  <span>পিডিএফ (PDF)</span>
                </button>
              </div>
            </div>
          </div>

          {/* 4 Days Displayed in Clean 4-Column Grid on Desktop, 2 on Tablet, 1 on Mobile */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {[0, 1, 2, 4].map(dayIndex => {
              const daySessions = routine
                .filter(s => s.dayIndex === dayIndex)
                .sort((a, b) => a.startTime.localeCompare(b.startTime));
              return (
                <div
                  key={dayIndex}
                  className="bg-white dark:bg-[#121826] border border-zinc-200/90 dark:border-zinc-800/90 rounded-2xl p-3.5 shadow-xs space-y-2.5 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between pb-2 mb-2 border-b border-zinc-100 dark:border-zinc-800/80">
                      <span className="font-bold text-xs sm:text-sm text-amber-600 dark:text-amber-400">
                        🗓️ {DAY_NAMES_BN[dayIndex]}
                      </span>
                      <span className="text-[11px] text-zinc-500 font-medium">
                        {daySessions.length}টি ক্লাস
                      </span>
                    </div>

                    <div className="space-y-2">
                      {daySessions.map(session => (
                        <div
                          key={session.id}
                          className="p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200/60 dark:border-zinc-800/60 flex items-center justify-between text-xs"
                        >
                          <div className="min-w-0 flex-1 pr-1.5">
                            <span className="font-bold text-amber-600 dark:text-amber-400 font-mono text-[11px] block">
                              {session.timeFormatted}
                            </span>
                            <h4 className="font-semibold text-zinc-900 dark:text-white truncate">
                              {session.courseTitleBn}
                            </h4>
                            <p className="text-[10px] text-zinc-500 truncate">
                              {session.teacherName}
                            </p>
                          </div>
                          <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-zinc-200/80 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-bold shrink-0">
                            {session.room}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ======================================================================= */}
        {/* SECTION 4: COURSES LIST (#section-courses) - 4 COLS ON DESKTOP          */}
        {/* ======================================================================= */}
        <section id="section-courses" className="space-y-3.5 scroll-mt-20">
          <div className="bg-white dark:bg-[#121826] border border-zinc-200/90 dark:border-zinc-800/90 rounded-2xl p-4 sm:p-5 shadow-xs">
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-sm sm:text-base font-bold text-zinc-900 dark:text-white flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4 text-amber-500" />
                <span>কোর্স তালিকা (১ম বর্ষ ১ম সেমিস্টার)</span>
              </h2>
              <span className="text-xs font-bold text-amber-600 dark:text-amber-400">
                ৮টি কোর্স
              </span>
            </div>
            <p className="text-xs text-zinc-500">
              রাষ্ট্রবিজ্ঞান বিভাগ • ঢাকা সেন্ট্রাল ইউনিভার্সিটি
            </p>
          </div>

          {/* 4 Columns on desktop, 2 on tablet, 1 on mobile */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {INITIAL_PS_COURSES.map(course => (
              <div
                key={course.code}
                className="bg-white dark:bg-[#121826] border border-zinc-200/90 dark:border-zinc-800/90 rounded-2xl p-3.5 shadow-xs space-y-1.5 text-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-xs text-amber-600 dark:text-amber-400">
                      {course.code}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 font-medium">
                      {course.courseType} ({course.credits} ক্রেডিট)
                    </span>
                  </div>
                  <h4 className="font-bold text-zinc-900 dark:text-white text-xs sm:text-sm pt-0.5">
                    {course.titleBn}
                  </h4>
                  <p className="text-[11px] text-zinc-500">
                    {course.titleEn}
                  </p>
                </div>

                {course.description && (
                  <p className="text-[11px] text-zinc-400 pt-1.5 border-t border-zinc-100 dark:border-zinc-800/60 leading-relaxed">
                    {course.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* ======================================================================= */}
        {/* SECTION 5: STUDY MATERIALS & BOOKS (#section-materials)                 */}
        {/* ======================================================================= */}
        <section id="section-materials" className="space-y-3.5 scroll-mt-20">
          <div className="bg-white dark:bg-[#121826] border border-zinc-200/90 dark:border-zinc-800/90 rounded-2xl p-4 sm:p-5 shadow-xs">
            <div className="flex items-center justify-between">
              <h2 className="text-sm sm:text-base font-bold text-zinc-900 dark:text-white flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-amber-500" />
                <span>বই ও স্টাডি মেটেরিয়াল</span>
              </h2>
              <span className="text-xs text-zinc-500">১ম বর্ষ ১ম সেমিস্টার</span>
            </div>
          </div>

          {books.length === 0 ? (
            <div className="bg-white dark:bg-[#121826] border border-zinc-200/90 dark:border-zinc-800/90 rounded-2xl p-8 text-center space-y-3 shadow-xs">
              <div className="w-12 h-12 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="text-xs sm:text-sm font-bold text-zinc-900 dark:text-white">
                কোনো বই বা শিট এখনো যুক্ত করা হয়নি
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-md mx-auto leading-relaxed">
                সব ডামি লিংক মুছে ফেলা হয়েছে। আপনি পরবর্তীতে যে বই বা শিটের ড্রাইভ লিংক যুক্ত করবেন কেবল সেগুলোই এখানে দেখা যাবে।
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {books.map(b => (
                <div
                  key={b.id}
                  className="bg-white dark:bg-[#121826] border border-zinc-200/90 dark:border-zinc-800/90 rounded-2xl p-3.5 text-xs flex items-center justify-between"
                >
                  <div>
                    <p className="font-semibold text-zinc-900 dark:text-white">{b.title}</p>
                    <span className="text-[11px] text-zinc-400">{b.courseCode} • {b.author}</span>
                  </div>
                  <a
                    href={b.driveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2.5 py-1 rounded-lg bg-amber-500 text-black text-[11px] font-bold shrink-0 ml-2 cursor-pointer"
                  >
                    ডাউনলোড
                  </a>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* ======================================================================= */}
        {/* SECTION 6: EMAIL NOTIFICATIONS & UPDATES (#section-email)                */}
        {/* ======================================================================= */}
        <section id="section-email" className="space-y-4 scroll-mt-20">
          <div className="bg-gradient-to-br from-amber-500/10 via-white dark:via-[#121826] to-emerald-500/5 dark:to-[#121826] border border-amber-500/30 dark:border-amber-500/20 rounded-2xl p-4 sm:p-6 shadow-sm">
            
            {/* Header with Share Button */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-zinc-200/80 dark:border-zinc-800/80">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500 text-zinc-950 flex items-center justify-center shrink-0 shadow-xs font-bold">
                  <Mail className="w-5 h-5 text-zinc-950" />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-white flex items-center gap-2">
                    <span>জরুরি নোটিশ ও ক্লাস আপডেট ইমেইলে পান</span>
                  </h2>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                    নতুন কোনো নোটিশ, পরীক্ষার শিডিউল বা রুটিন পরিবর্তনের আপডেট সবার আগে পেতে আপনার ইমেইল যুক্ত করুন।
                  </p>
                </div>
              </div>

              {/* Share / Copy Link for CR or Classmate */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={handleCopyFormLink}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 hover:text-amber-600 dark:hover:text-amber-400 text-xs font-medium transition cursor-pointer shadow-2xs active:scale-95"
                  title="সহপাঠীদের সাথে শেয়ার করতে ফর্ম লিংক কপি করুন"
                >
                  {isCopiedShareLink ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                      <span className="text-emerald-600 dark:text-emerald-400 font-semibold">লিংক কপি হয়েছে!</span>
                    </>
                  ) : (
                    <>
                      <Share2 className="w-3.5 h-3.5" />
                      <span>ফর্ম লিংক কপি</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Subscription Form */}
            <form onSubmit={handleSubscribe} className="pt-4 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                    আপনার নাম <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={subName}
                    onChange={(e) => setSubName(e.target.value)}
                    placeholder="যেমন: সাকিব হাসান"
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-[#0d121f] border border-zinc-200 dark:border-zinc-700 text-xs text-zinc-900 dark:text-white focus:outline-hidden focus:border-amber-500 transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                    ইমেইল এড্রেস <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={subEmail}
                    onChange={(e) => setSubEmail(e.target.value)}
                    placeholder="example@gmail.com"
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-[#0d121f] border border-zinc-200 dark:border-zinc-700 text-xs text-zinc-900 dark:text-white focus:outline-hidden focus:border-amber-500 transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
                    ক্লাস রোল / আইডি <span className="text-zinc-400 text-[10px]">(ঐচ্ছিক)</span>
                  </label>
                  <input
                    type="text"
                    value={subStudentId}
                    onChange={(e) => setSubStudentId(e.target.value)}
                    placeholder="যেমন: 101 বা PS-25"
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-[#0d121f] border border-zinc-200 dark:border-zinc-700 text-xs text-zinc-900 dark:text-white focus:outline-hidden focus:border-amber-500 transition"
                  />
                </div>
              </div>

              {/* Status Message */}
              {subStatus && (
                <div
                  className={`p-2.5 rounded-xl text-xs font-medium flex items-center gap-2 ${
                    subStatus.type === 'success'
                      ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                      : 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
                  }`}
                >
                  <span>{subStatus.message}</span>
                </div>
              )}

              {/* Submit & Direct Action Row */}
              <div className="flex items-center justify-end gap-2.5 pt-2">
                <a
                  href="mailto:mahimibnkhudi@gmail.com?subject=DCU%20Political%20Science%20Query"
                  className="inline-flex items-center gap-1 px-3.5 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300 text-xs font-medium transition cursor-pointer"
                  title="মাহিমকে সরাসরি ইমেইল পাঠাতে ক্লিক করুন"
                >
                  <span>সরাসরি ইমেইল</span>
                </a>

                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-zinc-950 font-bold text-xs transition active:scale-95 shadow-xs cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>ইমেইল যুক্ত করুন</span>
                </button>
              </div>
            </form>

          </div>
        </section>

        {/* ======================================================================= */}
        {/* SECTION 7: FACULTY MEMBERS / TEACHERS (#section-teachers)               */}
        {/* Placed at the very end as requested: "সবার লাস্টে রাখবা কেউ ইচ্ছা হলে দেখলো আরকি" */}
        {/* ======================================================================= */}
        <section id="section-teachers" className="space-y-3.5 scroll-mt-20">
          <div className="bg-white dark:bg-[#121826] border border-zinc-200/90 dark:border-zinc-800/90 rounded-2xl p-4 sm:p-5 shadow-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-amber-500" />
                <h2 className="text-sm sm:text-base font-bold text-zinc-900 dark:text-white">
                  সম্মানিত শিক্ষকবৃন্দ (Faculty Members)
                </h2>
              </div>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                {INITIAL_PS_TEACHERS.length} জন শিক্ষক
              </span>
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 pt-1">
              রাষ্ট্রবিজ্ঞান বিভাগ • ঢাকা সেন্ট্রাল ইউনিভার্সিটি
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {INITIAL_PS_TEACHERS.map(teacher => (
              <div
                key={teacher.id}
                className="bg-white dark:bg-[#121826] border border-zinc-200/90 dark:border-zinc-800/90 rounded-2xl p-3.5 shadow-xs flex items-center gap-3 transition hover:border-amber-500/40"
              >
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold text-xs flex items-center justify-center shrink-0 border border-amber-500/20 font-mono">
                  {teacher.code}
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="font-bold text-zinc-900 dark:text-white text-xs sm:text-sm truncate">
                    {teacher.name}
                  </h4>
                  <p className="text-[11px] text-amber-600 dark:text-amber-400 font-medium truncate">
                    {teacher.designation}
                  </p>
                  <p className="text-[10px] text-zinc-500 dark:text-zinc-400 truncate">
                    {teacher.department}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

      </main>

      {/* ========================================================================= */}
      {/* BRAND FOOTER (Centered Website Logo + "মাহিমস ডট কম", Discreet Admin Dot)*/}
      {/* ========================================================================= */}
      <footer className="relative z-10 py-10 px-4 text-center select-none space-y-4 max-w-7xl mx-auto w-full">
        {/* Main Website Return Brand Link (Centered Logo + "মাহিমস ডট কম") */}
        <div className="flex flex-col items-center justify-center pt-2">
          <button
            type="button"
            onClick={() => navigateTo('home')}
            className="group inline-flex flex-col items-center justify-center gap-2 cursor-pointer transition-all duration-200 hover:scale-105 active:scale-95 focus:outline-hidden"
            title="মূল ওয়েবসাইট mahims.com-এ যান"
          >
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-white dark:bg-[#121826] p-1.5 border border-zinc-200 dark:border-zinc-800 shadow-sm group-hover:shadow-md group-hover:border-amber-500/50 transition-all flex items-center justify-center">
              <img
                src="/logo.png"
                alt="mahims.com"
                className="w-full h-full object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://res.cloudinary.com/drvyjj7td/image/upload/v1791540199/logo_df1onj.png';
                }}
              />
            </div>
            <div className="flex flex-col items-center">
              <span className="font-bold text-sm sm:text-base text-zinc-800 dark:text-zinc-200 group-hover:text-amber-500 transition-colors">
                মাহিমস ডট কম
              </span>
              <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-mono tracking-wider">
                mahims.com
              </span>
            </div>
          </button>
        </div>

        <p className="flex items-center justify-center gap-1.5 text-xs text-zinc-400 dark:text-zinc-500">
          <span>রাষ্ট্রবিজ্ঞান বিভাগ</span>
          {/* Secret Admin Dot - completely invisible to casual users */}
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
      {/* 2 WHATSAPP FLOATING BUTTONS (Mahim + 2 CRs, Compact with Popup)           */}
      {/* ========================================================================= */}
      <DCUWhatsAppWidget
        mahimWhatsappLink="https://wa.me/@mahim.wp"
        crList={INITIAL_PS_CRS}
      />

      {/* ========================================================================= */}
      {/* MOBILE BOTTOM NAVIGATION DOCK (ONLY ON MOBILE - HIDDEN ON DESKTOP md:)   */}
      {/* ========================================================================= */}
      <nav
        id="dcu-bottom-dock"
        className="md:hidden fixed bottom-0 inset-x-0 z-30 bg-white/95 dark:bg-[#0d121f]/95 backdrop-blur-md border-t border-zinc-200/90 dark:border-zinc-800/90 shadow-[0_-4px_20px_rgba(0,0,0,0.06)]"
      >
        <div className="max-w-md mx-auto grid grid-cols-5 h-14 px-1 items-center">
          
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
      {/* NOTICE LOADING MODAL (WHEN ACCESSED VIA DIRECT LINK)                      */}
      {/* ========================================================================= */}
      {isNoticeLoading && !selectedNoticeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white dark:bg-[#121826] border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 max-w-sm w-full text-center space-y-4 shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto">
              <Loader2 className="w-6 h-6 animate-spin text-amber-500" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base text-zinc-900 dark:text-white">
                নোটিশ লোড হচ্ছে...
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                ঢাকা সেন্ট্রাল ইউনিভার্সিটি নোটিশ বোর্ড থেকে তথ্য সংগ্রহ করা হচ্ছে
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* NOTICE DETAIL / SHARE MODAL (WITH NOINDEX PRESERVED & SAFE SEO)           */}
      {/* ========================================================================= */}
      {selectedNoticeModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
          onClick={handleCloseNoticeModal}
        >
          <div
            className="bg-white dark:bg-[#121826] border border-zinc-200 dark:border-zinc-800 rounded-3xl p-5 sm:p-7 max-w-lg w-full shadow-2xl relative space-y-4 max-h-[90vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            {selectedNoticeModal === 'not_found' ? (
              <div className="text-center py-6 space-y-3">
                <div className="w-14 h-14 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center mx-auto text-2xl">
                  ⚠️
                </div>
                <h3 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-white">
                  নোটিশটি পাওয়া যায়নি বা মেয়াদ শেষ হয়েছে
                </h3>
                <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 max-w-sm mx-auto leading-relaxed">
                  এই নোটিশটির সময়সীমা শেষ হয়েছে অথবা কর্তৃপক্ষ কর্তৃক এটি মুছে ফেলা হয়েছে। চলমান সকল সাম্প্রতিক নোটিশ নিচে দেখতে পারেন।
                </p>
                <div className="pt-3">
                  <button
                    type="button"
                    onClick={() => {
                      handleCloseNoticeModal();
                      scrollToSection('notices');
                    }}
                    className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-black font-bold text-xs transition active:scale-95 cursor-pointer shadow-xs"
                  >
                    চলমান নোটিশগুলো দেখুন
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full bg-amber-500/15 text-amber-800 dark:text-amber-300 font-bold text-xs border border-amber-500/20">
                      🏷️ {selectedNoticeModal.category}
                    </span>
                    <span className="text-xs text-zinc-500 dark:text-zinc-400 font-semibold">
                      🗓️ {formatNoticeDateShort(selectedNoticeModal.date)}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleCloseNoticeModal}
                    className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 flex items-center justify-center text-zinc-600 dark:text-zinc-300 transition cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-3">
                  <h2 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-white leading-snug">
                    {selectedNoticeModal.title}
                  </h2>
                  <div className="p-4 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/50 dark:border-amber-900/40 text-xs sm:text-sm text-zinc-700 dark:text-zinc-200 leading-relaxed whitespace-pre-wrap">
                    {selectedNoticeModal.content}
                  </div>
                </div>

                {/* Share Options */}
                <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider block">
                      নোটিশের স্থায়ী লিঙ্ক ও শেয়ার
                    </span>
                    <span className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold">
                      🔒 No-Index সুরক্ষিত
                    </span>
                  </div>

                  {/* Direct Link Preview Box */}
                  <div className="flex items-center gap-2 p-2 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700/60">
                    <Link className="w-3.5 h-3.5 text-zinc-400 shrink-0 ml-1" />
                    <input
                      type="text"
                      readOnly
                      value={getNoticeShareUrl(noticeSlugMap.get(selectedNoticeModal.id) || selectedNoticeModal.id)}
                      className="bg-transparent text-[11px] font-mono text-zinc-600 dark:text-zinc-300 w-full focus:outline-hidden select-all"
                    />
                    <button
                      type="button"
                      onClick={() => handleCopyNoticeLink(selectedNoticeModal)}
                      className="px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-600 text-black font-bold text-[11px] shrink-0 transition active:scale-95 cursor-pointer flex items-center gap-1"
                    >
                      {copiedNoticeId === selectedNoticeModal.id ? (
                        <>
                          <Check className="w-3 h-3" />
                          <span>কপি হয়েছে</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>কপি</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => handleShareNotice(selectedNoticeModal)}
                      className="px-3 py-2.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 font-bold text-xs flex items-center justify-center gap-2 transition active:scale-95 cursor-pointer"
                    >
                      <Share2 className="w-4 h-4 text-amber-500" />
                      <span>শেয়ার অপশন</span>
                    </button>

                    <a
                      href={getWhatsAppNoticeShareUrl(selectedNoticeModal)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs flex items-center justify-center gap-2 transition active:scale-95 cursor-pointer shadow-xs"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>হোয়াটসঅ্যাপ</span>
                    </a>
                  </div>
                </div>

                <div className="pt-2 text-center">
                  <button
                    type="button"
                    onClick={handleCloseNoticeModal}
                    className="text-xs font-semibold text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300 cursor-pointer"
                  >
                    বন্ধ করুন
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

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
