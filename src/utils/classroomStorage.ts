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

  // Attempt Google Sheets webhook sync if configured
  const settings = getClassroomSettings();
  if (settings.googleSheetWebhookUrl) {
    sendRegistrationToGoogleSheet(newEntry, settings.googleSheetWebhookUrl).catch(() => {});
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

export function getClassroomSettings(): ClassroomSettings {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(SETTINGS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function saveClassroomSettings(settings: ClassroomSettings): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify({ ...settings, updatedAt: new Date().toISOString() }));
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
  webhookUrl: string
): Promise<boolean> {
  try {
    if (!webhookUrl || !webhookUrl.startsWith('http')) return false;

    const payload = {
      timestamp: registration.timestamp,
      name: registration.name,
      phone: registration.phone,
      course: registration.course,
      message: registration.message || '',
      status: registration.status || 'new',
      platform: "Mahim's Classroom",
    };

    await fetch(webhookUrl, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    return true;
  } catch (err) {
    console.error('Google Sheet webhook sync error:', err);
    return false;
  }
}

export const GOOGLE_APPS_SCRIPT_CLASSROOM = `
// =====================================================
// Google Apps Script for Mahim's Classroom Pre-Registration
// =====================================================
function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Create headers if empty
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(["Timestamp", "Student Name", "Phone Number", "Course", "Message", "Status"]);
      sheet.getRange("A1:F1").setFontWeight("bold").setBackground("#EA580C").setFontColor("#FFFFFF");
    }
    
    var data = JSON.parse(e.postData.contents);
    sheet.appendRow([
      data.timestamp || new Date().toISOString(),
      data.name || "",
      "'" + (data.phone || ""),
      data.course || "",
      data.message || "",
      data.status || "new"
    ]);
    
    return ContentService.createTextOutput(JSON.stringify({ status: "success" }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
`;
