import React, { useEffect, useState } from 'react';
import { supabase } from '../../utils/supabase';
import { fetchSiteSettings, saveSiteSetting, deleteSiteSetting, SETTING_KEYS } from '../../utils/siteSettings';
import { Loader2, CheckCircle2, AlertTriangle, ImageOff, Image as ImageIcon } from 'lucide-react';

interface GalleryImage {
  url: string;
  label: string;
}

interface Slot {
  key: string;
  title: string;
  description: string;
}

const SLOTS: Slot[] = [
  {
    key: SETTING_KEYS.HERO_BACKGROUND,
    title: 'Homepage hero background',
    description: 'The big photo behind the headline at the top of the site. Wide exterior shots work best.',
  },
  {
    key: SETTING_KEYS.ABOUT_IMAGE,
    title: 'About section photo',
    description: 'The photo next to "The contractor your neighbors already trust." Crew or work-in-progress shots work great.',
  },
  {
    key: SETTING_KEYS.CTA_BACKGROUND,
    title: '"Ready to start" banner background',
    description: 'Optional dimmed photo behind the dark call-to-action panel. Leave on default for a solid color.',
  },
];

const AppearanceManager: React.FC = () => {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [assignments, setAssignments] = useState<Record<string, string>>({});
  const [activeSlot, setActiveSlot] = useState<string>(SLOTS[0].key);
  const [loading, setLoading] = useState(true);
  const [savedMsg, setSavedMsg] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [setupNeeded, setSetupNeeded] = useState(false);

  useEffect(() => {
    const load = async () => {
      // Pull every image from the project portfolio (thumbnails + gallery images)
      const [projectsRes, imagesRes, settings] = await Promise.all([
        supabase.from('projects').select('title, thumbnail_url'),
        supabase.from('project_images').select('image_url, caption, project_id, projects(title)'),
        fetchSiteSettings(),
      ]);

      const seen = new Set<string>();
      const gallery: GalleryImage[] = [];

      for (const p of projectsRes.data ?? []) {
        if (p.thumbnail_url && !seen.has(p.thumbnail_url)) {
          seen.add(p.thumbnail_url);
          gallery.push({ url: p.thumbnail_url, label: p.title ?? 'Project' });
        }
      }
      for (const img of (imagesRes.data ?? []) as any[]) {
        if (img.image_url && !seen.has(img.image_url)) {
          seen.add(img.image_url);
          gallery.push({ url: img.image_url, label: img.caption || img.projects?.title || 'Project photo' });
        }
      }

      setImages(gallery);
      setAssignments({
        [SETTING_KEYS.HERO_BACKGROUND]: settings[SETTING_KEYS.HERO_BACKGROUND] ?? '',
        [SETTING_KEYS.ABOUT_IMAGE]: settings[SETTING_KEYS.ABOUT_IMAGE] ?? '',
        [SETTING_KEYS.CTA_BACKGROUND]: settings[SETTING_KEYS.CTA_BACKGROUND] ?? '',
      });
      setLoading(false);
    };
    load();
  }, []);

  const assign = async (slotKey: string, url: string) => {
    setError(null);
    const prev = assignments[slotKey];
    setAssignments(a => ({ ...a, [slotKey]: url }));
    try {
      if (url) {
        await saveSiteSetting(slotKey, url);
      } else {
        await deleteSiteSetting(slotKey);
      }
      const slot = SLOTS.find(s => s.key === slotKey);
      setSavedMsg(`${slot?.title ?? 'Setting'} updated, live on the site now.`);
      setTimeout(() => setSavedMsg(''), 3500);
    } catch (err: any) {
      setAssignments(a => ({ ...a, [slotKey]: prev }));
      if (/does not exist|relation|schema cache/i.test(err.message ?? '')) {
        setSetupNeeded(true);
      } else {
        setError(err.message ?? 'Failed to save');
      }
    }
  };

  if (loading) {
    return <div className="flex justify-center py-24"><Loader2 className="w-8 h-8 text-brand-400 animate-spin" /></div>;
  }

  if (setupNeeded) {
    return (
      <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-10 text-center space-y-4">
        <AlertTriangle className="w-10 h-10 text-amber-500 mx-auto" />
        <h3 className="text-xl font-bold text-slate-900">Settings table not set up yet</h3>
        <p className="text-slate-600 max-w-xl mx-auto">
          Run <code className="bg-white px-2 py-0.5 rounded border border-amber-200 font-mono text-sm">admin_upgrade_setup.sql</code> in
          your Supabase SQL Editor first, then come back here.
        </p>
      </div>
    );
  }

  const activeSlotData = SLOTS.find(s => s.key === activeSlot)!;
  const currentUrl = assignments[activeSlot];

  return (
    <div className="space-y-8">
      <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5 text-sm text-blue-900 leading-relaxed">
        <strong>Use your real photos:</strong> pick a spot on the site, then click any photo from
        your project gallery to use it there. Changes go live immediately. "Use default" switches
        back to the built-in stock image.
      </div>

      {/* Slot selector */}
      <div className="grid md:grid-cols-3 gap-4">
        {SLOTS.map(slot => {
          const isActive = activeSlot === slot.key;
          const assigned = assignments[slot.key];
          return (
            <button
              key={slot.key}
              onClick={() => setActiveSlot(slot.key)}
              className={`text-left p-5 rounded-2xl border-2 transition-all space-y-2 ${
                isActive ? 'border-brand-400 bg-brand-50/50 shadow-sm' : 'border-slate-200 bg-white hover:border-brand-400/50'
              }`}
            >
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-slate-900 text-sm">{slot.title}</h3>
                {assigned
                  ? <span className="text-[10px] font-bold uppercase bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded">Custom</span>
                  : <span className="text-[10px] font-bold uppercase bg-slate-100 text-slate-500 px-2 py-0.5 rounded">Default</span>}
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">{slot.description}</p>
              {assigned && (
                <img src={assigned} alt="" className="w-full h-20 object-cover rounded-lg border border-slate-200" />
              )}
            </button>
          );
        })}
      </div>

      {savedMsg && (
        <div className="flex items-center gap-2 text-emerald-700 bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-3 text-sm font-bold animate-in fade-in">
          <CheckCircle2 size={16} /> {savedMsg}
        </div>
      )}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm font-semibold text-red-800">{error}</div>
      )}

      {/* Image picker */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <h3 className="font-bold text-slate-900 flex items-center gap-2">
            <ImageIcon size={16} className="text-brand-500" />
            Choose a photo for: <span className="text-brand-600">{activeSlotData.title}</span>
          </h3>
          <button
            onClick={() => assign(activeSlot, '')}
            disabled={!currentUrl}
            className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-600 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-slate-200 transition-colors disabled:opacity-40"
          >
            <ImageOff size={14} /> Use default
          </button>
        </div>

        {images.length === 0 ? (
          <p className="text-sm text-slate-400 py-8 text-center">
            No project photos yet. Add projects (with photos) in the Projects tab and they'll show up here.
          </p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map(img => {
              const isSelected = currentUrl === img.url;
              return (
                <button
                  key={img.url}
                  onClick={() => assign(activeSlot, img.url)}
                  className={`group relative rounded-xl overflow-hidden border-2 transition-all aspect-[4/3] ${
                    isSelected ? 'border-brand-400 ring-2 ring-brand-400/40' : 'border-slate-200 hover:border-brand-400/60'
                  }`}
                >
                  <img src={img.url} alt={img.label} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-900/80 to-transparent p-2.5 pt-6">
                    <p className="text-[11px] font-bold text-white truncate">{img.label}</p>
                  </div>
                  {isSelected && (
                    <div className="absolute top-2 right-2 bg-brand-400 text-slate-900 rounded-full p-1">
                      <CheckCircle2 size={14} />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default AppearanceManager;
