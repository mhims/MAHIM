import React, { useState, useEffect } from 'react';
import {
  GraduationCap,
  BookOpen,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  Users,
  Target,
  ChevronRight,
  X,
  School,
  Calendar,
  BrainCircuit,
  Zap,
  ArrowLeft,
  Phone,
  User,
  BookMarked,
  Clock,
  Compass,
  FileText,
  Lock,
  ShieldCheck,
} from 'lucide-react';
import { navigateTo } from '../utils/navigation';
import { ClassroomAdminModal } from './ClassroomAdminModal';
import { saveClassroomRegistration } from '../utils/classroomStorage';

interface CourseItem {
  id: string;
  title: string;
  category: 'admission' | 'hsc' | 'ssc' | 'junior' | 'skills';
  categoryLabel: string;
  targetBadge?: string;
  description: string;
  highlights: string[];
  status: 'upcoming' | 'launching_soon' | 'planning';
  isFeatured?: boolean;
}

interface ArticleItem {
  id: string;
  title: string;
  category: string;
  readTime: string;
  date: string;
  summary: string;
  content: string[];
}

const COURSES: CourseItem[] = [
  // 1. Admission Top Priority
  {
    id: 'admission-exam',
    title: 'ভার্সিটি এডমিশন স্মার্ট এক্সাম ব্যাচ',
    category: 'admission',
    categoryLabel: 'এডমিশন এক্সাম সিরিজ',
    description: 'অনলাইন লাইভ কুইজ, নেগেটিভ মার্কিং ট্র্যাকিং, ইনস্ট্যান্ট মেরিট লিস্ট এবং বিগত ২০ বছরের প্রশ্ন এনালাইসিস ভিত্তিক পূর্ণাঙ্গ এক্সাম সিরিজ।',
    highlights: [
      'স্মার্ট অনলাইন এক্সাম প্ল্যাটফর্ম',
      'নেগেটিভ মার্কিং নির্ভুলতা ও টাইম কন্ট্রোল',
      'টপিকভিত্তিক স্পেশাল ডেইলি কুইজ ও উইকলি টেস্ট',
      'ইনস্ট্যান্ট মেরিট লিস্ট ও রিয়েলটাইম সল্যুশন শিট',
    ],
    status: 'launching_soon',
    isFeatured: true,
  },
  {
    id: 'admission-ka',
    title: "ভার্সিটি এডমিশন 'ক' ইউনিট ব্যাচ",
    category: 'admission',
    categoryLabel: 'বিজ্ঞান এডমিশন',
    description: 'পদার্থবিজ্ঞান, রসায়ন, উচ্চতর গণিত এবং জীববিজ্ঞানের কঠিন কনসেপ্টগুলোর সহজ ব্যাখ্যা ও এডমিশন হলে দ্রুত উত্তর করার শর্টকাট টেকনিক।',
    highlights: [
      'কনসেপ্ট ক্ল্যারিটি + টাইম-সেভিং শর্টকাট',
      'অধ্যায়ভিত্তিক এডমিশন হ্যাকস ও টাইপ সলভিং',
      'রিটেন ও এমসিকিউ সমন্বিত গোছানো প্রস্তুতি',
    ],
    status: 'upcoming',
    isFeatured: true,
  },
  {
    id: 'admission-kha',
    title: "ভার্সিটি এডমিশন 'খ' ইউনিট ব্যাচ",
    category: 'admission',
    categoryLabel: 'মানবিক ও বিভাগ পরিবর্তন',
    description: 'বাংলা ব্যাকরণ ও টেক্সটবুক এনালাইসিস, বেসিক থেকে এডভান্সড ইংরেজি গ্রামার ও সাম্প্রতিক-মৌলিক সাধারণ জ্ঞানের সম্পূর্ণ গোছানো প্রস্তুতি।',
    highlights: [
      'ইংরেজি গ্রামার ও ভোকাবুলারি স্পেশাল কেয়ার',
      'বাংলা ১ম ও ২য় পত্রের গভীর প্রশ্ন বিশ্লেষণ',
      'মৌলিক জিকে ও সাম্প্রতিক ঘটনাপ্রবাহ ডাইজেস্ট',
    ],
    status: 'upcoming',
    isFeatured: true,
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
  },

  // 4. Junior & Skills (Placed below as requested)
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
  },
];

const ARTICLES: ArticleItem[] = [
  {
    id: 'admission-strategy',
    title: 'এডমিশন পরীক্ষায় প্রথমবার প্রস্তুতি নেওয়ার সঠিক স্ট্র্যাটেজি ও টাইম ম্যানেজমেন্ট',
    category: 'এডমিশন গাইডলাইন',
    readTime: '৪ মিনিট পাঠ',
    date: 'সেপ্টেম্বর ২০২৬',
    summary: 'এইচএসসির পর কম সময়ে বিপুল সিলেবাস কীভাবে রিভিশন দেবেন এবং নেগেটিভ মার্কিং এড়িয়ে কাঙ্ক্ষিত চান্স নিশ্চিত করবেন।',
    content: [
      'বিশ্ববিদ্যালয় ভর্তি পরীক্ষা কেবল মুখস্থ বিদ্যার লড়াই নয়, এটি মূলত স্নায়ুর লড়াই এবং কৌশলগত অগ্রাধিকার নির্ধারণের খেলা।',
      'প্রথমেই বিগত ২০ বছরের প্রশ্ন বিশ্লেষণ করে চিহ্নিত করুন কোন টপিকগুলো থেকে প্রতিবছর প্রশ্ন আসে। সেই টপিকগুলোর মূল কনসেপ্ট একবারে ক্লিয়ার করে ফেলুন।',
      'প্রতিদিন সময় ধরে অন্তত ১০০টি এমসিকিউ প্র্যাকটিস করুন এবং নেগেটিভ মার্কিং যেন ০.৫ এর বেশি না হয় সেদিকে সতর্ক নজর রাখুন।',
    ],
  },
  {
    id: 'ict-c-programming',
    title: 'এইচএসসি আইসিটি: সি প্রোগ্রামিং ও লজিক গেইটের ভয় দূর করার সহজ টেকনিক',
    category: 'এইচএসসি টিপস',
    readTime: '৩ মিনিট পাঠ',
    date: 'সেপ্টেম্বর ২০২৬',
    summary: 'এইচএসসি আইসিটির ৫ম ও ৩য় অধ্যায় সহজে বোঝার উপায় ও সিকিউতে পূর্ণ নম্বর পাওয়ার স্মার্ট ফর্মুলা।',
    content: [
      'আইসিটি বিষয়ে শিক্ষার্থীদের সবচেয়ে বড় ভীতি থাকে সি প্রোগ্রামিং ও লজিক গেইট নিয়ে। কিন্তু বাস্তবে এগুলো গণিতের চেয়েও বেশি যৌক্তিক।',
      'লুপ (Loop), কন্ডিশন (if-else) এবং অ্যারে (Array) এর ফ্লোচার্ট আগে খাতায় আঁকা শিখুন। ফ্লোচার্ট পরিষ্কার থাকলে কোড লেখা পানির মতো সহজ হয়ে যায়।',
      'ডিজিটাল ডিভাইসে সত্যক সারণী ও বুলিয়ান শতসিদ্ধ মুখস্থ করার চেয়ে কীভাবে গেইটের ইনপুট আউটপুটে রূপান্তর হয় তা লজিক্যালি অনুধাবন করুন।',
    ],
  },
  {
    id: 'exam-hall-strategy',
    title: 'পরীক্ষার হলে কীভাবে সঠিক টাইম ম্যানেজমেন্ট করে সর্বোচ্চ নম্বর নিশ্চিত করবেন?',
    category: 'পরীক্ষার টেকনিক',
    readTime: '৩ মিনিট পাঠ',
    date: 'সেপ্টেম্বর ২০২৬',
    summary: 'সহজ প্রশ্ন বাছাই, জানা প্রশ্নের ভুল এড়ানো এবং শেষ মুহূর্তের রিভিশনের পরীক্ষিত উপায়।',
    content: [
      'পরীক্ষার খাতা পাওয়ার পর প্রথম ৫ মিনিট ঠান্ডা মাথায় পুরো প্রশ্নপত্র চোখ বুলিয়ে নিন। যে প্রশ্নগুলো আপনি ১০০% নিশ্চিত, সেগুলো চিহ্নিত করুন।',
      'কখনই একটি কঠিন প্রশ্নে ৫ মিনিটের বেশি আটকে থাকবেন না। কঠিন প্রশ্নটি চিহ্নিত করে রেখে আগে নিশ্চিত নম্বরগুলো তুলে নিন।',
      'অনলাইন বা অফলাইন মক টেস্ট দেওয়ার সময় নিজের ঘড়ি দেখে পরীক্ষা দেওয়ার অভ্যাস গড়ে তুললে মূল পরীক্ষার হলের ভয় ৯০% দূর হয়ে যায়।',
    ],
  },
];

