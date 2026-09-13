import fs from 'fs';
import path from 'path';

const distDir = path.resolve('dist');
const routes = [
  'about',
  'skills',
  'experience',
  'education',
  'blog',
  'contact',
  'wallet',
  'salami',
  'chithi',
  'classroom',
  'classroom/mahim',
  'classroom/samiul',
  'classroom/suza',
  'classroom/mithen',
  'classroom/swocchol',
  'portfolio'
];

const siteUrl = 'https://mahims.com';
const defaultOgImage = `${siteUrl}/assets/og-main.png`;
const classroomOgImage = `${siteUrl}/assets/og-classroom.jpg`;
const chithiOgImage = `${siteUrl}/assets/og-chithi.jpg`;
const salamiOgImage = `${siteUrl}/assets/og-salami.jpg`;

const routeData = {
  classroom: {
    title: "Mahim's Classroom | মাহিম ক্লাসরুম — একাডেমি, কনসেপ্ট ক্লাস ও স্মার্ট এক্সাম",
    metaTitle: "Mahim's Classroom | মাহিম ক্লাসরুম — একাডেমি ও এডমিশন প্ল্যাটফর্ম",
    description: "Mahim's Classroom (মাহিম ক্লাসরুম) - এইচএসসি, বিশ্ববিদ্যালয় ভর্তি প্রস্তুতি ও এসএসসি শিক্ষার্থীদের জন্য নিবেদিত অনলাইন শিক্ষা প্ল্যাটফর্ম। কনসেপ্ট ক্লাস, স্মার্ট টেস্ট ইঞ্জিন ও মেন্টরশিপ। শিক্ষক প্যানেল: মাহিম (Mahim), সামিউল ইসলাম সোহরাব (Samiul Islam Sohrab), আবু সালেহ সুজা (Abu Saleh Suza), মিশকাত শরীফ মিথেন (Mishkat Sharif Mithen), স্বচ্ছল কুমার কর্মকার (Swocchol Kumar Karmokar)।",
    keywords: "Mahim's Classroom, মাহিম ক্লাসরুম, Mahims Classroom, Mahim Classroom, মাহিমস ক্লাসরুম, mahim classroom, mahims.com/classroom, মাহিম, Mahim Ibne Khudi, সামিউল ইসলাম সোহরাব, Samiul Islam Sohrab, আবু সালেহ সুজা, Abu Saleh Suza, মিশকাত শরীফ মিথেন, Mishkat Sharif Mithen, স্বচ্ছল কুমার কর্মকার, Swocchol Kumar Karmokar, এইচএসসি আইসিটি, ভার্সিটি এডমিশন এক্সাম ব্যাচ, এসএসসি স্মার্ট এক্সাম",
    canonical: `${siteUrl}/classroom/`,
    ogTitle: "Mahim's Classroom | মাহিম ক্লাসরুম — একাডেমি ও এডমিশন প্ল্যাটফর্ম",
    ogDescription: "এইচএসসি ও বিশ্ববিদ্যালয় ভর্তি পরীক্ষার্থীদের জন্য নিবেদিত শিক্ষা প্ল্যাটফর্ম। স্মার্ট টেস্ট ইঞ্জিন, নিয়মিত কুইজ ও কনসেপ্ট ক্লাস।",
    ogImage: classroomOgImage,
    twitterTitle: "Mahim's Classroom | মাহিম ক্লাসরুম — একাডেমি ও এডমিশন প্ল্যাটফর্ম",
    twitterDescription: "এইচএসসি ও বিশ্ববিদ্যালয় ভর্তি পরীক্ষার্থীদের জন্য স্মার্ট অনলাইন টেস্ট প্ল্যাটফর্ম ও একাডেমি।",
    twitterImage: classroomOgImage,
    jsonLd: {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "হোম (Home)", "item": "https://mahims.com/" },
            { "@type": "ListItem", "position": 2, "name": "মাহিম’স ক্লাসরুম (Mahim's Classroom)", "item": "https://mahims.com/classroom/" }
          ]
        },
        {
          "@type": "EducationalOrganization",
          "@id": "https://mahims.com/classroom#organization",
          "name": "Mahim's Classroom",
          "alternateName": ["মাহিম ক্লাসরুম", "Mahims Classroom", "Mahim Classroom", "মাহিম’স ক্লাসরুম"],
          "url": "https://mahims.com/classroom/",
          "logo": "https://mahims.com/logo.png",
          "image": classroomOgImage,
          "description": "অনলাইন ভিত্তিক কনসেপ্ট ক্লাস, এইচএসসি আইসিটি, ভার্সিটি এডমিশন টেস্ট সিরিজ এবং নিয়মিত অ্যাকাডেমিক মেন্টরশিপ প্ল্যাটফর্ম।",
          "founder": {
            "@type": "Person",
            "name": "Mahim Ibne Khudi",
            "alternateName": ["মাহিম", "মাহিম ইবনে খুদি", "Mahim"],
            "alumniOf": "Dhaka Central University",
            "url": "https://mahims.com/classroom/mahim/"
          },
          "alumni": [
            { "@type": "Person", "name": "আবু সালেহ সুজা (Abu Saleh Suza)", "url": "https://mahims.com/classroom/suza/" },
            { "@type": "Person", "name": "সামিউল ইসলাম সোহরাব (Samiul Islam Sohrab)", "url": "https://mahims.com/classroom/samiul/" },
            { "@type": "Person", "name": "মিশকাত শরীফ মিথেন (Mishkat Sharif Mithen)", "url": "https://mahims.com/classroom/mithen/" },
            { "@type": "Person", "name": "স্বচ্ছল কুমার কর্মকার (Swocchol Kumar Karmokar)", "url": "https://mahims.com/classroom/swocchol/" }
          ]
        },
        {
          "@type": "Course",
          "name": "ভার্সিটি এডমিশন স্মার্ট এক্সাম ব্যাচ",
          "description": "অনলাইন লাইভ কুইজ, নেগেটিভ মার্কিং ট্র্যাকিং, ইনস্ট্যান্ট মেরিট লিস্ট এবং বিগত ২০ বছরের প্রশ্ন এনালাইসিস ভিত্তিক পূর্ণাঙ্গ এক্সাম সিরিজ।",
          "provider": {
            "@type": "EducationalOrganization",
            "name": "Mahim's Classroom",
            "url": "https://mahims.com/classroom/"
          }
        },
        {
          "@type": "FAQPage",
          "mainEntity": [
            {
              "@type": "Question",
              "name": "মাহিম’স ক্লাসরুম (Mahim's Classroom) কী?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "মাহিম’স ক্লাসরুম হলো মাহিম ইবনে খুদি প্রতিষ্ঠিত একটি আধুনিক অনলাইন শিক্ষামূলক প্ল্যাটফর্ম যা এইচএসসি, এসএসসি এবং বিশ্ববিদ্যালয় ভর্তি পরীক্ষার্থীদের জন্য কনসেপ্ট ক্লাস, মডেল টেস্ট এবং মেন্টরশিপ প্রদান করে।"
              }
            },
            {
              "@type": "Question",
              "name": "এখানে কীভাবে রেজিস্ট্রেশন করা যাবে?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "mahims.com/classroom এ গিয়ে পছন্দসই কোর্স বা এক্সাম ব্যাচে 'রেজিস্ট্রেশন করুন' বাটনে ক্লিক করে নাম ও তথ্য দিয়ে সরাসরি যুক্ত হওয়া যায়।"
              }
            }
          ]
        }
      ]
    },
    prerenderHtml: `
      <div class="min-h-screen bg-[#fafaf9] text-zinc-900 font-sans">
        <header class="border-b border-zinc-200 bg-white/90 backdrop-blur-md sticky top-0 z-20">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
            <a href="/" class="flex items-center gap-3">
              <span class="w-9 h-9 rounded-xl bg-orange-500 text-white flex items-center justify-center font-bold text-lg">M</span>
              <div>
                <span class="font-black text-lg block leading-tight text-zinc-950">Mahim's Classroom</span>
                <span class="text-xs text-orange-600 font-semibold">মাহিম ক্লাসরুম — একাডেমি ও এডমিশন প্ল্যাটফর্ম</span>
              </div>
            </a>
            <a href="/" class="text-xs font-bold px-3 py-1.5 rounded-lg border border-zinc-300 text-zinc-700 hover:bg-zinc-100">হোমে ফিরুন</a>
          </div>
        </header>
        
        <main class="max-w-5xl mx-auto px-4 py-12">
          <section class="text-center space-y-4 mb-14">
            <span class="inline-block px-3 py-1 rounded-full text-xs font-bold bg-orange-100 text-orange-800 border border-orange-200">এডমিশন ও একাডেমি স্পেশাল</span>
            <h1 class="text-3xl sm:text-5xl font-black text-zinc-950 tracking-tight">Mahim's Classroom (মাহিম ক্লাসরুম)</h1>
            <p class="text-base sm:text-lg text-zinc-600 max-w-3xl mx-auto leading-relaxed">
              এইচএসসি, এসএসসি ও বিশ্ববিদ্যালয় ভর্তি প্রস্তুতি পরীক্ষার্থীদের জন্য নির্ভরযোগ্য শিক্ষা উদ্যোগ। কনসেপ্ট ভিত্তিক পাঠদান, স্মার্ট অনলাইন এক্সাম প্ল্যাটফর্ম ও নিয়মিত অ্যাকাডেমিক মেন্টরশিপ।
            </p>
          </section>

          <section class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
            <article class="p-6 rounded-2xl bg-white border border-zinc-200 shadow-xs space-y-3">
              <span class="px-2.5 py-0.5 rounded text-xs font-bold bg-orange-50 text-orange-700 border border-orange-200">এক্সাম সিরিজ</span>
              <h2 class="text-xl font-bold text-zinc-900">ভার্সিটি এডমিশন স্মার্ট এক্সাম ব্যাচ</h2>
              <p class="text-sm text-zinc-600 leading-relaxed">অনলাইন লাইভ কুইজ, নেগেটিভ মার্কিং ট্র্যাকিং, ইনস্ট্যান্ট মেরিট লিস্ট এবং বিগত ২০ বছরের প্রশ্ন এনালাইসিস ভিত্তিক এক্সাম প্ল্যাটফর্ম।</p>
              <ul class="text-xs text-zinc-600 space-y-1 pt-2 list-disc pl-4">
                <li>স্মার্ট অনলাইন এক্সাম ও টাইমার ইঞ্জিন</li>
                <li>নেগেটিভ মার্কিং ও একিউরেসি অ্যানালাইসিস</li>
                <li>চ্যাপ্টারভিত্তিক ও ফুল লেন্থ মডেল টেস্ট</li>
              </ul>
            </article>

            <article class="p-6 rounded-2xl bg-white border border-zinc-200 shadow-xs space-y-3">
              <span class="px-2.5 py-0.5 rounded text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">কনসেপ্ট ক্লাস</span>
              <h2 class="text-xl font-bold text-zinc-900">এইচএসসি আইসিটি ও বাংলা স্পেশাল</h2>
              <p class="text-sm text-zinc-600 leading-relaxed">এইচএসসি পরীক্ষার্থীদের জন্য আইসিটি (এইচটিএমএল, সি প্রোগ্রামিং, ডাটাবেস) ও বাংলা ব্যাকরণ সহজবোধ্য পাঠপরিকল্পনা।</p>
              <ul class="text-xs text-zinc-600 space-y-1 pt-2 list-disc pl-4">
                <li>প্রোগ্রামিং ও আইসিটির জটিল কনসেপ্ট সহজ ব্যাখ্যা</li>
                <li>বোর্ড প্রশ্ন সমাধান ও সৃজনশীল কৌশল</li>
                <li>নোটস ও সাজেশন প্রদান</li>
              </ul>
            </article>
          </section>

          <section class="p-8 rounded-3xl bg-zinc-900 text-white space-y-6 mb-16">
            <div class="text-center space-y-2">
              <span class="inline-block px-3 py-1 rounded-full text-xs font-bold bg-orange-500/20 text-orange-400 border border-orange-500/30">শিক্ষক ও মেন্টর প্যানেল</span>
              <h2 class="text-2xl font-bold text-white">Classroom Faculty & Mentors</h2>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
              <div class="p-5 rounded-2xl bg-zinc-800/80 border border-zinc-700 space-y-2">
                <a href="/classroom/mahim" class="text-lg font-bold text-orange-400 hover:underline">মাহিম ইবনে খুদি (Mahim Ibne Khudi)</a>
                <p class="text-xs text-zinc-300 font-semibold">ঢাকা সেন্ট্রাল ইউনিভার্সিটি • প্রতিষ্ঠাতা, মাহিম'স ক্লাসরুম</p>
                <p class="text-xs text-zinc-400 leading-relaxed">রাষ্ট্রবিজ্ঞান বিভাগ, ঢাকা কলেজ ক্যাম্পাস। শিক্ষার্থীদের একাডেমিক প্রস্তুতি ও স্মার্ট এক্সাম পদ্ধতির উদ্ভাবক।</p>
              </div>
              <div class="p-5 rounded-2xl bg-zinc-800/80 border border-zinc-700 space-y-2">
                <a href="/classroom/samiul" class="text-lg font-bold text-orange-400 hover:underline">সামিউল ইসলাম সোহরাব (Samiul Islam Sohrab)</a>
                <p class="text-xs text-zinc-300 font-semibold">ফাউন্ডার, সামনাদ একাডেমি • মেন্টর, শেখার সিড়ি</p>
                <p class="text-xs text-zinc-400 leading-relaxed">ড্যাফোডিল ইন্টারন্যাশনাল ইউনিভার্সিটি (সফটওয়্যার ইঞ্জিনিয়ারিং - DIU SWE)। স্কিল ও অ্যাকাডেমিক মেন্টরশিপ।</p>
              </div>
              <div class="p-5 rounded-2xl bg-zinc-800/80 border border-zinc-700 space-y-2">
                <a href="/classroom/suza" class="text-lg font-bold text-orange-400 hover:underline">আবু সালেহ সুজা (Abu Saleh Suja)</a>
                <p class="text-xs text-zinc-300 font-semibold">ফার্মেসি বিভাগ • মওলানা ভাসানী বিজ্ঞান ও প্রযুক্তি বিশ্ববিদ্যালয় (MBSTU)</p>
                <p class="text-xs text-zinc-400 leading-relaxed">গুচ্ছ ভর্তি পরীক্ষা ২০২৪-২৫ সেশনে ৫১তম মেধাক্রম (GST Rank 51)। জবি বোটানি ও কুড়িগ্রাম কৃষি বিশ্ববিদ্যালয়ে সুযোগপ্রাপ্ত।</p>
              </div>
              <div class="p-5 rounded-2xl bg-zinc-800/80 border border-zinc-700 space-y-2">
                <a href="/classroom/mithen" class="text-lg font-bold text-orange-400 hover:underline">মিশকাত শরীফ মিথেন (Mishkat Sharif Mithen)</a>
                <p class="text-xs text-zinc-300 font-semibold">বেগম রোকেয়া বিশ্ববিদ্যালয় (BRUR) • ফাউন্ডারঃ মিথেন প্রাইভেট হোম</p>
                <p class="text-xs text-zinc-400 leading-relaxed">ঢাকা সেন্ট্রাল ইউনিভার্সিটি গণিত বিভাগ। এসএসসি ও এইচএসসি বিজ্ঞান বিভাগে জিপিএ ৫.০০ প্রাপ্ত।</p>
              </div>
              <div class="p-5 rounded-2xl bg-zinc-800/80 border border-zinc-700 space-y-2">
                <a href="/classroom/swocchol" class="text-lg font-bold text-orange-400 hover:underline">স্বচ্ছল কুমার কর্মকার (Swocchol Kumar Karmokar)</a>
                <p class="text-xs text-zinc-300 font-semibold">কম্পিউটার সাইন্স এন্ড ইঞ্জিনিয়ারিং (UIU CSE) • ইউনাইটেড ইন্টারন্যাশনাল ইউনিভার্সিটি</p>
                <p class="text-xs text-zinc-400 leading-relaxed">প্রোগ্রামিং, অ্যালগরিদম, কম্পিউটার সাইন্স ও উচ্চতর গণিতে শিক্ষার্থীদের দক্ষ করে গড়ে তুলতে নিবেদিত মেন্টর।</p>
              </div>
            </div>
          </section>

          <section class="space-y-4">
            <h2 class="text-xl font-bold text-zinc-900 border-b pb-2">সাধারণ প্রশ্নোত্তর (FAQ)</h2>
            <div class="space-y-3">
              <div class="p-4 rounded-xl bg-white border border-zinc-200">
                <h3 class="font-bold text-sm text-zinc-900">মাহিম’স ক্লাসরুম কীভাবে কাজ করে?</h3>
                <p class="text-xs text-zinc-600 mt-1">এটি একটি ইন্টারেক্টিভ লার্নিং পোর্টাল যেখানে শিক্ষার্থীরা অনলাইনে পরীক্ষা দেয়, নিজের প্রস্তুতি যাচাই করে এবং কনসেপ্ট বিশ্লেষণমূলক দিকনির্দেশনা পায়।</p>
              </div>
              <div class="p-4 rounded-xl bg-white border border-zinc-200">
                <h3 class="font-bold text-sm text-zinc-900">পরীক্ষায় অংশ নেওয়ার নিয়ম কী?</h3>
                <p class="text-xs text-zinc-600 mt-1">কোর্স সেকশনে দেওয়া এক্সাম লিঙ্কে ক্লিক করে নির্ধারিত সময়ে টেস্টে অংশ নেওয়া যাবে এবং সাথে সাথে ফলাফল ও ভুল উত্তরের সমাধান দেখা যাবে।</p>
              </div>
            </div>
          </section>
        </main>
      </div>
    `
  },

  'classroom/mahim': {
    title: "মাহিম ইবনে খুদি (Mahim Ibne Khudi) | প্রতিষ্ঠাতা ও প্রধান মেন্টর — মাহিম'স ক্লাসরুম (Mahim's Classroom)",
    metaTitle: "Mahim Ibne Khudi (মাহিম ইবনে খুদি) — Founder & Mentor | Mahim's Classroom",
    description: "মাহিম ইবনে খুদি (Mahim Ibne Khudi) - ঢাকা সেন্ট্রাল ইউনিভার্সিটি (ঢাকা কলেজ ক্যাম্পাস)। এইচএসসি ২০২৪ ও এসএসসি ২০২২ উভয় পরীক্ষায় বিজ্ঞান বিভাগে জিপিএ ৫.০০ (দিনাজপুর শিক্ষা বোর্ড)। প্রতিষ্ঠাতা ও প্রধান মেন্টর — মাহিম'স ক্লাসরুম।",
    keywords: "মাহিম ইবনে খুদি, মাহিম, Mahim Ibne Khudi, Mahim, Mahim Khudi, Mahim's Classroom, মাহিম ক্লাসরুম, ঢাকা সেন্ট্রাল ইউনিভার্সিটি, Dhaka Central University, দিনাজপুর বোর্ড জিপিএ ৫, HSC 2024 GPA 5.00, SSC 2022 GPA 5.00, মাহিম শিক্ষক প্রোফাইল, Mahim Profile, এডমিশন মেন্টর মাহিম",
    canonical: `${siteUrl}/classroom/mahim/`,
    ogTitle: "মাহিম ইবনে খুদি (Mahim Ibne Khudi) — প্রতিষ্ঠাতা ও প্রধান মেন্টর | মাহিম'স ক্লাসরুম",
    ogDescription: "ঢাকা সেন্ট্রাল ইউনিভার্সিটি (ঢাকা কলেজ ক্যাম্পাস) | বিজ্ঞান বিভাগ থেকে এসএসসি ও এইচএসসি উভয় পরীক্ষায় জিপিএ ৫.০০ (দিনাজপুর শিক্ষা বোর্ড) | প্রতিষ্ঠাতা ও প্রধান মেন্টর — মাহিম'স ক্লাসরুম।",
    ogImage: "https://res.cloudinary.com/drvyjj7td/image/upload/v1788708908/behance_pp_spfumh.jpg",
    twitterTitle: "মাহিম ইবনে খুদি (Mahim Ibne Khudi) — মাহিম'স ক্লাসরুম",
    twitterDescription: "ঢাকা সেন্ট্রাল ইউনিভার্সিটি | এসএসসি ও এইচএসসি জিপিএ ৫.০০ | প্রতিষ্ঠাতা, মাহিম'স ক্লাসরুম।",
    twitterImage: "https://res.cloudinary.com/drvyjj7td/image/upload/v1788708908/behance_pp_spfumh.jpg",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "Person",
      "name": "মাহিম ইবনে খুদি",
      "alternateName": ["Mahim Ibne Khudi", "Mahim", "Mahim Khudi", "মাহিম"],
      "url": `${siteUrl}/classroom/mahim`,
      "image": "https://res.cloudinary.com/drvyjj7td/image/upload/v1788708908/behance_pp_spfumh.jpg",
      "jobTitle": "প্রতিষ্ঠাতা ও প্রধান মেন্টর (Founder & Lead Mentor)",
      "worksFor": {
        "@type": "EducationalOrganization",
        "name": "Mahim's Classroom (মাহিম'স ক্লাসরুম)",
        "url": `${siteUrl}/classroom`
      },
      "alumniOf": {
        "@type": "CollegeOrUniversity",
        "name": "ঢাকা সেন্ট্রাল ইউনিভার্সিটি (Dhaka Central University, Dhaka College Campus)"
      },
      "description": "মাহিম ইবনে খুদি (Mahim Ibne Khudi) - ঢাকা সেন্ট্রাল ইউনিভার্সিটির শিক্ষার্থী ও মাহিম'স ক্লাসরুমের প্রতিষ্ঠাতা। বিজ্ঞান বিভাগ থেকে এসএসসি ও এইচএসসি উভয় পরীক্ষায় দিনাজপুর বোর্ড থেকে জিপিএ ৫.০০ প্রাপ্ত।",
      "knowsAbout": ["HSC Preparation", "University Admission", "Political Science", "Online Exam Engines", "Dinajpur Board Science GPA 5.00"]
    },
    prerenderHtml: `
      <div class="min-h-screen bg-[#fafaf9] p-8 max-w-4xl mx-auto font-sans text-zinc-900">
        <nav class="text-xs text-zinc-500 mb-6 font-mono">
          <a href="/" class="hover:underline">হোম</a> &gt; <a href="/classroom" class="hover:underline">মাহিম'স ক্লাসরুম</a> &gt; <span>মাহিম ইবনে খুদি</span>
        </nav>
        <h1 class="text-3xl sm:text-4xl font-black text-zinc-900">
          মাহিম ইবনে খুদি
          <span class="block text-lg font-mono text-zinc-500 font-normal mt-1">Mahim Ibne Khudi</span>
        </h1>
        <p class="text-base text-orange-600 font-bold mt-2">প্রতিষ্ঠাতা ও প্রধান মেন্টর — মাহিম'স ক্লাসরুম (Mahim's Classroom)</p>
        <p class="text-sm text-zinc-700 mt-1">ঢাকা সেন্ট্রাল ইউনিভার্সিটি — রাষ্ট্রবিজ্ঞান বিভাগ (ঢাকা কলেজ ক্যাম্পাস)</p>
        <p class="text-xs text-zinc-600 mt-1 font-medium">উচ্চ মাধ্যমিক (HSC ২০২৪) ও মাধ্যমিক (SSC ২০২২): বিজ্ঞান বিভাগ, দিনাজপুর শিক্ষা বোর্ড (জিপিএ ৫.০০ / GPA 5.00)</p>
        <p class="text-sm text-zinc-600 mt-4 leading-relaxed">
          কনসেপ্ট নির্ভর শিক্ষা ও স্মার্ট টেস্ট পদ্ধতির উদ্ভাবক। এইচএসসি, এসএসসি এবং বিশ্ববিদ্যালয় ভর্তি পরীক্ষার্থীদের জন্য নিবেদিত শিক্ষা সহায়তা প্ল্যাটফর্ম পরিচালনাকারী।
        </p>
      </div>
    `
  },

  'classroom/samiul': {
    title: "সামিউল ইসলাম সোহরাব (Samiul Islam Sohrab) | মেন্টর — মাহিম'স ক্লাসরুম (Mahim's Classroom)",
    metaTitle: "Samiul Islam Sohrab (সামিউল ইসলাম সোহরাব) — Mentor | Mahim's Classroom",
    description: "সামিউল ইসলাম সোহরাব (Samiul Islam Sohrab) - ড্যাফোডিল ইন্টারন্যাশনাল ইউনিভার্সিটি (সফটওয়্যার ইঞ্জিনিয়ারিং - DIU SWE)। ফাউন্ডার, সামনাদ একাডেমি (Samnad Academy) ও মেন্টর, শেখার সিঁড়ি। মেন্টর — মাহিম'স ক্লাসরুম।",
    keywords: "সামিউল ইসলাম সোহরাব, সামিউল ইসলাম, Samiul Islam Sohrab, Samiul Islam, Samiul Sohrab, সামনাদ একাডেমি, Samnad Academy, ড্যাফোডিল ইন্টারন্যাশনাল ইউনিভার্সিটি, Daffodil International University, DIU SWE, সফটওয়্যার ইঞ্জিনিয়ারিং, শেখার সিঁড়ি, Sekhar Siri, মাহিম ক্লাসরুম শিক্ষক, Mahim's Classroom Mentor",
    canonical: `${siteUrl}/classroom/samiul/`,
    ogTitle: "সামিউল ইসলাম সোহরাব (Samiul Islam Sohrab) — মেন্টর | মাহিম'স ক্লাসরুম",
    ogDescription: "ড্যাফোডিল ইন্টারন্যাশনাল ইউনিভার্সিটি (সফটওয়্যার ইঞ্জিনিয়ারিং) | ফাউন্ডার, সামনাদ একাডেমি | মেন্টর, শেখার সিঁড়ি ও মাহিম'স ক্লাসরুম।",
    ogImage: "https://res.cloudinary.com/drvyjj7td/image/upload/v1789228263/763122727_1365661164992767_5907311244126216229_n_y5bajt.jpg",
    twitterTitle: "সামিউল ইসলাম সোহরাব (Samiul Islam Sohrab) — মেন্টর, মাহিম'স ক্লাসরুম",
    twitterDescription: "ড্যাফোডিল ইন্টারন্যাশনাল ইউনিভার্সিটি (সফটওয়্যার ইঞ্জিনিয়ারিং) | ফাউন্ডার, সামনাদ একাডেমি।",
    twitterImage: "https://res.cloudinary.com/drvyjj7td/image/upload/v1789228263/763122727_1365661164992767_5907311244126216229_n_y5bajt.jpg",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "Person",
      "name": "সামিউল ইসলাম সোহরাব",
      "alternateName": ["Samiul Islam Sohrab", "Samiul Islam", "Samiul Sohrab", "Samiul Samnad", "সামিউল ইসলাম"],
      "url": `${siteUrl}/classroom/samiul`,
      "image": "https://res.cloudinary.com/drvyjj7td/image/upload/v1789228263/763122727_1365661164992767_5907311244126216229_n_y5bajt.jpg",
      "jobTitle": "ফাউন্ডার ও মেন্টর (Founder & Mentor)",
      "worksFor": [
        {
          "@type": "EducationalOrganization",
          "name": "Samnad Academy (সামনাদ একাডেমি)"
        },
        {
          "@type": "EducationalOrganization",
          "name": "Mahim's Classroom (মাহিম'স ক্লাসরুম)",
          "url": `${siteUrl}/classroom`
        }
      ],
      "alumniOf": {
        "@type": "CollegeOrUniversity",
        "name": "Daffodil International University (DIU)"
      },
      "description": "সামিউল ইসলাম সোহরাব - ড্যাফোডিল ইন্টারন্যাশনাল ইউনিভার্সিটির সফটওয়্যার ইঞ্জিনিয়ারিং শিক্ষার্থী ও সামনাদ একাডেমির প্রতিষ্ঠাতা।",
      "knowsAbout": ["Software Engineering", "Programming", "Career Mentorship", "Web Development"]
    },
    prerenderHtml: `
      <div class="min-h-screen bg-[#fafaf9] p-8 max-w-4xl mx-auto font-sans text-zinc-900">
        <nav class="text-xs text-zinc-500 mb-6 font-mono">
          <a href="/" class="hover:underline">হোম</a> &gt; <a href="/classroom" class="hover:underline">মাহিম'স ক্লাসরুম</a> &gt; <span>সামিউল ইসলাম সোহরাব</span>
        </nav>
        <h1 class="text-3xl sm:text-4xl font-black text-zinc-900">
          সামিউল ইসলাম সোহরাব
          <span class="block text-lg font-mono text-zinc-500 font-normal mt-1">Samiul Islam Sohrab</span>
        </h1>
        <p class="text-base text-orange-600 font-bold mt-2">ফাউন্ডার, সামনাদ একাডেমি • মেন্টর, শেখার সিঁড়ি • মেন্টর, মাহিম'স ক্লাসরুম</p>
        <p class="text-sm text-zinc-700 mt-1">ড্যাফোডিল ইন্টারন্যাশনাল ইউনিভার্সিটি (DIU) — সফটওয়্যার ইঞ্জিনিয়ারিং (B.Sc. in Software Engineering)</p>
        <p class="text-sm text-zinc-600 mt-4 leading-relaxed">
          সফটওয়্যার ইঞ্জিনিয়ারিং ও টেকনোলজির মাধ্যমে শিক্ষার্থীদের স্কিল বৃদ্ধিতে নিবেদিত অভিজ্ঞ মেন্টর ও শিক্ষাউদ্যোক্তা।
        </p>
      </div>
    `
  },

  'classroom/suza': {
    title: "আবু সালেহ সুজা (Abu Saleh Suza) | মেন্টর — মাহিম'স ক্লাসরুম (Mahim's Classroom)",
    metaTitle: "Abu Saleh Suza (আবু সালেহ সুজা) — Mentor | Mahim's Classroom",
    description: "আবু সালেহ সুজা (Abu Saleh Suza) - ফার্মেসি বিভাগ, মওলানা ভাসানী বিজ্ঞান ও প্রযুক্তি বিশ্ববিদ্যালয় (MBSTU)। গুচ্ছ ভর্তি পরীক্ষা ২০২৪-২০২৫ এ ৫১তম মেধাক্রম অর্জনকারী (GST Rank 51)। মেন্টর — মাহিম'স ক্লাসরুম।",
    keywords: "আবু সালেহ সুজা, আবু সালেহ, Abu Saleh Suza, Abu Saleh, Suza MBSTU, MBSTU Pharmacy, ফার্মেসি এমবিএসটিইউ, মওলানা ভাসানী বিজ্ঞান ও প্রযুক্তি বিশ্ববিদ্যালয়, Mawlana Bhashani Science and Technology University, গুচ্ছ ভর্তি পরীক্ষা ৫১তম, GST Admission 51, জগন্নাথ বিশ্ববিদ্যালয় বোটানি, কুড়িগ্রাম কৃষি বিশ্ববিদ্যালয়, Mahim's Classroom, মাহিম ক্লাসরুম শিক্ষক",
    canonical: `${siteUrl}/classroom/suza/`,
    ogTitle: "আবু সালেহ সুজা (Abu Saleh Suza) — মেন্টর | মাহিম'স ক্লাসরুম",
    ogDescription: "ফার্মেসি বিভাগ, মওলানা ভাসানী বিজ্ঞান ও প্রযুক্তি বিশ্ববিদ্যালয় (MBSTU) | গুচ্ছ ভর্তি পরীক্ষা ২০২৪-২০২৫: ৫১ তম মেধা স্থান | মেন্টর — মাহিম'স ক্লাসরুম।",
    ogImage: "https://res.cloudinary.com/drvyjj7td/image/upload/v1789229348/518363223_1616327812659453_3831296542395096165_n_1_fak2cg.jpg",
    twitterTitle: "আবু সালেহ সুজা (Abu Saleh Suza) — মেন্টর, মাহিম'স ক্লাসরুম",
    twitterDescription: "ফার্মেসি বিভাগ, MBSTU | গুচ্ছ ভর্তি পরীক্ষা ২০২৪-২০২৫: ৫১ তম মেধা স্থান।",
    twitterImage: "https://res.cloudinary.com/drvyjj7td/image/upload/v1789229348/518363223_1616327812659453_3831296542395096165_n_1_fak2cg.jpg",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "Person",
      "name": "আবু সালেহ সুজা",
      "alternateName": ["Abu Saleh Suza", "Abu Saleh", "Md Abu Saleh Suza", "Suza"],
      "url": `${siteUrl}/classroom/suza`,
      "image": "https://res.cloudinary.com/drvyjj7td/image/upload/v1789229348/518363223_1616327812659453_3831296542395096165_n_1_fak2cg.jpg",
      "jobTitle": "মেন্টর (Faculty & Mentor)",
      "worksFor": {
        "@type": "EducationalOrganization",
        "name": "Mahim's Classroom (মাহিম'স ক্লাসরুম)",
        "url": `${siteUrl}/classroom`
      },
      "alumniOf": {
        "@type": "CollegeOrUniversity",
        "name": "Mawlana Bhashani Science and Technology University (MBSTU)"
      },
      "description": "আবু সালেহ সুজা - ফার্মেসি বিভাগ, মওলানা ভাসানী বিজ্ঞান ও প্রযুক্তি বিশ্ববিদ্যালয় (MBSTU)। গুচ্ছ ভর্তি পরীক্ষায় ৫১তম মেধাক্রম অর্জনকারী।",
      "knowsAbout": ["Pharmacy", "Biology", "GST Admission Test", "Botany", "Agriculture Science"]
    },
    prerenderHtml: `
      <div class="min-h-screen bg-[#fafaf9] p-8 max-w-4xl mx-auto font-sans text-zinc-900">
        <nav class="text-xs text-zinc-500 mb-6 font-mono">
          <a href="/" class="hover:underline">হোম</a> &gt; <a href="/classroom" class="hover:underline">মাহিম'স ক্লাসরুম</a> &gt; <span>আবু সালেহ সুজা</span>
        </nav>
        <h1 class="text-3xl sm:text-4xl font-black text-zinc-900">
          আবু সালেহ সুজা
          <span class="block text-lg font-mono text-zinc-500 font-normal mt-1">Abu Saleh Suza</span>
        </h1>
        <p class="text-base text-orange-600 font-bold mt-2">ফার্মেসি বিভাগ — মওলানা ভাসানী বিজ্ঞান ও প্রযুক্তি বিশ্ববিদ্যালয় (MBSTU)</p>
        <p class="text-sm text-zinc-700 mt-1">গুচ্ছ ভর্তি পরীক্ষা ২০২৪-২০২৫ ঃ ৫১ তম মেধা স্থান (GST Admission Merit Rank 51)</p>
        <p class="text-xs text-zinc-600 mt-1">সুযোগপ্রাপ্ত: বোটানি, জগন্নাথ বিশ্ববিদ্যালয় (JnU) | এগ্রিকালচার, কুড়িগ্রাম কৃষি বিশ্ববিদ্যালয় (KAU)</p>
        <p class="text-sm text-zinc-600 mt-4 leading-relaxed">
          ভর্তি পরীক্ষায় শীর্ষ তালিকায় উত্তীর্ণ হওয়ার মূল চাবিকাঠি হলো বিষয়ভিত্তিক নিখুঁত শর্টকাট, টাইপভিত্তিক সমাধান এবং নেগেটিভ মার্কিং নিয়ন্ত্রণের সঠিক অনুশীলন।
        </p>
      </div>
    `
  },

  'classroom/mithen': {
    title: "মিশকাত শরীফ মিথেন (Mishkat Sharif Mithen) | মেন্টর — মাহিম'স ক্লাসরুম (Mahim's Classroom)",
    metaTitle: "Mishkat Sharif Mithen (মিশকাত শরীফ মিথেন) — Mentor | Mahim's Classroom",
    description: "মিশকাত শরীফ মিথেন (Mishkat Sharif Mithen) - বেগম রোকেয়া বিশ্ববিদ্যালয় (Begum Rokeya University - BRUR)। প্রতিষ্ঠাতা: মিথেন প্রাইভেট হোম। গণিত বিভাগ, ঢাকা সেন্ট্রাল ইউনিভার্সিটি। মেন্টর — মাহিম'স ক্লাসরুম।",
    keywords: "মিশকাত শরীফ মিথেন, মিশকাত শরীফ, Mishkat Sharif Mithen, Mishkat Sharif, Mithen, মিথেন প্রাইভেট হোম, Mithen Private Home, বেগম রোকেয়া বিশ্ববিদ্যালয়, Begum Rokeya University, BRUR, ঢাকা সেন্ট্রাল ইউনিভার্সিটি গণিত, Dhaka Central University Mathematics, দিনাজপুর বোর্ড জিপিএ ৫, Mahim's Classroom, মাহিম ক্লাসরুম শিক্ষক",
    canonical: `${siteUrl}/classroom/mithen/`,
    ogTitle: "মিশকাত শরীফ মিথেন (Mishkat Sharif Mithen) — মেন্টর | মাহিম'স ক্লাসরুম",
    ogDescription: "বেগম রোকেয়া বিশ্ববিদ্যালয় (BRUR) | ফাউন্ডারঃ মিথেন প্রাইভেট হোম | ঢাকা সেন্ট্রাল ইউনিভার্সিটি গণিত | মেন্টর — মাহিম'স ক্লাসরুম।",
    ogImage: "https://res.cloudinary.com/drvyjj7td/image/upload/v1789229549/mithen10_nrizvj.png",
    twitterTitle: "মিশকাত শরীফ মিথেন (Mishkat Sharif Mithen) — মেন্টর, মাহিম'স ক্লাসরুম",
    twitterDescription: "বেগম রোকেয়া বিশ্ববিদ্যালয় (BRUR) | ফাউন্ডারঃ মিথেন প্রাইভেট হোম।",
    twitterImage: "https://res.cloudinary.com/drvyjj7td/image/upload/v1789229549/mithen10_nrizvj.png",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "Person",
      "name": "মিশকাত শরীফ মিথেন",
      "alternateName": ["Mishkat Sharif Mithen", "Mishkat Sharif", "Mithen", "মিশকাত শরীফ"],
      "url": `${siteUrl}/classroom/mithen`,
      "image": "https://res.cloudinary.com/drvyjj7td/image/upload/v1789229549/mithen10_nrizvj.png",
      "jobTitle": "ফাউন্ডার ও মেন্টর (Founder & Mentor)",
      "worksFor": [
        {
          "@type": "EducationalOrganization",
          "name": "Mithen Private Home (মিথেন প্রাইভেট হোম)"
        },
        {
          "@type": "EducationalOrganization",
          "name": "Mahim's Classroom (মাহিম'স ক্লাসরুম)",
          "url": `${siteUrl}/classroom`
        }
      ],
      "alumniOf": {
        "@type": "CollegeOrUniversity",
        "name": "Begum Rokeya University, Rangpur (BRUR)"
      },
      "description": "মিশকাত শরীফ মিথেন - বেগম রোকেয়া বিশ্ববিদ্যালয় ও ঢাকা সেন্ট্রাল ইউনিভার্সিটি গণিত বিভাগের শিক্ষার্থী এবং মিথেন প্রাইভেট হোমের প্রতিষ্ঠাতা।",
      "knowsAbout": ["Mathematics", "Physics", "SSC & HSC Science", "Board Exam Preparation"]
    },
    prerenderHtml: `
      <div class="min-h-screen bg-[#fafaf9] p-8 max-w-4xl mx-auto font-sans text-zinc-900">
        <nav class="text-xs text-zinc-500 mb-6 font-mono">
          <a href="/" class="hover:underline">হোম</a> &gt; <a href="/classroom" class="hover:underline">মাহিম'স ক্লাসরুম</a> &gt; <span>মিশকাত শরীফ মিথেন</span>
        </nav>
        <h1 class="text-3xl sm:text-4xl font-black text-zinc-900">
          মিশকাত শরীফ মিথেন
          <span class="block text-lg font-mono text-zinc-500 font-normal mt-1">Mishkat Sharif Mithen</span>
        </h1>
        <p class="text-base text-orange-600 font-bold mt-2">বেগম রোকেয়া বিশ্ববিদ্যালয় (BRUR) • ফাউন্ডারঃ মিথেন প্রাইভেট হোম • মেন্টর, মাহিম'স ক্লাসরুম</p>
        <p class="text-sm text-zinc-700 mt-1">গণিত বিভাগ — ঢাকা সেন্ট্রাল ইউনিভার্সিটি</p>
        <p class="text-xs text-zinc-600 mt-1">এসএসসি ও এইচএসসি: বিজ্ঞান বিভাগ (উভয়ে জিপিএ ৫.০০), দিনাজপুর শিক্ষা বোর্ড</p>
        <p class="text-sm text-zinc-600 mt-4 leading-relaxed">
          গণিত ও বিজ্ঞানের জটিল বিষয়গুলোকে গাণিতিক লজিক, বাস্তব উদাহরণ ও সহজ কৌশলে উপস্থাপন করে শিক্ষার্থীদের ভেতর আত্মবিশ্বাস জাগিয়ে তোলাই মূল লক্ষ্য।
        </p>
      </div>
    `
  },

  'classroom/swocchol': {
    title: "স্বচ্ছল কুমার কর্মকার (Swocchol Kumar Karmokar) | মেন্টর — মাহিম'স ক্লাসরুম (Mahim's Classroom)",
    metaTitle: "Swocchol Kumar Karmokar (স্বচ্ছল কুমার কর্মকার) — Mentor | Mahim's Classroom",
    description: "স্বচ্ছল কুমার কর্মকার (Swocchol Kumar Karmokar) - কম্পিউটার সাইন্স এন্ড ইঞ্জিনিয়ারিং (Computer Science and Engineering - CSE), ইউনাইটেড ইন্টারন্যাশনাল ইউনিভার্সিটি (United International University - UIU)। মেন্টর — মাহিম'স ক্লাসরুম।",
    keywords: "স্বচ্ছল কুমার কর্মকার, স্বচ্ছল কর্মকার, Swocchol Kumar Karmokar, Swocchol Karmakar, Swocchol Kumar, Swocchol, ইউনাইটেড ইন্টারন্যাশনাল ইউনিভার্সিটি, United International University, UIU CSE, কম্পিউটার সাইন্স এন্ড ইঞ্জিনিয়ারিং, Computer Science and Engineering, Mahim's Classroom, মাহিম ক্লাসরুম শিক্ষক, UIU Swocchol",
    canonical: `${siteUrl}/classroom/swocchol/`,
    ogTitle: "স্বচ্ছল কুমার কর্মকার (Swocchol Kumar Karmokar) — মেন্টর | মাহিম'স ক্লাসরুম",
    ogDescription: "কম্পিউটার সাইন্স এন্ড ইঞ্জিনিয়ারিং (CSE) | ইউনাইটেড ইন্টারন্যাশনাল ইউনিভার্সিটি (UIU) | মেন্টর — মাহিম'স ক্লাসরুম (Mahim's Classroom)।",
    ogImage: "https://res.cloudinary.com/drvyjj7td/image/upload/v1789231884/swocchol_uxtt4r.png",
    twitterTitle: "স্বচ্ছল কুমার কর্মকার (Swocchol Kumar Karmokar) — মেন্টর, মাহিম'স ক্লাসরুম",
    twitterDescription: "কম্পিউটার সাইন্স এন্ড ইঞ্জিনিয়ারিং (CSE), ইউনাইটেড ইন্টারন্যাশনাল ইউনিভার্সিটি (UIU)।",
    twitterImage: "https://res.cloudinary.com/drvyjj7td/image/upload/v1789231884/swocchol_uxtt4r.png",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "Person",
      "name": "স্বচ্ছল কুমার কর্মকার",
      "alternateName": ["Swocchol Kumar Karmokar", "Swocchol Karmakar", "Swocchol Kumar", "Swocchol", "স্বচ্ছল কর্মকার"],
      "url": `${siteUrl}/classroom/swocchol`,
      "image": "https://res.cloudinary.com/drvyjj7td/image/upload/v1789231884/swocchol_uxtt4r.png",
      "jobTitle": "মেন্টর — কম্পিউটার সাইন্স ও ম্যাথমেটিক্স (Mentor)",
      "worksFor": {
        "@type": "EducationalOrganization",
        "name": "Mahim's Classroom (মাহিম'স ক্লাসরুম)",
        "url": `${siteUrl}/classroom`
      },
      "alumniOf": {
        "@type": "CollegeOrUniversity",
        "name": "United International University (UIU)"
      },
      "description": "স্বচ্ছল কুমার কর্মকার - কম্পিউটার সাইন্স এন্ড ইঞ্জিনিয়ারিং (CSE), ইউনাইটেড ইন্টারন্যাশনাল ইউনিভার্সিটি (UIU)। মেন্টর — মাহিম'স ক্লাসরুম।",
      "knowsAbout": ["Computer Science", "CSE", "Data Structures", "Algorithms", "Mathematics", "Programming"]
    },
    prerenderHtml: `
      <div class="min-h-screen bg-[#fafaf9] p-8 max-w-4xl mx-auto font-sans text-zinc-900">
        <nav class="text-xs text-zinc-500 mb-6 font-mono">
          <a href="/" class="hover:underline">হোম</a> &gt; <a href="/classroom" class="hover:underline">মাহিম'স ক্লাসরুম</a> &gt; <span>স্বচ্ছল কুমার কর্মকার</span>
        </nav>
        <h1 class="text-3xl sm:text-4xl font-black text-zinc-900">
          স্বচ্ছল কুমার কর্মকার
          <span class="block text-lg font-mono text-zinc-500 font-normal mt-1">Swocchol Kumar Karmokar</span>
        </h1>
        <p class="text-base text-orange-600 font-bold mt-2">কম্পিউটার সাইন্স এন্ড ইঞ্জিনিয়ারিং (CSE) • ইউনাইটেড ইন্টারন্যাশনাল ইউনিভার্সিটি (UIU)</p>
        <p class="text-sm text-zinc-700 mt-1">মেন্টর — মাহিম'স ক্লাসরুম (Mahim's Classroom Official Faculty)</p>
        <p class="text-sm text-zinc-600 mt-4 leading-relaxed">
          কম্পিউটার বিজ্ঞানের মূল ধারণা এবং লজিক্যাল থিংকিংকে বাস্তব প্রজেক্ট ও সহজ উদাহরণের মাধ্যমে শিক্ষার্থীদের মাঝে ছড়িয়ে দেওয়া।
        </p>
      </div>
    `
  },

  salami: {
    title: "Mahim Salami | মাহিম সালামি — ডিজিটাল ঈদ সালামি পোর্টাল ও ট্র্যাকার",
    metaTitle: "Mahim Salami | মাহিম সালামি — ঈদ সালামি ট্র্যাকার ও পোর্টাল",
    description: "Mahim Salami (মাহিম সালামি) - Mahim Ibne Khudi এর অফিসিয়াল ডিজিটাল ঈদ সালামি ট্র্যাকার ও পোর্টাল। ঈদ সালামি পাঠান অথবা আপনার প্রাপ্ত সালামি ও শুভেচ্ছা বার্তা চেক করুন বিকাশ, নগদ বা রকেটের মাধ্যমে।",
    keywords: "Mahim Salami, মাহিম সালামি, Mahims Salami, mahim salami, eid salami mahim, ঈদ সালামি মাহিম, mahim salami tracker, mahims.com/salami, ডিজিটাল সালামি পোর্টাল, মাহিম ইবনে খুদি সালামি, বিকাশ নগদ সালামি",
    canonical: `${siteUrl}/salami/`,
    ogTitle: "Mahim Salami | মাহিম সালামি — ঈদ সালামি ট্র্যাকার ও পোর্টাল",
    ogDescription: "ঈদের আনন্দ ছড়িয়ে দিতে মাহিমকে ঈদ সালামি পাঠান অথবা আপনার সালামি ট্র্যাক করুন ডিজিটাল পোর্টালে।",
    ogImage: salamiOgImage,
    twitterTitle: "Mahim Salami | মাহিম সালামি — ঈদ সালামি ট্র্যাকার ও পোর্টাল",
    twitterDescription: "ঈদ মোবারক! মাহিমকে ঈদ সালামি পাঠান অথবা আপনার প্রাপ্ত সালামি চেক করুন অনলাইন পোর্টালে।",
    twitterImage: salamiOgImage,
    jsonLd: {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "হোম (Home)", "item": "https://mahims.com/" },
            { "@type": "ListItem", "position": 2, "name": "মাহিম সালামি (Mahim Salami)", "item": "https://mahims.com/salami/" }
          ]
        },
        {
          "@type": "WebApplication",
          "@id": "https://mahims.com/salami#app",
          "name": "Mahim Salami Portal",
          "alternateName": ["মাহিম সালামি", "Mahim Salami", "Mahims Salami", "Eid Salami Tracker"],
          "url": "https://mahims.com/salami/",
          "image": salamiOgImage,
          "description": "ডিজিটাল ঈদ সালামি ট্র্যাকার এবং শুভেচ্ছা পোর্টাল। মাহিম ইবনে খুদিকে সালামি পাঠানোর অনলাইন মাধ্যম।",
          "applicationCategory": "EntertainmentApplication",
          "operatingSystem": "All"
        },
        {
          "@type": "FAQPage",
          "mainEntity": [
            {
              "@type": "Question",
              "name": "মাহিম সালামি (Mahim Salami) কী?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "মাহিম সালামি হলো পবিত্র ঈদুল ফিতর ও ঈদুল আজহায় বন্ধুদের ও শুভাকাঙ্ক্ষীদের সাথে সালামি দেওয়া-নেওয়া ও আনন্দ ভাগাভাগি করার ডিজিটাল প্ল্যাটফর্ম।"
              }
            },
            {
              "@type": "Question",
              "name": "কীভাবে সালামি পাঠানো যায়?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "mahims.com/salami পোর্টালে প্রবেশ করে বিকাশ, নগদ বা রকেট নম্বরে সালামি পাঠিয়ে ট্রানজ্যাকশন আইডি ও নাম সাবমিট করে সালামি পাঠানো যায়।"
              }
            }
          ]
        }
      ]
    },
    prerenderHtml: `
      <div class="min-h-screen bg-[#fffbeb] text-zinc-900 font-sans">
        <header class="border-b border-amber-200 bg-white/90 backdrop-blur-md sticky top-0 z-20">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
            <a href="/" class="flex items-center gap-3">
              <span class="w-9 h-9 rounded-xl bg-amber-500 text-black flex items-center justify-center font-bold text-lg">M</span>
              <div>
                <span class="font-black text-lg block leading-tight text-zinc-950">Mahim Salami</span>
                <span class="text-xs text-amber-700 font-semibold">মাহিম সালামি — ডিজিটাল ঈদ সালামি পোর্টাল</span>
              </div>
            </a>
            <a href="/" class="text-xs font-bold px-3 py-1.5 rounded-lg border border-amber-300 text-amber-900 hover:bg-amber-100">হোমে ফিরুন</a>
          </div>
        </header>

        <main class="max-w-4xl mx-auto px-4 py-12 text-center">
          <span class="inline-block px-3 py-1 rounded-full text-xs font-bold bg-amber-200 text-amber-900 border border-amber-300 mb-4">ঈদ উৎসব ও শুভেচ্ছা</span>
          <h1 class="text-3xl sm:text-5xl font-black text-zinc-950 mb-3 tracking-tight">Mahim Salami (মাহিম সালামি)</h1>
          <p class="text-base sm:text-lg text-zinc-700 max-w-2xl mx-auto leading-relaxed mb-8">
            পবিত্র ঈদের আনন্দ ছড়িয়ে দিতে ডিজিটাল সালামি ট্র্যাকার পোর্টাল। মাহিম ইবনে খুদিকে ঈদ সালামি পাঠান এবং শুভেচ্ছা বার্তার সাথে যুক্ত হন।
          </p>

          <div class="bg-white border border-amber-200 rounded-3xl p-8 shadow-sm space-y-6 max-w-2xl mx-auto text-left">
            <h2 class="text-xl font-bold text-zinc-950 border-b pb-2">সালামি পাঠানোর নিয়ম ও বিবরণ</h2>
            <div class="space-y-3 text-sm text-zinc-700">
              <p>১. পোর্টালে সংযুক্ত বিকাশ, নগদ বা রকেট নম্বরে আপনার ইচ্ছামতো সালামি সেন্ড মানি করুন।</p>
              <p>২. আপনার নাম ও প্রেরকের নম্বর অথবা ট্রানজ্যাকশন আইডি এন্ট্রি করুন।</p>
              <p>৩. আপনার সালামি সরাসরি মাহিমের অফিসিয়াল সালামি ড্যাশবোর্ডে সংরক্ষিত হবে এবং শুভেচ্ছা বার্তা প্রদর্শিত হবে।</p>
            </div>
            <div class="pt-4 flex flex-wrap gap-3">
              <span class="px-3 py-1 rounded-lg bg-pink-50 border border-pink-200 text-pink-700 text-xs font-bold">bKash (বিকাশ)</span>
              <span class="px-3 py-1 rounded-lg bg-orange-50 border border-orange-200 text-orange-700 text-xs font-bold">Nagad (নগদ)</span>
              <span class="px-3 py-1 rounded-lg bg-purple-50 border border-purple-200 text-purple-700 text-xs font-bold">Rocket (রকেট)</span>
            </div>
          </div>
        </main>
      </div>
    `
  },

  chithi: {
    title: "Mahim Chithi | মাহিম চিঠি — মনের না বলা কথা পাঠান গোপনে (চিঠি ডট মি)",
    metaTitle: "Mahim Chithi | মাহিম চিঠি - চিঠি ডট মি (Mahims Chithi)",
    description: "Mahim Chithi (মাহিম চিঠি) - Mahim Ibne Khudi কে বেনামে চিঠি পাঠান। কোনো পরিচয় বা তথ্য ছাড়াই মনের না বলা কথা, সিক্রেট অনুভূতি বা বার্তা পাঠান ১০০% গোপনে ও নিরাপদে।",
    keywords: "Mahim Chithi, মাহিম চিঠি, Mahims Chithi, মাহিমস চিঠি, Mahim Chithi me, মাহিম চিঠি মি, mahim anonymous letter, চিঠি ডট মি মাহিম, chithi mahims, mahims.com/chithi, বেনামে চিঠি মাহিম, সিক্রেট মেসেজ মাহিম, Mahim Ibne Khudi chithi",
    canonical: `${siteUrl}/chithi/`,
    ogTitle: "Mahim Chithi | মাহিম চিঠি — মনের না বলা কথা পাঠান গোপনে",
    ogDescription: "মাহিমকে বেনামে চিঠি পাঠান। কোনো পরিচয় ছাড়াই আপনার মনের না বলা কথা, সিক্রেট অনুভূতি বা বার্তা পাঠান ১০০% নিরাপদে।",
    ogImage: chithiOgImage,
    twitterTitle: "Mahim Chithi | মাহিম চিঠি — মনের না বলা কথা পাঠান গোপনে",
    twitterDescription: "মাহিমকে বেনামে চিঠি পাঠান। মনের না বলা কথা বা সিক্রেট বার্তা পাঠান ১০০% নিরাপদে।",
    twitterImage: chithiOgImage,
    jsonLd: {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "হোম (Home)", "item": "https://mahims.com/" },
            { "@type": "ListItem", "position": 2, "name": "মাহিম চিঠি (Mahim Chithi)", "item": "https://mahims.com/chithi/" }
          ]
        },
        {
          "@type": "WebApplication",
          "@id": "https://mahims.com/chithi#app",
          "name": "Mahim Chithi — চিঠি ডট মি",
          "alternateName": ["মাহিম চিঠি", "Mahim Chithi", "Mahims Chithi", "Chithi Me Mahim"],
          "url": "https://mahims.com/chithi/",
          "image": chithiOgImage,
          "description": "মাহিম ইবনে খুদিকে সম্পূর্ণ বেনামে ও নিরাপদে চিঠি বা গোপন বার্তা পাঠানোর সুরক্ষিত প্ল্যাটফর্ম।",
          "applicationCategory": "SocialNetworkingApplication",
          "operatingSystem": "All"
        },
        {
          "@type": "FAQPage",
          "mainEntity": [
            {
              "@type": "Question",
              "name": "মাহিম চিঠি (Mahim Chithi) কী?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "মাহিম চিঠি হলো একটি বিশেষ ও নিরাপদ ডিজিটাল লেটারবক্স যেখানে যেকোনো ব্যক্তি তার পরিচয় সম্পূর্ণ গোপন রেখে মাহিম ইবনে খুদিকে চিঠি, মনের অনুভূতি বা বার্তা পাঠাতে পারেন।"
              }
            },
            {
              "@type": "Question",
              "name": "আমার পরিচয় কি গোপন থাকবে?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "হ্যাঁ, এটি সম্পূর্ণ নামহীন ও এনক্রিপ্টেড। আপনার আইপি বা ব্যক্তিগত কোনো তথ্য ট্র্যাক করা হয় না। বার্তাটি সম্পূর্ণ গোপনীয় থাকে।"
              }
            }
          ]
        }
      ]
    },
    prerenderHtml: `
      <div class="min-h-screen bg-[#faf8f5] text-zinc-900 font-sans">
        <header class="border-b border-amber-200/60 bg-white/90 backdrop-blur-md sticky top-0 z-20">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
            <a href="/" class="flex items-center gap-3">
              <span class="w-9 h-9 rounded-xl bg-red-600 text-white flex items-center justify-center font-bold text-lg">M</span>
              <div>
                <span class="font-black text-lg block leading-tight text-zinc-950">Mahim Chithi</span>
                <span class="text-xs text-red-600 font-semibold">মাহিম চিঠি — মনের না বলা কথা পাঠান গোপনে</span>
              </div>
            </a>
            <a href="/" class="text-xs font-bold px-3 py-1.5 rounded-lg border border-zinc-300 text-zinc-700 hover:bg-zinc-100">হোমে ফিরুন</a>
          </div>
        </header>

        <main class="max-w-3xl mx-auto px-4 py-12 text-center">
          <span class="inline-block px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800 border border-red-200 mb-4">বেনামী বার্তা ও অনুভূতি</span>
          <h1 class="text-3xl sm:text-5xl font-black text-zinc-950 mb-3 tracking-tight">Mahim Chithi (মাহিম চিঠি)</h1>
          <p class="text-base sm:text-lg text-zinc-600 max-w-xl mx-auto leading-relaxed mb-8">
            কোনো পরিচয় ছাড়াই মাহিমকে বেনামে চিঠি পাঠান। মনের না বলা কথা, পরামর্শ, অনুভূতি বা বার্তা পাঠান ১০০% নিরাপদে।
          </p>

          <div class="bg-white border border-amber-200/80 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6 text-left">
            <h2 class="text-xl font-bold text-zinc-900 border-b pb-2">১০০% গোপনীয়তা ও সুরক্ষার নিশ্চয়তা</h2>
            <div class="space-y-3 text-sm text-zinc-700">
              <p>• <strong>কোনো লগইন বা রেজিস্ট্রেশন নেই:</strong> কোনো ইমেইল বা ফোন নম্বর প্রয়োজন হয় না।</p>
              <p>• <strong>আইডেন্টিটি ফ্রি:</strong> আপনার চিঠি কেবল মাহিমের ব্যক্তিগত সিক্রেট ইনবক্সে জমা হবে।</p>
              <p>• <strong>কাগজ ও কালির থিম:</strong> ভিন্টেজ পার্চমেন্ট, নোটবুক পেপার ও পছন্দের কালিতে চিঠি লিখে সাথে সাথে সেন্ড করতে পারবেন।</p>
            </div>
            <div class="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs leading-relaxed">
              চিঠি লিখতে নিচে স্ক্রোল করে আপনার অনুভূতি টাইপ করুন এবং 'চিঠি পাঠান' বাটনে চাপ দিন।
            </div>
          </div>
        </main>
      </div>
    `
  },

  portfolio: {
    title: "Portfolio | মাহিম ইবনে খুদি — ফুল-স্ট্যাক ওয়েব ডেভেলপার ও ক্রিয়েটিভ ডিজাইনার",
    metaTitle: "Portfolio | মাহিম ইবনে খুদি — প্রজেক্ট ও সিভি",
    description: "Mahim Ibne Khudi (মাহিম) - ফুল-স্ট্যাক ওয়েব অ্যাপ্লিকেশন, নো-কোড ওয়ার্কফ্লো অটোমেশন, ব্র্যান্ড আইডেন্টিটি এবং ক্রিয়েটিভ প্রজেক্ট পোর্টফোলিও ও সিভি।",
    keywords: "Mahim portfolio, mahim cv, mahim ibne khudi portfolio, মাহিম পোর্টফোলিও, mahims.com/portfolio, ফুল-স্ট্যাক ডেভেলপার মাহিম, গ্রাফিক্স ডিজাইন মাহিম, ওয়েব প্রজেক্টস",
    canonical: `${siteUrl}/portfolio/`,
    ogTitle: "Portfolio | মাহিম ইবনে খুদি — ফুল-স্ট্যাক ও ক্রিয়েটিভ প্রজেক্টস",
    ogDescription: "সফটওয়্যার ডেভেলপমেন্ট, কোডিং প্রজেক্টস, প্রযুক্তি স্ট্যাক ও কাজের ইতিহাস।",
    ogImage: defaultOgImage,
    twitterTitle: "Portfolio | মাহিম ইবনে খুদি — প্রজেক্ট ও সিভি",
    twitterDescription: "সফটওয়্যার ডেভেলপমেন্ট ও ক্রিয়েটিভ ডিজাইনের সমন্বিত পোর্টফোলিও।",
    twitterImage: defaultOgImage,
    jsonLd: {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "হোম (Home)", "item": "https://mahims.com/" },
            { "@type": "ListItem", "position": 2, "name": "পোর্টফোলিও (Portfolio)", "item": "https://mahims.com/portfolio/" }
          ]
        },
        {
          "@type": "ProfilePage",
          "@id": "https://mahims.com/portfolio#profile",
          "name": "Mahim Ibne Khudi Professional Portfolio",
          "url": "https://mahims.com/portfolio/",
          "description": "Mahim's full-stack development, software engineering, automation workflows and design projects.",
          "primaryImageOfPage": defaultOgImage
        }
      ]
    },
    prerenderHtml: `
      <div class="min-h-screen bg-[#fafaf9] text-zinc-900 font-sans">
        <header class="border-b border-zinc-200 bg-white/90 backdrop-blur-md sticky top-0 z-20">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
            <a href="/" class="flex items-center gap-3">
              <span class="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-lg">M</span>
              <div>
                <span class="font-black text-lg block leading-tight text-zinc-950">Mahim's Portfolio</span>
                <span class="text-xs text-indigo-600 font-semibold">মাহিম ইবনে খুদি — প্রফেশনাল পোর্টফোলিও ও সিভি</span>
              </div>
            </a>
            <a href="/" class="text-xs font-bold px-3 py-1.5 rounded-lg border border-zinc-300 text-zinc-700 hover:bg-zinc-100">হোমে ফিরুন</a>
          </div>
        </header>

        <main class="max-w-5xl mx-auto px-4 py-12">
          <section class="text-center space-y-4 mb-12">
            <span class="inline-block px-3 py-1 rounded-full text-xs font-bold bg-indigo-100 text-indigo-800 border border-indigo-200">কোডিং, ক্যারিয়ার ও টেক প্রজেক্ট</span>
            <h1 class="text-3xl sm:text-5xl font-black text-zinc-950 tracking-tight">প্রফেশনাল পোর্টফোলিও ও সিভি</h1>
            <p class="text-base sm:text-lg text-zinc-600 max-w-2xl mx-auto leading-relaxed">
              সফটওয়্যার ডেভেলপমেন্ট, ওয়েব অ্যাপ্লিকেশনস, অটোমেশন এবং ক্রিয়েটিভ ডিজাইনের সমন্বিত প্রজেক্ট ডিসপ্লে ও কাজের ইতিহাস।
            </p>
          </section>

          <section class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12 text-center">
            <div class="p-6 rounded-2xl bg-white border border-zinc-200 shadow-xs">
              <h2 class="text-2xl font-black text-indigo-600">TypeScript & React</h2>
              <p class="text-xs text-zinc-600 mt-1 font-medium">আধুনিক ফুল-স্ট্যাক আর্কিটেকচার</p>
            </div>
            <div class="p-6 rounded-2xl bg-white border border-zinc-200 shadow-xs">
              <h2 class="text-2xl font-black text-indigo-600">Tailwind & UI/UX</h2>
              <p class="text-xs text-zinc-600 mt-1 font-medium">রেসপনসিভ ও ক্লিন ডিজাইন</p>
            </div>
            <div class="p-6 rounded-2xl bg-white border border-zinc-200 shadow-xs">
              <h2 class="text-2xl font-black text-indigo-600">Automation</h2>
              <p class="text-xs text-zinc-600 mt-1 font-medium">স্মার্ট নো-কোড ওয়ার্কফ্লো সলিউশন</p>
            </div>
          </section>
        </main>
      </div>
    `
  },

  about: {
    title: "About Mahim | মাহিম ইবনে খুদি — জীবনী, শিক্ষাজীবন ও পরিচয়",
    metaTitle: "About Mahim | মাহিম ইবনে খুদি",
    description: "মাহিম ইবনে খুদি (Mahim Ibne Khudi) - শিক্ষার্থী, রাষ্ট্রবিজ্ঞান বিভাগ, ঢাকা সেন্ট্রাল ইউনিভার্সিটি। গ্রাফিক ডিজাইনার, ওয়েব ডেভেলপার ও মাহিম’স ক্লাসরুমের প্রতিষ্ঠাতা।",
    keywords: "About Mahim, মাহিম ইবনে খুদি, Mahim Ibne Khudi, মাহিম গাইবান্ধা, ঢাকা সেন্ট্রাল ইউনিভার্সিটি মাহিম, mahims.com/about",
    canonical: `${siteUrl}/about/`,
    ogTitle: "About Mahim | মাহিম ইবনে খুদি",
    ogDescription: "মাহিম ইবনে খুদি এর ব্যক্তিগত জীবনী, শিক্ষাজীবন, দর্শন ও কর্মপ্রচেষ্টা।",
    ogImage: defaultOgImage,
    twitterTitle: "About Mahim | মাহিম ইবনে খুদি",
    twitterDescription: "মাহিম ইবনে খুদি এর পরিচিতি ও ব্যাকগ্রাউন্ড।",
    twitterImage: defaultOgImage,
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "AboutPage",
      "name": "About Mahim Ibne Khudi",
      "url": "https://mahims.com/about/"
    },
    prerenderHtml: `
      <div class="min-h-screen bg-[#fafaf9] text-zinc-900 font-sans p-8 max-w-4xl mx-auto">
        <h1 class="text-3xl font-black text-zinc-950 mb-4">আমার সম্পর্কে — মাহিম ইবনে খুদি</h1>
        <p class="text-base text-zinc-700 leading-relaxed">মাহিম ইবনে খুদি (Mahim Ibne Khudi) - শিক্ষার্থী, রাষ্ট্রবিজ্ঞান বিভাগ, ঢাকা সেন্ট্রাল ইউনিভার্সিটি। জন্ম ও বেড়ে ওঠা গাইবান্ধা জেলায়। প্রযুক্তি, শিক্ষা ও দর্শনের সমন্বয়ে সমাজ ও শিক্ষার্থীদের উপকারে আত্মনিবেদিত।</p>
      </div>
    `
  },

  blog: {
    title: "Blog | মাহিম ইবনে খুদি — চিন্তাভাবনা, প্রযুক্তি ও জীবনদর্শন",
    metaTitle: "Blog | মাহিম ইবনে খুদি — লেখালেখি ও ব্লগ",
    description: "মাহিম ইবনে খুদির ব্যক্তিগত চিন্তাভাবনা, টেকনোলজি, দর্শন, ইসলাম ও সমকালীন সমাজ নিয়ে নিয়মিত ব্লগ ও বিশ্লেষণমূলক লেখালেখি।",
    keywords: "Mahim blog, মাহিম ব্লগ, mahims.com/blog, মাহিম ইবনে খুদি ব্লগ, প্রযুক্তি ও দর্শন",
    canonical: `${siteUrl}/blog/`,
    ogTitle: "Blog | মাহিম ইবনে খুদি — চিন্তাভাবনা ও ব্লগ",
    ogDescription: "প্রযুক্তি, দর্শন ও সমকালীন সমাজ নিয়ে বিশ্লেষণমূলক লেখালেখি।",
    ogImage: defaultOgImage,
    twitterTitle: "Blog | মাহিম ইবনে খুদি",
    twitterDescription: "মাহিম ইবনে খুদির চিন্তাভাবনা ও ব্লগ।",
    twitterImage: defaultOgImage,
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "Blog",
      "name": "Mahim's Blog",
      "url": "https://mahims.com/blog/"
    },
    prerenderHtml: `
      <div class="min-h-screen bg-[#fafaf9] text-zinc-900 font-sans p-8 max-w-4xl mx-auto">
        <h1 class="text-3xl font-black text-zinc-950 mb-4">ব্লগ ও চিন্তালয় — মাহিম ইবনে খুদি</h1>
        <p class="text-base text-zinc-700 leading-relaxed">চিন্তার গভীরতা, প্রযুক্তি, দর্শন ও সমকালীন বিষয়াবলী নিয়ে মাহিম ইবনে খুদির নিয়মিত প্রবন্ধ ও নোটস।</p>
      </div>
    `
  },

  contact: {
    title: "Contact | যোগাযোগ — মাহিম ইবনে খুদি",
    metaTitle: "Contact | মাহিম ইবনে খুদি",
    description: "মাহিম ইবনে খুদির সাথে সরাসরি যোগাযোগের উপায়। ইমেইল: mahimibnkhudi@gmail.com, হোয়াটসঅ্যাপ ও সোশ্যাল মিডিয়া প্রোফাইল লিঙ্ক।",
    keywords: "Contact Mahim, মাহিম যোগাযোগ, mahimibnkhudi@gmail.com, mahims.com/contact",
    canonical: `${siteUrl}/contact/`,
    ogTitle: "Contact | মাহিম ইবনে খুদি",
    ogDescription: "সরাসরি যোগাযোগ করুন মাহিম ইবনে খুদির সাথে।",
    ogImage: defaultOgImage,
    twitterTitle: "Contact | মাহিম ইবনে খুদি",
    twitterDescription: "মাহিম ইবনে খুদির সাথে যোগাযোগের ঠিকানা।",
    twitterImage: defaultOgImage,
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "ContactPage",
      "name": "Contact Mahim Ibne Khudi",
      "url": "https://mahims.com/contact/"
    },
    prerenderHtml: `
      <div class="min-h-screen bg-[#fafaf9] text-zinc-900 font-sans p-8 max-w-4xl mx-auto">
        <h1 class="text-3xl font-black text-zinc-950 mb-4">যোগাযোগ — মাহিম ইবনে খুদি</h1>
        <p class="text-base text-zinc-700 leading-relaxed">ইমেইল: mahimibnkhudi@gmail.com | মোবাইল / হোয়াটসঅ্যাপ: +8801700000000</p>
      </div>
    `
  },

  skills: {
    title: "Skills & Tech Stack | দক্ষতা — মাহিম ইবনে খুদি",
    metaTitle: "Skills | মাহিম ইবনে খুদি",
    description: "মাহিম ইবনে খুদির টেকনিক্যাল দক্ষতা: React, TypeScript, Tailwind CSS, Node.js, গ্রাফিক্স ডিজাইন, ব্র্যান্ডিং ও অটোমেশন।",
    keywords: "Mahim skills, mahim tech stack, মাহিম দক্ষতা, mahims.com/skills",
    canonical: `${siteUrl}/skills/`,
    ogTitle: "Skills & Tech Stack | মাহিম ইবনে খুদি",
    ogDescription: "মাহিম ইবনে খুদির টেকনিক্যাল ও ক্রিয়েটিভ স্কিলস।",
    ogImage: defaultOgImage,
    twitterTitle: "Skills | মাহিম ইবনে খুদি",
    twitterDescription: "মাহিম ইবনে খুদির টেকনিক্যাল স্কিলস।",
    twitterImage: defaultOgImage,
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "Skills — Mahim Ibne Khudi",
      "url": "https://mahims.com/skills/"
    },
    prerenderHtml: `
      <div class="min-h-screen bg-[#fafaf9] text-zinc-900 font-sans p-8 max-w-4xl mx-auto">
        <h1 class="text-3xl font-black text-zinc-950 mb-4">দক্ষতা ও টেকনোলজি স্ট্যাক</h1>
        <p class="text-base text-zinc-700 leading-relaxed">React, TypeScript, Tailwind CSS, Node.js, Express, গ্রাফিক্স ডিজাইন ও ডিজিটাল অটোমেশন।</p>
      </div>
    `
  },

  experience: {
    title: "Experience | অভিজ্ঞতা ও কর্মজীবন — মাহিম ইবনে খুদি",
    metaTitle: "Experience | মাহিম ইবনে খুদি",
    description: "মাহিম ইবনে খুদির কাজের অভিজ্ঞতা, ফ্রিল্যান্সিং ক্যারিয়ার, ডিজাইন প্রজেক্ট ও অ্যাকাডেমিক মেন্টরশিপের ইতিহাস।",
    keywords: "Mahim experience, মাহিম অভিজ্ঞতা, mahims.com/experience",
    canonical: `${siteUrl}/experience/`,
    ogTitle: "Experience | মাহিম ইবনে খুদি",
    ogDescription: "মাহিম ইবনে খুদির কাজের অভিজ্ঞতা ও প্রজেক্ট ইতিহাস।",
    ogImage: defaultOgImage,
    twitterTitle: "Experience | মাহিম ইবনে খুদি",
    twitterDescription: "মাহিম ইবনে খুদির কাজের অভিজ্ঞতা।",
    twitterImage: defaultOgImage,
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "Experience — Mahim Ibne Khudi",
      "url": "https://mahims.com/experience/"
    },
    prerenderHtml: `
      <div class="min-h-screen bg-[#fafaf9] text-zinc-900 font-sans p-8 max-w-4xl mx-auto">
        <h1 class="text-3xl font-black text-zinc-950 mb-4">কাজের অভিজ্ঞতা — মাহিম ইবনে খুদি</h1>
        <p class="text-base text-zinc-700 leading-relaxed">ফ্রিল্যান্স ক্রিয়েটিভ ডিরেকশন, ব্র্যান্ড আইডেন্টিটি, ফুল-স্ট্যাক প্রজেক্ট ও মাহিম’স ক্লাসরুমের অ্যাকাডেমিক নেতৃত্ব।</p>
      </div>
    `
  },

  education: {
    title: "Education | শিক্ষাজীবন — মাহিম ইবনে খুদি",
    metaTitle: "Education | মাহিম ইবনে খুদি",
    description: "মাহিম ইবনে খুদির শিক্ষাগত পটভূমি: ঢাকা সেন্ট্রাল ইউনিভার্সিটি (রাষ্ট্রবিজ্ঞান বিভাগ), গাইবান্ধা সরকারি কলেজ (এইচএসসি) ও স্কুল জীবন।",
    keywords: "Mahim education, মাহিম শিক্ষাজীবন, ঢাকা সেন্ট্রাল ইউনিভার্সিটি মাহিম, mahims.com/education",
    canonical: `${siteUrl}/education/`,
    ogTitle: "Education | মাহিম ইবনে খুদি",
    ogDescription: "মাহিম ইবনে খুদির শিক্ষাগত যোগ্যতা ও অ্যাকাডেমিক ব্যাকগ্রাউন্ড।",
    ogImage: defaultOgImage,
    twitterTitle: "Education | মাহিম ইবনে খুদি",
    twitterDescription: "মাহিম ইবনে খুদির শিক্ষাজীবন।",
    twitterImage: defaultOgImage,
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": "Education — Mahim Ibne Khudi",
      "url": "https://mahims.com/education/"
    },
    prerenderHtml: `
      <div class="min-h-screen bg-[#fafaf9] text-zinc-900 font-sans p-8 max-w-4xl mx-auto">
        <h1 class="text-3xl font-black text-zinc-950 mb-4">শিক্ষাগত যোগ্যতা — মাহিম ইবনে খুদি</h1>
        <p class="text-base text-zinc-700 leading-relaxed">স্নাতক (অনার্স): রাষ্ট্রবিজ্ঞান বিভাগ, ঢাকা সেন্ট্রাল ইউনিভার্সিটি | উচ্চমাধ্যমিক (এইচএসসি): গাইবান্ধা সরকারি কলেজ।</p>
      </div>
    `
  }
};

