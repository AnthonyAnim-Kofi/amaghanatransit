import Navbar from "@/components/Navbar";
import StatCard from "@/components/StatCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DollarSign, Calendar, Bus, Download, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import { Area, AreaChart, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";

const chartData = [
  { day: "Mon", earnings: 120 }, { day: "Tue", earnings: 180 }, { day: "Wed", earnings: 90 },
  { day: "Thu", earnings: 210 }, { day: "Fri", earnings: 250 }, { day: "Sat", earnings: 320 }, { day: "Sun", earnings: 280 },
];

const payouts = [
  { date: "Jan 21, 2024", time: "04:30 PM", id: "TXN-98234-GH", provider: "MTN MoMo", amount: "GH₵ 450.00", status: "Completed" },
  { date: "Jan 19, 2024", time: "11:15 AM", id: "TXN-98122-GH", provider: "Telecel Cash", amount: "GH₵ 320.00", status: "Completed" },
  { date: "Jan 18, 2024", time: "09:45 PM", id: "TXN-97994-GH", provider: "MTN MoMo", amount: "GH₵ 1,200.00", status: "Processing" },
];

const DriverEarnings = () => (
  <div className="min-h-screen bg-background">
    <Navbar variant="driver" userName="Kwame Mensah" />
    <main className="max-w-6xl mx-auto p-6">
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold font-heading">Earnings Overview</h1>
            <p className="text-muted-foreground mt-1">Manage your daily income and instant cashouts to Mobile Money</p>
          </div>
          <Button variant="outline"><Download className="mr-2 h-4 w-4" /> Report</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <StatCard label="Total Balance" value="GH₵ 1,250.00" icon={<DollarSign className="h-5 w-5" />} trend="+15.2% from last week" />
          <StatCard label="Earnings Today" value="GH₵ 180.50" icon={<Calendar className="h-5 w-5" />} trend="+5% vs yesterday" />
          <StatCard label="Completed Trips" value="12" icon={<Bus className="h-5 w-5" />} trend="98% success rate" trendColor="primary" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Chart */}
          <div className="lg:col-span-2 glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold font-heading">Weekly Performance</h3>
                <p className="text-sm text-muted-foreground">Jan 15 - Jan 21, 2024 <span className="text-success ml-2">+12.5%</span></p>
              </div>
              <Button variant="outline" size="sm">This Week</Button>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="earningsGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(211, 100%, 50%)" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="hsl(211, 100%, 50%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: "hsl(215, 15%, 55%)", fontSize: 12 }} />
                <YAxis hide />
                <Tooltip contentStyle={{ background: "hsl(220, 25%, 10%)", border: "1px solid hsl(220, 20%, 18%)", borderRadius: "8px", color: "hsl(210, 40%, 95%)" }} />
                <Area type="monotone" dataKey="earnings" stroke="hsl(211, 100%, 50%)" strokeWidth={2} fill="url(#earningsGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Transfer Funds */}
          <div className="glass-card p-6">
            <h3 className="font-bold font-heading mb-2">Transfer Funds</h3>
            <p className="text-sm text-muted-foreground mb-4">Instantly withdraw earnings to your Mobile Money account.</p>
            <div className="glass-card p-3 mb-4">
              <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Linked Account</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="bg-warning/20 text-warning text-xs font-bold px-2 py-1 rounded">MTN</span>
                  <span className="font-semibold text-sm">054 **** 892</span>
                </div>
                <span className="text-primary text-xs cursor-pointer">Edit</span>
              </div>
            </div>
            <div className="mb-4">
              <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Withdrawal Amount (GH₵)</p>
              <div className="glass-card p-3 flex items-center justify-between">
                <span className="text-lg font-bold">1250</span>
                <span className="text-primary text-xs font-bold cursor-pointer">MAX</span>
              </div>
            </div>
            <Button className="w-full gradient-primary font-semibold">
              <DollarSign className="mr-2 h-4 w-4" /> Cash Out Now
            </Button>
            <p className="text-xs text-muted-foreground text-center mt-2">Processing time: Instant to 5 mins</p>
          </div>
        </div>

        {/* Recent Payouts */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold font-heading">Recent Payouts</h3>
            <span className="text-primary text-sm cursor-pointer hover:underline">View All</span>
          </div>
          <table className="w-full">
            <thead>
              <tr className="border-b border-border text-xs uppercase tracking-wider text-muted-foreground">
                <th className="text-left pb-3">Date & Time</th>
                <th className="text-left pb-3">Transaction ID</th>
                <th className="text-left pb-3">Provider</th>
                <th className="text-right pb-3">Amount</th>
                <th className="text-center pb-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {payouts.map((p, i) => (
                <tr key={i} className="border-b border-border/50">
                  <td className="py-4">
                    <p className="font-semibold text-sm">{p.date}</p>
                    <p className="text-xs text-muted-foreground">{p.time}</p>
                  </td>
                  <td className="py-4 text-sm font-mono text-muted-foreground">{p.id}</td>
                  <td className="py-4">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-bold px-2 py-1 rounded ${p.provider.includes("MTN") ? "bg-warning/20 text-warning" : "bg-destructive/20 text-destructive"}`}>
                        {p.provider.includes("MTN") ? "MTN" : "TLC"}
                      </span>
                      <span className="text-sm">{p.provider}</span>
                    </div>
                  </td>
                  <td className="py-4 text-right font-bold text-sm text-success">{p.amount}</td>
                  <td className="py-4 text-center">
                    <Badge className={p.status === "Completed" ? "bg-success/20 text-success border-0" : "bg-warning/20 text-warning border-0"}>
                      {p.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </main>
  </div>
);

export default DriverEarnings;
