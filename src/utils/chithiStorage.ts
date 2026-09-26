import { ChithiLetter, ChithiSettings } from '../types/chithi';

const LETTERS_STORAGE_KEY = 'mahims_chithi_letters_v1';
const SETTINGS_STORAGE_KEY = 'mahims_chithi_settings_v1';
const ADMIN_AUTH_KEY = 'mahim_chithi_admin_session';

// Cryptographic SHA-256 Hash of admin password (Plaintext is never stored in source code)
const DEFAULT_ADMIN_HASH = 'aa4cc2b739ce6f832f651fa4c90d0fd4b15e594b08316f9b68ed8eb4523687a8';
const CUSTOM_PW_HASH_KEY = 'mahim_chithi_admin_hash_v1';

export async function hashPassword(plain: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(plain);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

export async function verifyChithiAdminPassword(input: string): Promise<boolean> {
  try {
    const inputHash = await hashPassword(input.trim());
    const customHash = typeof window !== 'undefined' ? localStorage.getItem(CUSTOM_PW_HASH_KEY) : null;
    const targetHash = customHash || DEFAULT_ADMIN_HASH;
    return inputHash === targetHash;
  } catch (err) {
    console.error('Password verification error:', err);
    return false;
  }
}

export async function changeChithiAdminPassword(newPassword: string): Promise<boolean> {
  try {
    if (!newPassword || newPassword.trim().length < 6) return false;
    const newHash = await hashPassword(newPassword.trim());
    if (typeof window !== 'undefined') {
      localStorage.setItem(CUSTOM_PW_HASH_KEY, newHash);
    }
    return true;
  } catch (err) {
    console.error('Password update error:', err);
    return false;
  }
}

export async function resetChithiAdminPasswordToDefault(): Promise<void> {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(CUSTOM_PW_HASH_KEY);
  }
}

// No demo letters - inbox begins completely clean
export const SAMPLE_LETTERS: ChithiLetter[] = [];

export function getStoredLetters(): ChithiLetter[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(LETTERS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(LETTERS_STORAGE_KEY, JSON.stringify([]));
      return [];
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      // Clean out any legacy demo letters
      const cleaned = parsed.filter(
        (l) => l.id !== 'chithi-demo-1' && l.id !== 'chithi-demo-2'
      );
      if (cleaned.length !== parsed.length) {
        localStorage.setItem(LETTERS_STORAGE_KEY, JSON.stringify(cleaned));
      }
      return cleaned;
    }
    return [];
  } catch (err) {
    console.error('Error loading stored letters:', err);
    return [];
  }
}

// User's configured Google Apps Script Webhook URL for Chithi (Dedicated sheet for letters, deleted versions & drafts)
export const DEFAULT_GOOGLE_SHEET_WEBHOOK_URL =
  'https://script.google.com/macros/s/AKfycbwY6kICvCYj4SiRLQ64aPRlB5ThYpRgNVgjsXvBjaHffVbtp0KR3h4zqcX7mdEdCYM07w/exec';

const LEGACY_DEAD_WEBHOOK_URL =
  'https://script.google.com/macros/s/AKfycbyae4Q9cU8n1KRnHlbLgP-tUh4vaGRZRx12NBzNxeWPMSoYJk8HXKsUJ2A00CBKB1qssQ/exec';

// Effective Google Sheet webhook URL resolver for Chithi
export function getEffectiveGoogleSheetWebhookUrl(): string {
  if (typeof window !== 'undefined') {
    const fromSettings = getChithiSettings().googleSheetWebhookUrl?.trim();
    // Do not allow visitor tracking sheet (1qssQ) or legacy dead URL to pollute Chithi
    if (fromSettings && !fromSettings.includes('1qssQ') && fromSettings !== LEGACY_DEAD_WEBHOOK_URL) {
      return fromSettings;
    }

    const fromLocal = localStorage.getItem('chithi_global_webhook_url')?.trim();
    if (fromLocal && !fromLocal.includes('1qssQ') && fromLocal !== LEGACY_DEAD_WEBHOOK_URL) {
      return fromLocal;
    }
  }
  const metaEnv = ((import.meta as unknown) as { env?: Record<string, string> }).env;
  const envUrl = metaEnv?.VITE_CHITHI_GOOGLE_SHEET_URL?.trim();
  if (envUrl && !envUrl.includes('1qssQ') && envUrl !== LEGACY_DEAD_WEBHOOK_URL) {
    return envUrl;
  }
  return DEFAULT_GOOGLE_SHEET_WEBHOOK_URL;
}

