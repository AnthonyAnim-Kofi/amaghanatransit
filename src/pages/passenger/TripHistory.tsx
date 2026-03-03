import Navbar from "@/components/Navbar";
import StatCard from "@/components/StatCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bus, Download, Search, Filter, Calendar } from "lucide-react";
import { motion } from "framer-motion";

const trips = [
  { date: "Oct 12, 2023", time: "08:30 AM", service: "Inter-City STC", badge: "STC", badgeColor: "bg-red-600", route: "Accra → Kumasi", fare: "GH₵ 120.00", status: "Completed" },
  { date: "Oct 10, 2023", time: "02:15 PM", service: "VIP Jeoun", badge: "VIP", badgeColor: "bg-purple-600", route: "Tema → Cape Coast", fare: "GH₵ 85.00", status: "Cancelled" },
  { date: "Oct 08, 2023", time: "11:00 AM", service: "Private Taxi", badge: "CAB", badgeColor: "bg-yellow-600", route: "Kotoka Int. → East Legon", fare: "GH₵ 45.00", status: "Completed" },
  { date: "Oct 05, 2023", time: "06:00 AM", service: "Inter-City STC", badge: "STC", badgeColor: "bg-red-600", route: "Accra → Tamale", fare: "GH₵ 210.00", status: "Completed" },
];

const TripHistory = () => (
  <div className="min-h-screen bg-background">
    <Navbar variant="passenger" userName="Kwesi Mensah" />
    <main className="max-w-6xl mx-auto p-6">
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold font-heading">Trip History</h1>
            <p className="text-muted-foreground mt-1">Keep track of your journeys across STC, VIP, and private ride services.</p>
          </div>
          <Button className="gradient-primary">
            <Bus className="mr-2 h-4 w-4" /> Book New Trip
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <StatCard label="Total Trips" value="42" icon={<Bus className="h-5 w-5" />} />
          <StatCard label="Total Spent" value="GH₵ 3,450.00" icon={<Bus className="h-5 w-5" />} />
          <StatCard label="Loyalty Points" value="840 pts" icon={<span className="text-warning">★</span>} />
        </div>

        {/* Search & Filter */}
        <div className="glass-card p-4 mb-6 flex flex-col md:flex-row gap-3">
          <div className="flex-1 flex items-center gap-2 bg-secondary rounded-lg px-3 py-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input placeholder="Search destination, service (STC, VIP), or trip ID..." className="bg-transparent text-sm outline-none flex-1 placeholder:text-muted-foreground" />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">Status: All</Button>
            <Button variant="outline" size="sm"><Calendar className="mr-1 h-4 w-4" /> Last 30 Days</Button>
            <Button variant="outline" size="icon"><Filter className="h-4 w-4" /></Button>
          </div>
        </div>

        {/* Table */}
        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border text-xs uppercase tracking-wider text-muted-foreground">
                  <th className="text-left p-4">Date & Time</th>
                  <th className="text-left p-4">Service</th>
                  <th className="text-left p-4">Route</th>
                  <th className="text-right p-4">Fare</th>
                  <th className="text-center p-4">Status</th>
                  <th className="text-right p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {trips.map((trip, i) => (
                  <tr key={i} className="border-b border-border/50 hover:bg-accent/50 transition-colors">
                    <td className="p-4">
                      <p className="font-semibold text-sm">{trip.date}</p>
                      <p className="text-xs text-muted-foreground">{trip.time}</p>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-bold px-2 py-1 rounded ${trip.badgeColor} text-primary-foreground`}>{trip.badge}</span>
                        <span className="text-sm">{trip.service}</span>
                      </div>
                    </td>
                    <td className="p-4 text-sm">{trip.route}</td>
                    <td className="p-4 text-right font-bold text-sm">{trip.fare}</td>
                    <td className="p-4 text-center">
                      <Badge variant={trip.status === "Completed" ? "default" : "destructive"} className={trip.status === "Completed" ? "bg-success/20 text-success border-0" : ""}>
                        • {trip.status}
                      </Badge>
                    </td>
                    <td className="p-4 text-right">
                      <span className="text-primary text-sm cursor-pointer hover:underline">📄 Receipt</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-4 flex items-center justify-between text-sm text-muted-foreground border-t border-border">
            <span>Showing 1 to 4 of 42 trips</span>
            <div className="flex gap-1">
              <Button variant="outline" size="sm" disabled>‹</Button>
              <Button size="sm" className="gradient-primary">1</Button>
              <Button variant="outline" size="sm">2</Button>
              <Button variant="outline" size="sm">3</Button>
              <Button variant="outline" size="sm">›</Button>
            </div>
          </div>
        </div>

        <div className="text-right mt-4">
          <Button variant="ghost" className="text-muted-foreground">
            <Download className="mr-2 h-4 w-4" /> Export history as CSV
          </Button>
        </div>
      </motion.div>
    </main>
  </div>
);

export default TripHistory;
