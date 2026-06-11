import React, { useState } from 'react';
import { Star, ShieldCheck, ArrowRight, MapPin, Award, ThumbsUp, Search, Hammer, MessageSquare } from 'lucide-react';
import { useSiteSettings } from '../contexts/SiteSettingsContext';
import { SETTING_KEYS } from '../utils/siteSettings';
import { SMS_LINK } from '../config';
import { POPULAR_PROJECTS } from '../constants';
import { PopularProject } from '../types';
import { analytics } from '../utils/analytics';

const DEFAULT_HERO_BG =
  'https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&q=80&w=1800';

interface HeroProps {
  onOpenQuote: (zipCode?: string, project?: PopularProject) => void;
}

/** Type-ahead over the popular-project catalog for the to-do list search. */
const matchProjects = (query: string): PopularProject[] => {
  const q = query.toLowerCase().trim();
  if (q.length < 2) return [];
  return POPULAR_PROJECTS
    .filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.keywords.some((k) => k.includes(q) || q.includes(k))
    )
    .sort((a, b) => Number(b.popular ?? false) - Number(a.popular ?? false))
    .slice(0, 6);
};

const TRUST_CHIPS = [
  { icon: Award, label: 'BBB A+ Accredited', sub: 'Since 2014' },
  { icon: Star, label: '5-Star Rated', sub: 'Google & BBB Reviews' },
  { icon: ThumbsUp, label: 'Thumbtack Trusted', sub: 'Local Pro' },
];