export function saveLetter(letter: Omit<ChithiLetter, 'id' | 'createdAt' | 'timestamp'>): ChithiLetter {
  const letters = getStoredLetters();
  const newLetter: ChithiLetter = {
    ...letter,
    id: 'chithi-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
    createdAt: new Date().toISOString(),
    timestamp: Date.now(),
    isRead: false,
  };

  const updated = [newLetter, ...letters];
  if (typeof window !== 'undefined') {
    localStorage.setItem(LETTERS_STORAGE_KEY, JSON.stringify(updated));
  }

  // Forward to central Google Sheet Webhook so it immediately lands in Mahim's Google Sheet
  try {
    const webhookUrl = getEffectiveGoogleSheetWebhookUrl();
    if (webhookUrl) {
      sendLetterToGoogleSheet(webhookUrl, newLetter).catch((e) =>
        console.warn('Google Sheet sync background error:', e)
      );
    }
  } catch (e) {
    console.warn('Google sheet sync attempt failed:', e);
  }

  return newLetter;
}

export function deleteLetter(id: string): void {
  const letters = getStoredLetters();
  const filtered = letters.filter((l) => l.id !== id);
  if (typeof window !== 'undefined') {
    localStorage.setItem(LETTERS_STORAGE_KEY, JSON.stringify(filtered));
  }
}

export function toggleLetterRead(id: string): void {
  const letters = getStoredLetters();
  const updated = letters.map((l) => (l.id === id ? { ...l, isRead: !l.isRead } : l));
  if (typeof window !== 'undefined') {
    localStorage.setItem(LETTERS_STORAGE_KEY, JSON.stringify(updated));
  }
}

export function toggleLetterStar(id: string): void {
  const letters = getStoredLetters();
  const updated = letters.map((l) => (l.id === id ? { ...l, isStarred: !l.isStarred } : l));
  if (typeof window !== 'undefined') {
    localStorage.setItem(LETTERS_STORAGE_KEY, JSON.stringify(updated));
  }
}

export function getChithiSettings(): ChithiSettings {
  if (typeof window === 'undefined') return { googleSheetWebhookUrl: DEFAULT_GOOGLE_SHEET_WEBHOOK_URL };
  try {
    const raw = localStorage.getItem(SETTINGS_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : {};
    const url = parsed.googleSheetWebhookUrl?.trim();
    if (!url || url === LEGACY_DEAD_WEBHOOK_URL || url.includes('1qssQ')) {
      parsed.googleSheetWebhookUrl = DEFAULT_GOOGLE_SHEET_WEBHOOK_URL;
      // Auto-update localStorage to the guaranteed chithi working URL
      try {
        localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(parsed));
      } catch {
        // ignore
      }
    }
    return parsed;
  } catch {
    return { googleSheetWebhookUrl: DEFAULT_GOOGLE_SHEET_WEBHOOK_URL };
  }
}

export function saveChithiSettings(settings: ChithiSettings): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
}

// Session authentication for Admin
export function isChithiAdminAuthenticated(): boolean {
  if (typeof window === 'undefined') return false;
  return sessionStorage.getItem(ADMIN_AUTH_KEY) === 'authenticated_valid';
}

export function setChithiAdminAuthenticated(val: boolean): void {
  if (typeof window === 'undefined') return;
  if (val) {
    sessionStorage.setItem(ADMIN_AUTH_KEY, 'authenticated_valid');
  } else {
    sessionStorage.removeItem(ADMIN_AUTH_KEY);
  }
}

