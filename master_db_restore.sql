-- MASTER SCHEMA FOR HOMESIGHT AI
-- Run this in your Supabase SQL Editor to restore everything.

-- 1. Create houses table with all columns
CREATE TABLE IF NOT EXISTS public.houses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    listing_id TEXT UNIQUE, 
    title TEXT NOT NULL,
    type TEXT NOT NULL,
    price NUMERIC NOT NULL,
    location TEXT NOT NULL,
    district TEXT NOT NULL,
    state TEXT NOT NULL,
    image TEXT,
    amenities JSONB DEFAULT '[]'::jsonb,
    historical_prices JSONB DEFAULT '[]'::jsonb,
    description TEXT,
    lat DOUBLE PRECISION,
    lng DOUBLE PRECISION,
    is_approved BOOLEAN DEFAULT false,
    owner_id TEXT,
    email TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Indexes for performance
CREATE INDEX IF NOT EXISTS houses_district_idx ON public.houses (district);
CREATE INDEX IF NOT EXISTS houses_price_idx ON public.houses (price);

-- 3. Enable Row Level Security
ALTER TABLE public.houses ENABLE ROW LEVEL SECURITY;

-- 4. Set up Policies
DROP POLICY IF EXISTS "Allow public read access" ON public.houses;
CREATE POLICY "Allow public read access" ON public.houses FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow any user to insert listings" ON public.houses;
CREATE POLICY "Allow any user to insert listings" ON public.houses FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow update for all" ON public.houses;
CREATE POLICY "Allow update for all" ON public.houses FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Allow delete for all" ON public.houses;
CREATE POLICY "Allow delete for all" ON public.houses FOR DELETE USING (true);
