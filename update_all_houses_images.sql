-- Update all houses to use the new premium visual stack
UPDATE public.houses 
SET images = jsonb_build_array(
    '/assets/house_exterior.jpg',
    '/assets/house_living.jpeg',
    '/assets/house_bedroom.jpg',
    '/assets/house_kitchen.jpg',
    '/assets/house_parking.jpg'
);

-- Also update the primary 'image' column to use the exterior view
UPDATE public.houses 
SET image = '/assets/house_exterior.jpg';
