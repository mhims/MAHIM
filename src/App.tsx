/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
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

export default function App() {
  return (
    <SiteProvider>
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
