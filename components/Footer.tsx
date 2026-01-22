import React from 'react';
import { HardHat, Instagram, Facebook, Linkedin, Twitter, Mail, MapPin, Phone } from 'lucide-react';
import { CONFIG } from '../config';

interface FooterProps {
  onOpenQuote: () => void;
}

const Footer: React.FC<FooterProps> = ({ onOpenQuote }) => {
  return (
    <footer id="footer" className="bg-slate-900 pt-24 pb-12 text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-24">
          <div className="space-y-8">
            <div className="flex items-center gap-3">
              <HardHat className="w-10 h-10 text-[#FACC15]" />
              <span className="text-2xl font-black tracking-tighter">
                JAJD<span className="text-[#FACC15]">CONSTRUCTION</span>
              </span>
            </div>
            <p className="text-white/50 text-sm font-medium">
              Setting the master standard in construction management.
            </p>
            <div className="flex gap-4">
              {[Instagram, Facebook, Linkedin, Twitter].map((Icon, i) => (
                <a key={i} href="#" aria-label={`Follow us on ${Icon.name}`} className="w-11 h-11 rounded-full border border-white/10 flex items-center justify-center hover:bg-[#FACC15] hover:text-slate-900 transition-all">
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-black mb-8 text-[11px] uppercase tracking-[0.3em] text-[#FACC15]">Quick Links</h4>
            <ul className="space-y-4 text-xs font-bold uppercase tracking-widest text-white/50">
              <li><button onClick={onOpenQuote} className="hover:text-white transition-colors">Request Estimate</button></li>
              <li><a href="#services" className="hover:text-white transition-colors">Our Services</a></li>
              <li><a href="#process" className="hover:text-white transition-colors">How it Works</a></li>
              <li><a href="#inspiration" className="hover:text-white transition-colors">Resources</a></li>
            </ul>
          </div>

          <div className="col-span-2 space-y-8">
            <h4 className="font-black mb-8 text-[11px] uppercase tracking-[0.3em] text-[#FACC15]">Get In Touch</h4>
            <ul className="space-y-6">
              <li className="flex gap-4 items-start">
                <MapPin className="w-5 h-5 text-[#FACC15]" />
                <span className="text-xs font-bold text-white/60 uppercase tracking-widest leading-relaxed">
                  {CONFIG.ADDRESS}
                </span>
              </li>
              <li className="flex gap-4 items-center">
                <Phone className="w-5 h-5 text-[#FACC15]" />
                <a href={`tel:${CONFIG.PHONE_RAW}`} className="text-sm font-black text-white">{CONFIG.PHONE}</a>
              </li>
              <li className="flex gap-4 items-center">
                <Mail className="w-5 h-5 text-[#FACC15]" />
                <a href={`mailto:${CONFIG.EMAIL}`} className="text-xs font-bold text-white/60 lowercase tracking-widest">{CONFIG.EMAIL}</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] uppercase tracking-[0.3em] font-black text-white/20">
          <p>© 2024 {CONFIG.COMPANY_NAME}. Licensed General Contractor.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;