import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, CircleMarker } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./MapSection.css"; // We will create this for animations

// Fix default Leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Destination Icon (College)
const destinationIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/1959/1959420.png", // Graduation cap or school
  iconSize: [35, 35],
  popupAnchor: [0, -15],
});

// Realistic Bus Icon
const createBusIcon = (color) => new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/3448/3448339.png", // Bus Icon
  iconSize: [35, 35],
  iconAnchor: [17, 17],
  popupAnchor: [0, -15],
  className: "bus-marker-icon" // Allow CSS rotation if needed
});

// Default locations
const defaultLocation = { lat: 11.5427, lng: 77.2663 }; // Sathyamangalam
const BIT = [11.5196, 77.3408]; // Accurate BIT Coordinates

// Routes
const busRoutes = [
  {
    id: 1,
    name: "Bus No. 12 (Sathy)",
    color: "#e53e3e", // Red
    route: [
      [11.5427, 77.2663],
      [11.5405, 77.2710],
      [11.5380, 77.2780],
      [11.5345, 77.2860],
      [11.5310, 77.2940],
      [11.5290, 77.3020],
      [11.5275, 77.3110],
      [11.5260, 77.3200],
      [11.5240, 77.3300],
      [11.5220, 77.3350],
      BIT,
    ],
  },
  {
    id: 2,
    name: "Bus No. 05 (CBE)",
    color: "#3182ce", // Blue
    route: [
      [11.4500, 77.2500], // Started closer for demo
      [11.4600, 77.2600],
      [11.4800, 77.2800],
      [11.5000, 77.3000],
      [11.5100, 77.3200],
      BIT,
    ],
  },
];

