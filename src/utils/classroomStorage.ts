import { ClassroomRegistration, ClassroomSettings } from '../types/classroom';

const REGISTRATIONS_STORAGE_KEY = 'mahim_classroom_registrations_v2';
const LEGACY_STORAGE_KEY = 'mahim_classroom_leads';
const SETTINGS_STORAGE_KEY = 'mahim_classroom_settings_v1';
const ADMIN_AUTH_KEY = 'mahim_classroom_admin_session';

// Master Password and SHA-256 Hash of '@@MahimsClassroomAdmin11223300@@'
const MASTER_ADMIN_PASSWORD = '@@MahimsClassroomAdmin11223300@@';
const DEFAULT_ADMIN_HASH = '508f3416e24b111b65534268bac4daa2c7afb7aa1df2dc983054ee86d0b83b75';
const CUSTOM_PW_HASH_KEY = 'mahim_classroom_admin_hash_v2';

export async function hashPassword(plain: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(plain);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

export async function verifyClassroomAdminPassword(input: string): Promise<boolean> {
  try {
    const trimmed = input.trim();
    if (trimmed === MASTER_ADMIN_PASSWORD) {
      return true;
    }
    const inputHash = await hashPassword(trimmed);
    const customHash = typeof window !== 'undefined' ? localStorage.getItem(CUSTOM_PW_HASH_KEY) : null;
    const targetHash = customHash || DEFAULT_ADMIN_HASH;
    return inputHash === targetHash;
  } catch (err) {
    console.error('Classroom password verification error:', err);
    return false;
  }
}

export async function changeClassroomAdminPassword(newPassword: string): Promise<boolean> {
  try {
    if (!newPassword || newPassword.trim().length < 4) return false;
    const newHash = await hashPassword(newPassword.trim());
    if (typeof window !== 'undefined') {
      localStorage.setItem(CUSTOM_PW_HASH_KEY, newHash);
    }
    return true;
  } catch (err) {
    console.error('Password change error:', err);
    return false;
  }
}

export function isClassroomAdminAuthenticated(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return sessionStorage.getItem(ADMIN_AUTH_KEY) === 'true';
  } catch {
    return false;
  }
}

export function setClassroomAdminAuthenticated(status: boolean): void {
  if (typeof window === 'undefined') return;
  try {
    if (status) {
      sessionStorage.setItem(ADMIN_AUTH_KEY, 'true');
    } else {
      sessionStorage.removeItem(ADMIN_AUTH_KEY);
    }
  } catch {
    // ignore
  }
}

export function getStoredClassroomRegistrations(): ClassroomRegistration[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(REGISTRATIONS_STORAGE_KEY);
    let list: ClassroomRegistration[] = [];

    if (raw) {
      list = JSON.parse(raw);
    } else {
      // Migrate legacy leads if present
      const legacyRaw = localStorage.getItem(LEGACY_STORAGE_KEY);
      if (legacyRaw) {
        try {
          const legacyItems = JSON.parse(legacyRaw);
          if (Array.isArray(legacyItems)) {
            list = legacyItems.map((item, idx) => ({
              id: item.id || `legacy_${Date.now()}_${idx}`,
              name: item.name || '',
              phone: item.phone || '',
              course: item.course || '',
              message: item.message || '',
              timestamp: item.timestamp || new Date().toISOString(),
              status: item.status || 'new',
            }));
            localStorage.setItem(REGISTRATIONS_STORAGE_KEY, JSON.stringify(list));
          }
        } catch {
          // ignore
        }
      }
    }

    // Sort by newest first
    return list.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  } catch (err) {
    console.error('Failed to load registrations:', err);
    return [];
  }
}

