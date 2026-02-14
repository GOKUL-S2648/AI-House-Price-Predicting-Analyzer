-- Create houses table
CREATE TABLE IF NOT EXISTS public.houses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    listing_id TEXT UNIQUE, -- To prevent duplicate migrations
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
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Index for searching
CREATE INDEX IF NOT EXISTS houses_district_idx ON public.houses (district);
CREATE INDEX IF NOT EXISTS houses_price_idx ON public.houses (price);

-- Enable Row Level Security (RLS)
ALTER TABLE public.houses ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read access" ON public.houses
    FOR SELECT USING (true);
