-- Create services table
CREATE TABLE IF NOT EXISTS services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT NOT NULL,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE services ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Public services are viewable by everyone" 
ON services FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can insert services" 
ON services FOR INSERT 
WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update services" 
ON services FOR UPDATE 
USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete services" 
ON services FOR DELETE 
USING (auth.role() = 'authenticated');

-- Seed initial data from current constants
INSERT INTO services (title, description, image_url, display_order) VALUES
('Interior Painting & Remodels', 'More than just paint. We handle drywall repair, trim removal, and small interior renovations for a complete refresh.', 'https://images.unsplash.com/photo-1562663474-6cbb3eaa4d14?auto=format&fit=crop&q=80&w=800', 0),
('Exterior Painting & Siding', 'Complete exterior protection. We specialize in exterior painting and siding repairs (Vinyl, Wood, Hardie Board).', 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80&w=800', 1),
('Roofing Systems', 'Expert roof inspections, repairs, and full replacements. We ensure your home is watertight and durable.', 'https://images.unsplash.com/photo-1632759145351-1d592919f522?auto=format&fit=crop&q=80&w=800', 2),
('Cabinet Refinishing', 'Transform your kitchen without the cost of replacement. Factory-finish quality using specialized coatings.', 'https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?auto=format&fit=crop&q=80&w=800', 3),
('Commercial Services', 'Scalable maintenance solutions. We handle painting, roofing, and build-outs for offices and retail spaces.', 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800', 4),
('Decks & Pressure Washing', 'Restore your outdoor living spaces. Deep cleaning, staining, and wood repairs for decks and fences.', 'https://images.unsplash.com/photo-1520089851-f76db36d0bc6?auto=format&fit=crop&q=80&w=800', 5);
