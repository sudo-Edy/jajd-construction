import React, { useEffect, useMemo, useState } from 'react';
import { supabase } from '../../utils/supabase';
import {
  Users, Bot, MousePointerClick, Phone, MessageSquare, CalendarCheck,
  Loader2, AlertTriangle, Globe, Monitor, Smartphone, Tablet, RefreshCw,
} from 'lucide-react';

interface VisitRow {
  id: string;
  created_at: string;
  is_bot: boolean;
  bot_reason: string | null;
  device: string | null;
  referrer: string | null;
  language: string | null;
  utm_source: string | null;
}

interface EventRow {
  id: string;
  created_at: string;
  event_name: string;
  is_bot: boolean;
  metadata: Record<string, unknown> | null;
}

type RangeDays = 7 | 30 | 90;

const EVENT_LABELS: Record<string, string> = {
  quote_modal_open: 'Quote form opened',
  lead_submitted: 'Lead submitted',
  phone_click: 'Phone number clicked',
  calendar_date_selected: 'Calendar date picked',
  service_card_click: 'Service card clicked',
};

const referrerHost = (ref: string | null): string => {
  if (!ref) return 'Direct / none';
  try { return new URL(ref).hostname.replace(/^www\./, ''); } catch { return ref.slice(0, 40); }
};

