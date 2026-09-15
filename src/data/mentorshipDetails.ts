export interface MentorCourseInfo {
  id: string;
  slug: string;
  mentorName: string;
  mentorNameBn: string;
  institution: string;
  institutionBn: string;
  degree: string;
  degreeBn: string;
  image: string;
  badge: string;
  externalCanonicalUrl: string; // The samnadacademy or combo canonical URL for SEO ranking
  isCombo?: boolean;
  metaTitle: string;
  metaDescription: string;
}

export const MENTORSHIP_COURSE_COMMON_DETAILS = `ভর্তি পরীক্ষা, একাডেমিক প্রস্তুতি কিংবা নিজের কাঙ্ক্ষিত বিশ্ববিদ্যালয়ে জায়গা করে নেওয়ার পথে শুধু পড়াশোনা করলেই যথেষ্ট নয়—প্রয়োজন সঠিক পরিকল্পনা, নিয়মিত গাইডলাইন এবং অভিজ্ঞ মেন্টরের দিকনির্দেশনা।

এই Mentorship Course এমন শিক্ষার্থীদের জন্য তৈরি, যারা নিজেদের প্রস্তুতিকে আরও গোছানো, কার্যকর এবং লক্ষ্যভিত্তিক করতে চায়। SamNad Academy ও Mahim’s Classroom-এর সমন্বয়ে এই কোর্সে শিক্ষার্থীরা তাদের প্রস্তুতির পুরো journey-তে প্রয়োজনীয় গাইডলাইন ও মেন্টরশীপ পাবে।

এই কোর্সে যা থাকছে

১. সঠিক প্রস্তুতির দিকনির্দেশনা
কীভাবে শুরু করবেন, কোন বিষয়কে কতটা গুরুত্ব দেবেন এবং কীভাবে সময়কে কাজে লাগাবেন—এসব বিষয়ে পরিষ্কার গাইডলাইন।

২. Personalized Mentorship
আপনার প্রস্তুতি, সমস্যা ও প্রয়োজন অনুযায়ী মেন্টরের কাছ থেকে প্রয়োজনীয় পরামর্শ ও দিকনির্দেশনা।

৩. Study Plan & Strategy
পরীক্ষার প্রস্তুতিকে আরও কার্যকর করতে বাস্তবসম্মত স্টাডি প্ল্যান, রুটিন ও প্রস্তুতির কৌশল।

৪. Regular Guidance & Support
প্রস্তুতির বিভিন্ন পর্যায়ে প্রয়োজনীয় পরামর্শ, সমস্যা সমাধান এবং সঠিক পথে থাকার জন্য নিয়মিত সাপোর্ট।

৫. Question & Discussion Support
পড়াশোনা ও প্রস্তুতি নিয়ে গুরুত্বপূর্ণ প্রশ্ন বা সমস্যাগুলো নিয়ে মেন্টরের সঙ্গে আলোচনা করার সুযোগ।

৬. Exam & Admission Guidance
ভর্তি পরীক্ষা ও একাডেমিক প্রস্তুতির ক্ষেত্রে কীভাবে স্মার্টভাবে এগোতে হবে, সে বিষয়ে প্রয়োজনীয় গাইডলাইন ও কৌশল।

কার জন্য এই কোর্স?

যেসব শিক্ষার্থী
নিজের প্রস্তুতিকে আরও গোছাতে চায়,
সময় ও পড়াশোনাকে সঠিকভাবে ম্যানেজ করতে চায়,
বারবার একই ভুল না করে সঠিক গাইডলাইনে এগোতে চায়,
এবং নিজের কাঙ্ক্ষিত লক্ষ্য অর্জনের জন্য একজন মেন্টরের সহযোগিতা চায়—এই কোর্সটি তাদের জন্য।

আমাদের উদ্দেশ্য

শুধু পড়ার পরামর্শ দেওয়া নয়; বরং একজন শিক্ষার্থীকে সঠিক পরিকল্পনা তৈরি করা, নিজের দুর্বলতা বুঝে কাজ করা এবং লক্ষ্য অনুযায়ী ধারাবাহিকভাবে এগিয়ে যেতে সাহায্য করা।

SamNad Academy × Mahim’s Classroom
Learn with Direction. Prepare with Confidence. Achieve Your Goal.`;

