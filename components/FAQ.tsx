import React, { useState } from 'react';
import { ArrowRight, ChevronDown } from 'lucide-react';

interface FAQProps {
  onOpenQuote: () => void;
}

const FAQS = [
  {
    question: 'What services does JAJD Construction offer?',
    answer:
      'Painting is our core trade: interior, exterior, and cabinet refinishing. We also handle siding installation and repair, roofing (inspections, repairs, and full replacements), deck staining, pressure washing, and commercial painting and build-outs across Nebraska.',
  },
  {
    question: 'Are you just painters, or a full general contractor?',
    answer:
      'Both. Painting is what we do most, and as a licensed and insured general contractor we can take on the whole project: siding, roofing, remodels, and everything that connects them. One crew, one point of contact, one written quote.',
  },
  {
    question: 'What areas do you serve?',
    answer:
      'We are based in Omaha and serve homeowners and businesses across all of Nebraska, including Lincoln, Bellevue, Papillion, Elkhorn, Gretna, La Vista, Fremont, and surrounding communities.',
  },
  {
    question: 'Are you licensed and insured?',
    answer:
      'Yes. JAJD Construction carries full general liability and workers’ compensation insurance on every job site, and we have been BBB A+ accredited since 2014.',
  },
  {
    question: 'Is the estimate really free?',
    answer:
      'Estimates are completely free with no obligation. We visit your property, look at the job in person, and give you a written quote with transparent pricing. The price we quote is the price you pay.',
  },
  {
    question: 'How do I schedule my project?',
    answer:
      'Use the schedule section on this page to pick a preferred start date, or click any "Free Estimate" button and tell us about your project. We respond within 24 hours to confirm your consultation.',
  },
  {
    question: 'Do you handle small jobs, or only large projects?',
    answer:
      'Both. We built our reputation on small jobs done well: a single-room repaint, a siding repair, a roof patch. No project is too small, and larger remodels and commercial work get the same care.',
  },
];

const FAQ: React.FC<FAQProps> = ({ onOpenQuote }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  // FAQPage structured data lives statically in index.html (crawler-reliable).
  // Keep these questions in sync with that block if you edit them here.

  return (
    <section id="faq" className="py-24 bg-white border-b border-stone-100">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center space-y-4 mb-12">
          <span className="text-brand-600 font-bold text-xs uppercase tracking-[0.2em]">
            Quick answers
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900">
            Frequently asked questions
          </h2>
          <p className="text-stone-600">
            Straight answers about painting, siding, and roofing in Nebraska.
          </p>
        </div>

        <div className="space-y-3">
          {FAQS.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={item.question}
                className={`rounded-2xl border transition-colors ${isOpen ? 'border-brand-400/60 bg-brand-50/40' : 'border-stone-200 bg-stone-50'}`}
              >
                <button
                  className="w-full flex items-center justify-between gap-4 p-5 md:p-6 text-left"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  aria-expanded={isOpen}
                >
                  <h3 className="text-base md:text-lg font-bold text-slate-900">{item.question}</h3>
                  <ChevronDown className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180 text-brand-600' : ''}`} />
                </button>
                {isOpen && (
                  <p className="px-5 md:px-6 pb-5 md:pb-6 text-stone-600 leading-relaxed -mt-1">
                    {item.answer}
                  </p>
                )}
              </div>
            );
          })}
        </div>

        <div className="flex justify-center pt-10">
          <button
            onClick={onOpenQuote}
            className="inline-flex items-center gap-3 bg-navy text-white px-8 py-4 rounded-xl font-bold hover:bg-brand-400 hover:text-navy transition-all shadow-lg"
          >
            Still have questions? Get a free estimate <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
