export interface TickerNotice {
  id: string;
  text: string;
  date?: string;
  link?: string;
}

export interface SheetFullNotice {
  id: string;
  title: string;
  date: string;
  category: 'জরুরি' | 'ক্লাস' | 'পরীক্ষা' | 'সাধারণ' | 'অন্যান্য';
  content: string;
  pinned?: boolean;
}

export const DEFAULT_TICKER_NOTICES: TickerNotice[] = [];

// Helper to format date into short readable format like "9 OCT", "10 OCT"
export function formatNoticeDateShort(rawDate?: string): string {
  if (!rawDate) return '';
  const str = String(rawDate).trim();
  if (!str) return '';

  // If already clean like "9 OCT", "10 OCT", "09 OCT"
  if (/^\d{1,2}\s+[A-Za-z]{3,4}$/i.test(str)) {
    return str.toUpperCase();
  }

  // Parse if standard date string
  const d = new Date(str);
  if (!isNaN(d.getTime())) {
    const day = d.getDate();
    const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    return `${day} ${months[d.getMonth()]}`;
  }

  // Remove "GMT...", "Bangladesh Standard Time", etc.
  let clean = str
    .replace(/\s*\(.*?Standard Time.*?\)/gi, '')
    .replace(/\s*\(.*?Bangladesh.*?\)/gi, '')
    .replace(/\s*GMT[+-]\d{4}/gi, '')
    .trim();

  const match = clean.match(/(\d{1,2})\s+([A-Za-z]{3,4})/);
  if (match) {
    return `${match[1]} ${match[2].toUpperCase()}`;
  }

  return clean;
}

/**
 * Converts notice date to day-month-year slug base:
 * e.g. "9 OCT" (year 2026) -> "09-10-2026"
 * e.g. "2026-10-09" -> "09-10-2026"
 * e.g. "09/10/2026" -> "09-10-2026"
 */
export function getNoticeDateSlugBase(rawDate?: string): string {
  if (!rawDate) {
    const d = new Date();
    const day = ('0' + d.getDate()).slice(-2);
    const month = ('0' + (d.getMonth() + 1)).slice(-2);
    return `${day}-${month}-${d.getFullYear()}`;
  }

  const str = String(rawDate).trim();

  // Match "DD-MM-YYYY" or "DD/MM/YYYY"
  const dmyMatch = str.match(/^(\d{1,2})[-/.](\d{1,2})[-/.](\d{4})$/);
  if (dmyMatch) {
    const day = ('0' + dmyMatch[1]).slice(-2);
    const month = ('0' + dmyMatch[2]).slice(-2);
    return `${day}-${month}-${dmyMatch[3]}`;
  }

  // Match "YYYY-MM-DD"
  const ymdMatch = str.match(/^(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})$/);
  if (ymdMatch) {
    const day = ('0' + ymdMatch[3]).slice(-2);
    const month = ('0' + ymdMatch[2]).slice(-2);
    return `${day}-${month}-${ymdMatch[1]}`;
  }

  // Match "9 OCT", "10 OCT 2026"
  const shortMatch = str.match(/^(\d{1,2})\s+([A-Za-z]{3,4})(?:\s+(\d{4}))?/i);
  if (shortMatch) {
    const day = ('0' + shortMatch[1]).slice(-2);
    const mStr = shortMatch[2].toUpperCase().slice(0, 3);
    const monthsMap: Record<string, string> = {
      JAN: '01', FEB: '02', MAR: '03', APR: '04', MAY: '05', JUN: '06',
      JUL: '07', AUG: '08', SEP: '09', OCT: '10', NOV: '11', DEC: '12'
    };
    const month = monthsMap[mStr] || '10';
    const year = shortMatch[3] || String(new Date().getFullYear());
    return `${day}-${month}-${year}`;
  }

  // Try standard parse
  const d = new Date(str);
  if (!isNaN(d.getTime())) {
    const day = ('0' + d.getDate()).slice(-2);
    const month = ('0' + (d.getMonth() + 1)).slice(-2);
    return `${day}-${month}-${d.getFullYear()}`;
  }

  const clean = str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  return clean || 'notice';
}

/**
 * Computes unique slugs for all notices:
 * 1st notice on date -> DD-MM-YYYY (e.g. 09-10-2026)
 * 2nd notice on same date -> DD-MM-YYYY-2 (e.g. 09-10-2026-2)
 * 3rd notice on same date -> DD-MM-YYYY-3 (e.g. 09-10-2026-3)
 */
export function getNoticeSlugMap<T extends { id: string; date?: string; title?: string }>(
  notices: T[]
): Map<string, string> {
  const map = new Map<string, string>();
  const dateCounts = new Map<string, number>();

  // Process chronologically (oldest to newest) so first notice of the day gets the base date slug
  const reversed = [...notices].reverse();
  reversed.forEach(n => {
    const base = getNoticeDateSlugBase(n.date);
    const count = (dateCounts.get(base) || 0) + 1;
    dateCounts.set(base, count);

    const slug = count === 1 ? base : `${base}-${count}`;
    map.set(n.id, slug);
  });

  return map;
}

export function getNoticeShareUrl(slug: string): string {
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://mahims.com';
  return `${origin}/ps/notices/${slug}`;
}

