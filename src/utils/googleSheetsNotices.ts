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
      const date = parts[1] || '';
      const category = (parts[2] || 'সাধারণ') as SheetFullNotice['category'];
      const content = parts[3] || text;
      
      ticker.push({
        id: `sheet-${i}`,
        text: text,
        date: date,
        link: parts[4] || ''
      });

      fullNotices.push({
        id: `sheet-notice-${i}`,
        title: text,
        date: date || new Date().toLocaleDateString('bn-BD'),
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
          const fullNotices: SheetFullNotice[] = data.map((item: any, idx: number) => ({
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

