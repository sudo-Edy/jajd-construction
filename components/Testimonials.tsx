import React, { useEffect, useRef, useState } from 'react';
import { TESTIMONIALS } from '../constants';
import { Testimonial } from '../types';
import { Star, ArrowRight, Quote } from 'lucide-react';

interface TestimonialsProps {
  onOpenQuote?: () => void;
}

const Testimonials: React.FC<TestimonialsProps> = ({ onOpenQuote }) => {
  const [activeReview, setActiveReview] = useState<Testimonial | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const isPausedRef = useRef(isPaused);
  const offsetRef = useRef(0);
  const lastTimeRef = useRef(0);

  // Duplicate testimonials enough times to ensure smooth infinite scroll
  // We need enough copies to fill the screen width + buffer for the animation loop
  const loopCount = 6;
  const loopedTestimonials = Array.from({ length: loopCount }, () => TESTIMONIALS).flat();

  useEffect(() => {
    isPausedRef.current = isPaused;
  }, [isPaused]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const speed = 32; // px/sec
    let rafId = 0;

    const step = (now: number) => {
      if (!lastTimeRef.current) lastTimeRef.current = now;
      const dt = (now - lastTimeRef.current) / 1000;
      lastTimeRef.current = now;

      if (!isPausedRef.current) {
        const sequenceWidth = track.scrollWidth / loopCount;
        if (sequenceWidth > 0) {
          offsetRef.current -= speed * dt;
          if (Math.abs(offsetRef.current) >= sequenceWidth) {
            offsetRef.current += sequenceWidth;
          }
          track.style.transform = `translate3d(${offsetRef.current}px, 0, 0)`;
        }
      }

      rafId = window.requestAnimationFrame(step);
    };

    rafId = window.requestAnimationFrame(step);
    return () => window.cancelAnimationFrame(rafId);
  }, [loopCount]);

  const handleReviewClick = (review: Testimonial) => {
    setActiveReview(review);
    setIsPaused(true);
  };

  const closeReview = () => {
    setActiveReview(null);
    setIsPaused(false);
  };

  return (
    <section 
      id="reviews" 
      className="py-24 bg-slate-50 overflow-hidden border-b border-slate-200 relative"
    >
      <div className="max-w-7xl mx-auto px-6 mb-16 text-center">
        <span className="text-[#CA8A04] font-bold text-xs uppercase tracking-[0.2em]">Client Testimony</span>
        <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 leading-tight tracking-tight mt-4">Trusted by Industry Leaders & Homeowners</h2>
      </div>

      {/* Marquee Container */}
      <div className="relative w-full overflow-hidden py-10 select-none bg-slate-50">
        {/* Gradient Masks */}
        <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-slate-50 to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-slate-50 to-transparent z-10 pointer-events-none" />
 
        <div 
            ref={trackRef}
            className="gap-6"
            style={{
              display: 'flex',
              width: 'max-content',
              willChange: 'transform',
            }}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => { if (!activeReview) setIsPaused(false); }}
        >
          {loopedTestimonials.map((review, index) => (
            <div 
              key={`${review.id}-${index}`}
              onClick={() => handleReviewClick(review)}
              className="w-[300px] md:w-[380px] bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex-shrink-0 relative group hover:shadow-md transition-all duration-300 cursor-pointer"
            >
              {/* Platform Icon - removed per user request */}
              
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center font-bold text-slate-600 text-xs tracking-tighter">
                  {review.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900 leading-tight">{review.name}</h4>
                  <p className="text-slate-400 text-[10px] font-medium">2 weeks ago</p>
                </div>
              </div>

              <div className="flex gap-0.5 text-[#FACC15] mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-current" />
                ))}
              </div>

              <p className="text-sm text-slate-600 leading-relaxed line-clamp-4">
                "{review.content}"
              </p>

              <div className="mt-4 pt-4 border-t border-slate-100 flex items-center gap-2">
                 <div className="bg-emerald-50 text-emerald-700 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Verified Customer
                 </div>
                 <span className="text-xs text-slate-400 ml-auto font-medium">{review.role}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="text-center pt-8">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-6">Click any review to read details</p>
        <button 
          onClick={onOpenQuote}
          className="inline-flex items-center gap-3 bg-slate-900 text-white px-8 py-4 rounded-md font-bold uppercase tracking-wider hover:bg-[#FACC15] hover:text-slate-900 transition-all shadow-lg text-xs group active:scale-95"
        >
          Request Free Quote <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </button>
      </div>

      {/* Focused Review Overlay */}
      {activeReview && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-200" onClick={closeReview}>
          <div 
            className="bg-white max-w-2xl w-full p-12 rounded-2xl shadow-2xl relative animate-in zoom-in-95 duration-300 border-2 border-[#FACC15]"
            onClick={(e) => e.stopPropagation()}
          >
             <button onClick={closeReview} className="absolute top-4 right-4 text-slate-400 hover:text-slate-900">
                <ArrowRight className="w-6 h-6 rotate-45" /> {/* Close Icon */}
             </button>

             <div className="flex justify-center mb-6">
                <div className="flex gap-2 text-[#FACC15]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-8 h-8 fill-current drop-shadow-md" />
                  ))}
                </div>
             </div>

             <Quote className="w-16 h-16 text-slate-100 mx-auto mb-6" />

             <p className="text-2xl md:text-3xl font-medium text-slate-900 text-center leading-relaxed mb-10">
               "{activeReview.content}"
             </p>

             <div className="flex flex-col items-center gap-2">
                <div className="w-16 h-16 bg-[#FACC15] rounded-full flex items-center justify-center font-bold text-slate-900 text-2xl mb-2 shadow-lg">
                  {activeReview.name.charAt(0)}
                </div>
                <h4 className="font-bold text-xl text-slate-900">{activeReview.name}</h4>
                <p className="text-slate-500 font-bold uppercase tracking-wider text-sm">{activeReview.role}</p>
             </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Testimonials;
