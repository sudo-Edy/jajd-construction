
import React from 'react';
import { Award, Target, Users, Construction } from 'lucide-react';

const About: React.FC = () => {
  return (
    <section id="about us" className="py-24 bg-white relative overflow-hidden border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <div className="relative">
            <div className="absolute inset-0 bg-[#FACC15] -rotate-2 rounded-lg -z-10 translate-x-2 translate-y-2 opacity-50" />
            <img 
              src="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&q=80&w=800" 
              className="rounded-lg shadow-2xl grayscale hover:grayscale-0 transition-all duration-700"
              alt="JAJD Construction Crew"
            />
            <div className="absolute -bottom-6 -right-6 bg-slate-900 text-white p-8 rounded-lg shadow-2xl hidden md:block border border-slate-800">
              <p className="text-4xl font-extrabold text-[#FACC15]">10+</p>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-80 mt-1">Years of Excellence</p>
            </div>
          </div>
          
          <div className="space-y-10">
            <div className="space-y-6">
              <span className="text-[#CA8A04] font-bold text-xs uppercase tracking-[0.2em]">Our Foundation</span>
              <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 leading-tight tracking-tight">Master Craftsmanship. Built on Integrity.</h2>
              <p className="text-slate-600 text-lg leading-relaxed font-medium">
                JAJD Construction was founded on the principles of precision engineering and transparent client partnerships. From modest residential renovations to complex commercial infrastructures, we bring a "measure twice, cut once" philosophy to every project.
              </p>
            </div>

            <div className="grid sm:grid-cols-3 gap-6">
              <div className="space-y-3 p-4 border border-slate-100 rounded-md hover:border-[#FACC15]/30 transition-colors group">
                <div className="w-10 h-10 bg-slate-50 rounded-md flex items-center justify-center group-hover:bg-[#FACC15] transition-colors border border-slate-100">
                  <Award className="w-5 h-5 text-slate-700 group-hover:text-slate-900" />
                </div>
                <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wide">Licensed & Insured</h4>
              </div>
              <div className="space-y-3 p-4 border border-slate-100 rounded-md hover:border-[#FACC15]/30 transition-colors group">
                <div className="w-10 h-10 bg-slate-50 rounded-md flex items-center justify-center group-hover:bg-[#FACC15] transition-colors border border-slate-100">
                  <Target className="w-5 h-5 text-slate-700 group-hover:text-slate-900" />
                </div>
                <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wide">Warranty Backed</h4>
              </div>
              <div className="space-y-3 p-4 border border-slate-100 rounded-md hover:border-[#FACC15]/30 transition-colors group">
                <div className="w-10 h-10 bg-slate-50 rounded-md flex items-center justify-center group-hover:bg-[#FACC15] transition-colors border border-slate-100">
                  <Construction className="w-5 h-5 text-slate-700 group-hover:text-slate-900" />
                </div>
                <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wide">Elite Standards</h4>
              </div>
            </div>

            <button className="bg-slate-900 text-white px-8 py-4 rounded-md font-bold uppercase tracking-wider hover:bg-[#FACC15] hover:text-slate-900 transition-all shadow-lg text-sm active:scale-95">
              Meet the JAJD Team
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
