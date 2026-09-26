export interface ChithiToken {
  id: string;
  name: string;
  shortName: string;
  icon: string;
  meaning: string;
  tagColor: string;
  borderColor: string;
  bgGradient: string;
  isSvg?: boolean;
}

export const CHITHI_TOKENS: ChithiToken[] = [
  {
    id: 'peacock_feather',
    name: 'ময়ূরের পাখা (Peacock Feather)',
    shortName: 'ময়ূরের পাখা',
    icon: '🪶',
    meaning: 'বইয়ের পাতার চিরন্তন স্মৃতির ছোঁয়া',
    tagColor: '#047857',
    borderColor: '#10b981',
    bgGradient: 'from-emerald-50 via-teal-50 to-cyan-100',
    isSvg: true
  },
  {
    id: 'rose',
    name: 'শুকনো গোলাপের পাপড়ি (Dried Rose)',
    shortName: 'শুকনো গোলাপ',
    icon: '🥀',
    meaning: 'চিঠির খাঁজে জমা না বলা অনুরাগ',
    tagColor: '#be123c',
    borderColor: '#f43f5e',
    bgGradient: 'from-rose-50 via-pink-50 to-red-100'
  },
  {
    id: 'jasmine',
    name: 'স্নিগ্ধ বেলি ফুল (Jasmine Flower)',
    shortName: 'বেলি ফুল',
    icon: '🌼',
    meaning: 'স্নিগ্ধ ও নির্ভেজাল বন্ধুত্বের সৌরভ',
    tagColor: '#b45309',
    borderColor: '#f59e0b',
    bgGradient: 'from-amber-50 via-yellow-50 to-orange-100'
  },
  {
    id: 'coffee',
    name: 'এক কাপ চা/কফি (Cup of Tea/Coffee)',
    shortName: 'এক কাপ কফি',
    icon: '☕',
    meaning: 'আড্ডার মিষ্টি উষ্ণতা ও শুভকামনা',
    tagColor: '#78350f',
    borderColor: '#92400e',
    bgGradient: 'from-amber-50 via-orange-50 to-stone-100'
  },
  {
    id: 'chocolate',
    name: 'একটি চকলেট (Sweet Chocolate)',
    shortName: 'চকলেট',
    icon: '🍫',
    meaning: 'মনের দূরত্ব ভুলিয়ে দেওয়ার মিষ্টি অনুভূতি',
    tagColor: '#7c2d12',
    borderColor: '#b45309',
    bgGradient: 'from-orange-50 via-amber-50 to-stone-100'
  },
  {
    id: 'wax_heart',
    name: 'ভালোবাসার লাল মোম (Wax Heart Seal)',
    shortName: 'ভালোবাসার মোম',
    icon: '❤️',
    meaning: 'অটুট শ্রদ্ধা ও আন্তরিক ভালোবাসা',
    tagColor: '#991b1b',
    borderColor: '#dc2626',
    bgGradient: 'from-red-50 via-rose-50 to-rose-100'
  }
];
