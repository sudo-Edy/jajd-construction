import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { CONFIG } from '../config';
import { analytics } from '../utils/analytics';


const FAQS = [
  {
    question: 'What services does JAJD Construction offer?',
    answer:
      'Painting is our core trade: interior, exterior, and cabinets. We also do siding, roofing, deck staining, pressure washing, and commercial work across Nebraska.',
  },
  {
    question: 'How much will my project cost?',
    answer:
      'See the typical price ranges in our Services section. Every home is different, so your free written estimate is the final number.',
  },
  {
    question: 'Are you just painters, or a full general contractor?',
    answer:
      'Both. We are a licensed, insured general contractor, so one crew and one written quote can cover paint, siding, roofing, and remodels.',
  },
  {
    question: 'What areas do you serve?',
    answer:
      'We are based in Omaha and serve all of Nebraska, including Lincoln, Bellevue, Papillion, Elkhorn, Gretna, La Vista, and Fremont.',
  },
  {
    question: 'Are you licensed and insured?',
    answer:
      'Yes. Full liability and workers’ comp coverage on every job, and BBB A+ accredited since 2014.',
  },
  {
    question: 'Is the estimate really free?',
    answer:
      'Yes, free with no obligation. We look at the job in person and give you a written price. The price we quote is the price you pay.',
  },
  {
    question: 'How do I schedule my project?',
    answer:
      'Call, text, or tap any Free Estimate button. You can also pick a preferred start date in the schedule section. We reply within 24 hours.',
  },
  {
    question: 'Do you handle small jobs, or only large projects?',
    answer:
      'Yes, we do small jobs: a single room, a siding repair, a roof patch. No job is too small.',
  },
];

const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  // FAQPage structured data lives statically in index.html (crawler-reliable).
  // Keep these questions in sync with that block if you edit them here.

  return (
    <section id="faq" className="py-14 md:py-24 bg-white border-b border-stone-100">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center space-y-3 md:space-y-4 mb-8 md:mb-12">
          <span className="text-brand-600 font-bold text-xs uppercase tracking-[0.2em]">
            Quick answers
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900">
            Frequently asked questions
          </h2>

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
                  className="w-full flex items-center justify-between gap-4 p-4 md:p-6 text-left min-h-[56px]"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  aria-expanded={isOpen}
                >
                  <h3 className="text-base md:text-lg font-bold text-slate-900">{item.question}</h3>
                  <ChevronDown className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180 text-brand-600' : ''}`} />
                </button>
                {isOpen && (
                  <p className="px-4 md:px-6 pb-4 md:pb-6 text-stone-600 leading-relaxed -mt-1">
                    {item.answer}
                  </p>
                )}
              </div>
            );
          })}
        </div>

        <p className="pt-8 md:pt-10 text-center text-sm text-stone-500">
          Still have a question? Call or text{' '}
          <a
            href={`tel:${CONFIG.PHONE_RAW}`}
            onClick={() => analytics.phoneClick('faq')}
            className="font-semibold text-slate-900 underline underline-offset-2"
          >
            {CONFIG.PHONE}
          </a>
          .
        </p>
      </div>
    </section>
  );
};

export default FAQ;
