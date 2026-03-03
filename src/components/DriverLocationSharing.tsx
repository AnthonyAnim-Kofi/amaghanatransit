import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Navigation, MapPin, Wifi, WifiOff } from "lucide-react";
import { toast } from "sonner";

interface DriverLocationSharingProps {
  tripId: string;
}

const DriverLocationSharing = ({ tripId }: DriverLocationSharingProps) => {
  const { user } = useAuth();
  const [sharing, setSharing] = useState(false);
  const [lastPosition, setLastPosition] = useState<{ lat: number; lng: number; speed: number | null } | null>(null);
  const watchIdRef = useRef<number | null>(null);

  const startSharing = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      return;
    }

    setSharing(true);
    toast.success("Location sharing started");

    watchIdRef.current = navigator.geolocation.watchPosition(
      async (position) => {
        const { latitude, longitude, speed, heading } = position.coords;
        setLastPosition({ lat: latitude, lng: longitude, speed: speed ? Math.round(speed * 3.6) : null });

        await supabase.from("trip_locations").insert({
          trip_id: tripId,
          driver_id: user!.id,
          latitude,
          longitude,
          speed: speed ? Math.round(speed * 3.6) : null,
          heading: heading || null,
        });
      },
      (error) => {
        toast.error("Location error: " + error.message);
      },
      { enableHighAccuracy: true, maximumAge: 5000, timeout: 10000 }
    );
  };

  const stopSharing = () => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    setSharing(false);
    toast.info("Location sharing stopped");
  };

  useEffect(() => {
    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, []);

  return (
    <div className="glass-card p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold uppercase tracking-wider flex items-center gap-2">
          <Navigation className="h-4 w-4 text-primary" /> Live Location
        </h3>
        <Badge className={sharing ? "bg-success/20 text-success border-0" : "bg-muted text-muted-foreground border-0"}>
          {sharing ? <><Wifi className="h-3 w-3 mr-1" /> SHARING</> : <><WifiOff className="h-3 w-3 mr-1" /> OFF</>}
        </Badge>
      </div>

      {lastPosition && sharing && (
        <div className="text-xs text-muted-foreground space-y-1">
          <p>Lat: <span className="font-mono text-foreground">{lastPosition.lat.toFixed(6)}</span></p>
          <p>Lng: <span className="font-mono text-foreground">{lastPosition.lng.toFixed(6)}</span></p>
          {lastPosition.speed !== null && (
            <p>Speed: <span className="font-bold text-foreground">{lastPosition.speed} km/h</span></p>
          )}
        </div>
      )}

      <Button
        className={sharing ? "w-full" : "w-full gradient-primary"}
        variant={sharing ? "destructive" : "default"}
        size="sm"
        onClick={sharing ? stopSharing : startSharing}
      >
        {sharing ? "Stop Sharing" : "Start Location Sharing"}
      </Button>
    </div>
  );
};

export default DriverLocationSharing;
