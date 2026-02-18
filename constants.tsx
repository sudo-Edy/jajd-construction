
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
    icon: <ClipboardCheck />,
    title: "Request a Free Estimate",
    description: "Start with a detailed project request. We gather initial requirements to ensure the right experts are assigned."
  },
  {
    icon: <UserCheck />,
    title: "On-Site Consultation",
    description: "A master contractor visits your site to perform a professional assessment and discuss design goals."
  },
  {
    icon: <Construction />,
    title: "Detailed Project Plan",
    description: "We provide a comprehensive scope of work, transparent pricing, and a realistic timeline for your build."
  },
  {
    icon: <Hammer />,
    title: "Professional Execution",
    description: "Our certified crews manage the build with precision, keeping you updated at every major milestone."
  }
];

export const SERVICES = [
  {
    title: "Interior Painting & Remodels",
    description: "More than just paint. We handle drywall repair, trim removal, and small interior renovations for a complete refresh.",
    image: "https://images.unsplash.com/photo-1562663474-6cbb3eaa4d14?auto=format&fit=crop&q=80&w=800"
  },
  {
    title: "Exterior Painting & Siding",
    description: "Complete exterior protection. We specialize in exterior painting and siding repairs (Vinyl, Wood, Hardie Board).",
    image: "/exterior-siding.jpg"
  },
  {
    title: "Roofing Systems",
    description: "Expert roof inspections, repairs, and full replacements. We ensure your home is watertight and durable.",
    image: "https://images.unsplash.com/photo-1632759145351-1d592919f522?auto=format&fit=crop&q=80&w=800"
  },
  {
    title: "Cabinet Refinishing",
    description: "Transform your kitchen without the cost of replacement. Factory-finish quality using specialized coatings.",
    image: "https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?auto=format&fit=crop&q=80&w=800"
  },
  {
    title: "Commercial Services",
    description: "Scalable maintenance solutions. We handle painting, roofing, and build-outs for offices and retail spaces.",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800"
  },
  {
    title: "Decks & Power Washing",
    description: "Restore your outdoor living spaces. Deep cleaning, staining, and wood repairs for decks and fences.",
    image: "https://images.unsplash.com/photo-1520089851-f76db36d0bc6?auto=format&fit=crop&q=80&w=800"
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
  { 
    id: 1, 
    name: "Ray Anderson", 
    role: "Door Refinishing", 
    content: "Extremely responsive, great quality and very professional. We had 2 oak doors that needed to be sanded and re-stained. Excellent results! Highly recommend. Thank you JAJD team.", 
    rating: 5, 
    platform: 'google' 
  },
  { 
    id: 2, 
    name: "Richard L.", 
    role: "Whole Home Painting", 
    content: "JAJD exceeded my expectations by a mile. From the first meeting before receiving a very detailed estimate until the final day of work they were EXCELLENT!", 
    rating: 5, 
    platform: 'bbb' 
  },
  { 
    id: 3, 
    name: "Zachary Zach", 
    role: "Exterior Painting", 
    content: "Company is responsive, dependable and very easy to work with. Will HIGHLY recommend to any family/friends looking for painters.", 
    rating: 5, 
    platform: 'google' 
  },
  { 
    id: 4, 
    name: "Deanna M.", 
    role: "Interior Painting", 
    content: "JAJD painted my house and did a fantastic job! I would hire them again in a heartbeat!", 
    rating: 5, 
    platform: 'bbb' 
  },
  { 
    id: 5, 
    name: "Denise U.", 
    role: "Repeat Customer", 
    content: "This is the second time I have used JAJD Painting. The first time was February 2023. As before, they did an amazing job.", 
    rating: 5, 
    platform: 'bbb' 
  }
];

export const MOCK_BRANCHES = [
  { zipPrefix: "10", area: "Manhattan & Greater NY", expert: "Contractor Julian" },
  { zipPrefix: "90", area: "Los Angeles Central", expert: "Contractor Sarah" },
  { zipPrefix: "60", area: "Chicago Metropolitan", expert: "Contractor Michael" },
  { zipPrefix: "33", area: "Miami Coastal", expert: "Contractor Elena" },
];
