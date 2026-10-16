import React, { useEffect } from 'react';
import { ExternalLink, Facebook } from 'lucide-react';
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

    // High-resolution lightweight image optimized specifically for WhatsApp (<300KB) and Facebook crawlers
    const previewJpg = 'https://mahims.com/assets/og-khujbe.jpg';
    const fallbackCloudinaryJpg = 'https://res.cloudinary.com/drvyjj7td/image/upload/w_1200,h_630,c_pad,b_rgb:e6f4fe,q_auto:best,f_jpg/v1792156699/Khujbedotcom_db5yqu.jpg';
    const pageUrl = 'https://mahims.com/khujbe';
    const description = 'যাত্রা শুরুর অপেক্ষায় ই-কমার্স সাইট - খুঁজবে (khujbe.com)। ভিজিট করুন khujbe.com';

    setMeta('property', 'og:title', 'যাত্রা শুরুর অপেক্ষায় ই-কমার্স সাইট — খুঁজবে (khujbe.com)');
    setMeta('property', 'og:description', description);
    setMeta('property', 'og:image', previewJpg);
    setMeta('property', 'og:image:secure_url', fallbackCloudinaryJpg);
    setMeta('property', 'og:image:type', 'image/jpeg');
    setMeta('property', 'og:image:width', '1200');
    setMeta('property', 'og:image:height', '630');
    setMeta('property', 'og:image:alt', 'খুঁজবে — khujbe.com');
    setMeta('property', 'og:url', pageUrl);
    setMeta('property', 'og:type', 'website');
    setMeta('property', 'og:site_name', 'খুঁজবে (khujbe.com)');

    setMeta('name', 'description', description);
    setMeta('name', 'twitter:card', 'summary_large_image');
    setMeta('name', 'twitter:title', 'যাত্রা শুরুর অপেক্ষায় ই-কমার্স সাইট — খুঁজবে (khujbe.com)');
    setMeta('name', 'twitter:description', description);
    setMeta('name', 'twitter:image', previewJpg);

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
      className="min-h-screen sm:h-screen w-full relative flex flex-col items-center justify-center px-4 py-6 sm:py-5 overflow-y-auto sm:overflow-hidden font-['Hind_Siliguri',sans-serif] selection:bg-sky-500 selection:text-white"
      style={{
        backgroundColor: '#e6f4fe',
        backgroundImage: 'radial-gradient(#0284c7 1.6px, transparent 1.6px)',
        backgroundSize: '24px 24px',
      }}
    >
      {/* Soft Ambient Radial Glow Behind the Center Logo */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] sm:w-[480px] lg:w-[600px] h-[340px] sm:h-[480px] lg:h-[600px] rounded-full pointer-events-none blur-3xl opacity-60"
        style={{
          background: 'radial-gradient(circle, rgba(56, 189, 248, 0.45) 0%, rgba(2, 132, 199, 0.15) 50%, transparent 75%)',
        }}
      />

      {/* Main Standalone Container - Big and prominent on mobile, perfectly fitted on PC */}
      <main className="relative z-10 w-full max-w-3xl mx-auto flex flex-col items-center text-center justify-center my-auto space-y-4 sm:space-y-3 md:space-y-4">
        
        {/* Top Text: "যাত্রা শুরুর অপেক্ষায় ই-কমার্স সাইট," */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center"
        >
          <h1 className="text-2xl xs:text-[28px] sm:text-2xl md:text-3xl lg:text-4xl font-extrabold text-[#033b66] tracking-tight leading-snug drop-shadow-xs">
            যাত্রা শুরুর অপেক্ষায় ই-কমার্স সাইট,
          </h1>
        </motion.div>

        {/* Center PNG Logo - Big & prominent in mobile view (like before), constrained for PC single-screen view */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="relative flex items-center justify-center w-full py-1 sm:py-0.5"
        >
          <a
            href="https://facebook.com/khujbe"
            target="_blank"
            rel="noopener noreferrer"
            title="খুঁজবে ফেসবুক পেজ (facebook.com/khujbe)"
            className="relative inline-flex items-center justify-center group cursor-pointer transition-transform duration-300 hover:scale-[1.03] active:scale-[0.98]"
          >
            {/* Subtle logo backplate glow */}
            <div className="absolute inset-0 bg-white/60 rounded-3xl blur-2xl -z-10 transform group-hover:scale-105 transition-transform duration-500" />
            
            <img
              src="https://res.cloudinary.com/drvyjj7td/image/upload/v1792156671/Khujbe-logo-ghorooa-style_a21qva.png"
              alt="খুঁজবে - facebook.com/khujbe"
              className="w-[88vw] max-w-[340px] xs:max-w-[380px] sm:w-auto sm:max-w-[390px] md:max-w-[430px] h-auto max-h-[40vh] sm:max-h-[33vh] md:max-h-[36vh] object-contain drop-shadow-[0_12px_28px_rgba(2,132,199,0.28)]"
              loading="eager"
            />
          </a>
        </motion.div>

        {/* Action Buttons: khujbe.com & facebook.com/khujbe - Big & bold on mobile */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-3.5 w-full max-w-[300px] xs:max-w-[320px] sm:max-w-none pt-1"
        >
          {/* Website Visit Button */}
          <a
            href="https://khujbe.com"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3 sm:px-7 sm:py-2.5 rounded-full bg-gradient-to-r from-[#0284c7] via-[#0369a1] to-[#1d4ed8] text-white font-bold text-base sm:text-sm md:text-base shadow-[0_8px_20px_-4px_rgba(2,132,199,0.45)] hover:shadow-[0_12px_24px_-4px_rgba(2,132,199,0.6)] hover:from-[#0369a1] hover:to-[#1e40af] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] cursor-pointer group"
          >
            <span>ভিজিট করুন khujbe.com</span>
            <ExternalLink
              size={17}
              className="text-sky-200 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200"
            />
          </a>

          {/* Facebook Page Button */}
          <a
            href="https://facebook.com/khujbe"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 sm:px-6 sm:py-2.5 rounded-full bg-white/95 hover:bg-white text-[#1877F2] hover:text-[#0c63d4] border-2 border-[#1877F2]/30 hover:border-[#1877F2] font-bold text-base sm:text-sm md:text-base shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] cursor-pointer group"
          >
            <Facebook size={18} className="text-[#1877F2] fill-[#1877F2]" />
            <span>facebook.com/khujbe</span>
          </a>
        </motion.div>

        {/* Discreet bottom domain indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-xs text-sky-800/70 font-medium pt-1"
        >
          <p>© {new Date().getFullYear()} khujbe.com • সকল অধিকার সংরক্ষিত</p>
        </motion.div>

      </main>
    </div>
  );
};
