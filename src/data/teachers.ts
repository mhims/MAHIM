export interface TeacherProfile {
  id: string; // 'mahim' | 'samiul' | 'suza' | 'mithen'
  slug: string; // url slug: 'mahim', 'samiul', 'suza', 'mithen'
  name: string;
  englishName?: string;
  role: string;
  institution: string;
  photoUrl: string;
  bannerGradient: string;
  tagline: string;
  shortBio: string;
  metaTitle: string;
  metaDescription: string;
  highlights: {
    label: string;
    value: string;
    subtext?: string;
    badge?: string;
  }[];
  education: {
    institution: string;
    degree: string;
    session?: string;
    status: string;
    tag?: string;
  }[];
  admissionOffers?: {
    institution: string;
    subject: string;
    session?: string;
    code: string;
  }[];
  meritRank?: {
    examName: string;
    rank: string;
    session: string;
  };
  achievements?: {
    exam: string;
    gpa: string;
    group: string;
    board: string;
    year: string;
  }[];
  teachingPhilosophy: string;
}

export const TEACHERS: Record<string, TeacherProfile> = {
  mahim: {
    id: 'mahim',
    slug: 'mahim',
    name: 'মাহিম ইবনে খুদি',
    englishName: 'Mahim Ibne Khudi',
    role: 'প্রতিষ্ঠাতা ও প্রধান মেন্টর, মাহিম’স ক্লাসরুম',
    institution: 'ঢাকা সেন্ট্রাল ইউনিভার্সিটি',
    photoUrl: 'https://res.cloudinary.com/drvyjj7td/image/upload/v1788708908/behance_pp_spfumh.jpg',
    bannerGradient: 'from-orange-500 via-amber-500 to-yellow-500',
    tagline: 'কনসেপ্ট নির্ভর শিক্ষা ও স্মার্ট টেস্ট পদ্ধতির উদ্ভাবক',
    shortBio: 'ঢাকা সেন্ট্রাল ইউনিভার্সিটির রাষ্ট্রবিজ্ঞান বিভাগের শিক্ষার্থী (ঢাকা কলেজ ক্যাম্পাস)। দীর্ঘদিনের পাঠদান অভিজ্ঞতা ও প্রযুক্তিগত দক্ষতার সমন্বয়ে শিক্ষার্থীদের সহজ ও মানসম্মত শিক্ষা সহায়তা প্রদানে নিবেদিত।',
    metaTitle: "Mahim (মাহিম) | প্রতিষ্ঠাতা ও মেন্টর — মাহিম'স ক্লাসরুম",
    metaDescription: "মাহিম (Mahim) - ঢাকা সেন্ট্রাল ইউনিভার্সিটির শিক্ষার্থী ও মাহিম'স ক্লাসরুমের প্রতিষ্ঠাতা। এইচএসসি ও বিশ্ববিদ্যালয় ভর্তি শিক্ষার্থীদের জন্য নিবেদিত মেন্টর।",
    highlights: [
      { label: 'প্রতিষ্ঠান', value: "মাহিম'স ক্লাসরুম", subtext: 'প্রতিষ্ঠাতা ও প্রধান মেন্টর' },
      { label: 'ক্যাম্পাস', value: 'ঢাকা কলেজ ক্যাম্পাস', subtext: 'ঢাকা সেন্ট্রাল ইউনিভার্সিটি' },
      { label: 'বিশেষত্ব', value: 'স্মার্ট টেস্ট ইঞ্জিন ও কনসেপ্ট ক্লাস', subtext: 'এইচএসসি ও এডমিশন' }
    ],
    education: [
      {
        institution: 'ঢাকা সেন্ট্রাল ইউনিভার্সিটি',
        degree: 'রাষ্ট্রবিজ্ঞান বিভাগ (Department of Political Science)',
        session: '২০২৫-২০২৬',
        status: 'বর্তমান শিক্ষার্থী (সেশন: ২০২৫-২০২৬)',
        tag: 'ঢাকা কলেজ ক্যাম্পাস'
      }
    ],
    teachingPhilosophy: 'মুখস্থবিদ্যার বদলে কনসেপ্ট ক্লিয়ার করা এবং নিয়মিত নির্ভুল মডেল টেস্টের মাধ্যমে পরীক্ষাভীতি দূর করাই মাহিম’স ক্লাসরুমের মূল লক্ষ্য।'
  },

  samiul: {
    id: 'samiul',
    slug: 'samiul',
    name: 'সামিউল ইসলাম সোহরাব',
    englishName: 'Samiul Islam Sohrab',
    role: 'ফাউন্ডার, সামনাদ একাডেমি • মেন্টর, শেখার সিড়ি',
    institution: 'ড্যাফোডিল ইন্টারন্যাশনাল ইউনিভার্সিটি',
    photoUrl: 'https://res.cloudinary.com/drvyjj7td/image/upload/v1789228263/763122727_1365661164992767_5907311244126216229_n_y5bajt.jpg',
    bannerGradient: 'from-amber-500 via-orange-500 to-red-500',
    tagline: 'সফটওয়্যার ইঞ্জিনিয়ারিং ও টেকনোলজির মাধ্যমে শিক্ষার্থীদের স্কিল বৃদ্ধিতে নিবেদিত',
    shortBio: 'ড্যাফোডিল ইন্টারন্যাশনাল ইউনিভার্সিটির সফটওয়্যার ইঞ্জিনিয়ারিংয়ের শিক্ষার্থী। সামনাদ একাডেমির প্রতিষ্ঠাতা এবং শেখার সিড়ির অভিজ্ঞ মেন্টর হিসেবে তরুণদের ক্যারিয়ার ও স্কিল মেন্টরশিপ প্রদান করে আসছেন।',
    metaTitle: "Samiul Islam Sohrab (সামিউল ইসলাম সোহরাব) | মেন্টর — মাহিম'স ক্লাসরুম",
    metaDescription: "সামিউল ইসলাম সোহরাব - ফাউন্ডার, সামনাদ একাডেমি ও মেন্টর, শেখার সিড়ি। সফটওয়্যার ইঞ্জিনিয়ারিং, ড্যাফোডিল ইন্টারন্যাশনাল ইউনিভার্সিটি।",
    highlights: [
      { label: 'উদ্যোগ', value: 'সামনাদ একাডেমি', subtext: 'প্রতিষ্ঠাতা ও পরিচালক' },
      { label: 'মেন্টরশিপ', value: 'শেখার সিড়ি', subtext: 'অফিসিয়াল মেন্টর' },
      { label: 'অধ্যয়ন', value: 'সফটওয়্যার ইঞ্জিনিয়ারিং', subtext: 'ড্যাফোডিল ইন্টারন্যাশনাল ইউনিভার্সিটি' }
    ],
    education: [
      {
        institution: 'ড্যাফোডিল ইন্টারন্যাশনাল ইউনিভার্সিটি (DIU)',
        degree: 'সফটওয়্যার ইঞ্জিনিয়ারিং (B.Sc. in Software Engineering)',
        status: 'অধ্যয়নরত শিক্ষার্থী',
        tag: 'Faculty of Science & IT'
      }
    ],
    teachingPhilosophy: 'প্রযুক্তির সঠিক ব্যবহারের মাধ্যমে পড়াশোনাকে আরও ইন্টারঅ্যাক্টিভ ও ফলপ্রসূ করা এবং ভবিষ্যৎ ক্যারিয়ারের উপযোগী স্কিল তৈরিতে শিক্ষার্থীদের সহায়তা করা।'
  },

  suza: {
    id: 'suza',
    slug: 'suza',
    name: 'আবু সালেহ সুজা',
    englishName: 'Abu Saleh Suja',
    role: 'ফার্মেসি বিভাগ, মওলানা ভাসানী বিজ্ঞান ও প্রযুক্তি বিশ্ববিদ্যালয়',
    institution: 'মওলানা ভাসানী বিজ্ঞান ও প্রযুক্তি বিশ্ববিদ্যালয় (MBSTU)',
    photoUrl: 'https://res.cloudinary.com/drvyjj7td/image/upload/v1789229348/518363223_1616327812659453_3831296542395096165_n_1_fak2cg.jpg',
    bannerGradient: 'from-emerald-500 via-teal-500 to-orange-500',
    tagline: 'গুচ্ছ ভর্তি পরীক্ষায় ৫১তম মেধাক্রম • বিজ্ঞান ও ফার্মেসি মেন্টর',
    shortBio: 'মওলানা ভাসানী বিজ্ঞান ও প্রযুক্তি বিশ্ববিদ্যালয়ের ফার্মেসি বিভাগের শিক্ষার্থী। ২০২৪-২০২৫ সেশনের গুচ্ছ ভর্তি পরীক্ষায় ৫১তম মেধাক্রম অর্জন করেন এবং জগন্নাথ বিশ্ববিদ্যালয় ও কুড়িগ্রাম কৃষি বিশ্ববিদ্যালয়ে সুযোগপ্রাপ্ত হন।',
    metaTitle: "Abu Saleh Suja (আবু সালেহ সুজা) | মেন্টর — মাহিম'স ক্লাসরুম",
    metaDescription: "আবু সালেহ সুজা - ফার্মেসি বিভাগ, মওলানা ভাসানী বিজ্ঞান ও প্রযুক্তি বিশ্ববিদ্যালয় (MBSTU)। গুচ্ছ ভর্তি পরীক্ষায় ৫১তম মেধাক্রম অর্জনকারী।",
    highlights: [
      { label: 'গুচ্ছ মেধাক্রম', value: '৫১ তম (Rank: 51)', subtext: 'GST Admission ২০২৪-২০২৫' },
      { label: 'অধ্যয়নরত বিভাগ', value: 'ফার্মেসি (Pharmacy)', subtext: 'MBSTU' },
      { label: 'বিজ্ঞান মেন্টরশিপ', value: 'বায়োলজি ও ফার্মেসি গাইডলাইন', subtext: 'অ্যাকাডেমিক ও ভর্তি প্রস্তুতি' }
    ],
    education: [
      {
        institution: 'মওলানা ভাসানী বিজ্ঞান ও প্রযুক্তি বিশ্ববিদ্যালয় (MBSTU)',
        degree: 'ফার্মেসি বিভাগ (Department of Pharmacy)',
        status: 'বর্তমান শিক্ষার্থী',
        tag: 'বিজ্ঞান অনুষদ'
      }
    ],
    meritRank: {
      examName: 'গুচ্ছ ভর্তি পরীক্ষা (GST Admission Test)',
      rank: '৫১ তম (Rank 51)',
      session: '২০২৪-২০২৫ শিক্ষাবর্ষ'
    },
    admissionOffers: [
      {
        institution: 'জগন্নাথ বিশ্ববিদ্যালয় (JnU)',
        subject: 'বোটানি (Botany)',
        session: '২০২৪-২০২৫ সেশন',
        code: 'JnU'
      },
      {
        institution: 'কুড়িগ্রাম কৃষি বিশ্ববিদ্যালয় (KAU)',
        subject: 'এগ্রিকালচার (Agriculture)',
        session: '২০২৪-২০২৫ সেশন',
        code: 'KAU'
      }
    ],
    teachingPhilosophy: 'ভর্তি পরীক্ষায় শীর্ষ তালিকায় উত্তীর্ণ হওয়ার মূল চাবিকাঠি হলো বিষয়ভিত্তিক নিখুঁত শর্টকাট, টাইপভিত্তিক সমাধান এবং নেগেটিভ মার্কিং নিয়ন্ত্রণের সঠিক অনুশীলন।'
  },

  mithen: {
    id: 'mithen',
    slug: 'mithen',
    name: 'মিশকাত শরীফ মিথেন',
    englishName: 'Mishkat Sharif Mithen',
    role: 'বেগম রোকেয়া বিশ্ববিদ্যালয় • ফাউন্ডারঃ মিথেন প্রাইভেট হোম',
    institution: 'বেগম রোকেয়া বিশ্ববিদ্যালয় (BRUR)',
    photoUrl: 'https://res.cloudinary.com/drvyjj7td/image/upload/v1789229549/mithen10_nrizvj.png',
    bannerGradient: 'from-blue-500 via-indigo-500 to-orange-500',
    tagline: 'ডাবল জিপিএ ৫ • গণিত ও বিজ্ঞান বিষয়ের স্পেশাল মেন্টর',
    shortBio: 'বেগম রোকেয়া বিশ্ববিদ্যালয়ের শিক্ষার্থী ও মিথেন প্রাইভেট হোমের প্রতিষ্ঠাতা। এসএসসি ২০২২ ও এইচএসসি ২০২৪ উভয় পরীক্ষায় দিনাজপুর বোর্ড থেকে বিজ্ঞান বিভাগে জিপিএ ৫.০০ প্রাপ্ত। এছাড়াও ঢাকা সেন্ট্রাল ইউনিভার্সিটির ম্যাথমেটিক্স বিভাগে সুযোগপ্রাপ্ত।',
    metaTitle: "Mishkat Sharif Mithen (মিশকাত শরীফ মিথেন) | মেন্টর — মাহিম'স ক্লাসরুম",
    metaDescription: "মিশকাত শরীফ মিথেন - বেগম রোকেয়া বিশ্ববিদ্যালয়। ফাউন্ডারঃ মিথেন প্রাইভেট হোম। এসএসসি ও এইচএসসি উভয় পরীক্ষায় জিপিএ ৫।",
    highlights: [
      { label: 'এইচএসসি ২০২৪', value: 'GPA 5.00', subtext: 'বিজ্ঞান বিভাগ, দিনাজপুর বোর্ড' },
      { label: 'এসএসসি ২০২২', value: 'GPA 5.00', subtext: 'বিজ্ঞান বিভাগ, দিনাজপুর বোর্ড' },
      { label: 'উদ্যোগ', value: 'মিথেন প্রাইভেট হোম', subtext: 'ফাউন্ডার ও মেন্টর' }
    ],
    education: [
      {
        institution: 'বেগম রোকেয়া বিশ্ববিদ্যালয়, রংপুর (BRUR)',
        degree: 'অনার্স (চলমান)',
        status: 'বর্তমান শিক্ষার্থী',
        tag: 'পাবলিক বিশ্ববিদ্যালয়'
      }
    ],
    admissionOffers: [
      {
        institution: 'ঢাকা সেন্ট্রাল ইউনিভার্সিটি, বাংলা কলেজ ক্যাম্পাস',
        subject: 'ডিপার্টমেন্ট অব ম্যাথমেটিক্স (Mathematics)',
        session: '২০২৪-২০২৫ সেশন',
        code: 'DCU'
      }
    ],
    achievements: [
      {
        exam: 'উচ্চ মাধ্যমিক (HSC)',
        gpa: 'জিপিএ ৫.০০ (GPA 5.00)',
        group: 'বিজ্ঞান বিভাগ',
        board: 'দিনাজপুর শিক্ষা বোর্ড',
        year: '২০২৪'
      },
      {
        exam: 'মাধ্যমিক (SSC)',
        gpa: 'জিপিএ ৫.০০ (GPA 5.00)',
        group: 'বিজ্ঞান বিভাগ',
        board: 'দিনাজপুর শিক্ষা বোর্ড',
        year: '২০২২'
      }
    ],
    teachingPhilosophy: 'গণিত ও বিজ্ঞানের জটিল বিষয়গুলোকে গাণিতিক লজিক, বাস্তব উদাহরণ ও সহজ কৌশলে উপস্থাপন করে শিক্ষার্থীদের ভেতর আত্মবিশ্বাস জাগিয়ে তোলা।'
  }
};
