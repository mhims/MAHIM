import React, { useState, useEffect } from 'react';
import { X, LogIn, UserPlus, Phone, User, School, CheckCircle2, LogOut } from 'lucide-react';
import { getCurrentStudent, saveStudentSession, logoutStudent, StudentUser } from '../utils/studentAuth';

interface StudentAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (student: StudentUser) => void;
  defaultMode?: 'login' | 'signup';
}

export const StudentAuthModal: React.FC<StudentAuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  defaultMode = 'login',
}) => {
  const [mode, setMode] = useState<'login' | 'signup'>(defaultMode);
  const [currentStudent, setCurrentStudentState] = useState<StudentUser | null>(null);

  // Form Fields
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [institution, setInstitution] = useState('');
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const student = getCurrentStudent();
      setCurrentStudentState(student);
      setMode(defaultMode);
      setError('');
      setIsSuccess(false);
      if (student) {
        setName(student.name);
        setPhone(student.phone);
        setWhatsapp(student.whatsapp);
        setInstitution(student.institution || '');
      }
    }
  }, [isOpen, defaultMode]);

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const cleanPhone = phone.trim().replace(/[^0-9]/g, '');
    const cleanName = name.trim();

    if (cleanPhone.length < 11) {
      setError('সঠিক ১১ ডিজিটের মোবাইল নম্বর প্রদান করুন (যেমন: 017XXXXXXXX)');
      return;
    }

    if (!cleanName) {
      setError('আপনার পুরো নাম লিখুন');
      return;
    }

    const student: StudentUser = {
      id: `student_${cleanPhone}`,
      name: cleanName,
      phone: cleanPhone,
      whatsapp: whatsapp.trim() || cleanPhone,
      institution: institution.trim(),
      createdAt: new Date().toISOString(),
    };

    saveStudentSession(student);
    setCurrentStudentState(student);
    setIsSuccess(true);

    setTimeout(() => {
      onSuccess?.(student);
      onClose();
    }, 600);
  };

  const handleLogout = () => {
    logoutStudent();
    setCurrentStudentState(null);
    setName('');
    setPhone('');
    setWhatsapp('');
    setInstitution('');
    setIsSuccess(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in font-sans">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-orange-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 px-6 py-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-white/20 rounded-xl">
              <User className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg tracking-tight font-['Hind_Siliguri',sans-serif]">
                {currentStudent ? 'শিক্ষার্থী প্রোফাইল' : 'শিক্ষার্থী লগ ইন'}
              </h3>
              <p className="text-xs text-orange-100 font-['Hind_Siliguri',sans-serif]">
                মাহিম’স ক্লাসরুম ও কোর্স এনরোলমেন্ট
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/15 hover:bg-white/25 text-white transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {currentStudent ? (
            /* Logged In View */
            <div className="text-center py-4 space-y-4 font-['Hind_Siliguri',sans-serif]">
              <div className="w-16 h-16 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mx-auto text-2xl font-black">
                {currentStudent.name.charAt(0)}
              </div>
              <div>
                <h4 className="text-xl font-black text-zinc-900">{currentStudent.name}</h4>
                <p className="text-sm text-zinc-600 font-mono mt-0.5">📱 {currentStudent.phone}</p>
                {currentStudent.institution && (
                  <p className="text-xs text-orange-700 bg-orange-50 px-3 py-1 rounded-full inline-block mt-2 font-medium">
                    🏫 {currentStudent.institution}
                  </p>
                )}
              </div>

              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3.5 text-xs text-emerald-800 text-left space-y-1">
                <div className="font-bold flex items-center gap-1 text-emerald-900">
                  <CheckCircle2 size={14} />
                  <span>আপনি লগ ইন অবস্থায় আছেন</span>
                </div>
                <p>এখন আপনি যেকোনো মেন্টরশীপ বা একাডেমিক কোর্সে সরাসরি ভর্তি ও এনরোল করতে পারবেন।</p>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={onClose}
                  className="flex-1 py-3 px-4 rounded-xl font-bold text-sm bg-orange-500 hover:bg-orange-600 text-white shadow-md shadow-orange-500/25 transition-all cursor-pointer"
                >
                  কোর্সে ফিরে যান
                </button>
                <button
                  onClick={handleLogout}
                  className="py-3 px-4 rounded-xl font-bold text-sm bg-zinc-100 hover:bg-red-50 hover:text-red-600 text-zinc-700 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <LogOut size={15} />
                  <span>লগআউট</span>
                </button>
              </div>
            </div>
          ) : (
            /* Login / Signup Form */
            <div>
              {/* Tab Switcher */}
              <div className="flex bg-orange-50 p-1 rounded-2xl mb-6 font-['Hind_Siliguri',sans-serif]">
                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    setError('');
                  }}
                  className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    mode === 'login'
                      ? 'bg-white text-orange-600 shadow-sm'
                      : 'text-zinc-600 hover:text-orange-600'
                  }`}
                >
                  <LogIn size={14} />
                  <span>লগ ইন</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMode('signup');
                    setError('');
                  }}
                  className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    mode === 'signup'
                      ? 'bg-white text-orange-600 shadow-sm'
                      : 'text-zinc-600 hover:text-orange-600'
                  }`}
                >
                  <UserPlus size={14} />
                  <span>নতুন শিক্ষার্থী (রেজিস্ট্রেশন)</span>
                </button>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl font-['Hind_Siliguri',sans-serif]">
                  {error}
                </div>
              )}

              {isSuccess && (
                <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2 font-['Hind_Siliguri',sans-serif]">
                  <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                  <span>সফলভাবে লগ ইন সম্পন্ন হয়েছে! রিডাইরেক্ট হচ্ছে...</span>
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-4 font-['Hind_Siliguri',sans-serif]">
                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1.5">
                    আপনার পুরো নাম <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="যেমন: রাকিব হাসান"
                      className="w-full pl-10 pr-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white text-zinc-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-1.5">
                    মোবাইল নম্বর <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="01XXXXXXXXX"
                      className="w-full pl-10 pr-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white text-zinc-900 font-mono"
                    />
                  </div>
                  <p className="text-[11px] text-zinc-500 mt-1">
                    এই নম্বরে আপনার কোর্স এক্সেস ও নোটিফিকেশন যুক্ত থাকবে।
                  </p>
                </div>

                {mode === 'signup' && (
                  <>
                    <div>
                      <label className="block text-xs font-bold text-zinc-700 mb-1.5">
                        হোয়াটসঅ্যাপ নম্বর (ঐচ্ছিক)
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                        <input
                          type="tel"
                          value={whatsapp}
                          onChange={(e) => setWhatsapp(e.target.value)}
                          placeholder="মোবাইল নম্বরের সমান হলে ফাঁকা রাখুন"
                          className="w-full pl-10 pr-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white text-zinc-900 font-mono"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-zinc-700 mb-1.5">
                        কলেজ বা স্কুলের নাম (ঐচ্ছিক)
                      </label>
                      <div className="relative">
                        <School className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                        <input
                          type="text"
                          value={institution}
                          onChange={(e) => setInstitution(e.target.value)}
                          placeholder="যেমন: ঢাকা কলেজ / নটর ডেম কলেজ"
                          className="w-full pl-10 pr-3.5 py-2.5 bg-zinc-50 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white text-zinc-900"
                        />
                      </div>
                    </div>
                  </>
                )}

                <button
                  type="submit"
                  className="w-full py-3 px-4 rounded-xl font-bold text-sm bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
                >
                  <LogIn size={16} />
                  <span>{mode === 'login' ? 'লগ ইন করুন' : 'অ্যাকাউন্ট নিশ্চিত করে প্রবেশ করুন'}</span>
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
