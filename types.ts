
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
}

export interface BlogPost {
  title: string;
  excerpt: string;
  category: string;
  image: string;
  readTime: string;
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
