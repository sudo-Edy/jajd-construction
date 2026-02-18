import React from 'react';
import { ArrowRight } from 'lucide-react';

interface FAQProps {
  onOpenQuote: () => void;
}

const FAQ: React.FC<FAQProps> = ({ onOpenQuote }) => {
  const faqs = [
    {
      question: 'Do you serve all of Nebraska?',
      answer:
        'Yes. We take on residential and commercial projects across Nebraska. If you are outside our current coverage, we will still try to point you in the right direction.',
    },
    {
      question: 'What services do you offer?',
      answer:
        'We handle painting, roofing, siding, remodeling, and general contracting across Nebraska. If your project does not fit those categories, contact us and we can confirm availability.',
    },
    {
      question: 'How do I request a quote?',
      answer:
        'Click any quote button on the site and share your project details. We respond quickly to schedule a consultation anywhere in Nebraska.',
    },
    {
      question: 'Do you provide commercial services?',
      answer:
        'Yes. We support commercial improvements and build-outs in addition to residential work.',
    },
  ];

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };

  return (
    <section id="faq" className="py-24 bg-white border-b border-slate-100">
      <div className="max-w-5xl mx-auto px-6">
        <div className="text-center space-y-4 mb-12">
          <span className="text-slate-500 font-bold text-xs uppercase tracking-[0.2em]">
            Quick Answers
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900">
            Frequently Asked Questions
          </h2>
          <p className="text-slate-600 font-medium">
            Clear, straightforward info about our construction services in Nebraska.
          </p>
        </div>

        <div className="grid gap-4">
          {faqs.map((item) => (
            <div
              key={item.question}
              className="rounded-2xl border border-slate-200 bg-slate-50 p-6"
            >
              <h3 className="text-lg font-bold text-slate-900">{item.question}</h3>
              <p className="text-slate-600 mt-2 leading-relaxed">{item.answer}</p>
            </div>
          ))}
        </div>

        <div className="flex justify-center pt-10">
          <button
            onClick={onOpenQuote}
            className="inline-flex items-center gap-3 bg-slate-900 text-white px-8 py-4 rounded-md font-bold uppercase tracking-wider hover:bg-[#FACC15] hover:text-slate-900 transition-all shadow-lg text-xs"
          >
            Request a Quote <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </section>
  );
};

export default FAQ;
