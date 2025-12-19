-- EEU CAFE Supabase Database Schema
-- Run this in Supabase SQL Editor

-- Create menus table
CREATE TABLE IF NOT EXISTS menus (
  id BIGSERIAL PRIMARY KEY,
  date TEXT UNIQUE NOT NULL,
  slots JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_menus_date ON menus(date);
CREATE INDEX IF NOT EXISTS idx_menus_updated_at ON menus(updated_at DESC);

-- Enable Row Level Security
ALTER TABLE menus ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read menus (public access)
CREATE POLICY "Public read access"
  ON menus FOR SELECT
  USING (true);

-- Policy: Allow inserts (admin key validated in application)
CREATE POLICY "Allow inserts"
  ON menus FOR INSERT
  WITH CHECK (true);

-- Policy: Allow updates (admin key validated in application)
CREATE POLICY "Allow updates"
  ON menus FOR UPDATE
  USING (true);

-- Policy: Allow deletes (admin key validated in application)
CREATE POLICY "Allow deletes"
  ON menus FOR DELETE
  USING (true);

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to update updated_at on menu updates
CREATE TRIGGER update_menus_updated_at BEFORE UPDATE ON menus
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
