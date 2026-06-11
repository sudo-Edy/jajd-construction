-- ============================================================
-- JAJD Construction: everything pending, in one paste.
-- Open Supabase -> SQL Editor -> New query, paste ALL of this,
-- click RUN. Safe to run more than once (idempotent).
--
-- It does three things:
--   1. Creates the Admin Command Center tables
--      (site_visits, site_events, site_settings)
--   2. Hardens the lead-attachments bucket
--      (5 MB cap + images only, enforced server-side)
--   3. Fixes the broken "Exterior Painting & Siding" image
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ------------------------------------------------------------
-- 1a. Site visits (one row per browser session)
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

-- Visitors can only INSERT (write-only for the public; nobody can read others' rows)
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
-- 1b. Site events (clicks, leads, calendar picks)
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
-- 1c. Site settings (SEO overrides + background image choices)
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

-- ------------------------------------------------------------
-- 2. Lead-attachments bucket hardening.
--    file_size_limit and allowed_mime_types are enforced by
--    Supabase itself, so they hold even if someone bypasses the
--    website and calls the storage API directly.
-- ------------------------------------------------------------
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'lead-attachments',
  'lead-attachments',
  true,
  5242880, -- 5 MB hard cap per file
  ARRAY['image/jpeg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO UPDATE
  SET file_size_limit = EXCLUDED.file_size_limit,
      allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Public can upload images only (INSERT only; they cannot list,
-- update, or delete anyone's files)
DROP POLICY IF EXISTS "Public Uploads" ON storage.objects;
CREATE POLICY "Public Uploads"
ON storage.objects FOR INSERT
TO public
WITH CHECK (
  bucket_id = 'lead-attachments' AND
  (LOWER(storage.extension(name)) = ANY (ARRAY['jpg', 'jpeg', 'png', 'webp']))
);

-- Public read access (so the photo links in your lead emails work)
DROP POLICY IF EXISTS "Public Read" ON storage.objects;
CREATE POLICY "Public Read"
ON storage.objects FOR SELECT
TO public
USING ( bucket_id = 'lead-attachments' );

-- ------------------------------------------------------------
-- 3. Fix the "Exterior Painting & Siding" service image.
--    It pointed at /exterior-siding.jpg, a file that does not
--    exist, so the card showed a broken image. (Also repairs
--    rows set by an earlier version of this script, which used
--    an Unsplash URL that turned out to be dead.)
-- ------------------------------------------------------------
UPDATE services
SET image_url = 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80&w=800'
WHERE image_url IN (
  '/exterior-siding.jpg',
  'https://images.unsplash.com/photo-1605146769289-44011d143da7?auto=format&fit=crop&q=80&w=800'
);

-- ------------------------------------------------------------
-- 4. Same dead Unsplash URL in the sample portfolio data
--    ("Exterior Makeover" thumbnail + gallery image). Skip
--    this if you've already replaced the samples with real
--    project photos in the admin panel.
-- ------------------------------------------------------------
UPDATE projects
SET thumbnail_url = 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&q=80&w=800'
WHERE thumbnail_url = 'https://images.unsplash.com/photo-1605146769289-44011d143da7?auto=format&fit=crop&q=80&w=800';

UPDATE project_images
SET image_url = 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&q=80&w=800'
WHERE image_url = 'https://images.unsplash.com/photo-1605146769289-44011d143da7?auto=format&fit=crop&q=80&w=800';

-- Done! The admin Analytics / SEO / Appearance tabs work
-- immediately, lead uploads are capped server-side, and the
-- siding service card shows a working image.
