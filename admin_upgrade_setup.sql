-- ============================================================
-- JAJD Construction — Admin Command Center setup
-- Run this ONCE in your Supabase SQL Editor.
-- Creates: site_visits, site_events (first-party analytics with
-- bot detection) and site_settings (SEO + appearance controls).
-- Safe to re-run: uses IF NOT EXISTS / drops policies first.
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ------------------------------------------------------------
-- 1. Site visits (one row per browser session)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS site_visits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  session_id TEXT NOT NULL,
  page TEXT,
  referrer TEXT,
  user_agent TEXT,
  device TEXT,
  screen_width INTEGER,
  language TEXT,
  is_bot BOOLEAN DEFAULT FALSE,
  bot_reason TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT
);

CREATE INDEX IF NOT EXISTS idx_site_visits_created_at ON site_visits(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_site_visits_is_bot ON site_visits(is_bot, created_at DESC);

ALTER TABLE site_visits ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can log a visit" ON site_visits;
DROP POLICY IF EXISTS "Admins can read visits" ON site_visits;
DROP POLICY IF EXISTS "Admins can delete visits" ON site_visits;

-- Visitors can only INSERT (write-only for the public — nobody can read others' rows)
CREATE POLICY "Anyone can log a visit"
  ON site_visits FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Admins can read visits"
  ON site_visits FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can delete visits"
  ON site_visits FOR DELETE
  TO authenticated
  USING (true);

-- ------------------------------------------------------------
-- 2. Site events (clicks, leads, calendar picks)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS site_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  session_id TEXT NOT NULL,
  event_name TEXT NOT NULL,
  is_bot BOOLEAN DEFAULT FALSE,
  metadata JSONB DEFAULT '{}'::jsonb
);

CREATE INDEX IF NOT EXISTS idx_site_events_created_at ON site_events(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_site_events_name ON site_events(event_name, created_at DESC);

ALTER TABLE site_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can log an event" ON site_events;
DROP POLICY IF EXISTS "Admins can read events" ON site_events;
DROP POLICY IF EXISTS "Admins can delete events" ON site_events;

CREATE POLICY "Anyone can log an event"
  ON site_events FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Admins can read events"
  ON site_events FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admins can delete events"
  ON site_events FOR DELETE
  TO authenticated
  USING (true);

-- ------------------------------------------------------------
-- 3. Site settings (SEO overrides + background image choices)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS site_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Settings are publicly readable" ON site_settings;
DROP POLICY IF EXISTS "Admins can insert settings" ON site_settings;
DROP POLICY IF EXISTS "Admins can update settings" ON site_settings;
DROP POLICY IF EXISTS "Admins can delete settings" ON site_settings;

-- The public site reads settings (hero background, SEO text, etc.)
CREATE POLICY "Settings are publicly readable"
  ON site_settings FOR SELECT
  USING (true);

CREATE POLICY "Admins can insert settings"
  ON site_settings FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Admins can update settings"
  ON site_settings FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Admins can delete settings"
  ON site_settings FOR DELETE
  TO authenticated
  USING (true);

-- Done! The admin Analytics / SEO / Appearance tabs work immediately after this runs.
