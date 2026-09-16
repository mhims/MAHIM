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
  'classroom/courses',
  'classroom/courses/octal-1-hsc-ict',
  'classroom/courses/bangla-boss-2-course',
  'classroom/instructor',
  'classroom/instructors',
  'classroom/courses/mentorship',
  'classroom/mentorship',
  'classroom/courses/mentorship/mahim-ibn-khudi',
  'classroom/courses/mentorship/samiul-islam-sohorab',
  'classroom/courses/mentorship/abu-saleh-suza',
  'classroom/courses/mentorship/mishkat-sharif-mithen',
  'classroom/courses/mentorship/mentorship-program-combo',
  'classroom/courses/mentorship/suza',
  'classroom/courses/mentorship/mithen',
  'classroom/courses/mentorship/samiul',
  'classroom/courses/mentorship/mahim',
  'classroom/courses/mentorship/combo',
  'classroom/courses/mentorship/swocchol',
  'courses/mentorship',
  'courses/mentorship/mahim-ibn-khudi',
  'courses/mentorship/samiul-islam-sohorab',
  'courses/mentorship/abu-saleh-suza',
  'courses/mentorship/mishkat-sharif-mithen',
  'courses/mentorship/mentorship-program-combo',
  'courses/mentorship/mahim',
  'courses/mentorship/samiul',
  'courses/mentorship/suza',
  'courses/mentorship/mithen',
  'courses/mentorship/combo',
  'classroom/mahim',
  'classroom/samiul',
  'classroom/suza',
  'classroom/mithen',
  'classroom/swocchol',
  'portfolio',
  'thoughts'
];

const siteUrl = 'https://mahims.com';
const defaultOgImage = `${siteUrl}/assets/og-main.png`;
const classroomOgImage = `${siteUrl}/assets/og-classroom.jpg`;
const chithiOgImage = `${siteUrl}/assets/og-chithi.jpg`;
const salamiOgImage = `${siteUrl}/assets/og-salami.jpg`;
const thoughtsOgImage = 'https://res.cloudinary.com/drvyjj7td/image/upload/v1789574512/think-with-mahim_yku7br.jpg';

