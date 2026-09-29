import React, { useEffect, useState } from 'react';
import { Phone, MessageSquare, ArrowRight } from 'lucide-react';
import { CONFIG, SMS_LINK } from '../config';
import { analytics } from '../utils/analytics';

interface MobileActionBarProps {
  onOpenQuote: () => void;
}

/**
 * Thumb-zone action bar for phones: Call / Text / Free Estimate.
 * Most homeowners prefer to call, then text, then a form, so the bar keeps
 * all three one tap away. It slides in once the hero's own estimate card has
 * scrolled away and steps aside at the footer, which already lists phone and
 * text, so it never doubles up with another ask on screen.
 */
const MobileActionBar: React.FC<MobileActionBarProps> = ({ onOpenQuote }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const footer = document.getElementById('contact');
      const atFooter = !!footer && footer.getBoundingClientRect().top < window.innerHeight;
      setVisible(window.scrollY > window.innerHeight * 0.9 && !atFooter);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div
      className={`lg:hidden fixed inset-x-0 bottom-0 z-[60] bg-navy/95 backdrop-blur-md border-t border-white/10 px-3 pt-2.5 pb-[calc(0.625rem+env(safe-area-inset-bottom))] transition-transform duration-300 ${
        visible ? 'translate-y-0' : 'translate-y-full'
      }`}
      aria-hidden={!visible}
    >
      <div className="grid grid-cols-[1fr_1fr_1.6fr] gap-2 max-w-md mx-auto">
        <a
          href={`tel:${CONFIG.PHONE_RAW}`}
          onClick={() => analytics.phoneClick('mobile_bar')}
          tabIndex={visible ? 0 : -1}
          className="flex flex-col items-center justify-center gap-0.5 min-h-[52px] rounded-xl border border-white/15 text-white active:bg-white/10"
        >
          <Phone className="w-5 h-5 text-brand-400" aria-hidden="true" />
          <span className="text-[11px] font-bold">Call</span>
        </a>
        <a
          href={SMS_LINK}
          onClick={() => analytics.textClick('mobile_bar')}
          tabIndex={visible ? 0 : -1}
          className="flex flex-col items-center justify-center gap-0.5 min-h-[52px] rounded-xl border border-white/15 text-white active:bg-white/10"
        >
          <MessageSquare className="w-5 h-5 text-brand-400" aria-hidden="true" />
          <span className="text-[11px] font-bold">Text</span>
        </a>
        <button
          onClick={onOpenQuote}
          tabIndex={visible ? 0 : -1}
          className="flex items-center justify-center gap-1.5 min-h-[52px] rounded-xl bg-brand-400 text-navy font-bold text-sm active:scale-[0.98] transition-transform"
        >
          Free Estimate <ArrowRight className="w-4 h-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
};

export default MobileActionBar;
