import { Link, useLocation, useNavigate } from "react-router-dom";
import { Bus, Search, User, Menu, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import NotificationDropdown from "@/components/NotificationDropdown";
import ThemeToggle from "@/components/ThemeToggle";

interface NavbarProps {
  variant: "passenger" | "driver" | "landing";
  userName?: string;
}

const passengerLinks = [
  { to: "/passenger/dashboard", label: "Dashboard" },
  { to: "/passenger/search", label: "Find Trips" },
  { to: "/passenger/bookings", label: "My Bookings" },
  { to: "/passenger/history", label: "Trip History" },
  { to: "/passenger/wallet", label: "Wallet" },
];

const driverLinks = [
  { to: "/driver/dashboard", label: "Dashboard" },
  { to: "/driver/vehicles", label: "Vehicles" },
  { to: "/driver/earnings", label: "Earnings" },
  { to: "/driver/routes", label: "Routes" },
  { to: "/driver/maintenance", label: "Maintenance" },
  { to: "/driver/settings", label: "Settings" },
];

const Navbar = ({ variant, userName }: NavbarProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { profile, signOut } = useAuth();
  const [open, setOpen] = useState(false);
  const links = variant === "passenger" ? passengerLinks : variant === "driver" ? driverLinks : [];
  const displayName = userName || profile?.full_name || "User";

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-sm">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-4 md:gap-8">
          {variant !== "landing" && (
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72 bg-card border-border p-0">
                <div className="p-6 border-b border-border">
                  <div className="flex items-center gap-2 mb-4">
                    <Bus className="h-6 w-6 text-primary" />
                    <span className="text-lg font-bold font-heading">AMA Ghana Transit</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{displayName}</p>
                      <p className="text-xs text-muted-foreground capitalize">{profile?.role || variant}</p>
                    </div>
                  </div>
                </div>
                <nav className="p-4 space-y-1">
                  {links.map((link) => (
                    <Link
                      key={link.to}
                      to={link.to}
                      onClick={() => setOpen(false)}
                      className={`block px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                        location.pathname === link.to
                          ? "gradient-primary text-primary-foreground"
                          : "text-muted-foreground hover:text-foreground hover:bg-accent"
                      }`}
                    >
                      {link.label}
                    </Link>
                  ))}
                </nav>
                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border">
                  <Button
                    variant="outline"
                    className="w-full border-destructive/30 text-destructive hover:bg-destructive/10"
                    onClick={() => { setOpen(false); handleSignOut(); }}
                  >
                    <LogOut className="mr-2 h-4 w-4" /> Sign Out
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          )}

          <Link to="/" className="flex items-center gap-2">
            <Bus className="h-7 w-7 text-primary" />
            <span className="text-lg font-bold font-heading hidden sm:block">AMA Ghana Transit</span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  location.pathname === link.to
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        {variant !== "landing" && (
          <div className="flex items-center gap-2 md:gap-3">
            <ThemeToggle />
            <NotificationDropdown />
            <div className="hidden md:flex items-center gap-2">
              <span className="text-sm font-medium">{displayName}</span>
            </div>
            <div className="h-9 w-9 rounded-full bg-primary/20 flex items-center justify-center">
              <User className="h-5 w-5 text-primary" />
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleSignOut}
              className="hidden md:flex text-muted-foreground hover:text-destructive"
              title="Sign out"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        )}

        {variant === "landing" && (
          <div className="flex items-center gap-2">
            <ThemeToggle />
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
