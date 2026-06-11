import React from 'react';
import { ArrowRight, BookOpen } from 'lucide-react';
import { recentPosts } from '../blog';

/**
 * Homepage teaser for the Journal. Cards link to the statically-generated
 * /blog/<slug>/ pages — internal links that pass authority to the SEO content
 * and give visitors genuinely useful local guides.
 */
const Journal: React.FC = () => {
  const posts = recentPosts(3);
  if (posts.length === 0) return null;

  return (
    <section id="journal" className="py-24 bg-white dark:bg-slate-950 border-b border-stone-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
          <div className="max-w-2xl space-y-4">
            <span className="text-brand-600 font-bold text-xs uppercase tracking-[0.2em]">From the journal</span>
            <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 dark:text-white leading-tight tracking-tight">
              Honest advice for Omaha homeowners
            </h2>
            <p className="text-stone-600 dark:text-slate-400 text-lg leading-relaxed">
              Real costs, straight answers, and local know-how on painting, siding, roofing,
              and storm damage in Nebraska — written by the crew that does the work.
            </p>
          </div>
          <a
            href="/blog/"
            className="shrink-0 inline-flex items-center gap-2 text-navy dark:text-white font-bold text-sm border-2 border-stone-200 dark:border-slate-700 hover:border-brand-400 rounded-xl px-5 py-3.5 transition-all"
          >
            <BookOpen className="w-4 h-4 text-brand-600" /> Read all articles
          </a>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <a
              key={post.slug}
              href={`/blog/${post.slug}/`}
              className="group bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-stone-200 dark:border-slate-800 hover:border-brand-400 dark:hover:border-brand-400 hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-300"
            >
              <div className="h-44 overflow-hidden">
                <img
                  src={post.image}
                  alt={post.imageAlt}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="p-6 space-y-3">
                <span className="inline-block text-[11px] font-bold uppercase tracking-wider text-brand-600 bg-brand-50 dark:bg-brand-400/10 px-2.5 py-1 rounded-full">
                  {post.category}
                </span>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-snug group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                  {post.title}
                </h3>
                <p className="text-stone-600 dark:text-slate-400 text-sm leading-relaxed line-clamp-3">{post.excerpt}</p>
                <span className="inline-flex items-center gap-1.5 text-brand-600 dark:text-brand-400 font-bold text-xs pt-1 group-hover:gap-2.5 transition-all">
                  Read more <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Journal;
