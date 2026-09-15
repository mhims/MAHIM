/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { SiteProvider } from './context/SiteContext';
import { SalamiPage } from './components/SalamiPage';
import { WalletPage } from './components/WalletPage';
import { ChithiPage } from './components/ChithiPage';
import { DriveGatewayPage } from './components/DriveGatewayPage';
import { ClassroomPage } from './components/ClassroomPage';
import { ClassroomCoursesPage } from './components/ClassroomCoursesPage';
import { ClassroomInstructorPage } from './components/ClassroomInstructorPage';
import { ClassroomBlogListPage } from './components/ClassroomBlogListPage';
import { ClassroomBlogDetailPage } from './components/ClassroomBlogDetailPage';
import { TeacherProfilePage } from './components/TeacherProfilePage';
import { ClassroomMentorshipHubPage } from './components/ClassroomMentorshipHubPage';
import { ClassroomMentorshipDetailPage } from './components/ClassroomMentorshipDetailPage';
import { ExternalCourseDetailPage } from './components/ExternalCourseDetailPage';
import { PortfolioPage } from './components/PortfolioPage';
import { MahimsWorldHome } from './components/MahimsWorldHome';
import { ClassroomMobileDock } from './components/ClassroomMobileDock';
import { SECTION_ROUTES, isValidRoute } from './utils/navigation';
import { trackPageView, getActiveWebhookUrl } from './utils/visitorTracker';