// Device detection helper
export function detectUserDevice(): string {
  if (typeof window === 'undefined') return 'Unknown Device';
  const ua = navigator.userAgent || '';
  let os = 'Unknown OS';
  if (/Android/i.test(ua)) os = 'Android';
  else if (/iPhone|iPad|iPod/i.test(ua)) os = 'iOS (iPhone)';
  else if (/Windows NT 10.0|Windows NT 11.0/i.test(ua)) os = 'Windows';
  else if (/Macintosh|Mac OS X/i.test(ua)) os = 'macOS';
  else if (/Linux/i.test(ua)) os = 'Linux';

  let browser = 'Browser';
  if (/Chrome/i.test(ua) && !/Edg|OPR/i.test(ua)) browser = 'Chrome';
  else if (/Safari/i.test(ua) && !/Chrome/i.test(ua)) browser = 'Safari';
  else if (/Edg/i.test(ua)) browser = 'Edge';
  else if (/Firefox/i.test(ua)) browser = 'Firefox';
  else if (/SamsungBrowser/i.test(ua)) browser = 'Samsung Browser';

  return `${os} • ${browser}`;
}

// Google Sheet sync sender
export async function sendChithiEventToGoogleSheet(
  webhookUrl: string,
  event: {
    letterId?: string;
    content: string;
    device?: string;
    location?: string;
  }
): Promise<boolean> {
  if (!webhookUrl || !webhookUrl.startsWith('http')) return false;

  const payload = {
    action: 'chithi_letter',
    timestamp: new Date().toLocaleString('bn-BD', { timeZone: 'Asia/Dhaka' }),
    letterId: event.letterId || ('chithi-' + Date.now()),
    content: event.content,
    device: event.device || detectUserDevice(),
    location: event.location || 'Unknown',
    source: 'mahims.com/chithi',
  };

  const dataString = JSON.stringify(payload);

  // NOTE: We deliberately DO NOT use navigator.sendBeacon here because Google Apps Script
  // Web Apps respond with an HTTP 302 Found redirect to script.googleusercontent.com.
  // According to the W3C Beacon standard, browsers abort and drop navigator.sendBeacon requests
  // upon receiving a 302 redirect. Fetch with keepalive: true follows 302 redirects seamlessly.
  try {
    await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: dataString,
      mode: 'no-cors',
      keepalive: true,
      cache: 'no-cache',
    });
    return true;
  } catch {
    // If keepalive is rejected (e.g. strict browser policy or quota limit), retry with standard fetch
    try {
      await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: dataString,
        mode: 'no-cors',
        cache: 'no-cache',
      });
      return true;
    } catch (err) {
      console.error('Failed to push chithi event to Google Sheet:', err);
      return false;
    }
  }
}

// Google Sheet sync sender for standard submitted letters
export async function sendLetterToGoogleSheet(webhookUrl: string, letter: ChithiLetter): Promise<boolean> {
  const tokenLabel = letter.tokenId ? ` [উপহার: ${letter.tokenId}]` : '';
  return sendChithiEventToGoogleSheet(webhookUrl, {
    letterId: letter.id,
    content: letter.tokenId ? `${letter.content}\n\n${tokenLabel}` : letter.content,
    device: letter.deviceInfo || detectUserDevice(),
    location: letter.senderLocation || 'Unknown',
  });
}

// Send deleted/cleared letter text to Google Sheet
export function recordDeletedChithiText(deletedText: string, device?: string): void {
  const trimmed = deletedText.trim();
  if (!trimmed || trimmed.length < 3) return;
  const webhookUrl = getEffectiveGoogleSheetWebhookUrl();
  if (!webhookUrl) return;

  sendChithiEventToGoogleSheet(webhookUrl, {
    letterId: 'chithi-del-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
    content: `[ডিলেট করা লেখা] ${trimmed}`,
    device: device || detectUserDevice(),
  }).catch(() => {});
}

