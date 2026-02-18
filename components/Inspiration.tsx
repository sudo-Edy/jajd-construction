
import React from 'react';
import { BLOG_POSTS } from '../constants';
import { ArrowRight, Clock, BookOpen } from 'lucide-react';

const Inspiration: React.FC = () => {
  return (
    <section id="inspiration" className="py-24 bg-white border-y border-slate-100">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center space-y-4 mb-16">
          <span className="text-[#FACC15] font-bold text-xs uppercase tracking-[0.2em]">Resources & Guides</span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">Building Excellence</h2>
          <p className="text-slate-600 max-w-xl mx-auto mt-6 font-medium text-lg">
            Professional tips on construction planning, structural maintenance, and current building trends from our lead contractors.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {BLOG_POSTS.map((post, index) => (
            <article key={index} className="group cursor-pointer flex flex-col h-full">
              <div className="relative overflow-hidden rounded-lg aspect-[3/2] mb-6 shadow-md border border-slate-100">
                <img 
                  src={post.image} 
                  alt={post.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-slate-900/90 backdrop-blur-sm text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-md border border-white/10">
                    {post.category}
                  </span>
                </div>
              </div>
              <div className="space-y-4 px-2 flex-1 flex flex-col">
                <div className="flex items-center gap-2 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                  <Clock className="w-3 h-3 text-[#FACC15]" />
                  {post.readTime}
                </div>
                <h3 className="text-xl font-bold text-slate-900 leading-snug group-hover:text-[#FACC15] transition-colors">
                  {post.title}
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed line-clamp-3 font-medium flex-1">
                  {post.excerpt}
                </p>
                <div className="pt-2 mt-auto">
                  <button className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest text-slate-900 group-hover:gap-4 transition-all border-b-2 border-transparent group-hover:border-[#FACC15] pb-0.5 w-fit">
                    Read Full Guide <ArrowRight className="w-3.5 h-3.5 text-[#FACC15]" />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-20 text-center">
          <button className="inline-flex items-center gap-3 border-2 border-slate-900 px-8 py-4 rounded-md font-bold uppercase tracking-wider text-slate-900 hover:bg-slate-900 hover:text-white transition-all transform active:scale-95 text-xs">
            Browse All Resources <BookOpen className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Inspiration;
