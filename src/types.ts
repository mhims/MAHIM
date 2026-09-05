export type PostVisibility = 'public' | 'members' | 'vip';

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage: string;
  altText: string;
  category: string;
  visibility: PostVisibility;
  author: string;
  date: string;
  readTime: string;
  views?: number;
}

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  passwordHash?: string;
  role: 'user' | 'vip' | 'admin';
  status: 'pending' | 'approved';
  joinedDate: string;
  phone?: string;
  occupation?: string;
}

export interface ExperienceItem {
  id: string;
  company: string;
  role: string;
  period: string;
  description: string;
  skillsUsed: string[];
  isCurrent?: boolean;
}

export interface EducationItem {
  id: string;
  degree: string;
  institution: string;
  department?: string;
  board?: string;
  period: string;
  result?: string;
  details?: string;
}

export interface SkillItem {
  id: string;
  name: string;
  category: 'design' | 'tools' | 'marketing' | 'other';
  proficiency: number;
  iconName?: string;
  highlight?: boolean;
}

export interface CertificationItem {
  id: string;
  title: string;
  issuer: string;
  year?: string;
  credentialId?: string;
  link?: string;
}

export interface SiteSettings {
  siteName: string;
  tagline: string;
  domain: string;
  primaryLang: string;
  
  // Hero section
  heroTitle: string;
  heroSubtitle: string;
  heroBio: string;
  heroImage: string;
  heroImageAlt: string;
  resumeDownloadUrl: string;
  
  // Contact & Social
  phone: string;
  email: string;
  address: string;
  facebookUrl?: string;
  instagramUrl?: string;
  linkedinUrl: string;
  fiverrUrl?: string;
  behanceUrl: string;
  whatsappNumber: string;
  whatsappLink: string;
  whatsappMessage: string;
  
  // About section
  aboutHeadline: string;
  aboutStory: string[];
  nativeLanguage: string;
  foreignLanguage: string;
  interests: string[];
  
  // SEO
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string[];
  googleSiteVerification?: string;
  
  // Google Sheets Integration
  googleSheetWebhookUrl?: string;
  googleSheetSyncEnabled: boolean;
  
  // Admin password hash (SHA-256 of @@MahimsdotcomAdmin11223300@@ with salt)
  adminPasswordHash: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  date: string;
  status: 'unread' | 'read';
}
