import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Navigation, Clock, AlertTriangle, Play, Search, Flag } from "lucide-react";
import { motion } from "framer-motion";

const stops = [
  { name: "Accra Central", time: "08:00 AM", status: "Ready for departure", statusColor: "text-success", tag: "START", tagColor: "bg-success" },
  { name: "Nsawam Junction", time: "08:45 AM", status: "Pick-up: 12 passengers", statusColor: "text-muted-foreground" },
  { name: "Nkawkaw", time: "10:30 AM", status: "Rest Stop (15 mins)", statusColor: "text-muted-foreground" },
  { name: "Kumasi Kejetia", time: "12:30 PM", status: "Final Destination", statusColor: "text-muted-foreground" },
];

const DriverRoutes = () => (
  <div className="min-h-screen bg-background">
    <Navbar variant="driver" userName="Kwame Mensah" />
    <div className="flex">
      {/* Route Panel */}
      <aside className="w-96 border-r border-border p-6 space-y-6 min-h-[calc(100vh-4rem)]">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <p className="text-xs uppercase tracking-wider text-primary font-semibold mb-1">Current Assignment</p>
          <h1 className="text-2xl font-bold font-heading mb-1">Accra - Kumasi</h1>
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
            <AlertTriangle className="h-5 w-5 text-destructive" />
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
      <main className="flex-1 relative bg-secondary/30 flex items-center justify-center">
        <div className="glass-card p-3 absolute top-4 left-4 right-4 max-w-lg mx-auto flex items-center gap-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input placeholder="Search waypoints or landmarks..." className="bg-transparent text-sm outline-none flex-1 placeholder:text-muted-foreground" />
        </div>

        {/* Placeholder Map */}
        <div className="text-center">
          <Navigation className="h-16 w-16 text-primary/30 mx-auto mb-4" />
          <p className="text-muted-foreground text-lg">Interactive Map</p>
          <p className="text-sm text-muted-foreground">Accra Central → Kumasi Kejetia</p>
          <p className="text-xs text-muted-foreground mt-2">Route visualization will appear here</p>
        </div>

        {/* Weather Widget */}
        <div className="glass-card p-4 absolute bottom-4 right-4">
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
