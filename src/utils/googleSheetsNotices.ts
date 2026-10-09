export interface TickerNotice {
  id: string;
  text: string;
  date?: string;
  link?: string;
}

export const DEFAULT_TICKER_NOTICES: TickerNotice[] = [
  {
    id: 't-1',
    text: 'রবিবারের প্রথম ক্লাস সকাল ১০:৪৫ এ শুরু হবে (রুম ৩০২)।',
  },
  {
    id: 't-2',
    text: 'বুধবার ডিপার্টমেন্টের কোনো ক্লাস নেই।',
  },
  {
    id: 't-3',
    text: 'রবিবার ব্যতীত অন্য সকল দিনে সকাল ১১:৩০ এর পর কোনো ক্লাস থাকবে না।',
  },
  {
    id: 't-4',
    text: 'স্বাধীন বাংলাদেশের অভ্যুদয়ের ইতিহাস (HEIBD) ক্লাস রবিবারে দুপুর ১:০০ - ১:৪৫ অনুষ্ঠিত হবে।',
  }
];

// Helper to parse standard CSV text into notice items
export function parseCSVToNotices(csvText: string): TickerNotice[] {
  const lines = csvText.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  if (lines.length === 0) return [];

  const results: TickerNotice[] = [];
  
  // Check if first line is a header like "Notice", "Title", "Text"
  const startIndex = lines[0].toLowerCase().includes('notice') || 
                     lines[0].toLowerCase().includes('শিরোনাম') || 
                     lines[0].toLowerCase().includes('নোটিশ') ? 1 : 0;

  for (let i = startIndex; i < lines.length; i++) {
    const line = lines[i];
    // Simple CSV parser supporting quotes
    const parts = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(p => p.replace(/^"|"$/g, '').trim());
    const text = parts[0];
    if (text && text.length > 2) {
      results.push({
        id: `sheet-${i}`,
        text: text,
        date: parts[1] || '',
        link: parts[2] || ''
      });
    }
  }

  return results;
}

// Convert any Google Sheet URL to an exportable CSV URL
export function formatGoogleSheetCsvUrl(rawUrl: string): string {
  const trimmed = rawUrl.trim();
  if (!trimmed) return '';

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
  const csvUrl = formatGoogleSheetCsvUrl(url);
  if (!csvUrl) return [];

  const response = await fetch(csvUrl, {
    method: 'GET',
    headers: {
      'Accept': 'text/csv, text/plain, */*'
    }
  });

  if (!response.ok) {
    throw new Error(`গুগল শিট থেকে তথ্য আনা যায়নি (Status: ${response.status})`);
  }

  const csvText = await response.text();
  return parseCSVToNotices(csvText);
}
