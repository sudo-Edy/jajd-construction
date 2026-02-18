-- Create the 'lead-attachments' bucket for public photo uploads
INSERT INTO storage.buckets (id, name, public)
VALUES ('lead-attachments', 'lead-attachments', true)
ON CONFLICT (id) DO NOTHING;

-- RLS Policy: Allow public (anon) users to upload files
-- We restrict this to INSERT only. They cannot list, update, or delete other people's files.
CREATE POLICY "Public Uploads"
ON storage.objects FOR INSERT
TO public
WITH CHECK (
  bucket_id = 'lead-attachments' AND
  (LOWER(storage.extension(name)) = ANY (ARRAY['jpg', 'jpeg', 'png', 'webp']))
);

-- RLS Policy: Allow public read access (so you can view the files via the link)
CREATE POLICY "Public Read"
ON storage.objects FOR SELECT
TO public
USING ( bucket_id = 'lead-attachments' );
