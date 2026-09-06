import { BlogPost, CertificationItem, EducationItem, ExperienceItem, SiteSettings, SkillItem, UserAccount } from '../types';

export const DEFAULT_SETTINGS: SiteSettings = {
  siteName: 'Mahim',
  tagline: 'গ্রাফিক ডিজাইনার ও ভিজ্যুয়াল স্টোরিটেলার',
  domain: 'mahims.com',
  primaryLang: 'bn',

  heroTitle: 'Mahim Ibne Khudi',
  heroSubtitle: 'Professional Graphic Designer & Brand Specialist',
  heroBio: 'হ্যালো! আমি মাহিম ইবনে খুদি। ক্রিয়েটিভ ডিজাইন ও ভিজ্যুয়াল ব্র্যান্ডিং এর মাধ্যমে যেকোনো আইডিয়াকে আকর্ষণীয় রূপে ফুটিয়ে তুলতে ভালোবাসি। ক্লায়েন্টের লক্ষ্য অনুযায়ী অর্থপূর্ণ ও প্রিমিয়াম ডিজাইন তৈরি করাই আমার প্রধান উদ্দেশ্য।',
  heroImage: 'https://res.cloudinary.com/drvyjj7td/image/upload/v1788629825/MAHIMIBNEKHUDI_wafylv.png',
  heroImageAlt: 'Mahim Ibne Khudi - গ্রাফিক ডিজাইনার',
  resumeDownloadUrl: '#',

  phone: '',
  email: 'mahimibnekhudi@gmail.com',
  address: '',
  facebookUrl: 'https://facebook.com/mahim2005',
  instagramUrl: 'https://instagram.com/_mahim_official_',
  linkedinUrl: 'https://linkedin.com/in/mahimibnekhudi',
  fiverrUrl: 'https://fiverr.com/mahimibnekhudi',
  behanceUrl: 'https://behance.net/mahimibnekhudi',
  whatsappNumber: 'wa.me/@mahim.wp',
  whatsappLink: 'https://wa.me/@mahim.wp',
  whatsappMessage: 'হ্যালো মাহিম! mahims.com দেখে যোগাযোগ করছি।',

  aboutHeadline: 'ক্রিয়েটিভিটি ও পারফেকশনের সমন্বয়ে ভিজ্যুয়াল সলিউশন',
  aboutStory: [
    'আমি একজন ডেডিকেটেড গ্রাফিক ডিজাইনার, যিনি আধুনিক ভিজ্যুয়াল ডিজাইন এবং সোশ্যাল মিডিয়া কনটেন্ট তৈরিতে পারদর্শী। ক্লায়েন্টের ব্র্যান্ডিং যেন দর্শকদের হৃদয়ে দীর্ঘস্থায়ী প্রভাব ফেলে, সেই লক্ষ্যে আমি নিখুঁত মনোযোগ দিয়ে প্রতিটি প্রজেক্ট সম্পন্ন করি।',
    'ডিজাইনের পাশাপাশি আমি ডিজিটাল মার্কেটিং এবং সোশ্যাল মিডিয়া স্ট্র্যাটেজি নিয়ে কাজ করি, যাতে ডিজাইন কেবল সুন্দরই না হয়, বরং তা কাঙ্ক্ষিত ফলাফল এনে দিতে সক্ষম হয়।'
  ],
  nativeLanguage: 'বাংলা (মাতৃভাষা - ফুল প্রফিশিয়েন্সি)',
  foreignLanguage: 'ইংরেজি (লিখিত ও মৌখিক দক্ষতা)',
  interests: ['গ্রাফিক ডিজাইন', 'ব্র্যান্ডিং ও আইডেন্টিটি', 'সোশ্যাল মিডিয়া মার্কেটিং', 'ফটোগ্রাফি', 'নতুন কিছু শেখা ও এক্সপ্লোরেশন'],

  seoTitle: 'Mahim | Graphic Designer & Creative Professional - mahims.com',
  seoDescription: 'Mahim Ibne Khudi (মাহিম) - প্রফেশনাল গ্রাফিক ডিজাইনার, সোশ্যাল মিডিয়া স্পেশালিস্ট ও ক্রিয়েটিভ ভিজ্যুয়ালাইজার। সোশ্যাল মিডিয়া ডিজাইন, ব্র্যান্ড আইডেন্টিটি এবং প্রিন্ট ডিজাইন সার্ভিস।',
  seoKeywords: [
    'Mahim',
    'মাহিম',
    'Mahims',
    'মাহিমস',
    'মাহিম\'স',
    'মাহিম ইবনে খুদি',
    'Mahim Ibne Khudi',
    'Mahim Ibn Khudi',
    'Ibn Khudi',
    'Ibne Khudi',
    'Asrare Khudi',
    'Mahim Ibne Asrare Khudi',
    'Graphic Designer Bangladesh',
    'Remote Graphic Designer',
    'Social Media Graphic Designer',
    'mahims.com'
  ],
  googleSiteVerification: '',

  googleSheetWebhookUrl: '',
  googleSheetSyncEnabled: false,

  // Salted SHA-256 hash for @@MahimsdotcomAdmin11223300@@
  adminPasswordHash: 'be951e8f135a532900f865df5a83a20fe8bb5facf8cc4894c995d35c582bb11b',
};

