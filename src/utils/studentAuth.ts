import { ClassroomRegistration } from '../types/classroom';
import {
  getEffectiveClassroomWebhookUrl,
  fetchRegistrationsFromGoogleSheet,
  sendRegistrationToGoogleSheet,
} from './classroomStorage';

export interface StudentUser {
  id: string;
  name: string;
  phone: string;
  whatsapp: string;
  institution?: string;
  batchOrClass?: string;
  password?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface CourseEnrollmentRecord {
  id: string;
  studentPhone: string;
  studentName: string;
  whatsapp: string;
  mentorSlug: string;
  courseTitle: string;
  fee: string;
  paymentMethod: 'bKash' | 'Nagad' | 'Rocket' | string;
  senderPhone: string;
  trxId: string;
  status: 'pending' | 'ok' | 'fake';
  timestamp: string;
  verifiedAt?: string;
}

const STUDENT_SESSION_KEY = 'mahim_classroom_student_session_v1';
const ENROLLMENTS_STORAGE_KEY = 'mahim_classroom_course_enrollments_v1';

// Get currently logged-in student
export function getCurrentStudent(): StudentUser | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STUDENT_SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

// Save student login session
export function saveStudentSession(student: StudentUser): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STUDENT_SESSION_KEY, JSON.stringify(student));
    window.dispatchEvent(new CustomEvent('student:auth_changed', { detail: { student } }));
  } catch (err) {
    console.error('Failed to save student session:', err);
  }
}

// Logout student
export function logoutStudent(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(STUDENT_SESSION_KEY);
    window.dispatchEvent(new CustomEvent('student:auth_changed', { detail: { student: null } }));
  } catch (err) {
    console.error('Failed to logout student:', err);
  }
}

