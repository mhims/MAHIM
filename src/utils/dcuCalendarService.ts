import { CalendarConfig, CalendarHolidayItem, DayResolvedInfo } from '../types/dcuCalendar';

export const DEFAULT_CALENDAR_CONFIG: CalendarConfig = {
  // 0=Sunday, 1=Monday, 2=Tuesday, 3=Wednesday, 4=Thursday, 5=Friday, 6=Saturday
  // Default off-days as requested: বুধবার (3), শুক্রবার (5), শনিবার (6)
  defaultOffDays: [3, 5, 6],
  allowFutureMonths: false,
  academicYear: '২০২৬'
};

// Verified holidays list (No demo data, only updated by user via Google Sheets)
export const DEFAULT_HOLIDAYS: CalendarHolidayItem[] = [];

const LOCAL_STORAGE_KEY_CONFIG = 'dcu_calendar_config';
const LOCAL_STORAGE_KEY_HOLIDAYS = 'dcu_calendar_holidays_list';

export function getCachedCalendarConfig(): CalendarConfig {
  if (typeof window === 'undefined') return DEFAULT_CALENDAR_CONFIG;
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY_CONFIG);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        defaultOffDays: Array.isArray(parsed.defaultOffDays) ? parsed.defaultOffDays : DEFAULT_CALENDAR_CONFIG.defaultOffDays,
        allowFutureMonths: Boolean(parsed.allowFutureMonths),
        academicYear: parsed.academicYear || DEFAULT_CALENDAR_CONFIG.academicYear
      };
    }
  } catch {}
  return DEFAULT_CALENDAR_CONFIG;
}

export function saveCachedCalendarConfig(config: CalendarConfig): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY_CONFIG, JSON.stringify(config));
  } catch {}
}

export function getCachedHolidays(): CalendarHolidayItem[] {
  if (typeof window === 'undefined') return DEFAULT_HOLIDAYS;
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY_HOLIDAYS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        // Strip any old demo holidays if present
        const filtered = parsed.filter(item => item.id && !['hol-1', 'hol-2', 'hol-3', 'hol-4'].includes(item.id));
        return filtered;
      }
    }
  } catch {}
  return DEFAULT_HOLIDAYS;
}

export function saveCachedHolidays(holidays: CalendarHolidayItem[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY_HOLIDAYS, JSON.stringify(holidays));
  } catch {}
}

export function formatToYmd(d: Date): string {
  const year = d.getFullYear();
  const month = ('0' + (d.getMonth() + 1)).slice(-2);
  const day = ('0' + d.getDate()).slice(-2);
  return `${year}-${month}-${day}`;
}

export function parseYmd(str: string): Date {
  const parts = str.split('-').map(Number);
  return new Date(parts[0], parts[1] - 1, parts[2]);
}

/**
 * Resolves a date's open/holiday status:
 * Checks:
 * 1. Explicit override in holidays list (date matches startDate, or falls between startDate & endDate)
 * 2. If status is 'open', it overrides default weekly off-days (e.g., special Friday makeup class)
 * 3. Default weekly off-days check (Wed, Fri, Sat by default)
 * 4. Otherwise 'open' (regular class day)
 */
export function resolveDayStatus(
  date: Date,
  holidays: CalendarHolidayItem[],
  config: CalendarConfig
): DayResolvedInfo {
  const dateStr = formatToYmd(date);
  const dayIndex = date.getDay(); // 0=Sun, 1=Mon, 2=Tue, 3=Wed, 4=Thu, 5=Fri, 6=Sat
  const isDefaultWeeklyOff = config.defaultOffDays.includes(dayIndex);

  const todayStr = formatToYmd(new Date());
  const isToday = dateStr === todayStr;

  // Day names in Bengali
  const dayNames = ['রবিবার', 'সোমবার', 'মঙ্গলবার', 'বুধবার', 'বৃহস্পতিবার', 'শুক্রবার', 'শনিবার'];
  const dayNameBn = dayNames[dayIndex];

  // Check matching holidays / overrides
  let matchedHoliday: CalendarHolidayItem | null = null;

  for (const item of holidays) {
    if (!item.startDate) continue;
    const startYmd = item.startDate.trim();
    const endYmd = item.endDate ? item.endDate.trim() : startYmd;

    if (dateStr >= startYmd && dateStr <= endYmd) {
      matchedHoliday = item;
      break;
    }
  }

  if (matchedHoliday) {
    if (matchedHoliday.status === 'open') {
      return {
        dateStr,
        dayNumber: date.getDate(),
        dayIndex,
        isToday,
        status: 'open',
        isDefaultWeeklyOff,
        reason: matchedHoliday.title || 'বিশেষ ক্লাস খোলা'
      };
    }

    return {
      dateStr,
      dayNumber: date.getDate(),
      dayIndex,
      isToday,
      status: matchedHoliday.status || 'holiday',
      isDefaultWeeklyOff,
      reason: matchedHoliday.title || 'ছুটি'
    };
  }

  // If no specific override, check default weekly off days
  if (isDefaultWeeklyOff) {
    return {
      dateStr,
      dayNumber: date.getDate(),
      dayIndex,
      isToday,
      status: 'holiday',
      isDefaultWeeklyOff: true,
      reason: `সাপ্তাহিক ছুটি (${dayNameBn})`
    };
  }

  // Regular class day
  return {
    dateStr,
    dayNumber: date.getDate(),
    dayIndex,
    isToday,
    status: 'open',
    isDefaultWeeklyOff: false,
    reason: 'নিয়মিত ক্লাস চালু'
  };
}

