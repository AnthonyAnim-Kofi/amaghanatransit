
-- Drop the restrictive SELECT policy and recreate as PERMISSIVE
DROP POLICY IF EXISTS "Anyone can view active trips" ON public.trips;

CREATE POLICY "Anyone can view active trips"
ON public.trips
AS PERMISSIVE
FOR SELECT
TO authenticated
USING (status <> 'cancelled'::trip_status);
