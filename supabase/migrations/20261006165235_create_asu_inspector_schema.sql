/*
# ASU Inspector Schema

## Overview
Creates the database schema for the ASU Inspector app — a mobile-first industrial
inspection tool for documenting Automated Control System (АСУ) aggregates.
Inspectors create installations, navigate predefined container/node structures,
and photograph each node for quality documentation.

## New Tables

### asus
- `id` (uuid, PK) — unique installation identifier
- `name` (text, not null) — inventory or local number (e.g. "АСУ-Тельман-1")
- `created_at` (timestamptz) — creation timestamp

### node_photos
- `id` (uuid, PK) — unique photo record identifier
- `asu_id` (uuid, FK → asus.id ON DELETE CASCADE) — which installation this photo belongs to
- `container_name` (text, not null) — which container (e.g. "1. Контейнер грохота")
- `node_name` (text, not null) — which node within the container (e.g. "Электровибратор левый")
- `storage_path` (text, not null) — path to the image file in the `photos` storage bucket
- `filename` (text, not null) — generated filename for display
- `created_at` (timestamptz) — when the photo was saved

## Storage
- Creates a public `photos` bucket for storing inspection images.

## Security
- RLS enabled on both tables.
- Single-tenant (no auth): policies use `TO anon, authenticated` since the app
  has no sign-in screen and all data is intentionally shared among inspectors.
- Storage bucket policies allow anon read/write to the photos bucket.
- `USING (true)` is used because this is an intentionally public/shared single-tenant app.
*/

-- ==========================================
-- TABLES
-- ==========================================

CREATE TABLE IF NOT EXISTS asus (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE asus ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_asus" ON asus;
CREATE POLICY "anon_select_asus" ON asus FOR SELECT
TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_asus" ON asus;
CREATE POLICY "anon_insert_asus" ON asus FOR INSERT
TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_asus" ON asus;
CREATE POLICY "anon_update_asu" ON asus FOR UPDATE
TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_asus" ON asus;
CREATE POLICY "anon_delete_asus" ON asus FOR DELETE
TO anon, authenticated USING (true);

CREATE TABLE IF NOT EXISTS node_photos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  asu_id uuid NOT NULL REFERENCES asus(id) ON DELETE CASCADE,
  container_name text NOT NULL,
  node_name text NOT NULL,
  storage_path text NOT NULL,
  filename text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE node_photos ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_node_photos" ON node_photos;
CREATE POLICY "anon_select_node_photos" ON node_photos FOR SELECT
TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_node_photos" ON node_photos;
CREATE POLICY "anon_insert_node_photos" ON node_photos FOR INSERT
TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_node_photos" ON node_photos;
CREATE POLICY "anon_update_node_photos" ON node_photos FOR UPDATE
TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_node_photos" ON node_photos;
CREATE POLICY "anon_delete_node_photos" ON node_photos FOR DELETE
TO anon, authenticated USING (true);

-- Index for looking up photos by ASU + container + node
CREATE INDEX IF NOT EXISTS idx_node_photos_asu_container_node
ON node_photos(asu_id, container_name, node_name);

-- ==========================================
-- STORAGE BUCKET
-- ==========================================

INSERT INTO storage.buckets (id, name, public)
VALUES ('photos', 'photos', true)
ON CONFLICT DO NOTHING;

-- Storage policies for the photos bucket
DROP POLICY IF EXISTS "anon_upload_photos" ON storage.objects;
CREATE POLICY "anon_upload_photos" ON storage.objects
FOR INSERT TO anon, authenticated
WITH CHECK (bucket_id = 'photos');

DROP POLICY IF EXISTS "anon_read_photos" ON storage.objects;
CREATE POLICY "anon_read_photos" ON storage.objects
FOR SELECT TO anon, authenticated
USING (bucket_id = 'photos');

DROP POLICY IF EXISTS "anon_delete_photos" ON storage.objects;
CREATE POLICY "anon_delete_photos" ON storage.objects
FOR DELETE TO anon, authenticated
USING (bucket_id = 'photos');
