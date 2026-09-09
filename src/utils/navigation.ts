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

export const STANDALONE_ROUTES = new Set(['/salami', '/wallet', '/admin', '/chithi', '/allf', '/allu']);

export function isValidRoute(pathname: string): boolean {
  const normalized = pathname.replace(/\/+$/, '') || '/';
  return Boolean(SECTION_ROUTES[normalized] || STANDALONE_ROUTES.has(normalized));
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
