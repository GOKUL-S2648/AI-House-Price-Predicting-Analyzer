-- Update all houses to use the new premium visual stack
UPDATE public.houses 
SET images = jsonb_build_array(
    '/assets/house_exterior.png',
    '/assets/house_living.png',
    '/assets/house_bedroom.png',
    '/assets/house_kitchen.png',
    '/assets/house_parking.png'
);

-- Also update the primary 'image' column to use the exterior view
UPDATE public.houses 
SET image = '/assets/house_exterior.png';
