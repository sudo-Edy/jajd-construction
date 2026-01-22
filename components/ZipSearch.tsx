import React, { useState } from 'react';
import { MapPin, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';
import { isValidZip } from '../utils/validation';

interface ZipSearchProps {
  onOpenQuote: (zip: string) => void;
}

const ZipSearch: React.FC<ZipSearchProps> = ({ onOpenQuote }) => {
  const [zip, setZip] = useState('');
  const [error, setError] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (isValidZip(zip)) {
      setError(false);
      onOpenQuote(zip);
    } else {
      setError(true);
    }
  };

  return (
    <section id="service-area" className="py-24 bg-slate-50 relative border-y border-slate-100">
      <div className="max-w-7xl mx-auto px-6">
        <div className="bg-white rounded-[4rem] p-12 md:p-20 shadow-2xl border border-slate-100 grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-3 text-[#FACC15] bg-[#FACC15]/5 px-4 py-2 rounded-full border border-[#FACC15]/10">
              <MapPin className="w-5 h-5" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em]">Locate a Crew</span>
            </div>
            <h2 className="text-5xl font-black text-slate-900 leading-tight">Find Your Regional JAJD Team.</h2>
            <p className="text-slate-500 text-lg leading-relaxed font-medium">
              We operate master construction crews across key metropolitan centers. Search your zip code to connect with a locally dedicated project lead.
            </p>
          </div>

          <div className="space-y-8">
            <form onSubmit={handleSearch} className="relative group">
              <input
                type="text"
                maxLength={5}
                value={zip}
                onChange={(e) => {
                  setZip(e.target.value.replace(/\D/g, ''));
                  if (error) setError(false);
                }}
                placeholder="Enter Zip Code (e.g. 10001)"
                className={`w-full bg-slate-50 border-4 rounded-[2.5rem] px-10 py-7 text-slate-900 placeholder:text-slate-900/20 focus:outline-none transition-all text-2xl font-black shadow-inner ${error ? 'border-red-500' : 'border-slate-100 focus:border-[#FACC15]'}`}
              />
              <button
                type="submit"
                className="absolute right-4 top-4 bottom-4 bg-slate-900 text-white px-12 rounded-[2rem] font-black uppercase tracking-widest hover:bg-[#FACC15] hover:text-slate-900 transition-all flex items-center gap-3 shadow-lg text-xs"
              >
                Find Team <ArrowRight className="w-4 h-4" />
              </button>
              {error && <p className="absolute -bottom-6 left-10 text-red-500 text-[10px] font-bold uppercase tracking-widest">Valid 5-digit US ZIP required</p>}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ZipSearch;