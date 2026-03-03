import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { ArrowLeft, Bus, MapPin, Clock, DollarSign, Users, Route } from "lucide-react";

const CreateTrip = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    origin: "",
    destination: "",
    departure_time: "",
    arrival_time: "",
    price: "",
    total_seats: "30",
    vehicle_id: "",
    distance_km: "",
    route_description: "",
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

  const updateField = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (field === "vehicle_id" && value) {
      const vehicle = vehicles?.find((v) => v.id === value);
      if (vehicle) setForm((prev) => ({ ...prev, vehicle_id: value, total_seats: String(vehicle.capacity) }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!form.origin || !form.destination || !form.departure_time || !form.price) {
      toast.error("Please fill in all required fields");
      return;
    }

    setLoading(true);
    const { error } = await supabase.from("trips").insert({
      driver_id: user.id,
      origin: form.origin.trim(),
      destination: form.destination.trim(),
      departure_time: new Date(form.departure_time).toISOString(),
      arrival_time: form.arrival_time ? new Date(form.arrival_time).toISOString() : null,
      price: parseFloat(form.price),
      total_seats: parseInt(form.total_seats),
      seats_available: parseInt(form.total_seats),
      vehicle_id: form.vehicle_id || null,
      distance_km: form.distance_km ? parseFloat(form.distance_km) : null,
      route_description: form.route_description.trim() || null,
    });

    setLoading(false);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Trip created successfully!");
      navigate("/driver/routes");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar variant="driver" userName={profile?.full_name || "Driver"} />
      <main className="max-w-2xl mx-auto p-4 md:p-6">
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>

          <Card className="glass-card border-border">
            <CardHeader>
              <CardTitle className="text-2xl font-heading flex items-center gap-2">
                <Route className="h-6 w-6 text-primary" /> Create New Trip
              </CardTitle>
              <CardDescription>Set up a new trip with route details, pricing, and vehicle assignment.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Route */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-primary" /> Origin *
                    </Label>
                    <Input placeholder="e.g. Accra Central" value={form.origin} onChange={(e) => updateField("origin", e.target.value)} required maxLength={100} />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-destructive" /> Destination *
                    </Label>
                    <Input placeholder="e.g. Kumasi Kejetia" value={form.destination} onChange={(e) => updateField("destination", e.target.value)} required maxLength={100} />
                  </div>
                </div>

                {/* Times */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" /> Departure Time *
                    </Label>
                    <Input type="datetime-local" value={form.departure_time} onChange={(e) => updateField("departure_time", e.target.value)} required />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" /> Estimated Arrival
                    </Label>
                    <Input type="datetime-local" value={form.arrival_time} onChange={(e) => updateField("arrival_time", e.target.value)} />
                  </div>
                </div>

                {/* Vehicle */}
                <div className="space-y-2">
                  <Label className="text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                    <Bus className="h-3 w-3" /> Assign Vehicle
                  </Label>
                  <Select value={form.vehicle_id} onValueChange={(v) => updateField("vehicle_id", v)}>
                    <SelectTrigger>
                      <SelectValue placeholder={vehicles?.length ? "Select a vehicle" : "No vehicles registered"} />
                    </SelectTrigger>
                    <SelectContent>
                      {vehicles?.map((v) => (
                        <SelectItem key={v.id} value={v.id}>
                          {v.make} {v.model} — {v.plate_number} ({v.capacity} seats)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Pricing & Seats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                      <DollarSign className="h-3 w-3" /> Price (GH₵) *
                    </Label>
                    <Input type="number" min="0" step="0.01" placeholder="120.00" value={form.price} onChange={(e) => updateField("price", e.target.value)} required />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                      <Users className="h-3 w-3" /> Total Seats
                    </Label>
                    <Input type="number" min="1" max="100" value={form.total_seats} onChange={(e) => updateField("total_seats", e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs uppercase tracking-wider text-muted-foreground">Distance (km)</Label>
                    <Input type="number" min="0" step="0.1" placeholder="248" value={form.distance_km} onChange={(e) => updateField("distance_km", e.target.value)} />
                  </div>
                </div>

                {/* Route Description */}
                <div className="space-y-2">
                  <Label className="text-xs uppercase tracking-wider text-muted-foreground">Route Description</Label>
                  <Textarea placeholder="e.g. Via N6 Highway, stops at Nsawam & Nkawkaw" value={form.route_description} onChange={(e) => updateField("route_description", e.target.value)} maxLength={500} rows={3} />
                </div>

                <Button type="submit" className="w-full gradient-primary py-6 text-base font-semibold" disabled={loading}>
                  {loading ? "Creating..." : "Create Trip"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
};

export default CreateTrip;
