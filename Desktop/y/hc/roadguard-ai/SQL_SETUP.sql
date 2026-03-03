-- SQL Query to create the road_reports table in Supabase
-- Run this in the Supabase SQL editor

CREATE TABLE public.road_reports (
  id BIGSERIAL PRIMARY KEY,
  image_url TEXT,
  severity_level VARCHAR(50) NOT NULL,
  priority_score INTEGER CHECK (priority_score >= 0 AND priority_score <= 100),
  latitude DECIMAL(10, 6) NOT NULL,
  longitude DECIMAL(10, 6) NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for faster queries
CREATE INDEX idx_severity ON public.road_reports(severity_level);
CREATE INDEX idx_priority ON public.road_reports(priority_score DESC);
CREATE INDEX idx_timestamp ON public.road_reports(timestamp DESC);
CREATE INDEX idx_location ON public.road_reports(latitude, longitude);

-- Enable Row Level Security (optional but recommended)
ALTER TABLE public.road_reports ENABLE ROW LEVEL SECURITY;

-- Create a policy to allow all read access (public)
CREATE POLICY "Allow public read access" ON public.road_reports
  FOR SELECT USING (true);

-- Create a policy to allow all insert access (for API)
CREATE POLICY "Allow public insert access" ON public.road_reports
  FOR INSERT WITH CHECK (true);
