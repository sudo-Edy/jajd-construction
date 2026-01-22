import React from 'react';
import { PROCESS_STEPS } from '../data/siteData';
import { ArrowRight } from 'lucide-react';

interface ProcessProps {
  onOpenQuote: () => void;
}

const Process: React.FC<ProcessProps> = ({ onOpenQuote }) => {
  return (
    <section id="process" className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center space-y-4 mb-16">
          <span className="text-[#FACC15] font-bold text-xs uppercase tracking-[0.3em]">Our Blueprint</span>
          <h2 className="text-4xl md:text-5xl font-black text-navy">The JAJD Process</h2>
          <div className="w-24 h-1.5 bg-[#FACC15] mx-auto" />
          <p className="text-gray-400 max-w-lg mx-auto mt-6 font-medium">
            We've refined our construction workflow to ensure maximum transparency, safety, and quality at every stage of the build.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 relative mb-20">
          {/* Industrial Connecting Line (Desktop) */}
          <div className="hidden lg:block absolute top-12 left-0 w-full h-px border-t-2 border-dashed border-gray-200 z-0" />
          
          {PROCESS_STEPS.map((step, index) => (
            <div key={index} className="relative z-10 group">
              <div className="bg-white border border-gray-100 p-8 rounded-[2rem] space-y-6 hover:shadow-2xl hover:border-[#FACC15]/20 transition-all duration-500 group-hover:-translate-y-2">
                <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center group-hover:bg-[#FACC15]/10 transition-colors shadow-sm">
                  {step.icon}
                </div>
                <div className="space-y-3">
                  <h3 className="text-xl font-bold text-navy">{step.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">
                    {step.description}
                  </p>
                </div>
                <div className="text-[10px] font-black text-gray-200 group-hover:text-[#FACC15]/30 transition-colors uppercase tracking-[0.3em]">
                  Phase 0{index + 1}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-slate-900 rounded-[3rem] p-10 md:p-16 flex flex-col md:flex-row items-center justify-between gap-12 border-b-8 border-[#FACC15]">
          <div className="space-y-6">
            <h3 className="text-3xl md:text-4xl font-black text-white">Ready to start your build?</h3>
            <div className="flex flex-wrap gap-8">
              {[
                { n: "1", t: "Request Quote" },
                { n: "2", t: "We Contact You" },
                { n: "3", t: "Job Scheduled" }
              ].map(item => (
                <div key={item.n} className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-[#FACC15] text-slate-900 flex items-center justify-center font-black text-xs">{item.n}</span>
                  <span className="text-white/60 font-bold uppercase tracking-widest text-[10px]">{item.t}</span>
                </div>
              ))}
            </div>
          </div>
          <button 
            onClick={onOpenQuote}
            className="bg-[#FACC15] text-slate-900 px-12 py-6 rounded-2xl font-black uppercase tracking-[0.2em] hover:bg-white transition-all shadow-2xl text-xs flex items-center gap-2 whitespace-nowrap active:scale-95"
          >
            Get Free Estimate <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Process;