export const DEFAULT_EXPERIENCES: ExperienceItem[] = [
  {
    id: 'exp-1',
    company: 'আলোকিত গাইবান্ধা (ALOKITO GAIBANDHA)',
    role: 'সোশ্যাল মিডিয়া ম্যানেজার ও গ্রাফিক ডিজাইনার',
    period: '২০২৫ – বর্তমান',
    description: 'সোশ্যাল মিডিয়া প্ল্যাটফর্ম ম্যানেজমেন্ট, আকর্ষণীয় প্রমোশনাল ডিজাইন ও পোস্টার তৈরি এবং অ্যাডোবি ফটোশপ ও ইলাস্ট্রেটরের মাধ্যমে নিয়মিত ব্র্যান্ডের উপস্থিতি নিশ্চিতকরণ।',
    skillsUsed: ['Adobe Photoshop', 'Adobe Illustrator', 'Brand Identity', 'Social Media Marketing'],
    isCurrent: true,
  },
  {
    id: 'exp-2',
    company: 'ফাইভার (FIVERR)',
    role: 'ফ্রিল্যান্স গ্রাফিক ডিজাইনার',
    period: 'এপ্রিল ২০২৬ – বর্তমান',
    description: 'আন্তর্জাতিক ক্লায়েন্টদের জন্য প্রিমিয়াম কোয়ালিটি সোশ্যাল মিডিয়া গ্রাফিক্স, লোগো ও ব্র্যান্ডিং ম্যাটেরিয়ালস সফলতার সাথে তৈরি ও ডেলিভারি প্রদান।',
    skillsUsed: ['Photoshop', 'Illustrator', 'Client Communication', 'Vector Design'],
    isCurrent: true,
  },
  {
    id: 'exp-3',
    company: 'চলমান চিত্র (CHALAMAN CHITRA)',
    role: 'গ্রাফিক ডিজাইনার',
    period: '২০২৪ – ২০২৫',
    description: 'সংবাদপত্র ও প্রকাশনার জন্য প্রয়োজনীয় গ্রাফিক্স ও লেআউট ডিজাইন সফলতার সাথে প্রস্তুতকরণ।',
    skillsUsed: ['Photoshop', 'Illustrator', 'Print Layout', 'Editorial Design'],
    isCurrent: false,
  },
  {
    id: 'exp-4',
    company: 'ময়না ব্রিকস (MOYNA BRICKS)',
    role: 'অ্যাকাউন্টস ও অফিস অপারেশনস অ্যাসিস্ট্যান্ট',
    period: '২০২২ – ২০২৪',
    description: 'প্রতিষ্ঠানের দৈনিক আর্থিক হিসাব সংরক্ষণ, অফিসিয়াল ডকুমেন্টস তৈরি এবং মাইক্রোসফট এক্সেল ও ওয়ার্ডের মাধ্যমে সার্বিক রিপোর্টিং সম্পন্ন করা।',
    skillsUsed: ['Microsoft Excel', 'Microsoft Word', 'Office Operations', 'Documentation'],
    isCurrent: false,
  },
  {
    id: 'exp-5',
    company: 'অ্যাডিশনাল এক্সপেরিয়েন্স',
    role: 'ডিজিটাল মার্কেটিং ও সোশ্যাল মিডিয়া প্রমোশন',
    period: 'বিভিন্ন সময়ে',
    description: 'স্থানীয় পর্যায়ে ডিজিটাল মার্কেটিং প্রজেক্ট পরিচালনা ও ব্র্যান্ডের ভিজিবিলিটি বৃদ্ধিতে কার্যকরী সোশ্যাল মিডিয়া ক্যাম্পেইন সমন্বয়।',
    skillsUsed: ['Digital Marketing', 'Campaign Strategy', 'Audience Targeting'],
    isCurrent: false,
  },
];

