-- ============================================================
-- VozEscolar — Settings table migration
-- Run this in Supabase SQL Editor → New query
-- ============================================================

CREATE TABLE IF NOT EXISTS settings (
  id         TEXT PRIMARY KEY DEFAULT 'singleton',
  data       JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed with defaults if table is empty
INSERT INTO settings (id, data)
VALUES (
  'singleton',
  '{"name":"CETIS 52 Hermenegildo Galeana","shortName":"CETIS 52","logoUrl":"/cetis52-logo.svg","primaryColor":"#76082c"}'::jsonb
)
ON CONFLICT (id) DO NOTHING;

-- RLS: anyone can read settings (public site needs school name/logo)
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public_read_settings" ON settings
  FOR SELECT USING (true);

-- Only service role can write (done via API routes that bypass RLS)
