import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Bus, MapPin, QrCode, Pencil } from "lucide-react";
import { motion } from "framer-motion";

const bookings = [
  {
    status: "BOARDING SOON",
    statusColor: "bg-warning text-warning-foreground",
    ref: "GTC-VIP-0982",
    route: "Accra to Kumasi",
    service: "VIP Jeoun Executive",
    departure: "Today, 08:30 AM",
    seat: "SEAT 24",
    terminal: "Neoplan Station, Circle",
  },
  {
    status: "CONFIRMED",
    statusColor: "bg-success/20 text-success",
    ref: "GTC-STC-1244",
    route: "Accra to Tamale",
    service: "STC Intercity Coach",
    departure: "Oct 26, 06:00 AM",
    seat: "SEAT 04",
    terminal: "Intercity STC, Lampte...",
  },
];

const ActiveBookings = () => (
  <div className="min-h-screen bg-background">
    <Navbar variant="passenger" userName="Kwesi Mensah" />
    <main className="max-w-5xl mx-auto p-6">
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold font-heading mb-2">Active Bookings</h1>
        <p className="text-muted-foreground mb-6">Manage your upcoming journeys and boarding passes.</p>

        <Tabs defaultValue="upcoming" className="mb-8">
          <TabsList className="bg-secondary">
            <TabsTrigger value="upcoming">Upcoming <Badge className="ml-2 bg-primary text-primary-foreground">{bookings.length}</Badge></TabsTrigger>
            <TabsTrigger value="active">Active Trips</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>
          <TabsContent value="upcoming" className="space-y-6 mt-6">
            {bookings.map((b, i) => (
              <div key={i} className="glass-card p-6">
                <div className="flex items-center justify-between mb-4">
                  <Badge className={b.statusColor}>{b.status}</Badge>
                  <span className="text-xs font-mono text-muted-foreground">REF: {b.ref}</span>
                </div>
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold font-heading mb-1">{b.route}</h3>
                    <p className="text-sm text-muted-foreground flex items-center gap-2">
                      <Bus className="h-4 w-4" /> {b.service}
                    </p>
                    <div className="grid grid-cols-3 gap-4 mt-4">
                      <div>
                        <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Departure</p>
                        <p className="font-semibold text-sm">{b.departure}</p>
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Seat Number</p>
                        <p className="font-semibold text-sm text-success">{b.seat}</p>
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Terminal</p>
                        <p className="font-semibold text-sm">{b.terminal}</p>
                      </div>
                    </div>
                    <div className="flex gap-3 mt-6">
                      <Button className="gradient-primary">
                        <QrCode className="mr-2 h-4 w-4" /> View Ticket
                      </Button>
                      <Button variant="outline">
                        <Pencil className="mr-2 h-4 w-4" /> Reschedule
                      </Button>
                      <Button variant="ghost" className="text-destructive">Cancel</Button>
                    </div>
                  </div>
                  <div className="glass-card p-6 flex flex-col items-center justify-center min-w-[180px]">
                    <QrCode className="h-16 w-16 text-muted-foreground mb-2" />
                    <p className="text-xs text-muted-foreground">Scan at Terminal Gate</p>
                    <p className="text-primary text-xs mt-2 cursor-pointer hover:underline">
                      <MapPin className="inline h-3 w-3 mr-1" /> Get Directions
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </TabsContent>
          <TabsContent value="active"><p className="text-muted-foreground p-8 text-center">No active trips right now.</p></TabsContent>
          <TabsContent value="history"><p className="text-muted-foreground p-8 text-center">View your past trips in Trip History.</p></TabsContent>
        </Tabs>

        {/* Promo Banner */}
        <div className="gradient-success rounded-lg p-6 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold font-heading text-success-foreground">Plan your next trip?</h3>
            <p className="text-sm text-success-foreground/80">Secure your seat for the holidays early and get 10% off with GTCConnect.</p>
          </div>
          <Button variant="outline" className="bg-background/20 border-success-foreground/30 text-success-foreground hover:bg-background/30">Book New Trip</Button>
        </div>
      </motion.div>
    </main>
  </div>
);

export default ActiveBookings;
