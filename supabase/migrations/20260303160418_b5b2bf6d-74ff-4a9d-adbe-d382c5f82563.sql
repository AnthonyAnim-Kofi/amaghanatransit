
-- Create notifications table for in-app push notifications
CREATE TABLE public.notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'info',
  read BOOLEAN NOT NULL DEFAULT false,
  link TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own notifications"
ON public.notifications FOR SELECT
USING (user_id = auth.uid());

CREATE POLICY "Users can update own notifications"
ON public.notifications FOR UPDATE
USING (user_id = auth.uid());

CREATE POLICY "Users can delete own notifications"
ON public.notifications FOR DELETE
USING (user_id = auth.uid());

CREATE POLICY "System can insert notifications"
ON public.notifications FOR INSERT
WITH CHECK (true);

ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;

-- Trigger: create notification on booking confirmation
CREATE OR REPLACE FUNCTION public.notify_booking_created()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  _trip RECORD;
BEGIN
  SELECT origin, destination, departure_time, driver_id INTO _trip
  FROM public.trips WHERE id = NEW.trip_id;
  
  INSERT INTO public.notifications (user_id, title, message, type, link)
  VALUES (
    NEW.user_id,
    'Booking Confirmed!',
    'Your seat on ' || _trip.origin || ' → ' || _trip.destination || ' is confirmed. Ref: ' || NEW.booking_reference,
    'booking',
    '/passenger/bookings'
  );
  
  INSERT INTO public.notifications (user_id, title, message, type, link)
  VALUES (
    _trip.driver_id,
    'New Booking!',
    'A passenger booked a seat on your ' || _trip.origin || ' → ' || _trip.destination || ' trip.',
    'booking',
    '/driver/dashboard'
  );
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_booking_created
AFTER INSERT ON public.bookings
FOR EACH ROW
EXECUTE FUNCTION public.notify_booking_created();

-- Trigger: notify on trip status change
CREATE OR REPLACE FUNCTION public.notify_trip_status_change()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF OLD.status IS DISTINCT FROM NEW.status THEN
    INSERT INTO public.notifications (user_id, title, message, type, link)
    SELECT 
      b.user_id,
      'Trip Update: ' || INITCAP(REPLACE(NEW.status::text, '_', ' ')),
      'Your trip ' || NEW.origin || ' → ' || NEW.destination || ' is now ' || REPLACE(NEW.status::text, '_', ' ') || '.',
      'trip_update',
      CASE WHEN NEW.status = 'in_progress' THEN '/passenger/track?id=' || NEW.id ELSE '/passenger/bookings' END
    FROM public.bookings b
    WHERE b.trip_id = NEW.id AND b.status IN ('confirmed', 'pending');
  END IF;
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_trip_status_change
AFTER UPDATE ON public.trips
FOR EACH ROW
EXECUTE FUNCTION public.notify_trip_status_change();
