import BusInfo from "../components/BusInfo";
import RouteInfo from "../components/RouteInfo";
import DriverInfo from "../components/DriverInfo";
import MapSection from "../components/MapSection";
import WeatherInfo from "../components/WeatherInfo";
import Notifications from "../components/Notifications";
import AdminControls from "../components/AdminControls";
import AttendanceSummary from "../components/AttendanceSummary";

export default function AdminDashboard() {
  return (
    <div className="dashboard">
      <h2>🛠️ Admin Dashboard</h2>
      <BusInfo />
      <RouteInfo />
      <DriverInfo />
      <WeatherInfo />
      <MapSection />
      <Notifications />
      <AdminControls />
      <AttendanceSummary />
    </div>
  );
}
