import { TEACHERS, TeacherProfile } from '../data/teachers';

export type { TeacherProfile };

const STORAGE_KEY = 'mahims_classroom_teachers_v1';

export function getLiveTeachers(): Record<string, TeacherProfile> {
  if (typeof window === 'undefined') return TEACHERS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') return parsed;
    }
  } catch {
    // ignore
  }
  return TEACHERS;
}

export function getLiveTeachersArray(): TeacherProfile[] {
  const map = getLiveTeachers();
  return Object.values(map);
}

export async function addLiveTeacher(teacher: TeacherProfile): Promise<boolean> {
  const current = { ...getLiveTeachers() };
  current[teacher.slug] = teacher;
  return saveLiveTeachers(current);
}

export async function updateLiveTeacher(teacher: TeacherProfile): Promise<boolean> {
  const current = { ...getLiveTeachers() };
  current[teacher.slug] = teacher;
  return saveLiveTeachers(current);
}

export async function deleteLiveTeacher(slugOrId: string): Promise<boolean> {
  const current = { ...getLiveTeachers() };
  delete current[slugOrId];
  return saveLiveTeachers(current);
}

export async function resetLiveTeachersToDefault(): Promise<boolean> {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEY);
  }
  return saveLiveTeachers(TEACHERS);
}

export function generateTeachersTypeScriptCode(teachers: Record<string, TeacherProfile>): string {
  return `export interface TeacherProfile {
  id: string;
  slug: string;
  name: string;
  englishName?: string;
  role: string;
  institution: string;
  photoUrl: string;
  bannerGradient: string;
  tagline: string;
  shortBio: string;
  metaTitle: string;
  metaDescription: string;
  highlights: {
    label: string;
    value: string;
    subtext?: string;
    badge?: string;
  }[];
  education: {
    institution: string;
    degree: string;
    session?: string;
    status: string;
    tag?: string;
  }[];
  admissionOffers?: {
    institution: string;
    subject: string;
    session?: string;
    code: string;
  }[];
  meritRank?: {
    examName: string;
    rank: string;
    session: string;
  };
  achievements?: {
    exam: string;
    gpa: string;
    group: string;
    board: string;
    year: string;
  }[];
  teachingPhilosophy: string;
}

export const TEACHERS: Record<string, TeacherProfile> = ${JSON.stringify(teachers, null, 2)};
`;
}

export async function saveLiveTeachers(teachers: Record<string, TeacherProfile>): Promise<boolean> {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(teachers));
    } catch {
      // ignore
    }
  }

  try {
    const fileContent = generateTeachersTypeScriptCode(teachers);
    const res = await fetch('/api/save-teachers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fileContent }),
    });
    return res.ok;
  } catch {
    return false;
  }
}
