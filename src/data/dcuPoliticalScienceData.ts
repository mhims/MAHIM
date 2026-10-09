export interface PSTeacher {
  id: string;
  code: string;
  name: string;
  designation: string;
  department: string;
}

export interface PSCourse {
  code: string;
  titleEn: string;
  titleBn: string;
  courseType?: 'Major' | 'Non-Major' | 'Compulsory';
  credits?: number;
  description?: string;
  syllabusDriveUrl?: string;
}

export interface PSClassSession {
  id: string;
  dayIndex: number; // 0: Sunday, 1: Monday, 2: Tuesday, 3: Wednesday, 4: Thursday, 5: Friday, 6: Saturday
  dayNameEn: string;
  dayNameBn: string;
  courseCode: string;
  courseTitleBn: string;
  courseTitleEn: string;
  startTime: string; // e.g. "10:45"
  endTime: string;   // e.g. "11:30"
  timeFormatted: string; // e.g. "১০:৪৫ - ১১:৩০"
  timeFormattedEn: string; // e.g. "10:45 AM - 11:30 AM"
  teacherCode: string;
  teacherName: string;
  room: string;
  note?: string;
}

export interface PSNotice {
  id: string;
  title: string;
  date: string;
  category: 'জরুরি' | 'ক্লাস রুটিন' | 'পরীক্ষা' | 'অ্যাসাইনমেন্ট' | 'সাধারণ';
  content: string;
  fileUrl?: string;
  fileName?: string;
  pinned?: boolean;
}

export interface PSBookResource {
  id: string;
  courseCode: string;
  courseTitle: string;
  title: string;
  author: string;
  edition?: string;
  category: 'মূল বই' | 'লেকচার শিট' | 'হ্যান্ডনোট' | 'সিলেবাস ও প্রশ্ন';
  driveUrl: string;
  fileSize?: string;
}

export interface PSSubscriber {
  id: string;
  name: string;
  email: string;
  studentId?: string;
  subscribedAt: string;
}

export interface PSCREntry {
  id: string;
  name: string;
  phone: string;
  link: string;
  role?: string;
}

export const INITIAL_PS_CRS: PSCREntry[] = [
  {
    id: 'cr-himel',
    name: 'হিমেল',
    phone: '+8801629011185',
    link: 'https://wa.me/8801629011185',
    role: 'ক্লাস প্রতিনিধি (CR)'
  },
  {
    id: 'cr-tonumoy',
    name: 'তনুময়',
    phone: '+8801967844429',
    link: 'https://wa.me/8801967844429',
    role: 'ক্লাস প্রতিনিধি (CR)'
  }
];

export const INITIAL_PS_TEACHERS: PSTeacher[] = [
  { id: 'sa', code: 'SA', name: 'Professor Shirin Akter Yeasmin', designation: 'Chairman & Professor', department: 'Political Science' },
  { id: 'fs', code: 'FS', name: 'Prof. Farjana Sultana', designation: 'Professor', department: 'Political Science' },
  { id: 'fj', code: 'FJ', name: 'Prof. Farjana Jesmin', designation: 'Professor', department: 'Political Science' },
  { id: 'ti', code: 'TI', name: 'Tanima Islam', designation: 'Associate Professor', department: 'Political Science' },
  { id: 'cs', code: 'CS', name: 'Chhanda Shaha', designation: 'Assistant Professor', department: 'Political Science' },
  { id: 'pb', code: 'PB', name: 'Pallabi Barai', designation: 'Assistant Professor', department: 'Political Science' },
  { id: 'mr', code: 'MR', name: 'Md. Musfiqur Rahman', designation: 'Assistant Professor', department: 'Political Science' },
  { id: 'nt', code: 'NT', name: 'Nausheen Tahsin', designation: 'Assistant Professor', department: 'Political Science' },
  { id: 'ni', code: 'NI', name: 'Professor Nurul Islam', designation: 'Guest Speaker & Professor', department: 'Political Science' },
];

