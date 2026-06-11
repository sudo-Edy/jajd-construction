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
    text: 'Accredited since 2014 and committed to the Better Business Bureau Standards for Trust.',
  },
  {
    icon: ShieldCheck,
    title: 'Licensed & Insured',
    text: 'Full general liability and workers’ compensation coverage on every single job site.',
  },
  {
    icon: Heart,
    title: 'Family-Owned & Local',
    text: 'We live here too. Your neighbors are our references, and our reputation is everything.',
  },
];

const About: React.FC = () => {
  const { get } = useSiteSettings();
  const aboutImage = get(SETTING_KEYS.ABOUT_IMAGE, DEFAULT_ABOUT_IMAGE);

  return (
    <section id="about" className="py-24 bg-white relative overflow-hidden border-b border-stone-100">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-14 lg:gap-20 items-center">
          {/* Image side */}
          <div className="relative">
            <div className="absolute -inset-3 bg-brand-400/20 rounded-3xl -rotate-2" />
            <img
              src={aboutImage}
              className="rounded-2xl shadow-card-hover relative z-10 aspect-[4/3] object-cover"
              alt="A JAJD Construction painter carefully finishing an interior wall"
              loading="lazy"
            />
            <div className="absolute -bottom-6 -right-4 md:-right-6 bg-navy text-white px-7 py-5 rounded-2xl shadow-2xl z-20 border border-slate-800">
              <p className="text-3xl md:text-4xl font-extrabold text-brand-400">10+</p>
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] opacity-80 mt-1">Years serving Nebraska</p>
            </div>
          </div>

          {/* Text side */}
          <div className="space-y-9">
            <div className="space-y-5">
              <span className="text-brand-600 font-bold text-xs uppercase tracking-[0.2em]">About JAJD</span>
              <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 leading-tight tracking-tight">
                The contractor your neighbors already trust.
              </h2>
              <p className="text-stone-600 text-base md:text-lg leading-relaxed">
                JAJD Construction is a family-owned contractor based in Omaha. We built this
                company on small jobs done well — a bedroom repaint, a siding repair, a roof
                that just needed honest attention.
              </p>
              <p className="text-stone-600 text-base md:text-lg leading-relaxed">
                Ten years later, that's still how we work: show up on time, protect your home
                like it's ours, and leave the site cleaner than we found it. Across Nebraska,
                homeowners call us back because every project — big or small — gets treated
                like it matters. Because it does.
              </p>
            </div>

            <div className="grid sm:grid-cols-3 gap-4">
              {PILLARS.map(({ icon: Icon, title, text }) => (
                <div key={title} className="space-y-3 p-5 bg-stone-50 border border-stone-100 rounded-2xl hover:border-brand-400/50 hover:bg-brand-50/50 transition-colors">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center border border-stone-200 shadow-sm">
                    <Icon className="w-5 h-5 text-brand-600" />
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm leading-snug">{title}</h3>
                  <p className="text-stone-500 text-xs leading-relaxed">{text}</p>
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
