import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import { SiteSettingsProvider } from './contexts/SiteSettingsContext';
import Header from './components/Header';
import Hero from './components/Hero';
import Process from './components/Process';
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
import MobileActionBar from './components/MobileActionBar';

// Admin panel is code-split: it never ships in the public-page bundle.
const AdminPanel = React.lazy(() => import('./components/admin/AdminPanel'));
import { initAnalytics, analytics } from './utils/analytics';
import { trackVisit } from './utils/tracking';

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

  // Simple client-side routing, static for the lifetime of the page,
  // but the admin return must come after all hooks run.
  const isAdminRoute = window.location.pathname.startsWith('/admin');

  const handleOpenQuote = (opts: OpenQuoteOptions = {}) => {
    if (opts.zip) setActiveZip(opts.zip);
    if (opts.date) setPreferredDate(opts.date);
    if (opts.project) setActiveProject(opts.project);
    if (opts.detail) setActiveDetail(opts.detail);
    setIsQuoteOpen(true);
    analytics.quoteModalOpen(opts.source ?? (opts.date ? 'calendar' : 'cta'));
  };

  useEffect(() => {
    if (!isAdminRoute) {
      initAnalytics();
      trackVisit();
    }
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

        {/* Mobile-first order: what we do + prices, then proof (reviews, real
            work), then how it works and who we are, then the final ask. */}
        <PopularProjects
          onSelectProject={(p) => handleOpenQuote({ project: p.quoteType, detail: p.name, source: 'popular_project' })}
          onOpenQuote={() => handleOpenQuote({ source: 'popular_project_other' })}
        />
        <Testimonials />
        <RecentWork />
        <Process />
        <About />
        <ServiceAreas />
        <FAQ />
        <BookingCalendar onSelectDate={(date) => handleOpenQuote({ date })} />
        <Journal />
      </main>

      <Footer onOpenQuote={() => handleOpenQuote()} />

      <QuoteModal
        isOpen={isQuoteOpen}
        onClose={() => { setIsQuoteOpen(false); setActiveZip(''); setPreferredDate(''); setActiveProject(''); setActiveDetail(''); }}
        initialZip={activeZip}
        preferredDate={preferredDate}
        initialProject={activeProject}
        initialDetail={activeDetail}
      />

      <MobileActionBar onOpenQuote={() => handleOpenQuote({ source: 'mobile_bar' })} />
      <DarkModeToggle />
    </div>
    </SiteSettingsProvider>
    </ThemeProvider>
  );
}

export default App;
