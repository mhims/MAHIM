export interface HomeTopSlide {
  id: string;
  image: string;
  link: string;
  path: string;
  title: string;
}

export const INITIAL_TOP_SLIDES: HomeTopSlide[] = [
  {
    id: 'classroom',
    image: 'https://res.cloudinary.com/drvyjj7td/image/upload/v1789445668/MAHIMSCLASSROOM_idmxpd.png',
    link: 'https://mahims.com/classroom',
    path: '/classroom',
    title: "Mahim's Classroom (মাহিম'স ক্লাসরুম)",
  },
  {
    id: 'portfolio',
    image: 'https://res.cloudinary.com/drvyjj7td/image/upload/v1789573641/portfoliohomepage_ouzrea.jpg',
    link: 'https://mahims.com/portfolio',
    path: '/portfolio',
    title: "Mahim's Portfolio (মাহিম'স পোর্টফোলিও)",
  },
  {
    id: 'chithi',
    image: 'https://res.cloudinary.com/drvyjj7td/image/upload/v1789445680/MAHIM_CHITHI_xxkl9p.png',
    link: 'https://mahims.com/chithi',
    path: '/chithi',
    title: "Mahim's Chithi (চিঠি ও ভাবনা)",
  },
  {
    id: 'thoughts',
    image: 'https://res.cloudinary.com/drvyjj7td/image/upload/v1789574512/think-with-mahim_yku7br.jpg',
    link: 'https://mahims.com/thoughts',
    path: '/thoughts',
    title: 'Think With Mahim (থিঙ্ক উইথ মাহিম)',
  },
];

export function getStoredTopSlides(): HomeTopSlide[] {
  if (typeof window === 'undefined') return INITIAL_TOP_SLIDES;
  try {
    const raw = localStorage.getItem('mahims_top_slides_v1');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {
    // ignore
  }
  return INITIAL_TOP_SLIDES;
}

export async function saveStoredTopSlides(slides: HomeTopSlide[]): Promise<boolean> {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('mahims_top_slides_v1', JSON.stringify(slides));
    } catch {
      // ignore
    }
  }

  try {
    const fileContent = `export interface HomeTopSlide {
  id: string;
  image: string;
  link: string;
  path: string;
  title: string;
}

export const INITIAL_TOP_SLIDES: HomeTopSlide[] = ${JSON.stringify(slides, null, 2)};
`;
    await fetch('/api/save-top-slides', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fileContent }),
    });
    return true;
  } catch {
    return false;
  }
}
