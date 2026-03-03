import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/Navbar";
import AppSidebar from "@/components/AppSidebar";
import StatCard from "@/components/StatCard";
import DriverLocationSharing from "@/components/DriverLocationSharing";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LayoutDashboard, DollarSign, Settings, Bus, Plus, Users, MapPin, Clock } from "lucide-react";
import { motion } from "framer-motion";
import { format } from "date-fns";

const sidebarLinks = [
  { to: "/driver/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/driver/vehicles", label: "My Vehicles", icon: Bus },
  { to: "/driver/earnings", label: "Earnings", icon: DollarSign },
  { to: "/driver/routes", label: "Routes", icon: MapPin },
  { to: "/driver/settings", label: "Settings", icon: Settings },
];

const DriverDashboard = () => {
  const navigate = useNavigate();
  const { user, profile } = useAuth();

  const { data: trips } = useQuery({
    queryKey: ["driver-trips", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("trips")
        .select("*")
        .eq("driver_id", user!.id)
        .order("departure_time", { ascending: false })
        .limit(10);
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const { data: bookings } = useQuery({
    queryKey: ["driver-bookings", user?.id],
    queryFn: async () => {
      if (!trips?.length) return [];
      const tripIds = trips.map(t => t.id);
      const { data, error } = await supabase
        .from("bookings")
        .select("*, trips(*)")
        .in("trip_id", tripIds)
        .eq("status", "confirmed")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!trips?.length,
  });

  const { data: vehicles } = useQuery({
    queryKey: ["driver-vehicles", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("vehicles")
        .select("*")
        .eq("driver_id", user!.id);
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const scheduledTrips = trips?.filter(t => t.status === "scheduled") || [];
  const completedTrips = trips?.filter(t => t.status === "completed") || [];
  const totalEarnings = bookings?.reduce((sum, b) => sum + Number(b.amount), 0) || 0;
  const pendingBookings = bookings?.filter(b => b.status === "confirmed") || [];

  return (
    <div className="min-h-screen bg-background">
      <Navbar variant="driver" userName={profile?.full_name || "Driver"} />
      <div className="flex">
        <AppSidebar
          links={sidebarLinks}
          header={
            <div className="glass-card p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <Bus className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-sm">{profile?.full_name || "Driver"}</p>
                  <p className="text-xs text-muted-foreground">{profile?.email}</p>
                </div>
              </div>
              <Badge className="bg-success/20 text-success border-0 text-xs">● DRIVER</Badge>
            </div>
          }
          footer={
            <div className="text-xs text-muted-foreground">
              <p className="font-semibold text-foreground uppercase tracking-wider mb-2">Summary</p>
              <div className="flex justify-between mb-1"><span>Vehicles</span><span className="font-bold text-foreground">{vehicles?.length || 0}</span></div>
              <div className="flex justify-between mb-1"><span>Active Trips</span><span className="font-bold text-foreground">{scheduledTrips.length}</span></div>
              <div className="flex justify-between"><span>Earnings</span><span className="font-bold text-success">GH₵ {totalEarnings.toFixed(2)}</span></div>
            </div>
          }
        />
        <main className="flex-1 p-6 space-y-6">
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <StatCard label="Vehicles" value={String(vehicles?.length || 0)} icon={<Bus className="h-5 w-5" />} />
              <StatCard label="Scheduled Trips" value={String(scheduledTrips.length)} icon={<Clock className="h-5 w-5" />} trendColor="primary" />
              <StatCard label="Completed Trips" value={String(completedTrips.length)} icon={<MapPin className="h-5 w-5" />} />
              <StatCard label="Total Earnings" value={`GH₵ ${totalEarnings.toFixed(2)}`} icon={<DollarSign className="h-5 w-5" />} trendColor="success" />
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap gap-3">
              <Button className="gradient-primary" onClick={() => navigate("/driver/create-trip")}>
                <Plus className="mr-2 h-4 w-4" /> Create New Trip
              </Button>
              <Button variant="outline" onClick={() => navigate("/driver/vehicles")}>
                <Bus className="mr-2 h-4 w-4" /> Manage Vehicles
              </Button>
            </div>

            {/* No vehicles warning */}
            {!vehicles?.length && (
              <div className="glass-card p-6 border-l-4 border-warning">
                <h3 className="font-bold text-warning mb-1">No Vehicles Registered</h3>
                <p className="text-sm text-muted-foreground mb-3">Register a vehicle before creating trips.</p>
                <Button variant="outline" size="sm" onClick={() => navigate("/driver/vehicles")}>
                  <Plus className="mr-2 h-4 w-4" /> Register Vehicle
                </Button>
              </div>
            )}

            {/* Upcoming Trips */}
            <div>
              <h2 className="text-xl font-bold font-heading mb-4">Upcoming Trips</h2>
              {scheduledTrips.length === 0 ? (
                <div className="glass-card p-8 text-center text-muted-foreground">
                  <p>No scheduled trips. Create one to get started.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {scheduledTrips.map((trip) => (
                    <div key={trip.id} className="glass-card p-5">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-bold text-lg">{trip.origin} → {trip.destination}</h3>
                          <p className="text-sm text-muted-foreground flex items-center gap-2">
                            <Clock className="h-3.5 w-3.5" />
                            {format(new Date(trip.departure_time), "MMM d, yyyy • h:mm a")}
                          </p>
                          <p className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                            <Users className="h-3.5 w-3.5" />
                            {trip.seats_available}/{trip.total_seats} seats available
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-bold text-success">GH₵ {Number(trip.price).toFixed(2)}</p>
                          <Badge className="bg-primary/20 text-primary border-0">{trip.status}</Badge>
                        </div>
                      </div>
                      <div className="mt-4">
                        <DriverLocationSharing tripId={trip.id} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Recent Bookings for my trips */}
            {pendingBookings.length > 0 && (
              <div>
                <h2 className="text-xl font-bold font-heading mb-4">Recent Bookings on My Trips</h2>
                <div className="space-y-3">
                  {pendingBookings.slice(0, 5).map((b) => (
                    <div key={b.id} className="glass-card p-4 flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-sm">{b.trips?.origin} → {b.trips?.destination}</p>
                        <p className="text-xs text-muted-foreground">Ref: {b.booking_reference} • Seat {b.seat_number || "Any"}</p>
                      </div>
                      <p className="font-bold text-success">GH₵ {Number(b.amount).toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default DriverDashboard;
