
import React from 'react';
import { 
  HardHat, 
  ClipboardCheck, 
  Construction, 
  ShieldCheck, 
  Hammer, 
  Building2, 
  Home, 
  CheckCircle2, 
  Clock, 
  UserCheck 
} from 'lucide-react';
import { ProcessStep, Testimonial, ServiceCardProps, BlogPost } from './types';

export const PROCESS_STEPS: ProcessStep[] = [
  {
    icon: <ClipboardCheck className="w-8 h-8 text-[#FACC15]" />,
    title: "Request a Free Estimate",
    description: "Start with a detailed project request. We gather initial requirements to ensure the right experts are assigned."
  },
  {
    icon: <UserCheck className="w-8 h-8 text-[#FACC15]" />,
    title: "On-Site Consultation",
    description: "A master contractor visits your site to perform a professional assessment and discuss design goals."
  },
  {
    icon: <Construction className="w-8 h-8 text-[#FACC15]" />,
    title: "Detailed Project Plan",
    description: "We provide a comprehensive scope of work, transparent pricing, and a realistic timeline for your build."
  },
  {
    icon: <Hammer className="w-8 h-8 text-[#FACC15]" />,
    title: "Professional Execution",
    description: "Our certified crews manage the build with precision, keeping you updated at every major milestone."
  }
];

export const SERVICES: ServiceCardProps[] = [
  {
    title: "Residential Construction",
    description: "From custom new builds to full home remodeling and high-end interior renovations.",
    image: "https://images.unsplash.com/photo-1503387762-592dea58ed23?auto=format&fit=crop&q=80&w=1200",
    features: ["Custom Home Building", "Kitchen & Bath Remodels", "Room Additions", "Structural Repairs"]
  },
  {
    title: "Commercial Services",
    description: "Professional office fit-outs, retail construction, and large-scale property maintenance.",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1200",
    features: ["Office Renovations", "Retail Build-outs", "Tenant Improvements", "Facility Management"]
  },
  {
    title: "Specialty Contracting",
    description: "Expert roofing, flooring, and exterior improvements requiring technical precision.",
    image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=1200",
    features: ["Roofing & Siding", "High-End Flooring", "Drywall & Finishing", "Deck Construction"]
  }
];

export const BLOG_POSTS: BlogPost[] = [
  {
    title: "How to Plan Your Next Major Construction Project",
    excerpt: "Avoid common pitfalls with our comprehensive guide to pre-construction planning and budgeting.",
    category: "Planning",
    image: "https://images.unsplash.com/photo-1503387762-592dea58ed23?auto=format&fit=crop&q=80&w=800",
    readTime: "5 min read"
  },
  {
    title: "Residential vs Commercial Construction: Key Differences",
    excerpt: "Understanding the unique requirements, codes, and timelines for different property types.",
    category: "Education",
    image: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&q=80&w=800",
    readTime: "4 min read"
  },
  {
    title: "The Future of Sustainable Building Materials in 2024",
    excerpt: "Discover the eco-friendly innovations transforming modern residential and commercial builds.",
    category: "Trends",
    image: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&q=80&w=800",
    readTime: "6 min read"
  }
];

export const TESTIMONIALS: Testimonial[] = [
  { id: 1, name: "Sample Client A", role: "Residential Homeowner", content: "JAJD Construction transformed our kitchen into a masterpiece. Their team was professional, on-time, and within budget.", rating: 5 },
  { id: 2, name: "Sample Client B", role: "Property Manager", content: "We use JAJD for all our commercial tenant improvements. Reliable service every single time.", rating: 5 },
  { id: 3, name: "Sample Client C", role: "Business Owner", content: "Excellent communication throughout the whole roofing project. I highly recommend their specialty crew.", rating: 5 }
];

export const MOCK_BRANCHES = [
  { zipPrefix: "10", area: "Manhattan & Greater NY", expert: "Contractor Julian" },
  { zipPrefix: "90", area: "Los Angeles Central", expert: "Contractor Sarah" },
  { zipPrefix: "60", area: "Chicago Metropolitan", expert: "Contractor Michael" },
  { zipPrefix: "33", area: "Miami Coastal", expert: "Contractor Elena" },
];
