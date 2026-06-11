import React from 'react';
import { ShieldCheck, Award, ThumbsUp, MapPin } from 'lucide-react';

const TRUST_CARDS = [
  {
    icon: Award,
    iconBg: 'bg-blue-50 border-blue-100',
    iconColor: 'text-blue-600',
    hoverBg: 'group-hover:bg-blue-600',
    title: 'BBB A+ Accredited',
    text: "Accredited by the Better Business Bureau since 2014 with an A+ rating. Our record is public, and it speaks for itself.",
    badge: 'Verified Member',
    badgeStyle: 'text-blue-600/70 bg-blue-50',
  },
  {
    icon: ShieldCheck,
    iconBg: 'bg-emerald-50 border-emerald-100',
    iconColor: 'text-emerald-600',
    hoverBg: 'group-hover:bg-emerald-600',
    title: 'Licensed & Insured',
    text: "Full general liability and workers' compensation coverage on every job site, residential or commercial.",
    badge: 'Every Job, Every Time',
    badgeStyle: 'text-emerald-600/70 bg-emerald-50',
  },
  {
    icon: ThumbsUp,
    iconBg: 'bg-amber-50 border-amber-100',
    iconColor: 'text-amber-600',
    hoverBg: 'group-hover:bg-amber-600',
    title: 'Trusted on Thumbtack',
    text: 'Homeowners find us on Thumbtack, Google, and the BBB. The reviews say the same thing everywhere: responsive, careful, honest.',
    badge: 'Local Pro',
    badgeStyle: 'text-amber-600/70 bg-amber-50',
  },
];

const Sources: React.FC = () => {
  return (
    <section id="sources" className="py-24 bg-stone-50 border-y border-stone-200">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center space-y-4 mb-14">
          <span className="text-brand-600 font-bold text-xs uppercase tracking-[0.2em]">Why people trust us</span>
          <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight">A track record you can verify</h2>
          <p className="text-stone-600 max-w-xl mx-auto mt-4 text-lg">
            A contractor is only as good as their reputation. Ours is public, verified, and ten years strong.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {TRUST_CARDS.map(({ icon: Icon, iconBg, iconColor, hoverBg, title, text, badge, badgeStyle }) => (
            <div key={title} className="bg-white p-8 rounded-2xl border border-stone-200 shadow-card flex flex-col items-center text-center space-y-5 hover:shadow-card-hover transition-all duration-300 group">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border transition-colors ${iconBg} ${hoverBg}`}>
                <Icon className={`w-7 h-7 transition-colors ${iconColor} group-hover:text-white`} />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-slate-900">{title}</h3>
                <p className="text-stone-500 text-sm leading-relaxed">{text}</p>
              </div>
              <span className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full ${badgeStyle}`}>{badge}</span>
            </div>
          ))}
        </div>

        <div className="mt-12 p-8 md:p-10 bg-navy rounded-3xl text-white shadow-2xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-1.5 text-center md:text-left">
              <h3 className="text-lg font-bold text-white">Local, family-owned, and here to stay.</h3>
              <p className="text-white/60 text-sm">Based in Omaha and working across Nebraska. When you call, you talk to the people doing the work.</p>
            </div>
            <div className="flex items-center gap-2 px-5 py-3 bg-white/5 rounded-xl border border-white/10 text-xs font-bold uppercase tracking-widest whitespace-nowrap">
              <MapPin className="w-4 h-4 text-brand-400" /> Omaha, Nebraska
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Sources;
