import React, { useState } from "react";

const weatherConditions = [
  { status: "☀️ Sunny", temp: 32, humidity: 45, wind: 5, delay: 0 },
  { status: "⛅ Partly Cloudy", temp: 28, humidity: 55, wind: 8, delay: 2 },
  { status: "☁️ Cloudy", temp: 25, humidity: 65, wind: 10, delay: 3 },
  { status: "🌧️ Light Rain", temp: 22, humidity: 75, wind: 15, delay: 5 },
  { status: "⛈️ Heavy Rain", temp: 20, humidity: 90, wind: 25, delay: 15 },
  { status: "🌫️ Foggy", temp: 18, humidity: 85, wind: 5, delay: 10 },
];

export default function WeatherInfo() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const weather = weatherConditions[selectedIndex];

  const handleWeatherChange = (e) => {
    setSelectedIndex(parseInt(e.target.value));
    // Save to localStorage so all dashboards show the same weather
    localStorage.setItem("currentWeather", e.target.value);
  };

  // Load saved weather from localStorage on first render
  React.useEffect(() => {
    const saved = localStorage.getItem("currentWeather");
    if (saved) setSelectedIndex(parseInt(saved));
  }, []);

  return (
    <div className="card">
      <h3>🌦️ Weather Condition</h3>
      
      <div style={{ marginBottom: "12px" }}>
        <label style={{ display: "block", marginBottom: "6px", fontWeight: "bold" }}>
          Current Weather:
        </label>
        <select
          value={selectedIndex}
          onChange={handleWeatherChange}
          style={{ width: "100%", padding: "8px", fontSize: "14px" }}
        >
          {weatherConditions.map((w, idx) => (
            <option key={idx} value={idx}>
              {w.status}
            </option>
          ))}
        </select>
      </div>

      <div style={{ fontSize: "32px", margin: "12px 0", textAlign: "center" }}>
        {weather.status}
      </div>
      
      <p>
        <strong>🌡️ Temperature:</strong> {weather.temp}°C
      </p>
      <p>
        <strong>💧 Humidity:</strong> {weather.humidity}%
      </p>
      <p>
        <strong>💨 Wind Speed:</strong> {weather.wind} km/h
      </p>
      <p style={{ color: weather.delay > 5 ? "#d9534f" : "#5cb85c", fontWeight: "bold" }}>
        <strong>⏱️ Est. Delay:</strong> +{weather.delay} min
      </p>
    </div>
  );
}
