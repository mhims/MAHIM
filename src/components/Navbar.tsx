import React, { useState, useEffect } from 'react';
import { useSite } from '../context/SiteContext';
import { Logo3D } from './Logo3D';
import { 
  User, 
  LogOut, 
  ShieldCheck, 
  Sparkles, 
  Menu, 
  X, 
  MessageCircle, 
  Layers, 
  BookOpen, 
  GraduationCap, 
  Briefcase, 
  Wrench, 
  Mail,
  Facebook,
  Instagram,
  Linkedin,
  ExternalLink,
  Sun,
  Moon
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { settings, currentUser, logoutUser, openAuthModal, theme, toggleTheme } = useSite();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 25);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'হোম', href: '#home', icon: Layers },
    { name: 'সম্পর্কে', href: '#about', icon: User },
    { name: 'দক্ষতা', href: '#skills', icon: Wrench },
    { name: 'অভিজ্ঞতা', href: '#experience', icon: Briefcase },
    { name: 'শিক্ষা', href: '#education', icon: GraduationCap },
    { name: 'ব্লগ', href: '#blog', icon: BookOpen },
    { name: 'যোগাযোগ', href: '#contact', icon: Mail },
  ];

  const socialLinks = [
    {
      name: 'Facebook',
      url: settings.facebookUrl || 'https://facebook.com/mahim2005',
      icon: Facebook,
      badgeStyle: 'bg-[#1877F2] text-white hover:brightness-110 shadow-sm border-transparent',
    },
    {
      name: 'Instagram',
      url: settings.instagramUrl || 'https://instagram.com/_mahim_official_',
      icon: Instagram,
      badgeStyle: 'bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] text-white hover:brightness-110 shadow-sm border-transparent',
    },
    {
      name: 'LinkedIn',
      url: settings.linkedinUrl || 'https://linkedin.com/in/mahimibnekhudi',
      icon: Linkedin,
      badgeStyle: 'bg-[#0A66C2] text-white hover:brightness-110 shadow-sm border-transparent',
    },
    {
      name: 'Fiverr',
      url: settings.fiverrUrl || 'https://fiverr.com/mahimibnekhudi',
      customIcon: (
        <span className="font-black text-[12px] tracking-tight text-white leading-none">fi</span>
      ),
      badgeStyle: 'bg-[#00b22d] text-white hover:brightness-110 shadow-sm border-transparent',
    },
    {
      name: 'Behance',
      url: settings.behanceUrl || 'https://behance.net/mahimibnekhudi',
      customIcon: (
        <span className="font-black text-[12px] tracking-tight text-white leading-none">Bē</span>
      ),
      badgeStyle: 'bg-[#0057ff] text-white hover:brightness-110 shadow-sm border-transparent',
    },
    {
      name: 'WhatsApp',
      url: settings.whatsappLink || 'https://wa.me/@mahim.wp',
      icon: MessageCircle,
      badgeStyle: 'bg-[#25D366] text-white hover:brightness-110 shadow-sm border-transparent',
    },
  ];

  return (
    <header
      id="main-navbar"
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 dark:bg-[#0c0a09]/95 backdrop-blur-xl border-b border-black/10 dark:border-white/10 shadow-lg py-2.5'
          : 'bg-white/85 dark:bg-[#0c0a09]/85 backdrop-blur-md border-b border-black/5 dark:border-white/5 py-3'
      }`}
    >
      {/* Top micro bar for Social Media & creative status */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-2 mb-1 border-b border-black/5 dark:border-white/5 hidden md:flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-zinc-700 dark:text-zinc-300 font-bold">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>গ্রাফিক্স ডিজাইনার ও ব্র্যান্ডিং স্পেশালিস্ট</span>
          </span>
        </div>

        {/* Top Colorful Social Media Quick Bar */}
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] font-black text-zinc-400 dark:text-zinc-500 mr-1 uppercase tracking-wider">
            সোশ্যাল মিডিয়া:
          </span>
          {socialLinks.map((item) => (
            <a
              key={item.name}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              title={item.name}
              className={`w-7 h-7 rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-115 hover:-translate-y-0.5 shadow-sm ${item.badgeStyle}`}
            >
              {item.customIcon ? (
                item.customIcon
              ) : item.icon ? (
                <item.icon className="w-3.5 h-3.5" />
              ) : null}
            </a>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        
        {/* Brand / Logo with Official Emblem */}
        <a href="#home" className="group flex items-center gap-3">
          <Logo3D size="md" />
          <div className="flex flex-col justify-center">
            <div className="flex items-center gap-1.5">
              <span className="text-xl sm:text-2xl font-black tracking-tight text-[#1a1a1a] dark:text-white group-hover:text-amber-500 transition-colors">
                {settings.siteName}
              </span>
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
            </div>
            <span className="block text-[11px] text-zinc-500 dark:text-zinc-400 font-mono tracking-wider font-semibold">
              {settings.domain}
            </span>
          </div>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 bg-zinc-100/95 dark:bg-zinc-900/95 p-1 rounded-full border border-black/10 dark:border-white/10 backdrop-blur-md shadow-inner">
          {navLinks.map(link => (
            <a
              key={link.href}
              href={link.href}
              className="px-3.5 py-1.5 text-xs font-bold text-zinc-700 dark:text-zinc-300 hover:text-black dark:hover:text-white hover:bg-white dark:hover:bg-zinc-800 rounded-full transition-all duration-200 shadow-xs"
            >
              {link.name}
            </a>
          ))}
        </nav>

        {/* Right Action buttons: Theme Toggle, Reader Login & WhatsApp */}
        <div className="hidden sm:flex items-center gap-3">
          {/* Theme Toggle Button (Light / Dark) */}
          <button
            onClick={toggleTheme}
            title={theme === 'dark' ? 'লাইট মুড অন করুন' : 'ডার্ক মুড অন করুন'}
            className="p-2 rounded-full bg-zinc-100 dark:bg-zinc-900 border border-black/10 dark:border-white/10 text-zinc-700 dark:text-amber-400 hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-all duration-200 cursor-pointer shadow-xs flex items-center justify-center"
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-zinc-700" />
            )}
          </button>

          {currentUser ? (
            <div className="flex items-center gap-2 bg-zinc-100 dark:bg-zinc-900 border border-black/10 dark:border-white/10 px-3 py-1.5 rounded-full shadow-xs">
              <div className="w-6 h-6 rounded-full bg-black dark:bg-white text-white dark:text-black flex items-center justify-center text-xs font-bold">
                {currentUser.name[0]}
              </div>
              <div className="text-left">
                <span className="block text-xs font-bold text-zinc-900 dark:text-zinc-100 leading-tight max-w-[100px] truncate">
                  {currentUser.name}
                </span>
                <span className="flex items-center gap-1 text-[10px] text-zinc-600 dark:text-zinc-400 font-bold leading-tight">
                  {currentUser.role === 'vip' ? (
                    <>
                      <Sparkles className="w-2.5 h-2.5 text-amber-500" /> ভিআইপি
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-2.5 h-2.5 text-zinc-700 dark:text-zinc-300" /> মেম্বার
                    </>
                  )}
                </span>
              </div>
              <button
                onClick={logoutUser}
                title="লগআউট"
                className="ml-1 p-1 text-zinc-400 hover:text-rose-600 transition-colors rounded-full cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={openAuthModal}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-zinc-800 dark:text-zinc-200 hover:text-black dark:hover:text-white bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800 border border-black/15 dark:border-white/15 hover:border-black rounded-full transition-all shadow-xs cursor-pointer"
            >
              <User className="w-3.5 h-3.5 text-zinc-700 dark:text-zinc-300" />
              <span>লগইন</span>
            </button>
          )}

          {/* 3D Push Hire Me Button */}
          <a
            href={settings.whatsappLink || 'https://wa.me/@mahim.wp'}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-1.5 text-xs font-black text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 rounded-full shadow-[0_4px_12px_rgba(16,185,129,0.35)] transition-all transform hover:-translate-y-0.5"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>হায়ার করুন</span>
          </a>
        </div>

        {/* Mobile menu toggle & theme toggle */}
        <div className="lg:hidden flex items-center gap-2">
          <button
            onClick={toggleTheme}
            title={theme === 'dark' ? 'লাইট মুড' : 'ডার্ক মুড'}
            className="p-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-black/10 dark:border-white/10 text-zinc-700 dark:text-amber-400 cursor-pointer"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl text-zinc-800 dark:text-zinc-200 hover:text-black hover:bg-zinc-100 dark:hover:bg-zinc-800 focus:outline-none cursor-pointer"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white/98 dark:bg-[#0c0a09]/98 backdrop-blur-2xl border-b border-black/10 dark:border-white/10 px-4 pt-3 pb-6 space-y-3 shadow-2xl animate-in slide-in-from-top-2 duration-200">
          
          {/* Mobile Social Links bar */}
          <div className="pb-3 border-b border-black/10">
            <p className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider mb-2">
              সোশ্যাল মিডিয়া প্রোফাইল:
            </p>
            <div className="grid grid-cols-3 gap-2">
              {socialLinks.map((item) => (
                <a
                  key={item.name}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center gap-1.5 px-2.5 py-2 rounded-xl text-xs font-bold shadow-xs transition-transform active:scale-95 ${item.badgeStyle}`}
                >
                  {item.customIcon ? (
                    item.customIcon
                  ) : item.icon ? (
                    <item.icon className="w-3.5 h-3.5" />
                  ) : null}
                  <span className="truncate">{item.name}</span>
                </a>
              ))}
            </div>
          </div>

          <div className="space-y-1">
            {navLinks.map(link => {
              const Icon = link.icon;
              return (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-zinc-800 dark:text-zinc-200 hover:text-black dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-xl transition-colors"
                >
                  <Icon className="w-4 h-4 text-amber-500" />
                  <span>{link.name}</span>
                </a>
              );
            })}
          </div>

          <div className="pt-2 border-t border-black/10 dark:border-white/10 flex flex-col gap-2">
            {currentUser ? (
              <div className="flex items-center justify-between p-3 bg-zinc-100 dark:bg-zinc-900 rounded-xl border border-black/5 dark:border-white/10">
                <div>
                  <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100">{currentUser.name}</p>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 font-mono font-semibold">
                    {currentUser.role === 'vip' ? 'অনুমোদিত রিডার' : 'সাধারণ রিডার'}
                  </p>
                </div>
                <button
                  onClick={logoutUser}
                  className="px-3 py-1.5 text-xs font-bold text-rose-600 bg-rose-50 dark:bg-rose-950/50 hover:bg-rose-100 rounded-lg"
                >
                  লগআউট
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  openAuthModal();
                }}
                className="w-full flex items-center justify-center gap-2 py-2.5 text-sm font-bold text-zinc-800 bg-zinc-100 hover:bg-zinc-200 rounded-xl border border-black/10 shadow-xs"
              >
                <User className="w-4 h-4 text-black" />
                <span>লগইন / একাউন্ট</span>
              </button>
            )}

            <a
              href={settings.whatsappLink || 'https://wa.me/@mahim.wp'}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl shadow-md"
            >
              <MessageCircle className="w-4 h-4" />
              <span>হোয়াটসঅ্যাপে সরাসরি কথা বলুন</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
