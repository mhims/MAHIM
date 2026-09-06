import React from 'react';
import { useSite } from '../context/SiteContext';
import { motion } from 'motion/react';
import { GraduationCap, Award, BookOpen, School } from 'lucide-react';

export const Education: React.FC = () => {
  const { education } = useSite();

  return (
    <section id="education" className="py-24 relative bg-zinc-50/70 dark:bg-[#0c0a09]/70 transition-colors duration-200">
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
            <GraduationCap className="w-3.5 h-3.5 text-amber-500" />
            <span>একাডেমিক ব্যাকগ্রাউন্ড</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#1a1a1a] dark:text-white tracking-tight">
            শিক্ষাগত যোগ্যতা ও ফলাফল
          </h2>
          <p className="text-zinc-600 dark:text-zinc-400 text-sm sm:text-base leading-relaxed font-normal">
            মেধার ধারাবাহিকতা ও উচ্চশিক্ষা সংক্রান্ত তথ্যাবলী
          </p>
        </motion.div>

        {/* Education Cards with Staggered Motion */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {education.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: index * 0.12 }}
              className="card-3d rounded-2xl p-7 flex flex-col justify-between group cursor-pointer bg-white dark:bg-zinc-900 border border-black/10 dark:border-white/10 shadow-sm hover:shadow-xl transition-all duration-300"
            >
              {/* Top Accent Icon & Period */}
              <div>
                <div className="flex items-center justify-between gap-2 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-zinc-100 dark:bg-zinc-800 border border-black/10 dark:border-white/10 flex items-center justify-center text-black dark:text-amber-400 group-hover:scale-105 transition-transform">
                    <School className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-black/10 dark:border-white/10 font-mono">
                    {item.period}
                  </span>
                </div>

                <h3 className="text-lg font-black text-[#1a1a1a] dark:text-white mb-1 transition-colors group-hover:text-amber-500">
                  {item.degree}
                </h3>
                
                <h4 className="text-sm font-bold text-zinc-700 dark:text-zinc-300 mb-2">
                  {item.institution}
                </h4>

                {item.department && (
                  <p className="text-xs font-bold text-amber-700 dark:text-amber-400 flex items-center gap-1.5 mb-2">
                    <BookOpen className="w-3.5 h-3.5 text-amber-500" />
                    <span>{item.department}</span>
                  </p>
                )}

                {item.board && (
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-3 font-medium">
                    বোর্ড: <span className="text-zinc-800 dark:text-zinc-200 font-bold">{item.board}</span>
                  </p>
                )}

                {item.details && (
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed pt-2 border-t border-black/5 dark:border-white/5 font-normal">
                    {item.details}
                  </p>
                )}
              </div>

              {/* Bottom Result Badge */}
              <div className="pt-5 mt-4 border-t border-black/10 dark:border-white/10 flex items-center justify-between">
                <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">ফলাফল / স্ট্যাটাস:</span>
                <span className="inline-flex items-center gap-1 text-xs font-black px-3 py-1 rounded-lg bg-zinc-900 dark:bg-amber-500 text-white dark:text-zinc-950 shadow-xs">
                  <Award className="w-3.5 h-3.5" />
                  {item.result || 'কৃতিত্বপূর্ণ'}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};