// Send previous draft version containing deleted content to Google Sheet
export function recordDeletedChithiVersion(
  deletedVersionText: string,
  versionIndex: number = 1,
  currentRemainingText?: string,
  device?: string
): void {
  const trimmed = deletedVersionText.trim();
  if (!trimmed || trimmed.length < 3) return;
  const webhookUrl = getEffectiveGoogleSheetWebhookUrl();
  if (!webhookUrl) return;

  const versionTag = versionIndex > 1 ? `[ডিলেট করা ভার্সন ${versionIndex}]` : '[ডিলেট করা ভার্সন]';
  const remainingInfo = currentRemainingText && currentRemainingText.trim()
    ? `\n\n(কাটছাঁটের পর অবশিষ্ট রাখা অংশ: "${currentRemainingText.trim()}")`
    : '';

  sendChithiEventToGoogleSheet(webhookUrl, {
    letterId: 'chithi-ver-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
    content: `${versionTag} ${trimmed}${remainingInfo}`,
    device: device || detectUserDevice(),
  }).catch(() => {});
}

// Send unsent draft (when visitor leaves without submitting) to Google Sheet
export function recordUnsentChithiDraft(draftText: string, device?: string): void {
  const trimmed = draftText.trim();
  if (!trimmed || trimmed.length < 3) return;
  const webhookUrl = getEffectiveGoogleSheetWebhookUrl();
  if (!webhookUrl) return;

  sendChithiEventToGoogleSheet(webhookUrl, {
    letterId: 'chithi-draft-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
    content: `[পাঠানো হয়নি / ড্রাফট] ${trimmed}`,
    device: device || detectUserDevice(),
  }).catch(() => {});
}

