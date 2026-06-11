import React from 'react';
import { HardHat, Instagram, Facebook, Mail, MapPin, Phone, Award, ShieldCheck, MessageSquare } from 'lucide-react';
import { CONFIG, SMS_LINK } from '../config';
import { analytics } from '../utils/analytics';

interface FooterProps {
  onOpenQuote: () => void;
}

const Footer: React.FC<FooterProps> = ({ onOpenQuote }) => {
  const year = new Date().getFullYear();

  const socials = [
    { icon: Instagram, href: CONFIG.SOCIALS.INSTAGRAM, label: 'Instagram' },
    { icon: Facebook, href: CONFIG.SOCIALS.FACEBOOK, label: 'Facebook' },
  ].filter(s => s.href && s.href !== '#');

  return (
    <footer id="contact" className="bg-navy pt-20 pb-10 text-white border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand column */}
          <div className="space-y-6">
            <div className="flex items-center gap-2.5">
              <div className="bg-brand-400 p-1.5 rounded-lg">
                <HardHat className="w-5 h-5 text-navy" />
              </div>
              <span className="text-lg font-extrabold tracking-tight text-white">
                JAJD<span className="text-brand-400">&nbsp;Construction</span>
              </span>
            </div>
            <p className="text-white/60 text-sm leading-relaxed max-w-xs">
              Family-owned painting, siding, and roofing contractor based in Omaha.
              A licensed general contractor proudly serving homeowners and businesses
              across Nebraska.
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-full px-3 py-1.5 text-[11px] font-semibold text-white/80">
                <Award size={12} className="text-brand-400" /> BBB A+ Accredited
              </span>
              <span className="inline-flex items-center gap-1.5 bg-white/5 border border-white/10 rounded-full px-3 py-1.5 text-[11px] font-semibold text-white/80">
                <ShieldCheck size={12} className="text-brand-400" /> Licensed &amp; Insured
              </span>
            </div>
            {socials.length > 0 && (
              <div className="flex gap-3">
                {socials.map(({ icon: Icon, href, label }) => (
                  <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={`Follow us on ${label}`} className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:bg-brand-400 hover:text-navy transition-all">
                    <Icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Services (SEO-friendly internal anchors) */}
          <div>
            <h4 className="font-bold mb-6 text-xs uppercase tracking-wider text-white/90">Services</h4>
            <ul className="space-y-3 text-sm text-white/60">
              <li><a href="#projects" className="hover:text-brand-400 transition-colors">Interior &amp; Exterior Painting</a></li>
              <li><a href="#projects" className="hover:text-brand-400 transition-colors">Siding Installation &amp; Repair</a></li>
              <li><a href="#projects" className="hover:text-brand-400 transition-colors">Roofing &amp; Roof Replacement</a></li>
              <li><a href="#projects" className="hover:text-brand-400 transition-colors">Cabinet Refinishing</a></li>
              <li><a href="#projects" className="hover:text-brand-400 transition-colors">Decks &amp; Pressure Washing</a></li>
              <li><a href="#projects" className="hover:text-brand-400 transition-colors">Commercial Services</a></li>
            </ul>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="font-bold mb-6 text-xs uppercase tracking-wider text-white/90">Company</h4>
            <ul className="space-y-3 text-sm text-white/60">
              <li><button onClick={onOpenQuote} className="hover:text-brand-400 transition-colors">Request an Estimate</button></li>
              <li><a href="#portfolio" className="hover:text-brand-400 transition-colors">Recent Projects</a></li>
              <li><a href="/blog/" className="hover:text-brand-400 transition-colors">Journal &amp; Tips</a></li>
              <li><a href="#process" className="hover:text-brand-400 transition-colors">How It Works</a></li>
              <li><a href="#about" className="hover:text-brand-400 transition-colors">About Us</a></li>
              <li><a href="#reviews" className="hover:text-brand-400 transition-colors">Client Reviews</a></li>
              <li><a href="#faq" className="hover:text-brand-400 transition-colors">FAQ</a></li>
            </ul>
          </div>

          {/* Contact: consistent NAP for local SEO */}
          <div className="space-y-6">
            <h4 className="font-bold text-xs uppercase tracking-wider text-white/90">Get in Touch</h4>
            <ul className="space-y-5">
              <li className="flex gap-3.5 items-start">
                <div className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                   <MapPin className="w-4 h-4 text-brand-400" />
                </div>
                <div>
                  <h5 className="text-xs font-bold text-white uppercase tracking-wider mb-0.5">Based in</h5>
                  <span className="text-sm text-white/60">{CONFIG.ADDRESS}, serving all of Nebraska</span>
                </div>
              </li>
              <li className="flex gap-3.5 items-start">
                <div className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                   <Phone className="w-4 h-4 text-brand-400" />
                </div>
                <div>
                  <h5 className="text-xs font-bold text-white uppercase tracking-wider mb-0.5">Call or Text</h5>
                  <a href={`tel:${CONFIG.PHONE_RAW}`} onClick={() => analytics.phoneClick('footer')} className="text-sm font-semibold text-white/60 hover:text-white transition-colors">{CONFIG.PHONE}</a>
                  <p className="text-[11px] text-white/40 mt-0.5">Mon-Fri, 8am-6pm</p>
                  <a
                    href={SMS_LINK}
                    onClick={() => analytics.textClick('footer')}
                    className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-brand-400 hover:text-white transition-colors mt-1.5"
                  >
                    <MessageSquare size={12} /> Text us a photo of your project
                  </a>
                </div>
              </li>
              <li className="flex gap-3.5 items-start">
                <div className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                   <Mail className="w-4 h-4 text-brand-400" />
                </div>
                <div>
                  <h5 className="text-xs font-bold text-white uppercase tracking-wider mb-0.5">Email</h5>
                  <a href={`mailto:${CONFIG.EMAIL}`} className="text-sm font-semibold text-white/60 hover:text-white transition-colors lowercase break-all">{CONFIG.EMAIL}</a>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-3 text-[11px] font-medium text-white/35">
          <p>&copy; {year} {CONFIG.COMPANY_NAME}. All rights reserved. Omaha, Nebraska.</p>
          <p>Painting, siding, and roofing across Nebraska since 2014</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
