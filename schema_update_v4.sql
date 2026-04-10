-- Add support for multiple images and additional property details
ALTER TABLE public.houses 
ADD COLUMN IF NOT EXISTS images JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS bhk_type TEXT,
ADD COLUMN IF NOT EXISTS car_parking TEXT;

-- Map existing single image to the images array for all records
UPDATE public.houses 
SET images = jsonb_build_array(image) 
WHERE (images IS NULL OR jsonb_array_length(images) = 0) AND image IS NOT NULL;
