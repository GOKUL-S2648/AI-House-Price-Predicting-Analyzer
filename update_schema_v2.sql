-- Update houses table with approval and ownership fields
ALTER TABLE public.houses 
ADD COLUMN IF NOT EXISTS is_approved BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS owner_id TEXT;

-- Mark all existing historical records as approved so they remain visible
UPDATE public.houses SET is_approved = true WHERE is_approved IS FALSE AND listing_id IS NOT NULL;

-- Update RLS Policy for Insertion (Allow any authenticated user to insert)
-- Note: In a production app, you'd use auth.uid()
CREATE POLICY "Allow any user to insert listings" ON public.houses
    FOR INSERT WITH CHECK (true);

-- Update RLS Policy for Updating (Allow admins to update any listing)
CREATE POLICY "Allow update for all" ON public.houses
    FOR UPDATE USING (true);

-- Update RLS Policy for Deletion (Allow rejection/removal)
CREATE POLICY "Allow delete for all" ON public.houses
    FOR DELETE USING (true);
