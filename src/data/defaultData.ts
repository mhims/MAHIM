import { BlogPost, CertificationItem, EducationItem, ExperienceItem, SiteSettings, SkillItem, UserAccount } from '../types';
import { USER_BLOG_POSTS } from './userBlogPosts';

export const DEFAULT_SETTINGS: SiteSettings = {
  siteName: "Mahim's World",
  tagline: 'শিক্ষা, প্রযুক্তি, দর্শন ও সৃষ্টিশীল ডিজিটাল অঙ্গন',
  domain: 'mahims.com',
  primaryLang: 'bn',
  logoUrl: 'https://res.cloudinary.com/drvyjj7td/image/upload/v1789236304/mahims.com-Logo_ezjh1b.png',

  heroTitle: 'Mahim Ibne Khudi',
  heroSubtitle: "Mahim's World — Thoughts, Academy & Creative Ecosystem",
  heroBio: 'স্বাগতম মাহিম ইবনে খুদি এর অফিসিয়াল ডিজিটাল ইকোসিস্টেমে। শিক্ষা, প্রযুক্তি, মুক্ত দর্শন ও সৃষ্টিশীল নানা প্রজেক্টের এক উন্মুক্ত সংগ্রহশালা।',
  heroImage: 'https://res.cloudinary.com/drvyjj7td/image/upload/v1788629825/MAHIMIBNEKHUDI_wafylv.png',
  heroImageAlt: 'Mahim Ibne Khudi - মাহিম ইবনে খুদি',
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
  whatsappAvatarUrl: 'https://res.cloudinary.com/drvyjj7td/image/upload/v1788708908/behance_pp_spfumh.jpg',

  aboutHeadline: 'শিক্ষা, প্রযুক্তি ও মুক্ত দর্শনের মেলবন্ধন',
  aboutStory: [
    'আমি মাহিম ইবনে খুদি। এটি আমার কাজের, দর্শনের এবং ভাবনার এক সমন্বিত ডিজিটাল মহাবিশ্ব। এখানে একাডেমিক পাঠদান, সৃজনশীল ডিজাইন, অটোমেশন ও ব্যক্তিগত স্মৃতির পাতা—সবকিছু এক ছাদের নিচে সংরক্ষিত।',
    'জীবনের প্রতিটি অভিজ্ঞতাকে নতুন সম্ভাবনায় রূপান্তর করা এবং জ্ঞানের আলো ছড়িয়ে দেওয়াই আমার কাজের মূল প্রেরণা।'
  ],
  nativeLanguage: 'বাংলা (মাতৃভাষা - ফুল প্রফিশিয়েন্সি)',
  foreignLanguage: 'ইংরেজি (লিখিত ও মৌখিক দক্ষতা)',
  interests: ['শিক্ষকতা ও একাডেমি', 'প্রযুক্তি ও অটোমেশন', 'গ্রাফিক ডিজাইন ও ব্র্যান্ডিং', 'দর্শন ও সাহিত্য', 'স্মৃতিচারণ ও ফটোগ্রাফি'],

  seoTitle: "Mahim's World | মাহিম ইবনে খুদি — ডিজিটাল ইকোসিস্টেম (mahims.com)",
  seoDescription: "Mahim's World (মাহিম'স ওয়ার্ল্ড) - মাহিম ইবনে খুদি এর অফিসিয়াল ডিজিটাল ইকোসিস্টেম। শিক্ষা ও একাডেমি (Mahim's Classroom), প্রযুক্তি, মুক্ত দর্শন, সৃষ্টিশীল প্রজেক্ট ও জীবনের নানা গল্পের উন্মুক্ত প্ল্যাটফর্ম।",
  seoKeywords: [
    'মাহিম ওয়ার্ল্ড',
    'Mahims World',
    'Mahim World',
    'মাহিমস ওয়ার্ল্ড',
    'মাহিম গাইবান্ধা',
    'Mahim Gaibandha',
    'Mahim',
    'মাহিম',
    "Mahim's World",
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
    "Mahim's Classroom",
    'মাহিম ক্লাসরুম',
    'Gaibandha',
    'গাইবান্ধা',
    'mahims.com'
  ],
  googleSiteVerification: 't4ejgDcENe8vJ4Q97NJwtR6odLfYib__3hEpQhVwuIQ',

  googleSheetWebhookUrl: 'https://script.google.com/macros/s/AKfycbyae4Q9cU8n1KRnHlbLgP-tUh4vaGRZRx12NBzNxeWPMSoYJk8HXKsUJ2A00CBKB1qssQ/exec',
  googleSheetSyncEnabled: true,

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
    department: 'বিজ্ঞান বিভাগ',
    board: 'দিনাজপুর বোর্ড',
    period: '২০২৪',
    result: 'GPA: 5.00 / 5.00',
    details: 'কৃতিত্বের সাথে বিজ্ঞান বিভাগে সর্বোচ্চ জিপিএ ৫.০০ প্রাপ্তি।',
  },
  {
    id: 'edu-3',
    degree: 'মাধ্যমিক স্কুল সার্টিফিকেট (SSC)',
    institution: 'আহাম্মদ উদ্দিন শাহ শিশু নিকেতন স্কুল ও কলেজ, গাইবান্ধা',
    department: 'বিজ্ঞান বিভাগ',
    board: 'দিনাজপুর বোর্ড',
    period: '২০২২',
    result: 'GPA: 5.00 / 5.00',
    details: 'কৃতিত্বের সাথে বিজ্ঞান বিভাগে সর্বোচ্চ জিপিএ ৫.০০ প্রাপ্তি।',
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

export const DEFAULT_BLOG_POSTS: BlogPost[] = USER_BLOG_POSTS;

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
