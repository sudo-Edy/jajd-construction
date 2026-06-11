
import React from 'react';

export interface ServiceCardProps {
  title: string;
  description: string;
  image: string;
  features: string[];
}

export interface ProcessStep {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export interface Testimonial {
  id: number;
  name: string;
  role: string;
  content: string;
  rating: number;
  platform?: 'google' | 'thumbtack' | 'bbb';
  /** Language the review is written in. Spanish reviews render with an "en español" tag. */
  lang?: 'en' | 'es';
}

export interface BlogPost {
  title: string;
  excerpt: string;
  category: string;
  image: string;
  readTime: string;
}

/** A journal/blog article — shared with the static-page generator (blog/posts.mjs). */
export interface JournalPost {
  slug: string;
  title: string;
  description: string;
  keywords: string[];
  category: string;
  date: string;
  updated?: string;
  readMins: number;
  image: string;
  imageAlt: string;
  excerpt: string;
  blocks: unknown[];
}

export interface ProjectImage {
  id: string;
  project_id: string;
  image_url: string;
  display_order: number;
  caption?: string;
  created_at?: string;
}

export type ProjectCategory = 'residential' | 'commercial' | 'renovation' | 'new_construction';
export type ProjectStatus = 'completed' | 'in_progress' | 'upcoming';

export interface Project {
  id: string;
  title: string;
  location: string;
  description: string;
  details?: string;
  completion_date?: string;
  thumbnail_url: string;
  display_order: number;
  is_published: boolean;
  category?: ProjectCategory;
  status?: ProjectStatus;
  is_featured?: boolean;
  seo_title?: string;
  seo_description?: string;
  images?: ProjectImage[];
  created_at: string;
  updated_at: string;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  image_url: string;
  display_order: number;
  created_at?: string;
}

/** The project values the quote form understands (step 2 "Service Needed"). */
export type QuoteProjectType =
  | 'Interior Paint'
  | 'Exterior Paint'
  | 'Siding'
  | 'Roofing'
  | 'Cabinets'
  | 'Commercial'
  | 'Remodel'
  | 'Other';

export type PopularProjectCategory =
  | 'painting'
  | 'exterior'
  | 'roofing'
  | 'cabinets'
  | 'outdoor'
  | 'commercial';

export type EstimateQuestionType = 'single' | 'multi' | 'number' | 'text';

/** Maps an answer onto a structured lead field instead of just the notes blob. */
export type EstimateQuestionRole = 'service' | 'size' | 'budget';

export interface EstimateQuestion {
  id: string;
  label: string;
  type: EstimateQuestionType;
  options?: string[];
  required?: boolean;
  placeholder?: string;
  hint?: string;
  role?: EstimateQuestionRole;
}

/** A project-specific set of estimate questions (Angi/Thumbtack-style). */
export interface EstimateFlow {
  /** Falls back into the lead's `project` field. */
  service: QuoteProjectType | string;
  headline: string;
  blurb: string;
  questions: EstimateQuestion[];
}

/** A specific, bookable project shown in the "Popular projects" browser. */
export interface PopularProject {
  name: string;
  category: PopularProjectCategory;
  /** Which quote-form service this project pre-selects. */
  quoteType: QuoteProjectType;
  /** Human-readable typical range, e.g. "$400 – $1,200", "Free inspection". */
  priceRange: string;
  image: string;
  /** Lowercase search terms for the to-do list autocomplete. */
  keywords: string[];
  /** Shows the "Popular" badge on the card. */
  popular?: boolean;
}
