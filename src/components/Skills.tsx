import React, { useState } from 'react';
import { useSite } from '../context/SiteContext';
import { motion } from 'motion/react';
import { 
  Wrench, 
  Sparkles, 
  Palette, 
  Layers, 
  Award, 
  CheckCircle2, 
  Share2, 
  Laptop,
  Languages
} from 'lucide-react';

export const Skills: React.FC = () => {
  const { skills, certifications } = useSite();
  const [activeTab, setActiveTab] = useState<'all' | 'design' | 'tools' | 'marketing'>('all');

  const filteredSkills = activeTab === 'all' 
    ? skills 
    : skills.filter(s => s.category === activeTab);

  return (
    <section id="skills" className="py-24 relative bg-zinc-50/70 dark:bg-[#0c0a09]/70 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto mb-16 space-y-3"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-zinc-100 dark:bg-zinc-900 border border-black/10 dark:border-white/10 text-zinc-800 dark:text-zinc-200 text-xs font-bold uppercase tracking-wider">
            <Wrench className="w-3.5 h-3.5 text-amber-500" />
            <span>প্রফেশনাল স্কিলস</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#1a1a1a] dark:text-white tracking-tight">
            দক্ষতা ও টেকনিক্যাল পারদর্শিতা
          </h2>
          <p className="text-zinc-600 dark:text-zinc-400 text-sm sm:text-base leading-relaxed font-normal">
            ডিজাইন সফটওয়্যার ও আধুনিক মার্কেটিং টুলসে দীর্ঘদিনের কাজের অভিজ্ঞতা ও সার্টিফিকেশন
          </p>
        </motion.div>

        {/* Filter Pills */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex justify-center gap-2 mb-12 flex-wrap"
        >
          {[
            { key: 'all', label: 'সকল দক্ষতা' },
            { key: 'design', label: 'ডিজাইন ও আর্টওয়ার্ক' },
            { key: 'tools', label: 'সফটওয়্যার ও টুলস' },
            { key: 'marketing', label: 'মার্কেটিং ও স্ট্র্যাটেজি' },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer ${
                activeTab === tab.key
                  ? 'bg-zinc-900 dark:bg-amber-500 text-white dark:text-zinc-950 shadow-md scale-105'
                  : 'bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 hover:text-black dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-black/10 dark:border-white/10 shadow-xs'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </motion.div>

        {/* Skills Grid with Animated Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredSkills.map((skill, index) => (
            <motion.div
              key={skill.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.06 }}
              className="card-3d rounded-2xl p-6 relative overflow-hidden group cursor-pointer bg-white dark:bg-zinc-900 border border-black/10 dark:border-white/10 hover:shadow-xl transition-all duration-300"
            >
              {/* Top Row: Icon and category badge */}
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-zinc-950 border border-amber-500/30 shadow-md flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
                  {skill.name.includes('Photoshop') || skill.name.includes('Illustrator') ? (
                    <Palette className="w-6 h-6 text-amber-400" />
                  ) : skill.name.includes('Canva') || skill.name.includes('Design') ? (
                    <Layers className="w-6 h-6 text-emerald-400" />
                  ) : skill.name.includes('Marketing') ? (
                    <Share2 className="w-6 h-6 text-cyan-400" />
                  ) : (
                    <Laptop className="w-6 h-6 text-teal-400" />
                  )}
                </div>
                <span className="text-xs font-black text-amber-600 dark:text-amber-400 font-mono px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800/50">
                  {skill.proficiency}%
                </span>
              </div>

              {/* Title */}
              <h3 className="text-base font-black text-[#1a1a1a] dark:text-white mb-2 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                {skill.name}
              </h3>

              {/* Animated Progress bar */}
              <div className="w-full h-2.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden p-0.5 border border-black/10 dark:border-white/10 shadow-inner">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${skill.proficiency}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: 0.2, ease: 'easeOut' }}
                  className="h-full bg-gradient-to-r from-amber-500 via-amber-400 to-emerald-500 rounded-full shadow-xs"
                />
              </div>

              {/* Level indicator */}
              <p className="text-[11px] text-zinc-600 dark:text-zinc-400 mt-3 flex items-center gap-1.5 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>
                  {skill.proficiency >= 90 ? 'অ্যাডভান্সড / মাস্টার' : 'ইন্টারমিডিয়েট / প্রফেশনাল'}
                </span>
              </p>
            </motion.div>
          ))}
        </div>

        {/* Language Skills Card Inspired by Previous Portfolio */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-10 p-6 sm:p-8 rounded-2xl bg-zinc-950 text-white border border-amber-500/20 shadow-xl"
        >
          <div className="flex items-center gap-3 mb-6">
            <Languages className="w-5 h-5 text-amber-400" />
            <h4 className="text-lg font-black text-white">ভাষাগত দক্ষতা (Language Proficiency)</h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 rounded-xl bg-zinc-900/80 border border-white/10 flex items-center justify-between">
              <div>
                <span className="font-bold text-white text-base">বাংলা</span>
                <span className="block text-xs text-zinc-400">মাতৃভাষা (Native)</span>
              </div>
              <div className="flex gap-1.5">
                {[1, 2, 3, 4, 5].map((dot) => (
                  <span key={dot} className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                ))}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-zinc-900/80 border border-white/10 flex items-center justify-between">
              <div>
                <span className="font-bold text-white text-base">English</span>
                <span className="block text-xs text-zinc-400">লিখিত ও কথ্য দক্ষতা (Professional)</span>
              </div>
              <div className="flex gap-1.5">
                {[1, 2, 3, 4].map((dot) => (
                  <span key={dot} className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                ))}
                <span className="w-2.5 h-2.5 rounded-full bg-zinc-700" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Certifications Row directly based on CV */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-16 pt-12 border-t border-black/10 dark:border-white/10"
        >
          <div className="flex items-center gap-3 mb-8 justify-center">
            <Award className="w-6 h-6 text-amber-500" />
            <h3 className="text-xl sm:text-2xl font-black text-[#1a1a1a] dark:text-white tracking-tight">
              অফিশিয়াল সার্টিফিকেশন ও ট্রেনিং (NSDA & অন্যান্য)
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {certifications.map((cert) => (
              <div
                key={cert.id}
                className="bg-white dark:bg-zinc-900 border border-black/10 dark:border-white/10 hover:border-amber-400/50 dark:hover:border-amber-400/50 rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between space-y-4 group"
              >
                <div>
                  <div className="inline-block px-2.5 py-1 rounded-md bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800/50 text-amber-700 dark:text-amber-300 text-[11px] font-black uppercase tracking-wider mb-3">
                    {cert.year || 'ভেরিফাইড'}
                  </div>
                  <h4 className="text-base font-black text-[#1a1a1a] dark:text-white leading-snug mb-1 group-hover:text-amber-500 transition-colors">
                    {cert.title}
                  </h4>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 font-medium">
                    {cert.issuer}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

      </div>
    </section>
  );
};