// The 4 Individual Mentor Courses with exact SEO canonical URLs
export const INDIVIDUAL_MENTOR_COURSES: MentorCourseInfo[] = [
  {
    id: 'mentorship-suja',
    slug: 'abu-saleh-suza',
    mentorName: 'Abu Saleh Suza',
    mentorNameBn: 'আবু সালেহ সুজা',
    institution: 'MBSTU',
    institutionBn: 'মওলানা ভাসানী বিজ্ঞান ও প্রযুক্তি বিশ্ববিদ্যালয় (MBSTU)',
    degree: 'Pharmacy',
    degreeBn: 'ফার্মেসি বিভাগ',
    image: 'https://res.cloudinary.com/drvyjj7td/image/upload/v1789388189/suzamentor_fqbj8e.jpg',
    badge: 'Pharmac, MBSTU',
    externalCanonicalUrl: 'https://samnadacademy.com/courses/mentorship/abu-saleh-suza/',
    metaTitle: 'Abu Saleh Suza — Mentorship Course | SamNad Academy × Mahim’s Classroom',
    metaDescription: 'আবু সালেহ সুজা (Pharmacy, MBSTU) এর ওয়ান-টু-ওয়ান মেন্টরশীপ কোর্স। বিশ্ববিদ্যালয় ভর্তি পরীক্ষা ও একাডেমিক প্রস্তুতির পূর্ণাঙ্গ দিকনির্দেশনা ও গাইডলাইন।',
  },
  {
    id: 'mentorship-samiul',
    slug: 'samiul-islam-sohorab',
    mentorName: 'Samiul Islam Sohorab',
    mentorNameBn: 'সামিউল ইসলাম সোহরাব',
    institution: 'Daffodil International University (DIU)',
    institutionBn: 'ড্যাফোডিল ইন্টারন্যাশনাল ইউনিভার্সিটি (DIU)',
    degree: 'Software Engineering',
    degreeBn: 'সফটওয়্যার ইঞ্জিনিয়ারিং',
    image: 'https://res.cloudinary.com/drvyjj7td/image/upload/v1789388172/samiulmentor_ntpjge.jpg',
    badge: 'Daffodil International University (DIU)',
    externalCanonicalUrl: 'https://samnadacademy.com/courses/mentorship/samiul-islam-sohorab/',
    metaTitle: 'Samiul Islam Sohorab — Mentorship Course | SamNad Academy × Mahim’s Classroom',
    metaDescription: 'সামিউল ইসলাম সোহরাব (SWE, DIU) এর পার্সোনালাইজড মেন্টরশীপ কোর্স। একাডেমিক প্রস্তুতি, স্টাডি প্ল্যান ও এডমিশন হ্যাকস।',
  },
  {
    id: 'mentorship-mithen',
    slug: 'mishkat-sharif-mithen',
    mentorName: 'Mishkat Sharif Mithen',
    mentorNameBn: 'মিশকাত শরীফ মিথেন',
    institution: 'Begum Rokeya University (BRUR)',
    institutionBn: 'বেগম রোকেয়া বিশ্ববিদ্যালয় (BRUR)',
    degree: 'Founder, Mithen Private Home',
    degreeBn: 'ফাউন্ডারঃ মিথেন প্রাইভেট হোম',
    image: 'https://res.cloudinary.com/drvyjj7td/image/upload/v1789388182/mithenmentor_atwyjb.png',
    badge: 'Begum Rokeya University (BRUR)',
    externalCanonicalUrl: 'https://samnadacademy.com/courses/mentorship/mishkat-sharif-mithen/',
    metaTitle: 'Mishkat Sharif Mithen — Mentorship Course | SamNad Academy × Mahim’s Classroom',
    metaDescription: 'মিশকাত শরীফ মিথেন (BRUR, Founder Mithen Private Home) এর মেন্টরশীপ কোর্স। ভর্তি পরীক্ষা ও বোর্ড পরীক্ষার নিখুঁত স্ট্র্যাটেজি।',
  },
  {
    id: 'mentorship-mahim',
    slug: 'mahim-ibn-khudi',
    mentorName: 'Mahim Ibne Khudi',
    mentorNameBn: 'মাহিম ইবনে খুদি',
    institution: 'Dhaka Central University (DCU)',
    institutionBn: 'ঢাকা সেন্ট্রাল ইউনিভার্সিটি (DCU)',
    degree: 'Founder, Mahims Classroom',
    degreeBn: 'ফাউন্ডার, মাহিমস ক্লাসরুম',
    image: 'https://res.cloudinary.com/drvyjj7td/image/upload/v1789388129/mahimmentor_lqt0tg.png',
    badge: 'Dhaka Central University (DCU)',
    externalCanonicalUrl: 'https://samnadacademy.com/courses/mentorship/mahim-ibn-khudi/',
    metaTitle: 'Mahim Ibne Khudi — Mentorship Course | SamNad Academy × Mahim’s Classroom',
    metaDescription: 'মাহিম ইবনে খুদি (Founder, Mahims Classroom) এর ব্যক্তিগত মেন্টরশীপ কোর্স। আইসিটি, বিজ্ঞান ও বিশ্ববিদ্যালয় ভর্তি পরীক্ষার বিশেষ গাইডলাইন।',
  },
];

