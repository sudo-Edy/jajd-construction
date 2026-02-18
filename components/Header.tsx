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
            if (scrollPosition >= offsetTop) currentSection = sectionId;
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
      className={`fixed w-full z-50 transition-all duration-300 ease-out border-b ${
        isScrolled 
          ? 'bg-slate-900/95 backdrop-blur-md py-3 shadow-lg border-white/5' 
          : 'bg-transparent py-4 md:py-6 border-transparent'
      }`}
      aria-label="Main navigation"
    >
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        {/* Brand/Logo */}
        <div 
          className="flex items-center gap-3 cursor-pointer select-none group" 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <div className="bg-[#FACC15] p-1.5 rounded-md">
            <HardHat className="w-6 h-6 text-slate-900" aria-hidden="true" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">
            JAJD<span className="text-[#FACC15]">CONSTRUCTION</span>
          </span>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center">
          <div className="flex items-center gap-3 border-r border-white/10 pr-8 mr-8">
            <Phone className="w-4 h-4 text-[#FACC15]" aria-hidden="true" />
            <a 
              href={`tel:${CONFIG.PHONE_RAW}`} 
              className="text-sm font-semibold text-white hover:text-[#FACC15] transition-colors"
            >
              {CONFIG.PHONE}
            </a>
          </div>
          
          <ul className="flex items-center gap-8 mr-8">
            {navLinks.map((item) => {
              const itemID = item.href.replace('#', '') || 'home';
              const isActive = activeSection === itemID;
              
              return (
                <li key={item.name}>
                  <a
                    href={item.href}
                    onClick={(e) => handleScrollTo(e, item.href)}
                    className={`text-xs font-bold uppercase tracking-wider transition-all duration-200 relative py-1 hover:text-white ${
                      isActive ? 'text-white' : 'text-white/60'
                    }`}
                  >
                    {item.name}
                    <span className={`absolute -bottom-1 left-0 h-0.5 bg-[#FACC15] transition-all duration-200 ${isActive ? 'w-full opacity-100' : 'w-0 opacity-0'}`} />
                  </a>
                </li>
              );
            })}
          </ul>
          
          <button 
            onClick={onOpenQuote}
            className="bg-[#FACC15] text-slate-900 px-6 py-2.5 rounded-md font-bold text-xs uppercase tracking-wider hover:bg-white transition-all shadow-md active:scale-95"
          >
            Get Free Estimate
          </button>
        </div>

        {/* Mobile Toggle */}
        <button 
          className="lg:hidden text-white p-2 hover:bg-white/10 rounded-md transition-colors focus:outline-none" 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-expanded={isMenuOpen}
          aria-label="Toggle navigation menu"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-slate-900 border-t border-white/10 p-6 flex flex-col gap-6 shadow-2xl animate-in slide-in-from-top duration-200 max-h-[90vh] overflow-y-auto">
          <ul className="flex flex-col gap-2">
            {navLinks.map((item) => {
              const itemID = item.href.replace('#', '') || 'home';
              const isActive = activeSection === itemID;

              return (
                <li key={item.name}>
                  <a
                    href={item.href}
                    className={`flex items-center justify-between p-4 rounded-md transition-all duration-200 ${
                      isActive ? 'bg-white/5 text-[#FACC15] border border-white/10' : 'text-white/70 hover:bg-white/5 hover:text-white'
                    }`}
                    onClick={(e) => handleScrollTo(e, item.href)}
                  >
                    <span className="text-sm font-bold tracking-wide uppercase">
                      {item.name}
                    </span>
                    {isActive && <ChevronRight size={16} />}
                  </a>
                </li>
              );
            })}
          </ul>
          
          <div className="pt-6 border-t border-white/10 space-y-4">
            <button 
              onClick={() => { setIsMenuOpen(false); onOpenQuote(); }}
              className="bg-[#FACC15] text-slate-900 w-full py-4 rounded-md font-bold uppercase tracking-wider text-xs shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              Get Free Estimate <ChevronRight size={14} />
            </button>
            
            <div className="flex justify-center flex-col items-center gap-2">
               <div className="flex items-center gap-2 text-[#FACC15]">
                 <Phone size={14} />
                 <a href={`tel:${CONFIG.PHONE_RAW}`} className="text-xs font-bold tracking-wide">{CONFIG.PHONE}</a>
               </div>
               <p className="text-[10px] text-white/40 uppercase font-semibold tracking-wider">Available Mon - Fri, 8am - 6pm</p>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Header;
