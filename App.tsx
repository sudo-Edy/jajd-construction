import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import { SiteSettingsProvider } from './contexts/SiteSettingsContext';
import Header from './components/Header';
import Hero from './components/Hero';
import Process from './components/Process';
import Sources from './components/Sources';
import Testimonials from './components/Testimonials';
import Footer from './components/Footer';
import About from './components/About';
import FAQ from './components/FAQ';
import ServiceAreas from './components/ServiceAreas';
import QuoteModal from './components/QuoteModal';
import RecentWork from './components/RecentWork';
import PopularProjects from './components/PopularProjects';
import Journal from './components/Journal';
import BookingCalendar from './components/BookingCalendar';
import DarkModeToggle from './components/DarkModeToggle';

// Admin panel is code-split: it never ships in the public-page bundle.
const AdminPanel = React.lazy(() => import('./components/admin/AdminPanel'));
import { initAnalytics, analytics } from './utils/analytics';
import { trackVisit } from './utils/tracking';
import { MessageSquare, X, ArrowRight, ShieldCheck, Clock } from 'lucide-react';

interface OpenQuoteOptions {
  zip?: string;
  date?: string;
  /** Quote-form service to pre-select ("Roofing", "Cabinets", ...). */
  project?: string;
  /** Specific project name shown to the visitor ("Deck Staining & Sealing"). */
  detail?: string;
  /** Analytics source label; defaults to 'calendar' for dated opens, else 'cta'. */
  source?: string;
}

function App() {
  const [isQuoteOpen, setIsQuoteOpen] = useState(false);
  const [activeZip, setActiveZip] = useState('');
  const [preferredDate, setPreferredDate] = useState('');
  const [activeProject, setActiveProject] = useState('');
  const [activeDetail, setActiveDetail] = useState('');
  const [showExitIntent, setShowExitIntent] = useState(false);
  const [hasShownExitIntent, setHasShownExitIntent] = useState(false);

  // Simple client-side routing, static for the lifetime of the page,
  // but the admin return must come after all hooks run.
  const isAdminRoute = window.location.pathname.startsWith('/admin');

  const handleOpenQuote = (opts: OpenQuoteOptions = {}) => {
    if (opts.zip) setActiveZip(opts.zip);
    if (opts.date) setPreferredDate(opts.date);
    if (opts.project) setActiveProject(opts.project);
    if (opts.detail) setActiveDetail(opts.detail);
    setIsQuoteOpen(true);
    setShowExitIntent(false);
    analytics.quoteModalOpen(opts.source ?? (opts.date ? 'calendar' : 'cta'));
  };

  useEffect(() => {
    if (!isAdminRoute) {
      initAnalytics();
      trackVisit();
    }
  }, [isAdminRoute]);

  // Exit intent: armed 10s after load, fires once per visit when the cursor
  // leaves through the top of the viewport.
  useEffect(() => {
    if (isAdminRoute) return;
    let armed = false;
    const timer = setTimeout(() => { armed = true; }, 10000);

    const handleMouseLeave = (e: MouseEvent) => {
      if (armed && e.clientY <= 0) {
        setShowExitIntent(true);
        armed = false;
      }
    };
    document.addEventListener('mouseleave', handleMouseLeave);
    return () => {
      clearTimeout(timer);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [isAdminRoute]);

  if (isAdminRoute) {
    return (
      <React.Suspense fallback={<div className="min-h-screen bg-slate-900" />}>
        <AdminPanel />
      </React.Suspense>
    );
  }

  return (
    <ThemeProvider>
    <SiteSettingsProvider>
      <div className="min-h-screen bg-white transition-colors duration-300">
      <Header onOpenQuote={() => handleOpenQuote()} />

      <main id="main-content">
        <Hero
          onOpenQuote={(zip, project) =>
            handleOpenQuote({
              zip,
              project: project?.quoteType,
              detail: project?.name,
              source: project ? 'hero_search' : 'cta',
            })
          }
        />

        <PopularProjects
          onSelectProject={(p) => handleOpenQuote({ project: p.quoteType, detail: p.name, source: 'popular_project' })}
          onOpenQuote={() => handleOpenQuote({ source: 'popular_project_other' })}
        />
        <RecentWork />
        <BookingCalendar onSelectDate={(date) => handleOpenQuote({ date })} onOpenQuote={() => handleOpenQuote()} />
        <Process onOpenQuote={() => handleOpenQuote()} />

        <About />
        <ServiceAreas />

        <Testimonials onOpenQuote={() => handleOpenQuote()} />
        <Journal />
        <FAQ onOpenQuote={() => handleOpenQuote()} />
        <Sources />
      </main>

      <Footer onOpenQuote={() => handleOpenQuote()} />

      {/* Persistent Floating CTA */}
      <div className="fixed bottom-6 right-6 z-[60]">
        <button
          onClick={() => handleOpenQuote()}
          className="flex items-center gap-2.5 bg-brand-400 text-navy px-5 py-3.5 rounded-full font-bold text-sm shadow-card-hover hover:scale-105 active:scale-95 transition-all"
        >
          <MessageSquare size={18} />
          <span className="hidden sm:inline">Free Estimate</span>
        </button>
      </div>

      {/* Exit Intent Nudge */}
      {showExitIntent && !hasShownExitIntent && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-6 bg-navy/60 backdrop-blur-md">
          <div className="bg-white rounded-2xl max-w-lg w-full p-8 md:p-12 relative shadow-2xl animate-in zoom-in duration-300 ring-1 ring-slate-900/5">
            <button
              onClick={() => { setShowExitIntent(false); setHasShownExitIntent(true); }}
              aria-label="Close"
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-900 z-10 p-1"
            >
              <X size={22} />
            </button>
            <div className="space-y-5 text-center">
              <div className="w-16 h-16 bg-brand-50 rounded-2xl flex items-center justify-center mx-auto">
                 <ShieldCheck className="w-8 h-8 text-brand-600" />
              </div>
              <h3 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">Before you go, your estimate is free.</h3>
              <p className="text-stone-500">Tell us about your painting, siding, or roofing project. It takes under a minute, with no obligation, and we respond within 24 hours.</p>
              <button
                onClick={() => { setHasShownExitIntent(true); handleOpenQuote(); }}
                className="w-full bg-navy text-white py-4 rounded-xl font-bold hover:bg-brand-400 hover:text-navy transition-all flex items-center justify-center gap-2"
              >
                Request My Free Estimate <ArrowRight size={16} />
              </button>
              <div className="flex items-center justify-center gap-6 pt-2 text-xs font-semibold text-slate-400">
                 <div className="flex items-center gap-1.5">
                   <Clock size={14} className="text-brand-500" /> 24-hour response
                 </div>
                 <div className="flex items-center gap-1.5">
                   <ShieldCheck size={14} className="text-brand-500" /> Licensed &amp; insured
                 </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <QuoteModal
        isOpen={isQuoteOpen}
        onClose={() => { setIsQuoteOpen(false); setActiveZip(''); setPreferredDate(''); setActiveProject(''); setActiveDetail(''); }}
        initialZip={activeZip}
        preferredDate={preferredDate}
        initialProject={activeProject}
        initialDetail={activeDetail}
      />

      <DarkModeToggle />
    </div>
    </SiteSettingsProvider>
    </ThemeProvider>
  );
}

export default App;