export default function App() {
  const [currentPath, setCurrentPath] = useState(() => {
    if (typeof window === 'undefined') return '/';
    // Check if GitHub Pages 404 stored intended SPA redirect path
    try {
      const spaRedirect = sessionStorage.getItem('spa_redirect');
      if (spaRedirect) {
        sessionStorage.removeItem('spa_redirect');
        const cleanRedirect = spaRedirect.replace(/\/+$/, '') || '/';
        if (window.history.replaceState) {
          window.history.replaceState(null, '', cleanRedirect);
        }
        if (isValidRoute(cleanRedirect)) {
          return cleanRedirect;
        }
      }
    } catch {
      // ignore
    }

    // Support both: If user enters with hash (e.g. #about or #salami or #wallet), immediately resolve and clean URL
    let path = window.location.pathname.replace(/\/+$/, '') || '/';
    if (window.location.hash) {
      path = ('/' + window.location.hash.replace(/^#[/]?/, '')).replace(/\/+$/, '') || '/';
    }

    // Auto-redirect 404 / unknown routes to homepage for clean SEO & user experience
    if (!isValidRoute(path)) {
      if (window.history.replaceState) {
        window.history.replaceState(null, '', '/');
      }
      return '/';
    }

    if (window.location.hash && window.history.replaceState) {
      window.history.replaceState(null, '', path);
    }
    return path;
  });

  const isSalami = currentPath === '/salami';
  const isWallet = currentPath === '/wallet';
  const isChithi = currentPath === '/chithi';
  const isAllF = currentPath === '/allf';
  const isAllU = currentPath === '/allu';
  const isAllL = currentPath === '/alll';
  const isClassroom = currentPath === '/classroom';
  const isClassroomBlogList = currentPath === '/classroom/blog';
  const isClassroomBlogDetail =
    currentPath.startsWith('/classroom/blog/') &&
    currentPath !== '/classroom/blog';
  const classroomBlogSlug = isClassroomBlogDetail ? currentPath.replace('/classroom/blog/', '') : '';
  const isClassroomInstructor = currentPath === '/classroom/instructor' || currentPath === '/classroom/instructors';
  const isClassroomCourses = currentPath === '/classroom/courses';
  const isMentorshipHub =
    currentPath === '/classroom/courses/mentorship' ||
    currentPath === '/classroom/mentorship' ||
    currentPath === '/courses/mentorship';
  const isMentorshipCourse =
    (currentPath.startsWith('/classroom/courses/mentorship/') &&
      currentPath !== '/classroom/courses/mentorship') ||
    (currentPath.startsWith('/courses/mentorship/') &&
      currentPath !== '/courses/mentorship');
  const mentorSlug = isMentorshipCourse
    ? currentPath
        .replace('/classroom/courses/mentorship/', '')
        .replace('/courses/mentorship/', '')
        .replace(/\/+$/, '')
    : '';
  const isOctalCourse = currentPath === '/classroom/courses/octal-1-hsc-ict';
  const isBanglaBossCourse = currentPath === '/classroom/courses/bangla-boss-2-course';
  const isExternalCourse = isOctalCourse || isBanglaBossCourse;
  const isTeacherProfile =
    currentPath.startsWith('/classroom/') &&
    !isClassroomInstructor &&
    !isClassroomCourses &&
    !isClassroomBlogList &&
    !isClassroomBlogDetail &&
    !isMentorshipHub &&
    !isMentorshipCourse &&
    !isExternalCourse;
  const teacherSlug = isTeacherProfile ? currentPath.replace('/classroom/', '') : '';
  const isPortfolio =
    currentPath === '/portfolio' ||
    currentPath === '/about' ||
    currentPath === '/skills' ||
    currentPath === '/experience' ||
    currentPath === '/education' ||
    currentPath === '/blog' ||
    currentPath === '/contact';

  // Live Visitor Analytics (Tracks IP, device, OS, browser, duration to Google Sheets)
  useEffect(() => {
    const webhookUrl = getActiveWebhookUrl();
    if (!webhookUrl) return;
    const cleanup = trackPageView(webhookUrl, currentPath);
    return cleanup;
  }, [currentPath]);

  useEffect(() => {
    const handleUrlChange = () => {
      let path = window.location.pathname.replace(/\/+$/, '') || '/';
      if (window.location.hash) {
        path = ('/' + window.location.hash.replace(/^#[/]?/, '')).replace(/\/+$/, '') || '/';
      }

      if (!isValidRoute(path)) {
        if (window.history.replaceState) {
          window.history.replaceState(null, '', '/');
        }
        path = '/';
      } else if (window.location.hash && window.history.replaceState) {
        window.history.replaceState(null, '', path);
      }
      setCurrentPath(path);

      const sectionId = SECTION_ROUTES[path];
      if (sectionId) {
        if (sectionId === 'home') {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
          document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
        }
      }
    };

    const handleCustomRoute = (e: Event) => {
      const customEvent = e as CustomEvent<{ path: string }>;
      if (customEvent.detail?.path) {
        setCurrentPath(customEvent.detail.path);
      }
    };

    window.addEventListener('popstate', handleUrlChange);
    window.addEventListener('hashchange', handleUrlChange);
    window.addEventListener('app:routechange', handleCustomRoute);

    // Initial scroll to section if URL is /about, /skills, /experience, etc.
    const initialSection = SECTION_ROUTES[currentPath];
    if (initialSection && initialSection !== 'home') {
      const timer = setTimeout(() => {
        document.getElementById(initialSection)?.scrollIntoView({ behavior: 'smooth' });
      }, 350);
      return () => {
        clearTimeout(timer);
        window.removeEventListener('popstate', handleUrlChange);
        window.removeEventListener('hashchange', handleUrlChange);
        window.removeEventListener('app:routechange', handleCustomRoute);
      };
    }

    return () => {
      window.removeEventListener('popstate', handleUrlChange);
      window.removeEventListener('hashchange', handleUrlChange);
      window.removeEventListener('app:routechange', handleCustomRoute);
    };
  }, [currentPath]);

  // Clean scroll spy to keep browser URL in sync without hashes
  useEffect(() => {
    if (isSalami || isWallet || isChithi) return;

    let timeoutId: number;
    const sections = ['home', 'about', 'skills', 'experience', 'education', 'blog', 'contact'];

    const handleScroll = () => {
      window.clearTimeout(timeoutId);
      timeoutId = window.setTimeout(() => {
        const scrollPos = window.scrollY + 250;
        for (let i = sections.length - 1; i >= 0; i--) {
          const sectionId = sections[i];
          const el = document.getElementById(sectionId);
          if (el && scrollPos >= el.offsetTop) {
            const targetPath = sectionId === 'home' ? '/' : `/${sectionId}`;
            if (
              window.location.pathname !== targetPath &&
              window.location.pathname !== '/salami' &&
              window.location.pathname !== '/wallet' &&
              window.location.pathname !== '/chithi'
            ) {
              window.history.replaceState(null, '', targetPath);
            }
            break;
          }
        }
      }, 150);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.clearTimeout(timeoutId);
    };
  }, [
    isSalami,
    isWallet,
    isChithi,
    isAllF,
    isAllU,
    isAllL,
    isClassroom,
    isClassroomCourses,
    isClassroomInstructor,
    isMentorshipHub,
    isMentorshipCourse,
    isOctalCourse,
    isBanglaBossCourse,
    isTeacherProfile,
  ]);

  if (isSalami) {
    return <SalamiPage />;
  }

  if (isWallet) {
    return <WalletPage />;
  }

  if (isChithi) {
    return <ChithiPage />;
  }

  if (isAllF) {
    return <DriveGatewayPage mode="allf" />;
  }

  if (isAllU) {
    return <DriveGatewayPage mode="allu" />;
  }

  if (isAllL) {
    return <DriveGatewayPage mode="alll" />;
  }

  if (isOctalCourse) {
    return (
      <>
        <ExternalCourseDetailPage courseId="octal-1-hsc-ict" />
        <ClassroomMobileDock currentPath={currentPath} />
      </>
    );
  }

  if (isBanglaBossCourse) {
    return (
      <>
        <ExternalCourseDetailPage courseId="bangla-boss-2-course" />
        <ClassroomMobileDock currentPath={currentPath} />
      </>
    );
  }

  if (isMentorshipCourse) {
    return (
      <>
        <ClassroomMentorshipDetailPage slug={mentorSlug} />
        <ClassroomMobileDock currentPath={currentPath} />
      </>
    );
  }

  if (isMentorshipHub) {
    return (
      <>
        <ClassroomMentorshipHubPage />
        <ClassroomMobileDock currentPath={currentPath} />
      </>
    );
  }

  if (isClassroomCourses) {
    return (
      <>
        <ClassroomCoursesPage />
        <ClassroomMobileDock currentPath={currentPath} />
      </>
    );
  }

  if (isClassroomInstructor) {
    return (
      <>
        <ClassroomInstructorPage />
        <ClassroomMobileDock currentPath={currentPath} />
      </>
    );
  }

  if (isClassroomBlogDetail) {
    return (
      <>
        <ClassroomBlogDetailPage slug={classroomBlogSlug} />
        <ClassroomMobileDock currentPath={currentPath} />
      </>
    );
  }

  if (isClassroomBlogList) {
    return (
      <>
        <ClassroomBlogListPage />
        <ClassroomMobileDock currentPath={currentPath} />
      </>
    );
  }

  if (isTeacherProfile) {
    return (
      <>
        <TeacherProfilePage slug={teacherSlug} />
        <ClassroomMobileDock currentPath={currentPath} />
      </>
    );
  }

  if (isClassroom || currentPath.startsWith('/classroom')) {
    return (
      <>
        <ClassroomPage />
        <ClassroomMobileDock currentPath={currentPath} />
      </>
    );
  }

  if (isPortfolio) {
    const initialSection = currentPath !== '/portfolio' ? SECTION_ROUTES[currentPath] : undefined;
    return (
      <SiteProvider>
        <PortfolioPage initialSection={initialSection} />
      </SiteProvider>
    );
  }

  return (
    <SiteProvider>
      <MahimsWorldHome />
    </SiteProvider>
  );
}