export function saveClassroomRegistration(data: Omit<ClassroomRegistration, 'id' | 'timestamp' | 'status'>): ClassroomRegistration {
  const newEntry: ClassroomRegistration = {
    id: `cr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    name: data.name.trim(),
    phone: data.phone.trim(),
    course: data.course.trim(),
    message: data.message?.trim() || '',
    timestamp: new Date().toISOString(),
    status: 'new',
  };

  if (typeof window !== 'undefined') {
    try {
      const current = getStoredClassroomRegistrations();
      current.unshift(newEntry);
      localStorage.setItem(REGISTRATIONS_STORAGE_KEY, JSON.stringify(current));
      
      // Also update legacy key for backward compatibility
      localStorage.setItem(LEGACY_STORAGE_KEY, JSON.stringify(current));
    } catch (err) {
      console.error('Error saving registration:', err);
    }
  }

  // Attempt Google Sheets webhook sync
  try {
    const webhookUrl = getEffectiveClassroomWebhookUrl();
    if (webhookUrl) {
      sendRegistrationToGoogleSheet(newEntry, webhookUrl).catch((err) => {
        console.warn('Classroom sheet background sync error:', err);
      });
    }
  } catch (err) {
    console.warn('Could not trigger Google Sheet sync:', err);
  }

  return newEntry;
}

export function updateRegistrationStatus(id: string, status: ClassroomRegistration['status']): void {
  if (typeof window === 'undefined') return;
  try {
    const list = getStoredClassroomRegistrations();
    const updated = list.map((item) => (item.id === id ? { ...item, status } : item));
    localStorage.setItem(REGISTRATIONS_STORAGE_KEY, JSON.stringify(updated));
    localStorage.setItem(LEGACY_STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to update status:', err);
  }
}

export function deleteClassroomRegistration(id: string): void {
  if (typeof window === 'undefined') return;
  try {
    const list = getStoredClassroomRegistrations();
    const filtered = list.filter((item) => item.id !== id);
    localStorage.setItem(REGISTRATIONS_STORAGE_KEY, JSON.stringify(filtered));
    localStorage.setItem(LEGACY_STORAGE_KEY, JSON.stringify(filtered));
  } catch (err) {
    console.error('Failed to delete registration:', err);
  }
}

export function clearAllClassroomRegistrations(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(REGISTRATIONS_STORAGE_KEY);
    localStorage.removeItem(LEGACY_STORAGE_KEY);
  } catch (err) {
    console.error('Failed to clear registrations:', err);
  }
}

// User's configured Google Apps Script Webhook URL for Classroom
export const DEFAULT_CLASSROOM_WEBHOOK_URL =
  'https://script.google.com/macros/s/AKfycbz-BszXMKwQ_YwKzgnHsT2sx7a0p3hTCFBdsHByeCB3NU89CswvIsktDamUR_9MZC7m/exec';

// Effective Google Sheet webhook URL resolver for Classroom
export function getEffectiveClassroomWebhookUrl(): string {
  if (typeof window !== 'undefined') {
    const fromSettings = getClassroomSettings().googleSheetWebhookUrl?.trim();
    if (fromSettings) return fromSettings;
    const fromLocal = localStorage.getItem('classroom_global_webhook_url')?.trim();
    if (fromLocal) return fromLocal;
  }
  const metaEnv = ((import.meta as unknown) as { env?: Record<string, string> }).env;
  const envUrl = metaEnv?.VITE_CLASSROOM_GOOGLE_SHEET_URL?.trim();
  return envUrl || DEFAULT_CLASSROOM_WEBHOOK_URL;
}

export function getClassroomSettings(): ClassroomSettings {
  if (typeof window === 'undefined') return { googleSheetWebhookUrl: DEFAULT_CLASSROOM_WEBHOOK_URL };
  try {
    const raw = localStorage.getItem(SETTINGS_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : {};
    if (!parsed.googleSheetWebhookUrl) {
      const fromLocal = localStorage.getItem('classroom_global_webhook_url');
      parsed.googleSheetWebhookUrl = fromLocal || DEFAULT_CLASSROOM_WEBHOOK_URL;
    }
    return parsed;
  } catch {
    return { googleSheetWebhookUrl: DEFAULT_CLASSROOM_WEBHOOK_URL };
  }
}

export function saveClassroomSettings(settings: ClassroomSettings): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify({ ...settings, updatedAt: new Date().toISOString() }));
    if (settings.googleSheetWebhookUrl?.trim()) {
      localStorage.setItem('classroom_global_webhook_url', settings.googleSheetWebhookUrl.trim());
    } else {
      localStorage.removeItem('classroom_global_webhook_url');
    }
  } catch (err) {
    console.error('Failed to save classroom settings:', err);
  }
}

export function exportRegistrationsToCSV(list: ClassroomRegistration[]): void {
  if (!list.length) return;

  const headers = ['Serial', 'Student Name', 'Phone', 'Target Course', 'Message', 'Date & Time', 'Status'];
  const rows = list.map((item, index) => [
    index + 1,
    `"${item.name.replace(/"/g, '""')}"`,
    `"${item.phone.replace(/"/g, '""')}"`,
    `"${item.course.replace(/"/g, '""')}"`,
    `"${(item.message || '').replace(/"/g, '""')}"`,
    `"${new Date(item.timestamp).toLocaleString('en-US')}"`,
    `"${item.status || 'new'}"`,
  ]);

  const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `Mahim_Classroom_Students_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export async function sendRegistrationToGoogleSheet(
  registration: ClassroomRegistration,
  webhookUrl?: string
): Promise<boolean> {
  try {
    const targetUrl = webhookUrl?.trim() || getEffectiveClassroomWebhookUrl();
    if (!targetUrl || !targetUrl.startsWith('http')) return false;

    const payload = {
      action: 'classroom_registration',
      id: registration.id,
      timestamp: new Date(registration.timestamp).toLocaleString('bn-BD', { timeZone: 'Asia/Dhaka' }),
      rawTimestamp: registration.timestamp,
      name: registration.name,
      phone: registration.phone,
      course: registration.course,
      message: registration.message || '',
      status: registration.status || 'new',
      platform: "Mahim's Classroom",
      source: 'mahims.com/classroom',
    };

    await fetch(targetUrl, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify(payload),
    });

    return true;
  } catch (err) {
    console.error('Google Sheet webhook sync error:', err);
    return false;
  }
}

// Fetch registrations from Google Sheet into Classroom Admin Panel
export async function fetchRegistrationsFromGoogleSheet(
  webhookUrl?: string
): Promise<ClassroomRegistration[]> {
  const targetUrl = webhookUrl?.trim() || getEffectiveClassroomWebhookUrl();
  if (!targetUrl || !targetUrl.startsWith('http')) {
    return getStoredClassroomRegistrations();
  }

  try {
    const res = await fetch(targetUrl, {
      method: 'GET',
    });
    if (!res.ok) {
      return getStoredClassroomRegistrations();
    }

    const data = await res.json();
    if (data && Array.isArray(data.registrations)) {
      const sheetList: Array<Record<string, unknown>> = data.registrations;
      const local = getStoredClassroomRegistrations();
      const existingIds = new Set(local.map((r) => r.id));
      const newlyFetched: ClassroomRegistration[] = [];

      for (const item of sheetList) {
        const id = String(item.id || `sheet_${item.phone || ''}_${item.timestamp || Date.now()}`);
        if (!existingIds.has(id)) {
          newlyFetched.push({
            id,
            name: String(item.name || ''),
            phone: String(item.phone || '').replace(/^'/, ''),
            course: String(item.course || ''),
            message: String(item.message || ''),
            timestamp: String(item.timestamp || item.rawTimestamp || new Date().toISOString()),
            status: (item.status as ClassroomRegistration['status']) || 'new',
          });
        }
      }

      const merged = [...newlyFetched, ...local];
      // Deduplicate by unique phone + course if ids differed
      const uniqueMap = new Map<string, ClassroomRegistration>();
      for (const item of merged) {
        const key = `${item.phone.trim()}_${item.course.trim()}`;
        if (!uniqueMap.has(key)) {
          uniqueMap.set(key, item);
        }
      }
      const finalClean = Array.from(uniqueMap.values()).sort((a, b) => {
        const timeA = new Date(a.timestamp).getTime();
        const timeB = new Date(b.timestamp).getTime();
        return (isNaN(timeB) ? 0 : timeB) - (isNaN(timeA) ? 0 : timeA);
      });

      if (typeof window !== 'undefined') {
        localStorage.setItem(REGISTRATIONS_STORAGE_KEY, JSON.stringify(finalClean));
        localStorage.setItem(LEGACY_STORAGE_KEY, JSON.stringify(finalClean));
      }
      return finalClean;
    }
    return getStoredClassroomRegistrations();
  } catch (err) {
    console.warn('Could not pull registrations from Google Sheet:', err);
    return getStoredClassroomRegistrations();
  }
}

// Ready-to-deploy Google Apps Script for Mahim's Classroom
export const GOOGLE_APPS_SCRIPT_CLASSROOM = `// ====================================================================
// Google Apps Script for Mahim's Classroom Pre-Registration Database
// ====================================================================

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Create headers if empty sheet
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "ID",
        "তারিখ ও সময় (Date)",
        "শিক্ষার্থীর নাম (Student Name)",
        "মোবাইল নম্বর (Phone Number)",
        "পছন্দের ব্যাচ/কোর্স (Course)",
        "মেসেজ/জিজ্ঞাসা (Message)",
        "স্ট্যাটাস (Status)"
      ]);
      sheet.getRange("A1:G1").setFontWeight("bold").setBackground("#EA580C").setFontColor("#FFFFFF");
      sheet.setFrozenRows(1);
    }
    
    var data = JSON.parse(e.postData.contents);
    var regId = data.id || ("cr_" + new Date().getTime());
    var formattedDate = data.timestamp || new Date().toLocaleString("bn-BD", { timeZone: "Asia/Dhaka" });
    
    sheet.appendRow([
      regId,
      formattedDate,
      data.name || "",
      "'" + (data.phone || ""),
      data.course || "",
      data.message || "",
      data.status || "new"
    ]);
    
    return ContentService.createTextOutput(JSON.stringify({ status: "success", id: regId }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var rows = sheet.getDataRange().getValues();
    var registrations = [];
    
    for (var i = 1; i < rows.length; i++) {
      var row = rows[i];
      if (row[2] || row[3]) { // If Name or Phone exists
        registrations.push({
          id: String(row[0] || ("sheet_" + i)),
          timestamp: String(row[1] || ""),
          name: String(row[2] || ""),
          phone: String(row[3] || "").replace(/^'/, ""),
          course: String(row[4] || ""),
          message: String(row[5] || ""),
          status: String(row[6] || "new")
        });
      }
    }
    
    return ContentService.createTextOutput(JSON.stringify({ 
      status: "success", 
      count: registrations.length,
      registrations: registrations 
    })).setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ 
      status: "error", 
      registrations: [], 
      message: error.toString() 
    })).setMimeType(ContentService.MimeType.JSON);
  }
}
`;
