export interface VintageStamp {
  id: string;
  name: string;
  value: string;
  sub: string;
  icon: string;
  color: string;
  bgGradient: string;
  borderColor: string;
  lore: string;
  isPeacockFeather?: boolean;
  isLotus?: boolean;
  isRunner?: boolean;
}

export const VINTAGE_STAMPS: VintageStamp[] = [
  {
    id: 'dove',
    name: 'শান্তির পায়রা (Peace Dove)',
    value: '৳১.৫০',
    sub: 'AIR MAIL',
    icon: '🕊️',
    color: '#0369a1',
    bgGradient: 'from-sky-50 via-sky-100 to-blue-200',
    borderColor: '#0284c7',
    lore: 'চিঠি পৌঁছে দেওয়ার চিরন্তন প্রতীক',
  },
  {
    id: 'runner',
    name: 'ডাকহরকরা (The Runner)',
    value: '৳৩.৫০',
    sub: 'POSTAL RUNNER',
    icon: '🏃',
    color: '#b45309',
    bgGradient: 'from-amber-50 via-orange-100 to-yellow-200',
    borderColor: '#b45309',
    lore: 'ঝুমঝুম ঘণ্টা আর হারিকেন হাতে রাতের রানার',
    isRunner: true,
  },
  {
    id: 'peacock',
    name: 'ময়ূরের পাখা (Peacock Feather)',
    value: '৳৫.০০',
    sub: 'SPECIAL',
    icon: '🪶',
    color: '#047857',
    bgGradient: 'from-emerald-50 via-teal-100 to-cyan-200',
    borderColor: '#059669',
    lore: 'বইয়ের পাতার চিরন্তন স্মৃতির ছোঁয়া',
    isPeacockFeather: true,
  },
  {
    id: 'lotus',
    name: 'লাল পদ্ম (Crimson Lotus)',
    value: '৳১০.০০',
    sub: 'EXPRESS',
    icon: '🪷',
    color: '#be123c',
    bgGradient: 'from-rose-50 via-rose-100 to-pink-200',
    borderColor: '#e11d48',
    lore: 'না বলা অনুরাগের বার্তা',
    isLotus: true,
  },
  {
    id: 'lantern',
    name: 'আদি হারিকেন (Vintage Lantern)',
    value: '৳২.০০',
    sub: 'POSTAGE',
    icon: '🏮',
    color: '#b45309',
    bgGradient: 'from-amber-50 via-amber-100 to-yellow-200',
    borderColor: '#d97706',
    lore: 'হারিকেনের আলোয় লেখা স্মৃতির চিঠি',
  },
  {
    id: 'tiger',
    name: 'সুন্দরবনের বাঘ (Bengal Tiger)',
    value: '৳২৫.০০',
    sub: 'COMMEMORATIVE',
    icon: '🐅',
    color: '#c2410c',
    bgGradient: 'from-orange-50 via-amber-100 to-yellow-200',
    borderColor: '#ea580c',
    lore: 'সাহস ও দৃঢ়তার চিরন্তন স্মারক',
  },
  {
    id: 'crescent',
    name: 'রুপালি চাঁদ (Crescent Moon)',
    value: '৳৫০.০০',
    sub: 'NIGHT POST',
    icon: '🌙',
    color: '#4338ca',
    bgGradient: 'from-indigo-50 via-slate-100 to-indigo-200',
    borderColor: '#6366f1',
    lore: 'গভীর রাতের গোপন ভাবনার দূত',
  }
];