export const ClassroomPage: React.FC = () => {
  // Navigation active tab for courses
  // Focus priority: Admission & HSC are first
  const [activeCourseTab, setActiveCourseTab] = useState<string>('admission');

  // State for Mahim's Profile Modal
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  // State for Samiul Islam Sohrab's Profile Modal
  const [isSamiulModalOpen, setIsSamiulModalOpen] = useState(false);

  // State for Abu Saleh Suja's Profile Modal
  const [isSujaModalOpen, setIsSujaModalOpen] = useState(false);

  // State for Mishkat Sharif Mithen's Profile Modal
  const [isMithenModalOpen, setIsMithenModalOpen] = useState(false);

  // State for Swocchol Kumar Karmokar's Profile Modal
  const [isSwoccholModalOpen, setIsSwoccholModalOpen] = useState(false);

  // State for Registration Modal
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  // State for Classroom Dedicated Admin Modal
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);

  // State for Article Reading Modal
  const [selectedArticle, setSelectedArticle] = useState<ArticleItem | null>(null);

  // Form states
  const [studentName, setStudentName] = useState('');
  const [studentPhone, setStudentPhone] = useState('');
  const [studentClass, setStudentClass] = useState('ভার্সিটি এডমিশন স্মার্ট এক্সাম ব্যাচ');
  const [studentMessage, setStudentMessage] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Scroll to section
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Setup Dynamic SEO for Google Ranking
  useEffect(() => {
    document.title = "Mahim's Classroom | মাহিম ক্লাসরুম — একাডেমি ও এডমিশন প্ল্যাটফর্ম (Mahims Classroom)";

    const metaTags: Record<string, string> = {
      description:
        "Mahim's Classroom (মাহিম ক্লাসরুম / Mahims Classroom) - এইচএসসি, ভার্সিটি এডমিশন 'ক' ও 'খ' ইউনিট এবং এসএসসি স্মার্ট লার্নিং ও এক্সাম প্ল্যাটফর্ম। প্রতিষ্ঠাতা: মাহিম (ঢাকা সেন্ট্রাল ইউনিভার্সিটি)।",
      keywords:
        "Mahim's Classroom, Mahims Classroom, Mahim Classroom, মাহিম ক্লাসরুম, মাহিমস ক্লাসরুম, mahim classroom, এইচএসসি আইসিটি, এইচএসসি বাংলা, ভার্সিটি এডমিশন ক ইউনিট, ভার্সিটি এডমিশন খ ইউনিট, এডমিশন এক্সাম ব্যাচ, মাহিম ঢাকা সেন্ট্রাল ইউনিভার্সিটি",
      robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
      author: 'Mahim (মাহিম)',
    };

    Object.entries(metaTags).forEach(([name, val]) => {
      let el = document.querySelector(`meta[name="${name}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute('name', name);
        document.head.appendChild(el);
      }
      el.setAttribute('content', val);
    });

    // Open Graph
    const ogTags: Record<string, string> = {
      'og:title': "Mahim's Classroom | মাহিম ক্লাসরুম — একাডেমি ও এডমিশন প্ল্যাটফর্ম",
      'og:description':
        "এইচএসসি, বিশ্ববিদ্যালয় ভর্তি প্রস্তুতি ও এসএসসি শিক্ষার্থীদের জন্য অনলাইন ভিত্তিক কনসেপ্ট ক্লাস এবং স্মার্ট এক্সাম সিস্টেম।",
      'og:url': 'https://mahims.com/classroom',
      'og:site_name': "Mahim's Classroom",
      'og:image': 'https://mahims.com/assets/og-classroom.jpg',
      'og:image:secure_url': 'https://mahims.com/assets/og-classroom.jpg',
      'og:type': 'website',
    };

    Object.entries(ogTags).forEach(([prop, val]) => {
      let el = document.querySelector(`meta[property="${prop}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute('property', prop);
        document.head.appendChild(el);
      }
      el.setAttribute('content', val);
    });

    // Twitter
    const twitterTags: Record<string, string> = {
      'twitter:card': 'summary_large_image',
      'twitter:title': "Mahim's Classroom | মাহিম ক্লাসরুম — একাডেমি ও এডমিশন প্ল্যাটফর্ম",
      'twitter:description':
        "এইচএসসি, বিশ্ববিদ্যালয় ভর্তি প্রস্তুতি ও এসএসসি শিক্ষার্থীদের জন্য অনলাইন ভিত্তিক কনসেপ্ট ক্লাস এবং স্মার্ট এক্সাম সিস্টেম।",
      'twitter:image': 'https://mahims.com/assets/og-classroom.jpg',
      'twitter:url': 'https://mahims.com/classroom',
    };

    Object.entries(twitterTags).forEach(([name, val]) => {
      let el = document.querySelector(`meta[name="${name}"], meta[property="${name}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute('name', name);
        document.head.appendChild(el);
      }
      el.setAttribute('content', val);
    });

    // Link image_src fallback for WhatsApp / legacy scrapers
    let imageSrc = document.querySelector('link[rel="image_src"]') as HTMLLinkElement | null;
    if (!imageSrc) {
      imageSrc = document.createElement('link');
      imageSrc.rel = 'image_src';
      document.head.appendChild(imageSrc);
    }
    imageSrc.href = 'https://mahims.com/assets/og-classroom.jpg';

    // Keyboard shortcut to open Classroom Admin: Ctrl+Shift+A or Cmd+Shift+A
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        setIsAdminModalOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    window.scrollTo({ top: 0, behavior: 'instant' });

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handlePreRegister = (courseTitle?: string) => {
    if (courseTitle) {
      setStudentClass(courseTitle);
    }
    setIsRegisterModalOpen(true);
    setFormSubmitted(false);
  };

  const submitRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName.trim() || !studentPhone.trim()) return;

    setIsSubmitting(true);
    try {
      saveClassroomRegistration({
        name: studentName,
        phone: studentPhone,
        course: studentClass,
        message: studentMessage,
      });
      // Short delay so request gets dispatched over network cleanly
      await new Promise((resolve) => setTimeout(resolve, 500));
    } catch {
      // ignore
    } finally {
      setIsSubmitting(false);
      setFormSubmitted(true);
    }
  };

  // Filter courses based on active tab
  const filteredCourses = COURSES.filter((c) => {
    if (activeCourseTab === 'all') return true;
    return c.category === activeCourseTab;
  });

  return (
    <div className="min-h-screen bg-[#fffbf7] text-zinc-900 selection:bg-orange-500 selection:text-white font-sans relative overflow-x-hidden pb-24 md:pb-0">
      {/* Background Decorative Warm Orange Gradients (Light Theme) */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] sm:w-[1000px] h-[550px] rounded-full bg-gradient-to-b from-orange-200/50 via-amber-100/30 to-transparent blur-[120px]" />
        <div className="absolute top-[35%] -right-24 w-[420px] h-[420px] rounded-full bg-orange-100/60 blur-[120px]" />
        <div className="absolute top-[65%] -left-24 w-[450px] h-[450px] rounded-full bg-amber-100/50 blur-[130px]" />
        <div
          className="absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage: `radial-gradient(#f97316 0.75px, transparent 0.75px)`,
            backgroundSize: '28px 28px',
          }}
        />
      </div>

      {/* Top Header / Navigation */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-orange-200/70 shadow-xs transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Dedicated Logo & Name for Mahim's Classroom (No 'অফিসিয়াল' badge as requested) */}
          <div
            className="flex items-center gap-3 cursor-pointer select-none"
            onClick={() => scrollTo('hero')}
            id="classroom-brand-logo"
          >
            <div className="relative w-11 h-11 rounded-2xl bg-gradient-to-br from-orange-500 via-amber-500 to-orange-600 p-[2px] shadow-md shadow-orange-500/20 shrink-0 group">
              <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center relative overflow-hidden transition-all group-hover:bg-orange-50">
                <GraduationCap className="w-6 h-6 text-orange-600 relative z-10 transform group-hover:scale-110 transition-transform" />
                <span className="absolute bottom-1 right-1 w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
              </div>
            </div>

            <div>
              <div className="flex items-center">
                <span className="font-extrabold text-lg sm:text-xl tracking-tight text-zinc-900 flex items-center">
                  <span>Mahim's</span>
                  <span className="text-orange-600 ml-1">Classroom</span>
                </span>
              </div>
              <p className="text-[11px] text-zinc-500 font-['Hind_Siliguri',sans-serif] font-medium leading-tight">
                একাডেমিক ও এডমিশন লার্নিং প্ল্যাটফর্ম
              </p>
            </div>
          </div>

          {/* Navigation Actions */}
          <div className="flex items-center gap-1 sm:gap-3">
            <button
              onClick={() => scrollTo('courses')}
              className="hidden md:inline-flex text-xs font-semibold text-zinc-700 hover:text-orange-600 transition-colors px-3 py-2 font-['Hind_Siliguri',sans-serif]"
            >
              কোর্স ও ব্যাচ
            </button>
            <button
              onClick={() => scrollTo('faculty')}
              className="hidden md:inline-flex text-xs font-semibold text-zinc-700 hover:text-orange-600 transition-colors px-3 py-2 font-['Hind_Siliguri',sans-serif]"
            >
              শিক্ষক প্যানেল
            </button>
            <button
              onClick={() => scrollTo('calendar')}
              className="hidden md:inline-flex text-xs font-semibold text-zinc-700 hover:text-orange-600 transition-colors px-3 py-2 font-['Hind_Siliguri',sans-serif]"
            >
              এডমিশন ক্যালেন্ডার
            </button>
            <button
              onClick={() => scrollTo('articles')}
              className="hidden md:inline-flex text-xs font-semibold text-zinc-700 hover:text-orange-600 transition-colors px-3 py-2 font-['Hind_Siliguri',sans-serif]"
            >
              ব্লগ ও গাইডলাইন
            </button>

            {/* Pre-Registration CTA */}
            <button
              onClick={() => handlePreRegister()}
              id="nav-pre-register-btn"
              className="inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-orange-500 hover:bg-orange-600 text-white shadow-md shadow-orange-500/25 hover:shadow-lg hover:shadow-orange-500/35 transition-all font-['Hind_Siliguri',sans-serif] active:scale-95 cursor-pointer"
            >
              <Sparkles size={14} className="text-amber-200" />
              <span>প্রি-রেজিস্ট্রেশন</span>
            </button>

            {/* Back to main portfolio */}
            <button
              onClick={() => navigateTo('/')}
              id="back-to-portfolio-btn"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-zinc-600 hover:text-zinc-900 bg-orange-50 hover:bg-orange-100 border border-orange-200/80 transition-colors font-['Hind_Siliguri',sans-serif] cursor-pointer"
              title="মাহিমের মূল পোর্টফোলিওতে যান"
            >
              <ArrowLeft size={14} className="text-orange-600" />
              <span>পোর্টফোলিও</span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section (Focus strictly on HSC, Admission & SSC as requested) */}
      <section id="hero" className="relative z-10 pt-10 sm:pt-16 pb-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        {/* Top Tag */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-100/90 border border-orange-300 text-orange-800 text-xs sm:text-sm font-semibold mb-6 font-['Hind_Siliguri',sans-serif] shadow-xs">
          <span className="w-2 h-2 rounded-full bg-orange-600 animate-ping" />
          <span>এইচএসসি, এডমিশন ও এসএসসি স্মার্ট লার্নিং হাব</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-zinc-900 tracking-tight leading-[1.25] mb-5 max-w-4xl mx-auto font-['Hind_Siliguri',sans-serif]">
          কনসেপ্ট ক্লিয়ারিং থেকে বোর্ড ও এডমিশন জয় —{' '}
          <span className="text-orange-600">
            Mahim's Classroom
          </span>
        </h1>

        {/* Hero Subtitle */}
        <p className="text-base sm:text-lg lg:text-xl text-zinc-600 max-w-2xl mx-auto mb-8 font-['Hind_Siliguri',sans-serif] leading-relaxed">
          এইচএসসি, বিশ্ববিদ্যালয় ভর্তি প্রস্তুতি ও এসএসসি শিক্ষার্থীদের জন্য
          অনলাইন ভিত্তিক কনসেপ্ট ক্লাস এবং স্মার্ট এক্সাম সিস্টেম।
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 max-w-md mx-auto mb-14 font-['Hind_Siliguri',sans-serif]">
          <button
            onClick={() => handlePreRegister()}
            id="hero-pre-register-btn"
            className="w-full sm:w-auto px-7 py-3.5 rounded-xl font-bold text-sm bg-orange-500 hover:bg-orange-600 text-white shadow-xl shadow-orange-500/25 hover:shadow-orange-500/40 flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer"
          >
            <span>অগ্রিম আসন বুকিং (Pre-Register)</span>
            <ArrowRight size={16} />
          </button>

          <button
            onClick={() => scrollTo('courses')}
            id="hero-view-courses-btn"
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-bold text-sm bg-white hover:bg-orange-50 text-orange-700 border border-orange-300 shadow-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <BookOpen size={16} className="text-orange-600" />
            <span>কোর্স ও ব্যাচসমূহ দেখুন</span>
          </button>
        </div>

        {/* Feature Cards (Smart Exam System featured, OMR removed as requested) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 sm:gap-4 max-w-4xl mx-auto text-left">
          <div className="bg-white border border-orange-200/90 hover:border-orange-400 rounded-2xl p-4 sm:p-5 shadow-xs hover:shadow-md transition-all">
            <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center mb-3">
              <BrainCircuit size={20} />
            </div>
            <h4 className="text-zinc-900 font-bold text-sm sm:text-base font-['Hind_Siliguri',sans-serif]">
              কনসেপ্ট ফার্স্ট লার্নিং
            </h4>
            <p className="text-xs text-zinc-500 mt-1 font-['Hind_Siliguri',sans-serif] leading-relaxed">
              আইসিটি, গণিত ও বিজ্ঞানের প্রতিটি বিষয়ের গভীর ও স্পষ্ট বোধগম্যতা।
            </p>
          </div>

          <div className="bg-white border border-orange-200/90 hover:border-orange-400 rounded-2xl p-4 sm:p-5 shadow-xs hover:shadow-md transition-all">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mb-3">
              <Target size={20} />
            </div>
            <h4 className="text-zinc-900 font-bold text-sm sm:text-base font-['Hind_Siliguri',sans-serif]">
              স্মার্ট এক্সাম সিস্টেম
            </h4>
            <p className="text-xs text-zinc-500 mt-1 font-['Hind_Siliguri',sans-serif] leading-relaxed">
              অনলাইন লাইভ টেস্ট, নেগেটিভ মার্কিং ট্র্যাকিং এবং ইনস্ট্যান্ট মেরিট লিস্ট।
            </p>
          </div>

          <div className="bg-white border border-orange-200/90 hover:border-orange-400 rounded-2xl p-4 sm:p-5 shadow-xs hover:shadow-md transition-all">
            <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center mb-3">
              <Sparkles size={20} />
            </div>
            <h4 className="text-zinc-900 font-bold text-sm sm:text-base font-['Hind_Siliguri',sans-serif]">
              এডমিশন স্পেশাল হ্যাকস
            </h4>
            <p className="text-xs text-zinc-500 mt-1 font-['Hind_Siliguri',sans-serif] leading-relaxed">
              বিগত ২০ বছরের প্রশ্ন বিশ্লেষণ এবং কম সময়ে সঠিক উত্তর বাছাইয়ের কৌশল।
            </p>
          </div>

          <div className="bg-white border border-orange-200/90 hover:border-orange-400 rounded-2xl p-4 sm:p-5 shadow-xs hover:shadow-md transition-all">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mb-3">
              <Compass size={20} />
            </div>
            <h4 className="text-zinc-900 font-bold text-sm sm:text-base font-['Hind_Siliguri',sans-serif]">
              পারসোনাল গাইডলাইন
            </h4>
            <p className="text-xs text-zinc-500 mt-1 font-['Hind_Siliguri',sans-serif] leading-relaxed">
              শিক্ষার্থীদের দুর্বলতা চিহ্নিত করে অধ্যায়ভিত্তিক রিভিশন প্ল্যানিং।
            </p>
          </div>
        </div>
      </section>

      {/* Courses / Upcoming Batches Section with Class Filters (Admission & HSC prioritized) */}
      <section id="courses" className="relative z-10 py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 text-orange-700 border border-orange-200 text-xs font-bold uppercase tracking-wider mb-2">
            <BookOpen size={14} />
            <span>Academic & Admission Programs</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-zinc-900 tracking-tight font-['Hind_Siliguri',sans-serif]">
            কোর্স ও ব্যাচসমূহ
          </h2>
          <p className="text-xs sm:text-sm text-zinc-600 mt-2 font-['Hind_Siliguri',sans-serif]">
            এডমিশন ও এইচএসসি ব্যাচের কারিকুলাম ও প্ল্যান চূড়ান্ত হচ্ছে। আপনার পছন্দের ব্যাচ নির্বাচন করে নাম এন্ট্রি করুন।
          </p>
        </div>

        {/* Class Filter Tabs (Admission and HSC at top priority as requested) */}
        <div className="flex items-center justify-center gap-2 flex-wrap mb-10 font-['Hind_Siliguri',sans-serif]">
          {[
            { id: 'admission', label: '🎓 এডমিশন (Admission)' },
            { id: 'hsc', label: '📘 এইচএসসি (HSC)' },
            { id: 'ssc', label: '📗 এসএসসি (SSC)' },
            { id: 'all', label: 'সব কোর্স' },
            { id: 'junior', label: 'ক্লাস ৬–৮' },
            { id: 'skills', label: 'স্কিলস' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveCourseTab(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeCourseTab === tab.id
                  ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20 scale-105'
                  : 'bg-white hover:bg-orange-50 text-zinc-700 border border-orange-200/80 hover:border-orange-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <div
              key={course.id}
              id={`course-card-${course.id}`}
              className="bg-white border border-orange-200/90 hover:border-orange-400 rounded-3xl p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 shadow-sm hover:shadow-xl hover:shadow-orange-500/10 group relative overflow-hidden"
            >
              {course.isFeatured && (
                <div className="absolute -top-6 -right-6 w-16 h-16 bg-orange-500/10 rounded-full blur-xl pointer-events-none" />
              )}

              <div>
                {/* Badge & Status */}
                <div className="flex items-center justify-between gap-2 mb-4">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-orange-100 text-orange-700 border border-orange-200 font-['Hind_Siliguri',sans-serif]">
                    {course.categoryLabel}
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-mono text-zinc-600 bg-orange-50 px-2.5 py-1 rounded-lg border border-orange-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
                    <span>{course.status === 'launching_soon' ? 'Launching Soon' : 'Upcoming'}</span>
                  </span>
                </div>

                {/* Course Title */}
                <h3 className="text-xl font-bold text-zinc-900 group-hover:text-orange-600 transition-colors font-['Hind_Siliguri',sans-serif] mb-2">
                  {course.title}
                </h3>

                {course.category !== 'admission' && course.targetBadge && (
                  <p className="text-xs text-orange-700 font-semibold mb-3 font-['Hind_Siliguri',sans-serif]">
                    {course.targetBadge}
                  </p>
                )}

                <p className="text-xs sm:text-sm text-zinc-600 font-['Hind_Siliguri',sans-serif] leading-relaxed mb-6">
                  {course.description}
                </p>

                {/* Highlights */}
                <div className="space-y-2 mb-6 pt-4 border-t border-orange-100">
                  {course.highlights.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-zinc-700 font-['Hind_Siliguri',sans-serif]">
                      <CheckCircle2 size={14} className="text-orange-600 shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => handlePreRegister(course.title)}
                className="w-full py-3 rounded-xl font-bold text-xs sm:text-sm bg-orange-50 hover:bg-orange-500 text-orange-700 hover:text-white border border-orange-300 hover:border-transparent transition-all flex items-center justify-center gap-2 font-['Hind_Siliguri',sans-serif] cursor-pointer active:scale-98"
              >
                <span>আগ্রহ প্রকাশ করুন (Pre-Register)</span>
                <ArrowRight size={14} />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Faculty Section (Strictly as requested: Dhaka Central University + Founder + 'বিস্তারিত' Button) */}
      <section id="faculty" className="relative z-10 py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 text-orange-700 border border-orange-200 text-xs font-bold uppercase tracking-wider mb-2">
            <GraduationCap size={15} />
            <span>Faculty & Mentors</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-zinc-900 tracking-tight font-['Hind_Siliguri',sans-serif]">
            শিক্ষক ও মেন্টর প্যানেল
          </h2>
          <p className="text-xs sm:text-sm text-zinc-600 mt-2 font-['Hind_Siliguri',sans-serif]">
            সরাসরি অ্যাকাডেমিক এক্সিলেন্স ও সঠিক দিকনির্দেশনা দিয়ে শিক্ষার্থীদের পাশে আছি আমরা।
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {/* Mahim's Card */}
          {/* Front details strictly matching user prompt:
              - Name: মাহিম (Mahim)
              - Below name: ঢাকা সেন্ট্রাল ইউনিভার্সিটি
              - Below that: ফাউন্ডার, মাহিম'স ক্লাসরুম
              - Below that: 'বিস্তারিত' Button
          */}
          <div
            id="mentor-card-mahim"
            className="group relative bg-white border-2 border-orange-300 hover:border-orange-500 rounded-3xl p-6 shadow-md hover:shadow-xl hover:shadow-orange-500/10 transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
                {/* Photo */}
                <div className="relative shrink-0">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl p-1 bg-gradient-to-br from-orange-400 via-amber-400 to-orange-500 shadow-md shadow-orange-500/20">
                    <img
                      src="https://res.cloudinary.com/drvyjj7td/image/upload/v1788708908/behance_pp_spfumh.jpg"
                      alt="Mahim - Lead Mentor"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/mahim.jpg';
                      }}
                      className="w-full h-full object-cover rounded-[14px]"
                    />
                  </div>
                  <span className="absolute -bottom-2 -right-1 bg-white border border-orange-300 p-1 rounded-full text-orange-600 shadow-xs">
                    <CheckCircle2 size={15} />
                  </span>
                </div>

                {/* Identity on front */}
                <div className="text-center sm:text-left flex-1">
                  <h3 className="text-xl font-black text-zinc-900 group-hover:text-orange-600 transition-colors font-['Hind_Siliguri',sans-serif]">
                    মাহিম <span className="text-xs font-mono text-zinc-500 font-normal">(Mahim)</span>
                  </h3>

                  {/* ঢাকা সেন্ট্রাল ইউনিভার্সিটি */}
                  <p className="mt-1.5 text-xs sm:text-sm font-bold text-zinc-800 font-['Hind_Siliguri',sans-serif] flex items-center justify-center sm:justify-start gap-1.5">
                    <School size={15} className="text-orange-600 shrink-0" />
                    <span>ঢাকা সেন্ট্রাল ইউনিভার্সিটি</span>
                  </p>

                  {/* ফাউন্ডার, মাহিম'স ক্লাসরুম */}
                  <p className="mt-1 text-xs font-semibold text-orange-700 font-['Hind_Siliguri',sans-serif]">
                    ফাউন্ডার, মাহিম'স ক্লাসরুম
                  </p>
                </div>
              </div>
            </div>

            {/* "বিস্তারিত" Button strictly at the bottom */}
            <div className="mt-6 pt-4 border-t border-orange-100 flex items-center justify-between gap-2">
              <button
                onClick={() => navigateTo('/classroom/mahim')}
                id="mahim-details-btn"
                className="flex-1 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold bg-orange-500 hover:bg-orange-600 text-white shadow-md shadow-orange-500/20 transition-all flex items-center justify-center gap-1 font-['Hind_Siliguri',sans-serif] cursor-pointer active:scale-98"
              >
                <span>বিস্তারিত প্রোফাইল</span>
                <ChevronRight size={16} />
              </button>
              <button
                onClick={() => setIsProfileModalOpen(true)}
                title="কুইক ভিউ"
                className="p-2.5 rounded-xl border border-orange-200 hover:bg-orange-50 text-orange-600 transition-colors cursor-pointer"
              >
                <Sparkles size={16} />
              </button>
            </div>
          </div>

          {/* Samiul Islam Sohrab's Card */}
          <div
            id="mentor-card-samiul"
            className="group relative bg-white border-2 border-orange-300 hover:border-orange-500 rounded-3xl p-6 shadow-md hover:shadow-xl hover:shadow-orange-500/10 transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
                {/* Photo */}
                <div className="relative shrink-0">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl p-1 bg-gradient-to-br from-amber-400 via-orange-400 to-amber-500 shadow-md shadow-orange-500/20">
                    <img
                      src="https://res.cloudinary.com/drvyjj7td/image/upload/v1789228263/763122727_1365661164992767_5907311244126216229_n_y5bajt.jpg"
                      alt="সামিউল ইসলাম সোহরাব"
                      className="w-full h-full object-cover rounded-[14px]"
                    />
                  </div>
                  <span className="absolute -bottom-2 -right-1 bg-white border border-orange-300 p-1 rounded-full text-orange-600 shadow-xs">
                    <CheckCircle2 size={15} />
                  </span>
                </div>

                {/* Identity on front */}
                <div className="text-center sm:text-left flex-1">
                  <h3 className="text-xl font-black text-zinc-900 group-hover:text-orange-600 transition-colors font-['Hind_Siliguri',sans-serif]">
                    সামিউল ইসলাম সোহরাব
                  </h3>

                  {/* ফাউন্ডার, সামনাদ একাডেমি */}
                  <p className="mt-1.5 text-xs sm:text-sm font-bold text-orange-700 font-['Hind_Siliguri',sans-serif] flex items-center justify-center sm:justify-start gap-1.5">
                    <Sparkles size={14} className="text-orange-600 shrink-0" />
                    <span>ফাউন্ডার, সামনাদ একাডেমি</span>
                  </p>

                  <p className="mt-1 text-xs font-medium text-zinc-600 font-['Hind_Siliguri',sans-serif]">
                    ড্যাফোডিল ইন্টারন্যাশনাল ইউনিভার্সিটি
                  </p>
                </div>
              </div>
            </div>

            {/* "বিস্তারিত" Button */}
            <div className="mt-6 pt-4 border-t border-orange-100 flex items-center justify-between gap-2">
              <button
                onClick={() => navigateTo('/classroom/samiul')}
                id="samiul-details-btn"
                className="flex-1 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold bg-orange-500 hover:bg-orange-600 text-white shadow-md shadow-orange-500/20 transition-all flex items-center justify-center gap-1 font-['Hind_Siliguri',sans-serif] cursor-pointer active:scale-98"
              >
                <span>বিস্তারিত প্রোফাইল</span>
                <ChevronRight size={16} />
              </button>
              <button
                onClick={() => setIsSamiulModalOpen(true)}
                title="কুইক ভিউ"
                className="p-2.5 rounded-xl border border-orange-200 hover:bg-orange-50 text-orange-600 transition-colors cursor-pointer"
              >
                <Sparkles size={16} />
              </button>
            </div>
          </div>

          {/* Abu Saleh Suja's Card */}
          <div
            id="mentor-card-suja"
            className="group relative bg-white border-2 border-orange-300 hover:border-orange-500 rounded-3xl p-6 shadow-md hover:shadow-xl hover:shadow-orange-500/10 transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
                {/* Photo */}
                <div className="relative shrink-0">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl p-1 bg-gradient-to-br from-emerald-400 via-teal-400 to-orange-500 shadow-md shadow-orange-500/20">
                    <img
                      src="https://res.cloudinary.com/drvyjj7td/image/upload/v1789229348/518363223_1616327812659453_3831296542395096165_n_1_fak2cg.jpg"
                      alt="আবু সালেহ সুজা"
                      className="w-full h-full object-cover rounded-[14px]"
                    />
                  </div>
                  <span className="absolute -bottom-2 -right-1 bg-white border border-orange-300 p-1 rounded-full text-orange-600 shadow-xs">
                    <CheckCircle2 size={15} />
                  </span>
                </div>

                {/* Identity on front */}
                <div className="text-center sm:text-left flex-1">
                  <h3 className="text-xl font-black text-zinc-900 group-hover:text-orange-600 transition-colors font-['Hind_Siliguri',sans-serif]">
                    আবু সালেহ সুজা
                  </h3>

                  {/* ফার্মেসি, মওলানা ভাসানী বিজ্ঞান ও প্রযুক্তি বিশ্ববিদ্যালয় */}
                  <p className="mt-1.5 text-xs sm:text-sm font-bold text-emerald-700 font-['Hind_Siliguri',sans-serif] flex items-center justify-center sm:justify-start gap-1.5">
                    <Sparkles size={14} className="text-emerald-600 shrink-0" />
                    <span>ফার্মেসি বিভাগ</span>
                  </p>

                  <p className="mt-1 text-xs font-medium text-zinc-700 font-['Hind_Siliguri',sans-serif] leading-tight">
                    মওলানা ভাসানী বিজ্ঞান ও প্রযুক্তি বিশ্ববিদ্যালয় (MBSTU)
                  </p>
                </div>
              </div>
            </div>

            {/* "বিস্তারিত" Button */}
            <div className="mt-6 pt-4 border-t border-orange-100 flex items-center justify-between gap-2">
              <button
                onClick={() => navigateTo('/classroom/suza')}
                id="suza-details-btn"
                className="flex-1 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold bg-orange-500 hover:bg-orange-600 text-white shadow-md shadow-orange-500/20 transition-all flex items-center justify-center gap-1 font-['Hind_Siliguri',sans-serif] cursor-pointer active:scale-98"
              >
                <span>বিস্তারিত প্রোফাইল</span>
                <ChevronRight size={16} />
              </button>
              <button
                onClick={() => setIsSujaModalOpen(true)}
                title="কুইক ভিউ"
                className="p-2.5 rounded-xl border border-orange-200 hover:bg-orange-50 text-orange-600 transition-colors cursor-pointer"
              >
                <Sparkles size={16} />
              </button>
            </div>
          </div>

          {/* Mishkat Sharif Mithen's Card */}
          <div
            id="mentor-card-mithen"
            className="group relative bg-white border-2 border-orange-300 hover:border-orange-500 rounded-3xl p-6 shadow-md hover:shadow-xl hover:shadow-orange-500/10 transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
                {/* Photo */}
                <div className="relative shrink-0">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl p-1 bg-gradient-to-br from-blue-400 via-indigo-400 to-orange-500 shadow-md shadow-orange-500/20">
                    <img
                      src="https://res.cloudinary.com/drvyjj7td/image/upload/v1789229549/mithen10_nrizvj.png"
                      alt="মিশকাত শরীফ মিথেন"
                      className="w-full h-full object-cover rounded-[14px]"
                    />
                  </div>
                  <span className="absolute -bottom-2 -right-1 bg-white border border-orange-300 p-1 rounded-full text-orange-600 shadow-xs">
                    <CheckCircle2 size={15} />
                  </span>
                </div>

                {/* Identity on front */}
                <div className="text-center sm:text-left flex-1">
                  <h3 className="text-xl font-black text-zinc-900 group-hover:text-orange-600 transition-colors font-['Hind_Siliguri',sans-serif]">
                    মিশকাত শরীফ মিথেন
                  </h3>

                  {/* বেগম রোকেয়া বিশ্ববিদ্যালয় */}
                  <p className="mt-1.5 text-xs sm:text-sm font-bold text-zinc-800 font-['Hind_Siliguri',sans-serif] flex items-center justify-center sm:justify-start gap-1.5">
                    <School size={15} className="text-orange-600 shrink-0" />
                    <span>বেগম রোকেয়া বিশ্ববিদ্যালয় (BRUR)</span>
                  </p>

                  {/* ফাউন্ডারঃ মিথেন প্রাইভেট হোম */}
                  <p className="mt-1 text-xs font-semibold text-orange-700 font-['Hind_Siliguri',sans-serif]">
                    ফাউন্ডারঃ মিথেন প্রাইভেট হোম
                  </p>
                </div>
              </div>
            </div>

            {/* "বিস্তারিত" Button */}
            <div className="mt-6 pt-4 border-t border-orange-100 flex items-center justify-between gap-2">
              <button
                onClick={() => navigateTo('/classroom/mithen')}
                id="mithen-details-btn"
                className="flex-1 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold bg-orange-500 hover:bg-orange-600 text-white shadow-md shadow-orange-500/20 transition-all flex items-center justify-center gap-1 font-['Hind_Siliguri',sans-serif] cursor-pointer active:scale-98"
              >
                <span>বিস্তারিত প্রোফাইল</span>
                <ChevronRight size={16} />
              </button>
              <button
                onClick={() => setIsMithenModalOpen(true)}
                title="কুইক ভিউ"
                className="p-2.5 rounded-xl border border-orange-200 hover:bg-orange-50 text-orange-600 transition-colors cursor-pointer"
              >
                <Sparkles size={16} />
              </button>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* Card 5: Swocchol Kumar Karmokar (UIU CSE)                                  */}
          {/* ========================================================================= */}
          <div
            id="mentor-card-swocchol"
            className="group relative bg-white border-2 border-orange-300 hover:border-orange-500 rounded-3xl p-6 shadow-md hover:shadow-xl hover:shadow-orange-500/10 transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
                {/* Photo */}
                <div className="relative shrink-0">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl p-1 bg-gradient-to-br from-orange-400 via-amber-400 to-red-500 shadow-md shadow-orange-500/20">
                    <img
                      src="https://res.cloudinary.com/drvyjj7td/image/upload/v1789231884/swocchol_uxtt4r.png"
                      alt="স্বচ্ছল কুমার কর্মকার"
                      className="w-full h-full object-cover rounded-[14px]"
                    />
                  </div>
                  <span className="absolute -bottom-2 -right-1 bg-white border border-orange-300 p-1 rounded-full text-orange-600 shadow-xs">
                    <CheckCircle2 size={15} />
                  </span>
                </div>

                {/* Identity on front */}
                <div className="text-center sm:text-left flex-1">
                  <h3 className="text-xl font-black text-zinc-900 group-hover:text-orange-600 transition-colors font-['Hind_Siliguri',sans-serif]">
                    স্বচ্ছল কুমার কর্মকার
                  </h3>

                  {/* কম্পিউটার সাইন্স এন্ড ইঞ্জিনিয়ারিং */}
                  <p className="mt-1 text-xs sm:text-sm font-bold text-orange-600 font-['Hind_Siliguri',sans-serif]">
                    কম্পিউটার সাইন্স এন্ড ইঞ্জিনিয়ারিং (CSE)
                  </p>

                  {/* ইউনাইটেড ইন্টারন্যাশনাল ইউনিভার্সিটি */}
                  <p className="mt-1 text-xs sm:text-sm font-semibold text-zinc-800 font-['Hind_Siliguri',sans-serif] flex items-center justify-center sm:justify-start gap-1.5">
                    <School size={15} className="text-orange-600 shrink-0" />
                    <span>ইউনাইটেড ইন্টারন্যাশনাল ইউনিভার্সিটি</span>
                  </p>
                </div>
              </div>
            </div>

            {/* "বিস্তারিত" Button */}
            <div className="mt-6 pt-4 border-t border-orange-100 flex items-center justify-between gap-2">
              <button
                onClick={() => navigateTo('/classroom/swocchol')}
                id="swocchol-details-btn"
                className="flex-1 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold bg-orange-500 hover:bg-orange-600 text-white shadow-md shadow-orange-500/20 transition-all flex items-center justify-center gap-1 font-['Hind_Siliguri',sans-serif] cursor-pointer active:scale-98"
              >
                <span>বিস্তারিত প্রোফাইল</span>
                <ChevronRight size={16} />
              </button>
              <button
                onClick={() => setIsSwoccholModalOpen(true)}
                title="কুইক ভিউ"
                className="p-2.5 rounded-xl border border-orange-200 hover:bg-orange-50 text-orange-600 transition-colors cursor-pointer"
              >
                <Sparkles size={16} />
              </button>
            </div>
          </div>

          {/* Upcoming Faculty Expansion Card */}
          <div className="bg-white/80 border-2 border-dashed border-orange-300 hover:border-orange-400 rounded-3xl p-6 flex flex-col items-center justify-center text-center transition-all shadow-xs">
            <div className="w-12 h-12 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center mb-3">
              <Users size={24} />
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-orange-100 text-orange-800 mb-2 font-['Hind_Siliguri',sans-serif]">
              <Sparkles size={13} className="text-orange-600" />
              <span>শীঘ্রই আরও যুক্ত হচ্ছে</span>
            </div>
            <h3 className="text-lg font-bold text-zinc-900 font-['Hind_Siliguri',sans-serif] mb-1.5">
              পাবলিক ও প্রযুক্তি বিশ্ববিদ্যালয় প্যানেল
            </h3>
            <p className="text-xs text-zinc-600 max-w-xs font-['Hind_Siliguri',sans-serif] leading-relaxed">
              শীর্ষস্থানীয় পাবলিক বিশ্ববিদ্যালয় এবং প্রযুক্তি বিশ্ববিদ্যালয়ের অভিজ্ঞ মেন্টরদের নিয়ে মাহিম’স ক্লাসরুমের প্যানেল প্রতিনিয়ত সমৃদ্ধ হচ্ছে।
            </p>
          </div>
        </div>
      </section>

      {/* Admission Calendar Section (New section as requested) */}
      <section id="calendar" className="relative z-10 py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="bg-gradient-to-br from-white via-orange-50/50 to-white border-2 border-orange-300 rounded-3xl p-6 sm:p-10 shadow-md">
          <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6">
            <div className="flex-1 text-center sm:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 text-orange-800 text-xs font-bold font-['Hind_Siliguri',sans-serif] mb-3">
                <Calendar size={14} className="text-orange-600" />
                <span>Admission Calendar Hub</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-zinc-900 font-['Hind_Siliguri',sans-serif] mb-2">
                এডমিশন ক্যালেন্ডার
              </h3>
              <p className="text-xs sm:text-sm text-zinc-600 font-['Hind_Siliguri',sans-serif] leading-relaxed max-w-xl">
                বিভিন্ন বিশ্ববিদ্যালয়ের ভর্তি পরীক্ষার সার্কুলার, আবেদনের সময়সীমা, এডমিট কার্ড ডাউনলোড এবং সম্ভাব্য
                পরীক্ষার তারিখ এক নজরে ট্র্যাক করার জন্য তৈরি হচ্ছে ডেডিকেটেড এডমিশন ক্যালেন্ডার।
              </p>

              <div className="mt-5 flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <span className="px-3 py-1 rounded-lg bg-white border border-orange-200 text-[11px] font-bold text-zinc-700 font-['Hind_Siliguri',sans-serif]">
                  📍 ঢাকা বিশ্ববিদ্যালয় (ঢাবি)
                </span>
                <span className="px-3 py-1 rounded-lg bg-white border border-orange-200 text-[11px] font-bold text-zinc-700 font-['Hind_Siliguri',sans-serif]">
                  📍 জাহাঙ্গীরনগর বিশ্ববিদ্যালয় (জাবি)
                </span>
                <span className="px-3 py-1 rounded-lg bg-white border border-orange-200 text-[11px] font-bold text-zinc-700 font-['Hind_Siliguri',sans-serif]">
                  📍 গুচ্ছভুক্ত বিশ্ববিদ্যালয়সমূহ
                </span>
                <span className="px-3 py-1 rounded-lg bg-white border border-orange-200 text-[11px] font-bold text-zinc-700 font-['Hind_Siliguri',sans-serif]">
                  📍 বুয়েট ও মেডিকেল
                </span>
              </div>
            </div>

            <div className="shrink-0 flex flex-col items-center justify-center bg-orange-500/10 border border-orange-300/80 rounded-2xl p-5 text-center w-full sm:w-auto">
              <Clock size={32} className="text-orange-600 mb-2 animate-pulse" />
              <p className="text-xs font-bold text-orange-800 font-['Hind_Siliguri',sans-serif]">
                আপডেট শীঘ্রই যুক্ত হচ্ছে
              </p>
              <button
                onClick={() => handlePreRegister('এডমিশন ক্যালেন্ডার আপডেট নোটিফিকেশন')}
                className="mt-3 px-4 py-2 rounded-xl text-xs font-bold bg-orange-500 hover:bg-orange-600 text-white shadow-sm transition-all font-['Hind_Siliguri',sans-serif] cursor-pointer"
              >
                রিমাইন্ডার পেতে যুক্ত থাকুন
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Blog & Study Articles Section (New section as requested) */}
      <section id="articles" className="relative z-10 py-12 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 text-orange-700 border border-orange-200 text-xs font-bold uppercase tracking-wider mb-2">
            <FileText size={14} />
            <span>Academic & Admission Blog</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-zinc-900 tracking-tight font-['Hind_Siliguri',sans-serif]">
            স্টাডি আর্টিকেল ও গাইডলাইন
          </h2>
          <p className="text-xs sm:text-sm text-zinc-600 mt-2 font-['Hind_Siliguri',sans-serif]">
            এডমিশন হ্যাকস, এইচএসসি আইসিটি টিপস এবং পরীক্ষার হলের সেরা কৌশলের প্রয়োজনীয় আর্টিকেলসমূহ।
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {ARTICLES.map((art) => (
            <div
              key={art.id}
              onClick={() => setSelectedArticle(art)}
              className="bg-white border border-orange-200/90 hover:border-orange-400 rounded-3xl p-6 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 shadow-xs hover:shadow-xl hover:shadow-orange-500/10 cursor-pointer group"
            >
              <div>
                <div className="flex items-center justify-between text-[11px] font-bold text-orange-700 mb-3 font-['Hind_Siliguri',sans-serif]">
                  <span className="px-2.5 py-0.5 rounded-md bg-orange-100 border border-orange-200">
                    {art.category}
                  </span>
                  <span className="text-zinc-400 font-normal">{art.readTime}</span>
                </div>

                <h3 className="text-base sm:text-lg font-bold text-zinc-900 group-hover:text-orange-600 transition-colors font-['Hind_Siliguri',sans-serif] mb-3 leading-snug">
                  {art.title}
                </h3>

                <p className="text-xs text-zinc-600 font-['Hind_Siliguri',sans-serif] leading-relaxed mb-4">
                  {art.summary}
                </p>
              </div>

              <div className="pt-4 border-t border-orange-100 flex items-center justify-between text-xs font-bold text-orange-600 font-['Hind_Siliguri',sans-serif]">
                <span>সম্পূর্ণ আর্টিকেল পড়ুন</span>
                <ChevronRight size={15} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Pre-Registration Banner (NO WhatsApp, 100% focused direct registration) */}
      <section className="relative z-10 py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="bg-gradient-to-br from-orange-500 via-orange-600 to-amber-600 rounded-3xl p-8 sm:p-12 text-center shadow-xl shadow-orange-500/20 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />

          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/20 text-white border border-white/30 mb-4 font-['Hind_Siliguri',sans-serif]">
            <Zap size={14} />
            <span>অগ্রিম আসন নিশ্চিতকরণ</span>
          </span>

          <h2 className="text-2xl sm:text-4xl font-black mb-3 font-['Hind_Siliguri',sans-serif]">
            ব্যাচ শুরু হওয়ার সাথে সাথে আপডেট পেতে চান?
          </h2>
          <p className="text-xs sm:text-base text-orange-50 max-w-2xl mx-auto mb-8 font-['Hind_Siliguri',sans-serif] leading-relaxed">
            কোনো ফি ছাড়াই আপনার নাম ও কাঙ্ক্ষিত ব্যাচ এন্ট্রি করে রাখুন। ব্যাচ রুটিন, ওরিয়েন্টেশন ক্লাস এবং বিশেষ অফার
            সরাসরি আপনার মোবাইল নম্বরে এসএমএস বা কলের মাধ্যমে জানিয়ে দেওয়া হবে।
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 max-w-md mx-auto font-['Hind_Siliguri',sans-serif]">
            <button
              onClick={() => handlePreRegister()}
              id="cta-pre-register-btn"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-sm bg-white hover:bg-orange-50 text-orange-700 shadow-lg shadow-black/10 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
            >
              <span>প্রি-রেজিস্ট্রেশন ফরম পূরণ করুন</span>
              <ArrowRight size={16} className="text-orange-600" />
            </button>
          </div>
        </div>
      </section>

      {/* Footer (Light Theme) */}
      <footer className="relative z-10 border-t border-orange-200/80 bg-white py-10 px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3 text-left">
            <div className="w-9 h-9 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center border border-orange-200">
              <GraduationCap size={18} />
            </div>
            <div>
              <p className="font-extrabold text-sm text-zinc-900">
                Mahim's <span className="text-orange-600">Classroom</span>
              </p>
              <p className="text-[11px] text-zinc-500 font-['Hind_Siliguri',sans-serif]">
                একাডেমিক ও এডমিশন লার্নিং প্ল্যাটফর্ম
              </p>
            </div>
          </div>

          <p className="text-xs text-zinc-500 font-['Hind_Siliguri',sans-serif] flex items-center justify-center gap-1 select-none">
            <span>© {new Date().getFullYear()} Mahim's Classroom</span>
            <button
              id="classroom-secret-admin-dot"
              type="button"
              onClick={() => setIsAdminModalOpen(true)}
              aria-label="Secret Admin Dot"
              className="w-6 h-6 inline-flex items-center justify-center text-zinc-400 hover:text-orange-600 active:scale-90 transition cursor-pointer select-none -mx-0.5"
              title="Classroom Admin"
            >
              •
            </button>
            <span>সর্বস্বত্ব সংরক্ষিত</span>
          </p>

          <div className="flex items-center gap-4 text-xs text-zinc-500 font-['Hind_Siliguri',sans-serif]">
            <button
              onClick={() => navigateTo('/')}
              className="hover:text-orange-600 transition-colors cursor-pointer"
            >
              মূল ওয়েবসাইট (mahims.com)
            </button>
            <span>•</span>
            <button
              onClick={() => scrollTo('hero')}
              className="hover:text-orange-600 transition-colors cursor-pointer"
            >
              উপরে যান ↑
            </button>
            <span>•</span>
            <button
              onClick={() => setIsAdminModalOpen(true)}
              className="hover:text-orange-600 transition-colors cursor-pointer flex items-center gap-1 text-zinc-400 hover:text-zinc-700 px-1.5 py-0.5 rounded hover:bg-zinc-100 transition-all"
              title="ক্লাসরুম এডমিন প্যানেল"
              id="classroom-admin-footer-btn"
            >
              <Lock size={11} />
              <span>এডমিন</span>
            </button>
          </div>
        </div>
      </footer>

      {/* ========================================================================= */}
      {/* MOBILE APP-STYLE BOTTOM DOCK (Clean, modern native app experience)         */}
      {/* ========================================================================= */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-t border-orange-200/90 px-2 py-1.5 shadow-[0_-4px_25px_rgba(0,0,0,0.08)]">
        <div className="flex items-center justify-around">
          <button
            onClick={() => scrollTo('courses')}
            className="flex flex-col items-center justify-center py-1 px-2 text-zinc-600 hover:text-orange-600 transition-colors"
          >
            <BookOpen size={18} className="text-orange-600" />
            <span className="text-[10px] font-bold font-['Hind_Siliguri',sans-serif] mt-0.5">কোর্সসমূহ</span>
          </button>

          <button
            onClick={() => scrollTo('faculty')}
            className="flex flex-col items-center justify-center py-1 px-2 text-zinc-600 hover:text-orange-600 transition-colors"
          >
            <Users size={18} className="text-zinc-600" />
            <span className="text-[10px] font-bold font-['Hind_Siliguri',sans-serif] mt-0.5">শিক্ষক</span>
          </button>

          {/* Center Elevated Action Button */}
          <button
            onClick={() => handlePreRegister()}
            className="flex flex-col items-center justify-center -mt-5 px-3 py-1.5 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-lg shadow-orange-500/40 active:scale-95 transition-transform"
          >
            <Sparkles size={20} className="animate-spin-slow" />
            <span className="text-[10px] font-black font-['Hind_Siliguri',sans-serif] mt-0.5">রেজিস্ট্রেশন</span>
          </button>

          <button
            onClick={() => scrollTo('calendar')}
            className="flex flex-col items-center justify-center py-1 px-2 text-zinc-600 hover:text-orange-600 transition-colors"
          >
            <Calendar size={18} className="text-zinc-600" />
            <span className="text-[10px] font-bold font-['Hind_Siliguri',sans-serif] mt-0.5">ক্যালেন্ডার</span>
          </button>

          <button
            onClick={() => scrollTo('articles')}
            className="flex flex-col items-center justify-center py-1 px-2 text-zinc-600 hover:text-orange-600 transition-colors"
          >
            <FileText size={18} className="text-zinc-600" />
            <span className="text-[10px] font-bold font-['Hind_Siliguri',sans-serif] mt-0.5">ব্লগ</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. Mahim Educational Profile Modal (Full Details on Click)                */}
      {/* ========================================================================= */}
      {isProfileModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-lg bg-white border-2 border-orange-400 rounded-3xl p-6 sm:p-8 shadow-2xl text-left overflow-hidden max-h-[90vh] overflow-y-auto">
            {/* Close button */}
            <button
              onClick={() => setIsProfileModalOpen(false)}
              id="close-profile-modal-btn"
              className="absolute top-4 right-4 p-2 rounded-xl bg-orange-50 text-zinc-500 hover:text-zinc-900 hover:bg-orange-100 transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>

            {/* Header with Photo & Name */}
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-2xl p-1 bg-gradient-to-br from-orange-400 to-amber-500 shrink-0 shadow-md shadow-orange-500/20">
                <img
                  src="https://res.cloudinary.com/drvyjj7td/image/upload/v1788708908/behance_pp_spfumh.jpg"
                  alt="Mahim"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = '/mahim.jpg';
                  }}
                  className="w-full h-full object-cover rounded-[12px]"
                />
              </div>
              <div>
                <h3 className="text-xl font-bold text-zinc-900 font-['Hind_Siliguri',sans-serif]">
                  মাহিম (Mahim)
                </h3>
                <p className="text-xs text-orange-600 font-bold font-['Hind_Siliguri',sans-serif]">
                  ফাউন্ডার, Mahim's Classroom
                </p>
                <p className="text-[12px] text-zinc-700 font-bold mt-0.5">
                  ঢাকা সেন্ট্রাল ইউনিভার্সিটি
                </p>
              </div>
            </div>

            {/* Complete Academic Credentials Section */}
            <div className="space-y-3 mb-6">
              <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-wider font-mono flex items-center gap-1.5">
                <GraduationCap size={16} className="text-orange-600" />
                <span>বিস্তারিত শিক্ষাগত পরিচয় ও ফলাফল:</span>
              </h4>

              {/* University Details including Campus, Department & Session */}
              <div className="bg-orange-50/80 border border-orange-200 rounded-2xl p-4">
                <div className="flex items-center justify-between text-xs font-bold text-orange-700 font-['Hind_Siliguri',sans-serif]">
                  <span className="flex items-center gap-1">
                    <School size={14} className="text-orange-600" />
                    বিশ্ববিদ্যালয় (স্নাতক - চলমান)
                  </span>
                  <span className="font-mono bg-white px-2 py-0.5 rounded border border-orange-200 text-zinc-700">
                    সেশন: ২০২৫-২০২৬
                  </span>
                </div>
                <p className="text-sm font-bold text-zinc-900 mt-2 font-['Hind_Siliguri',sans-serif]">
                  ঢাকা সেন্ট্রাল ইউনিভার্সিটি, ঢাকা কলেজ ক্যাম্পাস
                </p>
                <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white border border-orange-200 text-xs font-bold text-orange-800 font-['Hind_Siliguri',sans-serif]">
                  <BookMarked size={14} className="text-orange-600" />
                  <span>ডিপার্টমেন্ট অব পলিটিক্যাল সায়েন্স (Department of Political Science)</span>
                </div>
              </div>

              {/* HSC Result */}
              <div className="bg-white border border-orange-200 rounded-2xl p-3.5 shadow-xs">
                <div className="flex items-center justify-between text-xs font-bold text-zinc-800 font-['Hind_Siliguri',sans-serif]">
                  <span>উচ্চ মাধ্যমিক (HSC)</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-mono font-bold text-[11px] border border-emerald-300">
                    জিপিএ ৫.০০ (GPA 5.00)
                  </span>
                </div>
                <p className="text-sm font-bold text-zinc-900 mt-1 font-['Hind_Siliguri',sans-serif]">
                  বিজ্ঞান বিভাগ • দিনাজপুর শিক্ষা বোর্ড
                </p>
                <p className="text-xs text-zinc-500 mt-0.5 font-mono">
                  পাসের সন: ২০২৪
                </p>
              </div>

              {/* SSC Result */}
              <div className="bg-white border border-orange-200 rounded-2xl p-3.5 shadow-xs">
                <div className="flex items-center justify-between text-xs font-bold text-zinc-800 font-['Hind_Siliguri',sans-serif]">
                  <span>মাধ্যমিক (SSC)</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-mono font-bold text-[11px] border border-emerald-300">
                    জিপিএ ৫.০০ (GPA 5.00)
                  </span>
                </div>
                <p className="text-sm font-bold text-zinc-900 mt-1 font-['Hind_Siliguri',sans-serif]">
                  বিজ্ঞান বিভাগ • দিনাজপুর শিক্ষা বোর্ড
                </p>
                <p className="text-xs text-zinc-500 mt-0.5 font-mono">
                  পাসের সন: ২০২২
                </p>
              </div>
            </div>

            {/* Philosophy / Message */}
            <div className="bg-orange-100/70 border border-orange-200 rounded-2xl p-4 mb-6">
              <p className="text-xs text-zinc-800 font-['Hind_Siliguri',sans-serif] leading-relaxed">
                💡 <span className="font-bold text-orange-900">শিক্ষাদানের দর্শন:</span> মুখস্থবিদ্যার ওপর নির্ভরশীল না হয়ে প্রতিটি বিষয়ের বেসিক কনসেপ্ট পরিষ্কার করা। নিয়মিত স্মার্ট পরীক্ষা ও আত্মবিশ্বাস বৃদ্ধির মাধ্যমে কাঙ্ক্ষিত অ্যাকাডেমিক সাফল্য অর্জন করা সম্ভব।
              </p>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  setIsProfileModalOpen(false);
                  handlePreRegister();
                }}
                className="flex-1 py-3 rounded-xl font-bold text-xs sm:text-sm bg-orange-500 hover:bg-orange-600 text-white text-center transition-all shadow-md font-['Hind_Siliguri',sans-serif] cursor-pointer"
              >
                প্রি-রেজিস্ট্রেশন করুন ➔
              </button>
              <button
                onClick={() => setIsProfileModalOpen(false)}
                className="px-5 py-3 rounded-xl text-xs font-semibold bg-zinc-100 hover:bg-zinc-200 text-zinc-700 transition-colors font-['Hind_Siliguri',sans-serif] cursor-pointer"
              >
                বন্ধ করুন
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1.1 Samiul Islam Sohrab Educational Profile Modal                         */}
      {/* ========================================================================= */}
      {isSamiulModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-lg bg-white border-2 border-orange-400 rounded-3xl p-6 sm:p-8 shadow-2xl text-left overflow-hidden max-h-[90vh] overflow-y-auto">
            {/* Close button */}
            <button
              onClick={() => setIsSamiulModalOpen(false)}
              id="close-samiul-modal-btn"
              className="absolute top-4 right-4 p-2 rounded-xl bg-orange-50 text-zinc-500 hover:text-zinc-900 hover:bg-orange-100 transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>

            {/* Header with Photo & Name */}
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-2xl p-1 bg-gradient-to-br from-amber-400 via-orange-400 to-amber-500 shrink-0 shadow-md shadow-orange-500/20">
                <img
                  src="https://res.cloudinary.com/drvyjj7td/image/upload/v1789228263/763122727_1365661164992767_5907311244126216229_n_y5bajt.jpg"
                  alt="সামিউল ইসলাম সোহরাব"
                  className="w-full h-full object-cover rounded-[12px]"
                />
              </div>
              <div>
                <h3 className="text-xl font-bold text-zinc-900 font-['Hind_Siliguri',sans-serif]">
                  সামিউল ইসলাম সোহরাব
                </h3>
                <p className="text-xs text-orange-600 font-bold font-['Hind_Siliguri',sans-serif]">
                  ফাউন্ডার, সামনাদ একাডেমি
                </p>
                <p className="text-[12px] text-zinc-700 font-bold mt-0.5 font-['Hind_Siliguri',sans-serif]">
                  মেন্টর, শেখার সিড়ি
                </p>
              </div>
            </div>

            {/* Detailed Academic & Professional Credentials */}
            <div className="space-y-3 mb-6">
              <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-wider font-mono flex items-center gap-1.5">
                <GraduationCap size={16} className="text-orange-600" />
                <span>বিস্তারিত পরিচয় ও শিক্ষা:</span>
              </h4>

              {/* University Details */}
              <div className="bg-orange-50/80 border border-orange-200 rounded-2xl p-4">
                <div className="flex items-center justify-between text-xs font-bold text-orange-700 font-['Hind_Siliguri',sans-serif]">
                  <span className="flex items-center gap-1.5">
                    <School size={15} className="text-orange-600" />
                    বিশ্ববিদ্যালয়
                  </span>
                  <span className="font-mono bg-white px-2 py-0.5 rounded border border-orange-200 text-zinc-700 text-xs">
                    DIU
                  </span>
                </div>
                <p className="text-sm font-bold text-zinc-900 mt-2 font-['Hind_Siliguri',sans-serif]">
                  ড্যাফোডিল ইন্টারন্যাশনাল ইউনিভার্সিটি
                </p>
                <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white border border-orange-200 text-xs font-bold text-orange-800 font-['Hind_Siliguri',sans-serif]">
                  <BrainCircuit size={14} className="text-orange-600" />
                  <span>সফটওয়্যার ইঞ্জিনিয়ারিং (Software Engineering)</span>
                </div>
              </div>

              {/* Roles & Experience Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-white border border-orange-200 rounded-2xl p-3.5 shadow-xs">
                  <div className="flex items-center gap-2 text-xs font-bold text-orange-700 font-['Hind_Siliguri',sans-serif]">
                    <Sparkles size={14} className="text-orange-600" />
                    <span>প্রতিষ্ঠাতা ও পরিচালক</span>
                  </div>
                  <p className="text-sm font-bold text-zinc-900 mt-1 font-['Hind_Siliguri',sans-serif]">
                    সামনাদ একাডেমি
                  </p>
                  <p className="text-xs text-zinc-500 mt-0.5 font-['Hind_Siliguri',sans-serif]">
                    Founder, Samnad Academy
                  </p>
                </div>

                <div className="bg-white border border-orange-200 rounded-2xl p-3.5 shadow-xs">
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-700 font-['Hind_Siliguri',sans-serif]">
                    <Target size={14} className="text-amber-600" />
                    <span>মেন্টরশিপ</span>
                  </div>
                  <p className="text-sm font-bold text-zinc-900 mt-1 font-['Hind_Siliguri',sans-serif]">
                    মেন্টর, শেখার সিড়ি
                  </p>
                  <p className="text-xs text-zinc-500 mt-0.5 font-['Hind_Siliguri',sans-serif]">
                    Mentor, Shekhar Shiri
                  </p>
                </div>
              </div>
            </div>

            {/* Philosophy / Vision */}
            <div className="bg-orange-100/70 border border-orange-200 rounded-2xl p-4 mb-6">
              <p className="text-xs text-zinc-800 font-['Hind_Siliguri',sans-serif] leading-relaxed">
                💡 <span className="font-bold text-orange-900">দিকনির্দেশনা ও লক্ষ্য:</span> সফটওয়্যার ইঞ্জিনিয়ারিং ও টেকনোলজির আধুনিক ধারণার সাথে অ্যাকাডেমিক শিক্ষার নিখুঁত সমন্বয় ঘটিয়ে শিক্ষার্থীদের স্কিল ও ক্যারিয়ার গঠনে নিরলসভাবে কাজ করে যাওয়া।
              </p>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  setIsSamiulModalOpen(false);
                  handlePreRegister();
                }}
                className="flex-1 py-3 rounded-xl font-bold text-xs sm:text-sm bg-orange-500 hover:bg-orange-600 text-white text-center transition-all shadow-md font-['Hind_Siliguri',sans-serif] cursor-pointer"
              >
                প্রি-রেজিস্ট্রেশন করুন ➔
              </button>
              <button
                onClick={() => setIsSamiulModalOpen(false)}
                className="px-5 py-3 rounded-xl text-xs font-semibold bg-zinc-100 hover:bg-zinc-200 text-zinc-700 transition-colors font-['Hind_Siliguri',sans-serif] cursor-pointer"
              >
                বন্ধ করুন
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1.2 Abu Saleh Suja Educational Profile Modal                              */}
      {/* ========================================================================= */}
      {isSujaModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-lg bg-white border-2 border-orange-400 rounded-3xl p-6 sm:p-8 shadow-2xl text-left overflow-hidden max-h-[90vh] overflow-y-auto">
            {/* Close button */}
            <button
              onClick={() => setIsSujaModalOpen(false)}
              id="close-suja-modal-btn"
              className="absolute top-4 right-4 p-2 rounded-xl bg-orange-50 text-zinc-500 hover:text-zinc-900 hover:bg-orange-100 transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>

            {/* Header with Photo & Name */}
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-2xl p-1 bg-gradient-to-br from-emerald-400 via-teal-400 to-orange-500 shrink-0 shadow-md shadow-orange-500/20">
                <img
                  src="https://res.cloudinary.com/drvyjj7td/image/upload/v1789229348/518363223_1616327812659453_3831296542395096165_n_1_fak2cg.jpg"
                  alt="আবু সালেহ সুজা"
                  className="w-full h-full object-cover rounded-[12px]"
                />
              </div>
              <div>
                <h3 className="text-xl font-bold text-zinc-900 font-['Hind_Siliguri',sans-serif]">
                  আবু সালেহ সুজা
                </h3>
                <p className="text-xs text-emerald-700 font-bold font-['Hind_Siliguri',sans-serif]">
                  ফার্মেসি বিভাগ
                </p>
                <p className="text-[12px] text-zinc-700 font-bold mt-0.5 font-['Hind_Siliguri',sans-serif]">
                  মওলানা ভাসানী বিজ্ঞান ও প্রযুক্তি বিশ্ববিদ্যালয় (MBSTU)
                </p>
              </div>
            </div>

            {/* Detailed Academic & Admission Success */}
            <div className="space-y-3 mb-6">
              <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-wider font-mono flex items-center gap-1.5">
                <GraduationCap size={16} className="text-orange-600" />
                <span>বর্তমান অধ্যয়ন ও ভর্তি পরীক্ষার সাফল্য:</span>
              </h4>

              {/* Current University */}
              <div className="bg-emerald-50/80 border border-emerald-200 rounded-2xl p-4">
                <div className="flex items-center justify-between text-xs font-bold text-emerald-800 font-['Hind_Siliguri',sans-serif]">
                  <span className="flex items-center gap-1.5">
                    <School size={15} className="text-emerald-600" />
                    বর্তমান অধ্যয়ন (চলমান)
                  </span>
                  <span className="font-mono bg-white px-2 py-0.5 rounded border border-emerald-200 text-zinc-700 text-xs">
                    MBSTU
                  </span>
                </div>
                <p className="text-sm font-bold text-zinc-900 mt-2 font-['Hind_Siliguri',sans-serif]">
                  মওলানা ভাসানী বিজ্ঞান ও প্রযুক্তি বিশ্ববিদ্যালয়
                </p>
                <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white border border-emerald-200 text-xs font-bold text-emerald-800 font-['Hind_Siliguri',sans-serif]">
                  <BrainCircuit size={14} className="text-emerald-600" />
                  <span>ফার্মেসি বিভাগ (Department of Pharmacy)</span>
                </div>
              </div>

              {/* GST Merit Rank */}
              <div className="bg-orange-50/90 border border-orange-200 rounded-2xl p-4 shadow-xs">
                <div className="flex items-center justify-between text-xs font-bold text-orange-800 font-['Hind_Siliguri',sans-serif]">
                  <span className="flex items-center gap-1.5">
                    <Target size={15} className="text-orange-600" />
                    গুচ্ছ ভর্তি পরীক্ষা (GST Admission)
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-orange-100 text-orange-800 font-mono font-bold text-xs border border-orange-300">
                    মেধাক্রম: ৫১ তম (Rank: 51)
                  </span>
                </div>
                <p className="text-xs text-zinc-600 mt-1 font-['Hind_Siliguri',sans-serif]">
                  সেশন: ২০২৪-২০২৫ শিক্ষাবর্ষ
                </p>
              </div>

              {/* Other admission offers */}
              <div className="space-y-2">
                <p className="text-xs font-bold text-zinc-600 font-['Hind_Siliguri',sans-serif]">
                  অন্যান্য শীর্ষ বিশ্ববিদ্যালয়ে সুযোগপ্রাপ্ত বিভাগসমূহ:
                </p>
                
                <div className="bg-white border border-zinc-200 rounded-2xl p-3.5 shadow-xs flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-zinc-900 font-['Hind_Siliguri',sans-serif]">
                      বোটানি (Botany) • জগন্নাথ বিশ্ববিদ্যালয়
                    </p>
                    <p className="text-[11px] text-zinc-500 font-['Hind_Siliguri',sans-serif]">
                      ২০২৪-২০২৫ সেশন
                    </p>
                  </div>
                  <span className="text-[11px] font-semibold text-zinc-500 bg-zinc-100 px-2 py-0.5 rounded">
                    JnU
                  </span>
                </div>

                <div className="bg-white border border-zinc-200 rounded-2xl p-3.5 shadow-xs flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-zinc-900 font-['Hind_Siliguri',sans-serif]">
                      এগ্রিকালচার (Agriculture) • কুড়িগ্রাম কৃষি বিশ্ববিদ্যালয়
                    </p>
                    <p className="text-[11px] text-zinc-500 font-['Hind_Siliguri',sans-serif]">
                      ২০২৪-২০২৫ সেশন
                    </p>
                  </div>
                  <span className="text-[11px] font-semibold text-zinc-500 bg-zinc-100 px-2 py-0.5 rounded">
                    KAU
                  </span>
                </div>
              </div>
            </div>

            {/* Philosophy / Message */}
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 mb-6">
              <p className="text-xs text-zinc-800 font-['Hind_Siliguri',sans-serif] leading-relaxed">
                💡 <span className="font-bold text-emerald-900">ভর্তি পরীক্ষার গাইডলাইন:</span> গুচ্ছ ও প্রযুক্তি বিশ্ববিদ্যালয়ে শীর্ষ তালিকায় উত্তীর্ণ হওয়ার জন্য বিষয়ভিত্তিক নিখুঁত শর্টকাট, টাইপ সলভিং এবং নেগেটিভ মার্কিং কন্ট্রোলের মাধ্যমে সেরা সাফল্য নিশ্চিত করা সম্ভব।
              </p>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  setIsSujaModalOpen(false);
                  handlePreRegister();
                }}
                className="flex-1 py-3 rounded-xl font-bold text-xs sm:text-sm bg-orange-500 hover:bg-orange-600 text-white text-center transition-all shadow-md font-['Hind_Siliguri',sans-serif] cursor-pointer"
              >
                প্রি-রেজিস্ট্রেশন করুন ➔
              </button>
              <button
                onClick={() => setIsSujaModalOpen(false)}
                className="px-5 py-3 rounded-xl text-xs font-semibold bg-zinc-100 hover:bg-zinc-200 text-zinc-700 transition-colors font-['Hind_Siliguri',sans-serif] cursor-pointer"
              >
                বন্ধ করুন
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1.3 Mishkat Sharif Mithen Educational Profile Modal                       */}
      {/* ========================================================================= */}
      {isMithenModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-lg bg-white border-2 border-orange-400 rounded-3xl p-6 sm:p-8 shadow-2xl text-left overflow-hidden max-h-[90vh] overflow-y-auto">
            {/* Close button */}
            <button
              onClick={() => setIsMithenModalOpen(false)}
              id="close-mithen-modal-btn"
              className="absolute top-4 right-4 p-2 rounded-xl bg-orange-50 text-zinc-500 hover:text-zinc-900 hover:bg-orange-100 transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>

            {/* Header with Photo & Name */}
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-2xl p-1 bg-gradient-to-br from-blue-400 via-indigo-400 to-orange-500 shrink-0 shadow-md shadow-orange-500/20">
                <img
                  src="https://res.cloudinary.com/drvyjj7td/image/upload/v1789229549/mithen10_nrizvj.png"
                  alt="মিশকাত শরীফ মিথেন"
                  className="w-full h-full object-cover rounded-[12px]"
                />
              </div>
              <div>
                <h3 className="text-xl font-bold text-zinc-900 font-['Hind_Siliguri',sans-serif]">
                  মিশকাত শরীফ মিথেন
                </h3>
                <p className="text-xs text-orange-600 font-bold font-['Hind_Siliguri',sans-serif]">
                  ফাউন্ডারঃ মিথেন প্রাইভেট হোম
                </p>
                <p className="text-[12px] text-zinc-700 font-bold mt-0.5 font-['Hind_Siliguri',sans-serif]">
                  বেগম রোকেয়া বিশ্ববিদ্যালয় (BRUR)
                </p>
              </div>
            </div>

            {/* Detailed Academic Credentials */}
            <div className="space-y-3 mb-6">
              <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-wider font-mono flex items-center gap-1.5">
                <GraduationCap size={16} className="text-orange-600" />
                <span>বিস্তারিত শিক্ষাগত তথ্য ও ফলাফল:</span>
              </h4>

              {/* Current University */}
              <div className="bg-blue-50/80 border border-blue-200 rounded-2xl p-4">
                <div className="flex items-center justify-between text-xs font-bold text-blue-800 font-['Hind_Siliguri',sans-serif]">
                  <span className="flex items-center gap-1.5">
                    <School size={15} className="text-blue-600" />
                    বিশ্ববিদ্যালয় (অধ্যয়নরত)
                  </span>
                  <span className="font-mono bg-white px-2 py-0.5 rounded border border-blue-200 text-zinc-700 text-xs">
                    BRUR
                  </span>
                </div>
                <p className="text-sm font-bold text-zinc-900 mt-2 font-['Hind_Siliguri',sans-serif]">
                  বেগম রোকেয়া বিশ্ববিদ্যালয়, রংপুর
                </p>
              </div>

              {/* Central University Opportunity */}
              <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-3.5 shadow-xs">
                <div className="flex items-center justify-between text-xs font-bold text-amber-900 font-['Hind_Siliguri',sans-serif]">
                  <span>ভর্তি পরীক্ষায় সুযোগপ্রাপ্ত বিভাগ</span>
                  <span className="text-[11px] font-semibold text-amber-700 bg-white px-2 py-0.5 rounded border border-amber-200">
                    সেশন: ২০২৪-২০২৫
                  </span>
                </div>
                <p className="text-sm font-bold text-zinc-900 mt-1 font-['Hind_Siliguri',sans-serif]">
                  ডিপার্টমেন্ট অব ম্যাথমেটিক্স (Mathematics)
                </p>
                <p className="text-xs text-zinc-600 font-['Hind_Siliguri',sans-serif]">
                  ঢাকা সেন্ট্রাল ইউনিভার্সিটি, বাংলা কলেজ ক্যাম্পাস
                </p>
              </div>

              {/* HSC Result */}
              <div className="bg-white border border-orange-200 rounded-2xl p-3.5 shadow-xs">
                <div className="flex items-center justify-between text-xs font-bold text-zinc-800 font-['Hind_Siliguri',sans-serif]">
                  <span>উচ্চ মাধ্যমিক (HSC)</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-mono font-bold text-[11px] border border-emerald-300">
                    জিপিএ ৫.০০ (GPA 5.00)
                  </span>
                </div>
                <p className="text-sm font-bold text-zinc-900 mt-1 font-['Hind_Siliguri',sans-serif]">
                  বিজ্ঞান বিভাগ • দিনাজপুর শিক্ষা বোর্ড
                </p>
                <p className="text-xs text-zinc-500 mt-0.5 font-mono">
                  পাসের সন: ২০২৪
                </p>
              </div>

              {/* SSC Result */}
              <div className="bg-white border border-orange-200 rounded-2xl p-3.5 shadow-xs">
                <div className="flex items-center justify-between text-xs font-bold text-zinc-800 font-['Hind_Siliguri',sans-serif]">
                  <span>মাধ্যমিক (SSC)</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-mono font-bold text-[11px] border border-emerald-300">
                    জিপিএ ৫.০০ (GPA 5.00)
                  </span>
                </div>
                <p className="text-sm font-bold text-zinc-900 mt-1 font-['Hind_Siliguri',sans-serif]">
                  বিজ্ঞান বিভাগ • দিনাজপুর শিক্ষা বোর্ড
                </p>
                <p className="text-xs text-zinc-500 mt-0.5 font-mono">
                  পাসের সন: ২০২২
                </p>
              </div>
            </div>

            {/* Philosophy / Message */}
            <div className="bg-orange-100/70 border border-orange-200 rounded-2xl p-4 mb-6">
              <p className="text-xs text-zinc-800 font-['Hind_Siliguri',sans-serif] leading-relaxed">
                💡 <span className="font-bold text-orange-900">টিচিং ফিলোসফি:</span> গণিত ও বিজ্ঞানের কনসেপ্টগুলোকে জটিল নিয়মের মধ্যে সীমাবদ্ধ না রেখে প্র্যাকটিক্যাল লজিক ও সহজ ট্রিকসের মাধ্যমে শিক্ষার্থীদের কাছে আকর্ষণীয় করে তোলা।
              </p>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  setIsMithenModalOpen(false);
                  handlePreRegister();
                }}
                className="flex-1 py-3 rounded-xl font-bold text-xs sm:text-sm bg-orange-500 hover:bg-orange-600 text-white text-center transition-all shadow-md font-['Hind_Siliguri',sans-serif] cursor-pointer"
              >
                প্রি-রেজিস্ট্রেশন করুন ➔
              </button>
              <button
                onClick={() => setIsMithenModalOpen(false)}
                className="px-5 py-3 rounded-xl text-xs font-semibold bg-zinc-100 hover:bg-zinc-200 text-zinc-700 transition-colors font-['Hind_Siliguri',sans-serif] cursor-pointer"
              >
                বন্ধ করুন
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1e. Swocchol Kumar Karmokar Profile Modal                                 */}
      {/* ========================================================================= */}
      {isSwoccholModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-lg bg-white border-2 border-orange-400 rounded-3xl p-6 sm:p-8 shadow-2xl text-left overflow-hidden max-h-[90vh] overflow-y-auto">
            {/* Close Button */}
            <button
              onClick={() => setIsSwoccholModalOpen(false)}
              id="close-swocchol-modal-btn"
              className="absolute top-4 right-4 p-2 rounded-xl bg-orange-50 text-zinc-500 hover:text-zinc-900 hover:bg-orange-100 transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>

            {/* Header info */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 mb-6">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl p-1 bg-gradient-to-br from-orange-400 via-amber-400 to-red-500 shadow-md shrink-0">
                <img
                  src="https://res.cloudinary.com/drvyjj7td/image/upload/v1789231884/swocchol_uxtt4r.png"
                  alt="স্বচ্ছল কুমার কর্মকার"
                  className="w-full h-full object-cover rounded-[14px]"
                />
              </div>
              <div className="text-center sm:text-left flex-1">
                <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-orange-100 text-orange-800 mb-1">
                  <ShieldCheck size={13} />
                  <span>মেন্টর প্যানেল</span>
                </div>
                <h3 className="text-2xl font-black text-zinc-900 font-['Hind_Siliguri',sans-serif]">
                  স্বচ্ছল কুমার কর্মকার
                </h3>
                <p className="text-xs sm:text-sm font-bold text-orange-600 font-['Hind_Siliguri',sans-serif] mt-0.5">
                  কম্পিউটার সাইন্স এন্ড ইঞ্জিনিয়ারিং (CSE)
                </p>
                <p className="text-xs text-zinc-600 font-['Hind_Siliguri',sans-serif] flex items-center justify-center sm:justify-start gap-1 mt-1">
                  <School size={14} className="text-orange-600 shrink-0" />
                  <span>ইউনাইটেড ইন্টারন্যাশনাল ইউনিভার্সিটি (UIU)</span>
                </p>
              </div>
            </div>

            {/* Education & Info Details */}
            <div className="space-y-3 mb-6">
              <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-wider font-mono flex items-center gap-1.5">
                <GraduationCap size={16} className="text-orange-600" />
                <span>বিস্তারিত তথ্য ও পরিচিতি:</span>
              </h4>

              {/* Current University */}
              <div className="bg-orange-50/80 border border-orange-200 rounded-2xl p-4">
                <div className="flex items-center justify-between text-xs font-bold text-orange-900 font-['Hind_Siliguri',sans-serif]">
                  <span className="flex items-center gap-1.5">
                    <School size={15} className="text-orange-600" />
                    বিশ্ববিদ্যালয় (অনার্স অধ্যয়নরত)
                  </span>
                  <span className="font-mono bg-white px-2 py-0.5 rounded border border-orange-200 text-zinc-700 text-xs">
                    UIU
                  </span>
                </div>
                <p className="text-sm font-bold text-zinc-900 mt-2 font-['Hind_Siliguri',sans-serif]">
                  ইউনাইটেড ইন্টারন্যাশনাল ইউনিভার্সিটি (UIU)
                </p>
                <p className="text-xs text-zinc-600 font-['Hind_Siliguri',sans-serif] mt-0.5">
                  বিভাগ: কম্পিউটার সাইন্স এন্ড ইঞ্জিনিয়ারিং (CSE)
                </p>
              </div>

              {/* Focus Areas */}
              <div className="bg-white border border-zinc-200 rounded-2xl p-3.5 shadow-xs">
                <div className="flex items-center justify-between text-xs font-bold text-zinc-800 font-['Hind_Siliguri',sans-serif] mb-1">
                  <span>ফোকাস এরিয়া ও মেন্টরশিপ</span>
                  <span className="px-2 py-0.5 rounded bg-orange-100 text-orange-800 font-mono text-[10px] font-bold">
                    CSE & Math
                  </span>
                </div>
                <p className="text-xs text-zinc-600 font-['Hind_Siliguri',sans-serif] leading-relaxed">
                  কম্পিউটার সায়েন্সের বেসিক কনসেপ্ট, লজিক্যাল প্রোগ্রামিং, অ্যালগরিদম ও আধুনিক তথ্যপ্রযুক্তি শিক্ষায় শিক্ষার্থীদের গাইডেন্স প্রদান।
                </p>
              </div>
            </div>

            {/* Philosophy / Message */}
            <div className="bg-orange-100/70 border border-orange-200 rounded-2xl p-4 mb-6">
              <p className="text-xs text-zinc-800 font-['Hind_Siliguri',sans-serif] leading-relaxed">
                💡 <span className="font-bold text-orange-900">টিচিং ফিলোসফি:</span> কম্পিউটার বিজ্ঞানের জটিল বিষয় এবং লজিক্যাল চিন্তাভাবনাকে বাস্তব উদাহরণ ও হ্যান্ডস-অন অনুশীলনের মাধ্যমে সহজভাবে পৌঁছে দেওয়া।
              </p>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  setIsSwoccholModalOpen(false);
                  navigateTo('/classroom/swocchol');
                }}
                className="flex-1 py-3 rounded-xl font-bold text-xs sm:text-sm bg-orange-500 hover:bg-orange-600 text-white text-center transition-all shadow-md font-['Hind_Siliguri',sans-serif] cursor-pointer"
              >
                পূর্ণাঙ্গ প্রোফাইল লিংক ➔
              </button>
              <button
                onClick={() => setIsSwoccholModalOpen(false)}
                className="px-5 py-3 rounded-xl text-xs font-semibold bg-zinc-100 hover:bg-zinc-200 text-zinc-700 transition-colors font-['Hind_Siliguri',sans-serif] cursor-pointer"
              >
                বন্ধ করুন
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. Article Reader Modal (Blog detail view)                                */}
      {/* ========================================================================= */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-lg bg-white border-2 border-orange-400 rounded-3xl p-6 sm:p-8 shadow-2xl text-left overflow-hidden max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedArticle(null)}
              className="absolute top-4 right-4 p-2 rounded-xl bg-orange-50 text-zinc-500 hover:text-zinc-900 hover:bg-orange-100 transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-2 text-xs font-bold text-orange-700 mb-3 font-['Hind_Siliguri',sans-serif]">
              <span className="px-2.5 py-0.5 rounded-md bg-orange-100 border border-orange-200">
                {selectedArticle.category}
              </span>
              <span>•</span>
              <span className="text-zinc-500">{selectedArticle.readTime}</span>
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-zinc-900 font-['Hind_Siliguri',sans-serif] mb-4 leading-snug">
              {selectedArticle.title}
            </h3>

            <div className="space-y-3.5 text-xs sm:text-sm text-zinc-700 font-['Hind_Siliguri',sans-serif] leading-relaxed mb-6">
              {selectedArticle.content.map((p, idx) => (
                <p key={idx} className="bg-orange-50/40 p-3 rounded-xl border border-orange-100">
                  {p}
                </p>
              ))}
            </div>

            <button
              onClick={() => setSelectedArticle(null)}
              className="w-full py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-orange-500 text-white font-['Hind_Siliguri',sans-serif]"
            >
              পড়া শেষ হয়েছে (বন্ধ করুন)
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. Pre-Registration Modal (NO WhatsApp, purely direct student form)        */}
      {/* ========================================================================= */}
      {isRegisterModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-md bg-white border-2 border-orange-300 rounded-3xl p-6 sm:p-8 shadow-2xl text-left">
            <button
              onClick={() => setIsRegisterModalOpen(false)}
              id="close-register-modal-btn"
              className="absolute top-4 right-4 p-2 rounded-xl bg-orange-50 text-zinc-500 hover:text-zinc-900 hover:bg-orange-100 transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>

            {!formSubmitted ? (
              <div>
                <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center mb-3">
                  <Sparkles size={20} />
                </div>
                <h3 className="text-xl font-bold text-zinc-900 font-['Hind_Siliguri',sans-serif]">
                  অগ্রিম প্রি-রেজিস্ট্রেশন
                </h3>
                <p className="text-xs text-zinc-600 mt-1 mb-5 font-['Hind_Siliguri',sans-serif]">
                  কোনো ফি ছাড়াই আপনার পছন্দের ব্যাচে নাম অন্তর্ভুক্ত করুন।
                </p>

                <form onSubmit={submitRegistration} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 mb-1.5 font-['Hind_Siliguri',sans-serif]">
                      আপনার পূর্ণ নাম:
                    </label>
                    <div className="relative">
                      <User size={15} className="absolute left-3.5 top-3 text-zinc-400" />
                      <input
                        type="text"
                        required
                        value={studentName}
                        onChange={(e) => setStudentName(e.target.value)}
                        placeholder="যেমন: সাকিব আহমেদ"
                        className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-white border border-zinc-300 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 focus:outline-none text-zinc-900 text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 mb-1.5 font-['Hind_Siliguri',sans-serif]">
                      মোবাইল নম্বর:
                    </label>
                    <div className="relative">
                      <Phone size={15} className="absolute left-3.5 top-3 text-zinc-400" />
                      <input
                        type="tel"
                        required
                        value={studentPhone}
                        onChange={(e) => setStudentPhone(e.target.value)}
                        placeholder="01XXXXXXXXX"
                        className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-white border border-zinc-300 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 focus:outline-none text-zinc-900 text-sm font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 mb-1.5 font-['Hind_Siliguri',sans-serif]">
                      পছন্দের ব্যাচ বা ক্লাস:
                    </label>
                    <div className="relative">
                      <select
                        value={studentClass}
                        onChange={(e) => setStudentClass(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-zinc-300 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 focus:outline-none text-zinc-900 text-xs sm:text-sm font-['Hind_Siliguri',sans-serif]"
                      >
                        <option value="ভার্সিটি এডমিশন স্মার্ট এক্সাম ব্যাচ">ভার্সিটি এডমিশন স্মার্ট এক্সাম ব্যাচ</option>
                        <option value="ভার্সিটি এডমিশন 'ক' ইউনিট (বিজ্ঞান)">ভার্সিটি এডমিশন 'ক' ইউনিট (বিজ্ঞান)</option>
                        <option value="ভার্সিটি এডমিশন 'খ' ইউনিট (মানবিক/বিভাগ পরিবর্তন)">ভার্সিটি এডমিশন 'খ' ইউনিট (মানবিক/বিভাগ পরিবর্তন)</option>
                        <option value="এইচএসসি আইসিটি স্পেশাল মাস্টার ব্যাচ">এইচএসসি আইসিটি স্পেশাল মাস্টার ব্যাচ</option>
                        <option value="এইচএসসি বাংলা ও ইংরেজি স্পেশাল কেয়ার">এইচএসসি বাংলা ও ইংরেজি স্পেশাল কেয়ার</option>
                        <option value="এইচএসসি বিজ্ঞান একাডেমিক ও টেস্ট পেপার ব্যাচ">এইচএসসি বিজ্ঞান একাডেমিক ও টেস্ট পেপার ব্যাচ</option>
                        <option value="এসএসসি একাডেমিক ও স্মার্ট এক্সাম ব্যাচ">এসএসসি একাডেমিক ও স্মার্ট এক্সাম ব্যাচ</option>
                        <option value="জুনিয়র ম্যাথ ও সাইন্স ফাউন্ডেশন (৬-৮)">জুনিয়র ম্যাথ ও সাইন্স ফাউন্ডেশন (৬-৮)</option>
                        <option value="ফিউচার স্কিলস (গ্রাফিক্স ও এআই)">ফিউচার স্কিলস (গ্রাফিক্স ও এআই)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-700 mb-1.5 font-['Hind_Siliguri',sans-serif]">
                      কোনো প্রশ্ন বা মেসেজ (ঐচ্ছিক):
                    </label>
                    <textarea
                      rows={2}
                      value={studentMessage}
                      onChange={(e) => setStudentMessage(e.target.value)}
                      placeholder="আপনার কোনো জিজ্ঞাসা থাকলে লিখতে পারেন..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-zinc-300 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 focus:outline-none text-zinc-900 text-xs sm:text-sm font-['Hind_Siliguri',sans-serif] resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 rounded-xl font-bold text-sm bg-orange-500 hover:bg-orange-600 disabled:opacity-75 text-white shadow-lg shadow-orange-500/25 transition-all font-['Hind_Siliguri',sans-serif] cursor-pointer active:scale-98 flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>জমা হচ্ছে...</span>
                      </>
                    ) : (
                      <span>নাম জমা দিন (Submit) ➔</span>
                    )}
                  </button>
                </form>
              </div>
            ) : (
              <div className="text-center py-4">
                <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 border border-emerald-300 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 size={32} />
                </div>
                <h3 className="text-xl font-bold text-zinc-900 font-['Hind_Siliguri',sans-serif] mb-2">
                  তথ্য সফলভাবে জমা হয়েছে!
                </h3>
                <p className="text-xs text-zinc-600 font-['Hind_Siliguri',sans-serif] mb-6 leading-relaxed">
                  ধন্যবাদ, <span className="font-bold text-zinc-900">{studentName}</span>। আপনার প্রি-রেজিস্ট্রেশন নথিভুক্ত করা হয়েছে। ব্যাচ চালুর সময় আপনার দেওয়া নম্বরে যোগাযোগ করে বিস্তারিত জানিয়ে দেওয়া হবে।
                </p>

                <button
                  onClick={() => setIsRegisterModalOpen(false)}
                  className="w-full py-3 rounded-xl font-bold text-xs sm:text-sm bg-orange-500 hover:bg-orange-600 text-white transition-all shadow-md font-['Hind_Siliguri',sans-serif] cursor-pointer"
                >
                  ঠিক আছে (সম্পন্ন)
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. Dedicated Classroom Admin Modal (Completely separate from portfolio)   */}
      {/* ========================================================================= */}
      <ClassroomAdminModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
      />
    </div>
  );
};
