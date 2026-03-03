import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, AlertTriangle, Play, Search, Flag } from "lucide-react";
import { motion } from "framer-motion";
import LeafletMap from "@/components/LeafletMap";

const stops = [
  { name: "Accra Central", time: "08:00 AM", status: "Ready for departure", statusColor: "text-success", tag: "START", tagColor: "bg-success", lat: 5.55, lng: -0.2 },
  { name: "Nsawam Junction", time: "08:45 AM", status: "Pick-up: 12 passengers", statusColor: "text-muted-foreground", lat: 5.81, lng: -0.35 },
  { name: "Nkawkaw", time: "10:30 AM", status: "Rest Stop (15 mins)", statusColor: "text-muted-foreground", lat: 6.55, lng: -0.78 },
  { name: "Kumasi Kejetia", time: "12:30 PM", status: "Final Destination", statusColor: "text-muted-foreground", lat: 6.69, lng: -1.62 },
];

const routeCoords: [number, number][] = [
  [5.55, -0.2], [5.60, -0.22], [5.65, -0.25], [5.72, -0.29],
  [5.81, -0.35], [5.95, -0.45], [6.10, -0.55], [6.30, -0.65],
  [6.55, -0.78], [6.60, -1.0], [6.65, -1.3], [6.69, -1.62],
];

const markers = stops.map((s, i) => ({
  lat: s.lat,
  lng: s.lng,
  label: s.name,
  color: (i === 0 ? "green" : i === stops.length - 1 ? "red" : "blue") as "green" | "red" | "blue",
}));

const DriverRoutes = () => (
  <div className="min-h-screen bg-background">
    <Navbar variant="driver" userName="Kwame Mensah" />
    <div className="flex flex-col lg:flex-row">
      {/* Route Panel */}
      <aside className="w-full lg:w-96 border-b lg:border-b-0 lg:border-r border-border p-4 md:p-6 space-y-4 md:space-y-6 lg:min-h-[calc(100vh-4rem)] lg:overflow-y-auto">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <p className="text-xs uppercase tracking-wider text-primary font-semibold mb-1">Current Assignment</p>
          <h1 className="text-xl md:text-2xl font-bold font-heading mb-1">Accra - Kumasi</h1>
          <p className="text-sm text-muted-foreground mb-4">Main VIP Route via N6 Highway</p>

          <div className="flex gap-3 mb-6">
            <div className="glass-card p-3 flex-1">
              <p className="text-xs uppercase tracking-wider text-muted-foreground">Distance</p>
              <p className="text-lg font-bold font-heading">248 km</p>
            </div>
            <div className="glass-card p-3 flex-1">
              <p className="text-xs uppercase tracking-wider text-muted-foreground">Est. Time</p>
              <p className="text-lg font-bold font-heading">4h 30m</p>
            </div>
          </div>

          {/* Traffic Alert */}
          <div className="flex items-center gap-3 p-3 rounded-lg bg-destructive/10 border border-destructive/20 mb-6">
            <AlertTriangle className="h-5 w-5 text-destructive shrink-0" />
            <div>
              <p className="text-sm font-bold text-destructive">Heavy Traffic near Suhum</p>
              <p className="text-xs text-muted-foreground">+15 mins delay expected due to construction.</p>
            </div>
          </div>

          {/* Scheduled Stops */}
          <h3 className="text-sm font-bold uppercase tracking-wider mb-4 flex items-center gap-2">
            <Flag className="h-4 w-4" /> Scheduled Stops
          </h3>
          <div className="space-y-1">
            {stops.map((stop, i) => (
              <div key={i} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center ${i === 0 ? "bg-primary" : i === stops.length - 1 ? "bg-muted" : "bg-secondary"}`}>
                    <MapPin className="h-4 w-4" />
                  </div>
                  {i < stops.length - 1 && <div className="w-0.5 h-12 bg-border" />}
                </div>
                <div className="pb-6">
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-sm">{stop.name}</p>
                    {stop.tag && <Badge className={`${stop.tagColor} text-primary-foreground text-xs`}>{stop.tag}</Badge>}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {i === 0 ? "Scheduled" : "ETA"}: {stop.time}
                  </p>
                  <p className={`text-xs ${stop.statusColor}`}>{stop.status}</p>
                </div>
              </div>
            ))}
          </div>

          <Button className="w-full gradient-primary py-6 text-base font-semibold mt-6">
            <Play className="mr-2 h-5 w-5" /> START ROUTE
          </Button>
          <p className="text-xs text-center text-muted-foreground uppercase mt-2">Tap to initiate live tracking</p>
        </motion.div>
      </aside>

      {/* Map Area */}
      <main className="flex-1 relative min-h-[50vh] lg:min-h-[calc(100vh-4rem)]">
        <div className="glass-card p-3 absolute top-4 left-4 right-4 max-w-lg mx-auto flex items-center gap-2 z-[1000]">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input placeholder="Search waypoints or landmarks..." className="bg-transparent text-sm outline-none flex-1 placeholder:text-muted-foreground" />
        </div>

        <LeafletMap
          center={[6.1, -0.9]}
          zoom={8}
          markers={markers}
          route={routeCoords}
          className="h-full"
        />

        {/* Weather Widget */}
        <div className="glass-card p-4 absolute bottom-4 right-4 z-[1000]">
          <div className="flex items-center gap-3">
            <span className="text-2xl">☀️</span>
            <div>
              <p className="text-lg font-bold">31°C</p>
              <p className="text-xs text-muted-foreground">Clear skies in Accra</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
);

export default DriverRoutes;
