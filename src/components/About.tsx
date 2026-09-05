import React from 'react';
import { useSite } from '../context/SiteContext';
import { 
  User, 
  Sparkles, 
  Globe2, 
  Heart, 
  Compass, 
  Layers, 
  CheckCircle2, 
  Camera, 
  Target, 
  Mail, 
  MessageCircle 
} from 'lucide-react';

export const About: React.FC = () => {
  const { settings } = useSite();

  return (
    <section id="about" className="py-24 relative overflow-hidden bg-[#fdfdfb]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-zinc-100 border border-black/10 text-zinc-800 text-xs font-bold uppercase tracking-wider">
            <User className="w-3.5 h-3.5 text-black" />
            <span>পরিচিতি ও লক্ষ্য</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#1a1a1a] tracking-tight">
            আমার সম্পর্কে ও কাজের দর্শন
          </h2>
          <p className="text-zinc-600 text-sm sm:text-base leading-relaxed font-normal">
            {settings.aboutHeadline}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Story Cards */}
          <div className="lg:col-span-7 space-y-6">
            <div className="card-3d rounded-2xl p-6 sm:p-8 space-y-4">
              <h3 className="text-xl font-black text-[#1a1a1a] flex items-center gap-2.5">
                <Sparkles className="w-5 h-5 text-emerald-600" />
                <span>ভিজ্যুয়াল স্টোরিটেলিং ও আধুনিক ডিজাইন</span>
              </h3>
              {settings.aboutStory.map((paragraph, index) => (
                <p key={index} className="text-zinc-600 leading-relaxed text-sm sm:text-base">
                  {paragraph}
                </p>
              ))}

              <div className="pt-4 border-t border-black/10 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-zinc-50 border border-black/10">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                    <Target className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-black">ক্লায়েন্ট ফোকাসড</h4>
                    <p className="text-xs text-zinc-600 font-normal">প্রতিটি ডিজাইনে নির্দিষ্ট লক্ষ্য ও কাঙ্ক্ষিত ফলাফল নিশ্চিতকরণ</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 rounded-xl bg-zinc-50 border border-black/10">
                  <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                    <Layers className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-black">আধুনিক টুলস</h4>
                    <p className="text-xs text-zinc-600 font-normal">ফটোশপ ও ইলাস্ট্রেটরে অ্যাডভান্সড ভেক্টর ও লেয়ারিং ওয়ার্কফ্লো</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Language proficiency & interests */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              {/* Language card */}
              <div className="card-3d rounded-2xl p-6 space-y-4">
                <h4 className="text-base font-bold text-[#1a1a1a] flex items-center gap-2">
                  <Globe2 className="w-4 h-4 text-emerald-600" />
                  <span>ভাষাগত দক্ষতা (Languages)</span>
                </h4>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-xs font-bold mb-1">
                      <span className="text-zinc-900">বাংলা (Bangla)</span>
                      <span className="text-emerald-700">মাতৃভাষা - ১০০%</span>
                    </div>
                    <div className="w-full h-2.5 bg-zinc-100 rounded-full overflow-hidden border border-black/10">
                      <div className="h-full bg-emerald-600 rounded-full w-full"></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-bold mb-1">
                      <span className="text-zinc-900">ইংরেজি (English)</span>
                      <span className="text-zinc-700">লিখিত ও মৌখিক - ৮০%</span>
                    </div>
                    <div className="w-full h-2.5 bg-zinc-100 rounded-full overflow-hidden border border-black/10">
                      <div className="h-full bg-zinc-800 rounded-full w-4/5"></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Interests & Hobbies */}
              <div className="card-3d rounded-2xl p-6 space-y-3">
                <h4 className="text-base font-bold text-[#1a1a1a] flex items-center gap-2">
                  <Heart className="w-4 h-4 text-rose-500" />
                  <span>আগ্রহ ও প্যাশন (Interests)</span>
                </h4>
                <div className="flex flex-wrap gap-2">
                  {settings.interests.map((interest, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1.5 text-xs font-bold rounded-xl bg-zinc-100 border border-black/10 text-zinc-800 flex items-center gap-1.5 hover:bg-zinc-200 transition-colors"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      {interest}
                    </span>
                  ))}
                </div>
              </div>

            </div>
          </div>

          {/* Right Column: Key Details & Fast Contacts */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Quick Profile Summary Box */}
            <div className="card-3d rounded-2xl p-6 sm:p-8 space-y-5">
              <h3 className="text-lg font-black text-[#1a1a1a] flex items-center gap-2 border-b border-black/10 pb-3">
                <Compass className="w-5 h-5 text-black" />
                <span>দ্রুত তথ্যাবলী</span>
              </h3>

              <div className="space-y-3 text-sm">
                <div className="flex items-start justify-between gap-2 py-1.5 border-b border-black/5">
                  <span className="text-zinc-500 text-xs font-bold">পূর্ণ নাম:</span>
                  <span className="text-zinc-900 font-bold text-right">মাহিম ইবনে খুদি</span>
                </div>
                <div className="flex items-start justify-between gap-2 py-1.5 border-b border-black/5">
                  <span className="text-zinc-500 text-xs font-bold">পেশা / রোল:</span>
                  <span className="text-black font-bold text-right">গ্রাফিক ডিজাইনার ও সোশ্যাল মিডিয়া স্পেশালিস্ট</span>
                </div>
                <div className="flex items-start justify-between gap-2 py-1.5 border-b border-black/5">
                  <span className="text-zinc-500 text-xs font-bold">বর্তমান প্রতিষ্ঠান:</span>
                  <span className="text-zinc-900 font-bold text-right">দেশী ভোজ (DESHI VOJ) ও ফাইভার</span>
                </div>
                <div className="flex items-start justify-between gap-2 py-1.5 border-b border-black/5">
                  <span className="text-zinc-500 text-xs font-bold">বর্তমান বিশ্ববিদ্যালয়:</span>
                  <span className="text-zinc-900 font-bold text-right">ঢাকা সেন্ট্রাল ইউনিভার্সিটি (রাষ্ট্রবিজ্ঞান)</span>
                </div>
                <div className="flex items-start justify-between gap-2 py-1.5 border-b border-black/5">
                  <span className="text-zinc-500 text-xs font-bold">কাজের ধরন:</span>
                  <span className="text-emerald-700 font-bold text-right">অনলাইন ফ্রিল্যান্সিং ও রিমোট প্রজেক্ট</span>
                </div>
                <div className="flex items-start justify-between gap-2 py-1.5">
                  <span className="text-zinc-500 text-xs font-bold">সরাসরি যোগাযোগ:</span>
                  <a 
                    href={settings.whatsappLink || 'https://wa.me/@mahim.wp'}
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-emerald-700 font-bold hover:underline flex items-center gap-1 text-right"
                  >
                    <span>হোয়াটসঅ্যাপ চ্যাট</span>
                    <span>→</span>
                  </a>
                </div>
              </div>

              <div className="pt-2">
                <a
                  href={settings.whatsappLink || 'https://wa.me/@mahim.wp'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:brightness-105 text-white font-bold text-xs tracking-wide transition-all shadow-md active:scale-95"
                >
                  <MessageCircle className="w-4 h-4 text-white" />
                  <span>হোয়াটসঅ্যাপে সরাসরি কথা বলুন</span>
                </a>
              </div>
            </div>

            {/* Quote banner */}
            <div className="p-5 rounded-2xl bg-zinc-100 border-l-4 border-black rounded-r-xl">
              <p className="text-xs sm:text-sm italic text-zinc-700 leading-relaxed font-medium">
                "ভালো ডিজাইন শুধু দেখতে সুন্দর হওয়াই নয়; এটি একটি ব্র্যান্ডের ব্যক্তিত্ব ও ভাবমূর্তিকে সঠিক দর্শকের কাছে পৌঁছে দেওয়ার সবচেয়ে শক্তিশালী মাধ্যম।"
              </p>
              <p className="text-[11px] font-black text-black mt-2 font-mono uppercase tracking-wider">
                — মাহিম ইবনে খুদি
              </p>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
