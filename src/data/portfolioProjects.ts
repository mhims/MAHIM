export interface PortfolioProject {
  id: string;
  title: string;
  category: 'web' | 'automation' | 'graphics' | 'branding' | 'other';
  categoryLabel: string;
  description: string;
  image: string;
  tags: string[];
  liveUrl?: string;
  githubUrl?: string;
  featured?: boolean;
}

export const INITIAL_PORTFOLIO_PROJECTS: PortfolioProject[] = [
  {
    id: 'proj-1',
    title: "Mahim's World & Classroom Platform",
    category: 'web',
    categoryLabel: 'ফুল-স্ট্যাক ওয়েব ও প্ল্যাটফর্ম',
    description: 'এইচএসসি, এডমিশন ও ব্যক্তিগত ডিজিটাল ইকোসিস্টেম। ইন্টারেক্টিভ কোর্স ভিউ, টেস্ট ইঞ্জিন, ডায়নামিক ব্লগ ও সিকিউর এডমিন হাব।',
    image: 'https://res.cloudinary.com/drvyjj7td/image/upload/v1789445668/MAHIMSCLASSROOM_idmxpd.png',
    tags: ['React', 'TypeScript', 'Tailwind CSS', 'Google Apps Script'],
    liveUrl: 'https://mahims.com',
    featured: true,
  },
  {
    id: 'proj-2',
    title: 'অটোমেটেড গুগল শিট ও ক্লাসরুম লিড সিঙ্ক ইঞ্জিন',
    category: 'automation',
    categoryLabel: 'অটোমেশন ও এপিআই ইন্টিগ্রেশন',
    description: 'n8n ও Google Apps Script এর মাধ্যমে রেজিস্ট্রেশন, ডাটাবেজ ব্যাকআপ ও নোটিফিকেশন সিস্টেম স্বয়ংক্রিয়করণ।',
    image: 'https://res.cloudinary.com/drvyjj7td/image/upload/v1789573641/portfoliohomepage_ouzrea.jpg',
    tags: ['n8n', 'Google Apps Script', 'Webhooks', 'Spreadsheet API'],
    liveUrl: 'https://mahims.com/classroom',
    featured: true,
  },
  {
    id: 'proj-3',
    title: 'ব্র্যান্ড আইডেন্টিটি ও ডিজিটাল ডিজাইন সিস্টেম',
    category: 'graphics',
    categoryLabel: 'গ্রাফিক ডিজাইন ও ব্র্যান্ডিং',
    description: 'ইউটিউব থাম্বনেইল, ফেসবুক পোস্টার, ব্র্যান্ড ক্যাটালগ ও সোশ্যাল মিডিয়া কিটস তৈরি।',
    image: 'https://res.cloudinary.com/drvyjj7td/image/upload/v1788708908/behance_pp_spfumh.jpg',
    tags: ['Photoshop', 'Illustrator', 'Figma', 'Visual Identity'],
    liveUrl: 'https://behance.net/mahimibnekhudi',
    featured: true,
  },
];

export function getStoredPortfolioProjects(): PortfolioProject[] {
  if (typeof window === 'undefined') return INITIAL_PORTFOLIO_PROJECTS;
  try {
    const raw = localStorage.getItem('mahims_portfolio_projects_v1');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {
    // ignore
  }
  return INITIAL_PORTFOLIO_PROJECTS;
}

export async function saveStoredPortfolioProjects(projects: PortfolioProject[]): Promise<boolean> {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('mahims_portfolio_projects_v1', JSON.stringify(projects));
    } catch {
      // ignore
    }
  }

  try {
    const fileContent = `import { PortfolioProject } from './portfolioProjects';

export const INITIAL_PORTFOLIO_PROJECTS: PortfolioProject[] = ${JSON.stringify(projects, null, 2)};
`;
    await fetch('/api/save-portfolio', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fileContent }),
    });
    return true;
  } catch {
    return false;
  }
}
