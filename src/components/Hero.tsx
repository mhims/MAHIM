import React, { useState, useEffect, useRef } from 'react';
import { useSite } from '../context/SiteContext';
import { motion, useInView } from 'motion/react';
import { 
  ArrowUpRight, 
  MessageCircle, 
  Sparkles, 
  Palette, 
  Award, 
  Mail, 
  Facebook, 
  Instagram, 
  Linkedin, 
  Star,
  User
} from 'lucide-react';

const toBengaliDigits = (num: number): string => {
  const bengaliDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
  return num.toString().replace(/\d/g, (d) => bengaliDigits[parseInt(d, 10)] || d);
};

const AnimatedCounter: React.FC<{ target: number; suffix?: string; duration?: number }> = ({
  target,
  suffix = '',
  duration = 2000,
}) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  useEffect(() => {
    if (!isInView) return;

    let startTimestamp: number | null = null;
    let animationFrameId: number;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const elapsed = timestamp - startTimestamp;
      const progress = Math.min(elapsed / duration, 1);
      
      // Smooth easeOutCubic curve for realistic deceleration
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(easeOut * target);
      setCount(current);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(step);
      } else {
        setCount(target);
      }
    };

    animationFrameId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isInView, target, duration]);

  return (
    <span
      ref={ref}
      className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#d97706] dark:text-[#f59e0b] font-mono tracking-tight inline-block tabular-nums"
    >
      {toBengaliDigits(count)}{suffix}
    </span>
  );
};

