
-- FIX: All policies were RESTRICTIVE. Recreate as PERMISSIVE.

-- TRIPS
DROP POLICY IF EXISTS "Anyone can view active trips" ON public.trips;
DROP POLICY IF EXISTS "Drivers can create trips" ON public.trips;
DROP POLICY IF EXISTS "Drivers can delete own trips" ON public.trips;
DROP POLICY IF EXISTS "Drivers can update own trips" ON public.trips;

CREATE POLICY "Anyone can view active trips" ON public.trips FOR SELECT USING (status <> 'cancelled'::trip_status);
CREATE POLICY "Drivers can create trips" ON public.trips FOR INSERT WITH CHECK (driver_id = auth.uid() AND has_role(auth.uid(), 'driver'::app_role));
CREATE POLICY "Drivers can delete own trips" ON public.trips FOR DELETE USING (driver_id = auth.uid());
CREATE POLICY "Drivers can update own trips" ON public.trips FOR UPDATE USING (driver_id = auth.uid());

-- BOOKINGS
DROP POLICY IF EXISTS "Users can view own bookings" ON public.bookings;
DROP POLICY IF EXISTS "Drivers can view trip bookings" ON public.bookings;
DROP POLICY IF EXISTS "Users can create bookings" ON public.bookings;
DROP POLICY IF EXISTS "Users can update own bookings" ON public.bookings;
DROP POLICY IF EXISTS "Users can cancel own bookings" ON public.bookings;

CREATE POLICY "Users can view own bookings" ON public.bookings FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Drivers can view trip bookings" ON public.bookings FOR SELECT USING (is_trip_driver(trip_id, auth.uid()));
CREATE POLICY "Users can create bookings" ON public.bookings FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can update own bookings" ON public.bookings FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "Users can cancel own bookings" ON public.bookings FOR DELETE USING (user_id = auth.uid());

-- NOTIFICATIONS
DROP POLICY IF EXISTS "Users can view own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users can update own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users can delete own notifications" ON public.notifications;
DROP POLICY IF EXISTS "System can insert notifications" ON public.notifications;

CREATE POLICY "Users can view own notifications" ON public.notifications FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can update own notifications" ON public.notifications FOR UPDATE USING (user_id = auth.uid());
CREATE POLICY "Users can delete own notifications" ON public.notifications FOR DELETE USING (user_id = auth.uid());
CREATE POLICY "System can insert notifications" ON public.notifications FOR INSERT WITH CHECK (true);

-- VEHICLES
DROP POLICY IF EXISTS "Drivers can view own vehicles" ON public.vehicles;
DROP POLICY IF EXISTS "Drivers can insert vehicles" ON public.vehicles;
DROP POLICY IF EXISTS "Drivers can update own vehicles" ON public.vehicles;
DROP POLICY IF EXISTS "Drivers can delete own vehicles" ON public.vehicles;

CREATE POLICY "Drivers can view own vehicles" ON public.vehicles FOR SELECT USING (driver_id = auth.uid());
CREATE POLICY "Drivers can insert vehicles" ON public.vehicles FOR INSERT WITH CHECK (driver_id = auth.uid() AND has_role(auth.uid(), 'driver'::app_role));
CREATE POLICY "Drivers can update own vehicles" ON public.vehicles FOR UPDATE USING (driver_id = auth.uid());
CREATE POLICY "Drivers can delete own vehicles" ON public.vehicles FOR DELETE USING (driver_id = auth.uid());

-- TRIP_LOCATIONS
DROP POLICY IF EXISTS "Anyone can view trip locations" ON public.trip_locations;
DROP POLICY IF EXISTS "Drivers can insert locations" ON public.trip_locations;

CREATE POLICY "Anyone can view trip locations" ON public.trip_locations FOR SELECT USING (true);
CREATE POLICY "Drivers can insert locations" ON public.trip_locations FOR INSERT WITH CHECK (driver_id = auth.uid());

-- USER_ROLES
DROP POLICY IF EXISTS "Users can view own roles" ON public.user_roles;
CREATE POLICY "Users can view own roles" ON public.user_roles FOR SELECT USING (user_id = auth.uid());

-- PROFILES
DROP POLICY IF EXISTS "Public profiles for trip display" ON public.profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;

CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (id = auth.uid());
CREATE POLICY "Public profiles for trip display" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (id = auth.uid());
