/**
 * Mahims.com - Live Visitor Analytics & Google Sheets Sync Engine
 * Tracks page visits, device, OS, browser, IP, location, and time spent.
 */

export interface VisitorLogPayload {
  action: 'visitor_log';
  sessionId: string;
  page: string;
  pageTitle?: string;
  ip?: string;
  location?: string;
  device: string;
  os: string;
  browser: string;
  screen: string;
  referrer: string;
  timeSpent: string;
  timestamp: string;
  source: string;
}

interface IpLocation {
  ip: string;
  location: string;
}

let cachedIpLocation: IpLocation | null = null;

// Resolve Client IP and Geolocation silently with fast timeout & caching
export async function getIpAndLocation(): Promise<IpLocation> {
  if (cachedIpLocation) return cachedIpLocation;

  try {
    const stored = sessionStorage.getItem('mahims_cached_ip_data');
    if (stored) {
      cachedIpLocation = JSON.parse(stored);
      return cachedIpLocation!;
    }
  } catch {
    // sessionStorage might be disabled or restricted
  }

  // 1st priority: ipapi.co (Provides IP + City + Country)
  try {
    const res = await fetch('https://ipapi.co/json/', { signal: AbortSignal.timeout(3000) });
    if (res.ok) {
      const data = await res.json();
      const city = data.city || '';
      const country = data.country_name || '';
      const loc = [city, country].filter(Boolean).join(', ') || 'Bangladesh';
      cachedIpLocation = {
        ip: data.ip || 'Unknown',
        location: loc,
      };
      try {
        sessionStorage.setItem('mahims_cached_ip_data', JSON.stringify(cachedIpLocation));
      } catch {
        // ignore
      }
      return cachedIpLocation;
    }
  } catch {
    // Fallback if ipapi is rate-limited or blocked
  }

  // 2nd priority fallback: api.ipify.org
  try {
    const res2 = await fetch('https://api.ipify.org?format=json', { signal: AbortSignal.timeout(2000) });
    if (res2.ok) {
      const data2 = await res2.json();
      cachedIpLocation = {
        ip: data2.ip || 'Unknown',
        location: 'Bangladesh',
      };
      try {
        sessionStorage.setItem('mahims_cached_ip_data', JSON.stringify(cachedIpLocation));
      } catch {
        // ignore
      }
      return cachedIpLocation;
    }
  } catch {
    // ignore
  }

  return { ip: 'Unknown', location: 'Unknown' };
}

// Device detection
export function getDeviceType(): string {
  const ua = navigator.userAgent;
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
    return 'Tablet';
  }
  if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/i.test(ua)) {
    if (/iPhone/i.test(ua)) return 'Mobile (iPhone)';
    if (/Android/i.test(ua)) return 'Mobile (Android)';
    return 'Mobile';
  }
  return 'Desktop / PC';
}

// OS detection
export function getOS(): string {
  const ua = navigator.userAgent;
  if (/Windows NT 10.0/i.test(ua)) return 'Windows 10/11';
  if (/Windows NT 6.3/i.test(ua)) return 'Windows 8.1';
  if (/Windows NT 6.1/i.test(ua)) return 'Windows 7';
  if (/Windows/i.test(ua)) return 'Windows';
  if (/Android/i.test(ua)) return 'Android';
  if (/iPhone|iPad|iPod/i.test(ua)) return 'iOS';
  if (/Mac OS X/i.test(ua)) return 'macOS';
  if (/Linux/i.test(ua)) return 'Linux';
  if (/CrOS/i.test(ua)) return 'ChromeOS';
  return 'Unknown OS';
}

