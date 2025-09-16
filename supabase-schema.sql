-- Collaborative Developments LLC - Supabase Database Schema

-- Enable Row Level Security (RLS) 
-- This will be enabled on all tables for security

-- Create news table
CREATE TABLE IF NOT EXISTS news (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  published BOOLEAN DEFAULT false,
  date TIMESTAMPTZ NOT NULL,
  featured_image TEXT,
  author TEXT NOT NULL DEFAULT 'Unknown',
  created_by TEXT NOT NULL DEFAULT 'admin',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create resources table
CREATE TABLE IF NOT EXISTS resources (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  file_url TEXT,
  external_url TEXT,
  date TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create collaborators table
CREATE TABLE IF NOT EXISTS collaborators (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  logo_url TEXT,
  website_url TEXT,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE news ENABLE ROW LEVEL SECURITY;
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE collaborators ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access to published content
CREATE POLICY "Public can read published news" ON news
  FOR SELECT USING (published = true);

CREATE POLICY "Public can read all resources" ON resources
  FOR SELECT USING (true);

CREATE POLICY "Public can read all collaborators" ON collaborators
  FOR SELECT USING (true);

-- Create policies for authenticated users (admin) to manage content
CREATE POLICY "Authenticated users can insert news" ON news
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update news" ON news
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete news" ON news
  FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can read all news" ON news
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert resources" ON resources
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update resources" ON resources
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete resources" ON resources
  FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert collaborators" ON collaborators
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update collaborators" ON collaborators
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete collaborators" ON collaborators
  FOR DELETE USING (auth.role() = 'authenticated');

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_news_published_date ON news(published, date DESC);
CREATE INDEX IF NOT EXISTS idx_resources_category ON resources(category);
CREATE INDEX IF NOT EXISTS idx_resources_date ON resources(date DESC);
CREATE INDEX IF NOT EXISTS idx_collaborators_featured ON collaborators(featured);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to automatically update updated_at column
CREATE TRIGGER update_news_updated_at 
  BEFORE UPDATE ON news 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_resources_updated_at 
  BEFORE UPDATE ON resources 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_collaborators_updated_at 
  BEFORE UPDATE ON collaborators 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create storage bucket for images (run this in Supabase dashboard)
-- INSERT INTO storage.buckets (id, name, public) VALUES ('images', 'images', true);

-- Create storage policies for images bucket
-- These need to be run after creating the bucket
/*
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'images');
CREATE POLICY "Authenticated users can upload images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'images' AND auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update images" ON storage.objects FOR UPDATE USING (bucket_id = 'images' AND auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can delete images" ON storage.objects FOR DELETE USING (bucket_id = 'images' AND auth.role() = 'authenticated');
*/