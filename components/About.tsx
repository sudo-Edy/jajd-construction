
import React from 'react';
import { Award, Target, Users, Construction } from 'lucide-react';

const About: React.FC = () => {
  return (
    <section id="about us" className="py-24 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <div className="relative">
            <div className="absolute inset-0 bg-[#FACC15]/10 -rotate-3 rounded-[3rem] -z-10" />
            <img 
              src="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&q=80&w=800" 
              className="rounded-[3rem] shadow-2xl grayscale hover:grayscale-0 transition-all duration-700"
              alt="JAJD Construction Crew"
            />
            <div className="absolute -bottom-10 -right-10 bg-navy text-white p-8 rounded-3xl shadow-2xl hidden md:block border-b-4 border-[#FACC15]">
              <p className="text-5xl font-black text-[#FACC15]">10+</p>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-60">Years of Master Building</p>
            </div>
          </div>
          
          <div className="space-y-10">
            <div className="space-y-6">
              <span className="text-[#FACC15] font-bold text-xs uppercase tracking-[0.3em]">Our Foundation</span>
              <h2 className="text-4xl md:text-5xl font-black text-navy leading-tight">Master Craftsmanship. Built on Integrity.</h2>
              <p className="text-gray-500 text-lg leading-relaxed font-medium">
                JAJD Construction was founded on the principles of precision engineering and transparent client partnerships. From modest residential renovations to complex commercial infrastructures, we bring a "measure twice, cut once" philosophy to every project.
              </p>
            </div>

            <div className="grid sm:grid-cols-3 gap-8">
              <div className="space-y-3">
                <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center">
                  <Award className="w-6 h-6 text-[#FACC15]" />
                </div>
                <h4 className="font-bold text-navy text-sm uppercase tracking-wide">Licensed & Insured</h4>
              </div>
              <div className="space-y-3">
                <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center">
                  <Target className="w-6 h-6 text-[#FACC15]" />
                </div>
                <h4 className="font-bold text-navy text-sm uppercase tracking-wide">Warranty Backed</h4>
              </div>
              <div className="space-y-3">
                <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center">
                  <Construction className="w-6 h-6 text-[#FACC15]" />
                </div>
                <h4 className="font-bold text-navy text-sm uppercase tracking-wide">Elite Standards</h4>
              </div>
            </div>

            <button className="bg-navy text-white px-10 py-4 rounded-xl font-black uppercase tracking-widest hover:bg-[#FACC15] hover:text-navy transition-all shadow-xl">
              Meet the JAJD Team
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
