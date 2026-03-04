import { Link, useNavigate } from "react-router-dom";
import { Bus, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";
import passengerImg from "@/assets/passenger-hero.jpg";
import driverImg from "@/assets/driver-hero.jpg";

const Landing = () => {
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();

  // Redirect authenticated users to their dashboard
  useEffect(() => {
    if (!loading && user && profile) {
      navigate(profile.role === "driver" ? "/driver/dashboard" : "/passenger/dashboard");
    }
  }, [user, profile, loading, navigate]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <nav className="flex items-center justify-between px-4 md:px-6 py-4 border-b border-border">
        <div className="flex items-center gap-2">
          <Bus className="h-7 w-7 text-primary" />
          <span className="text-lg font-bold font-heading">AMA Ghana Transit</span>
        </div>
        <div className="flex items-center gap-2 md:gap-3">
          <Link to="/auth">
            <Button variant="outline" size="sm">Sign In</Button>
          </Link>
          <Link to="/auth">
            <Button className="gradient-primary" size="sm">Get Started</Button>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <main className="max-w-5xl mx-auto px-4 md:px-6 py-10 md:py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10 md:mb-16"
        >
          <h1 className="text-3xl md:text-5xl font-bold font-heading mb-4">
            Welcome to the Platform
          </h1>
          <p className="text-base md:text-lg text-muted-foreground max-w-xl mx-auto">
            Your reliable partner for commuting and earning. Choose how you want to use the platform today.
          </p>
        </motion.div>

        {/* Role Cards */}
        <div className="grid md:grid-cols-2 gap-6 md:gap-8 mb-10 md:mb-16">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="glass-card overflow-hidden group"
          >
            <div className="h-48 md:h-56 overflow-hidden">
              <img src={passengerImg} alt="Passenger view" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            </div>
            <div className="p-5 md:p-6">
              <div className="flex items-center gap-2 mb-3">
                <MapPin className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-bold font-heading text-primary">Passenger</h2>
              </div>
              <p className="text-muted-foreground text-sm mb-6">
                Book a ride in seconds and reach your destination safely. Access affordable rides, real-time tracking, and 24/7 support.
              </p>
              <Link to="/auth">
                <Button className="w-full gradient-primary font-semibold">
                  Sign Up as Passenger
                </Button>
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="glass-card overflow-hidden group"
          >
            <div className="h-48 md:h-56 overflow-hidden">
              <img src={driverImg} alt="Driver view" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            </div>
            <div className="p-5 md:p-6">
              <div className="flex items-center gap-2 mb-3">
                <Bus className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-bold font-heading text-primary">Driver</h2>
              </div>
              <p className="text-muted-foreground text-sm mb-6">
                Join our fleet, set your own schedule, and increase your earnings. Drive when you want and earn what you need.
              </p>
              <Link to="/auth">
                <Button className="w-full gradient-primary font-semibold">
                  Sign Up as Driver
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Footer Links */}
        <div className="text-center space-y-3">
          <p className="text-muted-foreground text-sm">Already have an account?</p>
          <Link to="/auth" className="text-primary hover:underline text-sm font-medium">
            Sign in here
          </Link>
        </div>
      </main>

      <footer className="border-t border-border py-6 px-4 md:px-6">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <span>© 2026 AMA Ghana Transit</span>
          <div className="flex gap-6">
            <span className="hover:text-foreground cursor-pointer">About Us</span>
            <span className="hover:text-foreground cursor-pointer">Terms of Service</span>
            <span className="hover:text-foreground cursor-pointer">Help Center</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
