-- Enhanced Database Schema for Additional Admin Features
-- Run this in your Supabase SQL Editor to add new columns

-- Add new columns to projects table
ALTER TABLE projects 
ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'residential',
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'completed',
ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS seo_title TEXT,
ADD COLUMN IF NOT EXISTS seo_description TEXT;

-- Create index for featured projects
CREATE INDEX IF NOT EXISTS idx_projects_featured ON projects(is_featured, display_order) WHERE is_featured = true;

-- Create index for category
CREATE INDEX IF NOT EXISTS idx_projects_category ON projects(category, display_order);

-- Add check constraints for valid values
ALTER TABLE projects DROP CONSTRAINT IF EXISTS check_category;
ALTER TABLE projects ADD CONSTRAINT check_category 
  CHECK (category IN ('residential', 'commercial', 'renovation', 'new_construction'));

ALTER TABLE projects DROP CONSTRAINT IF EXISTS check_status;
ALTER TABLE projects ADD CONSTRAINT check_status 
  CHECK (status IN ('completed', 'in_progress', 'upcoming'));

-- Update existing projects with default values (if any exist)
UPDATE projects 
SET 
  category = COALESCE(category, 'residential'),
  status = COALESCE(status, 'completed'),
  is_featured = COALESCE(is_featured, false)
WHERE category IS NULL OR status IS NULL OR is_featured IS NULL;

-- Optional: Add some example updates to existing projects
-- Uncomment and modify these if you want to categorize your existing projects

-- UPDATE projects SET category = 'commercial', is_featured = true 
-- WHERE title = 'Commercial Interior';

-- UPDATE projects SET category = 'renovation', status = 'completed'
-- WHERE title = 'Kitchen Cabinet Refinish';
