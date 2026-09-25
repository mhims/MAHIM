import { SalamiRecord, SalamiSettings } from '../types/salami';
import { verifySubPanelPasswordWithMasterOverride } from './masterPasswordHelper';

export const DEFAULT_SALAMI_WEBHOOK_URL =
  'https://script.google.com/macros/s/AKfycbxrBZ9EGkIrbrdAyC5f-SSfQkY8HYdN_I745ZcccfJWrJbV0pu6GmVYycQD7hrf5lPJTg/exec';

const STORAGE_KEY = 'mahims_salami_records_v1';
const SETTINGS_KEY = 'mahims_salami_settings_v1';
const ADMIN_AUTH_KEY = 'mahims_salami_admin_auth_v1';
const CUSTOM_PW_HASH_KEY = 'mahims_salami_custom_pw_hash';

// Default Password: @@MahimChithidotme0
const DEFAULT_PW_HASH = 'aa4cc2b739ce6f832f651fa4c90d0fd4b15e594b08316f9b68ed8eb4523687a8';

async function hashPassword(str: string): Promise<string> {
  const enc = new TextEncoder();
  const data = enc.encode(str);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hash))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

export async function verifySalamiAdminPassword(input: string): Promise<boolean> {
  const trimmed = input.trim();
  if (trimmed === '@@MahimChithidotme0') return true;
  try {
    const hashed = await hashPassword(trimmed);
    const custom = typeof window !== 'undefined' ? localStorage.getItem(CUSTOM_PW_HASH_KEY) : null;
    return hashed === (custom || DEFAULT_PW_HASH);
  } catch {
    return false;
  }
}

export async function changeSalamiAdminPassword(newPw: string): Promise<boolean> {
  if (!newPw || newPw.trim().length < 6) return false;
  try {
    const hashed = await hashPassword(newPw.trim());
    if (typeof window !== 'undefined') {
      localStorage.setItem(CUSTOM_PW_HASH_KEY, hashed);
    }
    return true;
  } catch {
    return false;
  }
}

export function isSalamiAdminAuthenticated(): boolean {
  if (typeof window === 'undefined') return false;
  return sessionStorage.getItem(ADMIN_AUTH_KEY) === 'valid';
}

export function setSalamiAdminAuthenticated(status: boolean): void {
  if (typeof window === 'undefined') return;
  if (status) {
    sessionStorage.setItem(ADMIN_AUTH_KEY, 'valid');
  } else {
    sessionStorage.removeItem(ADMIN_AUTH_KEY);
  }
}

export function getSalamiSettings(): SalamiSettings {
  if (typeof window === 'undefined') {
    return {
      googleSheetWebhookUrl: DEFAULT_SALAMI_WEBHOOK_URL,
      bKashNumber: '01762 855 347',
      nagadNumber: '01762 855 347',
      rocketNumber: '01762 855 347',
    };
  }
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) {
      return {
        googleSheetWebhookUrl: DEFAULT_SALAMI_WEBHOOK_URL,
        bKashNumber: '01762 855 347',
        nagadNumber: '01762 855 347',
        rocketNumber: '01762 855 347',
      };
    }
    const parsed = JSON.parse(raw);
    return {
      googleSheetWebhookUrl: parsed.googleSheetWebhookUrl || DEFAULT_SALAMI_WEBHOOK_URL,
      bKashNumber: parsed.bKashNumber || '01762 855 347',
      nagadNumber: parsed.nagadNumber || '01762 855 347',
      rocketNumber: parsed.rocketNumber || '01762 855 347',
    };
  } catch {
    return {
      googleSheetWebhookUrl: DEFAULT_SALAMI_WEBHOOK_URL,
      bKashNumber: '01762 855 347',
      nagadNumber: '01762 855 347',
      rocketNumber: '01762 855 347',
    };
  }
}

export function saveSalamiSettings(settings: SalamiSettings): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

export function getStoredSalamiRecords(): SalamiRecord[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const list = JSON.parse(raw);
    return Array.isArray(list) ? list : [];
  } catch {
    return [];
  }
}

export function saveStoredSalamiRecords(list: SalamiRecord[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list.slice(0, 1000)));
  } catch {}
}

