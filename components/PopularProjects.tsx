import React, { useState } from 'react';
import { ArrowRight, Sparkles, MessageSquare, CloudHail, ShieldCheck, FileCheck2, ChevronDown } from 'lucide-react';
import { POPULAR_PROJECTS, POPULAR_PROJECT_CATEGORIES } from '../constants';
import { PopularProject, PopularProjectCategory } from '../types';
import { analytics } from '../utils/analytics';

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80&w=600';

const STORM_PROJECT = POPULAR_PROJECTS.find((p) => p.name === 'Storm & Hail Damage Check');

// Phones show this many cards until the visitor asks for the rest. The others
// stay in the DOM (just hidden) so crawlers and desktop still see every job.
const MOBILE_PREVIEW = 6;

// Most-requested jobs first, so the short mobile preview is the useful part.
const ORDERED_PROJECTS = [...POPULAR_PROJECTS].sort(
  (a, b) => Number(b.popular ?? false) - Number(a.popular ?? false)
);

interface PopularProjectsProps {
  /** Opens the tailored estimate flow for a specific project. */
  onSelectProject: (project: PopularProject) => void;
  /** Opens the generic estimate flow ("something else"). */
  onOpenQuote: () => void;
}

const PopularProjects: React.FC<PopularProjectsProps> = ({ onSelectProject, onOpenQuote }) => {
  const [activeCategory, setActiveCategory] = useState<PopularProjectCategory | 'all'>('all');
  const [showAll, setShowAll] = useState(false);

  const visible =
    activeCategory === 'all'
      ? ORDERED_PROJECTS
      : ORDERED_PROJECTS.filter((p) => p.category === activeCategory);
  const collapsed = !showAll && visible.length > MOBILE_PREVIEW;

  const handleClick = (project: PopularProject) => {
    analytics.popularProjectClick(project.name, project.category);
    onSelectProject(project);
  };

  return (
    <section id="projects" className="py-14 md:py-24 bg-white dark:bg-slate-950 border-b border-stone-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section heading */}
        <div className="max-w-2xl mb-8 md:mb-10 space-y-3 md:space-y-4">
          <span className="text-brand-600 font-bold text-xs uppercase tracking-[0.2em]">Services &amp; typical prices</span>
          <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 dark:text-white leading-[1.1] tracking-tight">
            What do you need done?
          </h2>
          <p className="text-stone-600 dark:text-slate-400 text-base md:text-lg leading-relaxed">
            Tap a project for a quick estimate built for that job.
          </p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 pt-1 text-xs font-semibold text-stone-500 dark:text-slate-400">
            <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-brand-500" /> Licensed &amp; insured</span>
            <span className="flex items-center gap-1.5"><FileCheck2 className="w-4 h-4 text-brand-500" /> Free written estimates</span>
            <span className="flex items-center gap-1.5"><Sparkles className="w-4 h-4 text-brand-500" /> Omaha metro &amp; eastern Nebraska</span>
          </div>
        </div>

        {/* Storm-response feature band — the seasonal anchor for the section */}
        {STORM_PROJECT && (
          <div className="mb-8 md:mb-12 rounded-3xl bg-navy text-white overflow-hidden relative shadow-card-hover">
            <div className="absolute top-0 right-0 w-96 h-96 bg-brand-400/10 rounded-full blur-3xl -translate-y-1/3 translate-x-1/3" />
            <div className="relative z-10 p-6 md:p-10 flex flex-col md:flex-row md:items-center gap-5 md:gap-10">
              <div className="hidden md:flex shrink-0 w-14 h-14 rounded-2xl bg-brand-400 text-navy items-center justify-center">
                <CloudHail className="w-7 h-7" />
              </div>
              <div className="flex-1 space-y-2">
                <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-brand-400">
                  <CloudHail className="w-4 h-4 md:hidden" /> Nebraska storm season
                </span>
                <h3 className="text-xl md:text-3xl font-extrabold tracking-tight leading-tight">
                  Hail or wind damage? Get a free inspection.
                </h3>
                <p className="text-white/70 text-sm md:text-base leading-relaxed max-w-2xl">
                  We photograph the damage, tell you honestly if a claim is worth it, and
                  deal with your adjuster for you.
                </p>
              </div>
              <button
                onClick={() => handleClick(STORM_PROJECT)}
                className="shrink-0 inline-flex items-center justify-center gap-2 bg-brand-400 text-navy px-6 py-4 rounded-xl font-bold text-sm hover:bg-white transition-all shadow-lg active:scale-95"
              >
                Get a free storm inspection <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Category filter chips */}
        <div className="flex gap-2.5 mb-6 md:mb-8 overflow-x-auto pb-2 -mx-6 px-6 md:flex-wrap md:overflow-visible md:mx-0 md:px-0 md:pb-0">
          {POPULAR_PROJECT_CATEGORIES.map(({ key, label }) => {
            const isActive = activeCategory === key;
            return (
              <button
                key={key}
                onClick={() => { setActiveCategory(key); setShowAll(false); }}
                aria-pressed={isActive}
                className={`shrink-0 px-4 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all border ${
                  isActive
                    ? 'bg-navy text-white border-navy shadow-md dark:bg-brand-400 dark:text-navy dark:border-brand-400'
                    : 'bg-white text-stone-600 border-stone-200 hover:border-brand-400 hover:text-slate-900 dark:bg-slate-900 dark:text-slate-400 dark:border-slate-700 dark:hover:text-white'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>

        {/* Project cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5">
          {visible.map((project, index) => (
            <button
              key={project.name}
              onClick={() => handleClick(project)}
              className={`${collapsed && index >= MOBILE_PREVIEW ? 'hidden md:block' : ''} group text-left bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-stone-200 dark:border-slate-800 hover:border-brand-400 dark:hover:border-brand-400 hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-brand-400/60`}
            >
              <div className="h-28 sm:h-36 overflow-hidden relative">
                <img
                  src={project.image}
                  alt={`${project.name} in the Omaha metro by JAJD Construction`}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = FALLBACK_IMAGE;
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/30 to-transparent" />
                {project.popular && (
                  <span className="absolute top-2.5 left-2.5 inline-flex items-center gap-1 bg-brand-400 text-navy text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full shadow">
                    <Sparkles size={10} /> Popular
                  </span>
                )}
              </div>
              <div className="p-3.5 md:p-4 space-y-1">
                <h3 className="font-bold text-sm text-slate-900 dark:text-white leading-snug group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors min-h-[2.5rem]">
                  {project.name}
                </h3>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-stone-400 dark:text-slate-500 pt-1">
                  Typical range
                </p>
                <p className="text-sm font-extrabold text-slate-900 dark:text-white">{project.priceRange}</p>
                <span className="inline-flex items-center gap-1.5 text-brand-600 dark:text-brand-400 font-bold text-xs pt-1.5 group-hover:gap-2.5 transition-all">
                  Start estimate <ArrowRight size={12} />
                </span>
              </div>
            </button>
          ))}
        </div>

        {collapsed && (
          <button
            onClick={() => setShowAll(true)}
            className="md:hidden mt-4 w-full flex items-center justify-center gap-2 min-h-[48px] rounded-xl border-2 border-stone-200 dark:border-slate-700 text-sm font-bold text-slate-900 dark:text-white active:bg-stone-50"
          >
            Show all {visible.length} projects <ChevronDown className="w-4 h-4" />
          </button>
        )}

        {/* "Don't see your project" catch-all */}
        <div className="mt-6 md:mt-8 bg-stone-50 dark:bg-slate-900 border-2 border-dashed border-stone-300 dark:border-slate-700 rounded-2xl p-5 md:p-8 flex flex-col md:flex-row md:items-center gap-4 md:gap-8">
          <div className="flex-1 space-y-1.5">
            <h3 className="text-lg font-extrabold text-slate-900 dark:text-white tracking-tight">Don't see your project?</h3>
            <p className="text-stone-600 dark:text-slate-400 text-sm leading-relaxed">
              Paint, drywall, siding, shingles, or wood? We probably do it.
              (We don't do plumbing or electrical.)
            </p>
          </div>
          <button
            onClick={onOpenQuote}
            className="shrink-0 inline-flex items-center justify-center gap-2 bg-navy dark:bg-white text-white dark:text-navy px-6 py-4 rounded-xl font-bold text-sm hover:bg-brand-400 hover:text-navy dark:hover:bg-brand-400 transition-all shadow-md"
          >
            <MessageSquare size={16} /> Describe your project
          </button>
        </div>

        <p className="mt-5 text-xs text-stone-400 dark:text-slate-500 leading-relaxed max-w-3xl">
          Ranges are from recent Omaha-area jobs. Your free written estimate is the price that counts.
        </p>
      </div>
    </section>
  );
};

export default PopularProjects;