// Helper to parse standard CSV text into notice items
export function parseCSVToNotices(csvText: string): { ticker: TickerNotice[]; fullNotices: SheetFullNotice[] } {
  const lines = csvText.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  if (lines.length === 0) return { ticker: [], fullNotices: [] };

  const ticker: TickerNotice[] = [];
  const fullNotices: SheetFullNotice[] = [];
  
  // Check if first line is a header like "Notice", "Title", "Text", "ক্যাটাগরি"
  const firstLower = lines[0].toLowerCase();
  const startIndex = firstLower.includes('notice') || 
                     firstLower.includes('title') ||
                     firstLower.includes('শিরোনাম') || 
                     firstLower.includes('নোটিশ') ? 1 : 0;

  for (let i = startIndex; i < lines.length; i++) {
    const line = lines[i];
    // Simple CSV parser supporting quotes
    const parts = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(p => p.replace(/^"|"$/g, '').trim());
    const text = parts[0];
    if (text && text.length > 2) {
      const rawDate = parts[1] || '';
      const shortDate = formatNoticeDateShort(rawDate);
      const displayDate = shortDate || rawDate;
      const category = (parts[2] || 'সাধারণ') as SheetFullNotice['category'];
      const content = parts[3] || text;
      
      ticker.push({
        id: `sheet-${i}`,
        text: text,
        date: displayDate,
        link: parts[4] || ''
      });

      fullNotices.push({
        id: `sheet-notice-${i}`,
        title: text,
        date: displayDate,
        category: category,
        content: content,
        pinned: i === 1 // first notice pinned by default
      });
    }
  }

  return { ticker, fullNotices };
}

// Convert any Google Sheet URL to an exportable CSV URL
export function formatGoogleSheetCsvUrl(rawUrl: string): string {
  const trimmed = rawUrl.trim();
  if (!trimmed) return '';

  // Google Apps Script Web App URL: add action=getNotices if not present
  if (trimmed.includes('script.google.com')) {
    if (trimmed.includes('action=')) return trimmed;
    const separator = trimmed.includes('?') ? '&' : '?';
    return `${trimmed}${separator}action=getNotices`;
  }

  // Already a direct CSV or published link
  if (trimmed.includes('output=csv') || trimmed.endsWith('.csv') || trimmed.includes('out:csv')) {
    return trimmed;
  }

  // Handle standard Google Sheets URL: https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit...
  const match = trimmed.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
  if (match && match[1]) {
    const sheetId = match[1];
    return `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv`;
  }

  return trimmed;
}

export async function fetchNoticesFromGoogleSheet(url: string): Promise<TickerNotice[]> {
  const result = await fetchFullNoticesFromSource(url);
  return result.ticker;
}

export async function fetchFullNoticesFromSource(url: string): Promise<{ ticker: TickerNotice[]; fullNotices: SheetFullNotice[] }> {
  const cleanUrl = formatGoogleSheetCsvUrl(url);
  if (!cleanUrl) return { ticker: [], fullNotices: [] };

  // If it's Google Apps Script Web App JSON
  if (cleanUrl.includes('script.google.com')) {
    try {
      const response = await fetch(cleanUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json, text/plain, */*'
        }
      });
      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data)) {
          const fullNotices: SheetFullNotice[] = data.map((item: any, idx: number) => {
            const rawDate = item.date || '';
            const shortDate = formatNoticeDateShort(rawDate);
            return {
              id: item.id || `app-${idx}`,
              title: item.title || item.text || 'নোটিশ',
              date: shortDate || rawDate,
              category: item.category || 'সাধারণ',
              content: item.content || item.description || item.title || '',
              pinned: Boolean(item.pinned)
            };
          });

          const ticker: TickerNotice[] = fullNotices.map(n => ({
            id: n.id,
            text: n.title,
            date: n.date
          }));

          return { ticker, fullNotices };
        }
      }
    } catch (err) {
      console.warn('Apps Script JSON fetch failed, attempting fallback:', err);
    }
  }

  // Fallback to CSV fetch
  const response = await fetch(cleanUrl, {
    method: 'GET',
    headers: {
      'Accept': 'text/csv, text/plain, */*'
    }
  });

  if (!response.ok) {
    throw new Error(`গুগল শিট থেকে তথ্য আনা যায়নি (Status: ${response.status})`);
  }

  const text = await response.text();
  // Check if response is JSON string
  try {
    const parsed = JSON.parse(text);
    if (Array.isArray(parsed)) {
      const fullNotices: SheetFullNotice[] = parsed.map((item: any, idx: number) => ({
        id: item.id || `app-${idx}`,
        title: item.title || item.text || 'নোটিশ',
        date: item.date || '',
        category: item.category || 'সাধারণ',
        content: item.content || item.description || item.title || '',
        pinned: Boolean(item.pinned)
      }));
      const ticker: TickerNotice[] = fullNotices.map(n => ({
        id: n.id,
        text: n.title,
        date: n.date
      }));
      return { ticker, fullNotices };
    }
  } catch {
    // Treat as CSV
  }

  return parseCSVToNotices(text);
}

// Send subscriber to Apps Script Web App
export async function sendSubscriberToGoogleSheet(
  webAppUrl: string,
  name: string,
  email: string,
  studentId?: string
): Promise<boolean> {
  const trimmed = webAppUrl.trim();
  if (!trimmed || !trimmed.includes('script.google.com')) return false;

  const urlObj = new URL(trimmed);
  urlObj.searchParams.set('action', 'addSubscriber');
  urlObj.searchParams.set('name', name);
  urlObj.searchParams.set('email', email);
  if (studentId) urlObj.searchParams.set('studentId', studentId);

  try {
    // Mode no-cors avoids browser CORS errors with Apps Script redirects
    await fetch(urlObj.toString(), {
      method: 'GET',
      mode: 'no-cors'
    });
    return true;
  } catch (err) {
    console.error('Failed to send subscriber to Google Sheet:', err);
    return false;
  }
}

