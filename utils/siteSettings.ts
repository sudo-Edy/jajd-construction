/**
 * Site settings stored as key/value rows in Supabase (`site_settings` table).
 * Public read, authenticated write, lets the admin command center control
 * SEO metadata and section background imagery without a redeploy.
 */

import { supabase } from './supabase';

/** Known setting keys (free-form keys are also allowed). */
export const SETTING_KEYS = {
  // SEO
  SEO_TITLE: 'seo_title',
  SEO_DESCRIPTION: 'seo_description',
  SEO_KEYWORDS: 'seo_keywords',
  OG_IMAGE: 'og_image',
  // Appearance (image URLs, usually from project photos)
  HERO_BACKGROUND: 'hero_background',
  ABOUT_IMAGE: 'about_image',
  CTA_BACKGROUND: 'cta_background',
} as const;

export type SiteSettings = Record<string, string>;

export const fetchSiteSettings = async (): Promise<SiteSettings> => {
  const { data, error } = await supabase
    .from('site_settings')
    .select('key, value');

  if (error) {
    // Table may not exist yet (SQL not run), so the site falls back to defaults.
    console.warn('site_settings unavailable:', error.message);
    return {};
  }

  const settings: SiteSettings = {};
  for (const row of data ?? []) {
    if (row.key && typeof row.value === 'string') settings[row.key] = row.value;
  }
  return settings;
};

export const saveSiteSetting = async (key: string, value: string): Promise<void> => {
  const { error } = await supabase
    .from('site_settings')
    .upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: 'key' });
  if (error) throw error;
};

export const deleteSiteSetting = async (key: string): Promise<void> => {
  const { error } = await supabase.from('site_settings').delete().eq('key', key);
  if (error) throw error;
};

/** Apply SEO overrides to the live document (title + meta tags). */
export const applySeoSettings = (settings: SiteSettings): void => {
  const setMeta = (selector: string, content: string) => {
    const el = document.head.querySelector<HTMLMetaElement>(selector);
    if (el) el.content = content;
  };

  if (settings.seo_title) {
    document.title = settings.seo_title;
    setMeta('meta[property="og:title"]', settings.seo_title);
    setMeta('meta[name="twitter:title"]', settings.seo_title);
  }
  if (settings.seo_description) {
    setMeta('meta[name="description"]', settings.seo_description);
    setMeta('meta[property="og:description"]', settings.seo_description);
    setMeta('meta[name="twitter:description"]', settings.seo_description);
  }
  if (settings.seo_keywords) {
    setMeta('meta[name="keywords"]', settings.seo_keywords);
  }
  if (settings.og_image) {
    setMeta('meta[property="og:image"]', settings.og_image);
    setMeta('meta[name="twitter:image"]', settings.og_image);
  }
};
