import React from 'react';
import { PROCESS_STEPS } from '../constants';
import { ArrowRight, ChevronRight, CheckCircle2 } from 'lucide-react';

interface ProcessProps {
  onOpenQuote: () => void;
}

const Process: React.FC<ProcessProps> = ({ onOpenQuote }) => {
  return (
    <section id="process" className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center space-y-4 mb-20">
          <span className="text-[#CA8A04] font-bold text-xs uppercase tracking-[0.2em]">Our Blueprint</span>
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900">The JAJD Process</h2>
          <p className="text-slate-600 max-w-2xl mx-auto mt-6 font-medium text-lg">
            We've refined our construction workflow to ensure maximum transparency, safety, and quality at every stage of the build.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 relative mb-24">
          {/* Connecting Line (Desktop) */}
          <div className="hidden lg:block absolute top-[3.25rem] left-0 w-full h-px bg-slate-200 z-0" />
          
          {PROCESS_STEPS.map((step, index) => (
            <div key={index} className="relative z-10 group cursor-default">
              {/* Colored Bloom - Permanent but stronger on hover */}
              <div className="absolute inset-0 bg-[#FACC15] rounded-lg blur-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-500 -z-10" />
              
              <div className="bg-white border border-slate-200 p-8 rounded-lg space-y-6 hover:shadow-xl hover:border-[#FACC15] transition-all duration-300 group-hover:-translate-y-1 h-full relative">
                {/* Icon Container - Permanent Yellow */}
                <div className="w-20 h-20 bg-[#FACC15] border border-[#eab308] rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-md text-slate-900">
                  {React.cloneElement(step.icon as React.ReactElement<{ className?: string }>, { className: "w-10 h-10 stroke-[1.5]" })}
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 mb-2">
                     <span className="text-xs font-bold text-slate-300 uppercase tracking-widest">Step 0{index + 1}</span>
                     <div className="h-px flex-1 bg-slate-100" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900">{step.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed font-medium">
                    {step.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-slate-900 rounded-lg p-10 md:p-16 flex flex-col items-center text-center gap-10 border border-slate-800 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#FACC15]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          
          <div className="relative z-10 space-y-8 max-w-3xl">
            <h3 className="text-3xl md:text-5xl font-bold text-white tracking-tight">Ready to start your build?</h3>
            
            <div className="flex flex-wrap justify-center gap-4 md:gap-12">
              {[
                { n: "1", t: "Request Quote" },
                { n: "2", t: "We Contact You" },
                { n: "3", t: "Job Scheduled" }
              ].map((item, i) => (
                <div key={item.n} className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-md bg-[#FACC15] text-slate-900 font-bold text-sm shadow-lg">
                    {item.n}
                  </div>
                  <span className="text-white font-bold text-sm tracking-wide">{item.t}</span>
                  {i < 2 && <ArrowRight className="hidden md:block w-4 h-4 text-slate-600 ml-8" />}
                </div>
              ))}
            </div>

            <div className="pt-4">
               <button 
                onClick={onOpenQuote}
                className="bg-[#FACC15] text-slate-900 px-8 py-4 rounded-md font-bold uppercase tracking-wider hover:bg-white transition-all shadow-xl text-sm flex items-center gap-3 mx-auto active:scale-95"
              >
                Get Free Estimate <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Process;
