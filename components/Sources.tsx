import React from 'react';
import { ShieldCheck, Award, FileText, CheckCircle2 } from 'lucide-react';

const Sources: React.FC = () => {
  return (
    <section id="sources" className="py-24 bg-slate-50 border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center space-y-4 mb-16">
          <span className="text-[#FACC15] font-bold text-xs uppercase tracking-[0.3em]">Credibility & Transparency</span>
          <h2 className="text-4xl md:text-5xl font-black text-slate-900">Industry Sources</h2>
          <div className="w-24 h-1.5 bg-[#FACC15] mx-auto" />
          <p className="text-slate-500 max-w-xl mx-auto mt-6 font-medium">
            We maintain the highest standards of professional conduct and regulatory compliance.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* BBB Accreditation */}
          <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col items-center text-center space-y-6">
            <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center">
              <Award className="w-8 h-8 text-blue-600" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-slate-900">BBB Accredited</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                A+ Rating since 2014. Committed to the Better Business Bureau's Standards for Trust.
              </p>
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-blue-600/50">Verified Member</span>
          </div>

          {/* Licensing & Insurance */}
          <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col items-center text-center space-y-6">
            <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center">
              <ShieldCheck className="w-8 h-8 text-emerald-600" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-slate-900">Licensed & Insured</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                Full General Liability and Workers' Compensation insurance coverage for every job site.
              </p>
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600/50">Policy #JAJD-99201</span>
          </div>

          {/* Industry References */}
          <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col items-center text-center space-y-6">
            <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center">
              <FileText className="w-8 h-8 text-amber-600" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-slate-900">Material Integrity</h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                We utilize only materials that meet or exceed OSHA and ASTM International building standards.
              </p>
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-amber-600/50">Quality Sourced</span>
          </div>
        </div>

        <div className="mt-16 p-8 bg-slate-900 rounded-[2.5rem] text-white">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-2">
              <h4 className="text-lg font-bold">Safety & Compliance References</h4>
              <p className="text-white/50 text-sm">All claims regarding project timelines and satisfaction rates are verified through third-party auditing.</p>
            </div>
            <div className="flex gap-4">
              <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/10 text-[10px] font-bold uppercase tracking-widest">
                <CheckCircle2 className="w-4 h-4 text-[#FACC15]" /> OSHA-30 Certified
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/10 text-[10px] font-bold uppercase tracking-widest">
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