-- ============================================================
-- VozEscolar — Supabase Schema
-- Run this in Supabase SQL Editor → New query
-- ============================================================

-- Complaints table
CREATE TABLE IF NOT EXISTS complaints (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  folio           TEXT UNIQUE NOT NULL,
  role            TEXT NOT NULL CHECK (role IN ('alumno','padre','docente','personal')),
  content         TEXT NOT NULL,
  category        TEXT NOT NULL CHECK (category IN ('acoso_escolar','docente','infraestructura','administrativo','seguridad','otro')),
  urgency         TEXT NOT NULL CHECK (urgency IN ('critical','high','medium','low')),
  status          TEXT NOT NULL DEFAULT 'recibida' CHECK (status IN ('recibida','en_revision','en_proceso','resuelta','cerrada')),
  is_anonymous    BOOLEAN DEFAULT true,
  content_hash    TEXT,
  admin_response  TEXT,
  evidence_url    TEXT,
  evidence_name   TEXT,
  sentiment_score INTEGER,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Timeline entries table
CREATE TABLE IF NOT EXISTS timeline_entries (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  complaint_id  UUID REFERENCES complaints(id) ON DELETE CASCADE,
  status        TEXT NOT NULL,
  message       TEXT,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Admin notes (internal, not visible to reporters)
CREATE TABLE IF NOT EXISTS admin_notes (
  id            UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  complaint_id  UUID REFERENCES complaints(id) ON DELETE CASCADE,
  content       TEXT NOT NULL,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Auto-update updated_at on complaints
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER complaints_updated_at
  BEFORE UPDATE ON complaints
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- Row Level Security
-- ============================================================

ALTER TABLE complaints      ENABLE ROW LEVEL SECURITY;
ALTER TABLE timeline_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_notes      ENABLE ROW LEVEL SECURITY;

-- Anyone can submit a complaint
CREATE POLICY "public_insert_complaints" ON complaints
  FOR INSERT WITH CHECK (true);

-- Anyone can read a complaint by folio (for tracking page)
CREATE POLICY "public_read_by_folio" ON complaints
  FOR SELECT USING (true);

-- Anyone can read timeline entries (for tracking page)
CREATE POLICY "public_read_timeline" ON timeline_entries
  FOR SELECT USING (true);

-- Only authenticated admins can update complaints
CREATE POLICY "admin_update_complaints" ON complaints
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Only authenticated admins can insert timeline entries
CREATE POLICY "admin_insert_timeline" ON timeline_entries
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Only authenticated admins can read/write notes
CREATE POLICY "admin_notes_policy" ON admin_notes
  FOR ALL USING (auth.role() = 'authenticated');

-- ============================================================
-- Storage bucket for evidence files
-- ============================================================

INSERT INTO storage.buckets (id, name, public)
VALUES ('evidence', 'evidence', false)
ON CONFLICT DO NOTHING;

-- Anyone can upload evidence (anonymous reporters)
CREATE POLICY "public_upload_evidence" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'evidence');

-- Only authenticated admins can view evidence
CREATE POLICY "admin_read_evidence" ON storage.objects
  FOR SELECT USING (bucket_id = 'evidence' AND auth.role() = 'authenticated');

-- Enable realtime on complaints and timeline_entries
ALTER PUBLICATION supabase_realtime ADD TABLE complaints;
ALTER PUBLICATION supabase_realtime ADD TABLE timeline_entries;
