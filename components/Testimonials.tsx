import React, { useEffect, useRef, useState } from 'react';
import { TESTIMONIALS } from '../constants';
import { Testimonial } from '../types';
import { Star, ArrowRight, Quote, X, PenLine } from 'lucide-react';
import { CONFIG } from '../config';

interface TestimonialsProps {
  onOpenQuote?: () => void;
}

const PLATFORM_LABELS: Record<string, string> = {
  google: 'Google Review',
  bbb: 'BBB Review',
  thumbtack: 'Thumbtack Review',
};

// Average rating, rounded to one decimal, computed from the real reviews on file.
const AVG_RATING = (
  TESTIMONIALS.reduce((sum, t) => sum + t.rating, 0) / TESTIMONIALS.length
).toFixed(1);

const PLATFORMS_PRESENT = Array.from(
  new Set(TESTIMONIALS.map((t) => t.platform).filter(Boolean))
) as string[];

const PLATFORM_NAMES: Record<string, string> = {
  google: 'Google',
  bbb: 'BBB',
  thumbtack: 'Thumbtack',
};

const Testimonials: React.FC<TestimonialsProps> = ({ onOpenQuote }) => {
  const [activeReview, setActiveReview] = useState<Testimonial | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const isPausedRef = useRef(isPaused);
  const offsetRef = useRef(0);
  const lastTimeRef = useRef(0);

  // Duplicate testimonials enough times for a seamless infinite marquee.
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
      className="py-24 bg-stone-50 overflow-hidden border-b border-stone-200 relative"
    >
      <div className="max-w-7xl mx-auto px-6 mb-12 text-center space-y-5">
        <span className="text-brand-600 font-bold text-xs uppercase tracking-[0.2em]">Client testimony</span>
        <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 leading-tight tracking-tight">What your neighbors say about us</h2>
        <p className="text-stone-600 max-w-xl mx-auto text-lg">
          Real reviews from Nebraska homeowners, pulled straight from Google and the BBB.
        </p>

        {/* Rating summary */}
        <div className="inline-flex flex-wrap items-center justify-center gap-x-6 gap-y-3 bg-white border border-stone-200 rounded-2xl px-6 py-4 shadow-card">
          <div className="flex items-center gap-3">
            <span className="text-4xl font-extrabold text-slate-900 leading-none">{AVG_RATING}</span>
            <div className="text-left">
              <div className="flex gap-0.5 text-brand-400">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
              </div>
              <p className="text-[11px] font-semibold text-stone-500 mt-0.5">Average across verified reviews</p>
            </div>
          </div>
          {PLATFORMS_PRESENT.length > 0 && (
            <>
              <span className="hidden sm:block w-px h-10 bg-stone-200" />
              <div className="flex items-center gap-2">
                {PLATFORMS_PRESENT.map((p) => (
                  <span key={p} className="text-[11px] font-bold text-stone-600 uppercase tracking-wider bg-stone-100 px-3 py-1.5 rounded-full">
                    {PLATFORM_NAMES[p] ?? p}
                  </span>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Marquee */}
      <div className="relative w-full overflow-hidden py-8 select-none">
        <div className="absolute inset-y-0 left-0 w-24 md:w-32 bg-gradient-to-r from-stone-50 to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-24 md:w-32 bg-gradient-to-l from-stone-50 to-transparent z-10 pointer-events-none" />

        <div
            ref={trackRef}
            className="gap-5"
            style={{ display: 'flex', width: 'max-content', willChange: 'transform' }}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => { if (!activeReview) setIsPaused(false); }}
        >
          {loopedTestimonials.map((review, index) => (
            <button
              key={`${review.id}-${index}`}
              onClick={() => handleReviewClick(review)}
              className="w-[300px] md:w-[380px] bg-white p-6 rounded-2xl shadow-card border border-stone-200 flex-shrink-0 relative text-left hover:shadow-card-hover hover:border-brand-400/50 transition-all duration-300 cursor-pointer"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-brand-50 rounded-full flex items-center justify-center font-bold text-brand-700 text-xs">
                  {review.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900 leading-tight">{review.name}</h3>
                  <p className="text-slate-400 text-[11px] font-medium">{review.role}</p>
                </div>
                <div className="flex gap-0.5 text-brand-400 ml-auto">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>
              </div>

              <p className="text-sm text-stone-600 leading-relaxed line-clamp-4">
                "{review.content}"
              </p>

              <div className="mt-4 pt-4 border-t border-stone-100 flex items-center gap-2">
                 <span className="bg-emerald-50 text-emerald-700 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Verified
                 </span>
                 {review.lang === 'es' && (
                   <span className="bg-brand-50 text-brand-700 px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider">
                     Español
                   </span>
                 )}
                 <span className="text-[11px] text-slate-400 ml-auto font-semibold">
                   {PLATFORM_LABELS[review.platform ?? ''] ?? 'Customer Review'}
                 </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-6">
        <button
          onClick={onOpenQuote}
          className="inline-flex items-center gap-3 bg-navy text-white px-8 py-4 rounded-xl font-bold hover:bg-brand-400 hover:text-navy transition-all shadow-lg group active:scale-95"
        >
          Join Our Happy Customers <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </button>
        {CONFIG.GOOGLE_REVIEW_URL && CONFIG.GOOGLE_REVIEW_URL !== '#' && (
          <a
            href={CONFIG.GOOGLE_REVIEW_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 bg-white text-slate-900 border-2 border-stone-200 px-8 py-4 rounded-xl font-bold hover:border-brand-400 transition-all active:scale-95"
          >
            <PenLine className="w-4 h-4 text-brand-600" /> Leave us a review
          </a>
        )}
      </div>

      {/* Focused review overlay */}
      {activeReview && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-navy/60 backdrop-blur-md animate-in fade-in duration-200" onClick={closeReview}>
          <div
            className="bg-white max-w-2xl w-full p-8 md:p-12 rounded-3xl shadow-2xl relative animate-in zoom-in-95 duration-300"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
             <button onClick={closeReview} aria-label="Close review" className="absolute top-4 right-4 text-slate-400 hover:text-slate-900 p-2">
                <X className="w-5 h-5" />
             </button>

             <div className="flex justify-center mb-5">
                <div className="flex gap-1.5 text-brand-400">
                  {[...Array(activeReview.rating)].map((_, i) => (
                    <Star key={i} className="w-7 h-7 fill-current drop-shadow-sm" />
                  ))}
                </div>
             </div>

             <Quote className="w-12 h-12 text-slate-100 mx-auto mb-5" />

             <p className="text-xl md:text-2xl font-medium text-slate-900 text-center leading-relaxed mb-8">
               "{activeReview.content}"
             </p>

             <div className="flex flex-col items-center gap-1.5">
                <div className="w-14 h-14 bg-brand-400 rounded-full flex items-center justify-center font-bold text-navy text-xl mb-1 shadow-lg">
                  {activeReview.name.charAt(0)}
                </div>
                <h3 className="font-bold text-lg text-slate-900">{activeReview.name}</h3>
                <p className="text-stone-500 font-semibold text-sm">{activeReview.role}, {PLATFORM_LABELS[activeReview.platform ?? ''] ?? 'Customer Review'}</p>
             </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Testimonials;
