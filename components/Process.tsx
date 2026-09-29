import React from 'react';
import { PROCESS_STEPS } from '../constants';

const Process: React.FC = () => {

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

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 relative">
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

      </div>
    </section>
  );
};

export default Process;
