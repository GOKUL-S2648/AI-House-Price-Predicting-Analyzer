-- Add email column for property owners
ALTER TABLE public.houses 
ADD COLUMN IF NOT EXISTS email TEXT;

-- Update existing records to have a placeholder email if missing
UPDATE public.houses SET email = 'owner@properly.ai' WHERE email IS NULL;
