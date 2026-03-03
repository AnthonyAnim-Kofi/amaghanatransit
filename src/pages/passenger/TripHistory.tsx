import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/Navbar";
import StatCard from "@/components/StatCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bus, Search } from "lucide-react";
import { motion } from "framer-motion";
import { format } from "date-fns";

const TripHistory = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();

  const { data: bookings, isLoading } = useQuery({
    queryKey: ["trip-history", user?.id],
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

  const totalTrips = bookings?.length || 0;
  const totalSpent = bookings?.reduce((sum, b) => sum + Number(b.amount), 0) || 0;
  const completedTrips = bookings?.filter(b => b.status === "completed").length || 0;

  return (
    <div className="min-h-screen bg-background">
      <Navbar variant="passenger" userName={profile?.full_name || "Passenger"} />
      <main className="max-w-6xl mx-auto p-6">
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold font-heading">Trip History</h1>
              <p className="text-muted-foreground mt-1">Keep track of all your journeys.</p>
            </div>
            <Button className="gradient-primary" onClick={() => navigate("/passenger/search")}>
              <Bus className="mr-2 h-4 w-4" /> Book New Trip
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <StatCard label="Total Trips" value={String(totalTrips)} icon={<Bus className="h-5 w-5" />} />
            <StatCard label="Total Spent" value={`GH₵ ${totalSpent.toFixed(2)}`} icon={<Bus className="h-5 w-5" />} />
            <StatCard label="Completed" value={String(completedTrips)} icon={<Bus className="h-5 w-5" />} />
          </div>

          <div className="glass-card overflow-hidden">
            {isLoading ? (
              <p className="text-muted-foreground text-center p-8">Loading trip history...</p>
            ) : !bookings?.length ? (
              <div className="p-12 text-center">
                <p className="text-muted-foreground mb-4">No trips yet. Start by booking a trip!</p>
                <Button className="gradient-primary" onClick={() => navigate("/passenger/search")}>
                  <Search className="mr-2 h-4 w-4" /> Find a Trip
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border text-xs uppercase tracking-wider text-muted-foreground">
                      <th className="text-left p-4">Date</th>
                      <th className="text-left p-4">Route</th>
                      <th className="text-right p-4">Fare</th>
                      <th className="text-center p-4">Payment</th>
                      <th className="text-center p-4">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map((b) => (
                      <tr key={b.id} className="border-b border-border/50 hover:bg-accent/50 transition-colors">
                        <td className="p-4">
                          <p className="font-semibold text-sm">{format(new Date(b.created_at), "MMM d, yyyy")}</p>
                          <p className="text-xs text-muted-foreground">{format(new Date(b.created_at), "h:mm a")}</p>
                        </td>
                        <td className="p-4 text-sm">{b.trips?.origin} → {b.trips?.destination}</td>
                        <td className="p-4 text-right font-bold text-sm">GH₵ {Number(b.amount).toFixed(2)}</td>
                        <td className="p-4 text-center">
                          <Badge className={
                            b.payment_status === "paid" ? "bg-success/20 text-success border-0" :
                            b.payment_status === "pending" ? "bg-warning/20 text-warning border-0" :
                            "bg-destructive/20 text-destructive border-0"
                          }>
                            {b.payment_status}
                          </Badge>
                        </td>
                        <td className="p-4 text-center">
                          <Badge className={
                            b.status === "completed" ? "bg-success/20 text-success border-0" :
                            b.status === "confirmed" ? "bg-primary/20 text-primary border-0" :
                            b.status === "cancelled" ? "bg-destructive/20 text-destructive border-0" :
                            "bg-warning/20 text-warning border-0"
                          }>
                            {b.status}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default TripHistory;
