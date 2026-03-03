import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Shield, Wallet as WalletIcon, Bus } from "lucide-react";
import { motion } from "framer-motion";
import { format } from "date-fns";

const WalletPage = () => {
  const { user, profile } = useAuth();

  const { data: bookings, isLoading } = useQuery({
    queryKey: ["wallet-transactions", user?.id],
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

  const totalSpent = bookings?.reduce((sum, b) => sum + Number(b.amount), 0) || 0;
  const paidAmount = bookings?.filter(b => b.payment_status === "paid").reduce((sum, b) => sum + Number(b.amount), 0) || 0;
  const pendingAmount = bookings?.filter(b => b.payment_status === "pending").reduce((sum, b) => sum + Number(b.amount), 0) || 0;

  return (
    <div className="min-h-screen bg-background">
      <Navbar variant="passenger" userName={profile?.full_name || "Passenger"} />
      <main className="max-w-6xl mx-auto p-6">
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold font-heading">Wallet & Payments</h1>
              <p className="text-muted-foreground mt-1">View your transaction history and payment status.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="space-y-6">
              {/* Summary Card */}
              <div className="gradient-primary rounded-lg p-6">
                <p className="text-xs uppercase tracking-wider text-primary-foreground/70 font-semibold mb-1">Total Spent</p>
                <p className="text-4xl font-bold font-heading text-primary-foreground mb-2">GH₵ {totalSpent.toFixed(2)}</p>
                <div className="flex gap-4 text-sm text-primary-foreground/80">
                  <span>Paid: GH₵ {paidAmount.toFixed(2)}</span>
                  <span>Pending: GH₵ {pendingAmount.toFixed(2)}</span>
                </div>
              </div>

              {/* Payment Info */}
              <div className="glass-card p-5">
                <h3 className="font-bold font-heading mb-3">Payment Methods</h3>
                <p className="text-sm text-muted-foreground">
                  Mobile Money (MoMo) integration is coming soon. Currently, payments are tracked through your bookings.
                </p>
                <div className="flex gap-3 mt-4">
                  {["MTN", "VODA", "AT"].map((m) => (
                    <div key={m} className="glass-card p-3 flex-1 text-center">
                      <p className="font-bold text-sm">{m}</p>
                      <p className="text-xs text-muted-foreground">MOMO</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Transactions */}
            <div className="lg:col-span-2">
              <div className="glass-card p-6">
                <h3 className="text-xl font-bold font-heading mb-4">Transaction History</h3>
                {isLoading ? (
                  <p className="text-muted-foreground text-center py-8">Loading...</p>
                ) : !bookings?.length ? (
                  <p className="text-muted-foreground text-center py-8">No transactions yet.</p>
                ) : (
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border text-xs uppercase tracking-wider text-muted-foreground">
                        <th className="text-left pb-3">Trip</th>
                        <th className="text-left pb-3">Date</th>
                        <th className="text-center pb-3">Payment</th>
                        <th className="text-right pb-3">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bookings.map((b) => (
                        <tr key={b.id} className="border-b border-border/50">
                          <td className="py-4">
                            <div className="flex items-center gap-3">
                              <div className="h-8 w-8 rounded-lg bg-secondary flex items-center justify-center">
                                <Bus className="h-4 w-4 text-muted-foreground" />
                              </div>
                              <div>
                                <p className="font-semibold text-sm">{b.trips?.origin} → {b.trips?.destination}</p>
                                <p className="text-xs text-muted-foreground">Ref: {b.booking_reference}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 text-sm">{format(new Date(b.created_at), "MMM d, yyyy")}</td>
                          <td className="py-4 text-center">
                            <Badge className={
                              b.payment_status === "paid" ? "bg-success/20 text-success border-0" :
                              b.payment_status === "pending" ? "bg-warning/20 text-warning border-0" :
                              "bg-destructive/20 text-destructive border-0"
                            }>
                              {b.payment_status}
                            </Badge>
                          </td>
                          <td className="py-4 text-right font-bold text-sm">GH₵ {Number(b.amount).toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>

          <div className="glass-card p-6 mt-8 flex items-center gap-4">
            <div className="h-14 w-14 rounded-full bg-primary/20 flex items-center justify-center">
              <Shield className="h-7 w-7 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold font-heading">Secure Payments</h3>
              <p className="text-sm text-muted-foreground">All transactions are encrypted and securely processed.</p>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default WalletPage;
