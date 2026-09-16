import { ThoughtPost, THOUGHT_POSTS, DEFAULT_THOUGHT_TOPICS } from '../data/thoughtPosts';

const STORAGE_KEY = 'mahim_thought_posts_v1';
const LIKES_KEY = 'mahim_thought_liked_ids';
const TOPICS_KEY = 'mahim_thought_saved_topics_v1';

/**
 * Persists thoughts directly to the project's src/data/thoughtPosts.ts file on disk
 * so that when you push to GitHub from AI Studio, the changes are automatically included!
 */
async function syncThoughtsToFileSystem(posts: ThoughtPost[]) {
  if (typeof window === 'undefined') return;
  try {
    const code = generateThoughtPostsCode(posts);
    await fetch('/api/save-thoughts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fileContent: code }),
    });
  } catch {
    // Non-blocking in production / offline
  }
}

export function generateThoughtPostsCode(posts: ThoughtPost[]): string {
  const json = JSON.stringify(posts, null, 2);
  return `export interface ThoughtPost {
  id: string;
  slug: string;
  title: string;
  topic: string;
  coverImage?: string;
  excerpt: string;
  content: string;
  date: string;
  readTime: string;
  author: string;
  tags?: string[];
  status: 'published' | 'draft';
  featured?: boolean;
  views?: number;
  likes?: number;
  createdAt: string;
  updatedAt?: string;
}

export const DEFAULT_THOUGHT_TOPICS: string[] = [];

/**
 * All thought posts authored by Mahim from the Admin Panel will be saved here automatically.
 */
export const THOUGHT_POSTS: ThoughtPost[] = ${json};
`;
}

export function getThoughtPosts(includeDrafts = false): ThoughtPost[] {
  if (typeof window === 'undefined') {
    return includeDrafts ? THOUGHT_POSTS : THOUGHT_POSTS.filter((p) => p.status === 'published');
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    let list: ThoughtPost[] = [];

    if (raw) {
      list = JSON.parse(raw);
    } else {
      list = [...THOUGHT_POSTS];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    }

    if (!includeDrafts) {
      list = list.filter((p) => p.status === 'published');
    }

    // Sort newest first
    return list.sort((a, b) => new Date(b.createdAt || b.date).getTime() - new Date(a.createdAt || a.date).getTime());
  } catch (err) {
    console.error('Failed to load thought posts:', err);
    return [];
  }
}

export const getStoredThoughtPosts = (includeDrafts = true) => getThoughtPosts(includeDrafts);

export function getThoughtPostBySlug(slug: string): ThoughtPost | null {
  if (!slug) return null;
  const cleanSlug = slug.toLowerCase().trim();
  const all = getThoughtPosts(true);
  return all.find((p) => p.slug.toLowerCase().trim() === cleanSlug) || null;
}

export function generateThoughtSlug(title: string): string {
  if (!title) return `thought-${Date.now()}`;
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s\u0980-\u09FF-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .substring(0, 80);
}

export function getSavedCustomTopics(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(TOPICS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveThoughtTopic(topicName: string): void {
  if (!topicName || !topicName.trim() || typeof window === 'undefined') return;
  const clean = topicName.trim();
  const current = getSavedCustomTopics();
  if (!current.includes(clean)) {
    const updated = [...current, clean];
    try {
      localStorage.setItem(TOPICS_KEY, JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent('mahim:thought-topics-updated'));
    } catch (e) {
      console.error('Failed to save topic:', e);
    }
  }
}

export function getAllThoughtTopics(): string[] {
  const topicsSet = new Set<string>();
  
  // 1. Saved topics from user inputs
  getSavedCustomTopics().forEach((t) => {
    if (t && t.trim()) topicsSet.add(t.trim());
  });

  // 2. Any topics currently used in posts
  const posts = getThoughtPosts(true);
  posts.forEach((p) => {
    if (p.topic && p.topic.trim()) topicsSet.add(p.topic.trim());
  });

  return Array.from(topicsSet);
}

export function saveThoughtPost(post: ThoughtPost): void {
  // Automatically remember the topic once used
  if (post.topic && post.topic.trim()) {
    saveThoughtTopic(post.topic.trim());
  }

  const all = getThoughtPosts(true);
  const existingIdx = all.findIndex((p) => p.id === post.id);

  let updatedList: ThoughtPost[];
  if (existingIdx >= 0) {
    updatedList = [...all];
    updatedList[existingIdx] = {
      ...post,
      updatedAt: new Date().toISOString(),
    };
  } else {
    updatedList = [
      {
        ...post,
        createdAt: post.createdAt || new Date().toISOString(),
      },
      ...all,
    ];
  }

  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList));
    // Trigger sync to disk
    syncThoughtsToFileSystem(updatedList);
    // Dispatch custom event for reactive UI updates
    window.dispatchEvent(new CustomEvent('mahim:thoughts-updated'));
  }
}

export function deleteThoughtPost(id: string): void {
  const all = getThoughtPosts(true);
  const updatedList = all.filter((p) => p.id !== id);

  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList));
    syncThoughtsToFileSystem(updatedList);
    window.dispatchEvent(new CustomEvent('mahim:thoughts-updated'));
  }
}

export function toggleThoughtLike(id: string): { liked: boolean; count: number } {
  if (typeof window === 'undefined') return { liked: false, count: 0 };

  try {
    const rawLiked = localStorage.getItem(LIKES_KEY);
    const likedSet = new Set<string>(rawLiked ? JSON.parse(rawLiked) : []);
    const isLiked = likedSet.has(id);

    const all = getThoughtPosts(true);
    const post = all.find((p) => p.id === id);
    const currentLikes = post?.likes || 0;

    let newCount = currentLikes;
    if (isLiked) {
      likedSet.delete(id);
      newCount = Math.max(0, currentLikes - 1);
    } else {
      likedSet.add(id);
      newCount = currentLikes + 1;
    }

    localStorage.setItem(LIKES_KEY, JSON.stringify(Array.from(likedSet)));

    if (post) {
      post.likes = newCount;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
      window.dispatchEvent(new CustomEvent('mahim:thoughts-updated'));
    }

    return { liked: !isLiked, count: newCount };
  } catch {
    return { liked: false, count: 0 };
  }
}

export function isThoughtLiked(id: string): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const raw = localStorage.getItem(LIKES_KEY);
    const set = new Set<string>(raw ? JSON.parse(raw) : []);
    return set.has(id);
  } catch {
    return false;
  }
}
