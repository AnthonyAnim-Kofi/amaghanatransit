import { useState } from "react";
import Navbar from "@/components/Navbar";
import AppSidebar from "@/components/AppSidebar";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { User, Car, CreditCard, Settings, Shield, LogOut, Phone, Mail, Pencil } from "lucide-react";
import { motion } from "framer-motion";

const sidebarLinks = [
  { to: "/driver/settings", label: "Personal Info", icon: User },
  { to: "/driver/settings/vehicle", label: "Vehicle Details", icon: Car },
  { to: "/driver/settings/payment", label: "Payment Methods", icon: CreditCard },
  { to: "/driver/settings/preferences", label: "App Preferences", icon: Settings },
  { to: "/driver/settings/security", label: "Security", icon: Shield },
];

const DriverSettings = () => {
  const [pushNotif, setPushNotif] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [autoAccept, setAutoAccept] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Navbar variant="driver" userName="Kwame Mensah" />
      <div className="flex">
        <AppSidebar
          links={sidebarLinks}
          header={
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
                <User className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="font-bold text-sm">Kwame Mensah</p>
                <p className="text-xs text-muted-foreground">Verified Pro Driver</p>
              </div>
            </div>
          }
          footer={
            <Button variant="outline" className="w-full border-destructive/30 text-destructive hover:bg-destructive/10">
              <LogOut className="mr-2 h-4 w-4" /> Logout
            </Button>
          }
        />
        <main className="flex-1 p-6 max-w-3xl">
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
            <div>
              <h1 className="text-3xl font-bold font-heading">Account Settings</h1>
              <p className="text-muted-foreground mt-1">Manage your profile, vehicle, and payout preferences.</p>
            </div>

            {/* Personal Info */}
            <section className="glass-card p-6 space-y-4">
              <h2 className="text-xl font-bold font-heading">Personal Information</h2>
              {[
                { icon: User, label: "Full Name", value: "Kwame Mensah" },
                { icon: Phone, label: "Phone Number", value: "+233 24 555 0123" },
                { icon: Mail, label: "Email Address", value: "kwame.mensah@gmail.com" },
              ].map((f) => (
                <div key={f.label} className="flex items-center justify-between py-3 border-b border-border/50 last:border-0">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-lg bg-secondary flex items-center justify-center">
                      <f.icon className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wider text-muted-foreground">{f.label}</p>
                      <p className="font-semibold text-sm">{f.value}</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm"><Pencil className="mr-1 h-3 w-3" /> Edit</Button>
                </div>
              ))}
            </section>

            {/* Vehicle Details */}
            <section className="glass-card p-6">
              <h2 className="text-xl font-bold font-heading mb-4">Vehicle Details</h2>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="glass-card p-4">
                  <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Vehicle Type</p>
                  <p className="font-semibold">Toyota Vitz (Taxi)</p>
                </div>
                <div className="glass-card p-4">
                  <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Plate Number</p>
                  <p className="font-semibold">GW - 4829 - 22</p>
                </div>
              </div>
              <div className="glass-card p-3 flex items-center justify-between">
                <span className="text-success text-sm flex items-center gap-2">✅ Vehicle Verified</span>
                <span className="text-primary text-sm cursor-pointer hover:underline">View Documents</span>
              </div>
            </section>

            {/* Payment Methods */}
            <section className="glass-card p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold font-heading">Payment Methods</h2>
                <span className="text-primary text-sm cursor-pointer">+ Add New</span>
              </div>
              <div className="space-y-3">
                <div className="glass-card p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="bg-warning/20 text-warning text-xs font-bold px-2 py-1 rounded">MTN</span>
                    <div>
                      <p className="font-semibold text-sm">MTN Mobile Money</p>
                      <p className="text-xs text-muted-foreground">Primary Payout Method • 024 **** 0123</p>
                    </div>
                  </div>
                  <span className="bg-success/20 text-success text-xs font-bold px-2 py-1 rounded">DEFAULT</span>
                </div>
                <div className="glass-card p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="bg-destructive/20 text-destructive text-xs font-bold px-2 py-1 rounded">VODA</span>
                    <div>
                      <p className="font-semibold text-sm">Telecel (Vodafone) Cash</p>
                      <p className="text-xs text-muted-foreground">Secondary • 020 **** 9876</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* App Preferences */}
            <section className="glass-card p-6">
              <h2 className="text-xl font-bold font-heading mb-4">App Preferences</h2>
              <div className="space-y-4">
                {[
                  { label: "Push Notifications", desc: "Receive trip requests and alerts", state: pushNotif, setter: setPushNotif },
                  { label: "Dark Mode", desc: "Enable dark theme for night driving", state: darkMode, setter: setDarkMode },
                  { label: "Auto-Accept Requests", desc: "Automatically accept incoming bookings", state: autoAccept, setter: setAutoAccept },
                ].map((pref) => (
                  <div key={pref.label} className="flex items-center justify-between py-2">
                    <div>
                      <p className="font-semibold text-sm">{pref.label}</p>
                      <p className="text-xs text-muted-foreground">{pref.desc}</p>
                    </div>
                    <Switch checked={pref.state} onCheckedChange={pref.setter} />
                  </div>
                ))}
              </div>
            </section>

            {/* Action Buttons */}
            <div className="flex justify-end gap-4">
              <Button variant="outline">Discard Changes</Button>
              <Button className="gradient-primary font-semibold">Save All Preferences</Button>
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default DriverSettings;