// Update student profile details
export function updateStudentProfile(updates: Partial<StudentUser>): StudentUser | null {
  const current = getCurrentStudent();
  if (!current) return null;
  const updated: StudentUser = {
    ...current,
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  saveStudentSession(updated);
  return updated;
}

// Update student password
export function updateStudentPassword(newPassword: string): boolean {
  const current = getCurrentStudent();
  if (!current) return false;
  const updated: StudentUser = {
    ...current,
    password: newPassword,
    updatedAt: new Date().toISOString(),
  };
  saveStudentSession(updated);
  return true;
}

// Get student's enrollments specifically
export function getStudentEnrollments(phone: string): CourseEnrollmentRecord[] {
  if (!phone) return [];
  const cleanPhone = phone.trim().replace(/^'/, '');
  const all = getAllEnrollments();
  return all.filter((e) => e.studentPhone.replace(/^'/, '') === cleanPhone);
}

// Get all stored course enrollments
export function getAllEnrollments(): CourseEnrollmentRecord[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(ENROLLMENTS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

// Get course access status for a student & mentor slug
export function getStudentCourseStatus(
  phone: string,
  mentorSlug: string
): {
  status: 'pending' | 'ok' | 'fake' | 'none';
  record?: CourseEnrollmentRecord;
} {
  if (!phone || !mentorSlug) return { status: 'none' };
  const cleanPhone = phone.trim().replace(/^'/, '');
  const cleanSlug = mentorSlug.trim().toLowerCase();

  const all = getAllEnrollments();
  const match = all.find(
    (e) =>
      e.studentPhone.replace(/^'/, '') === cleanPhone &&
      e.mentorSlug.toLowerCase() === cleanSlug
  );

  if (!match) return { status: 'none' };
  return { status: match.status, record: match };
}

// Normalize status from Google Sheet / user text
export function normalizeStatus(rawStatus?: string): 'pending' | 'ok' | 'fake' {
  if (!rawStatus) return 'pending';
  const s = rawStatus.trim().toLowerCase();
  if (
    s === 'ok' ||
    s === 'okay' ||
    s === 'approved' ||
    s === 'enrolled' ||
    s === 'সফল' ||
    s === 'অনুমোদিত' ||
    s === 'verified'
  ) {
    return 'ok';
  }
  if (
    s === 'fake' ||
    s === 'rejected' ||
    s === 'cancelled' ||
    s === 'ভুয়া' ||
    s === 'বাতিল' ||
    s === 'invalid'
  ) {
    return 'fake';
  }
  return 'pending';
}

// Save a new enrollment (Pending) and push to Google Sheet Webhook
export async function submitCourseEnrollment(data: {
  studentName: string;
  studentPhone: string;
  whatsapp: string;
  mentorSlug: string;
  courseTitle: string;
  fee: string;
  paymentMethod: string;
  senderPhone: string;
  trxId: string;
}): Promise<CourseEnrollmentRecord> {
  const newRecord: CourseEnrollmentRecord = {
    id: `cr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    studentName: data.studentName.trim(),
    studentPhone: data.studentPhone.trim(),
    whatsapp: data.whatsapp.trim() || data.studentPhone.trim(),
    mentorSlug: data.mentorSlug.trim().toLowerCase(),
    courseTitle: data.courseTitle.trim(),
    fee: data.fee.trim() || '৯৯ টাকা',
    paymentMethod: data.paymentMethod.trim() || 'bKash',
    senderPhone: data.senderPhone.trim(),
    trxId: data.trxId.trim().toUpperCase(),
    status: 'pending',
    timestamp: new Date().toISOString(),
  };

  // 1. Save locally
  if (typeof window !== 'undefined') {
    try {
      const current = getAllEnrollments();
      // Replace existing pending/fake entry for same mentor if student resubmitted
      const filtered = current.filter(
        (e) =>
          !(
            e.studentPhone === newRecord.studentPhone &&
            e.mentorSlug === newRecord.mentorSlug
          )
      );
      filtered.unshift(newRecord);
      localStorage.setItem(ENROLLMENTS_STORAGE_KEY, JSON.stringify(filtered));
      window.dispatchEvent(
        new CustomEvent('student:enrollment_updated', {
          detail: { record: newRecord },
        })
      );
    } catch (err) {
      console.error('Error saving enrollment locally:', err);
    }
  }

  // 2. Dispatch to Google Sheet Webhook
  try {
    const regPayload: ClassroomRegistration = {
      id: newRecord.id,
      name: newRecord.studentName,
      phone: newRecord.studentPhone,
      whatsapp: newRecord.whatsapp,
      course: `${newRecord.courseTitle} [Trx: ${newRecord.trxId}]`,
      fee: newRecord.fee,
      paymentMethod: `${newRecord.paymentMethod} (Sender: ${newRecord.senderPhone})`,
      trxId: newRecord.trxId,
      message: `Sender Phone: ${newRecord.senderPhone}, Method: ${newRecord.paymentMethod}, Mentor: ${newRecord.mentorSlug}`,
      status: 'new', // will show as pending/new in sheet
      timestamp: newRecord.timestamp,
    };

    const webhookUrl = getEffectiveClassroomWebhookUrl();
    if (webhookUrl) {
      sendRegistrationToGoogleSheet(regPayload, webhookUrl).catch((err) => {
        console.warn('Google Sheet sync warn:', err);
      });
    }
  } catch (err) {
    console.warn('Could not post to Google Sheet:', err);
  }

  return newRecord;
}

// Sync enrollment status from Google Sheet
export async function syncStudentEnrollmentsFromGoogleSheet(
  phone?: string
): Promise<CourseEnrollmentRecord[]> {
  try {
    const sheetRows = await fetchRegistrationsFromGoogleSheet();
    const localEnrollments = getAllEnrollments();
    let hasUpdates = false;

    for (const item of sheetRows) {
      const itemPhone = item.phone.trim().replace(/^'/, '');
      const itemTrx = (item.trxId || '').trim().toUpperCase();
      const rawStatus = item.status;
      const normalized = normalizeStatus(rawStatus);

      // Match by phone and trx or phone and course
      for (const enc of localEnrollments) {
        const encPhone = enc.studentPhone.trim().replace(/^'/, '');
        const encTrx = enc.trxId.trim().toUpperCase();

        const phoneMatches = encPhone === itemPhone;
        const trxMatches = encTrx && itemTrx && encTrx === itemTrx;
        const courseMatches =
          item.course.toLowerCase().includes(enc.mentorSlug) ||
          item.course.toLowerCase().includes(enc.courseTitle.toLowerCase());

        if ((phoneMatches && trxMatches) || (phoneMatches && courseMatches)) {
          if (enc.status !== normalized) {
            enc.status = normalized;
            enc.verifiedAt = new Date().toISOString();
            hasUpdates = true;
          }
        }
      }
    }

    if (hasUpdates && typeof window !== 'undefined') {
      localStorage.setItem(
        ENROLLMENTS_STORAGE_KEY,
        JSON.stringify(localEnrollments)
      );
      window.dispatchEvent(
        new CustomEvent('student:enrollment_updated', { detail: {} })
      );
    }

    if (phone) {
      const clean = phone.trim().replace(/^'/, '');
      return localEnrollments.filter((e) => e.studentPhone.replace(/^'/, '') === clean);
    }

    return localEnrollments;
  } catch (err) {
    console.warn('Error syncing enrollments from Google Sheet:', err);
    return getAllEnrollments();
  }
}

// Update status directly (for Admin Panel toggle: OK / FAKE / PENDING)
export function setEnrollmentStatus(
  id: string,
  newStatus: 'pending' | 'ok' | 'fake'
): void {
  if (typeof window === 'undefined') return;
  try {
    const list = getAllEnrollments();
    const updated = list.map((e) =>
      e.id === id ? { ...e, status: newStatus, verifiedAt: new Date().toISOString() } : e
    );
    localStorage.setItem(ENROLLMENTS_STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(
      new CustomEvent('student:enrollment_updated', { detail: { id, newStatus } })
    );
  } catch (err) {
    console.error('Failed to update enrollment status:', err);
  }
}
