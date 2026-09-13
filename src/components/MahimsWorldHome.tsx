import React, { useState, useEffect } from 'react';
import { useSite } from '../context/SiteContext';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { WhatsAppButton } from './WhatsAppButton';
import { MobileAppDock } from './MobileAppDock';
import { AdminModal } from './AdminModal';
import { AuthModal } from './AuthModal';
import { DynamicSEO } from './DynamicSEO';
import { navigateTo } from '../utils/navigation';
import { motion } from 'motion/react';
import {
  GraduationCap,
  Briefcase,
  Palette,
  Workflow,
  BookOpen,
  Camera,
  ShoppingBag,
  Mail,
  Sparkles,
  ArrowRight,
  ArrowDown,
  ExternalLink,
  Compass,
  CheckCircle2,
  Heart,
  FileText,
  X,
  ChevronRight,
  Gift
} from 'lucide-react';

export const MahimsWorldHome: React.FC = () => {
  const { settings } = useSite();

  // Modals for interactive exploration
  const [activeModal, setActiveModal] = useState<
    'none' | 'graphics_n8n' | 'theology' | 'memories' | 'shop'
  >('none');

  const [shopEmail, setShopEmail] = useState('');
  const [shopSubscribed, setShopSubscribed] = useState(false);

  // Typewriter effect state
  const phrases = [
    'শিক্ষা, চিন্তাভাবনা ও মুক্ত দর্শনের মিলনমেলা',
    'ক্রিয়েটিভ ডিজাইন, অটোমেশন ও উদ্ভাবনী প্রজেক্টস',
    'স্মৃতির সরণি ও জীবনের নানা টুকরো ভাবনার এক উন্মুক্ত অঙ্গন',
    'Explore all universes of thoughts and creativity',
  ];
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [typewriterText, setTypewriterText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentPhrase = phrases[currentPhraseIndex];
    const typingSpeed = isDeleting ? 30 : 65;

    if (!isDeleting && typewriterText === currentPhrase) {
      const pauseTimeout = setTimeout(() => {
        setIsDeleting(true);
      }, 1900);
      return () => clearTimeout(pauseTimeout);
    } else if (isDeleting && typewriterText === '') {
      setIsDeleting(false);
      setCurrentPhraseIndex((prev) => (prev + 1) % phrases.length);
      return;
    }

    const timeout = setTimeout(() => {
      setTypewriterText((prev) =>
        isDeleting
          ? currentPhrase.substring(0, prev.length - 1)
          : currentPhrase.substring(0, prev.length + 1)
      );
    }, typingSpeed);

    return () => clearTimeout(timeout);
  }, [typewriterText, isDeleting, currentPhraseIndex]);

  // User's official portrait
  const userPhotoUrl =
    'https://res.cloudinary.com/drvyjj7td/image/upload/v1788629825/MAHIMIBNEKHUDI_wafylv.png';

  return (
    <div className="min-h-screen bg-[#fafaf9] dark:bg-[#090d16] text-zinc-900 dark:text-zinc-100 flex flex-col font-sans transition-colors duration-200 selection:bg-amber-500 selection:text-black relative overflow-x-hidden">
      <DynamicSEO />
      <Navbar />

      {/* ========================================================================= */}
      {/* Background Decorative Dot Grid Pattern (Classroom-style)                  */}
      {/* ========================================================================= */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] sm:w-[1200px] h-[580px] rounded-full bg-gradient-to-b from-amber-200/45 dark:from-amber-500/10 via-orange-100/25 dark:via-orange-500/5 to-transparent blur-[130px] animate-pulse-glow" />
        <div className="absolute top-[35%] -right-28 w-[460px] h-[460px] rounded-full bg-orange-100/40 dark:bg-orange-950/15 blur-[120px] animate-float-3d" />
        <div className="absolute top-[65%] -left-28 w-[500px] h-[500px] rounded-full bg-amber-100/35 dark:bg-amber-950/15 blur-[130px] animate-float-3d-reverse" />
        <div
          className="absolute inset-0 opacity-45 dark:opacity-20"
          style={{
            backgroundImage: `radial-gradient(#f97316 0.85px, transparent 0.85px)`,
            backgroundSize: '28px 28px',
          }}
        />
      </div>

      <main className="flex-grow pb-24 lg:pb-16 relative z-10">
        {/* ========================================================================= */}
        {/* 1. HERO SECTION: Mahim's World (New Font & Gradient), Typewriter & Subtext */}
        {/* ========================================================================= */}
        <section className="relative overflow-hidden pt-24 pb-6 sm:pt-28 sm:pb-14 lg:pt-32 lg:pb-16 border-b border-black/5 dark:border-white/5">
          <div className="w-full max-w-7xl 2xl:max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-4 sm:space-y-5 max-w-5xl mx-auto"
            >
              {/* Requested small font badge with exact Bengali text - Just slightly lowered so the full pill circle is visible */}
              <div>
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95, y: -6 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.05, ease: 'easeOut' }}
                  whileHover={{ scale: 1.03 }}
                  className="inline-flex items-center gap-2 px-4 py-1.5 sm:px-5 sm:py-2 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-800 dark:text-amber-300 text-xs sm:text-sm font-semibold font-['Hind_Siliguri',sans-serif] shadow-xs backdrop-blur-md cursor-default select-none"
                >
                  <Sparkles size={14} className="text-amber-500" />
                  <span>মাহিম ইবনে খুদি এর ডিজিটাল জগতে স্বাগতম</span>
                </motion.div>
              </div>

              {/* Mahim's World: Solid, crisp display typography with distinct amber accent */}
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
                className="text-4xl sm:text-7xl lg:text-8xl font-black tracking-tight leading-[1.08] font-['Outfit',sans-serif] select-none"
              >
                <span className="text-zinc-950 dark:text-white">Mahim&apos;s </span>
                <span className="text-amber-500 dark:text-amber-400 inline-block hover:scale-105 transition-transform duration-300">World</span>
              </motion.h1>

              {/* Typewriter animated text with pulse dot */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.25 }}
                className="min-h-[36px] sm:min-h-[52px] flex items-center justify-center gap-2.5"
              >
                <span className="inline-block w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping" />
                <p className="text-sm sm:text-2xl font-bold font-['Hind_Siliguri',sans-serif] text-amber-600 dark:text-amber-400">
                  <span>{typewriterText}</span>
                  <span className="inline-block w-0.5 h-4 sm:h-6 ml-1 bg-amber-500 animate-pulse align-middle" />
                </p>
              </motion.div>

              {/* Static descriptive subtext underneath typewriter effect so it doesn't feel empty */}
              <motion.p 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.35 }}
                className="max-w-2xl mx-auto text-xs sm:text-base text-zinc-600 dark:text-zinc-400 font-['Hind_Siliguri',sans-serif] leading-relaxed pt-1"
              >
                আমার চিন্তা, শিক্ষা, প্রযুক্তি, দর্শন ও সৃষ্টিশীল নানা কাজের সমন্বিত এক মুক্ত ডিজিটাল ভুবন। জীবনের নানা টুকরো ভাবনা ও সম্ভাবনার এক উন্মুক্ত অঙ্গন।
              </motion.p>

              {/* Single English Explore button with smooth scroll to welcome section & ecosystem anchor tags */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.45 }}
                className="pt-2 sm:pt-4 flex flex-col items-center justify-center gap-3.5"
              >
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  type="button"
                  onClick={() => {
                    const el = document.getElementById('welcome-profile');
                    if (el) {
                      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                  }}
                  className="px-9 py-3.5 rounded-full bg-amber-500 hover:bg-amber-600 text-black font-black text-sm tracking-wide shadow-xl shadow-amber-500/25 hover:shadow-amber-500/40 transition-all flex items-center gap-2.5 cursor-pointer group font-['Outfit',sans-serif]"
                >
                  <span>Explore</span>
                  <ArrowRight size={16} className="group-hover:translate-x-1.5 transition-transform duration-200" />
                </motion.button>

                {/* Mobile & Desktop Anchor Chips: eliminates empty void under Explore */}
                <div className="flex flex-wrap items-center justify-center gap-2.5 pt-1">
                  <motion.span 
                    whileHover={{ scale: 1.05 }}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white/95 dark:bg-zinc-800/95 border border-zinc-200/90 dark:border-zinc-700/70 text-zinc-700 dark:text-zinc-300 shadow-sm transition-all hover:border-amber-500/50"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                    ৪টি মুক্ত অঙ্গন
                  </motion.span>
                  <motion.span 
                    whileHover={{ scale: 1.05 }}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white/95 dark:bg-zinc-800/95 border border-zinc-200/90 dark:border-zinc-700/70 text-zinc-700 dark:text-zinc-300 shadow-sm transition-all hover:border-blue-500/50"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                    মাহিম’স ক্লাসরুম
                  </motion.span>
                  <motion.span 
                    whileHover={{ scale: 1.05 }}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white/95 dark:bg-zinc-800/95 border border-zinc-200/90 dark:border-zinc-700/70 text-zinc-700 dark:text-zinc-300 shadow-sm transition-all hover:border-emerald-500/50"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    প্রযুক্তি ও দর্শন
                  </motion.span>
                </div>

                {/* Subtle down scroll indicator connecting smoothly to profile */}
                <button
                  type="button"
                  onClick={() => {
                    document.getElementById('welcome-profile')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="mt-1 inline-flex items-center gap-1.5 text-xs text-zinc-500 hover:text-amber-600 dark:text-zinc-400 dark:hover:text-amber-400 font-medium font-['Hind_Siliguri',sans-serif] transition-colors cursor-pointer group"
                >
                  <span className="group-hover:translate-y-0.5 transition-transform">পরিচিতি ও প্রোফাইল দেখতে স্ক্রোল করুন</span>
                  <ArrowDown size={13} className="animate-bounce text-amber-500" />
                </button>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 2. WELCOME & PORTRAIT SECTION: Smooth Scroll Reveal                         */}
        {/* ========================================================================= */}
        <section id="welcome-profile" className="pt-4 pb-14 sm:pt-14 sm:pb-20 border-b border-black/5 dark:border-white/5">
          <div className="w-full max-w-7xl 2xl:max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-14 2xl:gap-20 bg-white dark:bg-zinc-900/85 p-6 sm:p-10 lg:p-12 xl:p-14 2xl:p-16 rounded-3xl border border-zinc-200/80 dark:border-zinc-800 shadow-md relative overflow-hidden card-3d"
            >
              {/* Background ambient accent for the card */}
              <div className="absolute -top-20 -right-20 w-64 h-64 bg-amber-500/15 rounded-full blur-3xl pointer-events-none animate-pulse-glow" />

              {/* Photo Container: Complete Uncropped Portrait (natural 3:4 aspect ratio, object-contain, zero crop) */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.92, y: 20 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ scale: 1.02 }}
                className="shrink-0 w-full lg:w-auto flex justify-center"
              >
                <div className="w-64 sm:w-80 md:w-96 lg:w-[420px] xl:w-[460px] 2xl:w-[490px] aspect-[3/4] rounded-3xl p-2 bg-gradient-to-b from-amber-500/20 via-zinc-100 dark:via-zinc-800/80 to-amber-500/10 border border-zinc-200/80 dark:border-zinc-800 shadow-xl flex items-center justify-center overflow-hidden transition-transform duration-300">
                  <img
                    src={userPhotoUrl}
                    alt="মাহিম ইবনে খুদি"
                    onError={(e) => {
                      e.currentTarget.src = '/mahim.jpg';
                    }}
                    className="w-full h-full object-contain rounded-2xl"
                  />
                </div>
              </motion.div>

              {/* Short Welcome Message beside the photo */}
              <motion.div 
                initial={{ opacity: 0, x: 25 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="space-y-6 text-center lg:text-left font-['Hind_Siliguri',sans-serif] flex-1 max-w-2xl xl:max-w-3xl"
              >
                <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-400 text-xs font-bold animate-float-3d">
                  <Sparkles size={13} className="text-amber-500" />
                  <span>স্বাগতম বার্তা</span>
                </div>

                <h2 className="text-2xl sm:text-4xl lg:text-4xl xl:text-5xl font-black text-zinc-950 dark:text-white leading-tight">
                  স্বাগতম আমার ব্যক্তিগত ডিজিটাল ভুবনে
                </h2>

                <p className="text-sm sm:text-base lg:text-lg text-zinc-600 dark:text-zinc-300 leading-relaxed">
                  আমার চিন্তাভাবনা, শিক্ষা, সৃষ্টিশীলতা ও ব্যক্তিগত অনুভূতির এক সমন্বিত সংকলন এই প্ল্যাটফর্ম। প্রতিটি অঙ্গনে রয়েছে আমার জীবনের আলাদা একটি কাজের দিক। ঘুরে দেখুন, জানুন এবং ভালো লাগলে আপনার মতামতও জানাতে পারেন।
                </p>

                {/* Working direct-scroll action button */}
                <div className="pt-2 flex items-center justify-center lg:justify-start">
                  <motion.button
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    type="button"
                    onClick={() => {
                      const el = document.getElementById('universe-grid');
                      if (el) {
                        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }
                    }}
                    className="px-7 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-black font-bold text-sm shadow-lg shadow-amber-500/20 hover:shadow-amber-500/35 transition-all flex items-center gap-2 cursor-pointer group"
                  >
                    <span>অঙ্গনসমূহ দেখুন</span>
                    <ArrowDown size={16} className="animate-bounce group-hover:translate-y-0.5 transition-transform" />
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 3. THE UNIVERSE HUB: Smooth Animated Grid (Portfolio 1st, Classroom 2nd)   */}
        {/* ========================================================================= */}
        <section id="universe-grid" className="py-16 sm:py-20 w-full max-w-7xl 2xl:max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 text-left">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-3 mb-12 text-center max-w-2xl mx-auto"
          >
            <h2 className="text-xs font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400 font-mono">
              [ THE ECOSYSTEM • অঙ্গনসমূহ ]
            </h2>
            <h3 className="text-2xl sm:text-4xl font-black text-zinc-950 dark:text-white font-['Hind_Siliguri',sans-serif]">
              আমার জীবনের বিভিন্ন জগত ও কাজের অঙ্গন
            </h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 font-['Hind_Siliguri',sans-serif]">
              যেকোনো একটি অঙ্গন নির্বাচন করে ভেতরে প্রবেশ করুন অথবা বিস্তারিত তথ্য জানুন
            </p>
          </motion.div>

          {/* Clean Grid with Equal Dimensions & Smooth Scroll Reveal */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

            {/* CARD 1: Professional Portfolio (1st on Mobile & All screens) */}
            <motion.div 
              initial={{ opacity: 0, y: 45 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.65, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -8, scale: 1.015, transition: { duration: 0.25 } }}
              className="relative group overflow-hidden rounded-3xl bg-white dark:bg-zinc-900/90 border border-zinc-200 dark:border-zinc-800 p-6 sm:p-7 flex flex-col justify-between shadow-sm hover:shadow-2xl hover:border-indigo-500/50 transition-all duration-300 card-3d"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-600/30 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                    <Briefcase size={24} />
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-100 dark:bg-indigo-950/60 text-indigo-800 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 font-['Hind_Siliguri',sans-serif]">
                    কোডিং ও ক্যারিয়ার
                  </span>
                </div>

                <div>
                  <h4 className="text-xl sm:text-2xl font-black text-zinc-950 dark:text-white font-['Hind_Siliguri',sans-serif]">
                    প্রফেশনাল পোর্টফোলিও ও সিভি
                  </h4>
                  <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 font-['Hind_Siliguri',sans-serif] mt-2 leading-relaxed">
                    সফটওয়্যার ডেভেলপমেন্ট, কোডিং প্রজেক্টস, প্রযুক্তি স্ট্যাক ও কাজের ইতিহাস। আপনার পছন্দের প্রজেক্টগুলো এবং দক্ষতা এক নজরে।
                  </p>
                </div>

                <div className="space-y-1.5 text-xs text-zinc-600 dark:text-zinc-400 font-['Hind_Siliguri',sans-serif]">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                    <span>ফুল-স্ট্যাক ওয়েব অ্যাপ্লিকেশনস ও ডেমো</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                    <span>কাজের অভিজ্ঞতা, স্কিল ও সিভি</span>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <a
                  href="/portfolio"
                  onClick={(e) => navigateTo('/portfolio', e)}
                  className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm font-['Hind_Siliguri',sans-serif] shadow-md shadow-indigo-600/20 flex items-center justify-center gap-2 cursor-pointer transition-all group-hover:shadow-indigo-600/40"
                >
                  <span>সিভি ও পোর্টফোলিও দেখুন</span>
                  <ArrowRight size={15} className="group-hover:translate-x-1.5 transition-transform duration-200" />
                </a>
              </div>
            </motion.div>

            {/* CARD 2: Mahim's Classroom (2nd on Mobile & All screens) */}
            <motion.div 
              initial={{ opacity: 0, y: 45 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.65, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -8, scale: 1.015, transition: { duration: 0.25 } }}
              className="relative group overflow-hidden rounded-3xl bg-white dark:bg-zinc-900/90 border border-zinc-200 dark:border-zinc-800 p-6 sm:p-7 flex flex-col justify-between shadow-sm hover:shadow-2xl hover:border-orange-500/50 transition-all duration-300 card-3d"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-orange-500 text-white flex items-center justify-center shadow-md shadow-orange-500/30 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                    <GraduationCap size={24} />
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-orange-100 dark:bg-orange-950/60 text-orange-800 dark:text-orange-300 border border-orange-200 dark:border-orange-800 font-['Hind_Siliguri',sans-serif]">
                    এডমিশন ও একাডেমি
                  </span>
                </div>

                <div>
                  <h4 className="text-xl sm:text-2xl font-black text-zinc-950 dark:text-white font-['Hind_Siliguri',sans-serif] flex flex-col sm:flex-row sm:items-baseline gap-1">
                    <span>মাহিম’স ক্লাসরুম</span>
                    <span className="text-xs sm:text-sm font-bold text-orange-600 dark:text-orange-400 font-sans tracking-tight">Mahim's Classroom</span>
                  </h4>
                  <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 font-['Hind_Siliguri',sans-serif] mt-2 leading-relaxed">
                    এইচএসসি, এসএসসি ও বিশ্ববিদ্যালয় ভর্তি পরীক্ষার্থীদের জন্য নিবেদিত শিক্ষা প্ল্যাটফর্ম (Mahim Classroom)। স্মার্ট টেস্ট ইঞ্জিন, চ্যাপ্টারভিত্তিক পরীক্ষা ও নিয়মিত মেন্টরশিপ।
                  </p>
                </div>

                <div className="space-y-1.5 text-xs text-zinc-600 dark:text-zinc-400 font-['Hind_Siliguri',sans-serif]">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                    <span>ভার্সিটি এডমিশন স্পেশাল টেস্ট</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                    <span>অনলাইন অটো-রেজিস্ট্রেশন ও ফলাফল</span>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <a
                  href="/classroom"
                  title="Mahim's Classroom (Mahim Classroom) | মাহিম ক্লাসরুম"
                  aria-label="Mahim's Classroom (Mahim Classroom)"
                  onClick={(e) => navigateTo('/classroom', e)}
                  className="w-full py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs sm:text-sm font-['Hind_Siliguri',sans-serif] shadow-md shadow-orange-500/20 flex items-center justify-center gap-2 cursor-pointer transition-all group-hover:shadow-orange-500/40"
                >
                  <span>ক্লাসরুমে প্রবেশ করুন</span>
                  <ArrowRight size={15} className="group-hover:translate-x-1.5 transition-transform duration-200" />
                </a>
              </div>
            </motion.div>

            {/* CARD 3: Graphics Design & Automation */}
            <motion.div 
              initial={{ opacity: 0, y: 45 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.65, delay: 0.19, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -8, scale: 1.015, transition: { duration: 0.25 } }}
              className="relative group overflow-hidden rounded-3xl bg-white dark:bg-zinc-900/90 border border-zinc-200 dark:border-zinc-800 p-6 sm:p-7 flex flex-col justify-between shadow-sm hover:shadow-2xl hover:border-purple-500/50 transition-all duration-300 card-3d"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-purple-600 text-white flex items-center justify-center shadow-md shadow-purple-600/30 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                    <Palette size={24} />
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-100 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300 border border-purple-200 dark:border-purple-800 font-['Hind_Siliguri',sans-serif]">
                    ক্রিয়েটিভ ও অটোমেশন
                  </span>
                </div>

                <div>
                  <h4 className="text-xl sm:text-2xl font-black text-zinc-950 dark:text-white font-['Hind_Siliguri',sans-serif]">
                    গ্রাফিক্স ডিজাইন ও অটোমেশন
                  </h4>
                  <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 font-['Hind_Siliguri',sans-serif] mt-2 leading-relaxed">
                    ভিজ্যুয়াল ক্রিয়েটিভিটি, পোস্টার, লোগো, ব্র্যান্ড আইডেন্টিটি এবং আধুনিক ডিজিটাল নো-কোড ওয়ার্কফ্লো অটোমেশন সলিউশন।
                  </p>
                </div>

                <div className="space-y-1.5 text-xs text-zinc-600 dark:text-zinc-400 font-['Hind_Siliguri',sans-serif]">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                    <span>পোস্টার, সোশ্যাল ব্যানার ও লোগো ডিজাইন</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                    <span>ওয়ার্কফ্লো ও বিজনেস ডাটা অটোমেশন</span>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <button
                  onClick={() => setActiveModal('graphics_n8n')}
                  className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs sm:text-sm font-['Hind_Siliguri',sans-serif] shadow-md shadow-purple-600/20 flex items-center justify-center gap-2 cursor-pointer transition-all group-hover:shadow-purple-600/40"
                >
                  <span>কাজের বিবরণ দেখুন</span>
                  <Sparkles size={15} />
                </button>
              </div>
            </motion.div>

            {/* CARD 4: Theology & Philosophy */}
            <motion.div 
              initial={{ opacity: 0, y: 45 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.65, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -8, scale: 1.015, transition: { duration: 0.25 } }}
              className="relative group overflow-hidden rounded-3xl bg-white dark:bg-zinc-900/90 border border-zinc-200 dark:border-zinc-800 p-6 sm:p-7 flex flex-col justify-between shadow-sm hover:shadow-2xl hover:border-emerald-500/50 transition-all duration-300 card-3d"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-md shadow-emerald-600/30 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                    <Compass size={24} />
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 font-['Hind_Siliguri',sans-serif]">
                    চিন্তালয় ও পাঠ
                  </span>
                </div>

                <div>
                  <h4 className="text-xl sm:text-2xl font-black text-zinc-950 dark:text-white font-['Hind_Siliguri',sans-serif]">
                    ভাবনা ও ইলম (ধর্মতত্ত্ব ও দর্শন)
                  </h4>
                  <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 font-['Hind_Siliguri',sans-serif] mt-2 leading-relaxed">
                    তুলনামূলক ধর্মতত্ত্ব, ইসলাম ও সমকালীন আধুনিক চিন্তাধারা, আত্মশুদ্ধি এবং বুদ্ধিবৃত্তিক সমাজ নিয়ে ব্যক্তিগত পাঠ ও গবেষণামূলক ভাবনা।
                  </p>
                </div>

                <div className="space-y-1.5 text-xs text-zinc-600 dark:text-zinc-400 font-['Hind_Siliguri',sans-serif]">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span>তুলনামূলক ধর্মতত্ত্বের তাত্ত্বিক বিশ্লেষণ</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span>আত্মশুদ্ধি ও আধুনিক জীবনদর্শন</span>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <button
                  onClick={() => setActiveModal('theology')}
                  className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm font-['Hind_Siliguri',sans-serif] shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 cursor-pointer transition-all group-hover:shadow-emerald-600/40"
                >
                  <span>গবেষণার নোটস পড়ুন</span>
                  <ChevronRight size={15} />
                </button>
              </div>
            </motion.div>

            {/* CARD 5: Memories & Childhood Vault */}
            <motion.div 
              initial={{ opacity: 0, y: 45 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.65, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -8, scale: 1.015, transition: { duration: 0.25 } }}
              className="relative group overflow-hidden rounded-3xl bg-white dark:bg-zinc-900/90 border border-zinc-200 dark:border-zinc-800 p-6 sm:p-7 flex flex-col justify-between shadow-sm hover:shadow-2xl hover:border-amber-500/50 transition-all duration-300 card-3d"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-amber-600 text-white flex items-center justify-center shadow-md shadow-amber-600/30 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                    <Camera size={24} />
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800 font-['Hind_Siliguri',sans-serif]">
                    শৈশব ও দিনলিপি
                  </span>
                </div>

                <div>
                  <h4 className="text-xl sm:text-2xl font-black text-zinc-950 dark:text-white font-['Hind_Siliguri',sans-serif]">
                    স্মৃতির সরণি (The Memory Vault)
                  </h4>
                  <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 font-['Hind_Siliguri',sans-serif] mt-2 leading-relaxed">
                    শৈশবের সোনালী দিন, পুরোনো আলোকচিত্র, ফেলে আসা দিনগুলোর অনুভূতি ও ব্যক্তিগত জীবনের এক নস্টালজিক ডায়েরি আর্কাইভ।
                  </p>
                </div>

                <div className="space-y-1.5 text-xs text-zinc-600 dark:text-zinc-400 font-['Hind_Siliguri',sans-serif]">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                    <span>শৈশবের স্কুল দিন ও সোনালী মুহূর্ত</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                    <span>ব্যক্তিগত ডায়েরি ও অপ্রকাশিত পাতা</span>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <button
                  onClick={() => setActiveModal('memories')}
                  className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs sm:text-sm font-['Hind_Siliguri',sans-serif] shadow-md shadow-amber-600/20 flex items-center justify-center gap-2 cursor-pointer transition-all group-hover:shadow-amber-600/40"
                >
                  <span>স্মৃতির অ্যালবাম খুলুন</span>
                  <ChevronRight size={15} />
                </button>
              </div>
            </motion.div>

            {/* CARD 6: Blog & Personal Writings */}
            <motion.div 
              initial={{ opacity: 0, y: 45 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.1 }}
              transition={{ duration: 0.65, delay: 0.19, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -8, scale: 1.015, transition: { duration: 0.25 } }}
              className="relative group overflow-hidden rounded-3xl bg-white dark:bg-zinc-900/90 border border-zinc-200 dark:border-zinc-800 p-6 sm:p-7 flex flex-col justify-between shadow-sm hover:shadow-2xl hover:border-sky-500/50 transition-all duration-300 card-3d"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-sky-600 text-white flex items-center justify-center shadow-md shadow-sky-600/30 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                    <FileText size={24} />
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-sky-100 dark:bg-sky-950/60 text-sky-800 dark:text-sky-300 border border-sky-200 dark:border-sky-800 font-['Hind_Siliguri',sans-serif]">
                    ব্লগ ও প্রবন্ধ
                  </span>
                </div>

                <div>
                  <h4 className="text-xl sm:text-2xl font-black text-zinc-950 dark:text-white font-['Hind_Siliguri',sans-serif]">
                    কালির আঁচড় (ব্যক্তিগত ব্লগ)
                  </h4>
                  <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 font-['Hind_Siliguri',sans-serif] mt-2 leading-relaxed">
                    প্রযুক্তি, শিক্ষাব্যবস্থা, ব্যক্তিগত পর্যবেক্ষণ ও সমসাময়িক বিষয় নিয়ে আমার নিজস্ব মতামত, বিশ্লেষণ এবং ভাবনা প্রকাশের উন্মুক্ত খাতা।
                  </p>
                </div>

                <div className="space-y-1.5 text-xs text-zinc-600 dark:text-zinc-400 font-['Hind_Siliguri',sans-serif]">
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />
                    <span>শিক্ষা ও ক্যারিয়ার বিষয়ক মতামত</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />
                    <span>প্রযুক্তি, অটোমেশন ও ভবিষ্যৎ চিন্তা</span>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <a
                  href="/blog"
                  onClick={(e) => navigateTo('/blog', e)}
                  className="w-full py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs sm:text-sm font-['Hind_Siliguri',sans-serif] shadow-md shadow-sky-600/20 flex items-center justify-center gap-2 cursor-pointer transition-all group-hover:shadow-sky-600/40"
                >
                  <span>ব্লগ সেকশনে যান</span>
                  <ArrowRight size={15} className="group-hover:translate-x-1.5 transition-transform duration-200" />
                </a>
              </div>
            </motion.div>

          </div>
        </section>

        {/* ========================================================================= */}
        {/* 3. CONNECT & FUN CORNER: চিঠি ও সালামি (Smooth Scroll Animation)           */}
        {/* ========================================================================= */}
        <section className="py-14 sm:py-18 bg-zinc-100/70 dark:bg-zinc-900/40 border-y border-black/5 dark:border-white/5">
          <div className="w-full max-w-7xl 2xl:max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 text-left">
            
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-2 mb-10 text-center max-w-2xl mx-auto"
            >
              <h3 className="text-xs font-bold uppercase tracking-widest text-red-600 dark:text-red-400 font-mono">
                [ CONNECT & FUN LAB ]
              </h3>
              <h4 className="text-2xl sm:text-3xl font-black text-zinc-950 dark:text-white font-['Hind_Siliguri',sans-serif]">
                চিঠি ও সালামি কর্নার
              </h4>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 font-['Hind_Siliguri',sans-serif]">
                বেনামী মনের কথা জানাতে পারেন চিঠি ডট মি-তে এবং ঈদ সালামির ডিজিটাল স্মৃতি
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
              
              {/* Box 1: Chithi */}
              <motion.div 
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.6, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -8, scale: 1.015, transition: { duration: 0.25 } }}
                className="rounded-3xl bg-white dark:bg-zinc-900 border border-red-200 dark:border-red-900/30 p-6 sm:p-7 flex flex-col justify-between shadow-sm hover:shadow-2xl transition-all card-3d"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-red-600 text-white flex items-center justify-center shadow-md shadow-red-600/20 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300">
                      <Mail size={24} />
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-100 dark:bg-red-950/60 text-red-800 dark:text-red-300 border border-red-200 dark:border-red-800 font-['Hind_Siliguri',sans-serif]">
                      ডাকবাক্স
                    </span>
                  </div>

                  <h5 className="text-xl sm:text-2xl font-black text-zinc-950 dark:text-white font-['Hind_Siliguri',sans-serif]">
                    চিঠি ডট মি (Mahim Chithi)
                  </h5>

                  <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 font-['Hind_Siliguri',sans-serif] leading-relaxed">
                    কোনো নাম-পরিচয় ছাড়াই নিজের মনের না বলা কথা, প্রশংসা বা অনুভূতির কথা সরাসরি পাঠাতে পারেন মাহিমের ব্যক্তিগত গোপন ডাকবাক্সে।
                  </p>
                </div>

                <div className="pt-6">
                  <a
                    href="/chithi"
                    onClick={(e) => navigateTo('/chithi', e)}
                    className="w-full py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs sm:text-sm font-['Hind_Siliguri',sans-serif] shadow-md shadow-red-600/20 flex items-center justify-center gap-2 cursor-pointer transition-all"
                  >
                    <span>চিঠি পাঠান</span>
                    <ArrowRight size={15} />
                  </a>
                </div>
              </motion.div>

              {/* Box 2: Salami */}
              <motion.div 
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.6, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -8, scale: 1.015, transition: { duration: 0.25 } }}
                className="rounded-3xl bg-white dark:bg-zinc-900 border border-amber-200 dark:border-amber-900/30 p-6 sm:p-7 flex flex-col justify-between shadow-sm hover:shadow-2xl transition-all card-3d"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-amber-500 text-black flex items-center justify-center shadow-md shadow-amber-500/20 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300">
                      <Gift size={24} />
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800 font-['Hind_Siliguri',sans-serif]">
                      ঈদ আনন্দ
                    </span>
                  </div>

                  <h5 className="text-xl sm:text-2xl font-black text-zinc-950 dark:text-white font-['Hind_Siliguri',sans-serif]">
                    সালামি পোর্টাল (Mahim Salami)
                  </h5>

                  <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-300 font-['Hind_Siliguri',sans-serif] leading-relaxed">
                    ঈদের আনন্দ ভাগাভাগি করতে ডিজিটাল সালামি পাঠানোর সুবিধা, শুভেচ্ছা বার্তা ও সালামি ট্র্যাকার পোর্টাল।
                  </p>
                </div>

                <div className="pt-6">
                  <a
                    href="/salami"
                    onClick={(e) => navigateTo('/salami', e)}
                    className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-black font-bold text-xs sm:text-sm font-['Hind_Siliguri',sans-serif] shadow-md shadow-amber-500/20 flex items-center justify-center gap-2 cursor-pointer transition-all"
                  >
                    <span>সালামি পোর্টালে যান</span>
                    <ArrowRight size={15} />
                  </a>
                </div>
              </motion.div>

            </div>

          </div>
        </section>

        {/* ========================================================================= */}
        {/* 4. PHILOSOPHY & STORY SECTION: শান্ত, মার্জিত সমাপনী (Smooth Reveal)      */}
        {/* ========================================================================= */}
        <section className="py-14 sm:py-20">
          <motion.div 
            initial={{ opacity: 0, y: 35, scale: 0.98 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-3xl mx-auto px-4 sm:px-6 text-center space-y-6 font-['Hind_Siliguri',sans-serif]"
          >
            <span className="text-xs font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400 font-mono">
              [ REFLECTION ]
            </span>
            <h3 className="text-2xl sm:text-4xl font-black text-zinc-950 dark:text-white">
              “মানুষ কেবল একটি ফ্রেমে বন্দি থাকার জন্য জন্মায়নি”
            </h3>
            <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-300 leading-relaxed">
              প্রযুক্তি আমাদের কাজকে সহজ করে, শিক্ষা মানুষের ভবিষ্যৎ গড়ে, আর বিশ্বাস ও নৈতিকতা মানুষকে ভেতর থেকে সুন্দর করে। এই সমস্ত ভাবনার মেলবন্ধন নিয়েই আমার পথচলা।
            </p>

            <div className="pt-4 flex items-center justify-center gap-4 flex-wrap">
              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                href="#universe-grid"
                className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-black font-bold text-sm shadow-md transition-all"
              >
                বিভিন্ন অঙ্গন ঘুরে দেখুন ➔
              </motion.a>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                onClick={(e) => navigateTo('/portfolio#contact', e)}
                className="px-6 py-3 rounded-xl bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-zinc-300 dark:border-zinc-700 font-bold text-sm shadow-xs transition-all hover:bg-zinc-50 dark:hover:bg-zinc-700"
              >
                যোগাযোগ করুন
              </motion.button>
            </div>
          </motion.div>
        </section>

      </main>

      {/* ========================================================================= */}
      {/* 5. MODALS FOR EXPANDED PREVIEWS                                           */}
      {/* ========================================================================= */}

      {/* Modal 1: Graphics Design & Automation */}
      {activeModal === 'graphics_n8n' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in font-['Hind_Siliguri',sans-serif]">
          <div className="bg-white dark:bg-zinc-900 w-full max-w-2xl rounded-3xl p-6 sm:p-8 shadow-2xl border border-zinc-200 dark:border-zinc-800 space-y-6 max-h-[90vh] overflow-y-auto text-left">
            <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 flex items-center justify-center">
                  <Palette size={22} />
                </div>
                <div>
                  <h4 className="text-xl font-black text-zinc-950 dark:text-white">
                    গ্রাফিক্স ডিজাইন ও অটোমেশন
                  </h4>
                  <p className="text-xs text-zinc-500">ক্রিয়েটিভ ভিজ্যুয়াল ও ডিজিটাল ওয়ার্কফ্লো সলিউশন</p>
                </div>
              </div>
              <button
                onClick={() => setActiveModal('none')}
                className="p-2 rounded-xl text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4 text-sm text-zinc-700 dark:text-zinc-300">
              <div className="p-4 rounded-2xl bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800/40 space-y-2">
                <span className="font-bold text-purple-700 dark:text-purple-300 text-base flex items-center gap-2">
                  <Palette size={18} />
                  <span>১. প্রফেশনাল গ্রাফিক্স ডিজাইন:</span>
                </span>
                <p className="text-xs sm:text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
                  ব্যানার ডিজাইন, সোশ্যাল মিডিয়া এডভার্টাইজিং, ক্লাসরুম ও কোর্সের আকর্ষণীয় থাম্বনেইল, লোগো এবং ব্র্যান্ড আইডেন্টিটি তৈরিতে আমি নিবেদিত।
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/40 space-y-2">
                <span className="font-bold text-blue-700 dark:text-blue-300 text-base flex items-center gap-2">
                  <Workflow size={18} />
                  <span>২. ডিজিটাল ওয়ার্কফ্লো অটোমেশন:</span>
                </span>
                <p className="text-xs sm:text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
                  যে কাজগুলো মানুষকে বারবার ম্যানুয়ালি করতে হয় (যেমন: শিট ডাটা এন্ট্রি, স্বয়ংক্রিয় মেসেজ পাঠানো, ওয়েববুক ট্রিগার ও এপিআই সংযোগ)—তা নিখুঁতভাবে স্বয়ংক্রিয় করা।
                </p>
              </div>

              <div className="space-y-2 pt-2">
                <h5 className="font-bold text-zinc-900 dark:text-white text-xs uppercase tracking-wider">
                  যেসব সেবার জন্য কথা বলতে পারেন:
                </h5>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <li className="p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-emerald-500" />
                    <span>কোর্স ও সোশ্যাল মিডিয়া পোস্টার</span>
                  </li>
                  <li className="p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-emerald-500" />
                    <span>লোগো ও ব্র্যান্ড গাইডলাইন</span>
                  </li>
                  <li className="p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-emerald-500" />
                    <span>ডাটা ও মেসেজিং অটোমেশন</span>
                  </li>
                  <li className="p-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-emerald-500" />
                    <span>ওয়েববুক ও ইন্টিগ্রেশন পাইপলাইন</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between gap-3">
              <button
                onClick={() => setActiveModal('none')}
                className="px-4 py-2.5 rounded-xl text-xs font-bold text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              >
                বন্ধ করুন
              </button>
              <a
                href="https://wa.me/8801979040330?text=Hello%20Mahim"
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md flex items-center gap-2 transition-all active:scale-98"
              >
                <WhatsAppButton inline />
                <span>যোগাযোগ করুন (WhatsApp)</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Modal 2: Theology & Faith */}
      {activeModal === 'theology' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in font-['Hind_Siliguri',sans-serif]">
          <div className="bg-white dark:bg-zinc-900 w-full max-w-2xl rounded-3xl p-6 sm:p-8 shadow-2xl border border-zinc-200 dark:border-zinc-800 space-y-6 max-h-[90vh] overflow-y-auto text-left">
            <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center">
                  <Compass size={22} />
                </div>
                <div>
                  <h4 className="text-xl font-black text-zinc-950 dark:text-white">
                    ভাবনা ও ইলম (ধর্মতত্ত্ব ও দর্শন)
                  </h4>
                  <p className="text-xs text-zinc-500">গবেষণা ও সমকালীন বুদ্ধিবৃত্তিক ভাবনা</p>
                </div>
              </div>
              <button
                onClick={() => setActiveModal('none')}
                className="p-2 rounded-xl text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4 text-sm text-zinc-700 dark:text-zinc-300">
              <p className="leading-relaxed">
                আধুনিক যুগে বস্তুবাদ ও নানা বিভ্রান্তির মাঝে সত্যের অনুসন্ধানই মানবজীবনের প্রধান উদ্দেশ্য। এই অঙ্গনটি সাজানো হয়েছে পাঠ, আত্মশুদ্ধি ও মুক্ত আলোচনার উদ্দেশ্যে।
              </p>

              <div className="space-y-2.5 pt-2">
                <h5 className="font-bold text-zinc-900 dark:text-white text-xs uppercase tracking-wider">
                  মূল ফোকাসসমূহ:
                </h5>

                <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 space-y-1">
                  <span className="font-bold text-emerald-600 dark:text-emerald-400 text-sm">১. তুলনামূলক ধর্মতত্ত্ব (Comparative Theology)</span>
                  <p className="text-xs text-zinc-600 dark:text-zinc-300">
                    প্রধান ধর্মগ্রন্থসমূহের তুলনামূলক পাঠ ও সত্যের নিরপেক্ষ অনুসন্ধান।
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 space-y-1">
                  <span className="font-bold text-emerald-600 dark:text-emerald-400 text-sm">২. সমকালীন চিন্তাধারা ও ইসলামিক দৃষ্টিভঙ্গি</span>
                  <p className="text-xs text-zinc-600 dark:text-zinc-300">
                    আধুনিক দর্শনের বুদ্ধিবৃত্তিক আলোচনা ও তাত্ত্বিক বোঝাপড়া।
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 space-y-1">
                  <span className="font-bold text-emerald-600 dark:text-emerald-400 text-sm">৩. আত্মশুদ্ধি ও চারিত্রিক উৎকর্ষ</span>
                  <p className="text-xs text-zinc-600 dark:text-zinc-300">
                    ব্যক্তিজীবনে নৈতিকতা, মানবপ্রেম ও আধ্যাত্মিক প্রশান্তি অর্জনের প্রচেষ্টা।
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800 flex justify-end">
              <button
                onClick={() => setActiveModal('none')}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all"
              >
                বন্ধ করুন
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal 3: Memories & Vault */}
      {activeModal === 'memories' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in font-['Hind_Siliguri',sans-serif]">
          <div className="bg-white dark:bg-zinc-900 w-full max-w-2xl rounded-3xl p-6 sm:p-8 shadow-2xl border border-zinc-200 dark:border-zinc-800 space-y-6 max-h-[90vh] overflow-y-auto text-left">
            <div className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 flex items-center justify-center">
                  <Camera size={22} />
                </div>
                <div>
                  <h4 className="text-xl font-black text-zinc-950 dark:text-white">
                    স্মৃতির সরণি (The Memory Vault)
                  </h4>
                  <p className="text-xs text-zinc-500">শৈশবের ফেলে আসা দিন ও জীবনের সোনালী ফ্রেম</p>
                </div>
              </div>
              <button
                onClick={() => setActiveModal('none')}
                className="p-2 rounded-xl text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4 text-sm text-zinc-700 dark:text-zinc-300">
              <p className="leading-relaxed">
                মানুষ তার স্মৃতি দিয়ে বেঁচে থাকে। শৈশবের কাদামাটি, স্কুলের বারান্দা, আঁকাআঁকির প্রথম খাতা এবং হারিয়ে যাওয়া প্রিয় দিনগুলোকে সংরক্ষণ করার জন্যই আমার এই স্মৃতির সরণি।
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/40 space-y-1.5">
                  <span className="font-bold text-amber-800 dark:text-amber-300 text-sm">📷 শৈশবের সোনালী দিন</span>
                  <p className="text-xs text-zinc-600 dark:text-zinc-300">
                    বৃষ্টিভেজা বিকেল ও প্রাথমিক বিদ্যালয়ের স্মৃতিময় ফ্রেম।
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/40 space-y-1.5">
                  <span className="font-bold text-amber-800 dark:text-amber-300 text-sm">📜 ফেলে আসা দিনলিপি</span>
                  <p className="text-xs text-zinc-600 dark:text-zinc-300">
                    কৈশোরের ডায়েরির অপ্রকাশিত পাতা ও ব্যক্তিগত অনুভূতির টুকরো কথা।
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs text-zinc-600 dark:text-zinc-400">
                ⏳ <b>আর্কাইভ নির্মাণাধীন:</b> শৈশবের দুর্লভ ছবি ও স্মৃতিকথার একটি অ্যালবাম খুব শীঘ্রই উন্মুক্ত করা হবে।
              </div>
            </div>

            <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800 flex justify-end">
              <button
                onClick={() => setActiveModal('none')}
                className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-md transition-all"
              >
                বন্ধ করুন
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Global Utilities */}
      <Footer />
      <WhatsAppButton />
      <MobileAppDock />
      <AdminModal />
      <AuthModal />
    </div>
  );
};
