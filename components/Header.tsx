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
    { name: 'About', href: '#about' },
    { name: 'Reviews', href: '#reviews' },
    { name: 'Contact', href: '#footer' }
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
      const scrollPosition = window.scrollY + 150;
      if (window.scrollY < 100) {
        setActiveSection('home');
        return;
      }
      const sections = navLinks.map(link => link.href.replace('#', '')).filter(id => id !== '');
      let currentSection = 'home';
      for (const sectionId of sections) {
        const element = document.getElementById(sectionId);
        if (element) {
          if (scrollPosition >= element.offsetTop) currentSection = sectionId;
        }
      }
      setActiveSection(currentSection);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleScrollTo = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setIsMenuOpen(false);
    const targetId = href.replace('#', '');
    if (targetId === '') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const element = document.getElementById(targetId);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 80,
        behavior: 'smooth'
      });
    }
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${
        isScrolled ? 'bg-white/90 backdrop-blur-md shadow-lg py-4' : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <HardHat className={`w-8 h-8 ${isScrolled ? 'text-slate-900' : 'text-accent'}`} />
          <span className={`text-xl font-black tracking-tighter ${isScrolled ? 'text-slate-900' : 'text-white'}`}>
            JAJD<span className="text-accent">CONSTRUCTION</span>
          </span>
        </div>

        <nav className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={(e) => handleScrollTo(e, link.href)}
              className={`text-[10px] font-black uppercase tracking-[0.2em] transition-all hover:text-accent ${
                (activeSection === link.href.replace('#', '')) || (link.href === '#' && activeSection === 'home')
                  ? 'text-accent' 
                  : isScrolled ? 'text-slate-900' : 'text-white'
              }`}
            >
              {link.name}
            </a>
          ))}
          <button
            onClick={onOpenQuote}
            className="bg-accent text-slate-900 px-6 py-3 rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-slate-900 hover:text-white transition-all shadow-xl flex items-center gap-2"
          >
            Free Quote <ChevronRight size={14} />
          </button>
        </nav>

        <button 
          className="lg:hidden p-2"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? (
            <X className={isScrolled ? 'text-slate-900' : 'text-white'} />
          ) : (
            <Menu className={isScrolled ? 'text-slate-900' : 'text-white'} />
          )}
        </button>
      </div>

      <div className={`lg:hidden fixed inset-0 top-[72px] bg-slate-900 transition-all duration-500 ${isMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full pointer-events-none'}`}>
        <div className="p-8 space-y-8">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={(e) => handleScrollTo(e, link.href)}
              className="block text-2xl font-black text-white uppercase tracking-widest hover:text-accent transition-colors"
            >
              {link.name}
            </a>
          ))}
          <button
            onClick={() => {
              onOpenQuote();
              setIsMenuOpen(false);
            }}
            className="w-full bg-accent text-slate-900 py-6 rounded-2xl font-black uppercase tracking-widest text-xs shadow-2xl"
          >
            Request Free Estimate
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;