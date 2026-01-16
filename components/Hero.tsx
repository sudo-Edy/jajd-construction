import React, { useState } from 'react';
import { Star, ShieldCheck, ArrowRight, Construction, CheckCircle2, Clock } from 'lucide-react';
import { isValidZip } from '../utils/validation';

interface HeroProps {
  onOpenQuote: (zipCode?: string) => void;
}

const Hero: React.FC<HeroProps> = ({ onOpenQuote }) => {
  const [zip, setZip] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isValidZip(zip)) {
      setError(false);
      onOpenQuote(zip);
    } else {
      setError(true);
    }
  };

  return (
    <section className="relative min-h-[95vh] flex items-center pt-24 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/90 to-transparent z-10" />
        <img 
          src="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&q=80&w=2000" 
          alt="Modern Construction Jobsite"
          className="w-full h-full object-cover"
          loading="eager"
        />
      </div>

      <div className="relative z-20 max-w-7xl mx-auto px-6 w-full grid lg:grid-cols-2 gap-12 items-center">
        <div className="text-white space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FACC15]/10 backdrop-blur-md border border-[#FACC15]/20">
            <ShieldCheck className="w-4 h-4 text-[#FACC15]" />
            <span className="text-[10px] font-black uppercase tracking-widest text-[#FACC15]">Licensed, Bonded & Insured</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-tight">
            Reliable Building & <br />
            <span className="text-[#FACC15]">Construction Services.</span>
          </h1>
          <p className="text-xl text-white/70 max-w-lg leading-relaxed font-medium">
            Setting the master standard in construction management. Delivering high-end residential and commercial excellence since 2012.
          </p>

          <div className="space-y-6">
            <div className="space-y-3">
              <label htmlFor="hero-zip" className="text-xs font-bold uppercase tracking-[0.2em] text-white/60 block">Enter your ZIP for a fast, no-obligation estimate</label>
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md">
                <div className="flex-1 relative">
                  <input 
                    id="hero-zip"
                    type="text" 
                    maxLength={5}
                    placeholder="ZIP Code" 
                    value={zip}
                    onChange={(e) => {
                      setZip(e.target.value.replace(/\D/g, ''));
                      if (error) setError(false);
                    }}
                    className={`w-full bg-white rounded-xl px-6 py-4 text-slate-900 font-bold placeholder:text-slate-900/40 focus:outline-none shadow-xl border-2 transition-all ${error ? 'border-red-500' : 'border-transparent focus:border-[#FACC15]'}`}
                  />
                  {error && <p className="absolute -bottom-6 left-0 text-red-400 text-[10px] font-bold uppercase">Invalid 5-digit ZIP</p>}
                </div>
                <button 
                  type="submit"
                  className="bg-[#FACC15] text-slate-900 px-8 py-4 rounded-xl font-black uppercase tracking-widest hover:bg-white transition-all shadow-xl flex items-center justify-center gap-2 group"
                >
                  Go <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>
              </form>
            </div>
            
            <div className="flex flex-wrap items-center gap-6 text-white/50 text-[10px] font-black uppercase tracking-widest">
               <div className="flex items-center gap-2">
                 <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                 Free Estimates
               </div>
               <div className="flex items-center gap-2">
                 <Clock className="w-4 h-4 text-[#FACC15]" />
                 24-Hour Response
               </div>
               <div className="flex items-center gap-2">
                 <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                 Highly Rated Service
               </div>
            </div>
          </div>
        </div>

        <div className="hidden lg:block justify-self-end">
          <div className="glass p-6 rounded-[2rem] w-96 shadow-2xl animate-bounce-slow">
            <div className="relative mb-4 aspect-video overflow-hidden rounded-xl">
              <video
  autoPlay
  muted
  loop
  playsInline
  preload="metadata"
  className="w-full h-full object-cover"
  poster="https://images.unsplash.com/photo-1590644365607-1c5a519a7a37?auto=format&fit=crop&q=80&w=800"
>
  <source src="/videos/jajd-hero.mp4" type="video/mp4" />
  Your browser does not support the video tag.
</video>

              <div className="absolute top-2 left-2 bg-[#FACC15] text-slate-900 text-[8px] font-black uppercase px-2 py-1 rounded">
                Live Build
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-[10px] font-bold text-[#FACC15] uppercase tracking-[0.2em]">Latest Update</p>
              <p className="text-white font-bold text-lg">Montana Home</p>
              <div className="w-full bg-white/10 h-1.5 rounded-full mt-1">
                <div className="bg-[#FACC15] h-full rounded-full w-3/4" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;