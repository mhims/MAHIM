import { ClassroomBlogPost, DEFAULT_CLASSROOM_BLOGS, DEFAULT_CLASSROOM_BLOG_TOPICS } from '../data/classroomBlogs';

const STORAGE_KEY = 'mahim_classroom_blogs_v3';
const OLD_STORAGE_KEYS = [
  'mahim_classroom_blogs_v2',
  'mahim_classroom_blogs_v1',
  'mahim_classroom_blogs',
  'classroom_blogs',
  'classroom_articles',
];
const LIKES_STORAGE_KEY = 'mahim_classroom_blog_liked_ids';

// Purge legacy storage immediately upon module load to ensure no stale sample articles remain
if (typeof window !== 'undefined') {
  try {
    OLD_STORAGE_KEYS.forEach((key) => localStorage.removeItem(key));
  } catch {}
}

/**
 * Persists blogs directly to the project's src/data/classroomBlogs.ts file on disk
 * so that when you push to GitHub from AI Studio, the changes are automatically included!
 */
async function syncToFileSystem(blogs: ClassroomBlogPost[]) {
  if (typeof window === 'undefined') return;
  try {
    const code = generateClassroomBlogsGitHubCode(blogs);
    await fetch('/api/save-blogs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fileContent: code }),
    });
  } catch {
    // Non-blocking in production or offline
  }
}

export function getClassroomBlogs(includeDrafts = false): ClassroomBlogPost[] {
  if (typeof window === 'undefined') {
    return includeDrafts ? DEFAULT_CLASSROOM_BLOGS : DEFAULT_CLASSROOM_BLOGS.filter((b) => b.status === 'published');
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    let list: ClassroomBlogPost[] = [];

    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          list = parsed;
        }
      } catch {
        list = [];
      }
    } else {
      // Start with completely empty list — no sample articles
      list = [...DEFAULT_CLASSROOM_BLOGS];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    }

    if (!includeDrafts) {
      list = list.filter((item) => item.status === 'published');
    }

    // Sort newest first
    return list.sort((a, b) => new Date(b.createdAt || b.date).getTime() - new Date(a.createdAt || a.date).getTime());
  } catch (err) {
    console.error('Failed to load classroom blogs:', err);
    return [];
  }
}

export function getClassroomBlogBySlug(slug: string): ClassroomBlogPost | null {
  if (!slug) return null;
  const cleanSlug = slug.toLowerCase().trim();
  const allPosts = getClassroomBlogs(true);
  return allPosts.find((p) => p.slug.toLowerCase().trim() === cleanSlug) || null;
}

export function generateSlugFromTitle(title: string): string {
  if (!title) return `post-${Date.now()}`;
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s\u0980-\u09FF-]/g, '') // keep bangla, english, numbers and hyphen
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .substring(0, 80);
}

export function getAllBlogTopics(): string[] {
  const blogs = getClassroomBlogs(true);
  const topicsSet = new Set<string>(DEFAULT_CLASSROOM_BLOG_TOPICS);
  blogs.forEach((b) => {
    if (b.topic && b.topic.trim()) topicsSet.add(b.topic.trim());
    if (b.category && b.category.trim()) topicsSet.add(b.category.trim());
  });
  return Array.from(topicsSet);
}