if (fs.existsSync(distDir)) {
  const rootIndexHtml = fs.readFileSync(path.join(distDir, 'index.html'), 'utf8');

  routes.forEach((route) => {
    const routeDir = path.join(distDir, route);
    if (!fs.existsSync(routeDir)) {
      fs.mkdirSync(routeDir, { recursive: true });
    }

    let htmlContent = rootIndexHtml;
    // Ensure all asset paths are absolute
    htmlContent = htmlContent.replace(/\.\/assets\//g, '/assets/');
    htmlContent = htmlContent.replace(/\.\/favicon/g, '/favicon');

    if (route === 'wallet') {
      htmlContent = htmlContent
        .replace(/<title>.*?<\/title>/, '<title>Personal Vault | Mahim</title>')
        .replace(
          /<meta name="robots" content=".*?" \/>/,
          '<meta name="robots" content="noindex, nofollow, noarchive, nosnippet" />'
        )
        .replace(
          /class="bg-\[#fdfdfb\] text-\[#1a1a1a\]/,
          'class="bg-neutral-950 text-neutral-100'
        );
    } else if (routeData[route]) {
      const data = routeData[route];

      // 1. Replace Title & Meta Title
      htmlContent = htmlContent
        .replace(/<title>.*?<\/title>/, `<title>${data.title}</title>`)
        .replace(/<meta name="title" content=".*?" \/>/, `<meta name="title" content="${data.metaTitle}" />`);

      // 2. Replace Description
      htmlContent = htmlContent.replace(
        /<meta name="description" content=".*?" \/>/,
        `<meta name="description" content="${data.description}" />`
      );

      // 3. Replace Keywords
      htmlContent = htmlContent.replace(
        /<meta name="keywords" content=".*?" \/>/,
        `<meta name="keywords" content="${data.keywords}" />`
      );

      // 4. Replace Canonical
      htmlContent = htmlContent.replace(
        /<link rel="canonical" href=".*?" \/>/,
        `<link rel="canonical" href="${data.canonical}" />`
      );

      // 5. OpenGraph Tags
      htmlContent = htmlContent
        .replace(/<meta property="og:title" content=".*?" \/>/, `<meta property="og:title" content="${data.ogTitle}" />`)
        .replace(/<meta property="og:description" content=".*?" \/>/, `<meta property="og:description" content="${data.ogDescription}" />`)
        .replace(/<meta property="og:url" content=".*?" \/>/, `<meta property="og:url" content="${data.canonical}" />`)
        .replace(/<meta property="og:image" content=".*?" \/>/, `<meta property="og:image" content="${data.ogImage}" />`)
        .replace(/<meta property="og:image:secure_url" content=".*?" \/>/, `<meta property="og:image:secure_url" content="${data.ogImage}" />`)
        .replace(/<link rel="image_src" href=".*?" \/>/, `<link rel="image_src" href="${data.ogImage}" />`);

      // 6. Twitter Tags
      htmlContent = htmlContent
        .replace(/<meta property="twitter:title" content=".*?" \/>/, `<meta property="twitter:title" content="${data.twitterTitle}" />`)
        .replace(/<meta property="twitter:description" content=".*?" \/>/, `<meta property="twitter:description" content="${data.twitterDescription}" />`)
        .replace(/<meta property="twitter:url" content=".*?" \/>/, `<meta property="twitter:url" content="${data.canonical}" />`)
        .replace(/<meta property="twitter:image" content=".*?" \/>/, `<meta property="twitter:image" content="${data.twitterImage}" />`);

      // 7. Inject Route-Specific JSON-LD
      const jsonLdString = `<script type="application/ld+json">\n${JSON.stringify(data.jsonLd, null, 2)}\n</script>`;
      htmlContent = htmlContent.replace('</head>', `${jsonLdString}\n</head>`);

      // 8. Inject Pre-rendered Semantic HTML inside <div id="root"> for Googlebot & SEO Crawlers
      if (data.prerenderHtml) {
        htmlContent = htmlContent.replace(
          '<div id="root"></div>',
          `<div id="root">${data.prerenderHtml.trim()}</div>`
        );
      }
    }

    fs.writeFileSync(path.join(routeDir, 'index.html'), htmlContent, 'utf8');
  });


  // Enrich root dist/index.html with pre-rendered semantic navigation & classroom links for Googlebot crawler
  const rootHomepagePrerender = `
    <header class="sr-only">
      <h1>Mahim's World | মাহিম ইবনে খুদি</h1>
      <p>শিক্ষা, একাডেমি, প্রযুক্তি ও সৃষ্টিশীল ডিজিটাল অঙ্গন।</p>
      <nav aria-label="প্রধান নেভিগেশন">
        <ul>
          <li><a href="https://mahims.com/">হোম (Home)</a></li>
          <li><a href="https://mahims.com/classroom/">মাহিম ক্লাসরুম (Mahim's Classroom) — একাডেমি ও এডমিশন</a></li>
          <li><a href="https://mahims.com/portfolio/">পোর্টফোলিও (Portfolio)</a></li>
          <li><a href="https://mahims.com/blog/">ব্লগ (Blog)</a></li>
          <li><a href="https://mahims.com/chithi/">মাহিম চিঠি (Chithi)</a></li>
          <li><a href="https://mahims.com/salami/">মাহিম সালামি (Salami)</a></li>
          <li><a href="https://mahims.com/about/">আমার সম্পর্কে (About)</a></li>
          <li><a href="https://mahims.com/contact/">যোগাযোগ (Contact)</a></li>
        </ul>
      </nav>
    </header>
    <main class="sr-only">
      <section>
        <h2>মাহিম’স ক্লাসরুম (Mahim's Classroom) — একাডেমি ও এডমিশন প্ল্যাটফর্ম</h2>
        <p>এইচএসসি, এসএসসি ও বিশ্ববিদ্যালয় ভর্তি পরীক্ষার্থীদের জন্য নিবেদিত শিক্ষা প্ল্যাটফর্ম। কনসেপ্ট ক্লাস, স্মার্ট টেস্ট ইঞ্জিন ও মেন্টরশিপ। প্রতিষ্ঠাতা: মাহিম (Mahim Ibne Khudi, ঢাকা সেন্ট্রাল ইউনিভার্সিটি)।</p>
        <p>শিক্ষক ও মেন্টর প্যানেল:</p>
        <ul>
          <li><a href="https://mahims.com/classroom/mahim/">মাহিম (Mahim) — প্রতিষ্ঠাতা ও আইসিটি মেন্টর</a></li>
          <li><a href="https://mahims.com/classroom/suza/">আবু সালেহ সুজা (Abu Saleh Suza) — ইংরেজি মেন্টর</a></li>
          <li><a href="https://mahims.com/classroom/samiul/">সামিউল ইসলাম সোহরাব (Samiul Islam Sohrab) — বাংলা মেন্টর</a></li>
          <li><a href="https://mahims.com/classroom/mithen/">মিশকাত শরীফ মিথেন (Mishkat Sharif Mithen) — সাধারণ জ্ঞান মেন্টর</a></li>
          <li><a href="https://mahims.com/classroom/swocchol/">স্বচ্ছল কুমার কর্মকার (Swocchol Kumar Karmokar) — বিজ্ঞান ও গণিত মেন্টর</a></li>
        </ul>
        <p><a href="https://mahims.com/classroom/">মাহিম’স ক্লাসরুমে প্রবেশ করুন</a></p>
      </section>
    </main>
  `;
  let enrichedRoot = rootIndexHtml.replace(
    '<div id="root"></div>',
    '<div id="root">' + rootHomepagePrerender.trim() + '</div>'
  );
  fs.writeFileSync(path.join(distDir, 'index.html'), enrichedRoot, 'utf8');
  console.log('✅ Injected semantic pre-rendered links into root dist/index.html');

  console.log('✅ Clean route directories created in dist with pre-rendered semantic HTML and JSON-LD: ' + routes.join(', '));
}