/**
 * Fetch calendar data from Google Sheets / Google Apps Script
 */
export async function fetchCalendarFromSource(
  sourceUrl: string
): Promise<{ config?: Partial<CalendarConfig>; holidays?: CalendarHolidayItem[] } | null> {
  const trimmed = sourceUrl.trim();
  if (!trimmed) return null;

  // 1. Google Apps Script Web App
  if (trimmed.includes('script.google.com')) {
    try {
      const sep = trimmed.includes('?') ? '&' : '?';
      const targetUrl = `${trimmed}${sep}action=getCalendar`;
      const res = await fetch(targetUrl, {
        method: 'GET',
        headers: { 'Accept': 'application/json, text/plain, */*' }
      });
      if (res.ok) {
        const json = await res.json();
        if (json && (json.holidays || json.config)) {
          return json;
        }
      }
    } catch (e) {
      console.warn('Apps Script getCalendar fetch error:', e);
    }
  }

  // 2. Google Sheets CSV gviz fallback (sheet=Calendar or gid)
  if (trimmed.includes('docs.google.com/spreadsheets')) {
    try {
      const match = trimmed.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
      if (match && match[1]) {
        const sheetId = match[1];
        const gvizUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv&sheet=Calendar`;
        const res = await fetch(gvizUrl);
        if (res.ok) {
          const csv = await res.text();
          const parsed = parseCalendarCsv(csv);
          if (parsed.length > 0) {
            return { holidays: parsed };
          }
        }
      }
    } catch (e) {
      console.warn('Google Sheet Calendar CSV fetch error:', e);
    }
  }

  return null;
}

/**
 * Send newly added holiday to Google Apps Script Web App
 */
export async function sendHolidayToGoogleSheet(
  webAppUrl: string,
  holiday: CalendarHolidayItem
): Promise<boolean> {
  const trimmed = webAppUrl.trim();
  if (!trimmed || !trimmed.includes('script.google.com')) return false;

  try {
    const payload = JSON.stringify({
      action: 'addHoliday',
      id: holiday.id,
      startDate: holiday.startDate,
      endDate: holiday.endDate || '',
      status: holiday.status,
      title: holiday.title,
      category: holiday.category || 'বিশ্ববিদ্যালয় ছুটি'
    });

    if (typeof navigator !== 'undefined' && navigator.sendBeacon) {
      const blob = new Blob([payload], { type: 'text/plain;charset=utf-8' });
      navigator.sendBeacon(trimmed, blob);
      return true;
    }

    await fetch(trimmed, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: payload
    });
    return true;
  } catch (err) {
    console.warn('sendHolidayToGoogleSheet error:', err);
    return false;
  }
}

export function parseCalendarCsv(csvText: string): CalendarHolidayItem[] {
  const lines = csvText.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  if (lines.length <= 1) return [];

  const headers = lines[0].split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(p => p.replace(/^"|"$/g, '').trim().toLowerCase());

  let startIdx = headers.findIndex(h => h.includes('তারিখ') || h.includes('start') || h.includes('date'));
  let endIdx = headers.findIndex(h => h.includes('শেষ') || h.includes('end'));
  let statusIdx = headers.findIndex(h => h.includes('স্ট্যাটাস') || h.includes('status') || h.includes('ধরণ'));
  let titleIdx = headers.findIndex(h => h.includes('বিবরণ') || h.includes('উপলক্ষ') || h.includes('কারণ') || h.includes('title') || h.includes('name'));

  if (startIdx === -1) startIdx = 0;
  if (endIdx === -1) endIdx = 1;
  if (statusIdx === -1) statusIdx = 2;
  if (titleIdx === -1) titleIdx = 3;

  const result: CalendarHolidayItem[] = [];

  for (let i = 1; i < lines.length; i++) {
    const parts = lines[i].split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(p => p.replace(/^"|"$/g, '').trim());
    if (parts.length < 1) continue;

    const rawStart = parts[startIdx];
    if (!rawStart) continue;

    const formattedStart = normalizeDateInput(rawStart);
    if (!formattedStart) continue;

    const rawEnd = endIdx !== -1 && parts[endIdx] ? normalizeDateInput(parts[endIdx]) : undefined;
    const rawStatus = (parts[statusIdx] || 'ছুটি').toLowerCase();

    let status: 'holiday' | 'open' | 'exam' = 'holiday';
    if (rawStatus.includes('খোলা') || rawStatus.includes('open') || rawStatus.includes('ক্লাস')) {
      status = 'open';
    } else if (rawStatus.includes('পরীক্ষা') || rawStatus.includes('exam')) {
      status = 'exam';
    }

    const title = parts[titleIdx] || (status === 'open' ? 'ক্লাস খোলা' : 'ছুটি');

    result.push({
      id: `cal-csv-${i}-${Date.now()}`,
      startDate: formattedStart,
      endDate: rawEnd,
      status,
      title
    });
  }

  return result;
}

export function normalizeDateInput(val: string): string {
  const clean = val.replace(/^"|"$/g, '').trim();
  // YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(clean)) return clean;

  // DD/MM/YYYY or DD-MM-YYYY
  const dmyMatch = clean.match(/^(\d{1,2})[-/.](\d{1,2})[-/.](\d{4})$/);
  if (dmyMatch) {
    const day = ('0' + dmyMatch[1]).slice(-2);
    const month = ('0' + dmyMatch[2]).slice(-2);
    return `${dmyMatch[3]}-${month}-${day}`;
  }

  // Parse Date object
  const d = new Date(clean);
  if (!isNaN(d.getTime())) {
    return formatToYmd(d);
  }

  return '';
}
