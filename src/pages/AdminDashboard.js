import Navigation from "../components/Navigation";
import BusInfo from "../components/BusInfo";
import RouteInfo from "../components/RouteInfo";
import DriverInfo from "../components/DriverInfo";
import MapSection from "../components/MapSection";
import WeatherInfo from "../components/WeatherInfo";
import Notifications from "../components/Notifications";
import AdminControls from "../components/AdminControls";
import AttendanceSummary from "../components/AttendanceSummary";
import SupportSection from "../components/SupportSection";

export default function AdminDashboard() {
  return (
    <>
      <Navigation />
      <div className="dashboard-wrapper" id="top">
        <div className="dashboard">
          <div className="dashboard-tri-row" id="profile-section">
            <BusInfo />
            <div id="route-section"><RouteInfo /></div>
            <DriverInfo />
          </div>

          <AttendanceSummary />

          {/* FULL WIDTH WEATHER SECTION */}
          <div className="weather-card">
            <WeatherInfo allowEdit={false} />
          </div>

          {/* FULL WIDTH MAP SECTION */}
          <div id="map-section" className="map-card"><MapSection /></div>

          <div id="notification-section">
            <Notifications />
          </div>

          <div id="attendance-section">
            <AdminControls />
          </div>
          <div id="support-section">
            <SupportSection />
          </div>
        </div>
      </div>
    </>
  );
}
