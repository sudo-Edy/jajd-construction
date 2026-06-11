-- Create the 'lead-attachments' bucket for public photo uploads.
-- file_size_limit and allowed_mime_types are enforced server-side by Supabase,
-- so they hold even if someone bypasses the website and calls the API directly.
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

-- RLS Policy: Allow public (anon) users to upload files
-- We restrict this to INSERT only. They cannot list, update, or delete other people's files.
DROP POLICY IF EXISTS "Public Uploads" ON storage.objects;
CREATE POLICY "Public Uploads"
ON storage.objects FOR INSERT
TO public
WITH CHECK (
  bucket_id = 'lead-attachments' AND
  (LOWER(storage.extension(name)) = ANY (ARRAY['jpg', 'jpeg', 'png', 'webp']))
);

-- RLS Policy: Allow public read access (so you can view the files via the link)
DROP POLICY IF EXISTS "Public Read" ON storage.objects;
CREATE POLICY "Public Read"
ON storage.objects FOR SELECT
TO public
USING ( bucket_id = 'lead-attachments' );
