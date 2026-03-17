-- Run this in your Supabase SQL Editor to update all existing dots from 2025 to 2026
UPDATE public.houses 
SET historical_prices = jsonb_build_array(
    jsonb_build_object('year', 2026, 'price', (historical_prices->0->>'price')::numeric)
)
WHERE jsonb_array_length(historical_prices) = 1 
AND (historical_prices->0->>'year')::int = 2025;
