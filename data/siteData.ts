import React from 'react';
import { 
  ClipboardCheck, 
  Construction, 
  Hammer, 
  UserCheck 
} from 'lucide-react';
import { ProcessStep, Testimonial, ServiceCardProps, BlogPost } from '../types';

export const PROCESS_STEPS: ProcessStep[] = [
  {
    icon: React.createElement(ClipboardCheck, { className: "w-8 h-8 text-[#FACC15]" }),
    title: "Request a Free Estimate",
    description: "Start with a detailed project request. We gather initial requirements to ensure the right experts are assigned."
  },
  {
    icon: React.createElement(UserCheck, { className: "w-8 h-8 text-[#FACC15]" }),
    title: "On-Site Consultation",
    description: "A master contractor visits your site to perform a professional assessment and discuss design goals."
  },
  {
    icon: React.createElement(Construction, { className: "w-8 h-8 text-[#FACC15]" }),
    title: "Detailed Project Plan",
    description: "We provide a comprehensive scope of work, transparent pricing, and a realistic timeline for your build."
  },
  {
    icon: React.createElement(Hammer, { className: "w-8 h-8 text-[#FACC15]" }),
    title: "Professional Execution",
    description: "Our certified crews manage the build with precision, keeping you updated at every major milestone."
  }
];

export const SERVICES: ServiceCardProps[] = [
  {
    title: "Residential Construction",
    description: "From custom new builds to full home remodeling and high-end interior renovations.",
    image: "https://images.unsplash.com/photo-1503387762-592dea58ed23?auto=format&fit=crop&q=80&w=800",
    features: ["Custom Home Building", "Kitchen & Bath Remodels", "Room Additions", "Structural Repairs"]
  },
  {
    title: "Commercial Services",
    description: "Professional office fit-outs, retail construction, and large-scale property maintenance.",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800",
    features: ["Office Renovations", "Retail Build-outs", "Tenant Improvements", "Facility Management"]
  },
  {
    title: "Specialty Contracting",
    description: "Expert roofing, flooring, and exterior improvements requiring technical precision.",
    image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=800",
    features: ["Roofing & Siding", "High-End Flooring", "Drywall & Finishing", "Deck Construction"]
  },
  {
    title: "Project Management",
    description: "Professional oversight of your construction site, ensuring deadlines are met and budgets are respected.",
    image: "https://images.unsplash.com/photo-1454165833767-027ffea9e7a7?auto=format&fit=crop&q=80&w=800",
    features: ["Site Supervision", "Budget Auditing", "Vendor Management", "Safety Compliance"]
  },
  {
    title: "Structural Engineering",
    description: "Advanced structural analysis and engineering solutions for complex residential and commercial buildings.",
    image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&q=80&w=800",
    features: ["Foundation Repair", "Steel Fabrication", "Load-Bearing Walls", "Seismic Retrofitting"]
  },
  {
    title: "Eco-Building Solutions",
    description: "Modernizing existing structures with solar panels, energy-efficient windows, and smart systems.",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800",
    features: ["Solar Installation", "Energy Audits", "Insulation Upgrades", "Smart Home Tech"]
  }
];

export const TESTIMONIALS: Testimonial[] = [
  { id: 1, name: "Jordan Smith", role: "Residential Homeowner", content: "JAJD Construction transformed our kitchen into a masterpiece. Professional and on-time.", rating: 5 },
  { id: 2, name: "Sarah Lee", role: "Property Manager", content: "Reliable commercial service for all our tenant improvements. Highly recommended.", rating: 5 },
  { id: 3, name: "Michael Ross", role: "Business Owner", content: "Excellent communication throughout the whole roofing project. Precision workmanship.", rating: 5 }
];

export const BLOG_POSTS: BlogPost[] = [
  {
    title: "How to Plan Your Next Major Construction Project",
    excerpt: "Avoid common pitfalls with our comprehensive guide to pre-construction planning.",
    category: "Planning",
    image: "https://images.unsplash.com/photo-1503387762-592dea58ed23?auto=format&fit=crop&q=80&w=400",
    readTime: "5 min read"
  },
  {
    title: "Residential vs Commercial Construction",
    excerpt: "Understanding the unique requirements, codes, and timelines for different property types.",
    category: "Education",
    image: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&q=80&w=400",
    readTime: "4 min read"
  },
  {
    title: "Future of Sustainable Building",
    excerpt: "Discover eco-friendly innovations transforming modern builds in 2024.",
    category: "Trends",
    image: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&q=80&w=400",
    readTime: "6 min read"
  }
];