// The All-in-One Combo Mentorship Course featuring all mentors
export const COMBO_MENTORSHIP_COURSE: MentorCourseInfo = {
  id: 'mentorship-combo',
  slug: 'mentorship-program-combo',
  mentorName: 'All Mentors Combo Mentorship',
  mentorNameBn: 'অল মেন্টরস কম্বো মেন্টরশীপ কোর্স',
  institution: 'SamNad Academy × Mahim’s Classroom',
  institutionBn: 'স্যামনাদ একাডেমি × মাহিম’স ক্লাসরুম',
  degree: 'Complete Panel Guidance',
  degreeBn: 'সকল অভিজ্ঞ মেন্টরদের সমন্বিত গাইডলাইন প্যানেল',
  image: 'https://res.cloudinary.com/drvyjj7td/image/upload/v1789306292/mentorship_qt39pi.jpg',
  badge: 'Combo Mentorship • সকল মেন্টরদের সমন্বিত গাইডলাইন',
  externalCanonicalUrl: 'https://mahims.com/classroom/courses/mentorship/mentorship-program-combo',
  metaTitle: 'Mentorship Program Combo | SamNad Academy × Mahim’s Classroom',
  metaDescription: 'শীর্ষ বিশ্ববিদ্যালয়ের অভিজ্ঞ ৪ জন মেন্টরের সমন্বিত কম্বো মেন্টরশীপ প্রোগ্রাম। ভর্তি পরীক্ষা ও একাডেমিক প্রস্তুতির সেরা রোডম্যাপ।',
  isCombo: true,
};

export const ALL_MENTOR_COURSES = [COMBO_MENTORSHIP_COURSE, ...INDIVIDUAL_MENTOR_COURSES];

export function findMentorCourseBySlug(slug: string): MentorCourseInfo | undefined {
  const clean = slug.toLowerCase().replace(/^\/+|\/+$/g, '');
  // Map common aliases or direct slugs
  const aliasMap: Record<string, string> = {
    'suja': 'abu-saleh-suza',
    'abu-saleh-suza': 'abu-saleh-suza',
    'samiul': 'samiul-islam-sohorab',
    'samiul-islam-sohorab': 'samiul-islam-sohorab',
    'mithen': 'mishkat-sharif-mithen',
    'mishkat-sharif-mithen': 'mishkat-sharif-mithen',
    'mahim': 'mahim-ibn-khudi',
    'mahim-ibn-khudi': 'mahim-ibn-khudi',
    'combo': 'mentorship-program-combo',
    'mentorship-program-combo': 'mentorship-program-combo',
  };

  const targetSlug = aliasMap[clean] || clean;
  return ALL_MENTOR_COURSES.find((c) => c.slug === targetSlug || c.id === targetSlug);
}