export function addSalamiRecord(record: Omit<SalamiRecord, 'id' | 'createdAt'>): SalamiRecord {
  const current = getStoredSalamiRecords();
  const newRecord: SalamiRecord = {
    ...record,
    id: `salami_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    createdAt: Date.now(),
  };
  current.unshift(newRecord);
  saveStoredSalamiRecords(current);
  return newRecord;
}

export function updateSalamiStatus(id: string, status: 'pending' | 'paid'): void {
  const current = getStoredSalamiRecords();
  const updated = current.map(item => (item.id === id ? { ...item, status } : item));
  saveStoredSalamiRecords(updated);
}

export function toggleSalamiStar(id: string): void {
  const current = getStoredSalamiRecords();
  const updated = current.map(item => (item.id === id ? { ...item, isStarred: !item.isStarred } : item));
  saveStoredSalamiRecords(updated);
}

export function deleteSalamiRecord(id: string): void {
  const current = getStoredSalamiRecords();
  const filtered = current.filter(item => item.id !== id);
  saveStoredSalamiRecords(filtered);
}

export function clearAllSalamiRecords(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
}

// Send Salami payload to Google Sheet Webhook
export async function sendSalamiToGoogleSheet(
  webhookUrl: string | undefined,
  record: {
    type: 'নেওয়া' | 'পাঠানো';
    name: string;
    phone: string;
    age?: string;
    amount: string;
    message: string;
  }
): Promise<boolean> {
  const targetUrl = (webhookUrl && webhookUrl.trim()) || DEFAULT_SALAMI_WEBHOOK_URL;
  if (!targetUrl || !targetUrl.startsWith('http')) return false;

  const payload = {
    action: 'salami_record',
    type: record.type,
    name: record.name,
    phone: record.phone || 'N/A',
    age: record.age || 'N/A',
    amount: record.amount,
    message: record.message || 'N/A',
    timestamp: new Date().toLocaleString('bn-BD', { timeZone: 'Asia/Dhaka' }),
  };

  try {
    await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify(payload),
      mode: 'no-cors',
      keepalive: true,
    });
    return true;
  } catch (err) {
    console.warn('Failed to push to Google Sheet Webhook:', err);
    return false;
  }
}

// Fetch Salami records from Google Sheet
export async function fetchSalamiFromGoogleSheet(webhookUrl?: string): Promise<{
  success: boolean;
  message: string;
  records: SalamiRecord[];
}> {
  const targetUrl = (webhookUrl && webhookUrl.trim()) || getSalamiSettings().googleSheetWebhookUrl || DEFAULT_SALAMI_WEBHOOK_URL;
  if (!targetUrl || !targetUrl.startsWith('http')) {
    return {
      success: false,
      message: 'সঠিক Webhook URL পাওয়া যায়নি।',
      records: getStoredSalamiRecords(),
    };
  }

  const fetchUrl = targetUrl.includes('?')
    ? `${targetUrl}&action=get_salami&t=${Date.now()}`
    : `${targetUrl}?action=get_salami&t=${Date.now()}`;

  try {
    const res = await fetch(fetchUrl);
    if (!res.ok) {
      return {
        success: false,
        message: `গুগল শিট রেসপন্স করেনি (HTTP ${res.status})`,
        records: getStoredSalamiRecords(),
      };
    }
    const data = await res.json();
    if (data && Array.isArray(data.records)) {
      const sheetRecords: SalamiRecord[] = data.records.map((item: any, idx: number) => ({
        id: item.id || `sheet_salami_${idx}_${Date.now()}`,
        timestamp: String(item.timestamp || ''),
        type: item.type === 'পাঠানো' ? 'পাঠানো' : 'নেওয়া',
        name: String(item.name || 'Anonymous'),
        phone: String(item.phone || 'N/A'),
        age: String(item.age || 'N/A'),
        amount: String(item.amount || '০ টাকা'),
        message: String(item.message || ''),
        status: (item.status === 'paid' ? 'paid' : 'pending'),
        createdAt: Date.now() - idx * 1000,
      }));

      // Merge with local records
      const local = getStoredSalamiRecords();
      const localPhones = new Set(local.map(l => `${l.name}_${l.phone}_${l.amount}`));
      const merged = [...local];
      for (const s of sheetRecords) {
        if (!localPhones.has(`${s.name}_${s.phone}_${s.amount}`)) {
          merged.push(s);
        }
      }
      saveStoredSalamiRecords(merged);
      return {
        success: true,
        message: `গুগল শিট থেকে সফলভাবে ${sheetRecords.length} টি সালামি রেকর্ড সিঙ্ক হয়েছে!`,
        records: merged,
      };
    }

    return {
      success: true,
      message: 'গুগল শিটের সাথে সংযোগ সফল হয়েছে!',
      records: getStoredSalamiRecords(),
    };
  } catch (err) {
    return {
      success: false,
      message: 'গুগল শিট থেকে ডাটা ফেচ করতে সমস্যা হয়েছে: ' + String(err),
      records: getStoredSalamiRecords(),
    };
  }
}

// Export Salami records to CSV
export function exportSalamiToCSV(records: SalamiRecord[]): void {
  if (!records || records.length === 0) return;
  const headers = [
    'তারিখ ও সময় (Date)',
    'ধরণ (Type)',
    'নাম (Name)',
    'নম্বর (Phone)',
    'পরিমাণ (Amount)',
    'মেসেজ (Message)',
    'স্ট্যাটাস (Status)',
  ];

  const escapeCSV = (val: string) => `"${String(val || '').replace(/"/g, '""')}"`;

  const rows = records.map(r => [
    escapeCSV(r.timestamp),
    escapeCSV(r.type),
    escapeCSV(r.name),
    escapeCSV(r.phone),
    escapeCSV(r.amount),
    escapeCSV(r.message),
    escapeCSV(r.status === 'paid' ? 'পরিশোধিত' : 'অপেক্ষমাণ'),
  ]);

  const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `mahims-salami-records-${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export const SALAMI_APPS_SCRIPT_TEMPLATE = `/**
 * ========================================================
 * 🌙 মাহিম সালামি (Mahims Salami Portal) - Google Apps Script
 * ========================================================
 * ১. আপনার সালামির গুগল শিটটি খুলুন (Google Spreadsheet)
 * ২. Extensions > Apps Script এ যান
 * ৩. নিচের সম্পূর্ণ কোডটি পেস্ট করুন (আগের সব মুছে দিয়ে)
 * ৪. 'Deploy' > 'New deployment' এ যান
 * ৫. 'Select type' এ ক্লিক করে 'Web app' বেছে নিন
 * ৬. 'Execute as': 'Me' রাখুন
 * ৭. 'Who has access': 'Anyone' (যে কেউ) দিন
 * ৮. 'Deploy' বাটনে চাপ দিয়ে Permission এলাউ করুন
 * ৯. প্রাপ্ত Web app URL টি কপি করে ওয়েবসাইটে সেভ করুন
 */

