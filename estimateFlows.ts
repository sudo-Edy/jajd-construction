import { EstimateFlow } from './types';

/*
 * Project-specific estimate questionnaires.
 *
 * Each popular project (and each quote-form service) resolves to a flow. The
 * questions become step 2 of the quote modal, so "Pressure Washing" asks what
 * surfaces and how dirty, while "Roof Replacement" asks about stories and
 * insurance — the way Angi / Thumbtack tailor their request forms.
 *
 * Keyed primarily by the project NAME (PopularProject.name), with a per-service
 * fallback so the generic "Free Estimate" buttons still work.
 */

/** Used by the floating CTA, header, calendar, and any open with no project. */
export const GENERIC_FLOW: EstimateFlow = {
  service: 'Other',
  headline: 'Tell us about your project',
  blurb: 'A few quick details and we’ll take it from there.',
  questions: [
    {
      id: 'service',
      role: 'service',
      label: 'What can we help with?',
      type: 'single',
      required: true,
      options: [
        'Interior Painting',
        'Exterior Painting',
        'Siding',
        'Roofing',
        'Cabinets',
        'Decks & Outdoor',
        'Pressure Washing',
        'Commercial',
        'Something else',
      ],
    },
    {
      id: 'size',
      role: 'size',
      label: 'About how big is the job?',
      type: 'single',
      required: true,
      options: ['Small', 'Medium', 'Large', 'Not sure yet'],
    },
    {
      id: 'budget',
      role: 'budget',
      label: 'Rough budget in mind? (optional)',
      type: 'single',
      options: ['Under $1k', '$1k – $5k', '$5k – $10k', '$10k+', 'Not sure'],
    },
  ],
};

const SIZE = (label: string, options: string[]) =>
  ({ id: 'size', role: 'size' as const, label, type: 'single' as const, required: true, options });

