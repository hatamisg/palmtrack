-- =====================================================
-- SUPABASE STORAGE SETUP FOR PALMTRACK
-- =====================================================
-- Run this in your Supabase SQL Editor
-- =====================================================

-- 1. Create the storage bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'palmtrack-images',
  'palmtrack-images',
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 5242880,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

-- 2. Create storage policies

-- Policy: Allow public read access
CREATE POLICY "Public Read Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'palmtrack-images');

-- Policy: Allow authenticated users to upload
CREATE POLICY "Allow Upload"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'palmtrack-images');

-- Policy: Allow authenticated users to update their uploads
CREATE POLICY "Allow Update"
ON storage.objects FOR UPDATE
USING (bucket_id = 'palmtrack-images');

-- Policy: Allow authenticated users to delete
CREATE POLICY "Allow Delete"
ON storage.objects FOR DELETE
USING (bucket_id = 'palmtrack-images');

-- =====================================================
-- UPDATE DATABASE SCHEMA
-- =====================================================

-- 3. Add image_url column to gardens table
ALTER TABLE gardens 
ADD COLUMN IF NOT EXISTS image_url TEXT;

-- 4. Add images column to maintenances table (for before/after photos)
ALTER TABLE maintenances 
ADD COLUMN IF NOT EXISTS images TEXT[];

-- 5. Verify the foto column exists in issues table
-- (Should already exist from initial schema)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'issues' AND column_name = 'foto'
  ) THEN
    ALTER TABLE issues ADD COLUMN foto TEXT[];
  END IF;
END $$;

-- =====================================================
-- CREATE INDEXES FOR PERFORMANCE
-- =====================================================

-- Index for gardens with images
CREATE INDEX IF NOT EXISTS idx_gardens_image_url 
ON gardens(image_url) 
WHERE image_url IS NOT NULL;

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================

-- Check bucket was created
SELECT * FROM storage.buckets WHERE id = 'palmtrack-images';

-- Check policies were created
SELECT * FROM pg_policies WHERE tablename = 'objects' AND schemaname = 'storage';

-- Check columns were added
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'gardens' AND column_name = 'image_url';

SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'maintenances' AND column_name = 'images';

SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'issues' AND column_name = 'foto';

-- =====================================================
-- DONE! Storage is ready to use.
-- =====================================================
