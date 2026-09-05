import React, { useState } from 'react';
import { useSite } from '../context/SiteContext';
import { 
  X, 
  User, 
  Mail, 
  Briefcase, 
  Phone, 
  Lock, 
  CheckCircle2, 
  ShieldCheck, 
  Sparkles,
  ArrowRight
} from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, closeAuthModal, registerUser, loginUser, currentUser } = useSite();
  const [mode, setMode] = useState<'login' | 'signup'>('signup');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    occupation: '',
    phone: '',
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setIsLoading(true);

    if (mode === 'signup') {
      if (!formData.name || !formData.email) {
        setErrorMessage('নাম ও ইমেইল অবশ্যই পূরণ করুন।');
        setIsLoading(false);
        return;
      }
      const res = await registerUser(formData.name, formData.email, formData.occupation, formData.phone);
      setIsLoading(false);
      if (res.success) {
        setSuccessMessage(res.message);
        setTimeout(() => {
          closeAuthModal();
        }, 1200);
      } else {
        setErrorMessage(res.message);
      }
    } else {
      if (!formData.email) {
        setErrorMessage('আপনার ইমেইল এড্রেস প্রদান করুন।');
        setIsLoading(false);
        return;
      }
      const res = loginUser(formData.email);
      setIsLoading(false);
      if (res.success) {
        setSuccessMessage(res.message);
        setTimeout(() => {
          closeAuthModal();
        }, 1000);
      } else {
        setErrorMessage(res.message);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-md my-8 bg-white border-2 border-black rounded-3xl shadow-2xl overflow-hidden text-left">
        
        {/* Header */}
        <div className="p-6 bg-zinc-50 border-b border-black/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-black text-white flex items-center justify-center">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-[#1a1a1a] leading-tight">
                {mode === 'signup' ? 'পাঠক একাউন্ট খুলুন' : 'একাউন্টে লগইন'}
              </h3>
              <p className="text-xs text-zinc-500 font-medium">
                mahims.com মেম্বার ও ভিআইপি আর্টিকেল পড়তে
              </p>
            </div>
          </div>
          <button
            onClick={closeAuthModal}
            className="p-1.5 rounded-xl text-zinc-500 hover:text-black hover:bg-zinc-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex border-b border-black/10 bg-zinc-100/60">
          <button
            onClick={() => {
              setMode('signup');
              setErrorMessage('');
            }}
            className={`flex-1 py-3 text-xs sm:text-sm font-bold transition-colors cursor-pointer ${
              mode === 'signup'
                ? 'text-black border-b-2 border-black bg-white shadow-xs'
                : 'text-zinc-500 hover:text-black'
            }`}
          >
            নতুন একাউন্ট (Sign Up)
          </button>
          <button
            onClick={() => {
              setMode('login');
              setErrorMessage('');
            }}
            className={`flex-1 py-3 text-xs sm:text-sm font-bold transition-colors cursor-pointer ${
              mode === 'login'
                ? 'text-black border-b-2 border-black bg-white shadow-xs'
                : 'text-zinc-500 hover:text-black'
            }`}
          >
            লগইন (Sign In)
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-300 text-rose-800 text-xs leading-relaxed font-medium">
              {errorMessage}
            </div>
          )}

          {successMessage && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs flex items-center gap-2 font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {mode === 'signup' && (
            <div>
              <label className="block text-xs font-bold text-zinc-700 mb-1.5">
                আপনার পূর্ণ নাম <span className="text-rose-600">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  placeholder="উদাঃ তানভীর আহমেদ"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-zinc-50 border border-black/10 text-black placeholder-zinc-400 text-sm focus:outline-none focus:border-black focus:bg-white"
                />
                <User className="w-4 h-4 text-zinc-400 absolute left-3 top-3.5" />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-zinc-700 mb-1.5">
              ইমেইল এড্রেস <span className="text-rose-600">*</span>
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                placeholder="your.name@example.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-zinc-50 border border-black/10 text-black placeholder-zinc-400 text-sm focus:outline-none focus:border-black focus:bg-white"
              />
              <Mail className="w-4 h-4 text-zinc-400 absolute left-3 top-3.5" />
            </div>
          </div>

          {mode === 'signup' && (
            <>
              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1.5">
                  পেশা / পরিচয় (ঐচ্ছিক)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={formData.occupation}
                    onChange={e => setFormData({ ...formData, occupation: e.target.value })}
                    placeholder="উদাঃ গ্রাফিক ডিজাইনার / শিক্ষার্থী"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-zinc-50 border border-black/10 text-black placeholder-zinc-400 text-sm focus:outline-none focus:border-black focus:bg-white"
                  />
                  <Briefcase className="w-4 h-4 text-zinc-400 absolute left-3 top-3.5" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 mb-1.5">
                  ফোন নম্বর / হোয়াটসঅ্যাপ (ঐচ্ছিক)
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="017XXXXXXXX"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-zinc-50 border border-black/10 text-black placeholder-zinc-400 text-sm focus:outline-none focus:border-black focus:bg-white"
                  />
                  <Phone className="w-4 h-4 text-zinc-400 absolute left-3 top-3.5" />
                </div>
              </div>
            </>
          )}

          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl bg-black hover:bg-zinc-800 text-white font-black text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <span>প্রসেস হচ্ছে...</span>
              ) : (
                <>
                  <span>{mode === 'signup' ? 'একাউন্ট তৈরি করুন' : 'লগইন করুন'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>

          <div className="pt-3 border-t border-black/10 text-[11px] text-zinc-500 space-y-1">
            <p className="flex items-center gap-1 text-zinc-700 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-black" />
              <span>একাউন্ট তৈরি করলেই সাথে সাথে মেম্বার পোস্ট পড়ার সুবিধা পাবেন।</span>
            </p>
            <p className="text-zinc-500">
              ভিআইপি স্পেশাল রিসোর্স ও ফাইল পেতে একাউন্ট খোলার পর এডমিনের অনুমোদন লাগে।
            </p>
          </div>

        </form>

      </div>
    </div>
  );
};
