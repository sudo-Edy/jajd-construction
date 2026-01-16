import React, { useState, useEffect } from 'react';
import { Menu, X, HardHat, Phone, ChevronRight } from 'lucide-react';
import { CONFIG } from '../config';

interface HeaderProps {
  onOpenQuote: () => void;
}

const Header: React.FC<HeaderProps> = ({ onOpenQuote }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  const navLinks = [
    { name: 'Home', href: '#' },
    { name: 'Services', href: '#services' },
    { name: 'About Us', href: '#about us' },
    { name: 'Reviews', href: '#reviews' },
    { name: 'Sources', href: '#sources' },
    { name: 'Contact', href: '#footer' }
  ];

  useEffect(() => {
    const handleScroll = () => {
      // Background styling toggle
      setIsScrolled(window.scrollY > 50);

      // Active section detection
      const scrollPosition = window.scrollY + 150; // Offset for header height and scrolling buffer

      // Check if we are at the top of the page
      if (window.scrollY < 100) {
        setActiveSection('home');
        return;
      }

      // Check for bottom of page
      if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 100) {
        setActiveSection('footer');
        return;
      }

      // Detect other sections
      const sections = navLinks
        .map(link => link.href.replace('#', ''))
        .filter(id => id !== '');

      let currentSection = 'home';

      for (const sectionId of sections) {
        const element = document.getElementById(sectionId);
        if (element) {
          const offsetTop = element.offsetTop;
          if (scrollPosition >= offsetTop) {
            currentSection = sectionId;
          }
        }
      }
      
      setActiveSection(currentSection);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Precise smooth scroll for cross-browser reliability
  const handleScrollTo = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    const targetId = href.replace('#', '');
    setIsMenuOpen(false);

    if (href === '#') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const element = document.getElementById(targetId);
      if (element) {
        e.preventDefault();
        const headerOffset = 80;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    }
  };

  return (
    <nav 
      className={`fixed w-full z-50 transition-all duration-500 ease-in-out ${
        isScrolled ? 'bg-slate-900/98 backdrop-blur-md py-4 shadow-xl' : 'bg-transparent py-8'
      }`}
      aria-label="Main navigation"
    >
      <div className="max-w-7xl mx-auto px-8 flex justify-between items-center">
        {/* Brand/Logo */}
        <div 
          className="flex items-center gap-3 cursor-pointer select-none group" 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <HardHat className="w-8 h-8 text-[#FACC15]" aria-hidden="true" />
          <span className="text-2xl font-extrabold tracking-tighter text-white">
            JAJD<span className="text-[#FACC15]">CONSTRUCTION</span>
          </span>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center">
          <div className="flex items-center gap-3 border-r border-white/10 pr-10">
            <Phone className="w-4 h-4 text-[#FACC15]" aria-hidden="true" />
            <a 
              href={`tel:${CONFIG.PHONE_RAW}`} 
              className="text-sm font-bold text-white/90 hover:text-[#FACC15] transition-colors"
            >
              {CONFIG.PHONE}
            </a>
          </div>
          
          <ul className="flex items-center gap-10 px-10">
            {navLinks.map((item) => {
              const itemID = item.href.replace('#', '') || 'home';
              const isActive = activeSection === itemID;
              
              return (
                <li key={item.name}>
                  <a
                    href={item.href}
                    onClick={(e) => handleScrollTo(e, item.href)}
                    className={`text-[11px] font-bold uppercase tracking-[0.2em] transition-all duration-300 relative py-2 ${
                      isActive ? 'text-[#FACC15]' : 'text-white/70 hover:text-white'
                    }`}
                  >
                    {item.name}
                    <span className={`absolute bottom-0 left-0 h-0.5 bg-[#FACC15] transition-all duration-300 ${isActive ? 'w-full opacity-100' : 'w-0 opacity-0'}`} />
                  </a>
                </li>
              );
            })}
          </ul>
          
          <button 
            onClick={onOpenQuote}
            className="bg-[#FACC15] text-slate-900 px-7 py-3.5 rounded-xl font-black text-[10px] uppercase tracking-[0.15em] hover:bg-white transition-all shadow-lg active:scale-95"
          >
            Get Free Estimate
          </button>
        </div>

        {/* Mobile Toggle */}
        <button 
          className="lg:hidden text-white p-2 hover:bg-white/10 rounded-lg transition-colors focus:outline-none" 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-expanded={isMenuOpen}
          aria-label="Toggle navigation menu"
        >
          {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-slate-900 border-t border-white/10 p-8 flex flex-col gap-8 shadow-2xl animate-in slide-in-from-top duration-300 max-h-[90vh] overflow-y-auto">
          <ul className="flex flex-col gap-3">
            {navLinks.map((item) => {
              const itemID = item.href.replace('#', '') || 'home';
              const isActive = activeSection === itemID;

              return (
                <li key={item.name}>
                  <a
                    href={item.href}
                    className={`flex items-center justify-between p-5 rounded-2xl transition-all duration-300 ${
                      isActive ? 'bg-[#FACC15]/10 text-[#FACC15] border border-[#FACC15]/20' : 'text-white/80 hover:bg-white/5'
                    }`}
                    onClick={(e) => handleScrollTo(e, item.href)}
                  >
                    <span className={`text-xl font-bold tracking-tight ${isActive ? 'pl-2' : ''} transition-all`}>
                      {item.name}
                    </span>
                    {isActive ? (
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#FACC15] animate-pulse" />
                        <ChevronRight size={18} />
                      </div>
                    ) : (
                      <ChevronRight size={18} className="opacity-20" />
                    )}
                  </a>
                </li>
              );
            })}
          </ul>
          
          <div className="pt-6 border-t border-white/10">
            <button 
              onClick={() => { setIsMenuOpen(false); onOpenQuote(); }}
              className="bg-[#FACC15] text-slate-900 w-full py-5 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl active:scale-95 transition-all flex items-center justify-center gap-3"
            >
              Get Free Estimate <ChevronRight size={16} />
            </button>
            
            <div className="mt-8 flex flex-col items-center gap-2">
               <div className="flex items-center gap-3 text-[#FACC15]">
                 <Phone size={16} />
                 <a href={`tel:${CONFIG.PHONE_RAW}`} className="text-sm font-black tracking-widest">{CONFIG.PHONE}</a>
               </div>
               <p className="text-[10px] text-white/30 uppercase font-bold tracking-widest">Available Mon - Fri, 8am - 6pm</p>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Header;