const routeData = {
  classroom: {
    title: "Mahims Classroom | Mahim Classroom (Mahim's Classroom) — মাহিম ক্লাসরুম | একাডেমি ও এডমিশন",
    metaTitle: "Mahims Classroom | Mahim Classroom — মাহিম ক্লাসরুম",
    description: "Mahims Classroom (Mahim Classroom / Mahim's Classroom) - মাহিম ইবনে খুদি এর অফিসিয়াল অ্যাকাডেমিক লার্নিং ও এডমিশন টেস্ট প্ল্যাটফর্ম। এইচএসসি আইসিটি, ভার্সিটি এডমিশন এক্সাম ব্যাচ, লাইভ কুইজ ও কনসেপ্ট ক্লাস। শিক্ষক প্যানেল: মাহিম (Mahim), আবু সালেহ সুজা (Abu Saleh Suza), সামিউল ইসলাম সোহরাব (Samiul Islam Sohrab), মিশকাত শরীফ মিথেন (Mishkat Sharif Mithen), স্বচ্ছল কুমার কর্মকার (Swocchol Kumar Karmokar)।",
    keywords: "Mahims Classroom, Mahim Classroom, mahims classroom, mahim classroom, Mahim's Classroom, মাহিম ক্লাসরুম, মাহিমস ক্লাসরুম, mahim academy, mahims.com/classroom, Mahim Ibne Khudi, এইচএসসি আইসিটি, ভার্সিটি এডমিশন এক্সাম ব্যাচ, এসএসসি স্মার্ট এক্সাম",
    canonical: `${siteUrl}/classroom/`,
    ogTitle: "Mahims Classroom | Mahim Classroom (Mahim's Classroom) | মাহিম ক্লাসরুম",
    ogDescription: "Official educational platform: Mahims Classroom (Mahim Classroom / Mahim's Classroom). এইচএসসি ও বিশ্ববিদ্যালয় ভর্তি পরীক্ষার্থীদের জন্য স্মার্ট টেস্ট ইঞ্জিন, নিয়মিত কুইজ ও কনসেপ্ট ক্লাস।",
    ogImage: classroomOgImage,
    twitterTitle: "Mahims Classroom | Mahim Classroom | মাহিম ক্লাসরুম",
    twitterDescription: "Official educational platform: Mahims Classroom (Mahim Classroom / Mahim's Classroom). এইচএসসি ও ভর্তি পরীক্ষার্থীদের জন্য স্মার্ট অনলাইন টেস্ট ও একাডেমি।",
    twitterImage: classroomOgImage,
    jsonLd: {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "BreadcrumbList",
          "name": "মাহিম’স ক্লাসরুম (Mahim's Classroom)",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "হোম (Home)", "item": "https://mahims.com/" },
            { "@type": "ListItem", "position": 2, "name": "মাহিম’স ক্লাসরুম (Mahim's Classroom)", "item": "https://mahims.com/classroom/" }
          ]
        },
        {
          "@type": "WebPage",
          "@id": "https://mahims.com/classroom/#webpage",
          "url": "https://mahims.com/classroom/",
          "name": "Mahim's Classroom | Mahims Classroom | মাহিম ক্লাসরুম — একাডেমি ও এডমিশন প্ল্যাটফর্ম",
          "alternateName": [
            "Mahims Classroom",
            "mahims classroom",
            "Mahim Classroom",
            "mahim classroom",
            "Mahim's Classroom",
            "mahim's classroom",
            "মাহিম ক্লাসরুম",
            "মাহিমস ক্লাসরুম",
            "মাহিম’স ক্লাসরুম"
          ],
          "description": "Mahim's Classroom (Mahims Classroom / Mahim Classroom / মাহিম ক্লাসরুম) - Official online academic learning and competitive exam platform by Mahim Ibne Khudi.",
          "isPartOf": {
            "@type": "WebSite",
            "@id": "https://mahims.com/#website",
            "name": "Mahim's World",
            "url": "https://mahims.com/"
          },
          "about": {
            "@id": "https://mahims.com/classroom#organization"
          },
          "inLanguage": ["en", "bn"]
        },
        {
          "@type": "EducationalOrganization",
          "@id": "https://mahims.com/classroom#organization",
          "name": "Mahim's Classroom",
          "alternateName": [
            "Mahim Classroom",
            "Mahims Classroom",
            "mahim classroom",
            "mahims classroom",
            "mahim's classroom",
            "মাহিম ক্লাসরুম",
            "মাহিমস ক্লাসরুম",
            "মাহিম’স ক্লাসরুম"
          ],
          "slogan": "Smart Concept Classes & Live Test Series (স্মার্ট কনসেপ্ট ক্লাস ও লাইভ টেস্ট সিরিজ)",
          "url": "https://mahims.com/classroom/",
          "logo": "https://mahims.com/assets/og-classroom.jpg",
          "image": classroomOgImage,
          "description": "Mahim's Classroom (also recognized as Mahim Classroom or Mahims Classroom) is an online academic learning, HSC ICT, and university admission test platform by Mahim Ibne Khudi.",
          "disambiguatingDescription": "Mahim's Classroom is an educational platform and online exam engine in Bangladesh founded by Mahim Ibne Khudi, distinct from locations in Mahim Mumbai.",
          "founder": {
            "@type": "Person",
            "name": "Mahim Ibne Khudi",
            "alternateName": ["মাহিম", "মাহিম ইবনে খুদি", "Mahim", "Mahim Khudi"],
            "jobTitle": "প্রতিষ্ঠাতা ও চিফ মেন্টর",
            "alumniOf": "Dhaka Central University",
            "url": "https://mahims.com/classroom/mahim/"
          },
          "parentOrganization": {
            "@type": "Organization",
            "name": "Mahim's World",
            "url": "https://mahims.com/"
          },
          "knowsAbout": [
            "এইচএসসি আইসিটি (HSC ICT)",
            "ভার্সিটি এডমিশন টেস্ট (University Admission)",
            "মেডিকেল ভর্তি প্রস্তুতি",
            "ইংরেজি গ্রামার (English Grammar)",
            "বাংলা সাহিত্য ও ব্যাকরণ",
            "সাধারণ জ্ঞান (General Knowledge)",
            "বিজ্ঞান ও গণিত (Science & Math)"
          ],
          "member": [
            { "@type": "Person", "name": "আবু সালেহ সুজা (Abu Saleh Suza)", "jobTitle": "ইংরেজি মেন্টর", "alumniOf": "MBSTU Pharmacy & GST 51st", "url": "https://mahims.com/classroom/suza/" },
            { "@type": "Person", "name": "সামিউল ইসলাম সোহরাব (Samiul Islam Sohrab)", "jobTitle": "বাংলা মেন্টর", "alumniOf": "Daffodil International University", "url": "https://mahims.com/classroom/samiul/" },
            { "@type": "Person", "name": "মিশকাত শরীফ মিথেন (Mishkat Sharif Mithen)", "jobTitle": "সাধারণ জ্ঞান মেন্টর", "alumniOf": "Dhaka Central University", "url": "https://mahims.com/classroom/mithen/" },
            { "@type": "Person", "name": "স্বচ্ছল কুমার কর্মকার (Swocchol Kumar Karmokar)", "jobTitle": "বিজ্ঞান ও গণিত মেন্টর", "alumniOf": "United International University", "url": "https://mahims.com/classroom/swocchol/" }
          ]
        },
        {
          "@type": "Course",
          "name": "ভার্সিটি এডমিশন স্মার্ট এক্সাম ব্যাচ — Mahim's Classroom",
          "description": "অনলাইন লাইভ কুইজ, নেগেটিভ মার্কিং ট্র্যাকিং, ইনস্ট্যান্ট মেরিট লিস্ট এবং বিগত ২০ বছরের প্রশ্ন এনালাইসিস ভিত্তিক পূর্ণাঙ্গ এক্সাম সিরিজ।",
          "provider": {
            "@type": "EducationalOrganization",
            "name": "Mahim's Classroom",
            "sameAs": "https://mahims.com/classroom/"
          },
          "offers": [
            {
              "@type": "Offer",
              "category": "Free",
              "price": "0",
              "priceCurrency": "BDT",
              "availability": "https://schema.org/InStock"
            }
          ],
          "hasCourseInstance": [
            {
              "@type": "CourseInstance",
              "courseMode": "Online",
              "courseWorkload": "PT20H",
              "instructor": [
                {
                  "@type": "Person",
                  "name": "Mahim Ibne Khudi",
                  "url": "https://mahims.com/classroom/mahim/"
                },
                {
                  "@type": "Person",
                  "name": "Abu Saleh Suza",
                  "url": "https://mahims.com/classroom/suza/"
                }
              ]
            }
          ]
        },
        {
          "@type": "Course",
          "name": "এইচএসসি আইসিটি কনসেপ্ট ক্লাস ও টেস্ট সিরিজ — Mahim's Classroom",
          "description": "এইচএসসি পরীক্ষার্থীদের জন্য তথ্য ও যোগাযোগ প্রযুক্তি (ICT) বিষয়ের পূর্ণাঙ্গ অধ্যায়ভিত্তিক কনসেপ্ট ক্লাস, সৃজনশীল প্রশ্ন সমাধান ও অনলাইন টেস্ট সিরিজ।",
          "provider": {
            "@type": "EducationalOrganization",
            "name": "Mahim's Classroom",
            "sameAs": "https://mahims.com/classroom/"
          },
          "offers": [
            {
              "@type": "Offer",
              "category": "Free",
              "price": "0",
              "priceCurrency": "BDT",
              "availability": "https://schema.org/InStock"
            }
          ],
          "hasCourseInstance": [
            {
              "@type": "CourseInstance",
              "courseMode": "Online",
              "instructor": {
                "@type": "Person",
                "name": "Mahim Ibne Khudi",
                "url": "https://mahims.com/classroom/mahim/"
              }
            }
          ]
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
                "text": "mahims.com/classroom/ এ গিয়ে পছন্দসই কোর্স বা এক্সাম ব্যাচে 'রেজিস্ট্রেশন করুন' বাটনে ক্লিক করে নাম ও তথ্য দিয়ে সরাসরি যুক্ত হওয়া যায়।"
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
                <span class="text-xs text-orange-600 font-semibold">Mahim Classroom • মাহিম ক্লাসরুম — একাডেমি ও এডমিশন প্ল্যাটফর্ম</span>
              </div>
            </a>
            <a href="/" class="text-xs font-bold px-3 py-1.5 rounded-lg border border-zinc-300 text-zinc-700 hover:bg-zinc-100">হোমে ফিরুন</a>
          </div>
        </header>
        
        <main class="max-w-5xl mx-auto px-4 py-12">
          <section class="text-center space-y-4 mb-14">
            <span class="inline-block px-3 py-1 rounded-full text-xs font-bold bg-orange-100 text-orange-800 border border-orange-200">Official Educational Portal • এডমিশন ও একাডেমি স্পেশাল</span>
            <h1 class="text-3xl sm:text-5xl font-black text-zinc-950 tracking-tight">Mahim's Classroom | Mahims Classroom (Mahim Classroom / মাহিম ক্লাসরুম)</h1>
            <p class="text-base sm:text-lg text-zinc-600 max-w-3xl mx-auto leading-relaxed">
              Welcome to <strong>Mahim's Classroom</strong> (commonly searched as <strong>Mahims Classroom</strong> or <strong>Mahim Classroom</strong>). এইচএসসি, এসএসসি ও বিশ্ববিদ্যালয় ভর্তি প্রস্তুতি পরীক্ষার্থীদের জন্য নির্ভরযোগ্য শিক্ষা উদ্যোগ। কনসেপ্ট ভিত্তিক পাঠদান, স্মার্ট অনলাইন এক্সাম প্ল্যাটফর্ম ও নিয়মিত অ্যাকাডেমিক মেন্টরশিপ।
            </p>
          </section>

          <!-- English About Section for Google Indexing -->
          <section class="p-6 rounded-2xl bg-white border border-zinc-200 shadow-xs space-y-3 mb-12">
            <h2 class="text-xl font-bold text-zinc-900">About Mahim's Classroom (Mahims Classroom / Mahim Classroom)</h2>
            <p class="text-sm text-zinc-600 leading-relaxed">
              <strong>Mahim's Classroom</strong> (also popularly known as <strong>Mahims Classroom</strong>, <strong>mahims classroom</strong>, or <strong>Mahim Classroom</strong> / মাহিম ক্লাসরুম) is an online academic learning and competitive test platform founded by <strong>Mahim Ibne Khudi</strong> (Department of Political Science, Dhaka Central University / Dhaka College Campus). The platform provides HSC ICT classes, university admission model tests, negative marking evaluations, and academic mentorship for students across Bangladesh.
            </p>
          </section>

          <section class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
            <article class="p-6 rounded-2xl bg-white border border-zinc-200 shadow-xs space-y-3">
              <span class="px-2.5 py-0.5 rounded text-xs font-bold bg-orange-50 text-orange-700 border border-orange-200">এক্সাম সিরিজ • Exam Engine</span>
              <h2 class="text-xl font-bold text-zinc-900">Mahim Classroom Smart Exam Series (ভার্সিটি এডমিশন এক্সাম ব্যাচ)</h2>
              <p class="text-sm text-zinc-600 leading-relaxed">অনলাইন লাইভ কুইজ, নেগেটিভ মার্কিং ট্র্যাকিং, ইনস্ট্যান্ট মেরিট লিস্ট এবং বিগত ২০ বছরের প্রশ্ন এনালাইসিস ভিত্তিক এক্সাম প্ল্যাটফর্ম।</p>
              <ul class="text-xs text-zinc-600 space-y-1 pt-2 list-disc pl-4">
                <li>স্মার্ট অনলাইন এক্সাম ও টাইমার ইঞ্জিন (Online Exam Engine with Timer)</li>
                <li>নেগেটিভ মার্কিং ও একিউরেসি অ্যানালাইসিস (Negative Marking Analysis)</li>
                <li>চ্যাপ্টারভিত্তিক ও ফুল লেন্থ মডেল টেস্ট (Chapter-wise Model Tests)</li>
              </ul>
            </article>

            <article class="p-6 rounded-2xl bg-white border border-zinc-200 shadow-xs space-y-3">
              <span class="px-2.5 py-0.5 rounded text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">কনসেপ্ট ক্লাস • Concept Lectures</span>
              <h2 class="text-xl font-bold text-zinc-900">HSC ICT & Special Concept Classes (এইচএসসি আইসিটি ও বাংলা স্পেশাল)</h2>
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
              <h2 class="text-2xl font-bold text-white">Mahim's Classroom Faculty & Mentors</h2>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
              <div class="p-5 rounded-2xl bg-zinc-800/80 border border-zinc-700 space-y-2">
                <a href="/classroom/mahim" class="text-lg font-bold text-orange-400 hover:underline">মাহিম ইবনে খুদি (Mahim Ibne Khudi)</a>
                <p class="text-xs text-zinc-300 font-semibold">ঢাকা সেন্ট্রাল ইউনিভার্সিটি • প্রতিষ্ঠাতা, Mahim's Classroom (Mahim Classroom)</p>
                <p class="text-xs text-zinc-400 leading-relaxed">রাষ্ট্রবিজ্ঞান বিভাগ, ঢাকা কলেজ ক্যাম্পাস। শিক্ষার্থীদের একাডেমিক প্রস্তুতি ও স্মার্ট এক্সাম পদ্ধতির উদ্ভাবক।</p>
              </div>
              <div class="p-5 rounded-2xl bg-zinc-800/80 border border-zinc-700 space-y-2">
                <a href="/classroom/samiul" class="text-lg font-bold text-orange-400 hover:underline">সামিউল ইসলাম সোহরাব (Samiul Islam Sohrab)</a>
                <p class="text-xs text-zinc-300 font-semibold">ফাউন্ডার, সামনাদ একাডেমি • মেন্টর, Mahim's Classroom</p>
                <p class="text-xs text-zinc-400 leading-relaxed">ড্যাফোডিল ইন্টারন্যাশনাল ইউনিভার্সিটি (সফটওয়্যার ইঞ্জিনিয়ারিং - DIU SWE)। স্কিল ও অ্যাকাডেমিক মেন্টরশিপ।</p>
              </div>
              <div class="p-5 rounded-2xl bg-zinc-800/80 border border-zinc-700 space-y-2">
                <a href="/classroom/suza" class="text-lg font-bold text-orange-400 hover:underline">আবু সালেহ সুজা (Abu Saleh Suza)</a>
                <p class="text-xs text-zinc-300 font-semibold">ফার্মেসি বিভাগ • মওলানা ভাসানী বিজ্ঞান ও প্রযুক্তি বিশ্ববিদ্যালয় (MBSTU)</p>
                <p class="text-xs text-zinc-400 leading-relaxed">গুচ্ছ ভর্তি পরীক্ষা ২০২৪-২৫ সেশনে ৫১তম মেধাক্রম (GST Rank 51)। ইংরেজি মেন্টর, Mahim Classroom।</p>
              </div>
              <div class="p-5 rounded-2xl bg-zinc-800/80 border border-zinc-700 space-y-2">
                <a href="/classroom/mithen" class="text-lg font-bold text-orange-400 hover:underline">মিশকাত শরীফ মিথেন (Mishkat Sharif Mithen)</a>
                <p class="text-xs text-zinc-300 font-semibold">বেগম রোকেয়া বিশ্ববিদ্যালয় (BRUR) • মেন্টর, Mahim's Classroom</p>
                <p class="text-xs text-zinc-400 leading-relaxed">ঢাকা সেন্ট্রাল ইউনিভার্সিটি গণিত বিভাগ। এসএসসি ও এইচএসসি বিজ্ঞান বিভাগে জিপিএ ৫.০০ প্রাপ্ত।</p>
              </div>
              <div class="p-5 rounded-2xl bg-zinc-800/80 border border-zinc-700 space-y-2">
                <a href="/classroom/swocchol" class="text-lg font-bold text-orange-400 hover:underline">স্বচ্ছল কুমার কর্মকার (Swocchol Kumar Karmokar)</a>
                <p class="text-xs text-zinc-300 font-semibold">কম্পিউটার সাইন্স এন্ড ইঞ্জিনিয়ারিং (UIU CSE) • ইউনাইটেড ইন্টারন্যাশনাল ইউনিভার্সিটি</p>
                <p class="text-xs text-zinc-400 leading-relaxed">প্রোগ্রামিং, অ্যালগরিদম ও উচ্চতর গণিত মেন্টর, Mahim's Classroom।</p>
              </div>
            </div>
          </section>

          <section class="space-y-4">
            <h2 class="text-xl font-bold text-zinc-900 border-b pb-2">সাধারণ প্রশ্নোত্তর (FAQ) — Mahim's Classroom</h2>
            <div class="space-y-3">
              <div class="p-4 rounded-xl bg-white border border-zinc-200">
                <h3 class="font-bold text-sm text-zinc-900">What is Mahim's Classroom (Mahim Classroom / মাহিম ক্লাসরুম)?</h3>
                <p class="text-xs text-zinc-600 mt-1">Mahim's Classroom (also searched as Mahim Classroom or Mahims Classroom) is an educational platform founded by Mahim Ibne Khudi for HSC, SSC, and university admission candidates in Bangladesh, featuring online smart exams, negative marking analysis, and concept lectures.</p>
              </div>
              <div class="p-4 rounded-xl bg-white border border-zinc-200">
                <h3 class="font-bold text-sm text-zinc-900">How to participate in Mahim's Classroom tests?</h3>
                <p class="text-xs text-zinc-600 mt-1">Visit mahims.com/classroom/ and select any live exam or model test batch to attempt timed online tests and view instant merit ranks and answer solutions.</p>
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
      "@graph": [
        {
          "@type": "BreadcrumbList",
          "name": "মাহিম ইবনে খুদি — মাহিম'স ক্লাসরুম",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "হোম (Home)", "item": "https://mahims.com/" },
            { "@type": "ListItem", "position": 2, "name": "মাহিম’স ক্লাসরুম (Mahim's Classroom)", "item": "https://mahims.com/classroom/" },
            { "@type": "ListItem", "position": 3, "name": "মাহিম ইবনে খুদি", "item": "https://mahims.com/classroom/mahim/" }
          ]
        },
        {
          "@type": "ProfilePage",
          "@id": `${siteUrl}/classroom/mahim/#webpage`,
          "url": `${siteUrl}/classroom/mahim/`,
          "name": "মাহিম ইবনে খুদি (Mahim Ibne Khudi) — শিক্ষক ও মেন্টর প্রোফাইল | মাহিম'স ক্লাসরুম",
          "isPartOf": {
            "@type": "WebSite",
            "@id": "https://mahims.com/#website",
            "name": "Mahim's World",
            "url": "https://mahims.com/"
          },
          "mainEntity": {
            "@type": "Person",
            "@id": `${siteUrl}/classroom/mahim/#person`,
            "name": "মাহিম ইবনে খুদি",
            "givenName": "Mahim",
            "familyName": "Ibne Khudi",
            "alternateName": ["Mahim Ibne Khudi", "Mahim", "Mahim Khudi", "মাহিম", "মাহিমস"],
            "url": `${siteUrl}/classroom/mahim/`,
            "image": "https://res.cloudinary.com/drvyjj7td/image/upload/v1788708908/behance_pp_spfumh.jpg",
            "jobTitle": "প্রতিষ্ঠাতা ও প্রধান মেন্টর (Founder & Lead Mentor)",
            "worksFor": {
              "@type": "EducationalOrganization",
              "name": "Mahim's Classroom (মাহিম'স ক্লাসরুম)",
              "url": `${siteUrl}/classroom/`
            },
            "alumniOf": {
              "@type": "CollegeOrUniversity",
              "name": "ঢাকা সেন্ট্রাল ইউনিভার্সিটি (Dhaka Central University, Dhaka College Campus)"
            },
            "sameAs": [
              "https://facebook.com/mahim2005",
              "https://www.linkedin.com/in/mahimibnekhudi",
              "https://mahims.com/"
            ],
            "description": "মাহিম ইবনে খুদি (Mahim Ibne Khudi) - ঢাকা সেন্ট্রাল ইউনিভার্সিটির শিক্ষার্থী ও মাহিম'স ক্লাসরুমের প্রতিষ্ঠাতা। বিজ্ঞান বিভাগ থেকে এসএসসি ও এইচএসসি উভয় পরীক্ষায় দিনাজপুর বোর্ড থেকে জিপিএ ৫.০০ প্রাপ্ত।",
            "knowsAbout": [
              "HSC ICT Preparation",
              "University Admission Test",
              "Political Science",
              "Online Exam Engines",
              "Dinajpur Board Science GPA 5.00",
              "Academic Mentoring"
            ]
          }
        }
      ]
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
      "@graph": [
        {
          "@type": "BreadcrumbList",
          "name": "সামিউল ইসলাম সোহরাব — মাহিম'স ক্লাসরুম",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "হোম (Home)", "item": "https://mahims.com/" },
            { "@type": "ListItem", "position": 2, "name": "মাহিম’স ক্লাসরুম (Mahim's Classroom)", "item": "https://mahims.com/classroom/" },
            { "@type": "ListItem", "position": 3, "name": "সামিউল ইসলাম সোহরাব", "item": "https://mahims.com/classroom/samiul/" }
          ]
        },
        {
          "@type": "ProfilePage",
          "@id": `${siteUrl}/classroom/samiul/#webpage`,
          "url": `${siteUrl}/classroom/samiul/`,
          "name": "সামিউল ইসলাম সোহরাব (Samiul Islam Sohrab) — মেন্টর প্রোফাইল | মাহিম'স ক্লাসরুম",
          "isPartOf": {
            "@type": "WebSite",
            "@id": "https://mahims.com/#website",
            "name": "Mahim's World",
            "url": "https://mahims.com/"
          },
          "mainEntity": {
            "@type": "Person",
            "@id": `${siteUrl}/classroom/samiul/#person`,
            "name": "সামিউল ইসলাম সোহরাব",
            "alternateName": ["Samiul Islam Sohrab", "Samiul Islam", "Samiul Sohrab", "Samiul Samnad", "সামিউল ইসলাম"],
            "url": `${siteUrl}/classroom/samiul/`,
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
                "url": `${siteUrl}/classroom/`
              }
            ],
            "alumniOf": {
              "@type": "CollegeOrUniversity",
              "name": "Daffodil International University (DIU)"
            },
            "description": "সামিউল ইসলাম সোহরাব - ড্যাফোডিল ইন্টারন্যাশনাল ইউনিভার্সিটির সফটওয়্যার ইঞ্জিনিয়ারিং শিক্ষার্থী ও সামনাদ একাডেমির প্রতিষ্ঠাতা।",
            "knowsAbout": ["Software Engineering", "Programming", "Career Mentorship", "Web Development", "Academic Guidance"]
          }
        }
      ]
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
      "@graph": [
        {
          "@type": "BreadcrumbList",
          "name": "আবু সালেহ সুজা — মাহিম'স ক্লাসরুম",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "হোম (Home)", "item": "https://mahims.com/" },
            { "@type": "ListItem", "position": 2, "name": "মাহিম’স ক্লাসরুম (Mahim's Classroom)", "item": "https://mahims.com/classroom/" },
            { "@type": "ListItem", "position": 3, "name": "আবু সালেহ সুজা", "item": "https://mahims.com/classroom/suza/" }
          ]
        },
        {
          "@type": "ProfilePage",
          "@id": `${siteUrl}/classroom/suza/#webpage`,
          "url": `${siteUrl}/classroom/suza/`,
          "name": "আবু সালেহ সুজা (Abu Saleh Suza) — মেন্টর প্রোফাইল | মাহিম'স ক্লাসরুম",
          "isPartOf": {
            "@type": "WebSite",
            "@id": "https://mahims.com/#website",
            "name": "Mahim's World",
            "url": "https://mahims.com/"
          },
          "mainEntity": {
            "@type": "Person",
            "@id": `${siteUrl}/classroom/suza/#person`,
            "name": "আবু সালেহ সুজা",
            "alternateName": ["Abu Saleh Suza", "Abu Saleh", "Md Abu Saleh Suza", "Suza"],
            "url": `${siteUrl}/classroom/suza/`,
            "image": "https://res.cloudinary.com/drvyjj7td/image/upload/v1789229348/518363223_1616327812659453_3831296542395096165_n_1_fak2cg.jpg",
            "jobTitle": "মেন্টর — ফার্মেসি ও বায়োলজি (Faculty & Mentor)",
            "worksFor": {
              "@type": "EducationalOrganization",
              "name": "Mahim's Classroom (মাহিম'স ক্লাসরুম)",
              "url": `${siteUrl}/classroom/`
            },
            "alumniOf": {
              "@type": "CollegeOrUniversity",
              "name": "Mawlana Bhashani Science and Technology University (MBSTU)"
            },
            "description": "আবু সালেহ সুজা - ফার্মেসি বিভাগ, মওলানা ভাসানী বিজ্ঞান ও প্রযুক্তি বিশ্ববিদ্যালয় (MBSTU)। গুচ্ছ ভর্তি পরীক্ষায় ৫১তম মেধাক্রম অর্জনকারী।",
            "knowsAbout": ["Pharmacy", "Biology", "GST Admission Test", "Botany", "Agriculture Science", "Competitive Exam Strategy"]
          }
        }
      ]
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
      "@graph": [
        {
          "@type": "BreadcrumbList",
          "name": "মিশকাত শরীফ মিথেন — মাহিম'স ক্লাসরুম",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "হোম (Home)", "item": "https://mahims.com/" },
            { "@type": "ListItem", "position": 2, "name": "মাহিম’স ক্লাসরুম (Mahim's Classroom)", "item": "https://mahims.com/classroom/" },
            { "@type": "ListItem", "position": 3, "name": "মিশকাত শরীফ মিথেন", "item": "https://mahims.com/classroom/mithen/" }
          ]
        },
        {
          "@type": "ProfilePage",
          "@id": `${siteUrl}/classroom/mithen/#webpage`,
          "url": `${siteUrl}/classroom/mithen/`,
          "name": "মিশকাত শরীফ মিথেন (Mishkat Sharif Mithen) — মেন্টর প্রোফাইল | মাহিম'স ক্লাসরুম",
          "isPartOf": {
            "@type": "WebSite",
            "@id": "https://mahims.com/#website",
            "name": "Mahim's World",
            "url": "https://mahims.com/"
          },
          "mainEntity": {
            "@type": "Person",
            "@id": `${siteUrl}/classroom/mithen/#person`,
            "name": "মিশকাত শরীফ মিথেন",
            "alternateName": ["Mishkat Sharif Mithen", "Mishkat Sharif", "Mithen", "মিশকাত শরীফ"],
            "url": `${siteUrl}/classroom/mithen/`,
            "image": "https://res.cloudinary.com/drvyjj7td/image/upload/v1789229549/mithen10_nrizvj.png",
            "jobTitle": "ফাউন্ডার ও গণিত মেন্টর (Founder & Math Mentor)",
            "worksFor": [
              {
                "@type": "EducationalOrganization",
                "name": "Mithen Private Home (মিথেন প্রাইভেট হোম)"
              },
              {
                "@type": "EducationalOrganization",
                "name": "Mahim's Classroom (মাহিম'স ক্লাসরুম)",
                "url": `${siteUrl}/classroom/`
              }
            ],
            "alumniOf": {
              "@type": "CollegeOrUniversity",
              "name": "Begum Rokeya University, Rangpur (BRUR)"
            },
            "description": "মিশকাত শরীফ মিথেন - বেগম রোকেয়া বিশ্ববিদ্যালয় ও ঢাকা সেন্ট্রাল ইউনিভার্সিটি গণিত বিভাগের শিক্ষার্থী এবং মিথেন প্রাইভেট হোমের প্রতিষ্ঠাতা।",
            "knowsAbout": ["Mathematics", "Physics", "SSC & HSC Science", "Board Exam Preparation", "Analytical Problem Solving"]
          }
        }
      ]
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
      "@graph": [
        {
          "@type": "BreadcrumbList",
          "name": "স্বচ্ছল কুমার কর্মকার — মাহিম'স ক্লাসরুম",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "হোম (Home)", "item": "https://mahims.com/" },
            { "@type": "ListItem", "position": 2, "name": "মাহিম’স ক্লাসরুম (Mahim's Classroom)", "item": "https://mahims.com/classroom/" },
            { "@type": "ListItem", "position": 3, "name": "স্বচ্ছল কুমার কর্মকার", "item": "https://mahims.com/classroom/swocchol/" }
          ]
        },
        {
          "@type": "ProfilePage",
          "@id": `${siteUrl}/classroom/swocchol/#webpage`,
          "url": `${siteUrl}/classroom/swocchol/`,
          "name": "স্বচ্ছল কুমার কর্মকার (Swocchol Kumar Karmokar) — মেন্টর প্রোফাইল | মাহিম'স ক্লাসরুম",
          "isPartOf": {
            "@type": "WebSite",
            "@id": "https://mahims.com/#website",
            "name": "Mahim's World",
            "url": "https://mahims.com/"
          },
          "mainEntity": {
            "@type": "Person",
            "@id": `${siteUrl}/classroom/swocchol/#person`,
            "name": "স্বচ্ছল কুমার কর্মকার",
            "alternateName": ["Swocchol Kumar Karmokar", "Swocchol Karmakar", "Swocchol Kumar", "Swocchol", "স্বচ্ছল কর্মকার"],
            "url": `${siteUrl}/classroom/swocchol/`,
            "image": "https://res.cloudinary.com/drvyjj7td/image/upload/v1789231884/swocchol_uxtt4r.png",
            "jobTitle": "মেন্টর — কম্পিউটার সাইন্স ও ম্যাথমেটিক্স (Mentor)",
            "worksFor": {
              "@type": "EducationalOrganization",
              "name": "Mahim's Classroom (মাহিম'স ক্লাসরুম)",
              "url": `${siteUrl}/classroom/`
            },
            "alumniOf": {
              "@type": "CollegeOrUniversity",
              "name": "United International University (UIU)"
            },
            "description": "স্বচ্ছল কুমার কর্মকার - কম্পিউটার সাইন্স এন্ড ইঞ্জিনিয়ারিং (CSE), ইউনাইটেড ইন্টারন্যাশনাল ইউনিভার্সিটি (UIU)। মেন্টর — মাহিম'স ক্লাসরুম।",
            "knowsAbout": ["Computer Science", "CSE", "Data Structures", "Algorithms", "Mathematics", "Programming", "Problem Solving"]
          }
        }
      ]
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

  'classroom/courses': {
    title: "সকল কোর্স ও ব্যাচসমূহ | Mahims Classroom (মাহিম ক্লাসরুম)",
    metaTitle: "সকল কোর্স ও ব্যাচসমূহ | Mahims Classroom",
    description: "মাহিম'স ক্লাসরুমের সকল একাডেমিক ও এডমিশন কোর্স। এইচএসসি, বিশ্ববিদ্যালয় ভর্তি প্রস্তুতি, এসএসসি এবং জুনিয়র ফাউন্ডেশন ব্যাচের সম্পূর্ণ তালিকা, মেন্টর প্যানেল ও রেজিস্ট্রেশন।",
    keywords: "Mahims Classroom Courses, Mahim's Classroom Courses, মাহিম ক্লাসরুম কোর্স, এইচএসসি কোর্স, এডমিশন কোর্স, এসএসসি ব্যাচ, আইসিটি কোর্স, মাহিম ইবনে খুদি",
    canonical: `${siteUrl}/classroom/courses/`,
    ogTitle: "সকল কোর্স ও ব্যাচসমূহ | Mahims Classroom (মাহিম ক্লাসরুম)",
    ogDescription: "এইচএসসি ও এডমিশন প্রস্তুতির প্রিমিয়াম ব্যাচসমূহ, লাইভ সলভিং ও মেন্টরশীপ।",
    ogImage: classroomOgImage,
    twitterTitle: "সকল কোর্স ও ব্যাচসমূহ | Mahims Classroom",
    twitterDescription: "এইচএসসি ও এডমিশন প্রস্তুতির প্রিমিয়াম ব্যাচসমূহ, লাইভ সলভিং ও মেন্টরশীপ।",
    twitterImage: classroomOgImage,
    jsonLd: {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "BreadcrumbList",
          "name": "সকল কোর্স — Mahims Classroom",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "হোম (Home)", "item": "https://mahims.com/" },
            { "@type": "ListItem", "position": 2, "name": "মাহিম ক্লাসরুম (Classroom)", "item": "https://mahims.com/classroom/" },
            { "@type": "ListItem", "position": 3, "name": "সকল কোর্স (Courses)", "item": "https://mahims.com/classroom/courses/" }
          ]
        },
        {
          "@type": "CollectionPage",
          "@id": `${siteUrl}/classroom/courses/#webpage`,
          "url": `${siteUrl}/classroom/courses/`,
          "name": "সকল কোর্স ও ব্যাচসমূহ — Mahims Classroom",
          "description": "মাহিম ক্লাসরুমের সকল একাডেমিক ও এডমিশন কোর্সের তালিকা ও বিস্তারিত।"
        }
      ]
    },
    prerenderHtml: `
      <div class="min-h-screen bg-[#fffbf7] text-zinc-900 font-sans">
        <header class="border-b border-orange-200 bg-white/95 backdrop-blur-md sticky top-0 z-20">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
            <a href="/classroom/" class="flex items-center gap-3">
              <span class="w-9 h-9 rounded-xl bg-orange-600 text-white flex items-center justify-center font-bold text-lg">M</span>
              <div>
                <span class="font-black text-lg block leading-tight text-zinc-950">Mahims Classroom</span>
                <span class="text-xs text-orange-600 font-semibold">সকল কোর্স ও এডমিশন ব্যাচসমূহ</span>
              </div>
            </a>
            <a href="/classroom/" class="text-xs font-bold px-3 py-1.5 rounded-lg border border-orange-300 text-orange-900 hover:bg-orange-100">ক্লাসরুম হোম</a>
          </div>
        </header>

        <main class="max-w-5xl mx-auto px-4 py-12">
          <section class="text-center space-y-4 mb-12">
            <span class="inline-block px-3 py-1 rounded-full text-xs font-bold bg-orange-100 text-orange-800 border border-orange-200">একাডেমিক ও এডমিশন কোর্স</span>
            <h1 class="text-3xl sm:text-5xl font-black text-zinc-950 tracking-tight">সকল কোর্স ও ব্যাচসমূহ — Mahims Classroom</h1>
            <p class="text-base sm:text-lg text-zinc-600 max-w-2xl mx-auto leading-relaxed">
              এইচএসসি, বিশ্ববিদ্যালয় ভর্তি প্রস্তুতি, এসএসসি এবং জুনিয়র ফাউন্ডেশন ব্যাচের সম্পূর্ণ তালিকা, মেন্টর প্যানেল ও রেজিস্ট্রেশন।
            </p>
          </section>

          <section class="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div class="p-6 rounded-2xl bg-white border border-orange-200 shadow-sm">
              <h2 class="text-xl font-bold text-zinc-900">ভার্সিটি এডমিশন স্মার্ট এক্সাম ব্যাচ</h2>
              <p class="text-sm text-zinc-600 mt-2">ঢাকা বিশ্ববিদ্যালয়, জিএসটি গুচ্ছ ও পাবলিক বিশ্ববিদ্যালয় ভর্তি পরীক্ষার্থীদের জন্য পূর্ণাঙ্গ মডেল টেস্ট ও লাইভ সলভিং ক্লাস।</p>
              <a href="/classroom/courses/mentorship/" class="inline-block mt-4 text-xs font-bold text-orange-600 underline">মেন্টরশীপ প্রোগ্রাম দেখুন &rarr;</a>
            </div>
            <div class="p-6 rounded-2xl bg-white border border-orange-200 shadow-sm">
              <h2 class="text-xl font-bold text-zinc-900">এইচএসসি আইসিটি ফুল কোর্স</h2>
              <p class="text-sm text-zinc-600 mt-2">তথ্য ও যোগাযোগ প্রযুক্তি বিষয়ের সি প্রোগ্রামিং, এইচটিএমএল, ডাটাবেজ ও লজিক গেইট এর অধ্যায়ভিত্তিক বেসিক টু অ্যাডভান্সড কোর্স।</p>
              <a href="/classroom/mahim/" class="inline-block mt-4 text-xs font-bold text-orange-600 underline">ইন্সট্রাক্টর প্রোফাইল দেখুন &rarr;</a>
            </div>
          </section>
        </main>
      </div>
    `
  },

  'classroom/instructor': {
    title: "শিক্ষক ও মেন্টর প্যানেল | Mahims Classroom (মাহিম ক্লাসরুম)",
    metaTitle: "শিক্ষক ও মেন্টর প্যানেল | Mahims Classroom",
    description: "মাহিম'স ক্লাসরুমের শিক্ষক ও মেন্টর প্যানেল। ঢাকা সেন্ট্রাল ইউনিভার্সিটি, ড্যাফোডিল, এমবিএসটিইউ, বেরোবি ও ইউআইইউ-এর অভিজ্ঞ ইন্সট্রাক্টরদের পরিচিতি ও শিক্ষাগত প্রোফাইল।",
    keywords: "Mahims Classroom Instructors, শিক্ষক প্যানেল, মাহিম ইবনে খুদি, সামিউল ইসলাম সোহরাব, আবু সালেহ সুজা, মিশকাত শরীফ মিথেন, স্বচ্ছল কুমার কর্মকার",
    canonical: `${siteUrl}/classroom/instructor/`,
    ogTitle: "শিক্ষক ও মেন্টর প্যানেল | Mahims Classroom (মাহিম ক্লাসরুম)",
    ogDescription: "ঢাকা সেন্ট্রাল ইউনিভার্সিটি, ড্যাফোডিল, এমবিএসটিইউ, বেরোবি ও ইউআইইউ-এর অভিজ্ঞ শিক্ষক প্যানেল।",
    ogImage: classroomOgImage,
    twitterTitle: "শিক্ষক ও মেন্টর প্যানেল | Mahims Classroom",
    twitterDescription: "ঢাকা সেন্ট্রাল ইউনিভার্সিটি, ড্যাফোডিল, এমবিএসটিইউ, বেরোবি ও ইউআইইউ-এর অভিজ্ঞ শিক্ষক প্যানেল।",
    twitterImage: classroomOgImage,
    jsonLd: {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "BreadcrumbList",
          "name": "শিক্ষক ও মেন্টর প্যানেল — Mahims Classroom",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "হোম (Home)", "item": "https://mahims.com/" },
            { "@type": "ListItem", "position": 2, "name": "মাহিম ক্লাসরুম (Classroom)", "item": "https://mahims.com/classroom/" },
            { "@type": "ListItem", "position": 3, "name": "শিক্ষক প্যানেল (Instructors)", "item": "https://mahims.com/classroom/instructor/" }
          ]
        },
        {
          "@type": "CollectionPage",
          "@id": `${siteUrl}/classroom/instructor/#webpage`,
          "url": `${siteUrl}/classroom/instructor/`,
          "name": "শিক্ষক ও মেন্টর প্যানেল — Mahims Classroom",
          "description": "মাহিম ক্লাসরুমের সকল মেন্টর ও অভিজ্ঞ শিক্ষকবৃন্দের তালিকা ও প্রোফাইল।"
        }
      ]
    },
    prerenderHtml: `
      <div class="min-h-screen bg-[#fffbf7] text-zinc-900 font-sans">
        <header class="border-b border-orange-200 bg-white/95 backdrop-blur-md sticky top-0 z-20">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
            <a href="/classroom/" class="flex items-center gap-3">
              <span class="w-9 h-9 rounded-xl bg-orange-600 text-white flex items-center justify-center font-bold text-lg">M</span>
              <div>
                <span class="font-black text-lg block leading-tight text-zinc-950">Mahims Classroom</span>
                <span class="text-xs text-orange-600 font-semibold">শিক্ষক ও মেন্টর প্যানেল</span>
              </div>
            </a>
            <a href="/classroom/" class="text-xs font-bold px-3 py-1.5 rounded-lg border border-orange-300 text-orange-900 hover:bg-orange-100">ক্লাসরুম হোম</a>
          </div>
        </header>

        <main class="max-w-5xl mx-auto px-4 py-12">
          <section class="text-center space-y-4 mb-12">
            <span class="inline-block px-3 py-1 rounded-full text-xs font-bold bg-orange-100 text-orange-800 border border-orange-200">এক্সপার্ট ফ্যাকাল্টি</span>
            <h1 class="text-3xl sm:text-5xl font-black text-zinc-950 tracking-tight">শিক্ষক ও মেন্টর প্যানেল — Mahims Classroom</h1>
            <p class="text-base sm:text-lg text-zinc-600 max-w-2xl mx-auto leading-relaxed">
              ঢাকা সেন্ট্রাল ইউনিভার্সিটি, ড্যাফোডিল, এমবিএসটিইউ, বেরোবি ও ইউআইইউ-এর অভিজ্ঞ ইন্সট্রাক্টরদের পরিচিতি ও শিক্ষাগত প্রোফাইল।
            </p>
          </section>

          <section class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div class="p-6 rounded-2xl bg-white border border-orange-200 shadow-sm text-center">
              <h2 class="text-lg font-bold text-zinc-900">মাহিম (Mahim)</h2>
              <p class="text-xs text-orange-600 font-semibold">প্রতিষ্ঠাতা ও আইসিটি মেন্টর</p>
              <p class="text-xs text-zinc-500 mt-1">ঢাকা সেন্ট্রাল ইউনিভার্সিটি</p>
              <a href="/classroom/mahim/" class="inline-block mt-3 text-xs font-bold text-orange-600 underline">পূর্ণাঙ্গ প্রোফাইল &rarr;</a>
            </div>
            <div class="p-6 rounded-2xl bg-white border border-orange-200 shadow-sm text-center">
              <h2 class="text-lg font-bold text-zinc-900">আবু সালেহ সুজা (Abu Saleh Suza)</h2>
              <p class="text-xs text-orange-600 font-semibold">ইংরেজি মেন্টর</p>
              <p class="text-xs text-zinc-500 mt-1">ড্যাফোডিল ইন্টারন্যাশনাল ইউনিভার্সিটি</p>
              <a href="/classroom/suza/" class="inline-block mt-3 text-xs font-bold text-orange-600 underline">পূর্ণাঙ্গ প্রোফাইল &rarr;</a>
            </div>
            <div class="p-6 rounded-2xl bg-white border border-orange-200 shadow-sm text-center">
              <h2 class="text-lg font-bold text-zinc-900">সামিউল ইসলাম সোহরাব (Samiul Islam Sohrab)</h2>
              <p class="text-xs text-orange-600 font-semibold">বাংলা মেন্টর</p>
              <p class="text-xs text-zinc-500 mt-1">মাওলানা ভাসানী বিজ্ঞান ও প্রযুক্তি বিশ্ববিদ্যালয় (MBSTU)</p>
              <a href="/classroom/samiul/" class="inline-block mt-3 text-xs font-bold text-orange-600 underline">পূর্ণাঙ্গ প্রোফাইল &rarr;</a>
            </div>
            <div class="p-6 rounded-2xl bg-white border border-orange-200 shadow-sm text-center">
              <h2 class="text-lg font-bold text-zinc-900">মিশকাত শরীফ মিথেন (Mishkat Sharif Mithen)</h2>
              <p class="text-xs text-orange-600 font-semibold">সাধারণ জ্ঞান মেন্টর</p>
              <p class="text-xs text-zinc-500 mt-1">বেগম রোকেয়া বিশ্ববিদ্যালয় (BRUR)</p>
              <a href="/classroom/mithen/" class="inline-block mt-3 text-xs font-bold text-orange-600 underline">পূর্ণাঙ্গ প্রোফাইল &rarr;</a>
            </div>
            <div class="p-6 rounded-2xl bg-white border border-orange-200 shadow-sm text-center">
              <h2 class="text-lg font-bold text-zinc-900">স্বচ্ছল কুমার কর্মকার (Swocchol Kumar Karmokar)</h2>
              <p class="text-xs text-orange-600 font-semibold">বিজ্ঞান ও গণিত মেন্টর</p>
              <p class="text-xs text-zinc-500 mt-1">ইউনাইটেড ইন্টারন্যাশনাল ইউনিভার্সিটি (UIU)</p>
              <a href="/classroom/swocchol/" class="inline-block mt-3 text-xs font-bold text-orange-600 underline">পূর্ণাঙ্গ প্রোফাইল &rarr;</a>
            </div>
          </section>
        </main>
      </div>
    `
  },

  'classroom/instructors': {
    title: "শিক্ষক ও মেন্টর প্যানেল | Mahims Classroom (মাহিম ক্লাসরুম)",
    metaTitle: "শিক্ষক ও মেন্টর প্যানেল | Mahims Classroom",
    description: "মাহিম'স ক্লাসরুমের শিক্ষক ও মেন্টর প্যানেল। ঢাকা সেন্ট্রাল ইউনিভার্সিটি, ড্যাফোডিল, এমবিএসটিইউ, বেরোবি ও ইউআইইউ-এর অভিজ্ঞ ইন্সট্রাক্টরদের পরিচিতি ও শিক্ষাগত প্রোফাইল।",
    keywords: "Mahims Classroom Instructors, শিক্ষক প্যানেল, মাহিম ইবনে খুদি, সামিউল ইসলাম সোহরাব, আবু সালেহ সুজা, মিশকাত শরীফ মিথেন, স্বচ্ছল কুমার কর্মকার",
    canonical: `${siteUrl}/classroom/instructor/`,
    ogTitle: "শিক্ষক ও মেন্টর প্যানেল | Mahims Classroom (মাহিম ক্লাসরুম)",
    ogDescription: "ঢাকা সেন্ট্রাল ইউনিভার্সিটি, ড্যাফোডিল, এমবিএসটিইউ, বেরোবি ও ইউআইইউ-এর অভিজ্ঞ শিক্ষক প্যানেল।",
    ogImage: classroomOgImage,
    twitterTitle: "শিক্ষক ও মেন্টর প্যানেল | Mahims Classroom",
    twitterDescription: "ঢাকা সেন্ট্রাল ইউনিভার্সিটি, ড্যাফোডিল, এমবিএসটিইউ, বেরোবি ও ইউআইইউ-এর অভিজ্ঞ শিক্ষক প্যানেল।",
    twitterImage: classroomOgImage,
    jsonLd: {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "BreadcrumbList",
          "name": "শিক্ষক ও মেন্টর প্যানেল — Mahims Classroom",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "হোম (Home)", "item": "https://mahims.com/" },
            { "@type": "ListItem", "position": 2, "name": "মাহিম ক্লাসরুম (Classroom)", "item": "https://mahims.com/classroom/" },
            { "@type": "ListItem", "position": 3, "name": "শিক্ষক প্যানেল (Instructors)", "item": "https://mahims.com/classroom/instructor/" }
          ]
        }
      ]
    }
  },

  'classroom/courses/mentorship': {
    title: "Mentorship Courses | Mahims Classroom — এক্সক্লুসিভ মেন্টরশীপ প্রোগ্রাম",
    metaTitle: "Mentorship Courses | Mahims Classroom & Samnad Academy",
    description: "Mahims Classroom Mentorship Courses — শীর্ষ বিশ্ববিদ্যালয়ের অভিজ্ঞ মেন্টরদের ওয়ান-টু-ওয়ান গাইডলাইন ও কম্বো মেন্টরশীপ প্রোগ্রাম। মেন্টর: মাহিম ইবনে খুদি, সামিউল ইসলাম সোহরাব, আবু সালেহ সুজা ও মিশকাত শরীফ মিথেন।",
    keywords: "Mahims Classroom Mentorship, Mentorship Course Mahims, মাহিম ক্লাসরুম মেন্টরশীপ, ভর্তি মেন্টরশীপ, এইচএসসি গাইডলাইন, Samnad Academy Mentorship",
    canonical: `${siteUrl}/classroom/courses/mentorship/`,
    ogTitle: "Mentorship Courses | Mahims Classroom — এক্সক্লুসিভ মেন্টরশীপ প্রোগ্রাম",
    ogDescription: "এইচএসসি ও বিশ্ববিদ্যালয় ভর্তি প্রস্তুতির বিশেষ মেন্টরশীপ কোর্স প্যানেল। SamNad Academy ও Mahims Classroom এর সমন্বয়ে।",
    ogImage: "https://res.cloudinary.com/drvyjj7td/image/upload/v1789306292/mentorship_qt39pi.jpg",
    twitterTitle: "Mentorship Courses | Mahims Classroom",
    twitterDescription: "এইচএসসি ও বিশ্ববিদ্যালয় ভর্তি প্রস্তুতির বিশেষ মেন্টরশীপ কোর্স।",
    twitterImage: "https://res.cloudinary.com/drvyjj7td/image/upload/v1789306292/mentorship_qt39pi.jpg",
    jsonLd: {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "BreadcrumbList",
          "name": "মেন্টরশীপ কোর্স — Mahims Classroom",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "হোম (Home)", "item": "https://mahims.com/" },
            { "@type": "ListItem", "position": 2, "name": "মাহিম ক্লাসরুম (Classroom)", "item": "https://mahims.com/classroom/" },
            { "@type": "ListItem", "position": 3, "name": "সকল কোর্স (Courses)", "item": "https://mahims.com/classroom/courses/" },
            { "@type": "ListItem", "position": 4, "name": "মেন্টরশীপ কোর্স (Mentorship)", "item": "https://mahims.com/classroom/courses/mentorship/" }
          ]
        },
        {
          "@type": "Course",
          "@id": `${siteUrl}/classroom/courses/mentorship/#course`,
          "name": "Mentorship Programs — Mahims Classroom & Samnad Academy",
          "description": "এক্সক্লুসিভ মেন্টরশীপ প্রোগ্রাম — এইচএসসি ও বিশ্ববিদ্যালয় ভর্তি প্রস্তুতি।"
        }
      ]
    },
    prerenderHtml: `
      <div class="min-h-screen bg-[#fffbf7] text-zinc-900 font-sans">
        <header class="border-b border-orange-200 bg-white/95 backdrop-blur-md sticky top-0 z-20">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
            <a href="/classroom/" class="flex items-center gap-3">
              <span class="w-9 h-9 rounded-xl bg-orange-600 text-white flex items-center justify-center font-bold text-lg">M</span>
              <div>
                <span class="font-black text-lg block leading-tight text-zinc-950">Mentorship Programs</span>
                <span class="text-xs text-orange-600 font-semibold">SamNad Academy × Mahim’s Classroom</span>
              </div>
            </a>
            <a href="/classroom/courses/" class="text-xs font-bold px-3 py-1.5 rounded-lg border border-orange-300 text-orange-900 hover:bg-orange-100">সকল কোর্স</a>
          </div>
        </header>

        <main class="max-w-5xl mx-auto px-4 py-10">
          <div class="text-center mb-10">
            <span class="inline-block px-3 py-1 rounded-full text-xs font-bold bg-orange-100 text-orange-800 border border-orange-200 mb-3">Special Mentorship Programs</span>
            <h1 class="text-3xl sm:text-5xl font-black text-zinc-950 mb-3">মেন্টরশীপ কোর্স ও গাইডলাইন প্রোগ্রাম</h1>
            <p class="text-base text-zinc-600 max-w-2xl mx-auto">
              আপনার প্রস্তুতিকে আরও সুশৃঙ্খল, কার্যকর এবং লক্ষ্যভিত্তিক করতে শীর্ষ বিশ্ববিদ্যালয়ের অভিজ্ঞ মেন্টরদের ওয়ান-টু-ওয়ান গাইডলাইন ও কম্বো মেন্টরশীপ সেশন।
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <div class="bg-white border-2 border-orange-300 rounded-3xl p-6 shadow-sm">
              <span class="text-xs font-bold text-orange-600 uppercase tracking-wider block mb-1">Combo Mentorship</span>
              <h2 class="text-xl font-bold text-zinc-950 mb-2">অল মেন্টরস কম্বো মেন্টরশীপ প্রোগ্রাম</h2>
              <p class="text-sm text-zinc-600 mb-4">শীর্ষ বিশ্ববিদ্যালয়ের অভিজ্ঞ ৪ জন মেন্টরের সমন্বিত কম্বো মেন্টরশীপ প্রোগ্রাম।</p>
              <a href="/classroom/courses/mentorship/mentorship-program-combo/" class="inline-block px-5 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm">বিস্তারিত দেখুন &rarr;</a>
            </div>

            <div class="bg-white border border-orange-200 rounded-3xl p-6 shadow-sm">
              <span class="text-xs font-bold text-orange-600 uppercase tracking-wider block mb-1">Dhaka Central University (DCU)</span>
              <h2 class="text-xl font-bold text-zinc-950 mb-2">মাহিম ইবনে খুদি — মেন্টরশীপ কোর্স</h2>
              <p class="text-sm text-zinc-600 mb-4">ফাউন্ডার, মাহিমস ক্লাসরুম। আইসিটি ও এডমিশন বিশেষ গাইডলাইন।</p>
              <a href="/classroom/courses/mentorship/mahim-ibn-khudi/" class="inline-block px-5 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm">বিস্তারিত দেখুন &rarr;</a>
            </div>

            <div class="bg-white border border-orange-200 rounded-3xl p-6 shadow-sm">
              <span class="text-xs font-bold text-orange-600 uppercase tracking-wider block mb-1">Daffodil International University (DIU)</span>
              <h2 class="text-xl font-bold text-zinc-950 mb-2">সামিউল ইসলাম সোহরাব — মেন্টরশীপ কোর্স</h2>
              <p class="text-sm text-zinc-600 mb-4">সফটওয়্যার ইঞ্জিনিয়ারিং (DIU)। একাডেমিক প্রস্তুতি ও এডমিশন হ্যাকস।</p>
              <a href="/classroom/courses/mentorship/samiul-islam-sohorab/" class="inline-block px-5 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm">বিস্তারিত দেখুন &rarr;</a>
            </div>

            <div class="bg-white border border-orange-200 rounded-3xl p-6 shadow-sm">
              <span class="text-xs font-bold text-orange-600 uppercase tracking-wider block mb-1">Pharmacy, MBSTU</span>
              <h2 class="text-xl font-bold text-zinc-950 mb-2">আবু সালেহ সুজা — মেন্টরশীপ কোর্স</h2>
              <p class="text-sm text-zinc-600 mb-4">ফার্মেসি বিভাগ, মওলানা ভাসানী বিজ্ঞান ও প্রযুক্তি বিশ্ববিদ্যালয় (MBSTU)।</p>
              <a href="/classroom/courses/mentorship/abu-saleh-suza/" class="inline-block px-5 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm">বিস্তারিত দেখুন &rarr;</a>
            </div>

            <div class="bg-white border border-orange-200 rounded-3xl p-6 shadow-sm">
              <span class="text-xs font-bold text-orange-600 uppercase tracking-wider block mb-1">Begum Rokeya University (BRUR)</span>
              <h2 class="text-xl font-bold text-zinc-950 mb-2">মিশকাত শরীফ মিথেন — মেন্টরশীপ কোর্স</h2>
              <p class="text-sm text-zinc-600 mb-4">ফাউন্ডারঃ মিথেন প্রাইভেট হোম, বেগম রোকেয়া বিশ্ববিদ্যালয় (BRUR)।</p>
              <a href="/classroom/courses/mentorship/mishkat-sharif-mithen/" class="inline-block px-5 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm">বিস্তারিত দেখুন &rarr;</a>
            </div>
          </div>
        </main>
      </div>
    `
  },

  'classroom/courses/mentorship/mahim-ibn-khudi': {
    title: "Mahim Ibne Khudi — Mentorship Course | Mahims Classroom & Samnad Academy",
    metaTitle: "মাহিম ইবনে খুদি (Mentorship Course) | Mahims Classroom",
    description: "মাহিম ইবনে খুদি (Founder, Mahims Classroom - Dhaka Central University) এর পার্সোনালাইজড মেন্টরশীপ কোর্স। SamNad Academy ও Mahims Classroom এর যৌথ উদ্যোগে এইচএসসি, আইসিটি ও বিশ্ববিদ্যালয় ভর্তি পরীক্ষার বিশেষ গাইডলাইন।",
    keywords: "Mahim Ibne Khudi Mentorship, Mahim Mentorship Course, মাহিম ইবনে খুদি মেন্টরশীপ, মাহিম ক্লাসরুম মেন্টরশীপ, samnad academy mahim mentorship, mahims.com/classroom/courses/mentorship/mahim-ibn-khudi/, ভর্তি গাইডলাইন, আইসিটি প্রস্তুতি, ঢাকা সেন্ট্রাল ইউনিভার্সিটি",
    canonical: `${siteUrl}/classroom/courses/mentorship/mahim-ibn-khudi/`,
    ogTitle: "Mahim Ibne Khudi — Mentorship Course | Mahims Classroom",
    ogDescription: "মাহিম ইবনে খুদি এর পার্সোনালাইজড মেন্টরশীপ কোর্স। ভর্তি পরীক্ষা ও আইসিটি প্রস্তুতির বিশেষ গাইডলাইন। SamNad Academy কোলাবোরেশন।",
    ogImage: "https://res.cloudinary.com/drvyjj7td/image/upload/v1789388129/mahimmentor_lqt0tg.png",
    twitterTitle: "Mahim Ibne Khudi — Mentorship Course | Mahims Classroom",
    twitterDescription: "মাহিম ইবনে খুদি এর পার্সোনালাইজড মেন্টরশীপ কোর্স। SamNad Academy কোলাবোরেশন।",
    twitterImage: "https://res.cloudinary.com/drvyjj7td/image/upload/v1789388129/mahimmentor_lqt0tg.png",
    jsonLd: {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "BreadcrumbList",
          "name": "মাহিম ইবনে খুদি মেন্টরশীপ কোর্স — Mahims Classroom",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "হোম (Home)", "item": "https://mahims.com/" },
            { "@type": "ListItem", "position": 2, "name": "মাহিম ক্লাসরুম (Classroom)", "item": "https://mahims.com/classroom/" },
            { "@type": "ListItem", "position": 3, "name": "সকল কোর্স (Courses)", "item": "https://mahims.com/classroom/courses/" },
            { "@type": "ListItem", "position": 4, "name": "মেন্টরশীপ কোর্স (Mentorship)", "item": "https://mahims.com/classroom/courses/mentorship/" },
            { "@type": "ListItem", "position": 5, "name": "মাহিম ইবনে খুদি (Mahim Ibne Khudi)", "item": "https://mahims.com/classroom/courses/mentorship/mahim-ibn-khudi/" }
          ]
        },
        {
          "@type": "Course",
          "@id": `${siteUrl}/classroom/courses/mentorship/mahim-ibn-khudi/#course`,
          "name": "Mahim Ibne Khudi — Mentorship Course",
          "alternateName": "মাহিম ইবনে খুদি মেন্টরশীপ কোর্স",
          "description": "মাহিম ইবনে খুদি (Founder, Mahims Classroom) এর পার্সোনালাইজড মেন্টরশীপ কোর্স। SamNad Academy ও Mahims Classroom এর যৌথ উদ্যোগে এইচএসসি, আইসিটি ও বিশ্ববিদ্যালয় ভর্তি পরীক্ষার বিশেষ গাইডলাইন।",
          "provider": {
            "@type": "EducationalOrganization",
            "name": "SamNad Academy × Mahim's Classroom",
            "url": "https://mahims.com/classroom/"
          },
          "instructor": {
            "@type": "Person",
            "name": "Mahim Ibne Khudi",
            "alternateName": "মাহিম ইবনে খুদি",
            "jobTitle": "Founder, Mahims Classroom",
            "affiliation": {
              "@type": "Organization",
              "name": "Dhaka Central University (DCU)"
            },
            "image": "https://res.cloudinary.com/drvyjj7td/image/upload/v1789388129/mahimmentor_lqt0tg.png"
          },
          "offers": {
            "@type": "Offer",
            "price": "1000",
            "priceCurrency": "BDT",
            "availability": "https://schema.org/InStock",
            "url": "https://samnadacademy.com/courses/mentorship-program-mahim-ibn-khudi/"
          },
          "inLanguage": "bn"
        }
      ]
    },
    prerenderHtml: `
      <div class="min-h-screen bg-[#fffbf7] text-zinc-900 font-sans pb-16">
        <header class="border-b border-orange-200 bg-white/95 backdrop-blur-md sticky top-0 z-20">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
            <a href="/classroom/courses/mentorship/" class="flex items-center gap-3">
              <span class="w-9 h-9 rounded-xl bg-orange-600 text-white flex items-center justify-center font-bold text-lg">M</span>
              <div>
                <span class="font-black text-lg block leading-tight text-zinc-950">Mahim Ibne Khudi</span>
                <span class="text-xs text-orange-600 font-semibold">Mentorship Course • SamNad Academy × Mahim’s Classroom</span>
              </div>
            </a>
            <a href="/classroom/courses/mentorship/" class="text-xs font-bold px-3 py-1.5 rounded-lg border border-orange-300 text-orange-900 hover:bg-orange-100">&larr; সকল মেন্টর</a>
          </div>
        </header>

        <main class="max-w-4xl mx-auto px-4 py-10">
          <div class="bg-white border border-orange-200 rounded-3xl p-6 sm:p-8 shadow-sm mb-8 flex flex-col sm:flex-row gap-6 items-center sm:items-start">
            <img src="https://res.cloudinary.com/drvyjj7td/image/upload/v1789388129/mahimmentor_lqt0tg.png" alt="Mahim Ibne Khudi" class="w-32 h-32 sm:w-40 sm:h-40 rounded-2xl object-cover border border-orange-200 shrink-0" />
            <div class="text-center sm:text-left flex-1">
              <span class="inline-block px-3 py-1 rounded-full text-xs font-bold bg-orange-100 text-orange-800 border border-orange-200 mb-2">Dhaka Central University (DCU)</span>
              <h1 class="text-2xl sm:text-4xl font-black text-zinc-950 mb-1">মাহিম ইবনে খুদি (Mahim Ibne Khudi)</h1>
              <p class="text-sm font-semibold text-orange-700 mb-4">ফাউন্ডার, মাহিমস ক্লাসরুম • মেন্টরশীপ কোর্স</p>
              <div class="flex flex-wrap gap-3 justify-center sm:justify-start">
                <a href="https://samnadacademy.com/courses/mentorship-program-mahim-ibn-khudi/" target="_blank" rel="noopener noreferrer" class="px-6 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-sm shadow-md">
                  কোর্সটি কিনুন (SamNad Academy) &rarr;
                </a>
              </div>
            </div>
          </div>

          <div class="bg-white border border-orange-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            <h2 class="text-xl font-bold text-zinc-950 border-b pb-3">কোর্সের বিস্তারিত বিবরণ ও দিকনির্দেশনা</h2>
            <p class="text-base text-zinc-700 leading-relaxed">
              ভর্তি পরীক্ষা, একাডেমিক প্রস্তুতি কিংবা নিজের কাঙ্ক্ষিত বিশ্ববিদ্যালয়ে জায়গা করে নেওয়ার পথে শুধু পড়াশোনা করলেই যথেষ্ট নয়—প্রয়োজন সঠিক পরিকল্পনা, নিয়মিত গাইডলাইন এবং অভিজ্ঞ মেন্টরের দিকনির্দেশনা।
            </p>
            <p class="text-base text-zinc-700 leading-relaxed">
              এই Mentorship Course এমন শিক্ষার্থীদের জন্য তৈরি, যারা নিজেদের প্রস্তুতিকে আরও গোছানো, কার্যকর এবং লক্ষ্যভিত্তিক করতে চায়। SamNad Academy ও Mahim’s Classroom-এর সমন্বয়ে এই কোর্সে শিক্ষার্থীরা তাদের প্রস্তুতির পুরো journey-তে প্রয়োজনীয় গাইডলাইন ও মেন্টরশীপ পাবে।
            </p>
            <h3 class="text-lg font-bold text-zinc-950 pt-2">এই কোর্সে যা থাকছে:</h3>
            <ul class="space-y-3 text-sm text-zinc-700">
              <li><strong>১. সঠিক প্রস্তুতির দিকনির্দেশনা:</strong> কীভাবে শুরু করবেন, কোন বিষয়কে কতটা গুরুত্ব দেবেন এবং কীভাবে সময়কে কাজে লাগাবেন—এসব বিষয়ে পরিষ্কার গাইডলাইন।</li>
              <li><strong>২. Personalized Mentorship:</strong> আপনার প্রস্তুতি, সমস্যা ও প্রয়োজন অনুযায়ী মেন্টরের কাছ থেকে প্রয়োজনীয় পরামর্শ ও দিকনির্দেশনা।</li>
              <li><strong>৩. Study Plan &amp; Strategy:</strong> পরীক্ষার প্রস্তুতিকে আরও কার্যকর করতে বাস্তবসম্মত স্টাডি প্ল্যান, রুটিন ও প্রস্তুতির কৌশল।</li>
              <li><strong>৪. Regular Guidance &amp; Support:</strong> প্রস্তুতির বিভিন্ন পর্যায়ে প্রয়োজনীয় পরামর্শ, সমস্যা সমাধান এবং সঠিক পথে থাকার জন্য নিয়মিত সাপোর্ট।</li>
              <li><strong>৫. Question &amp; Discussion Support:</strong> পড়াশোনা ও প্রস্তুতি নিয়ে গুরুত্বপূর্ণ প্রশ্ন বা সমস্যাগুলো নিয়ে মেন্টরের সঙ্গে আলোচনা করার সুযোগ।</li>
              <li><strong>৬. Exam &amp; Admission Guidance:</strong> ভর্তি পরীক্ষা ও একাডেমিক প্রস্তুতির ক্ষেত্রে কীভাবে স্মার্টভাবে এগোতে হবে, সে বিষয়ে প্রয়োজনীয় গাইডলাইন ও কৌশল।</li>
            </ul>
            <div class="pt-4 border-t border-orange-100 flex justify-between items-center">
              <a href="/classroom/courses/mentorship/" class="text-sm font-bold text-orange-600 hover:underline">&larr; অন্যান্য মেন্টরদের কোর্স দেখুন</a>
              <a href="https://samnadacademy.com/courses/mentorship-program-mahim-ibn-khudi/" target="_blank" rel="noopener noreferrer" class="px-5 py-2 rounded-xl bg-orange-600 text-white font-bold text-sm">কিনুন &rarr;</a>
            </div>
          </div>
        </main>
      </div>
    `
  },

  'classroom/courses/mentorship/samiul-islam-sohorab': {
    title: "Samiul Islam Sohorab — Mentorship Course | Mahims Classroom & Samnad Academy",
    metaTitle: "সামিউল ইসলাম সোহরাব (Mentorship Course) | Mahims Classroom",
    description: "সামিউল ইসলাম সোহরাব (Software Engineering, DIU) এর ওয়ান-টু-ওয়ান মেন্টরশীপ কোর্স। SamNad Academy ও Mahims Classroom এর যৌথ উদ্যোগে একাডেমিক প্রস্তুতি, স্টাডি প্ল্যান ও এডমিশন হ্যাকস।",
    keywords: "Samiul Islam Sohorab Mentorship, সামিউল ইসলাম সোহরাব মেন্টরশীপ, Mahims Classroom Samiul, DIU SWE Samiul, Samnad Academy Samiul Sohorab, mahims.com/classroom/courses/mentorship/samiul-islam-sohorab/",
    canonical: `${siteUrl}/classroom/courses/mentorship/samiul-islam-sohorab/`,
    ogTitle: "Samiul Islam Sohorab — Mentorship Course | Mahims Classroom",
    ogDescription: "সামিউল ইসলাম সোহরাব এর পার্সোনালাইজড মেন্টরশীপ কোর্স। SamNad Academy কোলাবোরেশন।",
    ogImage: "https://res.cloudinary.com/drvyjj7td/image/upload/v1789388172/samiulmentor_ntpjge.jpg",
    twitterTitle: "Samiul Islam Sohorab — Mentorship Course | Mahims Classroom",
    twitterDescription: "সামিউল ইসলাম সোহরাব এর পার্সোনালাইজড মেন্টরশীপ কোর্স।",
    twitterImage: "https://res.cloudinary.com/drvyjj7td/image/upload/v1789388172/samiulmentor_ntpjge.jpg",
    jsonLd: {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "BreadcrumbList",
          "name": "সামিউল ইসলাম সোহরাব মেন্টরশীপ কোর্স — Mahims Classroom",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "হোম (Home)", "item": "https://mahims.com/" },
            { "@type": "ListItem", "position": 2, "name": "মাহিম ক্লাসরুম (Classroom)", "item": "https://mahims.com/classroom/" },
            { "@type": "ListItem", "position": 3, "name": "সকল কোর্স (Courses)", "item": "https://mahims.com/classroom/courses/" },
            { "@type": "ListItem", "position": 4, "name": "মেন্টরশীপ কোর্স (Mentorship)", "item": "https://mahims.com/classroom/courses/mentorship/" },
            { "@type": "ListItem", "position": 5, "name": "সামিউল ইসলাম সোহরাব (Samiul Islam Sohorab)", "item": "https://mahims.com/classroom/courses/mentorship/samiul-islam-sohorab/" }
          ]
        },
        {
          "@type": "Course",
          "@id": `${siteUrl}/classroom/courses/mentorship/samiul-islam-sohorab/#course`,
          "name": "Samiul Islam Sohorab — Mentorship Course",
          "alternateName": "সামিউল ইসলাম সোহরাব মেন্টরশীপ কোর্স",
          "description": "সামিউল ইসলাম সোহরাব (Software Engineering, DIU) এর পার্সোনালাইজড মেন্টরশীপ কোর্স।",
          "provider": {
            "@type": "EducationalOrganization",
            "name": "SamNad Academy × Mahim's Classroom",
            "url": "https://mahims.com/classroom/"
          },
          "instructor": {
            "@type": "Person",
            "name": "Samiul Islam Sohorab",
            "alternateName": "সামিউল ইসলাম সোহরাব",
            "jobTitle": "Software Engineering",
            "affiliation": {
              "@type": "Organization",
              "name": "Daffodil International University (DIU)"
            },
            "image": "https://res.cloudinary.com/drvyjj7td/image/upload/v1789388172/samiulmentor_ntpjge.jpg"
          },
          "offers": {
            "@type": "Offer",
            "price": "1000",
            "priceCurrency": "BDT",
            "availability": "https://schema.org/InStock",
            "url": "https://samnadacademy.com/courses/mentorship-program-samiul-sohorab/"
          },
          "inLanguage": "bn"
        }
      ]
    },
    prerenderHtml: `
      <div class="min-h-screen bg-[#fffbf7] text-zinc-900 font-sans pb-16">
        <header class="border-b border-orange-200 bg-white/95 backdrop-blur-md sticky top-0 z-20">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
            <a href="/classroom/courses/mentorship/" class="flex items-center gap-3">
              <span class="w-9 h-9 rounded-xl bg-orange-600 text-white flex items-center justify-center font-bold text-lg">M</span>
              <div>
                <span class="font-black text-lg block leading-tight text-zinc-950">Samiul Islam Sohorab</span>
                <span class="text-xs text-orange-600 font-semibold">Mentorship Course • SamNad Academy × Mahim’s Classroom</span>
              </div>
            </a>
            <a href="/classroom/courses/mentorship/" class="text-xs font-bold px-3 py-1.5 rounded-lg border border-orange-300 text-orange-900 hover:bg-orange-100">&larr; সকল মেন্টর</a>
          </div>
        </header>

        <main class="max-w-4xl mx-auto px-4 py-10">
          <div class="bg-white border border-orange-200 rounded-3xl p-6 sm:p-8 shadow-sm mb-8 flex flex-col sm:flex-row gap-6 items-center sm:items-start">
            <img src="https://res.cloudinary.com/drvyjj7td/image/upload/v1789388172/samiulmentor_ntpjge.jpg" alt="Samiul Islam Sohorab" class="w-32 h-32 sm:w-40 sm:h-40 rounded-2xl object-cover border border-orange-200 shrink-0" />
            <div class="text-center sm:text-left flex-1">
              <span class="inline-block px-3 py-1 rounded-full text-xs font-bold bg-orange-100 text-orange-800 border border-orange-200 mb-2">Daffodil International University (DIU)</span>
              <h1 class="text-2xl sm:text-4xl font-black text-zinc-950 mb-1">সামিউল ইসলাম সোহরাব (Samiul Islam Sohorab)</h1>
              <p class="text-sm font-semibold text-orange-700 mb-4">সফটওয়্যার ইঞ্জিনিয়ারিং • মেন্টরশীপ কোর্স</p>
              <div class="flex flex-wrap gap-3 justify-center sm:justify-start">
                <a href="https://samnadacademy.com/courses/mentorship-program-samiul-sohorab/" target="_blank" rel="noopener noreferrer" class="px-6 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-sm shadow-md">
                  কোর্সটি কিনুন (SamNad Academy) &rarr;
                </a>
              </div>
            </div>
          </div>

          <div class="bg-white border border-orange-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            <h2 class="text-xl font-bold text-zinc-950 border-b pb-3">কোর্সের বিস্তারিত বিবরণ ও দিকনির্দেশনা</h2>
            <p class="text-base text-zinc-700 leading-relaxed">
              ভর্তি পরীক্ষা, একাডেমিক প্রস্তুতি কিংবা নিজের কাঙ্ক্ষিত বিশ্ববিদ্যালয়ে জায়গা করে নেওয়ার পথে শুধু পড়াশোনা করলেই যথেষ্ট নয়—প্রয়োজন সঠিক পরিকল্পনা, নিয়মিত গাইডলাইন এবং অভিজ্ঞ মেন্টরের দিকনির্দেশনা।
            </p>
            <h3 class="text-lg font-bold text-zinc-950 pt-2">এই কোর্সে যা থাকছে:</h3>
            <ul class="space-y-3 text-sm text-zinc-700">
              <li><strong>১. সঠিক প্রস্তুতির দিকনির্দেশনা:</strong> পরিষ্কার স্টাডি প্ল্যান ও রোডম্যাপ।</li>
              <li><strong>২. Personalized Mentorship:</strong> ওয়ান-টু-ওয়ান গাইডলাইন ও প্রবলেম সলভিং।</li>
              <li><strong>৩. Study Plan &amp; Strategy:</strong> পরীক্ষার প্রস্তুতিকে নিখুঁত করতে বাস্তবসম্মত স্টাডি রুটিন।</li>
              <li><strong>৪. Regular Guidance &amp; Support:</strong> প্রস্তুতির ধারাবাহিকতা ধরে রাখতে নিয়মিত ফলোআপ।</li>
            </ul>
            <div class="pt-4 border-t border-orange-100 flex justify-between items-center">
              <a href="/classroom/courses/mentorship/" class="text-sm font-bold text-orange-600 hover:underline">&larr; অন্যান্য মেন্টরদের কোর্স দেখুন</a>
              <a href="https://samnadacademy.com/courses/mentorship-program-samiul-sohorab/" target="_blank" rel="noopener noreferrer" class="px-5 py-2 rounded-xl bg-orange-600 text-white font-bold text-sm">কিনুন &rarr;</a>
            </div>
          </div>
        </main>
      </div>
    `
  },

  'classroom/courses/mentorship/abu-saleh-suza': {
    title: "Abu Saleh Suza — Mentorship Course | Mahims Classroom & Samnad Academy",
    metaTitle: "আবু সালেহ সুজা (Mentorship Course) | Mahims Classroom",
    description: "আবু সালেহ সুজা (Pharmacy, MBSTU - ফার্মেসি বিভাগ, মওলানা ভাসানী বিজ্ঞান ও প্রযুক্তি বিশ্ববিদ্যালয়) এর ওয়ান-টু-ওয়ান মেন্টরশীপ কোর্স। SamNad Academy ও Mahims Classroom এর যৌথ উদ্যোগে বিশ্ববিদ্যালয় ভর্তি পরীক্ষা ও একাডেমিক প্রস্তুতির পূর্ণাঙ্গ দিকনির্দেশনা।",
    keywords: "Abu Saleh Suza Mentorship, আবু সালেহ সুজা মেন্টরশীপ, Pharmacy MBSTU Suza, Mahims Classroom Suza, mahims.com/classroom/courses/mentorship/abu-saleh-suza/",
    canonical: `${siteUrl}/classroom/courses/mentorship/abu-saleh-suza/`,
    ogTitle: "Abu Saleh Suza — Mentorship Course | Mahims Classroom",
    ogDescription: "আবু সালেহ সুজা (Pharmacy, MBSTU) এর পার্সোনালাইজড মেন্টরশীপ কোর্স। SamNad Academy কোলাবোরেশন।",
    ogImage: "https://res.cloudinary.com/drvyjj7td/image/upload/v1789388189/suzamentor_fqbj8e.jpg",
    twitterTitle: "Abu Saleh Suza — Mentorship Course | Mahims Classroom",
    twitterDescription: "আবু সালেহ সুজা এর পার্সোনালাইজড মেন্টরশীপ কোর্স।",
    twitterImage: "https://res.cloudinary.com/drvyjj7td/image/upload/v1789388189/suzamentor_fqbj8e.jpg",
    jsonLd: {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "BreadcrumbList",
          "name": "আবু সালেহ সুজা মেন্টরশীপ কোর্স — Mahims Classroom",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "হোম (Home)", "item": "https://mahims.com/" },
            { "@type": "ListItem", "position": 2, "name": "মাহিম ক্লাসরুম (Classroom)", "item": "https://mahims.com/classroom/" },
            { "@type": "ListItem", "position": 3, "name": "সকল কোর্স (Courses)", "item": "https://mahims.com/classroom/courses/" },
            { "@type": "ListItem", "position": 4, "name": "মেন্টরশীপ কোর্স (Mentorship)", "item": "https://mahims.com/classroom/courses/mentorship/" },
            { "@type": "ListItem", "position": 5, "name": "আবু সালেহ সুজা (Abu Saleh Suza)", "item": "https://mahims.com/classroom/courses/mentorship/abu-saleh-suza/" }
          ]
        },
        {
          "@type": "Course",
          "@id": `${siteUrl}/classroom/courses/mentorship/abu-saleh-suza/#course`,
          "name": "Abu Saleh Suza — Mentorship Course",
          "alternateName": "আবু সালেহ সুজা মেন্টরশীপ কোর্স",
          "description": "আবু সালেহ সুজা (Pharmacy, MBSTU) এর ওয়ান-টু-ওয়ান মেন্টরশীপ কোর্স।",
          "provider": {
            "@type": "EducationalOrganization",
            "name": "SamNad Academy × Mahim's Classroom",
            "url": "https://mahims.com/classroom/"
          },
          "instructor": {
            "@type": "Person",
            "name": "Abu Saleh Suza",
            "alternateName": "আবু সালেহ সুজা",
            "jobTitle": "Pharmacy",
            "affiliation": {
              "@type": "Organization",
              "name": "Mawlana Bhashani Science and Technology University (MBSTU)"
            },
            "image": "https://res.cloudinary.com/drvyjj7td/image/upload/v1789388189/suzamentor_fqbj8e.jpg"
          },
          "inLanguage": "bn"
        }
      ]
    },
    prerenderHtml: `
      <div class="min-h-screen bg-[#fffbf7] text-zinc-900 font-sans pb-16">
        <header class="border-b border-orange-200 bg-white/95 backdrop-blur-md sticky top-0 z-20">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
            <a href="/classroom/courses/mentorship/" class="flex items-center gap-3">
              <span class="w-9 h-9 rounded-xl bg-orange-600 text-white flex items-center justify-center font-bold text-lg">M</span>
              <div>
                <span class="font-black text-lg block leading-tight text-zinc-950">Abu Saleh Suza</span>
                <span class="text-xs text-orange-600 font-semibold">Mentorship Course • SamNad Academy × Mahim’s Classroom</span>
              </div>
            </a>
            <a href="/classroom/courses/mentorship/" class="text-xs font-bold px-3 py-1.5 rounded-lg border border-orange-300 text-orange-900 hover:bg-orange-100">&larr; সকল মেন্টর</a>
          </div>
        </header>

        <main class="max-w-4xl mx-auto px-4 py-10">
          <div class="bg-white border border-orange-200 rounded-3xl p-6 sm:p-8 shadow-sm mb-8 flex flex-col sm:flex-row gap-6 items-center sm:items-start">
            <img src="https://res.cloudinary.com/drvyjj7td/image/upload/v1789388189/suzamentor_fqbj8e.jpg" alt="Abu Saleh Suza" class="w-32 h-32 sm:w-40 sm:h-40 rounded-2xl object-cover border border-orange-200 shrink-0" />
            <div class="text-center sm:text-left flex-1">
              <span class="inline-block px-3 py-1 rounded-full text-xs font-bold bg-orange-100 text-orange-800 border border-orange-200 mb-2">Pharmacy, MBSTU</span>
              <h1 class="text-2xl sm:text-4xl font-black text-zinc-950 mb-1">আবু সালেহ সুজা (Abu Saleh Suza)</h1>
              <p class="text-sm font-semibold text-orange-700 mb-4">ফার্মেসি বিভাগ • মওলানা ভাসানী বিজ্ঞান ও প্রযুক্তি বিশ্ববিদ্যালয় (MBSTU)</p>
              <div class="flex flex-wrap gap-3 justify-center sm:justify-start">
                <a href="/classroom/courses/mentorship/abu-saleh-suza/" class="px-6 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-sm shadow-md">
                  মেন্টরশীপ প্রোগ্রামে যোগ দিন &rarr;
                </a>
              </div>
            </div>
          </div>

          <div class="bg-white border border-orange-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            <h2 class="text-xl font-bold text-zinc-950 border-b pb-3">কোর্সের বিস্তারিত বিবরণ ও দিকনির্দেশনা</h2>
            <p class="text-base text-zinc-700 leading-relaxed">
              বিশ্ববিদ্যালয় ভর্তি পরীক্ষা ও বোর্ড পরীক্ষার প্রস্তুতির ক্ষেত্রে অভিজ্ঞ মেন্টরের ওয়ান-টু-ওয়ান গাইডলাইন আপনাকে শতভাগ এগিয়ে রাখবে।
            </p>
            <div class="pt-4 border-t border-orange-100">
              <a href="/classroom/courses/mentorship/" class="text-sm font-bold text-orange-600 hover:underline">&larr; অন্যান্য মেন্টরদের কোর্স দেখুন</a>
            </div>
          </div>
        </main>
      </div>
    `
  },

  'classroom/courses/mentorship/mishkat-sharif-mithen': {
    title: "Mishkat Sharif Mithen — Mentorship Course | Mahims Classroom & Samnad Academy",
    metaTitle: "মিশকাত শরীফ মিথেন (Mentorship Course) | Mahims Classroom",
    description: "মিশকাত শরীফ মিথেন (Begum Rokeya University - BRUR, Founder Mithen Private Home) এর মেন্টরশীপ কোর্স। SamNad Academy ও Mahims Classroom এর যৌথ উদ্যোগে ভর্তি পরীক্ষা ও বোর্ড পরীক্ষার নিখুঁত স্ট্র্যাটেজি।",
    keywords: "Mishkat Sharif Mithen Mentorship, মিশকাত শরীফ মিথেন মেন্টরশীপ, Mithen Private Home, BRUR Mithen, Mahims Classroom Mithen, mahims.com/classroom/courses/mentorship/mishkat-sharif-mithen/",
    canonical: `${siteUrl}/classroom/courses/mentorship/mishkat-sharif-mithen/`,
    ogTitle: "Mishkat Sharif Mithen — Mentorship Course | Mahims Classroom",
    ogDescription: "মিশকাত শরীফ মিথেন এর পার্সোনালাইজড মেন্টরশীপ কোর্স। SamNad Academy কোলাবোরেশন।",
    ogImage: "https://res.cloudinary.com/drvyjj7td/image/upload/v1789388182/mithenmentor_atwyjb.png",
    twitterTitle: "Mishkat Sharif Mithen — Mentorship Course | Mahims Classroom",
    twitterDescription: "মিশকাত শরীফ মিথেন এর পার্সোনালাইজড মেন্টরশীপ কোর্স।",
    twitterImage: "https://res.cloudinary.com/drvyjj7td/image/upload/v1789388182/mithenmentor_atwyjb.png",
    jsonLd: {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "BreadcrumbList",
          "name": "মিশকাত শরীফ মিথেন মেন্টরশীপ কোর্স — Mahims Classroom",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "হোম (Home)", "item": "https://mahims.com/" },
            { "@type": "ListItem", "position": 2, "name": "মাহিম ক্লাসরুম (Classroom)", "item": "https://mahims.com/classroom/" },
            { "@type": "ListItem", "position": 3, "name": "সকল কোর্স (Courses)", "item": "https://mahims.com/classroom/courses/" },
            { "@type": "ListItem", "position": 4, "name": "মেন্টরশীপ কোর্স (Mentorship)", "item": "https://mahims.com/classroom/courses/mentorship/" },
            { "@type": "ListItem", "position": 5, "name": "মিশকাত শরীফ মিথেন (Mishkat Sharif Mithen)", "item": "https://mahims.com/classroom/courses/mentorship/mishkat-sharif-mithen/" }
          ]
        },
        {
          "@type": "Course",
          "@id": `${siteUrl}/classroom/courses/mentorship/mishkat-sharif-mithen/#course`,
          "name": "Mishkat Sharif Mithen — Mentorship Course",
          "alternateName": "মিশকাত শরীফ মিথেন মেন্টরশীপ কোর্স",
          "description": "মিশকাত শরীফ মিথেন (Begum Rokeya University - BRUR) এর মেন্টরশীপ কোর্স।",
          "provider": {
            "@type": "EducationalOrganization",
            "name": "SamNad Academy × Mahim's Classroom",
            "url": "https://mahims.com/classroom/"
          },
          "instructor": {
            "@type": "Person",
            "name": "Mishkat Sharif Mithen",
            "alternateName": "মিশকাত শরীফ মিথেন",
            "jobTitle": "Founder, Mithen Private Home",
            "affiliation": {
              "@type": "Organization",
              "name": "Begum Rokeya University (BRUR)"
            },
            "image": "https://res.cloudinary.com/drvyjj7td/image/upload/v1789388182/mithenmentor_atwyjb.png"
          },
          "inLanguage": "bn"
        }
      ]
    },
    prerenderHtml: `
      <div class="min-h-screen bg-[#fffbf7] text-zinc-900 font-sans pb-16">
        <header class="border-b border-orange-200 bg-white/95 backdrop-blur-md sticky top-0 z-20">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
            <a href="/classroom/courses/mentorship/" class="flex items-center gap-3">
              <span class="w-9 h-9 rounded-xl bg-orange-600 text-white flex items-center justify-center font-bold text-lg">M</span>
              <div>
                <span class="font-black text-lg block leading-tight text-zinc-950">Mishkat Sharif Mithen</span>
                <span class="text-xs text-orange-600 font-semibold">Mentorship Course • SamNad Academy × Mahim’s Classroom</span>
              </div>
            </a>
            <a href="/classroom/courses/mentorship/" class="text-xs font-bold px-3 py-1.5 rounded-lg border border-orange-300 text-orange-900 hover:bg-orange-100">&larr; সকল মেন্টর</a>
          </div>
        </header>

        <main class="max-w-4xl mx-auto px-4 py-10">
          <div class="bg-white border border-orange-200 rounded-3xl p-6 sm:p-8 shadow-sm mb-8 flex flex-col sm:flex-row gap-6 items-center sm:items-start">
            <img src="https://res.cloudinary.com/drvyjj7td/image/upload/v1789388182/mithenmentor_atwyjb.png" alt="Mishkat Sharif Mithen" class="w-32 h-32 sm:w-40 sm:h-40 rounded-2xl object-cover border border-orange-200 shrink-0" />
            <div class="text-center sm:text-left flex-1">
              <span class="inline-block px-3 py-1 rounded-full text-xs font-bold bg-orange-100 text-orange-800 border border-orange-200 mb-2">Begum Rokeya University (BRUR)</span>
              <h1 class="text-2xl sm:text-4xl font-black text-zinc-950 mb-1">মিশকাত শরীফ মিথেন (Mishkat Sharif Mithen)</h1>
              <p class="text-sm font-semibold text-orange-700 mb-4">ফাউন্ডারঃ মিথেন প্রাইভেট হোম • বেগম রোকেয়া বিশ্ববিদ্যালয় (BRUR)</p>
              <div class="flex flex-wrap gap-3 justify-center sm:justify-start">
                <a href="/classroom/courses/mentorship/mishkat-sharif-mithen/" class="px-6 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-sm shadow-md">
                  মেন্টরশীপ প্রোগ্রামে যোগ দিন &rarr;
                </a>
              </div>
            </div>
          </div>

          <div class="bg-white border border-orange-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            <h2 class="text-xl font-bold text-zinc-950 border-b pb-3">কোর্সের বিস্তারিত বিবরণ ও দিকনির্দেশনা</h2>
            <p class="text-base text-zinc-700 leading-relaxed">
              সঠিক দিকনির্দেশনা ও পারসোনালাইজড মেন্টরশীপ আপনার বিশ্ববিদ্যালয় ভর্তি প্রস্তুতিকে রাখবে গোছানো ও শাণিত।
            </p>
            <div class="pt-4 border-t border-orange-100">
              <a href="/classroom/courses/mentorship/" class="text-sm font-bold text-orange-600 hover:underline">&larr; অন্যান্য মেন্টরদের কোর্স দেখুন</a>
            </div>
          </div>
        </main>
      </div>
    `
  },

  'classroom/courses/mentorship/mentorship-program-combo': {
    title: "All Mentors Combo Mentorship Course | SamNad Academy × Mahims Classroom",
    metaTitle: "অল মেন্টরস কম্বো মেন্টরশীপ প্রোগ্রাম | Mahims Classroom",
    description: "শীর্ষ বিশ্ববিদ্যালয়ের অভিজ্ঞ ৪ জন মেন্টরের সমন্বিত কম্বো মেন্টরশীপ প্রোগ্রাম (Abu Saleh Suza, Samiul Islam Sohorab, Mishkat Sharif Mithen, Mahim Ibne Khudi)। ভর্তি পরীক্ষা ও একাডেমিক প্রস্তুতির সেরা রোডম্যাপ।",
    keywords: "Combo Mentorship Program, কম্বো মেন্টরশীপ কোর্স, SamNad Academy Mentorship, Mahims Classroom Combo, mahims.com/classroom/courses/mentorship/mentorship-program-combo/",
    canonical: `${siteUrl}/classroom/courses/mentorship/mentorship-program-combo/`,
    ogTitle: "All Mentors Combo Mentorship Course | Mahims Classroom",
    ogDescription: "শীর্ষ বিশ্ববিদ্যালয়ের অভিজ্ঞ ৪ জন মেন্টরের সমন্বিত কম্বো মেন্টরশীপ প্রোগ্রাম। SamNad Academy ও Mahims Classroom এর সমন্বয়ে।",
    ogImage: "https://res.cloudinary.com/drvyjj7td/image/upload/v1789306292/mentorship_qt39pi.jpg",
    twitterTitle: "All Mentors Combo Mentorship Course | Mahims Classroom",
    twitterDescription: "শীর্ষ বিশ্ববিদ্যালয়ের অভিজ্ঞ ৪ জন মেন্টরের সমন্বিত কম্বো মেন্টরশীপ প্রোগ্রাম।",
    twitterImage: "https://res.cloudinary.com/drvyjj7td/image/upload/v1789306292/mentorship_qt39pi.jpg",
    jsonLd: {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "BreadcrumbList",
          "name": "কম্বো মেন্টরশীপ কোর্স — Mahims Classroom",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "হোম (Home)", "item": "https://mahims.com/" },
            { "@type": "ListItem", "position": 2, "name": "মাহিম ক্লাসরুম (Classroom)", "item": "https://mahims.com/classroom/" },
            { "@type": "ListItem", "position": 3, "name": "সকল কোর্স (Courses)", "item": "https://mahims.com/classroom/courses/" },
            { "@type": "ListItem", "position": 4, "name": "মেন্টরশীপ কোর্স (Mentorship)", "item": "https://mahims.com/classroom/courses/mentorship/" },
            { "@type": "ListItem", "position": 5, "name": "কম্বো মেন্টরশীপ (Combo Mentorship)", "item": "https://mahims.com/classroom/courses/mentorship/mentorship-program-combo/" }
          ]
        },
        {
          "@type": "Course",
          "@id": `${siteUrl}/classroom/courses/mentorship/mentorship-program-combo/#course`,
          "name": "All Mentors Combo Mentorship Course",
          "alternateName": "অল মেন্টরস কম্বো মেন্টরশীপ প্রোগ্রাম",
          "description": "শীর্ষ বিশ্ববিদ্যালয়ের অভিজ্ঞ ৪ জন মেন্টরের সমন্বিত কম্বো মেন্টরশীপ প্রোগ্রাম।",
          "provider": {
            "@type": "EducationalOrganization",
            "name": "SamNad Academy × Mahim's Classroom",
            "url": "https://mahims.com/classroom/"
          },
          "inLanguage": "bn"
        }
      ]
    },
    prerenderHtml: `
      <div class="min-h-screen bg-[#fffbf7] text-zinc-900 font-sans pb-16">
        <header class="border-b border-orange-200 bg-white/95 backdrop-blur-md sticky top-0 z-20">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
            <a href="/classroom/courses/mentorship/" class="flex items-center gap-3">
              <span class="w-9 h-9 rounded-xl bg-orange-600 text-white flex items-center justify-center font-bold text-lg">M</span>
              <div>
                <span class="font-black text-lg block leading-tight text-zinc-950">Combo Mentorship Program</span>
                <span class="text-xs text-orange-600 font-semibold">SamNad Academy × Mahim’s Classroom</span>
              </div>
            </a>
            <a href="/classroom/courses/mentorship/" class="text-xs font-bold px-3 py-1.5 rounded-lg border border-orange-300 text-orange-900 hover:bg-orange-100">&larr; সকল মেন্টর</a>
          </div>
        </header>

        <main class="max-w-4xl mx-auto px-4 py-10">
          <div class="bg-white border-2 border-orange-300 rounded-3xl p-6 sm:p-8 shadow-sm mb-8 text-center sm:text-left flex flex-col sm:flex-row gap-6 items-center sm:items-start">
            <img src="https://res.cloudinary.com/drvyjj7td/image/upload/v1789306292/mentorship_qt39pi.jpg" alt="All Mentors Combo Mentorship" class="w-32 h-32 sm:w-40 sm:h-40 rounded-2xl object-cover border border-orange-200 shrink-0" />
            <div class="flex-1">
              <span class="inline-block px-3 py-1 rounded-full text-xs font-bold bg-orange-100 text-orange-800 border border-orange-200 mb-2">Complete Panel Guidance</span>
              <h1 class="text-2xl sm:text-4xl font-black text-zinc-950 mb-1">অল মেন্টরস কম্বো মেন্টরশীপ কোর্স</h1>
              <p class="text-sm font-semibold text-orange-700 mb-4">শীর্ষ বিশ্ববিদ্যালয়ের ৪ জন অভিজ্ঞ মেন্টরের সমন্বিত প্যানেল গাইডলাইন</p>
              <div class="flex flex-wrap gap-3 justify-center sm:justify-start">
                <a href="/classroom/courses/mentorship/mentorship-program-combo/" class="px-6 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-sm shadow-md">
                  কম্বো মেন্টরশীপে জয়েন করুন &rarr;
                </a>
              </div>
            </div>
          </div>

          <div class="bg-white border border-orange-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            <h2 class="text-xl font-bold text-zinc-950 border-b pb-3">মেন্টর প্যানেল পরিচিতি</h2>
            <ul class="space-y-3 text-sm text-zinc-700">
              <li>• <a href="/classroom/courses/mentorship/mahim-ibn-khudi/" class="text-orange-600 font-bold hover:underline">মাহিম ইবনে খুদি (Mahim Ibne Khudi)</a> — ঢাকা সেন্ট্রাল ইউনিভার্সিটি (DCU) | ফাউন্ডার, মাহিমস ক্লাসরুম</li>
              <li>• <a href="/classroom/courses/mentorship/samiul-islam-sohorab/" class="text-orange-600 font-bold hover:underline">সামিউল ইসলাম সোহরাব (Samiul Islam Sohorab)</a> — ড্যাফোডিল ইন্টারন্যাশনাল ইউনিভার্সিটি (DIU) | সফটওয়্যার ইঞ্জিনিয়ারিং</li>
              <li>• <a href="/classroom/courses/mentorship/abu-saleh-suza/" class="text-orange-600 font-bold hover:underline">আবু সালেহ সুজা (Abu Saleh Suza)</a> — মওলানা ভাসানী বিজ্ঞান ও প্রযুক্তি বিশ্ববিদ্যালয় (MBSTU) | ফার্মেসি বিভাগ</li>
              <li>• <a href="/classroom/courses/mentorship/mishkat-sharif-mithen/" class="text-orange-600 font-bold hover:underline">মিশকাত শরীফ মিথেন (Mishkat Sharif Mithen)</a> — বেগম রোকেয়া বিশ্ববিদ্যালয় (BRUR) | ফাউন্ডারঃ মিথেন প্রাইভেট হোম</li>
            </ul>
          </div>
        </main>
      </div>
    `
  },

  'classroom/courses/octal-1-hsc-ict': {
    title: "Octal 1.0 | HSC ICT Course — Mahims Classroom & Samnad Academy",
    metaTitle: "Octal 1.0 (এইচএসসি আইসিটি ফুল কোর্স) | Mahims Classroom",
    description: "Octal 1.0 হলো HSC শিক্ষার্থীদের জন্য সাজানো একটি পূর্ণাঙ্গ ICT কোর্স। ইন্সট্রাক্টর: মাহিম (Mahim) ও সামিউল সোহরাব (Samiul Sohrab)। Concept Clear, CQ, MCQ ও বিগত ১০ বছরের বোর্ড প্রশ্ন সমাধান। Samnad Academy কোলাবোরেশন।",
    keywords: "Octal 1.0, HSC ICT, Octal 1.0 ICT Course, mahims classroom, samnad academy, মাহিম ক্লাসরুম, এইচএসসি আইসিটি, মাহিম আইসিটি, সামিউল সোহরাব, octal-1-hsc-ict, mahims.com/classroom/courses/octal-1-hsc-ict/, ICT Board Question Solution, সি প্রোগ্রামিং, এইচটিএমএল, ডাটাবেজ",
    canonical: `${siteUrl}/classroom/courses/octal-1-hsc-ict/`,
    ogTitle: "Octal 1.0 | HSC ICT Course — Mahims Classroom & Samnad Academy",
    ogDescription: "HSC ICT প্রস্তুতিতে শতভাগ কনফিডেন্স আনতে Octal 1.0 কোর্স। ইন্সট্রাক্টর: মাহিম ও সামিউল সোহরাব। কিনুন Samnad Academy থেকে।",
    ogImage: "https://res.cloudinary.com/drvyjj7td/image/upload/v1789311111/OCTAL-1.0-Samnad-Academy-mahims.com_srlast.jpg",
    twitterTitle: "Octal 1.0 | HSC ICT Course — Mahims Classroom",
    twitterDescription: "HSC ICT প্রস্তুতিতে শতভাগ কনফিডেন্স আনতে Octal 1.0 কোর্স। ইন্সট্রাক্টর: মাহিম ও সামিউল সোহরাব।",
    twitterImage: "https://res.cloudinary.com/drvyjj7td/image/upload/v1789311111/OCTAL-1.0-Samnad-Academy-mahims.com_srlast.jpg",
    jsonLd: {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "BreadcrumbList",
          "name": "Octal 1.0 Course — Mahims Classroom",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "হোম (Home)", "item": "https://mahims.com/" },
            { "@type": "ListItem", "position": 2, "name": "মাহিম ক্লাসরুম (Classroom)", "item": "https://mahims.com/classroom/" },
            { "@type": "ListItem", "position": 3, "name": "কোর্সসমূহ (Courses)", "item": "https://mahims.com/classroom/courses/" },
            { "@type": "ListItem", "position": 4, "name": "Octal 1.0 (HSC ICT)", "item": "https://mahims.com/classroom/courses/octal-1-hsc-ict/" }
          ]
        },
        {
          "@type": "Course",
          "@id": `${siteUrl}/classroom/courses/octal-1-hsc-ict/#course`,
          "name": "Octal 1.0 | HSC ICT Course",
          "description": "Octal 1.0 হলো HSC শিক্ষার্থীদের জন্য সাজানো একটি পূর্ণাঙ্গ ICT কোর্স। যেখানে একদম বেসিক থেকে এডভান্স লেভেল পর্যন্ত প্রতিটি অধ্যায় ধরে ধরে শেখানো হবে।",
          "provider": {
            "@type": "EducationalOrganization",
            "name": "Mahim's Classroom & Samnad Academy",
            "url": "https://mahims.com/classroom/"
          },
          "instructor": [
            {
              "@type": "Person",
              "name": "Mahim Ibne Khudi",
              "url": "https://mahims.com/classroom/mahim/"
            },
            {
              "@type": "Person",
              "name": "Samiul Islam Sohrab",
              "url": "https://mahims.com/classroom/samiul/"
            }
          ],
          "offers": {
            "@type": "Offer",
            "url": "https://samnadacademy.com/courses/octal-1-hsc-ict/",
            "availability": "https://schema.org/InStock",
            "category": "HSC ICT Course"
          }
        }
      ]
    },
    prerenderHtml: `
      <div class="min-h-screen bg-[#fffbf7] text-zinc-900 font-sans">
        <header class="border-b border-orange-200 bg-white/95 backdrop-blur-md sticky top-0 z-20">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
            <a href="/classroom/" class="flex items-center gap-3">
              <span class="w-9 h-9 rounded-xl bg-orange-600 text-white flex items-center justify-center font-bold text-lg">M</span>
              <div>
                <span class="font-black text-lg block leading-tight text-zinc-950">Mahims Classroom</span>
                <span class="text-xs text-orange-600 font-semibold">mahims.com/classroom/courses/octal-1-hsc-ict</span>
              </div>
            </a>
            <div class="flex items-center gap-3">
              <a href="/classroom/courses/" class="text-xs font-bold px-3 py-1.5 rounded-lg border border-orange-300 text-orange-900 hover:bg-orange-100">সকল কোর্স</a>
              <a href="/classroom/" class="text-xs font-bold px-3 py-1.5 rounded-lg bg-orange-500 text-white hover:bg-orange-600">ক্লাসরুম হোম</a>
            </div>
          </div>
        </header>

        <main class="max-w-6xl mx-auto px-4 py-10">
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div class="lg:col-span-7 space-y-6">
              <div class="bg-white border border-orange-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
                <div class="flex items-center gap-2">
                  <span class="px-3 py-1 rounded-full text-xs font-bold bg-orange-100 text-orange-800 border border-orange-300">এইচএসসি আইসিটি (HSC ICT)</span>
                  <span class="px-3 py-1 rounded-full text-xs font-semibold bg-zinc-100 text-zinc-700">HSC সকল বিভাগ • Samnad Academy কোলাবোরেশন</span>
                </div>
                <h1 class="text-3xl sm:text-4xl font-black text-zinc-950">Octal 1.0 | HSC ICT Course</h1>
                
                <div class="p-4 rounded-2xl bg-orange-50 border border-orange-200 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <span class="text-xs text-zinc-500 block">Instructor</span>
                    <a href="/classroom/mahim/" class="font-bold text-orange-600 hover:underline">মাহিম (Mahim) &rarr;</a>
                  </div>
                  <div>
                    <span class="text-xs text-zinc-500 block">Co-Instructor</span>
                    <a href="/classroom/samiul/" class="font-bold text-orange-600 hover:underline">সামিউল সোহরাব (Samiul Sohrab) &rarr;</a>
                  </div>
                </div>

                <div class="text-sm sm:text-base text-zinc-700 leading-relaxed space-y-3 pt-3 border-t border-orange-100">
                  <p><strong>Octal 1.0</strong> হলো HSC শিক্ষার্থীদের জন্য সাজানো একটি পূর্ণাঙ্গ ICT কোর্স। যেখানে একদম বেসিক থেকে এডভান্স লেভেল পর্যন্ত প্রতিটি অধ্যায় ধরে ধরে শেখানো হবে।</p>
                  <p>বিশেষ করে প্রোগ্রামিং (C Language), এইচটিএমএল (HTML) এবং ডাটাবেজ ম্যানেজমেন্ট সিস্টেম (DBMS)-এর জটিল কনসেপ্টগুলো ভিজ্যুয়াল ও রিয়েল-লাইফ এক্সাম্পলের মাধ্যমে সহজে ক্লিয়ার করা হবে যাতে বোর্ড পরীক্ষা ও এডমিশনে তুমি শতভাগ এগিয়ে থাকো।</p>
                </div>
              </div>

              <div class="bg-white border border-orange-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
                <h2 class="text-xl font-bold text-zinc-900">🎯 কোর্সে যা থাকছে:</h2>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-zinc-800">
                  <div class="p-3 rounded-xl bg-orange-50/60 border border-orange-100 font-medium">✓ সম্পূর্ণ সিলেবাস কভার (Full Syllabus Coverage)</div>
                  <div class="p-3 rounded-xl bg-orange-50/60 border border-orange-100 font-medium">✓ অধ্যায়ভিত্তিক বেসিক টু প্রো ক্লাস</div>
                  <div class="p-3 rounded-xl bg-orange-50/60 border border-orange-100 font-medium">✓ বোর্ড প্রশ্ন বিশ্লেষণ ও হ্যান্ডনোট প্রদান</div>
                  <div class="p-3 rounded-xl bg-orange-50/60 border border-orange-100 font-medium">✓ CQ ও MCQ স্পেশাল হ্যাকস ও শর্টকাট কৌশল</div>
                  <div class="p-3 rounded-xl bg-orange-50/60 border border-orange-100 font-medium">✓ সি প্রোগ্রামিং ও এইচটিএমএল প্র্যাকটিক্যাল কোডিং</div>
                  <div class="p-3 rounded-xl bg-orange-50/60 border border-orange-100 font-medium">✓ নিয়মিত পরীক্ষা ও পারফরম্যান্স রিভিউ</div>
                </div>
              </div>

              <div class="bg-gradient-to-br from-orange-100/60 to-white border border-orange-300 rounded-3xl p-6 sm:p-8 space-y-2">
                <h2 class="text-lg font-bold text-zinc-900">🚀 কেন Octal 1.0 কোর্সটি করবেন?</h2>
                <p class="text-sm text-zinc-700 leading-relaxed">আইসিটি কোনো মুখস্থের বিষয় নয়, এটি বোঝার ও প্র্যাকটিসের বিষয়। গতানুগতিক ধারার বাইরে এসে সহজ ব্যাখ্যা ও স্মার্ট নোটের সাহায্যে আইসিটিতে A+ নিশ্চিত করার লক্ষ্যেই এই কোর্স।</p>
                <p class="text-sm font-bold text-orange-800 pt-2 border-t border-orange-200">তোমার HSC ICT যাত্রাকে সহজ, ভয়হীন ও উপভোগ্য করতে এখনই জয়েন করো!</p>
              </div>
            </div>

            <div class="lg:col-span-5 space-y-5">
              <div class="bg-white border-2 border-orange-200 rounded-3xl p-6 shadow-xl shadow-orange-500/10 space-y-5">
                <img 
                  src="https://res.cloudinary.com/drvyjj7td/image/upload/v1789311111/OCTAL-1.0-Samnad-Academy-mahims.com_srlast.jpg" 
                  alt="Octal 1.0 HSC ICT Course" 
                  class="w-full rounded-2xl object-cover shadow-sm aspect-[16/9]"
                />
                <div>
                  <h3 class="text-xl font-black text-zinc-950">Octal 1.0 | HSC ICT Course</h3>
                  <p class="text-xs text-zinc-600 mt-1">HSC ICT পূর্ণাঙ্গ প্রস্তুতি কোর্স • Samnad Academy পার্টনারশীপ</p>
                </div>

                <div class="p-4 rounded-2xl bg-orange-50 border border-orange-200 text-xs space-y-2">
                  <div class="flex justify-between"><span>প্লাটফর্ম:</span><span class="font-bold">Samnad Academy</span></div>
                  <div class="flex justify-between"><span>কোলাবোরেশন:</span><span class="font-bold text-orange-600">Mahim's Classroom</span></div>
                  <div class="flex justify-between border-t border-orange-200 pt-2"><span>এনরোলমেন্ট:</span><span class="font-bold text-emerald-600">ভর্তি চলমান (Active)</span></div>
                </div>

                <a 
                  href="https://samnadacademy.com/courses/octal-1-hsc-ict/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  class="block w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-extrabold text-base shadow-lg shadow-orange-500/30 text-center"
                >
                  কোর্সটি কিনুন &rarr;
                </a>
                <p class="text-[11px] text-center text-zinc-500">* কিনুন বাটনে ক্লিক করলে কোর্সটির অফিসিয়াল রেজিস্ট্রেশন পেজে নিয়ে যাবে।</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    `
  },

  'classroom/courses/bangla-boss-2-course': {
    title: "বাংলা বস ২.০ | Bangla Boss 2.0 Course — Mahims Classroom & Samnad Academy",
    metaTitle: "বাংলা বস ২.০ (Bangla Boss 2.0) | Mahims Classroom",
    description: "বাংলা ব্যাকরণ ও নির্মিতি অংশে সর্বোচ্চ প্রস্তুতির জন্য Samnad Academy-র বিশেষ কোর্স বাংলা বস ২.০। ব্যাকরণ রুলস সহজ ব্যাখ্যা ও বোর্ড স্ট্যান্ডার্ড সৃজনশীল লেখার কৌশল।",
    keywords: "Bangla Boss 2.0, বাংলা বস ২.০, Samnad Academy Bangla, Mahims Classroom বাংলা, বাংলা ব্যাকরণ কোর্স",
    canonical: `${siteUrl}/classroom/courses/bangla-boss-2-course/`,
    ogTitle: "বাংলা বস ২.০ | Bangla Boss 2.0 Course — Mahims Classroom",
    ogDescription: "বাংলা ব্যাকরণ ও নির্মিতি অংশে পূর্ণাঙ্গ প্রস্তুতির সেরা কোর্স।",
    ogImage: "https://res.cloudinary.com/drvyjj7td/image/upload/v1789311109/Bangla-Boss-2.0-Samnad-Academy-mahims.com_ndkpt8.jpg",
    twitterTitle: "বাংলা বস ২.০ | Mahims Classroom",
    twitterDescription: "বাংলা ব্যাকরণ ও নির্মিতি অংশে পূর্ণাঙ্গ প্রস্তুতির সেরা কোর্স।",
    twitterImage: "https://res.cloudinary.com/drvyjj7td/image/upload/v1789311109/Bangla-Boss-2.0-Samnad-Academy-mahims.com_ndkpt8.jpg",
    jsonLd: {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "BreadcrumbList",
          "name": "বাংলা বস ২.০ — Mahims Classroom",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "হোম (Home)", "item": "https://mahims.com/" },
            { "@type": "ListItem", "position": 2, "name": "মাহিম ক্লাসরুম (Classroom)", "item": "https://mahims.com/classroom/" },
            { "@type": "ListItem", "position": 3, "name": "কোর্সসমূহ (Courses)", "item": "https://mahims.com/classroom/courses/" },
            { "@type": "ListItem", "position": 4, "name": "বাংলা বস ২.০", "item": "https://mahims.com/classroom/courses/bangla-boss-2-course/" }
          ]
        },
        {
          "@type": "Course",
          "@id": `${siteUrl}/classroom/courses/bangla-boss-2-course/#course`,
          "name": "বাংলা বস ২.০ | Bangla Boss 2.0 Course",
          "description": "বাংলা ব্যাকরণ ও নির্মিতি অংশে সর্বোচ্চ প্রস্তুতির জন্য Samnad Academy-র বিশেষ কোর্স বাংলা বস ২.০।"
        }
      ]
    },
    prerenderHtml: `
      <div class="min-h-screen bg-[#fffbf7] text-zinc-900 font-sans">
        <header class="border-b border-orange-200 bg-white/95 backdrop-blur-md sticky top-0 z-20">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
            <a href="/classroom/" class="flex items-center gap-3">
              <span class="w-9 h-9 rounded-xl bg-orange-600 text-white flex items-center justify-center font-bold text-lg">M</span>
              <div>
                <span class="font-black text-lg block leading-tight text-zinc-950">Mahims Classroom</span>
                <span class="text-xs text-orange-600 font-semibold">mahims.com/classroom/courses/bangla-boss-2-course</span>
              </div>
            </a>
            <a href="/classroom/courses/" class="text-xs font-bold px-3 py-1.5 rounded-lg border border-orange-300 text-orange-900 hover:bg-orange-100">সকল কোর্স</a>
          </div>
        </header>

        <main class="max-w-4xl mx-auto px-4 py-12 text-center">
          <h1 class="text-3xl sm:text-5xl font-black text-zinc-950 mb-4">বাংলা বস ২.০ (Bangla Boss 2.0)</h1>
          <p class="text-base sm:text-lg text-zinc-600 max-w-xl mx-auto leading-relaxed mb-8">
            এইচএসসি বাংলা ব্যাকরণ ও নির্মিতি অংশে সর্বোচ্চ প্রস্তুতির জন্য Samnad Academy-র বিশেষ কোর্স।
          </p>
          <a href="https://samnadacademy.com/courses/bangla-boss-2-course/" target="_blank" rel="noopener noreferrer" class="inline-block py-3.5 px-8 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-base shadow-lg">
            কোর্সটি কিনুন &rarr;
          </a>
        </main>
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
          "name": "মাহিম সালামি (Mahim Salami)",
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
          "operatingSystem": "All",
          "browserRequirements": "Requires JavaScript. Requires HTML5.",
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "BDT"
          },
          "author": {
            "@type": "Person",
            "name": "Mahim Ibne Khudi",
            "url": "https://mahims.com/"
          },
          "featureList": [
            "ডিজিটাল ঈদ সালামি ট্র্যাকিং",
            "বিকাশ, নগদ ও রকেট সাপোর্ট",
            "ইনস্ট্যান্ট শুভেচ্ছা বার্তা প্রদর্শন",
            "রিয়েলটাইম স্ট্যাটাস"
          ]
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
          "name": "চিঠি — বেনামী বার্তা পোর্টাল (Mahim Chithi)",
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
          "operatingSystem": "All",
          "browserRequirements": "Requires JavaScript. Requires HTML5.",
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "BDT"
          },
          "author": {
            "@type": "Person",
            "name": "Mahim Ibne Khudi",
            "url": "https://mahims.com/"
          },
          "featureList": [
            "১০০% পরিচয়হীন বেনামী বার্তা প্রেরণ",
            "কাগজ ও কালির ক্লাসিক থিম সিলেকশন",
            "এনক্রিপ্টেড ও সম্পূর্ণ ব্যক্তিগত ইনবক্স ডেলিভারি",
            "কোনো রেজিস্ট্রেশন বা লগইন ছাড়াই বার্তা প্রেরণ"
          ]
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
    title: "Mahim Portfolio | Mahims Portfolio — মাহিম ইবনে খুদি (প্রজেক্ট ও সিভি)",
    metaTitle: "Mahim Portfolio | Mahims Portfolio — মাহিম ইবনে খুদি",
    description: "Mahim Portfolio (Mahims Portfolio) - মাহিম ইবনে খুদির অফিসিয়াল পোর্টফোলিও, ফুল-স্ট্যাক ওয়েব অ্যাপ্লিকেশন, নো-কোড ওয়ার্কফ্লো অটোমেশন, ব্র্যান্ড আইডেন্টিটি এবং ক্রিয়েটিভ প্রজেক্ট পোর্টফোলিও ও সিভি।",
    keywords: "Mahim Portfolio, Mahims Portfolio, mahim portfolio, mahims portfolio, mahim cv, mahim ibne khudi portfolio, মাহিম পোর্টফোলিও, mahims.com/portfolio, ফুল-স্ট্যাক ডেভেলপার মাহিম, গ্রাফিক্স ডিজাইন মাহিম, ওয়েব প্রজেক্টস",
    canonical: `${siteUrl}/portfolio/`,
    ogTitle: "Mahim Portfolio | Mahims Portfolio — মাহিম ইবনে খুদি",
    ogDescription: "সফটওয়্যার ডেভেলপমেন্ট, কোডিং প্রজেক্টস, প্রযুক্তি স্ট্যাক ও কাজের ইতিহাস।",
    ogImage: defaultOgImage,
    twitterTitle: "Mahim Portfolio | Mahims Portfolio — মাহিম ইবনে খুদি",
    twitterDescription: "সফটওয়্যার ডেভেলপমেন্ট ও ক্রিয়েটিভ ডিজাইনের সমন্বিত পোর্টফোলিও।",
    twitterImage: defaultOgImage,
    jsonLd: {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "BreadcrumbList",
          "name": "মাহিম ইবনে খুদি পোর্টফোলিও (Portfolio)",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "হোম (Home)", "item": "https://mahims.com/" },
            { "@type": "ListItem", "position": 2, "name": "পোর্টফোলিও (Portfolio)", "item": "https://mahims.com/portfolio/" }
          ]
        },
        {
          "@type": "ProfilePage",
          "@id": "https://mahims.com/portfolio#profile",
          "name": "Mahim Ibne Khudi Professional Portfolio | পোর্টফোলিও ও সিভি",
          "url": "https://mahims.com/portfolio/",
          "description": "Mahim's full-stack development, software engineering, automation workflows and design projects.",
          "primaryImageOfPage": defaultOgImage,
          "mainEntity": {
            "@type": "Person",
            "@id": "https://mahims.com/portfolio#person",
            "name": "Mahim Ibne Khudi",
            "alternateName": ["মাহিম ইবনে খুদি", "Mahim", "Mahim Khudi", "মাহিম"],
            "url": "https://mahims.com/portfolio/",
            "image": defaultOgImage,
            "jobTitle": "Full-Stack Web Developer & Creative Designer",
            "worksFor": {
              "@type": "Organization",
              "name": "Mahim's World",
              "url": "https://mahims.com/"
            },
            "alumniOf": {
              "@type": "CollegeOrUniversity",
              "name": "Dhaka Central University"
            },
            "sameAs": [
              "https://github.com/mahim2005",
              "https://facebook.com/mahim2005",
              "https://www.linkedin.com/in/mahimibnekhudi",
              "https://mahims.com/"
            ],
            "knowsAbout": [
              "React",
              "TypeScript",
              "Node.js",
              "Next.js",
              "Tailwind CSS",
              "REST APIs",
              "UI/UX Design",
              "Automation Workflows"
            ]
          }
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
            <h1 class="text-3xl sm:text-5xl font-black text-zinc-950 tracking-tight">Mahim Portfolio | Mahims Portfolio — মাহিম ইবনে খুদি</h1>
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

  thoughts: {
    title: "Think With Mahim — বিশ্বাস, যুক্তি ও অভিজ্ঞতার আলোয় জীবনের অনুসন্ধান | Mahim's World",
    metaTitle: "Think With Mahim — বিশ্বাস, যুক্তি ও অভিজ্ঞতার আলোয় জীবনের অনুসন্ধান",
    description: "Think With Mahim (mahims.com/thoughts) — মাহিম ইবনে খুদির ব্যক্তিগত চিন্তাভাবনা, দর্শন, ধর্মতত্ত্ব, বিশ্বাস ও যুক্তির আলোয় জীবনের অনুসন্ধানের মুক্ত বুদ্ধিবৃত্তিক অঙ্গন।",
    keywords: "Think With Mahim, think with mahim, mahims.com/thoughts, মাহিম ইবনে খুদি দর্শন, ধর্মতত্ত্ব ও যুক্তি, ইসলাম ও সমকালীন দর্শন, আত্মশুদ্ধি ও মুক্তচিন্তা",
    canonical: `${siteUrl}/thoughts/`,
    ogTitle: "Think With Mahim — বিশ্বাস, যুক্তি ও অভিজ্ঞতার আলোয় জীবনের অনুসন্ধান",
    ogDescription: "মাহিম ইবনে খুদির ব্যক্তিগত চিন্তাভাবনা, দর্শন, ধর্মতত্ত্ব, বিশ্বাস ও যুক্তির আলোয় জীবনের অনুসন্ধানের মুক্ত বুদ্ধিবৃত্তিক অঙ্গন।",
    ogImage: thoughtsOgImage,
    twitterTitle: "Think With Mahim — বিশ্বাস, যুক্তি ও অভিজ্ঞতার আলোয় জীবনের অনুসন্ধান",
    twitterDescription: "মাহিম ইবনে খুদির ব্যক্তিগত চিন্তাভাবনা, দর্শন, ধর্মতত্ত্ব ও জীবনের অনুসন্ধান।",
    twitterImage: thoughtsOgImage,
    jsonLd: {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "BreadcrumbList",
          "name": "Think With Mahim",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "হোম (Home)", "item": "https://mahims.com/" },
            { "@type": "ListItem", "position": 2, "name": "Think With Mahim", "item": "https://mahims.com/thoughts/" }
          ]
        },
        {
          "@type": "CollectionPage",
          "@id": "https://mahims.com/thoughts/#webpage",
          "url": "https://mahims.com/thoughts/",
          "name": "Think With Mahim — বিশ্বাস, যুক্তি ও অভিজ্ঞতার আলোয় জীবনের অনুসন্ধান",
          "description": "মাহিম ইবনে খুদির ব্যক্তিগত চিন্তাভাবনা, দর্শন, ধর্মতত্ত্ব, বিশ্বাস ও যুক্তির আলোয় জীবনের অনুসন্ধান।",
          "primaryImageOfPage": thoughtsOgImage,
          "isPartOf": {
            "@type": "WebSite",
            "name": "Mahim's World",
            "url": "https://mahims.com/"
          },
          "author": {
            "@type": "Person",
            "name": "Mahim Ibne Khudi",
            "url": "https://mahims.com/"
          }
        }
      ]
    },
    prerenderHtml: `
      <div class="min-h-screen bg-[#fdfdfb] text-zinc-900 font-sans p-6 sm:p-12 max-w-5xl mx-auto">
        <header class="text-center space-y-4 pt-6 pb-8">
          <span class="inline-block px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-800 text-xs font-bold">দর্শন • ধর্মতত্ত্ব • বিশ্বাস ও যুক্তি</span>
          <h1 class="text-4xl sm:text-5xl font-black text-zinc-950">Think With Mahim</h1>
          <p class="text-xl font-bold text-amber-600">বিশ্বাস, যুক্তি ও অভিজ্ঞতার আলোয় জীবনের অনুসন্ধান</p>
          <p class="text-sm text-zinc-600 max-w-xl mx-auto">এখানে আমি বিভিন্ন বিষয়ে লেখালেখি করবো। নিজের চিন্তাভাবনা, দর্শন, ধর্মতত্ত্ব, বিশ্বাস ও যুক্তির আলোয় জীবনের অনুসন্ধান।</p>
        </header>
        <div class="rounded-2xl overflow-hidden border border-amber-500/25 my-6 shadow-xl">
          <img src="${thoughtsOgImage}" alt="Think With Mahim" class="w-full h-auto block" />
        </div>
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

    let targetRoute = route;
    const routeAliases = {
      'classroom/mentorship': 'classroom/courses/mentorship',
      'courses/mentorship': 'classroom/courses/mentorship',
      'classroom/courses/mentorship/mahim': 'classroom/courses/mentorship/mahim-ibn-khudi',
      'classroom/courses/mentorship/samiul': 'classroom/courses/mentorship/samiul-islam-sohorab',
      'classroom/courses/mentorship/suza': 'classroom/courses/mentorship/abu-saleh-suza',
      'classroom/courses/mentorship/mithen': 'classroom/courses/mentorship/mishkat-sharif-mithen',
      'classroom/courses/mentorship/combo': 'classroom/courses/mentorship/mentorship-program-combo',
      'courses/mentorship/mahim-ibn-khudi': 'classroom/courses/mentorship/mahim-ibn-khudi',
      'courses/mentorship/samiul-islam-sohorab': 'classroom/courses/mentorship/samiul-islam-sohorab',
      'courses/mentorship/abu-saleh-suza': 'classroom/courses/mentorship/abu-saleh-suza',
      'courses/mentorship/mishkat-sharif-mithen': 'classroom/courses/mentorship/mishkat-sharif-mithen',
      'courses/mentorship/mentorship-program-combo': 'classroom/courses/mentorship/mentorship-program-combo',
      'courses/mentorship/mahim': 'classroom/courses/mentorship/mahim-ibn-khudi',
      'courses/mentorship/samiul': 'classroom/courses/mentorship/samiul-islam-sohorab',
      'courses/mentorship/suza': 'classroom/courses/mentorship/abu-saleh-suza',
      'courses/mentorship/mithen': 'classroom/courses/mentorship/mishkat-sharif-mithen',
      'courses/mentorship/combo': 'classroom/courses/mentorship/mentorship-program-combo'
    };
    if (routeAliases[targetRoute]) {
      targetRoute = routeAliases[targetRoute];
    }

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
    } else if (routeData[targetRoute]) {
      const data = routeData[targetRoute];

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
      // Strip any existing root JSON-LD structured data from root index.html so it doesn't leak into sub-routes
      htmlContent = htmlContent.replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/g, '');
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
      <h1>Mahims (মাহিমস) | Mahim's World — মাহিম ইবনে খুদি</h1>
      <p>Mahims (mahims.com) - মাহিম ইবনে খুদির অফিসিয়াল ডিজিটাল প্ল্যাটফর্ম ও ইকোসিস্টেম। শিক্ষা, ক্লাসরুম (Mahims Classroom), প্রযুক্তি, পোর্টফোলিও (Mahim Portfolio) ও সৃষ্টিশীল দিগন্ত।</p>
      <nav aria-label="প্রধান নেভিগেশন">
        <ul>
          <li><a href="https://mahims.com/">Mahims Home (হোম)</a></li>
          <li><a href="https://mahims.com/classroom/">Mahims Classroom | Mahim Classroom (মাহিম ক্লাসরুম)</a></li>
          <li><a href="https://mahims.com/portfolio/">Mahim Portfolio | Mahims Portfolio (মাহিম পোর্টফোলিও)</a></li>
          <li><a href="https://mahims.com/blog/">Mahim Blog (মাহিম ব্লগ)</a></li>
          <li><a href="https://mahims.com/chithi/">Mahim Chithi (মাহিম চিঠি)</a></li>
          <li><a href="https://mahims.com/salami/">Mahim Salami (মাহিম সালামি)</a></li>
          <li><a href="https://mahims.com/about/">About Mahims (আমার সম্পর্কে)</a></li>
          <li><a href="https://mahims.com/contact/">Contact Mahims (যোগাযোগ)</a></li>
        </ul>
      </nav>
    </header>
    <main class="sr-only">
      <section>
        <h2>Mahims (মাহিমস) — Official Portal &amp; Digital Ecosystem</h2>
        <p>Official website of Mahim Ibne Khudi: <strong>Mahims</strong> (mahims.com). A comprehensive personal portal, digital classroom, technology projects, and portfolio.</p>
      </section>
      <section>
        <h2>Mahims Classroom | Mahim Classroom (মাহিম ক্লাসরুম) — একাডেমি ও এডমিশন</h2>
        <p>Official academic and admission test platform: Mahims Classroom (Mahim Classroom / Mahim's Classroom). এইচএসসি, এসএসসি ও বিশ্ববিদ্যালয় ভর্তি পরীক্ষার্থীদের জন্য নিবেদিত শিক্ষা প্ল্যাটফর্ম। কনসেপ্ট ক্লাস, স্মার্ট টেস্ট ইঞ্জিন ও মেন্টরশিপ। প্রতিষ্ঠাতা: মাহিম (Mahim Ibne Khudi, ঢাকা সেন্ট্রাল ইউনিভার্সিটি)।</p>
        <p>শিক্ষক ও মেন্টর প্যানেল:</p>
        <ul>
          <li><a href="https://mahims.com/classroom/mahim/">মাহিম (Mahim) — প্রতিষ্ঠাতা ও আইসিটি মেন্টর, Mahims Classroom (Mahim Classroom)</a></li>
          <li><a href="https://mahims.com/classroom/suza/">আবু সালেহ সুজা (Abu Saleh Suza) — ইংরেজি মেন্টর, Mahim Classroom</a></li>
          <li><a href="https://mahims.com/classroom/samiul/">সামিউল ইসলাম সোহরাব (Samiul Islam Sohrab) — বাংলা মেন্টর, Mahims Classroom</a></li>
          <li><a href="https://mahims.com/classroom/mithen/">মিশকাত শরীফ মিথেন (Mishkat Sharif Mithen) — সাধারণ জ্ঞান মেন্টর, Mahims Classroom</a></li>
          <li><a href="https://mahims.com/classroom/swocchol/">স্বচ্ছল কুমার কর্মকার (Swocchol Kumar Karmokar) — বিজ্ঞান ও গণিত মেন্টর, Mahims Classroom</a></li>
        </ul>
        <p><a href="https://mahims.com/classroom/">Enter Mahims Classroom (Mahim Classroom / মাহিম ক্লাসরুম)</a></p>
      </section>
      <section>
        <h2>Mahim Portfolio | Mahims Portfolio (মাহিম পোর্টফোলিও) — ফুল-স্ট্যাক প্রজেক্ট ও সিভি</h2>
        <p>Mahim's professional software engineering, TypeScript, React, automation workflows, and brand identity projects. Visit <a href="https://mahims.com/portfolio/">Mahim Portfolio (Mahims Portfolio)</a>.</p>
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