export const DEFAULT_EDUCATION: EducationItem[] = [
  {
    id: 'edu-1',
    degree: 'স্নাতক (অনার্স)',
    institution: 'ঢাকা সেন্ট্রাল ইউনিভার্সিটি',
    department: 'ডিপার্টমেন্ট অফ পলিটিক্যাল সাইন্স',
    period: 'মার্চ ২০২৬ – বর্তমান (প্রত্যাশিত গ্র্যাজুয়েশন: ২০৩০)',
    result: 'অধ্যয়নরত',
    details: 'রাষ্ট্রবিজ্ঞান বিভাগের অধীনে স্নাতক পর্যায়ে নিয়মিত অধ্যয়নরত।',
  },
  {
    id: 'edu-2',
    degree: 'উচ্চ মাধ্যমিক সার্টিফিকেট (HSC)',
    institution: 'গাইবান্ধা সরকারি কলেজ, গাইবান্ধা',
    department: 'মানবিক বিভাগ',
    board: 'দিনাজপুর বোর্ড',
    period: '২০২৪',
    result: 'GPA: 5.00 / 5.00',
    details: 'কৃতিত্বের সাথে সর্বোচ্চ জিপিএ ৫.০০ প্রাপ্তি।',
  },
  {
    id: 'edu-3',
    degree: 'মাধ্যমিক স্কুল সার্টিফিকেট (SSC)',
    institution: 'আহাম্মদ উদ্দিন শাহ শিশু নিকেতন স্কুল ও কলেজ, গাইবান্ধা',
    board: 'দিনাজপুর বোর্ড',
    period: '২০২২',
    result: 'GPA: 5.00 / 5.00',
    details: 'কৃতিত্বের সাথে সর্বোচ্চ জিপিএ ৫.০০ প্রাপ্তি।',
  },
];

export const DEFAULT_SKILLS: SkillItem[] = [
  { id: 'sk-1', name: 'Adobe Photoshop', category: 'design', proficiency: 95, highlight: true },
  { id: 'sk-2', name: 'Adobe Illustrator', category: 'design', proficiency: 92, highlight: true },
  { id: 'sk-3', name: 'Canva Pro', category: 'tools', proficiency: 90, highlight: true },
  { id: 'sk-4', name: 'Microsoft Office (Word, Excel)', category: 'tools', proficiency: 85 },
  { id: 'sk-5', name: 'Social Media Graphic Design', category: 'design', proficiency: 94, highlight: true },
  { id: 'sk-6', name: 'Brand Identity & Logo Design', category: 'design', proficiency: 88 },
  { id: 'sk-7', name: 'Digital Marketing & Strategy', category: 'marketing', proficiency: 82 },
  { id: 'sk-8', name: 'Print & Publication Design', category: 'design', proficiency: 86 },
  { id: 'sk-9', name: 'কাস্টম মাইনক্রাফট স্কিন ডিজাইন', category: 'design', proficiency: 96, highlight: true },
  { id: 'sk-10', name: 'n8n অটোমেশন এক্সপার্ট', category: 'tools', proficiency: 90, highlight: true },
];

