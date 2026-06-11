import React, { useEffect, useState } from 'react';
import { fetchSiteSettings, saveSiteSetting, deleteSiteSetting, SETTING_KEYS } from '../../utils/siteSettings';
import { Loader2, Save, CheckCircle2, AlertTriangle, RotateCcw, Search } from 'lucide-react';

const DEFAULTS = {
  title: 'JAJD Construction | Painting, Siding & Roofing Contractor in Omaha, NE',
  description: "JAJD Construction is Omaha's family-owned painting, siding, and roofing contractor. A licensed general contractor, BBB A+ accredited, serving homeowners across Nebraska. Free estimates.",
  keywords: 'painting contractor Omaha, house painters Omaha, siding contractor Omaha, roofing contractor Omaha, general contractor Omaha, Nebraska painting siding roofing, JAJD Construction',
};

const TITLE_LIMIT = 60;
const DESC_LIMIT = 160;

const SeoManager: React.FC = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [keywords, setKeywords] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [setupNeeded, setSetupNeeded] = useState(false);

  useEffect(() => {
    fetchSiteSettings().then(settings => {
      setTitle(settings[SETTING_KEYS.SEO_TITLE] ?? '');
      setDescription(settings[SETTING_KEYS.SEO_DESCRIPTION] ?? '');
      setKeywords(settings[SETTING_KEYS.SEO_KEYWORDS] ?? '');
      setLoading(false);
    });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    setSaved(false);
    try {
      const ops: Promise<void>[] = [];
      const upsertOrClear = (key: string, value: string) =>
        value.trim() ? saveSiteSetting(key, value.trim()) : deleteSiteSetting(key);

      ops.push(upsertOrClear(SETTING_KEYS.SEO_TITLE, title));
      ops.push(upsertOrClear(SETTING_KEYS.SEO_DESCRIPTION, description));
      ops.push(upsertOrClear(SETTING_KEYS.SEO_KEYWORDS, keywords));
      await Promise.all(ops);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err: any) {
      if (/does not exist|relation|schema cache/i.test(err.message ?? '')) {
        setSetupNeeded(true);
      } else {
        setError(err.message ?? 'Failed to save');
      }
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setTitle('');
    setDescription('');
    setKeywords('');
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

  const effectiveTitle = title.trim() || DEFAULTS.title;
  const effectiveDesc = description.trim() || DEFAULTS.description;

  return (
    <div className="max-w-3xl space-y-8">
      <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5 text-sm text-blue-900 leading-relaxed">
        <strong>How this works:</strong> leave a field empty to use the built-in default (shown as
        the placeholder). Anything you enter here overrides what Google and social media see, and
        changes apply instantly with no redeploy needed.
      </div>

      {/* Title */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-700">Page title</label>
          <span className={`text-xs font-bold ${ (title || DEFAULTS.title).length > TITLE_LIMIT ? 'text-red-500' : 'text-slate-400'}`}>
            {(title || DEFAULTS.title).length}/{TITLE_LIMIT}
          </span>
        </div>
        <input
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder={DEFAULTS.title}
          className="w-full bg-white border-2 border-slate-200 rounded-xl px-4 py-3.5 focus:outline-none focus:border-brand-400 font-medium text-slate-900"
        />
        <p className="text-xs text-slate-400">Aim for under {TITLE_LIMIT} characters. Put the most important words (service + city) first.</p>
      </div>

      {/* Description */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-700">Meta description</label>
          <span className={`text-xs font-bold ${(description || DEFAULTS.description).length > DESC_LIMIT ? 'text-red-500' : 'text-slate-400'}`}>
            {(description || DEFAULTS.description).length}/{DESC_LIMIT}
          </span>
        </div>
        <textarea
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder={DEFAULTS.description}
          rows={3}
          className="w-full bg-white border-2 border-slate-200 rounded-xl px-4 py-3.5 focus:outline-none focus:border-brand-400 font-medium text-slate-900 resize-none"
        />
        <p className="text-xs text-slate-400">This is your ad copy in Google results. Mention services, Omaha and Nebraska, and the free estimate.</p>
      </div>

      {/* Keywords */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-700">Keywords (comma-separated)</label>
        <textarea
          value={keywords}
          onChange={e => setKeywords(e.target.value)}
          placeholder={DEFAULTS.keywords}
          rows={2}
          className="w-full bg-white border-2 border-slate-200 rounded-xl px-4 py-3.5 focus:outline-none focus:border-brand-400 font-medium text-slate-900 resize-none"
        />
        <p className="text-xs text-slate-400">Minor signal for search engines, still read by some AI crawlers.</p>
      </div>

      {/* Google preview */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2"><Search size={14} /> Google preview</label>
        <div className="bg-white border border-slate-200 rounded-2xl p-6">
          <p className="text-xs text-slate-700">jajdconstruction.com</p>
          <p className="text-xl text-blue-700 font-medium leading-snug mt-1 hover:underline cursor-default">
            {effectiveTitle.slice(0, TITLE_LIMIT + 10)}{effectiveTitle.length > TITLE_LIMIT + 10 ? '…' : ''}
          </p>
          <p className="text-sm text-slate-600 mt-1 leading-relaxed">
            {effectiveDesc.slice(0, DESC_LIMIT + 20)}{effectiveDesc.length > DESC_LIMIT + 20 ? '…' : ''}
          </p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm font-semibold text-red-800">{error}</div>
      )}

      <div className="flex items-center gap-3">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-8 py-4 bg-slate-900 text-white rounded-xl font-bold hover:bg-brand-400 hover:text-slate-900 transition-colors disabled:opacity-50"
        >
          {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          Save SEO Settings
        </button>
        <button
          onClick={handleReset}
          className="flex items-center gap-2 px-6 py-4 bg-white border-2 border-slate-200 text-slate-600 rounded-xl font-bold hover:border-slate-400 transition-colors"
        >
          <RotateCcw size={16} /> Reset to defaults
        </button>
        {saved && (
          <span className="flex items-center gap-1.5 text-emerald-600 font-bold text-sm animate-in fade-in">
            <CheckCircle2 size={16} /> Saved, live now
          </span>
        )}
      </div>
    </div>
  );
};

export default SeoManager;
