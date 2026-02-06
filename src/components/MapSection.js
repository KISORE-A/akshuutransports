import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Custom marker icon for current user
const userIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

export default function MapSection() {
  const [userLocation, setUserLocation] = useState(null);
  const [buses, setBuses] = useState([
    {
      id: 1,
      name: "Bus TN-23-AB-1234",
      lat: null,
      lng: null,
      status: "Running",
    },
    {
      id: 2,
      name: "Bus TN-23-AB-5678",
      lat: null,
      lng: null,
      status: "Running",
    },
    {
      id: 3,
      name: "Bus TN-23-AB-9012",
      lat: null,
      lng: null,
      status: "Stopped",
    },
  ]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get user's real location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });
          
          // Initialize buses around user location with small offsets
          setBuses((prev) =>
            prev.map((bus, idx) => ({
              ...bus,
              lat: latitude + (Math.random() - 0.5) * 0.05,
              lng: longitude + (Math.random() - 0.5) * 0.05,
            }))
          );
          setLoading(false);
        },
        (error) => {
          console.warn("Geolocation error:", error);
          // Fallback to default location if geolocation fails
          const defaultLat = 13.0827;
          const defaultLng = 80.2707;
          setUserLocation({ lat: defaultLat, lng: defaultLng });
          setBuses((prev) =>
            prev.map((bus, idx) => ({
              ...bus,
              lat: defaultLat + (Math.random() - 0.5) * 0.05,
              lng: defaultLng + (Math.random() - 0.5) * 0.05,
            }))
          );
          setLoading(false);
        }
      );
    }

    // Simulate bus movement - in production, connect to real GPS API
    const interval = setInterval(() => {
      setBuses((prev) =>
        prev.map((bus) => ({
          ...bus,
          lat: bus.lat + (Math.random() - 0.5) * 0.001,
          lng: bus.lng + (Math.random() - 0.5) * 0.001,
        }))
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="card">
        <h3>🗺️ Live Bus Location</h3>
        <div style={{ height: "350px", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <p>📍 Loading real location...</p>
        </div>
      </div>
    );
  }

  const centerLat = userLocation?.lat || 13.0827;
  const centerLng = userLocation?.lng || 80.2707;

  const validBuses = buses.filter((b) => b.lat && b.lng);

  return (
    <div className="card">
      <h3>🗺️ Live Bus Location</h3>
      <div style={{ height: "350px", borderRadius: "8px", overflow: "hidden" }}>
        {validBuses.length > 0 ? (
          <MapContainer
            center={[centerLat, centerLng]}
            zoom={14}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; OpenStreetMap contributors'
            />
            
            {/* User Location */}
            {userLocation && (
              <>
                <Marker position={[userLocation.lat, userLocation.lng]} icon={userIcon}>
                  <Popup>
                    <div>
                      <strong>📍 Your Location</strong>
                      <p>Lat: {userLocation.lat.toFixed(4)}</p>
                      <p>Lng: {userLocation.lng.toFixed(4)}</p>
                    </div>
                  </Popup>
                </Marker>
                <Circle
                  center={[userLocation.lat, userLocation.lng]}
                  radius={500}
                  fillColor="blue"
                  color="blue"
                  fillOpacity={0.1}
                />
              </>
            )}

            {/* Bus Markers */}
            {validBuses.map((bus) => (
              <Marker key={bus.id} position={[bus.lat, bus.lng]}>
                <Popup>
                  <div>
                    <strong>{bus.name}</strong>
                    <p>Status: {bus.status}</p>
                    <p>Lat: {bus.lat.toFixed(4)}</p>
                    <p>Lng: {bus.lng.toFixed(4)}</p>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        ) : (
          <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <p>🔄 Initializing map...</p>
          </div>
        )}
      </div>
      <small style={{ color: "#666", marginTop: "8px", display: "block" }}>
        🔵 Blue marker = Your location | 🔴 Red markers = Bus locations
      </small>
    </div>
  );
}
