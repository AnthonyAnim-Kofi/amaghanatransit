import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/Navbar";
import StatCard from "@/components/StatCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DollarSign, Calendar, Bus } from "lucide-react";
import { motion } from "framer-motion";
import { format } from "date-fns";

const DriverEarnings = () => {
  const { user, profile } = useAuth();

  const { data: trips } = useQuery({
    queryKey: ["driver-trips-earnings", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("trips")
        .select("*")
        .eq("driver_id", user!.id);
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const { data: bookings } = useQuery({
    queryKey: ["driver-all-bookings", user?.id, trips?.map(t => t.id)],
    queryFn: async () => {
      if (!trips?.length) return [];
      const { data, error } = await supabase
        .from("bookings")
        .select("*, trips(*)")
        .in("trip_id", trips.map(t => t.id))
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!trips?.length,
  });

  const totalEarnings = bookings?.reduce((sum, b) => sum + Number(b.amount), 0) || 0;
  const paidBookings = bookings?.filter(b => b.payment_status === "paid") || [];
  const completedTrips = trips?.filter(t => t.status === "completed").length || 0;

  return (
    <div className="min-h-screen bg-background">
      <Navbar variant="driver" userName={profile?.full_name || "Driver"} />
      <main className="max-w-6xl mx-auto p-6">
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold font-heading">Earnings Overview</h1>
              <p className="text-muted-foreground mt-1">Track your income from bookings.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <StatCard label="Total Earnings" value={`GH₵ ${totalEarnings.toFixed(2)}`} icon={<DollarSign className="h-5 w-5" />} />
            <StatCard label="Paid Bookings" value={String(paidBookings.length)} icon={<Calendar className="h-5 w-5" />} />
            <StatCard label="Completed Trips" value={String(completedTrips)} icon={<Bus className="h-5 w-5" />} />
          </div>

          {/* Booking Earnings List */}
          <div className="glass-card p-6">
            <h3 className="text-xl font-bold font-heading mb-4">Booking History</h3>
            {!bookings?.length ? (
              <p className="text-muted-foreground text-center py-8">No bookings yet. Create trips to start earning.</p>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border text-xs uppercase tracking-wider text-muted-foreground">
                    <th className="text-left pb-3">Date</th>
                    <th className="text-left pb-3">Route</th>
                    <th className="text-left pb-3">Reference</th>
                    <th className="text-right pb-3">Amount</th>
                    <th className="text-center pb-3">Payment</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((b) => (
                    <tr key={b.id} className="border-b border-border/50">
                      <td className="py-4 text-sm">{format(new Date(b.created_at), "MMM d, yyyy")}</td>
                      <td className="py-4 text-sm">{b.trips?.origin} → {b.trips?.destination}</td>
                      <td className="py-4 text-sm font-mono text-muted-foreground">{b.booking_reference}</td>
                      <td className="py-4 text-right font-bold text-sm text-success">GH₵ {Number(b.amount).toFixed(2)}</td>
                      <td className="py-4 text-center">
                        <Badge className={
                          b.payment_status === "paid" ? "bg-success/20 text-success border-0" :
                          b.payment_status === "pending" ? "bg-warning/20 text-warning border-0" :
                          "bg-destructive/20 text-destructive border-0"
                        }>
                          {b.payment_status}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default DriverEarnings;
