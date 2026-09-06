import React from 'react';
import { useSite } from '../context/SiteContext';
import { Logo3D } from './Logo3D';
import { Sparkles, Heart, Lock, Shield, Facebook, Instagram, Linkedin, MessageCircle, ArrowUpRight } from 'lucide-react';

export const Footer: React.FC = () => {
  const { settings, openAdminModal } = useSite();

  const currentYear = new Date().getFullYear();

  const socialLinks = [
    {
      name: 'Facebook',
      url: settings.facebookUrl || 'https://facebook.com/mahim2005',
      icon: Facebook,
      style: 'hover:bg-[#1877F2] hover:text-white hover:border-[#1877F2]',
      color: 'text-[#1877F2]',
    },
    {
      name: 'Instagram',
      url: settings.instagramUrl || 'https://instagram.com/_mahim_official_',
      icon: Instagram,
      style: 'hover:bg-[#E1306C] hover:text-white hover:border-[#E1306C]',
      color: 'text-[#E1306C]',
    },
    {
      name: 'LinkedIn',
      url: settings.linkedinUrl || 'https://linkedin.com/in/mahimibnekhudi',
      icon: Linkedin,
      style: 'hover:bg-[#0A66C2] hover:text-white hover:border-[#0A66C2]',
      color: 'text-[#0A66C2]',
    },
    {
      name: 'Fiverr',
      url: settings.fiverrUrl || 'https://fiverr.com/mahimibnekhudi',
      customText: 'Fiverr',
      style: 'hover:bg-[#00b22d] hover:text-white hover:border-[#00b22d]',
      color: 'text-[#00b22d]',
    },
    {
      name: 'Behance',
      url: settings.behanceUrl || 'https://behance.net/mahimibnekhudi',
      customText: 'Behance',
      style: 'hover:bg-[#0057ff] hover:text-white hover:border-[#0057ff]',
      color: 'text-[#0057ff]',
    },
    {
      name: 'WhatsApp',
      url: settings.whatsappLink || 'https://wa.me/@mahim.wp',
      icon: MessageCircle,
      style: 'hover:bg-[#25D366] hover:text-white hover:border-[#25D366]',
      color: 'text-[#25D366]',
    },
  ];

  return (
    <footer className="relative bg-white dark:bg-[#090807] border-t border-black/10 dark:border-white/10 pt-16 pb-12 overflow-hidden text-zinc-600 dark:text-zinc-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-12 border-b border-black/10 dark:border-white/10 items-center">
          
          {/* Brand info */}
          <div className="md:col-span-6 space-y-3 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-3">
              <Logo3D size="sm" />
              <span className="text-xl font-black text-[#1a1a1a] dark:text-white tracking-tight">
                {settings.heroTitle}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 max-w-md font-normal leading-relaxed">
              {settings.seoDescription}
            </p>

            {/* Social Links Row */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 pt-2">
              {socialLinks.map((item) => (
                <a
                  key={item.name}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-black/10 dark:border-white/10 text-xs font-bold text-zinc-800 dark:text-zinc-200 transition-all duration-200 shadow-2xs group ${item.style}`}
                >
                  {item.icon ? <item.icon className={`w-3.5 h-3.5 ${item.color} group-hover:text-white transition-colors`} /> : null}
                  <span>{item.customText || item.name}</span>
                  <ArrowUpRight className="w-3 h-3 opacity-50 group-hover:opacity-100 group-hover:text-white transition-all" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick links & socials */}
          <div className="md:col-span-6 flex flex-wrap items-center justify-center md:justify-end gap-6 text-xs sm:text-sm font-bold text-zinc-600 dark:text-zinc-400">
            <a href="#home" className="hover:text-black dark:hover:text-white transition-colors">হোম</a>
            <a href="#about" className="hover:text-black dark:hover:text-white transition-colors">আমার সম্পর্কে</a>
            <a href="#skills" className="hover:text-black dark:hover:text-white transition-colors">দক্ষতা</a>
            <a href="#experience" className="hover:text-black dark:hover:text-white transition-colors">অভিজ্ঞতা</a>
            <a href="#education" className="hover:text-black dark:hover:text-white transition-colors">শিক্ষা</a>
            <a href="#blog" className="hover:text-black dark:hover:text-white transition-colors">ব্লগ</a>
            <a href="#contact" className="hover:text-black dark:hover:text-white transition-colors">যোগাযোগ</a>
          </div>

        </div>

        {/* SEO Keywords Cloud */}
        <div className="py-6 border-b border-black/10 dark:border-white/10 text-[11px] text-zinc-500 dark:text-zinc-400">
          <p className="mb-2 font-mono text-[10px] uppercase tracking-wider text-zinc-500 dark:text-zinc-400 font-bold">
            অনুসন্ধান কীওয়ার্ড (SEO Index Tags):
          </p>
          <div className="flex flex-wrap gap-2">
            {settings.seoKeywords.map((kw, i) => (
              <span
                key={i}
                className="px-2.5 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-900 border border-black/10 dark:border-white/10 text-zinc-700 dark:text-zinc-300 hover:text-black dark:hover:text-white hover:border-black/30 dark:hover:border-white/30 transition-colors font-medium text-xs"
              >
                #{kw}
              </span>
            ))}
          </div>
        </div>

        {/* Bottom Bar with Secret Dot for Admin Panel */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500 dark:text-zinc-400">
          <p className="text-center sm:text-left font-normal">
            © {currentYear} <strong className="text-black dark:text-white font-bold">{settings.siteName}</strong> (mahims.com). সর্বস্বত্ব সংরক্ষিত।
          </p>

          <div className="flex items-center gap-3">
            <span className="text-[11px] text-zinc-500 dark:text-zinc-400 font-mono font-medium">
              Designed for Mahim Ibne Khudi
            </span>

            {/* Secret Admin Dot Trigger (as requested by user) */}
            <button
              id="admin-secret-dot-trigger"
              onClick={openAdminModal}
              title="Admin Portal"
              aria-label="Admin Portal"
              className="w-2.5 h-2.5 rounded-full bg-zinc-300 dark:bg-zinc-700 hover:bg-black dark:hover:bg-amber-400 transition-all duration-300 cursor-pointer opacity-50 hover:opacity-100 shadow-xs"
            ></button>
          </div>
        </div>

      </div>
    </footer>
  );
};
