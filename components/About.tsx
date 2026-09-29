import React from 'react';
import { Award, ShieldCheck, Heart } from 'lucide-react';
import { useSiteSettings } from '../contexts/SiteSettingsContext';
import { SETTING_KEYS } from '../utils/siteSettings';

const DEFAULT_ABOUT_IMAGE =
  'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80&w=900';

const PILLARS = [
  {
    icon: Award,
    title: 'BBB A+ Accredited',
    text: 'Accredited since 2014. Our record is public.',
  },
  {
    icon: ShieldCheck,
    title: 'Licensed & Insured',
    text: 'Liability and workers’ comp on every job.',
  },
  {
    icon: Heart,
    title: 'Family-Owned & Local',
    text: 'When you call, you talk to the people doing the work.',
  },
];

const About: React.FC = () => {
  const { get } = useSiteSettings();
  const aboutImage = get(SETTING_KEYS.ABOUT_IMAGE, DEFAULT_ABOUT_IMAGE);

  return (
    <section id="about" className="py-14 md:py-24 bg-white relative overflow-hidden border-b border-stone-100">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-20 items-center">
          {/* Image side */}
          <div className="relative order-2 lg:order-1 mx-2 lg:mx-0">
            <div className="absolute -inset-3 bg-brand-400/20 rounded-3xl -rotate-2" />
            <img
              src={aboutImage}
              className="rounded-2xl shadow-card-hover relative z-10 aspect-[4/3] object-cover"
              alt="A JAJD Construction painter carefully finishing an interior wall"
              loading="lazy"
            />
            <div className="absolute -bottom-5 -right-2 md:-right-6 bg-navy text-white px-5 py-4 md:px-7 md:py-5 rounded-2xl shadow-2xl z-20 border border-slate-800">
              <p className="text-3xl md:text-4xl font-extrabold text-brand-400">10+</p>
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] opacity-80 mt-1">Years serving Nebraska</p>
            </div>
          </div>

          {/* Text side */}
          <div className="space-y-6 md:space-y-9 order-1 lg:order-2">
            <div className="space-y-4 md:space-y-5">
              <span className="text-brand-600 font-bold text-xs uppercase tracking-[0.2em]">About JAJD</span>
              <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 leading-tight tracking-tight">
                The contractor your neighbors already trust.
              </h2>
              <p className="text-stone-600 text-base md:text-lg leading-relaxed">
                A family-owned Omaha crew, built on small jobs done well. Ten years later we
                still show up on time, treat your home like ours, and leave it cleaner than
                we found it.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
              {PILLARS.map(({ icon: Icon, title, text }) => (
                <div key={title} className="flex sm:block items-center gap-3.5 sm:space-y-3 p-4 md:p-5 bg-stone-50 border border-stone-100 rounded-2xl hover:border-brand-400/50 hover:bg-brand-50/50 transition-colors">
                  <div className="shrink-0 w-10 h-10 bg-white rounded-xl flex items-center justify-center border border-stone-200 shadow-sm">
                    <Icon className="w-5 h-5 text-brand-600" />
                  </div>
                  <div className="space-y-0.5 sm:space-y-3">
                    <h3 className="font-bold text-slate-900 text-sm leading-snug">{title}</h3>
                    <p className="text-stone-500 text-xs leading-relaxed">{text}</p>
                  </div>

                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
