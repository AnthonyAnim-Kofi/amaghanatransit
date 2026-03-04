import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Navbar from "@/components/Navbar";
import LeafletMap from "@/components/LeafletMap";
import DriverLocationSharing from "@/components/DriverLocationSharing";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, AlertTriangle, Play, Search, Flag, Clock, Bus, Square } from "lucide-react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { toast } from "sonner";

const DriverRoutes = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [selectedTripId, setSelectedTripId] = useState<string>("");

  // Fetch driver's trips
  const { data: trips } = useQuery({
    queryKey: ["driver-route-trips", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("trips")
        .select("*")
        .eq("driver_id", user!.id)
        .in("status", ["scheduled", "in_progress"])
        .order("departure_time", { ascending: true });
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const selectedTrip = trips?.find((t) => t.id === selectedTripId) || trips?.[0];

  // Fetch latest location for selected trip
  const { data: locations } = useQuery({
    queryKey: ["route-locations", selectedTrip?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("trip_locations")
        .select("*")
        .eq("trip_id", selectedTrip!.id)
        .order("recorded_at", { ascending: false })
        .limit(50);
      if (error) throw error;
      return data;
    },
    enabled: !!selectedTrip,
    refetchInterval: 10000,
  });

  const handleStartRoute = async () => {
    if (!selectedTrip) return;
    try {
      const { error } = await supabase
        .from("trips")
        .update({ status: "in_progress" as any })
        .eq("id", selectedTrip.id);
      if (error) throw error;
      toast.success("Route started! Location sharing is now available.");
      queryClient.invalidateQueries({ queryKey: ["driver-route-trips"] });
    } catch (err: any) {
      toast.error(err.message || "Failed to start route");
    }
  };

  const handleEndRoute = async () => {
    if (!selectedTrip) return;
    try {
      const { error } = await supabase
        .from("trips")
        .update({ status: "completed" as any })
        .eq("id", selectedTrip.id);
      if (error) throw error;
      toast.success("Trip completed!");
      queryClient.invalidateQueries({ queryKey: ["driver-route-trips"] });
    } catch (err: any) {
      toast.error(err.message || "Failed to end route");
    }
  };

  // Build map data from real locations
  const routeTrail: [number, number][] = (locations || [])
    .slice()
    .reverse()
    .map((l) => [Number(l.latitude), Number(l.longitude)]);

  const latestLoc = locations?.[0];
  const livePosition = latestLoc
    ? { lat: Number(latestLoc.latitude), lng: Number(latestLoc.longitude), speed: latestLoc.speed ? Number(latestLoc.speed) : null }
    : undefined;

  // Map markers for origin/destination
  const markers = selectedTrip
    ? [
        { lat: routeTrail[0]?.[0] ?? 5.55, lng: routeTrail[0]?.[1] ?? -0.2, label: selectedTrip.origin, color: "green" as const },
        { lat: routeTrail[routeTrail.length - 1]?.[0] ?? 6.69, lng: routeTrail[routeTrail.length - 1]?.[1] ?? -1.62, label: selectedTrip.destination, color: "red" as const },
      ]
    : [];

  const mapCenter: [number, number] = livePosition
    ? [livePosition.lat, livePosition.lng]
    : [6.1, -0.9];

  return (
    <div className="min-h-screen bg-background">
      <Navbar variant="driver" userName={profile?.full_name || "Driver"} />
      <div className="flex flex-col lg:flex-row">
        {/* Route Panel */}
        <aside className="w-full lg:w-96 border-b lg:border-b-0 lg:border-r border-border p-4 md:p-6 space-y-4 md:space-y-6 lg:min-h-[calc(100vh-4rem)] lg:overflow-y-auto">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <p className="text-xs uppercase tracking-wider text-primary font-semibold mb-1">Route Management</p>

            {/* Trip Selector */}
            {trips && trips.length > 0 ? (
              <>
                <Select value={selectedTrip?.id || ""} onValueChange={setSelectedTripId}>
                  <SelectTrigger className="mb-4">
                    <SelectValue placeholder="Select a trip" />
                  </SelectTrigger>
                  <SelectContent>
                    {trips.map((t) => (
                      <SelectItem key={t.id} value={t.id}>
                        {t.origin} → {t.destination} ({format(new Date(t.departure_time), "MMM d, h:mm a")})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {selectedTrip && (
                  <>
                    <h1 className="text-xl md:text-2xl font-bold font-heading mb-1">
                      {selectedTrip.origin} → {selectedTrip.destination}
                    </h1>
                    <p className="text-sm text-muted-foreground mb-4">
                      {selectedTrip.route_description || "Direct route"}
                    </p>

                    <div className="flex gap-3 mb-6">
                      <div className="glass-card p-3 flex-1">
                        <p className="text-xs uppercase tracking-wider text-muted-foreground">Distance</p>
                        <p className="text-lg font-bold font-heading">
                          {selectedTrip.distance_km ? `${selectedTrip.distance_km} km` : "--"}
                        </p>
                      </div>
                      <div className="glass-card p-3 flex-1">
                        <p className="text-xs uppercase tracking-wider text-muted-foreground">Status</p>
                        <p className="text-lg font-bold font-heading capitalize">
                          {selectedTrip.status?.replace("_", " ")}
                        </p>
                      </div>
                    </div>

                    {/* Trip Details */}
                    <div className="space-y-3 mb-6">
                      <div className="glass-card p-3 flex items-center gap-3">
                        <Clock className="h-4 w-4 text-primary shrink-0" />
                        <div>
                          <p className="text-xs text-muted-foreground">Departure</p>
                          <p className="text-sm font-semibold">
                            {format(new Date(selectedTrip.departure_time), "EEEE, MMM d • h:mm a")}
                          </p>
                        </div>
                      </div>
                      {selectedTrip.arrival_time && (
                        <div className="glass-card p-3 flex items-center gap-3">
                          <Flag className="h-4 w-4 text-destructive shrink-0" />
                          <div>
                            <p className="text-xs text-muted-foreground">Est. Arrival</p>
                            <p className="text-sm font-semibold">
                              {format(new Date(selectedTrip.arrival_time), "h:mm a")}
                            </p>
                          </div>
                        </div>
                      )}
                      <div className="glass-card p-3 flex items-center gap-3">
                        <Bus className="h-4 w-4 text-muted-foreground shrink-0" />
                        <div>
                          <p className="text-xs text-muted-foreground">Seats</p>
                          <p className="text-sm font-semibold">
                            {selectedTrip.seats_available}/{selectedTrip.total_seats} available
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Live speed from latest location */}
                    {livePosition && (
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-success/10 border border-success/20 mb-6">
                        <div className="h-2 w-2 rounded-full bg-success animate-pulse" />
                        <div>
                          <p className="text-sm font-bold text-success">Live Tracking Active</p>
                          <p className="text-xs text-muted-foreground">
                            Speed: {livePosition.speed ?? 0} km/h
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Location Sharing */}
                    {selectedTrip.status === "in_progress" && (
                      <DriverLocationSharing tripId={selectedTrip.id} />
                    )}

                    {/* Action Buttons */}
                    {selectedTrip.status === "scheduled" && (
                      <Button
                        className="w-full gradient-primary py-6 text-base font-semibold mt-4"
                        onClick={handleStartRoute}
                      >
                        <Play className="mr-2 h-5 w-5" /> START ROUTE
                      </Button>
                    )}
                    {selectedTrip.status === "in_progress" && (
                      <Button
                        className="w-full py-6 text-base font-semibold mt-4"
                        variant="destructive"
                        onClick={handleEndRoute}
                      >
                        <Square className="mr-2 h-5 w-5" /> END TRIP
                      </Button>
                    )}
                    <p className="text-xs text-center text-muted-foreground uppercase mt-2">
                      {selectedTrip.status === "scheduled"
                        ? "Tap to initiate live tracking"
                        : "Share your location for passengers"}
                    </p>
                  </>
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <Bus className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground mb-3">No active trips</p>
                <Button className="gradient-primary" onClick={() => navigate("/driver/create-trip")}>
                  Create a Trip
                </Button>
              </div>
            )}
          </motion.div>
        </aside>

        {/* Map Area */}
        <main className="flex-1 relative min-h-[50vh] lg:min-h-[calc(100vh-4rem)]">
          <LeafletMap
            center={mapCenter}
            zoom={livePosition ? 13 : 8}
            markers={markers}
            route={routeTrail.length >= 2 ? routeTrail : undefined}
            livePosition={livePosition}
            className="h-full"
          />

          {livePosition && (
            <div className="glass-card p-3 absolute top-4 left-4 z-[1000] flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-success animate-pulse" />
              <span className="text-xs font-semibold text-success">LIVE</span>
              <span className="text-xs text-muted-foreground">
                {livePosition.speed ? `${livePosition.speed} km/h` : "Stationary"}
              </span>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default DriverRoutes;
