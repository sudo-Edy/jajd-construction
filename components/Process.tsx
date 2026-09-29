import React from 'react';
import { PROCESS_STEPS } from '../constants';
import { ArrowRight } from 'lucide-react';
import { useSiteSettings } from '../contexts/SiteSettingsContext';
import { SETTING_KEYS } from '../utils/siteSettings';

interface ProcessProps {
  onOpenQuote: () => void;
}

const Process: React.FC<ProcessProps> = ({ onOpenQuote }) => {
  const { get } = useSiteSettings();
  const ctaBackground = get(SETTING_KEYS.CTA_BACKGROUND, '');

  return (
    <section id="process" className="py-14 md:py-24 bg-stone-50 overflow-hidden border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center space-y-3 md:space-y-4 mb-8 md:mb-16">
          <span className="text-brand-600 font-bold text-xs uppercase tracking-[0.2em]">How it works</span>
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-slate-900">Four simple steps.</h2>
          <p className="text-stone-600 max-w-2xl mx-auto text-base md:text-lg">
            No surprises on price or timing.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 relative mb-10 md:mb-20">
          {/* Connecting line (desktop) */}
          <div className="hidden lg:block absolute top-12 left-[12%] w-[76%] h-px bg-slate-200 z-0" />

          {PROCESS_STEPS.map((step, index) => (
            <div key={index} className="relative z-10">
              {/* Phones: compact row (icon left, text right). Larger screens: card. */}
              <div className="bg-white border border-stone-200 p-4 sm:p-7 rounded-2xl flex sm:block items-start gap-4 sm:space-y-5 hover:shadow-card-hover hover:border-brand-400/60 transition-all duration-300 hover:-translate-y-1 h-full">
                <div className="flex items-center justify-between shrink-0">
                  <div className="w-11 h-11 sm:w-14 sm:h-14 bg-brand-400 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-md text-navy">
                    {React.cloneElement(step.icon as React.ReactElement<{ className?: string }>, { className: 'w-6 h-6 sm:w-7 sm:h-7 stroke-[1.75]' })}
                  </div>
                  <span className="hidden sm:inline text-4xl font-extrabold text-slate-100 select-none">0{index + 1}</span>
                </div>
                <div className="space-y-1 sm:space-y-2">
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug"><span className="sm:hidden text-brand-600">{index + 1}. </span>{step.title}</h3>
                  <p className="text-stone-500 text-sm leading-relaxed">{step.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-navy rounded-3xl p-7 md:p-14 flex flex-col items-center text-center gap-8 shadow-2xl relative overflow-hidden">
          {ctaBackground && (
            <>
              <img
                src={ctaBackground}
                alt=""
                aria-hidden="true"
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover opacity-25"
              />
              <div className="absolute inset-0 bg-navy/60" />
            </>
          )}
          <div className="absolute top-0 right-0 w-72 h-72 bg-brand-400/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

          <div className="relative z-10 space-y-5 md:space-y-7 max-w-3xl">
            <h3 className="text-2xl md:text-4xl font-extrabold text-white tracking-tight">Ready when you are.</h3>
            <p className="text-white/60 text-base md:text-lg">Free estimate, reply within 24 hours.</p>


            <button
              onClick={onOpenQuote}
              className="bg-brand-400 text-navy px-8 py-4 rounded-xl font-bold hover:bg-white transition-all shadow-xl flex items-center gap-3 mx-auto active:scale-95"
            >
              Get My Free Estimate <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Process;
