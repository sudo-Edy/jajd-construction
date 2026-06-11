import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { fetchSiteSettings, applySeoSettings, SiteSettings } from '../utils/siteSettings';

interface SiteSettingsContextType {
  settings: SiteSettings;
  /** Get a setting value, falling back to the provided default. */
  get: (key: string, fallback: string) => string;
  loaded: boolean;
}

const SiteSettingsContext = createContext<SiteSettingsContextType>({
  settings: {},
  get: (_key, fallback) => fallback,
  loaded: false,
});

export const SiteSettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<SiteSettings>({});
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetchSiteSettings().then((s) => {
      if (cancelled) return;
      setSettings(s);
      setLoaded(true);
      applySeoSettings(s);
    });
    return () => { cancelled = true; };
  }, []);

  const get = (key: string, fallback: string) => settings[key] || fallback;

  return (
    <SiteSettingsContext.Provider value={{ settings, get, loaded }}>
      {children}
    </SiteSettingsContext.Provider>
  );
};

export const useSiteSettings = () => useContext(SiteSettingsContext);
