import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Plus, Bus, Trash2, Pencil } from "lucide-react";
import type { Database } from "@/integrations/supabase/types";

type VehicleType = Database["public"]["Enums"]["vehicle_type"];

const VehicleRegistration = () => {
  const { user, profile } = useAuth();
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    plate_number: "",
    vehicle_type: "bus" as VehicleType,
    make: "",
    model: "",
    year: "",
    capacity: "30",
  });

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);

    const { error } = await supabase.from("vehicles").insert({
      driver_id: user.id,
      plate_number: form.plate_number.trim(),
      vehicle_type: form.vehicle_type,
      make: form.make.trim() || null,
      model: form.model.trim() || null,
      year: form.year ? parseInt(form.year) : null,
      capacity: parseInt(form.capacity),
    });

    setLoading(false);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Vehicle registered successfully!");
      setShowForm(false);
      setForm({ plate_number: "", vehicle_type: "bus", make: "", model: "", year: "", capacity: "30" });
      queryClient.invalidateQueries({ queryKey: ["driver-vehicles"] });
    }
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("vehicles").delete().eq("id", id);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Vehicle removed");
      queryClient.invalidateQueries({ queryKey: ["driver-vehicles"] });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar variant="driver" userName={profile?.full_name || "Driver"} />
      <main className="max-w-4xl mx-auto p-4 md:p-6">
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold font-heading">My Vehicles</h1>
              <p className="text-muted-foreground mt-1">Register and manage your vehicles.</p>
            </div>
            <Button className="gradient-primary" onClick={() => setShowForm(true)}>
              <Plus className="mr-2 h-4 w-4" /> Add Vehicle
            </Button>
          </div>

          {isLoading ? (
            <div className="text-center py-12 text-muted-foreground">Loading vehicles...</div>
          ) : !vehicles?.length ? (
            <div className="glass-card p-12 text-center">
              <Bus className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-bold font-heading mb-2">No Vehicles Registered</h3>
              <p className="text-muted-foreground mb-4">Register your first vehicle to start creating trips.</p>
              <Button className="gradient-primary" onClick={() => setShowForm(true)}>
                <Plus className="mr-2 h-4 w-4" /> Register Vehicle
              </Button>
            </div>
          ) : (
            <div className="grid gap-4">
              {vehicles.map((v) => (
                <Card key={v.id} className="glass-card border-border">
                  <CardContent className="p-5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-lg bg-primary/20 flex items-center justify-center">
                          <Bus className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-bold text-lg">{v.make} {v.model || ""}</h3>
                          <p className="text-sm text-muted-foreground">
                            {v.plate_number} • {v.capacity} seats • {v.vehicle_type}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge className={
                          v.maintenance_status === "good" ? "bg-success/20 text-success border-0" :
                          v.maintenance_status === "needs_service" ? "bg-warning/20 text-warning border-0" :
                          "bg-destructive/20 text-destructive border-0"
                        }>
                          {v.maintenance_status.replace("_", " ")}
                        </Badge>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(v.id)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </motion.div>
      </main>

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-heading">Register Vehicle</DialogTitle>
            <DialogDescription>Add your vehicle details to start creating trips.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">Plate Number *</Label>
              <Input placeholder="e.g. GW-4829-22" value={form.plate_number} onChange={(e) => setForm({ ...form, plate_number: e.target.value })} required />
            </div>
            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">Vehicle Type *</Label>
              <Select value={form.vehicle_type} onValueChange={(v) => setForm({ ...form, vehicle_type: v as VehicleType })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="bus">Bus</SelectItem>
                  <SelectItem value="minibus">Minibus</SelectItem>
                  <SelectItem value="sprinter">Sprinter</SelectItem>
                  <SelectItem value="trotro">Trotro</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-wider text-muted-foreground">Make</Label>
                <Input placeholder="e.g. Toyota" value={form.make} onChange={(e) => setForm({ ...form, make: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-wider text-muted-foreground">Model</Label>
                <Input placeholder="e.g. Coaster" value={form.model} onChange={(e) => setForm({ ...form, model: e.target.value })} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-wider text-muted-foreground">Year</Label>
                <Input type="number" placeholder="2020" value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label className="text-xs uppercase tracking-wider text-muted-foreground">Capacity (seats) *</Label>
                <Input type="number" min="1" max="100" value={form.capacity} onChange={(e) => setForm({ ...form, capacity: e.target.value })} required />
              </div>
            </div>
            <DialogFooter className="gap-2">
              <Button variant="outline" type="button" onClick={() => setShowForm(false)}>Cancel</Button>
              <Button type="submit" className="gradient-primary" disabled={loading}>
                {loading ? "Registering..." : "Register Vehicle"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default VehicleRegistration;
