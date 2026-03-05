import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Search, MapPin, Clock, Bus, Users, ArrowRight, Ticket, ChevronRight, Navigation } from "lucide-react";
import { format } from "date-fns";

const SearchTrips = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");

  const [selectedTrip, setSelectedTrip] = useState<any>(null);
  const [selectedSeat, setSelectedSeat] = useState("");
  const [bookingLoading, setBookingLoading] = useState(false);

  // Fetch all scheduled trips with available seats
  const { data: trips, isLoading } = useQuery({
    queryKey: ["available-trips"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("trips")
        .select("*")
        .eq("status", "scheduled")
        .gt("seats_available", 0)
        .order("departure_time", { ascending: true });

      if (error) throw error;
      return data;
    },
  });

  // Subscribe to realtime trip changes
  useEffect(() => {
    const channel = supabase
      .channel("trips-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "trips" },
        () => {
          queryClient.invalidateQueries({ queryKey: ["available-trips"] });
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [queryClient]);

  // Client-side filtering
  const filteredTrips = trips?.filter((trip) => {
    const matchOrigin = !origin.trim() || trip.origin.toLowerCase().includes(origin.trim().toLowerCase());
    const matchDest = !destination.trim() || trip.destination.toLowerCase().includes(destination.trim().toLowerCase());
    return matchOrigin && matchDest;
  }) || [];

  const handleBook = async () => {
    if (!user || !selectedTrip) return;
    setBookingLoading(true);

    const seatNum = selectedSeat ? parseInt(selectedSeat) : null;

    const { error } = await supabase.from("bookings").insert({
      user_id: user.id,
      trip_id: selectedTrip.id,
      amount: selectedTrip.price,
      seat_number: seatNum,
      status: "confirmed",
      payment_status: "pending",
    });

    if (error) {
      toast.error(error.message);
      setBookingLoading(false);
      return;
    }

    await supabase
      .from("trips")
      .update({ seats_available: selectedTrip.seats_available - 1 })
      .eq("id", selectedTrip.id);

    toast.success("Booking confirmed! Check your bookings page.");
    setBookingLoading(false);
    setSelectedTrip(null);
    setSelectedSeat("");
    queryClient.invalidateQueries({ queryKey: ["available-trips"] });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar variant="passenger" userName={profile?.full_name || "Passenger"} />
      <main className="max-w-4xl mx-auto p-4 md:p-6 space-y-6">
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl md:text-3xl font-bold font-heading mb-1">Available Trips</h1>
          <p className="text-muted-foreground mb-6">Browse all available buses or search by location.</p>

          {/* Search Filter */}
          <div className="glass-card p-4 md:p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                  <MapPin className="h-3 w-3 text-primary" /> From
                </Label>
                <Input placeholder="e.g. Accra" value={origin} onChange={(e) => setOrigin(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                  <MapPin className="h-3 w-3 text-destructive" /> To
                </Label>
                <Input placeholder="e.g. Kumasi" value={destination} onChange={(e) => setDestination(e.target.value)} />
              </div>
              <Button
                variant="outline"
                onClick={() => { setOrigin(""); setDestination(""); }}
                disabled={!origin && !destination}
              >
                Clear Filters
              </Button>
            </div>
          </div>

          {/* Results */}
          <div className="space-y-4">
            {isLoading ? (
              <div className="text-center p-8 text-muted-foreground">Loading available trips...</div>
            ) : filteredTrips.length === 0 ? (
              <div className="text-center p-8 text-muted-foreground">
                <Bus className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No trips found{origin || destination ? " matching your search." : "."}</p>
              </div>
            ) : (
              <>
                <p className="text-sm text-muted-foreground">
                  {filteredTrips.length} trip{filteredTrips.length > 1 ? "s" : ""} available
                </p>
                {filteredTrips.map((trip) => (
                  <Card key={trip.id} className="glass-card border-border hover:glow-primary transition-shadow">
                    <CardContent className="p-4 md:p-6">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge className="bg-primary/20 text-primary border-0 text-xs">
                              <Bus className="h-3 w-3 mr-1" /> Scheduled
                            </Badge>
                            {trip.route_description && (
                              <span className="text-xs text-muted-foreground">{trip.route_description}</span>
                            )}
                          </div>
                          <h3 className="text-lg font-bold font-heading flex items-center gap-2">
                            {trip.origin} <ArrowRight className="h-4 w-4 text-primary" /> {trip.destination}
                          </h3>
                          <div className="flex flex-wrap gap-4 mt-2 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Clock className="h-3.5 w-3.5" />
                              {format(new Date(trip.departure_time), "MMM d, yyyy • h:mm a")}
                            </span>
                            <span className="flex items-center gap-1">
                              <Users className="h-3.5 w-3.5" />
                              {trip.seats_available}/{trip.total_seats} seats
                            </span>
                            {trip.distance_km && <span>{trip.distance_km} km</span>}
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="text-2xl font-bold text-success">GH₵ {Number(trip.price).toFixed(2)}</p>
                            <p className="text-xs text-muted-foreground">per seat</p>
                          </div>
                          <Button
                            className="gradient-primary font-semibold"
                            onClick={() => setSelectedTrip(trip)}
                          >
                            Book <ChevronRight className="ml-1 h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </>
            )}
          </div>
        </motion.div>
      </main>

      {/* Booking Dialog */}
      <Dialog open={!!selectedTrip} onOpenChange={(open) => { if (!open) { setSelectedTrip(null); setSelectedSeat(""); } }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-heading flex items-center gap-2">
              <Ticket className="h-5 w-5 text-primary" /> Confirm Booking
            </DialogTitle>
            <DialogDescription>Review and confirm your trip details.</DialogDescription>
          </DialogHeader>
          {selectedTrip && (
            <div className="space-y-4 py-2">
              <div className="glass-card p-4 space-y-2">
                <p className="font-bold text-lg">{selectedTrip.origin} → {selectedTrip.destination}</p>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  {format(new Date(selectedTrip.departure_time), "EEEE, MMM d, yyyy • h:mm a")}
                </p>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <Users className="h-3.5 w-3.5" />
                  {selectedTrip.seats_available} seats remaining
                </p>
              </div>

              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-wider text-muted-foreground">Select Seat (Optional)</Label>
                <Select value={selectedSeat} onValueChange={setSelectedSeat}>
                  <SelectTrigger>
                    <SelectValue placeholder="Any available seat" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: selectedTrip.total_seats }, (_, i) => (
                      <SelectItem key={i + 1} value={String(i + 1)}>
                        Seat {i + 1}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg bg-secondary">
                <span className="text-sm font-medium">Total Amount</span>
                <span className="text-xl font-bold text-success">GH₵ {Number(selectedTrip.price).toFixed(2)}</span>
              </div>
            </div>
          )}
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setSelectedTrip(null)}>Cancel</Button>
            <Button className="gradient-primary font-semibold" onClick={handleBook} disabled={bookingLoading}>
              {bookingLoading ? "Booking..." : "Confirm Booking"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SearchTrips;
