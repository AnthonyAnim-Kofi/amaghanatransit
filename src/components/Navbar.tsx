import { Link, useLocation } from "react-router-dom";
import { Bell, Bus, Search, User } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NavbarProps {
  variant: "passenger" | "driver" | "landing";
  userName?: string;
}

const passengerLinks = [
  { to: "/passenger/dashboard", label: "Dashboard" },
  { to: "/passenger/book", label: "Book Trip" },
  { to: "/passenger/bookings", label: "My Bookings" },
  { to: "/passenger/history", label: "Trip History" },
  { to: "/passenger/wallet", label: "Wallet" },
];

const driverLinks = [
  { to: "/driver/dashboard", label: "Dashboard" },
  { to: "/driver/earnings", label: "Earnings" },
  { to: "/driver/routes", label: "Routes" },
  { to: "/driver/maintenance", label: "Vehicle Log" },
  { to: "/driver/settings", label: "Settings" },
];

const Navbar = ({ variant, userName = "User" }: NavbarProps) => {
  const location = useLocation();
  const links = variant === "passenger" ? passengerLinks : variant === "driver" ? driverLinks : [];

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-sm">
      <div className="flex h-16 items-center justify-between px-6">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2">
            <Bus className="h-7 w-7 text-primary" />
            <span className="text-lg font-bold font-heading">Transport Ghana</span>
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
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 rounded-lg bg-secondary px-3 py-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <input
                placeholder="Search trips..."
                className="bg-transparent text-sm outline-none w-40 placeholder:text-muted-foreground"
              />
            </div>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-primary" />
            </Button>
            <div className="flex items-center gap-2">
              <span className="hidden md:block text-sm font-medium">{userName}</span>
              <div className="h-9 w-9 rounded-full bg-primary/20 flex items-center justify-center">
                <User className="h-5 w-5 text-primary" />
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
