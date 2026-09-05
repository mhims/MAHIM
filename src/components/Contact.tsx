import React, { useState } from 'react';
import { useSite } from '../context/SiteContext';
import { 
  Mail, 
  Linkedin, 
  MessageCircle, 
  Send, 
  CheckCircle2, 
  Sparkles,
  ExternalLink,
  Facebook,
  Instagram,
  ArrowUpRight
} from 'lucide-react';

export const Contact: React.FC = () => {
  const { settings, addContactMessage } = useSite();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedMessage, setSubmittedMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setIsSubmitting(true);
    const result = await addContactMessage(formData);
    setIsSubmitting(false);

    if (result.success) {
      setSubmittedMessage(result.message);
      setFormData({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setSubmittedMessage(''), 6000);
    }
  };

  const socialCards = [
    {
      name: 'Facebook',
      url: settings.facebookUrl || 'https://facebook.com/mahim2005',
      icon: Facebook,
      style: 'bg-[#1877F2] text-white hover:brightness-110',
    },
    {
      name: 'Instagram',
      url: settings.instagramUrl || 'https://instagram.com/_mahim_official_',
      icon: Instagram,
      style: 'bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] text-white hover:brightness-110',
    },
    {
      name: 'LinkedIn',
      url: settings.linkedinUrl || 'https://linkedin.com/in/mahimibnekhudi',
      icon: Linkedin,
      style: 'bg-[#0A66C2] text-white hover:brightness-110',
    },
    {
      name: 'Fiverr',
      url: settings.fiverrUrl || 'https://fiverr.com/mahimibnekhudi',
      customText: 'fi',
      style: 'bg-[#00b22d] text-white hover:brightness-110',
    },
    {
      name: 'Behance',
      url: settings.behanceUrl || 'https://behance.net/mahimibnekhudi',
      customText: 'Bē',
      style: 'bg-[#0057ff] text-white hover:brightness-110',
    },
  ];

  return (
    <section id="contact" className="py-24 relative overflow-hidden bg-zinc-50/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-zinc-100 border border-black/10 text-zinc-800 text-xs font-bold uppercase tracking-wider">
            <Mail className="w-3.5 h-3.5 text-black" />
            <span>সরাসরি যোগাযোগ</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#1a1a1a] tracking-tight">
            আসুন আপনার নতুন প্রজেক্ট নিয়ে কথা বলি
          </h2>
          <p className="text-zinc-600 text-sm sm:text-base leading-relaxed font-normal">
            ডিজাইন, সোশ্যাল মিডিয়া ব্র্যান্ডিং কিংবা যে কোনো আলোচনার জন্য সরাসরি হোয়াটসঅ্যাপ বা মেসেজ পাঠাতে পারেন
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start max-w-6xl mx-auto">
          
          {/* Left Column: Direct Contact Details Cards */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* Primary WhatsApp Direct Contact Card */}
            <a
              href={settings.whatsappLink || 'https://wa.me/@mahim.wp'}
              target="_blank"
              rel="noopener noreferrer"
              className="relative overflow-hidden bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-700 text-white rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 block group hover:scale-[1.02] border-2 border-emerald-400/40"
            >
              {/* Gloss background highlight */}
              <div className="absolute top-0 right-0 w-36 h-36 bg-white/15 rounded-full blur-2xl pointer-events-none" />

              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl bg-white text-emerald-600 flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                  <MessageCircle className="w-7 h-7" />
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-black text-white border border-white/30">
                  <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                  <span>ইনস্ট্যান্ট রেসপন্স</span>
                </div>
              </div>

              <p className="text-xs font-bold uppercase tracking-wider text-emerald-100">
                সরাসরি ও সবচেয়ে দ্রুত যোগাযোগের মাধ্যম
              </p>
              <h3 className="text-xl font-black tracking-tight text-white mt-0.5">
                হোয়াটসঅ্যাপ চ্যাট
              </h3>
              <p className="text-emerald-100 text-xs mt-1 font-mono">
                wa.me/@mahim.wp
              </p>

              <div className="mt-5 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-emerald-800 text-xs font-black shadow-md group-hover:bg-emerald-50 transition-colors">
                <span>মেসেজ শুরু করতে এখানে ক্লিক করুন</span>
                <ArrowUpRight className="w-4 h-4" />
              </div>
            </a>

            {/* Email Card */}
            <a
              href={`mailto:${settings.email}`}
              className="bg-white border border-black/10 shadow-sm rounded-2xl p-5 flex items-center gap-4 group hover:border-black/30 hover:shadow-lg transition-all"
            >
              <div className="w-12 h-12 rounded-xl bg-zinc-100 border border-black/10 flex items-center justify-center text-black group-hover:scale-105 transition-transform">
                <Mail className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-zinc-500 font-medium">অফিশিয়াল ইমেইল</p>
                <p className="text-sm sm:text-base font-black text-[#1a1a1a] group-hover:text-black transition-colors truncate">
                  {settings.email}
                </p>
              </div>
              <ExternalLink className="w-4 h-4 text-zinc-400 group-hover:text-black transition-colors shrink-0" />
            </a>

            {/* Colorful Social Media Connect Grid */}
            <div className="bg-white border border-black/10 rounded-2xl p-5 shadow-sm space-y-3">
              <p className="text-xs font-black uppercase tracking-wider text-zinc-500">
                সোশ্যাল নেটওয়ার্ক ও পোর্টফোলিও:
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {socialCards.map((item) => (
                  <a
                    key={item.name}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold shadow-xs transition-transform hover:scale-105 active:scale-95 ${item.style}`}
                  >
                    {item.customText ? (
                      <span className="font-black text-[11px]">{item.customText}</span>
                    ) : item.icon ? (
                      <item.icon className="w-3.5 h-3.5" />
                    ) : null}
                    <span>{item.name}</span>
                  </a>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column: Working Contact Form */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-black/10 shadow-sm relative">
              <h3 className="text-xl font-black text-[#1a1a1a] mb-2 flex items-center gap-2">
                <Send className="w-5 h-5 text-black" />
                <span>মেসেজ পাঠান</span>
              </h3>
              <p className="text-xs sm:text-sm text-zinc-600 mb-6 font-normal">
                আপনার বার্তাটি সরাসরি মাহিমের কাছে পৌঁছাবে এবং গুগল শিটে সংরক্ষিত থাকবে।
              </p>

              {submittedMessage && (
                <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-sm flex items-center gap-3 animate-fade-in font-medium">
                  <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
                  <span>{submittedMessage}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-zinc-700 mb-1.5">
                      আপনার নাম <span className="text-rose-600">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      placeholder="উদাঃ সাকিব আহমেদ"
                      className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-black/10 text-black placeholder-zinc-400 text-sm focus:outline-none focus:border-black focus:bg-white transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-700 mb-1.5">
                      ইমেইল এড্রেস <span className="text-rose-600">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                      placeholder="your.email@example.com"
                      className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-black/10 text-black placeholder-zinc-400 text-sm focus:outline-none focus:border-black focus:bg-white transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1.5">
                    বিষয় / সার্ভিস টাইপ
                  </label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={e => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="উদাঃ সোশ্যাল মিডিয়া ব্যানার ডিজাইন / লোগো ব্র্যান্ডিং"
                    className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-black/10 text-black placeholder-zinc-400 text-sm focus:outline-none focus:border-black focus:bg-white transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1.5">
                    আপনার বিস্তারিত মেসেজ <span className="text-rose-600">*</span>
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={formData.message}
                    onChange={e => setFormData({ ...formData, message: e.target.value })}
                    placeholder="আপনার প্রজেক্টের বিস্তারিত এবং কীভাবে সাহায্য করতে পারি লিখুন..."
                    className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-black/10 text-black placeholder-zinc-400 text-sm focus:outline-none focus:border-black focus:bg-white transition-colors resize-none"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 rounded-xl bg-black hover:bg-zinc-800 text-white font-black text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>পাঠানো হচ্ছে...</span>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>মেসেজ সেন্ড করুন</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
