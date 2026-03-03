import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/Navbar";
import AppSidebar from "@/components/AppSidebar";
import StatCard from "@/components/StatCard";
import { Button } from "@/components/ui/button";
import { Home, Clock, Wallet, Package, Bus, MapPin, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { format } from "date-fns";

const sidebarLinks = [
  { to: "/passenger/dashboard", label: "Home", icon: Home },
  { to: "/passenger/history", label: "Trip History", icon: Clock },
  { to: "/passenger/wallet", label: "Momo / Wallet", icon: Wallet },
  { to: "/passenger/bookings", label: "My Bookings", icon: Package },
];

const PassengerDashboard = () => {
  const navigate = useNavigate();
  const { user, profile } = useAuth();

  const { data: bookings } = useQuery({
    queryKey: ["passenger-stats", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bookings")
        .select("*, trips(*)")
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false })
        .limit(5);
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const totalTrips = bookings?.filter(b => b.status === "completed").length || 0;
  const activeBookings = bookings?.filter(b => b.status === "confirmed" || b.status === "pending").length || 0;
  const totalSpent = bookings?.reduce((sum, b) => b.payment_status === "paid" ? sum + Number(b.amount) : sum, 0) || 0;

  const recentBookings = bookings?.slice(0, 3) || [];

  return (
    <div className="min-h-screen bg-background">
      <Navbar variant="passenger" userName={profile?.full_name || "Passenger"} />
      <div className="flex">
        <AppSidebar
          links={sidebarLinks}
          header={
            <div>
              <p className="text-primary font-semibold text-sm">Welcome back!</p>
              <p className="text-xs text-muted-foreground">{profile?.full_name || "Passenger"}</p>
            </div>
          }
          footer={
            <div className="text-xs text-muted-foreground">
              <p className="font-semibold text-foreground mb-1">RECENT BOOKINGS</p>
              {recentBookings.map((b) => (
                <div key={b.id} className="glass-card p-3 mb-2">
                  <p className="text-primary text-xs font-medium">
                    {b.trips?.origin} → {b.trips?.destination}
                  </p>
                  <div className="flex justify-between mt-1">
                    <span>GH₵ {Number(b.amount).toFixed(2)}</span>
                    <span className="text-primary cursor-pointer capitalize">{b.status}</span>
                  </div>
                </div>
              ))}
            </div>
          }
        />
        <main className="flex-1 p-6 space-y-6">
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <StatCard label="Completed Trips" value={String(totalTrips)} icon={<Bus className="h-5 w-5" />} />
              <StatCard label="Active Bookings" value={String(activeBookings)} icon={<Package className="h-5 w-5" />} trendColor="primary" />
              <StatCard label="Total Spent" value={`GH₵ ${totalSpent.toFixed(2)}`} icon={<Wallet className="h-5 w-5" />} />
            </div>

            {/* Quick Actions */}
            <div className="glass-card p-6 max-w-2xl">
              <h1 className="text-2xl font-bold font-heading mb-4">Book Your Ride</h1>
              <p className="text-muted-foreground text-sm mb-6">Search for available buses and book your seat instantly.</p>
              <Button className="w-full gradient-primary font-semibold py-6 text-base" onClick={() => navigate("/passenger/search")}>
                Search Available Trips <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>

            {/* Active bookings */}
            {activeBookings > 0 && (
              <div className="glass-card p-4 max-w-2xl flex items-center gap-3 cursor-pointer" onClick={() => navigate("/passenger/bookings")}>
                <div className="h-10 w-10 rounded-lg gradient-primary flex items-center justify-center">
                  <Bus className="h-5 w-5 text-primary-foreground" />
                </div>
                <div>
                  <p className="font-semibold text-sm">You have {activeBookings} active booking{activeBookings > 1 ? "s" : ""}</p>
                  <p className="text-xs text-muted-foreground">Tap to view details</p>
                </div>
              </div>
            )}
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default PassengerDashboard;