const AnalyticsDashboard: React.FC = () => {
  const [rangeDays, setRangeDays] = useState<RangeDays>(30);
  const [visits, setVisits] = useState<VisitRow[]>([]);
  const [events, setEvents] = useState<EventRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [setupNeeded, setSetupNeeded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async (days: RangeDays) => {
    setLoading(true);
    setError(null);
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();

    const [visitsRes, eventsRes] = await Promise.all([
      supabase.from('site_visits')
        .select('id, created_at, is_bot, bot_reason, device, referrer, language, utm_source')
        .gte('created_at', since)
        .order('created_at', { ascending: false })
        .limit(5000),
      supabase.from('site_events')
        .select('id, created_at, event_name, is_bot, metadata')
        .gte('created_at', since)
        .order('created_at', { ascending: false })
        .limit(5000),
    ]);

    if (visitsRes.error || eventsRes.error) {
      const msg = visitsRes.error?.message || eventsRes.error?.message || '';
      // 42P01 = relation does not exist → tables not created yet
      if (/does not exist|relation|schema cache/i.test(msg)) {
        setSetupNeeded(true);
      } else {
        setError(msg);
      }
      setLoading(false);
      return;
    }

    setVisits(visitsRes.data ?? []);
    setEvents(eventsRes.data ?? []);
    setLoading(false);
  };

  useEffect(() => { fetchData(rangeDays); }, [rangeDays]);

  const stats = useMemo(() => {
    const humans = visits.filter(v => !v.is_bot);
    const bots = visits.filter(v => v.is_bot);
    const humanEvents = events.filter(e => !e.is_bot);

    const countEvent = (name: string) =>
      humanEvents.filter(e => e.event_name === name).length;

    // Visits per day (stacked humans/bots)
    const byDay = new Map<string, { humans: number; bots: number }>();
    for (let i = rangeDays - 1; i >= 0; i--) {
      const d = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
      byDay.set(d.toISOString().slice(0, 10), { humans: 0, bots: 0 });
    }
    for (const v of visits) {
      const day = v.created_at.slice(0, 10);
      const bucket = byDay.get(day);
      if (bucket) v.is_bot ? bucket.bots++ : bucket.humans++;
    }

    // Top referrers (humans only)
    const refCounts = new Map<string, number>();
    for (const v of humans) {
      const host = referrerHost(v.referrer);
      refCounts.set(host, (refCounts.get(host) ?? 0) + 1);
    }
    const topReferrers = [...refCounts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8);

    // Devices (humans only)
    const devices = { desktop: 0, mobile: 0, tablet: 0 };
    for (const v of humans) {
      const d = (v.device ?? 'desktop') as keyof typeof devices;
      if (d in devices) devices[d]++;
    }

    // Bot reasons
    const botReasons = new Map<string, number>();
    for (const b of bots) {
      const r = b.bot_reason || 'unknown';
      botReasons.set(r, (botReasons.get(r) ?? 0) + 1);
    }

    return {
      total: visits.length,
      humans: humans.length,
      bots: bots.length,
      leads: countEvent('lead_submitted'),
      quoteOpens: countEvent('quote_modal_open'),
      phoneClicks: countEvent('phone_click'),
      calendarPicks: countEvent('calendar_date_selected'),
      byDay: [...byDay.entries()],
      topReferrers,
      devices,
      botReasons: [...botReasons.entries()].sort((a, b) => b[1] - a[1]),
    };
  }, [visits, events, rangeDays]);

  if (setupNeeded) {
    return (
      <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-10 text-center space-y-4">
        <AlertTriangle className="w-10 h-10 text-amber-500 mx-auto" />
        <h3 className="text-xl font-bold text-slate-900">Analytics tables not set up yet</h3>
        <p className="text-slate-600 max-w-xl mx-auto">
          Run <code className="bg-white px-2 py-0.5 rounded border border-amber-200 font-mono text-sm">admin_upgrade_setup.sql</code> in
          your Supabase SQL Editor (it's in the project root). Once it's run, visits and clicks
          start recording automatically with no redeploy needed.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="w-8 h-8 text-brand-400 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-8 text-center">
        <p className="text-red-800 font-bold">{error}</p>
        <button onClick={() => fetchData(rangeDays)} className="mt-4 px-6 py-2 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700">
          Try Again
        </button>
      </div>
    );
  }

  const maxDayTotal = Math.max(1, ...stats.byDay.map(([, c]) => c.humans + c.bots));
  const kpis = [
    { icon: Users, label: 'Human visits', value: stats.humans, color: 'text-emerald-600 bg-emerald-50 border-emerald-100' },
    { icon: Bot, label: 'Bot visits', value: stats.bots, color: 'text-slate-500 bg-slate-100 border-slate-200' },
    { icon: MessageSquare, label: 'Quote forms opened', value: stats.quoteOpens, color: 'text-blue-600 bg-blue-50 border-blue-100' },
    { icon: MousePointerClick, label: 'Leads submitted', value: stats.leads, color: 'text-brand-600 bg-brand-50 border-brand-100' },
    { icon: Phone, label: 'Phone clicks', value: stats.phoneClicks, color: 'text-violet-600 bg-violet-50 border-violet-100' },
    { icon: CalendarCheck, label: 'Calendar dates picked', value: stats.calendarPicks, color: 'text-rose-600 bg-rose-50 border-rose-100' },
  ];

  return (
    <div className="space-y-8">
      {/* Range selector */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex gap-2">
          {([7, 30, 90] as RangeDays[]).map(d => (
            <button
              key={d}
              onClick={() => setRangeDays(d)}
              className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-colors ${
                rangeDays === d ? 'bg-slate-900 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-400'
              }`}
            >
              Last {d} days
            </button>
          ))}
        </div>
        <button
          onClick={() => fetchData(rangeDays)}
          className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:border-slate-400 transition-colors"
        >
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {kpis.map(({ icon: Icon, label, value, color }) => (
          <div key={label} className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3">
            <div className={`w-10 h-10 rounded-xl border flex items-center justify-center ${color}`}>
              <Icon size={18} />
            </div>
            <div>
              <p className="text-2xl font-extrabold text-slate-900">{value.toLocaleString()}</p>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mt-0.5">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Visits chart */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-bold text-slate-900">Visits per day</h3>
          <div className="flex items-center gap-4 text-xs font-semibold text-slate-500">
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-emerald-500" /> Humans</span>
            <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-slate-300" /> Bots</span>
          </div>
        </div>
        <div className="flex items-end gap-[2px] h-40">
          {stats.byDay.map(([day, counts]) => {
            const total = counts.humans + counts.bots;
            return (
              <div key={day} className="flex-1 flex flex-col justify-end group relative h-full">
                <div className="absolute -top-9 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-bold py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                  {day}: {counts.humans} human, {counts.bots} bot
                </div>
                <div className="w-full bg-slate-300 rounded-t-sm" style={{ height: `${(counts.bots / maxDayTotal) * 100}%` }} />
                <div className="w-full bg-emerald-500" style={{ height: `${(counts.humans / maxDayTotal) * 100}%` }} />
                {total === 0 && <div className="w-full h-[2px] bg-slate-100" />}
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Top referrers */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2"><Globe size={16} className="text-brand-500" /> Where humans come from</h3>
          {stats.topReferrers.length === 0 ? (
            <p className="text-sm text-slate-400">No visits recorded yet.</p>
          ) : (
            <ul className="space-y-2.5">
              {stats.topReferrers.map(([host, count]) => (
                <li key={host} className="flex items-center justify-between text-sm">
                  <span className="font-semibold text-slate-700 truncate">{host}</span>
                  <span className="font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded text-xs">{count}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Devices */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <h3 className="font-bold text-slate-900 mb-4">Devices (humans)</h3>
          <ul className="space-y-4">
            {[
              { icon: Monitor, label: 'Desktop', value: stats.devices.desktop },
              { icon: Smartphone, label: 'Mobile', value: stats.devices.mobile },
              { icon: Tablet, label: 'Tablet', value: stats.devices.tablet },
            ].map(({ icon: Icon, label, value }) => {
              const pct = stats.humans > 0 ? Math.round((value / stats.humans) * 100) : 0;
              return (
                <li key={label} className="space-y-1.5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 font-semibold text-slate-700"><Icon size={14} className="text-slate-400" /> {label}</span>
                    <span className="font-bold text-slate-900">{value} <span className="text-slate-400 font-medium">({pct}%)</span></span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-brand-400 rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Bot breakdown */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2"><Bot size={16} className="text-slate-400" /> Bot detection</h3>
          {stats.botReasons.length === 0 ? (
            <p className="text-sm text-slate-400">No bots detected in this period. (Most crawlers don't run JavaScript and never show up here at all.)</p>
          ) : (
            <ul className="space-y-2.5">
              {stats.botReasons.map(([reason, count]) => (
                <li key={reason} className="flex items-center justify-between text-sm">
                  <span className="font-semibold text-slate-700 font-mono text-xs">{reason}</span>
                  <span className="font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded text-xs">{count}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Recent activity */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <h3 className="font-bold text-slate-900 mb-4">Recent activity</h3>
        {events.length === 0 ? (
          <p className="text-sm text-slate-400">No interactions recorded yet. Events appear here when visitors open the quote form, click the phone number, or pick a calendar date.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100">
                  <th className="pb-3 pr-4">When</th>
                  <th className="pb-3 pr-4">Event</th>
                  <th className="pb-3 pr-4">Details</th>
                  <th className="pb-3">Visitor</th>
                </tr>
              </thead>
              <tbody>
                {events.slice(0, 25).map(e => (
                  <tr key={e.id} className="border-b border-slate-50 last:border-0">
                    <td className="py-3 pr-4 text-slate-500 whitespace-nowrap">
                      {new Date(e.created_at).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
                    </td>
                    <td className="py-3 pr-4 font-semibold text-slate-800">{EVENT_LABELS[e.event_name] ?? e.event_name}</td>
                    <td className="py-3 pr-4 text-slate-500 text-xs font-mono truncate max-w-[260px]">
                      {e.metadata && Object.keys(e.metadata).length > 0
                        ? Object.entries(e.metadata).map(([k, v]) => `${k}: ${v}`).join(' · ')
                        : '—'}
                    </td>
                    <td className="py-3">
                      {e.is_bot
                        ? <span className="text-[10px] font-bold uppercase bg-slate-100 text-slate-500 px-2 py-0.5 rounded">Bot</span>
                        : <span className="text-[10px] font-bold uppercase bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded">Human</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
