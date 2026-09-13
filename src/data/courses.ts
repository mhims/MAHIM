export interface CourseItem {
  id: string;
  title: string;
  category: 'admission' | 'hsc' | 'ssc' | 'junior' | 'skills' | 'mentorship' | string;
  categoryLabel: string;
  targetBadge?: string;
  description: string;
  highlights: string[];
  status: 'active' | 'launching_soon' | 'upcoming' | 'planning';
  isFeatured?: boolean;
  showOnMainPage?: boolean; // Controls whether it shows on the main /classroom page
  actionText?: string;
  actionUrl?: string; // Optional direct navigation link
  imageUrl?: string; // Optional thumbnail
  price?: string;
  originalPrice?: string;
}

export const ALL_COURSES: CourseItem[] = [
  // 0. Mentorship Course (Featured on main page and all courses)
  {
    id: 'mentorship-program',
    title: 'স্পেশাল মেন্টরশীপ কোর্স (Mentorship Course)',
    category: 'mentorship',
    categoryLabel: 'মেন্টরশীপ প্রোগ্রাম',
    targetBadge: 'শীর্ষ বিশ্ববিদ্যালয়ের ৫ জন মেন্টর • গাইডেড সেশন',
    description: 'এইচএসসি ও বিশ্ববিদ্যালয় ভর্তি পরীক্ষায় সেরা ফলাফল ও ক্যারিয়ার প্ল্যানিং নিশ্চিত করতে অভিজ্ঞ ৫ জন মেন্টরের স্পেশাল ওয়ান-টু-ওয়ান গাইডলাইন প্রোগ্রাম।',
    highlights: [
      '৫ জন অভিজ্ঞ মেন্টরের নিবিড় ও ব্যক্তিগত তত্ত্বাবধান',
      'অধ্যায়ভিত্তিক স্ট্র্যাটেজি, স্টাডি রুটিন ও এক্সাম হ্যাকস',
      'প্রবলেম সলভিং ও মোটিভেশনাল ওয়ান-টু-ওয়ান সেশন',
      'কনসেপ্ট ক্লিয়ারিং থেকে ভর্তি পরীক্ষা জয় করার রোডম্যাপ',
    ],
    status: 'launching_soon',
    isFeatured: true,
    showOnMainPage: true, // Shown in featured courses on /classroom
    actionText: 'বিস্তারিত দেখুন (Coming Soon)',
    actionUrl: '/classroom/courses/mentorship',
    imageUrl: 'https://res.cloudinary.com/drvyjj7td/image/upload/v1789306292/mentorship_qt39pi.jpg',
  },

  // 1. Admission Top Priority
  {
    id: 'admission-exam',
    title: 'ভার্সিটি এডমিশন স্মার্ট এক্সাম ব্যাচ',
    category: 'admission',
    categoryLabel: 'এডমিশন এক্সাম সিরিজ',
    targetBadge: 'বিশ্ববিদ্যালয় ভর্তি ২০২৪-২৫',
    description: 'অনলাইন লাইভ কুইজ, নেগেটিভ মার্কিং ট্র্যাকিং, ইনস্ট্যান্ট মেরিট লিস্ট এবং বিগত ২০ বছরের প্রশ্ন এনালাইসিস ভিত্তিক পূর্ণাঙ্গ এক্সাম সিরিজ।',
    highlights: [
      'স্মার্ট অনলাইন এক্সাম প্ল্যাটফর্ম',
      'নেগেটিভ মার্কিং নির্ভুলতা ও টাইম কন্ট্রোল',
      'টপিকভিত্তিক স্পেশাল ডেইলি কুইজ ও উইকলি টেস্ট',
      'ইনস্ট্যান্ট মেরিট লিস্ট ও রিয়েলটাইম সল্যুশন শিট',
    ],
    status: 'launching_soon',
    isFeatured: true,
    showOnMainPage: true, // Shown on main /classroom page
  },
  {
    id: 'admission-ka',
    title: "ভার্সিটি এডমিশন 'ক' ইউনিট ব্যাচ",
    category: 'admission',
    categoryLabel: 'বিজ্ঞান এডমিশন',
    targetBadge: 'পদার্থ • রসায়ন • উচ্চতর গণিত • জীববিজ্ঞান',
    description: 'পদার্থবিজ্ঞান, রসায়ন, উচ্চতর গণিত এবং জীববিজ্ঞানের কঠিন কনসেপ্টগুলোর সহজ ব্যাখ্যা ও এডমিশন হলে দ্রুত উত্তর করার শর্টকাট টেকনিক।',
    highlights: [
      'কনসেপ্ট ক্ল্যারিটি + টাইম-সেভিং শর্টকাট',
      'অধ্যায়ভিত্তিক এডমিশন হ্যাকস ও টাইপ সলভিং',
      'রিটেন ও এমসিকিউ সমন্বিত গোছানো প্রস্তুতি',
    ],
    status: 'upcoming',
    isFeatured: true,
    showOnMainPage: false,
  },
  {
    id: 'admission-kha',
    title: "ভার্সিটি এডমিশন 'খ' ইউনিট ব্যাচ",
    category: 'admission',
    categoryLabel: 'মানবিক ও বিভাগ পরিবর্তন',
    targetBadge: 'বাংলা • ইংরেজি • সাধারণ জ্ঞান',
    description: 'বাংলা ব্যাকরণ ও টেক্সটবুক এনালাইসিস, বেসিক থেকে এডভান্সড ইংরেজি গ্রামার ও সাম্প্রতিক-মৌলিক সাধারণ জ্ঞানের সম্পূর্ণ গোছানো প্রস্তুতি।',
    highlights: [
      'ইংরেজি গ্রামার ও ভোকাবুলারি স্পেশাল কেয়ার',
      'বাংলা ১ম ও ২য় পত্রের গভীর প্রশ্ন বিশ্লেষণ',
      'মৌলিক জিকে ও সাম্প্রতিক ঘটনাপ্রবাহ ডাইজেস্ট',
    ],
    status: 'upcoming',
    isFeatured: true,
    showOnMainPage: false,
  },

  // 2. HSC Courses (ICT & Bangla Highlighted as requested)
  {
    id: 'hsc-ict',
    title: 'এইচএসসি আইসিটি স্পেশাল মাস্টার ব্যাচ',
    category: 'hsc',
    categoryLabel: 'এইচএসসি (HSC)',
    targetBadge: 'এইচএসসি ২০২৫ ও ২০২৬ (সকল বিভাগ)',
    description: 'সি প্রোগ্রামিং, এইচটিএমএল, সংখ্যা পদ্ধতি ও লজিক গেইটের সম্পূর্ণ কনসেপ্ট ভিত্তিক সমাধান। সহজে ১০০% বোর্ড নম্বর তোলার বিশেষ টেকনিক।',
    highlights: [
      'প্রোগ্রামিং (C) ও অ্যালগরিদম হাতে-কলমে প্র্যাকটিস',
      'ডিজিটাল ডিভাইস, লজিক গেইট ও বুলিয়ান অ্যালজেব্রা',
      'এইচটিএমএল (HTML) কোডিং ও ওয়েব ডিজাইন',
      'বোর্ড প্রশ্ন ও টেস্ট পেপারের সৃজনশীল সলভিং',
    ],
    status: 'launching_soon',
    isFeatured: true,
    showOnMainPage: true, // Shown on main /classroom page
  },
  {
    id: 'hsc-bangla',
    title: 'এইচএসসি বাংলা ও ইংরেজি স্পেশাল কেয়ার',
    category: 'hsc',
    categoryLabel: 'এইচএসসি (HSC)',
    targetBadge: 'এইচএসসি ২০২৫ ও ২০২৬',
    description: 'বাংলা ২য় পত্রের পূর্ণাঙ্গ ব্যাকরণ ও নির্মিতি, ১ম পত্রের গভীর সাহিত্য বিশ্লেষণ এবং ইংরেজি ১ম ও ২য় পত্রের রিটেন স্পেশাল প্র্যাকটিস।',
    highlights: [
      'বাংলা ব্যাকরণের সহজ নিয়ম ও পূর্ণাঙ্গ নির্মিতি প্রস্তুতি',
      'ইংরেজি গ্রামার বেসিক থেকে বোর্ড স্ট্যান্ডার্ড',
      'সৃজনশীল উত্তর উপস্থাপনা ও সময় নিয়ন্ত্রণ ফর্মুলা',
    ],
    status: 'upcoming',
    showOnMainPage: false,
  },
  {
    id: 'hsc-science',
    title: 'এইচএসসি বিজ্ঞান একাডেমিক ও টেস্ট পেপার ব্যাচ',
    category: 'hsc',
    categoryLabel: 'এইচএসসি (বিজ্ঞান)',
    targetBadge: 'পদার্থ • রসায়ন • উচ্চতর গণিত',
    description: 'এইচএসসি বিজ্ঞানের জটিল সূত্র ও গাণিতিক সমস্যার কনসেপ্ট ক্লিয়ারিং ক্লাস এবং শীর্ষ কলেজের টেস্ট পেপার স্পেশাল রিভিশন।',
    highlights: [
      'কনসেপ্ট নোট ও ম্যাথমেটিক্যাল প্রবলেম সলভিং',
      'টপ কলেজ টেস্ট পেপার টাইপভিত্তিক এনালাইসিস',
      'অধ্যায়ভিত্তিক চ্যাপ্টার ফাইনাল এক্সাম',
    ],
    status: 'upcoming',
    showOnMainPage: false,
  },

  // 3. SSC Courses
  {
    id: 'ssc-batch',
    title: 'এসএসসি একাডেমিক ও স্মার্ট এক্সাম ব্যাচ',
    category: 'ssc',
    categoryLabel: 'এসএসসি (৯–১০)',
    targetBadge: 'বিজ্ঞান ও সাধারণ বিভাগ',
    description: 'বোর্ড সিলেবাসের প্রতিটি অধ্যায় নিখুঁতভাবে শেষ করা, টেস্ট পেপার সলভিং এবং অনলাইনে নিয়মিত টাইপভিত্তিক স্মার্ট এক্সাম প্র্যাকটিস।',
    highlights: [
      'গণিত ও বিজ্ঞান বিষয়ের স্পেশাল কনসেপ্ট ক্লাস',
      'বোর্ড স্ট্যান্ডার্ড স্মার্ট অনলাইন এক্সাম',
      'দুর্বলতা চিহ্নিত করে পারসোনাল রিভিশন কেয়ার',
    ],
    status: 'upcoming',
    isFeatured: true,
    showOnMainPage: true, // Shown on main /classroom page
  },

  // 4. Junior & Skills
  {
    id: 'junior-batch',
    title: 'জুনিয়র ম্যাথ ও সাইন্স ফাউন্ডেশন',
    category: 'junior',
    categoryLabel: 'ক্লাস ৬ – ৮',
    targetBadge: '৬ষ্ঠ, ৭ম ও ৮ম শ্রেণি',
    description: 'ছোট থেকেই গণিত ও বিজ্ঞানের ভয় দূর করে ভবিষ্যৎ এসএসসি ও অলিম্পিয়াডের জন্য আত্মবিশ্বাসী ও মজবুত বেসিক গড়ে তোলা।',
    highlights: [
      'মজা করে গণিতের সূত্র ও লজিক শেখা',
      'বিজ্ঞানের বাস্তবমুখী উদাহরণ ও প্রজেক্ট কনসেপ্ট',
      'সাপ্তাহিক অনলাইন প্রগ্রেস কুইজ',
    ],
    status: 'upcoming',
    showOnMainPage: false,
  },
  {
    id: 'future-skills',
    title: 'ফিউচার স্কিলস (Future Skills)',
    category: 'skills',
    categoryLabel: 'স্কিল ডেভেলপমেন্ট',
    targetBadge: 'গ্রাফিক্স ডিজাইন ও এআই টুলস',
    description: 'পড়াশোনার পাশাপাশি ডিজিটাল দুনিয়ায় এগিয়ে থাকার জন্য ইন্ডাস্ট্রি স্ট্যান্ডার্ড গ্রাফিক্স ডিজাইন ও স্মার্ট এআই ওয়ার্কফ্লো প্রশিক্ষণ।',
    highlights: [
      'প্রফেশনাল গ্রাফিক্স ডিজাইনিং ফান্ডামেন্টালস',
      'এআই টুলসের স্মার্ট প্রোডাক্টিভিটি ব্যবহার',
      'হাতে-কলমে প্রজেক্ট ও পোর্টফোলিও মেকিং',
    ],
    status: 'planning',
    showOnMainPage: false,
  },
];

// Helper to get only the courses selected for the main /classroom page
export function getMainPageCourses(): CourseItem[] {
  return ALL_COURSES.filter((course) => course.showOnMainPage === true);
}
