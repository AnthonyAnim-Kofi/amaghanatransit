import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix default marker icons for Leaflet + bundlers
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

interface MapMarker {
  lat: number;
  lng: number;
  label?: string;
  color?: "blue" | "red" | "green";
}

interface LeafletMapProps {
  center?: [number, number];
  zoom?: number;
  markers?: MapMarker[];
  route?: [number, number][];
  livePosition?: { lat: number; lng: number; speed?: number | null };
  className?: string;
}

const createColorIcon = (color: string) =>
  new L.Icon({
    iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

const LeafletMap = ({
  center = [5.6037, -0.187],  // Accra, Ghana
  zoom = 8,
  markers = [],
  route = [],
  livePosition,
  className = "",
}: LeafletMapProps) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const liveMarkerRef = useRef<L.Marker | null>(null);

  // Initialize map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      zoomControl: false,
    }).setView(center, zoom);

    L.control.zoom({ position: "bottomright" }).addTo(map);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(map);

    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update markers
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear existing markers (except live marker)
    map.eachLayer((layer) => {
      if (layer instanceof L.Marker && layer !== liveMarkerRef.current) {
        map.removeLayer(layer);
      }
    });

    markers.forEach((m) => {
      const icon = m.color ? createColorIcon(m.color) : undefined;
      const marker = L.marker([m.lat, m.lng], { icon }).addTo(map);
      if (m.label) marker.bindPopup(`<strong>${m.label}</strong>`);
    });
  }, [markers]);

  // Update route polyline
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || route.length < 2) return;

    // Remove existing polylines
    map.eachLayer((layer) => {
      if (layer instanceof L.Polyline && !(layer instanceof L.Polygon)) {
        map.removeLayer(layer);
      }
    });

    const polyline = L.polyline(route, {
      color: "hsl(211, 100%, 50%)",
      weight: 4,
      opacity: 0.8,
    }).addTo(map);

    map.fitBounds(polyline.getBounds(), { padding: [40, 40] });
  }, [route]);

  // Update live position
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !livePosition) return;

    const liveIcon = new L.DivIcon({
      className: "live-marker",
      html: `<div style="
        width: 20px; height: 20px;
        background: hsl(211, 100%, 50%);
        border: 3px solid white;
        border-radius: 50%;
        box-shadow: 0 0 10px rgba(0,122,255,0.5);
        animation: pulse 2s infinite;
      "></div>`,
      iconSize: [20, 20],
      iconAnchor: [10, 10],
    });

    if (liveMarkerRef.current) {
      liveMarkerRef.current.setLatLng([livePosition.lat, livePosition.lng]);
    } else {
      liveMarkerRef.current = L.marker([livePosition.lat, livePosition.lng], { icon: liveIcon }).addTo(map);
      liveMarkerRef.current.bindPopup(
        `<strong>Bus Location</strong><br/>Speed: ${livePosition.speed ?? "N/A"} km/h`
      );
    }

    map.panTo([livePosition.lat, livePosition.lng], { animate: true });
  }, [livePosition]);

  return (
    <div ref={mapContainerRef} className={`w-full h-full min-h-[300px] ${className}`} style={{ zIndex: 0 }} />
  );
};

export default LeafletMap;
