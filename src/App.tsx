import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Landing from "./pages/Landing";
import Auth from "./pages/Auth";
import ResetPassword from "./pages/ResetPassword";
import PassengerDashboard from "./pages/passenger/Dashboard";
import TripHistory from "./pages/passenger/TripHistory";
import ActiveBookings from "./pages/passenger/Bookings";
import WalletPage from "./pages/passenger/Wallet";
import TrackTrip from "./pages/passenger/TrackTrip";
import DriverDashboard from "./pages/driver/Dashboard";
import DriverEarnings from "./pages/driver/Earnings";
import DriverRoutes from "./pages/driver/Routes";
import CreateTrip from "./pages/driver/CreateTrip";
import SearchTrips from "./pages/passenger/SearchTrips";
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
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            {/* Passenger Routes */}
            <Route path="/passenger/dashboard" element={<ProtectedRoute requiredRole="passenger"><PassengerDashboard /></ProtectedRoute>} />
            <Route path="/passenger/book" element={<ProtectedRoute requiredRole="passenger"><PassengerDashboard /></ProtectedRoute>} />
            <Route path="/passenger/history" element={<ProtectedRoute requiredRole="passenger"><TripHistory /></ProtectedRoute>} />
            <Route path="/passenger/bookings" element={<ProtectedRoute requiredRole="passenger"><ActiveBookings /></ProtectedRoute>} />
            <Route path="/passenger/wallet" element={<ProtectedRoute requiredRole="passenger"><WalletPage /></ProtectedRoute>} />
            <Route path="/passenger/track" element={<ProtectedRoute requiredRole="passenger"><TrackTrip /></ProtectedRoute>} />
            <Route path="/passenger/search" element={<ProtectedRoute requiredRole="passenger"><SearchTrips /></ProtectedRoute>} />
            {/* Driver Routes */}
            <Route path="/driver/dashboard" element={<ProtectedRoute requiredRole="driver"><DriverDashboard /></ProtectedRoute>} />
            <Route path="/driver/create-trip" element={<ProtectedRoute requiredRole="driver"><CreateTrip /></ProtectedRoute>} />
            <Route path="/driver/earnings" element={<ProtectedRoute requiredRole="driver"><DriverEarnings /></ProtectedRoute>} />
            <Route path="/driver/routes" element={<ProtectedRoute requiredRole="driver"><DriverRoutes /></ProtectedRoute>} />
            <Route path="/driver/maintenance" element={<ProtectedRoute requiredRole="driver"><VehicleMaintenance /></ProtectedRoute>} />
            <Route path="/driver/settings" element={<ProtectedRoute requiredRole="driver"><DriverSettings /></ProtectedRoute>} />
            <Route path="/driver/settings/*" element={<ProtectedRoute requiredRole="driver"><DriverSettings /></ProtectedRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
