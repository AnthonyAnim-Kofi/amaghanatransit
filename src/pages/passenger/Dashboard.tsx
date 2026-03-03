import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import AppSidebar from "@/components/AppSidebar";
import StatCard from "@/components/StatCard";
import { Button } from "@/components/ui/button";
import { Home, Clock, Wallet, Package, Bus, MapPin, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const sidebarLinks = [
  { to: "/passenger/dashboard", label: "Home", icon: Home },
  { to: "/passenger/history", label: "Trip History", icon: Clock },
  { to: "/passenger/wallet", label: "Momo / Wallet", icon: Wallet },
  { to: "/passenger/bookings", label: "My Bookings", icon: Package },
];

const recentTrips = [
  { route: "Accra → Kumasi", service: "VIP/JEOUN Terminal", fare: "GH₵ 120.00", action: "VIEW TICKET" },
  { route: "Circle → Kasoa", service: "Private Taxi", fare: "GH₵ 65.00", action: "REBOOK" },
];

const PassengerDashboard = () => {
  const [rideType, setRideType] = useState<"bus" | "taxi">("bus");
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <Navbar variant="passenger" userName="Kwesi Mensah" />
      <div className="flex">
        <AppSidebar
          links={sidebarLinks}
          header={
            <div>
              <p className="text-primary font-semibold text-sm">Ghana Hub</p>
              <p className="text-xs text-muted-foreground">Where are we heading today?</p>
            </div>
          }
          footer={
            <div className="text-xs text-muted-foreground">
              <p className="font-semibold text-foreground mb-1">RECENT TRIPS</p>
              {recentTrips.map((t, i) => (
                <div key={i} className="glass-card p-3 mb-2">
                  <p className="text-primary text-xs font-medium">{t.route}</p>
                  <p className="text-foreground text-sm font-semibold">{t.service}</p>
                  <div className="flex justify-between mt-1">
                    <span>{t.fare}</span>
                    <span className="text-primary cursor-pointer">{t.action}</span>
                  </div>
                </div>
              ))}
            </div>
          }
        />
        <main className="flex-1 p-6 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-6 max-w-2xl"
          >
            <h1 className="text-2xl font-bold font-heading mb-4">Book Your Ride</h1>

            {/* Ride Type Toggle */}
            <div className="flex rounded-lg bg-secondary p-1 mb-6">
              {(["bus", "taxi"] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setRideType(type)}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-md text-sm font-medium transition-all ${
                    rideType === type ? "gradient-primary text-primary-foreground" : "text-muted-foreground"
                  }`}
                >
                  <Bus className="h-4 w-4" />
                  {type === "bus" ? "Bus" : "Taxi"}
                </button>
              ))}
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 block">
                  {rideType === "bus" ? "Bus Service Provider" : "Taxi Type"}
                </label>
                <div className="glass-card p-3 flex items-center gap-3">
                  <Bus className="h-5 w-5 text-muted-foreground" />
                  <span className="text-muted-foreground text-sm">
                    {rideType === "bus" ? "Select Bus Operator" : "Select Taxi Type"}
                  </span>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 block">Pickup Location</label>
                <div className="glass-card p-3 flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-primary" />
                  <span className="text-sm">Accra Central Terminal</span>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 block">Destination</label>
                <div className="glass-card p-3 flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-destructive" />
                  <span className="text-sm">Kumasi Kejetia</span>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 block">Departure Time</label>
                <div className="glass-card p-3 flex items-center gap-3">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                  <span className="text-sm">Available Next (6:00 AM)</span>
                </div>
              </div>

              <Button className="w-full gradient-primary font-semibold py-6 text-base" onClick={() => navigate("/passenger/search")}>
                Search Available Trips <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <p className="text-center text-sm text-muted-foreground">
                Current Fare Estimate: <span className="font-bold text-foreground">GH₵ 110.00 - GH₵ 140.00</span>
              </p>
            </div>
          </motion.div>

          {/* Live Bus Status */}
          <div className="glass-card p-4 max-w-2xl flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg gradient-primary flex items-center justify-center">
              <Bus className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <p className="font-semibold text-sm">Live Bus Status</p>
              <p className="text-xs text-muted-foreground">12 buses departing in next hour</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default PassengerDashboard;
