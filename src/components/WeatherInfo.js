import React, { useEffect, useState } from "react";
import { getWeatherUpdate, updateWeather } from "../services/api";

const CONDITIONS = [
  "Sunny",
  "Partly Cloudy",
  "Cloudy",
  "Light Rain",
  "Heavy Rain",
  "Foggy",
  "Storm"
];

const CONDITION_ICON = {
  Sunny: "☀️",
  "Partly Cloudy": "⛅",
  Cloudy: "☁️",
  "Light Rain": "🌧️",
  "Heavy Rain": "⛈️",
  Foggy: "🌫️",
  Storm: "🌩️"
};

export default function WeatherInfo({ allowEdit = false, coloredHeader = false }) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [weather, setWeather] = useState({
    condition: "Sunny",
    note: "",
    etaMinutes: 0,
    updatedByName: "",
    updatedByRole: "",
    updatedAt: null
  });
  const [form, setForm] = useState({
    condition: "Sunny",
    note: "",
    etaMinutes: 0
  });

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getWeatherUpdate();
        setWeather(data);
        setForm({
          condition: data.condition || "Sunny",
          note: data.note || "",
          etaMinutes: data.etaMinutes || 0
        });
      } catch (err) {
        setError(err?.message || "Unable to load weather update");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const updated = await updateWeather({
        condition: form.condition,
        note: form.note,
        etaMinutes: form.etaMinutes,
        updatedByName: user.name || "Driver"
      });
      setWeather(updated);
    } catch (err) {
      setError(err?.message || "Failed to update weather");
    } finally {
      setSaving(false);
    }
  };

  const updatedAt = weather.updatedAt ? new Date(weather.updatedAt) : null;

  return (
    <div className={`card weather-card ${coloredHeader ? "teacher-gradient-card" : ""}`}>
      {coloredHeader ? (
        <div className="teacher-gradient-header">
          <h3 style={{ margin: 0, border: "none", padding: 0, color: "white" }}>🌦️ Weather & Delay Update</h3>
        </div>
      ) : (
        <h3>🌦️ Weather & Delay Update</h3>
      )}

      {loading ? (
        <p style={{ color: "#707eae" }}>Loading weather update...</p>
      ) : (
        <>
          <div style={{ fontSize: "32px", margin: "12px 0", textAlign: "center" }}>
            {CONDITION_ICON[weather.condition] || "🌦️"} {weather.condition}
          </div>

          <div style={{ textAlign: "center", marginTop: "0.5rem" }}>
            <p style={{ margin: "6px 0" }}>
              <strong>🕒 Bus ETA:</strong> {Number(weather.etaMinutes) || 0} min
            </p>
            <p style={{ margin: "6px 0", color: "#707eae" }}>
              {weather.note || "No additional notes."}
            </p>
            {updatedAt && (
              <p style={{ margin: "6px 0", fontSize: "0.8rem", color: "#94a3b8" }}>
                Updated by {weather.updatedByName || "Driver"} ({weather.updatedByRole || "driver"}) •{" "}
                {updatedAt.toLocaleString()}
              </p>
            )}
          </div>
        </>
      )}

      {allowEdit && (
        <form onSubmit={handleSubmit} style={{ marginTop: "1rem" }}>
          <div className="form-group">
            <label>Weather Condition</label>
            <select
              value={form.condition}
              onChange={(e) => setForm({ ...form, condition: e.target.value })}
            >
              {CONDITIONS.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Bus ETA (minutes)</label>
            <input
              type="number"
              min="0"
              value={form.etaMinutes}
              onChange={(e) => setForm({ ...form, etaMinutes: Number(e.target.value) })}
            />
          </div>

          <div className="form-group">
            <label>Driver Note</label>
            <textarea
              rows={3}
              value={form.note}
              onChange={(e) => setForm({ ...form, note: e.target.value })}
              placeholder="Rainy, bus will reach in 10 minutes."
            />
          </div>

          {error && <p style={{ color: "#e53e3e", marginTop: "0.5rem" }}>{error}</p>}

          <button className="primary" type="submit" disabled={saving}>
            {saving ? "Updating..." : "Publish Update"}
          </button>
        </form>
      )}
    </div>
  );
}
