import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import AppSidebar from "@/components/AppSidebar";
import StatCard from "@/components/StatCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { LayoutDashboard, DollarSign, Wrench, Settings, Star, MapPin, Phone, Bus, Plus } from "lucide-react";
import { motion } from "framer-motion";

const sidebarLinks = [
  { to: "/driver/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/driver/earnings", label: "Earnings & Cashout", icon: DollarSign },
  { to: "/driver/maintenance", label: "Bus Maintenance", icon: Wrench },
  { to: "/driver/settings", label: "Account Settings", icon: Settings },
];

const bookingRequests = [
  { name: "Ama Osei", rating: 4.9, type: "Executive", fare: "GH₵ 120.00", fareLabel: "BOOKING FARE", pickup: "2.5 km away", pickupArea: "East Legon", dropoff: "Kotoka International Airport" },
  { name: "Kwame Boateng", rating: 4.7, type: "Standard", fare: "GH₵ 85.50", fareLabel: "EST. FARE", pickup: "4.8 km away", pickupArea: "Madina", dropoff: "Accra Mall" },
];

const DriverDashboard = () => {
  const [accepting, setAccepting] = useState(true);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <Navbar variant="driver" userName="Kofi Mensah" />
      <div className="flex">
        <AppSidebar
          links={sidebarLinks}
          header={
            <div className="glass-card p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <Bus className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-sm">Kofi Mensah</p>
                  <p className="text-xs text-muted-foreground">ID: GH-77421</p>
                </div>
              </div>
              <Badge className="bg-success/20 text-success border-0 text-xs">● VIP TRANSPORT DRIVER</Badge>
            </div>
          }
          footer={
            <div className="text-xs text-muted-foreground">
              <p className="font-semibold text-foreground uppercase tracking-wider mb-2">Today's Summary</p>
              <div className="flex justify-between mb-1"><span>Trips</span><span className="font-bold text-foreground">8 Trips</span></div>
              <div className="flex justify-between"><span>Earned</span><span className="font-bold text-success">GH₵ 420.00</span></div>
            </div>
          }
        />
        <main className="flex-1 p-6 space-y-6">
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            {/* Duty Status */}
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-bold font-heading">Duty Status</h1>
                  <Badge className="bg-success/20 text-success border-0">ONLINE</Badge>
                </div>
                <p className="text-xs uppercase tracking-wider text-primary mt-1">VIP SERVICE • ACCRA</p>
                <Button className="gradient-primary mt-3" onClick={() => navigate("/driver/create-trip")}>
                  <Plus className="mr-2 h-4 w-4" /> Create New Trip
                </Button>
              </div>
            </div>

            <div className="glass-card p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold">Accepting Passengers</p>
                  <p className="text-sm text-muted-foreground">Active in Accra-Kumasi corridor</p>
                </div>
                <Switch checked={accepting} onCheckedChange={setAccepting} />
              </div>
            </div>

            {/* Booking Requests */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-bold font-heading">Booking Requests</h2>
                <Badge className="gradient-primary text-primary-foreground">{bookingRequests.length}</Badge>
              </div>
              <span className="text-primary text-sm cursor-pointer hover:underline">Regions</span>
            </div>

            {bookingRequests.map((b, i) => (
              <div key={i} className="glass-card p-5 glow-primary">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-secondary flex items-center justify-center">
                      <Bus className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-bold">{b.name}</p>
                      <p className="text-sm text-muted-foreground">
                        <Star className="inline h-3 w-3 text-warning mr-1" /> {b.rating} • {b.type}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-success">{b.fare}</p>
                    <p className="text-xs text-muted-foreground uppercase">{b.fareLabel}</p>
                  </div>
                </div>
                <div className="space-y-2 mb-4">
                  <p className="text-sm flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-primary" />
                    Pickup: <span className="font-bold">{b.pickup}</span> ({b.pickupArea})
                  </p>
                  <p className="text-sm flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-destructive" />
                    Dropoff: {b.dropoff}
                  </p>
                </div>
                <div className="flex gap-3">
                  <Button className="flex-1 gradient-success font-semibold">Accept Booking</Button>
                  <Button variant="outline" size="icon"><Phone className="h-4 w-4" /></Button>
                </div>
              </div>
            ))}
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default DriverDashboard;
