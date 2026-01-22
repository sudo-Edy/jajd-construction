import React from 'react';
import { 
  ClipboardCheck, 
  Construction, 
  Droplets, 
  UserCheck,
  ShieldCheck,
  Building2,
  Home,
  CheckCircle2,
  Clock,
  Hammer,
  HardHat
} from 'lucide-react';
import { ProcessStep, Testimonial, ServiceCardProps, BlogPost } from '../types';

export const PROCESS_STEPS: ProcessStep[] = [
  {
    icon: React.createElement(ClipboardCheck, { className: "w-8 h-8 text-[#FACC15]" }),
    title: "Request an Estimate",
    description: "Start with a detailed project request. We gather initial requirements to ensure the right experts are assigned."
  },
  {
    icon: React.createElement(UserCheck, { className: "w-8 h-8 text-[#FACC15]" }),
    title: "On-Site Consultation",
    description: "A master contractor visits your site to perform a professional assessment and discuss design goals."
  },
  {
    icon: React.createElement(Construction, { className: "w-8 h-8 text-[#FACC15]" }),
    title: "Project Blueprint",
    description: "We provide a comprehensive scope of work, transparent pricing, and a realistic timeline for your build."
  },
  {
    icon: React.createElement(Hammer, { className: "w-8 h-8 text-[#FACC15]" }),
    title: "Master Execution",
    description: "Our certified crews manage the build with precision, keeping you updated at every major milestone."
  }
];

export const SERVICES: ServiceCardProps[] = [
  {
    title: "Residential Remodeling",
    description: "High-end home transformations, from custom kitchen renovations to full structural additions.",
    image: "https://images.unsplash.com/photo-1503387762-592dea58ed23?auto=format&fit=crop&q=80&w=1200",
    features: ["Kitchen & Bath", "Full Home Renovation", "Structural Additions", "Custom Finish Work"]
  },
  {
    title: "Commercial Fit-Outs",
    description: "Professional construction for retail, office, and hospitality with efficient management.",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1200",
    features: ["Office Renovations", "Retail Build-outs", "Tenant Improvements", "Facility Maintenance"]
  },
  {
    title: "Specialty Contracting",
    description: "Expert roofing, industrial flooring, and technical exterior improvements for all properties.",
    image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=1200",
    features: ["Roofing & Siding", "High-End Flooring", "Masonry & Facades", "Deck Engineering"]
  }
];

export const TESTIMONIALS: Testimonial[] = [
  { id: 1, name: "Jordan Smith", role: "Residential Client", content: "JAJD Construction transformed our home. Meticulous preparation and a truly masterful build quality.", rating: 5 },
  { id: 2, name: "Sarah Lee", role: "Property Manager", content: "Reliable commercial service. They handled our office expansion without any disruption to our staff.", rating: 5 },
  { id: 3, name: "Michael Ross", role: "Business Owner", content: "Best contractors I've ever hired. The attention to detail and communication was exceptional.", rating: 5 }
];

export const BLOG_POSTS: BlogPost[] = [
  {
    title: "2024 Construction Trends",
    excerpt: "Discover the sustainable materials and smart technologies defining modern building.",
    category: "Trends",
    image: "https://images.unsplash.com/photo-1503387762-592dea58ed23?auto=format&fit=crop&q=80&w=800",
    readTime: "5 min read"
  },
  {
    title: "Planning Your Remodel",
    excerpt: "A guide to budgeting and timelines for major residential renovations.",
    category: "Advice",
    image: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&q=80&w=800",
    readTime: "6 min read"
  }
];