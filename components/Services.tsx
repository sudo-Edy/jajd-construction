import React from 'react';
import { SERVICES } from '../data/siteData';
import { ChevronRight } from 'lucide-react';

interface ServicesProps {
  onOpenQuote: () => void;
}

const Services: React.FC<ServicesProps> = ({ onOpenQuote }) => {
  return (
    <section id="services" className="py-24 bg-slate-900 text-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#FACC15]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div className="space-y-4">
            <span className="text-[#FACC15] font-bold text-xs uppercase tracking-[0.3em]">Our Specializations</span>
            <h2 className="text-4xl md:text-5xl font-black">Services We Offer</h2>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {SERVICES.map((service, index) => (
            <div key={index} className="group relative overflow-hidden rounded-[2rem] bg-white/5 border border-white/10 hover:border-[#FACC15]/30 transition-all duration-500">
              <div className="h-64 overflow-hidden relative">
                <img 
                  src={service.image} 
                  alt={service.title}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent opacity-60" />
              </div>
              <div className="p-8 space-y-6">
                <h3 className="text-2xl font-bold">{service.title}</h3>
                <p className="text-white/60 text-sm leading-relaxed">{service.description}</p>
                <button 
                  onClick={onOpenQuote}
                  className="flex items-center gap-2 text-[#FACC15] font-bold text-xs uppercase tracking-widest group-hover:gap-4 transition-all pt-4"
                >
                  Request Estimate <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;