export function saveClassroomBlog(data: Partial<ClassroomBlogPost>): ClassroomBlogPost {
  const blogs = getClassroomBlogs(true);
  const nowIso = new Date().toISOString();

  // Format Bangla/English human readable date if not provided
  const humanDate =
    data.date ||
    new Date().toLocaleDateString('bn-BD', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });

  // Calculate read time approx based on word count
  let readTime = data.readTime?.trim();
  if (!readTime && data.content) {
    const wordCount = data.content.trim().split(/\s+/).length;
    const minutes = Math.max(1, Math.ceil(wordCount / 180));
    readTime = `${minutes} মিনিট পাঠ`;
  }

  let finalSlug = data.slug ? data.slug.trim().toLowerCase().replace(/^\/+|\/+$/g, '') : '';
  if (!finalSlug) {
    finalSlug = generateSlugFromTitle(data.title || `blog-${Date.now()}`);
  }

  // Check if editing existing
  if (data.id) {
    const existingIndex = blogs.findIndex((b) => b.id === data.id);
    if (existingIndex >= 0) {
      const existing = blogs[existingIndex];
      const updated: ClassroomBlogPost = {
        ...existing,
        ...data,
        id: existing.id,
        slug: finalSlug,
        title: data.title?.trim() || existing.title,
        topic: data.topic?.trim() || existing.topic || 'এডমিশন গাইডলাইন',
        category: data.topic?.trim() || existing.category || 'এডমিশন গাইডলাইন',
        author: data.author?.trim() || existing.author || 'মাহিম ইবনে খুদি',
        authorRole: data.authorRole?.trim() || existing.authorRole || "ফাউন্ডার ও মেন্টর, মাহিম'স ক্লাসরুম",
        readTime: readTime || existing.readTime || '৩ মিনিট পাঠ',
        coverImage:
          data.coverImage?.trim() ||
          existing.coverImage ||
          'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1200&auto=format&fit=crop',
        excerpt: data.excerpt?.trim() || existing.excerpt || '',
        content: data.content || existing.content || '',
        tags: data.tags && data.tags.length ? data.tags : existing.tags,
        seoKeywords: data.seoKeywords?.trim() || existing.seoKeywords || '',
        status: data.status || existing.status || 'published',
        featured: data.featured !== undefined ? data.featured : existing.featured,
        updatedAt: nowIso,
      };

      blogs[existingIndex] = updated;
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(blogs));
        syncToFileSystem(blogs);
        window.dispatchEvent(new CustomEvent('classroom:blog_updated', { detail: { blog: updated } }));
      }
      return updated;
    }
  }

  // Create new post
  // Ensure unique slug
  let uniqueSlug = finalSlug;
  let counter = 1;
  while (blogs.some((b) => b.slug === uniqueSlug)) {
    uniqueSlug = `${finalSlug}-${counter}`;
    counter++;
  }

  const newPost: ClassroomBlogPost = {
    id: `cblog_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    slug: uniqueSlug,
    title: data.title?.trim() || 'শিরোনামহীন আর্টিকেল',
    topic: data.topic?.trim() || 'এডমিশন গাইডলাইন',
    category: data.topic?.trim() || 'এডমিশন গাইডলাইন',
    author: data.author?.trim() || 'মাহিম ইবনে খুদি',
    authorRole: data.authorRole?.trim() || "ফাউন্ডার ও মেন্টর, মাহিম'স ক্লাসরুম",
    authorAvatar:
      data.authorAvatar || 'https://res.cloudinary.com/drvyjj7td/image/upload/v1789388129/mahimmentor_lqt0tg.png',
    date: humanDate,
    readTime: readTime || '৪ মিনিট পাঠ',
    coverImage:
      data.coverImage?.trim() ||
      'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=1200&auto=format&fit=crop',
    excerpt: data.excerpt?.trim() || '',
    content: data.content || '',
    tags: data.tags || ['এডমিশন', 'মাহিম ক্লাসরুম'],
    seoKeywords: data.seoKeywords?.trim() || '',
    status: data.status || 'published',
    featured: !!data.featured,
    views: 1,
    likes: 0,
    createdAt: nowIso,
    updatedAt: nowIso,
  };

  blogs.unshift(newPost);
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(blogs));
    syncToFileSystem(blogs);
    window.dispatchEvent(new CustomEvent('classroom:blog_updated', { detail: { blog: newPost } }));
  }
  return newPost;
}

export function deleteClassroomBlog(id: string): void {
  if (typeof window === 'undefined') return;
  try {
    const blogs = getClassroomBlogs(true);
    const filtered = blogs.filter((b) => b.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    syncToFileSystem(filtered);
    window.dispatchEvent(new CustomEvent('classroom:blog_updated', { detail: { deletedId: id } }));
  } catch (err) {
    console.error('Failed to delete blog:', err);
  }
}

export function clearAllClassroomBlogs(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
    OLD_STORAGE_KEYS.forEach((key) => localStorage.removeItem(key));
    syncToFileSystem([]);
    window.dispatchEvent(new CustomEvent('classroom:blog_updated', { detail: { cleared: true } }));
  } catch (err) {
    console.error('Failed to clear blogs:', err);
  }
}

export function incrementClassroomBlogView(slug: string): void {
  if (typeof window === 'undefined') return;
  try {
    const blogs = getClassroomBlogs(true);
    const post = blogs.find((b) => b.slug.toLowerCase() === slug.toLowerCase());
    if (post) {
      post.views = (post.views || 0) + 1;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(blogs));
    }
  } catch {
    // ignore
  }
}

export function toggleClassroomBlogLike(slug: string): { liked: boolean; likes: number } {
  if (typeof window === 'undefined') return { liked: false, likes: 0 };
  try {
    const blogs = getClassroomBlogs(true);
    const post = blogs.find((b) => b.slug.toLowerCase() === slug.toLowerCase());
    if (!post) return { liked: false, likes: 0 };

    const likedIdsRaw = localStorage.getItem(LIKES_STORAGE_KEY);
    const likedIds: string[] = likedIdsRaw ? JSON.parse(likedIdsRaw) : [];
    const isLiked = likedIds.includes(post.id);

    if (isLiked) {
      post.likes = Math.max(0, (post.likes || 1) - 1);
      const nextLikedIds = likedIds.filter((id) => id !== post.id);
      localStorage.setItem(LIKES_STORAGE_KEY, JSON.stringify(nextLikedIds));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(blogs));
      return { liked: false, likes: post.likes };
    } else {
      post.likes = (post.likes || 0) + 1;
      likedIds.push(post.id);
      localStorage.setItem(LIKES_STORAGE_KEY, JSON.stringify(likedIds));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(blogs));
      return { liked: true, likes: post.likes };
    }
  } catch {
    return { liked: false, likes: 0 };
  }
}

export function isClassroomBlogLiked(postId: string): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const likedIdsRaw = localStorage.getItem(LIKES_STORAGE_KEY);
    if (!likedIdsRaw) return false;
    const likedIds: string[] = JSON.parse(likedIdsRaw);
    return likedIds.includes(postId);
  } catch {
    return false;
  }
}

/**
 * Generates clean TypeScript code for src/data/classroomBlogs.ts
 */
export function generateClassroomBlogsGitHubCode(customBlogs?: ClassroomBlogPost[]): string {
  const blogs = customBlogs || getClassroomBlogs(true);
  const topics = getAllBlogTopics();

  return `export interface ClassroomBlogPost {
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
  content: string;
  tags: string[];
  seoKeywords: string;
  status: 'published' | 'draft';
  featured?: boolean;
  views?: number;
  likes?: number;
  createdAt: string;
  updatedAt?: string;
}

export const DEFAULT_CLASSROOM_BLOG_TOPICS = ${JSON.stringify(topics, null, 2)};

export const DEFAULT_CLASSROOM_BLOGS: ClassroomBlogPost[] = ${JSON.stringify(blogs, null, 2)};
`;
}
