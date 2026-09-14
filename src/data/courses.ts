export interface CourseItem {
  id: string;
  title: string;
  category: 'admission' | 'hsc' | 'ssc' | 'junior' | 'skills' | 'mentorship' | string;
  categoryLabel: string;
  targetBadge?: string;
  description: string;
  fullDescription?: string;
  highlights: string[];
  courseFeatures?: string[];
  whyThisCourse?: {
    title: string;
    text: string;
    tagline?: string;
  };
  instructors?: {
    main: string;
    co: string;
  };
  status: 'active' | 'launching_soon' | 'upcoming' | 'planning';
  isFeatured?: boolean;
  showOnMainPage?: boolean; // Controls whether it shows on the main /classroom page
  actionText?: string;
  actionUrl?: string; // Optional direct navigation link
  externalBuyUrl?: string; // Link to external academy purchase page
  imageUrl?: string; // Optional thumbnail
  price?: string;
  originalPrice?: string;
}

export const ALL_COURSES: CourseItem[] = [
  // 1. Mentorship Course (Featured on main page and all courses)
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
    showOnMainPage: true, // Only this & 2 external courses shown on main page
    actionText: 'বিস্তারিত দেখুন (Coming Soon)',
    actionUrl: '/classroom/courses/mentorship',
    imageUrl: 'https://res.cloudinary.com/drvyjj7td/image/upload/v1789306292/mentorship_qt39pi.jpg',
  },

  // 2. Octal 1.0 | HSC ICT Course
  {
    id: 'octal-1-hsc-ict',
    title: 'Octal 1.0 | HSC ICT Course',
    category: 'hsc',
    categoryLabel: 'এইচএসসি আইসিটি (HSC ICT)',
    targetBadge: 'HSC সকল বিভাগ • Samnad Academy কোলাবোরেশন',
    description: 'Octal 1.0 হলো HSC শিক্ষার্থীদের জন্য সাজানো একটি পূর্ণাঙ্গ ICT কোর্স, যেখানে HSC ICT-এর গুরুত্বপূর্ণ অধ্যায় ও টপিকগুলো সহজ ভাষায়, ধারণাভিত্তিক ও পরীক্ষামুখী পদ্ধতিতে শেখানো হবে।',
    fullDescription: `Octal 1.0 হলো HSC শিক্ষার্থীদের জন্য সাজানো একটি পূর্ণাঙ্গ ICT কোর্স, যেখানে HSC ICT-এর গুরুত্বপূর্ণ অধ্যায় ও টপিকগুলো সহজ ভাষায়, ধারণাভিত্তিক ও পরীক্ষামুখী পদ্ধতিতে শেখানো হবে।

এই কোর্সে শুধু মুখস্থ নয়—Concept Clear, Board Question Practice, MCQ ও CQ প্রস্তুতি এবং নিয়মিত অনুশীলনের মাধ্যমে ICT-তে ভালো ফলাফল করার জন্য প্রয়োজনীয় প্রস্তুতি দেওয়া হবে।`,
    instructors: {
      main: 'মাহিম',
      co: 'সামিউল সোহরাব',
    },
    highlights: [
      'Instructor - মাহিম • Co-Instructor - সামিউল সোহরাব',
      'প্রতিটি টপিকের সহজ ও পরিষ্কার Concept',
      'CQ ও সৃজনশীল প্রশ্নের প্রস্তুতি + MCQ Practice',
      'HTML ও Programming-এর প্রয়োজনীয় বিষয় হাতে-কলমে শেখানো',
    ],
    courseFeatures: [
      'HSC ICT-এর গুরুত্বপূর্ণ সকল অধ্যায়ের আলোচনা',
      'প্রতিটি টপিকের সহজ ও পরিষ্কার Concept',
      'CQ ও সৃজনশীল প্রশ্নের প্রস্তুতি',
      'গুরুত্বপূর্ণ MCQ ও MCQ Practice',
      'HTML ও Programming-এর প্রয়োজনীয় বিষয়গুলো হাতে-কলমে শেখানো',
      'বোর্ড প্রশ্ন ও গুরুত্বপূর্ণ প্রশ্নের বিশ্লেষণ',
      'পরীক্ষায় কমন পড়ার সম্ভাবনাময় গুরুত্বপূর্ণ টপিক',
      'অধ্যায়ভিত্তিক Practice ও Revision',
      'HSC পরীক্ষায় ভালো ফলাফলের জন্য সম্পূর্ণ Exam-Oriented Preparation',
    ],
    whyThisCourse: {
      title: 'কেন Octal 1.0?',
      text: 'ICT-কে কঠিন মনে না করে সহজভাবে বুঝে শেখা এবং পরীক্ষায় প্রয়োগ করাই এই কোর্সের মূল লক্ষ্য। Basic থেকে Advanced—ধাপে ধাপে এগিয়ে HSC ICT-তে নিজের প্রস্তুতিকে আরও শক্তিশালী করার জন্য Octal 1.0 হতে পারে আপনার নির্ভরযোগ্য সঙ্গী।',
      tagline: 'আজ থেকেই শুরু করুন আপনার HSC ICT প্রস্তুতির নতুন যাত্রা। 💻📚',
    },
    status: 'active',
    isFeatured: true,
    showOnMainPage: true, // Only this & Mentorship & Bangla Boss 2.0 on main page
    actionText: 'বিস্তারিত দেখুন',
    actionUrl: '/classroom/courses/octal-1-hsc-ict',
    externalBuyUrl: 'https://samnadacademy.com/courses/octal-1-hsc-ict/',
    imageUrl: 'https://res.cloudinary.com/drvyjj7td/image/upload/v1789311111/OCTAL-1.0-Samnad-Academy-mahims.com_srlast.jpg',
  },

  // 3. বাংলা বস ২.০ কোর্স
  {
    id: 'bangla-boss-2-course',
    title: 'বাংলা বস ২.০ কোর্স',
    category: 'hsc',
    categoryLabel: 'বাংলা ১ম ও ২য় পত্র (Bangla)',
    targetBadge: 'Academic & Admission • Samnad Academy কোলাবোরেশন',
    description: 'বাংলা বস ২.০ হলো বাংলা বিষয়ের গুরুত্বপূর্ণ অংশগুলোকে সহজ, গোছানো ও পরীক্ষামুখীভাবে শেখার জন্য তৈরি একটি পূর্ণাঙ্গ কোর্স।',
    fullDescription: `বাংলা বস ২.০ হলো বাংলা বিষয়ের গুরুত্বপূর্ণ অংশগুলোকে সহজ, গোছানো ও পরীক্ষামুখীভাবে শেখার জন্য তৈরি একটি পূর্ণাঙ্গ কোর্স। বাংলা বিষয়ে ভালো করতে হলে শুধু মুখস্থ করলেই হয় না—প্রতিটি বিষয় বুঝে সঠিকভাবে প্রয়োগ করার দক্ষতাও প্রয়োজন। এই কোর্সে সেই বিষয়টিকেই গুরুত্ব দেওয়া হয়েছে।

কোর্সটিতে বাংলা ব্যাকরণ, সাহিত্য, গুরুত্বপূর্ণ প্রশ্ন, MCQ এবং পরীক্ষায় প্রয়োজনীয় বিষয়গুলো ধাপে ধাপে আলোচনা করা হবে, যাতে শিক্ষার্থীরা নিজের প্রস্তুতিকে আরও শক্তিশালী করতে পারে।`,
    instructors: {
      main: 'মাহিম',
      co: 'সামিউল সোহরাব',
    },
    highlights: [
      'Instructor - মাহিম • Co-Instructor - সামিউল সোহরাব',
      'বাংলা ব্যাকরণের প্রয়োজনীয় বিষয়গুলো গুছিয়ে শেখানো',
      'সাহিত্যভিত্তিক গুরুত্বপূর্ণ তথ্য ও প্রশ্নের আলোচনা',
      'Academic ও Admission Exam-কেন্দ্রিক পূর্ণাঙ্গ প্রস্তুতি',
    ],
    courseFeatures: [
      'বাংলা বিষয়ের গুরুত্বপূর্ণ টপিকগুলোর বিস্তারিত আলোচনা',
      'সহজ ভাষায় Concept ও বিষয়ভিত্তিক ব্যাখ্যা',
      'গুরুত্বপূর্ণ MCQ ও প্রশ্নের অনুশীলন',
      'Academic ও Admission Exam-কেন্দ্রিক প্রস্তুতি',
      'বাংলা ব্যাকরণের প্রয়োজনীয় বিষয়গুলো গুছিয়ে শেখানো',
      'সাহিত্যভিত্তিক গুরুত্বপূর্ণ তথ্য ও প্রশ্নের আলোচনা',
      'গুরুত্বপূর্ণ ও বারবার আসা প্রশ্নের বিশ্লেষণ',
      'ভুল হওয়ার সম্ভাবনাময় জায়গাগুলো আলাদাভাবে চিহ্নিত করা',
      'নিয়মিত Revision ও Practice',
      'পরীক্ষার আগে প্রস্তুতি ঝালিয়ে নেওয়ার জন্য প্রয়োজনীয় দিকনির্দেশনা',
    ],
    whyThisCourse: {
      title: 'কেন বাংলা বস ২.০?',
      text: 'বাংলা বিষয়ে ভালো নম্বর পেতে হলে কী পড়তে হবে, কীভাবে পড়তে হবে এবং কোন বিষয়গুলো বেশি গুরুত্বপূর্ণ—এই তিনটি বিষয় পরিষ্কার থাকা জরুরি। বাংলা বস ২.০-তে সেই প্রস্তুতিটাই আরও সহজ ও গোছানোভাবে নেওয়ার চেষ্টা করা হয়েছে।',
      tagline: 'বাংলা শিখুন বুঝে, প্রস্তুতি নিন পরিকল্পনা করে, আর পরীক্ষায় নিজের সেরাটা দিন। ✍️📖',
    },
    status: 'active',
    isFeatured: true,
    showOnMainPage: true, // Only this & Mentorship & Octal 1.0 on main page
    actionText: 'বিস্তারিত দেখুন',
    actionUrl: '/classroom/courses/bangla-boss-2-course',
    externalBuyUrl: 'https://samnadacademy.com/courses/bangla-boss-2-course/',
    imageUrl: 'https://samnadacademy.com/wp-content/uploads/2026/09/bangla-boss-course-mahim.png',
  },

  // 4. Admission Top Priority (Only shown on /classroom/courses catalog, hidden from main page)
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
    isFeatured: false,
    showOnMainPage: false, // Hidden from main /classroom page as requested
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
    isFeatured: false,
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
    isFeatured: false,
    showOnMainPage: false,
  },

  // 5. HSC Other Courses
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
    status: 'upcoming',
    isFeatured: false,
    showOnMainPage: false, // Hidden from main /classroom page
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

  // 6. SSC Courses
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
    isFeatured: false,
    showOnMainPage: false, // Hidden from main /classroom page
  },

  // 7. Junior & Skills
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
