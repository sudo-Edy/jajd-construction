import React, { useState } from 'react';
import { Star, ShieldCheck, ArrowRight, Construction, CheckCircle2, Clock } from 'lucide-react';
import { isValidZip } from '../utils/validation';

interface HeroProps {
  onOpenQuote: (zipCode?: string) => void;
}

const Hero: React.FC<HeroProps> = ({ onOpenQuote }) => {
  const [zip, setZip] = useState('');

  return (
    <section className="relative min-h-[90vh] flex items-center pt-32 pb-20 overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-slate-900/90 z-10" />
        <img 
          src="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&q=80&w=2000" 
          alt="Modern Construction Jobsite"
          className="w-full h-full object-cover opacity-60"
          loading="eager"
        />
      </div>

      <div className="relative z-20 max-w-7xl mx-auto px-6 w-full grid lg:grid-cols-2 gap-16 items-center">
        {/* Left Text Content */}
        <div className="text-white space-y-8 animate-in slide-in-from-left duration-700">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/10 hover:bg-white/15 transition-colors cursor-default">
            <Star className="w-3.5 h-3.5 text-[#FACC15] fill-[#FACC15]" />
            <span className="text-xs font-bold uppercase tracking-wider text-white">#1 Rated in Omaha</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.1] drop-shadow-lg">
            Omaha's Premier <br />
            <span className="text-[#FACC15]">Painting & Reno</span> <br />
            Experts.
          </h1>
          
          <p className="text-lg md:text-xl text-white/90 max-w-lg leading-relaxed font-medium drop-shadow-md">
            From detailed interior painting to full-scale remodels, we bring certainty to your project. On time, on budget, and built to last.
          </p>

          <div className="flex flex-wrap gap-4 pt-2">
            <div className="flex items-center gap-3 bg-white/5 px-5 py-3 rounded-lg border border-white/10 hover:bg-white/10 transition-colors">
               <ShieldCheck className="w-6 h-6 text-[#FACC15]" />
               <div>
                 <p className="text-[10px] uppercase font-bold tracking-wider text-white/50">Fully</p>
                 <p className="font-semibold text-sm">Insured & Bonded</p>
               </div>
            </div>
            <div className="flex items-center gap-3 bg-white/5 px-5 py-3 rounded-lg border border-white/10 hover:bg-white/10 transition-colors">
               <CheckCircle2 className="w-6 h-6 text-[#FACC15]" />
               <div>
                 <p className="text-[10px] uppercase font-bold tracking-wider text-white/50">2 Year</p>
                 <p className="font-semibold text-sm">Warranty Included</p>
               </div>
            </div>
          </div>
        </div>

        {/* Right Floating Estimate Card */}
        <div className="lg:justify-self-end w-full max-w-md animate-in slide-in-from-right duration-700 delay-200">
          <div className="bg-white dark:bg-slate-900 p-8 rounded-lg shadow-2xl relative overflow-hidden ring-1 ring-slate-900/5 dark:ring-white/10">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#FACC15]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            
            <div className="relative z-10 space-y-6">
              <div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Schedule Your Free Estimate</h3>
                <p className="text-slate-600 dark:text-slate-400 font-medium text-sm mt-2">Find out exactly what your project will cost. No obligation.</p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                   <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Property Zip Code</label>
                   <div className="relative">
                     <input 
                        type="text" 
                        maxLength={5}
                        placeholder="e.g. 68102"
                        className="w-full bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-md px-4 py-3 font-bold text-lg focus:outline-none focus:border-[#FACC15] dark:focus:border-[#FACC15] transition-all text-slate-900 dark:text-white placeholder-slate-300"
                        value={zip}
                        onChange={(e) => setZip(e.target.value.replace(/\D/g, ''))}
                     />
                     <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                       <Clock className="w-5 h-5 text-slate-400" />
                     </div>
                   </div>
                </div>

                <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-md border border-slate-200 dark:border-slate-700 flex gap-3 items-start">
                   <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                   <p className="text-xs text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
                     Your privacy is protected. We never share your data with 3rd parties.
                   </p>
                </div>

                <button 
                  onClick={() => onOpenQuote(zip)}
                  className="w-full bg-[#FACC15] text-slate-900 py-4 rounded-md font-bold uppercase tracking-wider hover:bg-slate-900 hover:text-white dark:hover:bg-white dark:hover:text-slate-900 transition-all shadow-lg flex items-center justify-center gap-2 text-sm"
                >
                  Get Started <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