export const INITIAL_PS_COURSES: PSCourse[] = [
  {
    code: 'PS-101',
    titleEn: 'Ancient and Medieval Western Political Thought',
    titleBn: 'প্রাচীন ও মধ্যযুগীয় পাশ্চাত্য রাষ্ট্রচিন্তা',
    courseType: 'Major',
    credits: 4,
    description: 'প্লেটো, এরিস্টটল, সিসেরো, অগাস্টিন, আকুইনাস ও মেকিয়াভেলির রাজনৈতিক দর্শন ও ভাবনা।'
  },
  {
    code: 'PS-102',
    titleEn: 'Political Theory and Organization',
    titleBn: 'রাজনৈতিক তত্ত্ব ও সংগঠন',
    courseType: 'Major',
    credits: 4,
    description: 'রাষ্ট্রের প্রকৃতি, সার্বভৌমত্ব, আইন, স্বাধীনতা, সমতা, অধিকার ও সরকারের রূপরেখা।'
  },
  {
    code: 'PS-103',
    titleEn: 'Government and Politics: UK, USA and France',
    titleBn: 'সরকার ও রাজনীতি: যুক্তরাজ্য, যুক্তরাষ্ট্র ও ফ্রান্স',
    courseType: 'Major',
    credits: 4,
    description: 'যুক্তরাজ্য, যুক্তরাষ্ট্র এবং ফ্রান্সের সাংবিধানিক কাঠামো, শাসনব্যবস্থা ও রাজনৈতিক ব্যবস্থার তুলনামূলক আলোচনা।'
  },
  {
    code: 'PS-104',
    titleEn: 'Principles of Sociology',
    titleBn: 'সমাজবিজ্ঞানের মূলনীতি',
    courseType: 'Non-Major',
    credits: 4,
    description: 'সমাজকাঠামো, সামাজিকীকরণ, সংস্কৃতি, সামাজিক স্তরবিন্যাস ও সামাজিক পরিবর্তন।'
  },
  {
    code: 'PS-105',
    titleEn: 'Modern Western Political Thought',
    titleBn: 'আধুনিক পাশ্চাত্য রাষ্ট্রচিন্তা',
    courseType: 'Major',
    credits: 4,
    description: 'হবস, লক, রুশো, বেন্থাম, মিল ও মার্ক্সের আধুনিক রাজনৈতিক দর্শনের মূলনীতি ও প্রভাব।'
  },
  {
    code: 'HEIBD (21150)',
    titleEn: 'History of the Emergence of Independent Bangladesh',
    titleBn: 'স্বাধীন বাংলাদেশের অভ্যুদয়ের ইতিহাস',
    courseType: 'Compulsory',
    credits: 4,
    description: 'ভাষা আন্দোলন থেকে ১৯৭১-এর মহান মুক্তিযুদ্ধ এবং স্বাধীন সার্বভৌম বাংলাদেশের অভ্যুদয়।'
  },
  {
    code: 'PS-107',
    titleEn: 'Socio-Political and Constitutional Development in British India (1757 to 1947)',
    titleBn: 'ব্রিটিশ ভারতে সামাজিক-রাজনৈতিক ও সাংবিধানিক উন্নয়ন (১৭৫৭ থেকে ১৯৪৭)',
    courseType: 'Major',
    credits: 4,
    description: 'পলাশীর যুদ্ধ থেকে ১৯৪৭-এর দেশভাগ পর্যন্ত ভারতে সামাজিক-রাজনৈতিক সংগ্রাম ও সাংবিধানিক সংস্কারের ধারাবাহিক ইতিহাস।'
  },
  {
    code: 'PS-108',
    titleEn: 'Public Administration in Bangladesh',
    titleBn: 'বাংলাদেশে লোক প্রশাসন',
    courseType: 'Major',
    credits: 4,
    description: 'বাংলাদেশের প্রশাসন ব্যবস্থা, আমলাতন্ত্র, নীতি নির্ধারণ, উন্নয়ন প্রশাসন ও স্থানীয় সরকার কাঠামো।'
  },
];

