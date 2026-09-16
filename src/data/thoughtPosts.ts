export interface ThoughtPost {
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
 * Kept completely empty by default so only your own writings will be published.
 */
export const THOUGHT_POSTS: ThoughtPost[] = [];
