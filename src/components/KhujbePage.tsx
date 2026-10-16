import React, { useEffect } from 'react';
import { ExternalLink, Sparkles, Facebook } from 'lucide-react';
import { motion } from 'motion/react';

export const KhujbePage: React.FC = () => {
  // Set up Social Share Cards & Meta tags dynamically for mahims.com/khujbe
  useEffect(() => {
    const originalTitle = document.title;
    document.title = 'যাত্রা শুরুর অপেক্ষায় ই-কমার্স সাইট — খুঁজবে (khujbe.com)';

    const setMeta = (attr: 'name' | 'property', key: string, content: string) => {
      let el = document.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, key);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
      return el;
    };

    const previewJpg = 'https://res.cloudinary.com/drvyjj7td/image/upload/v1792156699/Khujbedotcom_db5yqu.jpg';
    const pageUrl = window.location.origin + '/khujbe';
    const description = 'যাত্রা শুরুর অপেক্ষায় ই-কমার্স সাইট - খুঁজবে (khujbe.com)। ভিজিট করুন khujbe.com';

    setMeta('property', 'og:title', 'যাত্রা শুরুর অপেক্ষায় ই-কমার্স সাইট — খুঁজবে (khujbe.com)');
    setMeta('property', 'og:description', description);
    setMeta('property', 'og:image', previewJpg);
    setMeta('property', 'og:image:secure_url', previewJpg);
    setMeta('property', 'og:image:type', 'image/jpeg');
    setMeta('property', 'og:url', pageUrl);
    setMeta('property', 'og:type', 'website');
    setMeta('property', 'og:site_name', 'খুঁজবে (khujbe.com)');

    setMeta('name', 'description', description);
    setMeta('name', 'twitter:card', 'summary_large_image');
    setMeta('name', 'twitter:title', 'যাত্রা শুরুর অপেক্ষায় ই-কমার্স সাইট — খুঁজবে (khujbe.com)');
    setMeta('name', 'twitter:description', description);
    setMeta('name', 'twitter:image', previewJpg);

    // Also update link[rel="image_src"] for older scrapers (WhatsApp legacy)
    let linkImg = document.querySelector('link[rel="image_src"]') as HTMLLinkElement | null;
    if (!linkImg) {
      linkImg = document.createElement('link');
      linkImg.setAttribute('rel', 'image_src');
      document.head.appendChild(linkImg);
    }
    linkImg.setAttribute('href', previewJpg);

    return () => {
      document.title = originalTitle;
    };
  }, []);

  return (
    <div
      className="min-h-screen w-full relative flex flex-col items-center justify-center px-4 py-6 sm:py-8 overflow-x-hidden font-['Hind_Siliguri',sans-serif] selection:bg-sky-500 selection:text-white"
      style={{
        backgroundColor: '#e6f4fe',
        backgroundImage: 'radial-gradient(#0284c7 1.6px, transparent 1.6px)',
        backgroundSize: '24px 24px',
      }}
    >
      {/* Soft Ambient Radial Glow Behind the Center Logo */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] sm:w-[500px] lg:w-[650px] h-[320px] sm:h-[500px] lg:h-[650px] rounded-full pointer-events-none blur-3xl opacity-60"
        style={{
          background: 'radial-gradient(circle, rgba(56, 189, 248, 0.45) 0%, rgba(2, 132, 199, 0.15) 50%, transparent 75%)',
        }}
      />

      {/* Main Standalone Container with tighter vertical rhythm */}
      <main className="relative z-10 w-full max-w-4xl mx-auto flex flex-col items-center text-center space-y-4 sm:space-y-5 md:space-y-6 my-auto">
        
        {/* Top Text: "যাত্রা শুরুর অপেক্ষায় ই-কমার্স সাইট," */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-1 sm:space-y-1.5"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/80 backdrop-blur-md border border-sky-300/80 shadow-xs text-sky-800 text-xs sm:text-sm font-semibold mb-0.5">
            <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse" />
            <Sparkles size={13} className="text-sky-600" />
            <span>শীঘ্রই আসছে • Coming Soon</span>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-[#033b66] tracking-tight leading-tight drop-shadow-xs">
            যাত্রা শুরুর অপেক্ষায় ই-কমার্স সাইট,
          </h1>
        </motion.div>

        {/* Center Large PNG Logo - Clickable directly to facebook.com/khujbe */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="relative flex flex-col items-center justify-center w-full"
        >
          <a
            href="https://facebook.com/khujbe"
            target="_blank"
            rel="noopener noreferrer"
            title="খুঁজবে ফেসবুক পেজ দেখুন (facebook.com/khujbe)"
            className="relative inline-flex items-center justify-center group cursor-pointer transition-transform duration-300 hover:scale-[1.03] active:scale-[0.98]"
          >
            {/* Subtle logo backplate glow */}
            <div className="absolute inset-0 bg-white/45 rounded-3xl blur-xl -z-10 transform group-hover:scale-105 transition-transform duration-500" />
            
            <img
              src="https://res.cloudinary.com/drvyjj7td/image/upload/v1792156671/Khujbe-logo-ghorooa-style_a21qva.png"
              alt="খুঁজবে - facebook.com/khujbe"
              className="w-[280px] sm:w-[380px] md:w-[460px] lg:w-[520px] xl:w-[560px] h-auto object-contain drop-shadow-[0_12px_28px_rgba(2,132,199,0.28)]"
              loading="eager"
            />
          </a>

          <a
            href="https://facebook.com/khujbe"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-1 text-[11px] sm:text-xs text-sky-800/80 hover:text-sky-900 font-medium flex items-center gap-1 transition-colors group"
          >
            <span>ফেসবুক পেজে যেতে লোগোতে ক্লিক করুন</span>
            <ExternalLink size={12} className="opacity-70 group-hover:opacity-100" />
          </a>
        </motion.div>

        {/* Action Buttons: khujbe.com and facebook.com/khujbe */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="pt-1 sm:pt-2 flex flex-wrap items-center justify-center gap-3 sm:gap-4"
        >
          {/* Website Visit Button */}
          <a
            href="https://khujbe.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 px-7 py-3 sm:px-9 sm:py-3.5 rounded-full bg-gradient-to-r from-[#0284c7] via-[#0369a1] to-[#1d4ed8] text-white font-bold text-sm sm:text-base md:text-lg shadow-[0_8px_20px_-4px_rgba(2,132,199,0.5),0_6px_8px_-4px_rgba(2,132,199,0.4)] hover:shadow-[0_14px_28px_-4px_rgba(2,132,199,0.65)] hover:from-[#0369a1] hover:to-[#1e40af] transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] cursor-pointer group"
          >
            <span>ভিজিট করুন khujbe.com</span>
            <ExternalLink
              size={18}
              className="text-sky-200 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200"
            />
          </a>

          {/* Facebook Page Button */}
          <a
            href="https://facebook.com/khujbe"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 sm:px-7 sm:py-3.5 rounded-full bg-white/95 hover:bg-white text-[#1877F2] hover:text-[#0c63d4] border-2 border-[#1877F2]/30 hover:border-[#1877F2] font-bold text-sm sm:text-base shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] cursor-pointer group"
          >
            <Facebook size={18} className="text-[#1877F2] fill-[#1877F2]" />
            <span>facebook.com/khujbe</span>
          </a>
        </motion.div>

        {/* Discreet bottom domain indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="pt-2 text-xs text-sky-800/70 font-medium"
        >
          <p>© {new Date().getFullYear()} khujbe.com • সকল অধিকার সংরক্ষিত</p>
        </motion.div>

      </main>
    </div>
  );
};
