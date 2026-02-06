import BusInfo from "../components/BusInfo";
import RouteInfo from "../components/RouteInfo";
import DriverInfo from "../components/DriverInfo";
import MapSection from "../components/MapSection";
import WeatherInfo from "../components/WeatherInfo";
import Notifications from "../components/Notifications";
import AttendanceStudent from "../components/AttendanceStudent";
import AttendanceSummary from "../components/AttendanceSummary";

export default function StudentDashboard() {
  return (
    <div className="dashboard">
      <h2>🎓 Student Dashboard</h2>
      <BusInfo />
      <RouteInfo />
      <DriverInfo />
      <WeatherInfo />
      <MapSection />
      <Notifications />
      <AttendanceStudent />
      <AttendanceSummary forUser={true} />
    </div>
  );
}
