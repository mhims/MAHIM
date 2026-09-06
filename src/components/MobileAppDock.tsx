import React, { useState, useEffect } from 'react';
import { useSite } from '../context/SiteContext';
import { 
  Home, 
  User, 
  Layers, 
  BookOpen, 
  MessageCircle,
  Sparkles
} from 'lucide-react';

export const MobileAppDock: React.FC = () => {
  const { settings } = useSite();
  const [activeTab, setActiveTab] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'about', 'skills', 'experience', 'blog', 'contact'];
      const scrollPos = window.scrollY + 200;

      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveTab(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { 
      id: 'home', 
      label: 'হোম', 
      icon: Home, 
      href: '#home',
      activeColor: 'text-[#2563eb]',
      bgGlow: 'bg-blue-50 text-blue-600 border-blue-200',
      indicator: 'bg-[#2563eb]'
    },
    { 
      id: 'about', 
      label: 'প্রোফাইল', 
      icon: User, 
      href: '#about',
      activeColor: 'text-[#7c3aed]',
      bgGlow: 'bg-purple-50 text-purple-600 border-purple-200',
      indicator: 'bg-[#7c3aed]'
    },
    { 
      id: 'skills', 
      label: 'দক্ষতা', 
      icon: Layers, 
      href: '#skills',
      activeColor: 'text-[#ea580c]',
      bgGlow: 'bg-amber-50 text-amber-600 border-amber-200',
      indicator: 'bg-[#ea580c]'
    },
    { 
      id: 'blog', 
      label: 'ব্লগ', 
      icon: BookOpen, 
      href: '#blog',
      activeColor: 'text-[#059669]',
      bgGlow: 'bg-emerald-50 text-emerald-600 border-emerald-200',
      indicator: 'bg-[#059669]'
    },
  ];

  return (
    <aside 
      aria-label="Mobile Bottom App Dock"
      className="fixed bottom-3.5 inset-x-3 z-40 lg:hidden pointer-events-none"
    >
      {/* Floating 3D App Dock container with modern frosted glass & colorful micro-lighting */}
      <nav className="pointer-events-auto max-w-md mx-auto relative bg-white/95 dark:bg-[#12100e]/95 backdrop-blur-2xl border-2 border-black/10 dark:border-white/15 rounded-[28px] px-2 py-1.5 shadow-[0_12px_36px_rgba(0,0,0,0.16)] dark:shadow-[0_12px_36px_rgba(0,0,0,0.6)] flex items-center justify-between">
        
        {/* Subtle top gloss reflection line */}
        <div className="absolute top-1 left-6 right-6 h-[1.5px] bg-gradient-to-r from-transparent via-black/10 dark:via-white/15 to-transparent pointer-events-none" />

        {/* Regular navigation tabs */}
        <div className="flex items-center justify-around flex-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <a
                key={item.id}
                href={item.href}
                onClick={() => setActiveTab(item.id)}
                className={`relative flex flex-col items-center justify-center py-1.5 px-3 rounded-2xl transition-all duration-300 active:scale-90 ${
                  isActive 
                    ? '-translate-y-0.5' 
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white'
                }`}
              >
                {/* Active Pill backdrop */}
                {isActive && (
                  <span className={`absolute inset-0 rounded-2xl border ${item.bgGlow} dark:bg-zinc-800 dark:border-zinc-700 shadow-xs -z-10 animate-in zoom-in-90 duration-200`} />
                )}
                
                <div className="relative">
                  <Icon className={`w-5 h-5 transition-transform duration-300 ${isActive ? `scale-110 ${item.activeColor}` : 'text-zinc-600 dark:text-zinc-400'}`} />
                  {isActive && (
                    <span className={`absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 ${item.indicator} rounded-full shadow-xs`} />
                  )}
                </div>
                
                <span className={`text-[10px] font-bold mt-1 tracking-tight transition-colors ${isActive ? 'text-zinc-950 dark:text-white font-black' : 'text-zinc-600 dark:text-zinc-400'}`}>
                  {item.label}
                </span>
              </a>
            );
          })}
        </div>

        {/* Vertical divider */}
        <div className="h-7 w-[1px] bg-black/10 dark:bg-white/10 mx-1" />

        {/* Standout 3D WhatsApp Button in Dock */}
        <a
          href={settings.whatsappLink || 'https://wa.me/@mahim.wp'}
          target="_blank"
          rel="noopener noreferrer"
          title="হোয়াটসঅ্যাপে সরাসরি কথা বলুন"
          className="relative group flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-gradient-to-tr from-emerald-600 via-emerald-500 to-teal-500 text-white shadow-[0_4px_14px_rgba(16,185,129,0.4)] active:scale-90 transition-all border border-emerald-400/40"
        >
          {/* Subtle gloss overlay */}
          <div className="absolute top-0 left-0 right-0 h-1/2 bg-white/25 rounded-t-2xl pointer-events-none" />
          
          <div className="relative">
            <MessageCircle className="w-5 h-5 text-white" />
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-white animate-ping" />
          </div>
          <span className="text-[11px] font-black tracking-tight text-white">
            চ্যাট
          </span>
        </a>

      </nav>
    </aside>
  );
};
