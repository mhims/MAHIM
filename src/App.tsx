/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { SiteProvider } from './context/SiteContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Skills } from './components/Skills';
import { Experience } from './components/Experience';
import { Education } from './components/Education';
import { BlogSection } from './components/BlogSection';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { WhatsAppButton } from './components/WhatsAppButton';
import { MobileAppDock } from './components/MobileAppDock';
import { AdminModal } from './components/AdminModal';
import { AuthModal } from './components/AuthModal';
import { DynamicSEO } from './components/DynamicSEO';
import { SalamiPage } from './components/SalamiPage';
import { WalletPage } from './components/WalletPage';
import { ChithiPage } from './components/ChithiPage';
import { DriveGatewayPage } from './components/DriveGatewayPage';
import { ClassroomPage } from './components/ClassroomPage';
import { SECTION_ROUTES, isValidRoute } from './utils/navigation';

export default function App() {
  const [currentPath, setCurrentPath] = useState(() => {
    if (typeof window === 'undefined') return '/';
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
  }, [isSalami, isWallet, isChithi, isAllF, isAllU, isAllL, isClassroom]);

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

  if (isClassroom) {
    return <ClassroomPage />;
  }

  return (
    <SiteProvider>
      <DynamicSEO />
      <div className="min-h-screen bg-[#fdfdfb] dark:bg-[#0c0a09] text-[#1a1a1a] dark:text-zinc-100 flex flex-col selection:bg-amber-500 selection:text-black font-sans transition-colors duration-200">
        <Navbar />
        <main className="flex-grow pb-16 lg:pb-0">
          <Hero />
          <About />
          <Skills />
          <Experience />
          <Education />
          <BlogSection />
          <Contact />
        </main>
        <Footer />
        <WhatsAppButton />
        <MobileAppDock />
        <AdminModal />
        <AuthModal />
      </div>
    </SiteProvider>
  );
}