export const DEFAULT_CERTIFICATIONS: CertificationItem[] = [
  {
    id: 'cert-1',
    title: 'Graphic Design | Level 3',
    issuer: 'জাতীয় দক্ষতা উন্নয়ন কর্তৃপক্ষ (NSDA) - বাংলাদেশ সরকার',
    year: '২০২৪',
  },
  {
    id: 'cert-2',
    title: 'Graphic Design & Digital Marketing',
    issuer: 'ই-লার্নিং অ্যান্ড আর্নিং লিমিটেড (E-Learning & Earning Ltd.)',
    year: '২০২৩',
  },
  {
    id: 'cert-3',
    title: 'Computer Operation | Level 1',
    issuer: 'জাতীয় দক্ষতা উন্নয়ন কর্তৃপক্ষ (NSDA) - বাংলাদেশ সরকার',
    year: '২০২২',
  },
];

export const DEFAULT_BLOG_POSTS: BlogPost[] = [
  {
    id: 'post-1',
    slug: 'modern-brand-identity-design-trends-2026',
    title: '২০২৬ সালে ব্র্যান্ড আইডেন্টিটি ডিজাইনের আধুনিক ট্রেন্ড ও ফ্রিল্যান্সিং গাইড',
    excerpt: 'কীভাবে একটি ব্র্যান্ডের ভিজ্যুয়াল আইডেন্টিটি শক্তিশালী করতে হয় এবং ২০২৬ সালের নতুন ডিজাইন এলিমেন্টগুলো সফলভাবে কাজে লাগাবেন—তার বিস্তারিত আলোচনা।',
    content: `ব্র্যান্ড আইডেন্টিটি হলো একটি কোম্পানির আত্মা। ২০২৬ সালে কেবল একটি সাধারণ লোগো বানালেই চলে না, পুরো ভিজ্যুয়াল সিস্টেমটিকে প্রাণবন্ত এবং ডিজিটাল-ফার্স্ট করতে হয়।

### ১. মিনিমালিজম ও বোল্ড টাইপোগ্রাফি
বর্তমানে অতিরিক্ত জটিল ডিজাইনের বদলে পরিষ্কার, শক্তিশালী টাইপোগ্রাফি ও ভারসাম্যপূর্ণ নেগেটিভ স্পেস সবচেয়ে বেশি প্রাধান্য পাচ্ছে।

### ২. কালার সাইকোলজি ও সোশ্যাল মিডিয়া প্রেজেন্স
সোশ্যাল মিডিয়া স্ক্রলিংয়ের যুগে ১-২ সেকেন্ডে অডিয়েন্সের দৃষ্টি আকর্ষণ করাই আসল চ্যালেঞ্জ। কালার কনট্রাস্ট এবং ব্রাইট কালার অ্যাকসেন্ট ব্র্যান্ডকে আলাদা মর্যাদা দেয়।

### ৩. কনসিস্টেন্সি বজায় রাখা
ফটোশপ এবং ইলাস্ট্রেটর দিয়ে যখন কোনো কোম্পানির জন্য সোশ্যাল মিডিয়া টেমপ্লেট তৈরি করবেন, তখন ফন্ট, কালার প্যালেট ও মার্জিন সব সময় একই রকম রাখুন।`,
    coverImage: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=1200&q=80',
    altText: 'Graphic design workstation with creative typography and colors',
    category: 'ডিজাইন টিপস',
    visibility: 'public',
    author: 'Mahim Ibne Khudi',
    date: '২০২৬-০৫-১৫',
    readTime: '৪ মিনিট',
    views: 420,
  },
  {
    id: 'post-2',
    slug: 'social-media-campaign-strategy-for-clients',
    title: 'ক্লায়েন্টদের জন্য সোশ্যাল মিডিয়া ক্যাম্পেইন ও ভিজ্যুয়াল গ্রাফিক্স স্ট্র্যাটেজি',
    excerpt: 'ফেসবুক ও ইনস্টাগ্রাম ক্যাম্পেইনে সর্বোচ্চ এনগেজমেন্ট পেতে কী ধরনের ডিজাইন ফরম্যাট ও রেশিও ব্যবহার করবেন তার কার্যকর স্ট্র্যাটেজি।',
    content: `সোশ্যাল মিডিয়া ক্যাম্পেইনের সাফল্য নির্ভর করে ডিজাইনের আকর্ষণীয় উপস্থাপন ও সঠিক বার্তা পৌঁছানোর ওপর।

### মেম্বার এক্সক্লুসিভ গাইড:
- **হাই-কনভার্টিং ক্যারাউসেল ডিজাইন:** একাধিক স্লাইডে গল্প বলা ও ক্লিয়ার কল-টু-অ্যাকশন (CTA) রাখা।
- **পোস্টার লেআউট ফর্মুলা:** ৮০% ভিজ্যুয়াল + ২০% সংক্ষিপ্ত স্পষ্ট লেখা।
- **রেজোলিউশন ও ফরম্যাটিং:** ১০৮০x১৩৫০ (৪:৫ রেশিও) ইনস্টাগ্রাম ও ফেসবুক ফিডের জন্য সবচেয়ে বেশি স্ক্রিন স্পেস দখল করে।

*নোট: নিয়মিত ডিজাইনের সাথে ফেসবুক অ্যাড ব্যানার সাইজিং সঠিক রাখা অত্যন্ত জরুরি।*`,
    coverImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
    altText: 'Abstract vibrant 3D modern design graphic',
    category: 'সোশ্যাল মিডিয়া',
    visibility: 'members',
    author: 'Mahim Ibne Khudi',
    date: '২০২৬-০৫-২০',
    readTime: '৫ মিনিট',
    views: 295,
  },
  {
    id: 'post-3',
    slug: 'vip-premium-design-assets-psd-mockups',
    title: 'প্রিমিয়াম ডিজাইন রিসোর্স, পিএসডি মকআপ ও ভিআইপি প্র্যাকটিস গাইড',
    excerpt: 'শুধুমাত্র অনুমোদিত ভিআইপি মেম্বারদের জন্য কিউরেট করা হাই-রেজোলিউশন মকআপ, প্র্যাকটিস প্রজেক্ট ফাইল এবং এক্সক্লুসিভ ডিজাইন সিক্রেটস।',
    content: `অভিনন্দন! আপনি মাহিমের সাইটের অনুমোদিত ভিআইপি মেম্বার হিসেবে এই স্পেশাল রিসোর্সগুলো দেখতে পাচ্ছেন।

### ভিআইপি রিসোর্স তালিকা:
১. **ফ্রি কমার্শিয়াল ফন্ট কালেকশন:** ব্র্যান্ডিং এবং লোগোর জন্য ১০০+ প্রিমিয়াম ফন্ট লিংক।
২. **সোশ্যাল মিডিয়া পিএসডি টেমপ্লেট:** রেডিমেড লেয়ার্ড ফাইল যেখানে সহজেই টেক্সট ও প্রোডাক্ট রিপ্লেস করা যায়।
৩. **ক্লায়েন্ট পিচ ডেক ফর্মুলা:** কীভাবে বিদেশি ক্লায়েন্টদের সাথে ফাইভারে কথা বলে অর্ডার কনফার্ম করবেন।

কোনো প্রশ্ন থাকলে নিচের হোয়াটসঅ্যাপ বাটনে ক্লিক করে সরাসরি আমাকে জানাতে পারেন!`,
    coverImage: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80',
    altText: 'Creative 3D tech and design elements setup',
    category: 'ভিআইপি স্পেশাল',
    visibility: 'vip',
    author: 'Mahim Ibne Khudi',
    date: '২০২৬-০৫-২৫',
    readTime: '৬ মিনিট',
    views: 180,
  },
];

export const DEFAULT_USERS: UserAccount[] = [
  {
    id: 'usr-1',
    name: 'তন্ময় হাসান',
    email: 'tanmoy.designer@example.com',
    role: 'vip',
    status: 'approved',
    joinedDate: '২০২৬-০৫-১০',
    occupation: 'গ্রাফিক ডিজাইনার',
  },
  {
    id: 'usr-2',
    name: 'সাবরিনা রহমান',
    email: 'sabrina.r@example.com',
    role: 'user',
    status: 'approved',
    joinedDate: '২০২৬-০৫-১২',
    occupation: 'কন্টেন্ট ক্রিয়েটর',
  },
  {
    id: 'usr-3',
    name: 'রাকিবুল ইসলাম',
    email: 'rakib.student@example.com',
    role: 'user',
    status: 'pending',
    joinedDate: '২০২৬-০৫-২৪',
    occupation: 'শিক্ষার্থী',
  },
];
