import React from 'react';
import { useSite } from '../context/SiteContext';
import { Briefcase, Calendar, CheckCircle2, ChevronRight, Sparkles, Building2 } from 'lucide-react';

export const Experience: React.FC = () => {
  const { experiences } = useSite();

  return (
    <section id="experience" className="py-24 relative overflow-hidden bg-[#fdfdfb]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-zinc-100 border border-black/10 text-zinc-800 text-xs font-bold uppercase tracking-wider">
            <Briefcase className="w-3.5 h-3.5 text-black" />
            <span>কর্মজীবন ও ক্যারিয়ার</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#1a1a1a] tracking-tight">
            কাজের অভিজ্ঞতা ও প্রজেক্ট হিস্ট্রি
          </h2>
          <p className="text-zinc-600 text-sm sm:text-base leading-relaxed font-normal">
            বিভিন্ন ব্র্যান্ড, পাবলিকেশন ও ফ্রিল্যান্স প্ল্যাটফর্মে সফলতার সাথে ডিজাইন সেবা প্রদানের খতিয়ান
          </p>
        </div>

        {/* Timeline Container */}
        <div className="relative max-w-4xl mx-auto">
          {/* Vertical Line */}
          <div className="absolute left-4 sm:left-1/2 top-4 bottom-4 -translate-x-1/2 w-0.5 bg-zinc-200"></div>

          <div className="space-y-12">
            {experiences.map((exp, index) => {
              const isEven = index % 2 === 0;

              return (
                <div
                  key={exp.id}
                  className={`relative flex flex-col sm:flex-row items-start sm:items-center ${
                    isEven ? 'sm:flex-row-reverse' : ''
                  } group`}
                >
                  {/* Center Node Icon */}
                  <div className="absolute left-4 sm:left-1/2 -translate-x-1/2 w-9 h-9 rounded-full bg-white border-2 border-black flex items-center justify-center text-black shadow-md z-10 group-hover:scale-110 transition-transform duration-300">
                    <Building2 className="w-4 h-4" />
                  </div>

                  {/* Content Box */}
                  <div className="ml-12 sm:ml-0 sm:w-1/2 sm:px-8 w-full">
                    <div className="card-3d rounded-2xl p-6 sm:p-7 relative">
                      
                      {/* Company & Period */}
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                        <span className="text-xs font-bold px-3 py-1 rounded-full bg-zinc-100 text-zinc-800 border border-black/10 flex items-center gap-1.5">
                          <Calendar className="w-3 h-3 text-black" />
                          {exp.period}
                        </span>

                        {exp.isCurrent && (
                          <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-300">
                            বর্তমান
                          </span>
                        )}
                      </div>

                      {/* Role & Company */}
                      <h3 className="text-lg sm:text-xl font-black text-[#1a1a1a] transition-colors">
                        {exp.role}
                      </h3>
                      <h4 className="text-sm font-bold text-zinc-700 mb-3">
                        {exp.company}
                      </h4>

                      {/* Description */}
                      <p className="text-xs sm:text-sm text-zinc-600 leading-relaxed mb-4 font-normal">
                        {exp.description}
                      </p>

                      {/* Skills tags */}
                      {exp.skillsUsed && exp.skillsUsed.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-3 border-t border-black/10">
                          {exp.skillsUsed.map((sk, sIdx) => (
                            <span
                              key={sIdx}
                              className="text-[11px] px-2.5 py-0.5 rounded-md bg-zinc-100 text-zinc-800 border border-black/10 font-mono font-semibold"
                            >
                              {sk}
                            </span>
                          ))}
                        </div>
                      )}

                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
};
