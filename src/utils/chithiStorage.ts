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

  // Attempt Google Sheets Sync if webhook is configured
  try {
    const settings = getChithiSettings();
    if (settings.googleSheetWebhookUrl) {
      sendLetterToGoogleSheet(settings.googleSheetWebhookUrl, newLetter).catch((e) =>
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
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(SETTINGS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
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