// Browser detection
export function getBrowser(): string {
  const ua = navigator.userAgent;
  if (/Edg\//i.test(ua)) return 'Edge';
  if (/Chrome\//i.test(ua) && !/Edg\//i.test(ua) && !/OPR\//i.test(ua)) return 'Chrome';
  if (/Safari\//i.test(ua) && !/Chrome\//i.test(ua)) return 'Safari';
  if (/Firefox\//i.test(ua)) return 'Firefox';
  if (/OPR\//i.test(ua) || /Opera/i.test(ua)) return 'Opera';
  if (/SamsungBrowser/i.test(ua)) return 'Samsung Internet';
  return 'Browser';
}

// Human-readable duration in Bengali/English
export function formatDuration(ms: number): string {
  const totalSec = Math.max(1, Math.round(ms / 1000));
  if (totalSec < 60) {
    return `${totalSec} সেকেন্ড`;
  }
  const min = Math.floor(totalSec / 60);
  const sec = totalSec % 60;
  if (sec === 0) {
    return `${min} মিনিট`;
  }
  return `${min} মিনিট ${sec} সেকেন্ড`;
}

// Human-friendly page names
export function getReadablePageName(path: string): string {
  if (path === '/' || path === '') return 'হোমপেজ (Home)';
  if (path === '/classroom') return 'মাহিম ক্লাসরুম (Classroom Hub)';
  if (path === '/classroom/courses') return 'ক্লাসরুম কোর্সসমূহ (Courses)';
  if (path === '/classroom/instructor' || path === '/classroom/instructors') return 'শিক্ষক প্যানেল (Instructors)';
  if (path === '/classroom/courses/mentorship') return 'মেন্টরশিপ হাব (Mentorship Hub)';
  if (path.startsWith('/classroom/courses/mentorship/')) return `মেন্টর প্রোফাইল (${path.split('/').pop()})`;
  if (path === '/classroom/courses/octal-1-hsc-ict') return 'অক্টাল ১.০ আইসিটি কোর্স';
  if (path === '/classroom/courses/bangla-boss-2-course') return 'বাংলা বস ২.০ কোর্স';
  if (path.startsWith('/classroom/')) return `ক্লাসরুম শিক্ষক (${path.replace('/classroom/', '')})`;
  if (path === '/chithi') return 'মাহিম চিঠি (Chithi Anonymous)';
  if (path === '/salami') return 'ডিজিটাল সালামি (Salami)';
  if (path === '/blog') return 'ব্লগ ও লেখালেখি (Blog)';
  if (path === '/portfolio' || path === '/about') return 'পোর্টফোলিও / প্রফাইল';
  if (path === '/contact') return 'যোগাযোগ পেজ (Contact)';
  return path;
}

// Core function to send visitor data to Google Sheets Webhook
export function sendVisitorPayload(webhookUrl: string, payload: VisitorLogPayload): void {
  if (!webhookUrl || !webhookUrl.startsWith('http')) return;

  const dataString = JSON.stringify(payload);

  // Use sendBeacon if available (ideal for tab close / navigation without blocking)
  if (typeof navigator !== 'undefined' && navigator.sendBeacon) {
    try {
      const blob = new Blob([dataString], { type: 'text/plain;charset=utf-8' });
      const sent = navigator.sendBeacon(webhookUrl, blob);
      if (sent) return;
    } catch {
      // fallback to fetch
    }
  }

  // Fallback to fetch with keepalive & mode no-cors
  fetch(webhookUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'text/plain;charset=utf-8',
    },
    body: dataString,
    mode: 'no-cors',
    keepalive: true,
  }).catch(() => {
    // Ignore network errors silently for analytics
  });
}

// Generate unique ID per page-view session
function generatePageSessionId(path: string): string {
  const rand = Math.random().toString(36).substring(2, 8);
  return `v_${Date.now().toString(36)}_${rand}_${path.replace(/[^a-z0-9]/gi, '') || 'root'}`;
}

/**
 * Tracks a visitor's visit on a page:
 * - Sends immediate hit with IP, device, OS, browser, location
 * - Pings periodic duration updates (e.g. at 25s, 60s, 120s)
 * - Sends final duration on unload / page exit
 */
export function trackPageView(
  webhookUrl: string | undefined,
  currentPath: string
): () => void {
  // Never log visits on /chithi page
  if (!currentPath || currentPath === '/chithi' || currentPath.startsWith('/chithi')) {
    return () => {};
  }

  // Never send visitor logs to the Chithi webhook
  if (
    !webhookUrl ||
    !webhookUrl.startsWith('http') ||
    webhookUrl.includes('AKfycbwY6kICvCYj4SiRLQ64aPRlB5ThYpRgNVgjsXvBjaHffVbtp0KR3h4zqcX7mdEdCYM07w')
  ) {
    return () => {};
  }

  const startTime = Date.now();
  const sessionId = generatePageSessionId(currentPath);
  const readablePage = getReadablePageName(currentPath);
  const device = getDeviceType();
  const os = getOS();
  const browser = getBrowser();
  const screen = typeof window !== 'undefined' ? `${window.screen.width}x${window.screen.height}` : '';
  const referrer = typeof document !== 'undefined' ? document.referrer || 'সরাসরি (Direct)' : 'Direct';
  const timestamp = new Date().toLocaleString('en-US', { timeZone: 'Asia/Dhaka' });

  // Initial ping as soon as IP/Location is retrieved
  getIpAndLocation().then(ipData => {
    sendVisitorPayload(webhookUrl, {
      action: 'visitor_log',
      sessionId,
      page: readablePage,
      pageTitle: typeof document !== 'undefined' ? document.title : '',
      ip: ipData.ip,
      location: ipData.location,
      device,
      os,
      browser,
      screen,
      referrer,
      timeSpent: 'সক্রিয় রয়েছে (Active)...',
      timestamp,
      source: 'mahims.com',
    });

    addLocalVisitorRecord({
      id: sessionId,
      sessionId,
      page: readablePage,
      ip: ipData.ip,
      location: ipData.location,
      device,
      os,
      browser,
      screen,
      referrer,
      timeSpent: 'সক্রিয় রয়েছে...',
      timestamp,
    });
  });

  // Periodic heartbeat: updates time spent in the sheet every 25 seconds
  const interval = setInterval(() => {
    const elapsed = Date.now() - startTime;
    getIpAndLocation().then(ipData => {
      sendVisitorPayload(webhookUrl, {
        action: 'visitor_log',
        sessionId,
        page: readablePage,
        pageTitle: typeof document !== 'undefined' ? document.title : '',
        ip: ipData.ip,
        location: ipData.location,
        device,
        os,
        browser,
        screen,
        referrer,
        timeSpent: `${formatDuration(elapsed)} (ব্রাউজ করছে)`,
        timestamp,
        source: 'mahims.com',
      });

      addLocalVisitorRecord({
        id: sessionId,
        sessionId,
        page: readablePage,
        ip: ipData.ip,
        location: ipData.location,
        device,
        os,
        browser,
        screen,
        referrer,
        timeSpent: `${formatDuration(elapsed)}`,
        timestamp,
      });
    });
  }, 25000);

  // Send final duration on tab close or page navigation
  const sendFinalExit = () => {
    const totalDuration = Date.now() - startTime;
    sendVisitorPayload(webhookUrl, {
      action: 'visitor_log',
      sessionId,
      page: readablePage,
      pageTitle: typeof document !== 'undefined' ? document.title : '',
      ip: cachedIpLocation?.ip || 'Unknown',
      location: cachedIpLocation?.location || 'Unknown',
      device,
      os,
      browser,
      screen,
      referrer,
      timeSpent: formatDuration(totalDuration),
      timestamp,
      source: 'mahims.com',
    });

    addLocalVisitorRecord({
      id: sessionId,
      sessionId,
      page: readablePage,
      ip: cachedIpLocation?.ip || 'Unknown',
      location: cachedIpLocation?.location || 'Unknown',
      device,
      os,
      browser,
      screen,
      referrer,
      timeSpent: formatDuration(totalDuration),
      timestamp,
    });
  };

  if (typeof window !== 'undefined') {
    window.addEventListener('beforeunload', sendFinalExit);
    window.addEventListener('pagehide', sendFinalExit);
  }

  // Cleanup function for React useEffect
  return () => {
    clearInterval(interval);
    sendFinalExit();
    if (typeof window !== 'undefined') {
      window.removeEventListener('beforeunload', sendFinalExit);
      window.removeEventListener('pagehide', sendFinalExit);
    }
  };
}

// Send a test ping for admin validation
export async function sendTestVisitorPing(
  webhookUrl: string
): Promise<{ success: boolean; message: string }> {
  if (!webhookUrl || !webhookUrl.startsWith('http')) {
    return { success: false, message: 'সঠিক Webhook URL দিন (https://...)' };
  }

  try {
    const ipData = await getIpAndLocation();
    const testPayload: VisitorLogPayload = {
      action: 'visitor_log',
      sessionId: `test_${Date.now()}`,
      page: 'হোমপেজ (টেস্ট পিং / Admin Test)',
      pageTitle: "Mahims.com Admin Test",
      ip: ipData.ip,
      location: ipData.location,
      device: getDeviceType(),
      os: getOS(),
      browser: getBrowser(),
      screen: typeof window !== 'undefined' ? `${window.screen.width}x${window.screen.height}` : '1920x1080',
      referrer: 'এডমিন প্যানেল টেস্ট',
      timeSpent: 'টেস্ট সফল (১ মিনিট)',
      timestamp: new Date().toLocaleString('en-US', { timeZone: 'Asia/Dhaka' }),
      source: 'mahims.com',
    };

    await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify(testPayload),
      mode: 'no-cors',
    });

    addLocalVisitorRecord({
      id: testPayload.sessionId,
      sessionId: testPayload.sessionId,
      page: testPayload.page,
      ip: testPayload.ip || 'Unknown',
      location: testPayload.location || 'Unknown',
      device: testPayload.device,
      os: testPayload.os,
      browser: testPayload.browser,
      screen: testPayload.screen,
      referrer: testPayload.referrer,
      timeSpent: testPayload.timeSpent,
      timestamp: testPayload.timestamp,
    });

    return { success: true, message: 'টেস্ট ভিজিটর ডাটা সফলভাবে গুগল শিটে পাঠানো হয়েছে! আপনার শিট চেক করুন।' };
  } catch (err) {
    return { success: false, message: 'গুগল শিটে পাঠাতে সমস্যা হয়েছে: ' + String(err) };
  }
}

export interface VisitorRecord {
  id?: string;
  timestamp: string;
  page: string;
  ip: string;
  location: string;
  device: string;
  os: string;
  browser: string;
  timeSpent: string;
  referrer: string;
  screen?: string;
  sessionId?: string;
}

export const DEFAULT_MAHIMS_WEBHOOK_URL =
  'https://script.google.com/macros/s/AKfycbyae4Q9cU8n1KRnHlbLgP-tUh4vaGRZRx12NBzNxeWPMSoYJk8HXKsUJ2A00CBKB1qssQ/exec';

const CHITHI_WEBHOOK_URL_GUARD =
  'https://script.google.com/macros/s/AKfycbwY6kICvCYj4SiRLQ64aPRlB5ThYpRgNVgjsXvBjaHffVbtp0KR3h4zqcX7mdEdCYM07w/exec';

const VISITOR_STORAGE_KEY = 'mahims_visitor_records_cache_v1';

export function getStoredVisitors(): VisitorRecord[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(VISITOR_STORAGE_KEY);
    if (!raw) return [];
    const list = JSON.parse(raw);
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}

export function saveStoredVisitors(list: VisitorRecord[]): void {
  if (typeof window === 'undefined') return;
  try {
    // Keep up to 500 recent visits
    const capped = list.slice(0, 500);
    localStorage.setItem(VISITOR_STORAGE_KEY, JSON.stringify(capped));
  } catch {
    // ignore
  }
}

export function clearStoredVisitors(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(VISITOR_STORAGE_KEY);
  } catch {
    // ignore
  }
}

