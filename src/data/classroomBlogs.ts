export interface ClassroomBlogPost {
  id: string;
  slug: string;
  title: string;
  topic: string;
  category: string;
  author: string;
  authorRole?: string;
  authorAvatar?: string;
  date: string;
  readTime: string;
  coverImage: string;
  excerpt: string;
  content: string; // Markdown or rich structured text with headings, bullet points, quotes, and tip boxes
  tags: string[];
  seoKeywords: string;
  status: 'published' | 'draft';
  featured?: boolean;
  views?: number;
  likes?: number;
  createdAt: string;
  updatedAt?: string;
}

export const DEFAULT_CLASSROOM_BLOG_TOPICS = [
  'এডমিশন গাইডলাইন',
  'স্বপ্নজয়ের গল্প',
  'এডমিশন নিউজ ও ডেট',
  'এইচএসসি ও বোর্ড পরীক্ষা',
  'পরীক্ষার টেকনিক',
  'ক্যারিয়ার ও মোটিভেশন',
];

// All user-created blogs will be saved here. Kept completely empty so you can post your own content.
export const DEFAULT_CLASSROOM_BLOGS: ClassroomBlogPost[] = [];
