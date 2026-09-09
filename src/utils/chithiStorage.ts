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

// Initial sample letters for Mahim to test the preview & story cards immediately
export const SAMPLE_LETTERS: ChithiLetter[] = [
  {
    id: 'chithi-demo-1',
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    timestamp: Date.now() - 3600000 * 4,
    content: 'প্রিয় মাহিম ভাই, আপনার সোশ্যাল মিডিয়া ডিজাইন ও ক্রিয়েটিভিটি সত্যিই অসাধারণ! ফেসবুকে আপনার কাজ দেখে প্রতিদিন অনুপ্রাণিত হই। সামনের দিনগুলোতে আপনার আরও বড় সাফল্য কামনা করছি। শুভকামনা রইল!',
    deviceInfo: 'Android (Chrome Mobile)',
    inkColor: 'blue',
    paperTheme: 'vintage',
    isRead: false,
    isStarred: true
  },
  {
    id: 'chithi-demo-2',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    timestamp: Date.now() - 86400000,
    content: 'একটা না বলা কথা ছিল... আপনার কাজের প্রতি যে নিষ্ঠা আর ডেডিকেশন, সেটা সবাইকে মুগ্ধ করে। কখনো হাল ছাড়বেন না, আপনি আরও অনেক দূর যাবেন!',
    deviceInfo: 'iPhone 15 Pro (Mobile Safari)',
    inkColor: 'maroon',
    paperTheme: 'notebook',
    isRead: true,
    isStarred: false
  }
];

export function getStoredLetters(): ChithiLetter[] {
  if (typeof window === 'undefined') return SAMPLE_LETTERS;
  try {
    const raw = localStorage.getItem(LETTERS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(LETTERS_STORAGE_KEY, JSON.stringify(SAMPLE_LETTERS));
      return SAMPLE_LETTERS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : SAMPLE_LETTERS;
  } catch (err) {
    console.error('Error loading stored letters:', err);
    return SAMPLE_LETTERS;
  }
}

// User's configured Google Apps Script Webhook URL
export const DEFAULT_GOOGLE_SHEET_WEBHOOK_URL = 'https://script.google.com/macros/s/AKfycbwY6kICvCYj4SiRLQ64aPRlB5ThYpRgNVgjsXvBjaHffVbtp0KR3h4zqcX7mdEdCYM07w/exec';

// Effective Google Sheet webhook URL resolver
export function getEffectiveGoogleSheetWebhookUrl(): string {
  if (typeof window !== 'undefined') {
    const fromSettings = getChithiSettings().googleSheetWebhookUrl?.trim();
    if (fromSettings) return fromSettings;
    const fromLocal = localStorage.getItem('chithi_global_webhook_url')?.trim();
    if (fromLocal) return fromLocal;
  }
  const metaEnv = ((import.meta as unknown) as { env?: Record<string, string> }).env;
  const envUrl = metaEnv?.VITE_CHITHI_GOOGLE_SHEET_URL?.trim();
  return envUrl || DEFAULT_GOOGLE_SHEET_WEBHOOK_URL;
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
    if (!parsed.googleSheetWebhookUrl) {
      parsed.googleSheetWebhookUrl = DEFAULT_GOOGLE_SHEET_WEBHOOK_URL;
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
export async function sendLetterToGoogleSheet(webhookUrl: string, letter: ChithiLetter): Promise<boolean> {
  if (!webhookUrl || !webhookUrl.startsWith('http')) return false;

  try {
    const payload = {
      action: 'chithi_letter',
      timestamp: new Date().toLocaleString('bn-BD', { timeZone: 'Asia/Dhaka' }),
      letterId: letter.id,
      content: letter.content,
      device: letter.deviceInfo || '',
      location: letter.senderLocation || 'Unknown',
      source: 'mahims.com/chithi',
    };

    await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify(payload),
      mode: 'no-cors',
    });
    return true;
  } catch (err) {
    console.error('Failed to push letter to Google Sheet:', err);
    return false;
  }
}

// Fetch letters from Google Sheet into local Admin Panel inbox
export async function fetchLettersFromGoogleSheet(webhookUrl: string): Promise<ChithiLetter[]> {
  if (!webhookUrl || !webhookUrl.startsWith('http')) return [];

  try {
    const res = await fetch(webhookUrl, {
      method: 'GET',
    });
    if (!res.ok) return [];
    const data = await res.json();
    if (data && Array.isArray(data.letters)) {
      const sheetLetters: Array<Record<string, unknown>> = data.letters;
      // Merge with local letters without duplicates
      const local = getStoredLetters();
      const existingIds = new Set(local.map((l) => l.id));
      const newlyFetched: ChithiLetter[] = [];

      for (const item of sheetLetters) {
        const id = String(item.id || 'sheet-' + Date.now());
        if (!existingIds.has(id)) {
          newlyFetched.push({
            id,
            content: String(item.content || ''),
            createdAt: String(item.createdAt || new Date().toISOString()),
            timestamp: typeof item.timestamp === 'number' ? item.timestamp : Date.now(),
            deviceInfo: item.deviceInfo ? String(item.deviceInfo) : '',
            senderLocation: item.senderLocation || item.locationInfo ? String(item.senderLocation || item.locationInfo) : '',
            paperTheme: (item.paperTheme as ChithiLetter['paperTheme']) || 'vintage',
            inkColor: (item.inkColor as ChithiLetter['inkColor']) || 'blue',
            isRead: Boolean(item.isRead),
            isStarred: Boolean(item.isStarred),
          });
        }
      }

      const merged = [...newlyFetched, ...local];
      if (typeof window !== 'undefined') {
        localStorage.setItem(LETTERS_STORAGE_KEY, JSON.stringify(merged));
      }
      return merged;
    }
    return [];
  } catch (err) {
    console.warn('Could not pull from Google Sheet:', err);
    return [];
  }
}

// Google Apps Script ready-to-use template for user's Google Sheet
export const GOOGLE_APPS_SCRIPT_TEMPLATE = `function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
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
    return ContentService.createTextOutput(JSON.stringify({ status: "success" })).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: err.toString() })).setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var rows = sheet.getDataRange().getValues();
    var letters = [];
    for (var i = 1; i < rows.length; i++) {
      if (rows[i][2]) {
        letters.push({
          id: String(rows[i][0] || ("letter-" + i)),
          createdAt: String(rows[i][1] || ""),
          content: String(rows[i][2] || ""),
          deviceInfo: String(rows[i][3] || ""),
          locationInfo: String(rows[i][4] || ""),
          isRead: true,
          isStarred: false
        });
      }
    }
    return ContentService.createTextOutput(JSON.stringify({ status: "success", letters: letters })).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", letters: [] })).setMimeType(ContentService.MimeType.JSON);
  }
}`;
