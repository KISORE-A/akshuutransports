import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import BusInfo from "../components/BusInfo";
import RouteInfo from "../components/RouteInfo";
import DriverInfo from "../components/DriverInfo";
import MapSection from "../components/MapSection";
import WeatherInfo from "../components/WeatherInfo";
import Notifications from "../components/Notifications";
import AttendanceDriver from "../components/AttendanceDriver";
import AttendanceSummary from "../components/AttendanceSummary";

export default function DriverDashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "Driver" && role !== "Admin") {
      navigate("/");
    }
  }, [navigate]);

  return (
    <div className="dashboard">
      <h2>🚌 Driver Dashboard</h2>

      <BusInfo />
      <RouteInfo />
      <DriverInfo />
      <WeatherInfo />
      <MapSection />
      <Notifications />
      <AttendanceDriver />
      <AttendanceSummary />
    </div>
  );
}
