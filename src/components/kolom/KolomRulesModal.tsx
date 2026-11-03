import React from 'react';
import { X, Award, Target, HelpCircle, Heart } from 'lucide-react';

interface KolomRulesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const KolomRulesModal: React.FC<KolomRulesModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm font-['Hind_Siliguri',sans-serif]">
      <div className="relative w-full max-w-xl bg-stone-900 border-2 border-amber-700/60 rounded-3xl p-5 sm:p-6 text-white shadow-2xl max-h-[90vh] overflow-y-auto space-y-4">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-amber-800/40">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-amber-950/70 text-amber-400 border border-amber-700/40">
              <HelpCircle size={22} />
            </span>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-amber-200">
                কীভাবে খেলবেন?
              </h2>
              <p className="text-xs text-amber-400/80">
                ছোটবেলার স্কুলের বেঞ্চে খেলা 'কলম-কলম' এর আসল নিয়ম
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-stone-800 text-stone-400 hover:text-white transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Nostalgic Note */}
        <div className="p-3.5 rounded-2xl bg-amber-950/40 border border-amber-800/40 text-amber-200 text-xs sm:text-sm leading-relaxed">
          <div className="flex items-center gap-1.5 font-bold text-amber-300 mb-1">
            <Heart size={14} className="text-rose-400 fill-rose-400" />
            <span>স্কুলের কাঠের বেঞ্চের সেই হারিয়ে যাওয়া স্মৃতি:</span>
          </div>
          টিফিনের ফাঁকে বা ক্লাসে স্যার আসার ঠিক আগের মুহূর্তে ক্লাসরুমের কাঠের বেঞ্চের ওপর বন্ধুদের সাথে কলম দিয়ে মারামারি খেলার অনুভূতি অন্যরকম! কার কলম কত ভারী, কোনটা দিয়ে ভালো পুশ দেওয়া যায়—এসব নিয়ে চলতো তুমুল তর্ক।
        </div>

        {/* Rules List */}
        <div className="space-y-3 text-xs sm:text-sm">
          {/* Rule 1 */}
          <div className="flex items-start gap-3 p-3 rounded-xl bg-stone-800/70 border border-stone-700/60">
            <span className="p-2 rounded-lg bg-sky-950 text-sky-400 font-black text-sm">
              ১
            </span>
            <div>
              <h3 className="font-bold text-sky-200 flex items-center gap-1.5">
                <Target size={14} />
                কলম ফ্লিক / টানুন (Slingshot):
              </h3>
              <p className="text-stone-300 mt-0.5">
                আপনার চালের সময় নিজের কলমে আঙুল বা মাউস দিয়ে চেপে <strong>পেছনের দিকে টেনে নিন</strong> এবং লক্ষ্য স্থির করে <strong>ছেড়ে দিন</strong>। যত বেশি টানবেন, তত জোরে কলম ছুটে যাবে!
              </p>
            </div>
          </div>

          {/* Rule 2 */}
          <div className="flex items-start gap-3 p-3 rounded-xl bg-stone-800/70 border border-stone-700/60">
            <span className="p-2 rounded-lg bg-amber-950 text-amber-400 font-black text-sm">
              ২
            </span>
            <div>
              <h3 className="font-bold text-amber-200 flex items-center gap-1.5">
                <Award size={14} />
                টেবিল থেকে ফেলে দেওয়া:
              </h3>
              <p className="text-stone-300 mt-0.5">
                প্রতিপক্ষের কলমকে সজোরে ধাক্কা দিয়ে টেবিলের যে কোনো কিনারা দিয়ে নিচে ফেলে দিতে পারলেই <strong>১ পয়েন্ট পাবেন</strong> এবং রাউন্ড জিতবেন।
              </p>
            </div>
          </div>

          {/* Rule 3 */}
          <div className="flex items-start gap-3 p-3 rounded-xl bg-stone-800/70 border border-stone-700/60">
            <span className="p-2 rounded-lg bg-rose-950 text-rose-400 font-black text-sm">
              ৩
            </span>
            <div>
              <h3 className="font-bold text-rose-200">
                সাবধান! নিজের কলম যেন না পড়ে:
              </h3>
              <p className="text-stone-300 mt-0.5">
                ধাক্কা দিতে গিয়ে যদি নিজের কলম টেবিল থেকে গড়িয়ে নিচে পড়ে যায় (Faul / Suicidal shot), তবে প্রতিপক্ষ সরাসরি পয়েন্ট পেয়ে যাবে!
              </p>
            </div>
          </div>
        </div>

        {/* Close Button */}
        <div className="pt-2 text-center">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-8 py-2.5 rounded-full bg-amber-600 hover:bg-amber-500 text-white font-bold text-sm transition-all shadow-md cursor-pointer"
          >
            বুঝেছি, খেলা শুরু করি!
          </button>
        </div>

      </div>
    </div>
  );
};
