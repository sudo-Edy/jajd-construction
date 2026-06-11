/// <reference types="vite/client" />

/**
 * Google Analytics 4 integration.
 *
 * Loads gtag.js only when VITE_GA_MEASUREMENT_ID is configured, so local dev
 * and preview deploys never send analytics. To enable: set
 * VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX in the environment (Vercel dashboard or
 * .env.production) and redeploy.
 */

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
  }
}

const MEASUREMENT_ID: string | undefined = import.meta.env.VITE_GA_MEASUREMENT_ID;

let initialized = false;

export const initAnalytics = (): void => {
  if (initialized || !MEASUREMENT_ID) return;
  initialized = true;

  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(MEASUREMENT_ID)}`;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer.push(arguments);
  };
  window.gtag('js', new Date());
  // anonymize_ip for privacy compliance
  window.gtag('config', MEASUREMENT_ID, { anonymize_ip: true });
};

/** Fire a GA4 event. Safe no-op when analytics is not configured. */
export const trackEvent = (
  eventName: string,
  params?: Record<string, string | number | boolean>
): void => {
  if (!MEASUREMENT_ID || typeof window.gtag !== 'function') return;
  window.gtag('event', eventName, params ?? {});
};

import { trackSiteEvent } from './tracking';

// Pre-defined conversion events so names stay consistent everywhere.
// Each event goes to GA4 (when configured) AND to the first-party Supabase
// tracker that powers the admin Analytics dashboard.
export const analytics = {
  quoteModalOpen: (source: string) => {
    trackEvent('quote_modal_open', { source });
    trackSiteEvent('quote_modal_open', { source });
  },
  leadSubmitted: (project: string, property: string) => {
    trackEvent('generate_lead', { project_type: project, property_type: property });
    trackSiteEvent('lead_submitted', { project_type: project, property_type: property });
  },
  phoneClick: (location: string) => {
    trackEvent('phone_click', { location });
    trackSiteEvent('phone_click', { location });
  },
  textClick: (location: string) => {
    trackEvent('text_click', { location });
    trackSiteEvent('text_click', { location });
  },
  calendarDateSelected: (date: string) => {
    trackEvent('calendar_date_selected', { date });
    trackSiteEvent('calendar_date_selected', { date });
  },
  serviceCardClick: (service: string) => {
    trackEvent('service_card_click', { service });
    trackSiteEvent('service_card_click', { service });
  },
  popularProjectClick: (project: string, category: string) => {
    trackEvent('popular_project_click', { project, category });
    trackSiteEvent('popular_project_click', { project, category });
  },
  projectSearchSelect: (project: string, query: string) => {
    trackEvent('project_search_select', { project, query });
    trackSiteEvent('project_search_select', { project, query });
  },
};
