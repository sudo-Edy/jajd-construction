-- JAJD Construction Project Gallery Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Projects table
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  location TEXT NOT NULL,
  description TEXT NOT NULL,
  details TEXT,
  completion_date TEXT,
  thumbnail_url TEXT,
  display_order INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Project images table
CREATE TABLE IF NOT EXISTS project_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  caption TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_projects_published ON projects(is_published, display_order);
CREATE INDEX IF NOT EXISTS idx_project_images_project_id ON project_images(project_id, display_order);

-- Enable Row Level Security
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_images ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Public read access for published projects" ON projects;
DROP POLICY IF EXISTS "Authenticated users can insert projects" ON projects;
DROP POLICY IF EXISTS "Authenticated users can update projects" ON projects;
DROP POLICY IF EXISTS "Authenticated users can delete projects" ON projects;
DROP POLICY IF EXISTS "Public read access for project images" ON project_images;
DROP POLICY IF EXISTS "Authenticated users can insert project images" ON project_images;
DROP POLICY IF EXISTS "Authenticated users can update project images" ON project_images;
DROP POLICY IF EXISTS "Authenticated users can delete project images" ON project_images;

-- RLS Policies for projects table
-- Allow public to read published projects
CREATE POLICY "Public read access for published projects"
  ON projects FOR SELECT
  USING (is_published = true);

-- Allow authenticated users (admin) to do everything
CREATE POLICY "Authenticated users can insert projects"
  ON projects FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update projects"
  ON projects FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can delete projects"
  ON projects FOR DELETE
  TO authenticated
  USING (true);

-- RLS Policies for project_images table
-- Allow public to read images for published projects
CREATE POLICY "Public read access for project images"
  ON project_images FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = project_images.project_id
      AND projects.is_published = true
    )
  );

-- Allow authenticated users (admin) to do everything
CREATE POLICY "Authenticated users can insert project images"
  ON project_images FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update project images"
  ON project_images FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can delete project images"
  ON project_images FOR DELETE
  TO authenticated
  USING (true);

-- Insert sample project data (optional - you can delete this section if you prefer to start fresh)
INSERT INTO projects (title, location, description, details, completion_date, thumbnail_url, display_order, is_published)
VALUES 
  (
    'Exterior Makeover',
    'Elkhorn, NE',
    'Full stucco repair and repaint',
    'Complete exterior transformation including stucco repair, surface preparation, and professional-grade paint application. The project restored the home''s curb appeal and added years of weather protection.',
    'January 2024',
    'https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&q=80&w=800',
    1,
    true
  ),
  (
    'Kitchen Cabinet Refinish',
    'Papillion, NE',
    'Modern white lacquer finish',
    'Professional cabinet refinishing using specialized coatings for a factory-fresh look. All hardware was removed, surfaces were thoroughly prepared, and a durable lacquer finish was applied.',
    'December 2023',
    'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&q=80&w=800',
    2,
    true
  ),
  (
    'Commercial Interior',
    'Downtown Omaha',
    'Office renovation and painting',
    'Large-scale office renovation including interior painting, accent walls, and professional finish work. Completed ahead of schedule with minimal disruption to business operations.',
    'November 2023',
    'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&q=80&w=800',
    3,
    true
  );

-- Add sample images for the first project (replace with actual uploaded images later)
INSERT INTO project_images (project_id, image_url, display_order)
SELECT 
  p.id,
  url,
  row_number() OVER () as display_order
FROM projects p
CROSS JOIN (
  VALUES 
    ('https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&q=80&w=800'),
    ('https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=800'),
    ('https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&q=80&w=800')
) AS t(url)
WHERE p.title = 'Exterior Makeover'
LIMIT 3;
