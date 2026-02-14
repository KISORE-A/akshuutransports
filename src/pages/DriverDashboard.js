import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Navigation from "../components/Navigation";
import BusInfo from "../components/BusInfo";
import RouteInfo from "../components/RouteInfo";
import DriverInfo from "../components/DriverInfo";
import MapSection from "../components/MapSection";
import DriverTracking from "../components/DriverTracking"; // New
import WeatherInfo from "../components/WeatherInfo";
import Notifications from "../components/Notifications";
import AttendanceDriver from "../components/AttendanceDriver";
import AttendanceSummary from "../components/AttendanceSummary";
import SupportSection from "../components/SupportSection";

export default function DriverDashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    const userStr = localStorage.getItem("user");
    const role = userStr ? JSON.parse(userStr).role : null;
    if (role !== "driver" && role !== "admin") {
      // navigate("/"); // Commented out for easier testing if role is different
    }
  }, [navigate]);

  return (
    <>
      <Navigation />
      <div className="dashboard-wrapper" id="top">
        <div className="dashboard">
          <div id="profile-section"><DriverTracking /></div>

          <div className="dashboard-tri-row">
            <BusInfo />
            <div id="route-section"><RouteInfo /></div>
            <DriverInfo />
          </div>

          <AttendanceSummary />

          {/* SEPARATE FULL-WIDTH WEATHER SECTION */}
          <div className="weather-card">
            <WeatherInfo />
          </div>

          {/* SEPARATE FULL-WIDTH MAP SECTION */}
          <div id="map-section" className="map-card"><MapSection /></div>

          <div id="notification-section">
            <Notifications />
          </div>

          <div id="attendance-section">
            <AttendanceDriver />
          </div>

          <div id="support-section">
            <SupportSection />
          </div>
        </div>
      </div>
    </>
  );
}
