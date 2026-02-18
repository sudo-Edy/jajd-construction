import React, { useState } from 'react';
import { TESTIMONIALS } from '../constants';
import { Quote, ChevronLeft, ChevronRight, Star, ArrowRight } from 'lucide-react';

interface TestimonialsProps {
  onOpenQuote?: () => void;
}

const Testimonials: React.FC<TestimonialsProps> = ({ onOpenQuote }) => {
  const [active, setActive] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const next = () => setActive((prev) => (prev + 1) % TESTIMONIALS.length);
  const prev = () => setActive((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);

  // Auto-rotate every 6 seconds, pause on hover
  React.useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(next, 6000);
    return () => clearInterval(interval);
  }, [isPaused]);

  return (
    <section 
      id="reviews" 
      className="py-24 bg-slate-50 overflow-hidden border-b border-slate-200"
      onMouseEnter={() => setIsPaused(true)} 
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-16">
          <div className="space-y-8">
            <div className="space-y-4">
              <span className="text-[#CA8A04] font-bold text-xs uppercase tracking-[0.2em]">Client Testimony</span>
              <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 leading-tight tracking-tight">Trusted by Industry Leaders & Homeowners</h2>
            </div>
            <div className="flex gap-4">
              <button onClick={prev} className="w-12 h-12 rounded-md border border-slate-200 flex items-center justify-center hover:bg-white hover:shadow-lg transition-all hover:border-[#FACC15]/30 group">
                <ChevronLeft className="w-5 h-5 text-slate-600 group-hover:text-slate-900" />
              </button>
              <button onClick={next} className="w-12 h-12 rounded-md border border-slate-200 flex items-center justify-center hover:bg-white hover:shadow-lg transition-all hover:border-[#FACC15]/30 group">
                <ChevronRight className="w-5 h-5 text-slate-600 group-hover:text-slate-900" />
              </button>
            </div>
            
            <div className="flex items-center gap-6 p-6 bg-white rounded-lg shadow-sm border border-slate-200">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="rounded-full ring-2 ring-white">
                     <img 
                      src={`https://picsum.photos/seed/${i}/100/100`} 
                      className="w-10 h-10 rounded-full object-cover" 
                      alt="Reviewer"
                    />
                  </div>
                ))}
              </div>
              <div className="space-y-1">
                <div className="flex text-[#FACC15]">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                </div>
                <p className="text-xs font-bold text-slate-900">4.9/5 Average Rating <span className="text-slate-500 font-medium">(500+ Projects)</span></p>
              </div>
            </div>
          </div>

          <div className="relative">
            <Quote className="absolute -top-6 -left-6 w-24 h-24 text-slate-200/50 -z-0" />
            <div className="relative z-10 bg-white p-10 rounded-lg shadow-xl border border-slate-100 space-y-8 animate-in fade-in slide-in-from-right duration-500 min-h-[320px] flex flex-col justify-between" key={active}>
              <div className="space-y-6">
                <div className="flex gap-1 text-[#FACC15]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-current" />
                  ))}
                </div>
                <p className="text-xl md:text-2xl font-medium text-slate-900 leading-relaxed">
                  "{TESTIMONIALS[active].content}"
                </p>
              </div>
              
              <div className="flex items-center gap-4 pt-4 border-t border-slate-100">
                <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center font-bold text-slate-500 text-sm">
                  {TESTIMONIALS[active].name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold text-base text-slate-900">{TESTIMONIALS[active].name}</h4>
                  <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">{TESTIMONIALS[active].role}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center pt-8">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">Experience the JAJD standard for yourself</p>
          <button 
            onClick={onOpenQuote}
            className="inline-flex items-center gap-3 bg-slate-900 text-white px-8 py-4 rounded-md font-bold uppercase tracking-wider hover:bg-[#FACC15] hover:text-slate-900 transition-all shadow-lg text-xs group active:scale-95"
          >
            Request Free Quote <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
