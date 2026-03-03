import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Shield, Plus, Trash2, Filter, Download, Wallet as WalletIcon, ArrowUpCircle, ArrowDownCircle } from "lucide-react";
import { motion } from "framer-motion";

const transactions = [
  { service: "VIP - Accra to Kumasi", id: "#44920", date: "Oct 24, 2023", time: "08:45 AM", status: "Success", amount: "- GH₵ 60.00", amountColor: "text-foreground" },
  { service: "Wallet Top Up", id: "via MTN MoMo", date: "Oct 23, 2023", time: "14:20 PM", status: "Success", amount: "+ GH₵ 150.00", amountColor: "text-success" },
  { service: "STC - Kumasi to Tamale", id: "#44812", date: "Oct 21, 2023", time: "06:00 AM", status: "Pending", amount: "- GH₵ 85.00", amountColor: "text-foreground" },
  { service: "VIP - Koforidua to Accra", id: "#44755", date: "Oct 19, 2023", time: "17:30 PM", status: "Success", amount: "- GH₵ 35.00", amountColor: "text-foreground" },
];

const WalletPage = () => (
  <div className="min-h-screen bg-background">
    <Navbar variant="passenger" userName="Kwesi Mensah" />
    <main className="max-w-6xl mx-auto p-6">
      <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
          <span>🏠 Home</span> / <span>Wallet</span>
        </div>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold font-heading">Wallet & MoMo</h1>
            <p className="text-muted-foreground mt-1">Manage your transport funds and mobile money integrations securely.</p>
          </div>
          <Badge variant="outline" className="border-success text-success">🔒 SECURE CONNECTION</Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Balance Card */}
            <div className="gradient-primary rounded-lg p-6">
              <p className="text-xs uppercase tracking-wider text-primary-foreground/70 font-semibold mb-1">Current Balance</p>
              <p className="text-4xl font-bold font-heading text-primary-foreground mb-4">GH₵ 245.50</p>
              <div className="flex gap-3">
                <Button size="sm" variant="outline" className="bg-primary-foreground/10 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/20">
                  <ArrowUpCircle className="mr-1 h-4 w-4" /> Top Up
                </Button>
                <Button size="sm" className="bg-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/30">
                  <ArrowDownCircle className="mr-1 h-4 w-4" /> Withdraw
                </Button>
              </div>
            </div>

            {/* Linked Numbers */}
            <div className="glass-card p-5">
              <h3 className="font-bold font-heading flex items-center gap-2 mb-4">🔗 Linked Numbers</h3>
              <div className="glass-card p-3 flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="bg-warning/20 text-warning text-xs font-bold px-2 py-1 rounded">MTN</span>
                  <div>
                    <p className="font-semibold text-sm">024 123 4567</p>
                    <p className="text-xs text-muted-foreground">Primary Account</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon"><Trash2 className="h-4 w-4 text-muted-foreground" /></Button>
              </div>
              <button className="w-full glass-card p-3 text-sm text-muted-foreground flex items-center justify-center gap-2 hover:text-foreground transition-colors">
                <Plus className="h-4 w-4" /> Link New MoMo Number
              </button>
            </div>

            {/* Top Up Methods */}
            <div className="glass-card p-5">
              <h3 className="font-bold font-heading mb-4">Top up Method</h3>
              <div className="flex gap-3">
                {[
                  { name: "MTN", sub: "MOMO", color: "border-warning" },
                  { name: "VODA", sub: "CASH", color: "border-destructive" },
                  { name: "AT", sub: "MONEY", color: "border-primary" },
                ].map((m) => (
                  <div key={m.name} className={`glass-card p-4 flex-1 text-center border-2 ${m.color} cursor-pointer`}>
                    <p className="font-bold text-sm">{m.name}</p>
                    <p className="text-xs text-muted-foreground">{m.sub}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Transactions */}
          <div className="lg:col-span-2">
            <div className="glass-card p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold font-heading">Transaction History</h3>
                  <p className="text-sm text-muted-foreground">Review your recent payments and top-ups</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm"><Filter className="mr-1 h-4 w-4" /> Filter</Button>
                  <Button variant="outline" size="sm"><Download className="mr-1 h-4 w-4" /> Statement</Button>
                </div>
              </div>

              <table className="w-full">
                <thead>
                  <tr className="border-b border-border text-xs uppercase tracking-wider text-muted-foreground">
                    <th className="text-left pb-3">Service / Details</th>
                    <th className="text-left pb-3">Date & Time</th>
                    <th className="text-center pb-3">Status</th>
                    <th className="text-right pb-3">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((t, i) => (
                    <tr key={i} className="border-b border-border/50">
                      <td className="py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-lg bg-secondary flex items-center justify-center">
                            <WalletIcon className="h-4 w-4 text-muted-foreground" />
                          </div>
                          <div>
                            <p className="font-semibold text-sm">{t.service}</p>
                            <p className="text-xs text-muted-foreground">Ticket ID: {t.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4">
                        <p className="text-sm">{t.date}</p>
                        <p className="text-xs text-muted-foreground">{t.time}</p>
                      </td>
                      <td className="py-4 text-center">
                        <Badge variant={t.status === "Success" ? "default" : "outline"} className={t.status === "Success" ? "bg-success/20 text-success border-0" : "text-warning border-warning"}>
                          {t.status}
                        </Badge>
                      </td>
                      <td className={`py-4 text-right font-bold text-sm ${t.amountColor}`}>{t.amount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="text-center text-primary text-sm mt-4 cursor-pointer hover:underline">View All Transactions</p>
            </div>
          </div>
        </div>

        {/* Security Banner */}
        <div className="glass-card p-6 mt-8 flex items-center gap-4">
          <div className="h-14 w-14 rounded-full bg-primary/20 flex items-center justify-center">
            <Shield className="h-7 w-7 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold font-heading">Your security is our priority</h3>
            <p className="text-sm text-muted-foreground">All mobile money transactions are encrypted and processed through official telecommunication gateways. We never store your MoMo PIN.</p>
          </div>
        </div>
      </motion.div>
    </main>
  </div>
);

export default WalletPage;
