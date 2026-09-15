/**
 * Universal Clean Navigation Utility for mahims.com
 * Handles clean URLs without '#' (e.g. /about, /skills, /blog, /salami)
 */
import type { MouseEvent } from 'react';

export const SECTION_ROUTES: Record<string, string> = {
  '/': 'home',
  '/home': 'home',
  '/about': 'about',
  '/skills': 'skills',
  '/experience': 'experience',
  '/education': 'education',
  '/blog': 'blog',
  '/contact': 'contact',
};

export const STANDALONE_ROUTES = new Set([
  '/portfolio',
  '/salami',
  '/wallet',
  '/admin',
  '/chithi',
  '/allf',
  '/allu',
  '/alll',
  '/classroom',
  '/classroom/blog',
  '/classroom/instructor',
  '/classroom/instructors',
  '/classroom/courses',
  '/classroom/courses/octal-1-hsc-ict',
  '/classroom/courses/bangla-boss-2-course',
  '/classroom/courses/mentorship',
  '/classroom/mentorship',
  '/classroom/courses/mentorship/mentorship-program-combo',
  '/classroom/courses/mentorship/abu-saleh-suza',
  '/classroom/courses/mentorship/samiul-islam-sohorab',
  '/classroom/courses/mentorship/mishkat-sharif-mithen',
  '/classroom/courses/mentorship/mahim-ibn-khudi',
  '/courses/mentorship/abu-saleh-suza',
  '/courses/mentorship/samiul-islam-sohorab',
  '/courses/mentorship/mishkat-sharif-mithen',
  '/courses/mentorship/mahim-ibn-khudi',
  '/courses/mentorship/mentorship-program-combo',
  '/classroom/courses/mentorship/suza',
  '/classroom/courses/mentorship/mithen',
  '/classroom/courses/mentorship/samiul',
  '/classroom/courses/mentorship/mahim',
  '/classroom/courses/mentorship/swocchol',
  '/classroom/mahim',
  '/classroom/samiul',
  '/classroom/suza',
  '/classroom/mithen',
  '/classroom/swocchol'
]);

export function isValidRoute(pathname: string): boolean {
  const normalized = pathname.replace(/\/+$/, '') || '/';
  if (SECTION_ROUTES[normalized] || STANDALONE_ROUTES.has(normalized)) {
    return true;
  }
  // Allow dynamic /classroom/:slug and /courses/:slug
  if (normalized.startsWith('/classroom/') || normalized.startsWith('/courses/')) {
    return true;
  }
  return false;
}

export const navigateTo = (path: string, event?: MouseEvent) => {
  if (event) {
    event.preventDefault();
  }

  // Normalize path
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  const sectionId = SECTION_ROUTES[cleanPath];

  // Update browser history with clean URL (no hash)
  if (window.location.pathname !== cleanPath) {
    window.history.pushState(null, '', cleanPath);
  }

  // If it matches a section on the main page, smoothly scroll to it
  if (sectionId) {
    if (sectionId === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }

  // Dispatch custom route change event for components to react
  window.dispatchEvent(new CustomEvent('app:routechange', { detail: { path: cleanPath } }));
};