export const Hero: React.FC = () => {
  const { settings } = useSite();

  // Typewriter effect state
  const phrases = [
    'হ্যালো , আমি',
    'ডিজাইন আমার পেশা, গল্প বলা আমার নেশা',
    'ক্রিয়েটিভ গ্রাফিক ডিজাইনার',
    'ব্র্যান্ডিং ও ভিজ্যুয়াল স্পেশালিস্ট',
  ];
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [typewriterText, setTypewriterText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentPhrase = phrases[currentPhraseIndex];
    let typingSpeed = isDeleting ? 40 : 85;

    if (!isDeleting && typewriterText === currentPhrase) {
      const pauseTimeout = setTimeout(() => {
        setIsDeleting(true);
      }, 1800);
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

  const socialLinks = [
    {
      name: 'Facebook',
      url: settings.facebookUrl || 'https://facebook.com/mahim2005',
      icon: <Facebook className="w-4.5 h-4.5 text-[#1877F2] group-hover:text-white transition-colors" />,
      hoverClass: 'hover:bg-[#1877F2] hover:border-[#1877F2]',
    },
    {
      name: 'Instagram',
      url: settings.instagramUrl || 'https://instagram.com/_mahim_official_',
      icon: <Instagram className="w-4.5 h-4.5 text-[#E1306C] group-hover:text-white transition-colors" />,
      hoverClass: 'hover:bg-gradient-to-tr hover:from-[#f09433] hover:via-[#dc2743] hover:to-[#bc1888] hover:border-transparent',
    },
    {
      name: 'LinkedIn',
      url: settings.linkedinUrl || 'https://linkedin.com/in/mahimibnekhudi',
      icon: <Linkedin className="w-4.5 h-4.5 text-[#0A66C2] group-hover:text-white transition-colors" />,
      hoverClass: 'hover:bg-[#0A66C2] hover:border-[#0A66C2]',
    },
    {
      name: 'Fiverr',
      url: settings.fiverrUrl || 'https://fiverr.com/mahimibnekhudi',
      icon: (
        <span className="font-black text-[13px] font-sans tracking-tight text-[#00b22d] group-hover:text-white transition-colors">
          fi<span className="inline-block w-1 h-1 rounded-full bg-[#00b22d] group-hover:bg-white ml-0.5 mb-0.5"></span>
        </span>
      ),
      hoverClass: 'hover:bg-[#00b22d] hover:border-[#00b22d]',
    },
    {
      name: 'Behance',
      url: settings.behanceUrl || 'https://behance.net/mahimibnekhudi',
      icon: (
        <span className="font-black text-[13px] font-sans tracking-tight text-[#0057ff] group-hover:text-white transition-colors">
          B<span className="relative">e<span className="absolute -top-0.5 left-0 right-0 h-0.5 bg-[#0057ff] group-hover:bg-white"></span></span>
        </span>
      ),
      hoverClass: 'hover:bg-[#0057ff] hover:border-[#0057ff]',
    },
    {
      name: 'WhatsApp',
      url: settings.whatsappLink || 'https://wa.me/@mahim.wp',
      icon: <MessageCircle className="w-4.5 h-4.5 text-[#25D366] group-hover:text-white transition-colors" />,
      hoverClass: 'hover:bg-[#25D366] hover:border-[#25D366]',
    },
  ];

  // Renders the name in TWO distinct lines with exact requested color scheme:
  // Line 1: MAHIM in Black (Light) / Pure Crisp White (Dark)
  // Line 2: IBNE KHUDI in Golden Amber (#d97706 Light / #f59e0b Dark)
  const renderTwoLineName = (title: string) => {
    const raw = (title || 'Mahim Ibne Khudi').trim();
    const parts = raw.split(/\s+/);
    let line1 = 'MAHIM';
    let line2 = 'IBNE KHUDI';
    if (parts.length > 1) {
      line1 = parts[0].toUpperCase();
      line2 = parts.slice(1).join(' ').toUpperCase();
    } else {
      line1 = raw.toUpperCase();
      line2 = '';
    }

    return (
      <div className="flex flex-col font-black tracking-tight uppercase leading-[0.92] select-none my-1">
        {/* Line 1: MAHIM - Crisp Luxury Deep Slate/Black in Light Mode, Bright Pure White in Dark Mode */}
        <span className="text-4xl xs:text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-[#09090b] dark:text-white transition-colors duration-200">
          {line1}
        </span>
        {/* Line 2: IBNE KHUDI - Premium Burnished Copper-Amber Gradient in Light Mode, Vivid Gold in Dark Mode */}
        {line2 && (
          <span className="text-4xl xs:text-5xl sm:text-6xl md:text-7xl lg:text-8xl bg-gradient-to-r from-[#b45309] via-[#d97706] to-[#9a3412] dark:from-[#f59e0b] dark:via-[#fbbf24] dark:to-[#f59e0b] bg-clip-text text-transparent transition-all duration-200">
            {line2}
          </span>
        )}
      </div>
    );
  };

  return (
    <section
      id="home"
      className="relative min-h-[92vh] pt-32 sm:pt-36 pb-20 flex items-center justify-center overflow-hidden bg-transparent"
    >
      {/* Ambient Lighting */}
      <div className="absolute top-10 right-10 w-[450px] sm:w-[650px] h-[450px] bg-amber-500/10 dark:bg-amber-500/15 rounded-full blur-[140px] pointer-events-none -z-10 animate-pulse-glow" />
      <div className="absolute top-1/3 left-10 w-[400px] sm:w-[600px] h-[400px] bg-amber-400/5 dark:bg-amber-400/10 rounded-full blur-[140px] pointer-events-none -z-10" />

      {/* Perspective Grid Matrix */}
      <div 
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none -z-10"
        style={{
          backgroundImage: `linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-start">
          
          {/* Left Column: Text & CTAs */}
          <div className="lg:col-span-7 text-left space-y-6 pt-2">
            
            {/* Top Row: On Mobile, Title/Intro on Left, Photo on Top Right */}
            <div className="flex items-start justify-between gap-3 sm:gap-6 text-left">
              <div className="flex-1 min-w-0 space-y-2.5 sm:space-y-3">
                {/* Main Headline: Typewriter + 2-Line Name + Tracked Designation */}
                <div className="space-y-1.5">
                  {/* Typewriter Greeting Effect (যেমন আগের সাইটে ছিল) */}
                  <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-extrabold text-sm sm:text-base tracking-wide">
                    <span className="inline-block w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                    <span>{typewriterText}</span>
                    <span className="w-0.5 h-4 sm:h-5 bg-amber-500 animate-pulse inline-block ml-0.5" />
                  </div>

                  {/* The Name in Exact Two Lines with Exact Requested Colors */}
                  <h1 className="tracking-tight">
                    {renderTwoLineName(settings.heroTitle)}
                  </h1>
                  
                  {/* Tracked Designation matching previous portfolio */}
                  <div className="pt-1">
                    <span className="text-xs sm:text-sm font-black tracking-[0.25em] text-zinc-500 dark:text-zinc-400 uppercase block">
                      {settings.heroSubtitle || 'গ্রা ফি ক   ডি জা ই না র'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Mobile-Only Top-Right Photo Card */}
              <div className="lg:hidden shrink-0 pt-0.5">
                <div className="relative w-36 xs:w-40 sm:w-44 aspect-[3/4] rounded-2xl p-1 bg-gradient-to-br from-white dark:from-zinc-800 via-amber-50/50 dark:via-zinc-900 to-amber-100/30 border-2 border-amber-500/30 shadow-[0_14px_30px_rgba(0,0,0,0.18)] overflow-hidden group">
                  <div className="w-full h-full rounded-xl overflow-hidden bg-gradient-to-b from-zinc-50 dark:from-zinc-900 to-zinc-100 dark:to-zinc-950 relative">
                    <img
                      src={settings.heroImage}
                      alt={settings.heroImageAlt || settings.heroTitle}
                      className="w-full h-full object-cover object-top filter contrast-105"
                      loading="eager"
                    />
                  </div>
                  <span className="absolute bottom-2 right-2 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-zinc-900 shadow-xs" />
                </div>
              </div>
            </div>

            {/* Bio Paragraph */}
            <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-300 max-w-2xl leading-relaxed font-normal">
              {settings.heroBio}
            </p>

            {/* Two Action Buttons matching previous site (যোগাযোগ করুন & আমার সম্পর্কে) + WhatsApp */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <a
                href="#contact"
                className="inline-flex items-center gap-2 px-6 sm:px-7 py-3 sm:py-3.5 rounded-full font-black text-sm bg-amber-500 hover:bg-amber-600 text-zinc-950 shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <Mail className="w-4 h-4" />
                <span>যোগাযোগ করুন</span>
              </a>

              <a
                href="#about"
                className="inline-flex items-center gap-2 px-6 sm:px-7 py-3 sm:py-3.5 rounded-full font-bold text-sm bg-white/60 dark:bg-zinc-900/60 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-900 dark:text-white border border-zinc-300 dark:border-zinc-700 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <User className="w-4 h-4" />
                <span>আমার সম্পর্কে</span>
              </a>

              <a
                href={settings.whatsappLink || 'https://wa.me/@mahim.wp'}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 sm:py-3.5 rounded-full font-bold text-xs sm:text-sm bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 transition-all"
              >
                <MessageCircle className="w-4 h-4" />
                <span>হোয়াটসঅ্যাপ</span>
              </a>
            </div>

            {/* Circular Social Icons (Facebook, Instagram, LinkedIn, Fiverr, Behance, WhatsApp) */}
            <div className="pt-2">
              <p className="text-xs font-black uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-2.5">
                সোশ্যাল মিডিয়া প্রোফাইল:
              </p>
              <div className="flex items-center gap-3 flex-wrap">
                {socialLinks.map((item) => (
                  <a
                    key={item.name}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={item.name}
                    className={`w-10 h-10 rounded-full border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 flex items-center justify-center transition-all duration-200 shadow-xs hover:scale-115 group ${item.hoverClass}`}
                  >
                    {item.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Quick Badges */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2.5 pt-1">
              <div className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-black/10 dark:border-white/10 text-xs font-bold text-zinc-800 dark:text-zinc-200 shadow-xs">
                <Palette className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <span>Adobe Photoshop & Illustrator</span>
              </div>
              <div className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-black/10 dark:border-white/10 text-xs font-bold text-zinc-800 dark:text-zinc-200 shadow-xs">
                <Award className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <span>NSDA সার্টিফাইড ডিজাইনার</span>
              </div>
            </div>

          </div>

          {/* Right Column: 3D Photo on Desktop */}
          <div className="hidden lg:flex lg:col-span-5 justify-center lg:justify-end w-full perspective-1200">
            <div className="relative w-full max-w-sm sm:max-w-md animate-float-3d">
              
              {/* Layer 1: Ambient Neon Glow around portrait */}
              <div className="absolute -inset-4 bg-gradient-to-tr from-amber-500/20 via-amber-400/15 to-emerald-500/20 rounded-3xl blur-2xl -z-10" />

              {/* Layer 2: Offset Backplane */}
              <div className="absolute inset-0 bg-gradient-to-br from-zinc-800 to-black rounded-3xl transform rotate-2 scale-98 -z-10 shadow-2xl opacity-15 dark:opacity-40" />

              {/* Layer 3: Main Picture Card */}
              <div className="relative rounded-3xl p-2.5 sm:p-3 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-xl border-2 border-zinc-200 dark:border-zinc-800 shadow-[0_25px_60px_rgba(0,0,0,0.16)] group overflow-hidden">
                
                {/* Photo container */}
                <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden bg-zinc-100 dark:bg-zinc-950 shadow-inner">
                  <img
                    src={settings.heroImage}
                    alt={settings.heroImageAlt || settings.heroTitle}
                    className="w-full h-full object-cover object-top filter contrast-105 transition-transform duration-700 group-hover:scale-105"
                    loading="eager"
                  />
                </div>

              </div>
            </div>
          </div>

        </div>

        {/* 4 Key Portfolio Metrics Strip with Rolling Countdown/Countup Animation */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-14 pt-8 border-t border-black/10 dark:border-white/10 grid grid-cols-2 md:grid-cols-4 gap-6 text-center"
        >
          <div className="space-y-1">
            <div>
              <AnimatedCounter target={4} suffix="+" duration={1600} />
            </div>
            <p className="text-xs sm:text-sm font-bold text-zinc-600 dark:text-zinc-400">
              বছরের অভিজ্ঞতা
            </p>
          </div>
          <div className="space-y-1">
            <div>
              <AnimatedCounter target={100} suffix="+" duration={2200} />
            </div>
            <p className="text-xs sm:text-sm font-bold text-zinc-600 dark:text-zinc-400">
              সম্পন্ন প্রজেক্ট
            </p>
          </div>
          <div className="space-y-1">
            <div>
              <AnimatedCounter target={50} suffix="+" duration={1900} />
            </div>
            <p className="text-xs sm:text-sm font-bold text-zinc-600 dark:text-zinc-400">
              সন্তুষ্ট ক্লায়েন্ট
            </p>
          </div>
          <div className="space-y-1">
            <div>
              <AnimatedCounter target={3} suffix="" duration={1400} />
            </div>
            <p className="text-xs sm:text-sm font-bold text-zinc-600 dark:text-zinc-400">
              সার্টিফিকেশন
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
