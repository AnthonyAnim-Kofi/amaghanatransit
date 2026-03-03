import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Navigation, Clock, Bus, Phone, MessageSquare } from "lucide-react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";

interface TripLocation {
  latitude: number;
  longitude: number;
  speed: number | null;
  heading: number | null;
  recorded_at: string;
}

const TrackTrip = () => {
  const [searchParams] = useSearchParams();
  const tripId = searchParams.get("id");
  const [locations, setLocations] = useState<TripLocation[]>([]);
  const [trip, setTrip] = useState<any>(null);
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!tripId) return;

    // Fetch trip details
    const fetchTrip = async () => {
      const { data } = await supabase
        .from("trips")
        .select("*")
        .eq("id", tripId)
        .single();
      if (data) setTrip(data);
    };

    // Fetch latest location
    const fetchLocations = async () => {
      const { data } = await supabase
        .from("trip_locations")
        .select("*")
        .eq("trip_id", tripId)
        .order("recorded_at", { ascending: false })
        .limit(10);
      if (data) setLocations(data as TripLocation[]);
    };

    fetchTrip();
    fetchLocations();

    // Subscribe to real-time location updates
    const channel = supabase
      .channel(`trip-${tripId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "trip_locations",
          filter: `trip_id=eq.${tripId}`,
        },
        (payload) => {
          setLocations((prev) => [payload.new as TripLocation, ...prev.slice(0, 9)]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [tripId]);

  const latestLocation = locations[0];

  return (
    <div className="min-h-screen bg-background">
      <Navbar variant="passenger" />
      <div className="flex flex-col lg:flex-row">
        {/* Info Panel */}
        <aside className="w-full lg:w-96 border-b lg:border-b-0 lg:border-r border-border p-4 md:p-6 space-y-4 md:space-y-6">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <div className="flex items-center justify-between mb-4">
              <Badge className="bg-success/20 text-success border-0">● LIVE TRACKING</Badge>
              <span className="text-xs text-muted-foreground">Updated just now</span>
            </div>

            {trip ? (
              <>
                <h1 className="text-xl md:text-2xl font-bold font-heading mb-1">
                  {trip.origin} → {trip.destination}
                </h1>
                <p className="text-sm text-muted-foreground mb-4">{trip.route_description || "Main route"}</p>

                <div className="grid grid-cols-2 gap-3 mb-6">
                  <div className="glass-card p-3">
                    <p className="text-xs uppercase tracking-wider text-muted-foreground">Distance</p>
                    <p className="text-lg font-bold font-heading">{trip.distance_km || "--"} km</p>
                  </div>
                  <div className="glass-card p-3">
                    <p className="text-xs uppercase tracking-wider text-muted-foreground">Status</p>
                    <p className="text-lg font-bold font-heading capitalize">{trip.status?.replace("_", " ")}</p>
                  </div>
                </div>

                {latestLocation && (
                  <div className="glass-card p-4 mb-4">
                    <h3 className="text-sm font-bold uppercase tracking-wider mb-3 flex items-center gap-2">
                      <Navigation className="h-4 w-4 text-primary" /> Current Position
                    </h3>
                    <div className="space-y-2 text-sm">
                      <p className="text-muted-foreground">
                        Lat: <span className="text-foreground font-mono">{latestLocation.latitude}</span>
                      </p>
                      <p className="text-muted-foreground">
                        Lng: <span className="text-foreground font-mono">{latestLocation.longitude}</span>
                      </p>
                      {latestLocation.speed && (
                        <p className="text-muted-foreground">
                          Speed: <span className="text-foreground font-bold">{latestLocation.speed} km/h</span>
                        </p>
                      )}
                    </div>
                  </div>
                )}

                <div className="flex gap-3">
                  <Button variant="outline" className="flex-1" size="sm">
                    <Phone className="mr-2 h-4 w-4" /> Call Driver
                  </Button>
                  <Button variant="outline" className="flex-1" size="sm">
                    <MessageSquare className="mr-2 h-4 w-4" /> Message
                  </Button>
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <Bus className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">Select a trip to track</p>
              </div>
            )}
          </motion.div>
        </aside>

        {/* Map Area */}
        <main ref={mapRef} className="flex-1 relative bg-secondary/30 min-h-[50vh] lg:min-h-[calc(100vh-4rem)] flex items-center justify-center">
          {/* Map placeholder - Google Maps will be integrated with API key */}
          <div className="text-center p-4">
            <Navigation className="h-16 w-16 text-primary/30 mx-auto mb-4" />
            <p className="text-muted-foreground text-lg">Live Map View</p>
            <p className="text-sm text-muted-foreground">
              {trip ? `${trip.origin} → ${trip.destination}` : "No trip selected"}
            </p>
            {latestLocation && (
              <p className="text-xs text-primary mt-2">
                📍 {latestLocation.latitude.toFixed(4)}, {latestLocation.longitude.toFixed(4)}
              </p>
            )}
            <p className="text-xs text-muted-foreground mt-4 max-w-sm mx-auto">
              Google Maps integration requires an API key. Add it in Lovable Cloud secrets to enable interactive maps.
            </p>
          </div>

          {/* Live indicator */}
          {latestLocation && (
            <div className="glass-card p-3 absolute top-4 left-4 flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-success animate-pulse" />
              <span className="text-xs font-semibold text-success">LIVE</span>
              <span className="text-xs text-muted-foreground">
                {latestLocation.speed ? `${latestLocation.speed} km/h` : "Stationary"}
              </span>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default TrackTrip;
