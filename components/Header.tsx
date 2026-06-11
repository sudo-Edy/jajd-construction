import React, { useState, useEffect } from 'react';
import { Menu, X, HardHat, Phone, ChevronRight, MessageSquare } from 'lucide-react';
import { CONFIG, SMS_LINK } from '../config';
import { analytics } from '../utils/analytics';
import FlipWord from './FlipWord';

interface HeaderProps {
  onOpenQuote: () => void;
}

const NAV_LINKS = [
  { name: 'Home', href: '#' },
  { name: 'Projects', href: '#projects' },
  { name: 'Our Work', href: '#portfolio' },
  { name: 'Schedule', href: '#schedule' },
  { name: 'About', href: '#about' },
  { name: 'Reviews', href: '#reviews' },
  { name: 'Tips', href: '/blog/' },
  { name: 'Contact', href: '#contact' },
];

const Header: React.FC<HeaderProps> = ({ onOpenQuote }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);

      const scrollPosition = window.scrollY + 150;

      if (window.scrollY < 100) {
        setActiveSection('home');
        return;
      }

      if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 100) {
        setActiveSection('contact');
        return;
      }

      const sections = NAV_LINKS
        .map(link => link.href.replace('#', ''))
        .filter(id => id !== '');

      let currentSection = 'home';
      for (const sectionId of sections) {
        const element = document.getElementById(sectionId);
        if (element && scrollPosition >= element.offsetTop) {
          currentSection = sectionId;
        }
      }
      setActiveSection(currentSection);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
        const headerOffset = 84;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
      }
    }
  };

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ease-out border-b ${
        isScrolled
          ? 'bg-navy/95 backdrop-blur-md py-3 shadow-lg border-white/5'
          : 'bg-gradient-to-b from-navy/70 to-transparent py-4 md:py-5 border-transparent'
      }`}
      aria-label="Main navigation"
    >
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        {/* Brand */}
        <a
          href="#"
          className="flex items-center gap-2.5 cursor-pointer select-none"
          onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          aria-label="JAJD Construction, back to top"
        >
          <div className="bg-brand-400 p-1.5 rounded-lg">
            <HardHat className="w-5 h-5 text-navy" aria-hidden="true" />
          </div>
          <span className="text-lg font-extrabold tracking-tight text-white flex items-baseline">
            JAJD&nbsp;<FlipWord className="text-brand-400" />
          </span>
        </a>

        {/* Desktop nav */}
        <div className="hidden lg:flex items-center">
          <ul className="flex items-center gap-7 mr-8">
            {NAV_LINKS.map((item) => {
              const itemID = item.href.replace('#', '') || 'home';
              const isActive = activeSection === itemID;
              return (
                <li key={item.name}>
                  <a
                    href={item.href}
                    onClick={(e) => handleScrollTo(e, item.href)}
                    className={`text-[13px] font-semibold transition-colors duration-200 relative py-1 hover:text-white ${
                      isActive ? 'text-white' : 'text-white/60'
                    }`}
                  >
                    {item.name}
                    <span className={`absolute -bottom-1 left-0 h-0.5 bg-brand-400 transition-all duration-200 ${isActive ? 'w-full opacity-100' : 'w-0 opacity-0'}`} />
                  </a>
                </li>
              );
            })}
          </ul>

          <a
            href={`tel:${CONFIG.PHONE_RAW}`}
            onClick={() => analytics.phoneClick('header')}
            className="flex items-center gap-2 border border-white/15 rounded-lg px-4 py-2 mr-3 text-sm font-semibold text-white hover:bg-white/10 transition-colors"
          >
            <Phone className="w-4 h-4 text-brand-400" aria-hidden="true" />
            {CONFIG.PHONE}
          </a>

          <button
            onClick={onOpenQuote}
            className="bg-brand-400 text-navy px-5 py-2.5 rounded-lg font-bold text-sm hover:bg-white transition-all shadow-md active:scale-95"
          >
            Free Estimate
          </button>
        </div>

        {/* Mobile toggle */}
        <button
          className="lg:hidden text-white p-2 hover:bg-white/10 rounded-md transition-colors focus:outline-none"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-expanded={isMenuOpen}
          aria-label="Toggle navigation menu"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-navy border-t border-white/10 p-5 flex flex-col gap-5 shadow-2xl animate-in slide-in-from-top duration-200 max-h-[85vh] overflow-y-auto">
          <ul className="flex flex-col gap-1">
            {NAV_LINKS.map((item) => {
              const itemID = item.href.replace('#', '') || 'home';
              const isActive = activeSection === itemID;
              return (
                <li key={item.name}>
                  <a
                    href={item.href}
                    className={`flex items-center justify-between px-4 py-3.5 rounded-lg transition-all duration-200 ${
                      isActive ? 'bg-white/5 text-brand-400' : 'text-white/75 hover:bg-white/5 hover:text-white'
                    }`}
                    onClick={(e) => handleScrollTo(e, item.href)}
                  >
                    <span className="text-sm font-semibold">{item.name}</span>
                    {isActive && <ChevronRight size={16} />}
                  </a>
                </li>
              );
            })}
          </ul>

          <div className="pt-4 border-t border-white/10 space-y-4">
            <button
              onClick={() => { setIsMenuOpen(false); onOpenQuote(); }}
              className="bg-brand-400 text-navy w-full py-4 rounded-xl font-bold text-sm shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              Get a Free Estimate <ChevronRight size={14} />
            </button>

            <a
              href={SMS_LINK}
              onClick={() => { setIsMenuOpen(false); analytics.textClick('mobile_menu'); }}
              className="border border-white/15 text-white w-full py-4 rounded-xl font-bold text-sm active:scale-95 transition-all flex items-center justify-center gap-2 hover:bg-white/10"
            >
              <MessageSquare size={14} className="text-brand-400" /> Text Us a Photo of Your Project
            </a>

            <div className="flex justify-center flex-col items-center gap-1.5">
               <a
                 href={`tel:${CONFIG.PHONE_RAW}`}
                 onClick={() => analytics.phoneClick('mobile_menu')}
                 className="flex items-center gap-2 text-brand-400 text-sm font-bold"
               >
                 <Phone size={14} /> {CONFIG.PHONE}
               </a>
               <p className="text-[11px] text-white/40 font-medium">Call or text, Mon-Fri, 8am-6pm in Omaha, NE</p>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Header;
