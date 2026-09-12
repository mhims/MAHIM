import React, { useEffect } from 'react';
import { Navbar } from './Navbar';
import { Hero } from './Hero';
import { About } from './About';
import { Skills } from './Skills';
import { Experience } from './Experience';
import { Education } from './Education';
import { BlogSection } from './BlogSection';
import { Contact } from './Contact';
import { Footer } from './Footer';
import { WhatsAppButton } from './WhatsAppButton';
import { MobileAppDock } from './MobileAppDock';
import { AdminModal } from './AdminModal';
import { AuthModal } from './AuthModal';
import { DynamicSEO } from './DynamicSEO';
import { navigateTo } from '../utils/navigation';
import { ArrowLeft, Sparkles, Layers, Briefcase } from 'lucide-react';

interface PortfolioPageProps {
  initialSection?: string;
}

export const PortfolioPage: React.FC<PortfolioPageProps> = ({ initialSection }) => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    if (initialSection && initialSection !== 'home') {
      const timer = setTimeout(() => {
        document.getElementById(initialSection)?.scrollIntoView({ behavior: 'smooth' });
      }, 250);
      return () => clearTimeout(timer);
    }
  }, [initialSection]);

  return (
    <div className="min-h-screen bg-[#fdfdfb] dark:bg-[#0c0a09] text-[#1a1a1a] dark:text-zinc-100 flex flex-col selection:bg-amber-500 selection:text-black font-sans transition-colors duration-200">
      <DynamicSEO />
      
      {/* Top Banner indicating this is the Professional Portfolio view */}
      <div className="bg-amber-500/10 dark:bg-amber-500/15 border-b border-amber-500/20 text-xs py-2 px-4 relative z-30">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 font-['Hind_Siliguri',sans-serif]">
          <div className="flex items-center gap-2 text-zinc-800 dark:text-zinc-200 font-semibold">
            <Briefcase size={14} className="text-amber-600 dark:text-amber-400 shrink-0" />
            <span>প্রফেশনাল পোর্টফোলিও ও ক্যারিয়ার প্রোফাইল (Career & Stack)</span>
          </div>

          <button
            onClick={(e) => navigateTo('/', e)}
            className="px-3 py-1 rounded-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:text-black dark:hover:text-white font-bold text-[11px] shadow-xs flex items-center gap-1.5 transition-all hover:scale-102 cursor-pointer active:scale-98"
          >
            <ArrowLeft size={12} />
            <span>মাহিম’স ওয়ার্ল্ডে ফিরুন (Home)</span>
          </button>
        </div>
      </div>

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
  );
};
