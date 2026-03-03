import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import PassengerDashboard from "./pages/passenger/Dashboard";
import TripHistory from "./pages/passenger/TripHistory";
import ActiveBookings from "./pages/passenger/Bookings";
import WalletPage from "./pages/passenger/Wallet";
import DriverDashboard from "./pages/driver/Dashboard";
import DriverEarnings from "./pages/driver/Earnings";
import DriverRoutes from "./pages/driver/Routes";
import VehicleMaintenance from "./pages/driver/Maintenance";
import DriverSettings from "./pages/driver/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          {/* Passenger Routes */}
          <Route path="/passenger/dashboard" element={<PassengerDashboard />} />
          <Route path="/passenger/book" element={<PassengerDashboard />} />
          <Route path="/passenger/history" element={<TripHistory />} />
          <Route path="/passenger/bookings" element={<ActiveBookings />} />
          <Route path="/passenger/wallet" element={<WalletPage />} />
          {/* Driver Routes */}
          <Route path="/driver/dashboard" element={<DriverDashboard />} />
          <Route path="/driver/earnings" element={<DriverEarnings />} />
          <Route path="/driver/routes" element={<DriverRoutes />} />
          <Route path="/driver/maintenance" element={<VehicleMaintenance />} />
          <Route path="/driver/settings" element={<DriverSettings />} />
          <Route path="/driver/settings/*" element={<DriverSettings />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