function doGet(e) {
  // ১. ওয়েবসাইট থেকে সব সালামি ডাটা লোড করার রিকোয়েস্ট
  if (e && e.parameter && e.parameter.action === 'get_salami') {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheets()[0];
    var data = sheet.getDataRange().getValues();
    var records = [];
    // প্রথম রো হেডারের পর থেকে ডাটা পড়া
    for (var i = 1; i < data.length; i++) {
      if (data[i][0] || data[i][2]) {
        records.push({
          timestamp: data[i][0] instanceof Date ? Utilities.formatDate(data[i][0], 'Asia/Dhaka', 'dd/MM/yyyy, hh:mm:ss a') : String(data[i][0]),
          type: String(data[i][1] || 'নেওয়া'),
          name: String(data[i][2] || ''),
          phone: String(data[i][3] || ''),
          age: String(data[i][4] || 'N/A'),
          amount: String(data[i][5] || ''),
          message: String(data[i][6] || '')
        });
      }
    }
    return ContentService.createTextOutput(JSON.stringify({ status: 'success', records: records }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  return ContentService.createTextOutput(JSON.stringify({ status: 'active', message: 'Mahim Salami API is running' }))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000);

  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheets()[0];

    // হেডার রো না থাকলে তৈরি করা
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        'তারিখ ও সময় (Date)',
        'ধরণ (Type)',
        'নাম (Name)',
        'নম্বর (Phone)',
        'বয়স (Age)',
        'পরিমাণ (Amount)',
        'মেসেজ (Message)'
      ]);
      sheet.getRange(1, 1, 1, 7).setFontWeight('bold').setBackground('#fdfaf5');
    }

    var data;
    if (e.postData && e.postData.contents) {
      try {
        data = JSON.parse(e.postData.contents);
      } catch (err) {
        data = e.parameter;
      }
    } else {
      data = e.parameter || {};
    }

    var type = data.type || 'নেওয়া';
    var name = data.name || 'Anonymous';
    var phone = data.phone || 'N/A';
    var age = data.age || 'N/A';
    var amount = data.amount || '১ টাকা';
    var message = data.message || 'N/A';
    var time = data.timestamp || Utilities.formatDate(new Date(), 'Asia/Dhaka', 'dd/MM/yyyy, hh:mm:ss a');

    sheet.appendRow([time, type, name, phone, age, amount, message]);

    return ContentService.createTextOutput(JSON.stringify({ status: 'SUCCESS' }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ status: 'ERROR', error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

// আগের ফাংশন যাতে ব্যাকওয়ার্ড কম্প্যাটিবিলিটি বজায় থাকে
function processRequest(type, name, phone, age, amount, message) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheets()[0];
    sheet.appendRow([new Date(), type, name, phone, age, amount, message]);
    return "SUCCESS";
  } catch (e) {
    return "ERROR: " + e.toString();
  }
}
`;
