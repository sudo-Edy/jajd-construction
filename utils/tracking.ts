/// <reference types="vite/client" />

/**
 * First-party visit + event tracking stored in Supabase.
 *
 * Complements GA4: this data feeds the admin Analytics dashboard and includes
 * a human-vs-bot classification. RLS only allows anonymous INSERTs (no reads),
 * so visitors can write their own row but never read anyone else's.
 */

import { supabase } from './supabase';

export interface BotVerdict {
  isBot: boolean;
  reason: string;
}

/**
 * Heuristic bot detection. Most search-engine crawlers never execute JS at all
 * (so they never reach this code and are absent from the data); these checks
 * catch headless browsers and automation tools that do run JS.
 */
export const detectBot = (): BotVerdict => {
  try {
    const ua = navigator.userAgent || '';
    const uaPattern = /bot|crawl|spider|slurp|headless|lighthouse|pagespeed|puppeteer|playwright|phantomjs|selenium|wget|curl|python-requests|scrapy|httpclient|axios|node-fetch/i;

    if (uaPattern.test(ua)) return { isBot: true, reason: 'ua_pattern' };
    if ((navigator as any).webdriver) return { isBot: true, reason: 'webdriver_flag' };
    if (!navigator.languages || navigator.languages.length === 0) {
      return { isBot: true, reason: 'no_languages' };
    }
    if (typeof navigator.hardwareConcurrency === 'number' && navigator.hardwareConcurrency === 0) {
      return { isBot: true, reason: 'no_cores' };
    }
    if (window.outerWidth === 0 && window.outerHeight === 0) {
      return { isBot: true, reason: 'zero_window' };
    }
    return { isBot: false, reason: '' };
  } catch {
    return { isBot: false, reason: '' };
  }
};

const SESSION_KEY = 'jajd_session_id';
const VISIT_LOGGED_KEY = 'jajd_visit_logged';

export const getSessionId = (): string => {
  try {
    let id = sessionStorage.getItem(SESSION_KEY);
    if (!id) {
      id = (crypto.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`);
      sessionStorage.setItem(SESSION_KEY, id);
    }
    return id;
  } catch {
    return 'no-storage';
  }
};

const deviceType = (): string => {
  const w = window.innerWidth;
  if (w < 768) return 'mobile';
  if (w < 1024) return 'tablet';
  return 'desktop';
};

/** Log one visit per browser session. Fire-and-forget; never blocks the UI. */
export const trackVisit = (): void => {
  try {
    if (sessionStorage.getItem(VISIT_LOGGED_KEY)) return;
    sessionStorage.setItem(VISIT_LOGGED_KEY, '1');
  } catch {
    /* storage unavailable, still try to log the visit */
  }

  const verdict = detectBot();
  const params = new URLSearchParams(window.location.search);

  void supabase.from('site_visits').insert({
    session_id: getSessionId(),
    page: window.location.pathname || '/',
    referrer: (document.referrer || '').slice(0, 500),
    user_agent: (navigator.userAgent || '').slice(0, 500),
    device: deviceType(),
    screen_width: window.screen?.width ?? null,
    language: navigator.language || null,
    is_bot: verdict.isBot,
    bot_reason: verdict.reason || null,
    utm_source: params.get('utm_source'),
    utm_medium: params.get('utm_medium'),
    utm_campaign: params.get('utm_campaign'),
  }).then(({ error }) => {
    if (error && import.meta.env.DEV) console.warn('visit tracking:', error.message);
  });
};

/** Log a named interaction event (click, lead, etc.). Fire-and-forget. */
export const trackSiteEvent = (
  eventName: string,
  metadata?: Record<string, string | number | boolean>
): void => {
  void supabase.from('site_events').insert({
    session_id: getSessionId(),
    event_name: eventName,
    is_bot: detectBot().isBot,
    metadata: metadata ?? {},
  }).then(({ error }) => {
    if (error && import.meta.env.DEV) console.warn('event tracking:', error.message);
  });
};