const Hero: React.FC<HeroProps> = ({ onOpenQuote }) => {
  const [zip, setZip] = useState('');
  const [todo, setTodo] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const { get } = useSiteSettings();
  const heroBg = get(SETTING_KEYS.HERO_BACKGROUND, DEFAULT_HERO_BG);

  const suggestions = matchProjects(todo);
  const showSuggestions = searchFocused && todo.trim().length >= 2;

  const selectProject = (project: PopularProject) => {
    analytics.projectSearchSelect(project.name, todo);
    setTodo(project.name);
    setSearchFocused(false);
    onOpenQuote(zip, project);
  };

  return (
    <section id="home" className="relative min-h-[92vh] flex items-center pt-28 pb-16 overflow-hidden">
      {/* Background: a real neighborhood home. Admin can swap this to any project photo */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroBg}
          alt="A well-kept suburban home with fresh siding and paint in Omaha, Nebraska"
          className="w-full h-full object-cover"
          loading="eager"
          decoding="async"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-navy/95 via-navy/85 to-navy/50" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-navy/70 to-transparent" />
      </div>

      <div className="relative z-20 max-w-7xl mx-auto px-6 w-full grid lg:grid-cols-[1.15fr_0.85fr] gap-12 lg:gap-16 items-center">
        {/* Left text content */}
        <div className="text-white space-y-7 animate-fade-up">
          <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/15">
            <MapPin className="w-3.5 h-3.5 text-brand-400" />
            <span className="text-xs font-semibold tracking-wide text-white">Family-owned in Omaha, serving all of Nebraska</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.08]">
            Your neighborhood
            <br />
            <span className="text-brand-400">painting, siding &amp; roofing</span>
            <br />
            contractor.
          </h1>

          <p className="text-base md:text-xl text-white/85 max-w-xl leading-relaxed">
            Honest, careful work on the home you live in — from a single-room repaint
            to a full roof replacement. We show up on time, keep the site clean, and
            stand behind every job.
          </p>

          {/* Trust chips */}
          <div className="flex flex-wrap gap-3 pt-1">
            {TRUST_CHIPS.map(({ icon: Icon, label, sub }) => (
              <div key={label} className="flex items-center gap-3 bg-white/[0.07] px-4 py-2.5 rounded-xl border border-white/10 backdrop-blur-sm">
                 <Icon className="w-5 h-5 text-brand-400 shrink-0" />
                 <div>
                   <p className="font-semibold text-sm leading-tight">{label}</p>
                   <p className="text-[11px] text-white/55 leading-tight">{sub}</p>
                 </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 pt-1 text-sm text-white/70">
            <span className="flex items-center gap-1.5"><ShieldCheck size={16} className="text-brand-400 shrink-0" /> Licensed &amp; insured general contractor</span>
            <span className="hidden sm:block w-1 h-1 rounded-full bg-white/30" />
            <span className="flex items-center gap-1.5"><ShieldCheck size={16} className="text-brand-400 shrink-0 sm:hidden" /> Free, no-obligation estimates</span>
          </div>
        </div>

        {/* Right estimate card */}
        <div className="lg:justify-self-end w-full max-w-md animate-fade-up" style={{ animationDelay: '150ms' }}>
          <div className="bg-white dark:bg-slate-900 p-7 md:p-8 rounded-2xl shadow-card-hover relative overflow-hidden ring-1 ring-slate-900/5 dark:ring-white/10">
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-400/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

            <div className="relative z-10 space-y-5">
              <div>
                <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">Get your free estimate</h2>
                <p className="text-stone-500 dark:text-slate-400 text-sm mt-1.5">Tell us where the project is and we'll take it from there. No obligation, ever.</p>
              </div>

              <div className="space-y-4">
                <div className="space-y-1.5 relative">
                   <label htmlFor="hero-todo" className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-slate-400">What's on your to-do list?</label>
                   <div className="relative">
                     <input
                        id="hero-todo"
                        type="text"
                        autoComplete="off"
                        placeholder={'Try "paint my living room" or "roof leak"'}
                        className="w-full bg-stone-50 dark:bg-slate-800 border-2 border-stone-200 dark:border-slate-700 rounded-xl pl-11 pr-4 py-3.5 font-semibold text-sm focus:outline-none focus:border-brand-400 transition-all text-slate-900 dark:text-white placeholder-slate-400"
                        value={todo}
                        onChange={(e) => setTodo(e.target.value)}
                        onFocus={() => setSearchFocused(true)}
                        onBlur={() => setTimeout(() => setSearchFocused(false), 150)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            if (suggestions.length > 0) selectProject(suggestions[0]);
                            else onOpenQuote(zip);
                          }
                        }}
                        role="combobox"
                        aria-expanded={showSuggestions}
                        aria-controls="hero-todo-suggestions"
                     />
                     <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                   </div>

                   {showSuggestions && (
                     <ul
                       id="hero-todo-suggestions"
                       role="listbox"
                       className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-800 rounded-xl shadow-card-hover ring-1 ring-slate-900/10 dark:ring-white/10 overflow-hidden z-30 divide-y divide-stone-100 dark:divide-slate-700"
                     >
                       {suggestions.map((p) => (
                         <li key={p.name} role="option" aria-selected={false}>
                           <button
                             type="button"
                             // mousedown fires before the input blur hides the list
                             onMouseDown={(e) => { e.preventDefault(); selectProject(p); }}
                             className="w-full text-left px-4 py-3 hover:bg-stone-50 dark:hover:bg-slate-700 transition-colors flex items-center justify-between gap-3"
                           >
                             <span className="text-sm font-semibold text-slate-900 dark:text-white">{p.name}</span>
                             <span className="text-xs font-bold text-stone-400 dark:text-slate-400 shrink-0">{p.priceRange}</span>
                           </button>
                         </li>
                       ))}
                       <li>
                         <button
                           type="button"
                           onMouseDown={(e) => { e.preventDefault(); setSearchFocused(false); onOpenQuote(zip); }}
                           className="w-full text-left px-4 py-3 hover:bg-stone-50 dark:hover:bg-slate-700 transition-colors flex items-center gap-2.5 text-brand-600 dark:text-brand-400"
                         >
                           <Hammer size={14} />
                           <span className="text-sm font-bold">Something else? Describe it to us</span>
                         </button>
                       </li>
                     </ul>
                   )}
                </div>

                <div className="space-y-1.5">
                   <label htmlFor="hero-zip" className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-slate-400">Property ZIP code</label>
                   <input
                      id="hero-zip"
                      type="text"
                      inputMode="numeric"
                      maxLength={5}
                      placeholder="e.g. 68102"
                      className="w-full bg-stone-50 dark:bg-slate-800 border-2 border-stone-200 dark:border-slate-700 rounded-xl px-4 py-3.5 font-bold text-lg focus:outline-none focus:border-brand-400 transition-all text-slate-900 dark:text-white placeholder-slate-300"
                      value={zip}
                      onChange={(e) => setZip(e.target.value.replace(/\D/g, ''))}
                      onKeyDown={(e) => { if (e.key === 'Enter') onOpenQuote(zip); }}
                   />
                </div>

                <button
                  onClick={() => onOpenQuote(zip)}
                  className="w-full bg-brand-400 text-navy py-4 rounded-xl font-bold hover:bg-navy hover:text-white dark:hover:bg-white dark:hover:text-navy transition-all shadow-lg flex items-center justify-center gap-2"
                >
                  Start My Free Estimate <ArrowRight className="w-4 h-4" />
                </button>

                <a
                  href={SMS_LINK}
                  onClick={() => analytics.textClick('hero_card')}
                  className="flex items-center justify-center gap-2 text-sm font-semibold text-stone-500 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 transition-colors py-1"
                >
                  <MessageSquare className="w-4 h-4" />
                  Prefer texting? Text us a photo of your project
                </a>

                <div className="flex items-start gap-2.5 pt-1">
                   <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                   <p className="text-xs text-stone-500 dark:text-slate-300 leading-relaxed">
                     We respond within 24 hours and never share your information with third parties.
                   </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