export const ESTIMATE_FLOWS: Record<string, EstimateFlow> = {
  /* ----------------------------- Interior & paint ----------------------------- */
  'Whole-Home Interior Painting': {
    service: 'Interior Paint',
    headline: 'Let’s scope your interior painting',
    blurb: 'The more we know, the tighter your estimate.',
    questions: [
      { id: 'rooms', label: 'About how many rooms?', type: 'single', required: true, options: ['1–2', '3–4', '5–6', 'Whole house'] },
      { id: 'surfaces', label: 'What should we paint?', type: 'multi', required: true, options: ['Walls', 'Ceilings', 'Trim & baseboards', 'Doors', 'Closets'] },
      { id: 'condition', label: 'How are the walls now?', type: 'single', options: ['Good shape', 'Some patching needed', 'Lots of repairs', 'Not sure'] },
      { id: 'occupied', label: 'Will you be living there during the work?', type: 'single', options: ['Yes', 'No — it’s empty'] },
    ],
  },
  'Paint a Single Room': {
    service: 'Interior Paint',
    headline: 'Let’s scope your room',
    blurb: 'Quick details about the space.',
    questions: [
      { id: 'room', label: 'Which room?', type: 'single', required: true, options: ['Bedroom', 'Living room', 'Kitchen', 'Bathroom', 'Office', 'Other'] },
      { id: 'surfaces', label: 'What should we paint?', type: 'multi', required: true, options: ['Walls', 'Ceiling', 'Trim', 'Accent wall', 'Closet'] },
      { id: 'ceiling', label: 'Ceiling height?', type: 'single', options: ['Standard (8 ft)', 'High / vaulted', 'Not sure'] },
      { id: 'color', label: 'Big color change?', type: 'single', options: ['Similar shade', 'Going darker → lighter', 'Lighter → darker', 'Not sure'] },
    ],
  },
  'Trim, Doors & Baseboards': {
    service: 'Interior Paint',
    headline: 'Let’s scope your trim work',
    blurb: 'Trim, doors, and millwork details.',
    questions: [
      { id: 'items', label: 'What needs finishing?', type: 'multi', required: true, options: ['Baseboards', 'Door casings', 'Crown molding', 'Doors', 'Window trim', 'Stair railings'] },
      { id: 'doors', label: 'Roughly how many doors?', type: 'single', options: ['1–3', '4–8', '9+', 'None'] },
      { id: 'finish', label: 'Paint or stain?', type: 'single', required: true, options: ['Paint', 'Stain', 'Not sure'] },
      SIZE('How much of the home?', ['One room', 'A few rooms', 'Whole house']),
    ],
  },
  'Drywall Repair & Painting': {
    service: 'Interior Paint',
    headline: 'Let’s look at the drywall',
    blurb: 'Tell us what happened and where.',
    questions: [
      { id: 'damage', label: 'What kind of damage?', type: 'multi', required: true, options: ['Nail holes / dents', 'Cracks', 'A hole', 'Water damage', 'Texture matching', 'Sagging ceiling'] },
      { id: 'spots', label: 'How many spots?', type: 'single', required: true, options: ['Just one', 'A few', 'Several rooms'] },
      { id: 'where', label: 'Walls or ceilings?', type: 'single', options: ['Walls', 'Ceilings', 'Both'] },
      { id: 'repaint', label: 'Repaint after the repair?', type: 'single', options: ['Yes', 'Just the patch', 'Not sure'] },
    ],
  },
  'Popcorn Ceiling Removal': {
    service: 'Interior Paint',
    headline: 'Let’s scope the ceilings',
    blurb: 'We’ll smooth and refinish them.',
    questions: [
      SIZE('How many rooms?', ['1 room', '2–3 rooms', 'Whole house']),
      { id: 'age', label: 'Roughly when was the home built?', type: 'single', options: ['Before 1980', '1980s–1990s', '2000 or later', 'Not sure'], hint: 'Older texture may need a quick asbestos test first — we’ll guide you.' },
      { id: 'finish', label: 'After removal, you want…', type: 'single', options: ['Smooth & painted', 'Light texture & painted', 'Not sure'] },
    ],
  },
  'Door Refinishing & Staining': {
    service: 'Interior Paint',
    headline: 'Let’s scope your doors',
    blurb: 'Sanding, staining, refinishing.',
    questions: [
      { id: 'doors', label: 'How many doors?', type: 'single', required: true, options: ['1', '2–3', '4+'] },
      { id: 'type', label: 'Interior or exterior?', type: 'single', required: true, options: ['Interior', 'Front / exterior', 'Both'] },
      { id: 'current', label: 'Current finish?', type: 'single', options: ['Stained wood', 'Painted', 'Bare / raw', 'Not sure'] },
      { id: 'finish', label: 'Refinish to…', type: 'single', options: ['Re-stain', 'Paint', 'Match existing', 'Not sure'] },
    ],
  },

  /* ----------------------------- Exterior & siding ---------------------------- */
  'Exterior House Painting': {
    service: 'Exterior Paint',
    headline: 'Let’s scope the exterior',
    blurb: 'A few details about the house.',
    questions: [
      { id: 'stories', label: 'How many stories?', type: 'single', required: true, options: ['1', '2', '3+'] },
      { id: 'material', label: 'Siding material?', type: 'single', required: true, options: ['Wood', 'Vinyl', 'Hardie / fiber cement', 'Stucco', 'Brick & trim', 'Not sure'] },
      { id: 'includes', label: 'What should we paint?', type: 'multi', options: ['Body', 'Trim', 'Shutters', 'Doors', 'Soffit & fascia', 'Deck / porch'] },
      SIZE('Home size?', ['Small', 'Average', 'Large']),
    ],
  },
  'Siding Repair': {
    service: 'Siding',
    headline: 'Let’s look at the siding',
    blurb: 'Tell us what’s damaged.',
    questions: [
      { id: 'material', label: 'Siding material?', type: 'single', required: true, options: ['Vinyl', 'Wood', 'Hardie / fiber cement', 'Aluminum', 'Not sure'] },
      { id: 'extent', label: 'How much is affected?', type: 'single', required: true, options: ['A few panels', 'One section / side', 'Multiple sides', 'Not sure'] },
      { id: 'cause', label: 'What caused it?', type: 'multi', options: ['Storm / hail', 'Rot / moisture', 'Age', 'Impact', 'Not sure'] },
      { id: 'insurance', label: 'Going through insurance?', type: 'single', options: ['Yes', 'No', 'Not sure'] },
    ],
  },
  'New Siding Installation': {
    service: 'Siding',
    headline: 'Let’s scope new siding',
    blurb: 'Replacing or residing the home.',
    questions: [
      { id: 'scope', label: 'Replace or new build?', type: 'single', required: true, options: ['Replace existing', 'New addition', 'Whole home', 'Not sure'] },
      { id: 'material', label: 'Material you’re considering?', type: 'single', options: ['Vinyl', 'Hardie / fiber cement', 'Wood', 'Engineered wood', 'Open to suggestions'] },
      SIZE('Home size?', ['Small', 'Average', 'Large']),
      { id: 'removal', label: 'Existing siding to remove?', type: 'single', options: ['Yes', 'No', 'Not sure'] },
    ],
  },

  /* --------------------------------- Roofing ---------------------------------- */
  'Roof Replacement': {
    service: 'Roofing',
    headline: 'Let’s scope your new roof',
    blurb: 'A few details to size it up.',
    questions: [
      { id: 'stories', label: 'How many stories?', type: 'single', required: true, options: ['1', '2', '3+'] },
      { id: 'current', label: 'Current roof material?', type: 'single', required: true, options: ['Asphalt shingle', 'Metal', 'Tile', 'Flat / membrane', 'Not sure'] },
      SIZE('Home size?', ['Small', 'Average', 'Large']),
      { id: 'insurance', label: 'Is this an insurance / storm claim?', type: 'single', options: ['Yes', 'No — paying directly', 'Not sure'] },
    ],
  },
  'Roof Repair': {
    service: 'Roofing',
    headline: 'Let’s look at the roof',
    blurb: 'Tell us what you’re seeing.',
    questions: [
      { id: 'issue', label: 'What’s going on?', type: 'multi', required: true, options: ['Active leak', 'Missing shingles', 'Storm damage', 'Flashing / vents', 'Sagging', 'Not sure'] },
      { id: 'stories', label: 'How many stories?', type: 'single', options: ['1', '2', '3+'] },
      { id: 'when', label: 'When did you notice it?', type: 'single', options: ['Just now', 'This week', 'A while ago'] },
      { id: 'urgent', label: 'Water getting inside?', type: 'single', options: ['Yes — actively', 'A little', 'No'] },
    ],
  },
  'Storm & Hail Damage Check': {
    service: 'Roofing',
    headline: 'Free storm damage inspection',
    blurb: 'We inspect, document, and can work directly with your insurance.',
    questions: [
      { id: 'when', label: 'When was the storm?', type: 'single', required: true, options: ['In the last week', 'This month', 'A while ago', 'Not sure'] },
      { id: 'areas', label: 'Where do you see (or suspect) damage?', type: 'multi', required: true, options: ['Roof', 'Siding', 'Gutters', 'Windows', 'Fence', 'Whole exterior', 'Not sure'] },
      { id: 'insurance', label: 'Insurance plans?', type: 'single', options: ['Filing a claim', 'Want help deciding', 'Paying out of pocket', 'Not sure'] },
      { id: 'urgent', label: 'Anything actively leaking or exposed?', type: 'single', options: ['Yes — needs attention now', 'No — just an inspection'] },
    ],
  },

  /* ----------------------------- Kitchen & cabinets --------------------------- */
  'Cabinet Painting & Refinishing': {
    service: 'Cabinets',
    headline: 'Let’s scope your cabinets',
    blurb: 'Factory-smooth finish without replacing them.',
    questions: [
      SIZE('Kitchen size?', ['Small', 'Average', 'Large / island']),
      { id: 'current', label: 'Current finish?', type: 'single', required: true, options: ['Stained wood', 'Painted', 'Laminate / thermofoil', 'Not sure'] },
      { id: 'finish', label: 'You want them…', type: 'single', required: true, options: ['Painted', 'Re-stained', 'Not sure'] },
      { id: 'hardware', label: 'New hardware or doors?', type: 'multi', options: ['New knobs / pulls', 'New doors', 'Keep existing', 'Not sure'] },
    ],
  },
  'Small Kitchen Refresh': {
    service: 'Remodel',
    headline: 'Let’s scope your kitchen refresh',
    blurb: 'Cosmetic updates, no full gut.',
    questions: [
      { id: 'scope', label: 'What’s on the list?', type: 'multi', required: true, options: ['Cabinets refinished', 'Walls painted', 'New backsplash', 'New hardware', 'Lighting', 'Not sure yet'] },
      SIZE('Kitchen size?', ['Small', 'Average', 'Large']),
      { id: 'timeline', label: 'Timeline?', type: 'single', options: ['ASAP', '1–3 months', 'Just planning'] },
    ],
  },

  /* ----------------------------- Decks & outdoor ------------------------------ */
  'Deck Staining & Sealing': {
    service: 'Other',
    headline: 'Let’s scope your deck',
    blurb: 'Cleaning, staining, and sealing.',
    questions: [
      { id: 'material', label: 'Deck material?', type: 'single', required: true, options: ['Wood', 'Composite', 'Not sure'] },
      SIZE('About how big?', ['Small (under 150 sq ft)', 'Medium (150–350)', 'Large (350+)', 'Not sure']),
      { id: 'last', label: 'Last stained?', type: 'single', options: ['Never', '1–3 years ago', '4+ years ago', 'Not sure'] },
      { id: 'repairs', label: 'Any repairs needed too?', type: 'single', options: ['No, just refinishing', 'A few boards', 'Yes — quite a bit'] },
    ],
  },
  'Deck Repair': {
    service: 'Other',
    headline: 'Let’s look at the deck',
    blurb: 'Tell us what needs fixing.',
    questions: [
      { id: 'issues', label: 'What needs work?', type: 'multi', required: true, options: ['Loose / rotten boards', 'Wobbly railing', 'Stairs', 'Structural / frame', 'Refinishing too', 'Not sure'] },
      { id: 'material', label: 'Deck material?', type: 'single', options: ['Wood', 'Composite', 'Not sure'] },
      SIZE('About how big?', ['Small', 'Medium', 'Large']),
    ],
  },
  'Fence Painting & Staining': {
    service: 'Other',
    headline: 'Let’s scope your fence',
    blurb: 'Staining or painting, both sides if you like.',
    questions: [
      { id: 'material', label: 'Fence material?', type: 'single', required: true, options: ['Wood', 'Vinyl', 'Metal', 'Not sure'] },
      { id: 'length', label: 'About how long?', type: 'single', required: true, role: 'size', options: ['Short run', 'One yard', 'Large property', 'Not sure'] },
      { id: 'finish', label: 'Paint or stain?', type: 'single', options: ['Stain', 'Paint', 'Not sure'] },
      { id: 'sides', label: 'One side or both?', type: 'single', options: ['One side', 'Both sides'] },
    ],
  },
  'Pressure Washing': {
    service: 'Other',
    headline: 'Let’s scope your pressure washing',
    blurb: 'What needs washing, and how dirty is it?',
    questions: [
      { id: 'surfaces', label: 'What should we wash?', type: 'multi', required: true, options: ['Driveway', 'Sidewalks', 'House siding', 'Deck / patio', 'Fence', 'Garage floor', 'Roof (soft wash)'] },
      { id: 'area', label: 'How much area?', type: 'single', required: true, role: 'size', options: ['One surface', 'A few areas', 'Whole property'] },
      { id: 'condition', label: 'How dirty is it?', type: 'single', options: ['Light dirt', 'Moderate buildup', 'Heavy mold / mildew', 'Not sure'] },
    ],
  },

  /* -------------------------------- Commercial -------------------------------- */
  'Office & Retail Painting': {
    service: 'Commercial',
    headline: 'Let’s scope your commercial paint job',
    blurb: 'We work around your hours.',
    questions: [
      { id: 'scope', label: 'Interior, exterior, or both?', type: 'single', required: true, options: ['Interior', 'Exterior', 'Both'] },
      { id: 'property', label: 'Property type?', type: 'single', options: ['Office', 'Retail / storefront', 'Restaurant', 'Industrial / warehouse', 'Other'] },
      SIZE('Approx. square footage?', ['Under 2,000', '2,000–10,000', '10,000+', 'Not sure']),
      { id: 'timing', label: 'When can we work?', type: 'single', options: ['Business hours', 'After hours / weekends', 'Flexible'] },
    ],
  },
  'Commercial Roofing & Maintenance': {
    service: 'Commercial',
    headline: 'Let’s scope your commercial roof',
    blurb: 'Repairs, maintenance, or replacement.',
    questions: [
      { id: 'roof', label: 'Roof type?', type: 'single', required: true, options: ['Flat / membrane (TPO, EPDM)', 'Metal', 'Shingle', 'Not sure'] },
      { id: 'need', label: 'What do you need?', type: 'single', required: true, options: ['Repair / leak', 'Routine maintenance', 'Full replacement', 'Inspection'] },
      SIZE('Building size?', ['Small', 'Medium', 'Large', 'Not sure']),
    ],
  },
};

/** Per-service fallback when only a service type is known (e.g. service cards). */
const SERVICE_FALLBACK: Record<string, string> = {
  'Interior Paint': 'Whole-Home Interior Painting',
  'Exterior Paint': 'Exterior House Painting',
  Siding: 'Siding Repair',
  Roofing: 'Roof Repair',
  Cabinets: 'Cabinet Painting & Refinishing',
  Commercial: 'Office & Retail Painting',
  Remodel: 'Small Kitchen Refresh',
};

/**
 * Resolve the right questionnaire.
 * @param detail   the specific project name (PopularProject.name), if any
 * @param service  the quote-form service type, if any
 */
export const resolveEstimateFlow = (detail?: string, service?: string): EstimateFlow => {
  if (detail && ESTIMATE_FLOWS[detail]) return ESTIMATE_FLOWS[detail];
  if (service && SERVICE_FALLBACK[service] && ESTIMATE_FLOWS[SERVICE_FALLBACK[service]]) {
    return ESTIMATE_FLOWS[SERVICE_FALLBACK[service]];
  }
  return GENERIC_FLOW;
};
