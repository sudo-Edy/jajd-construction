// Typed wrapper around the shared ESM data module so the React app and the
// Node build script (scripts/generate-blog.mjs) read the SAME blog content.
// @ts-ignore - plain ESM data module, resolved by Vite at build time
import { POSTS as RAW, BLOG_CATEGORIES as CATS } from './posts.mjs';
import type { JournalPost } from '../types';

export const POSTS = RAW as JournalPost[];
export const BLOG_CATEGORIES = CATS as string[];

/** Most recent posts first, limited to `n`. */
export const recentPosts = (n = 3): JournalPost[] =>
  [...POSTS].sort((a, b) => (a.date < b.date ? 1 : -1)).slice(0, n);
