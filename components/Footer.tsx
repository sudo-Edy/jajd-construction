import React from 'react';
import { HardHat, Instagram, Facebook, Linkedin, Twitter, Mail, MapPin, Phone } from 'lucide-react';
import { CONFIG } from '../config';

interface FooterProps {
  onOpenQuote: () => void;
}

const Footer: React.FC<FooterProps> = ({ onOpenQuote }) => {
  return (
    <footer id="footer" className="bg-slate-900 pt-24 pb-12 text-white overflow-hidden border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
          <div className="space-y-8">
            <div className="flex items-center gap-3">
              <div className="bg-[#FACC15] p-1.5 rounded-md">
                <HardHat className="w-6 h-6 text-slate-900" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                JAJD<span className="text-[#FACC15]">CONSTRUCTION</span>
              </span>
            </div>
            <p className="text-white/60 text-sm font-medium leading-relaxed max-w-xs">
              Setting the master standard in construction management across Omaha. Professional, reliable, and built to last.
            </p>
            <div className="flex gap-4">
              {[Instagram, Facebook, Linkedin, Twitter].map((Icon, i) => (
                <a key={i} href="#" aria-label={`Follow us on ${Icon.name}`} className="w-10 h-10 rounded-md bg-white/5 border border-white/10 flex items-center justify-center hover:bg-[#FACC15] hover:text-slate-900 transition-all hover:-translate-y-1">
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-bold mb-8 text-xs uppercase tracking-wider text-white">Quick Links</h4>
            <ul className="space-y-4 text-sm font-medium text-white/60">
              <li><button onClick={onOpenQuote} className="hover:text-[#FACC15] transition-colors">Request Estimate</button></li>
              <li><a href="#services" className="hover:text-[#FACC15] transition-colors">Our Services</a></li>
              <li><a href="#process" className="hover:text-[#FACC15] transition-colors">How it Works</a></li>
              <li><a href="#reviews" className="hover:text-[#FACC15] transition-colors">Client Reviews</a></li>
            </ul>
          </div>

          <div className="col-span-2 space-y-8">
            <h4 className="font-bold mb-8 text-xs uppercase tracking-wider text-white">Get In Touch</h4>
            <div className="grid sm:grid-cols-2 gap-8">
              <ul className="space-y-6">
                <li className="flex gap-4 items-start group">
                  <div className="w-10 h-10 rounded-md bg-white/5 flex items-center justify-center shrink-0 group-hover:bg-[#FACC15] group-hover:text-slate-900 transition-colors">
                     <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-white uppercase tracking-wider mb-1">Headquarters</h5>
                    <span className="text-sm font-medium text-white/60 leading-relaxed block max-w-[200px]">
                      {CONFIG.ADDRESS}
                    </span>
                  </div>
                </li>
              </ul>
              <ul className="space-y-6">
                <li className="flex gap-4 items-start group">
                  <div className="w-10 h-10 rounded-md bg-white/5 flex items-center justify-center shrink-0 group-hover:bg-[#FACC15] group-hover:text-slate-900 transition-colors">
                     <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-white uppercase tracking-wider mb-1">Phone</h5>
                    <a href={`tel:${CONFIG.PHONE_RAW}`} className="text-sm font-semibold text-white/60 hover:text-white transition-colors">{CONFIG.PHONE}</a>
                    <p className="text-[10px] text-white/40 mt-1">Mon-Fri, 8am-6pm</p>
                  </div>
                </li>
                <li className="flex gap-4 items-start group">
                  <div className="w-10 h-10 rounded-md bg-white/5 flex items-center justify-center shrink-0 group-hover:bg-[#FACC15] group-hover:text-slate-900 transition-colors">
                     <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-white uppercase tracking-wider mb-1">Email</h5>
                    <a href={`mailto:${CONFIG.EMAIL}`} className="text-sm font-semibold text-white/60 hover:text-white transition-colors lowercase">{CONFIG.EMAIL}</a>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-bold text-white/30 uppercase tracking-wider">
          <p>© 2024 {CONFIG.COMPANY_NAME}. All Rights Reserved.</p>
          <div className="flex gap-8">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
