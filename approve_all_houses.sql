-- Run this in your Supabase SQL Editor to approve all properties
-- This will make all listings (including new ones) visible on the main page immediately.

UPDATE public.houses 
SET is_approved = true;
