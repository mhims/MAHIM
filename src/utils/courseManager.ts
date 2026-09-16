import { ALL_COURSES, CourseItem } from '../data/courses';

const STORAGE_KEY = 'mahims_classroom_courses_v2';

export function getLiveCourses(): CourseItem[] {
  if (typeof window === 'undefined') return ALL_COURSES;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('Failed to parse courses from localStorage:', err);
  }
  return ALL_COURSES;
}

export function generateCoursesTypeScriptCode(courses: CourseItem[]): string {
  return `export interface CourseItem {
  id: string;
  title: string;
  category: 'admission' | 'hsc' | 'ssc' | 'junior' | 'skills' | 'mentorship' | string;
  categoryLabel: string;
  targetBadge?: string;
  description: string;
  fullDescription?: string;
  highlights: string[];
  courseFeatures?: string[];
  whyThisCourse?: {
    title: string;
    text: string;
    tagline?: string;
  };
  instructors?: {
    main: string;
    co: string;
  };
  status: 'active' | 'launching_soon' | 'upcoming' | 'planning';
  isFeatured?: boolean;
  showOnMainPage?: boolean;
  actionText?: string;
  actionUrl?: string;
  externalBuyUrl?: string;
  imageUrl?: string;
  price?: string;
  originalPrice?: string;
}

export const ALL_COURSES: CourseItem[] = ${JSON.stringify(courses, null, 2)};

export function getMainPageCourses(): CourseItem[] {
  return ALL_COURSES.filter((course) => course.showOnMainPage === true);
}
`;
}

export async function saveLiveCourses(courses: CourseItem[]): Promise<boolean> {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(courses));
    } catch (err) {
      console.error('Failed to save courses to localStorage:', err);
    }
  }

  // Attempt to sync directly to disk in Vite environment
  try {
    const fileContent = generateCoursesTypeScriptCode(courses);
    const res = await fetch('/api/save-courses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fileContent }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function addLiveCourse(newCourse: CourseItem): Promise<boolean> {
  const current = getLiveCourses();
  const exists = current.some((c) => c.id === newCourse.id);
  const updated = exists
    ? current.map((c) => (c.id === newCourse.id ? newCourse : c))
    : [newCourse, ...current];
  return await saveLiveCourses(updated);
}

export async function updateLiveCourse(updatedCourse: CourseItem): Promise<boolean> {
  const current = getLiveCourses();
  const updated = current.map((c) => (c.id === updatedCourse.id ? updatedCourse : c));
  return await saveLiveCourses(updated);
}

export async function deleteLiveCourse(id: string): Promise<boolean> {
  const current = getLiveCourses();
  const updated = current.filter((c) => c.id !== id);
  return await saveLiveCourses(updated);
}

export async function resetLiveCoursesToDefault(): Promise<boolean> {
  if (typeof window !== 'undefined') {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  }
  return await saveLiveCourses(ALL_COURSES);
}
