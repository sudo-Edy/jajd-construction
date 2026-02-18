import React, { useEffect, useState } from 'react';
import { supabase } from '../utils/supabase';
import { Service } from '../types';
import { ChevronRight, Loader2 } from 'lucide-react';

interface ServicesProps {
  onOpenQuote: () => void;
}

const Services: React.FC<ServicesProps> = ({ onOpenQuote }) => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) throw error;
      setServices(data || []);
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="services" className="py-24 bg-slate-900 text-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#FACC15]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div className="space-y-2">
            <span className="text-[#FACC15] font-bold text-xs uppercase tracking-[0.2em]">Our Specializations</span>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">Services We Offer</h2>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-48">
            <Loader2 className="w-10 h-10 text-[#FACC15] animate-spin" />
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <div key={service.id} className="group relative overflow-hidden rounded-lg bg-white/5 border border-white/10 hover:border-[#FACC15]/30 hover:bg-white/10 transition-all duration-300">
                <div className="h-40 overflow-hidden relative">
                  <img 
                    src={service.image_url} 
                    alt={service.title}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-80" />
                </div>
                <div className="p-5 space-y-3">
                  <h3 className="text-lg font-bold leading-tight">{service.title}</h3>
                  <p className="text-white/60 text-xs leading-relaxed line-clamp-2">{service.description}</p>
                  <button 
                    onClick={onOpenQuote}
                    className="flex items-center gap-2 text-[#FACC15] font-bold text-[10px] uppercase tracking-wider group-hover:gap-3 transition-all pt-1"
                  >
                    Estimate <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Services;