export function addLocalVisitorRecord(record: VisitorRecord): void {
  const current = getStoredVisitors();
  // If session already exists, update it in place
  const existingIdx = current.findIndex(
    r => (record.sessionId && r.sessionId === record.sessionId) ||
         (record.timestamp && r.timestamp === record.timestamp && r.page === record.page)
  );

  if (existingIdx >= 0) {
    current[existingIdx] = { ...current[existingIdx], ...record };
  } else {
    current.unshift(record);
  }
  saveStoredVisitors(current);
}

// Get saved webhook URL from localStorage with default fallback
export function getActiveWebhookUrl(): string {
  try {
    const saved = localStorage.getItem('mahims_site_settings_v1');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (
        parsed.googleSheetWebhookUrl &&
        typeof parsed.googleSheetWebhookUrl === 'string' &&
        parsed.googleSheetWebhookUrl.trim() &&
        parsed.googleSheetWebhookUrl.trim() !== CHITHI_WEBHOOK_URL_GUARD
      ) {
        return parsed.googleSheetWebhookUrl.trim();
      }
    }
  } catch {
    // ignore
  }
  return DEFAULT_MAHIMS_WEBHOOK_URL;
}

// Fetch live visitors from Google Sheet into website
export async function fetchVisitorsFromGoogleSheet(
  webhookUrl?: string
): Promise<{ success: boolean; message: string; visitors: VisitorRecord[]; count: number }> {
  const targetUrl = (webhookUrl && webhookUrl.trim()) || getActiveWebhookUrl();
  if (!targetUrl || !targetUrl.startsWith('http')) {
    return {
      success: false,
      message: 'সঠিক Webhook URL পাওয়া যায়নি।',
      visitors: getStoredVisitors(),
      count: 0,
    };
  }

  // Construct URL with action parameter
  const fetchUrl = targetUrl.includes('?')
    ? `${targetUrl}&action=get_visitors&t=${Date.now()}`
    : `${targetUrl}?action=get_visitors&t=${Date.now()}`;

  try {
    const res = await fetch(fetchUrl, {
      method: 'GET',
    });

    if (!res.ok) {
      return {
        success: false,
        message: `গুগল শিট রেসপন্স করেনি (HTTP ${res.status})`,
        visitors: getStoredVisitors(),
        count: 0,
      };
    }

    const data = await res.json();
    if (data && Array.isArray(data.visitors)) {
      const sheetList: Array<Record<string, unknown>> = data.visitors;
      const formatted: VisitorRecord[] = sheetList.map((item, idx) => ({
        id: String(item.sessionId || `sheet_${idx}_${Date.now()}`),
        timestamp: String(item.timestamp || new Date().toLocaleString('en-US', { timeZone: 'Asia/Dhaka' })),
        page: String(item.page || '/'),
        ip: String(item.ip || 'Unknown'),
        location: String(item.location || 'Unknown'),
        device: String(item.device || 'Desktop'),
        os: String(item.os || 'Windows'),
        browser: String(item.browser || 'Chrome'),
        timeSpent: String(item.timeSpent || 'সক্রিয়...'),
        referrer: String(item.referrer || 'সরাসরি (Direct)'),
        screen: String(item.screen || ''),
        sessionId: String(item.sessionId || ''),
      }));

      // Merge with existing cached items
      const local = getStoredVisitors();
      const sheetKeys = new Set(formatted.map(f => f.sessionId || `${f.timestamp}_${f.page}`));
      const merged = [...formatted];
      for (const loc of local) {
        const key = loc.sessionId || `${loc.timestamp}_${loc.page}`;
        if (!sheetKeys.has(key)) {
          merged.push(loc);
        }
      }

      saveStoredVisitors(merged);
      return {
        success: true,
        message: `গুগল শিট থেকে সফলভাবে ${formatted.length} জন ভিজিটরের ডাটা লোড ও সিঙ্ক হয়েছে!`,
        visitors: merged,
        count: formatted.length,
      };
    } else if (data && data.status === 'active') {
      const local = getStoredVisitors();
      return {
        success: true,
        message: 'গুগল শিট সক্রিয় রয়েছে! গুগল শিটের Apps Script এ নতুন doGet কোড আপডেট করলে সরাসরি শিটের সকল ডাটা এখানে শো করবে।',
        visitors: local,
        count: local.length,
      };
    }

    return {
      success: false,
      message: 'গুগল শিট থেকে কোনো ভিজিটর ডাটা পাওয়া যায়নি।',
      visitors: getStoredVisitors(),
      count: 0,
    };
  } catch (err) {
    console.error('Failed to fetch visitors from Google Sheet:', err);
    return {
      success: false,
      message: 'গুগল শিটের সাথে সংযোগ করা যায়নি: ' + String(err),
      visitors: getStoredVisitors(),
      count: 0,
    };
  }
}

// Export visitor log to CSV file
export function exportVisitorsToCSV(visitors: VisitorRecord[]): void {
  if (!visitors || visitors.length === 0) return;
  const headers = [
    'সময় (Timestamp)',
    'পেজ (Page)',
    'আইপি (IP)',
    'লোকেশন (Location)',
    'ডিভাইস (Device)',
    'ওএস (OS)',
    'ব্রাউজার (Browser)',
    'সাইটে থাকার সময় (Time Spent)',
    'রেফারার (Referrer)',
    'স্ক্রিন (Screen)',
  ];

  const escapeCSV = (val: string) => `"${String(val || '').replace(/"/g, '""')}"`;

  const rows = visitors.map(v => [
    escapeCSV(v.timestamp),
    escapeCSV(v.page),
    escapeCSV(v.ip),
    escapeCSV(v.location),
    escapeCSV(v.device),
    escapeCSV(v.os),
    escapeCSV(v.browser),
    escapeCSV(v.timeSpent),
    escapeCSV(v.referrer),
    escapeCSV(v.screen || ''),
  ]);

  const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `mahims-visitors-log-${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

