import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import AppSidebar from "@/components/AppSidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Car, Settings, Shield, LogOut, Phone, Mail, Pencil, LayoutDashboard, DollarSign, MapPin, Bus } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const sidebarLinks = [
  { to: "/driver/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/driver/vehicles", label: "My Vehicles", icon: Bus },
  { to: "/driver/earnings", label: "Earnings", icon: DollarSign },
  { to: "/driver/routes", label: "Routes", icon: MapPin },
  { to: "/driver/settings", label: "Settings", icon: Settings },
];

const DriverSettings = () => {
  const { profile, signOut, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const [fullName, setFullName] = useState(profile?.full_name || "");
  const [phone, setPhone] = useState(profile?.phone || "");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!profile) return;
    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update({ full_name: fullName.trim(), phone: phone.trim() || null })
      .eq("id", profile.id);
    setSaving(false);
    if (error) toast.error(error.message);
    else {
      toast.success("Profile updated!");
      refreshProfile();
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar variant="driver" userName={profile?.full_name || "Driver"} />
      <div className="flex">
        <AppSidebar
          links={sidebarLinks}
          header={
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center">
                <User className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="font-bold text-sm">{profile?.full_name || "Driver"}</p>
                <p className="text-xs text-muted-foreground">Driver Account</p>
              </div>
            </div>
          }
          footer={
            <Button variant="outline" className="w-full border-destructive/30 text-destructive hover:bg-destructive/10" onClick={handleSignOut}>
              <LogOut className="mr-2 h-4 w-4" /> Logout
            </Button>
          }
        />
        <main className="flex-1 p-6 max-w-3xl">
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
            <div>
              <h1 className="text-3xl font-bold font-heading">Account Settings</h1>
              <p className="text-muted-foreground mt-1">Manage your profile information.</p>
            </div>

            <section className="glass-card p-6 space-y-4">
              <h2 className="text-xl font-bold font-heading">Personal Information</h2>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-xs uppercase tracking-wider text-muted-foreground">Full Name</Label>
                  <Input value={fullName} onChange={(e) => setFullName(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs uppercase tracking-wider text-muted-foreground">Email</Label>
                  <Input value={profile?.email || ""} disabled className="opacity-60" />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs uppercase tracking-wider text-muted-foreground">Phone Number</Label>
                  <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+233 24 555 0123" />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <Button className="gradient-primary font-semibold" onClick={handleSave} disabled={saving}>
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </section>
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default DriverSettings;
