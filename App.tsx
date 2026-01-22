import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Process from './components/Process';
import Services from './components/Services';
import Sources from './components/Sources';
import Testimonials from './components/Testimonials';
import Footer from './components/Footer';
import ZipSearch from './components/ZipSearch';
import About from './components/About';
import QuoteModal from './components/QuoteModal';
import { MessageSquare, X, ArrowRight, ShieldCheck, Clock } from 'lucide-react';

function App() {
  const [isQuoteOpen, setIsQuoteOpen] = useState(false);
  const [activeZip, setActiveZip] = useState('');
  const [showExitIntent, setShowExitIntent] = useState(false);
  const [hasShownExitIntent, setHasShownExitIntent] = useState(false);

  const handleOpenQuote = (zip?: string) => {
    if (zip) setActiveZip(zip);
    setIsQuoteOpen(true);
    setShowExitIntent(false);
  };

  // Exit intent logic
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

  return (
    <div className="min-h-screen bg-white">
      <Header onOpenQuote={() => handleOpenQuote()} />
      
      <main id="main-content">
        <Hero onOpenQuote={handleOpenQuote} />
        
        <section aria-label="Accreditations" className="bg-slate-900 py-12 border-y border-white/5 relative z-30">
          <div className="max-w-7xl mx-auto px-6 overflow-hidden">
            <div className="flex flex-wrap justify-center md:justify-between items-center gap-12 opacity-30 grayscale hover:grayscale-0 transition-all duration-700">
              {['OSHA', 'LEED', 'NAHB', 'AGC', 'IAI', 'BBB A+'].map((logo) => (
                <span key={logo} className="text-2xl font-black text-white tracking-[0.4em] italic">{logo}</span>
              ))}
            </div>
          </div>
        </section>

        <Services onOpenQuote={() => handleOpenQuote()} />
        <ZipSearch onOpenQuote={handleOpenQuote} />
        <Process onOpenQuote={() => handleOpenQuote()} />
        <About />

        <section aria-labelledby="cta-heading" className="py-24 px-6">
          <div className="max-w-7xl mx-auto bg-slate-900 rounded-[4rem] p-12 md:p-24 relative overflow-hidden group border-b-8 border-[#FACC15]">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#FACC15]/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
            <div className="relative z-10 grid md:grid-cols-2 gap-16 items-center">
              <div className="space-y-10">
                <h2 id="cta-heading" className="text-5xl md:text-7xl font-black text-white leading-tight">
                  Start Your <br />
                  <span className="text-[#FACC15]">Master Build.</span>
                </h2>
                <p className="text-white/60 text-xl leading-relaxed font-medium">
                  Whether it's a luxury residential remodel or a large-scale commercial project, our master crews are ready. Book your free estimate today.
                </p>
                <div className="flex flex-col sm:flex-row gap-6">
                  <button 
                    onClick={() => handleOpenQuote()}
                    className="bg-[#FACC15] text-slate-900 px-12 py-6 rounded-2xl font-black uppercase tracking-[0.2em] hover:bg-white transition-all duration-300 transform group-hover:scale-105 shadow-2xl text-xs"
                  >
                    Request Free Estimate
                  </button>
                </div>
              </div>
              <div className="hidden md:block">
                <div className="relative aspect-square">
                  <div className="absolute inset-0 border-4 border-[#FACC15]/20 rounded-[4rem] translate-x-8 translate-y-8" />
                  <img 
                    src="https://images.unsplash.com/photo-1590644365607-1c5a519a7a37?auto=format&fit=crop&q=80&w=800" 
                    className="w-full h-full object-cover rounded-[4rem] shadow-2xl transition-all duration-700"
                    alt="JAJD Construction Project Manager"
                    loading="lazy"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        <Testimonials onOpenQuote={() => handleOpenQuote()} />
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
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-md">
          <div className="bg-white rounded-[2.5rem] max-w-lg w-full p-10 md:p-14 relative shadow-2xl animate-in zoom-in duration-300">
            <button 
              onClick={() => setShowExitIntent(false)}
              className="absolute top-6 right-6 text-slate-400 hover:text-slate-900"
            >
              <X size={24} />
            </button>
            <div className="space-y-6 text-center">
              <div className="w-20 h-20 bg-[#FACC15]/10 rounded-full flex items-center justify-center mx-auto">
                 <ShieldCheck className="w-10 h-10 text-[#FACC15]" />
              </div>
              <h3 className="text-3xl font-black text-slate-900">Wait! Get a free estimate before you go.</h3>
              <p className="text-slate-500 font-medium">Our master crews have limited availability for Summer 2024. Lock in your consultation now—it takes less than a minute.</p>
              <button 
                onClick={() => handleOpenQuote()}
                className="w-full bg-slate-900 text-white py-6 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-[#FACC15] hover:text-slate-900 transition-all flex items-center justify-center gap-3"
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
    </div>
  );
}

export default App;