export const INITIAL_PS_ROUTINE: PSClassSession[] = [
  // Sunday (রবিবার) - dayIndex 0
  {
    id: 'sun-1',
    dayIndex: 0,
    dayNameEn: 'Sunday',
    dayNameBn: 'রবিবার',
    courseCode: 'PS-101',
    courseTitleBn: 'প্রাচীন ও মধ্যযুগীয় পাশ্চাত্য রাষ্ট্রচিন্তা',
    courseTitleEn: 'Ancient and Medieval Western Political Thought',
    startTime: '10:45',
    endTime: '11:30',
    timeFormatted: '১০:৪৫ - ১১:৩০',
    timeFormattedEn: '10:45 AM - 11:30 AM',
    teacherCode: 'NT',
    teacherName: 'Nausheen Tahsin (NT)',
    room: 'R-302',
    note: 'প্রথম ক্লাস (১০:৪৫ মিনিটে শুরু)'
  },
  {
    id: 'sun-2',
    dayIndex: 0,
    dayNameEn: 'Sunday',
    dayNameBn: 'রবিবার',
    courseCode: 'PS-108',
    courseTitleBn: 'বাংলাদেশে লোক প্রশাসন',
    courseTitleEn: 'Public Administration in Bangladesh',
    startTime: '11:30',
    endTime: '12:15',
    timeFormatted: '১১:৩০ - ১২:১৫',
    timeFormattedEn: '11:30 AM - 12:15 PM',
    teacherCode: 'MR',
    teacherName: 'Md. Musfiqur Rahman (MR)',
    room: 'R-302',
  },
  {
    id: 'sun-3',
    dayIndex: 0,
    dayNameEn: 'Sunday',
    dayNameBn: 'রবিবার',
    courseCode: 'HEIBD (21150)',
    courseTitleBn: 'স্বাধীন বাংলাদেশের অভ্যুদয়ের ইতিহাস',
    courseTitleEn: 'History of the Emergence of Independent Bangladesh',
    startTime: '13:00',
    endTime: '13:45',
    timeFormatted: '০১:০০ - ০১:৪৫',
    timeFormattedEn: '01:00 PM - 01:45 PM',
    teacherCode: 'MR',
    teacherName: 'Md. Musfiqur Rahman (MR)',
    room: 'R-302',
    note: 'টিউটোরিয়াল / ইতিহাস কোর্স'
  },

  // Monday (সোমবার) - dayIndex 1
  {
    id: 'mon-1',
    dayIndex: 1,
    dayNameEn: 'Monday',
    dayNameBn: 'সোমবার',
    courseCode: 'PS-107',
    courseTitleBn: 'ব্রিটিশ ভারতে সামাজিক-রাজনৈতিক ও সাংবিধানিক উন্নয়ন (১৭৫৭-১৯৪৭)',
    courseTitleEn: 'Socio-Political & Constitutional Dev in British India',
    startTime: '10:00',
    endTime: '10:45',
    timeFormatted: '১০:০০ - ১০:৪৫',
    timeFormattedEn: '10:00 AM - 10:45 AM',
    teacherCode: 'CS',
    teacherName: 'Chhanda Shaha (CS)',
    room: 'R-302',
  },
  {
    id: 'mon-2',
    dayIndex: 1,
    dayNameEn: 'Monday',
    dayNameBn: 'সোমবার',
    courseCode: 'PS-103',
    courseTitleBn: 'সরকার ও রাজনীতি: যুক্তরাজ্য, যুক্তরাষ্ট্র ও ফ্রান্স',
    courseTitleEn: 'Government and Politics: UK, USA and France',
    startTime: '10:45',
    endTime: '11:30',
    timeFormatted: '১০:৪৫ - ১১:৩০',
    timeFormattedEn: '10:45 AM - 11:30 AM',
    teacherCode: 'NI',
    teacherName: 'Prof. Nurul Islam (NI)',
    room: 'R-302',
    note: 'Guest Speaker Class'
  },

  // Tuesday (মঙ্গলবার) - dayIndex 2
  {
    id: 'tue-1',
    dayIndex: 2,
    dayNameEn: 'Tuesday',
    dayNameBn: 'মঙ্গলবার',
    courseCode: 'PS-104',
    courseTitleBn: 'সমাজবিজ্ঞানের মূলনীতি',
    courseTitleEn: 'Principles of Sociology',
    startTime: '10:00',
    endTime: '10:45',
    timeFormatted: '১০:০০ - ১০:৪৫',
    timeFormattedEn: '10:00 AM - 10:45 AM',
    teacherCode: 'PB',
    teacherName: 'Pallabi Barai (PB)',
    room: 'R-302',
  },
  {
    id: 'tue-2',
    dayIndex: 2,
    dayNameEn: 'Tuesday',
    dayNameBn: 'মঙ্গলবার',
    courseCode: 'PS-105',
    courseTitleBn: 'আধুনিক পাশ্চাত্য রাষ্ট্রচিন্তা',
    courseTitleEn: 'Modern Western Political Thought',
    startTime: '10:45',
    endTime: '11:30',
    timeFormatted: '১০:৪৫ - ১১:৩০',
    timeFormattedEn: '10:45 AM - 11:30 AM',
    teacherCode: 'FS',
    teacherName: 'Prof. Farjana Sultana (FS)',
    room: 'R-302',
  },

  // Thursday (বৃহস্পতিবার) - dayIndex 4
  {
    id: 'thu-1',
    dayIndex: 4,
    dayNameEn: 'Thursday',
    dayNameBn: 'বৃহস্পতিবার',
    courseCode: 'PS-102',
    courseTitleBn: 'রাজনৈতিক তত্ত্ব ও সংগঠন',
    courseTitleEn: 'Political Theory and Organization',
    startTime: '10:00',
    endTime: '10:45',
    timeFormatted: '১০:০০ - ১০:৪৫',
    timeFormattedEn: '10:00 AM - 10:45 AM',
    teacherCode: 'TI',
    teacherName: 'Tanima Islam (TI)',
    room: 'R-302',
  },
  {
    id: 'thu-2',
    dayIndex: 4,
    dayNameEn: 'Thursday',
    dayNameBn: 'বৃহস্পতিবার',
    courseCode: 'PS-103',
    courseTitleBn: 'সরকার ও রাজনীতি: যুক্তরাজ্য, যুক্তরাষ্ট্র ও ফ্রান্স',
    courseTitleEn: 'Government and Politics: UK, USA and France',
    startTime: '10:45',
    endTime: '11:30',
    timeFormatted: '১০:৪৫ - ১১:৩০',
    timeFormattedEn: '10:45 AM - 11:30 AM',
    teacherCode: 'FJ',
    teacherName: 'Prof. Farjana Jesmin (FJ)',
    room: 'R-302',
  },
];

export const DCU_LOGOS = {
  university: 'https://res.cloudinary.com/drvyjj7td/image/upload/v1791540199/logo_df1onj.png',
  campus: 'https://res.cloudinary.com/drvyjj7td/image/upload/v1791540249/images_1_d5hcvu.jpg',
};

// All dummy notices removed as requested - will be added later via Admin Panel or Google Sheet
export const INITIAL_PS_NOTICES: PSNotice[] = [];

// All dummy books removed as requested - will be added later via Admin Panel
export const INITIAL_PS_BOOKS: PSBookResource[] = [];

export const INITIAL_PS_SUBSCRIBERS: PSSubscriber[] = [
  {
    id: 'sub-1',
    name: 'মাহিম ইবনে খুদি',
    email: 'mahimibnkhudi@gmail.com',
    studentId: 'PS-01',
    subscribedAt: '2026-10-09'
  }
];
