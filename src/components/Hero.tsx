import React from 'react';
import { useSite } from '../context/SiteContext';
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
  Star 
} from 'lucide-react';

export const Hero: React.FC = () => {
  const { settings } = useSite();

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
      label: 'Fiverr',
      customIcon: (
        <span className="font-black text-[12px] tracking-tight text-white leading-none">fi</span>
      ),
      badgeStyle: 'bg-[#00b22d] text-white hover:brightness-110 shadow-sm border-transparent',
    },
    {
      name: 'Behance',
      url: settings.behanceUrl || 'https://behance.net/mahimibnekhudi',
      label: 'Behance',
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
    <section
      id="home"
      className="relative min-h-[92vh] pt-32 sm:pt-36 pb-20 flex items-center justify-center overflow-hidden"
    >
      {/* 3D Multi-Layer Ambient Lighting */}
      <div className="absolute top-10 right-10 w-[450px] sm:w-[650px] h-[450px] bg-emerald-400/15 rounded-full blur-[140px] pointer-events-none -z-10 animate-pulse-glow" />
      <div className="absolute top-1/3 left-10 w-[400px] sm:w-[600px] h-[400px] bg-amber-400/10 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="absolute bottom-10 right-1/3 w-[350px] h-[350px] bg-cyan-400/10 rounded-full blur-[120px] pointer-events-none -z-10" />

      {/* 3D Perspective Grid Matrix */}
      <div 
        className="absolute inset-0 opacity-[0.035] pointer-events-none -z-10"
        style={{
          backgroundImage: `linear-gradient(to right, #000000 1px, transparent 1px), linear-gradient(to bottom, #000000 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-start">
          
          {/* Left Column: Text & CTAs */}
          <div className="lg:col-span-7 text-left space-y-6 pt-2">
            
            {/* Top Row: On Mobile, Title/Intro on Left, 3D Photo on Top Right */}
            <div className="flex items-start justify-between gap-3 sm:gap-6 text-left">
              <div className="flex-1 space-y-2.5 sm:space-y-3">
                {/* 3D Status Pill */}
                <div className="inline-flex items-center gap-2 px-3 py-1 sm:px-4 sm:py-1.5 rounded-full bg-white/95 border border-black/10 shadow-[0_4px_12px_rgba(0,0,0,0.06)] backdrop-blur-md">
                  <span className="relative flex h-2 w-2 sm:h-2.5 sm:w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-80"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 sm:h-2.5 sm:w-2.5 bg-emerald-600"></span>
                  </span>
                  <span className="text-[11px] sm:text-xs font-black tracking-wide text-zinc-800">
                    নতুন ক্লায়েন্ট ও ফ্রিল্যান্স প্রজেক্টের জন্য এভেইলেবল
                  </span>
                  <Sparkles className="w-3 h-3 text-amber-500" />
                </div>

                {/* Main Headline with 3D Depth */}
                <div className="space-y-1">
                  <span className="text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] text-zinc-400 block">
                    CREATIVE DESIGNER & BRAND SPECIALIST
                  </span>
                  <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-black tracking-tighter text-[#1a1a1a] leading-[1.06]">
                    {settings.heroTitle}
                  </h1>
                  <div className="pt-0.5">
                    <span className="text-base sm:text-xl lg:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-600 tracking-tight">
                      {settings.heroSubtitle}
                    </span>
                  </div>
                </div>
              </div>

              {/* Mobile-Only Top-Right Photo Card (Keeps photo visible immediately on mobile without scrolling) */}
              <div className="lg:hidden shrink-0 pt-1">
                <div className="relative w-28 sm:w-36 aspect-[3/4] rounded-2xl p-1 bg-white border-2 border-black/15 shadow-[0_12px_28px_rgba(0,0,0,0.18)] overflow-hidden group">
                  <div className="w-full h-full rounded-xl overflow-hidden bg-zinc-100 relative">
                    <img
                      src={settings.heroImage}
                      alt={settings.heroImageAlt || settings.heroTitle}
                      className="w-full h-full object-cover object-top filter contrast-105"
                      loading="eager"
                    />
                  </div>
                  {/* Subtle online indicator dot */}
                  <span className="absolute bottom-2 right-2 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white shadow-xs" />
                </div>
              </div>
            </div>

            {/* Bio Paragraph */}
            <p className="text-base sm:text-lg text-zinc-600 max-w-2xl leading-relaxed font-normal">
              {settings.heroBio}
            </p>

            {/* Colorful Social Media Quick Pills */}
            <div className="pt-2">
              <p className="text-xs font-black uppercase tracking-wider text-zinc-400 mb-2.5">
                সরাসরি সোশ্যাল মিডিয়া ও পোর্টফোলিও লিংক:
              </p>
              <div className="flex flex-wrap items-center justify-start gap-2.5">
                {socialLinks.map((item) => (
                  <a
                    key={item.name}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold shadow-sm transition-all duration-200 hover:scale-105 hover:-translate-y-0.5 active:scale-95 ${item.badgeStyle}`}
                  >
                    {item.customIcon ? (
                      item.customIcon
                    ) : item.icon ? (
                      <item.icon className="w-3.5 h-3.5" />
                    ) : (
                      <span className="w-2 h-2 rounded-full bg-white"></span>
                    )}
                    <span>{item.label || item.name}</span>
                    <ArrowUpRight className="w-3 h-3 opacity-75" />
                  </a>
                ))}
              </div>
            </div>

            {/* Quick CV Badges */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2.5 pt-1">
              <div className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-zinc-50 border border-black/10 text-xs font-bold text-zinc-800 shadow-xs">
                <Palette className="w-4 h-4 text-emerald-600" />
                <span>Adobe Photoshop & Illustrator</span>
              </div>
              <div className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-zinc-50 border border-black/10 text-xs font-bold text-zinc-800 shadow-xs">
                <Award className="w-4 h-4 text-amber-600" />
                <span>NSDA সার্টিফাইড ডিজাইনার</span>
              </div>
              <div className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-blue-50/80 border border-blue-200/80 text-xs font-bold text-blue-900 shadow-xs">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <span>সোশ্যাল মিডিয়া ও ব্র্যান্ডিং স্পেশালিস্ট</span>
              </div>
            </div>

            {/* Primary Action Buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-3">
              <a
                href={settings.whatsappLink || 'https://wa.me/@mahim.wp'}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2.5 px-6 py-3.5 rounded-2xl font-black text-sm text-white bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 shadow-[0_10px_25px_rgba(16,185,129,0.4)] hover:shadow-[0_14px_30px_rgba(16,185,129,0.55)] hover:scale-105 active:scale-95 transition-all duration-200"
              >
                <MessageCircle className="w-5 h-5 text-white" />
                <span>হোয়াটসঅ্যাপে মেসেজ পাঠান</span>
                <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>

              <a
                href="#contact"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl font-black text-sm text-zinc-900 bg-white hover:bg-zinc-50 border-2 border-black/80 shadow-md hover:scale-105 active:scale-95 transition-all duration-200"
              >
                <Mail className="w-4 h-4 text-zinc-800" />
                <span>যোগাযোগ করুন</span>
              </a>

              <a
                href="#skills"
                className="inline-flex items-center gap-2 px-4 py-3.5 rounded-2xl font-bold text-sm text-zinc-700 hover:text-black transition-all"
              >
                <span>কাজের স্কিলস দেখুন</span>
                <span className="font-black">→</span>
              </a>
            </div>

            {/* Direct Contact Micro-Strip (NO phone number, purely WhatsApp & Email) */}
            <div className="pt-3 border-t border-black/10 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs font-bold text-zinc-600">
              <a 
                href={settings.whatsappLink || 'https://wa.me/@mahim.wp'} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center gap-2 text-emerald-700 hover:text-emerald-800 transition-colors font-bold"
              >
                <MessageCircle className="w-4 h-4 text-[#25D366]" />
                <span>হোয়াটসঅ্যাপ: wa.me/@mahim.wp</span>
              </a>
              <a href={`mailto:${settings.email}`} className="flex items-center gap-2 hover:text-black transition-colors font-medium">
                <Mail className="w-4 h-4 text-zinc-700" />
                <span>{settings.email}</span>
              </a>
              <span className="flex items-center gap-1.5 text-zinc-600 font-medium">
                <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                <span>৫★ রেটেড ডিজাইন কোয়ালিটি</span>
              </span>
            </div>

          </div>

          {/* Right Column: 3D Photo on Desktop (hidden on mobile since mobile displays it at the top right) */}
          <div className="hidden lg:flex lg:col-span-5 justify-center lg:justify-end w-full perspective-1200">
            <div className="relative w-full max-w-sm sm:max-w-md animate-float-3d">
              
              {/* Layer 1: Ambient Neon Glow around portrait */}
              <div className="absolute -inset-4 bg-gradient-to-tr from-emerald-500/25 via-amber-500/20 to-cyan-500/25 rounded-3xl blur-2xl -z-10" />

              {/* Layer 2: 3D Angled Offset Backplane */}
              <div className="absolute inset-0 bg-gradient-to-br from-zinc-800 to-black rounded-3xl transform rotate-2 scale-98 -z-10 shadow-2xl opacity-15" />
              <div className="absolute inset-0 bg-emerald-500/15 rounded-3xl transform -rotate-2 scale-98 -z-10 border border-emerald-500/30" />

              {/* Layer 3: Main 3D Beveled Picture Card - Clean with NO badges or text */}
              <div className="relative rounded-3xl p-2.5 sm:p-3 bg-white/95 backdrop-blur-xl border-2 border-zinc-200 shadow-[0_25px_60px_rgba(0,0,0,0.16)] group overflow-hidden">
                
                {/* Photo container */}
                <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden bg-zinc-100 shadow-inner">
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
      </div>
    </section>
  );
};
