import React from 'react';
import { BLOG_POSTS } from '../data/siteData';
import { ArrowRight, Clock, BookOpen } from 'lucide-react';

const Inspiration: React.FC = () => {
  return (
    <section id="inspiration" className="py-24 bg-white border-t border-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center space-y-4 mb-16">
          <span className="text-[#FACC15] font-bold text-xs uppercase tracking-[0.3em]">Resources & Guides</span>
          <h2 className="text-4xl md:text-5xl font-black text-navy">Building Excellence</h2>
          <div className="w-24 h-1.5 bg-[#FACC15] mx-auto" />
          <p className="text-gray-400 max-xl mx-auto mt-6 font-medium">
            Professional tips on construction planning, structural maintenance, and current building trends from our lead contractors.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
          {BLOG_POSTS.map((post, index) => (
            <article key={index} className="group cursor-pointer">
              <div className="relative overflow-hidden rounded-[2.5rem] aspect-[4/3] mb-8 shadow-sm">
                <img 
                  src={post.image} 
                  alt={post.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute top-6 left-6">
                  <span className="bg-navy/90 backdrop-blur-md text-white text-[9px] font-black uppercase tracking-[0.2em] px-4 py-2 rounded-full border border-white/10">
                    {post.category}
                  </span>
                </div>
              </div>
              <div className="space-y-4 px-2">
                <div className="flex items-center gap-2 text-gray-400 text-[10px] font-black uppercase tracking-widest">
                  <Clock className="w-3 h-3 text-[#FACC15]" />
                  {post.readTime}
                </div>
                <h3 className="text-xl md:text-2xl font-black text-navy leading-snug group-hover:text-[#FACC15] transition-colors">
                  {post.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed line-clamp-2 font-medium">
                  {post.excerpt}
                </p>
                <div className="pt-2">
                  <button className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-navy group-hover:gap-6 transition-all">
                    Read Full Guide <ArrowRight className="w-4 h-4 text-[#FACC15]" />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-20 text-center">
          <button className="inline-flex items-center gap-4 border-4 border-navy px-12 py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-navy hover:bg-navy hover:text-white transition-all transform active:scale-95 text-xs">
            Browse All Resources <BookOpen className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Inspiration;