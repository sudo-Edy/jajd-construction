import React from 'react';
import { ShieldCheck, Award, FileText, CheckCircle2 } from 'lucide-react';

const Sources: React.FC = () => {
  return (
    <section id="sources" className="py-24 bg-slate-50 border-y border-slate-200">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center space-y-4 mb-16">
          <span className="text-[#FACC15] font-bold text-xs uppercase tracking-[0.2em]">Credibility & Transparency</span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">Industry Sources</h2>
          <p className="text-slate-600 max-w-xl mx-auto mt-6 font-medium text-lg">
            We maintain the highest standards of professional conduct and regulatory compliance.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* BBB Accreditation */}
          <div className="bg-white p-8 rounded-lg border border-slate-200 shadow-sm flex flex-col items-center text-center space-y-6 hover:shadow-xl transition-all duration-300 group hover:border-[#FACC15]/30">
            <div className="w-14 h-14 bg-blue-50 rounded-md flex items-center justify-center border border-blue-100 group-hover:bg-blue-600 transition-colors">
              <Award className="w-7 h-7 text-blue-600 group-hover:text-white transition-colors" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-slate-900">BBB Accredited</h3>
              <p className="text-slate-500 text-sm leading-relaxed font-medium">
                A+ Rating since 2014. Committed to the Better Business Bureau's Standards for Trust.
              </p>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-blue-600/70 bg-blue-50 px-3 py-1 rounded-full">Verified Member</span>
          </div>

          {/* Licensing & Insurance */}
          <div className="bg-white p-8 rounded-lg border border-slate-200 shadow-sm flex flex-col items-center text-center space-y-6 hover:shadow-xl transition-all duration-300 group hover:border-[#FACC15]/30">
            <div className="w-14 h-14 bg-emerald-50 rounded-md flex items-center justify-center border border-emerald-100 group-hover:bg-emerald-600 transition-colors">
              <ShieldCheck className="w-7 h-7 text-emerald-600 group-hover:text-white transition-colors" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-slate-900">Licensed & Insured</h3>
              <p className="text-slate-500 text-sm leading-relaxed font-medium">
                Full General Liability and Workers' Compensation insurance coverage for every job site.
              </p>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-600/70 bg-emerald-50 px-3 py-1 rounded-full">Policy #JAJD-99201</span>
          </div>

          {/* Industry References */}
          <div className="bg-white p-8 rounded-lg border border-slate-200 shadow-sm flex flex-col items-center text-center space-y-6 hover:shadow-xl transition-all duration-300 group hover:border-[#FACC15]/30">
            <div className="w-14 h-14 bg-amber-50 rounded-md flex items-center justify-center border border-amber-100 group-hover:bg-amber-600 transition-colors">
              <FileText className="w-7 h-7 text-amber-600 group-hover:text-white transition-colors" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-slate-900">Material Integrity</h3>
              <p className="text-slate-500 text-sm leading-relaxed font-medium">
                We utilize only materials that meet or exceed OSHA and ASTM International building standards.
              </p>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-amber-600/70 bg-amber-50 px-3 py-1 rounded-full">Quality Sourced</span>
          </div>
        </div>

        <div className="mt-16 p-10 bg-slate-900 rounded-lg text-white shadow-2xl border border-slate-800">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-2 text-center md:text-left">
              <h4 className="text-lg font-bold text-white">Safety & Compliance References</h4>
              <p className="text-white/60 text-sm font-medium">All claims regarding project timelines and satisfaction rates are verified through third-party auditing.</p>
            </div>
            <div className="flex flex-wrap justify-center gap-4">
              <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-md border border-white/10 text-[10px] font-bold uppercase tracking-widest hover:bg-white/10 transition-colors cursor-default">
                <CheckCircle2 className="w-4 h-4 text-[#FACC15]" /> OSHA-30 Certified
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-md border border-white/10 text-[10px] font-bold uppercase tracking-widest hover:bg-white/10 transition-colors cursor-default">
                <CheckCircle2 className="w-4 h-4 text-[#FACC15]" /> EPA Lead-Safe
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Sources;
