
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
}

export interface BlogPost {
  title: string;
  excerpt: string;
  category: string;
  image: string;
  readTime: string;
}
