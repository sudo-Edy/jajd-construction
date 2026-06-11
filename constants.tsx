
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
import { ProcessStep, Testimonial, ServiceCardProps, BlogPost, PopularProject, PopularProjectCategory, QuoteProjectType } from './types';

export const PROCESS_STEPS: ProcessStep[] = [
  {
    icon: <ClipboardCheck />,
    title: "Request a Free Estimate",
    description: "Tell us about your project in under a minute, whether it's painting, siding, roofing, or anything in between."
  },
  {
    icon: <UserCheck />,
    title: "We Visit Your Home",
    description: "We come out, look at the job in person, and answer your questions. No pressure and no upselling."
  },
  {
    icon: <Construction />,
    title: "Clear, Honest Quote",
    description: "You get a written scope of work with transparent pricing and a realistic timeline. The price we quote is the price you pay."
  },
  {
    icon: <Hammer />,
    title: "We Do the Work",
    description: "Our crew shows up on time, protects your property, keeps you updated, and cleans up when we're done."
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
    image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80&w=800"
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
    title: "Decks & Pressure Washing",
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

/* ------------------------------------------------------------------ */
/* Popular projects browser (Angi-style "popular projects near you")   */
/* Only trades we actually do: paint, siding, roofing, cabinets,       */
/* decks/outdoor, and commercial. No plumbing, no electrical.          */
/* ------------------------------------------------------------------ */

export const POPULAR_PROJECT_CATEGORIES: { key: PopularProjectCategory | 'all'; label: string }[] = [
  { key: 'all', label: 'All projects' },
  { key: 'painting', label: 'Interior & Paint' },
  { key: 'exterior', label: 'Exterior & Siding' },
  { key: 'roofing', label: 'Roofing' },
  { key: 'cabinets', label: 'Kitchen & Cabinets' },
  { key: 'outdoor', label: 'Decks & Outdoor' },
  { key: 'commercial', label: 'Commercial' },
];

export const POPULAR_PROJECTS: PopularProject[] = [
  {
    name: 'Whole-Home Interior Painting',
    category: 'painting',
    quoteType: 'Interior Paint',
    priceRange: '$3,500 – $9,000',
    image: 'https://images.unsplash.com/photo-1562663474-6cbb3eaa4d14?auto=format&fit=crop&q=80&w=600',
    keywords: ['paint', 'interior', 'walls', 'whole house', 'repaint', 'living room'],
    popular: true,
  },
  {
    name: 'Paint a Single Room',
    category: 'painting',
    quoteType: 'Interior Paint',
    priceRange: '$400 – $1,200',
    image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=600',
    keywords: ['paint', 'bedroom', 'room', 'accent wall', 'nursery', 'office'],
  },
  {
    name: 'Trim, Doors & Baseboards',
    category: 'painting',
    quoteType: 'Interior Paint',
    priceRange: '$500 – $1,500',
    image: 'https://images.unsplash.com/photo-1745665777586-09381ba528d6?auto=format&fit=crop&q=80&w=600',
    keywords: ['trim', 'baseboard', 'molding', 'door', 'crown'],
  },
  {
    name: 'Drywall Repair & Painting',
    category: 'painting',
    quoteType: 'Interior Paint',
    priceRange: '$250 – $900',
    image: 'https://images.unsplash.com/photo-1717281234297-3def5ae3eee1?auto=format&fit=crop&q=80&w=600',
    keywords: ['drywall', 'hole', 'patch', 'crack', 'texture', 'wall repair'],
  },
  {
    name: 'Popcorn Ceiling Removal',
    category: 'painting',
    quoteType: 'Interior Paint',
    priceRange: '$900 – $2,800',
    image: 'https://images.unsplash.com/photo-1718816281207-3b253cff549a?auto=format&fit=crop&q=80&w=600',
    keywords: ['popcorn', 'ceiling', 'texture', 'smooth ceiling'],
  },
  {
    name: 'Door Refinishing & Staining',
    category: 'painting',
    quoteType: 'Interior Paint',
    priceRange: '$300 – $900',
    image: 'https://images.unsplash.com/photo-1629999400001-5e666f0754d9?auto=format&fit=crop&q=80&w=600',
    keywords: ['door', 'stain', 'refinish', 'oak', 'front door', 'sand'],
  },
  {
    name: 'Exterior House Painting',
    category: 'exterior',
    quoteType: 'Exterior Paint',
    priceRange: '$3,000 – $7,500',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=600',
    keywords: ['exterior', 'house paint', 'curb appeal', 'outside', 'repaint'],
    popular: true,
  },
  {
    name: 'Siding Repair',
    category: 'exterior',
    quoteType: 'Siding',
    priceRange: '$500 – $2,500',
    image: 'https://images.unsplash.com/photo-1646355174587-4171531746f3?auto=format&fit=crop&q=80&w=600',
    keywords: ['siding', 'vinyl', 'wood', 'hardie', 'repair', 'panel', 'hail'],
  },
  {
    name: 'New Siding Installation',
    category: 'exterior',
    quoteType: 'Siding',
    priceRange: '$8,000 – $18,000',
    image: 'https://images.unsplash.com/photo-1598654797939-407635ee99b1?auto=format&fit=crop&q=80&w=600',
    keywords: ['siding', 'install', 'replace', 'vinyl', 'hardie board', 'fiber cement'],
    popular: true,
  },
  {
    name: 'Roof Replacement',
    category: 'roofing',
    quoteType: 'Roofing',
    priceRange: '$8,000 – $16,000',
    image: 'https://images.unsplash.com/photo-1635424709961-f3a150459ad4?auto=format&fit=crop&q=80&w=600',
    keywords: ['roof', 'shingles', 'replace', 'new roof', 'asphalt'],
    popular: true,
  },
  {
    name: 'Roof Repair',
    category: 'roofing',
    quoteType: 'Roofing',
    priceRange: '$400 – $1,800',
    image: 'https://images.unsplash.com/photo-1633759593085-1eaeb724fc88?auto=format&fit=crop&q=80&w=600',
    keywords: ['roof', 'leak', 'shingle', 'repair', 'flashing', 'missing shingles'],
  },
  {
    name: 'Storm & Hail Damage Check',
    category: 'roofing',
    quoteType: 'Roofing',
    priceRange: 'Free inspection',
    image: 'https://images.unsplash.com/photo-1500674425229-f692875b0ab7?auto=format&fit=crop&q=80&w=600',
    keywords: ['storm', 'hail', 'wind', 'insurance', 'damage', 'inspection'],
    popular: true,
  },
  {
    name: 'Cabinet Painting & Refinishing',
    category: 'cabinets',
    quoteType: 'Cabinets',
    priceRange: '$1,800 – $4,500',
    image: 'https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?auto=format&fit=crop&q=80&w=600',
    keywords: ['cabinet', 'kitchen', 'refinish', 'repaint cabinets', 'cupboard'],
    popular: true,
  },
  {
    name: 'Small Kitchen Refresh',
    category: 'cabinets',
    quoteType: 'Remodel',
    priceRange: 'Custom quote',
    image: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&q=80&w=600',
    keywords: ['kitchen', 'remodel', 'refresh', 'update', 'renovation'],
  },
  {
    name: 'Deck Staining & Sealing',
    category: 'outdoor',
    quoteType: 'Other',
    priceRange: '$600 – $1,500',
    image: 'https://images.unsplash.com/photo-1574120583586-de8847ae992c?auto=format&fit=crop&q=80&w=600',
    keywords: ['deck', 'stain', 'seal', 'wood', 'restore'],
    popular: true,
  },
  {
    name: 'Deck Repair',
    category: 'outdoor',
    quoteType: 'Other',
    priceRange: '$500 – $2,500',
    image: 'https://images.unsplash.com/photo-1613544723371-23b514a78c85?auto=format&fit=crop&q=80&w=600',
    keywords: ['deck', 'board', 'railing', 'repair', 'rotten wood'],
  },
  {
    name: 'Fence Painting & Staining',
    category: 'outdoor',
    quoteType: 'Other',
    priceRange: '$750 – $2,000',
    image: 'https://images.unsplash.com/photo-1769831190663-95fe8454d8c9?auto=format&fit=crop&q=80&w=600',
    keywords: ['fence', 'stain', 'paint', 'privacy fence', 'wood fence'],
  },
  {
    name: 'Pressure Washing',
    category: 'outdoor',
    quoteType: 'Other',
    priceRange: '$200 – $600',
    image: 'https://images.unsplash.com/photo-1581883579507-019c44b711cb?auto=format&fit=crop&q=80&w=600',
    keywords: ['pressure wash', 'power wash', 'driveway', 'clean siding', 'patio'],
  },
  {
    name: 'Office & Retail Painting',
    category: 'commercial',
    quoteType: 'Commercial',
    priceRange: 'Custom quote',
    image: 'https://images.unsplash.com/photo-1706689656095-168768dc20a5?auto=format&fit=crop&q=80&w=600',
    keywords: ['office', 'retail', 'commercial', 'store', 'tenant', 'business'],
  },
  {
    name: 'Commercial Roofing & Maintenance',
    category: 'commercial',
    quoteType: 'Commercial',
    priceRange: 'Custom quote',
    image: 'https://images.unsplash.com/photo-1681049400158-0ff6249ac315?auto=format&fit=crop&q=80&w=600',
    keywords: ['commercial roof', 'flat roof', 'maintenance', 'build out', 'property'],
  },
];

/** Maps an admin-managed service title to the quote-form project it should pre-select. */
export const quoteTypeForServiceTitle = (title: string): QuoteProjectType => {
  const t = title.toLowerCase();
  if (t.includes('interior')) return 'Interior Paint';
  if (t.includes('roof')) return 'Roofing';
  if (t.includes('siding') || t.includes('exterior')) return 'Exterior Paint';
  if (t.includes('cabinet')) return 'Cabinets';
  if (t.includes('commercial')) return 'Commercial';
  if (t.includes('remodel')) return 'Remodel';
  return 'Other';
};

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
    content: "Company is responsive, dependable and very easy to work with. Will HIGHLY recommend to any family and friends looking for painters.",
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

