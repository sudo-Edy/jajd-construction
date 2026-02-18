import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import Header from './components/Header';
import Hero from './components/Hero';
import Process from './components/Process';
import Services from './components/Services';
import Sources from './components/Sources';
import Testimonials from './components/Testimonials';
import Footer from './components/Footer';
import ZipSearch from './components/ZipSearch';
import About from './components/About';
import FAQ from './components/FAQ';
import ServiceAreas from './components/ServiceAreas';
import QuoteModal from './components/QuoteModal';
import RecentWork from './components/RecentWork';
import BookingCalendar from './components/BookingCalendar';
import AdminPanel from './components/admin/AdminPanel';
import DarkModeToggle from './components/DarkModeToggle';
import { MessageSquare, X, ArrowRight, ShieldCheck, Clock } from 'lucide-react';

function App() {
  const [isQuoteOpen, setIsQuoteOpen] = useState(false);
  const [activeZip, setActiveZip] = useState('');
  const [showExitIntent, setShowExitIntent] = useState(false);
  const [hasShownExitIntent, setHasShownExitIntent] = useState(false);

  // Simple client-side routing
  const isAdminRoute = window.location.pathname.startsWith('/admin');

  const handleOpenQuote = (zip?: string) => {
    if (zip) setActiveZip(zip);
    setIsQuoteOpen(true);
    setShowExitIntent(false);
  };

  // Exit intent logic
  // Exit intent logic - Wait 2s before allowing (easier for testing)
  useEffect(() => {
    const timer = setTimeout(() => {
      setHasShownExitIntent(false); 
    }, 2000);
    
    // Initially disable popup
    setHasShownExitIntent(true);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !hasShownExitIntent && !isQuoteOpen) {
        setShowExitIntent(true);
        setHasShownExitIntent(true);
      }
    };
    document.addEventListener('mouseleave', handleMouseLeave);
    return () => document.removeEventListener('mouseleave', handleMouseLeave);
  }, [hasShownExitIntent, isQuoteOpen]);

  // Render admin panel if on /admin route
  if (isAdminRoute) {
    document.documentElement.classList.remove('snap-scroll');
    return <AdminPanel />;
  }

  // Add snap-scroll class only for main site
  useEffect(() => {
    document.documentElement.classList.add('snap-scroll');
    return () => {
      document.documentElement.classList.remove('snap-scroll');
    };
  }, []);

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-white transition-colors duration-300">
      <Header onOpenQuote={() => handleOpenQuote()} />
      
      <main id="main-content">
        <Hero onOpenQuote={handleOpenQuote} />
        
        <div className="h-3 w-full bg-gradient-to-r from-slate-900 via-[#FACC15] to-slate-900 z-30 relative opacity-80" />

        <RecentWork />
        <Services onOpenQuote={() => handleOpenQuote()} />
        <BookingCalendar onOpenQuote={() => handleOpenQuote()} />
        <Process onOpenQuote={() => handleOpenQuote()} />

        <About />
        <ServiceAreas />

        <Testimonials onOpenQuote={() => handleOpenQuote()} />
        <FAQ onOpenQuote={() => handleOpenQuote()} />
        <Sources />
      </main>

      <Footer onOpenQuote={() => handleOpenQuote()} />

      {/* Persistent Floating CTA */}
      <div className="fixed bottom-8 right-8 z-[60] group">
        <button 
          onClick={() => handleOpenQuote()}
          className="flex items-center gap-3 bg-[#FACC15] text-slate-900 px-6 py-4 rounded-full font-black uppercase tracking-widest text-[10px] shadow-2xl hover:scale-110 active:scale-95 transition-all"
        >
          <MessageSquare size={18} />
          <span className="hidden sm:inline">Free Quote</span>
        </button>
      </div>

      {/* Exit Intent Nudge */}
      {showExitIntent && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md">
          <div className="bg-white rounded-sm max-w-lg w-full p-10 md:p-14 relative shadow-2xl animate-in zoom-in duration-300 ring-1 ring-slate-900/5">
            <button 
              onClick={() => setShowExitIntent(false)}
              className="absolute top-6 right-6 text-slate-400 hover:text-slate-900 z-10"
            >
              <X size={24} />
            </button>
            <div className="space-y-6 text-center">
              <div className="w-20 h-20 bg-[#FACC15]/10 rounded-none flex items-center justify-center mx-auto">
                 <ShieldCheck className="w-10 h-10 text-[#FACC15]" />
              </div>
              <h3 className="text-3xl font-black text-slate-900">Wait! Get a free estimate before you go.</h3>
              <p className="text-slate-500 font-medium">Our master crews have limited availability for 2026. Lock in your consultation now—it takes less than a minute.</p>
              <button 
                onClick={() => handleOpenQuote()}
                className="w-full bg-slate-900 text-white py-6 rounded-sm font-black uppercase tracking-widest text-xs hover:bg-[#FACC15] hover:text-slate-900 transition-all flex items-center justify-center gap-3"
              >
                Request My Free Quote <ArrowRight size={16} />
              </button>
              <div className="flex items-center justify-center gap-6 pt-4 text-[10px] font-black uppercase tracking-widest text-slate-400">
                 <div className="flex items-center gap-2">
                   <Clock size={14} className="text-[#FACC15]" /> 24h Response
                 </div>
                 <div className="flex items-center gap-2">
                   <ShieldCheck size={14} className="text-[#FACC15]" /> Licensed & Insured
                 </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <QuoteModal 
        isOpen={isQuoteOpen} 
        onClose={() => { setIsQuoteOpen(false); setActiveZip(''); }} 
        initialZip={activeZip}
      />

      {/* Dark mode toggle */}
      <DarkModeToggle />
    </div>
    </ThemeProvider>
  );
}

export default App;
