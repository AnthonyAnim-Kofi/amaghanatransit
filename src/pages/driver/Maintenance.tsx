import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import StatCard from "@/components/StatCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Bus, Wrench, Plus, Gauge } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import type { Database } from "@/integrations/supabase/types";

type MaintenanceStatus = Database["public"]["Enums"]["maintenance_status"];

const VehicleMaintenance = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: vehicles, isLoading } = useQuery({
    queryKey: ["driver-vehicles", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("vehicles")
        .select("*")
        .eq("driver_id", user!.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const handleStatusUpdate = async (id: string, status: MaintenanceStatus) => {
    const { error } = await supabase.from("vehicles").update({ maintenance_status: status }).eq("id", id);
    if (error) toast.error(error.message);
    else {
      toast.success("Status updated");
      queryClient.invalidateQueries({ queryKey: ["driver-vehicles"] });
    }
  };

  const goodCount = vehicles?.filter(v => v.maintenance_status === "good").length || 0;
  const needsServiceCount = vehicles?.filter(v => v.maintenance_status === "needs_service").length || 0;

  return (
    <div className="min-h-screen bg-background">
      <Navbar variant="driver" userName={profile?.full_name || "Driver"} />
      <main className="max-w-6xl mx-auto p-6">
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold font-heading">Vehicle Maintenance</h1>
              <p className="text-muted-foreground mt-1">Monitor and update your vehicle health status.</p>
            </div>
            <Button className="gradient-primary" onClick={() => navigate("/driver/vehicles")}>
              <Plus className="mr-2 h-4 w-4" /> Add Vehicle
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <StatCard label="Total Vehicles" value={String(vehicles?.length || 0)} icon={<Bus className="h-5 w-5" />} />
            <StatCard label="Good Condition" value={String(goodCount)} icon={<Gauge className="h-5 w-5" />} trendColor="success" />
            <StatCard label="Needs Service" value={String(needsServiceCount)} icon={<Wrench className="h-5 w-5" />} trendColor="destructive" />
          </div>

          {isLoading ? (
            <p className="text-muted-foreground text-center p-8">Loading vehicles...</p>
          ) : !vehicles?.length ? (
            <div className="glass-card p-12 text-center">
              <Bus className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-4">No vehicles registered yet.</p>
              <Button className="gradient-primary" onClick={() => navigate("/driver/vehicles")}>
                Register Vehicle
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {vehicles.map((v) => (
                <div key={v.id} className="glass-card p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-lg bg-primary/20 flex items-center justify-center">
                        <Bus className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg">{v.make} {v.model || ""}</h3>
                        <p className="text-sm text-muted-foreground">
                          {v.plate_number} • {v.vehicle_type} • {v.capacity} seats
                          {v.year ? ` • ${v.year}` : ""}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Select value={v.maintenance_status} onValueChange={(val) => handleStatusUpdate(v.id, val as MaintenanceStatus)}>
                        <SelectTrigger className="w-40">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="good">Good</SelectItem>
                          <SelectItem value="needs_service">Needs Service</SelectItem>
                          <SelectItem value="in_repair">In Repair</SelectItem>
                          <SelectItem value="decommissioned">Decommissioned</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
};

export default VehicleMaintenance;