export default function MapSection() {
  const [userLocation, setUserLocation] = useState(null);
  const [buses, setBuses] = useState([]);
  const [signals, setSignals] = useState([
    { id: 1, lat: 11.5300, lng: 77.3000, status: "RED", timer: 30 },
    { id: 2, lat: 11.5000, lng: 77.3300, status: "GREEN", timer: 45 },
    { id: 3, lat: 11.4800, lng: 77.2900, status: "RED", timer: 15 },
  ]);

  // Traffic Signal Logic
  useEffect(() => {
    const interval = setInterval(() => {
      setSignals(prev => prev.map(sig => {
        if (sig.timer > 0) return { ...sig, timer: sig.timer - 1 };
        // Switch status
        return {
          ...sig,
          status: sig.status === "RED" ? "GREEN" : "RED",
          timer: sig.status === "RED" ? 60 : 30 // Green lasts 60s, Red 30s
        };
      }));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Initialize buses with random starting positions
  useEffect(() => {
    const initialBuses = busRoutes.map((bus) => ({
      ...bus,
      lat: bus.route[0][0],
      lng: bus.route[0][1],
      currentIndex: 0,
      nextStopIndex: 1,
      speed: Math.floor(Math.random() * 20) + 40, // Random speed 40-60 km/h
      status: "Moving",
      progress: 0, // 0 to 1 between points
    }));
    setBuses(initialBuses);
  }, []);

  // Get User Location
  useEffect(() => {
    if (navigator.geolocation) {
      const id = navigator.geolocation.watchPosition(
        (pos) => setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => setUserLocation(defaultLocation),
        { enableHighAccuracy: true }
      );
      return () => navigator.geolocation.clearWatch(id);
    } else {
      setUserLocation(defaultLocation);
    }
  }, []);

  // Realistic Simulation Loop
  useEffect(() => {
    const interval = setInterval(() => {
      setBuses((prevBuses) =>
        prevBuses.map((bus) => {
          if (bus.status === "Arrived") return bus;

          const currentPoint = bus.route[bus.currentIndex];
          const nextPoint = bus.route[bus.nextStopIndex];

          if (!nextPoint) {
            return { ...bus, status: "Arrived", speed: 0 };
          }

          // Check for nearby RED signals
          const nearbySignal = signals.find(sig =>
            sig.status === "RED" &&
            Math.abs(sig.lat - bus.lat) < 0.002 &&
            Math.abs(sig.lng - bus.lng) < 0.002
          );

          if (nearbySignal) {
            return { ...bus, speed: 0, status: `Stopped at Signal (${nearbySignal.timer}s)` };
          }

          // Move interpolated progress
          let newProgress = bus.progress + 0.02; // Speed factor

          if (newProgress >= 1) {
            // Reached next point
            const nextIdx = bus.nextStopIndex + 1;
            if (nextIdx >= bus.route.length) {
              return { ...bus, lat: nextPoint[0], lng: nextPoint[1], status: "Arrived", speed: 0 };
            }
            return {
              ...bus,
              currentIndex: bus.nextStopIndex,
              nextStopIndex: nextIdx,
              progress: 0,
              lat: nextPoint[0],
              lng: nextPoint[1],
              speed: Math.floor(Math.random() * 10) + 45, // Fluctuating speed
              status: "Moving"
            };
          }

          // Interpolate position
          const lat = currentPoint[0] + (nextPoint[0] - currentPoint[0]) * newProgress;
          const lng = currentPoint[1] + (nextPoint[1] - currentPoint[1]) * newProgress;

          return { ...bus, lat, lng, progress: newProgress, status: "Moving", speed: Math.floor(Math.random() * 10) + 40 };
        })
      );
    }, 100); // 100ms update rate

    return () => clearInterval(interval);
  }, [signals]); // Add signals dependency to react to changes

  if (!userLocation || buses.length === 0) return <div className="loading-map">Loading Live Map...</div>;

  return (
    <div className="card map-card">
      <div className="map-header">
        <h3>📍 Live Fleet Tracking</h3>
        <div className="live-indicator">
          <span className="pulse-dot"></span> LIVE
        </div>
      </div>

      <div className="map-container-wrapper">
        <MapContainer
          center={[userLocation.lat, userLocation.lng]}
          zoom={12}
          scrollWheelZoom={false}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            url="https://mt1.google.com/vt/lyrs=m,traffic&x={x}&y={y}&z={z}"
            attribution="&copy; Google Maps"
          />

          {/* User Location Pulse */}
          <CircleMarker
            center={[userLocation.lat, userLocation.lng]}
            radius={8}
            pathOptions={{ color: 'white', fillColor: '#4299e1', fillOpacity: 1 }}
          >
            <Popup>You are here</Popup>
          </CircleMarker>
          <CircleMarker
            center={[userLocation.lat, userLocation.lng]}
            radius={20}
            pathOptions={{ color: '#4299e1', fillColor: '#4299e1', fillOpacity: 0.2, stroke: false }}
            className="pulse-circle"
          />

          {/* Bus Routes */}
          {busRoutes.map((bus) => (
            <Polyline
              key={`route-${bus.id}`}
              positions={bus.route}
              pathOptions={{ color: bus.color, weight: 4, opacity: 0.6, dashArray: '10, 10' }}
            />
          ))}

          {/* Destination */}
          <Marker position={BIT} icon={destinationIcon}>
            <Popup className="custom-popup">
              <strong>🎓 BIT College</strong><br />
              Destination
            </Popup>
          </Marker>

          {/* Traffic Signals */}
          {signals.map(sig => (
            <CircleMarker
              key={`sig-${sig.id}`}
              center={[sig.lat, sig.lng]}
              radius={10}
              pathOptions={{
                color: 'white',
                fillColor: sig.status === 'RED' ? '#e53e3e' : '#48bb78',
                fillOpacity: 1,
                weight: 2
              }}
            >
              <Popup>
                <strong>🚦 Traffic Signal</strong><br />
                Status: {sig.status}<br />
                Change in: {sig.timer}s
              </Popup>
            </CircleMarker>
          ))}

          {/* Moving Buses */}
          {buses.map((bus) => (
            <Marker
              key={bus.id}
              position={[bus.lat, bus.lng]}
              icon={createBusIcon(bus.color)}
            >
              <Popup className="bus-popup">
                <div className="popup-header" style={{ background: bus.color }}>
                  {bus.name}
                </div>
                <div className="popup-body">
                  <p><strong>Status:</strong> <span className={bus.status === "Moving" ? "status-moving" : "status-stopped"}>{bus.status}</span></p>
                  <p><strong>Speed:</strong> {bus.speed} km/h</p>
                  <p><strong>Next Stop:</strong> BIT Campus</p>
                  <p><strong>ETA:</strong> {Math.floor((1 - bus.progress) * 15 + 2)} mins</p>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}
