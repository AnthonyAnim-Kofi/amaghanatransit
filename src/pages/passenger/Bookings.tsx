import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Bus, MapPin, QrCode, Pencil, Search } from "lucide-react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { toast } from "sonner";

const ActiveBookings = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: bookings, isLoading } = useQuery({
    queryKey: ["my-bookings", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bookings")
        .select("*, trips(*)")
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const upcoming = bookings?.filter(b => b.status === "confirmed" || b.status === "pending") || [];
  const completed = bookings?.filter(b => b.status === "completed") || [];
  const cancelled = bookings?.filter(b => b.status === "cancelled") || [];

  const handleCancel = async (id: string) => {
    const { error } = await supabase.from("bookings").update({ status: "cancelled" }).eq("id", id);
    if (error) toast.error(error.message);
    else {
      toast.success("Booking cancelled");
      queryClient.invalidateQueries({ queryKey: ["my-bookings"] });
    }
  };

  const statusBadge = (status: string) => {
    const map: Record<string, string> = {
      confirmed: "bg-success/20 text-success",
      pending: "bg-warning/20 text-warning",
      cancelled: "bg-destructive/20 text-destructive",
      completed: "bg-primary/20 text-primary",
    };
    return map[status] || "bg-secondary text-secondary-foreground";
  };

  const renderBooking = (b: any) => {
    const trip = b.trips;
    return (
      <div key={b.id} className="glass-card p-6">
        <div className="flex items-center justify-between mb-4">
          <Badge className={statusBadge(b.status)}>{b.status.toUpperCase()}</Badge>
          <span className="text-xs font-mono text-muted-foreground">REF: {b.booking_reference}</span>
        </div>
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1">
            <h3 className="text-xl font-bold font-heading mb-1">
              {trip?.origin} → {trip?.destination}
            </h3>
            <p className="text-sm text-muted-foreground flex items-center gap-2">
              <Bus className="h-4 w-4" /> {trip?.route_description || "Direct Route"}
            </p>
            <div className="grid grid-cols-3 gap-4 mt-4">
              <div>
                <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Departure</p>
                <p className="font-semibold text-sm">
                  {trip ? format(new Date(trip.departure_time), "MMM d, h:mm a") : "N/A"}
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Seat</p>
                <p className="font-semibold text-sm text-success">
                  {b.seat_number ? `SEAT ${b.seat_number}` : "Any"}
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Amount</p>
                <p className="font-semibold text-sm">GH₵ {Number(b.amount).toFixed(2)}</p>
              </div>
            </div>
            {b.status === "confirmed" && (
              <div className="flex gap-3 mt-6">
                <Button variant="outline" onClick={() => navigate("/passenger/track")}>
                  <MapPin className="mr-2 h-4 w-4" /> Track Trip
                </Button>
                <Button variant="ghost" className="text-destructive" onClick={() => handleCancel(b.id)}>
                  Cancel
                </Button>
              </div>
            )}
          </div>
          {b.status === "confirmed" && (
            <div className="glass-card p-6 flex flex-col items-center justify-center min-w-[180px]">
              <QrCode className="h-16 w-16 text-muted-foreground mb-2" />
              <p className="text-xs text-muted-foreground">Scan at Terminal Gate</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar variant="passenger" userName={profile?.full_name || "Passenger"} />
      <main className="max-w-5xl mx-auto p-6">
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-bold font-heading mb-2">My Bookings</h1>
          <p className="text-muted-foreground mb-6">Manage your upcoming journeys and boarding passes.</p>

          <Tabs defaultValue="upcoming" className="mb-8">
            <TabsList className="bg-secondary">
              <TabsTrigger value="upcoming">Upcoming ({upcoming.length})</TabsTrigger>
              <TabsTrigger value="completed">Completed ({completed.length})</TabsTrigger>
              <TabsTrigger value="cancelled">Cancelled ({cancelled.length})</TabsTrigger>
            </TabsList>
            <TabsContent value="upcoming" className="space-y-6 mt-6">
              {isLoading ? (
                <p className="text-muted-foreground text-center p-8">Loading bookings...</p>
              ) : upcoming.length ? (
                upcoming.map(renderBooking)
              ) : (
                <div className="text-center p-12">
                  <p className="text-muted-foreground mb-4">No upcoming bookings.</p>
                  <Button className="gradient-primary" onClick={() => navigate("/passenger/search")}>
                    <Search className="mr-2 h-4 w-4" /> Find a Trip
                  </Button>
                </div>
              )}
            </TabsContent>
            <TabsContent value="completed" className="space-y-6 mt-6">
              {completed.length ? completed.map(renderBooking) : (
                <p className="text-muted-foreground p-8 text-center">No completed trips yet.</p>
              )}
            </TabsContent>
            <TabsContent value="cancelled" className="space-y-6 mt-6">
              {cancelled.length ? cancelled.map(renderBooking) : (
                <p className="text-muted-foreground p-8 text-center">No cancelled bookings.</p>
              )}
            </TabsContent>
          </Tabs>

          <div className="gradient-success rounded-lg p-6 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold font-heading text-success-foreground">Plan your next trip?</h3>
              <p className="text-sm text-success-foreground/80">Secure your seat early and travel with confidence.</p>
            </div>
            <Button variant="outline" className="bg-background/20 border-success-foreground/30 text-success-foreground hover:bg-background/30" onClick={() => navigate("/passenger/search")}>
              Book New Trip
            </Button>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default ActiveBookings;
