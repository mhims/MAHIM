import React from 'react';
import { useSite } from '../context/SiteContext';
import { motion } from 'motion/react';
import { 
  User, 
  Sparkles, 
  Globe2, 
  Heart, 
  Layers, 
  CheckCircle2, 
  Target, 
  Eye, 
  Cpu, 
  Palette,
  Quote
} from 'lucide-react';

export const About: React.FC = () => {
  const { settings } = useSite();

  const philosophyPillars = [
    {
      icon: Target,
      title: 'উদ্দেশ্যমুখী ভিজ্যুয়াল আর্ট',
      description: 'ডিজাইন কেবল অলংকরণ নয়; এটি একটি সুনির্দিষ্ট লক্ষ্য ও ব্যবসায়িক ফলাফল অর্জনের শক্তিশালী ভিজ্যুয়াল মাধ্যম।',
      accent: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
    },
    {
      icon: Palette,
      title: 'কালার সাইকোলজি ও টাইপোগ্রাফি',
      description: 'অডিয়েন্সের সাইকোলজি অনুযায়ী রং নির্বাচন ও ক্রিস্প টাইপোগ্রাফির মাধ্যমে দ্রুত দৃষ্টি আকর্ষণ ও ব্র্যান্ড স্মরণযোগ্যতা বৃদ্ধি।',
      accent: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
    },
    {
      icon: Cpu,
      title: 'আধুনিক টুলস ও প্রযুক্তি ওয়ার্কফ্লো',
      description: 'ফটোশপ, ইলাস্ট্রেটর, কাস্টম স্কিন ডিজাইন এবং n8n অটোমেশনের সমন্বয়ে নিখুঁত ও দ্রুত ডিজাইন ডেলিভারি।',
      accent: 'text-cyan-500 bg-cyan-500/10 border-cyan-500/20',
    },
  ];

  return (
    <section id="about" className="py-24 relative overflow-hidden bg-[#fdfdfb] dark:bg-[#0c0a09] transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header with smooth entrance animation */}
        <motion.div 
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-16 space-y-3"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-zinc-100 dark:bg-zinc-900 border border-black/10 dark:border-white/10 text-zinc-800 dark:text-zinc-200 text-xs font-bold uppercase tracking-wider">
            <User className="w-3.5 h-3.5 text-amber-500" />
            <span>পরিচিতি ও লক্ষ্য</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#1a1a1a] dark:text-white tracking-tight">
            আমার সম্পর্কে ও কাজের দর্শন
          </h2>
          <p className="text-zinc-600 dark:text-zinc-400 text-sm sm:text-base leading-relaxed font-normal">
            {settings.aboutHeadline}
          </p>
        </motion.div>

        {/* Main Content Layout: Story on Left, Philosophy & Principles on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-12">
          
          {/* Left Column: Story Cards */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-7 space-y-6"
          >
            <div className="card-3d rounded-2xl p-6 sm:p-8 space-y-4 bg-white dark:bg-zinc-900 border border-black/10 dark:border-white/10 shadow-sm">
              <h3 className="text-xl font-black text-[#1a1a1a] dark:text-white flex items-center gap-2.5">
                <Sparkles className="w-5 h-5 text-amber-500" />
                <span>ভিজ্যুয়াল স্টোরিটেলিং ও আধুনিক ডিজাইন</span>
              </h3>
              {settings.aboutStory.map((paragraph, index) => (
                <p key={index} className="text-zinc-600 dark:text-zinc-300 leading-relaxed text-sm sm:text-base">
                  {paragraph}
                </p>
              ))}

              <div className="pt-4 border-t border-black/10 dark:border-white/10 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-black/10 dark:border-white/10">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 flex items-center justify-center shrink-0">
                    <Target className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-zinc-900 dark:text-white">ক্লায়েন্ট ফোকাসড</h4>
                    <p className="text-xs text-zinc-600 dark:text-zinc-400 font-normal">প্রতিটি ডিজাইনে নির্দিষ্ট লক্ষ্য ও কাঙ্ক্ষিত ফলাফল নিশ্চিতকরণ</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/60 border border-black/10 dark:border-white/10">
                  <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400 flex items-center justify-center shrink-0">
                    <Layers className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-zinc-900 dark:text-white">আধুনিক টুলস</h4>
                    <p className="text-xs text-zinc-600 dark:text-zinc-400 font-normal">ফটোশপ, ইলাস্ট্রেটর ও অটোমেশনের নিখুঁত ওয়ার্কফ্লো</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Signature Quote Banner */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="p-6 rounded-2xl bg-zinc-100 dark:bg-zinc-900 border-l-4 border-amber-500 rounded-r-2xl border-y border-r border-black/5 dark:border-white/5 relative overflow-hidden shadow-xs"
            >
              <Quote className="w-8 h-8 text-amber-500/20 absolute -top-1 right-3" />
              <p className="text-xs sm:text-sm italic text-zinc-800 dark:text-zinc-200 leading-relaxed font-medium">
                "ভালো ডিজাইন শুধু দেখতে সুন্দর হওয়াই নয়; এটি একটি ব্র্যান্ডের ব্যক্তিত্ব ও ভাবমূর্তিকে সঠিক দর্শকের কাছে পৌঁছে দেওয়ার সবচেয়ে শক্তিশালী মাধ্যম।"
              </p>
              <div className="flex items-center gap-2 mt-3">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                <p className="text-xs font-black text-zinc-900 dark:text-white font-mono uppercase tracking-wider">
                  — মাহিম ইবনে খুদি
                </p>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column: Work Philosophy (কাজের দর্শন) with Staggered Motion Cards */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="lg:col-span-5 space-y-4"
          >
            <div className="p-6 sm:p-7 rounded-2xl bg-white dark:bg-zinc-900 border border-black/10 dark:border-white/10 shadow-sm space-y-5">
              <div className="flex items-center gap-2.5 pb-3 border-b border-black/10 dark:border-white/10">
                <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500">
                  <Eye className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-[#1a1a1a] dark:text-white">
                    কাজের দর্শন ও মূলনীতি
                  </h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">যেসব মূল্যবোধে বিশ্বাস রেখে প্রতিটি প্রজেক্ট তৈরি করি</p>
                </div>
              </div>

              <div className="space-y-4">
                {philosophyPillars.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 15 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: 0.2 + idx * 0.1 }}
                      className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/40 border border-black/5 dark:border-white/5 hover:border-amber-400/40 transition-all group"
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border ${item.accent} group-hover:scale-110 transition-transform`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="space-y-1">
                          <h4 className="text-xs sm:text-sm font-black text-zinc-900 dark:text-white group-hover:text-amber-500 transition-colors">
                            {item.title}
                          </h4>
                          <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              <div className="pt-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-zinc-700 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800/70 px-4 py-2.5 rounded-xl border border-black/5 dark:border-white/5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>১০০% সন্তুষ্টি ও সময়মতো ডেলিভারির দৃঢ় প্রতিশ্রুতি</span>
                </div>
              </div>
            </div>
          </motion.div>

        </div>

        {/* Bottom Row: Language Proficiency & Interests (Two Responsive Equal Cards) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Language Card */}
          <motion.div 
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="card-3d rounded-2xl p-6 space-y-4 bg-white dark:bg-zinc-900 border border-black/10 dark:border-white/10 shadow-sm"
          >
            <h4 className="text-base font-bold text-[#1a1a1a] dark:text-white flex items-center gap-2">
              <Globe2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>ভাষাগত দক্ষতা (Languages)</span>
            </h4>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span className="text-zinc-900 dark:text-zinc-100">বাংলা (Bangla)</span>
                  <span className="text-emerald-700 dark:text-emerald-400 font-mono">মাতৃভাষা - ১০০%</span>
                </div>
                <div className="w-full h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden border border-black/5 dark:border-white/5">
                  <motion.div 
                    initial={{ width: 0 }}
                    whileInView={{ width: '100%' }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className="h-full bg-emerald-600 dark:bg-emerald-500 rounded-full"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span className="text-zinc-900 dark:text-zinc-100">ইংরেজি (English)</span>
                  <span className="text-amber-700 dark:text-amber-400 font-mono">প্রফেশনাল দক্ষতা - ৮০%</span>
                </div>
                <div className="w-full h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden border border-black/5 dark:border-white/5">
                  <motion.div 
                    initial={{ width: 0 }}
                    whileInView={{ width: '80%' }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, ease: 'easeOut', delay: 0.1 }}
                    className="h-full bg-amber-500 rounded-full"
                  />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Interests & Hobbies Card */}
          <motion.div 
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="card-3d rounded-2xl p-6 space-y-3 bg-white dark:bg-zinc-900 border border-black/10 dark:border-white/10 shadow-sm"
          >
            <h4 className="text-base font-bold text-[#1a1a1a] dark:text-white flex items-center gap-2">
              <Heart className="w-4 h-4 text-rose-500" />
              <span>আগ্রহ ও প্যাশন (Interests)</span>
            </h4>
            <div className="flex flex-wrap gap-2 pt-1">
              {settings.interests.map((interest, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1.5 text-xs font-bold rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-black/10 dark:border-white/10 text-zinc-800 dark:text-zinc-200 flex items-center gap-1.5 hover:bg-amber-500/10 hover:border-amber-400/40 hover:text-amber-600 dark:hover:text-amber-400 transition-all duration-200"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400"></span>
                  {interest}
                </span>
              ))}
            </div>
          </motion.div>

        </div>

      </div>
    </section>
  );
};
