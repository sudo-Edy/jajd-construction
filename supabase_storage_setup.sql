-- Create the 'project-images' bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('project-images', 'project-images', true)
ON CONFLICT (id) DO NOTHING;

-- RLS Policy: Allow public read access to all files in the 'project-images' bucket
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'project-images' );

-- RLS Policy: Allow authenticated users to upload files to 'project-images' bucket
CREATE POLICY "Authenticated Upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK ( bucket_id = 'project-images' );

-- RLS Policy: Allow authenticated users to update/delete their files
CREATE POLICY "Authenticated Update/Delete"
ON storage.objects FOR DELETE
TO authenticated
USING ( bucket_id = 'project-images' );

CREATE POLICY "Authenticated Update"
ON storage.objects FOR UPDATE
TO authenticated
USING ( bucket_id = 'project-images' );
