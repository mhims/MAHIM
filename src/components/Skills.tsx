import React, { useState } from 'react';
import { useSite } from '../context/SiteContext';
import { 
  Wrench, 
  Sparkles, 
  Palette, 
  Layers, 
  Award, 
  CheckCircle2, 
  Smartphone, 
  Share2, 
  FileSpreadsheet, 
  Laptop 
} from 'lucide-react';

export const Skills: React.FC = () => {
  const { skills, certifications } = useSite();
  const [activeTab, setActiveTab] = useState<'all' | 'design' | 'tools' | 'marketing'>('all');

  const filteredSkills = activeTab === 'all' 
    ? skills 
    : skills.filter(s => s.category === activeTab);

  return (
    <section id="skills" className="py-24 relative bg-zinc-50/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-zinc-100 border border-black/10 text-zinc-800 text-xs font-bold uppercase tracking-wider">
            <Wrench className="w-3.5 h-3.5 text-black" />
            <span>প্রফেশনাল স্কিলস</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#1a1a1a] tracking-tight">
            দক্ষতা ও টেকনিক্যাল পারদর্শিতা
          </h2>
          <p className="text-zinc-600 text-sm sm:text-base leading-relaxed font-normal">
            ডিজাইন সফটওয়্যার ও আধুনিক মার্কেটিং টুলসে দীর্ঘদিনের কাজের অভিজ্ঞতা ও সার্টিফিকেশন
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex justify-center gap-2 mb-12 flex-wrap">
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
                  ? 'bg-black text-white shadow-md scale-105'
                  : 'bg-white text-zinc-700 hover:text-black hover:bg-zinc-100 border border-black/10 shadow-xs'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Skills Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredSkills.map(skill => (
            <div
              key={skill.id}
              className="card-3d rounded-2xl p-6 relative overflow-hidden group cursor-pointer"
            >
              {/* Top Row: Icon and category badge */}
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-white/20 shadow-md flex items-center justify-center text-emerald-400 group-hover:scale-110 group-hover:rotate-6 transition-transform">
                  {skill.name.includes('Photoshop') || skill.name.includes('Illustrator') ? (
                    <Palette className="w-6 h-6" />
                  ) : skill.name.includes('Canva') || skill.name.includes('Design') ? (
                    <Layers className="w-6 h-6 text-cyan-400" />
                  ) : skill.name.includes('Marketing') ? (
                    <Share2 className="w-6 h-6 text-amber-400" />
                  ) : (
                    <Laptop className="w-6 h-6 text-teal-400" />
                  )}
                </div>
                <span className="text-xs font-black text-black font-mono px-2.5 py-1 rounded-full bg-zinc-100 border border-black/10">
                  {skill.proficiency}%
                </span>
              </div>

              {/* Title */}
              <h3 className="text-base font-black text-[#1a1a1a] mb-2 group-hover:text-emerald-700 transition-colors">
                {skill.name}
              </h3>

              {/* 3D Progress bar */}
              <div className="w-full h-2.5 bg-zinc-100 rounded-full overflow-hidden p-0.5 border border-black/10 shadow-inner">
                <div
                  className="h-full bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-500 rounded-full transition-all duration-1000 ease-out shadow-xs"
                  style={{ width: `${skill.proficiency}%` }}
                ></div>
              </div>

              {/* Level indicator */}
              <p className="text-[11px] text-zinc-600 mt-3 flex items-center gap-1.5 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>
                  {skill.proficiency >= 90 ? 'অ্যাডভান্সড / মাস্টার' : 'ইন্টারমিডিয়েট / প্রফেশনাল'}
                </span>
              </p>
            </div>
          ))}
        </div>

        {/* Certifications Row directly based on CV */}
        <div className="mt-16 pt-12 border-t border-black/10">
          <div className="flex items-center gap-3 mb-8 justify-center">
            <Award className="w-6 h-6 text-black" />
            <h3 className="text-xl sm:text-2xl font-black text-[#1a1a1a]">
              অফিশিয়াল সার্টিফিকেশন ও ট্রেনিং (NSDA & অন্যান্য)
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {certifications.map((cert) => (
              <div
                key={cert.id}
                className="bg-white border border-black/10 hover:border-black/30 rounded-2xl p-6 shadow-sm transition-all flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="inline-block px-2.5 py-1 rounded-md bg-zinc-100 border border-black/10 text-black text-[11px] font-black uppercase tracking-wider mb-3">
                    {cert.year || 'ভেরিফাইড'}
                  </div>
                  <h4 className="text-base font-black text-[#1a1a1a] leading-snug mb-1">
                    {cert.title}
                  </h4>
                  <p className="text-xs text-zinc-600 font-medium">
                    {cert.issuer}
                  </p>
                </div>

                {cert.credentialId && (
                  <div className="pt-3 border-t border-black/5 text-[11px] font-mono text-zinc-500 font-medium">
                    আইডি: <span className="text-black font-bold">{cert.credentialId}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
