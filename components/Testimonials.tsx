import React, { useState } from 'react';
import { TESTIMONIALS } from '../constants';
import { Quote, ChevronLeft, ChevronRight, Star, ArrowRight } from 'lucide-react';

interface TestimonialsProps {
  onOpenQuote?: () => void;
}

const Testimonials: React.FC<TestimonialsProps> = ({ onOpenQuote }) => {
  const [active, setActive] = useState(0);

  const next = () => setActive((prev) => (prev + 1) % TESTIMONIALS.length);
  const prev = () => setActive((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);

  return (
    <section id="reviews" className="py-24 bg-gray-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-16">
          <div className="space-y-8">
            <div className="space-y-4">
              <span className="text-[#FACC15] font-black text-xs uppercase tracking-[0.3em]">Client Testimony</span>
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight">Trusted by Industry Leaders & Homeowners</h2>
            </div>
            <div className="flex gap-4">
              <button onClick={prev} className="w-14 h-14 rounded-full border border-gray-200 flex items-center justify-center hover:bg-white hover:shadow-xl transition-all">
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button onClick={next} className="w-14 h-14 rounded-full border border-gray-200 flex items-center justify-center hover:bg-white hover:shadow-xl transition-all">
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
            
            <div className="flex items-center gap-6 p-6 bg-white rounded-2xl shadow-sm border border-gray-100">
              <div className="flex -space-x-4">
                {[1, 2, 3, 4].map(i => (
                  <img 
                    key={i}
                    src={`https://picsum.photos/seed/${i}/100/100`} 
                    className="w-12 h-12 rounded-full border-4 border-white object-cover" 
                    alt="Reviewer"
                  />
                ))}
              </div>
              <div>
                <div className="flex text-[#FACC15] mb-1">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                </div>
                <p className="text-xs font-bold text-slate-900">4.9/5 Average Rating (500+ Projects)</p>
              </div>
            </div>
          </div>

          <div className="relative">
            <Quote className="absolute -top-10 -left-10 w-32 h-32 text-gray-200/50 -z-0" />
            <div className="relative z-10 bg-white p-12 rounded-[2.5rem] shadow-2xl space-y-8 animate-in fade-in slide-in-from-right duration-500" key={active}>
              <p className="text-2xl font-medium text-slate-900 leading-relaxed italic">
                "{TESTIMONIALS[active].content}"
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-1 bg-[#FACC15]" />
                <div>
                  <h4 className="font-bold text-lg text-slate-900">{TESTIMONIALS[active].name}</h4>
                  <p className="text-gray-400 text-sm">{TESTIMONIALS[active].role}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center pt-8 border-t border-gray-100">
          <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6">Experience the JAJD standard for yourself</p>
          <button 
            onClick={onOpenQuote}
            className="inline-flex items-center gap-3 bg-slate-900 text-[#FACC15] px-10 py-5 rounded-2xl font-black uppercase tracking-[0.15em] hover:bg-[#FACC15] hover:text-slate-900 transition-all shadow-xl text-[10px] group"
          >
            Request Free Quote <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;