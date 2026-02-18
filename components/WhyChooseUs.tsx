import React from 'react';
import { ClipboardCheck, Clock, ShieldCheck, UserCheck } from 'lucide-react';

const WhyChooseUs = () => {
  const reasons = [
    {
      icon: ClipboardCheck,
      title: "Detailed Proposals",
      description: "No hidden fees. We provide a comprehensive written proposal detailing every aspect of your project."
    },
    {
      icon: Clock,
      title: "On-Time Completion",
      description: "We respect your time. Our schedules are fixed, and we update you daily on our progress."
    },
    {
      icon: UserCheck,
      title: "Supervisor on Every Job",
      description: "A dedicated project manager oversees quality control, ensuring the JAJD standard is met."
    },
    {
      icon: ShieldCheck,
      title: "Licensed & Insured",
      description: "Full liability coverage and verified licensure for your total peace of mind."
    }
  ];

  return (
    <section className="py-24 bg-slate-50 border-y border-slate-200">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-[#FACC15] font-bold text-xs uppercase tracking-[0.2em]">The JAJD Difference</span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 leading-tight tracking-tight">
            Certainty in Every <br />
            <span className="text-slate-400">Brushstroke & Build.</span>
          </h2>
          <p className="text-slate-600 font-medium text-lg leading-relaxed">
            We don't just build and paint; we deliver a worry-free experience. Here is why Omaha homeowners trust us with their biggest assets.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {reasons.map((item, idx) => (
            <div key={idx} className="p-8 rounded-lg bg-white hover:shadow-xl transition-all duration-300 border border-slate-200 hover:border-[#FACC15]/30 group">
              <div className="w-12 h-12 bg-slate-50 rounded-md flex items-center justify-center shadow-sm mb-6 group-hover:bg-[#FACC15] transition-colors border border-slate-100">
                <item.icon className="w-6 h-6 text-slate-700 group-hover:text-slate-900 transition-colors" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-3">{item.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed font-medium">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