// Fetch letters from Google Sheet into local Admin Panel inbox
export async function fetchLettersFromGoogleSheet(webhookUrl: string): Promise<ChithiLetter[]> {
  if (!webhookUrl || !webhookUrl.startsWith('http')) return [];

  // 1. Direct Google Sheet Public URL Support (if user pastes docs.google.com/spreadsheets/d/...)
  if (webhookUrl.includes('docs.google.com/spreadsheets')) {
    try {
      const directLetters = await fetchLettersFromGoogleSpreadsheetDirect(webhookUrl);
      if (directLetters && directLetters.length > 0) {
        return mergeAndSaveLetters(directLetters);
      }
    } catch (err: any) {
      console.warn('Direct Google Sheet fetch error:', err);
      throw new Error(err.message || 'গুগল শিট থেকে ডাটা পড়তে ব্যর্থ হয়েছে। শিটটির শেয়ারিং "Anyone with the link can view" আছে কিনা দেখুন।');
    }
  }

  // 2. Google Apps Script Web App URL Support (script.google.com/...)
  try {
    const res = await fetch(webhookUrl, {
      method: 'GET',
    });
    if (!res.ok) {
      throw new Error(`গুগল সার্ভার রেসপন্স দেয়নি (HTTP ${res.status})। আপনার Webhook URL চেক করুন।`);
    }

    const text = await res.text();
    let data: any = null;
    try {
      data = JSON.parse(text);
    } catch {
      throw new Error('গুগল শিটের রেসপন্স সঠিক JSON ফরম্যাটে নেই। Webhook URL টি সঠিক Apps Script URL কিনা পরীক্ষা করুন।');
    }

    // Check if the Apps Script is still running the old placeholder/test script
    if (data && (data.message === 'Mahims Webhook is Running!' || (data.status === 'active' && !data.letters))) {
      throw new Error('APPS_SCRIPT_OLD_VERSION');
    }

    let sheetLetters: Array<Record<string, unknown>> = [];
    if (Array.isArray(data)) {
      sheetLetters = data;
    } else if (data && Array.isArray(data.letters)) {
      sheetLetters = data.letters;
    } else if (data && Array.isArray(data.data)) {
      sheetLetters = data.data;
    } else if (data && Array.isArray(data.rows)) {
      sheetLetters = data.rows;
    }

    if (!sheetLetters.length) {
      // If valid empty response from sheet
      return getStoredLetters();
    }

    const newlyFetched: ChithiLetter[] = [];
    for (const item of sheetLetters) {
      const id = String(item.id || item.letterId || 'sheet-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6));
      newlyFetched.push({
        id,
        content: String(item.content || item.letter || item.message || ''),
        createdAt: String(item.createdAt || item.timestamp || item.date || new Date().toISOString()),
        timestamp: typeof item.timestamp === 'number' ? item.timestamp : Date.now(),
        deviceInfo: item.deviceInfo || item.device ? String(item.deviceInfo || item.device) : '',
        senderLocation: item.senderLocation || item.locationInfo || item.location ? String(item.senderLocation || item.locationInfo || item.location) : '',
        paperTheme: (item.paperTheme as ChithiLetter['paperTheme']) || 'vintage',
        inkColor: (item.inkColor as ChithiLetter['inkColor']) || 'blue',
        isRead: Boolean(item.isRead),
        isStarred: Boolean(item.isStarred),
      });
    }

    return mergeAndSaveLetters(newlyFetched);
  } catch (err) {
    console.warn('Could not pull from Google Sheet:', err);
    throw err;
  }
}

// Helper to parse public Google Sheets via Google Visualization API
async function fetchLettersFromGoogleSpreadsheetDirect(sheetUrl: string): Promise<ChithiLetter[]> {
  const match = sheetUrl.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
  if (!match) throw new Error('সঠিক গুগল শিট URL পাওয়া যায়নি।');
  const sheetId = match[1];
  const gvizUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json`;

  const res = await fetch(gvizUrl);
  if (!res.ok) throw new Error(`শিট এক্সেস করা যায়নি (HTTP ${res.status})। শিটের Share অপশনে 'Anyone with the link can view' সেট করুন।`);
  const text = await res.text();
  const jsonMatch = text.match(/google\.visualization\.Query\.setResponse\(([\s\S]+)\);?$/);
  if (!jsonMatch) throw new Error('গুগল শিট থেকে ডাটা পাওয়া যায়নি।');
  const parsed = JSON.parse(jsonMatch[1]);
  const rows = parsed?.table?.rows;
  if (!Array.isArray(rows)) return [];

  const letters: ChithiLetter[] = [];
  rows.forEach((r: any, idx: number) => {
    const c = r?.c || [];
    const val0 = c[0]?.v !== undefined ? String(c[0]?.v) : '';
    const val1 = c[1]?.v !== undefined ? String(c[1]?.v) : '';
    const val2 = c[2]?.v !== undefined ? String(c[2]?.v) : '';
    const val3 = c[3]?.v !== undefined ? String(c[3]?.v) : '';
    const val4 = c[4]?.v !== undefined ? String(c[4]?.v) : '';

    let content = val2 || '';
    if (!content.trim() && (val1.length > 20 || val0.length > 20)) {
      content = val1.length > val0.length ? val1 : val0;
    }
    if (!content.trim() || content.toLowerCase() === 'content' || content.includes('চিঠি (Content)')) return;

    letters.push({
      id: val0 && !val0.includes(':') ? val0 : `sheet-${sheetId}-${idx}`,
      createdAt: val1 || new Date().toISOString(),
      timestamp: Date.now(),
      content: content.trim(),
      deviceInfo: val3 || 'Google Sheet',
      senderLocation: val4 || '',
      paperTheme: 'vintage',
      inkColor: 'blue',
      isRead: false,
      isStarred: false,
    });
  });

  letters.reverse();
  return letters;
}

function mergeAndSaveLetters(newlyFetched: ChithiLetter[]): ChithiLetter[] {
  const local = getStoredLetters();
  const existingIds = new Set(local.map((l) => l.id));
  const toAdd: ChithiLetter[] = [];

  for (const item of newlyFetched) {
    if (!existingIds.has(item.id)) {
      toAdd.push(item);
      existingIds.add(item.id);
    }
  }

  const merged = [...toAdd, ...local];
  if (typeof window !== 'undefined') {
    localStorage.setItem(LETTERS_STORAGE_KEY, JSON.stringify(merged));
  }
  return merged;
}

// Google Apps Script ready-to-use template for user's Google Sheet
export const GOOGLE_APPS_SCRIPT_TEMPLATE = `// ====================================================
// MAHIM CHITHI - GOOGLE APPS SCRIPT WEB APP
// ====================================================
// এই কোডটি আপনার গুগল শিটে চিঠি জমা করতে এবং 
// ওয়েবসাইট থেকে সরাসরি চিঠি পড়তে (Sync) ব্যবহৃত হয়।

function doPost(e) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName("Letters") || ss.getSheetByName("Sheet1") || ss.getSheetByName("চিঠি") || ss.getSheets()[0];
    
    // ১ম সারিতে হেডার তৈরি (নতুন শিটের ক্ষেত্রে)
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(["ID", "তারিখ ও সময় (Date)", "চিঠি (Content)", "ডিভাইস (Device)", "লোকেশন (Location)"]);
      sheet.getRange(1, 1, 1, 5).setFontWeight("bold").setBackground("#fef3c7");
    }
    
    var data = JSON.parse(e.postData.contents);
    sheet.appendRow([
      data.letterId || ("chithi-" + new Date().getTime()),
      data.timestamp || new Date().toLocaleString("bn-BD", { timeZone: "Asia/Dhaka" }),
      data.content || "",
      data.device || "",
      data.location || ""
    ]);
    
    return ContentService.createTextOutput(JSON.stringify({ 
      status: "success", 
      message: "চিঠি সফলভাবে জমা হয়েছে" 
    })).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ 
      status: "error", 
      message: err.toString() 
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName("Letters") || ss.getSheetByName("Sheet1") || ss.getSheetByName("চিঠি") || ss.getSheets()[0];
    var lastRow = sheet.getLastRow();
    
    if (lastRow <= 1) {
      return ContentService.createTextOutput(JSON.stringify({ 
        status: "success", 
        count: 0,
        letters: [] 
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
    var rows = sheet.getDataRange().getValues();
    var letters = [];
    
    // ১ম সারি হেডার কিনা যাচাই
    var startIndex = 1;
    var firstRowSample = String(rows[0][0] || "") + String(rows[0][1] || "") + String(rows[0][2] || "");
    if (!firstRowSample.match(/ID|Date|তারিখ|চিঠি|Content|Device|লোকেশন/i)) {
      startIndex = 0; // কোনো হেডার নেই
    }
    
    for (var i = startIndex; i < rows.length; i++) {
      var row = rows[i];
      var id = String(row[0] || ("letter-" + i));
      var dateStr = String(row[1] || "");
      var content = String(row[2] || "");
      var device = String(row[3] || "");
      var loc = String(row[4] || "");
      
      // কলাম ২ খালি হলে অন্য কোনো বড় টেক্সট খুঁজবে
      if (!content.trim() && row.length > 1) {
        for (var c = 0; c < row.length; c++) {
          if (String(row[c]).length > content.length) {
            content = String(row[c]);
          }
        }
      }
      
      if (content.trim()) {
        letters.push({
          id: id,
          createdAt: dateStr || new Date().toISOString(),
          content: content,
          deviceInfo: device,
          locationInfo: loc,
          isRead: false,
          isStarred: false
        });
      }
    }
    
    // নতুন চিঠি সবার আগে দেখানোর জন্য উল্টানো (Latest First)
    letters.reverse();
    
    return ContentService.createTextOutput(JSON.stringify({ 
      status: "success", 
      count: letters.length, 
      letters: letters 
    })).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ 
      status: "error", 
      message: err.toString(), 
      letters: [] 
    })).setMimeType(ContentService.MimeType.JSON);
  }
}`;
