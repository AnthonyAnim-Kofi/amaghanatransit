import Navbar from "@/components/Navbar";
import StatCard from "@/components/StatCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Plus, Download, Wrench, Gauge, Droplets, Disc, Settings2 } from "lucide-react";
import { motion } from "framer-motion";

const healthItems = [
  { name: "Engine", status: "OPTIMAL (90%)", color: "text-success", icon: Settings2 },
  { name: "Tires", status: "CHECK TREAD (30%)", color: "text-warning", icon: Gauge },
  { name: "Oil Level", status: "HEALTHY (80%)", color: "text-success", icon: Droplets },
  { name: "Brakes", status: "EXCELLENT (95%)", color: "text-success", icon: Disc },
];

const serviceHistory = [
  { date: "Oct 12, 2023", type: "Brake Pad Replacement", sub: "Front and rear pads", provider: "AutoZone Accra", mileage: "42,150 km", cost: "GH₵ 850.00" },
  { date: "Sep 05, 2023", type: "Full Synthetic Oil Change", sub: "Filter & gasket replacement", provider: "Shell Helix Service", mileage: "38,400 km", cost: "GH₵ 400.00" },
  { date: "Jul 20, 2023", type: "Tire Rotation & Alignment", sub: "4-wheel computer alignment", provider: "Goodyear Kumasi", mileage: "32,200 km", cost: "GH₵ 320.00" },
  { date: "May 15, 2023", type: "Air Conditioning Refill", sub: "Refrigerant recharge", provider: "Central Repairs", mileage: "25,100 km", cost: "GH₵ 250.00" },
];

const VehicleMaintenance = () => (
  <div className="min-h-screen bg-background">
    <Navbar variant="driver" userName="Kwame Mensah" />
    <main className="max-w-6xl mx-auto p-6">
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold font-heading">Bus Maintenance</h1>
            <p className="text-muted-foreground mt-1">Monitor real-time vehicle health and review service records.</p>
          </div>
          <Button className="gradient-primary"><Plus className="mr-2 h-4 w-4" /> Log New Service</Button>
        </div>

        {/* Alert Banner */}
        <div className="glass-card p-4 mb-6 flex items-center gap-3 border-l-4 border-warning">
          <AlertTriangle className="h-6 w-6 text-warning" />
          <div>
            <p className="text-sm font-bold text-warning uppercase">Upcoming Maintenance Reminder</p>
            <p className="text-sm text-muted-foreground">Your vehicle is due for a 50,000km major inspection. Approximately 3 days remaining before recommended date.</p>
          </div>
          <Button variant="outline" size="sm" className="ml-auto">Dismiss</Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <StatCard label="Total Mileage" value="45,200 km" icon={<Gauge className="h-5 w-5" />} trend="+5.2% this month" />
          <StatCard label="Last Service" value="12 Days Ago" icon={<Wrench className="h-5 w-5" />} />
          <StatCard label="Monthly Spend" value="GH₵ 1,250" icon={<Wrench className="h-5 w-5" />} trend="+12% vs last month" trendColor="destructive" />
        </div>

        {/* Vehicle Health */}
        <h2 className="text-xl font-bold font-heading mb-4">Vehicle Health Status</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {healthItems.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.name} className="glass-card p-6 text-center">
                <div className="h-16 w-16 rounded-full bg-secondary flex items-center justify-center mx-auto mb-3">
                  <Icon className="h-8 w-8 text-muted-foreground" />
                </div>
                <p className="font-bold text-sm">{item.name}</p>
                <p className={`text-xs font-semibold ${item.color}`}>{item.status}</p>
              </div>
            );
          })}
        </div>

        {/* Service History */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold font-heading">Service History</h3>
            <span className="text-primary text-sm cursor-pointer hover:underline flex items-center gap-1">
              <Download className="h-4 w-4" /> Export Report
            </span>
          </div>
          <table className="w-full">
            <thead>
              <tr className="border-b border-border text-xs uppercase tracking-wider text-muted-foreground">
                <th className="text-left pb-3">Date</th>
                <th className="text-left pb-3">Service Type</th>
                <th className="text-left pb-3">Provider</th>
                <th className="text-left pb-3">Mileage</th>
                <th className="text-right pb-3">Cost</th>
                <th className="text-center pb-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {serviceHistory.map((s, i) => (
                <tr key={i} className="border-b border-border/50">
                  <td className="py-4 text-sm font-semibold">{s.date}</td>
                  <td className="py-4">
                    <p className="text-sm font-semibold">{s.type}</p>
                    <p className="text-xs text-muted-foreground">{s.sub}</p>
                  </td>
                  <td className="py-4 text-sm text-muted-foreground">{s.provider}</td>
                  <td className="py-4 text-sm">{s.mileage}</td>
                  <td className="py-4 text-right font-bold text-sm text-success">{s.cost}</td>
                  <td className="py-4 text-center">
                    <Badge className="bg-success/20 text-success border-0">COMPLETED</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="text-center text-muted-foreground text-sm mt-4 cursor-pointer hover:text-foreground">View All History (24 Entries)</p>
        </div>
      </motion.div>
    </main>
  </div>
);

export default VehicleMaintenance;
