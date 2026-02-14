import Navigation from "../components/Navigation";
import BusInfo from "../components/BusInfo";
import RouteInfo from "../components/RouteInfo";
import DriverInfo from "../components/DriverInfo";
import MapSection from "../components/MapSection";
import WeatherInfo from "../components/WeatherInfo";
import Notifications from "../components/Notifications";
import AttendanceSummary from "../components/AttendanceSummary";
import SupportSection from "../components/SupportSection";

export default function TeacherDashboard() {
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

                    <div id="attendance-section">
                        <AttendanceSummary />
                    </div>

                    {/* FULL WIDTH WEATHER SECTION */}
                    <div className="weather-card">
                        <WeatherInfo allowEdit={false} />
                    </div>

                    {/* FULL WIDTH MAP SECTION */}
                    <div id="map-section" className="map-card"><MapSection /></div>

                    <div id="notification-section">
                        <Notifications />
                    </div>

                    <div id="support-section">
                        <SupportSection />
                    </div>
                </div>
            </div>
        </>
    );
}
